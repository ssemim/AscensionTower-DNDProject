import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../../components/ThemeProvider/ThemeProvider';
import { createDeck, shuffleDeck, calculateScore, getWinner } from './GameLogic';

const BlackJack = () => {
  const [deck, setDeck] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [playerScore, setPlayerScore] = useState(0);
  const [dealerScore, setDealerScore] = useState(0);
  const [winner, setWinner] = useState(null); // 'PLAYER', 'DEALER', 'PUSH'
  const [isBlackjack, setIsBlackjack] = useState(false);
  const [gameStatus, setGameStatus] = useState('IDLE'); // IDLE, PLAYING, DEALER_TURN, ENDED
  const { isDark } = useTheme();

  // 블랙잭(21) 달성 시 이펙트 트리거
  useEffect(() => {
    if (playerScore === 21 && playerHand.length === 2) {
      setIsBlackjack(true);
      const timer = setTimeout(() => setIsBlackjack(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [playerScore, playerHand.length]);

  // 게임 시작 및 카드 분배
  const dealCards = useCallback(() => {
    setGameStatus('PLAYING');
    setIsBlackjack(false);
    setWinner(null);

    const newDeck = shuffleDeck(createDeck());
    
    const playerInitialHand = [newDeck.pop(), newDeck.pop()];
    const dealerInitialHand = [newDeck.pop(), { ...newDeck.pop(), hidden: true }];

    setPlayerHand(playerInitialHand);
    setDealerHand(dealerInitialHand);
    setDeck(newDeck);

    const initialPlayerScore = calculateScore(playerInitialHand);
    setPlayerScore(initialPlayerScore);
    setDealerScore(calculateScore(dealerInitialHand));

    if (initialPlayerScore === 21) {
      // 플레이어가 블랙잭인 경우, 즉시 딜러 턴 진행
      stand();
    }
  }, []);

  // Hit: 카드 한 장 더 받기
  const hit = () => {
    if (gameStatus !== 'PLAYING') return;

    const newDeck = [...deck];
    const newCard = newDeck.pop();
    const newPlayerHand = [...playerHand, newCard];
    const newPlayerScore = calculateScore(newPlayerHand);

    setDeck(newDeck);
    setPlayerHand(newPlayerHand);
    setPlayerScore(newPlayerScore);

    if (newPlayerScore > 21) {
      setWinner('DEALER');
      setGameStatus('ENDED');
    }
  };

  // Stand: 차례를 딜러에게 넘김
  const stand = () => {
    if (gameStatus !== 'PLAYING') return;
    setGameStatus('DEALER_TURN');
  };

  // 딜러 턴 로직
  useEffect(() => {
    if (gameStatus !== 'DEALER_TURN') return;

    const playDealerTurn = () => {
      let currentDealerHand = dealerHand.map(c => ({ ...c, hidden: false }));
      let currentDealerScore = calculateScore(currentDealerHand);
      let currentDeck = [...deck];

      while (currentDealerScore < 17) {
        const newCard = currentDeck.pop();
        currentDealerHand.push(newCard);
        currentDealerScore = calculateScore(currentDealerHand);
      }

      setDealerHand(currentDealerHand);
      setDealerScore(currentDealerScore);
      setDeck(currentDeck);
      setWinner(getWinner(playerScore, currentDealerScore, playerHand.length));
      setGameStatus('ENDED');
    };

    // 딜러가 생각하는 듯한 딜레이
    const timer = setTimeout(playDealerTurn, 1000);
    return () => clearTimeout(timer);
  }, [gameStatus, dealerHand, deck, playerScore, playerHand.length]);

  return (
    <div className={`min-h-screen font-mono p-4 relative overflow-hidden transition-all duration-500 dark:bg-[#02060a] dark:text-cyan-400 bg-gray-100 text-gray-800 ${isBlackjack ? 'dark:bg-cyan-900/20 bg-cyan-100/30' : ''}`}>
      
      {/* 1. BLACKJACK CRITICAL EFFECT OVERLAY */}
      {isBlackjack && (
        <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
          <div className="absolute inset-0 dark:bg-cyan-400/10 bg-cyan-300/10 animate-pulse" />
          <div className="text-[12rem] font-black italic dark:text-white text-gray-500 opacity-20 animate-ping absolute">21</div>
          <div className="text-6xl font-black italic dark:text-cyan-400 text-cyan-600 drop-shadow-[0_0_30px_#22d3ee] animate-bounce z-10">
            크리티컬 블랙잭
          </div>
          {/* Particles */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 20 }).map((_, i) => (
              <div 
                key={i} 
                className="absolute w-1 h-10 dark:bg-cyan-400 bg-cyan-500 animate-pulse" 
                style={{ 
                  left: `${Math.random() * 100}%`, 
                  top: `${Math.random() * 100}%`, 
                  transform: `rotate(${Math.random() * 360}deg)`,
                  animationDelay: `${Math.random() * 2}s`
                }} 
              />
            ))}
          </div>
        </div>
      )}

      {/* 2. BACKGROUND HUD GRID */}
      <div 
        className="fixed inset-0 dark:opacity-[0.05] opacity-10 pointer-events-none" 
        style={{ 
          backgroundImage: isDark 
            ? 'linear-gradient(#22d3ee 1px, transparent 1px), linear-gradient(90deg, #22d3ee 1px, transparent 1px)'
            : 'linear-gradient(#a5f3fc 1px, transparent 1px), linear-gradient(90deg, #a5f3fc 1px, transparent 1px)',
          backgroundSize: '40px 40px' 
        }} 
      />

      {/* 4. MAIN COMBAT AREA */}
      <main className="max-w-7xl mx-auto mt-12 grid grid-cols-12 gap-8 relative z-10">
        {/* Center Col: Play Field */}
        <section className="col-span-12 lg:col-span-9 flex flex-col items-center justify-center py-10 space-y-16">
          {/* Dealer Section */}
          <div className="flex flex-col items-center">
            <div className="text-[10px] dark:text-cyan-900 text-gray-400 font-black mb-4 tracking-[0.5em] uppercase italic"> 딜러 (현재 점수: {dealerScore > 0 ? dealerScore : '?'})</div>
            <div className="flex gap-4 h-36 items-center">
              {dealerHand.map((card) => {
                return (
                  <div
                    key={card.id}
                    className={`w-24 h-36 border-2 flex items-center justify-center relative transition-all duration-500 transform animate-slide-in 
                    ${card.hidden
                        ? 'dark:border-cyan-900 border-gray-300 dark:bg-cyan-950/20 bg-gray-100/20'
                        : 'dark:border-cyan-400 border-cyan-500 dark:bg-black bg-white shadow-[0_0_20px_rgba(34,211,238,0.2)]'}`}
                  >
                    <span className={`text-4xl font-black italic ${card.hidden ? 'dark:text-cyan-900 text-gray-400' : 'dark:text-white text-gray-900'}`}>{card.hidden ? '?' : card.value}</span>
                    {!card.hidden && <div className="absolute top-2 right-2 w-2 h-2 dark:bg-cyan-400 bg-cyan-500" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Current Score Display */}
          <div className="relative">
            {gameStatus === 'ENDED' && winner && (
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-max px-4 py-1 dark:bg-yellow-400 bg-yellow-500 text-black text-lg font-black italic animate-bounce">
                {winner === 'PLAYER' && '승리!'}
                {winner === 'DEALER' && (playerScore > 21 ? '버스트!' : '패배')}
                {winner === 'PUSH' && '무승부'}
              </div>
            )}
            <div className={`text-xl font-black italic px-8 py-2 border-y-2 dark:border-cyan-900 border-gray-200 transition-all ${isBlackjack ? 'dark:text-white text-black dark:border-cyan-400 border-cyan-500 dark:bg-cyan-400/10 bg-cyan-500/10' : ''}`}>
              현재 점수: {playerScore}
            </div>
          </div>

          {/* Player Section */}
          <div className="flex flex-col items-center">
            <div className="flex gap-4 h-36 items-center">
              {playerHand.map((card) => (
                <div key={card.id} className="w-24 h-36 border-2 dark:border-cyan-400 border-cyan-500 dark:bg-black bg-white flex items-center justify-center relative shadow-[0_0_30px_rgba(34,211,238,0.2)] animate-slide-in">
                  <span className="text-4xl font-black italic dark:text-white text-gray-900">{card.value}</span>
                  <div className="absolute bottom-2 right-2 w-2 h-2 dark:bg-cyan-400 bg-cyan-500" />
                </div>
              ))}
            </div>
            <div className="text-[10px] dark:text-cyan-400 text-cyan-600 font-black mt-4 tracking-[0.5em] uppercase">플레이어</div>
          </div>
        </section>

        {/* Right Col: Bankroll & Controls */}
        <aside className="col-span-12 lg:col-span-3 flex flex-col justify-end lg:justify-start gap-6 mb-12 lg:mb-0">
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={dealCards} 
              disabled={gameStatus === 'PLAYING' || gameStatus === 'DEALER_TURN'} 
              className="col-span-2 py-4 bg-cyan-500 text-black font-black uppercase text-sm tracking-widest hover:bg-white transition-all shadow-[0_0_20px_#22d3ee] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {gameStatus === 'IDLE' || gameStatus === 'ENDED' ? '게임 시작' : '게임 중'}
            </button>
            <button onClick={hit} disabled={gameStatus !== 'PLAYING'} className="py-4 border dark:border-cyan-900 border-gray-300 hover:dark:border-cyan-400 hover:border-gray-500 dark:text-cyan-900 text-gray-400 hover:dark:text-cyan-400 hover:text-gray-600 font-black uppercase text-[12px] transition-all disabled:opacity-50 disabled:cursor-not-allowed">히트</button>
            <button onClick={stand} disabled={gameStatus !== 'PLAYING'} className="py-4 border dark:border-cyan-900 border-gray-300 hover:dark:border-cyan-400 hover:border-gray-500 dark:text-cyan-900 text-gray-400 hover:dark:text-cyan-400 hover:text-gray-600 font-black uppercase text-[12px] transition-all disabled:opacity-50 disabled:cursor-not-allowed">스탠드</button>
          </div>
        </aside>
      </main>

      {/* 5. FOOTER SYSTEM LOG */}
      <footer className="fixed bottom-0 left-0 w-full px-6 py-2 border-t dark:border-cyan-900 border-gray-200 dark:bg-black/80 bg-white/80 flex justify-between items-center text-[8px] font-bold dark:text-cyan-900 text-gray-400 uppercase tracking-widest">
        <div className="flex gap-8">
          <span>[정보] 딜러 알고리즘: 안정</span>
          <span>[시스템] 베팅 프로토콜 동기화 중...</span>
          <span>[스캔] 플레이어에게 최적화된 확률</span>
        </div>
        <p>Timestamp: 23:59:12::TOWER_27</p>
      </footer>

      {/* GLOBAL ANIMATIONS */}
      <style>{`
        @keyframes slide-in {
          from { transform: translateY(-30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-in {
          animation: slide-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default BlackJack;