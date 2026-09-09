import React, { useState } from "react";
import {
  Heart,
  ShoppingBag,
  Search,
  User,
  Menu,
  X,
} from "lucide-react";

export default function Navbar({
  brandName = "STUDIO APPAREL",
  brandLogo = null,
  activeCategory = "all",
  onSelectCategory,
  cartCount = 0,
  wishlistCount = 0,
  onOpenCart,
  onOpenWishlist,
  searchQuery = "",
  setSearchQuery,
  onNavigateHome,
}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const mainLinks = [
    { id: "wishlist", label: "Wishlist", isSpecial: true },
    { id: "Jackets", label: "Jackets" },
    { id: "Shirt", label: "Shirt" },
    { id: "Fragrance", label: "Fragrance" },
  ];

  const handleLinkClick = (id) => {
    if (id === "wishlist") {
      if (onOpenWishlist) onOpenWishlist();
    } else {
      if (onSelectCategory) onSelectCategory(id);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#EBE7E1] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-6">
        {/* ================= LEFT: TOP NAVIGATION LINKS ================= */}
        <nav className="hidden md:flex items-center gap-6 text-xs sm:text-[13px] font-medium text-stone-800">
          <button
            type="button"
            onClick={onOpenWishlist}
            className="flex items-center gap-1.5 hover:text-[#8B5A2B] transition cursor-pointer"
          >
            <span>Wishlist</span>
            {wishlistCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-rose-50 text-rose-600 border border-rose-200 text-[10px] font-bold">
                {wishlistCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => onSelectCategory && onSelectCategory("Jackets")}
            className={`hover:text-[#8B5A2B] transition cursor-pointer ${
              activeCategory === "Jackets" ? "text-[#8B5A2B] font-bold" : ""
            }`}
          >
            Jackets
          </button>

          <button
            type="button"
            onClick={() => onSelectCategory && onSelectCategory("Shirt")}
            className={`hover:text-[#8B5A2B] transition cursor-pointer ${
              activeCategory === "Shirt" ? "text-[#8B5A2B] font-bold" : ""
            }`}
          >
            Shirt
          </button>

          <button
            type="button"
            onClick={() => onSelectCategory && onSelectCategory("Fragrance")}
            className={`hover:text-[#8B5A2B] transition cursor-pointer ${
              activeCategory === "Fragrance" ? "text-[#8B5A2B] font-bold" : ""
            }`}
          >
            Fragrance
          </button>
        </nav>

        {/* Mobile Hamburger Toggle */}
        <div className="md:hidden flex items-center">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-stone-700 hover:text-black"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* ================= CENTER: BRAND CREST ================= */}
        <div
          onClick={onNavigateHome}
          className="flex items-center justify-center cursor-pointer select-none"
        >
          {brandLogo ? (
            <img
              src={brandLogo}
              alt={brandName}
              className="h-8 sm:h-9 w-auto object-contain"
            />
          ) : (
            <span className="text-base sm:text-lg font-serif font-black tracking-[0.2em] text-[#292524] uppercase">
              {brandName}
            </span>
          )}
        </div>

        {/* ================= RIGHT: SEARCH, ACCOUNT, CART ================= */}
        <div className="flex items-center gap-3 sm:gap-5 text-stone-800">
          <button
            type="button"
            onClick={() => setSearchOpen(!searchOpen)}
            className={`p-1.5 rounded-full hover:bg-stone-100 transition cursor-pointer ${
              searchOpen ? "text-[#8B5A2B]" : ""
            }`}
            title="Search"
          >
            <Search size={18} />
          </button>

          <button
            type="button"
            onClick={onOpenWishlist}
            className="relative p-1.5 rounded-full hover:bg-stone-100 transition cursor-pointer"
            title="Wishlist"
          >
            <Heart size={18} className={wishlistCount > 0 ? "fill-rose-500 text-rose-500" : ""} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                {wishlistCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={onOpenCart}
            className="relative p-1.5 rounded-full hover:bg-stone-100 transition cursor-pointer"
            title="Shopping Bag"
          >
            <ShoppingBag size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#8B5A2B] text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Expandable Search Drawer */}
      {searchOpen && (
        <div className="border-t border-stone-200 bg-[#FAF8F5] px-4 py-3 sm:px-6">
          <div className="max-w-2xl mx-auto flex items-center gap-3">
            <Search size={16} className="text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search jackets, shirts, sweaters, fragrances..."
              className="flex-1 bg-transparent text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-none py-1"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-stone-400 hover:text-stone-600 p-1"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-5 py-4 space-y-3 text-left">
          <button
            onClick={() => handleLinkClick("wishlist")}
            className="w-full py-2 text-xs font-semibold text-stone-800 flex items-center justify-between"
          >
            <span>Wishlist</span>
            {wishlistCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 text-xs font-bold">
                {wishlistCount} items
              </span>
            )}
          </button>
          <button
            onClick={() => handleLinkClick("Jackets")}
            className="w-full py-2 text-xs font-medium text-stone-700 text-left"
          >
            Jackets
          </button>
          <button
            onClick={() => handleLinkClick("Shirt")}
            className="w-full py-2 text-xs font-medium text-stone-700 text-left"
          >
            Shirt
          </button>
          <button
            onClick={() => handleLinkClick("Fragrance")}
            className="w-full py-2 text-xs font-medium text-stone-700 text-left"
          >
            Fragrance
          </button>
        </div>
      )}
    </header>
  );
}
