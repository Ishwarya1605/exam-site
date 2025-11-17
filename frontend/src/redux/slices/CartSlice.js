import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [], // {id, title, price?, image}
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      const item = action.payload;
      const exists = state.items.find((i) => i.id === item.id);
      if (!exists) {
        state.items.push(item);
      }
    },
    removeFromCart(state, action) {
      const id = action.payload;
      state.items = state.items.filter((i) => i.id !== id);
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;


