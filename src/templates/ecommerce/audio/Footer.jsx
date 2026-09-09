import React, { useState } from "react";
import { Radio, ArrowRight, MapPin, Mail, Phone } from "lucide-react";
import toast from "react-hot-toast";

export default function Footer({
  brandName = "APEX ACOUSTICS",
  onSelectCategory = () => {},
}) {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    toast.success("Thank you for subscribing to Apex Acoustic dispatches. 🎧");
    setEmail("");
  };

  return (
    <footer className="w-full bg-[#121212] text-white pt-16 pb-12 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-neutral-800 text-left">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center">
                <Radio className="w-4 h-4" />
              </div>
              <span
                className="text-lg font-bold tracking-[0.25em] uppercase text-white"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {brandName}
              </span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm font-normal">
              New York based precision acoustics studio. Building technically sophisticated sound tools engineered with custom Beryllium drivers, handcrafted acetate, and machined metal.
            </p>
            <div className="pt-2 space-y-2 text-xs text-neutral-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-neutral-300" />
                <span>508 West 26th Street, Studio 7A, New York, NY</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-neutral-300" />
                <span>concierge@apexacoustics.com</span>
              </div>
            </div>
          </div>

          {/* Sound Tools */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.25em] text-neutral-200 mb-4">
              Sound Tools
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <button
                  onClick={() => onSelectCategory("headphones")}
                  className="hover:text-white transition-colors uppercase tracking-wider"
                >
                  Headphones
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory("earphones")}
                  className="hover:text-white transition-colors uppercase tracking-wider"
                >
                  Earphones
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory("speaker")}
                  className="hover:text-white transition-colors uppercase tracking-wider"
                >
                  Speakers
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory("accessories")}
                  className="hover:text-white transition-colors uppercase tracking-wider"
                >
                  Accessories
                </button>
              </li>
            </ul>
          </div>

          {/* Sound Science */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.25em] text-neutral-200 mb-4">
              Engineering
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <span className="hover:text-white transition-colors cursor-pointer uppercase tracking-wider">
                  Beryllium Drivers
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer uppercase tracking-wider">
                  Ceramic Forging
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer uppercase tracking-wider">
                  Acoustic Tuning
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer uppercase tracking-wider">
                  Sustainability
                </span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.25em] text-neutral-200 mb-4">
              Acoustic Dispatch
            </h4>
            <p className="text-xs text-neutral-400 mb-3 leading-relaxed">
              Receive notifications on limited studio collaborations and acoustic firmware updates.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  required
                  className="w-full bg-neutral-900 border border-neutral-700 text-xs text-white placeholder-neutral-500 rounded-none px-3 py-2.5 focus:outline-none focus:border-white"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="absolute right-1 top-1 bottom-1 px-2.5 bg-white hover:bg-neutral-200 text-black flex items-center justify-center transition-colors"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <p>© {new Date().getFullYear()} {brandName}. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <span className="hover:text-white cursor-pointer uppercase tracking-wider">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer uppercase tracking-wider">Terms of Sale</span>
            <span className="hover:text-white cursor-pointer uppercase tracking-wider">Compliance</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
