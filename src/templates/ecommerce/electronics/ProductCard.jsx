import React, { useState } from "react";
import {
  Star,
  Plus,
  Check,
  Eye,
  SlidersHorizontal,
  Battery,
  Radio,
  Cpu,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { isOutOfStock } from "../../../utils/stockUtils";
import { getProductImage } from "../../../utils/productImage";

export default function ProductCard({
  product,
  onSelectProduct,
  onAddToCart,
  onToggleCompare,
  isCompared = false,
}) {
  const [warrantyChecked, setWarrantyChecked] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  if (!product) return null;

  const outOfStock = isOutOfStock(product);
  const finalPrice = Number(product.price) || 0;
  const originalPrice = product.compareAtPrice ? Number(product.compareAtPrice) : null;
  const discountPct = originalPrice && originalPrice > finalPrice
    ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100)
    : null;

  const handleAdd = (e) => {
    e.stopPropagation();
    if (outOfStock) return;
    setIsAdding(true);
    onAddToCart(product, 1, warrantyChecked ? "2year" : null);
    setTimeout(() => setIsAdding(false), 900);
  };

  return (
    <div
      onClick={() => onSelectProduct && onSelectProduct(product)}
      className="group relative bg-[#0B1120]/90 hover:bg-[#0F172A] rounded-3xl border border-slate-800 hover:border-cyan-500/50 p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_10px_35px_rgba(6,182,212,0.15)] cursor-pointer"
    >
      {/* Top Media & Floating Cyber Badges */}
      <div className="space-y-3.5">
        <div className="aspect-square w-full rounded-2xl overflow-hidden bg-slate-950 relative border border-slate-800/80 group-hover:border-cyan-500/30 transition-colors">
          <img
            src={getProductImage(product, product.image)}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          {/* Top Badge: Discount or Feature Tag */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
            {product.badge && (
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md shadow-md border border-cyan-400/30">
                {product.badge}
              </span>
            )}
            {discountPct && (
              <span className="bg-rose-500/90 backdrop-blur-sm text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm border border-rose-400/30 w-fit">
                {discountPct}% OFF
              </span>
            )}
          </div>

          {/* Quick Action Floating Controls */}
          <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10 translate-x-2 group-hover:translate-x-0">
            {onToggleCompare && (
              <button
                type="button"
                title={isCompared ? "Remove from comparison" : "Compare specs"}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleCompare(product);
                }}
                className={`p-2 rounded-xl backdrop-blur-md border text-xs transition cursor-pointer ${
                  isCompared
                    ? "bg-cyan-500 text-slate-950 border-cyan-400 font-bold shadow-md"
                    : "bg-slate-900/85 text-slate-300 border-slate-700 hover:text-cyan-300 hover:border-cyan-500"
                }`}
              >
                <SlidersHorizontal size={14} />
              </button>
            )}

            <button
              type="button"
              title="Quick inspect"
              onClick={(e) => {
                e.stopPropagation();
                onSelectProduct(product);
              }}
              className="p-2 rounded-xl bg-slate-900/85 backdrop-blur-md border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 text-xs transition cursor-pointer"
            >
              <Eye size={14} />
            </button>
          </div>

          {/* Battery or Spec Tag overlay at bottom */}
          {product.batteryLifeHours && product.batteryLifeHours > 0 && (
            <div className="absolute bottom-2 left-2 bg-slate-950/85 backdrop-blur-md text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-lg border border-emerald-500/30 flex items-center gap-1">
              <Battery size={11} className="text-emerald-400" />
              <span>{product.batteryLifeHours}h Battery</span>
            </div>
          )}
        </div>

        {/* Category & Rating */}
        <div className="flex items-center justify-between text-[11px] font-bold">
          <span className="text-cyan-400 uppercase tracking-widest text-[10px] font-mono">
            {product.category || "Hardware"}
          </span>
          <div className="flex items-center gap-1 text-slate-300 bg-slate-900/80 px-2 py-0.5 rounded-lg border border-slate-800">
            <Star size={12} className="text-amber-400 fill-amber-400" />
            <span className="text-white font-black">{product.rating || "4.9"}</span>
            <span className="text-slate-500 text-[10px]">({product.reviewCount || 38})</span>
          </div>
        </div>

        {/* Product Title */}
        <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1 text-left">
          {product.name}
        </h3>

        {/* Description snippet */}
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed text-left">
          {product.description || "Precision engineered high-performance electronics with custom silicon tuning."}
        </p>

        {/* Hardware Spec Micro-Pills */}
        <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80 space-y-1 text-left">
          {product.driverSize && (
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-slate-500 font-medium">Core Architecture:</span>
              <span className="text-cyan-300 font-mono font-bold truncate max-w-[140px]">
                {product.driverSize}
              </span>
            </div>
          )}
          {product.ancDb && (
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-slate-500 font-medium">Isolation / Tech:</span>
              <span className="text-slate-300 font-mono truncate max-w-[140px]">
                {product.ancDb}
              </span>
            </div>
          )}
        </div>

        {/* TechShield Extended Warranty checkbox option */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            setWarrantyChecked(!warrantyChecked);
          }}
          className="flex items-center justify-between p-2 rounded-xl bg-slate-900/40 hover:bg-slate-900 border border-slate-800 cursor-pointer transition select-none"
        >
          <div className="flex items-center gap-1.5 text-[10px] text-slate-300 font-medium">
            <ShieldCheck size={13} className={warrantyChecked ? "text-cyan-400" : "text-slate-500"} />
            <span>TechShield 2-Yr Warranty</span>
          </div>
          <span className="text-[10px] font-mono font-bold text-cyan-400">
            {warrantyChecked ? "✓ Included (+₹39)" : "+₹39"}
          </span>
        </div>
      </div>

      {/* Pricing & Add to Cart Footer */}
      <div className="pt-4 mt-2 flex items-center justify-between border-t border-slate-800/80 gap-2">
        <div className="text-left">
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg sm:text-xl font-black text-white font-mono">
              ₹{(finalPrice + (warrantyChecked ? 39 : 0)).toFixed(2)}
            </span>
            {originalPrice && (
              <span className="text-xs text-slate-500 line-through font-mono">
                ₹{originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <span className="text-[9px] uppercase tracking-wider text-emerald-400 font-bold block font-mono">
            {outOfStock ? "Restocking Soon" : "Ready For Dispatch"}
          </span>
        </div>

        {outOfStock ? (
          <span className="text-[11px] font-bold text-rose-400 bg-rose-950/40 border border-rose-900/60 px-3 py-1.5 rounded-xl">
            Sold Out
          </span>
        ) : (
          <button
            type="button"
            onClick={handleAdd}
            disabled={isAdding}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95 ${
              isAdding
                ? "bg-emerald-600 text-white border border-emerald-400"
                : "bg-blue-600 hover:bg-blue-500 text-white border border-blue-400/30 hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]"
            }`}
          >
            {isAdding ? (
              <>
                <Check size={14} className="animate-bounce" />
                <span>Added!</span>
              </>
            ) : (
              <>
                <Plus size={14} className="text-cyan-200" />
                <span>Add</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
