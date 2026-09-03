export function formatAddress(address) {
  if (!address) return "";
  if (typeof address === "string") return address;
  if (typeof address === "object") {
    const parts = [
      address.street,
      address.addressLine2,
      address.city,
      address.state,
      address.postalCode,
      address.country,
    ].filter((p) => p && typeof p === "string" && p.trim().length > 0);
    return parts.join(", ");
  }
  return "";
}

export default formatAddress;
