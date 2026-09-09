import React, { useState } from "react";
import {
  ArrowLeft,
  Star,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Droplets,
  Check,
  Heart,
  RotateCcw,
} from "lucide-react";
import { getProductImage } from "../../../utils/productImage";
import ProductCard from "./ProductCard";

export default function ProductDetails({
  product,
  onBack,
  onAddToCart,
  relatedProducts = [],
  onSelectProduct,
  onQuickView,
}) {
  const [quantity, setQuantity] = useState(1);
  const [selectedShadeIdx, setSelectedShadeIdx] = useState(0);
  const [selectedImgIdx, setSelectedImgIdx] = useState(0);
  const [activeTab, setActiveTab] = useState("benefits");

  if (!product) {
    return (
      <div className="py-20 text-center space-y-4">
        <p className="text-stone-500 text-sm">Product not found.</p>
        <button
          onClick={onBack}
          className="px-5 py-2 bg-stone-900 text-white rounded text-xs font-semibold"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  const galleryImages = [
    getProductImage(product, product.image),
    "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80",
  ];

  const shades = product.shades || ["#991B1B", "#1C1917", "#D97706", "#CBD5E1"];

  const handleAdd = () => {
    onAddToCart?.({
      ...product,
      selectedShade: shades[selectedShadeIdx],
    }, quantity);
  };

  return (
    <div className="bg-[#FAF9F7] min-h-screen py-8 px-4 sm:px-6 lg:px-8 text-left">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-stone-900 transition cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Back to Collection</span>
          </button>
          <div className="text-xs text-stone-400 hidden sm:block">
            <span>Home</span> / <span>{product.category || "Skincare"}</span> /{" "}
            <span className="text-stone-800 font-medium">{product.name}</span>
          </div>
        </div>

        {/* Top Product Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-[3/4] rounded-2xl bg-white border border-stone-200/80 p-8 flex items-center justify-center overflow-hidden shadow-xs">
              {product.badge && (
                <span className="absolute top-4 left-4 z-10 px-3 py-1 text-xs font-bold text-white bg-[#8F9E68] rounded-full shadow-xs">
                  {product.badge}
                </span>
              )}
              <img
                src={galleryImages[selectedImgIdx]}
                alt={product.name}
                className="w-full h-full object-contain max-h-[380px] drop-shadow-sm transition-all duration-500"
              />
            </div>

            {/* Thumbnails */}
            <div className="flex items-center gap-3">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImgIdx(idx)}
                  className={`w-20 h-20 rounded-xl p-2 bg-white border-2 transition overflow-hidden cursor-pointer ${
                    selectedImgIdx === idx
                      ? "border-[#8F9E68] shadow-xs"
                      : "border-stone-200 hover:border-stone-300"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumb ${idx}`}
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Product Details Info */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#8F9E68]">
                {product.category || "CLEAN BOTANICALS"}
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900 leading-tight">
                {product.name}
              </h1>

              {/* 5-Star Rating */}
              <div className="flex items-center gap-2 pt-1 text-xs text-stone-600">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={13} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="font-semibold text-stone-900">
                  5.00
                </span>
                <span className="text-stone-400">|</span>
                <span>{product.reviewCount || 42} Customer Reviews</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 pt-1 border-y border-stone-200 py-4">
              <span className="text-2xl sm:text-3xl font-bold text-stone-900 font-serif">
                ${Number(product.price).toFixed(2)}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-base text-stone-400 line-through">
                  ${Number(product.compareAtPrice).toFixed(2)}
                </span>
              )}
              <span className="text-[11px] font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full">
                In Stock • Fast Shipping
              </span>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {product.description ||
                "Formulated with natural botanical extracts and cold-pressed seed oils to nourish and soothe the moisture barrier for dewy, balanced radiance."}
            </p>

            {/* Interactive Shade Picker */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-800 block">
                Select Shade / Formulation:
              </span>
              <div className="flex items-center gap-2.5">
                {shades.map((shade, idx) => {
                  const isSelected = selectedShadeIdx === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedShadeIdx(idx)}
                      className={`w-6 h-6 rounded-full transition-all cursor-pointer ${
                        isSelected
                          ? "ring-2 ring-stone-900 ring-offset-2 scale-110"
                          : "hover:scale-110"
                      }`}
                      style={{ backgroundColor: shade }}
                      title={`Shade ${idx + 1}`}
                    />
                  );
                })}
              </div>
            </div>

            {/* Quantity + Add to Bag */}
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center border border-stone-300 rounded-xl bg-white px-3 py-2">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-6 h-6 flex items-center justify-center text-stone-600 hover:text-stone-900 font-bold"
                >
                  -
                </button>
                <span className="w-8 text-center text-xs font-bold text-stone-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-6 h-6 flex items-center justify-center text-stone-600 hover:text-stone-900 font-bold"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={handleAdd}
                className="flex-1 py-3 px-6 bg-[#8F9E68] hover:bg-[#7d8c58] text-white font-semibold text-xs tracking-wider uppercase rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag size={15} />
                <span>Add to Shopping Bag</span>
              </button>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-stone-500">
              <div className="flex items-center gap-2">
                <ShieldCheck size={15} className="text-[#8F9E68]" />
                <span>100% Vegan & Cruelty-Free</span>
              </div>
              <div className="flex items-center gap-2">
                <Droplets size={15} className="text-[#8F9E68]" />
                <span>Clean Organic Ingredients</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Skincare Details */}
        <div className="bg-white rounded-xl border border-stone-200 p-6 sm:p-8 space-y-6">
          <div className="flex gap-8 border-b border-stone-200 pb-3 text-xs font-bold uppercase tracking-wider">
            <button
              onClick={() => setActiveTab("benefits")}
              className={`pb-2 transition cursor-pointer relative ${
                activeTab === "benefits" ? "text-stone-900 font-bold" : "text-stone-400 hover:text-stone-700"
              }`}
            >
              Benefits & Application
              {activeTab === "benefits" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8F9E68]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("ingredients")}
              className={`pb-2 transition cursor-pointer relative ${
                activeTab === "ingredients" ? "text-stone-900 font-bold" : "text-stone-400 hover:text-stone-700"
              }`}
            >
              Clean Ingredients
              {activeTab === "ingredients" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8F9E68]" />
              )}
            </button>
          </div>

          {activeTab === "benefits" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-stone-600 leading-relaxed">
              <div className="space-y-2">
                <h4 className="font-bold text-stone-900 uppercase tracking-wide">How to Use</h4>
                <p>
                  Dispense 3-4 drops onto clean palms and press gently into face and neck morning and night. Follow with your favorite moisturizer or sunscreen.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-stone-900 uppercase tracking-wide">Clinical Results</h4>
                <p>
                  96% of participants reported an immediate boost in hydration. 92% noticed visibly calmer and smoother skin texture after 14 days of daily use.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-xs text-stone-600 space-y-2 leading-relaxed">
              <p className="font-semibold text-stone-800">
                Key Botanicals: Green Tea Polyphenols, Cold-Pressed Hemp Seed Oil, Centella Asiatica, Plant Squalane, Niacinamide, Sodium Hyaluronate.
              </p>
              <p>
                Formulated without parabens, phthalates, synthetic sulfates, artificial fragrances, or mineral oils.
              </p>
            </div>
          )}
        </div>

        {/* Related Skincare */}
        {relatedProducts.length > 0 && (
          <div className="space-y-6 pt-4">
            <div className="border-b border-stone-200 pb-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#8F9E68] block">
                Skincare Ritual
              </span>
              <h3 className="text-lg font-bold font-serif text-stone-900 mt-0.5">
                Complete Your Routine
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.slice(0, 4).map((p) => (
                <ProductCard
                  key={p._id}
                  product={p}
                  onSelectProduct={onSelectProduct}
                  onAddToCart={onAddToCart}
                  onQuickView={onQuickView}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
