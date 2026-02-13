import React from 'react';

const ChronologySection = () => {
  const events = [
    { date: "2140.001", title: "THE COLLAPSE", desc: "System-wide critical failure. Global hegemony terminated.", side: "left" },
    { date: "2212.045", title: "VOID_MATTER_SIG", desc: "New energy signature detected. Sub-atomic rift harvesting operational.", side: "right" },
    { date: "2305.881", title: "INTERSTELLAR_CONFLICT", desc: "Resource wars across sector 4. High-yield tactical strikes.", side: "left" },
  ];

  return (
    /* 1. bg-[#0a0f1a] 삭제 -> bg-main 적용 */
    /* 2. text-cyan-400 삭제 -> text-text-main 적용 */
    <section className="relative overflow-hidden bg-main text-text-main py-20 px-10 font-mono transition-colors duration-500">
      
      {/* 3. 배경 그리드: 직접 작성한 style 대신 config에 선언한 bg-stark-grid 사용 */}
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

        {/* 4. 세로선: bg-primary/20 (변수 기반 투명도) 적용 */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-[1px] h-full bg-primary/20 top-40 hidden md:block"></div>

        <div className="space-y-24">
          {events.map((event, index) => (
            <div key={index} className={`flex flex-col md:flex-row items-center ${event.side === 'right' ? 'md:flex-row-reverse' : ''}`}>
              
              {/* 5. 컨텐츠 박스: bg-main/40 (변수 기반 투명 배경) */}
              <div className="w-full md:w-1/2 p-6 border border-primary/30 bg-main/40 backdrop-blur-md relative group hover:border-primary transition-all shadow-sm hover:shadow-stark-glow">
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary"></div>
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary"></div>
                
                <span className="text-[10px] text-primary/70 tracking-widest">DATE_REF: {event.date}</span>
                <h3 className="text-xl font-bold mt-1 mb-2 text-text-main">{event.title}</h3>
                <p className="text-sm opacity-70 leading-relaxed">{event.desc}</p>
              </div>

              {/* 6. 중앙 아이콘: bg-main 적용 */}
              <div className="relative mx-8 my-6 md:my-0">
                <div className="w-10 h-10 border border-primary rotate-45 flex items-center justify-center bg-main shadow-stark-glow">
                  <div className="w-2 h-2 bg-primary rotate-0 animate-pulse"></div>
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