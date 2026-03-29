import { Link } from 'react-router-dom';
import './index.css'  
import CommonModal from '../../components/Modal/CommonModal';
import shedule from '../../../public/images/schedule.png';

export default function Landing(){
  const deptLinks = {
    World: '/world',
    Chracter: '/character',
    TWITTER: 'https://twitter.com',
    CAFE: 'https://cafe.naver.com',
  };
  const depts = Object.keys(deptLinks);

  return (
    <div className="min-h-screen bg-main text-text-main font-mono overflow-x-hidden relative">
      {/* Background HUD Grid */}
      <div className="fixed inset-0 pointer-events-none bg-stark-grid opacity-20 dark:opacity-100">
      </div>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="px-12 py-32 flex flex-col items-center text-center">
          <div className="mb-4 flex items-center gap-2">
            <span className="w-12 h-[1px] bg-primary"></span>
            <span className="text-[10px] font-bold text-primary tracking-[0.5em] uppercase">Tower Access Granted</span>
            <span className="w-12 h-[1px] bg-primary"></span>
          </div>
          <p className="max-w-2xl text-text-main/70 text-sm leading-relaxed mb-12 italic">
          교리 자리
          </p>
        </section>

        <section className="px-12 py-12 bg-main border-y border-border-primary/20 relative overflow-hidden flex flex-col items-center text-center">
<div className="mb-4 flex items-center gap-2">
            <span className="w-12 h-[1px] bg-primary"></span>
            <span className="text-[10px] font-bold text-primary tracking-[0.5em] uppercase">Tower Access Granted</span>
            <span className="w-12 h-[1px] bg-primary"></span>
          </div>
          <p className="max-w-2xl text-text-main/70 text-sm leading-relaxed mb-12 italic">
            𝙳𝚘 𝚗𝚘𝚝 𝚏𝚎𝚊𝚛 𝚏𝚘𝚛 𝙸 𝚑𝚊𝚟𝚎 𝚛𝚎𝚍𝚎𝚎𝚖𝚎𝚍 𝚢𝚘𝚞.
𝙸 𝚑𝚊𝚟𝚎 𝚜𝚞𝚖𝚖𝚘𝚗𝚎𝚍 𝚢𝚘𝚞 𝚋𝚢 𝚗𝚊𝚖𝚎, 𝚢𝚘𝚞 𝚊𝚛𝚎 𝚖𝚒𝚗𝚎.
          </p>
      <img src={shedule} alt="Schedule" className="w-full max-w-[80rem] object-contain" />
         <div className="absolute -top-10 -left-10 w-32 h-32 border border-primary rounded-full opacity-50 animate-ping"></div>
         <div className="absolute -bottom-10 -right-10 w-24 h-24 border border-primary rounded-full opacity-50 animate-ping"></div>
        </section>

        {/* Department Grid */}
        <section className="px-12 py-24 max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {depts.map((dept) => {
              const link = deptLinks[dept];
              const isExternal = link.startsWith('http');

              const content = (
                <div className="aspect-video border border-border-primary/20 bg-main p-6 flex flex-col justify-between group hover:bg-primary transition-all cursor-pointer shadow-sm hover:shadow-primary/20">
                  <span className="text-[10px] font-bold text-primary group-hover:text-primary/70 tracking-[0.3em] uppercase">Dept_{dept}</span>
                  <div className="flex justify-between items-end">
                    <h5 className="text-xl font-black italic group-hover:text-white transition-colors">{dept}</h5>
                    <div className="w-8 h-8 border border-border-primary/20 flex items-center justify-center group-hover:border-white/30">
                      <span className="text-primary group-hover:text-white">→</span>
                    </div>
                  </div>
                </div>
              );

              if (isExternal) {
                return (
                  <a key={dept} href={link} target="_blank" rel="noopener noreferrer">
                    {content}
                  </a>
                );
              } else {
                return (
                  <Link key={dept} to={link}>
                    {content}
                  </Link>
                );
              }
            })}
          </div>
        </section>
      </main>

      {/* Footer Info HUD */}
      <footer className="px-12 py-8 border-t border-border-primary/20 bg-main flex justify-between items-center text-[9px] font-bold text-text-main/50 uppercase tracking-widest">
        <div className="flex gap-12">
          <p>Local_Time: 14:22:09 GMT</p>
          <p>System_Temp: 15°C</p>
          <p>Link_Strength: 99%</p>
        </div>
        <p className="text-primary">© ASCENSION TOWER // GLOBAL RESEARCH DIV</p>
      </footer>
    </div>
  );
};