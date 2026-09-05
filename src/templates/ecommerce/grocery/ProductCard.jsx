import React, { useState } from "react";
import {
  Plus,
  Minus,
  Star,
  Heart,
  Eye,
  Check,
  Leaf,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import {
  addToCart,
  updateCartQuantity,
  removeFromCart,
} from "../../../redux/reducers/cartReducer";
import toast from "react-hot-toast";
import { isOutOfStock, getProductStock } from "../../../utils/stockUtils";
import { getProductImage } from "../../../utils/productImage";

export default function ProductCard({
  product,
  layout = "grid", // "grid" | "list"
  onSelect = null,
  onAddToCart = null,
  onUpdateQuantity = null,
}) {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart?.cartItems || []);
  const [isWishlisted, setIsWishlisted] = useState(false);

  if (!product) return null;

  const productId = product._id || product.id;
  const cartItem = cartItems.find((i) => (i._id || i.id) === productId);
  const qtyInCart = cartItem ? cartItem.quantity : 0;

  const outOfStock = isOutOfStock(product);
  const stockCount = getProductStock(product);

  const price = Number(product.price || 0);
  const compareAtPrice = Number(product.compareAtPrice || 0);
  const hasDiscount = compareAtPrice > price;
  const discountPercent = hasDiscount
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : 0;
  const savings = hasDiscount ? (compareAtPrice - price).toFixed(2) : null;

  const imageUrl = getProductImage(product, product.image);

  // Detect organic / dietary attributes
  const isOrganic =
    product.isOrganic ||
    (product.badge && product.badge.toLowerCase().includes("organic")) ||
    (product.name && product.name.toLowerCase().includes("organic")) ||
    (product.description && product.description.toLowerCase().includes("organic"));

  const isRawOrFresh =
    (product.badge &&
      (product.badge.toLowerCase().includes("fresh") ||
        product.badge.toLowerCase().includes("raw"))) ||
    (product.description && product.description.toLowerCase().includes("fresh"));

  const handleAdd = (e) => {
    e?.stopPropagation();
    if (outOfStock) {
      toast.error(`Sorry, ${product.name} is currently out of stock!`);
      return;
    }
    if (onAddToCart) {
      onAddToCart(product, 1);
    } else {
      dispatch(addToCart({ product, quantity: 1 }));
      toast.success(`${product.name} added to cart! 🥦`);
    }
  };

  const handleQtyChange = (e, newQty) => {
    e?.stopPropagation();
    if (newQty <= 0) {
      if (onUpdateQuantity) {
        onUpdateQuantity(productId, 0);
      } else {
        dispatch(removeFromCart(productId));
      }
      toast.success(`${product.name} removed from cart`);
      return;
    }

    if (stockCount > 0 && newQty > stockCount) {
      toast.error(`Only ${stockCount} items available in stock!`);
      return;
    }

    if (onUpdateQuantity) {
      onUpdateQuantity(productId, newQty);
    } else {
      dispatch(updateCartQuantity({ productId, quantity: newQty }));
    }
  };

  const toggleWishlist = (e) => {
    e?.stopPropagation();
    setIsWishlisted(!isWishlisted);
    toast.success(
      !isWishlisted
        ? `${product.name} saved to Fresh Favorites! ❤️`
        : `Removed from favorites`,
      { duration: 1800 }
    );
  };

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(product);
    }
  };

  // ==========================================
  // LIST VIEW LAYOUT (Dense Aisle Scanning)
  // ==========================================
  if (layout === "list") {
    return (
      <div
        onClick={handleCardClick}
        className="group relative bg-white rounded-2xl border border-emerald-950/10 hover:border-emerald-500/40 p-3.5 sm:p-4 transition-all duration-300 shadow-xs hover:shadow-lg flex flex-col sm:flex-row items-start sm:items-center gap-4 cursor-pointer"
      >
        {/* Left: Thumbnail with badges */}
        <div className="relative w-full sm:w-36 h-36 sm:h-32 shrink-0 rounded-xl overflow-hidden bg-emerald-50/60 border border-slate-100 flex items-center justify-center">
          <img
            src={imageUrl}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Discount Pill */}
          {hasDiscount && (
            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-rose-600 text-white text-[9px] font-black tracking-wider uppercase shadow-xs">
              {discountPercent}% OFF
            </span>
          )}

          {/* Out of Stock Overlay */}
          {outOfStock && (
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center">
              <span className="px-2.5 py-1 rounded-md bg-rose-600 text-white text-[10px] font-black uppercase tracking-wider">
                Sold Out
              </span>
            </div>
          )}
        </div>

        {/* Middle: Product Details */}
        <div className="flex-1 min-w-0 space-y-1.5 text-left w-full">
          <div className="flex items-center gap-2 flex-wrap text-[11px] font-semibold">
            <span className="text-[#15803D] uppercase tracking-wider font-bold">
              {product.category || "Fresh Harvest"}
            </span>
            {isOrganic && (
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-emerald-50 text-[#15803D] border border-emerald-200 text-[10px] font-bold">
                <Leaf size={10} /> 100% Organic
              </span>
            )}
            {product.badge && !isOrganic && (
              <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold">
                {product.badge}
              </span>
            )}
          </div>

          <h3 className="text-base font-bold text-slate-900 group-hover:text-[#15803D] transition-colors line-clamp-1">
            {product.name}
          </h3>

          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {product.description || "Farm-fresh daily essential carefully hand-selected for optimal flavor and nutrient retention."}
          </p>

          <div className="flex items-center gap-3 pt-0.5 text-xs text-slate-500">
            <span className="font-medium text-slate-600">
              {product.unit || "per pack"}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-slate-700 font-semibold">
              <Star size={13} className="text-amber-400 fill-amber-400" />
              {product.rating || 4.9} ({product.reviewCount || 48})
            </span>
            {stockCount > 0 && stockCount <= 5 && (
              <>
                <span>•</span>
                <span className="text-amber-700 font-bold text-[11px] animate-pulse">
                  Only {stockCount} left!
                </span>
              </>
            )}
          </div>
        </div>

        {/* Right: Price & Quick Action */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
          <div className="text-left sm:text-right">
            <div className="flex items-baseline sm:justify-end gap-1.5">
              <span className="text-2xl font-black text-slate-900 tracking-tight">
                ₹{price.toFixed(2)}
              </span>
              {hasDiscount && (
                <span className="text-xs text-slate-400 line-through">
                  ₹{compareAtPrice.toFixed(2)}
                </span>
              )}
            </div>
            {savings && (
              <span className="text-[10px] text-emerald-700 font-bold block">
                Save ₹{savings}
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleWishlist}
              aria-label="Save to Wishlist"
              className={`p-2 rounded-xl border transition-colors ${
                isWishlisted
                  ? "bg-rose-50 text-rose-600 border-rose-200"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 border-slate-200"
              }`}
            >
              <Heart
                size={16}
                className={isWishlisted ? "fill-rose-500 text-rose-500" : ""}
              />
            </button>

            {outOfStock ? (
              <button
                disabled
                className="px-4 py-2 bg-slate-100 text-slate-400 text-xs font-bold rounded-xl cursor-not-allowed"
              >
                Unavailable
              </button>
            ) : qtyInCart > 0 ? (
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl p-1 shadow-xs">
                <button
                  type="button"
                  onClick={(e) => handleQtyChange(e, qtyInCart - 1)}
                  className="w-8 h-8 rounded-lg bg-white text-[#15803D] font-black flex items-center justify-center hover:bg-emerald-100 active:scale-95 transition"
                >
                  <Minus size={14} />
                </button>
                <span className="text-xs font-black text-[#15803D] min-w-[20px] text-center">
                  {qtyInCart}
                </span>
                <button
                  type="button"
                  onClick={(e) => handleQtyChange(e, qtyInCart + 1)}
                  className="w-8 h-8 rounded-lg bg-[#15803D] text-white font-black flex items-center justify-center hover:bg-emerald-800 active:scale-95 transition"
                >
                  <Plus size={14} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleAdd}
                className="px-5 py-2.5 bg-[#15803D] hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-sm hover:shadow flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Plus size={15} /> Add
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // GRID VIEW LAYOUT (Standard Storefront Card)
  // ==========================================
  return (
    <div
      onClick={handleCardClick}
      className="group relative bg-white rounded-3xl border border-slate-200/80 hover:border-emerald-500/50 p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 shadow-xs hover:shadow-xl cursor-pointer text-left"
    >
      {/* Upper Area: Image & Badges */}
      <div className="space-y-3.5">
        <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-emerald-50/50 relative border border-slate-100 flex items-center justify-center">
          <img
            src={imageUrl}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
          />

          {/* Top-Left Smart Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 items-start z-10">
            {hasDiscount && (
              <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
                {discountPercent}% OFF
              </span>
            )}
            {isOrganic && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-800/90 backdrop-blur-xs text-white text-[9px] font-bold uppercase tracking-wider shadow-sm">
                <Leaf size={10} className="text-emerald-300" /> Organic
              </span>
            )}
            {product.badge && !isOrganic && !hasDiscount && (
              <span className="px-2.5 py-0.5 rounded-full bg-[#15803D]/90 backdrop-blur-xs text-white text-[9px] font-bold uppercase tracking-wider shadow-sm">
                {product.badge}
              </span>
            )}
          </div>

          {/* Top-Right Favorite Button */}
          <button
            type="button"
            onClick={toggleWishlist}
            aria-label="Save to Wishlist"
            className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all shadow-xs z-10 ${
              isWishlisted
                ? "bg-rose-50 text-rose-600"
                : "bg-white/80 hover:bg-white text-slate-400 hover:text-rose-500"
            }`}
          >
            <Heart
              size={15}
              className={isWishlisted ? "fill-rose-500 text-rose-500" : ""}
            />
          </button>

          {/* Quick Preview Hover Pill */}
          <div className="absolute bottom-2.5 inset-x-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center z-10 pointer-events-none">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold tracking-wider uppercase shadow-md">
              <Eye size={12} /> Quick Inspect
            </span>
          </div>

          {/* Out of Stock Overlay */}
          {outOfStock && (
            <div className="absolute inset-0 bg-slate-900/65 backdrop-blur-xs flex items-center justify-center z-20">
              <span className="px-3.5 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-black uppercase tracking-wider shadow-lg">
                Sold Out
              </span>
            </div>
          )}
        </div>

        {/* Category & Ratings */}
        <div className="flex items-center justify-between text-[11px] font-bold pt-1">
          <span className="text-[#15803D] uppercase tracking-wider truncate mr-2">
            {product.category || "Fresh Harvest"}
          </span>
          <span className="text-slate-500 flex items-center gap-1 shrink-0">
            <Star size={13} className="text-amber-400 fill-amber-400" />
            {product.rating || 4.9} ({product.reviewCount || 36})
          </span>
        </div>

        {/* Title */}
        <h4 className="text-base font-bold text-slate-900 group-hover:text-[#15803D] transition-colors line-clamp-1 leading-tight">
          {product.name}
        </h4>

        {/* Description snippet */}
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
          {product.description || "Farm-direct organic crop handpicked at peak freshness for pristine taste and health benefits."}
        </p>

        {/* Unit & Stock Warning */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
          <span className="font-medium bg-slate-100/80 px-2 py-0.5 rounded-md text-slate-600">
            {product.unit || "1 pack"}
          </span>
          {stockCount > 0 && stockCount <= 5 ? (
            <span className="text-amber-700 font-bold text-[10px] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
              Only {stockCount} left
            </span>
          ) : (
            <span className="text-emerald-700 font-semibold text-[10px] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              In Stock
            </span>
          )}
        </div>
      </div>

      {/* Bottom Area: Pricing & Quantity Stepper */}
      <div className="pt-4 mt-4 flex items-center justify-between border-t border-slate-100">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-black text-slate-900">
              ₹{price.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-slate-400 line-through">
                ₹{compareAtPrice.toFixed(2)}
              </span>
            )}
          </div>
          {savings && (
            <span className="text-[10px] text-emerald-700 font-bold block">
              Save ₹{savings}
            </span>
          )}
        </div>

        {/* Action Button / Stepper */}
        {outOfStock ? (
          <button
            disabled
            className="px-3.5 py-1.5 bg-slate-100 text-slate-400 text-xs font-bold rounded-xl cursor-not-allowed"
          >
            Sold Out
          </button>
        ) : qtyInCart > 0 ? (
          <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-xl p-1 shadow-2xs">
            <button
              type="button"
              onClick={(e) => handleQtyChange(e, qtyInCart - 1)}
              aria-label="Decrease quantity"
              className="w-7 h-7 rounded-lg bg-white text-[#15803D] font-black flex items-center justify-center hover:bg-emerald-100 active:scale-95 transition cursor-pointer"
            >
              <Minus size={13} />
            </button>
            <span className="text-xs font-black text-[#15803D] px-1 min-w-[18px] text-center">
              {qtyInCart}
            </span>
            <button
              type="button"
              onClick={(e) => handleQtyChange(e, qtyInCart + 1)}
              aria-label="Increase quantity"
              className="w-7 h-7 rounded-lg bg-[#15803D] text-white font-black flex items-center justify-center hover:bg-emerald-800 active:scale-95 transition cursor-pointer"
            >
              <Plus size={13} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleAdd}
            className="px-4 py-2 bg-[#15803D] hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-xs hover:shadow flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Plus size={14} /> Add
          </button>
        )}
      </div>
    </div>
  );
}
