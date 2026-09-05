import React, { useState, useMemo } from "react";
import {
  Search,
  SlidersHorizontal,
  Grid,
  List,
  Filter,
  X,
  Briefcase,
  Award,
  Sparkles,
  ArrowUpDown,
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
  onOpenMonogram,
  searchQuery = "",
  setSearchQuery,
  selectedCategory = "all",
  setSelectedCategory,
}) {
  const [selectedLeather, setSelectedLeather] = useState("all");
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "table"
  const [sortBy, setSortBy] = useState("featured");
  const [laptopOnly, setLaptopOnly] = useState(false);

  const categories = [
    "all",
    "Briefcases",
    "Weekenders & Duffels",
    "Totes",
    "Backpacks",
    "Accessories",
  ];

  const leathers = [
    "all",
    "Vachetta Tan",
    "Cognac Brown",
    "Obsidian Black",
    "Heritage Olive",
  ];

  // Filtering
  const filteredProducts = useMemo(() => {
    return products
      .filter((item) => {
        // Category
        if (selectedCategory !== "all") {
          const cat = (item.category || "").toLowerCase();
          const name = (item.name || "").toLowerCase();
          const filter = selectedCategory.toLowerCase();
          if (!cat.includes(filter) && !name.includes(filter)) return false;
        }

        // Leather finish
        if (selectedLeather !== "all") {
          const l = (item.leather || "").toLowerCase();
          if (!l.includes(selectedLeather.toLowerCase())) return false;
        }

        // Laptop only
        if (laptopOnly) {
          const cap = (item.capacity || "").toLowerCase();
          const desc = (item.description || "").toLowerCase();
          if (!cap.includes("laptop") && !desc.includes("laptop") && !cap.includes("macbook")) {
            return false;
          }
        }

        // Search Query
        if (searchQuery && searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = (item.name || "").toLowerCase().includes(q);
          const matchDesc = (item.description || "").toLowerCase().includes(q);
          const matchLeather = (item.leather || "").toLowerCase().includes(q);
          if (!matchName && !matchDesc && !matchLeather) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return (Number(a.price) || 0) - (Number(b.price) || 0);
        if (sortBy === "price-desc") return (Number(b.price) || 0) - (Number(a.price) || 0);
        if (sortBy === "rating") return (b.rating || 5) - (a.rating || 5);
        return 0;
      });
  }, [products, selectedCategory, selectedLeather, laptopOnly, searchQuery, sortBy]);

  const activeFilterCount =
    (selectedCategory !== "all" ? 1 : 0) +
    (selectedLeather !== "all" ? 1 : 0) +
    (laptopOnly ? 1 : 0) +
    (searchQuery ? 1 : 0);

  const resetFilters = () => {
    setSelectedCategory("all");
    setSelectedLeather("all");
    setLaptopOnly(false);
    if (setSearchQuery) setSearchQuery("");
    setSortBy("featured");
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 text-left">
      {/* Header & Editorial Intro */}
      <div className="space-y-4 border-b border-[#E7DFD5] pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFE9DF] border border-[#D5C7B8] text-[#2C1810] text-xs font-serif font-semibold mb-2">
              <Award size={13} className="text-[#B45309]" />
              <span>Florentine Handcrafted Leather Collection</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-black text-[#2C1810] tracking-tight">
              Leather Silhouettes & Travel Carry
            </h1>
            <p className="text-sm text-[#6B5344] mt-1 max-w-2xl font-sans">
              Cut from uncorrected vegetable-tanned hides that age with a rich personal patina. Each piece is hand-burnished and stitched for a lifetime of journeying.
            </p>
          </div>

          {/* View Mode Toggle & Total Count */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#8C6D58] font-serif">
              Displaying <strong className="text-[#2C1810]">{filteredProducts.length}</strong> handcrafted designs
            </span>

            <div className="flex items-center bg-[#FAF7F2] rounded-xl p-1 border border-[#E7DFD5]">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                title="Atelier Grid"
                className={`p-2 rounded-lg text-xs font-serif transition cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-[#2C1810] text-white shadow-sm"
                    : "text-[#8C6D58] hover:text-[#2C1810]"
                }`}
              >
                <Grid size={15} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("table")}
                title="Leather Dimension Table"
                className={`p-2 rounded-lg text-xs font-serif transition cursor-pointer ${
                  viewMode === "table"
                    ? "bg-[#2C1810] text-white shadow-sm"
                    : "text-[#8C6D58] hover:text-[#2C1810]"
                }`}
              >
                <List size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-4">
          {/* Search Input */}
          <div className="md:col-span-4 relative">
            <input
              type="text"
              placeholder="Search by silhouette, leather, strap..."
              value={searchQuery}
              onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
              className="w-full bg-white text-xs text-[#2C1810] placeholder-[#A08C7D] pl-9 pr-8 py-2.5 rounded-xl border border-[#D8CCBD] focus:border-[#8C6D58] focus:outline-none transition shadow-inner font-sans"
            />
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8C6D58]" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery && setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C6D58] hover:text-[#2C1810]"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Silhouette Categories */}
          <div className="md:col-span-5 flex flex-wrap gap-1.5 items-center">
            {categories.map((c) => {
              const isSelected = selectedCategory.toLowerCase() === c.toLowerCase();
              return (
                <button
                  key={c}
                  onClick={() => setSelectedCategory(c)}
                  className={`px-3 py-2 rounded-xl text-xs font-serif font-bold transition cursor-pointer border ${
                    isSelected
                      ? "bg-[#2C1810] text-white border-[#2C1810] shadow-sm"
                      : "bg-[#FAF7F2] text-[#6B5344] hover:text-[#2C1810] border-[#E7DFD5] hover:bg-[#F3EDE3]"
                  }`}
                >
                  {c === "all" ? "All Silhouettes" : c}
                </button>
              );
            })}
          </div>

          {/* Sort Selector */}
          <div className="md:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-white text-xs text-[#2C1810] px-3 py-2.5 rounded-xl border border-[#D8CCBD] focus:border-[#8C6D58] focus:outline-none cursor-pointer font-serif"
            >
              <option value="featured">Sort: Featured Heritage</option>
              <option value="price-asc">Sort: Price (Low to High)</option>
              <option value="price-desc">Sort: Price (High to Low)</option>
              <option value="rating">Sort: Master Artisan Rating</option>
            </select>
          </div>
        </div>

        {/* Sub-Filters: Leather Swatches & Laptop Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-serif font-bold text-[#8C6D58] uppercase tracking-wider">
              Tuscan Leather Finish:
            </span>
            {leathers.map((l) => (
              <button
                key={l}
                onClick={() => setSelectedLeather(l)}
                className={`px-2.5 py-1 rounded-lg text-xs font-serif transition cursor-pointer border ${
                  selectedLeather === l
                    ? "bg-[#EFE9DF] text-[#2C1810] border-[#8C6D58] font-bold"
                    : "bg-white text-[#6B5344] border-[#E7DFD5] hover:bg-[#FAF7F2]"
                }`}
              >
                {l === "all" ? "All Hides" : l}
              </button>
            ))}

            <label className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-[#E7DFD5] text-xs font-serif text-[#2C1810] cursor-pointer select-none ml-2">
              <input
                type="checkbox"
                checked={laptopOnly}
                onChange={(e) => setLaptopOnly(e.target.checked)}
                className="accent-[#B45309] rounded"
              />
              <span>Laptop Sleeve Dedicated</span>
            </label>
          </div>

          {activeFilterCount > 0 && (
            <button
              onClick={resetFilters}
              className="text-xs text-[#991B1B] hover:underline font-serif font-bold flex items-center gap-1 cursor-pointer"
            >
              <X size={13} />
              <span>Reset Atelier Filters ({activeFilterCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* Content Rendering */}
      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center space-y-4 bg-white rounded-3xl border border-[#E7DFD5]">
          <Briefcase size={40} className="mx-auto text-[#8C6D58]" />
          <h3 className="text-lg font-serif font-bold text-[#2C1810]">
            No leather silhouettes match your current criteria
          </h3>
          <p className="text-xs text-[#6B5344] max-w-sm mx-auto font-sans">
            Try adjusting your hide finish, clearing the laptop filter, or exploring all silhouettes.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-xl bg-[#2C1810] text-white text-xs font-serif font-bold hover:bg-[#3D2217] transition cursor-pointer"
          >
            Show All Leather Designs
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
              onOpenMonogram={onOpenMonogram}
            />
          ))}
        </div>
      ) : (
        /* TABLE LIST VIEW */
        <div className="bg-white rounded-3xl border border-[#E7DFD5] overflow-x-auto shadow-sm">
          <table className="w-full text-xs text-left font-serif">
            <thead>
              <tr className="border-b border-[#E7DFD5] text-[#8C6D58] bg-[#FAF7F2]">
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[10px]">Silhouette</th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[10px]">Leather Origin</th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[10px]">Compartments / Laptop</th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[10px]">Hardware</th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[10px]">Price</th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[10px] text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFE9DF]">
              {filteredProducts.map((item) => {
                const outOfStock = isOutOfStock(item);
                return (
                  <tr
                    key={item._id}
                    onClick={() => onSelectProduct && onSelectProduct(item)}
                    className="hover:bg-[#FAF7F2] transition cursor-pointer group"
                  >
                    <td className="py-3 px-4 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#FAF7F2] flex-shrink-0 border border-[#E7DFD5]">
                        <img
                          src={getProductImage(item, item.image)}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                        />
                      </div>
                      <div>
                        <span className="font-bold text-[#2C1810] group-hover:text-[#B45309] block">
                          {item.name}
                        </span>
                        <span className="text-[10px] text-[#8C6D58]">
                          {item.leather || "Vegetable-Tanned Vachetta"}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-[#6B5344]">
                      Tuscany, Italy (6oz Hide)
                    </td>

                    <td className="py-3 px-4 text-[#2C1810] font-medium">
                      {item.capacity || "Fits 16\" Laptop + 24L"}
                    </td>

                    <td className="py-3 px-4 text-[#6B5344]">
                      Solid Cast Antique Brass
                    </td>

                    <td className="py-3 px-4 font-bold text-sm text-[#2C1810]">
                      ₹{Number(item.price).toFixed(2)}
                    </td>

                    <td className="py-3 px-4 text-right">
                      {outOfStock ? (
                        <span className="text-[10px] font-bold text-[#991B1B] bg-[#FEE2E2] px-2.5 py-1 rounded-md">
                          Backorder
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart(item);
                          }}
                          className="px-3 py-1.5 bg-[#2C1810] hover:bg-[#3D2217] text-[#FAF7F2] rounded-lg text-xs font-bold transition cursor-pointer shadow"
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
