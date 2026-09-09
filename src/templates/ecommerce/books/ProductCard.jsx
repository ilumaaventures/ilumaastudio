import React, { useState } from "react";
import { Check, ShoppingBag, Eye, Heart } from "lucide-react";
import { isOutOfStock } from "../../../utils/stockUtils";
import { getProductImage } from "../../../utils/productImage";

export default function ProductCard({
  product,
  onSelectProduct,
  onAddToCart,
  onQuickView,
}) {
  const [isAdding, setIsAdding] = useState(false);

  if (!product) return null;

  const outOfStock = isOutOfStock(product);
  const currentPrice = Number(product.price) || 0;
  const originalPrice = product.compareAtPrice ? Number(product.compareAtPrice) : null;
  const discountPercent =
    product.discount ||
    (originalPrice && originalPrice > currentPrice
      ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
      : null);

  // Background pad color (fallback to clean neutral if not provided)
  const backdropColor = product.backdropColor || "#E8ECEF";

  const handleAdd = (e) => {
    e.stopPropagation();
    if (outOfStock) return;
    setIsAdding(true);
    onAddToCart(product, 1);
    setTimeout(() => setIsAdding(false), 800);
  };

  const handleCardClick = () => {
    if (onSelectProduct) {
      onSelectProduct(product);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="group flex flex-col justify-between bg-white border border-[#E5E7EB] hover:border-[#CBD5E1] rounded-sm p-3 sm:p-3.5 transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md select-none text-left"
    >
      <div className="space-y-3">
        {/* ================= 1. COLORED BACKDROP MATTING BOX ================= */}
        <div
          className="w-full aspect-[4/5] rounded-xs flex items-center justify-center p-4 sm:p-5 relative overflow-hidden transition-transform duration-300 group-hover:scale-[1.01]"
          style={{ backgroundColor: backdropColor }}
        >
          {/* Centered Book Cover with Realistic Shadow & Spine */}
          <div className="relative w-3/4 max-w-[170px] aspect-[2/3] shadow-[0_8px_20px_rgba(0,0,0,0.22)] rounded-xs overflow-hidden bg-white">
            <img
              src={getProductImage(product, product.image)}
              alt={product.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {/* Subtle Book Spine Left Highlight */}
            <div className="absolute top-0 bottom-0 left-0 w-2.5 bg-gradient-to-r from-black/20 via-white/15 to-transparent pointer-events-none" />
            <div className="absolute inset-0 shadow-inner pointer-events-none border border-black/10" />
          </div>

          {/* Quick Action Eye on Hover */}
          <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
            <button
              type="button"
              title="Quick View"
              onClick={(e) => {
                e.stopPropagation();
                if (onQuickView) onQuickView(product);
                else if (onSelectProduct) onSelectProduct(product);
              }}
              className="p-1.5 rounded-full bg-white/90 text-stone-800 hover:bg-white hover:text-teal-900 shadow-md transition cursor-pointer"
            >
              <Eye size={14} />
            </button>
          </div>
        </div>

        {/* ================= 2. TITLE ================= */}
        <div>
          <h3
            className="text-xs sm:text-[13px] font-normal text-[#1F2937] leading-snug line-clamp-1 group-hover:text-[#113C48] transition-colors"
            title={product.name}
          >
            {product.shortName || product.name}
          </h3>
        </div>
      </div>

      {/* ================= 3. PRICE ROW & ADD TO CART BUTTON ================= */}
      <div className="pt-3 flex items-center justify-between gap-2 border-t border-[#F3F4F6] mt-2">
        <div className="flex items-baseline flex-wrap gap-1.5 text-left">
          <span className="text-sm sm:text-base font-semibold text-[#111827]">
            ${Number(currentPrice).toFixed(currentPrice % 1 === 0 ? 0 : 2)}
          </span>

          {originalPrice && originalPrice > currentPrice && (
            <span className="text-xs text-[#9CA3AF] line-through">
              ${Number(originalPrice).toFixed(originalPrice % 1 === 0 ? 0 : 2)}
            </span>
          )}

          {discountPercent > 0 && (
            <span className="text-[11px] font-medium text-[#047857]">
              ({discountPercent}% off)
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleAdd}
          disabled={outOfStock}
          className={`px-3 sm:px-3.5 py-1.5 text-xs font-medium rounded-sm transition-all duration-200 cursor-pointer whitespace-nowrap flex items-center gap-1 shadow-2xs active:scale-95 ${
            outOfStock
              ? "bg-stone-200 text-stone-500 cursor-not-allowed"
              : isAdding
                ? "bg-[#065F46] text-white"
                : "bg-[#133E47] hover:bg-[#0E2D34] text-white"
          }`}
        >
          {isAdding ? (
            <>
              <Check size={13} />
              <span>Added</span>
            </>
          ) : (
            <span>Add to cart</span>
          )}
        </button>
      </div>
    </div>
  );
}
