import React from 'react';
import { useTheme } from '../ThemeProvider/ThemeProvider';

const CommonModal = ({ 
  isOpen, 
  onClose, 
  title = "SYSTEM_NOTIFICATION", 
  status = "ACTION_CONFIRMED", 
  headline = "DATA_SYNC_COMPLETE",
  moduleId = "LAB-OS_V2.2.0",
  timestamp = "14:22:09:44",
  children 
}) => {
  const { isDark } = useTheme();

  if (!isOpen) return null;

  // 테마별 색상 정의
  const theme = {
    overlay: isDark ? 'bg-slate-950/80' : 'bg-slate-900/40',
    container: isDark ? 'bg-main border-slate-700' : 'bg-main border-blue-200',
    textMain: isDark ? 'text-white' : 'text-slate-900',
    textSub: isDark ? 'text-slate-400' : 'text-slate-500',
    gridBg: isDark ? 'opacity-[0.05]' : 'opacity-[0.03]',
    metaBox: isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50/50 border-slate-100',
    footerBorder: isDark ? 'border-slate-800' : 'border-slate-50'
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-['Space_Grotesk',sans-serif]">
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 ${theme.overlay} backdrop-blur-sm transition-opacity`} 
        onClick={onClose}
      />

      {/* Main Module Container */}
      <div 
        className={`relative w-full max-w-6xl ${theme.container} border shadow-[0_0_15px_var(--color-primary)] overflow-hidden animate-in fade-in zoom-in duration-300`}
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Subtle Background Grid Pattern */}
        <div className={`absolute inset-0 ${theme.gridBg} pointer-events-none`} 
             style={{ backgroundImage: 'linear-gradient(#2563eb 1px, transparent 1px), linear-gradient(90deg, #2563eb 1px, transparent 1px)', backgroundSize: '20px 20px' }} 
        />

        {/* Tactical Header Bar */}
        <div className="relative z-10 flex justify-between items-center px-6 py-3 bg-primary text-white">
          <div className="flex items-center gap-3">
            <div className="flex gap-0.5">
              <div className="w-1 h-3 bg-white/40"></div>
              <div className="w-1 h-3 bg-white"></div>
              <div className="w-1 h-3 bg-white/40"></div>
            </div>
            <span className="text-[11px] font-black tracking-[0.3em] uppercase">{title}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-white/40 rounded-full animate-pulse"></div>
              <div className="w-1 h-1 bg-white rounded-full"></div>
            </div>
            <button 
              onClick={onClose}
              className="hover:rotate-90 transition-transform duration-200 opacity-80 hover:opacity-100"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="relative z-10 p-8 md:p-10">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-primar"></div>
              <span className="text-[10px] font-bold text-primar tracking-widest uppercase">{status}</span>
            </div>
            <h2 className={`text-3xl md:text-4xl font-black italic ${theme.textMain} tracking-tighter leading-none border-b-2 ${isDark ? 'border-white/5' : 'border-slate-900/5'} pb-4`}>
              {headline}
            </h2>
          </div>

          {/* Children: 실제 모달에 들어갈 내용 */}
          <div className={`${theme.textSub} text-sm leading-relaxed mb-8`}>
            {children}
          </div>

          {/* Tactical Metadata Grid */}
          <div className={`grid grid-cols-2 border ${theme.metaBox} mb-8`}>
            <div className={`p-4 border-r ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">MODULE_ID</p>
              <p className={`text-xs font-black ${theme.textMain}`}>{moduleId}</p>
            </div>
            <div className="p-4">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">TIMESTAMP</p>
              <p className={`text-xs font-black ${theme.textMain}`}>{timestamp}</p>
            </div>
          </div>


        </div>

        {/* Footer HUD Markers */}
        <div className={`px-6 py-4 border-t ${theme.footerBorder} flex justify-between items-center text-[8px] font-bold text-slate-400 uppercase tracking-widest`}>
          <div className="flex gap-4">
            <span>SECURE_HANDSHAKE: <span className="text-blue-500">ACTIVE</span></span>
            <span>ENCRYPTION: 256-AES</span>
          </div>
          <span>UNIT: ALPHA-7</span>
        </div>

        {/* Decorative HUD Corner */}
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primar"></div>
      </div>
    </div>
  );
};

export default CommonModal;