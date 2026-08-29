import React, { useState, useEffect } from "react";
import {
  Zap,
  Clock,
  Flame,
  Tag,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getActiveFlashDeals } from "../../api/flashDealService";
import ProductCard from "../../Components/ProductCard";

function CountdownTimer({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate) - new Date();
      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor(difference / (1000 * 60 * 60)),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex items-center gap-1.5 font-mono font-black text-rose-600 text-xs">
      <Clock size={14} className="animate-pulse text-rose-500" />
      <div className="flex items-center gap-1">
        <span className="bg-rose-500 text-white px-2 py-0.5 rounded-lg text-xs">
          {String(timeLeft.hours).padStart(2, "0")}h
        </span>
        <span className="text-rose-500 font-bold">:</span>
        <span className="bg-rose-500 text-white px-2 py-0.5 rounded-lg text-xs">
          {String(timeLeft.minutes).padStart(2, "0")}m
        </span>
        <span className="text-rose-500 font-bold">:</span>
        <span className="bg-rose-600 text-white px-2 py-0.5 rounded-lg text-xs animate-pulse shadow-xs">
          {String(timeLeft.seconds).padStart(2, "0")}s
        </span>
      </div>
    </div>
  );
}

export default function FlashDeals() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setLoading(true);
        const data = await getActiveFlashDeals();
        setCampaigns(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching Flash Deals:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDeals();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 font-sans text-slate-900 dark:text-slate-100">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Main Hero Flash Deals Header Banner */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white shadow-2xl space-y-4 relative overflow-hidden border border-rose-500/20">
          <div className="absolute -right-10 -bottom-10 opacity-15 pointer-events-none">
            <Zap size={300} className="fill-rose-500 text-rose-500" />
          </div>

          <div className="space-y-3 max-w-2xl relative z-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-500/20 border border-rose-500/40 rounded-full text-xs font-black uppercase tracking-widest text-rose-300">
                <Flame size={14} className="fill-amber-400 text-amber-400" />
                Live Limited-Time Promotions
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white">
              Flash Deals 🔥
            </h1>

            <p className="text-sm sm:text-base text-rose-100/90 font-medium leading-relaxed">
              Unlock exclusive promotional discounts on top-rated products. Prices revert to original when the timer runs out!
            </p>
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="py-20 text-center space-y-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
            <Zap size={36} className="animate-bounce text-[#2563eb] mx-auto" />
            <p className="text-sm font-extrabold text-slate-700 dark:text-slate-300">
              Loading Live Flash Deals...
            </p>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="p-16 text-center space-y-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950 text-rose-500 flex items-center justify-center mx-auto">
              <Zap size={32} />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
              No Active Flash Deals Right Now
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Check back soon! Our team is curating exciting new promotional pricing and limited-time deals for you.
            </p>
            <div className="pt-2">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-6 py-3 rounded-xl text-xs font-bold transition shadow-md shadow-blue-500/20"
              >
                Browse All Products
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        ) : (
          campaigns.map((deal) => (
            <div
              key={deal._id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-6 sm:p-8 space-y-6 shadow-2xs"
            >
              {/* Campaign Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-5 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950 text-rose-600 border border-rose-200 dark:border-rose-800 text-xs font-black uppercase tracking-wider flex items-center gap-1">
                      <Flame size={14} className="text-amber-500 fill-amber-500" />
                      <span>Deal Name</span>
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                      {deal.title || "Flash Sale Event"}
                    </h2>
                  </div>
                  {deal.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {deal.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 bg-rose-50/80 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 px-4 py-2.5 rounded-2xl shrink-0">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    Deal Ends In:
                  </span>
                  <CountdownTimer targetDate={deal.endDate} />
                </div>
              </div>

              {/* Optional Custom Campaign Banner */}
              {deal.bannerImage && (
                <div className="w-full h-48 sm:h-64 rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 relative">
                  <img
                    src={deal.bannerImage}
                    alt={deal.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-6">
                    <h3 className="text-xl font-extrabold text-white">{deal.title}</h3>
                  </div>
                </div>
              )}

              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {(Array.isArray(deal.products) ? deal.products : []).map((item) => (
                  <ProductCard
                    key={item._id}
                    product={{
                      ...item,
                      price: item.dealPrice || item.price,
                      originalPrice: item.originalPrice,
                      badge: `${item.discountPercentage}% OFF`,
                    }}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
