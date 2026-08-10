import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, ArrowRight, Tag, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import baseApi from "../../../api/baseApi";

const DEFAULT_SLIDES = [
  {
    _id: "default_1",
    badge: "Summer Offer",
    title: "Summer Festival Offers!",
    subtitle: "Up to 40% Cashback on Daily Essentials & Groceries",
    buttonText: "Shop Now",
    buttonLink: "/shop",
    bgGradient: "from-emerald-900 via-teal-900 to-slate-900",
    badgeBg: "bg-emerald-500/20 text-emerald-300 border-emerald-400/20",
    image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "default_2",
    badge: "Deal Of The Day",
    title: "High-end Espresso & Coffee Makers",
    subtitle: "Exclusive 50% Discounts on Modern Home Appliances",
    buttonText: "Explore Electronics",
    buttonLink: "/products?category=Electronics",
    bgGradient: "from-[#1e293b] via-[#0f172a] to-[#2563eb]/40",
    badgeBg: "bg-blue-500/20 text-blue-300 border-blue-400/20",
    image: "https://images.unsplash.com/photo-1517668808822-9e4288246ede?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "default_3",
    badge: "Verified Doorstep Care",
    title: "Book Trusted Home Services",
    subtitle: "Doorstep Cleaning, Electricians & Salon at Home",
    buttonText: "Book Services",
    buttonLink: "/services",
    bgGradient: "from-amber-950 via-orange-950 to-slate-900",
    badgeBg: "bg-amber-500/20 text-amber-300 border-amber-400/20",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80",
  },
];

export default function HeroBanner() {
  const [slides, setSlides] = useState(DEFAULT_SLIDES);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeroSlides = async () => {
      try {
        setLoading(true);
        // Try public marketing API matching Gifter's structure
        let res;
        try {
          res = await baseApi.get("/public/marketing/slides?platform=E-Commerce");
        } catch (err) {
          res = await baseApi.get("/marketing/public/slides?platform=E-Commerce");
        }

        const data = Array.isArray(res?.data) ? res.data : res?.data?.slides || res?.data?.data || [];
        const approvedSlides = data.filter(
          (item) => (item.status === "Approved" || !item.status) && (item.isPublished !== false)
        );

        if (approvedSlides.length > 0) {
          const formatted = approvedSlides.map((s, idx) => ({
            _id: s._id || `slide_${idx}`,
            badge: s.badge || s.platform || "Featured",
            title: s.title || s.name || "Special Campaign",
            subtitle: s.subtitle || s.description || "Discover exclusive items on ILumaaStudio",
            buttonText: s.ctaLabel || s.buttonText || "Explore Now",
            buttonLink: s.ctaLink || s.buttonLink || "/shop",
            bgGradient: DEFAULT_SLIDES[idx % DEFAULT_SLIDES.length].bgGradient,
            badgeBg: DEFAULT_SLIDES[idx % DEFAULT_SLIDES.length].badgeBg,
            image: s.bgImage || s.image || DEFAULT_SLIDES[idx % DEFAULT_SLIDES.length].image,
          }));
          setSlides(formatted);
        }
      } catch (err) {
        console.warn("Using fallback hero slides:", err?.message || err);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroSlides();
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, [slides]);

  useEffect(() => {
    if (slides.length <= 1 || isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [slides, isPaused, nextSlide]);

  const activeSlide = slides[currentSlide] || DEFAULT_SLIDES[0];

  return (
    <section className="pt-4 pb-2 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div
        className="relative group rounded-3xl overflow-hidden shadow-md"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Main Hero Card */}
        <div
          className={`relative p-6 sm:p-10 md:p-12 transition-all duration-700 overflow-hidden bg-gradient-to-r ${activeSlide.bgGradient} text-white flex flex-col md:flex-row items-center justify-between gap-8 min-h-[280px] sm:min-h-[320px] md:min-h-[360px]`}
        >
          {/* Subtle Glow Circle Background Effect */}
          <div className="absolute -left-16 -top-16 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Left Content Side */}
          <div className="space-y-4 max-w-xl text-left z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider border backdrop-blur-md shadow-2xs">
              <Sparkles size={13} className="text-amber-300" />
              <span>{activeSlide.badge || "Featured Offer"}</span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight drop-shadow-xs">
              {activeSlide.title}
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-base text-slate-200 font-medium leading-relaxed max-w-lg">
              {activeSlide.subtitle}
            </p>

            {/* CTA Button */}
            <div className="pt-2">
              <Link
                to={activeSlide.buttonLink || "/shop"}
                className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-6 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all duration-200 shadow-lg hover:shadow-blue-500/25 inline-flex items-center gap-2 cursor-pointer"
              >
                <span>{activeSlide.buttonText || "Shop Now"}</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* Right Image Display */}
          <div className="relative w-full md:w-1/2 h-44 sm:h-56 md:h-72 shrink-0 rounded-2xl overflow-hidden shadow-xl z-10 bg-slate-800">
            <img
              src={activeSlide.image}
              alt={activeSlide.title}
              draggable="false"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>

          {/* Navigation Arrows */}
          <button
            type="button"
            onClick={prevSlide}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md hover:scale-110 cursor-pointer"
            aria-label="Previous slide"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            type="button"
            onClick={nextSlide}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md hover:scale-110 cursor-pointer"
            aria-label="Next slide"
          >
            <ChevronRight size={20} />
          </button>

          {/* Slide Indicator Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  currentSlide === idx ? "w-8 bg-white" : "w-2 bg-white/40 hover:bg-white/70"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
