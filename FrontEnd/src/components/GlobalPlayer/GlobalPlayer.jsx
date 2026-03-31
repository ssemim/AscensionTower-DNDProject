import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import YouTube from 'react-youtube';
import { setIsPlaying, playNext, playPrev, setShowPlayer } from '../../store/playerSlice';
import PlayListPlayer from '../PlayListPlayer/PlayListPlayer';

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

function formatTime(s) {
    if (!s || isNaN(s)) return '0:00';
    return `${Math.floor(s / 60)}:${Math.floor(s % 60)
      .toString()
      .padStart(2, '0')}`;
}

export default function GlobalPlayer() {
  const dispatch = useDispatch();
  const { playlist, nowPlayingIndex, isPlaying, showPlayer } = useSelector((state) => state.player);

  const playerRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(100);
  const [isPlaylistVisible, setIsPlaylistVisible] = useState(false);

  const currentTrack = nowPlayingIndex !== null ? playlist[nowPlayingIndex] : null;
  const videoId = currentTrack ? getYouTubeID(currentTrack.url) : null;

  useEffect(() => {
    if (playerRef.current && videoId && isPlaying) {
      playerRef.current.loadVideoById(videoId);
    }
  }, [nowPlayingIndex, videoId]);

  useEffect(() => {
    if (playerRef.current) {
        if(isPlaying) playerRef.current.playVideo();
        else playerRef.current.pauseVideo();
    }
  }, [isPlaying]);

  useEffect(() => {
    const id = setInterval(() => {
      if (playerRef.current && isPlaying) {
        setCurrentTime(playerRef.current.getCurrentTime() || 0);
        setDuration(playerRef.current.getDuration() || 0);
      }
    }, 500);
    return () => clearInterval(id);
  }, [isPlaying]);

  const onPlayerReady = (e) => {
    playerRef.current = e.target;
    playerRef.current.setVolume(volume);
    if (isPlaying && videoId) {
        playerRef.current.loadVideoById(videoId);
    }
  };

  const onPlayerStateChange = (e) => {
    if (e.data === window.YT.PlayerState.PLAYING) {
      if (!isPlaying) dispatch(setIsPlaying(true));
    } else if (e.data === window.YT.PlayerState.PAUSED) {
      if (isPlaying) dispatch(setIsPlaying(false));
    } else if (e.data === window.YT.PlayerState.ENDED) {
      dispatch(playNext());
    }
  };

  const handlePlayPause = () => dispatch(setIsPlaying(!isPlaying));
  const handlePrev = () => dispatch(playPrev());
  const handleNext = () => dispatch(playNext());

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    playerRef.current?.seekTo(time, true);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value, 10);
    setVolume(newVolume);
    playerRef.current?.setVolume(newVolume);
  };

  // 플레이어 전체를 닫는 함수
  const handleClosePlayer = () => {
    dispatch(setShowPlayer(false));
  };

  if (!showPlayer || !currentTrack) {
    return null;
  }

  return (
    <>
        {/* 메인 플레이어 컨테이너 (relative 추가하여 내부 close 버튼 배치) */}
        <div className="fixed bottom-4 right-4 w-96 bg-main border border-border-primary z-50 p-4 flex flex-col gap-3 rounded-lg shadow-lg">
            
            {/* 플레이어 자체 닫기 버튼 (우측 상단) */}
            <button 
                onClick={handleClosePlayer} 
                className="absolute top-2 right-2 text-text-main hover:text-red-500 transition-colors"
                title="닫기"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>

            <div className="hidden">
                <YouTube
                onReady={onPlayerReady}
                onStateChange={onPlayerStateChange}
                opts={{ height: '0', width: '0', playerVars: { autoplay: 1 } }}
                videoId={videoId}
                />
            </div>

            {/* 타이틀 영역 (닫기 버튼 자리를 위해 오른쪽 패딩 추가) */}
            <div className="pr-6">
                <p className="text-sm font-bold text-text-main truncate">{currentTrack.title}</p>
            </div>

            <div className="w-full">
                <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-1 rounded cursor-pointer accent-primary"
                />
                <div className="text-xs flex justify-between mt-1 text-text-main/70">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                </div>
            </div>

            <div className="flex items-center justify-between gap-4">
                 <div className="flex-1 flex items-center justify-center gap-2">
                    <button onClick={handlePrev} className="hover:bg-primary/30 text-primary p-2 rounded-full font-bold transition-colors disabled:opacity-30">
                        <span className="text-lg">⏮</span>
                    </button>
                    <button onClick={handlePlayPause} className="w-12 h-12 flex items-center justify-center bg-primary hover:bg-primary/80 text-white p-2 rounded-full font-bold transition-colors text-xl">
                        {isPlaying ? '⏸' : '▶'}
                    </button>
                    <button onClick={handleNext} className="hover:bg-primary/30 text-primary p-2 rounded-full font-bold transition-colors disabled:opacity-30">
                        <span className="text-lg">⏭</span>
                    </button>
                </div>
                
                <div className="flex items-center gap-2">
                    <span className="text-s text-text-main/70">🔊</span>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="w-20 h-1 rounded cursor-pointer accent-primary"
                    />
                    <button onClick={() => setIsPlaylistVisible(!isPlaylistVisible)} className="text-primary hover:bg-primary/20 p-2 rounded-md">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>

         {isPlaylistVisible && (
            <div className="fixed bottom-48 right-4 w-96 h-[40vh] bg-main border border-border-primary z-40 rounded-lg shadow-lg flex flex-col transition-all duration-300">
                <div className="p-4 border-b border-border-primary flex justify-between items-center flex-shrink-0">
                    <h3 className="font-bold text-lg text-primary">Playlist </h3>
                    {/* 재생목록 닫기 버튼: text-text-main 적용 및 stroke 설정 수정 */}
                    <button 
                        onClick={() => setIsPlaylistVisible(false)} 
                        className="text-text-main hover:text-primary transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-2 text-text-main">
                    <PlayListPlayer 
                        playlist={playlist}
                        isLoading={false}
                        showPopover={false}
                    />
                </div>
            </div>
        )}
    </>
  );
}