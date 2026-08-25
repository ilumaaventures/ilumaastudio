import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { useStore } from "../../pages/Store/StoreContext";

export default function Hero() {
  const { business, products, storeHomePath, heroBanners, banners, slides } = useStore();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Collect all available hero slides & banners
  const allHeroSlides = useMemo(() => {
    const fromBanners = (heroBanners && heroBanners.length > 0)
      ? heroBanners
      : (banners || []).filter((b) => b.type === "hero");

    if (fromBanners.length > 0) {
      return fromBanners;
    }

    if (slides && slides.length > 0) {
      return slides;
    }

    // Default placeholder hero
    return [
      {
        title: business?.businessName || "Welcome to Our Store",
        subtitle: "✨ Premium Handcrafted & Curated Collection",
        description:
          business?.description ||
          "Explore carefully curated products, unbeatable prices, secure checkout and premium shopping experience.",
        image: business?.coverImage || business?.banner || "",
        buttonText: "Shop Catalog",
      },
    ];
  }, [heroBanners, banners, slides, business]);

  // Featured Products for fallback image
  const featuredProducts = useMemo(() => {
    if (!products?.length) return [];
    const featured = products.filter((p) => p.isFeatured);
    return featured.length ? featured : products.slice(0, 4);
  }, [products]);

  const heroProduct = featuredProducts[0];
  const fallbackProductImage =
    heroProduct?.featuredImage?.url ||
    heroProduct?.featuredImage ||
    heroProduct?.thumbnail?.url ||
    heroProduct?.thumbnail ||
    heroProduct?.images?.[0]?.url ||
    heroProduct?.images?.[0] ||
    "/placeholder-product.png";

  // Auto-carousel timer if multiple hero slides exist
  useEffect(() => {
    if (allHeroSlides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % allHeroSlides.length);
    }, 5500);

    return () => clearInterval(interval);
  }, [allHeroSlides.length]);

  const activeSlide = allHeroSlides[currentSlideIndex] || allHeroSlides[0];

  const displayTitle = activeSlide?.title || business?.businessName || "Welcome to Our Store";
  const displaySubtitle = activeSlide?.subtitle || "✨ Premium Curated Collection";
  const displayDesc =
    activeSlide?.description ||
    activeSlide?.subtitle ||
    business?.description ||
    "Explore carefully curated products, unbeatable prices, secure checkout and premium shopping experience.";

  const displayBgImage =
    activeSlide?.image ||
    activeSlide?.bgImage ||
    business?.coverImage ||
    business?.banner;

  const displayImage =
    activeSlide?.mobileImage ||
    activeSlide?.image ||
    activeSlide?.bgImage ||
    fallbackProductImage;

  const ctaLabel =
    activeSlide?.buttonText ||
    activeSlide?.ctaLabel ||
    "Shop Now";

  const basePath =
    storeHomePath ||
    `/${encodeURIComponent(business?.subdomain || business?.slug || business?.businessName || "")}`;

  const ctaLink =
    activeSlide?.targetUrl ||
    activeSlide?.ctaLink ||
    (activeSlide?.targetId
      ? `${basePath}/product/${activeSlide.targetId}`
      : `${basePath}/products`);

  const handleNext = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % allHeroSlides.length);
  };

  const handlePrev = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + allHeroSlides.length) % allHeroSlides.length);
  };

  return (
    <section className="relative overflow-hidden min-h-[560px] flex items-center bg-slate-950 text-white">
      {/* Background with Ambient Glow */}
      {displayBgImage ? (
        <>
          <img
            src={displayBgImage}
            alt={displayTitle}
            className="absolute inset-0 w-full h-full object-cover opacity-25 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-900/60" />
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-slate-950 to-slate-900" />
          <div className="absolute -top-32 -left-20 h-96 w-96 rounded-full bg-indigo-600/20 blur-[120px]" />
          <div className="absolute bottom-0 right-0 h-[450px] w-[450px] rounded-full bg-cyan-500/10 blur-[140px]" />
        </>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* LEFT CONTENT */}
          <div className="space-y-6">
            {displaySubtitle && (
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles size={13} className="text-cyan-400" />
                {displaySubtitle}
              </span>
            )}

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight text-white tracking-tight">
              <span className="block bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                {displayTitle}
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl font-medium">
              {displayDesc}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                to={ctaLink}
                className="group flex items-center gap-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 px-8 py-4 rounded-2xl font-bold text-white transition-all duration-300 shadow-xl shadow-indigo-600/25 hover:shadow-indigo-600/40 cursor-pointer"
              >
                <span>{ctaLabel}</span>
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition duration-200"
                />
              </Link>

              <Link
                to={`${basePath}/about`}
                className="px-7 py-4 rounded-2xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold transition duration-200 backdrop-blur-sm cursor-pointer"
              >
                About Store
              </Link>
            </div>
          </div>

          {/* RIGHT MEDIA CARD */}
          <div className="hidden lg:flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500/25 blur-3xl rounded-[40px]" />

              <div className="relative w-[440px] h-[440px] rounded-[36px] border border-white/15 bg-white/10 backdrop-blur-xl p-6 shadow-2xl flex items-center justify-center overflow-hidden">
                {displayImage ? (
                  <img
                    key={displayImage}
                    src={displayImage}
                    alt={displayTitle}
                    className="max-h-full max-w-full object-contain drop-shadow-2xl hover:scale-105 transition-all duration-500 animate-fadeIn"
                  />
                ) : (
                  <div className="text-slate-400 font-semibold text-sm">
                    No Featured Product Available
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* CAROUSEL CONTROLS IF MULTIPLE HERO BANNERS */}
        {allHeroSlides.length > 1 && (
          <div className="flex items-center justify-between pt-10 border-t border-white/10 mt-10">
            {/* Dots */}
            <div className="flex items-center gap-2">
              {allHeroSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlideIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === currentSlideIndex
                      ? "w-8 bg-indigo-400"
                      : "w-2 bg-white/30 hover:bg-white/60"
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Prev / Next Arrows */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                title="Previous Slide"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={handleNext}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                title="Next Slide"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
