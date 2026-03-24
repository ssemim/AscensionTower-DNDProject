import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import Menu from '../../components/Menu/Menu';
import YouTube from 'react-youtube';
import '../Landing/index.css';
import badges from './badge.js';

const API = 'http://localhost:8081';

// ───────────────────────────────────────────
// 유틸
// ───────────────────────────────────────────
function getYouTubeID(url) {
  if (!url) return null;
  let match = url.match(/youtu\.be\/([^?&\s]+)/);
  if (match) return match[1];
  match = url.match(/[?&]v=([^&\s]+)/);
  if (match) return match[1];
  match = url.match(/embed\/([^?&\s]+)/);
  if (match) return match[1];
  return null;
}

async function fetchYouTubeTitle(videoId) {
  try {
    const res = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
    if (!res.ok) throw new Error();
    const data = await res.json();
    return data.title || null;
  } catch {
    return null;
  }
}

// ───────────────────────────────────────────
// 수령 모달
// ───────────────────────────────────────────
function ReceiveModal({ mail, onConfirm, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-main border border-border-primary rounded-xl p-8 max-w-sm w-full shadow-stark-glow relative">
        <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
        <h3 className="text-primary font-bold text-lg tracking-widest mb-4">INCOMING MAIL</h3>
        <p className="text-text-main/70 text-sm font-pf-stardust mb-1">from: <span className="text-primary">{mail.sender_name || mail.sender_id}</span></p>
        {mail.item_name && (
          <p className="text-text-main/70 text-sm font-pf-stardust mb-1">
            item: <span className="text-primary">{mail.item_name}</span> x{mail.quantity}
          </p>
        )}
        {mail.message && (
          <p className="text-text-main/50 text-xs font-pf-stardust mt-3 border-t border-border-primary/30 pt-3">
            "{mail.message}"
          </p>
        )}
        <div className="flex gap-3 mt-6">
          <button onClick={onConfirm} className="flex-1 bg-primary hover:bg-primary/80 text-white font-bold py-2 rounded-lg transition-colors tracking-widest text-sm">RECEIVE</button>
          <button onClick={onClose} className="flex-1 border border-border-primary/50 text-text-main/50 hover:text-text-main font-bold py-2 rounded-lg transition-colors text-sm">CLOSE</button>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────
// 인벤토리 아이템 카드
// ───────────────────────────────────────────
function ItemCard({ item }) {
  return (
    <div className="flex-shrink-0 w-36 border border-border-primary p-3 flex flex-col gap-2 hover:bg-primary/10 transition-colors duration-200 cursor-pointer">
      <div className="w-full aspect-square bg-primary/10 flex items-center justify-center text-primary/30 text-s">[ IMG ]</div>
      <p className="text-s font-bold truncate text-text-main font-pf-stardust">{item.item_name || `Item_${item.item_id}`}</p>
      <p className="text-[10px] text-text-main/50 font-pf-stardust">x{item.quantity}</p>
    </div>
  );
}

// ───────────────────────────────────────────
// 우편함 카드
// ───────────────────────────────────────────
function MailCard({ mail, onReceive }) {
  return (
    <div className="flex-shrink-0 w-36 border border-border-primary p-3 flex flex-col gap-2 hover:bg-primary/10 transition-colors duration-200">
      <div className="w-full aspect-square bg-primary/10 flex items-center justify-center text-primary/30 text-s">[ MAIL ]</div>
      <p className="text-s font-bold truncate text-text-main font-pf-stardust">{mail.item_name || '메시지'}</p>
      <p className="text-[10px] text-text-main/50 font-pf-stardust truncate">from: {mail.sender_name || mail.sender_id}</p>
      {mail.message && (
        <p className="text-[10px] text-text-main/40 font-pf-stardust truncate">"{mail.message}"</p>
      )}
      {/* 아이템이 있고 아직 수령 안 했을 때만 버튼 표시 */}
      {mail.item_id && !mail.item_received ? (
        <button onClick={() => onReceive(mail)} className="text-[10px] bg-primary/20 hover:bg-primary/40 text-primary font-bold py-1 rounded transition-colors">
          수령하기
        </button>
      ) : mail.item_id ? (
        <p className="text-[10px] text-text-main/30 font-pf-stardust text-center">수령 완료</p>
      ) : null}
    </div>
  );
}

// ───────────────────────────────────────────
// 탭 인벤토리 섹션
// ───────────────────────────────────────────
function InventorySection() {
  const TABS = [
    { id: 'friends',   label: 'FRIENDS'   },
    { id: 'inventory', label: 'INVENTORY' },
    { id: 'gifted',    label: 'GIFTED'    },
  ];

  const [activeTab, setActiveTab] = useState('inventory');
  const [inventoryItems, setInventoryItems] = useState([]);
  const [mailboxItems, setMailboxItems] = useState([]);
  const [friends, setFriends] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMail, setSelectedMail] = useState(null);

  const fetchTab = async (tab) => {
    setIsLoading(true);
    try {
      const endpointMap = {
        inventory: `${API}/mypage/inventory`,
        gifted:    `${API}/mypage/mailbox`,
        friends:   `${API}/mypage/friends`,
      };
      const res = await axios.get(endpointMap[tab], { withCredentials: true });
      if (tab === 'inventory') setInventoryItems(res.data.inventory || []);
      else if (tab === 'gifted') setMailboxItems(res.data.mailbox || []);
      else setFriends(res.data.friends || []);
    } catch (err) {
      console.error(`${tab} 로드 실패:`, err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchTab(activeTab); }, [activeTab]);

  const confirmReceive = async () => {
    if (!selectedMail) return;
    try {
      const res = await axios.post(`${API}/mypage/mailbox/receive`, { mail_id: selectedMail.mail_id }, { withCredentials: true });
      if (res.data.Status === 'Success') {
        setMailboxItems(prev => prev.filter(m => m.mail_id !== selectedMail.mail_id));
        setInventoryItems([]);
        setSelectedMail(null);
      } else {
        alert(res.data.Error || '수령 실패');
      }
    } catch (err) {
      console.error('수령 실패:', err);
    }
  };

  return (
    <>
      {selectedMail && <ReceiveModal mail={selectedMail} onConfirm={confirmReceive} onClose={() => setSelectedMail(null)} />}

      <section className="px-12 py-6 bg-main border-y border-border-primary relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2" />
        <div className="flex flex-col gap-4 max-w-6xl mx-auto">
          <div className="flex items-end gap-0 border-b border-border-primary">
            {TABS.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`text-s font-bold tracking-widest px-6 py-2 transition-colors duration-150 ${activeTab === tab.id ? 'text-primary border-b-2 border-border-primary -mb-px bg-primary/10' : 'text-text-main/40 hover:text-text-main/70'}`}>
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'friends' && (
            <div className="min-h-[30vh] max-h-[60vh] overflow-y-auto pb-4">
              {isLoading ? <p className="text-text-main/50 text-s font-pf-stardust">로딩 중...</p>
                : friends.length > 0 ? (
                  <div className="space-y-2 w-full">
                    {friends.map((friend) => (
                      <div key={friend.id} className="border border-border-primary p-4 flex items-center gap-4 hover:bg-primary/10 transition-colors">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center overflow-hidden">
                          {friend.image_url ? <img src={friend.image_url} alt={friend.char_name} className="w-full h-full object-cover" /> : <span className="text-primary/50">👤</span>}
                        </div>
                        <div>
                          <p className="font-bold text-text-main font-pf-stardust">{friend.char_name}</p>
                          <p className="text-sm text-text-main/50">{friend.position || '-'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-text-main/50 text-lg font-pf-stardust mt-8">친구가 없습니다.</p>}
            </div>
          )}

          {activeTab === 'inventory' && (
            <div className="min-h-[30vh] max-h-[60vh] flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {isLoading ? <p className="text-text-main/50 text-s self-center font-pf-stardust">로딩 중...</p>
                : inventoryItems.length > 0 ? inventoryItems.map((item) => <ItemCard key={item.inv_id} item={item} />)
                : <p className="text-text-main/50 text-lg self-center font-pf-stardust">보유한 아이템이 없습니다.</p>}
            </div>
          )}

          {activeTab === 'gifted' && (
            <div className="min-h-[30vh] max-h-[60vh] flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {isLoading ? <p className="text-text-main/50 text-s self-center font-pf-stardust">로딩 중...</p>
                : mailboxItems.length > 0 ? mailboxItems.map((mail) => <MailCard key={mail.mail_id} mail={mail} onReceive={setSelectedMail} />)
                : <p className="text-text-main/50 text-lg self-center font-pf-stardust">수령할 메일이 없습니다.</p>}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

// ───────────────────────────────────────────
// 플레이리스트 트랙 버튼 (포털 popover)
// ───────────────────────────────────────────
function TrackButton({ video, index, isPlaying, isActive, onPlay }) {
  const [popoverPos, setPopoverPos] = useState(null);
  const timeoutRef = useRef(null);
  const btnRef = useRef(null);

  const POPOVER_W = 208;
  const POPOVER_H = 90;

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    if (!video.added_by && !video.message) return;
    const rect = btnRef.current?.getBoundingClientRect();
    if (!rect) return;

    const isMobile = window.innerWidth < 768;
    let top, left;

    if (isMobile) {
      // 모바일: 아래 공간 있으면 아래, 없으면 위
      const spaceBelow = window.innerHeight - rect.bottom;
      top = spaceBelow >= POPOVER_H + 8
        ? rect.bottom + window.scrollY + 8
        : rect.top + window.scrollY - POPOVER_H - 8;
      // 화면 안으로 left 클램핑
      left = Math.max(8, Math.min(rect.left, window.innerWidth - POPOVER_W - 8));
    } else {
      // 데스크탑: 오른쪽 공간 있으면 오른쪽, 없으면 왼쪽
      const spaceRight = window.innerWidth - rect.right;
      left = spaceRight >= POPOVER_W + 8
        ? rect.right + 8
        : rect.left - POPOVER_W - 8;
      top = rect.top + window.scrollY;
    }

    setPopoverPos({ top, left });
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setPopoverPos(null), 150);
  };

  return (
    <>
      <button
        ref={btnRef}
        onClick={() => onPlay(index)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`w-full text-left p-2 rounded transition-colors duration-200 ${isActive ? 'bg-primary/30' : 'hover:bg-primary/10'}`}
      >
        <span className="font-bold">{isActive && isPlaying ? '▶' : '▷'}</span>
        <span className="ml-3 text-sm truncate">{video.title}</span>
      </button>

      {popoverPos && createPortal(
        <div
          onMouseEnter={() => clearTimeout(timeoutRef.current)}
          onMouseLeave={handleMouseLeave}
          style={{ position: 'absolute', top: popoverPos.top, left: popoverPos.left }}
          className="z-[9999] w-52 bg-main border border-border-primary rounded-lg p-3 shadow-stark-glow"
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent rounded-t-lg" />
          {video.added_by && (
            <p className="text-xs text-text-main/70 font-pf-stardust mb-1">
              from: <span className="text-primary font-bold">{video.added_by}</span>
            </p>
          )}
          {video.message && (
            <p className="text-xs text-text-main font-pf-stardust leading-relaxed border-t border-border-primary/30 pt-2 mt-1">
              "{video.message}"
            </p>
          )}
        </div>,
        document.body
      )}
    </>
  );
}

// ───────────────────────────────────────────
// 메인 페이지
// ───────────────────────────────────────────
export default function MyPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [member, setMember] = useState(null);
  const [videoLinks, setVideoLinks] = useState([]);
  const [isLoadingPlaylist, setIsLoadingPlaylist] = useState(true);
  const [player, setPlayer] = useState(null);
  const [nowPlayingIndex, setNowPlayingIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(100);
  const [earnedBadgeIds, setEarnedBadgeIds] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchMyPage = async () => {
      setIsLoadingPlaylist(true);
      try {
        const res = await axios.get(`${API}/mypage`, { withCredentials: true });
        if (res.data.Status !== 'Success') return;
        setMember(res.data.member);
        const playlist = res.data.playlist || [];
        const linksWithTitles = await Promise.all(
          playlist.map(async (track, index) => {
            const videoId = getYouTubeID(track.youtube_url);
            if (!videoId) return { ...track, url: track.youtube_url, title: `Track ${index + 1}` };
            const title = await fetchYouTubeTitle(videoId);
            return { ...track, url: track.youtube_url, title: title || `Track ${index + 1}` };
          })
        );
        setVideoLinks(linksWithTitles);
      } catch (err) {
        console.error('마이페이지 로드 실패:', err);
      } finally {
        setIsLoadingPlaylist(false);
      }
    };
    fetchMyPage();
  }, []);

  useEffect(() => {
    axios.get(`${API}/mypage/badges`, { withCredentials: true })
      .then(res => { if (res.data.Status === 'Success') setEarnedBadgeIds(res.data.badges.map(b => b.badge_id)); })
      .catch(err => console.error('뱃지 로드 실패:', err));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (player && isPlaying) {
        setCurrentTime(player.getCurrentTime());
        setDuration(player.getDuration());
      }
    }, 100);
    return () => clearInterval(interval);
  }, [player, isPlaying]);

  // 이미지 업로드 핸들러
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    setIsUploading(true);
    try {
      const res = await axios.post(`${API}/mypage/upload-image`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.Status === 'Success') {
        setMember(prev => ({ ...prev, image_url: res.data.image_url }));
      } else {
        alert(res.data.Error || '업로드 실패');
      }
    } catch (err) {
      console.error('이미지 업로드 실패:', err);
      alert('이미지 업로드에 실패했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const youtubePlayerOptions = { height: '0', width: '0', playerVars: { autoplay: 0 } };
  const onPlayerReady = (e) => { setPlayer(e.target); e.target.setVolume(volume); };
  const onPlayerStateChange = (e) => {
    setIsPlaying(e.data === window.YT.PlayerState.PLAYING);
    if (e.data === window.YT.PlayerState.ENDED) {
      const next = nowPlayingIndex + 1;
      if (next < videoLinks.length) handlePlay(next);
      else { setNowPlayingIndex(null); setCurrentTime(0); setDuration(0); }
    }
  };
  const handlePlay = (index) => {
    if (nowPlayingIndex === index && isPlaying) { player?.pauseVideo(); return; }
    const videoId = getYouTubeID(videoLinks[index]?.url);
    if (player && videoId) { setNowPlayingIndex(index); player.loadVideoById(videoId); player.playVideo(); }
  };
  const handlePlayPause = () => { if (!player || nowPlayingIndex === null) return; isPlaying ? player.pauseVideo() : player.playVideo(); };
  const handlePrev = () => { if (nowPlayingIndex > 0) handlePlay(nowPlayingIndex - 1); };
  const handleNext = () => { if (nowPlayingIndex < videoLinks.length - 1) handlePlay(nowPlayingIndex + 1); };
  const handleSeek = (time) => { player?.seekTo(time, true); setCurrentTime(time); };
  const handleVolumeChange = (v) => { player?.setVolume(v); setVolume(v); };
  const formatTime = (s) => {
    if (!s || isNaN(s)) return '0:00';
    return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`;
  };

  return (
    <>
      <div className="min-h-screen bg-main text-text-main font-mono relative">
        <Menu isOpen={isMenuOpen} onToggle={toggleMenu} />
        <div className="fixed inset-0 pointer-events-none bg-stark-grid opacity-0 dark:opacity-100" />

        <div className="hidden">
          <YouTube onReady={onPlayerReady} onStateChange={onPlayerStateChange} opts={youtubePlayerOptions} />
        </div>

        <main className="relative z-10">

          {/* 프로필 + 정보 + 플레이리스트 */}
          <section className="px-4 md:px-12 py-12 bg-main relative overflow-hidden">
            <div className="flex flex-col md:flex-row gap-4 min-h-0 md:min-h-[30vh] max-h-none md:max-h-[50vh] max-w-6xl mx-auto">

              {/* 프로필 이미지 - 클릭하면 업로드 */}
              <div className="border border-border-primary w-full md:w-2/12 aspect-square flex flex-col">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 flex flex-col items-center justify-center p-4 relative group overflow-hidden w-full"
                  disabled={isUploading}
                >
                  {member?.image_url ? (
                    <img src={`${API}${member.image_url}`} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary/50 text-xs">
                      {isUploading ? 'UPLOADING...' : 'No Image'}
                    </div>
                  )}
                  {/* 호버 오버레이 */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-xs font-bold tracking-widest">
                      {isUploading ? 'UPLOADING...' : 'UPLOAD'}
                    </span>
                  </div>
                </button>
              </div>

              {/* 정보 */}
              <div className="w-full md:w-6/12 border border-border-primary p-4">
                <h4 className="text-lg font-bold mb-4 text-primary">INFO</h4>
                {member ? (
                  <ul className="space-y-2 font-pf-stardust text-lg text-text-main/70">
                    <li className="border-b border-border-primary/30 pb-1">NAME : {member.char_name}</li>
                    <li className="border-b border-border-primary/30 pb-1">AGE : {member.char_age}</li>
                    <li className="border-b border-border-primary/30 pb-1">POSITION : {member.position || '-'}</li>
                    <li className="border-b border-border-primary/30 pb-1">POINT : {member.point}</li>
                    <li className="pb-1">STAT : {member.point}</li>
                  </ul>
                ) : (
                  <p className="text-text-main/50 font-pf-stardust">로딩 중...</p>
                )}
              </div>

              {/* 플레이리스트 */}
              <div className="w-full md:w-4/12 border border-border-primary p-4 flex flex-col overflow-hidden">
                <h4 className="text-lg font-bold mb-4 text-primary">PLAYLIST</h4>
                <div className="flex-1 overflow-y-auto min-h-0">
                  {isLoadingPlaylist ? (
                    <p className="text-text-main/50 text-sm font-pf-stardust">로딩 중...</p>
                  ) : videoLinks.length > 0 ? (
                    <div className="space-y-2">
                      {videoLinks.map((video, index) => (
                        <TrackButton
                          key={video.track_id ?? index}
                          video={video}
                          index={index}
                          isActive={nowPlayingIndex === index}
                          isPlaying={isPlaying}
                          onPlay={handlePlay}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-text-main/50 text-lg font-pf-stardust">선물받은 BGM이 아직 없습니다.</p>
                  )}
                </div>

                {nowPlayingIndex !== null && (
                  <div className="mt-4 pt-4 border-t border-border-primary flex-shrink-0">
                    <p className="text-s text-primary truncate mb-2 font-pf-stardust">♪ {videoLinks[nowPlayingIndex]?.title}</p>
                    <div className="text-s text-text-main/70 mb-1 flex justify-between">
                      <span>{formatTime(currentTime)}</span><span>{formatTime(duration)}</span>
                    </div>
                    <input type="range" min="0" max={duration || 0} value={currentTime}
                      onChange={(e) => handleSeek(parseFloat(e.target.value))}
                      className="w-full h-1 rounded cursor-pointer accent-primary mb-4" />
                    <div className="flex gap-2 mb-4">
                      <button onClick={handlePrev} disabled={nowPlayingIndex === 0} className="hover:bg-primary/30 text-primary py-2 px-3 rounded font-bold transition-colors disabled:opacity-30">⏮</button>
                      <button onClick={handlePlayPause} className="flex-1 hover:bg-primary/30 text-primary py-2 px-4 rounded font-bold transition-colors">{isPlaying ? '⏸ PAUSE' : '▶ PLAY'}</button>
                      <button onClick={handleNext} disabled={nowPlayingIndex === videoLinks.length - 1} className="hover:bg-primary/30 text-primary py-2 px-3 rounded font-bold transition-colors disabled:opacity-30">⏭</button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-s text-text-main/70">🔊</span>
                      <input type="range" min="0" max="100" value={volume}
                        onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
                        className="flex-1 h-1 rounded cursor-pointer accent-primary" />
                      <span className="text-xs text-text-main/70 w-8 text-right">{volume}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* 탭형 인벤토리 */}
          <InventorySection />

          {/* 뱃지 */}
          <section className="px-12 py-12 bg-main border-b border-border-primary relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2" />
            <div className="flex flex-col md:flex-row gap-12 max-w-6xl mx-auto">
              <div className="md:w-1/4">
                <span className="text-primary font-bold text-s tracking-widest">ARCHIVE_BADGES</span>
                <p className="text-text-main/50 text-s leading-relaxed font-pf-stardust">무엇을 해냈나요?</p>
              </div>
              <div className="md:w-2/3 grid grid-cols-4 gap-2 bg-main p-4 border border-border-primary h-full max-h-64 overflow-y-auto">
                {badges.map((badge) => {
                  const isEarned = earnedBadgeIds.includes(badge.id);
                  return (
                    <div key={badge.id}
                      className={`aspect-square border flex flex-col items-center justify-center relative transition-all cursor-pointer group font-pf-stardust text-lg text-text-main/70
                        ${badge.isEmpty || !isEarned ? 'border-border-primary bg-main/40 opacity-30' : 'border-border-primary/70 bg-primary/10 hover:border-primary hover:shadow-stark-glow'}`}
                    >
                      {!badge.isEmpty && isEarned && (
                        <>
                          <div className="text-sm font-bold opacity-100 group-hover:opacity-0 transition-opacity">{badge.name}</div>
                          <div className="absolute inset-0 bg-main/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                            <div className="text-center text-xs">{badge.desc}</div>
                          </div>
                        </>
                      )}
                      <span className="absolute bottom-1 right-1 text-[8px] opacity-20 font-bold italic tracking-tighter">{badge.id}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

        </main>

        <footer className="px-12 py-8 border-t border-border-primary bg-main flex justify-between items-center text-[9px] font-bold text-text-main/50 uppercase tracking-widest">
          <div className="flex gap-12">
            <p className="font-pf-stardust">Local_Time: ?</p>
            <p className="font-pf-stardust">System_Temp: 15°C</p>
            <p className="font-pf-stardust">Link_Strength: 98%</p>
          </div>
          <p className="text-primary font-pf-stardust">© ASCENSION TOWER</p>
        </footer>
      </div>
    </>
  );
}