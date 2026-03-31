import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  playlist: [],
  nowPlayingIndex: null,
  isPlaying: false,
  showPlayer: false,
  ownerName: null, // ← 추가
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setPlaylist: (state, action) => {
      const { playlist, startIndex = 0, ownerName = null } = action.payload;
      // 필수 데이터인 playlist가 유효한 배열인지, 비어있지 않은지 확인합니다.
      if (Array.isArray(playlist) && playlist.length > 0) {
        state.playlist = playlist;
        // startIndex가 playlist 범위 내에 있는지 확인하고 벗어난 경우 0으로 설정합니다.
        state.nowPlayingIndex = startIndex < playlist.length && startIndex >= 0 ? startIndex : 0;
        state.isPlaying = true;
        state.showPlayer = true;
        state.ownerName = ownerName;
      } else {
        // playlist가 유효하지 않을 경우, 콘솔에 에러를 기록하고 상태를 변경하지 않습니다.
        // 이는 잠재적인 앱 충돌을 방지합니다.
        console.error("setPlaylist was called with an invalid or empty playlist.", playlist);
      }
    },
    playNext: (state) => {
      if (state.playlist.length > 0) {
        const nextIndex = (state.nowPlayingIndex + 1) % state.playlist.length;
        state.nowPlayingIndex = nextIndex;
        state.isPlaying = true;
      }
    },
    playPrev: (state) => {
      if (state.playlist.length > 0) {
        const prevIndex = (state.nowPlayingIndex - 1 + state.playlist.length) % state.playlist.length;
        state.nowPlayingIndex = prevIndex;
        state.isPlaying = true;
      }
    },
    setIsPlaying: (state, action) => {
      state.isPlaying = action.payload;
    },
    setShowPlayer: (state, action) => {
      state.showPlayer = action.payload;
    },
    clearPlaylist: (state) => {
      state.playlist = [];
      state.nowPlayingIndex = null;
      state.isPlaying = false;
      state.showPlayer = false;
      state.ownerName = null;
    },
  },
});

export const {
  setPlaylist,
  playNext,
  playPrev,
  setIsPlaying,
  setShowPlayer,
  clearPlaylist,
} = playerSlice.actions;

export default playerSlice.reducer;