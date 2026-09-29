from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.ddl import Case, Alert, EvidenceItem
from app.models.schemas import (
    CaseSummaryResponse, CaseDetailResponse, CaseStatusUpdateRequest,
    EvidenceDNA, AlertResponse, EvidenceItemResponse
)

router = APIRouter(prefix="/cases", tags=["Cases"])

@router.get("", response_model=List[CaseSummaryResponse])
def get_cases(
    status: Optional[str] = Query(None),
    severity: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    query = db.query(Case)
    if status:
        query = query.filter(Case.status == status)
    if severity:
        query = query.filter(Case.severity == severity)
    
    cases = query.order_by(Case.composite_risk_score.desc()).offset(offset).limit(limit).all()
    
    response = []
    for c in cases:
        dna_data = c.evidence_dna_json or {}
        dna = EvidenceDNA(
            insider_risk=dna_data.get("insider_risk", 50.0),
            privilege_exposure=dna_data.get("privilege_exposure", 50.0),
            structuring=dna_data.get("structuring", 50.0),
            network_anomaly=dna_data.get("network_anomaly", 50.0),
            temporal_correlation=dna_data.get("temporal_correlation", 50.0),
            profile_deviation=dna_data.get("profile_deviation", 50.0),
            device_anomaly=dna_data.get("device_anomaly", 50.0)
        )
        response.append(CaseSummaryResponse(
            case_id=c.case_id,
            title=c.title,
            severity=c.severity,
            composite_risk_score=c.composite_risk_score,
            confidence_score=c.confidence_score,
            status=c.status,
            assigned_investigator=c.assigned_investigator,
            primary_employee_id=c.primary_employee_id,
            primary_customer_id=c.primary_customer_id,
            total_exposure_inr=c.total_exposure_inr,
            typology=c.typology,
            evidence_dna=dna,
            created_at=c.created_at
        ))
    return response

@router.get("/{case_id}", response_model=CaseDetailResponse)
def get_case_detail(case_id: str, db: Session = Depends(get_db)):
    c = db.query(Case).filter(Case.case_id == case_id).first()
    if not c:
        raise HTTPException(status_code=404, detail=f"Case {case_id} not found")

    dna_data = c.evidence_dna_json or {}
    dna = EvidenceDNA(
        insider_risk=dna_data.get("insider_risk", 50.0),
        privilege_exposure=dna_data.get("privilege_exposure", 50.0),
        structuring=dna_data.get("structuring", 50.0),
        network_anomaly=dna_data.get("network_anomaly", 50.0),
        temporal_correlation=dna_data.get("temporal_correlation", 50.0),
        profile_deviation=dna_data.get("profile_deviation", 50.0),
        device_anomaly=dna_data.get("device_anomaly", 50.0)
    )

    alerts = [
        AlertResponse(
            alert_id=a.alert_id,
            source_system=a.source_system,
            alert_name=a.alert_name,
            severity=a.severity,
            created_at=a.created_at
        ) for a in c.alerts
    ]

    evidence_items = [
        EvidenceItemResponse(
            evidence_id=e.evidence_id,
            case_id=e.case_id,
            engine_name=e.engine_name,
            claim=e.claim,
            deviation_factor=e.deviation_factor,
            source_event_type=e.source_event_type,
            source_event_id=e.source_event_id,
            event_timestamp=e.event_timestamp,
            rule_or_model_ref=e.rule_or_model_ref,
            payload_json=e.payload_json or {}
        ) for e in c.evidence_items
    ]

    return CaseDetailResponse(
        case_id=c.case_id,
        title=c.title,
        severity=c.severity,
        composite_risk_score=c.composite_risk_score,
        confidence_score=c.confidence_score,
        status=c.status,
        assigned_investigator=c.assigned_investigator,
        primary_employee_id=c.primary_employee_id,
        primary_customer_id=c.primary_customer_id,
        total_exposure_inr=c.total_exposure_inr,
        typology=c.typology,
        evidence_dna=dna,
        attack_chain_summary=c.attack_chain_summary,
        alerts=alerts,
        evidence_items=evidence_items,
        created_at=c.created_at
    )

@router.patch("/{case_id}/status", response_model=CaseSummaryResponse)
def update_case_status(case_id: str, payload: CaseStatusUpdateRequest, db: Session = Depends(get_db)):
    c = db.query(Case).filter(Case.case_id == case_id).first()
    if not c:
        raise HTTPException(status_code=404, detail=f"Case {case_id} not found")

    c.status = payload.status
    if payload.assigned_investigator:
        c.assigned_investigator = payload.assigned_investigator
    db.commit()
    db.refresh(c)

    dna_data = c.evidence_dna_json or {}
    dna = EvidenceDNA(
        insider_risk=dna_data.get("insider_risk", 50.0),
        privilege_exposure=dna_data.get("privilege_exposure", 50.0),
        structuring=dna_data.get("structuring", 50.0),
        network_anomaly=dna_data.get("network_anomaly", 50.0),
        temporal_correlation=dna_data.get("temporal_correlation", 50.0),
        profile_deviation=dna_data.get("profile_deviation", 50.0),
        device_anomaly=dna_data.get("device_anomaly", 50.0)
    )

    return CaseSummaryResponse(
        case_id=c.case_id,
        title=c.title,
        severity=c.severity,
        composite_risk_score=c.composite_risk_score,
        confidence_score=c.confidence_score,
        status=c.status,
        assigned_investigator=c.assigned_investigator,
        primary_employee_id=c.primary_employee_id,
        primary_customer_id=c.primary_customer_id,
        total_exposure_inr=c.total_exposure_inr,
        typology=c.typology,
        evidence_dna=dna,
        created_at=c.created_at
    )
