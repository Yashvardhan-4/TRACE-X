from typing import Dict, Any, List
from app.models.schemas import EvidenceDNA

class ExplainabilityEngine:
    """Engine 7: Synthesizes Evidence DNA, composite risk score, and auditable forensic claims."""

    WEIGHTS = {
        "insider_risk": 0.20,
        "privilege_exposure": 0.18,
        "structuring": 0.16,
        "network_anomaly": 0.14,
        "temporal_correlation": 0.16,
        "profile_deviation": 0.10,
        "device_anomaly": 0.06
    }

    def compute_composite_risk(self, dna: EvidenceDNA) -> Dict[str, Any]:
        """Calculates weighted composite risk score and forensic confidence level."""
        raw_weighted_sum = (
            dna.insider_risk * self.WEIGHTS["insider_risk"] +
            dna.privilege_exposure * self.WEIGHTS["privilege_exposure"] +
            dna.structuring * self.WEIGHTS["structuring"] +
            dna.network_anomaly * self.WEIGHTS["network_anomaly"] +
            dna.temporal_correlation * self.WEIGHTS["temporal_correlation"] +
            dna.profile_deviation * self.WEIGHTS["profile_deviation"] +
            dna.device_anomaly * self.WEIGHTS["device_anomaly"]
        )

        # Multiplier boost if temporal proximity is critical
        multiplier = 1.10 if dna.temporal_correlation >= 85.0 else 1.0
        final_score = min(100.0, raw_weighted_sum * multiplier)

        # Count active signals above threshold (50%)
        active_signals = sum(1 for v in [
            dna.insider_risk, dna.privilege_exposure, dna.structuring,
            dna.network_anomaly, dna.temporal_correlation, dna.profile_deviation
        ] if v >= 50.0)

        confidence = round(min(0.99, 0.60 + (active_signals * 0.06)), 2)

        # Determine severity label
        if final_score >= 85.0:
            severity = "CRITICAL"
        elif final_score >= 70.0:
            severity = "HIGH"
        elif final_score >= 45.0:
            severity = "MEDIUM"
        else:
            severity = "LOW"

        return {
            "composite_risk_score": round(final_score, 1),
            "confidence_score": confidence,
            "severity": severity,
            "active_congruent_signals": active_signals
        }

    def generate_narrative_explanation(self, case_id: str, dna: EvidenceDNA, primary_employee: str, amount_inr: float) -> str:
        """Produces a deterministic, evidence-grounded summary without hallucination."""
        signals = []
        if dna.privilege_exposure >= 70.0:
            signals.append("privileged capability execution to bypass controls")
        if dna.temporal_correlation >= 80.0:
            signals.append("tight temporal correlation (<30 mins) between authorization and outflow")
        if dna.structuring >= 70.0:
            signals.append("fragmented structured downstream disbursements")
        if dna.profile_deviation >= 70.0:
            signals.append(f"significant deviation from historical account transaction baseline")

        reason_str = ", ".join(signals) if signals else "statistical anomaly in transaction volume"
        return f"Case #{case_id} flagged with {dna.temporal_correlation:.0f}% temporal congruence: {primary_employee} facilitated a sequence resulting in ₹{amount_inr:,.2f} outflow characterized by {reason_str}."

explainability_engine = ExplainabilityEngine()
