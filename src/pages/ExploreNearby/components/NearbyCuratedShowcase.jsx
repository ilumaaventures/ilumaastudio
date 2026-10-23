import React from "react";
import { ChevronRight } from "lucide-react";

export default function NearbyCuratedShowcase({
  collections = [],
  onSelectCategory,
}) {
  if (!collections || collections.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {collections.map((col) => (
        <div
          key={col.id}
          className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs space-y-4 hover:border-slate-300 transition-colors"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              {col.title}
            </h3>
            <button
              type="button"
              onClick={() => onSelectCategory(col.items[0]?.slug || "all")}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-0.5 cursor-pointer"
            >
              <span>Explore All</span>
              <ChevronRight size={14} />
            </button>
          </div>

          {/* 3 Subcategory Items Grid */}
          <div className="grid grid-cols-3 gap-3">
            {col.items?.map((sub, idx) => (
              <div
                key={idx}
                onClick={() => onSelectCategory(sub.slug || "all")}
                className="group flex flex-col items-center text-center cursor-pointer space-y-2"
              >
                {/* Image Container */}
                <div className="relative w-full aspect-4/3 rounded-2xl overflow-hidden bg-slate-100 border border-slate-100 group-hover:shadow-md group-hover:border-blue-300 transition-all duration-300">
                  <img
                    src={sub.image}
                    alt={sub.name}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                </div>

                {/* Name & Count */}
                <div>
                  <h5 className="text-xs font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-tight line-clamp-1">
                    {sub.name}
                  </h5>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {sub.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
