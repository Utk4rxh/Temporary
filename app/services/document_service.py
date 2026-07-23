import os
import uuid
from typing import List
from sqlalchemy.orm import Session
from fastapi import UploadFile, HTTPException, status
from app.config.settings import settings
from app.repositories.document_repository import DocumentRepository
from app.repositories.student_repository import StudentRepository
from app.models.document import UploadedDocument
from app.models.enums import DocumentType, DocumentStatus
from app.services.ocr_service import OCRService

class DocumentService:
    def __init__(self, db: Session):
        self.db = db
        self.doc_repo = DocumentRepository(db)
        self.student_repo = StudentRepository(db)
        self.ocr_service = OCRService(db)

    def upload_document(
        self,
        user_id: int,
        document_type: DocumentType,
        file: UploadFile
    ) -> UploadedDocument:
        student = self.student_repo.get_by_user_id(user_id)
        if not student:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Student profile must be created before uploading documents"
            )

        # Map document_type to subdirectory: income/, marksheets/, disability/
        type_subdir_map = {
            DocumentType.INCOME_CERTIFICATE: "income",
            DocumentType.MARKSHEET: "marksheets",
            DocumentType.DISABILITY_CERTIFICATE: "disability"
        }
        sub_folder = type_subdir_map.get(document_type, "other")
        target_dir = os.path.join(settings.UPLOAD_DIR, sub_folder)
        os.makedirs(target_dir, exist_ok=True)

        # Generate unique filename
        ext = os.path.splitext(file.filename)[1]
        unique_name = f"{uuid.uuid4().hex}{ext}"
        file_path = os.path.join(target_dir, unique_name)

        # Save file to disk
        with open(file_path, "wb") as buffer:
            buffer.write(file.file.read())

        # Check existing document of same type
        existing = self.doc_repo.get_by_student_and_type(student.id, document_type)
        if existing:
            # Overwrite existing record
            existing.file_path = file_path
            existing.file_name = file.filename
            existing.ocr_verified_status = DocumentStatus.PENDING
            doc = self.doc_repo.update(existing, {
                "file_path": file_path,
                "file_name": file.filename,
                "ocr_verified_status": DocumentStatus.PENDING
            })
        else:
            doc = UploadedDocument(
                student_id=student.id,
                document_type=document_type,
                file_path=file_path,
                file_name=file.filename,
                ocr_verified_status=DocumentStatus.PENDING
            )
            doc = self.doc_repo.create(doc)

        # Execute OCR processing and auto verification
        verified_doc = self.ocr_service.process_and_verify_document(doc.id)
        return verified_doc or doc

    def get_student_documents(self, user_id: int) -> List[UploadedDocument]:
        student = self.student_repo.get_by_user_id(user_id)
        if not student:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Student profile not found"
            )
        return self.doc_repo.get_by_student_id(student.id)
