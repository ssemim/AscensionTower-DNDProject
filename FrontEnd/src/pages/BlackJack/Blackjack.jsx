import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../../components/ThemeProvider/ThemeProvider';
import { createDeck, shuffleDeck, calculateScore, getWinner } from './GameLogic';

function BlackJack() {
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
    <div className={`min-h-screen font-mono p-4 relative overflow-hidden transition-all duration-500 bg-main text-text-main ${isBlackjack ? 'bg-primary/10' : ''}`}>
      
      {/* 1. BLACKJACK CRITICAL EFFECT OVERLAY */}
      {isBlackjack && (
        <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
          <div className="absolute inset-0 bg-primary/10 animate-pulse" />
          <div className="text-[12rem] font-black italic text-text-main/20 animate-ping absolute">21</div>
          <div className="text-6xl font-black italic text-primary drop-shadow-[0_0_30px_var(--color-primary-glow)] animate-bounce z-10">
            BLACK JACK! (STAND)
          </div>
          {/* Particles */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 20 }).map((_, i) => (
              <div 
                key={i} 
                className="absolute w-1 h-10 bg-primary animate-pulse" 
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
      <div className="fixed inset-0 opacity-[0.05] pointer-events-none bg-stark-grid" style={{backgroundSize: '40px 40px'}} />

      {/* 4. MAIN COMBAT AREA */}
      <main className="max-w-7xl mx-auto mt-12 grid grid-cols-12 gap-8 relative z-10">
        {/* Center Col: Play Field */}
        <section className="col-span-12 lg:col-span-9 flex flex-col items-center justify-center py-10 space-y-16">
          {/* Dealer Section */}
          <div className="flex flex-col items-center">
            <div className="text-[10px] text-text-main/50 font-black mb-4 tracking-[0.5em] uppercase italic"> 딜러 (현재 점수: {dealerScore > 0 ? dealerScore : '?'})</div>
            <div className="flex gap-4 h-36 items-center">
              {dealerHand.map((card) => {
                return (
                  <div
                    key={card.id}
                    className={`w-24 h-36 border-2 flex items-center justify-center relative transition-all duration-500 transform animate-slide-in 
                    ${card.hidden
                        ? 'border-primary/20 bg-primary/5'
                        : 'border-primary bg-main shadow-stark-glow'}`}
                  >
                    <span className={`text-4xl font-black italic ${card.hidden ? 'text-primary/30' : 'text-text-main'}`}>{card.hidden ? '?' : card.value}</span>
                    {!card.hidden && <div className="absolute top-2 right-2 w-2 h-2 bg-primary" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Current Score Display */}
          <div className="relative  font-dos-gothic">
            {gameStatus === 'ENDED' && winner && (
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-max px-4 py-1 bg-yellow-400 text-black text-lg font-black italic animate-bounce">
                {winner === 'PLAYER' && '승리!'}
                {winner === 'DEALER' && (playerScore > 21 ? '버스트!' : '패배')}
                {winner === 'PUSH' && '무승부'}
              </div>
            )}
            <div className={`text-xl font-black italic px-8 py-2 border-y-2 border-primary/20 transition-all ${isBlackjack ? 'text-primary border-primary bg-primary/10' : ''}`}>
              현재 점수: {playerScore}
            </div>
          </div>

          {/* Player Section */}
          <div className="flex flex-col items-center  font-dos-gothic">
            <div className="flex gap-4 h-36 items-center">
              {playerHand.map((card) => (
                <div key={card.id} className="w-24 h-36 border-2 border-primary bg-main flex items-center justify-center relative shadow-stark-glow animate-slide-in">
                  <span className="text-4xl font-black italic text-text-main">{card.value}</span>
                  <div className="absolute bottom-2 right-2 w-2 h-2 bg-primary" />
                </div>
              ))}
            </div>
            <div className="text-[10px] text-primary font-black mt-4 tracking-[0.5em] uppercase">플레이어</div>
          </div>
        </section>

        {/* Right Col: Bankroll & Controls */}
        <aside className="col-span-12 lg:col-span-3 flex flex-col justify-end lg:justify-start gap-6 mb-12 lg:mb-0 font-dos-gothic">
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={dealCards} 
              disabled={gameStatus === 'PLAYING' || gameStatus === 'DEALER_TURN'} 
              className="col-span-2 py-4 bg-primary text-main font-black uppercase text-sm tracking-widest hover:bg-text-main hover:text-primary transition-all shadow-stark-glow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {gameStatus === 'IDLE' || gameStatus === 'ENDED' ? '게임 시작' : '게임 중'}
            </button>
            <button onClick={hit} disabled={gameStatus !== 'PLAYING'} className="py-4 border border-primary/30 hover:border-primary text-text-main/50 hover:text-primary font-black uppercase text-[12px] transition-all disabled:opacity-50 disabled:cursor-not-allowed">히트</button>
            <button onClick={stand} disabled={gameStatus !== 'PLAYING'} className="py-4 border border-primary/30 hover:border-primary text-text-main/50 hover:text-primary font-black uppercase text-[12px] transition-all disabled:opacity-50 disabled:cursor-not-allowed">스탠드</button>
          </div>
        </aside>
      </main>

      {/* 5. FOOTER SYSTEM LOG */}
      <footer className="fixed bottom-0 left-0 w-full px-6 py-2 border-t border-primary/20 bg-main/80 backdrop-blur-sm flex justify-between items-center text-[8px] font-bold text-primary/70 uppercase tracking-widest">
        <div className="flex gap-8">
          <span>Dealer</span>
          <span>system : ...</span>
          <span>scan</span>
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
}
export default BlackJack;