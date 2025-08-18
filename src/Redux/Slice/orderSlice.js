import { createSlice } from "@reduxjs/toolkit";

const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    list: null,
  },
  reducers: {
    addOrder: (state, action) => {
      state.latest = {
        ...action.payload,
      };
    },
  },
});
export const { addOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
