import React from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Clock,
  Sparkles,
  Calendar,
  Bookmark,
  Check,
  Building2,
} from "lucide-react";
import toast from "react-hot-toast";

export default function NearbyServiceCard({
  service,
  onAddToPlan,
  isInPlan = false,
}) {
  const handleDemoBooking = () => {
    toast.success(
      `Appointment inquiry initiated for "${service.title}". A partner representative will contact you. (Demo action)`,
      { duration: 4000 },
    );
  };

  return (
    <div className="group bg-white rounded-3xl border border-slate-200/80 hover:border-purple-300 shadow-2xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full">
      {/* Cover Image */}
      <div className="relative h-44 overflow-hidden bg-slate-100">
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Distance Badge */}
        <div className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/85 backdrop-blur-md text-white text-[10px] font-black shadow-sm">
          <MapPin size={11} className="text-purple-400" />
          <span>{service.distanceKm} km away</span>
        </div>

        {/* Booking Mode Pill */}
        <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded-md bg-purple-600/90 text-white text-[9px] font-black backdrop-blur-xs">
          {service.bookingType || "Doorstep or In-Clinic"}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          {/* Provider Name */}
          <div className="flex items-center gap-1.5 text-xs text-purple-700 font-extrabold">
            <Building2 size={13} className="shrink-0" />
            <span className="truncate">{service.providerName}</span>
          </div>

          {/* Title */}
          <Link
            to={`/explore-nearby/${service.id}`}
            className="block font-black text-slate-900 text-base leading-snug group-hover:text-purple-700 transition-colors line-clamp-2"
          >
            {service.title}
          </Link>

          {/* Description */}
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {service.description}
          </p>

          {/* Duration & Availability */}
          <div className="flex items-center gap-3 pt-1 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-1 text-slate-600">
              <Clock size={12} className="text-slate-400 shrink-0" />
              <span>{service.duration}</span>
            </div>
            <span className="text-slate-300">•</span>
            <span className="text-emerald-600 font-bold text-[11px]">
              {service.availability}
            </span>
          </div>
        </div>

        {/* Pricing & Booking */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">Starting from</span>
            <span className="text-lg font-black text-slate-900">
              ₹{Number(service?.startingPrice || service?.price || 0).toLocaleString("en-IN")}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Add to Neighbourhood Plan */}
            {onAddToPlan && (
              <button
                type="button"
                onClick={() => onAddToPlan(service)}
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

            {/* Book Appointment CTA */}
            <button
              type="button"
              onClick={handleDemoBooking}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold shadow-sm shadow-purple-500/20 transition-all cursor-pointer"
            >
              <Calendar size={13} />
              <span>Book</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
