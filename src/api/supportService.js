import baseApi from "./baseApi";

/**
 * Submit a new support ticket / inquiry / issue report from the storefront
 */
export const createSupportTicket = async (ticketData) => {
  try {
    const response = await baseApi.post("/support/tickets", ticketData);
    return response.data;
  } catch (error) {
    console.error("Error creating support ticket:", error);
    throw error;
  }
};

/**
 * Get ticket details by ticket ID (for public ticket tracking if needed)
 */
export const getSupportTicketById = async (id) => {
  try {
    const response = await baseApi.get(`/support/tickets/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching support ticket:", error);
    throw error;
  }
};
