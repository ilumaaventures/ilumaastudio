import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as cartService from "../../api/cartService";

const getInitialCart = () => {
  try {
    const saved = localStorage.getItem("cartItems");
    return saved ? JSON.parse(saved) : [];
  } catch (_) {
    return [];
  }
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
  async ({ product, quantity = 1 }, { getState, rejectWithValue }) => {
    const { auth, cart } = getState();

    if (!auth.isAuthenticated) {
      const currentItems = Array.isArray(cart.cartItems) ? [...cart.cartItems] : [];
      const prodId = product._id || product.id || String(Date.now());
      const itemKey = product.itemKey || `${prodId}-${product.selectedVariant || product.variantId || product.selectedSize || ""}`;
      const existingIdx = currentItems.findIndex(
        (i) => (i.itemKey && i.itemKey === itemKey) || i._id === prodId
      );

      const effectivePrice = Number(product.price || 0);
      const effectiveStock =
        product.stockQuantity !== undefined
          ? Number(product.stockQuantity)
          : product.stock !== undefined
          ? Number(product.stock)
          : product.inventory?.stockQuantity !== undefined
          ? Number(product.inventory.stockQuantity)
          : 99;

      const img =
        product.image ||
        (Array.isArray(product.images) && product.images[0]?.url) ||
        (Array.isArray(product.images) && product.images[0]) ||
        "https://via.placeholder.com/400x300?text=No+Image";

      if (existingIdx > -1) {
        currentItems[existingIdx] = {
          ...currentItems[existingIdx],
          quantity: (currentItems[existingIdx].quantity || 1) + Number(quantity || 1),
        };
      } else {
        currentItems.push({
          _id: prodId,
          itemKey,
          name: product.name || product.title || "Product",
          price: effectivePrice,
          image: typeof img === "object" ? img.url : img,
          category: typeof product.category === "object" ? product.category?.name : product.category || "General",
          selectedOptions: product.selectedOptions || product.selectedVariant || null,
          selectedSize: product.selectedSize || product.selectedVariant || null,
          sku: product.sku || "",
          variantId: product.variantId || null,
          stock: effectiveStock,
          quantity: Number(quantity || 1),
        });
      }

      try {
        localStorage.setItem("cartItems", JSON.stringify(currentItems));
      } catch (_) {}

      return currentItems;
    }

    try {
      const response = await cartService.addToCart(product._id || product.id, quantity, {
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
    const { auth, cart } = getState();

    if (!auth.isAuthenticated) {
      const currentItems = Array.isArray(cart.cartItems)
        ? cart.cartItems.filter((i) => i._id !== productId && i.itemKey !== productId)
        : [];
      try {
        localStorage.setItem("cartItems", JSON.stringify(currentItems));
      } catch (_) {}
      return currentItems;
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
    const { auth, cart } = getState();

    if (!auth.isAuthenticated) {
      const currentItems = Array.isArray(cart.cartItems)
        ? cart.cartItems.map((i) =>
            i._id === productId || i.itemKey === productId
              ? { ...i, quantity: Math.max(1, quantity) }
              : i
          )
        : [];
      try {
        localStorage.setItem("cartItems", JSON.stringify(currentItems));
      } catch (_) {}
      return currentItems;
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

    localStorage.removeItem("cartItems");
    if (!auth.isAuthenticated) {
      return [];
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
