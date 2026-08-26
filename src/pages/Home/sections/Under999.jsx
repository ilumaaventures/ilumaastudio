import React from "react";
import { Sparkles } from "lucide-react";
import ProductCard from "../../../Components/ProductCard";

const BUDGET_ITEMS = [
  {
    _id: "budget_1",
    name: "Handcrafted Brass incense Holder",
    price: 499,
    originalPrice: 790,
    images: [{ url: "https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=400&auto=format&fit=crop" }],
    category: "Decor",
    rating: 4.8,
    reviewsCount: 110,
    badge: "Under ₹999"
  },
  {
    _id: "budget_2",
    name: "Organic Botanical Soy Wax Tablet",
    price: 350,
    originalPrice: 499,
    images: [{ url: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=400&auto=format&fit=crop" }],
    category: "Aromatics",
    rating: 4.9,
    reviewsCount: 85,
    badge: "Under ₹999"
  },
  {
    _id: "budget_3",
    name: "Neem Wood Wide-Tooth Detangler Comb",
    price: 299,
    originalPrice: 450,
    images: [{ url: "https://images.unsplash.com/photo-1590736969955-71cb94801759?q=80&w=400&auto=format&fit=crop" }],
    category: "Accessories",
    rating: 4.7,
    reviewsCount: 64,
    badge: "Under ₹999"
  },
  {
    _id: "budget_4",
    name: "Mini Gift Box: Aromatic Tea & Scented Tealight",
    price: 890,
    originalPrice: 1200,
    images: [{ url: "https://images.unsplash.com/photo-1512909006721-3d6018887383?q=80&w=400&auto=format&fit=crop" }],
    category: "Hampers",
    rating: 5.0,
    reviewsCount: 140,
    badge: "Under ₹999"
  }
];

function Under999() {
  return (
    <section className="py-12 sm:py-16 bg-white border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-3">
          <div>
            <span className="text-[#2563eb] font-extrabold text-xs uppercase tracking-widest block mb-1">
              Budget Friendly Delights
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Under ₹999 Boutique
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-sm">
            High quality artisanal lifestyle goods that fit every pocket.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {BUDGET_ITEMS.map((prod) => (
            <ProductCard key={prod._id} product={prod} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Under999;
