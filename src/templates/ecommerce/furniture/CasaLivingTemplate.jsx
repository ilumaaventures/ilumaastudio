import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  ShoppingBag,
  Star,
  Eye,
  Heart,
  X,
  Truck,
  ShieldCheck,
  RotateCcw,
  Check,
  Maximize2,
  Box,
  Layers,
  ChevronRight,
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

import Navbar from "./Navbar";
import Footer from "./Footer";
import ProductCard from "./ProductCard";
import ProductListing from "./ProductListing";
import ProductDetails from "./ProductDetails";

export default function CasaLivingTemplate({
  business = {},
  products = [],
  categories = [],
  offers = [],
  reviews = [],
  customization = {},
}) {
  // Navigation: "home" | "catalog" | "product-detail"
  const [activePage, setActivePage] = useState("home");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Countdown timer state (matching reference image: 254 Days, 19 Hours, 36 Mins, 14 Secs)
  const [timeLeft, setTimeLeft] = useState({
    days: 254,
    hours: 19,
    minutes: 36,
    seconds: 14,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart?.cartItems || []);

  const fallbackFurniture = [
    {
      _id: "cl_p1",
      name: "Contemporary Leather Sofa",
      brand: "Casa Craft",
      category: "Living Room",
      price: 89.0,
      compareAtPrice: 99.0,
      rating: 5.0,
      reviewCount: 1,
      badge: "Sale!",
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=80",
      description: "Cognac semi-aniline top-grain leather sofa with clean lines and sturdy black metal stiletto legs.",
      dimensions: '82" W × 36" D × 32" H',
      materials: "Top-grain Italian leather, Kiln-dried hardwood frame",
      inStock: true,
    },
    {
      _id: "cl_p2",
      name: "Display Cabinet",
      brand: "Nordic Haven",
      category: "Home Storage",
      price: 49.0,
      compareAtPrice: null,
      rating: 4.0,
      reviewCount: 1,
      badge: null,
      image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&auto=format&fit=crop&q=80",
      description: "Elegant vanity display cabinet with slender tapered legs, gold-tone accents, and curved storage compartment.",
      dimensions: '42" W × 18" D × 48" H',
      materials: "Engineered solid wood, Matte lacquer, Brass capped hardware",
      inStock: true,
    },
    {
      _id: "cl_p3",
      name: "Ergonomic Office Chair",
      brand: "Herman Miller",
      category: "Office Furniture",
      price: 89.0,
      priceRange: "$89.00 - $39.00",
      compareAtPrice: 119.0,
      rating: 5.0,
      reviewCount: 1,
      badge: null,
      image: "https://images.unsplash.com/photo-1580481077195-c3a8a37f714c?w=800&auto=format&fit=crop&q=80",
      description: "Executive mid-century swivel office chair crafted with bentwood shell, cream leatherette cushion, and smooth rolling casters.",
      dimensions: '26" W × 26" D × 38" H',
      materials: "Walnut veneer shell, Polyurethane leather, Chrome base",
      inStock: true,
    },
    {
      _id: "cl_p4",
      name: "Handcrafted Lounge Chair",
      brand: "Casa Craft",
      category: "Living Room",
      price: 50.0,
      compareAtPrice: 60.0,
      rating: 5.0,
      reviewCount: 1,
      badge: "Sale!",
      image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&auto=format&fit=crop&q=80",
      description: "Sphere spherical woven rattan egg pod lounge armchair with deep cushioned charcoal seating pillow.",
      dimensions: '38" W × 36" D × 32" H',
      materials: "Natural woven wicker, Weather-resistant canvas, High-density foam",
      inStock: true,
    },
    {
      _id: "cl_p5",
      name: "Leather Recliner",
      brand: "Ashley",
      category: "Living Room",
      price: 49.0,
      compareAtPrice: 59.0,
      rating: 5.0,
      reviewCount: 1,
      badge: "Sale!",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80",
      description: "Deep-comfort saddle brown rolled arm recliner with turned wooden feet and plush lumbar support.",
      dimensions: '36" W × 38" D × 40" H',
      materials: "Full grain saddle leather, Solid hardwood frame",
      inStock: true,
    },
    {
      _id: "cl_p6",
      name: "Lounge Chair",
      brand: "West Elm",
      category: "Outdoor",
      price: 39.0,
      compareAtPrice: 49.0,
      rating: 4.0,
      reviewCount: 1,
      badge: "Sale!",
      image: "https://images.unsplash.com/photo-1580481077195-c3a8a37f714c?w=800&auto=format&fit=crop&q=80",
      description: "Bohemian hanging teardrop swing lounge chair with curved freestanding metal stand and cream tufted cushion.",
      dimensions: '40" W × 40" D × 78" H',
      materials: "All-weather resin wicker, Powder-coated steel, Olefin fabric",
      inStock: true,
    },
    {
      _id: "cl_p7",
      name: "Modern Wooden Table",
      brand: "Casa Craft",
      category: "Dining Room",
      price: 69.0,
      compareAtPrice: 79.0,
      rating: 5.0,
      reviewCount: 1,
      badge: "-15%",
      image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&auto=format&fit=crop&q=80",
      description: "Round three-legged Scandinavian natural oak accent coffee table with beveled rounded edge.",
      dimensions: '36" Dia × 29" H',
      materials: "Solid American white oak, Natural matte protective oil",
      inStock: true,
    },
    {
      _id: "cl_p8",
      name: "Scandinavian Wooden Table",
      brand: "Nordic Haven",
      category: "Living Room",
      price: 69.0,
      compareAtPrice: 79.0,
      rating: 4.0,
      reviewCount: 1,
      badge: null,
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=80",
      description: "Contemporary 2-seater neutral cream loveseat sofa with supportive dual back cushions and dark walnut legs.",
      dimensions: '60" W × 34" D × 32" H',
      materials: "Woven linen-blend upholstery, Solid pine frame",
      inStock: true,
    },
    {
      _id: "cl_p9",
      name: "Luxury Tufted Velvet Sofa",
      brand: "Casa Craft",
      category: "Luxury Collection",
      price: 49.0,
      compareAtPrice: null,
      rating: 4.5,
      reviewCount: 2,
      badge: null,
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80",
      description: "Classic Chesterfield style single-seater armchair with deep diamond button tufting and rich taupe velvet texture.",
      dimensions: '34" W × 34" D × 35" H',
      materials: "Plush velvet, Turned espresso legs, Brass nailhead trim",
      inStock: true,
    },
    {
      _id: "cl_p10",
      name: "Wooden Dining Chair",
      brand: "West Elm",
      category: "Dining Room",
      price: 59.0,
      compareAtPrice: 69.0,
      rating: 4.0,
      reviewCount: 1,
      badge: "-14%",
      image: "https://images.unsplash.com/photo-1503602642458-232111445657?w=800&auto=format&fit=crop&q=80",
      description: "Curved bentwood arm dining chair with dark charcoal leatherette seat and warm walnut grain finish.",
      dimensions: '22" W × 21" D × 31" H',
      materials: "Molded walnut plywood, High-density cushion, PU leather",
      inStock: true,
    },
  ];

  const pieceList = products.length > 0 ? products : fallbackFurniture;

  const handleAddToCart = (product, qty = 1, options = null) => {
    if (isOutOfStock(product)) {
      toast.error(`Sorry, ${product.name || "item"} is out of stock!`);
      return;
    }

    const itemToAdd = {
      ...product,
      price: product.price,
      customOptions: options,
    };

    dispatch(addToCart({ product: itemToAdd, quantity: qty }));
    toast.success(`${itemToAdd.name} added to cart! 🛋️`);
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

  const circularCategories = [
    {
      id: "Outdoor",
      name: "Outdoor",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&auto=format&fit=crop&q=80",
    },
    {
      id: "Home Storage",
      name: "Home Storage",
      image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400&auto=format&fit=crop&q=80",
    },
    {
      id: "Kitchen",
      name: "Kitchen",
      image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=400&auto=format&fit=crop&q=80",
    },
    {
      id: "Living Room",
      name: "Living Room",
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&auto=format&fit=crop&q=80",
    },
    {
      id: "Bedroom",
      name: "Bedroom",
      image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&auto=format&fit=crop&q=80",
    },
    {
      id: "Dining Room",
      name: "Dining Room",
      image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=400&auto=format&fit=crop&q=80",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#FAF8F5] text-stone-900 antialiased selection:bg-[#A07855]/20 selection:text-[#A07855]">
      {/* ================= NAVBAR ================= */}
      <Navbar
        business={business}
        cartCount={cartCount}
        onOpenCart={() => setCartOpen(true)}
        activePage={activePage}
        onNavigate={(page) => {
          setActivePage(page);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          if (activePage !== "catalog") setActivePage("catalog");
        }}
        categories={categories}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setActivePage("catalog");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />

      {/* ================= MAIN ROUTE RENDERER ================= */}
      <main className="flex-1">
        {/* ================= VIEW 1: HOMEPAGE ================= */}
        {activePage === "home" && (
          <div className="space-y-16 sm:space-y-24">
            {/* 1. HERO SECTION (Dark Slat Wood) */}
            <section className="relative min-h-[520px] lg:min-h-[640px] flex items-center justify-center text-center overflow-hidden">
              {/* Background with Dark Acoustic Wood Slats Image & Mood Light */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1600&auto=format&fit=crop&q=80')`,
                }}
              >
                <div className="absolute inset-0 bg-stone-950/70 backdrop-blur-[1px]" />
              </div>

              {/* Hero Content */}
              <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-20 space-y-6">
                {/* Pill Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-medium tracking-wide">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A07855]" />
                  <span>Modern Living Starts Here</span>
                </div>

                {/* Hero Title */}
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-serif text-white tracking-tight leading-[1.15] max-w-3xl mx-auto">
                  Crafted Furniture For Every Beautiful Home
                </h1>

                {/* CTA Button */}
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setActivePage("catalog");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="inline-flex items-center gap-3 px-7 py-3.5 bg-[#A07855] hover:bg-[#8d6645] text-white rounded-full text-xs font-bold tracking-wider transition-all duration-300 shadow-xl hover:shadow-[#A07855]/30 cursor-pointer group hover:scale-105"
                  >
                    <span>Shop Now</span>
                    <span className="w-6 h-6 rounded-full bg-white text-[#A07855] flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                      <ArrowRight size={13} />
                    </span>
                  </button>
                </div>
              </div>
            </section>

            {/* 2. EXPLORE FURNITURE CATEGORIES */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F7F5F2] border border-stone-200 text-stone-600 text-xs font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A07855]" />
                  <span>Shop By Category</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900 tracking-tight">
                  Explore Furniture Categories
                </h2>
              </div>

              {/* Circular Avatars */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 pt-2">
                {circularCategories.map((cat) => (
                  <div
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setActivePage("catalog");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="group flex flex-col items-center gap-3 cursor-pointer"
                  >
                    <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-stone-200/80 group-hover:border-[#A07855] transition-all duration-300 shadow-xs group-hover:shadow-md p-1 bg-white">
                      <div className="w-full h-full rounded-full overflow-hidden">
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                        />
                      </div>
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-stone-800 group-hover:text-[#A07855] transition">
                      {cat.name}
                    </span>
                  </div>
                ))}
              </div>

              {/* Pagination Dots */}
              <div className="flex items-center justify-center gap-2 pt-2">
                {[...Array(6)].map((_, i) => (
                  <span
                    key={i}
                    className={`h-2 rounded-full transition-all ${
                      i === 3 ? "w-6 bg-[#A07855]" : "w-2 bg-stone-300"
                    }`}
                  />
                ))}
              </div>
            </section>

            {/* 3. DUAL PROMOTIONAL FLASH BANNERS */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Banner 1: Limited Time Flash Sale */}
                <div className="relative h-80 sm:h-96 rounded-3xl overflow-hidden group shadow-lg">
                  <img
                    src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1000&auto=format&fit=crop&q=80"
                    alt="Limited Time Flash Sale"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-8 sm:p-10 flex flex-col justify-end text-left space-y-3">
                    <span className="text-xs uppercase font-bold tracking-widest text-[#A07855]">
                      Save Up To 50%
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-bold font-serif text-white max-w-xs">
                      Limited Time Flash Sale
                    </h3>
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setActivePage("catalog");
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="inline-flex items-center gap-2 text-xs font-bold text-white group-hover:text-[#A07855] transition cursor-pointer"
                      >
                        <span>Shop Now</span>
                        <span className="w-5 h-5 rounded-full bg-white text-stone-900 flex items-center justify-center text-xs group-hover:translate-x-1 transition-transform">
                          <ArrowRight size={11} />
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Banner 2: Mega Furniture Sale Event */}
                <div className="relative h-80 sm:h-96 rounded-3xl overflow-hidden group shadow-lg">
                  <img
                    src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1000&auto=format&fit=crop&q=80"
                    alt="Mega Furniture Sale Event"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-8 sm:p-10 flex flex-col justify-end text-left space-y-3">
                    <span className="text-xs uppercase font-bold tracking-widest text-[#A07855]">
                      Extra 20% Off
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-bold font-serif text-white max-w-xs">
                      Mega Furniture Sale Event
                    </h3>
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setActivePage("catalog");
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="inline-flex items-center gap-2 text-xs font-bold text-white group-hover:text-[#A07855] transition cursor-pointer"
                      >
                        <span>Shop Now</span>
                        <span className="w-5 h-5 rounded-full bg-white text-stone-900 flex items-center justify-center text-xs group-hover:translate-x-1 transition-transform">
                          <ArrowRight size={11} />
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 4. DISCOVER OUR NEWEST ARRIVALS GRID */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-left">
              {/* Header with Subtext */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 pb-6">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F7F5F2] border border-stone-200 text-stone-600 text-xs font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#A07855]" />
                    <span>Top Rated Product</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900">
                    Discover Our Newest Arrivals
                  </h2>
                </div>
                <p className="text-xs text-stone-500 max-w-md leading-relaxed">
                  Find beautifully crafted furniture designed to transform ordinary spaces into warm, elegant, and inviting living experience.
                </p>
              </div>

              {/* 4 Cards Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {pieceList.slice(6, 10).map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onQuickView={(p) => setQuickViewProduct(p)}
                    onSelectProduct={(p) => {
                      setSelectedProduct(p);
                      setActivePage("product-detail");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  />
                ))}
              </div>

              {/* Bottom "View All" Prompt */}
              <div className="text-center pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setActivePage("catalog");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="text-xs text-stone-500 hover:text-[#A07855] font-medium transition cursor-pointer"
                >
                  Let's make something great together.{" "}
                  <span className="font-bold underline text-stone-800 hover:text-[#A07855]">
                    View Our All Products.
                  </span>
                </button>
              </div>
            </section>

            {/* 5. MASONRY ASYMMETRICAL CATEGORY SHOWCASE GRID */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-left">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Big Card on Left: Upholstered Storage Beds */}
                <div
                  onClick={() => {
                    setSelectedCategory("Bedroom");
                    setActivePage("catalog");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="lg:col-span-5 relative rounded-3xl overflow-hidden group cursor-pointer shadow-md min-h-[420px] lg:min-h-[520px] flex flex-col justify-end p-8"
                >
                  <img
                    src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900&auto=format&fit=crop&q=80"
                    alt="Upholstered Storage Beds"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="relative z-10 flex items-end justify-between">
                    <div className="space-y-1 text-white">
                      <h3 className="text-xl sm:text-2xl font-bold font-serif">
                        Upholstered Storage Beds | 1500+ Designs
                      </h3>
                      <p className="text-xs text-stone-300">Starting from $899</p>
                    </div>
                    <span className="w-9 h-9 rounded-full bg-[#A07855] text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <ArrowUpRight size={18} />
                    </span>
                  </div>
                </div>

                {/* Right 4 Small Cards Grid */}
                <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Card 1: Cabinets */}
                  <div
                    onClick={() => {
                      setSelectedCategory("Home Storage");
                      setActivePage("catalog");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="relative rounded-3xl overflow-hidden group cursor-pointer shadow-md h-60 flex flex-col justify-end p-6"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&auto=format&fit=crop&q=80"
                      alt="Cabinets"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="relative z-10 flex items-end justify-between">
                      <div className="space-y-0.5 text-white">
                        <h4 className="text-base font-bold font-serif">
                          Cabinets | 600+ Items
                        </h4>
                        <p className="text-xs text-stone-300">Starting from $199</p>
                      </div>
                      <span className="w-8 h-8 rounded-full bg-[#A07855] text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <ArrowUpRight size={16} />
                      </span>
                    </div>
                  </div>

                  {/* Card 2: Dining Sets */}
                  <div
                    onClick={() => {
                      setSelectedCategory("Dining Room");
                      setActivePage("catalog");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="relative rounded-3xl overflow-hidden group cursor-pointer shadow-md h-60 flex flex-col justify-end p-6"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&auto=format&fit=crop&q=80"
                      alt="Dining Sets"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="relative z-10 flex items-end justify-between">
                      <div className="space-y-0.5 text-white">
                        <h4 className="text-base font-bold font-serif">
                          Dining Sets | 750+ Designs
                        </h4>
                        <p className="text-xs text-stone-300">Starting from $1,299</p>
                      </div>
                      <span className="w-8 h-8 rounded-full bg-[#A07855] text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <ArrowUpRight size={16} />
                      </span>
                    </div>
                  </div>

                  {/* Card 3: Sofa Sets */}
                  <div
                    onClick={() => {
                      setSelectedCategory("Living Room");
                      setActivePage("catalog");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="relative rounded-3xl overflow-hidden group cursor-pointer shadow-md h-60 flex flex-col justify-end p-6"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=80"
                      alt="Sofa Sets"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="relative z-10 flex items-end justify-between">
                      <div className="space-y-0.5 text-white">
                        <h4 className="text-base font-bold font-serif">
                          Sofa Sets | 1200+ Styles
                        </h4>
                        <p className="text-xs text-stone-300">Starting from $1,299</p>
                      </div>
                      <span className="w-8 h-8 rounded-full bg-[#A07855] text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <ArrowUpRight size={16} />
                      </span>
                    </div>
                  </div>

                  {/* Card 4: Coffee Tables */}
                  <div
                    onClick={() => {
                      setSelectedCategory("Living Room");
                      setActivePage("catalog");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="relative rounded-3xl overflow-hidden group cursor-pointer shadow-md h-60 flex flex-col justify-end p-6"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop&q=80"
                      alt="Coffee Tables"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="relative z-10 flex items-end justify-between">
                      <div className="space-y-0.5 text-white">
                        <h4 className="text-base font-bold font-serif">
                          Coffee Tables | 550+ Items
                        </h4>
                        <p className="text-xs text-stone-300">Starting from $189</p>
                      </div>
                      <span className="w-8 h-8 rounded-full bg-[#A07855] text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <ArrowUpRight size={16} />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 6. FEATURE SPOTLIGHT: LUXURY TV CABINETS */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-[#F7F5F2] rounded-3xl p-8 sm:p-12 border border-stone-200/80 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
                {/* Left Specs */}
                <div className="lg:col-span-6 space-y-6">
                  <h3 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900">
                    Luxury TV Cabinets Crafted With Elegance
                  </h3>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-[#A07855] shrink-0 shadow-2xs">
                        <Box size={20} />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-stone-900">Modern Minimal Design</h4>
                        <p className="text-[11px] text-stone-500">Floating clean lines</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-[#A07855] shrink-0 shadow-2xs">
                        <Layers size={20} />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-stone-900">Smart Storage Spaces</h4>
                        <p className="text-[11px] text-stone-500">Concealed cable docks</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-xs text-stone-600 pt-2 border-t border-stone-200">
                    <span>• Premium Wood</span>
                    <span>• Easy To Maintain</span>
                    <span>• Durable Build Quality</span>
                  </div>
                </div>

                {/* Right Image */}
                <div className="lg:col-span-6 rounded-2xl overflow-hidden shadow-md">
                  <img
                    src="https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=1000&auto=format&fit=crop&q=80"
                    alt="Luxury TV Cabinets"
                    className="w-full h-full object-cover max-h-80"
                  />
                </div>
              </div>
            </section>

            {/* 7. DARK COUNTDOWN FLASH DEAL SECTION */}
            <section className="bg-[#18181B] text-white py-16 sm:py-24">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left">
                  {/* Left Deal Content */}
                  <div className="lg:col-span-6 space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#A07855]" />
                      <span>Flat Discount</span>
                    </div>

                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif tracking-tight leading-tight">
                      Discover Amazing Flat Furniture Discounts Today
                    </h2>

                    <p className="text-xs sm:text-sm text-stone-400 leading-relaxed max-w-lg">
                      Shop premium furniture collections at exclusive flat discounts and transform your home with stylish, comfortable, and modern designs.
                    </p>

                    {/* Countdown Timer */}
                    <div className="flex items-center gap-4 sm:gap-6 pt-2">
                      <div className="text-center">
                        <span className="text-2xl sm:text-4xl font-bold font-serif text-white block">
                          {timeLeft.days}
                        </span>
                        <span className="text-[10px] sm:text-xs uppercase text-stone-400 font-semibold tracking-wider">
                          Days
                        </span>
                      </div>
                      <span className="text-2xl text-[#A07855] font-bold">:</span>
                      <div className="text-center">
                        <span className="text-2xl sm:text-4xl font-bold font-serif text-white block">
                          {String(timeLeft.hours).padStart(2, "0")}
                        </span>
                        <span className="text-[10px] sm:text-xs uppercase text-stone-400 font-semibold tracking-wider">
                          Hours
                        </span>
                      </div>
                      <span className="text-2xl text-[#A07855] font-bold">:</span>
                      <div className="text-center">
                        <span className="text-2xl sm:text-4xl font-bold font-serif text-white block">
                          {String(timeLeft.minutes).padStart(2, "0")}
                        </span>
                        <span className="text-[10px] sm:text-xs uppercase text-stone-400 font-semibold tracking-wider">
                          Minutes
                        </span>
                      </div>
                      <span className="text-2xl text-[#A07855] font-bold">:</span>
                      <div className="text-center">
                        <span className="text-2xl sm:text-4xl font-bold font-serif text-[#A07855] block">
                          {String(timeLeft.seconds).padStart(2, "0")}
                        </span>
                        <span className="text-[10px] sm:text-xs uppercase text-stone-400 font-semibold tracking-wider">
                          Seconds
                        </span>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setActivePage("catalog");
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="inline-flex items-center gap-3 px-8 py-3.5 bg-[#A07855] hover:bg-[#8d6645] text-white rounded-full text-xs font-bold tracking-wider transition-all duration-300 shadow-xl cursor-pointer group hover:scale-105"
                      >
                        <span>Buy Now</span>
                        <span className="w-6 h-6 rounded-full bg-white text-[#A07855] flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                          <ArrowRight size={13} />
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Right Multi-Panel Architectural Split Collage */}
                  <div className="lg:col-span-6 grid grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-lg">
                        <img
                          src="https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600&auto=format&fit=crop&q=80"
                          alt="Dining Arch"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="aspect-square rounded-3xl overflow-hidden shadow-lg">
                        <img
                          src="https://images.unsplash.com/photo-1503602642458-232111445657?w=600&auto=format&fit=crop&q=80"
                          alt="Chair Close-Up"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="space-y-4 pt-6">
                      <div className="aspect-square rounded-3xl overflow-hidden shadow-lg">
                        <img
                          src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80"
                          alt="Pendant Light"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-lg">
                        <img
                          src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80"
                          alt="Lounge Harmony"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 8. MODERN LIVING INSPIRATIONS LOOKBOOK */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-center pb-8">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F7F5F2] border border-stone-200 text-stone-600 text-xs font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A07855]" />
                  <span>Design Stories</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900">
                  Modern Living Inspirations
                </h2>
              </div>

              {/* 4 Vertical Room Photo Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    title: "Open Acoustic Lounge",
                    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80",
                    tag: "Living Space",
                  },
                  {
                    title: "Warm Timber Dining",
                    img: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600&auto=format&fit=crop&q=80",
                    tag: "Dining Suite",
                  },
                  {
                    title: "Minimalist Master Suite",
                    img: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&auto=format&fit=crop&q=80",
                    tag: "Bedroom Sanctuary",
                  },
                  {
                    title: "Scandinavian Kitchen Nook",
                    img: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80",
                    tag: "Kitchen & Bar",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setActivePage("catalog");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="relative rounded-3xl overflow-hidden group cursor-pointer shadow-md h-96 flex flex-col justify-end p-6 text-left"
                  >
                    <img
                      src={item.img}
                      alt={item.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="relative z-10 space-y-1 text-white">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#A07855]">
                        {item.tag}
                      </span>
                      <h4 className="text-base font-bold font-serif">{item.title}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ================= VIEW 2: PRODUCT LISTING / CATALOG ================= */}
        {activePage === "catalog" && (
          <ProductListing
            products={pieceList}
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => setSelectedCategory(cat)}
            onAddToCart={handleAddToCart}
            onQuickView={(p) => setQuickViewProduct(p)}
            onSelectProduct={(p) => {
              setSelectedProduct(p);
              setActivePage("product-detail");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        )}

        {/* ================= VIEW 3: PRODUCT DETAILS ================= */}
        {activePage === "product-detail" && (
          <ProductDetails
            product={selectedProduct}
            allProducts={pieceList}
            onAddToCart={handleAddToCart}
            onBack={() => {
              setActivePage("catalog");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onSelectProduct={(p) => {
              setSelectedProduct(p);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onQuickView={(p) => setQuickViewProduct(p)}
          />
        )}
      </main>

      {/* ================= FOOTER ================= */}
      <Footer
        business={business}
        onNavigate={(page) => {
          setActivePage(page);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setActivePage("catalog");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />

      {/* ================= QUICK VIEW MODAL ================= */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 relative shadow-2xl space-y-6 text-left animate-in fade-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center transition cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <div className="aspect-square rounded-2xl bg-[#F7F5F2] p-6 flex items-center justify-center">
                <img
                  src={getProductImage(quickViewProduct, quickViewProduct.image)}
                  alt={quickViewProduct.name}
                  className="w-full h-full object-contain max-h-56 drop-shadow-md"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-[11px] uppercase font-bold text-[#A07855] tracking-wider">
                    {quickViewProduct.brand || "Casa Craft"}
                  </span>
                  <h3 className="text-lg font-bold font-serif text-stone-900 mt-0.5">
                    {quickViewProduct.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-amber-500 pt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={13}
                        className={
                          i < Math.floor(quickViewProduct.rating || 5)
                            ? "fill-amber-500 text-amber-500"
                            : "text-stone-300"
                        }
                      />
                    ))}
                    <span className="text-stone-500 text-xs">
                      ({quickViewProduct.reviewCount || 1})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-stone-900">
                    ${Number(quickViewProduct.price).toFixed(2)}
                  </span>
                  {quickViewProduct.compareAtPrice &&
                    quickViewProduct.compareAtPrice > quickViewProduct.price && (
                      <span className="text-sm text-stone-400 line-through">
                        ${Number(quickViewProduct.compareAtPrice).toFixed(2)}
                      </span>
                    )}
                </div>

                <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                  {quickViewProduct.description}
                </p>

                {quickViewProduct.dimensions && (
                  <p className="text-[11px] text-stone-500 font-medium">
                    Dimensions: {quickViewProduct.dimensions}
                  </p>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      handleAddToCart(quickViewProduct);
                      setQuickViewProduct(null);
                    }}
                    className="flex-1 py-3 bg-[#A07855] hover:bg-[#8d6645] text-white text-xs font-semibold rounded-xl transition shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingBag size={15} />
                    <span>Add to Cart</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedProduct(quickViewProduct);
                      setQuickViewProduct(null);
                      setActivePage("product-detail");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="px-4 py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl transition cursor-pointer"
                  >
                    Full Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= REDUX CART DRAWER ================= */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />
    </div>
  );
}
