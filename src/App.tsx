import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Key, Zap, Users, Github, ExternalLink, Sparkles } from 'lucide-react'
import ApiKeyModal from '@/components/ApiKeyModal'
import QuickThink from '@/pages/QuickThink'
import Boardroom from '@/pages/Boardroom'
import { getApiKey } from '@/lib/api'

type Mode = 'quick' | 'boardroom'

export default function App() {
  const [mode, setMode] = useState<Mode>('quick')
  const [showKeyModal, setShowKeyModal] = useState(false)
  const [hasKey, setHasKey] = useState(false)

  useEffect(() => {
    setHasKey(!!getApiKey())
  }, [showKeyModal])

  return (
    <div className="min-h-[100dvh] flex flex-col" style={{ background: '#0D0E0F', color: '#F0EBE0' }}>
      <header className="sticky top-0 z-50" style={{ background: 'rgba(13,14,15,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(212,168,83,0.06)' }}>
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(212,168,83,0.15)', border: '1px solid rgba(212,168,83,0.2)' }}>
              <Sparkles size={16} style={{ color: '#D4A853' }} />
            </div>
            <div>
              <h1 className="text-base font-semibold leading-tight" style={{ fontFamily: 'Noto Serif SC, serif', color: '#F0EBE0' }}>
                DeepThink
              </h1>
              <p className="text-[10px] leading-tight tracking-wider" style={{ color: '#4F5560', fontFamily: 'JetBrains Mono, monospace' }}>
                AI
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-xl p-1" style={{ background: '#141517', border: '1px solid #25282D' }}>
              <button onClick={() => setMode('quick')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all" style={{ background: mode === 'quick' ? 'rgba(212,168,83,0.15)' : 'transparent', color: mode === 'quick' ? '#D4A853' : '#4F5560' }}>
                <Zap size={13} /><span className="hidden sm:inline">快速思考</span>
              </button>
              <button onClick={() => setMode('boardroom')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all" style={{ background: mode === 'boardroom' ? 'rgba(212,168,83,0.15)' : 'transparent', color: mode === 'boardroom' ? '#D4A853' : '#4F5560' }}>
                <Users size={13} /><span className="hidden sm:inline">私董会</span>
              </button>
            </div>

            <button onClick={() => setShowKeyModal(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all" style={{ background: hasKey ? 'rgba(45,122,95,0.15)' : 'rgba(199,62,29,0.1)', color: hasKey ? '#4CAF8C' : '#C73E1D', border: `1px solid ${hasKey ? 'rgba(45,122,95,0.2)' : 'rgba(199,62,29,0.15)'}` }}>
              <Key size={12} /><span className="hidden sm:inline">{hasKey ? '已连接' : 'API Key'}</span>
            </button>

            <a href="https://github.com/marketleonai-del/deepthink" target="_blank" rel="noopener noreferrer" className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all" style={{ color: '#4F5560', border: '1px solid #25282D' }}>
              <Github size={13} /><span>GitHub</span>
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6">
        <AnimatePresence mode="wait">
          <motion.div key={mode} initial={{ opacity: 0, x: mode === 'quick' ? -20 : 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: mode === 'quick' ? 20 : -20 }} transition={{ duration: 0.3 }}>
            {mode === 'quick' ? <QuickThink /> : <Boardroom />}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer style={{ borderTop: '1px solid rgba(212,168,83,0.06)' }}>
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#4F5560]">
          <p>DeepThink AI &mdash; 深度思考路由器 + 12人AI私董会</p>
          <div className="flex items-center gap-4">
            <a href="https://github.com/marketleonai-del/deepthink" target="_blank" rel="noopener noreferrer" className="hover:text-[#D4A853] transition-colors flex items-center gap-1"><Github size={12} /> Star</a>
            <a href="https://platform.deepseek.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#D4A853] transition-colors flex items-center gap-1"><ExternalLink size={12} /> DeepSeek</a>
          </div>
        </div>
      </footer>

      <ApiKeyModal open={showKeyModal} onClose={() => setShowKeyModal(false)} />
    </div>
  )
}
