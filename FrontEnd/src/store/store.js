import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
// import userReducer from './userSlice'; // 나중에 userSlice를 만들면 주석 해제

const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state.cart);
    localStorage.setItem('cart', serializedState);
  } catch {
    // ignore write errors
  }
};

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    // user: userReducer, // 나중에 userSlice를 만들면 주석 해제
  },
});

store.subscribe(() => {
  saveState(store.getState());
});
