import React, { useState, useMemo } from "react";
import {
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Star,
  Check,
  ChevronRight,
  Eye,
  Heart,
  X,
  CreditCard,
  Truck,
  Headphones,
  Tag,
  Sliders,
  Sparkles,
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

export default function ShoesStoreTemplate({
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
  const [sizeStandard, setSizeStandard] = useState("EU"); // "EU" | "US" | "UK"

  // Best Sellers active tab
  const [bestSellerTab, setBestSellerTab] = useState("Men"); // "Women" | "Men" | "Children" | "Sales"

  // Quick View Modal state
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [quickViewSize, setQuickViewSize] = useState("41");
  const [quickViewColor, setQuickViewColor] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart?.cartItems || []);

  // Curated footwear catalog matching the reference images
  const defaultSneakers = [
    {
      _id: "sh-1",
      name: "Air Jordan 1 True Blue",
      category: "Men's Shoes",
      subCategory: "Nike Dunk",
      price: 120.0,
      compareAtPrice: 144.0,
      rating: 5.0,
      reviewCount: 94,
      badge: "SALE! 17%",
      isFeatured: true,
      isBestSeller: true,
      sizes: ["38", "40", "41", "42", "42.5", "43"],
      colors: [
        { name: "True Blue / White", hex: "#2563EB" },
        { name: "Wolf Grey", hex: "#94A3B8" },
        { name: "Black Cement", hex: "#0F172A" },
      ],
      image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600&auto=format&fit=crop&q=80",
      description: "Iconic court-inspired silhouette featuring premium leather uppers, encapsulated Air sole cushioning, and classic Wings branding.",
      inStock: true,
    },
    {
      _id: "sh-2",
      name: "Nike Pegasus Turbo",
      category: "Men's Shoes",
      subCategory: "Free Metcon",
      price: 110.0,
      compareAtPrice: 130.0,
      priceRange: "$110.00 – $130.00",
      rating: 4.9,
      reviewCount: 142,
      badge: "WINTER",
      isFeatured: true,
      sizes: ["40", "41", "42", "43"],
      colors: [
        { name: "Pure Platinum / Crimson", hex: "#EF4444" },
        { name: "Obsidian Blue", hex: "#1E3A8A" },
      ],
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
      description: "Featherlight daily runner equipped with ZoomX foam technology delivering 85% energy propulsion on asphalt.",
      inStock: true,
    },
    {
      _id: "sh-3",
      name: "Air Jordan 1 Low Celtics",
      category: "Men's Shoes",
      subCategory: "Nike Dunk",
      price: 115.0,
      compareAtPrice: 140.0,
      rating: 5.0,
      reviewCount: 88,
      badge: "SALE! 20%",
      isFeatured: true,
      sizes: ["38", "40", "41", "42", "43"],
      colors: [
        { name: "Lucky Green / White", hex: "#10B981" },
        { name: "Black Toe", hex: "#0F172A" },
      ],
      image: "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=600&auto=format&fit=crop&q=80",
      description: "Timeless low-top retro dressed in clean clover emerald panels and vulcanized traction rubber outsole.",
      inStock: true,
    },
    {
      _id: "sh-4",
      name: "Jordan 1 Mid Triple White",
      category: "Men's Shoes",
      subCategory: "Nike City",
      price: 39.0,
      compareAtPrice: 50.0,
      rating: 4.8,
      reviewCount: 65,
      badge: "SALE! 24%",
      isFeatured: true,
      sizes: ["38", "40", "41", "42"],
      colors: [
        { name: "Triple White", hex: "#E2E8F0" },
        { name: "Pure Sand", hex: "#CBD5E1" },
      ],
      image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=80",
      description: "Clean monochromatic high-top with perforated toe box and padded mid-cut collar for all-day comfort.",
      inStock: true,
    },
    {
      _id: "sh-5",
      name: "Nike Zoom Mercurial Superfly",
      category: "Men's Shoes",
      subCategory: "Free Metcon",
      price: 85.0,
      compareAtPrice: 110.0,
      rating: 4.9,
      reviewCount: 77,
      badge: "MEN'S",
      isFeatured: true,
      sizes: ["40", "41", "42", "42.5", "43"],
      colors: [
        { name: "Volt Yellow / Crimson", hex: "#FACC15" },
        { name: "Black / Volt", hex: "#0F172A" },
      ],
      image: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=600&auto=format&fit=crop&q=80",
      description: "Pitch-ready soccer cleat featuring dynamic fit collar and Vaporposite+ grippy mesh upper.",
      inStock: true,
    },
    {
      _id: "sh-6",
      name: "Air Jordan 1 High Chicago Reimagined",
      category: "Men's Shoes",
      subCategory: "Nike Dunk",
      price: 175.0,
      compareAtPrice: 210.0,
      rating: 5.0,
      reviewCount: 320,
      badge: "WINTER",
      isBestSeller: true,
      sizes: ["40", "41", "42", "42.5", "43"],
      colors: [
        { name: "Varsity Red / Black", hex: "#EF4444" },
        { name: "Sail White", hex: "#F8FAFC" },
      ],
      image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=600&auto=format&fit=crop&q=80",
      description: "The grail colorway built with cracked vintage leather collar and aged sail midsole.",
      inStock: true,
    },
    {
      _id: "sh-7",
      name: "Nike Air Max 270",
      category: "Women's Shoes",
      subCategory: "Nike City",
      price: 144.0,
      compareAtPrice: 160.0,
      rating: 4.9,
      reviewCount: 210,
      badge: "BESTSELLER",
      isBestSeller: true,
      sizes: ["38", "40", "41"],
      colors: [
        { name: "Black / Punch Pink", hex: "#F43F5E" },
        { name: "Triple Black", hex: "#0F172A" },
      ],
      image: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&auto=format&fit=crop&q=80",
      description: "Dramatic 270-degree visible Air heel unit paired with flexible bootie construction.",
      inStock: true,
    },
    {
      _id: "sh-8",
      name: "Nike Air Max Plus Drift",
      category: "Men's Shoes",
      subCategory: "Nike Dunk",
      price: 180.0,
      compareAtPrice: 200.0,
      priceRange: "$65.00 – $200.00",
      rating: 4.8,
      reviewCount: 115,
      badge: "BEST RATED",
      isBestSeller: true,
      sizes: ["40", "41", "42", "43"],
      colors: [
        { name: "Black / Hyper Blue", hex: "#0284C7" },
        { name: "Gradient Red", hex: "#DC2626" },
      ],
      image: "https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?w=600&auto=format&fit=crop&q=80",
      description: "Defiant flame cage ribbing with Tuned Air dual-pressure chambers for maximum stability.",
      inStock: true,
    },
    {
      _id: "sh-9",
      name: "Nike Air Zoom Pegasus 39 Lilac",
      category: "Women's Shoes",
      subCategory: "Free Metcon",
      price: 22.0,
      compareAtPrice: 35.0,
      rating: 4.8,
      reviewCount: 54,
      badge: "SALE! 35%",
      sizes: ["38", "40", "41"],
      colors: [
        { name: "Lilac Violet / Silver", hex: "#A855F7" },
        { name: "White Mint", hex: "#6EE7B7" },
      ],
      image: "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=600&auto=format&fit=crop&q=80",
      description: "Dual Zoom Air units at forefoot and heel designed specifically for cushioned transition phases.",
      inStock: true,
    },
    {
      _id: "sh-10",
      name: "Nike Flex Runner 2 Slip-On",
      category: "Children",
      subCategory: "Nike City",
      price: 18.0,
      compareAtPrice: 25.0,
      rating: 4.9,
      reviewCount: 68,
      badge: "SALE! 28%",
      sizes: ["38", "40"],
      colors: [
        { name: "Lime Glow / Black", hex: "#84CC16" },
        { name: "Royal Blue", hex: "#1D4ED8" },
      ],
      image: "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=600&auto=format&fit=crop&q=80",
      description: "Stretchy lace-free slip-on runner engineered with reinforced leather sides and flex grooves.",
      inStock: true,
    },
    {
      _id: "sh-11",
      name: "Nike Omni Multi-Court Indoor",
      category: "Women's Shoes",
      subCategory: "Free Metcon",
      price: 32.0,
      compareAtPrice: 40.0,
      priceRange: "$30.00 – $40.00",
      rating: 4.7,
      reviewCount: 42,
      badge: "SALE! 20%",
      sizes: ["38", "40", "41"],
      colors: [
        { name: "Soft Pink / White", hex: "#F472B6" },
        { name: "Arctic Ice", hex: "#E0F2FE" },
      ],
      image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&auto=format&fit=crop&q=80",
      description: "Non-marking indoor gym shoe providing lateral support for volleyball, badminton, and gym training.",
      inStock: true,
    },
    {
      _id: "sh-12",
      name: "Air Jordan 1 Mid Shadow",
      category: "Men's Shoes",
      subCategory: "Nike Dunk",
      price: 125.0,
      compareAtPrice: 150.0,
      rating: 4.9,
      reviewCount: 180,
      badge: "BEST RATED",
      isBestSeller: true,
      sizes: ["40", "41", "42", "43"],
      colors: [
        { name: "Medium Grey / Black", hex: "#475569" },
        { name: "Triple Black", hex: "#0F172A" },
      ],
      image: "https://images.unsplash.com/photo-1512374382149-233c42b6a83b?w=600&auto=format&fit=crop&q=80",
      description: "The moody Shadow mid silhouette crafted with supple tumbled leather and tonal rubber cupsole.",
      inStock: true,
    },
  ];

  const shoesCatalog = products && products.length > 0 ? products : defaultSneakers;

  // Cart operations
  const handleAddToCart = (productToAdd, customVariant) => {
    const size = customVariant?.selectedSize || productToAdd.selectedSize || `${sizeStandard} 41`;
    const color = customVariant?.selectedColor || productToAdd.selectedColor || "Standard";

    dispatch(
      addToCart({
        id: `${productToAdd._id || productToAdd.id}-${size}-${color}`,
        name: `${productToAdd.name} (${size}, ${color})`,
        price: Number(productToAdd.price) || 0,
        image: getProductImage(productToAdd, productToAdd.image),
        quantity: 1,
        selectedSize: size,
        selectedColor: color,
      })
    );
    toast.success(`Added ${productToAdd.name} [${size}] to bag! 👟`);
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
      toast.error("Your sneaker bag is empty!");
      return;
    }
    setCartOpen(false);
    navigate("/checkout");
  };

  // Quick View Handler
  const handleOpenQuickView = (product, size, color) => {
    setQuickViewProduct(product);
    setQuickViewSize(size || "41");
    setQuickViewColor(color || product.colors?.[0] || { name: "Standard", hex: "#000" });
  };

  // Best sellers filtered by tab
  const bestSellersFiltered = useMemo(() => {
    if (bestSellerTab === "Sales") {
      return shoesCatalog.filter((p) => p.compareAtPrice && p.compareAtPrice > p.price);
    }
    if (bestSellerTab === "Women") {
      return shoesCatalog.filter((p) => (p.category || "").toLowerCase().includes("women"));
    }
    if (bestSellerTab === "Children") {
      return shoesCatalog.filter((p) => (p.category || "").toLowerCase().includes("children") || (p.category || "").toLowerCase().includes("kid"));
    }
    // Men default
    return shoesCatalog.filter((p) => (p.category || "").toLowerCase().includes("men"));
  }, [shoesCatalog, bestSellerTab]);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* ================= 1. NAVBAR ================= */}
      <Navbar
        brandName={business?.name || "KICKS VAULT"}
        activePage={activePage}
        setActivePage={setActivePage}
        cartCount={cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0)}
        onOpenCart={() => setCartOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sizeStandard={sizeStandard}
        setSizeStandard={setSizeStandard}
      />

      <main className="flex-1 pb-16">
        {/* ================= VIEW 1: HOMEPAGE (Reference Image 1) ================= */}
        {activePage === "home" && (
          <div className="space-y-12 sm:space-y-16">
            {/* ================= HERO SNEAKER BANNER ================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
              <div className="relative rounded-3xl bg-gradient-to-r from-zinc-950 via-slate-900 to-black text-white p-8 sm:p-14 overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
                {/* Background Sport Graphic Watermark */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-7xl sm:text-9xl text-white/5 tracking-tighter select-none pointer-events-none italic">
                  SPORT SHOES
                </div>

                {/* Left Hero Copy */}
                <div className="space-y-5 z-10 max-w-lg text-left">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 text-xs font-black uppercase tracking-wider">
                    <Sparkles size={13} /> Limited Drop Release
                  </span>

                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none uppercase">
                    Air Jordan 1 <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-amber-300">
                      Chicago Retro
                    </span>
                  </h1>

                  <p className="text-xs sm:text-sm text-slate-300 max-w-sm leading-relaxed">
                    Crafted with cracked vintage leather collar, encapsulated Air sole propulsion, and museum-grade collector certification.
                  </p>

                  <div className="flex items-center gap-4 pt-2">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">
                        SPECIAL PRICE
                      </span>
                      <span className="text-2xl sm:text-3xl font-black text-white">
                        $299.99
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        handleAddToCart(shoesCatalog[5] || shoesCatalog[0]);
                      }}
                      className="px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition cursor-pointer shadow-lg shadow-red-600/40 active:scale-98"
                    >
                      ORDER NOW
                    </button>
                  </div>
                </div>

                {/* Right Angled Sneaker Visual */}
                <div className="relative z-10 w-full md:w-96 h-56 sm:h-72 flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1556906781-9a412961c28c?w=900&auto=format&fit=crop&q=80"
                    alt="Hero Jordan Chicago"
                    className="max-h-full w-auto object-contain filter drop-shadow-[0_25px_30px_rgba(0,0,0,0.8)] -rotate-12 hover:rotate-0 transition-transform duration-700 ease-out"
                  />
                </div>
              </div>
            </section>

            {/* ================= SECTION 1: WINTER COLLECTIONS ================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
              <div className="text-center space-y-1">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Winter Collections
                </h2>
                <p className="text-xs text-slate-400">
                  Cardigan helvetica erresha, portland celiao truffaut
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 pt-4">
                {shoesCatalog.slice(0, 5).map((shoe) => (
                  <ProductCard
                    key={`winter-${shoe._id || shoe.id}`}
                    product={shoe}
                    onSelectProduct={(p) => {
                      setSelectedProduct(p);
                      setActivePage("product-detail");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    onAddToCart={handleAddToCart}
                    onQuickView={handleOpenQuickView}
                    sizeStandard={sizeStandard}
                  />
                ))}
              </div>
            </section>

            {/* ================= DUAL PROMO VOUCHER STRIP (Reference Image 1) ================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left Card: First Purchase Voucher */}
                <div className="p-4 sm:p-5 rounded-2xl border-2 border-dashed border-red-300 bg-red-50/40 flex items-center justify-between gap-4 text-left">
                  <div className="space-y-1">
                    <h4 className="text-xs sm:text-sm font-bold text-red-900">
                      Super discount for your first purchase
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Use discount code in checkout page.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText("FIRST 250");
                      toast.success("Coupon 'FIRST 250' copied!");
                    }}
                    className="px-3.5 py-1.5 bg-red-500 hover:bg-red-600 text-white font-black text-xs uppercase tracking-wider rounded-lg shadow-sm cursor-pointer shrink-0"
                  >
                    FIRST 250
                  </button>
                </div>

                {/* Right Card: 2nd Shopping Surprise */}
                <div className="p-4 sm:p-5 rounded-2xl border-2 border-dashed border-blue-300 bg-blue-50/40 flex items-center justify-between gap-4 text-left">
                  <div className="space-y-1">
                    <h4 className="text-xs sm:text-sm font-bold text-blue-950">
                      2nd shopping surprise campaign!
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Exclusive rewards on seasonal member drops.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setActivePage("catalog");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="px-3.5 py-1.5 bg-[#1E3A8A] hover:bg-blue-800 text-white font-black text-xs uppercase tracking-wider rounded-lg shadow-sm cursor-pointer shrink-0"
                  >
                    Check Products ›
                  </button>
                </div>
              </div>
            </section>

            {/* ================= SECTION 2: FEATURED PRODUCTS ================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
              <div className="flex items-end justify-between border-b border-slate-100 pb-3">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Featured Products
                </h3>
                <button
                  onClick={() => {
                    setActivePage("catalog");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="text-xs font-bold text-slate-500 hover:text-blue-600 transition flex items-center gap-1 cursor-pointer"
                >
                  <span>Click for all products in the category</span>
                  <ChevronRight size={13} />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                {shoesCatalog.slice(1, 7).map((shoe) => (
                  <ProductCard
                    key={`feat-${shoe._id || shoe.id}`}
                    product={shoe}
                    onSelectProduct={(p) => {
                      setSelectedProduct(p);
                      setActivePage("product-detail");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    onAddToCart={handleAddToCart}
                    onQuickView={handleOpenQuickView}
                    sizeStandard={sizeStandard}
                  />
                ))}
              </div>
            </section>

            {/* ================= SECTION 3: 3 DYNAMIC TREND BANNERS (Reference Image 1) ================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 text-left">
                {/* Large Left Banner (7 cols): 2023 New Styles */}
                <div className="md:col-span-7 rounded-3xl bg-slate-100 p-6 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs relative overflow-hidden group">
                  <div className="space-y-2 z-10 max-w-xs">
                    <span className="px-2 py-0.5 rounded bg-black text-white text-[9px] font-black uppercase tracking-wider">
                      NIKE DUNK
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                      2023 New Styles
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Join the trend of poster colors.
                    </p>
                    <button
                      onClick={() => {
                        setActivePage("catalog");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="text-xs font-black text-slate-900 hover:text-blue-600 underline pt-2 block cursor-pointer"
                    >
                      See More Products
                    </button>
                  </div>

                  <div className="w-52 h-44 shrink-0 flex items-center justify-center">
                    <img
                      src="https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?w=600&auto=format&fit=crop&q=80"
                      alt="New Styles"
                      className="max-h-full w-auto object-contain group-hover:scale-110 transition duration-500"
                    />
                  </div>
                </div>

                {/* Right Stack (5 cols): Blue Sport & Pink Teen */}
                <div className="md:col-span-5 flex flex-col gap-4">
                  {/* Top: Blue Sport Trends */}
                  <div className="flex-1 rounded-2xl bg-slate-100 p-5 sm:p-6 flex items-center justify-between gap-4 group">
                    <div className="space-y-1.5 z-10">
                      <span className="text-[9px] font-black uppercase text-slate-400">
                        FREE METCON
                      </span>
                      <h4 className="text-base sm:text-lg font-black text-slate-900">
                        Blue Sport Trends
                      </h4>
                      <button
                        onClick={() => {
                          setActivePage("catalog");
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="text-xs font-bold text-slate-800 underline block cursor-pointer"
                      >
                        See More Products
                      </button>
                    </div>
                    <div className="w-28 h-20 shrink-0">
                      <img
                        src="https://images.unsplash.com/photo-1552346154-21d32810aba3?w=400&auto=format&fit=crop&q=80"
                        alt="Blue Sport"
                        className="w-full h-full object-contain group-hover:scale-105 transition"
                      />
                    </div>
                  </div>

                  {/* Bottom: Pink Teen Shoes */}
                  <div className="flex-1 rounded-2xl bg-slate-100 p-5 sm:p-6 flex items-center justify-between gap-4 group">
                    <div className="space-y-1.5 z-10">
                      <span className="text-[9px] font-black uppercase text-slate-400">
                        NIKE CITY
                      </span>
                      <h4 className="text-base sm:text-lg font-black text-slate-900">
                        Pink Teen Shoes
                      </h4>
                      <button
                        onClick={() => {
                          setActivePage("catalog");
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="text-xs font-bold text-slate-800 underline block cursor-pointer"
                      >
                        See More Products
                      </button>
                    </div>
                    <div className="w-28 h-20 shrink-0">
                      <img
                        src="https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=400&auto=format&fit=crop&q=80"
                        alt="Pink Teen"
                        className="w-full h-full object-contain group-hover:scale-105 transition"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ================= SECTION 4: 4 TRUST PILLARS (Reference Image 1) ================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-y border-slate-100 py-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-full bg-slate-100 mx-auto flex items-center justify-center text-slate-800">
                    <Tag size={18} />
                  </div>
                  <h4 className="text-xs font-black text-slate-900 uppercase">
                    Amazing Value Every Day
                  </h4>
                  <p className="text-[11px] text-slate-400 max-w-[180px] mx-auto">
                    Items prices that fit your budget, true prices for everyone
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-full bg-slate-100 mx-auto flex items-center justify-center text-slate-800">
                    <ShieldCheck size={18} />
                  </div>
                  <h4 className="text-xs font-black text-slate-900 uppercase">
                    Successful Customer Service
                  </h4>
                  <p className="text-[11px] text-slate-400 max-w-[180px] mx-auto">
                    We work with a focus on 100% customer satisfaction
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-full bg-slate-100 mx-auto flex items-center justify-center text-slate-800">
                    <CreditCard size={18} />
                  </div>
                  <h4 className="text-xs font-black text-slate-900 uppercase">
                    All Payment Methods
                  </h4>
                  <p className="text-[11px] text-slate-400 max-w-[180px] mx-auto">
                    Don't bother with payment details, verified secure gate
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-full bg-slate-100 mx-auto flex items-center justify-center text-slate-800">
                    <Truck size={18} />
                  </div>
                  <h4 className="text-xs font-black text-slate-900 uppercase">
                    Completely Free Shipping
                  </h4>
                  <p className="text-[11px] text-slate-400 max-w-[180px] mx-auto">
                    We'll handle the shipping, don't think about details
                  </p>
                </div>
              </div>
            </section>

            {/* ================= SECTION 5: THIS MONTH'S BEST SELLERS (Reference Image 1) ================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
              <div className="text-center space-y-2">
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  This Month's Best Sellers
                </h3>

                {/* Category Tabs: Women | Men | Children | Sales */}
                <div className="flex items-center justify-center gap-4 text-xs font-bold pt-1">
                  {["Women", "Men", "Children", "Sales"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setBestSellerTab(tab)}
                      className={`pb-1 transition cursor-pointer border-b-2 ${
                        bestSellerTab === tab
                          ? "border-slate-900 text-slate-900 font-black"
                          : "border-transparent text-slate-400 hover:text-slate-700"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 pt-4">
                {bestSellersFiltered.slice(0, 5).map((shoe) => (
                  <ProductCard
                    key={`bestseller-${shoe._id || shoe.id}`}
                    product={shoe}
                    onSelectProduct={(p) => {
                      setSelectedProduct(p);
                      setActivePage("product-detail");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    onAddToCart={handleAddToCart}
                    onQuickView={handleOpenQuickView}
                    sizeStandard={sizeStandard}
                  />
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ================= VIEW 2: CATALOG & FILTER PAGE (Reference Image 2) ================= */}
        {activePage === "catalog" && (
          <Product
            products={shoesCatalog}
            onSelectProduct={(p) => {
              setSelectedProduct(p);
              setActivePage("product-detail");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onAddToCart={handleAddToCart}
            onQuickView={handleOpenQuickView}
            sizeStandard={sizeStandard}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}

        {/* ================= VIEW 3: PRODUCT DETAILS PAGE ================= */}
        {activePage === "product-detail" && selectedProduct && (
          <ProductDetails
            product={selectedProduct}
            onBack={() => {
              setActivePage("catalog");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onAddToCart={handleAddToCart}
            relatedProducts={shoesCatalog}
            onSelectProduct={(p) => {
              setSelectedProduct(p);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            sizeStandard={sizeStandard}
            setSizeStandard={setSizeStandard}
          />
        )}

        {/* ================= VIEW 4: PROMO OFFERS & DEALS ================= */}
        {activePage === "offers" && (
          <Offer
            products={shoesCatalog}
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
        brandName={business?.name || "KICKS VAULT"}
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
        themeColors={{ primary: "#1E3A8A" }}
      />

      {/* ================= 4. QUICK VIEW MODAL ================= */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 text-left">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200 space-y-6">
            <button
              type="button"
              onClick={() => setQuickViewProduct(null)}
              className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              {/* Product Visual */}
              <div className="bg-slate-50 rounded-2xl p-6 flex items-center justify-center min-h-[220px]">
                <img
                  src={getProductImage(quickViewProduct, quickViewProduct.image)}
                  alt={quickViewProduct.name}
                  className="max-h-48 object-contain filter drop-shadow-lg"
                />
              </div>

              {/* Product Details & Selection */}
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-black uppercase text-blue-700 tracking-wider">
                    {quickViewProduct.category}
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900">
                    {quickViewProduct.name}
                  </h3>
                  <div className="flex items-center gap-1 text-amber-400 text-xs pt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} className="fill-amber-400" />
                    ))}
                    <span className="text-slate-500 ml-1 font-bold">
                      {quickViewProduct.rating || "5.0"}
                    </span>
                  </div>
                </div>

                <div className="text-2xl font-black text-slate-900">
                  ${Number(quickViewProduct.price).toFixed(2)}
                </div>

                {/* Sizes */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Select Size ({sizeStandard}):
                  </label>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {(quickViewProduct.sizes || ["38", "40", "41", "42", "43"]).map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setQuickViewSize(sz)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition cursor-pointer ${
                          quickViewSize === sz
                            ? "bg-slate-900 text-white border-slate-900"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {sizeStandard} {sz}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Colors */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Color: {quickViewColor?.name || "Standard"}
                  </label>
                  <div className="flex items-center gap-2">
                    {(quickViewProduct.colors || [
                      { name: "Navy Blue", hex: "#1E3A8A" },
                      { name: "White / Red", hex: "#EF4444" },
                      { name: "Black", hex: "#0F172A" },
                    ]).map((col, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setQuickViewColor(col)}
                        className={`w-6 h-6 rounded-full border transition cursor-pointer ${
                          quickViewColor?.name === col.name
                            ? "ring-2 ring-blue-600 ring-offset-2 scale-110"
                            : "border-slate-300"
                        }`}
                        style={{ backgroundColor: col.hex }}
                      />
                    ))}
                  </div>
                </div>

                {/* Add to Bag Button */}
                <button
                  type="button"
                  onClick={() => {
                    handleAddToCart(quickViewProduct, {
                      selectedSize: `${sizeStandard} ${quickViewSize}`,
                      selectedColor: quickViewColor?.name || "Standard",
                    });
                    setQuickViewProduct(null);
                  }}
                  className="w-full py-3 bg-[#1E3A8A] hover:bg-blue-800 text-white font-black text-xs uppercase tracking-wider rounded-xl transition cursor-pointer shadow-lg"
                >
                  Add to Bag • ${Number(quickViewProduct.price).toFixed(2)}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
