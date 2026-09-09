import React, { useState, useMemo } from "react";
import {
  ShoppingBag,
  Search,
  Truck,
  ShieldCheck,
  Zap,
  Sparkles,
  ArrowRight,
  Star,
  MapPin,
  Clock,
  CheckCircle2,
  Phone,
  Utensils,
  Leaf,
  Layers,
  Apple,
  Croissant,
  Egg,
  CupSoda,
  Tag,
  Package,
  Heart,
  ChevronRight,
  Check,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  addToCart,
  updateCartQuantity,
  removeFromCart,
} from "../../../redux/reducers/cartReducer";
import toast from "react-hot-toast";
import CartDrawer from "../../common/CartDrawer";
import CouponPromoTicker from "../../common/CouponPromoTicker";

// Modular Components
import Navbar from "./Navbar";
import Footer from "./Footer";
import HeroSection from "./HeroSection";
import ProductCard from "./ProductCard";
import FeaturedProducts from "./FeaturedProducts";
import Products from "./Products";
import ProductDetails from "./ProductDetails";
import Offer from "./Offer";
import MealKits from "./MealKits";

export default function FreshMartTemplate({
  business = {},
  products = [],
  categories = [],
  banners = [],
  coupons = [],
  offers = [],
  reviews = [],
  customization = {},
}) {
  // Navigation: "home" | "aisles" | "meal-kits" | "offers" | "freshness-lab" | "product-detail"
  const [activePage, setActivePage] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);

  // Filters, Search & Zip
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [zipCode, setZipCode] = useState("10001");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart?.cartItems || []);

  // Curated items matching the exact user design screenshot
  const fallbackGroceries = [
    {
      _id: "p-tomato",
      name: "Fresh Tomatoes",
      price: 32,
      compareAtPrice: 40,
      unit: "1 kg",
      category: "Fruits & Vegetables",
      rating: 4.9,
      reviewCount: 94,
      badge: "20% OFF",
      isOrganic: true,
      image:
        "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80",
      description:
        "Vine-ripened farm fresh organic tomatoes, succulent, firm, and naturally rich in lycopene.",
      inStock: true,
    },
    {
      _id: "p-banana",
      name: "Farm Fresh Bananas",
      price: 48,
      compareAtPrice: 60,
      unit: "1 kg",
      category: "Fruits & Vegetables",
      rating: 4.8,
      reviewCount: 76,
      badge: "20% OFF",
      isOrganic: true,
      image:
        "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80",
      description:
        "Naturally ripened robust bananas, energy dense, potassium rich, and picked fresh from local plantations.",
      inStock: true,
    },
    {
      _id: "p-milk",
      name: "Amul Taaza Fresh Milk",
      price: 56,
      compareAtPrice: 62,
      unit: "1 L",
      category: "Dairy & Eggs",
      rating: 4.9,
      reviewCount: 210,
      badge: "10% OFF",
      image:
        "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80",
      description:
        "Homogenized toned pasteurized milk with sealed purity, providing daily calcium and protein nourishment.",
      inStock: true,
    },
    {
      _id: "p-broccoli",
      name: "Fresh Green Broccoli",
      price: 72,
      compareAtPrice: 90,
      unit: "250 g",
      category: "Fruits & Vegetables",
      rating: 4.9,
      reviewCount: 88,
      badge: "20% OFF",
      isOrganic: true,
      image:
        "https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?w=600&auto=format&fit=crop&q=80",
      description:
        "Crisp compact dark green florets harvested cold-chain directly from organic hillside vegetable farms.",
      inStock: true,
    },
    {
      _id: "p-atta",
      name: "Aashirvaad Shudh Chakki Atta",
      price: 245,
      compareAtPrice: 290,
      unit: "5 kg",
      category: "Groceries & Staples",
      rating: 5.0,
      reviewCount: 340,
      badge: "15% OFF",
      image:
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80",
      description:
        "100% pure whole wheat stone-ground chakki flour delivering soft, nutritious rotis with dietary fiber.",
      inStock: true,
    },
    {
      _id: "p-apple",
      name: "Royal Gala Red Apples",
      price: 120,
      compareAtPrice: 150,
      unit: "1 kg",
      category: "Fruits & Vegetables",
      rating: 4.9,
      reviewCount: 165,
      badge: "20% OFF",
      isOrganic: true,
      image:
        "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80",
      description:
        "Sweet crisp orchard apples with thin blushing red skin and refreshing juicy floral crunch.",
      inStock: true,
    },
  ];

  const groceryItems = products.length > 0 ? products : fallbackGroceries;

  const brandName =
    business?.businessName ||
    business?.name ||
    customization?.heroHeadline ||
    "FreshKart";

  const brandLogo = customization?.logo || business?.logo || null;
  const brandPhone =
    business?.phone ||
    business?.businessPhone ||
    business?.contactPhone ||
    "1-800-FRESH-MT";
  const brandEmail =
    business?.email ||
    business?.businessEmail ||
    business?.contactEmail ||
    "care@freshkart.com";
  const brandAddress =
    business?.address ||
    business?.registered_business_address ||
    "842 Market Boulevard, Green Valley, CA 94103";

  // Cart operations
  const handleAddToCart = (product, qty = 1) => {
    if (isOutOfStock(product)) {
      toast.error(`Sorry, ${product.name || "item"} is out of stock!`);
      return;
    }
    dispatch(addToCart({ product, quantity: qty }));
    toast.success(`${product.name} added to Fresh Basket! 🥦`);
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
    0,
  );

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + Number(item.price || 0) * (item.quantity || 1),
    0,
  );

  // Default Categories fallback matching design
  const defaultShopCategories = [
    {
      name: "Fruits & Vegetables",
      slug: "Produce",
      image:
        "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=300&auto=format&fit=crop&q=80",
    },
    {
      name: "Dairy & Eggs",
      slug: "Dairy",
      image:
        "https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?w=300&auto=format&fit=crop&q=80",
    },
    {
      name: "Groceries & Staples",
      slug: "Pantry",
      image:
        "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&auto=format&fit=crop&q=80",
    },
    {
      name: "Snacks & Beverages",
      slug: "Beverages",
      image:
        "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=300&auto=format&fit=crop&q=80",
    },
    {
      name: "Personal Care",
      slug: "Care",
      image:
        "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&auto=format&fit=crop&q=80",
    },
    {
      name: "Household Care",
      slug: "Household",
      image:
        "https://images.unsplash.com/photo-1585421514738-01798e348b17?w=300&auto=format&fit=crop&q=80",
    },
    {
      name: "Organic Products",
      slug: "Organic",
      image:
        "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&auto=format&fit=crop&q=80",
    },
    {
      name: "Bakery & More",
      slug: "Bakery",
      image:
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&auto=format&fit=crop&q=80",
    },
  ];

  const shopCategories = useMemo(() => {
    if (categories && categories.length > 0) {
      return categories.map((cat, idx) => ({
        name: cat.name || cat.slug || "Category",
        slug: cat.slug || cat.name || `cat-${idx}`,
        image: cat.image || defaultShopCategories[idx % defaultShopCategories.length].image,
      }));
    }
    return defaultShopCategories;
  }, [categories]);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#FBFDFB] text-[#0F172A] antialiased selection:bg-emerald-100 selection:text-emerald-900">
      {/* ================= 0. PROMO TICKER ================= */}
      <CouponPromoTicker coupons={coupons} theme="light" />

      {/* ================= 1. REUSABLE NAVBAR ================= */}
      <Navbar
        brandName={brandName}
        brandLogo={brandLogo}
        brandPhone={brandPhone}
        activePage={activePage}
        setActivePage={setActivePage}
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setCartOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
        zipCode={zipCode}
        onZipChange={setZipCode}
      />

      {/* ================= 2. MAIN CONTENT DISPATCHER ================= */}
      <main className="flex-1">
        {/* ================= VIEW 1: MARKETPLACE HOME ================= */}
        {activePage === "home" && (
          <>
            {/* ================= HERO SECTION (FULL-BLEED WITH LIGHT THEME) ================= */}
            <HeroSection
              brandName={brandName}
              banners={banners}
              onNavigateToAisles={() => {
                setActivePage("aisles");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              onNavigateToMealKits={() => {
                setActivePage("meal-kits");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              zipCode={zipCode}
              onZipChange={setZipCode}
            />

            {/* ================= SHOP BY CATEGORY (8 CARDS) ================= */}
            <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-left">
              <div className="flex items-end justify-between border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">
                    Shop by Category
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Everything you need, all in one place.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setActivePage("aisles");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="text-xs font-bold text-[#15803D] hover:underline cursor-pointer flex items-center gap-1"
                >
                  <span>View All Categories</span>
                  <ArrowRight size={13} />
                </button>
              </div>

              {/* 8 Cards Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
                {shopCategories.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => {
                      setSelectedCategory(cat.slug);
                      setActivePage("aisles");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="p-3 rounded-2xl bg-white border border-slate-200/80 hover:border-emerald-500 hover:shadow-md transition-all duration-200 group text-center space-y-2 cursor-pointer shadow-2xs flex flex-col items-center justify-between"
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-50 flex items-center justify-center p-1">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full object-cover rounded-lg group-hover:scale-110 transition duration-300"
                      />
                    </div>
                    <span className="text-[11px] font-bold text-slate-800 group-hover:text-[#15803D] leading-tight block">
                      {cat.name}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            {/* ================= 3 PROMO BANNERS GRID ================= */}
            <section className="py-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
                {/* Banner 1: Fresh Fruits */}
                <div className="rounded-3xl bg-[#FFF6EE] border border-[#FED7AA]/50 p-6 flex flex-col justify-between relative overflow-hidden group shadow-2xs">
                  <div className="space-y-1.5 z-10 max-w-[60%]">
                    <h3 className="text-base font-black text-slate-900 leading-tight">
                      Fresh Fruits
                    </h3>
                    <div className="text-sm font-black text-amber-700">
                      Up to 30% OFF
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed pt-1">
                      Nature's sweetness at your doorstep.
                    </p>
                    <div className="pt-3">
                      <button
                        onClick={() => {
                          setSelectedCategory("Produce");
                          setActivePage("aisles");
                        }}
                        className="px-4 py-2 rounded-full bg-[#15803D] hover:bg-emerald-800 text-white text-[11px] font-bold transition shadow-xs flex items-center gap-1 cursor-pointer"
                      >
                        <span>Shop Fruits</span>
                        <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                  <div className="absolute right-0 bottom-0 w-36 h-36">
                    <img
                      src="https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&auto=format&fit=crop&q=80"
                      alt="Fruits"
                      className="w-full h-full object-contain group-hover:scale-105 transition"
                    />
                  </div>
                </div>

                {/* Banner 2: Healthy Living */}
                <div className="rounded-3xl bg-[#ECFDF5] border border-[#A7F3D0]/60 p-6 flex flex-col justify-between relative overflow-hidden group shadow-2xs">
                  <div className="space-y-1.5 z-10 max-w-[60%]">
                    <h3 className="text-base font-black text-slate-900 leading-tight">
                      Healthy Living Starts Here
                    </h3>
                    <div className="flex flex-wrap gap-1 pt-1">
                      <span className="text-[9px] font-bold bg-white/80 text-emerald-800 px-2 py-0.5 rounded-md">
                        Organic Produce
                      </span>
                      <span className="text-[9px] font-bold bg-white/80 text-emerald-800 px-2 py-0.5 rounded-md">
                        Chemical Free
                      </span>
                    </div>
                    <div className="pt-3">
                      <button
                        onClick={() => {
                          setSelectedCategory("Produce");
                          setActivePage("aisles");
                        }}
                        className="px-4 py-2 rounded-full bg-[#15803D] hover:bg-emerald-800 text-white text-[11px] font-bold transition shadow-xs flex items-center gap-1 cursor-pointer"
                      >
                        <span>Shop Organic</span>
                        <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                  <div className="absolute right-0 bottom-0 w-36 h-36">
                    <img
                      src="https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&auto=format&fit=crop&q=80"
                      alt="Greens"
                      className="w-full h-full object-contain group-hover:scale-105 transition"
                    />
                  </div>
                </div>

                {/* Banner 3: Everyday Essentials */}
                <div className="rounded-3xl bg-[#FAF7F2] border border-stone-200/70 p-6 flex flex-col justify-between relative overflow-hidden group shadow-2xs">
                  <div className="space-y-1.5 z-10 max-w-[60%]">
                    <h3 className="text-base font-black text-slate-900 leading-tight">
                      Everyday Essentials
                    </h3>
                    <p className="text-[11px] text-slate-600 leading-relaxed pt-1">
                      Great quality. Better prices.
                    </p>
                    <div className="pt-4">
                      <button
                        onClick={() => {
                          setSelectedCategory("Pantry");
                          setActivePage("aisles");
                        }}
                        className="px-4 py-2 rounded-full bg-[#15803D] hover:bg-emerald-800 text-white text-[11px] font-bold transition shadow-xs flex items-center gap-1 cursor-pointer"
                      >
                        <span>Shop Now</span>
                        <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                  <div className="absolute right-0 bottom-0 w-36 h-36">
                    <img
                      src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&auto=format&fit=crop&q=80"
                      alt="Pantry"
                      className="w-full h-full object-contain group-hover:scale-105 transition"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* ================= FEATURED PRODUCTS (6 ITEMS) ================= */}
            <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-left">
              <div className="flex items-end justify-between border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">
                    Featured Products
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Fresh picks, just for you.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setActivePage("aisles");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="text-xs font-bold text-[#15803D] hover:underline cursor-pointer flex items-center gap-1"
                >
                  <span>View All Products</span>
                  <ArrowRight size={13} />
                </button>
              </div>

              {/* 6 Products Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                {groceryItems.slice(0, 6).map((item) => (
                  <ProductCard
                    key={item._id || item.id}
                    product={item}
                    layout="grid"
                    onSelect={(prod) => {
                      setSelectedProduct(prod);
                      setActivePage("product-detail");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    onAddToCart={handleAddToCart}
                    onUpdateQuantity={handleUpdateQuantity}
                  />
                ))}
              </div>
            </section>

            {/* ================= WHY CHOOSE FRESHKART & TESTIMONIAL ================= */}
            <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch text-left">
                {/* Left: 4 Feature Pillars */}
                <div className="lg:col-span-7 rounded-3xl bg-white border border-slate-200/80 p-8 space-y-6 flex flex-col justify-between shadow-2xs">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">
                      Why Choose {brandName}?
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      More than just groceries.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="flex flex-col items-center text-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#15803D] flex items-center justify-center border border-emerald-100">
                        <Leaf size={20} />
                      </div>
                      <span className="text-xs font-bold text-slate-800">
                        Farm Fresh Produce
                      </span>
                    </div>

                    <div className="flex flex-col items-center text-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#15803D] flex items-center justify-center border border-emerald-100">
                        <Truck size={20} />
                      </div>
                      <span className="text-xs font-bold text-slate-800">
                        On-Time Delivery
                      </span>
                    </div>

                    <div className="flex flex-col items-center text-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#15803D] flex items-center justify-center border border-emerald-100">
                        <Tag size={20} />
                      </div>
                      <span className="text-xs font-bold text-slate-800">
                        Best Prices Everyday
                      </span>
                    </div>

                    <div className="flex flex-col items-center text-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#15803D] flex items-center justify-center border border-emerald-100">
                        <Heart size={20} />
                      </div>
                      <span className="text-xs font-bold text-slate-800">
                        Sustainable Choices
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Testimonial Card */}
                <div className="lg:col-span-5 rounded-3xl bg-[#ECFDF5] border border-[#A7F3D0]/60 p-8 flex flex-col justify-between relative overflow-hidden shadow-2xs">
                  <div className="space-y-3">
                    <p className="text-xs sm:text-sm font-medium text-slate-700 italic leading-relaxed">
                      "{brandName} has made my life so easier! The quality is
                      amazing and delivery is always on time."
                    </p>

                    <div className="flex text-amber-400 gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className="fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80"
                        alt="Priya Sharma"
                        className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-2xs"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          Priya Sharma
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Weekly Customer
                        </div>
                      </div>
                    </div>

                    {/* Dots */}
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-700" />
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-200" />
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-200" />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ================= BOTTOM DUAL BANNERS (APP & GREENER TOMORROW) ================= */}
            <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 text-left">
                {/* Left: App Banner (7 cols) */}
                <div className="lg:col-span-7 rounded-3xl bg-[#0F3F24] text-white p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
                  <div className="space-y-3 z-10 max-w-xs">
                    <h3 className="text-2xl sm:text-3xl font-black leading-tight">
                      Get the {brandName} App
                    </h3>
                    <p className="text-xs text-emerald-100/80 leading-relaxed">
                      Shop on the go. Exclusive offers. Faster checkout.
                    </p>

                    {/* App download store badges */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      <button
                        onClick={() =>
                          toast.success(
                            "Mobile App link sent! Available on Google Play Store.",
                          )
                        }
                        className="px-3.5 py-2 rounded-xl bg-black text-white text-[10px] font-bold flex items-center gap-2 border border-white/20 hover:bg-black/80 transition cursor-pointer"
                      >
                        <span className="text-xs">▶</span>
                        <div className="leading-none text-left">
                          <span className="text-[8px] text-slate-400 block">
                            GET IT ON
                          </span>
                          <span>Google Play</span>
                        </div>
                      </button>

                      <button
                        onClick={() =>
                          toast.success(
                            "Mobile App link sent! Available on Apple App Store.",
                          )
                        }
                        className="px-3.5 py-2 rounded-xl bg-black text-white text-[10px] font-bold flex items-center gap-2 border border-white/20 hover:bg-black/80 transition cursor-pointer"
                      >
                        <span className="text-xs"></span>
                        <div className="leading-none text-left">
                          <span className="text-[8px] text-slate-400 block">
                            Download on the
                          </span>
                          <span>App Store</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* App Mockup Visual */}
                  <div className="w-48 sm:w-56 shrink-0 relative">
                    <img
                      src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80"
                      alt="App Mockup"
                      className="w-full h-48 object-cover rounded-2xl border-4 border-white/20 shadow-2xl"
                    />
                  </div>
                </div>

                {/* Right: A Greener Tomorrow (5 cols) */}
                <div className="lg:col-span-5 rounded-3xl bg-[#1D472B] text-white p-8 sm:p-10 flex flex-col justify-between shadow-xl relative overflow-hidden group">
                  <div className="space-y-3 z-10">
                    <h3 className="text-2xl sm:text-3xl font-black leading-tight">
                      A Greener Tomorrow
                    </h3>
                    <p className="text-xs text-emerald-100/80 leading-relaxed max-w-sm">
                      We support local farmers & sustainable farming for a
                      healthier planet.
                    </p>
                  </div>

                  <div className="pt-6 z-10">
                    <button
                      onClick={() => {
                        setActivePage("freshness-lab");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="px-6 py-3 rounded-full bg-white text-[#15803D] hover:bg-emerald-50 text-xs font-bold transition shadow-md flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Learn More</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>

                  {/* Soil hands image */}
                  <div className="absolute right-0 bottom-0 w-44 h-44 opacity-80 group-hover:scale-105 transition duration-500">
                    <img
                      src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&auto=format&fit=crop&q=80"
                      alt="Greener Tomorrow"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {/* ================= VIEW 2: AISLES CATALOG ================= */}
        {activePage === "aisles" && (
          <Products
            products={groceryItems}
            categories={categories}
            initialCategory={selectedCategory}
            brandName={brandName}
            onSelectProduct={(item) => {
              setSelectedProduct(item);
              setActivePage("product-detail");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onAddToCart={handleAddToCart}
            onUpdateQuantity={handleUpdateQuantity}
          />
        )}

        {/* ================= VIEW 3: CHEF'S MEAL-KITS ================= */}
        {activePage === "meal-kits" && (
          <MealKits onAddToCart={handleAddToCart} />
        )}

        {/* ================= VIEW 4: HARVEST DEALS & VOUCHERS ================= */}
        {activePage === "offers" && (
          <Offer
            products={groceryItems}
            onSelectProduct={(item) => {
              setSelectedProduct(item);
              setActivePage("product-detail");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onAddToCart={handleAddToCart}
            onNavigateToAisles={() => {
              setActivePage("aisles");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        )}

        {/* ================= VIEW 6: BESPOKE GROCERY PRODUCT DETAIL ================= */}
        {activePage === "product-detail" && selectedProduct && (
          <ProductDetails
            product={selectedProduct}
            onBack={() => {
              setActivePage("aisles");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onAddToCart={handleAddToCart}
            relatedProducts={groceryItems}
            onSelectProduct={(p) => {
              setSelectedProduct(p);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        )}
      </main>

      {/* ================= 3. REUSABLE FOOTER ================= */}
      <Footer
        brandName={brandName}
        brandLogo={brandLogo}
        brandPhone={brandPhone}
        brandEmail={brandEmail}
        brandAddress={brandAddress}
        setActivePage={setActivePage}
        setSelectedCategory={setSelectedCategory}
      />

      {/* ================= 4. CART DRAWER ================= */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
        themeColors={{ primary: "#15803D" }}
      />
    </div>
  );
}
