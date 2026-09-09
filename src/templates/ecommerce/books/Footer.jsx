import React from "react";
import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Mail,
  ArrowRight,
} from "lucide-react";

export default function Footer({
  brandName = "ENIGMA | Enigma",
  brandLogo = null,
  brandEmail = "enigmaofficial@ilumaa.com",
  onNavigate,
}) {
  return (
    <footer className="bg-white border-t border-[#E5E7EB] pt-14 pb-12 text-left font-sans text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-12 border-b border-[#F3F4F6]">
          {/* ================= COL 1: BRAND & CONTACT ================= */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {brandLogo ? (
                <img
                  src={brandLogo}
                  alt={brandName}
                  className="h-8 w-auto max-w-[120px] object-contain"
                />
              ) : (
                <div className="px-3 py-1 rounded-full border-2 border-black inline-flex items-center justify-center tracking-widest text-xs font-serif font-black uppercase text-black">
                  ENIGMA
                </div>
              )}
            </div>

            <div className="space-y-1 text-stone-500 text-xs">
              <p>For queries and help</p>
              <p>
                Contact:{" "}
                <a
                  href={`mailto:${brandEmail}`}
                  className="text-stone-800 hover:text-black font-medium transition"
                >
                  {brandEmail}
                </a>
              </p>
            </div>
          </div>

          {/* ================= COL 2: COLLECTIONS ================= */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-stone-900 uppercase tracking-wider">
              Collections
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate && onNavigate("catalog")}
                  className="text-stone-600 hover:text-black transition cursor-pointer text-xs"
                >
                  Digital Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate && onNavigate("catalog", "Business & Leadership")}
                  className="text-stone-600 hover:text-black transition cursor-pointer text-xs"
                >
                  Business & Leadership
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate && onNavigate("catalog", "Self-Improvement")}
                  className="text-stone-600 hover:text-black transition cursor-pointer text-xs"
                >
                  Self-Improvement & Habits
                </button>
              </li>
            </ul>
          </div>

          {/* ================= COL 3: STAY CONNECTED ================= */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-stone-900 uppercase tracking-wider">
              Stay Connected
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-stone-600 hover:text-black transition text-xs"
                >
                  <Facebook size={14} className="text-stone-500" />
                  <span>Facebook</span>
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-stone-600 hover:text-black transition text-xs"
                >
                  <Twitter size={14} className="text-stone-500" />
                  <span>Twitter</span>
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-stone-600 hover:text-black transition text-xs"
                >
                  <Linkedin size={14} className="text-stone-500" />
                  <span>LinkedIn</span>
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-stone-600 hover:text-black transition text-xs"
                >
                  <Instagram size={14} className="text-stone-500" />
                  <span>Instagram</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-stone-400 text-[11px]">
          <p>© {new Date().getFullYear()} ENIGMA Publications. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate && onNavigate("catalog")}
              className="hover:text-stone-700 transition"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              onClick={() => onNavigate && onNavigate("catalog")}
              className="hover:text-stone-700 transition"
            >
              Terms of Service
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
