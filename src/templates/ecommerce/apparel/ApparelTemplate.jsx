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
import { Heart, X, Trash2, ShoppingBag, ArrowRight } from "lucide-react";

// Subcomponents
import Navbar from "./Navbar";
import HeroBanners from "./HeroBanners";
import CategoryStrip from "./CategoryStrip";
import ProductSection from "./ProductSection";
import ProductDetails from "./ProductDetails";
import Footer from "./Footer";

export default function ApparelTemplate({
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

  // Cart & Wishlist Drawers
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [wishlistIds, setWishlistIds] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart?.cartItems || []);

  const brandName =
    business?.businessName ||
    business?.name ||
    customization?.heroHeadline ||
    "STUDIO APPAREL";

  const brandLogo = customization?.logo || business?.logo || null;
  const brandEmail =
    business?.email ||
    business?.businessEmail ||
    "concierge@studioapparel.com";

  const currency = business?.currency || "₹";

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
    toast.success(`${product.name} added to Bag! 🛍️`);
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

  // Categorized products with smart dynamic merchant fallback
  const jacketProducts = useMemo(() => {
    const explicit = products.filter((p) => {
      const c = (typeof p.category === "object" ? p.category?.name || p.category?.slug : p.category || "").toLowerCase();
      return c.includes("jacket") || c.includes("coat") || c === "jackets";
    });
    if (explicit.length > 0) return explicit;
    if (products && products.length > 0) {
      return products.slice(0, 4);
    }
    return [];
  }, [products]);

  const shirtProducts = useMemo(() => {
    const explicit = products.filter((p) => {
      const c = (typeof p.category === "object" ? p.category?.name || p.category?.slug : p.category || "").toLowerCase();
      return c.includes("shirt") || c.includes("top") || c === "shirt";
    });
    if (explicit.length > 0) return explicit;
    if (products && products.length > 0) {
      return products.slice(4, 8).length ? products.slice(4, 8) : products.slice(0, 4);
    }
    return [];
  }, [products]);

  const sweaterProducts = useMemo(() => {
    const explicit = products.filter((p) => {
      const c = (typeof p.category === "object" ? p.category?.name || p.category?.slug : p.category || "").toLowerCase();
      return c.includes("sweater") || c.includes("knit") || c === "sweater";
    });
    if (explicit.length > 0) return explicit;
    if (products && products.length > 0) {
      return products.slice(8, 12).length ? products.slice(8, 12) : products.slice(0, 4);
    }
    return [];
  }, [products]);

  const fragranceProducts = useMemo(() => {
    const explicit = products.filter((p) => {
      const c = (typeof p.category === "object" ? p.category?.name || p.category?.slug : p.category || "").toLowerCase();
      return c.includes("fragrance") || c.includes("perfume") || c === "fragrance";
    });
    if (explicit.length > 0) return explicit;
    if (products && products.length > 0) {
      return products.slice(12, 16).length ? products.slice(12, 16) : products.slice(0, 4);
    }
    return [];
  }, [products]);

  // Search Results if search query is active
  const searchResults = useMemo(() => {
    if (!searchQuery || !searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return products.filter(
      (p) => {
        const itemCat = (typeof p.category === "object" ? p.category?.name || p.category?.slug : p.category || "").toLowerCase();
        return (
          (p.name || "").toLowerCase().includes(q) ||
          itemCat.includes(q) ||
          (p.description || "").toLowerCase().includes(q)
        );
      }
    );
  }, [products, searchQuery]);

  // Wishlist Items array
  const wishlistProducts = useMemo(() => {
    return products.filter((p) => wishlistIds.includes(p._id));
  }, [products, wishlistIds]);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#FFFFFF] text-stone-900 antialiased selection:bg-[#8B5A2B]/15 selection:text-stone-900">
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
          window.scrollTo({ top: 500, behavior: "smooth" });
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

      {/* ================= 2. MAIN ACTIVE PAGE ================= */}
      <main className="flex-1">
        {activePage === "home" && (
          <div className="space-y-4 sm:space-y-6 pb-16">
            {/* If search query is active, show search results section */}
            {searchQuery.trim() ? (
              <ProductSection
                title={`Search Results for "${searchQuery}" (${searchResults.length} items)`}
                products={searchResults}
                onSelectProduct={handleSelectProduct}
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
                wishlistIds={wishlistIds}
                currency={currency}
              />
            ) : activeCategory !== "all" ? (
              <>
                {/* Filtered by single category */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 flex items-center justify-between">
                  <span className="text-xs text-stone-500">
                    Showing {activeCategory}
                  </span>
                  <button
                    onClick={() => setActiveCategory("all")}
                    className="text-xs text-[#8B5A2B] font-semibold hover:underline"
                  >
                    Show All Categories
                  </button>
                </div>
                <ProductSection
                  title={activeCategory}
                  products={products.filter(
                    (p) => (p.category || "").toLowerCase() === activeCategory.toLowerCase()
                  )}
                  onSelectProduct={handleSelectProduct}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={handleToggleWishlist}
                  wishlistIds={wishlistIds}
                  currency={currency}
                />
              </>
            ) : (
              <>
                {/* 1. TRIPLE EDITORIAL HERO BANNERS */}
                <HeroBanners
                  banners={banners}
                  onSelectCategory={(cat) => {
                    setActiveCategory(cat);
                    window.scrollTo({ top: 500, behavior: "smooth" });
                  }}
                />

                {/* 2. ALL CATEGORIES HORIZONTAL STRIP */}
                <CategoryStrip
                  categories={categories}
                  activeCategory={activeCategory}
                  onSelectCategory={(cat) => {
                    setActiveCategory(cat);
                    window.scrollTo({ top: 550, behavior: "smooth" });
                  }}
                  onViewAll={() => {
                    setActiveCategory("all");
                    window.scrollTo({ top: 550, behavior: "smooth" });
                  }}
                />

                {/* 3. JACKETS SECTION (10 ITEMS) */}
                <ProductSection
                  title="Jackets"
                  products={jacketProducts}
                  onSelectProduct={handleSelectProduct}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={handleToggleWishlist}
                  wishlistIds={wishlistIds}
                  currency={currency}
                />

                {/* 4. SHIRT SECTION (10 ITEMS) */}
                <ProductSection
                  title="Shirt"
                  products={shirtProducts}
                  onSelectProduct={handleSelectProduct}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={handleToggleWishlist}
                  wishlistIds={wishlistIds}
                  currency={currency}
                />

                {/* 5. SWEATER SECTION (5 ITEMS) */}
                <ProductSection
                  title="Sweater"
                  products={sweaterProducts}
                  onSelectProduct={handleSelectProduct}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={handleToggleWishlist}
                  wishlistIds={wishlistIds}
                  currency={currency}
                />

                {/* 6. FRAGRANCE SECTION (IF PRESENT) */}
                {fragranceProducts.length > 0 && (
                  <ProductSection
                    title="Fragrance"
                    products={fragranceProducts}
                    onSelectProduct={handleSelectProduct}
                    onAddToCart={handleAddToCart}
                    onToggleWishlist={handleToggleWishlist}
                    wishlistIds={wishlistIds}
                    currency={currency}
                  />
                )}
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
          window.scrollTo({ top: 500, behavior: "smooth" });
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
        themeColors={{ primary: "#8B5A2B" }}
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
                      Your wishlist is empty. Tap the heart on any garment to save it here.
                    </p>
                  </div>
                ) : (
                  wishlistProducts.map((p) => (
                    <div
                      key={p._id}
                      className="flex items-center gap-3.5 pb-3 border-b border-stone-100"
                    >
                      <div className="w-16 h-20 bg-stone-100 rounded-xs overflow-hidden flex-shrink-0">
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
                          className="mt-2 text-[11px] font-semibold text-[#8B5A2B] hover:underline flex items-center gap-1"
                        >
                          <ShoppingBag size={12} />
                          <span>Move to Bag</span>
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
                className="w-full py-2.5 bg-stone-900 hover:bg-black text-white text-xs font-medium uppercase tracking-wider transition cursor-pointer"
              >
                Continue Browsing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
