from datetime import datetime
from typing import Optional
from sqlalchemy import String, Integer, Float, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.session import Base

class FamilyDetails(Base):
    __tablename__ = "family_details"

    id: Mapped[int] = mapped_column(primary_key=True, index=True, autoincrement=True)
    student_id: Mapped[int] = mapped_column(Integer, ForeignKey("students.id", ondelete="CASCADE"), unique=True, nullable=False)
    father_name: Mapped[Optional[str]] = mapped_column(String(150), nullable=True)
    father_occupation: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    mother_name: Mapped[Optional[str]] = mapped_column(String(150), nullable=True)
    mother_occupation: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    annual_income: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    family_size: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    earning_members: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    internet_access: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    laptop_available: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    student = relationship("Student", back_populates="family_details")
