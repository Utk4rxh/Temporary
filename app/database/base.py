# Import all models so Alembic / SQLAlchemy detects them
from app.database.session import Base
from app.models.user import User
from app.models.admin import Admin
from app.models.student import Student
from app.models.family import FamilyDetails
from app.models.document import UploadedDocument
from app.models.application import ScholarshipApplication
from app.models.result import ScholarshipResult
