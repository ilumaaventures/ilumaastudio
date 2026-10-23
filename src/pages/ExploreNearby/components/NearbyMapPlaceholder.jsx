import React, { useState } from "react";
import {
  MapPin,
  Compass,
  Navigation,
  Plus,
  Minus,
  Layers,
  Store,
  Coffee,
  Sparkles,
  ShoppingBag,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function NearbyMapPlaceholder({
  city = "Lucknow",
  area = "Gomti Nagar",
  radius = 15,
  items = [],
  onSelectItem,
}) {
  const [selectedMarker, setSelectedMarker] = useState(items[0] || null);
  const [zoomLevel, setZoomLevel] = useState(13);

  // Deterministic mock positions plotted across a circular 2D coordinate grid
  const markerPositions = [
    { top: "35%", left: "42%" },
    { top: "28%", left: "58%" },
    { top: "52%", left: "32%" },
    { top: "60%", left: "62%" },
    { top: "45%", left: "50%" },
    { top: "22%", left: "38%" },
    { top: "68%", left: "45%" },
    { top: "40%", left: "70%" },
  ];

  return (
    <div className="relative w-full h-[580px] sm:h-[640px] bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
      {/* Map Graphic Canvas Simulation */}
      <div className="absolute inset-0 bg-[#0f172a] overflow-hidden select-none">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(#38bdf8 1px, transparent 1px), radial-gradient(#38bdf8 1px, #0f172a 1px)",
            backgroundSize: "40px 40px",
            backgroundPosition: "0 0, 20px 20px",
          }}
        />

        {/* Concentric Radius Circles */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full border border-blue-500/20 bg-blue-500/5 animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] h-[260px] rounded-full border border-blue-400/30 bg-blue-500/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120px] h-[120px] rounded-full border border-blue-300/40 bg-blue-500/10" />

        {/* User Central Location Pin */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center pointer-events-none">
          <div className="relative flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-blue-500 animate-ping opacity-60 absolute" />
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg border-2 border-white font-bold text-xs">
              <MapPin size={20} />
            </div>
          </div>
          <div className="mt-1 px-2.5 py-0.5 rounded-full bg-slate-900/90 text-white text-[10px] font-black tracking-wide border border-blue-400/30 backdrop-blur-xs whitespace-nowrap shadow-md">
            You: {area || city}
          </div>
        </div>

        {/* Interactive Sample Pins */}
        {items.slice(0, 8).map((item, idx) => {
          const pos = markerPositions[idx % markerPositions.length];
          const isSelected = selectedMarker?.id === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedMarker(item)}
              style={{ top: pos.top, left: pos.left }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 transition-all duration-300 cursor-pointer group ${
                isSelected ? "scale-125 z-30" : "hover:scale-110"
              }`}
              title={item.name || item.title}
            >
              <div
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-black shadow-lg border transition-all ${
                  isSelected
                    ? "bg-[#2563eb] text-white border-white ring-4 ring-blue-500/40"
                    : "bg-white/95 text-slate-900 border-slate-300 group-hover:bg-blue-50"
                }`}
              >
                <MapPin size={11} className={isSelected ? "text-white" : "text-[#2563eb]"} />
                <span className="truncate max-w-[85px]">{item.name || item.title}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Floating Map Controls & Overlays */}
      <div className="absolute top-4 left-4 z-30">
        <div className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700/80 backdrop-blur-md text-white text-xs font-bold flex items-center gap-2 shadow-lg">
          <Compass size={14} className="text-blue-400 animate-spin-slow" />
          <span>Interactive Discovery Map</span>
          <span className="text-[10px] text-amber-300 font-normal">(Sample preview)</span>
        </div>
      </div>

      {/* Zoom / Navigation Controls */}
      <div className="absolute top-4 right-4 z-30 flex flex-col gap-1.5">
        <button
          type="button"
          onClick={() => setZoomLevel((z) => Math.min(18, z + 1))}
          className="w-8 h-8 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-white flex items-center justify-center transition shadow-lg"
          title="Zoom In"
        >
          <Plus size={16} />
        </button>
        <button
          type="button"
          onClick={() => setZoomLevel((z) => Math.max(8, z - 1))}
          className="w-8 h-8 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-white flex items-center justify-center transition shadow-lg"
          title="Zoom Out"
        >
          <Minus size={16} />
        </button>
      </div>

      {/* Radius Indicator Pill */}
      <div className="absolute bottom-4 left-4 z-30 hidden sm:block">
        <div className="px-3 py-1.5 rounded-xl bg-slate-900/85 border border-slate-700 backdrop-blur-md text-slate-300 text-xs">
          Radius: <strong className="text-white">{radius} km</strong> around{" "}
          <strong className="text-white">{area || city}</strong> • Zoom {zoomLevel}x
        </div>
      </div>

      {/* Active Pin Detail Card Popover */}
      {selectedMarker && (
        <div className="absolute bottom-4 right-4 left-4 sm:left-auto sm:w-80 z-30 bg-white/95 backdrop-blur-md text-slate-900 rounded-2xl p-3.5 shadow-2xl border border-slate-200 animate-in slide-in-from-bottom-2 duration-200">
          <div className="flex gap-3">
            {selectedMarker.image && (
              <img
                src={selectedMarker.image}
                alt={selectedMarker.name || selectedMarker.title}
                className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-100"
              />
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-extrabold uppercase text-[#2563eb] tracking-wider">
                  {selectedMarker.category || selectedMarker.type}
                </span>
                <span className="text-slate-500 font-bold">
                  {selectedMarker.distanceKm} km
                </span>
              </div>
              <h4 className="font-black text-slate-900 text-xs sm:text-sm truncate mt-0.5">
                {selectedMarker.name || selectedMarker.title}
              </h4>
              <p className="text-[10px] text-slate-500 truncate">
                {selectedMarker.area}, {selectedMarker.city}
              </p>
              {selectedMarker?.price && (
                <div className="mt-1 text-xs font-black text-slate-900">
                  ₹{Number(selectedMarker.price || 0).toLocaleString("en-IN")}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
