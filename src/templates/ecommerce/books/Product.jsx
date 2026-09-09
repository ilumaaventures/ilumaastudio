import React, { useState, useMemo } from "react";
import { ArrowLeft, ChevronDown, Check, X, Filter } from "lucide-react";
import ProductCard from "./ProductCard";

export default function Product({
  products = [],
  onSelectProduct,
  onAddToCart,
  onQuickView,
  onBackToHome,
  searchQuery = "",
  setSearchQuery,
  selectedCategory = "all",
  setSelectedCategory,
}) {
  // Sort State: "featured" | "price-asc" | "price-desc" | "discount" | "alpha"
  const [sortBy, setSortBy] = useState("featured");

  // Price Filter Ranges
  // Ranges: [0, 20], [20, 40], [40, 60], [60, 80], [80, 100]
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);

  const priceRanges = [
    { id: "0-20", label: "$0 - $20", min: 0, max: 20 },
    { id: "20-40", label: "$20 - $40", min: 20, max: 40 },
    { id: "40-60", label: "$40 - $60", min: 40, max: 60 },
    { id: "60-80", label: "$60 - $80", min: 60, max: 80 },
    { id: "80-100", label: "$80 - $100", min: 80, max: 100 },
  ];

  const togglePriceRange = (id) => {
    if (selectedPriceRanges.includes(id)) {
      setSelectedPriceRanges(selectedPriceRanges.filter((r) => r !== id));
    } else {
      setSelectedPriceRanges([...selectedPriceRanges, id]);
    }
  };

  const handleClearAll = () => {
    setSelectedPriceRanges([]);
    if (setSearchQuery) setSearchQuery("");
    if (setSelectedCategory) setSelectedCategory("all");
  };

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((item) => {
        const price = Number(item.price) || 0;

        // Price ranges filter
        if (selectedPriceRanges.length > 0) {
          const inAnyRange = selectedPriceRanges.some((rangeId) => {
            const range = priceRanges.find((r) => r.id === rangeId);
            if (!range) return false;
            return price >= range.min && price <= range.max;
          });
          if (!inAnyRange) return false;
        }

        // Search query
        if (searchQuery && searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = (item.name || "").toLowerCase().includes(q);
          const matchAuthor = (item.author || "").toLowerCase().includes(q);
          const matchDesc = (item.description || "").toLowerCase().includes(q);
          if (!matchTitle && !matchAuthor && !matchDesc) return false;
        }

        // Category filter
        if (selectedCategory && selectedCategory !== "all") {
          const itemCat = (item.category || "").toLowerCase();
          if (!itemCat.includes(selectedCategory.toLowerCase())) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const priceA = Number(a.price) || 0;
        const priceB = Number(b.price) || 0;
        if (sortBy === "price-asc") return priceA - priceB;
        if (sortBy === "price-desc") return priceB - priceA;
        if (sortBy === "discount") {
          return (b.discount || 0) - (a.discount || 0);
        }
        if (sortBy === "alpha") {
          return (a.name || "").localeCompare(b.name || "");
        }
        return 0; // default featured order
      });
  }, [products, selectedPriceRanges, searchQuery, selectedCategory, sortBy]);

  return (
    <div className="bg-[#FFFFFF] min-h-screen py-8 text-stone-900 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* ================= 1. TOP HEADER & BREADCRUMB ================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F3F4F6]">
          <div className="space-y-1 text-left">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onBackToHome}
                className="p-1 -ml-1 text-stone-700 hover:text-black hover:bg-stone-100 rounded-full transition cursor-pointer"
                title="Back to Home"
              >
                <ArrowLeft size={18} />
              </button>
              <h1 className="text-xl sm:text-2xl font-normal text-[#111827]">
                Digital Products{" "}
                <span className="text-sm font-normal text-stone-500">
                  ({filteredProducts.length} items)
                </span>
              </h1>
            </div>
            <p className="text-[11px] text-stone-400 pl-8">
              Home / Digital Products
            </p>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 self-start sm:self-center">
            <label htmlFor="sort-select" className="text-xs text-stone-500">
              Sort by:
            </label>
            <div className="relative">
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white text-xs text-stone-800 font-medium py-1.5 pl-3 pr-8 border border-stone-200 rounded-sm focus:outline-none focus:border-[#133E47] cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="discount">Highest Discount</option>
                <option value="alpha">Alphabetical A-Z</option>
              </select>
              <ChevronDown
                size={13}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-500 pointer-events-none"
              />
            </div>
          </div>
        </div>

        {/* ================= 2. MAIN 2-COLUMN LAYOUT ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ================= LEFT SIDEBAR (FILTERS) ================= */}
          <div className="lg:col-span-3">
            <div className="bg-white border border-[#E5E7EB] rounded-sm p-4 sm:p-5 space-y-4 text-left shadow-2xs">
              {/* Header: Filters + Clear All */}
              <div className="flex items-center justify-between pb-3 border-b border-[#F3F4F6]">
                <h3 className="text-sm font-medium text-stone-900">Filters</h3>
                {(selectedPriceRanges.length > 0 ||
                  searchQuery ||
                  selectedCategory !== "all") && (
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="text-xs text-[#E11D48] hover:text-[#BE123C] font-medium transition cursor-pointer"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Price Filter Section */}
              <div className="space-y-3">
                <span className="text-xs font-medium text-stone-700 block">
                  Price
                </span>
                <div className="space-y-2.5">
                  {priceRanges.map((range) => {
                    const isChecked = selectedPriceRanges.includes(range.id);
                    return (
                      <label
                        key={range.id}
                        className="flex items-center gap-2.5 text-xs text-stone-600 hover:text-stone-900 cursor-pointer select-none"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => togglePriceRange(range.id)}
                          className="w-3.5 h-3.5 rounded-xs border-stone-300 text-[#133E47] focus:ring-0 cursor-pointer accent-[#133E47]"
                        />
                        <span>{range.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN (3-COLUMN PRODUCT GRID) ================= */}
          <div className="lg:col-span-9">
            {filteredProducts.length === 0 ? (
              <div className="py-20 text-center space-y-3 border border-dashed border-stone-200 rounded-sm">
                <p className="text-sm text-stone-500 font-medium">
                  No digital products match your selected filters.
                </p>
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="px-4 py-2 bg-[#133E47] text-white text-xs font-medium rounded-sm hover:bg-[#0E2D34] transition cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {filteredProducts.map((item) => (
                  <ProductCard
                    key={item._id}
                    product={item}
                    onSelectProduct={onSelectProduct}
                    onAddToCart={onAddToCart}
                    onQuickView={onQuickView}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
