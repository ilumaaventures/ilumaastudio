import React, { useState } from "react";
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Headphones,
  Mail,
  ArrowRight,
  Heart,
  Tag,
} from "lucide-react";
import toast from "react-hot-toast";

export default function Footer({
  brandName = "KICKS VAULT",
  setActivePage = () => {},
}) {
  const [emailInput, setEmailInput] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    toast.success("Subscribed to sneaker drop alerts! 👟");
    setEmailInput("");
  };

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 font-sans text-left">
      {/* Newsletter Signup Strip */}
      <div className="border-b border-slate-800 py-10 bg-slate-950/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-lg font-black text-white uppercase tracking-tight">
              Get 15% Off Your Next Sneaker Drop
            </h4>
            <p className="text-xs text-slate-400">
              Sign up for launch notifications, restock alerts, and members-only promo codes.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="flex w-full md:w-auto gap-2">
            <input
              type="email"
              placeholder="Enter your email address..."
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="w-full md:w-72 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#1E3A8A] hover:bg-blue-800 text-white font-black text-xs uppercase tracking-wider rounded-xl transition cursor-pointer shrink-0 shadow-sm"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main 4-Column Directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-xs">
        {/* Col 1: Brand & Philosophy */}
        <div className="space-y-3 col-span-2 md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#1E3A8A] text-white flex items-center justify-center font-black text-sm">
              👟
            </div>
            <span className="text-base font-black text-white tracking-tight">
              {brandName}
            </span>
          </div>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            Curated archive of authentic retro basketball, high-velocity marathon runners, and limited streetwear drops.
          </p>
        </div>

        {/* Col 2: Shop Directory */}
        <div className="space-y-2">
          <h5 className="font-black text-white uppercase tracking-wider text-[11px]">
            Shop Footwear
          </h5>
          <ul className="space-y-1.5 text-slate-400">
            <li>
              <button
                onClick={() => setActivePage("catalog")}
                className="hover:text-white transition cursor-pointer"
              >
                Men's Shoes
              </button>
            </li>
            <li>
              <button
                onClick={() => setActivePage("catalog")}
                className="hover:text-white transition cursor-pointer"
              >
                Women's Shoes
              </button>
            </li>
            <li>
              <button
                onClick={() => setActivePage("catalog")}
                className="hover:text-white transition cursor-pointer"
              >
                Winter Collections
              </button>
            </li>
            <li>
              <button
                onClick={() => setActivePage("catalog")}
                className="hover:text-white transition cursor-pointer"
              >
                Nike Dunk & Retro
              </button>
            </li>
            <li>
              <button
                onClick={() => setActivePage("catalog")}
                className="hover:text-white transition cursor-pointer"
              >
                Free Metcon Trainers
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: Customer Support */}
        <div className="space-y-2">
          <h5 className="font-black text-white uppercase tracking-wider text-[11px]">
            Customer Care
          </h5>
          <ul className="space-y-1.5 text-slate-400">
            <li className="hover:text-white cursor-pointer">Order Tracking</li>
            <li className="hover:text-white cursor-pointer">Size Guide & Fit Chart</li>
            <li className="hover:text-white cursor-pointer">Free 30-Day Returns</li>
            <li className="hover:text-white cursor-pointer">Authenticity Guarantee</li>
            <li className="hover:text-white cursor-pointer">Shipping & Dispatch</li>
          </ul>
        </div>

        {/* Col 4: Legal & Badges */}
        <div className="space-y-2">
          <h5 className="font-black text-white uppercase tracking-wider text-[11px]">
            Verified Secure
          </h5>
          <p className="text-[11px] text-slate-400">
            Every shoe dispatched undergoes 12-point authentication, UV blacklight examination, and tamper-proof verification.
          </p>
          <div className="pt-2 flex items-center gap-2 text-slate-400">
            <span className="px-2 py-1 bg-slate-800 rounded text-[10px] font-bold text-white border border-slate-700">
              VISA
            </span>
            <span className="px-2 py-1 bg-slate-800 rounded text-[10px] font-bold text-white border border-slate-700">
              MC
            </span>
            <span className="px-2 py-1 bg-slate-800 rounded text-[10px] font-bold text-white border border-slate-700">
              AMEX
            </span>
            <span className="px-2 py-1 bg-slate-800 rounded text-[10px] font-bold text-white border border-slate-700">
              PAYPAL
            </span>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-slate-800/80 py-5 text-center text-[11px] text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 {brandName}. All rights reserved.</span>
          <span className="text-slate-400">
            Designed for authentic sneaker enthusiasts.
          </span>
        </div>
      </div>
    </footer>
  );
}
