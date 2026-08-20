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
import toast from "react-hot-toast";
import { getActiveFlashDeals } from "../../api/flashDealService";
import baseApi from "../../api/baseApi";

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
                {deal.products.map((item) => {
                  const imageSrc =
                    typeof item.images?.[0] === "string"
                      ? item.images[0]
                      : item.images?.[0]?.url || item.image || "/placeholder.png";

                  return (
                    <div
                      key={item._id}
                      className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                    >
                      <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800">
                        <img
                          src={imageSrc}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute top-3 left-3 px-2.5 py-1 bg-red-600 text-white font-black text-[10px] uppercase tracking-wider rounded-xl shadow-md">
                          {item.discountPercentage}% OFF
                        </span>
                      </div>

                      <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-black uppercase text-[#2563eb] tracking-wider">
                            {item.category?.name || "Flash Sale"}
                          </span>
                          <Link
                            to={`/products/${item._id}`}
                            className="font-extrabold text-sm text-slate-900 dark:text-white hover:text-[#2563eb] line-clamp-2 block leading-snug"
                          >
                            {item.name}
                          </Link>
                        </div>

                        <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                          <div className="flex items-baseline justify-between">
                            <div className="space-x-2">
                              <span className="text-xl font-black text-emerald-600">
                                ₹{item.dealPrice}
                              </span>
                              <span className="text-xs text-slate-400 line-through font-semibold">
                                ₹{item.originalPrice}
                              </span>
                            </div>
                            <span className="text-[10px] font-bold text-amber-600">
                              Only {item.remainingQuantity} left
                            </span>
                          </div>

                          <button
                            onClick={() => handleAddToCart(item._id)}
                            className="w-full py-2.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-black rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-blue-500/20"
                          >
                            <ShoppingCart size={15} />
                            <span>Add to Cart</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
