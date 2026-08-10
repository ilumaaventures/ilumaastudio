import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

const TRENDING = [
  {
    name: "Aromatherapy Soy Candles",
    growth: "+140% this week",
    image:
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=400&auto=format&fit=crop",
    link: "/shop?category=aromatics",
  },
  {
    name: "Handcrafted Copperware",
    growth: "+95% this week",
    image:
      "https://images.unsplash.com/photo-1590736969955-71cb94801759?q=80&w=400&auto=format&fit=crop",
    link: "/shop?category=decor",
  },
  {
    name: "Bespoke Hampers",
    growth: "+210% this week",
    image:
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=400&auto=format&fit=crop",
    link: "/shop?category=hampers",
  },
];

function TrendingCategories() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-2">
            <span className="text-[#C9956C] font-semibold text-xs uppercase tracking-widest block">
              High Growth Segments
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-[#111] font-serif tracking-tight">
              Trending Categories
            </h2>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TRENDING.map((cat, idx) => (
            <Link
              key={idx}
              to={cat.link}
              className="group relative h-60 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundImage: `url('₹{cat.image}')` }}
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/55 group-hover:bg-black/65 transition-colors" />

              {/* Info */}
              <div className="absolute inset-0 p-6 flex flex-col justify-between text-white z-10">
                <div className="inline-flex items-center gap-1 self-start px-2.5 py-1 rounded bg-[#C9956C] text-white text-[8px] font-black uppercase tracking-wider">
                  <Sparkles size={8} className="animate-spin-slow" />
                  <span>{cat.growth}</span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-bold font-serif">{cat.name}</h3>
                  <span className="inline-flex items-center gap-1 text-[10px] text-gray-300 font-bold uppercase tracking-wider group-hover:text-white transition-colors">
                    <span>Shop category</span>
                    <ArrowRight
                      size={10}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TrendingCategories;
