import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "TRACE-X"
    PROJECT_VERSION: str = "1.0.0"
    TAGLINE: str = "Temporal Risk & Activity Correlation Engine"
    API_V1_STR: str = "/api/v1"
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./tracex.db")
    
    # AML & Forensics Thresholds
    PAN_REPORTING_THRESHOLD_INR: float = 50000.0  # ₹50,000 PAN mandate
    CTR_REPORTING_THRESHOLD_INR: float = 1000000.0  # ₹10 Lakhs CTR limit
    STRUCTURING_LOWER_BOUND_RATIO: float = 0.85   # 85% of threshold triggers structuring check
    TEMPORAL_DECAY_LAMBDA: float = 0.015          # Exponential decay parameter (per minute)
    DORMANT_DAYS_THRESHOLD: int = 180              # 180 days inactive = dormant
    
    # Working Shift Bounds
    SHIFT_START_HOUR: int = 9   # 09:00 IST
    SHIFT_END_HOUR: int = 18    # 18:00 IST

    class Config:
        case_sensitive = True

settings = Settings()
