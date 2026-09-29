from typing import List, Dict, Any

class PrivilegeRiskEngine:
    """Engine 4: Quantifies privilege exposure and attack surface capabilities."""

    def __init__(self):
        # High-risk bypass permissions
        self.critical_permissions = {
            "P03": {"code": "PERM_UPDATE_CONTACT_INFO", "weight": 0.65, "capability": "Modify Phone/Email"},
            "P04": {"code": "PERM_REACTIVATE_DORMANT", "weight": 0.85, "capability": "Dormancy Override"},
            "P05": {"code": "PERM_APPROVE_TX_OVERRIDE", "weight": 0.90, "capability": "Limit Override"},
            "P06": {"code": "PERM_MODIFY_BENEFICIARY", "weight": 0.88, "capability": "Beneficiary Whitelisting"},
            "P07": {"code": "PERM_BYPASS_COOLING_PERIOD", "weight": 0.95, "capability": "Cooling Period Bypass"},
            "P08": {"code": "PERM_OVERRIDE_OTP_TOKEN", "weight": 0.98, "capability": "2FA / OTP Bypass"},
        }

    def evaluate_privilege_exposure(self, exercised_permission_ids: List[str]) -> Dict[str, Any]:
        """Calculates cumulative capability score: CapScore = 1 - prod(1 - w(p))."""
        if not exercised_permission_ids:
            return {
                "flagged": False,
                "capability_score": 0.0,
                "unlocked_capabilities": [],
                "rule": "MATRIX_PRIVILEGE_ATTACK_SURFACE"
            }

        unlocked = []
        residual_safety = 1.0

        for pid in exercised_permission_ids:
            if pid in self.critical_permissions:
                perm_info = self.critical_permissions[pid]
                w = perm_info["weight"]
                residual_safety *= (1.0 - w)
                unlocked.append(perm_info["capability"])

        capability_score = (1.0 - residual_safety) * 100.0
        flagged = capability_score >= 60.0

        return {
            "flagged": flagged,
            "capability_score": round(capability_score, 1),
            "unlocked_capabilities": unlocked,
            "exercised_permissions": exercised_permission_ids,
            "rule": "MATRIX_PRIVILEGE_ATTACK_SURFACE"
        }

privilege_risk_engine = PrivilegeRiskEngine()
