import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { getPublicBanners } from "../../../api/bannerService";

function MegaSaleBanner({
  title: initialTitle,
  description: initialDescription,
  imageUrl: initialImageUrl,
  linkUrl: initialLinkUrl,
  bannerType = "promotion",
  autoPlayInterval = 4000,
}) {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState("right");

  const navigate = useNavigate();

  /* =========================================================
     LOAD PUBLIC BANNERS
  ========================================================= */

  useEffect(() => {
    let isMounted = true;

    const loadBanners = async () => {
      try {
        const res = await getPublicBanners({
          type: bannerType,
          businessCategory: "E-Commerce",
          listedOn: "superadmin",
        });

        const list = res?.banners || res?.data || [];

        if (!isMounted) return;

        if (list.length > 0) {
          setBanners(list);
        } else if (initialTitle) {
          setBanners([
            {
              _id: "default_1",
              title: initialTitle,
              subtitle: "SPECIAL OFFER",
              description: initialDescription,
              image: initialImageUrl || "",
              targetUrl: initialLinkUrl || "/shop",
              buttonText: "Shop Now",
            },
          ]);
        }
      } catch (error) {
        console.error("Failed to load promotional banners:", error);

        if (isMounted && initialTitle) {
          setBanners([
            {
              _id: "default_1",
              title: initialTitle,
              subtitle: "SPECIAL OFFER",
              description: initialDescription,
              image: initialImageUrl || "",
              targetUrl: initialLinkUrl || "/shop",
              buttonText: "Shop Now",
            },
          ]);
        }
      }
    };

    loadBanners();

    return () => {
      isMounted = false;
    };
  }, [
    bannerType,
    initialTitle,
    initialDescription,
    initialImageUrl,
    initialLinkUrl,
  ]);

  /* =========================================================
     AUTO PLAY
  ========================================================= */

  useEffect(() => {
    if (banners.length <= 1) return;

    const timer = setInterval(() => {
      setDirection("right");

      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [banners.length, autoPlayInterval]);

  /* =========================================================
     EMPTY STATE
  ========================================================= */

  if (banners.length === 0) {
    return null;
  }

  const currentBanner = banners[currentIndex];

  /* =========================================================
     NEXT / PREVIOUS
  ========================================================= */

  const handleNext = () => {
    setDirection("right");

    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const handlePrev = () => {
    setDirection("left");

    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  /* =========================================================
     BANNER NAVIGATION
  ========================================================= */

  const handleBannerClick = (banner) => {
    const targetType = banner.targetType || "shop";

    const targetId =
      typeof banner.targetId === "object"
        ? banner.targetId?._id
        : banner.targetId;

    // Product
    if (targetType === "product" && targetId) {
      navigate(`/product/${targetId}`);
      return;
    }

    // Category
    if (targetType === "category" && targetId) {
      navigate(`/shop?category=${targetId}`);
      return;
    }

    // Collection
    if (targetType === "collection" && targetId) {
      navigate(`/shop?collection=${targetId}`);
      return;
    }

    // Occasion
    if (targetType === "occasion" && targetId) {
      navigate(`/shop?occasion=${targetId}`);
      return;
    }

    // Flash Sale
    if (targetType === "flashSale" && targetId) {
      navigate(`/shop?flashSale=${targetId}`);
      return;
    }

    // External URL
    if (targetType === "external" && banner.targetUrl) {
      window.open(banner.targetUrl, "_blank", "noopener,noreferrer");
      return;
    }

    // Normal URL
    if (banner.targetUrl) {
      if (banner.targetUrl.startsWith("http")) {
        window.open(banner.targetUrl, "_blank", "noopener,noreferrer");
      } else {
        navigate(banner.targetUrl);
      }

      return;
    }

    // Default
    navigate("/shop");
  };

  const hasImage = Boolean(currentBanner.image || currentBanner.mobileImage);

  return (
    <section className="w-full px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* =====================================================
            MAIN BANNER
        ====================================================== */}

        <div
          className="
            group
            relative
            overflow-hidden
            rounded-[26px]
            bg-[#F7F9FB]
            shadow-[0_18px_55px_rgba(35,55,70,0.10)]
            sm:rounded-[32px]
          "
        >
          {/* =================================================
              SOFT BLUE DECORATIVE GLOWS
          ================================================== */}

          <div
            className="
              pointer-events-none
              absolute
              -left-24
              -top-32
              h-72
              w-72
              rounded-full
              bg-[#A9C8D9]/20
              blur-[90px]
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              -bottom-32
              right-10
              h-72
              w-72
              rounded-full
              bg-[#7EA9C0]/10
              blur-[90px]
            "
          />

          {/* =================================================
              SLIDE CONTENT
          ================================================== */}

          <div
            key={currentBanner._id || currentIndex}
            className={`
              relative
              flex
              min-h-[270px]
              flex-col
              md:min-h-[300px]
              md:flex-row
              ${
                direction === "right"
                  ? "animate-fadeInRight"
                  : "animate-fadeInLeft"
              }
            `}
          >
            {/* =================================================
                LEFT CONTENT
            ================================================== */}

            <div
              className="
                relative
                z-10
                flex
                flex-1
                flex-col
                justify-center
                px-6
                py-8
                sm:px-9
                sm:py-10
                md:px-10
                lg:px-14
              "
            >
              {/* ---------------------------------------------
                  BADGE
              ---------------------------------------------- */}

              {currentBanner.subtitle && (
                <div className="mb-4">
                  <span
                    className="
                      inline-flex
                      items-center
                      gap-2
                      rounded-full
                      border
                      border-[#D7E3EA]
                      bg-white/80
                      px-3
                      py-1.5
                      text-[9px]
                      font-semibold
                      uppercase
                      tracking-[0.2em]
                      text-[#496579]
                      backdrop-blur-sm
                    "
                  >
                    <Sparkles
                      size={11}
                      strokeWidth={1.6}
                      className="text-[#3B6B87]"
                    />

                    {currentBanner.subtitle}
                  </span>
                </div>
              )}

              {/* ---------------------------------------------
                  TITLE
              ---------------------------------------------- */}

              <h2
                className="
                  max-w-xl
                  font-serif
                  text-[29px]
                  font-medium
                  leading-[1.08]
                  tracking-[-0.02em]
                  text-[#182B38]
                  sm:text-[36px]
                  lg:text-[42px]
                "
              >
                {currentBanner.title}
              </h2>

              {/* ---------------------------------------------
                  DESCRIPTION
              ---------------------------------------------- */}

              {currentBanner.description && (
                <p
                  className="
                    mt-3
                    max-w-lg
                    text-[12px]
                    leading-6
                    text-[#53616B]
                    sm:text-[13px]
                  "
                >
                  {currentBanner.description}
                </p>
              )}

              {/* ---------------------------------------------
                  CTA
              ---------------------------------------------- */}

              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => handleBannerClick(currentBanner)}
                  className="
                    group/btn
                    inline-flex
                    items-center
                    gap-3
                    rounded-full
                    bg-[#182B38]
                    px-5
                    py-3
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.16em]
                    text-white
                    shadow-[0_8px_22px_rgba(24,43,56,0.15)]
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:bg-[#3B6B87]
                    hover:shadow-[0_12px_28px_rgba(24,43,56,0.18)]
                  "
                >
                  <span>{currentBanner.buttonText || "Shop Now"}</span>

                  <ArrowRight
                    size={14}
                    strokeWidth={1.7}
                    className="
                      transition-transform
                      duration-300
                      group-hover/btn:translate-x-1
                    "
                  />
                </button>
              </div>
            </div>

            {/* =================================================
                RIGHT IMAGE
            ================================================== */}

            {hasImage && (
              <div
                className="
                  relative
                  min-h-[190px]
                  w-full
                  overflow-hidden
                  md:min-h-full
                  md:w-[43%]
                "
              >
                <img
                  src={currentBanner.image || currentBanner.mobileImage}
                  alt={currentBanner.title || "Promotional banner"}
                  loading="lazy"
                  decoding="async"
                  className="
                    absolute
                    inset-0
                    h-full
                    w-full
                    object-cover
                    transition-transform
                    duration-[1200ms]
                    ease-out
                    group-hover:scale-[1.035]
                  "
                />

                {/* Image gradient */}

                <div
                  className="
                    absolute
                    inset-0
                    bg-gradient-to-r
                    from-[#F7F9FB]
                    via-[#F7F9FB]/30
                    to-transparent
                    md:from-[#F7F9FB]
                    md:via-[#F7F9FB]/10
                    md:to-transparent
                  "
                />

                {/* Bottom image gradient */}

                <div
                  className="
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-black/20
                    via-transparent
                    to-transparent
                  "
                />

                {/* Image badge */}

                <div
                  className="
                    absolute
                    right-5
                    top-5
                    sm:right-7
                    sm:top-7
                  "
                >
                  <span
                    className="
                      inline-flex
                      items-center
                      rounded-full
                      border
                      border-white/30
                      bg-black/15
                      px-3
                      py-1.5
                      text-[8px]
                      font-semibold
                      uppercase
                      tracking-[0.18em]
                      text-white
                      backdrop-blur-md
                    "
                  >
                    Limited Offer
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* =================================================
              CAROUSEL CONTROLS
          ================================================== */}

          {banners.length > 1 && (
            <div
              className="
                relative
                z-20
                flex
                items-center
                justify-between
                border-t
                border-[#DCE6EC]
                bg-white/30
                px-5
                py-3
                backdrop-blur-sm
                sm:px-8
              "
            >
              {/* ---------------------------------------------
                  PAGINATION
              ---------------------------------------------- */}

              <div className="flex items-center gap-1.5">
                {banners.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    aria-label={`Go to banner ${index + 1}`}
                    onClick={() => {
                      setDirection(index > currentIndex ? "right" : "left");

                      setCurrentIndex(index);
                    }}
                    className={`
                      h-1
                      rounded-full
                      transition-all
                      duration-300
                      ${
                        index === currentIndex
                          ? "w-8 bg-[#3B6B87]"
                          : "w-1.5 bg-[#B8C7D0] hover:bg-[#7893A3]"
                      }
                    `}
                  />
                ))}
              </div>

              {/* ---------------------------------------------
                  PREV / NEXT
              ---------------------------------------------- */}

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Previous banner"
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[#D8E2E8]
                    bg-white/80
                    text-[#53616B]
                    transition-all
                    duration-200
                    hover:bg-[#182B38]
                    hover:text-white
                  "
                >
                  <ChevronLeft size={14} />
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next banner"
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[#D8E2E8]
                    bg-white/80
                    text-[#53616B]
                    transition-all
                    duration-200
                    hover:bg-[#182B38]
                    hover:text-white
                  "
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default MegaSaleBanner;
