/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
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
  UserCheck
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

const Dashboard = () => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-6"
  >
    {/* KPI Strip */}
    <section className="grid grid-cols-2 gap-3">
      {[
        { label: "Total Tickets", value: "1,248", icon: Ticket, active: true },
        { label: "Escalated", value: "42", icon: AlertTriangle, status: "error" },
        { label: "Avg Confidence", value: "0.94%", icon: Brain, status: "cyan" },
        { label: "Latency", value: "14ms", icon: Gauge, status: "amber" },
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
      {[
        { id: "#TK-89420", title: "Sentiment Divergence", desc: "Model confidence dropped below 0.65 threshold after user input sequence regarding sensitive compliance protocols.", tag: "Critical", variant: "error", time: "2M AGO", user: "OP_ALPHA" },
        { id: "#TK-89421", title: "Grounding Failure", desc: "Potential hallucination detected in retrieval-augmented generation path for region-specific fiscal policy.", tag: "Amber", variant: "amber", time: "5M AGO", user: "AUTO_BOT" },
        { id: "#TK-89422", title: "Safety Filter Trip", desc: "Input violated Level 4 safety containment protocols. Automatic session freeze initiated. Operator override required.", tag: "Critical", variant: "error", time: "8M AGO", user: "OP_SENTINEL_01" },
      ].map((tk, i) => (
        <GlassPanel key={i} className={`p-4 border-l-4 ${tk.variant === 'error' ? 'border-l-crimson' : 'border-l-amber'}`}>
          <div className="flex items-start justify-between mb-2">
            <div>
              <span className="mono-code text-xs text-zinc-500">{tk.id}</span>
              <h4 className="text-white font-bold mt-1">{tk.title}</h4>
            </div>
            <StatusBadge label={tk.tag} variant={tk.variant as any} />
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">{tk.desc}</p>
          <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
            <span className="mono-label text-[10px]">{tk.time} • {tk.user}</span>
            <button className="text-primary font-mono text-[10px] font-bold uppercase hover:underline">Intercept</button>
          </div>
        </GlassPanel>
      ))}
    </section>

    {/* Visualization Placeholder */}
    <div className="w-full h-40 rounded-lg overflow-hidden glass-panel relative">
      <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDYSKzOBJzsz6EdX8dYSEbCoTmB4mnh7woCryIvGx3dnYcKnk6P4yg8O_Q0NXFSv7dkF1EJvlZ4YQqqeQDIOWjoUgkbkSF5dvlHAHmNoxSbYj7vAbsLaMxfZWjFtkTTTWjqVFcJ8D07wteipx2PjtygYJVjXu2by3ILBBu_XIDJ9PIbAlIdD8h9Bi-tzSEH1zrHLtVDZ9TOwOH0rIP2GTaAs7S3wSjuLYhpS29GgFQ7APWrj3tZi7wqa1GqPb-ZncI6pxL1cjNYYij6" alt="System Monitor" className="w-full h-full object-cover opacity-40 grayscale hover:grayscale-0 transition-all duration-700" referrerPolicy="no-referrer" />
      <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      <div className="absolute bottom-4 left-4">
        <div className="mono-label text-white text-[10px]">Live Trace Visualization</div>
        <div className="text-[10px] text-primary font-mono uppercase mt-1">Node_Cluster_7 / ACTIVE</div>
      </div>
    </div>
  </motion.div>
);

const Processor = () => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-6"
  >
    <GlassPanel className="p-5 flex flex-col gap-4">
      <div className="flex items-center gap-2 mb-2">
        <Terminal size={14} className="text-primary" />
        <span className="mono-label text-white">Processor_Terminal v4.0</span>
      </div>
      <div className="space-y-1">
        <label className="mono-label text-[10px] ml-1">Ticket Subject</label>
        <input className="w-full bg-surface-low border border-outline rounded-md p-3 text-sm focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-zinc-600" placeholder="CRITICAL: API Latency Spike..." />
      </div>
      <div className="space-y-1">
        <label className="mono-label text-[10px] ml-1">Input Payload (Body)</label>
        <textarea className="w-full bg-surface-low border border-outline rounded-md p-3 text-sm focus:ring-1 focus:ring-primary focus:outline-none transition-all resize-none placeholder:text-zinc-600" rows={4} placeholder="Paste ticket logs or description..." />
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[
          { icon: Code, label: "HackerRank" },
          { icon: Bot, label: "Claude", active: true },
          { icon: CreditCard, label: "Visa" },
        ].map((tool, i) => (
          <button key={i} className={`p-2 rounded-md border flex flex-col items-center gap-1 transition-colors ${tool.active ? 'bg-primary/20 border-primary text-primary' : 'bg-surface-low border-outline text-zinc-400 hover:bg-white/5'}`}>
            <tool.icon size={16} />
            <span className="mono-label text-[9px]">{tool.label}</span>
          </button>
        ))}
      </div>
      <button className="w-full bg-primary py-4 rounded-md text-white font-bold uppercase tracking-widest active:scale-[0.98] transition-transform flex items-center justify-center gap-2">
        <RefreshCw size={18} className="animate-spin" />
        Process Trace
      </button>
    </GlassPanel>

    <section className="space-y-4">
      <h2 className="mono-label text-white tracking-widest pl-2 border-l-2 border-primary">Live_Decision_Pipeline</h2>
      <div className="space-y-2">
        {[
          { label: "Classify", detail: "Category: Technical Support", conf: "0.98 Conf", time: "12ms", icon: RefreshCw, variant: "primary" },
          { label: "Retrieve", detail: "8 Documents Matched", conf: "0.82 Rank", time: "245ms", icon: Database, variant: "primary" },
          { label: "Safety_Audit", detail: "PII Redaction Applied", conf: "Secure", time: "88ms", icon: ShieldCheck, variant: "amber" },
          { label: "Escalation_Logic", detail: "Threshold: High Priority", conf: "Tier 3", time: "PENDING", icon: AlertTriangle, variant: "error" },
        ].map((step, i) => (
          <GlassPanel key={i} className={`p-4 flex items-start gap-4 border-l-4 ${step.variant === 'primary' ? 'border-l-primary/50' : step.variant === 'amber' ? 'border-l-amber' : 'border-l-crimson'}`}>
            <div className={`p-2 rounded-md ${step.variant === 'primary' ? 'bg-primary/20 text-primary' : step.variant === 'amber' ? 'bg-amber/20 text-amber' : 'bg-crimson/20 text-crimson'}`}>
              <step.icon size={18} />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="mono-label text-white">{step.label}</span>
                <span className={`mono-code ${step.variant === 'primary' ? 'text-primary' : step.variant === 'amber' ? 'text-amber' : 'text-crimson'}`}>{step.time}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-zinc-500">{step.detail}</span>
                <span className={`mono-code ${step.variant === 'primary' ? 'text-primary' : step.variant === 'amber' ? 'text-amber' : 'text-crimson'}`}>{step.conf}</span>
              </div>
            </div>
          </GlassPanel>
        ))}
      </div>
    </section>

    <GlassPanel className="p-5 border border-primary/20 bg-gradient-to-br from-surface to-background">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-primary" />
          <h3 className="mono-label text-white">Grounding_Analytics</h3>
        </div>
        <StatusBadge label="Grounded" variant="emerald" />
      </div>
      <div className="space-y-4">
        {[
          { label: "Retrieval Confidence", value: "92.4%", progress: 92 },
          { label: "Safety Compliance", value: "100%", progress: 100 },
          { label: "Final Decision Score", value: "88.7%", progress: 88 },
        ].map((metric, i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between items-end">
              <span className="text-xs text-zinc-400">{metric.label}</span>
              <span className="mono-code text-white">{metric.value}</span>
            </div>
            <ProgressBar progress={metric.progress} color="bg-gradient-to-r from-primary to-cyan" />
          </div>
        ))}
      </div>
    </GlassPanel>
  </motion.div>
);

const Search = () => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-6 pb-12"
  >
    <div className="relative group">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        <SearchIcon size={18} className="text-cyan opacity-70" />
      </div>
      <input className="w-full bg-surface-low border border-white/10 rounded-lg py-4 pl-12 pr-12 mono-code focus:outline-none focus:border-cyan focus:ring-1 focus:ring-cyan transition-all placeholder:text-zinc-700" placeholder="QUERY /api/v1/retrieval/search..." />
      <div className="absolute inset-y-0 right-4 flex items-center">
        <span className="text-[10px] text-zinc-500 font-mono border border-white/5 px-1.5 py-0.5 rounded">CMD+K</span>
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
      <button className="flex items-center gap-1.5 px-3 py-1.5 glass-panel rounded-full mono-label text-zinc-400 whitespace-nowrap">
        DOC_TYPE: JSON
      </button>
    </div>

    <GlassPanel className="p-5 space-y-4">
      <div className="flex justify-between items-end">
        <div>
          <h3 className="mono-label text-zinc-500 mb-1">GROUNDING_QUALITY_SCORE</h3>
          <div className="text-4xl font-bold text-emerald tracking-tighter">0.924</div>
        </div>
        <div className="text-right">
          <span className="mono-label text-emerald/70 block">NOMINAL_STATE</span>
          <span className="text-xs text-slate-600">2,401 nodes queried</span>
        </div>
      </div>
      <div className="space-y-1.5">
        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden flex">
          <div className="h-full bg-emerald w-[65%]" title="High Confidence" />
          <div className="h-full bg-cyan w-[20%]" title="Medium Confidence" />
          <div className="h-full bg-amber w-[10%]" title="Low Confidence" />
          <div className="h-full bg-crimson w-[5%]" title="Uncertain" />
        </div>
        <div className="flex justify-between text-[8px] mono-label text-zinc-700">
          <span>0.00</span>
          <span>0.50</span>
          <span>0.75 GROUNDING_THRESHOLD</span>
          <span>1.00</span>
        </div>
      </div>
    </GlassPanel>

    <div className="flex items-center justify-between px-1">
      <h2 className="mono-label text-zinc-500">Retrieval Results (12)</h2>
      <SortDesc size={16} className="text-zinc-500" />
    </div>

    {[
      { id: "DOC_8829_SEC_ALPHA", score: "0.982", variant: "emerald", desc: "The primary failover sequence for Sentinel nodes requires a dual-handshake protocol with grounding thresholds exceeding 0.95. Any variance in trace-logs must be reported to the Lead Architect immediately.", source: "KNOWLEDGE_BASE_V4", time: "12ms" },
      { id: "SYS_LOG_ENTRY_772", score: "0.841", variant: "cyan", desc: "Partial match found in archival logs: Escalation protocols for safety violations. Trace: pipeline-v2 -> safety-check-failed -> operator-notified.", source: "ARCHIVE_SYSTEM", time: "45ms", italic: true },
    ].map((res, i) => (
      <GlassPanel key={i} className={`overflow-hidden border-l-2 ${res.variant === 'emerald' ? 'border-l-emerald' : 'border-l-cyan'}`}>
        <div className="bg-white/5 px-4 py-2 flex justify-between items-center">
          <span className="mono-label text-white">{res.id}</span>
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${res.variant === 'emerald' ? 'bg-emerald' : 'bg-cyan'}`} />
            <span className={`mono-code ${res.variant === 'emerald' ? 'text-emerald' : 'text-cyan'}`}>{res.score}</span>
          </div>
        </div>
        <div className="p-4 space-y-3">
          <p className={`text-sm text-zinc-300 leading-relaxed ${res.italic ? 'italic' : ''}`}>"{res.desc}"</p>
          <div className="flex justify-between items-center text-[10px] mono-label pt-2 border-t border-white/5">
            <span className="flex items-center gap-1"><FileText size={10} /> {res.source}</span>
            <span className="flex items-center gap-1"><Clock size={10} /> {res.time}</span>
          </div>
        </div>
      </GlassPanel>
    ))}

    <div className="glass-panel overflow-hidden border-l-2 border-l-zinc-800">
      <div className="h-32 w-full relative">
        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1i8uC1i8uFxMqK2-091RqCbqMsgcN2zvTyrR4pB59wO37lihZyJnTre7fPJqSIwmO7RfYdbWo7DaJa6Rm0Rz5XyvX10ls3bcZNGUY_HaA1zBRofn6o3DCvBkK3k2PIvMBk1ab71q7DasboVQheoNbBg0yyQPWaoZwEVJuKpgXwzMer2waIsp7Rg2W8DgkglNekDnI6676OOEaU-i8rxZ8rmmRSD6-v--gLH5ZO8_HdmSnIWT5qP4zfG3jhr2cBb1o06DUBJDqfBhKAAJdn" alt="Diagram" className="w-full h-full object-cover opacity-30 mix-blend-screen" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent" />
        <div className="absolute bottom-2 left-4">
          <span className="bg-primary/80 text-white px-2 py-0.5 rounded text-[9px] mono-label uppercase">Schema_Visual_01</span>
        </div>
      </div>
      <div className="p-4 flex justify-between items-center">
        <span className="text-sm text-zinc-300">Grounding Matrix Map</span>
        <span className="mono-code text-emerald">0.915</span>
      </div>
    </div>
  </motion.div>
);

const SafetyAudit = () => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-6 pb-12"
  >
    <GlassPanel className="p-4 space-y-4">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p className="mono-label">Ticket ID</p>
          <h1 className="font-mono text-xl text-primary tracking-tighter">TRX-7702-ALPHA</h1>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2 bg-white/5 px-2 py-1 rounded">
            <span className="mono-label text-[9px]">REDACTED</span>
            <div className="w-8 h-4 bg-primary rounded-full relative flex items-center px-0.5 cursor-pointer">
              <div className="w-3 h-3 bg-white rounded-full ml-auto" />
            </div>
          </div>
          <StatusBadge label="Critical_Escalation" variant="error" />
        </div>
      </div>
      <div className="pt-2 border-t border-white/5">
        <p className="mono-label">Subject</p>
        <p className="text-xl font-bold text-white mt-1 leading-tight tracking-tight">Anomalous Policy Override Attempt in Core Financial Sector</p>
      </div>
    </GlassPanel>

    <GlassPanel className="p-4 space-y-6">
      <h2 className="mono-label text-zinc-400 flex items-center gap-2">
        <BarChart3 size={14} className="text-primary" />
        Confidence Decomposition
      </h2>
      <div className="space-y-5">
        {[
          { label: "Retrieval Context", value: "0.94", progress: 94, color: "bg-primary" },
          { label: "Safety Guardrails", value: "0.12", progress: 12, color: "bg-crimson shadow-[0_0_8px_rgba(239,68,68,0.5)]" },
          { label: "Final Grounding", value: "0.45", progress: 45, color: "bg-gradient-to-r from-primary to-amber", height: "h-2" },
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
        Human-Readable Logic
      </h2>
      <div className="space-y-3 prose prose-invert max-w-none">
        <p className="text-sm leading-relaxed">
          The agent identified a <span className="text-amber font-semibold border-b border-amber/30">Semantic Divergence</span> between the user's requested transaction and established safety policy #442-B. 
        </p>
        <div className="bg-black/40 border-l-2 border-primary p-3 italic text-xs text-zinc-400">
          "System flags the request as a 'Social Engineering' pattern. Confidence in autonomous resolution dropped below 0.80 threshold due to contradictory retrieval docs."
        </div>
        <p className="text-xs text-primary flex items-center gap-2">
          <Info size={12} />
          Manual intervention required to validate user identity.
        </p>
      </div>
    </GlassPanel>

    <section className="space-y-4">
      <h2 className="mono-label px-1">Deep Trace Log: /api/v1/traces</h2>
      <div className="relative pl-6 space-y-8">
        <div className="absolute left-[11px] top-2 bottom-2 w-[1px] bg-gradient-to-bottom from-primary/50 to-transparent" />
        
        {[
          { time: "14:02:11.402", type: "REQUEST_INIT", content: <div className="bg-surface-low border border-white/5 p-3 rounded mono-code text-[11px]"><span className="text-primary">GET</span> /api/v1/user/auth_context<br/><span className="text-zinc-500">// CID: 99a-f42-x01</span></div>, color: "bg-primary" },
          { time: "14:02:11.890", type: "AI_REASONING", content: <div className="bg-surface-low border border-white/5 p-3 rounded space-y-2"><p className="mono-code text-[11px]">Evaluating safety context for "Policy Override"...</p><div className="grid grid-cols-2 gap-2"><div className="bg-black/30 p-2 rounded border border-white/5"><p className="text-[9px] mono-label mb-0.5">Input Token</p><p className="mono-code text-[10px] text-primary">"Urgent: Skip 2FA"</p></div><div className="bg-black/30 p-2 rounded border border-white/5"><p className="text-[9px] mono-label mb-0.5">Risk Score</p><p className="mono-code text-[10px] text-crimson">0.88 (HIGH)</p></div></div></div>, color: "bg-amber" },
          { time: "14:02:12.110", type: "ESCALATION_TRIGGERED", content: <div className="bg-crimson/5 border border-crimson/20 p-3 rounded mono-code text-[11px] text-crimson">HALT: Probability of malicious intent exceeds safety threshold (0.40).<br/>ROUTING TO: OP_SENTINEL_01</div>, color: "bg-crimson" },
        ].map((node, i) => (
          <div key={i} className="relative">
            <div className={`absolute -left-[19px] top-1.5 w-3 h-3 rounded-full ${node.color} border-4 border-background`} />
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="mono-label text-[9px] text-zinc-500">{node.time}</span>
                <span className={`px-1.5 py-0.5 rounded text-[8px] mono-label ${node.color === 'bg-primary' ? 'bg-primary/10 text-primary' : node.color === 'bg-amber' ? 'bg-amber/10 text-amber' : 'bg-crimson/10 text-crimson'}`}>{node.type}</span>
              </div>
              {node.content}
            </div>
          </div>
        ))}
      </div>
    </section>

    <GlassPanel className="overflow-hidden">
      <div className="p-3 bg-white/5 border-b border-white/5 flex justify-between items-center">
        <span className="mono-label">Contextual Map</span>
        <Maximize2 size={12} className="text-zinc-500" />
      </div>
      <div className="aspect-video relative bg-surface-low flex items-center justify-center p-2">
        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRnWgTdPyOZDN9gHT4q-IoEBScHEY2bFJmvwuMki1EyCUfTUf7fpNbrE4kocm5_55qVbXOmn0Wzbm2-QeRIblOgMNH6Umzf_b31miO2s2Utnlbtkr83FJLZWgdKxSBVKfES2n4RB-Tbqg-H93_L-j1AUQ6lAlzKqvnd_vvSiqaiZj3lVVkz4S09s2iX5X8f5JuUe9qTTfC34eU8NJSHJMjuLdnUF5KAOfVaBx7WI8taAF3Ceil3IWPs6Voclb0TjHHzvNusGmiwZcy" className="w-full h-full object-cover opacity-40 mix-blend-screen"  referrerPolicy="no-referrer" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
          <div className="w-10 h-10 rounded-full border border-primary/50 flex items-center justify-center animate-pulse">
            <SearchIcon size={16} className="text-primary" />
          </div>
          <span className="mono-label text-[9px] bg-black/60 px-2 py-1 rounded">Mapping Anomaly...</span>
        </div>
      </div>
    </GlassPanel>
  </motion.div>
);

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { label: "Dashboard", icon: BarChart3, screen: <Dashboard /> },
    { label: "Processor", icon: Route, screen: <Processor /> },
    { label: "Safety", icon: Shield, screen: <SafetyAudit /> },
    { label: "Explorer", icon: SearchIcon, screen: <Search /> },
    { label: "Analytics", icon: TrendingUp, screen: <Dashboard /> },
  ];

  return (
    <div className="min-h-screen pb-24 max-w-lg mx-auto overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 w-full max-w-lg z-50 flex items-center justify-between px-6 h-16 bg-background/90 backdrop-blur-md border-b border-outline">
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
      <nav className="fixed bottom-0 w-full max-w-lg h-16 bg-background/95 backdrop-blur-lg flex items-center justify-around border-t border-outline z-50">
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
          className="fixed bottom-20 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-transform z-40 border border-white/20"
        >
          <PlusCircle size={24} />
        </motion.button>
      )}
    </div>
  );
}
