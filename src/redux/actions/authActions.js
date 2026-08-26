import {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
} from "../reducers/authReducers";

import {
  login,
  register,
  getProfile,
  logout as logoutApi,
  googleLogin,
} from "../../api/authService";

import {
  syncCart,
  fetchCart,
  clearLocalCart,
} from "../reducers/cartReducer";

import {
  syncWishlist,
  fetchWishlist,
  clearLocalWishlist,
} from "../reducers/wishlistReducer";

// Helper to sync cart and wishlist with database upon successful authentication
const syncCartAndWishlist = () => async (dispatch, getState) => {
  try {
    const { cart, wishlist } = getState();

    // Sync cart: if guest cart has items, sync/merge them; otherwise fetch from DB
    if (cart && cart.cartItems && cart.cartItems.length > 0) {
      await dispatch(syncCart(cart.cartItems));
    } else {
      await dispatch(fetchCart());
    }

    // Sync wishlist: if guest wishlist has items, sync/merge them; otherwise fetch from DB
    if (wishlist && wishlist.items && wishlist.items.length > 0) {
      const productIds = wishlist.items.map((item) => item._id);
      await dispatch(syncWishlist(productIds));
    } else {
      await dispatch(fetchWishlist());
    }
  } catch (err) {
    console.error("Failed to sync cart and wishlist after authentication:", err);
  }
};

export const loadUser = () => async (dispatch) => {
  try {
    const existingToken = localStorage.getItem("token");
    if (!existingToken || existingToken === "undefined" || existingToken === "null") {
      return null;
    }
    dispatch(loginStart());
    const response = await getProfile();
    const userPermissions = (response.permissions || []).map((p) =>
      typeof p === "object" ? p.name : p,
    );
    const token = response.token || existingToken;
    if (token) {
      localStorage.setItem("token", token);
    }
    dispatch(
      loginSuccess({
        user: response,
        token: token,
        permissions: userPermissions,
      }),
    );
    // Sync cart and wishlist with backend
    dispatch(syncCartAndWishlist());
    return response;
  } catch (error) {
    if (localStorage.getItem("token")) {
      localStorage.removeItem("token");
    }
    dispatch(loginFailure(error.response?.data?.message || "Session expired"));
    dispatch(logout());
  }
};

export const loginUser = (credentials) => async (dispatch) => {
  try {
    dispatch(loginStart());
    const response = await login(credentials);
    const data = response;
    const rawPermissions = data.permissions || data.profile?.permissions || [];
    const userPermissions = rawPermissions.map((p) =>
      typeof p === "object" ? p.name : p,
    );

    const token = data.token || data.accessToken || data.jwt;
    if (token) {
      localStorage.setItem("token", token);
    }

    dispatch(
      loginSuccess({
        user: data,
        token: token,
        permissions: userPermissions,
      }),
    );
    // Sync cart and wishlist with backend
    dispatch(syncCartAndWishlist());
    return data;
  } catch (error) {
    dispatch(loginFailure(error.response?.data?.message || "Login Failed"));
    throw error;
  }
};

export const registerUser = (userData) => async (dispatch) => {
  try {
    dispatch(loginStart());
    const response = await register(userData);
    const data = response;

    const rawPermissions = data.permissions || [];
    const userPermissions = rawPermissions.map((p) =>
      typeof p === "object" ? p.name : p,
    );

    const token = data.token || data.accessToken || data.jwt;
    if (token) {
      localStorage.setItem("token", token);
    }

    dispatch(
      loginSuccess({
        user: data,
        token: token,
        permissions: userPermissions,
      }),
    );
    // Sync cart and wishlist with backend
    dispatch(syncCartAndWishlist());
    return data;
  } catch (error) {
    dispatch(
      loginFailure(error.response?.data?.message || "Registration Failed"),
    );
    throw error;
  }
};

export const logoutUser = () => async (dispatch) => {
  try {
    await logoutApi();
  } catch (error) {
    console.error("Logout API call failed:", error);
  }
  localStorage.removeItem("token");
  dispatch(logout());
  // Clear cart and wishlist from Redux store and localStorage
  dispatch(clearLocalCart());
  dispatch(clearLocalWishlist());
};

export const loginWithGoogle =
  (code, role = "user") =>
  async (dispatch) => {
    try {
      dispatch(loginStart());
      const response = await googleLogin(code, role);
      const data = response;

      const rawPermissions =
        data.permissions || data.profile?.permissions || [];
      const userPermissions = rawPermissions.map((p) =>
        typeof p === "object" ? p.name : p,
      );

      const token = data.token || data.accessToken || data.jwt;
      if (token) {
        localStorage.setItem("token", token);
      }

      dispatch(
        loginSuccess({
          user: data,
          token: token,
          permissions: userPermissions,
        }),
      );
      // Sync cart and wishlist with backend
      dispatch(syncCartAndWishlist());
      return data;
    } catch (error) {
      dispatch(
        loginFailure(error.response?.data?.message || "Google Login Failed"),
      );
      throw error;
    }
  };

