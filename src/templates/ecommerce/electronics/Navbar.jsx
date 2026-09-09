import React, { useState } from "react";
import {
  Cpu,
  Search,
  ShoppingCart,
  Heart,
  SlidersHorizontal,
  Phone,
  ShieldCheck,
  Truck,
  RotateCcw,
  ChevronDown,
  Menu,
  X,
  Zap,
  Tag,
  Laptop,
  Smartphone,
  Headphones,
  Gamepad2,
  Camera,
  Tv,
} from "lucide-react";
import toast from "react-hot-toast";

export default function Navbar({
  brandName = "TECHNOVA",
  brandLogo = null,
  brandPhone = "+1 (888) 404-TECH",
  activePage = "home",
  setActivePage,
  cartCount = 0,
  cartTotal = 0,
  onOpenCart,
  searchQuery = "",
  setSearchQuery,
  compareCount = 0,
  onOpenCompare,
  onSelectDepartment = null,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState("All Departments");
  const [deptDropdownOpen, setDeptDropdownOpen] = useState(false);

  const departments = [
    "All Departments",
    "Laptops & Computers",
    "Smartphones & Tablets",
    "Audio & Headphones",
    "Game Consoles & Gaming",
    "Cameras & Photography",
    "TV & Home Entertainment",
  ];

  const handleNav = (id) => {
    setActivePage(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (activePage !== "specs") {
      setActivePage("specs");
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-slate-200 select-none font-sans">
      {/* ================= 1. TOP SERVICE STRIP ================= */}
      <div className="bg-[#F8FAFC] text-slate-500 text-[11px] py-1.5 px-4 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <span className="font-semibold text-slate-700 flex items-center gap-1">
              <Zap size={13} className="text-yellow-500 fill-yellow-500" />
              <span>Welcome to {brandName} Electronics Megastore!</span>
            </span>
            <span className="hidden sm:inline text-slate-300">|</span>
            <span className="hidden sm:inline">
              Free Express Delivery on Orders Over $99
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-600 text-[11px]">
            <span className="hidden md:flex items-center gap-1">
              <ShieldCheck size={12} className="text-emerald-600" />
              <span>2-Year Full Hardware Warranty</span>
            </span>
            <span className="hidden md:flex items-center gap-1">
              <RotateCcw size={12} className="text-sky-600" />
              <span>30-Day Easy Returns</span>
            </span>
            <a
              href={`tel:${brandPhone}`}
              className="flex items-center gap-1 font-bold text-slate-800 hover:text-sky-600 transition"
            >
              <Phone size={11} />
              <span>{brandPhone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* ================= 2. MAIN MEGASTORE HEADER ================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          onClick={() => handleNav("home")}
          className="flex items-center gap-2.5 cursor-pointer group shrink-0"
        >
          {brandLogo ? (
            <img
              src={brandLogo}
              alt={brandName}
              className="h-10 w-auto max-w-[140px] object-contain"
            />
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 text-[#EAB308] flex items-center justify-center font-black text-xl shadow-md">
                <Cpu size={22} className="text-yellow-400" />
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 leading-none block">
                  {brandName}
                </span>
                <span className="text-[9px] uppercase tracking-[0.25em] font-extrabold text-[#EAB308] block">
                  Electronics Store
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Search Bar with Department Selector */}
        <div className="flex-1 max-w-2xl relative hidden md:block">
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center rounded-full border-2 border-slate-200 focus-within:border-[#EAB308] bg-white transition shadow-2xs overflow-hidden"
          >
            {/* Category Dropdown */}
            <div className="relative border-r border-slate-200">
              <button
                type="button"
                onClick={() => setDeptDropdownOpen(!deptDropdownOpen)}
                className="px-3.5 py-2.5 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 transition flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <span className="max-w-[120px] truncate">{selectedDept}</span>
                <ChevronDown size={13} className="text-slate-400" />
              </button>

              {deptDropdownOpen && (
                <div className="absolute left-0 top-full mt-1 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 text-left">
                  {departments.map((dept) => (
                    <button
                      key={dept}
                      type="button"
                      onClick={() => {
                        setSelectedDept(dept);
                        setDeptDropdownOpen(false);
                        if (onSelectDepartment) onSelectDepartment(dept);
                      }}
                      className={`w-full px-4 py-2 text-xs text-left transition ${
                        selectedDept === dept
                          ? "bg-yellow-50 text-yellow-800 font-bold"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {dept}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Keyword Input */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (
                  activePage !== "specs" &&
                  e.target.value.trim().length > 1
                ) {
                  setActivePage("specs");
                }
              }}
              placeholder="Search 20,000+ tech gadgets, laptops, audio gear..."
              className="w-full px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden"
            />

            {/* Yellow Search Button */}
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#EAB308] hover:bg-yellow-500 text-slate-950 font-bold transition flex items-center justify-center shrink-0 cursor-pointer"
            >
              <Search size={16} />
            </button>
          </form>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Compare Specs Trigger */}
          <button
            onClick={() => handleNav("compare")}
            title="Comparison Matrix"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 transition cursor-pointer text-xs font-semibold"
          >
            <div className="relative">
              <SlidersHorizontal size={18} className="text-slate-600" />
              {compareCount > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-[#EAB308] text-slate-950 font-black text-[9px] flex items-center justify-center">
                  {compareCount}
                </span>
              )}
            </div>
            <span className="hidden lg:inline">Compare</span>
          </button>

          {/* Wishlist */}
          <button
            onClick={() => {
              setActivePage("specs");
              toast("Tip: Click heart icon on any gadget card to save it!", {
                icon: "💛",
              });
            }}
            title="Saved Favorites"
            className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition cursor-pointer hidden sm:flex items-center justify-center"
          >
            <Heart size={20} />
          </button>

          {/* Cart Trigger Button */}
          <button
            onClick={onOpenCart}
            className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white transition cursor-pointer shadow-md"
          >
            <div className="relative">
              <ShoppingCart size={18} className="text-yellow-400" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2.5 w-4 h-4 rounded-full bg-[#EAB308] text-slate-950 font-black text-[10px] flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </div>
            <div className="text-left text-xs leading-none hidden sm:block">
              <span className="text-[10px] text-slate-400 block font-normal">
                Your Cart
              </span>
              <span className="font-extrabold text-white font-mono">
                ${Number(cartTotal).toFixed(2)}
              </span>
            </div>
          </button>

          {/* Mobile Hamburger Menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition md:hidden cursor-pointer"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* ================= 4. MOBILE DRAWER ================= */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
          />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between z-10 text-left">
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="font-black text-lg text-slate-900">
                  {brandName}
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-xl text-slate-400 hover:text-slate-600"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Mobile Search */}
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search gadgets..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-800"
                />
                <Search
                  size={15}
                  className="absolute left-3 top-2.5 text-slate-400"
                />
              </div>

              {/* Navigation */}
              <div className="space-y-1">
                {[
                  { id: "home", label: "Today's Deals" },
                  { id: "specs", label: "Hardware Catalog" },
                  { id: "offers", label: "Warehouse Cleaning" },
                  { id: "compare", label: "Compare Specs" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNav(item.id)}
                    className="w-full text-left py-2.5 px-3 rounded-xl text-xs font-bold text-slate-800 hover:bg-yellow-50 hover:text-yellow-900 transition"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 text-xs text-slate-500 space-y-2">
              <p>24/7 Tech Care: {brandPhone}</p>
              <p>2-Year Warranty Guaranteed</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
