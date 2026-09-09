import axios from "axios";
import { BASE_URL, API_URL } from "../config/env";

export { BASE_URL, API_URL };

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
    if (token && token !== "null" && token !== "undefined") {
      config.headers.Authorization = `Bearer ${token}`;
    }

    let guestId = localStorage.getItem("guestId");
    if (!guestId) {
      guestId =
        "guest_" +
        Math.random().toString(36).substring(2, 12) +
        Date.now().toString(36);
      try {
        localStorage.setItem("guestId", guestId);
      } catch (_) {}
    }
    config.headers["x-guest-id"] = guestId;

    return config;
  },
  (error) => Promise.reject(error),
);

export default baseApi;
