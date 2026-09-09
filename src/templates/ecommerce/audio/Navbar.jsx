import React, { useState } from "react";
import {
  Search,
  Heart,
  ShoppingBag,
  Menu,
  X,
  Radio,
  SlidersHorizontal,
} from "lucide-react";

export default function Navbar({
  brandName = "APEX ACOUSTICS",
  brandLogo = null,
  cartCount = 0,
  wishlistCount = 0,
  onOpenCart = () => {},
  onOpenWishlist = () => {},
  onNavigateHome = () => {},
  onSelectCategory = () => {},
  activeCategory = "all",
  searchQuery = "",
  setSearchQuery = () => {},
  categories = [],
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const navLinks = [
    { label: "HEADPHONES", id: "headphones" },
    { label: "EARPHONES", id: "earphones" },
    { label: "SPEAKERS", id: "speaker" },
    { label: "ACCESSORIES", id: "accessories" },
    { label: "STORIES", id: "stories" },
  ];

  const handleNavClick = (linkId) => {
    if (linkId === "stories") {
      const el = document.getElementById("audio-reviews-section");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      onSelectCategory(linkId);
      const el = document.getElementById(`section-${linkId}`);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#E5E5E5] text-[#121212] transition-all">
      {/* Top Notification Announcement Bar */}
      <div className="w-full bg-[#121212] text-[#F9F9F9] py-1.5 px-4 text-center text-[11px] uppercase tracking-[0.2em] font-medium flex items-center justify-center gap-3">
        <span>COMPLIMENTARY EXPRESS WORLDWIDE SHIPPING ON ALL SOUND TOOLS</span>
        <span className="hidden sm:inline text-neutral-500">•</span>
        <span className="hidden sm:inline text-neutral-300">2-YEAR GLOBAL WARRANTY</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Name */}
          <div
            onClick={onNavigateHome}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            {brandLogo ? (
              <img
                src={brandLogo}
                alt={brandName}
                className="h-8 w-auto object-contain"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-[#121212] flex items-center justify-center text-white group-hover:bg-neutral-800 transition-colors shadow-sm">
                <Radio className="w-4 h-4 text-white" />
              </div>
            )}
            <span
              className="text-lg sm:text-xl font-bold tracking-[0.25em] text-[#121212] uppercase"
              style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}
            >
              {brandName}
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-9">
            {navLinks.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-xs uppercase tracking-[0.2em] font-semibold py-2 transition-colors relative ${
                  activeCategory === item.id
                    ? "text-[#121212] font-bold after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#121212]"
                    : "text-neutral-500 hover:text-[#121212]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center space-x-5">
            {/* Search Toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search"
              className="text-neutral-700 hover:text-black p-1.5 transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Button */}
            <button
              onClick={onOpenWishlist}
              aria-label="Wishlist"
              className="relative text-neutral-700 hover:text-black p-1.5 transition-colors"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Shopping Bag Button */}
            <button
              onClick={onOpenCart}
              aria-label="Cart"
              className="relative text-neutral-700 hover:text-black p-1.5 transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#121212] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-neutral-800 p-1.5"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Collapsible Search Input */}
        {searchOpen && (
          <div className="pb-4 pt-1 animate-fadeIn">
            <div className="relative max-w-xl mx-auto">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search models, Beryllium drivers, ANC, wireless..."
                autoFocus
                className="w-full bg-[#F5F5F5] border border-neutral-300 text-neutral-900 placeholder-neutral-400 text-xs tracking-wider rounded-none pl-11 pr-10 py-3 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
              />
              <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-3.5" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-3 text-neutral-400 hover:text-black"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-neutral-200 px-6 py-6 space-y-4 animate-fadeIn">
          {navLinks.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                handleNavClick(item.id);
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 text-sm font-semibold uppercase tracking-[0.2em] text-neutral-800 hover:text-black border-b border-neutral-100"
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2">
            <button
              onClick={() => {
                onSelectCategory("all");
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 text-xs uppercase tracking-widest text-neutral-500 hover:text-black"
            >
              View All Sound Tools
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
