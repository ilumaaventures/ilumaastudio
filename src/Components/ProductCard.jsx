import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Heart,
  ShoppingCart,
  Star,
  Eye,
  BadgeCheck,
  Coins,
  Sparkles,
  ShoppingBag,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/reducers/cartReducer";
import { toggleWishlist } from "../redux/reducers/wishlistReducer";
import { toggleCompare } from "../redux/reducers/compareReducer";
import toast from "react-hot-toast";
import { Scale, Share2, Check } from "lucide-react";
/**
 * Universal ProductCard Component for ILumaaStudio
 * Consistent, premium, and feature-rich light theme card used across all pages & sections.
 */
export default function ProductCard({
  product,
  className = "",
  isCarousel = false,
  customLink = null,
  showWishlist = true,
  showAddToCart = true,
  onAddToCartSuccess = null,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wishlistItems = useSelector((s) => s.wishlist?.items || []);
  const compareItems = useSelector((s) => s.compare?.items || []);
  const cartItems = useSelector(
    (s) => s.cart?.cartItems || s.cart?.items || [],
  );

  if (!product) return null;

  const prodId = product._id || product.id || product.productId;

  // Check compare state
  const isCompared = compareItems.some(
    (i) => String(i.id || i._id) === String(prodId),
  );

  // Check wishlist state
  const isWished = wishlistItems.some(
    (i) => (i._id || i.id || i) === prodId || String(i) === String(prodId),
  );

  // Check cart state
  const isInCart = cartItems.some(
    (i) =>
      String(i._id || i.id || i.product?._id || i.product) === String(prodId),
  );

  // Normalize image
  const imageUrl =
    product.images?.[0]?.url ||
    product.images?.[0] ||
    product.image?.url ||
    product.image ||
    product.featuredImage?.url ||
    product.featuredImage ||
    product.thumbnail?.url ||
    product.thumbnail ||
    (Array.isArray(product.photos) && product.photos[0]) ||
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80";

  // Normalize Category Name
  const categoryName =
    typeof product.category === "object"
      ? product.category?.name || product.category?.title || "General"
      : product.category || product.categoryName || "General";

  // Normalize Name
  const productName = product.name || product.title || "Product";
  const businessName = product.business?.businessName || product.business?.name;
  // Normalize Prices
  const rawPrice = Number(product.price) || 0;
  const rawOriginalPrice =
    Number(product.originalPrice) ||
    Number(product.compareAtPrice) ||
    (product.mrp ? Number(product.mrp) : 0) ||
    (product.discountPercent
      ? Math.round(rawPrice / (1 - product.discountPercent / 100))
      : 0);

  const displayPrice = rawPrice;
  const displayOriginalPrice =
    rawOriginalPrice > rawPrice ? rawOriginalPrice : null;

  // Calculate discount
  const discountPercent =
    product.discountPercent !== undefined
      ? Number(product.discountPercent)
      : displayOriginalPrice && displayOriginalPrice > displayPrice
        ? Math.round(
            ((displayOriginalPrice - displayPrice) / displayOriginalPrice) *
              100,
          )
        : 0;

  // Normalize Rating and Reviews
  const ratingValue = Number(product.rating || product.ratings || 4.8).toFixed(
    1,
  );
  const reviewsCount = Array.isArray(product.reviews)
    ? product.reviews.length
    : typeof product.reviews === "number"
      ? product.reviews
      : product.numReviews || product.reviewsCount || 124;

  // Stock status
  const inStock = (() => {
    if (product.inStock !== undefined) return Boolean(product.inStock);
    if (product.isOutOfStock !== undefined) return !product.isOutOfStock;
    if (
      product.hasVariants &&
      Array.isArray(product.variants) &&
      product.variants.length > 0
    ) {
      return product.variants.some((v) => {
        const vStock =
          v.stockQuantity !== undefined
            ? Number(v.stockQuantity)
            : Number(v.stock || 0);
        return vStock > 0;
      });
    }
    const s =
      product.inventory?.stockQuantity !== undefined
        ? Number(product.inventory.stockQuantity)
        : product.stockQuantity !== undefined
          ? Number(product.stockQuantity)
          : product.stock !== undefined
            ? Number(product.stock)
            : product.countInStock !== undefined
              ? Number(product.countInStock)
              : 1;
    return s > 0;
  })();

  // Top Badge (e.g. Featured, Best Seller, New, Flash Deal)
  const badgeLabel =
    product.badge ||
    (product.isFeatured ? "Featured" : null) ||
    (product.isBestSeller ? "Best Seller" : null) ||
    (product.isNewArrival ? "New" : null);

  const targetLink = customLink || `/products/${prodId}`;

  const handleCardClick = () => {
    if (targetLink) {
      navigate(targetLink);
    }
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(
      toggleWishlist({
        _id: prodId,
        id: prodId,
        name: productName,
        price: displayPrice,
        originalPrice: displayOriginalPrice,
        image: imageUrl,
        category: categoryName,
        rating: ratingValue,
        inStock,
      }),
    );
    if (isWished) {
      toast.success("Removed from Wishlist");
    } else {
      toast.success("Added to Wishlist!");
    }
  };

  const [copiedLink, setCopiedLink] = useState(false);

  const handleShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const relativePath = targetLink.startsWith("/")
      ? targetLink
      : `/${targetLink}`;
    const fullUrl = `${window.location.origin}${relativePath}`;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(fullUrl);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = fullUrl;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }

      setCopiedLink(true);
      toast.success(`Copied link: ${productName}`);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
      toast.error("Failed to copy link to clipboard");
    }
  };

  const handleAddToCart = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!inStock) {
      toast.error(`Sorry, ${productName} is currently out of stock!`);
      return;
    }

    if (isInCart) {
      toast.success(`${productName} is already in your cart!`, {
        icon: "🛒",
      });
      return;
    }

    const defaultVariant =
      product.hasVariants &&
      Array.isArray(product.variants) &&
      product.variants.length > 0
        ? product.variants[0]
        : null;

    const effectivePrice =
      defaultVariant &&
      !isNaN(Number(defaultVariant.price)) &&
      Number(defaultVariant.price) > 0
        ? Number(defaultVariant.price)
        : displayPrice;

    const categoryTax =
      typeof product.category === "object" &&
      product.category?.tax !== undefined &&
      product.category?.tax !== null
        ? Number(product.category.tax)
        : product.categoryTax !== undefined && product.categoryTax !== null
          ? Number(product.categoryTax)
          : product.tax !== undefined && product.tax !== null
            ? Number(product.tax)
            : 0;

    dispatch(
      addToCart({
        product: {
          _id: prodId,
          id: prodId,
          name: productName,
          price: effectivePrice,
          originalPrice: displayOriginalPrice,
          image: imageUrl,
          category: product.category || categoryName,
          categoryTax: categoryTax,
          sku: product.sku || defaultVariant?.sku,
          variantId: defaultVariant ? defaultVariant._id : null,
          selectedOptions: defaultVariant ? defaultVariant.optionValues : null,
        },
        quantity: 1,
      }),
    );

    toast.success(`${productName} added to cart!`);
    if (onAddToCartSuccess) onAddToCartSuccess(product);
  };

  // Base sizing container classes
  const containerClasses = isCarousel
    ? `group shrink-0 w-[180px] sm:w-[210px] md:w-[230px] snap-start bg-white border border-slate-200/90 rounded-2xl p-2.5 sm:p-3 shadow-2xs hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex flex-col justify-between cursor-pointer ${className}`
    : `group bg-white border border-slate-200/90 rounded-2xl p-2.5 sm:p-3 shadow-2xs hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex flex-col justify-between cursor-pointer w-full ${className}`;

  return (
    <div
      onClick={handleCardClick}
      className={`${containerClasses} group relative flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_12px_35px_-12px_rgba(15,23,42,0.18)]`}
    >
      {/* =========================================================
        PRODUCT IMAGE
    ========================================================== */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-50">
        {/* Subtle image background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100" />

        {/* =======================================================
          BADGES
      ======================================================== */}
        <div className="absolute left-3 top-3 z-20 flex max-w-[75%] flex-wrap gap-1.5">
          {!inStock ? (
            <span className="rounded-full bg-slate-800 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.08em] text-white shadow-sm">
              Sold Out
            </span>
          ) : (
            <>
              {badgeLabel && (
                <span className="rounded-full bg-blue-600 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.08em] text-white shadow-sm">
                  {badgeLabel}
                </span>
              )}

              {discountPercent > 0 && (
                <span className="rounded-full bg-rose-500 px-2.5 py-1 text-[9px] font-bold tracking-wide text-white shadow-sm">
                  {discountPercent}% OFF
                </span>
              )}
            </>
          )}
        </div>

        {/* =======================================================
          WISHLIST
      ======================================================== */}
        {showWishlist && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleToggleWishlist();
            }}
            aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
            className={`
            absolute right-3 top-3 z-20
            flex h-9 w-9 items-center justify-center
            rounded-full
            border
            backdrop-blur-md
            shadow-sm
            transition-all duration-200
            cursor-pointer
            ${
              isWished
                ? "border-rose-100 bg-rose-50 text-rose-500"
                : "border-slate-200/80 bg-white/90 text-slate-400 hover:border-slate-300 hover:bg-white hover:text-rose-500"
            }
          `}
          >
            <Heart
              size={16}
              strokeWidth={1.9}
              className={isWished ? "fill-rose-500 text-rose-500" : ""}
            />
          </button>
        )}

        {/* =======================================================
          PRODUCT IMAGE
      ======================================================== */}
        <img
          src={imageUrl}
          alt={productName}
          loading="lazy"
          className={`
          relative z-10
          h-full w-full object-cover
          transition-transform duration-700 ease-out
          group-hover:scale-[1.05]
          ${!inStock ? "grayscale-[30%] opacity-60" : ""}
        `}
        />

        {/* Image overlay on hover */}
        <div className="pointer-events-none absolute inset-0 z-10 bg-slate-900/[0.03] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* =======================================================
          QUICK VIEW
      ======================================================== */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/products/${prodId}?quickView=true`);
          }}
          className="
          absolute bottom-3 left-1/2 z-20
          flex -translate-x-1/2 translate-y-3
          items-center gap-1.5
          rounded-full
          border border-slate-200/80
          bg-white/95
          px-4 py-2
          text-[10px] font-bold
          text-slate-700
          shadow-lg
          backdrop-blur-md
          opacity-0
          transition-all duration-300
          group-hover:translate-y-0
          group-hover:opacity-100
          hover:bg-slate-900
          hover:text-white
          cursor-pointer
        "
        >
          <Eye size={13} strokeWidth={2} />
          <span>Quick View</span>
        </button>
      </div>

      {/* =========================================================
        PRODUCT INFORMATION
    ========================================================== */}
      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        {/* Main product information */}
        <div className="flex flex-1 flex-col">
          <div className="mb-1.5 flex min-w-0 items-center gap-2">
            <span className="truncate text-[11px] font-bold text-slate-700">
              {businessName}
            </span>

            {categoryName && (
              <>
                <span className="h-3 w-px shrink-0 bg-slate-200" />

                <span className="truncate text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                  {categoryName}
                </span>
              </>
            )}
          </div>

          {/* Product Name */}
          <h3
            className="
            h-10
            overflow-hidden
            line-clamp-2
            text-[13px]
            font-bold
            leading-5
            text-slate-900
            transition-colors
            duration-200
            group-hover:text-blue-600
            sm:text-sm
          "
          >
            {productName}
          </h3>

          {/* =====================================================
            RATING
        ====================================================== */}
          <div className="mt-1 flex items-center gap-2">
            <div className="inline-flex items-center gap-1">
              <Star
                size={12}
                strokeWidth={2}
                className="fill-amber-400 text-amber-400"
              />

              <span className="text-[11px] font-bold text-slate-700">
                {ratingValue}
              </span>
            </div>

            <span className="h-3 w-px bg-slate-200" />

            <span className="text-[10px] font-medium text-slate-400">
              {reviewsCount > 0
                ? `${reviewsCount} ${reviewsCount === 1 ? "review" : "reviews"}`
                : "No reviews yet"}
            </span>
          </div>
        </div>

        {/* =========================================================
          PRICE + ACTIONS
      ========================================================== */}
        <div className="mt-1 border-t border-slate-100 pt-3.5">
          <div className="flex items-end justify-between gap-2">
            <div className="min-w-0">
              {/* Current Price */}
              <div className="flex items-baseline gap-0.5">
                <span className="text-lg font-semibold text-orange-400">₹</span>
                <span className="text-lg font-black tracking-tight text-orange-400 sm:text-xl">
                  {displayPrice.toLocaleString("en-IN")}
                </span>
              </div>

              {/* Original Price */}
              {displayOriginalPrice && (
                <div className="mt-0.5 flex items-center gap-1.5">
                  <span className="text-[9px] font-medium text-slate-400">
                    MRP
                  </span>

                  <span className="text-[10px] font-medium text-slate-400 line-through">
                    ₹{displayOriginalPrice.toLocaleString("en-IN")}
                  </span>
                </div>
              )}
            </div>

            {/* Discount */}
            {displayOriginalPrice && discountPercent > 0 && (
              <span className="shrink-0 rounded-md bg-emerald-50 px-2 py-1 text-[9px] font-bold text-emerald-600">
                Save {discountPercent}%
              </span>
            )}
          </div>

          {/* =====================================================
            ACTION BUTTONS
        ====================================================== */}
          <div className="mt-3 flex items-center gap-2">
            {/* Add To Cart */}
            {showAddToCart && (
              <div className="min-w-0 flex-1">
                {inStock ? (
                  isInCart ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(e);
                      }}
                      className="
                      flex h-9 w-full
                      items-center justify-center
                      gap-1.5
                      rounded-xl
                      bg-emerald-600
                      hover:bg-emerald-700
                      px-3
                      text-[11px]
                      font-bold
                      text-white
                      shadow-2xs
                      transition-all duration-200
                      active:scale-[0.98]
                      cursor-pointer
                    "
                      title="Item is in your cart"
                    >
                      <Check
                        size={12}
                        strokeWidth={2.5}
                        className="text-white"
                      />
                      <span className="px-1">Added</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(e);
                      }}
                      className="
                      flex h-9 w-full
                      items-center justify-center
                      gap-1.5
                      rounded-xl
                      bg-orange-400
                      px-3
                      text-[11px]
                      font-bold
                      text-white
                      shadow-sm
                      transition-all duration-200
                      hover:bg-blue-600
                      hover:shadow-md
                      active:scale-[0.98]
                      cursor-pointer
                    "
                    >
                      <ShoppingCart size={10} strokeWidth={2.2} />
                      <span>Buy</span>
                    </button>
                  )
                ) : (
                  <button
                    type="button"
                    disabled
                    className="
                    flex h-9 w-full
                    items-center justify-center
                    rounded-xl
                    border border-slate-200
                    bg-slate-100
                    px-3
                    text-[10px]
                    font-bold
                    text-slate-400
                    cursor-not-allowed
                  "
                  >
                    Sold Out
                  </button>
                )}
              </div>
            )}

            {/* Compare */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                dispatch(
                  toggleCompare({
                    _id: prodId,
                    id: prodId,
                    name: productName,
                    price: displayPrice,
                    originalPrice: displayOriginalPrice,
                    image: imageUrl,
                    category: categoryName,
                    brand: businessName,
                    rating: ratingValue,
                    reviewsCount: reviewsCount,
                    inStock,
                    badge: badgeLabel,
                  }),
                );
              }}
              title={
                isCompared ? "Remove from comparison" : "Add to comparison"
              }
              aria-label={
                isCompared ? "Remove from comparison" : "Add to comparison"
              }
              aria-pressed={isCompared}
              className={`
                flex h-9 shrink-0 items-center justify-center gap-1.5
                rounded-xl border px-2.5 text-[10px] font-bold
                transition-all duration-200 active:scale-95 cursor-pointer
                ${
                  isCompared
                    ? "border-[#2563eb] bg-[#2563eb] text-white shadow-2xs"
                    : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:text-[#2563eb]"
                }
              `}
            >
              {isCompared ? (
                <>
                  <span>Added</span>
                </>
              ) : (
                <>
                  <span className="md:hidden flex items-center gap-1">
                    <Scale size={14} strokeWidth={2.5} />
                  </span>
                  <span className="hidden md:flex">Compare</span>
                </>
              )}
            </button>

            {/* Share */}
            <button
              type="button"
              onClick={handleShare}
              title={
                copiedLink ? "Link copied to clipboard!" : "Share product link"
              }
              aria-label={
                copiedLink ? "Link copied to clipboard!" : "Share product link"
              }
              className={`
                flex h-9 w-9 shrink-0
                items-center justify-center
                rounded-xl
                border
                transition-all duration-200
                active:scale-95
                cursor-pointer
                ${
                  copiedLink
                    ? "border-emerald-300 bg-emerald-50 text-emerald-600 shadow-2xs"
                    : "border-slate-200 bg-white text-slate-500 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                }
              `}
            >
              {copiedLink ? (
                <Check
                  size={13}
                  strokeWidth={2.5}
                  className="text-emerald-600"
                />
              ) : (
                <Share2 size={12} strokeWidth={1.75} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
