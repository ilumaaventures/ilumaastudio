import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingBag, Clock, Star, Zap } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../../../redux/reducers/cartReducer";
import { toggleWishlist } from "../../../redux/reducers/wishlistReducer";
import { getActiveFlashDeals } from "../../../api/flashDealService";
import ProductCard from "../../../Components/ProductCard";

function FlashDeals() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wishlistItems = useSelector((s) => s.wishlist?.items || []);

  const [deals, setDeals] = useState([]);
  const [campaignEndDate, setCampaignEndDate] = useState(null);
  const [loading, setLoading] = useState(true);

  // Live Timer State (Counts down to closest campaign end date)
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
          // Find earliest ending active campaign
          const firstCampaign = activeCampaigns[0];
          setCampaignEndDate(firstCampaign.endDate);

          // Extract all products across active campaigns
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

  const handleToggleWishlist = (item, e) => {
    e.preventDefault();
    e.stopPropagation();
    const itemId = item._id || item.id;
    const isWished = wishlistItems.some(
      (i) => (i._id || i.id || i) === itemId || String(i) === String(itemId),
    );
    dispatch(toggleWishlist({ ...item, _id: itemId }));
    if (isWished) {
      toast.success("Removed from Wishlist");
    } else {
      toast.success("Added to Wishlist!");
    }
  };

  const handleAddToCart = (item, e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(
      addToCart({
        product: {
          _id: item._id,
          name: item.name,
          price: item.dealPrice || item.price,
          image: item.images?.[0] || item.image,
        },
        quantity: 1,
      }),
    );
    toast.success(`${item.name} added to cart!`);
  };

  const formatNumber = (num) => String(num).padStart(2, "0");

  // CRITICAL REQUIREMENT: Show ONLY when products are actually added to an active Flash Deal in backend!
  if (!loading && deals.length === 0) {
    return null;
  }

  if (loading) {
    return null;
  }

  return (
    <section className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-4">
      {/* Professional Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white p-4 sm:p-5 rounded-3xl shadow-lg border border-rose-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
            <Zap size={22} className="animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Flash Deals 🔥
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black uppercase tracking-wider animate-pulse">
                Live Now
              </span>
            </div>
            <p className="text-xs text-rose-200/80 font-medium">
              Limited-time promotional pricing on handpicked items. Ending soon!
            </p>
          </div>
        </div>

        {/* Live Countdown Timer */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-rose-500/30">
          <span className="text-[11px] font-bold text-rose-200 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Clock size={13} className="text-rose-400" /> Ends In:
          </span>
          <div className="flex items-center gap-1 text-xs font-black">
            <span className="bg-rose-500/30 border border-rose-400/40 px-2 py-1 rounded-lg min-w-[32px] text-center font-mono">
              {formatNumber(timeLeft.hours)}h
            </span>
            <span className="text-rose-300 font-bold">:</span>
            <span className="bg-rose-500/30 border border-rose-400/40 px-2 py-1 rounded-lg min-w-[32px] text-center font-mono">
              {formatNumber(timeLeft.minutes)}m
            </span>
            <span className="text-rose-300 font-bold">:</span>
            <span className="bg-rose-500 text-white px-2 py-1 rounded-lg min-w-[32px] text-center font-mono animate-pulse shadow-sm">
              {formatNumber(timeLeft.seconds)}s
            </span>
          </div>

          <Link
            to="/flash-deals"
            className="inline-flex items-center gap-1 text-xs font-extrabold text-rose-300 hover:text-white transition-colors shrink-0 ml-2"
          >
            <span>See All Deals</span>
            <span className="text-base">&rarr;</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {deals.map((item) => (
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
    </section>
  );
}

export default FlashDeals;
