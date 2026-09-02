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
} from "lucide-react";

export default function Products() {
  const { products, categories, template, theme: layoutTheme } = useStore();
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
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(500000);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'list'

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
    setSelectedCategory("All Categories");
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

  const filteredProducts = useMemo(() => {
    return (products || [])
      .filter((product) => {
        // Search Filter
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
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
  }, [products, searchQuery, selectedCategory, priceMin, priceMax, minRating, inStockOnly, sortBy]);

  const primaryColor = theme?.colors?.primary || "#4F46E5";

  return (
    <div
      className="w-full min-h-screen py-10 px-4 sm:px-6 lg:px-8 transition-all duration-300"
      style={{
        backgroundColor: theme.colors?.background || "#F8FAFC",
        color: theme.colors?.textColor || "#0F172A",
        fontFamily: template?.selectedFont?.fontFamily || "inherit",
      }}
    >
      <div className="max-w-7xl mx-auto space-y-8 text-left">
        
        {/* Header Title Section */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-black/[0.06]">
          <div className="space-y-1">
            <span
              className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5"
              style={{ color: primaryColor }}
            >
              <Sparkles size={13} /> Explore Store Catalog
            </span>
            <h1
              className="text-3xl sm:text-4xl font-black tracking-tight"
              style={{ color: theme.colors?.textColor }}
            >
              Product Catalog
            </h1>
            <p className="text-xs opacity-75 font-medium">
              Browse, filter, and discover all available inventory items
            </p>
          </div>

          <span className="text-xs font-extrabold opacity-70 bg-white border border-slate-200/80 px-3 py-1.5 rounded-full shadow-2xs">
            Showing {filteredProducts.length} of {products.length} Products
          </span>
        </div>

        {/* Catalog Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Sidebar Filters */}
          <div className="space-y-6 lg:col-span-1">
            <div
              className="p-5 rounded-3xl border border-black/[0.06] shadow-xs space-y-6"
              style={{
                backgroundColor: theme.colors?.cardBg || "#FFFFFF",
              }}
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5 opacity-90">
                  <SlidersHorizontal size={15} style={{ color: primaryColor }} /> Filter Inventory
                </h3>
                <button
                  onClick={resetFilters}
                  className="text-xs font-bold transition hover:underline flex items-center gap-1 cursor-pointer"
                  style={{ color: primaryColor }}
                >
                  <RotateCcw size={12} />
                  <span>Reset</span>
                </button>
              </div>

              {/* Search Box */}
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider block">
                  Search Keywords
                </label>
                <div className="relative">
                  <Search className="absolute left-3.5 top-3 opacity-40" size={15} />
                  <input
                    type="text"
                    placeholder="Search catalog..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full pl-9 pr-4 py-2.5 text-xs border border-slate-200 rounded-2xl outline-none focus:ring-2 transition bg-slate-50/50 focus:bg-white"
                  />
                </div>
              </div>

              {/* Categories Filter */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider block">
                  Categories
                </label>
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

                  {(categories || []).map((cat) => {
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

              {/* Price Range Slider */}
              <div className="space-y-2.5 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider">
                    Max Price (₹)
                  </label>
                  <span className="text-xs font-black" style={{ color: primaryColor }}>
                    ₹{priceMax.toLocaleString("en-IN")}
                  </span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="500000"
                  step="1000"
                  value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  className="w-full cursor-pointer accent-indigo-600"
                />
              </div>

              {/* In-Stock Filter */}
              <div className="pt-2 border-t border-slate-100">
                <label className="flex items-center justify-between cursor-pointer text-xs font-bold text-slate-700">
                  <span>In-Stock Only</span>
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Right Product Grid */}
          <div className="space-y-6 lg:col-span-3">
            
            {/* Top Bar Sort & View Mode Controls */}
            <div
              className="p-3.5 rounded-2xl border border-black/[0.06] shadow-2xs flex items-center justify-between flex-wrap gap-3"
              style={{
                backgroundColor: theme.colors?.cardBg || "#FFFFFF",
              }}
            >
              <div className="flex items-center gap-2 text-xs font-extrabold">
                <span className="opacity-60">Sort By:</span>
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
      </div>
    </div>
  );
}
