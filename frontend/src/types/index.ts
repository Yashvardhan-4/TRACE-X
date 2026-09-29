export interface EvidenceDNA {
  insider_risk: number;
  privilege_exposure: number;
  structuring: number;
  network_anomaly: number;
  temporal_correlation: number;
  profile_deviation: number;
  device_anomaly: number;
}

export interface CaseSummary {
  case_id: string;
  title: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  composite_risk_score: number;
  confidence_score: number;
  status: "NEW" | "UNDER_REVIEW" | "ESCALATED" | "CLOSED_FALSE_POSITIVE" | "CLOSED_CONFIRMED";
  assigned_investigator?: string;
  primary_employee_id?: string;
  primary_customer_id?: string;
  total_exposure_inr: number;
  typology: string;
  evidence_dna: EvidenceDNA;
  created_at: string;
}

export interface Alert {
  alert_id: string;
  source_system: string;
  alert_name: string;
  severity: string;
  created_at: string;
}

export interface EvidenceItem {
  evidence_id: string;
  case_id: string;
  engine_name: string;
  claim: string;
  deviation_factor?: number;
  source_event_type: string;
  source_event_id: string;
  event_timestamp: string;
  rule_or_model_ref: string;
  payload_json: Record<string, any>;
}

export interface CaseDetail extends CaseSummary {
  attack_chain_summary: string;
  alerts: Alert[];
  evidence_items: EvidenceItem[];
}

export interface GraphNode {
  id: string;
  type: string;
  label: string;
  sublabel?: string;
  data: Record<string, any>;
  position: { x: number; y: number };
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  animated?: boolean;
  timestamp?: string;
  data?: Record<string, any>;
}

export interface InvestigationGraph {
  case_id: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface TimelineEvent {
  event_id: string;
  timestamp: string;
  formatted_time: string;
  delta_minutes: number;
  actor_type: "EMPLOYEE" | "CUSTOMER" | "SYSTEM";
  actor_id: string;
  actor_name: string;
  action_type: string;
  summary: string;
  severity: string;
  is_privileged: boolean;
  permission_code?: string;
  source_event_id: string;
}

export interface TimelineResponse {
  case_id: string;
  total_duration_minutes: number;
  events: TimelineEvent[];
}

export interface CounterfactualResponse {
  case_id: string;
  original_risk_score: number;
  counterfactual_risk_score: number;
  risk_delta: number;
  chain_severed: boolean;
  broken_step_label: string;
  structural_dependency_proof: string;
  impacted_nodes: string[];
  impacted_edges: string[];
}

export interface ScenarioInfo {
  scenario_id: string;
  name: string;
  typology: string;
  ground_truth: "SUSPICIOUS" | "LEGITIMATE";
  description: string;
  simulated_exposure_inr: number;
  involves_employee: boolean;
}

export interface ScenarioRunResult {
  scenario_id: string;
  scenario_name: string;
  ground_truth: string;
  system_verdict: string;
  matched: boolean;
  risk_score: number;
  confidence: number;
  flagged_reasons: string[];
  latency_ms: number;
}

export interface BenchmarkSummary {
  total_scenarios_tested: number;
  true_positives: number;
  true_negatives: number;
  false_positives: number;
  false_negatives: number;
  precision: number;
  recall: number;
  f1_score: number;
  false_positive_rate: number;
  results: ScenarioRunResult[];
}
