import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Clock,
  Zap,
  Flame,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../../../redux/reducers/cartReducer";
import { toggleWishlist } from "../../../redux/reducers/wishlistReducer";
import { getActiveFlashDeals } from "../../../api/flashDealService";
import ProductCard from "../../../Components/ProductCard";

function FlashDeals() {
  const dispatch = useDispatch();
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

  useEffect(() => {
    if (!campaignEndDate) return;

    const updateTimer = () => {
      const now = new Date();
      const end = new Date(campaignEndDate);
      const diff = end.getTime() - now.getTime();

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

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setLoading(true);
        const campaigns = await getActiveFlashDeals();
        const activeCampaigns = Array.isArray(campaigns) ? campaigns : [];

        if (activeCampaigns.length > 0) {
          const firstCampaign = activeCampaigns[0];
          setCampaignEndDate(firstCampaign.endDate);
          setActiveDealTitle(firstCampaign.title || "Limited Time Deal");

          const allProducts = [];
          for (const camp of activeCampaigns) {
            if (Array.isArray(camp.products)) {
              for (const p of camp.products) {
                allProducts.push({
                  ...p,
                  campaignTitle: camp.title,
                  campaignEndDate: camp.endDate,
                });
              }
            }
          }

          setDeals(allProducts);
        } else {
          setDeals([]);
        }
      } catch (err) {
        console.error("Flash deals API fetch error:", err);
        setDeals([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDeals();
  }, []);

  const handleScrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -320, behavior: "smooth" });
    }
  };

  const handleScrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 320, behavior: "smooth" });
    }
  };

  const formatNumber = (num) => String(num).padStart(2, "0");

  if (!loading && deals.length === 0) {
    return null;
  }

  if (loading) {
    return null;
  }

  return (
    <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-4">
      {/* Professional Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white p-5 sm:p-6 rounded-3xl shadow-xl border border-rose-500/20 relative overflow-hidden">
        {/* Left Side: Title, Deal Name Badge & Subtitle */}
        <div className="flex items-center gap-3.5 z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Active Deal Name Badge */}
              {activeDealTitle && (
                <>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    <span>Deal: {activeDealTitle}</span>
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black uppercase tracking-wider animate-pulse">
                    Live Now
                  </span>
                </>
              )}
            </div>

            <p className="text-xs text-rose-200/80 font-medium">
              Limited-time promotional pricing on handpicked items. Ending soon!
            </p>
          </div>
        </div>

        {/* Right Side: Timer & Slider Controls */}
        <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0 border-rose-500/30 z-10">
          {/* Live Timer */}
          <div className="flex items-center gap-1.5 bg-black/40 border border-rose-500/30 px-3 py-1.5 rounded-2xl">
            <Clock size={14} className="text-rose-400 animate-pulse shrink-0" />
            <span className="text-[10px] font-black text-rose-200 uppercase tracking-wider shrink-0 mr-1">
              Ends In:
            </span>
            <div className="flex items-center gap-1 text-xs font-black">
              <span className="bg-rose-500/40 px-2 py-0.5 rounded-lg min-w-[30px] text-center font-mono">
                {formatNumber(timeLeft.hours)}h
              </span>
              <span className="text-rose-400 font-bold">:</span>
              <span className="bg-rose-500/40 px-2 py-0.5 rounded-lg min-w-[30px] text-center font-mono">
                {formatNumber(timeLeft.minutes)}m
              </span>
              <span className="text-rose-400 font-bold">:</span>
              <span className="bg-rose-500 text-white px-2 py-0.5 rounded-lg min-w-[30px] text-center font-mono shadow-sm">
                {formatNumber(timeLeft.seconds)}s
              </span>
            </div>
          </div>

          {/* Left & Right Slider Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleScrollLeft}
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition active:scale-95 cursor-pointer"
              title="Scroll Left"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={handleScrollRight}
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition active:scale-95 cursor-pointer"
              title="Scroll Right"
            >
              <ChevronRight size={18} />
            </button>

            <Link
              to="/flash-deals"
              className="hidden sm:inline-flex items-center gap-1 text-xs font-extrabold text-rose-300 hover:text-white transition-colors ml-1 shrink-0"
            >
              <span>See All</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* Horizontal Left-to-Right Scrollable Products Container */}
      <div
        ref={sliderRef}
        className="flex gap-1 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-none py-2 px-1"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {deals.map((item) => (
          <div key={item._id} className=" snap-start shrink-0 mx-2">
            <ProductCard
              product={{
                ...item,
                price: item.dealPrice || item.price,
                originalPrice: item.originalPrice,
                badge: `${item.discountPercentage}% OFF`,
              }}
              isCarousel={true}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export default FlashDeals;
