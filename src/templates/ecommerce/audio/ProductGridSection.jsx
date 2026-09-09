import React from "react";
import ProductCard from "./ProductCard";

export default function ProductGridSection({
  id,
  title,
  products = [],
  currency = "€",
  wishlistIds = [],
  onToggleWishlist = () => {},
  onAddToCart = () => {},
  onSelectProduct = () => {},
  onViewAll = () => {},
}) {
  if (!products || products.length === 0) return null;

  return (
    <section id={id} className="w-full bg-[#FFFFFF] py-12 sm:py-16 border-b border-[#EAEAEA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Section Heading matching reference images */}
        <h2
          className="text-xl sm:text-2xl md:text-3xl font-bold uppercase tracking-[0.2em] text-[#121212] mb-10 sm:mb-14"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          {title}
        </h2>

        {/* 4-Column Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12">
          {products.map((prod) => (
            <ProductCard
              key={prod._id}
              product={prod}
              currency={currency}
              isWishlisted={wishlistIds.includes(prod._id)}
              onToggleWishlist={onToggleWishlist}
              onAddToCart={onAddToCart}
              onSelectProduct={onSelectProduct}
            />
          ))}
        </div>

        {/* "VIEW ALL PRODUCTS" Solid Rectangular Dark Button matching reference */}
        <div>
          <button
            onClick={onViewAll}
            className="px-8 py-3.5 bg-[#121212] hover:bg-neutral-800 text-white text-[11px] font-bold tracking-[0.2em] uppercase transition-colors shadow-sm"
          >
            VIEW ALL PRODUCTS
          </button>
        </div>
      </div>
    </section>
  );
}
