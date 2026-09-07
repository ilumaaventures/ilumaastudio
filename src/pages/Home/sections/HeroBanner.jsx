import React, { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getPublicBanners } from "../../../api/bannerService";
import baseApi from "../../../api/baseApi";

// Curated high-impact fallback slides ensuring the hero is always vibrant & luxury-ready
const DEFAULT_HERO_SLIDES = [
  {
    _id: "default-slide-1",
    badge: "EXCLUSIVE COLLECTION",
    title: "Luxury Artisanal Living & Designer Gifts",
    subtitle:
      "Handcrafted gourmet hampers, bespoke audio, and timeless home decor curated for connoisseurs.",
    buttonText: "EXPLORE STUDIO",
    targetType: "shop",
    targetUrl: "/shop",
    image:
      "https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=1200&q=80",
    mobileImage:
      "https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=800&q=80",
    bgGradient: "from-slate-950 via-slate-900 to-[#004AC6]",
  },
  {
    _id: "default-slide-2",
    badge: "LIMITED EDITION",
    title: "Curated Celebration & Festive Hampers",
    subtitle:
      "Custom brass engravings, wax seals, and royal confectionery for life's milestone moments.",
    buttonText: "SHOP HAMPERS",
    targetType: "shop",
    targetUrl: "/shop",
    image:
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=80",
    mobileImage:
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80",
    bgGradient: "from-slate-950 via-indigo-950 to-blue-900",
  },
  {
    _id: "default-slide-3",
    badge: "FLASH PRIVILEGE",
    title: "Up to 40% Off Premium Audio & Electronics",
    subtitle:
      "Immersive acoustic sound, minimalist engineering, and official warranty on flagship models.",
    buttonText: "VIEW DEALS",
    targetType: "shop",
    targetUrl: "/shop",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
    mobileImage:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    bgGradient: "from-slate-950 via-slate-900 to-amber-950",
  },
];

export default function HeroBanner() {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Touch swipe support for mobile devices
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const fetchHeroSlides = useCallback(async () => {
    try {
      setLoading(true);

      // 1. Try fetching generic Banner API first
      let bRes;
      try {
        bRes = await getPublicBanners({
          type: "hero",
          businessCategory: "E-Commerce",
          listedOn: "superadmin",
        });
      } catch (_) {}

      const bannerData = bRes?.banners || bRes?.data || [];

      if (bannerData.length > 0) {
        const formattedBanners = bannerData.map((b, idx) => ({
          _id: b._id || `banner-${idx}`,
          title: b.title,
          badge: b.badge || "SPECIAL CAMPAIGN",
          subtitle: b.subtitle || b.description || "",
          buttonText: b.buttonText || "SHOP NOW",
          targetType: b.targetType,
          targetId: b.targetId,
          targetUrl: b.targetUrl,
          image: b.image,
          mobileImage: b.mobileImage || b.image,
          bgGradient: "from-[#0F172A] via-[#1E293B] to-[#090D16]",
        }));

        setSlides(formattedBanners);
        setCurrentSlide(0);
        return;
      }

      // 2. Fallback to marketing slides
      let response;
      try {
        response = await baseApi.get(
          "/public/marketing/slides?platform=E-Commerce",
        );
      } catch (error) {
        response = await baseApi.get(
          "/marketing/public/slides?platform=E-Commerce",
        );
      }

      const data = Array.isArray(response?.data)
        ? response.data
        : response?.data?.slides || response?.data?.data || [];

      const approvedSlides = data.filter(
        (item) =>
          (item.status === "Approved" || !item.status) &&
          item.isPublished !== false,
      );

      if (approvedSlides.length > 0) {
        const formattedSlides = approvedSlides.map((slide, index) => ({
          _id: slide._id || `slide-${index}`,
          badge: slide.badge || slide.platform || "Featured",
          title: slide.title || slide.name || "",
          subtitle: slide.subtitle || slide.description || "",
          buttonText: slide.ctaLabel || slide.buttonText || "Explore Now",
          targetType: "shop",
          targetUrl: slide.ctaLink || slide.buttonLink || "/shop",
          bgGradient:
            slide.bgGradient || "from-slate-950 via-slate-900 to-[#004AC6]",
          image: slide.bgImage || slide.image || "",
          mobileImage: slide.mobileImage || slide.bgImage || slide.image || "",
        }));

        setSlides(formattedSlides);
      } else {
        setSlides(DEFAULT_HERO_SLIDES);
      }
      setCurrentSlide(0);
    } catch (error) {
      console.warn("Hero slides fetch error:", error?.message || error);
      setSlides(DEFAULT_HERO_SLIDES);
      setCurrentSlide(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHeroSlides();
  }, [fetchHeroSlides]);

  const nextSlide = useCallback(() => {
    if (slides.length <= 1) return;
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    if (slides.length <= 1) return;
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1 || isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length, isPaused, nextSlide]);

  // Touch Swipe Handlers for mobile gestures
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 45) {
      nextSlide();
    } else if (distance < -45) {
      prevSlide();
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  const handleBannerClick = (slide) => {
    if (!slide) return;
    const targetType = slide.targetType || "shop";
    const targetId =
      typeof slide.targetId === "object" ? slide.targetId?._id : slide.targetId;

    if (targetType === "product" && targetId) {
      navigate(`/product/${targetId}`);
    } else if (targetType === "category" && targetId) {
      navigate(`/shop?category=${targetId}`);
    } else if (targetType === "collection" && targetId) {
      navigate(`/shop?collection=${targetId}`);
    } else if (targetType === "occasion" && targetId) {
      navigate(`/shop?occasion=${targetId}`);
    } else if (targetType === "flashSale" && targetId) {
      navigate(`/shop?flashSale=${targetId}`);
    } else if (targetType === "external" && slide.targetUrl) {
      window.open(slide.targetUrl, "_blank");
    } else if (slide.targetUrl) {
      if (slide.targetUrl.startsWith("http")) {
        window.open(slide.targetUrl, "_blank");
      } else {
        navigate(slide.targetUrl);
      }
    } else {
      navigate("/shop");
    }
  };

  if (loading) {
    return (
      <section className="pt-3 sm:pt-4 pb-2 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative w-full h-[320px] sm:h-[350px] md:h-[380px] rounded-3xl overflow-hidden bg-slate-900 animate-pulse">
          <div className="absolute inset-0 p-6 sm:p-10 md:p-12 flex flex-col justify-end md:justify-center space-y-4 max-w-xl">
            <div className="h-6 w-28 bg-slate-700/80 rounded-full" />
            <div className="space-y-2">
              <div className="h-7 sm:h-9 w-4/5 bg-slate-700/80 rounded-xl" />
              <div className="h-7 sm:h-9 w-3/5 bg-slate-700/80 rounded-xl" />
            </div>
            <div className="h-4 w-2/3 bg-slate-700/60 rounded-md" />
            <div className="h-10 sm:h-12 w-32 bg-slate-700/80 rounded-2xl pt-2" />
          </div>
        </div>
      </section>
    );
  }

  const activeSlide = slides[currentSlide] || DEFAULT_HERO_SLIDES[0];

  return (
    <section className="pt-3 sm:pt-4 pb-2 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto font-sans">
      <div
        className="relative group rounded-3xl overflow-hidden shadow-xl cursor-pointer select-none"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={() => handleBannerClick(activeSlide)}
      >
        <div
          className={`
            relative p-5 sm:p-8 md:p-12
            transition-all duration-700
            overflow-hidden
            bg-gradient-to-r ${
              activeSlide.bgGradient ||
              "from-slate-950 via-slate-900 to-[#004AC6]"
            }
            text-white
            flex flex-col md:flex-row
            items-stretch md:items-center justify-between
            gap-6 md:gap-8
            min-h-[340px] sm:min-h-[370px] md:min-h-[400px]
          `}
        >
          {/* =========================================================
              SMALL SCREEN FULL-BLEED BACKGROUND IMAGE (< md)
              (Displays the text directly OVER the image on mobile)
          ========================================================== */}
          {activeSlide.image && (
            <div className="absolute inset-0 z-0 md:hidden overflow-hidden">
              <picture className="w-full h-full">
                {activeSlide.mobileImage && (
                  <source
                    media="(max-width: 768px)"
                    srcSet={activeSlide.mobileImage}
                  />
                )}
                <img
                  src={activeSlide.mobileImage || activeSlide.image}
                  alt={activeSlide.title || "Hero Banner"}
                  loading="eager"
                  decoding="async"
                  className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 group-hover:scale-110"
                />
              </picture>
              {/* Multi-layered dark gradient overlay for crystal-clear readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/45 to-transparent" />
            </div>
          )}

          {/* Background Ambient Glow for Desktop */}
          <div className="hidden md:block absolute -left-16 -top-16 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="hidden md:block absolute -right-16 -bottom-16 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* =========================================================
              MAIN CONTENT (Overlaid cleanly on mobile, left on desktop)
          ========================================================== */}
          <div className="relative z-10 flex flex-col justify-end md:justify-center space-y-3 sm:space-y-4 max-w-xl text-left w-full h-full py-2">
            {/* Frosted Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-black uppercase tracking-wider border border-white/25 bg-white/15 backdrop-blur-md text-white shadow-xs w-fit">
              <Sparkles size={12} className="text-amber-300 shrink-0" />
              <span>{activeSlide.badge || "SPECIAL CAMPAIGN"}</span>
            </div>

            {/* Headline */}
            {activeSlide.title && (
              <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight drop-shadow-md">
                {activeSlide.title}
              </h1>
            )}

            {/* Subtitle */}
            {activeSlide.subtitle && (
              <p className="text-xs sm:text-sm md:text-base text-slate-200 font-medium leading-relaxed max-w-lg line-clamp-2 sm:line-clamp-3 md:line-clamp-none drop-shadow">
                {activeSlide.subtitle}
              </p>
            )}

            {/* CTA Button */}
            <div className="pt-1.5 sm:pt-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleBannerClick(activeSlide);
                }}
                className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-black transition-all duration-200 shadow-lg shadow-blue-600/30 hover:shadow-blue-500/40 inline-flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <span>{activeSlide.buttonText || "SHOP NOW"}</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>

          {/* =========================================================
              DESKTOP FRAMED IMAGE CARD (md: and up only)
          ========================================================== */}
          {activeSlide.image && (
            <div className="hidden md:block relative w-1/2 h-64 lg:h-76 shrink-0 rounded-2xl overflow-hidden shadow-2xl z-10 bg-slate-900 border border-white/10 group-hover:border-white/20 transition-all duration-500">
              <picture className="w-full h-full">
                <img
                  src={activeSlide.image}
                  alt={activeSlide.title || "Hero Banner"}
                  loading="eager"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </picture>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </div>
          )}

          {/* Navigation Controls: Previous Slide */}
          {slides.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prevSlide();
              }}
              className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 text-slate-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md hover:scale-110 cursor-pointer"
              aria-label="Previous slide"
            >
              <ChevronLeft size={18} />
            </button>
          )}

          {/* Navigation Controls: Next Slide */}
          {slides.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                nextSlide();
              }}
              className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 text-slate-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md hover:scale-110 cursor-pointer"
              aria-label="Next slide"
            >
              <ChevronRight size={18} />
            </button>
          )}

          {/* Pagination Indicators */}
          {slides.length > 1 && (
            <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 sm:gap-2">
              {slides.map((slide, index) => (
                <button
                  key={slide._id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentSlide(index);
                  }}
                  className={`
                    h-1.5 sm:h-2 rounded-full transition-all duration-300 cursor-pointer
                    ${
                      currentSlide === index
                        ? "w-6 sm:w-8 bg-white shadow-xs"
                        : "w-1.5 sm:w-2 bg-white/40 hover:bg-white/70"
                    }
                  `}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
