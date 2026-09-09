import React from "react";
import { ShieldCheck, Truck, Sparkles, Box, Mail, Phone, MapPin, ArrowRight } from "lucide-react";

export default function Footer({
  business = {},
  onNavigate,
  onSelectCategory,
}) {
  const brandName = business?.businessName || business?.name || "CasaLiving Interiors";
  const brandPhone = business?.phone || "+1 (800) 888-CASA";
  const brandEmail = business?.email || "interiors@casaliving.design";

  return (
    <footer className="bg-[#1C1917] text-stone-300 pt-16 pb-12 border-t border-stone-800 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* 4 Trust Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-stone-800">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-stone-800 flex items-center justify-center text-[#A07855] shrink-0">
              <Truck size={22} />
            </div>
            <div className="space-y-1">
              <h4 className="text-white font-semibold text-sm">White-Glove Delivery</h4>
              <p className="text-xs text-stone-400">In-room setup and packaging removal by certified technicians.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-stone-800 flex items-center justify-center text-[#A07855] shrink-0">
              <ShieldCheck size={22} />
            </div>
            <div className="space-y-1">
              <h4 className="text-white font-semibold text-sm">10-Year Warranty</h4>
              <p className="text-xs text-stone-400">Guaranteed structural integrity for all kiln-dried solid hardwood frames.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-stone-800 flex items-center justify-center text-[#A07855] shrink-0">
              <Sparkles size={22} />
            </div>
            <div className="space-y-1">
              <h4 className="text-white font-semibold text-sm">FSC Certified Woods</h4>
              <p className="text-xs text-stone-400">Sustainably harvested timber treated with organic non-toxic oils.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-stone-800 flex items-center justify-center text-[#A07855] shrink-0">
              <Box size={22} />
            </div>
            <div className="space-y-1">
              <h4 className="text-white font-semibold text-sm">Custom Tailoring</h4>
              <p className="text-xs text-stone-400">Personalize fabric weaves, leather finishes, and dimensions.</p>
            </div>
          </div>
        </div>

        {/* Links + Newsletter Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#A07855] text-white flex items-center justify-center font-serif text-lg font-bold">
                C
              </div>
              <span className="text-xl font-bold font-serif text-white">{brandName}</span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              Crafting architectural furniture for every beautiful home. Rooted in Scandinavian minimalism, honest materials, and heirloom European joinery.
            </p>
            <div className="space-y-1 text-xs text-stone-400 pt-2">
              <p className="flex items-center gap-2">
                <Phone size={13} className="text-[#A07855]" /> {brandPhone}
              </p>
              <p className="flex items-center gap-2">
                <Mail size={13} className="text-[#A07855]" /> {brandEmail}
              </p>
            </div>
          </div>

          {/* Room Collections */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Collections</h4>
            <ul className="space-y-2 text-xs text-stone-400">
              {["Living Room", "Bedroom", "Dining Room", "Home Storage", "Office Furniture", "Outdoor"].map((cat) => (
                <li key={cat}>
                  <button
                    type="button"
                    onClick={() => {
                      onNavigate?.("catalog");
                      onSelectCategory?.(cat);
                    }}
                    className="hover:text-white transition cursor-pointer"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Services</h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button onClick={() => onNavigate?.("home")} className="hover:text-white transition cursor-pointer">
                  White-Glove Placement
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate?.("catalog")} className="hover:text-white transition cursor-pointer">
                  Complimentary Swatches
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate?.("home")} className="hover:text-white transition cursor-pointer">
                  Trade & Interior Designers
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate?.("catalog")} className="hover:text-white transition cursor-pointer">
                  10-Year Warranty
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Newsletter</h4>
            <p className="text-xs text-stone-400">Receive private preview releases and interior lookbooks.</p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3.5 py-2.5 bg-stone-800 border border-stone-700 rounded-xl text-xs text-white placeholder:text-stone-500 focus:outline-none focus:border-[#A07855]"
              />
              <button
                type="submit"
                className="w-full py-2.5 bg-[#A07855] hover:bg-[#8d6645] text-white text-xs font-semibold rounded-xl transition shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Subscribe</span>
                <ArrowRight size={13} />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} {brandName}. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-stone-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-stone-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-stone-400 cursor-pointer">Shipping & Assembly</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
