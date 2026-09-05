import React, { useState } from "react";
import {
  Star,
  Plus,
  Check,
  BookOpen,
  Eye,
  Bookmark,
  Clock,
  Award,
} from "lucide-react";
import { isOutOfStock } from "../../../utils/stockUtils";
import { getProductImage } from "../../../utils/productImage";

export default function ProductCard({
  product,
  onSelectProduct,
  onAddToCart,
  onLookInside,
}) {
  const [selectedFormat, setSelectedFormat] = useState(product?.format || "Hardcover");
  const [isAdding, setIsAdding] = useState(false);

  if (!product) return null;

  const outOfStock = isOutOfStock(product);
  const basePrice = Number(product.price) || 0;
  const originalPrice = product.compareAtPrice ? Number(product.compareAtPrice) : null;
  // Paperback discount if selected
  const isPaperback = selectedFormat.toLowerCase().includes("paperback");
  const currentPrice = isPaperback ? Math.max(12, basePrice - 10) : basePrice;

  // Estimated read time (assuming 250 wpm)
  const estReadTime = product.wordCount
    ? `${Math.round((product.wordCount / 250 / 60) * 10) / 10} hrs`
    : `${product.pages ? Math.round((product.pages * 0.9) * 10) / 10 : 6} hrs`;

  const handleAdd = (e) => {
    e.stopPropagation();
    if (outOfStock) return;
    setIsAdding(true);
    const itemToAdd = {
      ...product,
      format: selectedFormat,
      price: currentPrice,
      name: `${product.name} (${selectedFormat})`,
    };
    onAddToCart(itemToAdd, 1);
    setTimeout(() => setIsAdding(false), 900);
  };

  return (
    <div
      onClick={() => onSelectProduct && onSelectProduct(product)}
      className="group relative bg-white rounded-3xl border border-[#E7DFD5] hover:border-[#78350F] p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 shadow-[0_4px_20px_rgba(28,25,23,0.04)] hover:shadow-[0_12px_35px_rgba(28,25,23,0.12)] cursor-pointer font-serif"
    >
      <div className="space-y-3.5">
        {/* Book Cover Image Container */}
        <div className="aspect-[3/4] w-full rounded-2xl overflow-hidden bg-[#FAF7F2] relative border border-[#EFE9DF] group-hover:border-[#D5C7B8] transition-colors shadow-sm">
          <img
            src={getProductImage(product, product.image)}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          {/* Floating Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
            {product.badge && (
              <span className="bg-[#1C1917] text-[#FAF7F2] text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md shadow-md border border-[#78350F]/40">
                {product.badge}
              </span>
            )}
            {product.genre && (
              <span className="bg-white/95 backdrop-blur-md text-[#78350F] text-[9px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-xs border border-[#E7DFD5] w-fit">
                {product.genre}
              </span>
            )}
          </div>

          {/* "Look Inside" Quick Reader Button */}
          <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10">
            <button
              type="button"
              title="Read First Chapter"
              onClick={(e) => {
                e.stopPropagation();
                if (onLookInside) {
                  onLookInside(product);
                } else {
                  onSelectProduct(product);
                }
              }}
              className="p-2 rounded-xl bg-white/90 backdrop-blur-md border border-[#D5C7B8] text-[#1C1917] hover:bg-[#1C1917] hover:text-white transition shadow cursor-pointer flex items-center gap-1 text-xs"
            >
              <BookOpen size={14} />
            </button>
          </div>

          {/* Read Time & Page Count Strip */}
          <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-md text-[#1C1917] text-[10px] font-medium px-2 py-0.5 rounded-md border border-[#E7DFD5] flex items-center gap-1.5 shadow-xs font-sans">
            <Clock size={11} className="text-[#9A3412]" />
            <span>{product.pages || 380} pgs • ~{estReadTime}</span>
          </div>
        </div>

        {/* Author & Rating */}
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-[#78350F] italic font-medium">
            By {product.author || "Elena Rostova"}
          </span>
          <div className="flex items-center gap-1 text-[#1C1917] bg-[#FAF7F2] px-2 py-0.5 rounded-md border border-[#EFE9DF]">
            <Star size={11} className="text-[#D97706] fill-[#D97706]" />
            <span className="font-sans font-bold text-xs">{product.rating || "5.0"}</span>
            <span className="text-[#8C7A6B] text-[10px] font-sans">({product.reviewCount || 34})</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-[#1C1917] group-hover:text-[#9A3412] transition-colors line-clamp-1 text-left">
          {product.name}
        </h3>

        {/* Excerpt / Description Snippet */}
        <p className="text-xs text-[#574B40] line-clamp-2 leading-relaxed text-left font-sans italic">
          "{product.description || "A sweeping multi-generational saga exploring memory, exile, and architectural marvels."}"
        </p>

        {/* Format Switcher Pills */}
        <div className="pt-1 flex items-center gap-1.5">
          {["Hardcover", "Paperback"].map((fmt) => (
            <button
              key={fmt}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedFormat(fmt);
              }}
              className={`px-2.5 py-1 rounded-lg text-[10px] transition cursor-pointer border ${
                selectedFormat === fmt
                  ? "bg-[#1C1917] text-white border-[#1C1917] font-bold"
                  : "bg-[#FAF7F2] text-[#574B40] border-[#E7DFD5] hover:bg-[#F3EDE3]"
              }`}
            >
              {fmt}
            </button>
          ))}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onLookInside) onLookInside(product);
            }}
            className="ml-auto text-[10px] text-[#9A3412] font-bold hover:underline flex items-center gap-0.5"
          >
            Look Inside →
          </button>
        </div>
      </div>

      {/* Pricing & Add to Cart */}
      <div className="pt-4 mt-3 flex items-center justify-between border-t border-[#EFE9DF] gap-2">
        <div className="text-left">
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg sm:text-xl font-bold text-[#1C1917]">
              ₹{currentPrice.toFixed(2)}
            </span>
            {originalPrice && (
              <span className="text-xs text-[#8C7A6B] line-through font-sans">
                ₹{originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <span className="text-[9px] uppercase tracking-wider text-[#15803D] font-bold block font-sans">
            {outOfStock ? "Reprinting Press" : "In Stock • Ships in 24h"}
          </span>
        </div>

        {outOfStock ? (
          <span className="text-[11px] font-bold text-[#991B1B] bg-[#FEE2E2] px-3 py-1.5 rounded-xl border border-[#FCA5A5]">
            Backorder
          </span>
        ) : (
          <button
            type="button"
            onClick={handleAdd}
            disabled={isAdding}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold tracking-wider transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 ${
              isAdding
                ? "bg-[#15803D] text-white"
                : "bg-[#1C1917] hover:bg-[#292524] text-[#FAF7F2] border border-[#78350F]/40 hover:shadow-md"
            }`}
          >
            {isAdding ? (
              <>
                <Check size={14} className="animate-bounce" />
                <span>Added</span>
              </>
            ) : (
              <>
                <Plus size={14} className="text-[#D97706]" />
                <span>Add</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
