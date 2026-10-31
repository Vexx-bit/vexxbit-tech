import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Sparkles, CornerDownLeft, Copy, Check } from 'lucide-react';
import { sounds } from '../utils/sound';

interface OutputLine {
  type: 'input' | 'output' | 'system' | 'error' | 'success';
  content: string | React.ReactNode;
}

interface TerminalProps {
  onTriggerPulse?: () => void;
}

export const InteractiveTerminal: React.FC<TerminalProps> = ({ onTriggerPulse }) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<OutputLine[]>([
    {
      type: 'system',
      content: 'VEXXBIT OS v2.6.4 (Nairobi-Edge-AF-01) // Type "help" or click presets below.',
    },
    {
      type: 'output',
      content: 'Kernel linked to Cloudflare Edge. All autonomous agent subsystems nominal.',
    },
  ]);
  const [copied, setCopied] = useState(false);
  const bufferRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const buffer = bufferRef.current;
    if (buffer) buffer.scrollTop = buffer.scrollHeight;
  }, [history]);

  const executeCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    sounds.playClick();

    if (!trimmed) return;

    const newHistory: OutputLine[] = [
      ...history,
      { type: 'input', content: `vexxbit@nairobi-edge:~$ ${cmd}` },
    ];

    switch (trimmed) {
      case 'help':
        newHistory.push({
          type: 'output',
          content: (
            <div className="space-y-1 text-xs sm:text-sm">
              <p className="text-[#00f2fe] font-semibold">AVAILABLE COMMANDS:</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-slate-300">
                <span className="text-emerald-400 font-mono">projects</span>
                <span>List production AI agent deployments</span>
                <span className="text-emerald-400 font-mono">study-agent</span>
                <span>Inspect WhatsApp Study Agent architecture</span>
                <span className="text-emerald-400 font-mono">pulse</span>
                <span>Trigger 3D quantum core shockwave</span>
                <span className="text-emerald-400 font-mono">hacktoberfest</span>
                <span>Check Hacktoberfest 2026 status</span>
                <span className="text-emerald-400 font-mono">whoami</span>
                <span>Developer profile & background</span>
                <span className="text-emerald-400 font-mono">contact</span>
                <span>Get direct Titan Mail & social links</span>
                <span className="text-emerald-400 font-mono">clear</span>
                <span>Reset terminal buffer</span>
              </div>
            </div>
          ),
        });
        break;

      case 'projects':
        newHistory.push({
          type: 'output',
          content: (
            <div className="space-y-2 text-xs sm:text-sm">
              <div className="border-l-2 border-[#00f2fe] pl-3 py-1 bg-white/[0.02]">
                <p className="font-bold text-white flex items-center gap-2">
                  <span>📱 STUDY AGENT ON WHATSAPP</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">PRODUCTION</span>
                </p>
                <p className="text-slate-400 text-xs mt-1">
                  Chat-operated study agent giving university students access to course slides, past exams, and AI quizzes entirely via Twilio WhatsApp.
                </p>
                <p className="text-slate-500 text-[11px] font-mono mt-1">
                  Stack: Google ADK + Gemini API + Cloud Run + Twilio + Vercel
                </p>
              </div>

              <div className="border-l-2 border-emerald-500 pl-3 py-1 bg-white/[0.02]">
                <p className="font-bold text-white flex items-center gap-2">
                  <span>⚡ DEVRELAY AGENTIC GATEWAY</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">MCP INTEGRATION</span>
                </p>
                <p className="text-slate-400 text-xs mt-1">
                  Model Context Protocol gateway for automated hackathon verification, session streaming, and developer wisdom retrieval.
                </p>
              </div>
            </div>
          ),
        });
        break;

      case 'study-agent':
        newHistory.push({
          type: 'output',
          content: (
            <div className="space-y-2 text-xs sm:text-sm bg-cyan-950/20 p-3 rounded border border-cyan-500/20">
              <p className="font-bold text-[#00f2fe] flex items-center gap-2">
                <span>SYSTEM BLUEPRINT: Study Agent on WhatsApp</span>
              </p>
              <ul className="list-disc list-inside text-slate-300 space-y-1 text-xs">
                <li><strong className="text-white">Orchestration:</strong> Google Agent Development Kit (ADK)</li>
                <li><strong className="text-white">Cognition:</strong> Multimodal Gemini API with contextual memory</li>
                <li><strong className="text-white">Infrastructure:</strong> Google Cloud Run containerized service</li>
                <li><strong className="text-white">Frontline Channel:</strong> Twilio WhatsApp Business API Webhooks</li>
                <li><strong className="text-white">Live Dashboard:</strong> <a href="https://agentic-workshop-ten.vercel.app/" target="_blank" rel="noreferrer" className="text-cyan-400 underline">agentic-workshop-ten.vercel.app</a></li>
              </ul>
            </div>
          ),
        });
        break;

      case 'pulse':
        if (onTriggerPulse) {
          onTriggerPulse();
          sounds.playPulse();
          newHistory.push({
            type: 'success',
            content: '⚡ Quantum Core Shockwave emitted. 3D Gyro rings synchronized at resonant frequency.',
          });
        }
        break;

      case 'hacktoberfest':
        newHistory.push({
          type: 'output',
          content: (
            <div className="space-y-1 text-xs sm:text-sm text-slate-300">
              <p className="text-orange-400 font-bold">🎃 HACKTOBERFEST 2026 // PARTICIPANT DOSSIER</p>
              <p>• Participant: <span className="text-white font-mono">Samuel Kangethe (018c1df7-3267-6ba4-90e3-ccc64cd68b8a)</span></p>
              <p>• Status: <span className="text-emerald-400 font-mono">Registered & Checked In</span></p>
              <p>• Theme: <span className="text-cyan-400">"AI belongs to everyone — building with open-weight models"</span></p>
              <p>• Verified Domain: <span className="text-white font-mono">vexxbit.tech (Active Cloudflare Edge)</span></p>
            </div>
          ),
        });
        break;

      case 'whoami':
        newHistory.push({
          type: 'output',
          content: (
            <div className="space-y-1 text-xs sm:text-sm text-slate-300">
              <p className="text-white font-semibold">Samuel Kangethe (@vexxbit)</p>
              <p className="text-slate-400 text-xs">
                AI Systems Engineer & Full-Stack Builder based in Nairobi, Kenya. Specializing in autonomous agent architectures, neuro-symbolic safety guardrails, and real-time edge deployments.
              </p>
            </div>
          ),
        });
        break;

      case 'contact':
        newHistory.push({
          type: 'output',
          content: (
            <div className="space-y-1 text-xs sm:text-sm">
              <p className="text-slate-200">📧 Titan Email: <a href="mailto:samuel@vexxbit.tech" className="text-cyan-400 underline">samuel@vexxbit.tech</a></p>
              <p className="text-slate-200">🌐 DEV.to: <a href="https://dev.to/vexxbit" target="_blank" rel="noreferrer" className="text-cyan-400 underline">dev.to/vexxbit</a></p>
              <p className="text-slate-200">💻 GitHub: <a href="https://github.com/Vexx-bit" target="_blank" rel="noreferrer" className="text-cyan-400 underline">github.com/Vexx-bit</a></p>
            </div>
          ),
        });
        break;

      case 'clear':
        setHistory([]);
        setInput('');
        return;

      default:
        newHistory.push({
          type: 'error',
          content: `Command not recognized: "${cmd}". Type "help" for valid commands.`,
        });
        break;
    }

    setHistory(newHistory);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(input);
    }
  };

  const copyEmail = () => {
    navigator.clipboard.writeText('samuel@vexxbit.tech');
    setCopied(true);
    sounds.playClick();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full glass-panel-glow rounded-xl overflow-hidden font-mono shadow-2xl border border-white/10">
      {/* Terminal Title Bar */}
      <div className="bg-[#0b0d14]/90 px-4 py-3 flex flex-wrap gap-2 items-center justify-between border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#ef4444]/80 inline-block" />
          <span className="w-3 h-3 rounded-full bg-[#eab308]/80 inline-block" />
          <span className="w-3 h-3 rounded-full bg-[#10b981]/80 inline-block" />
          <span className="text-xs text-slate-400 font-mono ml-2 flex items-center gap-1.5">
            <TerminalIcon className="w-3.5 h-3.5 text-[#00f2fe]" />
            vexxbit@nairobi-edge:~
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyEmail}
            className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 px-2 py-1 rounded bg-white/5 border border-white/5 transition-colors"
            title="Copy Contact Email"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>samuel@vexxbit.tech</span>
          </button>
        </div>
      </div>

      {/* Terminal Content Buffer */}
      <div ref={bufferRef} className="p-4 sm:p-5 h-72 sm:h-80 overflow-y-auto space-y-2.5 text-xs sm:text-sm bg-[#06070a]/90 backdrop-blur-md">
        {history.map((line, idx) => (
          <div key={idx} className="leading-relaxed">
            {line.type === 'input' && (
              <p className="text-cyan-400 font-semibold">{line.content}</p>
            )}
            {line.type === 'output' && (
              <div className="text-slate-300">{line.content}</div>
            )}
            {line.type === 'system' && (
              <p className="text-slate-500 italic">{line.content}</p>
            )}
            {line.type === 'error' && (
              <p className="text-rose-400">{line.content}</p>
            )}
            {line.type === 'success' && (
              <p className="text-emerald-400 font-medium">{line.content}</p>
            )}
          </div>
        ))}
      </div>

      {/* Quick Action Pills */}
      <div className="px-4 py-2 bg-[#090b10] border-t border-white/[0.06] flex items-center gap-2 overflow-x-auto text-[11px] text-slate-400">
        <span className="text-slate-500 font-mono shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#00f2fe]" /> Quick:
        </span>
        {['projects', 'study-agent', 'pulse', 'hacktoberfest', 'contact', 'help'].map((cmd) => (
          <button
            key={cmd}
            onClick={() => executeCommand(cmd)}
            onMouseEnter={() => sounds.playHover()}
            className="px-2.5 py-1 rounded-md bg-white/[0.04] hover:bg-[#00f2fe]/20 hover:text-[#00f2fe] border border-white/[0.08] hover:border-[#00f2fe]/40 transition-all font-mono shrink-0 cursor-pointer"
          >
            {cmd}
          </button>
        ))}
      </div>

      {/* Input Prompt */}
      <div className="p-3 bg-[#0a0c12] border-t border-white/[0.08] flex items-center gap-2">
        <span className="text-[#00f2fe] font-bold text-sm select-none flex items-center">
          &gt;
        </span>
        <input
          type="text"
          aria-label="Lab terminal command"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type command ('help', 'projects', 'pulse')..."
          className="w-full bg-transparent text-white placeholder-slate-600 focus:outline-none text-xs sm:text-sm font-mono"
        />
        <button
          onClick={() => executeCommand(input)}
          className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          title="Run command"
        >
          <CornerDownLeft className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
