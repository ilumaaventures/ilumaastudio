import React, { useState, useEffect, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Truck,
  Star,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getPublicBanners } from "../../../api/bannerService";
import baseApi from "../../../api/baseApi";

// ============================================================
// FALLBACK HERO SLIDES
// ============================================================

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
      "https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=1800&q=85",
    mobileImage:
      "https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=1000&q=85",
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
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1800&q=85",
    mobileImage:
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1000&q=85",
  },
  {
    _id: "default-slide-3",
    badge: "FLASH PRIVILEGE",
    title: "Premium Audio & Electronics",
    subtitle:
      "Immersive acoustic sound, minimalist engineering, and official warranty on flagship models.",
    buttonText: "VIEW DEALS",
    targetType: "shop",
    targetUrl: "/shop",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1800&q=85",
    mobileImage:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=85",
  },
];

// ============================================================
// COLORFUL TITLE HELPER
// ============================================================

function renderColorfulStudioTitle(title) {
  if (!title) return null;
  if (title.includes("&")) {
    const parts = title.split("&");
    return (
      <>
        <span>{parts[0]}&</span>{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#60A5FA] via-[#C084FC] to-[#F472B6] drop-shadow-[0_4px_25px_rgba(192,132,252,0.4)]">
          {parts.slice(1).join("&")}
        </span>
      </>
    );
  }
  if (title.includes(",")) {
    const parts = title.split(",");
    return (
      <>
        <span>{parts[0]},</span>{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#60A5FA] via-[#C084FC] to-[#F472B6] drop-shadow-[0_4px_25px_rgba(192,132,252,0.4)]">
          {parts.slice(1).join(",")}
        </span>
      </>
    );
  }
  const words = title.split(" ");
  if (words.length > 2) {
    const splitIndex = Math.ceil(words.length / 2);
    const firstHalf = words.slice(0, splitIndex).join(" ");
    const secondHalf = words.slice(splitIndex).join(" ");
    return (
      <>
        <span>{firstHalf}</span>{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#60A5FA] via-[#C084FC] to-[#F472B6] drop-shadow-[0_4px_25px_rgba(192,132,252,0.4)]">
          {secondHalf}
        </span>
      </>
    );
  }
  return (
    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#93C5FD] to-[#C084FC]">
      {title}
    </span>
  );
}

export default function HeroBanner() {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // ============================================================
  // FETCH HERO SLIDES
  // ============================================================

  const fetchHeroSlides = useCallback(async () => {
    try {
      setLoading(true);

      // --------------------------------------------------------
      // 1. PUBLIC BANNER API
      // --------------------------------------------------------

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
          badge: b.badge || "",
          subtitle: b.subtitle || b.description || "",
          buttonText: b.buttonText || "SHOP NOW",
          targetType: b.targetType,
          targetId: b.targetId,
          targetUrl: b.targetUrl,
          image: b.image,
          mobileImage: b.mobileImage || b.image,
        }));

        setSlides(formattedBanners);
        setCurrentSlide(0);
        return;
      }

      // --------------------------------------------------------
      // 2. MARKETING SLIDES FALLBACK
      // --------------------------------------------------------

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
          badge: slide.badge || slide.platform || "FEATURED",
          title: slide.title || slide.name || "",
          subtitle: slide.subtitle || slide.description || "",
          buttonText: slide.ctaLabel || slide.buttonText || "EXPLORE NOW",
          targetType: "shop",
          targetUrl: slide.ctaLink || slide.buttonLink || "/shop",
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

  // ============================================================
  // SLIDER CONTROLS
  // ============================================================

  const nextSlide = useCallback(() => {
    if (slides.length <= 1) return;

    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    if (slides.length <= 1) return;

    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, [slides.length]);

  // ============================================================
  // AUTO PLAY
  // ============================================================

  useEffect(() => {
    if (slides.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      nextSlide();
    }, 5500);

    return () => clearInterval(timer);
  }, [slides.length, isPaused, nextSlide]);

  // ============================================================
  // TOUCH SUPPORT
  // ============================================================

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

  // ============================================================
  // BANNER NAVIGATION
  // ============================================================

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

  // ============================================================
  // LOADING UI
  // ============================================================

  if (loading) {
    return (
      <section className="pt-3 sm:pt-4 pb-2 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div
          className="
            relative
            w-full
            h-[330px]
            sm:h-[390px]
            md:h-[430px]
            lg:h-[470px]
            rounded-[26px]
            overflow-hidden
            bg-slate-100
            animate-pulse
          "
        >
          <div className="absolute inset-0 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200" />

          <div className="absolute left-6 sm:left-10 lg:left-14 top-1/2 -translate-y-1/2 w-full max-w-xl space-y-5">
            <div className="h-7 w-36 bg-white/70 rounded-full" />

            <div className="space-y-3">
              <div className="h-10 sm:h-12 w-[80%] bg-white/70 rounded-xl" />
              <div className="h-10 sm:h-12 w-[60%] bg-white/70 rounded-xl" />
            </div>

            <div className="h-4 w-[65%] bg-white/60 rounded-md" />

            <div className="h-11 w-36 bg-white/70 rounded-xl" />
          </div>
        </div>
      </section>
    );
  }

  const activeSlide = slides[currentSlide] || DEFAULT_HERO_SLIDES[0];

  const progress =
    slides.length > 1 ? ((currentSlide + 1) / slides.length) * 100 : 100;

  return (
    <section className="pt-3 sm:pt-4 pb-2 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto font-sans">
      <div
        className="
          relative
          group
          overflow-hidden
          rounded-[26px]
          sm:rounded-[30px]
          lg:rounded-[34px]
          min-h-[420px]
          sm:min-h-[320px]
          md:min-h-[320px]
          lg:min-h-[370px]  
          shadow-[0_18px_60px_rgba(15,23,42,0.14)]
          border
          border-slate-200/70
          bg-slate-100
          cursor-pointer
          select-none
        "
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={() => handleBannerClick(activeSlide)}
      >
        {/* =====================================================
            FULL BLEED IMAGE
        ====================================================== */}

        <div className="absolute inset-0 overflow-hidden">
          <picture className="block w-full h-full">
            {activeSlide.mobileImage && (
              <source
                media="(max-width: 768px)"
                srcSet={activeSlide.mobileImage}
              />
            )}

            <img
              src={activeSlide.image || activeSlide.mobileImage}
              alt={activeSlide.title || "Hero Banner"}
              loading="eager"
              decoding="async"
              className="
                w-full
                h-full
                object-cover
                object-center
                scale-[1.02]
                transition-transform
                duration-[1800ms]
                ease-out
                group-hover:scale-[1.07]
              "
            />
          </picture>
        </div>

        {/* =====================================================
            PREMIUM IMAGE OVERLAY
        ====================================================== */}

        {/* Left readability gradient */}

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-r
            from-slate-950/85
            via-slate-900/45
            via-[55%]
            to-transparent
          "
        />

        {/* Bottom soft gradient */}

        <div
          className="
            absolute
            inset-x-0
            bottom-0
            h-1/2
            bg-gradient-to-t
            from-slate-950/55
            to-transparent
          "
        />

        {/* Light blue ambient layer */}

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-br
            from-blue-500/10
            via-transparent
            to-white/5
            pointer-events-none
          "
        />

        {/* =====================================================
            TOP HEADER OVERLAY
        ====================================================== */}

        <div
          className="
            absolute
            top-0
            left-0
            right-0
            z-20
            flex
            items-center
            justify-between
            px-5
            sm:px-8
            lg:px-10
            pt-5
            sm:pt-7
          "
        >
          {/* Premium campaign badge */}

          <div
            className="
              inline-flex
              items-center
              gap-2
              px-3
              sm:px-3.5
              py-1.5
              rounded-full
              bg-white/90
              backdrop-blur-xl
              border
              border-white/70
              shadow-[0_8px_25px_rgba(15,23,42,0.12)]
              text-[9px]
              sm:text-[10px]
              font-bold
              tracking-[0.13em]
              uppercase
              text-slate-800
            "
          >
            {activeSlide.badge || ""}
          </div>

          {/* Slide counter */}
        </div>

        {/* =====================================================
            MAIN CONTENT
        ====================================================== */}

        <div
          className="
            absolute
            inset-0
            z-10
            flex
            items-center
            justify-start
            px-5
            sm:px-8
            lg:px-12
            xl:px-16
          "
        >
          <div className="w-full max-w-[1440px] mx-auto flex items-center">
            <div className="max-w-[680px] text-white my-auto">
            {/* Small category label */}
            <div
              className="
                flex
                items-center
                gap-2.5
                mb-4
                text-[10px]
                sm:text-xs
                font-bold
                uppercase
                tracking-[0.2em]
              "
            >
              <span className="w-8 h-[2px] bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-purple-200 to-pink-300">
                Curated Collection
              </span>
            </div>

            {/* Heading (Colorful Gradient Highlights) */}
            {activeSlide.title && (
              <h1
                className="
                  text-[32px]
                  sm:text-[42px]
                  md:text-[50px]
                  lg:text-[60px]
                  xl:text-[66px]
                  leading-[0.98]
                  tracking-[-0.045em]
                  font-extrabold
                  max-w-[680px]
                  drop-shadow-[0_5px_20px_rgba(0,0,0,0.30)]
                "
              >
                {renderColorfulStudioTitle(activeSlide.title)}
              </h1>
            )}

            {/* Subtitle (Luminous Gradient) */}
            {activeSlide.subtitle && (
              <p
                className="
                  mt-5
                  max-w-[580px]
                  text-sm
                  sm:text-base
                  lg:text-[17px]
                  leading-7
                  text-transparent
                  bg-clip-text
                  bg-gradient-to-r
                  from-slate-100
                  via-blue-50
                  to-purple-100
                  font-medium
                  drop-shadow-[0_2px_10px_rgba(0,0,0,0.25)]
                "
              >
                {activeSlide.subtitle}
              </p>
            )}

            {/* CTA (Colorful Gradient Button) */}
            <div className="mt-7 flex items-center gap-4 flex-wrap">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleBannerClick(activeSlide);
                }}
                className="
                  group/cta
                  inline-flex
                  items-center
                  gap-3
                  px-6
                  sm:px-7
                  py-3.5
                  rounded-xl
                  bg-gradient-to-r
                  from-blue-600
                  via-indigo-600
                  to-purple-600
                  text-white
                  text-xs
                  sm:text-sm
                  font-bold
                  shadow-[0_10px_35px_rgba(79,70,229,0.35)]
                  hover:shadow-[0_15px_40px_rgba(79,70,229,0.55)]
                  hover:scale-[1.02]
                  transition-all
                  duration-300
                "
              >
                <span>{activeSlide.buttonText || "EXPLORE NOW"}</span>
                <ArrowRight
                  size={16}
                  className="
                    transition-transform
                    duration-300
                    group-hover/cta:translate-x-1
                  "
                />
              </button>

              {/* Secondary info */}

              <div
                className="
                  hidden
                  sm:flex
                  items-center
                  gap-2
                  text-xs
                  font-medium
                  text-white/75
                "
              >
                <ShieldCheck size={16} className="text-white" />
                Premium quality
              </div>
            </div>
          </div>
        </div>
      </div>

        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prevSlide();
              }}
              aria-label="Previous slide"
              className="
                absolute
                left-3
                sm:left-5
                top-1/2
                -translate-y-1/2
                z-40
                w-9
                h-9
                sm:w-11
                sm:h-11
                rounded-full
                bg-white/90
                backdrop-blur-xl
                border
                border-white
                text-slate-800
                flex
                items-center
                justify-center
                opacity-0
                group-hover:opacity-100
                -translate-x-2
                group-hover:translate-x-0
                transition-all
                duration-300
                shadow-xl
                hover:bg-blue-600
                hover:text-white
                hover:border-blue-600
                cursor-pointer
              "
            >
              <ChevronLeft size={19} />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                nextSlide();
              }}
              aria-label="Next slide"
              className="
                absolute
                right-3
                sm:right-5
                top-1/2
                -translate-y-1/2
                z-40
                w-9
                h-9
                sm:w-11
                sm:h-11
                rounded-full
                bg-white/90
                backdrop-blur-xl
                border
                border-white
                text-slate-800
                flex
                items-center
                justify-center
                opacity-0
                group-hover:opacity-100
                translate-x-2
                group-hover:translate-x-0
                transition-all
                duration-300
                shadow-xl
                hover:bg-blue-600
                hover:text-white
                hover:border-blue-600
                cursor-pointer
              "
            >
              <ChevronRight size={19} />
            </button>
          </>
        )}
      </div>
    </section>
  );
}
