from fastapi.testclient import TestClient
from app.main import app

HEADERS = {"X-API-Key": "sentinel-dev-key"}


def test_process_ticket_endpoint():
    payload = {
        "source": "claude",
        "customer_id": "u100-test",
        "subject": "Billing dispute",
        "body": "Need help with invoice and unauthorized billing.",
    }
    with TestClient(app) as client:
        response = client.post("/api/v1/tickets/process", json=payload, headers=HEADERS)
    assert response.status_code == 200
    body = response.json()
    assert "ticket_id" in body
    assert "confidence" in body


def test_retrieval_search_endpoint():
    with TestClient(app) as client:
        response = client.get("/api/v1/retrieval/search?q=billing+invoice", headers=HEADERS)
    assert response.status_code == 200
    assert "results" in response.json()
