import baseApi from "./baseApi";

export const createBooking = async (bookingData) => {
  try {
    const response = await baseApi.post("/bookings", bookingData);
    return response.data;
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
};

export const getBookings = async (params = {}) => {
  try {
    const response = await baseApi.get("/bookings", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw error;
  }
};

export const getBookingById = async (id) => {
  try {
    const response = await baseApi.get(`/bookings/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching booking by ID ${id}:`, error);
    throw error;
  }
};

export const rescheduleBookingApi = async (id, date, timeSlot) => {
  try {
    const response = await baseApi.put(`/bookings/${id}/reschedule`, { date, timeSlot });
    return response.data;
  } catch (error) {
    console.error(`Error rescheduling booking ${id}:`, error);
    throw error;
  }
};
