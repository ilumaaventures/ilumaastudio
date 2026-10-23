import React, { useState } from "react";
import { Tag, Copy, Check, Clock, Store, MapPin } from "lucide-react";
import toast from "react-hot-toast";

export default function NearbyOfferCard({ offer }) {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    if (offer.code) {
      navigator.clipboard.writeText(offer.code);
      setCopied(true);
      toast.success(`Promo code "${offer.code}" copied! (Sample discount code)`);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="group bg-gradient-to-br from-red-500/5 via-white to-amber-500/5 rounded-3xl border border-red-200/80 hover:border-red-400 p-5 shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4">
      <div className="space-y-3">
        {/* Top Badges */}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-black">
            <Tag size={12} />
            <span>{offer.discount}</span>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500">
            <MapPin size={11} className="text-red-500" />
            <span>{offer.distanceKm} km away</span>
          </div>
        </div>

        {/* Business Name */}
        <div className="flex items-center gap-1.5 text-xs text-slate-600 font-bold">
          <Store size={13} className="text-red-600 shrink-0" />
          <span>{offer.businessName}</span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-400">{offer.area}</span>
        </div>

        {/* Offer Title */}
        <h3 className="font-black text-slate-900 text-base leading-snug group-hover:text-red-600 transition-colors">
          {offer.title}
        </h3>

        {/* Offer Description */}
        <p className="text-xs text-slate-500 leading-relaxed">
          {offer.description}
        </p>

        {/* Validity */}
        <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
          <Clock size={11} />
          <span>{offer.validTill}</span>
        </div>
      </div>

      {/* Code Copy & CTA */}
      <div className="pt-3 border-t border-red-100 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={handleCopyCode}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-xs font-mono font-black transition cursor-pointer"
          title="Click to copy promo code"
        >
          <span>{offer.code}</span>
          {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} className="text-slate-400" />}
        </button>

        <button
          type="button"
          onClick={handleCopyCode}
          className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold shadow-sm shadow-red-500/20 transition-all cursor-pointer"
        >
          <span>Claim Offer</span>
        </button>
      </div>
    </div>
  );
}
