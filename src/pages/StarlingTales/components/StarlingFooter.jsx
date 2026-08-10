import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, Mail, Phone, MapPin, Heart } from "lucide-react";
import { useStore } from "../../Store/StoreLayout";

export default function StarlingFooter() {
  const { business } = useStore();

  return (
    <footer className="bg-[#2C3E35] text-[#FAF6F0] border-t border-[#C5A880]/30 font-sans">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Ethos */}
          <div className="space-y-4 col-span-1 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full border border-[#C5A880] flex items-center justify-center text-[#C5A880]">
                <Sparkles size={16} />
              </div>
              <span className="font-serif font-black text-lg tracking-widest uppercase text-[#FAF6F0]">
                Starling Tales
              </span>
            </div>
            <p className="text-xs text-[#FAF6F0]/70 leading-relaxed font-serif max-w-sm">
              We chronicle old tales through heirloom keepsakes, handmade botanical formulations, and custom poetry. Each artifact is crafted by local residents and dedicated makers.
            </p>
          </div>

          {/* Collections Quick Links */}
          <div className="space-y-4">
            <h4 className="font-serif text-sm font-bold tracking-widest text-[#C5A880] uppercase">
              The Archives
            </h4>
            <ul className="space-y-2.5 text-xs text-[#FAF6F0]/80">
              <li>
                <Link to={`/${encodeURIComponent(business.businessName)}/products`} className="hover:text-[#C5A880] transition-colors duration-200">
                  Custom Heirlooms
                </Link>
              </li>
              <li>
                <Link to={`/${encodeURIComponent(business.businessName)}/products`} className="hover:text-[#C5A880] transition-colors duration-200">
                  Residents' Crafts
                </Link>
              </li>
              <li>
                <Link to={`/${encodeURIComponent(business.businessName)}/about`} className="hover:text-[#C5A880] transition-colors duration-200">
                  Our Brand Chronicles
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care / Support */}
          <div className="space-y-4">
            <h4 className="font-serif text-sm font-bold tracking-widest text-[#C5A880] uppercase">
              Chronicle Keepers
            </h4>
            <ul className="space-y-3.5 text-xs text-[#FAF6F0]/80">
              <li className="flex items-center gap-2">
                <Mail size={14} className="text-[#C5A880] shrink-0" />
                <span>support@starlingtales.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-[#C5A880] shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={14} className="text-[#C5A880] shrink-0 mt-0.5" />
                <span className="leading-snug">The Old Mill Villa, Gurgaon, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#FAF6F0]/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-[#FAF6F0]/50 tracking-wider uppercase font-semibold">
          <p>© {new Date().getFullYear()} Starling Tales Studio. All Rights Reserved.</p>
          <div className="flex items-center gap-1 font-serif text-[9px] lowercase italic">
            <span>crafted with</span>
            <Heart size={10} className="text-[#C85C5C] fill-[#C85C5C]" />
            <span>in resident mills</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
