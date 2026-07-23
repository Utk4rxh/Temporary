from typing import Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.dependencies.db import get_db
from app.dependencies.auth import get_current_admin
from app.schemas.admin import AdminDashboardResponse, AdminVerifyRequest, ReportSummaryResponse
from app.schemas.budget import BudgetAllocationRequest, BudgetAllocationResponse
from app.schemas.student import StudentRead
from app.schemas.application import ApplicationRead
from app.schemas.document import DocumentRead
from app.schemas.common import StandardResponse, PaginatedResponse, PaginationMeta
from app.services.admin_service import AdminService
from app.services.student_service import StudentService
from app.services.application_service import ApplicationService
from app.repositories.application_repository import ApplicationRepository
from app.models.enums import ApplicationStatus
from app.models.user import User

router = APIRouter(prefix="/admin", tags=["Admin Operations"])

@router.get("/dashboard", response_model=StandardResponse[AdminDashboardResponse])
def get_admin_dashboard(
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    admin_service = AdminService(db)
    metrics = admin_service.get_dashboard_metrics()
    return StandardResponse(
        success=True,
        message="Admin dashboard statistics retrieved",
        data=metrics
    )

@router.get("/students", response_model=StandardResponse[PaginatedResponse[StudentRead]])
def get_all_students(
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=100),
    search: Optional[str] = None,
    category: Optional[str] = None,
    state: Optional[str] = None,
    is_disabled: Optional[bool] = None,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    student_service = StudentService(db)
    students, total = student_service.list_students(
        page=page, page_size=page_size, search=search, category=category, state=state, is_disabled=is_disabled
    )
    total_pages = (total + page_size - 1) // page_size if total > 0 else 0

    return StandardResponse(
        success=True,
        message="Students list retrieved",
        data=PaginatedResponse(
            items=[StudentRead.from_orm(s) for s in students],
            pagination=PaginationMeta(
                total=total, page=page, page_size=page_size, total_pages=total_pages
            )
        )
    )

@router.get("/applications", response_model=StandardResponse[PaginatedResponse[ApplicationRead]])
def get_all_applications(
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=100),
    status_filter: Optional[ApplicationStatus] = None,
    min_cgpa: Optional[float] = None,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    app_repo = ApplicationRepository(db)
    skip = (page - 1) * page_size
    applications, total = app_repo.list_filtered(skip=skip, limit=page_size, status=status_filter, min_cgpa=min_cgpa)
    total_pages = (total + page_size - 1) // page_size if total > 0 else 0

    return StandardResponse(
        success=True,
        message="Applications list retrieved",
        data=PaginatedResponse(
            items=[ApplicationRead.from_orm(a) for a in applications],
            pagination=PaginationMeta(
                total=total, page=page, page_size=page_size, total_pages=total_pages
            )
        )
    )

@router.post("/verify", response_model=StandardResponse[DocumentRead])
def verify_document_manually(
    verify_req: AdminVerifyRequest,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    admin_service = AdminService(db)
    doc = admin_service.verify_document_manually(
        doc_id=verify_req.document_id,
        approved=verify_req.approved,
        reason=verify_req.reason
    )
    return StandardResponse(
        success=True,
        message=f"Document manual verification updated to: {doc.ocr_verified_status.value}",
        data=DocumentRead.from_orm(doc)
    )

@router.post("/budget", response_model=StandardResponse[BudgetAllocationResponse])
def trigger_budget_allocation(
    budget_req: BudgetAllocationRequest,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    admin_service = AdminService(db)
    allocation_res = admin_service.allocate_budget(budget_req)
    return StandardResponse(
        success=True,
        message="Scholarship budget allocation process executed successfully",
        data=allocation_res
    )

@router.get("/reports", response_model=StandardResponse[ReportSummaryResponse])
def get_system_reports(
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    admin_service = AdminService(db)
    report = admin_service.get_report_summary()
    return StandardResponse(
        success=True,
        message="Platform system report summary retrieved",
        data=report
    )
