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
  Maximize2,
  X,
  Truck,
  ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";

import "./StarlingTales.css";
import { useStore } from "../Store/StoreContext";
import {
  addToCart,
  updateCartQuantity,
  removeFromCart,
} from "../../redux/reducers/cartReducer";
import { toggleWishlist } from "../../redux/reducers/wishlistReducer";
import { HAMPER_OCCASIONS, HAMPER_PERKS, formatPrice } from "./constants";

import Icon from "./components/Icon";
import HeartDivider from "./components/HeartDivider";
import ProductModal from "./components/ProductModal";
import CartDrawer from "./components/CartDrawer";

// Local High-Res Hamper Assets
import hamper1 from "../../assests/hamper-1 (1).jpeg";
import hamper2 from "../../assests/hamper-1 (2).jpeg";
import hamper3 from "../../assests/hamper-1 (3).jpeg";
import hamper4 from "../../assests/hamper-1 (4).jpeg";
import hamper5 from "../../assests/hamper-1 (5).jpeg";

const LOCAL_DEFAULT_HAMPERS = [
  {
    id: "hamper-1",
    name: "The Heirloom Welcome Hamper",
    tagline:
      "A signature newborn welcome gift with hand-stitched companion and cosy muslin essentials.",
    price: 3999,
    originalPrice: 4599,
    image: hamper1,
    gallery: [hamper1, hamper2, hamper3],
    category: "Gift Hampers",
    occasion: "Newborn & Baby Shower",
    badge: "Bestseller",
    rating: 5.0,
    reviews: 64,
    inStock: true,
    description:
      "A timeless newborn greeting set presented in a reusable woven cotton rope basket. Features our beloved handmade companion, an organic waffle-knit blanket, a natural beechwood rattle, and a personalised calligraphy gift note.",
    includedItems: [
      "Handmade Giraffe Plush Companion (30cm)",
      "100% Organic Cotton Waffle Blanket (100x120cm)",
      "Smooth Natural Beechwood Rattle with gentle chime",
      "Embroidered Starling Muslin Keepsake Drawstring Pouch",
      "Wax-Sealed Hand-Calligraphed Welcome Card",
      "Handcrafted Woven Rope Basket with Linen Liner",
    ],
    details: [
      "Basket Dimensions: 32cm dia x 22cm ht",
      "Materials: 100% Organic Muslin Cotton & Hypoallergenic Plush",
      "Care: Spot clean basket, machine wash gentle for textiles",
      "Certification: CE Certified & Non-toxic infant safe",
      "Suitable from birth (0m+)",
    ],
    tags: ["newborn", "hamper", "bestseller", "baby shower", "all hampers"],
  },
  {
    id: "hamper-2",
    name: "Bunny Family Keepsake Basket",
    tagline:
      "Handcrafted knit companions nestled in an artisanal storage basket.",
    price: 4499,
    originalPrice: 4999,
    image: hamper2,
    gallery: [hamper2, hamper1, hamper4],
    category: "Gift Hampers",
    occasion: "Sibling & Twins",
    badge: "Gift Set",
    rating: 4.9,
    reviews: 48,
    inStock: true,
    description:
      "Handcrafted plush companions nestled inside an embroidered storage basket. Perfect for nursery decor, sibling gifting, or twin baby celebrations.",
    includedItems: [
      "Handcrafted Plush Companions (25cm each)",
      "Hand-stitched Outfits & Organic Swaddles",
      "Premium Thick-Woven Rope Nursery Basket (26cm dia)",
      "Personalised Embroidered Initial Patch",
      "Botanical Gifting Tag with Dried Lavender Sachet",
    ],
    details: [
      "Set includes companions + 1 woven basket",
      "Dimensions: 26cm dia x 20cm ht",
      "Material: Cotton linen blend with hypoallergenic polyfill",
      "Spot clean only",
      "Suitable for ages 0+",
    ],
    tags: ["bunnies", "siblings", "basket", "keepsake", "all hampers"],
  },
  {
    id: "hamper-3",
    name: "Blushing Rose Keepsake Box",
    tagline:
      "A dreamscape collection with pastel ribbons and pure organic muslin essentials.",
    price: 4899,
    originalPrice: 5499,
    image: hamper3,
    gallery: [hamper3, hamper1, hamper5],
    category: "Gift Hampers",
    occasion: "Newborn & Baby Shower",
    badge: "Luxury",
    rating: 4.9,
    reviews: 52,
    inStock: true,
    description:
      "An enchanting nursery curation wrapped with soft rose ribbons, pure muslin swaddles, soft knitted baby booties, and a hardbound illustrated bedtime chronicle.",
    includedItems: [
      "Artisanal Companion Plush with Velvet Accents",
      "Reversible Pastel Muslin Quilt (100x130cm)",
      "Handmade Knitted Organic Cotton Booties",
      "Starling Tales Bedtime Storybook & Bookmark",
      "Signature Woven Keepsake Basket with Linen Lining",
    ],
    details: [
      "Basket Dimensions: 35cm x 28cm x 15cm",
      "Quilt: 4-layer 100% breathable organic cotton muslin",
      "Safe from birth (0m+)",
      "Re-usable heirloom storage chest",
    ],
    tags: ["rose", "quilt", "woodland", "nursery", "luxury", "all hampers"],
  },
  {
    id: "hamper-4",
    name: "Sleepy Bunny Nursery Cloud Set",
    tagline:
      "An imaginative milestone gift with signature velvet bunny & cloud swaddles.",
    price: 5299,
    originalPrice: 5999,
    image: hamper4,
    gallery: [hamper4, hamper2, hamper3],
    category: "Gift Hampers",
    occasion: "Milestone & Birthday",
    badge: "Personalised",
    rating: 4.8,
    reviews: 39,
    inStock: true,
    description:
      "The ultimate birthday and milestone gift. Features our signature handcrafted velvet bunny paired with sky-blue cloud textiles, keepsake adventure cards, and a woven storage tray.",
    includedItems: [
      "Handcrafted Velvet Bunny Companion (30cm)",
      "Sky-Blue Cloud Organic Muslin Blanket",
      "Set of Double-Sided Wooden Milestone Discs",
      "Embroidered Custom Name Tag",
      "Festive Gifting Box with Ribbon & Keepsake Wax Seal",
    ],
    details: [
      "Dimensions: 28cm x 22cm x 10cm",
      "Plush: 100% cotton with soft hypoallergenic filling",
      "Personalisation included in package price",
      "Suitable for ages 0 to 5 years",
    ],
    tags: ["bunny", "cloud", "birthday", "personalised", "all hampers"],
  },
  {
    id: "hamper-5",
    name: "Golden Sunshine Celebration Trunk",
    tagline:
      "Gentle companion with golden satin bow, sweet surprises and organic bodysuits.",
    price: 4299,
    originalPrice: 4899,
    image: hamper5,
    gallery: [hamper5, hamper1, hamper2],
    category: "Gift Hampers",
    occasion: "Milestone & Birthday",
    badge: "New",
    rating: 4.9,
    reviews: 31,
    inStock: true,
    description:
      "A golden celebration trunk wrapped with luxurious satin ribbons, premium organic cotton essentials, and beloved keepsakes to celebrate cherished moments.",
    includedItems: [
      "Plush Companion with Pocket Surprises",
      "Pure Organic Golden Trim Muslin Swaddle",
      "Handmade Wooden Rattle & Teether",
      "Baby First Moments Milestone Journal",
      "Woven Keepsake Basket with Satin Bow Ribbon",
    ],
    details: [
      "Basket Dimensions: 30cm dia x 18cm ht",
      "Textiles: 100% Certified Organic Muslin",
      "Non-toxic vegetable dyes",
      "Suitable from birth (0m+)",
    ],
    tags: ["golden", "sunshine", "trunk", "celebration", "all hampers"],
  },
];

export default function StarlingGiftHampers() {
  const dispatch = useDispatch();
  const { products: apiProducts, categories } = useStore();

  const cartItems = useSelector((s) => s.cart?.cartItems || []);
  const wishlistItems = useSelector((s) => s.wishlist?.items || []);

  const [activeOccasion, setActiveOccasion] = useState("All Hampers");
  const [quickViewHamper, setQuickViewHamper] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedImageMap, setSelectedImageMap] = useState({});
  const [previewModalImage, setPreviewModalImage] = useState(null);

  // Helper to check if product belongs to Gift Hamper category
  const isGiftHamperProduct = (p) => {
    const directCatName = (
      p.category?.name ||
      p.category?.title ||
      (typeof p.category === "string" ? p.category : "") ||
      p.categoryName ||
      ""
    )
      .toLowerCase()
      .trim();

    let resolvedCatName = directCatName;
    if (categories && Array.isArray(categories) && p.category) {
      const catId = p.category?._id || p.category;
      const foundCat = categories.find((c) => (c._id || c.id) === catId);
      if (foundCat?.name) {
        resolvedCatName = foundCat.name.toLowerCase().trim();
      }
    }

    const matchesCategory =
      resolvedCatName.includes("hamper") ||
      resolvedCatName.includes("gift set") ||
      resolvedCatName.includes("gift-set") ||
      resolvedCatName.includes("gift basket");

    const matchesTags =
      Array.isArray(p.tags) &&
      p.tags.some((t) => {
        const tag = String(t).toLowerCase().trim();
        return (
          tag.includes("hamper") ||
          tag.includes("gift set") ||
          tag.includes("gifthamper")
        );
      });

    const matchesName = (p.name || "").toLowerCase().includes("hamper");

    return matchesCategory || matchesTags || matchesName;
  };

  // Filter products or fallback to local curated hampers
  const hampersList = useMemo(() => {
    const allProducts = Array.isArray(apiProducts) ? apiProducts : [];
    const matchedApiHampers = allProducts.filter(isGiftHamperProduct);

    if (matchedApiHampers.length > 0) {
      return matchedApiHampers.map((p, idx) => {
        const categoryTitle =
          p.category?.name ||
          p.category?.title ||
          (typeof p.category === "string" ? p.category : "") ||
          "Gift Hampers";

        const rawImgs =
          p.images?.length > 0
            ? p.images.map((img) => (typeof img === "object" ? img.url : img))
            : [LOCAL_DEFAULT_HAMPERS[idx % LOCAL_DEFAULT_HAMPERS.length].image];

        return {
          id: p._id,
          name: p.name,
          tagline:
            p.tagline ||
            (p.description ? p.description.split(".")[0] + "." : p.name),
          price: p.price,
          originalPrice: p.compareAtPrice || null,
          image: rawImgs[0],
          gallery: rawImgs,
          category: categoryTitle,
          occasion: p.occasion || "Gift Hampers",
          badge:
            p.badge ||
            (p.compareAtPrice > p.price
              ? "Sale"
              : idx % 2 === 0
                ? "Bestseller"
                : "Gift Set"),
          rating: p.rating || 4.9,
          reviews: p.numReviews || 24,
          inStock: p.stock === undefined || p.stock > 0,
          description: p.description || "",
          includedItems: p.includedItems?.length
            ? p.includedItems
            : [
                "Handcrafted Companion Toy",
                "Organic Cotton Muslin Textile",
                "Woven Keepsake Storage Basket",
                "Calligraphy Card & Wax Seal",
              ],
          details: p.details?.length
            ? p.details
            : [
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
        };
      });
    }

    return LOCAL_DEFAULT_HAMPERS;
  }, [apiProducts, categories]);

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

  // Redux Cart Mapping
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
      typeof productOrId === "object" && productOrId !== null
        ? productOrId
        : hampersList.find(
            (h) => h.id === productOrId || h._id === productOrId,
          );

    if (!product) return;

    dispatch(
      addToCart({
        product: {
          _id: product.id || product._id,
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
      </div>

      {/* Hero Header Section */}
      <div className="bg-gradient-to-b from-[#F7F3EB] via-cream to-cream px-6 pt-10 pb-12 text-center border-b border-[#E8DFC8]/40">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E8DFC8] text-[11px] font-bold tracking-[0.24em] uppercase text-text-dark shadow-2xs">
            <Gift size={13} className="text-gold" />
            <span>The Gifting Atelier</span>
          </div>

          <div className="py-1">
            <HeartDivider centered={true} />
          </div>

          <h1 className="font-display text-[38px] sm:text-[48px] lg:text-[54px] leading-[1.1] text-text-dark font-normal">
            Bespoke Gift Hampers
          </h1>

          <p className="text-[14.5px] sm:text-[15px] font-light leading-[1.8] text-text-body max-w-2xl mx-auto">
            Thoughtfully packaged with delicate tissue, pressed botanical wax
            seals, and hand-calligraphed cards for every unforgettable
            celebration.
          </p>
        </div>
      </div>

      {/* Main Hampers Showcase Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
        {filteredHampers.length === 0 ? (
          <div className="text-center py-16 bg-cream-dark/60 rounded-3xl border border-[#E8DFC8]/60 p-8 max-w-xl mx-auto space-y-4">
            <Gift size={36} className="mx-auto text-gold" />
            <h3 className="font-display text-xl font-semibold text-text-dark">
              No Gift Hampers Found
            </h3>
            <p className="text-xs text-text-muted font-light leading-relaxed">
              We currently don't have items matching this filter.
            </p>
          </div>
        ) : (
          <div className="space-y-12 md:space-y-16">
            {filteredHampers.map((hamper, index) => {
              const wishlisted = isWishlisted(hamper.id);
              const reverse = index % 2 !== 0;
              const currentActiveImg =
                selectedImageMap[hamper.id] || hamper.image;

              return (
                <div
                  key={hamper.id}
                  className="mx-auto max-w-6xl rounded-3xl sm:rounded-[36px] overflow-hidden border border-[#E8DFC8] bg-white shadow-[0_8px_30px_rgba(44,62,53,0.06)] transition-all duration-300 hover:shadow-[0_16px_40px_rgba(44,62,53,0.1)]"
                >
                  <div
                    className={`grid md:grid-cols-12 ${
                      reverse ? "md:[&>div:first-child]:order-2" : ""
                    }`}
                  >
                    {/* ================= FULL IMAGE SHOWCASE COLUMN (6 cols) ================= */}
                    <div className="md:col-span-6 relative min-h-[380px] sm:min-h-[460px] md:min-h-[520px] bg-gradient-to-br from-[#FAF7F2] via-[#F5EFE6] to-[#EAE2D2] flex flex-col items-center justify-center p-6 sm:p-8 overflow-hidden group">
                      {/* Ambient Blur Backdrop */}
                      <img
                        src={currentActiveImg}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover blur-2xl opacity-25 scale-110 pointer-events-none"
                      />

                      {/* Top Badge */}
                      {hamper.badge && (
                        <div className="absolute left-6 top-6 z-20 bg-white/95 backdrop-blur-xs px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-text-dark shadow-xs rounded-full border border-[#E8DFC8]">
                          {hamper.badge}
                        </div>
                      )}

                      {/* Top Action Buttons (Wishlist & Full View) */}
                      <div className="absolute right-6 top-6 z-20 flex items-center gap-2">
                        {/* Full Image Lightbox Trigger */}
                        <button
                          type="button"
                          onClick={() => setPreviewModalImage(currentActiveImg)}
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-text-dark shadow-xs border border-[#E8DFC8] transition-all hover:scale-110 cursor-pointer"
                          title="View Full High-Res Image"
                          aria-label="View Full Image"
                        >
                          <Maximize2 size={15} className="text-[#2C3E35]" />
                        </button>

                        {/* Wishlist Button */}
                        <button
                          type="button"
                          onClick={() => handleWishlistToggle(hamper.id)}
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-text-dark shadow-xs border border-[#E8DFC8] transition-all hover:scale-110 cursor-pointer"
                          aria-label="Toggle Wishlist"
                        >
                          <Heart
                            size={16}
                            strokeWidth={1.5}
                            className={
                              wishlisted
                                ? "fill-[#C85C5C] text-[#C85C5C]"
                                : "text-text-dark hover:text-[#C85C5C]"
                            }
                          />
                        </button>
                      </div>

                      {/* FULL UNCROPPED HAMPER IMAGE CONTAINER */}
                      <div
                        className="relative z-10 w-full h-full max-h-[420px] flex items-center justify-center cursor-pointer"
                        onClick={() => setPreviewModalImage(currentActiveImg)}
                      >
                        <img
                          src={currentActiveImg}
                          alt={hamper.name}
                          className="max-h-[360px] sm:max-h-[420px] w-auto max-w-full object-contain drop-shadow-2xl rounded-2xl transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>

                      {/* Gallery Thumbnails Switcher (if multiple images) */}
                      {hamper.gallery && hamper.gallery.length > 1 && (
                        <div className="absolute bottom-5 z-20 flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#E8DFC8] shadow-sm">
                          {hamper.gallery.map((thumb, tIdx) => (
                            <button
                              key={tIdx}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedImageMap((prev) => ({
                                  ...prev,
                                  [hamper.id]: thumb,
                                }));
                              }}
                              className={`w-9 h-9 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                                currentActiveImg === thumb
                                  ? "border-[#2C3E35] scale-110 shadow-xs ring-1 ring-[#2C3E35]"
                                  : "border-transparent opacity-60 hover:opacity-100"
                              }`}
                            >
                              <img
                                src={thumb}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Bottom-left label */}
                      <div className="absolute bottom-5 left-5 z-10 hidden sm:flex items-center gap-1.5 bg-[#2C3E35]/90 text-cream text-[9.5px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full backdrop-blur-xs">
                        <Sparkles size={11} className="text-gold" />
                        <span>Artisan Hamper</span>
                      </div>
                    </div>

                    {/* ================= CONTENT COLUMN (6 cols) ================= */}
                    <div className="md:col-span-6 flex items-center bg-[#FAF7F2] p-6 sm:p-10 md:p-12 lg:p-14">
                      <div className="w-full max-w-xl space-y-5">
                        {/* Occasion Header & Divider */}
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#9A8D82]">
                            {hamper.occasion || "Gift Hampers"}
                          </p>
                          <div className="mt-2">
                            <HeartDivider centered={false} />
                          </div>
                        </div>

                        {/* Hamper Title */}
                        <h3 className="font-display text-[28px] sm:text-[34px] lg:text-[38px] leading-[1.15] text-[#2C3E35] font-normal">
                          {hamper.name}
                        </h3>

                        {/* Description */}
                        <p className="text-[13.5px] font-light leading-[1.8] text-[#5B5B5B]">
                          {hamper.description || hamper.tagline}
                        </p>

                        {/* Included Items List */}
                        {hamper.includedItems?.length > 0 && (
                          <div className="bg-white/80 rounded-2xl p-4 border border-[#E8DFC8]/70 shadow-2xs space-y-2">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7A695B]">
                              Inside this curated hamper
                            </p>
                            <div className="grid gap-2 sm:grid-cols-2">
                              {hamper.includedItems
                                .slice(0, 4)
                                .map((item, itemIndex) => (
                                  <div
                                    key={itemIndex}
                                    className="flex items-start gap-2 text-xs text-[#5B5B5B]"
                                  >
                                    <CheckCircle2
                                      size={13}
                                      className="text-emerald-600 shrink-0 mt-0.5"
                                    />
                                    <span className="leading-snug">{item}</span>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}

                        {/* Price + Reviews Block */}
                        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[#E8DFC8]/70">
                          <div>
                            <span className="text-[10px] uppercase tracking-wider text-[#9A8D82] font-semibold block">
                              Hamper Set Price
                            </span>
                            <div className="flex items-baseline gap-2.5 mt-0.5">
                              <span className="font-display text-2xl sm:text-3xl font-semibold text-[#2C3E35]">
                                {formatPrice(hamper.price)}
                              </span>
                              {hamper.originalPrice && (
                                <span className="text-sm text-[#9A8D82] line-through">
                                  {formatPrice(hamper.originalPrice)}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 text-xs text-[#5B5B5B] bg-white px-3 py-1.5 rounded-full border border-[#E8DFC8]">
                            <div className="flex text-amber-500">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} size={12} fill="currentColor" />
                              ))}
                            </div>
                            <span className="font-bold">
                              {hamper.rating || 5.0}
                            </span>
                            <span className="text-[#9A8D82]">
                              ({hamper.reviews || 48})
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap items-center gap-3 pt-2">
                          <button
                            type="button"
                            onClick={() =>
                              handleAddToCart(hamper, hamper.id, 1)
                            }
                            className="flex-1 min-w-[180px] inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#2C3E35] hover:bg-[#1E2B25] text-white text-xs font-bold uppercase tracking-[0.18em] rounded-full transition-all duration-200 shadow-md cursor-pointer group"
                          >
                            <ShoppingBag size={15} />
                            <span>Add Hamper to Bag</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setQuickViewHamper(hamper)}
                            className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-white hover:bg-[#FAF7F2] text-[#2C3E35] text-xs font-bold uppercase tracking-[0.16em] rounded-full border border-[#D5C7B2] transition-all cursor-pointer shadow-2xs"
                          >
                            <Eye size={15} />
                            <span>Details</span>
                          </button>
                        </div>

                        {/* Bottom Note */}
                        <div className="mt-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] text-[#9A8D82] font-semibold">
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
        )}
      </div>

      {/* Atelier Service Perks Banner */}
      <div className="bg-[#FAF7F2] border-t border-[#E8DFC8] py-14 px-6">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center p-4 bg-white rounded-2xl border border-[#E8DFC8]/60 shadow-2xs">
            <div className="w-12 h-12 rounded-full bg-cream flex items-center justify-center text-[#7A695B] mb-3 border border-[#E8DFC8]">
              <Gift size={20} className="text-gold" />
            </div>
            <h4 className="font-display font-semibold text-sm text-[#2C3E35] mb-1">
              Bespoke Gift Boxes
            </h4>
            <p className="text-xs text-text-body font-light">
              Handcrafted keepsake rope baskets with custom floral wax seals.
            </p>
          </div>

          <div className="flex flex-col items-center p-4 bg-white rounded-2xl border border-[#E8DFC8]/60 shadow-2xs">
            <div className="w-12 h-12 rounded-full bg-cream flex items-center justify-center text-[#7A695B] mb-3 border border-[#E8DFC8]">
              <Truck size={20} className="text-gold" />
            </div>
            <h4 className="font-display font-semibold text-sm text-[#2C3E35] mb-1">
              White Glove Delivery
            </h4>
            <p className="text-xs text-text-body font-light">
              Carefully protected pan-India shipping for milestone surprises.
            </p>
          </div>

          <div className="flex flex-col items-center p-4 bg-white rounded-2xl border border-[#E8DFC8]/60 shadow-2xs">
            <div className="w-12 h-12 rounded-full bg-cream flex items-center justify-center text-[#7A695B] mb-3 border border-[#E8DFC8]">
              <ShieldCheck size={20} className="text-gold" />
            </div>
            <h4 className="font-display font-semibold text-sm text-[#2C3E35] mb-1">
              100% Organic & Safe
            </h4>
            <p className="text-xs text-text-body font-light">
              GOTS certified muslin and hypoallergenic infant-tested toys.
            </p>
          </div>

          <div className="flex flex-col items-center p-4 bg-white rounded-2xl border border-[#E8DFC8]/60 shadow-2xs">
            <div className="w-12 h-12 rounded-full bg-cream flex items-center justify-center text-[#7A695B] mb-3 border border-[#E8DFC8]">
              <Sparkles size={20} className="text-gold" />
            </div>
            <h4 className="font-display font-semibold text-sm text-[#2C3E35] mb-1">
              Calligraphy Card
            </h4>
            <p className="text-xs text-text-body font-light">
              Complimentary personalized handwritten message in every hamper.
            </p>
          </div>
        </div>
      </div>

      {/* FULLSCREEN IMAGE LIGHTBOX MODAL */}
      {previewModalImage && (
        <div
          className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setPreviewModalImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPreviewModalImage(null)}
              className="absolute -top-12 right-0 sm:top-4 sm:right-4 z-30 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md transition cursor-pointer"
              aria-label="Close Lightbox"
            >
              <X size={24} />
            </button>

            <img
              src={previewModalImage}
              alt="Hamper Full View"
              className="max-h-[85vh] max-w-full object-contain rounded-2xl shadow-2xl border border-white/20"
            />
          </div>
        </div>
      )}

      {/* Quick View Drawer Modal */}
      {quickViewHamper && (
        <ProductModal
          product={quickViewHamper}
          isWishlisted={isWishlisted(quickViewHamper.id)}
          onClose={() => setQuickViewHamper(null)}
          onWishlist={handleWishlistToggle}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Cart Drawer */}
      {cartOpen && (
        <CartDrawer
          open={cartOpen}
          onClose={() => setCartOpen(false)}
          cart={mappedCart}
          products={hampersList}
          onQty={handleUpdateQty}
          onRemove={handleRemoveFromCart}
          onCheckout={handleCheckout}
        />
      )}
    </div>
  );
}
