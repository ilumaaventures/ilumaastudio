import React, { useRef } from "react";
import { Flame, ChevronRight, ChevronLeft } from "lucide-react";

export default function NearbyTrendingSearches({
  trendingSearches = [],
  onSelectCategory,
}) {
  const scrollRef = useRef(null);

  if (!trendingSearches || trendingSearches.length === 0) return null;

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
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              Trending Searches Near You
            </h3>
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-red-100 text-red-600 font-black text-[9px] uppercase tracking-wider">
              <Flame size={10} className="fill-red-500" />
              <span>HOT</span>
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Stay updated with the latest neighbourhood trends and active
            enquiries.
          </p>
        </div>
      </div>

      {/* Movable Horizontal Carousel */}
      <div
        ref={scrollRef}
        className="flex gap-3.5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 pt-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {trendingSearches.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectCategory(item.category || "all")}
            className="shrink-0 w-64 sm:w-72 snap-start group flex items-center gap-3 p-3 rounded-2xl bg-slate-50 hover:bg-blue-50/70 border border-slate-200/70 hover:border-blue-300 transition-all cursor-pointer"
          >
            {/* Thumbnail */}
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-200 shrink-0 border border-slate-200">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                loading="lazy"
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <span className="text-[9px] font-black uppercase text-blue-600">
                {item.badge}
              </span>
              <h5 className="text-xs font-black text-slate-900 truncate group-hover:text-blue-700 transition-colors">
                {item.title}
              </h5>
              <div className="flex items-center gap-0.5 text-[11px] font-bold text-blue-600 mt-0.5">
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
