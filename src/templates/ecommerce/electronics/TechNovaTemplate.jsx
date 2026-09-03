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
import ProductDetailsPage from "../../common/ProductDetailsPage";
import { getProductImage } from "../../../utils/productImage";

export default function TechNovaTemplate({
  business = {},
  products = [],
  categories = [],
  offers = [],
  reviews = [],
  customization = {},
}) {
  // Navigation: "home" | "specs" | "compare" | "eq-lab" | "battery-calc" | "product-detail"
  const [activePage, setActivePage] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);

  // Search & Filters
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");

  // Comparison Matrix State (2 device IDs)
  const [compareId1, setCompareId1] = useState("tn-1");
  const [compareId2, setCompareId2] = useState("tn-2");

  // Interactive EQ Simulator State
  const [activeEqPreset, setActiveEqPreset] = useState("flat"); // "flat" | "bass" | "vocal"

  // Battery Life Calculator State
  const [dailyMusicHours, setDailyMusicHours] = useState(4);
  const [dailyCallHours, setDailyCallHours] = useState(2);
  const [ancEnabled, setAncEnabled] = useState(true);

  // Warranty selection in quick view
  const [selectedWarranty, setSelectedWarranty] = useState("2year"); // "standard" | "2year"

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart?.cartItems || []);

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
      driverSize: "40mm Beryllium",
      ancDb: "45 dB Hybrid ANC",
      codecs: "LDAC, aptX Adaptive, AAC",
      weightGrams: "248g",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&auto=format&fit=crop&q=80",
      description: "Audiophile-grade pure titanium acoustic chambers with custom DSP equalization and spatial head-tracking.",
      inStock: true,
    },
    {
      _id: "tn-2",
      name: "PulsePro Biomark Smart Sports Watch",
      category: "Smart Wearables",
      price: 249.0,
      compareAtPrice: 299.0,
      rating: 4.8,
      reviewCount: 94,
      badge: "Titanium Case",
      batteryLifeHours: 168, // 7 days
      driverSize: "1.43\" AMOLED 1000 nits",
      ancDb: "N/A (50m Waterproof)",
      codecs: "Bluetooth 5.4 LE, GNSS Multi-Band",
      weightGrams: "52g",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&auto=format&fit=crop&q=80",
      description: "Aerospace-grade Grade 5 titanium chassis, sapphire crystal lens, ECG cardiac monitoring, and dual-frequency GPS.",
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
      driverSize: "0.1mm Rapid Trigger",
      ancDb: "Gasket Mount Poron Foam",
      codecs: "8000Hz Polling Rate, 2.4GHz Wireless",
      weightGrams: "920g (CNC Aluminum)",
      image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=900&auto=format&fit=crop&q=80",
      description: "Magnetic Hall-Effect switches with customizable 0.1mm actuation points, CNC anodized aluminum case, and 8000Hz polling.",
      inStock: true,
    },
    {
      _id: "tn-4",
      name: "SonicBeam Spatial Dolby Atmos Soundbar",
      category: "Pro Audio & ANC",
      price: 499.0,
      compareAtPrice: 599.0,
      rating: 4.9,
      reviewCount: 45,
      badge: "Dolby Atmos",
      batteryLifeHours: 0,
      driverSize: "11 Independent Drivers",
      ancDb: "Room Acoustic Auto-Calibration",
      codecs: "eARC, AirPlay 2, Spotify Connect",
      weightGrams: "4.2 kg",
      image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=900&auto=format&fit=crop&q=80",
      description: "True 7.1.2 channel physical upward-firing acoustic drivers that bounce spatial Dolby soundscapes off your ceiling.",
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

  // Filter tech
  const filteredTech = useMemo(() => {
    return techItems
      .filter((item) => {
        if (selectedCategory !== "all") {
          const cat = (item.category || "").toLowerCase();
          const filter = selectedCategory.toLowerCase();
          if (!cat.includes(filter)) return false;
        }

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const nameM = (item.name || "").toLowerCase().includes(q);
          const descM = (item.description || "").toLowerCase().includes(q);
          const catM = (item.category || "").toLowerCase().includes(q);
          if (!nameM && !descM && !catM) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return Number(a.price) - Number(b.price);
        if (sortBy === "price-desc") return Number(b.price) - Number(a.price);
        if (sortBy === "rating") return (b.rating || 5) - (a.rating || 5);
        return 0;
      });
  }, [techItems, selectedCategory, searchQuery, sortBy]);

  const handleAddToCart = (product, qty = 1, warrantyOption = null) => {
    if (isOutOfStock(product)) {
      toast.error(`Sorry, ${product.name} is currently out of stock!`);
      return;
    }

    const itemToAdd = {
      ...product,
      price: warrantyOption ? product.price + 39 : product.price,
      name: warrantyOption ? `${product.name} (+TechNova Shield 2-Yr)` : product.name,
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

  // Comparison entities
  const device1 = techItems.find((t) => t._id === compareId1) || techItems[0];
  const device2 = techItems.find((t) => t._id === compareId2) || techItems[1];

  // Battery calculations
  const calculatedDays = useMemo(() => {
    const totalDailyHours = dailyMusicHours + dailyCallHours;
    if (totalDailyHours === 0) return 14;
    const baseBattery = 50; // AeroPulse 50h
    const drainFactor = ancEnabled ? 1.25 : 1.0;
    const actualHours = baseBattery / drainFactor;
    return (actualHours / totalDailyHours).toFixed(1);
  }, [dailyMusicHours, dailyCallHours, ancEnabled]);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#0F172A] text-[#F8FAFC] antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* ================= 1. CYBER TECH TOP BAR ================= */}
      <header className="sticky top-0 z-40 bg-[#0F172A]/95 backdrop-blur-md border-b border-slate-800 shadow-xl">
        <div className="bg-[#1E293B] text-slate-300 text-[11px] py-2 px-4 border-b border-slate-800">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-medium tracking-wide">
              <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>
                <strong>Next-Gen Hardware Drop:</strong> 2-Year Comprehensive TechNova Shield Warranty with Express 24-Hr Advance Replacement.
              </span>
            </div>
            <div className="hidden md:flex items-center gap-6 text-[11px] font-medium text-cyan-300">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-cyan-400" /> Guaranteed OEM Authentic
              </span>
              <span className="flex items-center gap-1.5">
                <RotateCcw size={14} className="text-cyan-400" /> 30-Day Risk-Free Audio Trial
              </span>
              <a href={`tel:${brandPhone}`} className="hover:text-white transition flex items-center gap-1">
                <Phone size={13} /> {brandPhone}
              </a>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-22 flex items-center justify-between gap-4">
          <div
            onClick={() => {
              setActivePage("home");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            {brandLogo ? (
              <img src={brandLogo} alt={brandName} className="h-11 w-auto max-w-[150px] object-contain rounded-lg" />
            ) : (
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition duration-300">
                <Cpu size={22} className="text-cyan-200" />
              </div>
            )}
            <div className="space-y-0.5 text-left">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white block leading-none">
                {brandName}
              </span>
              <span className="text-[10px] uppercase tracking-[0.25em] text-cyan-400 font-bold block">
                Next-Gen Audio & Performance Hardware
              </span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8 text-[12px] font-bold uppercase tracking-wider text-slate-300">
            {[
              { id: "home", label: "Flagships" },
              { id: "specs", label: "Hardware Catalog" },
              { id: "compare", label: "Spec-by-Spec Matrix" },
              { id: "eq-lab", label: "EQ Soundstage Simulator" },
              { id: "battery-calc", label: "Battery Usage Lab" },
            ].map((tab) => {
              const isActive = activePage === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActivePage(tab.id);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`transition cursor-pointer relative py-2 ${
                    isActive ? "text-cyan-400 font-black" : "hover:text-cyan-300 text-slate-400"
                  }`}
                >
                  <span>{tab.label}</span>
                  {isActive && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 rounded-full" />}
                </button>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setActivePage("compare");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-slate-800 text-cyan-400 hover:bg-slate-700 font-bold text-xs border border-cyan-500/20 transition cursor-pointer"
            >
              <SlidersHorizontal size={14} />
              <span>Compare Devices</span>
            </button>

            <button
              onClick={() => setCartOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-blue-600 text-white hover:bg-blue-500 transition cursor-pointer flex items-center gap-2 font-bold text-xs shadow-lg shadow-blue-600/30"
            >
              <ShoppingBag size={17} className="text-cyan-200" />
              <span className="hidden sm:inline">Tech Cart</span>
              <span className="bg-cyan-400 text-slate-950 text-[11px] font-black min-w-[20px] h-5 px-1 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ================= 2. MAIN CONTENT ================= */}
      <main className="flex-1">
        {/* ================= PAGE 1: HOME ================= */}
        {activePage === "home" && (
          <>
            {/* HERO SECTION */}
            <section className="relative overflow-hidden bg-gradient-to-b from-[#0B1120] via-[#0F172A] to-[#0F172A] pt-12 pb-20 md:pt-18 md:pb-24 border-b border-slate-800">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  <div className="lg:col-span-7 space-y-6 text-left">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-cyan-500/30 text-cyan-300 text-xs font-semibold shadow-inner">
                      <Zap size={14} className="text-cyan-400" />
                      <span>Next-Gen Audio 3.0 Architecture Released</span>
                    </div>

                    <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.08]">
                      Precision Acoustic Engineering & Pure Silicon Speed.
                    </h1>

                    <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-xl">
                      Custom 40mm Beryllium diaphragms, 45dB hybrid noise cancellation, and zero-latency wireless connectivity. Tuned for audio creators and competitive esports athletes.
                    </p>

                    <div className="flex flex-wrap gap-4 pt-2">
                      <button
                        onClick={() => {
                          setActivePage("specs");
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition shadow-xl shadow-blue-600/30 flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
                      >
                        <Headphones size={17} className="text-cyan-200" />
                        <span>Explore Flagships</span>
                      </button>

                      <button
                        onClick={() => {
                          setActivePage("compare");
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="px-7 py-4 bg-slate-800 border border-slate-700 hover:border-cyan-400 text-slate-200 rounded-2xl text-xs font-bold uppercase tracking-wider transition flex items-center gap-2 cursor-pointer"
                      >
                        <SlidersHorizontal size={16} className="text-cyan-400" />
                        <span>Compare Tech Specs</span>
                      </button>
                    </div>

                    {/* Specs highlight strip */}
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800 text-left">
                      <div>
                        <span className="text-xl font-black text-cyan-400">45 dB</span>
                        <p className="text-[11px] text-slate-400">Hybrid Noise Cancellation</p>
                      </div>
                      <div>
                        <span className="text-xl font-black text-cyan-400">50 Hours</span>
                        <p className="text-[11px] text-slate-400">Playback On Single Charge</p>
                      </div>
                      <div>
                        <span className="text-xl font-black text-cyan-400">0.1 ms</span>
                        <p className="text-[11px] text-slate-400">Ultra-Low Wireless Latency</p>
                      </div>
                    </div>
                  </div>

                  {/* Hero Visual */}
                  <div className="lg:col-span-5 relative">
                    <div className="aspect-[4/3] rounded-[36px] overflow-hidden shadow-2xl border-8 border-slate-800 bg-slate-900">
                      <img
                        src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&auto=format&fit=crop&q=80"
                        alt="TechNova Audio Flagship"
                        className="w-full h-full object-cover transform hover:scale-105 transition duration-700"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* HARDWARE GRID */}
            <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-left">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-slate-800 pb-6">
                <div>
                  <span className="text-xs uppercase tracking-wider text-cyan-400 font-bold">Acoustic & Hardware Lineup</span>
                  <h2 className="text-3xl sm:text-4xl font-black text-white">Flagship Hardware</h2>
                </div>
                <button
                  onClick={() => {
                    setActivePage("specs");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:underline cursor-pointer"
                >
                  <span>View All Specifications ({techItems.length} devices)</span>
                  <ArrowRight size={14} />
                </button>
              </div>

              {/* Items Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {techItems.map((item) => {
                  const outOfStock = isOutOfStock(item);
                  return (
                    <div
                      key={item._id}
                      onClick={() => {
                        setSelectedProduct(item);
                        setActivePage("product-detail");
                      }}
                      className="bg-slate-800/80 rounded-3xl border border-slate-700/80 p-5 space-y-4 flex flex-col justify-between shadow-lg hover:shadow-cyan-500/10 hover:border-cyan-500/40 transition duration-300 cursor-pointer group relative"
                    >
                      <div className="space-y-3">
                        <div className="aspect-square rounded-2xl overflow-hidden bg-slate-900 relative">
                          <img
                            src={getProductImage(item, item.image)}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-108 transition duration-500"
                          />
                          {item.badge && (
                            <span className="absolute top-3 left-3 bg-blue-600/90 text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-[11px] font-bold">
                          <span className="text-cyan-400 uppercase tracking-wider">{item.category}</span>
                          <span className="text-slate-400 flex items-center gap-1">
                            <Star size={12} className="text-amber-400 fill-amber-400" />
                            {item.rating || 5.0} ({item.reviewCount || 40})
                          </span>
                        </div>

                        <h4 className="text-base font-bold text-white line-clamp-1 group-hover:text-cyan-300 transition">
                          {item.name}
                        </h4>

                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{item.description}</p>

                        <div className="text-[10px] text-cyan-200 bg-slate-900/80 p-2.5 rounded-xl space-y-0.5 border border-slate-700">
                          <span className="font-bold block text-cyan-300">Driver: {item.driverSize}</span>
                          <span className="text-slate-400 block">{item.codecs}</span>
                        </div>
                      </div>

                      <div className="pt-3 flex justify-between items-center border-t border-slate-700/80">
                        <div>
                          <span className="text-xl font-black text-white">₹{Number(item.price).toFixed(2)}</span>
                          {item.compareAtPrice && (
                            <span className="text-xs text-slate-500 line-through ml-1.5">
                              ₹{Number(item.compareAtPrice).toFixed(2)}
                            </span>
                          )}
                        </div>

                        {outOfStock ? (
                          <span className="text-[11px] font-bold text-rose-400 bg-rose-950/40 px-2.5 py-1 rounded-xl">
                            Sold Out
                          </span>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(item);
                            }}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold cursor-pointer transition shadow-md flex items-center gap-1"
                          >
                            <Plus size={14} /> Add
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </>
        )}

        {/* ================= PAGE 2: HARDWARE CATALOG ================= */}
        {activePage === "specs" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10 text-left">
            <div className="space-y-4 border-b border-slate-800 pb-6">
              <span className="text-xs uppercase tracking-wider text-cyan-400 font-bold">Hardware Arsenal</span>
              <h1 className="text-3xl sm:text-4xl font-black text-white">Engineering Specifications</h1>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pt-2">
                <div className="md:col-span-6 relative">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search ANC, headphones, smartwatches, keyboards..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="md:col-span-6 flex flex-wrap gap-2 items-center">
                  {["all", "Pro Audio", "Smart Wearables", "Peripherals"].map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedCategory(c)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition border ${
                        selectedCategory.toLowerCase() === c.toLowerCase()
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
                      }`}
                    >
                      {c === "all" ? "All Categories" : c}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredTech.map((item) => (
                <div
                  key={item._id}
                  onClick={() => {
                    setSelectedProduct(item);
                    setActivePage("product-detail");
                  }}
                  className="bg-slate-800/80 rounded-3xl border border-slate-700 p-5 space-y-3 flex flex-col justify-between shadow-lg hover:border-cyan-500/40 transition cursor-pointer group"
                >
                  <div className="space-y-3">
                    <div className="aspect-square rounded-2xl overflow-hidden bg-slate-900">
                      <img src={getProductImage(item, item.image)} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider block">{item.category}</span>
                    <h4 className="text-base font-bold text-white line-clamp-1">{item.name}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2">{item.description}</p>
                  </div>

                  <div className="pt-3 flex justify-between items-center border-t border-slate-700">
                    <span className="text-lg font-black text-white">₹{Number(item.price).toFixed(2)}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(item);
                      }}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= PAGE 3: SPEC-BY-SPEC COMPARISON MATRIX ================= */}
        {activePage === "compare" && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 text-left">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs uppercase tracking-[0.2em] text-cyan-400 font-bold">Hardware Shootout</span>
              <h1 className="text-3xl sm:text-4xl font-black text-white">Side-by-Side Spec Comparison</h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Select any 2 devices from our laboratory arsenal to contrast active noise cancellation, driver architecture, and battery stamina.
              </p>
            </div>

            {/* Device Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-300">Device A</label>
                <select
                  value={compareId1}
                  onChange={(e) => setCompareId1(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                >
                  {techItems.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.name} (₹{t.price})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-300">Device B</label>
                <select
                  value={compareId2}
                  onChange={(e) => setCompareId2(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
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
            <div className="bg-slate-800/80 rounded-3xl border border-slate-700 p-6 overflow-x-auto shadow-2xl">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-700 text-slate-400">
                    <th className="py-3 px-4">Metric</th>
                    <th className="py-3 px-4 font-bold text-cyan-300">{device1.name}</th>
                    <th className="py-3 px-4 font-bold text-blue-400">{device2.name}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60">
                  <tr>
                    <td className="py-3 px-4 font-bold text-slate-300">Price</td>
                    <td className="py-3 px-4 font-black text-white">₹{device1.price}</td>
                    <td className="py-3 px-4 font-black text-white">₹{device2.price}</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-slate-300">Category</td>
                    <td className="py-3 px-4 text-slate-300">{device1.category}</td>
                    <td className="py-3 px-4 text-slate-300">{device2.category}</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-slate-300">Driver / Core Engine</td>
                    <td className="py-3 px-4 text-cyan-300 font-bold">{device1.driverSize}</td>
                    <td className="py-3 px-4 text-cyan-300 font-bold">{device2.driverSize}</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-slate-300">Acoustic Isolation</td>
                    <td className="py-3 px-4 text-slate-300">{device1.ancDb}</td>
                    <td className="py-3 px-4 text-slate-300">{device2.ancDb}</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-slate-300">Battery Stamina</td>
                    <td className="py-3 px-4 text-emerald-400 font-bold">{device1.batteryLifeHours} Hours</td>
                    <td className="py-3 px-4 text-emerald-400 font-bold">{device2.batteryLifeHours} Hours</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-slate-300">Weight Metric</td>
                    <td className="py-3 px-4 text-slate-300">{device1.weightGrams}</td>
                    <td className="py-3 px-4 text-slate-300">{device2.weightGrams}</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-slate-300">Action</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleAddToCart(device1)}
                        className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[11px] font-bold"
                      >
                        Add {device1.name.split(" ")[0]}
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleAddToCart(device2)}
                        className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[11px] font-bold"
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

        {/* ================= PAGE 4: EQ SOUNDSTAGE SIMULATOR ================= */}
        {activePage === "eq-lab" && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 text-left">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs uppercase tracking-[0.2em] text-cyan-400 font-bold">DSP Acoustic Tuning</span>
              <h1 className="text-3xl sm:text-4xl font-black text-white">Interactive EQ Soundstage Simulator</h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Experience how our custom 40mm Beryllium driver reproduces sound across distinct frequency profiles.
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-slate-800 border border-slate-700 space-y-6 shadow-2xl">
              {/* Preset Buttons */}
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-300">Acoustic Presets:</span>
                <div className="flex gap-2">
                  {[
                    { id: "flat", label: "Studio Flat Reference (Neutral)" },
                    { id: "bass", label: "Sub-Bass Punch (+6dB @ 60Hz)" },
                    { id: "vocal", label: "Vocal Clarity Highs (+4dB @ 3kHz)" },
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setActiveEqPreset(p.id)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition ${
                        activeEqPreset === p.id ? "bg-cyan-500 text-slate-950 border-cyan-400 font-black" : "bg-slate-900 text-slate-400 border-slate-700"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Graphic Soundwave Bars */}
              <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="h-40 flex items-end justify-between gap-1 sm:gap-2 px-2">
                  {[30, 45, 60, 80, 70, 55, 65, 90, 85, 60, 50, 65, 75, 80, 50, 40].map((h, i) => {
                    let adjustedH = h;
                    if (activeEqPreset === "bass" && i < 6) adjustedH = Math.min(100, h * 1.5);
                    if (activeEqPreset === "vocal" && i >= 6 && i <= 11) adjustedH = Math.min(100, h * 1.4);
                    return (
                      <div
                        key={i}
                        className="w-full bg-gradient-to-t from-blue-600 to-cyan-400 rounded-t-lg transition-all duration-300"
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

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-700/80 text-xs text-slate-300 leading-relaxed">
                {activeEqPreset === "flat" && (
                  <p>
                    🎯 <strong>Reference Mode:</strong> Perfectly flat Harman target curve calibration. Zero artificial bass bloating, allowing mixing engineers to hear exact transients.
                  </p>
                )}
                {activeEqPreset === "bass" && (
                  <p>
                    🔥 <strong>Bass Extension:</strong> Enhanced low-frequency magnetic induction providing visceral impact for cinematic trailers, electronic beats, and gaming explosions without muddying midrange vocals.
                  </p>
                )}
                {activeEqPreset === "vocal" && (
                  <p>
                    🎙️ <strong>Vocal Clarity:</strong> Elevated 3kHz–8kHz acoustic peak emphasizing crisp podcast articulation, strings, and acoustic guitars.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= PAGE 5: BATTERY USAGE LAB ================= */}
        {activePage === "battery-calc" && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 text-left">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs uppercase tracking-[0.2em] text-cyan-400 font-bold">Power Optimization</span>
              <h1 className="text-3xl sm:text-4xl font-black text-white">Daily Battery Stamina Calculator</h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Estimate how many days our AeroPulse headphones will last based on your exact listening habits and ANC toggles.
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-slate-800 border border-slate-700 space-y-6 shadow-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-300">
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
                  <div className="flex justify-between text-xs font-bold text-slate-300">
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
                <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900 border border-slate-700 cursor-pointer">
                  <span className="text-xs font-bold text-white">Enable 45dB Active Noise Cancellation</span>
                  <input
                    type="checkbox"
                    checked={ancEnabled}
                    onChange={(e) => setAncEnabled(e.target.checked)}
                    className="accent-cyan-400 w-4 h-4"
                  />
                </label>
              </div>

              {/* Output */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-700">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-cyan-400 block">Single Charge Duration</span>
                  <span className="text-2xl font-black text-white">{calculatedDays} Days</span>
                  <p className="text-[10px] text-slate-500">between wall charges</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-cyan-400 block">Fast Charge Top-Up</span>
                  <span className="text-2xl font-black text-white">10 Mins = 5h</span>
                  <p className="text-[10px] text-slate-500">via USB-C GaN fast charge</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-cyan-400 block">Battery Chemistry</span>
                  <span className="text-2xl font-black text-white">1000 mAh</span>
                  <p className="text-[10px] text-slate-500">High-density lithium polymer</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= PRODUCT DETAIL ================= */}
        {activePage === "product-detail" && selectedProduct && (
          <ProductDetailsPage
            product={selectedProduct}
            onBack={() => {
              setActivePage("home");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onAddToCart={handleAddToCart}
            themeColors={{
              primary: "#2563EB",
              secondary: "#3B82F6",
              text: "#F8FAFC",
              background: "#0F172A",
              cardBg: "#1E293B",
            }}
            business={business}
            relatedProducts={techItems}
            onSelectProduct={(p) => {
              setSelectedProduct(p);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        )}
      </main>

      {/* ================= 3. FOOTER ================= */}
      <footer className="bg-[#0B1120] text-slate-400 pt-16 pb-12 border-t border-slate-800 text-left text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                {brandLogo ? (
                  <img src={brandLogo} alt={brandName} className="h-8 w-auto max-w-[130px] object-contain rounded brightness-0 invert" />
                ) : (
                  <Cpu size={22} className="text-cyan-400" />
                )}
                <span className="text-base font-black tracking-tight text-white uppercase">{brandName}</span>
              </div>
              <p className="text-slate-400 leading-relaxed text-[11px] max-w-xs">
                Next-generation audiophile headphones, smart wearables, high-performance creator gear, and cutting-edge silicon.
              </p>
            </div>

            <div className="space-y-2">
              <h5 className="font-bold text-white uppercase text-[10px] tracking-wider">Hardware Categories</h5>
              <p onClick={() => { setSelectedCategory("Pro Audio"); setActivePage("specs"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="hover:text-white cursor-pointer transition text-[11px]">Beryllium ANC Headphones</p>
              <p onClick={() => { setSelectedCategory("Smart Wearables"); setActivePage("specs"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="hover:text-white cursor-pointer transition text-[11px]">Titanium Smart Watches</p>
              <p onClick={() => { setSelectedCategory("Peripherals"); setActivePage("specs"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="hover:text-white cursor-pointer transition text-[11px]">Hall-Effect Keyboards</p>
            </div>

            <div className="space-y-2">
              <h5 className="font-bold text-white uppercase text-[10px] tracking-wider">Laboratory Tools</h5>
              <p onClick={() => { setActivePage("compare"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="hover:text-white cursor-pointer transition text-[11px]">Spec-by-Spec Matrix</p>
              <p onClick={() => { setActivePage("eq-lab"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="hover:text-white cursor-pointer transition text-[11px]">EQ Soundstage Simulator</p>
              <p onClick={() => { setActivePage("battery-calc"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="hover:text-white cursor-pointer transition text-[11px]">Battery Stamina Lab</p>
            </div>

            <div className="space-y-2">
              <h5 className="font-bold text-white uppercase text-[10px] tracking-wider">Lab Support</h5>
              <p className="text-white font-bold">{brandPhone}</p>
              <p className="text-cyan-400 text-[11px]">{brandEmail}</p>
              {brandAddress && <p className="text-slate-500 text-[11px] pt-1">📍 {brandAddress}</p>}
            </div>
          </div>

          <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-500 gap-2">
            <p>© {new Date().getFullYear()} {brandName}. Built for high-fidelity performance.</p>
            <p>2-Year Comprehensive Warranty • Free Global Freight</p>
          </div>
        </div>
      </footer>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
        themeColors={{ primary: "#2563EB" }}
      />
    </div>
  );
}
