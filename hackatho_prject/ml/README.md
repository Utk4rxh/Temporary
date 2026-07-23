# NyayaGrant AI - Production Machine Learning & Decision Support System

> **Fairly identify students who need financial aid the most while considering their academic potential and available opportunities.**

NyayaGrant AI is an explainable, objective, reproducible, and demographic-fair Machine Learning and Decision Support platform built for equitable scholarship allocation.

---

## 🏗️ Modular Architecture & Directory Structure

```text
ml/
├── data/
│   ├── raw/
│   │   └── scholarship_applicants_raw.csv
│   ├── processed/
│   │   ├── X_train.npy
│   │   ├── X_test.npy
│   │   ├── y_train.npy
│   │   └── y_test.npy
│   └── scholarship_applicants.csv
│
├── notebooks/
│   └── exploratory_analysis.ipynb
│
├── src/
│   ├── __init__.py
│   ├── data_preprocessing.py
│   ├── feature_engineering.py
│   ├── scoring_engine.py
│   ├── train_model.py
│   ├── evaluate_model.py
│   ├── explainability.py
│   ├── fairness_audit.py
│   ├── budget_optimizer.py
│   ├── predict.py
│   └── run_pipeline.py
│
├── models/
│   ├── scholarship_model.pkl
│   ├── scaler.pkl
│   └── encoders.pkl
│
├── requirements.txt
└── README.md
```

---

## 🧮 The 5-Pillar Weighted Scoring Formula

Rather than selecting applicants solely based on raw test marks, NyayaGrant AI calculates 5 normalized sub-scores ($0 - 100$) and combines them using the following official weighting matrix:

$$\text{Final Score} = 0.35 \times S_{\text{Financial Need}} + 0.25 \times S_{\text{Academic Potential}} + 0.20 \times S_{\text{Opportunity Gap}} + 0.15 \times S_{\text{Vulnerability}} + 0.05 \times S_{\text{Special Circumstances}}$$

### 📊 Sub-score Breakdown

| Pillar | Weight | Description & Key Inputs |
| :--- | :---: | :--- |
| **Financial Need** | **35%** | Evaluates per capita family income, dependency ratio, debt-to-income burden, medical expenses, and asset penalties. |
| **Academic Potential** | **25%** | Evaluates academic marks contextualized by improvement trend (+%) and resource adversity. Students with lower marks but strong upward improvement receive boosted potential. |
| **Opportunity Gap** | **20%** | Quantifies resource deprivation: lack of laptop, internet, coaching access, low school infrastructure score, electricity unreliability, and distance to school. |
| **Social Vulnerability** | **15%** | Incorporates orphan status, single parent household, disability, family illness, first-generation learner status, and natural disaster impact. |
| **Special Circumstances**| **5%** | Accounts for emergency financial shocks, recent income loss, and special family crises. |

---

## 🤖 Machine Learning Model & Evaluation

The system trains a **RandomForestClassifier** (primary) alongside **GradientBoosting** and **XGBoost** models.

Because scholarship decisions impact underprivileged students, model selection and hyperparameter tuning prioritize **Recall** and **F1 Score** over pure accuracy.

### 📈 Test Set Performance

- **Accuracy**: `0.9417`
- **Precision**: `0.9405`
- **Recall**: `0.9349` *(Priority metric for non-exclusion of needy students)*
- **F1 Score**: `0.9377`
- **ROC-AUC**: `0.9840`

---

## 💡 Explainable AI (XAI) & SHAP Integration

Every prediction returns an automated, human-understandable explanation generated from real student features:

```json
{
    "student_id": "STU001",
    "eligible": true,
    "final_score": 86.4,
    "scores": {
        "financial_need": 32.0,
        "academic_potential": 20.0,
        "opportunity_gap": 18.0,
        "vulnerability": 10.0,
        "special_circumstances": 4.0
    },
    "explanation": "This applicant received high priority primarily because of significant financial pressure, limited access to educational resources, and strong academic improvement.",
    "top_positive_factors": [
        "Low annual family income (₹120,000)",
        "High family dependency burden (5 dependents)",
        "Strong academic improvement (+11.5%)",
        "Lack of personal computer/laptop access"
    ],
    "top_negative_factors": [
        "No major negative scoring factors"
    ],
    "recommended_scholarship": 50000,
    "scholarship_tier": "Tier 1 (Full Grant)"
}
```

---

## ⚖️ Demographic Fairness Audit

The fairness module audits selection rates across demographic groups:
- **Gender** (Female, Male, Non-Binary)
- **Urban / Semi-Urban / Rural status**
- **Income Groups** (< ₹1.5L, ₹1.5L-₹3L, ₹3L-₹6L, > ₹6L)
- **Geographic Regions** (State breakdown)

If a demographic disparity is detected (e.g. selection rate skewed against a group), the system flags an alert for human administrator review. Scores are never artificially tampered with.

---

## 💰 Budget Optimization Engine

NyayaGrant AI provides two budget allocation strategies for a given fund pool (e.g. ₹10,00,000):

### Tier Structure:
- **Priority Score $\ge$ 85**: ₹50,000 *(Tier 1)*
- **Priority Score $\ge$ 75**: ₹30,000 *(Tier 2)*
- **Priority Score $\ge$ 65**: ₹15,000 *(Tier 3)*

### Modes:
1. **MODE 1: Greedy Allocation (Default)**: Ranks applicants by priority score descending and grants funds until budget is exhausted.
2. **MODE 2: Scipy Linear Programming Optimization (`linprog`)**: Solves a 0-1 Knapsack linear program maximizing total priority score utility $\sum (x_i \cdot \text{Score}_i)$ subject to $\sum (x_i \cdot \text{Grant}_i) \le \text{Total Budget}$.

---

## 🔌 API Gateway & Integration

The ML module exposes python functions ready for integration into **FastAPI**, **Streamlit**, **React**, or **Supabase**:

```python
from ml.src.predict import predict_student, score_student, explain_student, allocate_budget, audit_fairness

# 1. Score a single student
result = score_student(student_dict)

# 2. Predict & Explain
prediction = predict_student(student_dict)

# 3. Allocate Budget
allocation = allocate_budget(applicants_df, total_budget=1000000.0, mode="greedy")
```

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
pip install -r ml/requirements.txt
```

### 2. Run Complete End-to-End Pipeline & Verification
```bash
python ml/src/run_pipeline.py
```

### 3. Open Notebook
```bash
jupyter notebook ml/notebooks/exploratory_analysis.ipynb
```
