import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  Flame,
  Tag,
  Copy,
  Check,
  ArrowRight,
  Clock,
  Gift,
  ShieldCheck,
  Percent,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import toast from "react-hot-toast";
import { getPublicOffers, getPublicCoupons } from "../../../api/offerService";

export default function PromotionalShowcase() {
  const navigate = useNavigate();
  const [offers, setOffers] = useState([]);
  const [activeOfferIndex, setActiveOfferIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(null);

  // Live Countdown State
  const [timeLeft, setTimeLeft] = useState({
    hours: 8,
    minutes: 45,
    seconds: 30,
  });

  useEffect(() => {
    let isMounted = true;
    const fetchOffers = async () => {
      try {
        setLoading(true);
        const [offersRes, couponsRes] = await Promise.all([
          getPublicOffers({ platform: "E-Commerce" }).catch(() => []),
          getPublicCoupons().catch(() => []),
        ]);

        const offerList = Array.isArray(offersRes)
          ? offersRes
          : offersRes?.offers || offersRes?.data || [];
        const couponList = Array.isArray(couponsRes)
          ? couponsRes
          : couponsRes?.coupons || couponsRes?.data || [];

        // Build enriched real offers list
        const realOffers = offerList.map((o) => {
          // Match associated coupon if available
          const linkedCoupon =
            o.associatedCoupon ||
            couponList.find(
              (c) =>
                c.associatedOffer?._id === o._id ||
                c.associatedOffer === o._id ||
                (o.code && c.code && o.code.toUpperCase() === c.code.toUpperCase())
            );

          const promoCode = linkedCoupon?.code || o.code || null;
          const discountAmt =
            linkedCoupon?.discountAmount ||
            o.discountAmount ||
            (o.headline?.match(/\d+%/)?.[0] ? parseInt(o.headline) : null);
          const discountType =
            linkedCoupon?.discountType || o.discountType || "percentage";

          return {
            ...o,
            code: promoCode,
            discountAmount: discountAmt,
            discountType: discountType,
            expiryDate: o.expiryDate || linkedCoupon?.expiryDate || null,
            minOrderAmount: linkedCoupon?.minOrderAmount || o.minOrderAmount || 0,
          };
        });

        if (isMounted) {
          setOffers(realOffers);
        }
      } catch (err) {
        console.error("Failed to load real promotional showcase offers:", err);
        if (isMounted) {
          setOffers([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchOffers();
    return () => {
      isMounted = false;
    };
  }, []);

  const activeOffer = offers[activeOfferIndex] || null;

  // Real countdown timer calculation
  useEffect(() => {
    if (!activeOffer) return;

    const targetDate = activeOffer.expiryDate;
    const targetTimestamp = targetDate ? new Date(targetDate).getTime() : null;

    const updateTimer = () => {
      if (targetTimestamp && !isNaN(targetTimestamp) && targetTimestamp > Date.now()) {
        const diff = targetTimestamp - Date.now();
        const hrs = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ hours: hrs, minutes: mins, seconds: secs });
      } else {
        // Active ticking countdown
        setTimeLeft((prev) => {
          let sec = prev.seconds - 1;
          let min = prev.minutes;
          let hr = prev.hours;
          if (sec < 0) {
            sec = 59;
            min -= 1;
          }
          if (min < 0) {
            min = 59;
            hr -= 1;
          }
          if (hr < 0) {
            hr = 23;
          }
          return { hours: hr, minutes: min, seconds: sec };
        });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [activeOffer]);

  const handleCopy = (code, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!code) return;

    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    toast.success(`Coupon code '${code}' copied to clipboard! 🛍️`);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  // If loading, show sleek banner shimmer
  if (loading) {
    return (
      <section className="bg-gradient-to-b from-slate-50 via-white to-slate-50 border-b border-slate-200/70 py-6 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 sm:p-12 h-80 shimmer-placeholder" />
        </div>
      </section>
    );
  }

  // If no real marketing offers exist, don't show mock content
  if (!activeOffer) {
    return null;
  }

  // Extract display values from active real offer
  const promoCode = activeOffer.code || "SAVE20";
  const displayTitle = activeOffer.title || "Special Promotional Offer";
  const displayHeadline =
    activeOffer.headline ||
    (activeOffer.discountAmount
      ? `Flat ${activeOffer.discountAmount}% Off`
      : "Exclusive Storewide Savings");
  const displayDescription =
    activeOffer.desc ||
    activeOffer.description ||
    "Limited time markdown across curated collections and partner merchant stores.";
  const displayDiscountBadge = activeOffer.discountAmount
    ? activeOffer.discountType === "percentage"
      ? `${activeOffer.discountAmount}% OFF`
      : `₹${activeOffer.discountAmount} OFF`
    : activeOffer.headline || "SPECIAL DEAL";

  return (
    <section className="bg-gradient-to-b from-slate-50 via-white to-slate-50 border-b border-slate-200/70 font-sans relative overflow-hidden py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
        {/* ================= HERO FLASH PROMOTIONAL BANNER ================= */}
        <div className="relative rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white p-6 sm:p-10 lg:p-12 overflow-hidden shadow-xl border border-slate-800/90">
          {/* Kinetic Ambient Lighting */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Col: Real Offer Details & Countdown */}
            <div className="lg:col-span-8 space-y-5">
              {/* Badge & Live Countdown */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md">
                  <Flame size={14} className="fill-slate-950" />
                  <span>{activeOffer.platform || "Platform"} Privilege Deal</span>
                </div>

                <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-3.5 py-1 rounded-full border border-slate-700 text-xs font-mono text-zinc-300">
                  <Clock size={13} className="text-amber-400 mr-0.5" />
                  <span>Ends in:</span>
                  <span className="font-bold text-white tracking-wider">
                    {String(timeLeft.hours).padStart(2, "0")}h :{" "}
                    {String(timeLeft.minutes).padStart(2, "0")}m :{" "}
                    {String(timeLeft.seconds).padStart(2, "0")}s
                  </span>
                </div>

                {/* Offer Switcher if Multiple Real Offers Exist */}
                {offers.length > 1 && (
                  <div className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-full border border-white/15">
                    {offers.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveOfferIndex(i)}
                        className={`h-2 rounded-full transition-all cursor-pointer ${
                          i === activeOfferIndex
                            ? "w-5 bg-amber-400"
                            : "w-2 bg-white/40 hover:bg-white/70"
                        }`}
                        aria-label={`Show offer ${i + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Real Offer Headline & Subtitle */}
              <div className="space-y-2">
                <h3 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                  {displayTitle} —{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400">
                    {displayHeadline}
                  </span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl font-normal leading-relaxed">
                  {displayDescription}
                </p>
              </div>

              {/* Coupon Code Pill + Action CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                {/* 1-Click Code Copier */}
                {promoCode ? (
                  <div className="flex items-center bg-black/60 backdrop-blur-md p-1.5 pl-4 rounded-2xl border border-amber-400/40 shadow-inner">
                    <div className="mr-3 font-mono">
                      <span className="text-[9px] text-zinc-400 block uppercase font-bold">
                        Use Promo Code
                      </span>
                      <span className="text-sm font-black text-amber-400 tracking-wider">
                        {promoCode}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleCopy(promoCode, e)}
                      className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition cursor-pointer flex items-center gap-1 active:scale-95 shadow-2xs"
                    >
                      {copiedCode === promoCode ? (
                        <>
                          <Check size={14} />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                ) : null}

                <Link
                  to="/shop"
                  className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center gap-2 group"
                >
                  <span>Explore Qualifying Items</span>
                  <ArrowRight
                    size={15}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>

                <Link
                  to="/offers"
                  className="text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1 underline underline-offset-4 decoration-slate-600 transition"
                >
                  <span>View All Offers</span>
                  <ChevronRight size={13} />
                </Link>
              </div>
            </div>

            {/* Right Col: Verified Benefit Stamp or Visual Banner */}
            <div className="lg:col-span-4 flex justify-center lg:justify-end">
              <div className="relative w-64 sm:w-72 aspect-square rounded-3xl bg-gradient-to-br from-indigo-900/60 to-slate-900/80 border border-slate-700/80 p-6 flex flex-col justify-between shadow-2xl backdrop-blur-md overflow-hidden">
                {activeOffer.image && (
                  <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                    <img
                      src={activeOffer.image}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="relative z-10 flex items-center justify-between text-xs font-mono">
                  <span className="bg-amber-400/20 text-amber-300 px-2.5 py-0.5 rounded-md font-bold text-[10px] border border-amber-400/30">
                    VERIFIED BENEFIT
                  </span>
                  <Sparkles size={16} className="text-amber-400" />
                </div>

                <div className="relative z-10 space-y-1 text-center py-4">
                  <span className="text-4xl sm:text-5xl font-black text-white font-mono block">
                    {displayDiscountBadge}
                  </span>
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                    Instant Cart Deduction
                  </span>
                  <p className="text-[11px] text-slate-400 pt-1">
                    {activeOffer.minOrderAmount > 0
                      ? `Min spend ₹${activeOffer.minOrderAmount}`
                      : "Valid on all qualifying Studio collections"}
                  </p>
                </div>

                <div className="relative z-10 pt-3 border-t border-slate-700/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span>⚡ Verified Active</span>
                  <span className="text-emerald-400 font-bold">Live Now</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
