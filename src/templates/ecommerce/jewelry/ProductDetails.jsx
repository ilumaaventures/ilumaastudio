import React, { useState } from "react";
import {
  ArrowLeft,
  Star,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Check,
  Heart,
  Truck,
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
  const [selectedMetal, setSelectedMetal] = useState(product?.metal || "18ct White Gold");
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [activeTab, setActiveTab] = useState("details");

  if (!product) {
    return (
      <div className="py-20 text-center space-y-4">
        <p className="text-stone-500 text-sm">Jewelry piece not found.</p>
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
    "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80",
  ];

  const handleAdd = () => {
    onAddToCart?.({
      ...product,
      metal: selectedMetal,
    }, quantity);
  };

  const discountText = product.discount || (product.compareAtPrice && product.compareAtPrice > product.price ? product.badge || "SALE" : null);

  return (
    <div className="bg-[#FAF9F8] min-h-screen py-8 px-4 sm:px-6 lg:px-8 text-left">
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
            <span>Home</span> / <span>{product.category || "Jewelry"}</span> /{" "}
            <span className="text-stone-800 font-medium">{product.name}</span>
          </div>
        </div>

        {/* Top Product Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square rounded-lg bg-white border border-stone-200/80 p-8 flex items-center justify-center overflow-hidden shadow-xs">
              {discountText && (
                <span className="absolute top-4 left-4 z-10 text-xs font-bold text-red-600 border border-red-500 bg-white/90 px-2 py-0.5">
                  {discountText}
                </span>
              )}
              <img
                src={galleryImages[selectedImageIdx]}
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
                  onClick={() => setSelectedImageIdx(idx)}
                  className={`w-20 h-20 rounded p-2 bg-white border-2 transition overflow-hidden cursor-pointer ${
                    selectedImageIdx === idx
                      ? "border-stone-900 shadow-xs"
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
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#AA771C]">
                {product.category || "FINE JEWELRY"}
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900 leading-tight">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 pt-1 text-xs text-stone-600">
                <div className="flex text-amber-500">
                  <Star size={13} className="fill-amber-400 text-amber-400" />
                </div>
                <span className="font-semibold text-stone-900">
                  {product.rating ? Number(product.rating).toFixed(2) : "4.50"}
                </span>
                <span className="text-stone-400">|</span>
                <span>{product.reviewCount || 1} Customer Reviews</span>
              </div>
            </div>

            {/* Price Row */}
            <div className="flex items-center gap-3 pt-1 border-y border-stone-200 py-4">
              <span className="text-2xl sm:text-3xl font-bold text-rose-600 font-serif">
                ${Number(product.price).toFixed(2)}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-base text-stone-400 line-through">
                  ${Number(product.compareAtPrice).toFixed(2)}
                </span>
              )}
              <span className="text-[11px] font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full">
                In Stock • Vault Ready
              </span>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {product.description ||
                "Meticulously hand-set by master jewelers using ethically sourced gemstones and solid precious metals. Complete with luxury gift packaging and authenticity certificate."}
            </p>

            {/* Dimensions */}
            {product.dimensions && (
              <div className="bg-white rounded-md p-3.5 border border-stone-200 text-xs space-y-0.5">
                <span className="font-bold text-stone-900 block">Specifications:</span>
                <span className="text-stone-600">{product.dimensions}</span>
              </div>
            )}

            {/* Metal Selector */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-800 block">
                Precious Metal: <span className="text-[#AA771C] font-semibold">{selectedMetal}</span>
              </span>
              <div className="flex flex-wrap gap-2">
                {["18ct White Gold", "18ct Yellow Gold", "Sterling Silver"].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setSelectedMetal(m)}
                    className={`px-3 py-1.5 rounded text-xs font-medium border transition cursor-pointer ${
                      selectedMetal === m
                        ? "border-stone-900 bg-stone-900 text-white"
                        : "border-stone-200 bg-white text-stone-700 hover:border-stone-300"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity + Add to Bag */}
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center border border-stone-300 rounded bg-white px-3 py-2">
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
                className="flex-1 py-3 px-6 bg-stone-900 hover:bg-[#AA771C] text-white font-semibold text-xs tracking-wider uppercase rounded shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag size={15} />
                <span>Add to Shopping Bag</span>
              </button>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-stone-500">
              <div className="flex items-center gap-2">
                <ShieldCheck size={15} className="text-[#AA771C]" />
                <span>Conflict-Free Diamonds</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck size={15} className="text-[#AA771C]" />
                <span>Insured Armored Courier</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Craftsmanship Details */}
        <div className="bg-white rounded-lg border border-stone-200 p-6 sm:p-8 space-y-6">
          <div className="flex gap-8 border-b border-stone-200 pb-3 text-xs font-bold uppercase tracking-wider">
            <button
              onClick={() => setActiveTab("details")}
              className={`pb-2 transition cursor-pointer relative ${
                activeTab === "details" ? "text-stone-900 font-bold" : "text-stone-400 hover:text-stone-700"
              }`}
            >
              Craftsmanship & Materials
              {activeTab === "details" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("shipping")}
              className={`pb-2 transition cursor-pointer relative ${
                activeTab === "shipping" ? "text-stone-900 font-bold" : "text-stone-400 hover:text-stone-700"
              }`}
            >
              Insured Armored Delivery
              {activeTab === "shipping" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900" />
              )}
            </button>
          </div>

          {activeTab === "details" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-stone-600 leading-relaxed">
              <div className="space-y-2">
                <h4 className="font-bold text-stone-900 uppercase tracking-wide">Hallmark Guarantee</h4>
                <p>
                  Every piece is individually assayed, bearing official national hallmark stamps guaranteeing purity of solid gold and sterling silver alloys.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-stone-900 uppercase tracking-wide">Care & Cleaning</h4>
                <p>
                  Store in the provided anti-tarnish velvet suede pouch. Clean gently with warm soapy water and a soft-bristled brush. Complimentary lifetime ultrasonic cleaning at our showroom.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-xs text-stone-600 space-y-3 leading-relaxed">
              <p>
                All orders are dispatched in discreet, tamper-evident armored courier packaging. Packages are fully insured from our vault to your door, requiring an adult signature upon receipt.
              </p>
            </div>
          )}
        </div>

        {/* Related Jewelry */}
        {relatedProducts.length > 0 && (
          <div className="space-y-6 pt-4">
            <div className="border-b border-stone-200 pb-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#AA771C] block">
                Complementary Pieces
              </span>
              <h3 className="text-lg font-bold font-serif text-stone-900 mt-0.5">
                You May Also Admire
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
