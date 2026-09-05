import React, { useState } from "react";
import {
  Flame,
  Zap,
  Tag,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Gift,
  Clock,
} from "lucide-react";
import toast from "react-hot-toast";

export default function Offer({
  offers = [],
  onShopVault = () => {},
}) {
  const [copiedCode, setCopiedCode] = useState(null);

  const defaultDrops = [
    {
      id: "bundle-1",
      code: "PACEPACK20",
      title: "Marathon Dual Propulsion Pack",
      badge: "20% OFF BUNDLE",
      discount: "Save 20% on Duo",
      description:
        "Pair the AeroPulse Carbon Marathon Racer with our Zero-Gravity Recovery Mule. The complete long-distance race weekend setup.",
      expiry: "Valid for Next 48 Hours",
      minSpend: "Min. 2 Silhouettes",
    },
    {
      id: "bundle-2",
      code: "DEADSTOCK85",
      title: "Court & Street Collector Suite",
      badge: "SAVE ₹3,500",
      discount: "Flat ₹3,500 Off",
      description:
        "Score both Retro High-Top Court '85 and Civitanova Italian Calfskin Low in matching collector presentation boxes.",
      expiry: "Limited to First 50 Buyers",
      minSpend: "Applies at Checkout",
    },
    {
      id: "bundle-3",
      code: "FREECLEANLAB",
      title: "Crep & Hydrophobic Care Kit",
      badge: "COMPLIMENTARY GIFT",
      discount: "Worth ₹1,800 Free",
      description:
        "Receive our laboratory-grade foam cleanser, natural hog-hair brush, and hydrophobic nano stain barrier free on orders above ₹6,000.",
      expiry: "Automatic at Dispatch",
      minSpend: "Orders over ₹6,000",
    },
  ];

  const dropOffers = offers && offers.length > 0 ? offers : defaultDrops;

  const handleCopy = (code) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    toast.success(`Promo code ${code} copied to clipboard!`);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 font-sans">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-500/10 text-lime-400 text-xs font-mono font-bold border border-lime-500/30">
          <Flame size={14} />
          <span>VAULT PRIVILEGES & DROP PROMOS</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black uppercase text-white font-mono tracking-tight">
          Deadstock Drop Offers
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 font-normal">
          Exclusive multi-pair runner bundles and VIP codes straight from our global sneaker dispatch hub.
        </p>
      </div>

      {/* Offer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {dropOffers.map((item) => (
          <div
            key={item.id || item.code}
            className="bg-gradient-to-b from-[#141418] to-[#0E0E12] rounded-3xl border border-zinc-800 hover:border-lime-500/50 p-6 sm:p-8 flex flex-col justify-between space-y-6 relative overflow-hidden transition-all shadow-xl group"
          >
            {/* Top Badge */}
            <div className="flex items-center justify-between">
              <span className="bg-lime-500/15 text-lime-400 border border-lime-500/30 text-[10px] font-mono font-black uppercase px-2.5 py-1 rounded-lg">
                {item.badge || "SPECIAL DROP"}
              </span>
              <span className="text-[10px] font-mono text-zinc-500 flex items-center gap-1">
                <Clock size={12} />
                {item.expiry}
              </span>
            </div>

            {/* Content */}
            <div className="space-y-3">
              <h3 className="text-xl font-black text-white font-mono uppercase group-hover:text-lime-400 transition">
                {item.title}
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                {item.description}
              </p>
              <span className="text-xs font-mono text-zinc-500 block">
                Conditions: {item.minSpend}
              </span>
            </div>

            {/* Code Copy & CTA */}
            <div className="pt-4 border-t border-zinc-800 space-y-3">
              <div className="flex items-center justify-between bg-zinc-950 p-3 rounded-2xl border border-zinc-800 font-mono">
                <div>
                  <span className="text-[9px] text-zinc-500 block uppercase">VIP CODE</span>
                  <span className="text-sm font-black text-lime-400 tracking-wider">
                    {item.code}
                  </span>
                </div>
                <button
                  onClick={() => handleCopy(item.code)}
                  className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                >
                  {copiedCode === item.code ? (
                    <>
                      <Check size={14} className="text-lime-400" />
                      <span className="text-lime-400 text-[10px]">COPIED</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span className="text-[10px]">COPY</span>
                    </>
                  )}
                </button>
              </div>

              <button
                onClick={onShopVault}
                className="w-full py-3 rounded-xl bg-lime-400 hover:bg-lime-300 text-black font-mono font-black text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Apply & Explore Vault</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Sneakerhead Raffle Banner */}
      <div className="bg-[#121217] rounded-3xl border border-zinc-800 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-400 text-[10px] font-mono font-bold border border-orange-500/20">
            <Gift size={12} />
            <span>EXCLUSIVE DEADSTOCK RAFFLE</span>
          </div>
          <h3 className="text-xl font-black text-white font-mono uppercase">
            AeroPulse Pro "Hyper-Neon" 1-of-100 Raffle
          </h3>
          <p className="text-xs text-zinc-400 max-w-xl font-sans">
            Verified members enter free for the right to purchase the exclusive numbered collector's box. Winners announced this Friday at 12:00 PM EST.
          </p>
        </div>

        <button
          onClick={() => toast.success("You are entered into the Hyper-Neon Raffle! Keep your email handy.")}
          className="px-6 py-3.5 rounded-2xl bg-zinc-900 border border-lime-400 text-lime-400 hover:bg-lime-400 hover:text-black font-mono font-black text-xs uppercase tracking-wider transition shadow-lg shadow-lime-500/10 cursor-pointer whitespace-nowrap"
        >
          Enter Verified Raffle
        </button>
      </div>
    </div>
  );
}
