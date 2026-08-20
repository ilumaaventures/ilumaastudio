import baseApi from "./baseApi";

export const getPublicBanners = async (params = {}) => {
  const response = await baseApi.get("/public/banners", { params });
  return response.data;
};
