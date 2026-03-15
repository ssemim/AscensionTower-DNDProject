import React from 'react';

const ChronologySection = () => {
  const events = [
    { date: "2036", title: "2036년", desc: "크리쳐의 등장, 인류와 전쟁을 시작하다", side: "left" },
    { date: "2116", title: "2116년", desc: "국경의 소멸화, 초기 방주의 성립", side: "right" },
    { date: "2151", title: "2151년", desc: "돌연변이의 등장", side: "left" },
    { date: "2153", title: "2153년", desc: "교단의 등장과 함께 ‘아케로’에 대한 정의가 내려지다", side: "right" },
    { date: "2180", title: "2180년", desc: "방주에서 ‘탑의 완공’을 공식적으로 발표하다", side: "left" },
    { date: "2185~2210", title: "2185년~2210년", desc: "방주의 확장 및 고착화", side: "right" },
    { date: "2211~2225", title: "2211년~2225년", desc: "정계의 등장 및 안정화", side: "left" },
    { date: "2225", title: "2225년", desc: "부지의 구획화 시작", side: "right" },
    { date: "2230", title: "2230년", desc: "혁명가 ‘칼’을 시작으로 2부지에서 대규모 혁명이 전개되다", side: "left" },
    { date: "2232", title: "2232년", desc: "수장인 ‘칼’의 실종과 함께 혁명의 불꽃이 사그라들다", side: "right" },
    { date: "2232~2237", title: "2232년~2237년", desc: "1부지와 2부지 사이의 불가침 구역 추가 구축 공사, 부지 구획화가 완료되다.", side: "left" },
    { date: "2300", title: "2300년", desc: "아케로를 영웅으로 추앙하기 시작하다.", side: "right" },
    { date: "2326~2405", title: "2326년~2405년", desc: "방주의 완벽한 안정화를 대통령이 선포하다.", side: "left" },
    { date: "2406", title: "2406년", desc: "비행 타입의 크리쳐 등장 및 공습 사태로 3부지 일대의 몰살, 수많은 사상자가 발생하다", side: "right" },
    { date: "2407~2426", title: "2407년~2426년", desc: "파손된 3부지 일대 방호벽과 결계의 재시동 시도, 반복된 실패로 돌아가다", side: "left" },
    { date: "2426", title: "2426년", desc: "현재", side: "right" },
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
                <div className="w-full md:flex-1 p-6 border border-border-primary font-nexon-warhaven bg-main/40 backdrop-blur-md relative group hover:border-border-primary transition-all shadow-sm hover:shadow-stark-glow">
                  <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-border-primary"></div>
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-border-primary"></div>
                  
                  <span className="text-[10px] text-primary/70 tracking-widest">DATE_REF: {event.date}</span>
                  <h3 className="text-xl font-bold mt-1 mb-2 text-text-main dark:!text-white">{event.title}</h3>
                  <p className="text-sm opacity-70 leading-relaxed">{event.desc}</p>
                </div>

                {/* 6. 중앙 아이콘 */}
                <div className="relative flex-none z-10 my-6 md:my-0">
                  <div className="w-10 h-10 border border-border-primary rotate-45 flex items-center justify-center bg-main shadow-stark-glow">
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