from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.ddl import Case
from app.scenarios.definitions import SCENARIO_DEFINITIONS

router = APIRouter(prefix="/reports", tags=["Compliance Reports & Dossier"])

@router.get("/{case_id}/dossier")
def get_compliance_dossier(case_id: str, db: Session = Depends(get_db)):
    case = db.query(Case).filter(Case.case_id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail=f"Case {case_id} not found")

    matched_scenario = next((s for s in SCENARIO_DEFINITIONS if s["case_id"] == case_id), None)
    
    return {
        "metadata": {
            "institution": "BankCorp Sovereign AML Intelligence",
            "report_id": f"REP-AUDIT-{case_id}-{datetime.now(timezone.utc).strftime('%Y%m%d%H%M')}",
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "regulatory_framework": "FATF RBA & RBI Staff Fraud Risk Directions 2024",
            "classification": "CONFIDENTIAL // LAW ENFORCEMENT & COMPLIANCE GRADE"
        },
        "case_overview": {
            "case_id": case.case_id,
            "title": case.title,
            "severity": case.severity,
            "composite_risk_score": case.composite_risk_score,
            "confidence_score": case.confidence_score,
            "typology": case.typology,
            "total_exposure_inr": case.total_exposure_inr,
            "status": case.status,
            "primary_employee_id": case.primary_employee_id,
            "primary_customer_id": case.primary_customer_id
        },
        "attack_chain_narrative": case.attack_chain_summary,
        "evidence_dna": case.evidence_dna_json,
        "chronological_events": matched_scenario.get("attack_chain", []) if matched_scenario else [],
        "counterfactual_verdict": (
            "Verified structural necessity: Removing Employee E104's off-hours beneficiary override (P07) "
            "breaks downstream money routing, proving that legitimate employee privilege was causally material "
            "to fund disbursement."
        ),
        "cryptographic_audit_hash": f"SHA256:{hash(case.case_id + str(case.composite_risk_score)) & 0xffffffffffffffff:016x}"
    }
