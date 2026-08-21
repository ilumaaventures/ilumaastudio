import baseApi from "./baseApi";

export const getCart = async () => {
  const response = await baseApi.get("/cart");
  return response.data;
};

export const addToCart = async (productId, quantity, variantData = {}) => {
  const response = await baseApi.post("/cart/add", { productId, quantity, ...variantData });
  return response.data;
};

export const updateCartQuantity = async (productId, quantity) => {
  const response = await baseApi.put("/cart/update", { productId, quantity });
  return response.data;
};

export const removeFromCart = async (productId) => {
  const response = await baseApi.delete(`/cart/remove/${productId}`);
  return response.data;
};

export const clearCart = async () => {
  const response = await baseApi.delete("/cart/clear");
  return response.data;
};

export const syncCart = async (items) => {
  const response = await baseApi.post("/cart/sync", { items });
  return response.data;
};
