from typing import Optional, List
from sqlalchemy.orm import Session
from app.models.document import UploadedDocument
from app.models.enums import DocumentType, DocumentStatus
from app.repositories.base import BaseRepository

class DocumentRepository(BaseRepository[UploadedDocument]):
    def __init__(self, db: Session):
        super().__init__(UploadedDocument, db)

    def get_by_student_id(self, student_id: int) -> List[UploadedDocument]:
        return self.db.query(UploadedDocument).filter(UploadedDocument.student_id == student_id).all()

    def get_by_student_and_type(self, student_id: int, doc_type: DocumentType) -> Optional[UploadedDocument]:
        return self.db.query(UploadedDocument).filter(
            UploadedDocument.student_id == student_id,
            UploadedDocument.document_type == doc_type
        ).first()

    def count_by_status(self, status: DocumentStatus) -> int:
        return self.db.query(UploadedDocument).filter(UploadedDocument.ocr_verified_status == status).count()
