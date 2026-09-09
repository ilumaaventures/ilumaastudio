import React, { useState, useMemo } from "react";
import {
  ShoppingBag,
  ArrowRight,
  Eye,
  X,
  Plus,
  Minus,
  Check,
  Download,
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

export default function BookStoreTemplate({
  business = {},
  products = [],
  categories = [],
  offers = [],
  reviews = [],
  customization = {},
}) {
  // Navigation: "home" | "catalog" | "product-detail"
  const [activePage, setActivePage] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Quick View Modal
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [quickViewQty, setQuickViewQty] = useState(1);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart?.cartItems || []);

  const defaultBooks = [
    {
      _id: "book-1",
      name: "The Ride of a Lifetime: Lessons Learned from 15 Years as CEO of The Walt Disney Company",
      shortName: "The Ride of a Lifetime: Lessons Learned from 15...",
      author: "Robert Iger",
      price: 99.0,
      compareAtPrice: 199.0,
      discount: 50,
      backdropColor: "#B9BDC4",
      category: "Business & Leadership",
      rating: 4.9,
      reviewCount: 184,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80",
      description: "A masterclass in leadership, strategic risk-taking, and narrative transformation from the legendary Disney CEO who oversaw Pixar, Marvel, and Lucasfilm.",
      inStock: true,
    },
    {
      _id: "book-2",
      name: "Atomic Habits: An Easy & Proven Way to Build Good Habits & Break Bad Ones",
      shortName: "Atomic Habits: An Easy & Proven Way to Build Goo...",
      author: "James Clear",
      price: 14.0,
      compareAtPrice: null,
      discount: 0,
      backdropColor: "#F5E5D5",
      category: "Self-Improvement",
      rating: 5.0,
      reviewCount: 520,
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80",
      description: "No matter your goals, Atomic Habits offers a proven framework for improving every day through compound 1% improvements.",
      inStock: true,
    },
    {
      _id: "book-3",
      name: "And There Was Light: Abraham Lincoln and the American Struggle",
      shortName: "And There Was Light: Abraham Lincoln and the...",
      author: "Jon Meacham",
      price: 20.0,
      compareAtPrice: null,
      discount: 0,
      backdropColor: "#8E96A0",
      category: "Biography & History",
      rating: 4.8,
      reviewCount: 92,
      image: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=600&auto=format&fit=crop&q=80",
      description: "Pulitzer Prize winner Jon Meacham chronicles the life of Abraham Lincoln, charting how—and why—he confronted secession, threats to democracy, and the tragedy of slavery.",
      inStock: true,
    },
    {
      _id: "book-4",
      name: "The Personal Assistant",
      shortName: "The Personal Assistant",
      author: "Kimberly Belle",
      price: 10.0,
      compareAtPrice: 20.0,
      discount: 50,
      backdropColor: "#344A61",
      category: "Mystery & Thriller",
      rating: 4.7,
      reviewCount: 110,
      image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80",
      description: "A gripping thriller of influencer culture, unhinged betrayal, and deadly digital breadcrumbs when a wellness mogul's assistant vanishes.",
      inStock: true,
    },
    {
      _id: "book-5",
      name: "Tread of Angels",
      shortName: "Tread of Angels",
      author: "Rebecca Roanhorse",
      price: 9.0,
      compareAtPrice: 15.0,
      discount: 40,
      backdropColor: "#BE9A57",
      category: "Fantasy & Fiction",
      rating: 4.9,
      reviewCount: 88,
      image: "https://images.unsplash.com/photo-1532012164546-f432f2e37b73?w=600&auto=format&fit=crop&q=80",
      description: "In the 1883 mountain town of Goetia, Celestials and Fallen coexist under a fragile truce until an angel is murdered in cold blood.",
      inStock: true,
    },
    {
      _id: "book-6",
      name: "Chip War: The Fight for the World's Most Critical Technology",
      shortName: "Chip War: The Fight for the World's Most Critical...",
      author: "Chris Miller",
      price: 18.0,
      compareAtPrice: 25.0,
      discount: 28,
      backdropColor: "#2D3033",
      category: "Technology & Geopolitics",
      rating: 4.9,
      reviewCount: 215,
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80",
      description: "An epic geopolitical thriller examining how semiconductor microchips became the foundation of modern warfare, smartphones, and global hegemony.",
      inStock: true,
    },
    {
      _id: "book-7",
      name: "Before I Let Go",
      shortName: "Before I Let Go",
      author: "Kennedy Ryan",
      price: 18.0,
      compareAtPrice: 30.0,
      discount: 40,
      backdropColor: "#204758",
      category: "Contemporary Romance",
      rating: 5.0,
      reviewCount: 340,
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
      description: "USA Today bestselling emotional romance tracing hope, grief, and second chances between divorced soulmates navigating profound healing.",
      inStock: true,
    },
    {
      _id: "book-8",
      name: "Keep Going: 10 Ways to Stay Creative in Good Times and Bad",
      shortName: "Keep Going: 10 Ways to Stay Creative in Good Tim...",
      author: "Austin Kleon",
      price: 10.0,
      compareAtPrice: 15.0,
      discount: 33,
      backdropColor: "#F2BF26",
      category: "Creativity & Art",
      rating: 4.8,
      reviewCount: 164,
      image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&auto=format&fit=crop&q=80",
      description: "An inspiring, illustrated guide for artists, writers, and makers seeking resilience, mindful routine, and joyful persistence.",
      inStock: true,
    },
    {
      _id: "book-9",
      name: "The Rewind",
      shortName: "The Rewind",
      author: "Allison Winn Scotch",
      price: 28.0,
      compareAtPrice: 40.0,
      discount: 30,
      backdropColor: "#262659",
      category: "Romantic Comedy",
      rating: 4.8,
      reviewCount: 95,
      image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&auto=format&fit=crop&q=80",
      description: "College exes wake up together after a wild New Year's Eve wedding with zero memories and wedding bands on their fingers.",
      inStock: true,
    },
  ];

  const bookItems = products.length > 0 ? products : defaultBooks;

  const brandName =
    business?.businessName ||
    business?.name ||
    customization?.heroHeadline ||
    "ENIGMA | Enigma";

  const brandLogo = customization?.logo || business?.logo || null;
  const brandEmail =
    business?.email ||
    business?.businessEmail ||
    "enigmaofficial@ilumaa.com";

  const handleAddToCart = (product, qty = 1) => {
    if (isOutOfStock(product)) {
      toast.error(`Sorry, ${product.name} is currently unavailable!`);
      return;
    }
    dispatch(addToCart({ product, quantity: qty }));
    toast.success(`${product.shortName || product.name} added to cart! 📖`);
    setCartOpen(true);
    if (quickViewProduct) setQuickViewProduct(null);
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

  const handleQuickView = (p) => {
    setQuickViewProduct(p);
    setQuickViewQty(1);
  };

  // Featured 9 items for home page
  const homeProducts = useMemo(() => {
    return bookItems.slice(0, 9);
  }, [bookItems]);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#FFFFFF] text-stone-900 antialiased selection:bg-[#133E47]/20 selection:text-stone-900">
      {/* ================= 1. ENIGMA NAVBAR ================= */}
      <Navbar
        brandName={brandName}
        brandLogo={brandLogo}
        activePage={activePage}
        setActivePage={setActivePage}
        cartCount={cartCount}
        onOpenCart={() => setCartOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* ================= 2. MAIN ACTIVE VIEW ================= */}
      <main className="flex-1">
        {/* ================= VIEW 1: HOME ================= */}
        {activePage === "home" && (
          <div className="space-y-12">
            {/* ================= HERO PANORAMIC BANNER (REFERENCE MATCH) ================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
              <div className="relative rounded-none overflow-hidden bg-[#102B2E] border-b-2 border-[#BE8043] shadow-md">
                {/* Subtle textured grid canvas background */}
                <div
                  className="absolute inset-0 opacity-25 pointer-events-none"
                  style={{
                    backgroundImage: `radial-gradient(#5C8D89 1px, transparent 1px)`,
                    backgroundSize: "20px 20px",
                  }}
                />

                <div className="relative z-10 py-8 px-6 sm:py-12 sm:px-12 flex flex-row items-center justify-between gap-4 max-w-5xl mx-auto min-h-[220px] sm:min-h-[280px]">
                  {/* Left Book Feature: "BEFORE I LET GO" */}
                  <div
                    onClick={() => {
                      const b7 = bookItems.find((b) => b._id === "book-7") || bookItems[6];
                      if (b7) handleSelectProduct(b7);
                    }}
                    className="relative cursor-pointer group flex flex-col items-center flex-1 max-w-[170px] sm:max-w-[210px] transform hover:scale-105 transition-transform duration-300"
                  >
                    <div className="w-full aspect-[2/3] rounded-xs overflow-hidden shadow-[0_12px_30px_rgba(0,0,0,0.6)] border border-white/20 bg-[#1D3557]">
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80"
                        alt="Before I Let Go by Kennedy Ryan"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Center Oval Emblem: "ENIGMA" */}
                  <div className="flex flex-col items-center justify-center px-4 sm:px-8">
                    <div className="px-6 py-2.5 sm:px-8 sm:py-3 rounded-full border border-white/70 backdrop-blur-xs flex items-center justify-center shadow-lg">
                      <span className="text-white font-serif font-black tracking-[0.25em] text-sm sm:text-lg uppercase">
                        ENIGMA
                      </span>
                    </div>
                  </div>

                  {/* Right Book Feature: "the rewind" */}
                  <div
                    onClick={() => {
                      const b9 = bookItems.find((b) => b._id === "book-9") || bookItems[8];
                      if (b9) handleSelectProduct(b9);
                    }}
                    className="relative cursor-pointer group flex flex-col items-center flex-1 max-w-[170px] sm:max-w-[210px] transform hover:scale-105 transition-transform duration-300"
                  >
                    <div className="w-full aspect-[2/3] rounded-xs overflow-hidden shadow-[0_12px_30px_rgba(0,0,0,0.6)] border border-white/20 bg-[#1A1A3A]">
                      <img
                        src="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&auto=format&fit=crop&q=80"
                        alt="The Rewind by Allison Winn Scotch"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ================= SECTION TITLE: DIGITAL PRODUCTS ================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-left">
              <h2 className="text-lg sm:text-xl font-normal text-[#111827]">
                Digital Products
              </h2>

              {/* ================= 3-COLUMN PRODUCT CARDS GRID ================= */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {homeProducts.map((item) => (
                  <ProductCard
                    key={item._id}
                    product={item}
                    onSelectProduct={handleSelectProduct}
                    onAddToCart={handleAddToCart}
                    onQuickView={handleQuickView}
                  />
                ))}
              </div>

              {/* ================= VIEW ALL PRODUCTS BUTTON ================= */}
              <div className="pt-8 pb-10 flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setActivePage("catalog");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="px-8 py-2.5 bg-white border border-[#D1D5DB] hover:border-black text-[#1F2937] hover:text-black rounded-xs text-xs font-medium transition cursor-pointer shadow-2xs hover:shadow-xs active:scale-95"
                >
                  View all products
                </button>
              </div>
            </section>
          </div>
        )}

        {/* ================= VIEW 2: DIGITAL PRODUCTS CATALOG ================= */}
        {activePage === "catalog" && (
          <Product
            products={bookItems}
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
            onQuickView={handleQuickView}
            onBackToHome={() => {
              setActivePage("home");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
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
            relatedProducts={bookItems}
            onSelectProduct={handleSelectProduct}
          />
        )}
      </main>

      {/* ================= 3. FOOTER ================= */}
      <Footer
        brandName={brandName}
        brandLogo={brandLogo}
        brandEmail={brandEmail}
        onNavigate={(page) => {
          setActivePage(page);
          window.scrollTo({ top: 0, behavior: "smooth" });
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
        themeColors={{ primary: "#133E47" }}
      />

      {/* ================= 5. QUICK VIEW MODAL ================= */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-2xs animate-in fade-in duration-200">
          <div className="bg-white rounded-xs max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative overflow-hidden text-left">
            <button
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-800 transition cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              {/* Colored Pad with Book */}
              <div
                className="w-full aspect-[4/5] rounded-xs flex items-center justify-center p-6 border border-stone-200"
                style={{
                  backgroundColor: quickViewProduct.backdropColor || "#E8ECEF",
                }}
              >
                <div className="relative w-3/4 aspect-[2/3] shadow-lg rounded-xs overflow-hidden bg-white">
                  <img
                    src={getProductImage(quickViewProduct, quickViewProduct.image)}
                    alt={quickViewProduct.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-0 bottom-0 left-0 w-2.5 bg-gradient-to-r from-black/20 via-white/10 to-transparent pointer-events-none" />
                </div>
              </div>

              {/* Details */}
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-semibold text-[#133E47] uppercase tracking-wider">
                    {quickViewProduct.category || "Digital Product"}
                  </span>
                  <h3 className="text-lg font-medium text-stone-900 mt-1 leading-snug">
                    {quickViewProduct.shortName || quickViewProduct.name}
                  </h3>
                  {quickViewProduct.author && (
                    <p className="text-xs text-stone-500 mt-0.5">
                      by {quickViewProduct.author}
                    </p>
                  )}
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-xl font-bold text-stone-900">
                      ${Number(quickViewProduct.price).toFixed(quickViewProduct.price % 1 === 0 ? 0 : 2)}
                    </span>
                    {quickViewProduct.compareAtPrice && (
                      <span className="text-xs text-stone-400 line-through">
                        ${Number(quickViewProduct.compareAtPrice).toFixed(quickViewProduct.compareAtPrice % 1 === 0 ? 0 : 2)}
                      </span>
                    )}
                    {quickViewProduct.discount > 0 && (
                      <span className="text-xs text-[#047857] font-medium">
                        ({quickViewProduct.discount}% off)
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                  {quickViewProduct.description}
                </p>

                {/* Quantity & Add to Cart */}
                <div className="flex items-center gap-3 pt-2">
                  <div className="flex items-center border border-stone-200 rounded-sm px-2.5 py-1.5 bg-stone-50">
                    <button
                      onClick={() => setQuickViewQty(Math.max(1, quickViewQty - 1))}
                      className="p-1 text-stone-500 hover:text-stone-900 cursor-pointer"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-7 text-center text-xs font-bold text-stone-900">
                      {quickViewQty}
                    </span>
                    <button
                      onClick={() => setQuickViewQty(quickViewQty + 1)}
                      className="p-1 text-stone-500 hover:text-stone-900 cursor-pointer"
                    >
                      <Plus size={12} />
                    </button>
                  </div>

                  <button
                    onClick={() =>
                      handleAddToCart(quickViewProduct, quickViewQty)
                    }
                    className="flex-1 py-2 px-4 bg-[#133E47] hover:bg-[#0E2D34] text-white rounded-sm text-xs font-medium transition shadow-xs cursor-pointer active:scale-95 text-center flex items-center justify-center gap-1.5"
                  >
                    <ShoppingBag size={14} />
                    <span>Add to cart</span>
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
