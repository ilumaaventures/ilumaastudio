import React from "react";
import { Link } from "react-router-dom";
import { Gift, Mail, Phone, MapPin, Heart } from "lucide-react";
import { useStore } from "../Store/StoreContext";

export default function GifterFooter() {
  const { business, storeHomePath } = useStore();
  const basePath = storeHomePath || `/${encodeURIComponent(business?.subdomain || business?.slug || business?.businessName || "")}`;

  return (
    <footer className="bg-[#3D0A16] text-[#FFF9FB] border-t border-[#E1A990]/35 font-sans">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Ethos */}
          <div className="space-y-4 col-span-1 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#E1A990] to-[#FFF9FB] flex items-center justify-center text-[#3D0A16] shadow-sm">
                <Gift size={16} />
              </div>
              <span className="font-sans font-black text-lg tracking-tight uppercase text-[#FFF9FB]">
                Gifter
              </span>
            </div>
            <p className="text-xs text-[#FFF9FB]/70 leading-relaxed max-w-sm">
              Crafting premium luxury gift hampers, curated corporate packages, and customized greetings for special occasions. Voted India's choice for premium bespoke gifting.
            </p>
          </div>

          {/* Hampers Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold tracking-widest text-[#E1A990] uppercase">
              Gift Catalogs
            </h4>
            <ul className="space-y-2.5 text-xs text-[#FFF9FB]/80">
              <li>
                <Link to={`${basePath}/products`} className="hover:text-[#E1A990] transition-colors duration-200">
                  Occasion Hampers
                </Link>
              </li>
              <li>
                <Link to={`${basePath}/products`} className="hover:text-[#E1A990] transition-colors duration-200">
                  Corporate Gifting
                </Link>
              </li>
              <li>
                <Link to={`${basePath}/about`} className="hover:text-[#E1A990] transition-colors duration-200">
                  Custom Greetings
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Contacts */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold tracking-widest text-[#E1A990] uppercase">
              Contact Gifter
            </h4>
            <ul className="space-y-3.5 text-xs text-[#FFF9FB]/80">
              <li className="flex items-center gap-2">
                <Mail size={14} className="text-[#E1A990] shrink-0" />
                <span>concierge@gifter.in</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-[#E1A990] shrink-0" />
                <span>+91 99999 12345</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={14} className="text-[#E1A990] shrink-0 mt-0.5" />
                <span className="leading-snug">Lotus Boulevard, Gurgaon, Haryana</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#FFF9FB]/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-[#FFF9FB]/50 tracking-wider uppercase font-semibold">
          <p>© {new Date().getFullYear()} Gifter Hamper Labs. All Rights Reserved.</p>
          <div className="flex items-center gap-1 font-sans text-[9px] lowercase italic">
            <span>sealed with</span>
            <Heart size={10} className="text-[#E1A990] fill-[#E1A990]" />
            <span>in gift chambers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
