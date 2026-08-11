import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight, ShieldCheck, Star, MapPin, Clock3 } from "lucide-react";

export const formatLocation = (loc) => {
  if (!loc) return "Lucknow";
  if (typeof loc === "string") return loc;
  if (typeof loc === "object") {
    return loc.city || loc.address || loc.state || "Lucknow";
  }
  return "Lucknow";
};

export const formatDuration = (dur) => {
  if (!dur) return "45 mins";
  if (typeof dur === "string" || typeof dur === "number") return `${dur}`;
  if (typeof dur === "object") {
    return `${dur.value || dur.amount || 45} ${dur.unit || "mins"}`.trim();
  }
  return "45 mins";
};

export default function ServiceCard({ service }) {
  const navigate = useNavigate();
  const serviceId = service._id || service.id;

  return (
    <div
      onClick={() => navigate(`/services/${serviceId}`)}
      className="group shrink-0 w-[240px] sm:w-[270px] lg:w-[290px] snap-start cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Image */}
        <div className="relative h-[170px] sm:h-[185px] overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800">
          <img
            src={service.image}
            alt={service.name}
            draggable="false"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {/* Badge */}
          {service.badge && (
            <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm text-[10px] font-extrabold text-slate-800 dark:text-white shadow-sm">
              {service.badge}
            </span>
          )}

          {/* Quick View Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/services/${serviceId}`);
            }}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm flex items-center justify-center text-slate-800 dark:text-white opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-sm cursor-pointer"
            aria-label={`View ${service.name}`}
          >
            <ArrowUpRight size={17} />
          </button>

          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white">
            <ShieldCheck size={14} className="text-blue-400" />
            <span className="text-[10px] font-bold">Verified Professional</span>
          </div>
        </div>

        {/* Details */}
        <div className="pt-3 px-0.5 space-y-1">
          <p className="text-[10px] uppercase tracking-wider font-bold text-[#2563eb]">
            {typeof service.category === "object"
              ? service.category?.name || "Service"
              : service.category || "Service"}
          </p>

          <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white line-clamp-1">
            {service.name}
          </h3>

          <div className="flex items-center gap-2 pt-0.5">
            <div className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded-md">
              <Star size={10} className="fill-emerald-500 text-emerald-500" />
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                {service.rating || 4.8}
              </span>
            </div>

            <span className="text-[10px] text-slate-400">
              ({service.reviews || 0})
            </span>

            <span className="text-[10px] text-slate-300">•</span>

            <span className="text-[10px] text-slate-400 font-medium">
              {service.bookings || 0}+ booked
            </span>
          </div>

          <div className="flex items-center gap-1.5 pt-1 text-slate-400 text-[10px]">
            <MapPin size={12} className="shrink-0" />
            <span className="font-medium truncate">
              {formatLocation(service.location)}
            </span>
            <span className="text-slate-300">•</span>
            <Clock3 size={11} className="shrink-0" />
            <span>{formatDuration(service.duration)}</span>
          </div>
        </div>
      </div>

      {/* Price & Direct Book Button */}
      <div className="flex items-center justify-between gap-3 pt-3">
        <div>
          <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
            From ₹{(service.price || 0).toLocaleString("en-IN")}
          </span>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/services/${serviceId}`);
          }}
          className="px-3.5 py-1.5 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-[11px] font-bold transition-colors shadow-xs cursor-pointer"
        >
          Book Now
        </button>
      </div>
    </div>
  );
}
