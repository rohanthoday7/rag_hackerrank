# Technology Rationale

- `FastAPI`: async-first API framework with strong OpenAPI generation for evaluator-visible contract quality.
- `Pydantic`: strict validation for ticket payloads and agent outputs, reducing unsafe pipeline drift.
- `SQLAlchemy (async) + SQLite`: fast local hackathon iteration with audit-grade relational schema; drop-in migration path to PostgreSQL.
- `Typer + Rich`: terminal-first operator workflows, cinematic colored demos, batch commands, and structured output UX.
- `structlog`: machine-parsable JSON logs for observability and explainability pipelines.
- `sentence-transformers`: production-standard semantic embedding layer for retrieval quality.
- `FAISS/Vector abstraction`: low-latency nearest-neighbor retrieval at scale; current implementation provides in-memory fallback for portability.
- `pytest + httpx/TestClient`: API and orchestration reliability with regression safety.
- `asyncio`: concurrent multi-ticket processing and non-blocking I/O for enterprise throughput patterns.
