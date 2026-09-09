import React, { useState } from "react";
import { Heart, Check, Plus } from "lucide-react";
import { isOutOfStock } from "../../../utils/stockUtils";
import { getProductImage } from "../../../utils/productImage";

export default function ProductCard({
  product,
  onSelect = null,
  onAddToCart = null,
  isWishlisted = false,
  onToggleWishlist = null,
}) {
  const [selectedSize, setSelectedSize] = useState(
    product?.sizes?.[0] || "M"
  );
  const [isAdding, setIsAdding] = useState(false);
  const [showSizePopup, setShowSizePopup] = useState(false);

  if (!product) return null;

  const outOfStock = isOutOfStock(product);
  const price = Number(product.price || 0);

  const availableSizes =
    product.sizes && Array.isArray(product.sizes) && product.sizes.length > 0
      ? product.sizes
      : ["S", "M", "L", "XL"];

  const imageUrl = getProductImage(product, product.image);

  const handleAddClick = (e) => {
    e?.stopPropagation();
    if (outOfStock) return;

    if (availableSizes.length > 1 && !showSizePopup) {
      setShowSizePopup(true);
      return;
    }

    commitAddToCart(selectedSize);
  };

  const commitAddToCart = (size) => {
    setIsAdding(true);
    if (onAddToCart) {
      onAddToCart(product, size, 1);
    }
    setShowSizePopup(false);
    setTimeout(() => setIsAdding(false), 900);
  };

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(product);
    }
  };

  const handleHeartClick = (e) => {
    e?.stopPropagation();
    if (onToggleWishlist) {
      onToggleWishlist(product);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="group flex flex-col justify-between bg-transparent cursor-pointer select-none text-left"
    >
      <div className="space-y-2">
        {/* ================= 1. MODEL PORTRAIT IMAGE ================= */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F5EFEA] rounded-xs">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          {/* Bottom-Right Wishlist Heart Button (Reference Match) */}
          <button
            type="button"
            onClick={handleHeartClick}
            title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
            className="absolute bottom-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-stone-600 hover:text-rose-600 flex items-center justify-center shadow-xs transition-transform active:scale-90 cursor-pointer"
          >
            <Heart
              size={14}
              className={`transition-colors ${
                isWishlisted
                  ? "fill-rose-500 text-rose-500"
                  : "text-stone-600 hover:text-rose-500"
              }`}
            />
          </button>

          {/* Quick Size Popup Overlay on Add */}
          {showSizePopup && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute inset-x-2 bottom-2 bg-white/95 backdrop-blur-xs p-2.5 rounded-xs shadow-lg border border-stone-200 animate-in fade-in slide-in-from-bottom-2 duration-150 z-20 space-y-1.5"
            >
              <div className="flex items-center justify-between text-[10px] text-stone-500 font-medium">
                <span>Select Size</span>
                <button
                  onClick={() => setShowSizePopup(false)}
                  className="text-stone-400 hover:text-black"
                >
                  ✕
                </button>
              </div>
              <div className="grid grid-cols-4 gap-1">
                {availableSizes.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => {
                      setSelectedSize(sz);
                      commitAddToCart(sz);
                    }}
                    className={`py-1 text-center text-[10px] font-bold uppercase rounded-xs transition ${
                      selectedSize === sz
                        ? "bg-[#936437] text-white"
                        : "bg-stone-100 hover:bg-stone-200 text-stone-800"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ================= 2. TITLE & PRICE ================= */}
        <div className="space-y-0.5 pt-1">
          <h3
            className="text-xs font-normal text-[#222222] truncate group-hover:text-[#936437] transition-colors"
            title={product.name}
          >
            {product.name}
          </h3>
          <p className="text-xs font-semibold text-[#111111]">
            ₹ {price}
          </p>
        </div>
      </div>

      {/* ================= 3. + ADD + BUTTON (REFERENCE MATCH) ================= */}
      <div className="pt-2">
        <button
          type="button"
          onClick={handleAddClick}
          disabled={outOfStock}
          className={`w-fit min-w-[76px] py-1 px-3 border rounded-none text-[10px] sm:text-[11px] font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-1 cursor-pointer active:scale-95 ${
            outOfStock
              ? "border-stone-300 text-stone-400 cursor-not-allowed"
              : isAdding
                ? "border-[#2D5A27] bg-[#2D5A27] text-white"
                : "border-[#936437] text-[#936437] hover:bg-[#936437] hover:text-white"
          }`}
        >
          {isAdding ? (
            <>
              <Check size={11} />
              <span>ADDED</span>
            </>
          ) : (
            <span>+ ADD +</span>
          )}
        </button>
      </div>
    </div>
  );
}
