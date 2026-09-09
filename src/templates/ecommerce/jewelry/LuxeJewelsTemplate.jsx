import React, { useState } from "react";
import {
  ArrowRight,
  Star,
  Eye,
  Heart,
  X,
  Calendar,
  Check,
  Clock,
  MapPin,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
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
import Product from "./Product";
import ProductDetails from "./ProductDetails";

export default function LuxeJewelsTemplate({
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
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Tabbed weekly sales state
  const [activeWeeklyTab1, setActiveWeeklyTab1] = useState("Bracelets");
  const [activeWeeklyTab2, setActiveWeeklyTab2] = useState("Bracelets");

  // Showroom appointment modal
  const [showroomModalOpen, setShowroomModalOpen] = useState(false);
  const [appointmentName, setAppointmentName] = useState("");
  const [appointmentEmail, setAppointmentEmail] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("11:00 AM");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart?.cartItems || []);

  const fallbackJewelry = [
    {
      _id: "lj_p1",
      name: "18ct White Gold 2ctw Live Bracelet",
      category: "Bracelets",
      metal: "18ct White Gold",
      price: 697.50,
      compareAtPrice: 930.00,
      discount: "25%",
      rating: 3.33,
      reviewCount: 1,
      badge: "25%",
      image: "https://images.unsplash.com/photo-1611591475824-7936a29d660e?w=700&auto=format&fit=crop&q=80",
      description: "Exquisite 18ct solid white gold 2-carat diamond tennis line bracelet with secure box tongue clasp.",
      inStock: true,
    },
    {
      _id: "lj_p2",
      name: "18ct White Gold 0.10ct Diamond Round Cut Pendant",
      category: "Necklaces",
      metal: "18ct White Gold",
      price: 449.50,
      compareAtPrice: 505.00,
      discount: "11%",
      rating: 3.00,
      reviewCount: 2,
      badge: "11%",
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=700&auto=format&fit=crop&q=80",
      description: "Open circular eternity halo pendant set with brilliant round-cut diamonds on an adjustable trace chain.",
      inStock: true,
    },
    {
      _id: "lj_p3",
      name: "Silver Torque Wave Bangle S Design",
      category: "Bracelets",
      metal: "Sterling Silver",
      price: 99.99,
      compareAtPrice: null,
      discount: null,
      rating: 4.00,
      reviewCount: 2,
      badge: null,
      image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=700&auto=format&fit=crop&q=80",
      description: "Architectural undulating wave S-curve open cuff bangle crafted in solid 925 sterling silver with a satin finish.",
      inStock: true,
    },
    {
      _id: "lj_p4",
      name: "18ct Yellow Gold 2.5mm Tube Torque Bangle",
      category: "Bracelets",
      metal: "18ct Yellow Gold",
      price: 900.44,
      compareAtPrice: 938.00,
      discount: "4%",
      rating: 3.33,
      reviewCount: 1,
      badge: "4%",
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=700&auto=format&fit=crop&q=80",
      description: "Timeless hollow tube torque cuff with polished sphere terminal ends in lustrous 18-karat warm yellow gold.",
      inStock: true,
    },
    {
      _id: "lj_p5",
      name: "9ct Yellow Gold 18mm Medium Hoop Earrings",
      category: "Earrings",
      metal: "9ct Yellow Gold",
      price: 87.55,
      compareAtPrice: 116.73,
      discount: "25%",
      rating: 3.00,
      reviewCount: 2,
      badge: "25%",
      image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=700&auto=format&fit=crop&q=80",
      description: "Classic high-polish round tube hoop earrings with secure click-top closure for daily luxury.",
      inStock: true,
    },
    {
      _id: "lj_p6",
      name: "Twist Bangle Bracelet",
      category: "Bracelets",
      metal: "Sterling Silver",
      price: 71.99,
      compareAtPrice: 81.99,
      discount: "12%",
      rating: 4.33,
      reviewCount: 3,
      badge: "12%",
      image: "https://images.unsplash.com/photo-1611591475824-7936a29d660e?w=700&auto=format&fit=crop&q=80",
      description: "Delicate spiral twisted silver cuff with diamond pavé accent line catching light from every perspective.",
      inStock: true,
    },
    {
      _id: "lj_p7",
      name: "Sterling Silver Mercy Open Bangle Medium",
      category: "Bracelets",
      metal: "Sterling Silver",
      price: 59.95,
      compareAtPrice: 71.95,
      discount: "16%",
      rating: 4.00,
      reviewCount: 2,
      badge: "16%",
      image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=700&auto=format&fit=crop&q=80",
      description: "Organic sculptural open oval bangle symbolizing the fluid passage of time and compassionate craftsmanship.",
      inStock: true,
    },
    {
      _id: "lj_p8",
      name: "Sterling Silver 3mm Torque Bangle",
      category: "Bracelets",
      metal: "Sterling Silver",
      price: 44.19,
      compareAtPrice: 53.19,
      discount: "17%",
      rating: 4.67,
      reviewCount: 3,
      badge: "17%",
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=700&auto=format&fit=crop&q=80",
      description: "Minimalist solid silver torque bangle with twin bead terminals and subtle engraved edge detailing.",
      inStock: true,
    },
    {
      _id: "lj_p9",
      name: "18ct White Gold 1.00ctw Diamond 20mm Hoop Earrings",
      category: "Earrings",
      metal: "18ct White Gold",
      price: 198.45,
      compareAtPrice: 220.45,
      discount: "10%",
      rating: 3.60,
      reviewCount: 2,
      badge: "10%",
      image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=700&auto=format&fit=crop&q=80",
      description: "Inside-out round brilliant diamond huggie hoops crafted in bright 18-karat white gold with latch back.",
      inStock: true,
    },
  ];

  const pieceList = products.length > 0 ? products : fallbackJewelry;

  const handleAddToCart = (product, qty = 1) => {
    if (isOutOfStock(product)) {
      toast.error(`Sorry, ${product.name} is vault reserved!`);
      return;
    }
    dispatch(addToCart({ product, quantity: qty }));
    toast.success(`${product.name} added to your bag! ✨`);
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

  const handleBookShowroom = (e) => {
    e.preventDefault();
    if (!appointmentName || !appointmentDate) {
      toast.error("Please fill in your name and preferred date.");
      return;
    }
    setShowroomModalOpen(false);
    toast.success("Your private showroom consultation is confirmed! Our concierge will email you confirmation. 🥂");
    setAppointmentName("");
    setAppointmentEmail("");
  };

  // Filter tab products
  const weeklyProducts1 = pieceList.filter((p) => {
    if (activeWeeklyTab1 === "Silver Set") return (p.metal || "").toLowerCase().includes("silver");
    return (p.category || "").toLowerCase().includes(activeWeeklyTab1.toLowerCase());
  }).slice(0, 4);

  const weeklyProducts2 = pieceList.filter((p) => {
    return (p.category || "").toLowerCase().includes(activeWeeklyTab2.toLowerCase());
  }).slice(0, 4);

  const finalWeekly1 = weeklyProducts1.length > 0 ? weeklyProducts1 : pieceList.slice(0, 4);
  const finalWeekly2 = weeklyProducts2.length > 0 ? weeklyProducts2 : pieceList.slice(4, 8);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white text-stone-900 antialiased selection:bg-stone-900 selection:text-white">
      {/* ================= NAVBAR ================= */}
      <Navbar
        brandName={business?.name || "LUXE & CO. HAUTE JOAILLERIE"}
        brandLogo={business?.logo}
        brandPhone={business?.phone || "+1 (800) 777-LUXE"}
        activePage={activePage}
        setActivePage={setActivePage}
        cartCount={cartCount}
        onOpenCart={() => setCartOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setActivePage("catalog");
        }}
        onOpenShowroom={() => setShowroomModalOpen(true)}
      />

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1">
        {/* ================= VIEW 1: HOMEPAGE ================= */}
        {activePage === "home" && (
          <div className="space-y-16 sm:space-y-24">
            {/* 1. EDITORIAL MOODY HERO SECTION */}
            <section className="relative min-h-[460px] lg:min-h-[560px] flex items-center justify-center text-center overflow-hidden bg-stone-950">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1600&auto=format&fit=crop&q=80')`,
                }}
              >
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[0.5px]" />
              </div>

              <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-20 space-y-4 text-white">
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-serif tracking-tight leading-tight">
                  Trust us. We are the best
                </h1>
                <p className="text-xs sm:text-sm text-stone-300 font-normal tracking-wide">
                  Having an exclusive range of handmade jewelry
                </p>
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory("all");
                      setActivePage("catalog");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="inline-block px-8 py-2.5 border border-white text-white hover:bg-white hover:text-stone-900 text-xs font-semibold tracking-widest uppercase transition duration-300 cursor-pointer"
                  >
                    Shop Collection
                  </button>
                </div>
              </div>
            </section>

            {/* 2. TOP CURATED CATEGORIES SHOWCASE BANNER */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-center">
              <p className="text-xs sm:text-sm text-stone-600 font-serif italic max-w-lg mx-auto">
                "Choose us for complex, special and stylish designs you have never seen before."
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                {[
                  {
                    id: "Bracelets",
                    title: "Bracelets",
                    count: "14 PRODUCTS",
                    img: "https://images.unsplash.com/photo-1611591475824-7936a29d660e?w=600&auto=format&fit=crop&q=80",
                  },
                  {
                    id: "Earrings",
                    title: "Earrings",
                    count: "22 PRODUCTS",
                    img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop&q=80",
                  },
                  {
                    id: "Gold Set",
                    title: "Gold Set",
                    count: "6 PRODUCTS",
                    img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80",
                  },
                  {
                    id: "Necklaces",
                    title: "Necklaces",
                    count: "12 PRODUCTS",
                    img: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&auto=format&fit=crop&q=80",
                  },
                ].map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedCategory(item.id);
                      setActivePage("catalog");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="group relative h-64 sm:h-80 rounded overflow-hidden cursor-pointer shadow-xs flex flex-col justify-end p-4 text-left"
                  >
                    <img
                      src={item.img}
                      alt={item.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                    <div className="relative z-10 flex items-end justify-between text-white">
                      <div>
                        <h3 className="text-sm sm:text-base font-bold font-serif leading-tight">
                          {item.title}
                        </h3>
                        <span className="text-[10px] tracking-wider text-stone-300 font-semibold block uppercase mt-0.5">
                          {item.count}
                        </span>
                      </div>
                      <span className="w-6 h-6 rounded-full bg-white/90 text-stone-900 flex items-center justify-center text-xs group-hover:bg-[#AA771C] group-hover:text-white transition">
                        <ArrowRight size={11} />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 3. WEEKLY SALES TABBED SHOWCASE 1 */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-center">
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
                  Don't miss this weeks sales
                </h2>
                <p className="text-xs text-stone-500">
                  Handmade jewelry that always makes you happy
                </p>
              </div>

              {/* Underlined Category Tabs */}
              <div className="flex items-center justify-center gap-6 sm:gap-8 border-b border-stone-200 pb-2 text-xs font-semibold text-stone-600">
                {["Bracelets", "Earrings", "Necklaces", "Silver Set"].map((tab) => {
                  const isActive = activeWeeklyTab1 === tab;
                  return (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveWeeklyTab1(tab)}
                      className={`pb-2 transition cursor-pointer relative ${
                        isActive ? "text-stone-900 font-bold" : "hover:text-stone-900"
                      }`}
                    >
                      <span>{tab}</span>
                      {isActive && (
                        <span className="absolute bottom-[-9px] left-0 right-0 h-[2px] bg-stone-900" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* 4-Column Product Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-4">
                {finalWeekly1.map((p) => (
                  <ProductCard
                    key={p._id}
                    product={p}
                    onSelectProduct={(prod) => {
                      setSelectedProduct(prod);
                      setActivePage("product-detail");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    onAddToCart={handleAddToCart}
                    onQuickView={(prod) => setQuickViewProduct(prod)}
                  />
                ))}
              </div>
            </section>

            {/* 4. IN-STORE SHOWROOM PROMO SECTION */}
            <section className="bg-[#FAF9F8] py-12 sm:py-16 border-y border-stone-200/80">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
                  {/* Left Showroom Details */}
                  <div className="lg:col-span-5 space-y-4">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#AA771C]">
                      IN-STORE PROMO SHOWROOM
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900">
                      Our Showroom
                    </h2>
                    <p className="text-xs text-stone-600 leading-relaxed max-w-sm">
                      Massa. Ambiantal praehulo benpoffering, reumatiek omegaammara. Morri gahno ebijenjukan till IVPA. Näringslivs franta vurst i kammuldelan lkasom giggning.
                    </p>

                    <div className="space-y-0.5 text-xs text-stone-700 pt-2 border-t border-stone-200">
                      <p className="font-semibold text-stone-900">Opening Hours: 10am - 6pm</p>
                      <p className="text-stone-500">Thursday - Saturday</p>
                    </div>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => setShowroomModalOpen(true)}
                        className="inline-block text-xs font-bold uppercase tracking-wider text-stone-900 border-b-2 border-stone-900 hover:text-[#AA771C] hover:border-[#AA771C] transition pb-0.5 cursor-pointer"
                      >
                        Book A Visit
                      </button>
                    </div>
                  </div>

                  {/* Right Editorial Jewelry Image */}
                  <div className="lg:col-span-7 rounded overflow-hidden shadow-sm">
                    <img
                      src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1000&auto=format&fit=crop&q=80"
                      alt="Our Showroom Atelier"
                      className="w-full h-80 sm:h-96 object-cover"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* 5. MID-PAGE FEATURE SPOTLIGHT: "JEWELRY THAT SPEAKS" */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-center">
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
                  Don't miss this week's sales
                </h2>
                <p className="text-xs text-stone-500">
                  The craftsmanship that aims to make you look beautiful
                </p>
              </div>

              {/* Asymmetric 3-Column Layout */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch pt-2">
                {/* Left Card: Single Product */}
                <div className="md:col-span-3 flex flex-col justify-center">
                  <ProductCard
                    product={pieceList[4] || pieceList[0]}
                    onSelectProduct={(prod) => {
                      setSelectedProduct(prod);
                      setActivePage("product-detail");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    onAddToCart={handleAddToCart}
                    onQuickView={(prod) => setQuickViewProduct(prod)}
                  />
                </div>

                {/* Center Hero Card: "Jewelry that speaks" */}
                <div className="md:col-span-6 relative rounded overflow-hidden min-h-[380px] sm:min-h-[460px] flex flex-col justify-center items-center text-center p-8 shadow-sm">
                  <img
                    src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=900&auto=format&fit=crop&q=80"
                    alt="Jewelry that speaks"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="relative z-10 space-y-3 text-white max-w-sm">
                    <h3 className="text-2xl sm:text-3xl font-bold font-serif">
                      Jewelry that speaks
                    </h3>
                    <p className="text-xs text-stone-200">
                      A complete destination for handmade jewelry
                    </p>
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCategory("all");
                          setActivePage("catalog");
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="inline-block px-5 py-2 border border-white text-white hover:bg-white hover:text-stone-900 text-[11px] font-semibold tracking-wider uppercase transition cursor-pointer"
                      >
                        Shop Collection
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Side Column */}
                <div className="md:col-span-3 flex flex-col justify-between text-left space-y-4">
                  <div className="space-y-1.5 p-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 font-serif">
                      Our jewelry makes you beautiful
                    </h4>
                    <p className="text-[11px] text-stone-500 leading-relaxed">
                      Lorem ipsum rogged billig, ålyning tålusv inta ett protegt. Vuxader deksre logoviktigt.
                    </p>
                  </div>
                  <div className="rounded overflow-hidden shadow-xs h-56">
                    <img
                      src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&auto=format&fit=crop&q=80"
                      alt="Jewelry styling"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* 6. SECONDARY WEEKLY SALES TABBED PRODUCT GRID */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-center">
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
                  Don't miss this weeks sales
                </h2>
                <p className="text-xs text-stone-500">
                  Having an exclusive range of handmade jewelry
                </p>
              </div>

              {/* Tabs: Bracelets, Earrings, Gold Set, Rings */}
              <div className="flex items-center justify-center gap-6 sm:gap-8 border-b border-stone-200 pb-2 text-xs font-semibold text-stone-600">
                {["Bracelets", "Earrings", "Gold Set", "Rings"].map((tab) => {
                  const isActive = activeWeeklyTab2 === tab;
                  return (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveWeeklyTab2(tab)}
                      className={`pb-2 transition cursor-pointer relative ${
                        isActive ? "text-stone-900 font-bold" : "hover:text-stone-900"
                      }`}
                    >
                      <span>{tab}</span>
                      {isActive && (
                        <span className="absolute bottom-[-9px] left-0 right-0 h-[2px] bg-stone-900" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* 4 Cards Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-4">
                {finalWeekly2.map((p) => (
                  <ProductCard
                    key={p._id}
                    product={p}
                    onSelectProduct={(prod) => {
                      setSelectedProduct(prod);
                      setActivePage("product-detail");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    onAddToCart={handleAddToCart}
                    onQuickView={(prod) => setQuickViewProduct(prod)}
                  />
                ))}
              </div>
            </section>

            {/* 7. ARTISANAL STORYTELLING SHOWCASE */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center text-left">
                {/* Left Card + Model Photo */}
                <div className="md:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <ProductCard
                    product={pieceList[8] || pieceList[0]}
                    onSelectProduct={(prod) => {
                      setSelectedProduct(prod);
                      setActivePage("product-detail");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    onAddToCart={handleAddToCart}
                    onQuickView={(prod) => setQuickViewProduct(prod)}
                  />
                  <div className="rounded overflow-hidden shadow-xs h-72">
                    <img
                      src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop&q=80"
                      alt="Artisanal model"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Right Story Text */}
                <div className="md:col-span-6 space-y-4">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-stone-400">
                    WE ARE BETTER
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900 leading-tight">
                    Quality handcrafted jewelry that you remembered
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed max-w-md">
                    Massa. Ambiantal praehulo benpoffering, reumatiek omegaammara. Morri gahno ebijenjukan till IVPA. Näringslivs franta vurst i kammuldelan lkasom giggning.
                  </p>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategory("all");
                        setActivePage("catalog");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="inline-block text-xs font-bold uppercase tracking-wider text-stone-900 border-b-2 border-stone-900 hover:text-[#AA771C] hover:border-[#AA771C] transition pb-0.5 cursor-pointer"
                    >
                      Shop Collection
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ================= VIEW 2: PRODUCT LISTING / CATALOG ================= */}
        {activePage === "catalog" && (
          <Product
            products={pieceList}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSelectProduct={(prod) => {
              setSelectedProduct(prod);
              setActivePage("product-detail");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onAddToCart={handleAddToCart}
            onQuickView={(prod) => setQuickViewProduct(prod)}
          />
        )}

        {/* ================= VIEW 3: PRODUCT DETAILS ================= */}
        {activePage === "product-detail" && (
          <ProductDetails
            product={selectedProduct}
            relatedProducts={pieceList}
            onBack={() => {
              setActivePage("catalog");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onAddToCart={handleAddToCart}
            onSelectProduct={(prod) => {
              setSelectedProduct(prod);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onQuickView={(prod) => setQuickViewProduct(prod)}
          />
        )}
      </main>

      {/* ================= FOOTER ================= */}
      <Footer
        brandName={business?.name || "LUXE & CO. HAUTE JOAILLERIE"}
        brandPhone={business?.phone || "+1 (800) 777-LUXE"}
        brandEmail={business?.email || "concierge@luxejewels.com"}
        onNavigate={(page) => {
          setActivePage(page);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setActivePage("catalog");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onOpenShowroom={() => setShowroomModalOpen(true)}
      />

      {/* ================= SHOWROOM APPOINTMENT MODAL ================= */}
      {showroomModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 sm:p-8 relative shadow-2xl space-y-5 text-left animate-in fade-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setShowroomModalOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1"
            >
              <X size={18} />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#AA771C]">
                PRIVATE ATELIER VISIT
              </span>
              <h3 className="text-xl font-bold font-serif text-stone-900">
                Book Your Showroom Consultation
              </h3>
              <p className="text-xs text-stone-500">
                680 Fifth Avenue, New York • Thursday to Saturday (10am - 6pm)
              </p>
            </div>

            <form onSubmit={handleBookShowroom} className="space-y-3.5 pt-1">
              <div>
                <label className="text-[11px] font-semibold text-stone-700 block mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  value={appointmentName}
                  onChange={(e) => setAppointmentName(e.target.value)}
                  placeholder="e.g. Lady Eleanor Vance"
                  className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded focus:outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-stone-700 block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={appointmentEmail}
                  onChange={(e) => setAppointmentEmail(e.target.value)}
                  placeholder="e.g. eleanor@vance.com"
                  className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded focus:outline-none focus:border-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-stone-700 block mb-1">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    required
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:outline-none focus:border-stone-900"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-stone-700 block mb-1">
                    Time Slot
                  </label>
                  <select
                    value={appointmentTime}
                    onChange={(e) => setAppointmentTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:outline-none focus:border-stone-900 bg-white"
                  >
                    <option>10:00 AM</option>
                    <option>11:30 AM</option>
                    <option>1:00 PM</option>
                    <option>2:30 PM</option>
                    <option>4:00 PM</option>
                    <option>5:00 PM</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-stone-900 hover:bg-[#AA771C] text-white text-xs font-semibold uppercase tracking-widest rounded transition shadow-sm mt-2 cursor-pointer"
              >
                Confirm Private Appointment
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= QUICK VIEW MODAL ================= */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 sm:p-8 relative shadow-2xl space-y-6 text-left animate-in fade-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <div className="aspect-square rounded bg-[#FAF9F8] p-6 flex items-center justify-center border border-stone-100">
                <img
                  src={getProductImage(quickViewProduct, quickViewProduct.image)}
                  alt={quickViewProduct.name}
                  className="w-full h-full object-contain max-h-56 drop-shadow-sm"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#AA771C]">
                    {quickViewProduct.category || "FINE JEWELRY"}
                  </span>
                  <h3 className="text-lg font-bold font-serif text-stone-900 mt-0.5">
                    {quickViewProduct.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-stone-500 pt-1">
                    <Star size={12} className="fill-amber-400 text-amber-400" />
                    <span className="font-semibold text-stone-900">
                      {quickViewProduct.rating ? Number(quickViewProduct.rating).toFixed(2) : "4.50"}
                    </span>
                    <span>({quickViewProduct.reviewCount || 1} Reviews)</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold font-serif text-rose-600">
                    ${Number(quickViewProduct.price).toFixed(2)}
                  </span>
                  {quickViewProduct.compareAtPrice &&
                    quickViewProduct.compareAtPrice > quickViewProduct.price && (
                      <span className="text-xs text-stone-400 line-through">
                        ${Number(quickViewProduct.compareAtPrice).toFixed(2)}
                      </span>
                    )}
                </div>

                <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                  {quickViewProduct.description}
                </p>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      handleAddToCart(quickViewProduct);
                      setQuickViewProduct(null);
                    }}
                    className="flex-1 py-2.5 bg-stone-900 hover:bg-[#AA771C] text-white text-xs font-semibold uppercase tracking-wider rounded transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <ShoppingBag size={14} />
                    <span>Add to Bag</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedProduct(quickViewProduct);
                      setQuickViewProduct(null);
                      setActivePage("product-detail");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded transition cursor-pointer"
                  >
                    Details
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
