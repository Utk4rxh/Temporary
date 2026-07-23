"""
Model Evaluation Module for NyayaGrant AI.

Evaluates test set performance of the scholarship model and outputs:
- Accuracy, Precision, Recall, F1 Score, ROC-AUC
- Confusion Matrix
- Full Classification Report
- Top Feature Importances
"""

import os
import joblib
import numpy as np
import pandas as pd
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, confusion_matrix, classification_report
)

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


def evaluate_scholarship_model(base_dir: str = None):
    """
    Evaluates the saved model on the test dataset and prints an evaluation report.
    """
    ml_root = get_ml_root(base_dir)
    models_dir = os.path.join(ml_root, "models")
    processed_dir = os.path.join(ml_root, "data", "processed")
    
    model_path = os.path.join(models_dir, "scholarship_model.pkl")
    encoder_path = os.path.join(models_dir, "encoders.pkl")
    X_test_path = os.path.join(processed_dir, "X_test.npy")
    y_test_path = os.path.join(processed_dir, "y_test.npy")
    
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model file not found at {model_path}. Run train_model.py first.")
        
    model = joblib.load(model_path)
    encoders_info = joblib.load(encoder_path)
    feature_names = encoders_info['feature_names']
    
    X_test = np.load(X_test_path)
    y_test = np.load(y_test_path)
    
    y_pred = model.predict(X_test)
    if hasattr(model, "predict_proba"):
        y_prob = model.predict_proba(X_test)[:, 1]
    else:
        y_prob = y_pred
        
    acc = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred)
    rec = recall_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)
    roc = roc_auc_score(y_test, y_prob)
    cm = confusion_matrix(y_test, y_pred)
    
    report_str = f"""
==================================================
NYAYAGRANT AI - MODEL EVALUATION REPORT
==================================================

Model Type: {type(model).__name__}
Test Dataset Size: {len(y_test)} samples

PRIMARY PERFORMANCE METRICS:
--------------------------------------------------
Accuracy : {acc:.4f}
Precision: {prec:.4f}
Recall   : {rec:.4f}  [PRIORITY FOR FAIR ALLOCATION]
F1 Score : {f1:.4f}  [PRIORITY FOR HARMONIC BALANCE]
ROC-AUC  : {roc:.4f}

CONFUSION MATRIX:
--------------------------------------------------
[ [ TN: {cm[0][0]:3d} , FP: {cm[0][1]:3d} ]
  [ FN: {cm[1][0]:3d} , TP: {cm[1][1]:3d} ] ]

CLASSIFICATION REPORT:
--------------------------------------------------
{classification_report(y_test, y_pred, target_names=['Not Eligible (0)', 'Eligible (1)'])}
"""
    print(report_str)
    
    top_features = []
    if hasattr(model, "feature_importances_"):
        importances = model.feature_importances_
        indices = np.argsort(importances)[::-1]
        
        print("TOP 10 MOST IMPORTANT FEATURES:")
        print("--------------------------------------------------")
        for rank, idx in enumerate(indices[:10], 1):
            name = feature_names[idx] if idx < len(feature_names) else f"feature_{idx}"
            val = importances[idx]
            print(f" {rank:2d}. {name:<35}: {val:.4f}")
            top_features.append((name, float(val)))
            
    return {
        "accuracy": acc,
        "precision": prec,
        "recall": rec,
        "f1_score": f1,
        "roc_auc": roc,
        "confusion_matrix": cm.tolist(),
        "top_features": top_features
    }


if __name__ == "__main__":
    evaluate_scholarship_model()
