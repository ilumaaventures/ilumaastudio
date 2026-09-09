import React, { useState } from "react";
import {
  Heart,
  ShoppingBag,
  Star,
  ArrowLeft,
  Check,
  Radio,
  Zap,
  Shield,
  Bluetooth,
  Sliders,
} from "lucide-react";

export default function ProductDetails({
  product,
  currency = "€",
  isWishlisted = false,
  onToggleWishlist = () => {},
  onAddToCart = () => {},
  onBack = () => {},
}) {
  if (!product) return null;

  const [selectedImage, setSelectedImage] = useState(
    product.images?.[0] || product.image
  );
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="w-full bg-[#FFFFFF] min-h-screen py-10 sm:py-14 text-[#121212]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation & Breadcrumb */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-200">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-neutral-800 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>BACK TO SOUND TOOLS</span>
          </button>

          <div className="text-[11px] uppercase tracking-wider text-neutral-400">
            <span>HOME</span> / <span className="font-semibold text-neutral-700">{product.categoryName || product.category}</span> /{" "}
            <span className="text-black font-bold">{product.name}</span>
          </div>
        </div>

        {/* Product Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
          {/* Left Column: Imagery */}
          <div className="flex flex-col gap-4">
            <div className="relative w-full aspect-square bg-[#F9F9F9] border border-neutral-200 p-8 flex items-center justify-center">
              <img
                src={selectedImage}
                alt={product.name}
                className="max-h-full max-w-full object-contain"
              />

              {/* Wishlist Button */}
              <button
                onClick={() => onToggleWishlist(product)}
                aria-label="Wishlist"
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white border border-neutral-200 flex items-center justify-center hover:scale-105 transition-transform shadow-xs"
              >
                <Heart
                  className={`w-4 h-4 ${
                    isWishlisted
                      ? "fill-rose-600 text-rose-600"
                      : "text-neutral-500"
                  }`}
                />
              </button>
            </div>

            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-20 h-20 bg-[#F9F9F9] border p-2 flex items-center justify-center transition-all ${
                      selectedImage === img
                        ? "border-black shadow-xs"
                        : "border-neutral-200 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="max-h-full max-w-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Specs & Purchase */}
          <div className="flex flex-col text-left">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-neutral-500 mb-2">
              {product.categoryName || "PRECISION ACOUSTICS"}
            </span>

            <h1
              className="text-2xl sm:text-3xl font-bold uppercase tracking-wide text-[#121212] mb-3"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.floor(product.rating || 5)
                        ? "fill-amber-500"
                        : "fill-amber-200 text-amber-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-neutral-800">
                {product.rating || 4.9}
              </span>
              <span className="text-xs text-neutral-400">
                ({product.reviewCount || 100} verified acoustics reviews)
              </span>
            </div>

            {/* Price */}
            <div className="text-2xl sm:text-3xl font-bold text-[#121212] mb-6">
              {currency}
              {product.price.toLocaleString("en-US")}
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="ml-3 text-base text-neutral-400 line-through font-normal">
                  {currency}
                  {product.originalPrice.toLocaleString("en-US")}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-neutral-600 font-normal leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Acoustic Hardware Specifications */}
            <div className="border-t border-b border-neutral-200 py-4 mb-6 space-y-2.5 text-xs">
              {product.driverType && (
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500 font-medium">ACOUSTIC DRIVERS</span>
                  <span className="font-semibold text-neutral-900">{product.driverType}</span>
                </div>
              )}
              {product.batteryLife && (
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500 font-medium">BATTERY PLAYTIME</span>
                  <span className="font-semibold text-neutral-900">{product.batteryLife}</span>
                </div>
              )}
              {product.connectivity && (
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500 font-medium">CONNECTIVITY</span>
                  <span className="font-semibold text-neutral-900">{product.connectivity}</span>
                </div>
              )}
              {product.materials && (
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500 font-medium">CHASSIS & MATERIALS</span>
                  <span className="font-semibold text-neutral-900">{product.materials}</span>
                </div>
              )}
            </div>

            {/* Quantity Counter & Add to Cart */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center border border-neutral-300 bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="w-9 h-11 flex items-center justify-center text-neutral-700 hover:text-black font-bold disabled:opacity-40"
                >
                  -
                </button>
                <span className="w-10 text-center text-xs font-bold text-black">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-9 h-11 flex items-center justify-center text-neutral-700 hover:text-black font-bold"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => onAddToCart(product, quantity)}
                className="flex-1 py-3.5 px-6 bg-[#121212] hover:bg-neutral-800 text-white text-xs font-bold tracking-[0.2em] uppercase transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>ADD TO CART</span>
              </button>
            </div>

            {/* Acoustic Guarantees */}
            <div className="grid grid-cols-3 gap-3 text-center border-t border-neutral-100 pt-4 text-[11px] text-neutral-500">
              <div className="flex flex-col items-center">
                <Shield className="w-4 h-4 text-black mb-1" />
                <span className="font-semibold text-black">2-Year Warranty</span>
                <span>Global coverage</span>
              </div>
              <div className="flex flex-col items-center">
                <Zap className="w-4 h-4 text-black mb-1" />
                <span className="font-semibold text-black">Express Air</span>
                <span>Dispatched in 24h</span>
              </div>
              <div className="flex flex-col items-center">
                <Bluetooth className="w-4 h-4 text-black mb-1" />
                <span className="font-semibold text-black">Hi-Res Audio</span>
                <span>aptX Adaptive</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
