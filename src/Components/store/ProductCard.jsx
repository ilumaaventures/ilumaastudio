import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Eye, Star, Coins, Check } from "lucide-react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/reducers/cartReducer";
import toast from "react-hot-toast";
import { useStore } from "../../pages/Store/StoreContext";

export default function ProductCard({ product, theme = null }) {
  const dispatch = useDispatch();
  const { business, storeHomePath } = useStore();
  const basePath =
    storeHomePath ||
    `/${encodeURIComponent(business?.subdomain || business?.slug || business?.businessName || "")}`;

  const checkIsOutOfStock = (prod) => {
    if (!prod) return false;
    if (
      prod.hasVariants &&
      Array.isArray(prod.variants) &&
      prod.variants.length > 0
    ) {
      return prod.variants.every((v) => {
        const vStock =
          v.stockQuantity !== undefined
            ? Number(v.stockQuantity)
            : v.stock !== undefined
              ? Number(v.stock)
              : 0;
        return vStock <= 0;
      });
    }
    const stockVal =
      prod.inventory?.stockQuantity !== undefined
        ? Number(prod.inventory.stockQuantity)
        : prod.stockQuantity !== undefined
          ? Number(prod.stockQuantity)
          : prod.stock !== undefined
            ? Number(prod.stock)
            : prod.countInStock !== undefined
              ? Number(prod.countInStock)
              : 0;

    return stockVal <= 0;
  };

  const isOutOfStock = checkIsOutOfStock(product);

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) {
      toast.error(`Sorry, ${product.name} is currently out of stock!`);
      return;
    }
    const defaultVariant =
      product.hasVariants && Array.isArray(product.variants)
        ? product.variants[0]
        : null;
    const effectivePrice =
      defaultVariant &&
      defaultVariant.price !== null &&
      defaultVariant.price !== undefined &&
      defaultVariant.price !== "" &&
      !isNaN(Number(defaultVariant.price))
        ? Number(defaultVariant.price)
        : Number(product.price || 0);

    dispatch(
      addToCart({
        product: {
          ...product,
          price: effectivePrice,
          selectedOptions: defaultVariant ? defaultVariant.optionValues : null,
          variantSku: defaultVariant ? defaultVariant.sku : product.sku,
          variantId: defaultVariant ? defaultVariant._id : null,
        },
        quantity: 1,
      }),
    );
    toast.success(`${product.name} added to cart!`);
  };

  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(
          ((product.compareAtPrice - product.price) / product.compareAtPrice) *
            100,
        )
      : 0;

  const imageUrl =
    product.featuredImage?.url ||
    product.featuredImage ||
    product.thumbnail?.url ||
    product.thumbnail ||
    product.images?.[0]?.url ||
    product.images?.[0] ||
    "https://via.placeholder.com/400x400?text=No+Image";

  const primaryColor = theme?.colors?.primary || "#4F46E5";

  return (
    <div
      className="group bg-white rounded-3xl overflow-hidden border border-slate-100/80 hover:border-indigo-200 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300 flex flex-col h-full relative"
      style={{
        backgroundColor: theme?.colors?.cardBg || "#FFFFFF",
      }}
    >
      {/* Product Image & Floating Badges */}
      <div className="relative pt-[100%] bg-slate-50 overflow-hidden shrink-0">
        <div className="absolute top-3.5 left-3.5 z-10 flex flex-col gap-1.5 items-start">
          {isOutOfStock ? (
            <span className="bg-rose-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-sm tracking-wider">
              Out of Stock
            </span>
          ) : (
            discountPercent > 0 && (
              <span
                className="text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-sm"
                style={{ backgroundColor: primaryColor }}
              >
                {discountPercent}% OFF
              </span>
            )
          )}
          {product.isFeatured && !isOutOfStock && (
            <span className="bg-amber-500 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-xs">
              ★ Featured
            </span>
          )}
        </div>

        <img
          src={imageUrl}
          alt={product.name}
          className={`absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
            isOutOfStock ? "opacity-70 grayscale-[25%]" : ""
          }`}
          loading="lazy"
        />

        {/* Hover Quick Actions */}
        <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <Link
            to={`${basePath}/product/${product._id}`}
            className="p-3 bg-white text-slate-900 rounded-2xl hover:bg-slate-950 hover:text-white transition-all duration-200 shadow-lg cursor-pointer"
            title="Quick View"
          >
            <Eye size={17} />
          </Link>
          <button
            onClick={handleAdd}
            disabled={isOutOfStock}
            className={`p-3 rounded-2xl transition-all duration-200 shadow-lg cursor-pointer ${
              isOutOfStock
                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                : "bg-white text-slate-900 hover:bg-indigo-600 hover:text-white"
            }`}
            style={{
              "--hover-bg": primaryColor,
            }}
            title={isOutOfStock ? "Out of Stock" : "Add to Cart"}
          >
            <ShoppingCart size={17} />
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5 text-left">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block truncate">
            {product.category?.name || "Premium Collection"}
          </span>

          <Link
            to={`${basePath}/product/${product._id}`}
            className="font-bold text-slate-900 group-hover:text-indigo-600 transition line-clamp-1 block leading-snug text-sm tracking-tight"
            style={{
              color: theme?.colors?.textColor || "#0f172a",
            }}
          >
            {product.name}
          </Link>

          {/* Rating & Coin Rewards */}
          <div className="flex items-center justify-between gap-2 pt-0.5">
            <div className="flex items-center gap-1">
              <Star size={12} className="text-amber-400 fill-amber-400" />
              <span className="text-[11px] font-bold text-slate-600">
                {product.rating || "4.9"}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                ({product.numReviews || 12})
              </span>
            </div>

            {product.coinReward > 0 && (
              <span className="inline-flex items-center gap-1 text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                <Coins size={10} className="text-amber-500" /> +{product.coinReward}
              </span>
            )}
          </div>
        </div>

        {/* Pricing & CTA Button */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="font-black text-slate-900 text-base sm:text-lg tracking-tight">
                {product.hasVariants &&
                product.variants &&
                product.variants.length > 0
                  ? (() => {
                      const prices = product.variants
                        .map((v) => v.price)
                        .filter((p) => p !== undefined && p !== null);
                      if (prices.length > 0) {
                        const minPrice = Math.min(...prices);
                        const maxPrice = Math.max(...prices);
                        if (minPrice === maxPrice) {
                          return `₹${minPrice.toLocaleString("en-IN")}`;
                        }
                        return `₹${minPrice.toLocaleString("en-IN")} - ₹${maxPrice.toLocaleString("en-IN")}`;
                      }
                      return `₹${Number(product.price).toLocaleString("en-IN")}`;
                    })()
                  : `₹${Number(product.price || 0).toLocaleString("en-IN")}`}
              </span>

              {product.compareAtPrice > product.price && (
                <span className="text-xs text-slate-400 font-medium line-through">
                  ₹{Number(product.compareAtPrice).toLocaleString("en-IN")}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleAdd}
            disabled={isOutOfStock}
            className={`p-2.5 rounded-xl transition-all duration-200 cursor-pointer shadow-xs ${
              isOutOfStock
                ? "bg-slate-100 text-slate-300 cursor-not-allowed"
                : "bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white"
            }`}
            title="Add to Cart"
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
