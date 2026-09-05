import React, { useState } from "react";
import {
  ArrowLeft,
  Star,
  ShieldCheck,
  Award,
  Sparkles,
  Plus,
  Minus,
  Check,
  ShoppingBag,
  Share2,
  Calendar,
  Gem,
  Lock,
} from "lucide-react";
import toast from "react-hot-toast";
import { isOutOfStock } from "../../../utils/stockUtils";
import { getProductImage } from "../../../utils/productImage";
import ProductCard from "./ProductCard";

export default function ProductDetails({
  product,
  onBack,
  onAddToCart,
  relatedProducts = [],
  onSelectProduct,
  onOpenAppointment,
}) {
  const [quantity, setQuantity] = useState(1);
  const [selectedMetal, setSelectedMetal] = useState("18k Yellow Gold");
  const [selectedRingSize, setSelectedRingSize] = useState("US 6.5");
  const [engravingText, setEngravingText] = useState("Forever • 2026");
  const [includeEngraving, setIncludeEngraving] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!product) return null;

  const outOfStock = isOutOfStock(product);
  const basePrice = Number(product.price) || 0;
  const originalPrice = product.compareAtPrice ? Number(product.compareAtPrice) : null;
  const metalAdjustment = selectedMetal === "Platinum 950" ? 250 : 0;
  const unitPrice = basePrice + metalAdjustment;
  const totalPrice = unitPrice * quantity;

  // Alternate images
  const images = [
    getProductImage(product, product.image),
    "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80",
  ];

  const handleAdd = () => {
    if (outOfStock) return;
    const itemToAdd = {
      ...product,
      metal: selectedMetal,
      ringSize: selectedRingSize,
      price: unitPrice,
      engraving: includeEngraving && engravingText.trim() ? engravingText : null,
      name: `${product.name} [${selectedMetal} • Size ${selectedRingSize}]`,
    };
    onAddToCart(itemToAdd, quantity);
    toast.success(`Acquired ${quantity}x ${itemToAdd.name} for your Jewel Box! 💎`);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("High jewelry creation link copied to clipboard!");
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 text-left font-serif">
      {/* Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#D4AF37]/25 pb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#FBBF24] hover:underline transition cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Return to Precious Vault</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-[#A89F91] font-sans">
          <span>Haute Joaillerie</span>
          <span>/</span>
          <span>{product.category || "Solitaire Creations"}</span>
          <span>/</span>
          <span className="text-[#FAFAFA] font-bold truncate max-w-[200px]">{product.name}</span>
        </div>

        <button
          onClick={handleShare}
          className="p-2 rounded-xl bg-[#141418] border border-[#D4AF37]/40 text-[#FBBF24] hover:bg-[#D4AF37] hover:text-[#0A0A0C] transition cursor-pointer text-xs flex items-center gap-1.5 shadow-sm font-sans"
        >
          <Share2 size={14} />
          <span className="hidden sm:inline">Share Creation</span>
        </button>
      </div>

      {/* Two-Column Creation Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left Column: Macro Gemstone Gallery & Certifications */}
        <div className="lg:col-span-5 space-y-6">
          <div className="aspect-square w-full rounded-3xl overflow-hidden bg-[#070709] border-2 border-[#D4AF37]/30 relative group shadow-2xl">
            <img
              src={images[activeImageIndex] || images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <span className="bg-[#D4AF37] text-[#0A0A0C] text-xs font-sans font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                {selectedMetal}
              </span>
              <span className="bg-[#1C1812]/90 backdrop-blur-md text-[#FBBF24] text-[10px] font-sans font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow border border-[#D4AF37]/40 flex items-center gap-1">
                <Award size={12} /> GIA Dossier Inscribed
              </span>
            </div>

            <div className="absolute bottom-4 left-4 bg-[#0A0A0C]/90 backdrop-blur-md border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-sans font-semibold px-3 py-1 rounded-xl flex items-center gap-1.5 shadow-md">
              <Gem size={14} className="text-[#FBBF24]" />
              <span>{product.carat || "1.50"}ct • Triple Excellent Cut</span>
            </div>
          </div>

          {/* Alternate Angle Thumbnails */}
          <div className="grid grid-cols-3 gap-3">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`aspect-square rounded-2xl overflow-hidden bg-[#0A0A0C] border transition cursor-pointer ${
                  activeImageIndex === idx
                    ? "border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                    : "border-[#D4AF37]/20 opacity-70 hover:opacity-100"
                }`}
              >
                <img src={img} alt={`Angle ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* High Jewelry Quality Seals */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#D4AF37]/20 text-center font-sans">
            <div className="p-3 rounded-2xl bg-[#141418] border border-[#D4AF37]/20 space-y-1">
              <Award size={18} className="mx-auto text-[#FBBF24]" />
              <span className="text-[11px] font-bold text-[#FAFAFA] block">GIA Certified</span>
              <p className="text-[10px] text-[#A89F91]">Laser Inscribed</p>
            </div>
            <div className="p-3 rounded-2xl bg-[#141418] border border-[#D4AF37]/20 space-y-1">
              <ShieldCheck size={18} className="mx-auto text-[#FBBF24]" />
              <span className="text-[11px] font-bold text-[#FAFAFA] block">Armored Delivery</span>
              <p className="text-[10px] text-[#A89F91]">100% Insured Transit</p>
            </div>
            <div className="p-3 rounded-2xl bg-[#141418] border border-[#D4AF37]/20 space-y-1">
              <Lock size={18} className="mx-auto text-[#FBBF24]" />
              <span className="text-[11px] font-bold text-[#FAFAFA] block">Conflict-Free</span>
              <p className="text-[10px] text-[#A89F91]">Kimberley Process</p>
            </div>
          </div>
        </div>

        {/* Right Column: Gemological 4Cs, Precious Alloys & Bespoke Inscription */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold font-sans">
              {product.category || "High Jewelry Solitaire"}
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-[#FAFAFA] tracking-tight leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 pt-1">
              <div className="flex items-center gap-1 text-[#FBBF24]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="fill-[#FBBF24]" />
                ))}
              </div>
              <span className="text-xs font-bold text-[#FAFAFA] font-sans">{product.rating || "5.0"}</span>
              <span className="text-xs text-[#A89F91] font-sans">({product.reviewCount || 28} bespoke reviews)</span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-5 rounded-2xl bg-[#141418] border border-[#D4AF37]/30 flex items-baseline justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-bold text-[#FBBF24] font-sans">
                  ₹{unitPrice.toFixed(2)}
                </span>
                {originalPrice && (
                  <span className="text-sm text-[#78716C] line-through font-sans">
                    ₹{originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#A89F91] mt-1 font-sans">
                Presented in handcrafted black lacquer walnut presentation jewel case.
              </p>
            </div>

            <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-[#0F291E] text-[#34D399] border border-[#059669] font-sans">
              Hand-Set in Geneva
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-[#A89F91] leading-relaxed font-sans">
            {product.description}
          </p>

          {/* Precious Metal Alloy Selector */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#FAFAFA] uppercase tracking-wider block font-sans">
              Precious Metal Alloy: <strong className="text-[#FBBF24]">{selectedMetal}</strong>
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: "18k Yellow Gold", label: "18k Yellow Gold", extra: "Included" },
                { id: "18k White Gold", label: "18k White Gold", extra: "Included" },
                { id: "Platinum 950", label: "Platinum 950", extra: "+₹250" },
                { id: "18k Rose Gold", label: "18k Rose Gold", extra: "Included" },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSelectedMetal(m.id)}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                    selectedMetal === m.id
                      ? "bg-[#1C1812] text-[#FBBF24] border-[#D4AF37] shadow-sm font-bold"
                      : "bg-[#141418] text-[#A89F91] border-[#333] hover:border-[#D4AF37]/50"
                  }`}
                >
                  <span className="text-xs block font-sans">{m.label}</span>
                  <span className="text-[10px] text-[#78716C] font-sans block mt-0.5">{m.extra}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Ring Sizing Selector */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-sans font-bold text-[#FAFAFA]">
              <span>Select Sizing: {selectedRingSize}</span>
              <button
                type="button"
                onClick={() => toast.success("Complimentary brass ring sizing gauge will be shipped to your address.")}
                className="text-[#D4AF37] hover:underline cursor-pointer"
              >
                Need Sizing Assistance?
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {["US 5.0", "US 5.5", "US 6.0", "US 6.5", "US 7.0", "US 7.5", "US 8.0", "Bespoke Size"].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSelectedRingSize(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-sans transition cursor-pointer border ${
                    selectedRingSize === s
                      ? "bg-[#D4AF37] text-[#0A0A0C] font-black border-[#D4AF37]"
                      : "bg-[#141418] text-[#A89F91] border-[#333] hover:text-white"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Complimentary Laser Inscription Tool */}
          <div className="p-4 rounded-2xl bg-[#141418] border border-[#D4AF37]/25 space-y-3 font-sans">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={15} className="text-[#FBBF24]" />
                <span className="text-xs font-bold text-[#FAFAFA] uppercase">
                  Bespoke Inner-Band Laser Inscription
                </span>
              </div>
              <label className="flex items-center gap-1.5 text-xs text-[#A89F91] cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeEngraving}
                  onChange={(e) => setIncludeEngraving(e.target.checked)}
                  className="accent-[#D4AF37] rounded"
                />
                <span>Include Engraving</span>
              </label>
            </div>

            {includeEngraving && (
              <input
                type="text"
                maxLength={24}
                value={engravingText}
                onChange={(e) => setEngravingText(e.target.value)}
                placeholder="Forever & Always • 2026"
                className="w-full bg-[#0E0E12] text-xs text-[#FAFAFA] px-3.5 py-2 rounded-xl border border-[#D4AF37]/40 focus:border-[#FBBF24] focus:outline-none font-serif tracking-wider"
              />
            )}
          </div>

          {/* Gemological 4Cs Breakdown Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-[#141418] border border-[#D4AF37]/25 text-center font-sans">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#A89F91] block">Carat</span>
              <span className="text-sm font-bold text-[#FBBF24]">{product.carat || "1.50"} ct</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#A89F91] block">Color</span>
              <span className="text-sm font-bold text-[#FAFAFA]">D-E Colorless</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#A89F91] block">Clarity</span>
              <span className="text-sm font-bold text-[#FAFAFA]">VVS1 Eye Clean</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#A89F91] block">Cut</span>
              <span className="text-sm font-bold text-[#34D399]">Triple Ex GIA</span>
            </div>
          </div>

          {/* Quantity & Ordering Actions */}
          <div className="pt-2 space-y-4 font-sans">
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-[#141418] border border-[#D4AF37]/40 rounded-2xl p-1 shadow-sm">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-[#A89F91] hover:text-white transition cursor-pointer"
                >
                  <Minus size={14} />
                </button>
                <span className="w-12 text-center text-sm font-bold text-[#FAFAFA]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 text-[#A89F91] hover:text-white transition cursor-pointer"
                >
                  <Plus size={14} />
                </button>
              </div>

              {onOpenAppointment && (
                <button
                  type="button"
                  onClick={onOpenAppointment}
                  className="px-4 py-3 rounded-2xl border border-[#D4AF37]/40 text-xs font-serif font-bold text-[#FBBF24] hover:bg-[#1C1812] transition cursor-pointer flex items-center gap-2"
                >
                  <Calendar size={14} />
                  <span>Book Geneva Salon Appointment</span>
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={handleAdd}
              disabled={outOfStock}
              className={`w-full py-4 rounded-2xl font-serif font-bold text-sm uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-xl active:scale-98 ${
                outOfStock
                  ? "bg-[#222] text-[#666] cursor-not-allowed"
                  : "bg-gradient-to-r from-[#D4AF37] via-[#B8922C] to-[#8C6D1F] hover:from-[#E5C158] hover:to-[#A37B24] text-[#0A0A0C] font-black shadow-[0_0_25px_rgba(212,175,55,0.3)]"
              }`}
            >
              <ShoppingBag size={18} />
              <span>
                {outOfStock ? "Creation Acquired" : `Acquire Creation • ₹${totalPrice.toFixed(2)}`}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Related Creations */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="pt-12 border-t border-[#D4AF37]/25 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-black text-[#FAFAFA]">Complementary High Jewelry Creations</h3>
            <span className="text-xs text-[#D4AF37] font-sans">Harmonious Pave Suite</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts
              .filter((p) => p._id !== product._id)
              .slice(0, 4)
              .map((item) => (
                <ProductCard
                  key={item._id}
                  product={item}
                  onSelectProduct={onSelectProduct}
                  onAddToCart={onAddToCart}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
