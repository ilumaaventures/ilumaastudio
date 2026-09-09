import React, { useState } from "react";
import {
  ArrowLeft,
  Heart,
  Plus,
  Minus,
  Check,
  ShoppingBag,
  Share2,
  ShieldCheck,
  Truck,
  RotateCcw,
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
  const currencySymbol = product.currency || currency || "₹";
  const sizes = product.sizes || ["S", "M", "L", "XL"];

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
    toast.success("Product link copied to clipboard! ✨");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-left font-sans space-y-8">
      {/* Top Back Navigation */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB]">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-medium text-stone-700 hover:text-black transition cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Back to Collection</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-stone-400">
          <span>{product.category || "Apparel"}</span>
          <span>/</span>
          <span className="text-stone-800 font-medium truncate max-w-[200px]">
            {product.name}
          </span>
        </div>

        <button
          type="button"
          onClick={handleShare}
          className="p-1.5 rounded-full hover:bg-stone-100 text-stone-600 hover:text-black cursor-pointer"
          title="Share Product"
        >
          <Share2 size={16} />
        </button>
      </div>

      {/* Main Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Model Image */}
        <div className="lg:col-span-6 relative aspect-[3/4] bg-[#F2ECE4] rounded-xs overflow-hidden border border-stone-200 shadow-sm">
          <img
            src={getProductImage(product, product.image)}
            alt={product.name}
            className="w-full h-full object-cover object-top"
          />

          {/* Floating Heart */}
          <button
            type="button"
            onClick={() => onToggleWishlist && onToggleWishlist(product)}
            className={`absolute bottom-4 right-4 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-xs transition shadow-md cursor-pointer ${
              isWishlisted
                ? "bg-rose-500 text-white"
                : "bg-white/90 text-stone-700 hover:bg-white hover:text-black"
            }`}
          >
            <Heart size={16} className={isWishlisted ? "fill-white text-white" : ""} />
          </button>
        </div>

        {/* Right Column: Title, Sizes, Add to Cart */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-[#8B5A2B] uppercase tracking-widest">
              {product.category}
            </span>
            <h1 className="text-2xl sm:text-3xl font-normal text-stone-900 leading-tight">
              {product.name}
            </h1>
            <div className="flex items-baseline gap-3 pt-1">
              <span className="text-2xl font-bold text-stone-900">
                {currencySymbol} {price}
              </span>
              {originalPrice && (
                <span className="text-sm text-stone-400 line-through">
                  {currencySymbol} {originalPrice}
                </span>
              )}
            </div>
          </div>

          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            {product.description ||
              "Crafted with tailored precision, organic cotton fibers, and reinforced seams for an effortless contemporary drape."}
          </p>

          {/* Size Selector */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-800">
                Select Size:
              </span>
              <span className="text-[11px] text-[#8B5A2B] cursor-pointer hover:underline">
                Size Guide
              </span>
            </div>
            <div className="flex items-center gap-2">
              {sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSelectedSize(s)}
                  className={`w-11 h-11 text-xs font-semibold rounded-xs border transition cursor-pointer flex items-center justify-center ${
                    selectedSize === s
                      ? "border-[#8B5A2B] bg-[#8B5A2B] text-white shadow-xs"
                      : "border-stone-300 text-stone-700 hover:border-stone-800 bg-white"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity & Action Buttons */}
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
              className={`flex-1 py-3 px-6 rounded-none text-xs font-medium uppercase tracking-widest transition cursor-pointer flex items-center justify-center gap-2 shadow-xs active:scale-95 ${
                outOfStock
                  ? "bg-stone-200 text-stone-400 cursor-not-allowed"
                  : isAdding
                    ? "bg-[#8B5A2B] text-white"
                    : "bg-[#8B5A2B] hover:bg-[#704214] text-white"
              }`}
            >
              {isAdding ? (
                <>
                  <Check size={14} />
                  <span>ADDED TO BAG</span>
                </>
              ) : (
                <>
                  <ShoppingBag size={14} />
                  <span>ADD TO BAG</span>
                </>
              )}
            </button>
          </div>

          {/* Trust Value Badges */}
          <div className="pt-6 border-t border-stone-200 grid grid-cols-3 gap-4 text-center text-stone-600">
            <div className="space-y-1">
              <Truck size={18} className="mx-auto text-[#8B5A2B]" />
              <p className="text-[11px] font-medium">Free Express Delivery</p>
            </div>
            <div className="space-y-1">
              <RotateCcw size={18} className="mx-auto text-[#8B5A2B]" />
              <p className="text-[11px] font-medium">30-Day Easy Returns</p>
            </div>
            <div className="space-y-1">
              <ShieldCheck size={18} className="mx-auto text-[#8B5A2B]" />
              <p className="text-[11px] font-medium">100% Organic Quality</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
