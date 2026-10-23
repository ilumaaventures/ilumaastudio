import React from "react";
import {
  Compass,
  ShoppingBag,
  Building2,
  Sparkles,
  Coffee,
  Gift,
  Shirt,
  Heart,
  Home,
  Laptop,
  Calendar,
  MapPin,
  Tag,
} from "lucide-react";
import { NEARBY_CATEGORIES } from "../../../data/nearbyMockData";

const ICON_MAP = {
  Compass,
  ShoppingBag,
  Building2,
  Sparkles,
  Coffee,
  Gift,
  Shirt,
  Heart,
  Home,
  Laptop,
  Calendar,
  MapPin,
  Tag,
};

export default function NearbyCategoryNav({
  activeCategory = "all",
  onSelectCategory,
  categoryCounts = {},
}) {
  return (
    <div className="bg-white border-b border-slate-200 sticky top-[65px] z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
          {NEARBY_CATEGORIES.map((cat) => {
            const IconComponent = ICON_MAP[cat.icon] || Compass;
            const isActive = activeCategory === cat.slug;
            const count = categoryCounts[cat.slug] !== undefined ? categoryCounts[cat.slug] : null;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.slug)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#2563eb] text-white shadow-md shadow-blue-500/25 scale-102"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200/80"
                }`}
              >
                <IconComponent
                  size={15}
                  className={isActive ? "text-white" : "text-[#2563eb]"}
                />
                <span className="whitespace-nowrap">{cat.name}</span>
                {count !== null && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
