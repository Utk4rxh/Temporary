"""
Data Generation and Data Preprocessing Pipeline for NyayaGrant AI.

1. Generates 1,200 realistic synthetic student records with proper correlation structures.
2. Applies domain feature engineering pipeline.
3. Implements scikit-learn ColumnTransformer, OneHotEncoder, and StandardScaler pipeline.
4. Saves raw and processed data, as well as fitted encoders/scalers.
"""

import os
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline

from src.feature_engineering import fill_missing_features
from src.scoring_engine import compute_final_score_df

RANDOM_SEED = 42
np.random.seed(RANDOM_SEED)

CATEGORICAL_FEATURES = [
    'gender', 'state', 'district', 'urban_rural', 'education_level', 'course_type', 'subject_strength'
]

NUMERICAL_FEATURES = [
    'age', 'annual_family_income', 'family_members', 'earning_members',
    'monthly_expenses', 'family_debt', 'medical_expenses', 'education_expenses',
    'number_of_dependents', 'has_house', 'has_vehicle', 'land_area',
    'previous_percentage', 'current_percentage', 'attendance_percentage',
    'academic_consistency', 'school_quality_score', 'electricity_reliability',
    'distance_to_school', 'internet_access', 'has_laptop', 'has_smartphone',
    'coaching_access', 'library_access', 'single_parent', 'orphan',
    'disability', 'serious_family_illness', 'first_generation_learner',
    'natural_disaster_affected', 'emergency_expenses', 'recently_lost_income',
    'other_special_circumstances',
    'per_capita_income', 'dependency_ratio', 'expense_income_ratio',
    'debt_burden_score', 'academic_improvement', 'financial_need_score',
    'academic_potential_score', 'opportunity_gap_score', 'vulnerability_score',
    'special_circumstances_score'
]


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


def generate_synthetic_dataset(num_records: int = 1200) -> pd.DataFrame:
    """
    Generate realistic synthetic scholarship applicants dataset.
    """
    np.random.seed(RANDOM_SEED)
    
    student_ids = [f"STU{i+1:04d}" for i in range(num_records)]
    ages = np.random.randint(16, 26, size=num_records)
    genders = np.random.choice(['Female', 'Male', 'Non-Binary/Other'], size=num_records, p=[0.50, 0.47, 0.03])
    
    states = ['Maharashtra', 'Uttar Pradesh', 'Bihar', 'Rajasthan', 'West Bengal', 'Tamil Nadu', 'Karnataka', 'Madhya Pradesh', 'Odisha', 'Assam']
    student_states = np.random.choice(states, size=num_records)
    student_districts = [f"District_{s[:3].upper()}_{np.random.randint(1, 6)}" for s in student_states]
    
    urban_rural = np.random.choice(['Urban', 'Semi-Urban', 'Rural'], size=num_records, p=[0.35, 0.25, 0.40])
    education_levels = np.random.choice(['Undergraduate', 'Postgraduate', 'Higher Secondary', 'Diploma'], size=num_records, p=[0.50, 0.20, 0.20, 0.10])
    course_types = np.random.choice(['STEM', 'Arts', 'Commerce', 'Medicine', 'Vocational'], size=num_records, p=[0.40, 0.25, 0.20, 0.10, 0.05])
    subject_strengths = np.random.choice(['Mathematics', 'Science', 'Humanities', 'Languages', 'Commerce'], size=num_records)
    
    raw_income = np.random.exponential(scale=180000, size=num_records) + 40000
    annual_family_income = np.round(np.clip(raw_income, 30000, 1200000), -3)
    
    family_members = np.random.randint(3, 9, size=num_records)
    earning_members = np.random.choice([1, 2, 3], size=num_records, p=[0.70, 0.25, 0.05])
    number_of_dependents = np.clip(family_members - earning_members, 1, 7)
    
    monthly_expenses = np.round(annual_family_income * np.random.uniform(0.6, 1.1, size=num_records) / 12.0, -2)
    
    debt_prob = np.where(annual_family_income < 300000, 0.6, 0.2)
    has_debt_mask = np.random.binomial(1, debt_prob)
    family_debt = np.round(has_debt_mask * np.random.exponential(scale=100000, size=num_records), -3)
    
    medical_expenses = np.random.choice([0, 15000, 40000, 100000], size=num_records, p=[0.60, 0.25, 0.10, 0.05])
    education_expenses = np.round(annual_family_income * np.random.uniform(0.1, 0.35, size=num_records), -2)
    
    has_house = np.random.choice([1, 0], size=num_records, p=[0.75, 0.25])
    has_vehicle = np.where(annual_family_income > 400000, np.random.choice([1, 0], size=num_records, p=[0.7, 0.3]), np.random.choice([1, 0], size=num_records, p=[0.15, 0.85]))
    land_area = np.where(urban_rural == 'Rural', np.random.exponential(scale=1.5, size=num_records), np.random.exponential(scale=0.2, size=num_records))
    land_area = np.round(land_area, 2)
    
    prev_pct = np.random.uniform(50.0, 95.0, size=num_records)
    attendance = np.random.uniform(60.0, 98.0, size=num_records)
    improvement_delta = np.random.normal(loc=3.0, scale=6.0, size=num_records)
    curr_pct = np.clip(prev_pct + improvement_delta, 45.0, 99.0)
    
    academic_consistency = np.round(np.clip(1.0 - (np.abs(improvement_delta) / 25.0), 0.3, 0.98), 2)
    
    is_rural = (urban_rural == 'Rural').astype(int)
    internet_access = np.random.binomial(1, np.where(is_rural, 0.45, 0.85))
    has_laptop = np.random.binomial(1, np.where(annual_family_income < 200000, 0.20, 0.70))
    has_smartphone = np.random.binomial(1, np.where(annual_family_income < 100000, 0.60, 0.95))
    
    school_quality_score = np.random.randint(3, 10, size=num_records)
    coaching_access = np.random.binomial(1, np.where(annual_family_income < 250000, 0.20, 0.65))
    library_access = np.random.binomial(1, np.where(is_rural, 0.30, 0.75))
    electricity_reliability = np.clip(np.where(is_rural, np.random.normal(14, 4, size=num_records), np.random.normal(21, 2, size=num_records)), 4, 24)
    electricity_reliability = np.round(electricity_reliability, 1)
    distance_to_school = np.round(np.where(is_rural, np.random.exponential(8, size=num_records) + 2, np.random.exponential(3, size=num_records) + 0.5), 1)
    
    single_parent = np.random.binomial(1, 0.12, size=num_records)
    orphan = np.random.binomial(1, 0.04, size=num_records)
    disability = np.random.binomial(1, 0.05, size=num_records)
    serious_family_illness = np.random.binomial(1, 0.15, size=num_records)
    first_generation_learner = np.random.binomial(1, 0.35, size=num_records)
    natural_disaster_affected = np.random.binomial(1, 0.08, size=num_records)
    
    emergency_expenses = np.random.choice([0, 20000, 50000, 120000], size=num_records, p=[0.75, 0.15, 0.07, 0.03])
    recently_lost_income = np.random.binomial(1, 0.10, size=num_records)
    other_special_circumstances = np.random.binomial(1, 0.08, size=num_records)
    
    df = pd.DataFrame({
        'student_id': student_ids,
        'age': ages,
        'gender': genders,
        'state': student_states,
        'district': student_districts,
        'urban_rural': urban_rural,
        'education_level': education_levels,
        'course_type': course_types,
        'annual_family_income': annual_family_income,
        'family_members': family_members,
        'earning_members': earning_members,
        'monthly_expenses': monthly_expenses,
        'family_debt': family_debt,
        'medical_expenses': medical_expenses,
        'education_expenses': education_expenses,
        'number_of_dependents': number_of_dependents,
        'has_house': has_house,
        'has_vehicle': has_vehicle,
        'land_area': land_area,
        'previous_percentage': np.round(prev_pct, 2),
        'current_percentage': np.round(curr_pct, 2),
        'attendance_percentage': np.round(attendance, 2),
        'academic_consistency': academic_consistency,
        'subject_strength': subject_strengths,
        'internet_access': internet_access,
        'has_laptop': has_laptop,
        'has_smartphone': has_smartphone,
        'school_quality_score': school_quality_score,
        'coaching_access': coaching_access,
        'library_access': library_access,
        'electricity_reliability': electricity_reliability,
        'distance_to_school': distance_to_school,
        'single_parent': single_parent,
        'orphan': orphan,
        'disability': disability,
        'serious_family_illness': serious_family_illness,
        'first_generation_learner': first_generation_learner,
        'natural_disaster_affected': natural_disaster_affected,
        'emergency_expenses': emergency_expenses,
        'recently_lost_income': recently_lost_income,
        'other_special_circumstances': other_special_circumstances
    })
    
    df_engineered = compute_final_score_df(df)
    noisy_score = df_engineered['final_score'] + np.random.normal(0, 1.5, size=num_records)
    df_engineered['scholarship_eligible'] = (noisy_score >= 50.0).astype(int)
    
    return df_engineered


def build_preprocessing_pipeline() -> ColumnTransformer:
    """
    Build scikit-learn ColumnTransformer for categorical and numerical features.
    """
    num_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='median')),
        ('scaler', StandardScaler())
    ])
    
    cat_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='most_frequent')),
        ('onehot', OneHotEncoder(handle_unknown='ignore', sparse_output=False))
    ])
    
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', num_transformer, NUMERICAL_FEATURES),
            ('cat', cat_transformer, CATEGORICAL_FEATURES)
        ],
        remainder='drop'
    )
    
    return preprocessor


def prepare_and_save_data(base_dir: str = None):
    """
    Generates dataset, splits train/test, fits preprocessor, and saves artifacts.
    """
    ml_root = get_ml_root(base_dir)
    data_dir = os.path.join(ml_root, "data")
    raw_dir = os.path.join(data_dir, "raw")
    processed_dir = os.path.join(data_dir, "processed")
    models_dir = os.path.join(ml_root, "models")
    
    os.makedirs(raw_dir, exist_ok=True)
    os.makedirs(processed_dir, exist_ok=True)
    os.makedirs(models_dir, exist_ok=True)
    
    print("Generating synthetic dataset (1,200 records)...")
    df = generate_synthetic_dataset(num_records=1200)
    
    csv_path = os.path.join(data_dir, "scholarship_applicants.csv")
    raw_path = os.path.join(raw_dir, "scholarship_applicants_raw.csv")
    df.to_csv(csv_path, index=False)
    df.to_csv(raw_path, index=False)
    print(f"Saved dataset to {csv_path}")
    
    X = df.drop(columns=['student_id', 'scholarship_eligible', 'final_score'], errors='ignore')
    y = df['scholarship_eligible']
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=RANDOM_SEED, stratify=y
    )
    
    print("Fitting preprocessing pipeline...")
    preprocessor = build_preprocessing_pipeline()
    X_train_trans = preprocessor.fit_transform(X_train)
    X_test_trans = preprocessor.transform(X_test)
    
    cat_encoder = preprocessor.named_transformers_['cat'].named_steps['onehot']
    encoded_cat_names = cat_encoder.get_feature_names_out(CATEGORICAL_FEATURES)
    all_feature_names = NUMERICAL_FEATURES + list(encoded_cat_names)
    
    np.save(os.path.join(processed_dir, "X_train.npy"), X_train_trans)
    np.save(os.path.join(processed_dir, "X_test.npy"), X_test_trans)
    np.save(os.path.join(processed_dir, "y_train.npy"), y_train.to_numpy())
    np.save(os.path.join(processed_dir, "y_test.npy"), y_test.to_numpy())
    
    joblib.dump(preprocessor, os.path.join(models_dir, "scaler.pkl"))
    joblib.dump({
        'feature_names': all_feature_names,
        'num_features': NUMERICAL_FEATURES,
        'cat_features': CATEGORICAL_FEATURES
    }, os.path.join(models_dir, "encoders.pkl"))
    
    print(f"Successfully processed data and saved artifacts to {models_dir}")
    return df, X_train, X_test, y_train, y_test


if __name__ == "__main__":
    prepare_and_save_data()
