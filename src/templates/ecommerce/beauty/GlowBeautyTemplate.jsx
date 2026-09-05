import React, { useState, useMemo } from "react";
import {
  Sparkles,
  Heart,
  ShoppingBag,
  Star,
  Check,
  Calendar,
  Clock,
  ShieldCheck,
  HelpCircle,
  ArrowRight,
  Smile,
  Droplets,
  ChevronRight,
  Repeat,
  Leaf,
  Sun,
  Moon,
  Plus,
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
  // Navigation: "home" | "catalog" | "routines" | "shade-finder" | "ingredients" | "offers" | "product-detail"
  const [activePage, setActivePage] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);

  // Search & Filters
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Skin Quiz State
  const [skinType, setSkinType] = useState("dry"); // "dry" | "oily" | "sensitive" | "combination"
  const [primaryConcern, setPrimaryConcern] = useState("hydration"); // "hydration" | "aging" | "redness" | "glow"

  // Shade Finder State
  const [selectedUndertone, setSelectedUndertone] = useState("Neutral");
  const [shadeLevel, setShadeLevel] = useState(2); // 1 (Fair), 2 (Light), 3 (Medium), 4 (Tan), 5 (Deep)

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart?.cartItems || []);

  const defaultProducts = [
    {
      _id: "glow-1",
      name: "Hydra-Dew Multi-Molecular Hyaluronic Serum",
      price: 42.0,
      compareAtPrice: 52.0,
      category: "Serums & Elixirs",
      step: "Step 3: Treatment",
      activeIngredient: "2% Hyaluronic Acid + B5",
      concern: "Deep Hydration & Plumpness",
      badge: "Best-Seller",
      rating: 4.9,
      reviewCount: 142,
      image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80",
      description: "Five molecular weights of pure hyaluronic acid infused with Damask rosewater to quench dehydrated skin at cellular depths.",
      inStock: true,
    },
    {
      _id: "glow-2",
      name: "Ceramide Barrier Restorative Silk Cream",
      price: 48.0,
      compareAtPrice: 58.0,
      category: "Moisturizers",
      step: "Step 4: Moisturize",
      activeIngredient: "5 Ceramides + Plant Peptides",
      concern: "Skin Barrier Repair",
      badge: "Dermatologist Pick",
      rating: 5.0,
      reviewCount: 98,
      image: "https://images.unsplash.com/photo-1608248597359-2451515bb529?w=800&auto=format&fit=crop&q=80",
      description: "Rich velvety lipid balm replenishing natural ceramides, soothing redness, and locking in 48-hour moisture without heaviness.",
      inStock: true,
    },
    {
      _id: "glow-3",
      name: "Bakuchiol Retinol-Alternative Night Elixir",
      price: 54.0,
      compareAtPrice: 65.0,
      category: "Serums & Elixirs",
      step: "Step 3: Night Treatment",
      activeIngredient: "1% Pure Ayurvedic Bakuchiol",
      concern: "Fine Lines & Firming",
      badge: "Retinol-Alternative",
      rating: 4.8,
      reviewCount: 76,
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80",
      description: "Plant-derived gentle retinol alternative clinically proven to boost elasticity and smooth fine lines with zero irritation or peeling.",
      inStock: true,
    },
    {
      _id: "glow-4",
      name: "Gentle Milky Oat & Rose Enzyme Cleanser",
      price: 32.0,
      compareAtPrice: 38.0,
      category: "Cleansers",
      step: "Step 1: Cleanse",
      activeIngredient: "Colloidal Oat + Papaya Enzyme",
      concern: "Gentle Clarifying",
      badge: "pH 5.5 Balanced",
      rating: 4.9,
      reviewCount: 65,
      image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&auto=format&fit=crop&q=80",
      description: "Ultra-soothing milky cleanser dissolving makeup, sunscreen, and impurities while preserving delicate skin barrier lipids.",
      inStock: true,
    },
    {
      _id: "glow-5",
      name: "Wild Rose Petal Hydrosol Conditioning Mist",
      price: 28.0,
      compareAtPrice: 34.0,
      category: "Toners & Mists",
      step: "Step 2: Tone & Mist",
      activeIngredient: "100% Damask Rose Distillate",
      concern: "Glow & Radiance",
      badge: "Steam Distilled",
      rating: 4.8,
      reviewCount: 52,
      image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=800&auto=format&fit=crop&q=80",
      description: "Fine ethereal facial mist balancing skin pH and priming skin for enhanced absorption of active serums and oils.",
      inStock: true,
    },
    {
      _id: "glow-6",
      name: "Luminous Mineral Dew Drops SPF 50",
      price: 38.0,
      compareAtPrice: 45.0,
      category: "Sun Protection",
      step: "Step 5: Sun Shield",
      activeIngredient: "Non-Nano Zinc 18% + Squalane",
      concern: "UV Defense & Glow",
      badge: "Zero White Cast",
      rating: 4.9,
      reviewCount: 114,
      image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&auto=format&fit=crop&q=80",
      description: "Featherweight 100% mineral daily broad-spectrum sunshield leaving a hydrated dewy finish without greasiness or white cast.",
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
      ? [rawAddr.street, rawAddr.addressLine2, rawAddr.city, rawAddr.state, rawAddr.postalCode, rawAddr.country]
          .filter(Boolean)
          .join(", ")
      : "450 Botanical Way, Malibu, CA 90265";

  const handleAddToCart = (product, qty = 1) => {
    if (isOutOfStock(product)) {
      toast.error(`Sorry, ${product.name} is currently out of stock!`);
      return;
    }
    dispatch(addToCart({ product, quantity: qty }));
    toast.success(`${product.name} added to Beauty Bag! 🌸`);
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

  const cartCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const handleSelectProduct = (p) => {
    setSelectedProduct(p);
    setActivePage("product-detail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Recommended products based on quiz
  const recommendedRoutine = useMemo(() => {
    return [
      beautyItems[3], // Cleanser
      beautyItems[0], // Hyaluronic
      beautyItems[1], // Ceramide Cream
    ].filter(Boolean);
  }, [beautyItems, skinType, primaryConcern]);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#FFF8F8] text-rose-950 antialiased selection:bg-rose-200 selection:text-rose-900">
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
          setActivePage("routines");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />

      {/* ================= 2. MAIN ACTIVE VIEW ================= */}
      <main className="flex-1">
        {/* ================= VIEW 1: HOME ================= */}
        {activePage === "home" && (
          <>
            {/* HERO SECTION */}
            <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF8F8] via-[#FFF0F3] to-[#FFF8F8] pt-12 pb-20 md:pt-20 md:pb-28 border-b border-rose-100">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  <div className="lg:col-span-7 space-y-6 text-left">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-100/80 border border-rose-200 text-rose-800 text-xs font-semibold shadow-xs">
                      <Sparkles size={14} className="text-rose-600" />
                      <span>Clean Botanical Bio-Actives • 100% Leaping Bunny Vegan</span>
                    </div>

                    <h1 className="text-4xl sm:text-6xl font-serif font-black tracking-tight text-rose-950 leading-[1.08]">
                      Luminous Skin Driven by Active Plant Science.
                    </h1>

                    <p className="text-sm sm:text-base text-rose-800/80 leading-relaxed max-w-xl">
                      Formulated with multi-molecular hyaluronic acid, wild Damask rose hydrosol, and soothing plant ceramides. Zero synthetic fragrances, parabens, or harsh sulfates.
                    </p>

                    <div className="flex flex-wrap gap-4 pt-2">
                      <button
                        onClick={() => {
                          setActivePage("catalog");
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="px-8 py-4 bg-gradient-to-r from-rose-500 via-pink-600 to-rose-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition shadow-lg shadow-rose-300/40 flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5 active:scale-95"
                      >
                        <Droplets size={17} className="text-rose-100" />
                        <span>Explore Clean Formulas</span>
                      </button>

                      <button
                        onClick={() => {
                          setActivePage("routines");
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="px-7 py-4 bg-white border border-rose-200 hover:border-rose-400 text-rose-900 rounded-2xl text-xs font-bold uppercase tracking-wider transition flex items-center gap-2 cursor-pointer shadow-xs"
                      >
                        <HelpCircle size={16} className="text-rose-500" />
                        <span>Skin Routine Quiz</span>
                      </button>
                    </div>

                    {/* Clinical Proof Strip */}
                    <div className="grid grid-cols-3 gap-4 pt-6 border-t border-rose-200/80 text-left">
                      <div>
                        <span className="text-xl sm:text-2xl font-serif font-black text-rose-950">98%</span>
                        <p className="text-[11px] text-rose-700 mt-0.5">Hydration Within 24h</p>
                      </div>
                      <div>
                        <span className="text-xl sm:text-2xl font-serif font-black text-rose-950">100%</span>
                        <p className="text-[11px] text-rose-700 mt-0.5">Cruelty-Free Vegan</p>
                      </div>
                      <div>
                        <span className="text-xl sm:text-2xl font-serif font-black text-rose-950">EWG</span>
                        <p className="text-[11px] text-rose-700 mt-0.5">Verified Clean Actives</p>
                      </div>
                    </div>
                  </div>

                  {/* Hero Visual Card */}
                  <div className="lg:col-span-5 relative">
                    <div className="aspect-[4/3] rounded-[36px] overflow-hidden shadow-2xl border-4 border-white bg-rose-50 relative group">
                      <img
                        src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=900&auto=format&fit=crop&q=80"
                        alt="Hydra-Dew Serum"
                        className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-rose-950/60 via-transparent to-transparent" />

                      <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white">
                        <div>
                          <span className="text-xs font-bold uppercase tracking-widest text-rose-200">
                            Signature Treatment
                          </span>
                          <h4 className="text-lg font-serif font-bold">Hydra-Dew Multi-Hyaluronic Serum</h4>
                        </div>
                        <button
                          onClick={() => handleSelectProduct(beautyItems[0])}
                          className="p-3 bg-white text-rose-900 rounded-xl transition cursor-pointer font-bold shadow-lg"
                        >
                          <ChevronRight size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* FEATURED FORMULATIONS */}
            <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-left">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-rose-100 pb-6">
                <div>
                  <span className="text-xs uppercase tracking-wider text-rose-500 font-bold">
                    Bio-Compatible Actives
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-serif font-black text-rose-950 mt-1">
                    Signature Skincare Elixirs
                  </h2>
                </div>

                <button
                  onClick={() => {
                    setActivePage("catalog");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 transition cursor-pointer"
                >
                  <span>View All Clean Formulas ({beautyItems.length} products)</span>
                  <ArrowRight size={14} />
                </button>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {beautyItems.slice(0, 4).map((item) => (
                  <ProductCard
                    key={item._id}
                    product={item}
                    onSelectProduct={handleSelectProduct}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            </section>

            {/* INTERACTIVE SKIN DIAGNOSTIC CALLOUT */}
            <section className="py-16 bg-gradient-to-r from-rose-100/60 via-pink-50 to-rose-100/60 border-y border-rose-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
                  <span className="text-xs uppercase tracking-widest text-rose-600 font-bold">
                    Tailored Botanical Science
                  </span>
                  <h2 className="text-3xl font-serif font-black text-rose-950">
                    Interactive Beauty Laboratories
                  </h2>
                  <p className="text-xs text-rose-800 font-sans">
                    Find your exact daily AM/PM routine steps, discover skin undertones, and explore active clinical transparency.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                  <div
                    onClick={() => {
                      setActivePage("routines");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="p-6 rounded-3xl bg-white border border-rose-200 hover:border-rose-400 transition cursor-pointer group shadow-sm"
                  >
                    <HelpCircle size={28} className="text-rose-500 mb-4 group-hover:scale-110 transition duration-300" />
                    <h3 className="text-lg font-serif font-bold text-rose-950 group-hover:text-rose-600">Skin Routine Builder</h3>
                    <p className="text-xs text-rose-800/80 mt-2 leading-relaxed">
                      Select your skin type and priority concerns to receive a personalized 3-step botanical prescription.
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-xs text-rose-600 font-bold">
                      Build Routine <ArrowRight size={13} />
                    </span>
                  </div>

                  <div
                    onClick={() => {
                      setActivePage("shade-finder");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="p-6 rounded-3xl bg-white border border-rose-200 hover:border-rose-400 transition cursor-pointer group shadow-sm"
                  >
                    <Smile size={28} className="text-rose-500 mb-4 group-hover:scale-110 transition duration-300" />
                    <h3 className="text-lg font-serif font-bold text-rose-950 group-hover:text-rose-600">Virtual Shade Finder</h3>
                    <p className="text-xs text-rose-800/80 mt-2 leading-relaxed">
                      Match your complexion with Cool, Warm, and Neutral undertones for dewy tinted SPF coverage.
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-xs text-rose-600 font-bold">
                      Find My Shade <ArrowRight size={13} />
                    </span>
                  </div>

                  <div
                    onClick={() => {
                      setActivePage("ingredients");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="p-6 rounded-3xl bg-white border border-rose-200 hover:border-rose-400 transition cursor-pointer group shadow-sm"
                  >
                    <Leaf size={28} className="text-emerald-600 mb-4 group-hover:scale-110 transition duration-300" />
                    <h3 className="text-lg font-serif font-bold text-rose-950 group-hover:text-emerald-700">Ingredient Transparency</h3>
                    <p className="text-xs text-rose-800/80 mt-2 leading-relaxed">
                      Learn the exact molecular weights, sourcing, and clinical percentages of every active in our bottles.
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-xs text-emerald-700 font-bold">
                      Explore Actives <ArrowRight size={13} />
                    </span>
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

        {/* ================= VIEW 3: SKIN QUIZ & ROUTINE BUILDER ================= */}
        {activePage === "routines" && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 text-left">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs uppercase tracking-[0.2em] text-rose-600 font-bold">
                Clinical Diagnostic
              </span>
              <h1 className="text-3xl sm:text-4xl font-serif font-black text-rose-950">
                Personalized Skin Routine Builder
              </h1>
              <p className="text-xs sm:text-sm text-rose-800">
                Answer two quick questions to calculate your optimal botanical routine and unlock a custom 3-step bundle discount.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-rose-200 space-y-8 shadow-sm">
              {/* Question 1: Skin Type */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-rose-950 uppercase tracking-wider">
                  Step 1: What is your primary skin type?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: "dry", label: "Dry & Tight" },
                    { id: "oily", label: "Oily & Congested" },
                    { id: "sensitive", label: "Reactive & Sensitive" },
                    { id: "combination", label: "Combination T-Zone" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setSkinType(t.id)}
                      className={`p-3.5 rounded-2xl text-xs font-semibold transition cursor-pointer border ${
                        skinType === t.id
                          ? "bg-rose-500 text-white border-rose-500 shadow-sm"
                          : "bg-rose-50/50 text-rose-800 border-rose-200 hover:bg-rose-100/60"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 2: Priority Concern */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-rose-950 uppercase tracking-wider">
                  Step 2: What is your main skin goal?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: "hydration", label: "Plump Hydration" },
                    { id: "aging", label: "Fine Lines & Firming" },
                    { id: "redness", label: "Calm Redness" },
                    { id: "glow", label: "Glass Skin Radiance" },
                  ].map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setPrimaryConcern(c.id)}
                      className={`p-3.5 rounded-2xl text-xs font-semibold transition cursor-pointer border ${
                        primaryConcern === c.id
                          ? "bg-rose-500 text-white border-rose-500 shadow-sm"
                          : "bg-rose-50/50 text-rose-800 border-rose-200 hover:bg-rose-100/60"
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recommended Routine Cards Result */}
              <div className="pt-6 border-t border-rose-100 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-rose-500 block">
                      Recommended Prescription
                    </span>
                    <h3 className="font-serif text-xl font-bold text-rose-950">
                      Your Daily Synergistic Routine
                    </h3>
                  </div>
                  <button
                    onClick={() => {
                      recommendedRoutine.forEach((item) => handleAddToCart(item));
                      toast.success("Added your personalized 3-step routine to Beauty Bag! 🌸");
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-xl text-xs font-bold shadow transition cursor-pointer"
                  >
                    Add All 3 to Bag
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {recommendedRoutine.map((item, idx) => (
                    <div
                      key={item._id}
                      onClick={() => handleSelectProduct(item)}
                      className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200/80 space-y-2 cursor-pointer hover:border-rose-400 transition"
                    >
                      <span className="text-[10px] font-bold text-rose-500 uppercase">
                        Step {idx + 1}
                      </span>
                      <h4 className="font-serif font-bold text-sm text-rose-950 line-clamp-1">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-rose-700 line-clamp-2">{item.description}</p>
                      <div className="pt-1 flex items-center justify-between font-bold text-xs text-rose-950">
                        <span>₹{item.price}</span>
                        <span className="text-rose-600 font-normal text-[11px]">Inspect →</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= VIEW 4: VIRTUAL SHADE FINDER ================= */}
        {activePage === "shade-finder" && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 text-left">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs uppercase tracking-[0.2em] text-rose-600 font-bold">
                Complexion Science
              </span>
              <h1 className="text-3xl sm:text-4xl font-serif font-black text-rose-950">
                Virtual Shade & Undertone Finder
              </h1>
              <p className="text-xs sm:text-sm text-rose-800">
                Find your seamless botanical tint match for our Luminous Mineral Dew Drops SPF 50.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-rose-200 space-y-8 shadow-sm">
              {/* Undertone Buttons */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-rose-950 uppercase">
                  Select Your Underlying Undertone:
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "Cool", label: "Cool (Pink/Rosy tones)" },
                    { id: "Neutral", label: "Neutral (Balanced peach)" },
                    { id: "Warm", label: "Warm (Golden/Olive tones)" },
                  ].map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => setSelectedUndertone(u.id)}
                      className={`p-3.5 rounded-2xl text-xs font-semibold transition cursor-pointer border ${
                        selectedUndertone === u.id
                          ? "bg-rose-500 text-white border-rose-500 shadow-sm"
                          : "bg-rose-50/50 text-rose-800 border-rose-200"
                      }`}
                    >
                      {u.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Shade Slider */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs font-bold text-rose-950">
                  <span>Depth Level: {shadeLevel === 1 ? "Fair" : shadeLevel === 2 ? "Light" : shadeLevel === 3 ? "Medium" : shadeLevel === 4 ? "Tan" : "Deep"}</span>
                  <span className="text-rose-500 font-sans">Formula: Dew Drops Shade {selectedUndertone.charAt(0)}{shadeLevel}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={shadeLevel}
                  onChange={(e) => setShadeLevel(Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
              </div>

              {/* Swatch Result Preview */}
              <div className="p-6 rounded-2xl bg-rose-50/60 border border-rose-200 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-2xl shadow-md border-2 border-white"
                    style={{
                      backgroundColor:
                        shadeLevel === 1
                          ? "#FDE2D2"
                          : shadeLevel === 2
                          ? "#F3C5A8"
                          : shadeLevel === 3
                          ? "#DCA380"
                          : shadeLevel === 4
                          ? "#B87854"
                          : "#73432B",
                    }}
                  />
                  <div>
                    <span className="text-xs uppercase font-bold text-rose-500 block">
                      Perfect Match Result
                    </span>
                    <h4 className="font-serif font-bold text-base text-rose-950">
                      Dew Drops SPF 50 in Shade {selectedUndertone.charAt(0)}{shadeLevel} ({selectedUndertone})
                    </h4>
                    <p className="text-[11px] text-rose-700">Non-nano mineral protection with buildable dewy radiance.</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    handleAddToCart({
                      ...beautyItems[5],
                      name: `Luminous Mineral Dew Drops SPF 50 [Shade ${selectedUndertone.charAt(0)}${shadeLevel}]`,
                    });
                  }}
                  className="px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition shadow cursor-pointer whitespace-nowrap"
                >
                  Add Matched Shade
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= VIEW 5: INGREDIENT TRANSPARENCY ================= */}
        {activePage === "ingredients" && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 text-left">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs uppercase tracking-[0.2em] text-emerald-700 font-bold">
                Clean Formulation Deck
              </span>
              <h1 className="text-3xl sm:text-4xl font-serif font-black text-rose-950">
                100% Ingredient Transparency
              </h1>
              <p className="text-xs sm:text-sm text-rose-800">
                Every ingredient is chosen for proven bio-compatibility, zero endocrine disruption, and visible dermatological performance.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-3xl bg-white border border-rose-200 space-y-3 shadow-xs">
                <Leaf size={24} className="text-emerald-600" />
                <h4 className="font-serif text-lg font-bold text-rose-950">Damask Rose Floral Water</h4>
                <p className="text-xs text-rose-800/80 leading-relaxed">
                  Directly steam distilled from Bulgarian organic rose valleys, locking in natural flavonoids and cooling inflamed capillaries.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-rose-200 space-y-3 shadow-xs">
                <Droplets size={24} className="text-rose-500" />
                <h4 className="font-serif text-lg font-bold text-rose-950">5-Weight Hyaluronic Acid</h4>
                <p className="text-xs text-rose-800/80 leading-relaxed">
                  Combines high molecular weights to seal moisture with micro-molecular fractions that stimulate native collagen synthesis.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-rose-200 space-y-3 shadow-xs">
                <ShieldCheck size={24} className="text-rose-500" />
                <h4 className="font-serif text-lg font-bold text-rose-950">Plant Lipid Ceramides</h4>
                <p className="text-xs text-rose-800/80 leading-relaxed">
                  Bio-fermented wheat germ ceramides identical to human stratum corneum lipids to prevent trans-epidermal water loss.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ================= VIEW 6: OFFERS & BUNDLES ================= */}
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

        {/* ================= VIEW 7: PRODUCT DETAILS ================= */}
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
        themeColors={{ primary: "#DB2777" }}
      />
    </div>
  );
}
