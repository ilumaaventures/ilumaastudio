import React, { useState } from "react";
import {
  Heart,
  ShoppingBag,
  Eye,
  Star,
  Check,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../../../redux/reducers/cartReducer";
import toast from "react-hot-toast";
import { isOutOfStock, getProductStock } from "../../../utils/stockUtils";
import { getProductImage } from "../../../utils/productImage";

export default function ProductCard({
  product,
  onSelect = null,
  onAddToCart = null,
  currency = "INR",
}) {
  const dispatch = useDispatch();
  const [selectedSize, setSelectedSize] = useState(
    product?.sizes?.[0] || "M"
  );
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  if (!product) return null;

  const outOfStock = isOutOfStock(product);
  const price = Number(product.price || 0);
  const compareAtPrice = Number(product.compareAtPrice || 0);
  const hasDiscount = compareAtPrice > price;
  const discountPercent = hasDiscount
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : 0;

  const availableSizes =
    product.sizes && Array.isArray(product.sizes) && product.sizes.length > 0
      ? product.sizes
      : ["XS", "S", "M", "L", "XL"];

  const imageUrl = getProductImage(product, product.image);

  const currencySymbol =
    currency === "USD" ? "$" : currency === "EUR" ? "€" : currency === "GBP" ? "£" : "₹";

  const handleAdd = (e) => {
    e?.stopPropagation();
    if (outOfStock) {
      toast.error(`Sorry, this piece is out of stock!`);
      return;
    }

    if (onAddToCart) {
      onAddToCart(product, selectedSize, 1);
    } else {
      const itemToAdd = { ...product, selectedSize };
      dispatch(addToCart({ product: itemToAdd, quantity: 1 }));
      toast.success(`${product.name} (Size: ${selectedSize}) added to bag!`, {
        icon: "🛍️",
      });
    }
  };

  const toggleWishlist = (e) => {
    e?.stopPropagation();
    setIsWishlisted(!isWishlisted);
    toast.success(
      !isWishlisted
        ? `${product.name} saved to private wishlist`
        : `Removed from wishlist`,
      { duration: 1800 }
    );
  };

  return (
    <div
      onClick={() => onSelect && onSelect(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col justify-between text-left cursor-pointer transition-all duration-300"
    >
      {/* 1. Image Thumbnail Stage */}
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200/70 shadow-xs group-hover:shadow-xl transition-all duration-500">
        <img
          src={imageUrl}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-700 ease-out"
        />

        {/* Subtle Vignette Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start z-10">
          {product.badge && (
            <span className="px-2.5 py-1 rounded-full bg-zinc-950/90 backdrop-blur-md text-white text-[9px] font-mono uppercase tracking-widest shadow-sm">
              {product.badge}
            </span>
          )}
          {hasDiscount && (
            <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-[9px] font-black uppercase tracking-wider shadow-sm">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={toggleWishlist}
          aria-label="Save to Wishlist"
          className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all shadow-sm z-10 ${
            isWishlisted
              ? "bg-rose-50 text-rose-600"
              : "bg-white/80 hover:bg-white text-zinc-600 hover:text-rose-500"
          }`}
        >
          <Heart
            size={16}
            className={isWishlisted ? "fill-rose-500 text-rose-500" : ""}
          />
        </button>

        {/* Size Selection Overlay (Revealed on Hover for rapid quick-order) */}
        <div className="absolute bottom-3 inset-x-3 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 flex flex-col gap-2">
          <div className="bg-white/95 backdrop-blur-md p-2 rounded-xl border border-zinc-200/80 shadow-lg space-y-1.5">
            <div className="flex items-center justify-between text-[10px] uppercase font-bold text-zinc-600 tracking-wider px-1">
              <span>Select Size</span>
              <span className="text-zinc-950 font-black">{selectedSize}</span>
            </div>
            <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none">
              {availableSizes.map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSize(sz);
                  }}
                  className={`flex-1 py-1 px-2 rounded-lg text-[10px] font-bold uppercase transition ${
                    selectedSize === sz
                      ? "bg-zinc-950 text-white shadow-xs"
                      : "bg-zinc-100 hover:bg-zinc-200 text-zinc-700"
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            disabled={outOfStock}
            className="w-full py-2.5 bg-zinc-950 hover:bg-zinc-800 disabled:bg-zinc-400 text-white rounded-xl text-[11px] font-bold uppercase tracking-widest transition flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-98"
          >
            <ShoppingBag size={14} />
            <span>{outOfStock ? "Out of Stock" : `Add to Bag • ${selectedSize}`}</span>
          </button>
        </div>

        {/* Sold Out Overlay */}
        {outOfStock && (
          <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-xs flex items-center justify-center z-20">
            <span className="px-4 py-1.5 rounded-full bg-zinc-900 text-white text-xs font-mono uppercase tracking-widest border border-zinc-700">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* 2. Editorial Description & Details */}
      <div className="pt-4 space-y-1.5">
        <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono uppercase tracking-wider">
          <span>{product.category?.name || product.category || "Atelier Collection"}</span>
          <span className="flex items-center gap-1 text-zinc-700 font-sans font-bold">
            <Star size={11} className="text-amber-500 fill-amber-500" />
            {product.rating || 4.9}
          </span>
        </div>

        <h3 className="text-base font-serif font-bold text-zinc-950 group-hover:text-zinc-600 transition-colors line-clamp-1 leading-snug">
          {product.name}
        </h3>

        <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed font-sans">
          {product.description || "Bespoke tailored luxury garment hand-finished in Italian virgin wool blend."}
        </p>

        {/* Pricing */}
        <div className="pt-1 flex items-baseline gap-2">
          <span className="text-lg font-black text-zinc-950 tracking-tight font-sans">
            {currencySymbol}{price.toLocaleString()}
          </span>
          {hasDiscount && (
            <span className="text-xs text-zinc-400 line-through font-sans">
              {currencySymbol}{compareAtPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
