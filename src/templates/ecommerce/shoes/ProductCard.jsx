import React, { useState } from "react";
import {
  Zap,
  ShoppingBag,
  Flame,
  Check,
  Eye,
  Star,
  Layers,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";
import { isOutOfStock } from "../../../utils/stockUtils";
import { getProductImage } from "../../../utils/productImage";

export default function ProductCard({
  product = {},
  onSelectProduct = () => {},
  onAddToCart = () => {},
  sizeStandard = "US",
}) {
  const [selectedSize, setSelectedSize] = useState("10");
  const [hovered, setHovered] = useState(false);
  const outOfStock = isOutOfStock(product);

  const availableSizes = product.sizes || ["8", "8.5", "9", "9.5", "10", "10.5", "11", "12"];

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    if (outOfStock) return;
    onAddToCart(product, `${sizeStandard} ${selectedSize}`);
  };

  const imageSrc = getProductImage(product, product.image);

  return (
    <div
      onClick={() => onSelectProduct(product)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative bg-gradient-to-b from-[#141418] to-[#0D0D10] rounded-3xl border border-zinc-800/80 hover:border-lime-500/60 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xl hover:shadow-lime-500/10 cursor-pointer"
    >
      {/* Top Telemetry Header */}
      <div className="p-4 pb-0 flex items-center justify-between z-10">
        {/* Tech Badge / Tag */}
        <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-zinc-800 text-[10px] font-mono font-bold">
          <Zap size={12} className="text-lime-400 fill-lime-400" />
          <span className="text-lime-400 uppercase tracking-wider">
            {product.propulsionTag || product.category || "CARBON PROPULSION"}
          </span>
        </div>

        {/* Rating or Drop Badge */}
        {product.dropTag ? (
          <span className="bg-orange-500/15 text-orange-400 border border-orange-500/30 text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded">
            {product.dropTag}
          </span>
        ) : (
          <div className="flex items-center gap-1 text-[11px] font-mono text-zinc-400 bg-black/40 px-2 py-0.5 rounded">
            <Star size={11} className="text-amber-400 fill-amber-400" />
            <span className="font-bold text-white">{product.rating || "4.9"}</span>
          </div>
        )}
      </div>

      {/* Sneaker Hero Silhouette Stage */}
      <div className="relative px-6 py-6 flex items-center justify-center min-h-[220px]">
        {/* Kinetic Speed Aura on hover */}
        <div
          className={`absolute inset-0 bg-radial-gradient from-lime-500/10 via-transparent to-transparent pointer-events-none transition-opacity duration-500 ${
            hovered ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Subtle Speed Slash Backdrop Graphic */}
        <div className="absolute font-mono font-black text-6xl text-zinc-800/20 select-none tracking-tighter italic transform -rotate-12 pointer-events-none">
          {product.category?.slice(0, 4)?.toUpperCase() || "RUN"}
        </div>

        {/* Sneaker Photo with High Velocity Zoom & Lift */}
        <div className="relative z-10 w-full aspect-[4/3] flex items-center justify-center">
          <img
            src={imageSrc}
            alt={product.name}
            className="w-full h-full object-contain filter drop-shadow-[0_15px_20px_rgba(0,0,0,0.8)] group-hover:scale-110 group-hover:-rotate-3 group-hover:-translate-y-2 transition-all duration-500 ease-out"
            loading="lazy"
          />
        </div>

        {/* Floating Quick Inspect Pill */}
        <div
          className={`absolute bottom-3 bg-black/80 backdrop-blur-md border border-zinc-700 text-zinc-200 text-[10px] font-mono uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1.5 transition-all duration-300 ${
            hovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
          }`}
        >
          <Eye size={12} className="text-lime-400" />
          <span>Inspect Sole Tech</span>
        </div>
      </div>

      {/* Card Body & Specs */}
      <div className="p-5 pt-2 space-y-4 border-t border-zinc-800/50 bg-[#101013]/60">
        {/* Name & Energy Return */}
        <div>
          <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 mb-1">
            <span className="uppercase tracking-widest">{product.category || "Footwear"}</span>
            <span className="text-lime-400 font-bold">{product.energyReturn || "86% Return"}</span>
          </div>
          <h3 className="text-sm sm:text-base font-black text-white font-mono uppercase tracking-tight group-hover:text-lime-400 transition line-clamp-1">
            {product.name}
          </h3>
          <p className="text-xs text-zinc-400 line-clamp-1 mt-1 font-sans">
            {product.description || "Supercritical foam midsole with responsive full-length propulsion plate."}
          </p>
        </div>

        {/* Interactive Size Selector Pills directly on the card */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[10px] font-mono">
            <span className="text-zinc-400 uppercase">SELECT {sizeStandard} SIZE:</span>
            <span className="text-lime-400 font-bold">{sizeStandard} {selectedSize}</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {availableSizes.slice(0, 6).map((sz) => (
              <button
                key={sz}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedSize(sz);
                }}
                className={`h-7 px-2.5 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer border ${
                  selectedSize === sz
                    ? "bg-lime-400 text-black border-lime-400 shadow-md shadow-lime-500/20"
                    : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-white"
                }`}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-3">
          <div>
            <div className="flex items-baseline gap-2 font-mono">
              <span className="text-lg font-black text-white">
                ₹{Number(product.price || 0).toLocaleString()}
              </span>
              {product.compareAtPrice && (
                <span className="text-xs text-zinc-500 line-through">
                  ₹{Number(product.compareAtPrice).toLocaleString()}
                </span>
              )}
            </div>
            <span className="text-[9px] font-mono text-emerald-400 font-bold block">
              ⚡ In Stock • Dispatches in 24h
            </span>
          </div>

          {outOfStock ? (
            <span className="px-3 py-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-mono font-black uppercase">
              Sold Out
            </span>
          ) : (
            <button
              onClick={handleQuickAdd}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-lime-400 to-lime-500 hover:from-lime-300 hover:to-lime-400 text-black font-mono font-black text-xs uppercase tracking-wider transition-all shadow-md shadow-lime-500/20 hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <ShoppingBag size={14} className="fill-black" />
              <span>Cop</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
