import React from 'react';

const BlackjackGame = () => {
  return (
    <div className="min-h-screen bg-[#05080a] flex items-center justify-center font-mono overflow-hidden relative">
      {/* Background HUD elements */}
      <div className="absolute top-10 left-10 w-48 h-48 border border-cyan-900/30 rounded-full animate-spin-slow"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-cyan-400/5 rounded-full"></div>

      <div className="relative z-10 w-full max-w-4xl p-8 border border-cyan-500/20 bg-black/80 backdrop-blur-xl">
        <div className="flex justify-between items-start mb-12">
          <div className="space-y-1">
            <span className="bg-cyan-400 text-black px-2 py-0.5 text-[10px] font-bold">ACTIVE_SESSION</span>
            <h1 className="text-cyan-100 text-2xl font-black tracking-widest mt-2 uppercase">Protocol Blackjack-21</h1>
          </div>
          <div className="text-right text-cyan-400">
            <p className="text-[10px] opacity-60 uppercase tracking-[0.2em]">Dealer Status</p>
            <p className="font-bold text-lg animate-pulse">JARVIS_ONLINE</p>
          </div>
        </div>

        {/* Game Area */}
        <div className="flex flex-col items-center gap-12 mb-16">
          {/* Dealer's Cards */}
          <div className="flex gap-4">
            <div className="w-24 h-36 bg-cyan-900/10 border-2 border-cyan-500/30 rounded flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.1)]">
              <span className="text-cyan-500 text-3xl font-black italic">?</span>
            </div>
            <div className="w-24 h-36 bg-black border-2 border-cyan-400 rounded flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
              <span className="text-2xl font-black italic">A</span>
            </div>
          </div>

          <div className="text-cyan-900 text-xs tracking-[1em] font-black italic">VS_INTERFACES</div>

          {/* Player's Cards */}
          <div className="flex gap-4">
            <div className="w-24 h-36 bg-black border-2 border-cyan-400 rounded flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
              <span className="text-2xl font-black italic">10</span>
            </div>
            <div className="w-24 h-36 bg-black border-2 border-cyan-400 rounded flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
              <span className="text-2xl font-black italic">K</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-4 gap-4">
          {['hit', 'stand', 'double', 'surrender'].map((action) => (
            <button key={action} className="group relative py-4 border border-cyan-500/50 hover:border-cyan-400 transition-all overflow-hidden">
              <div className="absolute inset-0 bg-cyan-400 opacity-0 group-hover:opacity-10 transition-opacity"></div>
              <span className="relative z-10 text-cyan-400 font-black text-xs uppercase tracking-widest">{action}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlackjackGame;
