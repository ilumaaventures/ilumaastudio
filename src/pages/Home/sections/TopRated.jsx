import React from "react";
import { Star } from "lucide-react";
import ProductCard from "../../../Components/ProductCard";

const RATED = [
  {
    _id: "rated_1",
    name: "Ceramic Tealight Candle Holder (Set of 2)",
    price: 490,
    originalPrice: 650,
    images: [{ url: "https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=400&auto=format&fit=crop" }],
    category: "Decor",
    rating: 5.0,
    reviewsCount: 380,
    badge: "5.0 ★"
  },
  {
    _id: "rated_2",
    name: "Pure Mulberry Silk Hand-rolled Scarf",
    price: 2450,
    originalPrice: 3200,
    images: [{ url: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=400&auto=format&fit=crop" }],
    category: "Accessories",
    rating: 4.95,
    reviewsCount: 190,
    badge: "5.0 ★"
  },
  {
    _id: "rated_3",
    name: "Hand-poured Honey & Wild Lavender Hampers Box",
    price: 3800,
    originalPrice: 4999,
    images: [{ url: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=400&auto=format&fit=crop" }],
    category: "Hampers",
    rating: 5.0,
    reviewsCount: 110,
    badge: "5.0 ★"
  }
];

function TopRated() {
  return (
    <section className="py-12 sm:py-16 bg-white border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-amber-500 text-xs font-black uppercase tracking-widest mb-1">
              <Star size={14} fill="currentColor" />
              <span>Five-Star Excellence</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Top Rated Products
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-sm">
            Uncompromising quality approved by verified customer ratings.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6 max-w-4xl mx-auto">
          {RATED.map((prod) => (
            <ProductCard key={prod._id} product={prod} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default TopRated;
