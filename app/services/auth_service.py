from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.repositories.user_repository import UserRepository, AdminRepository
from app.repositories.student_repository import StudentRepository
from app.models.user import User
from app.models.admin import Admin
from app.models.student import Student
from app.models.enums import UserRole
from app.schemas.auth import UserRegister, UserLogin, Token
from app.utils.security import get_password_hash, verify_password, create_access_token

class AuthService:
    def __init__(self, db: Session):
        self.db = db
        self.user_repo = UserRepository(db)
        self.admin_repo = AdminRepository(db)
        self.student_repo = StudentRepository(db)

    def register_user(self, register_data: UserRegister) -> User:
        existing_user = self.user_repo.get_by_email(register_data.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this email already exists"
            )

        hashed_pwd = get_password_hash(register_data.password)
        user = User(
            email=register_data.email,
            hashed_password=hashed_pwd,
            role=register_data.role,
            is_active=True
        )
        created_user = self.user_repo.create(user)

        # Create profile based on role
        if register_data.role == UserRole.ADMIN:
            admin = Admin(
                user_id=created_user.id,
                full_name=register_data.full_name,
                department="Scholarship Committee"
            )
            self.admin_repo.create(admin)
        else:
            student = Student(
                user_id=created_user.id,
                full_name=register_data.full_name,
                phone=register_data.phone,
                category=register_data.category or "General"
            )
            self.student_repo.create(student)

        return created_user

    def authenticate_user(self, login_data: UserLogin) -> Token:
        user = self.user_repo.get_by_email(login_data.email)
        if not user or not verify_password(login_data.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password"
            )

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Inactive user account"
            )

        access_token = create_access_token(subject=user.id, role=user.role.value)
        return Token(
            access_token=access_token,
            token_type="bearer",
            role=user.role.value,
            user_id=user.id
        )
