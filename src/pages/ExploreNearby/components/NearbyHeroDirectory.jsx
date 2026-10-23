import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { Plane, ChevronRight, ChevronLeft, ArrowRight } from "lucide-react";

export default function NearbyHeroDirectory({
  heroPromo,
  onSelectCategory,
  onOpenEnquiry,
}) {
  const scrollRef = useRef(null);

  if (!heroPromo) return null;

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const offset = direction === "left" ? -340 : 340;
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-3">
      {/* Scroll Navigation Header Controls */}
      <div className="flex items-center justify-between px-1 pt-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
            Featured Directory & Travel Deals
          </span>
        </div>
      </div>

      {/* Movable Horizontal Slider matching reference image */}
      <div
        ref={scrollRef}
        className="flex gap-3 sm:gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 pt-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {/* Left Flight / Travel Hero Banner */}
        <div className="shrink-0 w-[310px] sm:w-[420px] md:w-[480px] lg:w-[500px] snap-start relative rounded-3xl overflow-hidden bg-gradient-to-br from-sky-400 via-sky-300 to-amber-200 p-5 sm:p-7 flex flex-col justify-between min-h-[220px] shadow-sm border border-sky-100 group">
          {/* Background Illustration & Overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-30 group-hover:scale-105 transition-transform duration-700 pointer-events-none"
            style={{ backgroundImage: `url(${heroPromo.banner?.image})` }}
          />

          <div className="relative z-10 space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 text-sky-800 text-[10px] font-black uppercase tracking-wider shadow-xs">
              <Plane size={12} className="text-sky-600" />
              <span>{heroPromo.banner?.badge || "TRAVEL SPECIAL"}</span>
            </span>

            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight leading-tight max-w-xs">
              {heroPromo.banner?.title}
            </h3>

            <p className="text-xs text-slate-700 font-medium max-w-xs leading-relaxed">
              {heroPromo.banner?.subtitle}
            </p>
          </div>

          <div className="relative z-10 pt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => onSelectCategory("travel")}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-md shadow-blue-600/30 transition-all cursor-pointer"
            >
              <span>{heroPromo.banner?.actionText || "Book Now"}</span>
              <ArrowRight size={14} />
            </button>

            <span className="text-[11px] font-bold text-slate-700">
              {heroPromo.banner?.partner}
            </span>
          </div>
        </div>

        {/* 4 Promo Cards in the same continuous horizontal scroll row */}
        {heroPromo.cards?.map((card) => (
          <div
            key={card.id}
            onClick={() => {
              if (card.id === "promo-b2b") {
                onOpenEnquiry("B2B Solutions", "B2B Quotes");
              } else if (card.id === "promo-doctors") {
                onOpenEnquiry("Doctor Appointment", "Healthcare");
              } else {
                onSelectCategory(card.query);
              }
            }}
            className="shrink-0 w-[170px] sm:w-[195px] md:w-[210px] snap-start group relative rounded-3xl overflow-hidden p-4 flex flex-col justify-between min-h-[220px] shadow-xs border border-slate-200/80 cursor-pointer hover:shadow-xl hover:border-blue-400 transition-all duration-300"
          >
            {/* Background Image with Dark Vignette */}
            <div
              className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
              style={{ backgroundImage: `url(${card.image})` }}
            />
            <div
              className={`absolute inset-0 bg-gradient-to-t ${card.bgGradient} opacity-90 group-hover:opacity-85 transition-opacity`}
            />

            {/* Badge Top */}
            <div className="relative z-10">
              <span className="inline-block px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-white text-[9px] font-black uppercase tracking-wider">
                {card.badge}
              </span>
            </div>

            {/* Content Bottom */}
            <div className="relative z-10 text-white space-y-1">
              <h4 className="text-sm font-black leading-tight tracking-wide">
                {card.title}
              </h4>
              <p className="text-[11px] text-white/80 font-medium">
                {card.subtitle}
              </p>
              <div className="pt-2 flex items-center gap-1 text-[10px] font-black text-amber-300 group-hover:translate-x-1 transition-transform">
                <span>Explore</span>
                <ChevronRight size={12} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
