import axios from "axios";
<<<<<<< HEAD
import { BASE_URL, API_URL } from "../config/env";

export { BASE_URL, API_URL };
=======
import { getTenantSubdomain } from "../utils/tenant";

const rawBaseUrl =
  import.meta.env.VITE_API_URL || "https://ilumaasocial-backend.onrender.com";
export const BASE_URL = rawBaseUrl.replace(/\/+$/, "");
>>>>>>> 9d38903e872714ab84df19b3829bd2415adc6673

if (import.meta.env.PROD && !import.meta.env.VITE_API_URL) {
  console.error(
    "VITE_API_URL is not set for this production build — falling back to default backend URL.",
  );
}

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
  (error) => Promise.reject(error),
);

export default baseApi;
