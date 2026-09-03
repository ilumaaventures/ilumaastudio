/**
 * Helper to safely extract image URLs from MongoDB / Cloudinary product data structures.
 * Supports:
 * - images: [ { url, public_id, _id } ]
 * - images: [ "https://..." ]
 * - image: { url: "..." } or "https://..."
 * - thumbnail / coverImage / featuredImage
 */
export function getProductImage(item, fallback = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80") {
  if (!item) return fallback;

  // If item itself is a string URL
  if (typeof item === "string" && item.trim().length > 0) {
    return item;
  }

  // 1. Check images array (common in e-commerce schema with Cloudinary objects)
  if (Array.isArray(item.images) && item.images.length > 0) {
    for (const img of item.images) {
      if (typeof img === "string" && img.trim().length > 0) {
        return img;
      }
      if (img && typeof img === "object") {
        if (img.url && typeof img.url === "string" && img.url.trim().length > 0) {
          return img.url;
        }
        if (img.secure_url && typeof img.secure_url === "string" && img.secure_url.trim().length > 0) {
          return img.secure_url;
        }
      }
    }
  }

  // 2. Check image property (string or object)
  if (item.image) {
    if (typeof item.image === "string" && item.image.trim().length > 0) {
      return item.image;
    }
    if (typeof item.image === "object") {
      if (item.image.url && typeof item.image.url === "string" && item.image.url.trim().length > 0) {
        return item.image.url;
      }
      if (item.image.secure_url && typeof item.image.secure_url === "string" && item.image.secure_url.trim().length > 0) {
        return item.image.secure_url;
      }
    }
  }

  // 3. Check other common fields
  if (typeof item.thumbnail === "string" && item.thumbnail.trim().length > 0) return item.thumbnail;
  if (typeof item.coverImage === "string" && item.coverImage.trim().length > 0) return item.coverImage;
  if (typeof item.featuredImage === "string" && item.featuredImage.trim().length > 0) return item.featuredImage;

  return fallback;
}

export function getAllProductImages(item) {
  if (!item) return [];
  const urls = [];

  if (Array.isArray(item.images)) {
    for (const img of item.images) {
      if (typeof img === "string" && img.trim().length > 0 && !urls.includes(img)) {
        urls.push(img);
      } else if (img && typeof img === "object") {
        const u = img.url || img.secure_url;
        if (u && typeof u === "string" && u.trim().length > 0 && !urls.includes(u)) {
          urls.push(u);
        }
      }
    }
  }

  const single = getProductImage(item, null);
  if (single && !urls.includes(single)) {
    urls.unshift(single);
  }

  return urls;
}

export default getProductImage;
