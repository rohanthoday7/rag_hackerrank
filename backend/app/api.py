from fastapi import APIRouter, Depends
import json
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.responses import StreamingResponse
from app.core.database import get_db
from app.models.schemas import TicketCreate, TicketResult, AnalyticsSummary
from app.models.db_models import EscalationHistory, Trace, Transcript
from app.state import orchestrator, vector_store

router = APIRouter(prefix="/api/v1")


@router.post("/tickets/process", response_model=TicketResult)
async def process_ticket(payload: TicketCreate, db: AsyncSession = Depends(get_db)):
    return await orchestrator.process_ticket(db, payload)


@router.post("/tickets/process-stream")
async def process_ticket_stream(payload: TicketCreate):
    async def event_gen():
        async for event in orchestrator.process_ticket_stream(payload):
            yield f"data: {json.dumps(event)}\n\n"

    return StreamingResponse(event_gen(), media_type="text/event-stream")


@router.get("/analytics/summary", response_model=AnalyticsSummary)
async def analytics_summary(db: AsyncSession = Depends(get_db)):
    return await orchestrator.analytics_summary(db)


@router.get("/retrieval/search")
async def retrieval_search(q: str, top_k: int = 6):
    return {"query": q, "results": vector_store.search(q, top_k)}


@router.get("/escalations/queue")
async def escalation_queue(db: AsyncSession = Depends(get_db)):
    rows = (
        await db.execute(
            select(EscalationHistory.ticket_id, EscalationHistory.risk_score, EscalationHistory.reason_codes)
            .where(EscalationHistory.escalated.is_(True))
            .order_by(EscalationHistory.created_at.desc())
            .limit(50)
        )
    ).all()
    return [{"ticket_id": r[0], "risk_score": r[1], "reasons": r[2]} for r in rows]


@router.get("/tickets/{ticket_id}/traces")
async def ticket_traces(ticket_id: int, db: AsyncSession = Depends(get_db)):
    traces = (
        await db.execute(
            select(Trace.agent_name, Trace.step_name, Trace.latency_ms, Trace.reasoning)
            .where(Trace.ticket_id == ticket_id)
            .order_by(Trace.id.asc())
        )
    ).all()
    transcript = (
        await db.execute(
            select(Transcript.stage, Transcript.payload)
            .where(Transcript.ticket_id == ticket_id)
            .order_by(Transcript.id.asc())
        )
    ).all()
    return {
        "ticket_id": ticket_id,
        "trace_timeline": [{"agent_name": t[0], "step_name": t[1], "latency_ms": t[2], "reasoning": t[3]} for t in traces],
        "transcript": [{"stage": s[0], "payload": s[1]} for s in transcript],
    }


@router.get("/analytics/timeline")
async def analytics_timeline(db: AsyncSession = Depends(get_db)):
    rows = (await db.execute(select(Trace.ticket_id, Trace.step_name, Trace.latency_ms, Trace.created_at).order_by(Trace.created_at.desc()).limit(300))).all()
    return {
        "events": [
            {"ticket_id": r[0], "step_name": r[1], "latency_ms": r[2], "created_at": r[3].isoformat() if r[3] else None}
            for r in rows
        ]
    }
