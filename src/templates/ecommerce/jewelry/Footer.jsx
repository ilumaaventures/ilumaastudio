import React, { useState } from "react";
import {
  Gem,
  Award,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Check,
  ArrowRight,
  Lock,
} from "lucide-react";
import toast from "react-hot-toast";

export default function Footer({
  brandName = "LUXE JEWELS",
  brandLogo = null,
  brandPhone = "+41 22 819 9000",
  brandEmail = "concierge@luxejewels.ch",
  brandAddress = "Rue du Rhône 42, 1204 Genève, Switzerland",
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
    toast.success("Welcome to the Haute Joaillerie Society. Private viewing invitations will be sent to your registry. 💎");
    setEmail("");
    setTimeout(() => setSubscribed(false), 5000);
  };

  return (
    <footer className="bg-[#08080A] text-[#A89F91] pt-16 pb-12 border-t border-[#D4AF37]/25 text-left text-xs font-serif">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Salon Newsletter Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-[#141418] via-[#1A181F] to-[#141418] border border-[#D4AF37]/30 p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-1.5 text-center lg:text-left">
            <span className="text-[#D4AF37] text-[10px] tracking-widest uppercase font-bold block font-sans">
              THE GENEVA SALON PRIVILEGE REGISTRY
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-[#FAFAFA]">
              Private viewings of rare multi-carat diamonds & gala exhibitions.
            </h3>
            <p className="text-[#78716C] text-xs font-sans">
              Receive confidential gemological dossiers and invitations to private salon viewings.
            </p>
          </div>

          <form
            onSubmit={handleSubscribe}
            className="w-full lg:w-auto flex flex-col sm:flex-row items-center gap-2 max-w-md font-sans"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="patron@domain.com"
              className="w-full sm:w-72 bg-[#0E0E12] text-xs text-[#FAFAFA] placeholder-[#555] px-4 py-3 rounded-xl border border-[#D4AF37]/40 focus:border-[#FBBF24] focus:outline-none transition shadow-inner"
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA771C] hover:from-[#E5C158] hover:to-[#B88622] text-[#0A0A0C] font-black text-xs transition cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap shadow"
            >
              {subscribed ? (
                <>
                  <Check size={14} />
                  <span>Enrolled!</span>
                </>
              ) : (
                <>
                  <span>Join Registry</span>
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
                  className="h-8 w-auto max-w-[130px] object-contain"
                />
              ) : (
                <div className="w-9 h-9 rounded-xl bg-[#141418] text-[#D4AF37] border border-[#D4AF37]/40 flex items-center justify-center shadow-md">
                  <Gem size={18} className="text-[#FBBF24]" />
                </div>
              )}
              <span className="text-lg font-black tracking-widest text-[#FAFAFA] uppercase">
                {brandName}
              </span>
            </div>

            <p className="text-[#78716C] leading-relaxed text-xs max-w-sm font-sans">
              Geneva haute joaillerie atelier crafting certified conflict-free solitaire creations, unheated colored gemstones, and bespoke bridal parures since 1984.
            </p>

            <div className="flex items-center gap-4 text-xs font-sans text-[#FAFAFA]">
              <span className="flex items-center gap-1 text-[#D4AF37]">
                <Award size={14} /> GIA Triple Excellent
              </span>
              <span className="flex items-center gap-1 text-[#D4AF37]">
                <Lock size={14} /> 100% Conflict-Free
              </span>
            </div>
          </div>

          {/* Col 2: Precious Vault */}
          <div className="space-y-3">
            <h5 className="font-bold text-[#FAFAFA] uppercase text-[11px] tracking-wider font-sans">
              Precious Vault
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate && onNavigate("catalog", "Solitaire Rings")}
                  className="hover:text-[#FBBF24] transition cursor-pointer text-left"
                >
                  Solitaire Diamond Rings
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate && onNavigate("catalog", "Diamond Necklaces")}
                  className="hover:text-[#FBBF24] transition cursor-pointer text-left"
                >
                  Rivière Necklaces & Pendants
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate && onNavigate("catalog", "Fine Earrings")}
                  className="hover:text-[#FBBF24] transition cursor-pointer text-left"
                >
                  Diamond Chandelier Earrings
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate && onNavigate("catalog", "Bracelets & Baffles")}
                  className="hover:text-[#FBBF24] transition cursor-pointer text-left"
                >
                  Tennis & Baffle Bracelets
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Gemological Standards */}
          <div className="space-y-3">
            <h5 className="font-bold text-[#FAFAFA] uppercase text-[11px] tracking-wider font-sans">
              Salon Services
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate && onNavigate("diamonds")}
                  className="hover:text-[#FBBF24] transition cursor-pointer text-left"
                >
                  The GIA 4Cs Standards
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate && onNavigate("bespoke")}
                  className="hover:text-[#FBBF24] transition cursor-pointer text-left"
                >
                  Bespoke Geneva Commission
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate && onNavigate("appointment")}
                  className="hover:text-[#FBBF24] transition cursor-pointer text-left"
                >
                  Private Salon Viewing
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate && onNavigate("offers")}
                  className="hover:text-[#FBBF24] transition cursor-pointer text-left"
                >
                  Heirloom Parures & Grants
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Geneva Concierge */}
          <div className="space-y-3">
            <h5 className="font-bold text-[#FAFAFA] uppercase text-[11px] tracking-wider font-sans">
              Geneva Concierge
            </h5>
            <div className="space-y-2 text-xs font-sans">
              <a
                href={`tel:${brandPhone}`}
                className="flex items-center gap-1.5 text-[#FAFAFA] hover:text-[#FBBF24] font-mono transition"
              >
                <Phone size={13} className="text-[#D4AF37]" />
                <span>{brandPhone}</span>
              </a>
              <a
                href={`mailto:${brandEmail}`}
                className="flex items-center gap-1.5 text-[#A89F91] hover:text-[#FBBF24] transition truncate"
              >
                <Mail size={13} className="text-[#D4AF37]" />
                <span>{brandEmail}</span>
              </a>
              {brandAddress && (
                <div className="flex items-start gap-1.5 text-[#78716C] pt-1">
                  <MapPin size={13} className="text-[#D4AF37] flex-shrink-0 mt-0.5" />
                  <span className="leading-tight">{brandAddress}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Swiss Made & GIA Seals */}
        <div className="pt-8 border-t border-[#D4AF37]/25 flex flex-wrap items-center justify-between gap-4 font-sans">
          <div className="flex flex-wrap items-center gap-3 text-[10px] text-[#78716C]">
            <span className="px-2.5 py-1 rounded-lg bg-[#141418] border border-[#D4AF37]/40 text-[#FBBF24]">
              ★ Swiss Haute Joaillerie
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-[#141418] border border-[#D4AF37]/40">
              GIA Graduate Gemologists
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-[#141418] border border-[#D4AF37]/40">
              100% Conflict-Free Kimberley Process
            </span>
          </div>

          <div className="text-[11px] text-[#78716C]">
            © {new Date().getFullYear()} {brandName}. Handcrafted for eternal brilliance.
          </div>
        </div>
      </div>
    </footer>
  );
}
