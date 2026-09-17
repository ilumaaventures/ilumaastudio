import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Heart,
  ShoppingCart,
  Star,
  Grid,
  List,
  ChevronRight,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Filter,
  ArrowUp,
  RotateCcw,
  ShieldCheck,
  Truck,
  Headphones,
  Check,
  X,
  SlidersHorizontal,
  Package,
  Scale,
  RefreshCw,
  Tag,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/reducers/cartReducer";
import { toggleWishlist } from "../../redux/reducers/wishlistReducer";
import { toggleCompare } from "../../redux/reducers/compareReducer";
import { getallProducts } from "../../api/productService";
import { fetchCategories } from "../../api/categoryService";
import ProductCard from "../../Components/ProductCard";
import toast from "react-hot-toast";

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
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3.5 space-y-3 animate-pulse shadow-xs">
      <div className="aspect-square bg-slate-100 dark:bg-slate-800/80 rounded-xl" />
      <div className="space-y-2 pt-1">
        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
        <div className="h-2.5 bg-slate-100 dark:bg-slate-800/60 rounded w-1/2" />
        <div className="flex items-center justify-between pt-2">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
          <div className="h-7 w-7 bg-slate-100 dark:bg-slate-800 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const productsContainerRef = useRef(null);

  const wishlistItems = useSelector((s) => s.wishlist?.items || []);
  const compareItems = useSelector((s) => s.compare?.items || []);
  const cartItems = useSelector(
    (s) => s.cart?.cartItems || s.cart?.items || [],
  );

  // ==========================================
  // URL-DRIVEN FILTER STATE
  // ==========================================
  const urlPage = parseInt(searchParams.get("page") || "1", 10);
  const currentPage = isNaN(urlPage) || urlPage < 1 ? 1 : urlPage;

  const urlLimit = parseInt(searchParams.get("limit") || "24", 10);
  const itemsPerPage = [12, 24, 48].includes(urlLimit) ? urlLimit : 24;

  const selectedCategory = searchParams.get("category") || "All Categories";
  const urlSearch = searchParams.get("search") || "";
  const minPrice = parseInt(searchParams.get("minPrice") || "0", 10);
  const maxPrice = parseInt(searchParams.get("maxPrice") || "500000", 10);
  const selectedBrands = useMemo(() => {
    const b = searchParams.get("brands");
    return b ? b.split(",").map((s) => s.trim()).filter(Boolean) : [];
  }, [searchParams]);
  const selectedRating = parseInt(searchParams.get("rating") || "0", 10);
  const availability = searchParams.get("availability") || "all";
  const sortBy = searchParams.get("sort") || "Popularity";
  const viewMode = searchParams.get("view") || "grid";

  // Local UI-only inputs for smooth debouncing (typing, dragging slider)
  const [searchInput, setSearchInput] = useState(urlSearch);
  const [sliderMaxPrice, setSliderMaxPrice] = useState(maxPrice);
  const [brandSearch, setBrandSearch] = useState("");

  // Sync searchInput when URL changes from outside (e.g. navigation back/forward)
  useEffect(() => {
    setSearchInput(urlSearch);
  }, [urlSearch]);

  useEffect(() => {
    setSliderMaxPrice(maxPrice);
  }, [maxPrice]);

  // Server Data States
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Facet Collections
  const [apiCategories, setApiCategories] = useState([]);
  const [availableBrands, setAvailableBrands] = useState([]);

  // Sidebar controls
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [showMoreCategories, setShowMoreCategories] = useState(false);
  const [showMoreBrands, setShowMoreBrands] = useState(false);

  // ==========================================
  // HELPER: UPDATE SEARCH PARAMS
  // ==========================================
  const updateFilters = useCallback(
    (newParams, resetPage = true) => {
      const current = Object.fromEntries(searchParams.entries());
      const merged = { ...current, ...newParams };

      if (resetPage) {
        merged.page = "1";
      }

      // Clean up defaults to keep URL clean and pretty
      if (merged.category === "All Categories" || merged.category === "All") {
        delete merged.category;
      }
      if (!merged.search || merged.search.trim() === "") {
        delete merged.search;
      }
      if (Number(merged.minPrice) <= 0) {
        delete merged.minPrice;
      }
      if (Number(merged.maxPrice) >= 500000) {
        delete merged.maxPrice;
      }
      if (!merged.brands || merged.brands.length === 0) {
        delete merged.brands;
      }
      if (Number(merged.rating) <= 0) {
        delete merged.rating;
      }
      if (merged.availability === "all") {
        delete merged.availability;
      }
      if (merged.sort === "Popularity") {
        delete merged.sort;
      }
      if (Number(merged.limit) === 24) {
        delete merged.limit;
      }
      if (Number(merged.page) === 1) {
        delete merged.page;
      }
      if (merged.view === "grid") {
        delete merged.view;
      }

      setSearchParams(merged, { replace: false });
    },
    [searchParams, setSearchParams],
  );

  // Debounce search input changes (350ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchInput !== urlSearch) {
        updateFilters({ search: searchInput }, true);
      }
    }, 350);
    return () => clearTimeout(handler);
  }, [searchInput, urlSearch, updateFilters]);

  // Debounce price slider changes (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      if (sliderMaxPrice !== maxPrice) {
        updateFilters({ maxPrice: sliderMaxPrice }, true);
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [sliderMaxPrice, maxPrice, updateFilters]);

  // ==========================================
  // 1. FETCH ALL CATEGORIES (ONCE ON MOUNT)
  // ==========================================
  useEffect(() => {
    let isMounted = true;
    const loadCategories = async () => {
      try {
        const catRes = await fetchCategories({ businessType: "E-Commerce" });
        const list =
          catRes?.categories ||
          catRes?.data ||
          (Array.isArray(catRes) ? catRes : []);
        if (isMounted) {
          setApiCategories(list);
        }
      } catch (err) {
        console.warn("Could not load categories for sidebar:", err);
      }
    };
    loadCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  // ==========================================
  // 2. FETCH PRODUCTS FROM BACKEND WITH SERVER FILTERING & PAGINATION
  // ==========================================
  useEffect(() => {
    let isMounted = true;
    const abortController = new AbortController();

    const fetchShopProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const queryParams = {
          page: currentPage,
          limit: itemsPerPage,
          productType: "E-Commerce",
        };

        if (urlSearch.trim()) {
          queryParams.search = urlSearch.trim();
        }

        if (
          selectedCategory &&
          selectedCategory !== "All Categories" &&
          selectedCategory !== "All"
        ) {
          queryParams.category = selectedCategory;
        }

        if (minPrice > 0) {
          queryParams.minPrice = minPrice;
        }
        if (maxPrice < 500000) {
          queryParams.maxPrice = maxPrice;
        }

        if (selectedBrands.length > 0) {
          queryParams.brands = selectedBrands.join(",");
        }

        if (selectedRating > 0) {
          queryParams.rating = selectedRating;
        }

        if (availability && availability !== "all") {
          queryParams.availability = availability;
        }

        if (sortBy) {
          queryParams.sortBy = sortBy;
        }

        const res = await getallProducts(queryParams);

        if (!isMounted) return;

        const prodList = res?.products || res?.data || (Array.isArray(res) ? res : []);
        const total = typeof res?.total === "number" ? res.total : prodList.length;
        const pages = typeof res?.pages === "number" ? res.pages : Math.ceil(total / itemsPerPage) || 1;

        setProducts(prodList);
        setTotalProducts(total);
        setTotalPages(pages);

        // Extract brands from populated products for facet list
        if (prodList.length > 0) {
          setAvailableBrands((prev) => {
            const brandSet = new Set(prev);
            prodList.forEach((p) => {
              const b = p.brand || p.vendor?.storeName || p.vendor?.name;
              if (b) brandSet.add(b);
            });
            return Array.from(brandSet);
          });
        }
      } catch (err) {
        if (err.name !== "CanceledError" && isMounted) {
          console.error("Shop product fetch error:", err);
          setError("Failed to load products. Please check your connection.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchShopProducts();

    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, [
    currentPage,
    itemsPerPage,
    urlSearch,
    selectedCategory,
    minPrice,
    maxPrice,
    selectedBrands,
    selectedRating,
    availability,
    sortBy,
  ]);

  // Format backend products into uniform list for cards
  const formattedProducts = useMemo(() => {
    return products.map((p, idx) => {
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

      const originalPrice =
        p.compareAtPrice ||
        p.originalPrice ||
        (p.price ? Math.round(Number(p.price) * 1.2) : null);

      const discount =
        p.discount ||
        (originalPrice && originalPrice > p.price
          ? `${Math.round(((originalPrice - p.price) / originalPrice) * 100)}%`
          : "");

      const inStock = (() => {
        if (p.stock !== undefined) return Number(p.stock) > 0;
        if (p.countInStock !== undefined) return Number(p.countInStock) > 0;
        if (p.inventory?.stockQuantity !== undefined)
          return Number(p.inventory.stockQuantity) > 0;
        return true;
      })();

      return {
        _id: p._id || `backend_${idx}`,
        id: p._id || `backend_${idx}`,
        name: p.name || "Untitled Product",
        subtitle: p.subtitle || catName,
        category: catName,
        price: Number(p.price) || 0,
        originalPrice: originalPrice,
        discount: discount,
        rating: Number(p.rating) || 4.5,
        reviewsCount: p.numReviews || p.reviews?.length || 0,
        brand: brandName,
        inStock: inStock,
        isBestseller: p.isBestseller || false,
        image: imgUrl,
        images: p.images || [{ url: imgUrl }],
        raw: p,
      };
    });
  }, [products]);

  // Compute Categories facet list
  const categoryListCombined = useMemo(() => {
    const list = [{ name: "All Categories" }];
    const seen = new Set(["all categories"]);

    apiCategories.forEach((c) => {
      const name = c.name || c.title;
      if (name && !seen.has(name.toLowerCase())) {
        seen.add(name.toLowerCase());
        list.push({ name, _id: c._id });
      }
    });

    return list;
  }, [apiCategories]);

  // Filtered brands by brand search input
  const filteredBrandList = useMemo(() => {
    if (!brandSearch.trim()) return availableBrands;
    return availableBrands.filter((b) =>
      b.toLowerCase().includes(brandSearch.toLowerCase().trim()),
    );
  }, [availableBrands, brandSearch]);

  // Count active filters for badge & chips
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory && selectedCategory !== "All Categories") count++;
    if (urlSearch.trim()) count++;
    if (selectedBrands.length > 0) count += selectedBrands.length;
    if (selectedRating > 0) count++;
    if (minPrice > 0 || maxPrice < 500000) count++;
    if (availability !== "all") count++;
    return count;
  }, [
    selectedCategory,
    urlSearch,
    selectedBrands,
    selectedRating,
    minPrice,
    maxPrice,
    availability,
  ]);

  // ==========================================
  // HANDLERS
  // ==========================================
  const handleClearFilters = () => {
    setSearchInput("");
    setSliderMaxPrice(500000);
    setBrandSearch("");
    setSearchParams({}, { replace: false });
  };

  const handleCategorySelect = (catName) => {
    updateFilters({ category: catName }, true);
    if (mobileFilterOpen) setMobileFilterOpen(false);
  };

  const handleBrandToggle = (brandName) => {
    const nextBrands = selectedBrands.includes(brandName)
      ? selectedBrands.filter((b) => b !== brandName)
      : [...selectedBrands, brandName];
    updateFilters({ brands: nextBrands.join(",") }, true);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages || newPage === currentPage) return;
    updateFilters({ page: String(newPage) }, false);

    // Smooth scroll to top of product section
    if (productsContainerRef.current) {
      const yOffset = -100;
      const element = productsContainerRef.current;
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleAddToCart = (product, e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    const prodId = product._id || product.id;
    const isInCart = cartItems.some(
      (item) =>
        String(item._id || item.id || item.product?._id || item.product) ===
        String(prodId),
    );

    if (isInCart) {
      toast.success(`${product.name} is already in your cart!`, { icon: "🛒" });
      return;
    }

    dispatch(
      addToCart({
        product: {
          _id: prodId,
          id: prodId,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.image,
          category: product.category,
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

  // ==========================================
  // SMART PAGINATION PAGE LIST GENERATOR
  // ==========================================
  const paginationRange = useMemo(() => {
    const delta = 2;
    const range = [];
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      range.unshift("ellipsis-start");
    }
    if (currentPage + delta < totalPages - 1) {
      range.push("ellipsis-end");
    }

    range.unshift(1);
    if (totalPages > 1) {
      range.push(totalPages);
    }

    return range;
  }, [currentPage, totalPages]);

  // ==========================================
  // RENDER FILTER CONTENT (SIDEBAR & MOBILE DRAWER)
  // ==========================================
  const renderFilterContent = () => (
    <div className="space-y-6 text-xs">
      {/* Search Filter input */}
      <div className="space-y-2">
        <label className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center justify-between">
          <span>Search Products</span>
          {searchInput && (
            <button
              onClick={() => setSearchInput("")}
              className="text-slate-400 hover:text-slate-600 text-[10px] font-bold lowercase"
            >
              clear
            </button>
          )}
        </label>
        <div className="relative">
          <Search
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Keywords, title, SKU..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-8 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-medium text-xs transition"
          />
        </div>
      </div>

      {/* Categories Section */}
      <div className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-5">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
            Categories
          </h3>
          {selectedCategory !== "All Categories" && (
            <button
              onClick={() => handleCategorySelect("All Categories")}
              className="text-[10px] font-bold text-indigo-600 hover:underline"
            >
              Reset
            </button>
          )}
        </div>
        <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
          {(showMoreCategories || mobileFilterOpen
            ? categoryListCombined
            : categoryListCombined.slice(0, 8)
          ).map((cat) => {
            const isSelected =
              selectedCategory.toLowerCase() === cat.name.toLowerCase();
            return (
              <button
                key={cat.name}
                onClick={() => handleCategorySelect(cat.name)}
                className={`w-full flex items-center justify-between text-left transition-colors py-1.5 px-2.5 rounded-lg cursor-pointer text-xs ${
                  isSelected
                    ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-200/60 dark:border-indigo-800/60"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white font-medium"
                }`}
              >
                <span className="truncate">{cat.name}</span>
                {isSelected && (
                  <Check size={12} className="text-indigo-600 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
        {categoryListCombined.length > 8 && !mobileFilterOpen && (
          <button
            onClick={() => setShowMoreCategories(!showMoreCategories)}
            className="font-bold text-indigo-600 hover:underline text-[11px] pt-1 block cursor-pointer"
          >
            {showMoreCategories ? "- View Less" : `+ View More (${categoryListCombined.length - 8})`}
          </button>
        )}
      </div>

      {/* Price Range Section */}
      <div className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-5">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
            Max Price: ₹{sliderMaxPrice.toLocaleString()}
          </h3>
          {maxPrice < 500000 && (
            <button
              onClick={() => {
                setSliderMaxPrice(500000);
                updateFilters({ maxPrice: 500000 }, true);
              }}
              className="text-[10px] font-bold text-indigo-600 hover:underline"
            >
              Reset
            </button>
          )}
        </div>
        <div className="px-1 pt-1">
          <input
            type="range"
            min={100}
            max={200000}
            step={500}
            value={sliderMaxPrice}
            onChange={(e) => setSliderMaxPrice(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 font-bold text-slate-700 dark:text-slate-300">
            ₹ 0
          </div>
          <span className="text-slate-400 font-bold">to</span>
          <div className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 font-bold text-slate-700 dark:text-slate-300">
            ₹ {sliderMaxPrice.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Availability Section */}
      <div className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-5">
        <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
          Availability
        </h3>
        <div className="grid grid-cols-3 gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
          {[
            { id: "all", label: "All" },
            { id: "inStock", label: "In Stock" },
            { id: "outOfStock", label: "Out" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => updateFilters({ availability: item.id }, true)}
              className={`py-1.5 rounded-lg text-center font-bold text-[11px] transition cursor-pointer ${
                availability === item.id
                  ? "bg-white dark:bg-slate-900 text-indigo-600 shadow-2xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Brands Section */}
      {availableBrands.length > 0 && (
        <div className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-5">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
              Brands & Vendors
            </h3>
            {selectedBrands.length > 0 && (
              <button
                onClick={() => updateFilters({ brands: "" }, true)}
                className="text-[10px] font-bold text-indigo-600 hover:underline"
              >
                Reset
              </button>
            )}
          </div>
          {availableBrands.length > 5 && (
            <div className="relative">
              <Search
                size={12}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search brands"
                value={brandSearch}
                onChange={(e) => setBrandSearch(e.target.value)}
                className="w-full pl-7 pr-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 outline-none text-xs"
              />
            </div>
          )}

          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {(showMoreBrands
              ? filteredBrandList
              : filteredBrandList.slice(0, 6)
            ).map((brand) => (
              <label
                key={brand}
                className="flex items-center justify-between text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer select-none py-0.5"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => handleBrandToggle(brand)}
                    className="w-3.5 h-3.5 rounded border-slate-300 text-indigo-600 focus:ring-0 cursor-pointer accent-indigo-600"
                  />
                  <span className="font-semibold text-xs">{brand}</span>
                </div>
              </label>
            ))}
          </div>
          {filteredBrandList.length > 6 && !mobileFilterOpen && (
            <button
              onClick={() => setShowMoreBrands(!showMoreBrands)}
              className="font-bold text-indigo-600 hover:underline text-[11px] block cursor-pointer"
            >
              {showMoreBrands ? "- View Less" : `+ View More (${filteredBrandList.length - 6})`}
            </button>
          )}
        </div>
      )}

      {/* Customer Rating Section */}
      <div className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-5">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
            Customer Rating
          </h3>
          {selectedRating > 0 && (
            <button
              onClick={() => updateFilters({ rating: 0 }, true)}
              className="text-[10px] font-bold text-indigo-600 hover:underline"
            >
              Reset
            </button>
          )}
        </div>
        <div className="space-y-1">
          {[
            { rating: 4, label: "4.0 & above" },
            { rating: 3, label: "3.0 & above" },
            { rating: 2, label: "2.0 & above" },
          ].map((item) => {
            const isSelected = selectedRating === item.rating;
            return (
              <button
                key={item.rating}
                onClick={() =>
                  updateFilters(
                    { rating: isSelected ? 0 : item.rating },
                    true,
                  )
                }
                className={`w-full flex items-center justify-between text-left py-1.5 px-2.5 rounded-lg transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-200/60"
                    : "hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-400"
                }`}
              >
                <div className="flex items-center gap-1.5">
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
                  <span className="font-semibold text-[11px] ml-1">
                    {item.label}
                  </span>
                </div>
                {isSelected && (
                  <Check size={12} className="text-indigo-600 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div
      ref={productsContainerRef}
      className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-200 transition-colors pb-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
        {/* Breadcrumbs & Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <Link to="/" className="hover:text-indigo-600 transition-colors">
                Home
              </Link>
              <ChevronRight size={12} />
              <Link
                to="/shop"
                className="hover:text-indigo-600 transition-colors"
              >
                Shop Catalog
              </Link>
              {selectedCategory !== "All Categories" && (
                <>
                  <ChevronRight size={12} />
                  <span className="text-slate-900 dark:text-white font-bold">
                    {selectedCategory}
                  </span>
                </>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {selectedCategory === "All Categories"
                ? "Browse Products"
                : selectedCategory}
            </h1>
          </div>

          <div className="text-xs font-bold text-slate-500 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3.5 py-2 rounded-xl self-start sm:self-auto shadow-2xs">
            Total Results:{" "}
            <span className="text-indigo-600 font-extrabold">{totalProducts}</span>
          </div>
        </div>

        {/* Top Controls Toolbar */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-4 shadow-xs">
          {/* Left: Mobile Filter Button + Results Count */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors cursor-pointer"
            >
              <SlidersHorizontal size={14} />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="bg-white text-indigo-600 w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-black">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            <div className="text-xs font-medium text-slate-500 dark:text-slate-400 hidden sm:flex items-center gap-1.5">
              <span>Showing</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {totalProducts > 0
                  ? (currentPage - 1) * itemsPerPage + 1
                  : 0}
                –{Math.min(currentPage * itemsPerPage, totalProducts)}
              </span>
              <span>of</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {totalProducts}
              </span>
              <span>products</span>
            </div>
          </div>

          {/* Right Controls: Sort & Layout */}
          <div className="flex items-center gap-3 text-xs font-semibold">
            {/* Sort Selector */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400 shrink-0 hidden md:inline">
                Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => updateFilters({ sort: e.target.value }, true)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 outline-none cursor-pointer focus:ring-1 focus:ring-indigo-500"
              >
                <option value="Popularity">Popularity</option>
                <option value="Price: Low to High">Price: Low to High</option>
                <option value="Price: High to Low">Price: High to Low</option>
                <option value="Rating">Rating</option>
                <option value="Newest">Newest</option>
                <option value="Best Selling">Best Selling</option>
              </select>
            </div>

            {/* Per Page Selector */}
            <div className="hidden md:flex items-center gap-1.5">
              <span className="text-slate-400">Show:</span>
              <select
                value={itemsPerPage}
                onChange={(e) =>
                  updateFilters({ limit: String(e.target.value) }, true)
                }
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
              >
                <option value={12}>12</option>
                <option value={24}>24</option>
                <option value={48}>48</option>
              </select>
            </div>

            {/* Grid / List View Toggle */}
            <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800 p-0.5">
              <button
                onClick={() => updateFilters({ view: "grid" }, false)}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-indigo-600 text-white shadow-2xs"
                    : "text-slate-400 hover:text-slate-700 dark:hover:text-white"
                }`}
                title="Grid View"
              >
                <Grid size={15} />
              </button>
              <button
                onClick={() => updateFilters({ view: "list" }, false)}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === "list"
                    ? "bg-indigo-600 text-white shadow-2xs"
                    : "text-slate-400 hover:text-slate-700 dark:hover:text-white"
                }`}
                title="List View"
              >
                <List size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filters Chips Bar */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 bg-indigo-50/50 dark:bg-slate-900/50 border border-indigo-100 dark:border-slate-800 p-3 rounded-xl text-xs">
            <span className="text-indigo-900 dark:text-indigo-300 font-bold flex items-center gap-1">
              <Tag size={12} /> Active Filters:
            </span>

            {urlSearch && (
              <span className="inline-flex items-center gap-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-lg text-slate-700 dark:text-slate-300 font-medium">
                Keyword: <strong className="font-bold">"{urlSearch}"</strong>
                <button
                  onClick={() => setSearchInput("")}
                  className="hover:text-red-500"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            {selectedCategory !== "All Categories" && (
              <span className="inline-flex items-center gap-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-lg text-slate-700 dark:text-slate-300 font-medium">
                Category: <strong className="font-bold">{selectedCategory}</strong>
                <button
                  onClick={() => handleCategorySelect("All Categories")}
                  className="hover:text-red-500"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            {maxPrice < 500000 && (
              <span className="inline-flex items-center gap-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-lg text-slate-700 dark:text-slate-300 font-medium">
                Price ≤ <strong className="font-bold">₹{maxPrice.toLocaleString()}</strong>
                <button
                  onClick={() => {
                    setSliderMaxPrice(500000);
                    updateFilters({ maxPrice: 500000 }, true);
                  }}
                  className="hover:text-red-500"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            {selectedBrands.map((b) => (
              <span
                key={b}
                className="inline-flex items-center gap-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-lg text-slate-700 dark:text-slate-300 font-medium"
              >
                Brand: <strong className="font-bold">{b}</strong>
                <button
                  onClick={() => handleBrandToggle(b)}
                  className="hover:text-red-500"
                >
                  <X size={12} />
                </button>
              </span>
            ))}

            {selectedRating > 0 && (
              <span className="inline-flex items-center gap-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-lg text-slate-700 dark:text-slate-300 font-medium">
                Rating: <strong className="font-bold">{selectedRating}★+</strong>
                <button
                  onClick={() => updateFilters({ rating: 0 }, true)}
                  className="hover:text-red-500"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            {availability !== "all" && (
              <span className="inline-flex items-center gap-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-lg text-slate-700 dark:text-slate-300 font-medium">
                Status: <strong className="font-bold">{availability === "inStock" ? "In Stock" : "Out of Stock"}</strong>
                <button
                  onClick={() => updateFilters({ availability: "all" }, true)}
                  className="hover:text-red-500"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            <button
              onClick={handleClearFilters}
              className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline ml-auto"
            >
              Clear All ({activeFiltersCount})
            </button>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Desktop Left Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 space-y-6 shadow-xs sticky top-24">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5">
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-indigo-600" />
                <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Filters
                </h2>
              </div>
              {activeFiltersCount > 0 && (
                <button
                  onClick={handleClearFilters}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition cursor-pointer"
                >
                  Clear All
                </button>
              )}
            </div>

            {renderFilterContent()}
          </aside>

          {/* Right Products Container */}
          <main className="col-span-1 lg:col-span-9 space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 p-4 rounded-xl text-xs flex items-center justify-between">
                <span>{error}</span>
                <button
                  onClick={() => updateFilters({}, false)}
                  className="font-bold underline flex items-center gap-1"
                >
                  <RefreshCw size={12} /> Retry
                </button>
              </div>
            )}

            {/* Loading Skeleton */}
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {Array.from({ length: itemsPerPage > 12 ? 12 : itemsPerPage }).map((_, i) => (
                  <ProductSkeletonCard key={i} />
                ))}
              </div>
            ) : formattedProducts.length === 0 ? (
              /* Empty State */
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-12 text-center space-y-3 shadow-xs">
                <div className="w-14 h-14 bg-indigo-50 dark:bg-slate-800 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
                  <Package size={28} />
                </div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  No Products Found
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                  We couldn't find any products matching your current filters. Try
                  loosening your criteria or searching for different keywords.
                </p>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={handleClearFilters}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition cursor-pointer mt-2"
                  >
                    Clear All Filters ({activeFiltersCount})
                  </button>
                )}
              </div>
            ) : viewMode === "grid" ? (
              /* Grid View */
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {formattedProducts.map((prod) => (
                  <ProductCard key={prod._id} product={prod} />
                ))}
              </div>
            ) : (
              /* List View */
              <div className="space-y-3">
                {formattedProducts.map((prod) => {
                  const isWished = wishlistItems.some(
                    (i) => i._id === prod._id,
                  );
                  const isCompared = compareItems.some(
                    (i) => String(i.id || i._id) === String(prod._id),
                  );
                  return (
                    <div
                      key={prod._id}
                      className="group bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        <div className="w-24 h-24 rounded-xl bg-slate-50 dark:bg-slate-800 p-2 shrink-0 flex items-center justify-center">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                              {prod.brand}
                            </span>
                            {prod.discount && (
                              <span className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded">
                                -{prod.discount}
                              </span>
                            )}
                          </div>
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
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

                      <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-black text-slate-900 dark:text-white">
                            ₹{prod.price.toLocaleString()}
                          </span>
                          {prod.originalPrice && prod.originalPrice > prod.price && (
                            <span className="text-xs text-slate-400 line-through">
                              ₹{prod.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              dispatch(
                                toggleCompare({
                                  _id: prod._id,
                                  id: prod._id,
                                  name: prod.name,
                                  price: prod.price,
                                  originalPrice: prod.originalPrice,
                                  image: prod.image,
                                  category: prod.category,
                                  brand: prod.brand,
                                  rating: prod.rating,
                                  reviewsCount: prod.reviewsCount,
                                  inStock: prod.inStock,
                                }),
                              );
                            }}
                            title={isCompared ? "Remove from compare" : "Add to compare"}
                            className={`p-2 border rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                              isCompared
                                ? "bg-indigo-50 border-indigo-600 text-indigo-600"
                                : "border-slate-200 dark:border-slate-700 text-slate-500 hover:border-indigo-300 hover:text-indigo-600"
                            }`}
                          >
                            <Scale size={14} />
                          </button>
                          <button
                            onClick={(e) => handleToggleWishlist(prod, e)}
                            className="p-2 text-slate-400 hover:text-red-500 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer"
                          >
                            <Heart
                              size={15}
                              className={isWished ? "fill-red-500 text-red-500" : ""}
                            />
                          </button>
                          {prod.inStock ? (
                            <button
                              onClick={(e) => handleAddToCart(prod, e)}
                              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <ShoppingCart size={14} />
                              <span>Add to Cart</span>
                            </button>
                          ) : (
                            <button
                              disabled
                              className="bg-slate-100 text-slate-400 dark:bg-slate-800 px-4 py-2 rounded-xl text-xs font-bold cursor-not-allowed"
                            >
                              <span>Out of Stock</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Professional Server-Side Pagination Component */}
            {totalPages > 1 && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
                {/* Pagination Status Info */}
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Page <strong className="text-slate-900 dark:text-white font-bold">{currentPage}</strong> of{" "}
                  <strong className="text-slate-900 dark:text-white font-bold">{totalPages}</strong> ({totalProducts} items)
                </div>

                {/* Number Buttons Group */}
                <div className="flex items-center gap-1.5">
                  {/* First Page */}
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    className="w-8 h-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-slate-50 transition disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                    title="First Page"
                  >
                    <ChevronsLeft size={15} />
                  </button>

                  {/* Previous Page */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="w-8 h-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-slate-50 transition disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                    title="Previous Page"
                  >
                    <ChevronLeft size={15} />
                  </button>

                  {/* Page Numbers with Smart Ellipsis */}
                  {paginationRange.map((p, idx) => {
                    if (p === "ellipsis-start" || p === "ellipsis-end") {
                      return (
                        <span
                          key={`ell_${idx}`}
                          className="w-7 h-8 flex items-center justify-center text-slate-400 font-bold text-xs"
                        >
                          ...
                        </span>
                      );
                    }
                    const isCurrent = p === currentPage;
                    return (
                      <button
                        key={p}
                        onClick={() => handlePageChange(p)}
                        className={`w-8 h-8 rounded-xl text-xs font-black transition-all cursor-pointer ${
                          isCurrent
                            ? "bg-indigo-600 text-white shadow-xs"
                            : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}

                  {/* Next Page */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="w-8 h-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-slate-50 transition disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                    title="Next Page"
                  >
                    <ChevronRight size={15} />
                  </button>

                  {/* Last Page */}
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="w-8 h-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-slate-50 transition disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                    title="Last Page"
                  >
                    <ChevronsRight size={15} />
                  </button>
                </div>

                {/* Back To Top Button */}
                <button
                  onClick={scrollToTop}
                  className="hidden md:flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3.5 py-1.5 rounded-xl text-xs font-bold hover:bg-slate-50 transition cursor-pointer"
                >
                  <ArrowUp size={13} className="text-indigo-600" />
                  <span>Top</span>
                </button>
              </div>
            )}
          </main>
        </div>

        {/* Feature Trust Ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 mt-10 border-t border-slate-200/80 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800">
            <Truck size={22} className="text-indigo-600 shrink-0" />
            <div>
              <div className="font-bold text-slate-900 dark:text-white">
                Fast Delivery
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">
                Verified shipping nationwide
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800">
            <ShieldCheck size={22} className="text-indigo-600 shrink-0" />
            <div>
              <div className="font-bold text-slate-900 dark:text-white">
                Buyer Protection
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">
                100% genuine products
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800">
            <RotateCcw size={22} className="text-indigo-600 shrink-0" />
            <div>
              <div className="font-bold text-slate-900 dark:text-white">
                Easy Returns
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">
                Hassle-free replacement
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800">
            <Headphones size={22} className="text-indigo-600 shrink-0" />
            <div>
              <div className="font-bold text-slate-900 dark:text-white">
                Customer Support
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">
                24/7 dedicated assistance
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Slide-Over Filter Drawer Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            onClick={() => setMobileFilterOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
          />

          <div className="relative ml-auto w-full max-w-xs bg-white dark:bg-slate-900 h-full flex flex-col justify-between shadow-2xl z-10 p-5 space-y-4 overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={18} className="text-indigo-600" />
                <h2 className="text-sm font-black text-slate-900 dark:text-white">
                  Filter Catalog
                </h2>
              </div>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-1">
              {renderFilterContent()}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <button
                onClick={handleClearFilters}
                className="w-1/3 py-2.5 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl"
              >
                Clear
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-2/3 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md"
              >
                Apply ({totalProducts})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
