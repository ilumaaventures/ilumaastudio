import React, { useState, useMemo } from "react";
import {
  Search,
  SlidersHorizontal,
  Grid,
  List,
  Filter,
  X,
  Gem,
  Award,
  Sparkles,
  ShieldCheck,
  Star,
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
  const [selectedMetal, setSelectedMetal] = useState("all");
  const [selectedCut, setSelectedCut] = useState("all");
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "table"
  const [sortBy, setSortBy] = useState("featured");

  const categories = [
    "all",
    "Solitaire Rings",
    "Diamond Necklaces",
    "Fine Earrings",
    "Bracelets & Baffles",
  ];

  const metals = [
    "all",
    "18k Yellow Gold",
    "18k White Gold",
    "Platinum 950",
  ];

  const cuts = [
    "all",
    "Brilliant Round",
    "Oval Cut",
    "Emerald Cut",
    "Cushion Cut",
  ];

  // Filtering
  const filteredProducts = useMemo(() => {
    return products
      .filter((item) => {
        // Category
        if (selectedCategory !== "all") {
          const cat = (item.category || "").toLowerCase();
          const filter = selectedCategory.toLowerCase();
          if (!cat.includes(filter)) return false;
        }

        // Metal
        if (selectedMetal !== "all") {
          const m = (item.metal || "").toLowerCase();
          if (!m.includes(selectedMetal.toLowerCase())) return false;
        }

        // Cut
        if (selectedCut !== "all") {
          const c = (item.cut || "").toLowerCase();
          if (!c.includes(selectedCut.toLowerCase())) return false;
        }

        // Search Query
        if (searchQuery && searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = (item.name || "").toLowerCase().includes(q);
          const matchDesc = (item.description || "").toLowerCase().includes(q);
          const matchCat = (item.category || "").toLowerCase().includes(q);
          if (!matchName && !matchDesc && !matchCat) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return (Number(a.price) || 0) - (Number(b.price) || 0);
        if (sortBy === "price-desc") return (Number(b.price) || 0) - (Number(a.price) || 0);
        if (sortBy === "carat") return (Number(b.carat) || 0) - (Number(a.carat) || 0);
        if (sortBy === "rating") return (b.rating || 5) - (a.rating || 5);
        return 0;
      });
  }, [products, selectedCategory, selectedMetal, selectedCut, searchQuery, sortBy]);

  const activeFilterCount =
    (selectedCategory !== "all" ? 1 : 0) +
    (selectedMetal !== "all" ? 1 : 0) +
    (selectedCut !== "all" ? 1 : 0) +
    (searchQuery ? 1 : 0);

  const resetFilters = () => {
    setSelectedCategory("all");
    setSelectedMetal("all");
    setSelectedCut("all");
    if (setSearchQuery) setSearchQuery("");
    setSortBy("featured");
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 text-left font-serif">
      {/* Header */}
      <div className="space-y-4 border-b border-[#D4AF37]/25 pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1C1812] border border-[#D4AF37]/40 text-[#FBBF24] text-xs font-sans font-semibold mb-2">
              <Gem size={13} className="text-[#D4AF37]" />
              <span>Geneva High Jewelry Vault & Rare Solitaires</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-[#FAFAFA] tracking-tight">
              Haute Joaillerie & Solitaire Collections
            </h1>
            <p className="text-sm text-[#A89F91] mt-1 max-w-2xl font-sans">
              Individually certified by the Gemological Institute of America (GIA). Hand-set by master jewelers on the Place de la Fusterie, Geneva.
            </p>
          </div>

          {/* View Mode & Count */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#D4AF37] font-sans">
              Displaying <strong className="text-[#FAFAFA]">{filteredProducts.length}</strong> master creations
            </span>

            <div className="flex items-center bg-[#141418] rounded-xl p-1 border border-[#D4AF37]/30">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                title="Jewel Box Grid"
                className={`p-2 rounded-lg text-xs transition cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-[#D4AF37] text-[#0A0A0C] font-black shadow-sm"
                    : "text-[#A89F91] hover:text-white"
                }`}
              >
                <Grid size={15} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("table")}
                title="Gemological Table"
                className={`p-2 rounded-lg text-xs transition cursor-pointer ${
                  viewMode === "table"
                    ? "bg-[#D4AF37] text-[#0A0A0C] font-black shadow-sm"
                    : "text-[#A89F91] hover:text-white"
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
              placeholder="Search solitaire, sapphire, emerald cut..."
              value={searchQuery}
              onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
              className="w-full bg-[#141418] text-xs text-[#FAFAFA] placeholder-[#6E685E] pl-9 pr-8 py-2.5 rounded-xl border border-[#D4AF37]/30 focus:border-[#FBBF24] focus:outline-none transition shadow-inner font-sans"
            />
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#D4AF37]" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery && setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#D4AF37] hover:text-white"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Category Pills */}
          <div className="md:col-span-5 flex flex-wrap gap-1.5 items-center">
            {categories.map((c) => {
              const isSelected = selectedCategory.toLowerCase() === c.toLowerCase();
              return (
                <button
                  key={c}
                  onClick={() => setSelectedCategory(c)}
                  className={`px-3 py-2 rounded-xl text-xs font-sans font-bold transition cursor-pointer border ${
                    isSelected
                      ? "bg-[#D4AF37] text-[#0A0A0C] border-[#D4AF37] shadow-sm"
                      : "bg-[#141418] text-[#A89F91] hover:text-[#FAFAFA] border-[#D4AF37]/25 hover:bg-[#1C1812]"
                  }`}
                >
                  {c === "all" ? "All Vault" : c}
                </button>
              );
            })}
          </div>

          {/* Sort Selector */}
          <div className="md:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-[#141418] text-xs text-[#FAFAFA] px-3 py-2.5 rounded-xl border border-[#D4AF37]/30 focus:border-[#FBBF24] focus:outline-none cursor-pointer font-sans"
            >
              <option value="featured">Sort: Featured Jewels</option>
              <option value="price-asc">Sort: Price (Low to High)</option>
              <option value="price-desc">Sort: Price (High to Low)</option>
              <option value="carat">Sort: Carat Weight</option>
              <option value="rating">Sort: Client Rating</option>
            </select>
          </div>
        </div>

        {/* Sub-Filters: Cuts & Metals */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-sans font-bold text-[#D4AF37] uppercase tracking-wider">
              Gemstone Cut:
            </span>
            {cuts.map((cut) => (
              <button
                key={cut}
                onClick={() => setSelectedCut(cut)}
                className={`px-2.5 py-1 rounded-lg text-xs font-sans transition cursor-pointer border ${
                  selectedCut === cut
                    ? "bg-[#1C1812] text-[#FBBF24] border-[#D4AF37] font-bold"
                    : "bg-[#0E0E12] text-[#A89F91] border-[#333] hover:text-white"
                }`}
              >
                {cut === "all" ? "All Cuts" : cut}
              </button>
            ))}
          </div>

          {activeFilterCount > 0 && (
            <button
              onClick={resetFilters}
              className="text-xs text-[#F87171] hover:underline font-sans font-bold flex items-center gap-1 cursor-pointer"
            >
              <X size={13} />
              <span>Reset Vault Filters ({activeFilterCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center space-y-4 bg-[#0E0E12] rounded-3xl border border-[#D4AF37]/25">
          <Gem size={40} className="mx-auto text-[#D4AF37]" />
          <h3 className="text-lg font-serif font-bold text-[#FAFAFA]">
            No jewels match your current specifications
          </h3>
          <p className="text-xs text-[#A89F91] max-w-sm mx-auto font-sans">
            Try adjusting your metal alloy, clearing the diamond cut filter, or requesting a bespoke consultation.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-xl bg-[#D4AF37] text-[#0A0A0C] text-xs font-bold hover:bg-[#E5C158] transition cursor-pointer"
          >
            Display All Treasures
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
        /* TABLE LIST VIEW */
        <div className="bg-[#0E0E12] rounded-3xl border border-[#D4AF37]/25 overflow-x-auto shadow-2xl">
          <table className="w-full text-xs text-left font-serif">
            <thead>
              <tr className="border-b border-[#D4AF37]/20 text-[#D4AF37] bg-[#141418]">
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[10px]">Creation & Gemstone</th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[10px]">Diamond Carat</th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[10px]">Precious Alloy</th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[10px]">Cut & Grade</th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[10px]">Valuation</th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[10px] text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1D1D24]">
              {filteredProducts.map((item) => {
                const outOfStock = isOutOfStock(item);
                return (
                  <tr
                    key={item._id}
                    onClick={() => onSelectProduct && onSelectProduct(item)}
                    className="hover:bg-[#141418] transition cursor-pointer group"
                  >
                    <td className="py-3 px-4 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#070709] flex-shrink-0 border border-[#D4AF37]/20">
                        <img
                          src={getProductImage(item, item.image)}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                        />
                      </div>
                      <div>
                        <span className="font-bold text-[#FAFAFA] group-hover:text-[#FBBF24] block">
                          {item.name}
                        </span>
                        <span className="text-[10px] text-[#D4AF37]">
                          {item.category || "High Jewelry"}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-[#FBBF24] font-bold font-sans">
                      {item.carat ? `${item.carat} Carat` : "Hand-Set Solitaire"}
                    </td>

                    <td className="py-3 px-4 text-[#A89F91] font-sans">
                      18k Yellow Gold / Platinum 950
                    </td>

                    <td className="py-3 px-4 text-[#A89F91] font-sans">
                      {item.cut || "Triple Excellent • GIA"}
                    </td>

                    <td className="py-3 px-4 font-bold text-sm text-[#FBBF24] font-sans">
                      ₹{Number(item.price).toFixed(2)}
                    </td>

                    <td className="py-3 px-4 text-right">
                      {outOfStock ? (
                        <span className="text-[10px] font-bold text-[#F87171] bg-[#450A0A] px-2.5 py-1 rounded-md">
                          Acquired
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart(item);
                          }}
                          className="px-3 py-1.5 bg-[#D4AF37] hover:bg-[#E5C158] text-[#0A0A0C] rounded-lg text-xs font-bold transition cursor-pointer shadow"
                        >
                          + Acquire
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
