import React, { useState } from "react";
import {
  Star,
  Plus,
  Check,
  Eye,
  Sparkles,
  Award,
  ShieldCheck,
  Gem,
} from "lucide-react";
import { isOutOfStock } from "../../../utils/stockUtils";
import { getProductImage } from "../../../utils/productImage";

export default function ProductCard({
  product,
  onSelectProduct,
  onAddToCart,
}) {
  const [selectedMetal, setSelectedMetal] = useState("18k Yellow Gold");
  const [engravingChecked, setEngravingChecked] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  if (!product) return null;

  const outOfStock = isOutOfStock(product);
  const basePrice = Number(product.price) || 0;
  const originalPrice = product.compareAtPrice ? Number(product.compareAtPrice) : null;
  const metalAdjustment = selectedMetal === "Platinum 950" ? 250 : 0;
  const currentPrice = basePrice + metalAdjustment;

  const handleAdd = (e) => {
    e.stopPropagation();
    if (outOfStock) return;
    setIsAdding(true);
    const itemToAdd = {
      ...product,
      metal: selectedMetal,
      price: currentPrice,
      engraving: engravingChecked ? "Complimentary Laser Engraving Included" : null,
      name: `${product.name} [${selectedMetal}]`,
    };
    onAddToCart(itemToAdd, 1);
    setTimeout(() => setIsAdding(false), 900);
  };

  return (
    <div
      onClick={() => onSelectProduct && onSelectProduct(product)}
      className="group relative bg-[#0E0E12] rounded-3xl border border-[#D4AF37]/25 hover:border-[#D4AF37] p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 shadow-[0_4px_25px_rgba(0,0,0,0.5)] hover:shadow-[0_10px_40px_rgba(212,175,55,0.15)] cursor-pointer font-serif"
    >
      <div className="space-y-3.5">
        {/* Jewel Box Visual Container */}
        <div className="aspect-square w-full rounded-2xl overflow-hidden bg-[#070709] relative border border-[#D4AF37]/15 group-hover:border-[#D4AF37]/40 transition-colors">
          <img
            src={getProductImage(product, product.image)}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
          />

          {/* Floating Luxury Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
            {product.carat && (
              <span className="bg-[#D4AF37] text-[#0A0A0C] text-[10px] font-sans font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-md">
                {product.carat} Carat
              </span>
            )}
            {product.badge && (
              <span className="bg-[#1C1812]/90 backdrop-blur-md text-[#FBBF24] text-[9px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs border border-[#D4AF37]/40 w-fit">
                {product.badge}
              </span>
            )}
          </div>

          {/* Quick Inspect Button */}
          <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10">
            <button
              type="button"
              title="Inspect Diamond Facets"
              onClick={(e) => {
                e.stopPropagation();
                onSelectProduct(product);
              }}
              className="p-2 rounded-xl bg-[#131317]/90 backdrop-blur-md border border-[#D4AF37]/40 text-[#FBBF24] hover:bg-[#D4AF37] hover:text-[#0A0A0C] transition shadow cursor-pointer"
            >
              <Eye size={14} />
            </button>
          </div>

          {/* Diamond Specs Micro-Tag */}
          <div className="absolute bottom-2 left-2 bg-[#0A0A0C]/90 backdrop-blur-md text-[#D4AF37] text-[10px] font-sans font-semibold px-2 py-0.5 rounded-lg border border-[#D4AF37]/30 flex items-center gap-1 shadow-sm">
            <Award size={11} className="text-[#FBBF24]" />
            <span>{product.cut || "Triple Excellent Cut • GIA Verified"}</span>
          </div>
        </div>

        {/* Category & Review */}
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-[#D4AF37] uppercase tracking-widest text-[10px] font-sans">
            {product.category || "High Jewelry"}
          </span>
          <div className="flex items-center gap-1 text-[#FAFAFA] bg-[#15151A] px-2 py-0.5 rounded-md border border-[#D4AF37]/20">
            <Star size={11} className="text-[#FBBF24] fill-[#FBBF24]" />
            <span className="font-sans font-bold text-xs">{product.rating || "5.0"}</span>
            <span className="text-[#78716C] text-[10px] font-sans">({product.reviewCount || 28})</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-[#FAFAFA] group-hover:text-[#FBBF24] transition-colors line-clamp-1 text-left">
          {product.name}
        </h3>

        {/* Description Snippet */}
        <p className="text-xs text-[#A89F91] line-clamp-2 leading-relaxed text-left font-sans">
          {product.description || "Individually handset in Geneva using unheated gemstones and certified conflict-free diamonds."}
        </p>

        {/* Precious Metal Alloy Switcher Pills */}
        <div className="bg-[#141418] p-2 rounded-xl border border-[#D4AF37]/20 space-y-1.5 text-left">
          <span className="text-[10px] text-[#A89F91] font-sans uppercase font-bold block">
            Precious Alloy: <strong className="text-[#FBBF24]">{selectedMetal}</strong>
          </span>
          <div className="flex flex-wrap gap-1">
            {["18k Yellow Gold", "18k White Gold", "Platinum 950"].map((alloy) => (
              <button
                key={alloy}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedMetal(alloy);
                }}
                className={`px-2 py-0.5 rounded-md text-[9px] font-sans transition cursor-pointer border ${
                  selectedMetal === alloy
                    ? "bg-[#D4AF37] text-[#0A0A0C] font-black border-[#D4AF37]"
                    : "bg-[#0A0A0C] text-[#A89F91] border-[#333] hover:text-white"
                }`}
              >
                {alloy}
              </button>
            ))}
          </div>
        </div>

        {/* Complimentary Laser Engraving Checkbox */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            setEngravingChecked(!engravingChecked);
          }}
          className="flex items-center justify-between p-2 rounded-xl bg-[#141418] hover:bg-[#1A1A22] border border-[#D4AF37]/20 cursor-pointer transition select-none"
        >
          <div className="flex items-center gap-1.5 text-[11px] text-[#FAFAFA] font-sans">
            <Sparkles size={13} className={engravingChecked ? "text-[#FBBF24]" : "text-[#78716C]"} />
            <span>Complimentary Laser Engraving</span>
          </div>
          <span className="text-[10px] font-sans font-bold text-[#FBBF24]">
            {engravingChecked ? "✓ Included" : "Free"}
          </span>
        </div>
      </div>

      {/* Pricing & Add to Cart Footer */}
      <div className="pt-4 mt-3 flex items-center justify-between border-t border-[#D4AF37]/20 gap-2">
        <div className="text-left">
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg sm:text-xl font-bold text-[#FBBF24] font-sans">
              ₹{currentPrice.toFixed(2)}
            </span>
            {originalPrice && (
              <span className="text-xs text-[#78716C] line-through font-sans">
                ₹{originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <span className="text-[9px] uppercase tracking-wider text-[#10B981] font-bold block font-sans">
            {outOfStock ? "Bespoke Request" : "In Vault • Insured Armored Delivery"}
          </span>
        </div>

        {outOfStock ? (
          <span className="text-[11px] font-bold text-[#F87171] bg-[#450A0A] px-3 py-1.5 rounded-xl border border-[#991B1B]">
            Acquired
          </span>
        ) : (
          <button
            type="button"
            onClick={handleAdd}
            disabled={isAdding}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold tracking-wider transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95 ${
              isAdding
                ? "bg-[#10B981] text-white"
                : "bg-gradient-to-r from-[#D4AF37] to-[#AA771C] hover:from-[#E5C158] hover:to-[#B88622] text-[#0A0A0C] font-black shadow-[0_0_15px_rgba(212,175,55,0.25)]"
            }`}
          >
            {isAdding ? (
              <>
                <Check size={14} className="animate-bounce" />
                <span>Acquired</span>
              </>
            ) : (
              <>
                <Plus size={14} />
                <span>Acquire</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
