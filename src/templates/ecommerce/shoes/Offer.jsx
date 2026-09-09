import React, { useState } from "react";
import {
  Flame,
  Tag,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
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
      code: "FIRST 250",
      title: "First Purchase Super Discount",
      badge: "SAVE $25",
      discount: "$25.00 Off",
      description:
        "Welcome coupon for all new footwear enthusiasts. Applies on any retro basketball or running sneaker drop.",
      expiry: "Valid for Next 48 Hours",
      minSpend: "Orders over $100",
    },
    {
      id: "bundle-2",
      code: "WINTERDROP",
      title: "Winter Collection Duo Pack",
      badge: "20% OFF",
      discount: "Save 20% on 2 Pairs",
      description:
        "Score both a high-traction court sneaker and a daily runner in matching collector colorways.",
      expiry: "Limited to First 50 Buyers",
      minSpend: "Min. 2 Silhouettes",
    },
    {
      id: "bundle-3",
      code: "FREECLEANKIT",
      title: "Sneaker Care & Cleaning Kit",
      badge: "COMPLIMENTARY GIFT",
      discount: "Worth $25 Free",
      description:
        "Receive our laboratory-grade foam cleaner, natural bristle brush, and stain repellent free on orders above $120.",
      expiry: "Automatic at Dispatch",
      minSpend: "Orders over $120",
    },
  ];

  const dropOffers = offers && offers.length > 0 ? offers : defaultDrops;

  const handleCopy = (code) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    toast.success(`Coupon code ${code} copied to clipboard! 👟`);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 font-sans text-left">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold border border-blue-200">
          <Flame size={14} className="text-rose-600" />
          <span>EXCLUSIVE FOOTWEAR CAMPAIGNS & PROMOS</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Member Coupons & Seasonal Drops
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-normal">
          Use these verified discount vouchers during checkout to score instant savings on authentic deadstock pairs.
        </p>
      </div>

      {/* Offer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {dropOffers.map((item) => (
          <div
            key={item.id || item.code}
            className="bg-white rounded-2xl border border-slate-200 hover:border-blue-500/80 p-6 sm:p-7 flex flex-col justify-between space-y-6 relative overflow-hidden transition-all shadow-xs hover:shadow-md group"
          >
            {/* Top Badge */}
            <div className="flex items-center justify-between">
              <span className="bg-blue-50 text-blue-900 border border-blue-200 text-[10px] font-black uppercase px-2.5 py-1 rounded-lg">
                {item.badge || "SPECIAL CAMPAIGN"}
              </span>
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Clock size={12} />
                {item.expiry}
              </span>
            </div>

            {/* Content */}
            <div className="space-y-2">
              <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-700 transition">
                {item.title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {item.description}
              </p>
              <span className="text-[11px] text-slate-400 font-medium block">
                Conditions: {item.minSpend}
              </span>
            </div>

            {/* Code Copy & CTA */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[9px] text-slate-400 block uppercase font-bold">DISCOUNT CODE</span>
                  <span className="text-sm font-black text-slate-900 tracking-wider">
                    {item.code}
                  </span>
                </div>
                <button
                  onClick={() => handleCopy(item.code)}
                  className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                >
                  {copiedCode === item.code ? (
                    <>
                      <Check size={14} className="text-emerald-600" />
                      <span className="text-emerald-600 text-[10px]">COPIED</span>
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
                className="w-full py-2.5 rounded-xl bg-[#1E3A8A] hover:bg-blue-800 text-white font-black text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2 shadow-xs"
              >
                <span>Shop Footwear</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Sneakerhead Raffle Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-red-600/20 text-red-400 text-[10px] font-bold border border-red-500/30">
            <Gift size={12} />
            <span>MEMBER RAFFLE ENTRY</span>
          </div>
          <h3 className="text-xl font-black uppercase">
            Air Jordan 1 "Chicago Reimagined" 1-of-100 Allocation
          </h3>
          <p className="text-xs text-slate-300 max-w-xl">
            Registered members enter free for the allocation right to purchase the exclusive numbered collector edition.
          </p>
        </div>

        <button
          onClick={() => toast.success("You are entered into the member drop raffle! Keep an eye on your inbox.")}
          className="px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider transition shadow-md cursor-pointer whitespace-nowrap"
        >
          Enter Free Raffle
        </button>
      </div>
    </div>
  );
}
