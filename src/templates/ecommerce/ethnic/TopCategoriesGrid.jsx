import React from "react";
import { ArrowRight } from "lucide-react";

export default function TopCategoriesGrid({
  categories = [],
  onSelectCategory,
  onViewAll,
}) {
  const defaultCategories = [
    {
      id: "Jumpsuits",
      name: "Jumpsuits",
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80",
    },
    {
      id: "Dresses",
      name: "Dresses",
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80",
    },
    {
      id: "Modern Look",
      name: "Modern Look",
      image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop&q=80",
    },
    {
      id: "Women's PALAZZO",
      name: "Women's PALAZZO",
      image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&auto=format&fit=crop&q=80",
    },
    {
      id: "Women's Pyjama",
      name: "Women's Pyjama",
      image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80",
    },
    {
      id: "3/4 Sleeve Kurti's",
      name: "3/4 Sleeve Kurti's",
      image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80",
    },
  ];

  const items = categories && categories.length >= 6 ? categories.slice(0, 6) : defaultCategories;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 text-left">
      {/* Section Title */}
      <div className="pb-5">
        <h2 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight">
          Top categories
        </h2>
      </div>

      {/* 3x2 Grid matching Reference Screenshot */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
        {items.map((cat) => (
          <div
            key={cat.id || cat._id || cat.name}
            onClick={() => onSelectCategory && onSelectCategory(cat.name || cat.id)}
            className="group relative bg-[#F4EFEA] border border-stone-200 overflow-hidden cursor-pointer select-none transition-all duration-300 hover:shadow-md"
          >
            {/* Model Photo Container */}
            <div className="relative w-full aspect-[4/5] overflow-hidden flex items-center justify-center p-3">
              {/* Soft warm circular halo glow */}
              <div className="absolute inset-4 rounded-full bg-[#E8DDD1]/70 blur-xl pointer-events-none" />

              <img
                src={cat.image}
                alt={cat.name}
                className="relative z-10 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>

            {/* Bottom Category Label Strip with Arrow */}
            <div className="bg-white px-4 py-3 border-t border-stone-200 flex items-center justify-between text-left">
              <span className="text-xs sm:text-[13px] font-semibold text-stone-900 group-hover:text-black">
                {cat.name}
              </span>
              <span className="text-stone-700 group-hover:translate-x-1 transition-transform">
                <ArrowRight size={15} />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Centered Solid Black "View all" Button matching Screenshot */}
      <div className="pt-8 flex justify-center">
        <button
          type="button"
          onClick={onViewAll}
          className="px-8 py-2.5 bg-black hover:bg-stone-800 text-white text-xs font-semibold uppercase tracking-wider transition cursor-pointer shadow-sm active:scale-95"
        >
          View all
        </button>
      </div>
    </section>
  );
}
