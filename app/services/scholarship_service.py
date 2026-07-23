from datetime import datetime
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.repositories.application_repository import ApplicationRepository
from app.repositories.student_repository import StudentRepository, FamilyRepository
from app.repositories.scholarship_repository import ScholarshipRepository
from app.models.result import ScholarshipResult
from app.models.enums import AllocationStatus
from app.schemas.ml import MLPredictRequest
from app.services.ml_service import MLService
from app.schemas.result import AIExplanationResponse

class ScholarshipService:
    def __init__(self, db: Session):
        self.db = db
        self.app_repo = ApplicationRepository(db)
        self.student_repo = StudentRepository(db)
        self.family_repo = FamilyRepository(db)
        self.result_repo = ScholarshipRepository(db)

    def apply_and_evaluate(self, user_id: int) -> ScholarshipResult:
        student = self.student_repo.get_by_user_id(user_id)
        if not student:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Student profile not found"
            )

        family = self.family_repo.get_by_student_id(student.id)
        if not family:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Family financial details must be completed before applying for scholarship evaluation"
            )

        app = self.app_repo.get_by_student_id(student.id)
        if not app:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Scholarship application must be submitted before running AI evaluation"
            )

        # Build payload for ML predict from student raw input fields
        ml_payload = MLPredictRequest(
            cgpa=app.cgpa,
            attendance=app.attendance_percentage,
            annual_income=family.annual_income,
            family_size=family.family_size,
            earning_members=family.earning_members,
            internet_access=family.internet_access,
            laptop_available=family.laptop_available,
            study_hours=app.study_hours_per_day,
            previous_percentage=app.previous_percentage
        )

        # Send to ML Service
        ml_response = MLService.predict(ml_payload)

        # Check existing result
        existing_result = self.result_repo.get_by_application_id(app.id)
        if existing_result:
            existing_result.financial_need_index = ml_response.financial_need_index
            existing_result.merit_index = ml_response.merit_index
            existing_result.ai_priority_score = ml_response.ai_priority_score
            existing_result.recommended = ml_response.recommended
            existing_result.scholarship_amount = ml_response.scholarship_amount
            existing_result.explanation = ml_response.explanation
            result = self.result_repo.update(existing_result, existing_result.__dict__)
        else:
            result = ScholarshipResult(
                application_id=app.id,
                financial_need_index=ml_response.financial_need_index,
                merit_index=ml_response.merit_index,
                ai_priority_score=ml_response.ai_priority_score,
                recommended=ml_response.recommended,
                scholarship_amount=ml_response.scholarship_amount,
                explanation=ml_response.explanation,
                allocation_status=AllocationStatus.PENDING
            )
            result = self.result_repo.create(result)

        return result

    def get_student_result(self, user_id: int) -> ScholarshipResult:
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

        result = self.result_repo.get_by_application_id(app.id)
        if not result:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Scholarship evaluation result not generated yet. Trigger /scholarship/apply first."
            )

        return result

    def get_ai_explanation(self, user_id: int) -> AIExplanationResponse:
        result = self.get_student_result(user_id)
        return AIExplanationResponse(
            application_id=result.application_id,
            financial_need_index=result.financial_need_index,
            merit_index=result.merit_index,
            ai_priority_score=result.ai_priority_score,
            recommended=result.recommended,
            scholarship_amount=result.scholarship_amount,
            explanation=result.explanation
        )
