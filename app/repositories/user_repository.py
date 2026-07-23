from typing import Optional
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.admin import Admin
from app.repositories.base import BaseRepository

class UserRepository(BaseRepository[User]):
    def __init__(self, db: Session):
        super().__init__(User, db)

    def get_by_email(self, email: str) -> Optional[User]:
        return self.db.query(User).filter(User.email == email).first()

class AdminRepository(BaseRepository[Admin]):
    def __init__(self, db: Session):
        super().__init__(Admin, db)

    def get_by_user_id(self, user_id: int) -> Optional[Admin]:
        return self.db.query(Admin).filter(Admin.user_id == user_id).first()
