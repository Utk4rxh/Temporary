from datetime import datetime
from pydantic import BaseModel, EmailStr
from app.models.enums import UserRole

class UserRead(BaseModel):
    id: int
    email: EmailStr
    role: UserRole
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
