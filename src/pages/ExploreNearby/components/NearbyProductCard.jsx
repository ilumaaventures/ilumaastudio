import React from "react";
import ProductCard from "../../../Components/ProductCard";
import { Bookmark, MapPin } from "lucide-react";

/**
 * NearbyProductCard
 * Uses ILumaaStudio's universal ProductCard as used in Shop and Home pages,
 * enriched with local distance badges and neighbourhood itinerary planner integration.
 */
export default function NearbyProductCard({
  product,
  onAddToPlan,
  isInPlan = false,
  isCarousel = false,
  className = "",
}) {
  if (!product) return null;

  // Format product cleanly for the universal ProductCard
  const formattedProduct = {
    ...product,
    _id: product._id || product.id || `prod_${Math.random()}`,
    id: product.id || product._id,
    name: product.name || product.title || "Local Product",
    price: Number(product.price || 0),
    originalPrice: Number(product.originalPrice || 0),
    images: product.images || [product.image],
    image: product.image || product.images?.[0],
    category: product.category || "General",
    brand: product.businessName || product.brand || "Local Artisan",
    rating: product.rating || 4.7,
    reviews: product.reviewCount || 42,
    numReviews: product.reviewCount || 42,
    inStock: product.availability ? !product.availability.toLowerCase().includes("out") : true,
    isFeatured: Boolean(product.isFeatured),
    isTrending: Boolean(product.isFeatured || (product.tags && product.tags.includes("Trending"))),
    distanceKm: product.distanceKm,
  };

  return (
    <div
      className={`relative group ${
        isCarousel
          ? "shrink-0 w-[220px] sm:w-[245px] md:w-[260px] snap-start"
          : "w-full"
      }`}
    >
      <ProductCard
        product={formattedProduct}
        isCarousel={false}
        className="w-full h-full shadow-2xs hover:shadow-xl transition-all duration-300"
        customLink={`/products/${formattedProduct._id}`}
      />

      {/* Local Distance Pin Overlay */}
      {formattedProduct.distanceKm && (
        <div className="absolute top-11 left-3.5 z-20 pointer-events-none">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-xs text-white text-[9px] font-black shadow-xs">
            <MapPin size={9} className="text-blue-400" />
            <span>{formattedProduct.distanceKm} km</span>
          </span>
        </div>
      )}

      {/* Add to Neighbourhood Plan button on top-right (alongside wishlist) */}
      {onAddToPlan && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onAddToPlan(product);
          }}
          className={`absolute top-2.5 right-12 z-20 w-8 h-8 rounded-full bg-white/95 backdrop-blur-xs border shadow-sm flex items-center justify-center transition-all duration-200 cursor-pointer ${
            isInPlan
              ? "border-indigo-200 text-indigo-600 bg-indigo-50/90 shadow-md"
              : "border-slate-100 text-slate-500 hover:text-indigo-600 hover:scale-105"
          }`}
          title={isInPlan ? "In Neighbourhood Plan" : "Add to Itinerary"}
        >
          <Bookmark size={14} className={isInPlan ? "fill-indigo-600 text-indigo-600" : ""} />
        </button>
      )}
    </div>
  );
}
