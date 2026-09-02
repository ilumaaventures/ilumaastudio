import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { getServices, getServiceCategories } from "../../api/serviceService";
import { fetchCategories } from "../../api/categoryService";
import {
  Search,
  MapPin,
  Filter,
  Star,
  Clock,
  Sparkles,
  Calendar,
  ChevronRight,
  ShieldCheck,
  Tag,
  ArrowRight,
  SlidersHorizontal,
  RefreshCw,
  CheckCircle,
  X,
  Building,
  Grid,
  List,
  ChevronLeft,
  RotateCcw,
  Check,
  Package,
  Layers,
} from "lucide-react";
import toast from "react-hot-toast";

const formatDuration = (dur) => {
  if (!dur) return "45 mins";
  if (typeof dur === "string" || typeof dur === "number") return `${dur} mins`;
  if (typeof dur === "object") {
    const val = dur.value || dur.amount || "";
    const unit = dur.unit || dur.unitType || "mins";
    return `${val} ${unit}`.trim() || "45 mins";
  }
  return "45 mins";
};

// Skeleton Card for loading state
function ServiceSkeletonCard() {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 space-y-4 shadow-2xs animate-pulse">
      <div className="h-44 bg-slate-100 rounded-xl" />
      <div className="space-y-2">
        <div className="h-4 bg-slate-200 rounded w-3/4" />
        <div className="h-3 bg-slate-100 rounded w-1/2" />
        <div className="h-4 bg-slate-200 rounded w-1/3 pt-2" />
      </div>
      <div className="h-10 bg-slate-100 rounded-xl w-full" />
    </div>
  );
}

export default function Services() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [servicesLoading, setServicesLoading] = useState(false);

  // Filters State
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "All Categories"
  );
  const [categorySearch, setCategorySearch] = useState("");
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(100000);
  const [minRating, setMinRating] = useState(0);

  // View Controls
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'list'
  const [sortBy, setSortBy] = useState("rating-desc");
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const [showMoreCategories, setShowMoreCategories] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync URL search params
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setSelectedCategory(cat);
    const search = searchParams.get("search");
    if (search) setSearchQuery(search);
  }, [searchParams]);

  // Sync state back to URL
  const updateUrlParams = (newCat, newSearch) => {
    const params = new URLSearchParams();
    if (newCat && newCat !== "All Categories") params.set("category", newCat);
    if (newSearch) params.set("search", newSearch);
    setSearchParams(params, { replace: true });
  };

  // Load Categories & Services
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const [catRes, extraCatRes] = await Promise.all([
          getServiceCategories().catch(() => []),
          fetchCategories({ businessCategory: "SERVICE" }).catch(() => []),
        ]);

        const list1 = Array.isArray(catRes) ? catRes : catRes?.data || [];
        const list2 = Array.isArray(extraCatRes) ? extraCatRes : extraCatRes?.categories || extraCatRes?.data || [];

        // Combine unique categories by name
        const map = new Map();
        [...list1, ...list2].forEach((c) => {
          const name = c.name || c.title;
          if (name && !map.has(name.toLowerCase())) {
            map.set(name.toLowerCase(), {
              _id: c._id || name,
              name,
              icon: c.icon || "Layers",
            });
          }
        });

        setCategories(Array.from(map.values()));
      } catch (err) {
        console.error("Failed to load service categories:", err);
      }
    };

    loadCategories();
  }, []);

  // Fetch Services from API
  const fetchServices = useCallback(async () => {
    try {
      setServicesLoading(true);
      const res = await getServices({ limit: 100 });
      const dataList = res.services || res.data || (Array.isArray(res) ? res : []);
      setServices(dataList);
    } catch (err) {
      console.error("Error loading services:", err);
      toast.error("Failed to load services");
    } finally {
      setLoading(false);
      setServicesLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // Compute category counts dynamically
  const categoryCounts = useMemo(() => {
    const counts = {};
    services.forEach((s) => {
      const catName =
        s.category?.name || s.category?.title || (typeof s.category === "string" ? s.category : "General");
      counts[catName] = (counts[catName] || 0) + 1;
    });
    return counts;
  }, [services]);

  // Filtered & Sorted services
  const filteredServices = useMemo(() => {
    return services
      .filter((s) => {
        // Search Query Filter
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const nameMatch = s.serviceName?.toLowerCase().includes(query) || s.name?.toLowerCase().includes(query);
          const descMatch = s.description?.toLowerCase().includes(query);
          const catMatch = (s.category?.name || typeof s.category === "string" ? s.category : "").toLowerCase().includes(query);
          const bizMatch = s.business?.businessName?.toLowerCase().includes(query);
          if (!nameMatch && !descMatch && !catMatch && !bizMatch) return false;
        }

        // Category Filter
        if (selectedCategory && selectedCategory !== "All Categories") {
          const catName = s.category?.name || s.category?.title || (typeof s.category === "string" ? s.category : "");
          const catId = s.category?._id || "";
          if (
            catName.toLowerCase() !== selectedCategory.toLowerCase() &&
            catId !== selectedCategory
          ) {
            return false;
          }
        }

        // Price Filter
        const price = s.pricing?.amount || s.price || 0;
        if (price < priceMin || price > priceMax) return false;

        // Rating Filter
        const rating = s.rating || s.avgRating || 4.8;
        if (rating < minRating) return false;

        return true;
      })
      .sort((a, b) => {
        const priceA = a.pricing?.amount || a.price || 0;
        const priceB = b.pricing?.amount || b.price || 0;
        const ratingA = a.rating || a.avgRating || 4.8;
        const ratingB = b.rating || b.avgRating || 4.8;

        if (sortBy === "price-asc") return priceA - priceB;
        if (sortBy === "price-desc") return priceB - priceA;
        if (sortBy === "rating-desc") return ratingB - ratingA;
        return 0; // default
      });
  }, [services, searchQuery, selectedCategory, priceMin, priceMax, minRating, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage) || 1;
  const paginatedServices = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredServices.slice(start, start + itemsPerPage);
  }, [filteredServices, currentPage, itemsPerPage]);

  const handleCategorySelect = (catName) => {
    setSelectedCategory(catName);
    setCurrentPage(1);
    updateUrlParams(catName, searchQuery);
  };

  const handleClearFilters = () => {
    setSelectedCategory("All Categories");
    setSearchQuery("");
    setPriceMin(0);
    setPriceMax(100000);
    setMinRating(0);
    setSortBy("rating-desc");
    setCurrentPage(1);
    setSearchParams({}, { replace: true });
  };

  // Category search filter in sidebar
  const visibleCategories = useMemo(() => {
    let list = categories;
    if (categorySearch.trim()) {
      list = list.filter((c) =>
        c.name.toLowerCase().includes(categorySearch.toLowerCase())
      );
    }
    return showMoreCategories ? list : list.slice(0, 7);
  }, [categories, categorySearch, showMoreCategories]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased text-slate-900 pb-16">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Left Sidebar Filter Card (Desktop) */}
          <div className="hidden lg:block lg:col-span-1 space-y-6">
            <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs sticky top-28 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal size={18} className="text-[#004ac6]" />
                  <h3 className="font-black text-slate-900 text-base">Filter Services</h3>
                </div>
                <button
                  onClick={handleClearFilters}
                  className="text-xs font-bold text-[#004ac6] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw size={13} />
                  <span>Reset</span>
                </button>
              </div>

              {/* Categories Accordion Section */}
              <div className="space-y-2">
                <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                  Service Categories
                </label>

                {/* Search category filter */}
                {categories.length > 5 && (
                  <div className="relative mb-2">
                    <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search categories..."
                      value={categorySearch}
                      onChange={(e) => setCategorySearch(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#004ac6]"
                    />
                  </div>
                )}

                <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
                  <button
                    onClick={() => handleCategorySelect("All Categories")}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${selectedCategory === "All Categories"
                      ? "bg-blue-50 text-[#004ac6]"
                      : "text-slate-700 hover:bg-slate-50"
                      }`}
                  >
                    <span>All Categories</span>
                    <span className="text-[10px] text-slate-400 font-bold">{services.length}</span>
                  </button>

                  {visibleCategories.map((cat) => {
                    const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();
                    const count = categoryCounts[cat.name] || 0;
                    return (
                      <button
                        key={cat._id}
                        onClick={() => handleCategorySelect(cat.name)}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${isSelected
                          ? "bg-blue-50 text-[#004ac6] font-bold"
                          : "text-slate-700 hover:bg-slate-50"
                          }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          {isSelected && <Check size={14} className="text-[#004ac6] shrink-0" />}
                          <span className="truncate">{cat.name}</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full shrink-0">
                          {count}
                        </span>
                      </button>
                    );
                  })}

                  {categories.length > 7 && (
                    <button
                      onClick={() => setShowMoreCategories(!showMoreCategories)}
                      className="text-xs font-bold text-[#004ac6] hover:underline pt-1 block"
                    >
                      {showMoreCategories ? "- Show Less" : `+ Show ${categories.length - 7} More`}
                    </button>
                  )}
                </div>
              </div>

              {/* Price Range Slider & Inputs */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                    Price Range (₹)
                  </label>
                  <span className="text-xs font-bold text-[#004ac6]">
                    Up to ₹{priceMax.toLocaleString("en-IN")}
                  </span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="100000"
                  step="500"
                  value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  className="w-full accent-[#004ac6] cursor-pointer"
                />

                <div className="flex items-center gap-2 pt-1">
                  <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs">
                    <span className="text-[10px] text-slate-400 block font-bold">Min Price</span>
                    <span className="font-bold text-slate-800">₹{priceMin}</span>
                  </div>
                  <span className="text-slate-400 text-xs font-bold">-</span>
                  <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs">
                    <span className="text-[10px] text-slate-400 block font-bold">Max Price</span>
                    <span className="font-bold text-slate-800">₹{priceMax.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>

              {/* Minimum Rating Selector */}
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                  Minimum Rating
                </label>
                <div className="space-y-1">
                  {[4, 3, 2, 0].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setMinRating(star)}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${minRating === star
                        ? "bg-amber-50 text-amber-900 border border-amber-200 font-bold"
                        : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                        }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <Star size={13} className="text-amber-500 fill-amber-500" />
                        <span>{star === 0 ? "Any Rating" : `${star} Stars & Above`}</span>
                      </div>
                      {minRating === star && <CheckCircle size={14} className="text-amber-600" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Trust Guarantee Card */}
              <div className="pt-2">
                <div className="bg-blue-50/70 border border-blue-100 p-3.5 rounded-2xl flex items-start gap-3">
                  <ShieldCheck size={20} className="text-[#004ac6] shrink-0 mt-0.5" />
                  <p className="text-[11px] text-slate-700 font-medium leading-relaxed">
                    All service professionals on ILUMAA Studio are identity-verified and quality-audited for complete reliability.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Main Listing Section */}
          <div className="lg:col-span-3 space-y-6">

            {/* Top Toolbar: Search summary, Sort, Grid/List view toggle */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMobileFilterOpen(true)}
                  className="lg:hidden flex items-center gap-1.5 bg-slate-100 text-slate-800 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-slate-200"
                >
                  <Filter size={15} />
                  <span>Filters</span>
                </button>

                <p className="text-xs text-slate-600 font-medium">
                  Showing <span className="font-black text-slate-900">{filteredServices.length}</span> services available
                </p>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                {/* Sort selector */}
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-slate-400 font-bold hidden sm:inline">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none focus:border-[#004ac6] cursor-pointer"
                  >
                    <option value="rating-desc">Highest Rated</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                  </select>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center bg-slate-100 p-1 rounded-xl gap-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === "grid" ? "bg-white text-[#004ac6] shadow-xs" : "text-slate-500 hover:text-slate-900"
                      }`}
                    title="Grid View"
                  >
                    <Grid size={15} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === "list" ? "bg-white text-[#004ac6] shadow-xs" : "text-slate-500 hover:text-slate-900"
                      }`}
                    title="List View"
                  >
                    <List size={15} />
                  </button>
                </div>
              </div>
            </div>

            {/* Loading Skeletons */}
            {servicesLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <ServiceSkeletonCard key={idx} />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!servicesLoading && filteredServices.length === 0 && (
              <div className="bg-white border border-slate-200/90 rounded-3xl p-12 text-center shadow-xs space-y-4">
                <div className="w-16 h-16 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto text-[#004ac6]">
                  <Search size={30} />
                </div>
                <h3 className="text-lg font-black text-slate-900">No Matching Services Found</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto font-medium">
                  We couldn't find any services matching your selected category or filters. Try resetting filters or searching another category.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="bg-[#004ac6] hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-extrabold text-xs transition-all shadow-md cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            )}

            {/* Services Cards Listing */}
            {!servicesLoading && filteredServices.length > 0 && (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                    : "space-y-4"
                }
              >
                {paginatedServices.map((service) => {
                  const sPrice = service.pricing?.amount || service.price || 0;
                  const sRating = service.rating || service.avgRating || 4.9;
                  const sCategoryName =
                    service.category?.name ||
                    service.category?.title ||
                    (typeof service.category === "string" ? service.category : "Service");
                  const sBizName = service.business?.businessName || service.business?.slug || "Verified Partner";
                  const imgUrl =
                    service.images?.[0] ||
                    service.thumbnail ||
                    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80";

                  if (viewMode === "list") {
                    return (
                      <div
                        key={service._id}
                        className="bg-white border border-slate-200/90 hover:border-[#004ac6]/40 rounded-3xl p-4 shadow-xs hover:shadow-lg transition-all flex flex-col sm:flex-row gap-5 group"
                      >
                        <div className="sm:w-48 h-40 rounded-2xl overflow-hidden bg-slate-100 shrink-0 relative">
                          <img
                            src={imgUrl}
                            alt={service.serviceName || service.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur-xs text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
                            {sCategoryName}
                          </div>
                        </div>

                        <div className="flex-1 flex flex-col justify-between space-y-3">
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className="text-[10px] font-black uppercase text-[#004ac6] tracking-wider">
                                {sBizName}
                              </span>
                              <div className="flex items-center gap-1 text-amber-500 font-black text-xs">
                                <Star size={13} className="fill-amber-500" />
                                <span>{sRating}</span>
                              </div>
                            </div>

                            <h3 className="text-base font-black text-slate-900 group-hover:text-[#004ac6] transition-colors">
                              {service.serviceName || service.name}
                            </h3>
                            <p className="text-xs text-slate-500 font-medium line-clamp-2 mt-1">
                              {service.description}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                            <div>
                              <span className="text-[10px] text-slate-400 font-bold block">Starting From</span>
                              <span className="text-lg font-black text-slate-900">₹{sPrice.toLocaleString("en-IN")}</span>
                            </div>

                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1 text-xs text-slate-500 font-bold">
                                <Clock size={13} className="text-[#004ac6]" />
                                <span>{formatDuration(service.duration)}</span>
                              </div>

                              <Link
                                to={`/services/${service._id}`}
                                className="bg-[#004ac6] hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-extrabold transition-all shadow-xs flex items-center gap-1"
                              >
                                <span>Book Now</span>
                                <ArrowRight size={13} />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  // Grid View Card
                  return (
                    <div
                      key={service._id}
                      className="bg-white border border-slate-200/90 hover:border-[#004ac6]/50 rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                    >
                      <div>
                        {/* Thumbnail & Image Badges */}
                        <div className="relative h-44 overflow-hidden bg-slate-100">
                          <img
                            src={imgUrl}
                            alt={service.serviceName || service.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full text-[10px] font-extrabold text-slate-900 shadow-2xs flex items-center gap-1">
                            <Tag size={11} className="text-[#004ac6]" />
                            <span>{sCategoryName}</span>
                          </div>
                          <div className="absolute top-3 right-3 bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full text-[11px] font-black shadow-2xs flex items-center gap-1">
                            <Star size={12} className="fill-slate-950" />
                            <span>{sRating}</span>
                          </div>
                        </div>

                        {/* Card Content */}
                        <div className="p-4 space-y-2">
                          <p className="text-[10px] font-black text-[#004ac6] uppercase tracking-wider truncate">
                            {sBizName}
                          </p>
                          <h3 className="font-black text-slate-900 text-sm group-hover:text-[#004ac6] transition-colors line-clamp-1">
                            {service.serviceName || service.name}
                          </h3>
                          <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">
                            {service.description}
                          </p>
                        </div>
                      </div>

                      {/* Card Footer */}
                      <div className="p-4 pt-0 space-y-3">
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                          <div>
                            <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">Starting Price</span>
                            <span className="text-base font-black text-slate-900">₹{sPrice.toLocaleString("en-IN")}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-slate-500 font-bold">
                            <Clock size={12} className="text-[#004ac6]" />
                            <span>{formatDuration(service.duration)}</span>
                          </div>
                        </div>

                        <Link
                          to={`/services/${service._id}`}
                          className="w-full bg-slate-900 group-hover:bg-[#004ac6] text-white text-center py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 shadow-2xs"
                        >
                          <span>Book Appointment</span>
                          <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pt-6 flex justify-center items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 disabled:opacity-40 hover:bg-white transition-all cursor-pointer shadow-2xs"
                >
                  Previous
                </button>
                <span className="text-xs font-black text-slate-900 px-3">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 disabled:opacity-40 hover:bg-white transition-all cursor-pointer shadow-2xs"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. Mobile Drawer Filter Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-xs bg-white h-full overflow-y-auto p-5 space-y-6 shadow-2xl animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-[#004ac6]" />
                <h3 className="font-black text-slate-900 text-base">Filters</h3>
              </div>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-900"
              >
                <X size={20} />
              </button>
            </div>

            {/* Categories in Mobile Drawer */}
            <div className="space-y-2">
              <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                Select Category
              </label>
              <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
                <button
                  onClick={() => {
                    handleCategorySelect("All Categories");
                    setMobileFilterOpen(false);
                  }}
                  className={`w-full text-left p-2 rounded-xl text-xs font-bold ${selectedCategory === "All Categories" ? "bg-blue-50 text-[#004ac6]" : "text-slate-700"
                    }`}
                >
                  All Services ({services.length})
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() => {
                      handleCategorySelect(cat.name);
                      setMobileFilterOpen(false);
                    }}
                    className={`w-full text-left p-2 rounded-xl text-xs font-semibold ${selectedCategory.toLowerCase() === cat.name.toLowerCase() ? "bg-blue-50 text-[#004ac6] font-bold" : "text-slate-700"
                      }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Apply & Reset Buttons */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full bg-[#004ac6] text-white py-2.5 rounded-xl font-bold text-xs"
              >
                Apply Filters
              </button>
              <button
                onClick={() => {
                  handleClearFilters();
                  setMobileFilterOpen(false);
                }}
                className="w-full bg-slate-100 text-slate-700 py-2 rounded-xl font-bold text-xs"
              >
                Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
