import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  Tag,
  Copy,
  Check,
  User,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { getPublicBanners } from "../../../api/bannerService";

export default function MegaSaleBanner({
  bannerIndex = 0,
  bannerType = "promotion",
  title: propTitle,
  description: propDescription,
  imageUrl: propImageUrl,
  linkUrl: propLinkUrl,
  fallbackTitle = "Curated Essentials for Modern Living",
  fallbackDescription = "Explore handpicked products from verified brands with effortless checkout and dependable delivery.",
  fallbackImageUrl = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80",
  fallbackLinkUrl = "/shop",
  className = "",
}) {
  const [apiBanners, setApiBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);

  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((s) => s.auth || {});

  /* -------------------------------------------------------
     FETCH PROMOTIONAL BANNERS FROM BACKEND API
  ------------------------------------------------------- */
  useEffect(() => {
    let isMounted = true;

    const fetchPromotionalBanners = async () => {
      try {
        setLoading(true);

        const res = await getPublicBanners({
          type: "promotion",
          businessCategory: "E-Commerce",
          listedOn: "studio",
        });

        const list = res?.banners || res?.data || [];

        if (!isMounted) return;

        if (Array.isArray(list) && list.length > 0) {
          // Strictly filter for:
          // 1. Promotional display type
          // 2. Allowed on studio and superadmin
          const validBanners = list.filter((b) => {
            const isPromo = b.type === "promotion";
            if (!isPromo) return false;

            if (b.listedOn && Array.isArray(b.listedOn) && b.listedOn.length > 0) {
              const allowed = b.listedOn.some((loc) =>
                ["studio", "superadmin", "mainpage", "all"].includes(
                  String(loc).toLowerCase()
                )
              );
              if (!allowed) return false;
            }

            return true;
          });

          setApiBanners(validBanners);
        } else {
          setApiBanners([]);
        }
      } catch (error) {
        console.warn("Failed to load promotional banners for MegaSaleBanner:", error);
        if (isMounted) setApiBanners([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPromotionalBanners();

    return () => {
      isMounted = false;
    };
  }, [bannerType]);

  /* -------------------------------------------------------
     SELECT ACTIVE BANNER BY INDEX OR FALLBACK
  ------------------------------------------------------- */
  const activeBanner = useMemo(() => {
    if (apiBanners.length > 0) {
      const selected =
        apiBanners[bannerIndex] ||
        apiBanners[bannerIndex % apiBanners.length] ||
        apiBanners[0];

      return {
        _id: selected._id,
        title: selected.title || propTitle || fallbackTitle,
        subtitle: selected.subtitle || "PROMOTIONAL EXCLUSIVE",
        description: selected.description || propDescription || fallbackDescription,
        image: selected.image || selected.mobileImage || propImageUrl || fallbackImageUrl,
        buttonText: selected.buttonText || "Shop Collection",
        targetType: selected.targetType || "shop",
        targetId: selected.targetId,
        targetUrl: selected.targetUrl || propLinkUrl || fallbackLinkUrl,
        couponCode: selected.couponCode || (bannerIndex === 1 ? "STUDIO20" : "ILUMA15"),
        isApiBanner: true,
      };
    }

    // Curated Fallback if API has no banners seeded yet
    return {
      _id: `fallback-${bannerIndex}`,
      title: propTitle || fallbackTitle,
      subtitle: bannerIndex === 1 ? "STUDIO EXCLUSIVE" : "FEATURED COLLECTION",
      description: propDescription || fallbackDescription,
      image: propImageUrl || fallbackImageUrl,
      buttonText: "Shop Collection",
      targetType: "shop",
      targetId: null,
      targetUrl: propLinkUrl || fallbackLinkUrl,
      couponCode: bannerIndex === 1 ? "STUDIO20" : "ILUMA15",
      isApiBanner: false,
    };
  }, [
    apiBanners,
    bannerIndex,
    propTitle,
    propDescription,
    propImageUrl,
    propLinkUrl,
    fallbackTitle,
    fallbackDescription,
    fallbackImageUrl,
    fallbackLinkUrl,
  ]);

  /* -------------------------------------------------------
     COUPON COPY
  ------------------------------------------------------- */
  const handleCopyCoupon = (e) => {
    e.stopPropagation();
    const code = activeBanner.couponCode || "ILUMA15";

    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(code);
    }
    setCopiedCode(true);
    toast.success(`Coupon "${code}" copied to clipboard!`);
    setTimeout(() => setCopiedCode(false), 2200);
  };

  /* -------------------------------------------------------
     NAVIGATION HANDLER
  ------------------------------------------------------- */
  const handleBannerClick = () => {
    const { targetType, targetId, targetUrl } = activeBanner;
    const cleanTargetId =
      typeof targetId === "object" ? targetId?._id : targetId;

    if (targetType === "product" && cleanTargetId) {
      navigate(`/product/${cleanTargetId}`);
      return;
    }
    if (targetType === "category" && cleanTargetId) {
      navigate(`/shop?category=${cleanTargetId}`);
      return;
    }
    if (targetType === "collection" && cleanTargetId) {
      navigate(`/shop?collection=${cleanTargetId}`);
      return;
    }
    if (targetType === "occasion" && cleanTargetId) {
      navigate(`/shop?occasion=${cleanTargetId}`);
      return;
    }
    if (targetType === "flashSale" && cleanTargetId) {
      navigate(`/shop?flashSale=${cleanTargetId}`);
      return;
    }
    if (targetType === "shop" && cleanTargetId) {
      navigate(`/shop`);
      return;
    }
    if (targetType === "external" && targetUrl) {
      window.open(targetUrl, "_blank", "noopener,noreferrer");
      return;
    }
    if (targetUrl) {
      if (targetUrl.startsWith("http")) {
        window.open(targetUrl, "_blank", "noopener,noreferrer");
      } else {
        navigate(targetUrl);
      }
      return;
    }

    navigate("/shop");
  };

  const hasImage = Boolean(activeBanner.image);

  return (
    <section className={`w-full px-4 py-4 sm:px-6 lg:px-8 font-sans ${className}`}>
      <div className="mx-auto max-w-7xl">
        <div
          onClick={handleBannerClick}
          className="
            group
            relative
            overflow-hidden
            rounded-[24px]
            sm:rounded-[28px]
            bg-white
            dark:bg-slate-900
            border
            border-slate-200/90
            dark:border-slate-800
            shadow-[0_10px_35px_rgba(15,23,42,0.06)]
            hover:shadow-[0_16px_45px_rgba(37,99,235,0.12)]
            hover:border-blue-200
            dark:hover:border-blue-900
            transition-all
            duration-300
            cursor-pointer
          "
        >
          {/* Subtle Ambient Blue Lighting (No Pink/Purple) */}
          <div
            className="
              pointer-events-none
              absolute
              -left-20
              -top-20
              h-64
              w-64
              rounded-full
              bg-blue-400/10
              blur-[80px]
            "
          />
          <div
            className="
              pointer-events-none
              absolute
              -bottom-20
              right-1/3
              h-56
              w-56
              rounded-full
              bg-sky-400/10
              blur-[80px]
            "
          />

          <div className="relative flex min-h-[250px] flex-col md:min-h-[280px] md:flex-row">
            {/* =========================================
                LEFT CONTENT
            ========================================== */}
            <div className="relative z-10 flex flex-1 flex-col justify-center px-6 py-7 sm:px-9 sm:py-9 md:px-12">
              {/* Badges Row */}
              <div className="mb-3.5 flex flex-wrap items-center gap-2.5">
                <span
                  className="
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-full
                    bg-blue-50
                    dark:bg-blue-950/40
                    border
                    border-blue-200/80
                    dark:border-blue-800/60
                    px-3
                    py-1
                    text-[10px]
                    sm:text-[11px]
                    font-extrabold
                    uppercase
                    tracking-wider
                    text-blue-700
                    dark:text-blue-300
                  "
                >
                  <Sparkles size={11} className="text-blue-600 dark:text-blue-400" />
                  {activeBanner.subtitle}
                </span>

                {isAuthenticated ? (
                  <span
                    className="
                      inline-flex
                      items-center
                      gap-1.5
                      rounded-full
                      border
                      border-emerald-200/80
                      bg-emerald-50
                      dark:bg-emerald-950/30
                      px-3
                      py-1
                      text-[11px]
                      font-bold
                      text-emerald-700
                      dark:text-emerald-300
                    "
                  >
                    <CheckCircle2 size={12} className="text-emerald-600" />
                    <span>Member privilege active{user?.name ? ` • ${user.name}` : ""}</span>
                  </span>
                ) : (
                  <span
                    className="
                      inline-flex
                      items-center
                      gap-1.5
                      rounded-full
                      bg-slate-100
                      dark:bg-slate-800
                      px-3
                      py-1
                      text-[11px]
                      font-semibold
                      text-slate-600
                      dark:text-slate-300
                      border
                      border-slate-200/70
                      dark:border-slate-700
                    "
                  >
                    <ShieldCheck size={12} className="text-blue-600 dark:text-blue-400" />
                    <span>Verified Brand Collection</span>
                  </span>
                )}
              </div>

              {/* Title */}
              <h2
                className="
                  max-w-xl
                  text-2xl
                  font-black
                  leading-snug
                  tracking-tight
                  text-slate-900
                  dark:text-white
                  sm:text-3xl
                  lg:text-[32px]
                "
              >
                {activeBanner.title}
              </h2>

              {/* Refined Blue Accent Bar */}
              <div className="mt-2.5 h-1 w-12 rounded-full bg-blue-600" />

              {/* Description */}
              {activeBanner.description && (
                <p
                  className="
                    mt-2.5
                    max-w-lg
                    text-xs
                    font-normal
                    leading-relaxed
                    text-slate-600
                    dark:text-slate-300
                    sm:text-sm
                  "
                >
                  {activeBanner.description}
                </p>
              )}

              {/* =========================================
                  ACTIONS ROW
              ========================================== */}
              <div className="mt-5 sm:mt-6 flex flex-wrap items-center gap-3">
                {/* Primary CTA */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBannerClick();
                  }}
                  className="
                    group/btn
                    inline-flex
                    items-center
                    gap-2
                    rounded-xl
                    bg-blue-600
                    hover:bg-blue-700
                    px-5
                    py-2.5
                    text-xs
                    font-extrabold
                    text-white
                    shadow-sm
                    hover:shadow-md
                    transition-all
                    duration-200
                    hover:-translate-y-0.5
                    active:scale-95
                    sm:py-3
                    sm:px-6
                    sm:text-sm
                  "
                >
                  <span>{activeBanner.buttonText}</span>
                  <ArrowRight
                    size={14}
                    className="transition-transform duration-200 group-hover/btn:translate-x-1"
                  />
                </button>

                {/* Coupon Code Pill */}
                <button
                  type="button"
                  onClick={handleCopyCoupon}
                  className="
                    group/coupon
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-xl
                    border
                    border-slate-200
                    dark:border-slate-700
                    bg-white
                    dark:bg-slate-800
                    px-3.5
                    py-2.5
                    text-xs
                    font-mono
                    font-bold
                    text-slate-800
                    dark:text-slate-100
                    shadow-sm
                    transition-all
                    duration-200
                    hover:-translate-y-0.5
                    hover:border-blue-300
                    hover:bg-blue-50/50
                    dark:hover:bg-slate-750
                    sm:py-3
                  "
                  title="Click to copy promo code"
                >
                  <Tag size={13} className="text-blue-600" />
                  <span className="tracking-wide">{activeBanner.couponCode}</span>
                  {copiedCode ? (
                    <Check size={13} className="text-emerald-500" />
                  ) : (
                    <Copy
                      size={12}
                      className="text-slate-400 transition-colors group-hover/coupon:text-blue-600"
                    />
                  )}
                </button>

                {/* Sign-in nudge if guest */}
                {!isAuthenticated && (
                  <Link
                    to="/login"
                    onClick={(e) => e.stopPropagation()}
                    className="
                      inline-flex
                      items-center
                      gap-1.5
                      rounded-lg
                      px-2
                      py-1
                      text-xs
                      font-bold
                      text-blue-600
                      dark:text-blue-400
                      hover:underline
                    "
                  >
                    <User size={13} />
                    <span>Sign in for member perks</span>
                  </Link>
                )}
              </div>
            </div>

            {/* =========================================
                RIGHT IMAGE SHOWCASE
            ========================================== */}
            {hasImage && (
              <div
                className="
                  relative
                  min-h-[190px]
                  w-full
                  overflow-hidden
                  md:min-h-full
                  md:w-[42%]
                  lg:w-[40%]
                  bg-slate-100
                  dark:bg-slate-800
                "
              >
                <img
                  src={activeBanner.image}
                  alt={activeBanner.title || "Promotional Banner"}
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
                    group-hover:scale-[1.04]
                  "
                />

                {/* Soft gradient fade for seamless integration */}
                <div
                  className="
                    pointer-events-none
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-white/80
                    dark:from-slate-900/80
                    via-transparent
                    to-transparent
                    md:bg-gradient-to-r
                    md:from-white/95
                    md:dark:from-slate-900/95
                    md:via-white/10
                    md:to-transparent
                  "
                />

                {/* Verified badge pill */}
                <div
                  className="
                    absolute
                    bottom-4
                    right-4
                    hidden
                    rounded-full
                    border
                    border-white/80
                    bg-white/85
                    dark:bg-slate-900/85
                    dark:border-slate-700
                    px-3
                    py-1.5
                    text-[10px]
                    font-bold
                    text-slate-700
                    dark:text-slate-200
                    shadow-sm
                    backdrop-blur-md
                    sm:flex
                    sm:items-center
                    sm:gap-1.5
                  "
                >
                  <ShieldCheck size={12} className="text-blue-600" />
                  <span>Curated Promotion</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
