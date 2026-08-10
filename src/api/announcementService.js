import baseApi from "./baseApi";

export const getActiveAnnouncements = async () => {
  const response = await baseApi.get("/announcements?status=Active");
  return response.data;
};
