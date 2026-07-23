"""
Budget Optimization Module for NyayaGrant AI.

Allocates fixed scholarship funds among ranked applicants under budget constraints.

Supports two strategies:
1. MODE 1: Greedy Allocation (Priority Rank Order)
2. MODE 2: Mathematical Optimization (Scipy Linear Programming / Integer Program)

Tier Structure:
- Priority Score >= 70 : ₹50,000 (Tier 1 - Full Grant)
- Priority Score >= 60 : ₹30,000 (Tier 2 - Merit-Need Grant)
- Priority Score >= 50 : ₹15,000 (Tier 3 - Assistance Grant)
"""

from typing import List, Dict, Any, Tuple
import numpy as np
import pandas as pd
from scipy.optimize import linprog


def get_scholarship_tier_amount(final_score: float) -> Tuple[int, str]:
    """Determines scholarship tier amount and tier name based on priority score."""
    if final_score >= 70.0:
        return 50000, "Tier 1 (Full Grant)"
    elif final_score >= 60.0:
        return 30000, "Tier 2 (Merit-Need Grant)"
    elif final_score >= 50.0:
        return 15000, "Tier 3 (Assistance Grant)"
    else:
        return 0, "Not Tier Eligible"


def allocate_budget_greedy(
    applicants_df: pd.DataFrame, 
    total_budget: float = 1000000.0
) -> Dict[str, Any]:
    """
    MODE 1: Greedy Allocation strategy.
    Sorts applicants by final_score descending and allocates until total_budget is exhausted.
    """
    df = applicants_df.copy()
    
    if 'final_score' not in df.columns:
        from src.scoring_engine import compute_final_score_df
        df = compute_final_score_df(df)
        
    df = df.sort_values(by='final_score', ascending=False).reset_index(drop=True)
    df['rank'] = df.index + 1
    
    allocated_students = []
    waitlisted_students = []
    
    current_spent = 0.0
    
    for _, row in df.iterrows():
        score = float(row['final_score'])
        grant_amount, tier_name = get_scholarship_tier_amount(score)
        
        student_info = {
            "student_id": str(row.get('student_id', f"STU_{row['rank']}")),
            "rank": int(row['rank']),
            "final_score": score,
            "tier": tier_name,
            "requested_amount": grant_amount
        }
        
        if grant_amount > 0 and (current_spent + grant_amount) <= total_budget:
            current_spent += grant_amount
            student_info["allocated_amount"] = grant_amount
            student_info["status"] = "Allocated"
            allocated_students.append(student_info)
        else:
            student_info["allocated_amount"] = 0
            student_info["status"] = "Waitlisted / Insufficient Funds" if grant_amount > 0 else "Ineligible Score"
            waitlisted_students.append(student_info)
            
    remaining_budget = total_budget - current_spent
    
    return {
        "strategy": "Greedy Rank-Based Allocation",
        "total_budget": total_budget,
        "amount_allocated": current_spent,
        "remaining_budget": remaining_budget,
        "total_applicants": len(df),
        "number_of_beneficiaries": len(allocated_students),
        "waitlisted_count": len(waitlisted_students),
        "allocated_students": allocated_students,
        "waitlisted_students": waitlisted_students[:20]
    }


def allocate_budget_optimization(
    applicants_df: pd.DataFrame, 
    total_budget: float = 1000000.0
) -> Dict[str, Any]:
    """
    MODE 2: Linear Programming / Binary Integer Optimization strategy.
    
    Objective:
      Maximize sum(x_i * priority_score_i)
    Subject to:
      sum(x_i * grant_amount_i) <= total_budget
      x_i in [0, 1]
    """
    df = applicants_df.copy()
    if 'final_score' not in df.columns:
        from src.scoring_engine import compute_final_score_df
        df = compute_final_score_df(df)
        
    df = df.sort_values(by='final_score', ascending=False).reset_index(drop=True)
    df['rank'] = df.index + 1
    
    eligible_df = df[df['final_score'] >= 50.0].copy()
    if len(eligible_df) == 0:
        return allocate_budget_greedy(applicants_df, total_budget)
        
    scores = eligible_df['final_score'].values
    grants = np.array([get_scholarship_tier_amount(s)[0] for s in scores])
    
    c = -scores
    A_ub = [grants]
    b_ub = [total_budget]
    bounds = [(0, 1) for _ in range(len(scores))]
    
    res = linprog(c, A_ub=A_ub, b_ub=b_ub, bounds=bounds, method='highs')
    
    allocated_students = []
    waitlisted_students = []
    current_spent = 0.0
    
    if res.success:
        x_sol = res.x
        for idx, row in eligible_df.iterrows():
            pos = eligible_df.index.get_loc(idx)
            val = x_sol[pos]
            score = float(row['final_score'])
            grant_amount, tier_name = get_scholarship_tier_amount(score)
            
            student_info = {
                "student_id": str(row.get('student_id', f"STU_{row['rank']}")),
                "rank": int(row['rank']),
                "final_score": score,
                "tier": tier_name,
                "requested_amount": grant_amount
            }
            
            if val >= 0.5 and (current_spent + grant_amount) <= total_budget:
                current_spent += grant_amount
                student_info["allocated_amount"] = grant_amount
                student_info["status"] = "Allocated (LP Optimized)"
                allocated_students.append(student_info)
            else:
                student_info["allocated_amount"] = 0
                student_info["status"] = "Waitlisted (Optimization Trade-off)"
                waitlisted_students.append(student_info)
    else:
        return allocate_budget_greedy(applicants_df, total_budget)

    ineligible_df = df[df['final_score'] < 50.0]
    for _, row in ineligible_df.iterrows():
        waitlisted_students.append({
            "student_id": str(row.get('student_id', f"STU_{row['rank']}")),
            "rank": int(row['rank']),
            "final_score": float(row['final_score']),
            "tier": "Ineligible Score",
            "requested_amount": 0,
            "allocated_amount": 0,
            "status": "Ineligible Score"
        })

    remaining_budget = total_budget - current_spent
    
    return {
        "strategy": "Scipy LP Priority Utility Maximization",
        "total_budget": total_budget,
        "amount_allocated": current_spent,
        "remaining_budget": remaining_budget,
        "total_applicants": len(df),
        "number_of_beneficiaries": len(allocated_students),
        "waitlisted_count": len(waitlisted_students),
        "allocated_students": allocated_students,
        "waitlisted_students": waitlisted_students[:20]
    }


def explain_optimization_tradeoff() -> str:
    """
    Returns conceptual explanation comparing Greedy vs LP Optimization.
    """
    return """
================================================================================
BUDGET ALLOCATION COMPARISON: GREEDY vs. LINEAR PROGRAMMING OPTIMIZATION
================================================================================

1. GREEDY ALLOCATION MODE (Priority Rank-Order):
   - Principle: Strictly ranks applicants by final score in descending order.
   - Behavior: Grants funds to the top N applicants until budget runs out.
   - Advantage: Simple, transparent, and easy to explain to applicants ("Highest priority scores get funded first").
   - Limitation: May leave small leftover budget gaps if the next top applicant's grant tier exceeds the exact remaining amount.

2. LINEAR PROGRAMMING OPTIMIZATION MODE (Scipy Linprog Knapsack):
   - Principle: Solves a constrained optimization problem maximizing total priority score utility sum(x_i * score_i) subject to sum(x_i * grant_i) <= total_budget.
   - Behavior: Can select a combination of grant tiers (e.g. two Tier 3 grants instead of one Tier 1 grant) if it maximizes total social utility within exact budget limits.
   - Advantage: Maximizes total beneficiary impact score and eliminates budget wastage.
   - Limitation: Slightly less intuitive to communicate if a student with score 76 gets skipped in favor of two high-utility score 74 candidates to fit exact remaining budget.

RECOMMENDATION FOR NYAYAGRANT AI:
Use Greedy Allocation as the default primary allocation rule for transparency, and use LP Optimization when administrators want to maximize the total number of beneficiaries for a fixed budget pool.
================================================================================
"""


def allocate_budget(
    applicants: Any, 
    total_budget: float = 1000000.0, 
    mode: str = "greedy"
) -> Dict[str, Any]:
    """Exposes top-level unified budget allocation API."""
    if isinstance(applicants, list):
        df = pd.DataFrame(applicants)
    elif isinstance(applicants, pd.DataFrame):
        df = applicants
    else:
        raise ValueError("Applicants must be a pandas DataFrame or list of dictionaries.")
        
    if mode.lower() == "optimization":
        return allocate_budget_optimization(df, total_budget=total_budget)
    else:
        return allocate_budget_greedy(df, total_budget=total_budget)
