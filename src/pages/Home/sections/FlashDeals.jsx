import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Clock,
  Zap,
  Flame,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { getActiveFlashDeals } from "../../../api/flashDealService";
import ProductCard from "../../../Components/ProductCard";

export default function FlashDeals() {
  const sliderRef = useRef(null);

  const [deals, setDeals] = useState([]);
  const [activeDealTitle, setActiveDealTitle] = useState("");
  const [campaignEndDate, setCampaignEndDate] = useState(null);
  const [loading, setLoading] = useState(true);

  // Live Timer State
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Calculate live countdown timer from backend campaignEndDate
  useEffect(() => {
    if (!campaignEndDate) return;

    const updateTimer = () => {
      const now = new Date().getTime();
      const targetTime = new Date(campaignEndDate).getTime();
      const diff = targetTime - now;

      if (diff > 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft({ hours, minutes, seconds });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [campaignEndDate]);

  // Fetch active flash deals exclusively from backend API
  useEffect(() => {
    let isMounted = true;

    const fetchDeals = async () => {
      try {
        setLoading(true);
        const campaigns = await getActiveFlashDeals();
        const activeCampaigns = Array.isArray(campaigns) ? campaigns : [];

        if (!isMounted) return;

        if (activeCampaigns.length > 0) {
          const firstCampaign = activeCampaigns[0];
          setCampaignEndDate(firstCampaign.endDate || null);
          setActiveDealTitle(firstCampaign.title || "Limited Time Flash Sale");

          const allProducts = [];
          for (const camp of activeCampaigns) {
            if (Array.isArray(camp.products)) {
              for (const p of camp.products) {
                if (p && (p._id || p.id)) {
                  allProducts.push({
                    ...p,
                    campaignTitle: camp.title,
                    campaignEndDate: camp.endDate,
                  });
                }
              }
            }
          }

          setDeals(allProducts);
        } else {
          setDeals([]);
          setCampaignEndDate(null);
          setActiveDealTitle("");
        }
      } catch (err) {
        console.error("Flash deals API fetch error:", err);
        if (isMounted) {
          setDeals([]);
          setCampaignEndDate(null);
          setActiveDealTitle("");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDeals();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleScrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -340, behavior: "smooth" });
    }
  };

  const handleScrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 340, behavior: "smooth" });
    }
  };

  const formatNumber = (num) => String(num).padStart(2, "0");

  // Maximum discount calculation across active backend deals
  const maxDiscount = useMemo(() => {
    if (!deals.length) return 0;
    return Math.max(...deals.map((d) => d.discountPercentage || 0));
  }, [deals]);

  // ONLY show this section when in flash deal have more than 0 product from backend
  if (loading || !deals || deals.length === 0) {
    return null;
  }

  return (
    <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto my-6 font-sans">
      {/* ============================================================
          MAIN EVENT CONTAINER WITH PRESTIGIOUS BORDER & FRAMING
      ============================================================ */}
      <div
        className="
          relative
          overflow-hidden
          rounded-[28px]
          sm:rounded-[32px]
          bg-white
          dark:bg-slate-900
          border
          border-slate-200/90
          dark:border-slate-800
          shadow-[0_16px_50px_rgba(15,23,42,0.06)]
          hover:shadow-[0_20px_60px_rgba(37,99,235,0.09)]
          transition-all
          duration-300
        "
      >
        {/* Top Energetic Lightning Stripe */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-rose-500 to-blue-600" />

        {/* Ambient Glow Effects */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-amber-400/10 blur-[80px]" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-rose-400/10 blur-[80px]" />

        {/* ============================================================
            ORGANIZED COMMAND HEADER (TIMER + BADGES + CONTROLS)
        ============================================================ */}
        <div className="px-5 py-5 sm:px-8 sm:py-6 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            {/* Left Header Info */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span
                  className="
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-full
                    bg-rose-500/10
                    dark:bg-rose-950/40
                    border
                    border-rose-200
                    dark:border-rose-800/60
                    px-3
                    py-1
                    text-[10px]
                    sm:text-[11px]
                    font-extrabold
                    uppercase
                    tracking-wider
                    text-rose-600
                    dark:text-rose-400
                  "
                >
                  <Flame size={12} className="fill-rose-500 text-rose-500 animate-pulse" />
                  <span>FLASH DEAL OF THE HOUR</span>
                </span>

                {maxDiscount > 0 && (
                  <span
                    className="
                      inline-flex
                      items-center
                      gap-1
                      rounded-full
                      bg-amber-50
                      dark:bg-amber-950/30
                      border
                      border-amber-200/80
                      dark:border-amber-800/50
                      px-2.5
                      py-0.5
                      text-[10px]
                      font-bold
                      text-amber-700
                      dark:text-amber-400
                    "
                  >
                    <Zap size={11} className="fill-amber-500 text-amber-500" />
                    <span>UP TO {maxDiscount}% OFF</span>
                  </span>
                )}
              </div>

              <div className="flex items-baseline gap-3 flex-wrap">
                <h2 className="text-xl sm:text-2xl lg:text-[26px] font-black text-slate-900 dark:text-white tracking-tight">
                  {activeDealTitle || "Lightning Deals & Steals"}
                </h2>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 hidden sm:inline">
                  Prices increase when countdown finishes
                </span>
              </div>
            </div>

            {/* Right Header: Countdown Timer & Controls */}
            <div className="flex items-center justify-between lg:justify-end gap-3 flex-wrap">
              {/* Digit Flip Box Timer (Only when campaignEndDate exists) */}
              {campaignEndDate && (
                <div
                  className="
                    flex
                    items-center
                    gap-2
                    bg-slate-900
                    dark:bg-slate-950
                    text-white
                    px-3.5
                    py-2
                    rounded-2xl
                    border
                    border-slate-800
                    shadow-inner
                  "
                >
                  <div className="flex items-center gap-1.5 pr-2 border-r border-slate-700/80">
                    <Clock size={14} className="text-amber-400 animate-pulse" />
                    <span className="text-[10px] font-black tracking-widest uppercase text-slate-300">
                      ENDS IN
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 font-mono text-xs font-black">
                    {/* Hours */}
                    <div className="flex flex-col items-center">
                      <span className="bg-slate-800 px-2 py-0.5 rounded-md min-w-[28px] text-center text-amber-300">
                        {formatNumber(timeLeft.hours)}
                      </span>
                      <span className="text-[8px] text-slate-400 font-sans mt-0.5">HRS</span>
                    </div>

                    <span className="text-amber-400 font-bold -mt-2.5">:</span>

                    {/* Minutes */}
                    <div className="flex flex-col items-center">
                      <span className="bg-slate-800 px-2 py-0.5 rounded-md min-w-[28px] text-center text-amber-300">
                        {formatNumber(timeLeft.minutes)}
                      </span>
                      <span className="text-[8px] text-slate-400 font-sans mt-0.5">MIN</span>
                    </div>

                    <span className="text-amber-400 font-bold -mt-2.5">:</span>

                    {/* Seconds */}
                    <div className="flex flex-col items-center">
                      <span className="bg-rose-600 px-2 py-0.5 rounded-md min-w-[28px] text-center text-white shadow-sm animate-[pulse_1.5s_infinite]">
                        {formatNumber(timeLeft.seconds)}
                      </span>
                      <span className="text-[8px] text-rose-300 font-sans mt-0.5 font-bold">SEC</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Slider Arrows & See All CTA */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleScrollLeft}
                  className="
                    w-9
                    h-9
                    rounded-xl
                    bg-white
                    dark:bg-slate-800
                    hover:bg-slate-100
                    dark:hover:bg-slate-700
                    border
                    border-slate-200
                    dark:border-slate-700
                    text-slate-700
                    dark:text-slate-200
                    flex
                    items-center
                    justify-center
                    transition-all
                    active:scale-95
                    shadow-sm
                    cursor-pointer
                  "
                  title="Scroll Left"
                  aria-label="Scroll Flash Deals Left"
                >
                  <ChevronLeft size={18} />
                </button>

                <button
                  type="button"
                  onClick={handleScrollRight}
                  className="
                    w-9
                    h-9
                    rounded-xl
                    bg-white
                    dark:bg-slate-800
                    hover:bg-slate-100
                    dark:hover:bg-slate-700
                    border
                    border-slate-200
                    dark:border-slate-700
                    text-slate-700
                    dark:text-slate-200
                    flex
                    items-center
                    justify-center
                    transition-all
                    active:scale-95
                    shadow-sm
                    cursor-pointer
                  "
                  title="Scroll Right"
                  aria-label="Scroll Flash Deals Right"
                >
                  <ChevronRight size={18} />
                </button>

                <Link
                  to="/flash-deals"
                  className="
                    inline-flex
                    items-center
                    gap-1.5
                    px-3.5
                    py-2
                    rounded-xl
                    text-xs
                    font-extrabold
                    text-blue-600
                    dark:text-blue-400
                    bg-blue-50
                    dark:bg-blue-950/40
                    border
                    border-blue-200/80
                    dark:border-blue-800
                    hover:bg-blue-600
                    hover:text-white
                    transition-all
                    duration-200
                    shrink-0
                    group
                  "
                >
                  <span>See All</span>
                  <ArrowRight
                    size={13}
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================
            HORIZONTAL DEAL SHELF USING STANDARD PRODUCTCARD UI
            (Exclusively maps backend active flash deal products)
        ============================================================ */}
        <div className="p-4 sm:p-6 lg:p-7">
          <div
            ref={sliderRef}
            className="
              flex
              gap-4
              sm:gap-5
              overflow-x-auto
              scroll-smooth
              snap-x
              snap-mandatory
              pb-3
              pt-1
              [scrollbar-width:none]
              [-ms-overflow-style:none]
              [&::-webkit-scrollbar]:hidden
            "
          >
            {deals.map((item, idx) => {
              const prodId = item._id || item.id || `deal-${idx}`;
              const dealPrice = Number(item.dealPrice || item.price || 0);
              const originalPrice = Number(
                item.originalPrice || (dealPrice > 0 ? Math.round(dealPrice * 1.5) : dealPrice)
              );
              const discount =
                item.discountPercentage !== undefined && item.discountPercentage !== null
                  ? Number(item.discountPercentage)
                  : originalPrice > dealPrice
                  ? Math.round(((originalPrice - dealPrice) / originalPrice) * 100)
                  : 0;

              const isItemInStock =
                item.remainingQuantity !== undefined
                  ? item.remainingQuantity > 0
                  : item.inStock !== undefined
                  ? Boolean(item.inStock)
                  : true;

              const formattedProduct = {
                ...item,
                _id: prodId,
                id: prodId,
                name: item.name || "Flash Deal Product",
                price: dealPrice,
                originalPrice: originalPrice > dealPrice ? originalPrice : null,
                discountPercent: discount,
                badge: discount > 0 ? `${discount}% OFF` : undefined,
                inStock: isItemInStock,
                images: item.images,
                category: item.category,
                business: item.business || { businessName: "Verified Store" },
              };

              return (
                <ProductCard
                  key={prodId}
                  product={formattedProduct}
                  isCarousel={true}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
