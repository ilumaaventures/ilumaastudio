import React, { useState, useMemo } from "react";
import { SlidersHorizontal, Star, X, Check, Droplets } from "lucide-react";
import ProductCard from "./ProductCard";

export default function Product({
  products = [],
  onSelectProduct,
  onAddToCart,
  onQuickView,
  searchQuery = "",
  setSearchQuery,
  selectedCategory = "all",
  setSelectedCategory,
}) {
  const [maxPrice, setMaxPrice] = useState(100);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("featured");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const categories = [
    { id: "all", label: "All Products" },
    { id: "Toners & Essences", label: "Toners & Essences" },
    { id: "Serums & Elixirs", label: "Serums & Elixirs" },
    { id: "Lipstick & Makeup", label: "Lipsticks & Makeup" },
    { id: "Body Care", label: "Body Care" },
  ];

  const handleResetFilters = () => {
    setSelectedCategory?.("all");
    setMaxPrice(100);
    setMinRating(0);
    setSortBy("featured");
    setSearchQuery?.("");
  };

  const filteredProducts = useMemo(() => {
    return products
      .filter((item) => {
        // Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const nameM = (item.name || "").toLowerCase().includes(q);
          const descM = (item.description || "").toLowerCase().includes(q);
          const catM = (item.category || "").toLowerCase().includes(q);
          if (!nameM && !descM && !catM) return false;
        }

        // Category
        if (selectedCategory !== "all") {
          const cat = (item.category || "").toLowerCase();
          const target = selectedCategory.toLowerCase();
          if (!cat.includes(target) && target !== "all") return false;
        }

        // Price
        if (Number(item.price) > maxPrice) return false;

        // Rating
        if (minRating > 0 && (item.rating || 0) < minRating) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return Number(a.price) - Number(b.price);
        if (sortBy === "price-desc") return Number(b.price) - Number(a.price);
        if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
        return 0;
      });
  }, [products, searchQuery, selectedCategory, maxPrice, minRating, sortBy]);

  const renderSidebar = () => (
    <div className="space-y-6 text-left">
      <div className="flex items-center justify-between pb-3 border-b border-stone-200">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-[#8F9E68]" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900 font-serif">
            Filter Beauty
          </h3>
        </div>
        <button
          type="button"
          onClick={handleResetFilters}
          className="text-xs text-[#8F9E68] hover:underline font-semibold cursor-pointer"
        >
          Reset All
        </button>
      </div>

      {/* 1. Category */}
      <div className="space-y-2.5">
        <span className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
          Category
        </span>
        <div className="space-y-1.5 text-xs text-stone-600">
          {categories.map((cat) => {
            const isSelected = selectedCategory.toLowerCase() === cat.id.toLowerCase();
            return (
              <label
                key={cat.id}
                onClick={() => setSelectedCategory?.(cat.id)}
                className="flex items-center gap-2.5 cursor-pointer group hover:text-stone-900 transition"
              >
                <input
                  type="radio"
                  name="cat_filter"
                  checked={isSelected}
                  onChange={() => {}}
                  className="w-3.5 h-3.5 text-[#8F9E68] border-stone-300 focus:ring-[#8F9E68] accent-[#8F9E68] cursor-pointer"
                />
                <span className={isSelected ? "font-semibold text-stone-900" : ""}>
                  {cat.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 2. Price Range Slider */}
      <div className="space-y-3 pt-3 border-t border-stone-100">
        <span className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
          Maximum Price: ${maxPrice}
        </span>
        <input
          type="range"
          min="10"
          max="100"
          step="5"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-[#8F9E68] h-1 bg-stone-200 rounded-lg cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-stone-500">
          <span>$10</span>
          <span>$100</span>
        </div>
      </div>

      {/* 3. Minimum Rating */}
      <div className="space-y-2 pt-3 border-t border-stone-100">
        <span className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
          Minimum Rating
        </span>
        <div className="space-y-1.5">
          {[5, 4, 3].map((r) => (
            <label
              key={r}
              onClick={() => setMinRating(minRating === r ? 0 : r)}
              className="flex items-center gap-2 cursor-pointer text-xs"
            >
              <input
                type="radio"
                name="rating_filter"
                checked={minRating === r}
                onChange={() => {}}
                className="w-3.5 h-3.5 accent-[#8F9E68]"
              />
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    className={i < r ? "fill-amber-400 text-amber-400" : "text-stone-300"}
                  />
                ))}
              </div>
              <span className="text-stone-500">& Up</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-[#FAF9F7] min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Mobile Filter Button */}
        <div className="lg:hidden flex items-center justify-between">
          <button
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-md border border-stone-200 text-xs font-semibold shadow-xs"
          >
            <SlidersHorizontal size={14} className="text-[#8F9E68]" />
            <span>Filters</span>
          </button>
          <span className="text-xs text-stone-500">
            {filteredProducts.length} Products
          </span>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Left Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 bg-white p-6 rounded-xl border border-stone-200/80 shadow-xs">
            {renderSidebar()}
          </aside>

          {/* Mobile Filter Drawer */}
          {mobileFilterOpen && (
            <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end">
              <div className="bg-white w-80 h-full p-6 overflow-y-auto shadow-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-200">
                    <h3 className="font-bold text-stone-900 font-serif">Filters</h3>
                    <button
                      type="button"
                      onClick={() => setMobileFilterOpen(false)}
                      className="p-1 rounded-lg text-stone-500 hover:bg-stone-100"
                    >
                      <X size={18} />
                    </button>
                  </div>
                  {renderSidebar()}
                </div>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full mt-6 py-2.5 bg-[#8F9E68] text-white font-semibold text-xs rounded shadow-md"
                >
                  Show Results ({filteredProducts.length})
                </button>
              </div>
            </div>
          )}

          {/* Right Product Grid */}
          <main className="lg:col-span-9 space-y-6">
            {/* Top Toolbar */}
            <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-[#8F9E68] uppercase block">
                  Botanical Formulations
                </span>
                <h1 className="text-xl font-bold font-serif text-stone-900 mt-0.5">
                  {selectedCategory === "all" ? "All Beauty Products" : selectedCategory}
                </h1>
                <p className="text-xs text-stone-500 mt-0.5">
                  Showing {filteredProducts.length} clean beauty essentials
                </p>
              </div>

              {/* Sort Selector */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-stone-500">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-[#FAF9F7] border border-stone-200 rounded px-3 py-1.5 text-stone-800 font-medium focus:outline-none focus:border-[#8F9E68] cursor-pointer"
                >
                  <option value="featured">Featured Essentials</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>

            {/* Product Grid (4 columns) */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onSelectProduct={onSelectProduct}
                    onAddToCart={onAddToCart}
                    onQuickView={onQuickView}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white p-12 rounded-xl border border-stone-200 text-center space-y-4">
                <div className="w-12 h-12 bg-stone-100 text-[#8F9E68] rounded-full flex items-center justify-center mx-auto">
                  <Droplets size={20} />
                </div>
                <h3 className="text-base font-bold text-stone-900 font-serif">
                  No products matching your selection
                </h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Try adjusting your price range or clearing category filters.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-[#8F9E68] text-white text-xs font-semibold rounded transition cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
