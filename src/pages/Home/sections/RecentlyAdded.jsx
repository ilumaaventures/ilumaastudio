import React, { useState } from "react";
import ProductCard from "../../../Components/ProductCard";

const DEFAULT_TAB_PRODUCTS = [
  {
    _id: "tab_1",
    name: "Handcrafted Ceramic Matcha Bowl & Whisk Set",
    price: 1650,
    originalPrice: 2200,
    images: [{ url: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=400" }],
    category: "Dining",
    rating: 4.8,
    reviewsCount: 110,
    badge: "New"
  },
  {
    _id: "tab_2",
    name: "Artisanal Gourmet Chocolate Hamper",
    price: 1890,
    originalPrice: 2500,
    images: [{ url: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=400" }],
    category: "Gifting",
    rating: 4.9,
    reviewsCount: 94,
    badge: "Trending"
  },
  {
    _id: "tab_3",
    name: "Essential Oil Ultrasonic Mist Diffuser",
    price: 2199,
    originalPrice: 2999,
    images: [{ url: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=400" }],
    category: "Living",
    rating: 4.7,
    reviewsCount: 145,
    badge: "Premium"
  },
  {
    _id: "tab_4",
    name: "Pure Brass Hand-carved Incense Burner",
    price: 899,
    originalPrice: 1299,
    images: [{ url: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?q=80&w=400" }],
    category: "Decor",
    rating: 4.8,
    reviewsCount: 78,
    badge: "Seasonal"
  }
];

const TABS = [
  { id: "recently_added", label: "Recently Added" },
  { id: "trending", label: "Trending Categories" },
  { id: "premium", label: "Premium Collection" },
  { id: "seasonal", label: "Seasonal Collection" },
];

function RecentlyAdded({ products = [], loading = false }) {
  const [activeTab, setActiveTab] = useState("recently_added");

  const getTabProducts = () => {
    if (!products || products.length === 0) return DEFAULT_TAB_PRODUCTS;
    if (activeTab === "recently_added") {
      return products.slice(0, 4);
    } else if (activeTab === "trending") {
      return [...products]
        .sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0))
        .slice(0, 4);
    } else if (activeTab === "premium") {
      return [...products]
        .sort((a, b) => (b.price || 0) - (a.price || 0))
        .slice(0, 4);
    } else if (activeTab === "seasonal") {
      return products.slice(Math.max(0, products.length - 4), products.length);
    }
    return products.slice(0, 4);
  };

  const tabProducts = getTabProducts();

  return (
    <section className="py-12 sm:py-16 bg-[#FAFAF9] border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Centered Tab Headers */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-8 border-b border-slate-200 pb-2 mb-8 sm:mb-10">
          {TABS.map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-xs sm:text-sm font-extrabold tracking-tight pb-3 transition-all relative cursor-pointer ${
                  isSelected
                    ? "text-[#2563eb]"
                    : "text-slate-400 hover:text-slate-800"
                }`}
              >
                {tab.label}
                {isSelected && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563eb]" />
                )}
              </button>
            );
          })}
        </div>

        {/* 4 Column Tabbed Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {tabProducts.map((prod) => (
            <ProductCard key={prod._id || prod.id} product={prod} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default RecentlyAdded;
