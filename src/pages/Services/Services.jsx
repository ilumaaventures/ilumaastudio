import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { getServices, getServiceCategories } from "../../api/serviceService";
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

export default function Services() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [servicesLoading, setServicesLoading] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || "",
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "",
  );
  const [priceMax, setPriceMax] = useState(50000);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("rating-desc");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Load Categories
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const catRes = await getServiceCategories();
        const cats = Array.isArray(catRes) ? catRes : catRes?.data || [];
        setCategories(cats);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    fetchCats();
  }, []);

  // Fetch Services
  const fetchServices = useCallback(async () => {
    try {
      setServicesLoading(true);
      const params = {
        page: currentPage,
        search: searchQuery,
        category: selectedCategory,
      };
      const res = await getServices(params);
      const dataList =
        res.services || res.data || (Array.isArray(res) ? res : []);
      setServices(dataList);
      setTotalPages(
        res.pages || Math.ceil((res.total || dataList.length) / 9) || 1,
      );
      setTotalItems(res.total || dataList.length || 0);
    } catch (err) {
      console.error("Error loading services:", err);
      toast.error("Failed to load services");
    } finally {
      setLoading(false);
      setServicesLoading(false);
    }
  }, [currentPage, searchQuery, selectedCategory]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchServices();
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setPriceMax(50000);
    setMinRating(0);
    setSortBy("rating-desc");
    setCurrentPage(1);
  };

  // Filtered & Sorted locally if backend parameters are partial
  const filteredServices = services
    .filter((s) => {
      const price = s.pricing?.amount || s.price || 0;
      const rating = s.rating || s.avgRating || 5;
      return price <= priceMax && rating >= minRating;
    })
    .sort((a, b) => {
      const priceA = a.pricing?.amount || a.price || 0;
      const priceB = b.pricing?.amount || b.price || 0;
      const ratingA = a.rating || a.avgRating || 5;
      const ratingB = b.rating || b.avgRating || 5;

      if (sortBy === "price-asc") return priceA - priceB;
      if (sortBy === "price-desc") return priceB - priceA;
      if (sortBy === "rating-desc") return ratingB - ratingA;
      return 0;
    });

  return (
    <div className="min-h-screen bg-gray-50/50 pb-16">
      {/* Category Navigation Pills */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 overflow-x-auto no-scrollbar flex items-center gap-2">
          <button
            onClick={() => setSelectedCategory("")}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === ""
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All Services
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setSelectedCategory(cat._id || cat.name)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat._id || selectedCategory === cat.name
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filter Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 sticky top-20 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal size={18} className="text-indigo-600" />
                  <h3 className="font-bold text-gray-800 text-base">Filters</h3>
                </div>
                <button
                  onClick={clearAllFilters}
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  Reset All
                </button>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="rating-desc">Highest Rated</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>

              {/* Max Price Range */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold text-gray-600 uppercase">
                    Max Price
                  </label>
                  <span className="text-xs font-bold text-indigo-600">
                    ₹{priceMax.toLocaleString("en-IN")}
                  </span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="50000"
                  step="500"
                  value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              {/* Min Rating */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-2">
                  Minimum Rating
                </label>
                <div className="space-y-1.5">
                  {[4, 3, 2, 0].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setMinRating(star)}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-medium transition-colors ${
                        minRating === star
                          ? "bg-amber-50 text-amber-800 border border-amber-200"
                          : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        <Star
                          size={13}
                          className="text-amber-500 fill-amber-500"
                        />
                        <span>
                          {star === 0 ? "Any Rating" : `${star} Stars & Above`}
                        </span>
                      </div>
                      {minRating === star && (
                        <CheckCircle size={14} className="text-amber-600" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 bg-indigo-50/50 p-3 rounded-xl border border-indigo-100 flex items-start gap-2.5">
                <ShieldCheck
                  size={20}
                  className="text-indigo-600 flex-shrink-0 mt-0.5"
                />
                <p className="text-[11px] text-indigo-950 font-medium leading-relaxed">
                  All service providers on ILumaaStudio are verified and
                  background-checked for quality assurance.
                </p>
              </div>
            </div>
          </div>

          {/* Service Cards Grid */}
          <div className="lg:col-span-3">
            {/* Header info bar */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {selectedCategory
                    ? "Filtered Services"
                    : "Available Services"}
                </h2>
                <p className="text-xs text-gray-500">
                  Showing{" "}
                  <span className="font-semibold text-indigo-600">
                    {filteredServices.length}
                  </span>{" "}
                  of {totalItems} verified services
                </p>
              </div>
              <button
                onClick={fetchServices}
                className="p-2 border border-gray-200 bg-white rounded-xl text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
                title="Refresh Listing"
              >
                <RefreshCw size={16} />
              </button>
            </div>

            {/* Loading state */}
            {servicesLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm animate-pulse space-y-4"
                  >
                    <div className="h-44 bg-gray-200 rounded-xl" />
                    <div className="h-5 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-10 bg-gray-200 rounded-xl" />
                  </div>
                ))}
              </div>
            )}

            {/* Empty state */}
            {!servicesLoading && filteredServices.length === 0 && (
              <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center shadow-sm space-y-4">
                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto text-indigo-600">
                  <Search size={32} />
                </div>
                <h3 className="text-lg font-bold text-gray-800">
                  No Services Found
                </h3>
                <p className="text-xs text-gray-500 max-w-md mx-auto">
                  We couldn't find any services matching your current filters or
                  search query. Try clearing your filters or searching for
                  something else.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium text-xs transition-colors shadow-md shadow-indigo-600/20"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Service Cards */}
            {!servicesLoading && filteredServices.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.map((service) => (
                  <div
                    key={service._id}
                    className="bg-white border border-gray-200/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
                  >
                    {/* Thumbnail Image */}
                    <div className="relative h-48 overflow-hidden bg-gray-100">
                      <img
                        src={
                          service.images?.[0] ||
                          service.thumbnail ||
                          "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80"
                        }
                        alt={service.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-800 shadow-sm flex items-center gap-1">
                        <Tag size={11} className="text-indigo-600" />
                        {service.category?.name || "Service"}
                      </div>
                      <div className="absolute top-3 right-3 bg-amber-400 text-slate-950 px-2.5 py-1 rounded-full text-[11px] font-bold shadow-md flex items-center gap-1">
                        <Star size={12} className="fill-slate-950" />
                        {service.rating || service.avgRating || 4.9}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        {service.business?.businessName && (
                          <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider mb-1 flex items-center gap-1">
                            <Building size={11} />
                            {service.business.businessName}
                          </p>
                        )}
                        <h3 className="font-bold text-gray-800 text-base group-hover:text-indigo-600 transition-colors line-clamp-1">
                          {service.serviceName}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                          {service.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-gray-400 block font-medium">
                            Starting from
                          </span>
                          <span className="text-lg font-extrabold text-slate-900">
                            ₹
                            {(
                              service.pricing?.amount ||
                              service.price ||
                              0
                            ).toLocaleString("en-IN")}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                          <Clock size={13} className="text-indigo-600" />
                          <span>{formatDuration(service.duration)}</span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <Link
                        to={`/services/${service._id}`}
                        className="w-full bg-slate-900 group-hover:bg-indigo-600 text-white text-center py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        Book Appointment
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-10 flex justify-center items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-4 py-2 border rounded-xl text-xs font-semibold text-gray-600 disabled:opacity-40 hover:bg-white transition-colors"
                >
                  Previous
                </button>
                <span className="text-xs font-bold text-gray-700 px-3">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  className="px-4 py-2 border rounded-xl text-xs font-semibold text-gray-600 disabled:opacity-40 hover:bg-white transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
