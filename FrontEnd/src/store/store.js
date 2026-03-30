import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import authReducer from './authSlice';
import playerReducer from './playerSlice';

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
    auth: authReducer,
    player: playerReducer,
  },
});

store.subscribe(() => {
  saveState(store.getState());
});
