import React, { useState } from "react";
import {
  Star,
  ShieldCheck,
  Truck,
  Heart,
  RotateCcw,
  Check,
  ArrowLeft,
  ShoppingBag,
  Sparkles,
  Maximize2,
  Box,
} from "lucide-react";
import { getProductImage } from "../../../utils/productImage";
import ProductCard from "./ProductCard";

export default function ProductDetails({
  product,
  allProducts = [],
  onAddToCart,
  onBack,
  onSelectProduct,
  onQuickView,
}) {
  const [selectedImgIdx, setSelectedImgIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [includeAssembly, setIncludeAssembly] = useState(true);
  const [activeTab, setActiveTab] = useState("specs");

  if (!product) {
    return (
      <div className="py-20 text-center space-y-4">
        <p className="text-stone-600">Product not found.</p>
        <button
          onClick={onBack}
          className="px-5 py-2.5 bg-[#A07855] text-white rounded-xl text-xs font-semibold"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  const galleryImages =
    product.images && product.images.length > 0
      ? product.images
      : [getProductImage(product, product.image)];

  const relatedProducts = allProducts
    .filter((p) => p._id !== product._id && p.category === product.category)
    .slice(0, 3);

  const handleAdd = () => {
    onAddToCart?.(product, quantity, {
      whiteGloveAssembly: includeAssembly,
    });
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-8 px-4 sm:px-6 lg:px-8 text-left">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Breadcrumb & Back */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-medium text-stone-600 hover:text-stone-900 transition cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Back to Collection</span>
          </button>
          <div className="text-xs text-stone-400 hidden sm:block">
            <span>Furniture</span> / <span>{product.category || "Living Room"}</span> /{" "}
            <span className="text-stone-700 font-medium">{product.name}</span>
          </div>
        </div>

        {/* Top Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square rounded-3xl bg-[#F7F5F2] border border-stone-200/80 p-8 flex items-center justify-center overflow-hidden">
              {product.badge && (
                <span className="absolute top-5 left-5 z-10 px-3.5 py-1 text-xs font-semibold text-white bg-[#A07855] rounded-full shadow-xs">
                  {product.badge}
                </span>
              )}
              <img
                src={galleryImages[selectedImgIdx] || galleryImages[0]}
                alt={product.name}
                className="w-full h-full object-contain max-h-[380px] drop-shadow-xl transition-all duration-500"
              />
            </div>

            {/* Thumbnail Row */}
            {galleryImages.length > 1 && (
              <div className="flex items-center gap-3">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImgIdx(idx)}
                    className={`w-20 h-20 rounded-2xl p-2 bg-white border-2 transition overflow-hidden cursor-pointer ${
                      selectedImgIdx === idx
                        ? "border-[#A07855] shadow-xs"
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
            )}
          </div>

          {/* Right Product Details Info */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#A07855]">
                {product.brand || "Casa Craft Atelier"}
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-stone-900 leading-tight">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 pt-1">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={15}
                      className={
                        i < Math.floor(product.rating || 5)
                          ? "fill-amber-500 text-amber-500"
                          : "text-stone-300"
                      }
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold text-stone-700">
                  {product.rating || 5.0} ({product.reviewCount || 1} verified customer review)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 pt-1 border-y border-stone-200 py-4">
              <span className="text-3xl font-bold text-stone-900 font-serif">
                ${Number(product.price).toFixed(2)}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-lg text-stone-400 line-through">
                  ${Number(product.compareAtPrice).toFixed(2)}
                </span>
              )}
              <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full">
                In Stock • Fast Dispatch
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-stone-600 leading-relaxed">
              {product.description ||
                "Expertly crafted with exceptional attention to joinery and comfort. Engineered to endure for generations with timeless Scandinavian silhouettes."}
            </p>

            {/* Dimensions highlight */}
            {product.dimensions && (
              <div className="bg-[#F7F5F2] rounded-2xl p-4 border border-stone-200/80 space-y-1">
                <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                  <Maximize2 size={14} className="text-[#A07855]" />
                  Product Dimensions:
                </span>
                <p className="text-xs text-stone-600 font-medium">
                  {product.dimensions}
                </p>
              </div>
            )}

            {/* White-Glove In-Home Assembly Toggle */}
            <label
              onClick={() => setIncludeAssembly(!includeAssembly)}
              className="flex items-center gap-3 p-3.5 bg-white rounded-2xl border border-stone-200 cursor-pointer shadow-2xs hover:border-[#A07855] transition"
            >
              <input
                type="checkbox"
                checked={includeAssembly}
                onChange={() => {}}
                className="w-4 h-4 text-[#A07855] rounded accent-[#A07855]"
              />
              <div className="text-xs">
                <span className="font-semibold text-stone-900 block">
                  Complimentary White-Glove Assembly Included
                </span>
                <span className="text-stone-500">
                  Technicians unbox, inspect, level, and remove all packaging in your room of choice.
                </span>
              </div>
            </label>

            {/* Quantity + Add to Cart */}
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center border border-stone-300 rounded-2xl bg-white px-3 py-2.5">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-7 h-7 flex items-center justify-center text-stone-600 hover:text-stone-900 font-bold"
                >
                  -
                </button>
                <span className="w-8 text-center text-sm font-bold text-stone-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-7 h-7 flex items-center justify-center text-stone-600 hover:text-stone-900 font-bold"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={handleAdd}
                className="flex-1 py-3.5 px-6 rounded-2xl bg-[#A07855] hover:bg-[#8d6645] text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag size={18} />
                <span>Add to Furnishing Bag</span>
              </button>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-2 gap-3 pt-3 text-xs text-stone-600">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-[#A07855]" />
                <span>10-Year Hardwood Warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck size={16} className="text-[#A07855]" />
                <span>In-Home Room Placement</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Specifications */}
        <div className="bg-white rounded-3xl border border-stone-200 p-8 space-y-6">
          <div className="flex gap-6 border-b border-stone-200 pb-4 text-sm font-semibold">
            <button
              onClick={() => setActiveTab("specs")}
              className={`pb-2 transition cursor-pointer relative ${
                activeTab === "specs" ? "text-[#A07855]" : "text-stone-500 hover:text-stone-900"
              }`}
            >
              Material & Craftsmanship
              {activeTab === "specs" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#A07855]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("delivery")}
              className={`pb-2 transition cursor-pointer relative ${
                activeTab === "delivery" ? "text-[#A07855]" : "text-stone-500 hover:text-stone-900"
              }`}
            >
              White-Glove Delivery
              {activeTab === "delivery" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#A07855]" />
              )}
            </button>
          </div>

          {activeTab === "specs" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-stone-600 leading-relaxed">
              <div className="space-y-2">
                <h4 className="font-bold text-stone-900">Materials & Construction</h4>
                <p>
                  {product.materials ||
                    "Solid American White Oak frame, premium high-density resilience cushions, and protective matte wax oil coating."}
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-stone-900">Care Instructions</h4>
                <p>
                  Dust regularly with a dry soft cloth. Clean spills immediately with a dampened lint-free cloth. Avoid direct harsh sunlight.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-xs text-stone-600 space-y-3 leading-relaxed">
              <p>
                Our white-glove logistics team contacts you 48 hours prior to arrange a 2-hour delivery window. Two technicians carry the piece upstairs or into your room of choice, assemble it, and recycle all packaging.
              </p>
            </div>
          )}
        </div>

        {/* Related Furniture */}
        {relatedProducts.length > 0 && (
          <div className="space-y-6 pt-6">
            <h3 className="text-xl font-bold font-serif text-stone-900">
              Related Pieces You May Admire
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p._id}
                  product={p}
                  onAddToCart={onAddToCart}
                  onQuickView={onQuickView}
                  onSelectProduct={onSelectProduct}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
