import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useStore } from "./StoreContext";
import ProductCard from "../../Components/store/ProductCard";
import { Search, Filter, RefreshCw, Grid, Sparkles, Tag } from "lucide-react";

export default function Products() {
  const { products, categories, template, theme: layoutTheme } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const theme = template?.selectedTheme || layoutTheme || {
    colors: {
      primary: "#4F46E5",
      secondary: "#818CF8",
      background: "#F8FAFC",
      cardBg: "#FFFFFF",
      textColor: "#0F172A",
    },
  };

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
        product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "All Categories" ||
        (product.category &&
          (typeof product.category === "object"
            ? product.category.name?.toLowerCase() === selectedCategory.toLowerCase()
            : product.category?.toLowerCase() === selectedCategory.toLowerCase()));

      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  const primaryColor = theme?.colors?.primary || "#4F46E5";

  return (
    <div
      className="w-full min-h-screen py-10 px-6 transition-all duration-300"
      style={{
        backgroundColor: theme.colors?.background || "#F8FAFC",
        color: theme.colors?.textColor || "#0F172A",
        fontFamily: template?.selectedFont?.fontFamily || "inherit",
      }}
    >
      <div className="max-w-7xl mx-auto space-y-8 text-left">
        {/* Header Title Section */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-black/[0.06]">
          <div className="space-y-1">
            <span
              className="text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1.5"
              style={{ color: primaryColor }}
            >
              <Sparkles size={12} /> Explore Collection
            </span>
            <h1
              className="text-3xl sm:text-4xl font-black tracking-tight"
              style={{ color: theme.colors?.textColor }}
            >
              Product Catalog
            </h1>
            <p className="text-xs opacity-75 font-medium">
              Browse and discover all available products from our store
            </p>
          </div>

          <span className="text-xs font-bold opacity-60">
            Showing {filteredProducts.length} of {products.length} Items
          </span>
        </div>

        {/* Catalog Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Sidebar Filters */}
          <div className="space-y-6 lg:col-span-1">
            {/* Search Card */}
            <div
              className="p-5 rounded-3xl border border-black/[0.06] shadow-xs space-y-3"
              style={{
                backgroundColor: theme.colors?.cardBg || "#FFFFFF",
              }}
            >
              <h3 className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5 opacity-90">
                <Search size={14} style={{ color: primaryColor }} /> Search Products
              </h3>
              <div className="relative">
                <Search
                  className="absolute left-3.5 top-3 opacity-40"
                  size={15}
                />
                <input
                  type="text"
                  placeholder="Type keywords..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full pl-9 pr-4 py-2.5 text-xs border border-slate-200 rounded-2xl outline-none focus:ring-2 transition bg-slate-50/50 focus:bg-white"
                  style={{
                    color: theme.colors?.textColor,
                  }}
                />
              </div>
            </div>

            {/* Category Filter Card */}
            <div
              className="p-5 rounded-3xl border border-black/[0.06] shadow-xs space-y-3"
              style={{
                backgroundColor: theme.colors?.cardBg || "#FFFFFF",
              }}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5 opacity-90">
                  <Filter size={14} style={{ color: primaryColor }} /> Categories
                </h3>
                {(selectedCategory !== "All Categories" || searchQuery) && (
                  <button
                    onClick={resetFilters}
                    className="text-[10px] font-black transition flex items-center gap-1 cursor-pointer hover:underline"
                    style={{ color: primaryColor }}
                  >
                    <RefreshCw size={10} /> Reset
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-1.5 max-h-72 overflow-y-auto pr-1">
                <button
                  onClick={() => handleCategorySelect("All Categories")}
                  className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                    selectedCategory === "All Categories"
                      ? "text-white shadow-xs"
                      : "opacity-80 hover:opacity-100 hover:bg-black/[0.03]"
                  }`}
                  style={{
                    backgroundColor:
                      selectedCategory === "All Categories"
                        ? primaryColor
                        : "transparent",
                  }}
                >
                  <span>All Categories</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      selectedCategory === "All Categories"
                        ? "bg-white/20 text-white"
                        : "bg-black/[0.05] opacity-60"
                    }`}
                  >
                    {products.length}
                  </span>
                </button>

                {categories.map((cat) => {
                  const isSelected =
                    selectedCategory.toLowerCase() === cat.name.toLowerCase();
                  const count = products.filter((p) => {
                    const cName =
                      typeof p.category === "object"
                        ? p.category?.name
                        : p.category;
                    return cName?.toLowerCase() === cat.name?.toLowerCase();
                  }).length;

                  return (
                    <button
                      key={cat._id}
                      onClick={() => handleCategorySelect(cat.name)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? "text-white shadow-xs"
                          : "opacity-80 hover:opacity-100 hover:bg-black/[0.03]"
                      }`}
                      style={{
                        backgroundColor: isSelected
                          ? primaryColor
                          : "transparent",
                      }}
                    >
                      <span className="capitalize truncate">{cat.name}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          isSelected
                            ? "bg-white/20 text-white"
                            : "bg-black/[0.05] opacity-60"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Product Grid Area */}
          <div className="lg:col-span-3 space-y-6">
            {filteredProducts.length === 0 ? (
              <div
                className="text-center py-20 rounded-3xl border border-black/[0.06] p-8 shadow-xs space-y-3"
                style={{
                  backgroundColor: theme.colors?.cardBg || "#FFFFFF",
                }}
              >
                <Search size={36} className="opacity-30 mx-auto" />
                <p className="font-bold text-sm">No products found matching filters.</p>
                <button
                  onClick={resetFilters}
                  className="text-xs font-black hover:underline cursor-pointer"
                  style={{ color: primaryColor }}
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    theme={theme}
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
