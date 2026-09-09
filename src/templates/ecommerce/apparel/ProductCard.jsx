import React, { useState } from "react";
import { Heart, Plus, Check } from "lucide-react";
import { isOutOfStock } from "../../../utils/stockUtils";
import { getProductImage } from "../../../utils/productImage";

export default function ProductCard({
  product,
  onSelectProduct,
  onAddToCart,
  onToggleWishlist,
  isWishlisted = false,
  currency = "₹",
}) {
  const [isAdding, setIsAdding] = useState(false);

  if (!product) return null;

  const outOfStock = isOutOfStock(product);
  const price = Number(product.price) || 0;
  const currencySymbol = product.currency || currency || "₹";

  const handleAdd = (e) => {
    e.stopPropagation();
    if (outOfStock) return;
    setIsAdding(true);
    if (onAddToCart) {
      onAddToCart(product, 1);
    }
    setTimeout(() => setIsAdding(false), 700);
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    if (onToggleWishlist) {
      onToggleWishlist(product);
    }
  };

  return (
    <div
      onClick={() => onSelectProduct && onSelectProduct(product)}
      className="group flex flex-col justify-between bg-white text-left cursor-pointer select-none space-y-2.5 transition-transform duration-200"
    >
      {/* ================= 1. MODEL IMAGE CONTAINER ================= */}
      <div className="relative w-full aspect-[3/4] bg-[#F2ECE4] overflow-hidden rounded-xs border border-transparent group-hover:border-stone-300 transition-colors">
        <img
          src={getProductImage(product, product.image)}
          alt={product.name}
          className="w-full h-full object-cover object-top group-hover:scale-[1.03] transition-transform duration-500"
          loading="lazy"
        />

        {/* Floating Circular Heart Wishlist Button on Bottom Right */}
        <button
          type="button"
          onClick={handleWishlist}
          title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
          className={`absolute bottom-2.5 right-2.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center backdrop-blur-xs transition-all duration-200 shadow-xs cursor-pointer ${
            isWishlisted
              ? "bg-rose-500 text-white shadow-md scale-105"
              : "bg-white/80 text-stone-700 hover:bg-white hover:text-black"
          }`}
        >
          <Heart
            size={14}
            className={isWishlisted ? "fill-white text-white" : "text-stone-700"}
          />
        </button>
      </div>

      {/* ================= 2. TITLE & PRICE ================= */}
      <div className="space-y-0.5 pt-0.5">
        <h3
          className="text-xs sm:text-[13px] font-normal text-stone-900 line-clamp-1 leading-snug group-hover:text-[#8B5A2B] transition-colors"
          title={product.name}
        >
          {product.name}
        </h3>
        <p className="text-xs sm:text-[13px] font-semibold text-stone-800">
          {currencySymbol} {price}
        </p>
      </div>

      {/* ================= 3. OUTLINE "+ ADD" BUTTON ================= */}
      <div className="pt-1">
        <button
          type="button"
          onClick={handleAdd}
          disabled={outOfStock}
          className={`w-full py-1.5 px-3 rounded-none text-xs font-medium tracking-wider uppercase transition-all duration-200 cursor-pointer flex items-center justify-center gap-1 border ${
            outOfStock
              ? "border-stone-200 text-stone-400 bg-stone-50 cursor-not-allowed"
              : isAdding
                ? "border-[#8B5A2B] bg-[#8B5A2B] text-white"
                : "border-[#8B5A2B] text-[#8B5A2B] hover:bg-[#8B5A2B] hover:text-white"
          }`}
        >
          {isAdding ? (
            <>
              <Check size={12} />
              <span>ADDED</span>
            </>
          ) : (
            <>
              <Plus size={12} />
              <span>ADD</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
