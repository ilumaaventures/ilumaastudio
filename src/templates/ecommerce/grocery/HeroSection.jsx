import React, { useState, useEffect } from "react";
import {
  Leaf,
  Truck,
  ShieldCheck,
  Heart,
  ArrowRight,
  Sparkles,
  MapPin,
  Clock,
  CheckCircle2,
  Utensils,
  ChevronRight,
  Zap,
} from "lucide-react";
import toast from "react-hot-toast";

export default function HeroSection({
  brandName = "FreshKart",
  banners = [],
  onNavigateToAisles,
  onNavigateToMealKits,
  zipCode = "10001",
  onZipChange,
}) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [zipInput, setZipInput] = useState(zipCode);
  const [zipChecked, setZipChecked] = useState(false);

  const defaultSlides = [
    {
      tag: "Certified Organic Harvest",
      titleMain: "Freshness",
      titleAccent: "Delivered Daily",
      subtitle:
        "Handpicked essentials for a healthier, happier you. Orchard-crisp fruits, slow-fermented sourdoughs, and farm-fresh dairy delivered in 25 minutes.",
      buttonText: "Shop Fresh Groceries",
      badge: "⚡ 25-Min Cold Chain Dispatch Active",
    },
    {
      tag: "100% Farm-Direct Produce",
      titleMain: "Pure Organic",
      titleAccent: "Harvested at Dawn",
      subtitle:
        "Picked directly from certified organic family growers at 5:00 AM every morning. Zero chemical pesticides and non-GMO guaranteed.",
      buttonText: "Explore Fresh Harvest",
      badge: "🌱 Zero Synthetic Pesticides Guaranteed",
    },
    {
      tag: "Artisanal Pantry & Bakery",
      titleMain: "Artisan Loaves",
      titleAccent: "& Pasture Dairy",
      subtitle:
        "Naturally slow-leavened sourdoughs, golden grass-fed butter, and raw mountain honeycombs to elevate your daily table.",
      buttonText: "Browse Bakery & Dairy",
      badge: "🥐 Freshly Baked & Oven-Warm",
    },
  ];

  const slides =
    banners && banners.length > 0
      ? banners.map((b) => ({
          tag: b.subtitle || "Certified Store Selection",
          titleMain: (b.title || brandName).split(" ")[0] || "Freshness",
          titleAccent: (b.title || "").split(" ").slice(1).join(" ") || "Delivered Daily",
          subtitle: b.description || b.subtitle || "Handpicked catalog essentials delivered directly with verified freshness.",
          buttonText: b.ctaText || "Shop Catalog",
          badge: "⚡ Express Fast Dispatch Active",
        }))
      : defaultSlides;

  // Auto-play slide transition every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const currentSlide = slides[activeSlide];

  const handleZipSubmit = (e) => {
    e.preventDefault();
    if (!zipInput.trim()) {
      toast.error("Please enter a valid postal/ZIP code");
      return;
    }
    setZipChecked(true);
    if (onZipChange) onZipChange(zipInput.trim());
    toast.success(`Express slot verified for ZIP ${zipInput}! Courier arrival in ~25 mins. ⚡`);
  };

  return (
    <section className="relative overflow-hidden w-full min-h-[560px] lg:min-h-[640px] flex items-center border-b border-emerald-950/10 select-none">
      {/* ================= 1. FULL-BLEED HERO BACKGROUND IMAGE ================= */}
      <div className="absolute inset-0 z-0">
        <img
          src="/grocery_hero_banner.jpg"
          alt="FreshKart Box of Fresh Organic Groceries"
          className="w-full h-full object-cover object-center lg:object-right transform scale-100 transition-transform duration-1000"
        />

        {/* Multi-layer Natural Light Theme Gradient Overlays */}
        {/* Left Side Light Theme Wash for Razor-Sharp Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 via-55% to-white/30 lg:to-transparent z-1" />

        {/* Vertical subtle soft lighting balance */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-transparent to-white/40 z-1" />

        {/* Ambient Warm Sun Glow Accent */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl pointer-events-none z-1" />
      </div>

      {/* ================= 2. FOREGROUND HERO CONTENT ================= */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Light Theme Typography & Controls */}
          <div className="lg:col-span-7 xl:col-span-6 space-y-6 text-left">
            {/* Top Carousel Dot Selectors & Dynamic Badge */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 p-1 rounded-full bg-white/90 backdrop-blur-md border border-emerald-200/80 shadow-2xs">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveSlide(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`transition-all duration-300 rounded-full cursor-pointer ${
                      activeSlide === idx
                        ? "w-6 h-2 bg-[#15803D]"
                        : "w-2 h-2 bg-emerald-200 hover:bg-emerald-400"
                    }`}
                  />
                ))}
              </div>

              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#15803D] bg-emerald-50/90 backdrop-blur-md px-3 py-1 rounded-full border border-emerald-200/80 shadow-2xs">
                {currentSlide.tag}
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-1">
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-950 leading-[1.06]">
                <span className="block">{currentSlide.titleMain}</span>
                <span className="text-[#15803D] block drop-shadow-2xs">
                  {currentSlide.titleAccent}
                </span>
              </h1>

              <p className="text-xs sm:text-base text-slate-700 leading-relaxed font-normal pt-2 max-w-lg">
                {currentSlide.subtitle}
              </p>
            </div>

            {/* 4 Light-Theme Feature Pills Matching Reference */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
              <div className="flex flex-col items-start gap-1 p-2.5 rounded-2xl bg-white/85 backdrop-blur-md border border-emerald-100 shadow-2xs hover:border-emerald-300 transition group">
                <div className="w-7 h-7 rounded-full bg-emerald-100 text-[#15803D] flex items-center justify-center group-hover:scale-110 transition">
                  <Leaf size={14} />
                </div>
                <span className="text-[11px] font-bold text-slate-900 leading-tight">
                  100% Fresh Produce
                </span>
              </div>

              <div className="flex flex-col items-start gap-1 p-2.5 rounded-2xl bg-white/85 backdrop-blur-md border border-emerald-100 shadow-2xs hover:border-emerald-300 transition group">
                <div className="w-7 h-7 rounded-full bg-emerald-100 text-[#15803D] flex items-center justify-center group-hover:scale-110 transition">
                  <Truck size={14} />
                </div>
                <span className="text-[11px] font-bold text-slate-900 leading-tight">
                  Fast & Reliable Delivery
                </span>
              </div>

              <div className="flex flex-col items-start gap-1 p-2.5 rounded-2xl bg-white/85 backdrop-blur-md border border-emerald-100 shadow-2xs hover:border-emerald-300 transition group">
                <div className="w-7 h-7 rounded-full bg-emerald-100 text-[#15803D] flex items-center justify-center group-hover:scale-110 transition">
                  <ShieldCheck size={14} />
                </div>
                <span className="text-[11px] font-bold text-slate-900 leading-tight">
                  Quality Assured
                </span>
              </div>

              <div className="flex flex-col items-start gap-1 p-2.5 rounded-2xl bg-white/85 backdrop-blur-md border border-emerald-100 shadow-2xs hover:border-emerald-300 transition group">
                <div className="w-7 h-7 rounded-full bg-emerald-100 text-[#15803D] flex items-center justify-center group-hover:scale-110 transition">
                  <Heart size={14} />
                </div>
                <span className="text-[11px] font-bold text-slate-900 leading-tight">
                  Better Food Tomorrow
                </span>
              </div>
            </div>

            {/* Action Buttons & Express Slot Checker */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={onNavigateToAisles}
                  className="px-8 py-3.5 bg-[#15803D] hover:bg-emerald-800 text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-emerald-950/20 flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5 active:scale-95"
                >
                  <span>{currentSlide.buttonText}</span>
                  <ArrowRight size={15} />
                </button>

                <button
                  onClick={onNavigateToMealKits}
                  className="px-6 py-3.5 bg-white/95 hover:bg-white text-[#15803D] border border-emerald-300 rounded-full text-xs font-bold uppercase tracking-wider transition shadow-sm flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <Utensils size={14} />
                  <span>Chef's Recipe Kits</span>
                </button>
              </div>

              {/* Express Slot ZIP Bar */}
              <form
                onSubmit={handleZipSubmit}
                className="max-w-md p-1.5 rounded-2xl bg-white/95 backdrop-blur-md border border-emerald-200/90 shadow-xs flex items-center gap-2"
              >
                <MapPin size={15} className="text-[#16A34A] ml-2 shrink-0" />
                <input
                  type="text"
                  value={zipInput}
                  onChange={(e) => setZipInput(e.target.value)}
                  placeholder="Enter your Delivery ZIP (e.g. 10001)..."
                  className="w-full text-xs font-medium text-slate-800 focus:outline-hidden bg-transparent"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-100 hover:bg-emerald-200 text-[#15803D] text-[11px] font-bold rounded-xl shrink-0 transition cursor-pointer"
                >
                  Check Slot
                </button>
              </form>

              {zipChecked && (
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 animate-fade-in ml-1">
                  <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                  <span>25-Minute Insulated Delivery Slot Available in {zipInput}!</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Floating Interactive Badges over the Panoramic Crate */}
          <div className="lg:col-span-5 xl:col-span-6 relative flex flex-col justify-between min-h-[380px] lg:min-h-[440px] pointer-events-none">
            {/* Top Right Floating Handwritten Callout */}
            <div className="self-end pointer-events-auto mt-2 mr-2 rotate-2 transform hover:rotate-0 transition duration-300">
              <div className="bg-amber-50/95 backdrop-blur-md border border-amber-300/80 rounded-2xl px-4 py-2 shadow-lg text-right">
                <span className="text-xs font-black text-emerald-950 font-serif block leading-tight">
                  Good Food, Happier You 💚
                </span>
                <span className="text-[9px] text-emerald-700 uppercase tracking-widest font-bold">
                  100% Farm-To-Doorstep
                </span>
              </div>
            </div>

            {/* Bottom Floating Live Verification Card */}
            <div className="self-end pointer-events-auto mb-4 mr-2 max-w-xs">
              <div className="p-3.5 rounded-2xl bg-white/95 backdrop-blur-md border border-white/80 shadow-xl space-y-2 text-left">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-[#15803D] text-white flex items-center justify-center">
                      <Leaf size={14} />
                    </div>
                    <div>
                      <div className="text-xs font-extrabold text-slate-900 leading-none">
                        {brandName} Fresh Crate
                      </div>
                      <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                        Harvested Today • Cold Chain
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    4.9 ★ (12.4k)
                  </span>
                </div>

                <div className="text-[11px] text-slate-600 leading-tight">
                  Packed in 100% compostable cardboard with zero single-use plastics.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
