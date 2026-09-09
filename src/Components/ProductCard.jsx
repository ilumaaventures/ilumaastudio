import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  ShoppingCart,
  Star,
  Eye,
  Sparkles,
  Scale,
  Share2,
  Check,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/reducers/cartReducer";
import { toggleWishlist } from "../redux/reducers/wishlistReducer";
import { toggleCompare } from "../redux/reducers/compareReducer";
import toast from "react-hot-toast";

/**
 * Universal ProductCard Component for ILumaaStudio
 * Matches the exact modern reference design with full Redux, Cart, Wishlist, Compare & Share integrations.
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
    (s) => s.cart?.cartItems || s.cart?.items || []
  );

  const [copiedLink, setCopiedLink] = useState(false);

  if (!product) return null;

  const prodId = product._id || product.id || product.productId;

  // Check compare state
  const isCompared = compareItems.some(
    (i) => String(i.id || i._id) === String(prodId)
  );

  // Check wishlist state
  const isWished = wishlistItems.some((i) => {
    const itemId = i && typeof i === "object" ? i._id || i.id : i;
    return String(itemId) === String(prodId);
  });

  // Check cart state
  const isInCart = cartItems.some((i) => {
    const itemId =
      i && typeof i === "object"
        ? i._id || i.id || i.product?._id || i.product || i.cartItemId
        : i;
    return String(itemId) === String(prodId);
  });

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
  const businessName =
    product.business?.businessName ||
    product.business?.name ||
    product.brand ||
    "ILumaaStore";

  // Short Subtitle / Description
  const subtitleText =
    product.subtitle ||
    product.shortDescription ||
    (product.description && typeof product.description === "string"
      ? product.description.replace(/<[^>]*>?/gm, "").slice(0, 75)
      : null) ||
    "A perfect blend of style, elegance and functionality.";

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
          ((displayOriginalPrice - displayPrice) / displayOriginalPrice) * 100
        )
      : 0;

  // Normalize Rating and Reviews
  const ratingValue = Number(
    product.rating || product.ratings || 4.8
  ).toFixed(1);
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
      })
    );
    if (isWished) {
      toast.success("Removed from Wishlist");
    } else {
      toast.success("Added to Wishlist! ❤️");
    }
  };

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
      })
    );

    toast.success(`${productName} added to cart! 🛍️`);
    if (onAddToCartSuccess) onAddToCartSuccess(product);
  };

  // Dynamic Badge Pill rendering matching reference screenshot
  const renderBadge = () => {
    if (!inStock) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-white shadow-xs">
          Sold Out
        </span>
      );
    }

    const badgeRaw =
      product.badge ||
      (product.isBestSeller ? "Bestseller" : null) ||
      (product.isTrending ? "Trending" : null) ||
      (product.isFeatured ? "Trending" : null) ||
      (product.isEcoFriendly || product.isOrganic ? "Eco Friendly" : null) ||
      (product.isNewArrival ? "Trending" : null);

    if (!badgeRaw) {
      // Default to Bestseller or Trending if top rating or discounted
      if (discountPercent >= 25) {
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white bg-[#FF6B00] shadow-xs">
            <Sparkles size={10} className="shrink-0" />
            <span>Bestseller</span>
          </span>
        );
      }
      return null;
    }

    const lower = String(badgeRaw).toLowerCase();

    if (lower.includes("best") || lower.includes("seller") || lower.includes("hot")) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold text-white bg-[#FF6B00] shadow-xs">
          <Sparkles size={10} className="shrink-0" />
          <span>Bestseller</span>
        </span>
      );
    }

    if (lower.includes("trend") || lower.includes("feature") || lower.includes("new")) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold text-white bg-[#2563EB] shadow-xs">
          <span>Trending</span>
        </span>
      );
    }

    if (
      lower.includes("eco") ||
      lower.includes("organic") ||
      lower.includes("green") ||
      lower.includes("natural")
    ) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold text-white bg-[#10B981] shadow-xs">
          <span>🌿 Eco Friendly</span>
        </span>
      );
    }

    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold text-white bg-blue-600 shadow-xs">
        <span>{badgeRaw}</span>
      </span>
    );
  };

  // Base sizing container classes
  const containerClasses = isCarousel
    ? `shrink-0 w-[210px] sm:w-[235px] md:w-[250px] snap-start bg-white border border-slate-200/90 rounded-2xl p-3 shadow-2xs hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between cursor-pointer ${className}`
    : `bg-white border border-slate-200/90 rounded-2xl p-3 sm:p-3.5 shadow-2xs hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between cursor-pointer w-full group relative ${className}`;

  return (
    <div onClick={handleCardClick} className={containerClasses}>
      {/* =========================================================
          1. PRODUCT IMAGE CONTAINER (MATCHING REFERENCE EXACTLY)
      ========================================================== */}
      <div className="relative aspect-[4/3] sm:aspect-square w-full rounded-xl overflow-hidden bg-slate-50 border border-slate-100/90 select-none">
        {/* Top-Left Category / Status Badge */}
        <div className="absolute left-2.5 top-2.5 z-20">
          {renderBadge()}
        </div>

        {/* Top-Right Circular White Wishlist Button */}
        {showWishlist && (
          <button
            type="button"
            onClick={handleToggleWishlist}
            aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
            className={`absolute right-2.5 top-2.5 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 backdrop-blur-xs border shadow-sm transition-all duration-200 cursor-pointer ${
              isWished
                ? "border-rose-100 text-rose-500 bg-rose-50/90"
                : "border-slate-100 text-slate-700 hover:text-rose-500 hover:scale-105"
            }`}
          >
            <Heart
              size={15}
              strokeWidth={2}
              className={isWished ? "fill-rose-500 text-rose-500" : ""}
            />
          </button>
        )}

        {/* Product Image */}
        <img
          src={imageUrl}
          alt={productName}
          loading="lazy"
          className={`h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] ${
            !inStock ? "grayscale-[25%] opacity-70" : ""
          }`}
        />

        {/* Bottom-Right White "Quick View" Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            navigate(`/products/${prodId}?quickView=true`);
          }}
          className="absolute bottom-2.5 right-2.5 z-20 flex items-center gap-1.5 rounded-full bg-white/95 backdrop-blur-xs px-3 py-1.5 text-[11px] font-bold text-slate-700 shadow-sm border border-slate-100/90 hover:bg-white hover:text-blue-600 transition-all duration-200 cursor-pointer"
        >
          <Eye size={12} strokeWidth={2.2} className="text-slate-600" />
          <span>Quick View</span>
        </button>
      </div>

      {/* =========================================================
          2. PRODUCT INFORMATION BODY (MATCHING REFERENCE EXACTLY)
      ========================================================== */}
      <div className="flex flex-1 flex-col pt-3 space-y-1">
        {/* Brand & Category Row: [Icon Brand | CATEGORY] */}
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium truncate">
          <div className="w-4 h-4 rounded-full bg-amber-100 border border-amber-200/80 flex items-center justify-center shrink-0 overflow-hidden">
            {product.business?.logo ? (
              <img
                src={product.business.logo}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-[9px]">🌸</span>
            )}
          </div>
          <span className="font-semibold text-slate-700 truncate max-w-[120px]">
            {businessName}
          </span>
          <span className="text-slate-300 font-normal">|</span>
          <span className="uppercase text-[10px] font-bold text-slate-400 tracking-wider truncate">
            {categoryName}
          </span>
        </div>

        {/* Product Title */}
        <h3 className="text-sm sm:text-[15px] font-bold text-slate-900 line-clamp-1 leading-snug group-hover:text-blue-600 transition-colors pt-0.5">
          {productName}
        </h3>

        {/* Short Subtitle / Description */}
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed min-h-[34px]">
          {subtitleText}
        </p>

        {/* Rating Row: ⭐ 4.8 (210 reviews) */}
        <div className="flex items-center gap-1.5 pt-0.5">
          <Star
            size={13}
            className="fill-amber-400 text-amber-400 shrink-0 stroke-amber-400"
          />
          <span className="text-xs font-bold text-slate-800">{ratingValue}</span>
          <span className="text-xs text-slate-400 font-normal">
            ({reviewsCount} reviews)
          </span>
        </div>

        {/* Price & Discount Row: ₹3,299  ₹4,499  27% OFF */}
        <div className="flex items-baseline gap-2 pt-1 pb-2 flex-wrap">
          <span className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
            ₹{displayPrice.toLocaleString("en-IN")}
          </span>
          {displayOriginalPrice && (
            <span className="text-xs text-slate-400 line-through">
              ₹{displayOriginalPrice.toLocaleString("en-IN")}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-extrabold text-emerald-600 border border-emerald-100">
              {discountPercent}% OFF
            </span>
          )}
        </div>
      </div>

      {/* =========================================================
          3. ACTION BUTTONS ROW (MATCHING REFERENCE EXACTLY)
          [🛒 Add to Cart] [⇄] [🔗]
      ========================================================== */}
      <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
        {/* Primary Add to Cart Button */}
        {showAddToCart && (
          <div className="flex-1 min-w-0">
            {inStock ? (
              isInCart ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(e);
                  }}
                  className="flex h-9 sm:h-10 w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-3 text-xs font-bold text-white shadow-2xs transition-all active:scale-98 cursor-pointer"
                  title="Item is in your cart"
                >
                  <Check size={14} strokeWidth={2.5} className="text-white" />
                  <span>Added</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(e);
                  }}
                  className="flex h-9 sm:h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#0F172A] hover:bg-slate-800 px-3 text-xs font-bold text-white shadow-xs transition-all active:scale-98 cursor-pointer"
                >
                  <ShoppingCart size={13} strokeWidth={2.2} />
                  <span>Add to Cart</span>
                </button>
              )
            ) : (
              <button
                type="button"
                disabled
                className="flex h-9 sm:h-10 w-full items-center justify-center rounded-xl border border-slate-200 bg-slate-100 px-3 text-xs font-bold text-slate-400 cursor-not-allowed"
              >
                Sold Out
              </button>
            )}
          </div>
        )}

        {/* Compare Button */}
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
              })
            );
          }}
          title={isCompared ? "Remove from comparison" : "Add to comparison"}
          aria-label={
            isCompared ? "Remove from comparison" : "Add to comparison"
          }
          className={`flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl border transition-all duration-200 active:scale-95 cursor-pointer shadow-2xs ${
            isCompared
              ? "border-blue-500 bg-blue-50 text-blue-600"
              : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
          }`}
        >
          <Scale size={14} strokeWidth={2} />
        </button>

        {/* Share Button */}
        <button
          type="button"
          onClick={handleShare}
          title={copiedLink ? "Link copied!" : "Share product link"}
          aria-label={copiedLink ? "Link copied!" : "Share product link"}
          className={`flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl border transition-all duration-200 active:scale-95 cursor-pointer shadow-2xs ${
            copiedLink
              ? "border-emerald-400 bg-emerald-50 text-emerald-600"
              : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
          }`}
        >
          {copiedLink ? (
            <Check size={14} strokeWidth={2.5} className="text-emerald-600" />
          ) : (
            <Share2 size={13} strokeWidth={2} />
          )}
        </button>
      </div>
    </div>
  );
}
