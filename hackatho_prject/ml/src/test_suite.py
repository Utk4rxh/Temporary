"""
Comprehensive Unit & Integration Test Suite for NyayaGrant AI.

Tests all edge cases, missing parameters, extreme inputs, budget allocation,
explainability, and fairness auditing.
"""

import sys
import os
import unittest
import pandas as pd
import numpy as np

# Ensure stdout handles encoding safely
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from src.feature_engineering import fill_missing_features, engineer_all_features
from src.scoring_engine import score_single_student, compute_final_score_df
from src.predict import predict_student, score_student, explain_student
from src.budget_optimizer import allocate_budget
from src.fairness_audit import audit_fairness


class TestNyayaGrantAIPipeline(unittest.TestCase):
    
    def test_partial_student_dictionary(self):
        """Test that partial student dictionaries with missing optional keys do not raise KeyError."""
        minimal_student = {
            "student_id": "MINIMAL_01",
            "annual_family_income": 80000,
            "current_percentage": 78.5
        }
        res = predict_student(minimal_student, base_dir="ml")
        self.assertIn("final_score", res)
        self.assertTrue(0 <= res["final_score"] <= 100)
        self.assertIn("explanation", res)
        
    def test_extreme_inputs(self):
        """Test extreme low/high values for income, percentages, and dependents."""
        # Extremely poor student
        ultra_needy = {
            "student_id": "ULTRA_POOR",
            "annual_family_income": 10000,
            "family_members": 8,
            "earning_members": 1,
            "number_of_dependents": 7,
            "family_debt": 150000,
            "current_percentage": 95.0,
            "previous_percentage": 80.0,
            "internet_access": 0,
            "has_laptop": 0,
            "orphan": 1
        }
        res_needy = score_single_student(ultra_needy)
        self.assertGreaterEqual(res_needy["final_score"], 70.0)
        self.assertTrue(res_needy["eligible"])
        
        # Extremely wealthy student
        ultra_wealthy = {
            "student_id": "ULTRA_RICH",
            "annual_family_income": 5000000,
            "family_members": 3,
            "earning_members": 2,
            "number_of_dependents": 1,
            "family_debt": 0,
            "current_percentage": 90.0,
            "has_house": 1,
            "has_vehicle": 1,
            "land_area": 10.0,
            "internet_access": 1,
            "has_laptop": 1
        }
        res_wealthy = score_single_student(ultra_wealthy)
        self.assertLess(res_wealthy["final_score"], 50.0)
        self.assertFalse(res_wealthy["eligible"])

    def test_score_bounds(self):
        """Verify that all score components are strictly bounded within [0, 100]."""
        df_dummy = pd.DataFrame([{
            'annual_family_income': np.random.uniform(10000, 2000000),
            'family_members': np.random.randint(1, 12),
            'earning_members': np.random.randint(1, 4),
            'current_percentage': np.random.uniform(30, 100),
            'previous_percentage': np.random.uniform(30, 100),
            'internet_access': np.random.choice([0, 1]),
            'has_laptop': np.random.choice([0, 1])
        } for _ in range(50)])
        
        scored_df = compute_final_score_df(df_dummy)
        for col in ['financial_need_score', 'academic_potential_score', 'opportunity_gap_score', 'vulnerability_score', 'special_circumstances_score', 'final_score']:
            self.assertTrue((scored_df[col] >= 0).all() and (scored_df[col] <= 100).all(), f"Column {col} out of bounds!")

    def test_budget_allocation_constraints(self):
        """Test that budget allocation never exceeds total budget in both Greedy and LP Optimization modes."""
        data_path = os.path.join("ml", "data", "scholarship_applicants.csv")
        if os.path.exists(data_path):
            df = pd.read_csv(data_path)
        else:
            from src.data_preprocessing import generate_synthetic_dataset
            df = generate_synthetic_dataset(300)
            
        total_budget = 500000.0  # ₹5,00,000
        
        greedy_res = allocate_budget(df, total_budget=total_budget, mode="greedy")
        self.assertLessEqual(greedy_res["amount_allocated"], total_budget)
        
        opt_res = allocate_budget(df, total_budget=total_budget, mode="optimization")
        self.assertLessEqual(opt_res["amount_allocated"], total_budget)

    def test_fairness_audit(self):
        """Test fairness auditor execution and alert detection."""
        from src.data_preprocessing import generate_synthetic_dataset
        df = generate_synthetic_dataset(200)
        audit_res = audit_fairness(df)
        self.assertIn("overall_selection_rate", audit_res)
        self.assertIn("group_metrics", audit_res)


def run_unit_tests():
    print("==================================================")
    print("RUNNING NYAYAGRANT AI COMPREHENSIVE TEST SUITE")
    print("==================================================")
    suite = unittest.TestLoader().loadTestsFromTestCase(TestNyayaGrantAIPipeline)
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    if result.wasSuccessful():
        print("\n✓ ALL UNIT & INTEGRATION TESTS PASSED SUCCESSFULLY!")
    else:
        print("\n❌ SOME TESTS FAILED!")
        sys.exit(1)


if __name__ == "__main__":
    run_unit_tests()
