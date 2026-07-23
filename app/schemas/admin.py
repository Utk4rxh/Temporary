from typing import Dict, Any, List, Optional
from pydantic import BaseModel

class AdminDashboardResponse(BaseModel):
    total_students: int
    total_applications: int
    verified_documents: int
    pending_verification: int
    fraud_flags: int  # Mismatch under review
    budget_used: float
    budget_remaining: float
    scholarship_distribution: Dict[str, int]

class AdminVerifyRequest(BaseModel):
    document_id: int
    approved: bool
    reason: Optional[str] = None

class ReportSummaryResponse(BaseModel):
    total_students: int
    applications_by_status: Dict[str, int]
    category_breakdown: Dict[str, int]
    avg_ai_score: float
    total_scholarship_disbursed: float
