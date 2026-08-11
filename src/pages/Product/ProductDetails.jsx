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
} from "lucide-react";
import { getProductById, getallProducts } from "../../api/productService";
import {
  getProductReviews,
  createReview as createProductReview,
} from "../../api/reviewService";
import { addToCart } from "../../redux/reducers/cartReducer";
import { toggleWishlist } from "../../redux/reducers/wishlistReducer";
import toast from "react-hot-toast";

// Fallback demo product if API response is empty/loading
const DEMO_PRODUCT = {
  _id: "demo_p1",
  name: "Sony WH-1000XM5 Wireless Noise Canceling Headphones",
  brand: "Sony",
  category: { name: "Electronics" },
  price: 24990,
  originalPrice: 29490,
  discount: "15%",
  rating: 4.6,
  numReviews: 124,
  description:
    "The WH-1000XM5 headphones rewrite the rules for distraction-free listening. Two processors control 8 microphones for unprecedented noise canceling and exceptional call quality.",
  inStock: true,
  images: [
    { url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop" },
    { url: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=600&auto=format&fit=crop" },
    { url: "https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=600&auto=format&fit=crop" },
  ],
  colors: ["Black", "Silver", "Midnight Blue"],
  specs: [
    { label: "Battery Life", value: "Up to 30 hours" },
    { label: "Noise Canceling", value: "Industry Leading Dual Processor" },
    { label: "Connectivity", value: "Bluetooth 5.2" },
    { label: "Weight", value: "250g" },
  ],
  reviews: [
    { id: "r1", user: "Aditya S.", rating: 5, date: "2 days ago", comment: "Outstanding sound quality and active noise cancellation. Very comfortable for long work hours!" },
    { id: "r2", user: "Priya M.", rating: 4, date: "1 week ago", comment: "Great battery life and clear microphone for calls. Highly recommended." },
  ],
};

import { DetailSkeleton } from "../../Components/Skeletons";

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

  // Review modal state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  // Fetch product
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const res = await getProductById(id);
        const pData = res?.product || res?.data || res;
        setProduct(pData || DEMO_PRODUCT);
        if (pData?.images?.length > 0) {
          setSelectedImage(pData.images[0].url);
        } else {
          setSelectedImage(DEMO_PRODUCT.images[0].url);
        }
      } catch (err) {
        console.error("Error fetching product details:", err);
        setProduct(DEMO_PRODUCT);
        setSelectedImage(DEMO_PRODUCT.images[0].url);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const displayProduct = product || DEMO_PRODUCT;
  const isWished = wishlistItems.some((i) => i._id === displayProduct._id);

  const imagesList = displayProduct.images?.length > 0 ? displayProduct.images : DEMO_PRODUCT.images;
  const colorsList = displayProduct.colors || DEMO_PRODUCT.colors;
  const specsList = displayProduct.specs || DEMO_PRODUCT.specs;
  const reviewsList = displayProduct.reviews || DEMO_PRODUCT.reviews;

  const handlePincodeCheck = (e) => {
    e.preventDefault();
    if (pincode.trim().length === 6) {
      setPincodeMsg({ success: true, text: "Delivery available! Estimated delivery by tomorrow." });
    } else {
      setPincodeMsg({ success: false, text: "Please enter a valid 6-digit Pincode." });
    }
  };

  const handleAddToCart = () => {
    dispatch(addToCart({ product: { _id: displayProduct._id, name: displayProduct.name, price: displayProduct.price, image: selectedImage }, quantity: qty }));
    toast.success(`${displayProduct.name} added to cart!`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/cart");
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

  const handleAddReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    setSubmittingReview(true);
    setTimeout(() => {
      const newRev = { id: `rev_${Date.now()}`, user: user?.name || "Verified Customer", rating: reviewRating, date: "Just now", comment: reviewComment };
      setProduct((prev) => ({
        ...prev,
        reviews: [newRev, ...(prev?.reviews || [])],
      }));
      setSubmittingReview(false);
      setShowReviewModal(false);
      setReviewComment("");
      toast.success("Review submitted successfully!");
    }, 600);
  };

  if (loading) return <DetailSkeleton />;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-200 transition-colors pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        
        {/* Breadcrumb Nav */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <Link to="/" className="hover:text-[#2563eb] transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link to="/products" className="hover:text-[#2563eb] transition-colors">Products</Link>
          <ChevronRight size={12} />
          <span className="text-slate-900 dark:text-white font-bold truncate max-w-xs">{displayProduct.name}</span>
        </div>

        {/* Top Product Detail Section (2 Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 lg:p-8 shadow-sm">
          
          {/* Left Column: Gallery (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Main Preview Box */}
            <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 p-4 flex items-center justify-center">
              {displayProduct.discount && (
                <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-black px-2.5 py-1 rounded shadow-sm z-10">
                  -{displayProduct.discount} OFF
                </span>
              )}
              <img
                src={selectedImage || imagesList[0]?.url}
                alt={displayProduct.name}
                className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Thumbnail Row */}
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {imagesList.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img.url)}
                  className={`w-16 h-16 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-800 border-2 transition-all shrink-0 cursor-pointer ${
                    selectedImage === img.url ? "border-[#2563eb] shadow-sm" : "border-slate-200 dark:border-slate-700 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={img.url} alt="Thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Product Specs & Actions (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Title & Brand */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-block px-2.5 py-0.5 bg-blue-50 dark:bg-slate-800 text-[#2563eb] font-bold text-xs rounded">
                  {displayProduct.brand || "ILumaaStudio"}
                </span>

                {displayProduct.isFeatured && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-bold text-xs rounded-full">
                    <Star size={12} className="fill-amber-500 text-amber-500" />
                    Featured Product
                  </span>
                )}

                {displayProduct.isOccasion && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 font-bold text-xs rounded-full">
                    <Sparkles size={12} className="text-purple-500" />
                    Special Occasion
                  </span>
                )}

                {displayProduct.isFlashSale && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 font-bold text-xs rounded-full animate-pulse">
                    ⚡ Flash Sale Item
                  </span>
                )}
              </div>

              <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white leading-tight">
                {displayProduct.name}
              </h1>

              {/* Rating & Social Proof */}
              <div className="flex items-center gap-3 text-xs pt-1">
                <div className="flex items-center gap-1 bg-amber-50 dark:bg-slate-800 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded font-bold">
                  <span>{displayProduct.rating || 4.5}</span>
                  <Star size={12} fill="currentColor" />
                </div>
                <span className="text-slate-500 dark:text-slate-400 font-medium">
                  ({displayProduct.reviews?.length || displayProduct.numReviews || 124} reviews)
                </span>
                <span className="text-slate-300 dark:text-slate-700">|</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  In Stock & Ready to Ship
                </span>
              </div>
            </div>

            {/* Price Box */}
            <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 p-4 rounded-xl flex items-baseline gap-3">
              <span className="text-3xl font-black text-slate-900 dark:text-white">
                ₹{displayProduct.price?.toLocaleString()}
              </span>
              {displayProduct.originalPrice && (
                <span className="text-base text-slate-400 line-through font-semibold">
                  ₹{displayProduct.originalPrice?.toLocaleString()}
                </span>
              )}
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                Inclusive of all taxes
              </span>
            </div>

            {/* Color Selector */}
            {colorsList?.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Select Color: <span className="text-[#2563eb]">{selectedColor || colorsList[0]}</span>
                </label>
                <div className="flex items-center gap-2">
                  {colorsList.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        (selectedColor || colorsList[0]) === c
                          ? "border-[#2563eb] bg-blue-50 dark:bg-slate-800 text-[#2563eb] font-bold"
                          : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector & Actions */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-slate-300 dark:border-slate-700 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="p-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="px-4 text-sm font-bold text-slate-900 dark:text-white">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    className="p-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <button
                  onClick={handleToggleWishlist}
                  className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                    isWished
                      ? "border-red-500 bg-red-50 dark:bg-red-950/30 text-red-500"
                      : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50"
                  }`}
                  title="Wishlist"
                >
                  <Heart size={18} className={isWished ? "fill-red-500" : ""} />
                </button>

                <button
                  onClick={handleShare}
                  className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-colors cursor-pointer"
                  title="Share"
                >
                  <Share2 size={18} />
                </button>
              </div>

              {/* Main Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  className="w-full py-3.5 border-2 border-[#2563eb] text-[#2563eb] hover:bg-[#2563eb] hover:text-white dark:hover:bg-[#2563eb] dark:hover:text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                >
                  <ShoppingCart size={18} />
                  <span>Add to Cart</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  className="w-full py-3.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-blue-500/20"
                >
                  <span>Buy Now</span>
                </button>
              </div>
            </div>

            {/* Pincode Estimator */}
            <form onSubmit={handlePincodeCheck} className="border-t border-slate-200/80 dark:border-slate-800 pt-4 space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <MapPin size={14} className="text-[#2563eb]" />
                <span>Delivery Estimator</span>
              </label>
              <div className="flex items-center gap-2 max-w-sm">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit Pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs outline-none focus:border-[#2563eb]"
                />
                <button
                  type="submit"
                  className="bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-xs font-bold shrink-0 transition-colors"
                >
                  Check
                </button>
              </div>
              {pincodeMsg && (
                <p className={`text-xs font-semibold ${pincodeMsg.success ? "text-emerald-600" : "text-red-500"}`}>
                  {pincodeMsg.text}
                </p>
              )}
            </form>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-200/80 dark:border-slate-800 text-[11px]">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <Truck size={16} className="text-[#2563eb] shrink-0" />
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <RotateCcw size={16} className="text-[#2563eb] shrink-0" />
                <span>14 Days Return</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <ShieldCheck size={16} className="text-[#2563eb] shrink-0" />
                <span>1 Year Warranty</span>
              </div>
            </div>

          </div>

        </div>

        {/* Tabbed Section (Overview, Specifications, Reviews) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 lg:p-8 shadow-sm space-y-6">
          
          {/* Tabs Nav */}
          <div className="flex items-center gap-6 border-b border-slate-200 dark:border-slate-800 text-xs font-bold">
            {[
              { id: "overview", label: "Overview" },
              { id: "specs", label: "Specifications" },
              { id: "reviews", label: `Reviews (${reviewsList.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 transition-colors cursor-pointer border-b-2 ${
                  activeTab === tab.id
                    ? "border-[#2563eb] text-[#2563eb]"
                    : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "overview" && (
            <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
              <p>{displayProduct.description}</p>
              <ul className="space-y-2 pt-2">
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-[#2563eb]" />
                  <span>Dual processor active noise cancelling for ambient sound isolation</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-[#2563eb]" />
                  <span>Ultra-comfortable lightweight ergonomic headband cushion</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-[#2563eb]" />
                  <span>Crystal clear hands-free calling with beamforming microphones</span>
                </li>
              </ul>
            </div>
          )}

          {activeTab === "specs" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs max-w-2xl">
              {specsList.map((spec, idx) => (
                <div key={idx} className="flex justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
                  <span className="font-semibold text-slate-500 dark:text-slate-400">{spec.label}</span>
                  <span className="font-bold text-slate-900 dark:text-white">{spec.value}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  Customer Reviews
                </h3>
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  Write a Review
                </button>
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                {reviewsList.map((rev) => (
                  <div key={rev.id} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200/60 dark:border-slate-700/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900 dark:text-white">{rev.user}</span>
                      <span className="text-[10px] text-slate-400">{rev.date}</span>
                    </div>
                    <div className="flex items-center text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={11} fill={i < rev.rating ? "currentColor" : "none"} />
                      ))}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">{rev.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Write Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900 dark:text-white">Write a Review</h3>
              <button onClick={() => setShowReviewModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddReviewSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Rating</label>
                <div className="flex items-center gap-1 text-amber-400 cursor-pointer">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={20}
                      fill={star <= reviewRating ? "currentColor" : "none"}
                      onClick={() => setReviewRating(star)}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Your Feedback</label>
                <textarea
                  required
                  rows={4}
                  placeholder="What did you like or dislike about this product?"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs outline-none focus:border-[#2563eb]"
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="w-full py-3 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-xl font-bold transition-colors cursor-pointer"
              >
                {submittingReview ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default ProductDetails;
