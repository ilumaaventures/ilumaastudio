import React from "react";
import { ChevronDown, Globe } from "lucide-react";

function TopBar() {
  return (
    <div className="bg-[#1e293b] text-white text-xs border-b border-slate-700/50 py-1.5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left Promo Message */}
        <div className="flex items-center gap-3 font-medium">
          <span className="tracking-wide text-slate-200 uppercase text-[11px] font-semibold">
            EXTRA 10% OFF ON PREPAID ORDERS
          </span>
          <a
            href="/shop"
            className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider transition-colors shadow-sm"
          >
            SHOP NOW
          </a>
        </div>

        {/* Right Links & Selectors */}
        <div className="hidden md:flex items-center gap-5 text-slate-300 text-[11px]">
          <a href="/track-order" className="hover:text-white transition-colors">
            Track Order
          </a>
          <span className="text-slate-600">|</span>
          <a href="/help" className="hover:text-white transition-colors">
            Help Center
          </a>
          <span className="text-slate-600">|</span>
          <a
            href="/businessRegistration"
            className="hover:text-white transition-colors"
          >
            Sell on ILumaaStudio
          </a>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-1 cursor-pointer hover:text-white transition-colors">
            <Globe size={13} className="text-slate-400" />
            <span>English</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-0.5 cursor-pointer hover:text-white transition-colors font-semibold">
            <span>INR</span>
            <ChevronDown size={12} className="text-slate-400" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopBar;
