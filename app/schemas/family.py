from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field

class FamilyBase(BaseModel):
    father_name: Optional[str] = None
    father_occupation: Optional[str] = None
    mother_name: Optional[str] = None
    mother_occupation: Optional[str] = None
    annual_income: float = Field(default=0.0, ge=0.0)
    family_size: int = Field(default=1, ge=1)
    earning_members: int = Field(default=1, ge=1)
    internet_access: bool = True
    laptop_available: bool = True

class FamilyCreate(FamilyBase):
    pass

class FamilyUpdate(BaseModel):
    father_name: Optional[str] = None
    father_occupation: Optional[str] = None
    mother_name: Optional[str] = None
    mother_occupation: Optional[str] = None
    annual_income: Optional[float] = Field(None, ge=0.0)
    family_size: Optional[int] = Field(None, ge=1)
    earning_members: Optional[int] = Field(None, ge=1)
    internet_access: Optional[bool] = None
    laptop_available: Optional[bool] = None

class FamilyRead(FamilyBase):
    id: int
    student_id: int
    created_at: datetime

    class Config:
        from_attributes = True
