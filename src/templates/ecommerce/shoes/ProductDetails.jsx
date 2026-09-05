import React, { useState } from "react";
import {
  ArrowLeft,
  Zap,
  ShoppingBag,
  ShieldCheck,
  Star,
  Check,
  Flame,
  Layers,
  ChevronRight,
  Share2,
  Clock,
  Compass,
  Activity,
  Maximize2,
} from "lucide-react";
import { isOutOfStock } from "../../../utils/stockUtils";
import { getProductImage } from "../../../utils/productImage";
import toast from "react-hot-toast";

export default function ProductDetails({
  product = {},
  onBack = () => {},
  onAddToCart = () => {},
  relatedProducts = [],
  onSelectProduct = () => {},
  sizeStandard = "US",
}) {
  const [selectedSize, setSelectedSize] = useState(product.selectedSize || "10");
  const [selectedWidth, setSelectedWidth] = useState("Regular (D)");
  const [activeAngle, setActiveAngle] = useState("Lateral Profile");
  const [archProfile, setArchProfile] = useState("neutral"); // "high" | "neutral" | "flat"
  const [quantity, setQuantity] = useState(1);
  const outOfStock = isOutOfStock(product);

  const availableSizes = product.sizes || [
    "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12", "13"
  ];

  const handleAdd = () => {
    if (outOfStock) {
      toast.error("This silhouette is currently sold out in deadstock archive.");
      return;
    }
    onAddToCart({ ...product, selectedSize: `${sizeStandard} ${selectedSize}`, selectedWidth }, quantity);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 font-sans">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between text-xs font-mono">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-zinc-400 hover:text-lime-400 transition cursor-pointer group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition" />
          <span>BACK TO SNEAKER VAULT</span>
        </button>

        <div className="flex items-center gap-2 text-zinc-500">
          <span>VAULT</span>
          <ChevronRight size={12} />
          <span className="text-zinc-300">{product.category || "Running"}</span>
          <ChevronRight size={12} />
          <span className="text-lime-400 font-bold uppercase truncate max-w-[180px]">
            {product.name}
          </span>
        </div>
      </div>

      {/* Main Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: High-Tech Visualizer & Angles (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Visualizer Stage */}
          <div className="relative bg-gradient-to-b from-[#131317] to-[#0A0A0C] rounded-3xl border border-zinc-800 p-8 sm:p-12 overflow-hidden shadow-2xl">
            {/* Speed Telemetry HUD Corner */}
            <div className="absolute top-6 left-6 flex flex-col gap-1 z-10 font-mono text-[10px]">
              <span className="bg-lime-500/10 text-lime-400 border border-lime-500/30 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5">
                <Zap size={12} className="fill-lime-400" />
                {product.propulsionTag || "CARBON RACE TECH"}
              </span>
              <span className="text-zinc-500 tracking-wider">RFID ARCHIVE #SC-{product._id || "9001"}</span>
            </div>

            {/* Angle Indicator Top Right */}
            <div className="absolute top-6 right-6 font-mono text-[10px] text-zinc-400 bg-black/60 px-3 py-1 rounded-full border border-zinc-800">
              VIEW: <span className="text-white font-bold">{activeAngle}</span>
            </div>

            {/* Kinetic Backlight Glow */}
            <div className="absolute inset-0 bg-radial-gradient from-lime-500/15 via-transparent to-transparent pointer-events-none" />

            {/* Large Sneaker Silhouette */}
            <div className="relative z-10 w-full aspect-[4/3] flex items-center justify-center my-6">
              <img
                src={getProductImage(product, product.image)}
                alt={product.name}
                className="w-full h-full object-contain filter drop-shadow-[0_25px_35px_rgba(0,0,0,0.9)] transform hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Live Telemetry Overlay Bottom */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-zinc-800/80 font-mono text-center">
              <div className="p-2.5 rounded-xl bg-black/50 border border-zinc-800/80">
                <span className="text-[10px] text-zinc-500 block uppercase">Energy Return</span>
                <span className="text-sm font-black text-lime-400">{product.energyReturn || "89%"}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/50 border border-zinc-800/80">
                <span className="text-[10px] text-zinc-500 block uppercase">Heel Stack Drop</span>
                <span className="text-sm font-black text-white">{product.heelDrop || "38mm / 8mm"}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/50 border border-zinc-800/80">
                <span className="text-[10px] text-zinc-500 block uppercase">Shoe Weight</span>
                <span className="text-sm font-black text-white">{product.weight || "184g (Men's 10)"}</span>
              </div>
            </div>
          </div>

          {/* Angle Switcher Strip */}
          <div className="grid grid-cols-4 gap-3 font-mono text-xs">
            {["Lateral Profile", "Medial Arch", "Outsole Lugs", "Heel Counter"].map((angle) => (
              <button
                key={angle}
                onClick={() => setActiveAngle(angle)}
                className={`py-3 px-2 rounded-2xl border text-center transition cursor-pointer ${
                  activeAngle === angle
                    ? "bg-zinc-900 border-lime-400 text-lime-400 font-bold shadow-lg shadow-lime-500/10"
                    : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white"
                }`}
              >
                <span className="block text-[10px] uppercase">{angle}</span>
              </button>
            ))}
          </div>

          {/* Interactive Arch & Lacing Fit Advisor */}
          <div className="p-6 rounded-3xl bg-[#111115] border border-zinc-800 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity size={16} className="text-lime-400" />
                <span className="font-bold text-white uppercase tracking-wider">
                  Gait & Arch Fit Advisor
                </span>
              </div>
              <span className="text-[10px] text-zinc-400">Tuned for this chassis</span>
            </div>

            <p className="text-zinc-400 font-sans text-xs">
              Select your foot arch profile to unlock the ideal lockdown lacing technique for zero heel slip:
            </p>

            <div className="grid grid-cols-3 gap-3">
              {[
                { id: "high", label: "High Arch", rec: "Window Lacing (Relieves top pressure)" },
                { id: "neutral", label: "Neutral Arch", rec: "Criss-Cross Racer Loop (Balanced lock)" },
                { id: "flat", label: "Flat / Low Arch", rec: "Straight Bar Lacing (Midfoot support)" },
              ].map((arch) => (
                <button
                  key={arch.id}
                  onClick={() => setArchProfile(arch.id)}
                  className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                    archProfile === arch.id
                      ? "bg-lime-500/10 border-lime-400 text-lime-400"
                      : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"
                  }`}
                >
                  <span className="block font-bold text-white text-[11px] mb-1">{arch.label}</span>
                  <span className="block text-[9px] text-zinc-400 line-clamp-2">{arch.rec}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Silhouette Configurator & Purchase Controls (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#111115] rounded-3xl border border-zinc-800 p-6 sm:p-8 space-y-6">
            {/* Title & Pricing */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-lime-400">
                  {product.category || "PERFORMANCE SNEAKER"}
                </span>
                <div className="flex items-center gap-1 text-xs font-mono text-zinc-400">
                  <Star size={13} className="text-amber-400 fill-amber-400" />
                  <span className="font-bold text-white">{product.rating || "4.9"}</span>
                  <span>({product.reviewCount || 48} verified runners)</span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-white font-mono uppercase tracking-tight">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-3 font-mono pt-1">
                <span className="text-3xl font-black text-white">
                  ₹{Number(product.price || 0).toLocaleString()}
                </span>
                {product.compareAtPrice && (
                  <span className="text-sm text-zinc-500 line-through">
                    ₹{Number(product.compareAtPrice).toLocaleString()}
                  </span>
                )}
                <span className="text-xs text-lime-400 font-bold bg-lime-500/10 px-2 py-0.5 rounded border border-lime-500/20">
                  Deadstock Guaranteed
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans border-t border-b border-zinc-800 py-4">
              {product.description ||
                "Engineered with a full-length spooned carbon-fiber lever and supercritical nitrogen gas foam for explosive forward push-off. Built for personal bests and elevated street aesthetics."}
            </p>

            {/* Size Selector */}
            <div className="space-y-3 font-mono">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400 uppercase font-bold">
                  SELECT {sizeStandard} SIZE:
                </span>
                <span className="text-lime-400 font-bold">
                  {sizeStandard} {selectedSize} (In Stock)
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {availableSizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`py-3 rounded-xl text-xs font-bold transition cursor-pointer border ${
                      selectedSize === sz
                        ? "bg-lime-400 text-black border-lime-400 shadow-md shadow-lime-500/20 font-black"
                        : "bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-700 hover:text-white"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Width Selector */}
            <div className="space-y-2 font-mono text-xs">
              <span className="text-zinc-400 uppercase font-bold">WIDTH FITTING:</span>
              <div className="grid grid-cols-2 gap-3">
                {["Regular (D)", "Wide (2E)"].map((w) => (
                  <button
                    key={w}
                    onClick={() => setSelectedWidth(w)}
                    className={`py-2.5 px-3 rounded-xl border text-center transition cursor-pointer ${
                      selectedWidth === w
                        ? "bg-lime-500/10 border-lime-400 text-lime-400 font-bold"
                        : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity and Add to Shoebox */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl font-mono text-xs">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3.5 py-3 text-zinc-400 hover:text-white transition cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-3 font-bold text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3.5 py-3 text-zinc-400 hover:text-white transition cursor-pointer"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAdd}
                  disabled={outOfStock}
                  className={`flex-1 py-3.5 px-6 rounded-xl font-mono font-black text-xs uppercase tracking-wider transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer ${
                    outOfStock
                      ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-lime-400 to-lime-500 hover:from-lime-300 hover:to-lime-400 text-black shadow-lime-500/20 hover:scale-[1.02] active:scale-[0.98]"
                  }`}
                >
                  <ShoppingBag size={16} className="fill-black" />
                  <span>{outOfStock ? "Sold Out in Deadstock" : "Add to Shoebox"}</span>
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2.5 font-mono text-[11px] text-zinc-400">
              <div className="flex items-center gap-2 text-zinc-200">
                <ShieldCheck size={16} className="text-lime-400 shrink-0" />
                <span className="font-bold">100% Verified Deadstock with NFC Tag</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-200">
                <Clock size={16} className="text-lime-400 shrink-0" />
                <span>Dispatches from SoleCraft Vault within 24 Hours</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-200">
                <Check size={16} className="text-lime-400 shrink-0" />
                <span>30-Day Street Run Guarantee & Free Size Exchange</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Silhouettes */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-8 border-t border-zinc-800">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono uppercase text-lime-400 font-bold">From the Same Class</span>
              <h3 className="text-2xl font-black text-white font-mono uppercase">Complementary Silhouettes</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts
              .filter((p) => p._id !== product._id)
              .slice(0, 4)
              .map((item) => (
                <div
                  key={item._id}
                  onClick={() => onSelectProduct(item)}
                  className="bg-zinc-900/60 p-4 rounded-3xl border border-zinc-800 hover:border-lime-500/50 transition cursor-pointer space-y-3 group"
                >
                  <div className="aspect-[4/3] rounded-2xl bg-zinc-950 flex items-center justify-center p-4 overflow-hidden">
                    <img
                      src={getProductImage(item, item.image)}
                      alt={item.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-lime-400 font-bold">{item.category}</span>
                    <h4 className="text-sm font-bold text-white font-mono truncate group-hover:text-lime-400 transition">
                      {item.name}
                    </h4>
                    <span className="text-sm font-mono font-black text-white block">
                      ₹{Number(item.price).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
