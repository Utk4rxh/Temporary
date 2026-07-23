"""
Explainable AI (XAI) Module for NyayaGrant AI.

Provides instance-level explanations for individual student predictions using:
1. SHAP values (when tree model is available)
2. Domain feature attribution & Tree Feature Importance fallback
3. Human-readable dynamic explanation generator based on actual student features.
"""

from typing import Dict, Any, List
import numpy as np
import pandas as pd
import shap

from src.scoring_engine import score_single_student, compute_final_score_df


def generate_student_explanation(student_data: Dict[str, Any], model=None, preprocessor=None) -> Dict[str, Any]:
    """
    Generate explainable breakdown and narrative explanation for a single student.
    """
    scored = score_single_student(student_data)
    
    raw_scores = scored["raw_scores"]
    weighted_scores = scored["scores"]
    final_score = scored["final_score"]
    
    top_positive_factors = []
    top_negative_factors = []
    explanation_phrases = []
    
    # 1. Analyze Financial Factors
    income = student_data.get("annual_family_income", 500000)
    dependents = student_data.get("number_of_dependents", 2)
    debt = student_data.get("family_debt", 0)
    
    if income <= 250000:
        top_positive_factors.append(f"Low annual family income (INR {income:,.0f})")
    elif income >= 800000:
        top_negative_factors.append(f"Higher annual family income (INR {income:,.0f})")
        
    if dependents >= 3:
        top_positive_factors.append(f"High family dependency burden ({dependents} dependents)")
        
    if debt > 50000:
        top_positive_factors.append(f"Significant family debt (INR {debt:,.0f})")
        
    if raw_scores["financial_need_score"] >= 65:
        explanation_phrases.append("significant financial pressure")
    elif raw_scores["financial_need_score"] <= 30:
        top_negative_factors.append("Lower financial burden relative to income")

    # 2. Analyze Academic Factors
    curr_pct = student_data.get("current_percentage", 70.0)
    prev_pct = student_data.get("previous_percentage", 70.0)
    improvement = curr_pct - prev_pct
    
    if improvement >= 4.0:
        top_positive_factors.append(f"Strong academic improvement (+{improvement:.1f}%)")
        explanation_phrases.append("strong academic improvement")
    elif curr_pct >= 85.0:
        top_positive_factors.append(f"High current academic performance ({curr_pct:.1f}%)")
    elif curr_pct < 60.0 and improvement <= 0:
        top_negative_factors.append(f"Modest academic marks ({curr_pct:.1f}%)")

    # 3. Analyze Opportunity Gap Factors
    has_laptop = student_data.get("has_laptop", 1)
    has_internet = student_data.get("internet_access", 1)
    school_qual = student_data.get("school_quality_score", 5)
    
    if has_laptop == 0:
        top_positive_factors.append("Lack of personal computer/laptop access")
    if has_internet == 0:
        top_positive_factors.append("Limited internet connectivity")
    if school_qual <= 4:
        top_positive_factors.append(f"Low school infrastructure score ({school_qual}/10)")
        
    if raw_scores["opportunity_gap_score"] >= 60:
        explanation_phrases.append("limited access to educational resources")

    # 4. Analyze Vulnerability & Special Factors
    if student_data.get("orphan", 0) == 1:
        top_positive_factors.append("Orphan status")
        explanation_phrases.append("severe social vulnerability")
    elif student_data.get("single_parent", 0) == 1:
        top_positive_factors.append("Single parent household")
    if student_data.get("disability", 0) == 1:
        top_positive_factors.append("Person with disability")
    if student_data.get("first_generation_learner", 0) == 1:
        top_positive_factors.append("First-generation learner in family")
    if student_data.get("recently_lost_income", 0) == 1:
        top_positive_factors.append("Recent family income loss shock")
        explanation_phrases.append("recent financial hardship shock")

    # Construct Narrative Summary
    if not explanation_phrases:
        if final_score >= 50:
            narrative = "This applicant met the eligibility threshold based on balanced academic performance and standard financial aid criteria."
        else:
            narrative = "This applicant received lower priority due to relatively lower financial need and resource constraints compared to high-priority candidates."
    else:
        status_word = "received high priority" if final_score >= 60 else "was recommended for allocation" if final_score >= 50 else "is currently lower prioritized"
        narrative = f"This applicant {status_word} primarily because of " + ", ".join(explanation_phrases) + "."
        
    # SHAP Attribution
    shap_details = []
    if model is not None and preprocessor is not None:
        try:
            single_df = pd.DataFrame([student_data])
            single_df = compute_final_score_df(single_df)
            X_trans = preprocessor.transform(single_df)
            explainer = shap.TreeExplainer(model)
            shap_vals = explainer.shap_values(X_trans)
            
            if isinstance(shap_vals, list):
                sv = shap_vals[1][0]
            elif len(shap_vals.shape) == 3:
                sv = shap_vals[0, :, 1]
            else:
                sv = shap_vals[0]
                
            top_shap_idx = np.argsort(np.abs(sv))[::-1][:5]
            for idx in top_shap_idx:
                shap_details.append({
                    "feature_index": int(idx),
                    "shap_impact": round(float(sv[idx]), 4)
                })
        except Exception as e:
            shap_details = [{"note": f"SHAP calculation fallback: {str(e)}"}]
            
    return {
        "student_id": scored["student_id"],
        "eligible": scored["eligible"],
        "final_score": final_score,
        "recommendation": scored["recommendation"],
        "score_breakdown": {
            "financial_need_score": f"{weighted_scores['financial_need']}/35",
            "academic_potential_score": f"{weighted_scores['academic_potential']}/25",
            "opportunity_gap_score": f"{weighted_scores['opportunity_gap']}/20",
            "vulnerability_score": f"{weighted_scores['vulnerability']}/15",
            "special_circumstances_score": f"{weighted_scores['special_circumstances']}/5",
            "final_score": f"{final_score}/100"
        },
        "explanation": narrative,
        "top_positive_factors": top_positive_factors if top_positive_factors else ["Consistent baseline applicant profile"],
        "top_negative_factors": top_negative_factors if top_negative_factors else ["No major negative scoring factors"],
        "shap_importance": shap_details
    }


def explain_student(student_data: Dict[str, Any]) -> Dict[str, Any]:
    """Exposes top-level explainable API function."""
    return generate_student_explanation(student_data)
