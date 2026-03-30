import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  playlist: [],
  nowPlayingIndex: null,
  isPlaying: false,
  showPlayer: false,
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setPlaylist: (state, action) => {
      const { playlist, startIndex = 0 } = action.payload;
      state.playlist = playlist;
      state.nowPlayingIndex = startIndex;
      state.isPlaying = true;
      state.showPlayer = true;
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
    }
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
