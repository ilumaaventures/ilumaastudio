import React from "react";
import { Heart } from "lucide-react";
import ProductCard from "../../../Components/ProductCard";

const FAVORITES = [
  {
    _id: "fav_1",
    name: "Aura Soy Wax candle - Jasmine Infusion",
    price: 590,
    originalPrice: 850,
    images: [{ url: "https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=400&auto=format&fit=crop" }],
    category: "Aromatics",
    rating: 4.9,
    reviewsCount: 154,
    badge: "Top Rated"
  },
  {
    _id: "fav_2",
    name: "Hand-turned Mango Wood Bowl Set",
    price: 1350,
    originalPrice: 1800,
    images: [{ url: "https://images.unsplash.com/photo-1590736969955-71cb94801759?q=80&w=400&auto=format&fit=crop" }],
    category: "Decor",
    rating: 4.8,
    reviewsCount: 98,
    badge: "Loved"
  },
  {
    _id: "fav_3",
    name: "Customized Saffiano Leather Cardholder",
    price: 999,
    originalPrice: 1500,
    images: [{ url: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=400&auto=format&fit=crop" }],
    category: "Accessories",
    rating: 5.0,
    reviewsCount: 220,
    badge: "Best Seller"
  }
];

function CustomerFavorites() {
  return (
    <section className="py-12 sm:py-16 bg-[#FAFAF9] border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-10 sm:mb-12 space-y-2">
          <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 shadow-2xs">
            <Heart size={18} fill="currentColor" />
          </div>
          <span className="text-[#2563eb] font-extrabold text-xs uppercase tracking-widest block">
            Most Adored Products
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Customer Favorites
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md">
            The community's top-rated daily luxuries and curated essentials.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6 max-w-4xl mx-auto">
          {FAVORITES.map((prod) => (
            <ProductCard key={prod._id} product={prod} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default CustomerFavorites;
