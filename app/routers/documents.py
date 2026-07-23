from typing import List
from fastapi import APIRouter, Depends, UploadFile, File, Form, status
from sqlalchemy.orm import Session
from app.dependencies.db import get_db
from app.dependencies.auth import get_current_student
from app.schemas.document import DocumentRead
from app.schemas.common import StandardResponse
from app.services.document_service import DocumentService
from app.models.enums import DocumentType
from app.models.user import User

router = APIRouter(prefix="/documents", tags=["Documents"])

@router.post("/upload", response_model=StandardResponse[DocumentRead], status_code=status.HTTP_201_CREATED)
def upload_document(
    document_type: DocumentType = Form(...),
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    doc_service = DocumentService(db)
    doc = doc_service.upload_document(current_user.id, document_type, file)
    return StandardResponse(
        success=True,
        message=f"Document '{document_type.value}' uploaded and OCR verified. Status: {doc.ocr_verified_status.value}",
        data=DocumentRead.from_orm(doc)
    )

@router.get("/status", response_model=StandardResponse[List[DocumentRead]])
def get_documents_status(
    current_user: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    doc_service = DocumentService(db)
    docs = doc_service.get_student_documents(current_user.id)
    return StandardResponse(
        success=True,
        message="Uploaded documents status retrieved",
        data=[DocumentRead.from_orm(d) for d in docs]
    )
