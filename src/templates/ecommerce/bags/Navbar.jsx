import React, { useState } from "react";
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  ShieldCheck,
  Leaf,
  Compass,
} from "lucide-react";

export default function Navbar({
  brandName = "KRAFT & CANVAS",
  activePage = "home",
  setActivePage = () => {},
  cartCount = 0,
  onOpenCart = () => {},
  searchQuery = "",
  setSearchQuery = () => {},
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery || "");

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (setSearchQuery) setSearchQuery(localSearch);
    if (activePage !== "catalog") setActivePage("catalog");
  };

  const navLinks = [
    { id: "home", label: "Home" },
    { id: "catalog", label: "All Bags" },
    { id: "backpacks", label: "Backpacks" },
    { id: "messenger", label: "Messenger & Crossbody" },
    { id: "offers", label: "Special Offers" },
  ];

  const handleNavClick = (id) => {
    if (id === "backpacks" || id === "messenger") {
      setActivePage("catalog");
      if (setSearchQuery) setSearchQuery(id === "backpacks" ? "Backpack" : "Messenger");
    } else {
      setActivePage(id);
    }
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Sustainability Announcement Bar */}
      <div className="bg-[#2C1810] text-[#E7DFD5] text-[11px] py-1.5 px-4 tracking-wider">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf size={12} className="text-emerald-400" />
            <span>100% Sustainable & Handcrafted With Tuscan Leather & Organic Cotton</span>
          </div>

          <div className="hidden md:flex items-center gap-4 text-slate-300 text-[10px]">
            <span>Free Domestic Shipping Over $50</span>
            <span>•</span>
            <span>Lifetime Craftsmanship Guarantee</span>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <button
          onClick={() => handleNavClick("home")}
          className="flex items-center gap-2 cursor-pointer text-left"
        >
          <div className="w-8 h-8 rounded-sm bg-[#A0522D] text-white flex items-center justify-center font-serif font-black text-sm">
            🎒
          </div>
          <div>
            <span className="text-lg font-serif font-bold text-slate-900 tracking-wider block">
              {brandName}
            </span>
            <span className="text-[9px] text-[#A0522D] uppercase tracking-widest font-semibold block">
              Sustainable Carry Goods
            </span>
          </div>
        </button>

        {/* Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden md:flex items-center flex-1 max-w-sm mx-6"
        >
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search Corin leather pack, canvas..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-sm bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-800"
            />
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </form>

        {/* Right Actions: Bag Trigger & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenCart}
            className="flex items-center gap-2 px-3.5 py-2 rounded-sm bg-[#A0522D] hover:bg-[#8B4513] text-white text-xs font-black uppercase tracking-wider transition cursor-pointer shadow-sm active:scale-98"
          >
            <ShoppingBag size={14} />
            <span className="hidden sm:inline">Cart</span>
            <span className="w-4 h-4 rounded-full bg-white text-[#A0522D] text-[10px] font-black flex items-center justify-center">
              {cartCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-700"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="border-t border-slate-100 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center gap-8 py-2.5 text-xs font-serif uppercase tracking-widest text-slate-600">
          {navLinks.map((link) => {
            const isActive = activePage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`transition cursor-pointer ${
                  isActive
                    ? "text-[#A0522D] font-bold border-b border-[#A0522D] pb-0.5"
                    : "hover:text-slate-900"
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white p-4 space-y-3 text-left">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search packs..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 rounded-sm bg-slate-50 border border-slate-200 text-xs"
            />
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          </form>

          <div className="space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className="w-full text-left py-2 px-3 text-xs font-serif uppercase tracking-wider text-slate-700 hover:bg-slate-50 block"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
