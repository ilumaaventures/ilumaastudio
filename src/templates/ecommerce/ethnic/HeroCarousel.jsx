import React, { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";

export default function HeroCarousel({ slides = [], onSelectCategory }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const defaultSlides = [
    {
      id: "slide-1",
      title: "The Festive Couture Edit",
      subtitle: "Handcrafted silks, heritage threadwork, and contemporary silhouettes",
      category: "Dresses",
      image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1400&auto=format&fit=crop&q=80",
    },
    {
      id: "slide-2",
      title: "Modern Fusion Jumpsuits",
      subtitle: "Bespoke tailored cuts designed for twilight celebrations",
      category: "Jumpsuits",
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1400&auto=format&fit=crop&q=80",
    },
    {
      id: "slide-3",
      title: "Celebration Lehengas & Sets",
      subtitle: "Pastel palettes woven with fine zardozi and lightweight organza",
      category: "Modern Look",
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1400&auto=format&fit=crop&q=80",
    },
  ];

  const activeSlides = slides && slides.length > 0 ? slides : defaultSlides;

  // Auto-play
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [activeSlides.length]);

  return (
    <div className="relative w-full bg-[#1C1917] overflow-hidden select-none">
      {/* Slide Image Presentation */}
      <div className="relative w-full h-[260px] sm:h-[360px] md:h-[420px]">
        {activeSlides.map((slide, idx) => (
          <div
            key={slide.id || idx}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              currentSlide === idx ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover object-center"
            />
            {/* Cinematic Vignette Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/20" />

            {/* Slide Text Content */}
            <div className="absolute bottom-10 left-6 sm:left-12 right-6 sm:right-12 text-left text-white max-w-xl space-y-2 z-20">
              <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#4ADE80] font-bold block">
                Exclusive Collection
              </span>
              <h2 className="text-2xl sm:text-4xl font-serif font-black tracking-tight text-white leading-tight">
                {slide.title}
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-md hidden sm:block">
                {slide.subtitle}
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onSelectCategory && onSelectCategory(slide.category || "Dresses")}
                  className="px-5 py-2 bg-white text-black text-xs font-semibold uppercase tracking-wider hover:bg-stone-100 transition cursor-pointer"
                >
                  Explore Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3 Dash/Pill Pagination Indicators matching Screenshot (`— — —`) */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
        {activeSlides.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrentSlide(idx)}
            className={`h-1 transition-all duration-300 rounded-full cursor-pointer ${
              currentSlide === idx
                ? "w-8 bg-white"
                : "w-5 bg-white/40 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Prev / Next Arrows */}
      <button
        type="button"
        onClick={() =>
          setCurrentSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length)
        }
        className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-black/30 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-2xs transition cursor-pointer"
      >
        <ChevronLeft size={18} />
      </button>

      <button
        type="button"
        onClick={() => setCurrentSlide((prev) => (prev + 1) % activeSlides.length)}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-black/30 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-2xs transition cursor-pointer"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
