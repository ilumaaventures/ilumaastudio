import React from "react";
import { Link } from "react-router-dom";

const RESTAURANTS = [
  {
    id: "rest_1",
    name: "Spice Kitchen",
    subtitle: "34 min - 35 ago",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=500&q=80",
    link: "/shop",
  },
  {
    id: "rest_2",
    name: "Cafe Hero",
    subtitle: "34 min - 35 ago",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=500&q=80",
    link: "/shop",
  },
  {
    id: "rest_3",
    name: "Pasta House",
    subtitle: "34 min - 35 ago",
    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=500&q=80",
    link: "/shop",
  },
];

function NearbyRestaurants() {
  return (
    <section className="py-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Nearby Restaurants
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
        {RESTAURANTS.map((rest) => (
          <Link
            key={rest.id}
            to={rest.link}
            className="group bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col"
          >
            <div className="h-36 sm:h-40 w-full overflow-hidden relative">
              <img
                src={rest.image}
                alt={rest.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-4 bg-white">
              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg group-hover:text-[#1e6091] transition-colors">
                {rest.name}
              </h3>
              <p className="text-xs font-semibold text-slate-400 mt-0.5">
                {rest.subtitle}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default NearbyRestaurants;
