import React from 'react';

const ChronologySection = () => {
  const events = [
    { date: "2140.001", title: "THE COLLAPSE", desc: "System-wide critical failure. Global hegemony terminated.", side: "left" },
    { date: "2212.045", title: "VOID_MATTER_SIG", desc: "New energy signature detected. Sub-atomic rift harvesting operational.", side: "right" },
    { date: "2305.881", title: "INTERSTELLAR_CONFLICT", desc: "Resource wars across sector 4. High-yield tactical strikes.", side: "left" },
  ];

  return (

    <section className="relative overflow-hidden bg-main text-text-main dark:!text-white py-20 px-10 font-mono transition-colors duration-500">

      <div className="absolute inset-0 opacity-10 bg-stark-grid bg-[length:40px_40px]"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.3em] uppercase opacity-60 mb-2 text-primary">
            // SYSTEM_HISTORY_LOG
          </p>
          <h2 className="text-6xl font-black italic tracking-tighter drop-shadow-stark-glow">
            CHRONOLOGY
          </h2>
        </div>

        <div className="relative">
          {/* 4. 세로선: 중앙 정렬 및 높이 조정 */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-[2px] h-full bg-primary top-0 hidden md:block"></div>

          <div className="space-y-24">
            {events.map((event, index) => (
              <div key={index} className={`flex flex-col md:flex-row items-center gap-8 ${event.side === 'right' ? 'md:flex-row-reverse' : ''}`}>
                
                {/* 5. 컨텐츠 박스 */}
                <div className="w-full md:flex-1 p-6 border border-primary/30 bg-main/40 backdrop-blur-md relative group hover:border-primary transition-all shadow-sm hover:shadow-stark-glow">
                  <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary"></div>
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary"></div>
                  
                  <span className="text-[10px] text-primary/70 tracking-widest">DATE_REF: {event.date}</span>
                  <h3 className="text-xl font-bold mt-1 mb-2 text-text-main dark:!text-white">{event.title}</h3>
                  <p className="text-sm opacity-70 leading-relaxed">{event.desc}</p>
                </div>

                {/* 6. 중앙 아이콘 */}
                <div className="relative flex-none z-10 my-6 md:my-0">
                  <div className="w-10 h-10 border border-primary rotate-45 flex items-center justify-center bg-main shadow-stark-glow">
                    <div className="w-2 h-2 bg-primary rotate-0 animate-pulse"></div>
                  </div>
                </div>

                {/* Spacer for Balance */}
                <div className="w-full md:flex-1 hidden md:block"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChronologySection;