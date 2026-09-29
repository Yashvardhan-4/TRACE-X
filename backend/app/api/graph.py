from datetime import datetime, timezone, timedelta
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.ddl import Case
from app.models.schemas import InvestigationGraphResponse, TimelineResponse, TimelineEvent
from app.engines.money_flow_graph import money_flow_graph_engine
from app.scenarios.definitions import SCENARIO_DEFINITIONS

router = APIRouter(prefix="/cases", tags=["Graph & Timeline"])

@router.get("/{case_id}/graph", response_model=InvestigationGraphResponse)
def get_case_graph(case_id: str, db: Session = Depends(get_db)):
    case = db.query(Case).filter(Case.case_id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail=f"Case {case_id} not found")
    
    return money_flow_graph_engine.build_case_graph(case_id, {})

@router.get("/{case_id}/timeline", response_model=TimelineResponse)
def get_case_timeline(case_id: str, db: Session = Depends(get_db)):
    case = db.query(Case).filter(Case.case_id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail=f"Case {case_id} not found")

    # Match predefined attack chain or generate default
    matched_scenario = next((s for s in SCENARIO_DEFINITIONS if s["case_id"] == case_id), None)
    
    events: List[TimelineEvent] = []
    base_time = case.created_at or datetime.now(timezone.utc)

    if matched_scenario and "attack_chain" in matched_scenario:
        for idx, step in enumerate(matched_scenario["attack_chain"]):
            evt_time = base_time + timedelta(minutes=step["delta"])
            is_priv = "MODIFY" in step["action"] or "ADD" in step["action"] or "OVERRIDE" in step["action"]
            perm_code = "P07" if "ADD_BENEFICIARY" in step["action"] else ("P03" if "MODIFY_KYC" in step["action"] else None)

            events.append(TimelineEvent(
                event_id=f"EVT_{case_id}_{idx+1}",
                timestamp=evt_time,
                formatted_time=step["time"],
                delta_minutes=step["delta"],
                actor_type="EMPLOYEE" if "EMP" in step["actor"] else ("CUSTOMER" if "CUST" in step["actor"] else "SYSTEM"),
                actor_id=step["actor"],
                actor_name=matched_scenario["primary_employee"]["name"] if "EMP" in step["actor"] else ("Rajesh V. Sharma" if "CUST" in step["actor"] else "Apex Global"),
                action_type=step["action"],
                summary=step["desc"],
                severity="CRITICAL" if step["delta"] >= 31 else "HIGH",
                is_privileged=is_priv,
                permission_code=perm_code,
                source_event_id=f"EVT_{4480 + idx}"
            ))
        total_duration = matched_scenario["attack_chain"][-1]["delta"]
    else:
        # Generic timeline fallback
        events.append(TimelineEvent(
            event_id=f"EVT_{case_id}_1",
            timestamp=base_time - timedelta(minutes=15),
            formatted_time="10:00:00",
            delta_minutes=0,
            actor_type="EMPLOYEE",
            actor_id="EMP_DEFAULT",
            actor_name="System Auditor",
            action_type="LOGIN",
            summary="Access initiated to customer records",
            severity="MEDIUM",
            is_privileged=False,
            source_event_id="EVT_GEN_01"
        ))
        events.append(TimelineEvent(
            event_id=f"EVT_{case_id}_2",
            timestamp=base_time,
            formatted_time="10:15:00",
            delta_minutes=15,
            actor_type="CUSTOMER",
            actor_id="CUST_DEFAULT",
            actor_name="Account Holder",
            action_type="TRANSFER",
            summary=f"Disbursement of ₹{case.total_exposure_inr:,.2f}",
            severity="HIGH",
            is_privileged=False,
            source_event_id="TX_GEN_01"
        ))
        total_duration = 15

    return TimelineResponse(case_id=case_id, total_duration_minutes=total_duration, events=events)
