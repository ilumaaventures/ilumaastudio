import React, { useState } from "react";
import { Coffee, Mail, ArrowRight, Instagram, Facebook, Twitter, MapPin, Phone } from "lucide-react";
import toast from "react-hot-toast";

export default function Footer({
  brandName = "Crux Coffee Roasters",
  business = {},
  onSelectCategory = () => {},
}) {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    toast.success("Welcome to the Crux Tasting Club! Enjoy 10% off your first order. ☕");
    setEmail("");
  };

  return (
    <footer id="crux-footer" className="w-full bg-[#1E110C] text-[#FAF7F2] pt-16 pb-12 border-t border-[#3A2318]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#3A2318]">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full border border-amber-300/50 flex items-center justify-center bg-[#2E1B13]">
                <Coffee className="w-4 h-4 text-amber-200" />
              </div>
              <span
                className="text-2xl font-serif text-[#FAF7F2] tracking-wide"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {brandName}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#B8AAA0] font-light leading-relaxed max-w-sm">
              Artisan specialty micro-lots, masterfully small-batch roasted in Bengaluru. 100% sustainably sourced, Fair Trade certified, and directly traded with regional growers.
            </p>
            <div className="pt-2 space-y-2 text-xs text-[#A89A90]">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-300" />
                <span>74 Artisan Way, Old Town Roastery, Bengaluru</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-300" />
                <span>+91 98765 43210</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-amber-300 mb-4">
              Collections
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#C8BCB3]">
              <li>
                <button
                  onClick={() => onSelectCategory("coffee-beans")}
                  className="hover:text-white transition-colors"
                >
                  Coffee Beans
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory("instant-coffee")}
                  className="hover:text-white transition-colors"
                >
                  Instant Coffee
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory("international-brews")}
                  className="hover:text-white transition-colors"
                >
                  International Brews
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory("coffee-accessories")}
                  className="hover:text-white transition-colors"
                >
                  Coffee Accessories
                </button>
              </li>
            </ul>
          </div>

          {/* Our Story & Rituals */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-amber-300 mb-4">
              Story & Craft
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#C8BCB3]">
              <li>
                <a href="#crux-mission-section" className="hover:text-white transition-colors">
                  Our Mission
                </a>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Fair Trade Promise
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Brewing Guides (92°C)
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Sustainability Report
                </span>
              </li>
            </ul>
          </div>

          {/* Tasting Club Newsletter */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-amber-300 mb-4">
              Tasting Club
            </h4>
            <p className="text-xs text-[#B8AAA0] mb-3 leading-relaxed">
              Subscribe to receive weekly single-origin drops, roast dates, and brew recipes.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full bg-[#2A180E] border border-[#4A2E1B] text-xs text-[#FAF7F2] placeholder-[#8F8177] rounded-full px-4 py-2.5 focus:outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="absolute right-1 top-1 bottom-1 w-8 h-8 rounded-full bg-[#4A2E1B] hover:bg-amber-800 flex items-center justify-center text-white transition-colors"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8F8177]">
          <p>© {new Date().getFullYear()} {brandName}. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <span className="hover:text-[#FAF7F2] cursor-pointer">Privacy Policy</span>
            <span className="hover:text-[#FAF7F2] cursor-pointer">Terms of Service</span>
            <span className="hover:text-[#FAF7F2] cursor-pointer">Shipping & Returns</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
