import React, { useState, useMemo } from "react";
import {
  Layers,
  Compass,
  Truck,
  ShieldCheck,
  ShoppingBag,
  Star,
  Check,
  ArrowRight,
  Eye,
  MapPin,
  Calendar,
  X,
  Search,
  Sparkles,
  Sliders,
  Maximize2,
  Box,
  Palette,
  Phone,
  Mail,
  CheckCircle2,
  Info,
  ChevronRight,
  Heart,
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
import { isOutOfStock, getProductStock } from "../../../utils/stockUtils";
import CartDrawer from "../../common/CartDrawer";
import ProductDetailsPage from "../../common/ProductDetailsPage";
import { getProductImage } from "../../../utils/productImage";

export default function CasaLivingTemplate({
  business = {},
  products = [],
  categories = [],
  offers = [],
  reviews = [],
  customization = {},
}) {
  // Navigation: "home" | "rooms" | "swatches" | "fit-calculator" | "delivery" | "product-detail"
  const [activePage, setActivePage] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);

  // Filters & Catalog
  const [selectedRoom, setSelectedRoom] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");

  // Interactive Swatch Box Studio
  const [selectedSwatches, setSelectedSwatches] = useState(["boucle-cream", "oak-natural"]);
  const [swatchName, setSwatchName] = useState("");
  const [swatchEmail, setSwatchEmail] = useState("");
  const [swatchAddress, setSwatchAddress] = useState("");
  const [swatchOrdered, setSwatchOrdered] = useState(false);

  // Interactive Room Fit Calculator State
  const [roomLengthFt, setRoomLengthFt] = useState(16);
  const [roomWidthFt, setRoomWidthFt] = useState(14);
  const [selectedFurnitureType, setSelectedFurnitureType] = useState("sectional");

  // Quick View Configurator State
  const [selectedWoodFinish, setSelectedWoodFinish] = useState("oak");
  const [selectedUpholstery, setSelectedUpholstery] = useState("boucle");
  const [includeAssembly, setIncludeAssembly] = useState(true);

  // White Glove Delivery Checker
  const [pincode, setPincode] = useState("");
  const [deliveryResult, setDeliveryResult] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart?.cartItems || []);

  const fallbackFurniture = [
    {
      _id: "cl-1",
      name: "Nordic Modular Linen Sectional Sofa",
      room: "Living Room",
      category: "Sofas & Seating",
      price: 1850.0,
      compareAtPrice: 2200.0,
      rating: 4.9,
      reviewCount: 92,
      badge: "Architectural Icon",
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&auto=format&fit=crop&q=80",
      images: [
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=900&auto=format&fit=crop&q=80",
      ],
      materials: "Belgian washed linen, Kiln-dried FSC beech wood, Feather blend",
      dimensions: "110\" W × 68\" D × 31\" H",
      leadTime: "In Stock • Ships in 3-5 days",
      description: "Generously proportioned modular sofa offering cloud-like comfort with a refined European architectural silhouette.",
      inStock: true,
    },
    {
      _id: "cl-2",
      name: "Solid White Oak Minimalist Dining Table",
      room: "Dining Suite",
      category: "Dining Tables",
      price: 1120.0,
      compareAtPrice: 1350.0,
      rating: 5.0,
      reviewCount: 64,
      badge: "Hand-Joined",
      image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=900&auto=format&fit=crop&q=80",
      images: [
        "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=900&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?w=900&auto=format&fit=crop&q=80",
      ],
      materials: "100% Solid American White Oak, Non-toxic matte wax oil",
      dimensions: "84\" L × 38\" W × 30\" H (Seats 8)",
      leadTime: "Ready for White-Glove Dispatch",
      description: "Seamless plank joinery celebrating natural wood grain, pillowed soft edges, and sturdy mortise-and-tenon legs.",
      inStock: true,
    },
    {
      _id: "cl-3",
      name: "Kyoto Sculptural Bouclé Accent Lounge Chair",
      room: "Living Room",
      category: "Chairs & Benches",
      price: 680.0,
      compareAtPrice: 820.0,
      rating: 4.8,
      reviewCount: 48,
      badge: "Curator's Choice",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&auto=format&fit=crop&q=80",
      images: [
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&auto=format&fit=crop&q=80",
      ],
      materials: "High-texture Italian wool bouclé, Ebonized solid ash legs",
      dimensions: "34\" W × 33\" D × 29\" H",
      leadTime: "In Stock • Express Delivery",
      description: "A sensual curved cocoon seat designed for contemplative reading corners, master suites, and gallery spaces.",
      inStock: true,
    },
    {
      _id: "cl-4",
      name: "Copenhagen Fluted Oak Low Credenza",
      room: "Dining Suite",
      category: "Storage & Credenzas",
      price: 1450.0,
      compareAtPrice: 1750.0,
      rating: 4.9,
      reviewCount: 31,
      badge: "Acoustic Slats",
      image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=900&auto=format&fit=crop&q=80",
      images: [
        "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=900&auto=format&fit=crop&q=80",
      ],
      materials: "Solid oak fluted tambour doors, Brass soft-close hardware",
      dimensions: "72\" W × 19\" D × 27\" H",
      leadTime: "Ships in 1-2 Weeks",
      description: "Continuous tambour wood slats conceal media devices and soundbars while allowing infrared remotes to pass seamlessly.",
      inStock: true,
    },
    {
      _id: "cl-5",
      name: "Sorrento Upholstered Platform Bed Sanctuary",
      room: "Master Bedroom",
      category: "Beds & Nightstands",
      price: 1680.0,
      compareAtPrice: 1980.0,
      rating: 5.0,
      reviewCount: 57,
      badge: "Master Suite",
      image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900&auto=format&fit=crop&q=80",
      images: [
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900&auto=format&fit=crop&q=80",
      ],
      materials: "Textured oatmeal weave, Solid pine slat suspension",
      dimensions: "82\" W × 90\" L × 44\" H (King)",
      leadTime: "White Glove In-Home Setup Included",
      description: "Deep winged headboard with integrated acoustic baffling and a low-profile floating wooden perimeter frame.",
      inStock: true,
    },
    {
      _id: "cl-6",
      name: "Tuscan Travertine Stone Cocktail Table",
      room: "Living Room",
      category: "Coffee Tables",
      price: 890.0,
      compareAtPrice: 1050.0,
      rating: 4.9,
      reviewCount: 39,
      badge: "Natural Stone",
      image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=900&auto=format&fit=crop&q=80",
      images: [
        "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=900&auto=format&fit=crop&q=80",
      ],
      materials: "Unfilled Italian Roman Travertine, Honed matte seal",
      dimensions: "48\" L × 28\" W × 15\" H",
      leadTime: "Heavy Freight Climate Courier",
      description: "Each slab is quarried in Tivoli, Italy, featuring porous natural fissures and organic earthy veining that makes each piece unique.",
      inStock: true,
    },
  ];

  const pieces = products.length > 0 ? products : fallbackFurniture;

  const brandName =
    business?.businessName ||
    business?.name ||
    customization?.heroHeadline ||
    "CASA LIVING";

  const brandLogo = customization?.logo || business?.logo || null;
  const brandPhone =
    business?.phone ||
    business?.businessPhone ||
    business?.contactPhone ||
    "+1 (800) 888-CASA";
  const brandEmail =
    business?.email ||
    business?.businessEmail ||
    business?.contactEmail ||
    "concierge@casaliving.design";

  const rawAddr = business?.address || business?.registered_business_address;
  const brandAddress =
    typeof rawAddr === "string"
      ? rawAddr
      : rawAddr && typeof rawAddr === "object"
      ? [rawAddr.street, rawAddr.addressLine2, rawAddr.city, rawAddr.state, rawAddr.postalCode, rawAddr.country]
          .filter(Boolean)
          .join(", ")
      : "710 Design Row, Chicago, IL 60654";

  // Filter and sort catalog
  const filteredPieces = useMemo(() => {
    return pieces
      .filter((p) => {
        if (selectedRoom !== "all") {
          const room = (p.room || "").toLowerCase();
          const cat = (p.category || "").toLowerCase();
          const filter = selectedRoom.toLowerCase();
          if (!room.includes(filter) && !cat.includes(filter)) return false;
        }

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const nameM = (p.name || "").toLowerCase().includes(q);
          const descM = (p.description || "").toLowerCase().includes(q);
          const matM = (p.materials || "").toLowerCase().includes(q);
          if (!nameM && !descM && !matM) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return Number(a.price) - Number(b.price);
        if (sortBy === "price-desc") return Number(b.price) - Number(a.price);
        if (sortBy === "rating") return (b.rating || 5) - (a.rating || 5);
        return 0;
      });
  }, [pieces, selectedRoom, searchQuery, sortBy]);

  const handleAddToCart = (product, qty = 1, options = null) => {
    if (isOutOfStock(product)) {
      toast.error(`Sorry, ${product.name || "piece"} is out of stock!`);
      return;
    }

    const itemToAdd = {
      ...product,
      price: options?.totalPrice || product.price,
      name: options ? `${product.name} (${options.finishTitle})` : product.name,
      customOptions: options,
    };

    dispatch(addToCart({ product: itemToAdd, quantity: qty }));
    toast.success(`${itemToAdd.name} added to your Furnishing Bag! 🛋️`);
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

  // Swatch catalog
  const swatchList = [
    { id: "boucle-cream", name: "Heavy Bouclé (Warm Cream)", type: "Fabric", color: "#F5F2EB" },
    { id: "boucle-charcoal", name: "Heavy Bouclé (Nocturne)", type: "Fabric", color: "#2B2D2F" },
    { id: "linen-natural", name: "Belgian Washed Linen (Oatmeal)", type: "Fabric", color: "#DDD3C1" },
    { id: "leather-cognac", name: "Italian Semi-Aniline Leather (Cognac)", type: "Leather", color: "#9E5B2E" },
    { id: "oak-natural", name: "Solid American White Oak (Matte Oil)", type: "Wood", color: "#C8A97E" },
    { id: "walnut-smoked", name: "Appalachian Black Walnut (Satin)", type: "Wood", color: "#5A3D28" },
    { id: "travertine-tivoli", name: "Roman Travertine (Honed)", type: "Stone", color: "#E0D7C6" },
  ];

  const toggleSwatch = (swatchId) => {
    if (selectedSwatches.includes(swatchId)) {
      setSelectedSwatches(selectedSwatches.filter((id) => id !== swatchId));
    } else {
      if (selectedSwatches.length >= 4) {
        toast.error("Maximum 4 swatches per complimentary designer kit.");
        return;
      }
      setSelectedSwatches([...selectedSwatches, swatchId]);
    }
  };

  const handleOrderSwatches = (e) => {
    e.preventDefault();
    if (selectedSwatches.length === 0) {
      toast.error("Please select at least one material swatch.");
      return;
    }
    setSwatchOrdered(true);
    toast.success("Complimentary Swatch Kit dispatched to your address! 📦");
  };

  // Room Fit Clearance Calculations
  const roomAreaSqFt = roomLengthFt * roomWidthFt;
  const roomFitDetails = useMemo(() => {
    if (selectedFurnitureType === "sectional") {
      const sofaW = 9.2; // ft
      const sofaD = 5.7; // ft
      const remainingClearance = Math.min(roomLengthFt - sofaW, roomWidthFt - sofaD);
      const isComfortable = remainingClearance >= 3.5;
      return {
        furnitureName: "Nordic Modular Sectional (110\" × 68\")",
        footprintSqFt: (sofaW * sofaD).toFixed(1),
        perimeterClearanceFt: remainingClearance.toFixed(1),
        status: isComfortable ? "Comfortable Fit" : "Tight Fit (Consider 3-seater)",
        isGood: isComfortable,
        guidance: isComfortable
          ? "Excellent proportions. Leaves ample 36\"+ perimeter walking space for side tables and circulation."
          : "Borderline tight perimeter. We recommend at least 36 inches between coffee table and sectional edges.",
      };
    } else if (selectedFurnitureType === "dining") {
      const tableL = 7.0; // ft
      const tableW = 3.2; // ft
      const chairClearance = 3.0; // ft for pulling chair back
      const reqL = tableL + chairClearance * 2;
      const reqW = tableW + chairClearance * 2;
      const isComfortable = roomLengthFt >= reqL && roomWidthFt >= reqW;
      return {
        furnitureName: "8-Seater Oak Dining Table (84\" × 38\")",
        footprintSqFt: (tableL * tableW).toFixed(1),
        perimeterClearanceFt: (Math.min(roomLengthFt - reqL, roomWidthFt - reqW)).toFixed(1),
        status: isComfortable ? "Spacious Dining Fit" : "Requires 14ft × 10ft Minimum Space",
        isGood: isComfortable,
        guidance: isComfortable
          ? "Generous room allowance. Diners can pull chairs fully out without striking surrounding walls."
          : "Chair pull-out clearance is constrained. Consider our 6-seater 72\" table option.",
      };
    } else {
      const bedL = 7.5;
      const bedW = 6.8;
      const sideClearance = Math.min((roomWidthFt - bedW) / 2, roomLengthFt - bedL);
      const isComfortable = sideClearance >= 2.5;
      return {
        furnitureName: "King Sorrento Bed Sanctuary (82\" × 90\")",
        footprintSqFt: (bedL * bedW).toFixed(1),
        perimeterClearanceFt: sideClearance.toFixed(1),
        status: isComfortable ? "Ideal Master Sanctuary" : "Tight Nightstand Space",
        isGood: isComfortable,
        guidance: isComfortable
          ? "Leaves 30\"+ on each flank for wide architectural nightstands and dressing circulation."
          : "Consider floating wall-mounted nightstands to maximize floor breathing room.",
      };
    }
  }, [roomLengthFt, roomWidthFt, selectedFurnitureType]);

  // Delivery check handler
  const handleCheckDelivery = (e) => {
    e.preventDefault();
    if (!pincode.trim()) return;
    setDeliveryResult({
      status: "Available",
      carrier: "CasaLiving Dedicated White-Glove Fleet",
      appointment: "Within 4-6 Business Days",
      includes: "In-Room Placement, Packaging Removal, Leveling & Assembly",
    });
    toast.success(`ZIP ${pincode} verified for White-Glove In-Home Service!`);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#FAF8F5] text-[#2C1810] antialiased selection:bg-amber-200 selection:text-amber-900">
      {/* ================= 1. ARCHITECTURAL TOP BAR ================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#2C1810]/10 shadow-2xs">
        <div className="bg-[#451A03] text-amber-100 text-[11px] py-2 px-4">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-medium tracking-wide">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>
                ✨ <strong>Complimentary White-Glove In-Home Placement</strong> on Orders Above ₹25,000 • Packaging Removal & Assembly Included
              </span>
            </div>
            <div className="hidden md:flex items-center gap-6 text-[11px] font-medium text-amber-200">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-amber-400" /> 10-Year Structural Hardwood Warranty
              </span>
              <span className="flex items-center gap-1.5">
                <Palette size={14} className="text-amber-400" /> Free Fabric & Wood Swatches
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
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#78350F] to-[#451A03] text-white flex items-center justify-center shadow-md shadow-amber-950/20 group-hover:scale-105 transition duration-300">
                <Layers size={22} className="text-amber-300" />
              </div>
            )}
            <div className="space-y-0.5 text-left">
              <span className="text-xl sm:text-2xl font-serif font-black tracking-tight text-[#451A03] block leading-none">
                {brandName}
              </span>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#92400E] font-bold block">
                {business?.tagline || "Architectural Living & Furniture Atelier"}
              </span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8 text-[12px] font-bold uppercase tracking-wider text-[#78350F]">
            {[
              { id: "home", label: "Sanctuary" },
              { id: "rooms", label: "Room-by-Room 🛋️" },
              { id: "swatches", label: "Free Swatch Box" },
              { id: "fit-calculator", label: "Room Fit Calculator" },
              { id: "delivery", label: "White Glove Service" },
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
                    isActive ? "text-[#451A03] font-black" : "hover:text-[#92400E] text-[#8C5A3E]"
                  }`}
                >
                  <span>{tab.label}</span>
                  {isActive && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D97706] rounded-full" />}
                </button>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setActivePage("swatches");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-amber-50 text-[#78350F] hover:bg-amber-100 font-bold text-xs border border-amber-200/80 transition cursor-pointer"
            >
              <Palette size={14} className="text-[#D97706]" />
              <span>Order Swatches (Free)</span>
            </button>

            <button
              onClick={() => setCartOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-[#451A03] text-white hover:bg-[#78350F] transition cursor-pointer flex items-center gap-2 font-bold text-xs shadow-md shadow-amber-950/20"
            >
              <ShoppingBag size={17} className="text-amber-300" />
              <span className="hidden sm:inline">Furnishing Bag</span>
              <span className="bg-[#D97706] text-white text-[11px] font-black min-w-[20px] h-5 px-1 rounded-full flex items-center justify-center">
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
            <section className="relative overflow-hidden bg-gradient-to-b from-[#F7F3EE] via-[#FAF8F5] to-[#FAF8F5] pt-12 pb-20 md:pt-20 md:pb-28 border-b border-[#2C1810]/5">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  <div className="lg:col-span-7 space-y-7 text-left">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-amber-200 text-[#78350F] text-xs font-semibold shadow-2xs">
                      <Sparkles size={14} className="text-[#D97706]" />
                      <span>FSC Certified European Hardwoods & Italian Linens</span>
                    </div>

                    <h1 className="text-4xl sm:text-6xl lg:text-[66px] font-serif font-black tracking-tight text-[#451A03] leading-[1.08]">
                      Architectural Living Spaces Designed to Endure.
                    </h1>

                    <p className="text-sm sm:text-base text-[#7C5A48] leading-relaxed max-w-xl">
                      Heirloom joinery, pillowed Belgian linens, and sculptural natural stones. Every piece is delivered via certified white-glove technicians who position and assemble each element in your room of choice.
                    </p>

                    <div className="flex flex-wrap gap-4 pt-2">
                      <button
                        onClick={() => {
                          setActivePage("rooms");
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="px-8 py-4 bg-[#451A03] hover:bg-[#78350F] text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition shadow-xl shadow-amber-950/20 flex items-center gap-2.5 cursor-pointer transform hover:-translate-y-0.5"
                      >
                        <Compass size={17} className="text-amber-300" />
                        <span>Explore Room Environments</span>
                      </button>

                      <button
                        onClick={() => {
                          setActivePage("swatches");
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="px-7 py-4 bg-white border border-amber-300 hover:border-amber-500 text-[#451A03] rounded-2xl text-xs font-bold uppercase tracking-wider transition hover:bg-amber-50/50 flex items-center gap-2 cursor-pointer"
                      >
                        <Palette size={16} className="text-[#D97706]" />
                        <span>Order Free Swatch Box</span>
                      </button>
                    </div>

                    {/* Postal delivery check mini bar */}
                    <div className="pt-3 max-w-md">
                      <form onSubmit={handleCheckDelivery} className="p-1.5 bg-white rounded-2xl border border-amber-200 shadow-2xs flex items-center gap-2">
                        <MapPin size={16} className="text-[#D97706] ml-2.5 shrink-0" />
                        <input
                          type="text"
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value)}
                          placeholder="Enter your ZIP code for White-Glove transit time..."
                          className="w-full text-xs font-medium text-[#451A03] focus:outline-none placeholder:text-gray-400"
                        />
                        <button type="submit" className="px-4 py-2 bg-amber-100 hover:bg-amber-200 text-[#451A03] text-[11px] font-bold rounded-xl shrink-0 transition">
                          Check Dispatch
                        </button>
                      </form>

                      {deliveryResult && (
                        <p className="text-[11px] font-semibold text-amber-900 flex items-center gap-1.5 mt-2 ml-1">
                          <CheckCircle2 size={14} className="text-emerald-700" />
                          <span>{deliveryResult.carrier} • In-home delivery in {deliveryResult.appointment}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Visual Showcase */}
                  <div className="lg:col-span-5 relative">
                    <div className="aspect-[4/5] rounded-[36px] overflow-hidden shadow-2xl border-8 border-white bg-amber-100">
                      <img
                        src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1000&auto=format&fit=crop&q=80"
                        alt="CasaLiving Room Inspiration"
                        className="w-full h-full object-cover transform hover:scale-105 transition duration-700"
                      />
                    </div>

                    {/* Floating architectural hotspot badge */}
                    <div className="absolute -bottom-6 -left-4 sm:-left-8 bg-white/95 backdrop-blur-md p-5 rounded-3xl border border-amber-100 shadow-2xl max-w-[260px] text-left space-y-1.5">
                      <div className="flex items-center gap-1.5 text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={13} fill="currentColor" />
                        ))}
                      </div>
                      <p className="text-xs font-bold text-[#451A03]">"The joinery on the dining table is museum grade. White-glove team assembled it in 15 mins."</p>
                      <span className="text-[10px] font-medium text-[#8C5A3E] block">— Soren L., Architectural Digest Collector</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* CURATED FURNISHING PIECES */}
            <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-left">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-[#2C1810]/10 pb-6">
                <div>
                  <span className="text-xs uppercase tracking-wider text-[#D97706] font-bold">Heirloom Catalog</span>
                  <h2 className="text-3xl sm:text-4xl font-serif font-black text-[#451A03]">Signature Furnishing Pieces</h2>
                  <p className="text-xs sm:text-sm text-[#7C5A48] mt-1">Directly crafted with solid white oak, Italian bouclé, and Roman travertine stone.</p>
                </div>

                <button
                  onClick={() => {
                    setActivePage("rooms");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#451A03] hover:text-[#78350F] hover:underline cursor-pointer"
                >
                  <span>View All Environments ({pieces.length} Pieces)</span>
                  <ArrowRight size={14} />
                </button>
              </div>

              {/* Grid of pieces */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {pieces.map((item) => {
                  const outOfStock = isOutOfStock(item);
                  return (
                    <div
                      key={item._id}
                      onClick={() => {
                        setSelectedProduct(item);
                        setActivePage("product-detail");
                      }}
                      className="bg-white rounded-3xl border border-[#2C1810]/10 p-5 space-y-4 flex flex-col justify-between shadow-xs hover:shadow-2xl transition duration-300 cursor-pointer group relative"
                    >
                      <div className="space-y-3">
                        <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-amber-50 relative">
                          <img
                            src={getProductImage(item, item.image)}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-108 transition duration-500"
                          />
                          {item.badge && (
                            <span className="absolute top-3 left-3 bg-[#451A03]/90 backdrop-blur-xs text-white text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-[11px] font-bold">
                          <span className="text-[#D97706] uppercase tracking-wider">{item.room || "Sanctuary"}</span>
                          <span className="text-[#7C5A48] flex items-center gap-1">
                            <Star size={12} className="text-amber-500 fill-amber-500" />
                            {item.rating || 5.0} ({item.reviewCount || 20})
                          </span>
                        </div>

                        <h4 className="text-lg font-serif font-bold text-[#451A03] line-clamp-1 group-hover:text-[#92400E] transition">
                          {item.name}
                        </h4>

                        <p className="text-xs text-[#7C5A48] line-clamp-2 leading-relaxed">{item.description}</p>

                        {item.dimensions && (
                          <div className="text-[10px] text-amber-950 bg-amber-50/80 p-2.5 rounded-xl space-y-0.5">
                            <span className="font-bold block text-amber-900">Dimensions: {item.dimensions}</span>
                            <span className="text-[10px] text-[#7C5A48] block">{item.materials}</span>
                          </div>
                        )}
                      </div>

                      <div className="pt-3 flex justify-between items-center border-t border-amber-100">
                        <div>
                          <span className="text-xl font-serif font-black text-[#451A03]">
                            ₹{Number(item.price).toLocaleString()}
                          </span>
                          {item.compareAtPrice && (
                            <span className="text-xs text-gray-400 line-through ml-1.5">
                              ₹{Number(item.compareAtPrice).toLocaleString()}
                            </span>
                          )}
                        </div>

                        {outOfStock ? (
                          <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-xl border border-rose-200">
                            Sold Out
                          </span>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(item);
                            }}
                            className="px-4 py-2 bg-[#451A03] hover:bg-[#78350F] text-white rounded-xl text-xs font-bold cursor-pointer transition shadow-xs flex items-center gap-1.5"
                          >
                            <Plus size={14} />
                            <span>Add to Bag</span>
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

        {/* ================= PAGE 2: ROOM-BY-ROOM ENVIRONMENTS ================= */}
        {activePage === "rooms" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10 text-left">
            <div className="space-y-4 border-b border-[#2C1810]/10 pb-6">
              <span className="text-xs uppercase tracking-wider text-[#D97706] font-bold">Curated Spaces</span>
              <h1 className="text-3xl sm:text-4xl font-serif font-black text-[#451A03]">Room-by-Room Styling Studio</h1>
              <p className="text-xs sm:text-sm text-[#7C5A48]">
                Filter our catalog by architectural living quarters or search by specific finishes and dimensions.
              </p>

              {/* Room Filter Pills */}
              <div className="flex flex-wrap gap-2.5 pt-2">
                {[
                  { id: "all", label: "All Spaces" },
                  { id: "living room", label: "Living Room Sanctuary" },
                  { id: "dining suite", label: "Dining Suites" },
                  { id: "master bedroom", label: "Master Bedroom" },
                ].map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setSelectedRoom(r.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
                      selectedRoom.toLowerCase() === r.id.toLowerCase()
                        ? "bg-[#451A03] text-white border-[#451A03] shadow-xs"
                        : "bg-white text-[#451A03] border-amber-200 hover:bg-amber-50"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Catalog Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPieces.map((item) => (
                <div
                  key={item._id}
                  onClick={() => {
                    setSelectedProduct(item);
                    setActivePage("product-detail");
                  }}
                  className="bg-white rounded-3xl border border-[#2C1810]/10 p-5 space-y-4 flex flex-col justify-between shadow-xs hover:shadow-xl transition cursor-pointer group"
                >
                  <div className="space-y-3">
                    <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-amber-50 relative">
                      <img src={getProductImage(item, item.image)} alt={item.name} className="w-full h-full object-cover group-hover:scale-108 transition duration-500" />
                      {item.badge && (
                        <span className="absolute top-3 left-3 bg-[#451A03]/90 text-white text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] uppercase font-bold text-[#D97706] tracking-wider block">{item.room}</span>
                    <h4 className="text-lg font-serif font-bold text-[#451A03]">{item.name}</h4>
                    <p className="text-xs text-[#7C5A48] line-clamp-2 leading-relaxed">{item.description}</p>
                    <div className="text-[10px] text-amber-950 bg-amber-50 p-2.5 rounded-xl space-y-0.5">
                      <span className="font-bold block">Size: {item.dimensions}</span>
                      <span className="text-[#7C5A48] block">{item.materials}</span>
                    </div>
                  </div>

                  <div className="pt-3 flex justify-between items-center border-t border-amber-100">
                    <span className="text-xl font-serif font-black text-[#451A03]">₹{Number(item.price).toLocaleString()}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(item);
                      }}
                      className="px-4 py-2 bg-[#451A03] hover:bg-[#78350F] text-white rounded-xl text-xs font-bold cursor-pointer transition shadow-xs flex items-center gap-1.5"
                    >
                      <Plus size={14} /> Add to Bag
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= PAGE 3: INTERACTIVE SWATCH BOX STUDIO ================= */}
        {activePage === "swatches" && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 text-left">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs uppercase tracking-[0.2em] text-[#D97706] font-bold">Tactile Materiality</span>
              <h1 className="text-3xl sm:text-4xl font-serif font-black text-[#451A03]">Complimentary Designer Swatch Box</h1>
              <p className="text-xs sm:text-sm text-[#7C5A48]">
                Select up to 4 natural wood and textile swatches. Dispatched in an archival linen presentation box directly to your door at zero charge.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Swatch Picker */}
              <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-[#2C1810]/10 space-y-6 shadow-xs">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-serif font-bold text-[#451A03]">Select 4 Material Samples</h3>
                  <span className="text-xs font-bold text-[#D97706]">{selectedSwatches.length} of 4 selected</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {swatchList.map((swatch) => {
                    const isSelected = selectedSwatches.includes(swatch.id);
                    return (
                      <div
                        key={swatch.id}
                        onClick={() => toggleSwatch(swatch.id)}
                        className={`p-4 rounded-2xl border-2 transition cursor-pointer flex items-center gap-3.5 ${
                          isSelected ? "border-[#451A03] bg-amber-50/50 shadow-xs" : "border-amber-100 hover:border-amber-300"
                        }`}
                      >
                        <div
                          className="w-10 h-10 rounded-xl border border-black/10 shadow-inner shrink-0"
                          style={{ backgroundColor: swatch.color }}
                        />
                        <div className="space-y-0.5 text-left">
                          <span className="text-[10px] uppercase font-bold text-[#D97706] tracking-wider block">{swatch.type}</span>
                          <h4 className="text-xs font-bold text-[#451A03] line-clamp-1">{swatch.name}</h4>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Form */}
              <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-[#2C1810]/10 space-y-5 shadow-xs">
                <h4 className="text-sm font-bold text-[#451A03] uppercase tracking-wider">Dispatch Destination</h4>

                {swatchOrdered ? (
                  <div className="p-6 rounded-2xl bg-amber-50/80 border border-amber-200 text-center space-y-3">
                    <CheckCircle2 size={36} className="text-emerald-700 mx-auto" />
                    <h5 className="text-base font-serif font-bold text-[#451A03]">Swatch Box Dispatched!</h5>
                    <p className="text-xs text-[#7C5A48] leading-relaxed">
                      Your complimentary 4-swatch presentation kit has been registered and scheduled for courier dispatch. Tracking will arrive via email.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleOrderSwatches} className="space-y-3.5">
                    <div>
                      <label className="block text-[11px] font-bold text-[#451A03] mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={swatchName}
                        onChange={(e) => setSwatchName(e.target.value)}
                        placeholder="Elena Rostova"
                        className="w-full px-3 py-2 rounded-xl bg-amber-50/40 border border-amber-200 text-xs text-[#451A03]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#451A03] mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        value={swatchEmail}
                        onChange={(e) => setSwatchEmail(e.target.value)}
                        placeholder="elena@designstudio.com"
                        className="w-full px-3 py-2 rounded-xl bg-amber-50/40 border border-amber-200 text-xs text-[#451A03]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#451A03] mb-1">Delivery Shipping Address</label>
                      <textarea
                        rows={2}
                        required
                        value={swatchAddress}
                        onChange={(e) => setSwatchAddress(e.target.value)}
                        placeholder="Street, Suite, City, State, ZIP"
                        className="w-full px-3 py-2 rounded-xl bg-amber-50/40 border border-amber-200 text-xs text-[#451A03]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3.5 bg-[#451A03] hover:bg-[#78350F] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer shadow-md"
                    >
                      Request Free Swatch Box
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= PAGE 4: ROOM FIT & CLEARANCE CALCULATOR ================= */}
        {activePage === "fit-calculator" && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 text-left">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs uppercase tracking-[0.2em] text-[#D97706] font-bold">Space Architecture</span>
              <h1 className="text-3xl sm:text-4xl font-serif font-black text-[#451A03]">Room Fit & Clearance Calculator</h1>
              <p className="text-xs sm:text-sm text-[#7C5A48]">
                Verify whether our sectionals, dining tables, or king platform beds fit your floorplan with the architect-recommended 36-inch perimeter walking clearance.
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#2C1810]/10 space-y-6 shadow-xs">
              {/* Furniture Type Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#451A03]">Select Furniture Category to Test</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "sectional", label: "110\" Modular Sectional" },
                    { id: "dining", label: "8-Seater Oak Dining Table" },
                    { id: "bed", label: "King Platform Bed Suite" },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setSelectedFurnitureType(f.id)}
                      className={`p-3 rounded-xl text-xs font-bold border transition ${
                        selectedFurnitureType === f.id
                          ? "bg-[#451A03] text-white border-[#451A03]"
                          : "bg-white text-[#451A03] border-amber-200 hover:bg-amber-50"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sliders for Room Dimensions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-[#451A03]">
                    <span>Room Length: {roomLengthFt} Feet</span>
                    <span>{(roomLengthFt * 0.3048).toFixed(1)} Meters</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="30"
                    value={roomLengthFt}
                    onChange={(e) => setRoomLengthFt(Number(e.target.value))}
                    className="w-full accent-[#451A03] cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-[#451A03]">
                    <span>Room Width: {roomWidthFt} Feet</span>
                    <span>{(roomWidthFt * 0.3048).toFixed(1)} Meters</span>
                  </div>
                  <input
                    type="range"
                    min="8"
                    max="25"
                    value={roomWidthFt}
                    onChange={(e) => setRoomWidthFt(Number(e.target.value))}
                    className="w-full accent-[#451A03] cursor-pointer"
                  />
                </div>
              </div>

              {/* Output Result Card */}
              <div className="p-6 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#D97706] tracking-wider block">Tested Model</span>
                    <h4 className="text-base font-serif font-bold text-[#451A03]">{roomFitDetails.furnitureName}</h4>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      roomFitDetails.isGood ? "bg-emerald-100 text-emerald-800" : "bg-amber-200 text-amber-900"
                    }`}
                  >
                    {roomFitDetails.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-2 border-t border-amber-200/80 text-xs">
                  <div>
                    <span className="text-[#8C5A3E] block">Total Room Area</span>
                    <span className="text-base font-bold text-[#451A03]">{roomAreaSqFt} sq ft</span>
                  </div>
                  <div>
                    <span className="text-[#8C5A3E] block">Piece Footprint</span>
                    <span className="text-base font-bold text-[#451A03]">{roomFitDetails.footprintSqFt} sq ft</span>
                  </div>
                  <div>
                    <span className="text-[#8C5A3E] block">Walking Perimeter</span>
                    <span className="text-base font-bold text-[#451A03]">{roomFitDetails.perimeterClearanceFt} ft clearance</span>
                  </div>
                </div>

                <p className="text-xs text-[#7C5A48] leading-relaxed pt-2 border-t border-amber-200/80">
                  💡 <strong>Architect Note:</strong> {roomFitDetails.guidance}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ================= PAGE 5: WHITE GLOVE DELIVERY ================= */}
        {activePage === "delivery" && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 text-left">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs uppercase tracking-[0.2em] text-[#D97706] font-bold">Flawless Arrival</span>
              <h1 className="text-3xl sm:text-4xl font-serif font-black text-[#451A03]">White-Glove In-Home Service</h1>
              <p className="text-xs sm:text-sm text-[#7C5A48]">
                We treat your home with the care of an art gallery. Our two-person uniformed transit crews unpack, position, level, and remove all protective packaging.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-3xl bg-white border border-[#2C1810]/10 space-y-3 shadow-xs">
                <Truck size={28} className="text-[#D97706]" />
                <h4 className="text-base font-serif font-bold text-[#451A03]">Room of Choice Placement</h4>
                <p className="text-xs text-[#7C5A48] leading-relaxed">
                  No curb drops. Our technicians carry heavy stone tops and modular sectionals up stairs into your designated room.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-[#2C1810]/10 space-y-3 shadow-xs">
                <ShieldCheck size={28} className="text-[#D97706]" />
                <h4 className="text-base font-serif font-bold text-[#451A03]">Complete Assembly Included</h4>
                <p className="text-xs text-[#7C5A48] leading-relaxed">
                  Solid oak tables, bed platforms, and modular sofa connectors are hand-bolted and leveled to your floor surface.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-[#2C1810]/10 space-y-3 shadow-xs">
                <Layers size={28} className="text-[#D97706]" />
                <h4 className="text-base font-serif font-bold text-[#451A03]">Packaging Removal & Recycle</h4>
                <p className="text-xs text-[#7C5A48] leading-relaxed">
                  Every crate, padded blanket, and cardboard wrap is removed from your premises and responsibly recycled.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ================= PRODUCT DETAIL PAGE ================= */}
        {activePage === "product-detail" && selectedProduct && (
          <ProductDetailsPage
            product={selectedProduct}
            onBack={() => {
              setActivePage("home");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onAddToCart={handleAddToCart}
            themeColors={{
              primary: "#451A03",
              secondary: "#78350F",
              text: "#451A03",
              background: "#FAF8F5",
              cardBg: "#FFFFFF",
            }}
            business={business}
            relatedProducts={pieces}
            onSelectProduct={(p) => {
              setSelectedProduct(p);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        )}
      </main>

      {/* ================= 3. ARCHITECTURAL FOOTER ================= */}
      <footer className="bg-[#451A03] text-amber-100 pt-16 pb-12 border-t border-amber-900 text-left text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                {brandLogo ? (
                  <img src={brandLogo} alt={brandName} className="h-8 w-auto max-w-[130px] object-contain rounded brightness-0 invert" />
                ) : (
                  <Layers size={22} className="text-amber-300" />
                )}
                <span className="text-base font-serif font-black tracking-tight text-white uppercase">{brandName}</span>
              </div>
              <p className="text-amber-200/80 leading-relaxed text-[11px] max-w-xs">
                Architectural furniture, Scandinavian solid oak tables, linen upholstered sectionals, and curated lighting.
              </p>
              {brandAddress && (
                <p className="text-amber-300/90 text-[11px] flex items-center gap-1.5 pt-1">
                  <MapPin size={13} className="shrink-0 text-amber-400" />
                  <span>{brandAddress}</span>
                </p>
              )}
            </div>

            <div className="space-y-2">
              <h5 className="font-bold text-white uppercase text-[10px] tracking-wider">Living Quarters</h5>
              <p onClick={() => { setSelectedRoom("living room"); setActivePage("rooms"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="hover:text-white cursor-pointer transition text-[11px]">Sectionals & Sofas</p>
              <p onClick={() => { setSelectedRoom("dining suite"); setActivePage("rooms"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="hover:text-white cursor-pointer transition text-[11px]">Solid Oak Dining Tables</p>
              <p onClick={() => { setSelectedRoom("master bedroom"); setActivePage("rooms"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="hover:text-white cursor-pointer transition text-[11px]">Platform Bed Sanctuaries</p>
            </div>

            <div className="space-y-2">
              <h5 className="font-bold text-white uppercase text-[10px] tracking-wider">Design Atelier</h5>
              <p onClick={() => { setActivePage("swatches"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="hover:text-white cursor-pointer transition text-[11px]">Complimentary Swatch Box</p>
              <p onClick={() => { setActivePage("fit-calculator"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="hover:text-white cursor-pointer transition text-[11px]">Room Fit & Clearance Calculator</p>
              <p onClick={() => { setActivePage("delivery"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="hover:text-white cursor-pointer transition text-[11px]">White Glove Delivery Protocol</p>
            </div>

            <div className="space-y-2">
              <h5 className="font-bold text-white uppercase text-[10px] tracking-wider">Concierge & Trade</h5>
              <p className="text-white font-bold">{brandPhone}</p>
              <p className="text-amber-300 text-[11px]">{brandEmail}</p>
              <span className="text-[10px] text-amber-400 block pt-2">Trade Accounts: Trade Discounts of 20% for registered Interior Designers.</span>
            </div>
          </div>

          <div className="pt-8 border-t border-amber-900/60 flex flex-col sm:flex-row justify-between items-center text-[10px] text-amber-300/70 gap-2">
            <p>© {new Date().getFullYear()} {brandName}. Sustainable Forestry Initiative Partner.</p>
            <p>100% Solid European Hardwoods • Non-Toxic Finishes</p>
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
        themeColors={{ primary: "#451A03" }}
      />
    </div>
  );
}
