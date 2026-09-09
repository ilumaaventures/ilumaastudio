import React, { useState, useMemo } from "react";
import { SlidersHorizontal, Star, RotateCcw, X, ChevronDown, Check } from "lucide-react";
import ProductCard from "./ProductCard";

export default function ProductListing({
  products = [],
  selectedCategory = "all",
  onSelectCategory,
  onAddToCart,
  onQuickView,
  onSelectProduct,
}) {
  const [maxPrice, setMaxPrice] = useState(9999);
  const [minRating, setMinRating] = useState(0);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [activeCategory, setActiveCategory] = useState(selectedCategory || "all");
  const [sortBy, setSortBy] = useState("default");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync activeCategory with incoming prop
  React.useEffect(() => {
    if (selectedCategory) {
      setActiveCategory(selectedCategory);
    }
  }, [selectedCategory]);

  const categories = [
    { id: "all", name: "All Categories" },
    { id: "Bedroom", name: "Bedroom" },
    { id: "Dining Room", name: "Dining Room" },
    { id: "Living Room", name: "Living Room" },
    { id: "Luxury Collection", name: "Luxury Collection" },
    { id: "Office Furniture", name: "Office Furniture" },
    { id: "Home Storage", name: "Home Storage" },
    { id: "Outdoor", name: "Outdoor" },
  ];

  const brands = ["Casa Craft", "Nordic Haven", "Ashley", "Herman Miller", "West Elm"];

  const handleResetFilters = () => {
    setMaxPrice(9999);
    setMinRating(0);
    setSelectedBrands([]);
    setActiveCategory("all");
    onSelectCategory?.("all");
    setSortBy("default");
  };

  const toggleBrand = (brand) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category
        if (activeCategory !== "all") {
          const pCat = (p.category || "").toLowerCase();
          const target = activeCategory.toLowerCase();
          if (!pCat.includes(target) && target !== "all") return false;
        }

        // Price
        if (Number(p.price) > maxPrice) return false;

        // Rating
        if (minRating > 0 && (p.rating || 0) < minRating) return false;

        // Brand
        if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return Number(a.price) - Number(b.price);
        if (sortBy === "price-desc") return Number(b.price) - Number(a.price);
        if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
        return 0;
      });
  }, [products, activeCategory, maxPrice, minRating, selectedBrands, sortBy]);

  const renderSidebar = () => (
    <div className="space-y-8 text-left">
      {/* Title */}
      <div className="flex items-center gap-2 pb-3 border-b border-stone-200">
        <SlidersHorizontal size={18} className="text-stone-700" />
        <h2 className="text-base font-bold text-stone-900 tracking-tight">Filter By</h2>
      </div>

      {/* 1. Price Range */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-stone-900">Price Range</h3>
        <input
          type="range"
          min="0"
          max="9999"
          step="50"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-[#A07855] h-1.5 bg-stone-200 rounded-lg cursor-pointer"
        />
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs font-medium text-stone-600">
            $0 - ${maxPrice}
          </span>
          <button
            type="button"
            onClick={handleResetFilters}
            className="px-3 py-1 text-xs font-medium text-white bg-[#A07855] hover:bg-[#8d6645] rounded-full transition shadow-xs cursor-pointer"
          >
            Reset
          </button>
        </div>
      </div>

      {/* 2. Product Rating */}
      <div className="space-y-3 pt-2 border-t border-stone-100">
        <h3 className="text-sm font-semibold text-stone-900">Product rating</h3>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => {
            const isSelected = minRating === rating;
            return (
              <label
                key={rating}
                onClick={() => setMinRating(isSelected ? 0 : rating)}
                className="flex items-center gap-2.5 cursor-pointer group"
              >
                <input
                  type="radio"
                  name="rating"
                  checked={isSelected}
                  onChange={() => {}}
                  className="w-4 h-4 text-[#A07855] border-stone-300 focus:ring-[#A07855] accent-[#A07855] cursor-pointer"
                />
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < rating ? "fill-amber-500 text-amber-500" : "text-stone-300"}
                    />
                  ))}
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* 3. Categories */}
      <div className="space-y-3 pt-2 border-t border-stone-100">
        <h3 className="text-sm font-semibold text-stone-900">Categories</h3>
        <div className="space-y-2 text-xs text-stone-600">
          {categories.map((cat) => {
            const isChecked = activeCategory.toLowerCase() === cat.id.toLowerCase();
            return (
              <label
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  onSelectCategory?.(cat.id);
                }}
                className="flex items-center gap-2.5 cursor-pointer group hover:text-stone-900 transition"
              >
                <input
                  type="radio"
                  name="category"
                  checked={isChecked}
                  onChange={() => {}}
                  className="w-4 h-4 text-[#A07855] border-stone-300 focus:ring-[#A07855] accent-[#A07855] cursor-pointer"
                />
                <span className={isChecked ? "font-semibold text-stone-900" : ""}>
                  {cat.name}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 4. Brands */}
      <div className="space-y-3 pt-2 border-t border-stone-100">
        <h3 className="text-sm font-semibold text-stone-900">Brands</h3>
        <div className="space-y-2 text-xs text-stone-600">
          {brands.map((brand) => {
            const isChecked = selectedBrands.includes(brand);
            return (
              <label
                key={brand}
                onClick={() => toggleBrand(brand)}
                className="flex items-center gap-2.5 cursor-pointer group hover:text-stone-900 transition"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => {}}
                  className="w-4 h-4 text-[#A07855] rounded border-stone-300 focus:ring-[#A07855] accent-[#A07855] cursor-pointer"
                />
                <span className={isChecked ? "font-semibold text-stone-900" : ""}>
                  {brand}
                </span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-stone-200 text-stone-800 text-xs font-semibold shadow-xs"
          >
            <SlidersHorizontal size={14} className="text-[#A07855]" />
            <span>Filter Catalog</span>
          </button>
          <span className="text-xs text-stone-500">
            {filteredProducts.length} Products
          </span>
        </div>

        {/* Layout: Sidebar + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Left Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs">
            {renderSidebar()}
          </aside>

          {/* Mobile Drawer */}
          {mobileFilterOpen && (
            <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end">
              <div className="bg-white w-80 h-full p-6 overflow-y-auto shadow-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-200">
                    <h3 className="font-bold text-stone-900">Filters</h3>
                    <button
                      type="button"
                      onClick={() => setMobileFilterOpen(false)}
                      className="p-1 rounded-lg text-stone-500 hover:bg-stone-100"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  {renderSidebar()}
                </div>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full mt-6 py-3 bg-[#A07855] text-white font-semibold text-xs rounded-xl shadow-md"
                >
                  Apply Filters ({filteredProducts.length})
                </button>
              </div>
            </div>
          )}

          {/* Right Product Grid Area */}
          <main className="lg:col-span-9 space-y-6">
            {/* Top Toolbar */}
            <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="text-left">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#A07855]">
                  {activeCategory === "all" ? "Full Collection" : activeCategory}
                </span>
                <h1 className="text-xl font-bold text-stone-900 font-serif">
                  Crafted Furniture Collection
                </h1>
                <p className="text-xs text-stone-500 mt-0.5">
                  Showing {filteredProducts.length} of {products.length} products
                </p>
              </div>

              {/* Sort Selector */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-stone-500 font-medium">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-[#F7F5F2] border border-stone-200 rounded-xl px-3 py-2 text-stone-800 font-medium focus:outline-none focus:border-[#A07855] cursor-pointer"
                >
                  <option value="default">Default Sorting</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onAddToCart={onAddToCart}
                    onQuickView={onQuickView}
                    onSelectProduct={onSelectProduct}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white p-12 rounded-2xl border border-stone-200 text-center space-y-4">
                <div className="w-16 h-16 bg-[#F7F5F2] text-[#A07855] rounded-full flex items-center justify-center mx-auto">
                  <SlidersHorizontal size={24} />
                </div>
                <h3 className="text-lg font-bold text-stone-900">No furniture pieces found</h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  We could not find any products matching your selected filters. Try adjusting your price range or clearing selections.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-5 py-2.5 bg-[#A07855] text-white text-xs font-semibold rounded-xl hover:bg-[#8d6645] transition shadow-xs cursor-pointer"
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
