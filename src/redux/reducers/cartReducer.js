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
      isHamperItem: Boolean(item.isHamperItem),
      isPackaging: Boolean(item.isPackaging),
      hamperId: item.hamperId || null,
      hamperName: item.hamperName || null,
      hamperBasket: item.hamperBasket || null,
      hamperRecipient: item.hamperRecipient || null,
      hamperSender: item.hamperSender || null,
      hamperNote: item.hamperNote || null,
      source: item.source || prod.source || "studio",
      storeName: item.storeName || prod.storeName || null,
      storeSlug: item.storeSlug || prod.storeSlug || null,
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

    const isStorePath =
      typeof window !== "undefined" &&
      (window.location.pathname.startsWith("/store") ||
        (window.location.pathname !== "/" &&
          !["/shop", "/cart", "/wishlist", "/login", "/register", "/about", "/contact", "/categories", "/profile", "/help", "/services", "/compare", "/flash-deals", "/offers"].some((p) =>
            window.location.pathname.startsWith(p),
          )));

    const effectiveSource =
      product.source ||
      (product.storeName || product.storeSlug || isStorePath ? "store" : "studio");
    const effectiveStoreName =
      product.storeName ||
      (effectiveSource === "store"
        ? product.businessName ||
          product.business?.businessName ||
          product.business?.name ||
          product.vendor?.storeName ||
          "Store"
        : null);
    const effectiveStoreSlug =
      product.storeSlug ||
      (effectiveSource === "store"
        ? product.slug || product.business?.slug || null
        : null);

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
        source: effectiveSource,
        storeName: effectiveStoreName,
        storeSlug: effectiveStoreSlug,
        isHamperItem: Boolean(product.isHamperItem),
        isPackaging: Boolean(product.isPackaging),
        hamperId: product.hamperId || null,
        hamperName: product.hamperName || null,
        hamperBasket: product.hamperBasket || null,
        hamperRecipient: product.hamperRecipient || null,
        hamperSender: product.hamperSender || null,
        hamperNote: product.hamperNote || null,
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
      const itemKey =
        product.itemKey ||
        (product.hamperId
          ? `${prodId}-${product.hamperId}`
          : `${prodId}-${product.selectedVariant || product.variantId || product.selectedSize || ""}`);
      const existingIdx = currentItems.findIndex((i) => {
        if (product.hamperId || i.hamperId) {
          return i.hamperId === product.hamperId && (i._id === prodId || i.id === prodId);
        }
        return (i.itemKey && i.itemKey === itemKey) || i._id === prodId || i.id === prodId;
      });

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
          source: currentItems[existingIdx].source || effectiveSource,
          storeName: currentItems[existingIdx].storeName || effectiveStoreName,
          storeSlug: currentItems[existingIdx].storeSlug || effectiveStoreSlug,
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
          source: effectiveSource,
          storeName: effectiveStoreName,
          storeSlug: effectiveStoreSlug,
          isHamperItem: Boolean(product.isHamperItem),
          isPackaging: Boolean(product.isPackaging),
          hamperId: product.hamperId || null,
          hamperName: product.hamperName || null,
          hamperBasket: product.hamperBasket || null,
          hamperRecipient: product.hamperRecipient || null,
          hamperSender: product.hamperSender || null,
          hamperNote: product.hamperNote || null,
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
    const rawId =
      typeof productId === "object" && productId !== null
        ? productId.productId || productId._id || productId.id || productId.sku || productId.cartItemId
        : productId;
    const strId = String(rawId ?? "").trim();

    try {
      if (!strId) throw new Error("Missing product ID");
      const response = await cartService.removeFromCart(strId);
      const mapped = mapDbCartToRedux(response.items);
      try {
        localStorage.setItem("cartItems", JSON.stringify(mapped));
      } catch (_) {}
      return mapped;
    } catch (error) {
      console.warn("Backend removeFromCart error, falling back to local:", error);
      const { cart } = getState();
      const currentItems = Array.isArray(cart.cartItems)
        ? cart.cartItems.filter((i) => {
            const iId = String(i._id ?? "").trim();
            const id = String(i.id ?? "").trim();
            const iKey = String(i.itemKey ?? "").trim();
            const iCartId = String(i.cartItemId ?? "").trim();
            const iSku = String(i.sku ?? "").trim();
            const isTarget =
              (strId && (iId === strId || id === strId || iKey === strId || iCartId === strId || iSku === strId)) ||
              (rawId !== undefined && rawId !== null && (i._id === rawId || i.id === rawId || i.sku === rawId));
            return !isTarget;
          })
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
  async (payload, { getState, rejectWithValue }) => {
    const prodArg =
      typeof payload === "object" && payload !== null
        ? payload.productId ?? payload._id ?? payload.id ?? payload.sku
        : payload;
    const rawId =
      typeof prodArg === "object" && prodArg !== null
        ? prodArg.productId || prodArg._id || prodArg.id || prodArg.sku || prodArg.cartItemId
        : prodArg;
    const strId = String(rawId ?? "").trim();
    const quantity = Number(typeof payload === "object" && payload !== null ? payload.quantity : 1);

    if (quantity <= 0) {
      try {
        if (strId) await cartService.removeFromCart(strId);
      } catch (_) {}
      const { cart } = getState();
      const currentItems = Array.isArray(cart.cartItems)
        ? cart.cartItems.filter((i) => {
            const iId = String(i._id ?? "").trim();
            const id = String(i.id ?? "").trim();
            const iKey = String(i.itemKey ?? "").trim();
            const iCartId = String(i.cartItemId ?? "").trim();
            const iSku = String(i.sku ?? "").trim();
            const isTarget =
              (strId && (iId === strId || id === strId || iKey === strId || iCartId === strId || iSku === strId)) ||
              (rawId !== undefined && rawId !== null && (i._id === rawId || i.id === rawId || i.sku === rawId));
            return !isTarget;
          })
        : [];
      try {
        localStorage.setItem("cartItems", JSON.stringify(currentItems));
      } catch (_) {}
      return currentItems;
    }

    try {
      if (!strId) throw new Error("Missing product ID");
      const response = await cartService.updateCartQuantity(strId, quantity);
      const mapped = mapDbCartToRedux(response.items);
      try {
        localStorage.setItem("cartItems", JSON.stringify(mapped));
      } catch (_) {}
      return mapped;
    } catch (error) {
      console.warn("Backend updateCartQuantity error, falling back to local:", error);
      const { cart } = getState();
      const currentItems = Array.isArray(cart.cartItems)
        ? cart.cartItems.map((i) => {
            const iId = String(i._id ?? "").trim();
            const id = String(i.id ?? "").trim();
            const iKey = String(i.itemKey ?? "").trim();
            const iCartId = String(i.cartItemId ?? "").trim();
            const iSku = String(i.sku ?? "").trim();
            const isMatch =
              (strId && (iId === strId || id === strId || iKey === strId || iCartId === strId || iSku === strId)) ||
              (rawId !== undefined && rawId !== null && (i._id === rawId || i.id === rawId || i.sku === rawId));
            return isMatch ? { ...i, quantity: Math.max(1, quantity) } : i;
          })
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
