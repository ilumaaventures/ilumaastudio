import React, { useState, useEffect } from "react";
import {
  Tag,
  Copy,
  Check,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Gift,
  Crown,
} from "lucide-react";
import toast from "react-hot-toast";
import ProductCard from "./ProductCard";

export default function Offers({
  offers = [],
  products = [],
  onSelectProduct = null,
  onAddToCart = null,
  currency = "INR",
}) {
  const [copiedCode, setCopiedCode] = useState(null);
  const [countdown, setCountdown] = useState({
    days: 2,
    hours: 14,
    minutes: 38,
    seconds: 40,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0)
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0)
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0)
          return { days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return { days: 3, hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const defaultOffers = [
    {
      _id: "off-1",
      code: "ARCHIVE25",
      title: "RUNWAY ARCHIVE PRIVILEGE",
      discount: "25% OFF",
      description: "Enjoy an extra 25% off all structured coats and tailored wool silhouettes.",
      minSpend: "Valid on orders over ₹30,000",
      badge: "Private Client VIP",
      expires: "Ends in 48 Hours",
    },
    {
      _id: "off-2",
      code: "VIPCASHMERE",
      title: "NOBLE CASHMERE SUITE",
      discount: "COMPLIMENTARY CARE KIT",
      description: "Receive a cedarwood and natural bristle cashmere comb kit with any knitwear.",
      minSpend: "No minimum spend required",
      badge: "Limited Allotment",
      expires: "While stock lasts",
    },
    {
      _id: "off-3",
      code: "FIRSTATELIER",
      title: "FIRST BESPOKE ORDER",
      discount: "₹5,000 CREDIT",
      description: "Applied towards your inaugural couture or evening silhouette order.",
      minSpend: "Valid on first purchase",
      badge: "Inaugural Welcome",
      expires: "Active All Season",
    },
  ];

  const displayOffers = offers && offers.length > 0 ? offers : defaultOffers;

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Code "${code}" copied to clipboard!`, {
      icon: "✨",
    });
    setTimeout(() => setCopiedCode(null), 3000);
  };

  // Filter products that have discounts or compareAtPrice
  const discountedPieces = products
    .filter((p) => p.compareAtPrice && p.compareAtPrice > p.price)
    .concat(products)
    .slice(0, 4);

  return (
    <div className="py-14 bg-[#FAFAFA] min-h-screen text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Editorial Top Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-zinc-950 text-white p-8 sm:p-14 border border-zinc-800 shadow-2xl">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-amber-400 text-xs font-mono uppercase tracking-widest">
              <Crown size={13} />
              <span>Private Client Privileges</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight leading-tight">
              Autumn Archive & Runway Privileges.
            </h1>

            <p className="text-sm sm:text-base text-zinc-400 font-sans leading-relaxed max-w-xl">
              Access limited seasonal archive allowances, complimentary bespoke tailoring, and private client credits on iconic outerwear and knitwear.
            </p>

            {/* Countdown Urgency Counter */}
            <div className="pt-2 flex items-center gap-4 flex-wrap">
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
                <Clock size={14} className="text-amber-400" /> Private Window Closes:
              </span>
              <div className="flex items-center gap-2 font-mono text-sm font-bold text-white">
                <span className="bg-zinc-800 border border-zinc-700 px-2.5 py-1 rounded-lg">
                  {countdown.days}d
                </span>
                <span>:</span>
                <span className="bg-zinc-800 border border-zinc-700 px-2.5 py-1 rounded-lg">
                  {String(countdown.hours).padStart(2, "0")}h
                </span>
                <span>:</span>
                <span className="bg-zinc-800 border border-zinc-700 px-2.5 py-1 rounded-lg">
                  {String(countdown.minutes).padStart(2, "0")}m
                </span>
                <span>:</span>
                <span className="bg-rose-950 border border-rose-800 text-rose-300 px-2.5 py-1 rounded-lg">
                  {String(countdown.seconds).padStart(2, "0")}s
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Exclusive Promo Privilege Cards */}
        <div className="space-y-6">
          <div className="border-b border-zinc-200 pb-4">
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 block">
              Active Vouchers
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-950 mt-1">
              Current Runway Privileges
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayOffers.map((offer) => {
              const isCopied = copiedCode === offer.code;
              return (
                <div
                  key={offer._id || offer.code}
                  className="bg-white rounded-2xl border border-zinc-200 p-6 flex flex-col justify-between space-y-6 shadow-xs hover:shadow-xl hover:border-zinc-400 transition-all duration-300"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-700 border border-zinc-200 font-bold">
                        {offer.badge || "Exclusive"}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400">
                        {offer.expires || "Limited"}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-2xl font-serif font-black text-zinc-950 block">
                        {offer.discount || "20% OFF"}
                      </span>
                      <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-500 font-bold">
                        {offer.title}
                      </h3>
                    </div>

                    <p className="text-xs text-zinc-600 font-sans leading-relaxed">
                      {offer.description}
                    </p>
                    <span className="text-[11px] text-zinc-400 font-mono block">
                      {offer.minSpend}
                    </span>
                  </div>

                  {/* Code Box with Copy Button */}
                  <div className="pt-3 border-t border-zinc-100 flex items-center justify-between bg-zinc-50 p-2.5 rounded-xl border border-dashed border-zinc-300">
                    <span className="font-mono text-sm font-black text-zinc-950 tracking-wider">
                      {offer.code}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyCode(offer.code)}
                      className="px-3 py-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-white text-[11px] font-bold uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer"
                    >
                      {isCopied ? (
                        <>
                          <Check size={12} className="text-emerald-400" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Curated Archive Pieces */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-zinc-200 pb-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 block">
                Selected Pieces
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-950 mt-1">
                Eligible Archive Silhouettes
              </h2>
            </div>
            <p className="text-xs text-zinc-500 font-mono">
              Apply code at checkout to unlock archive pricing
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {discountedPieces.map((p) => (
              <ProductCard
                key={p._id || p.id}
                product={p}
                currency={currency}
                onSelect={onSelectProduct}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        </div>

        {/* VIP Styling Appointment Banner */}
        <div className="bg-zinc-900 text-white p-8 sm:p-10 rounded-3xl border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
              Complimentary Atelier Styling Appointment
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
              Meet with a master stylist in our showroom or via private virtual consultation for tailored alterations, bespoke sizing, and wardrobe coordination.
            </p>
          </div>
          <a
            href="mailto:concierge@urbanatelier.com?subject=Private%20Atelier%20Styling%20Appointment"
            className="px-6 py-3.5 bg-white text-zinc-950 hover:bg-zinc-200 font-bold text-xs uppercase tracking-widest rounded-xl transition cursor-pointer shrink-0"
          >
            Request Private Viewing
          </a>
        </div>
      </div>
    </div>
  );
}
