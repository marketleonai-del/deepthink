import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Key, Zap, Users, Github, Sparkles, Globe } from 'lucide-react'
import Bg3d from '@/components/Bg3d'
import ApiKeyModal from '@/components/ApiKeyModal'
import QuickThink from '@/pages/QuickThink'
import Boardroom from '@/pages/Boardroom'
import { getApiKey } from '@/lib/api'

type Mode = 'quick' | 'boardroom'

export default function App() {
  const [mode, setMode] = useState<Mode>('quick')
  const [showKeyModal, setShowKeyModal] = useState(false)
  const [hasKey, setHasKey] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    setHasKey(!!getApiKey())
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div style={{ background: '#0B0C0E', color: '#F0EBE3', minHeight: '100dvh', fontFamily: "'Noto Sans SC', sans-serif" }}>
      <Bg3d />
      <div className="vignette" />
      <div className="grain" />

      <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{ background: scrolled ? 'rgba(11,12,14,0.85)' : 'transparent', backdropFilter: scrolled ? 'blur(20px) saturate(1.2)' : 'none', borderBottom: scrolled ? '1px solid rgba(212,168,83,0.06)' : '1px solid transparent' }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => setMode('quick')} className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300"
              style={{ background: 'linear-gradient(135deg, rgba(212,168,83,0.15), rgba(212,168,83,0.05))', border: '1px solid rgba(212,168,83,0.15)' }}>
              <Sparkles size={17} style={{ color: '#D4A853' }} />
            </div>
            <div className="flex flex-col">
              <span className="text-[15px] font-semibold tracking-wide" style={{ fontFamily: "'Noto Serif SC', serif", color: '#F0EBE3' }}>DeepThink</span>
              <span className="text-[9px] tracking-[0.2em]" style={{ color: '#4A453E', fontFamily: "'JetBrains Mono', monospace" }}>AI</span>
            </div>
          </button>

          <div className="hidden sm:flex items-center gap-1 rounded-xl p-1" style={{ background: 'rgba(20,21,25,0.6)', border: '1px solid rgba(212,168,83,0.06)' }}>
            <TabButton active={mode === 'quick'} onClick={() => setMode('quick')} icon={<Zap size={14} />} label="思考台" />
            <TabButton active={mode === 'boardroom'} onClick={() => setMode('boardroom')} icon={<Users size={14} />} label="私董会" />
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => setShowKeyModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300"
              style={{ background: hasKey ? 'rgba(45,122,95,0.1)' : 'rgba(199,62,29,0.08)', color: hasKey ? '#4CAF8C' : '#C73E1D', border: `1px solid ${hasKey ? 'rgba(45,122,95,0.15)' : 'rgba(199,62,29,0.12)'}` }}>
              <Key size={12} /><span className="hidden sm:inline">{hasKey ? '已连接' : 'API Key'}</span>
            </button>
            <a href="https://github.com/marketleonai-del/deepthink" target="_blank" rel="noopener noreferrer" className="btn-icon hidden sm:flex" style={{ width: 36, height: 36 }}>
              <Github size={15} />
            </a>
          </div>
        </div>
      </nav>

      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center gap-1 p-2"
        style={{ background: 'rgba(11,12,14,0.9)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(212,168,83,0.06)' }}>
        <TabButton active={mode === 'quick'} onClick={() => setMode('quick')} icon={<Zap size={15} />} label="思考台" />
        <TabButton active={mode === 'boardroom'} onClick={() => setMode('boardroom')} icon={<Users size={15} />} label="私董会" />
      </div>

      <main className="relative z-10 pt-20 pb-24 sm:pb-8">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatePresence mode="wait">
            <motion.div key={mode} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
              {mode === 'quick' ? <QuickThink /> : <Boardroom />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <footer className="relative z-10" style={{ borderTop: '1px solid rgba(212,168,83,0.04)' }}>
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs" style={{ color: '#4A453E' }}>
          <p>DeepThink AI &mdash; 深度思考，从今天开始</p>
          <div className="flex items-center gap-4">
            <a href="https://github.com/marketleonai-del/deepthink" target="_blank" rel="noopener noreferrer" className="hover:text-[#D4A853] transition-colors flex items-center gap-1"><Github size={11} /> GitHub</a>
            <a href="https://platform.deepseek.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#D4A853] transition-colors flex items-center gap-1"><Globe size={11} /> DeepSeek</a>
          </div>
        </div>
      </footer>

      <ApiKeyModal open={showKeyModal} onClose={() => setShowKeyModal(false)} />
    </div>
  )
}

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button onClick={onClick} className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-all duration-300"
      style={{ background: active ? 'rgba(212,168,83,0.1)' : 'transparent', color: active ? '#D4A853' : '#6A645C', border: active ? '1px solid rgba(212,168,83,0.15)' : '1px solid transparent' }}>
      {icon}{label}
    </button>
  )
}
