import baseApi from "./baseApi";

export const getProfile = async () => {
    const response = await baseApi.get("/auth/profile");
    return response.data;
};

export const updateProfile = async (profileData) => {
    const headers = profileData instanceof FormData 
        ? { "Content-Type": "multipart/form-data" } 
        : { "Content-Type": "application/json" };
    const response = await baseApi.put("/users/profile", profileData, { headers });
    return response.data;
};

export const getActivityLogs = async () => {
    const response = await baseApi.get("/users/activity");
    return response.data;
};

export const getAddresses = async () => {
    const response = await baseApi.get("/users/addresses");
    return response.data;
};

export const addAddress = async (addressData) => {
    const response = await baseApi.post("/users/addresses", addressData);
    return response.data;
};

export const updateAddress = async (addressId, addressData) => {
    const response = await baseApi.put(`/users/addresses/${addressId}`, addressData);
    return response.data;
};

export const deleteAddress = async (addressId) => {
    const response = await baseApi.delete(`/users/addresses/${addressId}`);
    return response.data;
};

export const setDefaultAddress = async (addressId) => {
    const response = await baseApi.put(`/users/addresses/${addressId}/default`);
    return response.data;
};
