import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Flame,
  Clock,
} from "lucide-react";
import { getallProducts } from "../../../api/productService";
import { ProductGridSkeleton } from "../../../Components/Skeletons";
import ProductCard from "../../../Components/ProductCard";

export default function NewArrivalsSection() {
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchNewArrivals = async () => {
      try {
        setLoading(true);
        // Request database sorted by newest/recent creation
        const res = await getallProducts({
          sortBy: "Newest",
          sort: "newest",
          limit: 20,
        });

        const list = Array.isArray(res)
          ? res
          : res?.products || res?.data || [];

        if (list.length > 0 && isMounted) {
          // Strictly sort by creation timestamp (recently added in db)
          // Fallback to ObjectId embedded timestamp if createdAt is absent
          const sortedList = [...list].sort((a, b) => {
            const timeA = a.createdAt
              ? new Date(a.createdAt).getTime()
              : a._id && typeof a._id === "string" && a._id.length === 24
                ? parseInt(a._id.substring(0, 8), 16) * 1000
                : 0;
            const timeB = b.createdAt
              ? new Date(b.createdAt).getTime()
              : b._id && typeof b._id === "string" && b._id.length === 24
                ? parseInt(b._id.substring(0, 8), 16) * 1000
                : 0;
            return timeB - timeA;
          });

          setNewArrivals(
            sortedList.map((p, idx) => ({
              ...p,
              _id: p._id || `na_${idx}`,
              id: p._id || `na_${idx}`,
              name: p.name || "Untitled New Arrival",
              category:
                typeof p.category === "object"
                  ? p.category?.name
                  : p.category || "General",
              price: Number(p.price) || 0,
              originalPrice:
                Number(p.originalPrice) ||
                Number(p.compareAtPrice) ||
                Math.round((Number(p.price) || 0) * 1.25),
              rating: p.rating || 4.8,
              reviews: p.numReviews || p.reviews?.length || 24,
              image:
                p.images?.[0]?.url ||
                p.images?.[0] ||
                p.image ||
                "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80",
              inStock: (() => {
                const s =
                  p.inventory?.stockQuantity !== undefined
                    ? Number(p.inventory.stockQuantity)
                    : p.stockQuantity !== undefined
                      ? Number(p.stockQuantity)
                      : p.stock !== undefined
                        ? Number(p.stock)
                        : p.countInStock !== undefined
                          ? Number(p.countInStock)
                          : 1;
                return s > 0;
              })(),
              createdAt: p.createdAt || null,
              badge: p.badge || "NEW ARRIVAL",
            })),
          );
        } else if (isMounted) {
          setNewArrivals([]);
        }
      } catch (err) {
        console.error("Failed to load new arrivals:", err);
        if (isMounted) setNewArrivals([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchNewArrivals();

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
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [newArrivals]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const offset = direction === "left" ? -380 : 380;
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
      setTimeout(checkScroll, 350);
    }
  };

  if (!loading && newArrivals.length === 0) {
    return null;
  }

  return (
    <section className="py-5 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/70 dark:border-slate-800/80 pb-3">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Recently Added
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium hidden sm:inline">
              Sorted by latest entry
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-1 flex items-center gap-2">
            New Arrivals
            <Sparkles size={18} className="text-amber-500" />
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Explore products fresh off the shelves, sorted in real-time by creation date.
          </p>
        </div>

        {/* Action Buttons & Navigation Arrows */}
        <div className="flex items-center gap-2.5 self-end sm:self-center">
          {newArrivals.length > 4 && (
            <div className="hidden sm:flex items-center gap-1.5 mr-1">
              <button
                type="button"
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                aria-label="Scroll left"
                className={`p-2 rounded-full border transition-all duration-200 ${
                  canScrollLeft
                    ? "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800 shadow-xs cursor-pointer"
                    : "opacity-30 cursor-not-allowed bg-slate-50 dark:bg-slate-950 text-slate-400 border-slate-200/50"
                }`}
              >
                <ChevronLeft size={16} />
              </button>

              <button
                type="button"
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                aria-label="Scroll right"
                className={`p-2 rounded-full border transition-all duration-200 ${
                  canScrollRight
                    ? "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800 shadow-xs cursor-pointer"
                    : "opacity-30 cursor-not-allowed bg-slate-50 dark:bg-slate-950 text-slate-400 border-slate-200/50"
                }`}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}

          <Link
            to="/shop?sort=Newest"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50/80 hover:bg-blue-100 border border-blue-100/80 transition-all duration-200 shadow-2xs group shrink-0"
          >
            <span>See All ({newArrivals.length})</span>
            <ArrowRight
              size={13}
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </div>

      {loading ? (
        <ProductGridSkeleton count={6} />
      ) : (
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {newArrivals.map((prod) => (
            <ProductCard
              key={prod._id || prod.id}
              product={{
                ...prod,
                badge: prod.badge || "NEW",
              }}
              isCarousel={true}
            />
          ))}
        </div>
      )}
    </section>
  );
}
