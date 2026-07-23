from typing import Optional, Any, Dict
from datetime import datetime
from pydantic import BaseModel
from app.models.enums import DocumentType, DocumentStatus

class DocumentRead(BaseModel):
    id: int
    student_id: int
    document_type: DocumentType
    file_path: str
    file_name: str
    ocr_extracted_data: Optional[Dict[str, Any]] = None
    ocr_verified_status: DocumentStatus
    mismatch_reason: Optional[str] = None
    uploaded_at: datetime

    class Config:
        from_attributes = True

class DocumentVerificationUpdate(BaseModel):
    document_id: int
    status: DocumentStatus
    mismatch_reason: Optional[str] = None
