import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Star,
  Plus,
  Minus,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  Share2,
  AlertCircle,
  Clock,
  Sparkles,
  Package,
  Heart,
  ChevronDown,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/reducers/cartReducer";
import toast from "react-hot-toast";
import { getProductImage, getAllProductImages } from "../../utils/productImage";
import { isOutOfStock, getProductStock, getStockStatus } from "../../utils/stockUtils";
import baseApi from "../../api/baseApi";

export default function ProductDetailsPage({
  product = {},
  onBack,
  onAddToCart,
  themeColors = {},
  business = {},
  relatedProducts = [],
  onSelectProduct,
}) {
  const dispatch = useDispatch();

  const allImages = getAllProductImages(product);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description"); // "description" | "specs" | "shipping" | "policies"
  const [added, setAdded] = useState(false);
  const [policies, setPolicies] = useState(business?.policies || []);

  // Variant selector
  const variants = Array.isArray(product.variants) && product.variants.length > 0
    ? product.variants
    : Array.isArray(product.sizes) && product.sizes.length > 0
    ? product.sizes.map((s, idx) => (typeof s === "string" ? { _id: `sz-${idx}`, name: s, label: s } : s))
    : [];

  const [selectedVariant, setSelectedVariant] = useState(variants[0] || null);

  useEffect(() => {
    setSelectedImageIdx(0);
    setQuantity(1);
    setSelectedVariant(variants[0] || null);
  }, [product]);

  // Load business policies if available
  useEffect(() => {
    if (business?.policies?.length > 0) {
      setPolicies(business.policies);
      return;
    }
    const bizId = business?._id || product?.business || product?.businessId;
    const bizSlug = business?.subdomain || business?.slug || business?.businessName;

    let isMounted = true;
    async function loadPolicies() {
      try {
        let res;
        if (bizId) {
          res = await baseApi.get("/business-policies/public", { params: { businessId: bizId } });
        } else if (bizSlug) {
          res = await baseApi.get("/business-policies/public", { params: { subdomain: bizSlug } });
        }
        const policyList = Array.isArray(res?.data?.policies)
          ? res.data.policies
          : Array.isArray(res?.data)
          ? res.data
          : [];
        if (isMounted && policyList.length > 0) {
          setPolicies(policyList);
        }
      } catch (_) {}
    }
    loadPolicies();
    return () => {
      isMounted = false;
    };
  }, [business, product]);

  const primaryColor = themeColors.primary || "#4F46E5";

  // Stock inventory calculation
  const stock = getProductStock(product);
  const outOfStock = isOutOfStock(product);
  const stockStatus = getStockStatus(product);

  const activeImage =
    allImages[selectedImageIdx] ||
    getProductImage(product, "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800");

  const effectivePrice =
    selectedVariant &&
    selectedVariant.price !== undefined &&
    selectedVariant.price !== null &&
    !isNaN(Number(selectedVariant.price))
      ? Number(selectedVariant.price)
      : Number(product.price || 0);

  const handleAdd = () => {
    if (outOfStock) {
      toast.error(`Sorry, ${product.name || "this item"} is out of stock!`);
      return;
    }

    const payload = {
      product: {
        ...product,
        price: effectivePrice,
        selectedVariant: selectedVariant?.name || selectedVariant?.label || selectedVariant || null,
        variantId: selectedVariant?._id || null,
        variantSku: selectedVariant?.sku || product.sku,
        image: activeImage,
      },
      quantity,
    };

    // 1. Dispatch to Redux Store
    dispatch(addToCart(payload));
    toast.success(`${product.name || "Product"} added to cart!`);

    // 2. Notify template parent (opens drawer or updates template state)
    if (onAddToCart) {
      onAddToCart(payload.product, quantity);
    }

    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > effectivePrice
      ? Math.round(((product.compareAtPrice - effectivePrice) / product.compareAtPrice) * 100)
      : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 font-sans">
      {/* Back Navigation Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-slate-950 bg-white border border-slate-200 hover:border-slate-300 px-4 py-2.5 rounded-xl transition shadow-2xs hover:bg-slate-50 cursor-pointer"
        >
          <ArrowLeft size={15} />
          <span>Back to Catalog</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
          <span>{business?.businessName || business?.name || "Store"}</span>
          <span>/</span>
          <span className="text-slate-800 font-bold truncate max-w-[200px]">
            {product.name || product.title}
          </span>
        </div>
      </div>

      {/* Main Product Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
        {/* Left: StarlingTales Interactive Multi-Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square sm:aspect-[4/5] rounded-3xl overflow-hidden bg-slate-50 border border-slate-200/90 shadow-md flex items-center justify-center p-2">
            <img
              src={activeImage}
              alt={product.name || "Product preview"}
              className="w-full h-full object-contain object-center transition-transform duration-500 hover:scale-105"
            />

            {/* Discount Ribbon */}
            {discountPercent && (
              <span className="absolute top-4 left-4 rounded-xl px-3 py-1.5 bg-rose-600 text-white text-[11px] font-black uppercase tracking-wider shadow-md">
                {discountPercent}% OFF
              </span>
            )}

            {/* Stock status pill overlay */}
            <span
              className={`absolute top-4 right-4 text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-xl border shadow-xs backdrop-blur-md ${stockStatus.badgeClass}`}
            >
              {stockStatus.label}
            </span>
          </div>

          {/* Clickable Thumbnail Carousel */}
          {allImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
              {allImages.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIdx(idx)}
                  className={`w-18 h-18 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 p-1 bg-white transition shrink-0 cursor-pointer ${
                    selectedImageIdx === idx
                      ? "border-indigo-600 ring-2 ring-indigo-100 shadow-sm"
                      : "border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Details, Inventory & Actions */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full text-white shadow-2xs"
                style={{ backgroundColor: primaryColor }}
              >
                {typeof product.category === "object" ? product.category?.name : product.category || "Collection"}
              </span>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${stockStatus.badgeClass}`}
              >
                {stockStatus.label}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-snug">
              {product.name || product.title}
            </h1>

            {/* Ratings & Reviews */}
            <div className="flex items-center gap-3 pt-1">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-xs font-bold text-slate-700">
                {product.rating || "4.9"} ({product.reviewsCount || product.reviews?.length || 42} verified reviews)
              </span>
            </div>
          </div>

          {/* Pricing Row */}
          <div className="flex items-baseline gap-3 pt-1 pb-2 border-b border-slate-100">
            <span className="text-3xl sm:text-4xl font-black text-slate-900">
              ₹{effectivePrice.toFixed(2)}
            </span>
            {product.compareAtPrice && Number(product.compareAtPrice) > effectivePrice && (
              <span className="text-lg text-slate-400 line-through font-medium">
                ₹{Number(product.compareAtPrice).toFixed(2)}
              </span>
            )}
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              ⚡ Free Express Delivery Eligible
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
            {product.description ||
              "Carefully designed, curated, and quality tested to ensure peak durability, authentic materials, and complete customer satisfaction."}
          </p>

          {/* Variant Selector */}
          {variants.length > 0 && (
            <div className="space-y-2.5 pt-2">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Select Option / Size:{" "}
                <span className="text-indigo-600 font-black">
                  {selectedVariant?.name || selectedVariant?.label || selectedVariant}
                </span>
              </span>
              <div className="flex flex-wrap gap-2">
                {variants.map((v, idx) => {
                  const vLabel = v.name || v.label || (typeof v === "string" ? v : `Option ${idx + 1}`);
                  const isSelected =
                    (selectedVariant?.name && selectedVariant.name === v.name) ||
                    (selectedVariant?.label && selectedVariant.label === v.label) ||
                    selectedVariant === v;

                  return (
                    <button
                      key={v._id || idx}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
                        isSelected
                          ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                          : "bg-white text-slate-700 border-slate-200 hover:border-slate-400 hover:bg-slate-50"
                      }`}
                    >
                      {vLabel}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Stock Check & Cart Actions (HIDE CART BUTTON IF OUT OF STOCK) */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            {outOfStock ? (
              /* OUT OF STOCK STATE: Cart button is completely hidden as instructed */
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-3">
                <AlertCircle size={20} className="shrink-0 text-rose-500" />
                <div>
                  <h4 className="text-xs font-bold">Currently Out of Stock</h4>
                  <p className="text-[11px] text-rose-600/90 mt-0.5">
                    This product is temporarily unavailable in inventory. Please check back soon or browse our other selections.
                  </p>
                </div>
              </div>
            ) : (
              /* IN STOCK STATE: Show quantity controls and Add to Cart button */
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="flex items-center justify-between sm:justify-start bg-slate-100 rounded-2xl p-1 border border-slate-200 shrink-0">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="p-2.5 text-slate-700 hover:bg-white rounded-xl transition disabled:opacity-40 cursor-pointer"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-12 text-center text-xs font-black text-slate-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
                    disabled={quantity >= stock}
                    className="p-2.5 text-slate-700 hover:bg-white rounded-xl transition disabled:opacity-40 cursor-pointer"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <button
                  onClick={handleAdd}
                  className={`flex-1 py-4 px-6 rounded-2xl font-black text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
                    added
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-900 hover:bg-slate-800 text-white"
                  }`}
                >
                  {added ? (
                    <>
                      <CheckCircle2 size={16} />
                      <span>Added to Bag!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={16} />
                      <span>Add to Shopping Bag • ₹{(effectivePrice * quantity).toFixed(2)}</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Quality & Trust Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-150 flex items-center gap-2.5">
              <Truck size={18} className="text-indigo-600 shrink-0" />
              <div>
                <h5 className="text-[11px] font-bold text-slate-900">Fast Express</h5>
                <span className="text-[10px] text-slate-500">24-48h Dispatch</span>
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-150 flex items-center gap-2.5">
              <ShieldCheck size={18} className="text-emerald-600 shrink-0" />
              <div>
                <h5 className="text-[11px] font-bold text-slate-900">100% Authentic</h5>
                <span className="text-[10px] text-slate-500">Certified Quality</span>
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-150 flex items-center gap-2.5">
              <RotateCcw size={18} className="text-amber-600 shrink-0" />
              <div>
                <h5 className="text-[11px] font-bold text-slate-900">Hassle-Free</h5>
                <span className="text-[10px] text-slate-500">Easy Return Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* StarlingTales-Style Accordion / Tabs: Description, Specs, Shipping & Policies */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex border-b border-slate-200 gap-6 overflow-x-auto scrollbar-none">
          {[
            { id: "description", label: "Full Description" },
            { id: "specs", label: "Product Specifications" },
            { id: "shipping", label: "Shipping & Delivery" },
            { id: "policies", label: `Business Policies (${policies.length || "Standard"})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-xs font-bold transition cursor-pointer whitespace-nowrap relative ${
                activeTab === tab.id
                  ? "text-slate-900 font-black"
                  : "text-slate-400 hover:text-slate-700"
              }`}
            >
              <span>{tab.label}</span>
              {activeTab === tab.id && (
                <span
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                  style={{ backgroundColor: primaryColor }}
                />
              )}
            </button>
          ))}
        </div>

        <div className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-4xl">
          {activeTab === "description" && (
            <div className="space-y-4">
              <p className="leading-relaxed">
                {product.description ||
                  "Engineered with premium ingredients and hand-selected raw materials to ensure maximum durability, peak performance, and an exceptional customer experience."}
              </p>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-150 space-y-2">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-indigo-600" />
                  Key Highlights & Craftsmanship
                </h4>
                <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1">
                  <li>Formulated with verified authentic components</li>
                  <li>Inspected through rigorous multi-point quality control</li>
                  <li>Sealed packaging protecting freshness and material integrity</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === "specs" && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400">SKU / Item Code</span>
                <p className="font-mono font-bold text-slate-800 text-xs mt-0.5">
                  {product.sku || `ILM-${product._id?.slice(-6) || "59201"}`}
                </p>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400">Category</span>
                <p className="font-bold text-slate-800 text-xs mt-0.5">
                  {typeof product.category === "object" ? product.category?.name : product.category || "General"}
                </p>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400">Inventory Status</span>
                <p className={`font-bold text-xs mt-0.5 ${outOfStock ? "text-rose-600" : "text-emerald-600"}`}>
                  {outOfStock ? "Out of Stock" : `In Stock (${stock} available)`}
                </p>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400">Brand / Merchant</span>
                <p className="font-bold text-slate-800 text-xs mt-0.5">
                  {business?.businessName || business?.name || "Verified Store"}
                </p>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400">Return Window</span>
                <p className="font-bold text-slate-800 text-xs mt-0.5">7-30 Days Guarantee</p>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400">Packaging</span>
                <p className="font-bold text-slate-800 text-xs mt-0.5">Eco-Friendly Protective Box</p>
              </div>
            </div>
          )}

          {activeTab === "shipping" && (
            <div className="space-y-3.5">
              <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-1">
                <h5 className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                  <Truck size={14} className="text-indigo-600" />
                  Express & Standard Shipping Information
                </h5>
                <p className="text-xs text-indigo-900/80">
                  We partner with top-tier courier networks to ensure swift, fully tracked delivery to your door.
                </p>
              </div>
              <ul className="space-y-2 text-xs">
                <li>• <strong>Same-Day Dispatch:</strong> Orders placed before 2:00 PM are processed immediately.</li>
                <li>• <strong>Delivery Timelines:</strong> Metro cities: 24-48 hours. Rest of India: 3-5 business days.</li>
                <li>• <strong>Free Shipping:</strong> Automatically applied on orders exceeding ₹499.</li>
              </ul>
            </div>
          )}

          {activeTab === "policies" && (
            <div className="space-y-4">
              {policies.length > 0 ? (
                policies.map((p, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-150 space-y-1">
                    <h5 className="text-xs font-bold text-slate-900 capitalize">
                      {p.title || (p.type ? p.type.replace(/_/g, " ") : `Policy ${idx + 1}`)}
                    </h5>
                    <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                      {p.content || p.description}
                    </p>
                  </div>
                ))
              ) : (
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-150">
                    <h5 className="text-xs font-bold text-slate-900">7-Day Easy Replacement Policy</h5>
                    <p className="text-xs text-slate-600 mt-1">
                      Eligible products can be returned or replaced within 7 days of package delivery in original, intact condition with tags and original packaging attached. Doorstep courier pickup is arranged at zero extra cost.
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-150">
                    <h5 className="text-xs font-bold text-slate-900">Prompt Refund Settlement</h5>
                    <p className="text-xs text-slate-600 mt-1">
                      Refunds are processed within 24-48 hours upon item return inspection and credited back to source account within 3-5 business days.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Related Products / Recommendations (if provided) */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-6 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-900 tracking-tight">
              You May Also Like
            </h3>
            <span className="text-xs font-bold text-indigo-600">Curated For You</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.slice(0, 4).map((rel) => {
              const relOutOfStock = isOutOfStock(rel);
              return (
                <div
                  key={rel._id}
                  onClick={() => onSelectProduct && onSelectProduct(rel)}
                  className="group bg-white rounded-2xl border border-slate-200 p-3 space-y-3 hover:shadow-md transition cursor-pointer"
                >
                  <div className="aspect-square rounded-xl overflow-hidden bg-slate-50">
                    <img
                      src={getProductImage(rel)}
                      alt={rel.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 truncate">{rel.name}</h4>
                    <span className="text-xs font-black text-slate-900">₹{Number(rel.price).toFixed(2)}</span>
                  </div>
                  {/* If out of stock, hide the quick add button */}
                  {relOutOfStock ? (
                    <span className="block text-center text-[10px] font-bold text-rose-500 py-1 bg-rose-50 rounded-lg">
                      Out of Stock
                    </span>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(addToCart({ product: rel, quantity: 1 }));
                        toast.success(`${rel.name} added to cart!`);
                      }}
                      className="w-full py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold transition cursor-pointer"
                    >
                      + Quick Add
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
