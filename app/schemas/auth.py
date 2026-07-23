from typing import Optional
from pydantic import BaseModel, EmailStr, Field
from app.models.enums import UserRole

class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    full_name: str = Field(..., min_length=2)
    role: UserRole = UserRole.STUDENT
    # Additional optional Student fields during registration
    phone: Optional[str] = None
    category: Optional[str] = "General"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    user_id: int

class TokenData(BaseModel):
    user_id: Optional[int] = None
    role: Optional[str] = None
