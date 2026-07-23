from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field
from app.models.enums import ApplicationStatus
from app.schemas.result import ResultRead

class ApplicationCreate(BaseModel):
    cgpa: float = Field(..., ge=0.0, le=10.0)
    attendance_percentage: float = Field(..., ge=0.0, le=100.0)
    previous_percentage: float = Field(..., ge=0.0, le=100.0)
    study_hours_per_day: float = Field(..., ge=0.0, le=24.0)

class ApplicationRead(BaseModel):
    id: int
    student_id: int
    cgpa: float
    attendance_percentage: float
    previous_percentage: float
    study_hours_per_day: float
    status: ApplicationStatus
    created_at: datetime
    updated_at: datetime
    result: Optional[ResultRead] = None

    class Config:
        from_attributes = True

class ApplicationStatusRead(BaseModel):
    application_id: int
    student_id: int
    status: ApplicationStatus
    updated_at: datetime
    ocr_mismatch_flag: bool = False
    mismatch_details: Optional[str] = None
