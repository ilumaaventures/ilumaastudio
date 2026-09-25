import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Clock,
  Zap,
  Flame,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Heart,
  ShoppingCart,
  Star,
  ShieldCheck,
  Check,
  Sparkles,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../../../redux/reducers/cartReducer";
import { toggleWishlist } from "../../../redux/reducers/wishlistReducer";
import { getActiveFlashDeals } from "../../../api/flashDealService";
import toast from "react-hot-toast";

// ============================================================
// CURATED FALLBACK DEALS (WHEN DB HAS NO ACTIVE SCHEDULED CAMPAIGN)
// ============================================================
const FALLBACK_FLASH_DEALS = [
  {
    _id: "flash_curated_1",
    name: "Wireless Active Noise-Cancelling Headphones Pro",
    category: { name: "Electronics & Audio" },
    originalPrice: 4999,
    dealPrice: 2299,
    savings: 2700,
    discountPercentage: 54,
    dealQuantity: 50,
    soldQuantity: 38,
    remainingQuantity: 12,
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
    ],
    rating: 4.8,
    reviewsCount: 342,
  },
  {
    _id: "flash_curated_2",
    name: "Minimalist Chronograph Luxury Steel Watch",
    category: { name: "Accessories & Watches" },
    originalPrice: 3499,
    dealPrice: 1699,
    savings: 1800,
    discountPercentage: 51,
    dealQuantity: 40,
    soldQuantity: 31,
    remainingQuantity: 9,
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
    ],
    rating: 4.9,
    reviewsCount: 218,
  },
  {
    _id: "flash_curated_3",
    name: "Smart Ambient Mood Light & Wireless Fast Charger",
    category: { name: "Home & Lifestyle" },
    originalPrice: 2499,
    dealPrice: 1199,
    savings: 1300,
    discountPercentage: 52,
    dealQuantity: 60,
    soldQuantity: 49,
    remainingQuantity: 11,
    images: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80",
    ],
    rating: 4.7,
    reviewsCount: 189,
  },
  {
    _id: "flash_curated_4",
    name: "Premium Handcrafted Artisan Ceramic Coffee Mug Set",
    category: { name: "Kitchen & Dining" },
    originalPrice: 1899,
    dealPrice: 899,
    savings: 1000,
    discountPercentage: 53,
    dealQuantity: 35,
    soldQuantity: 28,
    remainingQuantity: 7,
    images: [
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80",
    ],
    rating: 4.8,
    reviewsCount: 156,
  },
  {
    _id: "flash_curated_5",
    name: "Ergonomic Memory Foam Travel & Office Lumbar Support",
    category: { name: "Health & Comfort" },
    originalPrice: 2199,
    dealPrice: 999,
    savings: 1200,
    discountPercentage: 55,
    dealQuantity: 45,
    soldQuantity: 36,
    remainingQuantity: 9,
    images: [
      "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80",
    ],
    rating: 4.6,
    reviewsCount: 94,
  },
  {
    _id: "flash_curated_6",
    name: "Ultra-Fast Compact 65W GaN Travel Charger Hub",
    category: { name: "Tech Accessories" },
    originalPrice: 2999,
    dealPrice: 1399,
    savings: 1600,
    discountPercentage: 53,
    dealQuantity: 70,
    soldQuantity: 58,
    remainingQuantity: 12,
    images: [
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=600&q=80",
    ],
    rating: 4.9,
    reviewsCount: 412,
  },
];

export default function FlashDeals() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sliderRef = useRef(null);

  const wishlistItems = useSelector((s) => s.wishlist?.items || []);
  const cartItems = useSelector(
    (s) => s.cart?.cartItems || s.cart?.items || [],
  );

  const [deals, setDeals] = useState([]);
  const [activeDealTitle, setActiveDealTitle] = useState("");
  const [campaignEndDate, setCampaignEndDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addedItems, setAddedItems] = useState({});

  // Live Timer State
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 48,
    seconds: 15,
  });

  // Calculate live countdown timer
  useEffect(() => {
    // If no campaign end date from API, create a rolling 8-hour target
    let targetTime = campaignEndDate
      ? new Date(campaignEndDate).getTime()
      : null;

    if (!targetTime) {
      const now = new Date();
      now.setHours(now.getHours() + 4);
      now.setMinutes(45);
      targetTime = now.getTime();
    }

    const updateTimer = () => {
      const now = new Date().getTime();
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

  // Fetch active flash deals from backend API
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
          setCampaignEndDate(firstCampaign.endDate);
          setActiveDealTitle(firstCampaign.title || "Limited Time Flash Sale");

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

          if (allProducts.length > 0) {
            setDeals(allProducts);
            return;
          }
        }

        // If backend returns empty campaigns, use the curated e-commerce deals
        setDeals(FALLBACK_FLASH_DEALS);
        setActiveDealTitle("Lightning Drops & Steals");
      } catch (err) {
        console.warn(
          "Flash deals API fetch error, using curated fallback:",
          err,
        );
        if (isMounted) {
          setDeals(FALLBACK_FLASH_DEALS);
          setActiveDealTitle("Lightning Drops & Steals");
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

  // Maximum discount calculation across active deals
  const maxDiscount = useMemo(() => {
    if (!deals.length) return 60;
    return Math.max(...deals.map((d) => d.discountPercentage || 50));
  }, [deals]);

  // Handle 1-Click Add to Cart
  const handleQuickAddToCart = (e, item) => {
    e.preventDefault();
    e.stopPropagation();

    const prodId = item._id || item.id;
    const prodName = item.name || "Product";
    const prodPrice = item.dealPrice || item.price || 0;
    const prodImg =
      item.images?.[0]?.url ||
      item.images?.[0] ||
      item.image?.url ||
      item.image ||
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80";

    dispatch(
      addToCart({
        _id: prodId,
        id: prodId,
        name: prodName,
        price: Number(prodPrice),
        originalPrice: Number(item.originalPrice || prodPrice),
        category:
          typeof item.category === "object"
            ? item.category?.name
            : item.category || "General",
        image: typeof prodImg === "object" ? prodImg.url : prodImg,
        quantity: 1,
        stock: item.remainingQuantity || item.dealQuantity || 20,
      }),
    );

    // Set brief added state
    setAddedItems((prev) => ({ ...prev, [prodId]: true }));
    toast.success(`${prodName} added to cart at flash price!`, {
      icon: "⚡",
    });

    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [prodId]: false }));
    }, 2000);
  };

  // Handle Wishlist Toggle
  const handleToggleWishlist = (e, item) => {
    e.preventDefault();
    e.stopPropagation();

    const prodId = item._id || item.id;
    const isWished = wishlistItems.some((i) => {
      const itemId = i && typeof i === "object" ? i._id || i.id : i;
      return String(itemId) === String(prodId);
    });

    const prodImg =
      item.images?.[0]?.url ||
      item.images?.[0] ||
      item.image?.url ||
      item.image ||
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80";

    dispatch(
      toggleWishlist({
        _id: prodId,
        id: prodId,
        name: item.name,
        price: item.dealPrice || item.price,
        originalPrice: item.originalPrice,
        image: typeof prodImg === "object" ? prodImg.url : prodImg,
        category:
          typeof item.category === "object"
            ? item.category?.name
            : item.category || "General",
        rating: item.rating || 4.8,
        inStock: true,
      }),
    );

    if (isWished) {
      toast.success("Removed from Wishlist");
    } else {
      toast.success("Added to Wishlist! ❤️");
    }
  };

  if (loading) {
    return (
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto my-6">
        <div className="h-80 w-full rounded-3xl bg-slate-100 animate-pulse border border-slate-200" />
      </section>
    );
  }

  return (
    <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto my-6 font-sans">
      {/* ============================================================
          MAIN EVENT CONTAINER WITH PRESTIGIOUS BORDER & FRAMING
          (Amazon / Flipkart / Blinkit / Zepto inspired architecture)
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
                  <Flame
                    size={12}
                    className="fill-rose-500 text-rose-500 animate-pulse"
                  />
                  <span>FLASH DEAL OF THE HOUR</span>
                </span>

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
              {/* Amazon / Zepto Style Digit Flip Box Timer */}
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
                    <span className="text-[8px] text-slate-400 font-sans mt-0.5">
                      HRS
                    </span>
                  </div>

                  <span className="text-amber-400 font-bold -mt-2.5">:</span>

                  {/* Minutes */}
                  <div className="flex flex-col items-center">
                    <span className="bg-slate-800 px-2 py-0.5 rounded-md min-w-[28px] text-center text-amber-300">
                      {formatNumber(timeLeft.minutes)}
                    </span>
                    <span className="text-[8px] text-slate-400 font-sans mt-0.5">
                      MIN
                    </span>
                  </div>

                  <span className="text-amber-400 font-bold -mt-2.5">:</span>

                  {/* Seconds */}
                  <div className="flex flex-col items-center">
                    <span className="bg-rose-600 px-2 py-0.5 rounded-md min-w-[28px] text-center text-white shadow-sm animate-[pulse_1.5s_infinite]">
                      {formatNumber(timeLeft.seconds)}
                    </span>
                    <span className="text-[8px] text-rose-300 font-sans mt-0.5 font-bold">
                      SEC
                    </span>
                  </div>
                </div>
              </div>

              {/* Slider Arrows & See All CTA */}
              <div className="flex items-center gap-2">
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
            HORIZONTAL DEAL SHELF WITH ANCHOR SPOTLIGHT CARD
            (Flipkart Super Deals & Blinkit Crazy Deals representation)
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
              scrollbar-none
            "
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {/* ----------------------------------------------------
                DYNAMIC PRODUCT DEAL CARDS (AMAZON & ZEPTO FORMAT)
            ---------------------------------------------------- */}
            {deals.map((item, idx) => {
              const prodId = item._id || item.id || `deal-${idx}`;
              const prodName = item.name || "Special Flash Deal Item";
              const dealPrice = Number(item.dealPrice || item.price || 0);
              const originalPrice = Number(
                item.originalPrice || dealPrice * 1.6,
              );
              const discount =
                item.discountPercentage ||
                (originalPrice > 0
                  ? Math.round(
                      ((originalPrice - dealPrice) / originalPrice) * 100,
                    )
                  : 40);
              const savings = Math.max(0, originalPrice - dealPrice);

              const prodImage =
                item.images?.[0]?.url ||
                (typeof item.images?.[0] === "string"
                  ? item.images[0]
                  : null) ||
                item.image?.url ||
                item.image ||
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80";

              const categoryTitle =
                typeof item.category === "object"
                  ? item.category?.name || "Marketplace"
                  : item.category || "Marketplace";

              const isWished = wishlistItems.some((w) => {
                const wid = w && typeof w === "object" ? w._id || w.id : w;
                return String(wid) === String(prodId);
              });

              const isInCart = cartItems.some((c) => {
                const cid =
                  c && typeof c === "object"
                    ? c._id || c.id || c.product?._id || c.product
                    : c;
                return String(cid) === String(prodId);
              });

              // Zepto & Amazon Stock Claimed Meter Simulation
              const totalQty = item.dealQuantity || 40;
              const soldQty = item.soldQuantity || Math.round(totalQty * 0.72);
              const claimedPercent = Math.min(
                95,
                Math.max(40, Math.round((soldQty / totalQty) * 100)),
              );
              const remainingQty = Math.max(2, totalQty - soldQty);

              return (
                <div
                  key={prodId}
                  onClick={() => navigate(`/product/${prodId}`)}
                  className="
                    w-[230px]
                    sm:w-[250px]
                    md:w-[260px]
                    shrink-0
                    snap-start
                    rounded-2xl
                    border
                    border-slate-200/90
                    dark:border-slate-800
                    bg-white
                    dark:bg-slate-900
                    overflow-hidden
                    shadow-sm
                    hover:shadow-xl
                    hover:border-blue-400
                    dark:hover:border-blue-700
                    transition-all
                    duration-300
                    group
                    hover:-translate-y-1.5
                    flex
                    flex-col
                    justify-between
                    cursor-pointer
                  "
                >
                  {/* Top Image Stage & Overlays */}
                  <div className="relative aspect-square w-full bg-slate-50 dark:bg-slate-800/50 overflow-hidden flex items-center justify-center p-3">
                    {/* Discount Badge (Amazon / Zepto style) */}
                    <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1">
                      <span
                        className="
                          inline-flex
                          items-center
                          gap-1
                          rounded-lg
                          bg-rose-600
                          text-white
                          px-2
                          py-1
                          text-[10px]
                          font-black
                          tracking-wider
                          shadow-sm
                        "
                      >
                        <Flame size={10} className="fill-white" />
                        <span>{discount}% OFF</span>
                      </span>

                      {claimedPercent >= 75 && (
                        <span className="inline-block rounded-md bg-amber-500 text-slate-950 font-black text-[9px] px-1.5 py-0.5 tracking-tight shadow-sm">
                          ALMOST GONE
                        </span>
                      )}
                    </div>

                    {/* Wishlist Button */}
                    <button
                      type="button"
                      onClick={(e) => handleToggleWishlist(e, item)}
                      aria-label="Add to Wishlist"
                      className={`
                        absolute
                        top-2.5
                        right-2.5
                        z-10
                        h-8
                        w-8
                        rounded-full
                        flex
                        items-center
                        justify-center
                        shadow-sm
                        backdrop-blur-sm
                        transition-all
                        duration-200
                        ${
                          isWished
                            ? "bg-rose-50 text-rose-600"
                            : "bg-white/90 dark:bg-slate-800/90 text-slate-500 hover:text-rose-500 hover:scale-105"
                        }
                      `}
                    >
                      <Heart
                        size={15}
                        className={
                          isWished ? "fill-rose-500 text-rose-500" : ""
                        }
                      />
                    </button>

                    {/* Main Image */}
                    <img
                      src={prodImage}
                      alt={prodName}
                      loading="lazy"
                      className="
                        h-full
                        w-full
                        object-contain
                        transition-transform
                        duration-500
                        ease-out
                        group-hover:scale-105
                      "
                    />
                  </div>

                  {/* Card Content */}
                  <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between gap-3">
                    <div className="space-y-1.5">
                      {/* Category & Rating */}
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span className="font-semibold uppercase tracking-wider text-[10px] text-blue-600 dark:text-blue-400 line-clamp-1">
                          {categoryTitle}
                        </span>
                        <div className="flex items-center gap-1 font-bold text-slate-700 dark:text-slate-300">
                          <Star
                            size={11}
                            className="fill-amber-400 text-amber-400"
                          />
                          <span>{item.rating || 4.8}</span>
                        </div>
                      </div>

                      {/* Product Name */}
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {prodName}
                      </h4>

                      {/* Pricing Row */}
                      <div className="pt-1 flex items-baseline gap-2">
                        <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                          ₹{dealPrice.toLocaleString()}
                        </span>
                        {originalPrice > dealPrice && (
                          <span className="text-xs text-slate-400 line-through">
                            ₹{originalPrice.toLocaleString()}
                          </span>
                        )}
                        {savings > 0 && (
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">
                            Save ₹{savings.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Bottom Action & Stock Claimed Meter (Amazon & Zepto signature) */}
                    <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                      {/* Claimed Progress Meter */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-bold">
                          <span className="text-rose-600 dark:text-rose-400">
                            {claimedPercent}% Claimed
                          </span>
                          <span className="text-slate-400">
                            {remainingQty} left
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-amber-500 to-rose-600 transition-all duration-500"
                            style={{ width: `${claimedPercent}%` }}
                          />
                        </div>
                      </div>

                      {/* 1-Click Quick Add Button */}
                      <button
                        type="button"
                        onClick={(e) => handleQuickAddToCart(e, item)}
                        className={`
                          w-full
                          py-2
                          px-3
                          rounded-xl
                          text-xs
                          font-extrabold
                          flex
                          items-center
                          justify-center
                          gap-1.5
                          transition-all
                          duration-200
                          shadow-xs
                          active:scale-95
                          cursor-pointer
                          ${
                            addedItems[prodId]
                              ? "bg-emerald-600 text-white"
                              : isInCart
                                ? "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200"
                                : "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-md hover:-translate-y-0.5"
                          }
                        `}
                      >
                        {addedItems[prodId] ? (
                          <>
                            <Check size={14} className="text-white" />
                            <span>Claimed & Added!</span>
                          </>
                        ) : isInCart ? (
                          <>
                            <ShoppingCart size={13} />
                            <span>In Cart • Add More</span>
                          </>
                        ) : (
                          <>
                            <Zap size={13} className="fill-white" />
                            <span>Claim Deal</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
