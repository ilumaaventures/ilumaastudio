import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as wishlistService from "../../api/wishlistService";

const loadWishlistFromStorage = () => {
  try {
    const saved = localStorage.getItem("wishlist");
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
};

export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (_, { rejectWithValue }) => {
    try {
      const response = await wishlistService.getWishlist();
      const list = response.products || response.wishlist || response.data || [];
      localStorage.setItem("wishlist", JSON.stringify(list));
      return list;
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
      return response.products || response.wishlist || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async (product, { getState, rejectWithValue }) => {
    const { auth } = getState();
    const productId = product._id || product.id;

    if (!auth.isAuthenticated) {
      const items = loadWishlistFromStorage();
      const exists = items.some(
        (i) => (i._id || i.id || i) === productId || String(i) === String(productId)
      );
      const newItems = exists ? items : [...items, { ...product, _id: productId }];
      localStorage.setItem("wishlist", JSON.stringify(newItems));
      return newItems;
    }

    try {
      const response = await wishlistService.addToWishlist(productId);
      return response.products || response.wishlist || [];
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
      const items = loadWishlistFromStorage();
      const newItems = items.filter(
        (i) => (i._id || i.id || i) !== productId && String(i) !== String(productId)
      );
      localStorage.setItem("wishlist", JSON.stringify(newItems));
      return newItems;
    }

    try {
      const response = await wishlistService.removeFromWishlist(productId);
      return response.products || response.wishlist || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const toggleWishlist = createAsyncThunk(
  "wishlist/toggleWishlist",
  async (product, { getState, rejectWithValue }) => {
    const { auth, wishlist } = getState();
    const productId = product._id || product.id;

    if (!productId) {
      return rejectWithValue("Invalid product object for wishlist");
    }

    const items = wishlist?.items || loadWishlistFromStorage();
    const existsInState = items.some((item) => {
      const itemId = typeof item === "object" && item !== null ? item._id || item.id : item;
      return String(itemId) === String(productId);
    });

    if (!auth.isAuthenticated) {
      let newItems;
      if (existsInState) {
        newItems = items.filter((item) => {
          const itemId = typeof item === "object" && item !== null ? item._id || item.id : item;
          return String(itemId) !== String(productId);
        });
      } else {
        newItems = [...items, { ...product, _id: productId }];
      }
      localStorage.setItem("wishlist", JSON.stringify(newItems));
      return newItems;
    }

    try {
      if (existsInState) {
        const response = await wishlistService.removeFromWishlist(productId);
        return response.products || response.wishlist || [];
      } else {
        const response = await wishlistService.addToWishlist(productId);
        return response.products || response.wishlist || [];
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
