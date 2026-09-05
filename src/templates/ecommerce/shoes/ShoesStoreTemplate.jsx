import React, { useState, useEffect } from "react";
import {
  Zap,
  ShoppingBag,
  Flame,
  ShieldCheck,
  Check,
  Clock,
  ArrowRight,
  Activity,
  Layers,
  Sparkles,
  Sliders,
  ChevronRight,
  Radio,
  Eye,
  Star,
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
  // Navigation: "home" | "sneaker-vault" | "drops-calendar" | "sole-tech" | "authenticity-guarantee" | "offers" | "product-detail"
  const [activePage, setActivePage] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sizeStandard, setSizeStandard] = useState("US"); // "US" | "UK" | "EU"

  // Hero Interactive Colorway State
  const [heroColorway, setHeroColorway] = useState("volt"); // "volt" | "infrared" | "stealth" | "cyan"

  // Live Drop Countdown State (Hours, Minutes, Seconds, Milliseconds)
  const [dropTime, setDropTime] = useState({
    hours: 3,
    minutes: 41,
    seconds: 22,
    ms: 80,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setDropTime((prev) => {
        let ms = prev.ms - 7;
        let sec = prev.seconds;
        let min = prev.minutes;
        let hr = prev.hours;

        if (ms < 0) {
          ms = 99;
          sec -= 1;
        }
        if (sec < 0) {
          sec = 59;
          min -= 1;
        }
        if (min < 0) {
          min = 59;
          hr -= 1;
        }
        if (hr < 0) {
          hr = 12;
        }
        return { hours: hr, minutes: min, seconds: sec, ms };
      });
    }, 70);
    return () => clearInterval(timer);
  }, []);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart?.cartItems || []);

  const defaultKicks = [
    {
      _id: "shoe-1",
      name: "AeroPulse Carbon Propulsion Marathon Racer",
      category: "Running",
      price: 18999,
      compareAtPrice: 22999,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
      description: "Full-length spooned carbon-fiber propulsion plate with supercritical nitrogen-infused gas foam. Engineered for sub-3-hour marathons.",
      propulsionTag: "Curved Carbon Spoon",
      heelDrop: "38mm / 8mm Drop",
      weight: "184g",
      energyReturn: "89% Return",
      rating: 5.0,
      reviewCount: 142,
      sizes: ["8", "8.5", "9", "9.5", "10", "10.5", "11", "12"],
      inStock: true,
      dropTag: "HYBRID SPEED",
    },
    {
      _id: "shoe-2",
      name: "Retro High-Top Court Edition '85",
      category: "Basketball",
      price: 15499,
      compareAtPrice: 17999,
      image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&auto=format&fit=crop&q=80",
      description: "Premium full-grain tumbled leather upper, padded ankle collar, encapsulated air heel cushioning, and vintage aged rubber outsole.",
      propulsionTag: "Encapsulated Air Unit",
      heelDrop: "32mm / 10mm Drop",
      weight: "390g",
      energyReturn: "76% Return",
      rating: 4.9,
      reviewCount: 98,
      sizes: ["7.5", "8", "9", "10", "11", "12"],
      inStock: true,
      dropTag: "LIMITED 500",
    },
    {
      _id: "shoe-3",
      name: "Minimalist Artisan Calfskin Low Sneaker",
      category: "Luxury Casual",
      price: 21999,
      compareAtPrice: 25000,
      image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&auto=format&fit=crop&q=80",
      description: "Italian buttero calf leather, Margom rubber cupsole, and waxed cotton laces hand-stitched in Civitanova Marche, Italy.",
      propulsionTag: "Margom Italian Cupsole",
      heelDrop: "28mm / 6mm Drop",
      weight: "310g",
      energyReturn: "72% Return",
      rating: 4.8,
      reviewCount: 64,
      sizes: ["8", "9", "10", "11", "12"],
      inStock: true,
    },
    {
      _id: "shoe-4",
      name: "TerraGrip All-Weather Vibram Trail Boot",
      category: "Outdoor Trail",
      price: 19499,
      compareAtPrice: 22500,
      image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop&q=80",
      description: "Waterproof ripstop membrane, TPU protective mudguard, and deep 4.5mm multi-directional Vibram Megagrip traction outsole.",
      propulsionTag: "Vibram Megagrip Lug",
      heelDrop: "34mm / 8mm Drop",
      weight: "345g",
      energyReturn: "81% Return",
      rating: 4.9,
      reviewCount: 81,
      sizes: ["8", "8.5", "9", "9.5", "10", "11", "12"],
      inStock: true,
      dropTag: "ALPINE TESTED",
    },
    {
      _id: "shoe-5",
      name: "HyperGhost Nitro Supercritical Speedster",
      category: "Running",
      price: 24999,
      compareAtPrice: 28999,
      image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80",
      description: "Ultra-featherweight mono-mesh upper with dual-density nitrogen foam and high-tensile carbon-weave spine for explosive forward launch.",
      propulsionTag: "Dual Nitro Matrix",
      heelDrop: "40mm / 8mm Drop",
      weight: "172g",
      energyReturn: "92% Return",
      rating: 5.0,
      reviewCount: 52,
      sizes: ["8", "9", "10", "10.5", "11", "12"],
      inStock: true,
      dropTag: "DEADSTOCK RAFFLE",
    },
    {
      _id: "shoe-6",
      name: "Horizon Cyber Chunky Streetwear Sneaker",
      category: "Streetwear",
      price: 16999,
      compareAtPrice: 19500,
      image: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80",
      description: "Architectural chunky midsole geometry with reflective 3M overlays, ballistic Cordura nylon panels, and quick-cinch speed lacing.",
      propulsionTag: "Architectural Geometry",
      heelDrop: "42mm / 12mm Drop",
      weight: "420g",
      energyReturn: "78% Return",
      rating: 4.7,
      reviewCount: 110,
      sizes: ["7", "8", "9", "10", "11"],
      inStock: true,
    },
  ];

  const shoes = products.length > 0 ? products : defaultKicks;

  const brandName =
    business?.businessName ||
    business?.name ||
    customization?.heroHeadline ||
    "SOLECRAFT";

  const brandLogo =
    customization?.logo ||
    business?.logo ||
    null;

  const handleAddToCart = (item, size = "US 10") => {
    if (isOutOfStock(item)) {
      toast.error(`Sorry, ${item.name || "silhouette"} is sold out.`);
      return;
    }
    const cartProduct = {
      ...item,
      selectedSize: size,
    };
    dispatch(addToCart({ product: cartProduct, quantity: 1 }));
    toast.success(`${item.name} (${size}) added to Shoebox!`);
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

  // Dynamic Hero Image based on Colorway
  const heroColorways = {
    volt: {
      name: "Volt Lime Carbon",
      accent: "#84CC16",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&auto=format&fit=crop&q=80",
      tagline: "Propulsion 89% Energy Return • 38mm Stack",
    },
    infrared: {
      name: "Infrared Circuit",
      accent: "#F97316",
      image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=900&auto=format&fit=crop&q=80",
      tagline: "Court '85 Vintage Tumbled Leather Edition",
    },
    stealth: {
      name: "Stealth Carbon",
      accent: "#E4E4E7",
      image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=900&auto=format&fit=crop&q=80",
      tagline: "Alpine All-Weather Vibram Megagrip Traction",
    },
    cyan: {
      name: "Hyper-Cyan Nitro",
      accent: "#06B6D4",
      image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=900&auto=format&fit=crop&q=80",
      tagline: "Supercritical Gas Nitrogen Mono-Mesh 172g",
    },
  };

  const currentHero = heroColorways[heroColorway] || heroColorways.volt;

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#09090B] text-zinc-100 selection:bg-lime-400 selection:text-black">
      {/* High-Velocity Navbar */}
      <Navbar
        brandName={brandName}
        brandLogo={brandLogo}
        business={business}
        activePage={activePage}
        setActivePage={setActivePage}
        cartCount={cartCount}
        onOpenCart={() => setCartOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sizeStandard={sizeStandard}
        setSizeStandard={setSizeStandard}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* ================= PAGE 1: DROP HOME ================= */}
        {activePage === "home" && (
          <div className="space-y-20 pb-20">
            {/* ================= DISTINCT SNEAKER HERO SECTION ================= */}
            <section className="relative overflow-hidden border-b border-zinc-800/80 bg-gradient-to-b from-[#131317] via-[#0D0D10] to-[#09090B] py-16 sm:py-24">
              {/* Background Kinetic Grid Pattern */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293712_1px,transparent_1px),linear-gradient(to_bottom,#1f293712_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                {/* Left Column: Kinetic Headlines & Drop Ticker (7 Cols) */}
                <div className="lg:col-span-7 space-y-6">
                  {/* Live Drop Telemetry Pill */}
                  <div className="inline-flex flex-wrap items-center gap-3 px-3.5 py-1.5 rounded-2xl bg-zinc-900/90 border border-zinc-700/80 backdrop-blur-md font-mono text-xs shadow-lg">
                    <div className="flex items-center gap-1.5 text-lime-400 font-bold">
                      <span className="w-2 h-2 rounded-full bg-lime-400 animate-ping" />
                      <Flame size={14} className="fill-lime-400" />
                      <span>NEXT DEADSTOCK DROP IN:</span>
                    </div>

                    {/* Live Ticker Clock */}
                    <div className="flex items-center gap-1 text-white font-black bg-black px-2.5 py-1 rounded-lg border border-zinc-800 tracking-wider">
                      <span>{String(dropTime.hours).padStart(2, "0")}h</span>
                      <span className="text-lime-400">:</span>
                      <span>{String(dropTime.minutes).padStart(2, "0")}m</span>
                      <span className="text-lime-400">:</span>
                      <span>{String(dropTime.seconds).padStart(2, "0")}s</span>
                      <span className="text-lime-400">:</span>
                      <span className="text-lime-400 w-5 text-left">{String(dropTime.ms).padStart(2, "0")}</span>
                    </div>
                  </div>

                  {/* Velocity Headline */}
                  <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white font-mono leading-[0.95]">
                    Engineered <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 via-emerald-300 to-lime-500">
                      For Velocity.
                    </span>
                    <br />
                    <span className="text-zinc-500 text-3xl sm:text-5xl lg:text-6xl">
                      Born in the Vault.
                    </span>
                  </h1>

                  <p className="text-xs sm:text-sm text-zinc-400 max-w-xl leading-relaxed font-sans font-normal">
                    {customization?.heroSubheadline ||
                      "Proprietary supercritical nitrogen-infused foam coupled with full-length curved carbon spring plates. Tuned in our Brooklyn laboratory for elite marathoners and street collectors."}
                  </p>

                  {/* Telemetry Metrics Bar */}
                  <div className="grid grid-cols-3 gap-3 max-w-lg font-mono text-xs pt-2">
                    <div className="p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800">
                      <span className="text-[10px] text-zinc-500 uppercase block">Energy Return</span>
                      <span className="text-base font-black text-lime-400">89.4%</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800">
                      <span className="text-[10px] text-zinc-500 uppercase block">Plate Tech</span>
                      <span className="text-base font-black text-white">Full Carbon</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800">
                      <span className="text-[10px] text-zinc-500 uppercase block">Chassis Weight</span>
                      <span className="text-base font-black text-white">184g</span>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-wrap gap-4 pt-3 font-mono text-xs">
                    <button
                      onClick={() => setActivePage("sneaker-vault")}
                      className="px-8 py-4 bg-gradient-to-r from-lime-400 to-lime-500 hover:from-lime-300 hover:to-lime-400 text-black font-black uppercase tracking-wider rounded-2xl transition-all shadow-xl shadow-lime-500/20 hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2.5"
                    >
                      <Zap size={18} className="fill-black" />
                      <span>Enter Sneaker Vault</span>
                    </button>

                    <button
                      onClick={() => setActivePage("sole-tech")}
                      className="px-6 py-4 bg-zinc-900/80 hover:bg-zinc-800 text-white font-bold uppercase tracking-wider rounded-2xl border border-zinc-700 transition cursor-pointer flex items-center gap-2"
                    >
                      <Activity size={16} className="text-lime-400" />
                      <span>Propulsion Lab Specs</span>
                    </button>
                  </div>
                </div>

                {/* Right Column: Interactive 3D Sneaker Showcase with Colorway Selector (5 Cols) */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="relative aspect-square rounded-3xl bg-gradient-to-b from-[#18181F] to-[#0E0E12] border border-zinc-700/80 p-8 flex flex-col justify-between overflow-hidden shadow-2xl group">
                    {/* Glowing Motion Blur Halo */}
                    <div className="absolute inset-0 bg-radial-gradient from-lime-500/15 via-transparent to-transparent pointer-events-none" />

                    {/* Top Pill: Colorway Name */}
                    <div className="flex items-center justify-between z-10 font-mono text-[11px]">
                      <span className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-zinc-800 text-white font-bold">
                        COLORWAY: <span className="text-lime-400">{currentHero.name}</span>
                      </span>
                      <span className="bg-lime-500/20 text-lime-400 px-2 py-0.5 rounded text-[10px] font-black border border-lime-500/30">
                        IN VAULT
                      </span>
                    </div>

                    {/* Floating High-Res Sneaker Image with Float Animation */}
                    <div className="relative z-10 w-full aspect-[4/3] flex items-center justify-center py-4">
                      <img
                        src={currentHero.image}
                        alt={currentHero.name}
                        className="w-full h-full object-contain filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.85)] transform group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-700 ease-out"
                      />
                    </div>

                    {/* Colorway Switcher Buttons directly on Hero */}
                    <div className="z-10 pt-4 border-t border-zinc-800 flex items-center justify-between font-mono">
                      <span className="text-[10px] text-zinc-400 uppercase">CHASSIS FINISH:</span>
                      <div className="flex items-center gap-2">
                        {Object.entries(heroColorways).map(([key, val]) => (
                          <button
                            key={key}
                            onClick={() => setHeroColorway(key)}
                            className={`w-7 h-7 rounded-full border-2 transition-all cursor-pointer ${
                              heroColorway === key
                                ? "border-white scale-125 shadow-lg shadow-lime-500/30 ring-2 ring-lime-400/50"
                                : "border-zinc-700 opacity-60 hover:opacity-100"
                            }`}
                            style={{ backgroundColor: val.accent }}
                            title={val.name}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Footnote under Hero Stage */}
                  <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 px-2">
                    <span>⚡ ISO-9001 Deadstock Authenticated</span>
                    <span>Ships in RFID Numbered Box</span>
                  </div>
                </div>
              </div>

              {/* Kinetic Marquee Ticker Strip */}
              <div className="mt-16 border-t border-zinc-800/80 bg-black/80 py-3.5 overflow-hidden">
                <div className="flex items-center gap-8 whitespace-nowrap font-mono font-black text-xs uppercase tracking-widest text-zinc-400 animate-marquee">
                  <span>⚡ NITROGEN SUPERCRITICAL FOAM</span>
                  <span className="text-lime-400">•</span>
                  <span>FULL-LENGTH CURVED CARBON LEVER</span>
                  <span className="text-lime-400">•</span>
                  <span>100% RFID DEADSTOCK NFC VERIFICATION</span>
                  <span className="text-lime-400">•</span>
                  <span>30-DAY STREET RUN ROAD TRIAL</span>
                  <span className="text-lime-400">•</span>
                  <span>VIBRAM MEGAGRIP ALPINE TRACTION</span>
                  <span className="text-lime-400">•</span>
                  <span>FREE CARBON-NEUTRAL EXPRESS RUNNER DISPATCH</span>
                </div>
              </div>
            </section>

            {/* ================= BESTSELLER SILHOUETTES GRID ================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-zinc-800 pb-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-lime-400 uppercase tracking-widest">
                    <Flame size={14} />
                    <span>Trending on the Asphalt</span>
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-black text-white font-mono uppercase tracking-tight mt-1">
                    Hype Silhouettes
                  </h2>
                </div>

                <button
                  onClick={() => setActivePage("sneaker-vault")}
                  className="text-xs font-mono text-lime-400 hover:text-lime-300 font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Explore Complete Vault (6 Silhouettes)</span>
                  <ArrowRight size={14} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {shoes.slice(0, 4).map((kicks) => (
                  <ProductCard
                    key={kicks._id}
                    product={kicks}
                    onSelectProduct={(p) => {
                      setSelectedProduct(p);
                      setActivePage("product-detail");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    onAddToCart={(p, sz) => handleAddToCart(p, sz)}
                    sizeStandard={sizeStandard}
                  />
                ))}
              </div>
            </section>

            {/* ================= INTERACTIVE SOLE LAB & GAIT ANALYZER ================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-gradient-to-r from-[#121216] via-[#16161D] to-[#121216] rounded-3xl border border-zinc-800 p-8 sm:p-12 space-y-10 relative overflow-hidden shadow-2xl">
                <div className="max-w-2xl space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-500/10 text-lime-400 text-xs font-mono font-bold border border-lime-500/30">
                    <Activity size={14} />
                    <span>BIOMECHANICAL LABORATORY</span>
                  </div>
                  <h3 className="text-2xl sm:text-4xl font-black text-white font-mono uppercase">
                    Anatomy of Explosive Push-Off
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 font-sans leading-relaxed">
                    Compare how our three proprietary sole technologies perform across energy return, impact dampening, and wet pavement grip.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono">
                  {/* Tech 1 */}
                  <div className="p-6 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-4 hover:border-lime-400/50 transition">
                    <div className="w-12 h-12 rounded-xl bg-lime-500/10 text-lime-400 flex items-center justify-center font-bold">
                      <Zap size={24} />
                    </div>
                    <div>
                      <span className="text-[10px] text-lime-400 font-bold uppercase">Layer 01 // Springboard</span>
                      <h4 className="text-base font-bold text-white uppercase">Curved Carbon Spoon Plate</h4>
                    </div>
                    <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                      Custom-molded aerospace carbon fiber running the entire length of the shoe. When your foot flexes, it stores mechanical energy and springs forward, reducing calf exertion by up to 14%.
                    </p>
                    <div className="pt-2 border-t border-zinc-900 flex justify-between text-[11px] text-zinc-300">
                      <span>Efficiency Boost:</span>
                      <span className="text-lime-400 font-black">+4.2% Pace</span>
                    </div>
                  </div>

                  {/* Tech 2 */}
                  <div className="p-6 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-4 hover:border-lime-400/50 transition">
                    <div className="w-12 h-12 rounded-xl bg-lime-500/10 text-lime-400 flex items-center justify-center font-bold">
                      <Sparkles size={24} />
                    </div>
                    <div>
                      <span className="text-[10px] text-lime-400 font-bold uppercase">Layer 02 // Cushioning</span>
                      <h4 className="text-base font-bold text-white uppercase">Supercritical Nitrogen Foam</h4>
                    </div>
                    <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                      Liquid nitrogen is injected at supercritical pressure into molten elastomer beads, creating millions of micro gas pockets. Delivers supreme cloud cushion with zero packing out.
                    </p>
                    <div className="pt-2 border-t border-zinc-900 flex justify-between text-[11px] text-zinc-300">
                      <span>Energy Return:</span>
                      <span className="text-lime-400 font-black">89.4% Elastic</span>
                    </div>
                  </div>

                  {/* Tech 3 */}
                  <div className="p-6 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-4 hover:border-lime-400/50 transition">
                    <div className="w-12 h-12 rounded-xl bg-lime-500/10 text-lime-400 flex items-center justify-center font-bold">
                      <ShieldCheck size={24} />
                    </div>
                    <div>
                      <span className="text-[10px] text-lime-400 font-bold uppercase">Layer 03 // Traction</span>
                      <h4 className="text-base font-bold text-white uppercase">Vibram Megagrip Rubber</h4>
                    </div>
                    <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                      Formulated in Italy with alpine rock compound. 4.5mm chevron lugs cut through standing rainwater on city streets and provide supreme braking grip on downhill trails.
                    </p>
                    <div className="pt-2 border-t border-zinc-900 flex justify-between text-[11px] text-zinc-300">
                      <span>Wet Friction Index:</span>
                      <span className="text-lime-400 font-black">0.82 µ (Lab Max)</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-zinc-800 text-xs font-mono">
                  <span className="text-zinc-400">
                    Want an exact biomechanical match for your marathon distance or court game?
                  </span>
                  <button
                    onClick={() => setActivePage("sole-tech")}
                    className="px-6 py-2.5 rounded-xl bg-lime-400 text-black font-black uppercase tracking-wider hover:bg-lime-300 transition cursor-pointer"
                  >
                    View Complete Lab Telemetry
                  </button>
                </div>
              </div>
            </section>

            {/* ================= RFID AUTHENTICITY PROTOCOL BANNER ================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-zinc-950 rounded-3xl border border-zinc-800 p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-lime-500/10 text-lime-400 flex items-center justify-center shrink-0 border border-lime-500/20">
                    <ShieldCheck size={28} />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-lime-400 font-bold uppercase tracking-widest">
                      Zero Counterfeit Tolerance
                    </span>
                    <h4 className="text-xl sm:text-2xl font-black text-white font-mono uppercase">
                      The SoleCraft Tamper-Proof NFC Tag
                    </h4>
                    <p className="text-xs text-zinc-400 max-w-xl font-sans leading-relaxed">
                      Tap your smartphone against the green eyelet tag on delivery. Instantly verify the individual serial number, production batch, and laboratory inspector sign-off on the public ledger.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActivePage("authenticity-guarantee")}
                  className="px-6 py-3.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white hover:text-lime-400 hover:border-lime-400 transition font-mono font-bold text-xs uppercase tracking-wider cursor-pointer whitespace-nowrap"
                >
                  Verify Tag Protocol →
                </button>
              </div>
            </section>
          </div>
        )}

        {/* ================= PAGE 2: SNEAKER VAULT CATALOG ================= */}
        {activePage === "sneaker-vault" && (
          <Product
            products={shoes}
            onSelectProduct={(p) => {
              setSelectedProduct(p);
              setActivePage("product-detail");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onAddToCart={(p, sz) => handleAddToCart(p, sz)}
            sizeStandard={sizeStandard}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}

        {/* ================= PAGE 3: DROPS CALENDAR ================= */}
        {activePage === "drops-calendar" && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 font-sans">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-500/10 text-lime-400 text-xs font-mono font-bold border border-lime-500/30">
                <Clock size={14} />
                <span>RELEASE TIMELINE</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white font-mono uppercase tracking-tight">
                Upcoming Sneaker Drops
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400">
                Deadstock releases are strictly limited. Set SMS & push drop reminders or enter the verified member raffle below.
              </p>
            </div>

            <div className="space-y-4 font-mono text-xs">
              {[
                {
                  id: "drop-1",
                  title: "AeroPulse Carbon 'Neon Ghost Edition'",
                  category: "Carbon Marathon Series",
                  dropDate: "September 12, 10:00 AM EST",
                  price: "₹19,999",
                  edition: "Limited 500 Numbered Pairs",
                  status: "Raffle Open",
                  image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop&q=80",
                },
                {
                  id: "drop-2",
                  title: "Civitanova Low 'Pecan Tumbled Suede'",
                  category: "Italian Artisan Atelier",
                  dropDate: "September 18, 12:00 PM EST",
                  price: "₹23,499",
                  edition: "Handcrafted in Civitanova Marche",
                  status: "Notify Me",
                  image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&auto=format&fit=crop&q=80",
                },
                {
                  id: "drop-3",
                  title: "Retro High 85 'Shadow Obsidian'",
                  category: "Court Heritage Box Set",
                  dropDate: "October 01, 10:00 AM EST",
                  price: "₹16,499",
                  edition: "Deluxe Collector Wooden Shoebox",
                  status: "Coming Soon",
                  image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=400&auto=format&fit=crop&q=80",
                },
              ].map((drop) => (
                <div
                  key={drop.id}
                  className="p-6 rounded-3xl bg-zinc-900/80 border border-zinc-800 hover:border-lime-500/50 transition flex flex-col sm:flex-row items-center justify-between gap-6"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-zinc-950 overflow-hidden border border-zinc-800 shrink-0">
                      <img src={drop.image} alt={drop.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="space-y-1 text-center sm:text-left">
                      <span className="text-[10px] text-lime-400 font-bold block">RELEASE: {drop.dropDate}</span>
                      <h3 className="text-base font-bold text-white uppercase">{drop.title}</h3>
                      <p className="text-zinc-500 text-[11px]">{drop.edition} • {drop.category}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-lg font-black text-white">{drop.price}</span>
                    <button
                      onClick={() => toast.success(`Drop alert set for ${drop.title}!`)}
                      className="px-5 py-2.5 bg-lime-400 hover:bg-lime-300 text-black font-black uppercase text-xs rounded-xl transition cursor-pointer"
                    >
                      {drop.status}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= PAGE 4: SOLE TECH LABORATORY ================= */}
        {activePage === "sole-tech" && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 font-sans">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-500/10 text-lime-400 text-xs font-mono font-bold border border-lime-500/30">
                <Activity size={14} />
                <span>BIOMECHANICAL LAB</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white font-mono uppercase tracking-tight">
                Propulsion & Materials
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400">
                Independent kinetic force plate testing records up to 89.4% energy rebound compared to standard EVA foam.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-mono text-xs">
              <div className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4">
                <Zap size={32} className="text-lime-400" />
                <h3 className="text-xl font-black text-white uppercase">The Spoon-Shaped Carbon Lever</h3>
                <p className="text-zinc-400 font-sans text-xs leading-relaxed">
                  Unlike flat carbon plates that increase ankle stiffness, our spooned geometry arches downward in the midfoot and swoops upward at the metatarsal heads. This creates a catapult effect that guides your foot effortlessly into the next stride cycle.
                </p>
                <div className="p-4 rounded-xl bg-black border border-zinc-800 space-y-2">
                  <span className="text-[10px] text-lime-400 font-bold block uppercase">Biomechanic Metric:</span>
                  <span className="text-white text-xs block">Torque reduction on Achilles tendon: -18%</span>
                </div>
              </div>

              <div className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4">
                <Sparkles size={32} className="text-lime-400" />
                <h3 className="text-xl font-black text-white uppercase">Supercritical Gas Microcellular Foam</h3>
                <p className="text-zinc-400 font-sans text-xs leading-relaxed">
                  Rather than chemical blowing agents that leave irregular voids, supercritical nitrogen infuses uniform microscopic spherical bubbles. The foam retains 96% of its resilience even after 600 miles of asphalt pounding.
                </p>
                <div className="p-4 rounded-xl bg-black border border-zinc-800 space-y-2">
                  <span className="text-[10px] text-lime-400 font-bold block uppercase">Fatigue Resistance:</span>
                  <span className="text-white text-xs block">600+ Miles without packing out</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= PAGE 5: AUTHENTICITY GUARANTEE ================= */}
        {activePage === "authenticity-guarantee" && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10 font-sans">
            <div className="text-center space-y-3 max-w-xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-500/10 text-lime-400 text-xs font-mono font-bold border border-lime-500/30">
                <ShieldCheck size={14} />
                <span>100% DEADSTOCK PROTOCOL</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white font-mono uppercase">
                The SoleCraft NFC Guarantee
              </h1>
              <p className="text-xs text-zinc-400 font-sans">
                Every sneaker is physically audited under blacklight and equipped with our encrypted NFC tamper-seal.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-6 font-mono text-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-black border border-zinc-800 space-y-2">
                  <span className="text-lime-400 font-bold uppercase block text-[11px]">01 // UV Blacklight</span>
                  <p className="text-zinc-400 text-[11px] font-sans">Factory glue line inspection, watermark verification, and invisible barcode audit.</p>
                </div>
                <div className="p-4 rounded-2xl bg-black border border-zinc-800 space-y-2">
                  <span className="text-lime-400 font-bold uppercase block text-[11px]">02 // Stitch Gauge</span>
                  <p className="text-zinc-400 text-[11px] font-sans">Precision 12-stitch-per-inch tension matching against authentic master archives.</p>
                </div>
                <div className="p-4 rounded-2xl bg-black border border-zinc-800 space-y-2">
                  <span className="text-lime-400 font-bold uppercase block text-[11px]">03 // NFC Tamper Tag</span>
                  <p className="text-zinc-400 text-[11px] font-sans">Encrypted RFID eyelet tag that breaks if removed. Scan with any phone for instant pedigree.</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-lime-500/10 border border-lime-500/30 flex items-center justify-between text-zinc-200">
                <div>
                  <span className="font-bold text-lime-400 block text-xs">200% Counterfeit Money-Back Pledge</span>
                  <span className="text-[11px] text-zinc-400">If any sneaker fails authentication, we refund 200% of the purchase price instantly.</span>
                </div>
                <Award size={28} className="text-lime-400 shrink-0" />
              </div>
            </div>
          </div>
        )}

        {/* ================= PAGE 6: OFFERS ================= */}
        {activePage === "offers" && (
          <Offer
            offers={offers}
            onShopVault={() => {
              setActivePage("sneaker-vault");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        )}

        {/* ================= PAGE 7: PRODUCT DETAIL ================= */}
        {activePage === "product-detail" && selectedProduct && (
          <ProductDetails
            product={selectedProduct}
            onBack={() => {
              setActivePage("sneaker-vault");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onAddToCart={(p, q) => handleAddToCart(p, p.selectedSize || "US 10")}
            relatedProducts={shoes}
            onSelectProduct={(p) => {
              setSelectedProduct(p);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            sizeStandard={sizeStandard}
          />
        )}
      </main>

      {/* Bespoke Footwear Lab Footer */}
      <Footer
        brandName={brandName}
        brandLogo={brandLogo}
        business={business}
        setActivePage={setActivePage}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
        themeColors={{ primary: "#84CC16" }}
      />
    </div>
  );
}
