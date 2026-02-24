import { configureStore } from '@reduxjs/toolkit';
// import userReducer from './userSlice'; // 나중에 userSlice를 만들면 주석 해제

export const store = configureStore({
  reducer: {
    // user: userReducer, // 나중에 userSlice를 만들면 주석 해제
  },
});

