import React, { useState } from "react";
import {
  Cpu,
  ShieldCheck,
  RotateCcw,
  Phone,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Headphones,
  Sliders,
  Battery,
  Tag,
  Menu,
  X,
  Radio,
  Zap,
} from "lucide-react";

export default function Navbar({
  brandName = "TECHNOVA",
  brandLogo = null,
  brandPhone = "+1 (888) 404-TECH",
  activePage = "home",
  setActivePage,
  cartCount = 0,
  onOpenCart,
  searchQuery = "",
  setSearchQuery,
  onOpenCompare,
  compareCount = 0,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);

  const navLinks = [
    { id: "home", label: "Flagships", icon: Headphones },
    { id: "specs", label: "Hardware Catalog", icon: Cpu },
    { id: "compare", label: "Spec Shootout", icon: SlidersHorizontal },
    { id: "eq-lab", label: "EQ Simulator", icon: Sliders },
    { id: "battery-calc", label: "Battery Lab", icon: Battery },
    { id: "offers", label: "Deals & Drops", icon: Tag },
  ];

  const handleNavClick = (id) => {
    setActivePage(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#090D16]/95 backdrop-blur-xl border-b border-cyan-500/20 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
      {/* Top Cyber Status Bar */}
      <div className="bg-[#050811] text-slate-400 text-[11px] py-2 px-4 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-medium tracking-wide">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="text-slate-300">
              <strong className="text-cyan-400 font-semibold tracking-wider uppercase text-[10px] mr-1">
                Hardware Drop 3.2:
              </strong>
              TechShield 2-Yr Warranty with 24-Hr Express Advance Replacement on all Flagships.
            </span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-[11px] font-medium text-slate-300">
            <span className="flex items-center gap-1.5 hover:text-cyan-300 transition cursor-default">
              <ShieldCheck size={13} className="text-cyan-400" />
              100% Authentic OEM Silicon
            </span>
            <span className="flex items-center gap-1.5 hover:text-cyan-300 transition cursor-default">
              <RotateCcw size={13} className="text-cyan-400" />
              30-Day Risk-Free Audio Trial
            </span>
            <a
              href={`tel:${brandPhone}`}
              className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition"
            >
              <Phone size={12} />
              <span className="font-mono">{brandPhone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Cyber Navigation Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo & Tagline */}
        <div
          onClick={() => handleNavClick("home")}
          className="flex items-center gap-3.5 cursor-pointer group select-none flex-shrink-0"
        >
          {brandLogo ? (
            <img
              src={brandLogo}
              alt={brandName}
              className="h-10 w-auto max-w-[150px] object-contain rounded-lg"
            />
          ) : (
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-600 to-violet-600 p-[1px] group-hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                <div className="w-full h-full bg-[#0B1120] rounded-[15px] flex items-center justify-center">
                  <Cpu size={22} className="text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400"></span>
              </span>
            </div>
          )}
          <div className="text-left">
            <span className="text-xl sm:text-2xl font-black tracking-tight text-white block leading-none group-hover:text-cyan-300 transition-colors">
              {brandName}
            </span>
            <span className="text-[9px] uppercase tracking-[0.25em] text-cyan-400/80 font-bold block pt-1 font-mono">
              Next-Gen Audio & Silicon
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((tab) => {
            const isActive = activePage === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => handleNavClick(tab.id)}
                className={`relative px-3.5 py-2 rounded-xl text-xs font-bold tracking-wide uppercase transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? "text-cyan-300 bg-cyan-950/60 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 border border-transparent"
                }`}
              >
                <Icon size={14} className={isActive ? "text-cyan-400" : "text-slate-500"} />
                <span>{tab.label}</span>
                {tab.id === "offers" && (
                  <span className="bg-gradient-to-r from-rose-500 to-amber-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase tracking-tighter shadow-sm animate-pulse">
                    Hot
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Controls: Search, Compare & Tech Cart */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Quick Search toggle/input */}
          <div className="relative hidden md:block">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search specs, drivers, models..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (activePage !== "specs" && activePage !== "home") {
                    setActivePage("specs");
                  }
                }}
                className="w-44 lg:w-56 bg-slate-900/90 text-xs text-white placeholder-slate-500 pl-9 pr-3 py-2 rounded-xl border border-slate-700/80 focus:border-cyan-500 focus:w-64 focus:outline-none transition-all duration-300 shadow-inner"
              />
              <Search
                size={14}
                className="absolute left-3 text-slate-400 pointer-events-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 text-slate-400 hover:text-white text-xs"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          </div>

          {/* Quick Compare Trigger */}
          <button
            onClick={onOpenCompare || (() => handleNavClick("compare"))}
            title="Open Spec Shootout Matrix"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/90 text-slate-300 hover:text-cyan-300 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/40 text-xs font-bold transition cursor-pointer"
          >
            <SlidersHorizontal size={14} className="text-cyan-400" />
            <span className="hidden xl:inline">Compare</span>
            {compareCount > 0 && (
              <span className="bg-cyan-500 text-slate-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {compareCount}
              </span>
            )}
          </button>

          {/* Tech Cart Trigger Button */}
          <button
            onClick={onOpenCart}
            className="relative px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white transition-all duration-200 cursor-pointer flex items-center gap-2 font-bold text-xs shadow-[0_4px_16px_rgba(37,99,235,0.35)] border border-cyan-400/30 active:scale-95"
          >
            <ShoppingBag size={16} className="text-cyan-200" />
            <span className="hidden sm:inline">Cart</span>
            <span className="bg-cyan-300 text-slate-950 text-[11px] font-black min-w-[20px] h-5 px-1 rounded-full flex items-center justify-center shadow-sm">
              {cartCount}
            </span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white border border-slate-700/80 focus:outline-none cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar if active */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Search specs, drivers, models..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (activePage !== "specs" && activePage !== "home") {
                setActivePage("specs");
              }
            }}
            className="w-full bg-slate-900/90 text-xs text-white placeholder-slate-500 pl-9 pr-8 py-2.5 rounded-xl border border-slate-700/80 focus:border-cyan-500 focus:outline-none"
          />
          <Search size={15} className="absolute left-3 text-slate-400 pointer-events-none" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 text-slate-400 hover:text-white"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-[#0B1120] px-4 py-4 space-y-2 shadow-2xl animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-2 gap-2 pb-3">
            {navLinks.map((tab) => {
              const isActive = activePage === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleNavClick(tab.id)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-bold tracking-wide uppercase transition cursor-pointer text-left ${
                    isActive
                      ? "text-cyan-300 bg-cyan-950/60 border border-cyan-500/40"
                      : "text-slate-300 hover:bg-slate-800/80 border border-slate-800"
                  }`}
                >
                  <Icon size={16} className={isActive ? "text-cyan-400" : "text-slate-500"} />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1 text-cyan-400 font-mono">
              <Zap size={13} /> High-Fidelity Silicon
            </span>
            <a href={`tel:${brandPhone}`} className="text-slate-300 hover:text-white">
              {brandPhone}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
