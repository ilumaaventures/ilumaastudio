/**
 * Centralized environment and subdomain configuration for ILumaa Studio (Storefront App)
 */
const isProd = import.meta.env.PROD;

export const ROOT_DOMAIN =
  import.meta.env.VITE_ROOT_DOMAIN || (isProd ? "ilumaa.com" : "localhost");

// Base URL for backend API
// Fallback: https://api.ilumaa.com (or https://ilumaasocial-backend.onrender.com during DNS transition)
export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (isProd ? `https://api.${ROOT_DOMAIN}` : "http://localhost:5000");

export const BASE_URL = API_BASE_URL.replace(/\/+$/, "");
export const API_URL = `${BASE_URL}/api`;

export const APPS = {
  studio: isProd
    ? `https://studio.${ROOT_DOMAIN}`
    : `http://studio.localhost:5173`,
  superadmin: isProd
    ? `https://superadmin.${ROOT_DOMAIN}`
    : `http://superadmin.localhost:5173`,
  dashboard: isProd
    ? `https://dashboard.${ROOT_DOMAIN}`
    : `http://dashboard.localhost:5173`,
  social: isProd
    ? `https://social.${ROOT_DOMAIN}`
    : `http://social.localhost:5173`,
  kraftyBling: isProd
    ? `https://kraftybling.${ROOT_DOMAIN}`
    : `http://krafty-bling.localhost:5173`,
  api: isProd
    ? `https://api.${ROOT_DOMAIN}`
    : `http://localhost:5000`,
};

export const RESERVED_SUBDOMAINS = [
  "www",
  "api",
  "app",
  "admin",
  "mail",
  "ftp",
  "cdn",
  "static",
  "assets",
  "blog",
  "help",
  "support",
  "docs",
  "status",
  "ns1",
  "ns2",
  "ilumaastudio",
  "ilumaasuperadmin",
  "ilumaadashboard",
  "social",
  "kraftybling",
  "studio",
  "dashboard",
  "superadmin",
];

export const getStorefrontUrl = (slug, slugType = "path", customDomain = null) => {
  if (!slug) return APPS.studio;
  if (slugType === "custom" && customDomain) {
    return customDomain.startsWith("http") ? customDomain : `https://${customDomain}`;
  }
  if (slugType === "subdomain") {
    return isProd
      ? `https://${slug}.${ROOT_DOMAIN}`
      : `http://${slug}.localhost:5173`;
  }
  // Default 'path' type
  return isProd
    ? `https://studio.${ROOT_DOMAIN}/${slug}`
    : `http://studio.localhost:5173/${slug}`;
};

export default {
  ROOT_DOMAIN,
  API_BASE_URL,
  BASE_URL,
  API_URL,
  APPS,
  RESERVED_SUBDOMAINS,
  getStorefrontUrl,
};
