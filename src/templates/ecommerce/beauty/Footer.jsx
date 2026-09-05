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
    <footer className="bg-[#FFF8F8] text-rose-900 pt-16 pb-12 border-t border-rose-200/80 text-left text-xs font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Newsletter Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-rose-100 via-pink-50 to-rose-100 border border-rose-200 p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-1.5 text-center lg:text-left">
            <span className="text-rose-600 text-[10px] tracking-widest uppercase font-bold block">
              THE CLEAN BEAUTY DISPATCH
            </span>
            <h3 className="text-xl sm:text-2xl font-serif font-black text-rose-950">
              Receive 15% off your first ritual + clinical skincare guides.
            </h3>
            <p className="text-rose-700/80 text-xs">
              Direct access to dermatologist Q&As, early access drops, and clean beauty news.
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
              className="w-full sm:w-72 bg-white text-xs text-rose-950 placeholder-rose-400 px-4 py-3 rounded-xl border border-rose-200 focus:border-rose-400 focus:outline-none transition shadow-inner"
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap shadow-sm"
            >
              {subscribed ? (
                <>
                  <Check size={14} />
                  <span>Enrolled!</span>
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
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-400 to-pink-600 text-white flex items-center justify-center shadow-sm">
                  <Sparkles size={20} />
                </div>
              )}
              <span className="text-lg font-serif font-black tracking-tight text-rose-950 uppercase">
                {brandName}
              </span>
            </div>

            <p className="text-rose-800/80 leading-relaxed text-xs max-w-sm">
              Clinical-grade botanical skincare developed with multi-weight hyaluronic acid, plant peptides, and barrier ceramides. 100% cruelty-free, vegan, and kind to sensitive skin.
            </p>

            <div className="flex items-center gap-4 text-xs font-semibold text-rose-800">
              <span className="flex items-center gap-1 text-rose-600">
                <Leaf size={14} /> Leaping Bunny Vegan
              </span>
              <span className="flex items-center gap-1 text-rose-600">
                <ShieldCheck size={14} /> EWG Verified Clean
              </span>
            </div>
          </div>

          {/* Col 2: Skincare Formulas */}
          <div className="space-y-3">
            <h5 className="font-bold text-rose-950 uppercase text-[11px] tracking-wider">
              Botanical Steps
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate && onNavigate("catalog", "Cleanse")}
                  className="hover:text-rose-600 transition cursor-pointer text-left text-rose-800"
                >
                  Milky Gentle Cleansers
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate && onNavigate("catalog", "Tone")}
                  className="hover:text-rose-600 transition cursor-pointer text-left text-rose-800"
                >
                  Rose Hydrosol Toners
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate && onNavigate("catalog", "Treat")}
                  className="hover:text-rose-600 transition cursor-pointer text-left text-rose-800"
                >
                  Hyaluronic Dew Drops
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate && onNavigate("catalog", "Moisturize")}
                  className="hover:text-rose-600 transition cursor-pointer text-left text-rose-800"
                >
                  Ceramide Barrier Creams
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Diagnostics */}
          <div className="space-y-3">
            <h5 className="font-bold text-rose-950 uppercase text-[11px] tracking-wider">
              Diagnostic Labs
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate && onNavigate("routines")}
                  className="hover:text-rose-600 transition cursor-pointer text-left text-rose-800"
                >
                  Skin Routine Builder Quiz
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate && onNavigate("shade-finder")}
                  className="hover:text-rose-600 transition cursor-pointer text-left text-rose-800"
                >
                  Virtual Undertone Finder
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate && onNavigate("ingredients")}
                  className="hover:text-rose-600 transition cursor-pointer text-left text-rose-800"
                >
                  Ingredient Transparency Deck
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate && onNavigate("offers")}
                  className="hover:text-rose-600 transition cursor-pointer text-left text-rose-800"
                >
                  Ritual Sets & VIP Vouchers
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Skin Concierge */}
          <div className="space-y-3">
            <h5 className="font-bold text-rose-950 uppercase text-[11px] tracking-wider">
              Skin Concierge
            </h5>
            <div className="space-y-2 text-xs">
              <a
                href={`tel:${brandPhone}`}
                className="flex items-center gap-1.5 text-rose-950 hover:text-rose-600 font-semibold transition"
              >
                <Phone size={13} className="text-rose-500" />
                <span>{brandPhone}</span>
              </a>
              <a
                href={`mailto:${brandEmail}`}
                className="flex items-center gap-1.5 text-rose-800 hover:text-rose-600 transition truncate"
              >
                <Mail size={13} className="text-rose-500" />
                <span>{brandEmail}</span>
              </a>
              {brandAddress && (
                <div className="flex items-start gap-1.5 text-rose-700/80 pt-1">
                  <MapPin size={13} className="text-rose-500 flex-shrink-0 mt-0.5" />
                  <span className="leading-tight">{brandAddress}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Certifications Ribbon */}
        <div className="pt-8 border-t border-rose-200/80 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 text-[10px] text-rose-700 font-medium">
            <span className="px-2.5 py-1 rounded-lg bg-rose-100 border border-rose-200 text-rose-900 font-bold">
              ★ Leaping Bunny Cruelty-Free
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-rose-100 border border-rose-200 text-rose-900">
              100% Post-Consumer Recycled Glass
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-rose-100 border border-rose-200 text-rose-900">
              Zero Synthetic Fragrances
            </span>
          </div>

          <div className="text-[11px] text-rose-600">
            © {new Date().getFullYear()} {brandName}. Radiant, calm skin formulated by nature and science.
          </div>
        </div>
      </div>
    </footer>
  );
}
