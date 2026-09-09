import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

export default function HeroCarousel({
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
    <div className="relative w-full h-[460px] sm:h-[520px] md:h-[600px] bg-[#1A0E08] overflow-hidden select-none">
      {/* Background Image with Dark Vignette Overlay */}
      {slides.map((slide, idx) => (
        <div
          key={slide.id || idx}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
          }`}
          style={{ transition: "opacity 1s ease-in-out, transform 8s ease-out" }}
        >
          <img
            src={slide.bgImage || slide.image || "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1400"}
            alt={slide.title}
            className="w-full h-full object-cover object-center filter brightness-[0.45] contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1F120B] via-transparent to-[#1F120B]/60" />
          <div className="absolute inset-0 bg-radial from-transparent to-[#120A06]/80" />
        </div>
      ))}

      {/* Hero Content */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-6 sm:px-8 flex flex-col justify-center items-center text-center">
        <span className="inline-block text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-amber-300 mb-4 px-4 py-1 rounded-full bg-amber-950/50 border border-amber-500/30 backdrop-blur-sm">
          {current.subtitle || "ARTISANAL ROASTED SPECIALTY BEANS"}
        </span>

        <h1
          className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-[#FAF7F2] font-normal tracking-tight max-w-4xl leading-[1.15] mb-6 drop-shadow-md"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          {current.title}
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-[#E0D7CE] max-w-2xl font-light leading-relaxed mb-8">
          {current.description}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => onSelectCategory(current.ctaCategory || "all")}
            className="group px-8 py-3.5 bg-[#4A2E1B] hover:bg-[#FAF7F2] text-[#FAF7F2] hover:text-[#2E1B13] text-sm font-medium tracking-wider uppercase rounded-full shadow-xl transition-all duration-300 flex items-center gap-2 border border-amber-900/50 hover:border-white"
          >
            <span>{current.ctaText || "Explore Brews"}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>

      {/* 3-Dash Pagination Indicators (Matching Reference Image) */}
      <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center items-center gap-3">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            aria-label={`Slide ${idx + 1}`}
            className="group py-2 px-1 focus:outline-none"
          >
            <span
              className={`block h-[2px] transition-all duration-300 rounded-full ${
                idx === currentSlide
                  ? "w-10 bg-[#FAF7F2] opacity-100"
                  : "w-6 bg-[#FAF7F2]/40 group-hover:bg-[#FAF7F2]/70 group-hover:w-8"
              }`}
            />
          </button>
        ))}
      </div>

      {/* Side Arrow Controls */}
      <button
        onClick={() =>
          setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
        }
        aria-label="Previous Slide"
        className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/30 hover:bg-black/60 text-white/80 hover:text-white items-center justify-center backdrop-blur-sm transition-all border border-white/10"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
        aria-label="Next Slide"
        className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/30 hover:bg-black/60 text-white/80 hover:text-white items-center justify-center backdrop-blur-sm transition-all border border-white/10"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
}
