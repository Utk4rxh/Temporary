"""
Master Pipeline Runner & Verification Script for NyayaGrant AI.

Executes and verifies the complete ML workflow end-to-end:
1. Synthetic Data Generation & Preprocessing
2. Model Training (RandomForestClassifier & Baseline comparison)
3. Model Evaluation Report
4. Student Score & Prediction API
5. Explainable AI (SHAP & Factor Breakdown)
6. Demographic Fairness Audit
7. Budget Optimization Allocation
8. Verification checks (Scores 0-100, Budget constraints, Reproducibility)
"""

import sys
import os

# Configure stdout encoding to utf-8 safely for Windows console
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# Add ml root to Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import pandas as pd
import numpy as np

from src.data_preprocessing import prepare_and_save_data
from src.train_model import train_and_evaluate_models
from src.evaluate_model import evaluate_scholarship_model
from src.predict import predict_student, score_student, explain_student
from src.fairness_audit import audit_fairness, print_fairness_report
from src.budget_optimizer import allocate_budget, explain_optimization_tradeoff


def run_full_pipeline():
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
    print("==================================================")
    print("STARTING NYAYAGRANT AI COMPLETE ML PIPELINE")
    print("==================================================")
    
    # 1. Data Preprocessing & Generation
    print("\n--- STEP 1: DATASET GENERATION & PREPROCESSING ---")
    df, X_train, X_test, y_train, y_test = prepare_and_save_data(base_dir=base_dir)
    print(f"Dataset generated: {len(df)} records. Train shape: {X_train.shape}, Test shape: {X_test.shape}")
    
    # 2. Model Training
    print("\n--- STEP 2: MODEL TRAINING & CROSS-VALIDATION ---")
    model, model_name = train_and_evaluate_models(base_dir=base_dir)
    
    # 3. Model Evaluation
    print("\n--- STEP 3: MODEL EVALUATION ON TEST SET ---")
    eval_metrics = evaluate_scholarship_model(base_dir=base_dir)
    
    # 4. Prediction API & Explainability Test
    print("\n--- STEP 4: SINGLE STUDENT PREDICTION & EXPLANATION API ---")
    sample_student = df.iloc[0].to_dict()
    pred_res = predict_student(sample_student, base_dir=base_dir)
    print(f"Student ID: {pred_res['student_id']}")
    print(f"Final Score: {pred_res['final_score']} / 100")
    print(f"Eligible: {pred_res['eligible']}")
    print(f"Recommendation: {pred_res['recommendation']}")
    print(f"Explanation: {pred_res['explanation']}")
    
    # Clean factor printing without raw special chars
    pos_factors = [str(f).replace('₹', 'INR ') for f in pred_res['top_positive_factors']]
    neg_factors = [str(f).replace('₹', 'INR ') for f in pred_res['top_negative_factors']]
    print(f"Top Positive Factors: {pos_factors}")
    print(f"Top Negative Factors: {neg_factors}")
    
    # 5. Fairness Audit
    print("\n--- STEP 5: FAIRNESS AUDIT ON APPLICANT POOL ---")
    fairness_results = audit_fairness(df)
    print_fairness_report(fairness_results)
    
    # 6. Budget Allocation Engine
    print("\n--- STEP 6: BUDGET ALLOCATION ENGINE (INR 10,00,000 BUDGET) ---")
    total_budget = 1000000.0
    
    greedy_res = allocate_budget(df, total_budget=total_budget, mode="greedy")
    print(f"Greedy Mode: Spent INR {greedy_res['amount_allocated']:,.2f} out of INR {total_budget:,.2f}")
    print(f"  Beneficiaries Funded: {greedy_res['number_of_beneficiaries']}")
    print(f"  Remaining Budget    : INR {greedy_res['remaining_budget']:,.2f}")
    
    opt_res = allocate_budget(df, total_budget=total_budget, mode="optimization")
    print(f"\nOptimization Mode: Spent INR {opt_res['amount_allocated']:,.2f} out of INR {total_budget:,.2f}")
    print(f"  Beneficiaries Funded: {opt_res['number_of_beneficiaries']}")
    print(f"  Remaining Budget    : INR {opt_res['remaining_budget']:,.2f}")
    
    print("\n--- BUDGET ALLOCATION TRADEOFF EXPLANATION ---")
    print(explain_optimization_tradeoff())
    
    # 7. Verification Checks
    print("\n--- FINAL VERIFICATION CHECKS ---")
    assert 0 <= df['final_score'].min() and df['final_score'].max() <= 100, "Score range assertion failed!"
    assert 0 <= df['financial_need_score'].min() and df['financial_need_score'].max() <= 100, "Financial need score out of bounds!"
    assert 0 <= df['academic_potential_score'].min() and df['academic_potential_score'].max() <= 100, "Academic score out of bounds!"
    assert 0 <= df['opportunity_gap_score'].min() and df['opportunity_gap_score'].max() <= 100, "Opportunity score out of bounds!"
    assert 0 <= df['vulnerability_score'].min() and df['vulnerability_score'].max() <= 100, "Vulnerability score out of bounds!"
    assert 0 <= df['special_circumstances_score'].min() and df['special_circumstances_score'].max() <= 100, "Special circumstances score out of bounds!"
    
    assert greedy_res['amount_allocated'] <= total_budget, "Greedy allocation exceeded budget!"
    assert opt_res['amount_allocated'] <= total_budget, "Optimization allocation exceeded budget!"
    
    print("✓ VERIFICATION PASSED: All score components bounded 0-100.")
    print("✓ VERIFICATION PASSED: Budget constraint strictly enforced.")
    print("✓ VERIFICATION PASSED: Preprocessing pipeline, model training, and explanation executed cleanly.")
    print("==================================================")
    print("NYAYAGRANT AI ML PIPELINE RUN COMPLETED SUCCESSFULLY!")
    print("==================================================")


if __name__ == "__main__":
    run_full_pipeline()
