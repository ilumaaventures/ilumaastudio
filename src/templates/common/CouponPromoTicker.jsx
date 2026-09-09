import React, { useState } from "react";
import { Tag, Copy, Check, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

export default function CouponPromoTicker({ coupons = [], theme = "dark" }) {
  const [copiedCode, setCopiedCode] = useState(null);

  if (!coupons || coupons.length === 0) return null;

  const handleCopy = (code) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Coupon code ${code} copied to clipboard! 🎉`);
    setTimeout(() => {
      setCopiedCode(null);
    }, 3000);
  };

  const isLight = theme === "light";

  return (
    <div
      className={`w-full py-2 px-4 text-xs select-none transition-colors border-b ${
        isLight
          ? "bg-amber-50/90 text-amber-950 border-amber-200/70"
          : "bg-[#121212] text-neutral-200 border-neutral-800"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-0.5">
          <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[11px] shrink-0 text-amber-400">
            <Sparkles size={13} className="animate-pulse text-amber-400" />
            <span>Store Offers</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {coupons.map((coupon) => (
              <div
                key={coupon._id || coupon.code}
                className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
                  isLight
                    ? "bg-white text-slate-800 border-amber-200 shadow-2xs"
                    : "bg-white/10 text-white border-white/20"
                }`}
              >
                <Tag size={12} className="text-amber-400 shrink-0" />
                <span className="font-semibold">{coupon.description || coupon.title || coupon.code}</span>
                <button
                  onClick={() => handleCopy(coupon.code)}
                  className={`inline-flex items-center gap-1 font-mono font-bold px-2 py-0.5 rounded text-[10px] uppercase transition cursor-pointer ${
                    copiedCode === coupon.code
                      ? "bg-emerald-600 text-white"
                      : isLight
                      ? "bg-amber-100 hover:bg-amber-200 text-amber-900"
                      : "bg-white/20 hover:bg-white/30 text-amber-300"
                  }`}
                  title="Click to copy coupon code"
                >
                  {copiedCode === coupon.code ? (
                    <>
                      <Check size={10} />
                      <span>COPIED</span>
                    </>
                  ) : (
                    <>
                      <span>{coupon.code}</span>
                      <Copy size={9} />
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3 text-[11px] opacity-75 ml-auto">
          <span>Apply at checkout for instant savings</span>
        </div>
      </div>
    </div>
  );
}
