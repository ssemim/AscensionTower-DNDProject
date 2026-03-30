import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setPlaylist } from '../../store/playerSlice';


// TrackButton remains mostly the same, but its state is now driven by global props
function TrackButton({ video, index, isPlaying, isActive, onPlay, showPopover }) {
  const [popoverPos,    setPopoverPos]    = useState(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const timeoutRef = useRef(null);
  const btnRef     = useRef(null);
  const titleRef   = useRef(null);

  const POPOVER_W = 208;
  const POPOVER_H = 90;

  useEffect(() => {
    const check = () => {
      if (!titleRef.current) return;
      const next = titleRef.current.scrollWidth > titleRef.current.clientWidth;
      if (next !== isOverflowing) setIsOverflowing(next);
    };
    const id = setTimeout(check, 50);
    window.addEventListener('resize', check);
    return () => { clearTimeout(id); window.removeEventListener('resize', check); };
  }, [video.title, isOverflowing]);

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    if (!showPopover || (!video.added_by && !video.message)) return;
    const rect = btnRef.current?.getBoundingClientRect();
    if (!rect) return;

    const isMobile = window.innerWidth < 768;
    let top, left;
    if (isMobile) {
      const spaceBelow = window.innerHeight - rect.bottom;
      top  = spaceBelow >= POPOVER_H + 8
        ? rect.bottom + window.scrollY + 8
        : rect.top    + window.scrollY - POPOVER_H - 8;
      left = Math.max(8, Math.min(rect.left, window.innerWidth - POPOVER_W - 8));
    } else {
      const spaceRight = window.innerWidth - rect.right;
      left = spaceRight >= POPOVER_W + 8 ? rect.right + 8 : rect.left - POPOVER_W - 8;
      top  = rect.top + window.scrollY;
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
        className={`w-full text-left p-2 rounded transition-colors duration-200 flex items-center
          ${isActive ? 'bg-primary/30' : 'hover:bg-primary/10'}`}
      >
        <span className="font-bold">{isActive && isPlaying ? '▶' : '▷'}</span>
        <div className="ml-3 text-sm overflow-hidden flex-1">
          <p
            ref={titleRef}
            className={`whitespace-nowrap ${isOverflowing && isActive && isPlaying ? 'animate-marquee' : 'truncate'}`}
          >
            {video.title}
          </p>
        </div>
      </button>

      {showPopover && popoverPos && createPortal(
        <div
          onMouseEnter={() => clearTimeout(timeoutRef.current)}
          onMouseLeave={handleMouseLeave}
          style={{ position: 'absolute', top: popoverPos.top, left: popoverPos.left }}
          className="z-[9999] w-52 bg-main border border-border-primary rounded-lg p-3 shadow-stark-glow"
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent rounded-t-lg" />
          {video.added_by && (
            <p className="text-xs text-text-main/70 font-one-store-mobile-gothic-body mb-1">
              <span className="text-text-main font-bold text-sm">from:</span>{' '}
              <span className="text-primary font-bold text-lg">{video.added_by_name}</span>
            </p>
          )}
          {video.message && (
            <p className="text-lg text-text-main font-one-store-mobile-gothic-body leading-relaxed border-t border-border-primary/30 pt-2 mt-1">
              "{video.message}"
            </p>
          )}
        </div>,
        document.body,
      )}
    </>
  );
}


// This component now only displays a list of tracks and dispatches actions
// to the global player.
export default function PlayListPlayer({
  playlist = [],
  isLoading = false,
  showPopover = false,
  className = '',
}) {
  const dispatch = useDispatch();
  const { nowPlayingIndex: globalPlayingIndex, playlist: globalPlaylist, isPlaying } = useSelector(state => state.player);

  const handlePlay = (index) => {
    dispatch(setPlaylist({ playlist, startIndex: index }));
  };

  // Check if the displayed playlist is the one active in the global player.
  // This could be improved with unique IDs for playlists.
  const isThisPlaylistActive = JSON.stringify(playlist) === JSON.stringify(globalPlaylist);

  return (
    <div className={className}>
      {isLoading ? (
        <p className="text-text-main/50 text-sm font-one-store-mobile-gothic-body">로딩 중...</p>
      ) : playlist.length > 0 ? (
        <div className="space-y-2">
          {playlist.map((video, index) => (
            <TrackButton
              key={video.track_id ?? index}
              video={video}
              index={index}
              isActive={isThisPlaylistActive && index === globalPlayingIndex}
              isPlaying={isThisPlaylistActive && index === globalPlayingIndex && isPlaying}
              onPlay={handlePlay}
              showPopover={showPopover}
            />
          ))}
        </div>
      ) : (
        <p className="text-text-main/50 text-lg font-one-store-mobile-gothic-body">선물받은 BGM이 아직 없습니다.</p>
      )}
    </div>
  );
}