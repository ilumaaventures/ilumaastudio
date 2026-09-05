import React, { useState } from "react";
import {
  Star,
  Plus,
  Check,
  Eye,
  Sparkles,
  ShieldCheck,
  Briefcase,
  Layers,
  Award,
} from "lucide-react";
import { isOutOfStock } from "../../../utils/stockUtils";
import { getProductImage } from "../../../utils/productImage";

export default function ProductCard({
  product,
  onSelectProduct,
  onAddToCart,
  onOpenMonogram,
}) {
  const [monogramChecked, setMonogramChecked] = useState(false);
  const [monogramInitials, setMonogramInitials] = useState("C.C.");
  const [isAdding, setIsAdding] = useState(false);

  if (!product) return null;

  const outOfStock = isOutOfStock(product);
  const price = Number(product.price) || 0;
  const originalPrice = product.compareAtPrice ? Number(product.compareAtPrice) : null;
  const discountPct = originalPrice && originalPrice > price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : null;

  const handleAdd = (e) => {
    e.stopPropagation();
    if (outOfStock) return;
    setIsAdding(true);
    const itemToAdd = {
      ...product,
      customMonogram: monogramChecked ? monogramInitials : null,
      name: monogramChecked ? `${product.name} [Monogram: ${monogramInitials}]` : product.name,
    };
    onAddToCart(itemToAdd, 1);
    setTimeout(() => setIsAdding(false), 900);
  };

  return (
    <div
      onClick={() => onSelectProduct && onSelectProduct(product)}
      className="group relative bg-white rounded-3xl border border-[#E7DFD5] hover:border-[#8C6D58] p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 shadow-[0_4px_20px_rgba(44,24,16,0.04)] hover:shadow-[0_12px_35px_rgba(44,24,16,0.12)] cursor-pointer"
    >
      <div className="space-y-3.5">
        {/* Leather Product Image Container */}
        <div className="aspect-square w-full rounded-2xl overflow-hidden bg-[#FAF7F2] relative border border-[#EFE9DF] group-hover:border-[#D5C7B8] transition-colors">
          <img
            src={getProductImage(product, product.image)}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          {/* Floating Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
            {product.leather && (
              <span className="bg-[#2C1810] text-[#FAF7F2] text-[10px] font-serif font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md shadow-md border border-[#8C6D58]/40">
                {product.leather}
              </span>
            )}
            {discountPct && (
              <span className="bg-[#B45309] text-white text-[9px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm">
                Save {discountPct}%
              </span>
            )}
          </div>

          {/* Quick View Button */}
          <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10">
            <button
              type="button"
              title="Inspect Leather Detail"
              onClick={(e) => {
                e.stopPropagation();
                onSelectProduct(product);
              }}
              className="p-2 rounded-xl bg-white/90 backdrop-blur-md border border-[#D5C7B8] text-[#2C1810] hover:bg-[#2C1810] hover:text-white transition shadow cursor-pointer"
            >
              <Eye size={14} />
            </button>
          </div>

          {/* Capacity or Laptop Fit Tag */}
          <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-md text-[#2C1810] text-[10px] font-serif font-bold px-2 py-0.5 rounded-md border border-[#E7DFD5] flex items-center gap-1 shadow-sm">
            <Briefcase size={11} className="text-[#B45309]" />
            <span>{product.capacity || "Fits 16\" MacBook Pro"}</span>
          </div>
        </div>

        {/* Leather Category & Rating */}
        <div className="flex items-center justify-between text-[11px] font-serif font-bold">
          <span className="text-[#8C6D58] uppercase tracking-widest text-[10px]">
            {product.category || "Full-Grain Leather"}
          </span>
          <div className="flex items-center gap-1 text-[#2C1810] bg-[#FAF7F2] px-2 py-0.5 rounded-md border border-[#EFE9DF]">
            <Star size={11} className="text-[#D97706] fill-[#D97706]" />
            <span className="font-sans font-bold text-xs">{product.rating || "4.9"}</span>
            <span className="text-[#8C6D58] text-[10px] font-sans">({product.reviewCount || 42})</span>
          </div>
        </div>

        {/* Product Title */}
        <h3 className="text-base font-serif font-bold text-[#2C1810] group-hover:text-[#B45309] transition-colors line-clamp-1 text-left">
          {product.name}
        </h3>

        {/* Description Snippet */}
        <p className="text-xs text-[#6B5344] line-clamp-2 leading-relaxed text-left font-sans">
          {product.description || "Handcrafted from vegetable-tanned Tuscan leather with solid brass fittings."}
        </p>

        {/* Atelier Craftsmanship Specs */}
        <div className="bg-[#FAF7F2] p-2.5 rounded-xl border border-[#EFE9DF] space-y-1 text-left text-[10px] font-serif">
          <div className="flex items-center justify-between">
            <span className="text-[#8C6D58]">Hide Origin:</span>
            <span className="text-[#2C1810] font-bold">Santa Croce sull'Arno, Tuscany</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#8C6D58]">Hardware:</span>
            <span className="text-[#2C1810] font-bold">Solid Antique Cast Brass</span>
          </div>
        </div>

        {/* Free Gold Foil Monogram Preview Checkbox */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            setMonogramChecked(!monogramChecked);
          }}
          className="flex items-center justify-between p-2 rounded-xl bg-[#FAF7F2] hover:bg-[#F3EDE3] border border-[#EFE9DF] cursor-pointer transition select-none"
        >
          <div className="flex items-center gap-1.5 text-[11px] text-[#2C1810] font-serif font-medium">
            <Sparkles size={13} className={monogramChecked ? "text-[#B45309]" : "text-[#8C6D58]"} />
            <span>24k Gold Foil Monogram</span>
          </div>
          <span className="text-[10px] font-sans font-bold text-[#B45309]">
            {monogramChecked ? `✓ Stamped [${monogramInitials}]` : "Free Stamping"}
          </span>
        </div>
      </div>

      {/* Pricing & Add to Carry Cart */}
      <div className="pt-4 mt-3 flex items-center justify-between border-t border-[#EFE9DF] gap-2">
        <div className="text-left">
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg sm:text-xl font-serif font-bold text-[#2C1810]">
              ₹{price.toFixed(2)}
            </span>
            {originalPrice && (
              <span className="text-xs text-[#8C6D58] line-through font-sans">
                ₹{originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <span className="text-[9px] uppercase tracking-wider text-[#16A34A] font-bold block font-sans">
            {outOfStock ? "Made to Order" : "In Stock • Ships in 24h"}
          </span>
        </div>

        {outOfStock ? (
          <span className="text-[11px] font-serif font-bold text-[#991B1B] bg-[#FEE2E2] px-3 py-1.5 rounded-xl border border-[#FCA5A5]">
            Backorder
          </span>
        ) : (
          <button
            type="button"
            onClick={handleAdd}
            disabled={isAdding}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-serif font-bold tracking-wider transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 ${
              isAdding
                ? "bg-[#16A34A] text-white"
                : "bg-[#2C1810] hover:bg-[#3D2217] text-[#FAF7F2] border border-[#8C6D58]/40 hover:shadow-md"
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
