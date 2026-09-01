import { ROOT_DOMAIN, RESERVED_SUBDOMAINS } from "../config/env";

/**
 * Extracts tenant subdomain from the current browser hostname.
 * Returns null if accessed from main marketplace or reserved subdomains.
 */
export const getTenantSubdomain = () => {
  if (typeof window === "undefined") return null;

  const hostname = window.location.hostname.toLowerCase();
  const root = ROOT_DOMAIN.toLowerCase();

  let candidate = null;

  if (hostname.endsWith(".localhost")) {
    candidate = hostname.replace(/\.localhost$/, "");
  } else if (hostname.endsWith(`.${root}`)) {
    candidate = hostname.replace(new RegExp(`\\.${root}$`), "");
  }

  if (
    candidate &&
    !RESERVED_SUBDOMAINS.includes(candidate) &&
    !["127.0.0.1", "localhost"].includes(candidate)
  ) {
    return candidate;
  }

  return null;
};

/**
 * Checks if the current app is running on a dedicated tenant storefront subdomain.
 */
export const isTenantHost = () => {
  return Boolean(getTenantSubdomain());
};

export default {
  getTenantSubdomain,
  isTenantHost,
};
