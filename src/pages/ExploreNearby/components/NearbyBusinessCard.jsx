import React from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Clock,
  ShieldCheck,
  Package,
  Sparkles,
  ArrowRight,
  Bookmark,
  Check,
} from "lucide-react";

export default function NearbyBusinessCard({
  business,
  onAddToPlan,
  isInPlan = false,
}) {
  return (
    <div className="group bg-white rounded-3xl border border-slate-200/80 hover:border-blue-300 shadow-2xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full">
      {/* Cover Image & Badges */}
      <div className="relative h-44 sm:h-48 overflow-hidden bg-slate-100">
        <img
          src={business.image}
          alt={business.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Distance Badge */}
        <div className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/85 backdrop-blur-md text-white text-[10px] font-black shadow-sm">
          <MapPin size={11} className="text-blue-400" />
          <span>{business.distanceKm} km away</span>
        </div>

        {/* Open / Closed Status */}
        <div
          className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-black backdrop-blur-md shadow-sm ${
            business.isOpen
              ? "bg-emerald-500/90 text-white"
              : "bg-slate-800/90 text-slate-200"
          }`}
        >
          {business.isOpen ? "Open Now" : "Closed"}
        </div>

        {/* Store Logo Avatar */}
        <div className="absolute -bottom-4 left-5 w-12 h-12 rounded-2xl bg-white p-1 shadow-md border border-slate-200/80 overflow-hidden">
          <img
            src={business.logo || business.image}
            alt={business.name}
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
      </div>

      {/* Content */}
      <div className="pt-6 p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Category & Verified Badge */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
              {business.category}
            </span>
            {business.isVerified && (
              <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                <ShieldCheck size={11} />
                <span>Verified Local</span>
              </span>
            )}
          </div>

          {/* Business Name */}
          <Link
            to={`/explore-nearby/${business.id}`}
            className="block font-black text-slate-900 text-lg leading-tight group-hover:text-[#2563eb] transition-colors"
          >
            {business.name}
          </Link>

          {/* Tagline / Description */}
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {business.description || business.tagline}
          </p>

          {/* Address & Hours */}
          <div className="space-y-1 pt-1 text-xs text-slate-500">
            <div className="flex items-center gap-1.5 text-slate-600 font-medium truncate">
              <MapPin size={12} className="text-slate-400 shrink-0" />
              <span className="truncate">{business.address || `${business.area}, ${business.city}`}</span>
            </div>
            {business.openingHours && (
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                <Clock size={11} className="shrink-0" />
                <span>{business.openingHours}</span>
              </div>
            )}
          </div>
        </div>

        {/* Counts & Action Buttons */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          {/* Inventory Count Badges */}
          <div className="flex items-center gap-2 text-[10px] font-extrabold text-slate-600">
            {business.productCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100">
                <Package size={11} className="text-blue-600" />
                <span>{business.productCount} Products</span>
              </span>
            )}
            {business.serviceCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100">
                <Sparkles size={11} className="text-purple-600" />
                <span>{business.serviceCount} Services</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Add to Neighbourhood Plan */}
            {onAddToPlan && (
              <button
                type="button"
                onClick={() => onAddToPlan(business)}
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

            {/* View Detail Link */}
            <Link
              to={`/explore-nearby/${business.id}`}
              className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-[#2563eb] text-white text-xs font-extrabold shadow-sm transition-colors cursor-pointer"
            >
              <span>View</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
