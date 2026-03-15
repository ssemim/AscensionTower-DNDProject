import React, { useState, useEffect, useCallback } from 'react';
import { createDeck, shuffleDeck, calculateScore, getWinner } from './GameLogic';

function BettingModal({ onBet, onCancel, balance }) {
    const [amount, setAmount] = useState('');

    const handleBetClick = () => {
        const betValue = parseInt(amount, 10);
        if (betValue > 0 && betValue <= balance) {
            onBet(betValue);
        } else {
            alert('유효하지 않은 베팅 금액입니다.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-main border border-border-primary p-6 rounded-lg shadow-stark-glow flex flex-col gap-4 w-full max-w-sm animate-slide-in">
                <h2 className="text-xl font-bold text-primary tracking-widest uppercase">얼마를 거시겠습니까?</h2>
                <p className="text-sm text-text-main/70">보유 포인트: {balance} P</p>
                <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="베팅 금액 입력"
                    className="bg-primary/10 border border-border-primary/50 p-2 text-text-main w-full focus:outline-none focus:border-primary"
                    autoFocus
                />
                <div className="grid grid-cols-2 gap-2">
                    <button onClick={onCancel} className="py-3 border border-border-primary/30 hover:border-border-primary text-text-main/50 hover:text-primary font-black uppercase text-xs transition-all">취소</button>
                    <button onClick={handleBetClick} className="py-3 bg-primary text-main font-black uppercase text-xs tracking-widest hover:bg-text-main hover:text-primary transition-all">확인</button>
                </div>
            </div>
        </div>
    );
}

function BlackJack() {
  const [deck, setDeck] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [playerScore, setPlayerScore] = useState(0);
  const [dealerScore, setDealerScore] = useState(0);
  const [winner, setWinner] = useState(null); // 'PLAYER', 'DEALER', 'PUSH'
  const [gameStatus, setGameStatus] = useState('IDLE'); // IDLE, PLAYING, DEALER_TURN, ENDED
  
  const [betAmount, setBetAmount] = useState(0);
  const [balance, setBalance] = useState(1000);
  const [hearts, setHearts] = useState(3);
  const [isBetting, setIsBetting] = useState(false);
  const [roundResult, setRoundResult] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const isBlackjack = playerScore === 21 && playerHand.length === 2;

  const stand = useCallback(() => {
    if (gameStatus !== 'PLAYING') return;
    setGameStatus('DEALER_TURN');
  }, [gameStatus]);

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
      setGameStatus('DEALER_TURN'); // Player busts, go to dealer turn to reveal cards and process result
    }
  };

  const dealCards = useCallback(() => {
    setGameStatus('PLAYING');
    setWinner(null);
    setRoundResult(0);

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
      stand();
    }
  }, [stand]);

  const handleStartBetting = () => {
    if (gameOver) return;
    setRoundResult(0);
    setIsBetting(true);
  };

  const handlePlaceBet = (amount) => {
      setBetAmount(amount);
      setBalance(prev => prev - amount);
      setIsBetting(false);
      dealCards();
  };

  useEffect(() => {
    if (gameStatus !== 'DEALER_TURN') return;

    const playDealerTurn = () => {
      let currentDealerHand = dealerHand.map(c => ({ ...c, hidden: false }));
      let currentDealerScore = calculateScore(currentDealerHand);
      let currentDeck = [...deck];

      // Player bust case
      if (playerScore > 21) {
        // Just reveal dealer's hand
      } else {
        while (currentDealerScore < 17) {
          const newCard = currentDeck.pop();
          currentDealerHand.push(newCard);
          currentDealerScore = calculateScore(currentDealerHand);
        }
      }

      setDealerHand(currentDealerHand);
      setDealerScore(currentDealerScore);
      setDeck(currentDeck);

      const winnerResult = getWinner(playerScore, currentDealerScore, playerHand.length);
      setWinner(winnerResult);

      if (winnerResult === 'PLAYER') {
          const winnings = betAmount * 2;
          setBalance(prev => prev + winnings);
          setRoundResult(winnings);
      } else if (winnerResult === 'DEALER') {
          const newHearts = hearts - 1;
          setHearts(newHearts);
          setRoundResult(-betAmount);
          if (newHearts <= 0) {
              setGameOver(true);
          }
      } else { // PUSH
          setBalance(prev => prev + betAmount);
          setRoundResult(0);
      }
      
      setGameStatus('ENDED');
    };

    const timer = setTimeout(playDealerTurn, 1000);
    return () => clearTimeout(timer);
  }, [gameStatus, dealerHand, deck, playerScore, playerHand.length, betAmount, hearts]);

  // Auto-restart round on ENDED
  useEffect(() => {
    if (gameStatus === 'ENDED' && !gameOver) {
      const autoRestartTimer = setTimeout(() => {
        dealCards(); 
      }, 3000); // 3 seconds to see result

      return () => clearTimeout(autoRestartTimer);
    }
  }, [gameStatus, gameOver, dealCards]);

  return (
    <div className={`min-h-screen font-mono p-4 relative overflow-hidden transition-all duration-500 bg-main text-text-main ${isBlackjack ? 'bg-primary/10' : ''}`}>
      
      {isBetting && (
          <BettingModal 
              balance={balance}
              onBet={handlePlaceBet}
              onCancel={() => setIsBetting(false)}
          />
      )}

      {isBlackjack && (
        <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
          <div className="absolute inset-0 bg-primary/10 animate-pulse" />
          <div className="text-[12rem] font-black italic text-text-main/20 animate-ping absolute">21</div>
          <div className="text-6xl font-black italic text-primary drop-shadow-[0_0_30px_var(--color-primary-glow)] animate-bounce z-10">
            BLACK JACK! (STAND)
          </div>
        </div>
      )}

      <div className="fixed inset-0 opacity-[0.05] pointer-events-none bg-stark-grid" style={{backgroundSize: '40px 40px'}} />

      <main className="max-w-7xl mx-auto mt-12 grid grid-cols-12 gap-8 relative z-10 px-4">
        <section className="col-span-12 lg:col-span-9 flex flex-col items-center justify-center py-10 space-y-16">
          <div className="flex flex-col items-center">
            <div className="text-[10px] text-text-main/50 font-black mb-4 tracking-[0.5em] uppercase italic"> 딜러 (현재 점수: {dealerScore > 0 ? dealerScore : '?'})</div>
            <div className="flex gap-4 h-36 items-center overflow-x-auto p-4">
              {dealerHand.map((card) => (
                  <div
                    key={card.id}
                    className={`w-24 h-36 border-2 flex-shrink-0 flex items-center justify-center relative transition-all duration-500 transform animate-slide-in overflow-hidden
                    ${card.hidden
                        ? 'border-border-primary/20 bg-primary/5'
                        : 'border-border-primary bg-main shadow-stark-glow'}`}
                  >
                    <span className={`text-4xl font-black italic ${card.hidden ? 'text-primary/30' : 'text-text-main'}`}>
                      {card.hidden ? '?' : card.value}
                    </span>
                  </div>
              ))}
            </div>
          </div>

          <div className="relative font-dos-gothic">
            {gameStatus === 'ENDED' && winner && (
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-max px-4 py-1 bg-yellow-400 text-black text-lg font-black italic animate-bounce">
                {winner === 'PLAYER' && '승리!'}
                {winner === 'DEALER' && (playerScore > 21 ? '버스트!' : '패배')}
                {winner === 'PUSH' && '무승부'}
              </div>
            )}
            <div className={`text-xl font-black italic px-8 py-2 border-y-2 border-border-primary/20 transition-all ${isBlackjack ? 'text-primary border-border-primary bg-primary/10' : ''}`}>
              현재 점수: {playerScore}
            </div>
          </div>

          <div className="flex flex-col items-center font-dos-gothic">
             <div className="flex gap-4 h-36 items-center overflow-x-auto p-4">
               {playerHand.map((card) => (
                <div key={card.id} className="w-24 h-36 border-2 flex-shrink-0 border-border-primary bg-main flex items-center justify-center relative shadow-stark-glow animate-slide-in overflow-hidden">
                  <span className="text-4xl font-black italic text-text-main">
                    {card.value}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-4">
                <div className="text-[10px] text-primary font-black tracking-[0.5em] uppercase">플레이어</div>
                <div className="flex items-center gap-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <span key={i} className={`text-2xl transition-colors ${i < hearts ? 'text-red-500' : 'text-text-main/20'}`}>♥</span>
                    ))}
                </div>
            </div>
          </div>
        </section>

        <aside className="col-span-12 lg:col-span-3 flex flex-col justify-between lg:justify-start gap-6 mb-12 lg:mb-0 font-dos-gothic">
          <div>
            <div className="text-center mb-4 p-4 border border-border-primary/30">
              <p className="text-sm text-text-main/70 mb-1">"얼마 걸건데?"</p>
                <p className="text-yellow-400 text-4xl font-black h-12 flex items-center justify-center">
                    {betAmount > 0 ? `${betAmount} P` : '...'}
                </p>
                {betAmount > 0 && gameStatus !== 'IDLE' && gameStatus !== 'BETTING' && (
                    <div className="text-xs mt-2 grid grid-cols-2 gap-1">
                        <p className="text-green-400">WIN: +{betAmount * 2} P</p>
                        <p className="text-red-400">LOSE: -{betAmount} P</p>
                    </div>
                )}
              <p className="text-xs text-text-main/50 mt-2">보유 포인트: {balance} P</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={handleStartBetting} 
                disabled={gameStatus !== 'IDLE' && !gameOver}
                className="col-span-2 py-4 bg-primary text-main font-black uppercase text-sm tracking-widest hover:bg-text-main hover:text-primary transition-all shadow-stark-glow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {gameOver ? 'GAME OVER' : (gameStatus === 'IDLE' || gameStatus === 'ENDED' ? '새 게임' : '게임 중')}
              </button>
              <button onClick={hit} disabled={gameStatus !== 'PLAYING'} className="py-4 border border-border-primary/30 hover:border-border-primary text-text-main/50 hover:text-primary font-black uppercase text-[12px] transition-all disabled:opacity-50 disabled:cursor-not-allowed">히트</button>
              <button onClick={stand} disabled={gameStatus !== 'PLAYING'} className="py-4 border border-border-primary/30 hover:border-border-primary text-text-main/50 hover:text-primary font-black uppercase text-[12px] transition-all disabled:opacity-50 disabled:cursor-not-allowed">스탠드</button>
            </div>
          </div>
        </aside>
      </main>

      <footer className="fixed bottom-0 left-0 w-full px-6 py-2 border-t border-border-primary/20 bg-main/80 backdrop-blur-sm flex justify-between items-center text-[8px] font-bold text-primary/70 uppercase tracking-widest">
        <div className="flex gap-8">
          <span>ROUND P/L: 
            <span className={`ml-2 ${roundResult > 0 ? 'text-green-400' : roundResult < 0 ? 'text-red-400' : 'text-primary/70'}`}>
                {roundResult > 0 ? `+${roundResult}` : roundResult} P
            </span>
          </span>
        </div>
        <p>Timestamp: 23:59:12::TOWER_27</p>
      </footer>

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