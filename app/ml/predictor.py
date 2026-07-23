from typing import Dict, Any, Union

class MLPredictor:
    @staticmethod
    def predict(
        cgpa: float,
        attendance: float,
        annual_income: float,
        family_size: int,
        earning_members: int,
        internet_access: Union[str, bool],
        laptop_available: Union[str, bool],
        study_hours: float,
        previous_percentage: float
    ) -> Dict[str, Any]:
        """
        Calculates Financial Need Index, Merit Index, AI Priority Score,
        Recommendation flag, Recommended Amount, and natural language explanation.
        """
        # Convert string flags to boolean
        has_internet = internet_access in [True, "Yes", "yes", "YES", 1, "true", "True"]
        has_laptop = laptop_available in [True, "Yes", "yes", "YES", 1, "true", "True"]

        # --- 1. Compute Financial Need Index (0 - 100) ---
        # Base income need: 100 for income <= 50k, scaling down to 0 for income >= 800k
        if annual_income <= 50000:
            income_score = 100.0
        elif annual_income >= 800000:
            income_score = 10.0
        else:
            # Linear interpolation between 50k (100 pts) and 800k (10 pts)
            income_score = 100.0 - ((annual_income - 50000) / 750000.0) * 90.0

        # Family dependency ratio score
        dep_ratio = family_size / max(earning_members, 1)
        dep_score = min(dep_ratio * 7.5, 25.0)

        # Digital hardship bonus
        digital_hardship = 0.0
        if not has_internet:
            digital_hardship += 5.0
        if not has_laptop:
            digital_hardship += 5.0

        raw_need = (income_score * 0.70) + (dep_score * 0.20) + digital_hardship
        financial_need_index = round(min(max(raw_need, 0.0), 100.0), 2)

        # --- 2. Compute Merit Index (0 - 100) ---
        # CGPA score (scaled 0-10 -> 0-45 points)
        cgpa_score = (min(max(cgpa, 0.0), 10.0) / 10.0) * 45.0
        
        # Attendance score (0-100 -> 0-25 points)
        att_score = (min(max(attendance, 0.0), 100.0) / 100.0) * 25.0
        
        # Previous percentage (0-100 -> 0-20 points)
        prev_score = (min(max(previous_percentage, 0.0), 100.0) / 100.0) * 20.0

        # Study hours (0-12 -> 0-10 points)
        study_score = (min(max(study_hours, 0.0), 12.0) / 12.0) * 10.0

        merit_index = round(min(max(cgpa_score + att_score + prev_score + study_score, 0.0), 100.0), 2)

        # --- 3. Compute AI Priority Score (Weighted Blend) ---
        ai_priority_score = round((0.60 * financial_need_index) + (0.40 * merit_index), 2)

        # --- 4. Recommendation & Scholarship Amount Tiering ---
        recommended = ai_priority_score >= 60.0

        if ai_priority_score >= 85.0:
            scholarship_amount = 75000.0
        elif ai_priority_score >= 75.0:
            scholarship_amount = 50000.0
        elif ai_priority_score >= 60.0:
            scholarship_amount = 25000.0
        else:
            scholarship_amount = 0.0

        # --- 5. Generate Natural Language Explanation ---
        need_desc = "High" if financial_need_index >= 75 else ("Moderate" if financial_need_index >= 50 else "Low")
        merit_desc = "exceptional" if merit_index >= 80 else ("strong" if merit_index >= 60 else "moderate")

        explanation = f"{need_desc} financial need (index {financial_need_index}) combined with {merit_desc} academic consistency (merit index {merit_index})."

        return {
            "financial_need_index": financial_need_index,
            "merit_index": merit_index,
            "ai_priority_score": ai_priority_score,
            "recommended": recommended,
            "scholarship_amount": scholarship_amount,
            "explanation": explanation
        }
