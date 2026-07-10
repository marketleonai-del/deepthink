import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ChevronRight, Sparkles, Target, Lightbulb, MessageCircle, Users, GitFork, Scale, ClipboardCheck, Award, X } from 'lucide-react';
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

  const callAI = (stepNum: number, userContent: string, extraContext?: string) => {
    const system = BOARDROOM_SYSTEM_PROMPT(stepNum) + (extraContext ? `\n\n上下文：${extraContext}` : '');
    const msgs: Message[] = [{ role: 'system', content: system }, { role: 'user', content: userContent }];
    setIsLoading(true);
    setError('');
    let fullText = '';
    streamKimiAPI(msgs,
      (chunk: string) => {
        fullText += chunk;
        setMessages(prev => {
          const last = prev[prev.length - 1];
          if (last?.role === 'assistant') return [...prev.slice(0, -1), { role: 'assistant', content: fullText }];
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
      <div className="space-y-10 max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="text-center pt-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="tag-vermilion">12人私董会</span>
            <span className="tag-jade">NGT 名义群体法</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-gradient-shift text-glow" style={{ fontFamily: "'Noto Serif SC', serif", letterSpacing: '-0.02em' }}>私董会</h1>
          <p className="text-base max-w-lg mx-auto leading-relaxed" style={{ color: '#9B958D' }}>
            12 位拥有正交哲学框架的 AI 幕僚，通过 8 步标准化流程，帮你做重大决策
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex justify-center">
          <div className="flex flex-wrap justify-center gap-3">
            {ADVISORS.map((a, i) => (
              <motion.div key={a.id} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.04, type: 'spring', damping: 20 }}
                className="flex flex-col items-center gap-1.5 group" title={`${a.name} — ${a.philosophy}`}>
                <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 group-hover:scale-110"
                  style={{ background: `${a.color}10`, border: `1.5px solid ${a.color}30`, color: a.color, boxShadow: `0 0 20px ${a.color}08` }}>
                  {a.name.slice(0, 1)}
                </div>
                <span className="text-[10px]" style={{ color: '#4A453E' }}>{a.name.slice(0, 2)}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }}>
          <div className="card-glass p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(212,168,83,0.1)' }}>
                <MessageCircle size={15} style={{ color: '#D4A853' }} />
              </div>
              <span className="text-sm font-medium" style={{ color: '#D4A853' }}>倾诉你的困惑</span>
            </div>
            <textarea value={problem} onChange={(e) => setProblem(e.target.value)}
              placeholder="在这里倾诉你的困惑，无需整理、无需完美。比如：我在纠结是否要辞职创业..."
              className="input-glass mb-4" rows={4} />
            <div className="flex items-center justify-between">
              <span className="text-xs" style={{ color: '#4A453E' }}>{problem.length > 0 ? `${problem.length} 字` : '8 步流程 · 全程 AI 引导'}</span>
              <button onClick={startBoardroom} disabled={!problem.trim()} className="btn-primary flex items-center gap-2">
                <Sparkles size={16} /> 开启私董会
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="grid grid-cols-4 sm:grid-cols-8 gap-3">
          {STEP_LABELS.map((label, i) => {
            const Icon = STEP_ICONS[i];
            return (
              <div key={i} className="card-elevated p-3 text-center">
                <div className="w-8 h-8 rounded-lg mx-auto mb-2 flex items-center justify-center" style={{ background: 'rgba(212,168,83,0.06)' }}>
                  <Icon size={14} style={{ color: '#D4A853' }} />
                </div>
                <div className="text-[10px] font-mono mb-0.5" style={{ color: '#4A453E' }}>Step {i + 1}</div>
                <div className="text-[11px] font-medium" style={{ color: '#9B958D' }}>{label}</div>
              </div>
            );
          })}
        </motion.div>

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl px-4 py-3 text-sm flex items-center gap-2" style={{ background: 'rgba(199,62,29,0.08)', border: '1px solid rgba(199,62,29,0.15)', color: '#C73E1D' }}>
            <X size={14} /> {error}
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col" style={{ minHeight: 'calc(100dvh - 180px)' }}>
      <div className="flex items-center justify-between mb-5">
        <button onClick={() => { setStarted(false); setStep(0); setMessages([]); setProblem(''); setInput(''); }}
          className="flex items-center gap-1.5 text-xs transition-colors hover:text-[#D4A853]" style={{ color: '#6A645C' }}>
          <ChevronRight size={12} className="rotate-180" /> 返回
        </button>
        <div className="flex items-center gap-2">
          <span className="tag-vermilion">{ADVISORS.length} 位幕僚</span>
          <span className="tag-jade">Step {step} / 8</span>
        </div>
      </div>

      <div className="step-bar mb-5">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className={`step-segment ${i < step ? 'done' : i === step - 1 ? 'active' : 'pending'}`} />
        ))}
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 pr-2 pb-4" style={{ maxHeight: 'calc(100dvh - 320px)' }}>
        {step === 1 && messages.length === 0 && (
          <div className="card-glass p-8 text-center">
            <Loader2 size={28} className="animate-spin mx-auto mb-3" style={{ color: '#D4A853' }} />
            <p className="text-sm" style={{ color: '#9B958D' }}>主持人正在准备...</p>
          </div>
        )}
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              {msg.role === 'user' ? (
                <div className="flex justify-end">
                  <div className="max-w-[80%] rounded-2xl rounded-br-sm px-5 py-3.5 text-sm leading-relaxed"
                    style={{ background: 'rgba(212,168,83,0.08)', border: '1px solid rgba(212,168,83,0.12)', color: '#F0EBE3' }}>
                    {msg.content}
                  </div>
                </div>
              ) : (
                <div className="card-glass p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(212,168,83,0.1)' }}>
                      {(() => { const I = STEP_ICONS[step - 1]; return I ? <I size={14} style={{ color: '#D4A853' }} /> : null; })()}
                    </div>
                    <span className="text-xs font-medium" style={{ color: '#D4A853' }}>Step {step} &middot; {STEP_LABELS[step - 1]}</span>
                  </div>
                  <div className="markdown-body text-sm">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && messages[messages.length - 1]?.role === 'user' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card-glass p-6 flex items-center gap-3">
            <Loader2 size={16} className="animate-spin" style={{ color: '#D4A853' }} />
            <span className="text-sm" style={{ color: '#9B958D' }}>12 位幕僚正在深度思考</span>
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4A853] typing-dot" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4A853] typing-dot" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4A853] typing-dot" />
            </div>
          </motion.div>
        )}
        {error && (
          <div className="rounded-xl px-4 py-3 text-sm flex items-center gap-2" style={{ background: 'rgba(199,62,29,0.08)', border: '1px solid rgba(199,62,29,0.15)', color: '#C73E1D' }}>
            <X size={14} /> {error}
          </div>
        )}
      </div>

      <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(212,168,83,0.06)' }}>
        {step === 8 && !isLoading ? (
          <button onClick={() => { setStarted(false); setStep(0); setMessages([]); setProblem(''); setInput(''); }} className="btn-primary w-full">
            <Sparkles size={16} className="inline mr-2" />开启新的私董会
          </button>
        ) : (
          <div className="flex gap-2">
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendInput()}
              placeholder={step === 1 ? '回复主持人的问题...' : '输入你的回答...'} className="input-glass flex-1 !py-3.5 !px-5" />
            <button onClick={sendInput} disabled={isLoading || !input.trim()} className="btn-primary !px-5 !py-3.5" style={{ opacity: isLoading || !input.trim() ? 0.4 : 1 }}>
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : <ChevronRight size={16} />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
