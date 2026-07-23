from typing import Optional, List, Tuple
from sqlalchemy.orm import Session, joinedload
from app.models.application import ScholarshipApplication
from app.models.enums import ApplicationStatus
from app.repositories.base import BaseRepository

class ApplicationRepository(BaseRepository[ScholarshipApplication]):
    def __init__(self, db: Session):
        super().__init__(ScholarshipApplication, db)

    def get_by_student_id(self, student_id: int) -> Optional[ScholarshipApplication]:
        return self.db.query(ScholarshipApplication).options(
            joinedload(ScholarshipApplication.result)
        ).filter(ScholarshipApplication.student_id == student_id).order_by(ScholarshipApplication.id.desc()).first()

    def get_all_by_student_id(self, student_id: int) -> List[ScholarshipApplication]:
        return self.db.query(ScholarshipApplication).options(
            joinedload(ScholarshipApplication.result)
        ).filter(ScholarshipApplication.student_id == student_id).order_by(ScholarshipApplication.id.desc()).all()

    def list_filtered(
        self,
        skip: int = 0,
        limit: int = 50,
        status: Optional[ApplicationStatus] = None,
        min_cgpa: Optional[float] = None
    ) -> Tuple[List[ScholarshipApplication], int]:
        query = self.db.query(ScholarshipApplication).options(
            joinedload(ScholarshipApplication.student),
            joinedload(ScholarshipApplication.result)
        )

        if status:
            query = query.filter(ScholarshipApplication.status == status)
        if min_cgpa is not None:
            query = query.filter(ScholarshipApplication.cgpa >= min_cgpa)

        total = query.count()
        applications = query.order_by(ScholarshipApplication.id.desc()).offset(skip).limit(limit).all()
        return applications, total

    def count_by_status(self, status: ApplicationStatus) -> int:
        return self.db.query(ScholarshipApplication).filter(ScholarshipApplication.status == status).count()
