import React, { useState } from "react";
import {
  Sparkles,
  Search,
  ShoppingBag,
  Award,
  ShieldCheck,
  Phone,
  Calendar,
  Menu,
  X,
  Gem,
  Tag,
  Clock,
} from "lucide-react";

export default function Navbar({
  brandName = "LUXE JEWELS",
  brandLogo = null,
  brandPhone = "+41 22 819 9000",
  activePage = "home",
  setActivePage,
  cartCount = 0,
  onOpenCart,
  searchQuery = "",
  setSearchQuery,
  onOpenAppointment,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: "home", label: "Haute Joaillerie", icon: Sparkles },
    { id: "catalog", label: "Precious Vault", icon: Gem },
    { id: "diamonds", label: "GIA Diamond Standards", icon: Award },
    { id: "bespoke", label: "Bespoke Atelier", icon: Clock },
    { id: "appointment", label: "Private Salon Viewing", icon: Calendar },
    { id: "offers", label: "Heirloom Sets", icon: Tag },
  ];

  const handleNav = (id) => {
    setActivePage(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#08080A]/95 backdrop-blur-xl border-b border-[#D4AF37]/25 shadow-[0_10px_35px_rgba(0,0,0,0.8)] font-serif">
      {/* Top Gold Salon Ribbon */}
      <div className="bg-[#0D0D11] text-[#D5C7B8] text-[11px] py-2 px-4 border-b border-[#D4AF37]/20">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#FBBF24] animate-pulse" />
            <span>
              <strong className="text-[#FBBF24] uppercase text-[10px] tracking-widest mr-1 font-sans">
                Geneva Salon:
              </strong>
              100% Conflict-Free Kimberley Certified Diamonds • Complimentary Insured Armored Global Delivery.
            </span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-[11px] text-[#A89F91]">
            <span className="flex items-center gap-1.5">
              <Award size={13} className="text-[#D4AF37]" /> GIA & IGI Laser Inscribed
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-[#D4AF37]" /> 18k Recycled Gold & Platinum 950
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

      {/* Main Luxury Dark Gold Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Crest */}
        <div
          onClick={() => handleNav("home")}
          className="flex items-center gap-3.5 cursor-pointer group select-none flex-shrink-0"
        >
          {brandLogo ? (
            <img
              src={brandLogo}
              alt={brandName}
              className="h-10 w-auto max-w-[150px] object-contain rounded"
            />
          ) : (
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#D4AF37] via-[#AA771C] to-[#78350F] p-[1px] group-hover:scale-105 transition-transform duration-300 shadow-[0_0_20px_rgba(212,175,55,0.3)]">
              <div className="w-full h-full bg-[#0E0E12] rounded-[15px] flex items-center justify-center">
                <Gem size={20} className="text-[#FBBF24]" />
              </div>
            </div>
          )}
          <div className="text-left">
            <span className="text-xl sm:text-2xl font-black tracking-[0.15em] text-[#FAFAFA] block leading-none group-hover:text-[#FBBF24] transition-colors">
              {brandName}
            </span>
            <span className="text-[9px] uppercase tracking-[0.35em] text-[#D4AF37] font-bold block pt-1 font-sans">
              Haute Joaillerie • Genève
            </span>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1.5">
          {navLinks.map((tab) => {
            const isActive = activePage === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => handleNav(tab.id)}
                className={`relative px-3.5 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? "text-[#FBBF24] bg-[#1C1812] border border-[#D4AF37]/40 shadow-[0_0_15px_rgba(212,175,55,0.15)] font-black"
                    : "text-[#A89F91] hover:text-[#FAFAFA] hover:bg-[#15151A] border border-transparent"
                }`}
              >
                <Icon size={14} className={isActive ? "text-[#FBBF24]" : "text-[#D4AF37]/60"} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Actions: Search, Concierge Booking & Cart */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search diamonds, carats, cuts..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activePage !== "catalog" && activePage !== "home") {
                  setActivePage("catalog");
                }
              }}
              className="w-44 lg:w-56 bg-[#131317] text-xs text-[#FAFAFA] placeholder-[#6E685E] pl-9 pr-3 py-2 rounded-xl border border-[#D4AF37]/30 focus:border-[#FBBF24] focus:w-64 focus:outline-none transition-all duration-300 shadow-inner font-sans"
            />
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#D4AF37]" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#D4AF37] hover:text-white"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Book Concierge Trigger */}
          <button
            onClick={onOpenAppointment || (() => handleNav("appointment"))}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#181613] hover:bg-[#231F18] text-[#FBBF24] border border-[#D4AF37]/40 text-xs font-bold transition cursor-pointer shadow-sm"
          >
            <Calendar size={14} />
            <span>Salon Viewing</span>
          </button>

          {/* Jewel Cart Trigger */}
          <button
            onClick={onOpenCart}
            className="relative px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#B8922C] to-[#8C6D1F] hover:from-[#E5C158] hover:to-[#A37B24] text-[#0A0A0C] transition cursor-pointer flex items-center gap-2 font-bold text-xs shadow-[0_0_20px_rgba(212,175,55,0.3)] active:scale-95 border border-[#FBBF24]/50"
          >
            <ShoppingBag size={16} />
            <span className="hidden sm:inline">Jewel Box</span>
            <span className="bg-[#0A0A0C] text-[#FBBF24] text-[11px] font-sans font-black min-w-[20px] h-5 px-1 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-[#15151A] text-[#FAFAFA] border border-[#D4AF37]/30 cursor-pointer"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#D4AF37]/20 bg-[#0E0E12] px-4 py-4 space-y-2 shadow-2xl animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-2 gap-2 pb-3">
            {navLinks.map((tab) => {
              const isActive = activePage === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleNav(tab.id)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition cursor-pointer text-left ${
                    isActive
                      ? "text-[#FBBF24] bg-[#1C1812] border border-[#D4AF37]/40"
                      : "text-[#A89F91] hover:bg-[#15151A] border border-[#222]"
                  }`}
                >
                  <Icon size={16} className={isActive ? "text-[#FBBF24]" : "text-[#D4AF37]/60"} />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-[#222] flex items-center justify-between text-xs text-[#A89F91]">
            <span className="italic">Rue du Rhône, Genève</span>
            <a href={`tel:${brandPhone}`} className="text-[#FBBF24] font-mono">
              {brandPhone}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
