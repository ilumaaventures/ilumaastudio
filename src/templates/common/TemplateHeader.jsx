import React, { useState } from "react";
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  Phone,
  Calendar,
  Sparkles,
  MapPin,
  Clock,
  Heart,
} from "lucide-react";
import formatAddress from "../../utils/formatAddress";

export default function TemplateHeader({
  business = {},
  cartCount = 0,
  onOpenCart,
  onOpenBooking,
  isService = false,
  themeColors = {},
  announcementText = "",
  navLinks = [],
  activePage = "home",
  onNavigate,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const primaryColor = themeColors.primary || "#4F46E5";
  const textColor = themeColors.text || "#0F172A";

  const defaultLinks = isService
    ? [
        { id: "home", label: "Home" },
        { id: "services", label: "Services & Menu" },
        { id: "pricing", label: "Pricing & Plans" },
        { id: "about", label: "About Us" },
        { id: "contact", label: "Contact & Hours" },
      ]
    : [
        { id: "home", label: "Home" },
        { id: "shop", label: "Shop All" },
        { id: "about", label: "Our Story" },
        { id: "contact", label: "Contact & FAQ" },
      ];

  const links = navLinks.length > 0 ? navLinks : defaultLinks;

  const handleLinkClick = (link, e) => {
    if (onNavigate && link.id) {
      e?.preventDefault();
      onNavigate(link.id);
      setMobileMenuOpen(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim() && onNavigate) {
      onNavigate(isService ? "services" : "shop", searchQuery.trim());
      setSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 transition-all shadow-xs">
      {/* 1. Announcement Bar */}
      {announcementText && (
        <div
          className="text-white text-[11px] font-bold py-2 px-4 text-center transition tracking-wide flex items-center justify-center gap-2"
          style={{ backgroundColor: primaryColor }}
        >
          <span>{announcementText}</span>
        </div>
      )}

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Mobile Menu Button */}
        <div className="flex items-center gap-3 lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Brand Logo & Name */}
        <div
          onClick={() => onNavigate && onNavigate("home")}
          className="flex items-center gap-3 cursor-pointer group"
        >
          {business.logo ? (
            <img
              src={business.logo}
              alt={business.name || "Business Logo"}
              className="w-10 h-10 rounded-xl object-cover border border-slate-100 shadow-2xs group-hover:scale-105 transition"
            />
          ) : (
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-base shadow-xs group-hover:scale-105 transition"
              style={{ backgroundColor: primaryColor }}
            >
              {(business.name || business.businessName || "S")[0]}
            </div>
          )}
          <div className="flex flex-col">
            <span
              className="text-base font-black tracking-tight leading-tight line-clamp-1"
              style={{ color: textColor }}
            >
              {business.name || business.businessName || "Storefront"}
            </span>
            {business.category && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {business.category}
              </span>
            )}
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7">
          {links.map((link) => {
            const isActive = activePage === link.id;
            return (
              <button
                key={link.id || link.label}
                onClick={(e) => handleLinkClick(link, e)}
                className={`text-xs font-bold transition hover:-translate-y-0.5 cursor-pointer relative py-1 ${
                  isActive ? "text-slate-950 font-black" : "text-slate-600 hover:text-slate-950"
                }`}
              >
                <span>{link.label}</span>
                {isActive && (
                  <span
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                    style={{ backgroundColor: primaryColor }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Controls: Search, Cart, Booking CTA */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Search Toggle */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            title="Search"
          >
            <Search size={18} />
          </button>

          {/* Service Provider Booking Button */}
          {isService ? (
            <button
              onClick={onOpenBooking}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-xs font-bold transition shadow-sm hover:opacity-90 cursor-pointer"
              style={{ backgroundColor: primaryColor }}
            >
              <Calendar size={14} />
              <span className="hidden sm:inline">Book Appointment</span>
              <span className="sm:hidden">Book</span>
            </button>
          ) : (
            /* E-commerce Shopping Bag */
            <button
              onClick={onOpenCart}
              className="relative p-2.5 text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              title="Shopping Bag"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs animate-scale"
                  style={{ backgroundColor: primaryColor }}
                >
                  {cartCount}
                </span>
              )}
            </button>
          )}

          {/* Quick Phone Call on mobile */}
          {business.phone && (
            <a
              href={`tel:${business.phone}`}
              className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold transition"
            >
              <Phone size={13} style={{ color: primaryColor }} />
              <span>{business.phone}</span>
            </a>
          )}
        </div>
      </div>

      {/* Expandable Search Input */}
      {searchOpen && (
        <form onSubmit={handleSearchSubmit} className="border-t border-slate-100 px-4 py-3 bg-slate-50">
          <div className="max-w-xl mx-auto relative">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <input
              type="text"
              autoFocus
              placeholder="Search catalog, products, or services (press Enter)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden shadow-2xs"
            />
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
        </form>
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-6 py-5 space-y-4 shadow-xl">
          <nav className="flex flex-col space-y-3">
            {links.map((link) => {
              const isActive = activePage === link.id;
              return (
                <button
                  key={link.id || link.label}
                  onClick={(e) => handleLinkClick(link, e)}
                  className={`text-left text-sm font-bold py-1.5 transition cursor-pointer ${
                    isActive ? "text-indigo-600 font-black pl-2 border-l-2 border-indigo-600" : "text-slate-800 hover:text-indigo-600"
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>
          {business.phone && (
            <div className="pt-3 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-slate-600">
              <Phone size={14} style={{ color: primaryColor }} />
              <span>Call Us: {business.phone}</span>
            </div>
          )}
          {formatAddress(business.address) && (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <MapPin size={14} className="shrink-0 text-slate-400" />
              <span className="truncate">{formatAddress(business.address)}</span>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
