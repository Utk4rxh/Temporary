from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field
from app.schemas.family import FamilyRead, FamilyCreate, FamilyUpdate
from app.schemas.user import UserRead

class StudentBase(BaseModel):
    full_name: str = Field(..., min_length=2)
    phone: Optional[str] = None
    gender: Optional[str] = None
    dob: Optional[str] = None
    category: Optional[str] = "General"
    is_disabled: bool = False
    disability_percentage: float = Field(default=0.0, ge=0.0, le=100.0)
    address: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None

class StudentCreate(StudentBase):
    family_details: Optional[FamilyCreate] = None

class StudentUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    gender: Optional[str] = None
    dob: Optional[str] = None
    category: Optional[str] = None
    is_disabled: Optional[bool] = None
    disability_percentage: Optional[float] = Field(None, ge=0.0, le=100.0)
    address: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None
    family_details: Optional[FamilyUpdate] = None

class StudentRead(StudentBase):
    id: int
    user_id: int
    student_code: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    user: Optional[UserRead] = None
    family_details: Optional[FamilyRead] = None

    class Config:
        from_attributes = True
