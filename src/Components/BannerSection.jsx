import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, Zap, Flame, Clock } from "lucide-react";
import { getPublicBanners } from "../api/bannerService";
import { useStore } from "../pages/Store/StoreContext";

export default function BannerSection({
  bannerType = "promotion",
  businessId = null,
  className = "",
  autoPlayInterval = 4500,
}) {
  const storeCtx = useStore();
  const activeBusinessId = businessId || storeCtx?.business?._id || null;
  const storeHomePath = storeCtx?.storeHomePath || "";

  // Initial seed from store context to avoid empty flash
  const contextBanners = useMemo(() => {
    const all = Array.isArray(storeCtx?.banners) ? storeCtx.banners : [];
    if (!all.length) return [];
    if (bannerType === "flashSale") {
      return all.filter((b) => b.type === "flashSale" || b.type === "promotion");
    }
    if (bannerType === "promotion") {
      return all.filter((b) => b.type === "promotion" || b.type === "flashSale" || b.type === "occasion");
    }
    if (bannerType && bannerType !== "All") {
      return all.filter((b) => b.type === bannerType);
    }
    return all.filter((b) => b.type !== "hero");
  }, [storeCtx?.banners, bannerType]);

  const [banners, setBanners] = useState(contextBanners);
  const [loading, setLoading] = useState(!contextBanners.length);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState("right");
  const navigate = useNavigate();

  useEffect(() => {
    if (contextBanners.length > 0) {
      setBanners(contextBanners);
      setLoading(false);
    }
  }, [contextBanners]);

  useEffect(() => {
    let isMounted = true;
    const fetchTypeBanners = async () => {
      try {
        const queryParams = {
          type: bannerType,
        };
        if (activeBusinessId) {
          queryParams.businessId = activeBusinessId;
        } else {
          queryParams.businessCategory = "E-Commerce";
          queryParams.listedOn = "superadmin";
        }

        const res = await getPublicBanners(queryParams);
        const list = res?.banners || res?.data || [];
        if (isMounted && Array.isArray(list) && list.length > 0) {
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
  }, [bannerType, activeBusinessId]);

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
    const prefix = storeHomePath || "";

    if (targetType === "product" && targetId) {
      navigate(prefix ? `${prefix}/product/${targetId}` : `/product/${targetId}`);
    } else if (targetType === "category" && targetId) {
      navigate(prefix ? `${prefix}/products?category=${targetId}` : `/shop?category=${targetId}`);
    } else if (targetType === "collection" && targetId) {
      navigate(prefix ? `${prefix}/products?collection=${targetId}` : `/shop?collection=${targetId}`);
    } else if (targetType === "occasion" && targetId) {
      navigate(prefix ? `${prefix}/products?occasion=${targetId}` : `/shop?occasion=${targetId}`);
    } else if (targetType === "flashSale" && targetId) {
      navigate(prefix ? `${prefix}/products?flashSale=${targetId}` : `/shop?flashSale=${targetId}`);
    } else if (targetType === "external" && b.targetUrl) {
      window.open(b.targetUrl, "_blank");
    } else if (b.targetUrl) {
      if (b.targetUrl.startsWith("http")) {
        window.open(b.targetUrl, "_blank");
      } else {
        navigate(b.targetUrl);
      }
    } else {
      navigate(prefix ? `${prefix}/products` : "/shop");
    }
  };

  const currentBanner = banners[currentIndex] || banners[0];
  const hasImage = Boolean(currentBanner?.image || currentBanner?.mobileImage);
  const isFlashSale = bannerType === "flashSale" || currentBanner?.type === "flashSale";

  const handleNext = () => {
    setDirection("right");
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const handlePrev = () => {
    setDirection("left");
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  return (
    <section className={`py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto ${className}`}>
      <div
        className={`relative rounded-3xl overflow-hidden shadow-2xl text-white p-6 sm:p-10 border transition-all duration-300 ${
          isFlashSale
            ? "bg-gradient-to-r from-amber-950 via-rose-950 to-slate-950 border-amber-500/30"
            : "bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 border-slate-800"
        }`}
      >
        {/* Ambient Decorative Blur */}
        {isFlashSale ? (
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-amber-500/20 blur-[100px] pointer-events-none" />
        ) : (
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-indigo-500/20 blur-[100px] pointer-events-none" />
        )}

        {/* Background Image if present */}
        {hasImage && (
          <picture className="absolute inset-0 w-full h-full pointer-events-none">
            {currentBanner.mobileImage && (
              <source media="(max-width: 640px)" srcSet={currentBanner.mobileImage} />
            )}
            <img
              src={currentBanner.image}
              alt={currentBanner.title}
              className="w-full h-full object-cover opacity-30"
            />
          </picture>
        )}

        {hasImage && (
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent pointer-events-none" />
        )}

        {/* Banner Card Content */}
        <div
          key={currentBanner._id || currentIndex}
          className={`relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 transition-all duration-500 transform ${
            direction === "right" ? "animate-fadeInRight" : "animate-fadeInLeft"
          }`}
        >
          {/* Left Text details */}
          <div className="space-y-4 max-w-2xl text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              {isFlashSale ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-300 bg-amber-500/20 border border-amber-500/30 px-3.5 py-1 rounded-full shadow-xs">
                  <Flame size={14} className="text-amber-400 animate-pulse" />
                  {currentBanner.subtitle || "LIMITED TIME MEGA OFFER"}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-emerald-400 bg-emerald-400/15 border border-emerald-400/25 px-3.5 py-1 rounded-full shadow-xs">
                  <Sparkles size={14} />
                  {currentBanner.subtitle || "SPECIAL PROMOTION"}
                </span>
              )}
            </div>

            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight tracking-tight">
              {currentBanner.title}
            </h3>

            {currentBanner.description && (
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium line-clamp-2 max-w-xl">
                {currentBanner.description}
              </p>
            )}
          </div>

          {/* Right Action CTA */}
          <div className="shrink-0 flex items-center gap-4">
            <button
              type="button"
              onClick={() => handleBannerClick(currentBanner)}
              className={`px-8 py-4 rounded-2xl text-xs font-black transition-all duration-300 cursor-pointer inline-flex items-center gap-2 shadow-xl hover:scale-105 ${
                isFlashSale
                  ? "bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 shadow-amber-500/25"
                  : "bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 shadow-emerald-500/25"
              }`}
            >
              <span>{currentBanner.buttonText || (isFlashSale ? "CLAIM OFFER" : "SHOP NOW")}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Carousel Dots & Controls */}
        {banners.length > 1 && (
          <div className="flex items-center justify-between pt-6 mt-6 border-t border-white/10 z-10 relative">
            <div className="flex items-center gap-2">
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === currentIndex
                      ? isFlashSale
                        ? "w-8 bg-amber-400"
                        : "w-8 bg-emerald-400"
                      : "w-2 bg-white/30 hover:bg-white/60"
                  }`}
                  aria-label={`Banner ${idx + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                title="Previous Banner"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={handleNext}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
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
