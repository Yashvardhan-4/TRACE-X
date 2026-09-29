import math
from datetime import datetime
from typing import Dict, Any, List
from app.core.config import settings

class TemporalCorrelationEngine:
    """Engine 6: Measures causal sequencing and temporal proximity decay."""

    def __init__(self):
        self.decay_lambda = settings.TEMPORAL_DECAY_LAMBDA  # default 0.015 per minute

    def calculate_temporal_correlation(self, delta_minutes: float) -> Dict[str, Any]:
        """Calculates exponential time decay: S = exp(-lambda * delta_t)."""
        decay_factor = math.exp(-self.decay_lambda * max(0.0, delta_minutes))
        temporal_score = round(decay_factor * 100.0, 1)

        # Interpret correlation strength
        if delta_minutes <= 30:
            strength = "CRITICAL_PROXIMITY"
        elif delta_minutes <= 120:
            strength = "HIGH_PROXIMITY"
        elif delta_minutes <= 720:
            strength = "MODERATE_PROXIMITY"
        else:
            strength = "DISTANT"

        return {
            "delta_minutes": round(delta_minutes, 1),
            "decay_lambda": self.decay_lambda,
            "temporal_correlation_score": temporal_score,
            "strength": strength,
            "rule": "ENGINE_TEMPORAL_DECAY"
        }

    def validate_causal_attack_chain(self, events: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Verifies chronological order of the attack chain from access to cash-out."""
        sorted_events = sorted(events, key=lambda x: x.get("timestamp", datetime.min))
        
        has_insider_precursor = False
        has_rapid_tx = False
        chain_valid = True

        for i in range(len(sorted_events) - 1):
            curr_ev = sorted_events[i]
            next_ev = sorted_events[i + 1]

            if curr_ev.get("action_type") in ["MODIFY_KYC", "ADD_BENEFICIARY"]:
                has_insider_precursor = True
                if next_ev.get("action_type") in ["TRANSFER_OUT", "DISBURSED", "FLAGGED_TX"]:
                    has_rapid_tx = True

        return {
            "is_causally_congruent": has_insider_precursor and has_rapid_tx,
            "event_count": len(sorted_events),
            "ordered_sequence": [e.get("action_type") for e in sorted_events]
        }

temporal_correlation_engine = TemporalCorrelationEngine()
