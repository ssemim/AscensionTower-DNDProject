import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import items from '../../pages/Shop/item.js';

const API = 'http://localhost:8081';

export default function ReceiveAndUseModal({
  title, onConfirm, onClose, confirmText,
  from, itemName, quantity, description,
  invId, itemId, isGacha, isFriendItem, onUseSuccess
}) {

  const [phase, setPhase] = useState('confirm');
  const [rewardedItem, setRewardedItem] = useState(null);
  const [error, setError]               = useState(null);

  const [searchQuery, setSearchQuery]   = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searching, setSearching]       = useState(false);

  const debounceRef = useRef(null);

  // ── 자동완성: 입력할 때마다 300ms 디바운스로 검색 ──
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      handleSearch(searchQuery);
    }, 200);
    return () => clearTimeout(debounceRef.current);
  }, [searchQuery]);

  // ── 유저 검색 ──────────────────────────────
  const handleSearch = async (q) => {
    setSearching(true);
    setError(null);
    try {
      const res = await axios.get(`${API}/members/search`, {
        params: { q: q ?? searchQuery },
        withCredentials: true,
      });
      if (res.data.Status === 'Success') {
        setSearchResults(res.data.members);
      } else {
        setError(res.data.Error || '검색 실패');
      }
    } catch {
      setError('서버 오류가 발생했습니다.');
    } finally {
      setSearching(false);
    }
  };

  // ── 아이템 사용 ────────────────────────────
  const handleUse = async (targetId) => {

    if (isFriendItem) {
      if (!targetId) { setError('추가할 유저를 선택해주세요.'); return; }
      setPhase('rolling');
      try {
        const res = await axios.post(
          `${API}/mypage/inventory/use`,
          { inv_id: invId, item_id: itemId, target_id: targetId },
          { withCredentials: true }
        );
        if (res.data.Status !== 'Success') {
          setError(res.data.Error || '사용 실패');
          setPhase('search');
          return;
        }
        setTimeout(() => setPhase('result'), 900);
        if (onUseSuccess) onUseSuccess();
      } catch {
        setError('서버 오류가 발생했습니다.');
        setPhase('search');
      }
      return;
    }

    if (isGacha) {
      setPhase('rolling');
      try {
        const res = await axios.post(
          `${API}/mypage/inventory/use`,
          { inv_id: invId, item_id: itemId },
          { withCredentials: true }
        );
        if (res.data.Status !== 'Success') {
          setError(res.data.Error || '사용 실패');
          setPhase('confirm');
          return;
        }
        const found = items.find(i => i.id === res.data.rewarded_item_id);
        setRewardedItem(found || { id: res.data.rewarded_item_id, name: `아이템 #${res.data.rewarded_item_id}`, desc: '' });
        setTimeout(() => setPhase('result'), 1200);
        if (onUseSuccess) onUseSuccess();
      } catch {
        setError('서버 오류가 발생했습니다.');
        setPhase('confirm');
      }
      return;
    }

    // 일반 아이템
    setPhase('rolling');
    try {
      const res = await axios.post(
        `${API}/mypage/inventory/use`,
        { inv_id: invId, item_id: itemId },
        { withCredentials: true }
      );
      if (res.data.Status !== 'Success') {
        setError(res.data.Error || '사용 실패');
        setPhase('confirm');
        return;
      }
      setTimeout(() => setPhase('done'), 900);
      if (onUseSuccess) onUseSuccess();
    } catch {
      setError('서버 오류가 발생했습니다.');
      setPhase('confirm');
    }
  };

  // 친구 / 일반 유저 분리
  const friendResults  = searchResults.filter(u => u.is_friend === 1);
  const otherResults   = searchResults.filter(u => u.is_friend !== 1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-main border border-border-primary rounded-xl p-8 max-w-sm w-full shadow-stark-glow relative overflow-hidden">
        <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />

        {/* ── 확인 단계 ── */}
        {phase === 'confirm' && (
          <>
            <h3 className="text-primary font-bold text-lg tracking-widest mb-4">{title}</h3>
            {from && (
              <p className="text-text-main/70 text-sm font-one-store-mobile-gothic-body mb-1">
                from: <span className="text-primary">{from}</span>
              </p>
            )}
            {itemName && (
              <p className="text-text-main/70 text-sm font-one-store-mobile-gothic-body mb-1">
                item: <span className="text-primary">{itemName}</span> {quantity && `x${quantity}`}
              </p>
            )}
            {description && (
              <p className="text-text-main/50 text-xs font-one-store-mobile-gothic-body mt-3 border-t border-border-primary/30 pt-3">
                "{description}"
              </p>
            )}
            {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => isFriendItem ? setPhase('search') : handleUse(null)}
                className="flex-1 bg-primary hover:bg-primary/80 text-white font-bold py-2 rounded-lg transition-colors tracking-widest text-sm"
              >
                {confirmText}
              </button>
              <button
                onClick={onClose}
                className="flex-1 border border-border-primary/50 text-text-main/50 hover:text-text-main font-bold py-2 rounded-lg transition-colors text-sm"
              >
                CLOSE
              </button>
            </div>
          </>
        )}

        {/* ── 친구 검색 단계 ── */}
        {phase === 'search' && (
          <>
            <h3 className="text-primary font-bold text-lg tracking-widest mb-4">FRIEND SEARCH</h3>
            <p className="text-text-main/50 text-xs mb-3">추가할 유저의 이름을 검색하세요.</p>

            {/* 입력하면 자동으로 검색됨 — GO 버튼은 보조용 */}
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setSelectedUser(null);
                }}
                onKeyDown={e => e.key === 'Enter' && handleSearch(searchQuery)}
                placeholder="캐릭터 이름 입력..."
                autoFocus
                className="flex-1 bg-main border border-border-primary/50 rounded-lg px-3 py-2 text-text-main text-sm outline-none focus:border-primary transition-colors"
              />
              {/* 로딩 스피너 또는 GO 버튼 */}
              <div className="flex items-center justify-center w-10">
                {searching
                  ? <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  : <span className="text-primary/40 text-xs">✦</span>
                }
              </div>
            </div>

            {/* 검색 결과 — 친구 / 일반 섹션으로 구분 */}
            {searchResults.length > 0 && (
              <ul className="border border-border-primary/30 rounded-lg overflow-hidden mb-3 max-h-52 overflow-y-auto">

                {/* 친구 섹션 */}
                {friendResults.length > 0 && (
                  <>
                    <li className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold tracking-widest">
                      FRIENDS ({friendResults.length})
                    </li>
                    {friendResults.map(user => (
                      <UserRow
                        key={user.id}
                        user={user}
                        selected={selectedUser?.id === user.id}
                        onClick={() => setSelectedUser(user)}
                        isFriend
                      />
                    ))}
                  </>
                )}

                {/* 일반 유저 섹션 */}
                {otherResults.length > 0 && (
                  <>
                    {friendResults.length > 0 && (
                      <li className="px-3 py-1 bg-border-primary/10 text-text-main/40 text-[10px] font-bold tracking-widest">
                        OTHERS
                      </li>
                    )}
                    {otherResults.map(user => (
                      <UserRow
                        key={user.id}
                        user={user}
                        selected={selectedUser?.id === user.id}
                        onClick={() => setSelectedUser(user)}
                        isFriend={false}
                      />
                    ))}
                  </>
                )}
              </ul>
            )}

            {/* 결과 없음 */}
            {searchResults.length === 0 && searchQuery && !searching && (
              <p className="text-text-main/30 text-xs text-center py-3">검색 결과가 없습니다.</p>
            )}

            {/* 선택된 유저 미리보기 */}
            {selectedUser && (
              <div className="flex items-center gap-2 px-3 py-2 mb-2 border border-primary/30 rounded-lg bg-primary/5">
                <span className="text-primary text-xs">✦</span>
                <span className="text-text-main text-sm font-bold">{selectedUser.char_name}</span>
                <span className="text-text-main/40 text-xs ml-auto">선택됨</span>
              </div>
            )}

            {error && <p className="text-red-400 text-xs mt-1 mb-2">{error}</p>}

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => selectedUser && handleUse(selectedUser.id)}
                disabled={!selectedUser}
                className="flex-1 bg-primary hover:bg-primary/80 disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold py-2 rounded-lg transition-colors tracking-widest text-sm"
              >
                ADD
              </button>
              <button
                onClick={() => { setPhase('confirm'); setError(null); setSelectedUser(null); setSearchResults([]); setSearchQuery(''); }}
                className="flex-1 border border-border-primary/50 text-text-main/50 hover:text-text-main font-bold py-2 rounded-lg transition-colors text-sm"
              >
                BACK
              </button>
            </div>
          </>
        )}

        {/* ── 롤링 연출 ── */}
        {phase === 'rolling' && (
          <div className="flex flex-col items-center justify-center py-8 gap-4">
            <div className="text-4xl animate-spin">✦</div>
            <p className="text-primary font-bold tracking-widest text-sm animate-pulse">
              {isFriendItem ? 'CONNECTING...' : isGacha ? 'OPENING...' : 'USING...'}
            </p>
            <div className="w-full bg-border-primary/20 rounded-full h-1 mt-2 overflow-hidden">
              <div
                className="h-full bg-primary rounded-full"
                style={{ animation: 'progressBar 0.9s ease-in-out forwards' }}
              />
            </div>
            <div className="flex gap-1 mt-1">
              {[0,1,2].map(i => (
                <div key={i} className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
            <style>{`@keyframes progressBar { from { width:0% } to { width:100% } }`}</style>
          </div>
        )}

        {/* ── 일반 아이템 사용 완료 (자동 닫힘 없음) ── */}
        {phase === 'done' && (
          <div className="flex flex-col items-center gap-4">
            <div className="text-4xl text-primary">✦</div>
            <h3 className="text-primary font-bold text-lg tracking-widest">ITEM USED!</h3>
            <div className="text-center border border-border-primary/30 rounded-lg p-4 w-full bg-primary/5">
              <p className="text-text-main font-bold font-one-store-mobile-gothic-body text-base">{itemName}</p>
              <p className="text-text-main/50 text-xs mt-1">x1 사용 완료</p>
            </div>
            {description && (
              <p className="text-text-main/40 text-xs font-one-store-mobile-gothic-body text-center">"{description}"</p>
            )}
            <button
              onClick={onClose}
              className="mt-2 w-full bg-primary/10 border border-primary/50 text-primary hover:bg-primary/20 font-bold py-2 rounded-lg transition-colors text-sm tracking-widest"
            >
              CONFIRM
            </button>
          </div>
        )}

        {/* ── 가챠 결과 ── */}
        {phase === 'result' && !isFriendItem && rewardedItem && (
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

        {/* ── 친구 추가 결과 ── */}
        {phase === 'result' && isFriendItem && (
          <div className="flex flex-col items-center gap-4">
            <div className="text-4xl">✦</div>
            <h3 className="text-primary font-bold text-lg tracking-widest">FRIEND ADDED!</h3>
            {selectedUser && (
              <>
                {selectedUser.image_url
                  ? <img src={selectedUser.image_url} alt={selectedUser.char_name} className="w-16 h-16 rounded-full object-cover border border-primary/50" />
                  : <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center text-primary text-xl">?</div>
                }
                <p className="text-text-main font-bold font-one-store-mobile-gothic-body text-lg">{selectedUser.char_name}</p>
              </>
            )}
            <p className="text-text-main/50 text-xs">친구 목록에 추가되었습니다.</p>
            <button onClick={onClose} className="mt-2 w-full border border-border-primary/50 text-text-main/50 hover:text-text-main font-bold py-2 rounded-lg transition-colors text-sm">CLOSE</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── 유저 행 컴포넌트 ──────────────────────────
function UserRow({ user, selected, onClick, isFriend }) {
  return (
    <li
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2 cursor-pointer transition-colors
        ${selected
          ? 'bg-primary/20 border-l-2 border-primary'
          : isFriend
            ? 'hover:bg-primary/10 border-l-2 border-primary/30'
            : 'hover:bg-primary/10 border-l-2 border-transparent'
        }`}
    >
      {/* 아바타 */}
      {user.image_url
        ? <img src={user.image_url} alt={user.char_name} className="w-7 h-7 rounded-full object-cover border border-border-primary/50 flex-shrink-0" />
        : <div className="w-7 h-7 rounded-full bg-primary/20 border border-border-primary/50 flex items-center justify-center text-primary text-xs flex-shrink-0">?</div>
      }

      {/* 이름 + 친구 뱃지 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <p className="text-text-main text-sm font-bold truncate">{user.char_name}</p>
          {isFriend && (
            <span className="flex-shrink-0 text-[9px] font-bold text-primary bg-primary/15 border border-primary/30 rounded px-1 py-px tracking-wider">
              FRIEND
            </span>
          )}
        </div>
      </div>

      {selected && <span className="text-primary text-xs flex-shrink-0">✦</span>}
    </li>
  );
}