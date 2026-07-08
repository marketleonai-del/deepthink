import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Loader2, ChevronRight, Users, Sparkles, Target, Lightbulb, MessageCircle,
  GitFork, Scale, ClipboardCheck, Award, CheckCircle2, AlertTriangle
} from 'lucide-react';
import { ADVISORS, STEP_LABELS } from '@/lib/data';
import { streamKimiAPI } from '@/lib/api';
import { BOARDROOM_SYSTEM_PROMPT } from '@/lib/prompts';
import type { Message } from '@/lib/api';
import ReactMarkdown from 'react-markdown';

const STEP_ICONS = [Lightbulb, Target, MessageCircle, Users, GitFork, Scale, ClipboardCheck, Award];

export default function Boardroom() {
  const [step, setStep] = useState(0);
  const [problem, setProblem] = useState('');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{role: string; content: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [started, setStarted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const callAI = async (stepNum: number, userContent: string, extraContext?: string) => {
    const system = BOARDROOM_SYSTEM_PROMPT(stepNum) + (extraContext ? `\n\n上下文：${extraContext}` : '');
    const msgs: Message[] = [
      { role: 'system', content: system },
      { role: 'user', content: userContent },
    ];

    setIsLoading(true);
    setError('');

    let fullText = '';
    streamKimiAPI(
      msgs,
      (chunk: string) => {
        fullText += chunk;
        setMessages(prev => {
          const last = prev[prev.length - 1];
          if (last?.role === 'assistant') {
            return [...prev.slice(0, -1), { role: 'assistant', content: fullText }];
          }
          return [...prev, { role: 'assistant', content: fullText }];
        });
      },
      () => setIsLoading(false),
      (err: string) => { setError(err); setIsLoading(false); }
    );
  };

  const startBoardroom = () => {
    if (!problem.trim()) { setError('请先输入你的困惑'); return; }
    setStarted(true);
    setStep(1);
    setMessages([]);
    callAI(1, problem);
  };

  const sendInput = () => {
    if (!input.trim() || isLoading) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);

    if (step < 8) {
      const next = step + 1;
      setStep(next);
      const history = messages.map(m => `${m.role === 'user' ? '用户' : 'AI'}：${m.content}`).join('\n');
      const context = `原始问题：${problem}\n\n对话历史：\n${history}\n\n用户回复：${userMsg}`;
      callAI(next, '请继续下一步', context);
    }
    setInput('');
  };

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  if (!started) {
    return (
      <div className="space-y-8 max-w-2xl mx-auto">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold text-gradient" style={{ fontFamily: 'Noto Serif SC, serif' }}>12人AI私董会</h2>
          <p className="text-sm text-[#4F5560] leading-relaxed">
            12位拥有正交哲学框架的AI幕僚，通过8步标准化私董会流程<br />
            帮你把高水平思维操作系统化、可重复落地
          </p>
        </div>

        <div className="relative w-64 h-64 mx-auto">
          <div className="absolute inset-0 rounded-full" style={{ border: '1px dashed rgba(212,168,83,0.2)' }} />
          <div className="absolute inset-8 rounded-full" style={{ border: '1px dashed rgba(212,168,83,0.1)' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="w-12 h-12 rounded-full mx-auto mb-1 flex items-center justify-center" style={{ background: 'rgba(212,168,83,0.15)', border: '1px solid rgba(212,168,83,0.3)' }}>
              <span className="text-lg font-bold" style={{ color: '#D4A853' }}>你</span>
            </div>
            <span className="text-xs text-[#4F5560]">案主</span>
          </div>
          {ADVISORS.map((a, i) => {
            const angle = (i * 30 - 90) * (Math.PI / 180);
            const x = 50 + 42 * Math.cos(angle);
            const y = 50 + 42 * Math.sin(angle);
            return (
              <motion.div key={a.id} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: i * 0.06, type: 'spring', damping: 20 }}
                className="absolute w-9 h-9 rounded-full flex items-center justify-center text-xs font-medium cursor-default"
                style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%,-50%)', background: `${a.color}15`, border: `1.5px solid ${a.color}40`, color: a.color, fontSize: '10px' }}
                title={`${a.name} — ${a.philosophy}`}>
                {a.name.slice(0, 1)}
              </motion.div>
            );
          })}
        </div>

        <div className="space-y-4">
          <div className="relative">
            <textarea value={problem} onChange={(e) => setProblem(e.target.value)}
              placeholder="在这里倾诉你的困惑，无需整理、无需完美。比如：我在纠结是否要辞职创业..."
              className="w-full rounded-2xl p-4 text-sm outline-none resize-none transition-all"
              style={{ background: '#141517', border: '1px solid #3A3F47', color: '#F0EBE0', minHeight: '120px' }}
              onFocus={(e) => { e.target.style.borderColor = '#D4A853'; }}
              onBlur={(e) => { e.target.style.borderColor = '#3A3F47'; }} />
            {problem.length > 0 && <div className="absolute bottom-3 right-3 text-xs text-[#4F5560]">{problem.length}字</div>}
          </div>

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-sm text-[#C73E1D] bg-[#C73E1D]/10 rounded-xl px-4 py-3">
              <AlertTriangle size={14} /> {error}
            </motion.div>
          )}

          <button onClick={startBoardroom} disabled={!problem.trim()}
            className="w-full rounded-2xl py-4 text-base font-semibold transition-all flex items-center justify-center gap-2"
            style={{ background: problem.trim() ? '#D4A853' : '#25282D', color: problem.trim() ? '#0D0E0F' : '#4F5560' }}>
            <Sparkles size={18} /> 开启私董会
          </button>

          <div className="grid grid-cols-4 gap-2 pt-4">
            {STEP_LABELS.map((label, i) => (
              <div key={i} className="text-center p-2 rounded-lg" style={{ background: '#141517' }}>
                <div className="w-6 h-6 rounded-full mx-auto mb-1 flex items-center justify-center text-xs font-mono" style={{ background: 'rgba(212,168,83,0.1)', color: '#D4A853' }}>
                  {i + 1}
                </div>
                <span className="text-[10px] text-[#4F5560]">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-180px)]">
      <div className="flex items-center gap-1 mb-4 px-1">
        {STEP_LABELS.map((label, i) => {
          const s = i + 1;
          return (
            <button key={s} onClick={() => { if (s <= step) setStep(s); }}
              className="flex-1 flex flex-col items-center gap-1 py-2 rounded-lg transition-all"
              style={{ background: s === step ? 'rgba(212,168,83,0.1)' : s < step ? 'rgba(45,122,95,0.08)' : 'transparent', cursor: s <= step ? 'pointer' : 'default', opacity: s > step ? 0.4 : 1 }}>
              <div className="w-6 h-6 rounded-full flex items-center justify-center"
                style={{ background: s === step ? 'rgba(212,168,83,0.2)' : s < step ? 'rgba(45,122,95,0.2)' : '#25282D', color: s === step ? '#D4A853' : s < step ? '#4CAF8C' : '#4F5560' }}>
                {s < step ? <CheckCircle2 size={12} /> : (() => { const I = STEP_ICONS[i]; return I ? <I size={10} /> : null; })()}
              </div>
              <span className="text-[9px] hidden sm:block" style={{ color: s === step ? '#D4A853' : s < step ? '#4CAF8C' : '#4F5560' }}>{label}</span>
            </button>
          );
        })}
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 pr-2 pb-4">
        {step === 1 && messages.length === 0 && (
          <div className="text-center py-8">
            <Loader2 size={24} className="animate-spin mx-auto mb-3" style={{ color: '#D4A853' }} />
            <p className="text-sm text-[#4F5560]">主持人正在准备...</p>
          </div>
        )}

        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              {msg.role === 'user' ? (
                <div className="flex justify-end">
                  <div className="max-w-[85%] rounded-2xl rounded-br-md px-4 py-3 text-sm"
                    style={{ background: 'rgba(212,168,83,0.15)', color: '#F0EBE0', border: '1px solid rgba(212,168,83,0.2)' }}>
                    {msg.content}
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl p-4" style={{ background: '#1C1E21', border: '1px solid #25282D' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs" style={{ background: 'rgba(212,168,83,0.15)', color: '#D4A853' }}>
                      {(() => { const I = STEP_ICONS[step - 1]; return I ? <I size={12} /> : null; })()}
                    </div>
                    <span className="text-xs font-medium" style={{ color: '#D4A853' }}>Step {step} &middot; {STEP_LABELS[step - 1]}</span>
                  </div>
                  <div className="markdown-body text-sm text-[#D8D0C4]">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && messages[messages.length - 1]?.role === 'user' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-sm text-[#4F5560]">
            <Loader2 size={14} className="animate-spin" />
            <span>12位幕僚正在深度思考...</span>
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4A853] typing-dot" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4A853] typing-dot" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4A853] typing-dot" />
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-[#C73E1D] bg-[#C73E1D]/10 rounded-xl px-4 py-3 border border-[#C73E1D]/20 flex items-center gap-2">
            <AlertTriangle size={14} /> {error}
          </motion.div>
        )}
      </div>

      <div className="pt-4 border-t border-[#25282D]">
        {step === 8 && !isLoading ? (
          <button onClick={() => { setStarted(false); setStep(0); setMessages([]); setProblem(''); setInput(''); }}
            className="w-full rounded-xl py-3 text-sm font-medium transition-all" style={{ background: '#D4A853', color: '#0D0E0F' }}>
            开启新的私董会
          </button>
        ) : (
          <div className="flex gap-2">
            <input value={input} onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendInput()}
              placeholder={step === 1 ? '回复主持人的问题...' : '输入你的回答...'}
              className="flex-1 rounded-xl px-4 py-3 text-sm outline-none transition-all"
              style={{ background: '#141517', border: '1px solid #3A3F47', color: '#F0EBE0' }}
              onFocus={(e) => { e.target.style.borderColor = '#D4A853'; }}
              onBlur={(e) => { e.target.style.borderColor = '#3A3F47'; }} />
            <button onClick={sendInput} disabled={isLoading || !input.trim()}
              className="rounded-xl px-4 py-3 transition-all flex items-center gap-2"
              style={{ background: input.trim() ? '#D4A853' : '#25282D', color: input.trim() ? '#0D0E0F' : '#4F5560', opacity: isLoading ? 0.5 : 1 }}>
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : <ChevronRight size={16} />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
