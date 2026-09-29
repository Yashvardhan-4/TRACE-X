from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

# Evidence DNA Schema
class EvidenceDNA(BaseModel):
    insider_risk: float = Field(..., ge=0.0, le=100.0)
    privilege_exposure: float = Field(..., ge=0.0, le=100.0)
    structuring: float = Field(..., ge=0.0, le=100.0)
    network_anomaly: float = Field(..., ge=0.0, le=100.0)
    temporal_correlation: float = Field(..., ge=0.0, le=100.0)
    profile_deviation: float = Field(..., ge=0.0, le=100.0)
    device_anomaly: float = Field(..., ge=0.0, le=100.0)

# Evidence Item Schema
class EvidenceItemResponse(BaseModel):
    evidence_id: str
    case_id: str
    engine_name: str
    claim: str
    deviation_factor: Optional[float] = None
    source_event_type: str
    source_event_id: str
    event_timestamp: datetime
    rule_or_model_ref: str
    payload_json: Dict[str, Any]

# Alert Schema
class AlertResponse(BaseModel):
    alert_id: str
    source_system: str
    alert_name: str
    severity: str
    created_at: datetime

# Case Summary Schema (for DataTables & Triage)
class CaseSummaryResponse(BaseModel):
    case_id: str
    title: str
    severity: str
    composite_risk_score: float
    confidence_score: float
    status: str
    assigned_investigator: Optional[str] = None
    primary_employee_id: Optional[str] = None
    primary_customer_id: Optional[str] = None
    total_exposure_inr: float
    typology: str
    evidence_dna: EvidenceDNA
    created_at: datetime

# Case Detailed Dossier
class CaseDetailResponse(CaseSummaryResponse):
    attack_chain_summary: str
    alerts: List[AlertResponse] = []
    evidence_items: List[EvidenceItemResponse] = []

# Status Update Request
class CaseStatusUpdateRequest(BaseModel):
    status: str
    assigned_investigator: Optional[str] = None
    note: Optional[str] = None

# Graph Node & Edge Models (React Flow compatible)
class GraphNode(BaseModel):
    id: str
    type: str  # employee, customer, beneficiary, account, transaction, mule
    label: str
    sublabel: Optional[str] = None
    data: Dict[str, Any] = {}
    position: Dict[str, float] = {"x": 0.0, "y": 0.0}

class GraphEdge(BaseModel):
    id: str
    source: str
    target: str
    label: Optional[str] = None
    animated: bool = False
    timestamp: Optional[datetime] = None
    data: Dict[str, Any] = {}

class InvestigationGraphResponse(BaseModel):
    case_id: str
    nodes: List[GraphNode]
    edges: List[GraphEdge]

# Timeline Event Model
class TimelineEvent(BaseModel):
    event_id: str
    timestamp: datetime
    formatted_time: str
    delta_minutes: int
    actor_type: str  # EMPLOYEE, CUSTOMER, SYSTEM
    actor_id: str
    actor_name: str
    action_type: str
    summary: str
    severity: str
    is_privileged: bool = False
    permission_code: Optional[str] = None
    source_event_id: str

class TimelineResponse(BaseModel):
    case_id: str
    total_duration_minutes: int
    events: List[TimelineEvent]

# Counterfactual Simulation Request & Response
class CounterfactualRequest(BaseModel):
    case_id: str
    remove_employee_intervention: bool = True
    removed_event_ids: List[str] = []

class CounterfactualResponse(BaseModel):
    case_id: str
    original_risk_score: float
    counterfactual_risk_score: float
    risk_delta: float
    chain_severed: bool
    broken_step_label: str
    structural_dependency_proof: str
    impacted_nodes: List[str]
    impacted_edges: List[str]

# Scenario Runner & Benchmark Schemas
class ScenarioInfo(BaseModel):
    scenario_id: str
    name: str
    typology: str
    ground_truth: str  # SUSPICIOUS or LEGITIMATE
    description: str
    simulated_exposure_inr: float
    involves_employee: bool

class ScenarioRunResult(BaseModel):
    scenario_id: str
    scenario_name: str
    ground_truth: str
    system_verdict: str  # SUSPICIOUS or LEGITIMATE
    matched: bool
    risk_score: float
    confidence: float
    flagged_reasons: List[str]
    latency_ms: float

class BenchmarkSummaryResponse(BaseModel):
    total_scenarios_tested: int
    true_positives: int
    true_negatives: int
    false_positives: int
    false_negatives: int
    precision: float
    recall: float
    f1_score: float
    false_positive_rate: float
    results: List[ScenarioRunResult]

# Copilot Query Request & Response
class CopilotQueryRequest(BaseModel):
    case_id: str
    question: str

class CopilotQueryResponse(BaseModel):
    case_id: str
    question: str
    answer: str
    grounded_evidence_ids: List[str]
    confidence: float
