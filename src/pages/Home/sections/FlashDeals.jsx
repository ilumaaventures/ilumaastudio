import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

const FLASH_DEALS_DATA = [
  {
    id: "fd_1",
    title: "Fresh Artisan Bread",
    discountBadge: "50% off",
    subDiscount: "Max 50% off",
    timeTag: "15 m - 30 ago",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80",
    link: "/shop",
  },
  {
    id: "fd_2",
    title: "Organic Farm Milk",
    discountBadge: "30% off",
    subDiscount: "Milk - 3% off",
    timeTag: "15 m - 30 ago",
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80",
    link: "/shop",
  },
  {
    id: "fd_3",
    title: "Crunchy Snacks",
    discountBadge: "20% off",
    subDiscount: "Snacks - 5% off",
    timeTag: "15 m - 30 ago",
    image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=400&q=80",
    link: "/shop",
  },
  {
    id: "fd_4",
    title: "Wireless Earbuds",
    discountBadge: "40% off",
    subDiscount: "20 min - 10 get",
    timeTag: "10 m - 20 ago",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=400&q=80",
    link: "/shop",
  },
];

function FlashDeals() {
  const [wishlisted, setWishlisted] = useState({});

  const toggleWishlist = (id) => {
    setWishlisted((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className="py-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header with See All */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Flash Deals
        </h2>
        <Link
          to="/shop"
          className="text-xs sm:text-sm font-bold text-[#1e6091] hover:text-[#1a5276] transition-colors"
        >
          See all
        </Link>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {FLASH_DEALS_DATA.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-slate-100 rounded-3xl p-3 sm:p-4 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group relative"
          >
            {/* Top Product Image Box */}
            <div className="relative w-full aspect-4/3 rounded-2xl bg-slate-50 flex items-center justify-center p-3 overflow-hidden">
              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(item.id)}
                className="absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-full bg-white/90 shadow-2xs flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors"
                aria-label="Add to wishlist"
              >
                <Heart
                  size={15}
                  className={wishlisted[item.id] ? "fill-rose-500 text-rose-500" : ""}
                />
              </button>

              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Bottom Details */}
            <div className="mt-3 space-y-1.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base truncate">
                  {item.title}
                </h3>
                <span className="text-[11px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/50">
                  {item.discountBadge}
                </span>
              </div>

              <div className="text-[11px] text-slate-400 font-medium flex justify-between items-center">
                <span>{item.subDiscount}</span>
              </div>

              <div className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {item.timeTag}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FlashDeals;

