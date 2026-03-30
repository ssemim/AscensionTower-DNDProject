import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../Landing/index.css';
import badges from './badge.js';
import { useDispatch } from 'react-redux';
import { login } from '../../store/authSlice';
import { useNavigate } from 'react-router-dom';
import PlaylistPlayer from '../../components/PlayListPlayer/PlayListPlayer.jsx';
import ReceiveAndUseModal from '../../components/Modal/ReceiveAndUseModal';

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
// 인벤토리 아이템 카드
// ───────────────────────────────────────────
function ItemCard({ item, onClick }) {
  return (
    <div onClick={onClick} className="flex-shrink-0 w-36 border border-border-primary p-3 flex flex-col gap-2 hover:bg-primary/10 transition-colors duration-200 cursor-pointer">
      <div className="w-full aspect-square bg-primary/10 flex items-center justify-center text-primary/30 text-s">[ IMG ]</div>
      <p className="text-s font-bold truncate text-text-main font-one-store-mobile-gothic-body">{item.item_name || `Item_${item.item_id}`}</p>
      <p className="text-[10px] text-text-main/50 font-one-store-mobile-gothic-body">x{item.quantity}</p>
    </div>
  );
}

// ───────────────────────────────────────────
// 우편함 카드
// ───────────────────────────────────────────
function MailCard({ mail, onReceive }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const messageIsLong = mail.message && mail.message.length > 20;

  return (
    <div className="flex-shrink-0 w-36 border border-border-primary p-3 flex flex-col gap-2 hover:bg-primary/10 transition-colors duration-200">
      <div className="w-full aspect-square bg-primary/10 flex items-center justify-center text-primary/30 text-s">[ MAIL ]</div>
      <p className="text-s font-bold truncate text-text-main font-one-store-mobile-gothic-body">{mail.item_name || '메시지'}</p>
      <p className="text-[10px] text-text-main/50 font-one-store-mobile-gothic-body truncate">from: {mail.sender_name || mail.sender_id}</p>
      {mail.message && (
        <div className="text-[14px] text-text-main/40 font-one-store-mobile-gothic-body">
          <p className={!isExpanded ? 'truncate' : ''}>
            "{mail.message}"
          </p>
          {messageIsLong && (
            <button onClick={() => setIsExpanded(!isExpanded)} className="text-xs text-primary/70 hover:underline mt-1">
              {isExpanded ? '접기' : '더보기'}
            </button>
          )}
        </div>
      )}
      {mail.item_id && !mail.item_received && (
        <button
          onClick={() => onReceive(mail)}
          className="text-[14px] border-primary border-border-primary/30 hover:bg-primary/40 text-primary font-bold py-1 rounded transition-colors mt-auto"
        >
          수령하기
        </button>
      )}
      {mail.item_id && mail.item_received ? (
        <button
          disabled
          className="text-[14px] bg-transparent border border-border-primary/30 text-text-main/30 font-bold py-1 rounded cursor-not-allowed mt-auto"
        >
          수령 완료
        </button>
      ) : null}
      {!mail.item_id && (
        <button
          disabled
          className="text-[14px] bg-transparent border border-border-primary/30 text-text-main/30 font-bold py-1 rounded cursor-not-allowed mt-auto"
        >
          수령 완료
        </button>
      )}
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
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchTab = async (tab) => {
    setIsLoading(true);
    try {
      const endpointMap = {
        inventory: `${API}/mypage/inventory`,
        gifted:    `${API}/mypage/mailbox`,
        friends:   `${API}/mypage/friends`,
      };
      const res = await axios.get(endpointMap[tab], { withCredentials: true });
      if (tab === 'inventory') {
        setInventoryItems(res.data.inventory || []);
      } else if (tab === 'gifted') {
        setMailboxItems(res.data.mailbox || []);
      } else {
        setFriends(res.data.friends || []);
      }
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
        if (selectedMail.message) {
          setMailboxItems(prev => prev.map(m =>
            m.mail_id === selectedMail.mail_id ? { ...m, item_received: 1 } : m
          ));
        } else {
          setMailboxItems(prev => prev.filter(m => m.mail_id !== selectedMail.mail_id));
        }
        fetchTab('inventory');
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
      {selectedMail && (
        <ReceiveAndUseModal
          title="INCOMING MAIL"
          confirmText="RECEIVE"
          from={selectedMail.sender_name || selectedMail.sender_id}
          itemName={selectedMail.item_name}
          quantity={selectedMail.quantity}
          description={selectedMail.message}
          onConfirm={confirmReceive}
          onClose={() => setSelectedMail(null)}
          isGacha={false}
        />
      )}

      {selectedItem && (
        <ReceiveAndUseModal
          title="USE ITEM"
          confirmText="USE"
          itemName={selectedItem.item_name}
          quantity={selectedItem.quantity}
          description={selectedItem.description}
          invId={selectedItem.inv_id}
          itemId={selectedItem.item_id}
          isGacha={selectedItem.item_id === 12}
          onUseSuccess={() => fetchTab('inventory')}
          onConfirm={() => {
            alert(`[${selectedItem.item_name}] 사용 (API 미구현)`);
            setSelectedItem(null);
          }}
          onClose={() => setSelectedItem(null)}
        />
      )}

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
              {isLoading ? <p className="text-text-main/50 text-s font-one-store-mobile-gothic-body">로딩 중...</p>
                : friends.length > 0 ? (
                  <div className="space-y-2 w-full">
                    {friends.map((friend) => (
                      <div key={friend.id} className="border border-border-primary p-4 flex items-center gap-4 hover:bg-primary/10 transition-colors">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center overflow-hidden">
                          {friend.image_url ? <img src={friend.image_url} alt={friend.char_name} className="w-full h-full object-cover" /> : <span className="text-primary/50">👤</span>}
                        </div>
                        <div>
                          <p className="font-bold text-text-main font-one-store-mobile-gothic-body">{friend.char_name}</p>
                          <p className="text-sm text-text-main/50">{friend.position || '-'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-text-main/50 text-lg font-one-store-mobile-gothic-body mt-8">친구가 없습니다.</p>}
            </div>
          )}

          {activeTab === 'inventory' && (
            <div className="min-h-[30vh] max-h-[60vh] flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {isLoading ? <p className="text-text-main/50 text-s self-center font-one-store-mobile-gothic-body">로딩 중...</p>
                : inventoryItems.length > 0
                  ? inventoryItems.map((item) => <ItemCard key={item.inv_id} item={item} onClick={() => setSelectedItem(item)} />)
                  : <p className="text-text-main/50 text-lg self-center font-one-store-mobile-gothic-body">보유한 아이템이 없습니다.</p>}
            </div>
          )}

          {activeTab === 'gifted' && (
            <div className="min-h-[30vh] max-h-[60vh] flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {isLoading ? <p className="text-text-main/50 text-s self-center font-one-store-mobile-gothic-body">로딩 중...</p>
                : mailboxItems.length > 0
                  ? mailboxItems.map((mail) => <MailCard key={mail.mail_id} mail={mail} onReceive={setSelectedMail} />)
                  : <p className="text-text-main/50 text-lg self-center font-one-store-mobile-gothic-body">수령할 메일이 없습니다.</p>}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

// ───────────────────────────────────────────
// 메인 페이지
// ───────────────────────────────────────────
export default function MyPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [authStatus, setAuthStatus] = useState('loading'); 
  const [member, setMember] = useState(null);
  const [stats, setStats] = useState(null);
  const [videoLinks, setVideoLinks] = useState([]);
  const [isLoadingPlaylist, setIsLoadingPlaylist] = useState(true);
  const [earnedBadgeIds, setEarnedBadgeIds] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  
    useEffect(() => {
      const fetchData = async () => {
        setIsLoadingPlaylist(true);
        try {
          const [myPageRes, statsRes] = await Promise.all([
            axios.get(`${API}/mypage`, { withCredentials: true }),
            axios.get(`${API}/mypage/stat`, { withCredentials: true })
          ]);
  
          if (myPageRes.data.Status !== 'Success') {
            setAuthStatus('unauthenticated');
            return;
          }
  
          setAuthStatus('authenticated');
          dispatch(login());
          setMember(myPageRes.data.member);
  
          if (statsRes.data.Status === 'Success') {
            setStats(statsRes.data.stat);
          }
  
          const playlist = myPageRes.data.playlist || [];
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
          console.error('마이페이지 데이터 로드 실패:', err);
          setAuthStatus('unauthenticated');
        } finally {
          setIsLoadingPlaylist(false);
        }
      };
      fetchData();
    }, [dispatch]);
  
  
    useEffect(() => {
      axios.get(`${API}/mypage/badges`, { withCredentials: true })
        .then(res => { if (res.data.Status === 'Success') setEarnedBadgeIds(res.data.badges.map(b => b.badge_id)); })
        .catch(err => console.error('뱃지 로드 실패:', err));
    }, []);

  if (authStatus === 'loading') {
  return (
    <div className="min-h-screen bg-main flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

if (authStatus === 'unauthenticated') {
  return (
    <div className="min-h-screen bg-main flex items-center justify-center text-text-main font-mono">
      <div className="text-center p-8 bg-main-secondary border border-border-primary rounded-lg shadow-stark-glow">
        <h1 className="text-2xl font-bold text-primary mb-4 uppercase tracking-widest">Access Restricted</h1>
        <p className="mb-8 font-one-store-mobile-gothic-body">로그인이 필요한 페이지입니다.</p>
        <button
          onClick={() => navigate('/login')}
          className="bg-primary hover:bg-primary/80 text-white font-bold py-3 px-10 rounded-lg transition-colors tracking-widest text-sm"
        >
          INITIATE LOGIN
        </button>
      </div>
    </div>
  );
}
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

  return (
    <>
      <div className="min-h-screen bg-main text-text-main font-mono relative">
        <div className="fixed inset-0 pointer-events-none bg-stark-grid opacity-0 dark:opacity-100" />

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
                  <>
                    <ul className="space-y-2 font-one-store-mobile-gothic-body text-sm text-text-main/70">
                      <li className="border-b border-border-primary/30 pb-1">NAME : {member.char_name}</li>
                      <li className="border-b border-border-primary/30 pb-1">AGE : {member.char_age}</li>
                      <li className="border-b border-border-primary/30 pb-1">POSITION : {member.position || '-'}</li>
                      <li className="border-b border-border-primary/30 pb-1">POINT : {member.point}</li>
                      {stats && (
                        <li className="pb-1">
                          STATS
                          <div className="grid grid-cols-5 gap-1 pt-1 text-center">
                            <div><span className="font-bold text-primary">ATK</span><br/>{stats.ATK}</div>
                            <div><span className="font-bold text-primary">DEF</span><br/>{stats.DEF}</div>
                            <div><span className="font-bold text-primary">DEX</span><br/>{stats.DEX}</div>
                            <div><span className="font-bold text-primary">LUCK</span><br/>{stats.LUCK}</div>
                            <div><span className="font-bold text-primary">REMAIN</span><br/>{stats.REMAIN || 0}</div>
                          </div>
                        </li>
                      )}
                    </ul>
                  </>
                ) : (
                  <p className="text-text-main/50 font-one-store-mobile-gothic-body">로딩 중...</p>
                )}
              </div>

              {/* 플레이리스트 */}
              <div className="w-full md:w-4/12 border border-border-primary p-4 flex flex-col">
                <h4 className="text-lg font-bold mb-4 text-primary flex-shrink-0">PLAYLIST</h4>
                <div className="flex-1 min-h-0">
                    <PlaylistPlayer 
                        playlist={videoLinks} 
                        isLoading={isLoadingPlaylist}
                        showPopover={true}
                        className="h-full"
                    />
                </div>
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
                <p className="text-text-main/50 text-s leading-relaxed font-one-store-mobile-gothic-body">무엇을 해냈나요?</p>
              </div>
              <div className="md:w-2/3 grid grid-cols-4 gap-2 bg-main p-4 border border-border-primary h-full max-h-64 overflow-y-auto">
                {badges.map((badge) => {
                  const isEarned = earnedBadgeIds.includes(badge.id);
                  return (
                    <div key={badge.id}
                      className={`aspect-square border flex flex-col items-center justify-center relative transition-all cursor-pointer group font-one-store-mobile-gothic-body text-lg text-text-main/70
                        ${badge.isEmpty || !isEarned ? 'border-border-primary bg-main/40 opacity-30' : 'border-border-primary/70 bg-primary/10 hover:border-primary hover:shadow-stark-glow'}`}
                    >
                      {!badge.isEmpty && isEarned && (
                        <>
                          <img src={badge.imgUrl} alt={badge.name} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-main/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                            <div className="text-center text-xs text-text-main font-primary">{badge.desc}</div>
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
            <p className="font-one-store-mobile-gothic-body">Local_Time: ?</p>
            <p className="font-one-store-mobile-gothic-body">System_Temp: 15°C</p>
            <p className="font-one-store-mobile-gothic-body">Link_Strength: 98%</p>
          </div>
          <p className="text-primary font-one-store-mobile-gothic-body">© ASCENSION TOWER</p>
        </footer>
      </div>
    </>
  );
}
