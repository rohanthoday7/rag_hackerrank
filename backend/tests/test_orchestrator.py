import asyncio
from app.models.schemas import TicketCreate
from app.core.database import SessionLocal, engine, Base
from app.state import orchestrator


def test_fraud_ticket_escalates():
    async def _run():
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        async with SessionLocal() as db:
            result = await orchestrator.process_ticket(
                db,
                TicketCreate(
                    source="visa",
                    customer_id="u1001",
                    subject="Unauthorized charge happened",
                    body="fraud on my visa card and suspicious activity",
                ),
            )
            assert result.escalated is True
            assert result.risk_score >= 0.65
            assert result.confidence["final_confidence"] <= 1.0
    asyncio.run(_run())


def test_grounded_response_has_citations_when_not_escalated():
    async def _run():
        async with SessionLocal() as db:
            result = await orchestrator.process_ticket(
                db,
                TicketCreate(
                    source="hackerrank",
                    customer_id="u1002",
                    subject="HackerRank login issue",
                    body="Account locked and reset not working",
                ),
            )
            if not result.escalated:
                assert len(result.citations) >= 1
    asyncio.run(_run())
