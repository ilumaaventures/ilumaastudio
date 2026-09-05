import React, { useState } from "react";
import {
  Star,
  Plus,
  Check,
  Eye,
  Sparkles,
  Droplets,
  Heart,
  Repeat,
  ShieldCheck,
} from "lucide-react";
import { isOutOfStock } from "../../../utils/stockUtils";
import { getProductImage } from "../../../utils/productImage";

export default function ProductCard({
  product,
  onSelectProduct,
  onAddToCart,
}) {
  const [subscribeChecked, setSubscribeChecked] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  if (!product) return null;

  const outOfStock = isOutOfStock(product);
  const basePrice = Number(product.price) || 0;
  const originalPrice = product.compareAtPrice ? Number(product.compareAtPrice) : null;
  // If subscribed, 15% discount
  const finalPrice = subscribeChecked ? basePrice * 0.85 : basePrice;

  const handleAdd = (e) => {
    e.stopPropagation();
    if (outOfStock) return;
    setIsAdding(true);
    const itemToAdd = {
      ...product,
      price: finalPrice,
      isSubscription: subscribeChecked,
      name: subscribeChecked ? `${product.name} (Auto-Replenish 60-Day)` : product.name,
    };
    onAddToCart(itemToAdd, 1);
    setTimeout(() => setIsAdding(false), 900);
  };

  return (
    <div
      onClick={() => onSelectProduct && onSelectProduct(product)}
      className="group relative bg-white rounded-3xl border border-rose-100 hover:border-rose-300 p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 shadow-[0_4px_20px_rgba(244,63,94,0.04)] hover:shadow-[0_12px_30px_rgba(244,63,94,0.12)] cursor-pointer"
    >
      <div className="space-y-3.5">
        {/* Product Media */}
        <div className="aspect-square w-full rounded-2xl overflow-hidden bg-[#FFF8F8] relative border border-rose-50 group-hover:border-rose-200 transition-colors">
          <img
            src={getProductImage(product, product.image)}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          {/* Floating Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
            {product.badge && (
              <span className="bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-sm">
                {product.badge}
              </span>
            )}
            {product.activeIngredient && (
              <span className="bg-white/95 backdrop-blur-md text-rose-800 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs border border-rose-100 w-fit">
                {product.activeIngredient}
              </span>
            )}
          </div>

          {/* Quick Inspect Button */}
          <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10">
            <button
              type="button"
              title="Inspect Clinical Formula"
              onClick={(e) => {
                e.stopPropagation();
                onSelectProduct(product);
              }}
              className="p-2 rounded-xl bg-white/90 backdrop-blur-md border border-rose-200 text-rose-700 hover:bg-rose-500 hover:text-white transition shadow-sm cursor-pointer"
            >
              <Eye size={14} />
            </button>
          </div>

          {/* Routine Step Pill */}
          <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-md text-rose-900 text-[10px] font-medium px-2 py-0.5 rounded-lg border border-rose-100 flex items-center gap-1 shadow-xs">
            <Droplets size={11} className="text-rose-500" />
            <span>{product.step || "Routine Step 3 • Treatment"}</span>
          </div>
        </div>

        {/* Category & Rating */}
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-rose-500 uppercase tracking-wider font-bold text-[10px]">
            {product.category || "Active Botanical"}
          </span>
          <div className="flex items-center gap-1 text-rose-900 bg-rose-50/80 px-2 py-0.5 rounded-lg border border-rose-100">
            <Star size={11} className="text-amber-400 fill-amber-400" />
            <span className="font-bold text-xs">{product.rating || "4.9"}</span>
            <span className="text-rose-400 text-[10px]">({product.reviewCount || 54})</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base font-serif font-bold text-rose-950 group-hover:text-rose-600 transition-colors line-clamp-1 text-left">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-xs text-rose-800/80 line-clamp-2 leading-relaxed text-left">
          {product.description || "Concentrated botanical actives restoring barrier vitality and youthful glow."}
        </p>

        {/* Key Ingredients & Skin Concerns */}
        <div className="bg-rose-50/60 p-2.5 rounded-xl border border-rose-100/80 space-y-1 text-left text-[10px]">
          <div className="flex items-center justify-between">
            <span className="text-rose-500 font-medium">Target Concern:</span>
            <span className="text-rose-950 font-bold">{product.concern || "Hydration & Barrier Defense"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-rose-500 font-medium">Skin Compatibility:</span>
            <span className="text-rose-800 font-medium">All Types, Sensitive Friendly</span>
          </div>
        </div>

        {/* Auto-Replenish Save 15% Toggle */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            setSubscribeChecked(!subscribeChecked);
          }}
          className="flex items-center justify-between p-2 rounded-xl bg-gradient-to-r from-rose-50 to-pink-50 hover:from-rose-100 hover:to-pink-100 border border-rose-200/80 cursor-pointer transition select-none"
        >
          <div className="flex items-center gap-1.5 text-[11px] text-rose-900 font-medium">
            <Repeat size={13} className={subscribeChecked ? "text-rose-600" : "text-rose-400"} />
            <span>Auto-Replenish (Every 60 Days)</span>
          </div>
          <span className="text-[10px] font-bold text-rose-600 bg-white px-1.5 py-0.5 rounded shadow-xs">
            {subscribeChecked ? "✓ Save 15%" : "Save 15%"}
          </span>
        </div>
      </div>

      {/* Pricing & Add to Bag Footer */}
      <div className="pt-4 mt-3 flex items-center justify-between border-t border-rose-100 gap-2">
        <div className="text-left">
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg sm:text-xl font-bold text-rose-950 font-serif">
              ₹{finalPrice.toFixed(2)}
            </span>
            {(subscribeChecked || originalPrice) && (
              <span className="text-xs text-rose-400 line-through">
                ₹{(originalPrice || basePrice).toFixed(2)}
              </span>
            )}
          </div>
          <span className="text-[9px] uppercase tracking-wider text-emerald-600 font-bold block">
            {outOfStock ? "Sold Out" : "In Stock • Clean Formula"}
          </span>
        </div>

        {outOfStock ? (
          <span className="text-[11px] font-bold text-rose-500 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200">
            Waitlist
          </span>
        ) : (
          <button
            type="button"
            onClick={handleAdd}
            disabled={isAdding}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 ${
              isAdding
                ? "bg-emerald-600 text-white"
                : "bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white shadow-rose-300/40"
            }`}
          >
            {isAdding ? (
              <>
                <Check size={14} className="animate-bounce" />
                <span>Added!</span>
              </>
            ) : (
              <>
                <Plus size={14} />
                <span>Add to Bag</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
