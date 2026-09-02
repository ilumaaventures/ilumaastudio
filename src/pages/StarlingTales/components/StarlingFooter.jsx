import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Sparkles, Mail, Phone, MapPin, Heart, Store, MessageCircle } from "lucide-react";
import { useStore } from "../../Store/StoreContext";
import StarlingWhatsAppButton from "./StarlingWhatsAppButton";

export default function StarlingFooter() {
  const { business, storeHomePath: contextHomePath } = useStore();
  const { pathname } = useLocation();

  const storeHomePath =
    contextHomePath ||
    (business?.subdomain
      ? `/${encodeURIComponent(business.subdomain)}`
      : business?.slug
        ? `/${encodeURIComponent(business.slug)}`
        : business?.businessName
          ? `/${encodeURIComponent(business.businessName)}`
          : "");

  const handleFooterHomeClick = (e) => {
    const currentClean = pathname.replace(/\/$/, "");
    const targetClean = storeHomePath.replace(/\/$/, "");
    if (currentClean === targetClean) {
      e.preventDefault();
      const el = document.getElementById("home");
      if (el) {
        const headerElement = document.querySelector("header");
        const navOffset = headerElement ? headerElement.offsetHeight : 80;
        const y = el.getBoundingClientRect().top + window.scrollY - navOffset;
        window.scrollTo({ top: Math.max(0, Math.round(y)), behavior: "smooth" });
      }
    }
  };

  const fullAddress = business?.address
    ? [
        business.address.street,
        business.address.addressLine2,
        business.address.city,
        business.address.state,
        business.address.country,
      ]
        .filter(Boolean)
        .join(", ")
    : "The Old Mill Villa, Gurgaon, India";

  const cleanPhone = (business?.whatsapp || business?.businessPhone || "919876543210").replace(/\D/g, "");

  return (
    <footer className="bg-[#2C3E35] text-[#FAF6F0] border-t border-[#C5A880]/30 font-sans relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Ethos with Logo */}
          <div className="space-y-4 col-span-1 md:col-span-2">
            <Link
              to={`${storeHomePath}#home`}
              onClick={handleFooterHomeClick}
              className="inline-flex items-center gap-3 group"
            >
              {business?.logo ? (
                <img
                  src={business.logo}
                  alt={business?.businessName || "Starling Tales"}
                  className="h-10 w-auto object-contain rounded-lg bg-white/10 p-1 border border-[#C5A880]/30 transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="w-10 h-10 rounded-full border border-[#C5A880] flex items-center justify-center text-[#C5A880] bg-white/5 transition-transform group-hover:scale-105">
                  <Sparkles size={18} />
                </div>
              )}
              <span className="font-serif font-black text-xl tracking-wider capitalize text-[#FAF6F0] group-hover:text-[#C5A880] transition-colors">
                {business?.businessName || "Starling Tales"}
              </span>
            </Link>
            <p className="text-xs text-[#FAF6F0]/70 leading-relaxed font-serif max-w-sm">
              {business?.description ||
                "We chronicle old tales through heirloom keepsakes, handmade botanical formulations, and custom poetry. Each artifact is crafted by local residents and dedicated makers."}
            </p>
          </div>

          {/* Collections Quick Links */}
          <div className="space-y-4">
            <h4 className="font-serif text-sm font-bold tracking-widest text-[#C5A880] uppercase">
              The Archives
            </h4>
            <ul className="space-y-2.5 text-xs text-[#FAF6F0]/80">
              <li>
                <Link
                  to={`${storeHomePath}/products`}
                  className="hover:text-[#C5A880] transition-colors duration-200"
                >
                  Custom Heirlooms
                </Link>
              </li>
              <li>
                <Link
                  to={`${storeHomePath}/products`}
                  className="hover:text-[#C5A880] transition-colors duration-200"
                >
                  Residents' Crafts
                </Link>
              </li>
              <li>
                <Link
                  to={`${storeHomePath}#about-us`}
                  className="hover:text-[#C5A880] transition-colors duration-200"
                >
                  Our Philosophy
                </Link>
              </li>
            </ul>
          </div>

          {/* Business Policies */}
          <div className="space-y-4">
            <h4 className="font-serif text-sm font-bold tracking-widest text-[#C5A880] uppercase">
              Business Policies
            </h4>
            <ul className="space-y-2.5 text-xs text-[#FAF6F0]/80 font-serif">
              <li>
                <Link
                  to={`${storeHomePath}/policies#return`}
                  className="hover:text-[#C5A880] transition-colors duration-200"
                >
                  Return Policy
                </Link>
              </li>
              <li>
                <Link
                  to={`${storeHomePath}/policies#exchange`}
                  className="hover:text-[#C5A880] transition-colors duration-200"
                >
                  Exchange Policy
                </Link>
              </li>
              <li>
                <Link
                  to={`${storeHomePath}/policies#refund`}
                  className="hover:text-[#C5A880] transition-colors duration-200"
                >
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link
                  to={`${storeHomePath}/policies#shipping`}
                  className="hover:text-[#C5A880] transition-colors duration-200"
                >
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link
                  to={`${storeHomePath}/policies#terms`}
                  className="hover:text-[#C5A880] transition-colors duration-200"
                >
                  Terms & Privacy
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
                <span>{business?.businessEmail || "support@starlingtales.com"}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-[#C5A880] shrink-0" />
                <span>{business?.businessPhone || "+91 98765 43210"}</span>
              </li>
              <li className="flex items-center gap-2">
                <a
                  href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent("Hello Starling Tales! I would like to connect.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-[#25D366] transition-colors"
                >
                  <MessageCircle size={14} className="text-[#25D366] shrink-0" />
                  <span>WhatsApp Support</span>
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={14} className="text-[#C5A880] shrink-0 mt-0.5" />
                <span className="leading-snug">{fullAddress}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#FAF6F0]/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-[#FAF6F0]/50 tracking-wider uppercase font-semibold">
          <p>© {new Date().getFullYear()} {business?.businessName || "Starling Tales"}. All Rights Reserved.</p>
          <div className="flex items-center gap-1 font-serif text-[9px] lowercase italic">
            <span>crafted with</span>
            <Heart size={10} className="text-[#C85C5C] fill-[#C85C5C]" />
            <span>in resident mills</span>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp Action Button in Bottom Right Corner */}
      <StarlingWhatsAppButton />
    </footer>
  );
}

