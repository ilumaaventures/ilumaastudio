import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { getPublicBanners } from "../api/bannerService";

export default function BannerSection({
  bannerType = "promotion",
  className = "",
  autoPlayInterval = 4000,
}) {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState("right");
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const fetchTypeBanners = async () => {
      try {
        setLoading(true);
        const res = await getPublicBanners({ type: bannerType });
        const list = res?.banners || res?.data || [];
        if (isMounted) {
          setBanners(list);
        }
      } catch (err) {
        console.warn(`Failed to fetch banners for type ${bannerType}:`, err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchTypeBanners();

    return () => {
      isMounted = false;
    };
  }, [bannerType]);

  // Auto-carousel timer
  useEffect(() => {
    if (banners.length <= 1) return;

    const timer = setInterval(() => {
      setDirection("right");
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [banners.length, autoPlayInterval]);

  if (loading || banners.length === 0) return null;

  const handleBannerClick = (b) => {
    const targetType = b.targetType || "shop";
    const targetId = typeof b.targetId === "object" ? b.targetId?._id : b.targetId;

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
    } else if (targetType === "external" && b.targetUrl) {
      window.open(b.targetUrl, "_blank");
    } else if (b.targetUrl) {
      if (b.targetUrl.startsWith("http")) {
        window.open(b.targetUrl, "_blank");
      } else {
        navigate(b.targetUrl);
      }
    } else {
      navigate("/shop");
    }
  };

  const currentBanner = banners[currentIndex];
  const hasImage = Boolean(currentBanner.image || currentBanner.mobileImage);

  const handleNext = () => {
    setDirection("right");
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const handlePrev = () => {
    setDirection("left");
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  return (
    <section className={`py-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto ${className}`}>
      <div className="relative rounded-3xl overflow-hidden shadow-xl bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white p-6 sm:p-8 border border-slate-800">
        
        {/* Banner Card Content */}
        <div
          key={currentBanner._id || currentIndex}
          className={`flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-500 transform ${
            direction === "right" ? "animate-fadeInRight" : "animate-fadeInLeft"
          }`}
        >
          {/* Background Image if present */}
          {hasImage && (
            <picture className="absolute inset-0 w-full h-full pointer-events-none">
              {currentBanner.mobileImage && (
                <source media="(max-width: 640px)" srcSet={currentBanner.mobileImage} />
              )}
              <img
                src={currentBanner.image}
                alt={currentBanner.title}
                className="w-full h-full object-cover opacity-40"
              />
            </picture>
          )}

          {hasImage && <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent pointer-events-none" />}

          {/* Left Text */}
          <div className="relative z-10 space-y-3 max-w-xl text-center md:text-left">
            {currentBanner.subtitle && (
              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-3 py-1 rounded-full">
                <Sparkles size={11} /> {currentBanner.subtitle}
              </span>
            )}

            <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-tight">
              {currentBanner.title}
            </h3>

            {currentBanner.description && (
              <p className="text-xs sm:text-sm text-slate-300 line-clamp-2">
                {currentBanner.description}
              </p>
            )}
          </div>

          {/* Right Action */}
          <div className="relative z-10 shrink-0 flex items-center gap-4">
            <button
              type="button"
              onClick={() => handleBannerClick(currentBanner)}
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 px-6 py-3 rounded-2xl text-xs font-black transition cursor-pointer inline-flex items-center gap-1.5 shadow-lg"
            >
              <span>{currentBanner.buttonText || "SHOP NOW"}</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>

        {/* Carousel Dots & Controls (If multiple banners exist) */}
        {banners.length > 1 && (
          <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/10 z-10 relative">
            <div className="flex items-center gap-1.5">
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    idx === currentIndex ? "w-6 bg-emerald-400" : "w-1.5 bg-white/30 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrev}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                title="Previous Banner"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={handleNext}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                title="Next Banner"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
