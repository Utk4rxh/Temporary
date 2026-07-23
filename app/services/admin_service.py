from datetime import datetime
from typing import Dict, Any, List
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from fastapi import HTTPException, status
from app.repositories.student_repository import StudentRepository
from app.repositories.application_repository import ApplicationRepository
from app.repositories.document_repository import DocumentRepository
from app.repositories.scholarship_repository import ScholarshipRepository
from app.models.enums import DocumentStatus, ApplicationStatus, AllocationStatus
from app.models.result import ScholarshipResult
from app.models.application import ScholarshipApplication
from app.models.student import Student
from app.schemas.admin import AdminDashboardResponse, ReportSummaryResponse
from app.schemas.budget import BudgetAllocationRequest, BudgetAllocationResponse, BudgetAllocatedStudent

class AdminService:
    def __init__(self, db: Session):
        self.db = db
        self.student_repo = StudentRepository(db)
        self.app_repo = ApplicationRepository(db)
        self.doc_repo = DocumentRepository(db)
        self.scholarship_repo = ScholarshipRepository(db)

    def get_dashboard_metrics(self) -> AdminDashboardResponse:
        total_students = self.student_repo.count()
        total_applications = self.app_repo.count()

        verified_docs = self.doc_repo.count_by_status(DocumentStatus.VERIFIED)
        pending_docs = self.doc_repo.count_by_status(DocumentStatus.PENDING)
        fraud_flags = self.doc_repo.count_by_status(DocumentStatus.MISMATCH_UNDER_REVIEW)

        # Budget used from allocated scholarships
        allocated_results = self.scholarship_repo.get_allocated_by_status(AllocationStatus.SELECTED)
        budget_used = sum(r.scholarship_amount for r in allocated_results)
        
        # Default target budget reference for display
        reference_budget = 1000000.0  # 10 Lakhs default pool
        budget_remaining = max(reference_budget - budget_used, 0.0)

        # Scholarship distribution by amount tier
        distribution = {
            "75k_tier": sum(1 for r in allocated_results if r.scholarship_amount >= 75000),
            "50k_tier": sum(1 for r in allocated_results if 50000 <= r.scholarship_amount < 75000),
            "25k_tier": sum(1 for r in allocated_results if 25000 <= r.scholarship_amount < 50000)
        }

        return AdminDashboardResponse(
            total_students=total_students,
            total_applications=total_applications,
            verified_documents=verified_docs,
            pending_verification=pending_docs,
            fraud_flags=fraud_flags,
            budget_used=budget_used,
            budget_remaining=budget_remaining,
            scholarship_distribution=distribution
        )

    def allocate_budget(self, request_data: BudgetAllocationRequest) -> BudgetAllocationResponse:
        total_budget = request_data.total_budget
        remaining_budget = total_budget

        # Fetch all scholarship results sorted by AI priority score descending
        results = self.db.query(ScholarshipResult).options(
            joinedload(ScholarshipResult.application).joinedload(ScholarshipApplication.student)
        ).order_by(ScholarshipResult.ai_priority_score.desc()).all()

        selected_students: List[BudgetAllocatedStudent] = []
        rejected_students: List[BudgetAllocatedStudent] = []

        total_allocated = 0.0

        for r in results:
            amount_needed = r.scholarship_amount
            student_name = r.application.student.full_name if (r.application and r.application.student) else "Unknown"

            if r.recommended and amount_needed > 0 and remaining_budget >= amount_needed:
                remaining_budget -= amount_needed
                total_allocated += amount_needed

                r.allocation_status = AllocationStatus.SELECTED
                r.allocated_at = datetime.utcnow()

                # Update application status to ALLOCATED
                if r.application:
                    r.application.status = ApplicationStatus.ALLOCATED

                item = BudgetAllocatedStudent(
                    student_id=r.application.student_id,
                    application_id=r.application_id,
                    full_name=student_name,
                    ai_priority_score=r.ai_priority_score,
                    scholarship_amount=amount_needed,
                    allocation_status="SELECTED"
                )
                selected_students.append(item)
            else:
                r.allocation_status = AllocationStatus.REJECTED_BUDGET
                r.allocated_at = datetime.utcnow()

                if r.application and r.application.status not in [ApplicationStatus.UNDER_REVIEW, ApplicationStatus.REJECTED]:
                    r.application.status = ApplicationStatus.REJECTED

                item = BudgetAllocatedStudent(
                    student_id=r.application.student_id if r.application else 0,
                    application_id=r.application_id,
                    full_name=student_name,
                    ai_priority_score=r.ai_priority_score,
                    scholarship_amount=amount_needed,
                    allocation_status="REJECTED_BUDGET"
                )
                rejected_students.append(item)

            self.db.add(r)

        self.db.commit()

        return BudgetAllocationResponse(
            total_budget_provided=total_budget,
            total_allocated=total_allocated,
            remaining_budget=remaining_budget,
            total_applications_considered=len(results),
            selected_count=len(selected_students),
            rejected_due_to_budget_count=len(rejected_students),
            selected_students=selected_students,
            rejected_due_to_budget=rejected_students
        )

    def verify_document_manually(self, doc_id: int, approved: bool, reason: str = None):
        doc = self.doc_repo.get(doc_id)
        if not doc:
            raise HTTPException(status_code=404, detail="Document not found")

        doc.ocr_verified_status = DocumentStatus.VERIFIED if approved else DocumentStatus.REJECTED
        doc.mismatch_reason = reason if not approved else None

        self.doc_repo.update(doc, {
            "ocr_verified_status": doc.ocr_verified_status,
            "mismatch_reason": doc.mismatch_reason
        })

        # Check if student application should be restored to SUBMITTED
        if approved:
            app = self.app_repo.get_by_student_id(doc.student_id)
            if app and app.status == ApplicationStatus.UNDER_REVIEW:
                app.status = ApplicationStatus.SUBMITTED
                self.app_repo.update(app, {"status": ApplicationStatus.SUBMITTED})

        return doc

    def get_report_summary(self) -> ReportSummaryResponse:
        total_students = self.student_repo.count()

        status_counts = {}
        for app_status in ApplicationStatus:
            status_counts[app_status.value] = self.app_repo.count_by_status(app_status)

        category_counts = {}
        categories = self.db.query(Student.category, func.count(Student.id)).group_by(Student.category).all()
        for cat, cnt in categories:
            if cat:
                category_counts[cat] = cnt

        avg_score_res = self.db.query(func.avg(ScholarshipResult.ai_priority_score)).scalar()
        avg_score = round(float(avg_score_res), 2) if avg_score_res else 0.0

        allocated_results = self.scholarship_repo.get_allocated_by_status(AllocationStatus.SELECTED)
        total_disbursed = sum(r.scholarship_amount for r in allocated_results)

        return ReportSummaryResponse(
            total_students=total_students,
            applications_by_status=status_counts,
            category_breakdown=category_counts,
            avg_ai_score=avg_score,
            total_scholarship_disbursed=total_disbursed
        )
