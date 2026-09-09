import React, { useState } from "react";
import { ShoppingBag, Search, Menu, X, ShieldCheck, Phone, Heart } from "lucide-react";

export default function Navbar({
  business = {},
  cartCount = 0,
  onOpenCart,
  activePage = "home",
  onNavigate,
  searchQuery = "",
  onSearchChange,
  categories = [],
  onSelectCategory,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const brandName = business?.businessName || business?.name || "CasaLiving Interiors";
  const brandPhone = business?.phone || "+1 (800) 888-CASA";

  const navLinks = [
    { id: "home", label: "Home" },
    { id: "catalog", label: "All Furniture" },
    { id: "Living Room", label: "Living Room" },
    { id: "Bedroom", label: "Bedroom" },
    { id: "Dining Room", label: "Dining Room" },
    { id: "Home Storage", label: "Storage" },
    { id: "Office Furniture", label: "Office" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 transition-all">
      {/* Top Announcement Bar */}
      <div className="bg-[#2C2523] text-stone-300 text-[11px] sm:text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-medium tracking-wide mx-auto md:mx-0">
            <span className="w-2 h-2 rounded-full bg-[#A07855] animate-pulse shrink-0" />
            <span>
              ✨ <strong>White Glove In-Home Delivery</strong> & Complimentary Room Placement Available
            </span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-[11px] text-stone-300">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-[#A07855]" /> 10-Year Hardwood Warranty
            </span>
            <a
              href={`tel:${brandPhone}`}
              className="hover:text-white transition flex items-center gap-1.5"
            >
              <Phone size={12} className="text-[#A07855]" /> {brandPhone}
            </a>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand */}
        <div
          onClick={() => onNavigate?.("home")}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          {business?.logo ? (
            <img
              src={business.logo}
              alt={brandName}
              className="h-10 w-auto object-contain rounded-lg"
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-[#2C2523] text-white flex items-center justify-center font-serif text-lg font-bold shadow-sm group-hover:bg-[#A07855] transition duration-300">
              C
            </div>
          )}
          <div className="text-left">
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 block leading-tight font-serif">
              {brandName}
            </span>
            <span className="text-[10px] tracking-widest text-[#A07855] uppercase font-semibold block">
              Architectural Living & Decor
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-xs font-semibold text-stone-700">
          {/* {navLinks.map((link) => {
            const isHome = link.id === "home" && activePage === "home";
            const isCatalog = link.id === "catalog" && activePage === "catalog";
            const isCatActive = activePage === "catalog" && link.id !== "home" && link.id !== "catalog";

            return (
              <button
                key={link.id}
                type="button"
                onClick={() => {
                  if (link.id === "home") {
                    onNavigate?.("home");
                  } else if (link.id === "catalog") {
                    onNavigate?.("catalog");
                    onSelectCategory?.("all");
                  } else {
                    onNavigate?.("catalog");
                    onSelectCategory?.(link.id);
                  }
                }}
                className={`py-2 transition duration-200 cursor-pointer relative hover:text-[#A07855] ${
                  isHome || isCatalog ? "text-[#A07855] font-bold" : ""
                }`}
              >
                <span>{link.label}</span>
                {(isHome || isCatalog) && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#A07855] rounded-full" />
                )}
              </button>
            );
          })} */}
        </nav>

        {/* Search & Actions */}
        <div className="flex items-center gap-3">
          {/* Search Box */}
          <div className="hidden sm:flex items-center bg-[#F7F5F2] rounded-full px-3.5 py-2 border border-stone-200/80 focus-within:border-[#A07855] transition w-44 md:w-56">
            <Search size={15} className="text-stone-400 mr-2 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder="Search furniture..."
              className="bg-transparent text-xs text-stone-800 focus:outline-none w-full placeholder:text-stone-400"
            />
          </div>

          {/* Cart Bag Button */}
          <button
            type="button"
            onClick={onOpenCart}
            className="px-4 py-2.5 rounded-full bg-[#2C2523] hover:bg-[#A07855] text-white transition-colors duration-200 cursor-pointer flex items-center gap-2 font-medium text-xs shadow-sm"
          >
            <ShoppingBag size={16} />
            <span className="hidden sm:inline">Cart</span>
            <span className="bg-[#A07855] text-white text-[11px] font-bold min-w-[20px] h-5 px-1.5 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-stone-700 hover:bg-stone-100 transition cursor-pointer"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-stone-200 px-4 py-5 space-y-4 shadow-lg">
          <div className="flex items-center bg-[#F7F5F2] rounded-full px-3.5 py-2 border border-stone-200">
            <Search size={15} className="text-stone-400 mr-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder="Search furniture..."
              className="bg-transparent text-xs text-stone-800 focus:outline-none w-full"
            />
          </div>

          <nav className="flex flex-col space-y-2 text-left">
            {navLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (link.id === "home") {
                    onNavigate?.("home");
                  } else if (link.id === "catalog") {
                    onNavigate?.("catalog");
                    onSelectCategory?.("all");
                  } else {
                    onNavigate?.("catalog");
                    onSelectCategory?.(link.id);
                  }
                }}
                className="py-2 px-3 text-stone-800 hover:bg-stone-50 hover:text-[#A07855] rounded-lg text-sm font-medium transition text-left cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
