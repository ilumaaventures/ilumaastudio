import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useStore } from "../../pages/Store/StoreLayout";
import baseApi from "../../api/baseApi";

export default function Hero() {
  const { business, products } = useStore();
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    const fetchSlides = async () => {
      if (!business?._id) return;
      try {
        const res = await baseApi.get(`/marketing/public/slides/${business._id}`);
        if (res.data && res.data.length > 0) {
          setSlides(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch slides for business:", err);
      }
    };
    fetchSlides();
  }, [business?._id]);

  // Featured Products
  const featuredProducts = useMemo(() => {
    if (!products?.length) return [];

    const featured = products.filter((p) => p.isFeatured);

    return featured.length ? featured : products.slice(0, 4);
  }, [products]);

  // Hero Product
  const heroProduct = featuredProducts[0];

  // Image helper
  const productImage =
    heroProduct?.featuredImage?.url ||
    heroProduct?.featuredImage ||
    heroProduct?.thumbnail?.url ||
    heroProduct?.thumbnail ||
    heroProduct?.images?.[0]?.url ||
    heroProduct?.images?.[0] ||
    "/placeholder-product.png";

  const activeSlide = slides[0];
  const displayTitle = activeSlide?.title || business?.businessName;
  const displayDesc = activeSlide?.subtitle || business?.description || "Explore carefully curated products, unbeatable prices, secure checkout and premium shopping experience.";
  const displayBgImage = activeSlide?.bgImage || business?.coverImage || business?.banner;
  const displayImage = activeSlide?.bgImage || productImage;
  const ctaLabel = activeSlide?.ctaLabel || "Shop Now";
  const ctaLink = activeSlide?.ctaLink || `/${encodeURIComponent(business?.businessName)}/products`;

  return (
    <section className="relative overflow-hidden min-h-[560px] flex items-center bg-slate-950">
      {/* Background */}
      {displayBgImage ? (
        <>
          <img
            src={displayBgImage}
            alt={business?.businessName}
            className="absolute inset-0 w-full h-full object-cover opacity-20"
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
          {/* LEFT */}
          <div>
            <span className="inline-flex px-4 py-2 rounded-full bg-indigo-500/20 text-indigo-300 text-sm font-medium">
              ✨ Premium Collection
            </span>

            <h1 className="mt-6 text-5xl md:text-6xl font-black leading-tight text-white">
              Discover
              <span className="block bg-gradient-to-r from-indigo-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                {displayTitle}
              </span>
            </h1>

            <p className="mt-6 text-lg text-slate-300 leading-8 max-w-xl">
              {displayDesc}
            </p>

            <div className="flex flex-wrap gap-4 mt-10">
              <Link
                to={ctaLink.startsWith("http") ? ctaLink : ctaLink}
                className="group flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-7 py-4 rounded-xl font-semibold text-white transition"
              >
                {ctaLabel}
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition"
                />
              </Link>

              <Link
                to={`/${encodeURIComponent(business?.businessName)}/about`}
                className="px-7 py-4 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white transition"
              >
                About Store
              </Link>
            </div>
          </div>

          {/* RIGHT */}
          <div className="hidden lg:flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500/30 blur-3xl rounded-[40px]" />

              <div className="relative w-[420px] rounded-[32px] border border-white/10 bg-white/10 backdrop-blur-xl p-6 shadow-2xl">
                {displayImage ? (
                  <>
                    <div className="flex items-center justify-center">
                      <img
                        src={displayImage}
                        alt={displayTitle}
                        className="max-h-full max-w-full object-contain drop-shadow-2xl hover:scale-105 transition duration-500"
                      />
                    </div>
                  </>
                ) : (
                  <div className="h-[420px] flex items-center justify-center text-slate-400">
                    No Featured Product Available
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
