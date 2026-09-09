import React, { useState } from "react";
import {
  ShoppingCart,
  Heart,
  SlidersHorizontal,
  Eye,
  Check,
  Star,
} from "lucide-react";
import { isOutOfStock } from "../../../utils/stockUtils";
import { getProductImage } from "../../../utils/productImage";

export default function ProductCard({
  product,
  onSelectProduct,
  onAddToCart,
  onToggleCompare,
  isCompared = false,
  layout = "grid",
}) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  if (!product) return null;

  const outOfStock = isOutOfStock(product);
  const finalPrice = Number(product.price) || 0;
  const originalPrice = product.compareAtPrice
    ? Number(product.compareAtPrice)
    : null;
  const hasDiscount = originalPrice && originalPrice > finalPrice;
  const discountPct = hasDiscount
    ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100)
    : null;

  const handleAdd = (e) => {
    e.stopPropagation();
    if (outOfStock) return;
    setIsAdding(true);
    if (onAddToCart) onAddToCart(product, 1);
    setTimeout(() => setIsAdding(false), 800);
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const handleCompare = (e) => {
    e.stopPropagation();
    if (onToggleCompare) onToggleCompare(product);
  };

  // ================= LIST / TABLE VIEW =================
  if (layout === "list") {
    return (
      <div
        onClick={() => onSelectProduct && onSelectProduct(product)}
        className="group relative bg-white rounded-2xl border border-slate-200/80 hover:border-yellow-400 hover:shadow-lg p-4 transition-all duration-200 flex flex-col sm:flex-row items-center gap-4 cursor-pointer text-left"
      >
        <div className="w-full sm:w-36 h-36 shrink-0 rounded-xl overflow-hidden bg-slate-50 flex items-center justify-center p-2 relative">
          <img
            src={getProductImage(product, product.image)}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {hasDiscount && (
            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
              -{discountPct}%
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider truncate">
            {product.category || "Electronics, Gadgets"}
          </span>
          <h3 className="text-sm font-bold text-sky-600 group-hover:text-sky-800 transition line-clamp-1 leading-tight">
            {product.name}
          </h3>
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {product.description ||
              "High-performance electronic hardware with official brand warranty and premium engineering."}
          </p>
          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              In Stock
            </span>
            <span className="text-xs text-slate-400">
              ★ {product.rating || "4.9"} ({product.reviewCount || 36})
            </span>
          </div>
        </div>

        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
          <div className="text-left sm:text-right">
            {hasDiscount ? (
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-black text-rose-600">
                  ₹{finalPrice.toFixed(2)}
                </span>
                <span className="text-xs text-slate-400 line-through">
                  ₹{originalPrice.toFixed(2)}
                </span>
              </div>
            ) : (
              <span className="text-lg font-black text-slate-900">
                ₹{finalPrice.toFixed(2)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleWishlist}
              className={`p-2 rounded-full border transition cursor-pointer ${
                isWishlisted
                  ? "bg-rose-50 text-rose-600 border-rose-200"
                  : "bg-slate-50 text-slate-400 hover:text-slate-600 border-slate-200"
              }`}
            >
              <Heart
                size={14}
                className={isWishlisted ? "fill-rose-500" : ""}
              />
            </button>
            <button
              type="button"
              onClick={handleAdd}
              className="p-2.5 rounded-full bg-slate-100 hover:bg-[#EAB308] hover:text-slate-900 text-slate-700 transition cursor-pointer shadow-xs"
            >
              <ShoppingCart size={15} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ================= GRID VIEW (MATCHING ATTACHED SCREENSHOT) =================
  return (
    <div
      onClick={() => onSelectProduct && onSelectProduct(product)}
      className="group relative bg-white rounded-2xl border border-slate-200/90 hover:border-yellow-400 hover:shadow-xl p-3.5 sm:p-4 flex flex-col justify-between transition-all duration-300 cursor-pointer text-left shadow-2xs min-w-[170px]"
    >
      <div>
        {/* Top: Category Tag */}
        <div className="flex items-center justify-between mb-1 min-h-[16px]">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider truncate block max-w-[120px]">
            {product.category || "Accessories, Tech"}
          </span>

          {/* Wishlist Button */}
          <button
            type="button"
            onClick={handleWishlist}
            className={`p-1 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer ${
              isWishlisted
                ? "opacity-100 text-rose-500"
                : "text-slate-300 hover:text-rose-500"
            }`}
          >
            <Heart size={13} className={isWishlisted ? "fill-rose-500" : ""} />
          </button>
        </div>

        {/* Title (Blue Clickable Link) */}
        <h4 className="text-xs sm:text-[13px] font-bold text-sky-600 group-hover:text-sky-800 transition-colors line-clamp-2 leading-snug min-h-[34px]">
          {product.name}
        </h4>

        {/* Product Photo on pure white */}
        <div className="aspect-square w-full rounded-xl overflow-hidden bg-white flex items-center justify-center p-2 relative my-2">
          <img
            src={getProductImage(product, product.image)}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-300"
            loading="lazy"
          />

          {/* Sale Discount Tag */}
          {hasDiscount && (
            <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-rose-600 text-white text-[9px] font-black uppercase tracking-wider shadow-xs">
              -{discountPct}%
            </span>
          )}

          {/* Quick Actions Hover Bar */}
          <div className="absolute inset-x-2 bottom-2 flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition duration-200">
            {onToggleCompare && (
              <button
                type="button"
                onClick={handleCompare}
                title={isCompared ? "Remove comparison" : "Compare specs"}
                className={`p-1.5 rounded-lg shadow-sm border text-xs transition cursor-pointer ${
                  isCompared
                    ? "bg-[#EAB308] text-slate-900 border-yellow-400 font-bold"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                <SlidersHorizontal size={13} />
              </button>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onSelectProduct) onSelectProduct(product);
              }}
              title="Quick inspect"
              className="p-1.5 rounded-lg bg-white text-slate-600 border border-slate-200 shadow-sm hover:bg-slate-50 transition cursor-pointer"
            >
              <Eye size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Area: Pricing & Cart Icon */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
        <div>
          {hasDiscount ? (
            <div className="flex items-baseline gap-1">
              <span className="text-sm sm:text-base font-black text-rose-600">
                ₹{finalPrice.toFixed(2)}
              </span>
              <span className="text-[10px] text-slate-400 line-through">
                ₹{originalPrice.toFixed(2)}
              </span>
            </div>
          ) : (
            <span className="text-sm sm:text-base font-black text-slate-900">
              ₹{finalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Circular Cart Action Button */}
        <button
          type="button"
          onClick={handleAdd}
          title="Add to Cart"
          disabled={outOfStock}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition cursor-pointer shadow-xs ${
            outOfStock
              ? "bg-slate-100 text-slate-400 cursor-not-allowed"
              : isAdding
                ? "bg-emerald-600 text-white"
                : "bg-slate-100 hover:bg-[#EAB308] text-slate-700 hover:text-slate-900 active:scale-95"
          }`}
        >
          {isAdding ? <Check size={14} /> : <ShoppingCart size={14} />}
        </button>
      </div>
    </div>
  );
}
