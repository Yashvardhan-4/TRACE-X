from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.schemas import CopilotQueryRequest, CopilotQueryResponse
from app.engines.copilot import copilot_engine

router = APIRouter(prefix="/copilot", tags=["Investigator Copilot"])

@router.post("/query", response_model=CopilotQueryResponse)
def query_case_copilot(payload: CopilotQueryRequest, db: Session = Depends(get_db)):
    return copilot_engine.query_copilot(
        db=db,
        case_id=payload.case_id,
        question=payload.question
    )
