import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Heart,
  Share2,
  Star,
  Truck,
  ShieldCheck,
  RotateCcw,
  Minus,
  Plus,
  X,
  Check,
  Play,
  Copy,
  MessageSquare,
  ChevronRight,
  ShoppingCart,
  MapPin,
  Sparkles,
  ThumbsUp,
  Camera,
  Image as ImageIcon,
  Trash2,
  Upload,
  Building2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Package,
  FileText,
  Lock,
  Clock,
  HelpCircle,
  ArrowRight,
} from "lucide-react";
import { getProductById, checkCustomerDelivery, getallProducts } from "../../api/productService";
import {
  getProductReviews,
  createReview as createProductReview,
  toggleReviewHelpful,
} from "../../api/reviewService";
import { addToCart } from "../../redux/reducers/cartReducer";
import { toggleWishlist } from "../../redux/reducers/wishlistReducer";
import { DetailSkeleton } from "../../Components/Skeletons";
import { getProductFlashDealStatus } from "../../api/flashDealService";
import ProductCard from "../../Components/ProductCard";
import toast from "react-hot-toast";

const DEFAULT_POLICIES = [
  {
    _id: "def_shipping",
    title: "Shipping & Fast Dispatch Policy",
    type: "shipping_policy",
    targetScope: "BUSINESS",
    content:
      "All orders are processed and dispatched within 24-48 hours. Standard delivery takes 3-5 business days across serviceable PIN codes in India. Live tracking updates are provided via SMS and Email as soon as the courier partner receives the package.",
    version: "1.0",
  },
  {
    _id: "def_returns",
    title: "7-Day Return & Replacement Policy",
    type: "return_refund_policy",
    targetScope: "BUSINESS",
    content:
      "Enjoy a hassle-free 7-day return or exchange policy from delivery date on all eligible products if received damaged, defective, or incorrect. Items must be in original condition with tags and packaging intact. Refunds are credited to original payment method in 3-5 banking days.",
    version: "1.0",
  },
  {
    _id: "def_quality",
    title: "100% Quality & Authenticity Guarantee",
    type: "terms_and_conditions",
    targetScope: "BUSINESS",
    content:
      "All products curated on ILumaaStudio undergo strict multi-point quality inspections. Handcrafted and artisanal items follow sustainable manufacturing and authentic raw material standards.",
    version: "1.0",
  },
  {
    _id: "def_cancellation",
    title: "Order Cancellation & Secure Transaction Policy",
    type: "cancellation_policy",
    targetScope: "BUSINESS",
    content:
      "Orders can be cancelled at zero charge before dispatch. Transactions are protected by 256-bit SSL encrypted gateways supporting UPI, Cards, NetBanking, and Cash on Delivery.",
    version: "1.0",
  },
];

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated, user } = useSelector((s) => s.auth);
  const wishlistItems = useSelector((s) => s.wishlist?.items || []);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState("overview");

  // Policies and Recommendations state
  const [policies, setPolicies] = useState(DEFAULT_POLICIES);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(true);

  // Variant Selection State
  const [selectedOptions, setSelectedOptions] = useState({});

  // Pincode Delivery Check state
  const [pincode, setPincode] = useState("");
  const [checkingPincode, setCheckingPincode] = useState(false);
  const [pincodeMsg, setPincodeMsg] = useState(null);

  // Live reviews state & helpful tracking
  const [liveReviews, setLiveReviews] = useState([]);

  // Fetch product, reviews, policies, and recommendations
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const [pRes, rRes, fdRes] = await Promise.allSettled([
          getProductById(id),
          getProductReviews(id),
          getProductFlashDealStatus(id),
        ]);

        const pData =
          pRes.status === "fulfilled"
            ? pRes.value?.product || pRes.value?.data || pRes.value
            : null;

        const fetchedPolicies =
          pRes.status === "fulfilled" && Array.isArray(pRes.value?.policies) && pRes.value.policies.length > 0
            ? pRes.value.policies
            : DEFAULT_POLICIES;

        setPolicies(fetchedPolicies);

        const fdData = fdRes.status === "fulfilled" ? fdRes.value : null;

        if (pData && fdData && fdData.isFlashDeal) {
          pData.originalPrice = fdData.originalPrice;
          pData.price = fdData.effectivePrice;
          pData.isFlashDeal = true;
          pData.flashDealInfo = fdData.flashDealInfo;
          pData.savingsAmount = fdData.savingsAmount;
          pData.discountPercentage = fdData.discountPercentage;
        }

        setProduct(pData);

        if (pData?.images?.length > 0) {
          setSelectedImage(pData.images[0].url);
        }

        // Initialize default selected options for variants
        if (pData?.hasVariants && Array.isArray(pData?.optionDefinitions)) {
          const initialOpts = {};
          pData.optionDefinitions.forEach((opt) => {
            if (opt.name && Array.isArray(opt.values) && opt.values.length > 0) {
              initialOpts[opt.name] = opt.values[0];
            }
          });
          setSelectedOptions(initialOpts);
        }

        const rData =
          rRes.status === "fulfilled"
            ? rRes.value?.reviews || rRes.value?.data || []
            : [];
        setLiveReviews(rData);

        // Fetch related / recommended products
        try {
          setLoadingRelated(true);
          const recRes = await getallProducts({ limit: 12 });
          const recList = Array.isArray(recRes)
            ? recRes
            : recRes?.products || recRes?.data || [];
          const filtered = recList.filter(
            (item) => String(item._id || item.id) !== String(id)
          );
          setRelatedProducts(filtered.slice(0, 8));
        } catch (e) {
          console.error("Error fetching recommended products:", e);
        } finally {
          setLoadingRelated(false);
        }
      } catch (err) {
        console.error("Error fetching product details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  // Compute active matching variant
  const activeVariant = useMemo(() => {
    if (!product?.hasVariants || !Array.isArray(product.variants)) return null;
    return product.variants.find((v) => {
      if (!v.optionValues || typeof v.optionValues !== "object") return false;
      const selEntries = Object.entries(selectedOptions);
      if (selEntries.length === 0) return false;

      return selEntries.every(([key, val]) => {
        const matchedKey = Object.keys(v.optionValues).find(
          (k) => k.toLowerCase() === key.toLowerCase()
        );
        if (!matchedKey) return false;
        return (
          String(v.optionValues[matchedKey]).trim().toLowerCase() ===
          String(val).trim().toLowerCase()
        );
      });
    });
  }, [product, selectedOptions]);

  // Dynamic Effective Price Resolution (Variant price override vs Product fallback)
  const effectivePrice = useMemo(() => {
    if (
      activeVariant &&
      activeVariant.price !== null &&
      activeVariant.price !== undefined &&
      activeVariant.price !== "" &&
      !isNaN(Number(activeVariant.price))
    ) {
      return Number(activeVariant.price);
    }
    return Number(product?.price || 0);
  }, [activeVariant, product]);

  const effectiveCompareAtPrice = useMemo(() => {
    if (
      activeVariant &&
      activeVariant.compareAtPrice !== null &&
      activeVariant.compareAtPrice !== undefined &&
      activeVariant.compareAtPrice !== "" &&
      !isNaN(Number(activeVariant.compareAtPrice))
    ) {
      return Number(activeVariant.compareAtPrice);
    }
    return product?.compareAtPrice ? Number(product.compareAtPrice) : null;
  }, [activeVariant, product]);

  // Update image when active variant changes and has image
  useEffect(() => {
    if (activeVariant?.image?.url) {
      setSelectedImage(activeVariant.image.url);
    }
  }, [activeVariant]);

  if (loading) return <DetailSkeleton />;

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
        <div className="space-y-4 max-w-md">
          <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center mx-auto text-2xl">
            📦
          </div>
          <h2 className="text-xl font-black text-slate-900">Product Not Found</h2>
          <p className="text-xs text-slate-500">The product you are looking for is unavailable or has been removed.</p>
          <Link
            to="/shop"
            className="inline-block bg-[#2563eb] text-white px-6 py-2.5 rounded-xl font-bold text-xs"
          >
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const displayProduct = product;
  const isWished = wishlistItems.some(
    (i) => (i._id || i.id || i) === displayProduct._id || String(i) === String(displayProduct._id)
  );

  const inStock = (() => {
    if (displayProduct.hasVariants && activeVariant) {
      return (
        activeVariant.stockQuantity === undefined ||
        activeVariant.stockQuantity > 0
      );
    }
    return displayProduct.stock === undefined || displayProduct.stock > 0;
  })();

  const handleOptionSelect = (optName, val) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optName]: val,
    }));
  };

  const handleAddToCart = () => {
    if (!inStock) return;
    dispatch(
      addToCart({
        product: {
          _id: displayProduct._id,
          name: displayProduct.name,
          price: effectivePrice,
          compareAtPrice: effectiveCompareAtPrice,
          image: selectedImage || displayProduct.images?.[0]?.url,
          selectedVariant: activeVariant
            ? {
                sku: activeVariant.sku,
                optionValues: activeVariant.optionValues,
                price: activeVariant.price,
              }
            : null,
        },
        quantity: qty,
      })
    );
    toast.success(`${displayProduct.name} added to cart!`);
  };

  const handleBuyNow = () => {
    if (!inStock) return;
    handleAddToCart();
    navigate("/cart");
  };

  const handleToggleWishlist = () => {
    dispatch(
      toggleWishlist({
        _id: displayProduct._id,
        name: displayProduct.name,
        price: effectivePrice,
        image: selectedImage || displayProduct.images?.[0]?.url,
        category: displayProduct.category?.name || displayProduct.category,
      })
    );
    if (isWished) {
      toast.success("Removed from Wishlist");
    } else {
      toast.success("Added to Wishlist!");
    }
  };

  const handlePincodeCheck = async (e) => {
    e.preventDefault();
    if (!pincode || pincode.trim().length !== 6) {
      setPincodeMsg({ success: false, text: "Please enter a valid 6-digit pincode." });
      return;
    }

    try {
      setCheckingPincode(true);
      setPincodeMsg(null);
      const res = await checkCustomerDelivery({
        productId: displayProduct._id,
        pincode: pincode.trim(),
      });
      if (res?.deliverable) {
        setPincodeMsg({
          success: true,
          text: `Delivery available for ${pincode}! Estimated delivery in 3-5 business days.`,
        });
      } else {
        setPincodeMsg({
          success: false,
          text: `Sorry, this item is currently not deliverable to ${pincode}.`,
        });
      }
    } catch {
      setPincodeMsg({
        success: true,
        text: `Standard shipping available for ${pincode} in 3-5 business days.`,
      });
    } finally {
      setCheckingPincode(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 overflow-x-auto whitespace-nowrap py-1">
          <Link to="/" className="hover:text-[#2563eb]">Home</Link>
          <ChevronRight size={12} />
          <Link to="/shop" className="hover:text-[#2563eb]">Shop</Link>
          <ChevronRight size={12} />
          {displayProduct.category && (
            <>
              <span className="hover:text-[#2563eb] cursor-pointer">
                {typeof displayProduct.category === "object"
                  ? displayProduct.category.name
                  : displayProduct.category}
              </span>
              <ChevronRight size={12} />
            </>
          )}
          <span className="text-slate-900 font-bold truncate max-w-[200px] sm:max-w-xs">
            {displayProduct.name}
          </span>
        </div>

        {/* Main Product Showcase Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
          
          {/* Left Column: Image Gallery (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Main Stage Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center p-4">
              {displayProduct.isFlashDeal && (
                <span className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full bg-rose-600 text-white text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1">
                  <Sparkles size={12} />
                  Flash Deal
                </span>
              )}

              <button
                type="button"
                onClick={handleToggleWishlist}
                className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                title="Add to Wishlist"
              >
                <Heart
                  size={18}
                  className={isWished ? "fill-rose-500 text-rose-500" : ""}
                />
              </button>

              <img
                src={selectedImage || displayProduct.images?.[0]?.url || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600"}
                alt={displayProduct.name}
                className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Thumbnail Strip */}
            {displayProduct.images && displayProduct.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                {displayProduct.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(img.url)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 p-1 bg-slate-50 transition cursor-pointer ${
                      selectedImage === img.url
                        ? "border-[#2563eb] shadow-sm"
                        : "border-slate-200 hover:border-slate-400"
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Info & Actions (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Title & Ratings */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase text-[#2563eb] tracking-widest bg-blue-50 px-2.5 py-0.5 rounded-md">
                  {typeof displayProduct.category === "object"
                    ? displayProduct.category.name
                    : displayProduct.category || "General"}
                </span>
                {displayProduct.vendor?.storeName && (
                  <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                    <Building2 size={13} className="text-slate-400" />
                    Sold by: <span className="font-bold text-slate-800">{displayProduct.vendor.storeName}</span>
                  </span>
                )}
              </div>

              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                {displayProduct.name}
              </h1>

              <div className="flex items-center gap-4 pt-1">
                <div className="flex items-center gap-1 text-amber-400">
                  <Star size={16} fill="currentColor" />
                  <span className="text-xs font-black text-slate-900">
                    {displayProduct.rating || 4.5}
                  </span>
                  <span className="text-xs text-slate-400">({liveReviews.length} reviews)</span>
                </div>

                {(activeVariant?.sku || displayProduct.sku) && (
                  <span className="text-xs font-mono font-bold text-slate-400">
                    SKU: {activeVariant?.sku || displayProduct.sku}
                  </span>
                )}
              </div>
            </div>

            {/* Price Box */}
            <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200/80 space-y-1">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-[#2563eb]">
                  ₹{effectivePrice.toLocaleString()}
                </span>
                {effectiveCompareAtPrice && effectiveCompareAtPrice > effectivePrice && (
                  <span className="text-sm text-slate-400 line-through">
                    ₹{effectiveCompareAtPrice.toLocaleString()}
                  </span>
                )}
                {displayProduct.discount && (
                  <span className="bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full text-[10px] font-black">
                    Save {displayProduct.discount}
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-400">Inclusive of all taxes & verified warranty</p>
            </div>

            {/* Dynamic Variant Options Selectors */}
            {displayProduct.hasVariants &&
              Array.isArray(displayProduct.optionDefinitions) &&
              displayProduct.optionDefinitions.length > 0 && (
                <div className="space-y-4 p-4 bg-slate-50 rounded-2xl border border-slate-200/60">
                  {displayProduct.optionDefinitions.map((opt, oIdx) => {
                    const optName = opt.name;
                    const optValues = Array.isArray(opt.values) ? opt.values : [];
                    if (!optName || optValues.length === 0) return null;

                    return (
                      <div key={oIdx} className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 flex justify-between">
                          <span>Select {optName}:</span>
                          <span className="text-[#2563eb]">{selectedOptions[optName]}</span>
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {optValues.map((val, vIdx) => {
                            const isSelected = selectedOptions[optName] === val;
                            return (
                              <button
                                key={vIdx}
                                type="button"
                                onClick={() => handleOptionSelect(optName, val)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
                                  isSelected
                                    ? "bg-[#2563eb] text-white border-[#2563eb] shadow-2xs"
                                    : "bg-white text-slate-700 border-slate-200 hover:border-slate-400"
                                }`}
                              >
                                {val}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            {/* Quantity Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Quantity</label>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-slate-200 rounded-xl bg-white p-1">
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="p-1.5 text-slate-500 hover:text-slate-900 cursor-pointer"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="px-4 text-xs font-bold text-slate-900">{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty((q) => q + 1)}
                    className="p-1.5 text-slate-500 hover:text-slate-900 cursor-pointer"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!inStock}
                className="w-full py-3.5 px-6 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-md"
              >
                <ShoppingCart size={16} />
                <span>Add to Cart</span>
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={!inStock}
                className="w-full py-3.5 px-6 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-blue-500/25"
              >
                <span>Buy Now</span>
              </button>
            </div>

            {/* Business Policy Summary Highlights Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center gap-2">
                <Truck size={18} className="text-[#2563eb] shrink-0" />
                <div>
                  <h4 className="text-[11px] font-black text-slate-900">Fast Shipping</h4>
                  <p className="text-[9px] text-slate-500">3-5 Days Delivery</p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center gap-2">
                <RotateCcw size={18} className="text-[#2563eb] shrink-0" />
                <div>
                  <h4 className="text-[11px] font-black text-slate-900">7 Days Return</h4>
                  <p className="text-[9px] text-slate-500">Easy Replacement</p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center gap-2">
                <ShieldCheck size={18} className="text-[#2563eb] shrink-0" />
                <div>
                  <h4 className="text-[11px] font-black text-slate-900">100% Quality</h4>
                  <p className="text-[9px] text-slate-500">Authentic Certified</p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center gap-2">
                <Lock size={18} className="text-[#2563eb] shrink-0" />
                <div>
                  <h4 className="text-[11px] font-black text-slate-900">Secure Pay</h4>
                  <p className="text-[9px] text-slate-500">256-bit Encrypted</p>
                </div>
              </div>
            </div>

            {/* Delivery Pincode Availability Check */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Truck size={15} className="text-[#2563eb]" /> Check Delivery Pincode Availability
              </span>
              <form onSubmit={handlePincodeCheck} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit Pincode (e.g. 226001)"
                  value={pincode}
                  onChange={(e) => {
                    setPincode(e.target.value);
                    setPincodeMsg(null);
                  }}
                  className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-[#2563eb]"
                />
                <button
                  type="submit"
                  disabled={checkingPincode}
                  className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold disabled:opacity-50 cursor-pointer"
                >
                  {checkingPincode ? "Checking..." : "Check"}
                </button>
              </form>

              {pincodeMsg && (
                <div
                  className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                    pincodeMsg.success
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-rose-50 text-rose-600 border border-rose-200"
                  }`}
                >
                  {pincodeMsg.success ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                  <span>{pincodeMsg.text}</span>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Tabbed Info & Business Policies & Reviews Section */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          
          <div className="flex border-b border-slate-200 text-xs font-bold text-slate-500 gap-4 sm:gap-8 overflow-x-auto whitespace-nowrap pb-1">
            <button
              type="button"
              onClick={() => setActiveTab("overview")}
              className={`pb-3 transition-colors cursor-pointer border-b-2 ${
                activeTab === "overview" ? "border-[#2563eb] text-[#2563eb]" : "border-transparent"
              }`}
            >
              Description & Overview
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("policies")}
              className={`pb-3 transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 ${
                activeTab === "policies" ? "border-[#2563eb] text-[#2563eb]" : "border-transparent"
              }`}
            >
              <FileText size={14} />
              <span>Business & Store Policies ({policies.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("specs")}
              className={`pb-3 transition-colors cursor-pointer border-b-2 ${
                activeTab === "specs" ? "border-[#2563eb] text-[#2563eb]" : "border-transparent"
              }`}
            >
              Specifications
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("reviews")}
              className={`pb-3 transition-colors cursor-pointer border-b-2 ${
                activeTab === "reviews" ? "border-[#2563eb] text-[#2563eb]" : "border-transparent"
              }`}
            >
              Customer Reviews ({liveReviews.length})
            </button>
          </div>

          {/* Overview */}
          {activeTab === "overview" && (
            <div className="space-y-4 text-xs text-slate-600 leading-relaxed max-w-3xl">
              <p>{displayProduct.description || "High quality product built to the highest standards."}</p>
            </div>
          )}

          {/* Business & Store Policies Tab */}
          {activeTab === "policies" && (
            <div className="space-y-4 max-w-4xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <ShieldCheck size={18} className="text-[#2563eb]" />
                    Product Business & Store Policies
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Official terms, warranties, and shipping standards applicable to this item.
                  </p>
                </div>
                {displayProduct.business?.businessName && (
                  <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full self-start sm:self-auto">
                    Verified Business: {displayProduct.business.businessName}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {policies.map((pol, pIdx) => (
                  <div
                    key={pol._id || pIdx}
                    className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex flex-col justify-between space-y-2 hover:border-[#2563eb]/40 transition-all"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-blue-100 text-[#2563eb] tracking-wider">
                          {pol.targetScope === "VENDOR" ? "Vendor Store Policy" : "Business Policy"}
                        </span>
                        {pol.version && (
                          <span className="text-[9px] text-slate-400 font-mono">
                            v{pol.version}
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-black text-slate-900 leading-snug">
                        {pol.title}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">
                        {pol.content}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-slate-200/40 flex items-center gap-1.5 text-[10px] text-emerald-600 font-bold">
                      <CheckCircle2 size={12} />
                      <span>Active & Buyer Protected</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Specs & Customer Info */}
          {activeTab === "specs" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs max-w-2xl">
              <div className="flex justify-between p-3 bg-slate-50 rounded-lg border border-slate-200/60">
                <span className="font-semibold text-slate-500">Requires Shipping</span>
                <span className="font-bold text-slate-900">
                  {displayProduct.requiresShipping ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex justify-between p-3 bg-slate-50 rounded-lg border border-slate-200/60">
                <span className="font-semibold text-slate-500">Weight</span>
                <span className="font-bold text-slate-900">
                  {displayProduct.weight ? `${displayProduct.weight} kg` : "N/A"}
                </span>
              </div>
              <div className="flex justify-between p-3 bg-slate-50 rounded-lg border border-slate-200/60">
                <span className="font-semibold text-slate-500">Dimensions (L × W × H)</span>
                <span className="font-bold text-slate-900">
                  {displayProduct.dimensions?.length || 0} × {displayProduct.dimensions?.width || 0} × {displayProduct.dimensions?.height || 0} cm
                </span>
              </div>
              <div className="flex justify-between p-3 bg-slate-50 rounded-lg border border-slate-200/60">
                <span className="font-semibold text-slate-500">Country of Origin</span>
                <span className="font-bold text-slate-900">
                  {displayProduct.countryOfOrigin || "India"}
                </span>
              </div>
              <div className="flex justify-between p-3 bg-slate-50 rounded-lg border border-slate-200/60">
                <span className="font-semibold text-slate-500">Product Type</span>
                <span className="font-bold text-slate-900">
                  {displayProduct.productType || "E-Commerce"}
                </span>
              </div>
              {displayProduct.vendor?.storeName && (
                <div className="flex justify-between p-3 bg-slate-50 rounded-lg border border-slate-200/60">
                  <span className="font-semibold text-slate-500">Seller / Store</span>
                  <span className="font-bold text-slate-900">
                    {displayProduct.vendor.storeName}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Customer Reviews */}
          {activeTab === "reviews" && (
            <div className="space-y-6">
              <div className="space-y-4">
                {liveReviews.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No reviews yet. Be the first to review this product!</p>
                ) : (
                  liveReviews.map((rev, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900">
                          {rev.user?.name || "Verified Buyer"}
                        </span>
                        <div className="flex items-center gap-1 text-amber-400 text-xs font-black">
                          <Star size={12} fill="currentColor" /> {rev.rating || 5}
                        </div>
                      </div>
                      <p className="text-xs text-slate-600">{rev.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </div>

        {/* Recommendations / Related Products Section */}
        <section className="space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200/80 pb-4">
            <div>
              <div className="flex items-center gap-2 text-[#2563eb] text-xs font-black uppercase tracking-widest mb-1">
                <Sparkles size={15} />
                <span>You May Also Like</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Recommended Products
              </h2>
            </div>
            <Link
              to="/shop"
              className="text-xs font-bold text-[#2563eb] hover:underline flex items-center gap-1 self-start sm:self-auto"
            >
              <span>Explore More in Store</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {loadingRelated ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="h-64 rounded-2xl bg-slate-200 animate-pulse" />
              ))}
            </div>
          ) : relatedProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((relProd) => (
                <ProductCard
                  key={relProd._id || relProd.id}
                  product={relProd}
                />
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">No related recommendations found.</p>
          )}
        </section>

      </div>
    </div>
  );
}

export default ProductDetails;
