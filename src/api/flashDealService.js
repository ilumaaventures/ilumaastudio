import baseApi from "./baseApi";

export const getActiveFlashDeals = async () => {
  const response = await baseApi.get("/flash-deals/active");
  return response.data;
};

export const getProductFlashDealStatus = async (productId) => {
  const response = await baseApi.get(`/flash-deals/product/${productId}`);
  return response.data;
};
