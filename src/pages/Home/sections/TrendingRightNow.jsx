import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Flame } from "lucide-react";
import ProductCard from "../../../Components/ProductCard";

const DEFAULT_TRENDING = [
  {
    _id: "trend_1",
    name: "Luxury Soy Wax Candle with Brass Snuffer",
    price: 1299,
    originalPrice: 1899,
    images: [{ url: "https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=400" }],
    category: "Living",
    rating: 4.8,
    reviewsCount: 142,
    badge: "Trending"
  },
  {
    _id: "trend_2",
    name: "Handcrafted Ceramic Planter with Wooden Base",
    price: 899,
    originalPrice: 1499,
    images: [{ url: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=400" }],
    category: "Decor",
    rating: 4.9,
    reviewsCount: 88,
    badge: "Hot"
  },
  {
    _id: "trend_3",
    name: "Pure Brass Pour-Over Coffee Dripper Set",
    price: 2499,
    originalPrice: 3499,
    images: [{ url: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?q=80&w=400" }],
    category: "Dining",
    rating: 4.7,
    reviewsCount: 120,
    badge: "Trending"
  },
  {
    _id: "trend_4",
    name: "Artisanal Textured Linen Throw Blanket",
    price: 1899,
    originalPrice: 2599,
    images: [{ url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=400" }],
    category: "Living",
    rating: 4.8,
    reviewsCount: 64,
    badge: "Trending"
  }
];

function TrendingRightNow({ products = [], loading = false }) {
  const displayProducts =
    products && products.length > 0
      ? products.slice(0, 4).map((p) => ({
          ...p,
          badge: p.badge || "Trending",
        }))
      : DEFAULT_TRENDING;

  return (
    <section className="py-12 sm:py-16 bg-[#FAFAF9] border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8 sm:mb-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600">
              <Flame size={18} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Trending Right Now
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Items flying off the shelves this week
              </p>
            </div>
          </div>
          <Link
            to="/shop?sort=Trending"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50/80 hover:bg-blue-100 border border-blue-100/80 transition-all duration-200 shadow-2xs group shrink-0"
          >
            <span>See All</span>
            <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* 4 Column Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {displayProducts.map((prod) => (
            <ProductCard key={prod._id || prod.id} product={prod} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default TrendingRightNow;
