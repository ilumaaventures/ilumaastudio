import baseApi from "./baseApi";
export const createCategory = async (data) => {
  const response = await baseApi.post("/categories", data);
  return response.data;
};

export const fetchCategories = async (params = {}) => {
  const response = await baseApi.get("/categories", { params });
  return response.data;
};


export const updateCategory = async (id, data) => {
  const response = await baseApi.put(`/categories/${id}`, data);
  return response.data;
};
