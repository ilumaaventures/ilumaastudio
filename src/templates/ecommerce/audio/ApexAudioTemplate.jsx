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
import { Heart, X, ShoppingBag } from "lucide-react";

// Sub-components
import Navbar from "./Navbar";
import HeroMacroBanner from "./HeroMacroBanner";
import CategoryTiles from "./CategoryTiles";
import ProductGridSection from "./ProductGridSection";
import EditorialPromoCard from "./EditorialPromoCard";
import CustomerReviews from "./CustomerReviews";
import ProductDetails from "./ProductDetails";
import Footer from "./Footer";

// Dedicated Local Demo Data
import { audioDemoData } from "./demoData";

export default function ApexAudioTemplate({
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
    products && products.length > 0 ? products : audioDemoData.products;
  const rawCategories =
    categories && categories.length > 0 ? categories : audioDemoData.categories;
  const rawBusiness =
    business && (business.name || business.businessName)
      ? business
      : audioDemoData.business;

  const activeHeroSlides =
    banners && banners.length > 0 ? banners : audioDemoData.heroSlides;

  const brandName =
    rawBusiness?.businessName ||
    rawBusiness?.name ||
    customization?.heroHeadline ||
    "APEX ACOUSTICS";

  const brandLogo = customization?.logo || rawBusiness?.logo || null;
  const currency = rawBusiness?.currency || "€";

  // Wishlist Handling
  const handleToggleWishlist = (product) => {
    if (!product?._id) return;
    if (wishlistIds.includes(product._id)) {
      setWishlistIds(wishlistIds.filter((id) => id !== product._id));
      toast.success(`Removed ${product.name} from Wishlist`);
    } else {
      setWishlistIds([...wishlistIds, product._id]);
      toast.success(`Saved ${product.name} to Wishlist! 🤍`);
    }
  };

  // Cart Handling
  const handleAddToCart = (product, qty = 1) => {
    if (isOutOfStock(product)) {
      toast.error(`Sorry, ${product.name} is currently unavailable!`);
      return;
    }
    dispatch(addToCart({ product, quantity: qty }));
    toast.success(`${product.name} added to cart! 🎧`);
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

  // Grouped Products matching reference categories with smart dynamic fallback
  const headphonesList = useMemo(() => {
    const explicit = rawProducts.filter((p) => {
      const c = (typeof p.category === "object" ? p.category?.name || p.category?.slug : p.category || "").toLowerCase();
      return c.includes("headphone") || c === "headphones";
    });
    if (explicit.length > 0) return explicit;
    if (products && products.length > 0) {
      return products.slice(0, Math.ceil(products.length / 2));
    }
    return rawProducts.filter((p) => p.category === "headphones");
  }, [rawProducts, products]);

  const earphonesList = useMemo(() => {
    const explicit = rawProducts.filter((p) => {
      const c = (typeof p.category === "object" ? p.category?.name || p.category?.slug : p.category || "").toLowerCase();
      return c.includes("earphone") || c.includes("earbud") || c === "earphones";
    });
    if (explicit.length > 0) return explicit;
    if (products && products.length > 0) {
      return products.slice(Math.ceil(products.length / 2));
    }
    return rawProducts.filter((p) => p.category === "earphones");
  }, [rawProducts, products]);

  // Search & Category Filtering
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
        item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.materials?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [rawProducts, activeCategory, searchQuery]);

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
    <div className="w-full min-h-screen bg-white text-[#121212] font-sans antialiased selection:bg-black selection:text-white">
      {/* Dynamic Store Coupon Bar */}
      <CouponPromoTicker coupons={coupons} theme="dark" />

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
          /* Filtered Results View */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-200">
              <div>
                <h1
                  className="text-2xl sm:text-3xl font-bold uppercase tracking-[0.15em] text-[#121212]"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  {searchQuery
                    ? `Results for "${searchQuery}"`
                    : activeCategory === "all"
                    ? "ALL SOUND TOOLS"
                    : rawCategories.find((c) => c.slug === activeCategory)?.name ||
                      "SOUND COLLECTION"}
                </h1>
                <p className="text-xs text-neutral-500 uppercase tracking-widest mt-1">
                  Showing {filteredProducts.length} precision models
                </p>
              </div>

              <button
                onClick={() => {
                  setActiveCategory("all");
                  setSearchQuery("");
                }}
                className="text-xs text-black font-bold uppercase tracking-wider underline hover:text-neutral-600"
              >
                Reset Filters
              </button>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-[#F9F9F9] border border-neutral-200">
                <p className="text-sm font-bold uppercase tracking-wider text-black">
                  No acoustic models found
                </p>
                <p className="text-xs text-neutral-500 mt-1 mb-4">
                  Please refine your query or explore our standard sound categories.
                </p>
                <button
                  onClick={() => {
                    setActiveCategory("all");
                    setSearchQuery("");
                  }}
                  className="px-6 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-widest"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                {filteredProducts.map((prod) => (
                  <ProductGridSection
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
          /* Exact Visual Flow Matching Reference Images 1 & 2 */
          <>
            {/* 1. Hero Macro Banner with 3-Dot Pagination */}
            <HeroMacroBanner
              slides={activeHeroSlides}
              onSelectCategory={(cat) => setActiveCategory(cat)}
            />

            {/* 2. "SHOP BY CATEGORIES" Asymmetric Grid */}
            <CategoryTiles
              categories={rawCategories}
              onSelectCategory={(cat) => {
                setActiveCategory(cat);
                const el = document.getElementById(`section-${cat}`);
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
            />

            {/* 3. HEADPHONES Section (8 Models from Reference Image 1) */}
            <ProductGridSection
              id="section-headphones"
              title="HEADPHONES"
              products={headphonesList}
              currency={currency}
              wishlistIds={wishlistIds}
              onToggleWishlist={handleToggleWishlist}
              onAddToCart={handleAddToCart}
              onSelectProduct={handleSelectProduct}
              onViewAll={() => setActiveCategory("headphones")}
            />

            {/* 4. Feature Card 1: "MW08 - A leap forward" */}
            <EditorialPromoCard
              title={audioDemoData.editorialSections.mw08Leap.title}
              description={audioDemoData.editorialSections.mw08Leap.description}
              buttonText={audioDemoData.editorialSections.mw08Leap.buttonText}
              image={audioDemoData.editorialSections.mw08Leap.image}
              imageAlt={audioDemoData.editorialSections.mw08Leap.imageAlt}
              onPrimaryClick={() => {
                const p = rawProducts.find((item) => item._id === "prod-ep-05");
                if (p) handleSelectProduct(p);
                else setActiveCategory("earphones");
              }}
            />

            {/* 5. EARPHONES Section (8 Models from Reference Image 2) */}
            <ProductGridSection
              id="section-earphones"
              title="EARPHONES"
              products={earphonesList}
              currency={currency}
              wishlistIds={wishlistIds}
              onToggleWishlist={handleToggleWishlist}
              onAddToCart={handleAddToCart}
              onSelectProduct={handleSelectProduct}
              onViewAll={() => setActiveCategory("earphones")}
            />

            {/* 6. Feature Card 2: "MG20 Gaming (Galactic White)" with Dual Buttons */}
            <EditorialPromoCard
              title={audioDemoData.editorialSections.mg20Gaming.title}
              description={audioDemoData.editorialSections.mg20Gaming.description}
              primaryButtonText={audioDemoData.editorialSections.mg20Gaming.primaryButtonText}
              secondaryButtonText={audioDemoData.editorialSections.mg20Gaming.secondaryButtonText}
              image={audioDemoData.editorialSections.mg20Gaming.image}
              imageAlt={audioDemoData.editorialSections.mg20Gaming.imageAlt}
              hasDots={true}
              onPrimaryClick={() => {
                const p = rawProducts.find((item) => item._id === "prod-hp-08");
                if (p) handleAddToCart(p, 1);
              }}
              onSecondaryClick={() => {
                const p = rawProducts.find((item) => item._id === "prod-hp-08");
                if (p) handleSelectProduct(p);
              }}
            />

            {/* 7. CUSTOMER REVIEWS Section (Oliver Brown Review) */}
            <CustomerReviews reviews={audioDemoData.customerReviews} />

            {/* 8. Feature Card 3: "Superior design and craftmanship" */}
            <EditorialPromoCard
              title={audioDemoData.editorialSections.superiorCraft.title}
              description={audioDemoData.editorialSections.superiorCraft.description}
              buttonText={audioDemoData.editorialSections.superiorCraft.buttonText}
              image={audioDemoData.editorialSections.superiorCraft.image}
              imageAlt={audioDemoData.editorialSections.superiorCraft.imageAlt}
              onPrimaryClick={() => {
                setActiveCategory("all");
                window.scrollTo({ top: 400, behavior: "smooth" });
              }}
            />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer
        brandName={brandName}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          if (activePage !== "home") setActivePage("home");
          window.scrollTo({ top: 400, behavior: "smooth" });
        }}
      />

      {/* Redux Cart Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
        currency={currency}
        themeColors={{ primary: "#121212" }}
      />

      {/* Wishlist Drawer */}
      {wishlistOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            onClick={() => setWishlistOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
              <div className="px-6 py-5 bg-[#121212] text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                  <h2 className="text-xs font-bold uppercase tracking-[0.2em]">
                    Wishlist ({wishlistedProducts.length})
                  </h2>
                </div>
                <button
                  onClick={() => setWishlistOpen(false)}
                  className="text-neutral-400 hover:text-white p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {wishlistedProducts.length === 0 ? (
                  <div className="text-center py-16">
                    <Heart className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                    <p className="text-xs font-bold uppercase tracking-wider text-black">
                      Wishlist is empty
                    </p>
                    <p className="text-xs text-neutral-400 mt-1">
                      Save your favorite acoustics here.
                    </p>
                  </div>
                ) : (
                  wishlistedProducts.map((item) => (
                    <div
                      key={item._id}
                      className="flex gap-4 p-3 bg-[#F9F9F9] border border-neutral-200 items-center"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-contain flex-shrink-0 bg-white p-1"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-[#121212] truncate">
                          {item.name}
                        </h4>
                        <div className="mt-0.5 text-xs font-semibold text-neutral-900">
                          {currency}
                          {item.price.toLocaleString("en-US")}
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 items-end">
                        <button
                          onClick={() => handleAddToCart(item, 1)}
                          className="px-3 py-1 bg-[#121212] hover:bg-neutral-800 text-white text-[10px] font-bold uppercase tracking-wider"
                        >
                          Add
                        </button>
                        <button
                          onClick={() => handleToggleWishlist(item)}
                          className="text-[10px] text-rose-600 hover:underline"
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
