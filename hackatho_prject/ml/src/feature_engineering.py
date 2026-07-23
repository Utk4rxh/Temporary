"""
Feature Engineering Module for NyayaGrant AI.

Calculates meaningful derived features and sub-scores for:
1. Financial Need Score (0-100)
2. Academic Potential Score (0-100)
3. Opportunity Gap Score (0-100)
4. Social Vulnerability Score (0-100)
5. Special Circumstances Score (0-100)

Robust against missing optional input keys.
"""

import numpy as np
import pandas as pd

DEFAULT_FEATURE_VALUES = {
    'annual_family_income': 300000.0,
    'family_members': 4,
    'earning_members': 1,
    'number_of_dependents': 2,
    'monthly_expenses': 15000.0,
    'family_debt': 0.0,
    'medical_expenses': 0.0,
    'education_expenses': 10000.0,
    'has_house': 1,
    'has_vehicle': 0,
    'land_area': 0.0,
    'previous_percentage': 70.0,
    'current_percentage': 70.0,
    'attendance_percentage': 85.0,
    'academic_consistency': 0.7,
    'school_quality_score': 5,
    'electricity_reliability': 18.0,
    'distance_to_school': 5.0,
    'internet_access': 1,
    'has_laptop': 0,
    'has_smartphone': 1,
    'coaching_access': 0,
    'library_access': 0,
    'single_parent': 0,
    'orphan': 0,
    'disability': 0,
    'serious_family_illness': 0,
    'first_generation_learner': 0,
    'natural_disaster_affected': 0,
    'emergency_expenses': 0.0,
    'recently_lost_income': 0,
    'other_special_circumstances': 0
}


def fill_missing_features(df: pd.DataFrame) -> pd.DataFrame:
    """Ensure all required feature columns exist in DataFrame with sensible defaults."""
    df = df.copy()
    for col, default_val in DEFAULT_FEATURE_VALUES.items():
        if col not in df.columns:
            df[col] = default_val
        else:
            df[col] = df[col].fillna(default_val)
    return df


def compute_derived_financial_features(df: pd.DataFrame) -> pd.DataFrame:
    """Compute financial intermediate ratios and scores."""
    df = fill_missing_features(df)
    
    # 1. Per Capita Income
    df['per_capita_income'] = df['annual_family_income'] / np.maximum(df['family_members'], 1)
    
    # 2. Dependency Ratio
    earning_safe = np.maximum(df['earning_members'], 1)
    df['dependency_ratio'] = df['number_of_dependents'] / earning_safe
    
    # 3. Expense to Income Ratio
    annual_expenses = df['monthly_expenses'] * 12 + df['medical_expenses'] + df['education_expenses']
    df['expense_income_ratio'] = annual_expenses / np.maximum(df['annual_family_income'], 1000)
    
    # 4. Debt Burden Score
    df['debt_burden_score'] = df['family_debt'] / np.maximum(df['annual_family_income'], 1000)
    
    return df


def calculate_financial_need_score(df: pd.DataFrame) -> pd.Series:
    """
    Calculate Financial Need Score (0 - 100).
    Higher score indicates greater financial hardship / need.
    """
    df_derived = compute_derived_financial_features(df)
    
    income_factor = np.clip((800000.0 - df_derived['annual_family_income']) / 750000.0, 0.0, 1.0) * 45.0
    dep_factor = np.clip(df_derived['dependency_ratio'] / 3.0, 0.0, 1.0) * 25.0
    expense_factor = np.clip(df_derived['expense_income_ratio'] / 1.0, 0.0, 1.0) * 15.0
    debt_factor = np.clip(df_derived['debt_burden_score'] / 1.0, 0.0, 1.0) * 15.0
    
    has_house = df_derived['has_house']
    has_vehicle = df_derived['has_vehicle']
    land_area = df_derived['land_area']
    
    asset_penalty = (has_house * 3.0) + (has_vehicle * 4.0) + np.clip(land_area / 5.0, 0.0, 1.0) * 3.0
    
    raw_score = income_factor + dep_factor + expense_factor + debt_factor - asset_penalty
    financial_need_score = np.clip(raw_score, 0.0, 100.0)
    
    return np.round(financial_need_score, 2)


def calculate_academic_potential_score(df: pd.DataFrame) -> pd.Series:
    """
    Calculate Academic Potential Score (0 - 100).
    Considers improvement, consistency, attendance, and context (resource adversity).
    """
    df = fill_missing_features(df)
    
    curr_pct = df['current_percentage']
    prev_pct = df['previous_percentage']
    attendance = df['attendance_percentage']
    
    base_perf = np.clip(curr_pct / 100.0, 0.0, 1.0) * 40.0
    improvement = curr_pct - prev_pct
    improvement_pts = np.clip((improvement + 5.0) / 20.0, 0.0, 1.0) * 30.0
    
    attendance_pts = np.clip(attendance / 100.0, 0.0, 1.0) * 10.0
    consistency_pts = np.clip(df['academic_consistency'], 0.0, 1.0) * 5.0
    
    opp_gap = df.get('opportunity_gap_score', None)
    if opp_gap is None:
        lack_tech = (1 - df['has_laptop']) + (1 - df['internet_access'])
        context_resilience = (lack_tech * 4.0) + ((10 - df['school_quality_score']) * 0.7)
    else:
        context_resilience = (opp_gap / 100.0) * 15.0
        
    context_pts = np.clip(context_resilience, 0.0, 15.0)
    
    raw_score = base_perf + improvement_pts + attendance_pts + consistency_pts + context_pts
    return np.round(np.clip(raw_score, 0.0, 100.0), 2)


def calculate_opportunity_gap_score(df: pd.DataFrame) -> pd.Series:
    """
    Calculate Opportunity Gap Score (0 - 100).
    Measures degree of resource deprivation. Higher score = higher opportunity gap.
    """
    df = fill_missing_features(df)
    
    no_internet = (1 - df['internet_access']) * 15.0
    no_laptop = (1 - df['has_laptop']) * 20.0
    no_smartphone = (1 - df['has_smartphone']) * 10.0
    
    school_qual = np.clip((10.0 - df['school_quality_score']) / 10.0, 0.0, 1.0) * 15.0
    no_coaching = (1 - df['coaching_access']) * 10.0
    no_library = (1 - df['library_access']) * 10.0
    
    electricity_lack = np.clip((24.0 - df['electricity_reliability']) / 24.0, 0.0, 1.0) * 10.0
    distance_factor = np.clip(df['distance_to_school'] / 25.0, 0.0, 1.0) * 10.0
    
    raw_score = (no_internet + no_laptop + no_smartphone + 
                 school_qual + no_coaching + no_library + 
                 electricity_lack + distance_factor)
                 
    return np.round(np.clip(raw_score, 0.0, 100.0), 2)


def calculate_vulnerability_score(df: pd.DataFrame) -> pd.Series:
    """
    Calculate Social Vulnerability Score (0 - 100).
    """
    df = fill_missing_features(df)
    
    orphan_pts = df['orphan'] * 35.0
    single_parent_pts = df['single_parent'] * 25.0
    disability_pts = df['disability'] * 25.0
    illness_pts = df['serious_family_illness'] * 15.0
    first_gen_pts = df['first_generation_learner'] * 15.0
    disaster_pts = df['natural_disaster_affected'] * 15.0
    
    raw_score = (orphan_pts + single_parent_pts + disability_pts + 
                 illness_pts + first_gen_pts + disaster_pts)
                 
    return np.round(np.clip(raw_score, 0.0, 100.0), 2)


def calculate_special_circumstances_score(df: pd.DataFrame) -> pd.Series:
    """
    Calculate Special Circumstances Score (0 - 100).
    """
    df = fill_missing_features(df)
    
    emergency = df['emergency_expenses']
    income = np.maximum(df['annual_family_income'], 1000)
    emerg_ratio = emergency / income
    emerg_pts = np.clip(emerg_ratio / 0.25, 0.0, 1.0) * 45.0
    
    income_loss_pts = df['recently_lost_income'] * 35.0
    other_circ_pts = df['other_special_circumstances'] * 25.0
    
    raw_score = emerg_pts + income_loss_pts + other_circ_pts
    return np.round(np.clip(raw_score, 0.0, 100.0), 2)


def engineer_all_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Engineers all sub-scores and derived features for a given DataFrame.
    """
    df = fill_missing_features(df)
    
    df = compute_derived_financial_features(df)
    
    df['opportunity_gap_score'] = calculate_opportunity_gap_score(df)
    df['financial_need_score'] = calculate_financial_need_score(df)
    df['academic_potential_score'] = calculate_academic_potential_score(df)
    df['vulnerability_score'] = calculate_vulnerability_score(df)
    df['special_circumstances_score'] = calculate_special_circumstances_score(df)
    
    df['academic_improvement'] = df['current_percentage'] - df['previous_percentage']
    
    return df
