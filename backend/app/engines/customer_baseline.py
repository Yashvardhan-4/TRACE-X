import math
from typing import Dict, Any

class CustomerBaselineEngine:
    """Engine 2: Evaluates customer transactional behavior against historical profile."""

    def evaluate_transaction(
        self,
        amount: float,
        historical_mean: float,
        historical_std: float,
        is_new_beneficiary: bool = False,
        is_unusual_channel: bool = False
    ) -> Dict[str, Any]:
        
        std_val = historical_std if historical_std > 0 else (historical_mean * 0.25)
        z_score = (amount - historical_mean) / (std_val if std_val > 0 else 1.0)
        deviation_multiple = amount / (historical_mean if historical_mean > 0 else 1.0)

        # Baseline anomaly conditions
        is_z_score_elevated = z_score >= 3.0
        is_multiple_extreme = deviation_multiple >= 5.0
        flagged = is_z_score_elevated or (is_multiple_extreme and is_new_beneficiary)

        # Compute normalized score (0 to 100)
        normalized_score = min(100.0, max(0.0, (z_score / 5.0) * 80.0 + (20.0 if is_new_beneficiary else 0.0)))

        return {
            "flagged": flagged,
            "z_score": round(z_score, 2),
            "deviation_multiple": round(deviation_multiple, 1),
            "is_new_beneficiary": is_new_beneficiary,
            "is_unusual_channel": is_unusual_channel,
            "anomaly_score": round(normalized_score, 1),
            "rule": "MODEL_CUSTOMER_BEHAVIORAL_BASELINE"
        }

customer_baseline_engine = CustomerBaselineEngine()
