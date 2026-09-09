import React, { useState } from "react";
import {
  Search,
  Heart,
  User,
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
  Coffee,
} from "lucide-react";

export default function Navbar({
  brandName = "Crux Coffee Roasters",
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
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const navLinks = [
    { label: "Home", id: "home", action: () => onNavigateHome() },
    {
      label: "Shop",
      id: "shop",
      hasDropdown: true,
      action: () => setShopDropdownOpen(!shopDropdownOpen),
    },
    {
      label: "Our Story",
      id: "story",
      action: () => {
        const el = document.getElementById("crux-mission-section");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      },
    },
    {
      label: "Terms & Conditions",
      id: "terms",
      action: () => {
        const el = document.getElementById("crux-footer");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      },
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#2E1B13] text-[#FAF7F2] shadow-md transition-all duration-300">
      {/* Main Bar */}
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
                className="h-10 w-auto object-contain"
              />
            ) : (
              <div className="w-10 h-10 rounded-full border-2 border-[#FAF7F2]/80 flex items-center justify-center bg-[#1E110C] group-hover:border-amber-300 transition-colors">
                <Coffee className="w-5 h-5 text-amber-200" />
              </div>
            )}
            <span
              className="text-xl sm:text-2xl font-serif tracking-wide text-[#FAF7F2] group-hover:text-amber-200 transition-colors"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {brandName}
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((item) => (
              <div key={item.id} className="relative">
                <button
                  onClick={item.action}
                  onMouseEnter={() =>
                    item.hasDropdown && setShopDropdownOpen(true)
                  }
                  className={`flex items-center gap-1.5 text-sm tracking-wider uppercase font-medium py-2 transition-colors duration-200 ${
                    item.id === "home"
                      ? "text-white border-b-2 border-white pb-1"
                      : "text-[#D6CBC1] hover:text-white"
                  }`}
                >
                  <span>{item.label}</span>
                  {item.hasDropdown && (
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        shopDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </button>

                {/* Shop Dropdown */}
                {item.hasDropdown && shopDropdownOpen && (
                  <div
                    onMouseLeave={() => setShopDropdownOpen(false)}
                    className="absolute top-full left-0 mt-2 w-64 bg-[#25150E] border border-[#4A2E1B] rounded-lg shadow-2xl py-3 z-50 animate-fadeIn"
                  >
                    <button
                      onClick={() => {
                        onSelectCategory("all");
                        setShopDropdownOpen(false);
                      }}
                      className={`w-full text-left px-5 py-2.5 text-sm transition-colors ${
                        activeCategory === "all"
                          ? "bg-[#3A2318] text-amber-300 font-semibold"
                          : "text-[#D6CBC1] hover:bg-[#3A2318] hover:text-white"
                      }`}
                    >
                      All Collections
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.id || cat.slug}
                        onClick={() => {
                          onSelectCategory(cat.slug || cat.id);
                          setShopDropdownOpen(false);
                        }}
                        className={`w-full text-left px-5 py-2.5 text-sm transition-colors ${
                          activeCategory === (cat.slug || cat.id)
                            ? "bg-[#3A2318] text-amber-300 font-semibold"
                            : "text-[#D6CBC1] hover:bg-[#3A2318] hover:text-white"
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center space-x-5">
            {/* Search Button */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search"
              className="text-[#D6CBC1] hover:text-white transition-colors p-1.5 rounded-full hover:bg-[#3A2318]"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Button */}
            <button
              onClick={onOpenWishlist}
              aria-label="Wishlist"
              className="relative text-[#D6CBC1] hover:text-white transition-colors p-1.5 rounded-full hover:bg-[#3A2318]"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* User Account / Profile */}
            <button
              onClick={() => {}}
              aria-label="Account"
              className="hidden sm:flex text-[#D6CBC1] hover:text-white transition-colors p-1.5 rounded-full hover:bg-[#3A2318]"
            >
              <User className="w-5 h-5" />
            </button>

            {/* Cart Bag */}
            <button
              onClick={onOpenCart}
              aria-label="Cart"
              className="relative text-[#D6CBC1] hover:text-white transition-colors p-1.5 rounded-full hover:bg-[#3A2318]"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#16A34A] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-[#D6CBC1] hover:text-white p-1.5"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Search Collapsible Bar */}
        {searchOpen && (
          <div className="pb-4 pt-1 animate-fadeIn">
            <div className="relative max-w-xl mx-auto">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search coffee beans, instant blends, brewing gear..."
                autoFocus
                className="w-full bg-[#1E110C] border border-[#4A2E1B] text-[#FAF7F2] placeholder-[#A09388] text-sm rounded-full pl-12 pr-10 py-2.5 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 shadow-inner"
              />
              <Search className="w-4 h-4 text-[#A09388] absolute left-4 top-3.5" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-3 text-[#A09388] hover:text-white"
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
        <div className="md:hidden bg-[#25150E] border-t border-[#3A2318] px-6 py-6 space-y-4 animate-fadeIn">
          <button
            onClick={() => {
              onNavigateHome();
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-base font-medium text-white border-b border-[#3A2318]"
          >
            Home
          </button>
          <div className="py-2 border-b border-[#3A2318]">
            <p className="text-xs uppercase tracking-wider text-amber-300/80 mb-2 font-semibold">
              Collections & Categories
            </p>
            <div className="space-y-2 pl-2">
              <button
                onClick={() => {
                  onSelectCategory("all");
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left text-sm ${
                  activeCategory === "all" ? "text-amber-300 font-semibold" : "text-[#D6CBC1]"
                }`}
              >
                All Collections
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id || cat.slug}
                  onClick={() => {
                    onSelectCategory(cat.slug || cat.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left text-sm ${
                    activeCategory === (cat.slug || cat.id)
                      ? "text-amber-300 font-semibold"
                      : "text-[#D6CBC1]"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => {
              const el = document.getElementById("crux-mission-section");
              if (el) el.scrollIntoView({ behavior: "smooth" });
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-base font-medium text-[#D6CBC1] hover:text-white border-b border-[#3A2318]"
          >
            Our Story
          </button>
          <button
            onClick={() => {
              const el = document.getElementById("crux-footer");
              if (el) el.scrollIntoView({ behavior: "smooth" });
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-base font-medium text-[#D6CBC1] hover:text-white"
          >
            Terms & Conditions
          </button>
        </div>
      )}
    </header>
  );
}
