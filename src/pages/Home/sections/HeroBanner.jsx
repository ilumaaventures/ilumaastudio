import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getPublicBanners } from "../../../api/bannerService";
import baseApi from "../../../api/baseApi";

export default function HeroBanner() {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchHeroSlides = useCallback(async () => {
    try {
      setLoading(true);

      // Try fetching generic Banner API first
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
          subtitle: b.subtitle || b.description || "",
          buttonText: b.buttonText || "SHOP NOW",
          targetType: b.targetType,
          targetId: b.targetId,
          targetUrl: b.targetUrl,
          image: b.image,
          mobileImage: b.mobileImage,
          bgGradient: "from-[#0F172A] via-[#1E293B] to-[#090D16]",
        }));

        setSlides(formattedBanners);
        setCurrentSlide(0);
        return;
      }

      // Fallback to marketing slides
      let response;
      try {
        response = await baseApi.get("/public/marketing/slides?platform=E-Commerce");
      } catch (error) {
        response = await baseApi.get("/marketing/public/slides?platform=E-Commerce");
      }

      const data = Array.isArray(response?.data)
        ? response.data
        : response?.data?.slides || response?.data?.data || [];

      const approvedSlides = data.filter(
        (item) => (item.status === "Approved" || !item.status) && item.isPublished !== false
      );

      const formattedSlides = approvedSlides.map((slide, index) => ({
        _id: slide._id || `slide-${index}`,
        badge: slide.badge || slide.platform || "Featured",
        title: slide.title || slide.name || "",
        subtitle: slide.subtitle || slide.description || "",
        buttonText: slide.ctaLabel || slide.buttonText || "Explore Now",
        targetType: "shop",
        targetUrl: slide.ctaLink || slide.buttonLink || "/shop",
        bgGradient: slide.bgGradient || "from-slate-950 via-slate-900 to-[#004AC6]",
        image: slide.bgImage || slide.image || "",
      }));

      setSlides(formattedSlides);
      setCurrentSlide(0);
    } catch (error) {
      console.warn("Hero slides fetch error:", error?.message || error);
      setSlides([]);
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

  const handleBannerClick = (slide) => {
    if (!slide) return;
    const targetType = slide.targetType || "shop";
    const targetId = typeof slide.targetId === "object" ? slide.targetId?._id : slide.targetId;

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
      <section className="pt-4 pb-2 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative w-full h-[280px] sm:h-[320px] md:h-[360px] rounded-3xl overflow-hidden bg-slate-200 animate-pulse">
          <div className="absolute inset-0 p-6 sm:p-10 md:p-12 flex flex-col md:flex-row justify-between gap-8">
            <div className="flex flex-col justify-center space-y-5 w-full md:w-1/2">
              <div className="h-6 w-28 bg-slate-300 rounded-full" />
              <div className="space-y-3">
                <div className="h-8 sm:h-10 w-4/5 bg-slate-300 rounded-lg" />
                <div className="h-8 sm:h-10 w-3/5 bg-slate-300 rounded-lg" />
              </div>
              <div className="h-11 w-32 bg-slate-300 rounded-2xl" />
            </div>
            <div className="hidden md:block w-1/2 h-full rounded-2xl bg-slate-300" />
          </div>
        </div>
      </section>
    );
  }

  if (!slides.length) {
    return (
      <section className="pt-4 pb-2 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="w-full h-[280px] sm:h-[320px] md:h-[360px] rounded-3xl bg-slate-100 border border-slate-200 flex items-center justify-center">
          <div className="text-center px-6">
            <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-slate-200 flex items-center justify-center">
              <Sparkles size={22} className="text-slate-400" />
            </div>
            <p className="text-sm font-semibold text-slate-500">No campaigns active</p>
            <p className="mt-1 text-xs text-slate-400">New promotions will appear here.</p>
          </div>
        </div>
      </section>
    );
  }

  const activeSlide = slides[currentSlide];

  return (
    <section className="pt-4 pb-2 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div
        className="relative group rounded-3xl overflow-hidden shadow-xl cursor-pointer"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onClick={() => handleBannerClick(activeSlide)}
      >
        <div
          className={`
            relative p-6 sm:p-10 md:p-12
            transition-all duration-700
            overflow-hidden
            bg-gradient-to-r ${activeSlide.bgGradient || "from-slate-950 via-slate-900 to-[#004AC6]"}
            text-white
            flex flex-col md:flex-row
            items-center justify-between
            gap-8
            min-h-[280px] sm:min-h-[320px] md:min-h-[360px]
          `}
        >
          {/* Background Glow */}
          <div className="absolute -left-16 -top-16 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Content */}
          <div className="space-y-4 max-w-xl text-left z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider border border-white/20 bg-white/10 backdrop-blur-md">
              <Sparkles size={13} className="text-amber-300" />
              <span>{activeSlide.badge || "SPECIAL CAMPAIGN"}</span>
            </div>

            {activeSlide.title && (
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
                {activeSlide.title}
              </h1>
            )}

            {activeSlide.subtitle && (
              <p className="text-xs sm:text-base text-slate-200 font-medium leading-relaxed max-w-lg">
                {activeSlide.subtitle}
              </p>
            )}

            <div className="pt-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleBannerClick(activeSlide);
                }}
                className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-6 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all duration-200 shadow-lg hover:shadow-blue-500/25 inline-flex items-center gap-2 cursor-pointer"
              >
                <span>{activeSlide.buttonText || "SHOP NOW"}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Banner Desktop / Mobile Image */}
          {activeSlide.image && (
            <div className="relative w-full md:w-1/2 h-44 sm:h-56 md:h-72 shrink-0 rounded-2xl overflow-hidden shadow-2xl z-10 bg-slate-900 border border-white/10">
              <picture className="w-full h-full">
                {activeSlide.mobileImage && (
                  <source media="(max-width: 640px)" srcSet={activeSlide.mobileImage} />
                )}
                <img
                  src={activeSlide.image}
                  alt={activeSlide.title || "Hero Banner"}
                  draggable="false"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </picture>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>
          )}

          {/* Previous */}
          {slides.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prevSlide();
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 text-slate-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md hover:scale-110 cursor-pointer"
              aria-label="Previous slide"
            >
              <ChevronLeft size={20} />
            </button>
          )}

          {/* Next */}
          {slides.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                nextSlide();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 text-slate-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md hover:scale-110 cursor-pointer"
              aria-label="Next slide"
            >
              <ChevronRight size={20} />
            </button>
          )}

          {/* Indicators */}
          {slides.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
              {slides.map((slide, index) => (
                <button
                  key={slide._id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentSlide(index);
                  }}
                  className={`
                    h-2 rounded-full transition-all duration-300 cursor-pointer
                    ${currentSlide === index ? "w-8 bg-white" : "w-2 bg-white/40 hover:bg-white/70"}
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
