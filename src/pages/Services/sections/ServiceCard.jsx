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
  const serviceTitle = service.serviceName || service.name || "Doorstep Service";
  const serviceImg =
    (typeof service.image === "string" ? service.image : service.image?.url) ||
    service.thumbnail?.url ||
    (typeof service.thumbnail === "string" ? service.thumbnail : null) ||
    service.images?.[0]?.url ||
    (typeof service.images?.[0] === "string" ? service.images[0] : null) ||
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=700&q=80";
  const imgCount = Array.isArray(service.images) ? service.images.length : 0;

  const isEnquiryOnly =
    service.serviceMode?.toUpperCase() === "ENQUIRY" ||
    service.bookingType?.toLowerCase() === "inquiry" ||
    service.allowBooking === false;

  return (
    <div
      onClick={() => navigate(`/services/${serviceId}`)}
      className="group shrink-0 w-[240px] sm:w-[270px] lg:w-[290px] snap-start cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Image */}
        <div className="relative h-[170px] sm:h-[185px] overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800">
          <img
            src={serviceImg}
            alt={serviceTitle}
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

          {imgCount > 1 && (
            <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[9px] font-bold text-white shadow-xs">
              📷 {imgCount}
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
            aria-label={`View ${serviceTitle}`}
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

          {/* Attribute chips / Delivery badge */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1.5">
            {service.deliveryType && (
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                {service.deliveryType === "AT_HOME"
                  ? "At Home"
                  : service.deliveryType === "REMOTE"
                  ? "Remote / Virtual"
                  : service.deliveryType === "HYBRID"
                  ? "Hybrid"
                  : "On-Site"}
              </span>
            )}
            {service.customAttributes && (
              <>
                {service.customAttributes.technology && (
                  <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 truncate max-w-[120px]">
                    {Array.isArray(service.customAttributes.technology)
                      ? service.customAttributes.technology.slice(0, 2).join(", ")
                      : String(service.customAttributes.technology)}
                  </span>
                )}
                {service.customAttributes.massageType && (
                  <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700">
                    {String(service.customAttributes.massageType)}
                  </span>
                )}
                {service.customAttributes.subject && (
                  <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-purple-50 text-purple-700">
                    {String(service.customAttributes.subject)}
                  </span>
                )}
                {service.customAttributes.applianceType && (
                  <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700">
                    {String(service.customAttributes.applianceType)}
                  </span>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Price & Dynamic Action Button */}
      <div className="flex items-center justify-between gap-3 pt-3">
        <div>
          {isEnquiryOnly ? (
            <span className="text-xs sm:text-sm font-extrabold text-blue-600 dark:text-blue-400">
              Quote on Enquiry
            </span>
          ) : (
            <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
              From ₹{(service.price || service.pricing?.amount || 0).toLocaleString("en-IN")}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/services/${serviceId}`);
          }}
          className="px-3.5 py-1.5 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-[11px] font-bold transition-colors shadow-xs cursor-pointer"
        >
          {isEnquiryOnly
            ? "Send Enquiry"
            : service.serviceMode === "BOTH"
            ? "Book / Enquire"
            : "Book Now"}
        </button>
      </div>
    </div>
  );
}
