import React from "react";
import { Heart, ShoppingBag, Eye } from "lucide-react";

export default function ProductCard({
  product,
  currency = "₹",
  isWishlisted = false,
  onToggleWishlist = () => {},
  onAddToCart = () => {},
  onSelectProduct = () => {},
}) {
  if (!product) return null;

  const isSoldOut = !product.inStock || product.stockQuantity === 0 || product.badge === "Sold out";

  return (
    <div className="group flex flex-col w-full text-left">
      {/* Image Container with Border & Rounded Corners (matching reference image) */}
      <div className="relative w-full aspect-square rounded-xl overflow-hidden border border-[#2E1B13]/20 bg-[#F4EEE6] transition-all duration-300 group-hover:border-[#2E1B13]/40 group-hover:shadow-md">
        {/* Product Image */}
        <img
          src={product.image}
          alt={product.name}
          onClick={() => onSelectProduct(product)}
          className={`w-full h-full object-cover object-center cursor-pointer transition-transform duration-500 group-hover:scale-105 ${
            isSoldOut ? "grayscale-[40%]" : ""
          }`}
        />

        {/* Top-Left Badge (BUY 1 GET 1 in bright green or Sold out in dark grey) */}
        {isSoldOut ? (
          <div className="absolute top-2.5 left-2.5 z-10 bg-[#2C2724] text-[#FAF7F2] text-[10px] font-semibold px-2 py-0.5 rounded-[2px] tracking-wider uppercase shadow-sm">
            Sold out
          </div>
        ) : product.badge ? (
          <div className="absolute top-2.5 left-2.5 z-10 bg-[#16A34A] text-white text-[10px] font-bold px-2 py-0.5 rounded-[2px] tracking-wider uppercase shadow-sm">
            {product.badge}
          </div>
        ) : null}

        {/* Top-Right Wishlist Floating Circular Heart (matching reference image) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          aria-label="Toggle Wishlist"
          className="absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-full bg-white/90 hover:bg-white border border-[#2E1B13]/15 flex items-center justify-center shadow-sm hover:scale-110 transition-transform duration-200"
        >
          <Heart
            className={`w-3.5 h-3.5 transition-colors ${
              isWishlisted
                ? "fill-rose-600 text-rose-600"
                : "text-[#5C4D43] hover:text-[#2E1B13]"
            }`}
          />
        </button>

        {/* Quick Action Overlay on Hover */}
        <div className="absolute inset-x-2 bottom-2 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 flex gap-2">
          <button
            onClick={() => onSelectProduct(product)}
            className="flex-1 py-2 px-3 bg-white/95 hover:bg-white text-[#2E1B13] text-xs font-medium rounded-md shadow-md flex items-center justify-center gap-1.5 backdrop-blur-sm transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Details</span>
          </button>

          {!isSoldOut && (
            <button
              onClick={() => onAddToCart(product, 1)}
              className="flex-1 py-2 px-3 bg-[#3A2318] hover:bg-[#25150E] text-white text-xs font-medium rounded-md shadow-md flex items-center justify-center gap-1.5 transition-colors"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          )}
        </div>
      </div>

      {/* Product Information Below Image */}
      <div className="mt-3.5 flex flex-col">
        {/* Name */}
        <h4
          onClick={() => onSelectProduct(product)}
          className="text-sm sm:text-base font-serif text-[#2E1B13] font-normal hover:text-amber-800 cursor-pointer line-clamp-1 transition-colors"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          title={product.name}
        >
          {product.name}
        </h4>

        {/* Price Row (matching reference format: ₹699 ₹899 (22% OFF)) */}
        <div className="mt-1 flex items-baseline gap-2 flex-wrap text-xs sm:text-sm">
          <span className="font-semibold text-[#2E1B13]">
            {currency}
            {product.price.toLocaleString("en-IN")}
          </span>

          {product.originalPrice && product.originalPrice > product.price && (
            <span className="line-through text-[#8F8177] text-xs">
              {currency}
              {product.originalPrice.toLocaleString("en-IN")}
            </span>
          )}

          {product.discountPercent && product.discountPercent > 0 && (
            <span className="text-[#16A34A] font-semibold text-xs">
              ({product.discountPercent}% OFF)
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
