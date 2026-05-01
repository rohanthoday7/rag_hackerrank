import React from "react";
import { AlertTriangle, Bot, CheckCircle2, Clock3, ShieldCheck } from "lucide-react";
import {
  getAnalyticsSummary,
  getEscalationQueue,
  getTimeline,
  processTicket,
  type AnalyticsSummary,
  type EscalationItem,
  type TimelineEvent,
} from "./services/backendService";

type Source = "hackerrank" | "claude" | "visa";

const initialSummary: AnalyticsSummary = {
  total_tickets: 0,
  escalated_tickets: 0,
  escalation_rate: 0,
  avg_confidence: 0,
  avg_latency_ms: 0,
};

export default function App() {
  const [summary, setSummary] = React.useState<AnalyticsSummary>(initialSummary);
  const [queue, setQueue] = React.useState<EscalationItem[]>([]);
  const [timeline, setTimeline] = React.useState<TimelineEvent[]>([]);
  const [source, setSource] = React.useState<Source>("visa");
  const [subject, setSubject] = React.useState("");
  const [body, setBody] = React.useState("");
  const [result, setResult] = React.useState<string>("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState("");

  const refresh = React.useCallback(async () => {
    const [s, q, t] = await Promise.all([getAnalyticsSummary(), getEscalationQueue(), getTimeline()]);
    setSummary(s);
    setQueue(q);
    setTimeline(t);
  }, []);

  React.useEffect(() => {
    refresh().catch(() => setError("Failed to load backend metrics."));
    const id = setInterval(() => {
      refresh().catch(() => undefined);
    }, 7000);
    return () => clearInterval(id);
  }, [refresh]);

  const runTicket = async () => {
    if (!subject.trim() || !body.trim()) {
      setError("Subject and description are required.");
      return;
    }
    setError("");
    setBusy(true);
    setResult("");
    try {
      const response = await processTicket({ source, subject, body });
      setResult(
        `Ticket #${response.ticket_id} | escalated=${response.escalated} | risk=${response.risk_score.toFixed(2)} | final_confidence=${response.confidence.final_confidence.toFixed(2)}\n\n${response.response_text}`,
      );
      await refresh();
    } catch {
      setError("Ticket processing failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-slate-100 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex items-center justify-between border border-slate-700 rounded-lg p-4 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <Bot className="text-indigo-400" />
            <div>
              <h1 className="font-bold text-xl">SentinelSupport</h1>
              <p className="text-xs text-slate-400">Live backend-driven support orchestration dashboard</p>
            </div>
          </div>
          <button onClick={() => refresh()} className="px-3 py-2 text-sm border border-slate-600 rounded-md hover:border-indigo-400">
            Refresh
          </button>
        </header>

        {error ? (
          <div className="border border-red-500/40 bg-red-950/30 rounded-lg p-3 text-sm">{error}</div>
        ) : null}

        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricCard label="Total Tickets" value={summary.total_tickets.toString()} icon={<Bot size={16} />} />
          <MetricCard label="Escalated" value={summary.escalated_tickets.toString()} icon={<AlertTriangle size={16} />} />
          <MetricCard label="Escalation Rate" value={`${(summary.escalation_rate * 100).toFixed(1)}%`} icon={<ShieldCheck size={16} />} />
          <MetricCard label="Avg Confidence" value={`${(summary.avg_confidence * 100).toFixed(1)}%`} icon={<CheckCircle2 size={16} />} />
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-slate-700 rounded-lg p-4 bg-slate-900/40">
            <h2 className="font-semibold mb-3">Live Ticket Processor</h2>
            <div className="space-y-3">
              <select value={source} onChange={(e) => setSource(e.target.value as Source)} className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2">
                <option value="visa">visa</option>
                <option value="hackerrank">hackerrank</option>
                <option value="claude">claude</option>
              </select>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Ticket subject"
                className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2"
              />
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Ticket description"
                className="w-full h-28 bg-slate-950 border border-slate-700 rounded px-3 py-2"
              />
              <button disabled={busy} onClick={runTicket} className="px-4 py-2 bg-indigo-600 rounded text-sm font-semibold disabled:opacity-50">
                {busy ? "Processing..." : "Process Ticket"}
              </button>
            </div>
            <pre className="mt-4 text-xs whitespace-pre-wrap border border-slate-700 rounded p-3 bg-slate-950/70 min-h-28">{result || "No response yet."}</pre>
          </div>

          <div className="border border-slate-700 rounded-lg p-4 bg-slate-900/40">
            <h2 className="font-semibold mb-3">Pipeline Notes</h2>
            <div className="space-y-2 text-sm text-slate-300">
              <p>- Classification, retrieval, safety, escalation, response, and confidence all run server-side.</p>
              <p>- Live timeline panel below reflects persisted stage execution events in near-real time.</p>
              <p>- Use process endpoint for single-write consistency and deterministic audit logging.</p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-slate-700 rounded-lg p-4 bg-slate-900/40">
            <h2 className="font-semibold mb-3">Escalation Queue</h2>
            <div className="space-y-2">
              {queue.length === 0 ? <p className="text-sm text-slate-400">No active escalations.</p> : null}
              {queue.map((item) => (
                <div key={item.ticket_id} className="border border-slate-700 rounded p-3 text-sm bg-slate-950/60">
                  <p className="font-semibold">Ticket #{item.ticket_id}</p>
                  <p>Risk Score: {item.risk_score.toFixed(2)}</p>
                  <p className="text-slate-400">Reasons: {item.reasons.join(", ") || "n/a"}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-slate-700 rounded-lg p-4 bg-slate-900/40">
            <h2 className="font-semibold mb-3">Recent Timeline Events</h2>
            <div className="space-y-2 max-h-72 overflow-auto">
              {timeline.length === 0 ? <p className="text-sm text-slate-400">No timeline data yet.</p> : null}
              {timeline.slice(0, 25).map((evt, idx) => (
                <div key={`${evt.ticket_id}-${evt.step_name}-${idx}`} className="text-sm border border-slate-700 rounded p-2 bg-slate-950/60">
                  <div className="flex items-center gap-2">
                    <Clock3 size={14} className="text-indigo-400" />
                    <span>Ticket #{evt.ticket_id}</span>
                    <span className="text-slate-400">- {evt.step_name}</span>
                  </div>
                  <p className="text-xs text-slate-400">latency={evt.latency_ms}ms at {new Date(evt.created_at).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function MetricCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="border border-slate-700 rounded-lg p-4 bg-slate-900/40">
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-400 uppercase tracking-wide">{label}</p>
        <div className="text-indigo-300">{icon}</div>
      </div>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}
