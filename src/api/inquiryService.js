import baseApi from "./baseApi";

export const createInquiry = async (inquiryData) => {
  try {
    const response = await baseApi.post("/inquiries", inquiryData);
    return response.data;
  } catch (error) {
    console.error("Error creating inquiry:", error);
    throw error;
  }
};
