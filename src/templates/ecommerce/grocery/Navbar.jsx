import React, { useState, useEffect } from "react";
import {
  Leaf,
  ShoppingBag,
  Search,
  MapPin,
  Clock,
  Phone,
  Zap,
  Sparkles,
  Menu,
  X,
  Heart,
  Tag,
  Utensils,
  Layers,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Truck,
  Apple,
  Croissant,
  Egg,
  CupSoda,
} from "lucide-react";
import toast from "react-hot-toast";

export default function Navbar({
  brandName = "FreshMart",
  brandLogo = null,
  brandPhone = "1-800-FRESH-MT",
  activePage = "home",
  setActivePage,
  cartCount = 0,
  cartTotal = 0,
  onOpenCart,
  searchQuery = "",
  setSearchQuery,
  onSelectCategory = null,
  zipCode = "10001",
  onZipChange = null,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [zipModalOpen, setZipModalOpen] = useState(false);
  const [tempZip, setTempZip] = useState(zipCode);
  const [isSearching, setIsSearching] = useState(false);

  // 25-Min Live Delivery Countdown
  const [countdown, setCountdown] = useState({ minutes: 24, seconds: 48 });

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { minutes: prev.minutes - 1, seconds: 59 };
        return { minutes: 24, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const navLinks = [
    { id: "home", label: "Marketplace", icon: Leaf },
    { id: "aisles", label: "Fresh Aisles", icon: Layers },

    { id: "offers", label: "Harvest Deals", icon: Tag, badge: "35% Off" },
  ];

  const popularSearches = [
    "Honeycrisp Apples",
    "Sourdough Loaf",
    "Pasture Eggs",
    "Green Detox",
    "Kalamata Olive Oil",
  ];

  const handleNav = (id) => {
    setActivePage(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleApplyZip = (e) => {
    e?.preventDefault();
    if (!tempZip.trim()) {
      toast.error("Please enter a valid postal/ZIP code");
      return;
    }
    if (onZipChange) onZipChange(tempZip.trim());
    setZipModalOpen(false);
    toast.success(
      `Delivery address set to ${tempZip}! 30-min eco-couriers active.`,
    );
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-950/10 shadow-xs select-none">
        {/* ================= 1. EXPRESS RIBBON ================= */}
        <div className="bg-[#15803D] text-white text-[11px] py-2 px-4 border-b border-emerald-800">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-medium tracking-wide">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-300 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-400"></span>
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold uppercase tracking-wider text-yellow-300">
                  ⚡ 25-Min Express Slot:
                </span>
                <span>Order in next</span>
                <span className="font-mono bg-emerald-900/90 text-yellow-300 px-2 py-0.5 rounded font-bold tracking-widest text-[11px] border border-emerald-700">
                  {String(countdown.minutes).padStart(2, "0")}:
                  {String(countdown.seconds).padStart(2, "0")}
                </span>
                <span className="hidden sm:inline">
                  for insulated doorstep delivery • Cold-Chain Assured
                </span>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-6 text-[11px] font-medium text-emerald-100">
              <span className="flex items-center gap-1.5">
                <Truck size={13} className="text-emerald-300" />
                Free Shipping Above ₹499
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-emerald-300" />
                100% Certified Organic
              </span>
              <a
                href={`tel:${brandPhone}`}
                className="hover:text-white transition flex items-center gap-1 text-emerald-200"
              >
                <Phone size={12} />
                <span>{brandPhone}</span>
              </a>
            </div>
          </div>
        </div>

        {/* ================= 2. MAIN HEADER ================= */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Brand Logo & Title */}
          <div
            onClick={() => handleNav("home")}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            {brandLogo ? (
              <img
                src={brandLogo}
                alt={brandName}
                className="h-10 w-auto max-w-[140px] object-contain rounded-lg"
              />
            ) : (
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-600 via-green-600 to-emerald-800 text-white flex items-center justify-center shadow-md shadow-emerald-900/20 group-hover:scale-105 transition duration-300">
                <Leaf size={22} className="text-emerald-200 animate-pulse" />
              </div>
            )}
            <div className="space-y-0.5 text-left hidden sm:block">
              <span className="text-xl font-black tracking-tight text-[#15803D] block leading-none">
                {brandName}
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#16A34A] font-bold block">
                Organic Supermarket
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg relative hidden md:block">
            <div className="relative flex items-center">
              <Search
                size={16}
                className="absolute left-3.5 text-emerald-700 pointer-events-none"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (
                    activePage !== "aisles" &&
                    e.target.value.trim().length > 1
                  ) {
                    setActivePage("aisles");
                  }
                }}
                onFocus={() => setIsSearching(true)}
                onBlur={() => setTimeout(() => setIsSearching(false), 200)}
                placeholder="Search organic fruits, artisanal sourdough, cold-pressed elixirs..."
                className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-[#F4F9F6] border border-emerald-200 focus:bg-white focus:border-[#15803D] focus:ring-2 focus:ring-emerald-500/20 text-xs font-medium text-slate-800 placeholder-slate-400 transition outline-hidden"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Quick search tags on focus */}
            {isSearching && !searchQuery && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-emerald-100 rounded-2xl shadow-xl p-3 z-50 text-left">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Popular Harvest Searches
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {popularSearches.map((item) => (
                    <button
                      key={item}
                      onMouseDown={() => {
                        setSearchQuery(item);
                        setActivePage("aisles");
                      }}
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-semibold transition cursor-pointer"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-[12px] font-bold tracking-wide">
            {navLinks.map((tab) => {
              const isActive = activePage === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleNav(tab.id)}
                  className={`transition cursor-pointer relative py-2 flex items-center gap-1.5 ${
                    isActive
                      ? "text-[#15803D] font-extrabold"
                      : "text-slate-600 hover:text-[#15803D]"
                  }`}
                >
                  <Icon
                    size={14}
                    className={isActive ? "text-[#15803D]" : "text-slate-400"}
                  />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                      {tab.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#16A34A] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Fresh Basket Drawer Trigger */}
            <button
              onClick={onOpenCart}
              className="px-4 py-2.5 rounded-2xl bg-[#15803D] hover:bg-emerald-800 text-white transition cursor-pointer flex items-center gap-2.5 font-bold text-xs shadow-md shadow-emerald-950/20 transform hover:-translate-y-0.5"
            >
              <div className="relative">
                <ShoppingBag size={17} className="text-emerald-200" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-400 text-emerald-950 font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs animate-pulse">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">Fresh Basket</span>
              {cartTotal > 0 && (
                <span className="hidden md:inline font-mono text-[11px] bg-emerald-900/60 px-2 py-0.5 rounded-lg border border-emerald-700/50">
                  ₹{Number(cartTotal).toFixed(2)}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition lg:hidden cursor-pointer"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Row (small screens) */}
        <div className="px-4 pb-3 md:hidden">
          <div className="relative flex items-center">
            <Search size={15} className="absolute left-3.5 text-emerald-700" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (
                  activePage !== "aisles" &&
                  e.target.value.trim().length > 1
                ) {
                  setActivePage("aisles");
                }
              }}
              placeholder="Search organic harvest..."
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-[#F4F9F6] border border-emerald-200 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 text-slate-400"
              >
                <X size={13} />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ================= 3. ZIP CODE MODAL ================= */}
      {zipModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-emerald-100 space-y-5 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <MapPin size={20} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Check Express Delivery Zone
                  </h3>
                  <p className="text-xs text-slate-500">
                    25-minute cold chain dispatch
                  </p>
                </div>
              </div>
              <button
                onClick={() => setZipModalOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleApplyZip} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Enter Postal / ZIP Code:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={tempZip}
                    onChange={(e) => setTempZip(e.target.value)}
                    placeholder="e.g. 10001 or 94103"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-sm font-bold text-slate-900 outline-hidden"
                  />
                  <span className="absolute right-3 top-3 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-lg">
                    30-Min Fast
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1.5">
                <div className="flex items-center gap-2 font-bold">
                  <CheckCircle2 size={15} className="text-emerald-600" />
                  <span>Eco-Electric Delivery Fleet Active</span>
                </div>
                <p className="text-[11px] text-emerald-800/80 leading-relaxed">
                  Orders are packed inside temperature-controlled dry-ice
                  compartments to guarantee 100% freshness upon doorstep
                  arrival.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setZipModalOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#15803D] hover:bg-emerald-800 text-white text-xs font-bold shadow-md shadow-emerald-950/20"
                >
                  Confirm Location
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= 4. MOBILE DRAWER ================= */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
          />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between z-10 text-left">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                    <Leaf size={16} />
                  </div>
                  <span className="font-black text-base text-[#15803D]">
                    {brandName}
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-xl text-slate-400 hover:text-slate-600"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Delivery Zone Pill */}
              <div
                onClick={() => {
                  setMobileMenuOpen(false);
                  setZipModalOpen(true);
                }}
                className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-emerald-700" />
                  <div className="text-xs">
                    <div className="font-bold text-emerald-900">
                      Delivering to: {zipCode}
                    </div>
                    <div className="text-[10px] text-emerald-700">
                      Estimated: 25 mins
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-200/60 px-2 py-0.5 rounded-lg">
                  Change
                </span>
              </div>

              {/* Navigation list */}
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-2">
                  Storefront Navigation
                </p>
                {navLinks.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activePage === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleNav(tab.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                        isActive
                          ? "bg-emerald-100 text-[#15803D]"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon
                          size={16}
                          className={
                            isActive ? "text-[#15803D]" : "text-slate-400"
                          }
                        />
                        <span>{tab.label}</span>
                      </div>
                      {tab.badge && (
                        <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                          {tab.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Aisle Quick Shortcuts */}
              <div className="space-y-1.5 pt-3 border-t border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-2">
                  Explore Fresh Aisles
                </p>
                {[
                  { name: "Fresh Produce", emoji: "🍎" },
                  { name: "Artisanal Bakery", emoji: "🥐" },
                  { name: "Dairy & Eggs", emoji: "🥚" },
                  { name: "Beverages & Juices", emoji: "🧃" },
                  { name: "Pantry & Spices", emoji: "🍯" },
                ].map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      if (onSelectCategory) onSelectCategory(item.name);
                      handleNav("aisles");
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-emerald-800 hover:bg-emerald-50 transition"
                  >
                    <span>{item.emoji}</span>
                    <span>{item.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="pt-6 border-t border-slate-100 space-y-3">
              <a
                href={`tel:${brandPhone}`}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold hover:bg-slate-200 transition"
              >
                <Phone size={14} />
                <span>Call Care: {brandPhone}</span>
              </a>
              <p className="text-[10px] text-slate-400 text-center">
                100% Certified Organic • Zero Single-Use Plastics
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
