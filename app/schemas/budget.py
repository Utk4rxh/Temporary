from typing import List, Optional
from pydantic import BaseModel, Field

class BudgetAllocationRequest(BaseModel):
    total_budget: float = Field(..., gt=0.0)

class BudgetAllocatedStudent(BaseModel):
    student_id: int
    application_id: int
    full_name: str
    ai_priority_score: float
    scholarship_amount: float
    allocation_status: str

class BudgetAllocationResponse(BaseModel):
    total_budget_provided: float
    total_allocated: float
    remaining_budget: float
    total_applications_considered: int
    selected_count: int
    rejected_due_to_budget_count: int
    selected_students: List[BudgetAllocatedStudent]
    rejected_due_to_budget: List[BudgetAllocatedStudent]
