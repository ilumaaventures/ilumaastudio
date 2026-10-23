import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Clock, Navigation, Bookmark, Trees } from "lucide-react";
import toast from "react-hot-toast";

export default function NearbyPlaceCard({
  place,
  onAddToPlan,
  isInPlan = false,
}) {
  const handleGetDirections = () => {
    toast(`Navigation directions opened for ${place.name} (Demo mode).`, {
      icon: "🧭",
    });
  };

  return (
    <div className="group bg-white rounded-3xl border border-slate-200/80 hover:border-emerald-300 shadow-2xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full">
      <div className="relative h-44 overflow-hidden bg-slate-100">
        <img
          src={place.image}
          alt={place.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Distance Badge */}
        <div className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/85 backdrop-blur-md text-white text-[10px] font-black shadow-sm">
          <MapPin size={11} className="text-emerald-400" />
          <span>{place.distanceKm} km away</span>
        </div>

        {/* Public Place Badge */}
        <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-emerald-600/90 text-white text-[10px] font-black backdrop-blur-xs">
          {place.placeType}
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          <div className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
            <Trees size={13} />
            <span>
              {place.area}, {place.city}
            </span>
          </div>

          <Link
            to={`/explore-nearby/${place.id}`}
            className="block font-black text-slate-900 text-lg leading-tight group-hover:text-emerald-700 transition-colors"
          >
            {place.name}
          </Link>

          <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
            {place.description}
          </p>

          <div className="flex items-center gap-1.5 text-xs text-slate-400 pt-1">
            <Clock size={12} className="shrink-0" />
            <span>{place.timings}</span>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <span className="text-[11px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
            Public Destination
          </span>

          <div className="flex items-center gap-1.5">
            {onAddToPlan && (
              <button
                type="button"
                onClick={() => onAddToPlan(place)}
                className={`p-2 rounded-xl border text-xs transition cursor-pointer ${
                  isInPlan
                    ? "bg-indigo-50 border-indigo-200 text-indigo-600 font-bold"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-indigo-600"
                }`}
                title={isInPlan ? "In Neighbourhood Plan" : "Add to Neighbourhood Plan"}
              >
                <Bookmark size={15} className={isInPlan ? "fill-current" : ""} />
              </button>
            )}

            <button
              type="button"
              onClick={handleGetDirections}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white text-xs font-extrabold shadow-sm transition-colors cursor-pointer"
            >
              <Navigation size={12} />
              <span>Directions</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
