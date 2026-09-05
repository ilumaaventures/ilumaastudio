import React, { useState } from "react";
import {
  ArrowLeft,
  Star,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Droplets,
  Heart,
  Plus,
  Minus,
  Check,
  ShoppingBag,
  Share2,
  Repeat,
  Sun,
  Moon,
  Leaf,
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
  const [purchaseType, setPurchaseType] = useState("subscribe"); // "one-time" | "subscribe"
  const [activeTab, setActiveTab] = useState("clinical"); // "clinical" | "ingredients" | "routine"
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!product) return null;

  const outOfStock = isOutOfStock(product);
  const basePrice = Number(product.price) || 0;
  const originalPrice = product.compareAtPrice ? Number(product.compareAtPrice) : null;
  const unitPrice = purchaseType === "subscribe" ? basePrice * 0.85 : basePrice;
  const totalPrice = unitPrice * quantity;

  // Alternate images
  const images = [
    getProductImage(product, product.image),
    "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80",
  ];

  const handleAdd = () => {
    if (outOfStock) return;
    const itemToAdd = {
      ...product,
      price: unitPrice,
      isSubscription: purchaseType === "subscribe",
      name: purchaseType === "subscribe"
        ? `${product.name} (Auto-Replenish 60-Day)`
        : product.name,
    };
    onAddToCart(itemToAdd, quantity);
    toast.success(
      `Added ${quantity}x ${itemToAdd.name} to Beauty Bag! ✨`
    );
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Formula link copied to clipboard!");
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 text-left font-sans">
      {/* Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-rose-100 pb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-rose-600 hover:text-rose-700 transition cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Back to Clean Skincare</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-rose-400">
          <span>Formulations</span>
          <span>/</span>
          <span className="text-rose-700">{product.category || "Active Botanical"}</span>
          <span>/</span>
          <span className="text-rose-950 font-bold truncate max-w-[200px]">{product.name}</span>
        </div>

        <button
          onClick={handleShare}
          className="p-2 rounded-xl bg-white border border-rose-200 text-rose-700 hover:bg-rose-50 transition cursor-pointer text-xs flex items-center gap-1.5 shadow-xs"
        >
          <Share2 size={14} />
          <span className="hidden sm:inline">Share Formula</span>
        </button>
      </div>

      {/* Two-Column Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left Column: Visuals & Certifications */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-square w-full rounded-3xl overflow-hidden bg-[#FFF8F8] border border-rose-100 relative group shadow-lg">
            <img
              src={images[activeImageIndex] || images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <span className="bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                {product.activeIngredient || "Active Botanical"}
              </span>
              <span className="bg-white/95 backdrop-blur-md text-emerald-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs border border-emerald-100 flex items-center gap-1 w-fit">
                <Leaf size={12} className="text-emerald-600" /> Leaping Bunny Vegan
              </span>
            </div>

            <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md border border-rose-100 text-rose-900 text-xs font-semibold px-3 py-1 rounded-xl flex items-center gap-1.5 shadow-xs">
              <Droplets size={14} className="text-rose-500" />
              <span>{product.step || "Routine Step 3 • Treatment"}</span>
            </div>
          </div>

          {/* Alternate Gallery Angles */}
          <div className="grid grid-cols-3 gap-3">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`aspect-video rounded-2xl overflow-hidden bg-rose-50 border transition cursor-pointer ${
                  activeImageIndex === idx
                    ? "border-rose-400 shadow-sm"
                    : "border-rose-100 opacity-70 hover:opacity-100"
                }`}
              >
                <img src={img} alt={`Angle ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* Clean Proof Badges */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-rose-100 text-center">
            <div className="p-3 rounded-2xl bg-white border border-rose-100 space-y-1">
              <ShieldCheck size={18} className="mx-auto text-rose-500" />
              <span className="text-[11px] font-bold text-rose-950 block">Derm Tested</span>
              <p className="text-[10px] text-rose-600">Non-comedogenic</p>
            </div>
            <div className="p-3 rounded-2xl bg-white border border-rose-100 space-y-1">
              <Heart size={18} className="mx-auto text-rose-500" />
              <span className="text-[11px] font-bold text-rose-950 block">60-Day Guarantee</span>
              <p className="text-[10px] text-rose-600">Full radiance refund</p>
            </div>
            <div className="p-3 rounded-2xl bg-white border border-rose-100 space-y-1">
              <Sparkles size={18} className="mx-auto text-rose-500" />
              <span className="text-[11px] font-bold text-rose-950 block">100% Recyclable</span>
              <p className="text-[10px] text-rose-600">Sustainable glass</p>
            </div>
          </div>
        </div>

        {/* Right Column: Actives, Subscription & Purchasing */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest text-rose-500 font-bold">
              {product.category || "Active Botanical Skincare"}
            </span>
            <h1 className="text-2xl sm:text-4xl font-serif font-black text-rose-950 tracking-tight leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 pt-1">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="fill-amber-400" />
                ))}
              </div>
              <span className="text-xs font-bold text-rose-950">{product.rating || "4.9"}</span>
              <span className="text-xs text-rose-400">({product.reviewCount || 54} clinical reviews)</span>
            </div>
          </div>

          {/* Pricing Banner */}
          <div className="p-5 rounded-2xl bg-rose-50/70 border border-rose-100 flex items-baseline justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-bold text-rose-950 font-serif">
                  ₹{unitPrice.toFixed(2)}
                </span>
                {(purchaseType === "subscribe" || originalPrice) && (
                  <span className="text-sm text-rose-400 line-through">
                    ₹{(originalPrice || basePrice).toFixed(2)}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-rose-700 mt-1">
                {purchaseType === "subscribe" ? "Includes 15% Auto-Replenish discount & free shipping." : "One-time delivery. Standard shipping calculated at checkout."}
              </p>
            </div>

            <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-200">
              Clean EWG Verified
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-rose-800/80 leading-relaxed">
            {product.description}
          </p>

          {/* Purchase Type Selector (One-Time vs Subscribe & Save) */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-rose-900 uppercase tracking-wider block">
              Delivery Preference:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPurchaseType("one-time")}
                className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
                  purchaseType === "one-time"
                    ? "bg-white border-rose-400 text-rose-950 shadow-sm"
                    : "bg-rose-50/50 border-rose-200 text-rose-700 hover:bg-rose-50"
                }`}
              >
                <div className="flex justify-between items-center text-xs font-bold">
                  <span>One-Time Delivery</span>
                  <span>₹{basePrice.toFixed(2)}</span>
                </div>
                <p className="text-[10px] text-rose-500 mt-1">Single bottle shipment without commitment.</p>
              </button>

              <button
                type="button"
                onClick={() => setPurchaseType("subscribe")}
                className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
                  purchaseType === "subscribe"
                    ? "bg-white border-rose-500 text-rose-950 shadow-md shadow-rose-200/50"
                    : "bg-rose-50/50 border-rose-200 text-rose-700 hover:bg-rose-50"
                }`}
              >
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-rose-600 flex items-center gap-1">
                    <Repeat size={14} /> Subscribe & Save 15%
                  </span>
                  <span className="text-rose-700 font-bold">₹{(basePrice * 0.85).toFixed(2)}</span>
                </div>
                <p className="text-[10px] text-rose-700 mt-1">
                  Auto-ships every 60 days. Cancel or pause anytime in 1-click.
                </p>
              </button>
            </div>
          </div>

          {/* Quantity Stepper & Add to Bag */}
          <div className="pt-2 space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-white border border-rose-200 rounded-2xl p-1 shadow-xs">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-rose-400 hover:text-rose-700 transition cursor-pointer"
                >
                  <Minus size={14} />
                </button>
                <span className="w-12 text-center text-sm font-bold text-rose-950">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 text-rose-400 hover:text-rose-700 transition cursor-pointer"
                >
                  <Plus size={14} />
                </button>
              </div>

              <div className="text-xs text-rose-600">
                Includes complimentary deluxe mini trial sample with every order.
              </div>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              disabled={outOfStock}
              className={`w-full py-4 rounded-2xl font-bold text-sm uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-98 ${
                outOfStock
                  ? "bg-rose-100 text-rose-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-rose-500 via-pink-600 to-rose-600 hover:from-rose-600 hover:to-pink-700 text-white shadow-rose-300/50"
              }`}
            >
              <ShoppingBag size={18} className="text-rose-100" />
              <span>
                {outOfStock ? "Waitlist Open" : `Add to Beauty Bag • ₹${totalPrice.toFixed(2)}`}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs: Clinical Trials, Ingredients, Routine Guide */}
      <div className="pt-12 border-t border-rose-100 space-y-6">
        <div className="flex gap-4 border-b border-rose-100 text-xs font-bold uppercase tracking-wider">
          {[
            { id: "clinical", label: "Independent Clinical Results" },
            { id: "ingredients", label: "Ingredient Transparency" },
            { id: "routine", label: "How to Layer (AM/PM)" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 transition border-b-2 cursor-pointer ${
                activeTab === tab.id
                  ? "border-rose-500 text-rose-600 font-bold"
                  : "border-transparent text-rose-400 hover:text-rose-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Clinical */}
        {activeTab === "clinical" && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-rose-50/60 border border-rose-100 space-y-2 text-center">
              <span className="text-4xl font-serif font-black text-rose-950 block">98%</span>
              <p className="text-xs text-rose-800 font-medium">
                Noticed immediate multi-depth skin hydration and dewy radiance in 24 hours.
              </p>
            </div>
            <div className="p-6 rounded-3xl bg-rose-50/60 border border-rose-100 space-y-2 text-center">
              <span className="text-4xl font-serif font-black text-rose-950 block">94%</span>
              <p className="text-xs text-rose-800 font-medium">
                Reported visible reduction in environmental redness and barrier distress in 7 days.
              </p>
            </div>
            <div className="p-6 rounded-3xl bg-rose-50/60 border border-rose-100 space-y-2 text-center">
              <span className="text-4xl font-serif font-black text-rose-950 block">91%</span>
              <p className="text-xs text-rose-800 font-medium">
                Observed refined pore appearance, plumper skin texture, and smoother fine lines in 14 days.
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Ingredients */}
        {activeTab === "ingredients" && (
          <div className="bg-white rounded-3xl border border-rose-100 p-6 sm:p-8 space-y-4">
            <h4 className="font-serif text-lg font-bold text-rose-950">Active Phyto-Concentrates</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-rose-800">
              <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100 space-y-1">
                <span className="font-bold text-rose-950 block">Multi-Molecular Hyaluronic Acid (2%)</span>
                <p className="text-rose-700">Five distinct molecular weights penetrating from the outer stratum corneum down to deep cellular reservoirs.</p>
              </div>
              <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100 space-y-1">
                <span className="font-bold text-rose-950 block">Wild Damask Rose Floral Distillate</span>
                <p className="text-rose-700">Steam-distilled fresh handpicked rose petals providing natural polyphenols and delicate soothing aroma.</p>
              </div>
              <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100 space-y-1">
                <span className="font-bold text-rose-950 block">Bio-Fermented Squalane (100% Plant-Derived)</span>
                <p className="text-rose-700">Weightless lipid biomimicking your natural sebum to lock in moisture without clogging pores.</p>
              </div>
              <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100 space-y-1">
                <span className="font-bold text-rose-950 block">Centella Asiatica (Cica)</span>
                <p className="text-rose-700">Rich in madecassoside to rapidly calm irritation, repair UV damage, and reinforce the lipid matrix.</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Routine */}
        {activeTab === "routine" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-amber-50/50 border border-amber-200/60 space-y-3">
              <div className="flex items-center gap-2 text-amber-700 font-bold text-xs">
                <Sun size={16} />
                <span>Morning Routine (AM)</span>
              </div>
              <p className="text-xs text-amber-900 leading-relaxed">
                After gentle cleansing and misting, press 3-4 drops onto damp face and neck. Allow 60 seconds to absorb before applying your daily moisturizer and mineral SPF.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-indigo-50/50 border border-indigo-200/60 space-y-3">
              <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs">
                <Moon size={16} />
                <span>Evening Routine (PM)</span>
              </div>
              <p className="text-xs text-indigo-900 leading-relaxed">
                Apply 5 drops following double-cleansing. Can be layered directly before your rich barrier night cream or overnight peptide sleeping mask.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Related Formulations */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="pt-12 border-t border-rose-100 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-serif font-bold text-rose-950">Complete Your Daily Routine</h3>
            <span className="text-xs text-rose-500">Synergistic Active Pairings</span>
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
