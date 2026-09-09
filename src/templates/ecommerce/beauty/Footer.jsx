import React, { useState } from "react";
import {
  Sparkles,
  Droplets,
  Heart,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Check,
  ArrowRight,
  Leaf,
} from "lucide-react";
import toast from "react-hot-toast";

export default function Footer({
  brandName = "GLOW BEAUTY",
  brandLogo = null,
  brandPhone = "+1 (800) 829-GLOW",
  brandEmail = "concierge@glowbeauty.com",
  brandAddress = "450 Botanical Way, Malibu, CA 90265",
  onNavigate,
}) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setSubscribed(true);
    toast.success("Welcome to Glow Society! Your 15% discount code 'GLOW15' is ready. 🌸");
    setEmail("");
    setTimeout(() => setSubscribed(false), 5000);
  };

  return (
    <footer className="bg-[#FAF8F5] text-stone-800 pt-16 pb-12 border-t border-[#E8E2D9] text-left text-xs font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Newsletter Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-[#F7EFE9] via-[#FAF5F0] to-[#F3ECE4] border border-[#E5DDD2] p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="space-y-1.5 text-center lg:text-left">
            <span className="text-[#8F9E68] text-[11px] tracking-widest uppercase font-bold block">
              THE BOTANICAL DISPATCH
            </span>
            <h3 className="text-xl sm:text-2xl font-serif font-black text-[#2D2A26]">
              Receive 15% off your first ritual + clinical skincare guides.
            </h3>
            <p className="text-stone-600 text-xs">
              Direct access to dermatologist Q&As, seasonal launches, and pure formulation science.
            </p>
          </div>

          <form
            onSubmit={handleSubscribe}
            className="w-full lg:w-auto flex flex-col sm:flex-row items-center gap-2 max-w-md"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              className="w-full sm:w-72 bg-white text-xs text-stone-900 placeholder-stone-400 px-4 py-3 rounded-full border border-stone-200 focus:border-[#8F9E68] focus:outline-none transition shadow-inner"
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#8F9E68] hover:bg-[#7D8C57] text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap shadow-sm active:scale-95"
            >
              {subscribed ? (
                <>
                  <Check size={14} />
                  <span>Subscribed!</span>
                </>
              ) : (
                <>
                  <span>Join Ritual</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              {brandLogo ? (
                <img
                  src={brandLogo}
                  alt={brandName}
                  className="h-9 w-auto max-w-[130px] object-contain"
                />
              ) : (
                <div className="w-10 h-10 rounded-2xl bg-[#8F9E68] text-white flex items-center justify-center shadow-sm">
                  <Sparkles size={20} />
                </div>
              )}
              <span className="text-lg font-serif font-black tracking-widest text-[#2D2A26] uppercase">
                {brandName}
              </span>
            </div>

            <p className="text-stone-600 leading-relaxed text-xs max-w-sm">
              Clinical-grade botanical skincare developed with pure plant lipids, cold-pressed seed oils, and restorative ceramides. 100% cruelty-free, clean, and dermatologist tested.
            </p>

            <div className="flex items-center gap-4 text-xs font-semibold text-stone-700">
              <span className="flex items-center gap-1 text-[#8F9E68]">
                <Leaf size={14} /> Leaping Bunny Vegan
              </span>
              <span className="flex items-center gap-1 text-[#8F9E68]">
                <ShieldCheck size={14} /> Clean Certified
              </span>
            </div>
          </div>

          {/* Col 2: Skincare Formulas */}
          <div className="space-y-3">
            <h5 className="font-bold text-[#2D2A26] uppercase text-[11px] tracking-wider">
              Botanical Care
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate && onNavigate("catalog", "Cleanse")}
                  className="hover:text-[#8F9E68] transition cursor-pointer text-left text-stone-600"
                >
                  Milky Gentle Cleansers
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate && onNavigate("catalog", "Toners")}
                  className="hover:text-[#8F9E68] transition cursor-pointer text-left text-stone-600"
                >
                  Balancing Toners & Mists
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate && onNavigate("catalog", "Serums")}
                  className="hover:text-[#8F9E68] transition cursor-pointer text-left text-stone-600"
                >
                  Smoothing Essences & Drops
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate && onNavigate("catalog", "Moisturizers")}
                  className="hover:text-[#8F9E68] transition cursor-pointer text-left text-stone-600"
                >
                  Barrier Hydration Creams
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Labs & Benefits */}
          <div className="space-y-3">
            <h5 className="font-bold text-[#2D2A26] uppercase text-[11px] tracking-wider">
              Skin Science
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate && onNavigate("home")}
                  className="hover:text-[#8F9E68] transition cursor-pointer text-left text-stone-600"
                >
                  Before & After Clinicals
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate && onNavigate("catalog")}
                  className="hover:text-[#8F9E68] transition cursor-pointer text-left text-stone-600"
                >
                  Winter Body Care Series
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate && onNavigate("catalog")}
                  className="hover:text-[#8F9E68] transition cursor-pointer text-left text-stone-600"
                >
                  Pure Cold-Pressed Hemp Oil
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate && onNavigate("offers")}
                  className="hover:text-[#8F9E68] transition cursor-pointer text-left text-stone-600"
                >
                  Seasonal Gift Sets
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Skin Concierge */}
          <div className="space-y-3">
            <h5 className="font-bold text-[#2D2A26] uppercase text-[11px] tracking-wider">
              Skin Concierge
            </h5>
            <div className="space-y-2 text-xs">
              <a
                href={`tel:${brandPhone}`}
                className="flex items-center gap-1.5 text-stone-800 hover:text-[#8F9E68] font-semibold transition"
              >
                <Phone size={13} className="text-[#8F9E68]" />
                <span>{brandPhone}</span>
              </a>
              <a
                href={`mailto:${brandEmail}`}
                className="flex items-center gap-1.5 text-stone-600 hover:text-[#8F9E68] transition truncate"
              >
                <Mail size={13} className="text-[#8F9E68]" />
                <span>{brandEmail}</span>
              </a>
              {brandAddress && (
                <div className="flex items-start gap-1.5 text-stone-500 pt-1">
                  <MapPin size={13} className="text-[#8F9E68] flex-shrink-0 mt-0.5" />
                  <span className="leading-tight">{brandAddress}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Certifications Ribbon */}
        <div className="pt-8 border-t border-stone-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-stone-600 font-medium">
            <span className="px-3 py-1 rounded-full bg-[#EAE5DE] border border-[#DDD6CC] text-stone-800 font-bold">
              ★ Leaping Bunny Cruelty-Free
            </span>
            <span className="px-3 py-1 rounded-full bg-[#EAE5DE] border border-[#DDD6CC] text-stone-800">
              100% Recycled Sustainable Glass
            </span>
            <span className="px-3 py-1 rounded-full bg-[#EAE5DE] border border-[#DDD6CC] text-stone-800">
              Zero Synthetic Fragrances
            </span>
          </div>

          <div className="text-[11px] text-stone-500">
            © {new Date().getFullYear()} {brandName}. Formulated with pure botanical extracts and dermatological care.
          </div>
        </div>
      </div>
    </footer>
  );
}
