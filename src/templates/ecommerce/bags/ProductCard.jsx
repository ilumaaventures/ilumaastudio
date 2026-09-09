import React, { useState } from "react";
import {
  Star,
  Eye,
  Heart,
  ShoppingBag,
  Check,
} from "lucide-react";
import { isOutOfStock } from "../../../utils/stockUtils";
import { getProductImage } from "../../../utils/productImage";

export default function ProductCard({
  product,
  onSelectProduct = () => {},
  onAddToCart = () => {},
  onQuickView = null,
}) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  if (!product) return null;

  const outOfStock = isOutOfStock(product);
  const price = Number(product.price) || 38.99;
  const compareAtPrice = product.compareAtPrice ? Number(product.compareAtPrice) : 42.0;
  const imageSrc = getProductImage(product, product.image);

  const handleAdd = (e) => {
    e.stopPropagation();
    if (outOfStock) return;
    setIsAdding(true);
    onAddToCart(product, 1);
    setTimeout(() => setIsAdding(false), 800);
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const handleQuickView = (e) => {
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(product);
    } else {
      onSelectProduct(product);
    }
  };

  return (
    <div
      onClick={() => onSelectProduct && onSelectProduct(product)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative bg-white flex flex-col justify-between p-3 sm:p-4 text-center cursor-pointer transition-all duration-300"
    >
      {/* Top Bar: Circular Solid Black SALE Badge & Wishlist */}
      <div className="flex items-start justify-between z-10 w-full mb-2">
        {/* Solid Circular Black SALE Badge (matches screenshot) */}
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-[10px] sm:text-[11px] uppercase tracking-wider shadow-sm">
          SALE
        </div>

        {/* Quick Actions (Wishlist / Quick View) */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleQuickView}
            title="Quick View"
            className={`p-1.5 rounded-full transition cursor-pointer ${
              hovered ? "opacity-100 bg-slate-100 text-slate-700 hover:bg-slate-200" : "opacity-0"
            }`}
          >
            <Eye size={13} />
          </button>
          <button
            type="button"
            onClick={handleWishlist}
            title="Wishlist"
            className={`p-1.5 rounded-full transition cursor-pointer ${
              isWishlisted
                ? "bg-rose-50 text-rose-600"
                : "text-slate-300 hover:text-rose-500 hover:bg-slate-50"
            }`}
          >
            <Heart size={14} className={isWishlisted ? "fill-rose-600 text-rose-600" : ""} />
          </button>
        </div>
      </div>

      {/* Bag Center Visual Stage */}
      <div className="relative aspect-square w-full flex items-center justify-center p-3 my-1 overflow-hidden">
        <img
          src={imageSrc}
          alt={product.name}
          className="max-h-[170px] sm:max-h-[190px] w-auto object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
      </div>

      {/* Bag Details (All-caps title, Strikethrough price, In Stock, Rating) */}
      <div className="space-y-1.5 pt-2">
        {/* Title: All-Caps with elegant tracking */}
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider truncate hover:text-[#A0522D] transition">
          {product.name || "CORIN LEATHER BACK PACK"}
        </h3>

        {/* Price: Strikethrough original + sale price */}
        <div className="flex items-center justify-center gap-2 text-xs">
          {compareAtPrice && compareAtPrice > price && (
            <span className="text-slate-400 line-through">
              ${compareAtPrice.toFixed(2)}
            </span>
          )}
          <span className="font-bold text-slate-900">
            ${price.toFixed(2)}
          </span>
        </div>

        {/* In Stock status */}
        <div className="text-[11px] text-slate-500 font-medium italic">
          {outOfStock ? "Out of Stock" : "In Stock."}
        </div>

        {/* Rating Stars: ★★★★★ (0) */}
        <div className="flex items-center justify-center gap-1 text-slate-300 text-[11px]">
          <div className="flex text-slate-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={10}
                className={i < Math.floor(product.rating || 5) ? "fill-slate-400 text-slate-400" : "text-slate-200"}
              />
            ))}
          </div>
          <span className="text-[10px] text-slate-400">
            ({product.reviewCount || 0})
          </span>
        </div>

        {/* Warm Saddle / Cognac Leather ADD TO CART Button (Matches Screenshot) */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleAdd}
            disabled={outOfStock}
            className={`w-full py-2.5 rounded-sm font-black text-xs uppercase tracking-widest transition-all duration-200 shadow-sm cursor-pointer ${
              outOfStock
                ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                : isAdding
                ? "bg-emerald-700 text-white"
                : "bg-[#A0522D] hover:bg-[#8B4513] text-white active:scale-98"
            }`}
          >
            {isAdding ? "ADDED TO CART" : "ADD TO CART"}
          </button>
        </div>
      </div>
    </div>
  );
}
