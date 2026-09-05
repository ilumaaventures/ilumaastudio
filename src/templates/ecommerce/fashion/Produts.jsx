import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Search,
  Filter,
  Grid,
  Columns,
  X,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  Compass,
  Check,
  Tag,
  ShieldCheck,
} from "lucide-react";
import ProductCard from "./ProductCard";

export default function Produts({
  products = [],
  categories = [],
  onSelectProduct = null,
  onAddToCart = null,
  currency = "INR",
  initialCategory = "all",
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || "all");
  const [selectedSize, setSelectedSize] = useState("all");
  const [selectedMaterial, setSelectedMaterial] = useState("all");
  const [pricePreset, setPricePreset] = useState("all");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [runwayOnly, setRunwayOnly] = useState(false);
  const [sortBy, setSortBy] = useState("featured");

  const [layoutColumns, setLayoutColumns] = useState(4); // 2 (editorial) | 4 (grid)
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const topRef = useRef(null);

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
      setCurrentPage(1);
    }
  }, [initialCategory]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    selectedCategory,
    selectedSize,
    selectedMaterial,
    pricePreset,
    inStockOnly,
    runwayOnly,
    sortBy,
  ]);

  const fallbackFashionProducts = [
    {
      _id: "uf_p1",
      name: "Oversized Double-Breasted Wool Coat",
      price: 38500,
      compareAtPrice: 46000,
      category: "Autumn Outerwear",
      rating: 4.9,
      reviewCount: 64,
      badge: "Runway Collection",
      material: "Virgin Wool",
      image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=900&auto=format&fit=crop&q=80",
      description: "Italian virgin wool double-breasted silhouette with structured shoulders, horn buttons, and satin lining.",
      sizes: ["XS", "S", "M", "L", "XL"],
      inStock: true,
    },
    {
      _id: "uf_p2",
      name: "Pure Cashmere Turtleneck Sweater",
      price: 24500,
      compareAtPrice: 29900,
      category: "Merino Knitwear",
      rating: 5.0,
      reviewCount: 88,
      badge: "Essential",
      material: "Cashmere",
      image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=900&auto=format&fit=crop&q=80",
      description: "Ultra-soft Mongolian grade-A cashmere knit with ribbed cuffs and relaxed neckline drape.",
      sizes: ["S", "M", "L"],
      inStock: true,
    },
    {
      _id: "uf_p3",
      name: "Pleated Wide-Leg Wool Flannel Trousers",
      price: 19500,
      compareAtPrice: 24000,
      category: "Tailored Trousers",
      rating: 4.8,
      reviewCount: 42,
      badge: "New Arrival",
      material: "Virgin Wool",
      image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&auto=format&fit=crop&q=80",
      description: "High-waisted tailored trousers crafted from breathable melange wool with deep front pleats.",
      sizes: ["28", "30", "32", "34"],
      inStock: true,
    },
    {
      _id: "uf_p4",
      name: "Handcrafted Italian Leather Tote",
      price: 32000,
      compareAtPrice: 38000,
      category: "Leather Accessories",
      rating: 4.9,
      reviewCount: 51,
      badge: "Limited Edition",
      material: "Leather",
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=900&auto=format&fit=crop&q=80",
      description: "Full-grain vegetable-tanned Tuscan leather tote with suede interior and magnetic closure.",
      sizes: ["One Size"],
      inStock: true,
    },
    {
      _id: "uf_p5",
      name: "Asymmetric Mulberry Silk Evening Gown",
      price: 44000,
      compareAtPrice: 52000,
      category: "Silk Dresses",
      rating: 5.0,
      reviewCount: 39,
      badge: "Haute Couture",
      material: "Mulberry Silk",
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&auto=format&fit=crop&q=80",
      description: "Bias-cut pure mulberry silk charmeuse that skims gracefully with an open cowl back.",
      sizes: ["XS", "S", "M", "L"],
      inStock: true,
    },
    {
      _id: "uf_p6",
      name: "Bespoke Unstructured Tailored Blazer",
      price: 34500,
      compareAtPrice: 41000,
      category: "Autumn Outerwear",
      rating: 4.9,
      reviewCount: 73,
      badge: "Runway Collection",
      material: "Virgin Wool",
      image: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=900&auto=format&fit=crop&q=80",
      description: "Japanese wool-blend blazer featuring soft natural shoulders, welt pockets, and horn buttons.",
      sizes: ["S", "M", "L", "XL"],
      inStock: true,
    },
    {
      _id: "uf_p7",
      name: "Ribbed Merino Wool Mock-Neck Knit",
      price: 18500,
      compareAtPrice: 22000,
      category: "Merino Knitwear",
      rating: 4.7,
      reviewCount: 55,
      badge: "Essential",
      material: "Merino Wool",
      image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=900&auto=format&fit=crop&q=80",
      description: "Fine gauge extra-fine Merino wool sweater with subtle ribbed texture and tailored wrist cuffs.",
      sizes: ["XS", "S", "M", "L"],
      inStock: true,
    },
    {
      _id: "uf_p8",
      name: "Structured Calfskin Crossbody Bag",
      price: 26000,
      compareAtPrice: 31000,
      category: "Leather Accessories",
      rating: 4.8,
      reviewCount: 68,
      badge: "Limited Edition",
      material: "Leather",
      image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=900&auto=format&fit=crop&q=80",
      description: "Box calfskin bag accented with custom brushed palladium hardware and adjustable shoulder strap.",
      sizes: ["One Size"],
      inStock: true,
    },
  ];

  const fashionList = products && products.length > 0 ? products : fallbackFashionProducts;

  const sizesList = ["XS", "S", "M", "L", "XL"];
  const materialsList = [
    { id: "all", label: "All Fabrics" },
    { id: "Cashmere", label: "Pure Cashmere" },
    { id: "Virgin Wool", label: "Italian Virgin Wool" },
    { id: "Mulberry Silk", label: "Mulberry Silk" },
    { id: "Leather", label: "Tuscan Leather" },
  ];

  const priceRanges = [
    { id: "all", label: "All Price Points" },
    { id: "under-20k", label: "Under ₹20,000", min: 0, max: 20000 },
    { id: "20k-35k", label: "₹20,000 – ₹35,000", min: 20000, max: 35000 },
    { id: "35k-plus", label: "₹35,000 & Above", min: 35000, max: 9999999 },
  ];

  const uniqueCategories = useMemo(() => {
    const cats = Array.from(
      new Set(
        fashionList
          .map((p) => (p.category?.name ? p.category.name : p.category))
          .filter(Boolean)
      )
    );
    return cats;
  }, [fashionList]);

  // Filtering
  const filteredProducts = useMemo(() => {
    return fashionList
      .filter((item) => {
        // Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const nameM = (item.name || "").toLowerCase().includes(q);
          const descM = (item.description || "").toLowerCase().includes(q);
          const catM = (item.category?.name || item.category || "").toLowerCase().includes(q);
          const badgeM = (item.badge || "").toLowerCase().includes(q);
          if (!nameM && !descM && !catM && !badgeM) return false;
        }

        // Category
        if (selectedCategory !== "all") {
          const itemCat = (item.category?.name || item.category || "").toLowerCase();
          const target = selectedCategory.toLowerCase();
          if (!itemCat.includes(target) && itemCat !== target) return false;
        }

        // Size
        if (selectedSize !== "all") {
          const sizes = item.sizes || [];
          if (!sizes.includes(selectedSize)) return false;
        }

        // Material
        if (selectedMaterial !== "all") {
          const mat = (item.material || item.description || "").toLowerCase();
          if (!mat.includes(selectedMaterial.toLowerCase())) return false;
        }

        // Price
        if (pricePreset !== "all") {
          const presetObj = priceRanges.find((p) => p.id === pricePreset);
          if (presetObj) {
            const p = Number(item.price || 0);
            if (p < presetObj.min || p > presetObj.max) return false;
          }
        }

        // In Stock
        if (inStockOnly && item.inStock === false) return false;

        // Runway Exclusive
        if (runwayOnly) {
          const badge = (item.badge || "").toLowerCase();
          if (!badge.includes("runway") && !badge.includes("haute")) return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "price-asc":
            return Number(a.price || 0) - Number(b.price || 0);
          case "price-desc":
            return Number(b.price || 0) - Number(a.price || 0);
          case "rating":
            return Number(b.rating || 5) - Number(a.rating || 5);
          case "discount": {
            const discA = a.compareAtPrice ? (a.compareAtPrice - a.price) / a.compareAtPrice : 0;
            const discB = b.compareAtPrice ? (b.compareAtPrice - b.price) / b.compareAtPrice : 0;
            return discB - discA;
          }
          case "featured":
          default:
            return 0;
        }
      });
  }, [
    fashionList,
    searchQuery,
    selectedCategory,
    selectedSize,
    selectedMaterial,
    pricePreset,
    inStockOnly,
    runwayOnly,
    sortBy,
  ]);

  // Pagination
  const totalItems = filteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const validCurrentPage = Math.min(currentPage, totalPages);

  const paginatedProducts = useMemo(() => {
    const start = (validCurrentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, validCurrentPage, itemsPerPage]);

  const handlePageChange = (p) => {
    if (p >= 1 && p <= totalPages) {
      setCurrentPage(p);
      if (topRef.current) {
        topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const resetAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedSize("all");
    setSelectedMaterial("all");
    setPricePreset("all");
    setInStockOnly(false);
    setRunwayOnly(false);
    setSortBy("featured");
    setCurrentPage(1);
  };

  const activeFiltersCount =
    (selectedCategory !== "all" ? 1 : 0) +
    (selectedSize !== "all" ? 1 : 0) +
    (selectedMaterial !== "all" ? 1 : 0) +
    (pricePreset !== "all" ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (runwayOnly ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0);

  // Sidebar Filter Content
  const FilterContent = (
    <div className="space-y-6 text-left">
      {/* Title & Reset */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
        <div className="flex items-center gap-2 font-serif text-sm font-bold uppercase tracking-widest text-zinc-950">
          <SlidersHorizontal size={14} />
          <span>Atelier Filter</span>
          {activeFiltersCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-zinc-950 text-white text-[10px] font-mono flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <button
            type="button"
            onClick={resetAllFilters}
            className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 hover:text-zinc-950 transition flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw size={11} /> Reset
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="space-y-2">
        <h4 className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
          Collections & Categories
        </h4>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
              selectedCategory === "all"
                ? "bg-zinc-950 text-white shadow-xs"
                : "text-zinc-600 hover:bg-zinc-100"
            }`}
          >
            All Collections
          </button>
          {uniqueCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? "bg-zinc-950 text-white shadow-xs"
                  : "text-zinc-600 hover:bg-zinc-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Sizing Filter */}
      <div className="space-y-2 pt-3 border-t border-zinc-100">
        <h4 className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
          Bespoke Sizing
        </h4>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedSize("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition cursor-pointer ${
              selectedSize === "all"
                ? "bg-zinc-950 text-white"
                : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
            }`}
          >
            All
          </button>
          {sizesList.map((sz) => (
            <button
              key={sz}
              type="button"
              onClick={() => setSelectedSize(sz)}
              className={`w-9 h-8 rounded-lg text-xs font-bold uppercase transition cursor-pointer ${
                selectedSize === sz
                  ? "bg-zinc-950 text-white shadow-xs"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
              }`}
            >
              {sz}
            </button>
          ))}
        </div>
      </div>

      {/* Material Filter */}
      <div className="space-y-2 pt-3 border-t border-zinc-100">
        <h4 className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
          Noble Materials
        </h4>
        <div className="space-y-1">
          {materialsList.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setSelectedMaterial(m.id)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                selectedMaterial === m.id
                  ? "bg-zinc-950 text-white font-bold"
                  : "text-zinc-600 hover:bg-zinc-100"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price Presets */}
      <div className="space-y-2 pt-3 border-t border-zinc-100">
        <h4 className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
          Price Range
        </h4>
        <div className="space-y-1">
          {priceRanges.map((pr) => (
            <button
              key={pr.id}
              type="button"
              onClick={() => setPricePreset(pr.id)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                pricePreset === pr.id
                  ? "bg-zinc-950 text-white font-bold"
                  : "text-zinc-600 hover:bg-zinc-100"
              }`}
            >
              {pr.label}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Toggles */}
      <div className="space-y-2 pt-3 border-t border-zinc-100">
        <h4 className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
          Couture Status
        </h4>

        {/* In Stock */}
        <label
          onClick={() => setInStockOnly(!inStockOnly)}
          className="flex items-center justify-between p-2 rounded-xl hover:bg-zinc-50 transition cursor-pointer"
        >
          <span className="text-xs font-medium text-zinc-700">
            Available in Atelier
          </span>
          <div
            className={`w-9 h-5 rounded-full transition-colors p-0.5 ${
              inStockOnly ? "bg-zinc-950" : "bg-zinc-300"
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                inStockOnly ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </div>
        </label>

        {/* Runway Exclusives */}
        <label
          onClick={() => setRunwayOnly(!runwayOnly)}
          className="flex items-center justify-between p-2 rounded-xl hover:bg-zinc-50 transition cursor-pointer"
        >
          <span className="text-xs font-medium text-zinc-700 flex items-center gap-1.5">
            <Sparkles size={12} className="text-amber-500" /> Runway Exclusives
          </span>
          <div
            className={`w-9 h-5 rounded-full transition-colors p-0.5 ${
              runwayOnly ? "bg-zinc-950" : "bg-zinc-300"
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                runwayOnly ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </div>
        </label>
      </div>
    </div>
  );

  return (
    <div ref={topRef} className="py-12 bg-[#FAFAFA] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Editorial Collection Header */}
        <div className="space-y-4 text-left border-b border-zinc-200 pb-8">
          <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-400 block">
            Prêt-à-Porter & Seasonal Curations
          </span>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl sm:text-5xl font-serif font-black text-zinc-950 tracking-tight">
                {selectedCategory === "all" ? "The Atelier Collections" : selectedCategory}
              </h1>
              <p className="text-xs sm:text-sm text-zinc-500 max-w-xl mt-2 font-sans">
                Each silhouette is individually cut and assembled using master-level tailoring traditions, sustainable Mongolian cashmere, and structured virgin wools.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">
                {totalItems} Available Pieces
              </span>
            </div>
          </div>
        </div>

        {/* Toolbar: Search, Sort, View Layout Toggles */}
        <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4 text-left">
          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search coats, silk gowns, trousers..."
              className="w-full pl-10 pr-9 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-zinc-950 transition font-sans"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Right Toolbar Actions */}
          <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto">
            {/* Mobile Filter Trigger */}
            <button
              type="button"
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-xs font-bold uppercase tracking-wider transition cursor-pointer"
            >
              <Filter size={14} />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-zinc-950 text-white text-[9px] font-mono flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 text-xs text-zinc-600 font-mono">
              <span className="hidden sm:inline uppercase">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-bold uppercase tracking-wider text-zinc-900 focus:outline-none cursor-pointer"
              >
                <option value="featured">Runway Curated</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Critic & Client Rating</option>
                <option value="discount">Seasonal Privileges</option>
              </select>
            </div>

            {/* Columns Switcher (2-col editorial vs 4-col grid) */}
            <div className="hidden sm:flex items-center gap-1 bg-zinc-100 p-1 rounded-xl border border-zinc-200">
              <button
                type="button"
                onClick={() => setLayoutColumns(2)}
                aria-label="2-Column Editorial View"
                title="2-Column Editorial View"
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  layoutColumns === 2
                    ? "bg-white text-zinc-950 shadow-xs"
                    : "text-zinc-400 hover:text-zinc-700"
                }`}
              >
                <Columns size={16} />
              </button>
              <button
                type="button"
                onClick={() => setLayoutColumns(4)}
                aria-label="4-Column Grid View"
                title="4-Column Grid View"
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  layoutColumns === 4
                    ? "bg-white text-zinc-950 shadow-xs"
                    : "text-zinc-400 hover:text-zinc-700"
                }`}
              >
                <Grid size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filter Chips */}
        {activeFiltersCount > 0 && (
          <div className="flex items-center gap-2 flex-wrap text-left">
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
              Active Filters:
            </span>

            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-200 text-zinc-900 text-xs font-mono">
                "{searchQuery}"
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="hover:text-rose-600"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            {selectedCategory !== "all" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-950 text-white text-xs font-mono uppercase tracking-wider">
                {selectedCategory}
                <button
                  type="button"
                  onClick={() => setSelectedCategory("all")}
                  className="hover:text-zinc-300"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            {selectedSize !== "all" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-200 text-zinc-900 text-xs font-mono uppercase">
                Size: {selectedSize}
                <button
                  type="button"
                  onClick={() => setSelectedSize("all")}
                  className="hover:text-rose-600"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            {selectedMaterial !== "all" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-200 text-zinc-900 text-xs font-mono uppercase">
                Fabric: {selectedMaterial}
                <button
                  type="button"
                  onClick={() => setSelectedMaterial("all")}
                  className="hover:text-rose-600"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            {inStockOnly && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-mono uppercase">
                In Stock Only
                <button
                  type="button"
                  onClick={() => setInStockOnly(false)}
                  className="hover:text-rose-600"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            {runwayOnly && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-mono uppercase">
                Runway Exclusives
                <button
                  type="button"
                  onClick={() => setRunwayOnly(false)}
                  className="hover:text-rose-600"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={resetAllFilters}
              className="text-xs font-mono uppercase tracking-wider text-rose-600 hover:underline cursor-pointer ml-1"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Main Grid with Left Filter Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Left Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs sticky top-28">
            {FilterContent}
          </aside>

          {/* Product Cards Grid Column */}
          <section className="lg:col-span-9 space-y-6">
            {paginatedProducts.length > 0 ? (
              <div
                className={`grid gap-6 sm:gap-8 ${
                  layoutColumns === 2
                    ? "grid-cols-1 sm:grid-cols-2"
                    : "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                }`}
              >
                {paginatedProducts.map((product) => (
                  <ProductCard
                    key={product._id || product.id}
                    product={product}
                    currency={currency}
                    onSelect={onSelectProduct}
                    onAddToCart={onAddToCart}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-dashed border-zinc-300 p-16 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-zinc-100 text-zinc-950 flex items-center justify-center mx-auto">
                  <Compass size={28} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-serif font-bold text-zinc-950">
                    No Atelier Pieces Found
                  </h3>
                  <p className="text-xs text-zinc-500 max-w-sm mx-auto font-sans">
                    No pieces currently match your selected filters. Please adjust your criteria or explore all collections.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="px-6 py-2.5 bg-zinc-950 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pt-10 flex items-center justify-center gap-2 border-t border-zinc-200">
                <button
                  type="button"
                  onClick={() => handlePageChange(validCurrentPage - 1)}
                  disabled={validCurrentPage === 1}
                  aria-label="Previous Page"
                  className="px-3.5 py-2 rounded-xl bg-white border border-zinc-200 text-xs font-bold uppercase tracking-wider text-zinc-700 hover:bg-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed transition flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft size={16} /> Prev
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => handlePageChange(page)}
                      className={`w-9 h-9 rounded-xl text-xs font-bold font-mono transition cursor-pointer ${
                        validCurrentPage === page
                          ? "bg-zinc-950 text-white"
                          : "bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-100"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => handlePageChange(validCurrentPage + 1)}
                  disabled={validCurrentPage === totalPages}
                  aria-label="Next Page"
                  className="px-3.5 py-2 rounded-xl bg-white border border-zinc-200 text-xs font-bold uppercase tracking-wider text-zinc-700 hover:bg-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed transition flex items-center gap-1 cursor-pointer"
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            )}
          </section>
        </div>

        {/* Mobile Slide-Out Filter Drawer */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              onClick={() => setMobileFilterOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />
            <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between z-10">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
                  <h3 className="text-sm font-serif font-bold uppercase tracking-widest text-zinc-950">
                    Atelier Filter
                  </h3>
                  <button
                    type="button"
                    onClick={() => setMobileFilterOpen(false)}
                    className="p-1 text-zinc-400 hover:text-zinc-900"
                  >
                    <X size={20} />
                  </button>
                </div>
                {FilterContent}
              </div>

              <div className="pt-6 border-t border-zinc-200 mt-6 space-y-2">
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full py-3 bg-zinc-950 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-md cursor-pointer"
                >
                  View {totalItems} Pieces
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
