from fastapi import APIRouter, HTTPException
from app.models.schemas import CounterfactualRequest, CounterfactualResponse
from app.engines.counterfactual import counterfactual_engine

router = APIRouter(prefix="/counterfactual", tags=["Counterfactual Sandbox"])

@router.post("/simulate", response_model=CounterfactualResponse)
def simulate_counterfactual_case(payload: CounterfactualRequest):
    return counterfactual_engine.simulate_counterfactual(
        case_id=payload.case_id,
        remove_employee=payload.remove_employee_intervention
    )
