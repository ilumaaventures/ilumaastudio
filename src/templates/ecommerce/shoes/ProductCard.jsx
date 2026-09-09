import React, { useState } from "react";
import {
  ShoppingBag,
  Heart,
  Star,
  Eye,
  Check,
  Zap,
} from "lucide-react";
import { isOutOfStock } from "../../../utils/stockUtils";
import { getProductImage } from "../../../utils/productImage";

export default function ProductCard({
  product = {},
  onSelectProduct = () => {},
  onAddToCart = () => {},
  onQuickView = null,
  sizeStandard = "EU",
}) {
  // Default sizes from reference image or fallback
  const defaultSizes = product.sizes || ["38", "40", "41", "42", "43"];
  const [selectedSize, setSelectedSize] = useState(defaultSizes[2] || defaultSizes[0] || "41");

  // Default color variants
  const defaultColors = product.colors || [
    { name: "Navy Blue", hex: "#1E3A8A", bg: "bg-blue-900" },
    { name: "Forest Green", hex: "#047857", bg: "bg-emerald-700" },
    { name: "Crimson Red", hex: "#BE123C", bg: "bg-rose-700" },
    { name: "Triple White", hex: "#E2E8F0", bg: "bg-slate-200" },
  ];
  const [selectedColor, setSelectedColor] = useState(defaultColors[0]);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [hovered, setHovered] = useState(false);

  const outOfStock = isOutOfStock(product);
  const imageSrc = getProductImage(product, product.image);

  const price = Number(product.price) || 0;
  const compareAtPrice = product.compareAtPrice ? Number(product.compareAtPrice) : null;

  // Calculate discount percentage if available
  const discountPercent =
    compareAtPrice && compareAtPrice > price
      ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
      : null;

  // Handle Quick Add to Cart with selected size and color
  const handleQuickAdd = (e) => {
    e.stopPropagation();
    if (outOfStock) return;
    onAddToCart({
      ...product,
      selectedSize: `${sizeStandard} ${selectedSize}`,
      selectedColor: selectedColor?.name || "Standard",
    });
  };

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const handleQuickViewClick = (e) => {
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(product, selectedSize, selectedColor);
    } else {
      onSelectProduct(product);
    }
  };

  // Badge determination based on product metadata
  const badgeText = product.badge || (discountPercent ? `SALE! ${discountPercent}%` : "WINTER");
  const isSale = badgeText.toLowerCase().includes("sale") || discountPercent;

  return (
    <div
      onClick={() => onSelectProduct(product)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative bg-white rounded-2xl border border-slate-200/90 hover:border-blue-400/80 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden p-3.5 sm:p-4 cursor-pointer text-left"
    >
      {/* Top Header: Badge & Wishlist */}
      <div className="flex items-start justify-between gap-2 z-10">
        {/* Badge Pill */}
        <div className="flex flex-col gap-1">
          {badgeText && (
            <span
              className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow-xs ${
                isSale
                  ? "bg-[#1E3A8A] text-white"
                  : badgeText.toLowerCase().includes("winter")
                  ? "bg-sky-600 text-white"
                  : badgeText.toLowerCase().includes("best")
                  ? "bg-indigo-700 text-white"
                  : "bg-slate-800 text-white"
              }`}
            >
              {badgeText}
            </span>
          )}
          {discountPercent && !badgeText.includes("%") && (
            <span className="text-[9px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded w-fit border border-rose-200">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Action Buttons: Wishlist & Quick View */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleQuickViewClick}
            title="Quick View"
            className={`p-1.5 rounded-full transition cursor-pointer ${
              hovered ? "opacity-100 bg-slate-100 text-slate-700 hover:bg-slate-200" : "opacity-0"
            }`}
          >
            <Eye size={13} />
          </button>
          <button
            type="button"
            onClick={handleWishlistToggle}
            title="Add to Wishlist"
            className={`p-1.5 rounded-full transition cursor-pointer ${
              isWishlisted
                ? "bg-rose-50 text-rose-600 shadow-2xs"
                : "bg-slate-50 text-slate-400 hover:text-rose-500 hover:bg-slate-100"
            }`}
          >
            <Heart size={13} className={isWishlisted ? "fill-rose-600 text-rose-600" : ""} />
          </button>
        </div>
      </div>

      {/* Sneaker Hero Image Showcase */}
      <div className="relative my-2 py-4 flex items-center justify-center min-h-[160px] sm:min-h-[180px] bg-slate-50/50 rounded-xl overflow-hidden">
        <img
          src={imageSrc}
          alt={product.name}
          className="max-h-[135px] sm:max-h-[155px] w-auto object-contain filter drop-shadow-md group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Quick Add Overlay on Hover */}
        <div
          className={`absolute bottom-2 inset-x-2 flex justify-center transition-all duration-300 ${
            hovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
          }`}
        >
          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={outOfStock}
            className={`w-full py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md transition cursor-pointer ${
              outOfStock
                ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                : "bg-[#1E3A8A] hover:bg-blue-800 text-white active:scale-98"
            }`}
          >
            <ShoppingBag size={12} />
            <span>{outOfStock ? "Sold Out" : `Quick Add (${sizeStandard} ${selectedSize})`}</span>
          </button>
        </div>
      </div>

      {/* Card Info & Interactive Options */}
      <div className="space-y-2 pt-1 border-t border-slate-100">
        {/* Interactive In-Card Size Selector (as shown in reference image) */}
        <div className="flex items-center gap-1.5 flex-wrap" onClick={(e) => e.stopPropagation()}>
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
            sizes:
          </span>
          <div className="flex items-center gap-1 flex-wrap">
            {defaultSizes.slice(0, 4).map((size) => {
              const isSelected = selectedSize === size;
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`px-1.5 py-0.5 rounded text-[9px] font-bold transition border cursor-pointer ${
                    isSelected
                      ? "bg-slate-900 text-white border-slate-900 shadow-2xs"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-400 hover:bg-white"
                  }`}
                >
                  {sizeStandard} {size}
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive In-Card Color Swatches (as shown in reference image) */}
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
            color:
          </span>
          <div className="flex items-center gap-1.5">
            {defaultColors.map((col, idx) => {
              const isSelected = selectedColor?.name === col.name;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedColor(col)}
                  title={col.name}
                  className={`w-3.5 h-3.5 rounded-sm transition cursor-pointer border ${
                    isSelected
                      ? "ring-2 ring-blue-600 ring-offset-1 border-transparent scale-110"
                      : "border-slate-300 hover:scale-105"
                  }`}
                  style={{ backgroundColor: col.hex }}
                />
              );
            })}
          </div>
        </div>

        {/* Product Title */}
        <div className="pt-0.5">
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 hover:text-blue-600 transition truncate">
            {product.name}
          </h3>
        </div>

        {/* Price & Rating Bar */}
        <div className="flex items-baseline justify-between pt-0.5">
          {/* Price with Strikethrough */}
          <div className="flex items-baseline gap-2">
            {compareAtPrice && compareAtPrice > price ? (
              <>
                <span className="text-xs text-rose-500 font-medium line-through">
                  ${compareAtPrice.toFixed(2)}
                </span>
                <span className="text-sm font-black text-slate-900">
                  ${price.toFixed(2)}
                </span>
              </>
            ) : product.priceRange ? (
              <span className="text-xs sm:text-sm font-black text-slate-900">
                {product.priceRange}
              </span>
            ) : (
              <span className="text-sm font-black text-slate-900">
                ${price.toFixed(2)}
              </span>
            )}
          </div>

          {/* Star Ratings */}
          <div className="flex items-center gap-0.5 text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={10}
                className={i < Math.floor(product.rating || 5) ? "fill-amber-400" : "text-slate-200"}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
