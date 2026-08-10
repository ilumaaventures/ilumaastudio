import baseApi from "./baseApi";

export const getWishlist = async () => {
  const response = await baseApi.get("/wishlist");
  return response.data;
};

export const addToWishlist = async (productId) => {
  const response = await baseApi.post("/wishlist/add", { productId });
  return response.data;
};

export const removeFromWishlist = async (productId) => {
  const response = await baseApi.delete(`/wishlist/remove/${productId}`);
  return response.data;
};

export const syncWishlist = async (productIds) => {
  const response = await baseApi.post("/wishlist/sync", { productIds });
  return response.data;
};
