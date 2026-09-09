import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useStore } from "./StoreContext";
import ProductCard from "../../Components/store/ProductCard";
import {
  Search,
  Filter,
  RefreshCw,
  Grid,
  List,
  Sparkles,
  Tag,
  SlidersHorizontal,
  RotateCcw,
  Star,
  CheckCircle2,
  Check,
  Package,
  X,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Flame,
} from "lucide-react";

export default function Products() {
  const { products = [], categories = [], template, theme: layoutTheme } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const theme = template?.selectedTheme || layoutTheme || {
    colors: {
      primary: "#4F46E5",
      secondary: "#818CF8",
      background: "#F8FAFC",
      cardBg: "#FFFFFF",
      textColor: "#0F172A",
    },
  };

  // Selected filters state from search params
  const initialCategory = searchParams.get("category") || "All Categories";
  const initialSearch = searchParams.get("search") || "";

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [categorySearchQuery, setCategorySearchQuery] = useState("");
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(500000);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'list'
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Accordion open/collapse states
  const [openSections, setOpenSections] = useState({
    categories: true,
    price: true,
    rating: true,
    stock: true,
  });

  const toggleSection = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 200);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Sync state if URL search parameters change
  useEffect(() => {
    setSelectedCategory(searchParams.get("category") || "All Categories");
  }, [searchParams]);

  useEffect(() => {
    setSearchQuery(searchParams.get("search") || "");
  }, [searchParams]);

  const handleCategorySelect = (categoryName) => {
    setSelectedCategory(categoryName);
    const params = new URLSearchParams(searchParams);
    if (categoryName === "All Categories") {
      params.delete("category");
    } else {
      params.set("category", categoryName);
    }
    setSearchParams(params);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    const params = new URLSearchParams(searchParams);
    if (!value.trim()) {
      params.delete("search");
    } else {
      params.set("search", value);
    }
    setSearchParams(params);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setDebouncedSearch("");
    setSelectedCategory("All Categories");
    setCategorySearchQuery("");
    setPriceMin(0);
    setPriceMax(500000);
    setMinRating(0);
    setInStockOnly(false);
    setSortBy("featured");
    setSearchParams(new URLSearchParams());
  };

  // Compute live category item counts
  const categoryCounts = useMemo(() => {
    const counts = {};
    (products || []).forEach((p) => {
      const catName =
        typeof p.category === "object" ? p.category?.name : p.category || "General";
      if (catName) {
        counts[catName] = (counts[catName] || 0) + 1;
      }
    });
    return counts;
  }, [products]);

  // Visible categories filtered by search inside sidebar
  const visibleCategories = useMemo(() => {
    if (!categorySearchQuery.trim()) return categories;
    const q = categorySearchQuery.toLowerCase();
    return categories.filter((c) => c.name?.toLowerCase().includes(q));
  }, [categories, categorySearchQuery]);

  const filteredProducts = useMemo(() => {
    return (products || [])
      .filter((product) => {
        // Search Filter
        if (debouncedSearch.trim()) {
          const query = debouncedSearch.toLowerCase();
          const matchesName = product.name?.toLowerCase().includes(query);
          const matchesDesc = product.description?.toLowerCase().includes(query);
          const matchesCat = (
            typeof product.category === "object" ? product.category?.name : product.category || ""
          ).toLowerCase().includes(query);
          if (!matchesName && !matchesDesc && !matchesCat) return false;
        }

        // Category Filter
        if (selectedCategory !== "All Categories") {
          const catName =
            typeof product.category === "object"
              ? product.category?.name?.toLowerCase()
              : product.category?.toLowerCase();
          if (catName !== selectedCategory.toLowerCase()) return false;
        }

        // Price Filter
        const price = Number(product.price) || 0;
        if (price < priceMin || price > priceMax) return false;

        // Rating Filter
        const rating = Number(product.rating || product.avgRating || 4.8);
        if (rating < minRating) return false;

        // In Stock Filter
        if (inStockOnly) {
          const stock = Number(product.stock || product.stockQuantity || 10);
          if (stock <= 0) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const priceA = Number(a.price) || 0;
        const priceB = Number(b.price) || 0;
        const ratingA = Number(a.rating || 4.8);
        const ratingB = Number(b.rating || 4.8);

        if (sortBy === "price-asc") return priceA - priceB;
        if (sortBy === "price-desc") return priceB - priceA;
        if (sortBy === "rating-desc") return ratingB - ratingA;
        return 0; // featured default
      });
  }, [products, debouncedSearch, selectedCategory, priceMin, priceMax, minRating, inStockOnly, sortBy]);

  const primaryColor = theme?.colors?.primary || "#4F46E5";

  const activeFiltersCount =
    (selectedCategory !== "All Categories" ? 1 : 0) +
    (debouncedSearch.trim() ? 1 : 0) +
    (priceMax < 500000 ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (inStockOnly ? 1 : 0);

  // Reusable Organized Filter Sidebar Content
  const FilterContent = (
    <div className="space-y-4 text-left">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5 opacity-90">
          <SlidersHorizontal size={15} style={{ color: primaryColor }} /> Filter Inventory
          {activeFiltersCount > 0 && (
            <span
              className="px-2 py-0.2 rounded-full text-white text-[10px] font-black"
              style={{ backgroundColor: primaryColor }}
            >
              {activeFiltersCount}
            </span>
          )}
        </h3>
        {activeFiltersCount > 0 && (
          <button
            onClick={resetFilters}
            className="text-xs font-bold transition hover:underline flex items-center gap-1 cursor-pointer"
            style={{ color: primaryColor }}
          >
            <RotateCcw size={12} />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Search Keywords */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">
          Keyword Search
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 opacity-40" size={14} />
          <input
            type="text"
            placeholder="Search catalog..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-9 pr-7 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 transition bg-slate-50/70 focus:bg-white"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                setDebouncedSearch("");
                const params = new URLSearchParams(searchParams);
                params.delete("search");
                setSearchParams(params);
              }}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-700"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Accordion 1: Categories */}
      <div className="border border-slate-200/80 rounded-2xl bg-white overflow-hidden shadow-2xs">
        <button
          type="button"
          onClick={() => toggleSection("categories")}
          className="w-full flex items-center justify-between p-3 bg-slate-50/70 hover:bg-slate-50 transition cursor-pointer"
        >
          <div className="flex items-center gap-1.5">
            <Package size={13} style={{ color: primaryColor }} />
            <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider">
              Categories
            </span>
            {selectedCategory !== "All Categories" && (
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }} />
            )}
          </div>
          {openSections.categories ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>

        {openSections.categories && (
          <div className="p-3 space-y-2">
            {categories.length > 5 && (
              <input
                type="text"
                placeholder="Filter categories..."
                value={categorySearchQuery}
                onChange={(e) => setCategorySearchQuery(e.target.value)}
                className="w-full px-2.5 py-1.5 text-[11px] border border-slate-200 rounded-xl outline-none bg-slate-50"
              />
            )}
            <div className="space-y-1 max-h-52 overflow-y-auto pr-1">
              <button
                onClick={() => handleCategorySelect("All Categories")}
                className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  selectedCategory === "All Categories"
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span>All Categories</span>
                <span className="text-[10px] opacity-60 font-bold">{products.length}</span>
              </button>

              {(visibleCategories || []).map((cat) => {
                const count = categoryCounts[cat.name] || 0;
                const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();
                return (
                  <button
                    key={cat._id}
                    onClick={() => handleCategorySelect(cat.name)}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      isSelected
                        ? "bg-indigo-50 text-indigo-700 font-bold"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      {isSelected && <Check size={13} style={{ color: primaryColor }} />}
                      <span className="truncate">{cat.name}</span>
                    </div>
                    <span className="text-[10px] font-mono opacity-60 bg-slate-100 px-1.5 py-0.5 rounded-full">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Accordion 2: Price Range */}
      <div className="border border-slate-200/80 rounded-2xl bg-white overflow-hidden shadow-2xs">
        <button
          type="button"
          onClick={() => toggleSection("price")}
          className="w-full flex items-center justify-between p-3 bg-slate-50/70 hover:bg-slate-50 transition cursor-pointer"
        >
          <div className="flex items-center gap-1.5">
            <DollarSign size={13} style={{ color: primaryColor }} />
            <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider">
              Price Range
            </span>
            {priceMax < 500000 && (
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }} />
            )}
          </div>
          {openSections.price ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>

        {openSections.price && (
          <div className="p-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Max Budget</span>
              <span className="text-xs font-black" style={{ color: primaryColor }}>
                ₹{priceMax.toLocaleString("en-IN")}
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="500000"
              step="500"
              value={priceMax}
              onChange={(e) => setPriceMax(Number(e.target.value))}
              className="w-full cursor-pointer accent-indigo-600"
            />

            {/* Quick Price Buttons */}
            <div className="grid grid-cols-3 gap-1 pt-1">
              {[
                { label: "₹5k", val: 5000 },
                { label: "₹25k", val: 25000 },
                { label: "Max", val: 500000 },
              ].map((p) => (
                <button
                  key={p.val}
                  type="button"
                  onClick={() => setPriceMax(p.val)}
                  className={`py-1 text-[10px] font-bold rounded-lg border transition ${
                    priceMax === p.val
                      ? "bg-indigo-50 border-indigo-300 text-indigo-700"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Accordion 3: Rating & Stock */}
      <div className="border border-slate-200/80 rounded-2xl bg-white overflow-hidden shadow-2xs">
        <button
          type="button"
          onClick={() => toggleSection("rating")}
          className="w-full flex items-center justify-between p-3 bg-slate-50/70 hover:bg-slate-50 transition cursor-pointer"
        >
          <div className="flex items-center gap-1.5">
            <Star size={13} className="text-amber-500 fill-amber-500" />
            <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider">
              Rating & Stock
            </span>
            {(minRating > 0 || inStockOnly) && (
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }} />
            )}
          </div>
          {openSections.rating ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>

        {openSections.rating && (
          <div className="p-3 space-y-3">
            {/* Rating Buttons */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Minimum Rating
              </span>
              <div className="grid grid-cols-3 gap-1">
                {[
                  { label: "All", val: 0 },
                  { label: "4.0★+", val: 4.0 },
                  { label: "4.5★+", val: 4.5 },
                ].map((r) => (
                  <button
                    key={r.val}
                    type="button"
                    onClick={() => setMinRating(r.val)}
                    className={`py-1 text-[10px] font-bold rounded-lg border transition ${
                      minRating === r.val
                        ? "bg-amber-50 border-amber-300 text-amber-900"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* In-Stock Switch */}
            <div className="pt-2 border-t border-slate-100">
              <label className="flex items-center justify-between cursor-pointer text-xs font-bold text-slate-700 select-none">
                <span>In-Stock Items Only</span>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                />
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div
      className="w-full min-h-screen py-8 sm:py-10 px-4 sm:px-6 lg:px-8 transition-all duration-300"
      style={{
        backgroundColor: theme.colors?.background || "#F8FAFC",
        color: theme.colors?.textColor || "#0F172A",
        fontFamily: template?.selectedFont?.fontFamily || "inherit",
      }}
    >
      <div className="max-w-7xl mx-auto space-y-6 text-left">
        {/* Header Title Section */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-black/[0.06]">
          <div className="space-y-1">
            <span
              className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5"
              style={{ color: primaryColor }}
            >
              <Sparkles size={13} /> Explore Store Catalog
            </span>
            <h1
              className="text-2xl sm:text-3xl font-black tracking-tight"
              style={{ color: theme.colors?.textColor }}
            >
              Product Catalog
            </h1>
            <p className="text-xs opacity-75 font-medium">
              Browse, filter, and discover all available inventory items
            </p>
          </div>

          <span className="text-xs font-extrabold opacity-70 bg-white border border-slate-200/80 px-3.5 py-1.5 rounded-full shadow-2xs w-fit">
            Showing {filteredProducts.length} of {products.length} Products
          </span>
        </div>

        {/* Quick Filter Horizontal Chips Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
            Quick Filter:
          </span>

          <button
            onClick={() => handleCategorySelect("All Categories")}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition shrink-0 cursor-pointer border ${
              selectedCategory === "All Categories"
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            }`}
          >
            All Categories
          </button>

          <button
            onClick={() => setInStockOnly(!inStockOnly)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition shrink-0 cursor-pointer border flex items-center gap-1 ${
              inStockOnly
                ? "bg-emerald-600 text-white border-emerald-600"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            }`}
          >
            <Check size={12} />
            <span>In Stock</span>
          </button>

          <button
            onClick={() => setMinRating(minRating === 4.5 ? 0 : 4.5)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition shrink-0 cursor-pointer border flex items-center gap-1 ${
              minRating === 4.5
                ? "bg-amber-500 text-white border-amber-500"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            }`}
          >
            <Star size={12} className={minRating === 4.5 ? "fill-white" : "fill-amber-500 text-amber-500"} />
            <span>Top Rated 4.5★</span>
          </button>

          {categories.slice(0, 4).map((cat) => (
            <button
              key={cat._id}
              onClick={() => handleCategorySelect(cat.name)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition shrink-0 cursor-pointer border ${
                selectedCategory.toLowerCase() === cat.name.toLowerCase()
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Catalog Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block lg:col-span-1 space-y-4 sticky top-24">
            <div
              className="p-5 rounded-3xl border border-black/[0.06] shadow-xs"
              style={{
                backgroundColor: theme.colors?.cardBg || "#FFFFFF",
              }}
            >
              {FilterContent}
            </div>
          </aside>

          {/* Right Product Grid */}
          <div className="space-y-6 lg:col-span-3">
            {/* Top Bar Sort & View Mode Controls */}
            <div
              className="p-3 sm:p-3.5 rounded-2xl border border-black/[0.06] shadow-2xs flex items-center justify-between flex-wrap gap-3"
              style={{
                backgroundColor: theme.colors?.cardBg || "#FFFFFF",
              }}
            >
              {/* Mobile Filter Button Trigger */}
              <button
                type="button"
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition cursor-pointer"
              >
                <Filter size={14} style={{ color: primaryColor }} />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span
                    className="w-4 h-4 rounded-full text-white text-[9px] font-black flex items-center justify-center"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              <div className="flex items-center gap-2 text-xs font-extrabold">
                <span className="opacity-60 hidden sm:inline">Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none cursor-pointer"
                >
                  <option value="featured">Featured Items</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating-desc">Highest Rated</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center bg-slate-100 p-1 rounded-xl gap-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 rounded-lg transition cursor-pointer ${
                      viewMode === "grid" ? "bg-white text-indigo-600 shadow-2xs" : "text-slate-500"
                    }`}
                  >
                    <Grid size={15} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 rounded-lg transition cursor-pointer ${
                      viewMode === "list" ? "bg-white text-indigo-600 shadow-2xs" : "text-slate-500"
                    }`}
                  >
                    <List size={15} />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filters Ribbon */}
            {activeFiltersCount > 0 && (
              <div className="flex items-center gap-2 flex-wrap text-left">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Active Filters:
                </span>
                {debouncedSearch && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-200 text-slate-800 text-xs font-semibold">
                    "{debouncedSearch}"
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setDebouncedSearch("");
                      }}
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}
                {selectedCategory !== "All Categories" && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold">
                    {selectedCategory}
                    <button onClick={() => handleCategorySelect("All Categories")}>
                      <X size={12} />
                    </button>
                  </span>
                )}
                {priceMax < 500000 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-200 text-slate-800 text-xs font-semibold">
                    Under ₹{priceMax.toLocaleString()}
                    <button onClick={() => setPriceMax(500000)}>
                      <X size={12} />
                    </button>
                  </span>
                )}
                {inStockOnly && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
                    In Stock
                    <button onClick={() => setInStockOnly(false)}>
                      <X size={12} />
                    </button>
                  </span>
                )}
                {minRating > 0 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold">
                    {minRating}★+
                    <button onClick={() => setMinRating(0)}>
                      <X size={12} />
                    </button>
                  </span>
                )}
                <button
                  onClick={resetFilters}
                  className="text-xs font-bold text-rose-600 hover:underline cursor-pointer ml-1"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Empty State */}
            {filteredProducts.length === 0 && (
              <div
                className="p-12 rounded-3xl border border-black/[0.06] text-center space-y-4 shadow-xs"
                style={{
                  backgroundColor: theme.colors?.cardBg || "#FFFFFF",
                }}
              >
                <Package size={40} className="mx-auto opacity-30" />
                <h3 className="text-lg font-black text-slate-900">No Products Found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
                  We couldn't find any products matching your active filters. Try adjusting your search or category selection.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-5 py-2.5 rounded-xl text-xs font-extrabold text-white shadow-md cursor-pointer"
                  style={{ backgroundColor: primaryColor }}
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Product Cards */}
            {filteredProducts.length > 0 && (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-4"
                }
              >
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} theme={theme} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Slide-over Filter Drawer */}
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
                    <Filter size={15} style={{ color: primaryColor }} />
                    <span>Filter Inventory</span>
                  </h3>
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                  >
                    <X size={18} />
                  </button>
                </div>
                {FilterContent}
              </div>

              <div className="pt-4 border-t border-slate-200 mt-6 sticky bottom-0 bg-white space-y-2">
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full py-3 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md cursor-pointer"
                  style={{ backgroundColor: primaryColor }}
                >
                  Show {filteredProducts.length} Products
                </button>
                {activeFiltersCount > 0 && (
                  <button
                    type="button"
                    onClick={resetFilters}
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
    </div>
  );
}
