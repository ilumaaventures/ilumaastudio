import React, { useState } from "react";
import {
  ShieldCheck,
  Truck,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Clock,
} from "lucide-react";
import toast from "react-hot-toast";

export default function Footer({
  brandName = "LUXE & CO. HAUTE JOAILLERIE",
  brandPhone = "+1 (800) 777-LUXE",
  brandEmail = "concierge@luxejewels.com",
  onNavigate,
  onSelectCategory,
  onOpenShowroom,
}) {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter a valid email address.");
      return;
    }
    toast.success("Thank you for subscribing to our private jewelry releases! ✨");
    setEmail("");
  };

  return (
    <footer className="bg-[#191919] text-stone-300 pt-16 pb-12 border-t border-stone-800 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {/* 4 Brand Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-stone-800">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center text-[#AA771C] shrink-0">
              <Truck size={18} />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-white font-semibold text-xs uppercase tracking-wider">
                Insured Armored Courier
              </h4>
              <p className="text-[11px] text-stone-400">
                Discreet worldwide armored delivery with adult signature required.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center text-[#AA771C] shrink-0">
              <ShieldCheck size={18} />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-white font-semibold text-xs uppercase tracking-wider">
                100% Conflict-Free
              </h4>
              <p className="text-[11px] text-stone-400">
                Certified ethical gemstones adhering to strict Kimberley Process standards.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center text-[#AA771C] shrink-0">
              <Sparkles size={18} />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-white font-semibold text-xs uppercase tracking-wider">
                Lifetime Care & Polish
              </h4>
              <p className="text-[11px] text-stone-400">
                Complimentary prong inspection and ultrasonic cleaning at our showroom.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center text-[#AA771C] shrink-0">
              <Clock size={18} />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-white font-semibold text-xs uppercase tracking-wider">
                Showroom Consultations
              </h4>
              <p className="text-[11px] text-stone-400">
                Private appointments with certified master gemologists.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#AA771C] text-white flex items-center justify-center font-serif text-base font-bold">
                L
              </div>
              <span className="text-lg font-bold font-serif text-white">{brandName}</span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              Having an exclusive range of handmade jewelry. Designed for timeless distinction, using 18k solid gold, 925 sterling silver, and ethically cut diamonds.
            </p>
            <div className="space-y-1.5 text-xs text-stone-400 pt-1">
              <p className="flex items-center gap-2">
                <Phone size={13} className="text-[#AA771C]" /> {brandPhone}
              </p>
              <p className="flex items-center gap-2">
                <Mail size={13} className="text-[#AA771C]" /> {brandEmail}
              </p>
              <p className="flex items-center gap-2">
                <MapPin size={13} className="text-[#AA771C]" /> 680 Fifth Avenue, New York, NY 10019
              </p>
            </div>
          </div>

          {/* Collections */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Collections
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              {["Bracelets", "Earrings", "Gold Set", "Necklaces", "Silver Set", "Rings"].map((cat) => (
                <li key={cat}>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectCategory?.(cat);
                      onNavigate?.("catalog");
                    }}
                    className="hover:text-white transition cursor-pointer"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Atelier Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Atelier Services
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button
                  type="button"
                  onClick={onOpenShowroom}
                  className="hover:text-white transition cursor-pointer"
                >
                  Book Showroom Visit
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate?.("catalog")}
                  className="hover:text-white transition cursor-pointer"
                >
                  Ring Sizing Guide
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate?.("catalog")}
                  className="hover:text-white transition cursor-pointer"
                >
                  Diamond Certification
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate?.("catalog")}
                  className="hover:text-white transition cursor-pointer"
                >
                  Custom Bespoke Commissions
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Private Registry
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Receive confidential gemological releases and VIP invitations.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="w-full px-3.5 py-2 bg-stone-800 border border-stone-700 rounded text-xs text-white placeholder:text-stone-500 focus:outline-none focus:border-[#AA771C]"
              />
              <button
                type="submit"
                className="w-full py-2 bg-[#AA771C] hover:bg-[#936616] text-white text-xs font-semibold rounded uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Subscribe</span>
                <ArrowRight size={12} />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} {brandName}. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-stone-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-stone-400 cursor-pointer">Terms & Conditions</span>
            <span className="hover:text-stone-400 cursor-pointer">Kimberley Process</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
