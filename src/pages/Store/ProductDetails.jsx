import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Heart,
  Star,
  Truck,
  ShieldCheck,
  RotateCcw,
  ArrowLeft,
  Coins,
  CheckCircle2,
  Package,
  Store,
  Tag,
  Clock,
  Share2,
  Check,
  Sparkles,
  Info,
  Building,
  ChevronRight,
  MessageSquare,
} from "lucide-react";
import baseApi from "../../api/baseApi";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/reducers/cartReducer";
import { toggleWishlist } from "../../redux/reducers/wishlistReducer";
import toast from "react-hot-toast";
import { useStore } from "./StoreContext";

export default function ProductDetails() {
  const { businessName, id } = useParams();
  const { storeHomePath, template, theme: layoutTheme } = useStore();
  const basePath = storeHomePath || `/${encodeURIComponent(businessName || "")}`;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const wishlistItems = useSelector((s) => s.wishlist?.items || []);

  const theme = template?.selectedTheme || layoutTheme || {
    colors: {
      primary: "#4F46E5",
      secondary: "#818CF8",
      background: "#F8FAFC",
      cardBg: "#FFFFFF",
      textColor: "#0F172A",
    },
  };

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [activeTab, setActiveTab] = useState("description"); // "description" | "specs" | "shipping" | "vendor"

  // Variant selector states
  const [selectedOptions, setSelectedOptions] = useState({});

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await baseApi.get(
          `/public/store/${encodeURIComponent(businessName)}/product/${id}`
        );
        const prodData = response.data?.product || response.data?.data || response.data;
        setProduct(prodData);
        setSelectedImageIdx(0);

        // Initialize variant options
        if (
          prodData?.hasVariants &&
          prodData?.optionDefinitions?.length
        ) {
          const initial = {};
          prodData.optionDefinitions.forEach((opt) => {
            if (opt.values?.length) {
              initial[opt.name] = opt.values[0];
            }
          });
          setSelectedOptions(initial);
        }
      } catch (err) {
        console.error("Error loading product details:", err);
        setError(
          err.response?.data?.message || "Failed to load product details"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id && businessName) {
      fetchProductDetails();
    }
  }, [id, businessName]);

  // Selected variant match
  const selectedVariant = useMemo(() => {
    if (!product?.hasVariants || !product?.variants?.length) return null;
    return (
      product.variants.find((v) => {
        if (!v.optionValues) return false;
        return Object.entries(selectedOptions).every(
          ([optName, optVal]) => v.optionValues[optName] === optVal
        );
      }) || null
    );
  }, [product, selectedOptions]);

  const currentPrice = selectedVariant
    ? selectedVariant.price !== undefined && selectedVariant.price !== null
      ? Number(selectedVariant.price)
      : Number(product?.price || 0)
    : Number(product?.price || 0);

  const currentCompareAt = selectedVariant
    ? selectedVariant.compareAtPrice !== undefined && selectedVariant.compareAtPrice !== null
      ? Number(selectedVariant.compareAtPrice)
      : product?.compareAtPrice
        ? Number(product.compareAtPrice)
        : null
    : product?.compareAtPrice
      ? Number(product.compareAtPrice)
      : null;

  const discountPercent =
    currentCompareAt && currentCompareAt > currentPrice
      ? Math.round(((currentCompareAt - currentPrice) / currentCompareAt) * 100)
      : 0;

  const currentSku = selectedVariant?.sku || product?.sku || "SKU-N/A";

  const currentStock = useMemo(() => {
    if (!product) return 0;
    if (selectedVariant) {
      return selectedVariant.stockQuantity !== undefined
        ? Number(selectedVariant.stockQuantity)
        : 0;
    }
    return product.stock !== undefined
      ? Number(product.stock)
      : product.stockQuantity !== undefined
        ? Number(product.stockQuantity)
        : product.inventory?.stockQuantity !== undefined
          ? Number(product.inventory.stockQuantity)
          : 15;
  }, [product, selectedVariant]);

  const isOutOfStock = currentStock <= 0;

  const isWishlisted = useMemo(() => {
    if (!product) return false;
    return wishlistItems.some((item) => item._id === product._id || item.id === product._id);
  }, [wishlistItems, product]);

  const handleAddToCart = () => {
    if (isOutOfStock) {
      toast.error("Sorry, this item is currently out of stock!");
      return;
    }

    dispatch(
      addToCart({
        product: {
          _id: product._id,
          name: product.name,
          price: currentPrice,
          compareAtPrice: currentCompareAt,
          images: product.images,
          featuredImage: product.featuredImage || product.images?.[0],
          selectedOptions: selectedVariant ? selectedVariant.optionValues : null,
          variantSku: currentSku,
          variantId: selectedVariant ? selectedVariant._id : null,
          vendor: product.vendor || product.business,
        },
        quantity,
      })
    );
    toast.success(`${product.name} (${quantity}) added to your cart!`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/cart");
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    dispatch(toggleWishlist(product));
    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist!");
  };

  // Compile full image list
  const allImages = useMemo(() => {
    if (!product) return [];
    const imgs = [];
    if (selectedVariant?.image) imgs.push(selectedVariant.image);
    if (product.featuredImage?.url) imgs.push(product.featuredImage.url);
    if (product.featuredImage && typeof product.featuredImage === "string") imgs.push(product.featuredImage);
    if (Array.isArray(product.images)) {
      product.images.forEach((i) => {
        if (typeof i === "string") imgs.push(i);
        else if (i?.url) imgs.push(i.url);
      });
    }
    const unique = Array.from(new Set(imgs)).filter(Boolean);
    return unique.length > 0
      ? unique
      : ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop"];
  }, [product, selectedVariant]);

  const primaryColor = theme?.colors?.primary || "#4F46E5";

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-black text-slate-500 uppercase tracking-widest">
            Loading Product Details...
          </span>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 flex items-center justify-center">
        <div className="max-w-md bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-4 shadow-sm">
          <Info size={40} className="mx-auto text-rose-500" />
          <h2 className="text-xl font-black text-slate-900">Product Not Found</h2>
          <p className="text-xs text-slate-500 font-medium">{error || "The requested item is unavailable."}</p>
          <Link
            to={`${basePath}/products`}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-extrabold text-xs shadow-md"
          >
            <ArrowLeft size={14} />
            <span>Return to Shop</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full min-h-screen py-8 px-4 sm:px-6 lg:px-8 text-left"
      style={{
        backgroundColor: theme.colors?.background || "#F8FAFC",
        color: theme.colors?.textColor || "#0F172A",
        fontFamily: template?.selectedFont?.fontFamily || "inherit",
      }}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link to={basePath} className="hover:text-indigo-600">Home</Link>
          <ChevronRight size={12} />
          <Link to={`${basePath}/products`} className="hover:text-indigo-600">Products</Link>
          <ChevronRight size={12} />
          <span className="text-slate-900 font-bold truncate max-w-[200px]">{product.name}</span>
        </div>

        {/* Top Overview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-white border border-slate-200/90 shadow-sm">
              <img
                src={allImages[selectedImageIdx] || allImages[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />

              {/* Floating Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 items-start">
                {isOutOfStock ? (
                  <span className="bg-rose-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-md tracking-wider">
                    Out of Stock
                  </span>
                ) : (
                  discountPercent > 0 && (
                    <span
                      className="text-white text-[10px] font-black px-3 py-1 rounded-full shadow-md"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {discountPercent}% OFF
                    </span>
                  )
                )}

                {product.isFeatured && (
                  <span className="bg-amber-500 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-xs">
                    ★ Featured Item
                  </span>
                )}
              </div>

              {/* Wishlist Button */}
              <button
                onClick={handleToggleWishlist}
                className={`absolute top-4 right-4 p-3 rounded-2xl shadow-md transition-all cursor-pointer ${
                  isWishlisted ? "bg-rose-50 text-rose-600 border border-rose-200" : "bg-white/90 backdrop-blur-xs text-slate-700 hover:text-rose-600"
                }`}
                title="Wishlist"
              >
                <Heart size={18} className={isWishlisted ? "fill-rose-600" : ""} />
              </button>
            </div>

            {/* Thumbnail Selector Strip */}
            {allImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIdx(idx)}
                    className={`w-16 h-16 rounded-2xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      selectedImageIdx === idx
                        ? "border-indigo-600 ring-2 ring-indigo-200"
                        : "border-slate-200/80 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Specifications & Purchasing Panel */}
          <div className="lg:col-span-6 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
            
            {/* Category & Title */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  {product.category?.name || "General Collection"}
                </span>

                {product.brand && (
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                    Brand: {product.brand}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                {product.name}
              </h1>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-3 pt-1">
                <div className="flex items-center gap-1 bg-amber-50 text-amber-800 px-2.5 py-0.5 rounded-full border border-amber-200 text-xs font-bold">
                  <Star size={13} className="text-amber-500 fill-amber-500" />
                  <span>{product.rating || "4.9"}</span>
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  ({product.numReviews || 12} customer reviews)
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs font-mono font-bold text-slate-400">SKU: {currentSku}</span>
              </div>
            </div>

            {/* Pricing Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-slate-900 tracking-tight">
                  ₹{currentPrice.toLocaleString("en-IN")}
                </span>
                {currentCompareAt && currentCompareAt > currentPrice && (
                  <span className="text-base text-slate-400 font-medium line-through">
                    ₹{currentCompareAt.toLocaleString("en-IN")}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between text-xs font-medium text-slate-500 pt-1">
                <span>Inclusive of all applicable taxes</span>
                {product.coinReward > 0 && (
                  <span className="inline-flex items-center gap-1 font-black text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                    <Coins size={12} className="text-amber-500" /> +{product.coinReward} ILumaa Coins
                  </span>
                )}
              </div>
            </div>

            {/* Stock Availability Pill */}
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-slate-700">Stock Availability:</span>
              <span
                className={`font-black px-3 py-1 rounded-full text-xs ${
                  isOutOfStock
                    ? "bg-rose-50 text-rose-600 border border-rose-200"
                    : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                }`}
              >
                {isOutOfStock ? "Out of Stock" : `In Stock (${currentStock} available)`}
              </span>
            </div>

            {/* Variant Option Selectors (if product has variants) */}
            {product.hasVariants && product.optionDefinitions?.length > 0 && (
              <div className="space-y-4 pt-2 border-t border-slate-100">
                {product.optionDefinitions.map((opt) => (
                  <div key={opt.name} className="space-y-1.5">
                    <label className="block text-xs font-black uppercase text-slate-700 tracking-wider">
                      Select {opt.name}:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {opt.values?.map((val) => {
                        const isSelected = selectedOptions[opt.name] === val;
                        return (
                          <button
                            key={val}
                            onClick={() =>
                              setSelectedOptions({ ...selectedOptions, [opt.name]: val })
                            }
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                              isSelected
                                ? "bg-indigo-600 text-white border-indigo-600 shadow-2xs"
                                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                            }`}
                          >
                            {val}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity Selector & Action Buttons */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-4">
                <label className="text-xs font-black uppercase text-slate-700 tracking-wider">Quantity:</label>
                <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl">
                  <button
                    disabled={quantity <= 1}
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-1.5 text-xs font-black text-slate-700 disabled:opacity-30 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-3 py-1.5 text-xs font-black text-slate-900">{quantity}</span>
                  <button
                    disabled={quantity >= currentStock}
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-3 py-1.5 text-xs font-black text-slate-700 disabled:opacity-30 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3.5 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  <ShoppingCart size={16} />
                  <span>Add to Cart</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className="w-full text-white py-3.5 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50 cursor-pointer"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Sparkles size={16} />
                  <span>Buy Now</span>
                </button>
              </div>
            </div>

            {/* Trust Guarantee Badges */}
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100 text-center">
              <div className="p-2 space-y-1">
                <Truck size={18} className="mx-auto text-indigo-600" />
                <span className="text-[10px] font-extrabold text-slate-700 block">Fast Shipping</span>
              </div>
              <div className="p-2 space-y-1">
                <ShieldCheck size={18} className="mx-auto text-emerald-600" />
                <span className="text-[10px] font-extrabold text-slate-700 block">100% Authentic</span>
              </div>
              <div className="p-2 space-y-1">
                <RotateCcw size={18} className="mx-auto text-amber-600" />
                <span className="text-[10px] font-extrabold text-slate-700 block">Easy Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Product Information Tabs */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          
          {/* Tab Navigation */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
            {[
              { id: "description", label: "Product Description", icon: Package },
              { id: "specs", label: "Specifications & Details", icon: Tag },
              { id: "shipping", label: "Shipping & Delivery", icon: Truck },
              { id: "vendor", label: "Store Info", icon: Store },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer shrink-0 ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-2xs"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <Icon size={15} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content Panels */}
          <div className="pt-2">
            {activeTab === "description" && (
              <div className="space-y-4 text-slate-700 leading-relaxed text-sm">
                <h3 className="text-base font-black text-slate-900">About this item</h3>
                <p className="whitespace-pre-line font-medium text-slate-600 text-xs sm:text-sm">
                  {product.description || "High quality product crafted with premium materials and genuine quality assurance."}
                </p>
              </div>
            )}

            {activeTab === "specs" && (
              <div className="space-y-4">
                <h3 className="text-base font-black text-slate-900">Product Specifications</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl flex justify-between border border-slate-100">
                    <span className="font-extrabold text-slate-500">Product Name</span>
                    <span className="font-bold text-slate-900">{product.name}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl flex justify-between border border-slate-100">
                    <span className="font-extrabold text-slate-500">SKU Code</span>
                    <span className="font-mono font-bold text-slate-900">{currentSku}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl flex justify-between border border-slate-100">
                    <span className="font-extrabold text-slate-500">Category</span>
                    <span className="font-bold text-slate-900">{product.category?.name || "General"}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl flex justify-between border border-slate-100">
                    <span className="font-extrabold text-slate-500">Brand</span>
                    <span className="font-bold text-slate-900">{product.brand || "ILumaa Partner"}</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "shipping" && (
              <div className="space-y-3 text-xs text-slate-600 font-medium">
                <h3 className="text-base font-black text-slate-900">Delivery & Dispatch Information</h3>
                <p>• Standard delivery within 3-5 business days across major cities.</p>
                <p>• Expedited shipping options available at checkout.</p>
                <p>• All packages are trackable in real-time using order reference ID.</p>
              </div>
            )}

            {activeTab === "vendor" && (
              <div className="space-y-3 text-xs text-slate-600 font-medium">
                <h3 className="text-base font-black text-slate-900">Storefront Seller Info</h3>
                <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                  <Store size={24} className="text-indigo-600" />
                  <div>
                    <h4 className="font-black text-slate-900 text-sm">
                      {product.vendor?.storeName || product.business?.businessName || businessName}
                    </h4>
                    <p className="text-[11px] text-slate-500">Verified Seller Partner on ILumaa Studio Network</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
