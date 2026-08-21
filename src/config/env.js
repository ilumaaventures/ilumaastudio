/**
 * Centralized environment and subdomain configuration for ILumaa Studio
 */
const isProd = import.meta.env.PROD;

export const ROOT_DOMAIN =
  import.meta.env.VITE_ROOT_DOMAIN || (isProd ? "ilumaa.com" : "localhost");

export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (isProd ? `https://api.${ROOT_DOMAIN}` : "http://localhost:5000");

export const APPS = {
  studio: isProd
    ? `https://ilumaastudio.${ROOT_DOMAIN}`
    : `http://ilumaastudio.localhost:5173`,
  superadmin: isProd
    ? `https://ilumaasuperadmin.${ROOT_DOMAIN}`
    : `http://ilumaasuperadmin.localhost:5173`,
  dashboard: isProd
    ? `https://ilumaadashboard.${ROOT_DOMAIN}`
    : `http://ilumaadashboard.localhost:5173`,
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
  "studio",
  "dashboard",
  "superadmin",
];

export const getStorefrontUrl = (subdomain) => {
  if (!subdomain) return APPS.studio;
  return isProd
    ? `https://${subdomain}.${ROOT_DOMAIN}`
    : `http://${subdomain}.localhost:5173`;
};

export default {
  ROOT_DOMAIN,
  API_BASE_URL,
  APPS,
  RESERVED_SUBDOMAINS,
  getStorefrontUrl,
};
