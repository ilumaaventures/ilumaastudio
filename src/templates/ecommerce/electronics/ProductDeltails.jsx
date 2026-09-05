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
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 text-left">
      {/* Back Button & Breadcrumbs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Back to Hardware Lineup</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
          <span>Catalog</span>
          <span>/</span>
          <span className="text-slate-300">{product.category || "Hardware"}</span>
          <span>/</span>
          <span className="text-cyan-400 font-bold truncate max-w-[200px]">{product.name}</span>
        </div>

        <button
          onClick={handleShare}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition cursor-pointer text-xs flex items-center gap-1.5"
        >
          <Share2 size={14} />
          <span className="hidden sm:inline">Share Specs</span>
        </button>
      </div>

      {/* Main Two-Column Hardware Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left Column: Visual Gallery & Certifications */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-square w-full rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 relative group shadow-2xl">
            <img
              src={images[activeImageIndex] || images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />

            {/* Badges Overlay */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.badge && (
                <span className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-lg border border-cyan-400/30">
                  {product.badge}
                </span>
              )}
              <span className="bg-amber-500/90 backdrop-blur-md text-slate-950 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full flex items-center gap-1 w-fit shadow-md">
                <Award size={12} /> Hi-Res Wireless Certified
              </span>
            </div>

            {product.batteryLifeHours && product.batteryLifeHours > 0 && (
              <div className="absolute bottom-4 left-4 bg-slate-950/90 backdrop-blur-md border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold px-3 py-1 rounded-xl flex items-center gap-1.5">
                <Battery size={14} />
                <span>{product.batteryLifeHours} Hours Continuous Stamina</span>
              </div>
            )}
          </div>

          {/* Gallery Thumbnails */}
          <div className="grid grid-cols-3 gap-3">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`aspect-video rounded-2xl overflow-hidden bg-slate-950 border transition cursor-pointer ${
                  activeImageIndex === idx
                    ? "border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                    : "border-slate-800 opacity-60 hover:opacity-100"
                }`}
              >
                <img src={img} alt={`Angle ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* Hardware Trust & Shipping Perks */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-800 text-center">
            <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
              <ShieldCheck size={18} className="mx-auto text-cyan-400" />
              <span className="text-[11px] font-bold text-white block">100% OEM Silicon</span>
              <p className="text-[10px] text-slate-400">Guaranteed authentic</p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
              <RotateCcw size={18} className="mx-auto text-cyan-400" />
              <span className="text-[11px] font-bold text-white block">30-Day Audio Trial</span>
              <p className="text-[10px] text-slate-400">Zero-risk return</p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
              <Zap size={18} className="mx-auto text-cyan-400" />
              <span className="text-[11px] font-bold text-white block">24h Dispatch</span>
              <p className="text-[10px] text-slate-400">Insured air freight</p>
            </div>
          </div>
        </div>

        {/* Right Column: Spec Breakdown, Warranty & Purchasing */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest text-cyan-400 font-bold font-mono">
              {product.category || "Audio & Peripherals"}
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Rating and Reviews */}
            <div className="flex items-center gap-3 pt-1">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="fill-amber-400" />
                ))}
              </div>
              <span className="text-xs font-bold text-white">{product.rating || "4.9"}</span>
              <span className="text-xs text-slate-400">({product.reviewCount || 128} verified lab reviews)</span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-baseline justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black text-white font-mono">
                  ₹{finalUnitPrice.toFixed(2)}
                </span>
                {originalPrice && (
                  <span className="text-sm text-slate-500 line-through font-mono">
                    ₹{originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Tax included. Express express freight calculated at checkout.
              </p>
            </div>

            <span className={`text-xs font-bold px-3 py-1.5 rounded-xl ${
              outOfStock ? "bg-rose-950/60 text-rose-400 border border-rose-800" : "bg-emerald-950/60 text-emerald-400 border border-emerald-800 font-mono"
            }`}>
              {outOfStock ? "Sold Out" : "In Stock • Ships Tomorrow"}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-slate-300 leading-relaxed">
            {product.description}
          </p>

          {/* Quick Technical Specs Grid */}
          <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 font-mono text-xs">
            {product.driverSize && (
              <div className="space-y-0.5">
                <span className="text-slate-500 text-[10px] uppercase block">Core Architecture</span>
                <span className="text-cyan-300 font-bold">{product.driverSize}</span>
              </div>
            )}
            {product.ancDb && (
              <div className="space-y-0.5">
                <span className="text-slate-500 text-[10px] uppercase block">Isolation Rating</span>
                <span className="text-white font-bold">{product.ancDb}</span>
              </div>
            )}
            {product.codecs && (
              <div className="space-y-0.5">
                <span className="text-slate-500 text-[10px] uppercase block">Codecs & Protocol</span>
                <span className="text-slate-300 truncate block">{product.codecs}</span>
              </div>
            )}
            {product.weightGrams && (
              <div className="space-y-0.5">
                <span className="text-slate-500 text-[10px] uppercase block">Chassis Weight</span>
                <span className="text-slate-300">{product.weightGrams}</span>
              </div>
            )}
          </div>

          {/* TechShield Extended Warranty Selector */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block font-mono">
              Protection & Warranty Tier
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedWarranty("standard")}
                className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
                  selectedWarranty === "standard"
                    ? "bg-slate-800 border-slate-500 text-white shadow-md"
                    : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <div className="flex justify-between items-center text-xs font-bold">
                  <span>1-Year Standard OEM</span>
                  <span className="text-slate-400 font-mono">Included</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Standard manufacturer defect coverage.</p>
              </button>

              <button
                type="button"
                onClick={() => setSelectedWarranty("2year")}
                className={`p-3.5 rounded-2xl border text-left transition cursor-pointer relative ${
                  selectedWarranty === "2year"
                    ? "bg-cyan-950/60 border-cyan-400 text-white shadow-[0_0_20px_rgba(6,182,212,0.2)]"
                    : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-cyan-300 flex items-center gap-1">
                    <ShieldCheck size={14} /> 2-Yr TechShield
                  </span>
                  <span className="text-cyan-400 font-mono">+₹39.00</span>
                </div>
                <p className="text-[10px] text-slate-300 mt-1">
                  Accidental damage + 24-hr advance replacement.
                </p>
              </button>
            </div>
          </div>

          {/* Quantity Stepper & Add to Cart */}
          <div className="pt-2 space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-slate-900 border border-slate-700 rounded-2xl p-1">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-slate-400 hover:text-white transition cursor-pointer"
                >
                  <Minus size={14} />
                </button>
                <span className="w-12 text-center text-sm font-mono font-black text-white">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 text-slate-400 hover:text-white transition cursor-pointer"
                >
                  <Plus size={14} />
                </button>
              </div>

              {onToggleCompare && (
                <button
                  type="button"
                  onClick={() => onToggleCompare(product)}
                  className={`px-4 py-3 rounded-2xl border text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                    isCompared
                      ? "bg-cyan-500 text-slate-950 border-cyan-400 font-black"
                      : "bg-slate-800 text-slate-300 border-slate-700 hover:border-cyan-400"
                  }`}
                >
                  <SlidersHorizontal size={15} />
                  <span>{isCompared ? "In Comparison" : "Compare Specs"}</span>
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={handleAdd}
              disabled={outOfStock}
              className={`w-full py-4 rounded-2xl font-bold text-sm uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-xl ${
                outOfStock
                  ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
                  : "bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 hover:from-blue-500 hover:to-cyan-500 text-white shadow-blue-600/40 border border-cyan-400/40 transform active:scale-98"
              }`}
            >
              <ShoppingBag size={18} className="text-cyan-200" />
              <span>
                {outOfStock ? "Item Sold Out" : `Add to Tech Cart • ₹${totalPrice.toFixed(2)}`}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs for In-depth Hardware Specs, Audio Engineering, and Reviews */}
      <div className="pt-12 border-t border-slate-800 space-y-6">
        <div className="flex gap-4 border-b border-slate-800 text-xs font-bold uppercase tracking-wider">
          {[
            { id: "specs", label: "Full Technical Specifications" },
            { id: "features", label: "Acoustic Engineering & Silicon" },
            { id: "reviews", label: `Customer Reviews (${product.reviewCount || 128})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 transition border-b-2 cursor-pointer ${
                activeTab === tab.id
                  ? "border-cyan-400 text-cyan-400 font-black"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Specs */}
        {activeTab === "specs" && (
          <div className="bg-slate-900/80 rounded-3xl border border-slate-800 p-6 sm:p-8 overflow-x-auto shadow-xl">
            <table className="w-full text-xs text-left">
              <tbody className="divide-y divide-slate-800/80">
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-400 w-1/3">Acoustic Transducer</td>
                  <td className="py-3 px-4 text-white font-mono">{product.driverSize || "Custom 40mm Beryllium Diaphragm"}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-400">Noise Cancellation Depth</td>
                  <td className="py-3 px-4 text-white font-mono">{product.ancDb || "45 dB Hybrid ANC with Quad Microphones"}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-400">Bluetooth Protocols</td>
                  <td className="py-3 px-4 text-white font-mono">Bluetooth 5.4 LE, Multi-Point Connection</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-400">Supported Codecs</td>
                  <td className="py-3 px-4 text-white font-mono">{product.codecs || "LDAC, aptX Adaptive, AAC, SBC"}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-400">Continuous Stamina</td>
                  <td className="py-3 px-4 text-white font-mono">{product.batteryLifeHours || 50} Hours Playtime</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-400">Fast Charging Metric</td>
                  <td className="py-3 px-4 text-white font-mono">10 Minutes Charge = 5 Hours Playback (USB-C GaN)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-400">Chassis Material</td>
                  <td className="py-3 px-4 text-white font-mono">Aerospace-grade CNC Aluminum & Memory Foam</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Features */}
        {activeTab === "features" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
              <Cpu size={24} className="text-cyan-400" />
              <h4 className="text-base font-bold text-white">Custom DSP Equalizer</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Dedicated onboard signal processor executes 32-bit floating point harmonic filtering to maintain zero harmonic distortion even at 100dB SPL.
              </p>
            </div>
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
              <Radio size={24} className="text-cyan-400" />
              <h4 className="text-base font-bold text-white">Spatial Head Tracking</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Built-in 6-axis gyroscopic sensors monitor head positions 1,000 times a second to anchor Dolby Atmos audio objects in virtual 3D space.
              </p>
            </div>
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
              <ShieldCheck size={24} className="text-cyan-400" />
              <h4 className="text-base font-bold text-white">Beryllium Rigidity</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Beryllium offers four times the stiffness of titanium with an acoustic velocity exceeding 12,000 m/s, yielding instantaneous transient response.
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
                comment: "The transient clarity on high hats and sub-bass separation is unmatched at this price point. LDAC connection is rock solid.",
              },
              {
                author: "Elena Rostova",
                role: "Competitive Esports Player",
                rating: 5,
                date: "1 week ago",
                comment: "The zero-latency connection mode is genuine. Pinpointing footstep vectors in spatial games gives an immediate advantage.",
              },
            ].map((rev, i) => (
              <div key={i} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-sm font-bold text-white">{rev.author}</span>
                    <span className="text-xs text-slate-400 ml-2">({rev.role})</span>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">{rev.date}</span>
                </div>
                <div className="flex text-amber-400">
                  {[...Array(rev.rating)].map((_, idx) => (
                    <Star key={idx} size={12} className="fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-300">{rev.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Related Hardware Lineup */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="pt-12 border-t border-slate-800 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-black text-white">Related Hardware Ecosystem</h3>
            <span className="text-xs text-cyan-400 font-mono">Precision Complementary Devices</span>
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
