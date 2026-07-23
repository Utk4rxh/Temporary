from fastapi import APIRouter, status
from app.schemas.ml import MLPredictRequest, MLPredictResponse
from app.schemas.common import StandardResponse
from app.services.ml_service import MLService

router = APIRouter(prefix="/ml", tags=["ML Service"])

@router.post("/predict", response_model=MLPredictResponse, status_code=status.HTTP_200_OK)
def predict_scholarship_indices(request_data: MLPredictRequest):
    """
    Standalone ML Prediction Service Endpoint.
    Receives raw student features and calculates Financial Need Index, Merit Index,
    AI Priority Score, recommendation status, recommended amount, and explanation.
    """
    return MLService.predict(request_data)
