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
  const [sortBy, setSortBy] = useState("featured"); // "featured" | "price-asc" | "price-desc" | "rating" | "battery"
  const [inStockOnly, setInStockOnly] = useState(false);
  const [filterSpec, setFilterSpec] = useState("all"); // "all" | "anc" | "long-battery" | "low-latency"

  const categories = [
    "all",
    "Pro Audio & ANC",
    "Smart Wearables",
    "Peripherals",
    "Creator Studio",
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
          const matchDriver = (item.driverSize || "").toLowerCase().includes(q);
          const matchCodecs = (item.codecs || "").toLowerCase().includes(q);
          if (!matchName && !matchCat && !matchDesc && !matchDriver && !matchCodecs) {
            return false;
          }
        }

        // In stock
        if (inStockOnly && isOutOfStock(item)) {
          return false;
        }

        // Filter Spec
        if (filterSpec === "anc") {
          const anc = (item.ancDb || "").toLowerCase();
          if (!anc.includes("anc") && !anc.includes("db") && !anc.includes("isolation")) {
            return false;
          }
        } else if (filterSpec === "long-battery") {
          if (!item.batteryLifeHours || item.batteryLifeHours < 40) {
            return false;
          }
        } else if (filterSpec === "low-latency") {
          const codecs = (item.codecs || "").toLowerCase();
          if (!codecs.includes("8000hz") && !codecs.includes("wireless") && !codecs.includes("2.4ghz") && !codecs.includes("aptx")) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return (Number(a.price) || 0) - (Number(b.price) || 0);
        if (sortBy === "price-desc") return (Number(b.price) || 0) - (Number(a.price) || 0);
        if (sortBy === "rating") return (b.rating || 5) - (a.rating || 5);
        if (sortBy === "battery") return (b.batteryLifeHours || 0) - (a.batteryLifeHours || 0);
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
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 text-left">
      {/* Catalog Header & Breadcrumb */}
      <div className="space-y-4 border-b border-slate-800 pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-2">
              <Cpu size={13} className="text-cyan-400" />
              <span>Silicon & Acoustic Engineering Arsenal</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Hardware Specifications & Catalog
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Compare laboratory measurements, custom beryllium acoustic drivers, and real-world battery endurance.
            </p>
          </div>

          {/* View Mode Toggle & Total count */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-mono">
              Showing <strong className="text-white">{filteredProducts.length}</strong> of {products.length} models
            </span>

            <div className="flex items-center bg-slate-900 rounded-xl p-1 border border-slate-800">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                title="Grid View"
                className={`p-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-cyan-500 text-slate-950 font-black shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Grid size={15} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("table")}
                title="Engineering Spec Table View"
                className={`p-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                  viewMode === "table"
                    ? "bg-cyan-500 text-slate-950 font-black shadow-sm"
                    : "text-slate-400 hover:text-white"
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
              placeholder="Search model, driver size, codecs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 text-xs text-white placeholder-slate-500 pl-9 pr-8 py-2.5 rounded-xl border border-slate-700 focus:border-cyan-500 focus:outline-none transition shadow-inner"
            />
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery && setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
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
                      ? "bg-blue-600 text-white border-blue-500 shadow-sm"
                      : "bg-slate-900/80 text-slate-400 hover:text-slate-200 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  {c === "all" ? "All Arsenal" : c}
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
                className="w-full appearance-none bg-slate-900 text-xs text-slate-200 pl-3 pr-8 py-2.5 rounded-xl border border-slate-700 focus:border-cyan-500 focus:outline-none cursor-pointer"
              >
                <option value="featured">Sort: Featured Silicon</option>
                <option value="price-asc">Sort: Price (Lowest First)</option>
                <option value="price-desc">Sort: Price (Highest First)</option>
                <option value="rating">Sort: Customer Rating</option>
                <option value="battery">Sort: Battery Stamina</option>
              </select>
              <ArrowUpDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Technical Sub-Filters & Active Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Quick Spec:</span>
            {[
              { id: "all", label: "All Specs" },
              { id: "anc", label: "ANC / Isolation Only" },
              { id: "long-battery", label: "40h+ Ultra Stamina" },
              { id: "low-latency", label: "Ultra-Low Latency" },
            ].map((pill) => (
              <button
                key={pill.id}
                onClick={() => setFilterSpec(pill.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer border ${
                  filterSpec === pill.id
                    ? "bg-cyan-950 text-cyan-300 border-cyan-500/50"
                    : "bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-300"
                }`}
              >
                {pill.label}
              </button>
            ))}

            <label className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-300 font-semibold cursor-pointer select-none ml-1">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="accent-cyan-400 rounded"
              />
              <span>In-Stock Only</span>
            </label>
          </div>

          {activeFilterCount > 0 && (
            <button
              onClick={resetAllFilters}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-bold transition cursor-pointer"
            >
              <X size={13} />
              <span>Reset All Filters ({activeFilterCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* Floating Comparison Drawer Strip if items are selected */}
      {compareList && compareList.length > 0 && (
        <div className="sticky top-24 z-30 bg-gradient-to-r from-blue-950/90 via-slate-900/95 to-cyan-950/90 backdrop-blur-xl border border-cyan-500/40 p-3 sm:p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-xl animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={16} className="text-cyan-400" />
            <span className="text-xs font-bold text-white">
              Comparing <strong>{compareList.length}</strong> hardware models:
            </span>
            <div className="flex -space-x-2">
              {compareList.map((c) => (
                <span
                  key={c._id}
                  title={c.name}
                  className="inline-block bg-slate-800 text-[10px] text-cyan-300 font-bold px-2 py-0.5 rounded-full border border-cyan-500/30 truncate max-w-[120px]"
                >
                  {c.name.split(" ")[0]}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenCompareMatrix}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs cursor-pointer transition shadow-md"
            >
              Launch Side-by-Side Matrix
            </button>
          </div>
        </div>
      )}

      {/* Results Content */}
      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center space-y-4 bg-slate-900/50 rounded-3xl border border-slate-800">
          <Cpu size={40} className="mx-auto text-slate-600" />
          <h3 className="text-lg font-bold text-white">No hardware models match your filters</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search criteria, clearing the acoustic spec pills, or viewing all categories.
          </p>
          <button
            onClick={resetAllFilters}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 transition cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === "grid" ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((item) => {
            const isCompared = compareList.some((c) => c._id === item._id);
            return (
              <ProductCard
                key={item._id}
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
        /* ENGINEERING SPEC TABLE VIEW */
        <div className="bg-slate-900/90 rounded-3xl border border-slate-800 overflow-x-auto shadow-2xl">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/80">
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[10px]">Model & Specs</th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[10px]">Category</th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[10px]">Core Architecture</th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[10px]">Acoustic Isolation</th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[10px]">Battery Stamina</th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[10px]">Pricing</th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[10px] text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredProducts.map((item) => {
                const outOfStock = isOutOfStock(item);
                const isCompared = compareList.some((c) => c._id === item._id);
                return (
                  <tr
                    key={item._id}
                    onClick={() => onSelectProduct && onSelectProduct(item)}
                    className="hover:bg-slate-800/50 transition cursor-pointer group"
                  >
                    {/* Model & Thumb */}
                    <td className="py-3 px-4 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-950 flex-shrink-0 border border-slate-800">
                        <img
                          src={getProductImage(item, item.image)}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                        />
                      </div>
                      <div>
                        <span className="font-bold text-white group-hover:text-cyan-300 block line-clamp-1">
                          {item.name}
                        </span>
                        <div className="flex items-center gap-1 text-slate-400 text-[10px]">
                          <Star size={10} className="text-amber-400 fill-amber-400" />
                          <span>{item.rating || 5.0}</span>
                          {item.badge && (
                            <span className="text-cyan-400 font-mono ml-1">
                              • {item.badge}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 text-slate-300 font-mono text-[11px]">
                      {item.category}
                    </td>

                    {/* Core Architecture */}
                    <td className="py-3 px-4 text-cyan-300 font-mono font-bold text-[11px]">
                      {item.driverSize || "N/A"}
                    </td>

                    {/* Isolation */}
                    <td className="py-3 px-4 text-slate-300 font-mono text-[11px]">
                      {item.ancDb || "Passive Seal"}
                    </td>

                    {/* Battery */}
                    <td className="py-3 px-4 text-emerald-400 font-mono font-bold text-[11px]">
                      {item.batteryLifeHours ? `${item.batteryLifeHours} Hours` : "Wired / AC"}
                    </td>

                    {/* Pricing */}
                    <td className="py-3 px-4 font-mono font-black text-white text-sm">
                      ₹{Number(item.price).toFixed(2)}
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
                              ? "bg-cyan-500 text-slate-950 border-cyan-400"
                              : "bg-slate-800 text-slate-300 border-slate-700 hover:border-cyan-400"
                          }`}
                        >
                          {isCompared ? "Compared" : "Compare"}
                        </button>
                      )}

                      {outOfStock ? (
                        <span className="text-[10px] font-bold text-rose-400 bg-rose-950/40 px-2 py-1 rounded-md">
                          Sold Out
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart(item);
                          }}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition cursor-pointer shadow"
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
