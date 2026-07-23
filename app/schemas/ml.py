from typing import Union
from pydantic import BaseModel, Field

class MLPredictRequest(BaseModel):
    cgpa: float = Field(..., ge=0.0, le=10.0)
    attendance: float = Field(..., ge=0.0, le=100.0)
    annual_income: float = Field(..., ge=0.0)
    family_size: int = Field(..., ge=1)
    earning_members: int = Field(..., ge=1)
    internet_access: Union[str, bool]
    laptop_available: Union[str, bool]
    study_hours: float = Field(..., ge=0.0, le=24.0)
    previous_percentage: float = Field(..., ge=0.0, le=100.0)

class MLPredictResponse(BaseModel):
    financial_need_index: float
    merit_index: float
    ai_priority_score: float
    recommended: bool
    scholarship_amount: float
    explanation: str
