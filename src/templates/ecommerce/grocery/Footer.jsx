import React, { useState } from "react";
import {
  Leaf,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Truck,
  Heart,
  Send,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import toast from "react-hot-toast";

export default function Footer({
  brandName = "FreshMart",
  brandLogo = null,
  brandPhone = "1-800-FRESH-MT",
  brandEmail = "care@freshmartgroceries.com",
  brandAddress = "842 Market Boulevard, Green Valley, CA 94103",
  setActivePage,
  setSelectedCategory,
}) {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes("@")) {
      toast.error("Please provide a valid email address.");
      return;
    }
    setSubscribed(true);
    toast.success("Welcome to the Fresh Harvest Club! Use promo FRESH20 for 20% off.");
  };

  const handleNavCategory = (cat) => {
    if (setSelectedCategory) setSelectedCategory(cat);
    if (setActivePage) setActivePage("aisles");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavPage = (page) => {
    if (setActivePage) setActivePage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#0F172A] text-slate-300 font-sans border-t border-emerald-950/20 text-left selection:bg-emerald-800 selection:text-white">
      {/* ================= 1. SUSTAINABILITY & VALUE PROPOSITION BANNER ================= */}
      <div className="border-b border-slate-800/80 bg-slate-900/60 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-800/40 border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
              <Truck size={20} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                25-Min Eco Dispatch
              </h4>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Zero-emission electric delivery fleet with insulated cold-chain cargo packs.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-800/40 border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
              <Leaf size={20} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                100% Certified Organic
              </h4>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Direct partnerships with verified smallholder farms. No synthetic pesticides.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-800/40 border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Freshness Guaranteed
              </h4>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                If your produce is not impeccably crisp and fresh, instant 100% refund.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-800/40 border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
              <Sparkles size={20} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Compostable Packaging
              </h4>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                100% recyclable kraft paper bags and water-based inks. Zero single-use plastic.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= 2. MAIN FOOTER CONTENT ================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand Info & Newsletter */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              {brandLogo ? (
                <img
                  src={brandLogo}
                  alt={brandName}
                  className="h-10 w-auto max-w-[150px] object-contain rounded brightness-0 invert"
                />
              ) : (
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 text-white flex items-center justify-center shadow-lg shadow-emerald-950/40">
                  <Leaf size={22} className="text-emerald-100" />
                </div>
              )}
              <div>
                <span className="text-xl font-black tracking-tight text-white block leading-none">
                  {brandName}
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-400 font-bold block mt-0.5">
                  Farm-Direct Organic & Fresh Market
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              We bridge local organic family farms directly to your kitchen. Orchard-crisp fruits, 
              slow-fermented sourdoughs, pasture-raised eggs, and cold-pressed botanical elixirs 
              delivered in 25 minutes.
            </p>

            {/* Newsletter Sign Up */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-white block">
                Join the Fresh Harvest Club & Get ₹150 Off
              </span>
              {subscribed ? (
                <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                  <span>Coupon <strong>FRESH20</strong> unlocked! Applied to your next harvest order.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex max-w-sm gap-2">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email for weekly harvest specials..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-[#15803D] hover:bg-emerald-600 text-white text-xs font-bold shrink-0 transition flex items-center gap-1.5 shadow-md shadow-emerald-950/30"
                  >
                    <span>Join</span>
                    <Send size={12} />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Quick Aisles Navigation */}
          <div className="space-y-4">
            <h5 className="font-bold text-white uppercase text-[11px] tracking-wider border-b border-slate-800 pb-2">
              Fresh Aisles
            </h5>
            <ul className="space-y-2.5 text-xs text-slate-400">
              {[
                { name: "Fresh Produce", cat: "Produce" },
                { name: "Artisanal Bakery", cat: "Bakery" },
                { name: "Pasture Dairy & Eggs", cat: "Dairy" },
                { name: "Cold-Pressed Juices", cat: "Beverages" },
                { name: "Pantry & Gourmet Spices", cat: "Pantry" },
                { name: "Snacks & Superfoods", cat: "Snacks" },
              ].map((item) => (
                <li key={item.name}>
                  <button
                    onClick={() => handleNavCategory(item.cat)}
                    className="hover:text-emerald-400 transition cursor-pointer text-left flex items-center gap-1.5 group"
                  >
                    <ArrowRight size={11} className="text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition" />
                    <span>{item.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Culinary & Scientific Experience */}
          <div className="space-y-4">
            <h5 className="font-bold text-white uppercase text-[11px] tracking-wider border-b border-slate-800 pb-2">
              Culinary Programs
            </h5>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => handleNavPage("meal-kits")}
                  className="hover:text-emerald-400 transition cursor-pointer text-left flex items-center gap-1.5 group"
                >
                  <ArrowRight size={11} className="text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition" />
                  <span>Chef's Recipe Kits Studio</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavPage("offers")}
                  className="hover:text-emerald-400 transition cursor-pointer text-left flex items-center gap-1.5 group"
                >
                  <ArrowRight size={11} className="text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition" />
                  <span>Weekly Harvest Value Bundles</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavPage("freshness-lab")}
                  className="hover:text-emerald-400 transition cursor-pointer text-left flex items-center gap-1.5 group"
                >
                  <ArrowRight size={11} className="text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition" />
                  <span>Harvest Freshness Lab & Science</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavPage("offers")}
                  className="hover:text-emerald-400 transition cursor-pointer text-left flex items-center gap-1.5 group"
                >
                  <ArrowRight size={11} className="text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition" />
                  <span>Organic Deals & Coupons</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavPage("home")}
                  className="hover:text-emerald-400 transition cursor-pointer text-left flex items-center gap-1.5 group"
                >
                  <ArrowRight size={11} className="text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition" />
                  <span>VIP Fresh Club Membership</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Dispatch Times */}
          <div className="space-y-4">
            <h5 className="font-bold text-white uppercase text-[11px] tracking-wider border-b border-slate-800 pb-2">
              Direct Contact & Hours
            </h5>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <Clock size={15} className="text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-white block">Operating Delivery Hours:</strong>
                  <span>6:00 AM – 11:00 PM EST (7 Days/Week)</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Phone size={15} className="text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-white block">Care Helpline:</strong>
                  <a href={`tel:${brandPhone}`} className="text-emerald-400 hover:underline">
                    {brandPhone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Mail size={15} className="text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-white block">Support Email:</strong>
                  <span className="text-slate-300">{brandEmail}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin size={15} className="text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-white block">Distribution Hub:</strong>
                  <span className="text-slate-400">{brandAddress}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= 3. BOTTOM LEGAL & COMPLIANCE BAR ================= */}
        <div className="pt-12 mt-12 border-t border-slate-800/80 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-slate-500">
          <div className="flex flex-wrap items-center gap-2 text-center sm:text-left">
            <span>© {new Date().getFullYear()} {brandName} Organic Supermarket. All rights reserved.</span>
            <span className="hidden sm:inline">•</span>
            <span>Zero Single-Use Plastics Guarantee</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400 text-[11px]">
            <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-mono text-[10px] border border-slate-700">
              ⚡ 25-Min Cold Chain
            </span>
            <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-mono text-[10px] border border-slate-700">
              🌱 Certified USDA Organic
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
