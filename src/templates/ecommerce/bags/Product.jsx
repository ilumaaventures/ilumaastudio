import React, { useState, useMemo } from "react";
import {
  Search,
  SlidersHorizontal,
  Grid,
  List as ListIcon,
  Filter,
  X,
  Star,
  Check,
  RotateCcw,
  Package,
} from "lucide-react";
import ProductCard from "./ProductCard";

export default function Product({
  products = [],
  onSelectProduct = () => {},
  onAddToCart = () => {},
  searchQuery = "",
  setSearchQuery = () => {},
}) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedMaterial, setSelectedMaterial] = useState("all");
  const [priceMax, setPriceMax] = useState(100);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "list"
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const categories = [
    { id: "all", label: "All Silhouettes" },
    { id: "Backpacks", label: "Backpacks" },
    { id: "Messenger & Crossbody", label: "Messenger & Crossbody" },
    { id: "Totes", label: "Totes & Shoppers" },
  ];

  const materials = [
    { id: "all", label: "All Materials" },
    { id: "leather", label: "Full-Grain Saddle Leather" },
    { id: "canvas", label: "Waxed Cotton Canvas" },
    { id: "cotton", label: "Organic Cotton Duck" },
  ];

  const resetAllFilters = () => {
    setSelectedCategory("all");
    setSelectedMaterial("all");
    setPriceMax(100);
    setInStockOnly(false);
    setSortBy("featured");
    if (setSearchQuery) setSearchQuery("");
  };

  const filteredProducts = useMemo(() => {
    return products
      .filter((item) => {
        // Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = (item.name || "").toLowerCase().includes(q);
          const matchCat = (item.category || "").toLowerCase().includes(q);
          const matchDesc = (item.description || "").toLowerCase().includes(q);
          if (!matchName && !matchCat && !matchDesc) return false;
        }

        // Category
        if (selectedCategory !== "all") {
          const cat = (item.category || "").toLowerCase();
          if (!cat.includes(selectedCategory.toLowerCase())) return false;
        }

        // Material
        if (selectedMaterial !== "all") {
          const mat = (item.material || item.description || "").toLowerCase();
          if (!mat.includes(selectedMaterial.toLowerCase())) return false;
        }

        // Price
        const p = Number(item.price) || 0;
        if (p > priceMax) return false;

        // In Stock
        if (inStockOnly && item.inStock === false) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return (Number(a.price) || 0) - (Number(b.price) || 0);
        if (sortBy === "price-desc") return (Number(b.price) || 0) - (Number(a.price) || 0);
        if (sortBy === "rating") return (b.rating || 5) - (a.rating || 5);
        return 0;
      });
  }, [products, searchQuery, selectedCategory, selectedMaterial, priceMax, inStockOnly, sortBy]);

  const activeFiltersCount =
    (selectedCategory !== "all" ? 1 : 0) +
    (selectedMaterial !== "all" ? 1 : 0) +
    (priceMax < 100 ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0);

  const FilterSidebar = (
    <div className="space-y-6 text-left">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <h3 className="text-xs font-serif font-bold uppercase tracking-wider text-slate-800">
          Filter Collection
        </h3>
        {activeFiltersCount > 0 && (
          <button
            onClick={resetAllFilters}
            className="text-xs font-bold text-[#A0522D] hover:underline cursor-pointer flex items-center gap-1"
          >
            <RotateCcw size={11} />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
          Silhouette
        </label>
        <div className="space-y-1">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`w-full text-left px-3 py-1.5 rounded text-xs transition cursor-pointer flex items-center justify-between ${
                selectedCategory === c.id
                  ? "bg-slate-100 text-slate-900 font-bold"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span>{c.label}</span>
              {selectedCategory === c.id && <Check size={12} className="text-[#A0522D]" />}
            </button>
          ))}
        </div>
      </div>

      {/* Materials */}
      <div className="space-y-2 pt-3 border-t border-slate-100">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
          Sustainable Material
        </label>
        <div className="space-y-1">
          {materials.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedMaterial(m.id)}
              className={`w-full text-left px-3 py-1.5 rounded text-xs transition cursor-pointer flex items-center justify-between ${
                selectedMaterial === m.id
                  ? "bg-slate-100 text-slate-900 font-bold"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span>{m.label}</span>
              {selectedMaterial === m.id && <Check size={12} className="text-[#A0522D]" />}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-2.5 pt-3 border-t border-slate-100">
        <div className="flex items-center justify-between text-xs">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Max Price:
          </label>
          <span className="font-bold text-slate-900">${priceMax}</span>
        </div>
        <input
          type="range"
          min="25"
          max="100"
          step="5"
          value={priceMax}
          onChange={(e) => setPriceMax(Number(e.target.value))}
          className="w-full accent-[#A0522D] cursor-pointer"
        />
      </div>

      {/* In Stock */}
      <div className="pt-3 border-t border-slate-100">
        <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer select-none">
          <span>In Stock Only</span>
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="accent-[#A0522D] rounded"
          />
        </label>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-left font-sans">
      {/* Header with Lines */}
      <div className="flex items-center gap-4 text-center">
        <div className="flex-1 h-[1px] bg-slate-200" />
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-serif text-slate-800 tracking-wide">
            Sustainable Carry Collection
          </h1>
          <p className="text-xs text-slate-400">
            Handcrafted backpacks, field messenger bags, and daypacks built for lifetime adventures.
          </p>
        </div>
        <div className="flex-1 h-[1px] bg-slate-200" />
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-b border-slate-200 text-xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-100 font-bold"
          >
            <Filter size={13} />
            <span>Filters ({activeFiltersCount})</span>
          </button>
          <span className="text-slate-500 font-medium">
            Showing <strong className="text-slate-900">{filteredProducts.length}</strong> handcrafted packs
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded transition ${
                viewMode === "grid" ? "bg-white text-[#A0522D] shadow-2xs" : "text-slate-400"
              }`}
            >
              <Grid size={14} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded transition ${
                viewMode === "list" ? "bg-white text-[#A0522D] shadow-2xs" : "text-slate-400"
              }`}
            >
              <ListIcon size={14} />
            </button>
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-slate-200 text-slate-800 rounded px-3 py-1.5 text-xs font-semibold focus:outline-none cursor-pointer"
          >
            <option value="featured">Featured Packs</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Main Grid + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <aside className="hidden lg:block lg:col-span-3 bg-white p-5 rounded border border-slate-200 sticky top-24">
          {FilterSidebar}
        </aside>

        <section className="lg:col-span-9 space-y-6">
          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center space-y-3 bg-slate-50 rounded border border-slate-200">
              <Package size={36} className="mx-auto text-slate-300" />
              <h3 className="text-base font-bold text-slate-800">No bags match your criteria</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try widening your price range or clearing the material filter.
              </p>
              <button
                type="button"
                onClick={resetAllFilters}
                className="px-5 py-2 bg-[#A0522D] text-white text-xs font-bold rounded-sm uppercase tracking-wider"
              >
                Clear All Filters
              </button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8">
              {filteredProducts.map((bag) => (
                <ProductCard
                  key={bag._id || bag.id}
                  product={bag}
                  onSelectProduct={onSelectProduct}
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProducts.map((bag) => (
                <div
                  key={bag._id || bag.id}
                  onClick={() => onSelectProduct(bag)}
                  className="p-4 rounded border border-slate-200 hover:border-slate-400 transition flex items-center justify-between gap-4 cursor-pointer bg-white"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={bag.image}
                      alt={bag.name}
                      className="w-20 h-20 object-contain bg-slate-50 p-2 rounded"
                    />
                    <div>
                      <span className="text-[10px] font-bold uppercase text-[#A0522D]">
                        {bag.category || "Backpack"}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 uppercase">{bag.name}</h4>
                      <p className="text-xs text-slate-500 line-clamp-1">{bag.description}</p>
                    </div>
                  </div>

                  <div className="text-right space-y-2 shrink-0">
                    <div className="text-sm font-bold text-slate-900">
                      ${Number(bag.price).toFixed(2)}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(bag, 1);
                      }}
                      className="px-4 py-2 bg-[#A0522D] text-white text-xs font-black uppercase tracking-wider rounded-sm hover:bg-[#8B4513]"
                    >
                      ADD TO CART
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            onClick={() => setMobileFilterOpen(false)}
            className="fixed inset-0 bg-black/50"
          />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl p-5 overflow-y-auto flex flex-col justify-between z-10">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <h3 className="text-sm font-bold uppercase text-slate-900">Filter Bags</h3>
                <button onClick={() => setMobileFilterOpen(false)}>
                  <X size={18} />
                </button>
              </div>
              {FilterSidebar}
            </div>

            <div className="pt-4 border-t border-slate-200 sticky bottom-0 bg-white">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 bg-[#A0522D] text-white font-bold text-xs uppercase tracking-wider rounded-sm"
              >
                View {filteredProducts.length} Bags
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
