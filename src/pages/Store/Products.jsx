import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useStore } from "./StoreLayout";
import ProductCard from "../../Components/store/ProductCard";
import { Search, Filter, RefreshCw, Grid } from "lucide-react";

export default function Products() {
  const { products, categories, template } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();

  // Selected filters from search params
  const initialCategory = searchParams.get("category") || "All Categories";
  const initialSearch = searchParams.get("search") || "";

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  // Sync state if URL search parameters change
  useEffect(() => {
    setSelectedCategory(searchParams.get("category") || "All Categories");
  }, [searchParams]);

  useEffect(() => {
    setSearchQuery(searchParams.get("search") || "");
  }, [searchParams]);

  const handleCategorySelect = (categoryName) => {
    setSelectedCategory(categoryName);
    const params = new URLSearchParams(searchParams);
    if (categoryName === "All Categories") {
      params.delete("category");
    } else {
      params.set("category", categoryName);
    }
    setSearchParams(params);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    const params = new URLSearchParams(searchParams);
    if (!value.trim()) {
      params.delete("search");
    } else {
      params.set("search", value);
    }
    setSearchParams(params);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All Categories");
    setSearchParams(new URLSearchParams());
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "All Categories" ||
        (product.category && product.category.name.toLowerCase() === selectedCategory.toLowerCase());

      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  // If custom template is active, render dynamically
  if (template && template.productLayout && template.productLayout.length > 0) {
    const theme = template.selectedTheme || {
      colors: { primary: "#4F46E5", secondary: "#818CF8", background: "#F3F4F6", cardBg: "#FFFFFF", textColor: "#1F2937" }
    };

    return (
      <div 
        className="max-w-7xl mx-auto px-6 py-10 w-full transition-all duration-300 min-h-screen text-left"
        style={{
          backgroundColor: theme.colors?.background,
          color: theme.colors?.textColor,
          fontFamily: template.selectedFont?.fontFamily || "inherit"
        }}
      >
        <div className="space-y-6">
          {template.productLayout.map((sec, idx) => {
            const { type, activeVariant } = sec;

            // 1. SEARCH BAR
            if (type === "search_bar") {
              return (
                <div key={sec.id || idx} className="relative max-w-xl">
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={15} />
                  <input
                    type="text"
                    placeholder="Search catalog..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full pl-9 pr-4 py-2 text-xs border border-gray-200 bg-white outline-none focus:ring-1 transition"
                    style={{ 
                      borderRadius: activeVariant === "search_s1" ? "9999px" : "6px",
                      borderColor: theme.colors?.primary,
                      color: theme.colors?.textColor
                    }}
                  />
                </div>
              );
            }

            // 2. FILTER WIDGET
            if (type === "filter") {
              return (
                <div key={sec.id || idx} className="flex flex-wrap gap-2 py-2">
                  <button
                    onClick={() => handleCategorySelect("All Categories")}
                    className="px-3 py-1.5 rounded-full text-xs font-bold border transition cursor-pointer"
                    style={{
                      backgroundColor: selectedCategory === "All Categories" ? theme.colors?.primary : "white",
                      color: selectedCategory === "All Categories" ? "white" : theme.colors?.textColor,
                      borderColor: theme.colors?.primary
                    }}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat._id}
                      onClick={() => handleCategorySelect(cat.name)}
                      className="px-3 py-1.5 rounded-full text-xs font-bold border transition cursor-pointer"
                      style={{
                        backgroundColor: selectedCategory.toLowerCase() === cat.name.toLowerCase() ? theme.colors?.primary : "white",
                        color: selectedCategory.toLowerCase() === cat.name.toLowerCase() ? "white" : theme.colors?.textColor,
                        borderColor: theme.colors?.primary
                      }}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              );
            }

            // 3. PRODUCT GRID
            if (type === "product_grid") {
              const gridCols = activeVariant === "grid_s2" ? "grid-cols-2 md:grid-cols-4" : "grid-cols-1 md:grid-cols-3";
              return (
                <div key={sec.id || idx} className="space-y-4">
                  {filteredProducts.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                      <Search size={32} className="text-gray-300 mx-auto mb-2" />
                      <p className="text-xs text-gray-500 font-semibold">No matches found.</p>
                    </div>
                  ) : (
                    <div className={`grid gap-6 ${gridCols}`}>
                      {filteredProducts.map((product) => (
                        <ProductCard key={product._id} product={product} />
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return null;
          })}
        </div>
      </div>
    );
  }

  // Classic fallback UI
  return (
    <div className="max-w-7xl mx-auto px-6 py-10 w-full text-left">
      <div className="mb-8 border-b border-gray-100 pb-5">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2">
          <Grid size={24} className="text-indigo-650" /> Catalog
        </h1>
        <p className="text-gray-500 text-xs mt-1">Browse all available products from our store</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="space-y-6 lg:col-span-1">
          <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
              <Search size={14} className="text-indigo-650" /> Search Products
            </h3>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={15} />
              <input
                type="text"
                placeholder="Type keywords..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-9 pr-4 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition bg-gray-50/50 focus:bg-white"
              />
            </div>
          </div>

          <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                <Filter size={14} className="text-indigo-650" /> Filter by Category
              </h3>
              {(selectedCategory !== "All Categories" || searchQuery) && (
                <button
                  onClick={resetFilters}
                  className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 transition flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw size={10} /> Reset
                </button>
              )}
            </div>
            
            <div className="flex flex-col gap-1.5 max-h-64 overflow-y-auto">
              <button
                onClick={() => handleCategorySelect("All Categories")}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                  selectedCategory === "All Categories"
                    ? "bg-indigo-50 text-indigo-650 font-extrabold"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <span>All Categories</span>
                <span className="text-[10px] bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full font-bold">
                  {products.length}
                </span>
              </button>

              {categories.map((cat) => {
                const count = products.filter(
                  (p) => p.category && p.category.name.toLowerCase() === cat.name.toLowerCase()
                ).length;
                return (
                  <button
                    key={cat._id}
                    onClick={() => handleCategorySelect(cat.name)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                      selectedCategory.toLowerCase() === cat.name.toLowerCase()
                        ? "bg-indigo-50 text-indigo-650 font-extrabold"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <span className="capitalize">{cat.name}</span>
                    <span className="text-[10px] bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full font-bold">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-50 pb-4">
            <span className="text-xs font-bold text-gray-400">
              Showing {filteredProducts.length} of {products.length} products
            </span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
              <Search size={40} className="text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500 font-bold text-sm">No products found matching filters.</p>
              <button onClick={resetFilters} className="mt-3 text-xs font-bold text-indigo-600 hover:underline cursor-pointer">
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
