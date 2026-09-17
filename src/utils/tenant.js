import { ROOT_DOMAIN, RESERVED_SUBDOMAINS } from "../config/env";

/**
 * Extracts tenant subdomain from the current browser hostname.
 * Returns null if accessing the root marketplace (localhost, studio.localhost, ilumaastudio.ilumaa.com, etc.)
 *
 * Examples:
 * - "freshmart.localhost:5173" -> "freshmart"
 * - "starlingtales.localhost:5173" -> "starlingtales"
 * - "freshmart.ilumaa.com" -> "freshmart"
 * - "localhost:5173" -> null
 * - "studio.localhost:5173" -> null
 * - "ilumaastudio.ilumaa.com" -> null
 */
export const getTenantSubdomain = (hostname = typeof window !== "undefined" ? window.location.hostname : "") => {
  if (!hostname) return null;
  const lowerHost = hostname.toLowerCase();

  // 1. Localhost development (e.g. freshmart.localhost or freshmart.localhost:5173)
  if (lowerHost.endsWith(".localhost") || (lowerHost.includes("localhost") && lowerHost !== "localhost")) {
    const parts = lowerHost.split(".");
    if (parts.length >= 2) {
      const sub = parts[0];
      if (!RESERVED_SUBDOMAINS.includes(sub)) {
        return sub;
      }
    }
    return null;
  }

  // 2. Production wildcard subdomains (*.ilumaa.com)
  const root = (ROOT_DOMAIN || "ilumaa.com").toLowerCase();
  if (lowerHost.endsWith(`.${root}`)) {
    const sub = lowerHost.replace(`.${root}`, "").split(".")[0];
    if (sub && !RESERVED_SUBDOMAINS.includes(sub)) {
      return sub;
    }
    return null;
  }

  // 3. Apex / root domain or system domains
  if (lowerHost === "localhost" || lowerHost === root || RESERVED_SUBDOMAINS.includes(lowerHost)) {
    return null;
  }

  // 4. Custom domain support (e.g. shop.brand.com)
  if (!lowerHost.includes("localhost") && !lowerHost.endsWith(`.${root}`)) {
    return lowerHost;
  }

  return null;
};

/**
 * Returns true if the current web app is being rendered on a tenant subdomain or custom domain
 */
export const isTenantHost = (hostname) => Boolean(getTenantSubdomain(hostname));

export default {
  getTenantSubdomain,
  isTenantHost,
};
