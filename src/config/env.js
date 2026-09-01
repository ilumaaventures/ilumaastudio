/**
<<<<<<< HEAD
 * Centralized environment and subdomain configuration for ILumaa Studio (Storefront App)
=======
 * Centralized environment and subdomain configuration for ILumaa Studio
>>>>>>> 9d38903e872714ab84df19b3829bd2415adc6673
 */
const isProd = import.meta.env.PROD;

export const ROOT_DOMAIN =
  import.meta.env.VITE_ROOT_DOMAIN || (isProd ? "ilumaa.com" : "localhost");

<<<<<<< HEAD
// Base URL for backend API
// Fallback: https://api.ilumaa.com (or https://ilumaasocial-backend.onrender.com during DNS transition)
=======
>>>>>>> 9d38903e872714ab84df19b3829bd2415adc6673
export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (isProd ? `https://api.${ROOT_DOMAIN}` : "http://localhost:5000");

<<<<<<< HEAD
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
=======
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
>>>>>>> 9d38903e872714ab84df19b3829bd2415adc6673
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
<<<<<<< HEAD
  "social",
  "kraftybling",
=======
>>>>>>> 9d38903e872714ab84df19b3829bd2415adc6673
  "studio",
  "dashboard",
  "superadmin",
];

<<<<<<< HEAD
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
=======
export const getStorefrontUrl = (subdomain) => {
  if (!subdomain) return APPS.studio;
  return isProd
    ? `https://${subdomain}.${ROOT_DOMAIN}`
    : `http://${subdomain}.localhost:5173`;
>>>>>>> 9d38903e872714ab84df19b3829bd2415adc6673
};

export default {
  ROOT_DOMAIN,
  API_BASE_URL,
<<<<<<< HEAD
  BASE_URL,
  API_URL,
=======
>>>>>>> 9d38903e872714ab84df19b3829bd2415adc6673
  APPS,
  RESERVED_SUBDOMAINS,
  getStorefrontUrl,
};
