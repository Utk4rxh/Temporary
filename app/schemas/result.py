from typing import Optional
from datetime import datetime
from pydantic import BaseModel
from app.models.enums import AllocationStatus

class ResultRead(BaseModel):
    id: int
    application_id: int
    financial_need_index: float
    merit_index: float
    ai_priority_score: float
    recommended: bool
    scholarship_amount: float
    explanation: str
    allocation_status: AllocationStatus
    allocated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class AIExplanationResponse(BaseModel):
    application_id: int
    financial_need_index: float
    merit_index: float
    ai_priority_score: float
    recommended: bool
    scholarship_amount: float
    explanation: str
