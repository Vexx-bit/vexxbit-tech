import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { 
  Terminal as TerminalIcon, 
  Cpu, 
  Radio, 
  ExternalLink, 
  BookOpen, 
  Mail, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  ArrowUpRight, 
  ShieldCheck, 
  Zap, 
  Eye, 
  MessageSquare,
  CheckCircle2,
  Copy,
  Layers,
  Activity
} from 'lucide-react';

const GithubIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);
import confetti from 'canvas-confetti';
const Canvas3D = lazy(() => import('./components/Canvas3D').then((module) => ({ default: module.Canvas3D })));
import { InteractiveTerminal } from './components/InteractiveTerminal';
import { sounds } from './utils/sound';

export const App: React.FC = () => {
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [pulseFn, setPulseFn] = useState<(() => void) | null>(null);
  const handleCoreReady = useCallback((fn: (() => void) | null) => setPulseFn(() => fn), []);
  const [copiedDomain, setCopiedDomain] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { timeZone: 'Africa/Nairobi', hour12: false }) + ' EAT');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleSound = () => {
    const newState = sounds.toggle();
    setSoundEnabled(newState);
  };

  const handlePulseCore = () => {
    if (pulseFn) {
      pulseFn();
      sounds.playPulse();
    }
  };

  const copyDomain = () => {
    navigator.clipboard.writeText('vexxbit.tech');
    setCopiedDomain(true);
    sounds.playClick();
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#00f2fe', '#10b981', '#38bdf8']
    });
    setTimeout(() => setCopiedDomain(false), 2200);
  };

  const copyEmail = () => {
    navigator.clipboard.writeText('samuel@vexxbit.tech');
    setCopiedEmail(true);
    sounds.playClick();
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.85 },
      colors: ['#00f2fe', '#10b981', '#ffffff']
    });
    setTimeout(() => setCopiedEmail(false), 2200);
  };

  return (
    <div id="app-root" className="relative min-h-screen bg-[#07080b] text-[#f1f5f9] font-sans selection:bg-[#00f2fe]/30 selection:text-white">
      {/* 3D WebGL Canvas Layer */}
      <Suspense fallback={null}><Canvas3D onPulseReady={handleCoreReady} /></Suspense>

      {/* Grid Pattern Ambient Overlay */}
      <div className="fixed inset-0 bg-grid-cyber pointer-events-none z-0 opacity-40" />

      {/* Top Telemetry Header / HUD */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/[0.08] px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo & Callout */}
          <div className="flex items-center gap-3">
            <div 
              onClick={handlePulseCore}
              onMouseEnter={() => sounds.playHover()}
              className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00f2fe]/20 to-[#10b981]/20 border border-[#00f2fe]/40 flex items-center justify-center cursor-pointer hover:border-[#00f2fe] transition-all group"
              title="Click to pulse 3D Core"
            >
              <Cpu className="w-4 h-4 text-[#00f2fe] group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <span className="font-display font-extrabold tracking-wider text-base sm:text-lg text-white">
                VEXXBIT<span className="text-[#00f2fe] font-mono font-normal text-xs ml-1">// LABS</span>
              </span>
            </div>
          </div>

          {/* Telemetry Indicator & Clock */}
          <div className="hidden md:flex items-center gap-4 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>EDGE: NAIROBI ({currentTime})</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/30 border border-cyan-500/20 text-cyan-300">
              <Activity className="w-3.5 h-3.5" />
              <span>CLOUDFLARE PAGES // NORMAL</span>
            </div>
          </div>

          {/* Controls & Nav Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleToggleSound}
              className={`p-2 rounded-lg border text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                soundEnabled 
                  ? 'bg-[#00f2fe]/10 border-[#00f2fe]/50 text-[#00f2fe]' 
                  : 'bg-white/[0.04] border-white/[0.08] text-slate-400 hover:text-white'
              }`}
              title={soundEnabled ? 'Mute sound engine' : 'Enable Web Audio synthesizers'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden sm:inline">{soundEnabled ? 'AUDIO ON' : 'AUDIO OFF'}</span>
            </button>

            <a
              href="https://github.com/Vexx-bit"
              target="_blank"
              rel="noreferrer"
              onMouseEnter={() => sounds.playHover()}
              className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="GitHub Profile"
            >
              <GithubIcon className="w-4 h-4" />
            </a>

            <a
              href="https://dev.to/vexxbit"
              target="_blank"
              rel="noreferrer"
              onMouseEnter={() => sounds.playHover()}
              className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="DEV.to Profile"
            >
              <BookOpen className="w-4 h-4" />
            </a>

            <button
              onClick={copyDomain}
              onMouseEnter={() => sounds.playHover()}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00f2fe]/15 hover:bg-[#00f2fe]/25 text-[#00f2fe] border border-[#00f2fe]/30 text-xs font-mono transition-all cursor-pointer"
            >
              {copiedDomain ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedDomain ? 'COPIED!' : 'vexxbit.tech'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Sections (Rendered on top of 3D Scene) */}
      <main className="relative z-10 pt-28 sm:pt-36 pb-24 px-4 sm:px-8 max-w-7xl mx-auto space-y-36 sm:space-y-48">
        
        {/* ========================================================================= */}
        {/* HERO SECTION */}
        {/* ========================================================================= */}
        <section id="hero" className="min-h-[75vh] flex flex-col justify-center">
          <div className="max-w-3xl w-full min-w-0 space-y-6">
            
            {/* Mission Category Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.1] text-xs font-mono text-[#00f2fe]">
              <Sparkles className="w-3.5 h-3.5 text-[#10b981]" />
              <span>AUTONOMOUS AGENT LABS & COGNITIVE INFRASTRUCTURE</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display font-extrabold text-[clamp(1.65rem,7.5vw,2.25rem)] sm:text-6xl lg:text-7xl tracking-tight leading-[1.05] text-white">
              ARCHITECTING <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f2fe] via-[#38bdf8] to-[#10b981]">
                AUTONOMOUS AGENTS
              </span> <br />
              FOR THE REAL WORLD.
            </h1>

            {/* Sub-description */}
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
              Specialized in production agent systems, neuro-symbolic safety guardrails, and multimodal edge intelligence. Operating from Nairobi, Kenya to the global edge.
            </p>

            {/* Interactive Hero CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href="#featured-project"
                onMouseEnter={() => sounds.playHover()}
                onClick={() => sounds.playClick()}
                className="px-6 py-3.5 rounded-lg bg-[#00f2fe] hover:bg-[#38bdf8] text-[#07080b] font-bold text-sm tracking-wide flex items-center gap-2 shadow-[0_0_30px_rgba(0,242,254,0.3)] transition-all hover:scale-105 cursor-pointer"
              >
                <span>EXPLORE STUDY AGENT</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>

              <button
                onClick={handlePulseCore}
                onMouseEnter={() => sounds.playHover()}
                className="px-6 py-3.5 rounded-lg glass-panel hover:bg-white/[0.08] border border-white/[0.15] hover:border-[#00f2fe]/60 text-white font-mono text-sm flex items-center gap-2 transition-all cursor-pointer group"
              >
                <Zap className="w-4 h-4 text-[#00f2fe] group-hover:scale-125 transition-transform" />
                <span>PULSE 3D CORE</span>
              </button>

              <a
                href="#terminal"
                onMouseEnter={() => sounds.playHover()}
                onClick={() => sounds.playClick()}
                className="px-5 py-3.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] text-slate-300 hover:text-white font-mono text-sm flex items-center gap-2 transition-colors cursor-pointer"
              >
                <TerminalIcon className="w-4 h-4 text-emerald-400" />
                <span>LAUNCH CLI</span>
              </a>
            </div>

            {/* Telemetry Metrics Strip */}
            <div className="pt-8 border-t border-white/[0.08] grid grid-cols-2 sm:grid-cols-3 gap-6 font-mono">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Production Deploy</p>
                <p className="text-xl sm:text-2xl font-bold text-white mt-1">Study Agent</p>
                <p className="text-[11px] text-[#00f2fe]">WhatsApp + Cloud Run</p>
              </div>

              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Edge Latency</p>
                <p className="text-xl sm:text-2xl font-bold text-white mt-1">&lt; 180 ms</p>
                <p className="text-[11px] text-emerald-400">Nairobi Edge Cache</p>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <p className="text-xs text-slate-500 uppercase tracking-wider">Verified Domain</p>
                <p className="text-xl sm:text-2xl font-bold text-white mt-1">vexxbit.tech</p>
                <p className="text-[11px] text-slate-400">Hacktoberfest 2026</p>
              </div>
            </div>
          </div>
        </section>


        {/* ========================================================================= */}
        {/* FEATURED PRODUCTION SYSTEM: STUDY AGENT ON WHATSAPP */}
        {/* ========================================================================= */}
        <section id="featured-project" className="scroll-mt-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* System Breakdown Left Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-400">
                <Radio className="w-3 h-3 animate-ping" />
                <span>FEATURED PRODUCTION SYSTEM // ZERO INSTALL CLIENT</span>
              </div>

              <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight leading-tight">
                STUDY AGENT ON WHATSAPP.
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                A chat-operated autonomous study assistant that brings student e-learning portals directly into WhatsApp. Students can query complex course syllabi, retrieve weekly lecture slides, run interactive knowledge checks, and formulate exam study plans using pure natural language.
              </p>

              {/* Technical Specifications Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:border-[#00f2fe]/40 transition-colors">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#00f2fe] font-semibold">
                    <Cpu className="w-4 h-4" />
                    <span>ORCHESTRATION</span>
                  </div>
                  <p className="text-slate-200 font-medium text-sm mt-1">Google Agent Dev Kit (ADK)</p>
                  <p className="text-slate-400 text-xs mt-0.5">Autonomous goal decomposition & multi-turn dialog state tracking.</p>
                </div>

                <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:border-[#10b981]/40 transition-colors">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#10b981] font-semibold">
                    <Sparkles className="w-4 h-4" />
                    <span>COGNITIVE MODEL</span>
                  </div>
                  <p className="text-slate-200 font-medium text-sm mt-1">Gemini Multimodal API</p>
                  <p className="text-slate-400 text-xs mt-0.5">Contextual retrieval over dense course slides and diagrams.</p>
                </div>

                <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:border-cyan-400/40 transition-colors">
                  <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-semibold">
                    <Layers className="w-4 h-4" />
                    <span>INFRASTRUCTURE</span>
                  </div>
                  <p className="text-slate-200 font-medium text-sm mt-1">Google Cloud Run</p>
                  <p className="text-slate-400 text-xs mt-0.5">Containerized serverless autoscaling with sub-second response times.</p>
                </div>

                <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:border-emerald-400/40 transition-colors">
                  <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-semibold">
                    <MessageSquare className="w-4 h-4" />
                    <span>FRONTLINE TRANSPORT</span>
                  </div>
                  <p className="text-slate-200 font-medium text-sm mt-1">Twilio WhatsApp Webhooks</p>
                  <p className="text-slate-400 text-xs mt-0.5">Frictionless UX accessible on any low-end smartphone without app install.</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a
                  href="https://agentic-workshop-ten.vercel.app/"
                  target="_blank"
                  rel="noreferrer"
                  onMouseEnter={() => sounds.playHover()}
                  onClick={() => sounds.playClick()}
                  className="px-5 py-3 rounded-lg bg-[#00f2fe]/20 hover:bg-[#00f2fe]/30 border border-[#00f2fe]/50 text-[#00f2fe] font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
                >
                  <span>LIVE DASHBOARD (VERCEL)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <a
                  href="https://github.com/Vexx-bit/Agentic-Workshop"
                  target="_blank"
                  rel="noreferrer"
                  onMouseEnter={() => sounds.playHover()}
                  onClick={() => sounds.playClick()}
                  className="px-5 py-3 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-slate-300 hover:text-white font-mono text-xs flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  <span>VIEW REPOSITORY</span>
                </a>
              </div>
            </div>

            {/* Interactive WhatsApp Terminal / Phone Frame Right Column */}
            <div className="lg:col-span-5">
              <div className="glass-panel-glow rounded-2xl p-5 border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Study Agent [WhatsApp Bot]</p>
                      <p className="text-[10px] text-emerald-400 font-mono">ONLINE // TWILIO WEBHOOK ACTIVE</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400">
                    E2E ENCRYPTED
                  </span>
                </div>

                {/* Simulated Conversation */}
                <div className="space-y-3 font-sans text-xs">
                  {/* User Bubble */}
                  <div className="flex justify-end">
                    <div className="bg-emerald-600/30 border border-emerald-500/30 text-slate-200 rounded-xl rounded-tr-none px-3.5 py-2.5 max-w-[85%]">
                      <p>Hey, I have my Distributed Systems CAT tomorrow. Quiz me on the CAP theorem with 2 scenarios!</p>
                      <span className="text-[9px] text-emerald-300/70 font-mono block text-right mt-1">11:42 AM</span>
                    </div>
                  </div>

                  {/* Agent Bubble */}
                  <div className="flex justify-start">
                    <div className="bg-white/[0.04] border border-white/[0.08] text-slate-300 rounded-xl rounded-tl-none px-3.5 py-2.5 max-w-[88%] space-y-2">
                      <p className="text-white font-semibold text-[11px] flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-[#00f2fe]" /> Study Agent:
                      </p>
                      <p>
                        Let's test your trade-off intuition. Here is Scenario 1:
                      </p>
                      <p className="text-cyan-200 bg-cyan-950/30 p-2 rounded border border-cyan-500/20 text-[11px]">
                        <strong>Question:</strong> During a network partition between Nairobi and Frankfurt data centers, an ATM must decide whether to dispense cash or abort. Which properties (C or A) do you sacrifice?
                      </p>
                      <div className="flex items-center gap-2 pt-1 text-[10px] text-slate-400 font-mono">
                        <span className="px-1.5 py-0.5 rounded bg-white/5">Option A: CP</span>
                        <span className="px-1.5 py-0.5 rounded bg-white/5">Option B: AP</span>
                      </div>
                      <span className="text-[9px] text-slate-500 font-mono block text-right">11:42 AM</span>
                    </div>
                  </div>
                </div>

                {/* Footer Input Bar */}
                <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Twilio Status: 200 OK</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Latency: 142ms
                  </span>
                </div>
              </div>
            </div>

          </div>
        </section>


        {/* ========================================================================= */}
        {/* ENGINEERING ARCHITECTURE PILLARS */}
        {/* ========================================================================= */}
        <section id="architecture" className="scroll-mt-32">
          <div className="space-y-12">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>CORE ENGINEERING METHODOLOGY</span>
              </div>
              <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
                NEURO-SYMBOLIC RESILIENCE.
              </h2>
              <p className="text-slate-400 text-sm sm:text-base">
                Why standard LLM wrappers fail in mission-critical applications: our systems enforce strict deterministic guardrails, structured schema outputs, and multi-modal sensory verification.
              </p>
            </div>

            {/* Architectural Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Card 1 */}
              <div className="glass-panel p-6 rounded-xl border border-white/[0.08] hover:border-[#00f2fe]/40 transition-all space-y-4 group">
                <div className="w-12 h-12 rounded-lg bg-[#00f2fe]/10 border border-[#00f2fe]/30 flex items-center justify-center text-[#00f2fe] group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-xl text-white">
                  Deterministic Guardrails
                </h3>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                  Hardcoded regex, rule ratchets, and schema constraints that intercept and validate outputs before they reach the user. Eliminates hallucinations in high-liability clinical and financial domains.
                </p>
                <div className="pt-2 font-mono text-[11px] text-[#00f2fe]">
                  <code>Pydantic + JSON-Schema + One-Way Ratchets</code>
                </div>
              </div>

              {/* Card 2 */}
              <div className="glass-panel p-6 rounded-xl border border-white/[0.08] hover:border-[#10b981]/40 transition-all space-y-4 group">
                <div className="w-12 h-12 rounded-lg bg-[#10b981]/10 border border-[#10b981]/30 flex items-center justify-center text-[#10b981] group-hover:scale-110 transition-transform">
                  <Eye className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-xl text-white">
                  Multimodal Vision & Voice
                </h3>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                  Seamlessly pairing computer vision (OCR, test cassette diagnostics, edge barcode decoding) with natural conversational voice synthesis via ElevenLabs and WebRTC.
                </p>
                <div className="pt-2 font-mono text-[11px] text-[#10b981]">
                  <code>Gemma 4 Multimodal + ElevenLabs Voice</code>
                </div>
              </div>

              {/* Card 3 */}
              <div className="glass-panel p-6 rounded-xl border border-white/[0.08] hover:border-cyan-400/40 transition-all space-y-4 group">
                <div className="w-12 h-12 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                  <Cpu className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-xl text-white">
                  Self-Healing Tool Loops
                </h3>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                  Autonomous agents equipped with Model Context Protocol (MCP) tool bindings, reflection cycles, and automated recovery loops when external APIs or environments fail.
                </p>
                <div className="pt-2 font-mono text-[11px] text-cyan-400">
                  <code>Model Context Protocol (MCP) + DevRelay</code>
                </div>
              </div>

            </div>
          </div>
        </section>


        {/* ========================================================================= */}
        {/* INTERACTIVE LAB TERMINAL & HACKTOBERFEST 2026 */}
        {/* ========================================================================= */}
        <section id="terminal" className="scroll-mt-32">
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#00f2fe]/10 border border-[#00f2fe]/30 text-xs font-mono text-[#00f2fe]">
                  <TerminalIcon className="w-3.5 h-3.5" />
                  <span>VEXXBIT LIVE LABS SHELL</span>
                </div>
                <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
                  INTERACTIVE LAB CLI.
                </h2>
                <p className="text-slate-400 text-xs sm:text-sm">
                  Run commands directly in our edge simulator to inspect active projects, verify Hacktoberfest status, or trigger 3D audio-visual pulses.
                </p>
              </div>

              {/* Hacktoberfest Badge */}
              <div className="glass-panel px-4 py-2.5 rounded-lg border border-orange-500/30 bg-orange-950/20 flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-orange-500/20 flex items-center justify-center font-bold text-orange-400 text-sm">
                  🎃
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Hacktoberfest 2026</p>
                  <p className="text-[10px] text-orange-400 font-mono">STATUS: REGISTERED // VERIFIED</p>
                </div>
              </div>
            </div>

            {/* Terminal Component */}
            <InteractiveTerminal onTriggerPulse={pulseFn || undefined} />
          </div>
        </section>


        {/* ========================================================================= */}
        {/* COLLABORATION & CONTACT */}
        {/* ========================================================================= */}
        <section id="contact" className="scroll-mt-32 pt-12">
          <div className="glass-panel-glow rounded-3xl p-8 sm:p-14 border border-white/10 text-center max-w-4xl mx-auto space-y-8 relative overflow-hidden">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00f2fe]/20 to-[#10b981]/20 border border-[#00f2fe]/40 flex items-center justify-center mx-auto text-[#00f2fe]">
              <Mail className="w-8 h-8" />
            </div>

            <div className="space-y-3">
              <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
                LET'S BUILD THE NEXT AGENT.
              </h2>
              <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
                Whether you're exploring autonomous agent systems, multimodal AI, or high-performance edge web infrastructure — let's connect.
              </p>
            </div>

            {/* Email Dispatch Box */}
            <div className="inline-flex flex-col sm:flex-row items-center gap-3 p-2 rounded-xl bg-[#090b10] border border-white/10 max-w-md mx-auto">
              <span className="font-mono text-sm text-[#00f2fe] px-4 py-2 select-all">
                samuel@vexxbit.tech
              </span>
              <button
                onClick={copyEmail}
                onMouseEnter={() => sounds.playHover()}
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[#00f2fe] hover:bg-[#38bdf8] text-[#07080b] font-bold text-xs tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {copiedEmail ? <CheckCircle2 className="w-4 h-4 text-[#07080b]" /> : <Copy className="w-4 h-4" />}
                <span>{copiedEmail ? 'COPIED TO CLIPBOARD' : 'COPY EMAIL'}</span>
              </button>
            </div>

            {/* Verified Links */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-mono text-slate-400">
              <a 
                href="https://github.com/Vexx-bit" 
                target="_blank" 
                rel="noreferrer"
                className="hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <GithubIcon className="w-4 h-4" />
                <span>github.com/Vexx-bit</span>
              </a>

              <a 
                href="https://dev.to/vexxbit" 
                target="_blank" 
                rel="noreferrer"
                className="hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                <span>dev.to/vexxbit</span>
              </a>

              <a 
                href="https://hacktoberfest.com" 
                target="_blank" 
                rel="noreferrer"
                className="hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <span>vexxbit.tech</span>
              </a>
            </div>
          </div>
        </section>

      </main>

      {/* Futuristic Minimal Footer */}
      <footer className="border-t border-white/[0.08] py-8 px-4 sm:px-8 text-xs font-mono text-slate-500 relative z-10 bg-[#07080b]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-white tracking-wider">VEXXBIT</span>
            <span>// ARCHITECTED BY SAMUEL KANGETHE</span>
          </div>

          <div className="flex items-center gap-4">
            <span>DOMAIN: vexxbit.tech</span>
            <span>HOST: CLOUDFLARE PAGES</span>
            <span>STATUS: 200 OK</span>
          </div>
        </div>
      </footer>
    </div>
  );
};


export default App;
