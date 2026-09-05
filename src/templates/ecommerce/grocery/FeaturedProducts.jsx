import React, { useState, useEffect, useMemo } from "react";
import {
  Flame,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Leaf,
  ShieldCheck,
  Zap,
  Tag,
} from "lucide-react";
import ProductCard from "./ProductCard";

export default function FeaturedProducts({
  products = [],
  onSelectProduct = null,
  onNavigateToAisles = null,
  onAddToCart = null,
  onUpdateQuantity = null,
}) {
  const [activeTab, setActiveTab] = useState("deals");
  const [countdown, setCountdown] = useState({
    hours: 4,
    minutes: 32,
    seconds: 45,
  });

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0)
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0)
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 5, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const tabs = [
    {
      id: "deals",
      label: "Flash Deals & Steals",
      icon: Flame,
      badge: "Up to 35% OFF",
      color: "text-rose-600",
    },
    {
      id: "picked-today",
      label: "Harvested Today",
      icon: Leaf,
      badge: "Farm Direct",
      color: "text-emerald-700",
    },
    {
      id: "favorites",
      label: "Customer Favorites",
      icon: Sparkles,
      badge: "★ 4.9 Rated",
      color: "text-amber-700",
    },
    {
      id: "pantry",
      label: "Pantry & Bakery",
      icon: Zap,
      badge: "Daily Staples",
      color: "text-indigo-700",
    },
  ];

  // Curated lists based on active tab
  const displayedProducts = useMemo(() => {
    if (!products || products.length === 0) return [];

    switch (activeTab) {
      case "deals":
        return products
          .filter(
            (p) =>
              (p.compareAtPrice && p.compareAtPrice > p.price) ||
              (p.badge && p.badge.toLowerCase().includes("off"))
          )
          .concat(products)
          .slice(0, 4);

      case "picked-today":
        return products
          .filter(
            (p) =>
              (p.category &&
                (p.category.toLowerCase().includes("produce") ||
                  p.category.toLowerCase().includes("juice") ||
                  p.category.toLowerCase().includes("egg"))) ||
              (p.badge && p.badge.toLowerCase().includes("organic"))
          )
          .concat(products)
          .slice(0, 4);

      case "favorites":
        return [...products]
          .sort((a, b) => (b.rating || 5) - (a.rating || 5))
          .slice(0, 4);

      case "pantry":
        return products
          .filter(
            (p) =>
              p.category &&
              (p.category.toLowerCase().includes("pantry") ||
                p.category.toLowerCase().includes("bakery") ||
                p.category.toLowerCase().includes("spice"))
          )
          .concat(products)
          .slice(0, 4);

      default:
        return products.slice(0, 4);
    }
  }, [products, activeTab]);

  return (
    <section className="py-16 bg-gradient-to-b from-[#F9FAF9] to-white border-b border-emerald-950/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Block with Urgency Banner */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/70 border border-emerald-300/60 text-[#15803D] text-xs font-bold uppercase tracking-wider">
              <Sparkles size={13} className="text-emerald-600" />
              <span>Handpicked Farm Curations</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Featured Specials & Daily Deals
            </h2>
            <p className="text-sm text-slate-500 max-w-xl">
              Fresh organic crops, oven-warm artisan sourdough, and cold-pressed elixirs discounted for maximum freshness.
            </p>
          </div>

          {/* Flash Deal Urgency Box */}
          <div className="flex items-center gap-4 bg-white p-3.5 sm:p-4 rounded-2xl border border-rose-200 shadow-sm shrink-0">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <Clock size={20} className="animate-pulse" />
            </div>
            <div className="text-left space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-rose-600 tracking-wider flex items-center gap-1">
                <Flame size={11} /> Today's Lightning Deal Closes In
              </span>
              <div className="flex items-center gap-1.5 font-mono text-sm font-black text-slate-900">
                <span className="bg-slate-100 px-2 py-0.5 rounded-md">
                  {String(countdown.hours).padStart(2, "0")}h
                </span>
                <span>:</span>
                <span className="bg-slate-100 px-2 py-0.5 rounded-md">
                  {String(countdown.minutes).padStart(2, "0")}m
                </span>
                <span>:</span>
                <span className="bg-rose-100 text-rose-700 px-2 py-0.5 rounded-md">
                  {String(countdown.seconds).padStart(2, "0")}s
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Switcher Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200/80">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 shrink-0 cursor-pointer ${
                  isActive
                    ? "bg-[#15803D] text-white shadow-md shadow-emerald-950/15"
                    : "bg-white hover:bg-emerald-50/70 text-slate-700 border border-slate-200/80"
                }`}
              >
                <Icon
                  size={15}
                  className={
                    isActive ? "text-emerald-200" : `${tab.color} group-hover:scale-110 transition-transform`
                  }
                />
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Product Cards Grid */}
        {displayedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayedProducts.map((prod) => (
              <ProductCard
                key={prod._id || prod.id}
                product={prod}
                layout="grid"
                onSelect={onSelectProduct}
                onAddToCart={onAddToCart}
                onUpdateQuantity={onUpdateQuantity}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200">
            <p className="text-sm text-slate-500">
              No featured items available under this category today. Check back tomorrow morning!
            </p>
          </div>
        )}

        {/* Bottom Call to Action */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-emerald-50/70 border border-emerald-200/70 p-4 sm:p-5 rounded-3xl text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#15803D] text-white flex items-center justify-center shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                100% Farm Fresh Guarantee
              </h4>
              <p className="text-[11px] text-slate-500">
                Not fully satisfied with any produce or grocery item? We refund instantly with zero return hassle.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if (onNavigateToAisles) {
                onNavigateToAisles(activeTab);
              }
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#15803D] hover:bg-emerald-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition cursor-pointer shadow-sm hover:shadow"
          >
            <span>Explore All Aisles</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
}
