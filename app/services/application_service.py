from typing import Optional, List, Tuple
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.repositories.application_repository import ApplicationRepository
from app.repositories.student_repository import StudentRepository, FamilyRepository
from app.repositories.document_repository import DocumentRepository
from app.models.application import ScholarshipApplication
from app.models.enums import ApplicationStatus, DocumentStatus
from app.schemas.application import ApplicationCreate, ApplicationStatusRead

class ApplicationService:
    def __init__(self, db: Session):
        self.db = db
        self.app_repo = ApplicationRepository(db)
        self.student_repo = StudentRepository(db)
        self.family_repo = FamilyRepository(db)
        self.doc_repo = DocumentRepository(db)

    def create_application(self, user_id: int, app_data: ApplicationCreate) -> ScholarshipApplication:
        student = self.student_repo.get_by_user_id(user_id)
        if not student:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Student profile must be created before submitting application"
            )

        # Check if student already has an active application
        existing_app = self.app_repo.get_by_student_id(student.id)
        if existing_app and existing_app.status in [ApplicationStatus.SUBMITTED, ApplicationStatus.UNDER_REVIEW, ApplicationStatus.APPROVED, ApplicationStatus.ALLOCATED]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"An active application already exists with status: {existing_app.status.value}"
            )

        # Check document OCR status for mismatch
        documents = self.doc_repo.get_by_student_id(student.id)
        has_mismatch = any(d.ocr_verified_status == DocumentStatus.MISMATCH_UNDER_REVIEW for d in documents)
        initial_status = ApplicationStatus.UNDER_REVIEW if has_mismatch else ApplicationStatus.SUBMITTED

        application = ScholarshipApplication(
            student_id=student.id,
            cgpa=app_data.cgpa,
            attendance_percentage=app_data.attendance_percentage,
            previous_percentage=app_data.previous_percentage,
            study_hours_per_day=app_data.study_hours_per_day,
            status=initial_status
        )
        return self.app_repo.create(application)

    def get_latest_status(self, user_id: int) -> ApplicationStatusRead:
        student = self.student_repo.get_by_user_id(user_id)
        if not student:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Student profile not found"
            )

        app = self.app_repo.get_by_student_id(student.id)
        if not app:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No scholarship application found"
            )

        documents = self.doc_repo.get_by_student_id(student.id)
        mismatch_docs = [d for d in documents if d.ocr_verified_status == DocumentStatus.MISMATCH_UNDER_REVIEW]
        has_mismatch = len(mismatch_docs) > 0
        mismatch_details = " | ".join([d.mismatch_reason for d in mismatch_docs if d.mismatch_reason]) if has_mismatch else None

        return ApplicationStatusRead(
            application_id=app.id,
            student_id=student.id,
            status=app.status,
            updated_at=app.updated_at,
            ocr_mismatch_flag=has_mismatch,
            mismatch_details=mismatch_details
        )

    def get_application_history(self, user_id: int) -> List[ScholarshipApplication]:
        student = self.student_repo.get_by_user_id(user_id)
        if not student:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Student profile not found"
            )
        return self.app_repo.get_all_by_student_id(student.id)
