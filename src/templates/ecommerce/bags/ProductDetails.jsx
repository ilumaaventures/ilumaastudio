import React, { useState } from "react";
import {
  ArrowLeft,
  Star,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Award,
  Briefcase,
  Plus,
  Minus,
  Check,
  ShoppingBag,
  Share2,
  Layers,
  Feather,
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
}) {
  const [quantity, setQuantity] = useState(1);
  const [selectedLeather, setSelectedLeather] = useState(product?.leather || "Vachetta Tan");
  const [monogramText, setMonogramText] = useState("J.V.");
  const [monogramFoil, setMonogramFoil] = useState("Gold"); // "Gold" | "Silver" | "Blind"
  const [enableMonogram, setEnableMonogram] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!product) return null;

  const outOfStock = isOutOfStock(product);
  const basePrice = Number(product.price) || 0;
  const originalPrice = product.compareAtPrice ? Number(product.compareAtPrice) : null;
  const totalPrice = basePrice * quantity;

  // Multi-angle gallery
  const images = [
    getProductImage(product, product.image),
    "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
  ];

  const handleAdd = () => {
    if (outOfStock) return;
    const itemToAdd = {
      ...product,
      leather: selectedLeather,
      monogram: enableMonogram && monogramText.trim() ? `${monogramText} (${monogramFoil})` : null,
      name: enableMonogram && monogramText.trim()
        ? `${product.name} [Monogram: ${monogramText} - ${monogramFoil}]`
        : product.name,
    };
    onAddToCart(itemToAdd, quantity);
    toast.success(`Added ${quantity}x ${itemToAdd.name} to Carry Cart! 🧳`);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Bag silhouette link copied to clipboard!");
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 text-left font-serif">
      {/* Breadcrumb & Back */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E7DFD5] pb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#B45309] hover:text-[#92400E] transition cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Return to Atelier Lineup</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-[#8C6D58]">
          <span>Heritage Atelier</span>
          <span>/</span>
          <span>{product.category || "Leather Carry"}</span>
          <span>/</span>
          <span className="text-[#2C1810] font-bold truncate max-w-[200px]">{product.name}</span>
        </div>

        <button
          onClick={handleShare}
          className="p-2 rounded-xl bg-white border border-[#D5C7B8] text-[#2C1810] hover:bg-[#FAF7F2] transition cursor-pointer text-xs flex items-center gap-1.5 shadow-sm"
        >
          <Share2 size={14} />
          <span className="hidden sm:inline">Share Silhouette</span>
        </button>
      </div>

      {/* Two-Column Atelier Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left Column: Visuals & Leather Seals */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-square w-full rounded-3xl overflow-hidden bg-[#FAF7F2] border border-[#E7DFD5] relative group shadow-lg">
            <img
              src={images[activeImageIndex] || images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <span className="bg-[#2C1810] text-[#FAF7F2] text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md border border-[#8C6D58]/40">
                {selectedLeather}
              </span>
              <span className="bg-[#D97706] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow flex items-center gap-1">
                <Award size={12} /> Pelle Conciata al Vegetale
              </span>
            </div>

            {/* Live Monogram Stamp Tag Preview on the bag */}
            {enableMonogram && monogramText.trim() && (
              <div className="absolute bottom-4 right-4 bg-[#2C1810]/95 backdrop-blur-md border border-[#8C6D58] p-3 rounded-2xl shadow-xl flex items-center gap-2">
                <Sparkles size={14} className="text-[#FBBF24]" />
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-[#D5C7B8] block">
                    {monogramFoil} Foil Stamping
                  </span>
                  <span className={`text-base font-serif font-black tracking-widest block ${
                    monogramFoil === "Gold"
                      ? "text-[#FBBF24]"
                      : monogramFoil === "Silver"
                      ? "text-slate-200"
                      : "text-[#8C6D58]"
                  }`}>
                    [{monogramText.toUpperCase()}]
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Alternate Gallery Angle Buttons */}
          <div className="grid grid-cols-3 gap-3">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`aspect-video rounded-2xl overflow-hidden bg-[#FAF7F2] border transition cursor-pointer ${
                  activeImageIndex === idx
                    ? "border-[#B45309] shadow-md"
                    : "border-[#E7DFD5] opacity-70 hover:opacity-100"
                }`}
              >
                <img src={img} alt={`Angle ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* Italian Guild Seals */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#E7DFD5] text-center">
            <div className="p-3 rounded-2xl bg-white border border-[#E7DFD5] space-y-1">
              <Award size={18} className="mx-auto text-[#B45309]" />
              <span className="text-[11px] font-bold text-[#2C1810] block">Tuscan Certified</span>
              <p className="text-[10px] text-[#6B5344] font-sans">Natural bark tanning</p>
            </div>
            <div className="p-3 rounded-2xl bg-white border border-[#E7DFD5] space-y-1">
              <ShieldCheck size={18} className="mx-auto text-[#B45309]" />
              <span className="text-[11px] font-bold text-[#2C1810] block">Lifetime Guarantee</span>
              <p className="text-[10px] text-[#6B5344] font-sans">Hardware & stitching</p>
            </div>
            <div className="p-3 rounded-2xl bg-white border border-[#E7DFD5] space-y-1">
              <Feather size={18} className="mx-auto text-[#B45309]" />
              <span className="text-[11px] font-bold text-[#2C1810] block">Living Patina</span>
              <p className="text-[10px] text-[#6B5344] font-sans">Becomes richer over time</p>
            </div>
          </div>
        </div>

        {/* Right Column: Specifications, Bespoke Monogram & Checkout */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest text-[#B45309] font-bold">
              {product.category || "Full-Grain Leather Silhouette"}
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-[#2C1810] tracking-tight leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 pt-1">
              <div className="flex items-center gap-1 text-[#D97706]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="fill-[#D97706]" />
                ))}
              </div>
              <span className="text-xs font-bold text-[#2C1810] font-sans">{product.rating || "4.9"}</span>
              <span className="text-xs text-[#8C6D58] font-sans">({product.reviewCount || 42} verified owners)</span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E7DFD5] flex items-baseline justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-bold text-[#2C1810]">
                  ₹{basePrice.toFixed(2)}
                </span>
                {originalPrice && (
                  <span className="text-sm text-[#8C6D58] line-through font-sans">
                    ₹{originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#6B5344] mt-1 font-sans">
                Complimentary global air shipping & wooden presentation box.
              </p>
            </div>

            <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC] font-sans">
              Handcrafted in Tuscany
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-[#6B5344] leading-relaxed font-sans">
            {product.description}
          </p>

          {/* Leather Swatch Selector */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#2C1810] uppercase tracking-wider block">
              Tuscan Leather Finish: <strong className="text-[#B45309]">{selectedLeather}</strong>
            </span>
            <div className="flex flex-wrap gap-2">
              {["Vachetta Tan", "Cognac Brown", "Obsidian Black", "Heritage Olive"].map((shade) => (
                <button
                  key={shade}
                  type="button"
                  onClick={() => setSelectedLeather(shade)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-serif transition cursor-pointer border ${
                    selectedLeather === shade
                      ? "bg-[#2C1810] text-white border-[#2C1810] shadow-sm font-bold"
                      : "bg-white text-[#6B5344] border-[#E7DFD5] hover:bg-[#FAF7F2]"
                  }`}
                >
                  {shade}
                </button>
              ))}
            </div>
          </div>

          {/* BESPOKE MONOGRAMMING STUDIO WIDGET */}
          <div className="p-5 rounded-2xl bg-white border border-[#E7DFD5] space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-[#B45309]" />
                <span className="text-xs font-bold text-[#2C1810] uppercase tracking-wider">
                  Complimentary 24k Hot-Foil Monogramming
                </span>
              </div>
              <label className="flex items-center gap-1.5 text-xs text-[#2C1810] cursor-pointer font-sans">
                <input
                  type="checkbox"
                  checked={enableMonogram}
                  onChange={(e) => setEnableMonogram(e.target.checked)}
                  className="accent-[#B45309] rounded"
                />
                <span>Include Monogram</span>
              </label>
            </div>

            {enableMonogram && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#8C6D58] mb-1 font-sans">
                    Initials (Max 3 Characters)
                  </label>
                  <input
                    type="text"
                    maxLength={3}
                    value={monogramText}
                    onChange={(e) => setMonogramText(e.target.value)}
                    placeholder="J.V."
                    className="w-full bg-[#FAF7F2] text-xs font-serif font-black uppercase text-[#2C1810] px-3.5 py-2 rounded-xl border border-[#D5C7B8] focus:border-[#B45309] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#8C6D58] mb-1 font-sans">
                    Foil Stamping Style
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {["Gold", "Silver", "Blind"].map((foil) => (
                      <button
                        key={foil}
                        type="button"
                        onClick={() => setMonogramFoil(foil)}
                        className={`py-1.5 rounded-lg text-xs font-serif transition cursor-pointer border ${
                          monogramFoil === foil
                            ? "bg-[#2C1810] text-white border-[#2C1810] font-bold"
                            : "bg-[#FAF7F2] text-[#6B5344] border-[#E7DFD5]"
                        }`}
                      >
                        {foil}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Compartment & Dimensions Breakdown */}
          <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-[#FAF7F2] border border-[#E7DFD5] text-xs">
            <div className="space-y-0.5">
              <span className="text-[#8C6D58] text-[10px] uppercase block font-sans">Laptop Fitting</span>
              <span className="text-[#2C1810] font-bold">{product.capacity || "Fits up to 16\" MacBook Pro"}</span>
            </div>
            <div className="space-y-0.5">
              <span className="text-[#8C6D58] text-[10px] uppercase block font-sans">Hardware Fittings</span>
              <span className="text-[#2C1810] font-bold">Solid Antique Cast Brass</span>
            </div>
            <div className="space-y-0.5">
              <span className="text-[#8C6D58] text-[10px] uppercase block font-sans">Hide Thickness</span>
              <span className="text-[#2C1810] font-bold">6 oz (2.4mm) Full-Grain</span>
            </div>
            <div className="space-y-0.5">
              <span className="text-[#8C6D58] text-[10px] uppercase block font-sans">Trolley Pass-Through</span>
              <span className="text-[#2C1810] font-bold">Integrated Back Luggage Strap</span>
            </div>
          </div>

          {/* Quantity & Add to Cart */}
          <div className="pt-2 space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-white border border-[#D5C7B8] rounded-2xl p-1 shadow-sm">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-[#8C6D58] hover:text-[#2C1810] transition cursor-pointer"
                >
                  <Minus size={14} />
                </button>
                <span className="w-12 text-center text-sm font-sans font-bold text-[#2C1810]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 text-[#8C6D58] hover:text-[#2C1810] transition cursor-pointer"
                >
                  <Plus size={14} />
                </button>
              </div>

              <div className="text-xs text-[#6B5344] font-sans">
                Includes complimentary beeswax conditioning balm & cotton dust bag.
              </div>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              disabled={outOfStock}
              className={`w-full py-4 rounded-2xl font-serif font-bold text-sm uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-98 ${
                outOfStock
                  ? "bg-[#D5C7B8] text-[#8C6D58] cursor-not-allowed"
                  : "bg-[#2C1810] hover:bg-[#3D2217] text-[#FAF7F2] border border-[#8C6D58]/40 hover:shadow-xl"
              }`}
            >
              <ShoppingBag size={18} className="text-[#D97706]" />
              <span>
                {outOfStock ? "Made to Order" : `Add to Carry Cart • ₹${totalPrice.toFixed(2)}`}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Related Silhouettes */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="pt-12 border-t border-[#E7DFD5] space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-black text-[#2C1810]">Complementary Travel Silhouettes</h3>
            <span className="text-xs text-[#8C6D58]">Curated Leather Set</span>
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
