import React, { useState, useMemo } from "react";
import {
  Search,
  SlidersHorizontal,
  Grid,
  List,
  Filter,
  X,
  BookOpen,
  Bookmark,
  Award,
  Clock,
  Coffee,
  Star,
} from "lucide-react";
import ProductCard from "./ProductCard";
import { getProductImage } from "../../../utils/productImage";
import { isOutOfStock } from "../../../utils/stockUtils";

export default function Product({
  products = [],
  onSelectProduct,
  onAddToCart,
  onLookInside,
  searchQuery = "",
  setSearchQuery,
  selectedGenre = "all",
  setSelectedGenre,
}) {
  const [selectedFormat, setSelectedFormat] = useState("all");
  const [selectedMood, setSelectedMood] = useState("all");
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "table"
  const [sortBy, setSortBy] = useState("featured");

  const genres = [
    "all",
    "Literary Fiction",
    "Philosophy & Essays",
    "Speculative Fiction",
    "Poetry & Drama",
    "Rare & Signed",
  ];

  const moods = [
    "all",
    "Reflective & Lyrical",
    "Cerebral & Philosophical",
    "Engrossing & Sweeping",
  ];

  // Filtering
  const filteredProducts = useMemo(() => {
    return products
      .filter((item) => {
        // Genre
        if (selectedGenre !== "all") {
          const g = (item.genre || "").toLowerCase();
          const filter = selectedGenre.toLowerCase();
          if (!g.includes(filter)) return false;
        }

        // Format
        if (selectedFormat !== "all") {
          const f = (item.format || "").toLowerCase();
          if (!f.includes(selectedFormat.toLowerCase())) return false;
        }

        // Mood
        if (selectedMood !== "all") {
          const desc = (item.description || "").toLowerCase();
          const mood = selectedMood.toLowerCase();
          if (!desc.includes(mood.split(" ")[0])) {
            // soft match
          }
        }

        // Search Query
        if (searchQuery && searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = (item.name || "").toLowerCase().includes(q);
          const matchAuthor = (item.author || "").toLowerCase().includes(q);
          const matchGenre = (item.genre || "").toLowerCase().includes(q);
          const matchDesc = (item.description || "").toLowerCase().includes(q);
          if (!matchTitle && !matchAuthor && !matchGenre && !matchDesc) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return (Number(a.price) || 0) - (Number(b.price) || 0);
        if (sortBy === "price-desc") return (Number(b.price) || 0) - (Number(a.price) || 0);
        if (sortBy === "pages") return (Number(b.pages) || 0) - (Number(a.pages) || 0);
        if (sortBy === "rating") return (b.rating || 5) - (a.rating || 5);
        return 0;
      });
  }, [products, selectedGenre, selectedFormat, selectedMood, searchQuery, sortBy]);

  const activeFilterCount =
    (selectedGenre !== "all" ? 1 : 0) +
    (selectedFormat !== "all" ? 1 : 0) +
    (searchQuery ? 1 : 0);

  const resetFilters = () => {
    setSelectedGenre("all");
    setSelectedFormat("all");
    setSelectedMood("all");
    if (setSearchQuery) setSearchQuery("");
    setSortBy("featured");
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 text-left font-serif">
      {/* Header */}
      <div className="space-y-4 border-b border-[#E7DFD5] pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFE9DF] border border-[#D5C7B8] text-[#1C1917] text-xs font-semibold mb-2">
              <BookOpen size={13} className="text-[#9A3412]" />
              <span>The Curated Library & Rare Books Stacks</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-[#1C1917] tracking-tight">
              Literary Stacks & Archival Press
            </h1>
            <p className="text-sm text-[#574B40] mt-1 max-w-2xl font-sans">
              Handpicked titles printed on 100% acid-free paper with Smyth-sewn binding and deckled edges. Designed for intimate reading hours and permanent shelf longevity.
            </p>
          </div>

          {/* View Mode & Count */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#78350F]">
              Shelved <strong className="text-[#1C1917]">{filteredProducts.length}</strong> literary volumes
            </span>

            <div className="flex items-center bg-[#FAF7F2] rounded-xl p-1 border border-[#E7DFD5]">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                title="Book Cover Grid"
                className={`p-2 rounded-lg text-xs transition cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-[#1C1917] text-white shadow-sm"
                    : "text-[#78350F] hover:text-[#1C1917]"
                }`}
              >
                <Grid size={15} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("table")}
                title="Library Card Table View"
                className={`p-2 rounded-lg text-xs transition cursor-pointer ${
                  viewMode === "table"
                    ? "bg-[#1C1917] text-white shadow-sm"
                    : "text-[#78350F] hover:text-[#1C1917]"
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
              placeholder="Search by title, author, essayist..."
              value={searchQuery}
              onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
              className="w-full bg-white text-xs text-[#1C1917] placeholder-[#8C7A6B] pl-9 pr-8 py-2.5 rounded-xl border border-[#D8CCBD] focus:border-[#9A3412] focus:outline-none transition shadow-inner font-sans"
            />
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#78350F]" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery && setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#78350F] hover:text-[#1C1917]"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Genre Category Pills */}
          <div className="md:col-span-5 flex flex-wrap gap-1.5 items-center">
            {genres.map((g) => {
              const isSelected = selectedGenre.toLowerCase() === g.toLowerCase();
              return (
                <button
                  key={g}
                  onClick={() => setSelectedGenre(g)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
                    isSelected
                      ? "bg-[#1C1917] text-white border-[#1C1917] shadow-sm"
                      : "bg-[#FAF7F2] text-[#574B40] hover:text-[#1C1917] border-[#E7DFD5] hover:bg-[#F3EDE3]"
                  }`}
                >
                  {g === "all" ? "All Stacks" : g}
                </button>
              );
            })}
          </div>

          {/* Sort Selector */}
          <div className="md:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-white text-xs text-[#1C1917] px-3 py-2.5 rounded-xl border border-[#D8CCBD] focus:border-[#9A3412] focus:outline-none cursor-pointer"
            >
              <option value="featured">Sort: Featured Staff Picks</option>
              <option value="price-asc">Sort: Price (Low to High)</option>
              <option value="price-desc">Sort: Price (High to Low)</option>
              <option value="pages">Sort: Length / Page Count</option>
              <option value="rating">Sort: Literary Acclaim</option>
            </select>
          </div>
        </div>

        {/* Sub-Filters: Format Switch */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-[#78350F] uppercase tracking-wider">
              Edition Format:
            </span>
            {["all", "Hardcover", "Paperback", "Signed"].map((fmt) => (
              <button
                key={fmt}
                onClick={() => setSelectedFormat(fmt)}
                className={`px-2.5 py-1 rounded-lg text-xs transition cursor-pointer border ${
                  selectedFormat === fmt
                    ? "bg-[#EFE9DF] text-[#1C1917] border-[#78350F] font-bold"
                    : "bg-white text-[#574B40] border-[#E7DFD5] hover:bg-[#FAF7F2]"
                }`}
              >
                {fmt === "all" ? "All Formats" : fmt}
              </button>
            ))}
          </div>

          {activeFilterCount > 0 && (
            <button
              onClick={resetFilters}
              className="text-xs text-[#991B1B] hover:underline font-bold flex items-center gap-1 cursor-pointer"
            >
              <X size={13} />
              <span>Clear Stack Filters ({activeFilterCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* Content Rendering */}
      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center space-y-4 bg-white rounded-3xl border border-[#E7DFD5]">
          <BookOpen size={40} className="mx-auto text-[#78350F]" />
          <h3 className="text-lg font-bold text-[#1C1917]">
            No volumes found in this stack
          </h3>
          <p className="text-xs text-[#574B40] max-w-sm mx-auto font-sans">
            Try choosing a different genre, exploring all formats, or searching by author name.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-xl bg-[#1C1917] text-white text-xs font-bold hover:bg-[#292524] transition cursor-pointer"
          >
            Browse All Volumes
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
              onLookInside={onLookInside}
            />
          ))}
        </div>
      ) : (
        /* TABLE LIST VIEW */
        <div className="bg-white rounded-3xl border border-[#E7DFD5] overflow-x-auto shadow-sm">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[#E7DFD5] text-[#78350F] bg-[#FAF7F2]">
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[10px]">Volume & Cover</th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[10px]">Author / Translator</th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[10px]">Genre</th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[10px]">Page Count</th>
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
                      <div className="w-10 h-14 rounded-lg overflow-hidden bg-[#FAF7F2] flex-shrink-0 border border-[#E7DFD5] shadow-xs">
                        <img
                          src={getProductImage(item, item.image)}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                        />
                      </div>
                      <div>
                        <span className="font-bold text-[#1C1917] group-hover:text-[#9A3412] block">
                          {item.name}
                        </span>
                        <span className="text-[10px] text-[#78350F]">
                          {item.format || "Clothbound Hardcover"}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-[#574B40] italic">
                      {item.author || "Staff Writer"}
                    </td>

                    <td className="py-3 px-4 text-[#1C1917]">
                      {item.genre || "Literary Fiction"}
                    </td>

                    <td className="py-3 px-4 text-[#574B40] font-sans">
                      {item.pages || 412} pgs
                    </td>

                    <td className="py-3 px-4 font-bold text-sm text-[#1C1917]">
                      ₹{Number(item.price).toFixed(2)}
                    </td>

                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onLookInside) onLookInside(item);
                        }}
                        className="px-2.5 py-1.5 rounded-lg border border-[#D5C7B8] text-[11px] text-[#78350F] hover:bg-[#FAF7F2] transition cursor-pointer"
                      >
                        Look Inside
                      </button>

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
                          className="px-3 py-1.5 bg-[#1C1917] hover:bg-[#292524] text-[#FAF7F2] rounded-lg text-xs font-bold transition cursor-pointer shadow"
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
