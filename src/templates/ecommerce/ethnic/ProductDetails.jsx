import React, { useState } from "react";
import {
  ArrowLeft,
  Heart,
  Plus,
  Minus,
  Check,
  ShoppingBag,
  Share2,
  Tag,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";
import { isOutOfStock } from "../../../utils/stockUtils";
import { getProductImage } from "../../../utils/productImage";

export default function ProductDetails({
  product,
  onBack,
  onAddToCart,
  onToggleWishlist,
  isWishlisted = false,
  currency = "₹",
}) {
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  if (!product) return null;

  const outOfStock = isOutOfStock(product);
  const price = Number(product.price) || 0;
  const originalPrice = product.compareAtPrice ? Number(product.compareAtPrice) : null;
  const discountPercent =
    product.discount ||
    (originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : null);
  const currencySymbol = product.currency || currency || "₹";
  const sizes = product.sizes || ["XS", "S", "M", "L", "XL"];

  const handleAdd = () => {
    if (outOfStock) return;
    setIsAdding(true);
    const itemToAdd = {
      ...product,
      selectedSize,
      price,
    };
    onAddToCart(itemToAdd, quantity);
    setTimeout(() => setIsAdding(false), 800);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Couture link copied to clipboard! ✨");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-left font-sans space-y-8">
      {/* Top Navigation */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-200">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-medium text-stone-700 hover:text-black transition cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Back to Collection</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-stone-400">
          <span>{product.category}</span>
          <span>/</span>
          <span className="text-stone-800 font-medium truncate max-w-[220px]">
            {product.name}
          </span>
        </div>

        <button
          type="button"
          onClick={handleShare}
          className="p-1.5 rounded-full hover:bg-stone-100 text-stone-600 hover:text-black cursor-pointer"
          title="Share"
        >
          <Share2 size={16} />
        </button>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Model Image */}
        <div className="lg:col-span-6 relative aspect-[3/4] bg-[#F2EDE7] overflow-hidden border border-stone-200 shadow-xs">
          {/* Warm circular halo */}
          <div className="absolute inset-8 rounded-full bg-[#E8DDD1]/70 blur-2xl pointer-events-none" />

          <img
            src={getProductImage(product, product.image)}
            alt={product.name}
            className="relative z-10 w-full h-full object-cover object-top"
          />

          {/* Promotional Ribbon Badge */}
          {product.ribbonBadge && (
            <div className="absolute top-0 left-0 z-20 bg-[#16A34A] text-white text-xs font-bold uppercase tracking-wider px-3 py-1 shadow-sm">
              {product.ribbonBadge}
            </div>
          )}

          {/* Floating Heart */}
          <button
            type="button"
            onClick={() => onToggleWishlist && onToggleWishlist(product)}
            className={`absolute bottom-4 right-4 z-20 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-xs transition shadow-md cursor-pointer ${
              isWishlisted
                ? "bg-rose-500 text-white"
                : "bg-white/90 text-stone-700 hover:bg-white hover:text-black"
            }`}
          >
            <Heart size={16} className={isWishlisted ? "fill-white text-white" : ""} />
          </button>
        </div>

        {/* Right Column: Title, Prices, Sizes, Cart */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-[#16A34A] uppercase tracking-widest block">
              {product.category}
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-black text-stone-900 leading-tight">
              {product.name}
            </h1>

            {/* Price Row */}
            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-2xl sm:text-3xl font-bold text-stone-900">
                {currencySymbol}{price}
              </span>
              {originalPrice && originalPrice > price && (
                <span className="text-base text-stone-400 line-through">
                  {currencySymbol}{originalPrice}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="text-xs font-bold text-[#16A34A] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-none">
                  ({discountPercent}% OFF)
                </span>
              )}
            </div>
          </div>

          {product.ribbonBadge && (
            <div className="p-3 bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
              <Tag size={15} className="text-[#16A34A]" />
              <span>
                <strong>Offer Applied:</strong> {product.ribbonBadge} on festive collection items.
              </span>
            </div>
          )}

          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            {product.description ||
              "Intricately crafted with fine textile blends, traditional zardozi finishes, and a contemporary silhouette tailored for celebratory evenings."}
          </p>

          {/* Size Selector */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-800">
                Select Size:
              </span>
              <span className="text-[11px] text-[#16A34A] cursor-pointer hover:underline">
                View Size Chart
              </span>
            </div>
            <div className="flex items-center gap-2">
              {sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSelectedSize(s)}
                  className={`w-11 h-11 text-xs font-semibold rounded-none border transition cursor-pointer flex items-center justify-center ${
                    selectedSize === s
                      ? "border-black bg-black text-white"
                      : "border-stone-300 text-stone-700 hover:border-black bg-white"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity & Add to Cart */}
          <div className="flex items-center gap-3 pt-4">
            <div className="flex items-center border border-stone-300 rounded-none px-3 py-2 bg-stone-50">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-1 text-stone-500 hover:text-black cursor-pointer"
              >
                <Minus size={13} />
              </button>
              <span className="w-8 text-center text-xs font-bold text-stone-900">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="p-1 text-stone-500 hover:text-black cursor-pointer"
              >
                <Plus size={13} />
              </button>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              disabled={outOfStock}
              className={`flex-1 py-3 px-6 rounded-none text-xs font-medium uppercase tracking-widest transition cursor-pointer flex items-center justify-center gap-2 shadow-xs active:scale-95 border border-black ${
                outOfStock
                  ? "border-stone-200 text-stone-400 bg-stone-50 cursor-not-allowed"
                  : isAdding
                    ? "bg-[#16A34A] border-[#16A34A] text-white"
                    : "bg-black hover:bg-stone-800 text-white"
              }`}
            >
              {isAdding ? (
                <>
                  <Check size={14} />
                  <span>ADDED TO CART</span>
                </>
              ) : (
                <>
                  <ShoppingBag size={14} />
                  <span>ADD TO CART</span>
                </>
              )}
            </button>
          </div>

          {/* Fabric & Care Strip */}
          <div className="pt-6 border-t border-stone-200 space-y-2 text-xs text-stone-600">
            <div className="flex items-center gap-2 text-stone-900 font-semibold">
              <Sparkles size={14} className="text-[#16A34A]" />
              <span>Fabric & Garment Care</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-stone-500 text-[11px]">
              <li>Premium woven silk & organza blend with breathable inner slip</li>
              <li>Dry clean only to maintain metallic threadwork and gota patti</li>
              <li>Includes extra seam allowances for custom alteration</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
