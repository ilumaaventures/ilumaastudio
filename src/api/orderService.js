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

export const requestItemReturn = async (itemId, reason, requestType = "Return", notes = "") => {
  const response = await baseApi.post(`/orders/item/${itemId}/return`, { reason, requestType, notes });
  return response.data;
};

export const cancelOrder = async (orderId, reason = "") => {
  const response = await baseApi.patch(`/orders/${orderId}/cancel`, { reason });
  return response.data;
};

export const downloadOrderInvoicePdf = async (orderId) => {
  const response = await baseApi.get(`/orders/${orderId}/invoice`, {
    responseType: "blob",
  });
  return response.data;
};

export const downloadAndSaveInvoice = async (orderId, invoiceNumber = "") => {
  const blob = await downloadOrderInvoicePdf(orderId);
  const blobUrl = window.URL.createObjectURL(
    new Blob([blob], { type: "application/pdf" }),
  );
  const fileName = `Tax-Invoice-${invoiceNumber || orderId}.pdf`;
  const link = document.createElement("a");
  link.href = blobUrl;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(blobUrl);
};

export const getOrderShipments = async (orderId) => {
  const response = await baseApi.get(`/shipments/order/${orderId}`);
  return response.data;
};

export const trackShipmentLive = async (shipmentId) => {
  const response = await baseApi.get(`/shipments/${shipmentId}/track`);
  return response.data;
};

export const checkShadowfaxServiceability = async (data) => {
  const response = await baseApi.post("/shipments/serviceability", data);
  return response.data;
};

export const trackPublicShipment = async (identifier) => {
  const response = await baseApi.get(`/shipments/track/${identifier}`);
  return response.data;
};
