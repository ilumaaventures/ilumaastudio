import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap,
  Flame,
  Tag,
  Copy,
  Check,
  User,
  ShieldCheck,
  Gift,
} from "lucide-react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { getPublicBanners } from "../api/bannerService";
import { useStore } from "../pages/Store/StoreContext";

export default function BannerSection({
  bannerType = "promotion",
  businessId = null,
  className = "",
  autoPlayInterval = 5000,
}) {
  const storeCtx = useStore();
  const activeBusinessId = businessId || storeCtx?.business?._id || null;
  const storeHomePath = storeCtx?.storeHomePath || "";

  const { isAuthenticated, user } = useSelector((s) => s.auth || {});

  // Initial seed from store context to avoid empty flash
  const contextBanners = useMemo(() => {
    const all = Array.isArray(storeCtx?.banners) ? storeCtx.banners : [];
    if (!all.length) return [];
    if (bannerType === "flashSale") {
      return all.filter((b) => b.type === "flashSale" || b.type === "promotion");
    }
    if (bannerType === "promotion") {
      return all.filter(
        (b) =>
          b.type === "promotion" ||
          b.type === "flashSale" ||
          b.type === "occasion",
      );
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
  const [copiedCoupon, setCopiedCoupon] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
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
        } else if (isMounted && (!banners || banners.length === 0)) {
          // Fallback high-converting default promotion banner
          setBanners([
            {
              _id: "default_promo_1",
              title: "Handcrafted Luxury & Curated Specials",
              subtitle: "LIMITED TIME PRIVILEGE",
              description:
                "Discover exclusive deals up to 40% off across verified artisanal stores and lifestyle essentials.",
              couponCode: "ILUMAA40",
              buttonText: "EXPLORE COLLECTION",
              targetUrl: "/shop",
              image:
                "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&w=1200&q=80",
            },
          ]);
        }
      } catch (err) {
        console.warn(`Failed to fetch banners for type ${bannerType}:`, err);
        if (isMounted && (!banners || banners.length === 0)) {
          setBanners([
            {
              _id: "default_promo_1",
              title: "Handcrafted Luxury & Curated Specials",
              subtitle: "LIMITED TIME PRIVILEGE",
              description:
                "Discover exclusive deals up to 40% off across verified artisanal stores and lifestyle essentials.",
              couponCode: "ILUMAA40",
              buttonText: "EXPLORE COLLECTION",
              targetUrl: "/shop",
              image:
                "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&w=1200&q=80",
            },
          ]);
        }
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
    if (banners.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setDirection("right");
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [banners.length, autoPlayInterval, isPaused]);

  if (loading || banners.length === 0) return null;

  const handleBannerClick = (b) => {
    const targetType = b.targetType || "shop";
    const targetId =
      typeof b.targetId === "object" ? b.targetId?._id : b.targetId;
    const prefix = storeHomePath || "";

    if (targetType === "product" && targetId) {
      navigate(
        prefix ? `${prefix}/product/${targetId}` : `/product/${targetId}`,
      );
    } else if (targetType === "category" && targetId) {
      navigate(
        prefix
          ? `${prefix}/products?category=${targetId}`
          : `/shop?category=${targetId}`,
      );
    } else if (targetType === "collection" && targetId) {
      navigate(
        prefix
          ? `${prefix}/products?collection=${targetId}`
          : `/shop?collection=${targetId}`,
      );
    } else if (targetType === "occasion" && targetId) {
      navigate(
        prefix
          ? `${prefix}/products?occasion=${targetId}`
          : `/shop?occasion=${targetId}`,
      );
    } else if (targetType === "flashSale" && targetId) {
      navigate(
        prefix
          ? `${prefix}/products?flashSale=${targetId}`
          : `/shop?flashSale=${targetId}`,
      );
    } else if (targetType === "external" && b.targetUrl) {
      window.open(b.targetUrl, "_blank", "noopener,noreferrer");
    } else if (b.targetUrl) {
      if (b.targetUrl.startsWith("http")) {
        window.open(b.targetUrl, "_blank", "noopener,noreferrer");
      } else {
        navigate(b.targetUrl);
      }
    } else {
      navigate(prefix ? `${prefix}/products` : "/shop");
    }
  };

  const currentBanner = banners[currentIndex] || banners[0];
  const hasImage = Boolean(currentBanner?.image || currentBanner?.mobileImage);
  const isFlashSale =
    bannerType === "flashSale" || currentBanner?.type === "flashSale";

  const couponCode =
    currentBanner?.couponCode ||
    currentBanner?.code ||
    (isFlashSale ? "FLASH50" : "STUDIO15");

  const handleCopyCoupon = (e) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(couponCode);
    setCopiedCoupon(true);
    toast.success(`Coupon code "${couponCode}" copied to clipboard!`);
    setTimeout(() => setCopiedCoupon(false), 2500);
  };

  const handleNext = () => {
    setDirection("right");
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const handlePrev = () => {
    setDirection("left");
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  return (
    <section
      className={`py-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-sans ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className={`relative rounded-[28px] sm:rounded-[32px] overflow-hidden shadow-[0_16px_45px_rgba(15,23,42,0.12)] text-white p-6 sm:p-9 lg:p-11 border transition-all duration-300 ${
          isFlashSale
            ? "bg-gradient-to-r from-[#1c120c] via-[#2a170e] to-[#120a06] border-amber-500/30"
            : "bg-gradient-to-r from-slate-950 via-[#0e1726] to-[#090d16] border-slate-800/80"
        }`}
      >
        {/* Subtle Ambient Radial Lighting */}
        <div
          className={`absolute -top-28 -right-28 w-96 h-96 rounded-full blur-[100px] pointer-events-none ${
            isFlashSale ? "bg-amber-500/15" : "bg-blue-600/15"
          }`}
        />
        <div
          className={`absolute -bottom-28 -left-28 w-80 h-80 rounded-full blur-[90px] pointer-events-none ${
            isFlashSale ? "bg-orange-500/10" : "bg-purple-600/10"
          }`}
        />

        {/* Background Image with Crisp Contrast Gradient */}
        {hasImage && (
          <picture className="absolute inset-0 w-full h-full pointer-events-none">
            {currentBanner.mobileImage && (
              <source
                media="(max-width: 640px)"
                srcSet={currentBanner.mobileImage}
              />
            )}
            <img
              src={currentBanner.image}
              alt={currentBanner.title || "Promotion Banner"}
              className="w-full h-full object-cover opacity-25 scale-105 transition-transform duration-700"
            />
          </picture>
        )}

        {hasImage && (
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 via-[55%] to-transparent pointer-events-none" />
        )}

        {/* Customer Interaction & Login Notification Bar */}
        <div className="relative z-10 mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            {isAuthenticated ? (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>
                  Welcome, {user?.name || "Member"}! Exclusive member savings active
                </span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-bold shadow-xs">
                <Gift size={13} className="text-blue-400" />
                <span>Sign in to unlock an extra 15% welcome discount</span>
              </div>
            )}
          </div>

          {/* Customer Action: Login Prompt or Coupon Code */}
          <div className="flex items-center gap-2">
            {!isAuthenticated && (
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold transition-all shadow-xs"
              >
                <User size={12} />
                <span>Sign In</span>
              </Link>
            )}

            {/* Click to Copy Coupon Code */}
            <button
              type="button"
              onClick={handleCopyCoupon}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 hover:bg-amber-400/30 border border-amber-400/40 text-amber-300 text-xs font-mono font-bold tracking-wider transition-all cursor-pointer shadow-xs"
              title="Click to copy coupon code"
            >
              <Tag size={12} />
              <span>{couponCode}</span>
              {copiedCoupon ? (
                <Check size={12} className="text-emerald-400" />
              ) : (
                <Copy size={11} className="opacity-70" />
              )}
            </button>
          </div>
        </div>

        {/* Banner Main Row Content */}
        <div
          key={currentBanner._id || currentIndex}
          className={`relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 transition-all duration-500 ${
            direction === "right" ? "animate-fadeInRight" : "animate-fadeInLeft"
          }`}
        >
          {/* Left Text details */}
          <div className="space-y-3.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              {isFlashSale ? (
                <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-black uppercase tracking-wider text-amber-300 bg-amber-500/20 border border-amber-500/30 px-3 py-1 rounded-full shadow-xs">
                  <Flame size={13} className="text-amber-400 animate-pulse" />
                  {currentBanner.subtitle || "FLASH SALE SPECIAL"}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-black uppercase tracking-wider text-blue-300 bg-blue-500/20 border border-blue-500/30 px-3 py-1 rounded-full shadow-xs">
                  <Sparkles size={13} className="text-blue-400" />
                  {currentBanner.subtitle || "FEATURED CURATION"}
                </span>
              )}

              <span className="text-[11px] text-slate-300 font-semibold flex items-center gap-1">
                <ShieldCheck size={12} className="text-emerald-400" />
                Verified Genuine Stores
              </span>
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

          {/* Right Action CTAs */}
          <div className="shrink-0 flex items-center gap-3 pt-2 lg:pt-0">
            <button
              type="button"
              onClick={() => handleBannerClick(currentBanner)}
              className={`px-7 py-3.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-300 cursor-pointer inline-flex items-center gap-2.5 shadow-xl hover:scale-[1.03] active:scale-[0.98] ${
                isFlashSale
                  ? "bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 shadow-amber-500/25"
                  : "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-blue-500/30"
              }`}
            >
              <span>{currentBanner.buttonText || (isFlashSale ? "CLAIM OFFER" : "SHOP NOW")}</span>
              <ArrowRight size={15} />
            </button>

            {!isAuthenticated && (
              <Link
                to="/register"
                className="hidden sm:inline-flex items-center gap-2 px-5 py-3.5 rounded-xl text-xs font-bold text-slate-200 bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md transition-all shadow-xs"
              >
                <span>Join Free</span>
              </Link>
            )}
          </div>
        </div>

        {/* Carousel Pagination Dots & Nav Arrows */}
        {banners.length > 1 && (
          <div className="flex items-center justify-between pt-5 mt-5 border-t border-white/10 z-10 relative">
            <div className="flex items-center gap-1.5">
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === currentIndex
                      ? isFlashSale
                        ? "w-7 bg-amber-400"
                        : "w-7 bg-blue-400"
                      : "w-2 bg-white/30 hover:bg-white/60"
                  }`}
                  aria-label={`Banner ${idx + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrev}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                title="Previous Banner"
                aria-label="Previous Banner"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                title="Next Banner"
                aria-label="Next Banner"
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
