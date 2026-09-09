import React, { useState } from "react";
import {
  ArrowLeft,
  Star,
  ShieldCheck,
  RotateCcw,
  Zap,
  Battery,
  SlidersHorizontal,
  Plus,
  Minus,
  Check,
  ShoppingBag,
  Share2,
  Cpu,
  Radio,
  Clock,
  Sparkles,
  Award,
  ChevronRight,
  Truck,
} from "lucide-react";
import toast from "react-hot-toast";
import { isOutOfStock } from "../../../utils/stockUtils";
import { getProductImage } from "../../../utils/productImage";
import ProductCard from "./ProductCard";

export default function ProductDeltails({
  product,
  onBack,
  onAddToCart,
  relatedProducts = [],
  onSelectProduct,
  onToggleCompare,
  isCompared = false,
}) {
  const [quantity, setQuantity] = useState(1);
  const [selectedWarranty, setSelectedWarranty] = useState("2year"); // "standard" | "2year"
  const [activeTab, setActiveTab] = useState("specs"); // "specs" | "features" | "reviews"
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!product) return null;

  const outOfStock = isOutOfStock(product);
  const basePrice = Number(product.price) || 0;
  const warrantyPrice = selectedWarranty === "2year" ? 39 : 0;
  const finalUnitPrice = basePrice + warrantyPrice;
  const totalPrice = finalUnitPrice * quantity;
  const originalPrice = product.compareAtPrice ? Number(product.compareAtPrice) : null;

  // Alternate angles / preview gallery
  const images = [
    getProductImage(product, product.image),
    "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=900&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=900&auto=format&fit=crop&q=80",
  ];

  const handleAdd = () => {
    if (outOfStock) return;
    onAddToCart(product, quantity, selectedWarranty);
    toast.success(
      `Added ${quantity}x ${product.name} ${
        selectedWarranty === "2year" ? "(+TechShield 2-Yr)" : ""
      } to cart!`
    );
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Hardware specification link copied to clipboard!");
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 text-left">
      {/* Back Button & Breadcrumbs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-sky-600 transition cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Back to Hardware Lineup</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-slate-500 font-sans">
          <span className="hover:text-sky-600 cursor-pointer" onClick={onBack}>Home</span>
          <ChevronRight size={12} />
          <span className="text-slate-600">{product.category || "Hardware"}</span>
          <ChevronRight size={12} />
          <span className="text-sky-600 font-bold truncate max-w-[240px]">{product.name}</span>
        </div>

        <button
          onClick={handleShare}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 transition cursor-pointer text-xs flex items-center gap-1.5"
        >
          <Share2 size={14} />
          <span className="hidden sm:inline">Share Specs</span>
        </button>
      </div>

      {/* Main Two-Column Hardware Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        {/* Left Column: Visual Gallery & Trust Badges */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-square w-full rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 relative group flex items-center justify-center p-6">
            <img
              src={images[activeImageIndex] || images[0]}
              alt={product.name}
              className="max-h-[380px] w-auto object-contain group-hover:scale-105 transition-transform duration-300"
            />

            {/* Badges Overlay */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {originalPrice && originalPrice > basePrice && (
                <span className="bg-rose-600 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-sm">
                  Save ${(originalPrice - basePrice).toFixed(0)}
                </span>
              )}
              <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 w-fit shadow-xs">
                <Award size={12} /> OEM Certified
              </span>
            </div>

            {product.batteryLifeHours && product.batteryLifeHours > 0 && (
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm border border-slate-200 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-xl flex items-center gap-1.5 shadow-sm">
                <Battery size={14} className="text-emerald-600" />
                <span>{product.batteryLifeHours}h Extended Stamina</span>
              </div>
            )}
          </div>

          {/* Gallery Thumbnails */}
          <div className="grid grid-cols-3 gap-3">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`aspect-video rounded-xl overflow-hidden bg-white border-2 transition cursor-pointer p-1 flex items-center justify-center ${
                  activeImageIndex === idx
                    ? "border-[#EAB308] shadow-sm"
                    : "border-slate-200 opacity-70 hover:opacity-100"
                }`}
              >
                <img src={img} alt={`Angle ${idx + 1}`} className="w-full h-full object-contain" />
              </button>
            ))}
          </div>

          {/* Hardware Trust & Shipping Perks */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-center">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <ShieldCheck size={18} className="mx-auto text-sky-600" />
              <span className="text-[11px] font-bold text-slate-800 block">100% Genuine</span>
              <p className="text-[10px] text-slate-500">Authorized warranty</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <RotateCcw size={18} className="mx-auto text-sky-600" />
              <span className="text-[11px] font-bold text-slate-800 block">30-Day Returns</span>
              <p className="text-[10px] text-slate-500">Zero restocking fee</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <Truck size={18} className="mx-auto text-sky-600" />
              <span className="text-[11px] font-bold text-slate-800 block">Free Shipping</span>
              <p className="text-[10px] text-slate-500">Orders over $50</p>
            </div>
          </div>
        </div>

        {/* Right Column: Spec Breakdown, Warranty & Purchasing */}
        <div className="lg:col-span-6 space-y-5">
          <div className="space-y-1.5">
            <span className="text-xs uppercase tracking-wider text-slate-500 font-bold">
              {product.category || "Audio & Electronics"}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
              {product.name}
            </h1>

            {/* Rating and Reviews */}
            <div className="flex items-center gap-3 pt-1">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="fill-amber-400" />
                ))}
              </div>
              <span className="text-xs font-bold text-slate-800">{product.rating || "4.9"}</span>
              <span className="text-xs text-slate-500">({product.reviewCount || 128} verified reviews)</span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-baseline justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900">
                  ${finalUnitPrice.toFixed(2)}
                </span>
                {originalPrice && (
                  <span className="text-sm text-slate-400 line-through">
                    ${originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Standard sales tax included. Free insured delivery in checkout.
              </p>
            </div>

            <span
              className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                outOfStock
                  ? "bg-rose-100 text-rose-700 border border-rose-300"
                  : "bg-emerald-100 text-emerald-800 border border-emerald-300"
              }`}
            >
              {outOfStock ? "Sold Out" : "In Stock • Ready to Ship"}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-slate-600 leading-relaxed">
            {product.description ||
              "High-fidelity hardware component engineered with high-precision components, optimized thermal routing, and durable chassis architecture."}
          </p>

          {/* Quick Technical Specs Grid */}
          <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-white border border-slate-200 text-xs">
            {product.driverSize && (
              <div className="space-y-0.5">
                <span className="text-slate-400 text-[10px] uppercase block font-bold">Driver / Diaphragm</span>
                <span className="text-slate-800 font-semibold">{product.driverSize}</span>
              </div>
            )}
            {product.ancDb && (
              <div className="space-y-0.5">
                <span className="text-slate-400 text-[10px] uppercase block font-bold">Acoustic Isolation</span>
                <span className="text-slate-800 font-semibold">{product.ancDb}</span>
              </div>
            )}
            {product.codecs && (
              <div className="space-y-0.5">
                <span className="text-slate-400 text-[10px] uppercase block font-bold">Protocol / Codecs</span>
                <span className="text-slate-800 font-semibold truncate block">{product.codecs}</span>
              </div>
            )}
            {product.weightGrams && (
              <div className="space-y-0.5">
                <span className="text-slate-400 text-[10px] uppercase block font-bold">Chassis Weight</span>
                <span className="text-slate-800 font-semibold">{product.weightGrams}</span>
              </div>
            )}
          </div>

          {/* Protection & Warranty Tier */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              Protection & Warranty Tier
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedWarranty("standard")}
                className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                  selectedWarranty === "standard"
                    ? "bg-amber-50 border-[#EAB308] text-slate-900 shadow-xs"
                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                <div className="flex justify-between items-center text-xs font-bold">
                  <span>1-Year Standard OEM</span>
                  <span className="text-slate-500 font-semibold">Included</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Standard factory defect replacement.</p>
              </button>

              <button
                type="button"
                onClick={() => setSelectedWarranty("2year")}
                className={`p-3 rounded-xl border text-left transition cursor-pointer relative ${
                  selectedWarranty === "2year"
                    ? "bg-amber-50 border-[#EAB308] text-slate-900 shadow-xs"
                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-900 flex items-center gap-1 font-bold">
                    <ShieldCheck size={14} className="text-amber-600" /> 2-Yr Complete Care
                  </span>
                  <span className="text-amber-700 font-bold">+$39.00</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Accidental damage + 24-hr advance express swap.
                </p>
              </button>
            </div>
          </div>

          {/* Quantity Stepper & Add to Cart */}
          <div className="pt-2 space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-1">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-slate-600 hover:text-slate-900 transition cursor-pointer"
                >
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center text-sm font-black text-slate-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 text-slate-600 hover:text-slate-900 transition cursor-pointer"
                >
                  <Plus size={14} />
                </button>
              </div>

              {onToggleCompare && (
                <button
                  type="button"
                  onClick={() => onToggleCompare(product)}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                    isCompared
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-700 border-slate-200 hover:border-slate-400"
                  }`}
                >
                  <SlidersHorizontal size={14} />
                  <span>{isCompared ? "In Comparison" : "Compare Specs"}</span>
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={handleAdd}
              disabled={outOfStock}
              className={`w-full py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
                outOfStock
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300"
                  : "bg-[#EAB308] hover:bg-yellow-500 text-slate-950 shadow-yellow-200 active:scale-98"
              }`}
            >
              <ShoppingBag size={18} />
              <span>
                {outOfStock ? "Item Sold Out" : `Add to Cart • $${totalPrice.toFixed(2)}`}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs for In-depth Hardware Specs, Acoustic Engineering, and Reviews */}
      <div className="pt-6 space-y-6">
        <div className="flex gap-4 border-b-2 border-slate-200 text-xs font-bold uppercase tracking-wider">
          {[
            { id: "specs", label: "Full Technical Specifications" },
            { id: "features", label: "Engineering & Hardware" },
            { id: "reviews", label: `Customer Reviews (${product.reviewCount || 128})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 transition border-b-2 -mb-[2px] cursor-pointer ${
                activeTab === tab.id
                  ? "border-[#EAB308] text-slate-950 font-black"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Specs */}
        {activeTab === "specs" && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 overflow-x-auto shadow-xs">
            <table className="w-full text-xs text-left">
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-500 w-1/3">Acoustic Transducer</td>
                  <td className="py-3 px-4 text-slate-900 font-semibold">{product.driverSize || "Custom 40mm Beryllium Diaphragm"}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-500">Noise Cancellation Depth</td>
                  <td className="py-3 px-4 text-slate-900 font-semibold">{product.ancDb || "45 dB Hybrid ANC with Quad Microphones"}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-500">Wireless Protocols</td>
                  <td className="py-3 px-4 text-slate-900 font-semibold">Bluetooth 5.4 LE, Multi-Point Connection</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-500">Supported Codecs</td>
                  <td className="py-3 px-4 text-slate-900 font-semibold">{product.codecs || "LDAC, aptX Adaptive, AAC, SBC"}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-500">Continuous Battery Life</td>
                  <td className="py-3 px-4 text-slate-900 font-semibold">{product.batteryLifeHours || 50} Hours Playtime</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-500">Fast Charging Metric</td>
                  <td className="py-3 px-4 text-slate-900 font-semibold">10 Minutes Charge = 5 Hours Playback (USB-C GaN)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-500">Chassis Material</td>
                  <td className="py-3 px-4 text-slate-900 font-semibold">Aerospace-grade CNC Aluminum & Memory Foam</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Features */}
        {activeTab === "features" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
              <Cpu size={24} className="text-[#EAB308]" />
              <h4 className="text-base font-bold text-slate-900">Custom DSP Equalizer</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dedicated onboard signal processor executes 32-bit floating point harmonic filtering to maintain zero distortion even at maximum output.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
              <Radio size={24} className="text-[#EAB308]" />
              <h4 className="text-base font-bold text-slate-900">Spatial Audio Processing</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Built-in sensors monitor head positions 1,000 times a second to anchor Dolby Atmos audio objects in virtual 3D space.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
              <ShieldCheck size={24} className="text-[#EAB308]" />
              <h4 className="text-base font-bold text-slate-900">Industrial Rigidity</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Acoustic velocity engineered chassis provides instantaneous transient response and long-term durability.
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: Reviews */}
        {activeTab === "reviews" && (
          <div className="space-y-4">
            {[
              {
                author: "Marcus Vance",
                role: "Audio Mastering Engineer",
                rating: 5,
                date: "2 days ago",
                comment: "The transient clarity on high hats and sub-bass separation is unmatched at this price point. Connection is rock solid.",
              },
              {
                author: "Elena Rostova",
                role: "Competitive Esports Player",
                rating: 5,
                date: "1 week ago",
                comment: "The zero-latency mode is genuine. Pinpointing spatial sound cues gives an immediate edge in fast-paced scenarios.",
              },
            ].map((rev, i) => (
              <div key={i} className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-sm font-bold text-slate-900">{rev.author}</span>
                    <span className="text-xs text-slate-500 ml-2">({rev.role})</span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">{rev.date}</span>
                </div>
                <div className="flex text-amber-400">
                  {[...Array(rev.rating)].map((_, idx) => (
                    <Star key={idx} size={12} className="fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-600">{rev.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Related Hardware Lineup */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="pt-8 border-t border-slate-200 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-black text-slate-900">Related Products</h3>
            <span className="text-xs text-slate-500">Popular In This Category</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {relatedProducts
              .filter((p) => (p._id || p.id) !== (product._id || product.id))
              .slice(0, 6)
              .map((item) => (
                <ProductCard
                  key={item._id || item.id}
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
