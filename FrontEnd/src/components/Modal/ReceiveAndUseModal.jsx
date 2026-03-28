import { useState } from 'react';
import axios from 'axios';
import items from '../../pages/Shop/item.js'; // 아이템 정보 목록 (id, name, desc, src 등)

const API = 'http://localhost:8081';

export default function ReceiveAndUseModal({ title, onConfirm, onClose, confirmText, from, itemName, quantity, description, invId, itemId, isGacha, onUseSuccess }) {

  const [phase, setPhase] = useState('confirm'); // 'confirm' | 'rolling' | 'result'
  const [rewardedItem, setRewardedItem] = useState(null);
  const [error, setError] = useState(null);

  const handleUse = async () => {
    // 가챠 아이템이 아니면 기존 onConfirm 사용
    if (!isGacha) { onConfirm(); return; }

    setPhase('rolling');
    try {
      const res = await axios.post(`${API}/mypage/inventory/use`, { inv_id: invId, item_id: itemId }, { withCredentials: true });
      if (res.data.Status !== 'Success') { setError(res.data.Error || '사용 실패'); setPhase('confirm'); return; }

      // 랜덤 결과 아이템 찾기
      const found = items.find(i => i.id === res.data.rewarded_item_id);
      setRewardedItem(found || { id: res.data.rewarded_item_id, name: `아이템 #${res.data.rewarded_item_id}`, desc: '' });

      // 연출: 1.2초 롤링 후 결과 표시
      setTimeout(() => setPhase('result'), 1200);

      if (onUseSuccess) onUseSuccess();
    } catch (err) {
      console.error(err);
      setError('서버 오류가 발생했습니다.');
      setPhase('confirm');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-main border border-border-primary rounded-xl p-8 max-w-sm w-full shadow-stark-glow relative overflow-hidden">
        <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />

        {/* 확인 단계 */}
        {phase === 'confirm' && (
          <>
            <h3 className="text-primary font-bold text-lg tracking-widest mb-4">{title}</h3>
            {from && <p className="text-text-main/70 text-sm font-one-store-mobile-gothic-body mb-1">from: <span className="text-primary">{from}</span></p>}
            {itemName && (
              <p className="text-text-main/70 text-sm font-one-store-mobile-gothic-body mb-1">
                item: <span className="text-primary">{itemName}</span> {quantity && `x${quantity}`}
              </p>
            )}
            {description && (
              <p className="text-text-main/50 text-xs font-one-store-mobile-gothic-body mt-3 border-t border-border-primary/30 pt-3">"{description}"</p>
            )}
            {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
            <div className="flex gap-3 mt-6">
              <button onClick={handleUse} className="flex-1 bg-primary hover:bg-primary/80 text-white font-bold py-2 rounded-lg transition-colors tracking-widest text-sm">{confirmText}</button>
              <button onClick={onClose} className="flex-1 border border-border-primary/50 text-text-main/50 hover:text-text-main font-bold py-2 rounded-lg transition-colors text-sm">CLOSE</button>
            </div>
          </>
        )}

        {/* 롤링 연출 */}
        {phase === 'rolling' && (
          <div className="flex flex-col items-center justify-center py-8 gap-4">
            <div className="text-4xl animate-spin">✦</div>
            <p className="text-primary font-bold tracking-widest text-sm animate-pulse">OPENING...</p>
            <div className="flex gap-1 mt-2">
              {[0,1,2].map(i => (
                <div key={i} className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}

        {/* 결과 */}
        {phase === 'result' && rewardedItem && (
          <div className="flex flex-col items-center gap-4">
            <h3 className="text-primary font-bold text-lg tracking-widest">ITEM GET!</h3>
            <div className="w-24 h-24 border border-border-primary bg-primary/10 flex items-center justify-center rounded-lg overflow-hidden">
              {rewardedItem.src
                ? <img src={rewardedItem.src} alt={rewardedItem.name} className="w-full h-full object-cover" />
                : <span className="text-primary/30 text-xs">[ IMG ]</span>
              }
            </div>
            <p className="text-text-main font-bold font-one-store-mobile-gothic-body text-lg">{rewardedItem.name}</p>
            {rewardedItem.desc && <p className="text-text-main/50 text-xs font-one-store-mobile-gothic-body text-center">{rewardedItem.desc}</p>}
            <button onClick={onClose} className="mt-2 w-full border border-border-primary/50 text-text-main/50 hover:text-text-main font-bold py-2 rounded-lg transition-colors text-sm">CLOSE</button>
          </div>
        )}
      </div>
    </div>
  );
}