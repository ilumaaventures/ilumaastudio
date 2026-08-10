import baseApi from "./baseApi";

export const getShops = async () => {
  try {
    const response = await baseApi.get("/public/store");
    return response.data;
  } catch (err) {
    console.error("Error fetching public shops:", err);
    return [];
  }
};
