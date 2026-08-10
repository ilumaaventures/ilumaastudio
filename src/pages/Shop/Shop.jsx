import React, { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Heart,
  ShoppingCart,
  Star,
  Grid,
  List,
  ChevronRight,
  ChevronLeft,
  Search,
  Filter,
  ArrowUp,
  RotateCcw,
  ShieldCheck,
  Truck,
  Headphones,
  Check,
  ArrowRight,
  X,
  SlidersHorizontal,
  Package,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/reducers/cartReducer";
import { toggleWishlist } from "../../redux/reducers/wishlistReducer";
import toast from "react-hot-toast";
import { getallProducts } from "../../api/productService";
import { fetchCategories } from "../../api/categoryService";

// Helper to extract category name from backend product object or string
const getCategoryName = (product) => {
  if (!product) return "General";
  if (product.category && typeof product.category === "object") {
    return product.category.name || product.category.title || "General";
  }
  if (typeof product.category === "string" && product.category.trim() !== "") {
    return product.category;
  }
  return "General";
};

// Skeleton Card for loading state
function ProductSkeletonCard() {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3 space-y-3 animate-pulse">
      <div className="aspect-square bg-slate-100 dark:bg-slate-800 rounded-lg" />
      <div className="space-y-1.5">
        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
        <div className="h-2 bg-slate-100 dark:bg-slate-800/60 rounded w-1/2" />
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3 pt-1" />
        <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded-lg w-full mt-2" />
      </div>
    </div>
  );
}

export default function ShopPage() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const wishlistItems = useSelector((s) => s.wishlist?.items || []);

  // API Backend Data States
  const [apiProducts, setApiProducts] = useState([]);
  const [apiCategories, setApiCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || "",
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "All Categories",
  );
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(500000);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [brandSearch, setBrandSearch] = useState("");
  const [selectedRating, setSelectedRating] = useState(0);

  // Mobile / Tablet Drawer State
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // View Controls
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'list'
  const [sortBy, setSortBy] = useState("Popularity");
  const [itemsPerPage, setItemsPerPage] = useState(24);
  const [currentPage, setCurrentPage] = useState(1);
  const [showMoreCategories, setShowMoreCategories] = useState(false);
  const [showMoreBrands, setShowMoreBrands] = useState(false);

  // Sync URL search params
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setSelectedCategory(cat);
    const search = searchParams.get("search");
    if (search) setSearchQuery(search);
  }, [searchParams]);

  // Fetch strictly from backend API
  useEffect(() => {
    const loadBackendData = async () => {
      try {
        setLoading(true);
        const [prodRes, catRes] = await Promise.all([
          getallProducts({ productType: "E-Commerce", limit: 100 }),
          fetchCategories({ businessType: "E-Commerce" }),
        ]);

        const pList =
          prodRes?.products ||
          prodRes?.data ||
          (Array.isArray(prodRes) ? prodRes : []);
        const cList =
          catRes?.categories ||
          catRes?.data ||
          (Array.isArray(catRes) ? catRes : []);

        setApiProducts(pList);
        setApiCategories(cList);
      } catch (err) {
        console.error("Error fetching backend shop data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadBackendData();
  }, []);

  // Format backend products into uniform list
  const backendProductsFormatted = useMemo(() => {
    return apiProducts.map((p, idx) => {
      const catName = getCategoryName(p);
      const brandName =
        p.brand || p.vendor?.storeName || p.vendor?.name || "ILumaa";
      const imgUrl =
        p.images?.[0]?.url ||
        p.image ||
        (Array.isArray(p.images) && typeof p.images[0] === "string"
          ? p.images[0]
          : null) ||
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400&auto=format&fit=crop";

      return {
        _id: p._id || `backend_${idx}`,
        name: p.name || "Untitled Product",
        subtitle: p.subtitle || catName,
        category: catName,
        price: Number(p.price) || 0,
        originalPrice:
          p.originalPrice ||
          (p.price ? Math.round(Number(p.price) * 1.2) : null),
        discount:
          p.discount ||
          (p.originalPrice
            ? `${Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)}%`
            : ""),
        rating: Number(p.rating) || 4.5,
        reviewsCount: p.numReviews || p.reviews?.length || 12,
        brand: brandName,
        inStock: p.countInStock !== 0,
        isBestseller: p.isBestseller || false,
        image: imgUrl,
        raw: p,
      };
    });
  }, [apiProducts]);

  // Compute Categories dynamically from backend categories + products
  const categoryListCombined = useMemo(() => {
    const map = new Map();
    map.set("All Categories", backendProductsFormatted.length);

    // Add API category names
    apiCategories.forEach((c) => {
      const name = c.name || c.title;
      if (name) map.set(name, 0);
    });

    // Count products per category
    backendProductsFormatted.forEach((p) => {
      const cName = p.category;
      if (cName) {
        map.set(cName, (map.get(cName) || 0) + 1);
      }
    });

    return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
  }, [apiCategories, backendProductsFormatted]);

  // Compute Brands dynamically from backend products
  const brandListCombined = useMemo(() => {
    const map = new Map();
    backendProductsFormatted.forEach((p) => {
      if (p.brand) {
        map.set(p.brand, (map.get(p.brand) || 0) + 1);
      }
    });
    return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
  }, [backendProductsFormatted]);

  // Filter & Sort Backend Products
  const filteredProducts = useMemo(() => {
    return backendProductsFormatted
      .filter((p) => {
        // Search Filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = p.name.toLowerCase().includes(q);
          const matchesBrand = p.brand?.toLowerCase().includes(q);
          const matchesCat = p.category?.toLowerCase().includes(q);
          if (!matchesName && !matchesBrand && !matchesCat) return false;
        }

        // Category Filter
        if (
          selectedCategory &&
          selectedCategory !== "All Categories" &&
          selectedCategory !== "All" &&
          selectedCategory !== ""
        ) {
          const catLower = p.category.toLowerCase();
          const targetLower = selectedCategory.toLowerCase();
          if (
            !catLower.includes(targetLower) &&
            !targetLower.includes(catLower)
          ) {
            return false;
          }
        }

        // Price Filter
        if (p.price < priceMin || p.price > priceMax) return false;

        // Brand Filter
        if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) {
          return false;
        }

        // Rating Filter
        if (selectedRating > 0 && p.rating < selectedRating) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "Price: Low to High") return a.price - b.price;
        if (sortBy === "Price: High to Low") return b.price - a.price;
        if (sortBy === "Rating") return b.rating - a.rating;
        if (sortBy === "Newest")
          return String(b._id).localeCompare(String(a._id));
        return b.rating - a.rating; // Default Popularity
      });
  }, [
    backendProductsFormatted,
    searchQuery,
    selectedCategory,
    priceMin,
    priceMax,
    selectedBrands,
    selectedRating,
    sortBy,
  ]);

  // Pagination calculation
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  // Active Filter Count Calculation
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory && selectedCategory !== "All Categories") count++;
    if (searchQuery.trim()) count++;
    if (selectedBrands.length > 0) count += selectedBrands.length;
    if (selectedRating > 0) count++;
    if (priceMin > 0 || priceMax < 500000) count++;
    return count;
  }, [
    selectedCategory,
    searchQuery,
    selectedBrands,
    selectedRating,
    priceMin,
    priceMax,
  ]);

  // Handlers
  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All Categories");
    setPriceMin(0);
    setPriceMax(500000);
    setSelectedBrands([]);
    setSelectedRating(0);
    setCurrentPage(1);
    setSearchParams({});
  };

  const handleBrandToggle = (brandName) => {
    setSelectedBrands((prev) =>
      prev.includes(brandName)
        ? prev.filter((b) => b !== brandName)
        : [...prev, brandName],
    );
    setCurrentPage(1);
  };

  const handleCategorySelect = (catName) => {
    setSelectedCategory(catName);
    setCurrentPage(1);
  };

  const handleAddToCart = (product, e) => {
    e.preventDefault();
    dispatch(
      addToCart({
        product: {
          _id: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
        },
        quantity: 1,
      }),
    );
    toast.success(`${product.name} added to cart!`);
  };

  const handleToggleWishlist = (product, e) => {
    e.preventDefault();
    dispatch(toggleWishlist(product));
    const isWished = wishlistItems.some((i) => i._id === product._id);
    if (isWished) {
      toast.success("Removed from Wishlist");
    } else {
      toast.success("Added to Wishlist!");
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filteredBrandList = brandListCombined.filter((b) =>
    b.name.toLowerCase().includes(brandSearch.toLowerCase()),
  );

  // Render Filter Content Component (Shared between Desktop Sidebar & Mobile Drawer)
  const renderFilterContent = () => (
    <div className="space-y-6 text-xs">
      {/* Categories Section */}
      <div className="space-y-3">
        <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-wider">
          Categories
        </h3>
        <div className="space-y-2">
          {(showMoreCategories
            ? categoryListCombined
            : categoryListCombined.slice(0, 7)
          ).map((cat) => {
            const isSelected =
              selectedCategory.toLowerCase() === cat.name.toLowerCase();
            return (
              <button
                key={cat.name}
                onClick={() => {
                  handleCategorySelect(cat.name);
                  if (mobileFilterOpen) setMobileFilterOpen(false);
                }}
                className={`w-full flex items-center justify-between text-left transition-colors cursor-pointer py-1 px-1.5 rounded-lg ${
                  isSelected
                    ? "bg-blue-50 dark:bg-slate-800 text-[#2563eb] font-bold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium"
                }`}
              >
                <span>{cat.name}</span>
                <span className="text-[10px] text-slate-400 font-semibold">
                  ({cat.count})
                </span>
              </button>
            );
          })}
          {categoryListCombined.length > 7 && (
            <button
              onClick={() => setShowMoreCategories(!showMoreCategories)}
              className="font-bold text-[#2563eb] hover:underline pt-1 block cursor-pointer"
            >
              {showMoreCategories ? "- View Less" : "+ View More"}
            </button>
          )}
        </div>
      </div>

      {/* Price Range Section */}
      <div className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-5">
        <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-wider">
          Price Range
        </h3>
        <div className="px-1 pt-1">
          <input
            type="range"
            min={0}
            max={200000}
            step={500}
            value={priceMax}
            onChange={(e) => {
              setPriceMax(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#2563eb]"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 font-semibold text-slate-700 dark:text-slate-300">
            ₹ {priceMin.toLocaleString()}
          </div>
          <span className="text-slate-400 font-bold">-</span>
          <div className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 font-semibold text-slate-700 dark:text-slate-300">
            ₹ {priceMax.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Brands Section */}
      {brandListCombined.length > 0 && (
        <div className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-5">
          <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-wider">
            Brands
          </h3>
          <div className="relative">
            <Search
              size={13}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search brands"
              value={brandSearch}
              onChange={(e) => setBrandSearch(e.target.value)}
              className="w-full pl-7 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 outline-none"
            />
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin pr-1">
            {(showMoreBrands
              ? filteredBrandList
              : filteredBrandList.slice(0, 6)
            ).map((brand) => (
              <label
                key={brand.name}
                className="flex items-center justify-between text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer select-none"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand.name)}
                    onChange={() => handleBrandToggle(brand.name)}
                    className="rounded border-slate-300 text-[#2563eb] focus:ring-0 cursor-pointer"
                  />
                  <span className="font-semibold">{brand.name}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-semibold">
                  ({brand.count})
                </span>
              </label>
            ))}
          </div>
          {filteredBrandList.length > 6 && (
            <button
              onClick={() => setShowMoreBrands(!showMoreBrands)}
              className="font-bold text-[#2563eb] hover:underline block cursor-pointer"
            >
              {showMoreBrands ? "- View Less" : "+ View More"}
            </button>
          )}
        </div>
      )}

      {/* Customer Rating Section */}
      <div className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-5">
        <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-wider">
          Customer Rating
        </h3>
        <div className="space-y-2">
          {[
            { rating: 4, label: "4.0 & above" },
            { rating: 3, label: "3.0 & above" },
            { rating: 2, label: "2.0 & above" },
          ].map((item) => (
            <button
              key={item.rating}
              onClick={() => {
                setSelectedRating(
                  selectedRating === item.rating ? 0 : item.rating,
                );
                setCurrentPage(1);
              }}
              className={`w-full flex items-center justify-between text-left py-1.5 px-2 rounded-md transition-colors cursor-pointer ${
                selectedRating === item.rating
                  ? "bg-blue-50 dark:bg-slate-800 text-[#2563eb] font-bold"
                  : "hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-400"
              }`}
            >
              <div className="flex items-center gap-1">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={11}
                      fill={i < item.rating ? "currentColor" : "none"}
                      className={
                        i < item.rating
                          ? ""
                          : "text-slate-300 dark:text-slate-600"
                      }
                    />
                  ))}
                </div>
                <span className="font-semibold text-[11px] ml-1">& above</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-200 transition-colors pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Breadcrumb & Title */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <Link to="/" className="hover:text-[#2563eb] transition-colors">
              Home
            </Link>
            <ChevronRight size={12} />
            <span className="text-slate-900 dark:text-white font-bold">
              {selectedCategory}
            </span>
          </div>
        </div>

        {/* Top Controls Toolbar */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-4 shadow-2xs">
          {/* Left: Showing Count + Mobile Filter Trigger Button */}
          <div className="flex items-center gap-3">
            {/* Mobile / Tablet Filter Button (Visible on < lg screens) */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-3.5 py-1.5 bg-[#2563eb] text-white rounded-lg text-xs font-bold shadow-sm transition-colors cursor-pointer"
            >
              <SlidersHorizontal size={14} />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="bg-white text-[#2563eb] w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-extrabold">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Showing{" "}
              <span className="font-black text-slate-900 dark:text-white">
                {totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}–
                {Math.min(currentPage * itemsPerPage, totalItems)}
              </span>{" "}
              of{" "}
              <span className="font-black text-slate-900 dark:text-white">
                {totalItems}
              </span>{" "}
              products
            </div>
          </div>

          {/* Right Controls: Sort & Layout */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
            {/* Sort By Selector */}
            <div className="flex items-center gap-2">
              <span className="text-slate-500 dark:text-slate-400 shrink-0">
                Sort By:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
              >
                <option value="Popularity">Popularity</option>
                <option value="Price: Low to High">Price: Low to High</option>
                <option value="Price: High to Low">Price: High to Low</option>
                <option value="Rating">Rating</option>
                <option value="Newest">Newest</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-800">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 transition-colors cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-[#2563eb] text-white"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
                title="Grid View"
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 transition-colors cursor-pointer ${
                  viewMode === "list"
                    ? "bg-[#2563eb] text-white"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
                title="List View"
              >
                <List size={16} />
              </button>
            </div>

            {/* Show Per Page */}
            <div className="hidden md:flex items-center gap-1.5">
              <span className="text-slate-500 dark:text-slate-400">Show:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
              >
                <option value={12}>12</option>
                <option value={24}>24</option>
                <option value={48}>48</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Content Layout (Desktop Sidebar + Grid/List) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Desktop Left Filter Sidebar (Hidden on mobile/tablet `< lg`) */}
          <aside className="hidden lg:block lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 space-y-6 shadow-2xs sticky top-24">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-[#2563eb]" />
                <h2 className="text-sm font-black text-slate-900 dark:text-white">
                  Filters
                </h2>
              </div>
              <button
                onClick={handleClearFilters}
                className="text-xs font-bold text-[#2563eb] hover:text-[#1d4ed8] transition-colors cursor-pointer"
              >
                Clear All
              </button>
            </div>

            {renderFilterContent()}
          </aside>

          {/* Right Product Grid (~75% on desktop / 100% on mobile & tablet) */}
          <main className="col-span-1 lg:col-span-9 space-y-6">
            {/* Loading Skeleton Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <ProductSkeletonCard key={i} />
                ))}
              </div>
            ) : paginatedProducts.length === 0 ? (
              /* Empty State */
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-12 text-center space-y-3 shadow-xs">
                <Package size={40} className="text-slate-400 mx-auto" />
                <h3 className="text-base font-black text-slate-800 dark:text-slate-200">
                  No products available
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  {backendProductsFormatted.length === 0
                    ? "There are currently no products uploaded in the backend. Please add products via backend."
                    : "No products match your selected filters. Try clearing your search or filters."}
                </p>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={handleClearFilters}
                    className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer mt-2"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            ) : viewMode === "grid" ? (
              /* Grid Layout (Optimized responsive columns: 1 on xs, 2 on sm, 3 on md, 4 on xl) */
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {paginatedProducts.map((prod) => {
                  const isWished = wishlistItems.some(
                    (i) => i._id === prod._id,
                  );
                  return (
                    <div
                      key={prod._id}
                      className="group bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3 flex flex-col justify-between hover:shadow-md hover:border-[#2563eb]/40 transition-all relative overflow-hidden"
                    >
                      {/* Top Badges & Wishlist */}
                      <div className="flex items-center justify-between gap-1 z-10">
                        <div className="flex items-center gap-1">
                          {prod.discount && (
                            <span className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded">
                              -{prod.discount}
                            </span>
                          )}
                          {prod.isBestseller && (
                            <span className="bg-emerald-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded flex items-center gap-0.5">
                              Bestseller <Check size={10} />
                            </span>
                          )}
                        </div>

                        <button
                          onClick={(e) => handleToggleWishlist(prod, e)}
                          className="text-slate-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
                          title="Wishlist"
                        >
                          <Heart
                            size={15}
                            className={
                              isWished ? "fill-red-500 text-red-500" : ""
                            }
                          />
                        </button>
                      </div>

                      {/* Image Box */}
                      <Link
                        to={`/products/${prod._id}`}
                        className="my-2 aspect-square flex items-center justify-center overflow-hidden rounded-lg bg-slate-50 dark:bg-slate-800 p-2"
                      >
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                      </Link>

                      {/* Product Content */}
                      <div className="space-y-1.5">
                        <Link to={`/products/${prod._id}`}>
                          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1 group-hover:text-[#2563eb] transition-colors">
                            {prod.name}
                          </h3>
                        </Link>
                        <p className="text-[10px] text-slate-400 truncate">
                          {prod.subtitle}
                        </p>

                        {/* Rating */}
                        <div className="flex items-center gap-1 text-[10px]">
                          <span className="font-bold text-slate-700 dark:text-slate-300">
                            {prod.rating}
                          </span>
                          <Star
                            size={10}
                            fill="currentColor"
                            className="text-amber-400"
                          />
                          <span className="text-slate-400">
                            ({prod.reviewsCount})
                          </span>
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-1.5 pt-0.5">
                          <span className="text-sm font-black text-slate-900 dark:text-white">
                            ₹{prod.price.toLocaleString()}
                          </span>
                          {prod.originalPrice && (
                            <span className="text-[10px] text-slate-400 line-through">
                              ₹{prod.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>

                        {/* Stock status */}
                        <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>In Stock</span>
                        </div>

                        {/* Add to Cart Button */}
                        <button
                          onClick={(e) => handleAddToCart(prod, e)}
                          className="w-full mt-2 py-1.5 border border-[#2563eb] text-[#2563eb] dark:text-blue-400 hover:bg-[#2563eb] hover:text-white dark:hover:bg-[#2563eb] dark:hover:text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        >
                          <ShoppingCart size={13} />
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* List Layout */
              <div className="space-y-3">
                {paginatedProducts.map((prod) => {
                  const isWished = wishlistItems.some(
                    (i) => i._id === prod._id,
                  );
                  return (
                    <div
                      key={prod._id}
                      className="group bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-24 h-24 rounded-lg bg-slate-50 dark:bg-slate-800 p-2 shrink-0 flex items-center justify-center">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-[#2563eb] bg-blue-50 dark:bg-slate-800 px-2 py-0.5 rounded">
                              {prod.brand}
                            </span>
                            {prod.discount && (
                              <span className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded">
                                -{prod.discount}
                              </span>
                            )}
                          </div>
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                            {prod.name}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {prod.subtitle}
                          </p>
                          <div className="flex items-center gap-1 text-xs text-slate-500">
                            <Star
                              size={11}
                              fill="currentColor"
                              className="text-amber-400"
                            />
                            <span className="font-bold">{prod.rating}</span>
                            <span>({prod.reviewsCount} reviews)</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:items-end gap-2 shrink-0">
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-black text-slate-900 dark:text-white">
                            ₹{prod.price.toLocaleString()}
                          </span>
                          {prod.originalPrice && (
                            <span className="text-xs text-slate-400 line-through">
                              ₹{prod.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => handleToggleWishlist(prod, e)}
                            className="p-2 text-slate-400 hover:text-red-500 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer"
                          >
                            <Heart
                              size={16}
                              className={
                                isWished ? "fill-red-500 text-red-500" : ""
                              }
                            />
                          </button>
                          <button
                            onClick={(e) => handleAddToCart(prod, e)}
                            className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <ShoppingCart size={14} />
                            <span>Add to Cart</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-6 border-t border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-slate-50 transition-colors disabled:opacity-40"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          page === currentPage
                            ? "bg-[#2563eb] text-white shadow-sm"
                            : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {page}
                      </button>
                    ),
                  )}

                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-slate-50 transition-colors disabled:opacity-40"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>

                {/* Back To Top Button */}
                <button
                  onClick={scrollToTop}
                  className="flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-50 transition-all cursor-pointer"
                >
                  <ArrowUp size={14} className="text-[#2563eb]" />
                  <span>Back to Top</span>
                </button>
              </div>
            )}
          </main>
        </div>

        {/* Footer Feature Trust Ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 mt-10 border-t border-slate-200/80 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800">
            <Truck size={22} className="text-[#2563eb] shrink-0" />
            <div>
              <div className="font-bold text-slate-900 dark:text-white">
                Free Delivery
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">
                On orders above ₹499
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800">
            <ShieldCheck size={22} className="text-[#2563eb] shrink-0" />
            <div>
              <div className="font-bold text-slate-900 dark:text-white">
                Secure Payment
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">
                100% secure payments
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800">
            <RotateCcw size={22} className="text-[#2563eb] shrink-0" />
            <div>
              <div className="font-bold text-slate-900 dark:text-white">
                Easy Returns
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">
                14 days return policy
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800">
            <Headphones size={22} className="text-[#2563eb] shrink-0" />
            <div>
              <div className="font-bold text-slate-900 dark:text-white">
                24/7 Support
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">
                Dedicated support
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Slide-Over Filter Drawer Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop Overlay */}
          <div
            onClick={() => setMobileFilterOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
          />

          {/* Right Slide-over Sheet */}
          <div className="relative ml-auto w-full max-w-xs bg-white dark:bg-slate-900 h-full flex flex-col justify-between shadow-2xl z-10 p-5 space-y-4 overflow-y-auto">
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={18} className="text-[#2563eb]" />
                <h2 className="text-sm font-black text-slate-900 dark:text-white">
                  Filter Products
                </h2>
              </div>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Filter Content Body */}
            <div className="flex-1 overflow-y-auto pr-1">
              {renderFilterContent()}
            </div>

            {/* Drawer Footer Actions */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <button
                onClick={handleClearFilters}
                className="w-1/3 py-2.5 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl"
              >
                Clear
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-2/3 py-2.5 bg-[#2563eb] text-white font-bold text-xs rounded-xl shadow-md"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
