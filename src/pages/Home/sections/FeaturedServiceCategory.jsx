import React, { useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { fetchCategories } from "../../../api/categoryService";

function FeaturedServiceCategory() {
  const scrollRef = useRef(null);
  const [serviceCategories, setServiceCategories] = React.useState([]);
  const scroll = (direction) => {
    if (!scrollRef.current) return;

    scrollRef.current.scrollBy({
      left: direction === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };
  const getCategories = async () => {
    try {
      const res = await fetchCategories({
        // businessType: "E-Commerce",
        businessType: "Service",
        // isFeatured: true,
      });
      console.log("Fetched categories:", res.data);
      setServiceCategories(res.data || res.categories || []);
      //   const list =
      //     res?.data || res?.categories || (Array.isArray(res) ? res : []);
      //   setCategories(list);
    } catch (err) {
      console.error("Failed to load categories:", err);
    }
  };
  useEffect(() => {
    getCategories();
  }, []);

  return (
    <section className="w-full py-10 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">
              Explore Services
            </p>

            <h2 className="mt-1 text-2xl sm:text-3xl font-black text-slate-900">
              Featured Service Categories
            </h2>
          </div>

          {/* Navigation */}
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => scroll("left")}
              aria-label="Scroll services left"
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-700 shadow-sm hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-300"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              type="button"
              onClick={() => scroll("right")}
              aria-label="Scroll services right"
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-700 shadow-sm hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-300"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Horizontal Categories */}
        <div
          ref={scrollRef}
          className="
            flex
            gap-4
            sm:gap-5
            overflow-x-auto
            scroll-smooth
            snap-x
            snap-mandatory
            pb-2
            [&::-webkit-scrollbar]:hidden
          "
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {serviceCategories.map((category) => (
            <div
              key={category.name}
              className="
                group
                flex-shrink-0
                snap-start
                w-[145px]
                sm:w-[175px]
                md:w-[190px]
                cursor-pointer
              "
            >
              <div className="relative aspect-square overflow-hidden rounded-2xl sm:rounded-3xl bg-slate-100">
                <img
                  src={category.image}
                  alt={category.name}
                  loading="lazy"
                  className="
                    w-full
                    h-full
                    object-cover
                    transition-transform
                    duration-500
                    group-hover:scale-110
                  "
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                  <h3 className="text-white font-bold text-sm sm:text-base leading-tight">
                    {category.name}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedServiceCategory;
