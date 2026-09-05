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
  Truck,
  Percent,
  Coins,
  ChevronRight,
  Radio,
} from "lucide-react";
import toast from "react-hot-toast";

export default function PromotionalShowcase() {
  const navigate = useNavigate();
  const [copiedCode, setCopiedCode] = useState(null);

  // Live Flash Countdown Timer
  const [timeLeft, setTimeLeft] = useState({
    hours: 7,
    minutes: 34,
    seconds: 48,
  });

  useEffect(() => {
    const timer = setInterval(() => {
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
          hr = 12;
        }
        return { hours: hr, minutes: min, seconds: sec };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopy = (code) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    toast.success(`Coupon code ${code} copied! Applied to your next checkout.`);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const promoCards = [
    {
      id: "promo-welcome",
      icon: <Gift className="text-amber-600" size={20} />,
      badge: "NEW BUYER GRANT",
      title: "Flat ₹500 Off First Order",
      description:
        "Welcome privilege across all luxury hampers, fashion, decor and electronics.",
      code: "WELCOME500",
      terms: "Min. spend ₹1,999",
      accent: "from-amber-500/10 to-orange-500/5",
      border: "border-amber-200/80",
    },
    {
      id: "promo-bulk",
      icon: <Percent className="text-blue-600" size={20} />,
      badge: "CORPORATE & WEDDINGS",
      title: "25% Off Bulk Gifting",
      description:
        "Custom engraved wooden boxes, metallic wax seals, and curated bespoke assortments.",
      code: "LUXEBULK25",
      terms: "On 5+ gift units",
      accent: "from-blue-500/10 to-indigo-500/5",
      border: "border-blue-200/80",
    },
    {
      id: "promo-express",
      icon: <Truck className="text-emerald-600" size={20} />,
      badge: "PRIORITY CARGO",
      title: "Free Armored Express Delivery",
      description:
        "Guaranteed insulated packaging and 24h dispatch across all metro hubs.",
      code: "FREESHIP",
      terms: "Orders above ₹2,499",
      accent: "from-emerald-500/10 to-teal-500/5",
      border: "border-emerald-200/80",
    },
  ];

  return (
    <section className="bg-gradient-to-b from-slate-50 via-white to-slate-50 border-b border-slate-200/70 font-sans relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
        {/* ================= 1. HERO FLASH PROMOTIONAL BANNER ================= */}
        <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-10 lg:p-12 overflow-hidden shadow-xl border border-slate-800">
          {/* Kinetic Ambient Lighting */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Col: Offer details & countdown */}
            <div className="lg:col-span-8 space-y-5">
              {/* Badge & Live Countdown */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md">
                  <Flame size={14} className="fill-slate-950" />
                  <span>Flash Privilege Sale</span>
                </div>

                <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-slate-700 text-xs font-mono text-zinc-300">
                  <Clock size={13} className="text-amber-400 mr-1" />
                  <span>Ends in:</span>
                  <span className="font-bold text-white">
                    {String(timeLeft.hours).padStart(2, "0")}h :{" "}
                    {String(timeLeft.minutes).padStart(2, "0")}m :{" "}
                    {String(timeLeft.seconds).padStart(2, "0")}s
                  </span>
                </div>
              </div>

              {/* Big Punchy Headline */}
              <div className="space-y-2">
                <h3 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                  Unlock Flat 30% Off On <br className="hidden sm:inline" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400">
                    Curated Studio Bestsellers
                  </span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl font-normal leading-relaxed">
                  Enjoy exclusive seasonal markdown on artisanal lifestyle
                  hampers, flagship audio, Italian leathercraft, and designer
                  home decor.
                </p>
              </div>

              {/* Coupon Code Pill + CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                {/* 1-Click Code Copier */}
                <div className="flex items-center bg-black/60 backdrop-blur-md p-1.5 pl-4 rounded-2xl border border-amber-400/40 shadow-inner">
                  <div className="mr-3 font-mono">
                    <span className="text-[9px] text-zinc-400 block uppercase font-bold">
                      Use Promo Code
                    </span>
                    <span className="text-sm font-black text-amber-400 tracking-wider">
                      STUDIO30
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy("STUDIO30")}
                    className="px-3 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition cursor-pointer flex items-center gap-1 active:scale-95"
                  >
                    {copiedCode === "STUDIO30" ? (
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
              </div>
            </div>

            {/* Right Col: Eye-catching Graphic / Visual Stamp */}
            <div className="lg:col-span-4 flex justify-center lg:justify-end">
              <div className="relative w-64 sm:w-72 aspect-square rounded-3xl bg-gradient-to-br from-indigo-900/60 to-slate-900/80 border border-slate-700/80 p-6 flex flex-col justify-between shadow-2xl backdrop-blur-md">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="bg-amber-400/20 text-amber-300 px-2.5 py-0.5 rounded-md font-bold text-[10px] border border-amber-400/30">
                    VERIFIED BENEFIT
                  </span>
                  <Sparkles size={16} className="text-amber-400" />
                </div>

                <div className="space-y-1 text-center py-4">
                  <span className="text-4xl sm:text-5xl font-black text-white font-mono block">
                    30% OFF
                  </span>
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                    Instant Cart Deduction
                  </span>
                  <p className="text-[11px] text-slate-400 pt-1">
                    Valid on all Studio collections until midnight
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-700/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span>⚡ 820+ Shoppers Claimed</span>
                  <span className="text-emerald-400 font-bold">Active Now</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
