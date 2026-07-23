from sqlalchemy.orm import Session
from app.repositories.document_repository import DocumentRepository
from app.repositories.student_repository import StudentRepository, FamilyRepository
from app.repositories.application_repository import ApplicationRepository
from app.models.enums import DocumentStatus, ApplicationStatus, DocumentType
from app.utils.ocr import perform_ocr_extraction, compare_ocr_data

class OCRService:
    def __init__(self, db: Session):
        self.db = db
        self.doc_repo = DocumentRepository(db)
        self.student_repo = StudentRepository(db)
        self.family_repo = FamilyRepository(db)
        self.app_repo = ApplicationRepository(db)

    def process_and_verify_document(self, document_id: int):
        doc = self.doc_repo.get(document_id)
        if not doc:
            return

        # 1. Perform OCR extraction
        ocr_result = perform_ocr_extraction(doc.file_path)
        doc.ocr_extracted_data = ocr_result

        # 2. Get student and family information to compare against
        student = self.student_repo.get(doc.student_id)
        family = self.family_repo.get_by_student_id(doc.student_id) if student else None

        expected_name = student.full_name if student else ""
        expected_income = family.annual_income if family else 0.0

        # 3. Compare extracted data
        is_mismatch, mismatch_reason = compare_ocr_data(
            ocr_data=ocr_result,
            expected_name=expected_name,
            expected_income=expected_income
        )

        # 4. Update Document & Application status
        if is_mismatch:
            doc.ocr_verified_status = DocumentStatus.MISMATCH_UNDER_REVIEW
            doc.mismatch_reason = mismatch_reason

            # Update student application to UNDER_REVIEW (do NOT automatically reject)
            app = self.app_repo.get_by_student_id(doc.student_id)
            if app and app.status != ApplicationStatus.ALLOCATED:
                app.status = ApplicationStatus.UNDER_REVIEW
                self.app_repo.update(app, {"status": ApplicationStatus.UNDER_REVIEW})
        else:
            doc.ocr_verified_status = DocumentStatus.VERIFIED
            doc.mismatch_reason = None

        self.doc_repo.update(doc, {
            "ocr_extracted_data": ocr_result,
            "ocr_verified_status": doc.ocr_verified_status,
            "mismatch_reason": doc.mismatch_reason
        })
        return doc
