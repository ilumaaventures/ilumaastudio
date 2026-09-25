import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
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
  const navigate = useNavigate();

  /* -------------------------------------------------------
     CONTEXT BANNERS (WHEN INSIDE A SHOP)
  ------------------------------------------------------- */
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
          b.type === "occasion"
      );
    }

    if (bannerType && bannerType !== "All") {
      return all.filter((b) => b.type === bannerType);
    }

    return all.filter((b) => b.type !== "hero");
  }, [storeCtx?.banners, bannerType]);

  /* -------------------------------------------------------
     STATE
  ------------------------------------------------------- */
  const [banners, setBanners] = useState(contextBanners);
  const [loading, setLoading] = useState(!contextBanners.length);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState("next");
  const [copiedCoupon, setCopiedCoupon] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Touch Swipe State
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  /* -------------------------------------------------------
     SYNC CONTEXT
  ------------------------------------------------------- */
  useEffect(() => {
    if (contextBanners.length > 0) {
      setBanners(contextBanners);
      setLoading(false);
      setCurrentIndex(0);
    }
  }, [contextBanners]);

  /* -------------------------------------------------------
     FETCH BANNERS DIRECTLY FROM PUBLIC BANNER API
  ------------------------------------------------------- */
  useEffect(() => {
    // If context banners already provided by store context, keep them
    if (contextBanners.length > 0) return;

    let mounted = true;

    const fetchBanners = async () => {
      try {
        setLoading(true);

        const queryParams = {
          type: bannerType === "All" ? undefined : bannerType,
        };

        if (activeBusinessId) {
          queryParams.businessId = activeBusinessId;
        } else {
          // Query studio promotional banners
          queryParams.businessCategory = "E-Commerce";
          queryParams.listedOn = "studio";
        }

        const res = await getPublicBanners(queryParams);
        const list = res?.banners || res?.data || [];

        if (mounted && Array.isArray(list) && list.length > 0) {
          // Strictly filter for:
          // 1. Banner display type is promotional (or requested type)
          // 2. Allowed to be listed on main website studio and superadmin
          const filtered = list.filter((b) => {
            const matchesType =
              bannerType === "All" ||
              b.type === bannerType ||
              (bannerType === "promotion" &&
                (b.type === "promotion" || b.type === "flashSale"));

            if (!matchesType) return false;

            if (!activeBusinessId) {
              if (b.listedOn && Array.isArray(b.listedOn) && b.listedOn.length > 0) {
                const allowed = b.listedOn.some((loc) =>
                  ["studio", "superadmin", "mainpage", "all"].includes(
                    String(loc).toLowerCase()
                  )
                );
                if (!allowed) return false;
              }
            }

            return true;
          });

          if (filtered.length > 0) {
            setBanners(filtered);
            setCurrentIndex(0);
            return;
          }
        }

        // Professional curated fallback if database has no promotional banners yet
        if (mounted) {
          setBanners([
            {
              _id: "default_promo_1",
              type: "promotion",
              title: "Curated Essentials, Made to Impress",
              subtitle: "FEATURED COLLECTION",
              description:
                "Discover thoughtful gifts, premium essentials and handpicked collections from verified brands.",
              couponCode: "ILUMAA15",
              buttonText: "Explore Collection",
              targetType: "shop",
              targetUrl: "/shop",
              image:
                "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&w=1800&q=85",
            },
            {
              _id: "default_promo_2",
              type: "promotion",
              title: "Studio Highlights & Exclusive Privileges",
              subtitle: "MEMBER SPECIAL",
              description:
                "Enjoy guaranteed authentic products, effortless express delivery and direct brand discounts.",
              couponCode: "STUDIO20",
              buttonText: "Shop Collection",
              targetType: "shop",
              targetUrl: "/shop",
              image:
                "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1800&q=85",
            },
          ]);
          setCurrentIndex(0);
        }
      } catch (error) {
        console.warn(`Failed to fetch ${bannerType} banners:`, error);
        if (mounted) {
          setBanners([
            {
              _id: "default_promo_1",
              type: "promotion",
              title: "Curated Essentials, Made to Impress",
              subtitle: "FEATURED COLLECTION",
              description:
                "Discover thoughtful gifts, premium essentials and handpicked collections from verified brands.",
              couponCode: "ILUMAA15",
              buttonText: "Explore Collection",
              targetType: "shop",
              targetUrl: "/shop",
              image:
                "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&w=1800&q=85",
            },
          ]);
          setCurrentIndex(0);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchBanners();

    return () => {
      mounted = false;
    };
  }, [bannerType, activeBusinessId, contextBanners.length]);

  /* -------------------------------------------------------
     CAROUSEL CONTROLS
  ------------------------------------------------------- */
  const handleNext = useCallback(
    (e) => {
      e?.stopPropagation();
      if (banners.length <= 1) return;
      setDirection("next");
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    },
    [banners.length]
  );

  const handlePrev = useCallback(
    (e) => {
      e?.stopPropagation();
      if (banners.length <= 1) return;
      setDirection("prev");
      setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
    },
    [banners.length]
  );

  /* -------------------------------------------------------
     AUTO PLAY
  ------------------------------------------------------- */
  useEffect(() => {
    if (banners.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      handleNext();
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [banners.length, autoPlayInterval, isPaused, handleNext]);

  /* -------------------------------------------------------
     TOUCH SUPPORT
  ------------------------------------------------------- */
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
      handleNext();
    } else if (distance < -45) {
      handlePrev();
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  /* -------------------------------------------------------
     NAVIGATION
  ------------------------------------------------------- */
  const handleBannerClick = (banner) => {
    if (!banner) return;
    const targetType = banner.targetType || "shop";
    const targetId =
      typeof banner.targetId === "object" ? banner.targetId?._id : banner.targetId;

    const prefix = storeHomePath || "";

    if (targetType === "product" && targetId) {
      navigate(prefix ? `${prefix}/product/${targetId}` : `/product/${targetId}`);
      return;
    }

    if (targetType === "category" && targetId) {
      navigate(
        prefix
          ? `${prefix}/products?category=${targetId}`
          : `/shop?category=${targetId}`
      );
      return;
    }

    if (targetType === "collection" && targetId) {
      navigate(
        prefix
          ? `${prefix}/products?collection=${targetId}`
          : `/shop?collection=${targetId}`
      );
      return;
    }

    if (targetType === "occasion" && targetId) {
      navigate(
        prefix
          ? `${prefix}/products?occasion=${targetId}`
          : `/shop?occasion=${targetId}`
      );
      return;
    }

    if (targetType === "flashSale" && targetId) {
      navigate(
        prefix
          ? `${prefix}/products?flashSale=${targetId}`
          : `/shop?flashSale=${targetId}`
      );
      return;
    }

    if (targetType === "external" && banner.targetUrl) {
      window.open(banner.targetUrl, "_blank", "noopener,noreferrer");
      return;
    }

    if (banner.targetUrl) {
      if (banner.targetUrl.startsWith("http")) {
        window.open(banner.targetUrl, "_blank", "noopener,noreferrer");
      } else {
        navigate(banner.targetUrl);
      }
      return;
    }

    navigate(prefix ? `${prefix}/products` : "/shop");
  };

  /* -------------------------------------------------------
     CURRENT BANNER & COUPON
  ------------------------------------------------------- */
  const currentBanner = banners[currentIndex] || banners[0];
  const isFlashSale =
    bannerType === "flashSale" || currentBanner?.type === "flashSale";

  const couponCode =
    currentBanner?.couponCode ||
    currentBanner?.code ||
    (isFlashSale ? "FLASH50" : "ILUMAA15");

  const handleCopyCoupon = async (e) => {
    e.stopPropagation();
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(couponCode);
      }
      setCopiedCoupon(true);
      toast.success(`Coupon "${couponCode}" copied!`);
      setTimeout(() => setCopiedCoupon(false), 2200);
    } catch {
      toast.error("Unable to copy coupon");
    }
  };

  if (loading || !banners.length || !currentBanner) {
    return null;
  }

  const hasImage = Boolean(currentBanner.image || currentBanner.mobileImage);

  return (
    <section
      className={`w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-5 font-sans ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="max-w-7xl mx-auto">
        <div
          onClick={() => handleBannerClick(currentBanner)}
          className="
            group
            relative
            h-[270px]
            sm:h-[300px]
            lg:h-[320px]
            overflow-hidden
            rounded-[24px]
            sm:rounded-[28px]
            bg-slate-100
            shadow-[0_12px_40px_rgba(15,23,42,0.08)]
            hover:shadow-[0_18px_45px_rgba(37,99,235,0.12)]
            border border-slate-200/80
            cursor-pointer
            transition-all
            duration-300
          "
        >
          {/* ------------------------------------------------
              FULL IMAGE
          ------------------------------------------------ */}
          {hasImage && (
            <picture className="absolute inset-0">
              {currentBanner.mobileImage && (
                <source
                  media="(max-width: 640px)"
                  srcSet={currentBanner.mobileImage}
                />
              )}
              <img
                key={currentBanner._id || currentIndex}
                src={currentBanner.image}
                alt={currentBanner.title || "Promotional Banner"}
                className={`
                  absolute
                  inset-0
                  w-full
                  h-full
                  object-cover
                  transition-all
                  duration-700
                  ease-out
                  ${
                    direction === "next"
                      ? "animate-[bannerNext_0.65s_ease-out]"
                      : "animate-[bannerPrev_0.65s_ease-out]"
                  }
                `}
              />
            </picture>
          )}

          {/* ------------------------------------------------
              READABILITY OVERLAY (WHITE / NAVY THEME)
          ------------------------------------------------ */}
          <div
            className="
              absolute
              inset-0
              bg-gradient-to-r
              from-white/95
              via-white/75
              via-[45%]
              to-transparent
              pointer-events-none
            "
          />

          {/* ------------------------------------------------
              TOP BADGES ROW
          ------------------------------------------------ */}
          <div
            className="
              absolute
              top-4
              left-4
              sm:top-5
              sm:left-6
              z-20
              flex
              items-center
              gap-2
            "
          >
            <div
              className="
                inline-flex
                items-center
                gap-1.5
                rounded-full
                border
                border-blue-200
                bg-blue-50/90
                backdrop-blur-md
                px-3
                py-1
                text-[10px]
                sm:text-[11px]
                font-extrabold
                tracking-wider
                uppercase
                text-blue-700
                shadow-sm
              "
            >
              {isFlashSale ? (
                <Flame size={12} className="text-orange-600 fill-orange-500" />
              ) : (
                <Sparkles size={12} className="text-blue-600" />
              )}
              <span>
                {currentBanner.subtitle ||
                  (isFlashSale ? "FLASH SALE" : "PROMOTIONAL HIGHLIGHT")}
              </span>
            </div>
          </div>

          {/* ------------------------------------------------
              TOP-RIGHT MEMBER / COUPON ACTIONS
          ------------------------------------------------ */}
          <div
            className="
              absolute
              top-4
              right-4
              sm:top-5
              sm:right-6
              z-20
              hidden
              sm:flex
              items-center
              gap-2
            "
          >
            {!isAuthenticated && (
              <Link
                to="/login"
                onClick={(e) => e.stopPropagation()}
                className="
                  inline-flex
                  items-center
                  gap-1.5
                  rounded-full
                  bg-white/90
                  backdrop-blur-md
                  border
                  border-slate-200
                  px-3
                  py-1.5
                  text-[11px]
                  font-semibold
                  text-slate-700
                  shadow-sm
                  hover:bg-white
                  hover:text-blue-600
                  transition
                "
              >
                <User size={12} />
                Sign in
              </Link>
            )}

            <button
              type="button"
              onClick={handleCopyCoupon}
              className="
                inline-flex
                items-center
                gap-1.5
                rounded-full
                bg-white/95
                backdrop-blur-md
                border
                border-slate-200
                px-3
                py-1.5
                text-[10px]
                sm:text-[11px]
                font-bold
                text-slate-800
                shadow-sm
                hover:border-blue-300
                hover:bg-blue-50/60
                transition
                cursor-pointer
              "
              title="Click to copy coupon code"
            >
              <Tag size={12} className="text-blue-600" />
              <span className="font-mono tracking-wide">{couponCode}</span>
              {copiedCoupon ? (
                <Check size={12} className="text-emerald-500" />
              ) : (
                <Copy size={11} className="text-slate-400" />
              )}
            </button>
          </div>

          {/* ------------------------------------------------
              FLOATING CONTENT PANEL
          ------------------------------------------------ */}
          <div
            key={currentBanner._id || currentIndex}
            className="
              absolute
              z-20
              left-4
              bottom-4
              sm:left-6
              sm:bottom-6
              lg:left-8
              lg:bottom-7
              w-[calc(100%-32px)]
              sm:w-[440px]
              lg:w-[480px]
              max-w-[calc(100%-32px)]
              animate-[contentReveal_0.5s_ease-out]
            "
          >
            <div
              className="
                rounded-[20px]
                sm:rounded-[22px]
                bg-white/92
                backdrop-blur-xl
                border
                border-white/80
                shadow-[0_12px_40px_rgba(15,23,42,0.12)]
                px-4
                py-3.5
                sm:px-5
                sm:py-4.5
              "
            >
              {/* Trust Tag */}
              <div className="flex items-center justify-between gap-3 mb-1.5">
                <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-semibold text-slate-500">
                  <ShieldCheck size={13} className="text-blue-600" />
                  <span>Curated & Verified</span>
                </div>
                {isAuthenticated && (
                  <span className="text-[10px] font-bold text-emerald-600">
                    Member privilege active
                  </span>
                )}
              </div>

              {/* Title */}
              <h3
                className="
                  text-lg
                  sm:text-xl
                  lg:text-[22px]
                  font-black
                  tracking-tight
                  leading-snug
                  text-slate-900
                  line-clamp-2
                "
              >
                {currentBanner.title}
              </h3>

              {/* Description */}
              {currentBanner.description && (
                <p
                  className="
                    mt-1
                    text-[11px]
                    sm:text-xs
                    leading-relaxed
                    text-slate-600
                    line-clamp-2
                    max-w-[400px]
                  "
                >
                  {currentBanner.description}
                </p>
              )}

              {/* Action Button */}
              <div className="flex items-center gap-3 mt-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBannerClick(currentBanner);
                  }}
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    px-4
                    sm:px-5
                    py-2
                    sm:py-2.5
                    rounded-xl
                    text-xs
                    font-extrabold
                    text-white
                    bg-blue-600
                    hover:bg-blue-700
                    shadow-sm
                    hover:shadow-md
                    transition-all
                    duration-200
                    hover:-translate-y-0.5
                    active:scale-95
                  "
                >
                  <span>{currentBanner.buttonText || "Explore Collection"}</span>
                  <ArrowRight size={14} />
                </button>

                <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-medium text-slate-400">
                  <Gift size={13} className="text-slate-400" />
                  Direct Brand Offers
                </div>
              </div>
            </div>
          </div>

          {/* ------------------------------------------------
              CAROUSEL NAVIGATION ARROWS & DOTS (WHEN > 1 BANNER)
          ------------------------------------------------ */}
          {banners.length > 1 && (
            <>
              {/* Left Arrow */}
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous Banner"
                className="
                  absolute
                  left-3
                  top-1/2
                  -translate-y-1/2
                  z-30
                  hidden
                  sm:flex
                  items-center
                  justify-center
                  w-9
                  h-9
                  rounded-full
                  bg-white/80
                  hover:bg-white
                  text-slate-700
                  hover:text-blue-600
                  border
                  border-slate-200
                  shadow-md
                  backdrop-blur-sm
                  transition-all
                  duration-200
                  hover:scale-105
                  active:scale-95
                "
              >
                <ChevronLeft size={18} />
              </button>

              {/* Right Arrow */}
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next Banner"
                className="
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  z-30
                  hidden
                  sm:flex
                  items-center
                  justify-center
                  w-9
                  h-9
                  rounded-full
                  bg-white/80
                  hover:bg-white
                  text-slate-700
                  hover:text-blue-600
                  border
                  border-slate-200
                  shadow-md
                  backdrop-blur-sm
                  transition-all
                  duration-200
                  hover:scale-105
                  active:scale-95
                "
              >
                <ChevronRight size={18} />
              </button>

              {/* Pagination Dots */}
              <div
                className="
                  absolute
                  bottom-3.5
                  right-4
                  sm:right-6
                  z-30
                  flex
                  items-center
                  gap-1.5
                  bg-black/20
                  backdrop-blur-md
                  px-2.5
                  py-1
                  rounded-full
                "
              >
                {banners.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDirection(dotIdx > currentIndex ? "next" : "prev");
                      setCurrentIndex(dotIdx);
                    }}
                    aria-label={`Go to slide ${dotIdx + 1}`}
                    className={`
                      h-1.5
                      rounded-full
                      transition-all
                      duration-300
                      ${
                        dotIdx === currentIndex
                          ? "w-5 bg-white shadow-sm"
                          : "w-1.5 bg-white/50 hover:bg-white/80"
                      }
                    `}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ---------------------------------------------------
          CUSTOM ANIMATIONS
      --------------------------------------------------- */}
      <style>{`
        @keyframes contentReveal {
          0% {
            opacity: 0;
            transform: translateY(8px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes bannerNext {
          0% {
            opacity: 0.7;
            transform: scale(1.02) translateX(12px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateX(0);
          }
        }
        @keyframes bannerPrev {
          0% {
            opacity: 0.7;
            transform: scale(1.02) translateX(-12px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateX(0);
          }
        }
      `}</style>
    </section>
  );
}
