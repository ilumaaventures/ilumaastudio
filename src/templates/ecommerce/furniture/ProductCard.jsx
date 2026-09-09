import React, { useState } from "react";
import { Heart, Eye, ShoppingCart, RotateCcw, Star } from "lucide-react";
import { getProductImage } from "../../../utils/productImage";

export default function ProductCard({
  product,
  onAddToCart,
  onQuickView,
  onSelectProduct,
}) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const discountBadge = product.badge || (product.compareAtPrice && product.compareAtPrice > product.price ? "Sale!" : null);
  const displayImage = getProductImage(product, product.image);

  return (
    <div className="group relative flex flex-col justify-between text-left transition-all duration-300">
      {/* Product Image Frame */}
      <div className="relative aspect-square w-full rounded-2xl bg-[#F7F5F2] hover:bg-[#F3EFEA] transition-colors duration-300 p-6 flex items-center justify-center overflow-hidden">
        {/* Badge */}
        {discountBadge && (
          <span className="absolute top-3.5 left-3.5 z-10 px-3 py-1 text-[11px] font-semibold text-white bg-[#A07855] rounded-full shadow-xs tracking-wide">
            {discountBadge}
          </span>
        )}

        {/* Product Image */}
        <img
          src={displayImage}
          alt={product.name}
          onClick={() => onSelectProduct?.(product)}
          className="w-full h-full object-contain max-h-[190px] drop-shadow-md group-hover:scale-105 transition-transform duration-500 cursor-pointer"
          loading="lazy"
        />

        {/* 4 Hover Action Buttons Bar */}
        <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto bg-stone-900/10 backdrop-blur-[2px]">
          {/* Wishlist */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsWishlisted(!isWishlisted);
            }}
            title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer shadow-md hover:scale-110 ${isWishlisted
                ? "bg-rose-50 text-rose-600"
                : "bg-white text-stone-700 hover:bg-[#A07855] hover:text-white"
              }`}
          >
            <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} />
          </button>

          {/* Quick View */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onQuickView?.(product);
            }}
            title="Quick view"
            className="w-10 h-10 rounded-full bg-white text-stone-700 hover:bg-[#A07855] hover:text-white flex items-center justify-center transition-all duration-200 cursor-pointer shadow-md hover:scale-110"
          >
            <Eye size={16} />
          </button>

          {/* Add to Cart */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart?.(product);
            }}
            title="Add to cart"
            className="w-10 h-10 rounded-full bg-white text-stone-700 hover:bg-[#A07855] hover:text-white flex items-center justify-center transition-all duration-200 cursor-pointer shadow-md hover:scale-110"
          >
            <ShoppingCart size={16} />
          </button>

          {/* Details / Compare */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectProduct?.(product);
            }}
            title="Product details"
            className="w-10 h-10 rounded-full bg-white text-stone-700 hover:bg-[#A07855] hover:text-white flex items-center justify-center transition-all duration-200 cursor-pointer shadow-md hover:scale-110"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* Meta Content */}
      <div className="pt-3.5 space-y-1">
        {/* Title */}
        <h3
          onClick={() => onSelectProduct?.(product)}
          className="text-stone-800 text-sm sm:text-base font-medium hover:text-[#A07855] transition-colors cursor-pointer line-clamp-1"
        >
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <div className="flex text-amber-500">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={13}
                className={i < Math.floor(product.rating || 5) ? "fill-amber-500 text-amber-500" : "text-stone-300"}
              />
            ))}
          </div>
          <span className="text-stone-500 text-xs">({product.reviewCount || 1})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 pt-0.5">
          <span className="text-stone-900 font-bold text-sm sm:text-base">
            {product.priceRange ? product.priceRange : `$${Number(product.price).toFixed(2)}`}
          </span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-stone-400 text-xs sm:text-sm line-through">
              ₹{Number(product.compareAtPrice).toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
