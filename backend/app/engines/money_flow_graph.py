from typing import Dict, Any, List
import networkx as nx
from app.models.schemas import GraphNode, GraphEdge, InvestigationGraphResponse

class MoneyFlowGraphEngine:
    """Engine 5: Heterogeneous money-flow graph builder and topology analyzer."""

    def build_case_graph(self, case_id: str, case_data: Dict[str, Any]) -> InvestigationGraphResponse:
        """Constructs an in-memory NetworkX graph and returns positioned React Flow nodes and edges."""
        G = nx.MultiDiGraph()
        nodes: List[GraphNode] = []
        edges: List[GraphEdge] = []

        # Showcase case layout coordinates (organized chronologically from left to right)
        if case_id == "TX-48291" or "48291" in case_id:
            # 1. Employee Node
            nodes.append(GraphNode(
                id="EMP_E104",
                type="employee",
                label="Vikram Malhotra",
                sublabel="Relationship Manager (E104)",
                data={"department": "Retail Banking", "risk": "WATCHLIST", "branch": "Nariman Point", "off_hours": True},
                position={"x": 50.0, "y": 140.0}
            ))

            # 2. Customer Node
            nodes.append(GraphNode(
                id="CUST_C782",
                type="customer",
                label="Rajesh V. Sharma",
                sublabel="Customer (C782)",
                data={"risk_tier": "HIGH", "kyc": "OVERRIDDEN", "monthly_avg": "₹74,000"},
                position={"x": 280.0, "y": 140.0}
            ))

            # 3. Source Account Node
            nodes.append(GraphNode(
                id="ACC_A221",
                type="account",
                label="Account A221",
                sublabel="Savings Account",
                data={"balance": "₹24,50,000", "holder": "Rajesh V. Sharma"},
                position={"x": 280.0, "y": 320.0}
            ))

            # 4. Beneficiary Node
            nodes.append(GraphNode(
                id="BEN_B992",
                type="beneficiary",
                label="Apex Global Ventures",
                sublabel="Beneficiary (B992)",
                data={"added_by": "EMP_E104", "cooling_bypass": True, "created_at": "02:25 AM"},
                position={"x": 520.0, "y": 140.0}
            ))

            # 5. Outgoing Flagged Transaction Node
            nodes.append(GraphNode(
                id="TX_99182",
                type="transaction",
                label="₹9,70,000",
                sublabel="RTGS Transfer (TX-99182)",
                data={"amount": 970000.0, "status": "FLAGGED", "deviation": "13.1x Baseline", "time": "02:42 AM"},
                position={"x": 520.0, "y": 320.0}
            ))

            # 6. Structuring Split 1
            nodes.append(GraphNode(
                id="TX_99183",
                type="transaction",
                label="₹4,85,000",
                sublabel="IMPS Tranche 1 (TX-99183)",
                data={"amount": 485000.0, "status": "STRUCTURED", "time": "02:47 AM"},
                position={"x": 760.0, "y": 230.0}
            ))

            # 7. Structuring Split 2
            nodes.append(GraphNode(
                id="TX_99184",
                type="transaction",
                label="₹4,85,000",
                sublabel="IMPS Tranche 2 (TX-99184)",
                data={"amount": 485000.0, "status": "STRUCTURED", "time": "02:49 AM"},
                position={"x": 760.0, "y": 410.0}
            ))

            # 8. Mule Account 1
            nodes.append(GraphNode(
                id="ACC_A391",
                type="mule",
                label="Karan Singhania",
                sublabel="Mule Account (A391)",
                data={"cluster": "Shell Entity Mule 1", "cash_out": "ATM ₹4.5L", "risk": "CRITICAL"},
                position={"x": 1000.0, "y": 230.0}
            ))

            # 9. Mule Account 2
            nodes.append(GraphNode(
                id="ACC_A441",
                type="mule",
                label="Meera Merchant",
                sublabel="Mule Account (A441)",
                data={"cluster": "Shell Entity Mule 2", "cash_out": "Crypto Exchange Off-Ramp", "risk": "CRITICAL"},
                position={"x": 1000.0, "y": 410.0}
            ))

            # Edges
            edges.append(GraphEdge(
                id="e1", source="EMP_E104", target="CUST_C782",
                label="KYC OVERRIDE (P03)", animated=True,
                data={"permission": "P03", "time": "02:23 AM", "off_hours": True}
            ))
            edges.append(GraphEdge(
                id="e2", source="EMP_E104", target="BEN_B992",
                label="BYPASS COOLING (P07)", animated=True,
                data={"permission": "P07", "time": "02:25 AM", "causal_link": True}
            ))
            edges.append(GraphEdge(
                id="e3", source="CUST_C782", target="ACC_A221",
                label="OWNS", animated=False,
                data={"ownership": "Primary"}
            ))
            edges.append(GraphEdge(
                id="e4", source="ACC_A221", target="TX_99182",
                label="DISBURSED (17 min)", animated=True,
                data={"time": "02:42 AM", "delta_minutes": 17}
            ))
            edges.append(GraphEdge(
                id="e5", source="TX_99182", target="BEN_B992",
                label="CREDITED", animated=False,
                data={"status": "Delivered"}
            ))
            edges.append(GraphEdge(
                id="e6", source="BEN_B992", target="TX_99183",
                label="FRAGMENTED 50%", animated=True,
                data={"time": "02:47 AM", "amount": 485000}
            ))
            edges.append(GraphEdge(
                id="e7", source="BEN_B992", target="TX_99184",
                label="FRAGMENTED 50%", animated=True,
                data={"time": "02:49 AM", "amount": 485000}
            ))
            edges.append(GraphEdge(
                id="e8", source="TX_99183", target="ACC_A391",
                label="ROUTED TO MULE 1", animated=True,
                data={"destination": "Mule A391"}
            ))
            edges.append(GraphEdge(
                id="e9", source="TX_99184", target="ACC_A441",
                label="ROUTED TO MULE 2", animated=True,
                data={"destination": "Mule A441"}
            ))

        else:
            # Generic topology for other cases
            nodes.append(GraphNode(
                id="NODE_SRC",
                type="customer",
                label="Source Customer",
                sublabel=f"Case {case_id}",
                data={"risk": "ELEVATED"},
                position={"x": 100.0, "y": 200.0}
            ))
            nodes.append(GraphNode(
                id="NODE_TX",
                type="transaction",
                label="Transaction",
                sublabel="Disbursement",
                data={"amount": 490000.0},
                position={"x": 400.0, "y": 200.0}
            ))
            nodes.append(GraphNode(
                id="NODE_DST",
                type="account",
                label="Destination Account",
                sublabel="Counterparty",
                data={"status": "FLAGGED"},
                position={"x": 700.0, "y": 200.0}
            ))
            edges.append(GraphEdge(id="ge1", source="NODE_SRC", target="NODE_TX", label="INITIATED", animated=True))
            edges.append(GraphEdge(id="ge2", source="NODE_TX", target="NODE_DST", label="SETTLED", animated=True))

        return InvestigationGraphResponse(case_id=case_id, nodes=nodes, edges=edges)

money_flow_graph_engine = MoneyFlowGraphEngine()
