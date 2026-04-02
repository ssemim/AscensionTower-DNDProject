import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useSelector} from 'react-redux';
import { createDeck, shuffleDeck, calculateScore, getWinner } from './GameLogic';
import dialogBlackJack from './dialogBlackJack';
import './Blackjack.css';

// ── Typing Effect Hook ──
const useTypingEffect = (text, duration = 100) => {
    const [typedText, setTypedText] = useState('');

    useEffect(() => {
        if (!text) return;

        const interval = setInterval(() => {
            setTypedText(prev => {
                if (prev.length < text.length) {
                    return text.substring(0, prev.length + 1);
                } else {
                    clearInterval(interval);
                    return prev;
                }
            });
        }, duration);

        return () => clearInterval(interval);
    }, [text, duration]);

    return typedText;
};

const API = 'http://localhost:8081';
const MAX_BET = 1000;

function BettingModal({ onBet, onCancel, balance }) {
    const [amount, setAmount] = useState('');

    const handleBetClick = () => {
        const betValue = parseInt(amount, 10);
        if (betValue <= 0 || isNaN(betValue)) {
            alert('올바른 베팅 금액을 입력해주세요.');
        } else if (betValue > balance) {
            alert('보유 포인트보다 많이 베팅할 수 없습니다.');
        } else if (betValue > MAX_BET) {
            alert(`최대 베팅 금액은 ${MAX_BET}P 입니다.`);
        } else {
            onBet(betValue);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-main border border-border-primary p-6 rounded-lg shadow-stark-glow flex flex-col gap-4 w-full max-w-sm animate-slide-in">
                <h2 className="text-xl font-bold text-primary tracking-widest uppercase">얼마를 거시겠습니까?</h2>
                <p className="text-sm text-text-main/70">보유 포인트: {balance} P</p>
                <p className="text-xs text-text-main/70">최대 베팅: {MAX_BET} P</p>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder={`베팅 금액 입력 (최대 ${MAX_BET}P)`}
                    className="bg-primary/10 border border-border-primary/50 p-2 text-black w-full focus:outline-none focus:border-primary"
                    max={MAX_BET}
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
    const [winner, setWinner] = useState(null);
    const [gameStatus, setGameStatus] = useState('IDLE');
    
    const [betAmount, setBetAmount] = useState(0);
    const [balance, setBalance] = useState(null);
    const [hearts, setHearts] = useState(3);
    const [isBetting, setIsBetting] = useState(false);
    const [roundResult, setRoundResult] = useState(null);
    const [gameOver, setGameOver] = useState(false);

    const [authStatus, setAuthStatus] = useState('loading');
    const [isUpdatingPoints, setIsUpdatingPoints] = useState(false);
    const [canPlay, setCanPlay] = useState(null);
    
    const [dialog, setDialog] = useState('');
    const typedDialog = useTypingEffect(dialog);

    const isBlackjack = playerScore === 21 && playerHand.length === 2;
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);

    // ── 초기화: 포인트 + 서버 게임 상태 복원 ──
    useEffect(() => {
        const init = async () => {
            try {
                const [pointRes, canPlayRes] = await Promise.all([
                    axios.get(`${API}/shop/point`, { withCredentials: true }),
                    axios.get(`${API}/blackjack/can-play`, { withCredentials: true })
                ]);

                if (pointRes.data.Status === 'Success') {
                    setBalance(pointRes.data.point);
                    setAuthStatus('authenticated');
                } else {
                    setAuthStatus('unauthenticated');
                    return;
                }

                const { canPlay: cp, hearts: h } = canPlayRes.data;
                setCanPlay(cp);
                if (cp && h < 3) {
                    setHearts(h);
                }
                if (!cp) setGameOver(true);

            } catch (err) {
                console.error("초기화 실패:", err);
                setAuthStatus('unauthenticated');
            }
        };
        init();
        
        const randomIndex = Math.floor(Math.random() * dialogBlackJack.length);
        setDialog(dialogBlackJack[randomIndex]);
    }, []);

    

    // ── 게임 진행 중 이탈 방지 ──
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (gameStatus === 'PLAYING' || gameStatus === 'DEALER_TURN' || gameStatus === 'BETTING') {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [gameStatus]);

    const stand = useCallback(() => {
        if (gameStatus !== 'PLAYING') return;
        setGameStatus('DEALER_TURN');
    }, [gameStatus]);

    const hit = () => {
        if (gameStatus !== 'PLAYING' || isUpdatingPoints) return;
        const newDeck = [...deck];
        const newCard = newDeck.pop();
        const newPlayerHand = [...playerHand, newCard];
        const newPlayerScore = calculateScore(newPlayerHand);
        setDeck(newDeck);
        setPlayerHand(newPlayerHand);
        setPlayerScore(newPlayerScore);
        if (newPlayerScore > 21) setGameStatus('DEALER_TURN');
    };

    const dealCards = useCallback(() => {
        setGameStatus('PLAYING');
        setWinner(null);
        setRoundResult(null);
        const newDeck = shuffleDeck(createDeck());
        const playerInitialHand = [newDeck.pop(), newDeck.pop()];
        const dealerInitialHand = [newDeck.pop(), { ...newDeck.pop(), hidden: true }];
        setPlayerHand(playerInitialHand);
        setDealerHand(dealerInitialHand);
        setDeck(newDeck);
        const initialPlayerScore = calculateScore(playerInitialHand);
        setPlayerScore(initialPlayerScore);
        setDealerScore(calculateScore(dealerInitialHand));
        if (initialPlayerScore === 21) stand();
    }, [stand]);

    // ── 게임 시작: 서버에 로그 생성 ──
    const handleStartBetting = async () => {
        if (gameOver || isUpdatingPoints || !canPlay) return;

        try {
            const res = await axios.post(`${API}/blackjack/start`, {}, { withCredentials: true });
            if (res.data.Status !== 'Success') {
                alert(res.data.Error || '게임 시작 실패');
                setGameStatus('IDLE'); 
                return;
            }
        } catch (err) {
            console.error('게임 시작 실패:', err);
            setGameStatus('IDLE');
            return;
        }

        setRoundResult(null);
        setGameStatus('BETTING');
        setIsBetting(true);
    };

    // ── 베팅 확정: 즉시 차감 ──
    const handlePlaceBet = async (amount) => {
        try {
            const res = await axios.post(`${API}/blackjack/bet`, { betAmount: amount }, { withCredentials: true });
            if (res.data.Status === 'Success') {
                setBetAmount(amount);
                setBalance(res.data.newBalance);
                setIsBetting(false);
                dealCards();
            } else {
                alert(res.data.Error || '베팅 실패');
            }
        } catch (err) {
            console.error('베팅 실패:', err);
            alert('베팅 처리 중 오류가 발생했습니다.');
        }
    };

    // ── 결과 처리 ──
    const processGameResult = useCallback(async (winnerResult, newHearts) => {
        setIsUpdatingPoints(true);

        let roundProfit = 0;
        if (winnerResult === 'PLAYER') roundProfit = betAmount;
        else if (winnerResult === 'PUSH') roundProfit = 0;
        else roundProfit = -betAmount;
        setRoundResult(roundProfit);

        try {
            const res = await axios.post(`${API}/blackjack/result`,
                { winnerResult, betAmount, newHearts },
                { withCredentials: true }
            );
            if (res.data.Status === 'Success') {
                setBalance(res.data.newBalance);
                if (newHearts <= 0) setCanPlay(false);
            } else {
                alert(res.data.Error || '결과 처리 실패');
            }
        } catch (err) {
            console.error('결과 처리 오류:', err);
            alert('서버와 통신 중 문제가 발생했습니다.');
        } finally {
            setIsUpdatingPoints(false);
            setGameStatus('ENDED');
        }
    }, [betAmount]);

    // ── 딜러 턴 ──
    useEffect(() => {
        if (gameStatus !== 'DEALER_TURN') return;
        const playDealerTurn = () => {
            let currentDealerHand = dealerHand.map(c => ({ ...c, hidden: false }));
            let currentDealerScore = calculateScore(currentDealerHand);
            let currentDeck = [...deck];

            if (playerScore <= 21) {
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

            let newHearts = hearts;
            if (winnerResult === 'DEALER') {
                newHearts = hearts - 1;
                setHearts(newHearts);
                if (newHearts <= 0) setGameOver(true);
            }

            processGameResult(winnerResult, newHearts);
        };

        const timer = setTimeout(playDealerTurn, 1000);
        return () => clearTimeout(timer);
    }, [gameStatus, dealerHand, deck, playerScore, playerHand.length, processGameResult, hearts]);

    // ── 자동 재시작 ──
    useEffect(() => {
        if (gameStatus === 'ENDED' && !gameOver && canPlay) {
            const timer = setTimeout(() => handleStartBetting(), 3000);
            return () => clearTimeout(timer);
        }
    }, [gameStatus, gameOver, canPlay]);

    if (authStatus === 'loading') {
        return <div className="min-h-screen bg-main flex items-center justify-center text-primary">Loading...</div>;
    }
    return (
        <div className={`min-h-screen p-4 relative overflow-hidden transition-all duration-500 bg-main font-one-store-mobile-gothic-body text-text-main ${isBlackjack ? 'bg-primary/10' : ''}`}>
      <header className="max-w-7xl mx-auto flex justify-between items-end border-b border-border-primary pt-4 pb-4 relative z-10 font-one-store-mobile-gothic-body">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 border-2 border-border-primary rotate-45 flex items-center justify-center bg-primary/10 dark:bg-cyan-950/20 shadow-stark-glow">
            <img src="/src/assets/image/logo_trans.png" alt="logo" className="w-full h-full object-contain -rotate-45" />
          </div>
          <div>
            <h1 className="text-4xl font-black italic font-nexon-warhaven tracking-tighter text-text-main uppercase drop-shadow-[0_0_10px_var(--color-primary-glow)]">36TH FLOOR</h1>
            <p className="text-[10px] text-primary/70 font-bold tracking-[0.4em] uppercase">Authorized Access Only // Sector_04</p>
          </div>
        </div>
        
        {/* 포인트 표시 조건부 렌더링 */}
{isLoggedIn ? (
  <div className="text-3xl font-one-store-mobile-gothic-body font-black text-text-main italic tracking-widest animate-fade-in">
    {balance !== null ? balance.toLocaleString() : '...'} <span className="text-primary/80 text-sm italic">CR</span>
  </div>
) : (
  <div className="text-sm font-bold text-primary/60 italic tracking-tighter px-4 py-2 bg-primary/5 rounded-sm">
    로그인 후 플레이가 가능합니다
  </div>
)}
      </header>
            {isBetting && (
                <BettingModal
                    balance={balance}
                    onBet={handlePlaceBet}
                    onCancel={() => { setIsBetting(false); setGameStatus('IDLE'); }}
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

            <div className="fixed inset-0 opacity-[0.05] pointer-events-none bg-stark-grid" style={{ backgroundSize: '40px 40px' }} />

            <main className="max-w-7xl mx-auto mt-12 grid grid-cols-12 gap-8 relative z-10 px-4">
                <section className="col-span-12 lg:col-span-9 flex flex-col items-center justify-center py-10 space-y-16">
                    <div className="flex flex-col items-center">
                        <div className="text-[10px] text-text-main/50 font-black mb-4 tracking-[0.5em] uppercase italic">
                            딜러 (현재 점수: {gameStatus === 'ENDED' || gameStatus === 'DEALER_TURN' ? dealerScore : '?'})
                        </div>
                        <div className="flex gap-4 h-36 items-center overflow-x-auto p-4">
                            {dealerHand.map((card) => (
                                <div key={card.id}
                                    className={`w-24 h-36 border-2 flex-shrink-0 flex items-center justify-center relative transition-all duration-500 transform animate-slide-in overflow-hidden
                                    ${card.hidden ? 'border-border-primary/20 bg-primary/5' : 'border-border-primary bg-main shadow-stark-glow'}`}
                                >
                                    <span className={`text-4xl font-black italic ${card.hidden ? 'text-primary/30' : 'text-text-main'}`}>
                                        {card.hidden ? '?' : card.value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative font-one-store-mobile-gothic-body">
                        {gameStatus === 'ENDED' && winner && (
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-max px-4 py-1 bg-primary text-main text-lg font-black italic animate-bounce">
                                {winner === 'PLAYER' && '승리!'}
                                {winner === 'DEALER' && (playerScore > 21 ? '버스트!' : '패배')}
                                {winner === 'PUSH' && '무승부'}
                            </div>
                        )}
                        <div className={`text-xl font-black italic px-8 py-2 border-y-2 border-border-primary/20 transition-all ${isBlackjack ? 'text-primary border-border-primary bg-primary/10' : ''}`}>
                            현재 점수: {playerScore}
                        </div>
                    </div>

                    <div className="flex flex-col items-center font-one-store-mobile-gothic-body">
                        <div className="flex gap-4 h-36 items-center overflow-x-auto p-4">
                            {playerHand.map((card) => (
                                <div key={card.id} className="w-24 h-36 border-2 flex-shrink-0 border-border-primary bg-main flex items-center justify-center relative shadow-stark-glow animate-slide-in overflow-hidden">
                                    <span className="text-4xl font-black italic text-text-main">{card.value}</span>
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

                <aside className="col-span-12 lg:col-span-3 flex flex-col justify-between lg:justify-start gap-6 mb-12 lg:mb-0 font-one-store-mobile-gothic-body">
                    <div className="text-center">
                        <div className="blackjack-container my-1 p-3">
                            <div className="blackjack-glow"></div>
                            <img src="/images/NPCS/blackjackNPC.gif" alt="Blackjack Dealer" className="sway-animation w-48 h-48 object-contain" />
                        </div>
                        <p className="text-[10px] font-black tracking-widest text-primary/60 opacity-60 uppercase mb-1">Unit_B3AR-B</p>
                        <h3 className="text-xl font-bold text-text-main tracking-widest uppercase italic">B3AR-B</h3>
                        
                        <div className="h-32 text-center mt-4 mb-4 border border-border-primary/30 flex items-center justify-center">
                            <p className="text-md font-one-store-mobile-gothic-body text-text-main/70 m-4">"{typedDialog}"</p>
                        </div>

                        <div className="text-center mb-4 p-4 border border-border-primary/30">
                            <p className="text-primary text-4xl font-black h-12 flex items-center justify-center">
                                {betAmount > 0 && gameStatus !== 'IDLE' ? `${betAmount} P` : '...'}
                            </p>
                            {betAmount > 0 && gameStatus === 'PLAYING' && (
                                <div className="text-xs mt-2 grid grid-cols-2 gap-1">
                                    <p className="text-green-400">WIN: +{betAmount} P</p>
                                    <p className="text-red-400">LOSE: -{betAmount} P</p>
                                </div>
                            )}
                            <p className="text-sm font-one-store-mobile-gothic-body text-text-main/50 mt-1">
                                보유 포인트: {balance === null ? '...' : `${balance} P`}
                            </p>
                            {canPlay === false && (
                                <p className="text-lg font-one-store-mobile-gothic-body text-red-400/70 mt-2 tracking-widest">오늘은 이미 플레이 했네?</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <button
        onClick={handleStartBetting}
        // 로그인 안 되어있으면 무조건 비활성화
        disabled={!isLoggedIn || (gameStatus !== 'IDLE' && gameStatus !== 'ENDED') || gameOver || isUpdatingPoints || !canPlay}
        className={`col-span-2 py-8 font-black uppercase text-sm tracking-widest transition-all shadow-stark-glow 
            ${!isLoggedIn 
                ? 'bg-primary/20 text-primary/40 cursor-not-allowed opacity-50' 
                : 'bg-primary text-main hover:bg-text-main hover:text-primary active:scale-95'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
        {/* 로그인 상태에 따른 텍스트 분기 */}
        {!isLoggedIn ? '로그인 필요' 
            : isUpdatingPoints ? '처리 중...'
            : gameOver ? 'GAME OVER'
            : canPlay === false ? '오늘의 게임 완료'
            : (gameStatus === 'IDLE' || gameStatus === 'ENDED' ? '새 게임' : '게임 진행 중')}
    </button>

    <button 
        onClick={hit} 
        disabled={!isLoggedIn || gameStatus !== 'PLAYING' || isUpdatingPoints} 
        className="py-4 border border-border-primary/30 hover:border-border-primary text-text-main/50 hover:text-primary font-black uppercase text-[16px] transition-all disabled:opacity-50"
    >
        히트
    </button>
    
    <button 
        onClick={stand} 
        disabled={!isLoggedIn || gameStatus !== 'PLAYING' || isUpdatingPoints} 
        className="py-4 border border-border-primary/30 hover:border-border-primary text-text-main/50 hover:text-primary font-black uppercase text-[16px] transition-all disabled:opacity-50"
    >
        스탠드
    </button>
                        </div>
                    </div>
                </aside>
            </main>

            <footer className="fixed bottom-0 left-0 w-full px-6 py-2 border-t border-border-primary/20 bg-main/80 backdrop-blur-sm flex justify-between items-center text-[8px] font-bold text-primary/70 uppercase tracking-widest">
                <div className="flex gap-8">
                    <span>ROUND P/L:
                        <span className={`ml-2 ${roundResult > 0 ? 'text-green-400' : roundResult < 0 ? 'text-red-400' : 'text-primary/70'}`}>
                            {roundResult === null ? '-' : roundResult > 0 ? `+${roundResult}` : roundResult} P
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