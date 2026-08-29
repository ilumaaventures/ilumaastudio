import React from "react";
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
import toast from "react-hot-toast";

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

  if (!product) return null;

  const prodId = product._id || product.id || product.productId;

  // Check wishlist state
  const isWished = wishlistItems.some(
    (i) => (i._id || i.id || i) === prodId || String(i) === String(prodId)
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
  const ratingValue = Number(product.rating || product.ratings || 4.8).toFixed(1);
  const reviewsCount = Array.isArray(product.reviews)
    ? product.reviews.length
    : typeof product.reviews === "number"
    ? product.reviews
    : product.numReviews || product.reviewsCount || 124;

  // Stock status
  const inStock = (() => {
    if (product.inStock !== undefined) return Boolean(product.inStock);
    if (product.isOutOfStock !== undefined) return !product.isOutOfStock;
    if (product.hasVariants && Array.isArray(product.variants) && product.variants.length > 0) {
      return product.variants.some((v) => {
        const vStock = v.stockQuantity !== undefined ? Number(v.stockQuantity) : Number(v.stock || 0);
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
      })
    );
    if (isWished) {
      toast.success("Removed from Wishlist");
    } else {
      toast.success("Added to Wishlist!");
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!inStock) {
      toast.error(`Sorry, ${productName} is currently out of stock!`);
      return;
    }

    const defaultVariant =
      product.hasVariants && Array.isArray(product.variants) && product.variants.length > 0
        ? product.variants[0]
        : null;

    const effectivePrice =
      defaultVariant && !isNaN(Number(defaultVariant.price)) && Number(defaultVariant.price) > 0
        ? Number(defaultVariant.price)
        : displayPrice;

    const categoryTax =
      typeof product.category === "object" && product.category?.tax !== undefined && product.category?.tax !== null
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

    toast.success(`${productName} added to cart!`);
    if (onAddToCartSuccess) onAddToCartSuccess(product);
  };

  // Base sizing container classes
  const containerClasses = isCarousel
    ? `group shrink-0 w-[180px] sm:w-[210px] md:w-[230px] snap-start bg-white border border-slate-200/90 rounded-2xl p-2.5 sm:p-3 shadow-2xs hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex flex-col justify-between cursor-pointer ${className}`
    : `group bg-white border border-slate-200/90 rounded-2xl p-2.5 sm:p-3 shadow-2xs hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex flex-col justify-between cursor-pointer w-full ${className}`;

  return (
    <div onClick={handleCardClick} className={containerClasses}>
      {/* Top Image & Floating Badges */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-slate-50 flex items-center justify-center">
        {/* Top Badges */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1 items-start max-w-[70%]">
          {!inStock ? (
            <span className="px-2 py-0.5 rounded-md bg-rose-600 text-white text-[9px] font-black uppercase tracking-wider shadow-xs">
              Out of Stock
            </span>
          ) : (
            <>
              {badgeLabel && (
                <span className="px-2 py-0.5 rounded-md bg-slate-900 text-white text-[9px] font-bold shadow-xs">
                  {badgeLabel}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="px-2 py-0.5 rounded-md bg-rose-500 text-white text-[9px] font-black shadow-xs">
                  {discountPercent}% OFF
                </span>
              )}
            </>
          )}
        </div>

        {/* Wishlist Button */}
        {showWishlist && (
          <button
            type="button"
            onClick={handleToggleWishlist}
            className={`absolute top-2 right-2 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full shadow-sm flex items-center justify-center transition-all duration-200 cursor-pointer ${
              isWished
                ? "bg-rose-50 text-rose-600 scale-105"
                : "bg-white/90 text-slate-400 hover:text-rose-500 hover:bg-white hover:scale-110"
            }`}
            aria-label="Toggle wishlist"
          >
            <Heart
              size={15}
              className={isWished ? "fill-rose-500 text-rose-500" : ""}
            />
          </button>
        )}

        {/* Product Image */}
        <img
          src={imageUrl}
          alt={productName}
          loading="lazy"
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            !inStock ? "opacity-60 grayscale-[30%]" : ""
          }`}
        />

        {/* Quick View Floating Button */}
        <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
          <span className="bg-white/95 text-slate-800 text-[11px] font-bold px-3 py-1.5 rounded-full shadow-md backdrop-blur-xs flex items-center gap-1">
            <Eye size={12} className="text-[#2563eb]" />
            Quick View
          </span>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="pt-2.5 sm:pt-3 space-y-1.5 flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          {/* Category Tag */}
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">
            {categoryName}
          </p>

          {/* Product Title */}
          <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm leading-snug line-clamp-2 group-hover:text-[#2563eb] transition-colors">
            {productName}
          </h3>

          {/* Rating & Reviews */}
          <div className="flex items-center gap-1.5 pt-0.5">
            <div className="flex items-center gap-1 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-100/80">
              <Star size={11} className="fill-amber-400 text-amber-400" />
              <span className="text-[10px] font-extrabold text-slate-700">
                {ratingValue}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">
              ({reviewsCount})
            </span>
          </div>
        </div>

        {/* Pricing & Cart Action */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          {/* Price Row */}
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
              ₹{displayPrice.toLocaleString("en-IN")}
            </span>
            {displayOriginalPrice && (
              <span className="text-[11px] text-slate-400 font-semibold line-through">
                ₹{displayOriginalPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          {showAddToCart && (
            inStock ? (
              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full py-1.5 sm:py-2 px-3 bg-slate-900 hover:bg-[#2563eb] text-white rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 shadow-xs hover:shadow-md cursor-pointer active:scale-98"
              >
                <ShoppingCart size={13} />
                <span>Add to Cart</span>
              </button>
            ) : (
              <button
                type="button"
                disabled
                className="w-full py-1.5 sm:py-2 px-3 bg-slate-100 text-slate-400 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-not-allowed border border-slate-200/80"
              >
                <span>Out of Stock</span>
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
