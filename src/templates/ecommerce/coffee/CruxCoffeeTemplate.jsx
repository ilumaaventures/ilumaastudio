import React, { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  addToCart,
  updateCartQuantity,
  removeFromCart,
} from "../../../redux/reducers/cartReducer";
import toast from "react-hot-toast";
import { isOutOfStock } from "../../../utils/stockUtils";
import CartDrawer from "../../common/CartDrawer";
import CouponPromoTicker from "../../common/CouponPromoTicker";
import { Heart, X, Trash2, ShoppingBag, ArrowRight } from "lucide-react";

// Sub-components
import Navbar from "./Navbar";
import HeroCarousel from "./HeroCarousel";
import FeaturedCollections from "./FeaturedCollections";
import EditorialSplitCard from "./EditorialSplitCard";
import ProductSection from "./ProductSection";
import ProductDetails from "./ProductDetails";
import TestimonialsSection from "./TestimonialsSection";
import BottomHeroBanner from "./BottomHeroBanner";
import Footer from "./Footer";

// Dedicated Local Demo Data
import { coffeeDemoData } from "./demoData";

export default function CruxCoffeeTemplate({
  business = {},
  products = [],
  categories = [],
  banners = [],
  coupons = [],
  offers = [],
  customization = {},
}) {
  const [activePage, setActivePage] = useState("home"); // "home" | "product-detail"
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Drawers
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [wishlistIds, setWishlistIds] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart?.cartItems || []);

  // Data Fallbacks
  const rawProducts =
    products && products.length > 0 ? products : coffeeDemoData.products;
  const rawCategories =
    categories && categories.length > 0 ? categories : coffeeDemoData.categories;
  const rawBusiness =
    business && (business.name || business.businessName)
      ? business
      : coffeeDemoData.business;

  const activeHeroSlides =
    banners && banners.length > 0 ? banners : coffeeDemoData.heroSlides;

  const brandName =
    rawBusiness?.businessName ||
    rawBusiness?.name ||
    customization?.heroHeadline ||
    "Crux Coffee Roasters";

  const brandLogo = customization?.logo || rawBusiness?.logo || null;
  const currency = rawBusiness?.currency || "₹";

  // Wishlist Handling
  const handleToggleWishlist = (product) => {
    if (!product?._id) return;
    if (wishlistIds.includes(product._id)) {
      setWishlistIds(wishlistIds.filter((id) => id !== product._id));
      toast.success(`Removed ${product.name} from Wishlist`);
    } else {
      setWishlistIds([...wishlistIds, product._id]);
      toast.success(`Saved ${product.name} to Wishlist! ❤️`);
    }
  };

  // Cart Handling
  const handleAddToCart = (product, qty = 1) => {
    if (isOutOfStock(product) || product.badge === "Sold out") {
      toast.error(`Sorry, ${product.name} is currently out of stock!`);
      return;
    }
    dispatch(addToCart({ product, quantity: qty }));
    toast.success(`${product.name} added to cart! ☕`);
    setCartOpen(true);
  };

  const handleUpdateQuantity = (id, newQty) => {
    dispatch(updateCartQuantity({ productId: id, quantity: newQty }));
  };

  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleCheckout = () => {
    setCartOpen(false);
    navigate("/cart");
  };

  const cartCount = cartItems.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0
  );

  // Group Products by Category with smart dynamic merchant fallback
  const coffeeBeansProducts = useMemo(() => {
    const explicit = rawProducts.filter((p) => {
      const c = (typeof p.category === "object" ? p.category?.name || p.category?.slug : p.category || "").toLowerCase();
      return c.includes("bean") || c === "coffee-beans";
    });
    if (explicit.length > 0) return explicit;
    if (products && products.length > 0) {
      return products.slice(0, 4);
    }
    return rawProducts.filter((p) => p.category === "coffee-beans");
  }, [rawProducts, products]);

  const instantCoffeeProducts = useMemo(() => {
    const explicit = rawProducts.filter((p) => {
      const c = (typeof p.category === "object" ? p.category?.name || p.category?.slug : p.category || "").toLowerCase();
      return c.includes("instant") || c === "instant-coffee";
    });
    if (explicit.length > 0) return explicit;
    if (products && products.length > 0) {
      return products.slice(4, 8).length ? products.slice(4, 8) : products.slice(0, 4);
    }
    return rawProducts.filter((p) => p.category === "instant-coffee");
  }, [rawProducts, products]);

  const internationalBrewsProducts = useMemo(() => {
    const explicit = rawProducts.filter((p) => {
      const c = (typeof p.category === "object" ? p.category?.name || p.category?.slug : p.category || "").toLowerCase();
      return c.includes("brew") || c.includes("international") || c === "international-brews";
    });
    if (explicit.length > 0) return explicit;
    if (products && products.length > 0) {
      return products.slice(8, 12).length ? products.slice(8, 12) : products.slice(0, 4);
    }
    return rawProducts.filter((p) => p.category === "international-brews");
  }, [rawProducts, products]);

  const coffeeAccessoriesProducts = useMemo(() => {
    const explicit = rawProducts.filter((p) => {
      const c = (typeof p.category === "object" ? p.category?.name || p.category?.slug : p.category || "").toLowerCase();
      return c.includes("accessor") || c.includes("gear") || c === "coffee-accessories";
    });
    if (explicit.length > 0) return explicit;
    if (products && products.length > 0) {
      return products.slice(12, 16).length ? products.slice(12, 16) : products.slice(0, 4);
    }
    return rawProducts.filter((p) => p.category === "coffee-accessories");
  }, [rawProducts, products]);

  // Filtered Products when Category is picked or Search is active
  const filteredProducts = useMemo(() => {
    return rawProducts.filter((item) => {
      const itemCat = (typeof item.category === "object" ? item.category?.slug || item.category?.name : item.category || "").toLowerCase();
      const matchesCat =
        activeCategory === "all" ||
        itemCat === activeCategory.toLowerCase() ||
        itemCat.includes(activeCategory.toLowerCase());
      const matchesSearch =
        !searchQuery.trim() ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        itemCat.includes(searchQuery.toLowerCase()) ||
        item.tastingNotes?.some((n) =>
          n.toLowerCase().includes(searchQuery.toLowerCase())
        );
      return matchesCat && matchesSearch;
    });
  }, [rawProducts, activeCategory, searchQuery]);

  // Wishlisted Products Objects
  const wishlistedProducts = useMemo(() => {
    return rawProducts.filter((p) => wishlistIds.includes(p._id));
  }, [rawProducts, wishlistIds]);

  const handleSelectProduct = (prod) => {
    setSelectedProduct(prod);
    setActivePage("product-detail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavigateHome = () => {
    setActivePage("home");
    setSelectedProduct(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isFiltering = activeCategory !== "all" || searchQuery.trim().length > 0;

  return (
    <div className="w-full min-h-screen bg-[#FAF7F2] text-[#2E1B13] font-sans antialiased selection:bg-amber-900 selection:text-white">
      {/* Dynamic Store Coupon Bar */}
      <CouponPromoTicker coupons={coupons} theme="light" />

      {/* Top Navbar */}
      <Navbar
        brandName={brandName}
        brandLogo={brandLogo}
        cartCount={cartCount}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setCartOpen(true)}
        onOpenWishlist={() => setWishlistOpen(true)}
        onNavigateHome={handleNavigateHome}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          if (activePage !== "home") setActivePage("home");
        }}
        activeCategory={activeCategory}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        categories={rawCategories}
      />

      {/* Main Content Area */}
      <main>
        {activePage === "product-detail" && selectedProduct ? (
          <ProductDetails
            product={selectedProduct}
            currency={currency}
            isWishlisted={wishlistIds.includes(selectedProduct._id)}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={handleAddToCart}
            onBack={handleNavigateHome}
          />
        ) : isFiltering ? (
          /* Filtered View */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#2E1B13]/15">
              <div>
                <h1
                  className="text-2xl sm:text-3xl font-serif text-[#2E1B13]"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {searchQuery
                    ? `Results for "${searchQuery}"`
                    : activeCategory === "all"
                    ? "All Collections"
                    : rawCategories.find((c) => c.slug === activeCategory)?.name ||
                      "Category Results"}
                </h1>
                <p className="text-xs sm:text-sm text-[#7D6E63] mt-1">
                  Showing {filteredProducts.length} craft products
                </p>
              </div>

              <button
                onClick={() => {
                  setActiveCategory("all");
                  setSearchQuery("");
                }}
                className="text-xs sm:text-sm text-amber-800 hover:text-black font-semibold underline"
              >
                Clear all filters
              </button>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-[#2E1B13]/10">
                <p className="text-lg font-serif text-[#2E1B13]">
                  No coffee items found.
                </p>
                <p className="text-sm text-[#7D6E63] mt-1 mb-4">
                  Try searching with different tasting notes, origins, or gear keywords.
                </p>
                <button
                  onClick={() => {
                    setActiveCategory("all");
                    setSearchQuery("");
                  }}
                  className="px-6 py-2.5 bg-[#3A2318] text-white text-xs font-medium rounded-full"
                >
                  Reset Search
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                {filteredProducts.map((prod) => (
                  <ProductSection
                    key={prod._id}
                    products={[prod]}
                    currency={currency}
                    wishlistIds={wishlistIds}
                    onToggleWishlist={handleToggleWishlist}
                    onAddToCart={handleAddToCart}
                    onSelectProduct={handleSelectProduct}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Default Flow (Matching Reference Image 1 & 2 Layout Exactly) */
          <>
            {/* 1. Hero Banner with 3-Dash Pagination */}
            <HeroCarousel
              slides={activeHeroSlides}
              onSelectCategory={(cat) => setActiveCategory(cat)}
            />

            {/* 2. "Good Coffee with a Greater Purpose" & 3 Featured Collections */}
            <FeaturedCollections
              business={rawBusiness}
              categories={rawCategories}
              onSelectCategory={(cat) => setActiveCategory(cat)}
            />

            {/* 3. Split Editorial Card 1: "Our Small Batch Coffee" (Image Left, Content Right) */}
            <EditorialSplitCard
              title={coffeeDemoData.editorialSections.smallBatch.title}
              description={coffeeDemoData.editorialSections.smallBatch.description}
              buttonText={coffeeDemoData.editorialSections.smallBatch.buttonText}
              image={coffeeDemoData.editorialSections.smallBatch.image}
              imageAlt="Small Batch Coffee Beans"
              reversed={false}
              onButtonClick={() => setActiveCategory("coffee-beans")}
            />

            {/* 4. Section 1: Coffee Beans */}
            <ProductSection
              title="Coffee Beans"
              products={coffeeBeansProducts}
              currency={currency}
              wishlistIds={wishlistIds}
              onToggleWishlist={handleToggleWishlist}
              onAddToCart={handleAddToCart}
              onSelectProduct={handleSelectProduct}
            />

            {/* 5. Section 2: Instant Coffee */}
            <ProductSection
              title="Instant Coffee"
              products={instantCoffeeProducts}
              currency={currency}
              wishlistIds={wishlistIds}
              onToggleWishlist={handleToggleWishlist}
              onAddToCart={handleAddToCart}
              onSelectProduct={handleSelectProduct}
            />

            {/* 6. Split Editorial Card 2: "Coffee first. Schemes later" (Content Left, Image Right Chemex) */}
            <EditorialSplitCard
              title={coffeeDemoData.editorialSections.coffeeFirst.title}
              description={coffeeDemoData.editorialSections.coffeeFirst.description}
              buttonText={coffeeDemoData.editorialSections.coffeeFirst.buttonText}
              image={coffeeDemoData.editorialSections.coffeeFirst.image}
              imageAlt="Barista Pour Over Chemex"
              reversed={true}
              onButtonClick={() => setActiveCategory("international-brews")}
            />

            {/* 7. Section 3: International Brews */}
            <ProductSection
              title="International Brews"
              products={internationalBrewsProducts}
              currency={currency}
              wishlistIds={wishlistIds}
              onToggleWishlist={handleToggleWishlist}
              onAddToCart={handleAddToCart}
              onSelectProduct={handleSelectProduct}
            />

            {/* 8. Section 4: Coffee Accessories */}
            <ProductSection
              title="Coffee Accessories"
              products={coffeeAccessoriesProducts}
              currency={currency}
              wishlistIds={wishlistIds}
              onToggleWishlist={handleToggleWishlist}
              onAddToCart={handleAddToCart}
              onSelectProduct={handleSelectProduct}
            />

            {/* 9. Section 5: What our customers are saying */}
            <TestimonialsSection
              testimonials={coffeeDemoData.testimonials}
            />

            {/* 10. Section 6: Full-Width Bottom Hero Banner "COFFEE FOR EVERYONE" */}
            <BottomHeroBanner
              title={coffeeDemoData.bottomBanner.title}
              description={coffeeDemoData.bottomBanner.description}
              buttonText={coffeeDemoData.bottomBanner.buttonText}
              bgImage={coffeeDemoData.bottomBanner.bgImage}
              onButtonClick={() => {
                setActiveCategory("all");
                window.scrollTo({ top: 500, behavior: "smooth" });
              }}
            />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer
        brandName={brandName}
        business={rawBusiness}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          if (activePage !== "home") setActivePage("home");
          window.scrollTo({ top: 500, behavior: "smooth" });
        }}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
        currency={currency}
        themeColors={{ primary: "#3A2318" }}
      />

      {/* Wishlist Slide-Over Drawer */}
      {wishlistOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            onClick={() => setWishlistOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-[#FAF7F2] shadow-2xl flex flex-col">
              <div className="px-6 py-5 bg-[#2E1B13] text-[#FAF7F2] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-rose-400 fill-rose-400" />
                  <h2 className="text-base font-serif font-bold tracking-wide">
                    Saved Beans & Gear ({wishlistedProducts.length})
                  </h2>
                </div>
                <button
                  onClick={() => setWishlistOpen(false)}
                  className="text-[#D6CBC1] hover:text-white p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {wishlistedProducts.length === 0 ? (
                  <div className="text-center py-16">
                    <Heart className="w-12 h-12 text-[#A89A90] mx-auto mb-3 opacity-40" />
                    <p className="text-sm font-medium text-[#2E1B13]">
                      Your wishlist is empty
                    </p>
                    <p className="text-xs text-[#7D6E63] mt-1">
                      Tap the heart icon on any coffee roast to save it here.
                    </p>
                  </div>
                ) : (
                  wishlistedProducts.map((item) => (
                    <div
                      key={item._id}
                      className="flex gap-4 p-3 bg-white rounded-xl border border-[#2E1B13]/10 items-center shadow-xs"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs sm:text-sm font-serif font-medium text-[#2E1B13] truncate">
                          {item.name}
                        </h4>
                        <div className="flex items-baseline gap-2 mt-0.5">
                          <span className="text-xs font-bold text-[#2E1B13]">
                            {currency}
                            {item.price.toLocaleString("en-IN")}
                          </span>
                          {item.originalPrice && (
                            <span className="text-[10px] text-[#8F8177] line-through">
                              {currency}
                              {item.originalPrice.toLocaleString("en-IN")}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 items-end">
                        <button
                          onClick={() => handleAddToCart(item, 1)}
                          className="px-3 py-1 bg-[#3A2318] hover:bg-[#25150E] text-white text-[11px] font-medium rounded-full flex items-center gap-1 shadow-xs"
                        >
                          <ShoppingBag className="w-3 h-3" />
                          <span>Add</span>
                        </button>
                        <button
                          onClick={() => handleToggleWishlist(item)}
                          className="text-[10px] text-rose-600 hover:text-rose-800"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
