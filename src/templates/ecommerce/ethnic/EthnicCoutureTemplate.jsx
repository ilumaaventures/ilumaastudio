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
import { getProductImage } from "../../../utils/productImage";
import { Heart, X, Trash2, ShoppingBag } from "lucide-react";

// Sub-components
import Navbar from "./Navbar";
import HeroCarousel from "./HeroCarousel";
import TopCategoriesGrid from "./TopCategoriesGrid";
import ProductCard from "./ProductCard";
import ProductDetails from "./ProductDetails";
import Footer from "./Footer";

// Local Dedicated Demo Data Fallback
import { ethnicDemoData } from "./demoData";

export default function EthnicCoutureTemplate({
  business = {},
  products = [],
  categories = [],
  banners = [],
  coupons = [],
  offers = [],
  customization = {},
}) {
  // Navigation State: "home" | "product-detail"
  const [activePage, setActivePage] = useState("home");
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

  const rawProducts = products && products.length > 0 ? products : ethnicDemoData.products;
  const rawCategories = categories && categories.length > 0 ? categories : ethnicDemoData.categories;
  const rawBusiness = business && business.name ? business : ethnicDemoData.business;

  const activeHeroSlides =
    banners && banners.length > 0 ? banners : ethnicDemoData.heroSlides;

  const brandName =
    rawBusiness?.businessName ||
    rawBusiness?.name ||
    customization?.heroHeadline ||
    "ETHNIC & MODERN COUTURE";

  const brandLogo = customization?.logo || rawBusiness?.logo || null;
  const brandEmail = rawBusiness?.email || "concierge@ethniccouture.com";
  const currency = rawBusiness?.currency || "₹";

  // Wishlist Toggle
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

  // Add to Cart
  const handleAddToCart = (product, qty = 1) => {
    if (isOutOfStock(product)) {
      toast.error(`Sorry, ${product.name} is currently out of stock!`);
      return;
    }
    dispatch(addToCart({ product, quantity: qty }));
    toast.success(`${product.name} added to cart! 🛍️`);
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

  const handleSelectProduct = (p) => {
    setSelectedProduct(p);
    setActivePage("product-detail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Filtered Products by Section with smart dynamic merchant fallback
  const jumpsuitProducts = useMemo(() => {
    const explicit = rawProducts.filter((p) => {
      const c = (typeof p.category === "object" ? p.category?.name || p.category?.slug : p.category || "").toLowerCase();
      return c.includes("jumpsuit") || c === "jumpsuits";
    });
    if (explicit.length > 0) return explicit;
    if (products && products.length > 0) {
      return products.slice(0, 4);
    }
    return rawProducts.filter((p) => (p.category || "").toLowerCase() === "jumpsuits");
  }, [rawProducts, products]);

  const dressProducts = useMemo(() => {
    const explicit = rawProducts.filter((p) => {
      const c = (typeof p.category === "object" ? p.category?.name || p.category?.slug : p.category || "").toLowerCase();
      return c.includes("dress") || c === "dresses";
    });
    if (explicit.length > 0) return explicit;
    if (products && products.length > 0) {
      return products.slice(4, 8).length ? products.slice(4, 8) : products.slice(0, 4);
    }
    return rawProducts.filter((p) => (p.category || "").toLowerCase() === "dresses");
  }, [rawProducts, products]);

  const modernLookProducts = useMemo(() => {
    const explicit = rawProducts.filter((p) => {
      const c = (typeof p.category === "object" ? p.category?.name || p.category?.slug : p.category || "").toLowerCase();
      return c.includes("modern") || c.includes("couture") || c === "modern look";
    });
    if (explicit.length > 0) return explicit;
    if (products && products.length > 0) {
      return products.slice(8, 12).length ? products.slice(8, 12) : products.slice(0, 4);
    }
    return rawProducts.filter((p) => (p.category || "").toLowerCase() === "modern look");
  }, [rawProducts, products]);

  // Search Results
  const searchResults = useMemo(() => {
    if (!searchQuery || !searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return rawProducts.filter(
      (p) => {
        const itemCat = (typeof p.category === "object" ? p.category?.name || p.category?.slug : p.category || "").toLowerCase();
        return (
          (p.name || "").toLowerCase().includes(q) ||
          itemCat.includes(q) ||
          (p.description || "").toLowerCase().includes(q)
        );
      }
    );
  }, [rawProducts, searchQuery]);

  // Wishlist Items
  const wishlistProducts = useMemo(() => {
    return rawProducts.filter((p) => wishlistIds.includes(p._id));
  }, [rawProducts, wishlistIds]);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#FFFFFF] text-stone-900 antialiased selection:bg-black selection:text-white">
      {/* ================= 0. PROMO TICKER ================= */}
      <CouponPromoTicker coupons={coupons} theme="light" />

      {/* ================= 1. NAVBAR ================= */}
      <Navbar
        brandName={brandName}
        brandLogo={brandLogo}
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setActivePage("home");
          window.scrollTo({ top: 700, behavior: "smooth" });
        }}
        cartCount={cartCount}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setCartOpen(true)}
        onOpenWishlist={() => setWishlistOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onNavigateHome={() => {
          setActivePage("home");
          setActiveCategory("all");
          setSearchQuery("");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />

      {/* ================= 2. MAIN ACTIVE VIEW ================= */}
      <main className="flex-1">
        {activePage === "home" && (
          <div className="space-y-8 pb-16">
            {/* If search query is active, show search results */}
            {searchQuery.trim() ? (
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-left">
                <h2 className="text-base sm:text-lg font-bold text-stone-900 pb-4">
                  Search Results for "{searchQuery}" ({searchResults.length} items)
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
                  {searchResults.map((item) => (
                    <ProductCard
                      key={item._id}
                      product={item}
                      onSelectProduct={handleSelectProduct}
                      onAddToCart={handleAddToCart}
                      onToggleWishlist={handleToggleWishlist}
                      isWishlisted={wishlistIds.includes(item._id)}
                      currency={currency}
                    />
                  ))}
                </div>
              </section>
            ) : activeCategory !== "all" ? (
              /* Filtered by category view */
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-left">
                <div className="flex items-center justify-between pb-6">
                  <h2 className="text-xl sm:text-2xl font-serif font-black text-stone-900">
                    {activeCategory}
                  </h2>
                  <button
                    onClick={() => setActiveCategory("all")}
                    className="text-xs font-semibold text-black hover:underline"
                  >
                    View All Categories
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
                  {rawProducts
                    .filter((p) => (p.category || "").toLowerCase() === activeCategory.toLowerCase())
                    .map((item) => (
                      <ProductCard
                        key={item._id}
                        product={item}
                        onSelectProduct={handleSelectProduct}
                        onAddToCart={handleAddToCart}
                        onToggleWishlist={handleToggleWishlist}
                        isWishlisted={wishlistIds.includes(item._id)}
                        currency={currency}
                      />
                    ))}
                </div>
              </section>
            ) : (
              /* FULL SCREENSHOT REPLICATION HOME VIEW */
              <>
                {/* 1. HERO CAROUSEL WITH 3 DASHES */}
                <HeroCarousel
                  slides={activeHeroSlides}
                  onSelectCategory={(cat) => {
                    setActiveCategory(cat);
                    window.scrollTo({ top: 700, behavior: "smooth" });
                  }}
                />

                {/* 2. TOP CATEGORIES 3x2 GRID WITH VIEW ALL BUTTON */}
                <TopCategoriesGrid
                  categories={rawCategories}
                  onSelectCategory={(cat) => {
                    setActiveCategory(cat);
                    window.scrollTo({ top: 800, behavior: "smooth" });
                  }}
                  onViewAll={() => {
                    setActiveCategory("all");
                    window.scrollTo({ top: 800, behavior: "smooth" });
                  }}
                />

                {/* 3. JUMPSUITS SECTION (MATCHING SCREENSHOT) */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-left">
                  <div className="pb-4">
                    <h2 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight">
                      Jumpsuits
                    </h2>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
                    {jumpsuitProducts.map((item) => (
                      <ProductCard
                        key={item._id}
                        product={item}
                        onSelectProduct={handleSelectProduct}
                        onAddToCart={handleAddToCart}
                        onToggleWishlist={handleToggleWishlist}
                        isWishlisted={wishlistIds.includes(item._id)}
                        currency={currency}
                      />
                    ))}
                  </div>
                </section>

                {/* 4. DRESSES SECTION WITH "BUY 3 GET 1" (MATCHING SCREENSHOT) */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-left">
                  <div className="pb-4">
                    <h2 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight">
                      Dresses
                    </h2>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
                    {dressProducts.map((item) => (
                      <ProductCard
                        key={item._id}
                        product={item}
                        onSelectProduct={handleSelectProduct}
                        onAddToCart={handleAddToCart}
                        onToggleWishlist={handleToggleWishlist}
                        isWishlisted={wishlistIds.includes(item._id)}
                        currency={currency}
                      />
                    ))}
                  </div>
                </section>

                {/* 5. MODERN LOOK SECTION (MATCHING SCREENSHOT) */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-left">
                  <div className="pb-4">
                    <h2 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight">
                      Modern Look
                    </h2>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
                    {modernLookProducts.map((item) => (
                      <ProductCard
                        key={item._id}
                        product={item}
                        onSelectProduct={handleSelectProduct}
                        onAddToCart={handleAddToCart}
                        onToggleWishlist={handleToggleWishlist}
                        isWishlisted={wishlistIds.includes(item._id)}
                        currency={currency}
                      />
                    ))}
                  </div>
                </section>
              </>
            )}
          </div>
        )}

        {/* ================= VIEW 2: PRODUCT DETAILS ================= */}
        {activePage === "product-detail" && selectedProduct && (
          <ProductDetails
            product={selectedProduct}
            onBack={() => {
              setActivePage("home");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            isWishlisted={wishlistIds.includes(selectedProduct._id)}
            currency={currency}
          />
        )}
      </main>

      {/* ================= 3. FOOTER ================= */}
      <Footer
        brandName={brandName}
        brandEmail={brandEmail}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setActivePage("home");
          window.scrollTo({ top: 700, behavior: "smooth" });
        }}
      />

      {/* ================= 4. REDUX CART DRAWER ================= */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
        themeColors={{ primary: "#000000" }}
      />

      {/* ================= 5. INTERACTIVE WISHLIST DRAWER ================= */}
      {wishlistOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-2xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md h-full flex flex-col justify-between shadow-2xl p-6 text-left">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                <div className="flex items-center gap-2">
                  <Heart size={18} className="fill-rose-500 text-rose-500" />
                  <h3 className="text-base font-semibold text-stone-900">
                    Saved Wishlist ({wishlistProducts.length})
                  </h3>
                </div>
                <button
                  onClick={() => setWishlistOpen(false)}
                  className="p-1 rounded-full hover:bg-stone-100 text-stone-500"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Items List */}
              <div className="py-4 space-y-4 max-h-[70vh] overflow-y-auto">
                {wishlistProducts.length === 0 ? (
                  <div className="py-16 text-center space-y-2">
                    <Heart size={32} className="mx-auto text-stone-300 stroke-1" />
                    <p className="text-xs text-stone-500">
                      Your wishlist is empty. Tap the heart on any couture item to save it here.
                    </p>
                  </div>
                ) : (
                  wishlistProducts.map((p) => (
                    <div
                      key={p._id}
                      className="flex items-center gap-3.5 pb-3 border-b border-stone-100"
                    >
                      <div className="w-16 h-20 bg-stone-100 rounded-none overflow-hidden flex-shrink-0">
                        <img
                          src={getProductImage(p, p.image)}
                          alt={p.name}
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-medium text-stone-900 truncate">
                          {p.name}
                        </h4>
                        <p className="text-xs font-semibold text-stone-800 mt-0.5">
                          {currency} {p.price}
                        </p>
                        <button
                          type="button"
                          onClick={() => handleAddToCart(p, 1)}
                          className="mt-2 text-[11px] font-semibold text-black hover:underline flex items-center gap-1"
                        >
                          <ShoppingBag size={12} />
                          <span>Add to Cart</span>
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleToggleWishlist(p)}
                        className="p-1 text-stone-400 hover:text-rose-600"
                        title="Remove"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Bottom Close */}
            <div className="pt-4 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setWishlistOpen(false)}
                className="w-full py-2.5 bg-black hover:bg-stone-800 text-white text-xs font-medium uppercase tracking-wider transition cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
