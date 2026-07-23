from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.dependencies.db import get_db
from app.dependencies.auth import get_current_student
from app.schemas.application import ApplicationCreate, ApplicationRead, ApplicationStatusRead
from app.schemas.common import StandardResponse
from app.services.application_service import ApplicationService
from app.models.user import User

router = APIRouter(prefix="/applications", tags=["Applications"])

@router.post("/create", response_model=StandardResponse[ApplicationRead], status_code=status.HTTP_201_CREATED)
def create_application(
    app_data: ApplicationCreate,
    current_user: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    app_service = ApplicationService(db)
    app = app_service.create_application(current_user.id, app_data)
    return StandardResponse(
        success=True,
        message="Scholarship application submitted successfully",
        data=ApplicationRead.from_orm(app)
    )

@router.get("/status", response_model=StandardResponse[ApplicationStatusRead])
def get_application_status(
    current_user: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    app_service = ApplicationService(db)
    status_info = app_service.get_latest_status(current_user.id)
    return StandardResponse(
        success=True,
        message="Application status retrieved",
        data=status_info
    )

@router.get("/history", response_model=StandardResponse[List[ApplicationRead]])
def get_application_history(
    current_user: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    app_service = ApplicationService(db)
    history = app_service.get_application_history(current_user.id)
    return StandardResponse(
        success=True,
        message="Application history retrieved",
        data=[ApplicationRead.from_orm(a) for a in history]
    )
