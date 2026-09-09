import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Star,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Award,
  ShieldCheck,
  ThumbsUp,
} from "lucide-react";
import ProductCard from "../../../Components/ProductCard";
import { getProducts } from "../../../api/productService";

export default function TopRated() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadTopRated = async () => {
      try {
        setLoading(true);
        // Fetch real e-commerce products from backend
        const res = await getProducts({ productType: "E-Commerce", limit: 20 });
        const list = Array.isArray(res)
          ? res
          : res?.products || res?.data || [];

        if (isMounted) {
          // Filter to valid real products only (no mock placeholders)
          const validRealProducts = list.filter(
            (p) => p && p.name && (p._id || p.id)
          );

          // Sort real products by rating descending, or fallback to reviews/price
          validRealProducts.sort((a, b) => {
            const rB = Number(b.rating || b.ratings || 0);
            const rA = Number(a.rating || a.ratings || 0);
            if (rB !== rA) return rB - rA;
            const revB = Number(b.numReviews || b.reviewsCount || 0);
            const revA = Number(a.numReviews || a.reviewsCount || 0);
            return revB - revA;
          });

          setProducts(validRealProducts);
        }
      } catch (err) {
        console.error("Failed to fetch real top rated products:", err);
        if (isMounted) {
          setProducts([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadTopRated();
    return () => {
      isMounted = false;
    };
  }, []);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll, { passive: true });
      window.addEventListener("resize", checkScroll, { passive: true });
      return () => {
        el.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      };
    }
  }, [products]);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const offset = direction === "left" ? -340 : 340;
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  // If loading has completed and no real products exist, don't show the section
  if (!loading && products.length === 0) {
    return null;
  }

  return (
    <section className="py-6 sm:py-8 bg-gradient-to-b from-white via-amber-50/20 to-white border-y border-amber-100/60 relative overflow-hidden font-sans">
      {/* Subtle Golden Ambient Radiance */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-amber-100/30 rounded-full blur-3xl pointer-events-none translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
        {/* Header with Title and Scroll Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/70 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-200/80 shadow-2xs">
                <Star size={11} className="fill-amber-500 text-amber-500" />
                <span>Customer Favorites</span>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1.5">
              Top Rated Products
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Real verified merchant products acclaimed for exceptional quality and customer satisfaction.
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              onClick={() => handleScroll("left")}
              disabled={!canScrollLeft}
              aria-label="Scroll Left"
              className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all ${
                canScrollLeft
                  ? "border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs cursor-pointer active:scale-95"
                  : "border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed"
              }`}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => handleScroll("right")}
              disabled={!canScrollRight}
              aria-label="Scroll Right"
              className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all ${
                canScrollRight
                  ? "border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs cursor-pointer active:scale-95"
                  : "border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed"
              }`}
            >
              <ChevronRight size={18} />
            </button>

            <Link
              to="/products?sort=rating"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50/80 hover:bg-blue-100 border border-blue-100/80 transition-all duration-200 shadow-2xs group shrink-0 ml-1"
            >
              <span>See All</span>
              <ArrowRight
                size={13}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </div>

        {/* Shimmer Skeleton or Real Products Carousel */}
        {loading ? (
          <div className="flex gap-4 overflow-hidden py-2 px-1">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div
                key={idx}
                className="shrink-0 w-[210px] sm:w-[235px] md:w-[250px] bg-white border border-slate-200/90 rounded-2xl p-3 shadow-2xs space-y-3"
              >
                <div className="w-full aspect-[4/3] rounded-xl shimmer-placeholder" />
                <div className="h-3 w-1/3 rounded-md shimmer-placeholder" />
                <div className="h-4 w-3/4 rounded-md shimmer-placeholder" />
                <div className="h-3 w-1/2 rounded-md shimmer-placeholder" />
                <div className="flex items-center justify-between pt-2">
                  <div className="h-5 w-20 rounded-md shimmer-placeholder" />
                  <div className="h-8 w-24 rounded-xl shimmer-placeholder" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="relative">
            {canScrollLeft && (
              <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-r from-white via-white/80 to-transparent z-20 pointer-events-none transition-opacity duration-300" />
            )}
            {canScrollRight && (
              <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-l from-white via-white/80 to-transparent z-20 pointer-events-none transition-opacity duration-300" />
            )}

            <div
              ref={scrollRef}
              className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-none py-2 px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {products.map((prod) => (
                <ProductCard
                  key={prod._id || prod.id}
                  product={prod}
                  isCarousel={true}
                />
              ))}
            </div>
          </div>
        )}

        {/* Bottom Trust & Quality Proof Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-200/60 font-sans text-xs">
          <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <Award size={16} />
            </div>
            <div>
              <span className="font-bold text-slate-900 block">
                Strict Quality Audit
              </span>
              <span className="text-slate-500 text-[11px]">
                Verified real seller listings
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <ThumbsUp size={16} />
            </div>
            <div>
              <span className="font-bold text-slate-900 block">
                High Customer Ratings
              </span>
              <span className="text-slate-500 text-[11px]">
                Authentic community reviews
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <ShieldCheck size={16} />
            </div>
            <div>
              <span className="font-bold text-slate-900 block">
                Buyer Protection
              </span>
              <span className="text-slate-500 text-[11px]">
                Guaranteed safe & transparent orders
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
