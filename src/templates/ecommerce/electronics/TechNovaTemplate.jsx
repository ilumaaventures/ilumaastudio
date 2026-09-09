import React, { useState, useMemo, useEffect } from "react";
import {
  Cpu,
  Zap,
  ShieldCheck,
  RotateCcw,
  Star,
  Search,
  ShoppingCart,
  SlidersHorizontal,
  ChevronRight,
  ChevronLeft,
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
  Clock,
  CheckCircle2,
  Tv,
  Gamepad2,
  Laptop,
  Headphones,
  Camera,
  Layers,
  Flame,
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

// Modular Components
import Navbar from "./Navbar";
import Footer from "./Footer";
import ProductCard from "./ProductCard";
import Product from "./Product";
import ProductDetails from "./ProductDetails";
import Offer from "./Offer";

export default function TechNovaTemplate({
  business = {},
  products = [],
  categories = [],
  offers = [],
  reviews = [],
  customization = {},
}) {
  // Navigation: "home" | "specs" | "compare" | "offers" | "product-detail"
  const [activePage, setActivePage] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);

  // Search & Filtering
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Comparison Matrix List
  const [compareList, setCompareList] = useState([]);

  // Top Week Deal Tab State
  const [activeDealTab, setActiveDealTab] = useState("gamepad");

  // Warehouse Cleaning Discount Filter State
  const [warehouseDiscount, setWarehouseDiscount] = useState("80");

  // Carousel Indexes
  const [warehouseIndex, setWarehouseIndex] = useState(0);
  const [trendingIndex, setTrendingIndex] = useState(0);
  const [popularIndex, setPopularIndex] = useState(0);
  const [laptopsIndex, setLaptopsIndex] = useState(0);

  // Limited Week Deal Live Countdown (Hours, Mins, Secs)
  const [dealCountdown, setDealCountdown] = useState({
    days: 3,
    hours: 14,
    minutes: 36,
    seconds: 42,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setDealCountdown((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0)
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0)
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return {
          days: prev.days > 0 ? prev.days - 1 : 0,
          hours: 23,
          minutes: 59,
          seconds: 59,
        };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart?.cartItems || []);

  // Products matching the exact attached reference screenshot
  const defaultTech = [
    {
      _id: "el-1",
      name: "Universal Headphones Case in Black",
      category: "Accessories, Headphones",
      price: 150.0,
      compareAtPrice: 180.0,
      rating: 4.9,
      reviewCount: 42,
      badge: "In Stock",
      image:
        "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80",
      description:
        "Rigid shockproof ballistic nylon travel case compatible with premium over-ear headphones.",
      inStock: true,
      specs: [
        "Ballistic Nylon",
        "Shockproof Core",
        "Water Resistant",
        "YKK Zippers",
      ],
    },
    {
      _id: "el-2",
      name: "Headphones USB Wires",
      category: "Accessories, Headphones",
      price: 50.0,
      compareAtPrice: 65.0,
      rating: 4.8,
      reviewCount: 28,
      badge: "OEM Cable",
      image:
        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80",
      description:
        "Oxygen-free copper braided audiophile 3.5mm to USB-C audio cable with 24k gold plating.",
      inStock: true,
      specs: [
        "Oxygen-Free Copper",
        "Gold-Plated 3.5mm",
        "DAC Built-In",
        "1.5m Length",
      ],
    },
    {
      _id: "el-3",
      name: "Ultra Wireless 350 Headphones 350 with",
      category: "Accessories, Headphones",
      price: 350.0,
      compareAtPrice: 420.0,
      rating: 4.9,
      reviewCount: 164,
      badge: "Hi-Res Audio",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
      description:
        "Rose gold metallic studio cans with hybrid active noise cancellation and 50-hour continuous playback.",
      inStock: true,
      specs: [
        "40mm Titanium Drivers",
        "Hybrid ANC",
        "50hr Battery",
        "Memory Foam Pads",
      ],
    },
    {
      _id: "el-4",
      name: "Game Console Controller + USB 3.0 Cable",
      category: "Game Consoles, Video Games",
      price: 90.0,
      compareAtPrice: 130.0,
      rating: 5.0,
      reviewCount: 310,
      badge: "-30% OFF",
      image:
        "https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=600&auto=format&fit=crop&q=80",
      description:
        "Ergonomic wireless gamepad with textured grips, haptic trigger feedback, and ultra-fast 1ms latency.",
      inStock: true,
      specs: [
        "Haptic Triggers",
        "1ms Latency",
        "Bluetooth & 2.4GHz",
        "40hr Battery",
      ],
    },
    {
      _id: "el-5",
      name: "Wireless Audio System Multiroom 360",
      category: "Audio Systems, TV & Audio",
      price: 2299.0,
      compareAtPrice: 2600.0,
      rating: 4.9,
      reviewCount: 84,
      badge: "Audiophile Tier",
      image:
        "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80",
      description:
        "Omnidirectional spatial acoustic pillar speaker with integrated dual passive radiators and AirPlay 2.",
      inStock: true,
      specs: [
        "360° Spatial Audio",
        "Dual Subwoofers",
        "WiFi & AirPlay 2",
        "Lossless 24-bit",
      ],
    },
    {
      _id: "el-6",
      name: "Tablet White EliteBook Revolve X10 G2",
      category: "Laptops, Laptops & Computers",
      price: 1300.0,
      compareAtPrice: 1550.0,
      rating: 4.8,
      reviewCount: 76,
      badge: "2-in-1 Hybrid",
      image:
        "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80",
      description:
        "Reversible 360-degree touchscreen convertible ultrabook with Corning Gorilla Glass and Intel Core i7.",
      inStock: true,
      specs: [
        "Intel Core i7",
        "16GB LPDDR5",
        "512GB NVMe SSD",
        '14" Touch IPS',
      ],
    },
    {
      _id: "el-7",
      name: "Purple Solo 2 Wireless On-Ear Headphones",
      category: "Accessories, Headphones",
      price: 248.0,
      compareAtPrice: 299.0,
      rating: 4.8,
      reviewCount: 92,
      badge: "Wireless Solo",
      image:
        "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&auto=format&fit=crop&q=80",
      description:
        "Streamlined folding acoustic headset delivering punchy bass, crisp highs, and quick charging.",
      inStock: true,
      specs: [
        "Dynamic Bass",
        "Fast Fuel Charge",
        "Built-In Mic",
        "Folding Design",
      ],
    },
    {
      _id: "el-8",
      name: "Notebook Widescreen Y-700-17 Gaming Laptop",
      category: "Laptops, Computers",
      price: 1299.0,
      compareAtPrice: 1499.0,
      rating: 4.9,
      reviewCount: 114,
      badge: "144Hz Screen",
      image:
        "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&auto=format&fit=crop&q=80",
      description:
        "17.3-inch gaming powerhouse with dedicated NVIDIA RTX graphics and dual vapor-chamber cooling.",
      inStock: true,
      specs: [
        "RTX 4060 8GB",
        "Intel Core i7-13700H",
        '17.3" 144Hz FHD',
        "1TB Gen4 SSD",
      ],
    },
    {
      _id: "el-9",
      name: 'Laptop WiFi C581 2CP 15.6" 6210M',
      category: "Laptops, Workstations",
      price: 2299.0,
      compareAtPrice: 2500.0,
      rating: 5.0,
      reviewCount: 52,
      badge: "Pro Workstation",
      image:
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80",
      description:
        "Precision aluminum mobile workstation with 100% DCI-P3 color gamut display and liquid metal cooling.",
      inStock: true,
      specs: [
        "Apple Silicon / M-Series",
        "32GB Unified Memory",
        "1TB SSD",
        "Liquid Retina XDR",
      ],
    },
    {
      _id: "el-10",
      name: "Laptop Screener CX70 2QF-621XPL",
      category: "Laptops, Creator Studio",
      price: 2399.0,
      compareAtPrice: 2700.0,
      rating: 4.9,
      reviewCount: 68,
      badge: "OLED Creator",
      image:
        "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600&auto=format&fit=crop&q=80",
      description:
        "Ultra-thin 4K OLED creator laptop with factory color calibration and Thunderbolt 4 connectivity.",
      inStock: true,
      specs: [
        "Intel Core i9",
        "32GB DDR5",
        "4K OLED Display",
        "2TB NVMe PCIe 4.0",
      ],
    },
    {
      _id: "el-11",
      name: "Aerocool EN52277 Dead Silence Gaming PC Tower",
      category: "Computer Cases, Hardware",
      price: 150.0,
      compareAtPrice: 199.0,
      rating: 4.8,
      reviewCount: 88,
      badge: "Acoustic Dampened",
      image:
        "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop&q=80",
      description:
        "Chambered high-airflow desktop chassis with noise-dampening foam panels and magnetic dust filters.",
      inStock: true,
      specs: [
        "Tempered Glass",
        "Sound Dampening Foam",
        "Up to 360mm Radiator",
        "ARGB Sync",
      ],
    },
    {
      _id: "el-12",
      name: "Pendrive USB 3.0 Flash 64 GB",
      category: "Accessories, Storage",
      price: 110.0,
      compareAtPrice: 130.0,
      rating: 4.9,
      reviewCount: 220,
      badge: "USB 3.2 High-Speed",
      image:
        "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?w=600&auto=format&fit=crop&q=80",
      description:
        "Solid zinc alloy waterproof USB 3.0 flash drive with 400MB/s sustained read performance.",
      inStock: true,
      specs: [
        "64GB Solid State",
        "Zinc Alloy Shell",
        "400 MB/s Read",
        "AES 256-Bit Encrypt",
      ],
    },
    {
      _id: "el-13",
      name: "Tablet Red EliteBook Revolve 810 G2",
      category: "Laptops, Hybrid Tablets",
      price: 2100.0,
      compareAtPrice: 2300.0,
      rating: 4.9,
      reviewCount: 45,
      badge: "Executive Touch",
      image:
        "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80",
      description:
        "Military-grade tested 11.6-inch multi-touch revolving display tablet with active stylus pen support.",
      inStock: true,
      specs: [
        "Intel Core i7",
        "16GB RAM",
        "Stylus Pen Included",
        "5G LTE Cellular",
      ],
    },
  ];

  const techCatalog = products.length > 0 ? products : defaultTech;

  const brandName =
    business?.businessName ||
    business?.name ||
    customization?.heroHeadline ||
    "TECHNOVA";
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
  const brandAddress =
    business?.address ||
    business?.registered_business_address ||
    "100 Silicon Way, Austin, TX 78701";

  // Cart operations
  const handleAddToCart = (product, qty = 1) => {
    if (isOutOfStock(product)) {
      toast.error(`Sorry, ${product.name} is currently out of stock!`);
      return;
    }
    dispatch(addToCart({ product, quantity: qty }));
    toast.success(`${product.name} added to cart! 🚀`);
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

  // Compare toggling
  const handleToggleCompare = (product) => {
    const exists = compareList.find(
      (p) => (p._id || p.id) === (product._id || product.id),
    );
    if (exists) {
      setCompareList(
        compareList.filter(
          (p) => (p._id || p.id) !== (product._id || product.id),
        ),
      );
      toast.success(`Removed ${product.name} from comparison.`);
    } else {
      if (compareList.length >= 4) {
        toast.error("You can compare up to 4 devices at once.");
        return;
      }
      setCompareList([...compareList, product]);
      toast.success(`Added ${product.name} to comparison! ⚖️`);
    }
  };

  // Featured Deal Item for Top Tabs
  const featuredDealItem = useMemo(() => {
    switch (activeDealTab) {
      case "tv":
        return {
          title: '55" Ultra HD Curved 4K Smart OLED TV',
          category: "Television Entertainment",
          price: 1199.0,
          originalPrice: 1599.0,
          image:
            "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&auto=format&fit=crop&q=80",
          desc: "120Hz native refresh rate with Quantum Dot OLED illumination and Dolby Vision Atmos.",
        };
      case "console":
        return {
          title: "Next-Gen Cyber Console Pro Edition 1TB",
          category: "Game Consoles & Video Games",
          price: 499.0,
          originalPrice: 599.0,
          image:
            "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&auto=format&fit=crop&q=80",
          desc: "True 4K 120 FPS gaming with ultra-high-speed custom SSD and wireless gamepad.",
        };
      case "laptop":
        return {
          title: "Notebook Widescreen Y-700-17 Gaming Laptop",
          category: "Laptops, Computers",
          price: 1299.0,
          originalPrice: 1499.0,
          image:
            "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=80",
          desc: "17.3-inch gaming powerhouse with dedicated NVIDIA RTX graphics and dual vapor-chamber cooling.",
        };
      case "under10":
        return {
          title: "High-Speed Braided Gold-Plated HDMI 2.1 Cable",
          category: "Accessories, Cables",
          price: 9.99,
          originalPrice: 19.99,
          image:
            "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80",
          desc: "48Gbps ultra-high bandwidth certified 8K@60Hz and 4K@120Hz HDR video transfer.",
        };
      case "gamepad":
      default:
        return {
          title: "Game Console Controller + USB 3.0 Cable",
          category: "Game Consoles, Video Games",
          price: 90.0,
          originalPrice: 130.0,
          image:
            "https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=800&auto=format&fit=crop&q=80",
          desc: "Ergonomic wireless gamepad with textured grips, haptic trigger feedback, and ultra-fast 1ms latency.",
        };
    }
  }, [activeDealTab]);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#FBFDFB] text-slate-800 antialiased selection:bg-yellow-100 selection:text-slate-900">
      {/* ================= 1. NAVBAR ================= */}
      <Navbar
        brandName={brandName}
        brandLogo={customization?.logo || business?.logo || null}
        brandPhone={brandPhone}
        activePage={activePage}
        setActivePage={setActivePage}
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setCartOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        compareCount={compareList.length}
        onOpenCompare={() => setActivePage("compare")}
        onSelectDepartment={(dept) => {
          setSelectedCategory(dept);
          setActivePage("specs");
        }}
      />

      {/* ================= 2. MAIN CONTENT ================= */}
      <main className="flex-1">
        {/* ================= VIEW 1: HOME (MATCHING ATTACHED SCREENSHOT) ================= */}
        {activePage === "home" && (
          <div className="space-y-10 py-6 text-left">
            {/* ================= SECTION 1: TOP LIMITED WEEK DEAL ================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
                {/* Deal Header */}
                <div className="bg-[#F8FAFC] border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#EAB308] animate-ping" />
                    <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                      <span>WEEK DEAL</span>
                      <span className="text-slate-400 font-normal">|</span>
                      <span className="text-xs text-rose-600 font-bold">
                        HURRY UP BEFORE OFFER WILL END
                      </span>
                    </h2>
                  </div>

                  {/* Countdown Timer */}
                  <div className="flex items-center gap-1 text-xs font-bold text-slate-700">
                    <Clock size={14} className="text-[#EAB308]" />
                    <span className="font-mono bg-slate-900 text-yellow-400 px-2 py-0.5 rounded">
                      {dealCountdown.days}d
                    </span>
                    <span>:</span>
                    <span className="font-mono bg-slate-900 text-yellow-400 px-2 py-0.5 rounded">
                      {String(dealCountdown.hours).padStart(2, "0")}h
                    </span>
                    <span>:</span>
                    <span className="font-mono bg-slate-900 text-yellow-400 px-2 py-0.5 rounded">
                      {String(dealCountdown.minutes).padStart(2, "0")}m
                    </span>
                    <span>:</span>
                    <span className="font-mono bg-slate-900 text-yellow-400 px-2 py-0.5 rounded">
                      {String(dealCountdown.seconds).padStart(2, "0")}s
                    </span>
                  </div>
                </div>

                {/* Category Deal Navigation Tabs (Matching Reference) */}
                <div className="border-b border-slate-200 overflow-x-auto">
                  <div className="flex items-center text-xs font-bold uppercase tracking-wider min-w-[680px]">
                    {[
                      { id: "tv", label: "50-INCH TO WATCH IN 4K TVS" },
                      { id: "console", label: "GAME CONSOLES" },
                      { id: "gamepad", label: "LIMITED WEEK DEAL - GAMEPAD" },
                      { id: "laptop", label: "SECOND PRODUCT 50% CHEAPER" },
                      { id: "under10", label: "$10 BUCKS OR LESS" },
                    ].map((tab) => {
                      const isActive = activeDealTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveDealTab(tab.id)}
                          className={`flex-1 py-3.5 px-4 transition cursor-pointer text-center relative border-r border-slate-100 last:border-r-0 ${
                            isActive
                              ? "text-slate-950 font-black bg-white"
                              : "text-slate-500 hover:text-slate-900 bg-slate-50/50 hover:bg-slate-50"
                          }`}
                        >
                          <span>{tab.label}</span>
                          {isActive && (
                            <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#EAB308]" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Deal Showcase Banner */}
                <div className="p-6 sm:p-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-gradient-to-r from-white via-slate-50 to-white">
                  <div className="md:col-span-7 space-y-4">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#EAB308] bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200">
                      {featuredDealItem.category}
                    </span>

                    <h3 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                      {featuredDealItem.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-lg">
                      {featuredDealItem.desc}
                    </p>

                    <div className="flex items-baseline gap-3 pt-2">
                      <span className="text-3xl font-black text-rose-600">
                        ₹{featuredDealItem.price.toFixed(2)}
                      </span>
                      <span className="text-base text-slate-400 line-through">
                        ₹{featuredDealItem.originalPrice.toFixed(2)}
                      </span>
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-lg">
                        Save ₹
                        {(
                          featuredDealItem.originalPrice -
                          featuredDealItem.price
                        ).toFixed(2)}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-3 pt-3">
                      <button
                        onClick={() =>
                          handleAddToCart({
                            _id: `deal-${activeDealTab}`,
                            name: featuredDealItem.title,
                            price: featuredDealItem.price,
                            compareAtPrice: featuredDealItem.originalPrice,
                            image: featuredDealItem.image,
                            category: featuredDealItem.category,
                          })
                        }
                        className="px-8 py-3.5 bg-[#EAB308] hover:bg-yellow-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
                      >
                        <ShoppingCart size={16} />
                        <span>Claim Week Deal</span>
                      </button>

                      <button
                        onClick={() => {
                          setActivePage("specs");
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="px-6 py-3.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer"
                      >
                        View All Deals
                      </button>
                    </div>
                  </div>

                  <div className="md:col-span-5 flex justify-center">
                    <div className="w-72 h-72 sm:w-80 sm:h-80 rounded-3xl overflow-hidden bg-white p-4 border border-slate-200/80 shadow-lg flex items-center justify-center">
                      <img
                        src={featuredDealItem.image}
                        alt={featuredDealItem.title}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ================= SECTION 2: SAVE BIG ON WAREHOUSE CLEANING ================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b-2 border-slate-100 pb-3">
                {/* Yellow Underlined Title */}
                <div className="relative">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                    Save Big on Warehouse Cleaning
                  </h3>
                  <div className="h-1 w-28 bg-[#EAB308] rounded-full mt-1.5" />
                </div>

                {/* Filter discount pills & Section link */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    {["80", "65", "45", "25"].map((pct) => (
                      <button
                        key={pct}
                        onClick={() => setWarehouseDiscount(pct)}
                        className={`px-3 py-1 rounded-full text-xs font-black transition cursor-pointer ${
                          warehouseDiscount === pct
                            ? "bg-[#EAB308] text-slate-950 shadow-xs"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                        }`}
                      >
                        -{pct}% off
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      setActivePage("offers");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="text-xs font-bold text-slate-600 hover:text-sky-600 transition flex items-center gap-1 cursor-pointer"
                  >
                    <span>Go to Daily Deals Section</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>

              {/* Product Grid / Row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                {techCatalog.slice(0, 6).map((item) => (
                  <ProductCard
                    key={item._id || item.id}
                    product={item}
                    onSelectProduct={(p) => {
                      setSelectedProduct(p);
                      setActivePage("product-detail");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    onAddToCart={handleAddToCart}
                    onToggleCompare={handleToggleCompare}
                    isCompared={compareList.some(
                      (c) => (c._id || c.id) === (item._id || item.id),
                    )}
                  />
                ))}
              </div>

              {/* Carousel Pagination Indicator Dots */}
              <div className="flex justify-center items-center gap-1.5 pt-2">
                <span className="w-4 h-1.5 rounded-full bg-[#EAB308]" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
              </div>
            </section>

            {/* ================= SECTION 3: DUAL CATEGORY PROMO BANNERS ================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Banner 1: Cameras */}
                <div className="rounded-3xl bg-[#F8FAFC] border border-slate-200 p-6 sm:p-8 flex items-center justify-between overflow-hidden shadow-2xs group hover:shadow-md transition">
                  <div className="w-36 sm:w-44 h-36 shrink-0">
                    <img
                      src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&auto=format&fit=crop&q=80"
                      alt="Digital Camera"
                      className="w-full h-full object-contain group-hover:scale-105 transition duration-300"
                    />
                  </div>

                  <div className="space-y-2 text-right pl-4">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                      CATCH HOTTEST
                    </span>
                    <h4 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                      DEALS IN CAMERAS CATEGORY
                    </h4>
                    <button
                      onClick={() => {
                        setSelectedCategory("Cameras & Photography");
                        setActivePage("specs");
                      }}
                      className="text-xs font-black text-slate-900 hover:text-sky-600 inline-flex items-center gap-1 transition pt-1 cursor-pointer"
                    >
                      <span>Shop now</span>
                      <span className="w-4 h-4 rounded-full bg-[#EAB308] text-slate-950 flex items-center justify-center text-[10px]">
                        ›
                      </span>
                    </button>
                  </div>
                </div>

                {/* Banner 2: Desktop & Tablets */}
                <div className="rounded-3xl bg-[#F8FAFC] border border-slate-200 p-6 sm:p-8 flex items-center justify-between overflow-hidden shadow-2xs group hover:shadow-md transition">
                  <div className="w-36 sm:w-44 h-36 shrink-0">
                    <img
                      src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400&auto=format&fit=crop&q=80"
                      alt="Gaming PC"
                      className="w-full h-full object-contain group-hover:scale-105 transition duration-300"
                    />
                  </div>

                  <div className="space-y-2 text-right pl-4">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                      TABLETS, SMARTPHONES
                    </span>
                    <h4 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                      AND MORE
                    </h4>
                    <div className="text-xs text-slate-600 font-bold">
                      FROM{" "}
                      <strong className="text-lg text-slate-900 font-black">
                        $749.99
                      </strong>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedCategory("Laptops, Computers");
                        setActivePage("specs");
                      }}
                      className="text-xs font-black text-slate-900 hover:text-sky-600 inline-flex items-center gap-1 transition pt-1 cursor-pointer"
                    >
                      <span>Shop now</span>
                      <span className="w-4 h-4 rounded-full bg-[#EAB308] text-slate-950 flex items-center justify-center text-[10px]">
                        ›
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* ================= SECTION 4: TRENDING PRODUCTS ================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
              <div className="flex items-end justify-between border-b-2 border-slate-100 pb-3">
                <div className="relative">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                    Trending products
                  </h3>
                  <div className="h-1 w-20 bg-[#EAB308] rounded-full mt-1.5" />
                </div>

                <button
                  onClick={() => {
                    setActivePage("specs");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="text-xs font-bold text-slate-600 hover:text-sky-600 transition flex items-center gap-1 cursor-pointer"
                >
                  <span>Go to Trending products</span>
                  <ChevronRight size={14} />
                </button>
              </div>

              {/* Products Row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4">
                {techCatalog.slice(0, 7).map((item) => (
                  <ProductCard
                    key={item._id || item.id}
                    product={item}
                    onSelectProduct={(p) => {
                      setSelectedProduct(p);
                      setActivePage("product-detail");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    onAddToCart={handleAddToCart}
                    onToggleCompare={handleToggleCompare}
                    isCompared={compareList.some(
                      (c) => (c._id || c.id) === (item._id || item.id),
                    )}
                  />
                ))}
              </div>

              {/* Dots */}
              <div className="flex justify-center items-center gap-1.5 pt-2">
                <span className="w-4 h-1.5 rounded-full bg-[#EAB308]" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
              </div>
            </section>

            {/* ================= SECTION 5: POPULAR PRODUCTS ================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
              <div className="flex items-end justify-between border-b-2 border-slate-100 pb-3">
                <div className="relative">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                    Popular Products
                  </h3>
                  <div className="h-1 w-20 bg-[#EAB308] rounded-full mt-1.5" />
                </div>

                <button
                  onClick={() => {
                    setActivePage("specs");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="text-xs font-bold text-slate-600 hover:text-sky-600 transition flex items-center gap-1 cursor-pointer"
                >
                  <span>View All</span>
                  <ChevronRight size={14} />
                </button>
              </div>

              {/* Popular Products Row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4">
                {techCatalog.slice(0, 7).map((item) => (
                  <ProductCard
                    key={`pop-${item._id || item.id}`}
                    product={item}
                    onSelectProduct={(p) => {
                      setSelectedProduct(p);
                      setActivePage("product-detail");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    onAddToCart={handleAddToCart}
                    onToggleCompare={handleToggleCompare}
                    isCompared={compareList.some(
                      (c) => (c._id || c.id) === (item._id || item.id),
                    )}
                  />
                ))}
              </div>

              {/* Dots */}
              <div className="flex justify-center items-center gap-1.5 pt-2">
                <span className="w-4 h-1.5 rounded-full bg-[#EAB308]" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
              </div>
            </section>

            {/* ================= SECTION 6: WIDE TABLET PROMO BANNER ================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="rounded-3xl bg-gradient-to-r from-[#F1F5F9] via-[#F8FAFC] to-[#F1F5F9] border border-slate-200 p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs overflow-hidden">
                <div className="space-y-3 max-w-lg">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                      SHOP AND <span className="text-slate-900">SAVE BIG</span>{" "}
                      ON HOTTEST TABLETS
                    </h3>
                    <span className="px-3 py-1 rounded-xl bg-[#EAB308] text-slate-950 font-black text-xs shadow-xs">
                      STARTING AT $79.99
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Featuring high-density 2K retina screens, active digitizer
                    stylus support, and all-day battery efficiency.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory("Laptops, Hybrid Tablets");
                      setActivePage("specs");
                    }}
                    className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer"
                  >
                    Explore Tablets
                  </button>
                </div>

                <div className="w-64 sm:w-80 h-44 shrink-0 flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80"
                    alt="Tablets"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </section>

            {/* ================= SECTION 7: LAPTOPS & COMPUTERS ================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
              <div className="flex items-end justify-between border-b-2 border-slate-100 pb-3">
                <div className="relative">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                    Laptops & Computers
                  </h3>
                  <div className="h-1 w-24 bg-[#EAB308] rounded-full mt-1.5" />
                </div>

                <button
                  onClick={() => {
                    setSelectedCategory("Laptops, Computers");
                    setActivePage("specs");
                  }}
                  className="text-xs font-bold text-slate-600 hover:text-sky-600 transition flex items-center gap-1 cursor-pointer"
                >
                  <span>View All Laptops</span>
                  <ChevronRight size={14} />
                </button>
              </div>

              {/* Laptops Row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4">
                {techCatalog.slice(5, 12).map((item) => (
                  <ProductCard
                    key={`lap-${item._id || item.id}`}
                    product={item}
                    onSelectProduct={(p) => {
                      setSelectedProduct(p);
                      setActivePage("product-detail");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    onAddToCart={handleAddToCart}
                    onToggleCompare={handleToggleCompare}
                    isCompared={compareList.some(
                      (c) => (c._id || c.id) === (item._id || item.id),
                    )}
                  />
                ))}
              </div>

              {/* Dots */}
              <div className="flex justify-center items-center gap-1.5 pt-2">
                <span className="w-4 h-1.5 rounded-full bg-[#EAB308]" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
              </div>
            </section>

            {/* ================= SECTION 8: TELEVISION ENTERTAINMENT ================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
              <div className="flex items-end justify-between border-b-2 border-slate-100 pb-3">
                <div className="relative flex items-center gap-2">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                    Television Entertainment
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-md bg-[#EAB308] text-slate-950 font-black text-[10px]">
                    Top 20
                  </span>
                </div>

                <button
                  onClick={() => {
                    setSelectedCategory("Audio Systems, TV & Audio");
                    setActivePage("specs");
                  }}
                  className="text-xs font-bold text-slate-600 hover:text-sky-600 transition flex items-center gap-1 cursor-pointer"
                >
                  <span>View All Home Cinema</span>
                  <ChevronRight size={14} />
                </button>
              </div>

              {/* TV & Audio Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  {
                    name: '4K Ultra HD Smart OLED Curved TV 55"',
                    price: 1199.0,
                    compareAtPrice: 1599.0,
                    category: "Audio Systems, TV & Audio",
                    image:
                      "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=600&auto=format&fit=crop&q=80",
                  },
                  {
                    name: "Wireless Audio System Multiroom 360",
                    price: 2299.0,
                    compareAtPrice: 2600.0,
                    category: "Audio Systems, TV & Audio",
                    image:
                      "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80",
                  },
                  {
                    name: "Dolby Atmos Wireless Subwoofer Soundbar",
                    price: 499.0,
                    compareAtPrice: 650.0,
                    category: "Audio Systems, TV & Audio",
                    image:
                      "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80",
                  },
                  {
                    name: "Ultra 4K Laser Cinema Home Projector",
                    price: 1899.0,
                    compareAtPrice: 2200.0,
                    category: "Audio Systems, TV & Audio",
                    image:
                      "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=600&auto=format&fit=crop&q=80",
                  },
                ].map((tv, idx) => (
                  <ProductCard
                    key={`tv-${idx}`}
                    product={{
                      ...tv,
                      _id: `tv-${idx}`,
                      rating: 4.9,
                      reviewCount: 65,
                    }}
                    onSelectProduct={(p) => {
                      setSelectedProduct(p);
                      setActivePage("product-detail");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    onAddToCart={handleAddToCart}
                    onToggleCompare={handleToggleCompare}
                  />
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ================= VIEW 2: HARDWARE SPECS CATALOG ================= */}
        {activePage === "specs" && (
          <Product
            products={techCatalog}
            onSelectProduct={(p) => {
              setSelectedProduct(p);
              setActivePage("product-detail");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onAddToCart={handleAddToCart}
            compareList={compareList}
            onToggleCompare={handleToggleCompare}
            onOpenCompareMatrix={() => setActivePage("compare")}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        )}

        {/* ================= VIEW 3: COMPARISON MATRIX ================= */}
        {activePage === "compare" && (
          <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 text-left">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  Hardware Comparison Matrix
                </h2>
                <p className="text-xs text-slate-500">
                  Side-by-side technical evaluation of selected devices.
                </p>
              </div>
              <button
                onClick={() => setCompareList([])}
                className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
              >
                Clear All
              </button>
            </div>

            {compareList.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
                <SlidersHorizontal
                  size={36}
                  className="mx-auto text-slate-300"
                />
                <h3 className="text-base font-bold text-slate-700">
                  No devices added to comparison
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Click the slider icon on any product card in the store to add
                  it to this comparison matrix.
                </p>
                <button
                  onClick={() => setActivePage("specs")}
                  className="px-6 py-2.5 rounded-xl bg-[#EAB308] text-slate-950 font-bold text-xs"
                >
                  Browse Catalog
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto bg-white rounded-3xl border border-slate-200 shadow-sm">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="p-4 font-bold text-slate-500 uppercase w-48">
                        Spec
                      </th>
                      {compareList.map((p) => (
                        <th
                          key={p._id || p.id}
                          className="p-4 font-black text-slate-900 min-w-[200px]"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span>{p.name}</span>
                            <button
                              onClick={() => handleToggleCompare(p)}
                              className="text-slate-400 hover:text-rose-600 p-1"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-4 font-bold text-slate-500">
                        Product Image
                      </td>
                      {compareList.map((p) => (
                        <td key={p._id || p.id} className="p-4">
                          <img
                            src={getProductImage(p, p.image)}
                            alt={p.name}
                            className="w-24 h-24 object-contain rounded-lg border border-slate-100 p-1"
                          />
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-4 font-bold text-slate-500">Price</td>
                      {compareList.map((p) => (
                        <td
                          key={p._id || p.id}
                          className="p-4 font-black text-base text-slate-900"
                        >
                          ${Number(p.price).toFixed(2)}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-4 font-bold text-slate-500">Category</td>
                      {compareList.map((p) => (
                        <td
                          key={p._id || p.id}
                          className="p-4 text-slate-700 font-semibold"
                        >
                          {p.category}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-4 font-bold text-slate-500">Rating</td>
                      {compareList.map((p) => (
                        <td
                          key={p._id || p.id}
                          className="p-4 font-semibold text-slate-700"
                        >
                          ★ {p.rating || "4.9"} ({p.reviewCount || 36} reviews)
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-4 font-bold text-slate-500">
                        Hardware Features
                      </td>
                      {compareList.map((p) => (
                        <td key={p._id || p.id} className="p-4 text-slate-600">
                          {p.specs
                            ? p.specs.join(" • ")
                            : "OEM Certified Silicon"}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-4 font-bold text-slate-500">Action</td>
                      {compareList.map((p) => (
                        <td key={p._id || p.id} className="p-4">
                          <button
                            onClick={() => handleAddToCart(p)}
                            className="w-full py-2 px-3 bg-[#EAB308] hover:bg-yellow-500 text-slate-950 font-bold rounded-xl transition text-xs"
                          >
                            Add to Cart
                          </button>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ================= VIEW 4: WAREHOUSE DEALS ================= */}
        {activePage === "offers" && (
          <Offer
            products={techCatalog}
            onSelectProduct={(p) => {
              setSelectedProduct(p);
              setActivePage("product-detail");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onAddToCart={handleAddToCart}
          />
        )}

        {/* ================= VIEW 5: PRODUCT DETAILS ================= */}
        {activePage === "product-detail" && selectedProduct && (
          <ProductDetails
            product={selectedProduct}
            onBack={() => {
              setActivePage("specs");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onAddToCart={handleAddToCart}
            relatedProducts={techCatalog}
            onSelectProduct={(p) => {
              setSelectedProduct(p);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onToggleCompare={handleToggleCompare}
            isCompared={compareList.some(
              (c) =>
                (c._id || c.id) === (selectedProduct._id || selectedProduct.id),
            )}
          />
        )}
      </main>

      {/* ================= 3. FOOTER ================= */}
      <Footer
        brandName={brandName}
        brandPhone={brandPhone}
        brandEmail={brandEmail}
        brandAddress={brandAddress}
        setActivePage={setActivePage}
      />

      {/* ================= 4. CART DRAWER ================= */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
        themeColors={{ primary: "#EAB308" }}
      />
    </div>
  );
}
