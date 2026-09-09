import React, { useState } from "react";
import { Star, Heart, Eye, ShoppingBag } from "lucide-react";
import { getProductImage } from "../../../utils/productImage";

export default function ProductCard({
  product,
  onSelectProduct,
  onAddToCart,
  onQuickView,
}) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  if (!product) return null;

  const displayImage = getProductImage(product, product.image);
  const discountText = product.discount || (product.compareAtPrice && product.compareAtPrice > product.price ? product.badge || "SALE" : null);

  return (
    <div
      onClick={() => onSelectProduct && onSelectProduct(product)}
      className="group relative flex flex-col justify-between text-left transition-all duration-300 cursor-pointer bg-white p-2 sm:p-3 rounded-lg hover:shadow-md"
    >
      {/* Product Image Canvas */}
      <div className="relative aspect-square w-full bg-[#FAF9F8] rounded-md p-4 flex items-center justify-center overflow-hidden border border-stone-100 group-hover:border-stone-200 transition-colors">
        {/* Square Red Discount Badge */}
        {discountText && (
          <span className="absolute top-2.5 left-2.5 z-10 text-[10px] font-bold text-red-600 border border-red-500 bg-white/90 px-1.5 py-0.5 tracking-tight leading-none">
            {discountText}
          </span>
        )}

        {/* Wishlist Button (Always accessible / hover) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsWishlisted(!isWishlisted);
          }}
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-full bg-white/80 hover:bg-white text-stone-600 hover:text-red-500 shadow-xs flex items-center justify-center transition cursor-pointer"
        >
          <Heart size={14} fill={isWishlisted ? "#E11D48" : "none"} className={isWishlisted ? "text-rose-600" : ""} />
        </button>

        {/* Product Image Cutout */}
        <img
          src={displayImage}
          alt={product.name}
          className="w-full h-full object-contain max-h-[210px] drop-shadow-sm group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Quick View & Add to Cart on Hover Bar */}
        <div className="absolute inset-x-3 bottom-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onQuickView?.(product);
            }}
            className="flex-1 py-1.5 px-2.5 bg-white/95 hover:bg-stone-900 hover:text-white text-stone-900 text-[11px] font-semibold tracking-wider uppercase rounded shadow-xs border border-stone-200 transition flex items-center justify-center gap-1 cursor-pointer"
          >
            <Eye size={12} />
            <span>Quick View</span>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart?.(product);
            }}
            className="w-8 h-8 bg-stone-900 hover:bg-[#AA771C] text-white rounded shadow-xs flex items-center justify-center transition cursor-pointer shrink-0"
            title="Add to Bag"
          >
            <ShoppingBag size={14} />
          </button>
        </div>
      </div>

      {/* Meta Content */}
      <div className="pt-3 space-y-1">
        {/* Category Label in Light Grey Uppercase */}
        <span className="text-[10px] tracking-widest text-stone-400 font-semibold uppercase block">
          {product.category || "JEWELRY"}
        </span>

        {/* Product Title */}
        <h3 className="text-stone-900 text-xs sm:text-sm font-medium hover:text-[#AA771C] transition-colors line-clamp-1">
          {product.name}
        </h3>

        {/* Price Row (Red Sale Price + Original Strikethrough) */}
        <div className="flex items-center gap-2 pt-0.5">
          <span className="text-rose-600 font-bold text-xs sm:text-sm">
            ${Number(product.price).toFixed(2)}
          </span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-stone-400 text-[11px] sm:text-xs line-through">
              ${Number(product.compareAtPrice).toFixed(2)}
            </span>
          )}
        </div>

        {/* Rating Line matching screenshot: ★ 3.33 | 1 Reviews */}
        <div className="flex items-center gap-1.5 text-[11px] text-stone-500 pt-0.5">
          <Star size={11} className="fill-amber-400 text-amber-400 shrink-0" />
          <span className="font-semibold text-stone-700">
            {product.rating ? Number(product.rating).toFixed(2) : "4.50"}
          </span>
          <span className="text-stone-300">|</span>
          <span className="text-stone-500">
            {product.reviewCount || 1} Reviews
          </span>
        </div>
      </div>
    </div>
  );
}
