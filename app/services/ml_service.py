from app.ml.predictor import MLPredictor
from app.schemas.ml import MLPredictRequest, MLPredictResponse

class MLService:
    @staticmethod
    def predict(request_data: MLPredictRequest) -> MLPredictResponse:
        result = MLPredictor.predict(
            cgpa=request_data.cgpa,
            attendance=request_data.attendance,
            annual_income=request_data.annual_income,
            family_size=request_data.family_size,
            earning_members=request_data.earning_members,
            internet_access=request_data.internet_access,
            laptop_available=request_data.laptop_available,
            study_hours=request_data.study_hours,
            previous_percentage=request_data.previous_percentage
        )
        return MLPredictResponse(**result)
