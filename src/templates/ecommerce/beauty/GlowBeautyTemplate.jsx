import React, { useState, useMemo, useRef } from "react";
import {
  Sparkles,
  Heart,
  ShoppingBag,
  Star,
  Check,
  ShieldCheck,
  ArrowRight,
  Droplets,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Leaf,
  Sun,
  Eye,
  X,
  Plus,
  Minus,
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

export default function GlowBeautyTemplate({
  business = {},
  products = [],
  categories = [],
  offers = [],
  reviews = [],
  customization = {},
}) {
  // Navigation: "home" | "catalog" | "offers" | "product-detail"
  const [activePage, setActivePage] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [quickViewQty, setQuickViewQty] = useState(1);
  const [quickViewShade, setQuickViewShade] = useState(null);

  // Search & Filters
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Trending section sub-tab: "latest" | "new-arrivals" | "best"
  const [trendingTab, setTrendingTab] = useState("latest");

  // Before & After Interactive Slider state (0 to 100 percent)
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);
  const sliderRef = useRef(null);

  // Benefits Accordion state: "damage" | "sun" | "tone" | "rays"
  const [activeAccordion, setActiveAccordion] = useState("damage");

  // Testimonial Carousel state
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonials = [
    {
      id: 1,
      quote:
        "Consequat nec dui sed facilisis lorem curabitur egestas diam massa morbi id orci nunc et morbi vulputate.",
      name: "Stephan Robot",
      role: "Verified Collector",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
      rating: 5,
    },
    {
      id: 2,
      quote:
        "The barrier repair mist transformed my winter dry patches in under 3 days. Beautiful botanical texture with zero stickiness.",
      name: "Camille Laurent",
      role: "Skincare Aesthetician",
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80",
      rating: 5,
    },
    {
      id: 3,
      quote:
        "Finally, clean makeup that feels like serum. The shade matching and cold-pressed seed oils give an effortless glass-skin finish.",
      name: "Elena Vance",
      role: "Clean Beauty Editor",
      avatar:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80",
      rating: 5,
    },
  ];

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart?.cartItems || []);

  const defaultProducts = [
    {
      _id: "glow-ref-1",
      name: "Smooth Essen",
      price: 10.0,
      compareAtPrice: 16.0,
      category: "Essences & Toners",
      activeIngredient: "Damask Rose Hydrosol & Hyaluron",
      concern: "Radiance & Dewy Moisture",
      badge: "Sale",
      rating: 5.0,
      reviewCount: 38,
      image:
        "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80",
      description:
        "Ultra-lightweight smoothing essence formulated to rebalance pH and deliver deep botanical hydration with a dewy glow.",
      shades: [
        { name: "Crimson Tint", hex: "#9E2A2B" },
        { name: "Sunlight Gold", hex: "#E9B824" },
        { name: "Royal Blue", hex: "#2B4C7E" },
        { name: "Blush Pink", hex: "#E8A598" },
        { name: "Sage Mint", hex: "#9CAF88" },
      ],
      extraShadesCount: 1,
      inStock: true,
    },
    {
      _id: "glow-ref-2",
      name: "Urban Decay",
      price: 10.0,
      compareAtPrice: 15.0,
      category: "Lip Care & Stains",
      activeIngredient: "Cold-Pressed Jojoba & Vitamin E",
      concern: "Long-Wear Velvet Finish",
      badge: "Sale",
      rating: 5.0,
      reviewCount: 54,
      image:
        "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&auto=format&fit=crop&q=80",
      description:
        "Rich pigment velvet formula nourishing lips while maintaining all-day botanical color.",
      shades: [
        { name: "Ruby Red", hex: "#A81D24" },
        { name: "Warm Amber", hex: "#D9822B" },
        { name: "Deep Cobalt", hex: "#1F3A60" },
        { name: "Petal Rose", hex: "#ECA3A3" },
        { name: "Pistachio", hex: "#8EA87D" },
      ],
      extraShadesCount: 1,
      inStock: true,
    },
    {
      _id: "glow-ref-3",
      name: "Smoothing Essence",
      price: 10.0,
      compareAtPrice: 18.0,
      category: "Serums & Elixirs",
      activeIngredient: "5-Lipid Ceramide Complex",
      concern: "Cellular Barrier Repair",
      badge: "Sale",
      rating: 5.0,
      reviewCount: 42,
      image:
        "https://images.unsplash.com/photo-1608248597359-2451515bb529?w=800&auto=format&fit=crop&q=80",
      description:
        "Daily balancing smoothing essence designed to soothe redness and restore supple barrier comfort.",
      shades: [
        { name: "Berry Glow", hex: "#8A1C28" },
        { name: "Ochre Gold", hex: "#D69F3D" },
        { name: "Ocean Deep", hex: "#234163" },
        { name: "Peach Nectar", hex: "#F3AFA0" },
        { name: "Eucalyptus", hex: "#7E9D7B" },
      ],
      extraShadesCount: 1,
      inStock: true,
    },
    {
      _id: "glow-ref-4",
      name: "Red Lipstick",
      price: 10.0,
      compareAtPrice: 14.0,
      category: "Lip Care & Stains",
      activeIngredient: "Organic Shea & Pomegranate Oil",
      concern: "Hydrating Satin Color",
      badge: "Sale",
      rating: 5.0,
      reviewCount: 67,
      image:
        "https://images.unsplash.com/photo-1599733589046-9b8308b5b50d?w=800&auto=format&fit=crop&q=80",
      description:
        "Iconic crimson shade infused with organic pomegranate seed butter for hydrated, feather-free finish.",
      shades: [
        { name: "Classic Crimson", hex: "#B81D24" },
        { name: "Golden Honey", hex: "#DAA520" },
        { name: "Midnight Navy", hex: "#192841" },
        { name: "Blush Nude", hex: "#E8B4B8" },
        { name: "Matcha Mist", hex: "#8FA382" },
      ],
      extraShadesCount: 1,
      inStock: true,
    },
  ];

  const beautyItems = products.length > 0 ? products : defaultProducts;

  const brandName =
    business?.businessName ||
    business?.name ||
    customization?.heroHeadline ||
    "GLOW BEAUTY";

  const brandLogo = customization?.logo || business?.logo || null;
  const brandPhone =
    business?.phone ||
    business?.businessPhone ||
    business?.contactPhone ||
    "+1 (800) 829-GLOW";
  const brandEmail =
    business?.email ||
    business?.businessEmail ||
    business?.contactEmail ||
    "concierge@glowbeauty.com";

  const rawAddr = business?.address || business?.registered_business_address;
  const brandAddress =
    typeof rawAddr === "string"
      ? rawAddr
      : rawAddr && typeof rawAddr === "object"
        ? [
          rawAddr.street,
          rawAddr.addressLine2,
          rawAddr.city,
          rawAddr.state,
          rawAddr.postalCode,
          rawAddr.country,
        ]
          .filter(Boolean)
          .join(", ")
        : "450 Botanical Way, Malibu, CA 90265";

  const handleAddToCart = (product, qty = 1, shade = null) => {
    if (isOutOfStock(product)) {
      toast.error(`Sorry, ${product.name} is currently out of stock!`);
      return;
    }
    const itemToAdd = shade
      ? { ...product, selectedShade: shade }
      : product;
    dispatch(addToCart({ product: itemToAdd, quantity: qty }));
    toast.success(`${product.name} added to Beauty Bag! 🌸`);
    setCartOpen(true);
    if (quickViewProduct) {
      setQuickViewProduct(null);
    }
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
    0,
  );

  const handleSelectProduct = (p) => {
    setSelectedProduct(p);
    setActivePage("product-detail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleQuickView = (p) => {
    setQuickViewProduct(p);
    setQuickViewQty(1);
    setQuickViewShade(p.shades && p.shades.length > 0 ? p.shades[0] : null);
  };

  // Filter products for trending sub-tabs
  const filteredTrendingProducts = useMemo(() => {
    if (trendingTab === "new-arrivals") {
      return [...beautyItems].reverse().slice(0, 4);
    }
    if (trendingTab === "best") {
      return [...beautyItems].sort((a, b) => (b.rating || 5) - (a.rating || 5)).slice(0, 4);
    }
    return beautyItems.slice(0, 4);
  }, [beautyItems, trendingTab]);

  // Before & After Drag Handlers
  const handleSliderMove = (clientX) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const clampedPercent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(clampedPercent);
  };

  const handleTouchMove = (e) => {
    if (e.touches && e.touches[0]) {
      handleSliderMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e) => {
    if (isDraggingSlider) {
      handleSliderMove(e.clientX);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col font-sans bg-[#FAF8F5] text-stone-900 antialiased selection:bg-[#EBDDD5] selection:text-stone-900"
      onMouseMove={handleMouseMove}
      onMouseUp={() => setIsDraggingSlider(false)}
      onTouchEnd={() => setIsDraggingSlider(false)}
    >
      {/* ================= 1. CLEAN BEAUTY NAVBAR ================= */}
      <Navbar
        brandName={brandName}
        brandLogo={brandLogo}
        brandPhone={brandPhone}
        activePage={activePage}
        setActivePage={setActivePage}
        cartCount={cartCount}
        onOpenCart={() => setCartOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenSkinQuiz={() => {
          setActivePage("catalog");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />

      {/* ================= 2. MAIN ACTIVE VIEW ================= */}
      <main className="flex-1">
        {/* ================= VIEW 1: HOME ================= */}
        {activePage === "home" && (
          <>
            {/* ================= HERO SECTION (REFERENCE MATCH) ================= */}
            <section className="relative overflow-hidden bg-[#F6F4F0] pt-12 pb-16 md:pt-20 md:pb-24 border-b border-[#E8E2D9]">
              {/* Subtle background glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-[#F2ECE4] to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
                  {/* Left Column: Typography */}
                  <div className="lg:col-span-6 space-y-6 text-left">
                    <div className="space-y-1">
                      <span className="font-serif italic text-2xl sm:text-3xl text-stone-500 font-normal tracking-wide block">
                        New Season
                      </span>
                      <h1 className="text-4xl sm:text-6xl font-serif font-black tracking-tight text-[#2B2824] leading-[1.1]">
                        Pure Botanical Skincare.
                      </h1>
                    </div>

                    <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-lg">
                      Cold-pressed plant lipids, restorative ceramides, and multi-depth hydration designed to strengthen your skin barrier naturally.
                    </p>

                    <div className="flex flex-wrap gap-4 pt-2">
                      <button
                        onClick={() => {
                          setActivePage("catalog");
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="px-8 py-3.5 bg-[#8F9E68] hover:bg-[#7D8C57] text-white rounded-full text-xs font-bold uppercase tracking-widest transition shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5 active:scale-95"
                      >
                        <span>Shop Now</span>
                        <ArrowRight size={15} />
                      </button>

                      <button
                        onClick={() => {
                          setActivePage("catalog");
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="px-7 py-3.5 bg-white border border-[#D9D2C7] hover:border-stone-400 text-stone-800 rounded-full text-xs font-bold uppercase tracking-widest transition flex items-center gap-2 cursor-pointer shadow-xs hover:bg-stone-50"
                      >
                        <span>Explore Ritual</span>
                      </button>
                    </div>

                    {/* Trust Highlights Strip */}
                    <div className="grid grid-cols-3 gap-6 pt-6 border-t border-[#E5DDD2] text-left">
                      <div>
                        <span className="text-2xl font-serif font-black text-stone-900 block">
                          98%
                        </span>
                        <p className="text-[11px] text-stone-500 mt-0.5 uppercase tracking-wider font-medium">
                          Barrier Hydration
                        </p>
                      </div>
                      <div>
                        <span className="text-2xl font-serif font-black text-stone-900 block">
                          100%
                        </span>
                        <p className="text-[11px] text-stone-500 mt-0.5 uppercase tracking-wider font-medium">
                          Vegan & Clean
                        </p>
                      </div>
                      <div>
                        <span className="text-2xl font-serif font-black text-stone-900 block">
                          EWG
                        </span>
                        <p className="text-[11px] text-stone-500 mt-0.5 uppercase tracking-wider font-medium">
                          Verified Formulas
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Hero Pedestal Bottle Presentation */}
                  <div className="lg:col-span-6 relative flex justify-center items-center">
                    <div className="relative w-full max-w-[480px] aspect-square rounded-3xl bg-gradient-to-b from-[#F7F4F0] via-[#ECE5DC] to-[#DFD6CA] p-8 flex items-center justify-center shadow-lg border border-[#E0D8CC]">
                      {/* Decorative Circular Halo */}
                      <div className="absolute inset-8 rounded-full border border-dashed border-stone-300/70 pointer-events-none" />

                      {/* Pedestal platform effect */}
                      <div className="absolute bottom-10 w-3/4 h-12 bg-[#CDC3B6]/50 rounded-full blur-xl pointer-events-none" />

                      {/* Featured Cosmetic Bottle Image */}
                      <img
                        src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=900&auto=format&fit=crop&q=80"
                        alt="Smooth Essence Signature Cosmetic Bottle"
                        className="relative z-10 max-h-[380px] w-auto object-contain drop-shadow-2xl transform hover:scale-105 transition duration-700 cursor-pointer"
                        onClick={() => handleSelectProduct(beautyItems[0])}
                      />

                      {/* Floating Product Badge Overlay */}
                      <div
                        onClick={() => handleSelectProduct(beautyItems[0])}
                        className="absolute bottom-6 left-6 right-6 z-20 bg-white/90 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/80 shadow-md flex items-center justify-between cursor-pointer hover:bg-white transition"
                      >
                        <div className="text-left">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8F9E68]">
                            Signature Launch
                          </span>
                          <h4 className="text-sm font-serif font-bold text-stone-900">
                            Smooth Essen Multi-Hydrator
                          </h4>
                          <span className="text-xs font-bold text-stone-700">
                            $10.00 <span className="line-through text-stone-400 font-normal">$16.00</span>
                          </span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-[#8F9E68] text-white flex items-center justify-center shadow-sm">
                          <ChevronRight size={16} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ================= TRENDING PRODUCTS SECTION (REFERENCE MATCH) ================= */}
            <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-center">
              <div className="space-y-4">
                <h2 className="text-3xl sm:text-4xl font-serif font-black text-[#2B2824]">
                  Trending Products
                </h2>

                {/* Sub-tabs with dot indicator */}
                <div className="flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-medium">
                  <button
                    onClick={() => setTrendingTab("latest")}
                    className={`inline-flex items-center gap-2 pb-1.5 transition cursor-pointer font-semibold ${
                      trendingTab === "latest"
                        ? "text-[#8F9E68] border-b-2 border-[#8F9E68]"
                        : "text-stone-500 hover:text-stone-800"
                    }`}
                  >
                    <span>Latest Product</span>
                    {trendingTab === "latest" && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#8F9E68]" />
                    )}
                  </button>

                  <button
                    onClick={() => setTrendingTab("new-arrivals")}
                    className={`inline-flex items-center gap-2 pb-1.5 transition cursor-pointer font-semibold ${
                      trendingTab === "new-arrivals"
                        ? "text-[#8F9E68] border-b-2 border-[#8F9E68]"
                        : "text-stone-500 hover:text-stone-800"
                    }`}
                  >
                    <span>New Arrivals</span>
                    {trendingTab === "new-arrivals" && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#8F9E68]" />
                    )}
                  </button>

                  <button
                    onClick={() => setTrendingTab("best")}
                    className={`inline-flex items-center gap-2 pb-1.5 transition cursor-pointer font-semibold ${
                      trendingTab === "best"
                        ? "text-[#8F9E68] border-b-2 border-[#8F9E68]"
                        : "text-stone-500 hover:text-stone-800"
                    }`}
                  >
                    <span>Best Products</span>
                    {trendingTab === "best" && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#8F9E68]" />
                    )}
                  </button>
                </div>
              </div>

              {/* 4-Card Responsive Grid with Shade Swatches */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
                {filteredTrendingProducts.map((item) => (
                  <ProductCard
                    key={item._id}
                    product={item}
                    onSelectProduct={handleSelectProduct}
                    onAddToCart={handleAddToCart}
                    onQuickView={handleQuickView}
                  />
                ))}
              </div>

              {/* VIEW ALL CTA Button */}
              <div className="pt-6">
                <button
                  onClick={() => {
                    setActivePage("catalog");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="px-9 py-3.5 bg-white border border-[#D0C8BC] hover:border-stone-800 text-stone-800 rounded-full text-xs font-bold uppercase tracking-widest transition shadow-xs hover:shadow-md cursor-pointer inline-flex items-center gap-2 active:scale-95"
                >
                  <span>View All</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </section>

            {/* ================= DUAL EDITORIAL PROMO BANNERS (REFERENCE MATCH) ================= */}
            <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Banner 1: LANEIGE / Make Up Is An Art */}
                <div className="rounded-3xl bg-[#F7EBE8] border border-[#EED9D5] p-8 sm:p-10 relative overflow-hidden flex flex-col justify-between min-h-[340px] text-left group">
                  {/* Subtle corner floral visual overlay */}
                  <div className="absolute -right-6 -bottom-6 w-56 h-56 rounded-full bg-[#EAD4D0]/60 blur-xl pointer-events-none" />

                  <div className="space-y-2 relative z-10 max-w-xs">
                    <span className="font-serif italic text-2xl text-stone-500 font-normal tracking-wide block">
                      New Season
                    </span>
                    <h3 className="text-3xl sm:text-4xl font-serif font-black text-[#2B2824] leading-tight">
                      Make Up Is An Art.
                    </h3>
                  </div>

                  {/* Banner 1 Image Presentation (Pink cosmetic bottle with baby's breath) */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 w-48 sm:w-56 h-48 sm:h-56 pointer-events-none">
                    <img
                      src="https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&auto=format&fit=crop&q=80"
                      alt="LANEIGE and Baby's Breath Flowers"
                      className="w-full h-full object-contain drop-shadow-xl transform group-hover:scale-105 transition duration-500"
                    />
                  </div>

                  <div className="pt-6 relative z-10">
                    <button
                      onClick={() => {
                        setActivePage("catalog");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="px-7 py-3 bg-[#8F9E68] hover:bg-[#7D8C57] text-white rounded-full text-xs font-bold uppercase tracking-widest transition shadow-sm inline-flex items-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <span>Shop Now</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>

                {/* Banner 2: Healthline / Dry Skin Solution */}
                <div className="rounded-3xl bg-[#FBF3ED] border border-[#ECE0D6] p-8 sm:p-10 relative overflow-hidden flex flex-col justify-between min-h-[340px] text-left group">
                  <div className="absolute -right-8 -bottom-8 w-60 h-60 rounded-full bg-[#EBD9CE]/60 blur-xl pointer-events-none" />

                  <div className="space-y-2 relative z-10 max-w-xs">
                    <span className="font-serif italic text-2xl text-stone-500 font-normal tracking-wide block">
                      Healthline
                    </span>
                    <h3 className="text-3xl sm:text-4xl font-serif font-black text-[#2B2824] leading-tight">
                      Dry Skin Solution.
                    </h3>
                    <p className="text-xs text-stone-500 leading-relaxed pt-1">
                      Consequat nec dui sed facilisis lorem curabitur egestas diam massa morbi id orci.
                    </p>
                  </div>

                  {/* Banner 2 Image Presentation (Dropper bottle on rose quartz crystal bed) */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 w-48 sm:w-56 h-48 sm:h-56 pointer-events-none">
                    <img
                      src="https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80"
                      alt="Dropper bottle on pink rose quartz crystal chips"
                      className="w-full h-full object-contain drop-shadow-xl transform group-hover:scale-105 transition duration-500"
                    />
                  </div>

                  <div className="pt-6 relative z-10">
                    <button
                      onClick={() => {
                        setActivePage("catalog");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="px-7 py-3 bg-[#8F9E68] hover:bg-[#7D8C57] text-white rounded-full text-xs font-bold uppercase tracking-widest transition shadow-sm inline-flex items-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <span>Shop Now</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* ================= INTERACTIVE BEFORE & AFTER SKIN BENEFITS SECTION (REFERENCE MATCH) ================= */}
            <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                {/* Left Column: Draggable Real-Time Before & After Comparison Slider */}
                <div className="lg:col-span-6 space-y-4">
                  <div
                    ref={sliderRef}
                    onMouseDown={(e) => {
                      setIsDraggingSlider(true);
                      handleSliderMove(e.clientX);
                    }}
                    onTouchStart={(e) => {
                      setIsDraggingSlider(true);
                      if (e.touches && e.touches[0]) handleSliderMove(e.touches[0].clientX);
                    }}
                    onTouchMove={handleTouchMove}
                    className="relative w-full aspect-square max-w-[500px] mx-auto rounded-3xl overflow-hidden shadow-xl border-4 border-white select-none cursor-ew-resize group"
                  >
                    {/* Background: AFTER State (Luminous, hydrated, clean skin) */}
                    <img
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=900&auto=format&fit=crop&q=80"
                      alt="After Glow Treatment"
                      className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                    />
                    {/* AFTER Badge */}
                    <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-bold tracking-widest text-[#8F9E68] uppercase shadow-sm">
                      AFTER
                    </div>

                    {/* Foreground: BEFORE State (Sun damaged, dry, textured skin) clipped via sliderPosition */}
                    <div
                      className="absolute inset-0 overflow-hidden pointer-events-none"
                      style={{ width: `${sliderPosition}%` }}
                    >
                      <img
                        src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=900&auto=format&fit=crop&q=80"
                        alt="Before Glow Treatment"
                        className="absolute inset-0 w-full h-full object-cover max-w-none"
                        style={{
                          width: sliderRef.current
                            ? `${sliderRef.current.clientWidth}px`
                            : "100%",
                          height: "100%",
                          filter: "sepia(0.2) contrast(1.15) brightness(0.92)",
                        }}
                      />
                      {/* BEFORE Badge */}
                      <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-stone-900/80 backdrop-blur-md rounded-full text-[10px] font-bold tracking-widest text-white uppercase shadow-sm">
                        BEFORE
                      </div>
                    </div>

                    {/* Divider Bar & Grabber Circle Handle */}
                    <div
                      className="absolute top-0 bottom-0 z-20 w-0.5 bg-white shadow-2xl pointer-events-none"
                      style={{ left: `${sliderPosition}%` }}
                    >
                      <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white text-stone-800 shadow-xl flex items-center justify-center border-2 border-stone-200">
                        <div className="flex items-center text-[10px] font-bold text-stone-600 gap-0.5">
                          <ChevronLeft size={14} />
                          <ChevronRight size={14} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-center text-xs text-stone-500 font-medium">
                    ← Drag slider left or right to compare real clinical results →
                  </p>
                </div>

                {/* Right Column: Benefits Accordion */}
                <div className="lg:col-span-6 space-y-6">
                  <div>
                    <span className="font-serif italic text-2xl text-stone-500 font-normal tracking-wide block">
                      Skin Benefits
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-serif font-black text-[#2B2824] leading-tight mt-1">
                      What are the Benefits of Glow?
                    </h2>
                  </div>

                  {/* Accordion Items matching reference */}
                  <div className="space-y-3 pt-2">
                    {/* Item 1: How do you get Skin damage? */}
                    <div className="border border-[#E4DCD0] rounded-2xl bg-white overflow-hidden transition shadow-xs">
                      <button
                        onClick={() =>
                          setActiveAccordion(
                            activeAccordion === "damage" ? "" : "damage"
                          )
                        }
                        className="w-full px-5 py-4 flex items-center justify-between text-left font-serif font-bold text-base text-stone-900 cursor-pointer hover:bg-stone-50 transition"
                      >
                        <span className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-full bg-[#8F9E68]/15 text-[#8F9E68] flex items-center justify-center text-xs">
                            ✓
                          </span>
                          <span>How do you get Skin damage?</span>
                        </span>
                        {activeAccordion === "damage" ? (
                          <ChevronUp size={18} className="text-stone-500" />
                        ) : (
                          <ChevronDown size={18} className="text-stone-500" />
                        )}
                      </button>

                      {activeAccordion === "damage" && (
                        <div className="px-5 pb-5 pt-1 text-xs text-stone-600 leading-relaxed border-t border-stone-100 bg-[#FAF8F5]/50">
                          <p>
                            UV light radiation, harsh environmental particulates, and stripping synthetic detergents weaken the stratum corneum lipid barrier. Glow replenishes cellular moisture using botanical ceramides and natural antioxidants.
                          </p>
                          <ul className="mt-2.5 space-y-1.5 list-disc list-inside text-stone-600">
                            <li>Depleted skin barrier moisture and rough texture</li>
                            <li>Premature collagen breakdown from UV exposure</li>
                            <li>Instant barrier renewal with botanical seed lipids</li>
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Item 2: Sun-damaged Skin */}
                    <div className="border border-[#E4DCD0] rounded-2xl bg-white overflow-hidden transition shadow-xs">
                      <button
                        onClick={() =>
                          setActiveAccordion(
                            activeAccordion === "sun" ? "" : "sun"
                          )
                        }
                        className="w-full px-5 py-4 flex items-center justify-between text-left font-serif font-bold text-base text-stone-900 cursor-pointer hover:bg-stone-50 transition"
                      >
                        <span className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-full bg-[#8F9E68]/15 text-[#8F9E68] flex items-center justify-center text-xs">
                            ✓
                          </span>
                          <span>Sun-damaged Skin</span>
                        </span>
                        {activeAccordion === "sun" ? (
                          <ChevronUp size={18} className="text-stone-500" />
                        ) : (
                          <ChevronDown size={18} className="text-stone-500" />
                        )}
                      </button>

                      {activeAccordion === "sun" && (
                        <div className="px-5 pb-5 pt-1 text-xs text-stone-600 leading-relaxed border-t border-stone-100 bg-[#FAF8F5]/50">
                          Repeated sun exposure leads to free radical oxidation and moisture depletion. Our cold-pressed botanical formulas deliver biocompatible vitamins C and E to calm erythema and promote even regeneration.
                        </div>
                      )}
                    </div>

                    {/* Item 3: Uneven Skin Tone */}
                    <div className="border border-[#E4DCD0] rounded-2xl bg-white overflow-hidden transition shadow-xs">
                      <button
                        onClick={() =>
                          setActiveAccordion(
                            activeAccordion === "tone" ? "" : "tone"
                          )
                        }
                        className="w-full px-5 py-4 flex items-center justify-between text-left font-serif font-bold text-base text-stone-900 cursor-pointer hover:bg-stone-50 transition"
                      >
                        <span className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-full bg-[#8F9E68]/15 text-[#8F9E68] flex items-center justify-center text-xs">
                            ✓
                          </span>
                          <span>Uneven Skin Tone</span>
                        </span>
                        {activeAccordion === "tone" ? (
                          <ChevronUp size={18} className="text-stone-500" />
                        ) : (
                          <ChevronDown size={18} className="text-stone-500" />
                        )}
                      </button>

                      {activeAccordion === "tone" && (
                        <div className="px-5 pb-5 pt-1 text-xs text-stone-600 leading-relaxed border-t border-stone-100 bg-[#FAF8F5]/50">
                          Target hyperpigmentation and post-blemish redness with natural arbutin, niacinamide, and licorice root extracts without photosensitivity.
                        </div>
                      )}
                    </div>

                    {/* Item 4: The Risks of Catching Rays */}
                    <div className="border border-[#E4DCD0] rounded-2xl bg-white overflow-hidden transition shadow-xs">
                      <button
                        onClick={() =>
                          setActiveAccordion(
                            activeAccordion === "rays" ? "" : "rays"
                          )
                        }
                        className="w-full px-5 py-4 flex items-center justify-between text-left font-serif font-bold text-base text-stone-900 cursor-pointer hover:bg-stone-50 transition"
                      >
                        <span className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-full bg-[#8F9E68]/15 text-[#8F9E68] flex items-center justify-center text-xs">
                            ✓
                          </span>
                          <span>The Risks of Catching Rays</span>
                        </span>
                        {activeAccordion === "rays" ? (
                          <ChevronUp size={18} className="text-stone-500" />
                        ) : (
                          <ChevronDown size={18} className="text-stone-500" />
                        )}
                      </button>

                      {activeAccordion === "rays" && (
                        <div className="px-5 pb-5 pt-1 text-xs text-stone-600 leading-relaxed border-t border-stone-100 bg-[#FAF8F5]/50">
                          Broad-spectrum mineral SPF prevents DNA degradation, photoaging, and deep collagen breakdown when used consistently every morning.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Shop Now CTA Button */}
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        setActivePage("catalog");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="px-8 py-3.5 bg-[#8F9E68] hover:bg-[#7D8C57] text-white rounded-full text-xs font-bold uppercase tracking-widest transition shadow-md inline-flex items-center gap-2 cursor-pointer active:scale-95"
                    >
                      <span>Shop Now</span>
                      <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* ================= WINTER BODY CARE & BOTANICAL INGREDIENTS DIAGRAM (REFERENCE MATCH) ================= */}
            <section className="py-20 bg-[#FAF0EE] border-t border-[#EBDCD8] relative overflow-hidden text-left">
              {/* Decorative delicate botanical vector outlines in background */}
              <div className="absolute left-8 top-10 w-48 h-48 opacity-15 pointer-events-none">
                <Leaf size={140} className="text-[#8F9E68]" />
              </div>
              <div className="absolute right-12 bottom-8 w-60 h-60 opacity-10 pointer-events-none">
                <Sparkles size={160} className="text-rose-400" />
              </div>

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                  {/* Left Column: Heading & CTA */}
                  <div className="lg:col-span-4 space-y-4">
                    <div className="inline-flex items-center px-3.5 py-1 rounded-full bg-white/80 border border-[#E8D4CE] text-[#8F9E68] text-[11px] font-bold uppercase tracking-wider shadow-xs">
                      Our Winter Care
                    </div>

                    <h2 className="text-3xl sm:text-5xl font-serif font-black text-[#2B2824] leading-tight">
                      Body Care Product.
                    </h2>

                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                      Dermatologically formulated barrier rescue mist infused with cold-pressed botanical extracts for immediate deep restoration.
                    </p>

                    <div className="pt-2">
                      <button
                        onClick={() => {
                          setActivePage("catalog");
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="px-8 py-3.5 bg-[#8F9E68] hover:bg-[#7D8C57] text-white rounded-full text-xs font-bold uppercase tracking-widest transition shadow-md inline-flex items-center gap-2 cursor-pointer active:scale-95"
                      >
                        <span>Shop Now</span>
                        <ArrowRight size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Center Column: Cosmetic Spray Bottle Diagram with 6 Ingredient Callouts */}
                  <div className="lg:col-span-5 relative flex justify-center items-center py-6">
                    {/* Spray Bottle Image */}
                    <div className="relative z-10 w-44 sm:w-56 h-auto">
                      <img
                        src="https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=700&auto=format&fit=crop&q=80"
                        alt="Cosmetic Spray GLOW Winter Body Mist"
                        className="w-full h-auto object-contain drop-shadow-2xl"
                      />
                    </div>

                    {/* 6 Botanical Callouts matching reference */}
                    {/* Left Top: Skin deep Beauty */}
                    <div className="absolute top-12 left-0 sm:left-2 z-20 hidden sm:flex items-center gap-2">
                      <span className="px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full text-[11px] font-semibold text-stone-800 shadow-sm border border-[#E8D9D4]">
                        Skin deep Beauty
                      </span>
                      <div className="w-8 h-px bg-stone-400" />
                    </div>

                    {/* Left Mid: Water Resistant */}
                    <div className="absolute top-1/2 -translate-y-1/2 left-0 sm:left-2 z-20 hidden sm:flex items-center gap-2">
                      <span className="px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full text-[11px] font-semibold text-stone-800 shadow-sm border border-[#E8D9D4]">
                        Water Resistant
                      </span>
                      <div className="w-8 h-px bg-stone-400" />
                    </div>

                    {/* Left Bottom: Environmental Friendly */}
                    <div className="absolute bottom-12 left-0 sm:left-2 z-20 hidden sm:flex items-center gap-2">
                      <span className="px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full text-[11px] font-semibold text-stone-800 shadow-sm border border-[#E8D9D4]">
                        Environmental Friendly
                      </span>
                      <div className="w-8 h-px bg-stone-400" />
                    </div>

                    {/* Right Top: Provides deep cleansing */}
                    <div className="absolute top-12 right-0 sm:right-2 z-20 hidden sm:flex items-center gap-2">
                      <div className="w-8 h-px bg-stone-400" />
                      <span className="px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full text-[11px] font-semibold text-stone-800 shadow-sm border border-[#E8D9D4]">
                        Provides deep cleansing
                      </span>
                    </div>

                    {/* Right Mid: Natural hemp seed oil */}
                    <div className="absolute top-1/2 -translate-y-1/2 right-0 sm:right-2 z-20 hidden sm:flex items-center gap-2">
                      <div className="w-8 h-px bg-stone-400" />
                      <span className="px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full text-[11px] font-semibold text-stone-800 shadow-sm border border-[#E8D9D4]">
                        Natural hemp seed oil
                      </span>
                    </div>

                    {/* Right Bottom: Natural Ingredients */}
                    <div className="absolute bottom-12 right-0 sm:right-2 z-20 hidden sm:flex items-center gap-2">
                      <div className="w-8 h-px bg-stone-400" />
                      <span className="px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full text-[11px] font-semibold text-stone-800 shadow-sm border border-[#E8D9D4]">
                        Natural Ingredients
                      </span>
                    </div>
                  </div>

                  {/* Right Column: Customer Testimonial Card */}
                  <div className="lg:col-span-3">
                    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E8D9D4] shadow-sm space-y-4 relative">
                      {/* Star Rating */}
                      <div className="flex items-center gap-1 text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className="fill-amber-400 text-amber-400"
                          />
                        ))}
                      </div>

                      {/* Quote */}
                      <p className="text-xs text-stone-600 leading-relaxed italic">
                        "{testimonials[activeTestimonial].quote}"
                      </p>

                      {/* Author */}
                      <div className="flex items-center gap-3 pt-2 border-t border-stone-100">
                        <img
                          src={testimonials[activeTestimonial].avatar}
                          alt={testimonials[activeTestimonial].name}
                          className="w-10 h-10 rounded-full object-cover border border-stone-200"
                        />
                        <div>
                          <h4 className="text-xs font-serif font-bold text-stone-900">
                            {testimonials[activeTestimonial].name}
                          </h4>
                          <span className="text-[10px] text-stone-400">
                            {testimonials[activeTestimonial].role}
                          </span>
                        </div>
                      </div>

                      {/* Pagination Indicator Dots */}
                      <div className="flex items-center justify-center gap-1.5 pt-2">
                        {testimonials.map((t, idx) => (
                          <button
                            key={t.id}
                            onClick={() => setActiveTestimonial(idx)}
                            className={`w-2 h-2 rounded-full transition cursor-pointer ${
                              activeTestimonial === idx
                                ? "bg-[#8F9E68] w-5"
                                : "bg-stone-300 hover:bg-stone-400"
                            }`}
                            aria-label={`Go to slide ${idx + 1}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {/* ================= VIEW 2: CLEAN CATALOG ================= */}
        {activePage === "catalog" && (
          <Product
            products={beautyItems}
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        )}

        {/* ================= VIEW 3: OFFERS & BUNDLES ================= */}
        {activePage === "offers" && (
          <Offer
            products={beautyItems}
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
            onOpenCatalog={() => {
              setActivePage("catalog");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        )}

        {/* ================= VIEW 4: PRODUCT DETAILS ================= */}
        {activePage === "product-detail" && selectedProduct && (
          <ProductDetails
            product={selectedProduct}
            onBack={() => {
              setActivePage("catalog");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onAddToCart={handleAddToCart}
            relatedProducts={beautyItems}
            onSelectProduct={handleSelectProduct}
          />
        )}
      </main>

      {/* ================= 3. FOOTER ================= */}
      <Footer
        brandName={brandName}
        brandLogo={brandLogo}
        brandPhone={brandPhone}
        brandEmail={brandEmail}
        brandAddress={brandAddress}
        onNavigate={(page, cat = null) => {
          if (cat) setSelectedCategory(cat);
          setActivePage(page);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />

      {/* ================= 4. BEAUTY BAG DRAWER ================= */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
        themeColors={{ primary: "#8F9E68" }}
      />

      {/* ================= 5. QUICK VIEW MODAL ================= */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative overflow-hidden">
            <button
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-stone-100 text-stone-500 hover:text-stone-900 transition cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center text-left">
              {/* Image Preview */}
              <div className="aspect-square rounded-2xl bg-[#F6F4F0] p-6 flex items-center justify-center border border-stone-200">
                <img
                  src={getProductImage(quickViewProduct.image, 0)}
                  alt={quickViewProduct.name}
                  className="max-h-full max-w-full object-contain drop-shadow-md"
                />
              </div>

              {/* Product Details */}
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#8F9E68]">
                    {quickViewProduct.category || "Cosmetics"}
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-stone-900 mt-0.5">
                    {quickViewProduct.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-lg font-bold text-stone-900">
                      ${Number(quickViewProduct.price).toFixed(2)}
                    </span>
                    {quickViewProduct.compareAtPrice && (
                      <span className="text-xs text-stone-400 line-through">
                        ${Number(quickViewProduct.compareAtPrice).toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed">
                  {quickViewProduct.description ||
                    "Hydrating botanical formula infused with cold-pressed seed oils."}
                </p>

                {/* Shades if available */}
                {quickViewProduct.shades && quickViewProduct.shades.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-stone-700 block">
                      Color Shade: {quickViewShade?.name || "Selected"}
                    </span>
                    <div className="flex items-center gap-2">
                      {quickViewProduct.shades.map((shade, sIdx) => (
                        <button
                          key={sIdx}
                          onClick={() => setQuickViewShade(shade)}
                          className={`w-6 h-6 rounded-full border transition cursor-pointer ${
                            quickViewShade?.hex === shade.hex
                              ? "ring-2 ring-[#8F9E68] ring-offset-2 scale-110"
                              : "border-stone-300 hover:scale-105"
                          }`}
                          style={{ backgroundColor: shade.hex }}
                          title={shade.name}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity & Add to Cart */}
                <div className="flex items-center gap-3 pt-2">
                  <div className="flex items-center border border-stone-200 rounded-full px-3 py-1.5 bg-stone-50">
                    <button
                      onClick={() => setQuickViewQty(Math.max(1, quickViewQty - 1))}
                      className="p-1 text-stone-500 hover:text-stone-900 transition cursor-pointer"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-stone-900">
                      {quickViewQty}
                    </span>
                    <button
                      onClick={() => setQuickViewQty(quickViewQty + 1)}
                      className="p-1 text-stone-500 hover:text-stone-900 transition cursor-pointer"
                    >
                      <Plus size={13} />
                    </button>
                  </div>

                  <button
                    onClick={() =>
                      handleAddToCart(quickViewProduct, quickViewQty, quickViewShade)
                    }
                    className="flex-1 py-3 px-6 bg-[#8F9E68] hover:bg-[#7D8C57] text-white rounded-full text-xs font-bold uppercase tracking-wider transition shadow-sm hover:shadow cursor-pointer active:scale-95 text-center"
                  >
                    Add to Bag
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
