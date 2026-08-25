import { createSlice } from "@reduxjs/toolkit";

const savedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
const isValidToken = savedToken && savedToken !== "null" && savedToken !== "undefined";

const initialState = {
  user: null,
  token: isValidToken ? savedToken : null,
  loading: false,
  error: null,
  isAuthenticated: !!isValidToken,
  permissions: [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      
      const payloadPermissions = action.payload.permissions;
      const userPermissions = action.payload.user?.permissions;
      const finalPermissions = payloadPermissions || userPermissions || [];
      
      state.permissions = finalPermissions.map((p) =>
        typeof p === "object" ? p.name : p
      );
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.permissions = [];
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } =
  authSlice.actions;

export default authSlice.reducer;
