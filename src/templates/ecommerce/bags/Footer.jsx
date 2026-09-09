import React, { useState } from "react";
import {
  Leaf,
  ShieldCheck,
  Truck,
  Heart,
  ArrowRight,
} from "lucide-react";
import toast from "react-hot-toast";

export default function Footer({
  brandName = "KRAFT & CANVAS",
  setActivePage = () => {},
}) {
  return (
    <footer className="bg-white text-slate-600 border-t border-slate-200 text-xs font-sans text-left">
      {/* 4 Trust Pillars */}
      <div className="border-b border-slate-100 py-8 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <Leaf size={20} className="mx-auto text-emerald-700" />
            <h5 className="font-bold text-slate-800 text-xs uppercase">Sustainable Materials</h5>
            <p className="text-[11px] text-slate-500">100% organic cotton & vegetable-tanned leather</p>
          </div>
          <div className="space-y-1">
            <ShieldCheck size={20} className="mx-auto text-[#A0522D]" />
            <h5 className="font-bold text-slate-800 text-xs uppercase">Lifetime Craftsmanship</h5>
            <p className="text-[11px] text-slate-500">Every buckle and seam guaranteed for life</p>
          </div>
          <div className="space-y-1">
            <Truck size={20} className="mx-auto text-slate-700" />
            <h5 className="font-bold text-slate-800 text-xs uppercase">Carbon Neutral Shipping</h5>
            <p className="text-[11px] text-slate-500">Free delivery on orders over $50</p>
          </div>
          <div className="space-y-1">
            <Heart size={20} className="mx-auto text-rose-600" />
            <h5 className="font-bold text-slate-800 text-xs uppercase">30-Day Trail Trial</h5>
            <p className="text-[11px] text-slate-500">Take it on your journeys with free returns</p>
          </div>
        </div>
      </div>

      {/* Directory Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="space-y-2 col-span-2 md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-sm bg-[#A0522D] text-white flex items-center justify-center font-serif font-black text-xs">
              🎒
            </div>
            <span className="font-serif font-bold text-slate-900 tracking-wider">
              {brandName}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Unique, sustainable backpacks and outdoor daypacks handcrafted for mindful wanderers, explorers, and commuters.
          </p>
        </div>

        <div className="space-y-2">
          <h6 className="font-serif font-bold text-slate-800 uppercase tracking-wider text-[11px]">
            Collections
          </h6>
          <ul className="space-y-1.5 text-[11px] text-slate-500">
            <li>
              <button onClick={() => setActivePage("catalog")} className="hover:text-slate-900 cursor-pointer">
                Corin Leather Packs
              </button>
            </li>
            <li>
              <button onClick={() => setActivePage("catalog")} className="hover:text-slate-900 cursor-pointer">
                Heritage Waxed Canvas
              </button>
            </li>
            <li>
              <button onClick={() => setActivePage("catalog")} className="hover:text-slate-900 cursor-pointer">
                Field Messenger Bags
              </button>
            </li>
            <li>
              <button onClick={() => setActivePage("catalog")} className="hover:text-slate-900 cursor-pointer">
                Expedition Rolltops
              </button>
            </li>
          </ul>
        </div>

        <div className="space-y-2">
          <h6 className="font-serif font-bold text-slate-800 uppercase tracking-wider text-[11px]">
            Customer Support
          </h6>
          <ul className="space-y-1.5 text-[11px] text-slate-500">
            <li className="hover:text-slate-900 cursor-pointer">Track Your Package</li>
            <li className="hover:text-slate-900 cursor-pointer">Leather Care & Wax Guide</li>
            <li className="hover:text-slate-900 cursor-pointer">Repairs & Warranty</li>
            <li className="hover:text-slate-900 cursor-pointer">Returns & Exchanges</li>
          </ul>
        </div>

        <div className="space-y-2">
          <h6 className="font-serif font-bold text-slate-800 uppercase tracking-wider text-[11px]">
            Sustainable Ethos
          </h6>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Every purchase helps plant native trees and supports zero-waste circular leather workshops.
          </p>
        </div>
      </div>

      <div className="border-t border-slate-100 py-4 text-center text-[11px] text-slate-400">
        © 2026 {brandName}. Sustainable carry goods designed for a lifetime.
      </div>
    </footer>
  );
}
