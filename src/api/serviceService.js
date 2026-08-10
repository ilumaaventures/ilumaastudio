import baseApi from "./baseApi";

export const getServices = async (params = {}) => {
  try {
    const response = await baseApi.get("/services", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching services:", error);
    throw error;
  }
};

export const getServiceById = async (id) => {
  try {
    const response = await baseApi.get(`/services/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching service by ID ${id}:`, error);
    throw error;
  }
};

export const getServiceCategories = async () => {
  try {
    const response = await baseApi.get("/categories?businessType=Service");
    return response.data;
  } catch (error) {
    console.error("Error fetching service categories:", error);
    throw error;
  }
};
