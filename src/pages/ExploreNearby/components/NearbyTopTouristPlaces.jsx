import React, { useRef } from "react";
import { Compass, ChevronRight, ChevronLeft } from "lucide-react";

export default function NearbyTopTouristPlaces({
  touristPlaces = [],
  onSelectCity,
}) {
  const scrollRef = useRef(null);

  if (!touristPlaces || touristPlaces.length === 0) return null;

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const offset = direction === "left" ? -280 : 280;
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Compass size={20} className="text-blue-600" />
          <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
            Explore Top Tourist Places
          </h3>
          <span className="px-2 py-0.5 rounded-full bg-red-600 text-white font-black text-[9px] uppercase tracking-wider">
            NEW
          </span>
        </div>
      </div>

      {/* Movable Horizontal Carousel */}
      <div
        ref={scrollRef}
        className="flex gap-3.5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 pt-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {touristPlaces.map((tp) => (
          <div
            key={tp.id}
            onClick={() => onSelectCity(tp.city)}
            className="shrink-0 w-64 sm:w-72 snap-start group flex items-center gap-3 p-3 rounded-2xl bg-white hover:bg-blue-50/60 border border-slate-200/80 hover:border-blue-400 transition-all cursor-pointer shadow-2xs hover:shadow-md"
          >
            {/* Thumbnail */}
            <div className="w-16 h-14 sm:w-20 sm:h-16 rounded-xl overflow-hidden bg-slate-200 shrink-0 border border-slate-100">
              <img
                src={tp.image}
                alt={tp.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                loading="lazy"
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 space-y-0.5">
              <h5 className="text-xs sm:text-sm font-black text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                {tp.name}
              </h5>
              <p className="text-[10px] text-slate-400 truncate">
                {tp.subtitle}
              </p>
              <div className="inline-flex items-center gap-0.5 text-[11px] font-bold text-blue-600 pt-0.5">
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
  );
}
