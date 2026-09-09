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
  const [selectedShadeIdx, setSelectedShadeIdx] = useState(0);

  if (!product) return null;

  const displayImage = getProductImage(product, product.image);
  const defaultShades = product.shades || ["#991B1B", "#1C1917", "#D97706", "#CBD5E1"];
  const isSale = product.badge === "Sale" || (product.compareAtPrice && product.compareAtPrice > product.price);

  return (
    <div
      onClick={() => onSelectProduct?.(product)}
      className="group relative flex flex-col justify-between text-center transition-all duration-300 cursor-pointer bg-white p-3 sm:p-4 rounded-xl hover:shadow-lg border border-stone-100"
    >
      {/* Product Image Frame */}
      <div className="relative aspect-[3/4] w-full bg-[#FAF9F7] rounded-lg p-4 flex items-center justify-center overflow-hidden">
        {/* Circular Green Sale Badge */}
        {isSale && (
          <span className="absolute top-2.5 left-2.5 z-10 w-7 h-7 rounded-full bg-[#8F9E68] text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
            Sale
          </span>
        )}

        {/* Hover Quick Action Icons (Top-Right) */}
        <div className="absolute top-2.5 right-2.5 z-10 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onQuickView?.(product);
            }}
            title="Quick View"
            className="w-7 h-7 rounded-full bg-white text-stone-700 hover:bg-stone-900 hover:text-white shadow-xs flex items-center justify-center transition cursor-pointer"
          >
            <Eye size={13} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsWishlisted(!isWishlisted);
            }}
            title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className="w-7 h-7 rounded-full bg-white text-stone-700 hover:text-rose-600 shadow-xs flex items-center justify-center transition cursor-pointer"
          >
            <Heart size={13} fill={isWishlisted ? "#E11D48" : "none"} className={isWishlisted ? "text-rose-600" : ""} />
          </button>
        </div>

        {/* Product Cutout Image */}
        <img
          src={displayImage}
          alt={product.name}
          className="w-full h-full object-contain max-h-[180px] drop-shadow-sm group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Floating Quick Add to Cart Bar on Bottom Hover */}
        <div className="absolute inset-x-3 bottom-2.5 opacity-0 group-hover:opacity-100 transition-all duration-200">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart?.({
                ...product,
                selectedShade: defaultShades[selectedShadeIdx],
              });
            }}
            className="w-full py-1.5 bg-stone-900/90 hover:bg-stone-900 text-white text-[11px] font-semibold tracking-wider uppercase rounded shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ShoppingBag size={12} />
            <span>Add To Bag</span>
          </button>
        </div>
      </div>

      {/* Meta Content */}
      <div className="pt-3 space-y-1.5">
        {/* 5-Star Rating */}
        <div className="flex items-center justify-center gap-0.5 text-amber-400">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
          ))}
        </div>

        {/* Title */}
        <h3 className="text-stone-800 text-xs sm:text-sm font-medium hover:text-[#8F9E68] transition-colors line-clamp-1">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-center justify-center gap-1.5 text-xs sm:text-sm">
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-stone-400 line-through text-xs">
              ${Number(product.compareAtPrice).toFixed(2)}
            </span>
          )}
          <span className="text-stone-900 font-bold">
            ${Number(product.price).toFixed(2)}
          </span>
        </div>

        {/* Shade Swatch Dots */}
        <div className="flex items-center justify-center gap-1.5 pt-1">
          {defaultShades.slice(0, 3).map((shade, idx) => {
            const isSelected = selectedShadeIdx === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedShadeIdx(idx);
                }}
                className={`w-3.5 h-3.5 rounded-full transition-transform cursor-pointer ${
                  isSelected ? "ring-2 ring-stone-900 ring-offset-1 scale-110" : "hover:scale-110"
                }`}
                style={{ backgroundColor: shade }}
                title={`Shade ${idx + 1}`}
              />
            );
          })}
          {defaultShades.length > 3 && (
            <span className="text-[10px] text-stone-500 font-medium ml-0.5">
              +{defaultShades.length - 3}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
