import React, { useState } from "react";
import {
  Heart,
  ShoppingBag,
  Star,
  ArrowLeft,
  Check,
  Coffee,
  ShieldCheck,
  Truck,
  RotateCcw,
} from "lucide-react";

export default function ProductDetails({
  product,
  currency = "₹",
  isWishlisted = false,
  onToggleWishlist = () => {},
  onAddToCart = () => {},
  onBack = () => {},
}) {
  if (!product) return null;

  const [selectedImage, setSelectedImage] = useState(
    product.images?.[0] || product.image
  );
  const [selectedGrind, setSelectedGrind] = useState("Whole Bean");
  const [quantity, setQuantity] = useState(1);

  const grindOptions = [
    { label: "Whole Bean", desc: "Best for home grinders" },
    { label: "French Press", desc: "Coarse grind" },
    { label: "Pour Over / Chemex", desc: "Medium-coarse" },
    { label: "Aeropress / Drip", desc: "Medium grind" },
    { label: "Espresso", desc: "Fine grind" },
  ];

  const isSoldOut =
    !product.inStock || product.stockQuantity === 0 || product.badge === "Sold out";

  return (
    <div className="w-full bg-[#FAF7F2] min-h-screen py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button & Breadcrumbs */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#2E1B13]/15">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-[#2E1B13] hover:text-amber-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Roastery</span>
          </button>

          <div className="text-xs text-[#7D6E63]">
            <span>Home</span> / <span className="capitalize">{product.categoryName || product.category}</span> /{" "}
            <span className="font-medium text-[#2E1B13]">{product.name}</span>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
          {/* Left: Images */}
          <div className="flex flex-col gap-4">
            {/* Main Featured Photo */}
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden border border-[#2E1B13]/25 bg-white shadow-sm">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />

              {/* Badge */}
              {isSoldOut ? (
                <span className="absolute top-4 left-4 bg-[#2C2724] text-white text-xs font-semibold px-3 py-1 rounded-sm uppercase tracking-wider shadow">
                  Sold out
                </span>
              ) : product.badge ? (
                <span className="absolute top-4 left-4 bg-[#16A34A] text-white text-xs font-bold px-3 py-1 rounded-sm uppercase tracking-wider shadow">
                  {product.badge}
                </span>
              ) : null}

              {/* Wishlist Button */}
              <button
                onClick={() => onToggleWishlist(product)}
                aria-label="Wishlist"
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/95 border border-[#2E1B13]/20 flex items-center justify-center shadow hover:scale-105 transition-transform"
              >
                <Heart
                  className={`w-5 h-5 ${
                    isWishlisted
                      ? "fill-rose-600 text-rose-600"
                      : "text-[#5C4D43]"
                  }`}
                />
              </button>
            </div>

            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                      selectedImage === img
                        ? "border-[#2E1B13] shadow-md scale-105"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info & Actions */}
          <div className="flex flex-col text-left">
            {/* Category & Origin */}
            <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-amber-800 font-semibold mb-2">
              <span>{product.categoryName || "Artisan Roast"}</span>
              {product.origin && (
                <>
                  <span>•</span>
                  <span>{product.origin}</span>
                </>
              )}
            </div>

            {/* Title */}
            <h1
              className="text-2xl sm:text-4xl font-serif text-[#2E1B13] font-normal tracking-tight mb-3"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {product.name}
            </h1>

            {/* Star Rating */}
            <div className="flex items-center gap-2 mb-5">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating || 5)
                        ? "fill-amber-500"
                        : "fill-amber-200 text-amber-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-semibold text-[#2E1B13]">
                {product.rating || 4.9}
              </span>
              <span className="text-xs text-[#7D6E63]">
                ({product.reviewCount || 100} verified reviews)
              </span>
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-xl bg-[#F0EAE1] border border-[#2E1B13]/10 mb-6 flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-bold text-[#2E1B13]">
                {currency}
                {product.price.toLocaleString("en-IN")}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="line-through text-sm sm:text-base text-[#8F8177]">
                  {currency}
                  {product.originalPrice.toLocaleString("en-IN")}
                </span>
              )}
              {product.discountPercent && (
                <span className="text-xs sm:text-sm font-bold text-[#16A34A] bg-emerald-100 px-2 py-0.5 rounded">
                  {product.discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-[#5C4D43] font-light leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Tasting Notes */}
            {product.tastingNotes && product.tastingNotes.length > 0 && (
              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#7D6E63] mb-2">
                  Tasting Profile & Notes
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.tastingNotes.map((note, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-white border border-[#2E1B13]/20 rounded-full text-xs font-medium text-[#2E1B13] shadow-2xs flex items-center gap-1.5"
                    >
                      <Coffee className="w-3 h-3 text-amber-700" />
                      {note}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Grind Selector (If applicable) */}
            {product.category !== "coffee-accessories" && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#7D6E63]">
                    Select Grind Size
                  </p>
                  <span className="text-xs text-amber-800 font-medium">
                    {selectedGrind}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {grindOptions.map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => setSelectedGrind(opt.label)}
                      className={`p-2.5 rounded-lg border text-left transition-all ${
                        selectedGrind === opt.label
                          ? "border-[#2E1B13] bg-white shadow-sm ring-1 ring-[#2E1B13]"
                          : "border-[#2E1B13]/20 bg-white/60 hover:bg-white"
                      }`}
                    >
                      <p className="text-xs font-semibold text-[#2E1B13]">
                        {opt.label}
                      </p>
                      <p className="text-[10px] text-[#7D6E63] leading-tight">
                        {opt.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Add to Cart Row */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              {/* Quantity Counter */}
              <div className="flex items-center border border-[#2E1B13]/30 rounded-full bg-white px-3 py-1.5 w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || isSoldOut}
                  className="w-8 h-8 flex items-center justify-center text-[#2E1B13] hover:text-black font-bold disabled:opacity-40"
                >
                  -
                </button>
                <span className="w-10 text-center font-semibold text-sm text-[#2E1B13]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={isSoldOut}
                  className="w-8 h-8 flex items-center justify-center text-[#2E1B13] hover:text-black font-bold disabled:opacity-40"
                >
                  +
                </button>
              </div>

              {/* Add to Cart CTA */}
              <button
                onClick={() => onAddToCart(product, quantity)}
                disabled={isSoldOut}
                className="flex-1 px-8 py-3.5 rounded-full bg-[#3A2318] hover:bg-[#25150E] text-[#FAF7F2] font-medium text-sm tracking-wider uppercase shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{isSoldOut ? "Sold Out" : "Add to Bag"}</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="border-t border-[#2E1B13]/15 pt-6 grid grid-cols-3 gap-4 text-center">
              <div className="flex flex-col items-center">
                <Truck className="w-5 h-5 text-amber-800 mb-1" />
                <span className="text-[11px] font-semibold text-[#2E1B13]">
                  Fresh Roast Delivery
                </span>
                <span className="text-[10px] text-[#7D6E63]">
                  Dispatched in 24h
                </span>
              </div>
              <div className="flex flex-col items-center">
                <ShieldCheck className="w-5 h-5 text-amber-800 mb-1" />
                <span className="text-[11px] font-semibold text-[#2E1B13]">
                  100% Fair Trade
                </span>
                <span className="text-[10px] text-[#7D6E63]">
                  Ethically sourced
                </span>
              </div>
              <div className="flex flex-col items-center">
                <RotateCcw className="w-5 h-5 text-amber-800 mb-1" />
                <span className="text-[11px] font-semibold text-[#2E1B13]">
                  Freshness Guarantee
                </span>
                <span className="text-[10px] text-[#7D6E63]">
                  Roasted on order
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
