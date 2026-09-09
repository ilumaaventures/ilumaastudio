import React, { useState } from "react";
import {
  Heart,
  ShoppingBag,
  Search,
  User,
  Menu,
  X,
  Sparkles,
} from "lucide-react";

export default function Navbar({
  brandName = "ETHNIC & MODERN COUTURE",
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

  const categories = [
    { id: "all", label: "All Collections" },
    { id: "Jumpsuits", label: "Jumpsuits" },
    { id: "Dresses", label: "Dresses" },
    { id: "Modern Look", label: "Modern Look" },
    { id: "Women's PALAZZO", label: "Palazzo" },
    { id: "3/4 Sleeve Kurti's", label: "Kurtis" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-stone-200 font-sans">
      {/* Top Festive Announcement Strip */}
      <div className="bg-[#1C1917] text-white text-[10px] sm:text-[11px] py-1.5 px-4 tracking-wider text-center font-medium">
        <span>✨ FESTIVE OFFER: BUY 3 GET 1 COMPLIMENTARY ON ALL DRESSES & COUTURE • CODE: COUTURE15</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-6">
        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-1.5 text-stone-800"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Brand Crest */}
        <div
          onClick={onNavigateHome}
          className="flex items-center cursor-pointer select-none"
        >
          {brandLogo ? (
            <img
              src={brandLogo}
              alt={brandName}
              className="h-8 sm:h-9 w-auto object-contain"
            />
          ) : (
            <div className="text-left">
              <span className="text-sm sm:text-base font-serif font-black tracking-[0.2em] text-stone-900 uppercase block">
                {brandName}
              </span>
              <span className="text-[9px] uppercase tracking-widest text-[#16A34A] font-bold block -mt-0.5">
                Couture & Festive Edit
              </span>
            </div>
          )}
        </div>

        {/* Desktop Category Nav */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-stone-800">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory && onSelectCategory(cat.id)}
              className={`hover:text-[#16A34A] transition cursor-pointer pb-0.5 ${
                activeCategory.toLowerCase() === cat.id.toLowerCase()
                  ? "border-b-2 border-black font-bold text-black"
                  : ""
              }`}
            >
              {cat.label}
            </button>
          ))}
        </nav>

        {/* Action Icons: Search, Wishlist, Cart */}
        <div className="flex items-center gap-3 sm:gap-4 text-stone-800">
          <button
            type="button"
            onClick={() => setSearchOpen(!searchOpen)}
            className={`p-1.5 rounded-full hover:bg-stone-100 transition cursor-pointer ${
              searchOpen ? "text-[#16A34A]" : ""
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
            <Heart
              size={18}
              className={wishlistCount > 0 ? "fill-rose-500 text-rose-500" : ""}
            />
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
            title="Shopping Cart"
          >
            <ShoppingBag size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-black text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Expandable Search Drawer */}
      {searchOpen && (
        <div className="border-t border-stone-200 bg-[#FAF9F6] px-4 py-3 sm:px-6">
          <div className="max-w-2xl mx-auto flex items-center gap-3">
            <Search size={16} className="text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by product name, kurti, lehenga, dress, jumpsuit..."
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
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                if (onSelectCategory) onSelectCategory(cat.id);
                setMobileMenuOpen(false);
              }}
              className="w-full py-2 text-xs font-medium text-stone-800 text-left border-b border-stone-100 last:border-none"
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
