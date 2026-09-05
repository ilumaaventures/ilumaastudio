import React, { useState, useMemo } from "react";
import {
  Search,
  SlidersHorizontal,
  Grid,
  List,
  Filter,
  X,
  Droplets,
  Sparkles,
  ShieldCheck,
  Star,
  Check,
} from "lucide-react";
import ProductCard from "./ProductCard";
import { getProductImage } from "../../../utils/productImage";
import { isOutOfStock } from "../../../utils/stockUtils";

export default function Product({
  products = [],
  onSelectProduct,
  onAddToCart,
  searchQuery = "",
  setSearchQuery,
  selectedCategory = "all",
  setSelectedCategory,
}) {
  const [selectedStep, setSelectedStep] = useState("all");
  const [selectedConcern, setSelectedConcern] = useState("all");
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "table"
  const [sortBy, setSortBy] = useState("featured");
  const [veganOnly, setVeganOnly] = useState(false);

  const steps = [
    { id: "all", label: "All Routine Steps" },
    { id: "cleanse", label: "Step 1: Cleanse" },
    { id: "tone", label: "Step 2: Tone & Mist" },
    { id: "treat", label: "Step 3: Treatment Serums" },
    { id: "moisturize", label: "Step 4: Moisturize" },
    { id: "protect", label: "Step 5: Sun Shield" },
  ];

  const concerns = [
    "all",
    "Deep Hydration",
    "Skin Barrier Repair",
    "Glow & Radiance",
    "Fine Lines & Firming",
  ];

  // Filtering
  const filteredProducts = useMemo(() => {
    return products
      .filter((item) => {
        // Step filter
        if (selectedStep !== "all") {
          const s = (item.step || "").toLowerCase();
          const n = (item.name || "").toLowerCase();
          if (!s.includes(selectedStep) && !n.includes(selectedStep)) return false;
        }

        // Concern filter
        if (selectedConcern !== "all") {
          const c = (item.concern || "").toLowerCase();
          const d = (item.description || "").toLowerCase();
          if (!c.includes(selectedConcern.toLowerCase()) && !d.includes(selectedConcern.toLowerCase())) {
            return false;
          }
        }

        // Search Query
        if (searchQuery && searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = (item.name || "").toLowerCase().includes(q);
          const matchDesc = (item.description || "").toLowerCase().includes(q);
          const matchIng = (item.activeIngredient || "").toLowerCase().includes(q);
          if (!matchName && !matchDesc && !matchIng) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return (Number(a.price) || 0) - (Number(b.price) || 0);
        if (sortBy === "price-desc") return (Number(b.price) || 0) - (Number(a.price) || 0);
        if (sortBy === "rating") return (b.rating || 5) - (a.rating || 5);
        return 0;
      });
  }, [products, selectedStep, selectedConcern, searchQuery, sortBy]);

  const activeFilterCount =
    (selectedStep !== "all" ? 1 : 0) +
    (selectedConcern !== "all" ? 1 : 0) +
    (veganOnly ? 1 : 0) +
    (searchQuery ? 1 : 0);

  const resetFilters = () => {
    setSelectedStep("all");
    setSelectedConcern("all");
    setVeganOnly(false);
    if (setSearchQuery) setSearchQuery("");
    setSortBy("featured");
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 text-left">
      {/* Header */}
      <div className="space-y-4 border-b border-rose-100 pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold mb-2">
              <Sparkles size={13} className="text-rose-500" />
              <span>Bio-Compatible Skincare Formulations</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-black text-rose-950 tracking-tight">
              Clinical Botanical Formulations
            </h1>
            <p className="text-sm text-rose-800/80 mt-1 max-w-2xl font-sans">
              Formulated with high-potency phyto-actives, multi-weight hyaluronic acid, and barrier-replenishing ceramides for luminous, calm skin.
            </p>
          </div>

          {/* View Mode & Count */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-rose-600 font-sans">
              Showing <strong className="text-rose-950">{filteredProducts.length}</strong> clean formulas
            </span>

            <div className="flex items-center bg-white rounded-xl p-1 border border-rose-200">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                title="Grid View"
                className={`p-2 rounded-lg text-xs transition cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-rose-500 text-white shadow-xs"
                    : "text-rose-400 hover:text-rose-700"
                }`}
              >
                <Grid size={15} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("table")}
                title="Ingredient Table View"
                className={`p-2 rounded-lg text-xs transition cursor-pointer ${
                  viewMode === "table"
                    ? "bg-rose-500 text-white shadow-xs"
                    : "text-rose-400 hover:text-rose-700"
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
              placeholder="Search by ingredient, concern, formula..."
              value={searchQuery}
              onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
              className="w-full bg-white text-xs text-rose-950 placeholder-rose-400 pl-9 pr-8 py-2.5 rounded-xl border border-rose-200 focus:border-rose-400 focus:outline-none transition shadow-inner font-sans"
            />
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-rose-400" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery && setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-rose-400 hover:text-rose-700"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Routine Step Pills */}
          <div className="md:col-span-5 flex flex-wrap gap-1.5 items-center">
            {steps.map((s) => {
              const isSelected = selectedStep === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setSelectedStep(s.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer border ${
                    isSelected
                      ? "bg-rose-500 text-white border-rose-500 shadow-xs"
                      : "bg-white text-rose-800 hover:bg-rose-50 border-rose-200"
                  }`}
                >
                  {s.label}
                </button>
              );
            })}
          </div>

          {/* Sort selector */}
          <div className="md:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-white text-xs text-rose-950 px-3 py-2.5 rounded-xl border border-rose-200 focus:border-rose-400 focus:outline-none cursor-pointer font-sans"
            >
              <option value="featured">Sort: Featured Formulations</option>
              <option value="price-asc">Sort: Price (Low to High)</option>
              <option value="price-desc">Sort: Price (High to Low)</option>
              <option value="rating">Sort: Clinical Rating</option>
            </select>
          </div>
        </div>

        {/* Sub-Filters: Concerns */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-rose-500 uppercase tracking-wider">
              Skin Concern:
            </span>
            {concerns.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedConcern(c)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer border ${
                  selectedConcern === c
                    ? "bg-rose-100 text-rose-950 border-rose-300 font-bold"
                    : "bg-white text-rose-700 border-rose-200 hover:bg-rose-50"
                }`}
              >
                {c === "all" ? "All Concerns" : c}
              </button>
            ))}
          </div>

          {activeFilterCount > 0 && (
            <button
              onClick={resetFilters}
              className="text-xs text-rose-600 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <X size={13} />
              <span>Reset Clean Filters ({activeFilterCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center space-y-4 bg-white rounded-3xl border border-rose-100">
          <Droplets size={40} className="mx-auto text-rose-300" />
          <h3 className="text-lg font-serif font-bold text-rose-950">
            No formulas match your current routine criteria
          </h3>
          <p className="text-xs text-rose-700 max-w-sm mx-auto font-sans">
            Try choosing a different step in your routine or resetting skin concern filters.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-xl bg-rose-500 text-white text-xs font-bold hover:bg-rose-600 transition cursor-pointer"
          >
            Show All Formulas
          </button>
        </div>
      ) : viewMode === "grid" ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((item) => (
            <ProductCard
              key={item._id}
              product={item}
              onSelectProduct={onSelectProduct}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      ) : (
        /* INGREDIENT TABLE VIEW */
        <div className="bg-white rounded-3xl border border-rose-100 overflow-x-auto shadow-sm">
          <table className="w-full text-xs text-left font-sans">
            <thead>
              <tr className="border-b border-rose-100 text-rose-600 bg-rose-50/60">
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[10px]">Formula Name</th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[10px]">Key Active Actives</th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[10px]">Routine Step</th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[10px]">Target Concern</th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[10px]">Price</th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[10px] text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rose-50">
              {filteredProducts.map((item) => {
                const outOfStock = isOutOfStock(item);
                return (
                  <tr
                    key={item._id}
                    onClick={() => onSelectProduct && onSelectProduct(item)}
                    className="hover:bg-rose-50/50 transition cursor-pointer group"
                  >
                    <td className="py-3 px-4 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-rose-50 flex-shrink-0 border border-rose-100">
                        <img
                          src={getProductImage(item, item.image)}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                        />
                      </div>
                      <div>
                        <span className="font-bold text-rose-950 group-hover:text-rose-600 block">
                          {item.name}
                        </span>
                        <span className="text-[10px] text-rose-500">
                          {item.category || "Active Botanical"}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-rose-900 font-medium">
                      {item.activeIngredient || "Multi-Molecular Hyaluronic 2%"}
                    </td>

                    <td className="py-3 px-4 text-rose-800">
                      {item.step || "Step 3: Treatment"}
                    </td>

                    <td className="py-3 px-4 text-rose-900">
                      {item.concern || "Hydration & Barrier Defense"}
                    </td>

                    <td className="py-3 px-4 font-bold text-sm text-rose-950">
                      ₹{Number(item.price).toFixed(2)}
                    </td>

                    <td className="py-3 px-4 text-right">
                      {outOfStock ? (
                        <span className="text-[10px] font-bold text-rose-500 bg-rose-50 px-2.5 py-1 rounded-md">
                          Waitlist
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart(item);
                          }}
                          className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-xs font-bold transition cursor-pointer shadow-xs"
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
