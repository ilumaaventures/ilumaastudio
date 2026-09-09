import React, { useState } from "react";
import {
  Search,
  ShoppingBag,
  Heart,
  Menu,
  X,
  ShieldCheck,
  Phone,
  Sparkles,
} from "lucide-react";

export default function Navbar({
  brandName = "LUXE & CO. HAUTE JOAILLERIE",
  brandLogo = null,
  brandPhone = "+1 (800) 777-LUXE",
  activePage = "home",
  setActivePage,
  cartCount = 0,
  onOpenCart,
  searchQuery = "",
  setSearchQuery,
  onSelectCategory,
  onOpenShowroom,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navCategories = [
    { id: "home", label: "Home" },
    { id: "all", label: "All Jewelry" },
    { id: "Bracelets", label: "Bracelets" },
    { id: "Earrings", label: "Earrings" },
    { id: "Gold Set", label: "Gold Set" },
    { id: "Necklaces", label: "Necklaces" },
    { id: "Rings", label: "Rings" },
    { id: "showroom", label: "Our Showroom" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 transition-all">
      {/* Top Luxury Announcement Ribbon */}
      <div className="bg-stone-900 text-stone-300 text-[11px] py-2 px-4 text-center">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-medium tracking-wide mx-auto md:mx-0">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
            <span>
              ✨ <strong>Complimentary Insured Armored Delivery</strong> Worldwide • 100% Conflict-Free Diamonds
            </span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-[11px] text-stone-300">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-amber-400" /> GIA & Kimberley Certified
            </span>
            <a
              href={`tel:${brandPhone}`}
              className="hover:text-white transition flex items-center gap-1.5"
            >
              <Phone size={12} className="text-amber-400" /> {brandPhone}
            </a>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand */}
        <div
          onClick={() => {
            setActivePage("home");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          {brandLogo ? (
            <img
              src={brandLogo}
              alt={brandName}
              className="h-10 w-auto object-contain"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-stone-900 text-white flex items-center justify-center font-serif text-lg font-bold shadow-xs group-hover:bg-[#AA771C] transition duration-300">
              L
            </div>
          )}
          <div className="text-left">
            <span className="text-lg sm:text-xl font-bold tracking-tight text-stone-900 block font-serif leading-none">
              {brandName}
            </span>
            <span className="text-[10px] tracking-[0.25em] text-[#AA771C] uppercase font-semibold block mt-0.5">
              Handmade Fine Jewelry
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-xs font-semibold text-stone-700 uppercase tracking-wider">
          {navCategories.map((item) => {
            const isHome = item.id === "home" && activePage === "home";
            const isCatalog = item.id === "all" && activePage === "catalog";

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (item.id === "home") {
                    setActivePage("home");
                  } else if (item.id === "showroom") {
                    onOpenShowroom?.();
                  } else {
                    onSelectCategory?.(item.id);
                    setActivePage("catalog");
                  }
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`py-2 transition duration-200 cursor-pointer relative hover:text-[#AA771C] ${
                  isHome || isCatalog ? "text-[#AA771C] font-bold" : ""
                }`}
              >
                <span>{item.label}</span>
                {(isHome || isCatalog) && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#AA771C] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Search & Actions */}
        <div className="flex items-center gap-3">
          {/* Search Box */}
          <div className="hidden sm:flex items-center bg-[#FAF9F8] rounded-full px-3.5 py-1.5 border border-stone-200 focus-within:border-[#AA771C] transition w-44 md:w-52">
            <Search size={14} className="text-stone-400 mr-2 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activePage !== "catalog") setActivePage("catalog");
              }}
              placeholder="Search jewels..."
              className="bg-transparent text-xs text-stone-800 focus:outline-none w-full placeholder:text-stone-400"
            />
          </div>

          {/* Cart Bag Button */}
          <button
            type="button"
            onClick={onOpenCart}
            className="px-4 py-2 rounded-full bg-stone-900 hover:bg-[#AA771C] text-white transition-colors duration-200 cursor-pointer flex items-center gap-2 font-medium text-xs shadow-xs"
          >
            <ShoppingBag size={15} />
            <span className="hidden sm:inline">Bag</span>
            <span className="bg-[#AA771C] text-white text-[11px] font-bold min-w-[18px] h-4.5 px-1 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-stone-700 hover:bg-stone-100 transition cursor-pointer"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-stone-200 px-4 py-4 space-y-3 shadow-lg">
          <div className="flex items-center bg-[#FAF9F8] rounded-full px-3.5 py-2 border border-stone-200">
            <Search size={15} className="text-stone-400 mr-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activePage !== "catalog") setActivePage("catalog");
              }}
              placeholder="Search jewels..."
              className="bg-transparent text-xs text-stone-800 focus:outline-none w-full"
            />
          </div>

          <nav className="flex flex-col space-y-1 text-left">
            {navCategories.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (item.id === "home") {
                    setActivePage("home");
                  } else if (item.id === "showroom") {
                    onOpenShowroom?.();
                  } else {
                    onSelectCategory?.(item.id);
                    setActivePage("catalog");
                  }
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="py-2 px-3 text-stone-800 hover:bg-stone-50 hover:text-[#AA771C] rounded-md text-xs font-semibold uppercase tracking-wider text-left transition"
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
