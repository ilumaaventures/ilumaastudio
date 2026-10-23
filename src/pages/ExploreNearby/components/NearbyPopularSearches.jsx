import React, { useRef } from "react";
import { Sparkles, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

export default function NearbyPopularSearches({
  popularSearches = [],
  onOpenEnquiry,
  onSelectCategory,
}) {
  const scrollRef = useRef(null);

  if (!popularSearches || popularSearches.length === 0) return null;

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const offset = direction === "left" ? -280 : 280;
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-4">
      {/* Section Header with Controls */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <span>Popular Searches</span>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
            Top Demand
          </span>
        </h3>
      </div>

      {/* Movable Horizontal Carousel */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 pt-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {popularSearches.map((item) => (
          <div
            key={item.id}
            className="shrink-0 w-60 sm:w-64 snap-start group rounded-3xl overflow-hidden bg-white border border-slate-200/80 shadow-2xs hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col justify-between"
          >
            {/* Image Upper Half */}
            <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-2 left-2 right-2">
                <h4 className="text-xs sm:text-sm font-black text-white leading-tight drop-shadow-md">
                  {item.title}
                </h4>
              </div>
            </div>

            {/* Blue Lower Half with CTA */}
            <div className="p-3 bg-blue-600 group-hover:bg-blue-700 transition-colors flex items-center justify-between">
              <span className="text-[10px] text-blue-100 font-medium truncate max-w-[90px]">
                Verified Pros
              </span>

              <button
                type="button"
                onClick={() => {
                  if (item.actionType === "enquiry") {
                    onOpenEnquiry(item.title, item.category);
                  } else {
                    onSelectCategory(item.category);
                  }
                }}
                className="px-3 py-1.5 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-black text-[11px] shadow-sm transition-all flex items-center gap-1 cursor-pointer shrink-0"
              >
                <span>{item.ctaText}</span>
                <ArrowRight size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
