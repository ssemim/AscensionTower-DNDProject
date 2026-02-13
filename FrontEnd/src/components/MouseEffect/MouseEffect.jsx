import React, { useState, useEffect } from "react";

const MouseEffect = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    const moveCursor = (e) => setPosition({ x: e.clientX, y: e.clientY });
    const handleDown = () => {
      setIsClicked(true);
      // 시인성을 위해 지속시간을 0.4초로 약간 늘림
      setTimeout(() => setIsClicked(false), 400);
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mousedown", handleDown);
    document.body.style.cursor = "none";

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mousedown", handleDown);
      document.body.style.cursor = "auto";
    };
  }, []);

  return (
    <>
      <style>{`
        @keyframes hud-impact {
          0% { transform: scale(0.4); opacity: 0; }
          15% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1.3); opacity: 0; }
        }
        
        /* 확실하게 보이는 괄호형 원 */
        .heavy-bracket {
          width: 20px;
          height: 20px;
          border: 1px solid var(--color-primary); /* 두께 4px로 강화 */
          border-top-color: transparent;
          border-bottom-color: transparent;
          border-radius: 50%;
          filter: drop-shadow(0 0 6px var(--color-primary)); /* 발광 효과 강화 */
        }

        .cross-line-h {
          width: 30px;
          height: 1px;
          background: var(--color-primary);
          box-shadow: 0 0 10px var(--color-primary);
        }

        .cross-line-v {
          width: 1px;
          height: 30px;
          background: var(--color-primary);
          box-shadow: 0 0 10px var(--color-primary);
        }
      `}</style>

      <div
        className="fixed pointer-events-none z-[99999]"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: "translate(-50%, -50%)",
        }}
      >
        <div className="relative flex items-center justify-center">
          
          {/* --- 클릭 시 나타나는 메인 조준경 --- */}
          {isClicked && (
            <div
              className="absolute flex items-center justify-center"
              style={{ animation: "hud-impact 0.4s cubic-bezier(0.15, 0.85, 0.35, 1) forwards" }}
            >
              {/* 1. 굵고 선명한 좌우 괄호 */}
              <div className="absolute heavy-bracket" />
              
              {/* 2. 더 크고 선명한 십자선 */}
              <div className="absolute cross-line-h" />
              <div className="absolute cross-line-v" />
              
              {/* 3. 안쪽 보조 원 (살짝 투명하게) */}
              <div className="absolute w-10 h-10 border-2 border-primary/60 rounded-full" />
              
              {/* 4. 정중앙 점 */}
              <div className="absolute w-2 h-2 bg-text-main rounded-full shadow-[0_0_10px_var(--color-text-main)]" />
            </div>
          )}

          {/* --- 상시 노출되는 대기 커서 --- */}
          {!isClicked && (
            <div className="relative flex items-center justify-center">
              {/* 작은 십자 가이드 */}
              <div className="absolute w-4 h-[1px] bg-primary opacity-50" />
              <div className="absolute h-4 w-[1px] bg-primary opacity-50" />
              {/* 중심 점 */}
              <div className="w-1.5 h-1.5 bg-primary rounded-full shadow-stark-glow" />
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default MouseEffect;
