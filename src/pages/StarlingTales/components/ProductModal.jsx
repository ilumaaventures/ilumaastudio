import React, { useState, useEffect, useRef } from "react";
import Icon from "./Icon";
import { formatPrice } from "../constants";

export default function ProductModal({
  product,
  isWishlisted,
  onClose,
  onWishlist,
  onAddToCart,
}) {
  const drawerRef = useRef(null);
  const [mainImage, setMainImage] = useState(product?.image || "");
  const [selectedVariant, setSelectedVariant] = useState(
    product?.variants?.[0] || null,
  );
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!product) return;
    setMainImage(product.image || product.images?.[0]?.url || "");
    setSelectedVariant(product.variants?.[0] || null);
    setQuantity(1);
  }, [product]);

  useEffect(() => {
    if (!product) return undefined;
    const drawer = drawerRef.current;
    const focusable = drawer?.querySelectorAll(
      'a[href], button:not([disabled]), summary, [tabindex]:not([tabindex="-1"])',
    );
    const first = focusable?.[0];
    const last = focusable?.[focusable.length - 1];
    first?.focus();

    function trapFocus(event) {
      if (event.key !== "Tab" || !first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    drawer?.addEventListener("keydown", trapFocus);
    return () => drawer?.removeEventListener("keydown", trapFocus);
  }, [product]);

  if (!product) return null;

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-stretch justify-end"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-product-name"
    >
      <button
        className="absolute inset-0 bg-text-dark/45 backdrop-blur-[2px] animate-fade-in"
        type="button"
        onClick={onClose}
        aria-label="Close product detail"
      />

      <div
        className="relative flex h-full  sm:max-w-xl md:max-w-3xl lg:max-w-5xl flex-col overflow-y-auto bg-cream animate-slide-in-right"
        ref={drawerRef}
      >
        <button
          className="absolute top-4 right-4 z-10 flex h-11 w-11 items-center justify-center border border-cream-dark rounded-full bg-white text-text-dark transition-colors duration-150 hover:bg-cream-dark"
          type="button"
          onClick={onClose}
          aria-label="Close product detail"
        >
          <Icon name="x" className="h-5 w-5" />
        </button>

        <div className="grid min-h-full grid-cols-1 lg:grid-cols-2">
          <div className="relative p-4 sm:p-6 lg:p-10 px-7.5 bg-white flex flex-col justify-start">
            <div className="relative aspect-square sm:aspect-[4/5] overflow-hidden rounded-2xl mb-4 bg-[#FAF7F2] border border-[#E8DFC8]/50 flex items-center justify-center p-4">
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-full object-contain object-center transition-transform duration-300 hover:scale-105 drop-shadow-sm"
                loading="eager"
                decoding="async"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/600x600?text=Starling+Tales";
                }}
              />
              <button
                className={`absolute top-3 right-3 flex h-11 w-11 items-center justify-center border-none rounded-full bg-white text-text-muted shadow-[0_2px_10px_rgba(0,0,0,0.12)] transition-all duration-200 hover:text-danger hover:scale-108 focus-visible:text-danger focus-visible:scale-108 ${isWishlisted ? "text-danger fill-danger" : ""}`}
                type="button"
                onClick={() => onWishlist(product.id)}
                aria-label={`Toggle wishlist for ${product.name}`}
              >
                <Icon
                  name="heart"
                  className={`h-5 w-5 ${isWishlisted ? "fill-danger text-danger" : ""}`}
                />
              </button>
            </div>
            {product.gallery?.length > 1 && (
              <div
                className="flex flex-wrap gap-2.5"
                role="list"
                aria-label="Product images"
              >
                {product.gallery.map((image, index) => (
                  <button
                    key={image}
                    className={`w-14 h-14 sm:w-16 sm:h-16 overflow-hidden border-2 rounded-xl bg-[#FAF7F2] p-1 transition-all duration-150 flex items-center justify-center ${mainImage === image ? "border-blue-soft ring-2 ring-blue-soft/20 shadow-sm" : "border-[#E8DFC8]/50 hover:border-blue-soft"}`}
                    type="button"
                    role="listitem"
                    onClick={() => setMainImage(image)}
                    aria-label={`View image ${index + 1}`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-full object-contain"
                      loading="lazy"
                      decoding="async"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="overflow-y-auto p-4 sm:p-6 lg:p-10 pr-9 pl-7.5">
            <div className="flex items-center gap-2.5 mb-2">
              <span className="text-blue-soft text-xs font-medium tracking-widest uppercase">
                {product.category}
              </span>
              {product.badge ? (
                <span
                  className={`static rounded-full px-2.5 py-1 text-[10px] font-medium tracking-widest leading-tight uppercase pointer-events-none text-white ${
                    product.badge.toLowerCase().replace(/\s+/g, "-") ===
                    "bestseller"
                      ? "bg-gold"
                      : product.badge.toLowerCase().replace(/\s+/g, "-") ===
                          "new"
                        ? "bg-blue-soft"
                        : product.badge.toLowerCase().replace(/\s+/g, "-") ===
                            "sale"
                          ? "bg-danger"
                          : product.badge.toLowerCase().replace(/\s+/g, "-") ===
                              "gift-set"
                            ? "bg-brown-warm"
                            : "bg-text-dark text-cream"
                  }`}
                >
                  {product.badge}
                </span>
              ) : null}
            </div>

            <h2
              id="modal-product-name"
              className="mb-2.5 text-text-dark font-display text-3xl font-semibold leading-tight"
            >
              {product.name}
            </h2>

            <div className="flex flex-wrap items-center gap-1.5 mb-3.5">
              <span
                className="text-gold text-xs tracking-normal"
                aria-hidden="true"
              >
                ★★★★★
              </span>
              <span className="text-text-dark text-xs font-medium">
                {product.rating.toFixed(1)}
              </span>
              <span className="text-text-muted text-[11px]">
                ({product.reviews} reviews)
              </span>
              <span className="mx-2 text-text-muted">·</span>
              <a
                href="#reviews-section"
                className="text-blue-soft text-xs underline"
              >
                Read reviews
              </a>
            </div>

            <div className="flex flex-wrap items-baseline gap-2.5 mb-4.5">
              <span className="text-text-dark text-2xl font-medium">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice ? (
                <span className="text-text-muted text-base line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              ) : null}
              {discount ? (
                <span className="rounded px-2 py-0.75 bg-amber-50 text-amber-800 text-[11px] font-medium">
                  {discount}% OFF
                </span>
              ) : null}
            </div>

            <hr className="border-none border-t border-cream-dark my-4" />
            <p className="mb-5 text-brown-warm font-serif-poetic text-lg italic leading-relaxed">
              {product.tagline}
            </p>

            <div className="mb-5">
              <p className="mb-2.5 text-text-body text-xs font-medium tracking-widest uppercase">
                Select Option:{" "}
                <span className="text-blue-soft">{selectedVariant?.label}</span>
              </p>
              <div
                className="flex flex-wrap gap-2"
                role="radiogroup"
                aria-label="Product variants"
              >
                {product.variants.map((variant) => (
                  <button
                    key={variant.sku}
                    className={`min-h-[44px] border rounded-3xl px-4 py-2 text-xs transition-colors duration-150 ${selectedVariant?.sku === variant.sku ? "border-text-dark bg-text-dark text-white" : "border-cream-dark bg-white text-text-body hover:border-blue-soft hover:text-blue-soft focus-visible:border-blue-soft focus-visible:text-blue-soft"}`}
                    type="button"
                    role="radio"
                    aria-checked={selectedVariant?.sku === variant.sku}
                    onClick={() => setSelectedVariant(variant)}
                  >
                    {variant.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <p className="mb-2.5 text-text-body text-xs font-medium tracking-widest uppercase">
                Quantity
              </p>
              <div
                className="inline-flex items-center overflow-hidden border border-cream-dark rounded-md"
                role="group"
                aria-label="Quantity selector"
              >
                <button
                  className="flex h-11 w-11 items-center justify-center border-none bg-white text-text-dark transition-colors duration-150 hover:bg-cream-dark focus-visible:bg-cream-dark"
                  type="button"
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                  aria-label="Decrease quantity"
                >
                  <Icon name="minus" className="h-4 w-4" />
                </button>
                <span
                  className="w-12 border-x border-cream-dark bg-white text-center text-base font-medium leading-[44px] text-text-dark"
                  aria-live="polite"
                >
                  {quantity}
                </span>
                <button
                  className="flex h-11 w-11 items-center justify-center border-none bg-white text-text-dark transition-colors duration-150 hover:bg-cream-dark focus-visible:bg-cream-dark"
                  type="button"
                  onClick={() => setQuantity((value) => value + 1)}
                  aria-label="Increase quantity"
                >
                  <Icon name="plus" className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex gap-2.5 mb-5">
              <button
                className="flex-1 flex min-h-[48px] items-center justify-center gap-2 border-none rounded-md px-5 py-3.5 bg-text-dark text-cream text-sm font-medium tracking-widest uppercase transition-colors duration-200 hover:bg-blue-soft focus-visible:bg-blue-soft"
                type="button"
                onClick={() =>
                  onAddToCart(product.id, selectedVariant?.sku, quantity)
                }
                aria-label={`Add ${product.name} to cart`}
              >
                <Icon name="bag" className="h-5 w-5" />
                Add to Cart
              </button>
              <button
                className={`flex min-h-[48px] items-center gap-1.5 border border-cream-dark rounded-md px-4.5 py-3.5 bg-white text-text-body text-xs font-medium whitespace-nowrap transition-colors duration-200 ${isWishlisted ? "border-danger text-danger" : "hover:border-danger hover:text-danger focus-visible:border-danger focus-visible:text-danger"}`}
                type="button"
                onClick={() => onWishlist(product.id)}
                aria-label={`Save ${product.name} to wishlist`}
              >
                <Icon
                  name="heart"
                  className={`h-5 w-5 ${isWishlisted ? "fill-danger text-danger" : ""}`}
                />
                <span>
                  {isWishlisted ? "Saved to Wishlist" : "Save to Wishlist"}
                </span>
              </button>
            </div>
            <div className="border-t border-cream-dark">
              <details className="border-b border-cream-dark" open>
                <summary className="flex items-center justify-between py-4 text-text-dark cursor-pointer text-[13px] font-medium tracking-wide list-none select-none">
                  Description
                  <Icon
                    name="arrowRight"
                    className="transition-transform duration-200 group-open:rotate-270 h-4 w-4 rotate-90"
                  />
                </summary>
                <div className="pb-4">
                  <p className="text-text-body text-[13px] font-light leading-relaxed">
                    {product.description}
                  </p>
                </div>
              </details>

              <details className="border-b border-cream-dark">
                <summary className="flex items-center justify-between py-4 text-text-dark cursor-pointer text-[13px] font-medium tracking-wide list-none select-none">
                  Product Details
                  <Icon
                    name="arrowRight"
                    className="transition-transform duration-200 group-open:rotate-270 h-4 w-4 rotate-90"
                  />
                </summary>
                <div className="pb-4">
                  <ul className="p-0 list-none">
                    {product.details.map((detail) => (
                      <li
                        className="flex items-start gap-2 py-1 text-text-body text-[13px] font-light before:content-['-'] before:text-blue-soft"
                        key={detail}
                      >
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </details>

              <details className="border-b border-cream-dark">
                <summary className="flex items-center justify-between py-4 text-text-dark cursor-pointer text-[13px] font-medium tracking-wide list-none select-none">
                  Gifting & Packaging
                  <Icon
                    name="arrowRight"
                    className="transition-transform duration-200 group-open:rotate-270 h-4 w-4 rotate-90"
                  />
                </summary>
                <div className="pb-4">
                  <p className="text-text-body text-[13px] font-light leading-relaxed">
                    Every Starling Tales piece is lovingly packaged in a
                    keepsake box with tissue paper and a handwritten gift note,
                    ready to gift straight from the box.
                  </p>
                </div>
              </details>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
