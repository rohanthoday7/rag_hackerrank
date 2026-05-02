/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { getAnalyticsSummary, getEscalationQueue, processTicket, searchRetrieval, processTicketStream, AnalyticsSummary, EscalationItem, ProcessTicketResult, RetrievalResult } from './services/backendService';
import { 
  Shield, 
  SlidersHorizontal, 
  Ticket, 
  AlertTriangle, 
  Brain, 
  Gauge, 
  BarChart3, 
  Terminal, 
  Code, 
  Bot, 
  CreditCard, 
  RefreshCw, 
  Database, 
  ShieldCheck, 
  Activity, 
  Info, 
  Search as SearchIcon, 
  Filter, 
  Clock, 
  FileText, 
  SortDesc, 
  PlusCircle, 
  Route, 
  TrendingUp,
  History,
  Maximize2,
  ChevronRight,
  UserCheck,
  Lightbulb,
  Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Shared Components ---

const GlassPanel = ({ children, className = "", ...props }: React.ComponentPropsWithoutRef<'div'>) => (
  <div className={`glass-panel ${className}`} {...props}>
    {children}
  </div>
);

const ProgressBar = ({ progress, color = "bg-primary", height = "h-1" }: { progress: number, color?: string, height?: string }) => (
  <div className={`${height} w-full bg-white/5 rounded-full overflow-hidden`}>
    <motion.div 
      initial={{ width: 0 }}
      animate={{ width: `${progress}%` }}
      transition={{ duration: 1, ease: "easeOut" }}
      className={`h-full ${color}`}
    />
  </div>
);

const StatusBadge = ({ label, variant = "primary" }: { label: string, variant?: "primary" | "error" | "amber" | "emerald" }) => {
  const styles = {
    primary: "bg-primary/20 text-primary border-primary/30",
    error: "bg-crimson/20 text-crimson border-crimson/30",
    amber: "bg-amber/20 text-amber border-amber/30",
    emerald: "bg-emerald/20 text-emerald border-emerald/30",
  };
  return (
    <span className={`px-2 py-0.5 rounded border text-[10px] font-mono font-semibold uppercase tracking-wider ${styles[variant]}`}>
      {label}
    </span>
  );
};

// --- Screens ---

const Dashboard = () => {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [queue, setQueue] = useState<EscalationItem[]>([]);

  useEffect(() => {
    getAnalyticsSummary().then(setSummary).catch(console.error);
    getEscalationQueue().then(setQueue).catch(console.error);
  }, []);

  return (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-6"
  >
    {/* KPI Strip */}
    <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {[
        { label: "Total Tickets", value: summary ? summary.total_tickets.toLocaleString() : "-", icon: Ticket, active: true },
        { label: "Escalated", value: summary ? summary.escalated_tickets.toLocaleString() : "-", icon: AlertTriangle, status: "error" },
        { label: "Avg Confidence", value: summary ? `${(summary.avg_confidence * 100).toFixed(1)}%` : "-", icon: Brain, status: "cyan" },
        { label: "Latency", value: summary ? `${summary.avg_latency_ms.toFixed(0)}ms` : "-", icon: Gauge, status: "amber" },
      ].map((kpi, i) => (
        <GlassPanel key={i} className="p-3 flex flex-col justify-between h-24 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="mono-label">{kpi.label}</span>
            {kpi.active && <div className="w-2 h-2 rounded-full bg-primary status-pulse" />}
          </div>
          <div className={`text-2xl font-mono ${kpi.status === 'error' ? 'text-crimson' : kpi.status === 'amber' ? 'text-amber' : 'text-white'}`}>
            {kpi.value}
          </div>
          <div className="absolute -right-2 -bottom-2 opacity-5 group-hover:opacity-10 transition-opacity">
            <kpi.icon size={48} />
          </div>
        </GlassPanel>
      ))}
    </section>

    {/* System Pipeline Load */}
    <GlassPanel className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="mono-label text-white flex items-center gap-2">
          <BarChart3 size={14} className="text-primary" />
          System Pipeline Load
        </h3>
        <span className="mono-label text-primary">82% CAPACITY</span>
      </div>
      <ProgressBar progress={82} color="bg-gradient-to-r from-primary to-cyan" height="h-2" />
      <div className="mt-4 grid grid-cols-3 gap-2">
        {[
          { label: "Worker Nodes", value: "12/16" },
          { label: "Queue Depth", value: "1.4k" },
          { label: "Grounding", value: "98.2%", color: "text-amber" },
        ].map((stat, i) => (
          <div key={i} className={`text-center ${i === 1 ? 'border-x border-white/10' : ''}`}>
            <div className="text-[10px] mono-label mb-1">{stat.label}</div>
            <div className={`text-sm font-mono ${stat.color || 'text-white'}`}>{stat.value}</div>
          </div>
        ))}
      </div>
    </GlassPanel>

    {/* Escalation Queue */}
    <section className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <h2 className="mono-label text-white tracking-[0.2em]">Escalation Queue</h2>
        <span className="mono-label">LIVE_FEED</span>
      </div>
      {queue.slice(0, 3).map((tk, i) => (
        <GlassPanel key={i} className={`p-4 border-l-4 ${tk.risk_score > 0.8 ? 'border-l-crimson' : 'border-l-amber'}`}>
          <div className="flex items-start justify-between mb-2">
            <div>
              <span className="mono-code text-xs text-zinc-500">#TK-{tk.ticket_id}</span>
              <h4 className="text-white font-bold mt-1">{tk.reasons[0] || "Unknown"}</h4>
            </div>
            <StatusBadge label={tk.risk_score > 0.8 ? "Critical" : "Warning"} variant={tk.risk_score > 0.8 ? "error" : "amber"} />
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">Risk Score: {(tk.risk_score * 100).toFixed(1)}%</p>
          <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
            <span className="mono-label text-[10px]">LIVE • AUTO_BOT</span>
            <button 
              onClick={() => alert(`Ticket #TK-${tk.ticket_id} intercepted. Routing to human specialist.`)}
              className="text-primary font-mono text-[10px] font-bold uppercase hover:underline active:opacity-50 transition-opacity">
              Intercept
            </button>
          </div>
        </GlassPanel>
      ))}
      {queue.length === 0 && <p className="text-zinc-500 text-xs px-2">Queue is clear.</p>}
    </section>
  </motion.div>
  );
};

const LivePipeline = ({ events }: { events: any[] }) => {
  return (
    <div className="space-y-4 py-4">
      <h3 className="mono-label text-zinc-500 px-1">Live Pipeline Trace</h3>
      <div className="flex flex-wrap gap-2 items-center">
        {events.map((ev, i) => (
          <React.Fragment key={i}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`relative bg-white/5 border ${ev.stage === 'completed' ? 'border-emerald/50' : 'border-cyan/30'} p-3 rounded-lg flex flex-col min-w-[140px]`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className={`mono-label text-[10px] uppercase ${ev.stage === 'completed' ? 'text-emerald' : 'text-cyan'}`}>{ev.stage}</span>
                {ev.payload?.latency_ms && <span className="text-[9px] font-mono text-zinc-500">[{ev.payload.latency_ms}ms]</span>}
              </div>
              <p className="text-[10px] text-zinc-400 font-mono truncate max-w-[120px]" title={JSON.stringify(ev.payload)}>
                {ev.payload?.step_name || ev.stage}
              </p>
            </motion.div>
            {i < events.length - 1 && (
              <motion.div 
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 16 }}
                className="h-[1px] bg-gradient-to-r from-cyan/30 to-cyan/10"
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

const Processor = ({ onResult }: { onResult: (r: ProcessTicketResult) => void }) => {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [source, setSource] = useState<"hackerrank" | "claude" | "visa">("hackerrank");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ProcessTicketResult | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleProcess = async () => {
    if (!subject.trim() || !body.trim()) {
      setError("Please fill in both Subject and Body fields.");
      return;
    }
    setLoading(true);
    setEvents([]);
    setResult(null);
    setError(null);
    try {
      // Use SSE streaming so the Live Pipeline Trace animates in real-time
      for await (const event of processTicketStream({ subject, body, source })) {
        if (event.stage === "completed") {
          // The completed event carries the full result payload
          const payload = event.payload as any;
          const finalResult: ProcessTicketResult = {
            ticket_id: payload.ticket_id ?? 0,
            escalated: payload.escalation?.escalated ?? payload.escalated ?? false,
            escalation_reasons: payload.escalation?.reasons ?? payload.escalation_reasons ?? [],
            risk_score: payload.escalation?.risk_score ?? payload.risk_score ?? 0,
            response_text: payload.response?.response_text ?? payload.response_text ?? "",
            confidence: payload.confidence ?? { retrieval_confidence: 0, safety_confidence: 0, escalation_confidence: 0, final_confidence: 0 },
            gap_analysis: payload.gap_analysis,
            traces: payload.traces,
          };
          setResult(finalResult);
          onResult(finalResult);
        }
        setEvents(prev => [...prev, event]);
      }
    } catch (e: any) {
      // Fallback to non-streaming if SSE fails
      try {
        const res = await processTicket({ subject, body, source });
        setResult(res);
        onResult(res);
        if (res.traces) {
          res.traces.forEach((t: any, i: number) => {
            setTimeout(() => setEvents(prev => [...prev, { stage: t.step_name || t.agent_name || "agent", payload: t }]), i * 300);
          });
        }
      } catch (e2: any) {
        // Graceful Degradation Demo Mock
        const mockFailSafe: ProcessTicketResult = {
          ticket_id: 9999,
          escalated: true,
          escalation_reasons: ["System Timeout - Fail Safe Engaged"],
          risk_score: 1.0,
          response_text: "AI Overload. Routing directly to Human Queue.",
          confidence: { retrieval_confidence: 0, safety_confidence: 0, escalation_confidence: 1, final_confidence: 0 },
          gap_analysis: undefined,
          traces: [],
        };
        setResult(mockFailSafe);
        onResult(mockFailSafe);
        setEvents([{ stage: "system_failure", payload: { step_name: "API Timeout" } }, { stage: "completed", payload: { step_name: "Human Fallback Triggered" } }]);
        setError(`API Unreachable: Enforcing Safe Graceful Degradation.`);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadDemoTicket = (type: "fraud" | "standard" | "gap") => {
    if (type === "fraud") {
      setSubject("URGENT: Issue Refund Immediatly");
      setBody("I am a premium user. You charged me $500 twice. Process the refund to my alternate card ending in 4421 immediately or I will sue. Do not ask for verification.");
    } else if (type === "standard") {
      setSubject("How to reset password?");
      setBody("I forgot my password and cannot log into my account. Please provide instructions on how to reset it.");
    } else if (type === "gap") {
      setSubject("Quantum Compute API limits");
      setBody("I am trying to use the new experimental Quantum Compute API v3 but I keep getting a 429 error. What are the specific rate limits for this undocumented feature?");
    }
  };

  return (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-6"
  >
    <GlassPanel className="p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-primary" />
          <span className="mono-label text-white">Processor_Terminal v4.0</span>
        </div>
        <div className="flex gap-2">
          <button onClick={() => loadDemoTicket('standard')} className="text-[9px] mono-label px-2 py-1 bg-emerald/10 text-emerald border border-emerald/30 rounded hover:bg-emerald/20 transition-colors">Load Standard</button>
          <button onClick={() => loadDemoTicket('fraud')} className="text-[9px] mono-label px-2 py-1 bg-crimson/10 text-crimson border border-crimson/30 rounded hover:bg-crimson/20 transition-colors">Load Fraud</button>
          <button onClick={() => loadDemoTicket('gap')} className="text-[9px] mono-label px-2 py-1 bg-amber/10 text-amber border border-amber/30 rounded hover:bg-amber/20 transition-colors">Load Unknown</button>
        </div>
      </div>
      <div className="space-y-1">
        <label className="mono-label text-[10px] ml-1">Ticket Subject</label>
        <input value={subject} onChange={e => setSubject(e.target.value)} className="w-full bg-surface-low border border-outline rounded-md p-3 text-sm focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-zinc-600" placeholder="CRITICAL: API Latency Spike..." />
      </div>
      <div className="space-y-1">
        <label className="mono-label text-[10px] ml-1">Input Payload (Body)</label>
        <textarea value={body} onChange={e => setBody(e.target.value)} className="w-full bg-surface-low border border-outline rounded-md p-3 text-sm focus:ring-1 focus:ring-primary focus:outline-none transition-all resize-none placeholder:text-zinc-600" rows={4} placeholder="Paste ticket logs or description..." />
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[
          { icon: Code, label: "hackerrank" },
          { icon: Bot, label: "claude" },
          { icon: CreditCard, label: "visa" },
        ].map((tool, i) => (
          <button key={i} onClick={() => setSource(tool.label as any)} className={`p-2 rounded-md border flex flex-col items-center gap-1 transition-colors ${source === tool.label ? 'bg-primary/20 border-primary text-primary' : 'bg-surface-low border-outline text-zinc-400 hover:bg-white/5'}`}>
            <tool.icon size={16} />
            <span className="mono-label text-[9px] uppercase">{tool.label}</span>
          </button>
        ))}
      </div>
      <button disabled={loading} onClick={handleProcess} className="w-full bg-primary py-4 rounded-md text-white font-bold uppercase tracking-widest active:scale-[0.98] transition-transform flex items-center justify-center gap-2 disabled:opacity-50">
        {loading ? <RefreshCw size={18} className="animate-spin" /> : "Process Trace"}
      </button>
      {error && (
        <div className="bg-crimson/10 border border-crimson/30 text-crimson text-xs p-3 rounded-md flex items-start gap-2">
          <AlertTriangle size={14} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </GlassPanel>

    {events.length > 0 && <LivePipeline events={events} />}

    {result && (
      <>
      <section className="space-y-4">
        <h2 className="mono-label text-white tracking-widest pl-2 border-l-2 border-primary">Pipeline_Outcome</h2>
        <div className="space-y-2">
          <GlassPanel className="p-4 flex items-start gap-4 border-l-4 border-l-primary/50">
            <div className="p-2 rounded-md bg-primary/20 text-primary"><RefreshCw size={18} /></div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1"><span className="mono-label text-white">Classify & Retrieve</span><span className="mono-code text-primary">DONE</span></div>
              <div className="flex justify-between items-center"><span className="text-xs text-zinc-500">Retrieval Confidence</span><span className="mono-code text-primary">{(result.confidence.retrieval_confidence * 100).toFixed(1)}%</span></div>
            </div>
          </GlassPanel>
          <GlassPanel className={`p-4 flex items-start gap-4 border-l-4 ${result.escalated ? 'border-l-crimson' : 'border-l-emerald'}`}>
            <div className={`p-2 rounded-md ${result.escalated ? 'bg-crimson/20 text-crimson' : 'bg-emerald/20 text-emerald'}`}><AlertTriangle size={18} /></div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1"><span className="mono-label text-white">Escalation Logic</span><span className={`mono-code ${result.escalated ? 'text-crimson' : 'text-emerald'}`}>{result.escalated ? 'ESCALATED' : 'RESOLVED'}</span></div>
              <div className="flex justify-between items-center"><span className="text-xs text-zinc-500 truncate pr-2">{result.escalation_reasons.join(', ') || 'No escalation'}</span><span className={`mono-code ${result.escalated ? 'text-crimson' : 'text-emerald'}`}>Risk: {(result.risk_score * 100).toFixed(0)}%</span></div>
            </div>
          </GlassPanel>
        </div>
      </section>

      <GlassPanel className={`p-5 border ${result.escalated ? 'border-crimson/30 bg-crimson/5' : 'border-emerald/30 bg-emerald/5'}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Activity size={16} className={result.escalated ? 'text-crimson' : 'text-emerald'} />
            <h3 className="mono-label text-white">Response Generation</h3>
          </div>
          <StatusBadge label={result.escalated ? "Forwarded" : "Resolved"} variant={result.escalated ? "error" : "emerald"} />
        </div>
        <p className="text-sm text-zinc-300 leading-relaxed italic border-l-2 border-white/10 pl-3">"{result.response_text}"</p>
      </GlassPanel>

      {result.gap_analysis?.gap_detected && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <GlassPanel className="p-4 border-l-2 border-l-amber bg-amber/5 space-y-3">
            <div className="flex justify-between items-center border-b border-amber/10 pb-2">
              <h2 className="mono-label text-amber flex items-center gap-2">
                <Lightbulb size={14} />
                Knowledge Gap Detected
              </h2>
              <button 
                onClick={() => {
                  const text = `Topic: ${result.gap_analysis!.missing_topic}\n\n${result.gap_analysis!.suggested_content}`;
                  navigator.clipboard.writeText(text).then(() => alert('Knowledge gap draft copied to clipboard! Paste it into your documentation system.'));
                }}
                className="text-[9px] mono-label text-amber border border-amber/30 px-2 py-1 rounded hover:bg-amber/10 transition-all active:scale-95 flex items-center gap-1">
                <FileText size={10} /> DRAFT DOCUMENTATION
              </button>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-white">Missing Topic: {result.gap_analysis.missing_topic}</span>
                <span className="mono-code text-[10px] text-amber">Impact: {(result.gap_analysis.impact_score * 100).toFixed(0)}%</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed italic bg-black/20 p-2 rounded border border-white/5">
                "Suggested Documentation: {result.gap_analysis.suggested_content}"
              </p>
            </div>
          </GlassPanel>
        </motion.div>
      )}
      </>
    )}
  </motion.div>
  );
};

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<RetrievalResult[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (query.length < 3) return;
    setLoading(true);
    try {
      const data = await searchRetrieval(query);
      setResults(data.results);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-6 pb-12"
  >
    <div className="relative group">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        <SearchIcon size={18} className="text-cyan opacity-70" />
      </div>
      <input 
        value={query}
        onChange={e => setQuery(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleSearch()}
        className="w-full bg-surface-low border border-white/10 rounded-lg py-4 pl-12 pr-12 mono-code focus:outline-none focus:border-cyan focus:ring-1 focus:ring-cyan transition-all placeholder:text-zinc-700" 
        placeholder="QUERY /api/v1/retrieval/search..." 
      />
      <div className="absolute inset-y-0 right-4 flex items-center">
        {loading ? <RefreshCw size={14} className="animate-spin text-cyan" /> : <span className="text-[10px] text-zinc-500 font-mono border border-white/5 px-1.5 py-0.5 rounded">ENTER</span>}
      </div>
    </div>

    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
      <button className="flex items-center gap-1.5 px-3 py-1.5 glass-panel rounded-full mono-label text-cyan border-cyan/30 whitespace-nowrap">
        <Filter size={12} />
        SOURCE: ALL
      </button>
      <button className="flex items-center gap-1.5 px-3 py-1.5 glass-panel rounded-full mono-label text-zinc-400 whitespace-nowrap">
        CONFIDENCE &gt; 0.85
      </button>
    </div>

    {results.length > 0 && (
      <GlassPanel className="p-5 space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <h3 className="mono-label text-zinc-500 mb-1">MAX_RELEVANCE_SCORE</h3>
            <div className="text-4xl font-bold text-emerald tracking-tighter">
              {Math.max(...results.map(r => r.score)).toFixed(3)}
            </div>
          </div>
          <div className="text-right">
            <span className="mono-label text-emerald/70 block">NOMINAL_STATE</span>
            <span className="text-xs text-slate-600">{results.length} nodes matched</span>
          </div>
        </div>
      </GlassPanel>
    )}

    <div className="flex items-center justify-between px-1">
      <h2 className="mono-label text-zinc-500">Retrieval Results ({results.length})</h2>
      <SortDesc size={16} className="text-zinc-500" />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {results.map((res, i) => (
      <GlassPanel key={i} className={`overflow-hidden border-l-2 ${res.score > 0.8 ? 'border-l-emerald' : 'border-l-cyan'}`}>
        <div className="bg-white/5 px-4 py-2 flex justify-between items-center">
          <span className="mono-label text-white text-xs truncate max-w-[200px]">{res.document_id}</span>
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${res.score > 0.8 ? 'bg-emerald' : 'bg-cyan'}`} />
            <span className={`mono-code ${res.score > 0.8 ? 'text-emerald' : 'text-cyan'}`}>{res.score.toFixed(3)}</span>
          </div>
        </div>
        <div className="p-4 space-y-3">
          <p className="text-sm text-zinc-300 leading-relaxed">"{res.chunk}"</p>
          <div className="flex justify-between items-center text-[10px] mono-label pt-2 border-t border-white/5">
            <span className="flex items-center gap-1"><FileText size={10} /> {res.source}</span>
          </div>
        </div>
      </GlassPanel>
    ))}
    </div>

    {results.length === 0 && !loading && (
      <div className="py-20 text-center space-y-3">
        <div className="w-12 h-12 rounded-full border border-zinc-800 flex items-center justify-center mx-auto opacity-20">
          <Database size={20} />
        </div>
        <p className="mono-label text-zinc-600 text-[10px]">VECTOR_STORE_EMPTY_OR_NO_MATCH</p>
      </div>
    )}
  </motion.div>
);
};

const SafetyAudit = ({ result }: { result: ProcessTicketResult | null }) => {

  if (!result) {
    return (
      <div className="py-20 text-center space-y-3">
        <Shield size={48} className="text-zinc-800 mx-auto opacity-20" />
        <p className="mono-label text-zinc-600">NO_ACTIVE_TRACE_SESSION</p>
        <p className="text-xs text-zinc-700">Process a ticket in the Processor tab to view safety audit details.</p>
      </div>
    );
  }

  return (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-6 pb-12"
  >
    <GlassPanel className="p-4 space-y-4">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p className="mono-label">Ticket ID</p>
          <h1 className="font-mono text-xl text-primary tracking-tighter">TK-{result.ticket_id}</h1>
        </div>
        <div className="flex flex-col items-end gap-2">
          <StatusBadge label={result.escalated ? "Critical_Escalation" : "Secure_Resolution"} variant={result.escalated ? "error" : "emerald"} />
        </div>
      </div>
    </GlassPanel>

    <GlassPanel className="p-4 space-y-6">
      <h2 className="mono-label text-zinc-400 flex items-center gap-2">
        <BarChart3 size={14} className="text-primary" />
        Confidence Decomposition
      </h2>
      <div className="space-y-5">
        {[
          { label: "Retrieval Context", value: result.confidence.retrieval_confidence.toFixed(2), progress: result.confidence.retrieval_confidence * 100, color: "bg-primary" },
          { label: "Safety Guardrails", value: result.confidence.safety_confidence.toFixed(2), progress: result.confidence.safety_confidence * 100, color: result.confidence.safety_confidence < 0.5 ? "bg-crimson" : "bg-emerald" },
          { label: "Final Grounding", value: result.confidence.final_confidence.toFixed(2), progress: result.confidence.final_confidence * 100, color: "bg-gradient-to-r from-primary to-amber", height: "h-2" },
        ].map((m, i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between items-end">
              <span className="mono-label text-[10px] lowercase">{m.label}</span>
              <span className={`mono-code ${m.progress < 50 ? 'text-crimson' : 'text-primary'}`}>{m.value}</span>
            </div>
            <ProgressBar progress={m.progress} color={m.color} height={m.height || "h-1"} />
          </div>
        ))}
      </div>
    </GlassPanel>

    <GlassPanel className="p-4 bg-gradient-to-br from-primary/5 to-transparent space-y-3">
      <h2 className="mono-label flex items-center gap-2">
        <Brain size={14} className="text-primary" />
        AI Reasoning Explanation
      </h2>
      <div className="space-y-3 prose prose-invert max-w-none">
        <p className="text-sm leading-relaxed text-zinc-300">
          {result.response_text}
        </p>
        <div className="bg-black/40 border-l-2 border-primary p-3 italic text-xs text-zinc-400">
          "Sentinel analyzed the payload for compliance violations. {result.escalation_reasons.length > 0 ? `Issues found: ${result.escalation_reasons.join(', ')}` : 'No critical safety violations detected.'}"
        </div>
      </div>
    </GlassPanel>

  </motion.div>
  );
};

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState(0);
  const [lastResult, setLastResult] = useState<ProcessTicketResult | null>(null);

  const tabs = [
    { label: "Dashboard", icon: BarChart3, screen: <Dashboard /> },
    { label: "Processor", icon: Route, screen: <Processor onResult={setLastResult} /> },
    { label: "Safety", icon: Shield, screen: <SafetyAudit result={lastResult} /> },
    { label: "Explorer", icon: SearchIcon, screen: <Search /> },
    { label: "Analytics", icon: TrendingUp, screen: <Dashboard /> },
  ];

  return (
    <div className="min-h-screen pb-24 max-w-6xl mx-auto overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl z-50 flex items-center justify-between px-6 h-16 bg-background/90 backdrop-blur-md border-b border-outline">
        <div className="flex items-center gap-3">
          <Shield className="text-primary" fill="currentColor" size={20} />
          <h1 className="text-white font-black tracking-widest border-l-2 border-primary pl-3 font-sans text-sm uppercase">SENTINEL_SUPPORT</h1>
        </div>
        <div className="flex items-center gap-4">
          <SlidersHorizontal className="text-zinc-500 cursor-pointer active:opacity-70 transition-colors hover:text-primary" size={18} />
        </div>
      </header>

      {/* Main Stage */}
      <main className="pt-20 px-4">
        <AnimatePresence mode="wait">
          <div key={activeTab}>
            {tabs[activeTab].screen}
          </div>
        </AnimatePresence>
      </main>

      {/* Navigation */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-16 bg-background/95 backdrop-blur-lg flex items-center justify-around border-t border-outline z-50">
        {tabs.map((tab, i) => (
          <button 
            key={i}
            onClick={() => setActiveTab(i)}
            className={`flex flex-col items-center justify-center gap-1 h-full px-2 transition-colors min-w-[72px] relative ${activeTab === i ? 'text-primary' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <div className={`transition-all ${activeTab === i ? 'scale-110' : ''}`}>
              <tab.icon size={20} className={activeTab === i ? 'fill-primary/10' : ''} />
            </div>
            <span className="mono-label text-[8px] uppercase tracking-wider">{tab.label}</span>
            {activeTab === i && (
              <motion.div 
                layoutId="nav-active"
                className="absolute top-0 h-0.5 bg-primary w-full max-w-[60px]"
              />
            )}
          </button>
        ))}
      </nav>

      {/* Contextual FAB for Explorer */}
      {activeTab === 3 && (
        <motion.button 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={() => {
            const input = document.querySelector<HTMLInputElement>('input[placeholder*="QUERY"]');
            if (input) input.focus();
          }}
          title="New Search Query"
          className="fixed bottom-20 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-transform z-40 border border-white/20"
        >
          <PlusCircle size={24} />
        </motion.button>
      )}
    </div>
  );
}
