import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, Sparkles, Zap, User, BookOpen, X, ChevronRight, Lightbulb, Target, Brain } from 'lucide-react';
import { MODES } from '@/lib/data';
import { streamKimiAPI } from '@/lib/api';
import { QUICK_THINK_SYSTEM_PROMPT } from '@/lib/prompts';
import type { Message } from '@/lib/api';
import ReactMarkdown from 'react-markdown';

const CATEGORIES = [
  { key: 'all', label: '全部', count: MODES.length },
  { key: 'model', label: '思维模型', count: MODES.filter(m => m.category === 'model').length },
  { key: 'person', label: '人物', count: MODES.filter(m => m.category === 'person').length },
  { key: 'book', label: '书籍', count: MODES.filter(m => m.category === 'book').length },
];

const getModeIcon = (mode: typeof MODES[0]) => {
  if (mode.category === 'person') return <User size={16} />;
  if (mode.category === 'book') return <BookOpen size={16} />;
  if (mode.id.includes('first') || mode.id.includes('principle')) return <Brain size={16} />;
  if (mode.id.includes('smart') || mode.id.includes('goal') || mode.id.includes('okr')) return <Target size={16} />;
  return <Lightbulb size={16} />;
};

export default function QuickThink() {
  const [activeCat, setActiveCat] = useState('all');
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<{role: string; content: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showChat, setShowChat] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const filtered = activeCat === 'all' ? MODES : MODES.filter(m => m.category === activeCat);

  const startChat = (modeId?: string) => {
    if (!question.trim()) { setError('请描述你遇到的问题'); return; }
    const mode = modeId ? MODES.find(m => m.id === modeId) : null;
    const modeInstruction = mode ? `\n\n用户明确要求使用「${mode.name}」模式来回答这个问题。请严格按照该模式的框架步骤执行。` : '';
    const msgs: Message[] = [
      { role: 'system', content: QUICK_THINK_SYSTEM_PROMPT + modeInstruction },
      { role: 'user', content: question.trim() },
    ];
    setMessages([{ role: 'user', content: question.trim() }]);
    setShowChat(true);
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

  const sendFollowUp = () => {
    if (!question.trim() || isLoading) return;
    const userMsg = question.trim();
    const newMsgs = [...messages, { role: 'user', content: userMsg }];
    setMessages(newMsgs);
    setQuestion('');
    setIsLoading(true);
    const msgs: Message[] = [
      { role: 'system', content: QUICK_THINK_SYSTEM_PROMPT },
      ...newMsgs.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    ];
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

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  if (showChat) {
    return (
      <div className="flex flex-col" style={{ minHeight: 'calc(100dvh - 180px)' }}>
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => { setShowChat(false); setMessages([]); setQuestion(''); }}
            className="flex items-center gap-1.5 text-xs transition-colors hover:text-[#D4A853]" style={{ color: '#6A645C' }}>
            <ChevronRight size={12} className="rotate-180" /> 返回思考台
          </button>
          <span className="tag-amber">深度思考会话</span>
        </div>
        <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 pr-2 pb-4" style={{ maxHeight: 'calc(100dvh - 280px)' }}>
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
                        <Sparkles size={14} style={{ color: '#D4A853' }} />
                      </div>
                      <span className="text-xs font-medium" style={{ color: '#D4A853' }}>DeepThink 深度分析</span>
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
              <span className="text-sm" style={{ color: '#9B958D' }}>正在深度思考中</span>
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4A853] typing-dot" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4A853] typing-dot" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4A853] typing-dot" />
              </div>
            </motion.div>
          )}
          {error && (
            <div className="max-w-2xl mx-auto rounded-xl px-4 py-3 text-sm flex items-center gap-2" style={{ background: 'rgba(199,62,29,0.08)', border: '1px solid rgba(199,62,29,0.15)', color: '#C73E1D' }}>
              <X size={14} /> {error}
            </div>
          )}
        </div>
        <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(212,168,83,0.06)' }}>
          <div className="flex gap-2">
            <input value={question} onChange={(e) => setQuestion(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendFollowUp()}
              placeholder="继续追问或深入讨论..." className="input-glass flex-1 !py-3.5 !px-5" />
            <button onClick={sendFollowUp} disabled={isLoading || !question.trim()}
              className="btn-primary !px-5 !py-3.5" style={{ opacity: isLoading || !question.trim() ? 0.4 : 1 }}>
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center pt-6 pb-2">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-gradient-shift text-glow" style={{ fontFamily: "'Noto Serif SC', serif", letterSpacing: '-0.02em' }}>思考台</h1>
          <p className="text-base max-w-xl mx-auto leading-relaxed" style={{ color: '#9B958D' }}>
            79 种深度思考模式，一个问题进来，AI 自动诊断卡点，选出最合适的那把钥匙
          </p>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }} className="max-w-2xl mx-auto">
        <div className="card-glass p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(212,168,83,0.1)' }}>
              <Zap size={15} style={{ color: '#D4A853' }} />
            </div>
            <span className="text-sm font-medium" style={{ color: '#D4A853' }}>描述你的问题</span>
          </div>
          <textarea value={question} onChange={(e) => setQuestion(e.target.value)}
            placeholder="我在纠结要不要辞职创业... / 团队执行力差怎么办... / 产品定位不清晰..."
            className="input-glass mb-4" rows={4} />
          <div className="flex items-center justify-between">
            <span className="text-xs" style={{ color: '#4A453E' }}>
              {question.length > 0 ? `${question.length} 字` : 'AI 将自动选择最合适的思维模式'}
            </span>
            <button onClick={() => startChat()} disabled={!question.trim() || isLoading} className="btn-primary flex items-center gap-2">
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />} 开始深度思考
            </button>
          </div>
        </div>
      </motion.div>

      {error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto rounded-xl px-4 py-3 text-sm flex items-center gap-2" style={{ background: 'rgba(199,62,29,0.08)', border: '1px solid rgba(199,62,29,0.15)', color: '#C73E1D' }}>
          <X size={14} /> {error}
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex gap-2 flex-wrap justify-center">
        {CATEGORIES.map(tab => (
          <button key={tab.key} onClick={() => setActiveCat(tab.key)}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300"
            style={{ background: activeCat === tab.key ? 'rgba(212,168,83,0.08)' : 'transparent', color: activeCat === tab.key ? '#D4A853' : '#6A645C', border: `1px solid ${activeCat === tab.key ? 'rgba(212,168,83,0.15)' : 'rgba(212,168,83,0.04)'}` }}>
            {tab.label}<span className="ml-1.5 text-xs" style={{ color: activeCat === tab.key ? '#D4A853' : '#4A453E' }}>{tab.count}</span>
          </button>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((mode, i) => (
          <motion.button key={mode.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.02, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => { if (question.trim()) startChat(mode.id); else setQuestion(`请用${mode.name}分析：`); }}
            className="card-interactive card-glass p-5 text-left group">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${mode.color}10`, color: mode.color, border: `1px solid ${mode.color}20` }}>
                {getModeIcon(mode)}
              </div>
              {mode.tier === '1' && <span className="tag-amber text-[10px] !py-0.5 !px-2">核心</span>}
            </div>
            <h4 className="text-[15px] font-semibold mb-1.5" style={{ color: '#F0EBE3' }}>{mode.name}</h4>
            <p className="text-xs leading-relaxed mb-3" style={{ color: '#6A645C' }}>{mode.signals}</p>
            <div className="flex items-center justify-between">
              <span className="text-[11px]" style={{ color: mode.color, opacity: 0.7 }}>{mode.categoryCn}</span>
              <ChevronRight size={12} className="transition-transform duration-300 group-hover:translate-x-1" style={{ color: '#4A453E' }} />
            </div>
          </motion.button>
        ))}
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
        className="flex flex-wrap items-center justify-center gap-6 pt-4 pb-8 text-xs" style={{ color: '#4A453E' }}>
        <span className="flex items-center gap-1.5"><Zap size={11} /> {MODES.filter(m => m.category === 'model').length} 种思维模型</span>
        <span className="flex items-center gap-1.5"><User size={11} /> {MODES.filter(m => m.category === 'person').length} 位传奇人物</span>
        <span className="flex items-center gap-1.5"><BookOpen size={11} /> {MODES.filter(m => m.category === 'book').length} 本经典著作</span>
        <span className="flex items-center gap-1.5"><Brain size={11} /> AI 智能路由</span>
      </motion.div>
    </div>
  );
}
