import { useState, useEffect } from 'react';
import { Key, Eye, EyeOff, X, Check } from 'lucide-react';
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
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.7)' }} onClick={onClose}>
          <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }} transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full max-w-md rounded-2xl p-6 relative"
            style={{ background: '#1C1E21', border: '1px solid rgba(212,168,83,0.15)' }}
            onClick={(e) => e.stopPropagation()}>
            <button onClick={onClose} className="absolute top-4 right-4 text-[#4F5560] hover:text-[#F0EBE0] transition-colors">
              <X size={20} />
            </button>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(212,168,83,0.15)' }}>
                <Key size={20} style={{ color: '#D4A853' }} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#F0EBE0]">设置 DeepSeek API Key</h3>
                <p className="text-xs text-[#4F5560]">Key 仅保存在你的浏览器本地</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-[#D8D0C4] mb-2">DeepSeek API Key</label>
                <div className="relative">
                  <input type={show ? 'text' : 'password'} value={key}
                    onChange={(e) => setKey(e.target.value)} placeholder="sk-..."
                    className="w-full rounded-xl px-4 py-3 pr-12 text-sm outline-none transition-all"
                    style={{ background: '#141517', border: '1px solid #3A3F47', color: '#F0EBE0' }}
                    onFocus={(e) => { e.target.style.borderColor = '#D4A853'; }}
                    onBlur={(e) => { e.target.style.borderColor = '#3A3F47'; }} />
                  <button onClick={() => setShow(!show)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4F5560] hover:text-[#F0EBE0]">
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="text-xs text-[#4F5560] leading-relaxed space-y-1">
                <p>1. 前往 <a href="https://platform.deepseek.com" target="_blank" rel="noopener noreferrer" className="text-[#D4A853] hover:underline">platform.deepseek.com</a> 注册账号</p>
                <p>2. 创建 API Key 并粘贴到这里</p>
                <p>3. API Key 仅保存在本地浏览器，不会上传到任何服务器</p>
              </div>
              <div className="flex gap-3">
                <button onClick={handleSave} disabled={!key.trim() || saved}
                  className="flex-1 rounded-xl py-3 text-sm font-semibold transition-all flex items-center justify-center gap-2"
                  style={{ background: saved ? '#2D7A5F' : '#D4A853', color: saved ? '#F0EBE0' : '#0D0E0F', opacity: !key.trim() ? 0.5 : 1 }}>
                  {saved ? <><Check size={16} /> 已保存</> : '保存'}
                </button>
                {getApiKey() && (
                  <button onClick={handleClear}
                    className="px-4 rounded-xl text-sm transition-all"
                    style={{ background: '#25282D', color: '#C73E1D', border: '1px solid #3A3F47' }}>
                    清除
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
