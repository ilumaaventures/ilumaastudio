import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchBusinessCategories as apiFetchBusinessCategories } from "../../api/categoryService";

// Async thunk to load business categories globally from backend
export const fetchGlobalBusinessCategories = createAsyncThunk(
  "businessCategory/fetchGlobalBusinessCategories",
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiFetchBusinessCategories({ status: "active" });
      const list =
        res?.data || res?.businessCategories || (Array.isArray(res) ? res : []);
      return list;
    } catch (err) {
      console.error("Failed to load global business categories:", err);
      return rejectWithValue(err.message || "Failed to load business categories");
    }
  }
);

export const BUSINESS_CATEGORY_CODES = {
  ECOMMERCE: "ECOMMERCE",
  SERVICE: "SERVICE",
  BUSINESS: "BUSINESS",
};

export const isEcommerceCategory = (val) => {
  if (!val) return true;
  const str = String(val).toUpperCase();
  return (
    str === "ECOMMERCE" ||
    str === "E-COMMERCE" ||
    str === "PRODUCT MARKETPLACE" ||
    str.includes("ECOMM") ||
    str.includes("SHOP")
  );
};

export const isServiceCategory = (val) => {
  if (!val) return false;
  const str = String(val).toUpperCase();
  return (
    str === "SERVICE" ||
    str === "SERVICES" ||
    str === "SERVICE PROVIDER" ||
    str.includes("SERV")
  );
};

export const isBusinessCategory = (val) => {
  if (!val) return false;
  const str = String(val).toUpperCase();
  return (
    str === "BUSINESS" ||
    str === "BUSINESSES" ||
    str === "BUSINESS BRANDS" ||
    str === "BRANDS" ||
    str === "OTHER" ||
    str.includes("BUSI") ||
    str.includes("BRAND")
  );
};

const initialState = {
  // Defaults to ECOMMERCE
  selectedBusinessCategory: "ECOMMERCE",
  businessCategories: [],
  loading: false,
  error: null,
};

const businessCategorySlice = createSlice({
  name: "businessCategory",
  initialState,
  reducers: {
    setSelectedBusinessCategory: (state, action) => {
      const val = action.payload || "ECOMMERCE";
      if (isServiceCategory(val)) {
        state.selectedBusinessCategory = "SERVICE";
      } else if (isBusinessCategory(val)) {
        state.selectedBusinessCategory = "BUSINESS";
      } else {
        state.selectedBusinessCategory = "ECOMMERCE";
      }
    },
    setBusinessCategories: (state, action) => {
      state.businessCategories = action.payload || [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGlobalBusinessCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGlobalBusinessCategories.fulfilled, (state, action) => {
        state.loading = false;
        if (Array.isArray(action.payload) && action.payload.length > 0) {
          state.businessCategories = action.payload;
        }
      })
      .addCase(fetchGlobalBusinessCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedBusinessCategory, setBusinessCategories } =
  businessCategorySlice.actions;

export default businessCategorySlice.reducer;

