import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

export const MAX_COMPARE_PRODUCTS = 4;
export const MIN_COMPARE_PRODUCTS = 2;
const STORAGE_KEY = "ilumaa_compare_items";

// Helper to normalize product into a lightweight comparison item
export const normalizeCompareProduct = (product) => {
  if (!product) return null;
  const prodId = String(product._id || product.id || product.productId || "");
  if (!prodId) return null;

  const imageUrl =
    product.images?.[0]?.url ||
    product.images?.[0] ||
    product.image?.url ||
    product.image ||
    product.featuredImage?.url ||
    product.featuredImage ||
    product.thumbnail?.url ||
    product.thumbnail ||
    (Array.isArray(product.photos) && product.photos[0]) ||
    "";

  const categoryName =
    typeof product.category === "object"
      ? product.category?.name || product.category?.title || "General"
      : product.category || product.categoryName || "General";

  const brandName =
    product.brand ||
    product.business?.businessName ||
    product.business?.name ||
    product.vendor?.storeName ||
    "ILumaa";

  const rawPrice = Number(product.price) || 0;
  const rawOriginalPrice =
    Number(product.originalPrice) ||
    Number(product.compareAtPrice) ||
    Number(product.mrp) ||
    0;

  const inStock = (() => {
    if (product.inStock !== undefined) return Boolean(product.inStock);
    if (product.isOutOfStock !== undefined) return !product.isOutOfStock;
    if (product.stock !== undefined) return Number(product.stock) > 0;
    if (product.stockQuantity !== undefined) return Number(product.stockQuantity) > 0;
    if (product.inventory?.stockQuantity !== undefined)
      return Number(product.inventory.stockQuantity) > 0;
    return true;
  })();

  return {
    _id: prodId,
    id: prodId,
    name: product.name || product.title || "Product",
    subtitle: product.subtitle || "",
    price: rawPrice,
    originalPrice: rawOriginalPrice > rawPrice ? rawOriginalPrice : null,
    image: imageUrl,
    category: categoryName,
    brand: brandName,
    rating: Number(product.rating || product.ratings || 4.5).toFixed(1),
    reviewsCount: Array.isArray(product.reviews)
      ? product.reviews.length
      : typeof product.reviews === "number"
        ? product.reviews
        : product.numReviews || product.reviewsCount || 0,
    inStock,
    badge:
      product.badge ||
      (product.isFeatured ? "Featured" : null) ||
      (product.isBestSeller ? "Best Seller" : null) ||
      (product.isNewArrival ? "New" : null) ||
      null,
  };
};

const loadCompareFromStorage = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(Boolean);
  } catch (e) {
    console.error("Failed to read comparison items from storage:", e);
    return [];
  }
};

const saveCompareToStorage = (items) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error("Failed to persist comparison items to storage:", e);
  }
};

const initialState = {
  items: loadCompareFromStorage(),
  maxProducts: MAX_COMPARE_PRODUCTS,
};

export const compareSlice = createSlice({
  name: "compare",
  initialState,
  reducers: {
    addToCompare: (state, action) => {
      const item = normalizeCompareProduct(action.payload);
      if (!item) {
        toast.error("Invalid product data for comparison.");
        return;
      }

      const exists = state.items.some((i) => String(i.id) === String(item.id));
      if (exists) {
        toast("Product is already in comparison list.", { icon: "ℹ️" });
        return;
      }

      if (state.items.length >= state.maxProducts) {
        toast.error(`You can compare up to ${state.maxProducts} products at a time.`);
        return;
      }

      state.items.push(item);
      saveCompareToStorage(state.items);
      toast.success(`${item.name} added to comparison!`);
    },

    removeFromCompare: (state, action) => {
      const prodId = String(
        typeof action.payload === "object"
          ? action.payload?._id || action.payload?.id
          : action.payload
      );
      const prevLength = state.items.length;
      state.items = state.items.filter((i) => String(i.id) !== prodId);
      if (state.items.length < prevLength) {
        saveCompareToStorage(state.items);
        toast.success("Removed from comparison.");
      }
    },

    toggleCompare: (state, action) => {
      const item = normalizeCompareProduct(action.payload);
      if (!item) return;

      const index = state.items.findIndex((i) => String(i.id) === String(item.id));
      if (index >= 0) {
        state.items.splice(index, 1);
        saveCompareToStorage(state.items);
        toast.success(`Removed ${item.name} from comparison.`);
      } else {
        if (state.items.length >= state.maxProducts) {
          toast.error(`You can compare up to ${state.maxProducts} products at a time.`);
          return;
        }
        state.items.push(item);
        saveCompareToStorage(state.items);
        toast.success(`Added ${item.name} to comparison!`);
      }
    },

    clearCompare: (state) => {
      state.items = [];
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        // ignore
      }
      toast.success("Comparison list cleared.");
    },

    setCompareItems: (state, action) => {
      if (Array.isArray(action.payload)) {
        const normalized = action.payload
          .map(normalizeCompareProduct)
          .filter(Boolean)
          .slice(0, state.maxProducts);
        state.items = normalized;
        saveCompareToStorage(normalized);
      }
    },
  },
});

export const {
  addToCompare,
  removeFromCompare,
  toggleCompare,
  clearCompare,
  setCompareItems,
} = compareSlice.actions;

export const selectCompareItems = (state) => state.compare?.items || [];
export const selectCompareCount = (state) => state.compare?.items?.length || 0;
export const selectIsCompared = (state, productId) => {
  const idStr = String(productId);
  return (state.compare?.items || []).some((i) => String(i.id) === idStr);
};

export default compareSlice.reducer;
