# SentinelSupport Backend

Enterprise-style backend for AI-powered Support Triage & Escalation with:

- Multi-agent orchestration
- Safe RAG pipeline
- Escalation intelligence
- Explainable traces
- API + terminal-first operations

## Quick Start

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python -m app.seed_corpus
uvicorn app.main:app --reload --port 8001
```

Set required backend auth key in `.env`:

```bash
SENTINEL_API_KEY=sentinel-dev-key
SENTINEL_REQUIRE_API_KEY=true
```

Run CLI:

```bash
python -m app.terminal.cli simulate datasets/mock_tickets.json
python -m app.terminal.cli export-csv --output outputs/tickets.csv
```

Run tests:

```bash
python -m pytest -q
```

Streaming endpoint (SSE):

```bash
curl -N -X POST "http://127.0.0.1:8001/api/v1/tickets/process-stream" -H "X-API-Key: sentinel-dev-key" -H "Content-Type: application/json" -d "{\"source\":\"visa\",\"customer_id\":\"demo\",\"subject\":\"Unauthorized charge\",\"body\":\"Fraud alert on my card\"}"
```
