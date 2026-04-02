import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MemberDetailModal from "../../components/Modal/MemberDetailModal";
import PlaylistPlayer from '../../components/PlayListPlayer/PlayListPlayer.jsx';

const API = 'http://localhost:8081';

// ── 더미 데이터 (비로그인 시 블러 처리용) ─────────────────────
const DUMMY_MEMBERS = Array.from({ length: 10 }, (_, i) => ({
  id: `DUMMY_${i + 1}`,
  char_name: ['SHADOW_UNIT', 'APEX_NODE', 'RECON_X', 'CIPHER_7', 'PHANTOM_K',
               'VECTOR_9', 'NEON_BLADE', 'STATIC_Z', 'CORE_DELTA', 'NOVA_IX'][i],
  serial: `SN-${String(Math.floor(Math.random() * 99999)).padStart(5, '0')}`,
  image_url: null,
  position: ['MERKI', 'MAEBAM', 'HASHA', 'MERKI', 'MAEBAM',
              'HASHA', 'MERKI', 'MAEBAM', 'HASHA', 'MERKI'][i],
}));

// ── GalleryItem ───────────────────────────────────────────────
const GalleryItem = ({ memberId, title, serial, imageUrl, onViewDetail, isDisabled }) => {
  const [isHovered, setIsHovered] = useState(false);
  const active = isHovered && !isDisabled;

  return (
    <div
      className={`relative bg-main border transition-all duration-300 p-4 flex flex-col h-full group
        ${active ? 'border-primary shadow-stark-glow' : 'border-border-primary/30 shadow-sm'}
        ${isDisabled ? 'select-none' : ''}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Selected badge */}
      <div className={`absolute top-2 right-2 z-50 px-2 py-0.5 text-lg font-black uppercase tracking-widest transition-opacity duration-300
        ${active ? 'opacity-100 bg-primary text-white' : 'opacity-0'}`}>
        Selected
      </div>

      {/* 이미지 영역 */}
      <div className="aspect-square bg-primary/5 mb-4 overflow-hidden relative">
        {isDisabled ? (
          /* 더미: 물음표 플레이스홀더 */
          <div className="w-full h-full flex items-center justify-center bg-primary/5">
            <span className="text-4xl font-black text-primary/20 select-none">?</span>
            {/* 스캔라인 오버레이 */}
            <div className="absolute inset-0 pointer-events-none"
              style={{
                background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)'
              }}
            />
          </div>
        ) : (
          <>
            <img
              src={imageUrl}
              alt={title}
              className={`w-full h-full object-cover transition-all duration-500
                ${active ? 'scale-110 grayscale-0' : 'grayscale brightness-95'}`}
            />
            <div className={`absolute inset-0 bg-primary/5 pointer-events-none transition-opacity duration-300
              ${active ? 'opacity-100' : 'opacity-0'}`}
            />
          </>
        )}
      </div>

      {/* 텍스트 */}
      <div className="flex-1">
        <h3 className={`text-lg font-black italic tracking-tighter uppercase transition-colors duration-300
          ${isDisabled ? 'text-text-main/20 blur-[3px]' : active ? 'text-primary' : 'text-text-main'}`}>
          {title}
        </h3>
        <p className={`text-[10px] font-bold tracking-widest mt-1
          ${isDisabled ? 'text-text-main/15 blur-[2px]' : 'text-text-main/60'}`}>
          ID: {serial}
        </p>
      </div>

      {/* 버튼 */}
      <button
        disabled={isDisabled}
        onClick={() => !isDisabled && onViewDetail(memberId)}
        className={`mt-6 w-full py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 border
          ${isDisabled
            ? 'bg-transparent border-border-primary/15 text-text-main/20 cursor-not-allowed'
            : active
              ? 'bg-primary border-primary text-white dark:shadow-lg dark:shadow-primary/20'
              : 'bg-transparent border-border-primary/30 text-text-main/50 hover:border-primary hover:text-primary'
          }
        `}
      >
        {isDisabled ? '[ LOCKED ]' : 'View Details'}
      </button>

      <div className={`absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 border-primary transition-opacity duration-300
        ${active ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
};

// ── Member (Gallery 페이지) ───────────────────────────────────
export default function Member() {
  const [activeTab,    setActiveTab]    = useState('AKERO');
  const [members,      setMembers]      = useState([]);
  const [isLoading,    setIsLoading]    = useState(true);
  const [isLoggedIn,   setIsLoggedIn]   = useState(false);

  // 모달 상태
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const isModalOpen = selectedMemberId !== null;

  useEffect(() => {
    const fetchMembers = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`${API}/members`, { withCredentials: true });
        if (res.data.Status === 'Success') {
          setMembers(res.data.members);
          setIsLoggedIn(true);
        }
      } catch (err) {
        console.error('멤버 로드 실패:', err);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMembers();
  }, []);

  const tabs = ['AKERO', 'MERKI', 'MAEBAM', 'HASHA'];

  // 비로그인 → 더미, 로그인 → 실제 필터링
  const displayMembers = isLoggedIn
    ? (activeTab === 'AKERO' ? members : members.filter(m => m.position === activeTab))
    : DUMMY_MEMBERS;

  return (
    <div className="min-h-screen bg-main text-text-main p-10 selection:bg-primary/20 selection:text-primary font-nexon-warhaven">
      <div className="fixed inset-0 pointer-events-none bg-stark-grid opacity-100" />

      <div className="max-w-[1400px] mx-auto relative z-10">

        {/* 탭 헤더 */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 border-b-2 border-border-primary/20 pb-6 font-nexon-warhaven text-lg">
          <div className="flex gap-12 flex-wrap">
            {tabs.map((tab, index) => (
              <button
                key={tab}
                onClick={() => isLoggedIn && setActiveTab(tab)}
                className={`relative py-2 text-xs font-black tracking-[0.3em] uppercase transition-all
                  ${!isLoggedIn ? 'cursor-not-allowed opacity-30' :
                    activeTab === tab ? 'text-primary' : 'text-text-main/40 hover:text-text-main/80'}
                `}
              >
                {tab}
                {isLoggedIn && activeTab === tab && (
                  <span className="absolute -bottom-[26px] left-0 w-full h-[2px] bg-primary" />
                )}
                <span className="absolute -top-4 left-0 text-[8px] opacity-40">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-6 md:mt-0 flex items-center gap-4 text-[10px] font-bold text-text-main/40">
            <span className="tracking-widest italic uppercase">Access_Level: Security_04</span>
            <div className="flex gap-1 items-center">
              <div className="w-1 h-1 bg-primary rounded-full animate-pulse" />
              <div className="w-1 h-1 bg-primary/30 rounded-full" />
            </div>
          </div>
        </div>

        {/* ── 비로그인 안내 배너 ── */}
        {!isLoggedIn && !isLoading && (
          <div className="relative mb-10 border border-primary/40 bg-primary/5 px-6 py-4 flex items-center gap-4 overflow-hidden">
            {/* 좌측 강조선 */}
            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary" />

            {/* 잠금 아이콘 */}
            <div className="shrink-0 w-12 h-12  flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>

            <div className="flex-1">
              <p className="text-lg font-one-store-mobile-gothic-body tracking-wider uppercase tracking-[0.25em] text-primary mb-0.5">
                ACCESS RESTRICTED
              </p>
              <p className="text-lg font-one-store-mobile-gothic-body text-text-main/60 tracking-wider">
                로그인 후 멤버 목록 확인이 가능합니다.
              </p>
            </div>

            {/* 배경 스캔라인 */}
            <div className="absolute inset-0 pointer-events-none opacity-30"
              style={{
                background: 'repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(var(--color-primary-rgb, 255,0,0), 0.03) 40px, rgba(var(--color-primary-rgb, 255,0,0), 0.03) 41px)'
              }}
            />
          </div>
        )}

        {/* 갤러리 그리드 */}
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[40vh]">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6
            ${!isLoggedIn ? 'pointer-events-none' : ''}`}
          >
            {displayMembers.map((member) => (
              <GalleryItem
                key={member.id}
                memberId={member.id}
                title={member.char_name}
                serial={member.serial ?? member.id}
                imageUrl={member.image_url ? `${API}${member.image_url}` : ''}
                onViewDetail={setSelectedMemberId}
                isDisabled={!isLoggedIn}
              />
            ))}
          </div>
        )}

        <footer className="mt-20 pt-8 border-t border-border-primary/20 flex justify-between items-center text-[9px] font-bold text-text-main/40 uppercase tracking-widest">
          <div className="flex gap-8">
            <p>ASCENSION TOWER : v2.4.0</p>
            <p>Sync_Status: {isLoggedIn ? 'Optimized' : 'Unauthorized'}</p>
          </div>
          <div className="flex gap-4">
            <span>Server: **_WEST_04</span>
            <span>Auth_Token: {isLoggedIn ? 'Valid // 14:02_C' : 'NULL // --:--_X'}</span>
          </div>
        </footer>
      </div>

      {/* MemberDetailModal */}
      <MemberDetailModal
        memberId={selectedMemberId}
        isOpen={isModalOpen}
        onClose={() => setSelectedMemberId(null)}
      />
    </div>
  );
}