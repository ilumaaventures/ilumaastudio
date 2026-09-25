import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  Tag,
  Copy,
  Check,
  User,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { getPublicBanners } from "../../../api/bannerService";

export default function MegaSaleBanner({
  title: initialTitle,
  description: initialDescription,
  imageUrl: initialImageUrl,
  linkUrl: initialLinkUrl,
  bannerType = null,
  autoPlayInterval = 5000,
}) {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((s) => s.auth || {});

  /* =========================================================
     LOAD BANNERS (OR RESPECT CURATED PROPS)
  ========================================================= */
  useEffect(() => {
    let isMounted = true;

    // If explicit curated props are passed, use them directly
    if (initialTitle) {
      setBanners([
        {
          _id: "curated_banner",
          title: initialTitle,
          subtitle: initialTitle.toLowerCase().includes("delicious")
            ? "FOOD & GOURMET OFFERS"
            : "CURATED DISCOVERY",
          description: initialDescription,
          image: initialImageUrl || "",
          targetUrl: initialLinkUrl || "/shop",
          buttonText: "Shop Collection",
          couponCode: initialTitle.toLowerCase().includes("delicious")
            ? "YUMMY50"
            : "ILUMA20",
        },
      ]);
      return;
    }

    // Otherwise fetch dynamic banners if bannerType is requested
    if (bannerType) {
      const loadBanners = async () => {
        try {
          const res = await getPublicBanners({
            type: bannerType,
            businessCategory: "E-Commerce",
            listedOn: "superadmin",
          });

          const list = res?.banners || res?.data || [];
          if (isMounted && list.length > 0) {
            setBanners(list);
          }
        } catch (error) {
          console.warn("Failed to load promotional banners:", error);
        }
      };

      loadBanners();
    }

    return () => {
      isMounted = false;
    };
  }, [bannerType, initialTitle, initialDescription, initialImageUrl, initialLinkUrl]);

  if (banners.length === 0) {
    return null;
  }

  const currentBanner = banners[currentIndex] || banners[0];
  const couponCode = currentBanner.couponCode || "ILUMAA10";

  const handleCopyCoupon = (e) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(couponCode);
    setCopiedCode(true);
    toast.success(`Coupon "${couponCode}" copied to clipboard!`);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleBannerClick = (banner) => {
    const targetUrl = banner.targetUrl || banner.linkUrl || initialLinkUrl || "/shop";
    if (targetUrl.startsWith("http")) {
      window.open(targetUrl, "_blank", "noopener,noreferrer");
    } else {
      navigate(targetUrl);
    }
  };

  const hasImage = Boolean(currentBanner.image || initialImageUrl);
  const displayImage = currentBanner.image || initialImageUrl;

  return (
    <section
      className="w-full px-4 py-3 sm:px-6 lg:px-8 font-sans"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="mx-auto max-w-7xl">
        <div
          onClick={() => handleBannerClick(currentBanner)}
          className="
            group
            relative
            overflow-hidden
            rounded-[26px]
            sm:rounded-[32px]
            bg-white
            dark:bg-slate-900
            border
            border-slate-200/80
            dark:border-slate-800
            shadow-[0_12px_40px_rgba(15,23,42,0.06)]
            hover:shadow-[0_18px_50px_rgba(15,23,42,0.12)]
            hover:border-blue-400/40
            transition-all
            duration-300
            cursor-pointer
          "
        >
          {/* Subtle Ambient Decorative Lighting */}
          <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-blue-500/10 blur-[80px]" />
          <div className="pointer-events-none absolute -bottom-20 right-10 h-64 w-64 rounded-full bg-indigo-500/10 blur-[80px]" />

          <div className="relative flex flex-col md:flex-row min-h-[250px] md:min-h-[280px]">
            {/* Left Content Area */}
            <div className="relative z-10 flex flex-1 flex-col justify-center px-6 py-7 sm:px-9 sm:py-9 md:px-12">
              {/* Customer Interaction & Login Status Chip */}
              <div className="flex flex-wrap items-center gap-2.5 mb-3.5">
                {currentBanner.subtitle && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900 shadow-2xs">
                    <Sparkles size={11} className="text-amber-500" />
                    {currentBanner.subtitle}
                  </span>
                )}

                {/* Personalized Member recognition */}
                {isAuthenticated ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-800">
                    <ShieldCheck size={12} />
                    <span>Member Discount Active for {user?.name || "You"}</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    <Zap size={12} className="text-amber-500" />
                    <span>Instant checkout • Free returns</span>
                  </span>
                )}
              </div>

              {/* Title */}
              <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-black text-slate-900 dark:text-white leading-tight tracking-tight max-w-xl">
                {currentBanner.title}
              </h2>

              {/* Description */}
              {currentBanner.description && (
                <p className="mt-2.5 max-w-lg text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  {currentBanner.description}
                </p>
              )}

              {/* Action Buttons & Customer Interaction */}
              <div className="mt-6 flex flex-wrap items-center gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBannerClick(currentBanner);
                  }}
                  className="
                    group/btn
                    inline-flex
                    items-center
                    gap-2
                    rounded-xl
                    bg-slate-900
                    dark:bg-white
                    hover:bg-blue-600
                    dark:hover:bg-blue-600
                    px-5
                    py-2.5
                    sm:py-3
                    text-xs
                    font-extrabold
                    text-white
                    dark:text-slate-900
                    dark:hover:text-white
                    shadow-sm
                    transition-all
                    duration-200
                    hover:scale-[1.02]
                    active:scale-[0.98]
                    cursor-pointer
                  "
                >
                  <span>{currentBanner.buttonText || "Shop Now"}</span>
                  <ArrowRight
                    size={14}
                    className="transition-transform duration-200 group-hover/btn:translate-x-1"
                  />
                </button>

                {/* 1-Click Interactive Coupon Code */}
                <button
                  type="button"
                  onClick={handleCopyCoupon}
                  className="
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-xl
                    bg-slate-100
                    dark:bg-slate-800
                    hover:bg-slate-200/80
                    dark:hover:bg-slate-700
                    px-3.5
                    py-2.5
                    sm:py-3
                    text-xs
                    font-mono
                    font-bold
                    text-slate-700
                    dark:text-slate-200
                    border
                    border-slate-200
                    dark:border-slate-700
                    transition-all
                    cursor-pointer
                  "
                  title="Click to copy coupon code"
                >
                  <Tag size={13} className="text-blue-500" />
                  <span>{couponCode}</span>
                  {copiedCode ? (
                    <Check size={13} className="text-emerald-500" />
                  ) : (
                    <Copy size={12} className="opacity-60" />
                  )}
                </button>

                {/* Sign-in prompt for guest visitors */}
                {!isAuthenticated && (
                  <Link
                    to="/login"
                    onClick={(e) => e.stopPropagation()}
                    className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <User size={13} />
                    <span>Sign in to save more</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Right Image Showcase */}
            {hasImage && (
              <div className="relative min-h-[190px] w-full overflow-hidden md:min-h-full md:w-[42%] lg:w-[40%] bg-slate-100 dark:bg-slate-800">
                <img
                  src={displayImage}
                  alt={currentBanner.title || "Banner Offer"}
                  loading="lazy"
                  decoding="async"
                  className="
                    absolute
                    inset-0
                    h-full
                    w-full
                    object-cover
                    transition-transform
                    duration-700
                    ease-out
                    group-hover:scale-105
                  "
                />

                {/* Subtle soft gradient blending into card */}
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-white via-white/30 to-transparent dark:from-slate-900 dark:via-slate-900/30 dark:to-transparent pointer-events-none" />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
