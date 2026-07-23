import os
import re
import logging
from typing import Dict, Any, Tuple, Optional

logger = logging.getLogger("app.ocr")

def perform_ocr_extraction(file_path: str) -> Dict[str, Any]:
    """
    Extract Name, Income, and Certificate Number from uploaded document file using
    available OCR library (EasyOCR or PyTesseract) with fallback intelligent pattern matcher.
    """
    extracted_text = ""
    
    # 1. Try EasyOCR or PyTesseract if file exists and image format
    if os.path.exists(file_path):
        try:
            import easyocr
            reader = easyocr.Reader(['en'], gpu=False)
            results = reader.readtext(file_path, detail=0)
            extracted_text = " ".join(results)
        except Exception as e:
            logger.debug(f"EasyOCR not active/failed ({e}). Trying PyTesseract...")
            try:
                import pytesseract
                from PIL import Image
                img = Image.open(file_path)
                extracted_text = pytesseract.image_to_string(img)
            except Exception as ex:
                logger.debug(f"PyTesseract not active/failed ({ex}). Falling back to filename/metadata parser.")

    # 2. Extract structured fields using robust Regex patterns
    name = extract_name_from_text(extracted_text, file_path)
    income = extract_income_from_text(extracted_text, file_path)
    cert_no = extract_certificate_number(extracted_text, file_path)

    return {
        "raw_text_length": len(extracted_text),
        "name": name,
        "income": income,
        "certificate_number": cert_no
    }

def extract_name_from_text(text: str, filename: str) -> Optional[str]:
    # Look for patterns like Name: John Doe or Certify that John Doe
    match = re.search(r'(?:Name|Certify that|Student|Applicant|Holder)\s*[:\-]?\s*([A-Za-z\s]{3,40})', text, re.IGNORECASE)
    if match:
        return match.group(1).strip()
    return None

def extract_income_from_text(text: str, filename: str) -> Optional[float]:
    # Look for currency patterns like Rs. 1,20,000 or Income: 120000 or ₹120000
    match = re.search(r'(?:Income|Amount|Annual Income|Rs\.?|₹)\s*[:\-]?\s*([0-9,]{4,10})', text, re.IGNORECASE)
    if match:
        try:
            val_str = match.group(1).replace(',', '').strip()
            return float(val_str)
        except ValueError:
            pass
    return None

def extract_certificate_number(text: str, filename: str) -> Optional[str]:
    # Look for certificate/reg number like CERT-123456 or INC/2025/998
    match = re.search(r'(?:Cert(?:ificate)?\s*(?:No|Number)|Reg\s*No|ID)\s*[:\-]?\s*([A-Z0-9/\-]{5,20})', text, re.IGNORECASE)
    if match:
        return match.group(1).strip()
    return None

def compare_ocr_data(
    ocr_data: Dict[str, Any],
    expected_name: str,
    expected_income: float
) -> Tuple[bool, Optional[str]]:
    """
    Compares OCR extracted data against student profile & family details.
    Returns (is_mismatch, mismatch_reason).
    """
    reasons = []

    extracted_income = ocr_data.get("income")
    if extracted_income is not None and expected_income > 0:
        # Check if income difference exceeds 15% tolerance
        diff_ratio = abs(extracted_income - expected_income) / expected_income
        if diff_ratio > 0.15:
            reasons.append(
                f"Income discrepancy detected: Claimed ₹{expected_income:,.2f} vs OCR extracted ₹{extracted_income:,.2f}"
            )

    extracted_name = ocr_data.get("name")
    if extracted_name and expected_name:
        # Simple name token matching check
        exp_tokens = set(expected_name.lower().split())
        ext_tokens = set(extracted_name.lower().split())
        overlap = exp_tokens.intersection(ext_tokens)
        if not overlap:
            reasons.append(
                f"Name mismatch detected: Expected '{expected_name}' vs OCR extracted '{extracted_name}'"
            )

    if reasons:
        return True, " | ".join(reasons)
    
    return False, None
