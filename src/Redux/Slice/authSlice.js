import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: JSON.parse(localStorage.getItem("activeUser")) || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("activeUser", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("activeUser");
    },
    register: (state, action) => {
      localStorage.setItem("registeredUser", JSON.stringify(action.payload));
    },
  },
});

export const { login, logout, register } = authSlice.actions;
export default authSlice.reducer;
