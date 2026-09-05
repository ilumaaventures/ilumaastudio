import React, { useState } from "react";
import {
  Briefcase,
  Award,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  Check,
  ArrowRight,
} from "lucide-react";
import toast from "react-hot-toast";

export default function Footer({
  brandName = "CUIR & CO.",
  brandLogo = null,
  brandPhone = "+39 055 289 400",
  brandEmail = "concierge@cuirandco.it",
  brandAddress = "Via de' Benci 24, 50122 Firenze, Italy",
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
    toast.success("Welcome to the Cuir & Co. Atelier Society! A complimentary leather care guide has been sent. 📜");
    setEmail("");
    setTimeout(() => setSubscribed(false), 5000);
  };

  return (
    <footer className="bg-[#2C1810] text-[#D5C7B8] pt-16 pb-12 border-t border-[#8C6D58]/40 text-left text-xs font-serif">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Newsletter Banner */}
        <div className="rounded-3xl bg-[#3D2217] border border-[#8C6D58]/40 p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1.5 text-center lg:text-left">
            <span className="text-[#FBBF24] text-[10px] tracking-widest uppercase font-bold block">
              THE FLORENTINE ATELIER JOURNAL
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-[#FAF7F2]">
              Join the Guild for limited hide releases & care invitations.
            </h3>
            <p className="text-[#A08C7D] text-xs font-sans">
              Receive complimentary beeswax leather balm with your first heritage acquisition.
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
              placeholder="traveler@domain.com"
              className="w-full sm:w-72 bg-[#2C1810] text-xs text-[#FAF7F2] placeholder-[#8C6D58] px-4 py-3 rounded-xl border border-[#8C6D58]/60 focus:border-[#FBBF24] focus:outline-none transition font-sans shadow-inner"
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap shadow"
            >
              {subscribed ? (
                <>
                  <Check size={14} />
                  <span>Enrolled!</span>
                </>
              ) : (
                <>
                  <span>Join Atelier</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              {brandLogo ? (
                <img
                  src={brandLogo}
                  alt={brandName}
                  className="h-8 w-auto max-w-[130px] object-contain brightness-0 invert"
                />
              ) : (
                <div className="w-9 h-9 rounded-xl bg-[#FAF7F2] text-[#2C1810] flex items-center justify-center shadow-md">
                  <Briefcase size={18} className="text-[#B45309]" />
                </div>
              )}
              <span className="text-lg font-black tracking-widest text-[#FAF7F2] uppercase">
                {brandName}
              </span>
            </div>

            <p className="text-[#A08C7D] leading-relaxed text-xs max-w-sm font-sans">
              Vegetable-tanned leather briefcases, travel weekenders, and daypack silhouettes handcrafted in Florence using traditional unhurried methods.
            </p>

            <div className="flex items-center gap-4 text-xs text-[#D5C7B8]">
              <span className="flex items-center gap-1 text-[#FBBF24]">
                <ShieldCheck size={14} /> Lifetime Stitching
              </span>
              <span className="flex items-center gap-1 text-[#FBBF24]">
                <Award size={14} /> Certified Tuscan Tannery
              </span>
            </div>
          </div>

          {/* Col 2: Silhouettes */}
          <div className="space-y-3">
            <h5 className="font-bold text-[#FAF7F2] uppercase text-[11px] tracking-wider">
              Leather Silhouettes
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate && onNavigate("catalog", "Briefcases")}
                  className="hover:text-[#FBBF24] transition cursor-pointer text-left"
                >
                  Executive Briefcases
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate && onNavigate("catalog", "Weekenders & Duffels")}
                  className="hover:text-[#FBBF24] transition cursor-pointer text-left"
                >
                  48-Hour Duffels
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate && onNavigate("catalog", "Totes")}
                  className="hover:text-[#FBBF24] transition cursor-pointer text-left"
                >
                  Sculpted Day Totes
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate && onNavigate("catalog", "Backpacks")}
                  className="hover:text-[#FBBF24] transition cursor-pointer text-left"
                >
                  Roll-Top Commuter Packs
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Atelier Studios */}
          <div className="space-y-3">
            <h5 className="font-bold text-[#FAF7F2] uppercase text-[11px] tracking-wider">
              Atelier Services
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate && onNavigate("monogram")}
                  className="hover:text-[#FBBF24] transition cursor-pointer text-left"
                >
                  Bespoke 24k Monogramming
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate && onNavigate("leather-craft")}
                  className="hover:text-[#FBBF24] transition cursor-pointer text-left"
                >
                  Tuscan Vegetable Tanning
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate && onNavigate("offers")}
                  className="hover:text-[#FBBF24] transition cursor-pointer text-left"
                >
                  Curated Travel Bundles
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate && onNavigate("warranty")}
                  className="hover:text-[#FBBF24] transition cursor-pointer text-left"
                >
                  Lifetime Repair Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Concierge */}
          <div className="space-y-3">
            <h5 className="font-bold text-[#FAF7F2] uppercase text-[11px] tracking-wider">
              Florence Concierge
            </h5>
            <div className="space-y-2 text-xs">
              <a
                href={`tel:${brandPhone}`}
                className="flex items-center gap-1.5 text-[#FAF7F2] hover:text-[#FBBF24] font-mono transition"
              >
                <Phone size={13} className="text-[#D97706]" />
                <span>{brandPhone}</span>
              </a>
              <a
                href={`mailto:${brandEmail}`}
                className="flex items-center gap-1.5 text-[#D5C7B8] hover:text-[#FBBF24] transition truncate font-sans"
              >
                <Mail size={13} className="text-[#D97706]" />
                <span>{brandEmail}</span>
              </a>
              {brandAddress && (
                <div className="flex items-start gap-1.5 text-[#A08C7D] pt-1">
                  <MapPin size={13} className="text-[#D97706] flex-shrink-0 mt-0.5" />
                  <span className="leading-tight">{brandAddress}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tuscan Leather Certifications Bar */}
        <div className="pt-8 border-t border-[#8C6D58]/40 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 text-[10px] text-[#A08C7D]">
            <span className="px-2.5 py-1 rounded-lg bg-[#3D2217] border border-[#8C6D58]/40 text-[#FBBF24]">
              ★ Consorzio Vera Pelle Conciata al Vegetale in Toscana
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-[#3D2217] border border-[#8C6D58]/40">
              100% Solid Cast Antique Brass
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-[#3D2217] border border-[#8C6D58]/40">
              Hand-Burnished Edges
            </span>
          </div>

          <div className="text-[11px] text-[#A08C7D] font-sans">
            © {new Date().getFullYear()} {brandName}. Handcrafted for timeless wanderlust.
          </div>
        </div>
      </div>
    </footer>
  );
}
