import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function ServicePromoBanner({
  badge = "Special Offer",
  title = "Get ₹200 OFF on First Home Cleaning or AC Service!",
  description = "Use coupon code STUDIOHOME at checkout. Valid on all verified doorstep appointments.",
  couponCode = "STUDIOHOME",
  ctaText = "Claim Offer",
  ctaLink = "/services",
  bgGradient = "from-blue-900 via-indigo-900 to-slate-900",
  badgeBg = "bg-blue-500/30 text-blue-300 border-blue-400/20",
}) {
  return (
    <div className={`relative rounded-3xl bg-gradient-to-r ${bgGradient} text-white p-6 sm:p-8 overflow-hidden shadow-lg flex flex-col md:flex-row items-center justify-between gap-6`}>
      <div className="space-y-2 z-10 max-w-xl">
        <span className={`px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider border ${badgeBg}`}>
          {badge}
        </span>
        <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
          {title}
        </h3>
        <p className="text-xs text-slate-300 font-medium">
          {description}{" "}
          {couponCode && (
            <span className="font-bold text-amber-300">{couponCode}</span>
          )}
        </p>
      </div>

      <Link
        to={ctaLink}
        className="bg-white hover:bg-slate-100 text-slate-900 px-6 py-3 rounded-2xl text-xs font-black transition-all shadow-md shrink-0 flex items-center gap-1.5 cursor-pointer z-10"
      >
        <span>{ctaText}</span>
        <ArrowRight size={15} />
      </Link>

      <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
}
