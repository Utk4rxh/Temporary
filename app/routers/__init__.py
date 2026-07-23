from app.routers.auth import router as auth_router
from app.routers.students import router as students_router
from app.routers.applications import router as applications_router
from app.routers.documents import router as documents_router
from app.routers.scholarship import router as scholarship_router
from app.routers.admin import router as admin_router
from app.routers.ml import router as ml_router

__all__ = [
    "auth_router",
    "students_router",
    "applications_router",
    "documents_router",
    "scholarship_router",
    "admin_router",
    "ml_router",
]
