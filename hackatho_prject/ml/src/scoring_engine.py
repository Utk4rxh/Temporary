"""
Scoring Engine Module for NyayaGrant AI.

Implements the official 5-pillar weighted scoring formula:
Final Score = 
  0.35 * Financial Need Score (0-100)
+ 0.25 * Academic Potential Score (0-100)
+ 0.20 * Opportunity Gap Score (0-100)
+ 0.15 * Vulnerability Score (0-100)
+ 0.05 * Special Circumstances Score (0-100)
"""

from typing import Dict, Any, Union
import numpy as np
import pandas as pd
from src.feature_engineering import engineer_all_features

ELIGIBILITY_CUTOFF = 50.0


def compute_final_score_df(df: pd.DataFrame) -> pd.DataFrame:
    """
    Computes component scores and weighted final score for a DataFrame.
    """
    df_eng = engineer_all_features(df)
    
    financial_contribution = df_eng['financial_need_score'] * 0.35
    academic_contribution = df_eng['academic_potential_score'] * 0.25
    opportunity_contribution = df_eng['opportunity_gap_score'] * 0.20
    vulnerability_contribution = df_eng['vulnerability_score'] * 0.15
    special_contribution = df_eng['special_circumstances_score'] * 0.05
    
    final_score = (financial_contribution + 
                   academic_contribution + 
                   opportunity_contribution + 
                   vulnerability_contribution + 
                   special_contribution)
                   
    df_eng['final_score'] = np.round(np.clip(final_score, 0.0, 100.0), 2)
    
    # Eligibility threshold (e.g. final_score >= ELIGIBILITY_CUTOFF)
    df_eng['scholarship_eligible'] = (df_eng['final_score'] >= ELIGIBILITY_CUTOFF).astype(int)
    
    return df_eng


def score_single_student(student_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Score a single student dictionary and return a detailed breakdown.
    """
    single_df = pd.DataFrame([student_data])
    scored_df = compute_final_score_df(single_df)
    row = scored_df.iloc[0]
    
    fin_need = float(row['financial_need_score'])
    acad_pot = float(row['academic_potential_score'])
    opp_gap = float(row['opportunity_gap_score'])
    vuln = float(row['vulnerability_score'])
    spec_circ = float(row['special_circumstances_score'])
    final_score = float(row['final_score'])
    
    fin_contrib = round(fin_need * 0.35, 1)
    acad_contrib = round(acad_pot * 0.25, 1)
    opp_contrib = round(opp_gap * 0.20, 1)
    vuln_contrib = round(vuln * 0.15, 1)
    spec_contrib = round(spec_circ * 0.05, 1)
    
    is_eligible = final_score >= ELIGIBILITY_CUTOFF
    
    if final_score >= 70.0:
        recommendation = "High Priority - Full Scholarship Tier 1 Recommended"
    elif final_score >= 60.0:
        recommendation = "Medium-High Priority - Tier 2 Scholarship Recommended"
    elif final_score >= 50.0:
        recommendation = "Eligible - Tier 3 Partial Support Recommended"
    else:
        recommendation = "Below cutoff for direct grant - Flagged for special assistance consideration"
        
    return {
        "student_id": str(student_data.get("student_id", "STU_TEMP")),
        "eligible": is_eligible,
        "final_score": final_score,
        "raw_scores": {
            "financial_need_score": fin_need,
            "academic_potential_score": acad_pot,
            "opportunity_gap_score": opp_gap,
            "vulnerability_score": vuln,
            "special_circumstances_score": spec_circ
        },
        "weighted_scores": {
            "financial_need_weighted": f"{fin_contrib}/35",
            "academic_potential_weighted": f"{acad_contrib}/25",
            "opportunity_gap_weighted": f"{opp_contrib}/20",
            "vulnerability_weighted": f"{vuln_contrib}/15",
            "special_circumstances_weighted": f"{spec_contrib}/5"
        },
        "scores": {
            "financial_need": fin_contrib,
            "academic_potential": acad_contrib,
            "opportunity_gap": opp_contrib,
            "vulnerability": vuln_contrib,
            "special_circumstances": spec_contrib
        },
        "recommendation": recommendation
    }
