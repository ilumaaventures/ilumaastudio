import React, { useState } from "react";
import {
  ShoppingBag,
  Search,
  Heart,
  Menu,
  X,
  Truck,
  ShieldCheck,
  ChevronDown,
  Sparkles,
} from "lucide-react";

export default function Navbar({
  brandName = "KICKS VAULT",
  brandLogo = null,
  business = {},
  activePage = "home",
  setActivePage = () => {},
  cartCount = 0,
  onOpenCart = () => {},
  searchQuery = "",
  setSearchQuery = () => {},
  sizeStandard = "EU",
  setSizeStandard = () => {},
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
    { id: "catalog", label: "All Sneakers" },
    { id: "men", label: "Men's Shoes" },
    { id: "women", label: "Women's Shoes" },
    { id: "kids", label: "Kids" },
    { id: "offers", label: "Flash Deals", badge: "HOT" },
  ];

  const handleNavClick = (id) => {
    if (id === "men" || id === "women" || id === "kids") {
      setActivePage("catalog");
      if (setSearchQuery) setSearchQuery(id === "men" ? "Men" : id === "women" ? "Women" : "Children");
    } else {
      setActivePage(id);
    }
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Utility Announcement Bar */}
      <div className="bg-slate-900 text-white text-[11px] py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Truck size={13} className="text-blue-400" />
              <span>Free Shipping On Orders Over $50</span>
            </span>
            <span className="hidden md:inline text-slate-600">|</span>
            <span className="hidden md:flex items-center gap-1 text-slate-300">
              <ShieldCheck size={13} className="text-emerald-400" />
              <span>100% Authentic Guaranteed</span>
            </span>
          </div>

          {/* Size Standard Selector (EU / US / UK) */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold">SIZE CHART:</span>
            <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
              {["EU", "US", "UK"].map((std) => (
                <button
                  key={std}
                  type="button"
                  onClick={() => setSizeStandard && setSizeStandard(std)}
                  className={`px-2 py-0.5 rounded text-[10px] font-black transition cursor-pointer ${
                    sizeStandard === std
                      ? "bg-blue-600 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {std}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleNavClick("home")}
            className="flex items-center gap-2 cursor-pointer text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-[#1E3A8A] text-white flex items-center justify-center font-black text-base shadow-sm">
              👟
            </div>
            <div>
              <span className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-none block">
                {brandName}
              </span>
              <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest block">
                Authentic Sneaker Vault
              </span>
            </div>
          </button>
        </div>

        {/* Center Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden md:flex items-center flex-1 max-w-md mx-6"
        >
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search Air Jordan, Nike Dunk, Pegasus..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full pl-10 pr-24 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition"
            />
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 px-3 py-1 bg-[#1E3A8A] hover:bg-blue-800 text-white text-[11px] font-black uppercase tracking-wider rounded-lg transition cursor-pointer"
            >
              Search
            </button>
          </div>
        </form>

        {/* Right Navigation & Bag Trigger */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Bag Button */}
          <button
            type="button"
            onClick={onOpenCart}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#1E3A8A] text-white text-xs font-black hover:bg-blue-800 transition cursor-pointer shadow-sm active:scale-98"
          >
            <ShoppingBag size={15} />
            <span className="hidden sm:inline">Bag</span>
            <span className="w-5 h-5 rounded-full bg-white text-blue-900 text-[10px] font-black flex items-center justify-center">
              {cartCount}
            </span>
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-700 hover:text-black rounded-lg"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Navigation Links Bar */}
      <nav className="border-t border-slate-100 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-8 py-2.5 text-xs font-bold uppercase tracking-wider">
          {navLinks.map((link) => {
            const isActive = activePage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`transition cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? "text-blue-600 font-black border-b-2 border-blue-600 -mb-[11px] pb-[9px]"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="px-1.5 py-0.2 rounded text-[8px] bg-red-100 text-red-700 font-black">
                    {link.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3 text-left">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search sneakers..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full pl-9 pr-20 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600"
            />
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 px-3 py-1 bg-[#1E3A8A] text-white text-[10px] font-black uppercase rounded-lg"
            >
              Search
            </button>
          </form>

          <div className="space-y-1 pt-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`w-full text-left py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-between ${
                  activePage === link.id
                    ? "bg-blue-50 text-blue-700 font-black"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="px-1.5 py-0.2 rounded text-[8px] bg-red-100 text-red-700 font-black">
                    {link.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
