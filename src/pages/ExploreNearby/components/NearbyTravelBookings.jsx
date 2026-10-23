import React from "react";
import { Plane, Bus, Train, Building, Car, ChevronRight, ShieldCheck } from "lucide-react";

const TRAVEL_ICONS = {
  Plane,
  Bus,
  Train,
  Building,
  Car,
};

export default function NearbyTravelBookings({
  travelBookings = [],
  onSelectCategory,
}) {
  if (!travelBookings || travelBookings.length === 0) return null;

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Travel Bookings</span>
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
              Verified Partners
            </span>
          </h3>
          <p className="text-xs text-slate-500">
            Instant hotel & transit bookings for your best journey experience.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onSelectCategory("travel")}
          className="text-xs font-bold text-blue-600 hover:text-blue-800 inline-flex items-center gap-0.5 cursor-pointer self-start sm:self-auto"
        >
          <span>Explore More</span>
          <ChevronRight size={14} />
        </button>
      </div>

      {/* 5 Icons Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {travelBookings.map((tb) => {
          const Icon = TRAVEL_ICONS[tb.icon] || Plane;
          return (
            <button
              key={tb.id}
              type="button"
              onClick={() => onSelectCategory("travel")}
              className="group flex flex-col items-center text-center p-3 sm:p-4 rounded-2xl bg-slate-50 hover:bg-blue-50/70 border border-slate-200/60 hover:border-blue-300 transition-all cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-white text-blue-600 flex items-center justify-center shadow-xs border border-slate-100 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-200">
                <Icon size={22} />
              </div>
              <h5 className="mt-2.5 text-xs font-black text-slate-900 group-hover:text-blue-700 transition-colors">
                {tb.name}
              </h5>
              <span className="text-[10px] text-slate-500 font-medium">
                {tb.subtitle}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
