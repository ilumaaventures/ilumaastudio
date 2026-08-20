import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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

        if (isMounted) {
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
        }
      } catch (err) {
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
  }, [bannerType, initialTitle, initialDescription, initialImageUrl, initialLinkUrl]);

  // Auto-carousel timer (Every 4 seconds)
  useEffect(() => {
    if (banners.length <= 1) return;

    const timer = setInterval(() => {
      setDirection("right");
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [banners.length, autoPlayInterval]);

  if (banners.length === 0) return null;

  const currentBanner = banners[currentIndex];

  const handleNext = () => {
    setDirection("right");
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const handlePrev = () => {
    setDirection("left");
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

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

  const hasImage = Boolean(currentBanner.image || currentBanner.mobileImage);

  return (
    <section className="py-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="relative rounded-2xl md:rounded-3xl bg-[#262626] text-white p-5 sm:p-7 overflow-hidden shadow-lg border border-slate-800 transition-all">
        
        {/* Banner Content Container with Animation */}
        <div
          key={currentBanner._id || currentIndex}
          className={`flex flex-col md:flex-row items-center justify-between gap-4 transition-all duration-500 transform ${
            direction === "right" ? "animate-fadeInRight" : "animate-fadeInLeft"
          }`}
        >
          {/* Left Side Text Content */}
          <div className="space-y-2 z-10 text-center md:text-left max-w-2xl">
            {currentBanner.subtitle && (
              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2.5 py-0.5 rounded-full">
                <Sparkles size={11} /> {currentBanner.subtitle}
              </span>
            )}
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight leading-tight">
              {currentBanner.title}
            </h2>
            {currentBanner.description && (
              <p className="text-xs sm:text-sm text-slate-300 line-clamp-2">
                {currentBanner.description}
              </p>
            )}
          </div>

          {/* Right Side: Optional Thumbnail + CTA Button */}
          <div className="flex items-center gap-4 z-10 shrink-0">
            {/* Optional Thumbnail Image */}
            {hasImage && (
              <img
                src={currentBanner.image || currentBanner.mobileImage}
                alt={currentBanner.title}
                className="w-24 h-16 sm:w-32 sm:h-20 object-cover rounded-xl shadow-md border border-white/20"
              />
            )}

            {/* CTA Button */}
            <button
              type="button"
              onClick={() => handleBannerClick(currentBanner)}
              className="bg-amber-400 hover:bg-amber-500 text-amber-950 px-5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <span>{currentBanner.buttonText || "Shop Now"}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Carousel Navigation Controls (If multiple banners exist) */}
        {banners.length > 1 && (
          <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/10 z-10 relative">
            {/* Pagination Dots */}
            <div className="flex items-center gap-1.5">
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    idx === currentIndex ? "w-6 bg-amber-400" : "w-1.5 bg-white/30 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>

            {/* Prev/Next Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrev}
                className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                title="Previous Banner"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={handleNext}
                className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
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

export default MegaSaleBanner;
