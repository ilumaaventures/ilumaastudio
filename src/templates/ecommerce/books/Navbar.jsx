import React, { useState } from "react";
import {
  Search,
  ShoppingBag,
  User,
  LayoutGrid,
  Globe,
  X,
  Check,
  BookOpen,
} from "lucide-react";

export default function Navbar({
  brandName = "ENIGMA | Enigma",
  brandLogo = null,
  activePage = "home",
  setActivePage,
  cartCount = 0,
  onOpenCart,
  searchQuery = "",
  setSearchQuery,
  onOpenCategoryMenu,
}) {
  const [langModalOpen, setLangModalOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState("English (US)");
  const [searchOpen, setSearchOpen] = useState(false);

  const languages = [
    { code: "en", label: "English (US)" },
    { code: "es", label: "Español" },
    { code: "fr", label: "Français" },
    { code: "de", label: "Deutsch" },
    { code: "ja", label: "日本語" },
    { code: "pt", label: "Português" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E5E7EB] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-4">
        {/* ================= LEFT: ENIGMA OVAL BRAND CREST ================= */}
        <div
          onClick={() => {
            setActivePage("home");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex items-center gap-2.5 cursor-pointer group select-none flex-shrink-0"
        >
          {brandLogo ? (
            <img
              src={brandLogo}
              alt={brandName}
              className="h-8 w-auto max-w-[120px] object-contain"
            />
          ) : (
            <div className="flex items-center gap-2">
              {/* ENIGMA Oval Pill Badge matching Reference */}
              <div className="px-3 py-1 rounded-full border-2 border-black flex items-center justify-center tracking-widest text-xs font-serif font-black uppercase text-black">
                ENIGMA
              </div>
              <span className="hidden sm:inline-block text-stone-400 font-light text-sm">
                |
              </span>
              <span className="hidden sm:inline-block text-sm font-medium text-stone-700 tracking-tight">
                Enigma
              </span>
            </div>
          )}
        </div>

        {/* ================= CENTER: CHANGE STORE LANGUAGE ================= */}
        <div className="hidden md:flex items-center">
          <button
            type="button"
            onClick={() => setLangModalOpen(true)}
            className="text-xs text-stone-600 hover:text-black transition flex items-center gap-1.5 py-1.5 px-3 rounded-full hover:bg-stone-50 border border-transparent hover:border-stone-200 cursor-pointer"
          >
            <Globe size={13} className="text-stone-400" />
            <span>Change store language</span>
            <span className="text-[10px] text-stone-400 font-mono">({selectedLang.split(" ")[0]})</span>
          </button>
        </div>

        {/* ================= RIGHT: ICON ACTION GROUP ================= */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Quick Categories Grid Icon */}
          <button
            type="button"
            title="Browse All Digital Products"
            onClick={() => {
              setActivePage("catalog");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="p-2 text-stone-700 hover:text-black hover:bg-stone-100 rounded-full transition cursor-pointer"
          >
            <LayoutGrid size={18} />
          </button>

          {/* Search Toggle Icon */}
          <button
            type="button"
            title="Search Books"
            onClick={() => setSearchOpen(!searchOpen)}
            className={`p-2 rounded-full transition cursor-pointer ${
              searchOpen
                ? "bg-[#133E47] text-white"
                : "text-stone-700 hover:text-black hover:bg-stone-100"
            }`}
          >
            <Search size={18} />
          </button>

          {/* User Account Icon */}
          <button
            type="button"
            title="My Library Account"
            onClick={() => {
              setActivePage("catalog");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="p-2 text-stone-700 hover:text-black hover:bg-stone-100 rounded-full transition cursor-pointer"
          >
            <User size={18} />
          </button>

          {/* Shopping Bag with Badge */}
          <button
            type="button"
            title="Shopping Cart"
            onClick={onOpenCart}
            className="relative p-2 text-stone-800 hover:text-black hover:bg-stone-100 rounded-full transition cursor-pointer"
          >
            <ShoppingBag size={19} />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#133E47] text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ================= EXPANDABLE SEARCH OVERLAY ================= */}
      {searchOpen && (
        <div className="border-t border-stone-200 bg-[#FAF9F6] px-4 py-3 sm:px-6">
          <div className="max-w-2xl mx-auto flex items-center gap-3">
            <Search size={16} className="text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activePage !== "catalog") setActivePage("catalog");
              }}
              placeholder="Search by title, author, or topic (e.g. Atomic Habits, Chip War, Robert Iger)..."
              className="flex-1 bg-transparent text-sm text-stone-900 placeholder-stone-400 focus:outline-none py-1"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-stone-400 hover:text-stone-600 p-1"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* ================= LANGUAGE SELECTOR MODAL ================= */}
      {langModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-stone-900">
                Select Store Language
              </h3>
              <button
                onClick={() => setLangModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-1">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    setSelectedLang(l.label);
                    setLangModalOpen(false);
                  }}
                  className={`w-full px-3 py-2.5 rounded-lg text-xs text-left flex items-center justify-between transition cursor-pointer ${
                    selectedLang === l.label
                      ? "bg-[#133E47] text-white font-medium"
                      : "text-stone-700 hover:bg-stone-100"
                  }`}
                >
                  <span>{l.label}</span>
                  {selectedLang === l.label && <Check size={14} />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
