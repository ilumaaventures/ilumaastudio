import React, { useState } from "react";
import {
  ShoppingBag,
  Search,
  ShieldCheck,
  Award,
  Sparkles,
  Phone,
  Compass,
  Menu,
  X,
  Tag,
  Layers,
  Briefcase,
} from "lucide-react";

export default function Navbar({
  brandName = "CUIR & CO.",
  brandLogo = null,
  brandPhone = "+39 055 289 400",
  activePage = "home",
  setActivePage,
  cartCount = 0,
  onOpenCart,
  searchQuery = "",
  setSearchQuery,
  onOpenMonogram,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: "home", label: "Heritage Collection", icon: Briefcase },
    { id: "catalog", label: "Leather Silhouettes", icon: Compass },
    { id: "leather-craft", label: "Tuscan Atelier", icon: Award },
    { id: "monogram", label: "Bespoke Monogram", icon: Sparkles },
    { id: "offers", label: "Travel Bundles", icon: Tag },
  ];

  const handleNav = (id) => {
    setActivePage(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E7DFD5] shadow-[0_4px_25px_rgba(44,24,16,0.06)]">
      {/* Top Atelier Status Ribbon */}
      <div className="bg-[#2C1810] text-[#E7DFD5] text-[11px] py-2 px-4 tracking-wider">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-serif">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#D97706] animate-pulse" />
            <span>
              <strong className="text-[#FBBF24] font-medium tracking-widest uppercase text-[10px] mr-1">
                Florence Atelier:
              </strong>
              Complimentary 24k Gold Foil Monogramming & Lifetime Stitching Guarantee on all Heritage Carry.
            </span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-[11px] font-medium text-[#D5C7B8]">
            <span className="flex items-center gap-1.5">
              <Award size={13} className="text-[#D97706]" /> Full-Grain Vegetable-Tanned
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-[#D97706]" /> Lifetime Hardware Warranty
            </span>
            <a
              href={`tel:${brandPhone}`}
              className="flex items-center gap-1 text-[#FBBF24] hover:text-white transition font-mono"
            >
              <Phone size={12} /> {brandPhone}
            </a>
          </div>
        </div>
      </div>

      {/* Main Luxury Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo & Italian Tagline */}
        <div
          onClick={() => handleNav("home")}
          className="flex items-center gap-3 cursor-pointer group select-none flex-shrink-0"
        >
          {brandLogo ? (
            <img
              src={brandLogo}
              alt={brandName}
              className="h-10 w-auto max-w-[150px] object-contain"
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-[#2C1810] text-[#FAF7F2] flex items-center justify-center border border-[#8C6D58]/40 group-hover:bg-[#3D2217] transition shadow-md">
              <Briefcase size={20} className="text-[#D97706]" />
            </div>
          )}
          <div className="text-left">
            <span className="text-xl sm:text-2xl font-serif font-black tracking-widest text-[#2C1810] block leading-none">
              {brandName}
            </span>
            <span className="text-[9px] uppercase tracking-[0.3em] text-[#8C6D58] font-bold block pt-1 font-serif">
              Pelletteria Fiorentina
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-2">
          {navLinks.map((tab) => {
            const isActive = activePage === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => handleNav(tab.id)}
                className={`relative px-3.5 py-2 rounded-xl text-xs font-serif font-bold tracking-wider uppercase transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? "text-[#2C1810] bg-[#EFE9DF] border border-[#D5C7B8] shadow-sm font-black"
                    : "text-[#6B5344] hover:text-[#2C1810] hover:bg-[#F3EDE3] border border-transparent"
                }`}
              >
                <Icon size={14} className={isActive ? "text-[#B45309]" : "text-[#8C6D58]"} />
                <span>{tab.label}</span>
                {tab.id === "monogram" && (
                  <span className="bg-[#B45309] text-white text-[9px] font-sans font-black px-1.5 py-0.2 rounded-full uppercase">
                    Free
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Controls: Search, Monogram, Cart */}
        <div className="flex items-center gap-3">
          {/* Quick Search Bar */}
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search briefcases, duffels..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activePage !== "catalog" && activePage !== "home") {
                  setActivePage("catalog");
                }
              }}
              className="w-44 lg:w-56 bg-white/90 text-xs text-[#2C1810] placeholder-[#A08C7D] pl-9 pr-3 py-2 rounded-xl border border-[#D8CCBD] focus:border-[#8C6D58] focus:w-64 focus:outline-none transition-all duration-300 shadow-inner"
            />
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8C6D58]" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8C6D58] hover:text-[#2C1810]"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Monogram Quick Studio Trigger */}
          <button
            onClick={onOpenMonogram || (() => handleNav("monogram"))}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#F0EAE1] hover:bg-[#E7DFD5] text-[#2C1810] border border-[#D5C7B8] text-xs font-serif font-bold transition cursor-pointer"
          >
            <Sparkles size={14} className="text-[#B45309]" />
            <span>Monogram Studio</span>
          </button>

          {/* Luxury Leather Cart Trigger */}
          <button
            onClick={onOpenCart}
            className="relative px-3.5 sm:px-4 py-2 rounded-xl bg-[#2C1810] hover:bg-[#3D2217] text-[#FAF7F2] transition cursor-pointer flex items-center gap-2 font-serif font-bold text-xs shadow-md border border-[#8C6D58]/30 active:scale-95"
          >
            <ShoppingBag size={16} className="text-[#D97706]" />
            <span className="hidden sm:inline">Carry Cart</span>
            <span className="bg-[#D97706] text-white text-[11px] font-sans font-black min-w-[20px] h-5 px-1 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-[#EFE9DF] text-[#2C1810] border border-[#D5C7B8] cursor-pointer"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E7DFD5] bg-[#FAF7F2] px-4 py-4 space-y-2 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-2 gap-2 pb-3">
            {navLinks.map((tab) => {
              const isActive = activePage === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleNav(tab.id)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-serif font-bold tracking-wider uppercase transition cursor-pointer text-left ${
                    isActive
                      ? "text-[#2C1810] bg-[#EFE9DF] border border-[#B45309]"
                      : "text-[#6B5344] hover:bg-[#F3EDE3] border border-[#E7DFD5]"
                  }`}
                >
                  <Icon size={16} className={isActive ? "text-[#B45309]" : "text-[#8C6D58]"} />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-[#E7DFD5] flex items-center justify-between text-xs text-[#6B5344]">
            <span className="font-serif italic text-[#8C6D58]">Handcrafted in Tuscany</span>
            <a href={`tel:${brandPhone}`} className="text-[#2C1810] font-mono">
              {brandPhone}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
