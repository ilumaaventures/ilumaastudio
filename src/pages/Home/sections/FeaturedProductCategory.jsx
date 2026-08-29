import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { fetchCategories } from "../../../api/categoryService";

function FeaturedProductCategory() {
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -360 : 360,
      behavior: "smooth",
    });
  };

  const getCategories = async () => {
    try {
      setLoading(true);
      const res = await fetchCategories({
        businessType: "E-Commerce",
      });
      const list =
        res?.data || res?.categories || (Array.isArray(res) ? res : []);

      if (list.length > 0) {
        const formatted = list.map((cat, idx) => ({
          _id: cat._id || cat.id || `cat_${idx}`,
          name: cat.name || cat.title || "Category",
          count: cat.productCount
            ? `${cat.productCount} Products`
            : "Explore Collection",
          image:
            cat.image ||
            cat.imageUrl ||
            "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=600&q=80",
        }));
        setCategories(formatted);
      } else {
        setCategories([]);
      }
    } catch (err) {
      console.error("Failed to load categories:", err);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const handleCategoryClick = (catName) => {
    navigate(`/shop?category=${encodeURIComponent(catName)}`);
  };

  if (!loading && categories.length === 0) {
    return null;
  }

  return (
    <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-4">
      {/* Header Bar */}
      <div className="flex items-end justify-between gap-4 border-b border-slate-200/80 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-[#2563eb] bg-blue-50 px-2.5 py-0.5 rounded-full">
              Explore Collections
            </span>
          </div>

          <h2 className="mt-2 text-xl sm:text-2xl font-black tracking-tight text-slate-900">
            Featured Categories
          </h2>

          <p className="mt-1 text-xs text-slate-500 max-w-xl font-medium">
            Discover our most loved collections carefully curated for every style and occasion.
          </p>
        </div>

        {/* Navigation arrows */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => scroll("left")}
              aria-label="Previous categories"
              className="w-8 h-8 rounded-full border border-slate-200 bg-white text-slate-700 flex items-center justify-center hover:bg-[#2563eb] hover:text-white hover:border-[#2563eb] transition-all shadow-2xs cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>

            <button
              onClick={() => scroll("right")}
              aria-label="Next categories"
              className="w-8 h-8 rounded-full border border-slate-200 bg-white text-slate-700 flex items-center justify-center hover:bg-[#2563eb] hover:text-white hover:border-[#2563eb] transition-all shadow-2xs cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Category Slider */}
      {loading ? (
        <div className="flex gap-4 overflow-x-auto pb-2 pt-1 animate-pulse">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="shrink-0 w-[180px] sm:w-[210px] lg:w-[230px] aspect-[0.85] rounded-2xl bg-slate-200 dark:bg-slate-800"
            />
          ))}
        </div>
      ) : (
        <div className="relative">
          <div
            ref={scrollRef}
            className="
              flex gap-4 sm:gap-5
              overflow-x-auto
              scroll-smooth
              snap-x snap-mandatory
              pb-2 pt-1
              [scrollbar-width:none]
              [-ms-overflow-style:none]
              [&::-webkit-scrollbar]:hidden
            "
          >
            {categories.map((category) => (
              <div
                key={category._id}
                onClick={() => handleCategoryClick(category.name)}
                className="
                  group
                  relative
                  shrink-0
                  w-[180px]
                  sm:w-[210px]
                  lg:w-[230px]
                  snap-start
                  overflow-hidden
                  rounded-2xl
                  bg-slate-100
                  aspect-[0.85]
                  cursor-pointer
                  shadow-2xs
                  hover:shadow-xl
                  transition-all duration-300
                "
              >
                {/* Image */}
                <img
                  src={category.image}
                  alt={category.name}
                  draggable="false"
                  className="
                    absolute inset-0
                    w-full h-full
                    object-cover
                    transition-transform
                    duration-700
                    ease-out
                    group-hover:scale-110
                  "
                />

                {/* Gradient Overlay */}
                <div
                  className="
                    absolute inset-0
                    bg-gradient-to-t
                    from-slate-950/85
                    via-slate-900/30
                    to-transparent
                  "
                />

                {/* Floating Action Arrow */}
                <div
                  className="
                    absolute
                    top-3 right-3
                    w-8 h-8
                    rounded-full
                    bg-white/90
                    backdrop-blur-xs
                    flex items-center justify-center
                    text-slate-900
                    opacity-0
                    translate-y-2
                    group-hover:opacity-100
                    group-hover:translate-y-0
                    transition-all duration-300
                    shadow-sm
                  "
                >
                  <ArrowUpRight size={16} className="text-[#2563eb]" />
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white text-sm sm:text-base font-extrabold tracking-tight group-hover:text-blue-200 transition-colors">
                    {category.name}
                  </p>

                  <p className="mt-0.5 text-[11px] font-semibold text-slate-300">
                    {category.count}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default FeaturedProductCategory;

