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
  Tag,
  Truck,
  ArrowRight,
  Clock,
  Compass,
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
// REUSABLE & HIGH-PERFORMANCE SPEC ROW COMPONENT
// =========================================================================
const CompareSpecRow = memo(function CompareSpecRow({
  icon: Icon = null,
  label,
  sublabel = null,
  renderCell,
  colCount = MAX_COMPARE_PRODUCTS,
  isDifferent = false,
  isAlternate = false,
  hoveredCol = null,
  onColHover = null,
}) {
  return (
    <div
      className={`flex items-stretch transition-colors min-w-max border-b border-slate-100 ${
        isDifferent
          ? "bg-blue-50/40 hover:bg-blue-50/70"
          : isAlternate
            ? "bg-slate-50/50 hover:bg-slate-100/60"
            : "bg-white hover:bg-slate-50/60"
      }`}
    >
      {/* Sticky Left Label Column */}
      <div className="w-[140px] sm:w-[190px] md:w-[230px] shrink-0 sticky left-0 z-10 px-3 sm:px-5 py-3 sm:py-3.5 bg-inherit backdrop-blur-md border-r border-slate-200/90 shadow-[4px_0_12px_-3px_rgba(15,23,42,0.06)] flex items-center justify-between select-none">
        <div className="flex items-center gap-2.5 min-w-0 pr-1">
          {Icon && (
            <div className="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
              <Icon size={12} />
            </div>
          )}
          <div className="min-w-0">
            <span className="text-[11px] sm:text-xs font-bold text-slate-800 leading-tight block truncate">
              {label}
            </span>
            {sublabel && (
              <span className="text-[9px] sm:text-[10px] text-slate-400 leading-tight block truncate mt-0.5">
                {sublabel}
              </span>
            )}
          </div>
        </div>

        {isDifferent && (
          <span
            className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 shrink-0 shadow-2xs"
            title="Values differ across selected products"
          >
            Differs
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
              onMouseEnter={() => onColHover && onColHover(colIdx)}
              onMouseLeave={() => onColHover && onColHover(null)}
              className={`w-[170px] sm:w-[210px] md:w-[240px] shrink-0 px-3 sm:px-5 py-3 sm:py-3.5 text-[11px] sm:text-xs flex items-center border-r border-slate-100/90 transition-colors ${
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

  // Determine active product IDs
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
      const amount = direction === "left" ? -240 : 240;
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

  // Dynamic active columns count: shows existing products + 1 add slot if < 4
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
    toast.success("Product removed from comparison");
  };

  // Handle Clear All
  const handleClearAll = () => {
    setDetailedProducts([]);
    dispatch(clearCompare());
    syncUrlParams([]);
    toast.success("Comparison cleared");
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

  // Pre-calculated differences map
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

  // Count total differences
  const totalDifferencesCount = useMemo(() => {
    let count = 0;
    if (differences.price) count++;
    if (differences.rating) count++;
    if (differences.stock) count++;
    if (differences.brand) count++;
    if (differences.category) count++;
    if (differences.sku) count++;
    if (differences.weight) count++;
    if (differences.dimensions) count++;
    if (differences.countryOfOrigin) count++;
    if (differences.productType) count++;
    Object.values(differences.details || {}).forEach((d) => {
      if (d) count++;
    });
    Object.values(differences.features || {}).forEach((f) => {
      if (f) count++;
    });
    return count;
  }, [differences]);

  // -------------------------------------------------------------
  // RENDER: Loading Skeleton State
  // -------------------------------------------------------------
  if (loading) {
    return (
      <main className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-2">
          <div className="w-20 h-4 bg-slate-200 rounded animate-pulse" />
          <span className="text-slate-300">/</span>
          <div className="w-24 h-4 bg-slate-200 rounded animate-pulse" />
        </div>
        <div className="space-y-2">
          <div className="w-64 h-8 bg-slate-200 rounded-xl animate-pulse" />
          <div className="w-96 h-4 bg-slate-200 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-3xl border border-slate-200/80 p-4 space-y-4 animate-pulse shadow-xs"
            >
              <div className="aspect-square bg-slate-100 rounded-2xl" />
              <div className="w-3/4 h-4 bg-slate-200 rounded" />
              <div className="w-1/2 h-5 bg-slate-200 rounded" />
              <div className="w-full h-10 bg-slate-100 rounded-xl mt-4" />
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
      <main className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 sm:p-6 text-center">
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-sm max-w-md w-full space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
            <AlertCircle size={32} />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-lg sm:text-xl font-black text-slate-900">
              Unable to Load Comparison
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">{loadError}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => fetchProductsData(activeProductIds)}
              className="flex-1 bg-[#2563eb] text-white px-5 py-3 rounded-xl text-xs font-bold hover:bg-[#1d4ed8] transition cursor-pointer flex items-center justify-center gap-2 shadow-sm"
            >
              <RefreshCw size={14} />
              <span>Retry</span>
            </button>
            <Link
              to="/shop"
              className="flex-1 bg-slate-100 text-slate-700 px-5 py-3 rounded-xl text-xs font-bold hover:bg-slate-200 transition text-center"
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
      <main className="min-h-screen bg-[#F8FAFC] py-16 px-4 sm:px-6 flex items-center justify-center">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 sm:p-14 max-w-xl w-full text-center space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-blue-50 text-[#2563eb] border border-blue-100 flex items-center justify-center mx-auto shadow-xs">
            <Scale size={36} strokeWidth={1.8} />
          </div>

          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
              <Sparkles size={11} className="text-[#2563eb]" />
              <span>Studio Comparison Suite</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Compare Products Side-by-Side
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-md mx-auto">
              Evaluate technical specifications, real customer ratings, and live prices to make confident, well-informed purchase decisions.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/shop"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-[#2563eb] text-white px-8 py-3.5 rounded-2xl text-xs font-bold transition-all shadow-sm active:scale-95"
            >
              <Package size={15} />
              <span>Explore Product Catalog</span>
            </Link>
          </div>

          {/* Quick Categories Bar */}
          <div className="pt-6 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 block mb-3 uppercase tracking-wider">
              Popular Categories to Compare
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {["Electronics", "Apparel", "Footwear", "Home Decor", "Beauty", "Gifting"].map((cat) => (
                <Link
                  key={cat}
                  to={`/shop?category=${encodeURIComponent(cat)}`}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-[#2563eb] border border-slate-200/80 text-[11px] font-medium text-slate-600 transition"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  const isSingleProduct = detailedProducts.length === 1;

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-28 font-sans text-slate-800">
      {/* =========================================================
          PAGE TOP HEADER & BREADCRUMB
      ========================================================== */}
      <section className="bg-white border-b border-slate-200/90 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-3">
            <Link to="/" className="hover:text-slate-800 transition">
              Home
            </Link>
            <ChevronRight size={12} />
            <Link to="/shop" className="hover:text-slate-800 transition">
              Shop
            </Link>
            <ChevronRight size={12} />
            <span className="text-slate-800 font-bold">Compare Products</span>
          </nav>

          {/* Title & Actions Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-[#2563eb] text-[10px] font-bold uppercase tracking-wider">
                  <Scale size={12} />
                  <span>Comparison Matrix</span>
                </span>
                <span className="text-[11px] font-bold text-slate-400">
                  {detailedProducts.length} of {MAX_COMPARE_PRODUCTS} slots filled
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight mt-1.5">
                Compare Products & Specifications
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
                Side-by-side analysis, technical specifications, difference detection, and value metrics to help you select the best choice.
              </p>
            </div>

            {/* Action Bar Pills */}
            <div className="flex items-center flex-wrap gap-2 pt-1 lg:pt-0">
              {/* Difference Mode Toggle Switch */}
              <button
                type="button"
                onClick={() => setShowDifferencesOnly(!showDifferencesOnly)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-bold transition cursor-pointer select-none shadow-2xs ${
                  showDifferencesOnly
                    ? "bg-[#2563eb] text-white border-[#2563eb]"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                <SlidersHorizontal size={13} />
                <span>
                  {showDifferencesOnly
                    ? "Showing Differences"
                    : "Highlight Differences"}
                </span>
                {totalDifferencesCount > 0 && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                      showDifferencesOnly
                        ? "bg-white/20 text-white"
                        : "bg-blue-100 text-[#2563eb]"
                    }`}
                  >
                    {totalDifferencesCount}
                  </span>
                )}
              </button>

              {/* Add Product Button */}
              {detailedProducts.length < MAX_COMPARE_PRODUCTS && (
                <button
                  type="button"
                  onClick={() => {
                    setReplaceSlotIndex(null);
                    setPickerOpen(true);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-[#2563eb] text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
                >
                  <Plus size={14} strokeWidth={2.5} />
                  <span>Add Product</span>
                </button>
              )}

              {/* Share */}
              <button
                type="button"
                onClick={handleShare}
                className="p-2 sm:px-3 sm:py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                title="Share comparison link"
              >
                <Share2 size={13} />
                <span className="hidden sm:inline">Share</span>
              </button>

              {/* Clear All */}
              <button
                type="button"
                onClick={handleClearAll}
                className="p-2 sm:px-3 sm:py-2 rounded-xl border border-rose-200/80 bg-rose-50/50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                title="Clear all products"
              >
                <Trash2 size={13} />
                <span className="hidden sm:inline">Clear All</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-5 space-y-5">
        {/* =========================================================
            CATEGORY COMPATIBILITY & NOTICE BANNERS
        ========================================================== */}
        {categoryCompatibility && (
          <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-2">
              {categoryCompatibility.isSameCategory ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-[11px] shadow-2xs">
                  <CheckCircle2 size={13} className="text-emerald-600" />
                  Category: {categoryCompatibility.categories[0]} (Optimal Comparison)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 font-medium text-[11px] shadow-2xs">
                  <Info size={13} className="text-amber-600 shrink-0" />
                  <span>
                    Cross-Category Comparison: {categoryCompatibility.categories.join(", ")}
                  </span>
                </span>
              )}
            </div>

            {/* In-Page Quick Jump Links */}
            <div className="flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden py-0.5">
              <button
                type="button"
                onClick={() => scrollToSection("section-highlights")}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-blue-400 hover:text-[#2563eb] text-slate-600 text-[11px] font-bold cursor-pointer transition shrink-0 shadow-2xs"
              >
                Highlights
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("section-tech")}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-blue-400 hover:text-[#2563eb] text-slate-600 text-[11px] font-bold cursor-pointer transition shrink-0 shadow-2xs"
              >
                Physical Specs
              </button>
              {filteredDetailKeys.length > 0 && (
                <button
                  type="button"
                  onClick={() => scrollToSection("section-specs")}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-blue-400 hover:text-[#2563eb] text-slate-600 text-[11px] font-bold cursor-pointer transition shrink-0 shadow-2xs"
                >
                  Technical Details
                </button>
              )}
              {filteredFeaturesList.length > 0 && (
                <button
                  type="button"
                  onClick={() => scrollToSection("section-features")}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-blue-400 hover:text-[#2563eb] text-slate-600 text-[11px] font-bold cursor-pointer transition shrink-0 shadow-2xs"
                >
                  Features
                </button>
              )}
              <button
                type="button"
                onClick={() => scrollToSection("section-policies")}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-blue-400 hover:text-[#2563eb] text-slate-600 text-[11px] font-bold cursor-pointer transition shrink-0 shadow-2xs"
              >
                Protection
              </button>
            </div>
          </div>
        )}

        {/* Notice for 1 product */}
        {isSingleProduct && (
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-900 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <Info size={18} />
              </div>
              <div>
                <h4 className="text-xs font-black">
                  Add at least one more product to compare
                </h4>
                <p className="text-[11px] text-amber-800 leading-tight">
                  Side-by-side technical specs, diff highlighting, and value analysis unlock when 2 or more products are added.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setReplaceSlotIndex(null);
                setPickerOpen(true);
              }}
              className="bg-amber-700 hover:bg-amber-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shrink-0 shadow-sm active:scale-95"
            >
              <Plus size={14} strokeWidth={2.5} />
              <span>Select Second Product</span>
            </button>
          </div>
        )}

        {/* =========================================================
            INTELLIGENT DECISION CARDS / COMPARISON VERDICT
            (Shown when 2+ products are being compared)
        ========================================================== */}
        {!isSingleProduct && (
          <section className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#2563eb] flex items-center justify-center">
                  <Award size={15} />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900">
                    Studio Comparison Verdict
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Automated smart recommendations based on rating, specs, and price-to-value ratio.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {/* Best Overall Card */}
              {recommendations.bestOverall && (
                <div className="rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50/50 via-white to-purple-50/20 p-4 flex flex-col justify-between space-y-3 relative overflow-hidden shadow-2xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 font-black text-[10px] uppercase tracking-wider">
                      <Award size={11} />
                      <span>Best Overall</span>
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      Top Performance
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl bg-white border border-purple-100 p-1 shrink-0 flex items-center justify-center overflow-hidden shadow-2xs">
                      <img
                        src={
                          recommendations.bestOverall.images?.[0]?.url ||
                          recommendations.bestOverall.images?.[0] ||
                          recommendations.bestOverall.image?.url ||
                          recommendations.bestOverall.image ||
                          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=260"
                        }
                        alt={recommendations.bestOverall.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4
                        className="text-xs font-bold text-slate-900 truncate"
                        title={recommendations.bestOverall.name}
                      >
                        {recommendations.bestOverall.name}
                      </h4>
                      <div className="flex items-baseline gap-1.5 mt-0.5">
                        <span className="text-sm font-black text-slate-900">
                          ₹{Number(recommendations.bestOverall.price || 0).toLocaleString()}
                        </span>
                        <span className="text-[11px] font-bold text-amber-500 flex items-center gap-0.5">
                          <Star size={10} fill="currentColor" />
                          <span>
                            {Number(
                              recommendations.bestOverall.rating ||
                                recommendations.bestOverall.ratings ||
                                4.5,
                            ).toFixed(1)}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) =>
                      handleDirectAddToCart(recommendations.bestOverall, e)
                    }
                    className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                  >
                    <ShoppingCart size={12} />
                    <span>Choose Best Overall</span>
                  </button>
                </div>
              )}

              {/* Best Value Card */}
              {recommendations.bestValue && (
                <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50/50 via-white to-blue-50/20 p-4 flex flex-col justify-between space-y-3 relative overflow-hidden shadow-2xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-100 text-[#2563eb] font-black text-[10px] uppercase tracking-wider">
                      <Zap size={11} />
                      <span>Best Value</span>
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      Highest Return
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl bg-white border border-blue-100 p-1 shrink-0 flex items-center justify-center overflow-hidden shadow-2xs">
                      <img
                        src={
                          recommendations.bestValue.images?.[0]?.url ||
                          recommendations.bestValue.images?.[0] ||
                          recommendations.bestValue.image?.url ||
                          recommendations.bestValue.image ||
                          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=260"
                        }
                        alt={recommendations.bestValue.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4
                        className="text-xs font-bold text-slate-900 truncate"
                        title={recommendations.bestValue.name}
                      >
                        {recommendations.bestValue.name}
                      </h4>
                      <div className="flex items-baseline gap-1.5 mt-0.5">
                        <span className="text-sm font-black text-[#2563eb]">
                          ₹{Number(recommendations.bestValue.price || 0).toLocaleString()}
                        </span>
                        <span className="text-[11px] font-bold text-amber-500 flex items-center gap-0.5">
                          <Star size={10} fill="currentColor" />
                          <span>
                            {Number(
                              recommendations.bestValue.rating ||
                                recommendations.bestValue.ratings ||
                                4.5,
                            ).toFixed(1)}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) =>
                      handleDirectAddToCart(recommendations.bestValue, e)
                    }
                    className="w-full py-2 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                  >
                    <ShoppingCart size={12} />
                    <span>Choose Best Value</span>
                  </button>
                </div>
              )}

              {/* Lowest Price Card */}
              {recommendations.lowestPrice && (
                <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50/50 via-white to-emerald-50/20 p-4 flex flex-col justify-between space-y-3 relative overflow-hidden shadow-2xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-black text-[10px] uppercase tracking-wider">
                      <Tag size={11} />
                      <span>Lowest Price</span>
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      Budget Pick
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl bg-white border border-emerald-100 p-1 shrink-0 flex items-center justify-center overflow-hidden shadow-2xs">
                      <img
                        src={
                          recommendations.lowestPrice.images?.[0]?.url ||
                          recommendations.lowestPrice.images?.[0] ||
                          recommendations.lowestPrice.image?.url ||
                          recommendations.lowestPrice.image ||
                          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=260"
                        }
                        alt={recommendations.lowestPrice.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4
                        className="text-xs font-bold text-slate-900 truncate"
                        title={recommendations.lowestPrice.name}
                      >
                        {recommendations.lowestPrice.name}
                      </h4>
                      <div className="flex items-baseline gap-1.5 mt-0.5">
                        <span className="text-sm font-black text-emerald-600">
                          ₹{Number(recommendations.lowestPrice.price || 0).toLocaleString()}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                          Lowest
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) =>
                      handleDirectAddToCart(recommendations.lowestPrice, e)
                    }
                    className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                  >
                    <ShoppingCart size={12} />
                    <span>Choose Lowest Price</span>
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* =========================================================
            COMPARISON MATRIX CANVAS
        ========================================================== */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
          {/* Search Specs & Scroll Controls Toolbar */}
          <div className="p-3 sm:p-4 bg-slate-50/90 border-b border-slate-200/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search
                size={14}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search specs (material, warranty, weight, battery...)"
                value={specSearchQuery}
                onChange={(e) => setSpecSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-xs bg-white border border-slate-200 rounded-xl outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-blue-100 transition"
              />
              {specSearchQuery && (
                <button
                  type="button"
                  onClick={() => setSpecSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Scroll Navigation Buttons & Hint */}
            <div className="flex items-center justify-between sm:justify-end gap-2.5">
              <span className="text-[11px] text-slate-400 font-medium md:hidden">
                Swipe table horizontally ↔
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleTableScroll("left")}
                  disabled={!canScrollLeft}
                  className="p-1.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-[#2563eb] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shadow-2xs transition"
                  title="Scroll left"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => handleTableScroll("right")}
                  disabled={!canScrollRight}
                  className="p-1.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-[#2563eb] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shadow-2xs transition"
                  title="Scroll right"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Horizontally Scrollable Table Canvas */}
          <div className="relative">
            {/* Right Scroll Indicator Gradient for touch screens */}
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
                ==================================================== */}
                <div className="flex items-stretch bg-slate-50/95 border-b border-slate-200/90 sticky top-0 z-20 backdrop-blur-md min-w-max shadow-2xs">
                  {/* Sticky Left Header Label */}
                  <div className="w-[140px] sm:w-[190px] md:w-[230px] shrink-0 sticky left-0 z-30 p-3 sm:p-5 bg-slate-50/95 backdrop-blur-md border-r border-slate-200/90 shadow-[4px_0_12px_-3px_rgba(15,23,42,0.06)] flex flex-col justify-end">
                    <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                      Catalog Matrix
                    </span>
                    <h3 className="text-xs sm:text-sm font-black text-slate-900 mt-0.5 leading-tight">
                      Selected Products
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-1 hidden sm:block">
                      Hover column to highlight specs.
                    </p>
                  </div>

                  {/* Product Cards Row */}
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
                        const discount =
                          prodOriginalPrice && prodOriginalPrice > prodPrice
                            ? Math.round(
                                ((prodOriginalPrice - prodPrice) /
                                  prodOriginalPrice) *
                                  100,
                              )
                            : 0;

                        return (
                          <div
                            key={prodId}
                            onMouseEnter={() => setHoveredCol(idx)}
                            onMouseLeave={() => setHoveredCol(null)}
                            className={`w-[170px] sm:w-[210px] md:w-[240px] shrink-0 p-3 sm:p-4 flex flex-col justify-between transition-colors relative border-r border-slate-100 ${
                              isHoveredCol ? "bg-blue-50/30" : "bg-transparent"
                            }`}
                          >
                            {/* Remove button */}
                            <button
                              type="button"
                              onClick={() => handleRemoveProduct(prodId)}
                              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-slate-200/70 hover:bg-rose-500 hover:text-white text-slate-600 flex items-center justify-center transition cursor-pointer z-10 shadow-2xs"
                              title="Remove product"
                              aria-label={`Remove ${prod.name}`}
                            >
                              <X size={12} strokeWidth={2.5} />
                            </button>

                            <div className="space-y-2">
                              {/* Slot Tag */}
                              <div className="flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-slate-400">
                                <span>Slot 0{idx + 1}</span>
                              </div>

                              {/* Thumbnail */}
                              <div className="aspect-square w-full rounded-2xl bg-white border border-slate-200/80 p-2.5 flex items-center justify-center overflow-hidden shadow-2xs group">
                                <img
                                  src={prodImg}
                                  alt={prod.name}
                                  loading="lazy"
                                  decoding="async"
                                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                                />
                              </div>

                              {/* Brand & Name */}
                              <div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate block">
                                  {prod.brand ||
                                    prod.business?.businessName ||
                                    prod.vendor?.storeName ||
                                    "Studio Verified"}
                                </span>
                                <h4
                                  className="text-xs sm:text-[13px] font-bold text-slate-900 line-clamp-2 h-8 leading-4 mt-0.5"
                                  title={prod.name}
                                >
                                  {prod.name}
                                </h4>
                              </div>

                              {/* Rating */}
                              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-500">
                                <Star size={12} fill="currentColor" />
                                <span>{prodRating}</span>
                                <span className="text-slate-400 font-normal text-[10px]">
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
                                <div className="flex items-baseline gap-1.5 flex-wrap">
                                  <span className="text-sm sm:text-base font-black text-slate-900">
                                    ₹{prodPrice.toLocaleString()}
                                  </span>
                                  {prodOriginalPrice &&
                                    prodOriginalPrice > prodPrice && (
                                      <span className="text-[10px] text-slate-400 line-through">
                                        ₹{prodOriginalPrice.toLocaleString()}
                                      </span>
                                    )}
                                  {discount > 0 && (
                                    <span className="text-[9px] font-black text-emerald-700 bg-emerald-100 px-1 py-0.2 rounded">
                                      {discount}% off
                                    </span>
                                  )}
                                </div>
                                <span
                                  className={`inline-flex items-center gap-1 mt-1 text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                                    inStock
                                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                      : "bg-slate-100 text-slate-500"
                                  }`}
                                >
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full ${
                                      inStock ? "bg-emerald-500" : "bg-slate-400"
                                    }`}
                                  />
                                  <span>{inStock ? "In Stock" : "Out of Stock"}</span>
                                </span>
                              </div>
                            </div>

                            {/* Direct Actions */}
                            <div className="pt-3 mt-3 border-t border-slate-200/70 space-y-1.5">
                              <button
                                type="button"
                                onClick={(e) => handleDirectAddToCart(prod, e)}
                                disabled={!inStock}
                                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-[#2563eb] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                              >
                                <ShoppingCart size={13} />
                                <span>Add to Cart</span>
                              </button>

                              <div className="grid grid-cols-2 gap-1.5">
                                <Link
                                  to={`/products/${prodId}`}
                                  className="py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold transition flex items-center justify-center gap-1 cursor-pointer text-center"
                                >
                                  <span>Details</span>
                                  <ExternalLink size={9} />
                                </Link>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setReplaceSlotIndex(idx);
                                    setPickerOpen(true);
                                  }}
                                  className="py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-bold transition cursor-pointer flex items-center justify-center gap-1"
                                >
                                  <RotateCcw size={9} />
                                  <span>Replace</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      }

                      // Empty Slot Card
                      return (
                        <div
                          key="add-next-slot"
                          className="w-[170px] sm:w-[210px] md:w-[240px] shrink-0 p-3 sm:p-4 flex flex-col items-center justify-center border-r border-slate-100 bg-slate-50/50"
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setReplaceSlotIndex(null);
                              setPickerOpen(true);
                            }}
                            className="flex flex-col items-center gap-2.5 cursor-pointer p-4 rounded-2xl border-2 border-dashed border-slate-200 hover:border-[#2563eb] w-full h-full justify-center transition-colors group active:scale-95 bg-white/50"
                          >
                            <div className="w-10 h-10 rounded-2xl bg-blue-50 group-hover:bg-[#2563eb] text-[#2563eb] group-hover:text-white flex items-center justify-center transition-colors shadow-2xs">
                              <Plus size={18} strokeWidth={2.5} />
                            </div>
                            <div className="text-center">
                              <span className="text-xs font-bold text-slate-800 group-hover:text-[#2563eb] transition-colors block">
                                Add Product
                              </span>
                              <span className="text-[10px] text-slate-400 mt-0.5 block">
                                Slot {detailedProducts.length + 1} of{" "}
                                {MAX_COMPARE_PRODUCTS}
                              </span>
                            </div>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ===================================================
                    SECTION 1: KEY HIGHLIGHTS & PRICING
                ==================================================== */}
                <div id="section-highlights">
                  <div className="px-4 py-2.5 bg-slate-100/90 border-b border-slate-200 text-[10px] font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
                    <Sparkles size={13} className="text-[#2563eb]" />
                    <span>Key Highlights & Pricing</span>
                  </div>

                  {/* Price */}
                  {(!showDifferencesOnly || differences.price) && (
                    <CompareSpecRow
                      icon={Tag}
                      label="Selling Price"
                      sublabel="Base retail price"
                      hoveredCol={hoveredCol}
                      onColHover={setHoveredCol}
                      colCount={activeColsCount}
                      isDifferent={differences.price}
                      renderCell={(colIdx) => {
                        const p = detailedProducts[colIdx];
                        if (!p)
                          return <span className="text-slate-300">—</span>;
                        const isLowest =
                          recommendations.lowestPrice?._id === (p._id || p.id);
                        return (
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span
                              className={
                                isLowest
                                  ? "text-emerald-700 font-black text-xs sm:text-sm"
                                  : "text-slate-900 font-bold"
                              }
                            >
                              ₹{Number(p.price || 0).toLocaleString()}
                            </span>
                            {isLowest && !isSingleProduct && (
                              <span className="text-[9px] font-black bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded shadow-2xs">
                                Lowest
                              </span>
                            )}
                          </div>
                        );
                      }}
                    />
                  )}

                  {/* Rating */}
                  {(!showDifferencesOnly || differences.rating) && (
                    <CompareSpecRow
                      icon={Star}
                      label="Customer Rating"
                      sublabel="Verified review score"
                      hoveredCol={hoveredCol}
                      onColHover={setHoveredCol}
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
                              size={12}
                              fill="currentColor"
                              className="text-amber-400"
                            />
                            <span className="text-slate-900">
                              {Number(p.rating || p.ratings || 4.5).toFixed(1)}
                            </span>
                            {isHighest && !isSingleProduct && (
                              <span className="text-[9px] font-black bg-purple-100 text-purple-700 px-1.5 py-0.2 rounded ml-1">
                                Top Rated
                              </span>
                            )}
                          </div>
                        );
                      }}
                    />
                  )}

                  {/* Availability */}
                  {(!showDifferencesOnly || differences.stock) && (
                    <CompareSpecRow
                      icon={Package}
                      label="Stock Status"
                      sublabel="Inventory availability"
                      hoveredCol={hoveredCol}
                      onColHover={setHoveredCol}
                      colCount={activeColsCount}
                      isDifferent={differences.stock}
                      renderCell={(colIdx) => {
                        const p = detailedProducts[colIdx];
                        if (!p)
                          return <span className="text-slate-300">—</span>;
                        const inStock = p.inStock !== false && !p.isOutOfStock;
                        return (
                          <span
                            className={`font-bold flex items-center gap-1.5 ${
                              inStock ? "text-emerald-700" : "text-slate-400"
                            }`}
                          >
                            {inStock ? (
                              <>
                                <CheckCircle2 size={13} className="text-emerald-600" />
                                <span>In Stock</span>
                              </>
                            ) : (
                              <>
                                <XCircle size={13} className="text-slate-400" />
                                <span>Out of Stock</span>
                              </>
                            )}
                          </span>
                        );
                      }}
                    />
                  )}

                  {/* Brand */}
                  {(!showDifferencesOnly || differences.brand) && (
                    <CompareSpecRow
                      icon={Award}
                      label="Brand / Store"
                      sublabel="Merchant identity"
                      hoveredCol={hoveredCol}
                      onColHover={setHoveredCol}
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

                  {/* Category & Tax */}
                  {(!showDifferencesOnly || differences.category) && (
                    <CompareSpecRow
                      icon={Layers}
                      label="Category & Tax"
                      sublabel="Classification & GST"
                      hoveredCol={hoveredCol}
                      onColHover={setHoveredCol}
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
                            <span className="text-[10px] text-slate-400">
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
                  <div className="px-4 py-2.5 bg-slate-100/90 border-b border-slate-200 text-[10px] font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
                    <Package size={13} className="text-[#2563eb]" />
                    <span>Physical Dimensions & Catalog Info</span>
                  </div>

                  {/* SKU */}
                  {(!showDifferencesOnly || differences.sku) && (
                    <CompareSpecRow
                      icon={Tag}
                      label="SKU / Identifier"
                      sublabel="Catalog inventory code"
                      hoveredCol={hoveredCol}
                      onColHover={setHoveredCol}
                      colCount={activeColsCount}
                      isDifferent={differences.sku}
                      renderCell={(colIdx) => {
                        const p = detailedProducts[colIdx];
                        if (!p)
                          return <span className="text-slate-300">—</span>;
                        return (
                          <span className="font-mono text-[11px] font-semibold text-slate-700 truncate">
                            {p.sku || "—"}
                          </span>
                        );
                      }}
                    />
                  )}

                  {/* Weight */}
                  {(!showDifferencesOnly || differences.weight) && (
                    <CompareSpecRow
                      icon={Scale}
                      label="Product Weight"
                      sublabel="Net item mass"
                      hoveredCol={hoveredCol}
                      onColHover={setHoveredCol}
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
                    <CompareSpecRow
                      icon={Compass}
                      label="Dimensions"
                      sublabel="L × W × H (cm)"
                      hoveredCol={hoveredCol}
                      onColHover={setHoveredCol}
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
                              ? `${p.dimensions.length} × ${p.dimensions.width} × ${p.dimensions.height} cm`
                              : "—"}
                          </span>
                        );
                      }}
                    />
                  )}

                  {/* Country of Origin */}
                  {(!showDifferencesOnly || differences.countryOfOrigin) && (
                    <CompareSpecRow
                      icon={ShieldCheck}
                      label="Country of Origin"
                      sublabel="Manufacturing country"
                      hoveredCol={hoveredCol}
                      onColHover={setHoveredCol}
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
                    <CompareSpecRow
                      icon={Layers}
                      label="Catalog Type"
                      sublabel="Product classification"
                      hoveredCol={hoveredCol}
                      onColHover={setHoveredCol}
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
                    <div className="px-4 py-2.5 bg-slate-100/90 border-b border-slate-200 text-[10px] font-black uppercase tracking-wider text-slate-700 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Layers size={13} className="text-[#2563eb]" />
                        <span>Technical Specifications Matrix</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-bold">
                        {filteredDetailKeys.length} specs
                      </span>
                    </div>

                    {filteredDetailKeys.map((titleKey, dIdx) => {
                      const isDiff = differences.details?.[titleKey] || false;
                      if (showDifferencesOnly && !isDiff) {
                        return null;
                      }

                      return (
                        <CompareSpecRow
                          key={titleKey}
                          icon={Layers}
                          label={titleKey}
                          sublabel="Technical parameter"
                          hoveredCol={hoveredCol}
                          onColHover={setHoveredCol}
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
                    <div className="px-4 py-2.5 bg-slate-100/90 border-b border-slate-200 text-[10px] font-black uppercase tracking-wider text-slate-700 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={13} className="text-emerald-600" />
                        <span>Feature Checklist</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-bold">
                        {filteredFeaturesList.length} features
                      </span>
                    </div>

                    {filteredFeaturesList.map((featureText, fIdx) => {
                      const isDiff =
                        differences.features?.[featureText] || false;
                      if (showDifferencesOnly && !isDiff) {
                        return null;
                      }

                      return (
                        <CompareSpecRow
                          key={featureText}
                          icon={Check}
                          label={featureText}
                          sublabel="Feature capability"
                          hoveredCol={hoveredCol}
                          onColHover={setHoveredCol}
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
                                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[11px] border border-emerald-200">
                                    <Check size={12} strokeWidth={2.5} />
                                    <span>Included</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-100 text-slate-400 font-medium text-[11px]">
                                    <X size={11} strokeWidth={2} />
                                    <span>Not Specified</span>
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
                  <div className="px-4 py-2.5 bg-slate-100/90 border-b border-slate-200 text-[10px] font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
                    <ShieldCheck size={13} className="text-[#2563eb]" />
                    <span>Store Policies & Buyer Protection</span>
                  </div>

                  <CompareSpecRow
                    icon={Truck}
                    label="Dispatch Speed"
                    sublabel="Warehouse processing"
                    hoveredCol={hoveredCol}
                    onColHover={setHoveredCol}
                    colCount={activeColsCount}
                    renderCell={(colIdx) => {
                      const p = detailedProducts[colIdx];
                      if (!p) return <span className="text-slate-300">—</span>;
                      return (
                        <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                          <Clock size={12} className="text-blue-600" />
                          <span>24-48 Hours Express</span>
                        </div>
                      );
                    }}
                  />

                  <CompareSpecRow
                    icon={RotateCcw}
                    label="Return Window"
                    sublabel="Hassle-free replacement"
                    hoveredCol={hoveredCol}
                    onColHover={setHoveredCol}
                    colCount={activeColsCount}
                    isAlternate
                    renderCell={(colIdx) => {
                      const p = detailedProducts[colIdx];
                      if (!p) return <span className="text-slate-300">—</span>;
                      return (
                        <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                          <CheckCircle2 size={12} className="text-emerald-600" />
                          <span>7-Day Easy Returns</span>
                        </div>
                      );
                    }}
                  />

                  <CompareSpecRow
                    icon={ShieldCheck}
                    label="Authenticity Guarantee"
                    sublabel="Original merchant guarantee"
                    hoveredCol={hoveredCol}
                    onColHover={setHoveredCol}
                    colCount={activeColsCount}
                    renderCell={(colIdx) => {
                      const p = detailedProducts[colIdx];
                      if (!p) return <span className="text-slate-300">—</span>;
                      return (
                        <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                          <ShieldCheck size={12} className="text-blue-600" />
                          <span>100% Genuine Guarantee</span>
                        </div>
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
