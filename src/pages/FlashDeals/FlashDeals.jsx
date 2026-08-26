import React, { useState, useEffect } from "react";
import {
  Zap,
  Clock,
  ShoppingCart,
  ArrowRight,
  Tag,
  Flame,
  CheckCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getActiveFlashDeals } from "../../api/flashDealService";
import baseApi from "../../api/baseApi";
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
    <div className="flex items-center gap-1 font-mono font-black text-amber-500 text-xs">
      <Clock size={13} className="animate-pulse" />
      <span>
        {String(timeLeft.hours).padStart(2, "0")}:
        {String(timeLeft.minutes).padStart(2, "0")}:
        {String(timeLeft.seconds).padStart(2, "0")}
      </span>
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

  const handleAddToCart = async (productId) => {
    try {
      await baseApi.post("/cart/add", { productId, quantity: 1 });
      toast.success("Flash Deal product added to Cart!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add to cart");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 font-sans text-slate-900 dark:text-slate-100">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Main Flash Deals Header Banner */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-amber-500 via-orange-600 to-red-600 text-white shadow-2xl space-y-4 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 opacity-20 pointer-events-none">
            <Zap size={280} className="fill-white" />
          </div>

          <div className="space-y-2 max-w-2xl relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-widest text-white">
              <Flame size={14} className="fill-amber-300 text-amber-300" />{" "}
              Limited-Time Offers
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Exclusive Flash Deals 🔥
            </h1>
            <p className="text-sm sm:text-base text-amber-100 font-medium">
              Massive discounts on top products. Hurry, quantities are limited
              and prices revert when the timer runs out!
            </p>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="p-12 text-center text-xs font-bold text-slate-400">
            Loading Flash Deals...
          </div>
        ) : campaigns.length === 0 ? (
          <div className="p-16 text-center space-y-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <Zap
              size={40}
              className="mx-auto text-slate-300 dark:text-slate-700"
            />
            <h3 className="text-lg font-black text-slate-700 dark:text-slate-300">
              No Active Flash Deals Right Now
            </h3>
            <p className="text-xs text-slate-400">
              Check back soon for new limited-time promotions!
            </p>
          </div>
        ) : (
          campaigns.map((deal) => (
            <div key={deal._id} className="space-y-6">
              {/* Campaign Custom Banner Image (If Uploaded) */}
              {deal.bannerImage && (
                <div className="w-full h-48 sm:h-64 rounded-3xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800 relative">
                  <img
                    src={deal.bannerImage}
                    alt={deal.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-6">
                    <h2 className="text-2xl font-black text-white">{deal.title}</h2>
                  </div>
                </div>
              )}

              {/* Campaign Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 gap-2">
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Zap size={22} className="text-amber-500 fill-amber-500" />
                    {deal.title}
                  </h2>
                  {deal.description && (
                    <p className="text-xs text-slate-500 mt-0.5">
                      {deal.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 bg-amber-50 dark:bg-amber-950/80 px-4 py-2 rounded-2xl border border-amber-200 dark:border-amber-800">
                  <span className="text-xs font-bold text-amber-800 dark:text-amber-300">
                    Deal Ends In:
                  </span>
                  <CountdownTimer targetDate={deal.endDate} />
                </div>
              </div>

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
