from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from app.agents.types import AgentContext
from app.agents.classifier_agent import ClassifierAgent
from app.agents.retrieval_agent import RetrievalAgent
from app.agents.safety_agent import SafetyAgent
from app.agents.escalation_agent import EscalationAgent
from app.agents.response_agent import ResponseAgent
from app.agents.confidence_agent import ConfidenceAgent
from app.agents.observability_agent import ObservabilityAgent
from app.models.db_models import Ticket, RetrievalLog, EscalationHistory, ConfidenceScore, ResponseRecord, Transcript, Trace
from app.models.schemas import TicketCreate, TicketResult, AnalyticsSummary
from app.retrieval.vector_store import InMemoryVectorStore


class SentinelOrchestrator:
    def __init__(self, vector_store: InMemoryVectorStore):
        self.classifier = ClassifierAgent()
        self.retrieval = RetrievalAgent(vector_store)
        self.safety = SafetyAgent()
        self.escalation = EscalationAgent()
        self.response = ResponseAgent()
        self.confidence = ConfidenceAgent()
        self.observe = ObservabilityAgent()

    async def process_ticket(self, db: AsyncSession, payload: TicketCreate) -> TicketResult:
        try:
            ticket = Ticket(source=payload.source, customer_id=payload.customer_id, subject=payload.subject, body=payload.body)
            db.add(ticket)
            await db.flush()
            ctx = AgentContext(ticket_id=ticket.id, source=ticket.source, subject=ticket.subject, body=ticket.body)

            await self.observe.timed(ctx, self.classifier.name, "classify", self.classifier.run)
            await self.observe.timed(ctx, self.retrieval.name, "retrieve", self.retrieval.run)
            await self.observe.timed(ctx, self.safety.name, "safety", self.safety.run)
            await self.observe.timed(ctx, self.escalation.name, "escalation", self.escalation.run)
            await self.observe.timed(ctx, self.response.name, "respond", self.response.run)
            await self.observe.timed(ctx, self.confidence.name, "confidence", self.confidence.run)

            for hit in ctx.retrieval.get("hits", []):
                db.add(
                    RetrievalLog(
                        ticket_id=ticket.id,
                        query=ctx.retrieval.get("query", ""),
                        document_id=hit["document_id"],
                        score=hit["score"],
                        metadata_json=hit["metadata"],
                    )
                )
            db.add(EscalationHistory(ticket_id=ticket.id, escalated=ctx.escalation["escalated"], reason_codes=ctx.escalation["reasons"], risk_score=ctx.escalation["risk_score"], explanation=";".join(ctx.escalation["reasons"])))
            db.add(ConfidenceScore(ticket_id=ticket.id, breakdown=ctx.confidence, **ctx.confidence))
            db.add(ResponseRecord(ticket_id=ticket.id, response_text=ctx.response["response_text"], citations=ctx.response["citations"], grounded=ctx.response["grounded"]))
            for stage, content in [("classification", ctx.classification), ("retrieval", ctx.retrieval), ("safety", ctx.safety), ("escalation", ctx.escalation), ("response", ctx.response), ("confidence", ctx.confidence)]:
                db.add(Transcript(ticket_id=ticket.id, stage=stage, payload=content))
            for trace in ctx.traces:
                db.add(Trace(ticket_id=ticket.id, **trace))
            await db.commit()

            analytics = {"total_latency_ms": sum(t["latency_ms"] for t in ctx.traces), "stages": len(ctx.traces)}
            return TicketResult(
                ticket_id=ticket.id,
                escalated=ctx.escalation["escalated"],
                escalation_reasons=ctx.escalation["reasons"],
                risk_score=ctx.escalation["risk_score"],
                response_text=ctx.response["response_text"],
                citations=ctx.response["citations"],
                confidence=ctx.confidence,
                traces=ctx.traces,
                analytics=analytics,
            )
        except Exception:
            await db.rollback()
            raise

    async def process_ticket_stream(self, payload: TicketCreate):
        ctx = AgentContext(ticket_id=0, source=payload.source, subject=payload.subject, body=payload.body)
        yield {"stage": "received", "payload": {"source": payload.source, "subject": payload.subject}}
        await self.observe.timed(ctx, self.classifier.name, "classify", self.classifier.run)
        yield {"stage": "classification", "payload": ctx.classification}
        await self.observe.timed(ctx, self.retrieval.name, "retrieve", self.retrieval.run)
        yield {"stage": "retrieval", "payload": {"query": ctx.retrieval.get("query", ""), "hits": len(ctx.retrieval.get("hits", []))}}
        await self.observe.timed(ctx, self.safety.name, "safety", self.safety.run)
        yield {"stage": "safety", "payload": ctx.safety}
        await self.observe.timed(ctx, self.escalation.name, "escalation", self.escalation.run)
        yield {"stage": "escalation", "payload": ctx.escalation}
        await self.observe.timed(ctx, self.response.name, "respond", self.response.run)
        await self.observe.timed(ctx, self.confidence.name, "confidence", self.confidence.run)
        yield {"stage": "completed", "payload": {"confidence": ctx.confidence, "response": ctx.response}}

    async def analytics_summary(self, db: AsyncSession) -> AnalyticsSummary:
        total = await db.scalar(select(func.count(Ticket.id)))
        escalated = await db.scalar(select(func.count(EscalationHistory.id)).where(EscalationHistory.escalated.is_(True)))
        avg_conf = await db.scalar(select(func.avg(ConfidenceScore.final_confidence)))
        avg_lat = await db.scalar(select(func.avg(Trace.latency_ms)))
        total = int(total or 0)
        escalated = int(escalated or 0)
        return AnalyticsSummary(
            total_tickets=total,
            escalated_tickets=escalated,
            escalation_rate=(escalated / total) if total else 0.0,
            avg_confidence=float(avg_conf or 0.0),
            avg_latency_ms=float(avg_lat or 0.0),
        )
