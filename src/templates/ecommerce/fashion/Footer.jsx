import React, { useState } from "react";
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Mail,
  Phone,
  MapPin,
  Check,
} from "lucide-react";
import toast from "react-hot-toast";

export default function Footer({
  brandName = "ATELIER URBAN",
  brandEmail = "vip@atelierurban.com",
  brandPhone = null,
  brandAddress = null,
  onNavigate = () => {},
}) {
  const [emailInput, setEmailInput] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes("@")) {
      toast.error("Please provide a valid private email address.");
      return;
    }
    setSubscribed(true);
    toast.success("You are now registered for Private Runway Access.", {
      icon: "✨",
    });
    setEmailInput("");
  };

  return (
    <footer className="bg-zinc-950 text-white border-t border-zinc-900 text-left">
      {/* Upper Newsletter & VIP Club Banner */}
      <div className="border-b border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center justify-between">
            <div className="lg:col-span-6 space-y-2">
              <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-400 flex items-center gap-1.5">
                <Sparkles size={11} className="text-amber-400" />
                Private Runway & Archive Access
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-black text-white tracking-tight">
                Join the Atelier Inner Circle
              </h3>
              <p className="text-xs text-zinc-400 font-sans leading-relaxed max-w-md">
                Receive private seasonal invitations, priority bespoke reservations, and private client archive sales before public unveilings.
              </p>
            </div>

            <div className="lg:col-span-6">
              {subscribed ? (
                <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex items-center gap-3 text-emerald-400">
                  <Check size={20} />
                  <span className="text-xs font-mono">
                    Invitation confirmed. Welcome to the Atelier Inner Circle.
                  </span>
                </div>
              ) : (
                <form
                  onSubmit={handleSubscribe}
                  className="flex flex-col sm:flex-row gap-3"
                >
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Enter your email address..."
                    className="w-full px-5 py-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition font-sans"
                    required
                  />
                  <button
                    type="submit"
                    className="px-6 py-3.5 bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs uppercase tracking-widest rounded-xl transition cursor-pointer shrink-0 flex items-center justify-center gap-2"
                  >
                    <span>Request Access</span>
                    <ArrowRight size={14} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Manifesto */}
          <div className="lg:col-span-2 space-y-4">
            <span className="text-2xl font-serif font-black uppercase tracking-[0.2em] text-white block">
              {brandName}
            </span>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm font-sans">
              Dedicated to architectural silhouettes, noble virgin wools, and slow-crafted fashion. Every garment is cut, sewn, and hand-finished with meticulous Italian tailoring traditions.
            </p>
            <div className="space-y-1.5 pt-2 text-xs text-zinc-400 font-mono">
              <p className="flex items-center gap-2">
                <Mail size={13} className="text-zinc-500" />
                <a href={`mailto:${brandEmail}`} className="hover:text-white transition">
                  {brandEmail}
                </a>
              </p>
              {brandPhone && (
                <p className="flex items-center gap-2">
                  <Phone size={13} className="text-zinc-500" />
                  <a href={`tel:${brandPhone}`} className="hover:text-white transition">
                    {brandPhone}
                  </a>
                </p>
              )}
              {brandAddress && (
                <p className="flex items-start gap-2 pt-0.5">
                  <MapPin size={13} className="text-zinc-500 shrink-0 mt-0.5" />
                  <span className="leading-snug">{brandAddress}</span>
                </p>
              )}
            </div>
          </div>

          {/* Collections */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-mono uppercase tracking-widest text-zinc-200 font-bold">
              Collections
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400 font-sans">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate("collections")}
                  className="hover:text-white transition"
                >
                  Autumn Outerwear
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate("collections")}
                  className="hover:text-white transition"
                >
                  Tailored Trousers
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate("collections")}
                  className="hover:text-white transition"
                >
                  Merino & Cashmere Knitwear
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate("collections")}
                  className="hover:text-white transition"
                >
                  Silk Charmeuse Eveningwear
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate("collections")}
                  className="hover:text-white transition"
                >
                  Leather Accessories
                </button>
              </li>
            </ul>
          </div>

          {/* Curations */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-mono uppercase tracking-widest text-zinc-200 font-bold">
              Editorial
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400 font-sans">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate("lookbook")}
                  className="hover:text-white transition"
                >
                  Seasonal Lookbook
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate("offers")}
                  className="hover:text-white transition"
                >
                  Private Runway Privileges
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate("atelier")}
                  className="hover:text-white transition"
                >
                  Atelier Heritage
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate("size-guide")}
                  className="hover:text-white transition"
                >
                  Bespoke Fit Guide
                </button>
              </li>
            </ul>
          </div>

          {/* Concierge & Client Care */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-mono uppercase tracking-widest text-zinc-200 font-bold">
              Client Care
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400 font-sans">
              <li>
                <span className="hover:text-white transition cursor-pointer">
                  Complimentary Tailoring
                </span>
              </li>
              <li>
                <span className="hover:text-white transition cursor-pointer">
                  Insured Express Delivery
                </span>
              </li>
              <li>
                <span className="hover:text-white transition cursor-pointer">
                  Bespoke Appointments
                </span>
              </li>
              <li>
                <span className="hover:text-white transition cursor-pointer">
                  Garment & Cashmere Care
                </span>
              </li>
              <li>
                <span className="hover:text-white transition cursor-pointer">
                  Returns & Alterations
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-14 pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 font-mono">
          <p>© {new Date().getFullYear()} {brandName}. All rights reserved.</p>
          <div className="flex items-center gap-6 text-[11px]">
            <span className="hover:text-zinc-300 transition cursor-pointer">Privacy Protocol</span>
            <span className="hover:text-zinc-300 transition cursor-pointer">Terms of Haute Couture</span>
            <span className="hover:text-zinc-300 transition cursor-pointer">Sustainability Commitment</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
