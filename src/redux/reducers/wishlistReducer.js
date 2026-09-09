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
      return loadWishlistFromStorage();
    }
  }
);

export const syncWishlist = createAsyncThunk(
  "wishlist/syncWishlist",
  async (productIds, { rejectWithValue }) => {
    try {
      const response = await wishlistService.syncWishlist(productIds);
      const list = response.products || response.wishlist || [];
      localStorage.setItem("wishlist", JSON.stringify(list));
      return list;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async (product, { getState, rejectWithValue }) => {
    const productId = product._id || product.id;
    const prodImg =
      product.image ||
      product.imageUrl ||
      product.images?.[0]?.url ||
      product.images?.[0] ||
      "";

    try {
      const response = await wishlistService.addToWishlist(productId, {
        name: product.name || product.title,
        price: product.price,
        originalPrice: product.originalPrice,
        image: typeof prodImg === "object" ? prodImg.url : prodImg,
        category: typeof product.category === "object" ? product.category?.name : product.category,
        rating: product.rating,
        inStock: product.inStock,
      });
      const list = response.products || response.wishlist || response.data || [];
      localStorage.setItem("wishlist", JSON.stringify(list));
      return list;
    } catch (error) {
      console.warn("Backend addToWishlist error, using local storage fallback:", error);
      const items = loadWishlistFromStorage();
      const exists = items.some(
        (i) => (i._id || i.id || i) === productId || String(i) === String(productId)
      );
      const newItems = exists ? items : [...items, { ...product, _id: productId, id: productId }];
      localStorage.setItem("wishlist", JSON.stringify(newItems));
      return newItems;
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeFromWishlist",
  async (productId, { getState, rejectWithValue }) => {
    try {
      const response = await wishlistService.removeFromWishlist(productId);
      const list = response.products || response.wishlist || response.data || [];
      localStorage.setItem("wishlist", JSON.stringify(list));
      return list;
    } catch (error) {
      console.warn("Backend removeFromWishlist error, using local storage fallback:", error);
      const items = loadWishlistFromStorage();
      const newItems = items.filter(
        (i) => (i._id || i.id || i) !== productId && String(i) !== String(productId)
      );
      localStorage.setItem("wishlist", JSON.stringify(newItems));
      return newItems;
    }
  }
);

export const toggleWishlist = createAsyncThunk(
  "wishlist/toggleWishlist",
  async (product, { getState, rejectWithValue }) => {
    const { wishlist } = getState();
    const productId = product._id || product.id;

    if (!productId) {
      return rejectWithValue("Invalid product object for wishlist");
    }

    const items = wishlist?.items || loadWishlistFromStorage();
    const existsInState = items.some((item) => {
      const itemId = typeof item === "object" && item !== null ? item._id || item.id : item;
      return String(itemId) === String(productId);
    });

    try {
      let response;
      if (existsInState) {
        response = await wishlistService.removeFromWishlist(productId);
      } else {
        const prodImg =
          product.image ||
          product.imageUrl ||
          product.images?.[0]?.url ||
          product.images?.[0] ||
          "";
        response = await wishlistService.addToWishlist(productId, {
          name: product.name || product.title,
          price: product.price,
          originalPrice: product.originalPrice,
          image: typeof prodImg === "object" ? prodImg.url : prodImg,
          category: typeof product.category === "object" ? product.category?.name : product.category,
          rating: product.rating,
          inStock: product.inStock,
        });
      }
      const list = response.products || response.wishlist || response.data || [];
      localStorage.setItem("wishlist", JSON.stringify(list));
      return list;
    } catch (error) {
      console.warn("Backend toggleWishlist error, using fallback:", error);
      let newItems;
      if (existsInState) {
        newItems = items.filter((item) => {
          const itemId = typeof item === "object" && item !== null ? item._id || item.id : item;
          return String(itemId) !== String(productId);
        });
      } else {
        newItems = [...items, { ...product, _id: productId, id: productId }];
      }
      localStorage.setItem("wishlist", JSON.stringify(newItems));
      return newItems;
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
