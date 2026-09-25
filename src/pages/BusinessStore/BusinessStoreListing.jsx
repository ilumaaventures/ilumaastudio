import React, { useState, useEffect, useMemo } from "react";
import {
  MapPin,
  Star,
  ArrowUpRight,
  BadgeCheck,
  Building2,
  ChevronRight,
  Store,
  Search,
  Filter,
  SlidersHorizontal,
  X,
  Grid,
  List,
  RotateCcw,
  Sparkles,
  Globe,
  Mail,
  Phone,
  Check,
} from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { fetchAllMarketplaceStores } from "../../api/storeApi";
import { fetchBusinessCategories } from "../../api/categoryService";
import { StoreGridSkeleton } from "../../Components/Skeletons";
import { BASE_URL } from "../../api/baseApi";
import toast from "react-hot-toast";

/* =========================================================
   IMAGE RESOLVER HELPER
========================================================= */
const resolveImg = (url) => {
  if (!url) return null;
  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("data:")
  ) {
    return url;
  }
  return `${BASE_URL}/${url.replace(/^\/+/, "")}`;
};

export default function BusinessStoreListing() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Stores and Categories state (Real Backend API only)
  const [stores, setStores] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || "",
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "all",
  );
  const [selectedCity, setSelectedCity] = useState(
    searchParams.get("city") || "all",
  );
  const [minRating, setMinRating] = useState(
    Number(searchParams.get("rating")) || 0,
  );
  const [verifiedOnly, setVerifiedOnly] = useState(
    searchParams.get("verified") === "true",
  );
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "popular");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'list'
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  /* =========================================================
     1. FETCH REAL STORES & CATEGORIES FROM BACKEND API
  ========================================================= */
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setLoading(true);

        const [storeRes, catRes] = await Promise.all([
          fetchAllMarketplaceStores({ anySlugType: true }),
          fetchBusinessCategories(),
        ]);

        if (!isMounted) return;

        // 1. Process Stores
        const list = Array.isArray(storeRes)
          ? storeRes
          : storeRes?.stores || storeRes?.data || [];

        const formatted = list.map((s, idx) => {
          const rawSlug =
            s.slugName ||
            (typeof s.slug === "object" ? s.slug?.slugName : s.slug) ||
            s.businessSlug ||
            s.subdomain ||
            (s.businessName || s.name || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

          const slugType =
            s.slugType ||
            (typeof s.slug === "object" ? s.slug?.slugType : null) ||
            "path";

          const customDomain =
            s.customDomain ||
            (typeof s.slug === "object" ? s.slug?.customDomain : null) ||
            (s.website && s.website.includes(".") ? s.website.trim() : null);

          const isCustomDomain = slugType === "custom" && Boolean(customDomain);
          const hasStorefront = Boolean(isCustomDomain || (rawSlug && rawSlug !== "store" && rawSlug.length > 0));

          const categoryName =
            (typeof s.businessCategory === "object"
              ? s.businessCategory?.name
              : s.businessCategory) ||
            (typeof s.category === "object" ? s.category?.name : s.category) ||
            "Retail & Commerce";

          const businessTypeName =
            (typeof s.businessType === "object"
              ? s.businessType?.name
              : s.businessType) || "";

          const city =
            s.city ||
            s.address?.city ||
            (typeof s.location === "object" ? s.location?.city : null) ||
            "";

          const state =
            s.state ||
            s.address?.state ||
            (typeof s.location === "object" ? s.location?.state : null) ||
            "";

          const locationLabel =
            [city, state].filter(Boolean).join(", ") ||
            (typeof s.location === "string" ? s.location : "") ||
            "Verified Location";

          return {
            _id: s._id || `store_${idx}`,
            name:
              s.businessName || s.name || s.tradeName || "Local Merchant Store",
            storeName: s.tradeName || s.businessName || s.name || "Merchant",
            slug: rawSlug,
            slugName: rawSlug,
            slugType,
            customDomain,
            isCustomDomain,
            hasStorefront,
            category: categoryName,
            businessType: businessTypeName,
            description: s.description || "",
            rating: Number(s.rating) || 4.8,
            reviews: Number(s.reviewsCount) || 12,
            city: city.trim(),
            location: locationLabel,
            image:
              resolveImg(s.logo) ||
              resolveImg(s.banner) ||
              "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80",
            status: s.status || "active",
            verified: s.status === "active" || s.status === "Active" || Boolean(s.isVerified),
            email: s.businessEmail || "",
            phone: s.businessPhone || "",
            website: s.website || "",
            createdAt: s.createdAt || null,
          };
        });

        setStores(formatted);

        // 2. Process Business Categories
        const catList = Array.isArray(catRes)
          ? catRes
          : catRes?.data || catRes?.categories || [];
        setCategories(catList);
      } catch (err) {
        console.error("Failed to load stores from API:", err);
        if (isMounted) {
          setStores([]);
          setCategories([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  /* =========================================================
     2. DERIVED UNIQUE CITIES FROM ACTUAL DATA
  ========================================================= */
  const availableCities = useMemo(() => {
    const citySet = new Set();
    stores.forEach((s) => {
      if (s.city) {
        citySet.add(s.city);
      }
    });
    return Array.from(citySet).sort();
  }, [stores]);

  /* =========================================================
     3. DERIVED CATEGORY COUNTS
  ========================================================= */
  const categoryCounts = useMemo(() => {
    const counts = {};
    stores.forEach((s) => {
      const cat = s.category || "Other";
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [stores]);

  /* =========================================================
     4. FILTER & SORT STORES
  ========================================================= */
  const filteredStores = useMemo(() => {
    return stores
      .filter((store) => {
        // Search Filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = store.name.toLowerCase().includes(q);
          const matchCat = store.category.toLowerCase().includes(q);
          const matchCity = store.location.toLowerCase().includes(q);
          const matchDesc = store.description.toLowerCase().includes(q);
          if (!matchName && !matchCat && !matchCity && !matchDesc) {
            return false;
          }
        }

        // Category Filter
        if (
          selectedCategory !== "all" &&
          store.category.toLowerCase() !== selectedCategory.toLowerCase()
        ) {
          return false;
        }

        // City Filter
        if (
          selectedCity !== "all" &&
          store.city.toLowerCase() !== selectedCity.toLowerCase()
        ) {
          return false;
        }

        // Rating Filter
        if (minRating > 0 && store.rating < minRating) {
          return false;
        }

        // Verified Filter
        if (verifiedOnly && !store.verified) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "rating") {
          return b.rating - a.rating;
        }
        if (sortBy === "name_asc") {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === "newest") {
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        }
        // "popular"
        return b.reviews - a.reviews;
      });
  }, [
    stores,
    searchQuery,
    selectedCategory,
    selectedCity,
    minRating,
    verifiedOnly,
    sortBy,
  ]);

  /* =========================================================
     5. RESET FILTERS
  ========================================================= */
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedCity("all");
    setMinRating(0);
    setVerifiedOnly(false);
    setSortBy("popular");
  };

  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
    selectedCategory !== "all" ||
    selectedCity !== "all" ||
    minRating > 0 ||
    verifiedOnly;

  /* =========================================================
     6. STORE NAVIGATION (Matches Home Page Local Shop Section)
     Checks slug and related storefront info; if exists navigates,
     if not exists, does not navigate.
  ========================================================= */
  const handleStoreNavigate = (store, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const slugType =
      store.slugType ||
      (typeof store.slug === "object" ? store.slug?.slugType : null) ||
      "path";

    const customDomain =
      store.customDomain ||
      (typeof store.slug === "object" ? store.slug?.customDomain : null);

    const isCustomDomain = slugType === "custom" && Boolean(customDomain);

    const shopSlug =
      store.slugName ||
      (typeof store.slug === "object" ? store.slug?.slugName : store.slug) ||
      store.businessSlug ||
      store.subdomain ||
      (store.name && store.name !== "Local Merchant Store"
        ? store.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
        : "");

    // 1. External Custom Domain: act according to home page local shop section
    if (isCustomDomain && customDomain) {
      const cleanUrl = customDomain.trim().startsWith("http")
        ? customDomain.trim()
        : `https://${customDomain.trim()}`;
      window.open(cleanUrl, "_blank", "noopener,noreferrer");
      return;
    }

    // 2. Internal Storefront: act according to home page local shop section (/:shopSlug)
    if (shopSlug && shopSlug !== "store" && shopSlug.trim()) {
      navigate(`/${shopSlug}`);
      return;
    }

    // 3. If neither exists, DO NOT navigate!
    toast.error(`Storefront is not yet configured for ${store.name || "this business"}.`);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-200 transition-colors pb-20">
      {/* =====================================================
          HEADER SECTION (Similar to Shop & Services)
      ===================================================== */}
      <div className="border-b border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Left: Breadcrumbs & Title */}
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                <Link to="/" className="hover:text-[#2563eb] transition-colors">
                  Home
                </Link>
                <ChevronRight size={12} className="text-slate-400" />
                <span className="text-slate-900 dark:text-white font-bold">
                  Business Directory
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/40 text-[#2563eb]">
                  <Store size={22} />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                    Registered Businesses & Stores
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                    Browse all registered businesses, artisan stores and partners on ILumaa ({filteredStores.length} stores)
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Search & Actions */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search stores, category, city..."
                  className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              <Link
                to="/businessRegistration"
                className="hidden sm:inline-flex items-center gap-1.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm shrink-0"
              >
                <Building2 size={15} />
                <span>Register Shop</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          MAIN CONTENT WITH SIDEBAR & STORES GRID
      ===================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* =================================================
              DESKTOP FILTER SIDEBAR
          ================================================= */}
          <aside className="hidden lg:block lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6 sticky top-28">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
                  <SlidersHorizontal size={16} className="text-[#2563eb]" />
                  <span>Filters</span>
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="text-xs text-[#2563eb] hover:underline font-semibold flex items-center gap-1"
                  >
                    <RotateCcw size={12} />
                    <span>Reset</span>
                  </button>
                )}
              </div>

              {/* 1. Category Filter */}
              <div className="space-y-3">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Store Category
                </span>

                <div className="max-h-56 space-y-1 overflow-y-auto pr-1 scrollbar-thin">
                  {/* All Categories */}
                  <button
                    type="button"
                    onClick={() => setSelectedCategory("all")}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs transition-all ${
                      selectedCategory === "all"
                        ? "bg-blue-50 font-bold text-[#2563eb] dark:bg-slate-800 dark:text-blue-400"
                        : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/60"
                    }`}
                  >
                    <span>All Categories</span>

                    <span
                      className={`text-[10px] font-semibold ${
                        selectedCategory === "all"
                          ? "text-blue-500"
                          : "text-slate-400"
                      }`}
                    >
                      {stores.length}
                    </span>
                  </button>

                  {/* Categories */}
                  {[
                    "E-commerce",
                    "Education",
                    "Health",
                    "Retail",
                    "Technology",
                    "Food & Beverage",
                    "Supply Chain",
                    "Automobile",
                  ].map((cat) => {
                    const count = categoryCounts[cat] || 0;
                    const isSelected =
                      selectedCategory.toLowerCase() === cat.toLowerCase();

                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategory(cat)}
                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs transition-all ${
                          isSelected
                            ? "bg-blue-50 font-bold text-[#2563eb] dark:bg-slate-800 dark:text-blue-400"
                            : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/60"
                        }`}
                      >
                        <span className="truncate pr-3">{cat}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              {/* 2. City / Location Filter */}
              {availableCities.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    City / Location
                  </span>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-2.5 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#2563eb]/20"
                  >
                    <option value="all">All Locations</option>
                    {availableCities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* 3. Rating Filter */}
              <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Customer Rating
                </span>
                <div className="space-y-1.5">
                  {[
                    { label: "All Ratings", val: 0 },
                    { label: "4.5★ & above", val: 4.5 },
                    { label: "4.0★ & above", val: 4.0 },
                    { label: "3.5★ & above", val: 3.5 },
                  ].map((rate) => (
                    <label
                      key={rate.val}
                      onClick={() => setMinRating(rate.val)}
                      className={`flex items-center gap-2 text-xs px-2.5 py-1.5 rounded-xl cursor-pointer transition-colors ${
                        minRating === rate.val
                          ? "bg-blue-50 dark:bg-slate-800 text-[#2563eb] font-bold"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                      }`}
                    >
                      <input
                        type="radio"
                        name="rating"
                        checked={minRating === rate.val}
                        onChange={() => setMinRating(rate.val)}
                        className="rounded-full text-[#2563eb] focus:ring-[#2563eb]"
                      />
                      <span>{rate.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 4. Verified Only Toggle */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
                    <BadgeCheck size={16} className="text-[#2563eb]" />
                    <span>Verified Only</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={verifiedOnly}
                    onChange={(e) => setVerifiedOnly(e.target.checked)}
                    className="w-4 h-4 rounded text-[#2563eb] accent-[#2563eb] cursor-pointer"
                  />
                </label>
              </div>
            </div>
          </aside>

          {/* =================================================
              MAIN STORE LISTINGS
          ================================================= */}
          <main className="lg:col-span-3 space-y-6">
            {/* Toolbar Header (Sort, Views, Mobile Filter trigger) */}
            <div className="flex items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl px-4 py-3 shadow-xs">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200"
              >
                <Filter size={13} className="text-[#2563eb]" />
                <span>Filters</span>
                {hasActiveFilters && (
                  <span className="w-2 h-2 rounded-full bg-[#2563eb]" />
                )}
              </button>

              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Showing{" "}
                <span className="text-slate-900 dark:text-white font-bold">
                  {filteredStores.length}
                </span>{" "}
                {filteredStores.length === 1 ? "store" : "stores"}
              </div>

              {/* Right Controls: Sort & Grid/List view */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <span className="hidden sm:inline">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-hidden"
                  >
                    <option value="popular">Most Popular</option>
                    <option value="rating">Top Rated</option>
                    <option value="newest">Newest First</option>
                    <option value="name_asc">Name: A to Z</option>
                  </select>
                </div>

                <div className="hidden sm:flex items-center border border-slate-200 dark:border-slate-800 rounded-xl p-0.5 bg-slate-50 dark:bg-slate-800">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 rounded-lg transition-colors ${
                      viewMode === "grid"
                        ? "bg-white dark:bg-slate-700 text-[#2563eb] shadow-xs"
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                    title="Grid View"
                  >
                    <Grid size={15} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 rounded-lg transition-colors ${
                      viewMode === "list"
                        ? "bg-white dark:bg-slate-700 text-[#2563eb] shadow-xs"
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                    title="List View"
                  >
                    <List size={15} />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filter Chips */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-semibold text-slate-400">
                  Active Filters:
                </span>
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-slate-800 text-[11px] font-bold text-[#2563eb]">
                    "{searchQuery}"
                    <button onClick={() => setSearchQuery("")}>
                      <X size={12} />
                    </button>
                  </span>
                )}
                {selectedCategory !== "all" && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-slate-800 text-[11px] font-bold text-[#2563eb]">
                    {selectedCategory}
                    <button onClick={() => setSelectedCategory("all")}>
                      <X size={12} />
                    </button>
                  </span>
                )}
                {selectedCity !== "all" && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-slate-800 text-[11px] font-bold text-[#2563eb]">
                    City: {selectedCity}
                    <button onClick={() => setSelectedCity("all")}>
                      <X size={12} />
                    </button>
                  </span>
                )}
                {minRating > 0 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-slate-800 text-[11px] font-bold text-[#2563eb]">
                    {minRating}★+
                    <button onClick={() => setMinRating(0)}>
                      <X size={12} />
                    </button>
                  </span>
                )}
                {verifiedOnly && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-slate-800 text-[11px] font-bold text-[#2563eb]">
                    Verified
                    <button onClick={() => setVerifiedOnly(false)}>
                      <X size={12} />
                    </button>
                  </span>
                )}
                <button
                  onClick={resetFilters}
                  className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white underline ml-1"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Loading Skeleton */}
            {loading ? (
              <StoreGridSkeleton count={6} />
            ) : filteredStores.length === 0 ? (
              /* Empty State (Honest Real Empty State) */
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-12 text-center space-y-4 shadow-xs">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-[#2563eb] flex items-center justify-center mx-auto text-2xl">
                  🏪
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    {hasActiveFilters
                      ? "No stores match your current filters"
                      : "No registered business stores found"}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto font-medium">
                    {hasActiveFilters
                      ? "Try broadening your search term, resetting category selections, or adjusting your location."
                      : "Be the first merchant to launch your digital store on ILUMAAStudio."}
                  </p>
                </div>
                {hasActiveFilters ? (
                  <button
                    onClick={resetFilters}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-[#2563eb] text-white text-xs font-bold transition-all shadow-xs"
                  >
                    <RotateCcw size={14} />
                    <span>Reset All Filters</span>
                  </button>
                ) : (
                  <Link
                    to="/businessRegistration"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-bold transition-all shadow-md"
                  >
                    <Building2 size={15} />
                    <span>Register Your Business</span>
                  </Link>
                )}
              </div>
            ) : (
              /* Stores Grid / List */
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                    : "space-y-4"
                }
              >
                {filteredStores.map((store) => {
                  // List View Layout
                  if (viewMode === "list") {
                    return (
                      <div
                        key={store._id}
                        onClick={(e) => handleStoreNavigate(store, e)}
                        className={`group bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 hover:shadow-md hover:border-[#2563eb]/40 transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 ${
                          store.hasStorefront ? "cursor-pointer" : "cursor-default"
                        }`}
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200/60 dark:border-slate-700">
                            <img
                              src={store.image}
                              alt={store.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <div className="min-w-0 space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-black text-base text-slate-900 dark:text-white truncate">
                                {store.name}
                              </h3>
                              <BadgeCheck
                                size={15}
                                className={store.verified ? "text-[#2563eb] shrink-0" : "text-emerald-600 shrink-0"}
                                title={store.verified ? "Verified Merchant" : "Registered Business"}
                              />
                            </div>
                            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                              <span className="font-semibold text-[#2563eb]">
                                {store.category}
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <MapPin size={12} className="text-slate-400" />
                                {store.location}
                              </span>
                            </div>
                            {store.description && (
                              <p className="text-xs text-slate-500 line-clamp-1">
                                {store.description}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-4 self-end sm:self-center shrink-0">
                          <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 px-2 py-1 rounded-lg font-bold text-amber-700 dark:text-amber-400 text-xs">
                            <Star
                              size={12}
                              className="fill-amber-400 text-amber-400"
                            />
                            <span>{store.rating}</span>
                            <span className="text-slate-400 font-normal">
                              ({store.reviews})
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => handleStoreNavigate(store, e)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                              store.hasStorefront
                                ? "bg-slate-900 dark:bg-slate-800 hover:bg-[#2563eb] text-white cursor-pointer shadow-xs"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border border-slate-200/60 dark:border-slate-700/60"
                            }`}
                          >
                            <span>{store.hasStorefront ? "Visit Store" : "Coming Soon"}</span>
                            {store.hasStorefront && <ChevronRight size={14} />}
                          </button>
                        </div>
                      </div>
                    );
                  }

                  // Grid View Layout
                  return (
                    <div
                      key={store._id}
                      onClick={(e) => handleStoreNavigate(store, e)}
                      className={`group bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs hover:shadow-xl hover:border-[#2563eb]/40 transition-all duration-300 flex flex-col justify-between ${
                        store.hasStorefront ? "cursor-pointer" : "cursor-default"
                      }`}
                    >
                      {/* Store Banner / Image */}
                      <div>
                        <div className="relative h-44 sm:h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
                          <img
                            src={store.image}
                            alt={store.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                          {/* Top Badges */}
                          <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                            <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1 shadow-sm">
                              <BadgeCheck
                                size={13}
                                className={store.verified ? "text-[#2563eb]" : "text-emerald-600"}
                              />
                              <span className={store.verified ? "text-[#2563eb]" : "text-emerald-700 dark:text-emerald-400"}>
                                {store.verified ? "Verified Merchant" : "Registered Business"}
                              </span>
                            </div>

                            <div className="w-8 h-8 rounded-full bg-white/90 dark:bg-slate-900/90 flex items-center justify-center text-slate-800 dark:text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                              <ArrowUpRight size={15} />
                            </div>
                          </div>

                          {/* Bottom Title on Image */}
                          <div className="absolute bottom-3 inset-x-3 text-white">
                            <h3 className="font-black text-lg text-white leading-tight truncate">
                              {store.name}
                            </h3>
                          </div>
                        </div>

                        {/* Store Body Details */}
                        <div className="p-5 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-slate-800 text-[#2563eb] font-bold text-[10px] uppercase tracking-wider">
                              {store.category}
                            </span>

                            <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md font-bold text-amber-700 dark:text-amber-400 text-[11px]">
                              <Star
                                size={11}
                                className="fill-amber-400 text-amber-400"
                              />
                              <span>{store.rating}</span>
                              <span className="text-slate-400 font-normal">
                                ({store.reviews})
                              </span>
                            </div>
                          </div>

                          {store.description && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                              {store.description}
                            </p>
                          )}

                          <div className="space-y-1.5 pt-1 text-xs">
                            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium">
                              <MapPin
                                size={13}
                                className="text-slate-400 shrink-0"
                              />
                              <span className="truncate">{store.location}</span>
                            </div>

                            {store.businessType && (
                              <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                                <Building2 size={12} className="shrink-0" />
                                <span>Type: {store.businessType}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Store Footer Action */}
                      <div className="px-5 pb-5 pt-2">
                        <button
                          type="button"
                          onClick={(e) => handleStoreNavigate(store, e)}
                          className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs ${
                            store.hasStorefront
                              ? "bg-slate-900 dark:bg-slate-800 hover:bg-[#2563eb] text-white cursor-pointer"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border border-slate-200/60 dark:border-slate-700/60"
                          }`}
                        >
                          <span>{store.hasStorefront ? "Visit Storefront" : "Coming Soon"}</span>
                          {store.hasStorefront && <ChevronRight size={14} />}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* =====================================================
          MOBILE FILTER DRAWER
      ===================================================== */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileFilterOpen(false)}
          />

          {/* Drawer content */}
          <div className="relative ml-auto w-full max-w-xs bg-white dark:bg-slate-900 h-full p-6 shadow-2xl overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                <Filter size={16} className="text-[#2563eb]" />
                <span>Filter Stores</span>
              </div>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Mobile Category */}
            <div className="space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Category
              </span>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`w-full text-left text-xs px-3 py-2 rounded-xl font-medium ${
                    selectedCategory === "all"
                      ? "bg-blue-50 dark:bg-slate-800 text-[#2563eb] font-bold"
                      : "text-slate-600 dark:text-slate-400"
                  }`}
                >
                  All Categories
                </button>
                {Object.keys(categoryCounts).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left text-xs px-3 py-2 rounded-xl font-medium ${
                      selectedCategory.toLowerCase() === cat.toLowerCase()
                        ? "bg-blue-50 dark:bg-slate-800 text-[#2563eb] font-bold"
                        : "text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {cat} ({categoryCounts[cat]})
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile City */}
            {availableCities.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  City
                </span>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-2.5"
                >
                  <option value="all">All Locations</option>
                  {availableCities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Mobile Verified */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Verified Only
                </span>
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="w-4 h-4 rounded text-[#2563eb] accent-[#2563eb]"
                />
              </label>
            </div>

            {/* Drawer Actions */}
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-2">
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-3 rounded-xl bg-[#2563eb] text-white text-xs font-bold shadow-md"
              >
                Apply Filters ({filteredStores.length} Stores)
              </button>
              {hasActiveFilters && (
                <button
                  onClick={() => {
                    resetFilters();
                    setIsMobileFilterOpen(false);
                  }}
                  className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400"
                >
                  Reset All
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
