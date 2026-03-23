import React, { useState } from 'react';
import { useTheme } from '../ThemeProvider/ThemeProvider';

const BuyItemModal = ({ 
  isOpen,
  type = 'buy', // 'buy' | 'gift'
  onClose, 
  items = [],
  moduleId = "LAB-OS_V2.2.0",
}) => {
  const { isDark } = useTheme();
  const [giftTarget, setGiftTarget] = useState('');
  const [giftMessage, setGiftMessage] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');

  if (!isOpen) return null;

  const isBuy = type === 'buy';

  // 아이템 8번 포함 여부 체크 (id가 숫자/문자열 모두 대응)
  const hasItem8 = items.some(item => item.id === 8 || item.id === '8');

  // 유튜브 URL 유효성 검사
  const isValidYoutubeUrl = (url) => {
    return /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}/.test(url);
  };
  const youtubeValid = !hasItem8 || !youtubeUrl || isValidYoutubeUrl(youtubeUrl);

  // 타입별 텍스트 설정
  const config = {
    buy: {
      title: "PURCHASE_CONFIRMATION",
      status: "ORDER_PENDING",
      headline: "구매 확인",
      ackLabel: "결제하기",
    },
    gift: {
      title: "GIFT_TRANSMISSION",
      status: "TARGET_REQUIRED",
      headline: "선물하기",
      ackLabel: "선물 전송",
    },
  }[type];

  // 총 가격 계산
  const totalPrice = items.reduce(
    (sum, itm) => sum + parseFloat(String(itm.price).replace(/,/g, '')) * itm.quantity,
    0
  );

  // 테마별 색상 정의
  const theme = {
    overlay: isDark ? 'bg-slate-950/80' : 'bg-slate-900/40',
    container: isDark ? 'bg-main border-slate-700' : 'bg-main border-blue-200',
    textMain: isDark ? 'text-white' : 'text-slate-900',
    textSub: isDark ? 'text-slate-400' : 'text-slate-500',
    gridBg: isDark ? 'opacity-[0.05]' : 'opacity-[0.03]',
    metaBox: isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50/50 border-slate-100',
    footerBorder: isDark ? 'border-slate-800' : 'border-slate-50',
    itemRow: isDark ? 'border-slate-700' : 'border-slate-100',
    input: isDark
      ? 'bg-slate-800 border-slate-600 text-white placeholder-slate-500 focus:border-primary'
      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-primary',
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-['Space_Grotesk',sans-serif]">
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 ${theme.overlay} backdrop-blur-sm transition-opacity`} 
        onClick={onClose}
      />

      {/* Main Module Container */}
      <div 
        className={`relative w-full max-w-2xl ${theme.container} border shadow-[0_20px_50px_rgba(37,99,235,0.15)] overflow-hidden animate-in fade-in zoom-in duration-300`}
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Subtle Background Grid Pattern */}
        <div className={`absolute inset-0 ${theme.gridBg} pointer-events-none`} 
             style={{ backgroundImage: 'linear-gradient(#2563eb 1px, transparent 1px), linear-gradient(90deg, #2563eb 1px, transparent 1px)', backgroundSize: '20px 20px' }} 
        />

        {/* Tactical Header Bar */}
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
            <button 
              onClick={onClose}
              className="hover:rotate-90 transition-transform duration-200 opacity-80 hover:opacity-100"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Content Section */}
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

          {/* 선물하기일 때만 수신자 입력란 + 쪽지 표시 */}
          {!isBuy && (
            <>
              <div className="mb-4">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                  수신자 ID
                </label>
                <input
                  type="text"
                  value={giftTarget}
                  onChange={(e) => setGiftTarget(e.target.value)}
                  placeholder="선물 받을 유저 ID 입력..."
                  className={`w-full border px-4 py-3 text-sm font-mono outline-none transition-colors ${theme.input}`}
                />
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
                <p className="mt-1 text-right text-[10px] text-slate-400 tracking-widest">
                  {giftMessage.length} / 200
                </p>
              </div>
            </>
          )}

          {/* 아이템 8번 포함 시 유튜브 URL 입력란 표시 */}
          {hasItem8 && (
            <div className="mb-6">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                YouTube URL <span className="text-primary">// ITEM_08 DETECTED</span>
              </label>
              <div className="relative">
                {/* 유튜브 아이콘 */}
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
                  className={`w-full border pl-10 pr-4 py-3 text-sm font-mono outline-none transition-colors ${theme.input} ${
                    youtubeUrl && !youtubeValid ? 'border-red-500 focus:border-red-500' : ''
                  }`}
                />
              </div>
              {youtubeUrl && !youtubeValid && (
                <p className="mt-1 text-[10px] text-red-500 tracking-widest uppercase">유효하지 않은 YouTube URL입니다</p>
              )}
              {youtubeUrl && youtubeValid && (
                <p className="mt-1 text-[10px] text-primary tracking-widest uppercase">// URL_VERIFIED</p>
              )}
            </div>
          )}

          {/* Tactical Metadata Grid */}
          <div className={`grid grid-cols-2 border ${theme.metaBox} mb-8`}>
            <div className={`p-4 border-r ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">MODULE_ID</p>
              <p className={`text-xs font-black ${theme.textMain}`}>{moduleId}</p>
            </div>
            <div className="p-4">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                {isBuy ? 'TOTAL_PRICE' : 'RECIPIENT'}
              </p>
              <p className={`text-xs font-black ${theme.textMain}`}>
                {isBuy
                  ? `${totalPrice} CR`
                  : giftTarget || '—'
                }
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button 
              className="flex-1 bg-primary hover:bg-text-main text-white font-black py-4 text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
              onClick={onClose}
              disabled={(!isBuy && !giftTarget.trim()) || (hasItem8 && !!youtubeUrl && !youtubeValid)}
            >
              {config.ackLabel}
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button
              className={`px-6 font-black py-4 text-xs uppercase tracking-[0.2em] border border-primary transition-all active:scale-[0.98] ${theme.textMain} hover:bg-primary/10`}
              onClick={onClose}
            >
              취소
            </button>
          </div>
        </div>

        {/* Footer HUD Markers */}
        <div className={`px-6 py-4 border-t ${theme.footerBorder} flex justify-between items-center text-[8px] font-bold text-slate-400 uppercase tracking-widest`}>
          <div className="flex gap-4">
            <span>SECURE_HANDSHAKE: <span className="text-blue-500">ACTIVE</span></span>
            <span>ENCRYPTION: 256-AES</span>
          </div>
          <span>UNIT: ALPHA-7</span>
        </div>

        {/* Decorative HUD Corner */}
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary"></div>
      </div>
    </div>
  );
};

export default BuyItemModal;