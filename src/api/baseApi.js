import axios from "axios";

export const BASE_URL =
  import.meta.env.VITE_API_URL || "https://ilumaasocial-backend.onrender.com";

export const API_URL = `${BASE_URL}/api`;

const baseApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default baseApi;
