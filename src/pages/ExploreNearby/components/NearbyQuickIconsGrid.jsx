import React, { useState } from "react";
import {
  Utensils,
  Hotel,
  Sparkles,
  Home,
  Compass,
  HeartHandshake,
  GraduationCap,
  KeyRound,
  Activity,
  Hammer,
  PawPrint,
  BedDouble,
  Building2,
  Stethoscope,
  Dumbbell,
  Landmark,
  PartyPopper,
  Car,
  Truck,
  LayoutGrid,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const ICON_MAP = {
  Utensils,
  Hotel,
  Sparkles,
  Home,
  Compass,
  HeartHandshake,
  GraduationCap,
  KeyRound,
  Activity,
  Hammer,
  PawPrint,
  BedDouble,
  Building2,
  Stethoscope,
  Dumbbell,
  Landmark,
  PartyPopper,
  Car,
  Truck,
  LayoutGrid,
};

export default function NearbyQuickIconsGrid({
  categories = [],
  activeCategory = "all",
  onSelectCategory,
}) {
  const [expandedRows, setExpandedRows] = useState(1); // 1 = row 1, 2 = row 2, 3 = all

  if (!categories || categories.length === 0) return null;

  // Row 1: First 9 items + 1 "More" button (10 items total = exactly 1 row on lg:grid-cols-10)
  // Row 2: First 19 items (10 on row 1 + 9 on row 2) + 1 "More" button (20 items total = 2 rows)
  // Row 3: All items + 1 "Less" button to collapse back
  let displayedItems = [];
  let actionButton = null;

  if (expandedRows === 1) {
    displayedItems = categories.slice(0, 9);
    actionButton = {
      type: "more",
      nextRow: 2,
      label: "More",
      badge: `+${Math.max(categories.length - 9, 0)}`,
    };
  } else if (expandedRows === 2) {
    displayedItems = categories.slice(0, 19);
    if (categories.length > 19) {
      actionButton = {
        type: "more",
        nextRow: 3,
        label: "More",
        badge: `+${categories.length - 19}`,
      };
    } else {
      actionButton = {
        type: "less",
        nextRow: 1,
        label: "Less",
        badge: null,
      };
    }
  } else {
    displayedItems = categories;
    actionButton = {
      type: "less",
      nextRow: 1,
      label: "Less",
      badge: null,
    };
  }

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs">
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-10 gap-2.5 sm:gap-3.5">
        {displayedItems.map((cat) => {
          const IconComponent = ICON_MAP[cat.icon] || LayoutGrid;
          const isSelected = activeCategory === cat.slug;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.slug)}
              className={`group relative flex flex-col items-center justify-between p-2.5 sm:p-3 rounded-2xl transition-all duration-200 cursor-pointer text-center ${
                isSelected
                  ? "bg-blue-50/80 border-2 border-blue-600 shadow-sm"
                  : "bg-white hover:bg-slate-50 border border-slate-200/70 hover:border-blue-300"
              }`}
            >
              {/* Badge if any */}
              {cat.badge && (
                <span className="absolute -top-1.5 right-1.5 px-1.5 py-0.2 rounded-full bg-red-600 text-white font-black text-[8px] uppercase tracking-wider shadow-xs animate-pulse">
                  {cat.badge}
                </span>
              )}

              {/* Icon Box */}
              <div
                className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-108 duration-200 ${
                  isSelected ? "bg-blue-600 text-white" : cat.color
                }`}
              >
                <IconComponent size={20} className="shrink-0" />
              </div>

              {/* Label */}
              <span
                className={`mt-2 text-[11px] sm:text-xs font-bold leading-tight line-clamp-1 transition-colors ${
                  isSelected ? "text-blue-700 font-black" : "text-slate-700 group-hover:text-blue-600"
                }`}
              >
                {cat.name}
              </span>
            </button>
          );
        })}

        {/* Dynamic More / Less Action Button */}
        {actionButton && (
          actionButton.type === "more" ? (
            <button
              type="button"
              onClick={() => setExpandedRows(actionButton.nextRow)}
              className="group relative flex flex-col items-center justify-between p-2.5 sm:p-3 rounded-2xl transition-all duration-200 cursor-pointer text-center bg-blue-50/60 hover:bg-blue-100/80 border border-blue-200 hover:border-blue-400 shadow-2xs"
              title="Show Next Row of Categories"
            >
              {actionButton.badge && (
                <span className="absolute -top-1.5 right-1.5 px-1.5 py-0.2 rounded-full bg-blue-600 text-white font-black text-[8px] uppercase tracking-wider shadow-xs">
                  {actionButton.badge}
                </span>
              )}
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center bg-blue-600 text-white shadow-xs group-hover:scale-108 transition-transform duration-200">
                <ChevronDown size={20} className="group-hover:translate-y-0.5 transition-transform" />
              </div>
              <span className="mt-2 text-[11px] sm:text-xs font-black leading-tight text-blue-700">
                {actionButton.label}
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setExpandedRows(1)}
              className="group relative flex flex-col items-center justify-between p-2.5 sm:p-3 rounded-2xl transition-all duration-200 cursor-pointer text-center bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 shadow-2xs"
              title="Collapse to One Row"
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center bg-slate-800 text-white shadow-xs group-hover:scale-108 transition-transform duration-200">
                <ChevronUp size={20} className="group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <span className="mt-2 text-[11px] sm:text-xs font-black leading-tight text-slate-800">
                Less
              </span>
            </button>
          )
        )}
      </div>
    </div>
  );
}
