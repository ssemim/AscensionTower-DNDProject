import React, { useState } from 'react';

// 공통 UI 컴포넌트: HUD 스타일의 테두리 박스
const HUDBox = ({ children, className = "" }) => (
  <div className={`relative border border-primary/20 bg-slate-200/10 dark:bg-black/40 backdrop-blur-md ${className}`}>
    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary"></div>
    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary"></div>
    {children}
  </div>
);

const Shop = () => {
  // 인벤토리 아이템 데이터 (24개 슬롯)
  const [items] = useState([
    { id: 1, name: "PHASE_BLADE", type: "Weapon", rarity: "EPIC", stats: { ATK: 85, ENRG: 40, STB: 60 }, price: "12,500", desc: "Experimental energy edge utilizing concentrated arc particles." },
    { id: 2, name: "ION_SHIELD", type: "Armor", rarity: "RARE", stats: { ATK: 5, ENRG: 80, STB: 95 }, price: "8,200", desc: "Multi-layered kinetic barrier with automatic ion-refresh." },
    { id: 3, name: "CORE_CELL", type: "Utility", rarity: "COMMON", stats: { ATK: 0, ENRG: 100, STB: 20 }, price: "1,500", desc: "Standard Stark-grade power cell for industrial use." },
    // 나머지 슬롯을 위한 빈 데이터
    ...Array.from({ length: 21 }, (_, i) => ({ id: i + 4, isEmpty: true }))
  ]);

  const [selected, setSelected] = useState(items[0]);

  return (
    <div className="min-h-screen bg-main text-text-main font-mono p-4 md:p-8 relative overflow-hidden">
      {/* Background HUD Grid Layout */}
      <div className="absolute inset-0 opacity-[0.05] dark:opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(var(--color-primary) 1px, transparent 1px), linear-gradient(90deg, var(--color-primary) 1px, transparent 1px)', backgroundSize: '50px 50px' }}>
      </div>

      {/* Header HUD */}
      <header className="max-w-7xl mx-auto flex justify-between items-end mb-8 border-b border-primary/20 pb-4 relative z-10">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 border-2 border-primary rotate-45 flex items-center justify-center bg-primary/10 dark:bg-cyan-950/20 shadow-stark-glow">
            <span className="text-3xl font-black -rotate-45 text-text-main">S</span>
          </div>
          <div>
            <h1 className="text-4xl font-black italic tracking-tighter text-text-main uppercase drop-shadow-[0_0_10px_var(--color-primary-glow)]">Armory_Exchange</h1>
            <p className="text-[10px] text-primary/70 font-bold tracking-[0.4em] uppercase">Authorized Access Only // Sector_04</p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex gap-4 text-[9px] font-bold mb-2 opacity-50 uppercase">
            <span>Uplink_Secure</span>
            <span className="text-green-500">System_Nominal</span>
          </div>
          <div className="text-3xl font-black text-text-main italic tracking-widest">
            24,580 <span className="text-primary/80 text-sm italic">CR</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-12 gap-6 relative z-10">
        
        {/* Left: NPC & Dialogue (3 cols) */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">
          <HUDBox className="aspect-[4/5] overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
            {/* NPC Visual Placeholder */}
            <div className="h-full flex flex-col items-center justify-center p-8 text-center animate-pulse">
              <div className="w-32 h-32 border-2 border-primary rounded-full mb-6 flex items-center justify-center">
                <div className="w-24 h-24 border border-primary/30 rounded-full animate-spin-slow"></div>
              </div>
              <p className="text-[10px] font-black tracking-widest text-primary/60 opacity-60 uppercase mb-1">Unit_K3-V4</p>
              <h3 className="text-xl font-bold text-text-main tracking-widest uppercase italic">The_Merchant</h3>
            </div>
          </HUDBox>
          <HUDBox className="p-4 bg-main/60">
            <p className="text-[9px] font-bold text-primary/80 mb-2 uppercase tracking-tighter italic">// Incoming_Comms</p>
            <p className="text-[11px] leading-relaxed text-text-main/80 italic">
              "You have the credits, I have the prototypes. But remember, once a Phase Blade is linked, there's no going back."
            </p>
          </HUDBox>
        </div>

        {/* Center: Inventory Grid (5 cols) */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-4">
          <div className="flex justify-between items-center px-2">
            <nav className="flex gap-4 text-[10px] font-bold">
              <span className="text-text-main border-b border-primary pb-1 cursor-pointer uppercase">All</span>
              <span className="opacity-40 hover:opacity-100 cursor-pointer transition-opacity uppercase">Weapons</span>
              <span className="opacity-40 hover:opacity-100 cursor-pointer transition-opacity uppercase">Armor</span>
            </nav>
            <span className="text-[9px] opacity-30 italic font-bold">GRID_COORD: 4X6_INV</span>
          </div>
          <div className="grid grid-cols-4 gap-2 bg-primary/5 p-4 border border-primary/30">
            {items.map((item) => (
              <div
                key={item.id}
                onClick={() => !item.isEmpty && setSelected(item)}
                className={`
                  aspect-square border flex flex-col items-center justify-center relative transition-all cursor-pointer group
                  ${item.isEmpty 
                    ? 'border-primary/20 bg-main/40 opacity-30' 
                    : 'border-primary/70 bg-primary/10 hover:border-primary hover:shadow-stark-glow'}
                  ${selected?.id === item.id ? 'border-primary bg-primary/30 ring-1 ring-primary' : ''}
                `}
              >
                {!item.isEmpty && (
                  <>
                    <div className="w-10 h-10 border border-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <div className="w-6 h-6 bg-primary/20"></div>
                    </div>
                    <div className={`absolute top-1 left-1 w-1.5 h-1.5 ${
                      item.rarity === 'EPIC' ? 'bg-purple-500' : 'bg-primary'
                    }`}></div>
                  </>
                )}
                <span className="absolute bottom-1 right-1 text-[8px] opacity-20 font-bold italic tracking-tighter">{item.id}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Inspection HUD (4 cols) */}
        <div className="col-span-12 lg:col-span-4 flex flex-col">
          <HUDBox className="p-6 bg-main/80 flex-1 flex flex-col border-primary shadow-stark-glow">
            <div className="mb-8 border-b border-primary/20 pb-4">
              <span className="bg-primary/90 text-text-main/80 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest">{selected?.rarity || 'SCANNING'}</span>
              <h2 className="text-3xl font-black text-text-main mt-2 tracking-tighter italic uppercase">{selected?.name || '---'}</h2>
              <p className="text-[10px] text-primary/80 mt-1 font-bold italic uppercase tracking-widest">Type: {selected?.type || 'Unknown'}</p>
            </div>

            <div className="space-y-6 flex-1">
              {/* Dynamic Stats Bars */}
              {['ATK', 'ENRG', 'STB'].map((stat) => (
                <div key={stat}>
                  <div className="flex justify-between text-[9px] font-black uppercase tracking-widest mb-1">
                    <span className="text-primary/70">{stat}_EFFICIENCY</span>
                    <span className="text-text-main">{selected?.stats?.[stat] || 0}%</span>
                  </div>
                  <div className="w-full h-1 bg-primary/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary shadow-stark-glow transition-all duration-700 ease-out" 
                      style={{ width: `${selected?.stats?.[stat] || 0}%` }}
                    ></div>
                  </div>
                </div>
              ))}

              <div className="p-4 border-l-2 border-primary bg-primary/5 italic text-[11px] leading-relaxed text-text-main/60 mt-8">
                {`> LOG_READOUT: ${selected?.desc || 'Awaiting selection for neural link diagnostic...'}`}
              </div>
            </div>

            <button className="mt-8 bg-primary hover:bg-text-main text-main font-black py-4 text-xs uppercase tracking-[0.2em] transition-all transform active:scale-95 shadow-stark-glow">
              Acquire_Protocols // {selected?.price || '0'} CR
            </button>
          </HUDBox>
        </div>
      </main>

      {/* Footer System Log */}
      <footer className="max-w-7xl mx-auto mt-8 flex justify-between items-center text-[9px] font-bold text-primary/40 uppercase tracking-widest">
        <div className="flex gap-8">
          <span>Stark_OS: v4.2.1</span>
          <span>Core_Temp: 32.5c</span>
          <span>Sync: Stable</span>
        </div>
        <div className="text-primary/70 italic">© 2024 Stark Industries // Tactical Supply Div</div>
      </footer>
    </div>
  );
};

export default Shop;
