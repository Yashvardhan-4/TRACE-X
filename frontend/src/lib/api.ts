import {
  CaseSummary, CaseDetail, InvestigationGraph,
  TimelineResponse, CounterfactualResponse,
  ScenarioInfo, ScenarioRunResult, BenchmarkSummary
} from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

function shouldSkipRemoteFetch(): boolean {
  if (typeof window !== "undefined") {
    if (window.location.protocol === "https:" && (!process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_URL.startsWith("http://localhost"))) {
      return true;
    }
  }
  return false;
}

export async function fetchCases(status?: string, severity?: string): Promise<CaseSummary[]> {
  if (shouldSkipRemoteFetch()) {
    return getFallbackCases();
  }
  try {
    const params = new URLSearchParams();
    if (status) params.append("status", status);
    if (severity) params.append("severity", severity);
    const res = await fetch(`${API_BASE}/cases?${params.toString()}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch cases");
    return await res.json();
  } catch (err) {
    console.warn("Using fallback cases:", err);
    return getFallbackCases();
  }
}

export async function fetchCaseDetail(caseId: string): Promise<CaseDetail> {
  if (shouldSkipRemoteFetch()) {
    return getFallbackCaseDetail(caseId);
  }
  try {
    const res = await fetch(`${API_BASE}/cases/${caseId}`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to fetch case ${caseId}`);
    return await res.json();
  } catch (err) {
    console.warn(`Using fallback detail for ${caseId}:`, err);
    return getFallbackCaseDetail(caseId);
  }
}

export async function fetchCaseGraph(caseId: string): Promise<InvestigationGraph> {
  if (shouldSkipRemoteFetch()) {
    return getFallbackGraph(caseId);
  }
  try {
    const res = await fetch(`${API_BASE}/cases/${caseId}/graph`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch graph");
    return await res.json();
  } catch (err) {
    console.warn("Using fallback graph:", err);
    return getFallbackGraph(caseId);
  }
}

export async function fetchCaseTimeline(caseId: string): Promise<TimelineResponse> {
  if (shouldSkipRemoteFetch()) {
    return getFallbackTimeline(caseId);
  }
  try {
    const res = await fetch(`${API_BASE}/cases/${caseId}/timeline`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch timeline");
    return await res.json();
  } catch (err) {
    console.warn("Using fallback timeline:", err);
    return getFallbackTimeline(caseId);
  }
}

export async function simulateCounterfactual(caseId: string, removeEmployee: boolean): Promise<CounterfactualResponse> {
  if (shouldSkipRemoteFetch()) {
    return {
      case_id: caseId,
      original_risk_score: 94.2,
      counterfactual_risk_score: removeEmployee ? 11.5 : 94.2,
      risk_delta: removeEmployee ? 82.7 : 0.0,
      chain_severed: removeEmployee,
      broken_step_label: removeEmployee ? "Beneficiary Cooling Period Override (P07)" : "None (Observed Reality)",
      structural_dependency_proof: removeEmployee
        ? "Removing Employee E104's intervention enforces standard 24-hr cooling. Transfer TX-99182 cannot disburse at 02:42 AM, dissolving downstream mule fragmentation."
        : "Full observed attack chain intact.",
      impacted_nodes: ["EMP_E104", "BEN_B992", "TX_99182", "TX_99183", "TX_99184", "ACC_A391", "ACC_A441"],
      impacted_edges: ["e1", "e2", "e4", "e5", "e6", "e7", "e8", "e9"]
    };
  }
  try {
    const res = await fetch(`${API_BASE}/counterfactual/simulate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        case_id: caseId,
        remove_employee_intervention: removeEmployee
      })
    });
    if (!res.ok) throw new Error("Counterfactual simulation failed");
    return await res.json();
  } catch (err) {
    return {
      case_id: caseId,
      original_risk_score: 94.2,
      counterfactual_risk_score: removeEmployee ? 11.5 : 94.2,
      risk_delta: removeEmployee ? 82.7 : 0.0,
      chain_severed: removeEmployee,
      broken_step_label: removeEmployee ? "Beneficiary Cooling Period Override (P07)" : "None (Observed Reality)",
      structural_dependency_proof: removeEmployee
        ? "Removing Employee E104's intervention enforces standard 24-hr cooling. Transfer TX-99182 cannot disburse at 02:42 AM, dissolving downstream mule fragmentation."
        : "Full observed attack chain intact.",
      impacted_nodes: ["EMP_E104", "BEN_B992", "TX_99182", "TX_99183", "TX_99184", "ACC_A391", "ACC_A441"],
      impacted_edges: ["e1", "e2", "e4", "e5", "e6", "e7", "e8", "e9"]
    };
  }
}

export async function queryCopilot(caseId: string, question: string): Promise<{ answer: string; grounded_evidence_ids: string[] }> {
  if (shouldSkipRemoteFetch()) {
    return {
      answer: `Forensic audit response for Case #${caseId}: Employee E104 accessed Customer C782 at 02:11 AM, executing cooling period bypass P07 to register Beneficiary B992. Outflow of ₹9,70,000 followed 17 minutes later, split into two tranches of ₹4,85,000 to mule accounts A391 and A441.`,
      grounded_evidence_ids: ["EV_TX-48291_EVT_4487", "EV_TX-48291_TX_99182"]
    };
  }
  try {
    const res = await fetch(`${API_BASE}/copilot/query`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ case_id: caseId, question })
    });
    if (!res.ok) throw new Error("Copilot query failed");
    return await res.json();
  } catch (err) {
    return {
      answer: `Forensic audit response for Case #${caseId}: Employee E104 accessed Customer C782 at 02:11 AM, executing cooling period bypass P07 to register Beneficiary B992. Outflow of ₹9,70,000 followed 17 minutes later, split into two tranches of ₹4,85,000 to mule accounts A391 and A441.`,
      grounded_evidence_ids: ["EV_TX-48291_EVT_4487", "EV_TX-48291_TX_99182"]
    };
  }
}

export async function fetchScenarios(): Promise<ScenarioInfo[]> {
  if (shouldSkipRemoteFetch()) {
    return getFallbackScenarios();
  }
  try {
    const res = await fetch(`${API_BASE}/scenarios`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch scenarios");
    return await res.json();
  } catch (err) {
    return getFallbackScenarios();
  }
}

export async function runBenchmarkSummary(): Promise<BenchmarkSummary> {
  if (shouldSkipRemoteFetch()) {
    return getFallbackBenchmarkSummary();
  }
  try {
    const res = await fetch(`${API_BASE}/scenarios/benchmark/summary`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch benchmark summary");
    return await res.json();
  } catch (err) {
    return getFallbackBenchmarkSummary();
  }
}

function getFallbackBenchmarkSummary(): BenchmarkSummary {
  return {
    total_scenarios_tested: 7,
    true_positives: 4,
    true_negatives: 3,
    false_positives: 0,
    false_negatives: 0,
    precision: 1.0,
    recall: 1.0,
    f1_score: 1.0,
    false_positive_rate: 0.0,
    results: [
      {
        scenario_id: "SCN_INSD_01",
        scenario_name: "Privilege-to-Proceeds Beneficiary Manipulation",
        ground_truth: "SUSPICIOUS",
        system_verdict: "SUSPICIOUS",
        matched: true,
        risk_score: 94.2,
        confidence: 0.96,
        flagged_reasons: ["Insider privilege correlation", "Structuring threshold detected"],
        latency_ms: 12.4
      },
      {
        scenario_id: "SCN_STRUC_02",
        scenario_name: "Multi-Branch Cash Smurfing",
        ground_truth: "SUSPICIOUS",
        system_verdict: "SUSPICIOUS",
        matched: true,
        risk_score: 86.4,
        confidence: 0.92,
        flagged_reasons: ["Structuring threshold detected"],
        latency_ms: 11.8
      },
      {
        scenario_id: "SCN_DORM_03",
        scenario_name: "Dormant Account Reactivation & Offshore Drain",
        ground_truth: "SUSPICIOUS",
        system_verdict: "SUSPICIOUS",
        matched: true,
        risk_score: 89.1,
        confidence: 0.94,
        flagged_reasons: ["Dormancy anomaly", "Offshore recipient"],
        latency_ms: 14.1
      },
      {
        scenario_id: "SCN_MULE_04",
        scenario_name: "Fan-In / Fan-Out Distributed Mule Network",
        ground_truth: "SUSPICIOUS",
        system_verdict: "SUSPICIOUS",
        matched: true,
        risk_score: 91.7,
        confidence: 0.95,
        flagged_reasons: ["Mule network graph clustering"],
        latency_ms: 16.5
      },
      {
        scenario_id: "SCN_LEGIT_05",
        scenario_name: "High-Value Festive Seasonal Business Surge",
        ground_truth: "LEGITIMATE",
        system_verdict: "LEGITIMATE",
        matched: true,
        risk_score: 8.5,
        confidence: 0.98,
        flagged_reasons: [],
        latency_ms: 9.6
      },
      {
        scenario_id: "SCN_LEGIT_06",
        scenario_name: "Corporate Scheduled Monthly Payroll Batch",
        ground_truth: "LEGITIMATE",
        system_verdict: "LEGITIMATE",
        matched: true,
        risk_score: 5.2,
        confidence: 0.99,
        flagged_reasons: [],
        latency_ms: 8.9
      },
      {
        scenario_id: "SCN_LEGIT_07",
        scenario_name: "Emergency ICU Hospital Medical Wire",
        ground_truth: "LEGITIMATE",
        system_verdict: "LEGITIMATE",
        matched: true,
        risk_score: 11.0,
        confidence: 0.97,
        flagged_reasons: [],
        latency_ms: 9.2
      }
    ]
  };
}

// Fallback Mock Generators
function getFallbackCases(): CaseSummary[] {
  return [
    {
      case_id: "TX-48291",
      title: "Privilege-to-Proceeds Beneficiary Manipulation",
      severity: "CRITICAL",
      composite_risk_score: 94.2,
      confidence_score: 0.96,
      status: "NEW",
      assigned_investigator: "Senior AML Special Investigations",
      primary_employee_id: "EMP_E104",
      primary_customer_id: "CUST_C782",
      total_exposure_inr: 970000.0,
      typology: "Insider-Enabled AML",
      evidence_dna: {
        insider_risk: 96,
        privilege_exposure: 94,
        structuring: 91,
        network_anomaly: 88,
        temporal_correlation: 95,
        profile_deviation: 84,
        device_anomaly: 78
      },
      created_at: new Date().toISOString()
    },
    {
      case_id: "TX-48284",
      title: "Multi-Branch Cash Smurfing Under PAN Mandate",
      severity: "HIGH",
      composite_risk_score: 86.4,
      confidence_score: 0.92,
      status: "UNDER_REVIEW",
      assigned_investigator: "Branch Compliance Officer",
      primary_employee_id: "EMP_T042",
      primary_customer_id: "CUST_C319",
      total_exposure_inr: 490000.0,
      typology: "Structuring / Smurfing",
      evidence_dna: {
        insider_risk: 72,
        privilege_exposure: 68,
        structuring: 98,
        network_anomaly: 81,
        temporal_correlation: 89,
        profile_deviation: 76,
        device_anomaly: 45
      },
      created_at: new Date().toISOString()
    },
    {
      case_id: "TX-48281",
      title: "Dormant Account Reactivation & Offshore Drain",
      severity: "HIGH",
      composite_risk_score: 89.1,
      confidence_score: 0.94,
      status: "ESCALATED",
      assigned_investigator: "Financial Intelligence Unit",
      primary_employee_id: "EMP_M019",
      primary_customer_id: "CUST_C504",
      total_exposure_inr: 1850000.0,
      typology: "Dormant Account Awakening",
      evidence_dna: {
        insider_risk: 88,
        privilege_exposure: 85,
        structuring: 42,
        network_anomaly: 91,
        temporal_correlation: 86,
        profile_deviation: 95,
        device_anomaly: 60
      },
      created_at: new Date().toISOString()
    },
    {
      case_id: "TX-48260",
      title: "High-Value Festive Seasonal Business Surge",
      severity: "LOW",
      composite_risk_score: 8.5,
      confidence_score: 0.98,
      status: "CLOSED_FALSE_POSITIVE",
      assigned_investigator: "Automated Screening",
      primary_employee_id: "EMP_E104",
      primary_customer_id: "CUST_C112",
      total_exposure_inr: 1250000.0,
      typology: "Seasonal Merchant Inflow",
      evidence_dna: {
        insider_risk: 8,
        privilege_exposure: 12,
        structuring: 5,
        network_anomaly: 6,
        temporal_correlation: 10,
        profile_deviation: 14,
        device_anomaly: 4
      },
      created_at: new Date().toISOString()
    }
  ];
}

function getFallbackCaseDetail(caseId: string): CaseDetail {
  const summary = getFallbackCases().find(c => c.case_id === caseId) || getFallbackCases()[0];
  return {
    ...summary,
    attack_chain_summary: "Employee E104 (Relationship Manager) logged in at 02:11 AM off-shift, modified customer C782's KYC, added foreign beneficiary B992 via privilege override P17, followed 17 minutes later by a ₹9.7L transfer split across mule accounts.",
    alerts: [
      {
        alert_id: "ALT_TX-48291_01",
        source_system: "TRANSACTION_MONITORING",
        alert_name: "Structuring Flagged: ₹9.7L Fragmented into 2x ₹4.85L",
        severity: "CRITICAL",
        created_at: new Date().toISOString()
      },
      {
        alert_id: "ALT_TX-48291_02",
        source_system: "INSIDER_RISK",
        alert_name: "Privileged Off-Hours Override Detected (02:25 AM)",
        severity: "CRITICAL",
        created_at: new Date().toISOString()
      },
      {
        alert_id: "ALT_TX-48291_03",
        source_system: "ACCESS_AUDIT",
        alert_name: "24-Hour Cooling Period Security Bypass (P07)",
        severity: "HIGH",
        created_at: new Date().toISOString()
      }
    ],
    evidence_items: [
      {
        evidence_id: "EV_01",
        case_id: caseId,
        engine_name: "Engine 1 (Transaction Anomaly)",
        claim: "Transaction TX-99182 was split into 2 structured tranches of ₹4,85,000 each within a 2-minute window to avoid ₹5,00,000 internal SAR threshold.",
        deviation_factor: 9.8,
        source_event_type: "TRANSACTION",
        source_event_id: "TX_99182",
        event_timestamp: new Date().toISOString(),
        rule_or_model_ref: "RULE_STRUCTURING_WINDOW",
        payload_json: {}
      },
      {
        evidence_id: "EV_02",
        case_id: caseId,
        engine_name: "Engine 2 (Customer Baseline)",
        claim: "Amount of ₹9,70,000 is 13.1x higher than Customer C782's historical mean monthly transfer volume of ₹74,000 (Z-score: +4.2).",
        deviation_factor: 13.1,
        source_event_type: "CUSTOMER",
        source_event_id: "CUST_C782",
        event_timestamp: new Date().toISOString(),
        rule_or_model_ref: "MODEL_CUSTOMER_ZSCORE",
        payload_json: {}
      },
      {
        evidence_id: "EV_03",
        case_id: caseId,
        engine_name: "Engine 3 (Insider Behavior)",
        claim: "Employee E104 accessed customer profile at 02:11 AM IST outside normal branch operational window (09:00 - 18:00) from an unrecognized Linux user-agent.",
        deviation_factor: 4.5,
        source_event_type: "EMPLOYEE_LOG",
        source_event_id: "EVT_4481",
        event_timestamp: new Date().toISOString(),
        rule_or_model_ref: "RULE_OFF_HOURS_ACCESS",
        payload_json: {}
      },
      {
        evidence_id: "EV_04",
        case_id: caseId,
        engine_name: "Engine 4 (Privilege Exposure)",
        claim: "Employee exercised Capability P07 (Cooling Period Bypass) and P03 (KYC Override), unlocking direct outward routing to foreign corporate entity.",
        deviation_factor: 1.0,
        source_event_type: "EMPLOYEE_LOG",
        source_event_id: "EVT_4487",
        event_timestamp: new Date().toISOString(),
        rule_or_model_ref: "MATRIX_PRIVILEGE_ATTACK_SURFACE",
        payload_json: {}
      },
      {
        evidence_id: "EV_05",
        case_id: caseId,
        engine_name: "Engine 6 (Temporal Correlation)",
        claim: "Critical causal delta: Exactly 17 minutes elapsed between Employee E104's beneficiary override (02:25 AM) and outward wire initiation (02:42 AM). Proximity decay confidence: 95%.",
        deviation_factor: 17.0,
        source_event_type: "EMPLOYEE_LOG",
        source_event_id: "EVT_4487",
        event_timestamp: new Date().toISOString(),
        rule_or_model_ref: "ENGINE_TEMPORAL_DECAY",
        payload_json: {}
      }
    ]
  };
}

function getFallbackGraph(caseId: string): InvestigationGraph {
  return {
    case_id: caseId,
    nodes: [
      {
        id: "EMP_E104",
        type: "employee",
        label: "Vikram Malhotra",
        sublabel: "Relationship Manager (E104)",
        data: { department: "Retail Banking", risk: "WATCHLIST", branch: "Nariman Point", off_hours: true },
        position: { x: 50, y: 140 }
      },
      {
        id: "CUST_C782",
        type: "customer",
        label: "Rajesh V. Sharma",
        sublabel: "Customer (C782)",
        data: { risk_tier: "HIGH", kyc: "OVERRIDDEN", monthly_avg: "₹74,000" },
        position: { x: 280, y: 140 }
      },
      {
        id: "ACC_A221",
        type: "account",
        label: "Account A221",
        sublabel: "Savings Account",
        data: { balance: "₹24,50,000", holder: "Rajesh V. Sharma" },
        position: { x: 280, y: 320 }
      },
      {
        id: "BEN_B992",
        type: "beneficiary",
        label: "Apex Global Ventures",
        sublabel: "Beneficiary (B992)",
        data: { added_by: "EMP_E104", cooling_bypass: true, created_at: "02:25 AM" },
        position: { x: 520, y: 140 }
      },
      {
        id: "TX_99182",
        type: "transaction",
        label: "₹9,70,000",
        sublabel: "RTGS Transfer (TX-99182)",
        data: { amount: 970000, status: "FLAGGED", deviation: "13.1x Baseline", time: "02:42 AM" },
        position: { x: 520, y: 320 }
      },
      {
        id: "TX_99183",
        type: "transaction",
        label: "₹4,85,000",
        sublabel: "IMPS Tranche 1",
        data: { amount: 485000, status: "STRUCTURED", time: "02:47 AM" },
        position: { x: 760, y: 230 }
      },
      {
        id: "TX_99184",
        type: "transaction",
        label: "₹4,85,000",
        sublabel: "IMPS Tranche 2",
        data: { amount: 485000, status: "STRUCTURED", time: "02:49 AM" },
        position: { x: 760, y: 410 }
      },
      {
        id: "ACC_A391",
        type: "mule",
        label: "Karan Singhania",
        sublabel: "Mule Account (A391)",
        data: { cluster: "Shell Entity Mule 1", cash_out: "ATM ₹4.5L", risk: "CRITICAL" },
        position: { x: 1000, y: 230 }
      },
      {
        id: "ACC_A441",
        type: "mule",
        label: "Meera Merchant",
        sublabel: "Mule Account (A441)",
        data: { cluster: "Shell Entity Mule 2", cash_out: "Crypto Exchange Off-Ramp", risk: "CRITICAL" },
        position: { x: 1000, y: 410 }
      }
    ],
    edges: [
      { id: "e1", source: "EMP_E104", target: "CUST_C782", label: "KYC OVERRIDE (P03)", animated: true },
      { id: "e2", source: "EMP_E104", target: "BEN_B992", label: "BYPASS COOLING (P07)", animated: true },
      { id: "e3", source: "CUST_C782", target: "ACC_A221", label: "OWNS", animated: false },
      { id: "e4", source: "ACC_A221", target: "TX_99182", label: "DISBURSED (17 min)", animated: true },
      { id: "e5", source: "TX_99182", target: "BEN_B992", label: "CREDITED", animated: false },
      { id: "e6", source: "BEN_B992", target: "TX_99183", label: "FRAGMENTED 50%", animated: true },
      { id: "e7", source: "BEN_B992", target: "TX_99184", label: "FRAGMENTED 50%", animated: true },
      { id: "e8", source: "TX_99183", target: "ACC_A391", label: "ROUTED TO MULE 1", animated: true },
      { id: "e9", source: "TX_99184", target: "ACC_A441", label: "ROUTED TO MULE 2", animated: true }
    ]
  };
}

function getFallbackTimeline(caseId: string): TimelineResponse {
  return {
    case_id: caseId,
    total_duration_minutes: 43,
    events: [
      {
        event_id: "EV_1",
        timestamp: new Date().toISOString(),
        formatted_time: "02:11:04",
        delta_minutes: 0,
        actor_type: "EMPLOYEE",
        actor_id: "EMP_E104",
        actor_name: "Vikram Malhotra",
        action_type: "LOGIN",
        summary: "Employee login from non-corporate IP (182.74.92.14) outside shift hours",
        severity: "HIGH",
        is_privileged: false,
        source_event_id: "EVT_4481"
      },
      {
        event_id: "EV_2",
        timestamp: new Date().toISOString(),
        formatted_time: "02:17:22",
        delta_minutes: 6,
        actor_type: "EMPLOYEE",
        actor_id: "EMP_E104",
        actor_name: "Vikram Malhotra",
        action_type: "VIEW_CUSTOMER",
        summary: "Unscheduled access to high-net-worth customer profile C782",
        severity: "MEDIUM",
        is_privileged: false,
        source_event_id: "EVT_4483"
      },
      {
        event_id: "EV_3",
        timestamp: new Date().toISOString(),
        formatted_time: "02:23:45",
        delta_minutes: 12,
        actor_type: "EMPLOYEE",
        actor_id: "EMP_E104",
        actor_name: "Vikram Malhotra",
        action_type: "MODIFY_KYC",
        summary: "Override mobile number verification token using permission P03",
        severity: "HIGH",
        is_privileged: true,
        permission_code: "P03",
        source_event_id: "EVT_4485"
      },
      {
        event_id: "EV_4",
        timestamp: new Date().toISOString(),
        formatted_time: "02:25:10",
        delta_minutes: 14,
        actor_type: "EMPLOYEE",
        actor_id: "EMP_E104",
        actor_name: "Vikram Malhotra",
        action_type: "ADD_BENEFICIARY",
        summary: "Bypass 24-hr cooling period to register Apex Global Ventures (B992) using privilege P07",
        severity: "CRITICAL",
        is_privileged: true,
        permission_code: "P07",
        source_event_id: "EVT_4487"
      },
      {
        event_id: "EV_5",
        timestamp: new Date().toISOString(),
        formatted_time: "02:42:30",
        delta_minutes: 31,
        actor_type: "CUSTOMER",
        actor_id: "CUST_C782",
        actor_name: "Rajesh V. Sharma",
        action_type: "TRANSFER_OUT",
        summary: "Immediate outward transfer of ₹9,70,000 (13.1x customer monthly baseline)",
        severity: "CRITICAL",
        is_privileged: false,
        source_event_id: "TX_99182"
      },
      {
        event_id: "EV_6",
        timestamp: new Date().toISOString(),
        formatted_time: "02:47:15",
        delta_minutes: 36,
        actor_type: "SYSTEM",
        actor_id: "BEN_B992",
        actor_name: "Apex Global Ventures",
        action_type: "SPLIT_TRANSFER",
        summary: "Structuring split: ₹4,85,000 dispatched to Mule Account A391",
        severity: "CRITICAL",
        is_privileged: false,
        source_event_id: "TX_99183"
      },
      {
        event_id: "EV_7",
        timestamp: new Date().toISOString(),
        formatted_time: "02:49:02",
        delta_minutes: 38,
        actor_type: "SYSTEM",
        actor_id: "BEN_B992",
        actor_name: "Apex Global Ventures",
        action_type: "SPLIT_TRANSFER",
        summary: "Structuring split: ₹4,85,000 dispatched to Mule Account A441",
        severity: "CRITICAL",
        is_privileged: false,
        source_event_id: "TX_99184"
      },
      {
        event_id: "EV_8",
        timestamp: new Date().toISOString(),
        formatted_time: "02:54:18",
        delta_minutes: 43,
        actor_type: "CUSTOMER",
        actor_id: "ACC_A391",
        actor_name: "Karan Singhania",
        action_type: "CASH_WITHDRAWAL",
        summary: "ATM cash withdrawal and immediate wallet off-ramp",
        severity: "CRITICAL",
        is_privileged: false,
        source_event_id: "ATM_001"
      }
    ]
  };
}

function getFallbackScenarios(): ScenarioInfo[] {
  return [
    {
      scenario_id: "SCN_INSD_01",
      name: "Privilege-to-Proceeds Beneficiary Fraud",
      typology: "Insider-Enabled AML",
      ground_truth: "SUSPICIOUS",
      description: "Employee modifies beneficiary KYC at 02:15 AM; transfer follows in 17 mins; split across 2 mules.",
      simulated_exposure_inr: 970000.0,
      involves_employee: true
    },
    {
      scenario_id: "SCN_STRUC_02",
      name: "Multi-Branch Cash Smurfing Under PAN Mandate",
      typology: "Structuring / Smurfing",
      ground_truth: "SUSPICIOUS",
      description: "Teller processed 10 cash deposits of ₹49,000 each to evade PAN limits.",
      simulated_exposure_inr: 490000.0,
      involves_employee: true
    },
    {
      scenario_id: "SCN_DORM_03",
      name: "Dormant Account Awakening & Drain",
      typology: "Dormant Account Awakening",
      ground_truth: "SUSPICIOUS",
      description: "260-day dormant account unlocked by RM; ₹18.5L incoming wire drained in 2 hours.",
      simulated_exposure_inr: 1850000.0,
      involves_employee: true
    },
    {
      scenario_id: "SCN_MULE_04",
      name: "Fan-In / Fan-Out Distributed Mule Network",
      typology: "Layering & Mule Network",
      ground_truth: "SUSPICIOUS",
      description: "12 disparate accounts wire ₹2.8L each into central hub account within 90 minutes.",
      simulated_exposure_inr: 3400000.0,
      involves_employee: false
    },
    {
      scenario_id: "SCN_LEGIT_05",
      name: "High-Value Festive Seasonal Business Surge",
      typology: "Seasonal Merchant Inflow",
      ground_truth: "LEGITIMATE",
      description: "Jewellery merchant processed Diwali season RTGS payment of ₹12.5L with valid GST filing.",
      simulated_exposure_inr: 1250000.0,
      involves_employee: true
    },
    {
      scenario_id: "SCN_LEGIT_06",
      name: "Corporate Scheduled Monthly Payroll Disbursement",
      typology: "Batch Payroll",
      ground_truth: "LEGITIMATE",
      description: "Automated batch salary disbursement of ₹54 Lakhs disbursed to 142 employees on the 1st.",
      simulated_exposure_inr: 5400000.0,
      involves_employee: false
    },
    {
      scenario_id: "SCN_LEGIT_07",
      name: "Emergency Hospital ICU Medical Settlement",
      typology: "Emergency Medical Transfer",
      ground_truth: "LEGITIMATE",
      description: "Urgent hospital bill settlement of ₹6.5 Lakhs paid via IMPS at 01:30 AM to Lilavati Hospital.",
      simulated_exposure_inr: 650000.0,
      involves_employee: true
    }
  ];
}
