import baseApi from "./baseApi";

export const getProductReviews = async (productId) => {
  const response = await baseApi.get(`/reviews/product/${productId}`);
  return response.data;
};

export const createReview = async (reviewData) => {
  // Check if reviewData is FormData to set correct headers
  const isFormData = reviewData instanceof FormData;
  const response = await baseApi.post("/reviews", reviewData, {
    headers: {
      "Content-Type": isFormData ? "multipart/form-data" : "application/json",
    },
  });
  return response.data;
};

export const toggleReviewHelpful = async (reviewId) => {
  const response = await baseApi.put(`/reviews/${reviewId}/helpful`);
  return response.data;
};
