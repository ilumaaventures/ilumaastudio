import React, { useState, useMemo } from "react";
import {
  Search,
  Sliders,
  Filter,
  Grid,
  List as ListIcon,
  X,
  Star,
  Check,
  RotateCcw,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Tag,
  Flame,
  Sparkles,
} from "lucide-react";
import ProductCard from "./ProductCard";
import { getProductImage } from "../../../utils/productImage";

export default function Product({
  products = [],
  onSelectProduct = () => {},
  onAddToCart = () => {},
  onQuickView = null,
  sizeStandard = "EU",
  searchQuery = "",
  setSearchQuery = () => {},
}) {
  // -------------------------------------------------------------
  // Filter States Matching Reference Image 2
  // -------------------------------------------------------------
  const [localSearch, setLocalSearch] = useState(searchQuery || "");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [priceMax, setPriceMax] = useState(250);
  const [tempPriceMax, setTempPriceMax] = useState(250);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [fastFilter, setFastFilter] = useState("all"); // "all" | "featured" | "bestseller" | "toprated" | "sale" | "instock"
  const [sortBy, setSortBy] = useState("default");
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "list"
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Dropdown states for fast filter header
  const [colorDropdownOpen, setColorDropdownOpen] = useState(false);
  const [sizeDropdownOpen, setSizeDropdownOpen] = useState(false);

  // Categories defined in reference
  const categoryOptions = [
    "Free Metcon",
    "Men's Shoes",
    "Nike City",
    "Nike Dunk",
    "Uncategorized",
    "Women's Shoes",
  ];

  // Colors defined in reference with hex codes
  const colorOptions = [
    { id: "black", label: "Black", hex: "#0F172A", count: 4 },
    { id: "blue", label: "Blue", hex: "#2563EB", count: 5 },
    { id: "green", label: "Green", hex: "#10B981", count: 3 },
    { id: "red", label: "Red", hex: "#EF4444", count: 3 },
    { id: "white", label: "White", hex: "#E2E8F0", count: 4 },
  ];

  // Sizes defined in reference
  const sizeOptions = ["38", "40", "41", "42", "42.5", "43"];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (setSearchQuery) setSearchQuery(localSearch);
  };

  const toggleCategory = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const toggleColor = (colId) => {
    setSelectedColors((prev) =>
      prev.includes(colId) ? prev.filter((c) => c !== colId) : [...prev, colId]
    );
  };

  const toggleSize = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const resetAllFilters = () => {
    setLocalSearch("");
    if (setSearchQuery) setSearchQuery("");
    setSelectedCategories([]);
    setSelectedColors([]);
    setSelectedSizes([]);
    setPriceMax(250);
    setTempPriceMax(250);
    setInStockOnly(false);
    setOnSaleOnly(false);
    setFastFilter("all");
    setSortBy("default");
  };

  // Filter and Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Keyword Search
        const query = (searchQuery || localSearch).trim().toLowerCase();
        if (query) {
          const matchName = p.name?.toLowerCase().includes(query);
          const matchCat = p.category?.toLowerCase().includes(query);
          const matchDesc = p.description?.toLowerCase().includes(query);
          if (!matchName && !matchCat && !matchDesc) return false;
        }

        // Fast Filter pill
        if (fastFilter === "featured" && !p.isFeatured && !p.badge?.toLowerCase().includes("featured")) {
          // allow standard featured
        } else if (fastFilter === "bestseller") {
          if (!p.badge?.toLowerCase().includes("best") && !p.isBestSeller) return false;
        } else if (fastFilter === "toprated") {
          if (Number(p.rating || 5) < 4.8) return false;
        } else if (fastFilter === "sale") {
          if (!p.compareAtPrice || Number(p.compareAtPrice) <= Number(p.price)) return false;
        } else if (fastFilter === "instock") {
          if (p.inStock === false) return false;
        }

        // Categories filter
        if (selectedCategories.length > 0) {
          const pCat = (p.category || "").toLowerCase();
          const match = selectedCategories.some((c) => pCat.includes(c.toLowerCase()));
          if (!match) return false;
        }

        // Color filter
        if (selectedColors.length > 0) {
          const pColors = (p.colors || []).map((c) => c.name.toLowerCase());
          const match = selectedColors.some((sc) =>
            pColors.some((pc) => pc.includes(sc.toLowerCase())) ||
            (p.name || "").toLowerCase().includes(sc.toLowerCase())
          );
          if (!match) return false;
        }

        // Size filter
        if (selectedSizes.length > 0) {
          const pSizes = p.sizes || ["38", "40", "41", "42", "43"];
          const match = selectedSizes.some((s) => pSizes.includes(s));
          if (!match) return false;
        }

        // Price filter
        const price = Number(p.price) || 0;
        if (price > priceMax) return false;

        // In Stock
        if (inStockOnly && p.inStock === false) return false;

        // On Sale
        if (onSaleOnly) {
          const compare = Number(p.compareAtPrice || 0);
          if (compare <= price) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const priceA = Number(a.price) || 0;
        const priceB = Number(b.price) || 0;
        if (sortBy === "price-asc") return priceA - priceB;
        if (sortBy === "price-desc") return priceB - priceA;
        if (sortBy === "rating") return (b.rating || 5) - (a.rating || 5);
        return 0; // default
      });
  }, [
    products,
    searchQuery,
    localSearch,
    fastFilter,
    selectedCategories,
    selectedColors,
    selectedSizes,
    priceMax,
    inStockOnly,
    onSaleOnly,
    sortBy,
  ]);

  const activeFiltersCount =
    (localSearch ? 1 : 0) +
    selectedCategories.length +
    selectedColors.length +
    selectedSizes.length +
    (priceMax < 250 ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (onSaleOnly ? 1 : 0) +
    (fastFilter !== "all" ? 1 : 0);

  // Sidebar Filters Component (matches left panel of Reference Image 2)
  const FilterSidebar = (
    <div className="space-y-6 text-left">
      {/* 1. Search Box with Blue Search Button */}
      <form onSubmit={handleSearchSubmit} className="space-y-2">
        <div className="flex rounded-xl overflow-hidden border border-slate-200 shadow-2xs focus-within:border-blue-600 transition">
          <input
            type="text"
            placeholder="Search products..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none bg-white"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#1E3A8A] hover:bg-blue-800 text-white font-black text-xs uppercase tracking-wider transition cursor-pointer"
          >
            Search
          </button>
        </div>
      </form>

      {/* 2. Filter By Price */}
      <div className="space-y-3 pb-5 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
            Filter By Price
          </h4>
          <span className="text-xs text-slate-400">—</span>
        </div>

        <input
          type="range"
          min="10"
          max="250"
          step="5"
          value={tempPriceMax}
          onChange={(e) => setTempPriceMax(Number(e.target.value))}
          className="w-full accent-[#1E3A8A] cursor-pointer"
        />

        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            onClick={() => setPriceMax(tempPriceMax)}
            className="px-3.5 py-1.5 bg-black text-white text-[11px] font-black uppercase tracking-wider rounded transition cursor-pointer hover:bg-slate-800"
          >
            Filter
          </button>
          <span className="text-xs font-bold text-slate-600">
            PRICE: $10 — ${tempPriceMax}
          </span>
        </div>
      </div>

      {/* 3. Filter By Color */}
      <div className="space-y-2.5 pb-5 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
            Filter By Color
          </h4>
          <span className="text-xs text-slate-400">—</span>
        </div>

        <div className="space-y-1.5">
          {colorOptions.map((c) => {
            const isChecked = selectedColors.includes(c.id);
            return (
              <label
                key={c.id}
                onClick={() => toggleColor(c.id)}
                className="flex items-center justify-between py-1 px-1 rounded-lg hover:bg-slate-50 transition cursor-pointer select-none"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full border border-slate-300"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span
                    className={`text-xs ${
                      isChecked ? "font-bold text-blue-700" : "text-slate-700"
                    }`}
                  >
                    {c.label}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  {c.count}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 4. Product Categories */}
      <div className="space-y-2.5 pb-5 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
            Product Categories
          </h4>
          <span className="text-xs text-slate-400">—</span>
        </div>

        <div className="space-y-1.5">
          {categoryOptions.map((cat) => {
            const isChecked = selectedCategories.includes(cat);
            return (
              <label
                key={cat}
                onClick={() => toggleCategory(cat)}
                className="flex items-center justify-between py-1 px-1 rounded-lg hover:bg-slate-50 transition cursor-pointer select-none"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3.5 h-3.5 rounded flex items-center justify-center border transition ${
                      isChecked
                        ? "bg-[#1E3A8A] border-[#1E3A8A] text-white"
                        : "border-slate-300 bg-white"
                    }`}
                  >
                    {isChecked && <Check size={10} />}
                  </div>
                  <span
                    className={`text-xs ${
                      isChecked ? "font-bold text-blue-700" : "text-slate-700"
                    }`}
                  >
                    {cat}
                  </span>
                </div>
                <span className="text-xs text-slate-400 font-bold">+</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 5. Product Status */}
      <div className="space-y-2.5 pb-5 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
            Product Status
          </h4>
          <span className="text-xs text-slate-400">—</span>
        </div>

        <div className="space-y-1.5">
          <label
            onClick={() => setInStockOnly(!inStockOnly)}
            className="flex items-center gap-2 py-1 px-1 rounded-lg hover:bg-slate-50 transition cursor-pointer select-none"
          >
            <div
              className={`w-3.5 h-3.5 rounded flex items-center justify-center border transition ${
                inStockOnly
                  ? "bg-[#1E3A8A] border-[#1E3A8A] text-white"
                  : "border-slate-300 bg-white"
              }`}
            >
              {inStockOnly && <Check size={10} />}
            </div>
            <span
              className={`text-xs ${
                inStockOnly ? "font-bold text-blue-700" : "text-slate-700"
              }`}
            >
              In stock
            </span>
          </label>

          <label
            onClick={() => setOnSaleOnly(!onSaleOnly)}
            className="flex items-center gap-2 py-1 px-1 rounded-lg hover:bg-slate-50 transition cursor-pointer select-none"
          >
            <div
              className={`w-3.5 h-3.5 rounded flex items-center justify-center border transition ${
                onSaleOnly
                  ? "bg-[#1E3A8A] border-[#1E3A8A] text-white"
                  : "border-slate-300 bg-white"
              }`}
            >
              {onSaleOnly && <Check size={10} />}
            </div>
            <span
              className={`text-xs ${
                onSaleOnly ? "font-bold text-blue-700" : "text-slate-700"
              }`}
            >
              On sale
            </span>
          </label>
        </div>
      </div>

      {/* 6. Filter By Sizes */}
      <div className="space-y-2.5 pb-5 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
            Filter By Sizes
          </h4>
          <span className="text-xs text-slate-400">—</span>
        </div>

        <div className="space-y-1.5">
          {sizeOptions.map((sz) => {
            const isChecked = selectedSizes.includes(sz);
            return (
              <label
                key={sz}
                onClick={() => toggleSize(sz)}
                className="flex items-center justify-between py-1 px-1 rounded-lg hover:bg-slate-50 transition cursor-pointer select-none"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3.5 h-3.5 rounded flex items-center justify-center border transition ${
                      isChecked
                        ? "bg-[#1E3A8A] border-[#1E3A8A] text-white"
                        : "border-slate-300 bg-white"
                    }`}
                  >
                    {isChecked && <Check size={10} />}
                  </div>
                  <span
                    className={`text-xs ${
                      isChecked ? "font-bold text-blue-700" : "text-slate-700"
                    }`}
                  >
                    {sizeStandard} {sz}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">1</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 7. Featured Products Mini Widget */}
      <div className="space-y-3">
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
          Featured Products
        </h4>
        <div className="space-y-3">
          {products.slice(0, 3).map((item) => (
            <div
              key={item._id || item.id}
              onClick={() => onSelectProduct(item)}
              className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 hover:bg-slate-100 transition cursor-pointer"
            >
              <img
                src={getProductImage(item, item.image)}
                alt={item.name}
                className="w-12 h-12 object-contain bg-white rounded-lg border border-slate-200 p-1"
              />
              <div className="truncate">
                <span className="text-xs font-bold text-slate-800 truncate block">
                  {item.name}
                </span>
                <div className="flex items-center gap-1 text-amber-400 text-[10px]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={9} className="fill-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-black text-slate-900">
                  ${Number(item.price).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reset Link */}
      {activeFiltersCount > 0 && (
        <button
          type="button"
          onClick={resetAllFilters}
          className="w-full py-2 bg-rose-50 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 hover:bg-rose-100 transition cursor-pointer flex items-center justify-center gap-1.5"
        >
          <RotateCcw size={12} />
          <span>Reset All Filters ({activeFiltersCount})</span>
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans text-left">
      {/* ================= 1. WIDE PROMO BANNER (Reference Image 2) ================= */}
      <div className="rounded-3xl bg-[#1C1D21] text-white p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="space-y-3 z-10 max-w-md">
          <h3 className="text-xl sm:text-2xl font-black tracking-tight">
            Free Shipping On Over $50
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            For the terms of the campaign, see the description page.
          </p>
          <button
            type="button"
            onClick={() => {
              setFastFilter("all");
              window.scrollTo({ top: 400, behavior: "smooth" });
            }}
            className="px-6 py-2.5 rounded bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider transition cursor-pointer shadow-md inline-block"
          >
            See More Products
          </button>
        </div>

        {/* Right Sneaker Cutout Visual */}
        <div className="relative w-full md:w-80 h-44 sm:h-52 flex items-center justify-center">
          <img
            src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700&auto=format&fit=crop&q=80"
            alt="Promo Sneaker"
            className="max-h-full w-auto object-contain filter drop-shadow-[0_20px_25px_rgba(0,0,0,0.7)]"
          />
        </div>
      </div>

      {/* ================= 2. FAST FILTERS STRIP (Reference Image 2) ================= */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200 pt-2">
        <span className="text-xs font-black uppercase tracking-wider text-slate-400 shrink-0 mr-1">
          Fast Filters:
        </span>

        <button
          type="button"
          onClick={() => setFastFilter(fastFilter === "featured" ? "all" : "featured")}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition shrink-0 cursor-pointer border flex items-center gap-1.5 ${
            fastFilter === "featured"
              ? "bg-[#1E3A8A] text-white border-[#1E3A8A] shadow-xs"
              : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
          }`}
        >
          <span>⭐</span>
          <span>FEATURED</span>
        </button>

        <button
          type="button"
          onClick={() => setFastFilter(fastFilter === "bestseller" ? "all" : "bestseller")}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition shrink-0 cursor-pointer border flex items-center gap-1.5 ${
            fastFilter === "bestseller"
              ? "bg-[#1E3A8A] text-white border-[#1E3A8A] shadow-xs"
              : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
          }`}
        >
          <span>🔥</span>
          <span>BEST SELLERS</span>
        </button>

        <button
          type="button"
          onClick={() => setFastFilter(fastFilter === "toprated" ? "all" : "toprated")}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition shrink-0 cursor-pointer border flex items-center gap-1.5 ${
            fastFilter === "toprated"
              ? "bg-[#1E3A8A] text-white border-[#1E3A8A] shadow-xs"
              : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
          }`}
        >
          <span>✨</span>
          <span>TOP RATED</span>
        </button>

        <button
          type="button"
          onClick={() => setFastFilter(fastFilter === "sale" ? "all" : "sale")}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition shrink-0 cursor-pointer border flex items-center gap-1.5 ${
            fastFilter === "sale"
              ? "bg-rose-600 text-white border-rose-600 shadow-xs"
              : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
          }`}
        >
          <span>🏷️</span>
          <span>ON SALE</span>
        </button>

        <button
          type="button"
          onClick={() => setFastFilter(fastFilter === "instock" ? "all" : "instock")}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition shrink-0 cursor-pointer border flex items-center gap-1.5 ${
            fastFilter === "instock"
              ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
              : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
          }`}
        >
          <span>⚡</span>
          <span>IN STOCK</span>
        </button>

        {/* SELECT COLOR Popover Dropdown */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setColorDropdownOpen(!colorDropdownOpen)}
            className="px-3 py-1.5 rounded-full text-xs font-bold transition cursor-pointer border bg-white text-slate-700 border-slate-200 hover:border-slate-300 flex items-center gap-1.5"
          >
            <span>SELECT COLOR</span>
            <ChevronDown size={12} />
          </button>
          {colorDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-30 space-y-1">
              {colorOptions.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    toggleColor(c.id);
                    setColorDropdownOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs hover:bg-slate-50 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: c.hex }} />
                    <span>{c.label}</span>
                  </div>
                  {selectedColors.includes(c.id) && <Check size={12} className="text-blue-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* SELECT SIZES Popover Dropdown */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setSizeDropdownOpen(!sizeDropdownOpen)}
            className="px-3 py-1.5 rounded-full text-xs font-bold transition cursor-pointer border bg-white text-slate-700 border-slate-200 hover:border-slate-300 flex items-center gap-1.5"
          >
            <span>SELECT SIZES</span>
            <ChevronDown size={12} />
          </button>
          {sizeDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-30 grid grid-cols-2 gap-1">
              {sizeOptions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    toggleSize(s);
                    setSizeDropdownOpen(false);
                  }}
                  className={`px-2 py-1 text-xs font-bold rounded border cursor-pointer ${
                    selectedSizes.includes(s)
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {sizeStandard} {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ================= 3. MAIN CATALOG & SIDEBAR LAYOUT ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Filter Sidebar */}
        <aside className="hidden lg:block lg:col-span-3 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs sticky top-24">
          {FilterSidebar}
        </aside>

        {/* Right Product Grid Column */}
        <section className="lg:col-span-9 space-y-6">
          {/* Results Toolbar: Count, Show counts, View mode, Sorting */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-2 border-b border-slate-200 text-xs">
            {/* Left: Results Count & Mobile Filter Trigger */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 font-bold"
              >
                <Filter size={13} />
                <span>Filters ({activeFiltersCount})</span>
              </button>
              <span className="text-slate-500 font-medium">
                Showing all <strong className="text-slate-900">{filteredProducts.length}</strong> results
              </span>
            </div>

            {/* Right: Show pagination items, view icons, and sorting */}
            <div className="flex items-center gap-4 flex-wrap">
              {/* Show Items Count */}
              <div className="hidden sm:flex items-center gap-1.5 text-slate-500">
                <span>Show</span>
                {[9, 12, 18, 24].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setItemsPerPage(num)}
                    className={`font-bold transition cursor-pointer ${
                      itemsPerPage === num ? "text-blue-600 underline" : "text-slate-400 hover:text-slate-700"
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>

              {/* View Switcher Icons */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-lg transition cursor-pointer ${
                    viewMode === "grid" ? "bg-white text-blue-600 shadow-2xs" : "text-slate-400"
                  }`}
                >
                  <Grid size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-lg transition cursor-pointer ${
                    viewMode === "list" ? "bg-white text-blue-600 shadow-2xs" : "text-slate-400"
                  }`}
                >
                  <ListIcon size={14} />
                </button>
              </div>

              {/* Sorting Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-slate-200 text-slate-800 rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none cursor-pointer"
              >
                <option value="default">Default sorting</option>
                <option value="price-asc">Sort by price: low to high</option>
                <option value="price-desc">Sort by price: high to low</option>
                <option value="rating">Sort by average rating</option>
              </select>
            </div>
          </div>

          {/* Active Filter Chips Ribbon */}
          {activeFiltersCount > 0 && (
            <div className="flex items-center gap-2 flex-wrap text-left pt-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Active Filters:
              </span>
              {localSearch && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold">
                  "{localSearch}"
                  <button onClick={() => setLocalSearch("")}>
                    <X size={12} />
                  </button>
                </span>
              )}
              {selectedCategories.map((c) => (
                <span
                  key={c}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-semibold"
                >
                  {c}
                  <button onClick={() => toggleCategory(c)}>
                    <X size={12} />
                  </button>
                </span>
              ))}
              {selectedColors.map((c) => (
                <span
                  key={c}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold capitalize"
                >
                  Color: {c}
                  <button onClick={() => toggleColor(c)}>
                    <X size={12} />
                  </button>
                </span>
              ))}
              {selectedSizes.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold"
                >
                  Size: {sizeStandard} {s}
                  <button onClick={() => toggleSize(s)}>
                    <X size={12} />
                  </button>
                </span>
              ))}
              {priceMax < 250 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold">
                  Under ${priceMax}
                  <button onClick={() => setPriceMax(250)}>
                    <X size={12} />
                  </button>
                </span>
              )}
              {inStockOnly && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold">
                  In Stock
                  <button onClick={() => setInStockOnly(false)}>
                    <X size={12} />
                  </button>
                </span>
              )}
              {onSaleOnly && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 text-rose-800 text-xs font-semibold">
                  On Sale
                  <button onClick={() => setOnSaleOnly(false)}>
                    <X size={12} />
                  </button>
                </span>
              )}
              <button
                type="button"
                onClick={resetAllFilters}
                className="text-xs font-bold text-rose-600 hover:underline cursor-pointer ml-1"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Product Cards Grid / List View */}
          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center space-y-4 bg-white rounded-3xl border border-slate-200">
              <Sliders size={36} className="mx-auto text-slate-300" />
              <h3 className="text-base font-bold text-slate-800">
                No sneakers found matching your criteria
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try widening your price range, clearing the selected sizes or colors.
              </p>
              <button
                type="button"
                onClick={resetAllFilters}
                className="px-5 py-2 bg-[#1E3A8A] text-white text-xs font-black uppercase tracking-wider rounded-xl transition cursor-pointer hover:bg-blue-800"
              >
                Clear All Filters
              </button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {filteredProducts.slice(0, itemsPerPage).map((shoe) => (
                <ProductCard
                  key={shoe._id || shoe.id}
                  product={shoe}
                  onSelectProduct={onSelectProduct}
                  onAddToCart={onAddToCart}
                  onQuickView={onQuickView}
                  sizeStandard={sizeStandard}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredProducts.slice(0, itemsPerPage).map((shoe) => (
                <div
                  key={shoe._id || shoe.id}
                  onClick={() => onSelectProduct(shoe)}
                  className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-400 hover:shadow-md transition flex items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={getProductImage(shoe, shoe.image)}
                      alt={shoe.name}
                      className="w-20 h-20 object-contain bg-slate-50 rounded-xl p-2"
                    />
                    <div>
                      <span className="text-[10px] font-black uppercase text-blue-600">
                        {shoe.category || "Sneakers"}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">{shoe.name}</h4>
                      <div className="flex items-center gap-1 text-amber-400 text-xs">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={11} className="fill-amber-400" />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="text-right space-y-2">
                    <div className="text-base font-black text-slate-900">
                      ${Number(shoe.price).toFixed(2)}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart({
                          ...shoe,
                          selectedSize: `${sizeStandard} 41`,
                          selectedColor: "Standard",
                        });
                      }}
                      className="px-4 py-1.5 bg-[#1E3A8A] text-white text-xs font-bold rounded-xl hover:bg-blue-800 transition"
                    >
                      Quick Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Mobile Slide-Over Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            onClick={() => setMobileFilterOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
          />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl p-5 overflow-y-auto flex flex-col justify-between z-10">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                  <Filter size={15} className="text-[#1E3A8A]" />
                  <span>Filter Sneakers</span>
                </h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <X size={18} />
                </button>
              </div>
              {FilterSidebar}
            </div>

            <div className="pt-4 border-t border-slate-200 mt-6 sticky bottom-0 bg-white space-y-2">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 bg-[#1E3A8A] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md cursor-pointer hover:bg-blue-800"
              >
                Show {filteredProducts.length} Sneakers
              </button>
              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="w-full py-1.5 text-slate-500 hover:text-slate-700 text-xs font-semibold"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
