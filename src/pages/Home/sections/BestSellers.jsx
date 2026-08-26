import React from "react";
import { Sparkles } from "lucide-react";
import ProductCard from "../../../Components/ProductCard";

const BEST_SELLERS = [
  {
    _id: "best_1",
    name: "Luxury Ceramic Reed Diffuser Set (Vanilla & Oud)",
    price: 1850,
    originalPrice: 2400,
    images: [{ url: "https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=400&auto=format&fit=crop" }],
    category: "Aromatics",
    rating: 4.9,
    reviewsCount: 310,
    badge: "Best Seller"
  },
  {
    _id: "best_2",
    name: "Intricately Hammered Copper Water Bottle & Cups Set",
    price: 2100,
    originalPrice: 2999,
    images: [{ url: "https://images.unsplash.com/photo-1590736969955-71cb94801759?q=80&w=400&auto=format&fit=crop" }],
    category: "Decor",
    rating: 4.8,
    reviewsCount: 245,
    badge: "Best Seller"
  },
  {
    _id: "best_3",
    name: "Artisanal Assorted Dark Chocolate & Nut Hamper",
    price: 1450,
    originalPrice: 1999,
    images: [{ url: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=400&auto=format&fit=crop" }],
    category: "Hampers",
    rating: 5.0,
    reviewsCount: 180,
    badge: "Best Seller"
  },
  {
    _id: "best_4",
    name: "Handcrafted Marble Coasters with Gold Foiling (Set of 4)",
    price: 999,
    originalPrice: 1500,
    images: [{ url: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=400&auto=format&fit=crop" }],
    category: "Living",
    rating: 4.7,
    reviewsCount: 195,
    badge: "Best Seller"
  }
];

function BestSellers() {
  return (
    <section className="py-12 sm:py-16 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12">
          <div>
            <div className="flex items-center gap-2 text-[#2563eb] text-xs font-black uppercase tracking-widest mb-1.5">
              <Sparkles size={14} />
              <span>Customer Favorites</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Best Selling Collections
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-sm mt-2 md:mt-0">
            Handpicked bestsellers crafted to elevate your daily gifting & lifestyle.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {BEST_SELLERS.map((prod) => (
            <ProductCard key={prod._id} product={prod} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default BestSellers;
