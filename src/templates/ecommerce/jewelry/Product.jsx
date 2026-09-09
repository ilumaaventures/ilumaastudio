import React, { useState, useMemo } from "react";
import { SlidersHorizontal, Star, X, Check } from "lucide-react";
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
  const [selectedMetal, setSelectedMetal] = useState("all");
  const [maxPrice, setMaxPrice] = useState(1500);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("featured");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const categories = [
    { id: "all", label: "All Creations" },
    { id: "Bracelets", label: "Bracelets" },
    { id: "Earrings", label: "Earrings" },
    { id: "Necklaces", label: "Necklaces" },
    { id: "Gold Set", label: "Gold Set" },
    { id: "Silver Set", label: "Silver Set" },
    { id: "Rings", label: "Rings" },
  ];

  const metals = [
    { id: "all", label: "All Precious Metals" },
    { id: "18ct Yellow Gold", label: "18ct Yellow Gold" },
    { id: "18ct White Gold", label: "18ct White Gold" },
    { id: "Sterling Silver", label: "925 Sterling Silver" },
  ];

  const handleResetFilters = () => {
    setSelectedCategory?.("all");
    setSelectedMetal("all");
    setMaxPrice(1500);
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

        // Metal
        if (selectedMetal !== "all") {
          const itemMetal = (item.metal || "").toLowerCase();
          const targetMetal = selectedMetal.toLowerCase();
          if (!itemMetal.includes(targetMetal)) return false;
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
  }, [products, searchQuery, selectedCategory, selectedMetal, maxPrice, minRating, sortBy]);

  const renderSidebar = () => (
    <div className="space-y-6 text-left">
      <div className="flex items-center justify-between pb-3 border-b border-stone-200">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-stone-700" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900 font-serif">
            Filter Vault
          </h3>
        </div>
        <button
          type="button"
          onClick={handleResetFilters}
          className="text-xs text-[#AA771C] hover:underline font-semibold cursor-pointer"
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
                  className="w-3.5 h-3.5 text-[#AA771C] border-stone-300 focus:ring-[#AA771C] accent-[#AA771C] cursor-pointer"
                />
                <span className={isSelected ? "font-semibold text-stone-900" : ""}>
                  {cat.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 2. Metal Purity */}
      <div className="space-y-2.5 pt-3 border-t border-stone-100">
        <span className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
          Precious Metal
        </span>
        <div className="space-y-1.5 text-xs text-stone-600">
          {metals.map((m) => {
            const isSelected = selectedMetal === m.id;
            return (
              <label
                key={m.id}
                onClick={() => setSelectedMetal(m.id)}
                className="flex items-center gap-2.5 cursor-pointer group hover:text-stone-900 transition"
              >
                <input
                  type="radio"
                  name="metal_filter"
                  checked={isSelected}
                  onChange={() => {}}
                  className="w-3.5 h-3.5 text-[#AA771C] border-stone-300 focus:ring-[#AA771C] accent-[#AA771C] cursor-pointer"
                />
                <span className={isSelected ? "font-semibold text-stone-900" : ""}>
                  {m.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 3. Price Range Slider */}
      <div className="space-y-3 pt-3 border-t border-stone-100">
        <span className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
          Maximum Price: ${maxPrice}
        </span>
        <input
          type="range"
          min="50"
          max="1500"
          step="25"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-[#AA771C] h-1 bg-stone-200 rounded-lg cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-stone-500">
          <span>$50</span>
          <span>$1,500+</span>
        </div>
      </div>

      {/* 4. Minimum Rating */}
      <div className="space-y-2 pt-3 border-t border-stone-100">
        <span className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
          Customer Rating
        </span>
        <div className="space-y-1.5">
          {[4, 3, 2].map((r) => (
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
                className="w-3.5 h-3.5 accent-[#AA771C]"
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
    <div className="bg-[#FAF9F8] min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Mobile Filter Button */}
        <div className="lg:hidden flex items-center justify-between">
          <button
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-md border border-stone-200 text-xs font-semibold shadow-xs"
          >
            <SlidersHorizontal size={14} className="text-[#AA771C]" />
            <span>Filters</span>
          </button>
          <span className="text-xs text-stone-500">
            {filteredProducts.length} Pieces
          </span>
        </div>

        {/* Catalog Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Left Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 bg-white p-6 rounded-lg border border-stone-200/80 shadow-xs">
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
                  className="w-full mt-6 py-2.5 bg-stone-900 text-white font-semibold text-xs rounded-md shadow-md"
                >
                  Show Results ({filteredProducts.length})
                </button>
              </div>
            </div>
          )}

          {/* Right Product Grid */}
          <main className="lg:col-span-9 space-y-6">
            {/* Top Toolbar */}
            <div className="bg-white p-4 rounded-lg border border-stone-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-[#AA771C] uppercase block">
                  Fine Jewelry Collection
                </span>
                <h1 className="text-xl font-bold font-serif text-stone-900 mt-0.5">
                  {selectedCategory === "all" ? "All Handmade Jewelry" : selectedCategory}
                </h1>
                <p className="text-xs text-stone-500 mt-0.5">
                  Showing {filteredProducts.length} handcrafted pieces
                </p>
              </div>

              {/* Sort Selector */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-stone-500">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-[#FAF9F8] border border-stone-200 rounded px-3 py-1.5 text-stone-800 font-medium focus:outline-none focus:border-[#AA771C] cursor-pointer"
                >
                  <option value="featured">Featured Pieces</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
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
              <div className="bg-white p-12 rounded-lg border border-stone-200 text-center space-y-4">
                <div className="w-12 h-12 bg-stone-100 text-[#AA771C] rounded-full flex items-center justify-center mx-auto">
                  <SlidersHorizontal size={20} />
                </div>
                <h3 className="text-base font-bold text-stone-900 font-serif">
                  No jewelry matching criteria
                </h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Try adjusting your price range, metal purity, or clearing category selections.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-stone-900 hover:bg-[#AA771C] text-white text-xs font-semibold rounded transition cursor-pointer"
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
