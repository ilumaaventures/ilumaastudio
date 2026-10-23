import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Clock, Utensils, Navigation, Bookmark, Star } from "lucide-react";
import toast from "react-hot-toast";

export default function NearbyFoodCard({
  foodPlace,
  onAddToPlan,
  isInPlan = false,
}) {
  const handleDirections = () => {
    toast(`Navigation route to ${foodPlace.name} calculated (Demo Map).`, {
      icon: "📍",
    });
  };

  return (
    <div className="group bg-white rounded-3xl border border-slate-200/80 hover:border-rose-300 shadow-2xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full">
      {/* Cover Image */}
      <div className="relative h-44 overflow-hidden bg-slate-100">
        <img
          src={foodPlace.image}
          alt={foodPlace.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Distance Badge */}
        <div className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/85 backdrop-blur-md text-white text-[10px] font-black shadow-sm">
          <MapPin size={11} className="text-rose-400" />
          <span>{foodPlace.distanceKm} km away</span>
        </div>

        {/* Price Range Pill */}
        <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-slate-900/80 text-amber-300 text-[10px] font-black backdrop-blur-md">
          {foodPlace.priceRange || "₹₹"}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-extrabold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
              {foodPlace.cuisine}
            </span>
            <div className="flex items-center gap-1 text-slate-700 font-black text-xs">
              <Star size={12} className="text-amber-500 fill-amber-500" />
              <span>{foodPlace.rating}</span>
            </div>
          </div>

          <Link
            to={`/explore-nearby/${foodPlace.id}`}
            className="block font-black text-slate-900 text-lg leading-tight group-hover:text-rose-600 transition-colors"
          >
            {foodPlace.name}
          </Link>

          <p className="text-xs text-slate-500 leading-relaxed">
            <strong className="text-slate-700">Must Try:</strong> {foodPlace.specialty}
          </p>

          <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
            <Clock size={12} className="shrink-0" />
            <span>{foodPlace.timings}</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <span className="text-xs text-slate-500 font-medium">
            {foodPlace.area}, {foodPlace.city}
          </span>

          <div className="flex items-center gap-1.5">
            {onAddToPlan && (
              <button
                type="button"
                onClick={() => onAddToPlan(foodPlace)}
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
              onClick={handleDirections}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-900 hover:bg-rose-600 text-white text-xs font-extrabold shadow-sm transition-colors cursor-pointer"
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
