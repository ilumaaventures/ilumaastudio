import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Search,
  Filter,
  Grid,
  List as ListIcon,
  X,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Star,
  Leaf,
  Sparkles,
  Tag,
  Check,
  RotateCcw,
  SlidersHorizontal,
  Flame,
  ShieldCheck,
  Clock,
  Apple,
  Croissant,
  Egg,
  CupSoda,
  Package,
  DollarSign,
  TrendingDown,
  Heart,
  Layers,
  ArrowUpDown,
} from "lucide-react";
import ProductCard from "./ProductCard";

export default function Products({
  products = [],
  categories = [],
  onSelectProduct = null,
  onAddToCart = null,
  onUpdateQuantity = null,
  initialCategory = "all",
  brandName = "FreshMart",
}) {
  // -------------------------------------------------------------
  // Filter & Search State
  // -------------------------------------------------------------
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || "all");
  const [categorySearchQuery, setCategorySearchQuery] = useState("");
  const [selectedDietary, setSelectedDietary] = useState([]);
  const [pricePreset, setPricePreset] = useState("all");
  const [customMinPrice, setCustomMinPrice] = useState("");
  const [customMaxPrice, setCustomMaxPrice] = useState("");
  const [appliedCustomPrice, setAppliedCustomPrice] = useState({ min: null, max: null });
  const [inStockOnly, setInStockOnly] = useState(false);
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("featured");

  // Accordion open/collapse states for organized filter sections
  const [openSections, setOpenSections] = useState({
    categories: true,
    price: true,
    dietary: true,
    deals: true,
    ratings: true,
  });

  // View Mode & Pagination State
  const [layout, setLayout] = useState("grid"); // "grid" | "list"
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const productTopRef = useRef(null);

  // Debounce search input for silky performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Sync initialCategory prop if changed externally
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
      setCurrentPage(1);
    }
  }, [initialCategory]);

  // Reset page when any filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [
    debouncedSearch,
    selectedCategory,
    selectedDietary,
    pricePreset,
    appliedCustomPrice,
    inStockOnly,
    onSaleOnly,
    minRating,
    sortBy,
  ]);

  // Fallback demo products if empty
  const defaultFallbackGroceries = [
    {
      _id: "p1",
      name: "Crisp Organic Honeycrisp Apples",
      price: 4.99,
      compareAtPrice: 6.99,
      unit: "per lb (approx 3 pcs)",
      category: "Fresh Produce",
      rating: 4.9,
      reviewCount: 142,
      badge: "Organic",
      dietary: ["organic", "vegan", "gluten-free"],
      image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80",
      description: "Orchard-picked certified organic Honeycrisp apples, sweet, crunchy and refreshing.",
      inStock: true,
      stockQuantity: 45,
    },
    {
      _id: "p2",
      name: "Artisan Sourdough Country Loaf",
      price: 6.49,
      compareAtPrice: 7.5,
      unit: "750g Loaf",
      category: "Artisanal Bakery",
      rating: 5.0,
      reviewCount: 98,
      badge: "Freshly Baked",
      dietary: ["vegan"],
      image: "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=600&auto=format&fit=crop&q=80",
      description: "Naturally leavened slow-fermented sourdough with blistered golden crust and airy crumb.",
      inStock: true,
      stockQuantity: 18,
    },
    {
      _id: "p3",
      name: "Pasture-Raised Organic Grade A Eggs",
      price: 5.89,
      compareAtPrice: 6.99,
      unit: "Dozen (12 count)",
      category: "Dairy & Eggs",
      rating: 4.8,
      reviewCount: 215,
      badge: "Non-GMO",
      dietary: ["organic", "gluten-free"],
      image: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=600&auto=format&fit=crop&q=80",
      description: "Rich golden yolks from free-roaming hens raised on nutrient-rich open pastures.",
      inStock: true,
      stockQuantity: 28,
    },
    {
      _id: "p4",
      name: "Cold-Pressed Green Detox Elixir",
      price: 7.25,
      compareAtPrice: 8.99,
      unit: "16 fl oz",
      category: "Beverages & Juices",
      rating: 4.9,
      reviewCount: 77,
      badge: "Raw & Cold-Pressed",
      dietary: ["organic", "vegan", "gluten-free", "raw"],
      image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600&auto=format&fit=crop&q=80",
      description: "Kale, cucumber, crisp green apple, celery, lemon, and ginger with no added sugar or water.",
      inStock: true,
      stockQuantity: 15,
    },
    {
      _id: "p5",
      name: "Greek Kalamata Extra Virgin Olive Oil",
      price: 18.99,
      compareAtPrice: 24.0,
      unit: "500 ml Glass Bottle",
      category: "Pantry & Spices",
      rating: 4.9,
      reviewCount: 310,
      badge: "First Cold Pressed",
      dietary: ["organic", "vegan", "gluten-free"],
      image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80",
      description: "Single-origin unfiltered early harvest extra virgin olive oil from Messinia, Greece.",
      inStock: true,
      stockQuantity: 34,
    },
    {
      _id: "p6",
      name: "Wildflower Raw Mountain Honeycomb",
      price: 12.5,
      compareAtPrice: 15.0,
      unit: "350g Jar",
      category: "Pantry & Spices",
      rating: 4.9,
      reviewCount: 164,
      badge: "100% Pure Raw",
      dietary: ["raw", "gluten-free"],
      image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&auto=format&fit=crop&q=80",
      description: "Unpasteurized raw honeycomb packed with active floral enzymes and antioxidants.",
      inStock: true,
      stockQuantity: 22,
    },
    {
      _id: "p7",
      name: "Organic Hass Avocados (4-Pack)",
      price: 5.49,
      compareAtPrice: 6.99,
      unit: "Pack of 4",
      category: "Fresh Produce",
      rating: 4.7,
      reviewCount: 89,
      badge: "Organic",
      dietary: ["organic", "vegan", "gluten-free"],
      image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=600&auto=format&fit=crop&q=80",
      description: "Creamy, ripe Hass avocados perfect for fresh guacamole or breakfast toast.",
      inStock: true,
      stockQuantity: 40,
    },
    {
      _id: "p8",
      name: "Organic Farmstead Whole Milk",
      price: 4.29,
      compareAtPrice: 5.19,
      unit: "Half Gallon (64 fl oz)",
      category: "Dairy & Eggs",
      rating: 4.8,
      reviewCount: 120,
      badge: "Non-GMO",
      dietary: ["organic", "gluten-free"],
      image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80",
      description: "Low-heat pasteurized unhomogenized grass-fed whole milk with natural cream top.",
      inStock: true,
      stockQuantity: 19,
    },
    {
      _id: "p9",
      name: "Heirloom Mixed Cherry Tomatoes",
      price: 3.99,
      compareAtPrice: 4.99,
      unit: "1 Pint Basket",
      category: "Fresh Produce",
      rating: 4.9,
      reviewCount: 65,
      badge: "Pesticide-Free",
      dietary: ["organic", "vegan", "gluten-free"],
      image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80",
      description: "Rainbow assortment of sweet, juicy cherry tomatoes sun-ripened on the vine.",
      inStock: true,
      stockQuantity: 32,
    },
    {
      _id: "p10",
      name: "French Butter Croissants (4-Pack)",
      price: 5.99,
      compareAtPrice: 7.29,
      unit: "Box of 4",
      category: "Artisanal Bakery",
      rating: 5.0,
      reviewCount: 145,
      badge: "Freshly Baked",
      dietary: ["artisan"],
      image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop&q=80",
      description: "Traditional flaky croissants laminated with 84% butterfat Normandy cultured butter.",
      inStock: true,
      stockQuantity: 12,
    },
    {
      _id: "p11",
      name: "Sparkling Sicilian Blood Orange Soda",
      price: 2.89,
      compareAtPrice: 3.49,
      unit: "330 ml Glass Bottle",
      category: "Beverages & Juices",
      rating: 4.6,
      reviewCount: 52,
      badge: "Zero Added Sugar",
      dietary: ["vegan", "gluten-free"],
      image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop&q=80",
      description: "Craft Italian soda pressed from sun-drenched volcanic Sicilian blood oranges.",
      inStock: true,
      stockQuantity: 50,
    },
    {
      _id: "p12",
      name: "Roasted Tamari Almonds & Cashews",
      price: 8.99,
      compareAtPrice: 11.0,
      unit: "250g Resealable Pouch",
      category: "Snacks & Nuts",
      rating: 4.9,
      reviewCount: 94,
      badge: "Keto Friendly",
      dietary: ["organic", "vegan", "gluten-free"],
      image: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=600&auto=format&fit=crop&q=80",
      description: "Dry-roasted whole California almonds and cashews coated in organic wheat-free tamari.",
      inStock: true,
      stockQuantity: 24,
    },
  ];

  const groceryList = products && products.length > 0 ? products : defaultFallbackGroceries;

  // -------------------------------------------------------------
  // Filter Options & Taxonomy
  // -------------------------------------------------------------
  const dietaryOptions = [
    { id: "organic", label: "100% Organic", icon: Leaf },
    { id: "vegan", label: "Plant-Based / Vegan", icon: Sparkles },
    { id: "gluten-free", label: "Gluten-Free", icon: Check },
    { id: "raw", label: "Raw & Cold-Pressed", icon: Flame },
    { id: "artisan", label: "Artisanal / Bakery", icon: Croissant },
  ];

  const pricePresets = [
    { id: "all", label: "All Prices" },
    { id: "under-5", label: "Under ₹5.00", min: 0, max: 5 },
    { id: "5-10", label: "₹5.00 – ₹10.00", min: 5, max: 10 },
    { id: "10-20", label: "₹10.00 – ₹20.00", min: 10, max: 20 },
    { id: "20-plus", label: "₹20.00 & Above", min: 20, max: 999999 },
  ];

  // Derive unique categories with item counts
  const categoryCounts = useMemo(() => {
    const counts = { all: groceryList.length };
    groceryList.forEach((item) => {
      const cat = item.category || "Other";
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [groceryList]);

  const uniqueCategories = useMemo(() => {
    const fromProducts = Array.from(
      new Set(groceryList.map((p) => p.category).filter(Boolean))
    );
    if (categories && categories.length > 0) {
      const names = categories.map((c) => (typeof c === "string" ? c : c.name));
      return Array.from(new Set([...fromProducts, ...names]));
    }
    return fromProducts;
  }, [groceryList, categories]);

  // Filtered categories based on search input inside sidebar
  const visibleCategories = useMemo(() => {
    if (!categorySearchQuery.trim()) return uniqueCategories;
    const q = categorySearchQuery.toLowerCase();
    return uniqueCategories.filter((cat) => cat.toLowerCase().includes(q));
  }, [uniqueCategories, categorySearchQuery]);

  // Quick horizontal category pills
  const categoryPills = [
    { id: "all", name: "All Aisles", icon: Package },
    { id: "Fresh Produce", name: "Produce", icon: Apple },
    { id: "Artisanal Bakery", name: "Bakery", icon: Croissant },
    { id: "Dairy & Eggs", name: "Dairy & Eggs", icon: Egg },
    { id: "Beverages & Juices", name: "Juices & Drinks", icon: CupSoda },
    { id: "Pantry & Spices", name: "Pantry", icon: Package },
    { id: "Snacks & Nuts", name: "Snacks", icon: Sparkles },
  ];

  // -------------------------------------------------------------
  // Filtering & Sorting Logic
  // -------------------------------------------------------------
  const filteredProducts = useMemo(() => {
    return groceryList
      .filter((item) => {
        // 1. Search Query
        if (debouncedSearch.trim()) {
          const q = debouncedSearch.toLowerCase();
          const nameMatch = (item.name || "").toLowerCase().includes(q);
          const descMatch = (item.description || "").toLowerCase().includes(q);
          const catMatch = (item.category || "").toLowerCase().includes(q);
          const badgeMatch = (item.badge || "").toLowerCase().includes(q);
          if (!nameMatch && !descMatch && !catMatch && !badgeMatch) return false;
        }

        // 2. Category Filter
        if (selectedCategory !== "all") {
          const itemCat = (item.category || "").toLowerCase();
          const target = selectedCategory.toLowerCase();
          if (!itemCat.includes(target) && target !== itemCat) return false;
        }

        // 3. Dietary Filter (must match all selected tags)
        if (selectedDietary.length > 0) {
          const itemText = `${item.name || ""} ${item.description || ""} ${item.badge || ""} ${(item.dietary || []).join(" ")}`.toLowerCase();
          const matchesDietary = selectedDietary.every((tag) =>
            itemText.includes(tag.toLowerCase())
          );
          if (!matchesDietary) return false;
        }

        // 4. Custom Price Range or Preset
        const price = Number(item.price || 0);
        if (appliedCustomPrice.min !== null && price < appliedCustomPrice.min) {
          return false;
        }
        if (appliedCustomPrice.max !== null && price > appliedCustomPrice.max) {
          return false;
        }
        if (pricePreset !== "all" && appliedCustomPrice.min === null && appliedCustomPrice.max === null) {
          const presetObj = pricePresets.find((p) => p.id === pricePreset);
          if (presetObj) {
            if (price < presetObj.min || price > presetObj.max) return false;
          }
        }

        // 5. In Stock Only
        if (inStockOnly && item.inStock === false) {
          return false;
        }

        // 6. On Sale Only
        if (onSaleOnly) {
          const compare = Number(item.compareAtPrice || 0);
          if (compare <= price) return false;
        }

        // 7. Minimum Rating
        if (minRating > 0 && Number(item.rating || 5) < minRating) {
          return false;
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
          case "newest":
            return (b._id || "").localeCompare(a._id || "");
          case "featured":
          default:
            return 0;
        }
      });
  }, [
    groceryList,
    debouncedSearch,
    selectedCategory,
    selectedDietary,
    pricePreset,
    appliedCustomPrice,
    inStockOnly,
    onSaleOnly,
    minRating,
    sortBy,
  ]);

  // -------------------------------------------------------------
  // Pagination Calculations
  // -------------------------------------------------------------
  const totalItems = filteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const validCurrentPage = Math.min(currentPage, totalPages);

  const paginatedProducts = useMemo(() => {
    const start = (validCurrentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, validCurrentPage, itemsPerPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      if (productTopRef.current) {
        productTopRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const toggleDietary = (tag) => {
    setSelectedDietary((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const toggleSection = (sectionKey) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  const handleApplyCustomPrice = (e) => {
    e.preventDefault();
    const minVal = customMinPrice ? Math.max(0, parseFloat(customMinPrice)) : null;
    const maxVal = customMaxPrice ? Math.max(0, parseFloat(customMaxPrice)) : null;
    setAppliedCustomPrice({ min: minVal, max: maxVal });
    setPricePreset("custom");
  };

  const clearCustomPrice = () => {
    setCustomMinPrice("");
    setCustomMaxPrice("");
    setAppliedCustomPrice({ min: null, max: null });
    setPricePreset("all");
  };

  const resetAllFilters = () => {
    setSearchQuery("");
    setDebouncedSearch("");
    setSelectedCategory("all");
    setCategorySearchQuery("");
    setSelectedDietary([]);
    setPricePreset("all");
    clearCustomPrice();
    setInStockOnly(false);
    setOnSaleOnly(false);
    setMinRating(0);
    setSortBy("featured");
    setCurrentPage(1);
  };

  const activeFiltersCount =
    (selectedCategory !== "all" ? 1 : 0) +
    selectedDietary.length +
    (pricePreset !== "all" || appliedCustomPrice.min !== null || appliedCustomPrice.max !== null ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (onSaleOnly ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (debouncedSearch.trim() ? 1 : 0);

  // Group active indicators
  const isCategoryActive = selectedCategory !== "all";
  const isPriceActive = pricePreset !== "all" || appliedCustomPrice.min !== null || appliedCustomPrice.max !== null;
  const isDietaryActive = selectedDietary.length > 0;
  const isDealsActive = onSaleOnly || inStockOnly;
  const isRatingActive = minRating > 0;

  // -------------------------------------------------------------
  // Filter Sidebar Content (Organized & Responsive Accordion)
  // -------------------------------------------------------------
  const FilterSidebarContent = (
    <div className="space-y-4 text-left">
      {/* Header with Title & Reset Button */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
          <SlidersHorizontal size={16} className="text-[#15803D]" />
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-[#15803D] text-white text-[10px] font-black">
              {activeFiltersCount}
            </span>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <button
            type="button"
            onClick={resetAllFilters}
            className="text-[11px] font-bold text-[#15803D] hover:text-emerald-800 transition flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw size={12} /> Reset All
          </button>
        )}
      </div>

      {/* ================= GROUP 1: GROCERY AISLES ================= */}
      <div className="border border-slate-200/80 rounded-2xl bg-white overflow-hidden shadow-2xs">
        <button
          type="button"
          onClick={() => toggleSection("categories")}
          className="w-full flex items-center justify-between p-3.5 bg-slate-50/70 hover:bg-slate-50 transition cursor-pointer text-left"
        >
          <div className="flex items-center gap-2">
            <Package size={14} className="text-[#15803D]" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Grocery Aisles
            </span>
            {isCategoryActive && (
              <span className="w-2 h-2 rounded-full bg-[#15803D]" />
            )}
          </div>
          {openSections.categories ? (
            <ChevronUp size={14} className="text-slate-400" />
          ) : (
            <ChevronDown size={14} className="text-slate-400" />
          )}
        </button>

        {openSections.categories && (
          <div className="p-3 space-y-2.5">
            {/* Category Search Filter if more than 5 */}
            {uniqueCategories.length > 5 && (
              <div className="relative">
                <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter aisles..."
                  value={categorySearchQuery}
                  onChange={(e) => setCategorySearchQuery(e.target.value)}
                  className="w-full pl-7 pr-6 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                />
                {categorySearchQuery && (
                  <button
                    type="button"
                    onClick={() => setCategorySearchQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X size={10} />
                  </button>
                )}
              </div>
            )}

            <div className="space-y-1 max-h-52 overflow-y-auto pr-1">
              <button
                type="button"
                onClick={() => setSelectedCategory("all")}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  selectedCategory === "all"
                    ? "bg-emerald-50 text-[#15803D] font-bold border border-emerald-200"
                    : "text-slate-700 hover:bg-slate-100/70"
                }`}
              >
                <span>All Aisles</span>
                <span className="text-[10px] text-slate-400 font-normal">
                  {categoryCounts.all || 0}
                </span>
              </button>

              {visibleCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    selectedCategory.toLowerCase() === cat.toLowerCase()
                      ? "bg-emerald-50 text-[#15803D] font-bold border border-emerald-200"
                      : "text-slate-700 hover:bg-slate-100/70"
                  }`}
                >
                  <span className="truncate mr-2">{cat}</span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    {categoryCounts[cat] || 0}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ================= GROUP 2: PRICE RANGE ================= */}
      <div className="border border-slate-200/80 rounded-2xl bg-white overflow-hidden shadow-2xs">
        <button
          type="button"
          onClick={() => toggleSection("price")}
          className="w-full flex items-center justify-between p-3.5 bg-slate-50/70 hover:bg-slate-50 transition cursor-pointer text-left"
        >
          <div className="flex items-center gap-2">
            <DollarSign size={14} className="text-[#15803D]" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Price Range
            </span>
            {isPriceActive && (
              <span className="w-2 h-2 rounded-full bg-[#15803D]" />
            )}
          </div>
          {openSections.price ? (
            <ChevronUp size={14} className="text-slate-400" />
          ) : (
            <ChevronDown size={14} className="text-slate-400" />
          )}
        </button>

        {openSections.price && (
          <div className="p-3 space-y-3">
            {/* Quick Presets */}
            <div className="grid grid-cols-2 gap-1.5">
              {pricePresets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    setPricePreset(preset.id);
                    setAppliedCustomPrice({ min: null, max: null });
                    setCustomMinPrice("");
                    setCustomMaxPrice("");
                  }}
                  className={`px-2.5 py-1.5 rounded-xl text-[11px] font-semibold transition cursor-pointer border text-center ${
                    pricePreset === preset.id && appliedCustomPrice.min === null && appliedCustomPrice.max === null
                      ? "bg-emerald-50 text-[#15803D] border-emerald-300 font-bold shadow-2xs"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Custom Range Inputs */}
            <form onSubmit={handleApplyCustomPrice} className="space-y-2 pt-1 border-t border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Custom Range (₹)
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={customMinPrice}
                  onChange={(e) => setCustomMinPrice(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                />
                <span className="text-slate-400 text-xs">–</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={customMaxPrice}
                  onChange={(e) => setCustomMaxPrice(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-[#15803D] hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition cursor-pointer shrink-0 shadow-2xs"
                >
                  Go
                </button>
              </div>

              {(appliedCustomPrice.min !== null || appliedCustomPrice.max !== null) && (
                <div className="flex items-center justify-between text-[11px] text-emerald-800 bg-emerald-50 px-2 py-1 rounded-lg">
                  <span>
                    Range: ₹{appliedCustomPrice.min || 0} – ₹{appliedCustomPrice.max || "Any"}
                  </span>
                  <button
                    type="button"
                    onClick={clearCustomPrice}
                    className="text-rose-600 hover:underline cursor-pointer"
                  >
                    Clear
                  </button>
                </div>
              )}
            </form>
          </div>
        )}
      </div>

      {/* ================= GROUP 3: DIETARY & LIFESTYLE ================= */}
      <div className="border border-slate-200/80 rounded-2xl bg-white overflow-hidden shadow-2xs">
        <button
          type="button"
          onClick={() => toggleSection("dietary")}
          className="w-full flex items-center justify-between p-3.5 bg-slate-50/70 hover:bg-slate-50 transition cursor-pointer text-left"
        >
          <div className="flex items-center gap-2">
            <Leaf size={14} className="text-[#15803D]" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Dietary & Lifestyle
            </span>
            {isDietaryActive && (
              <span className="w-2 h-2 rounded-full bg-[#15803D]" />
            )}
          </div>
          {openSections.dietary ? (
            <ChevronUp size={14} className="text-slate-400" />
          ) : (
            <ChevronDown size={14} className="text-slate-400" />
          )}
        </button>

        {openSections.dietary && (
          <div className="p-3 space-y-1.5">
            {dietaryOptions.map((opt) => {
              const Icon = opt.icon;
              const checked = selectedDietary.includes(opt.id);
              return (
                <label
                  key={opt.id}
                  onClick={() => toggleDietary(opt.id)}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition cursor-pointer select-none"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-4 h-4 rounded-md flex items-center justify-center border transition ${
                        checked
                          ? "bg-[#15803D] border-[#15803D] text-white"
                          : "border-slate-300 bg-white"
                      }`}
                    >
                      {checked && <Check size={12} />}
                    </div>
                    <span className="text-xs font-medium text-slate-700">
                      {opt.label}
                    </span>
                  </div>
                  <Icon size={13} className="text-emerald-600/70" />
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* ================= GROUP 4: AVAILABILITY & DEALS ================= */}
      <div className="border border-slate-200/80 rounded-2xl bg-white overflow-hidden shadow-2xs">
        <button
          type="button"
          onClick={() => toggleSection("deals")}
          className="w-full flex items-center justify-between p-3.5 bg-slate-50/70 hover:bg-slate-50 transition cursor-pointer text-left"
        >
          <div className="flex items-center gap-2">
            <Flame size={14} className="text-rose-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Deals & Availability
            </span>
            {isDealsActive && (
              <span className="w-2 h-2 rounded-full bg-rose-500" />
            )}
          </div>
          {openSections.deals ? (
            <ChevronUp size={14} className="text-slate-400" />
          ) : (
            <ChevronDown size={14} className="text-slate-400" />
          )}
        </button>

        {openSections.deals && (
          <div className="p-3 space-y-2">
            {/* In-Stock Toggle */}
            <label
              onClick={() => setInStockOnly(!inStockOnly)}
              className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition cursor-pointer select-none"
            >
              <span className="text-xs font-medium text-slate-700">
                In Stock Only
              </span>
              <div
                className={`w-9 h-5 rounded-full transition-colors p-0.5 ${
                  inStockOnly ? "bg-[#15803D]" : "bg-slate-300"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    inStockOnly ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </div>
            </label>

            {/* On-Sale Toggle */}
            <label
              onClick={() => setOnSaleOnly(!onSaleOnly)}
              className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition cursor-pointer select-none"
            >
              <span className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
                <Flame size={13} className="text-rose-500" /> Discounted / Flash Sale
              </span>
              <div
                className={`w-9 h-5 rounded-full transition-colors p-0.5 ${
                  onSaleOnly ? "bg-rose-500" : "bg-slate-300"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    onSaleOnly ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </div>
            </label>
          </div>
        )}
      </div>

      {/* ================= GROUP 5: CUSTOMER RATING ================= */}
      <div className="border border-slate-200/80 rounded-2xl bg-white overflow-hidden shadow-2xs">
        <button
          type="button"
          onClick={() => toggleSection("ratings")}
          className="w-full flex items-center justify-between p-3.5 bg-slate-50/70 hover:bg-slate-50 transition cursor-pointer text-left"
        >
          <div className="flex items-center gap-2">
            <Star size={14} className="text-amber-500 fill-amber-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Customer Rating
            </span>
            {isRatingActive && (
              <span className="w-2 h-2 rounded-full bg-amber-500" />
            )}
          </div>
          {openSections.ratings ? (
            <ChevronUp size={14} className="text-slate-400" />
          ) : (
            <ChevronDown size={14} className="text-slate-400" />
          )}
        </button>

        {openSections.ratings && (
          <div className="p-3 space-y-1">
            {[
              { label: "All Ratings", val: 0 },
              { label: "4.5★ & higher", val: 4.5 },
              { label: "4.0★ & higher", val: 4.0 },
              { label: "3.5★ & higher", val: 3.5 },
            ].map((r) => (
              <button
                key={r.val}
                type="button"
                onClick={() => setMinRating(r.val)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  minRating === r.val
                    ? "bg-amber-50 text-amber-900 font-bold border border-amber-300"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Star
                    size={13}
                    className={
                      minRating === r.val
                        ? "text-amber-500 fill-amber-500"
                        : "text-slate-300"
                    }
                  />
                  <span>{r.label}</span>
                </div>
                {r.val > 0 && (
                  <span className="text-[10px] text-slate-400">Verified</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div ref={productTopRef} className="py-8 sm:py-12 bg-[#FAFBF9] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* ========================================================= */}
        {/* 1. Header Banner & Quick Category Pills */}
        {/* ========================================================= */}
        <div className="space-y-5 text-left">
          {/* Header Title & Subtitle */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-emerald-950/10 pb-5">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-100 text-[#15803D] text-[11px] font-bold uppercase tracking-wider">
                <Leaf size={12} />
                <span>Farm-Direct Marketplace Catalog</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                {selectedCategory === "all"
                  ? "All Fresh Grocery Aisles"
                  : `${selectedCategory}`}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
                Explore handpicked organic vegetables, farm-fresh dairy, artisan sourdough, and cold-pressed juices delivered in 30 minutes.
              </p>
            </div>

            {/* Quick delivery promise pill */}
            <div className="hidden lg:flex items-center gap-3 bg-white px-4 py-2.5 rounded-2xl border border-emerald-200 shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#15803D] flex items-center justify-center">
                <Clock size={16} />
              </div>
              <div className="text-left text-[11px]">
                <span className="font-bold text-slate-800 block">
                  30-Min Delivery Active
                </span>
                <span className="text-emerald-700 font-semibold">
                  Zero Delivery Fee over ₹35
                </span>
              </div>
            </div>
          </div>

          {/* Horizontal Quick Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categoryPills.map((pill) => {
              const Icon = pill.icon;
              const isSelected =
                pill.id === "all"
                  ? selectedCategory === "all"
                  : selectedCategory.toLowerCase().includes(pill.name.toLowerCase()) ||
                    selectedCategory.toLowerCase() === pill.id.toLowerCase();
              return (
                <button
                  key={pill.id}
                  onClick={() => {
                    setSelectedCategory(pill.id);
                    setCurrentPage(1);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    isSelected
                      ? "bg-[#15803D] text-white shadow-md shadow-emerald-950/20 scale-102"
                      : "bg-white hover:bg-emerald-50/80 text-slate-700 border border-slate-200/80 hover:border-emerald-300"
                  }`}
                >
                  <Icon
                    size={14}
                    className={isSelected ? "text-emerald-200" : "text-[#15803D]"}
                  />
                  <span>{pill.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. Controls Toolbar: Search, Sort, View, Quick Chips */}
        {/* ========================================================= */}
        <div className="bg-white p-3.5 sm:p-4 rounded-3xl border border-slate-200/80 shadow-xs space-y-3 text-left">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            {/* Search Box */}
            <div className="relative w-full md:w-80">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search organic apples, eggs, sourdough..."
                className="w-full pl-10 pr-9 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setDebouncedSearch("");
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Right Toolbar Actions */}
            <div className="flex items-center justify-between md:justify-end gap-2.5 w-full md:w-auto">
              {/* Mobile Filter Drawer Button */}
              <button
                type="button"
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
              >
                <Filter size={14} className="text-[#15803D]" />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-[#15803D] text-white text-[9px] font-black flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <span className="hidden sm:inline font-semibold">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="featured">Featured & Best Value</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Customer Rating</option>
                  <option value="discount">Biggest Savings %</option>
                  <option value="newest">Fresh Harvest Arrival</option>
                </select>
              </div>

              {/* View Mode Switcher: Grid vs List */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200/80">
                <button
                  type="button"
                  onClick={() => setLayout("grid")}
                  aria-label="Grid View"
                  className={`p-1.5 rounded-xl transition cursor-pointer ${
                    layout === "grid"
                      ? "bg-white text-[#15803D] shadow-xs"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <Grid size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setLayout("list")}
                  aria-label="List View"
                  className={`p-1.5 rounded-xl transition cursor-pointer ${
                    layout === "list"
                      ? "bg-white text-[#15803D] shadow-xs"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <ListIcon size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Filter Horizontal Chips (Immediate 1-tap filtering on Mobile & Desktop) */}
          <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
              Quick:
            </span>

            <button
              type="button"
              onClick={() => setOnSaleOnly(!onSaleOnly)}
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition shrink-0 cursor-pointer border ${
                onSaleOnly
                  ? "bg-rose-500 text-white border-rose-500 shadow-2xs"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <Flame size={12} className={onSaleOnly ? "text-white" : "text-rose-500"} />
              <span>On Sale</span>
            </button>

            <button
              type="button"
              onClick={() => toggleDietary("organic")}
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition shrink-0 cursor-pointer border ${
                selectedDietary.includes("organic")
                  ? "bg-[#15803D] text-white border-[#15803D] shadow-2xs"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <Leaf size={12} className={selectedDietary.includes("organic") ? "text-white" : "text-[#15803D]"} />
              <span>Organic</span>
            </button>

            <button
              type="button"
              onClick={() => toggleDietary("vegan")}
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition shrink-0 cursor-pointer border ${
                selectedDietary.includes("vegan")
                  ? "bg-[#15803D] text-white border-[#15803D] shadow-2xs"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <Sparkles size={12} className={selectedDietary.includes("vegan") ? "text-white" : "text-emerald-600"} />
              <span>Vegan</span>
            </button>

            <button
              type="button"
              onClick={() => setInStockOnly(!inStockOnly)}
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition shrink-0 cursor-pointer border ${
                inStockOnly
                  ? "bg-[#15803D] text-white border-[#15803D] shadow-2xs"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <Check size={12} className={inStockOnly ? "text-white" : "text-[#15803D]"} />
              <span>In Stock</span>
            </button>

            <button
              type="button"
              onClick={() => setMinRating(minRating === 4.5 ? 0 : 4.5)}
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition shrink-0 cursor-pointer border ${
                minRating === 4.5
                  ? "bg-amber-500 text-white border-amber-500 shadow-2xs"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <Star size={12} className={minRating === 4.5 ? "text-white fill-white" : "text-amber-500 fill-amber-500"} />
              <span>4.5★+</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (pricePreset === "under-5") {
                  setPricePreset("all");
                } else {
                  setPricePreset("under-5");
                  setAppliedCustomPrice({ min: null, max: null });
                }
              }}
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition shrink-0 cursor-pointer border ${
                pricePreset === "under-5"
                  ? "bg-[#15803D] text-white border-[#15803D] shadow-2xs"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <span>Under ₹5</span>
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* Active Filters Ribbon Chips */}
        {/* ========================================================= */}
        {activeFiltersCount > 0 && (
          <div className="flex items-center gap-2 flex-wrap text-left pt-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Active Filters:
            </span>

            {debouncedSearch && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-200 text-slate-800 text-xs font-medium">
                "{debouncedSearch}"
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setDebouncedSearch("");
                  }}
                  className="hover:text-rose-600 cursor-pointer"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            {selectedCategory !== "all" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-semibold">
                Aisle: {selectedCategory}
                <button
                  type="button"
                  onClick={() => setSelectedCategory("all")}
                  className="hover:text-rose-600 cursor-pointer"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            {selectedDietary.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-[#15803D] border border-emerald-200 text-xs font-semibold capitalize"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => toggleDietary(tag)}
                  className="hover:text-rose-600 cursor-pointer"
                >
                  <X size={12} />
                </button>
              </span>
            ))}

            {(appliedCustomPrice.min !== null || appliedCustomPrice.max !== null) && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-200 text-slate-800 text-xs font-medium">
                ₹{appliedCustomPrice.min || 0} – ₹{appliedCustomPrice.max || "Any"}
                <button
                  type="button"
                  onClick={clearCustomPrice}
                  className="hover:text-rose-600 cursor-pointer"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            {pricePreset !== "all" && appliedCustomPrice.min === null && appliedCustomPrice.max === null && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-200 text-slate-800 text-xs font-medium">
                {pricePresets.find((p) => p.id === pricePreset)?.label}
                <button
                  type="button"
                  onClick={() => setPricePreset("all")}
                  className="hover:text-rose-600 cursor-pointer"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            {inStockOnly && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-semibold">
                In Stock
                <button
                  type="button"
                  onClick={() => setInStockOnly(false)}
                  className="hover:text-rose-600 cursor-pointer"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            {onSaleOnly && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-semibold">
                On Sale
                <button
                  type="button"
                  onClick={() => setOnSaleOnly(false)}
                  className="hover:text-rose-600 cursor-pointer"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            {minRating > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold">
                {minRating}★ & Up
                <button
                  type="button"
                  onClick={() => setMinRating(0)}
                  className="hover:text-rose-600 cursor-pointer"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={resetAllFilters}
              className="text-xs font-bold text-rose-600 hover:underline cursor-pointer ml-1"
            >
              Clear All
            </button>
          </div>
        )}

        {/* ========================================================= */}
        {/* 3. Main Grid Layout (Organized Sidebar + Products) */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Left Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs sticky top-24">
            {FilterSidebarContent}
          </aside>

          {/* Products Column */}
          <section className="lg:col-span-9 space-y-6">
            {/* Result Stats Counter */}
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span>
                Showing{" "}
                <strong className="text-slate-800">
                  {totalItems === 0
                    ? 0
                    : `${(validCurrentPage - 1) * itemsPerPage + 1}–${Math.min(
                        validCurrentPage * itemsPerPage,
                        totalItems
                      )}`}
                </strong>{" "}
                of <strong className="text-slate-800">{totalItems}</strong> organic groceries
              </span>

              {/* Items per page selector */}
              <div className="flex items-center gap-1.5">
                <span className="hidden sm:inline">Per page:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-2 py-1 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value={12}>12</option>
                  <option value={24}>24</option>
                  <option value={36}>36</option>
                </select>
              </div>
            </div>

            {/* Products Container */}
            {paginatedProducts.length > 0 ? (
              layout === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {paginatedProducts.map((product) => (
                    <ProductCard
                      key={product._id || product.id}
                      product={product}
                      layout="grid"
                      onSelect={onSelectProduct}
                      onAddToCart={onAddToCart}
                      onUpdateQuantity={onUpdateQuantity}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {paginatedProducts.map((product) => (
                    <ProductCard
                      key={product._id || product.id}
                      product={product}
                      layout="list"
                      onSelect={onSelectProduct}
                      onAddToCart={onAddToCart}
                      onUpdateQuantity={onUpdateQuantity}
                    />
                  ))}
                </div>
              )
            ) : (
              /* Empty State */
              <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 sm:p-16 text-center space-y-4 shadow-xs">
                <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-[#15803D] flex items-center justify-center mx-auto border border-emerald-100">
                  <Apple size={32} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-900">
                    No Fresh Groceries Found
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    We couldn't find any items matching your active filter criteria. Try adjusting your search query, price range, or dietary preferences.
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="px-6 py-2.5 bg-[#15803D] hover:bg-emerald-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition cursor-pointer shadow-sm"
                  >
                    Reset All Filters
                  </button>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* 4. Pagination Navigation Bar */}
            {/* ========================================================= */}
            {totalPages > 1 && (
              <div className="pt-8 pb-4 flex items-center justify-center gap-2 border-t border-slate-200/80">
                <button
                  type="button"
                  onClick={() => handlePageChange(validCurrentPage - 1)}
                  disabled={validCurrentPage === 1}
                  aria-label="Previous Page"
                  className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-emerald-50 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft size={16} />
                  <span className="hidden sm:inline">Prev</span>
                </button>

                {/* Page Number Buttons */}
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => {
                      return (
                        p === 1 ||
                        p === totalPages ||
                        Math.abs(p - validCurrentPage) <= 1
                      );
                    })
                    .map((page, idx, arr) => {
                      const prev = arr[idx - 1];
                      const hasGap = prev && page - prev > 1;
                      return (
                        <React.Fragment key={page}>
                          {hasGap && (
                            <span className="text-xs text-slate-400 px-1">…</span>
                          )}
                          <button
                            type="button"
                            onClick={() => handlePageChange(page)}
                            className={`w-9 h-9 rounded-xl text-xs font-bold transition cursor-pointer ${
                              validCurrentPage === page
                                ? "bg-[#15803D] text-white shadow-sm"
                                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                            }`}
                          >
                            {page}
                          </button>
                        </React.Fragment>
                      );
                    })}
                </div>

                <button
                  type="button"
                  onClick={() => handlePageChange(validCurrentPage + 1)}
                  disabled={validCurrentPage === totalPages}
                  aria-label="Next Page"
                  className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-emerald-50 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1 cursor-pointer"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </section>
        </div>

        {/* ========================================================= */}
        {/* 5. Mobile Slide-out Filter Drawer */}
        {/* ========================================================= */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop */}
            <div
              onClick={() => setMobileFilterOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            />

            {/* Slide-out Menu */}
            <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl p-5 overflow-y-auto flex flex-col justify-between z-10">
              <div className="space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Filter size={16} className="text-[#15803D]" />
                    <span>Filter Groceries</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setMobileFilterOpen(false)}
                    className="p-1 rounded-xl text-slate-400 hover:text-slate-700"
                  >
                    <X size={20} />
                  </button>
                </div>

                {FilterSidebarContent}
              </div>

              {/* Drawer Apply Footer */}
              <div className="pt-4 border-t border-slate-200 mt-6 space-y-2 sticky bottom-0 bg-white">
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full py-3 bg-[#15803D] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md cursor-pointer hover:bg-emerald-800 transition"
                >
                  View {totalItems} Results
                </button>
                {activeFiltersCount > 0 && (
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="w-full py-1.5 text-slate-500 hover:text-slate-700 text-xs font-semibold cursor-pointer"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
