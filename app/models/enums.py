import enum

class UserRole(str, enum.Enum):
    STUDENT = "STUDENT"
    ADMIN = "ADMIN"

class DocumentType(str, enum.Enum):
    INCOME_CERTIFICATE = "INCOME_CERTIFICATE"
    MARKSHEET = "MARKSHEET"
    DISABILITY_CERTIFICATE = "DISABILITY_CERTIFICATE"

class DocumentStatus(str, enum.Enum):
    PENDING = "PENDING"
    VERIFIED = "VERIFIED"
    MISMATCH_UNDER_REVIEW = "MISMATCH_UNDER_REVIEW"
    REJECTED = "REJECTED"

class ApplicationStatus(str, enum.Enum):
    DRAFT = "DRAFT"
    SUBMITTED = "SUBMITTED"
    UNDER_REVIEW = "UNDER_REVIEW"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    ALLOCATED = "ALLOCATED"

class AllocationStatus(str, enum.Enum):
    PENDING = "PENDING"
    SELECTED = "SELECTED"
    REJECTED_BUDGET = "REJECTED_BUDGET"
