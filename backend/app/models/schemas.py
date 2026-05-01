from typing import Any, Literal
from pydantic import BaseModel, Field


class TicketCreate(BaseModel):
    source: Literal["hackerrank", "claude", "visa"]
    customer_id: str = Field(default="anonymous", min_length=3, max_length=128)
    subject: str = Field(min_length=5, max_length=256)
    body: str = Field(min_length=10, max_length=8000)


class TicketResult(BaseModel):
    ticket_id: int
    escalated: bool
    escalation_reasons: list[str]
    risk_score: float
    response_text: str
    citations: list[dict[str, Any]]
    confidence: dict[str, float]
    traces: list[dict[str, Any]]
    analytics: dict[str, Any]
    gap_analysis: dict[str, Any] | None = None


class RetrievalHit(BaseModel):
    document_id: str
    source: str
    score: float
    chunk: str
    metadata: dict[str, Any] = Field(default_factory=dict)


class AnalyticsSummary(BaseModel):
    total_tickets: int
    escalated_tickets: int
    escalation_rate: float
    avg_confidence: float
    avg_latency_ms: float
