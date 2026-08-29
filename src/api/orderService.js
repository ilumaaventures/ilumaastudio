import baseApi from "./baseApi";

export const placeOrder = async (orderData) => {
  const response = await baseApi.post("/orders", orderData);
  return response.data;
};

export const getMyOrders = async (params = {}) => {
  const response = await baseApi.get("/orders/my-orders", { params });
  return response.data;
};

export const getOrderDetails = async (id) => {
  const response = await baseApi.get(`/orders/${id}`);
  return response.data;
};

export const getVendorOrders = async (params = {}) => {
  const response = await baseApi.get("/orders/vendor", { params });
  return response.data;
};

export const getVendorOrderDetails = async (id) => {
  const response = await baseApi.get(`/orders/vendor/${id}`);
  return response.data;
};

export const updateVendorItemStatus = async (itemId, status) => {
  const response = await baseApi.patch(`/orders/item/${itemId}/status`, { status });
  return response.data;
};

export const getAdminOrders = async (params = {}) => {
  const response = await baseApi.get("/orders/admin", { params });
  return response.data;
};

export const getAdminOrderDetails = async (id) => {
  const response = await baseApi.get(`/orders/admin/${id}`);
  return response.data;
};

export const getSuperAdminOrders = async (params = {}) => {
  const response = await baseApi.get("/orders/all", { params });
  return response.data;
};

export const updateSuperAdminOrder = async (id, updateData) => {
  const response = await baseApi.patch(`/orders/${id}`, updateData);
  return response.data;
};

export const requestItemReturn = async (itemId, reason, requestType = "Return", notes = "") => {
  const response = await baseApi.post(`/orders/item/${itemId}/return`, { reason, requestType, notes });
  return response.data;
};

export const cancelOrder = async (orderId, reason = "") => {
  const response = await baseApi.patch(`/orders/${orderId}/cancel`, { reason });
  return response.data;
};

export const processItemReturn = async (itemId, action, notes) => {
  const response = await baseApi.patch(`/orders/item/${itemId}/return`, { action, notes });
  return response.data;
};
