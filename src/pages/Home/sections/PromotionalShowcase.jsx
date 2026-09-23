import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Flame,
  Copy,
  Check,
  ArrowRight,
  Clock3,
  Tag,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";
import { getPublicOffers, getPublicCoupons } from "../../../api/offerService";

export default function PromotionalShowcase() {
  const [offers, setOffers] = useState([]);
  const [activeOfferIndex, setActiveOfferIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(null);

  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  /* ------------------------------------------------------------
   * FETCH REAL OFFERS + COUPONS
   * ------------------------------------------------------------ */
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

        const realOffers = offerList.map((offer) => {
          const linkedCoupon =
            offer.associatedCoupon ||
            couponList.find(
              (coupon) =>
                coupon.associatedOffer?._id === offer._id ||
                coupon.associatedOffer === offer._id ||
                (offer.code &&
                  coupon.code &&
                  offer.code.toUpperCase() === coupon.code.toUpperCase()),
            );

          const promoCode = linkedCoupon?.code || offer.code || null;

          const discountFromHeadline =
            offer.headline?.match(/(\d+(?:\.\d+)?)\s*%/);

          const discountAmount =
            linkedCoupon?.discountAmount ??
            offer.discountAmount ??
            (discountFromHeadline ? Number(discountFromHeadline[1]) : null);

          const discountType =
            linkedCoupon?.discountType || offer.discountType || "percentage";

          return {
            ...offer,
            code: promoCode,
            discountAmount,
            discountType,
            expiryDate: offer.expiryDate || linkedCoupon?.expiryDate || null,
            minOrderAmount:
              linkedCoupon?.minOrderAmount ?? offer.minOrderAmount ?? 0,
          };
        });

        if (isMounted) {
          setOffers(realOffers);
        }
      } catch (error) {
        console.error("Failed to load promotional offers:", error);

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

  /* ------------------------------------------------------------
   * COUNTDOWN
   * ------------------------------------------------------------ */
  useEffect(() => {
    if (!activeOffer?.expiryDate) {
      setTimeLeft({
        hours: 0,
        minutes: 0,
        seconds: 0,
      });

      return;
    }

    const targetTimestamp = new Date(activeOffer.expiryDate).getTime();

    if (!targetTimestamp || Number.isNaN(targetTimestamp)) {
      return;
    }

    const updateTimer = () => {
      const diff = targetTimestamp - Date.now();

      if (diff <= 0) {
        setTimeLeft({
          hours: 0,
          minutes: 0,
          seconds: 0,
        });
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));

      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({
        hours,
        minutes,
        seconds,
      });
    };

    updateTimer();

    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [activeOffer]);

  /* ------------------------------------------------------------
   * COPY COUPON
   * ------------------------------------------------------------ */
  const handleCopy = async (code, event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (!code) return;

    try {
      await navigator.clipboard?.writeText(code);

      setCopiedCode(code);

      toast.success(`Coupon code "${code}" copied!`);

      setTimeout(() => {
        setCopiedCode(null);
      }, 2500);
    } catch (error) {
      toast.error("Unable to copy coupon code");
    }
  };

  /* ------------------------------------------------------------
   * LOADING
   * ------------------------------------------------------------ */
  if (loading) {
    return (
      <section className="bg-white py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative h-[330px] overflow-hidden rounded-[28px] border border-slate-200 bg-slate-50">
            <div className="absolute inset-0 animate-pulse">
              <div className="absolute left-8 top-10 h-4 w-28 rounded-full bg-slate-200" />

              <div className="absolute left-8 top-24 h-12 w-2/5 rounded-xl bg-slate-200" />

              <div className="absolute left-8 top-40 h-4 w-1/3 rounded-full bg-slate-200" />

              <div className="absolute bottom-12 left-8 h-12 w-40 rounded-xl bg-slate-200" />

              <div className="absolute right-8 top-8 h-[270px] w-[330px] rounded-[24px] bg-slate-200" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* ------------------------------------------------------------
   * NO REAL OFFER
   * ------------------------------------------------------------ */
  if (!activeOffer) {
    return null;
  }

  /* ------------------------------------------------------------
   * DISPLAY VALUES
   * ------------------------------------------------------------ */
  const promoCode = activeOffer.code;

  const displayTitle = activeOffer.title || "Special Store Offer";

  const displayHeadline =
    activeOffer.headline ||
    (activeOffer.discountAmount
      ? activeOffer.discountType === "percentage"
        ? `${activeOffer.discountAmount}% off`
        : `₹${activeOffer.discountAmount} off`
      : "Exclusive savings");

  const displayDescription =
    activeOffer.desc ||
    activeOffer.description ||
    "Discover curated collections and enjoy an exclusive limited-time offer.";

  const displayDiscountBadge = activeOffer.discountAmount
    ? activeOffer.discountType === "percentage"
      ? `${activeOffer.discountAmount}%`
      : `₹${activeOffer.discountAmount}`
    : "DEAL";

  const hasCountdown =
    Boolean(activeOffer.expiryDate) &&
    (timeLeft.hours > 0 || timeLeft.minutes > 0 || timeLeft.seconds > 0);

  return (
    <section className="relative overflow-hidden bg-[#fafbfc] py-7 sm:py-10 lg:py-12">
      {/* Soft background decoration */}
      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-blue-100/40 blur-3xl" />

      <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-violet-100/40 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ======================================================
            PREMIUM LIGHT PROMOTIONAL HERO
        ====================================================== */}
        <div className="group relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_18px_60px_-30px_rgba(15,23,42,0.25)]">
          {/* Soft top gradient */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(99,102,241,0.08),transparent_35%),radial-gradient(circle_at_20%_100%,rgba(59,130,246,0.06),transparent_35%)]" />

          <div className="relative grid min-h-[340px] grid-cols-1 lg:grid-cols-12">
            {/* ==================================================
                LEFT CONTENT
            ================================================== */}
            <div className="flex flex-col justify-center px-6 py-9 sm:px-10 sm:py-11 lg:col-span-7 lg:px-14 lg:py-12">
              {/* Top meta */}
              <div className="mb-5 flex flex-wrap items-center gap-2.5">
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-blue-700">
                  <Sparkles size={13} />

                  <span>{activeOffer.platform || "E-Commerce"} Offer</span>
                </div>

                {hasCountdown && (
                  <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[10px] font-semibold text-slate-600">
                    <Clock3 size={13} />

                    <span>
                      Ends in{" "}
                      <span className="font-bold text-slate-900">
                        {String(timeLeft.hours).padStart(2, "0")}:
                        {String(timeLeft.minutes).padStart(2, "0")}:
                        {String(timeLeft.seconds).padStart(2, "0")}
                      </span>
                    </span>
                  </div>
                )}

                {/* Offer dots */}
                {offers.length > 1 && (
                  <div className="ml-auto flex items-center gap-1.5">
                    {offers.map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setActiveOfferIndex(index)}
                        aria-label={`Show offer ${index + 1}`}
                        className={`h-1.5 rounded-full transition-all ${
                          index === activeOfferIndex
                            ? "w-6 bg-slate-900"
                            : "w-1.5 bg-slate-300 hover:bg-slate-400"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Heading */}
              <div className="max-w-2xl">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                  Curated savings
                </p>

                <h2 className="text-3xl font-bold leading-[1.08] tracking-[-0.035em] text-slate-950 sm:text-4xl lg:text-[48px]">
                  {displayTitle}
                  <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                    {displayHeadline}
                  </span>
                </h2>

                <p className="mt-4 max-w-xl text-sm leading-6 text-slate-500 sm:text-[15px]">
                  {displayDescription}
                </p>
              </div>

              {/* CTA AREA */}
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link
                  to="/shop"
                  className="group/btn inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3.5 text-xs font-bold text-white shadow-[0_8px_20px_-8px_rgba(15,23,42,0.45)] transition-all hover:-translate-y-0.5 hover:bg-slate-800"
                >
                  <span>Explore Collection</span>

                  <ArrowRight
                    size={15}
                    className="transition-transform group-hover/btn:translate-x-1"
                  />
                </Link>

                {promoCode && (
                  <button
                    type="button"
                    onClick={(event) => handleCopy(promoCode, event)}
                    className="group/code inline-flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left transition-all hover:border-blue-200 hover:bg-blue-50/50"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm">
                      {copiedCode === promoCode ? (
                        <Check size={15} />
                      ) : (
                        <Tag size={15} />
                      )}
                    </div>

                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                        {copiedCode === promoCode ? "Copied" : "Use code"}
                      </p>

                      <p className="font-mono text-xs font-bold tracking-wider text-slate-800">
                        {promoCode}
                      </p>
                    </div>

                    <Copy
                      size={13}
                      className="ml-1 text-slate-400 transition-colors group-hover/code:text-blue-600"
                    />
                  </button>
                )}

                <Link
                  to="/offers"
                  className="inline-flex items-center gap-1 px-2 py-3 text-xs font-semibold text-slate-500 transition hover:text-slate-950"
                >
                  View all offers
                  <ChevronRight size={14} />
                </Link>
              </div>
            </div>

            {/* ==================================================
                RIGHT VISUAL
            ================================================== */}
            <div className="relative min-h-[270px] overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/60 to-indigo-50/70 lg:col-span-5 lg:min-h-full">
              {/* Decorative circles */}
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border border-white/80 bg-white/30" />

              <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full border border-white/70 bg-white/30" />

              {/* Image */}
              {activeOffer.image ? (
                <div className="absolute inset-5 overflow-hidden rounded-[22px] border border-white/80 bg-white shadow-[0_20px_50px_-25px_rgba(15,23,42,0.35)]">
                  <img
                    src={activeOffer.image}
                    alt={displayTitle}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                  />

                  {/* Image overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/25 via-transparent to-transparent" />
                </div>
              ) : (
                <div className="absolute inset-5 flex items-center justify-center rounded-[22px] border border-white/80 bg-white shadow-sm">
                  <Sparkles
                    size={46}
                    strokeWidth={1.3}
                    className="text-blue-500/40"
                  />
                </div>
              )}

              {/* Floating discount card */}
              <div className="absolute bottom-7 right-7 z-20 min-w-[125px] rounded-2xl border border-white/90 bg-white/90 p-3.5 shadow-[0_16px_35px_-15px_rgba(15,23,42,0.3)] backdrop-blur-xl">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                    Special offer
                  </span>

                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    <Flame size={12} fill="currentColor" />
                  </div>
                </div>

                <div className="text-2xl font-black tracking-tight text-slate-950">
                  {displayDiscountBadge}
                  {activeOffer.discountType === "percentage" &&
                    activeOffer.discountAmount && (
                      <span className="ml-1 text-sm font-bold">OFF</span>
                    )}
                </div>

                <p className="mt-1 text-[10px] leading-4 text-slate-500">
                  {activeOffer.minOrderAmount > 0
                    ? `Min. order ₹${activeOffer.minOrderAmount}`
                    : "On qualifying products"}
                </p>
              </div>

              {/* Verified label */}
              <div className="absolute left-8 top-8 z-20 inline-flex items-center gap-1.5 rounded-full border border-white/90 bg-white/85 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-slate-600 shadow-sm backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Live offer
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
