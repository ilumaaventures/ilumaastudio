import React from "react";
import { Sparkles } from "lucide-react";
import ProductCard from "../../../Components/ProductCard";

const LUXURY_PRODUCTS = [
  {
    _id: "lux_1",
    name: "The Emperor Royal Rosewood Gift Trunk",
    price: 12500,
    originalPrice: 16000,
    images: [{ url: "https://images.unsplash.com/photo-1512909006721-3d6018887383?q=80&w=600&auto=format&fit=crop" }],
    category: "Signature Trunks",
    rating: 5.0,
    reviewsCount: 42,
    badge: "Premium Luxe"
  },
  {
    _id: "lux_2",
    name: "Hand-Carved Marble Pillar Candlestick Set",
    price: 4500,
    originalPrice: 5800,
    images: [{ url: "https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=600&auto=format&fit=crop" }],
    category: "Heritage Decor",
    rating: 4.9,
    reviewsCount: 38,
    badge: "Premium Luxe"
  },
  {
    _id: "lux_3",
    name: "Pure Brass Hand-Engraved Samovar & Goblet Set",
    price: 8900,
    originalPrice: 11500,
    images: [{ url: "https://images.unsplash.com/photo-1590736969955-71cb94801759?q=80&w=600&auto=format&fit=crop" }],
    category: "Heritage Decor",
    rating: 5.0,
    reviewsCount: 29,
    badge: "Premium Luxe"
  },
  {
    _id: "lux_4",
    name: "Pure Mulberry Silk Hand-Embroidered Tapestry",
    price: 7200,
    originalPrice: 9500,
    images: [{ url: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=600&auto=format&fit=crop" }],
    category: "Signature Textile",
    rating: 4.9,
    reviewsCount: 31,
    badge: "Premium Luxe"
  }
];

function PremiumCollection() {
  return (
    <section className="py-12 sm:py-16 bg-white border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-amber-600 text-xs font-black uppercase tracking-widest mb-1.5">
              <Sparkles size={14} className="text-amber-500" />
              <span>Signature Luxe</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              The Premium Collection
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-sm">
            Heirloom-quality treasures made with the finest materials and centuries-old artistry.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {LUXURY_PRODUCTS.map((prod) => (
            <ProductCard key={prod._id} product={prod} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default PremiumCollection;
