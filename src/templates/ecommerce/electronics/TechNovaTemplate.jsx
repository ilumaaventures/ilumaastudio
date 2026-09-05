import React, { useState, useMemo } from "react";
import {
  Cpu,
  Zap,
  ShieldCheck,
  RotateCcw,
  Star,
  Search,
  Check,
  ShoppingBag,
  SlidersHorizontal,
  ChevronRight,
  Battery,
  Wifi,
  Radio,
  HardDrive,
  Headphones,
  Sliders,
  Volume2,
  Activity,
  Layers,
  ArrowRight,
  Plus,
  Minus,
  X,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  Tag,
  Eye,
  Award,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  addToCart,
  updateCartQuantity,
  removeFromCart,
} from "../../../redux/reducers/cartReducer";
import toast from "react-hot-toast";
import { isOutOfStock, getProductStock } from "../../../utils/stockUtils";
import CartDrawer from "../../common/CartDrawer";
import { getProductImage } from "../../../utils/productImage";

// Import new modular components
import Navbar from "./Navbar";
import Footer from "./Footer";
import ProductCard from "./ProductCard";
import Product from "./Product";
import ProductDeltails from "./ProductDeltails";
import Offer from "./Offer";

export default function TechNovaTemplate({
  business = {},
  products = [],
  categories = [],
  offers = [],
  reviews = [],
  customization = {},
}) {
  // Navigation: "home" | "specs" | "compare" | "eq-lab" | "battery-calc" | "offers" | "product-detail"
  const [activePage, setActivePage] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);

  // Search & Filtering
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");

  // Comparison Matrix State (2 device IDs)
  const [compareId1, setCompareId1] = useState("tn-1");
  const [compareId2, setCompareId2] = useState("tn-2");
  const [compareList, setCompareList] = useState([]);

  // Interactive EQ Simulator State
  const [activeEqPreset, setActiveEqPreset] = useState("flat"); // "flat" | "bass" | "vocal" | "gaming"

  // Battery Life Calculator State
  const [dailyMusicHours, setDailyMusicHours] = useState(4);
  const [dailyCallHours, setDailyCallHours] = useState(2);
  const [ancEnabled, setAncEnabled] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart?.cartItems || []);

  // Comprehensive 8-item default silicon catalog
  const defaultTech = [
    {
      _id: "tn-1",
      name: "AeroPulse Master Studio ANC Headphones",
      category: "Pro Audio & ANC",
      price: 299.0,
      compareAtPrice: 380.0,
      rating: 4.9,
      reviewCount: 168,
      badge: "Flagship Audio",
      batteryLifeHours: 50,
      driverSize: "40mm Beryllium Diaphragm",
      ancDb: "45 dB Hybrid ANC",
      codecs: "LDAC, aptX Adaptive, AAC",
      weightGrams: "248g",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&auto=format&fit=crop&q=80",
      description: "Audiophile-grade pure titanium acoustic chambers with custom DSP equalization, spatial head-tracking, and 50 hours of wireless stamina.",
      inStock: true,
    },
    {
      _id: "tn-2",
      name: "PulsePro Biomark Titanium Smartwatch",
      category: "Smart Wearables",
      price: 249.0,
      compareAtPrice: 299.0,
      rating: 4.8,
      reviewCount: 94,
      badge: "Grade-5 Titanium",
      batteryLifeHours: 168, // 7 days
      driverSize: '1.43" AMOLED 1000 nits',
      ancDb: "50m Water Resistance (5 ATM)",
      codecs: "Bluetooth 5.4 LE, GNSS Multi-Band",
      weightGrams: "52g",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&auto=format&fit=crop&q=80",
      description: "Aerospace Grade-5 titanium chassis, sapphire crystal lens, optical heart rate & ECG telemetry, and dual-frequency precision GPS.",
      inStock: true,
    },
    {
      _id: "tn-3",
      name: "NeoKey 75% Magnetic Hall-Effect Keyboard",
      category: "Peripherals",
      price: 189.0,
      compareAtPrice: 230.0,
      rating: 5.0,
      reviewCount: 82,
      badge: "Rapid Trigger",
      batteryLifeHours: 200,
      driverSize: "0.1mm Rapid Trigger Switches",
      ancDb: "Gasket Mount Poron Dampening",
      codecs: "8000Hz Polling, 2.4GHz Wireless",
      weightGrams: "920g (CNC Aluminum)",
      image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=900&auto=format&fit=crop&q=80",
      description: "Magnetic Hall-Effect switches with adjustable 0.1mm actuation points, CNC anodized aluminum chassis, and hyper-speed 8000Hz polling rate.",
      inStock: true,
    },
    {
      _id: "tn-4",
      name: "SonicBeam Spatial Dolby Atmos Soundbar",
      category: "Creator Studio",
      price: 499.0,
      compareAtPrice: 599.0,
      rating: 4.9,
      reviewCount: 45,
      badge: "Dolby Atmos",
      batteryLifeHours: 0,
      driverSize: "11 Independent Neodymium Drivers",
      ancDb: "Room Acoustic Auto-Calibration",
      codecs: "eARC, AirPlay 2, Spotify Connect",
      weightGrams: "4.2 kg",
      image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=900&auto=format&fit=crop&q=80",
      description: "True 7.1.2 physical upward-firing acoustic transducers bouncing spatial Dolby audio objects off walls and ceilings.",
      inStock: true,
    },
    {
      _id: "tn-5",
      name: "ApexPrecision 8K Ultra-Light Wireless Mouse",
      category: "Peripherals",
      price: 129.0,
      compareAtPrice: 159.0,
      rating: 4.9,
      reviewCount: 63,
      badge: "38g Featherweight",
      batteryLifeHours: 90,
      driverSize: "PAW3950 Optical 30K Sensor",
      ancDb: "Zero-Smoothing Tracking",
      codecs: "8000Hz Wireless Nano Dongle",
      weightGrams: "38g",
      image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=900&auto=format&fit=crop&q=80",
      description: "Ultra-lightweight magnesium alloy skeletal frame, 30,000 DPI optical sensor, optical micro-switches, and zero-latency 8K wireless polling.",
      inStock: true,
    },
    {
      _id: "tn-6",
      name: "StreamMaster 4K 60FPS HDR Creator Webcam",
      category: "Creator Studio",
      price: 179.0,
      compareAtPrice: 219.0,
      rating: 4.7,
      reviewCount: 51,
      badge: "Sony STARVIS 2",
      batteryLifeHours: 0,
      driverSize: '1/1.8" STARVIS 2 Sensor',
      ancDb: "Dual AI Noise-Cancelling Mics",
      codecs: "USB 3.2 Gen 2 Type-C (Uncompressed)",
      weightGrams: "165g",
      image: "https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=900&auto=format&fit=crop&q=80",
      description: "Ultra-low-light Sony STARVIS 2 image sensor with hardware HDR, phase-detection autofocus, and studio ring mount.",
      inStock: true,
    },
    {
      _id: "tn-7",
      name: "AeroBuds Pro Active Spatial In-Ear Monitors",
      category: "Pro Audio & ANC",
      price: 199.0,
      compareAtPrice: 249.0,
      rating: 4.8,
      reviewCount: 112,
      badge: "Dual Drivers",
      batteryLifeHours: 38,
      driverSize: "11mm Dynamic + Planar Tweeter",
      ancDb: "48 dB Smart Adaptive ANC",
      codecs: "LDAC, LHDC 5.0, AAC",
      weightGrams: "5.1g per earbud",
      image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=900&auto=format&fit=crop&q=80",
      description: "Coaxial dual-driver acoustic architecture with ultra-deep 48dB adaptive active noise cancellation and IP55 water resistance.",
      inStock: true,
    },
    {
      _id: "tn-8",
      name: "TitanCharge 140W GaN 4-Port Fast Station",
      category: "Peripherals",
      price: 89.0,
      compareAtPrice: 119.0,
      rating: 4.9,
      reviewCount: 78,
      badge: "GaN III Tech",
      batteryLifeHours: 0,
      driverSize: "140W PD 3.1 Architecture",
      ancDb: "Active Thermal Guard 2.0",
      codecs: "3x USB-C + 1x USB-A Fast Charging",
      weightGrams: "215g",
      image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=900&auto=format&fit=crop&q=80",
      description: "Gallium Nitride III power delivery charging laptops, phones, and peripherals simultaneously with multi-temperature protection.",
      inStock: true,
    },
  ];

  const techItems = products.length > 0 ? products : defaultTech;

  const brandName =
    business?.businessName ||
    business?.name ||
    customization?.heroHeadline ||
    "TECHNOVA";

  const brandLogo = customization?.logo || business?.logo || null;
  const brandPhone =
    business?.phone ||
    business?.businessPhone ||
    business?.contactPhone ||
    "+1 (888) 404-TECH";
  const brandEmail =
    business?.email ||
    business?.businessEmail ||
    business?.contactEmail ||
    "support@technovagear.io";

  const rawAddr = business?.address || business?.registered_business_address;
  const brandAddress =
    typeof rawAddr === "string"
      ? rawAddr
      : rawAddr && typeof rawAddr === "object"
      ? [rawAddr.street, rawAddr.addressLine2, rawAddr.city, rawAddr.state, rawAddr.postalCode, rawAddr.country]
          .filter(Boolean)
          .join(", ")
      : "100 Silicon Way, Austin, TX 78701";

  // Comparison entities
  const device1 = techItems.find((t) => t._id === compareId1) || techItems[0];
  const device2 = techItems.find((t) => t._id === compareId2) || techItems[1];

  const handleToggleCompare = (product) => {
    setCompareList((prev) => {
      const exists = prev.some((p) => p._id === product._id);
      if (exists) {
        toast.success(`Removed ${product.name.split(" ")[0]} from shootout.`);
        return prev.filter((p) => p._id !== product._id);
      } else {
        if (prev.length >= 4) {
          toast.error("You can compare up to 4 devices simultaneously.");
          return prev;
        }
        toast.success(`Added ${product.name.split(" ")[0]} to shootout!`);
        const updated = [...prev, product];
        if (updated.length >= 2) {
          setCompareId1(updated[0]._id);
          setCompareId2(updated[1]._id);
        }
        return updated;
      }
    });
  };

  const handleAddToCart = (product, qty = 1, warrantyOption = null) => {
    if (isOutOfStock(product)) {
      toast.error(`Sorry, ${product.name} is currently out of stock!`);
      return;
    }

    const itemToAdd = {
      ...product,
      price: warrantyOption ? product.price + 39 : product.price,
      name: warrantyOption ? `${product.name} (+TechShield 2-Yr)` : product.name,
    };

    dispatch(addToCart({ product: itemToAdd, quantity: qty }));
    toast.success(`${itemToAdd.name} added to Tech Cart! ⚡`);
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

  // Battery calculations
  const calculatedDays = useMemo(() => {
    const totalDailyHours = dailyMusicHours + dailyCallHours;
    if (totalDailyHours === 0) return 14;
    const baseBattery = 50; // AeroPulse 50h
    const drainFactor = ancEnabled ? 1.25 : 1.0;
    const actualHours = baseBattery / drainFactor;
    return (actualHours / totalDailyHours).toFixed(1);
  }, [dailyMusicHours, dailyCallHours, ancEnabled]);

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setActivePage("product-detail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#080D18] text-[#F8FAFC] antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* ================= 1. CYBER TECH NAVBAR ================= */}
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
        compareCount={compareList.length}
        onOpenCompare={() => {
          setActivePage("compare");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />

      {/* ================= 2. MAIN ACTIVE VIEW ================= */}
      <main className="flex-1">
        {/* ================= VIEW 1: HOME (FLAGSHIPS & INTERACTIVE SUITE) ================= */}
        {activePage === "home" && (
          <>
            {/* HERO SECTION */}
            <section className="relative overflow-hidden bg-gradient-to-b from-[#0B1120] via-[#090E1B] to-[#080D18] pt-12 pb-20 md:pt-20 md:pb-28 border-b border-slate-800">
              {/* Background ambient lighting */}
              <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  <div className="lg:col-span-7 space-y-6 text-left">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-300 text-xs font-semibold shadow-inner font-mono">
                      <Zap size={14} className="text-cyan-400 animate-pulse" />
                      <span>Next-Gen Audio & Silicon 3.0 Architecture Released</span>
                    </div>

                    <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.08]">
                      Precision Acoustic Engineering & Pure Silicon Speed.
                    </h1>

                    <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-xl">
                      Custom 40mm Beryllium acoustic chambers, 45dB hybrid active noise cancellation, and zero-latency wireless connectivity. Engineered for audiophiles and competitive esports athletes.
                    </p>

                    <div className="flex flex-wrap gap-4 pt-2">
                      <button
                        onClick={() => {
                          setActivePage("specs");
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition shadow-xl shadow-blue-600/30 flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5 active:scale-95"
                      >
                        <Headphones size={17} className="text-cyan-200" />
                        <span>Explore Flagships</span>
                      </button>

                      <button
                        onClick={() => {
                          setActivePage("compare");
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="px-7 py-4 bg-slate-900/90 border border-slate-700 hover:border-cyan-400 text-slate-200 rounded-2xl text-xs font-bold uppercase tracking-wider transition flex items-center gap-2 cursor-pointer hover:bg-slate-800"
                      >
                        <SlidersHorizontal size={16} className="text-cyan-400" />
                        <span>Spec Shootout Matrix</span>
                      </button>

                      <button
                        onClick={() => {
                          setActivePage("offers");
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="px-5 py-4 bg-slate-900/60 border border-rose-500/30 hover:border-rose-400 text-rose-300 rounded-2xl text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <Tag size={15} />
                        <span>Flash Drops</span>
                      </button>
                    </div>

                    {/* Technical Specs Strip */}
                    <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80 text-left">
                      <div>
                        <span className="text-xl sm:text-2xl font-black text-cyan-400 font-mono">45 dB</span>
                        <p className="text-[11px] text-slate-400 mt-0.5">Hybrid Noise Cancellation</p>
                      </div>
                      <div>
                        <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">50 Hours</span>
                        <p className="text-[11px] text-slate-400 mt-0.5">Playback On Single Charge</p>
                      </div>
                      <div>
                        <span className="text-xl sm:text-2xl font-black text-violet-400 font-mono">0.1 ms</span>
                        <p className="text-[11px] text-slate-400 mt-0.5">Ultra-Low Wireless Latency</p>
                      </div>
                    </div>
                  </div>

                  {/* Hero Visual Card */}
                  <div className="lg:col-span-5 relative">
                    <div className="aspect-[4/3] rounded-[36px] overflow-hidden shadow-2xl border-4 border-slate-800 bg-slate-950 relative group">
                      <img
                        src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&auto=format&fit=crop&q=80"
                        alt="TechNova Audio Flagship"
                        className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

                      <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest font-mono">
                            Flagship Acoustics
                          </span>
                          <h4 className="text-lg font-bold text-white">AeroPulse Master Studio ANC</h4>
                        </div>
                        <button
                          onClick={() => handleSelectProduct(techItems[0])}
                          className="p-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl transition cursor-pointer font-bold shadow-lg"
                        >
                          <ChevronRight size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* FLAGSHIP HARDWARE SHOWCASE GRID */}
            <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-left">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-slate-800 pb-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-cyan-400 font-bold font-mono">
                    <Sparkles size={14} />
                    <span>Acoustic & Hardware Lineup</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-black text-white mt-1">
                    Featured Flagships
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setActivePage("specs");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition cursor-pointer font-mono"
                  >
                    <span>View All Specifications ({techItems.length} models)</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>

              {/* Hardware Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {techItems.slice(0, 8).map((item) => {
                  const isCompared = compareList.some((c) => c._id === item._id);
                  return (
                    <ProductCard
                      key={item._id}
                      product={item}
                      onSelectProduct={handleSelectProduct}
                      onAddToCart={handleAddToCart}
                      onToggleCompare={handleToggleCompare}
                      isCompared={isCompared}
                    />
                  );
                })}
              </div>
            </section>

            {/* INTERACTIVE LABORATORY CALLOUT BANNER */}
            <section className="py-16 bg-gradient-to-r from-slate-900/90 via-[#0B1222] to-slate-900/90 border-y border-slate-800">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
                  <span className="text-xs uppercase tracking-widest text-cyan-400 font-bold font-mono">
                    Laboratory Audio & Power Suites
                  </span>
                  <h2 className="text-3xl font-black text-white">Interactive Engineering Tools</h2>
                  <p className="text-xs text-slate-400">
                    Interact directly with simulated DSP acoustic response curves and real-time battery stamina calculations.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                  <div
                    onClick={() => {
                      setActivePage("compare");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/40 transition cursor-pointer group shadow-xl"
                  >
                    <SlidersHorizontal size={28} className="text-cyan-400 mb-4 group-hover:scale-110 transition duration-300" />
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-300">Spec-by-Spec Shootout</h3>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      Place any two models side-by-side to contrast driver materials, acoustic isolation, and polling rates.
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-xs text-cyan-400 font-bold">
                      Launch Shootout <ArrowRight size={13} />
                    </span>
                  </div>

                  <div
                    onClick={() => {
                      setActivePage("eq-lab");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/40 transition cursor-pointer group shadow-xl"
                  >
                    <Sliders size={28} className="text-cyan-400 mb-4 group-hover:scale-110 transition duration-300" />
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-300">EQ Soundstage Simulator</h3>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      Visualize 16-band DSP frequency responses across Studio Flat, Sub-Bass, and Vocal Clarity profiles.
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-xs text-cyan-400 font-bold">
                      Tune Soundstage <ArrowRight size={13} />
                    </span>
                  </div>

                  <div
                    onClick={() => {
                      setActivePage("battery-calc");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/40 transition cursor-pointer group shadow-xl"
                  >
                    <Battery size={28} className="text-emerald-400 mb-4 group-hover:scale-110 transition duration-300" />
                    <h3 className="text-lg font-bold text-white group-hover:text-emerald-300">Battery Stamina Lab</h3>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      Calculate exact days between wall charges based on your daily music, calls, and ANC active status.
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-xs text-emerald-400 font-bold">
                      Calculate Usage <ArrowRight size={13} />
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {/* ================= VIEW 2: HARDWARE ARSENAL (PRODUCT CATALOG) ================= */}
        {activePage === "specs" && (
          <Product
            products={techItems}
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
            compareList={compareList}
            onToggleCompare={handleToggleCompare}
            onOpenCompareMatrix={() => {
              setActivePage("compare");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        )}

        {/* ================= VIEW 3: SPEC-BY-SPEC COMPARISON MATRIX ================= */}
        {activePage === "compare" && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10 text-left">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs uppercase tracking-[0.2em] text-cyan-400 font-bold font-mono">
                Hardware Shootout
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-white">Side-by-Side Spec Comparison</h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Select any 2 devices from our laboratory arsenal to contrast active noise cancellation, driver architecture, and battery stamina.
              </p>
            </div>

            {/* Device Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-900/60 p-6 rounded-3xl border border-slate-800">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-cyan-400 font-mono">Device A (Primary)</label>
                <select
                  value={compareId1}
                  onChange={(e) => setCompareId1(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:border-cyan-400 focus:outline-none"
                >
                  {techItems.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.name} (₹{t.price})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-blue-400 font-mono">Device B (Challenger)</label>
                <select
                  value={compareId2}
                  onChange={(e) => setCompareId2(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:border-blue-400 focus:outline-none"
                >
                  {techItems.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.name} (₹{t.price})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Comparison Table */}
            <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 overflow-x-auto shadow-2xl">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/60">
                    <th className="py-3 px-4 font-mono font-bold text-[11px] uppercase">Technical Metric</th>
                    <th className="py-3 px-4 font-bold text-cyan-300 text-sm">{device1.name}</th>
                    <th className="py-3 px-4 font-bold text-blue-400 text-sm">{device2.name}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  <tr>
                    <td className="py-3 px-4 font-bold text-slate-400">Price</td>
                    <td className="py-3 px-4 font-black text-white font-mono text-sm">₹{device1.price}</td>
                    <td className="py-3 px-4 font-black text-white font-mono text-sm">₹{device2.price}</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-slate-400">Category</td>
                    <td className="py-3 px-4 text-slate-300 font-mono">{device1.category}</td>
                    <td className="py-3 px-4 text-slate-300 font-mono">{device2.category}</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-slate-400">Driver / Core Engine</td>
                    <td className="py-3 px-4 text-cyan-300 font-bold font-mono">{device1.driverSize}</td>
                    <td className="py-3 px-4 text-cyan-300 font-bold font-mono">{device2.driverSize}</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-slate-400">Acoustic Isolation</td>
                    <td className="py-3 px-4 text-slate-300 font-mono">{device1.ancDb}</td>
                    <td className="py-3 px-4 text-slate-300 font-mono">{device2.ancDb}</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-slate-400">Battery Stamina</td>
                    <td className="py-3 px-4 text-emerald-400 font-bold font-mono">{device1.batteryLifeHours} Hours</td>
                    <td className="py-3 px-4 text-emerald-400 font-bold font-mono">{device2.batteryLifeHours} Hours</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-slate-400">Codecs / Telemetry</td>
                    <td className="py-3 px-4 text-slate-300 font-mono">{device1.codecs}</td>
                    <td className="py-3 px-4 text-slate-300 font-mono">{device2.codecs}</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-slate-400">Weight Metric</td>
                    <td className="py-3 px-4 text-slate-300 font-mono">{device1.weightGrams}</td>
                    <td className="py-3 px-4 text-slate-300 font-mono">{device2.weightGrams}</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-slate-400">Action</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleAddToCart(device1)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold cursor-pointer transition shadow"
                      >
                        Add {device1.name.split(" ")[0]}
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleAddToCart(device2)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold cursor-pointer transition shadow"
                      >
                        Add {device2.name.split(" ")[0]}
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= VIEW 4: EQ SOUNDSTAGE SIMULATOR ================= */}
        {activePage === "eq-lab" && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10 text-left">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs uppercase tracking-[0.2em] text-cyan-400 font-bold font-mono">
                DSP Acoustic Tuning
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-white">Interactive EQ Soundstage Simulator</h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Experience how our custom 40mm Beryllium acoustic chambers reproduce sound across distinct DSP harmonic profiles.
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-2xl">
              {/* Preset Buttons */}
              <div className="flex flex-wrap justify-between items-center gap-3">
                <span className="text-xs font-bold text-slate-300 font-mono uppercase">Select Acoustic Preset:</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: "flat", label: "Studio Flat Reference (Neutral)" },
                    { id: "bass", label: "Sub-Bass Punch (+6dB @ 60Hz)" },
                    { id: "vocal", label: "Vocal Clarity (+4dB @ 3kHz)" },
                    { id: "gaming", label: "Esports Footsteps (Presence Peak)" },
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setActiveEqPreset(p.id)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                        activeEqPreset === p.id
                          ? "bg-cyan-500 text-slate-950 border-cyan-400 font-black shadow-md"
                          : "bg-slate-950 text-slate-400 border-slate-700 hover:text-white"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Graphic Soundwave Bars */}
              <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 shadow-inner">
                <div className="h-44 flex items-end justify-between gap-1 sm:gap-2 px-2">
                  {[30, 45, 60, 80, 70, 55, 65, 90, 85, 60, 50, 65, 75, 80, 50, 40].map((h, i) => {
                    let adjustedH = h;
                    if (activeEqPreset === "bass" && i < 6) adjustedH = Math.min(100, h * 1.5);
                    if (activeEqPreset === "vocal" && i >= 6 && i <= 11) adjustedH = Math.min(100, h * 1.4);
                    if (activeEqPreset === "gaming" && i >= 9 && i <= 13) adjustedH = Math.min(100, h * 1.45);
                    return (
                      <div
                        key={i}
                        className="w-full bg-gradient-to-t from-blue-600 via-cyan-500 to-cyan-300 rounded-t-lg transition-all duration-300 shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                        style={{ height: `${adjustedH}%` }}
                      />
                    );
                  })}
                </div>
                <div className="flex justify-between text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-800">
                  <span>20 Hz (Sub)</span>
                  <span>250 Hz (Low Mid)</span>
                  <span>2.5 kHz (Presence)</span>
                  <span>20 kHz (Air)</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed font-mono">
                {activeEqPreset === "flat" && (
                  <p>
                    🎯 <strong>Reference Mode:</strong> Perfectly flat Harman target calibration. Zero artificial low-end coloration, allowing producers and mastering engineers to hear honest transients.
                  </p>
                )}
                {activeEqPreset === "bass" && (
                  <p>
                    🔥 <strong>Bass Extension:</strong> Enhanced sub-bass magnetic induction delivering visceral visceral slam for cinematic trailers and EDM without muddying the vocal midrange.
                  </p>
                )}
                {activeEqPreset === "vocal" && (
                  <p>
                    🎙️ <strong>Vocal Presence:</strong> Elevated 3kHz–8kHz acoustic contour emphasizing crisp podcast speech articulation, acoustic instruments, and high vocal harmonies.
                  </p>
                )}
                {activeEqPreset === "gaming" && (
                  <p>
                    ⚡ <strong>Esports Precision:</strong> Acoustic profile tuned to sharpen enemy footstep transients, tactical reloads, and spatial audio cues in competitive FPS environments.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= VIEW 5: BATTERY USAGE LAB ================= */}
        {activePage === "battery-calc" && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10 text-left">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs uppercase tracking-[0.2em] text-emerald-400 font-bold font-mono">
                Power Optimization
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-white">Daily Battery Stamina Calculator</h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Estimate how many days our AeroPulse headphones will last based on your exact listening habits and ANC toggles.
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-300 font-mono">
                    <span>Music Playback: {dailyMusicHours} Hours/Day</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={dailyMusicHours}
                    onChange={(e) => setDailyMusicHours(Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-300 font-mono">
                    <span>Calls & Gaming: {dailyCallHours} Hours/Day</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="8"
                    value={dailyCallHours}
                    onChange={(e) => setDailyCallHours(Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800 cursor-pointer">
                  <span className="text-xs font-bold text-white">Enable 45dB Active Noise Cancellation</span>
                  <input
                    type="checkbox"
                    checked={ancEnabled}
                    onChange={(e) => setAncEnabled(e.target.checked)}
                    className="accent-cyan-400 w-4 h-4 cursor-pointer"
                  />
                </label>
              </div>

              {/* Output Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 block font-mono">Single Charge Stamina</span>
                  <span className="text-3xl font-black text-white font-mono">{calculatedDays} Days</span>
                  <p className="text-[10px] text-slate-500">between wall charges</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-cyan-400 block font-mono">Fast Charge Top-Up</span>
                  <span className="text-3xl font-black text-white font-mono">10m = 5h</span>
                  <p className="text-[10px] text-slate-500">via USB-C GaN fast charge</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-violet-400 block font-mono">Cell Chemistry</span>
                  <span className="text-3xl font-black text-white font-mono">1000 mAh</span>
                  <p className="text-[10px] text-slate-500">High-density lithium polymer</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= VIEW 6: OFFERS & FLASH DROPS ================= */}
        {activePage === "offers" && (
          <Offer
            products={techItems}
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
            onOpenSpecs={() => {
              setActivePage("specs");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        )}

        {/* ================= VIEW 7: FULL PRODUCT DETAILS INSPECTOR ================= */}
        {activePage === "product-detail" && selectedProduct && (
          <ProductDeltails
            product={selectedProduct}
            onBack={() => {
              setActivePage("home");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onAddToCart={handleAddToCart}
            relatedProducts={techItems}
            onSelectProduct={handleSelectProduct}
            onToggleCompare={handleToggleCompare}
            isCompared={compareList.some((c) => c._id === selectedProduct._id)}
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

      {/* ================= 4. REDUX CART DRAWER ================= */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
        themeColors={{ primary: "#06B6D4" }}
      />
    </div>
  );
}
