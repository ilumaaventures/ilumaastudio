import React from "react";
import ProductCard from "./ProductCard";

export default function ProductSection({
  title,
  subtitle,
  products = [],
  currency = "₹",
  wishlistIds = [],
  onToggleWishlist = () => {},
  onAddToCart = () => {},
  onSelectProduct = () => {},
}) {
  if (!products || products.length === 0) return null;

  return (
    <section className="w-full bg-[#FAF7F2] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading matching reference images */}
        <div className="mb-6 sm:mb-8 text-left">
          <h2
            className="text-xl sm:text-2xl md:text-3xl font-serif text-[#2E1B13] font-normal tracking-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {title}
          </h2>
          {subtitle && (
            <p className="mt-1 text-xs sm:text-sm text-[#7D6E63] font-light">
              {subtitle}
            </p>
          )}
        </div>

        {/* 4-Column Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              currency={currency}
              isWishlisted={wishlistIds.includes(product._id)}
              onToggleWishlist={onToggleWishlist}
              onAddToCart={onAddToCart}
              onSelectProduct={onSelectProduct}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
