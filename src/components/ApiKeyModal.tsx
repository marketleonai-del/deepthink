import { useState, useEffect } from 'react';
import { Key, Eye, EyeOff, X, Check, Globe } from 'lucide-react';
import { getApiKey, setApiKey, removeApiKey } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

export default function ApiKeyModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [key, setKey] = useState('');
  const [show, setShow] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const existing = getApiKey();
    if (existing) setKey(existing);
  }, [open]);

  const handleSave = () => {
    if (key.trim()) {
      setApiKey(key.trim());
      setSaved(true);
      setTimeout(() => { setSaved(false); onClose(); }, 800);
    }
  };

  const handleClear = () => {
    removeApiKey();
    setKey('');
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="modal-backdrop" onClick={onClose}>
          <motion.div initial={{ scale: 0.92, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }} transition={{ type: 'spring', damping: 28, stiffness: 350 }}
            className="modal-card" onClick={(e) => e.stopPropagation()}>

            <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center transition-all"
              style={{ color: '#4A453E' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#F0EBE3'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#4A453E'; e.currentTarget.style.background = 'transparent'; }}>
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, rgba(212,168,83,0.15), rgba(212,168,83,0.05))', border: '1px solid rgba(212,168,83,0.15)' }}>
                <Key size={20} style={{ color: '#D4A853' }} />
              </div>
              <div>
                <h3 className="text-lg font-semibold" style={{ color: '#F0EBE3', fontFamily: "'Noto Serif SC', serif" }}>API Key 设置</h3>
                <p className="text-xs mt-0.5" style={{ color: '#6A645C' }}>连接到 DeepSeek AI 引擎</p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-medium mb-2" style={{ color: '#9B958D' }}>DeepSeek API Key</label>
                <div className="relative">
                  <input type={show ? 'text' : 'password'} value={key} onChange={(e) => setKey(e.target.value)}
                    placeholder="sk-..." className="input-glass !pr-12"
                    style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px' }} />
                  <button onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors hover:text-[#D4A853]" style={{ color: '#4A453E' }}>
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-xs leading-relaxed" style={{ color: '#6A645C' }}>
                <div className="flex items-start gap-2">
                  <span className="mt-0.5" style={{ color: '#D4A853' }}>1.</span>
                  <span>前往 <a href="https://platform.deepseek.com" target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:underline" style={{ color: '#D4A853' }}>platform.deepseek.com</a> 注册</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-0.5" style={{ color: '#D4A853' }}>2.</span>
                  <span>创建 API Key 并粘贴到上方</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-0.5" style={{ color: '#D4A853' }}>3.</span>
                  <span>Key 仅保存在浏览器本地，不上传服务器</span>
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                <button onClick={handleSave} disabled={!key.trim() || saved}
                  className="btn-primary flex-1 flex items-center justify-center gap-2" style={{ opacity: !key.trim() ? 0.4 : 1 }}>
                  {saved ? <><Check size={16} /> 已保存</> : <><Globe size={16} /> 连接 DeepSeek</>}
                </button>
                {getApiKey() && (
                  <button onClick={handleClear} className="btn-ghost" style={{ color: '#C73E1D', borderColor: 'rgba(199,62,29,0.12)' }}>清除</button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
