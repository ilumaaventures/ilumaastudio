import React, { useState } from "react";
import {
  ArrowLeft,
  Star,
  BookOpen,
  Bookmark,
  Award,
  Clock,
  Plus,
  Minus,
  Check,
  ShoppingBag,
  Share2,
  Coffee,
  Feather,
} from "lucide-react";
import toast from "react-hot-toast";
import { isOutOfStock } from "../../../utils/stockUtils";
import { getProductImage } from "../../../utils/productImage";
import ProductCard from "./ProductCard";

export default function ProductDetails({
  product,
  onBack,
  onAddToCart,
  onLookInside,
  relatedProducts = [],
  onSelectProduct,
}) {
  const [quantity, setQuantity] = useState(1);
  const [selectedFormat, setSelectedFormat] = useState(product?.format || "Clothbound Hardcover");
  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "typography" | "reviews"

  if (!product) return null;

  const outOfStock = isOutOfStock(product);
  const basePrice = Number(product.price) || 0;
  const originalPrice = product.compareAtPrice ? Number(product.compareAtPrice) : null;

  const formatPriceAdjustment =
    selectedFormat === "Paperback"
      ? -10
      : selectedFormat === "Signed First Edition"
      ? 25
      : 0;

  const unitPrice = Math.max(12, basePrice + formatPriceAdjustment);
  const totalPrice = unitPrice * quantity;

  // Estimated read time
  const estHours = product.wordCount
    ? Math.round((product.wordCount / 250 / 60) * 10) / 10
    : product.pages
    ? Math.round((product.pages * 0.9) * 10) / 10
    : 6.8;

  const handleAdd = () => {
    if (outOfStock) return;
    const itemToAdd = {
      ...product,
      format: selectedFormat,
      price: unitPrice,
      name: `${product.name} (${selectedFormat})`,
    };
    onAddToCart(itemToAdd, quantity);
    toast.success(`Added ${quantity}x ${itemToAdd.name} to Book Bag! 📚`);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Literary volume link copied to clipboard!");
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 text-left font-serif">
      {/* Breadcrumb & Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E7DFD5] pb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#9A3412] hover:underline transition cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Return to Stacks</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-[#78350F]">
          <span>The Library</span>
          <span>/</span>
          <span>{product.genre || "Literary Fiction"}</span>
          <span>/</span>
          <span className="text-[#1C1917] font-bold truncate max-w-[200px]">{product.name}</span>
        </div>

        <button
          onClick={handleShare}
          className="p-2 rounded-xl bg-white border border-[#D5C7B8] text-[#1C1917] hover:bg-[#FAF7F2] transition cursor-pointer text-xs flex items-center gap-1.5 shadow-sm"
        >
          <Share2 size={14} />
          <span className="hidden sm:inline">Share Volume</span>
        </button>
      </div>

      {/* Two-Column Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left Column: Cover & Bibliophile Specs */}
        <div className="lg:col-span-5 space-y-6">
          <div className="aspect-[3/4] w-full max-w-md mx-auto rounded-3xl overflow-hidden bg-[#FAF7F2] border-2 border-[#E7DFD5] relative group shadow-xl">
            <img
              src={getProductImage(product, product.image)}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <span className="bg-[#1C1917] text-[#FAF7F2] text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                {selectedFormat}
              </span>
              <span className="bg-[#D97706] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow flex items-center gap-1">
                <Award size={12} /> Smyth-Sewn Archival
              </span>
            </div>

            {/* "Look Inside" floating trigger */}
            <div className="absolute bottom-4 left-4 right-4">
              <button
                type="button"
                onClick={() => onLookInside && onLookInside(product)}
                className="w-full py-3 rounded-2xl bg-white/95 backdrop-blur-md border border-[#D5C7B8] text-[#1C1917] hover:bg-[#1C1917] hover:text-white transition shadow-lg flex items-center justify-center gap-2 text-xs font-bold cursor-pointer"
              >
                <BookOpen size={16} />
                <span>Open & Read First Chapter (Excerpt)</span>
              </button>
            </div>
          </div>

          {/* Physical Book Specifications */}
          <div className="p-5 rounded-2xl bg-white border border-[#E7DFD5] space-y-3 text-xs">
            <h4 className="font-bold text-[#1C1917] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Feather size={14} className="text-[#9A3412]" />
              <span>Press & Physical Typography</span>
            </h4>
            <div className="grid grid-cols-2 gap-3 text-[#574B40] font-sans">
              <div>
                <span className="text-[#78350F] block font-serif font-bold text-[11px]">Binding:</span>
                <span>Smyth-Sewn with Linen Headbands</span>
              </div>
              <div>
                <span className="text-[#78350F] block font-serif font-bold text-[11px]">Paper Stock:</span>
                <span>80gsm Acid-Free Munken Cream</span>
              </div>
              <div>
                <span className="text-[#78350F] block font-serif font-bold text-[11px]">Typesetting:</span>
                <span>Adobe Caslon Pro 11 / 15pt</span>
              </div>
              <div>
                <span className="text-[#78350F] block font-serif font-bold text-[11px]">Page Count:</span>
                <span>{product.pages || 412} Pages (~{product.wordCount || 105000} words)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Title, Format Switcher & Ordering */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest text-[#9A3412] font-bold">
              {product.genre || "Literary Fiction & Translation"}
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-[#1C1917] tracking-tight leading-tight">
              {product.name}
            </h1>
            <h3 className="text-base text-[#78350F] italic">
              By {product.author || "Elena Rostova"}
            </h3>

            <div className="flex items-center gap-3 pt-1">
              <div className="flex items-center gap-1 text-[#D97706]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="fill-[#D97706]" />
                ))}
              </div>
              <span className="text-xs font-bold text-[#1C1917] font-sans">{product.rating || "5.0"}</span>
              <span className="text-xs text-[#8C7A6B] font-sans">({product.reviewCount || 34} reader annotations)</span>
            </div>
          </div>

          {/* Pricing Banner */}
          <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E7DFD5] flex items-baseline justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-bold text-[#1C1917]">
                  ₹{unitPrice.toFixed(2)}
                </span>
                {originalPrice && (
                  <span className="text-sm text-[#8C7A6B] line-through font-sans">
                    ₹{originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#574B40] mt-1 font-sans">
                Includes hand-pressed cotton letterpress bookmark and protective library wrapping.
              </p>
            </div>

            <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC] font-sans">
              First Printing Available
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-[#574B40] leading-relaxed font-sans italic">
            "{product.description}"
          </p>

          {/* Edition Format Switcher */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#1C1917] uppercase tracking-wider block">
              Select Book Edition:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: "Clothbound Hardcover", label: "Clothbound Hardcover", price: `₹${basePrice}` },
                { id: "Paperback", label: "Paperback Edition", price: `₹${Math.max(12, basePrice - 10)}` },
                { id: "Signed First Edition", label: "Signed by Author", price: `₹${basePrice + 25}` },
              ].map((fmt) => (
                <button
                  key={fmt.id}
                  type="button"
                  onClick={() => setSelectedFormat(fmt.id)}
                  className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
                    selectedFormat === fmt.id
                      ? "bg-[#1C1917] text-white border-[#1C1917] shadow-sm font-bold"
                      : "bg-white text-[#574B40] border-[#E7DFD5] hover:bg-[#FAF7F2]"
                  }`}
                >
                  <div className="flex justify-between items-center text-xs">
                    <span>{fmt.label}</span>
                  </div>
                  <span className="text-xs font-mono font-bold block mt-1 opacity-90">{fmt.price}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Bookseller Editorial Sticky Note */}
          <div className="p-5 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] space-y-2 shadow-xs text-xs">
            <span className="text-[10px] uppercase font-bold text-[#92400E] block font-sans tracking-wider">
              ★ Bookseller Staff Recommendation
            </span>
            <p className="text-[#78350F] italic leading-relaxed">
              "A magnificent, slow-burning triumph of prose. The descriptive cadence of the Danube in winter is some of the finest writing we've encountered this decade."
            </p>
            <span className="text-[11px] font-bold text-[#92400E] block text-right font-sans">
              — Claire Moreau, Senior Fiction Curator
            </span>
          </div>

          {/* Reading Time Estimator Strip */}
          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E7DFD5] flex items-center justify-between text-xs font-sans">
            <div className="flex items-center gap-2 text-[#574B40]">
              <Clock size={16} className="text-[#9A3412]" />
              <span>Estimated Reading Time: <strong>~{estHours} Hours</strong> (at 250 WPM)</span>
            </div>
            <span className="text-xs font-serif italic text-[#78350F]">{product.pages || 412} Pages</span>
          </div>

          {/* Quantity Stepper & Add to Bag */}
          <div className="pt-2 space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-white border border-[#D5C7B8] rounded-2xl p-1 shadow-sm">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-[#78350F] hover:text-[#1C1917] transition cursor-pointer"
                >
                  <Minus size={14} />
                </button>
                <span className="w-12 text-center text-sm font-sans font-bold text-[#1C1917]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 text-[#78350F] hover:text-[#1C1917] transition cursor-pointer"
                >
                  <Plus size={14} />
                </button>
              </div>

              <div className="text-xs text-[#574B40] font-sans">
                Each copy arrives inspected, debossed, and carefully cushioned.
              </div>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              disabled={outOfStock}
              className={`w-full py-4 rounded-2xl font-serif font-bold text-sm uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-98 ${
                outOfStock
                  ? "bg-[#D5C7B8] text-[#8C7A6B] cursor-not-allowed"
                  : "bg-[#1C1917] hover:bg-[#292524] text-[#FAF7F2] border border-[#78350F]/40 hover:shadow-xl"
              }`}
            >
              <ShoppingBag size={18} className="text-[#D97706]" />
              <span>
                {outOfStock ? "Reprinting Press" : `Add to Book Bag • ₹${totalPrice.toFixed(2)}`}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Related Volumes */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="pt-12 border-t border-[#E7DFD5] space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-black text-[#1C1917]">Related Volumes in this Shelf</h3>
            <span className="text-xs text-[#78350F]">Curated Reader Companion</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts
              .filter((p) => p._id !== product._id)
              .slice(0, 4)
              .map((item) => (
                <ProductCard
                  key={item._id}
                  product={item}
                  onSelectProduct={onSelectProduct}
                  onAddToCart={onAddToCart}
                  onLookInside={onLookInside}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
