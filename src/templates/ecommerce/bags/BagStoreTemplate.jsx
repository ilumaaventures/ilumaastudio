import React, { useState } from "react";
import {
  ShoppingBag,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Star,
  Check,
  Eye,
  Heart,
  X,
  Sparkles,
  ShieldCheck,
  Leaf,
  Compass,
} from "lucide-react";
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
import { getProductImage } from "../../../utils/productImage";

// Import modular sub-components
import Navbar from "./Navbar";
import Footer from "./Footer";
import ProductCard from "./ProductCard";
import Product from "./Product";
import ProductDetails from "./ProductDetails";
import Offer from "./Offer";

export default function BagStoreTemplate({
  business = {},
  products = [],
  categories = [],
  offers = [],
  reviews = [],
  customization = {},
}) {
  // Navigation: "home" | "catalog" | "product-detail" | "offers"
  const [activePage, setActivePage] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterConsent, setNewsletterConsent] = useState(true);

  // Quick View Modal
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Carousel shift state for featured row
  const [featuredIndex, setFeaturedIndex] = useState(0);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart?.cartItems || []);

  // Curated handcrafted backpack & bag lineup matching the reference screenshot
  const defaultBags = [
    {
      _id: "bag-1",
      name: "CORIN LEATHER BACK PACK",
      category: "Backpacks",
      price: 38.99,
      compareAtPrice: 42.0,
      material: "Full-Grain Saddle Leather",
      capacity: "22 Liters",
      rating: 5.0,
      reviewCount: 0,
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
      description: "Handcrafted with full-grain vegetable-tanned saddle leather, reinforced dual shoulder straps, solid brass buckle hardware, and protective interior laptop sleeve.",
      inStock: true,
    },
    {
      _id: "bag-2",
      name: "HERITAGE WAXED CANVAS PACK",
      category: "Backpacks",
      price: 48.0,
      compareAtPrice: 55.0,
      material: "18oz Waxed Cotton Canvas",
      capacity: "26 Liters",
      rating: 5.0,
      reviewCount: 0,
      image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80",
      description: "Weatherproof 18oz Scottish waxed cotton canvas with Tuscan bridle leather accents and quick-access top flap pocket.",
      inStock: true,
    },
    {
      _id: "bag-3",
      name: "VINTAGE SADDLE MESSENGER",
      category: "Messenger & Crossbody",
      price: 36.5,
      compareAtPrice: 45.0,
      material: "Heavy Duty Washed Canvas",
      capacity: "16 Liters",
      rating: 5.0,
      reviewCount: 0,
      image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80",
      description: "Rugged washed khaki canvas courier with adjustable webbing strap, dual front utility pockets, and padded tablet partition.",
      inStock: true,
    },
    {
      _id: "bag-4",
      name: "CLASSIC FJORD BLUE DAYPACK",
      category: "Backpacks",
      price: 38.99,
      compareAtPrice: 42.0,
      material: "Organic Cotton Duck",
      capacity: "20 Liters",
      rating: 5.0,
      reviewCount: 0,
      image: "https://images.unsplash.com/photo-1546938576-6e6a64f317cc?w=800&auto=format&fit=crop&q=80",
      description: "Minimalist Scandinavian daypack sewn from organic indigo cotton duck with natural leather cinch straps.",
      inStock: true,
    },
    {
      _id: "bag-5",
      name: "EXPEDITION ROLLTOP PACK",
      category: "Backpacks",
      price: 52.0,
      compareAtPrice: 60.0,
      material: "Waxed Canvas & Vachetta",
      capacity: "30 Liters Expandable",
      rating: 5.0,
      reviewCount: 0,
      image: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&auto=format&fit=crop&q=80",
      description: "Expandable rolltop closure engineered for wilderness trail hikes, cycling commutes, and weekend travel excursions.",
      inStock: true,
    },
    {
      _id: "bag-6",
      name: "CANVAS FIELD CROSSBODY BAG",
      category: "Messenger & Crossbody",
      price: 34.0,
      compareAtPrice: 39.0,
      material: "Earth-Toned Canvas",
      capacity: "12 Liters",
      rating: 5.0,
      reviewCount: 0,
      image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80",
      description: "Compact EDC shoulder pack designed for cameras, notebooks, and travel essentials with anti-theft magnetic closure.",
      inStock: true,
    },
  ];

  const bagsCatalog = products && products.length > 0 ? products : defaultBags;

  // Cart operations
  const handleAddToCart = (productToAdd, qty = 1) => {
    dispatch(
      addToCart({
        id: productToAdd._id || productToAdd.id,
        name: productToAdd.name,
        price: Number(productToAdd.price) || 38.99,
        image: getProductImage(productToAdd, productToAdd.image),
        quantity: qty,
      })
    );
    toast.success(`Added ${productToAdd.name} to cart! 🎒`);
  };

  const handleUpdateQuantity = (itemId, qty) => {
    if (qty <= 0) {
      dispatch(removeFromCart(itemId));
    } else {
      dispatch(updateCartQuantity({ id: itemId, quantity: qty }));
    }
  };

  const handleRemoveItem = (itemId) => {
    dispatch(removeFromCart(itemId));
    toast.success("Removed from bag");
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }
    setCartOpen(false);
    navigate("/checkout");
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    toast.success("Thank you for signing up for our newsletter!");
    setNewsletterEmail("");
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans flex flex-col justify-between selection:bg-[#A0522D] selection:text-white">
      {/* ================= 1. NAVBAR ================= */}
      <Navbar
        brandName={business?.name || "KRAFT & CANVAS"}
        activePage={activePage}
        setActivePage={setActivePage}
        cartCount={cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0)}
        onOpenCart={() => setCartOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <main className="flex-1 pb-16">
        {/* ================= VIEW 1: HOMEPAGE (Reference Image) ================= */}
        {activePage === "home" && (
          <div className="space-y-16 sm:space-y-20">
            {/* ================= SECTION: HERO SCENIC WILDERNESS BANNER ================= */}
            <section className="relative w-full h-[420px] sm:h-[500px] lg:h-[560px] overflow-hidden bg-slate-800">
              {/* Scenic Outdoor Background: Traveler with tan backpack by misty lake */}
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-100 hover:scale-105"
                style={{
                  backgroundImage: `url("https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=1600&auto=format&fit=crop&q=80")`,
                }}
              >
                {/* Subtle natural misty atmospheric wash */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />
              </div>

              {/* Carousel Left Arrow Navigation Icon */}
              <button
                type="button"
                aria-label="Previous Slide"
                onClick={() => toast("Viewing first slide")}
                className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full text-white/80 hover:text-white hover:bg-black/30 transition cursor-pointer z-20"
              >
                <ChevronLeft size={28} />
              </button>

              {/* Carousel Right Arrow Navigation Icon */}
              <button
                type="button"
                aria-label="Next Slide"
                onClick={() => toast("Viewing next slide")}
                className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full text-white/80 hover:text-white hover:bg-black/30 transition cursor-pointer z-20"
              >
                <ChevronRight size={28} />
              </button>

              {/* Floating Frosted Glass Card on Left (Matches Screenshot) */}
              <div className="relative max-w-7xl mx-auto h-full px-6 sm:px-10 lg:px-12 flex items-center z-10">
                <div className="max-w-md sm:max-w-lg p-8 sm:p-12 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 text-white shadow-2xl text-center space-y-6">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black tracking-tight leading-tight drop-shadow-md">
                    Unique & Sustainable <br />
                    Back Packs
                  </h1>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setActivePage("catalog");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="px-8 py-3.5 rounded-sm bg-[#D4BA9E]/90 hover:bg-[#C8AA8B] text-slate-900 font-bold text-xs uppercase tracking-widest transition duration-300 shadow-md border border-white/40 cursor-pointer active:scale-98"
                    >
                      SHOP NOW
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* ================= SECTION: FEATURED PRODUCTS ================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              {/* Lined Header: ─────── Featured Products ─────── */}
              <div className="flex items-center gap-4 text-center">
                <div className="flex-1 h-[1px] bg-slate-200" />
                <h2 className="text-xl sm:text-2xl font-serif text-slate-800 tracking-wide">
                  Featured Products
                </h2>
                <div className="flex-1 h-[1px] bg-slate-200" />
              </div>

              {/* Carousel Container with Left Arrow and Product Row */}
              <div className="relative">
                {/* Carousel Left Arrow on Side (Matches Screenshot) */}
                <button
                  type="button"
                  onClick={() => setFeaturedIndex(Math.max(0, featuredIndex - 1))}
                  className="hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 p-2 rounded-full text-slate-700 hover:text-black hover:bg-slate-100 transition cursor-pointer z-10"
                >
                  <ChevronLeft size={24} />
                </button>

                {/* Products Row (4 columns) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
                  {bagsCatalog.slice(0, 4).map((bag) => (
                    <ProductCard
                      key={`feat-${bag._id || bag.id}`}
                      product={bag}
                      onSelectProduct={(p) => {
                        setSelectedProduct(p);
                        setActivePage("product-detail");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      onAddToCart={handleAddToCart}
                      onQuickView={(p) => setQuickViewProduct(p)}
                    />
                  ))}
                </div>

                {/* Carousel Right Arrow on Side */}
                <button
                  type="button"
                  onClick={() => setFeaturedIndex(featuredIndex + 1)}
                  className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 p-2 rounded-full text-slate-700 hover:text-black hover:bg-slate-100 transition cursor-pointer z-10"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            </section>

            {/* ================= SECTION: NEW RELEASES ================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              {/* Lined Header: ─────── New Releases ─────── */}
              <div className="flex items-center gap-4 text-center">
                <div className="flex-1 h-[1px] bg-slate-200" />
                <h2 className="text-xl sm:text-2xl font-serif text-slate-800 tracking-wide">
                  New Releases
                </h2>
                <div className="flex-1 h-[1px] bg-slate-200" />
              </div>

              {/* New Releases Product Row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {bagsCatalog.slice(3, 6).map((bag) => (
                  <ProductCard
                    key={`new-${bag._id || bag.id}`}
                    product={bag}
                    onSelectProduct={(p) => {
                      setSelectedProduct(p);
                      setActivePage("product-detail");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    onAddToCart={handleAddToCart}
                    onQuickView={(p) => setQuickViewProduct(p)}
                  />
                ))}
              </div>
            </section>

            {/* ================= SECTION: SIGN UP FOR OUR NEWSLETTER ================= */}
            <section className="border-t border-slate-200 pt-12 pb-6">
              <div className="max-w-xl mx-auto px-4 text-center space-y-6">
                <h3 className="text-lg sm:text-xl font-serif text-slate-800 tracking-wide">
                  sign up for our newsletter
                </h3>

                {/* Newsletter Input + GO Button (Matches Screenshot) */}
                <form onSubmit={handleNewsletterSubmit} className="flex max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-white border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-800 rounded-l-none"
                  />
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-slate-900 hover:bg-black text-white font-black text-xs uppercase tracking-widest transition cursor-pointer"
                  >
                    GO
                  </button>
                </form>

                {/* Checkbox Preferences (Matches Screenshot) */}
                <div className="flex items-center justify-center gap-6 text-[11px] text-slate-500">
                  <label className="flex items-center gap-1.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={newsletterConsent}
                      onChange={(e) => setNewsletterConsent(e.target.checked)}
                      className="accent-slate-800 rounded"
                    />
                    <span>Fashion/Lifestyle</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="accent-slate-800 rounded"
                    />
                    <span>Outdoor Gear</span>
                  </label>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ================= VIEW 2: FULL CATALOG ================= */}
        {activePage === "catalog" && (
          <Product
            products={bagsCatalog}
            onSelectProduct={(p) => {
              setSelectedProduct(p);
              setActivePage("product-detail");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onAddToCart={handleAddToCart}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}

        {/* ================= VIEW 3: PRODUCT DETAILS ================= */}
        {activePage === "product-detail" && selectedProduct && (
          <ProductDetails
            product={selectedProduct}
            onBack={() => {
              setActivePage("catalog");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onAddToCart={handleAddToCart}
            relatedProducts={bagsCatalog}
            onSelectProduct={(p) => {
              setSelectedProduct(p);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        )}

        {/* ================= VIEW 4: OFFERS & BUNDLES ================= */}
        {activePage === "offers" && (
          <Offer
            products={bagsCatalog}
            onSelectProduct={(p) => {
              setSelectedProduct(p);
              setActivePage("product-detail");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onAddToCart={handleAddToCart}
          />
        )}
      </main>

      {/* ================= 2. FOOTER ================= */}
      <Footer
        brandName={business?.name || "KRAFT & CANVAS"}
        setActivePage={setActivePage}
      />

      {/* ================= 3. REDUX CART DRAWER ================= */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
        themeColors={{ primary: "#A0522D" }}
      />

      {/* ================= 4. QUICK VIEW MODAL ================= */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 text-left">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200 space-y-6">
            <button
              type="button"
              onClick={() => setQuickViewProduct(null)}
              className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <div className="bg-slate-50 rounded-xl p-4 flex items-center justify-center min-h-[220px]">
                <img
                  src={getProductImage(quickViewProduct, quickViewProduct.image)}
                  alt={quickViewProduct.name}
                  className="max-h-48 object-contain filter drop-shadow-md"
                />
              </div>

              <div className="space-y-3">
                <span className="text-[10px] font-black uppercase text-[#A0522D] tracking-wider">
                  {quickViewProduct.category || "Backpack"}
                </span>
                <h3 className="text-base font-bold text-slate-900 uppercase">
                  {quickViewProduct.name}
                </h3>
                <div className="text-xl font-bold text-slate-900">
                  ${Number(quickViewProduct.price).toFixed(2)}
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {quickViewProduct.description}
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      handleAddToCart(quickViewProduct);
                      setQuickViewProduct(null);
                    }}
                    className="w-full py-3 bg-[#A0522D] hover:bg-[#8B4513] text-white font-black text-xs uppercase tracking-widest rounded-sm transition cursor-pointer shadow"
                  >
                    ADD TO CART
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
