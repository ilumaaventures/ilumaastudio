import React, { useState } from "react";
import {
  BookOpen,
  Search,
  ShoppingBag,
  Sparkles,
  Award,
  Phone,
  Bookmark,
  Menu,
  X,
  Clock,
  Tag,
  Coffee,
} from "lucide-react";

export default function Navbar({
  brandName = "CHAPTER & VERSE",
  brandLogo = null,
  brandPhone = "+1 (800) 555-READ",
  activePage = "home",
  setActivePage,
  cartCount = 0,
  onOpenCart,
  searchQuery = "",
  setSearchQuery,
  onOpenReadingCalc,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: "home", label: "Front Stacks", icon: BookOpen },
    { id: "stacks", label: "Library Catalog", icon: Bookmark },
    { id: "book-club", label: "The Book Club", icon: Coffee },
    { id: "calculator", label: "Reading Speed Lab", icon: Clock },
    { id: "rare-vault", label: "Rare & Signed", icon: Award },
    { id: "offers", label: "Literary Bundles", icon: Tag },
  ];

  const handleNav = (id) => {
    setActivePage(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E7DFD5] shadow-[0_4px_25px_rgba(28,25,23,0.06)] font-serif">
      {/* Top Literary Salon Ribbon */}
      <div className="bg-[#1C1917] text-[#E7DFD5] text-[11px] py-2 px-4 tracking-wider">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#D97706] animate-pulse" />
            <span>
              <strong className="text-[#FBBF24] uppercase text-[10px] tracking-widest mr-1">
                Independent Press Notice:
              </strong>
              Complimentary hand-letterpressed linen bookmark & archival acid-free dust jacket on all Hardcover acquisitions.
            </span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-[11px] text-[#D5C7B8]">
            <span className="flex items-center gap-1.5">
              <Award size={13} className="text-[#D97706]" /> Signed First Editions Verified
            </span>
            <span className="flex items-center gap-1.5">
              <Bookmark size={13} className="text-[#D97706]" /> Member of Independent Booksellers Guild
            </span>
            <a
              href={`tel:${brandPhone}`}
              className="flex items-center gap-1 text-[#FBBF24] hover:text-white transition font-mono"
            >
              <Phone size={12} /> {brandPhone}
            </a>
          </div>
        </div>
      </div>

      {/* Main Classical Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Crest */}
        <div
          onClick={() => handleNav("home")}
          className="flex items-center gap-3.5 cursor-pointer group select-none flex-shrink-0"
        >
          {brandLogo ? (
            <img
              src={brandLogo}
              alt={brandName}
              className="h-10 w-auto max-w-[150px] object-contain"
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-[#1C1917] text-[#FAF7F2] flex items-center justify-center border border-[#78350F]/40 group-hover:bg-[#292524] transition shadow-md">
              <BookOpen size={20} className="text-[#D97706]" />
            </div>
          )}
          <div className="text-left">
            <span className="text-xl sm:text-2xl font-black tracking-widest text-[#1C1917] block leading-none">
              {brandName}
            </span>
            <span className="text-[9px] uppercase tracking-[0.3em] text-[#78350F] font-bold block pt-1">
              Independent Press & Curated Books
            </span>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1.5">
          {navLinks.map((tab) => {
            const isActive = activePage === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => handleNav(tab.id)}
                className={`relative px-3.5 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? "text-[#1C1917] bg-[#EFE9DF] border border-[#D5C7B8] shadow-sm font-black"
                    : "text-[#574B40] hover:text-[#1C1917] hover:bg-[#F3EDE3] border border-transparent"
                }`}
              >
                <Icon size={14} className={isActive ? "text-[#9A3412]" : "text-[#78350F]"} />
                <span>{tab.label}</span>
                {tab.id === "rare-vault" && (
                  <span className="bg-[#9A3412] text-white text-[9px] font-sans font-bold px-1.5 py-0.2 rounded-full uppercase">
                    Signed
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Actions: Search, Speed Calc & Cart */}
        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search title, author, translator..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activePage !== "stacks" && activePage !== "home") {
                  setActivePage("stacks");
                }
              }}
              className="w-44 lg:w-56 bg-white text-xs text-[#1C1917] placeholder-[#8C7A6B] pl-9 pr-3 py-2 rounded-xl border border-[#D8CCBD] focus:border-[#9A3412] focus:w-64 focus:outline-none transition-all duration-300 shadow-inner font-sans"
            />
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#78350F]" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#78350F] hover:text-[#1C1917]"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Reading Speed Calc Shortcut */}
          <button
            onClick={onOpenReadingCalc || (() => handleNav("calculator"))}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#F0EAE1] hover:bg-[#E7DFD5] text-[#1C1917] border border-[#D5C7B8] text-xs font-bold transition cursor-pointer"
          >
            <Clock size={14} className="text-[#9A3412]" />
            <span>Reading Lab</span>
          </button>

          {/* Bookshelf Cart Trigger */}
          <button
            onClick={onOpenCart}
            className="relative px-3.5 sm:px-4 py-2 rounded-xl bg-[#1C1917] hover:bg-[#292524] text-[#FAF7F2] transition cursor-pointer flex items-center gap-2 font-bold text-xs shadow-md border border-[#78350F]/30 active:scale-95"
          >
            <ShoppingBag size={16} className="text-[#D97706]" />
            <span className="hidden sm:inline">Book Bag</span>
            <span className="bg-[#D97706] text-white text-[11px] font-sans font-black min-w-[20px] h-5 px-1 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-[#EFE9DF] text-[#1C1917] border border-[#D5C7B8] cursor-pointer"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E7DFD5] bg-[#FAF7F2] px-4 py-4 space-y-2 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-2 gap-2 pb-3">
            {navLinks.map((tab) => {
              const isActive = activePage === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleNav(tab.id)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition cursor-pointer text-left ${
                    isActive
                      ? "text-[#1C1917] bg-[#EFE9DF] border border-[#9A3412]"
                      : "text-[#574B40] hover:bg-[#F3EDE3] border border-[#E7DFD5]"
                  }`}
                >
                  <Icon size={16} className={isActive ? "text-[#9A3412]" : "text-[#78350F]"} />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-[#E7DFD5] flex items-center justify-between text-xs text-[#574B40]">
            <span className="italic">Printed on Archival Paper</span>
            <a href={`tel:${brandPhone}`} className="text-[#1C1917] font-mono">
              {brandPhone}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
