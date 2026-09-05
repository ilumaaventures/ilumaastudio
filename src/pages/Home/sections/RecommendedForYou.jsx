import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { getProducts } from "../../../api/productService";
import { ProductGridSkeleton } from "../../../Components/Skeletons";
import ProductCard from "../../../Components/ProductCard";

function RecommendedForYou() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        setLoading(true);
        const res = await getProducts({ limit: 12, isFeatured: true });
        const list = Array.isArray(res)
          ? res
          : res?.products || res?.data || [];

        if (list.length > 0) {
          const formatted = list.map((p, idx) => ({
            ...p,
            _id: p._id || `rec_${idx}`,
            name: p.name || "Recommended Product",
            category:
              typeof p.category === "object"
                ? p.category?.name || p.category?.title || "General"
                : p.category || "General",
            price: Number(p.price) || 299,
            originalPrice:
              Number(p.originalPrice) ||
              Math.round((Number(p.price) || 299) * 1.3),
            rating: Number(p.rating) || 4.8,
            image:
              p.images?.[0]?.url ||
              p.image ||
              "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80",
          }));
          setItems(formatted);
        } else {
          setItems([]);
        }
      } catch (err) {
        console.error("Recommended products fetch notice:", err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRecommended();
  }, []);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -320 : 320,
        behavior: "smooth",
      });
    }
  };

  if (!loading && items.length === 0) {
    return null;
  }

  return (
    <section className="py-3 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-4">
      {/* Professional Section Header */}
      <div className="flex items-end justify-between gap-4 border-b border-slate-200/80 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Recommended For You
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Handpicked festival picks, trending crafts, and top selections
            tailored for your taste.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50/80 hover:bg-blue-100 border border-blue-100/80 transition-all duration-200 shadow-2xs group shrink-0"
          >
            <span>See All</span>
            <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>

      {loading ? (
        <ProductGridSkeleton count={4} />
      ) : (
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-none py-2 px-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {items.map((prod) => (
            <ProductCard
              key={prod._id || prod.id}
              product={prod}
              isCarousel={true}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default RecommendedForYou;
