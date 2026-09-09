import React, { useState } from "react";
import {
  Search,
  ShoppingBag,
  Heart,
  Menu,
  X,
  Sparkles,
  Phone,
  ShieldCheck,
  Droplets,
} from "lucide-react";

export default function Navbar({
  brandName = "GLOW BOTANICALS & BEAUTY",
  brandLogo = null,
  brandPhone = "+1 (800) 456-GLOW",
  activePage = "home",
  setActivePage,
  cartCount = 0,
  onOpenCart,
  searchQuery = "",
  setSearchQuery,
  onSelectCategory,
  onScrollToBenefits,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: "home", label: "Home" },
    { id: "catalog", label: "All Products" },
    { id: "Toners & Essences", label: "Toners" },
    { id: "Serums & Elixirs", label: "Serums" },
    { id: "Lipstick & Makeup", label: "Lipsticks" },
    { id: "Body Care", label: "Body Care" },
    { id: "benefits", label: "Benefits of Glow" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 transition-all">
      {/* Top Announcement Bar */}
      <div className="bg-[#8F9E68] text-white text-[11px] py-2 px-4 text-center">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-medium tracking-wide mx-auto md:mx-0">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shrink-0" />
            <span>
              🌸 <strong>100% Vegan & Cruelty-Free</strong> • Free Deluxe Minis with Every $50 Order
            </span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-[11px] text-white/90">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={13} /> Dermatologist Approved
            </span>
            <a
              href={`tel:${brandPhone}`}
              className="hover:text-white transition flex items-center gap-1.5"
            >
              <Phone size={12} /> {brandPhone}
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
          className="flex items-center gap-2.5 cursor-pointer group shrink-0"
        >
          {brandLogo ? (
            <img
              src={brandLogo}
              alt={brandName}
              className="h-10 w-auto object-contain"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#8F9E68] text-white flex items-center justify-center font-serif text-lg font-bold shadow-xs">
              G
            </div>
          )}
          <div className="text-left">
            <span className="text-lg sm:text-xl font-bold tracking-tight text-stone-900 block font-serif leading-none">
              GLOW.
            </span>
            <span className="text-[10px] tracking-[0.25em] text-[#8F9E68] uppercase font-semibold block mt-0.5">
              Botanicals & Beauty
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-xs font-semibold text-stone-700 tracking-wider">
          {navLinks.map((item) => {
            const isHome = item.id === "home" && activePage === "home";
            const isCatalog = item.id === "catalog" && activePage === "catalog";

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (item.id === "home") {
                    setActivePage("home");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  } else if (item.id === "catalog") {
                    onSelectCategory?.("all");
                    setActivePage("catalog");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  } else if (item.id === "benefits") {
                    onScrollToBenefits?.();
                  } else {
                    onSelectCategory?.(item.id);
                    setActivePage("catalog");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
                className={`py-2 transition duration-200 cursor-pointer relative hover:text-[#8F9E68] ${
                  isHome || isCatalog ? "text-[#8F9E68] font-bold" : ""
                }`}
              >
                <span>{item.label}</span>
                {(isHome || isCatalog) && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8F9E68] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Search & Actions */}
        <div className="flex items-center gap-3">
          {/* Search Box */}
          <div className="hidden sm:flex items-center bg-[#FAF9F7] rounded-full px-3.5 py-1.5 border border-stone-200 focus-within:border-[#8F9E68] transition w-44 md:w-52">
            <Search size={14} className="text-stone-400 mr-2 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activePage !== "catalog") setActivePage("catalog");
              }}
              placeholder="Search products..."
              className="bg-transparent text-xs text-stone-800 focus:outline-none w-full placeholder:text-stone-400"
            />
          </div>

          {/* Cart Bag Button */}
          <button
            type="button"
            onClick={onOpenCart}
            className="px-4 py-2 rounded-full bg-stone-900 hover:bg-[#8F9E68] text-white transition-colors duration-200 cursor-pointer flex items-center gap-2 font-medium text-xs shadow-xs"
          >
            <ShoppingBag size={15} />
            <span className="hidden sm:inline">Bag</span>
            <span className="bg-[#8F9E68] text-white text-[11px] font-bold min-w-[18px] h-4.5 px-1 rounded-full flex items-center justify-center">
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

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-stone-200 px-4 py-4 space-y-3 shadow-lg">
          <div className="flex items-center bg-[#FAF9F7] rounded-full px-3.5 py-2 border border-stone-200">
            <Search size={15} className="text-stone-400 mr-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activePage !== "catalog") setActivePage("catalog");
              }}
              placeholder="Search products..."
              className="bg-transparent text-xs text-stone-800 focus:outline-none w-full"
            />
          </div>

          <nav className="flex flex-col space-y-1 text-left">
            {navLinks.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (item.id === "home") {
                    setActivePage("home");
                  } else if (item.id === "catalog") {
                    onSelectCategory?.("all");
                    setActivePage("catalog");
                  } else if (item.id === "benefits") {
                    onScrollToBenefits?.();
                  } else {
                    onSelectCategory?.(item.id);
                    setActivePage("catalog");
                  }
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="py-2 px-3 text-stone-800 hover:bg-stone-50 hover:text-[#8F9E68] rounded-md text-xs font-semibold text-left transition"
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
