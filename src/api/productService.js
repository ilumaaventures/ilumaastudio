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

export const createProduct = async (productData) => {
  const response = await baseApi.post("/products", productData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await baseApi.delete(`/products/${id}`);
  return response.data;
};

export const submitProductForReview = async (id) => {
  const response = await baseApi.put(`/products/${id}/submit`);
  return response.data;
};

export const fetchPendingProducts = async (params = {}) => {
  const response = await baseApi.get("/products/pending", { params });
  return response.data;
};

export const approveProduct = async (id) => {
  const response = await baseApi.put(`/products/${id}/approve`);
  return response.data;
};

export const rejectProduct = async (id, reason) => {
  const response = await baseApi.put(`/products/${id}/reject`, {
    reason,
  });
  return response.data;
};

export const updateProduct = async (id, data) => {
  const response = await baseApi.put(`/products/${id}`, data);
  return response.data;
};

export const fetchAllProducts = async (params = {}) => {
  const response = await baseApi.get("/products", { params });
  return response.data;
};

export const fetchApprovedProducts = async (params = {}) => {
  const response = await baseApi.get("/products/approved", { params });
  return response.data;
};

export const getallProducts = async (params = {}) => {
  const response = await baseApi.get("/products/public", { params });
  return response.data;
};

export const bulkSubmitProducts = async (ids) => {
  const response = await baseApi.put("/products/bulk-submit", { ids });
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

export const updateProductStock = async (id, stockData) => {
  const response = await baseApi.put(`/products/${id}/stock`, stockData);
  return response.data;
};
