from typing import Any, Literal
from pydantic import BaseModel, Field


class TicketCreate(BaseModel):
    source: Literal["hackerrank", "claude", "visa"]
    customer_id: str = "anonymous"
    subject: str
    body: str


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
