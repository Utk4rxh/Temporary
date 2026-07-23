from app.repositories.base import BaseRepository
from app.repositories.user_repository import UserRepository, AdminRepository
from app.repositories.student_repository import StudentRepository, FamilyRepository
from app.repositories.document_repository import DocumentRepository
from app.repositories.application_repository import ApplicationRepository
from app.repositories.scholarship_repository import ScholarshipRepository

__all__ = [
    "BaseRepository",
    "UserRepository",
    "AdminRepository",
    "StudentRepository",
    "FamilyRepository",
    "DocumentRepository",
    "ApplicationRepository",
    "ScholarshipRepository",
]
