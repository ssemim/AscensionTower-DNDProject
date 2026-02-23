export const SUITS = ['♠', '♣', '♥', '♦'];
export const VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

// 1. 덱 생성
export const createDeck = () => {
  // 고유 ID를 포함하여 각 카드를 객체로 생성
  return SUITS.flatMap(suit => 
    VALUES.map(value => ({ suit, value, id: `${value}-${suit}` }))
  );
};

// 2. 덱 셔플 (Fisher-Yates 알고리즘)
export const shuffleDeck = (deck) => {
  let currentIndex = deck.length, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [deck[currentIndex], deck[randomIndex]] = [deck[randomIndex], deck[currentIndex]];
  }

  return deck;
};

// 3. 핸드 점수 계산
export const calculateScore = (hand) => {
  if (!hand || hand.length === 0) {
    return 0;
  }

  let score = 0;
  let aceCount = 0;

  for (const card of hand) {
    // 숨겨진 카드는 점수 계산에서 제외
    if (card.hidden) continue;

    if (card.value === 'A') {
      aceCount += 1;
      score += 11;
    } else if (['J', 'Q', 'K'].includes(card.value)) {
      score += 10;
    } else {
      score += parseInt(card.value);
    }
  }

  while (score > 21 && aceCount > 0) {
    score -= 10;
    aceCount -= 1;
  }

  return score;
};

// 4. 승자 결정
export const getWinner = (playerScore, dealerScore, playerHandLength) => {
  const isPlayerBlackjack = playerScore === 21 && playerHandLength === 2;

  if (playerScore > 21) return 'DEALER';
  if (dealerScore > 21) return 'PLAYER';
  if (isPlayerBlackjack && dealerScore !== 21) return 'PLAYER';
  if (playerScore === dealerScore) return 'PUSH';
  
  return playerScore > dealerScore ? 'PLAYER' : 'DEALER';
};