import baseApi from "./baseApi";

export const getShops = async (params = {}) => {
  try {
    const response = await baseApi.get("/public/store", { params });
    return response.data;
  } catch (err) {
    console.error("Error fetching public shops:", err);
    return [];
  }
};
