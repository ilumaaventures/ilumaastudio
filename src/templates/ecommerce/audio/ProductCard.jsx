import React from "react";
import { Heart, ShoppingBag } from "lucide-react";

export default function ProductCard({
  product,
  currency = "€",
  isWishlisted = false,
  onToggleWishlist = () => {},
  onAddToCart = () => {},
  onSelectProduct = () => {},
}) {
  if (!product) return null;

  return (
    <div className="group flex flex-col w-full text-left bg-white border border-[#E5E5E5] transition-all duration-200 hover:border-neutral-400 hover:shadow-md">
      {/* Product Image Container */}
      <div className="relative w-full aspect-square bg-[#FAFAFA] overflow-hidden p-6 flex items-center justify-center">
        <img
          src={product.image}
          alt={product.name}
          onClick={() => onSelectProduct(product)}
          className="max-h-full max-w-full object-contain cursor-pointer transition-transform duration-500 group-hover:scale-105"
        />

        {/* Floating Heart Icon in Bottom-Right matching reference */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          aria-label="Wishlist"
          className="absolute bottom-3 right-3 z-10 w-7 h-7 rounded-full bg-white/80 hover:bg-white border border-neutral-200 flex items-center justify-center transition-transform hover:scale-110 shadow-2xs"
        >
          <Heart
            className={`w-3.5 h-3.5 transition-colors ${
              isWishlisted
                ? "fill-rose-600 text-rose-600"
                : "text-neutral-500 hover:text-black"
            }`}
          />
        </button>
      </div>

      {/* Product Information */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h4
            onClick={() => onSelectProduct(product)}
            className="text-xs sm:text-[13px] font-semibold text-[#121212] tracking-normal leading-snug line-clamp-2 hover:underline cursor-pointer"
            title={product.name}
          >
            {product.name}
          </h4>

          {/* Price Line matching reference (e.g. €299) */}
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-xs sm:text-sm font-semibold text-[#121212]">
              {currency}
              {product.price.toLocaleString("en-US")}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[11px] text-neutral-400 line-through">
                {currency}
                {product.originalPrice.toLocaleString("en-US")}
              </span>
            )}
          </div>
        </div>

        {/* Crisp Outlined Rectangular "ADD TO CART" Button matching reference */}
        <div className="mt-4">
          <button
            onClick={() => onAddToCart(product, 1)}
            className="w-full py-2.5 px-3 border border-[#121212] text-[#121212] hover:bg-[#121212] hover:text-white text-[11px] font-bold tracking-[0.15em] uppercase transition-all duration-200"
          >
            ADD TO CART
          </button>
        </div>
      </div>
    </div>
  );
}
