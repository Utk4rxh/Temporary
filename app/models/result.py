from datetime import datetime
from typing import Optional
from sqlalchemy import Integer, Float, Boolean, Text, ForeignKey, DateTime, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.session import Base
from app.models.enums import AllocationStatus

class ScholarshipResult(Base):
    __tablename__ = "scholarship_results"

    id: Mapped[int] = mapped_column(primary_key=True, index=True, autoincrement=True)
    application_id: Mapped[int] = mapped_column(Integer, ForeignKey("scholarship_applications.id", ondelete="CASCADE"), unique=True, nullable=False)
    financial_need_index: Mapped[float] = mapped_column(Float, nullable=False)
    merit_index: Mapped[float] = mapped_column(Float, nullable=False)
    ai_priority_score: Mapped[float] = mapped_column(Float, nullable=False)
    recommended: Mapped[bool] = mapped_column(Boolean, nullable=False)
    scholarship_amount: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    explanation: Mapped[str] = mapped_column(Text, nullable=False)
    allocation_status: Mapped[AllocationStatus] = mapped_column(SQLEnum(AllocationStatus), default=AllocationStatus.PENDING, nullable=False)
    allocated_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

    application = relationship("ScholarshipApplication", back_populates="result")
