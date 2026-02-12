import React from 'react';

const ChronologySection = () => {
  const events = [
    { date: "2140.001", title: "THE COLLAPSE", desc: "System-wide critical failure. Global hegemony terminated.", side: "left" },
    { date: "2212.045", title: "VOID_MATTER_SIG", desc: "New energy signature detected. Sub-atomic rift harvesting operational.", side: "right" },
    { date: "2305.881", title: "INTERSTELLAR_CONFLICT", desc: "Resource wars across sector 4. High-yield tactical strikes.", side: "left" },
  ];

  return (
    <section className="bg-[#0a0f1a] text-cyan-400 py-20 px-10 font-mono relative overflow-hidden">
      {/* Background Grid Effect */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#1e3a8a 1px, transparent 1px), linear-gradient(90deg, #1e3a8a 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.3em] uppercase opacity-60 mb-2">// SYSTEM_HISTORY_LOG</p>
          <h2 className="text-6xl font-black italic tracking-tighter text-white drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]">
            CHRONOLOGY
          </h2>
        </div>

        {/* Vertical Line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-[1px] h-full bg-cyan-900/50 top-40 hidden md:block"></div>

        <div className="space-y-24">
          {events.map((event, index) => (
            <div key={index} className={`flex flex-col md:flex-row items-center ${event.side === 'right' ? 'md:flex-row-reverse' : ''}`}>
              {/* Content Box */}
              <div className="w-full md:w-1/2 p-6 border border-cyan-500/30 bg-black/40 backdrop-blur-md relative group hover:border-cyan-400 transition-all">
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-400"></div>
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-400"></div>
                
                <span className="text-[10px] text-cyan-500/70 tracking-widest">DATE_REF: {event.date}</span>
                <h3 className="text-xl font-bold mt-1 mb-2 text-white">{event.title}</h3>
                <p className="text-sm text-cyan-200/60 leading-relaxed">{event.desc}</p>
              </div>

              {/* Center Icon (Hologram Node) */}
              <div className="relative mx-8 my-6 md:my-0">
                <div className="w-10 h-10 border border-cyan-500 rotate-45 flex items-center justify-center bg-[#0a0f1a] shadow-[0_0_20px_rgba(34,211,238,0.4)]">
                  <div className="w-2 h-2 bg-cyan-400 rotate-0 animate-pulse"></div>
                </div>
              </div>

              <div className="w-full md:w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ChronologySection;