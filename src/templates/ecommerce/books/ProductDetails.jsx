import React, { useState } from "react";
import {
  ArrowLeft,
  Star,
  BookOpen,
  Check,
  ShoppingBag,
  Share2,
  Download,
  FileText,
  ShieldCheck,
  Plus,
  Minus,
} from "lucide-react";
import toast from "react-hot-toast";
import { isOutOfStock } from "../../../utils/stockUtils";
import { getProductImage } from "../../../utils/productImage";
import ProductCard from "./ProductCard";

export default function ProductDetails({
  product,
  onBack,
  onAddToCart,
  relatedProducts = [],
  onSelectProduct,
}) {
  const [quantity, setQuantity] = useState(1);
  const [selectedFormat, setSelectedFormat] = useState("Digital PDF & EPUB");
  const [activeTab, setActiveTab] = useState("overview");

  if (!product) return null;

  const outOfStock = isOutOfStock(product);
  const basePrice = Number(product.price) || 0;
  const originalPrice = product.compareAtPrice ? Number(product.compareAtPrice) : null;
  const discountPercent =
    product.discount ||
    (originalPrice && originalPrice > basePrice
      ? Math.round(((originalPrice - basePrice) / originalPrice) * 100)
      : null);

  const backdropColor = product.backdropColor || "#E8ECEF";

  const handleAdd = () => {
    if (outOfStock) return;
    const itemToAdd = {
      ...product,
      format: selectedFormat,
      price: basePrice,
    };
    onAddToCart(itemToAdd, quantity);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Book link copied to clipboard! 📋");
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 text-left font-sans">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#F3F4F6]">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-medium text-[#133E47] hover:underline cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Back to Digital Products</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-stone-500">
          <span>Digital Products</span>
          <span>/</span>
          <span className="text-stone-900 font-medium truncate max-w-[200px]">
            {product.name}
          </span>
        </div>

        <button
          onClick={handleShare}
          className="p-2 rounded-full border border-stone-200 hover:bg-stone-50 text-stone-700 transition cursor-pointer text-xs flex items-center gap-1"
          title="Share"
        >
          <Share2 size={14} />
        </button>
      </div>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Book Presentation in Colored Backdrop */}
        <div className="lg:col-span-5">
          <div
            className="w-full aspect-[4/5] rounded-xs flex items-center justify-center p-8 sm:p-10 relative overflow-hidden border border-[#E5E7EB] shadow-xs"
            style={{ backgroundColor: backdropColor }}
          >
            <div className="relative w-3/4 max-w-[240px] aspect-[2/3] shadow-[0_12px_28px_rgba(0,0,0,0.28)] rounded-xs overflow-hidden bg-white">
              <img
                src={getProductImage(product, product.image)}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-0 bottom-0 left-0 w-3 bg-gradient-to-r from-black/25 via-white/10 to-transparent pointer-events-none" />
            </div>
          </div>

          <div className="mt-4 p-4 rounded-xs bg-[#FAF9F6] border border-[#E5E7EB] space-y-2 text-xs text-stone-600">
            <div className="flex items-center gap-2 text-stone-800 font-medium">
              <Download size={14} className="text-[#133E47]" />
              <span>Instant Digital Delivery:</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Files are immediately unlocked upon purchase. Compatible with Kindle, Apple Books, iPad, Android, and all PDF/EPUB e-readers.
            </p>
          </div>
        </div>

        {/* Right Column: Book Details & Add to Cart */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <span className="text-[11px] font-semibold text-[#133E47] uppercase tracking-wider">
              {product.category || "Digital Publications"}
            </span>
            <h1 className="text-2xl sm:text-3xl font-normal text-[#111827] leading-tight">
              {product.name}
            </h1>
            {product.author && (
              <p className="text-sm text-stone-600">
                by <strong className="text-stone-900">{product.author}</strong>
              </p>
            )}

            {/* Rating */}
            <div className="flex items-center gap-2 pt-1">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className="fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <span className="text-xs font-semibold text-stone-800">
                {product.rating || 4.9}
              </span>
              <span className="text-xs text-stone-400">
                ({product.reviewCount || 120} reviews)
              </span>
            </div>
          </div>

          {/* Pricing Row */}
          <div className="flex items-baseline gap-3 pt-2">
            <span className="text-2xl sm:text-3xl font-bold text-[#111827]">
              ${Number(basePrice).toFixed(basePrice % 1 === 0 ? 0 : 2)}
            </span>
            {originalPrice && originalPrice > basePrice && (
              <span className="text-sm text-stone-400 line-through">
                ${Number(originalPrice).toFixed(originalPrice % 1 === 0 ? 0 : 2)}
              </span>
            )}
            {discountPercent > 0 && (
              <span className="text-xs font-semibold text-[#047857] bg-[#ECFDF5] px-2 py-0.5 rounded-xs">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Format Selector */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-medium text-stone-700 block">
              Included Digital Formats:
            </span>
            <div className="flex flex-wrap gap-2">
              {["Digital PDF & EPUB", "MOBI (Kindle)", "Audiobook Chapter"].map(
                (fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => setSelectedFormat(fmt)}
                    className={`px-3.5 py-2 text-xs rounded-xs border transition cursor-pointer ${
                      selectedFormat === fmt
                        ? "border-[#133E47] bg-[#133E47]/5 text-[#133E47] font-semibold"
                        : "border-stone-200 text-stone-700 hover:border-stone-300"
                    }`}
                  >
                    {fmt}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Quantity & Add to Cart */}
          <div className="flex items-center gap-3 pt-4">
            <div className="flex items-center border border-stone-300 rounded-sm px-3 py-2 bg-stone-50">
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
              className="flex-1 py-3 px-6 bg-[#133E47] hover:bg-[#0E2D34] text-white rounded-sm text-xs font-medium uppercase tracking-wider transition shadow-sm cursor-pointer active:scale-95 text-center flex items-center justify-center gap-2"
            >
              <ShoppingBag size={15} />
              <span>Add to cart</span>
            </button>
          </div>

          {/* Description & Excerpt Tabs */}
          <div className="pt-6 border-t border-stone-200 space-y-4">
            <div className="flex items-center gap-4 text-xs font-medium border-b border-stone-200 pb-2">
              <button
                onClick={() => setActiveTab("overview")}
                className={`pb-2 -mb-2 transition ${
                  activeTab === "overview"
                    ? "border-b-2 border-[#133E47] text-[#133E47] font-semibold"
                    : "text-stone-500 hover:text-stone-800"
                }`}
              >
                Overview
              </button>
              {product.excerpt && (
                <button
                  onClick={() => setActiveTab("excerpt")}
                  className={`pb-2 -mb-2 transition ${
                    activeTab === "excerpt"
                      ? "border-b-2 border-[#133E47] text-[#133E47] font-semibold"
                      : "text-stone-500 hover:text-stone-800"
                  }`}
                >
                  Reading Excerpt
                </button>
              )}
            </div>

            {activeTab === "overview" && (
              <p className="text-xs text-stone-600 leading-relaxed">
                {product.description ||
                  "A compelling digital publication with comprehensive frameworks and practical insights."}
              </p>
            )}

            {activeTab === "excerpt" && product.excerpt && (
              <div className="p-4 rounded-xs bg-[#FAF8F5] border border-stone-200 text-xs text-stone-700 italic leading-relaxed">
                "{product.excerpt}"
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Products Grid */}
      {relatedProducts.length > 0 && (
        <div className="pt-12 border-t border-stone-200 space-y-6">
          <h3 className="text-lg font-normal text-stone-900">
            More Digital Products You Might Like
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedProducts
              .filter((p) => p._id !== product._id)
              .slice(0, 4)
              .map((item) => (
                <ProductCard
                  key={item._id}
                  product={item}
                  onSelectProduct={onSelectProduct}
                  onAddToCart={onAddToCart}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
