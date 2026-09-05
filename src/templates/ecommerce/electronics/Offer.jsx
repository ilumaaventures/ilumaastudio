import React, { useState, useEffect } from "react";
import {
  Zap,
  Tag,
  Clock,
  Copy,
  Check,
  Percent,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Layers,
  ShoppingBag,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";
import ProductCard from "./ProductCard";

export default function Offer({
  products = [],
  onSelectProduct,
  onAddToCart,
  onOpenSpecs,
}) {
  const [copiedCode, setCopiedCode] = useState(null);

  // Live Flash Deal Countdown Timer (e.g. 14 hours 22 minutes remaining)
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 38,
    seconds: 45,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Coupon code "${code}" copied to clipboard! 🚀`);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  // Trade-In Estimator State
  const [tradeCategory, setTradeCategory] = useState("headphones");
  const [tradeCondition, setTradeCondition] = useState("excellent");

  const tradeInValues = {
    headphones: { excellent: 5500, good: 3800, fair: 2200 },
    smartwatch: { excellent: 6200, good: 4500, fair: 2500 },
    keyboard: { excellent: 3200, good: 2100, fair: 1200 },
  };

  const estimatedCredit = tradeInValues[tradeCategory]?.[tradeCondition] || 3500;

  // Bundles
  const bundles = [
    {
      id: "bundle-esports",
      title: "Esports Pro Arsenal Bundle",
      badge: "Save 25% Instant",
      description: "AeroPulse Master Studio ANC + NeoKey 75% Magnetic Hall-Effect Keyboard. Zero latency audio and 0.1mm actuation keys.",
      price: 366.0,
      originalPrice: 488.0,
      image1: products[0]?.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
      image2: products[2]?.image || "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80",
      items: [products[0], products[2]].filter(Boolean),
    },
    {
      id: "bundle-studio",
      title: "Ultimate Dolby Creator Suite",
      badge: "Save 30% VIP",
      description: "AeroPulse Master Studio ANC + SonicBeam 7.1.2 Spatial Soundbar. True cinema acoustic fidelity in one package.",
      price: 559.0,
      originalPrice: 798.0,
      image1: products[0]?.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
      image2: products[3]?.image || "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80",
      items: [products[0], products[3]].filter(Boolean),
    },
  ];

  const handleAddBundle = (bundle) => {
    if (bundle.items && bundle.items.length > 0) {
      bundle.items.forEach((item) => {
        onAddToCart(item, 1);
      });
      toast.success(`Bundle "${bundle.title}" added to your cart with instant bundle pricing! ⚡`);
    } else {
      toast.success(`Bundle added to cart!`);
    }
  };

  const vouchers = [
    {
      code: "CYBER20",
      discount: "20% OFF",
      desc: "Valid on all Beryllium ANC flagships and Studio Soundbars.",
      minSpend: "Min spend ₹15,000",
    },
    {
      code: "STUDIO50",
      discount: "₹5,000 OFF",
      desc: "Instant discount on multi-device workstation setups.",
      minSpend: "Min spend ₹30,000",
    },
    {
      code: "FREQPASS",
      discount: "FREE 2-YR SHIELD",
      desc: "Zero-cost TechShield 2-Year extended warranty with advance swaps.",
      minSpend: "All Titanium & Hall-Effect orders",
    },
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16 text-left">
      {/* 1. FLASH DEALS COUNTDOWN HERO */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#0B1120] via-blue-950/80 to-[#0F172A] border border-cyan-500/30 p-6 sm:p-10 shadow-[0_10px_40px_rgba(6,182,212,0.15)]">
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-400/40 text-cyan-300 text-xs font-bold font-mono">
              <Zap size={14} className="text-cyan-400 animate-bounce" />
              <span>FLASH SILICON DROP #48</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Cyber Week Hardware Flash Drops.
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Unlock exclusive laboratory vouchers, multi-hardware ecosystem bundles, and guaranteed trade-in credit toward next-gen audio gear.
            </p>

            {/* Countdown Ticker Box */}
            <div className="flex items-center gap-2 sm:gap-3 pt-2">
              <div className="text-center bg-slate-900/90 border border-slate-700/80 rounded-2xl px-3 sm:px-4 py-2 min-w-[64px]">
                <span className="text-xl sm:text-2xl font-black text-white font-mono block">
                  {String(timeLeft.hours).padStart(2, "0")}
                </span>
                <span className="text-[9px] uppercase font-bold text-slate-400">Hours</span>
              </div>
              <span className="text-xl font-black text-cyan-400">:</span>
              <div className="text-center bg-slate-900/90 border border-slate-700/80 rounded-2xl px-3 sm:px-4 py-2 min-w-[64px]">
                <span className="text-xl sm:text-2xl font-black text-white font-mono block">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </span>
                <span className="text-[9px] uppercase font-bold text-slate-400">Minutes</span>
              </div>
              <span className="text-xl font-black text-cyan-400">:</span>
              <div className="text-center bg-slate-900/90 border border-slate-700/80 rounded-2xl px-3 sm:px-4 py-2 min-w-[64px]">
                <span className="text-xl sm:text-2xl font-black text-cyan-400 font-mono block">
                  {String(timeLeft.seconds).padStart(2, "0")}
                </span>
                <span className="text-[9px] uppercase font-bold text-slate-400">Seconds</span>
              </div>
            </div>
          </div>

          {/* Call to action badge */}
          <div className="flex-shrink-0 bg-slate-900/90 border border-slate-700 p-6 rounded-3xl text-center space-y-3 max-w-xs shadow-2xl">
            <span className="text-xs uppercase font-bold text-cyan-400 tracking-wider block font-mono">
              VIP Lab Access
            </span>
            <span className="text-3xl font-black text-white block">Up to 35% OFF</span>
            <p className="text-[11px] text-slate-400">
              Apply valid voucher codes at checkout or click "Copy" on any card below.
            </p>
            <button
              onClick={onOpenSpecs}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-blue-600/30"
            >
              <span>Explore Eligible Models</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* 2. VIP VOUCHER CARDS */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
          <Tag size={20} className="text-cyan-400" />
          <h2 className="text-2xl font-black text-white">Active VIP Voucher Codes</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {vouchers.map((v) => {
            const isCopied = copiedCode === v.code;
            return (
              <div
                key={v.code}
                className="relative bg-slate-900/90 rounded-3xl border border-slate-800 p-6 space-y-4 shadow-lg hover:border-cyan-500/40 transition group"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-2xl font-black text-white block">{v.discount}</span>
                    <span className="text-[10px] uppercase font-mono font-bold text-slate-400">
                      {v.minSpend}
                    </span>
                  </div>
                  <span className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                    <Sparkles size={16} />
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{v.desc}</p>

                <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-800">
                  <div className="bg-slate-950 px-3.5 py-1.5 rounded-xl border border-dashed border-cyan-500/40 font-mono font-black text-sm text-cyan-300 tracking-wider">
                    {v.code}
                  </div>

                  <button
                    onClick={() => handleCopyCode(v.code)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                      isCopied
                        ? "bg-emerald-600 text-white font-black"
                        : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                    }`}
                  >
                    {isCopied ? <Check size={14} /> : <Copy size={13} />}
                    <span>{isCopied ? "Copied!" : "Copy Code"}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. ECOSYSTEM HARDWARE BUNDLES */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Layers size={20} className="text-cyan-400" />
            <h2 className="text-2xl font-black text-white">Ecosystem Performance Bundles</h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">1-Click Multi-Device Pairing</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {bundles.map((bundle) => (
            <div
              key={bundle.id}
              className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-6 hover:border-cyan-500/40 transition shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
                    {bundle.badge}
                  </span>
                  <div className="text-right font-mono">
                    <span className="text-2xl font-black text-white block">₹{bundle.price.toFixed(2)}</span>
                    <span className="text-xs text-slate-500 line-through">₹{bundle.originalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white">{bundle.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{bundle.description}</p>

                {/* Combined Thumbnail Visual */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
                    <img src={bundle.image1} alt="Bundle Item 1" className="w-full h-full object-cover" />
                  </div>
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
                    <img src={bundle.image2} alt="Bundle Item 2" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-cyan-400 font-mono flex items-center gap-1">
                  <ShieldCheck size={14} /> Includes Dual 2-Yr Shield
                </span>

                <button
                  onClick={() => handleAddBundle(bundle)}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-lg shadow-blue-600/30 active:scale-95"
                >
                  <ShoppingBag size={15} />
                  <span>Claim & Add Bundle</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. HARDWARE TRADE-IN CALCULATOR */}
      <div className="bg-gradient-to-br from-slate-900 to-[#0B1120] rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-cyan-400 font-mono font-bold">
              Sustainable Hardware Program
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <RefreshCw size={20} className="text-cyan-400" />
              Instant Hardware Trade-In Estimator
            </h3>
          </div>
          <span className="text-xs text-slate-400">Trade old gear for store discount credit</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300">Device Type</label>
            <select
              value={tradeCategory}
              onChange={(e) => setTradeCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
            >
              <option value="headphones">Wireless / ANC Headphones</option>
              <option value="smartwatch">Smart Sports Watch</option>
              <option value="keyboard">Mechanical / Gaming Keyboard</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300">Device Physical Condition</label>
            <select
              value={tradeCondition}
              onChange={(e) => setTradeCondition(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
            >
              <option value="excellent">Like New (Flawless, with original box)</option>
              <option value="good">Working (Minor scuffs, full battery health)</option>
              <option value="fair">Fair (Visible scratches, fully operational)</option>
            </select>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-cyan-500/30 flex flex-col justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400">Estimated Credit Voucher</span>
            <span className="text-2xl font-black text-emerald-400 font-mono">
              ₹{estimatedCredit.toLocaleString()}
            </span>
            <button
              onClick={() => {
                toast.success(`Trade-In voucher code "TRADE${estimatedCredit}" generated for ₹${estimatedCredit}! 🎁`);
              }}
              className="mt-2 py-1.5 px-3 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-black text-[11px] rounded-lg cursor-pointer transition text-center"
            >
              Claim Trade-In Voucher
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
