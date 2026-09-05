import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ArrowRight } from "lucide-react";

const FEATURED_ITEMS = [
  {
    title: "Trending Now",
    subtitle: "Most Popular Products",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400&auto=format&fit=crop",
    link: "/products?sort=trending",
  },
  {
    title: "Best Sellers",
    subtitle: "Top Rated Products",
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=400&auto=format&fit=crop",
    link: "/products?sort=bestsellers",
  },
  {
    title: "New Arrivals",
    subtitle: "Latest Products",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400&auto=format&fit=crop",
    link: "/products?sort=new",
  },
  {
    title: "Premium Collection",
    subtitle: "Luxury & Exclusive",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=400&auto=format&fit=crop",
    link: "/products?category=premium",
  },
  {
    title: "Staff Picks",
    subtitle: "Handpicked For You",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400&auto=format&fit=crop",
    link: "/products?staffPicks=true",
  },
];

function FeaturedCollections() {
  return (
    <section className="py-8 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            Featured Collections
          </h2>
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50/80 hover:bg-blue-100 border border-blue-100/80 transition-all duration-200 shadow-2xs group shrink-0"
          >
            <span>See All</span>
            <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* 5 Column Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {FEATURED_ITEMS.map((item, idx) => (
            <Link
              key={idx}
              to={item.link}
              className="group relative h-48 rounded-xl overflow-hidden shadow-sm hover:shadow-md border border-slate-200/80 dark:border-slate-800 transition-all duration-300"
            >
              {/* Image */}
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

              {/* Text Info */}
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <h3 className="text-sm font-black leading-tight">
                  {item.title}
                </h3>
                <p className="text-[10px] text-slate-300 font-medium mt-0.5">
                  {item.subtitle}
                </p>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}

export default FeaturedCollections;
