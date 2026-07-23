from datetime import datetime
from sqlalchemy import Integer, Float, ForeignKey, DateTime, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.session import Base
from app.models.enums import ApplicationStatus

class ScholarshipApplication(Base):
    __tablename__ = "scholarship_applications"

    id: Mapped[int] = mapped_column(primary_key=True, index=True, autoincrement=True)
    student_id: Mapped[int] = mapped_column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    cgpa: Mapped[float] = mapped_column(Float, nullable=False)
    attendance_percentage: Mapped[float] = mapped_column(Float, nullable=False)
    previous_percentage: Mapped[float] = mapped_column(Float, nullable=False)
    study_hours_per_day: Mapped[float] = mapped_column(Float, nullable=False)
    status: Mapped[ApplicationStatus] = mapped_column(SQLEnum(ApplicationStatus), default=ApplicationStatus.SUBMITTED, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    student = relationship("Student", back_populates="applications")
    result = relationship("ScholarshipResult", back_populates="application", uselist=False, cascade="all, delete-orphan")
