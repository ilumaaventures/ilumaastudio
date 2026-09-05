import React, { useState } from "react";
import {
  ShoppingBag,
  Search,
  Heart,
  Menu,
  X,
  Sparkles,
  Compass,
  Tag,
} from "lucide-react";

export default function Navbar({
  brandName = "ATELIER URBAN",
  brandLogo = null,
  activePage = "home",
  setActivePage = () => {},
  cartCount = 0,
  onOpenCart = () => {},
  currency = "INR",
  setCurrency = () => {},
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: "home", label: "Home" },
    { id: "lookbook", label: "Editorial Lookbook" },
    { id: "collections", label: "Collections" },
    { id: "offers", label: "Runway Offers", badge: "VIP Sale" },
    { id: "size-guide", label: "Size & Fit" },
    { id: "atelier", label: "The Atelier" },
  ];

  const handleNavClick = (id) => {
    setActivePage(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200">
      {/* Top Luxury Announcement Bar */}
      <div className="bg-zinc-950 text-white text-[10px] uppercase font-mono tracking-widest py-1.5 px-4 text-center flex items-center justify-center gap-2">
        <Sparkles size={11} className="text-amber-400" />
        <span>Complimentary Insured Express Worldwide Delivery on all luxury orders</span>
        <span className="hidden sm:inline text-zinc-500">|</span>
        <span className="hidden sm:inline text-zinc-400">Use code RUNWAY20 for 20% off selected outerwear</span>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <div
          onClick={() => handleNavClick("home")}
          className="flex items-center gap-3 cursor-pointer group select-none text-left"
        >
          {brandLogo ? (
            <img
              src={brandLogo}
              alt={brandName}
              className="h-10 sm:h-12 w-auto max-w-[150px] object-contain"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-zinc-950 text-white flex items-center justify-center font-serif text-lg font-bold group-hover:bg-zinc-800 transition">
              {brandName.charAt(0)}
            </div>
          )}
          <div className="space-y-0.5">
            <span className="text-xl sm:text-2xl font-black uppercase tracking-[0.2em] text-zinc-950 font-serif block leading-none">
              {brandName}
            </span>
            <span className="text-[9px] uppercase tracking-widest text-zinc-400 block font-mono">
              Haute Couture & Bespoke Tailoring
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-bold uppercase tracking-widest text-zinc-600">
          {navLinks.map((tab) => {
            const isActive = activePage === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleNavClick(tab.id)}
                className={`transition-colors cursor-pointer relative py-1 flex items-center gap-1.5 ${
                  isActive ? "text-zinc-950 font-black" : "hover:text-zinc-950 text-zinc-600"
                }`}
              >
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="px-1.5 py-0.2 rounded-full bg-rose-600 text-white text-[8.5px] font-black uppercase tracking-wider">
                    {tab.badge}
                  </span>
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-950 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Currency Selector */}
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="text-xs font-bold uppercase tracking-wider bg-transparent border-none text-zinc-800 focus:outline-none cursor-pointer py-1"
          >
            <option value="INR">INR (₹)</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
          </select>

          {/* Quick Collection Search shortcut */}
          <button
            type="button"
            onClick={() => handleNavClick("collections")}
            className="hidden sm:flex p-2.5 rounded-full hover:bg-zinc-100 text-zinc-700 transition cursor-pointer"
            title="Browse Collections"
          >
            <Search size={18} />
          </button>

          {/* Shopping Bag Button */}
          <button
            type="button"
            onClick={onOpenCart}
            className="p-2.5 rounded-full bg-zinc-100 hover:bg-zinc-200 transition cursor-pointer relative"
            title="Shopping Bag"
          >
            <ShoppingBag size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-zinc-900 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-scaleIn">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-zinc-900 hover:bg-zinc-100 transition cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-down Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-zinc-200 px-6 py-6 space-y-4 shadow-xl text-left animate-fadeIn">
          <div className="flex flex-col space-y-3">
            {navLinks.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleNavClick(tab.id)}
                className={`text-left text-sm font-bold uppercase tracking-wider py-2 transition flex items-center justify-between ${
                  activePage === tab.id ? "text-zinc-950 font-black border-l-2 border-zinc-950 pl-3" : "text-zinc-500 pl-3"
                }`}
              >
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[9px] font-black uppercase">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500 font-mono">
            <span>VIP Concierge: care@atelierurban.com</span>
          </div>
        </div>
      )}
    </header>
  );
}
