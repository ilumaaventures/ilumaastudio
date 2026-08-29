import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Trophy, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { getProducts } from "../../../api/productService";
import { ProductGridSkeleton } from "../../../Components/Skeletons";
import ProductCard from "../../../Components/ProductCard";

export default function BestSellingProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        setLoading(true);
        const res = await getProducts({ limit: 12, isBestSeller: true });
        const list = Array.isArray(res)
          ? res
          : res?.products || res?.data || [];

        if (list.length > 0) {
          const formatted = list.map((p, idx) => ({
            ...p,
            _id: p._id || `bs_${idx}`,
            name: p.name || "Best Seller Product",
            category:
              typeof p.category === "object"
                ? p.category?.name || p.category?.title || "General"
                : p.category || "General",
            price: Number(p.price) || 499,
            originalPrice:
              Number(p.originalPrice) ||
              Math.round((Number(p.price) || 499) * 1.3),
            rating: Number(p.rating) || 4.8,
            badge: p.badge || "Best Seller",
            image:
              p.images?.[0]?.url ||
              p.image ||
              "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80",
          }));
          setProducts(formatted);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error("Failed to load best selling products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBestSellers();
  }, []);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -320 : 320,
        behavior: "smooth",
      });
    }
  };

  if (!loading && products.length === 0) {
    return null;
  }

  return (
    <section className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-4">
      {/* Header Bar */}
      <div className="flex items-end justify-between gap-4 border-b border-slate-200/80 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Trophy size={18} className="fill-amber-500" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Best Selling Products
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Most popular and top-rated items loved by customers across ILumaaStudio.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden sm:flex items-center gap-1.5 mr-2">
            <button
              onClick={() => handleScroll("left")}
              className="w-8 h-8 rounded-full border border-slate-200 bg-white text-slate-700 flex items-center justify-center hover:bg-[#2563eb] hover:text-white hover:border-[#2563eb] transition-all shadow-2xs cursor-pointer"
              title="Scroll Left"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => handleScroll("right")}
              className="w-8 h-8 rounded-full border border-slate-200 bg-white text-slate-700 flex items-center justify-center hover:bg-[#2563eb] hover:text-white hover:border-[#2563eb] transition-all shadow-2xs cursor-pointer"
              title="Scroll Right"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <Link
            to="/shop"
            className="text-xs font-bold text-[#2563eb] hover:text-[#1d4ed8] transition-colors flex items-center gap-1"
          >
            <span>See all</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Horizontal Carousel */}
      {loading ? (
        <ProductGridSkeleton count={4} />
      ) : (
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-none py-2 px-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {products.map((item) => (
            <ProductCard
              key={item._id || item.id}
              product={item}
              isCarousel={true}
            />
          ))}
        </div>
      )}
    </section>
  );
}
