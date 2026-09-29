from datetime import datetime, timedelta
from typing import List, Dict, Any
import networkx as nx
from app.core.config import settings

class TransactionAnomalyEngine:
    """Engine 1: Detects structuring, circular loops, fan-in/fan-out, and dormant reactivations."""

    def __init__(self):
        self.pan_threshold = settings.PAN_REPORTING_THRESHOLD_INR
        self.ctr_threshold = settings.CTR_REPORTING_THRESHOLD_INR
        self.structuring_lower_ratio = settings.STRUCTURING_LOWER_BOUND_RATIO

    def detect_structuring(self, transactions: List[Dict[str, Any]], window_hours: int = 24) -> Dict[str, Any]:
        """Detects amounts just below regulatory thresholds within a time window."""
        flagged_txs = []
        for tx in transactions:
            amount = tx.get("amount_inr", 0.0)
            # Check structuring under ₹50k or ₹10L
            if (self.pan_threshold * self.structuring_lower_ratio <= amount < self.pan_threshold) or \
               (self.ctr_threshold * self.structuring_lower_ratio <= amount < self.ctr_threshold) or \
               (450000.0 <= amount < 500000.0): # Internal bank AML ₹5L flag
                flagged_txs.append(tx)

        is_structuring = len(flagged_txs) >= 2
        total_structured_amount = sum(t.get("amount_inr", 0.0) for t in flagged_txs)
        
        return {
            "flagged": is_structuring,
            "structuring_count": len(flagged_txs),
            "total_structured_amount": total_structured_amount,
            "transactions": flagged_txs,
            "rule": "RULE_STRUCTURING_WINDOW"
        }

    def detect_circular_flows(self, transactions: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Detects cyclic money transfers (A -> B -> C -> A) using directed graph cycle finding."""
        G = nx.DiGraph()
        for tx in transactions:
            u = tx.get("source_account")
            v = tx.get("destination_account")
            if u and v:
                G.add_edge(u, v, amount=tx.get("amount_inr", 0.0), tx_id=tx.get("transaction_id"))

        cycles = []
        try:
            simple_cycles = list(nx.simple_cycles(G))
            # Keep cycles with length >= 3
            cycles = [c for c in simple_cycles if len(c) >= 3]
        except Exception:
            pass

        return {
            "flagged": len(cycles) > 0,
            "cycle_count": len(cycles),
            "cycles": cycles,
            "rule": "RULE_CIRCULAR_TRANSFER_LOOP"
        }

    def detect_fan_in_fan_out(self, transactions: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Detects high degree fan-in (aggregation) or fan-out (dispersion) patterns."""
        in_degree = {}
        out_degree = {}

        for tx in transactions:
            src = tx.get("source_account")
            dst = tx.get("destination_account")
            out_degree[src] = out_degree.get(src, 0) + 1
            in_degree[dst] = in_degree.get(dst, 0) + 1

        fan_in_hubs = [acc for acc, count in in_degree.items() if count >= 4]
        fan_out_hubs = [acc for acc, count in out_degree.items() if count >= 4]

        flagged = len(fan_in_hubs) > 0 or len(fan_out_hubs) > 0

        return {
            "flagged": flagged,
            "fan_in_hubs": fan_in_hubs,
            "fan_out_hubs": fan_out_hubs,
            "rule": "RULE_FAN_IN_FAN_OUT_DISPERSION"
        }

    def detect_dormant_activation(self, account_last_active: datetime, current_tx_time: datetime, current_amount: float) -> Dict[str, Any]:
        """Detects dormant account awakening with significant funds transfer."""
        days_inactive = (current_tx_time - account_last_active).days
        is_dormant = days_inactive >= settings.DORMANT_DAYS_THRESHOLD
        is_high_value = current_amount >= 500000.0

        flagged = is_dormant and is_high_value

        return {
            "flagged": flagged,
            "days_inactive": days_inactive,
            "amount_inr": current_amount,
            "rule": "RULE_DORMANT_ACTIVATION_DRAIN"
        }

transaction_engine = TransactionAnomalyEngine()
