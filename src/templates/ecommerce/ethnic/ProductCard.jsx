import React, { useState } from "react";
import { Heart, Check, ShoppingBag } from "lucide-react";
import { isOutOfStock } from "../../../utils/stockUtils";
import { getProductImage } from "../../../utils/productImage";

export default function ProductCard({
  product,
  onSelectProduct,
  onAddToCart,
  onToggleWishlist,
  isWishlisted = false,
  currency = "₹",
}) {
  const [isAdding, setIsAdding] = useState(false);

  if (!product) return null;

  const outOfStock = isOutOfStock(product);
  const price = Number(product.price) || 0;
  const originalPrice = product.compareAtPrice ? Number(product.compareAtPrice) : null;
  const discountPercent =
    product.discount ||
    (originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : null);
  const currencySymbol = product.currency || currency || "₹";

  const handleAdd = (e) => {
    e.stopPropagation();
    if (outOfStock) return;
    setIsAdding(true);
    if (onAddToCart) {
      onAddToCart(product, 1);
    }
    setTimeout(() => setIsAdding(false), 700);
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    if (onToggleWishlist) {
      onToggleWishlist(product);
    }
  };

  return (
    <div
      onClick={() => onSelectProduct && onSelectProduct(product)}
      className="group flex flex-col justify-between bg-white text-left cursor-pointer select-none space-y-2"
    >
      {/* ================= 1. MODEL IMAGE CONTAINER ================= */}
      <div className="relative w-full aspect-[3/4] bg-[#F2EDE7] overflow-hidden rounded-none border border-transparent group-hover:border-stone-200 transition-colors">
        {/* Warm circular halo backdrop behind model */}
        <div className="absolute inset-4 rounded-full bg-[#E8DDD1]/60 blur-xl pointer-events-none" />

        <img
          src={getProductImage(product, product.image)}
          alt={product.name}
          className="relative z-10 w-full h-full object-cover object-top group-hover:scale-[1.03] transition-transform duration-500"
          loading="lazy"
        />

        {/* Top-Left Green Ribbon / Offer Badge */}
        {product.ribbonBadge && (
          <div className="absolute top-0 left-0 z-20 bg-[#16A34A] text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 shadow-xs">
            {product.ribbonBadge}
          </div>
        )}

        {/* Floating Circular Heart Wishlist Button on Bottom Right */}
        <button
          type="button"
          onClick={handleWishlist}
          title={isWishlisted ? "Remove from Wishlist" : "Save to Wishlist"}
          className={`absolute bottom-2 right-2 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center backdrop-blur-xs transition-all duration-200 shadow-xs cursor-pointer ${
            isWishlisted
              ? "bg-rose-500 text-white shadow-md scale-105"
              : "bg-white/90 text-stone-700 hover:bg-white hover:text-black"
          }`}
        >
          <Heart
            size={14}
            className={isWishlisted ? "fill-white text-white" : "text-stone-700"}
          />
        </button>
      </div>

      {/* ================= 2. TITLE & PRICING ================= */}
      <div className="space-y-0.5 pt-1">
        <h3
          className="text-xs font-normal text-stone-900 line-clamp-1 group-hover:text-black"
          title={product.name}
        >
          {product.shortName || product.name}
        </h3>

        <div className="flex items-baseline flex-wrap gap-1.5 text-[11px] sm:text-xs">
          <span className="font-bold text-stone-900">
            {currencySymbol}{price}
          </span>

          {originalPrice && originalPrice > price && (
            <span className="text-stone-400 line-through text-[10px] sm:text-[11px]">
              {currencySymbol}{originalPrice}
            </span>
          )}

          {discountPercent > 0 && (
            <span className="text-[#16A34A] font-semibold text-[10px] sm:text-[11px]">
              ({discountPercent}% OFF)
            </span>
          )}
        </div>
      </div>

      {/* ================= 3. FULL-WIDTH OUTLINE "ADD TO CART" BUTTON ================= */}
      <div className="pt-1">
        <button
          type="button"
          onClick={handleAdd}
          disabled={outOfStock}
          className={`w-full py-1.5 px-3 rounded-none text-[11px] sm:text-xs font-normal tracking-wide transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 border border-black ${
            outOfStock
              ? "border-stone-200 text-stone-400 bg-stone-50 cursor-not-allowed"
              : isAdding
                ? "bg-black text-white"
                : "bg-white text-black hover:bg-black hover:text-white"
          }`}
        >
          {isAdding ? (
            <>
              <Check size={12} />
              <span>Added to cart</span>
            </>
          ) : (
            <span>Add to cart</span>
          )}
        </button>
      </div>
    </div>
  );
}
