import React, { useState } from "react";
import {
  Cpu,
  Truck,
  ShieldCheck,
  RotateCcw,
  Phone,
  Mail,
  MapPin,
  Send,
  CheckCircle2,
  Lock,
  CreditCard,
  Headphones,
  Laptop,
  Gamepad2,
  Tv,
} from "lucide-react";
import toast from "react-hot-toast";

export default function Footer({
  brandName = "TECHNOVA",
  brandPhone = "+1 (888) 404-TECH",
  brandEmail = "support@technovagear.io",
  brandAddress = "100 Silicon Way, Austin, TX 78701",
  setActivePage,
}) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setSubscribed(true);
    toast.success("Welcome to TechNova Insider! Use promo code TECH15 for 15% off.");
  };

  const handleNav = (page) => {
    if (setActivePage) setActivePage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-white text-slate-600 font-sans border-t border-slate-200 text-left select-none">
      {/* ================= 1. TRUST PILLARS STRIP ================= */}
      <div className="bg-[#F8FAFC] border-b border-slate-200 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5 p-3">
            <div className="w-12 h-12 rounded-2xl bg-yellow-100 text-yellow-800 flex items-center justify-center shrink-0">
              <Truck size={24} />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                Free Fast Delivery
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                On all hardware orders over $99
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                2-Year Comprehensive Warranty
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Full OEM hardware & advance replacement
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center shrink-0">
              <RotateCcw size={24} />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                30-Day Money-Back Trial
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Test drive audio & silicon risk-free
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center shrink-0">
              <Phone size={24} />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                24/7 Expert Tech Support
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Direct live chat & engineer assistance
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= 2. MEGASTORE DIRECTORY ================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand & Newsletter */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-slate-900 text-[#EAB308] flex items-center justify-center font-black">
                <Cpu size={20} />
              </div>
              <span className="text-xl font-black tracking-tight text-slate-900">
                {brandName}
              </span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              Your trusted authorized electronics megastore. Providing high-performance laptops, 
              game consoles, studio audio equipment, 4K televisions, and OEM certified silicon 
              hardware since 2018.
            </p>

            {/* Newsletter */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-slate-900 block">
                Sign Up for Weekly VIP Tech Deals & Save $25
              </span>
              {subscribed ? (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  <span>Promo code <strong>TECH15</strong> unlocked! Applied to your next order.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex max-w-sm gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#EAB308]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-[#EAB308] hover:bg-yellow-500 text-slate-950 font-bold text-xs shrink-0 transition flex items-center gap-1 cursor-pointer"
                  >
                    <span>Subscribe</span>
                    <Send size={12} />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Column: Hardware Categories */}
          <div className="space-y-3">
            <h5 className="font-extrabold text-slate-900 uppercase text-[11px] tracking-wider border-b border-slate-200 pb-2">
              Laptops & Computers
            </h5>
            <ul className="space-y-2 text-xs text-slate-500">
              <li>
                <button
                  onClick={() => handleNav("specs")}
                  className="hover:text-sky-600 transition cursor-pointer"
                >
                  Workstation Laptops
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav("specs")}
                  className="hover:text-sky-600 transition cursor-pointer"
                >
                  Gaming Desktop Towers
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav("specs")}
                  className="hover:text-sky-600 transition cursor-pointer"
                >
                  Convertible Tablets
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav("specs")}
                  className="hover:text-sky-600 transition cursor-pointer"
                >
                  USB 3.0 Flash Drives & SSDs
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav("specs")}
                  className="hover:text-sky-600 transition cursor-pointer"
                >
                  Monitors & Keyboards
                </button>
              </li>
            </ul>
          </div>

          {/* Column: Audio & Entertainment */}
          <div className="space-y-3">
            <h5 className="font-extrabold text-slate-900 uppercase text-[11px] tracking-wider border-b border-slate-200 pb-2">
              Audio & Gaming
            </h5>
            <ul className="space-y-2 text-xs text-slate-500">
              <li>
                <button
                  onClick={() => handleNav("specs")}
                  className="hover:text-sky-600 transition cursor-pointer"
                >
                  Wireless ANC Headphones
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav("specs")}
                  className="hover:text-sky-600 transition cursor-pointer"
                >
                  Multiroom Audio Systems
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav("specs")}
                  className="hover:text-sky-600 transition cursor-pointer"
                >
                  Game Console Controllers
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav("specs")}
                  className="hover:text-sky-600 transition cursor-pointer"
                >
                  Smart 4K OLED Displays
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav("offers")}
                  className="hover:text-sky-600 transition cursor-pointer font-bold text-rose-600"
                >
                  Warehouse Clearance -80%
                </button>
              </li>
            </ul>
          </div>

          {/* Column: Support & Contact */}
          <div className="space-y-3">
            <h5 className="font-extrabold text-slate-900 uppercase text-[11px] tracking-wider border-b border-slate-200 pb-2">
              Customer Support
            </h5>
            <div className="space-y-2.5 text-xs text-slate-500">
              <div className="flex items-start gap-2">
                <Phone size={14} className="text-[#EAB308] mt-0.5 shrink-0" />
                <div>
                  <strong className="text-slate-800 block">Support Hotline:</strong>
                  <a href={`tel:${brandPhone}`} className="hover:text-sky-600">
                    {brandPhone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Mail size={14} className="text-[#EAB308] mt-0.5 shrink-0" />
                <div>
                  <strong className="text-slate-800 block">Email:</strong>
                  <span>{brandEmail}</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin size={14} className="text-[#EAB308] mt-0.5 shrink-0" />
                <div>
                  <strong className="text-slate-800 block">Distribution Center:</strong>
                  <span>{brandAddress}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 mt-10 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {brandName} Electronics Inc. All rights reserved.</p>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1 font-semibold text-slate-700">
              <Lock size={12} className="text-emerald-600" />
              256-Bit SSL Encrypted Checkout
            </span>
            <span className="text-slate-300">•</span>
            <span className="font-mono text-slate-600">VISA / MASTERCARD / AMEX / PAYPAL</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
