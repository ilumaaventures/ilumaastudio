import React, { useState, useMemo } from "react";
import {
  ArrowLeft,
  Star,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Heart,
  Plus,
  Minus,
  Check,
  ShoppingBag,
  Share2,
  Leaf,
  Clock,
  Truck,
  MapPin,
  Calendar,
  Layers,
  ThermometerSnowflake,
  Award,
  ChevronRight,
  Info,
  CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";
import { isOutOfStock, getProductStock } from "../../../utils/stockUtils";
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
  const [purchaseType, setPurchaseType] = useState("one-time"); // "one-time" | "subscribe"
  const [selectedPackSize, setSelectedPackSize] = useState("Standard");
  const [activeTab, setActiveTab] = useState("origin"); // "origin" | "nutrition" | "storage" | "reviews"
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  if (!product) return null;

  const outOfStock = isOutOfStock(product);
  const stockCount = getProductStock(product);
  const basePrice = Number(product.price) || 0;
  const compareAtPrice = product.compareAtPrice ? Number(product.compareAtPrice) : null;
  const hasDiscount = compareAtPrice && compareAtPrice > basePrice;
  const discountPercent = hasDiscount
    ? Math.round(((compareAtPrice - basePrice) / compareAtPrice) * 100)
    : 0;

  // Price with subscription discount (10% off)
  const unitPrice = purchaseType === "subscribe" ? basePrice * 0.9 : basePrice;
  const totalPrice = unitPrice * quantity;

  // Pack size multiplier simulation
  const packSizes = [
    { label: "Standard Pack", sub: product.unit || "Single Unit", multiplier: 1 },
    { label: "Family Value Crate", sub: "2x Standard (Save 5%)", multiplier: 1.9 },
    { label: "Bulk Harvest Crate", sub: "4x Standard (Save 12%)", multiplier: 3.5 },
  ];

  const currentPack = packSizes.find((p) => p.label === selectedPackSize) || packSizes[0];
  const finalUnitPrice = unitPrice * currentPack.multiplier;
  const finalTotal = finalUnitPrice * quantity;

  // Image list
  const mainImage = getProductImage(product, product.image);
  const images = [
    mainImage,
    "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800&auto=format&fit=crop&q=80",
  ];

  const handleAdd = () => {
    if (outOfStock) {
      toast.error("Sorry, this harvest item is out of stock!");
      return;
    }
    const itemToAdd = {
      ...product,
      price: finalUnitPrice,
      name:
        purchaseType === "subscribe"
          ? `${product.name} (${selectedPackSize} - Weekly Auto-Harvest)`
          : `${product.name} (${selectedPackSize})`,
      unit: `${currentPack.sub}`,
    };
    if (onAddToCart) {
      onAddToCart(itemToAdd, quantity);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Farm-fresh produce link copied to clipboard! 🥦");
    }
  };

  // Curated mock nutritional stats based on category
  const nutritionStats = [
    { label: "Calories", value: "52 kcal", dv: "3%" },
    { label: "Dietary Fiber", value: "2.4 g", dv: "10%" },
    { label: "Vitamin C", value: "14 mg", dv: "16%" },
    { label: "Potassium", value: "195 mg", dv: "6%" },
    { label: "Sugars (Natural)", value: "10 g", dv: "--" },
    { label: "Protein", value: "0.8 g", dv: "2%" },
  ];

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 text-left font-sans animate-fade-in">
      {/* ================= 1. BREADCRUMBS & BACK BAR ================= */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-emerald-100 pb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#15803D] hover:text-emerald-800 transition cursor-pointer bg-emerald-50 hover:bg-emerald-100 px-3.5 py-2 rounded-xl"
        >
          <ArrowLeft size={16} />
          <span>Back to Fresh Aisles</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>Fresh Aisles</span>
          <ChevronRight size={12} />
          <span className="text-emerald-800 font-medium">
            {product.category || "Produce"}
          </span>
          <ChevronRight size={12} />
          <span className="text-slate-900 font-bold truncate max-w-[180px]">
            {product.name}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsWishlisted(!isWishlisted);
              toast.success(
                isWishlisted
                  ? "Removed from favorites"
                  : "Saved to Fresh Favorites! 💚"
              );
            }}
            className={`p-2 rounded-xl border transition cursor-pointer flex items-center gap-1 text-xs font-medium ${
              isWishlisted
                ? "bg-rose-50 text-rose-600 border-rose-200"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
          >
            <Heart size={15} className={isWishlisted ? "fill-rose-500 text-rose-500" : ""} />
            <span className="hidden sm:inline">{isWishlisted ? "Saved" : "Save"}</span>
          </button>

          <button
            onClick={handleShare}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition cursor-pointer text-xs flex items-center gap-1.5 shadow-2xs"
          >
            <Share2 size={15} />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>
      </div>

      {/* ================= 2. PRODUCT SHOWCASE GRID ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left Column: Gallery & Images */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square rounded-[32px] overflow-hidden bg-emerald-50/50 border border-emerald-100 shadow-md">
            <img
              src={images[activeImageIndex] || mainImage}
              alt={product.name}
              className="w-full h-full object-cover transform hover:scale-105 transition duration-700"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-700 text-white text-[11px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1">
                <Leaf size={12} className="text-emerald-200" />
                <span>100% Certified Organic</span>
              </span>
              {hasDiscount && (
                <span className="px-2.5 py-0.8 rounded-full bg-rose-600 text-white text-[10px] font-black tracking-wide shadow-sm w-fit">
                  Save {discountPercent}%
                </span>
              )}
            </div>

            <div className="absolute bottom-4 left-4 right-4 p-3 rounded-2xl bg-white/90 backdrop-blur-md border border-white/80 flex items-center justify-between text-[11px] font-semibold text-emerald-900 shadow-sm">
              <span className="flex items-center gap-1.5">
                <ThermometerSnowflake size={14} className="text-emerald-600" />
                <span>Cold-Chain Maintained at 4°C</span>
              </span>
              <span className="text-slate-500 font-medium">Harvested Today</span>
            </div>
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition cursor-pointer bg-white ${
                  activeImageIndex === idx
                    ? "border-[#15803D] ring-2 ring-emerald-500/20"
                    : "border-slate-200 opacity-70 hover:opacity-100"
                }`}
              >
                <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Information & Controls */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#16A34A] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                {product.category || "Fresh Produce"}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                <Star size={14} className="fill-amber-400 text-amber-400" />
                <span>{product.rating || "4.9"}</span>
                <span className="text-slate-400 font-normal">
                  ({product.reviewCount || 128} verified farm reviews)
                </span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 leading-tight">
              {product.name}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {product.description ||
                "Freshly harvested from certified organic family growers. Hand-selected at peak ripeness and dispatched via cold-chain transit to preserve vital nutrients and crisp texture."}
            </p>
          </div>

          {/* Pricing Block */}
          <div className="p-4 rounded-2xl bg-[#F4F9F6] border border-emerald-100 flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-2.5">
                <span className="text-3xl font-black text-[#15803D]">
                  ₹{finalUnitPrice.toFixed(2)}
                </span>
                {hasDiscount && (
                  <span className="text-sm font-semibold text-slate-400 line-through">
                    ₹{(compareAtPrice * currentPack.multiplier).toFixed(2)}
                  </span>
                )}
                <span className="text-xs text-slate-500 font-medium">
                  / {currentPack.sub}
                </span>
              </div>
              <p className="text-[11px] text-emerald-800 font-medium mt-0.5">
                ⚡ Lowest price guaranteed • Farm-direct zero middleman
              </p>
            </div>

            <div className="text-right">
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  outOfStock
                    ? "bg-rose-100 text-rose-700"
                    : "bg-emerald-100 text-emerald-800"
                }`}
              >
                {outOfStock ? "Out of Stock" : `In Stock (${stockCount || 45} units)`}
              </span>
            </div>
          </div>

          {/* Pack Size Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              Choose Harvest Pack Size:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {packSizes.map((pack) => {
                const isSelected = selectedPackSize === pack.label;
                return (
                  <button
                    key={pack.label}
                    onClick={() => setSelectedPackSize(pack.label)}
                    className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                      isSelected
                        ? "bg-emerald-50 border-[#15803D] ring-1 ring-emerald-500"
                        : "bg-white border-slate-200 hover:border-emerald-300"
                    }`}
                  >
                    <div className="text-xs font-bold text-slate-900 leading-tight">
                      {pack.label}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{pack.sub}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Purchase Frequency Option */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              Delivery Schedule:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setPurchaseType("one-time")}
                className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                  purchaseType === "one-time"
                    ? "bg-white border-[#15803D] ring-2 ring-emerald-500/20"
                    : "bg-slate-50 border-slate-200 hover:bg-white"
                }`}
              >
                <span className="text-xs font-bold text-slate-900 block">
                  One-Time Delivery
                </span>
                <span className="text-[11px] text-slate-500">
                  Standard 25-min express delivery
                </span>
              </button>

              <button
                onClick={() => setPurchaseType("subscribe")}
                className={`p-3 rounded-2xl border text-left transition cursor-pointer relative ${
                  purchaseType === "subscribe"
                    ? "bg-emerald-50/90 border-[#15803D] ring-2 ring-emerald-500/20"
                    : "bg-slate-50 border-slate-200 hover:bg-white"
                }`}
              >
                <span className="absolute -top-2 right-3 text-[9px] font-black uppercase px-2 py-0.2 rounded-full bg-amber-400 text-slate-900 shadow-2xs">
                  Save 10%
                </span>
                <span className="text-xs font-bold text-emerald-950 block">
                  Weekly Auto-Harvest
                </span>
                <span className="text-[11px] text-emerald-700">
                  Cancel or pause anytime
                </span>
              </button>
            </div>
          </div>

          {/* Quantity Stepper & Add to Basket Button */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <div className="flex items-center justify-between border border-slate-300 rounded-2xl bg-white p-1 max-w-[140px] shrink-0">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                <Minus size={15} />
              </button>
              <span className="text-sm font-black text-slate-900 w-8 text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                <Plus size={15} />
              </button>
            </div>

            <button
              onClick={handleAdd}
              disabled={outOfStock}
              className={`flex-1 py-4 px-6 rounded-2xl text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-2.5 shadow-lg cursor-pointer ${
                outOfStock
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                  : "bg-[#15803D] hover:bg-emerald-800 text-white shadow-emerald-950/20 transform hover:-translate-y-0.5"
              }`}
            >
              <ShoppingBag size={18} />
              <span>
                Add to Fresh Basket • ₹{finalTotal.toFixed(2)}
              </span>
            </button>
          </div>

          {/* Express Delivery ETA Card */}
          <div className="p-3.5 rounded-2xl bg-white border border-emerald-200 shadow-2xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <Clock size={18} />
            </div>
            <div className="text-xs">
              <div className="font-bold text-slate-900">
                Guaranteed 25-Min Delivery Available
              </div>
              <div className="text-slate-500 text-[11px]">
                Order now to receive cold-chain packaging at your doorstep by{" "}
                <strong className="text-emerald-800 font-semibold">2:15 PM today</strong>.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= 3. TABBED HARVEST DEEP DIVE ================= */}
      <div className="border-t border-emerald-100 pt-10 space-y-6">
        <div className="flex border-b border-slate-200 gap-6 overflow-x-auto text-xs font-bold uppercase tracking-wider">
          {[
            { id: "origin", label: "Farm Origin & Story", icon: MapPin },
            { id: "nutrition", label: "Nutritional Profile", icon: Layers },
            { id: "storage", label: "Storage & Freshness Tips", icon: Sparkles },
            { id: "reviews", label: "Customer Reviews", icon: Star },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3.5 flex items-center gap-2 transition cursor-pointer border-b-2 shrink-0 ${
                  isActive
                    ? "border-[#15803D] text-[#15803D]"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Farm Origin */}
        {activeTab === "origin" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                🌱
              </div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Certified Grower
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Grown by the certified organic <strong>Green Valley Family Orchard</strong> in California's fertile valley. Regenerative organic farming with zero chemical pesticides.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                💧
              </div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Harvest Protocol
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Harvested at dawn (5:30 AM) when cellular crispness and sugar Brix levels peak. Rinsed with purified ozonated water before cold-packing.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                📜
              </div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Third-Party Testing
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Batch-tested by ISO-certified agricultural laboratories. Confirmed 100% free of heavy metals, synthetic nitrates, and artificial coatings.
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Nutrition */}
        {activeTab === "nutrition" && (
          <div className="max-w-xl bg-white rounded-2xl border border-slate-200 p-6 space-y-4 animate-fade-in">
            <div className="border-b border-slate-900 pb-2">
              <h3 className="text-xl font-black text-slate-900">Nutrition Facts</h3>
              <p className="text-xs text-slate-500">Per 100g serving</p>
            </div>

            <div className="divide-y divide-slate-100">
              {nutritionStats.map((stat) => (
                <div key={stat.label} className="py-2 flex justify-between text-xs">
                  <span className="font-semibold text-slate-800">{stat.label}</span>
                  <div className="flex gap-4">
                    <span className="font-bold text-slate-900">{stat.value}</span>
                    <span className="text-slate-400 w-10 text-right">{stat.dv}</span>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[10px] text-slate-400 pt-2 border-t border-slate-200">
              * Percent Daily Values (%DV) are based on a 2,000 calorie diet.
            </p>
          </div>
        )}

        {/* Tab 3: Storage Tips */}
        {activeTab === "storage" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
            <div className="p-6 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3">
              <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600" />
                <span>Optimal Storage Guide</span>
              </h4>
              <p className="text-xs text-emerald-900 leading-relaxed">
                Keep refrigerated in the high-humidity crisper drawer at 2°C – 4°C. Avoid washing until immediately prior to consumption to preserve natural protective bloom.
              </p>
              <div className="text-[11px] font-semibold text-emerald-800">
                ⏱ Expected Freshness Window: 10–14 Days
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Sparkles size={16} className="text-amber-500" />
                <span>Chef's Culinary Pairings</span>
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pairs extraordinarily well with aged artisanal cheeses, wildflower raw honey, toasted walnuts, or sliced into organic morning oats.
              </p>
            </div>
          </div>
        )}

        {/* Tab 4: Reviews */}
        {activeTab === "reviews" && (
          <div className="space-y-4 animate-fade-in">
            {[
              {
                name: "Eleanor Vance",
                rating: 5,
                date: "Yesterday",
                comment:
                  "Hands down the sweetest, crispiest organic produce I have ever purchased. Arrived cold in an insulated kraft bag inside 22 minutes!",
              },
              {
                name: "Chef Julian Rossi",
                rating: 5,
                date: "3 days ago",
                comment:
                  "We use this in our bistro kitchen. The quality matches orchard-direct pickings. Unbeatable freshness and zero bruising.",
              },
            ].map((rev, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">{rev.name}</span>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      Verified Farm Buyer
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">{rev.date}</span>
                </div>
                <div className="flex text-amber-400 text-xs">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} size={13} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-600">{rev.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= 4. PAIRS PERFECTLY WITH CAROUSEL ================= */}
      {relatedProducts.length > 0 && (
        <div className="pt-10 border-t border-emerald-100 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs uppercase tracking-wider text-[#16A34A] font-bold">
                From The Same Organic Harvest
              </span>
              <h2 className="text-2xl font-black text-slate-900">Pairs Wonderfully With</h2>
            </div>
            <button
              onClick={onBack}
              className="text-xs font-bold text-[#15803D] hover:underline cursor-pointer"
            >
              Browse All Aisles →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedProducts
              .filter((p) => (p._id || p.id) !== (product._id || product.id))
              .slice(0, 4)
              .map((item) => (
                <ProductCard
                  key={item._id || item.id}
                  product={item}
                  layout="grid"
                  onSelect={onSelectProduct}
                  onAddToCart={onAddToCart}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
