export type AnalyticsSummary = {
  total_tickets: number;
  escalated_tickets: number;
  escalation_rate: number;
  avg_confidence: number;
  avg_latency_ms: number;
};

export type EscalationItem = {
  ticket_id: number;
  risk_score: number;
  reasons: string[];
};

export type TimelineEvent = {
  ticket_id: number;
  step_name: string;
  latency_ms: number;
  created_at: string;
};

export type ProcessTicketResult = {
  ticket_id: number;
  escalated: boolean;
  escalation_reasons: string[];
  risk_score: number;
  response_text: string;
  confidence: {
    retrieval_confidence: number;
    safety_confidence: number;
    escalation_confidence: number;
    final_confidence: number;
  };
  gap_analysis?: {
    gap_detected: boolean;
    missing_topic: string;
    suggested_content: string;
    impact_score: number;
  };
  traces?: any[];
  citations?: any[];
};

const API_BASE = import.meta.env.VITE_BACKEND_URL ?? "http://127.0.0.1:8001";
const API_KEY = import.meta.env.VITE_BACKEND_API_KEY ?? "sentinel-dev-key";

function apiHeaders() {
  return {
    "Content-Type": "application/json",
    "X-API-Key": API_KEY,
  };
}

async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { headers: { "X-API-Key": API_KEY } });
  if (!res.ok) {
    throw new Error(`GET ${path} failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function getAnalyticsSummary() {
  return apiGet<AnalyticsSummary>("/api/v1/analytics/summary");
}

export async function getEscalationQueue() {
  return apiGet<EscalationItem[]>("/api/v1/escalations/queue");
}

export async function getTimeline() {
  const payload = await apiGet<{ events: TimelineEvent[] }>("/api/v1/analytics/timeline");
  return payload.events;
}

export async function processTicket(params: { source: "hackerrank" | "claude" | "visa"; subject: string; body: string }) {
  const res = await fetch(`${API_BASE}/api/v1/tickets/process`, {
    method: "POST",
    headers: apiHeaders(),
    body: JSON.stringify({
      source: params.source,
      customer_id: `web-${Date.now()}`,
      subject: params.subject,
      body: params.body,
    }),
  });
  if (!res.ok) {
    throw new Error(`POST /tickets/process failed: ${res.status}`);
  }
  return res.json() as Promise<ProcessTicketResult>;
}
export type RetrievalResult = {
  document_id: string;
  source: string;
  chunk: string;
  score: number;
  metadata: Record<string, any>;
};

export async function searchRetrieval(query: string, topK: number = 6) {
  return apiGet<{ query: string; results: RetrievalResult[] }>(`/api/v1/retrieval/search?q=${encodeURIComponent(query)}&top_k=${topK}`);
}

export async function* processTicketStream(params: { source: "hackerrank" | "claude" | "visa"; subject: string; body: string }) {
  const response = await fetch(`${API_BASE}/api/v1/tickets/process-stream`, {
    method: "POST",
    headers: apiHeaders(),
    body: JSON.stringify({
      source: params.source,
      customer_id: `web-${Date.now()}`,
      subject: params.subject,
      body: params.body,
    }),
  });

  if (!response.body) throw new Error("No response body");
  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    
    const chunk = decoder.decode(value);
    const lines = chunk.split("\n");
    
    for (const line of lines) {
      if (line.trim().startsWith("data: ")) {
        try {
          yield JSON.parse(line.trim().slice(6));
        } catch (e) {
          console.error("Error parsing stream chunk", e);
        }
      }
    }
  }
}

