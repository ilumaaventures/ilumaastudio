import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as cartService from "../../api/cartService";

const getInitialCart = () => {
  return [];
};

// Helper to map DB response (where items is [{ product: {}, quantity: n, price: p }]) to local flat structure
const mapDbCartToRedux = (dbItems) => {
  if (!dbItems) return [];
  return dbItems.map((item) => {
    const prod = item.product || {};
    const effectiveStock =
      prod.stockQuantity !== undefined
        ? Number(prod.stockQuantity)
        : prod.inventory?.stockQuantity !== undefined
        ? Number(prod.inventory.stockQuantity)
        : prod.stock !== undefined
        ? Number(prod.stock)
        : prod.countInStock !== undefined
        ? Number(prod.countInStock)
        : 0;
    return {
      _id: prod._id || item.product,
      cartItemId: item._id,
      name: prod.name || "Unknown Product",
      price: item.price !== undefined ? item.price : (prod.price || 0),
      selectedOptions: item.selectedOptions || null,
      sku: item.sku || prod.sku || "",
      variantId: item.variantId || null,
      category: prod.category?.name || "Uncategorized",
      image: prod.images?.[0]?.url || "https://via.placeholder.com/400x300?text=No+Image",
      stock: effectiveStock,
      quantity: item.quantity,
    };
  });
};

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartService.getCart();
      return mapDbCartToRedux(response.items);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const syncCart = createAsyncThunk(
  "cart/syncCart",
  async (items, { rejectWithValue }) => {
    try {
      const response = await cartService.syncCart(items);
      localStorage.removeItem("cartItems"); // clear local storage guest cart once synced
      return mapDbCartToRedux(response.items);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ product, quantity }, { getState, rejectWithValue }) => {
    const { auth } = getState();

    if (!auth.isAuthenticated) {
      alert("Please login first to manage your cart.");
      window.location.href = "/login";
      return rejectWithValue("Unauthorized: Please login first");
    }

    try {
      const response = await cartService.addToCart(product._id, quantity, {
        selectedOptions: product.selectedOptions,
        variantSku: product.variantSku,
        variantId: product.variantId,
        price: product.price,
      });
      return mapDbCartToRedux(response.items);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (productId, { getState, rejectWithValue }) => {
    const { auth } = getState();

    if (!auth.isAuthenticated) {
      alert("Please login first to manage your cart.");
      window.location.href = "/login";
      return rejectWithValue("Unauthorized: Please login first");
    }

    try {
      const response = await cartService.removeFromCart(productId);
      return mapDbCartToRedux(response.items);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateCartQuantity = createAsyncThunk(
  "cart/updateCartQuantity",
  async ({ productId, quantity }, { getState, rejectWithValue }) => {
    const { auth } = getState();

    if (!auth.isAuthenticated) {
      alert("Please login first to manage your cart.");
      window.location.href = "/login";
      return rejectWithValue("Unauthorized: Please login first");
    }

    try {
      const response = await cartService.updateCartQuantity(productId, quantity);
      return mapDbCartToRedux(response.items);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { getState, rejectWithValue }) => {
    const { auth } = getState();

    if (!auth.isAuthenticated) {
      alert("Please login first to manage your cart.");
      window.location.href = "/login";
      return rejectWithValue("Unauthorized: Please login first");
    }

    try {
      const response = await cartService.clearCart();
      return mapDbCartToRedux(response.items);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  cartItems: getInitialCart(),
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearLocalCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem("cartItems");
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchCart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // syncCart
      .addCase(syncCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(syncCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload;
      })
      .addCase(syncCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // addToCart
      .addCase(addToCart.fulfilled, (state, action) => {
        state.cartItems = action.payload;
      })
      // removeFromCart
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.cartItems = action.payload;
      })
      // updateCartQuantity
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.cartItems = action.payload;
      })
      // clearCart
      .addCase(clearCart.fulfilled, (state, action) => {
        state.cartItems = action.payload;
      });
  },
});

export const { clearLocalCart } = cartSlice.actions;
export default cartSlice.reducer;
