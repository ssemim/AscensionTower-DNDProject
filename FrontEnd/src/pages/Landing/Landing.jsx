import ChronologySection from './ChronologySection'
import './index.css'  

export default function Landing(){

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-900 font-mono overflow-x-hidden relative">
      {/* Background HUD Grid */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.05]" 
           style={{ backgroundImage: 'linear-gradient(#2563eb 1px, transparent 1px), linear-gradient(90deg, #2563eb 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      {/* Navigation Bar */}
      <nav className="relative z-50 flex justify-between items-center px-12 py-6 border-b border-blue-100 bg-white/80 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-600 flex items-center justify-center rotate-45">
            <span className="text-white font-black -rotate-45 text-xl">S</span>
          </div>
          <div className="leading-none">
            <span className="text-xs font-bold text-blue-600 tracking-[0.3em]">STARK_IND</span>
            <p className="text-lg font-black italic">RESEARCH_LABS</p>
          </div>
        </div>
        <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
          <a href="#" className="text-blue-600 border-b-2 border-blue-600">Overview</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Projects</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Archive</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Security</a>
        </div>
      </nav>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="px-12 py-32 flex flex-col items-center text-center">
          <div className="mb-4 flex items-center gap-2">
            <span className="w-12 h-[1px] bg-blue-600"></span>
            <span className="text-[10px] font-bold text-blue-600 tracking-[0.5em] uppercase">Sector_07 Access Granted</span>
            <span className="w-12 h-[1px] bg-blue-600"></span>
          </div>
          <p className="max-w-2xl text-slate-500 text-sm leading-relaxed mb-12 italic">
            Next-generation neural link research and sub-atomic energy harvesting. 
            Welcome, Director. All systems operational within designated parameters.
          </p>
          
          <div className="flex gap-4">
            <button className="px-10 py-4 bg-blue-600 text-white font-black text-xs uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-blue-200">
              Deploy Project
            </button>
            <button className="px-10 py-4 border-2 border-blue-600 text-blue-600 font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-all">
              Research Portal
            </button>
          </div>
        </section>

        {/* Chronology / Timeline Section */}
        <section className="px-12 py-24 bg-white border-y border-blue-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="flex flex-col md:flex-row gap-12 max-w-6xl mx-auto">
            <div className="md:w-1/3">
              <span className="text-blue-600 font-bold text-xs tracking-widest">// ARCHIVE_HISTORY</span>
              <h3 className="text-4xl font-black italic mt-4 mb-6 leading-tight">EXP_CHRONOLOGY</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Tracing the evolution of Stark-tech from the first Arc Reactor to the current Quantum Nexus protocols.
              </p>
            </div>

            <div className="md:w-2/3 flex gap-8 overflow-x-auto pb-8 scrollbar-hide">
              {[
                { year: "2024.Q1", title: "Project_Ghost", status: "COMPLETED" },
                { year: "2024.Q3", title: "Neural_Link", status: "ACTIVE" },
                { year: "2025.Q1", title: "Void_Energy", status: "PENDING" },
              ].map((item, idx) => (
                <div key={idx} className="min-w-[240px] border border-blue-100 p-6 bg-slate-50 relative group hover:border-blue-600 transition-all">
                  <div className="absolute -top-2 -left-2 w-4 h-4 bg-blue-600 rotate-45 border-4 border-white"></div>
                  <span className="text-[10px] font-bold text-blue-400">{item.year}</span>
                  <h4 className="text-lg font-black mt-2 mb-4">{item.title}</h4>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></div>
                    <span className="text-[9px] font-black opacity-40">{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Department Grid */}
        <section className="px-12 py-24 max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Tactical', 'Energy', 'Cyber', 'Bio'].map((dept) => (
              <div key={dept} className="aspect-video border border-blue-100 bg-white p-6 flex flex-col justify-between group hover:bg-blue-600 transition-all cursor-pointer shadow-sm hover:shadow-blue-200">
                <span className="text-[10px] font-bold text-blue-600 group-hover:text-blue-200 tracking-[0.3em] uppercase">Dept_{dept}</span>
                <div className="flex justify-between items-end">
                  <h5 className="text-xl font-black italic group-hover:text-white transition-colors">{dept}</h5>
                  <div className="w-8 h-8 border border-blue-100 flex items-center justify-center group-hover:border-white/30">
                    <span className="text-blue-600 group-hover:text-white">→</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer Info HUD */}
      <footer className="px-12 py-8 border-t border-blue-100 bg-white flex justify-between items-center text-[9px] font-bold text-slate-400 uppercase tracking-widest">
        <div className="flex gap-12">
          <p>Local_Time: 14:22:09 GMT</p>
          <p>System_Temp: 32.5°C</p>
          <p>Link_Strength: 99%</p>
        </div>
        <p className="text-blue-600">© 2024 STARK INDUSTRIES // GLOBAL RESEARCH DIV</p>
      </footer>
    </div>
  );
};


