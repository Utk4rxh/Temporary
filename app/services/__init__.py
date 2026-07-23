from app.services.auth_service import AuthService
from app.services.student_service import StudentService
from app.services.application_service import ApplicationService
from app.services.document_service import DocumentService
from app.services.ocr_service import OCRService
from app.services.ml_service import MLService
from app.services.scholarship_service import ScholarshipService
from app.services.admin_service import AdminService

__all__ = [
    "AuthService",
    "StudentService",
    "ApplicationService",
    "DocumentService",
    "OCRService",
    "MLService",
    "ScholarshipService",
    "AdminService",
]
