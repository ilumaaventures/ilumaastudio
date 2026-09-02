import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../../pages/Store/StoreContext";
import { Sparkles, ArrowRight, Tag, ChevronLeft, ChevronRight } from "lucide-react";

export default function Categories({ theme = null }) {
  const { business, categories, storeHomePath, products } = useStore();
  const basePath =
    storeHomePath ||
    `/${encodeURIComponent(business?.subdomain || business?.slug || business?.businessName || "")}`;

  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const updateScrollIndicators = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeftArrow(scrollLeft > 10);
    setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10);
  };

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -280 : 280;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  useEffect(() => {
    updateScrollIndicators();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", updateScrollIndicators);
      window.addEventListener("resize", updateScrollIndicators);
    }
    return () => {
      if (el) el.removeEventListener("scroll", updateScrollIndicators);
      window.removeEventListener("resize", updateScrollIndicators);
    };
  }, [categories]);

  if (!categories || categories.length === 0) {
    return null;
  }

  const primaryColor = theme?.colors?.primary || "#4F46E5";

  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      
      {/* Header with Navigation Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div className="space-y-1 text-left">
          <span
            className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5"
            style={{ color: primaryColor }}
          >
            <Sparkles size={13} /> Curated Departments
          </span>
          <h2
            className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight"
            style={{ color: theme?.colors?.textColor || "#0f172a" }}
          >
            Explore Categories
          </h2>
          <p className="text-slate-500 text-xs font-medium">
            Browse our handpicked inventory selections (scroll left to right)
          </p>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          {/* Scroll Arrows */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleScroll("left")}
              disabled={!showLeftArrow}
              className="p-2 rounded-xl bg-white border border-slate-200/90 text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed shadow-2xs transition-all cursor-pointer"
              title="Scroll Left"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => handleScroll("right")}
              disabled={!showRightArrow}
              className="p-2 rounded-xl bg-white border border-slate-200/90 text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed shadow-2xs transition-all cursor-pointer"
              title="Scroll Right"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <Link
            to={`${basePath}/products`}
            className="text-xs font-black transition flex items-center gap-1 hover:underline shrink-0 bg-slate-100 px-3.5 py-2 rounded-xl border border-slate-200/80 text-slate-700"
          >
            <span>Full Catalog</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Horizontal Scrollable Categories Container */}
      <div
        ref={scrollRef}
        className="flex items-center gap-4 sm:gap-5 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden scroll-smooth py-2"
      >
        {categories.map((cat) => {
          const catCount = (products || []).filter(
            (p) =>
              p.category === cat._id ||
              p.category?._id === cat._id ||
              p.category?.name === cat.name
          ).length;

          return (
            <Link
              key={cat._id}
              to={`${basePath}/products?category=${encodeURIComponent(cat.name)}`}
              className="group relative rounded-3xl p-5 border border-slate-200/80 bg-white hover:border-indigo-300 hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center text-center gap-3 cursor-pointer overflow-hidden min-w-[150px] sm:min-w-[170px] shrink-0"
              style={{
                backgroundColor: theme?.colors?.cardBg || "#FFFFFF",
              }}
            >
              {/* Image / Icon Box */}
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 overflow-hidden shadow-2xs"
                style={{
                  backgroundColor: `${primaryColor}12`,
                  color: primaryColor,
                }}
              >
                {cat.image || cat.icon ? (
                  <img
                    src={cat.image || cat.icon}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <Tag size={24} />
                )}
              </div>

              {/* Title & Count Badge */}
              <div className="space-y-1 w-full">
                <span
                  className="text-xs font-black text-slate-900 group-hover:text-indigo-600 transition block truncate capitalize"
                  style={{ color: theme?.colors?.textColor || "#0f172a" }}
                  title={cat.name}
                >
                  {cat.name}
                </span>
                <span className="inline-block text-[10px] text-slate-500 font-extrabold px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200/60">
                  {catCount > 0 ? `${catCount} Items` : "Explore"}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
