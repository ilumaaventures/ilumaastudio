import React, { useState } from "react";
import {
  Sparkles,
  Search,
  ShoppingBag,
  Heart,
  ShieldCheck,
  Phone,
  Menu,
  X,
  Droplets,
  HelpCircle,
  Tag,
  Smile,
  CheckCircle2,
} from "lucide-react";

export default function Navbar({
  brandName = "GLOW BEAUTY",
  brandLogo = null,
  brandPhone = "+1 (800) 829-GLOW",
  activePage = "home",
  setActivePage,
  cartCount = 0,
  onOpenCart,
  searchQuery = "",
  setSearchQuery,
  onOpenSkinQuiz,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: "home", label: "Elixirs", icon: Sparkles },
    { id: "catalog", label: "Clean Formulas", icon: Droplets },
    { id: "routines", label: "Skin Routine Quiz", icon: HelpCircle },
    { id: "shade-finder", label: "Shade Finder", icon: Smile },
    { id: "ingredients", label: "Ingredient Transparency", icon: CheckCircle2 },
    { id: "offers", label: "Beauty Bundles", icon: Tag },
  ];

  const handleNav = (id) => {
    setActivePage(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FFF8F8]/95 backdrop-blur-md border-b border-rose-100 shadow-[0_4px_25px_rgba(219,39,119,0.05)]">
      {/* Top Clean Beauty Ribbon */}
      <div className="bg-gradient-to-r from-rose-50 via-pink-50 to-rose-50 text-rose-900 text-[11px] py-2 px-4 border-b border-rose-100/80">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-medium">
            <span className="inline-block w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span>
              <strong className="text-rose-700 font-semibold uppercase text-[10px] mr-1">
                Clean Botanical Promise:
              </strong>
              100% Leaping Bunny Certified Vegan • Formulated without parabens, sulfates, or artificial fragrances.
            </span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-[11px] font-medium text-rose-800">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-rose-500" /> Dermatologist Approved
            </span>
            <span className="flex items-center gap-1.5">
              <Heart size={13} className="text-rose-500" /> 60-Day Radiance Guarantee
            </span>
            <a
              href={`tel:${brandPhone}`}
              className="flex items-center gap-1 text-rose-600 hover:text-rose-700 transition"
            >
              <Phone size={12} /> {brandPhone}
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo & Tagline */}
        <div
          onClick={() => handleNav("home")}
          className="flex items-center gap-3.5 cursor-pointer group select-none flex-shrink-0"
        >
          {brandLogo ? (
            <img
              src={brandLogo}
              alt={brandName}
              className="h-10 w-auto max-w-[150px] object-contain rounded-lg"
            />
          ) : (
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-400 via-pink-500 to-rose-600 text-white flex items-center justify-center shadow-md shadow-rose-300/40 group-hover:scale-105 transition-transform duration-300">
              <Sparkles size={20} className="text-rose-100" />
            </div>
          )}
          <div className="text-left">
            <span className="text-xl sm:text-2xl font-serif font-black tracking-tight text-rose-950 block leading-none">
              {brandName}
            </span>
            <span className="text-[9px] uppercase tracking-[0.25em] text-rose-500 font-bold block pt-1">
              Active Botanical Skincare
            </span>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((tab) => {
            const isActive = activePage === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => handleNav(tab.id)}
                className={`relative px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? "text-rose-900 bg-rose-100/70 border border-rose-200 shadow-sm font-bold"
                    : "text-rose-700/80 hover:text-rose-950 hover:bg-rose-50 border border-transparent"
                }`}
              >
                <Icon size={14} className={isActive ? "text-rose-600" : "text-rose-400"} />
                <span>{tab.label}</span>
                {tab.id === "routines" && (
                  <span className="bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase shadow-xs">
                    Quiz
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Actions: Search, Quiz trigger & Beauty Cart */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Quick Search */}
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search serums, ceramides..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activePage !== "catalog" && activePage !== "home") {
                  setActivePage("catalog");
                }
              }}
              className="w-44 lg:w-56 bg-white text-xs text-rose-950 placeholder-rose-400 pl-9 pr-3 py-2 rounded-xl border border-rose-200 focus:border-rose-400 focus:w-64 focus:outline-none transition-all duration-300 shadow-inner"
            />
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-rose-400" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-rose-400 hover:text-rose-700"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Skin Quiz Shortcut */}
          <button
            onClick={onOpenSkinQuiz || (() => handleNav("routines"))}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-rose-50 text-rose-800 border border-rose-200 text-xs font-semibold transition cursor-pointer shadow-xs"
          >
            <HelpCircle size={14} className="text-rose-500" />
            <span>Skin Quiz</span>
          </button>

          {/* Beauty Cart Trigger */}
          <button
            onClick={onOpenCart}
            className="relative px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 hover:from-rose-500 hover:to-pink-500 text-white transition-all duration-200 cursor-pointer flex items-center gap-2 font-bold text-xs shadow-md shadow-rose-400/30 active:scale-95 border border-rose-300/30"
          >
            <ShoppingBag size={16} className="text-rose-100" />
            <span className="hidden sm:inline">Beauty Bag</span>
            <span className="bg-white text-rose-700 text-[11px] font-black min-w-[20px] h-5 px-1 rounded-full flex items-center justify-center shadow-xs">
              {cartCount}
            </span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-rose-50 text-rose-900 border border-rose-200 cursor-pointer"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-rose-100 bg-[#FFF8F8] px-4 py-4 space-y-2 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-2 gap-2 pb-3">
            {navLinks.map((tab) => {
              const isActive = activePage === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleNav(tab.id)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold tracking-wide transition cursor-pointer text-left ${
                    isActive
                      ? "text-rose-950 bg-rose-100 border border-rose-300 font-bold"
                      : "text-rose-800 hover:bg-rose-50 border border-rose-100"
                  }`}
                >
                  <Icon size={16} className={isActive ? "text-rose-600" : "text-rose-400"} />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-rose-100 flex items-center justify-between text-xs text-rose-700">
            <span className="italic font-serif">Clean Botanical Science</span>
            <a href={`tel:${brandPhone}`} className="text-rose-900 font-medium">
              {brandPhone}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
