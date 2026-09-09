import React, { useState, useEffect, useMemo, useRef, memo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Scale,
  ArrowLeft,
  Share2,
  Trash2,
  Check,
  X,
  Star,
  Plus,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Package,
  Layers,
  Info,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  SlidersHorizontal,
  Award,
  AlertCircle,
  RefreshCw,
  ShoppingCart,
  Search,
  Zap,
} from "lucide-react";
import toast from "react-hot-toast";
import { getProductById } from "../../api/productService";
import { addToCart } from "../../redux/reducers/cartReducer";
import {
  removeFromCompare,
  clearCompare,
  setCompareItems,
  MAX_COMPARE_PRODUCTS,
  MIN_COMPARE_PRODUCTS,
} from "../../redux/reducers/compareReducer";
import CompareProductPickerModal from "../../Components/comparison/CompareProductPickerModal";

// =========================================================================
// REUSABLE & HIGH-PERFORMANCE ROW COMPONENT (Sticky Label + Aligned Columns)
// =========================================================================
const CompareRow = memo(function CompareRow({
  label,
  sublabel = null,
  renderCell,
  colCount = MAX_COMPARE_PRODUCTS,
  isDifferent = false,
  isAlternate = false,
  hoveredCol = null,
}) {
  return (
    <div
      className={`flex items-stretch transition-colors min-w-max ${
        isDifferent
          ? "bg-blue-50/50 hover:bg-blue-50/80"
          : isAlternate
            ? "bg-slate-50/50 hover:bg-slate-100/60"
            : "bg-white hover:bg-slate-50/60"
      }`}
    >
      {/* Sticky Left Label Column */}
      <div className="w-[115px] sm:w-[170px] md:w-[210px] shrink-0 sticky left-0 z-10 px-2.5 sm:px-4 py-2.5 sm:py-3 bg-inherit backdrop-blur-md border-r border-slate-200/90 shadow-[3px_0_8px_-2px_rgba(0,0,0,0.06)] flex flex-col justify-center select-none">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] sm:text-xs font-bold text-slate-800 leading-tight">
            {label}
          </span>
          {isDifferent && (
            <span
              className="w-1.5 h-1.5 rounded-full bg-[#2563eb] shrink-0"
              title="Differs across products"
            />
          )}
        </div>
        {sublabel && (
          <span className="text-[9px] sm:text-[10px] text-slate-400 mt-0.5 leading-none">
            {sublabel}
          </span>
        )}
      </div>

      {/* Product Cells Row */}
      <div className="flex items-stretch flex-1">
        {Array.from({ length: colCount }).map((_, colIdx) => {
          const isHovered = hoveredCol === colIdx;
          return (
            <div
              key={colIdx}
              className={`w-[155px] sm:w-[195px] md:w-[220px] shrink-0 px-2.5 sm:px-4 py-2.5 sm:py-3 text-[11px] sm:text-xs flex items-center border-r border-slate-100/80 transition-colors ${
                isHovered ? "bg-blue-50/40" : ""
              }`}
            >
              {renderCell(colIdx)}
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default function ComparePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Redux compare items
  const reduxCompareItems = useSelector((s) => s.compare?.items || []);

  // Detailed products fetched from backend
  const [detailedProducts, setDetailedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  // Interactive controls
  const [showDifferencesOnly, setShowDifferencesOnly] = useState(false);
  const [specSearchQuery, setSpecSearchQuery] = useState("");
  const [hoveredCol, setHoveredCol] = useState(null);

  // Add/Replace Product Modal State
  const [pickerOpen, setPickerOpen] = useState(false);
  const [replaceSlotIndex, setReplaceSlotIndex] = useState(null);

  // Table horizontal scroll container ref
  const tableContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Synchronize with URL query: ?products=id1,id2,id3
  const urlProductIds = useMemo(() => {
    const raw = searchParams.get("products");
    if (!raw) return [];
    return raw
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);
  }, [searchParams]);

  // Determine active product IDs (from URL if present, otherwise from Redux items)
  const activeProductIds = useMemo(() => {
    if (urlProductIds.length > 0) {
      return urlProductIds.slice(0, MAX_COMPARE_PRODUCTS);
    }
    return reduxCompareItems
      .map((item) => item.id || item._id)
      .filter(Boolean)
      .slice(0, MAX_COMPARE_PRODUCTS);
  }, [urlProductIds, reduxCompareItems]);

  // Update URL search parameters when active products change
  const syncUrlParams = (ids) => {
    if (ids.length > 0) {
      setSearchParams({ products: ids.join(",") }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  };

  // Fetch full details for products
  const fetchProductsData = async (ids) => {
    if (!ids || ids.length === 0) {
      setDetailedProducts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setLoadError(null);

      const promises = ids.map(async (id) => {
        try {
          const res = await getProductById(id);
          const data = res?.product || res?.data || res;
          if (data && (data._id || data.id)) {
            return {
              ...data,
              _id: data._id || data.id || id,
              id: data._id || data.id || id,
            };
          }
          const foundInRedux = reduxCompareItems.find(
            (r) => String(r.id || r._id) === String(id),
          );
          return foundInRedux || null;
        } catch (err) {
          console.warn(`Could not load full product details for ${id}:`, err);
          const fallback = reduxCompareItems.find(
            (r) => String(r.id || r._id) === String(id),
          );
          return fallback || null;
        }
      });

      const results = await Promise.all(promises);
      const validProducts = results.filter(Boolean);

      setDetailedProducts(validProducts);

      if (validProducts.length > 0) {
        dispatch(setCompareItems(validProducts));
      }
    } catch (err) {
      console.error("Error loading products for comparison:", err);
      setLoadError("Failed to load products for comparison. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsData(activeProductIds);
    syncUrlParams(activeProductIds);
  }, [activeProductIds.join(",")]);

  // Check scroll capability
  const checkScrollability = () => {
    if (tableContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        tableContainerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  const handleTableScroll = (direction) => {
    if (tableContainerRef.current) {
      const amount = direction === "left" ? -220 : 220;
      tableContainerRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  useEffect(() => {
    checkScrollability();
    const el = tableContainerRef.current;
    if (el) {
      el.addEventListener("scroll", checkScrollability, { passive: true });
      window.addEventListener("resize", checkScrollability, { passive: true });
      return () => {
        el.removeEventListener("scroll", checkScrollability);
        window.removeEventListener("resize", checkScrollability);
      };
    }
  }, [detailedProducts]);

  // Dynamic active columns count:
  // Shows existing products + ONE "+ Add Product" slot column if fewer than max!
  // This eliminates empty ghost slots on mobile.
  const activeColsCount = useMemo(() => {
    const len = detailedProducts.length;
    if (len < MAX_COMPARE_PRODUCTS) {
      return len + 1;
    }
    return len;
  }, [detailedProducts.length]);

  // Scroll to section helper
  const scrollToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Handle Remove Product
  const handleRemoveProduct = (productId) => {
    const updated = detailedProducts.filter(
      (p) => String(p._id || p.id) !== String(productId),
    );
    setDetailedProducts(updated);
    dispatch(removeFromCompare(productId));
    const newIds = updated.map((p) => p._id || p.id);
    syncUrlParams(newIds);
  };

  // Handle Clear All
  const handleClearAll = () => {
    setDetailedProducts([]);
    dispatch(clearCompare());
    syncUrlParams([]);
  };

  // Handle Add/Replace Product from Modal
  const handleSelectProductFromModal = async (selectedProd) => {
    const prodId = String(selectedProd._id || selectedProd.id);
    if (!prodId) return;

    let updated = [...detailedProducts];

    if (replaceSlotIndex !== null && replaceSlotIndex < updated.length) {
      updated[replaceSlotIndex] = selectedProd;
      toast.success(`Replaced with ${selectedProd.name || "selected product"}`);
    } else {
      if (updated.length >= MAX_COMPARE_PRODUCTS) {
        toast.error(`You can compare up to ${MAX_COMPARE_PRODUCTS} products.`);
        return;
      }
      updated.push(selectedProd);
      toast.success(`Added ${selectedProd.name || "product"} to comparison!`);
    }

    setDetailedProducts(updated);
    dispatch(setCompareItems(updated));
    syncUrlParams(updated.map((p) => p._id || p.id));
    setReplaceSlotIndex(null);
  };

  // Handle Direct Add to Cart
  const handleDirectAddToCart = (prod, e) => {
    if (e) e.stopPropagation();
    const inStock = prod.inStock !== false && !prod.isOutOfStock;
    if (!inStock) {
      toast.error(`${prod.name} is currently out of stock.`);
      return;
    }

    const prodId = prod._id || prod.id;
    const imageUrl =
      prod.images?.[0]?.url ||
      prod.images?.[0] ||
      prod.image?.url ||
      prod.image ||
      "";
    const categoryName =
      typeof prod.category === "object"
        ? prod.category?.name || "General"
        : prod.category || "General";
    const categoryTax =
      typeof prod.category === "object"
        ? (prod.category?.tax ?? 0)
        : (prod.categoryTax ?? 0);

    dispatch(
      addToCart({
        product: {
          _id: prodId,
          id: prodId,
          name: prod.name,
          price: Number(prod.price) || 0,
          originalPrice:
            Number(prod.originalPrice) || Number(prod.compareAtPrice) || null,
          image: imageUrl,
          category: categoryName,
          categoryTax: categoryTax,
          sku: prod.sku,
        },
        quantity: 1,
      }),
    );
    toast.success(`${prod.name} added to cart!`);
  };

  // Copy shareable link
  const handleShare = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Comparison link copied to clipboard!");
    } else {
      toast.success("Comparison URL: " + window.location.href);
    }
  };

  // Category Compatibility Analysis
  const categoryCompatibility = useMemo(() => {
    if (detailedProducts.length <= 1) return null;
    const categories = new Set(
      detailedProducts.map((p) =>
        typeof p.category === "object"
          ? p.category?.name || "General"
          : p.category || "General",
      ),
    );
    return {
      isSameCategory: categories.size === 1,
      categories: Array.from(categories),
    };
  }, [detailedProducts]);

  // Transparent Recommendations Analysis
  const recommendations = useMemo(() => {
    if (detailedProducts.length < 2) return {};

    let lowestPriceProd = null;
    let highestRatedProd = null;
    let bestValueProd = null;
    let bestOverallProd = null;

    let minPrice = Infinity;
    let maxRating = -1;
    let bestValueScore = -1;
    let bestOverallScore = -1;

    detailedProducts.forEach((p) => {
      const price = Number(p.price) || 0;
      const rating = Number(p.rating || p.ratings || 4.5);
      const reviews = Number(
        Array.isArray(p.reviews)
          ? p.reviews.length
          : p.numReviews || p.reviewsCount || 10,
      );
      const inStock = p.inStock !== false && !p.isOutOfStock;

      if (price > 0 && price < minPrice) {
        minPrice = price;
        lowestPriceProd = p;
      }

      if (rating > maxRating) {
        maxRating = rating;
        highestRatedProd = p;
      }

      if (price > 0) {
        const valScore = (rating / price) * 1000;
        if (valScore > bestValueScore) {
          bestValueScore = valScore;
          bestValueProd = p;
        }
      }

      const overallScore =
        rating * Math.log10(reviews + 10) * (inStock ? 1.2 : 0.8);
      if (overallScore > bestOverallScore) {
        bestOverallScore = overallScore;
        bestOverallProd = p;
      }
    });

    return {
      lowestPrice: lowestPriceProd,
      highestRated: highestRatedProd,
      bestValue: bestValueProd,
      bestOverall: bestOverallProd,
    };
  }, [detailedProducts]);

  // Dynamic spec keys from `product.details`
  const dynamicDetailKeys = useMemo(() => {
    const keyMap = new Map();
    detailedProducts.forEach((p) => {
      if (Array.isArray(p.details)) {
        p.details.forEach((item) => {
          if (item?.title && item.title.trim()) {
            const cleanTitle = item.title.trim();
            if (!keyMap.has(cleanTitle.toLowerCase())) {
              keyMap.set(cleanTitle.toLowerCase(), cleanTitle);
            }
          }
        });
      }
    });
    return Array.from(keyMap.values());
  }, [detailedProducts]);

  // Dynamic features from `product.features`
  const dynamicFeaturesList = useMemo(() => {
    const set = new Set();
    detailedProducts.forEach((p) => {
      if (Array.isArray(p.features)) {
        p.features.forEach((feat) => {
          if (feat && typeof feat === "string" && feat.trim()) {
            set.add(feat.trim());
          }
        });
      }
    });
    return Array.from(set);
  }, [detailedProducts]);

  // Filtered Dynamic Detail Keys according to in-table search
  const filteredDetailKeys = useMemo(() => {
    if (!specSearchQuery.trim()) return dynamicDetailKeys;
    const q = specSearchQuery.toLowerCase();
    return dynamicDetailKeys.filter((key) => key.toLowerCase().includes(q));
  }, [dynamicDetailKeys, specSearchQuery]);

  // Filtered Features according to in-table search
  const filteredFeaturesList = useMemo(() => {
    if (!specSearchQuery.trim()) return dynamicFeaturesList;
    const q = specSearchQuery.toLowerCase();
    return dynamicFeaturesList.filter((feat) => feat.toLowerCase().includes(q));
  }, [dynamicFeaturesList, specSearchQuery]);

  // Pre-calculated differences map for ultra-fast rendering
  const differences = useMemo(() => {
    if (detailedProducts.length <= 1) return { details: {}, features: {} };

    const checkDiff = (valuesArray) => {
      if (!valuesArray || valuesArray.length <= 1) return false;
      const firstStr = String(valuesArray[0] ?? "").trim();
      return valuesArray.some((v) => String(v ?? "").trim() !== firstStr);
    };

    const detailsDiff = {};
    dynamicDetailKeys.forEach((key) => {
      const vals = detailedProducts.map((p) => {
        if (!Array.isArray(p.details)) return "—";
        const found = p.details.find(
          (d) => d?.title && d.title.trim().toLowerCase() === key.toLowerCase(),
        );
        return found?.value || "—";
      });
      detailsDiff[key] = checkDiff(vals);
    });

    const featuresDiff = {};
    dynamicFeaturesList.forEach((feat) => {
      const bools = detailedProducts.map((p) => {
        if (!Array.isArray(p.features)) return false;
        return p.features.some(
          (f) =>
            typeof f === "string" &&
            f.trim().toLowerCase() === feat.toLowerCase(),
        );
      });
      featuresDiff[feat] = checkDiff(bools);
    });

    return {
      price: checkDiff(detailedProducts.map((p) => Number(p.price) || 0)),
      rating: checkDiff(
        detailedProducts.map((p) => Number(p.rating || p.ratings || 4.5)),
      ),
      stock: checkDiff(
        detailedProducts.map((p) =>
          Boolean(p.inStock !== false && !p.isOutOfStock),
        ),
      ),
      brand: checkDiff(
        detailedProducts.map(
          (p) =>
            p.brand || p.business?.businessName || p.vendor?.storeName || "",
        ),
      ),
      category: checkDiff(
        detailedProducts.map((p) =>
          typeof p.category === "object"
            ? p.category?.name || "General"
            : p.category || "General",
        ),
      ),
      sku: checkDiff(detailedProducts.map((p) => p.sku || "")),
      weight: checkDiff(detailedProducts.map((p) => p.weight || "")),
      dimensions: checkDiff(
        detailedProducts.map((p) =>
          p.dimensions
            ? `${p.dimensions.length}x${p.dimensions.width}x${p.dimensions.height}`
            : "",
        ),
      ),
      countryOfOrigin: checkDiff(
        detailedProducts.map((p) => p.countryOfOrigin || ""),
      ),
      productType: checkDiff(detailedProducts.map((p) => p.productType || "")),
      details: detailsDiff,
      features: featuresDiff,
    };
  }, [detailedProducts, dynamicDetailKeys, dynamicFeaturesList]);

  // -------------------------------------------------------------
  // RENDER: Loading Skeleton State
  // -------------------------------------------------------------
  if (loading) {
    return (
      <main className="min-h-screen bg-[#FAFAF9] py-6 sm:py-8 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-24 h-4 bg-slate-200 rounded animate-pulse" />
        </div>
        <div className="space-y-2">
          <div className="w-48 h-7 sm:h-8 bg-slate-200 rounded-xl animate-pulse" />
          <div className="w-72 h-4 bg-slate-200 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-3 sm:p-4 space-y-3 animate-pulse"
            >
              <div className="aspect-square bg-slate-100 rounded-xl sm:rounded-2xl" />
              <div className="w-3/4 h-3.5 bg-slate-200 rounded" />
              <div className="w-1/2 h-4 bg-slate-200 rounded" />
              <div className="w-full h-8 sm:h-9 bg-slate-100 rounded-xl mt-3" />
            </div>
          ))}
        </div>
      </main>
    );
  }

  // -------------------------------------------------------------
  // RENDER: Error State
  // -------------------------------------------------------------
  if (loadError) {
    return (
      <main className="min-h-screen bg-[#FAFAF9] flex items-center justify-center p-4 sm:p-6 text-center">
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm max-w-md w-full space-y-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
            <AlertCircle size={30} />
          </div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900">
            Unable to Load Comparison
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">{loadError}</p>
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <button
              type="button"
              onClick={() => fetchProductsData(activeProductIds)}
              className="flex-1 bg-[#2563eb] text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-[#1d4ed8] transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <RefreshCw size={14} />
              <span>Retry</span>
            </button>
            <Link
              to="/shop"
              className="flex-1 bg-slate-100 text-slate-700 px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-200 transition text-center"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // -------------------------------------------------------------
  // RENDER: Empty State (0 Products Selected)
  // -------------------------------------------------------------
  if (detailedProducts.length === 0) {
    return (
      <main className="min-h-screen bg-[#FAFAF9] py-12 sm:py-16 px-4 sm:px-6 flex items-center justify-center">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-12 max-w-lg w-full text-center space-y-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-blue-50 text-[#2563eb] flex items-center justify-center mx-auto shadow-inner">
            <Scale size={32} strokeWidth={1.75} />
          </div>

          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Compare Products
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Compare products side by side to evaluate features, technical
              specifications, and prices to find the perfect choice.
            </p>
            <p className="text-xs font-semibold text-slate-400 pt-1">
              You haven't selected any products to compare yet.
            </p>
          </div>

          <div className="pt-2">
            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-7 py-3 rounded-2xl text-xs font-black transition-all shadow-md shadow-blue-500/25 active:scale-95"
            >
              <Package size={16} />
              <span>Browse Products</span>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const isSingleProduct = detailedProducts.length === 1;

  return (
    <main className="min-h-screen bg-[#FAFAF9] pb-24 font-sans text-slate-800">
      {/* =========================================================
          STICKY TOP ACTION BAR (Slim & Responsive)
      ========================================================== */}
      <header className="bg-white/95 border-b border-slate-200/80 sticky top-0 z-30 shadow-2xs backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-2">
          {/* Left Title & Status */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link
              to="/shop"
              className="p-1.5 sm:p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
              title="Back to Shop"
            >
              <ArrowLeft size={17} />
            </Link>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h1 className="text-xs sm:text-base font-black text-slate-900 tracking-tight">
                  Compare
                </h1>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-blue-50 text-[#2563eb] border border-blue-200">
                  {detailedProducts.length}/{MAX_COMPARE_PRODUCTS}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden md:block">
                Side-by-side specifications & live pricing
              </p>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Quick Add Product Button */}
            {detailedProducts.length < MAX_COMPARE_PRODUCTS && (
              <button
                type="button"
                onClick={() => {
                  setReplaceSlotIndex(null);
                  setPickerOpen(true);
                }}
                className="px-2 sm:px-3 py-1.5 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-[#2563eb] text-[11px] sm:text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-2xs active:scale-95"
              >
                <Plus size={13} strokeWidth={2.5} />
                <span className="hidden xs:inline">Add Product</span>
              </button>
            )}

            {/* Difference Mode Toggle Switch */}
            <label className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showDifferencesOnly}
                onChange={(e) => setShowDifferencesOnly(e.target.checked)}
                className="sr-only"
              />
              <div
                className={`w-6 h-3.5 sm:w-7 sm:h-4 rounded-full transition-colors relative flex items-center p-0.5 ${
                  showDifferencesOnly ? "bg-[#2563eb]" : "bg-slate-300"
                }`}
              >
                <div
                  className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-white transition-transform ${
                    showDifferencesOnly
                      ? "translate-x-2.5 sm:translate-x-3"
                      : "translate-x-0"
                  }`}
                />
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-700">
                Differences
              </span>
            </label>

            {/* Share */}
            <button
              type="button"
              onClick={handleShare}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
              title="Share comparison link"
            >
              <Share2 size={13} />
              <span className="hidden sm:inline">Share</span>
            </button>

            {/* Clear All */}
            <button
              type="button"
              onClick={handleClearAll}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-rose-200 bg-rose-50/60 hover:bg-rose-100 text-rose-600 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
              title="Clear all products"
            >
              <Trash2 size={13} />
              <span className="hidden sm:inline">Clear</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 pt-4 space-y-4 sm:space-y-5">
        {/* =========================================================
            CATEGORY COMPATIBILITY & SECTION QUICK-JUMP
        ========================================================== */}
        {categoryCompatibility && (
          <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-2">
              {categoryCompatibility.isSameCategory ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px] sm:text-[11px]">
                  <CheckCircle2 size={12} />
                  Category: {categoryCompatibility.categories[0]}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-medium text-[10px] sm:text-[11px]">
                  <Info size={12} className="text-amber-600 shrink-0" />
                  <span>
                    Comparing: {categoryCompatibility.categories.join(", ")}
                  </span>
                </span>
              )}
            </div>

            {/* Section Quick Jump Filter Navigation */}
            <div className="flex items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden py-0.5">
              <button
                type="button"
                onClick={() => scrollToSection("section-highlights")}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-blue-300 hover:text-[#2563eb] text-slate-600 text-[10px] sm:text-[11px] font-bold cursor-pointer transition shrink-0 shadow-2xs"
              >
                Highlights
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("section-tech")}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-blue-300 hover:text-[#2563eb] text-slate-600 text-[10px] sm:text-[11px] font-bold cursor-pointer transition shrink-0 shadow-2xs"
              >
                Tech Specs
              </button>
              {filteredDetailKeys.length > 0 && (
                <button
                  type="button"
                  onClick={() => scrollToSection("section-specs")}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-blue-300 hover:text-[#2563eb] text-slate-600 text-[10px] sm:text-[11px] font-bold cursor-pointer transition shrink-0 shadow-2xs"
                >
                  Details
                </button>
              )}
              {filteredFeaturesList.length > 0 && (
                <button
                  type="button"
                  onClick={() => scrollToSection("section-features")}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-blue-300 hover:text-[#2563eb] text-slate-600 text-[10px] sm:text-[11px] font-bold cursor-pointer transition shrink-0 shadow-2xs"
                >
                  Features
                </button>
              )}
              <button
                type="button"
                onClick={() => scrollToSection("section-policies")}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-blue-300 hover:text-[#2563eb] text-slate-600 text-[10px] sm:text-[11px] font-bold cursor-pointer transition shrink-0 shadow-2xs"
              >
                Policies
              </button>
            </div>
          </div>
        )}

        {/* Notice for 1 product */}
        {isSingleProduct && (
          <div className="p-3 sm:p-4 rounded-2xl bg-amber-50 border border-amber-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-900">
            <div className="flex items-center gap-2.5">
              <Info size={17} className="text-amber-600 shrink-0" />
              <div>
                <h4 className="text-xs font-black">
                  Add at least one more product to compare
                </h4>
                <p className="text-[11px] text-amber-700">
                  Select another product to view differences and specifications
                  side-by-side.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setReplaceSlotIndex(null);
                setPickerOpen(true);
              }}
              className="bg-amber-600 hover:bg-amber-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shrink-0 shadow-xs active:scale-95"
            >
              <Plus size={14} strokeWidth={2.5} />
              <span>Add Second Product</span>
            </button>
          </div>
        )}

        {/* Difference Mode Active Banner */}
        {showDifferencesOnly && (
          <div className="p-2.5 sm:p-3 rounded-2xl bg-blue-50 border border-blue-200/80 flex items-center justify-between gap-2 text-xs text-[#2563eb]">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={14} />
              <span className="font-semibold text-[11px] sm:text-xs">
                Difference Mode: Showing only attributes that vary.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowDifferencesOnly(false)}
              className="text-[11px] font-black underline hover:text-blue-800 cursor-pointer shrink-0"
            >
              Show all
            </button>
          </div>
        )}

        {/* =========================================================
            RESPONSIVE COMPARISON MATRIX CONTAINER
        ========================================================== */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
          {/* Quick Search & Scroll Navigation Header */}
          <div className="p-2.5 sm:p-4 bg-slate-50/90 border-b border-slate-200/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
            <div className="relative flex-1 max-w-md">
              <Search
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search specs (battery, weight, warranty...)"
                value={specSearchQuery}
                onChange={(e) => setSpecSearchQuery(e.target.value)}
                className="w-full pl-8 pr-7 py-1.5 text-xs bg-white border border-slate-200 rounded-xl outline-none focus:border-[#2563eb] transition"
              />
              {specSearchQuery && (
                <button
                  type="button"
                  onClick={() => setSpecSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Scroll Navigation & Mobile Hint */}
            <div className="flex items-center justify-between sm:justify-end gap-2">
              <span className="text-[10px] text-slate-400 font-semibold md:hidden">
                Swipe horizontally ↔
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleTableScroll("left")}
                  disabled={!canScrollLeft}
                  className="p-1 sm:p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-[#2563eb] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  title="Scroll left"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => handleTableScroll("right")}
                  disabled={!canScrollRight}
                  className="p-1 sm:p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-[#2563eb] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  title="Scroll right"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Horizontally Scrollable Table Canvas with Edge Shadows */}
          <div className="relative">
            {/* Right Scroll Indicator Gradient for mobile */}
            {canScrollRight && (
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-slate-900/10 to-transparent pointer-events-none z-20" />
            )}

            <div
              ref={tableContainerRef}
              className="overflow-x-auto [scrollbar-width:thin] scroll-smooth"
            >
              <div className="min-w-max divide-y divide-slate-100">
                {/* ===================================================
                    STICKY PRODUCT CARDS HEADER ROW
                    (Sticks under top action bar on vertical scroll)
                ==================================================== */}
                <div className="flex items-stretch bg-slate-50/95 border-b border-slate-200/90 sticky top-[49px] sm:top-[53px] z-20 backdrop-blur-md min-w-max shadow-2xs">
                  {/* Sticky Left Header Label */}
                  <div className="w-[115px] sm:w-[170px] md:w-[210px] shrink-0 sticky left-0 z-30 p-2.5 sm:p-4 bg-slate-50/95 backdrop-blur-md border-r border-slate-200/90 shadow-[3px_0_8px_-2px_rgba(0,0,0,0.06)] flex flex-col justify-end">
                    <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-slate-400">
                      Product Summary
                    </span>
                    <h3 className="text-xs sm:text-sm font-black text-slate-900 mt-0.5 leading-tight">
                      Side-by-Side
                    </h3>
                    <p className="text-[9px] sm:text-[10px] text-slate-400 mt-1 hidden sm:block">
                      Add to cart or replace below.
                    </p>
                  </div>

                  {/* Product Column Cards (Only active products + 1 add slot) */}
                  <div className="flex items-stretch flex-1">
                    {Array.from({ length: activeColsCount }).map((_, idx) => {
                      const prod = detailedProducts[idx];
                      const isHoveredCol = hoveredCol === idx;

                      if (prod) {
                        const prodId = prod._id || prod.id;
                        const prodImg =
                          prod.images?.[0]?.url ||
                          prod.images?.[0] ||
                          prod.image?.url ||
                          prod.image ||
                          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=260";
                        const prodPrice = Number(prod.price) || 0;
                        const prodOriginalPrice =
                          Number(prod.originalPrice) ||
                          Number(prod.compareAtPrice) ||
                          null;
                        const prodRating = Number(
                          prod.rating || prod.ratings || 4.5,
                        ).toFixed(1);
                        const inStock =
                          prod.inStock !== false && !prod.isOutOfStock;

                        return (
                          <div
                            key={prodId}
                            onMouseEnter={() => setHoveredCol(idx)}
                            onMouseLeave={() => setHoveredCol(null)}
                            className={`w-[155px] sm:w-[195px] md:w-[220px] shrink-0 p-2 sm:p-3 flex flex-col justify-between transition-colors relative border-r border-slate-100 ${
                              isHoveredCol ? "bg-blue-50/30" : "bg-transparent"
                            }`}
                          >
                            {/* Remove button */}
                            <button
                              type="button"
                              onClick={() => handleRemoveProduct(prodId)}
                              className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-slate-200/80 hover:bg-rose-500 hover:text-white text-slate-500 flex items-center justify-center transition cursor-pointer z-10"
                              title="Remove product"
                              aria-label={`Remove ${prod.name}`}
                            >
                              <X size={11} strokeWidth={2.5} />
                            </button>

                            <div className="space-y-1.5 sm:space-y-2">
                              {/* Thumbnail */}
                              <div className="aspect-square w-full rounded-xl bg-white border border-slate-200/80 p-1.5 sm:p-2 flex items-center justify-center overflow-hidden">
                                <img
                                  src={prodImg}
                                  alt={prod.name}
                                  loading="lazy"
                                  decoding="async"
                                  className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                                />
                              </div>

                              {/* Name & Brand */}
                              <div>
                                <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 truncate block">
                                  {prod.brand ||
                                    prod.business?.businessName ||
                                    prod.vendor?.storeName ||
                                    "Brand"}
                                </span>
                                <h4
                                  className="text-[11px] sm:text-xs font-bold text-slate-900 line-clamp-2 h-7 sm:h-8 leading-3.5 sm:leading-4 mt-0.5"
                                  title={prod.name}
                                >
                                  {prod.name}
                                </h4>
                              </div>

                              {/* Rating */}
                              <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-amber-500">
                                <Star size={11} fill="currentColor" />
                                <span>{prodRating}</span>
                                <span className="text-slate-400 font-normal text-[9px] sm:text-[10px]">
                                  (
                                  {Array.isArray(prod.reviews)
                                    ? prod.reviews.length
                                    : prod.numReviews ||
                                      prod.reviewsCount ||
                                      12}
                                  )
                                </span>
                              </div>

                              {/* Price */}
                              <div>
                                <div className="flex items-baseline gap-1">
                                  <span className="text-xs sm:text-sm font-black text-[#2563eb]">
                                    ₹{prodPrice.toLocaleString()}
                                  </span>
                                  {prodOriginalPrice &&
                                    prodOriginalPrice > prodPrice && (
                                      <span className="text-[9px] text-slate-400 line-through">
                                        ₹{prodOriginalPrice.toLocaleString()}
                                      </span>
                                    )}
                                </div>
                                <span
                                  className={`inline-block mt-0.5 text-[8px] sm:text-[9px] font-black uppercase px-1.5 py-0.2 rounded-full ${
                                    inStock
                                      ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                                      : "bg-slate-100 text-slate-500"
                                  }`}
                                >
                                  {inStock ? "In Stock" : "Sold Out"}
                                </span>
                              </div>
                            </div>

                            {/* Direct Purchase Actions */}
                            <div className="pt-2 mt-2 border-t border-slate-200/60 space-y-1 sm:space-y-1.5">
                              <button
                                type="button"
                                onClick={(e) => handleDirectAddToCart(prod, e)}
                                disabled={!inStock}
                                className="w-full py-1.5 sm:py-2 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-[11px] sm:text-xs font-black transition flex items-center justify-center gap-1 cursor-pointer shadow-2xs active:scale-95"
                              >
                                <ShoppingCart size={11} />
                                <span>Add to Cart</span>
                              </button>

                              <div className="grid grid-cols-2 gap-1">
                                <Link
                                  to={`/products/${prodId}`}
                                  className="py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-[9px] sm:text-[10px] font-bold transition flex items-center justify-center gap-1 cursor-pointer text-center"
                                >
                                  <span>Details</span>
                                  <ExternalLink size={8} />
                                </Link>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setReplaceSlotIndex(idx);
                                    setPickerOpen(true);
                                  }}
                                  className="py-1 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 text-[9px] sm:text-[10px] font-semibold transition cursor-pointer flex items-center justify-center gap-1"
                                >
                                  <RotateCcw size={8} />
                                  <span>Replace</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      }

                      {
                        /* Single Add Next Product Slot */
                      }
                      return (
                        <div
                          key="add-next-slot"
                          className="w-[155px] sm:w-[195px] md:w-[220px] shrink-0 p-2.5 sm:p-3 flex flex-col items-center justify-center border-r border-slate-100 bg-slate-50/40"
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setReplaceSlotIndex(null);
                              setPickerOpen(true);
                            }}
                            className="flex flex-col items-center gap-2 cursor-pointer p-3 sm:p-4 rounded-2xl border-2 border-dashed border-slate-200 hover:border-[#2563eb] w-full h-full justify-center transition-colors group active:scale-95"
                          >
                            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-blue-50 group-hover:bg-[#2563eb] text-[#2563eb] group-hover:text-white flex items-center justify-center transition-colors shadow-2xs">
                              <Plus size={15} strokeWidth={2.5} />
                            </div>
                            <span className="text-[11px] sm:text-xs font-bold text-slate-700 group-hover:text-[#2563eb] transition-colors text-center">
                              Add Product
                            </span>
                            <span className="text-[9px] sm:text-[10px] text-slate-400">
                              Slot {detailedProducts.length + 1} of{" "}
                              {MAX_COMPARE_PRODUCTS}
                            </span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ===================================================
                    SECTION 1: KEY HIGHLIGHTS
                ==================================================== */}
                <div id="section-highlights">
                  <div className="px-3 sm:px-4 py-2 bg-slate-100/80 border-b border-slate-200 text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                    <Sparkles size={12} className="text-[#2563eb]" />
                    <span>Pricing & Highlights</span>
                  </div>

                  {/* Price Row */}
                  {(!showDifferencesOnly || differences.price) && (
                    <CompareRow
                      label="Price"
                      sublabel="Base selling price"
                      hoveredCol={hoveredCol}
                      colCount={activeColsCount}
                      isDifferent={differences.price}
                      renderCell={(colIdx) => {
                        const p = detailedProducts[colIdx];
                        if (!p)
                          return <span className="text-slate-300">—</span>;
                        const isLowest =
                          recommendations.lowestPrice?._id === (p._id || p.id);
                        return (
                          <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
                            <span
                              className={
                                isLowest
                                  ? "text-emerald-600 font-black text-xs sm:text-sm"
                                  : "text-slate-900 font-bold"
                              }
                            >
                              ₹{Number(p.price || 0).toLocaleString()}
                            </span>
                            {isLowest && !isSingleProduct && (
                              <span className="text-[8px] sm:text-[9px] font-black bg-emerald-100 text-emerald-700 px-1.5 py-0.2 rounded">
                                Lowest
                              </span>
                            )}
                          </div>
                        );
                      }}
                    />
                  )}

                  {/* Rating Row */}
                  {(!showDifferencesOnly || differences.rating) && (
                    <CompareRow
                      label="Rating"
                      sublabel="Customer score"
                      hoveredCol={hoveredCol}
                      colCount={activeColsCount}
                      isAlternate
                      isDifferent={differences.rating}
                      renderCell={(colIdx) => {
                        const p = detailedProducts[colIdx];
                        if (!p)
                          return <span className="text-slate-300">—</span>;
                        const isHighest =
                          recommendations.highestRated?._id === (p._id || p.id);
                        return (
                          <div className="flex items-center gap-1 font-bold">
                            <Star
                              size={11}
                              fill="currentColor"
                              className="text-amber-400"
                            />
                            <span>
                              {Number(p.rating || p.ratings || 4.5).toFixed(1)}
                            </span>
                            {isHighest && !isSingleProduct && (
                              <span className="text-[8px] sm:text-[9px] font-black bg-purple-100 text-purple-700 px-1.5 py-0.2 rounded ml-1">
                                Top
                              </span>
                            )}
                          </div>
                        );
                      }}
                    />
                  )}

                  {/* Availability Row */}
                  {(!showDifferencesOnly || differences.stock) && (
                    <CompareRow
                      label="Availability"
                      sublabel="Stock status"
                      hoveredCol={hoveredCol}
                      colCount={activeColsCount}
                      isDifferent={differences.stock}
                      renderCell={(colIdx) => {
                        const p = detailedProducts[colIdx];
                        if (!p)
                          return <span className="text-slate-300">—</span>;
                        const inStock = p.inStock !== false && !p.isOutOfStock;
                        return (
                          <span
                            className={`font-semibold flex items-center gap-1 ${
                              inStock ? "text-emerald-600" : "text-slate-400"
                            }`}
                          >
                            {inStock ? (
                              <>
                                <CheckCircle2 size={12} />
                                <span>In Stock</span>
                              </>
                            ) : (
                              <>
                                <XCircle size={12} />
                                <span>Out of Stock</span>
                              </>
                            )}
                          </span>
                        );
                      }}
                    />
                  )}

                  {/* Brand Row */}
                  {(!showDifferencesOnly || differences.brand) && (
                    <CompareRow
                      label="Brand / Store"
                      sublabel="Seller identity"
                      hoveredCol={hoveredCol}
                      colCount={activeColsCount}
                      isAlternate
                      isDifferent={differences.brand}
                      renderCell={(colIdx) => {
                        const p = detailedProducts[colIdx];
                        if (!p)
                          return <span className="text-slate-300">—</span>;
                        return (
                          <span className="font-bold text-slate-800">
                            {p.brand ||
                              p.business?.businessName ||
                              p.vendor?.storeName ||
                              "—"}
                          </span>
                        );
                      }}
                    />
                  )}

                  {/* Category & Tax Row */}
                  {(!showDifferencesOnly || differences.category) && (
                    <CompareRow
                      label="Category & Tax"
                      sublabel="GST applicable"
                      hoveredCol={hoveredCol}
                      colCount={activeColsCount}
                      isDifferent={differences.category}
                      renderCell={(colIdx) => {
                        const p = detailedProducts[colIdx];
                        if (!p)
                          return <span className="text-slate-300">—</span>;
                        const catName =
                          typeof p.category === "object"
                            ? p.category?.name || "General"
                            : p.category || "General";
                        const tax =
                          typeof p.category === "object" &&
                          p.category?.tax !== undefined
                            ? p.category.tax
                            : (p.categoryTax ?? 0);
                        return (
                          <div className="space-y-0.5">
                            <span className="font-bold text-slate-800 block">
                              {catName}
                            </span>
                            <span className="text-[9px] sm:text-[10px] text-slate-400">
                              {tax}% GST
                            </span>
                          </div>
                        );
                      }}
                    />
                  )}
                </div>

                {/* ===================================================
                    SECTION 2: PHYSICAL & TECHNICAL SPECS
                ==================================================== */}
                <div id="section-tech">
                  <div className="px-3 sm:px-4 py-2 bg-slate-100/80 border-b border-slate-200 text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                    <Package size={12} className="text-[#2563eb]" />
                    <span>Physical & Technical Specs</span>
                  </div>

                  {/* SKU */}
                  {(!showDifferencesOnly || differences.sku) && (
                    <CompareRow
                      label="SKU"
                      sublabel="Stock identification"
                      hoveredCol={hoveredCol}
                      colCount={activeColsCount}
                      isDifferent={differences.sku}
                      renderCell={(colIdx) => {
                        const p = detailedProducts[colIdx];
                        if (!p)
                          return <span className="text-slate-300">—</span>;
                        return (
                          <span className="font-mono text-[10px] sm:text-[11px] text-slate-700 truncate">
                            {p.sku || "—"}
                          </span>
                        );
                      }}
                    />
                  )}

                  {/* Weight */}
                  {(!showDifferencesOnly || differences.weight) && (
                    <CompareRow
                      label="Weight"
                      sublabel="Net item mass"
                      hoveredCol={hoveredCol}
                      colCount={activeColsCount}
                      isAlternate
                      isDifferent={differences.weight}
                      renderCell={(colIdx) => {
                        const p = detailedProducts[colIdx];
                        if (!p)
                          return <span className="text-slate-300">—</span>;
                        return (
                          <span className="font-semibold text-slate-800">
                            {p.weight ? `${p.weight} kg` : "—"}
                          </span>
                        );
                      }}
                    />
                  )}

                  {/* Dimensions */}
                  {(!showDifferencesOnly || differences.dimensions) && (
                    <CompareRow
                      label="Dimensions"
                      sublabel="L × W × H (cm)"
                      hoveredCol={hoveredCol}
                      colCount={activeColsCount}
                      isDifferent={differences.dimensions}
                      renderCell={(colIdx) => {
                        const p = detailedProducts[colIdx];
                        if (!p)
                          return <span className="text-slate-300">—</span>;
                        return (
                          <span className="font-semibold text-slate-800">
                            {p.dimensions?.length &&
                            p.dimensions?.width &&
                            p.dimensions?.height
                              ? `${p.dimensions.length} × ${p.dimensions.width} × ${p.dimensions.height}`
                              : "—"}
                          </span>
                        );
                      }}
                    />
                  )}

                  {/* Country of Origin */}
                  {(!showDifferencesOnly || differences.countryOfOrigin) && (
                    <CompareRow
                      label="Country of Origin"
                      sublabel="Manufacturing country"
                      hoveredCol={hoveredCol}
                      colCount={activeColsCount}
                      isAlternate
                      isDifferent={differences.countryOfOrigin}
                      renderCell={(colIdx) => {
                        const p = detailedProducts[colIdx];
                        if (!p)
                          return <span className="text-slate-300">—</span>;
                        return (
                          <span className="font-semibold text-slate-800">
                            {p.countryOfOrigin || "India"}
                          </span>
                        );
                      }}
                    />
                  )}

                  {/* Product Type */}
                  {(!showDifferencesOnly || differences.productType) && (
                    <CompareRow
                      label="Product Type"
                      sublabel="Catalog class"
                      hoveredCol={hoveredCol}
                      colCount={activeColsCount}
                      isDifferent={differences.productType}
                      renderCell={(colIdx) => {
                        const p = detailedProducts[colIdx];
                        if (!p)
                          return <span className="text-slate-300">—</span>;
                        return (
                          <span className="font-semibold text-slate-800">
                            {p.productType || "Standard"}
                          </span>
                        );
                      }}
                    />
                  )}
                </div>

                {/* ===================================================
                    SECTION 3: DYNAMIC SPECIFICATIONS (product.details)
                ==================================================== */}
                {filteredDetailKeys.length > 0 && (
                  <div id="section-specs">
                    <div className="px-3 sm:px-4 py-2 bg-slate-100/80 border-b border-slate-200 text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                      <Layers size={12} className="text-[#2563eb]" />
                      <span>Specifications Matrix</span>
                    </div>

                    {filteredDetailKeys.map((titleKey, dIdx) => {
                      const isDiff = differences.details?.[titleKey] || false;
                      if (showDifferencesOnly && !isDiff) {
                        return null;
                      }

                      return (
                        <CompareRow
                          key={titleKey}
                          label={titleKey}
                          hoveredCol={hoveredCol}
                          colCount={activeColsCount}
                          isAlternate={dIdx % 2 === 1}
                          isDifferent={isDiff}
                          renderCell={(colIdx) => {
                            const p = detailedProducts[colIdx];
                            if (!p)
                              return <span className="text-slate-300">—</span>;
                            const found = Array.isArray(p.details)
                              ? p.details.find(
                                  (d) =>
                                    d?.title &&
                                    d.title.trim().toLowerCase() ===
                                      titleKey.toLowerCase(),
                                )
                              : null;
                            return (
                              <span className="font-semibold text-slate-800">
                                {found?.value || "—"}
                              </span>
                            );
                          }}
                        />
                      );
                    })}
                  </div>
                )}

                {/* ===================================================
                    SECTION 4: FEATURES CHECKLIST (product.features)
                ==================================================== */}
                {filteredFeaturesList.length > 0 && (
                  <div id="section-features">
                    <div className="px-3 sm:px-4 py-2 bg-slate-100/80 border-b border-slate-200 text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                      <CheckCircle2 size={12} className="text-emerald-600" />
                      <span>Features Checklist</span>
                    </div>

                    {filteredFeaturesList.map((featureText, fIdx) => {
                      const isDiff =
                        differences.features?.[featureText] || false;
                      if (showDifferencesOnly && !isDiff) {
                        return null;
                      }

                      return (
                        <CompareRow
                          key={featureText}
                          label={featureText}
                          hoveredCol={hoveredCol}
                          colCount={activeColsCount}
                          isAlternate={fIdx % 2 === 1}
                          isDifferent={isDiff}
                          renderCell={(colIdx) => {
                            const p = detailedProducts[colIdx];
                            if (!p)
                              return <span className="text-slate-300">—</span>;
                            const hasFeature =
                              Array.isArray(p.features) &&
                              p.features.some(
                                (feat) =>
                                  typeof feat === "string" &&
                                  feat.trim().toLowerCase() ===
                                    featureText.toLowerCase(),
                              );

                            return (
                              <div className="flex items-center">
                                {hasFeature ? (
                                  <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                    <Check size={12} strokeWidth={2.5} />
                                  </span>
                                ) : (
                                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                                    <X size={11} strokeWidth={2} />
                                  </span>
                                )}
                              </div>
                            );
                          }}
                        />
                      );
                    })}
                  </div>
                )}

                {/* ===================================================
                    SECTION 5: STORE POLICIES & PROTECTION
                ==================================================== */}
                <div id="section-policies">
                  <div className="px-3 sm:px-4 py-2 bg-slate-100/80 border-b border-slate-200 text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                    <ShieldCheck size={12} className="text-[#2563eb]" />
                    <span>Store Policies & Buyer Protection</span>
                  </div>

                  <CompareRow
                    label="Fast Dispatch"
                    sublabel="Warehouse handling"
                    hoveredCol={hoveredCol}
                    colCount={activeColsCount}
                    renderCell={(colIdx) => {
                      const p = detailedProducts[colIdx];
                      if (!p) return <span className="text-slate-300">—</span>;
                      return (
                        <span className="font-semibold text-slate-800">
                          24-48h Dispatch
                        </span>
                      );
                    }}
                  />

                  <CompareRow
                    label="Easy Returns"
                    sublabel="Return guarantee"
                    hoveredCol={hoveredCol}
                    colCount={activeColsCount}
                    isAlternate
                    renderCell={(colIdx) => {
                      const p = detailedProducts[colIdx];
                      if (!p) return <span className="text-slate-300">—</span>;
                      return (
                        <span className="font-semibold text-slate-800">
                          7-Day Easy Return
                        </span>
                      );
                    }}
                  />

                  <CompareRow
                    label="Authenticity"
                    sublabel="Genuine guarantee"
                    hoveredCol={hoveredCol}
                    colCount={activeColsCount}
                    renderCell={(colIdx) => {
                      const p = detailedProducts[colIdx];
                      if (!p) return <span className="text-slate-300">—</span>;
                      return (
                        <span className="font-semibold text-slate-800">
                          100% Genuine
                        </span>
                      );
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Selection / Replacement Modal */}
      <CompareProductPickerModal
        isOpen={pickerOpen}
        onClose={() => {
          setPickerOpen(false);
          setReplaceSlotIndex(null);
        }}
        onSelectProduct={handleSelectProductFromModal}
        currentProductIds={detailedProducts.map((p) => String(p._id || p.id))}
        replaceSlotIndex={replaceSlotIndex}
        currentProductToReplace={
          replaceSlotIndex !== null ? detailedProducts[replaceSlotIndex] : null
        }
      />
    </main>
  );
}
