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
  Globe,
} from "lucide-react";
import { Link } from "react-router-dom";
import baseApi from "../../api/baseApi";
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
  const [marketingBanners, setMarketingBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDealsAndBanners = async () => {
      try {
        setLoading(true);
        const [dealsRes, bannersRes] = await Promise.all([
          getActiveFlashDeals().catch(() => []),
          baseApi.get("/marketing/public/banners?includeGlobal=true").catch(() => ({ data: [] })),
        ]);

        const dealList = Array.isArray(dealsRes) ? dealsRes : [];
        const bannerList = Array.isArray(bannersRes.data)
          ? bannersRes.data
          : bannersRes.data?.banners || [];

        setCampaigns(dealList);
        setMarketingBanners(bannerList);
      } catch (err) {
        console.error("Error fetching Flash Deals & Banners:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDealsAndBanners();
  }, []);

  // Filter flashSale active banners from DB
  const flashSaleBanners = marketingBanners.filter(
    (b) => b.type === "flashSale" || b.type === "hero" || b.isActive
  );
  const activeHeaderBanner = flashSaleBanners.length > 0 ? flashSaleBanners[0] : null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 font-sans text-slate-900 dark:text-slate-100">
      <div className="max-w-7xl mx-auto space-y-8 text-left">
        
        {/* Dynamic Flash Deals Header Banner (reads from DB banner) */}
        <div
          className="p-8 sm:p-12 rounded-3xl text-white shadow-2xl space-y-4 relative overflow-hidden border border-rose-500/20 transition-all duration-300"
          style={{
            background: activeHeaderBanner?.image
              ? `linear-gradient(to right, rgba(15, 23, 42, 0.95), rgba(30, 27, 75, 0.85)), url(${activeHeaderBanner.image}) center/cover`
              : `linear-gradient(135deg, #0F172A 0%, #4C0519 50%, #0F172A 100%)`,
          }}
        >
          <div className="absolute -right-10 -bottom-10 opacity-15 pointer-events-none">
            <Zap size={300} className="fill-rose-500 text-rose-500" />
          </div>

          <div className="space-y-3 max-w-2xl relative z-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-500/30 border border-rose-400/40 rounded-full text-xs font-black uppercase tracking-widest text-rose-200 backdrop-blur-md">
                <Flame size={14} className="fill-amber-400 text-amber-400" />
                Live Global Platform Flash Deals
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white">
              {activeHeaderBanner?.title || "Flash Sale Events & Banners 🔥"}
            </h1>

            <p className="text-sm sm:text-base text-rose-100/95 font-semibold leading-relaxed">
              {activeHeaderBanner?.description ||
                "Unlock limited-time promotional discounts according to featured campaign banners. Prices revert to original when countdown timers expire!"}
            </p>

            {activeHeaderBanner && (
              <div className="pt-3 flex items-center gap-3">
                <Link
                  to={activeHeaderBanner.targetUrl || "/shop"}
                  className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs px-6 py-3 rounded-2xl shadow-lg transition"
                >
                  <span>{activeHeaderBanner.buttonText || "SHOP NOW"}</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Global Platform Campaign Banners Showcase Grid */}
        {flashSaleBanners.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                <Globe size={18} className="text-rose-600" />
                <span>Featured Campaign Banners ({flashSaleBanners.length})</span>
              </h2>
              <span className="text-xs font-bold text-slate-500">
                DB Promotional Flash Sale Banners
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {flashSaleBanners.map((banner, idx) => (
                <div
                  key={banner._id || idx}
                  className="group relative rounded-3xl overflow-hidden border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs hover:shadow-xl transition-all p-6 flex flex-col justify-between min-h-[220px]"
                  style={{
                    background: banner.image || banner.imageUrl
                      ? `linear-gradient(to top, rgba(15,23,42,0.92), rgba(15,23,42,0.5)), url(${banner.image || banner.imageUrl}) center/cover`
                      : `linear-gradient(135deg, #0F172A 0%, #1E3A8A 100%)`,
                  }}
                >
                  <div className="space-y-2 text-white z-10">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-600 text-white shadow-2xs">
                        {banner.type === "flashSale" ? "Flash Sale Banner" : "Featured Campaign"}
                      </span>
                      {banner.businessCategory && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white font-mono">
                          {banner.businessCategory}
                        </span>
                      )}
                    </div>

                    <h3 className="text-2xl font-black text-white leading-tight">
                      {banner.title || "Global Mega Sale"}
                    </h3>
                    
                    {banner.subtitle && (
                      <p className="text-xs text-amber-300 font-bold">{banner.subtitle}</p>
                    )}

                    <p className="text-xs text-slate-200 font-medium leading-relaxed max-w-md line-clamp-2">
                      {banner.description || "Limited period flash deal offer available across ILumaa platform stores."}
                    </p>
                  </div>

                  <div className="pt-6 flex items-center justify-between z-10 border-t border-white/10 mt-4">
                    {banner.code ? (
                      <span className="font-mono font-black text-xs text-amber-300 bg-black/50 px-3 py-1 rounded-xl">
                        CODE: {banner.code}
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-white/80">Limited Time Offer</span>
                    )}

                    <Link
                      to={banner.targetUrl || "/shop"}
                      className="px-4 py-2 rounded-xl text-xs font-black bg-white text-slate-900 hover:bg-slate-100 transition shadow-2xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>{banner.buttonText || "SHOP NOW"}</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Live Flash Deals Content Section */}
        {loading ? (
          <div className="py-20 text-center space-y-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
            <Zap size={36} className="animate-bounce text-rose-600 mx-auto" />
            <p className="text-sm font-extrabold text-slate-700 dark:text-slate-300">
              Loading Live Flash Deals & Banners...
            </p>
          </div>
        ) : campaigns.length === 0 && flashSaleBanners.length === 0 ? (
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
                to="/shop"
                className="inline-flex items-center gap-2 bg-[#004ac6] hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-xs font-black transition shadow-md"
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
                      <span>Flash Sale Event</span>
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

              {/* Custom Campaign Banner Display */}
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
