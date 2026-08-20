import baseApi from "./baseApi";

export const login = async (userData) => {
  try {
    const response = await baseApi.post("/auth/login", userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const register = async (userData) => {
  try {
    const response = await baseApi.post("/auth/register", userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getProfile = async () => {
  try {
    const response = await baseApi.get("/auth/profile");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const registerBusiness = async (formData) => {
  try {
    const response = await baseApi.post("/auth/register-business", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await baseApi.post("/auth/forgot-password", { email });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const verifyOTP = async (email, otp) => {
  try {
    const response = await baseApi.post("/auth/verify-otp", { email, otp });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (email, newPassword) => {
  try {
    const response = await baseApi.post("/auth/reset-password", {
      email,
      newPassword,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await baseApi.post("/auth/logout");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const googleLogin = async (code, role = "user") => {
  try {
    const response = await baseApi.post("/auth/google", { code, role });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const sendOTP = async (name, email) => {
  try {
    const response = await baseApi.post("/auth/send-otp", { name, email });
    return response.data;
  } catch (error) {
    throw error;
  }
};
