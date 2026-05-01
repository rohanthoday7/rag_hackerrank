/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  ShieldCheck, 
  Radio, 
  History, 
  AlertTriangle, 
  Scale, 
  Eye, 
  LayoutDashboard, 
  Ticket, 
  Bot, 
  Lock,
  ArrowRight,
  Wifi,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Components ---

const TopAppBar = () => (
  <header className="flex justify-between items-center px-8 h-20 w-full z-50 fixed top-0 bg-surface/60 backdrop-blur-xl border-b border-outline">
    <div className="flex items-center gap-4">
      <div className="w-8 h-8 flex items-center justify-center bg-on-surface text-surface rounded-sm">
        <Bot size={20} strokeWidth={2.5} />
      </div>
      <h1 className="text-sm font-bold tracking-[0.3em] uppercase text-on-surface">Sentinel<span className="text-accent">Support</span></h1>
    </div>
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-2 group cursor-pointer">
        <div className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-[0_0_8px_rgba(129,140,248,0.5)]"></div>
        <span className="text-[10px] font-bold text-accent tracking-widest uppercase opacity-80 group-hover:opacity-100 transition-opacity">Agent Status: Active</span>
      </div>
      <div className="h-9 w-9 rounded-full border border-outline bg-surface-container overflow-hidden cursor-pointer hover:border-accent transition-all p-[2px]">
        <img 
          className="w-full h-full rounded-full object-cover grayscale brightness-90 hover:grayscale-0 transition-all" 
          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=128&auto=format&fit=crop" 
          alt="User Profile"
          referrerPolicy="no-referrer"
        />
      </div>
    </div>
  </header>
);

const StatsSection = () => (
  <section className="mb-12 pt-32 px-8 max-w-7xl mx-auto">
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "circOut" }}
      >
        <p className="text-[10px] font-bold text-accent tracking-[0.4em] uppercase mb-2">Automated Operations / L3</p>
        <h2 className="text-4xl font-extrabold tracking-tight text-on-surface">Escalations & RAG</h2>
      </motion.div>
      <div className="flex gap-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="px-6 py-3 bg-surface-container border border-outline rounded-sm flex items-center gap-3"
        >
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-error tracking-widest uppercase">Pending Escalation</span>
            <span className="text-xl font-mono font-bold leading-none">08</span>
          </div>
          <AlertTriangle className="text-error opacity-50" size={24} />
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="px-6 py-3 bg-surface-container border border-outline rounded-sm flex items-center gap-3"
        >
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-on-surface-variant tracking-widest uppercase">Avg. Confidence</span>
            <span className="text-xl font-mono font-bold leading-none">94%</span>
          </div>
          <Users className="text-accent opacity-50" size={24} />
        </motion.div>
      </div>
    </div>
  </section>
);

const PipelineStep = ({ label, active, completed }: any) => (
  <div className="flex flex-col items-center gap-2 flex-1 relative">
    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center z-10 transition-colors ${
      completed ? 'bg-accent border-accent text-surface' : 
      active ? 'bg-surface border-accent text-accent animate-pulse' : 
      'bg-surface border-outline text-outline'
    }`}>
      {completed ? <ShieldCheck size={16} /> : <Bot size={16} />}
    </div>
    <span className={`text-[8px] font-black uppercase tracking-tighter text-center ${active ? 'text-on-surface' : 'text-outline/60'}`}>{label}</span>
    <div className={`absolute top-4 left-[50%] w-full h-[2px] transition-colors -z-0 ${completed ? 'bg-accent' : 'bg-outline/20'}`} style={{ transform: 'scaleX(1.2)' }}></div>
  </div>
);

const TicketItem = ({ id, platform, issue, risk, confidence, description }: any) => (
  <motion.div 
    layout
    className="p-8 hover:bg-surface-container/50 transition-all border-b border-outline relative group cursor-pointer"
  >
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center gap-6">
        <div className={`w-12 h-12 rounded-sm border border-outline bg-surface-container flex items-center justify-center transition-transform group-hover:scale-105`}>
          <Ticket className={risk === 'HIGH' ? 'text-error' : 'text-accent'} size={22} strokeWidth={1.5} />
        </div>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${risk === 'HIGH' ? 'text-error' : 'text-accent'}`}>{id}</span>
            <span className="w-1 h-1 rounded-full bg-outline"></span>
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{platform}</span>
          </div>
          <p className="text-xl font-bold text-on-surface leading-none">{issue}</p>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <span className={`text-[10px] font-black px-2 py-1 rounded-sm border mb-2 ${risk === 'HIGH' ? 'border-error text-error bg-error/5' : 'border-accent text-accent bg-accent/5'}`}>{risk} RISK</span>
        <span className="text-[10px] font-bold text-on-surface-variant">Conf. {confidence}%</span>
      </div>
    </div>
    <div className="pl-18">
      <p className="text-[13px] text-on-surface-variant leading-relaxed mb-6 max-w-xl font-medium">{description}</p>
      <div className="flex gap-4">
        <button className="text-[11px] font-black tracking-widest text-on-surface uppercase border-b-2 border-accent pb-1 hover:border-on-surface transition-all">
          Approve Escalation
        </button>
        <button className="text-[11px] font-black tracking-widest text-on-surface-variant uppercase pb-1 hover:text-on-surface transition-all">
          Request More Context
        </button>
      </div>
    </div>
  </motion.div>
);

const Container = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    className="h-full"
  >
    {children}
  </motion.div>
);

import { askRAG, classifyTicket } from './services/geminiService';

export default function App() {
  const [activeTab, setActiveTab] = React.useState('Dash');
  const [chatInput, setChatInput] = React.useState('');
  const [chatMessages, setChatMessages] = React.useState<any[]>([]);
  const [isTyping, setIsTyping] = React.useState(false);
  const [simulatingTicket, setSimulatingTicket] = React.useState(false);
  const [pipelineState, setPipelineState] = React.useState({
    classifier: 'pending',
    retrieval: 'pending',
    safety: 'pending',
    decision: 'pending',
    response: 'pending'
  });

  const handleSendRAG = async () => {
    if (!chatInput.trim()) return;
    
    const userMsg = { role: 'user', content: chatInput };
    setChatMessages([...chatMessages, userMsg]);
    setChatInput('');
    setIsTyping(true);

    try {
      // Sample mock context for RAG
      const mockContext = [
        "Unauthorized disbursement policy: All disbursements over $2000 require L3 approval if originating from non-home IP.",
        "Visa Fraud Procedure: Suspicious login attempts followed by high value transfers should be flagged for manual review.",
        "Account Takeover Indicators: Pattern of password resets followed by immediate PII changes or withdrawal requests."
      ];
      
      const result = await askRAG(chatInput, mockContext);
      setChatMessages(prev => [...prev, { role: 'ai', content: result }]);
    } catch (err) {
      setChatMessages(prev => [...prev, { role: 'error', content: "Failed to retrieve information." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const runSimulation = async () => {
    setSimulatingTicket(true);
    setPipelineState({ classifier: 'active', retrieval: 'pending', safety: 'pending', decision: 'pending', response: 'pending' });
    
    await new Promise(r => setTimeout(r, 1000));
    setPipelineState(prev => ({ ...prev, classifier: 'completed', retrieval: 'active' }));
    
    await new Promise(r => setTimeout(r, 1500));
    setPipelineState(prev => ({ ...prev, retrieval: 'completed', safety: 'active' }));
    
    await new Promise(r => setTimeout(r, 1200));
    setPipelineState(prev => ({ ...prev, safety: 'completed', decision: 'active' }));
    
    await new Promise(r => setTimeout(r, 1000));
    setPipelineState(prev => ({ ...prev, decision: 'completed', response: 'active' }));
    
    await new Promise(r => setTimeout(r, 800));
    setPipelineState(prev => ({ ...prev, response: 'completed' }));
    setSimulatingTicket(false);
  };

  return (
    <div className="min-h-screen selection:bg-accent/30">
      <TopAppBar />
      
      <main className="pb-40 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'Dash' && (
            <motion.div
              key="dash"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4 }}
            >
              <StatsSection />
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 px-8">
                <div className="md:col-span-8 space-y-8">
                  <Container delay={0.1}>
                    <div className="bg-surface-container/30 border border-outline rounded-sm overflow-hidden backdrop-blur-sm shadow-xl">
                      <div className="px-8 py-5 border-b border-outline flex justify-between items-center bg-surface-container/50">
                        <h3 className="text-[11px] font-black text-on-surface uppercase tracking-[0.3em]">Live Support Queue</h3>
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping"></span>
                          <span className="text-[9px] font-bold text-accent tracking-[0.2em] uppercase">AI Scanning</span>
                        </div>
                      </div>
                      <div className="divide-y divide-outline">
                        <TicketItem id="TKT-1842" platform="Visa/Stripe" issue="Unauthorized Disbursement" risk="HIGH" confidence="96" description="User reporting multiple failed login attempts followed by a $2,400 disbursement request. AI flagged as potential takeover." />
                        <TicketItem id="TKT-1849" platform="Enterprise Plan" issue="Billing Discrepancy Escalation" risk="MED" confidence="88" description="Account manager requests rapid review of seat overages on invoice #AF-99. RAG retrieved conflicting discount tier docs." />
                      </div>
                    </div>
                  </Container>
                  <Container delay={0.2}>
                    <div className="bg-surface-container/30 border border-outline rounded-sm p-8 shadow-lg">
                      <div className="flex justify-between items-center mb-10">
                        <div className="flex flex-col">
                          <h3 className="text-[11px] font-black text-on-surface uppercase tracking-[0.3em] mb-1">AI Decision Pipeline</h3>
                          <span className={`text-[8px] font-bold tracking-widest uppercase ${simulatingTicket ? 'text-accent animate-pulse' : 'text-on-surface-variant'}`}>
                            {simulatingTicket ? 'Processing Active Stream...' : 'Pipeline Latent'}
                          </span>
                        </div>
                        <button 
                          onClick={runSimulation}
                          disabled={simulatingTicket}
                          className="px-4 py-1.5 border border-accent bg-accent/10 text-accent text-[9px] font-black uppercase tracking-widest hover:bg-accent hover:text-surface transition-all disabled:opacity-50"
                        >
                          {simulatingTicket ? 'Simulating...' : 'Test Pipeline'}
                        </button>
                      </div>
                      <div className="flex justify-between items-center px-4 max-w-3xl mx-auto">
                        <PipelineStep label="Classifier" completed={pipelineState.classifier === 'completed'} active={pipelineState.classifier === 'active'} />
                        <PipelineStep label="Retrieval" completed={pipelineState.retrieval === 'completed'} active={pipelineState.retrieval === 'active'} />
                        <PipelineStep label="Safety" completed={pipelineState.safety === 'completed'} active={pipelineState.safety === 'active'} />
                        <PipelineStep label="Decision" completed={pipelineState.decision === 'completed'} active={pipelineState.decision === 'active'} />
                        <PipelineStep label="Response" completed={pipelineState.response === 'completed'} active={pipelineState.response === 'active'} />
                      </div>
                    </div>
                  </Container>
                </div>
                <div className="md:col-span-4 space-y-8">
                  <Container delay={0.3}>
                    <div className="bg-surface-container/30 border border-outline rounded-sm p-8 shadow-md">
                      <h3 className="text-[11px] font-black text-on-surface uppercase tracking-[0.3em] mb-8">AI Validation Metrics</h3>
                      <div className="space-y-8">
                        <div>
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Retrieval Confidence</span>
                            <span className="text-xs font-mono font-bold text-accent">92%</span>
                          </div>
                          <div className="h-1 bg-outline/30 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: '92%' }} className="bg-accent h-full shadow-[0_0_8px_rgba(129,140,248,0.4)]" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 border border-outline bg-surface/50">
                            <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Hallucination Risk</p>
                            <p className="text-lg font-mono font-bold text-success">LOW</p>
                          </div>
                          <div className="p-4 border border-outline bg-surface/50">
                            <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Safety Guard</p>
                            <p className="text-lg font-mono font-bold text-success">PASSED</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Container>
                  <Container delay={0.4}>
                    <div className="bg-surface-container/30 border border-outline rounded-sm p-8 shadow-md">
                      <h3 className="text-[11px] font-black text-on-surface uppercase tracking-[0.3em] mb-6">Categorization Stats</h3>
                      <div className="space-y-4">
                        {[{ id: 'Billing', risk: 'HIGH', count: '14' }, { id: 'Access', risk: 'MED', count: '42' }, { id: 'Fraud', risk: 'LOW', count: '08' }].map((item) => (
                          <div key={item.id} className="flex items-center justify-between py-3 border-b border-outline/50 last:border-0 hover:translate-x-1 transition-transform cursor-pointer group">
                             <span className="text-xs font-bold text-on-surface-variant group-hover:text-on-surface transition-colors">{item.id} Escalation</span>
                            <span className="text-lg font-mono font-bold group-hover:text-accent transition-colors">{item.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Container>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'Team' && (
            <motion.div
              key="team"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="px-8 pt-32"
            >
              <div className="mb-12">
                <p className="text-[10px] font-bold text-accent tracking-[0.4em] uppercase mb-2">Human Resources / Squad-9</p>
                <h2 className="text-4xl font-extrabold tracking-tight text-on-surface">Agent Performance</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 bg-surface-container/30 border border-outline rounded-sm overflow-hidden shadow-xl">
                  <div className="px-8 py-5 border-b border-outline bg-surface-container/50 flex justify-between items-center">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.3em]">Active Slayers</h3>
                    <span className="text-[9px] font-bold text-accent tracking-widest animate-pulse">12 ONLINE</span>
                  </div>
                  <div className="divide-y divide-outline">
                    {[
                      { name: 'Marcus R.', status: 'Active', workload: 8, csat: '4.9', avatar: 'https://i.pravatar.cc/150?u=marcus' },
                      { name: 'Sarah L.', status: 'Away', workload: 0, csat: '4.8', avatar: 'https://i.pravatar.cc/150?u=sarah' },
                      { name: 'David K.', status: 'Active', workload: 12, csat: '4.7', avatar: 'https://i.pravatar.cc/150?u=david' },
                      { name: 'Elena W.', status: 'Active', workload: 5, csat: '5.0', avatar: 'https://i.pravatar.cc/150?u=elena' }
                    ].map((agent) => (
                      <div key={agent.name} className="p-6 flex items-center justify-between hover:bg-surface-container/50 transition-all cursor-pointer group">
                        <div className="flex items-center gap-4">
                          <img src={agent.avatar} className="w-12 h-12 rounded-full border border-outline p-0.5 grayscale group-hover:grayscale-0 transition-all" alt={agent.name} />
                          <div>
                            <p className="text-sm font-bold group-hover:text-accent transition-colors">{agent.name}</p>
                            <div className="flex items-center gap-2">
                              <span className={`w-1.5 h-1.5 rounded-full ${agent.status === 'Active' ? 'bg-success shadow-[0_0_8px_rgba(52,211,153,0.6)]' : 'bg-outline'}`}></span>
                              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{agent.status}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-12 text-right">
                          <div className="min-w-16"><p className="text-[9px] font-bold text-outline uppercase tracking-widest mb-1">Active</p><p className="text-sm font-mono font-bold">{agent.workload}</p></div>
                          <div className="min-w-16"><p className="text-[9px] font-bold text-outline uppercase tracking-widest mb-1">CSAT</p><p className="text-sm font-mono font-bold text-accent">{agent.csat}</p></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-8">
                   <div className="bg-surface-container/30 border border-outline rounded-sm p-8 shadow-lg">
                      <h3 className="text-[11px] font-black uppercase tracking-[0.3em] mb-8">Team Health</h3>
                      <div className="space-y-6">
                        <div className="p-5 border border-outline bg-surface/50 rounded-sm">
                          <p className="text-[9px] font-bold text-on-surface-variant mb-2 uppercase tracking-widest">Avg Response Time</p>
                          <p className="text-3xl font-mono font-bold text-accent">14m 20s</p>
                        </div>
                        <div className="p-5 border border-outline bg-surface/50 rounded-sm">
                           <p className="text-[9px] font-bold text-on-surface-variant mb-2 uppercase tracking-widest">Resolution Rate</p>
                           <p className="text-3xl font-mono font-bold">92.4%</p>
                        </div>
                      </div>
                   </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'AI' && (
            <motion.div
              key="ai"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="px-8 pt-32"
            >
               <div className="mb-12">
                <p className="text-[10px] font-bold text-accent tracking-[0.4em] uppercase mb-2">Model Health / Sentinel-V2</p>
                <h2 className="text-4xl font-extrabold tracking-tight text-on-surface">RAG Pipeline Analysis</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="bg-surface-container/30 border border-outline rounded-sm p-8 shadow-xl flex flex-col h-[500px]">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.3em] mb-6">Interactive RAG Sandbox</h3>
                    
                    <div className="flex-1 overflow-y-auto mb-6 space-y-4 pr-2 custom-scrollbar">
                       {chatMessages.length === 0 && (
                         <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-40">
                           <Bot size={48} className="mb-4" />
                           <p className="text-[10px] uppercase tracking-widest font-bold">Awaiting Input Query</p>
                           <p className="text-xs mt-2">Test the AI's ability to retrieve information from support documentation.</p>
                         </div>
                       )}
                       {chatMessages.map((msg, i) => (
                         <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                           <div className={`max-w-[85%] p-4 rounded-sm text-sm ${
                             msg.role === 'user' ? 'bg-accent/10 border border-accent/20 text-on-surface' : 
                             msg.role === 'error' ? 'bg-error/10 border border-error/20 text-error' :
                             'bg-surface-container/50 border border-outline text-on-surface-variant'
                           }`}>
                             {msg.content}
                           </div>
                         </div>
                       ))}
                       {isTyping && (
                         <div className="flex justify-start">
                           <div className="bg-surface-container/50 border border-outline p-4 rounded-sm">
                             <div className="flex gap-1">
                               <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce"></div>
                               <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce [animation-delay:0.2s]"></div>
                               <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce [animation-delay:0.4s]"></div>
                             </div>
                           </div>
                         </div>
                       )}
                    </div>

                    <div className="flex gap-3">
                       <input 
                         type="text" 
                         value={chatInput}
                         onChange={(e) => setChatInput(e.target.value)}
                         onKeyDown={(e) => e.key === 'Enter' && handleSendRAG()}
                         placeholder="Ask about support policies..."
                         className="flex-1 bg-surface border border-outline rounded-sm px-4 py-2 text-sm focus:border-accent outline-none transition-colors"
                       />
                       <button 
                         onClick={handleSendRAG}
                         disabled={isTyping || !chatInput.trim()}
                         className="px-6 py-2 bg-on-surface text-surface rounded-sm text-xs font-black uppercase tracking-widest hover:bg-accent transition-colors disabled:opacity-50"
                       >
                         Send
                       </button>
                    </div>
                 </div>
                 
                 <div className="bg-surface-container/30 border border-outline rounded-sm p-8 shadow-xl">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.3em] mb-8">Retrieval Performance</h3>
                    <div className="space-y-4">
                       <div className="p-4 border border-outline bg-surface/30">
                          <p className="text-[10px] font-bold text-accent uppercase tracking-[0.4em] mb-2">Confidence Trace</p>
                          <div className="h-24 flex items-end gap-1 px-2">
                             {[30, 45, 35, 60, 80, 75, 92, 88, 95].map((v, i) => (
                               <div key={i} className="flex-1 bg-accent/20 border-t border-accent" style={{ height: `${v}%` }}></div>
                             ))}
                          </div>
                       </div>

                       {[
                         { id: 'CHUNK-77', score: '0.94', text: 'Stripe disbursement processing timeframes for cross-border...' },
                         { id: 'CHUNK-82', score: '0.88', text: 'Unauthorized disbursement manual override procedures Section...' },
                         { id: 'CHUNK-21', score: '0.74', text: 'Fraud detection localized botnet segment definitions...' }
                       ].map((chunk) => (
                         <div key={chunk.id} className="p-4 bg-surface/40 border border-outline hover:border-accent transition-all cursor-pointer group rounded-sm">
                           <div className="flex justify-between mb-3 border-b border-outline/10 pb-2">
                             <span className="text-[9px] font-black text-accent uppercase tracking-widest">{chunk.id}</span>
                             <div className="flex items-center gap-2">
                                <div className="w-12 h-1 bg-outline/20 rounded-full overflow-hidden">
                                  <div className="h-full bg-accent" style={{ width: `${parseFloat(chunk.score) * 100}%` }}></div>
                                </div>
                                <span className="text-[10px] font-bold text-on-surface-variant font-mono">{chunk.score}</span>
                             </div>
                           </div>
                           <p className="text-[11px] italic text-on-surface-variant leading-relaxed font-medium group-hover:text-on-surface transition-colors">"{chunk.text}"</p>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'Security' && (
            <motion.div
              key="security"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="px-8 pt-32"
            >
               <div className="mb-12">
                <p className="text-[10px] font-bold text-accent tracking-[0.4em] uppercase mb-2">Internal Audit / Zero Trust</p>
                <h2 className="text-4xl font-extrabold tracking-tight text-on-surface">Safety Validation</h2>
              </div>
              <div className="bg-surface-container/30 border border-outline rounded-sm p-10 max-w-4xl shadow-2xl backdrop-blur-sm">
                 <div className="flex justify-between items-center mb-10">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.3em]">PII Redaction Engine</h3>
                    <div className="flex items-center gap-2 px-3 py-1 bg-success/10 border border-success/30 rounded-full">
                       <ShieldCheck size={12} className="text-success" />
                       <span className="text-[9px] font-bold text-success uppercase tracking-widest tracking-tighter">Compliant</span>
                    </div>
                 </div>
                 <div className="space-y-3 font-mono text-[11px]">
                    {[
                      { time: '12:44:02', action: 'BLOCK', field: 'SSN (Masked)', origin: 'TKT-1842' },
                      { time: '12:44:08', action: 'STRIP', field: 'Credit Card', origin: 'API Response' },
                      { time: '12:45:12', action: 'ALERT', field: 'Email Pattern', origin: 'TKT-1849' },
                      { time: '12:46:55', action: 'PASS', field: 'Public Domain', origin: 'KB Search' }
                    ].map((log, i) => (
                      <div key={i} className="flex gap-10 py-3 border-b border-outline/10 group items-center">
                        <span className="text-outline-variant w-16">{log.time}</span>
                        <div className={`px-2 py-0.5 rounded-sm text-[9px] font-black min-w-16 text-center ${log.action === 'BLOCK' ? 'bg-error text-surface' : log.action === 'PASS' ? 'bg-success text-surface' : 'bg-accent/20 text-accent border border-accent/30'}`}>
                          {log.action}
                        </div>
                        <span className="flex-1 font-bold text-on-surface tracking-tight group-hover:text-accent transition-colors">{log.field}</span>
                        <span className="text-[10px] font-bold text-outline-variant opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">{log.origin}</span>
                      </div>
                    ))}
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <nav className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 px-8 py-4 bg-surface-container/60 backdrop-blur-3xl border border-outline rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex gap-12 items-center">
        <NavItem tab="Dash" icon={LayoutDashboard} label="Dash" active={activeTab === 'Dash'} onClick={() => setActiveTab('Dash')} />
        <NavItem tab="Team" icon={Users} label="Team" active={activeTab === 'Team'} onClick={() => setActiveTab('Team')} />
        <NavItem tab="AI" icon={Bot} label="AI" active={activeTab === 'AI'} onClick={() => setActiveTab('AI')} />
        <NavItem tab="Security" icon={Lock} label="Security" active={activeTab === 'Security'} onClick={() => setActiveTab('Security')} />
      </nav>
    </div>
  );
}

const NavItem = ({ icon: Icon, label, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center gap-1 transition-all hover:scale-110 active:scale-90 relative group outline-none ${active ? 'text-on-surface' : 'text-on-surface-variant hover:text-on-surface'}`}
  >
    <div className={`p-1 transition-colors ${active ? 'text-accent' : ''}`}>
      <Icon size={20} strokeWidth={active ? 2.5 : 2} />
    </div>
    <span className={`text-[8px] uppercase tracking-[0.2em] font-black transition-all duration-300 absolute -bottom-4 ${active ? 'opacity-100 translate-y-1' : 'opacity-0 scale-50 translate-y-0'}`}>
      {label}
    </span>
    {active && (
      <motion.div 
        layoutId="nav-glow"
        className="absolute -top-6 w-8 h-1 bg-accent rounded-full shadow-[0_0_20px_rgba(129,140,248,1)]" 
      />
    )}
  </button>
);


