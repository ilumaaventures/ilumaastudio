import React from "react";
import { Link } from "react-router-dom";

const RECOMMENDED_ITEMS = [
  {
    id: "rec_1",
    title: "Local Bakery",
    subtitle: "38 min - 22 ago",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80",
    link: "/shop",
  },
  {
    id: "rec_2",
    title: "Farm Eggs",
    subtitle: "23 min - 24 ago",
    image: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=400&q=80",
    link: "/shop",
  },
  {
    id: "rec_3",
    title: "Fruit Basket",
    subtitle: "24 min - 38 ago",
    image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=400&q=80",
    link: "/shop",
  },
];

function RecommendedForYou() {
  return (
    <section className="py-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Recommended For You
        </h2>
        <Link
          to="/shop"
          className="text-xs sm:text-sm font-bold text-[#1e6091] hover:text-[#1a5276] transition-colors"
        >
          See all
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {RECOMMENDED_ITEMS.map((item) => (
          <Link
            key={item.id}
            to={item.link}
            className="group bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col"
          >
            <div className="h-36 sm:h-40 w-full overflow-hidden relative">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-4 bg-white">
              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg group-hover:text-[#1e6091] transition-colors">
                {item.title}
              </h3>
              <p className="text-xs font-semibold text-slate-400 mt-0.5">
                {item.subtitle}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default RecommendedForYou;

