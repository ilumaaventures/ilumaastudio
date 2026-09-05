import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ArrowRight } from "lucide-react";

const LIFESTYLES = [
  {
    title: "Gaming Setup",
    image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=400&auto=format&fit=crop",
    link: "/products?lifestyle=gaming",
  },
  {
    title: "Work From Home",
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=400&auto=format&fit=crop",
    link: "/products?lifestyle=wfh",
  },
  {
    title: "Smart Home",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=400&auto=format&fit=crop",
    link: "/products?lifestyle=smarthome",
  },
  {
    title: "Fitness",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=400&auto=format&fit=crop",
    link: "/products?lifestyle=fitness",
  },
  {
    title: "Luxury Living",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=400&auto=format&fit=crop",
    link: "/products?lifestyle=luxury",
  },
];

function ShopByLifestyle() {
  return (
    <section className="py-8 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            Shop by Lifestyle
          </h2>
          <Link
            to="/products?lifestyle=all"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50/80 hover:bg-blue-100 border border-blue-100/80 transition-all duration-200 shadow-2xs group shrink-0"
          >
            <span>See All</span>
            <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* 5 Column Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {LIFESTYLES.map((item, idx) => (
            <Link
              key={idx}
              to={item.link}
              className="group relative h-52 rounded-xl overflow-hidden shadow-sm hover:shadow-md border border-slate-200/80 dark:border-slate-800 transition-all duration-300"
            >
              {/* Image */}
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />

              {/* Title */}
              <div className="absolute bottom-4 inset-x-4 text-center">
                <span className="text-sm font-black text-white bg-slate-900/60 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10 inline-block group-hover:bg-[#2563eb] transition-colors">
                  {item.title}
                </span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}

export default ShopByLifestyle;
