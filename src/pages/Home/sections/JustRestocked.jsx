import React from "react";
import { RefreshCw } from "lucide-react";
import ProductCard from "../../../Components/ProductCard";

const RESTOCKED = [
  {
    _id: "restock_1",
    name: "Handcrafted Brass Diya Holder Stand",
    price: 1650,
    originalPrice: 2200,
    images: [{ url: "https://images.unsplash.com/photo-1590736969955-71cb94801759?q=80&w=400&auto=format&fit=crop" }],
    category: "Decor",
    rating: 4.9,
    reviewsCount: 160,
    badge: "Restocked"
  },
  {
    _id: "restock_2",
    name: "Sandalwood Aromatic Diffuser Reeds set",
    price: 890,
    originalPrice: 1200,
    images: [{ url: "https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=400&auto=format&fit=crop" }],
    category: "Aromatics",
    rating: 4.8,
    reviewsCount: 94,
    badge: "Restocked"
  },
  {
    _id: "restock_3",
    name: "Corporate Premium Leather Portfolio Folio",
    price: 2450,
    originalPrice: 3200,
    images: [{ url: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=400&auto=format&fit=crop" }],
    category: "Corporate",
    rating: 5.0,
    reviewsCount: 118,
    badge: "Restocked"
  }
];

function JustRestocked() {
  return (
    <section className="py-12 sm:py-16 bg-[#FAFAF9] border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-3">
          <div>
            <span className="flex items-center gap-1.5 text-[#2563eb] font-extrabold text-xs uppercase tracking-widest mb-1">
              <RefreshCw size={13} className="text-[#2563eb]" />
              Back By Popular Demand
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Just Restocked
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-sm">
            Grab our top selling essentials before inventory runs out again.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6 max-w-4xl mx-auto">
          {RESTOCKED.map((prod) => (
            <ProductCard key={prod._id} product={prod} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default JustRestocked;
