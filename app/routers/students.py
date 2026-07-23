from typing import Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.dependencies.db import get_db
from app.dependencies.auth import get_current_user, get_current_student
from app.schemas.student import StudentRead, StudentUpdate
from app.schemas.common import StandardResponse, PaginatedResponse, PaginationMeta
from app.services.student_service import StudentService
from app.models.user import User

router = APIRouter(prefix="/students", tags=["Students"])

@router.get("/", response_model=StandardResponse[PaginatedResponse[StudentRead]])
def list_students(
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=100),
    search: Optional[str] = None,
    category: Optional[str] = None,
    state: Optional[str] = None,
    is_disabled: Optional[bool] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    student_service = StudentService(db)
    students, total = student_service.list_students(
        page=page, page_size=page_size, search=search, category=category, state=state, is_disabled=is_disabled
    )
    total_pages = (total + page_size - 1) // page_size if total > 0 else 0

    return StandardResponse(
        success=True,
        message="Students retrieved successfully",
        data=PaginatedResponse(
            items=[StudentRead.from_orm(s) for s in students],
            pagination=PaginationMeta(
                total=total,
                page=page,
                page_size=page_size,
                total_pages=total_pages
            )
        )
    )

@router.get("/me", response_model=StandardResponse[StudentRead])
def get_my_student_profile(
    current_user: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    student_service = StudentService(db)
    student = student_service.get_by_user_id(current_user.id)
    return StandardResponse(
        success=True,
        message="Student profile retrieved",
        data=StudentRead.from_orm(student)
    )

@router.get("/{id}", response_model=StandardResponse[StudentRead])
def get_student_by_id(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    student_service = StudentService(db)
    student = student_service.get_by_id(id)
    return StandardResponse(
        success=True,
        message="Student retrieved successfully",
        data=StudentRead.from_orm(student)
    )

@router.put("/update", response_model=StandardResponse[StudentRead])
def update_student_profile(
    student_data: StudentUpdate,
    current_user: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    student_service = StudentService(db)
    student = student_service.create_or_update_profile(current_user.id, student_data)
    return StandardResponse(
        success=True,
        message="Student profile updated successfully",
        data=StudentRead.from_orm(student)
    )
