import React, { useRef } from "react";
import { Sun, Sparkles, ChevronRight, ChevronLeft } from "lucide-react";

export default function NearbySeasonalSections({
  seasonalEssentials = [],
  festiveDemands = [],
  onSelectCategory,
}) {
  const seasonalRef = useRef(null);
  const festiveRef = useRef(null);

  const handleScroll = (ref, direction) => {
    if (ref.current) {
      const offset = direction === "left" ? -280 : 280;
      ref.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Sunny Day Essentials */}
      {seasonalEssentials && seasonalEssentials.length > 0 && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Sun size={18} className="text-amber-500" />
                <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Sunny Day Essentials
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-600 text-white font-black text-[9px] uppercase tracking-wider">
                  SEASONAL
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Discover wide range of summer essentials and doorstep
                water/cooling services.
              </p>
            </div>
          </div>

          {/* Movable Horizontal Carousel */}
          <div
            ref={seasonalRef}
            className="flex gap-3.5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 pt-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {seasonalEssentials.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectCategory(item.slug || "services")}
                className="shrink-0 w-60 sm:w-64 snap-start group flex items-center gap-3 p-3 rounded-2xl bg-slate-50 hover:bg-amber-50/60 border border-slate-200/70 hover:border-amber-300 transition-all cursor-pointer shadow-2xs"
              >
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-200 shrink-0 border border-slate-200">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="text-xs font-black text-slate-900 truncate group-hover:text-amber-700 transition-colors">
                    {item.title}
                  </h5>
                  <div className="inline-flex items-center gap-0.5 text-[11px] font-bold text-amber-700 pt-0.5">
                    <span>Explore</span>
                    <ChevronRight
                      size={12}
                      className="group-hover:translate-x-0.5 transition-transform"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Festive Demands */}
      {festiveDemands && festiveDemands.length > 0 && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-purple-600" />
                <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Festive Demands
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-red-600 text-white font-black text-[9px] uppercase tracking-wider">
                  FESTIVE
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Book live bands, DJ setups, instruments and sound rentals for
                celebrations.
              </p>
            </div>
          </div>

          {/* Movable Horizontal Carousel */}
          <div
            ref={festiveRef}
            className="flex gap-3.5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 pt-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {festiveDemands.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectCategory(item.slug || "services")}
                className="shrink-0 w-60 sm:w-64 snap-start group flex items-center gap-3 p-3 rounded-2xl bg-slate-50 hover:bg-purple-50/60 border border-slate-200/70 hover:border-purple-300 transition-all cursor-pointer shadow-2xs"
              >
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-200 shrink-0 border border-slate-200">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="text-xs font-black text-slate-900 truncate group-hover:text-purple-700 transition-colors">
                    {item.title}
                  </h5>
                  <div className="inline-flex items-center gap-0.5 text-[11px] font-bold text-purple-700 pt-0.5">
                    <span>Explore</span>
                    <ChevronRight
                      size={12}
                      className="group-hover:translate-x-0.5 transition-transform"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
