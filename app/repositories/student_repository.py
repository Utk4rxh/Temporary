from typing import Optional, List, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.models.student import Student
from app.models.family import FamilyDetails
from app.repositories.base import BaseRepository

class StudentRepository(BaseRepository[Student]):
    def __init__(self, db: Session):
        super().__init__(Student, db)

    def get_by_user_id(self, user_id: int) -> Optional[Student]:
        return self.db.query(Student).filter(Student.user_id == user_id).first()

    def get_by_student_code(self, code: str) -> Optional[Student]:
        return self.db.query(Student).filter(Student.student_code == code).first()

    def list_filtered(
        self,
        skip: int = 0,
        limit: int = 50,
        search: Optional[str] = None,
        category: Optional[str] = None,
        state: Optional[str] = None,
        is_disabled: Optional[bool] = None
    ) -> Tuple[List[Student], int]:
        query = self.db.query(Student)

        if search:
            search_fmt = f"%{search}%"
            query = query.filter(
                or_(
                    Student.full_name.ilike(search_fmt),
                    Student.student_code.ilike(search_fmt),
                    Student.phone.ilike(search_fmt)
                )
            )
        if category:
            query = query.filter(Student.category == category)
        if state:
            query = query.filter(Student.state == state)
        if is_disabled is not None:
            query = query.filter(Student.is_disabled == is_disabled)

        total = query.count()
        students = query.order_by(Student.id.desc()).offset(skip).limit(limit).all()
        return students, total

class FamilyRepository(BaseRepository[FamilyDetails]):
    def __init__(self, db: Session):
        super().__init__(FamilyDetails, db)

    def get_by_student_id(self, student_id: int) -> Optional[FamilyDetails]:
        return self.db.query(FamilyDetails).filter(FamilyDetails.student_id == student_id).first()
