/**
 * MemberDetailModal
 *
 * CommonModal을 wrapper로 사용.
 * PlaylistPlayer를 재사용하며, showPopover=false (타인 플레이리스트 → 메시지 팝오버 없음).
 *
 * Props
 * ─────────────────────────────────────────────────────────────
 * memberId   {string}    필수. 조회할 멤버 ID
 * isOpen     {boolean}   필수. 모달 표시 여부
 * onClose    {function}  필수. 모달 닫기 핸들러
 * ─────────────────────────────────────────────────────────────
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CommonModal from './CommonModal.jsx';
import PlaylistPlayer from '../PlayListPlayer/PlayListPlayer.jsx';

const API = 'http://localhost:8081';

// ── 유틸 ─────────────────────────────────────
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
    const res = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
    );
    if (!res.ok) throw new Error();
    const data = await res.json();
    return data.title || null;
  } catch {
    return null;
  }
}

// ── 컴포넌트 ─────────────────────────────────
export default function MemberDetailModal({ memberId, isOpen, onClose }) {
  const [member,    setMember]    = useState(null);
  const [playlist,  setPlaylist]  = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error,     setError]     = useState(null);

  // 모달 열릴 때마다 데이터 fetch
  useEffect(() => {
    if (!isOpen || !memberId) return;

    const load = async () => {
      setIsLoading(true);
      setError(null);
      setMember(null);
      setPlaylist([]);
      try {
        const [memberRes, playlistRes] = await Promise.all([
          axios.get(`${API}/members/${memberId}`,          { withCredentials: true }),
          axios.get(`${API}/members/${memberId}/playlist`, { withCredentials: true }),
        ]);

        if (memberRes.data.Status !== 'Success') throw new Error(memberRes.data.Error);
        setMember(memberRes.data.member);

        const raw = playlistRes.data.playlist || [];
        const enriched = await Promise.all(
          raw.map(async (track, i) => {
            const videoId = getYouTubeID(track.youtube_url);
            if (!videoId) return { ...track, url: track.youtube_url, title: `Track ${i + 1}` };
            const title = await fetchYouTubeTitle(videoId);
            return { ...track, url: track.youtube_url, title: title || `Track ${i + 1}` };
          }),
        );
        setPlaylist(enriched);
      } catch (err) {
        console.error('멤버 디테일 로드 실패:', err);
        setError('데이터를 불러오지 못했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [isOpen, memberId]);

  // 모달 닫힐 때 초기화
  useEffect(() => {
    if (!isOpen) {
      setMember(null);
      setPlaylist([]);
      setError(null);
    }
  }, [isOpen]);

  return (
    <CommonModal
      isOpen={isOpen}
      onClose={onClose}
      title="MEMBER_DETAIL"
      status={member ? `ID: ${member.id}` : 'LOADING...'}
      headline={member?.char_name ?? '———'}
      moduleId={member?.position ?? 'UNKNOWN'}
      timestamp={member?.char_age ? ` ${member.char_age}` : '—'}
    >
      {/* ── 에러 ── */}
      {error && (
        <p className="text-red-400 text-sm font-one-store-mobile-gothic-body">{error}</p>
      )}

      {/* ── 로딩 ── */}
      {isLoading && !error && (
        <div className="flex items-center gap-3 py-4">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin flex-shrink-0" />
          <span className="text-sm text-text-main/50 font-one-store-mobile-gothic-body">LOADING...</span>
        </div>
      )}

      {/* ── 본문: 프로필 + 플레이리스트 ── */}
      {!isLoading && !error && member && (
        <div className="flex flex-col md:flex-row gap-6">

          {/* 왼쪽: 아바타 + 간단 정보 */}
          <div className="flex-shrink-0 flex flex-col items-center gap-3 md:w-36">
            <div className="w-36 h-36 border border-border-primary overflow-hidden bg-primary/10 flex items-center justify-center">
              {member.image_url ? (
                <img
                  src={`${API}${member.image_url}`}
                  alt={member.char_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-primary/30 text-3xl">-</span>
              )}
            </div>
          </div>

          {/* 오른쪽: 플레이리스트 */}
          <div className="flex-1 min-h-0 flex flex-col">
            <p className="text-[12px] font-bold tracking-widest text-primary mb-1 uppercase">
              Playlist
            </p>
            {/* PlaylistPlayer: showPopover 없음 → 타인 플레이리스트이므로 메시지 팝오버 비활성 */}
            <PlaylistPlayer
              playlist={playlist}
              isLoading={false}
              ownerName={member?.char_name} 
              className="max-h-60"
            />
          </div>
        </div>
      )}
    </CommonModal>
  );
}