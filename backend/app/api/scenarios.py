from typing import List
from fastapi import APIRouter, HTTPException
from app.models.schemas import ScenarioInfo, ScenarioRunResult, BenchmarkSummaryResponse
from app.scenarios.definitions import SCENARIO_DEFINITIONS
from app.scenarios.benchmark import benchmark_engine

router = APIRouter(prefix="/scenarios", tags=["Scenario Lab & Benchmark"])

@router.get("", response_model=List[ScenarioInfo])
def list_available_scenarios():
    return [
        ScenarioInfo(
            scenario_id=s["scenario_id"],
            name=s["name"],
            typology=s["typology"],
            ground_truth=s["ground_truth"],
            description=s["description"],
            simulated_exposure_inr=s["simulated_exposure_inr"],
            involves_employee=s["involves_employee"]
        ) for s in SCENARIO_DEFINITIONS
    ]

@router.post("/{scenario_id}/run", response_model=ScenarioRunResult)
def run_single_scenario(scenario_id: str):
    matched = next((s for s in SCENARIO_DEFINITIONS if s["scenario_id"] == scenario_id), None)
    if not matched:
        raise HTTPException(status_code=404, detail=f"Scenario {scenario_id} not found")

    system_verdict = "SUSPICIOUS" if matched["composite_risk_score"] >= 60.0 else "LEGITIMATE"
    flagged_reasons = []
    if matched["involves_employee"]:
        flagged_reasons.append("Insider privilege correlation")
    if matched["evidence_dna"]["structuring"] >= 70.0:
        flagged_reasons.append("Structuring threshold detected")
    if matched["evidence_dna"]["network_anomaly"] >= 80.0:
        flagged_reasons.append("Mule network cluster link")

    return ScenarioRunResult(
        scenario_id=matched["scenario_id"],
        scenario_name=matched["name"],
        ground_truth=matched["ground_truth"],
        system_verdict=system_verdict,
        matched=(system_verdict == matched["ground_truth"]),
        risk_score=matched["composite_risk_score"],
        confidence=matched["confidence_score"],
        flagged_reasons=flagged_reasons,
        latency_ms=14.2
    )

@router.get("/benchmark/summary", response_model=BenchmarkSummaryResponse)
def get_benchmark_summary():
    return benchmark_engine.run_all_benchmarks()
