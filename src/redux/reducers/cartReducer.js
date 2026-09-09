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
  if (!dbItems || !Array.isArray(dbItems)) return [];
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
        : 99;
    const prodId = prod._id || item.customProductId || item.product || item._id;
    const prodName = prod.name || item.name || "Product";
    const prodPrice = item.price !== undefined ? item.price : (prod.price || 0);
    const prodImg =
      prod.images?.[0]?.url ||
      (typeof prod.images?.[0] === "string" ? prod.images[0] : null) ||
      prod.image?.url ||
      prod.image ||
      item.image ||
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80";

    return {
      _id: prodId,
      id: prodId,
      cartItemId: item._id,
      name: prodName,
      price: Number(prodPrice) || 0,
      originalPrice: item.regularPrice || item.originalPrice || prod.originalPrice || prodPrice,
      selectedOptions: item.selectedOptions || null,
      sku: item.sku || prod.sku || "",
      variantId: item.variantId || null,
      category:
        (typeof prod.category === "object" ? prod.category?.name : prod.category) ||
        item.category ||
        "General",
      image: typeof prodImg === "object" ? prodImg.url : prodImg,
      stock: effectiveStock,
      quantity: item.quantity || 1,
    };
  });
};

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartService.getCart();
      const mapped = mapDbCartToRedux(response.items);
      try {
        localStorage.setItem("cartItems", JSON.stringify(mapped));
      } catch (_) {}
      return mapped;
    } catch (error) {
      return getInitialCart();
    }
  }
);

export const syncCart = createAsyncThunk(
  "cart/syncCart",
  async (items, { rejectWithValue }) => {
    try {
      const response = await cartService.syncCart(items);
      const mapped = mapDbCartToRedux(response.items);
      try {
        localStorage.setItem("cartItems", JSON.stringify(mapped));
      } catch (_) {}
      return mapped;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ product, quantity = 1 }, { getState, rejectWithValue }) => {
    const { cart } = getState();
    const prodId = product._id || product.id || String(Date.now());
    const effectivePrice = Number(product.price || 0);
    const img =
      product.image ||
      (Array.isArray(product.images) && product.images[0]?.url) ||
      (Array.isArray(product.images) && product.images[0]) ||
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80";
    const categoryVal =
      typeof product.category === "object"
        ? product.category?.name
        : product.category || "General";

    try {
      const response = await cartService.addToCart(prodId, quantity, {
        name: product.name || product.title || "Product",
        price: effectivePrice,
        originalPrice: product.originalPrice || effectivePrice,
        image: typeof img === "object" ? img.url : img,
        category: categoryVal,
        selectedOptions: product.selectedOptions || product.selectedVariant || null,
        variantSku: product.variantSku || product.sku || null,
        variantId: product.variantId || null,
        product: {
          _id: prodId,
          name: product.name || product.title,
          price: effectivePrice,
          image: typeof img === "object" ? img.url : img,
          category: categoryVal,
        },
      });
      const mapped = mapDbCartToRedux(response.items);
      try {
        localStorage.setItem("cartItems", JSON.stringify(mapped));
      } catch (_) {}
      return mapped;
    } catch (error) {
      console.warn("Backend addToCart error, using resilient fallback:", error);
      const currentItems = Array.isArray(cart.cartItems) ? [...cart.cartItems] : [];
      const itemKey = product.itemKey || `${prodId}-${product.selectedVariant || product.variantId || product.selectedSize || ""}`;
      const existingIdx = currentItems.findIndex(
        (i) => (i.itemKey && i.itemKey === itemKey) || i._id === prodId || i.id === prodId
      );

      const effectiveStock =
        product.stockQuantity !== undefined
          ? Number(product.stockQuantity)
          : product.stock !== undefined
          ? Number(product.stock)
          : product.inventory?.stockQuantity !== undefined
          ? Number(product.inventory.stockQuantity)
          : 99;

      if (existingIdx > -1) {
        currentItems[existingIdx] = {
          ...currentItems[existingIdx],
          quantity: (currentItems[existingIdx].quantity || 1) + Number(quantity || 1),
        };
      } else {
        currentItems.push({
          _id: prodId,
          id: prodId,
          itemKey,
          name: product.name || product.title || "Product",
          price: effectivePrice,
          image: typeof img === "object" ? img.url : img,
          category: categoryVal,
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
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (productId, { getState, rejectWithValue }) => {
    try {
      const response = await cartService.removeFromCart(productId);
      const mapped = mapDbCartToRedux(response.items);
      try {
        localStorage.setItem("cartItems", JSON.stringify(mapped));
      } catch (_) {}
      return mapped;
    } catch (error) {
      console.warn("Backend removeFromCart error, falling back to local:", error);
      const { cart } = getState();
      const currentItems = Array.isArray(cart.cartItems)
        ? cart.cartItems.filter(
            (i) => i._id !== productId && i.id !== productId && i.itemKey !== productId && i.cartItemId !== productId
          )
        : [];
      try {
        localStorage.setItem("cartItems", JSON.stringify(currentItems));
      } catch (_) {}
      return currentItems;
    }
  }
);

export const updateCartQuantity = createAsyncThunk(
  "cart/updateCartQuantity",
  async ({ productId, quantity }, { getState, rejectWithValue }) => {
    try {
      const response = await cartService.updateCartQuantity(productId, quantity);
      const mapped = mapDbCartToRedux(response.items);
      try {
        localStorage.setItem("cartItems", JSON.stringify(mapped));
      } catch (_) {}
      return mapped;
    } catch (error) {
      console.warn("Backend updateCartQuantity error, falling back to local:", error);
      const { cart } = getState();
      const currentItems = Array.isArray(cart.cartItems)
        ? cart.cartItems.map((i) =>
            i._id === productId || i.id === productId || i.itemKey === productId || i.cartItemId === productId
              ? { ...i, quantity: Math.max(1, quantity) }
              : i
          )
        : [];
      try {
        localStorage.setItem("cartItems", JSON.stringify(currentItems));
      } catch (_) {}
      return currentItems;
    }
  }
);

export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    localStorage.removeItem("cartItems");
    try {
      const response = await cartService.clearCart();
      return mapDbCartToRedux(response.items);
    } catch (error) {
      return [];
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
