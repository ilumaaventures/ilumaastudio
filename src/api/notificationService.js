import baseApi from "./baseApi";

export const getActiveNotifications = async (audience = "CUSTOMER") => {
  const response = await baseApi.get(`/notifications/active?audience=${audience}`);
  return response.data;
};
