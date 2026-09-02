import baseApi from "./baseApi";

export const getPublicCoupons = async (params = {}) => {
  try {
    let res;
    try {
      res = await baseApi.get("/marketing/public/coupons", { params });
    } catch (_) {
      res = await baseApi.get("/public/marketing/coupons", { params });
    }
    return res.data;
  } catch (err) {
    console.error("Failed to fetch public coupons from backend:", err);
    return [];
  }
};

export const getPublicOffers = async (params = {}) => {
  try {
    let res;
    try {
      res = await baseApi.get("/marketing/public/offers", { params });
    } catch (_) {
      res = await baseApi.get("/public/marketing/offers", { params });
    }
    return res.data;
  } catch (err) {
    console.error("Failed to fetch public offers from backend:", err);
    // Check localStorage fallback for central offers
    try {
      const stored = localStorage.getItem("super_ilumaa_offers");
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.filter((o) => o.status === "Approved" || !o.status);
      }
    } catch (_) {}
    return [];
  }
};
