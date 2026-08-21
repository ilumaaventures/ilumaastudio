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
} from "lucide-react";
import { getProductById, checkCustomerDelivery } from "../../api/productService";
import {
  getProductReviews,
  createReview as createProductReview,
  toggleReviewHelpful,
} from "../../api/reviewService";
import { addToCart } from "../../redux/reducers/cartReducer";
import { toggleWishlist } from "../../redux/reducers/wishlistReducer";
import { DetailSkeleton } from "../../Components/Skeletons";
import { getProductFlashDealStatus } from "../../api/flashDealService";
import toast from "react-hot-toast";

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

  // Variant Selection State
  const [selectedOptions, setSelectedOptions] = useState({});

  // Pincode Delivery Check state
  const [pincode, setPincode] = useState("");
  const [checkingPincode, setCheckingPincode] = useState(false);
  const [pincodeMsg, setPincodeMsg] = useState(null);

  // Review form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewImageUrl, setReviewImageUrl] = useState("");
  const [reviewImageFile, setReviewImageFile] = useState(null);
  const [reviewImagesList, setReviewImagesList] = useState([]);
  const [submittingReview, setSubmittingReview] = useState(false);

  // Live reviews state & helpful tracking
  const [liveReviews, setLiveReviews] = useState([]);
  const [helpfulState, setHelpfulState] = useState({});
  const [lightboxImage, setLightboxImage] = useState(null);

  // Fetch product & reviews
  useEffect(() => {
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
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 text-center">
        <div className="space-y-4 max-w-md">
          <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center mx-auto text-2xl">
            📦
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">Product Not Found</h2>
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
    if (displayProduct.inStock !== undefined) return Boolean(displayProduct.inStock);
    const s =
      activeVariant?.stockQuantity !== undefined
        ? Number(activeVariant.stockQuantity)
        : displayProduct.inventory?.stockQuantity !== undefined
        ? Number(displayProduct.inventory.stockQuantity)
        : displayProduct.stockQuantity !== undefined
        ? Number(displayProduct.stockQuantity)
        : displayProduct.stock !== undefined
        ? Number(displayProduct.stock)
        : 1;
    return s > 0;
  })();

  const imagesList = displayProduct.images || [];

  const handleOptionSelect = (optionName, optionVal) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionName]: optionVal,
    }));
  };

  const handlePincodeCheck = async (e) => {
    e.preventDefault();
    if (pincode.trim().length !== 6) {
      setPincodeMsg({ success: false, text: "Please enter a valid 6-digit Pincode." });
      return;
    }

    try {
      setCheckingPincode(true);
      const res = await checkCustomerDelivery({
        pincode: pincode.trim(),
        businessId: displayProduct.business?._id || displayProduct.business,
        vendorId: displayProduct.vendor?._id || displayProduct.vendor,
        productId: displayProduct._id,
      });

      if (res.available) {
        setPincodeMsg({
          success: true,
          text: res.message || `Delivery available to ${pincode}! Served by ${res.warehouse?.name || "local hub"}.`,
        });
      } else {
        setPincodeMsg({
          success: false,
          text: res.message || "Delivery currently unavailable for this location.",
        });
      }
    } catch (err) {
      console.error(err);
      setPincodeMsg({
        success: false,
        text: "Could not verify pincode availability. Please try again.",
      });
    } finally {
      setCheckingPincode(false);
    }
  };

  const handleAddToCart = () => {
    if (!inStock) {
      toast.error("Sorry, this product is currently out of stock!");
      return false;
    }
    dispatch(
      addToCart({
        product: {
          _id: displayProduct._id,
          name: displayProduct.name,
          price: effectivePrice,
          image: selectedImage || imagesList[0]?.url || "",
          selectedOptions: displayProduct.hasVariants ? selectedOptions : null,
          variantSku: activeVariant?.sku || displayProduct.sku || null,
          variantId: activeVariant?._id || null,
        },
        quantity: qty,
      })
    );
    toast.success(`${displayProduct.name} added to cart!`);
    return true;
  };

  const handleBuyNow = () => {
    if (!inStock) {
      toast.error("Sorry, this product is currently out of stock!");
      return;
    }
    const added = handleAddToCart();
    if (added) {
      navigate("/cart");
    }
  };

  const handleToggleWishlist = () => {
    dispatch(toggleWishlist(displayProduct));
    if (isWished) {
      toast.success("Removed from Wishlist");
    } else {
      toast.success("Added to Wishlist!");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: displayProduct.name, url: window.location.href });
      } catch (_) {}
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Product link copied to clipboard!");
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const tempUrl = URL.createObjectURL(file);
      setReviewImagesList((prev) => [
        ...prev,
        { url: tempUrl, file, public_id: `img_${Date.now()}` },
      ]);
      toast.success("Photo attached!");
    }
  };

  const handleAddReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      toast.error("Please write a review comment");
      return;
    }

    try {
      setSubmittingReview(true);

      const imagesPayload = [...reviewImagesList];
      if (reviewImageUrl.trim()) {
        imagesPayload.push({ url: reviewImageUrl.trim(), public_id: `img_${Date.now()}` });
      }

      let res;
      if (reviewImagesList.some((img) => img.file)) {
        const formData = new FormData();
        formData.append("reviewType", "product");
        formData.append("reviewFor", displayProduct._id || id);
        formData.append("rating", reviewRating);
        formData.append("comment", reviewComment.trim());
        reviewImagesList.forEach((img) => {
          if (img.file) formData.append("images", img.file);
        });
        res = await createProductReview(formData).catch(() => null);
      } else {
        res = await createProductReview({
          reviewType: "product",
          reviewFor: displayProduct._id || id,
          rating: reviewRating,
          comment: reviewComment.trim(),
          images: imagesPayload.map((i) => ({ url: i.url, public_id: i.public_id })),
        }).catch(() => null);
      }

      const newRev = res?.review || {
        _id: res?.review?._id || `rev_${Date.now()}`,
        user: { name: user?.name || "Verified Customer" },
        rating: reviewRating,
        comment: reviewComment.trim(),
        images: imagesPayload,
        helpful: [],
        createdAt: new Date().toISOString(),
      };

      setLiveReviews((prev) => [newRev, ...prev]);
      setReviewComment("");
      setReviewImageUrl("");
      setReviewImagesList([]);
      toast.success("Review posted successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-200 transition-colors pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        
        {/* Breadcrumb Nav */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <Link to="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link to="/shop" className="hover:text-slate-900 dark:hover:text-white transition-colors">Shop</Link>
          <ChevronRight size={12} />
          <span className="text-slate-900 dark:text-white font-bold truncate max-w-xs">{displayProduct.name}</span>
        </nav>

        {/* Top Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Gallery Column */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md">
              <img
                src={selectedImage || imagesList[0]?.url}
                alt={displayProduct.name}
                className="w-full h-full object-cover"
              />
              
              {/* Out of Stock Overlay Badge */}
              {!inStock && (
                <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center">
                  <span className="bg-rose-600 text-white px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg">
                    Out of Stock
                  </span>
                </div>
              )}

              {displayProduct.badge && (
                <span className="absolute top-4 left-4 bg-[#2563eb] text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md">
                  {displayProduct.badge}
                </span>
              )}

              <button
                type="button"
                onClick={handleToggleWishlist}
                className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-transform active:scale-90 cursor-pointer shadow-md ${
                  isWished
                    ? "bg-rose-500 text-white"
                    : "bg-white/90 dark:bg-slate-900/90 text-slate-600 dark:text-slate-300 hover:text-rose-500"
                }`}
              >
                <Heart size={18} fill={isWished ? "currentColor" : "none"} />
              </button>
            </div>

            {/* Thumbnail Row */}
            {imagesList.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {imagesList.map((imgObj, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(imgObj.url)}
                    className={`w-16 h-16 rounded-2xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      selectedImage === imgObj.url
                        ? "border-[#2563eb] scale-105 shadow-md"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={imgObj.url} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Specs & Purchase Action Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#2563eb] bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-full">
                  {displayProduct.brand || displayProduct.category?.name || "Premium Quality"}
                </span>
                {displayProduct.vendor?.storeName && (
                  <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
                    <Building2 size={12} /> {displayProduct.vendor.storeName}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">
                {displayProduct.name}
              </h1>

              {/* Rating & SKU */}
              <div className="flex items-center gap-4 pt-1">
                <div className="flex items-center gap-1 text-amber-400">
                  <Star size={16} fill="currentColor" />
                  <span className="text-xs font-black text-slate-900 dark:text-white">
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
            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-1 shadow-2xs">
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
                  <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full text-[10px] font-black">
                    Save {displayProduct.discount}
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-400">Inclusive of all taxes & delivery resolution</p>
            </div>

            {/* Dynamic Variant Options Selectors */}
            {displayProduct.hasVariants &&
              Array.isArray(displayProduct.optionDefinitions) &&
              displayProduct.optionDefinitions.length > 0 && (
                <div className="space-y-4 p-4 bg-slate-100/60 dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                  {displayProduct.optionDefinitions.map((opt, oIdx) => {
                    const optName = opt.name;
                    const optValues = Array.isArray(opt.values) ? opt.values : [];
                    if (!optName || optValues.length === 0) return null;

                    return (
                      <div key={oIdx} className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex justify-between">
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
                                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-slate-400"
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
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Quantity</label>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 p-1">
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="p-1.5 text-slate-500 hover:text-slate-900 cursor-pointer"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="px-4 text-xs font-bold text-slate-900 dark:text-white">{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty((q) => q + 1)}
                    className="p-1.5 text-slate-500 hover:text-slate-900 cursor-pointer"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <span className={`text-xs font-bold ${inStock ? "text-emerald-600" : "text-rose-500"}`}>
                  {inStock ? "● In Stock" : "● Out of Stock"}
                </span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!inStock}
                className="w-full py-3.5 px-6 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-md"
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

            {/* Delivery Pincode Availability Check */}
            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
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
                  className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none focus:border-[#2563eb]"
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

        {/* Tabbed Info & Reviews Section */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 space-y-6 shadow-xs">
          
          <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 gap-6">
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
              onClick={() => setActiveTab("specs")}
              className={`pb-3 transition-colors cursor-pointer border-b-2 ${
                activeTab === "specs" ? "border-[#2563eb] text-[#2563eb]" : "border-transparent"
              }`}
            >
              Specifications & Origin
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
            <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
              <p>{displayProduct.description || "High quality product built to highest standards."}</p>
            </div>
          )}

          {/* Specs & Customer Info */}
          {activeTab === "specs" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs max-w-2xl">
              <div className="flex justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200/60">
                <span className="font-semibold text-slate-500">Requires Shipping</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {displayProduct.requiresShipping ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200/60">
                <span className="font-semibold text-slate-500">Weight</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {displayProduct.weight ? `${displayProduct.weight} kg` : "N/A"}
                </span>
              </div>
              <div className="flex justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200/60">
                <span className="font-semibold text-slate-500">Dimensions (L × W × H)</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {displayProduct.dimensions?.length || 0} × {displayProduct.dimensions?.width || 0} × {displayProduct.dimensions?.height || 0} cm
                </span>
              </div>
              <div className="flex justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200/60">
                <span className="font-semibold text-slate-500">Country of Origin</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {displayProduct.countryOfOrigin || "India"}
                </span>
              </div>
              <div className="flex justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200/60">
                <span className="font-semibold text-slate-500">Product Type</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {displayProduct.productType || "E-Commerce"}
                </span>
              </div>
              {displayProduct.vendor?.storeName && (
                <div className="flex justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200/60">
                  <span className="font-semibold text-slate-500">Seller / Store</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {displayProduct.vendor.storeName}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Customer Reviews */}
          {activeTab === "reviews" && (
            <div className="space-y-6">
              {/* Reviews List */}
              <div className="space-y-4">
                {liveReviews.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No reviews yet. Be the first to review this product!</p>
                ) : (
                  liveReviews.map((rev, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">
                          {rev.user?.name || "Verified Buyer"}
                        </span>
                        <div className="flex items-center gap-1 text-amber-400 text-xs font-black">
                          <Star size={12} fill="currentColor" /> {rev.rating || 5}
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300">{rev.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default ProductDetails;
