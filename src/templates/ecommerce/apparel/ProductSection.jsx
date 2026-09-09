import React from "react";
import ProductCard from "./ProductCard";

export default function ProductSection({
  title,
  products = [],
  onSelectProduct,
  onAddToCart,
  onToggleWishlist,
  wishlistIds = [],
  currency = "₹",
}) {
  if (!products || products.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-left">
      {/* Category Section Title with Clean Horizontal Divider Rule */}
      <div className="space-y-2 mb-5">
        <h2 className="text-sm sm:text-base font-semibold text-stone-900 tracking-tight">
          {title}
        </h2>
        <div className="w-full h-px bg-[#E5E7EB]" />
      </div>

      {/* 5-Column Responsive Product Grid matching Reference Screenshot */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4 lg:gap-5">
        {products.map((item) => {
          const isWishlisted = wishlistIds.includes(item._id);
          return (
            <ProductCard
              key={item._id}
              product={item}
              onSelectProduct={onSelectProduct}
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
              isWishlisted={isWishlisted}
              currency={currency}
            />
          );
        })}
      </div>
    </section>
  );
}
