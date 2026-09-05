import React, { useState } from "react";
import {
  Cpu,
  ShieldCheck,
  RotateCcw,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Check,
  Headphones,
  Award,
  Zap,
} from "lucide-react";
import toast from "react-hot-toast";

export default function Footer({
  brandName = "TECHNOVA",
  brandLogo = null,
  brandPhone = "+1 (888) 404-TECH",
  brandEmail = "support@technovagear.io",
  brandAddress = "100 Silicon Way, Austin, TX 78701",
  onNavigate,
}) {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setSubscribed(true);
    toast.success("Subscribed to TechNova Firmware & Silicon Drops! ⚡");
    setNewsletterEmail("");
    setTimeout(() => setSubscribed(false), 5000);
  };

  return (
    <footer className="bg-[#050811] text-slate-400 pt-16 pb-12 border-t border-slate-800/80 text-left text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Newsletter & Firmware Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-slate-900/90 via-[#0B1120] to-slate-900/90 border border-slate-800 p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1.5 text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 text-cyan-400 font-mono text-[11px] font-bold">
              <Zap size={13} />
              <span>DSP FIRMWARE & HARDWARE DROPS</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Stay ahead with zero-day driver updates and exclusive VIP drops.
            </h3>
            <p className="text-slate-400 text-xs">
              Receive direct telemetry releases, beta DSP EQ curves, and secret VIP vouchers.
            </p>
          </div>

          <form
            onSubmit={handleSubscribe}
            className="w-full lg:w-auto flex flex-col sm:flex-row items-center gap-2 max-w-md"
          >
            <input
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="engineer@domain.com"
              className="w-full sm:w-72 bg-slate-950 text-xs text-white placeholder-slate-500 px-4 py-3 rounded-xl border border-slate-700 focus:border-cyan-500 focus:outline-none transition shadow-inner font-mono"
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap shadow-lg shadow-blue-600/30"
            >
              {subscribed ? (
                <>
                  <Check size={14} className="text-emerald-300" />
                  <span>Subscribed!</span>
                </>
              ) : (
                <>
                  <span>Join Telemetry</span>
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
                  className="h-9 w-auto max-w-[140px] object-contain rounded brightness-0 invert"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-md">
                  <Cpu size={20} className="text-cyan-200" />
                </div>
              )}
              <span className="text-lg font-black tracking-tight text-white uppercase">
                {brandName}
              </span>
            </div>

            <p className="text-slate-400 leading-relaxed text-xs max-w-sm">
              Precision acoustic architecture, ultra-low latency wireless telemetry, and high-performance creator peripherals engineered with pure silicon speed.
            </p>

            <div className="flex items-center gap-4 text-xs font-medium text-slate-300">
              <span className="flex items-center gap-1 text-cyan-400">
                <ShieldCheck size={14} /> 2-Yr TechShield Guarantee
              </span>
              <span className="flex items-center gap-1 text-cyan-400">
                <RotateCcw size={14} /> 30-Day Risk-Free Trial
              </span>
            </div>
          </div>

          {/* Col 2: Hardware Lineup */}
          <div className="space-y-3">
            <h5 className="font-bold text-white uppercase text-[11px] tracking-wider font-mono">
              Hardware Lineup
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate && onNavigate("specs", "Pro Audio & ANC")}
                  className="hover:text-cyan-400 transition cursor-pointer text-left"
                >
                  Beryllium ANC Headphones
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate && onNavigate("specs", "Smart Wearables")}
                  className="hover:text-cyan-400 transition cursor-pointer text-left"
                >
                  Titanium Biomark Watches
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate && onNavigate("specs", "Peripherals")}
                  className="hover:text-cyan-400 transition cursor-pointer text-left"
                >
                  Hall-Effect Keyboards
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate && onNavigate("specs", "Creator Studio")}
                  className="hover:text-cyan-400 transition cursor-pointer text-left"
                >
                  Spatial Dolby Soundbars
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Laboratory Tools */}
          <div className="space-y-3">
            <h5 className="font-bold text-white uppercase text-[11px] tracking-wider font-mono">
              Laboratory Tools
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate && onNavigate("compare")}
                  className="hover:text-cyan-400 transition cursor-pointer text-left"
                >
                  Spec Shootout Matrix
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate && onNavigate("eq-lab")}
                  className="hover:text-cyan-400 transition cursor-pointer text-left"
                >
                  EQ Soundstage Simulator
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate && onNavigate("battery-calc")}
                  className="hover:text-cyan-400 transition cursor-pointer text-left"
                >
                  Battery Stamina Lab
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate && onNavigate("offers")}
                  className="hover:text-cyan-400 transition cursor-pointer text-left"
                >
                  Flash Drops & VIP Vouchers
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Engineer Support */}
          <div className="space-y-3">
            <h5 className="font-bold text-white uppercase text-[11px] tracking-wider font-mono">
              Engineer Support
            </h5>
            <div className="space-y-2 text-xs">
              <a
                href={`tel:${brandPhone}`}
                className="flex items-center gap-1.5 text-white hover:text-cyan-400 font-mono transition"
              >
                <Phone size={13} className="text-cyan-400" />
                <span>{brandPhone}</span>
              </a>
              <a
                href={`mailto:${brandEmail}`}
                className="flex items-center gap-1.5 text-slate-300 hover:text-cyan-400 transition truncate"
              >
                <Mail size={13} className="text-cyan-400" />
                <span>{brandEmail}</span>
              </a>
              {brandAddress && (
                <div className="flex items-start gap-1.5 text-slate-500 pt-1">
                  <MapPin size={13} className="text-slate-400 flex-shrink-0 mt-0.5" />
                  <span className="leading-tight">{brandAddress}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Regulatory & Audio Certification Badges */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-400 font-mono">
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800">
              CE Compliant
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800">
              FCC Class-B
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800">
              RoHS Certified
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-amber-400 border-amber-500/30 font-bold">
              Hi-Res Audio Gold
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400 border-cyan-500/30 font-bold">
              Dolby Atmos Certified
            </span>
          </div>

          <div className="text-[11px] text-slate-500">
            © {new Date().getFullYear()} {brandName}. Built for high-performance silicon excellence.
          </div>
        </div>
      </div>
    </footer>
  );
}
