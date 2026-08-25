import React, { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Sparkles,
  Gift,
  Heart,
  Eye,
  ShoppingBag,
  CheckCircle2,
  Star,
} from "lucide-react";
import toast from "react-hot-toast";

import "./StarlingTales.css";
import { useStore } from "../Store/StoreContext";
import {
  addToCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
} from "../../redux/reducers/cartReducer";
import { toggleWishlist } from "../../redux/reducers/wishlistReducer";
import {
  GIFT_HAMPERS,
  HAMPER_OCCASIONS,
  HAMPER_PERKS,
  formatPrice,
} from "./constants";

import Icon from "./components/Icon";
import HeartDivider from "./components/HeartDivider";
import ProductModal from "./components/ProductModal";
import CartDrawer from "./components/CartDrawer";

export default function StarlingGiftHampers() {
  const dispatch = useDispatch();
  const { products: apiProducts } = useStore();

  const cartItems = useSelector((s) => s.cart?.cartItems || []);
  const wishlistItems = useSelector((s) => s.wishlist?.items || []);

  const [activeOccasion, setActiveOccasion] = useState("All Hampers");
  const [quickViewHamper, setQuickViewHamper] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);

  // Filter backend products if any are hampers, otherwise strictly use GIFT_HAMPERS
  const hampersList = useMemo(() => {
    const apiHampers = (apiProducts || [])
      .filter(
        (p) =>
          p.category?.name?.toLowerCase().includes("hamper") ||
          p.tags?.some((t) => t.toLowerCase().includes("hamper")),
      )
      .map((p, idx) => ({
        id: p._id,
        name: p.name,
        tagline:
          p.tagline || (p.description ? p.description.split(".")[0] + "." : p.name),
        price: p.price,
        originalPrice: p.compareAtPrice || null,
        image: p.images?.[0]?.url || "https://starlingtales.vercel.app/19.jpeg",
        gallery:
          p.images?.length > 0
            ? p.images.map((img) => img.url)
            : ["https://starlingtales.vercel.app/19.jpeg"],
        category: "Gift Hampers",
        occasion: "Newborn & Baby Shower",
        badge: idx % 2 === 0 ? "Bestseller" : "Gift Set",
        rating: p.rating || 4.9,
        reviews: p.numReviews || 24,
        inStock: p.stock === undefined || p.stock > 0,
        description: p.description || "",
        includedItems: [
          "Handcrafted Companion Toy",
          "Organic Cotton Muslin Textile",
          "Woven Keepsake Storage Basket",
          "Calligraphy Card & Wax Seal",
        ],
        details: p.details || [
          "100% GOTS Certified Organic Cotton",
          "Safety certified & hypoallergenic",
          "Reusable heirloom container",
        ],
        tags: p.tags || ["hamper", "gift"],
        variants: p.variants?.length
          ? p.variants.map((v, i) => ({
              label: v.label || v.name || `Option ${i + 1}`,
              sku: v.sku || `${p._id}-${i}`,
            }))
          : [{ label: "Standard Set", sku: p._id }],
      }));

    const existingNames = new Set(apiHampers.map((h) => h.name.toLowerCase()));
    const filteredCurated = GIFT_HAMPERS.filter(
      (h) => !existingNames.has(h.name.toLowerCase()),
    );

    return [...apiHampers, ...filteredCurated];
  }, [apiProducts]);

  // Filter by occasion
  const filteredHampers = useMemo(() => {
    if (activeOccasion === "All Hampers") return hampersList;
    return hampersList.filter((h) => {
      if (!h.occasion) return true;
      return (
        h.occasion.toLowerCase() === activeOccasion.toLowerCase() ||
        h.tags?.some((t) => t.toLowerCase() === activeOccasion.toLowerCase())
      );
    });
  }, [hampersList, activeOccasion]);

  // Redux Cart Mapping for CartDrawer
  const mappedCart = useMemo(() => {
    return cartItems.map((item) => ({
      productId: item._id,
      sku: item._id,
      variantLabel: "Standard",
      quantity: item.quantity,
    }));
  }, [cartItems]);

  const isWishlisted = (id) => wishlistItems.some((item) => item._id === id);

  // Cart & Wishlist Actions
  const handleAddToCart = (productOrId, sku, qty = 1) => {
    const product =
      typeof productOrId === "object"
        ? productOrId
        : hampersList.find((h) => h.id === productOrId);

    if (!product) return;

    dispatch(
      addToCart({
        product: {
          _id: product.id,
          name: product.name,
          price: product.price,
          images: [{ url: product.image }],
          stock: 99,
        },
        quantity: qty,
      }),
    );
    toast.success(`${product.name} added to your cart!`);
    setCartOpen(true);
  };

  const handleWishlistToggle = (productId) => {
    const product = hampersList.find((h) => h.id === productId);
    if (!product) return;

    dispatch(
      toggleWishlist({
        _id: product.id,
        name: product.name,
        price: product.price,
        images: [{ url: product.image }],
      }),
    );
    toast.success(
      isWishlisted(productId)
        ? `Removed from wishlist`
        : `Added ${product.name} to wishlist`,
    );
  };

  const handleUpdateQty = (productId, sku, newQty) => {
    if (newQty <= 0) {
      dispatch(removeFromCart({ productId: sku }));
    } else {
      dispatch(updateCartQuantity({ productId: sku, quantity: newQty }));
    }
  };

  const handleRemoveFromCart = (productId, sku) => {
    dispatch(removeFromCart({ productId: sku }));
  };

  const handleCheckout = () => {
    setCartOpen(false);
    toast.success("Proceeding to checkout!");
  };

  return (
    <div className="min-h-screen bg-cream text-text-dark font-sans selection:bg-blue-light selection:text-blue-soft relative overflow-x-hidden">
      {/* Top Banner Notice */}
      <div className="bg-text-dark text-cream text-[11px] tracking-[0.2em] uppercase py-2.5 text-center font-medium px-4 flex items-center justify-center gap-2">
        <Sparkles size={13} className="text-gold" />
        <span>Free shipping on all heirloom keepsakes over ₹5,000</span>
        <Sparkles size={13} className="text-gold" />
      </div>

      {/* Main Hampers Section */}
      <main className="py-16 px-6 max-w-7xl mx-auto space-y-12">
        {/* Section Intro matching Nursery Collection */}
        <div className="text-center space-y-3.5">
          <p className="text-[11px] font-semibold tracking-[0.24em] uppercase text-blue-soft">
            Our Gift Collection
          </p>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-semibold text-text-dark">
            Gifts made for meaningful moments.
          </h1>

          <HeartDivider centered={true} />

          <p className="text-xs sm:text-sm text-text-muted max-w-xl mx-auto leading-relaxed font-light">
            From tiny beginnings to unforgettable celebrations, each hamper
            brings together beautiful handcrafted companions, soft organic textiles,
            and safe keepsakes that make gifting feel personal.
          </p>

          {/* Categories / Occasions Tab Bar */}
          <div
            className="flex flex-wrap items-center justify-center gap-2 pt-4"
            role="tablist"
            aria-label="Gift Hamper occasions"
          >
            {HAMPER_OCCASIONS.map((occasion) => {
              const active = activeOccasion === occasion;
              return (
                <button
                  key={occasion}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveOccasion(occasion)}
                  className={`min-h-[38px] px-5 py-1.5 rounded-full text-xs font-medium transition-all duration-150 cursor-pointer ${
                    active
                      ? "bg-text-dark text-cream"
                      : "bg-white border border-cream-dark text-text-body hover:border-blue-soft hover:text-blue-soft"
                  }`}
                >
                  {occasion}
                </button>
              );
            })}
          </div>
        </div>

        {/* Hampers Editorial Cards with mx-auto & small gap */}
        <div className="space-y-8 md:space-y-12">
            {filteredHampers.map((hamper, index) => {
              const wishlisted = isWishlisted(hamper.id);
              const reverse = index % 2 !== 0;

              return (
                <div
                  key={hamper.id}
                  className="mx-auto max-w-6xl rounded-3xl overflow-hidden border border-[#E8DFC8]/60 bg-cream-dark shadow-[0_4px_24px_rgba(44,62,53,0.06)] transition-all duration-300 hover:shadow-[0_12px_36px_rgba(44,62,53,0.1)]"
                >
                  <div
                    className={`grid md:grid-cols-2 ${
                      reverse ? "md:[&>div:first-child]:order-2" : ""
                    }`}
                  >
                    {/* IMAGE COLUMN */}
                    <div className="relative min-h-[380px] sm:min-h-[440px] md:min-h-[520px] bg-[#F2EDE2] flex items-center justify-center overflow-hidden group">
                      <img
                        src={hamper.image}
                        alt={hamper.name}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />

                      {/* Badge */}
                      {hamper.badge && (
                        <div className="absolute left-6 top-6 bg-white/95 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-text-dark shadow-sm rounded-sm">
                          {hamper.badge}
                        </div>
                      )}

                      {/* Wishlist Button */}
                      <button
                        type="button"
                        onClick={() => handleWishlistToggle(hamper.id)}
                        className="absolute right-6 top-6 flex h-11 w-11 items-center justify-center rounded-full bg-white/95 shadow-sm transition-all duration-200 hover:scale-110"
                        aria-label="Toggle Wishlist"
                      >
                        <Heart
                          size={18}
                          strokeWidth={1.5}
                          className={
                            wishlisted
                              ? "fill-[#C85C5C] text-[#C85C5C]"
                              : "text-text-dark hover:text-[#C85C5C]"
                          }
                        />
                      </button>

                      {/* Image Bottom Label */}
                      <div className="absolute bottom-6 left-6 bg-text-dark/90 px-4 py-2.5 backdrop-blur-sm rounded-sm">
                        <p className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-cream">
                          <Sparkles size={13} className="text-gold" />
                          Thoughtfully Curated
                        </p>
                      </div>
                    </div>

                    {/* CONTENT COLUMN */}
                    <div className="flex items-center bg-cream-dark px-6 py-10 sm:py-12 md:px-12 lg:px-16">
                      <div className="w-full max-w-xl">
                        {/* Occasion Label */}
                        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#9B8050]">
                          {hamper.occasion || "Gift Hampers"}
                        </p>

                        {/* Divider */}
                        <div className="mt-4">
                          <HeartDivider centered={false} />
                        </div>

                        {/* Title */}
                        <h3 className="mt-6 font-display text-[30px] sm:text-[36px] lg:text-[40px] leading-[1.1] text-text-dark">
                          {hamper.name}
                        </h3>

                        {/* Description */}
                        <p className="mt-4 max-w-lg text-[14px] font-light leading-[1.85] text-text-body">
                          {hamper.description ||
                            hamper.tagline ||
                            "A beautifully curated collection created to make your special moment even more memorable."}
                        </p>

                        {/* Included Items Checklist */}
                        {hamper.includedItems?.length > 0 && (
                          <div className="mt-6">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-dark mb-2.5">
                              Inside the hamper
                            </p>

                            <div className="grid gap-2 sm:grid-cols-2">
                              {hamper.includedItems
                                .slice(0, 4)
                                .map((item, itemIndex) => (
                                  <div
                                    key={itemIndex}
                                    className="flex items-start gap-2.5"
                                  >
                                    <CheckCircle2
                                      size={14}
                                      className="mt-0.5 shrink-0 text-[#A68550]"
                                    />
                                    <span className="text-[12px] leading-5 text-text-body font-light">
                                      {item}
                                    </span>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}

                        {/* Details */}
                        {hamper.details?.length > 0 && (
                          <div className="mt-6 border-t border-[#DCD2BC] pt-4">
                            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-text-dark">
                              Details
                            </p>
                            <div className="space-y-1">
                              {hamper.details.slice(0, 3).map((detail, i) => (
                                <p
                                  key={i}
                                  className="text-[11px] leading-relaxed text-text-body font-light"
                                >
                                  • {detail}
                                </p>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Price + Rating */}
                        <div className="mt-7 flex flex-wrap items-end justify-between gap-4">
                          <div>
                            <p className="text-[10px] uppercase tracking-[0.18em] text-text-muted">
                              Gift set
                            </p>
                            <div className="mt-1 flex items-center gap-3">
                              <span className="font-display text-2xl font-semibold text-text-dark">
                                {formatPrice(hamper.price)}
                              </span>
                              {hamper.originalPrice && (
                                <span className="text-sm text-text-muted line-through">
                                  {formatPrice(hamper.originalPrice)}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Rating */}
                          <div className="flex items-center gap-1.5">
                            <div className="flex gap-0.5">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  size={13}
                                  className="fill-[#A68550] text-[#A68550]"
                                />
                              ))}
                            </div>
                            <span className="text-[11px] text-text-body font-medium">
                              {hamper.rating || 4.9} · ({hamper.reviews || 24} reviews)
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-8 flex flex-wrap gap-3">
                          <button
                            type="button"
                            onClick={() => setQuickViewHamper(hamper)}
                            className="inline-flex min-h-12 items-center justify-center gap-2 border border-text-dark bg-transparent px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.17em] text-text-dark transition-all duration-200 hover:bg-text-dark hover:text-cream cursor-pointer rounded-sm"
                          >
                            <Eye size={15} />
                            <span>View Details</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleAddToCart(hamper)}
                            disabled={hamper.inStock === false}
                            className="inline-flex min-h-12 items-center justify-center gap-2 border border-text-dark bg-text-dark px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.17em] text-cream transition-all duration-200 hover:bg-blue-soft disabled:opacity-50 cursor-pointer shadow-sm rounded-sm"
                          >
                            <ShoppingBag size={15} />
                            <span>
                              {hamper.inStock === false
                                ? "Out of Stock"
                                : "Add to Gift Bag"}
                            </span>
                          </button>
                        </div>

                        {/* Bottom Note */}
                        <div className="mt-6 flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] text-text-muted">
                          <Gift size={14} className="text-gold" />
                          <span>Beautifully wrapped & ready to gift</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </main>

      {/* Perks Showcase */}
      <section className="bg-white border-b border-[#E8DFC8]/50 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {HAMPER_PERKS.map((perk, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 p-4 rounded-xl bg-[#FAF7F2]/60 border border-[#E8DFC8]/30 transition-all hover:bg-[#FAF7F2]"
              >
                <div className="w-11 h-11 rounded-xl bg-white border border-[#E8DFC8] flex items-center justify-center shrink-0 text-[#8A6D53] shadow-sm">
                  <Icon name={perk.icon} className="w-5 h-5 text-text-dark" />
                </div>
                <div>
                  <h4 className="font-display font-semibold text-text-dark text-sm mb-1">
                    {perk.title}
                  </h4>
                  <p className="text-xs text-text-muted leading-relaxed font-light">
                    {perk.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick View Hamper Modal */}
      {quickViewHamper && (
        <ProductModal
          product={quickViewHamper}
          isWishlisted={isWishlisted(quickViewHamper.id)}
          onClose={() => setQuickViewHamper(null)}
          onWishlist={(id) => handleWishlistToggle(id)}
          onAddToCart={(productId, sku, qty) => {
            handleAddToCart(quickViewHamper, sku, qty);
          }}
        />
      )}

      {/* Slide-out Cart Drawer */}
      {cartOpen && (
        <CartDrawer
          open={cartOpen}
          cart={mappedCart}
          products={hampersList}
          onClose={() => setCartOpen(false)}
          onQty={handleUpdateQty}
          onRemove={handleRemoveFromCart}
          onCheckout={handleCheckout}
        />
      )}
    </div>
  );
}
