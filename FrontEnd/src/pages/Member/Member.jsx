import React, { useState } from 'react';

const GalleryItem = ({ title, serial, imageUrl }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`relative bg-main border transition-all duration-300 p-4 flex flex-col h-full group
        ${isHovered ? 'border-primary shadow-stark-glow' : 'border-border-primary/30 shadow-sm'}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Tactical Status Tag (Visible on Hover) */}
      <div className={`absolute top-2 right-2 px-2 py-0.5 text-[8px] font-black uppercase tracking-widest transition-opacity duration-300 ${isHovered ? 'opacity-100 bg-primary text-white' : 'opacity-0'}`}>
        Selected
      </div>

      {/* Image Container */}
      <div className="aspect-square bg-primary/5 mb-4 overflow-hidden relative">
        <img 
          src={imageUrl} 
          alt={title} 
          className={`w-full h-full object-cover transition-all duration-500 ${isHovered ? 'scale-110 grayscale-0' : 'grayscale brightness-95'}`}
        />
        {/* Holographic Overlay on Hover */}
        <div className={`absolute inset-0 bg-primary/5 pointer-events-none transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}></div>
      </div>

      {/* Info Section */}
      <div className="flex-1">
        <h3 className={`text-lg font-black italic tracking-tighter uppercase transition-colors duration-300 ${isHovered ? 'text-primary' : 'text-text-main'}`}>
          {title.replace(/_/g, ' ')}
        </h3>
        <p className="text-[10px] text-text-main/60 font-bold tracking-widest mt-1">SN: {serial}</p>
      </div>

      {/* Action Button */}
      <button 
        className={`mt-6 w-full py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 border
          ${isHovered 
            ? 'bg-primary border-primary text-white dark:shadow-lg dark:shadow-primary/20' 
            : 'bg-transparent border-border-primary/30 text-text-main/50 hover:border-primary hover:text-primary'}
        `}
      >
        View Details
      </button>

      {/* Decorative HUD Marker (Hover Only) */}
      <div className={`absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 border-primary transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}></div>
    </div>
  );
};

export default function Member() {
  const [activeTab, setActiveTab] = useState('MERKI');

  const assets = [ //이거 나중에 title = 캐 이름 / serial = 캐 고유번호 / type = 포지션임
    { title: "MK-85_PROTOTYPE", serial: "4492-9901-X", type: "MERKI" },
    { title: "NEURO_FILAMENT_B", serial: "1022-5561-N", type: "MAEBAM" },
    { title: "LASER_CUT_MOD_4", serial: "0092-2110-L", type: "HASHA" },
    { title: "DATA_CRYSTAL_NODE", serial: "8821-4432-P", type: "MERKI" },
    { title: "THERMO_STABILIZER", serial: "3390-1128-Q", type: "HASHA" },
    { title: "QUANTUM_CO_PROC", serial: "7711-3001-Z", type: "MAEBAM" },
    { title: "AUTO_DISPENSER_X", serial: "6632-1110-W", type: "HASHA" },
    { title: "NEURAL_LINK_V3", serial: "1109-2281-K", type: "MERKI" },
    { title: "KINETIC_BARRIER", serial: "5544-3321-S", type: "HASHA" },
    { title: "BIOTIC_LATTICE", serial: "9900-1122-M", type: "MAEBAM" },
  ];

  return (
    <div className="min-h-screen bg-main text-text-main font-mono p-10 selection:bg-primary/20 selection:text-primary">
      {/* Background Grid Accent */}
      <div className="fixed inset-0 pointer-events-none bg-stark-grid opacity-100" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        {/* Unified Tab Navigation */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 border-b-2 border-border-primary/20 pb-6">
          <div className="flex gap-12">
            {['MERKI', 'MAEBAM', 'HASHA'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative py-2 text-xs font-black tracking-[0.3em] uppercase transition-all
                  ${activeTab === tab ? 'text-primary' : 'text-text-main/40 hover:text-text-main/80'}
                `}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute -bottom-[26px] left-0 w-full h-[2px] bg-primary"></span>
                )}
                <span className="absolute -top-4 left-0 text-[8px] opacity-40">0{['MERKI', 'MAEBAM', 'HASHA'].indexOf(tab) + 2}</span>
              </button>
            ))}
          </div>
          
          <div className="mt-6 md:mt-0 flex items-center gap-4 text-[10px] font-bold text-text-main/40">
            <span className="tracking-widest italic uppercase">Access_Level: Security_04</span>
            <div className="flex gap-1 items-center">
              <div className="w-1 h-1 bg-primary rounded-full animate-pulse"></div>
              <div className="w-1 h-1 bg-primary/30 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* 5-Column Asset Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {assets.map((asset, index) => (
            <GalleryItem 
              key={index}
              title={asset.title}
              serial={asset.serial}
              imageUrl={``}
            />
          ))}
        </div>

        {/* Tactical Footer Log */}
        <footer className="mt-20 pt-8 border-t border-border-primary/20 flex justify-between items-center text-[9px] font-bold text-text-main/40 uppercase tracking-widest">
          <div className="flex gap-8">
            <p>ASCENSION TOWER : v2.4.0</p>
            <p>Sync_Status: Optimized</p>
          </div>
          <div className="flex gap-4">
            <span>Server: **_WEST_04</span>
            <span>Auth_Token: Valid // 14:02_C</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

