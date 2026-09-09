import React, { useState, useEffect } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

export default function HeroMacroBanner({
  slides = [],
  onSelectCategory = () => {},
}) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!slides || slides.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides]);

  if (!slides || slides.length === 0) return null;

  const current = slides[currentSlide];

  return (
    <div className="relative w-full h-[480px] sm:h-[540px] md:h-[620px] bg-[#0E0E0E] overflow-hidden select-none">
      {/* Background Macro Imagery with Smooth Transition */}
      {slides.map((slide, idx) => (
        <div
          key={slide.id || idx}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
          }`}
          style={{ transition: "opacity 1s ease-in-out, transform 7s ease-out" }}
        >
          <img
            src={slide.image || slide.bgImage || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1400"}
            alt={slide.title}
            className="w-full h-full object-cover object-center filter brightness-[0.55] contrast-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/60" />
        </div>
      ))}

      {/* Content Container */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-6 sm:px-8 flex flex-col justify-center items-start text-left">
        <span className="inline-block text-[11px] sm:text-xs font-bold tracking-[0.3em] uppercase text-neutral-300 mb-4 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20">
          {current.subtitle}
        </span>

        <h1
          className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight uppercase max-w-3xl leading-[1.08] mb-5"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          {current.title}
        </h1>

        <p className="text-xs sm:text-sm md:text-base text-neutral-300 max-w-xl font-normal leading-relaxed mb-8">
          {current.description}
        </p>

        <button
          onClick={() => onSelectCategory(current.ctaCategory || "headphones")}
          className="group px-8 py-3.5 bg-white hover:bg-neutral-200 text-black text-xs font-bold tracking-[0.25em] uppercase transition-all duration-200 flex items-center gap-3 shadow-lg"
        >
          <span>{current.ctaText}</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* 3-Dot Pagination Indicators (Matching Reference Image 1) */}
      <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center items-center gap-3">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            aria-label={`Slide ${idx + 1}`}
            className="group p-2 focus:outline-none"
          >
            <span
              className={`block rounded-full transition-all duration-300 ${
                idx === currentSlide
                  ? "w-3 h-3 bg-white scale-110 shadow"
                  : "w-2.5 h-2.5 bg-white/40 group-hover:bg-white/70"
              }`}
            />
          </button>
        ))}
      </div>

      {/* Subtle Arrow Controls */}
      <button
        onClick={() =>
          setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
        }
        aria-label="Previous"
        className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-none bg-black/40 hover:bg-black/80 text-white items-center justify-center transition-all border border-white/20"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
        aria-label="Next"
        className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-none bg-black/40 hover:bg-black/80 text-white items-center justify-center transition-all border border-white/20"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
