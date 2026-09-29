from datetime import datetime
from typing import Dict, Any, List
from app.core.config import settings

class InsiderBehaviorEngine:
    """Engine 3: Identifies employee departures from operational norms and shift schedules."""

    def evaluate_access_event(
        self,
        event_timestamp: datetime,
        employee_shift_start: int = settings.SHIFT_START_HOUR,
        employee_shift_end: int = settings.SHIFT_END_HOUR,
        device_id: str = "",
        assigned_device_id: str = "DEV_CORPORATE_LAPTOP_DEFAULT",
        action_type: str = "VIEW_CUSTOMER",
        is_assigned_customer: bool = True
    ) -> Dict[str, Any]:
        
        event_hour = event_timestamp.hour
        is_off_hours = event_hour < employee_shift_start or event_hour >= employee_shift_end
        is_foreign_device = bool(device_id and "UNRECOGNIZED" in device_id.upper())
        is_boundary_breach = not is_assigned_customer

        # Compute insider anomaly score
        score = 0.0
        reasons = []

        if is_off_hours:
            score += 45.0
            reasons.append(f"Off-hours access at {event_timestamp.strftime('%H:%M:%S')} IST (Shift: {employee_shift_start}:00 - {employee_shift_end}:00)")

        if is_foreign_device:
            score += 35.0
            reasons.append(f"Access initiated from unregistered hardware fingerprint: {device_id}")

        if is_boundary_breach:
            score += 25.0
            reasons.append("Unscheduled access to customer without active servicing relationship")

        flagged = score >= 50.0

        return {
            "flagged": flagged,
            "insider_risk_score": min(100.0, score),
            "is_off_hours": is_off_hours,
            "is_foreign_device": is_foreign_device,
            "is_boundary_breach": is_boundary_breach,
            "reasons": reasons,
            "rule": "RULE_INSIDER_BEHAVIORAL_DEVIATION"
        }

insider_behavior_engine = InsiderBehaviorEngine()
