import React, { useState, useMemo } from "react";
import {
  Search,
  SlidersHorizontal,
  Grid,
  List,
  Filter,
  X,
  Battery,
  ShieldCheck,
  Zap,
  Star,
  Plus,
  ArrowUpDown,
  Cpu,
  Layers,
} from "lucide-react";
import ProductCard from "./ProductCard";
import { getProductImage } from "../../../utils/productImage";
import { isOutOfStock } from "../../../utils/stockUtils";

export default function Product({
  products = [],
  onSelectProduct,
  onAddToCart,
  compareList = [],
  onToggleCompare,
  onOpenCompareMatrix,
  searchQuery = "",
  setSearchQuery,
  selectedCategory = "all",
  setSelectedCategory,
}) {
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "table"
  const [sortBy, setSortBy] = useState("featured"); // "featured" | "price-asc" | "price-desc" | "rating"
  const [inStockOnly, setInStockOnly] = useState(false);
  const [filterSpec, setFilterSpec] = useState("all"); // "all" | "anc" | "long-battery" | "deals"

  const categories = [
    "all",
    "Accessories, Headphones",
    "Game Consoles, Video Games",
    "Laptops, Computers",
    "Audio Systems, TV & Audio",
  ];

  // Filtering & Sorting
  const filteredProducts = useMemo(() => {
    return products
      .filter((item) => {
        // Category
        if (selectedCategory !== "all") {
          const cat = (item.category || "").toLowerCase();
          const filter = selectedCategory.toLowerCase();
          if (!cat.includes(filter)) return false;
        }

        // Search Query
        if (searchQuery && searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = (item.name || "").toLowerCase().includes(q);
          const matchCat = (item.category || "").toLowerCase().includes(q);
          const matchDesc = (item.description || "").toLowerCase().includes(q);
          if (!matchName && !matchCat && !matchDesc) {
            return false;
          }
        }

        // In stock
        if (inStockOnly && isOutOfStock(item)) {
          return false;
        }

        // Filter Spec
        if (filterSpec === "deals") {
          if (!item.compareAtPrice || Number(item.compareAtPrice) <= Number(item.price)) {
            return false;
          }
        } else if (filterSpec === "long-battery") {
          if (!item.batteryLifeHours || item.batteryLifeHours < 40) {
            return false;
          }
        } else if (filterSpec === "anc") {
          const anc = (item.ancDb || "").toLowerCase();
          if (!anc.includes("anc") && !anc.includes("db") && !anc.includes("isolation")) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return (Number(a.price) || 0) - (Number(b.price) || 0);
        if (sortBy === "price-desc") return (Number(b.price) || 0) - (Number(a.price) || 0);
        if (sortBy === "rating") return (b.rating || 5) - (a.rating || 5);
        return 0;
      });
  }, [products, selectedCategory, searchQuery, inStockOnly, filterSpec, sortBy]);

  const activeFilterCount =
    (selectedCategory !== "all" ? 1 : 0) +
    (searchQuery ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (filterSpec !== "all" ? 1 : 0);

  const resetAllFilters = () => {
    setSelectedCategory("all");
    if (setSearchQuery) setSearchQuery("");
    setInStockOnly(false);
    setFilterSpec("all");
    setSortBy("featured");
  };

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 text-left">
      {/* Catalog Header & Breadcrumb */}
      <div className="space-y-4 border-b border-slate-200 pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold mb-2">
              <Cpu size={13} className="text-amber-700" />
              <span>Full Hardware Catalog & Lineup</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Electronics Department
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              Browse top rated smart electronics, audio gear, video consoles, and modern mobile workstations.
            </p>
          </div>

          {/* View Mode Toggle & Total count */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 font-medium">
              Showing <strong className="text-slate-900">{filteredProducts.length}</strong> of {products.length} items
            </span>

            <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                title="Grid View"
                className={`p-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-white text-slate-950 font-black shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <Grid size={15} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("table")}
                title="Table Spec View"
                className={`p-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                  viewMode === "table"
                    ? "bg-white text-slate-950 font-black shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <List size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-4">
          {/* Live Search */}
          <div className="md:col-span-4 relative">
            <input
              type="text"
              placeholder="Search model, category, specs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
              className="w-full bg-white text-xs text-slate-900 placeholder-slate-400 pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 focus:border-[#EAB308] focus:outline-none transition shadow-xs"
            />
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery && setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Category Dropdown/Pills */}
          <div className="md:col-span-5 flex flex-wrap gap-1.5 items-center">
            {categories.map((c) => {
              const isSelected = selectedCategory.toLowerCase() === c.toLowerCase();
              return (
                <button
                  key={c}
                  onClick={() => setSelectedCategory(c)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
                    isSelected
                      ? "bg-[#EAB308] text-slate-950 border-[#EAB308] shadow-xs font-black"
                      : "bg-white text-slate-600 hover:text-slate-900 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {c === "all" ? "All Departments" : c.split(",")[0]}
                </button>
              );
            })}
          </div>

          {/* Sort selector */}
          <div className="md:col-span-3 flex items-center gap-2">
            <div className="relative w-full">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full appearance-none bg-white text-xs text-slate-800 pl-3 pr-8 py-2.5 rounded-xl border border-slate-200 focus:border-[#EAB308] focus:outline-none cursor-pointer"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-asc">Sort: Price (Lowest First)</option>
                <option value="price-desc">Sort: Price (Highest First)</option>
                <option value="rating">Sort: Customer Rating</option>
              </select>
              <ArrowUpDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Technical Sub-Filters & Active Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Quick Filter:</span>
            {[
              { id: "all", label: "All Items" },
              { id: "deals", label: "Discounted Only" },
              { id: "long-battery", label: "40h+ Stamina" },
              { id: "anc", label: "Active Noise Cancellation" },
            ].map((pill) => (
              <button
                key={pill.id}
                onClick={() => setFilterSpec(pill.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer border ${
                  filterSpec === pill.id
                    ? "bg-slate-900 text-white border-slate-900 font-bold"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {pill.label}
              </button>
            ))}

            <label className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] text-slate-700 font-semibold cursor-pointer select-none ml-1">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="accent-[#EAB308] rounded"
              />
              <span>In-Stock Only</span>
            </label>
          </div>

          {activeFilterCount > 0 && (
            <button
              onClick={resetAllFilters}
              className="text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1 font-bold transition cursor-pointer"
            >
              <X size={13} />
              <span>Reset All Filters ({activeFilterCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* Floating Comparison Drawer Strip if items are selected */}
      {compareList && compareList.length > 0 && (
        <div className="sticky top-24 z-30 bg-white/95 backdrop-blur-md border border-slate-200 p-3 sm:p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-lg animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={16} className="text-[#EAB308]" />
            <span className="text-xs font-bold text-slate-900">
              Comparing <strong>{compareList.length}</strong> devices:
            </span>
            <div className="flex -space-x-2">
              {compareList.map((c) => (
                <span
                  key={c._id || c.id}
                  title={c.name}
                  className="inline-block bg-slate-100 text-[10px] text-slate-800 font-bold px-2 py-0.5 rounded-full border border-slate-300 truncate max-w-[120px]"
                >
                  {c.name.split(" ")[0]}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenCompareMatrix}
              className="px-3.5 py-1.5 rounded-xl bg-[#EAB308] hover:bg-yellow-500 text-slate-950 font-black text-xs cursor-pointer transition shadow-xs"
            >
              Open Comparison Matrix
            </button>
          </div>
        </div>
      )}

      {/* Results Content */}
      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center space-y-4 bg-white rounded-3xl border border-slate-200">
          <Cpu size={40} className="mx-auto text-slate-300" />
          <h3 className="text-lg font-bold text-slate-800">No hardware models match your filters</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search criteria, clearing the filters, or viewing all departments.
          </p>
          <button
            onClick={resetAllFilters}
            className="px-4 py-2 rounded-xl bg-[#EAB308] text-slate-950 text-xs font-bold hover:bg-yellow-500 transition cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === "grid" ? (
        /* GRID VIEW */
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {filteredProducts.map((item) => {
            const isCompared = compareList.some((c) => (c._id || c.id) === (item._id || item.id));
            return (
              <ProductCard
                key={item._id || item.id}
                product={item}
                onSelectProduct={onSelectProduct}
                onAddToCart={onAddToCart}
                onToggleCompare={onToggleCompare}
                isCompared={isCompared}
              />
            );
          })}
        </div>
      ) : (
        /* SPEC TABLE VIEW */
        <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto shadow-xs">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 bg-slate-50">
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[10px]">Product & Model</th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[10px]">Category</th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[10px]">Rating</th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[10px]">Key Feature</th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[10px]">Price</th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[10px] text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((item) => {
                const outOfStock = isOutOfStock(item);
                const isCompared = compareList.some((c) => (c._id || c.id) === (item._id || item.id));
                return (
                  <tr
                    key={item._id || item.id}
                    onClick={() => onSelectProduct && onSelectProduct(item)}
                    className="hover:bg-slate-50 transition cursor-pointer group"
                  >
                    {/* Model & Thumb */}
                    <td className="py-3 px-4 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-white flex-shrink-0 border border-slate-100 p-1 flex items-center justify-center">
                        <img
                          src={getProductImage(item, item.image)}
                          alt={item.name}
                          className="max-h-full max-w-full object-contain group-hover:scale-110 transition duration-300"
                        />
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 group-hover:text-sky-600 block line-clamp-1">
                          {item.name}
                        </span>
                        <div className="flex items-center gap-1 text-slate-500 text-[10px]">
                          <Star size={10} className="text-amber-400 fill-amber-400" />
                          <span>{item.rating || 5.0}</span>
                          {item.badge && (
                            <span className="text-slate-400 ml-1">
                              • {item.badge}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 text-slate-600 text-[11px]">
                      {item.category}
                    </td>

                    {/* Rating */}
                    <td className="py-3 px-4 text-slate-700 font-semibold text-[11px]">
                      ★ {item.rating || "4.9"}
                    </td>

                    {/* Key Feature */}
                    <td className="py-3 px-4 text-slate-600 text-[11px]">
                      {item.driverSize || item.ancDb || "OEM Certified"}
                    </td>

                    {/* Pricing */}
                    <td className="py-3 px-4 font-black text-slate-900 text-sm">
                      ${Number(item.price).toFixed(2)}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right space-x-2">
                      {onToggleCompare && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleCompare(item);
                          }}
                          className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-bold transition cursor-pointer ${
                            isCompared
                              ? "bg-slate-900 text-white border-slate-900"
                              : "bg-white text-slate-700 border-slate-200 hover:border-slate-400"
                          }`}
                        >
                          {isCompared ? "Compared" : "Compare"}
                        </button>
                      )}

                      {outOfStock ? (
                        <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-md">
                          Sold Out
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart(item);
                          }}
                          className="px-3 py-1.5 bg-[#EAB308] hover:bg-yellow-500 text-slate-950 rounded-lg text-xs font-bold transition cursor-pointer shadow-xs"
                        >
                          + Add
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
