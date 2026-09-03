/**
 * Universal Stock & Inventory Utilities for ILumaa Storefronts & Catalog
 * Matches inventory tracking logic in Shop.jsx and ProductCard.jsx
 */

/**
 * Returns available numerical stock for a product or its variants.
 * @param {Object} product
 * @returns {number}
 */
export function getProductStock(product) {
  if (!product) return 0;

  // 1. Explicit inStock boolean flag
  if (product.inStock === false) return 0;

  // 2. Variant-level inventory
  if (product.hasVariants && Array.isArray(product.variants) && product.variants.length > 0) {
    const totalVariantStock = product.variants.reduce((total, v) => {
      const vStock =
        v.stockQuantity !== undefined
          ? Number(v.stockQuantity)
          : v.stock !== undefined
          ? Number(v.stock)
          : 0;
      return total + (isNaN(vStock) ? 0 : Math.max(0, vStock));
    }, 0);
    return totalVariantStock;
  }

  // 3. Direct inventory tracking fields
  if (product.inventory?.stockQuantity !== undefined) {
    const s = Number(product.inventory.stockQuantity);
    return isNaN(s) ? 0 : Math.max(0, s);
  }
  if (product.stockQuantity !== undefined) {
    const s = Number(product.stockQuantity);
    return isNaN(s) ? 0 : Math.max(0, s);
  }
  if (product.stock !== undefined) {
    const s = Number(product.stock);
    return isNaN(s) ? 0 : Math.max(0, s);
  }
  if (product.countInStock !== undefined) {
    const s = Number(product.countInStock);
    return isNaN(s) ? 0 : Math.max(0, s);
  }

  // Fallback for demo templates without explicit 0 stock
  return 99;
}

/**
 * Returns true if product has zero stock or is marked out of stock.
 * @param {Object} product
 * @returns {boolean}
 */
export function isOutOfStock(product) {
  if (!product) return true;
  if (product.inStock === false) return true;
  return getProductStock(product) <= 0;
}

/**
 * Returns human-readable stock badge object.
 * @param {Object} product
 * @returns {{ label: string, isAvailable: boolean, badgeClass: string }}
 */
export function getStockStatus(product) {
  const stock = getProductStock(product);
  if (stock <= 0 || product?.inStock === false) {
    return {
      label: "Out of Stock",
      isAvailable: false,
      badgeClass: "text-rose-600 bg-rose-50 border-rose-200",
    };
  }
  if (stock <= 5) {
    return {
      label: `Only ${stock} left!`,
      isAvailable: true,
      badgeClass: "text-amber-700 bg-amber-50 border-amber-200",
    };
  }
  return {
    label: "In Stock",
    isAvailable: true,
    badgeClass: "text-emerald-700 bg-emerald-50 border-emerald-200",
  };
}

export default {
  getProductStock,
  isOutOfStock,
  getStockStatus,
};
