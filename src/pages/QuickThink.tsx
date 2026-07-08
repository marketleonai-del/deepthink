import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, Sparkles, Zap, User, BookOpen, X, ChevronRight } from 'lucide-react';
import { MODES } from '@/lib/data';
import { streamKimiAPI } from '@/lib/api';
import { QUICK_THINK_SYSTEM_PROMPT } from '@/lib/prompts';
import type { Message } from '@/lib/api';
import ReactMarkdown from 'react-markdown';

const CATEGORY_TABS = [
  { key: 'all', label: '全部', count: MODES.length },
  { key: 'model', label: '思维模型', count: MODES.filter(m => m.category === 'model').length },
  { key: 'person', label: '人物', count: MODES.filter(m => m.category === 'person').length },
  { key: 'book', label: '书籍', count: MODES.filter(m => m.category === 'book').length },
];

export default function QuickThink() {
  const [activeCat, setActiveCat] = useState('all');
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<{role: string; content: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showChat, setShowChat] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const filteredModes = activeCat === 'all' ? MODES : MODES.filter(m => m.category === activeCat);

  const startChat = (modeId?: string) => {
    if (!question.trim()) { setError('请输入你的问题'); return; }

    const mode = modeId ? MODES.find(m => m.id === modeId) : selectedMode ? MODES.find(m => m.id === selectedMode) : null;
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
    const abort = streamKimiAPI(
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

    return () => abort();
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

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const getModeColor = (mode: typeof MODES[0]) => {
    if (mode.category === 'person') return mode.color;
    if (mode.category === 'book') return mode.color;
    return mode.tier === '1' ? '#D4A853' : '#4CAF8C';
  };

  if (showChat) {
    return (
      <div className="flex flex-col h-[calc(100vh-180px)]">
        <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 pr-2 pb-4">
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === 'user' ? 'rounded-br-md' : 'rounded-bl-md'}`}
                  style={msg.role === 'user'
                    ? { background: 'rgba(212,168,83,0.15)', color: '#F0EBE0', border: '1px solid rgba(212,168,83,0.2)' }
                    : { background: '#1C1E21', color: '#D8D0C4', border: '1px solid #25282D' }}>
                  {msg.role === 'assistant' ? (
                    <div className="markdown-body"><ReactMarkdown>{msg.content}</ReactMarkdown></div>
                  ) : (<p>{msg.content}</p>)}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && messages[messages.length - 1]?.role === 'user' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-[#4F5560] text-sm">
              <Loader2 size={14} className="animate-spin" />
              <span>深度思考中...</span>
              <div className="flex gap-1 ml-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4A853] typing-dot" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4A853] typing-dot" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4A853] typing-dot" />
              </div>
            </motion.div>
          )}

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-[#C73E1D] bg-[#C73E1D]/10 rounded-xl px-4 py-3 border border-[#C73E1D]/20">
              {error}
            </motion.div>
          )}
        </div>

        <div className="pt-4 border-t border-[#25282D]">
          <div className="flex gap-2">
            <input value={question} onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendFollowUp()}
              placeholder="追问或继续讨论..."
              className="flex-1 rounded-xl px-4 py-3 text-sm outline-none transition-all"
              style={{ background: '#141517', border: '1px solid #3A3F47', color: '#F0EBE0' }}
              onFocus={(e) => { e.target.style.borderColor = '#D4A853'; }}
              onBlur={(e) => { e.target.style.borderColor = '#3A3F47'; }} />
            <button onClick={sendFollowUp} disabled={isLoading || !question.trim()}
              className="rounded-xl px-4 py-3 transition-all flex items-center gap-2"
              style={{ background: question.trim() ? '#D4A853' : '#25282D', color: question.trim() ? '#0D0E0F' : '#4F5560', opacity: isLoading ? 0.5 : 1 }}>
              <Send size={16} />
            </button>
          </div>
          <button onClick={() => { setShowChat(false); setMessages([]); setQuestion(''); }}
            className="mt-2 text-xs text-[#4F5560] hover:text-[#D4A853] transition-colors flex items-center gap-1">
            <X size={12} /> 结束对话，选择新模式
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gradient" style={{ fontFamily: 'Noto Serif SC, serif' }}>快速思考</h2>
        <p className="text-sm text-[#4F5560]">79种思维模式 + 人物智慧 + 书籍框架，AI自动路由最适合的思考工具</p>
      </div>

      <div className="relative">
        <textarea value={question} onChange={(e) => setQuestion(e.target.value)}
          placeholder="描述你当前遇到的问题或困惑，AI会自动选择最合适的思维模式进行深度分析..."
          className="w-full rounded-2xl p-4 pr-14 text-sm outline-none resize-none transition-all"
          style={{ background: '#141517', border: '1px solid #3A3F47', color: '#F0EBE0', minHeight: '100px' }}
          onFocus={(e) => { e.target.style.borderColor = '#D4A853'; }}
          onBlur={(e) => { e.target.style.borderColor = '#3A3F47'; }} />
        <button onClick={() => startChat()} disabled={isLoading || !question.trim()}
          className="absolute bottom-4 right-4 w-9 h-9 rounded-lg flex items-center justify-center transition-all"
          style={{ background: question.trim() ? '#D4A853' : '#25282D', color: question.trim() ? '#0D0E0F' : '#4F5560' }}>
          {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
        </button>
      </div>

      {error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-[#C73E1D] bg-[#C73E1D]/10 rounded-xl px-4 py-3 border border-[#C73E1D]/20">
          {error}
        </motion.div>
      )}

      <div className="flex gap-2 flex-wrap">
        {CATEGORY_TABS.map(tab => (
          <button key={tab.key} onClick={() => setActiveCat(tab.key)}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={{ background: activeCat === tab.key ? 'rgba(212,168,83,0.15)' : 'transparent', color: activeCat === tab.key ? '#D4A853' : '#4F5560', border: `1px solid ${activeCat === tab.key ? 'rgba(212,168,83,0.3)' : '#25282D'}` }}>
            {tab.label}<span className="ml-1 text-xs opacity-60">{tab.count}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {filteredModes.map((mode, i) => {
          const color = getModeColor(mode);
          const Icon = mode.category === 'person' ? User : mode.category === 'book' ? BookOpen : Zap;
          return (
            <motion.button key={mode.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03, duration: 0.3 }}
              onClick={() => { if (question.trim()) { setSelectedMode(mode.id); startChat(mode.id); } else { setQuestion(`请用${mode.name}分析：`); } }}
              className="group text-left rounded-xl p-4 transition-all card-hover"
              style={{ background: '#1C1E21', border: `1px solid ${selectedMode === mode.id ? `${color}40` : '#25282D'}` }}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${color}15` }}>
                  <Icon size={14} style={{ color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-[#F0EBE0] truncate">{mode.name}</h4>
                </div>
                {mode.tier === '1' && <Sparkles size={12} style={{ color: '#D4A853' }} />}
              </div>
              <p className="text-xs text-[#4F5560] line-clamp-2 leading-relaxed">{mode.signals}</p>
              <div className="mt-2 flex items-center gap-1 text-xs" style={{ color }}>
                <span className="opacity-60">{mode.categoryCn}</span>
                <ChevronRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
