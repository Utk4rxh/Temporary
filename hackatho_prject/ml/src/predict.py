"""
Prediction API & Main Integration Gateway for NyayaGrant AI.

Exposes production-ready functions for web apps, FastAPI, Streamlit, or microservices:
1. predict_student(student_data)
2. score_student(student_data)
3. explain_student(student_data)
4. allocate_budget(applicants, total_budget, mode="greedy")
5. audit_fairness(predictions_df)
"""

import os
import joblib
from typing import Dict, Any, List, Union
import numpy as np
import pandas as pd

from src.scoring_engine import score_single_student, compute_final_score_df
from src.explainability import generate_student_explanation
from src.budget_optimizer import allocate_budget, get_scholarship_tier_amount
from src.fairness_audit import audit_fairness

_MODEL = None
_PREPROCESSOR = None


def get_ml_root(base_dir: str = None) -> str:
    """Intelligently resolves absolute path to the ml/ directory."""
    if base_dir:
        abs_base = os.path.abspath(base_dir)
        if os.path.basename(abs_base) == "ml":
            return abs_base
        if os.path.exists(os.path.join(abs_base, "ml")):
            return os.path.join(abs_base, "ml")
    src_dir = os.path.dirname(os.path.abspath(__file__))
    return os.path.abspath(os.path.join(src_dir, ".."))


def load_artifacts(base_dir: str = None):
    """Lazy load saved model and preprocessor pipeline."""
    global _MODEL, _PREPROCESSOR
    if _MODEL is None or _PREPROCESSOR is None:
        ml_root = get_ml_root(base_dir)
        models_dir = os.path.join(ml_root, "models")
        model_path = os.path.join(models_dir, "scholarship_model.pkl")
        preprocessor_path = os.path.join(models_dir, "scaler.pkl")
        
        if os.path.exists(model_path):
            _MODEL = joblib.load(model_path)
        if os.path.exists(preprocessor_path):
            _PREPROCESSOR = joblib.load(preprocessor_path)


def score_student(student_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Computes component scores, weighted final score, and eligibility recommendation.
    """
    return score_single_student(student_data)


def explain_student(student_data: Dict[str, Any], base_dir: str = None) -> Dict[str, Any]:
    """
    Generates explainable AI narrative, sub-score breakdown, positive/negative factors, and SHAP.
    """
    load_artifacts(base_dir=base_dir)
    return generate_student_explanation(student_data, model=_MODEL, preprocessor=_PREPROCESSOR)


def predict_student(student_data: Dict[str, Any], base_dir: str = None) -> Dict[str, Any]:
    """
    Unified prediction function returning full student profile, score, eligibility, explanation, and grant amount.
    """
    load_artifacts(base_dir=base_dir)
    
    score_res = score_single_student(student_data)
    explanation_res = generate_student_explanation(student_data, model=_MODEL, preprocessor=_PREPROCESSOR)
    
    final_score = score_res["final_score"]
    rec_grant, tier_name = get_scholarship_tier_amount(final_score)
    
    ml_pred = score_res["eligible"]
    ml_confidence = round(final_score / 100.0, 4)
    
    if _MODEL is not None and _PREPROCESSOR is not None:
        try:
            single_df = pd.DataFrame([student_data])
            single_df = compute_final_score_df(single_df)
            X_trans = _PREPROCESSOR.transform(single_df)
            ml_pred = bool(_MODEL.predict(X_trans)[0])
            if hasattr(_MODEL, "predict_proba"):
                ml_confidence = round(float(_MODEL.predict_proba(X_trans)[0][1]), 4)
        except Exception:
            pass
            
    return {
        "student_id": str(student_data.get("student_id", "STU001")),
        "eligible": score_res["eligible"],
        "ml_model_prediction": ml_pred,
        "ml_model_confidence": ml_confidence,
        "final_score": final_score,
        "rank": student_data.get("rank", 1),
        "scores": score_res["scores"],
        "explanation": explanation_res["explanation"],
        "top_positive_factors": explanation_res["top_positive_factors"],
        "top_negative_factors": explanation_res["top_negative_factors"],
        "recommended_scholarship": rec_grant,
        "scholarship_tier": tier_name,
        "recommendation": score_res["recommendation"]
    }


if __name__ == "__main__":
    load_artifacts()
    
    sample_student = {
        "student_id": "STU001",
        "age": 19,
        "gender": "Female",
        "state": "Bihar",
        "district": "Patna",
        "urban_rural": "Rural",
        "education_level": "Undergraduate",
        "course_type": "STEM",
        "annual_family_income": 120000,
        "family_members": 6,
        "earning_members": 1,
        "monthly_expenses": 9500,
        "family_debt": 45000,
        "medical_expenses": 15000,
        "education_expenses": 20000,
        "number_of_dependents": 5,
        "has_house": 1,
        "has_vehicle": 0,
        "land_area": 0.5,
        "previous_percentage": 72.5,
        "current_percentage": 84.0,
        "attendance_percentage": 92.0,
        "academic_consistency": 0.85,
        "subject_strength": "Mathematics",
        "internet_access": 0,
        "has_laptop": 0,
        "has_smartphone": 1,
        "school_quality_score": 4,
        "coaching_access": 0,
        "library_access": 0,
        "electricity_reliability": 12.0,
        "distance_to_school": 8.5,
        "single_parent": 0,
        "orphan": 0,
        "disability": 0,
        "serious_family_illness": 1,
        "first_generation_learner": 1,
        "natural_disaster_affected": 0,
        "emergency_expenses": 15000,
        "recently_lost_income": 1,
        "other_special_circumstances": 0
    }
    
    print("\n--- SAMPLE STUDENT PREDICTION TEST ---")
    res = predict_student(sample_student)
    import json
    print(json.dumps(res, indent=4))
