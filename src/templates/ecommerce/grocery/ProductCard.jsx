import React, { memo, useCallback, useMemo, useState } from "react";
import {
  Heart,
  Leaf,
  Minus,
  Plus,
  ShoppingCart,
  Star,
  Eye,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import {
  addToCart,
  removeFromCart,
  updateCartQuantity,
} from "../../../redux/reducers/cartReducer";

import {
  getProductStock,
  isOutOfStock,
} from "../../../utils/stockUtils";

import { getProductImage } from "../../../utils/productImage";

const BRAND_GREEN = "#15803D";

/* =========================================================
   PRODUCT CARD
========================================================= */

function ProductCard({
  product,
  layout = "grid",
  onSelect,
  onAddToCart,
  onUpdateQuantity,
}) {
  const dispatch = useDispatch();

  const cartItems = useSelector(
    (state) => state.cart?.cartItems || []
  );

  const [isWishlisted, setIsWishlisted] = useState(false);

  /* =========================================================
     SAFETY
  ========================================================= */

  if (!product) return null;

  /* =========================================================
     PRODUCT DATA
  ========================================================= */

  const productId = product._id || product.id;

  const cartItem = useMemo(
    () =>
      cartItems.find(
        (item) => (item._id || item.id) === productId
      ),
    [cartItems, productId]
  );

  const quantity = cartItem?.quantity || 0;

  const stockCount = getProductStock(product);
  const outOfStock = isOutOfStock(product);

  const price = Number(product.price || 0);
  const compareAtPrice = Number(product.compareAtPrice || 0);

  const hasDiscount = compareAtPrice > price;

  const discountPercent = hasDiscount
    ? Math.round(
      ((compareAtPrice - price) / compareAtPrice) * 100
    )
    : 0;

  const savings = hasDiscount
    ? compareAtPrice - price
    : 0;

  const imageUrl = getProductImage(
    product,
    product.image
  );

  /* =========================================================
     PRODUCT ATTRIBUTES
  ========================================================= */

  const productText = useMemo(
    () =>
      [
        product.name,
        product.description,
        product.badge,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase(),
    [product]
  );

  const isOrganic =
    Boolean(product.isOrganic) ||
    productText.includes("organic");

  const category =
    product.category || "Fresh Harvest";

  const unit =
    product.unit || "1 pack";

  const rating =
    Number(product.rating) || 4.9;

  const reviewCount =
    Number(product.reviewCount) || 36;

  /* =========================================================
     HANDLERS
  ========================================================= */

  const handleCardSelect = useCallback(() => {
    onSelect?.(product);
  }, [onSelect, product]);

  const handleCardKeyDown = useCallback(
    (event) => {
      if (
        event.key === "Enter" ||
        event.key === " "
      ) {
        event.preventDefault();
        handleCardSelect();
      }
    },
    [handleCardSelect]
  );

  const handleAdd = useCallback(
    (event) => {
      event?.stopPropagation();

      if (outOfStock) {
        toast.error(
          `${product.name} is currently out of stock.`
        );
        return;
      }

      if (onAddToCart) {
        onAddToCart(product, 1);
        return;
      }

      dispatch(
        addToCart({
          product,
          quantity: 1,
        })
      );

      toast.success(
        `${product.name} added to cart`
      );
    },
    [
      dispatch,
      onAddToCart,
      outOfStock,
      product,
    ]
  );

  const handleQuantityChange = useCallback(
    (event, nextQuantity) => {
      event?.stopPropagation();

      if (nextQuantity <= 0) {
        if (onUpdateQuantity) {
          onUpdateQuantity(productId, 0);
        } else {
          dispatch(
            removeFromCart(productId)
          );
        }

        return;
      }

      if (
        stockCount > 0 &&
        nextQuantity > stockCount
      ) {
        toast.error(
          `Only ${stockCount} items available.`
        );
        return;
      }

      if (onUpdateQuantity) {
        onUpdateQuantity(
          productId,
          nextQuantity
        );
      } else {
        dispatch(
          updateCartQuantity({
            productId,
            quantity: nextQuantity,
          })
        );
      }
    },
    [
      dispatch,
      onUpdateQuantity,
      productId,
      stockCount,
    ]
  );

  const handleWishlist = useCallback(
    (event) => {
      event?.stopPropagation();

      setIsWishlisted((previous) => {
        const next = !previous;

        toast.success(
          next
            ? "Added to favorites"
            : "Removed from favorites",
          {
            duration: 1600,
          }
        );

        return next;
      });
    },
    []
  );

  /* =========================================================
     SHARED UI
  ========================================================= */

  const ProductBadges = () => (
    <div className="absolute left-3 top-3 z-10 flex flex-col items-start gap-1.5">
      {hasDiscount && (
        <span className="rounded-full bg-rose-600 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-white shadow-sm">
          {discountPercent}% OFF
        </span>
      )}

      {isOrganic && (
        <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold text-emerald-800 shadow-sm backdrop-blur">
          <Leaf size={11} />
          Organic
        </span>
      )}

      {!isOrganic &&
        !hasDiscount &&
        product.badge && (
          <span className="rounded-full bg-emerald-800/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm backdrop-blur">
            {product.badge}
          </span>
        )}
    </div>
  );

  const WishlistButton = () => (
    <button
      type="button"
      onClick={handleWishlist}
      aria-label={
        isWishlisted
          ? "Remove from wishlist"
          : "Add to wishlist"
      }
      className={[
        "absolute right-3 top-3 z-20",
        "flex h-9 w-9 items-center justify-center",
        "rounded-full border",
        "backdrop-blur-md",
        "transition-all duration-200",
        "active:scale-95",
        isWishlisted
          ? "border-rose-200 bg-rose-50 text-rose-600"
          : "border-white/70 bg-white/90 text-slate-400 hover:border-rose-200 hover:bg-white hover:text-rose-500",
      ].join(" ")}
    >
      <Heart
        size={16}
        className={
          isWishlisted
            ? "fill-current"
            : ""
        }
      />
    </button>
  );

  const StockIndicator = () => {
    if (outOfStock) {
      return (
        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-rose-600">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
          Out of stock
        </span>
      );
    }

    if (
      stockCount > 0 &&
      stockCount <= 5
    ) {
      return (
        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-amber-700">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          Only {stockCount} left
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-emerald-700">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        In stock
      </span>
    );
  };

  const QuantityControl = ({
    compact = false,
  }) => {
    if (outOfStock) {
      return (
        <button
          type="button"
          disabled
          className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-400"
        >
          Sold Out
        </button>
      );
    }

    if (quantity > 0) {
      return (
        <div
          className={[
            "flex items-center",
            "rounded-xl border border-emerald-200",
            "bg-emerald-50 p-1",
            compact
              ? "gap-1"
              : "gap-1.5",
          ].join(" ")}
        >
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={(event) =>
              handleQuantityChange(
                event,
                quantity - 1
              )
            }
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-emerald-700 transition hover:bg-emerald-100 active:scale-95"
          >
            <Minus size={14} />
          </button>

          <span className="min-w-6 text-center text-xs font-extrabold text-emerald-800">
            {quantity}
          </span>

          <button
            type="button"
            aria-label="Increase quantity"
            onClick={(event) =>
              handleQuantityChange(
                event,
                quantity + 1
              )
            }
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-700 text-white transition hover:bg-emerald-800 active:scale-95"
          >
            <Plus size={14} />
          </button>
        </div>
      );
    }

    return (
      <button
        type="button"
        onClick={handleAdd}
        className={[
          "inline-flex items-center justify-center gap-1.5",
          "rounded-xl bg-emerald-700",
          "font-bold text-white",
          "shadow-sm",
          "transition-all duration-200",
          "hover:bg-emerald-800 hover:shadow-md",
          "active:scale-95",
          compact
            ? "px-3.5 py-2 text-xs"
            : "px-4 py-2.5 text-xs",
        ].join(" ")}
      >
        <ShoppingCart size={14} />
        Add
      </button>
    );
  };

  /* =========================================================
     LIST VIEW
  ========================================================= */

  if (layout === "list") {
    return (
      <article
        role={onSelect ? "button" : undefined}
        tabIndex={onSelect ? 0 : undefined}
        onClick={handleCardSelect}
        onKeyDown={handleCardKeyDown}
        className={[
          "group relative flex w-full",
          "flex-col gap-4 rounded-2xl",
          "border border-slate-200 bg-white p-4",
          "transition-all duration-300",
          "hover:border-emerald-300",
          "hover:shadow-lg",
          "sm:flex-row sm:items-center",
          onSelect
            ? "cursor-pointer"
            : "",
        ].join(" ")}
      >
        {/* Image */}
        <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-xl bg-emerald-50 sm:h-32 sm:w-36">
          <img
            src={imageUrl}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          <ProductBadges />

          {outOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm">
              <span className="rounded-lg bg-rose-600 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wide text-white">
                Sold Out
              </span>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">
              {category}
            </span>

            {isOrganic && (
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-700">
                <Leaf size={10} />
                Organic
              </span>
            )}
          </div>

          <h3 className="line-clamp-1 text-base font-bold text-slate-900 transition-colors group-hover:text-emerald-700">
            {product.name}
          </h3>

          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">
            {product.description ||
              "Fresh quality grocery carefully selected for everyday needs."}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-3">
            <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600">
              {unit}
            </span>

            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600">
              <Star
                size={13}
                className="fill-amber-400 text-amber-400"
              />
              {rating.toFixed(1)}
              <span className="text-slate-400">
                ({reviewCount})
              </span>
            </span>

            <StockIndicator />
          </div>
        </div>

        {/* Price / Actions */}
        <div className="flex w-full shrink-0 items-center justify-between gap-3 border-t border-slate-100 pt-3 sm:w-auto sm:flex-col sm:items-end sm:border-t-0 sm:pt-0">
          <div className="text-left sm:text-right">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-extrabold tracking-tight text-slate-950">
                ₹{price.toFixed(2)}
              </span>

              {hasDiscount && (
                <span className="text-xs text-slate-400 line-through">
                  ₹{compareAtPrice.toFixed(2)}
                </span>
              )}
            </div>

            {hasDiscount && (
              <p className="text-[10px] font-bold text-emerald-700">
                Save ₹{savings.toFixed(2)}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleWishlist}
              aria-label="Add to wishlist"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 transition hover:border-rose-200 hover:text-rose-500"
            >
              <Heart
                size={16}
                className={
                  isWishlisted
                    ? "fill-rose-500 text-rose-500"
                    : ""
                }
              />
            </button>

            <QuantityControl compact />
          </div>
        </div>
      </article>
    );
  }

  /* =========================================================
     GRID VIEW
  ========================================================= */

  return (
    <article
      role={onSelect ? "button" : undefined}
      tabIndex={onSelect ? 0 : undefined}
      onClick={handleCardSelect}
      onKeyDown={handleCardKeyDown}
      className={[
        "group relative flex h-full flex-col",
        "rounded-2xl border border-slate-200",
        "bg-white p-3.5",
        "transition-all duration-300",
        "hover:-translate-y-0.5",
        "hover:border-emerald-300",
        "hover:shadow-xl",
        onSelect
          ? "cursor-pointer"
          : "",
      ].join(" ")}
    >
      {/* ===============================================
          IMAGE
      =============================================== */}

      <div className="relative aspect-square overflow-hidden rounded-xl bg-emerald-50">
        <img
          src={imageUrl}
          alt={product.name}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <ProductBadges />

        <WishlistButton />

        {/* Quick View */}
        <div className="pointer-events-none absolute inset-x-3 bottom-3 flex justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-950/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur-md">
            <Eye size={12} />
            Quick view
          </span>
        </div>

        {/* Out Of Stock */}
        {outOfStock && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm">
            <span className="rounded-lg bg-rose-600 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wide text-white shadow-lg">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* ===============================================
          PRODUCT INFO
      =============================================== */}

      <div className="flex flex-1 flex-col pt-3">
        {/* Category / Rating */}
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">
            {category}
          </span>

          <span className="inline-flex shrink-0 items-center gap-1 text-[10px] font-semibold text-slate-500">
            <Star
              size={12}
              className="fill-amber-400 text-amber-400"
            />
            {rating.toFixed(1)}
          </span>
        </div>

        {/* Name */}
        <h3 className="mt-1.5 line-clamp-2 min-h-[40px] text-sm font-bold leading-5 text-slate-900 transition-colors group-hover:text-emerald-700">
          {product.name}
        </h3>

        {/* Description */}
        <p className="mt-1 line-clamp-2 min-h-[32px] text-[11px] leading-4 text-slate-500">
          {product.description ||
            "Fresh quality grocery carefully selected for everyday needs."}
        </p>

        {/* Unit / Stock */}
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600">
            {unit}
          </span>

          <StockIndicator />
        </div>

        {/* =============================================
            PRICE / ACTION
        ============================================= */}

        <div className="mt-auto border-t border-slate-100 pt-3">
          <div className="flex items-end justify-between gap-2">
            {/* Price */}
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-extrabold tracking-tight text-slate-950">
                  ₹{price.toFixed(2)}
                </span>

                {hasDiscount && (
                  <span className="text-[10px] text-slate-400 line-through">
                    ₹{compareAtPrice.toFixed(2)}
                  </span>
                )}
              </div>

              {hasDiscount && (
                <span className="text-[10px] font-bold text-emerald-700">
                  Save ₹{savings.toFixed(2)}
                </span>
              )}
            </div>

            {/* Cart */}
            <QuantityControl compact />
          </div>
        </div>
      </div>
    </article>
  );
}

export default memo(ProductCard);