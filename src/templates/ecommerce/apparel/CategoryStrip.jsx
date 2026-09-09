import React, { useRef } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";

export default function CategoryStrip({
  categories = [],
  activeCategory = "all",
  onSelectCategory,
  onViewAll,
}) {
  const scrollRef = useRef(null);

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 240, behavior: "smooth" });
    }
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -240, behavior: "smooth" });
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 text-left">
      {/* Header: All categories + View all > */}
      <div className="flex items-center justify-between pb-3 sm:pb-4">
        <h2 className="text-sm sm:text-base font-medium text-stone-900">
          All categories
        </h2>

        <button
          type="button"
          onClick={onViewAll}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8B5A2B] hover:text-[#704214] transition cursor-pointer"
        >
          <span>View all</span>
          <span className="w-5 h-5 rounded-full bg-[#8B5A2B] text-white flex items-center justify-center text-[10px]">
            <ChevronRight size={12} />
          </span>
        </button>
      </div>

      {/* Categories Horizontal Carousel */}
      <div className="relative group">
        {/* Left Scroll Button */}
        <button
          type="button"
          onClick={scrollLeft}
          className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white text-stone-800 shadow-md border border-stone-200 hidden group-hover:flex items-center justify-center transition hover:bg-stone-50 cursor-pointer"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Scrollable Container */}
        <div
          ref={scrollRef}
          className="flex items-center gap-3 sm:gap-4 overflow-x-auto scrollbar-none py-1 scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories.map((cat) => {
            const isSelected =
              activeCategory.toLowerCase() === cat.name.toLowerCase();

            return (
              <div
                key={cat._id || cat.name}
                onClick={() => onSelectCategory && onSelectCategory(cat.name)}
                className="flex-shrink-0 flex flex-col items-center gap-2 cursor-pointer select-none group/item"
              >
                {/* Category Thumbnail Box */}
                <div
                  className={`w-20 h-20 sm:w-24 sm:h-24 rounded-xs overflow-hidden bg-[#F2ECE4] border transition-all duration-200 p-0.5 ${
                    isSelected
                      ? "border-[#8B5A2B] ring-2 ring-[#8B5A2B]/20 scale-105"
                      : "border-stone-200 group-hover/item:border-stone-400"
                  }`}
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover object-top group-hover/item:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>

                {/* Category Label */}
                <span
                  className={`text-[11px] sm:text-xs font-normal truncate max-w-[84px] text-center ${
                    isSelected
                      ? "font-bold text-[#8B5A2B]"
                      : "text-stone-700 group-hover/item:text-black"
                  }`}
                >
                  {cat.name}
                </span>
              </div>
            );
          })}
        </div>

        {/* Right Scroll Button */}
        <button
          type="button"
          onClick={scrollRight}
          className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white text-stone-800 shadow-md border border-stone-200 flex items-center justify-center transition hover:bg-stone-50 cursor-pointer"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </section>
  );
}
