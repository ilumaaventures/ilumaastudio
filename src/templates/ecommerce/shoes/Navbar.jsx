import React, { useState } from "react";
import {
  ShoppingBag,
  Search,
  Zap,
  Flame,
  Clock,
  Sparkles,
  Menu,
  X,
  Sliders,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";

export default function Navbar({
  brandName = "SOLECRAFT",
  brandLogo = null,
  business = {},
  activePage = "home",
  setActivePage = () => {},
  cartCount = 0,
  onOpenCart = () => {},
  searchQuery = "",
  setSearchQuery = () => {},
  sizeStandard = "US",
  setSizeStandard = () => {},
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const navLinks = [
    { id: "home", label: "Drop Home", badge: "Live" },
    { id: "sneaker-vault", label: "Sneaker Vault", badge: null },
    { id: "drops-calendar", label: "Drops Calendar", badge: "Next: 4h" },
    { id: "sole-tech", label: "Carbon Tech", badge: null },
    { id: "authenticity-guarantee", label: "RFID Auth", badge: "100%" },
    { id: "offers", label: "Drop Packs", badge: "Save 25%" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#09090B]/95 backdrop-blur-xl border-b border-zinc-800/80">
      {/* High-Velocity Kinetic Top Ticker */}
      <div className="bg-gradient-to-r from-lime-500 via-emerald-400 to-lime-400 text-black py-1.5 px-4 overflow-hidden relative shadow-inner">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] font-mono font-black uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-black animate-ping" />
            <span className="flex items-center gap-1">
              <Flame size={13} className="fill-black" />
              <span>LIVE DROP: HYPERGHOST CARBON EDITION // 142 PAIRS LEFT</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-[10px]">
            <span className="flex items-center gap-1 font-bold">
              <ShieldCheck size={13} />
              100% RFID DEADSTOCK VERIFIED
            </span>
            <span>•</span>
            <span>FREE CARBON-NEUTRAL EXPRESS RUNNER SHIPPING OVER ₹4,999</span>
          </div>

          {/* Size Standard Selector */}
          <div className="flex items-center gap-1 bg-black/20 px-2 py-0.5 rounded text-[10px]">
            <span className="opacity-75">SIZE:</span>
            {["US", "UK", "EU"].map((std) => (
              <button
                key={std}
                onClick={() => setSizeStandard && setSizeStandard(std)}
                className={`px-1.5 py-0.2 rounded font-black transition cursor-pointer ${
                  sizeStandard === std ? "bg-black text-[#84CC16]" : "hover:text-white"
                }`}
              >
                {std}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand & Silhouette Identity */}
        <div
          onClick={() => {
            setActivePage("home");
            setMobileMenuOpen(false);
          }}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          {brandLogo ? (
            <img
              src={brandLogo}
              alt={brandName}
              className="h-10 sm:h-12 w-auto max-w-[150px] object-contain rounded-xl border border-zinc-800 group-hover:border-lime-400/50 transition"
            />
          ) : (
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-lime-400 to-lime-600 text-black flex items-center justify-center font-black shadow-lg shadow-lime-500/25 group-hover:scale-105 transition duration-300">
              <Zap size={24} className="fill-black" />
            </div>
          )}
          <div>
            <span className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white block leading-none font-mono group-hover:text-lime-400 transition">
              {brandName}
            </span>
            <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#84CC16] block mt-1">
              {business?.tagline || "Engineered Propulsion & Deadstock Footwear"}
            </span>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-6 font-mono text-xs font-bold uppercase tracking-wider text-zinc-400">
          {navLinks.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActivePage(item.id);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`transition-all duration-200 cursor-pointer relative py-2 px-1 flex items-center gap-1.5 ${
                  isActive ? "text-lime-400 font-black" : "hover:text-zinc-100"
                }`}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded-full font-black ${
                      item.badge.includes("Live") || item.badge.includes("Save")
                        ? "bg-lime-500/20 text-lime-400 border border-lime-500/30"
                        : "bg-zinc-800 text-zinc-300"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-lime-400 rounded-full shadow-[0_0_8px_#84CC16]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Tools: Quick Search + Cart Drawer Trigger */}
        <div className="flex items-center gap-3">
          {/* Quick Search Input */}
          <div className="hidden sm:flex items-center relative">
            <Search size={15} className="absolute left-3 text-zinc-500 pointer-events-none" />
            <input
              type="text"
              placeholder="Search kicks, plates, sizes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (activePage !== "sneaker-vault") setActivePage("sneaker-vault");
              }}
              className="bg-zinc-900/90 text-white placeholder:text-zinc-500 text-xs font-mono pl-9 pr-3 py-2 rounded-xl border border-zinc-800 focus:border-lime-400 focus:ring-1 focus:ring-lime-400 outline-none w-48 lg:w-60 transition"
            />
          </div>

          {/* Cart / Shoebox Trigger */}
          <button
            onClick={onOpenCart}
            className="p-2.5 sm:px-4 sm:py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-lime-500/50 text-white hover:text-lime-400 transition cursor-pointer flex items-center gap-2.5 font-mono text-xs shadow-lg group"
            title="Open Shoebox"
          >
            <div className="relative">
              <ShoppingBag size={18} className="text-lime-400 group-hover:scale-110 transition" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-lime-400 text-black text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center font-mono animate-bounce">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline font-bold uppercase tracking-wider">Shoebox</span>
            {cartCount > 0 && (
              <span className="hidden md:inline text-lime-400 font-black">
                ({cartCount})
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white transition"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-zinc-950 border-b border-zinc-800 px-6 py-5 space-y-4 font-mono animate-fadeIn">
          <div className="flex items-center relative mb-4">
            <Search size={16} className="absolute left-3 text-zinc-500" />
            <input
              type="text"
              placeholder="Search kicks & releases..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                setActivePage("sneaker-vault");
                setMobileMenuOpen(false);
              }}
              className="w-full bg-zinc-900 text-white placeholder:text-zinc-500 text-xs pl-9 pr-3 py-2.5 rounded-xl border border-zinc-800 focus:border-lime-400 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActivePage(item.id);
                  setMobileMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`p-3 rounded-xl text-left text-xs font-bold uppercase tracking-wider transition ${
                  activePage === item.id
                    ? "bg-lime-500/10 text-lime-400 border border-lime-500/30"
                    : "bg-zinc-900 text-zinc-400 hover:text-white"
                }`}
              >
                <div>{item.label}</div>
                {item.badge && (
                  <span className="text-[9px] text-lime-400 opacity-80">{item.badge}</span>
                )}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-zinc-900 flex items-center justify-between text-xs text-zinc-400">
            <span>Size System:</span>
            <div className="flex gap-2">
              {["US", "UK", "EU"].map((std) => (
                <button
                  key={std}
                  onClick={() => setSizeStandard && setSizeStandard(std)}
                  className={`px-3 py-1 rounded-lg font-bold ${
                    sizeStandard === std ? "bg-lime-400 text-black font-black" : "bg-zinc-900 text-zinc-300"
                  }`}
                >
                  {std}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
