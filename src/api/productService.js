import baseApi from "./baseApi";

export const getProducts = async (params = {}) => {
  const response = await baseApi.get("/products/public", { params });
  return response.data;
};
export const getFeaturedProducts = async (params = {}) => {
  const response = await baseApi.get("/products/featured", { params });
  return response.data;
};
export const getProductById = async (id) => {
  const response = await baseApi.get(`/products/${id}`);
  return response.data;
};

export const checkCustomerDelivery = async (deliveryData) => {
  const response = await baseApi.post("/warehouses/check-delivery", deliveryData);
  return response.data;
};

export const getallProducts = async (params = {}) => {
  const response = await baseApi.get("/products/public", { params });
  return response.data;
};

export const createProductReview = async (id, reviewData) => {
  const response = await baseApi.post(`/products/${id}/reviews`, reviewData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const toggleReviewHelpful = async (id, reviewId) => {
  const response = await baseApi.put(
    `/products/${id}/reviews/${reviewId}/helpful`,
  );
  return response.data;
};

export const getLatestReviews = async () => {
  const response = await baseApi.get("/products/reviews/latest");
  return response.data;
};
