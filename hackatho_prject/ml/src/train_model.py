"""
Model Training Module for NyayaGrant AI.

Trains RandomForestClassifier (primary) and GradientBoostingClassifier / XGBoost (comparison).
Evaluates cross-validation performance with focus on Recall and F1 score.
Saves the trained model to ml/models/scholarship_model.pkl.
"""

import os
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.model_selection import cross_validate, StratifiedKFold
try:
    from xgboost import XGBClassifier
    HAS_XGBOOST = True
except ImportError:
    HAS_XGBOOST = False

from src.data_preprocessing import prepare_and_save_data, RANDOM_SEED


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


def train_and_evaluate_models(base_dir: str = None):
    """
    Train primary RandomForest model and comparison models.
    """
    ml_root = get_ml_root(base_dir)
    models_dir = os.path.join(ml_root, "models")
    processed_dir = os.path.join(ml_root, "data", "processed")
    
    X_train_path = os.path.join(processed_dir, "X_train.npy")
    y_train_path = os.path.join(processed_dir, "y_train.npy")
    
    if not os.path.exists(X_train_path):
        print("Data files not found. Running prepare_and_save_data()...")
        prepare_and_save_data(base_dir=ml_root)
        
    X_train = np.load(X_train_path)
    y_train = np.load(y_train_path)
    
    print(f"\n--- Training Set Loaded: {X_train.shape[0]} samples, {X_train.shape[1]} features ---")
    
    models = {
        "RandomForestClassifier": RandomForestClassifier(
            n_estimators=150,
            max_depth=12,
            min_samples_split=4,
            random_state=RANDOM_SEED,
            class_weight='balanced'
        ),
        "GradientBoostingClassifier": GradientBoostingClassifier(
            n_estimators=100,
            learning_rate=0.1,
            max_depth=5,
            random_state=RANDOM_SEED
        )
    }
    
    if HAS_XGBOOST:
        models["XGBClassifier"] = XGBClassifier(
            n_estimators=100,
            max_depth=5,
            learning_rate=0.1,
            random_state=RANDOM_SEED,
            eval_metric='logloss'
        )
        
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=RANDOM_SEED)
    scoring = ['accuracy', 'precision', 'recall', 'f1', 'roc_auc']
    
    best_model_name = "RandomForestClassifier"
    best_f1 = -1.0
    best_model_obj = None
    
    print("\n--- Model Cross-Validation Results (5-Fold) ---")
    for name, model in models.items():
        results = cross_validate(model, X_train, y_train, cv=cv, scoring=scoring)
        
        acc = results['test_accuracy'].mean()
        prec = results['test_precision'].mean()
        rec = results['test_recall'].mean()
        f1 = results['test_f1'].mean()
        roc = results['test_roc_auc'].mean()
        
        print(f"\nModel: {name}")
        print(f"  Accuracy : {acc:.4f}")
        print(f"  Precision: {prec:.4f}")
        print(f"  Recall   : {rec:.4f} (High priority)")
        print(f"  F1 Score : {f1:.4f} (High priority)")
        print(f"  ROC-AUC  : {roc:.4f}")
        
        if f1 > best_f1:
            best_f1 = f1
            best_model_name = name
            best_model_obj = model
            
    print(f"\nFitting selected primary model: {best_model_name} on full training set...")
    best_model_obj.fit(X_train, y_train)
    
    model_save_path = os.path.join(models_dir, "scholarship_model.pkl")
    joblib.dump(best_model_obj, model_save_path)
    print(f"Model saved to {model_save_path}")
    
    return best_model_obj, best_model_name


if __name__ == "__main__":
    train_and_evaluate_models()
