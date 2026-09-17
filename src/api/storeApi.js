import baseApi, { BASE_URL } from "./baseApi";

/**
 * Normalizes an identifier string (handles encoding).
 * If empty or null, returns empty string to support host-based (subdomain/custom-domain) mode.
 */
const encodeParam = (param) => {
  if (!param) return "";
  return encodeURIComponent(decodeURIComponent(param).trim());
};

/**
 * Builds endpoint path supporting both path-based (/public/store/:name/...)
 * and host-based (/public/store/...) requests.
 */
const buildPath = (businessName, subPath) => {
  const name = encodeParam(businessName);
  if (name) {
    return `/public/store/${name}${subPath ? `/${subPath}` : ""}`;
  }
  return `/public/store${subPath ? `/${subPath}` : ""}`;
};

// ==========================================
// STORE DATA & CATALOG APIS
// ==========================================

/**
 * 1. Fetch Store Details (Business profile, logo, address, contact, verification)
 * Supports: GET /public/store/:businessName OR GET /public/store/details
 */
export const fetchStoreDetails = async (businessName) => {
  const endpoint = businessName ? buildPath(businessName) : "/public/store/details";
  const response = await baseApi.get(endpoint);
  return response.data;
};

/**
 * 2. Fetch Storefront Configuration (Active template, theme colors, section layout, branding)
 * Supports: GET /public/store/:businessName/config OR GET /public/store/config
 */
export const fetchStoreConfig = async (businessName) => {
  const endpoint = buildPath(businessName, "config");
  const response = await baseApi.get(endpoint);
  return response.data;
};

/**
 * 3. Fetch Store Products (Scoped to store, with search, categories, and pagination)
 * Supports: GET /public/store/:businessName/products OR GET /public/store/products
 */
export const fetchStoreProducts = async (businessName, params = {}) => {
  const endpoint = buildPath(businessName, "products");
  const response = await baseApi.get(endpoint, { params });
  return response.data;
};

/**
 * 4. Fetch Featured Products (Top showcase products for the store)
 * Supports: GET /public/store/:businessName/featured-products OR GET /public/store/featured-products
 */
export const fetchStoreFeaturedProducts = async (businessName, params = {}) => {
  const endpoint = buildPath(businessName, "featured-products");
  const response = await baseApi.get(endpoint, { params });
  return response.data;
};

/**
 * 5. Fetch Store Categories (Product categories associated with this store)
 * Supports: GET /public/store/:businessName/categories OR GET /public/store/categories
 */
export const fetchStoreCategories = async (businessName) => {
  const endpoint = buildPath(businessName, "categories");
  const response = await baseApi.get(endpoint);
  return response.data;
};

/**
 * 6. Fetch Category by ID or Slug
 * Supports: GET /public/store/:businessName/categories/:categoryId OR GET /public/store/categories/:categoryId
 */
export const fetchStoreCategoryById = async (businessName, categoryId) => {
  const endpoint = buildPath(businessName, `categories/${encodeURIComponent(categoryId)}`);
  const response = await baseApi.get(endpoint);
  return response.data;
};

/**
 * 7. Fetch Store Banners (Hero slides, promotions, announcements)
 * Supports: GET /public/store/:businessName/banners OR GET /public/store/banners
 */
export const fetchStoreBanners = async (businessName, params = {}) => {
  const endpoint = buildPath(businessName, "banners");
  const response = await baseApi.get(endpoint, { params });
  return response.data?.banners || response.data || [];
};

/**
 * 8. Fetch Store Services (Bookable artisan / business services)
 * Supports: GET /public/store/:businessName/services OR GET /public/store/services
 */
export const fetchStoreServices = async (businessName) => {
  const endpoint = buildPath(businessName, "services");
  const response = await baseApi.get(endpoint);
  return response.data;
};

/**
 * 9. Fetch Store Vendors (Vendors attached to this business)
 * Supports: GET /public/store/:businessName/vendors OR GET /public/store/vendors
 */
export const fetchStoreVendors = async (businessName) => {
  const endpoint = buildPath(businessName, "vendors");
  const response = await baseApi.get(endpoint);
  return response.data;
};

/**
 * 10. Fetch Store Reviews (Approved customer ratings and feedback)
 * Supports: GET /public/store/:businessName/reviews OR GET /public/store/reviews
 */
export const fetchStoreReviews = async (businessName, params = {}) => {
  const endpoint = buildPath(businessName, "reviews");
  const response = await baseApi.get(endpoint, { params });
  return response.data?.reviews || response.data || [];
};

/**
 * 11. Fetch Store Policies (Shipping, Return, Refund, Cancellation)
 * Supports: GET /public/store/:businessName/policies OR GET /public/store/policies
 */
export const fetchStorePolicies = async (businessName) => {
  const endpoint = buildPath(businessName, "policies");
  const response = await baseApi.get(endpoint);
  return response.data?.policies || response.data || [];
};

/**
 * 12. Fetch Store Coupons (Discounts, promo codes, deals)
 * Supports: GET /public/store/:businessName/coupons OR GET /public/store/coupons
 */
export const fetchStoreCoupons = async (businessName) => {
  const endpoint = buildPath(businessName, "coupons");
  const response = await baseApi.get(endpoint);
  return response.data?.coupons || response.data || [];
};

/**
 * 13. Fetch Single Product By ID
 * Supports: GET /public/store/:businessName/product/:productId OR GET /public/store/product/:productId
 */
export const fetchStoreProductById = async (businessName, productId) => {
  const endpoint = buildPath(businessName, `product/${encodeURIComponent(productId)}`);
  const response = await baseApi.get(endpoint);
  return response.data;
};

/**
 * 14. Fetch Single Service By ID
 * Supports: GET /public/store/:businessName/service/:serviceId OR GET /public/store/service/:serviceId
 */
export const fetchStoreServiceById = async (businessName, serviceId) => {
  const endpoint = buildPath(businessName, `service/${encodeURIComponent(serviceId)}`);
  const response = await baseApi.get(endpoint);
  return response.data;
};

/**
 * 15. Check Subdomain Availability
 * GET /public/check-subdomain/:name
 */
export const checkSubdomainAvailability = async (subdomainName, excludeBusinessId = null) => {
  const params = excludeBusinessId ? { excludeBusinessId } : {};
  const response = await baseApi.get(`/public/check-subdomain/${encodeURIComponent(subdomainName)}`, { params });
  return response.data;
};

/**
 * 16. Fetch All Public Marketplace Stores
 * GET /public/store
 */
export const fetchAllMarketplaceStores = async (params = {}) => {
  const response = await baseApi.get("/public/store", { params });
  return response.data;
};

// ==========================================
// STORE ACTION & INTERACTION HELPER APIS
// ==========================================

/**
 * 17. Validate and Apply Store Coupon Code
 * POST /coupons/validate
 * @param {Object} data { code: string, items: Array, cartItems: Array }
 */
export const validateStoreCoupon = async ({ code, items = [], cartItems = [] }) => {
  const payload = {
    code: (code || "").trim().toUpperCase(),
    items: items.length ? items : cartItems,
  };
  const response = await baseApi.post("/coupons/validate", payload);
  return response.data;
};

/**
 * 18. Submit Store Customer Inquiry / Contact Form
 * POST /inquiries
 * @param {Object} inquiryData { serviceId, name, email, phone, subject, message, businessId }
 */
export const submitStoreInquiry = async (inquiryData) => {
  const response = await baseApi.post("/inquiries", inquiryData);
  return response.data;
};

/**
 * 19. Submit Product Review (Rating, Feedback, Images)
 * POST /reviews
 * @param {FormData|Object} reviewData
 */
export const submitProductReview = async (reviewData) => {
  const isFormData = typeof FormData !== "undefined" && reviewData instanceof FormData;
  const config = isFormData ? { headers: { "Content-Type": "multipart/form-data" } } : {};
  const response = await baseApi.post("/reviews", reviewData, config);
  return response.data;
};

/**
 * 20. Fetch Product Reviews specifically for an item
 * GET /reviews/product/:productId
 */
export const fetchProductReviews = async (productId, params = {}) => {
  const response = await baseApi.get(`/reviews/product/${encodeURIComponent(productId)}`, { params });
  return response.data;
};

/**
 * 21. Fetch Service Reviews specifically for a service item
 * GET /reviews/service/:serviceId
 */
export const fetchServiceReviews = async (serviceId, params = {}) => {
  const response = await baseApi.get(`/reviews/service/${encodeURIComponent(serviceId)}`, { params });
  return response.data;
};

/**
 * 22. Toggle Helpful Vote on a Customer Review
 * PUT /reviews/:reviewId/helpful
 */
export const toggleReviewHelpful = async (reviewId) => {
  const response = await baseApi.put(`/reviews/${encodeURIComponent(reviewId)}/helpful`);
  return response.data;
};

/**
 * 23. Fetch Active Flash Deals for the Storefront
 * GET /flash-deals/active OR GET /flash-deals/product/:productId
 */
export const fetchStoreFlashDeals = async (productId = null) => {
  const endpoint = productId
    ? `/flash-deals/product/${encodeURIComponent(productId)}`
    : "/flash-deals/active";
  const response = await baseApi.get(endpoint);
  return response.data;
};

// ==========================================
// STORE UTILITY HELPERS
// ==========================================

/**
 * Resolves media/image URL safely across local and cloud environments
 */
export const resolveImageUrl = (imagePath, fallback = "") => {
  if (!imagePath) return fallback;
  if (
    imagePath.startsWith("http://") ||
    imagePath.startsWith("https://") ||
    imagePath.startsWith("data:") ||
    imagePath.startsWith("blob:")
  ) {
    return imagePath;
  }
  const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
  return `${BASE_URL}${cleanPath}`;
};

/**
 * Formats price in standard currency format (defaults to Indian Rupee INR)
 */
export const formatPrice = (amount, currency = "INR") => {
  const numeric = Number(amount) || 0;
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(numeric);
  } catch (_) {
    return `₹${numeric.toFixed(2)}`;
  }
};

/**
 * Calculates discount percentage between original price and sale price
 */
export const calculateDiscount = (originalPrice, salePrice) => {
  const orig = Number(originalPrice);
  const sale = Number(salePrice);
  if (!orig || !sale || sale >= orig) return 0;
  return Math.round(((orig - sale) / orig) * 100);
};

/**
 * Filters a list of products in-memory for instant responsive UI filtering
 */
export const filterCatalogProducts = (products = [], { category, search, minPrice, maxPrice, inStockOnly, sortBy } = {}) => {
  if (!Array.isArray(products)) return [];

  return products
    .filter((prod) => {
      // Category match
      if (category && category !== "All") {
        const prodCat =
          typeof prod.category === "object" && prod.category !== null
            ? prod.category.name || prod.category.title
            : prod.category || prod.categoryName;
        if (prodCat !== category) return false;
      }

      // Search match
      if (search && search.trim()) {
        const q = search.trim().toLowerCase();
        const title = (prod.name || prod.title || "").toLowerCase();
        const desc = (prod.description || "").toLowerCase();
        if (!title.includes(q) && !desc.includes(q)) return false;
      }

      // Price filters
      const price = Number(prod.price || prod.salePrice || 0);
      if (minPrice !== undefined && price < Number(minPrice)) return false;
      if (maxPrice !== undefined && price > Number(maxPrice)) return false;

      // Stock filter
      if (inStockOnly && prod.stockQuantity !== undefined && prod.stockQuantity <= 0) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === "price-low") return (a.price || 0) - (b.price || 0);
      if (sortBy === "price-high") return (b.price || 0) - (a.price || 0);
      if (sortBy === "rating") return (b.averageRating || 0) - (a.averageRating || 0);
      if (sortBy === "newest") return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      return 0;
    });
};

export default {
  fetchStoreDetails,
  fetchStoreConfig,
  fetchStoreProducts,
  fetchStoreFeaturedProducts,
  fetchStoreCategories,
  fetchStoreCategoryById,
  fetchStoreBanners,
  fetchStoreServices,
  fetchStoreVendors,
  fetchStoreReviews,
  fetchStorePolicies,
  fetchStoreCoupons,
  fetchStoreProductById,
  fetchStoreServiceById,
  checkSubdomainAvailability,
  fetchAllMarketplaceStores,
  validateStoreCoupon,
  submitStoreInquiry,
  submitProductReview,
  fetchProductReviews,
  fetchServiceReviews,
  toggleReviewHelpful,
  fetchStoreFlashDeals,
  resolveImageUrl,
  formatPrice,
  calculateDiscount,
  filterCatalogProducts,
};
