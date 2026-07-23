from typing import Optional, List, Tuple
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.repositories.student_repository import StudentRepository, FamilyRepository
from app.models.student import Student
from app.models.family import FamilyDetails
from app.schemas.student import StudentCreate, StudentUpdate
from app.schemas.family import FamilyCreate, FamilyUpdate

class StudentService:
    def __init__(self, db: Session):
        self.db = db
        self.student_repo = StudentRepository(db)
        self.family_repo = FamilyRepository(db)

    def get_by_user_id(self, user_id: int) -> Student:
        student = self.student_repo.get_by_user_id(user_id)
        if not student:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Student profile not found"
            )
        return student

    def get_by_id(self, student_id: int) -> Student:
        student = self.student_repo.get(student_id)
        if not student:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Student with ID {student_id} not found"
            )
        return student

    def create_or_update_profile(self, user_id: int, student_data: StudentUpdate) -> Student:
        student = self.student_repo.get_by_user_id(user_id)
        if not student:
            # Create new profile
            student = Student(
                user_id=user_id,
                full_name=student_data.full_name or "Student User",
                phone=student_data.phone,
                gender=student_data.gender,
                dob=student_data.dob,
                category=student_data.category or "General",
                is_disabled=student_data.is_disabled or False,
                disability_percentage=student_data.disability_percentage or 0.0,
                address=student_data.address,
                state=student_data.state,
                pincode=student_data.pincode
            )
            student = self.student_repo.create(student)
        else:
            # Update student details
            update_data = student_data.dict(exclude={"family_details"}, exclude_unset=True)
            student = self.student_repo.update(student, update_data)

        # Handle family details update/create
        if student_data.family_details:
            fam_dict = student_data.family_details.dict(exclude_unset=True)
            existing_fam = self.family_repo.get_by_student_id(student.id)
            if existing_fam:
                self.family_repo.update(existing_fam, fam_dict)
            else:
                fam_dict["student_id"] = student.id
                new_fam = FamilyDetails(**fam_dict)
                self.family_repo.create(new_fam)

        self.db.refresh(student)
        return student

    def list_students(
        self,
        page: int = 1,
        page_size: int = 50,
        search: Optional[str] = None,
        category: Optional[str] = None,
        state: Optional[str] = None,
        is_disabled: Optional[bool] = None
    ) -> Tuple[List[Student], int]:
        skip = (page - 1) * page_size
        return self.student_repo.list_filtered(
            skip=skip,
            limit=page_size,
            search=search,
            category=category,
            state=state,
            is_disabled=is_disabled
        )
