import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: {},
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    incrementItem: (state, action) => {
      const productId = action.payload;
      state.items[productId] = (state.items[productId] || 0) + 1;
    },
    decrementItem: (state, action) => {
      const productId = action.payload;
      if (state.items[productId]) {
        state.items[productId] = Math.max(state.items[productId] - 1, 0);
      }
    },
    setCart: (state, action) => {
      state.items = action.payload;
    },
    clearCart: (state) => {
        state.items = {};
    },
  },
});

export const { incrementItem, decrementItem, setCart,clearCart } = cartSlice.actions;
export default cartSlice.reducer;
