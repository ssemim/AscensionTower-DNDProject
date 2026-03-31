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
  useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-one-store-mobile-gothic-body">

      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Main Modal Container — mirrors VortexLayout main console */}
      <div
        className="relative w-full max-w-6xl bg-main border border-primary rounded-xl shadow-[0_0_20px_var(--color-primary-glow)] overflow-hidden animate-in fade-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >

        {/* 1. CRT Scanlines */}
        <div className="absolute inset-0 pointer-events-none z-50 opacity-[0.07] bg-[linear-gradient(to_bottom,var(--color-primary)_50%,transparent_50%)] bg-[length:100%_4px]" />

        {/* 2. Grid Background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: 'linear-gradient(to right, var(--color-primary-faint, rgba(57,255,20,0.05)) 2px, transparent 2px), linear-gradient(to bottom, var(--color-primary-faint, rgba(57,255,20,0.05)) 2px, transparent 2px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* 3. Corner Accents */}
        <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-primary z-10" />
        <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-primary z-10" />
        <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-primary z-10" />
        <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-primary z-10" />

        {/* Header */}
        <header className="relative z-10 flex justify-between items-end border-b border-primary/50 px-6 py-4 shrink-0 font-nexon-warhaven">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full border-2 border-primary flex items-center justify-center bg-black shadow-[0_0_15px_var(--color-primary-glow)]">
              <span className="text-primary text-xs font-black animate-pulse">●</span>
            </div>
            <div>
              <h1 className="text-2xl  tracking-widest text-primary [text-shadow:0_0_8px_var(--color-primary-glow)]">
                {title}
              </h1>
              <p className="text-[10px] text-primary/40 tracking-[0.4em] uppercase font-bold">
                Visual Operations Terminal
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-[10px] text-primary/60 flex items-center gap-2">
              SYSTEM ONLINE
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_5px_var(--color-primary-glow)]" />
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 border border-primary/30 hover:border-primary hover:bg-primary/10 flex items-center justify-center text-primary hover:shadow-[0_0_8px_var(--color-primary-glow)] transition-all duration-200"
            >
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="relative z-10 p-8 md:p-10">

          {/* Status + Headline */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-primary animate-pulse shadow-[0_0_6px_var(--color-primary-glow)]" />
              <span className="text-[10px] font-black text-primary tracking-[0.5em] uppercase animate-pulse">
                {status}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black italic text-primary tracking-tighter leading-none border-b border-primary/20 pb-4 [text-shadow:0_0_8px_var(--color-primary-glow)]">
              {headline}
            </h2>
          </div>

          {/* Children */}
          <div className="text-primary/70 text-sm leading-relaxed mb-8">
            {children}
          </div>

          {/* Metadata Grid */}
          <div className="bg-primary border border-primary/30 rounded p-4 grid grid-cols-2 divide-x divide-primary/20 mb-2 font-nexon-warhaven">
            <div className="pr-4">
              <p className="text-sm font-bold text-border-main uppercase tracking-widest mb-1">POSITION</p>
              <p className="text-sm text-white">{moduleId}</p>
            </div>
            <div className="pl-4">
              <p className="text-sm font-bold text-border-main uppercase tracking-widest mb-1">AGE</p>
              <p className="text-sm text-white">{timestamp}</p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <footer className="relative z-10 px-6 py-3 border-t border-primary/30 flex justify-between items-center text-[8px] font-bold text-primary/50 uppercase tracking-[0.3em]">
          <span>SECURE_HANDSHAKE: <span className="text-primary">ACTIVE</span> // ENCRYPTION: 256-AES</span>
          <span>UNIT: ALPHA-7</span>
        </footer>

      </div>
    </div>
  );
};

export default CommonModal;