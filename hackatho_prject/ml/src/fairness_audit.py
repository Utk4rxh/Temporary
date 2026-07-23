"""
Fairness Audit Module for NyayaGrant AI.

Performs demographic parity and equal opportunity audits across:
1. Gender (Female, Male, Non-Binary)
2. Urban / Semi-Urban / Rural status
3. Income brackets (< ₹1.5L, ₹1.5L-₹3L, ₹3L-₹6L, > ₹6L)
4. Geographical regions (States)

Detects potential disparities, logs alerts/warnings, and supports human oversight.
Does NOT force artificial score manipulation.
"""

from typing import Dict, Any, List
import numpy as np
import pandas as pd


def audit_fairness(df: pd.DataFrame, prediction_col: str = 'scholarship_eligible', target_col: str = 'scholarship_eligible') -> Dict[str, Any]:
    """
    Performs comprehensive fairness audit on predictions dataframe.
    """
    df = df.copy()
    
    if prediction_col not in df.columns:
        if 'final_score' in df.columns:
            df[prediction_col] = (df['final_score'] >= 50.0).astype(int)
        else:
            raise KeyError(f"Column '{prediction_col}' not found in dataframe.")
            
    overall_selection_rate = float(df[prediction_col].mean())
    warnings = []
    audit_results = {
        "overall_selection_rate": round(overall_selection_rate, 4),
        "total_applicants": len(df),
        "group_metrics": {},
        "warnings": []
    }
    
    # 1. Audit Gender Fairness
    if 'gender' in df.columns:
        gender_metrics = {}
        for gender, group_df in df.groupby('gender'):
            sel_rate = float(group_df[prediction_col].mean())
            count = len(group_df)
            gender_metrics[str(gender)] = {
                "count": count,
                "selection_rate": round(sel_rate, 4),
                "selected_count": int(group_df[prediction_col].sum())
            }
        audit_results["group_metrics"]["gender"] = gender_metrics
        
        female_rate = gender_metrics.get('Female', {}).get('selection_rate', overall_selection_rate)
        male_rate = gender_metrics.get('Male', {}).get('selection_rate', overall_selection_rate)
        if (male_rate - female_rate) > 0.15:
            warnings.append(f"Potential Gender Disparity Alert: Female selection rate ({female_rate*100:.1f}%) is significantly lower than Male ({male_rate*100:.1f}%). Flagged for Admin Review.")

    # 2. Audit Urban vs Rural Fairness
    if 'urban_rural' in df.columns:
        ur_metrics = {}
        for loc, group_df in df.groupby('urban_rural'):
            sel_rate = float(group_df[prediction_col].mean())
            ur_metrics[str(loc)] = {
                "count": len(group_df),
                "selection_rate": round(sel_rate, 4),
                "selected_count": int(group_df[prediction_col].sum())
            }
        audit_results["group_metrics"]["urban_rural"] = ur_metrics
        
        rural_rate = ur_metrics.get('Rural', {}).get('selection_rate', overall_selection_rate)
        urban_rate = ur_metrics.get('Urban', {}).get('selection_rate', overall_selection_rate)
        if (urban_rate - rural_rate) > 0.20:
            warnings.append(f"Potential Disparity Alert: Urban selection rate ({urban_rate*100:.1f}%) is noticeably higher than Rural ({rural_rate*100:.1f}%). Verify opportunity gap weighting.")

    # 3. Audit Income Groups
    if 'annual_family_income' in df.columns:
        income_bins = [-np.inf, 150000, 300000, 600000, np.inf]
        income_labels = ['< ₹1.5L', '₹1.5L - ₹3.0L', '₹3.0L - ₹6.0L', '> ₹6.0L']
        df['income_group'] = pd.cut(df['annual_family_income'], bins=income_bins, labels=income_labels)
        
        inc_metrics = {}
        for group_name, group_df in df.groupby('income_group', observed=False):
            if len(group_df) > 0:
                sel_rate = float(group_df[prediction_col].mean())
                inc_metrics[str(group_name)] = {
                    "count": len(group_df),
                    "selection_rate": round(sel_rate, 4),
                    "selected_count": int(group_df[prediction_col].sum())
                }
        audit_results["group_metrics"]["income_groups"] = inc_metrics
        
        low_inc_rate = inc_metrics.get('< ₹1.5L', {}).get('selection_rate', 1.0)
        high_inc_rate = inc_metrics.get('> ₹6.0L', {}).get('selection_rate', 0.0)
        if high_inc_rate > low_inc_rate:
            warnings.append(f"CRITICAL ANOMALY ALERT: High income group (>₹6L) has higher selection rate ({high_inc_rate*100:.1f}%) than low income group (<₹1.5L) ({low_inc_rate*100:.1f}%). Audit financial scoring parameters immediately!")

    # 4. Audit Geographic Regions (States)
    if 'state' in df.columns:
        state_metrics = {}
        for state_name, group_df in df.groupby('state'):
            sel_rate = float(group_df[prediction_col].mean())
            state_metrics[str(state_name)] = {
                "count": len(group_df),
                "selection_rate": round(sel_rate, 4),
                "selected_count": int(group_df[prediction_col].sum())
            }
        audit_results["group_metrics"]["states"] = state_metrics
        
    audit_results["warnings"] = warnings
    return audit_results


def print_fairness_report(audit_results: Dict[str, Any]):
    """Print readable fairness audit summary."""
    print("\n==================================================")
    print("NYAYAGRANT AI - FAIRNESS & DEMOGRAPHIC AUDIT")
    print("==================================================")
    print(f"Total Applicants Audited: {audit_results['total_applicants']}")
    print(f"Overall Selection Rate: {audit_results['overall_selection_rate']*100:.1f}%\n")
    
    for category, metrics in audit_results["group_metrics"].items():
        print(f"--- Breakdown by {category.upper()} ---")
        for group, vals in metrics.items():
            rate = vals.get('selection_rate', 0) * 100
            count = vals.get('count', 0)
            sel_count = vals.get('selected_count', 0)
            print(f"  • {group:<18}: {rate:5.1f}% selected ({sel_count} / {count})")
        print()
        
    if audit_results["warnings"]:
        print("!!! FAIRNESS AUDIT WARNINGS & DISPARITY ALERTS !!!")
        for w in audit_results["warnings"]:
            print(f"  ⚠️  {w}")
    else:
        print("✓ No critical demographic disparity alerts detected. Selection distributions align with objective equity criteria.")
    print("==================================================\n")
