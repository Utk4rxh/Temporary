from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.dependencies.db import get_db
from app.dependencies.auth import get_current_user
from app.schemas.auth import UserRegister, UserLogin, Token
from app.schemas.user import UserRead
from app.schemas.common import StandardResponse
from app.services.auth_service import AuthService
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=StandardResponse[UserRead], status_code=status.HTTP_201_CREATED)
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    auth_service = AuthService(db)
    user = auth_service.register_user(user_data)
    return StandardResponse(
        success=True,
        message="User registered successfully",
        data=UserRead.from_orm(user)
    )

@router.post("/login", response_model=StandardResponse[Token])
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    auth_service = AuthService(db)
    token = auth_service.authenticate_user(login_data)
    return StandardResponse(
        success=True,
        message="Login successful",
        data=token
    )

@router.get("/profile", response_model=StandardResponse[UserRead])
def get_profile(current_user: User = Depends(get_current_user)):
    return StandardResponse(
        success=True,
        message="User profile retrieved",
        data=UserRead.from_orm(current_user)
    )
