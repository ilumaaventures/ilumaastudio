import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Eye, Star } from "lucide-react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/reducers/cartReducer";
import toast from "react-hot-toast";
import { useStore } from "../../pages/Store/StoreLayout";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const { business } = useStore();

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
    dispatch(addToCart({ product, quantity: 1 }));
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
    product.images?.[0]?.url ||
    "https://via.placeholder.com/400x300?text=No+Image";

  return (
    <div className="group bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full relative">
      {/* Product Image & Badges */}
      <div className="relative pt-[100%] bg-gray-50 overflow-hidden shrink-0">
        {isOutOfStock ? (
          <span className="absolute top-4 left-4 z-10 bg-rose-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-sm tracking-wider">
            Out of Stock
          </span>
        ) : (
          discountPercent > 0 && (
            <span className="absolute top-4 left-4 z-10 bg-indigo-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-sm">
              {discountPercent}% OFF
            </span>
          )
        )}
        <img
          src={imageUrl}
          alt={product.name}
          className={`absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-300 ${
            isOutOfStock ? "opacity-75 grayscale-[30%]" : ""
          }`}
        />

        {/* Hover overlay with quick links */}
        <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3">
          <Link
            to={`/${encodeURIComponent(business.businessName)}/product/${product._id}`}
            className="p-3 bg-white text-gray-900 rounded-full hover:bg-indigo-600 hover:text-white transition shadow-lg shadow-black/10 cursor-pointer"
            title="View Details"
          >
            <Eye size={18} />
          </Link>
          <button
            onClick={handleAdd}
            disabled={isOutOfStock}
            className={`p-3 rounded-full transition shadow-lg shadow-black/10 ${
              isOutOfStock
                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                : "bg-white text-gray-900 hover:bg-indigo-600 hover:text-white cursor-pointer"
            }`}
            title={isOutOfStock ? "Out of Stock" : "Add to Cart"}
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
            {product.category?.name || "General"}
          </span>
          <Link
            to={`/${encodeURIComponent(business.businessName)}/product/${product._id}`}
            className="font-bold text-gray-900 group-hover:text-indigo-600 transition line-clamp-1 block leading-tight text-sm"
          >
            {product.name}
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1">
            <div className="flex text-amber-400">
              <Star size={12} fill="currentColor" />
            </div>
            <span className="text-[10px] font-bold text-gray-500">
              {product.rating || "4.8"} ({product.numReviews || 8})
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 mt-4 pt-4 border-t border-gray-50">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="font-extrabold text-gray-900 text-base">
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
                : `₹${Number(product.price).toLocaleString("en-IN")}`}
            </span>
            {product.compareAtPrice > product.price && (
              <span className="text-xs text-gray-400 font-medium line-through">
                ₹{product.compareAtPrice}
              </span>
            )}
          </div>

          <button
            onClick={handleAdd}
            className="p-2 bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white rounded-xl transition cursor-pointer"
            title="Add to Cart"
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
