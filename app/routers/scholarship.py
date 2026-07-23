from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.dependencies.db import get_db
from app.dependencies.auth import get_current_student
from app.schemas.result import ResultRead, AIExplanationResponse
from app.schemas.common import StandardResponse
from app.services.scholarship_service import ScholarshipService
from app.models.user import User

router = APIRouter(prefix="/scholarship", tags=["Scholarship Evaluation"])

@router.post("/apply", response_model=StandardResponse[ResultRead], status_code=status.HTTP_200_OK)
def apply_for_scholarship_evaluation(
    current_user: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    scholarship_service = ScholarshipService(db)
    result = scholarship_service.apply_and_evaluate(current_user.id)
    return StandardResponse(
        success=True,
        message="Scholarship AI evaluation completed successfully",
        data=ResultRead.from_orm(result)
    )

@router.get("/result", response_model=StandardResponse[ResultRead])
def get_scholarship_result(
    current_user: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    scholarship_service = ScholarshipService(db)
    result = scholarship_service.get_student_result(current_user.id)
    return StandardResponse(
        success=True,
        message="Scholarship evaluation result retrieved",
        data=ResultRead.from_orm(result)
    )

@router.get("/explain", response_model=StandardResponse[AIExplanationResponse])
def get_scholarship_ai_explanation(
    current_user: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    scholarship_service = ScholarshipService(db)
    explanation = scholarship_service.get_ai_explanation(current_user.id)
    return StandardResponse(
        success=True,
        message="AI Priority score breakdown & rationale retrieved",
        data=explanation
    )
