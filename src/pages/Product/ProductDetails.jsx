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
} from "lucide-react";
import { getProductById } from "../../api/productService";
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
  const [selectedColor, setSelectedColor] = useState("");
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState("overview");

  // Pincode state
  const [pincode, setPincode] = useState("");
  const [pincodeMsg, setPincodeMsg] = useState(null);

  // Review form state (Inline form, no modal)
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

  // Fetch product & reviews from API only
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
      displayProduct.inventory?.stockQuantity !== undefined
        ? Number(displayProduct.inventory.stockQuantity)
        : displayProduct.stockQuantity !== undefined
        ? Number(displayProduct.stockQuantity)
        : displayProduct.stock !== undefined
        ? Number(displayProduct.stock)
        : displayProduct.countInStock !== undefined
        ? Number(displayProduct.countInStock)
        : 1;
    return s > 0;
  })();

  const imagesList = displayProduct.images || [];
  const colorsList = displayProduct.colors || [];
  const specsList = displayProduct.specs || [];

  const handlePincodeCheck = (e) => {
    e.preventDefault();
    if (pincode.trim().length === 6) {
      setPincodeMsg({ success: true, text: "Delivery available! Estimated delivery by tomorrow." });
    } else {
      setPincodeMsg({ success: false, text: "Please enter a valid 6-digit Pincode." });
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
          price: displayProduct.price,
          image: selectedImage || imagesList[0]?.url || "",
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

  const handleToggleHelpful = async (rev, e) => {
    e.preventDefault();
    e.stopPropagation();
    const revId = rev._id || rev.id;
    if (!revId) return;

    const isValidMongoId = /^[0-9a-fA-F]{24}$/.test(String(revId));

    try {
      const isHelpful = helpfulState[revId];

      if (isValidMongoId) {
        await toggleReviewHelpful(revId).catch(() => null);
      }

      const currentCount = Array.isArray(rev.helpful) ? rev.helpful.length : Number(rev.helpfulCount || 0);
      const newCount = Math.max(0, currentCount + (isHelpful ? -1 : 1));

      setHelpfulState((prev) => ({ ...prev, [revId]: !isHelpful }));
      setLiveReviews((prev) =>
        prev.map((r) => {
          if ((r._id || r.id) === revId) {
            return { ...r, helpfulCount: newCount, helpful: new Array(newCount).fill("user") };
          }
          return r;
        })
      );

      if (!isHelpful) {
        toast.success("Marked as helpful!");
      } else {
        toast.success("Helpful mark removed");
      }
    } catch (err) {
      console.error(err);
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
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#2563eb] bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-full">
                {displayProduct.brand || displayProduct.category?.name || "Premium Quality"}
              </span>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">
                {displayProduct.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 pt-1">
                <div className="flex items-center gap-1 text-amber-400">
                  <Star size={16} fill="currentColor" />
                  <span className="text-xs font-black text-slate-900 dark:text-white">
                    {displayProduct.rating || 4.5}
                  </span>
                </div>
                <span className="text-xs text-slate-400">({liveReviews.length} reviews)</span>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-1 shadow-2xs">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-[#2563eb]">
                  ₹{(displayProduct.price || 0).toLocaleString()}
                </span>
                {displayProduct.originalPrice && (
                  <span className="text-sm text-slate-400 line-through">
                    ₹{displayProduct.originalPrice.toLocaleString()}
                  </span>
                )}
                {displayProduct.discount && (
                  <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full text-[10px] font-black">
                    Save {displayProduct.discount}
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-400">Inclusive of all taxes & free shipping</p>
            </div>

            {/* Colors */}
            {colorsList.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Color Option</label>
                <div className="flex items-center gap-2">
                  {colorsList.map((col, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedColor(col)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                        selectedColor === col
                          ? "bg-[#2563eb] text-white border-[#2563eb]"
                          : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                      }`}
                    >
                      {col}
                    </button>
                  ))}
                </div>
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

            {/* Delivery Pincode */}
            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Truck size={15} className="text-[#2563eb]" /> Check Delivery Pincode
              </span>
              <form onSubmit={handlePincodeCheck} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit Pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none focus:border-[#2563eb]"
                />
                <button type="submit" className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold">
                  Check
                </button>
              </form>
              {pincodeMsg && (
                <p className={`text-[11px] font-semibold ${pincodeMsg.success ? "text-emerald-600" : "text-rose-500"}`}>
                  {pincodeMsg.text}
                </p>
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
              Description & Details
            </button>
            {specsList.length > 0 && (
              <button
                type="button"
                onClick={() => setActiveTab("specs")}
                className={`pb-3 transition-colors cursor-pointer border-b-2 ${
                  activeTab === "specs" ? "border-[#2563eb] text-[#2563eb]" : "border-transparent"
                }`}
              >
                Specifications
              </button>
            )}
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

          {/* Specs */}
          {activeTab === "specs" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs max-w-2xl">
              {specsList.map((spec, idx) => (
                <div key={idx} className="flex justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200/60">
                  <span className="font-semibold text-slate-500">{spec.label}</span>
                  <span className="font-bold text-slate-900 dark:text-white">{spec.value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Reviews Tab with INLINE Review Form (No Modal) */}
          {activeTab === "reviews" && (
            <div className="space-y-8">
              
              {/* INLINE WRITE A REVIEW FORM CARD */}
              <div className="p-6 bg-slate-50 dark:bg-slate-800/90 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 space-y-4 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-700/80 pb-3">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <Camera size={16} className="text-[#2563eb]" />
                      <span>Write a Customer Review</span>
                    </h3>
                    <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                      Share your rating, experience and attach real photos
                    </p>
                  </div>
                </div>

                <form onSubmit={handleAddReviewSubmit} className="space-y-4 text-xs">
                  
                  {/* Rating Selector */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Your Star Rating</label>
                    <div className="flex items-center gap-1 text-amber-400 cursor-pointer">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={24}
                          fill={star <= reviewRating ? "currentColor" : "none"}
                          onClick={() => setReviewRating(star)}
                          className="hover:scale-110 transition-transform"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Comment Textarea */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Your Feedback</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="What did you like or dislike about this product?"
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs outline-none focus:border-[#2563eb]"
                    />
                  </div>

                  {/* Photo Upload & URL Attachment */}
                  <div className="space-y-2">
                    <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <ImageIcon size={14} className="text-[#2563eb]" />
                      <span>Attach Photos (Upload File or Paste Link)</span>
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Upload File Input */}
                      <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-[#2563eb] rounded-2xl p-3 text-center cursor-pointer transition bg-white dark:bg-slate-900 flex items-center justify-center gap-2">
                        <Upload size={16} className="text-[#2563eb]" />
                        <span className="font-bold text-xs text-slate-700 dark:text-slate-300">Upload Photo File</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                      </div>

                      {/* Paste URL */}
                      <div className="flex items-center gap-2">
                        <input
                          type="url"
                          placeholder="Paste image URL..."
                          value={reviewImageUrl}
                          onChange={(e) => setReviewImageUrl(e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs outline-none focus:border-[#2563eb]"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (reviewImageUrl.trim()) {
                              setReviewImagesList((prev) => [
                                ...prev,
                                { url: reviewImageUrl.trim(), public_id: `img_${Date.now()}` },
                              ]);
                              setReviewImageUrl("");
                              toast.success("Photo attached!");
                            }
                          }}
                          className="bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition cursor-pointer"
                        >
                          Attach
                        </button>
                      </div>
                    </div>

                    {/* Previews */}
                    {reviewImagesList.length > 0 && (
                      <div className="flex items-center gap-2 pt-2 overflow-x-auto">
                        {reviewImagesList.map((img, i) => (
                          <div key={i} className="relative w-14 h-14 rounded-xl overflow-hidden border border-slate-300">
                            <img src={img.url} alt="Preview" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => setReviewImagesList((prev) => prev.filter((_, idx) => idx !== i))}
                              className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px]"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="py-3 px-6 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-2xl font-bold transition-colors cursor-pointer shadow-md shadow-blue-500/20"
                  >
                    {submittingReview ? "Posting Review..." : "Post Review"}
                  </button>
                </form>
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
                  Customer Reviews List ({liveReviews.length})
                </h4>

                {liveReviews.length === 0 ? (
                  <div className="p-8 bg-slate-50 dark:bg-slate-800/40 rounded-2xl text-center">
                    <p className="text-xs text-slate-500 font-medium">
                      No reviews posted yet for this product. Be the first to write a review!
                    </p>
                  </div>
                ) : (
                  liveReviews.map((rev, idx) => {
                    const revId = rev._id || rev.id || `rev_${idx}`;
                    const userName = typeof rev.user === "object" ? rev.user?.name : rev.user || "Verified Customer";
                    const isHelpfulActive = Boolean(helpfulState[revId]);
                    const countHelpful = Array.isArray(rev.helpful)
                      ? rev.helpful.length
                      : Number(rev.helpfulCount || 0);

                    const revImages = Array.isArray(rev.images) ? rev.images : [];

                    return (
                      <div
                        key={revId}
                        className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 space-y-3 shadow-2xs"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950/60 text-[#2563eb] font-black text-xs flex items-center justify-center">
                              {userName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <span className="font-bold text-xs text-slate-900 dark:text-white block">
                                {userName}
                              </span>
                              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                                Verified Purchase
                              </span>
                            </div>
                          </div>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : rev.date || "Recently"}
                          </span>
                        </div>

                        {/* Stars */}
                        <div className="flex items-center gap-1 text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={12}
                              fill={i < rev.rating ? "currentColor" : "none"}
                            />
                          ))}
                        </div>

                        {/* Comment */}
                        <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-normal">
                          {rev.comment}
                        </p>

                        {/* Review Attached Images Gallery */}
                        {revImages.length > 0 && (
                          <div className="flex items-center gap-2 pt-1 overflow-x-auto">
                            {revImages.map((imgObj, iIdx) => {
                              const imgUrl = typeof imgObj === "object" ? imgObj.url : imgObj;
                              return (
                                <button
                                  key={iIdx}
                                  type="button"
                                  onClick={() => setLightboxImage(imgUrl)}
                                  className="w-16 h-16 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-700 border border-slate-300 shrink-0 group relative cursor-pointer"
                                >
                                  <img
                                    src={imgUrl}
                                    alt="Review attach"
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                  />
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {/* Helpful Counter Button */}
                        <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                          <button
                            type="button"
                            onClick={(e) => handleToggleHelpful(rev, e)}
                            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition cursor-pointer border ${
                              isHelpfulActive
                                ? "bg-blue-50 dark:bg-blue-950/60 border-[#2563eb] text-[#2563eb]"
                                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                            }`}
                          >
                            <ThumbsUp
                              size={13}
                              className={isHelpfulActive ? "fill-[#2563eb]" : ""}
                            />
                            <span>Helpful ({countHelpful})</span>
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Review Image Lightbox Modal */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-2xl max-h-[85vh] overflow-hidden rounded-2xl bg-black p-2 shadow-2xl">
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black"
            >
              <X size={18} />
            </button>
            <img src={lightboxImage} alt="Enlarged review photo" className="max-w-full max-h-[80vh] object-contain rounded-xl" />
          </div>
        </div>
      )}

    </div>
  );
}

export default ProductDetails;
