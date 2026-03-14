import React, { useState, useEffect } from 'react';
import Menu from '../../components/Menu/Menu';
import YouTube from 'react-youtube';
import '../Landing/index.css';

// 유튜브 URL에서 비디오 ID를 추출하는 헬퍼 함수
function getYouTubeID(url) {
  if (!url) return null;
  let regExp = /youtu\.be\/([^?&\s]+)/;
  let match = url.match(regExp);
  if (match && match[1]) return match[1];
  regExp = /[?&]v=([^&\s]+)/;
  match = url.match(regExp);
  if (match && match[1]) return match[1];
  regExp = /embed\/([^?&\s]+)/;
  match = url.match(regExp);
  if (match && match[1]) return match[1];
  return null;
}

// YouTube oEmbed API로 제목 가져오기 (무료, 키 불필요)
async function fetchYouTubeTitle(videoId) {
  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
    );
    if (!res.ok) throw new Error('oEmbed 요청 실패');
    const data = await res.json();
    return data.title || null;
  } catch {
    return null;
  }
}

// 백엔드 응답 정규화
// { gifts: [...] } / { items: [...] } / { data: [...] } / [...] 모두 처리
function normalizeResponse(data) {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.gifts)) return data.gifts;
  if (data && Array.isArray(data.items)) return data.items;
  if (data && Array.isArray(data.data)) return data.data;
  return [];
}

// ─────────────────────────────────────────────
// 개별 아이템 카드
// DB 응답 구조가 확정되면 내부 렌더링만 수정하면 됨
// ─────────────────────────────────────────────
function ItemCard({ item, tab }) {
  return (
    <div className="flex-shrink-0 w-36 border border-border-primary p-3 flex flex-col gap-2 hover:bg-primary/10 transition-colors duration-200 cursor-pointer">
      {/* 썸네일 - DB에서 imageUrl 필드로 교체 예정 */}
      <div className="w-full aspect-square bg-primary/10 flex items-center justify-center text-primary/30 text-s">
        {item.imageUrl
          ? <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
          : '[ IMG ]'}
      </div>

      {/* 이름 */}
      <p className="text-s font-bold truncate text-text-main font-pf-stardust">
        {item.name || item.title || `Item_${item.id ?? '??'}`}
      </p>

      {/* 탭별 부가 정보 */}
      {tab === 'gifted' && item.senderName && (
        <p className="text-[10px] text-text-main/50 truncate font-pf-stardust">from: {item.senderName}</p>
      )}
      {tab === 'inventory' && item.quantity != null && (
        <p className="text-[10px] text-text-main/50 font-pf-stardust">x{item.quantity}</p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// 탭 전환 인벤토리 섹션
// ─────────────────────────────────────────────
function InventorySection() {
  const TABS = [
    { id: 'inventory', label: 'INVENTORY' },
    { id: 'gifted',    label: 'GIFTED'    },
  ];

  const [activeTab, setActiveTab] = useState('inventory');
  const [inventoryItems, setInventoryItems] = useState([]);
  const [giftedItems, setGiftedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 탭이 바뀔 때마다 해당 데이터 fetch (이미 로드된 탭은 재요청 생략)
  useEffect(() => {
    const fetchItems = async () => {
      const alreadyLoaded =
        (activeTab === 'inventory' && inventoryItems.length > 0) ||
        (activeTab === 'gifted'    && giftedItems.length > 0);
      if (alreadyLoaded) return;

      setIsLoading(true);
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) return;

        const endpoint =
          activeTab === 'inventory'
            ? `/api/inventory/${userId}`   // 백엔드 엔드포인트 확정 시 수정
            : `/api/gifts/${userId}`;      // 백엔드 엔드포인트 확정 시 수정

        const res = await fetch(endpoint);
        if (!res.ok) throw new Error(`${activeTab} 로드 실패`);

        const data = await res.json();
        const items = normalizeResponse(data);

        if (activeTab === 'inventory') setInventoryItems(items);
        else setGiftedItems(items);
      } catch (err) {
        console.error('아이템 로드 실패:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, [activeTab]); // eslint-disable-line react-hooks/exhaustive-deps

  const currentItems = activeTab === 'inventory' ? inventoryItems : giftedItems;

  return (
    <section className="px-12 py-6 bg-main border-y border-border-primary relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2" />

      <div className="flex flex-col gap-4 max-w-6xl mx-auto">

        {/* 탭 헤더 */}
        <div className="flex items-end gap-0 border-b border-border-primary">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                text-s font-bold tracking-widest px-6 py-2 transition-colors duration-150
                ${activeTab === tab.id
                  ? 'text-primary border-b-2 border-border-primary -mb-px bg-primary/10'
                  : 'text-text-main/40 hover:text-text-main/70'}
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 아이템 목록 */}
        <div className="min-h-[30vh] max-h-[60vh] flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {isLoading ? (
            <p className="text-text-main/50 text-s self-center font-pf-stardust">로딩 중...</p>
          ) : currentItems.length > 0 ? (
            currentItems.map((item, index) => (
              <ItemCard key={item.id ?? index} item={item} tab={activeTab} />
            ))
          ) : (
            <p className="text-text-main/50 text-s self-center font-pf-stardust">
              {activeTab === 'inventory'
                ? '보유한 아이템이 없습니다.'
                : '선물받은 아이템이 없습니다.'}
            </p>
          )}
        </div>

      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// 메인 페이지
// ─────────────────────────────────────────────
export default function MyPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  // 플레이리스트
  const [videoLinks, setVideoLinks] = useState([]);
  const [isLoadingPlaylist, setIsLoadingPlaylist] = useState(true);
  const [player, setPlayer] = useState(null);
  const [nowPlayingIndex, setNowPlayingIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // 플레이어 상태
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(100);

  useEffect(() => {
    const fetchUserGifts = async () => {
      setIsLoadingPlaylist(true);
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) { setIsLoadingPlaylist(false); return; }

        const response = await fetch(`/api/gifts/${userId}`);
        if (!response.ok) throw new Error('플레이리스트 로드 실패');

        const data = await response.json();
        const fetchedLinks = normalizeResponse(data);

        const linksWithTitles = await Promise.all(
          fetchedLinks.map(async (link, index) => {
            if (link.title) return link;
            const videoId = getYouTubeID(link.url);
            if (!videoId) return { ...link, title: link.url || `Track ${index + 1}` };
            const title = await fetchYouTubeTitle(videoId);
            return { ...link, title: title || link.url || `Track ${index + 1}` };
          })
        );

        setVideoLinks(linksWithTitles);
      } catch (error) {
        console.error('플레이리스트 로드 실패:', error);
        setVideoLinks([]);
      } finally {
        setIsLoadingPlaylist(false);
      }
    };
    fetchUserGifts();
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

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleImageUpload = (e) => {
    if (e.target.files?.[0]) setProfileImage(URL.createObjectURL(e.target.files[0]));
  };

  const youtubePlayerOptions = {
    height: '0', width: '0',
    playerVars: { autoplay: 0 },
  };

  const onPlayerReady = (event) => {
    setPlayer(event.target);
    event.target.setVolume(volume);
  };

  const onPlayerStateChange = (event) => {
    setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
    if (event.data === window.YT.PlayerState.ENDED) {
      const next = nowPlayingIndex + 1;
      if (next < videoLinks.length) {
        handlePlay(next);
      } else {
        setNowPlayingIndex(null);
        setCurrentTime(0);
        setDuration(0);
      }
    }
  };

  const handlePlay = (index) => {
    if (nowPlayingIndex === index && isPlaying) { player?.pauseVideo(); return; }
    const videoId = getYouTubeID(videoLinks[index]?.url);
    if (player && videoId) {
      setNowPlayingIndex(index);
      player.loadVideoById(videoId);
      player.playVideo();
    }
  };

  const handlePlayPause = () => {
    if (!player || nowPlayingIndex === null) return;
    isPlaying ? player.pauseVideo() : player.playVideo();
  };

  const handlePrev = () => { if (nowPlayingIndex > 0) handlePlay(nowPlayingIndex - 1); };
  const handleNext = () => { if (nowPlayingIndex < videoLinks.length - 1) handlePlay(nowPlayingIndex + 1); };

  const handleSeek = (time) => { player?.seekTo(time, true); setCurrentTime(time); };

  const handleVolumeChange = (newVolume) => { player?.setVolume(newVolume); setVolume(newVolume); };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-main text-text-main font-mono relative">
      <Menu isOpen={isMenuOpen} onToggle={toggleMenu} />
      <div className="fixed inset-0 pointer-events-none bg-stark-grid opacity-0 dark:opacity-100" />

      {/* 숨겨진 YouTube 플레이어 - 항상 마운트 유지 */}
      <div className="hidden">
        <YouTube onReady={onPlayerReady} onStateChange={onPlayerStateChange} opts={youtubePlayerOptions} />
      </div>

      <main className="relative z-10">

        {/* 프로필 + 정보 + 플레이리스트 */}
        <section className="px-4 md:px-12 py-12 bg-main relative overflow-hidden">
          <div className="flex flex-col md:flex-row gap-4 min-h-0 md:min-h-[30vh] max-h-none md:max-h-[50vh] max-w-6xl mx-auto">
            {/* 프로필 이미지 */}
            <div className="border border-border-primary w-full md:w-2/12 aspect-square flex flex-col">
              <input type="file" id="profile-upload" className="hidden" onChange={handleImageUpload} accept="image/*" />
              {/* 이미지 표시 영역 */}
              <div className="flex-1 flex items-center justify-center p-4">
                {profileImage
                  ? <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                  : <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary/50">No Image</div>
                }
              </div>
              {/* 구분선 */}
              <div className="border-t border-border-primary"></div>
              {/* 업로드 버튼 */}
              <label htmlFor="profile-upload" className="cursor-pointer bg-primary hover:bg-primary/80 text-white text-center py-2 px-4 text-sm font-bold transition-colors">
                Upload
              </label>
            </div>

          {/* 정보 */}
          <div className="w-full md:w-6/12 border border-border-primary p-4">
          <h4 className="text-lg font-bold mb-4 text-primary flex-shrink-0">INFO</h4>
          </div>

          {/* 플레이리스트 */}
          <div className="w-full md:w-4/12 border border-border-primary p-4 flex flex-col overflow-hidden">
            <h4 className="text-lg font-bold mb-4 text-primary flex-shrink-0">PLAYLIST</h4>

            <div className="flex-1 overflow-y-auto min-h-0">
              {isLoadingPlaylist ? (
                <p className="text-text-main/50 text-sm font-pf-stardust">로딩 중...</p>
              ) : videoLinks.length > 0 ? (
                <div className="space-y-2">
                  {videoLinks.map((video, index) => (
                    <button
                      key={video.id ?? index}
                      onClick={() => handlePlay(index)}
                      className={`w-full text-left p-2 rounded transition-colors duration-00 ${
                        nowPlayingIndex === index ? 'bg-primary/30 text-text-main' : 'hover:bg-primary/10'
                      }`}
                    >
                      <span className="font-bold">{nowPlayingIndex === index && isPlaying ? '▶' : '▷'}</span>
                      <span className="ml-3 text-sm truncate">{video.title}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-text-main/50 text-sm font-pf-stardust">선물받은 BGM이 아직 없습니다.</p>
              )}
            </div>

            {nowPlayingIndex !== null && (
              <div className="mt-4 pt-4 border-t border-border-primary flex-shrink-0">
                <p className="text-s text-primary truncate mb-2 font-pf-stardust">♪ {videoLinks[nowPlayingIndex]?.title}</p>

                <div className="text-s text-text-main/70 mb-1 flex justify-between">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>

                <input
                  type="range" min="0" max={duration || 0} value={currentTime}
                  onChange={(e) => handleSeek(parseFloat(e.target.value))}
                  className="w-full h-1 bg-primary/0 rounded cursor-pointer accent-primary mb-4"
                />

                <div className="flex gap-2 mb-4">
                  <button onClick={handlePrev} disabled={nowPlayingIndex === 0}
                    className="bg-primary/0 hover:bg-primary/30 text-primary py-2 px-3 rounded font-bold transition-colors disabled:opacity-30">⏮</button>
                  <button onClick={handlePlayPause}
                    className="flex-1 bg-primary/0 hover:bg-primary/30 text-primary py-2 px-4 rounded font-bold transition-colors">
                    {isPlaying ? '⏸ PAUSE' : '▶ PLAY'}
                  </button>
                  <button onClick={handleNext} disabled={nowPlayingIndex === videoLinks.length - 1}
                    className="bg-primary/0 hover:bg-primary/30 text-primary py-2 px-3 rounded font-bold transition-colors disabled:opacity-30">⏭</button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-s text-text-main/70">🔊</span>
                  <input type="range" min="0" max="100" value={volume}
                    onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
                    className="flex-1 h-1 bg-primary/0 rounded cursor-pointer accent-primary" />
                  <span className="text-xs text-text-main/70 w-8 text-right">{volume}</span>
                </div>
              </div>
            )}
          </div>
        </div>
        </section>

        {/* 탭형 인벤토리 / 선물 섹션 */}
        <InventorySection />

        {/* ARCHIVE_HISTORY */}
        <section className="px-12 py-12 bg-main border-b border-border-primary relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2" />
          <div className="flex flex-col md:flex-row gap-12 max-w-6xl mx-auto">
            <div className="md:w-1/4">
              <span className="text-primary font-bold text-s tracking-widest">ARCHIVE_BADGES</span>
              <p className="text-text-main/50 text-s leading-relaxed font-pf-stardust">
                무엇을 해냈나요?
              </p>
            </div>
            <div className="md:w-2/3 flex gap-8 overflow-x-auto pb-8 scrollbar-hide border border-border-primary">
            뱃지 목록
            </div>
          </div>
        </section>

      </main>

      <footer className="px-12 py-8 border-t border-border-primary bg-main flex justify-between items-center text-[9px] font-bold text-text-main/50 uppercase tracking-widest">
        <div className="flex gap-12">
          <p className="font-pf-stardust">Local_Time: ?</p>
          <p className="font-pf-stardust">System_Temp: 14.5°C</p>
          <p className="font-pf-stardust">Link_Strength: 98%</p>
        </div>
        <p className="text-primary font-pf-stardust">© ASCENSION TOWER</p>
      </footer>
    </div>
  );
}