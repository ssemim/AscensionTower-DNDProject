import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '../ThemeProvider/ThemeProvider';

const API = 'http://localhost:8081';

const BuyItemModal = ({
  isOpen,
  type = 'buy',
  onClose,
  items = [],
  currentPoint = 0,
  onSuccess,
  moduleId = "LAB-OS_V2.2.0",
}) => {
  const { isDark } = useTheme();
  const [giftTarget, setGiftTarget] = useState('');       // 실제 전송할 id
  const [giftTargetName, setGiftTargetName] = useState(''); // 표시용 char_name
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [giftMessage, setGiftMessage] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const searchRef = useRef(null);
  const debounceRef = useRef(null);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 검색어 디바운스 처리
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    setGiftTarget('');
    setGiftTargetName('');

    clearTimeout(debounceRef.current);
    if (!val.trim()) { setSearchResults([]); setShowDropdown(false); return; }

    debounceRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await axios.get(`${API}/members/search?q=${encodeURIComponent(val)}`, { withCredentials: true });
        if (res.data.Status === 'Success') {
          setSearchResults(res.data.members);
          setShowDropdown(true);
        }
      } catch (err) {
        console.error('검색 실패:', err);
      } finally {
        setIsSearching(false);
      }
    }, 300);
  };

  const handleSelectMember = (member) => {
    setGiftTarget(member.id);
    setGiftTargetName(member.char_name);
    setSearchQuery(member.char_name);
    setShowDropdown(false);
  };

  if (!isOpen) return null;

  const isBuy = type === 'buy';

  // 프론트 id 8 = DB item_id 7 (1씩 차이)
  const hasPlaylistItem = items.some(item => item.id === 8 || item.id === '8');

  const isValidYoutubeUrl = (url) => {
    return /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}/.test(url);
  };
  const youtubeValid = !hasPlaylistItem || !youtubeUrl || isValidYoutubeUrl(youtubeUrl);

  const totalPrice = items.reduce(
    (sum, itm) => sum + parseFloat(String(itm.price).replace(/,/g, '')) * itm.quantity,
    0
  );

  const isPointEnough = currentPoint >= totalPrice;

  const config = {
    buy:  { title: "PURCHASE_CONFIRMATION", status: "ORDER_PENDING",  headline: "구매 확인", ackLabel: "결제하기" },
    gift: { title: "GIFT_TRANSMISSION",     status: "TARGET_REQUIRED", headline: "선물하기", ackLabel: "선물 전송" },
  }[type];

  const theme = {
    overlay:     isDark ? 'bg-slate-950/80' : 'bg-slate-900/40',
    container:   isDark ? 'bg-main border-slate-700' : 'bg-main border-blue-200',
    textMain:    isDark ? 'text-white' : 'text-slate-900',
    textSub:     isDark ? 'text-slate-400' : 'text-slate-500',
    metaBox:     isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50/50 border-slate-100',
    footerBorder:isDark ? 'border-slate-800' : 'border-slate-50',
    itemRow:     isDark ? 'border-slate-700' : 'border-slate-100',
    input:       isDark
      ? 'bg-slate-800 border-slate-600 text-white placeholder-slate-500 focus:border-primary'
      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-primary',
  };

  const handleSubmit = async () => {
    setErrorMsg('');

    // 유효성 검사
    if (!isBuy && !giftTarget.trim()) {
      setErrorMsg('수신자 ID를 입력해주세요.');
      return;
    }
    if (hasPlaylistItem && !youtubeUrl) {
      setErrorMsg('플레이리스트 아이템은 YouTube URL이 필요합니다.');
      return;
    }
    if (hasPlaylistItem && !isValidYoutubeUrl(youtubeUrl)) {
      setErrorMsg('유효하지 않은 YouTube URL입니다.');
      return;
    }
    if (!isPointEnough) {
      setErrorMsg('포인트가 부족합니다.');
      return;
    }

    // DB item_id로 변환 (프론트 id - 1)
    const convertedItems = items.map(item => ({
      db_item_id: (parseInt(item.id) - 1),
      quantity: item.quantity,
      price: parseFloat(String(item.price).replace(/,/g, '')),
    }));

    setIsLoading(true);
    try {
      const endpoint = isBuy ? '/shop/buy' : '/shop/gift';
      const payload = isBuy
        ? { items: convertedItems, youtubeUrl: hasPlaylistItem ? youtubeUrl : null }
        : { items: convertedItems, giftTarget, giftMessage, youtubeUrl: hasPlaylistItem ? youtubeUrl : null };

      const res = await axios.post(`${API}${endpoint}`, payload, { withCredentials: true });

      if (res.data.Status === 'Success') {
        const newPoint = (currentPoint || 0) - totalPrice;
        onSuccess?.(newPoint);
        onClose();
      } else {
        setErrorMsg(res.data.Error || '처리 중 오류가 발생했습니다.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('서버 연결에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-['Space_Grotesk',sans-serif]">
      <div className={`fixed inset-0 ${theme.overlay} backdrop-blur-sm transition-opacity`} onClick={onClose} />

      <div
        className={`relative w-full max-w-2xl ${theme.container} border shadow-[0_20px_50px_rgba(37,99,235,0.15)] overflow-hidden animate-in fade-in zoom-in duration-300`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(#2563eb 1px, transparent 1px), linear-gradient(90deg, #2563eb 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

        {/* Header */}
        <div className="relative z-10 flex justify-between items-center px-6 py-3 bg-primary text-white">
          <div className="flex items-center gap-3">
            <div className="flex gap-0.5">
              <div className="w-1 h-3 bg-white/40"></div>
              <div className="w-1 h-3 bg-white"></div>
              <div className="w-1 h-3 bg-white/40"></div>
            </div>
            <span className="text-[11px] font-black tracking-[0.3em] uppercase">{config.title}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-white/40 rounded-full animate-pulse"></div>
              <div className="w-1 h-1 bg-white rounded-full"></div>
            </div>
            <button onClick={onClose} className="hover:rotate-90 transition-transform duration-200 opacity-80 hover:opacity-100">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 p-8 md:p-10">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-primary"></div>
              <span className="text-[10px] font-bold text-primary tracking-widest uppercase">{config.status}</span>
            </div>
            <h2 className={`text-3xl md:text-4xl font-black italic ${theme.textMain} tracking-tighter leading-none border-b-2 ${isDark ? 'border-white/5' : 'border-slate-900/5'} pb-4`}>
              {config.headline}
            </h2>
          </div>

          {/* 아이템 목록 */}
          <div className={`${theme.textSub} text-sm leading-relaxed mb-6`}>
            {items.length === 0 ? (
              <p className="italic opacity-60">담긴 아이템이 없습니다.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {items.map(item => (
                  <div key={item.id} className={`flex justify-between items-center py-2 border-b ${theme.itemRow}`}>
                    <span className={`font-bold ${theme.textMain}`}>{item.name}</span>
                    <span className="text-xs">x{item.quantity} · {parseFloat(String(item.price).replace(/,/g, '')) * item.quantity} CR</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 선물하기 - 수신자 + 쪽지 */}
          {!isBuy && (
            <>
              <div className="mb-4" ref={searchRef}>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">수신자 검색</label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
                    placeholder="캐릭터 이름으로 검색..."
                    className={`w-full border px-4 py-3 text-sm font-mono outline-none transition-colors ${theme.input}`}
                    autoComplete="off"
                  />
                  {/* 검색 중 표시 */}
                  {isSearching && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                  {/* 선택된 유저 표시 */}
                  {giftTarget && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-primary text-xs font-bold">✓</div>
                  )}

                  {/* 드롭다운 */}
                  {showDropdown && searchResults.length > 0 && (
                    <div className={`absolute top-full left-0 right-0 z-50 border ${isDark ? 'bg-main border-slate-700' : 'bg-main border-slate-200'} shadow-stark-glow max-h-48 overflow-y-auto`}>
                      {searchResults.map((member, idx) => (
                        <button
                          key={member.id}
                          onMouseDown={(e) => { e.preventDefault(); handleSelectMember(member); }}
                          className={`w-full flex items-center gap-3 px-4 py-2 text-left transition-colors hover:bg-primary/10
                            ${idx > 0 && !searchResults[idx-1].is_friend && member.is_friend ? '' : ''}
                          `}
                        >
                          {/* 친구/일반 구분선 */}
                          {idx > 0 && !searchResults[idx-1].is_friend && member.is_friend && (
                            <div className="absolute left-0 right-0 h-px bg-border-primary/30" />
                          )}
                          {/* 프로필 이미지 */}
                          <div className="w-7 h-7 rounded-full bg-primary/10 flex-shrink-0 overflow-hidden">
                            {member.image_url
                              ? <img src={`${API}${member.image_url}`} alt={member.char_name} className="w-full h-full object-cover" />
                              : <span className="w-full h-full flex items-center justify-center text-primary/50 text-xs">?</span>
                            }
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{member.char_name}</p>
                          </div>
                          {/* 친구 뱃지 */}
                          {member.is_friend === 1 && (
                            <span className="text-[9px] font-bold text-primary tracking-widest uppercase flex-shrink-0">FRIEND</span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* 검색 결과 없음 */}
                  {showDropdown && searchResults.length === 0 && searchQuery && !isSearching && (
                    <div className={`absolute top-full left-0 right-0 z-50 border ${isDark ? 'bg-main border-slate-700' : 'bg-main border-slate-200'} px-4 py-3`}>
                      <p className="text-xs text-text-main/50 font-pf-stardust">검색 결과가 없습니다.</p>
                    </div>
                  )}
                </div>
                {/* 선택된 유저 확인 */}
                {giftTarget && (
                  <p className="mt-1 text-[10px] text-primary tracking-widest uppercase">// TARGET: {giftTargetName} ({giftTarget})</p>
                )}
              </div>
              <div className="mb-6">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                  쪽지 <span className="text-primary/60">// 선택사항</span>
                </label>
                <textarea
                  value={giftMessage}
                  onChange={(e) => setGiftMessage(e.target.value)}
                  placeholder="수신자에게 전달할 메시지를 입력하세요..."
                  maxLength={200}
                  rows={3}
                  className={`w-full border px-4 py-3 text-sm font-mono outline-none transition-colors resize-none ${theme.input}`}
                />
                <p className="mt-1 text-right text-[10px] text-slate-400 tracking-widest">{giftMessage.length} / 200</p>
              </div>
            </>
          )}

          {/* 플레이리스트 아이템 - YouTube URL */}
          {hasPlaylistItem && (
            <div className="mb-6">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                YouTube URL <span className="text-primary">// PLAYLIST_ITEM DETECTED</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-red-500">
                    <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.8zM9.7 15.5V8.5l6.3 3.5-6.3 3.5z"/>
                  </svg>
                </div>
                <input
                  type="url"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className={`w-full border pl-10 pr-4 py-3 text-sm font-mono outline-none transition-colors ${theme.input} ${youtubeUrl && !youtubeValid ? 'border-red-500' : ''}`}
                />
              </div>
              {youtubeUrl && !youtubeValid && <p className="mt-1 text-[10px] text-red-500 tracking-widest uppercase">유효하지 않은 YouTube URL입니다</p>}
              {youtubeUrl && youtubeValid && <p className="mt-1 text-[10px] text-primary tracking-widest uppercase">// URL_VERIFIED</p>}
            </div>
          )}

          {/* 메타 정보 */}
          <div className={`grid grid-cols-2 border ${theme.metaBox} mb-6`}>
            <div className={`p-4 border-r ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                {isBuy ? 'TOTAL_PRICE' : 'RECIPIENT'}
              </p>
              <p className={`text-xs font-black ${theme.textMain}`}>
                {isBuy ? `${totalPrice} CR` : (giftTargetName || '—')}
              </p>
            </div>
            <div className="p-4">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">BALANCE_AFTER</p>
              <p className={`text-xs font-black ${isPointEnough ? theme.textMain : 'text-red-500'}`}>
                {currentPoint !== null ? `${currentPoint - totalPrice} CR` : '—'}
              </p>
            </div>
          </div>

          {/* 에러 메시지 */}
          {errorMsg && (
            <p className="text-red-400 text-xs text-center tracking-widest mb-4 uppercase">{errorMsg}</p>
          )}

          {/* 포인트 부족 경고 */}
          {!isPointEnough && (
            <p className="text-red-400 text-xs text-center tracking-widest mb-4 uppercase">// 포인트가 부족합니다</p>
          )}

          {/* 버튼 */}
          <div className="flex gap-4">
            <button
              className="flex-1 bg-primary hover:bg-text-main text-white font-black py-4 text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
              onClick={handleSubmit}
              disabled={isLoading || !isPointEnough || (!isBuy && !giftTarget) || (hasPlaylistItem && (!youtubeUrl || !youtubeValid))}
            >
              {isLoading ? 'PROCESSING...' : config.ackLabel}
              {!isLoading && (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
            <button
              className={`px-6 font-black py-4 text-xs uppercase tracking-[0.2em] border border-primary transition-all active:scale-[0.98] ${theme.textMain} hover:bg-primary/10`}
              onClick={onClose}
              disabled={isLoading}
            >
              취소
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className={`px-6 py-4 border-t ${theme.footerBorder} flex justify-between items-center text-[8px] font-bold text-slate-400 uppercase tracking-widest`}>
          <div className="flex gap-4">
            <span>SECURE_HANDSHAKE: <span className="text-blue-500">ACTIVE</span></span>
            <span>ENCRYPTION: 256-AES</span>
          </div>
          <span>MODULE_ID: {moduleId}</span>
        </div>

        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary"></div>
      </div>
    </div>
  );
};

export default BuyItemModal;