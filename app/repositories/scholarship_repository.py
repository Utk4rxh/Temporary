from typing import Optional, List
from sqlalchemy.orm import Session, joinedload
from app.models.result import ScholarshipResult
from app.models.application import ScholarshipApplication
from app.models.enums import AllocationStatus
from app.repositories.base import BaseRepository

class ScholarshipRepository(BaseRepository[ScholarshipResult]):
    def __init__(self, db: Session):
        super().__init__(ScholarshipResult, db)

    def get_by_application_id(self, application_id: int) -> Optional[ScholarshipResult]:
        return self.db.query(ScholarshipResult).filter(ScholarshipResult.application_id == application_id).first()

    def get_all_with_applications() -> List[ScholarshipResult]:
        return self.db.query(ScholarshipResult).options(
            joinedload(ScholarshipResult.application).joinedload(ScholarshipApplication.student)
        ).order_by(ScholarshipResult.ai_priority_score.desc()).all()

    def get_allocated_by_status(self, status: AllocationStatus) -> List[ScholarshipResult]:
        return self.db.query(ScholarshipResult).filter(ScholarshipResult.allocation_status == status).all()
