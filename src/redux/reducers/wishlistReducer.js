import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as wishlistService from "../../api/wishlistService";

const loadWishlistFromStorage = () => {
  return [];
};

export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (_, { rejectWithValue }) => {
    try {
      const response = await wishlistService.getWishlist();
      return response.products || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const syncWishlist = createAsyncThunk(
  "wishlist/syncWishlist",
  async (productIds, { rejectWithValue }) => {
    try {
      const response = await wishlistService.syncWishlist(productIds);
      localStorage.removeItem("wishlist");
      return response.products || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async (product, { getState, rejectWithValue }) => {
    const { auth } = getState();

    if (!auth.isAuthenticated) {
      alert("Please login first to manage your wishlist.");
      window.location.href = "/login";
      return rejectWithValue("Unauthorized: Please login first");
    }

    try {
      const response = await wishlistService.addToWishlist(product._id);
      return response.products || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeFromWishlist",
  async (productId, { getState, rejectWithValue }) => {
    const { auth } = getState();

    if (!auth.isAuthenticated) {
      alert("Please login first to manage your wishlist.");
      window.location.href = "/login";
      return rejectWithValue("Unauthorized: Please login first");
    }

    try {
      const response = await wishlistService.removeFromWishlist(productId);
      return response.products || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const toggleWishlist = createAsyncThunk(
  "wishlist/toggleWishlist",
  async (product, { getState, rejectWithValue }) => {
    const { auth, wishlist } = getState();
    const productId = product._id;
    const existsInState = wishlist.items.some(item => item._id === productId);

    if (!auth.isAuthenticated) {
      alert("Please login first to manage your wishlist.");
      window.location.href = "/login";
      return rejectWithValue("Unauthorized: Please login first");
    }

    try {
      if (existsInState) {
        const response = await wishlistService.removeFromWishlist(productId);
        return response.products || [];
      } else {
        const response = await wishlistService.addToWishlist(productId);
        return response.products || [];
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  items: loadWishlistFromStorage(),
  loading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    clearLocalWishlist: (state) => {
      state.items = [];
      localStorage.removeItem("wishlist");
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchWishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // syncWishlist
      .addCase(syncWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(syncWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(syncWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // addToWishlist
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      // removeFromWishlist
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      // toggleWishlist
      .addCase(toggleWishlist.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  }
});

export const { clearLocalWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
