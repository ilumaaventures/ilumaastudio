import React from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  Instagram,
  Facebook,
  Twitter,
  ArrowRight,
} from "lucide-react";
import formatAddress from "../../utils/formatAddress";

export default function TemplateFooter({
  business = {},
  themeColors = {},
  isService = false,
}) {
  const primaryColor = themeColors.primary || "#4F46E5";

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              {business.logo ? (
                <img
                  src={business.logo}
                  alt={business.name}
                  className="w-10 h-10 rounded-xl object-cover"
                />
              ) : (
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-lg"
                  style={{ backgroundColor: primaryColor }}
                >
                  {(business.name || "S")[0]}
                </div>
              )}
              <span className="text-lg font-black text-white tracking-tight">
                {business.name || business.businessName || "Storefront"}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {business.description ||
                "Providing exceptional quality, verified products, and premium services crafted with dedication and customer care."}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="#"
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition"
              >
                <Instagram size={15} />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition"
              >
                <Facebook size={15} />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition"
              >
                <Twitter size={15} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a href="#hero" className="hover:text-white transition">
                  Home
                </a>
              </li>
              <li>
                <a
                  href={isService ? "#services" : "#products"}
                  className="hover:text-white transition"
                >
                  {isService ? "Our Services" : "Catalog & Products"}
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-white transition">
                  Our Story
                </a>
              </li>
              <li>
                <a href="#reviews" className="hover:text-white transition">
                  Client Reviews
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition">
                  Contact & Location
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Care & Policies */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">
              Assurance
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a href="#" className="hover:text-white transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Refund & Cancellation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Shipping & Dispatch
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Help & FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">
              Contact & Hours
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              {business.phone && (
                <li className="flex items-center gap-2">
                  <Phone size={14} style={{ color: primaryColor }} />
                  <span>{business.phone}</span>
                </li>
              )}
              {business.email && (
                <li className="flex items-center gap-2">
                  <Mail size={14} style={{ color: primaryColor }} />
                  <span>{business.email}</span>
                </li>
              )}
              {formatAddress(business.address) && (
                <li className="flex items-start gap-2">
                  <MapPin size={14} className="mt-0.5 shrink-0" style={{ color: primaryColor }} />
                  <span>{formatAddress(business.address)}</span>
                </li>
              )}
              <li className="flex items-center gap-2 text-slate-500 pt-1">
                <Clock size={14} />
                <span>Mon - Sun: 8:00 AM - 10:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} {business.name || "ILUMA Storefront"}. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400">Powered by</span>
            <span className="font-extrabold text-white tracking-widest text-[11px] uppercase bg-slate-800 px-2 py-0.5 rounded-md">
              ILUMA Studio
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
