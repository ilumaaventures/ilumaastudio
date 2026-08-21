import axios from "axios";
import { getTenantSubdomain } from "../utils/tenant";

const rawBaseUrl =
  import.meta.env.VITE_API_URL || "https://ilumaasocial-backend.onrender.com";
export const BASE_URL = rawBaseUrl.replace(/\/+$/, "");

export const API_URL = `${BASE_URL}/api`;

const baseApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

baseApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    const tenant = getTenantSubdomain();
    if (tenant) {
      config.headers["X-Tenant-Subdomain"] = tenant;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default baseApi;
