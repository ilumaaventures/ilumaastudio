import React, { useState } from "react";
import {
  Zap,
  ShieldCheck,
  Flame,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Clock,
  Check,
  Radio,
} from "lucide-react";
import toast from "react-hot-toast";

export default function Footer({
  brandName = "SOLECRAFT",
  brandLogo = null,
  business = {},
  setActivePage = () => {},
}) {
  const [emailInput, setEmailInput] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const brandPhone =
    business?.phone ||
    business?.businessPhone ||
    business?.contactPhone ||
    "+1 (800) 555-KICKS";

  const brandEmail =
    business?.email ||
    business?.businessEmail ||
    business?.contactEmail ||
    "drops@solecraft.io";

  const rawAddr = business?.address || business?.registered_business_address;
  const brandAddress =
    typeof rawAddr === "string"
      ? rawAddr
      : rawAddr && typeof rawAddr === "object"
      ? [rawAddr.street, rawAddr.addressLine2, rawAddr.city, rawAddr.state, rawAddr.postalCode, rawAddr.country]
          .filter(Boolean)
          .join(", ")
      : "SoleCraft Logistics Hub, 404 Sneaker Row, Brooklyn, NY 11201";

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes("@")) {
      toast.error("Please provide a valid email for drop notifications.");
      return;
    }
    setSubscribed(true);
    toast.success("You are on the VIP Drop Notification list! Early access granted.");
    setEmailInput("");
  };

  return (
    <footer className="bg-black text-zinc-400 border-t border-zinc-900 font-sans">
      {/* Top Value Propositions Strip */}
      <div className="border-b border-zinc-900/80 py-8 bg-zinc-950/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-6 font-mono text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-lime-500/10 text-lime-400 flex items-center justify-center shrink-0 border border-lime-500/20">
              <ShieldCheck size={20} />
            </div>
            <div>
              <span className="font-bold text-white block uppercase">RFID Authentic</span>
              <span className="text-[11px] text-zinc-500">Every shoe NFC verified</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-lime-500/10 text-lime-400 flex items-center justify-center shrink-0 border border-lime-500/20">
              <Zap size={20} />
            </div>
            <div>
              <span className="font-bold text-white block uppercase">Carbon Plate Tech</span>
              <span className="text-[11px] text-zinc-500">Laboratory tested 89% return</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-lime-500/10 text-lime-400 flex items-center justify-center shrink-0 border border-lime-500/20">
              <Clock size={20} />
            </div>
            <div>
              <span className="font-bold text-white block uppercase">24h Express Drop</span>
              <span className="text-[11px] text-zinc-500">Dispatched in insulated box</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-lime-500/10 text-lime-400 flex items-center justify-center shrink-0 border border-lime-500/20">
              <Check size={20} />
            </div>
            <div>
              <span className="font-bold text-white block uppercase">30-Day Road Trial</span>
              <span className="text-[11px] text-zinc-500">Free return if not satisfied</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Col 1: Brand & Logistics Hub (4 Cols) */}
        <div className="md:col-span-4 space-y-4 font-mono">
          <div className="flex items-center gap-3">
            {brandLogo ? (
              <img
                src={brandLogo}
                alt={brandName}
                className="h-9 w-auto max-w-[130px] object-contain rounded-lg"
              />
            ) : (
              <div className="w-9 h-9 rounded-xl bg-lime-400 text-black flex items-center justify-center font-black">
                <Zap size={20} className="fill-black" />
              </div>
            )}
            <span className="text-xl font-black text-white uppercase tracking-wider">
              {brandName}
            </span>
          </div>

          <p className="text-xs text-zinc-500 leading-relaxed font-sans">
            {business?.description ||
              "Specialist footwear laboratory engineering supercritical nitrogen-infused running chassis, retro collector deadstock editions, and Tuscan handcrafted sneaker luxury."}
          </p>

          <div className="space-y-1.5 text-xs text-zinc-400 pt-2">
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-lime-400 shrink-0" />
              <span className="truncate">{brandAddress}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={14} className="text-lime-400 shrink-0" />
              <span>{brandPhone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={14} className="text-lime-400 shrink-0" />
              <span>{brandEmail}</span>
            </div>
          </div>
        </div>

        {/* Col 2: Silhouettes (2 Cols) */}
        <div className="md:col-span-2 space-y-3 font-mono text-xs">
          <h5 className="font-black text-white uppercase tracking-wider text-[11px] text-lime-400">
            Silhouettes
          </h5>
          <ul className="space-y-2 text-zinc-400">
            <li>
              <button
                onClick={() => {
                  setActivePage("sneaker-vault");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="hover:text-white transition cursor-pointer"
              >
                Sneaker Vault
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setActivePage("sneaker-vault");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="hover:text-white transition cursor-pointer"
              >
                Carbon Marathon Series
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setActivePage("sneaker-vault");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="hover:text-white transition cursor-pointer"
              >
                Court '85 High Tops
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setActivePage("drops-calendar");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="hover:text-white transition cursor-pointer"
              >
                Release Calendar
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: Sole Tech (2 Cols) */}
        <div className="md:col-span-2 space-y-3 font-mono text-xs">
          <h5 className="font-black text-white uppercase tracking-wider text-[11px] text-lime-400">
            Biomechanics
          </h5>
          <ul className="space-y-2 text-zinc-400">
            <li>
              <button
                onClick={() => {
                  setActivePage("sole-tech");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="hover:text-white transition cursor-pointer"
              >
                Supercritical Nitro Foam
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setActivePage("sole-tech");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="hover:text-white transition cursor-pointer"
              >
                Curved Carbon Lever
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setActivePage("authenticity-guarantee");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="hover:text-white transition cursor-pointer"
              >
                RFID Hologram Tag
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setActivePage("offers");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="hover:text-white transition cursor-pointer"
              >
                Drop Packs & Offers
              </button>
            </li>
          </ul>
        </div>

        {/* Col 4: VIP Drop Alerts Radar (4 Cols) */}
        <div className="md:col-span-4 space-y-3 font-mono">
          <div className="flex items-center gap-2">
            <Radio size={15} className="text-lime-400 animate-pulse" />
            <h5 className="font-black text-white uppercase tracking-wider text-[11px]">
              Drop Radar VIP Access
            </h5>
          </div>
          <p className="text-xs text-zinc-400 font-sans leading-relaxed">
            Deadstock releases sell out in minutes. Enter your email for 15-minute priority queue access on limited silhouettes.
          </p>

          <form onSubmit={handleSubscribe} className="space-y-2">
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="runner@speed.io"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-600 px-3.5 py-2.5 rounded-xl text-xs font-mono focus:border-lime-400 focus:outline-none flex-1"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-lime-400 hover:bg-lime-300 text-black font-black text-xs uppercase tracking-wider rounded-xl transition cursor-pointer shrink-0"
              >
                Join
              </button>
            </div>
            {subscribed && (
              <span className="text-[10px] text-lime-400 block font-bold">
                ✓ Priority queue enabled for next drop.
              </span>
            )}
          </form>
        </div>
      </div>

      {/* Bottom Legal Strip */}
      <div className="border-t border-zinc-900 py-6 text-[10px] font-mono text-zinc-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} {brandName} Athletic Propulsion Lab. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Deadstock Protocol ISO-9001</span>
            <span>•</span>
            <span>Carbon-Neutral Certified</span>
            <span>•</span>
            <span>Terms of Drop</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
