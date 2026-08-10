import React, { useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { fetchCategories } from "../../../api/categoryService";

function FeaturedProductCategory() {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (!scrollRef.current) return;

    scrollRef.current.scrollBy({
      left: direction === "left" ? -360 : 360,
      behavior: "smooth",
    });
  };

  const [categories, setCategories] = React.useState([]);
  const getCategories = async () => {
    try {
      const res = await fetchCategories({
        businessType: "E-Commerce",
        isFeatured: true,
      });
      console.log("Fetched categories:", res.data);
      setCategories(res.data || res.categories || []);
    } catch (err) {
      console.error("Failed to load categories:", err);
    }
  };
  useEffect(() => {
    getCategories();
  }, []);

  return (
    <section className="w-full py-10 sm:py-12 lg:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">
              Explore Collection
            </span>

            <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900">
              Featured Categories
            </h2>

            <p className="mt-2 text-sm sm:text-base text-slate-500 max-w-xl">
              Discover our most loved collections, carefully curated for every
              style and occasion.
            </p>
          </div>

          {/* Desktop arrows */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <button
              onClick={() => scroll("left")}
              aria-label="Previous categories"
              className="w-10 h-10 lg:w-11 lg:h-11 rounded-full border border-slate-200 bg-white text-slate-700 flex items-center justify-center hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-300 shadow-sm"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={() => scroll("right")}
              aria-label="Next categories"
              className="w-10 h-10 lg:w-11 lg:h-11 rounded-full border border-slate-200 bg-white text-slate-700 flex items-center justify-center hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-300 shadow-sm"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Category Slider */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="
              flex gap-4 sm:gap-5
              overflow-x-auto
              scroll-smooth
              snap-x snap-mandatory
              pb-2
              cursor-grab active:cursor-grabbing
              [scrollbar-width:none]
              [-ms-overflow-style:none]
              [&::-webkit-scrollbar]:hidden
            "
          >
            {categories.map((category) => (
              <div
                key={category.id}
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
                  aspect-[0.82]
                  cursor-pointer
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

                {/* Overlay */}
                <div
                  className="
                    absolute inset-0
                    bg-gradient-to-t
                    from-black/75
                    via-black/20
                    to-transparent
                  "
                />

                {/* Arrow */}
                <div
                  className="
                    absolute
                    top-3 right-3
                    w-9 h-9
                    rounded-full
                    bg-white/90
                    backdrop-blur-sm
                    flex items-center justify-center
                    text-slate-900
                    opacity-0
                    translate-y-2
                    group-hover:opacity-100
                    group-hover:translate-y-0
                    transition-all duration-300
                  "
                >
                  <ArrowUpRight size={17} />
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                  <p className="text-white text-lg sm:text-xl font-bold tracking-tight">
                    {category.name}
                  </p>

                  <p className="mt-1 text-xs sm:text-sm text-white/75">
                    {category.count}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile arrows */}
          <div className="flex sm:hidden justify-end gap-2 mt-4">
            <button
              onClick={() => scroll("left")}
              aria-label="Previous categories"
              className="w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-700 shadow-sm active:scale-95"
            >
              <ChevronLeft size={19} />
            </button>

            <button
              onClick={() => scroll("right")}
              aria-label="Next categories"
              className="w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-700 shadow-sm active:scale-95"
            >
              <ChevronRight size={19} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturedProductCategory;
