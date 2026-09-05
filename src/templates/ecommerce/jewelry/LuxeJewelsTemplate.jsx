import React, { useState, useMemo } from "react";
import {
  Sparkles,
  ShieldCheck,
  Star,
  ShoppingBag,
  Check,
  Calendar,
  Lock,
  ArrowRight,
  Eye,
  Award,
  Gem,
  Plus,
  Minus,
  ChevronRight,
  Clock,
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

export default function LuxeJewelsTemplate({
  business = {},
  products = [],
  categories = [],
  offers = [],
  reviews = [],
  customization = {},
}) {
  // Navigation: "home" | "catalog" | "diamonds" | "bespoke" | "appointment" | "offers" | "product-detail"
  const [activePage, setActivePage] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);

  // Search & Filters
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Appointment State
  const [appointmentName, setAppointmentName] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentSalon, setAppointmentSalon] = useState("Geneva");
  const [appointmentBooked, setAppointmentBooked] = useState(false);

  // GIA Diamond Explorer State
  const [demoCarat, setDemoCarat] = useState(2.0);
  const [demoCut, setDemoCut] = useState("Round Brilliant");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart?.cartItems || []);

  const defaultCreations = [
    {
      _id: "jewel-1",
      name: "The Reine de Genève 2.0ct Solitaire Ring",
      price: 1850.0,
      compareAtPrice: 2200.0,
      category: "Solitaire Rings",
      carat: 2.0,
      cut: "Triple Excellent Round",
      metal: "18k Yellow Gold",
      rating: 5.0,
      reviewCount: 42,
      badge: "GIA Certified",
      image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80",
      description: "Center 2.00-carat D-color flawless brilliant-cut diamond in four-prong platinum basket with pavé 18k yellow gold band.",
      inStock: true,
    },
    {
      _id: "jewel-2",
      name: "The Celestial Oval Pavé Halo Ring",
      price: 1620.0,
      compareAtPrice: 1950.0,
      category: "Solitaire Rings",
      carat: 1.75,
      cut: "Oval Cut",
      metal: "Platinum 950",
      rating: 4.9,
      reviewCount: 36,
      badge: "Geneva Halo",
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80",
      description: "Elongated 1.75ct oval-cut diamond surrounded by a micro-pavé cathedral halo and hidden diamond gallery.",
      inStock: true,
    },
    {
      _id: "jewel-3",
      name: "The Royal Muzo Emerald & Diamond Pendant",
      price: 2150.0,
      compareAtPrice: 2600.0,
      category: "Diamond Necklaces",
      carat: 3.2,
      cut: "Emerald Cut",
      metal: "18k Yellow Gold",
      rating: 5.0,
      reviewCount: 29,
      badge: "Unheated Colombian",
      image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80",
      description: "Vivid green certified Colombian emerald suspended from an 18-karat gold wheat chain framed with calibrated trapezoid diamonds.",
      inStock: true,
    },
    {
      _id: "jewel-4",
      name: "The Lumière 5.0ct Rivière Diamond Tennis Necklace",
      price: 3800.0,
      compareAtPrice: 4500.0,
      category: "Diamond Necklaces",
      carat: 5.0,
      cut: "Graduated Round",
      metal: "18k White Gold",
      rating: 5.0,
      reviewCount: 51,
      badge: "5.00 Total Carat",
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop&q=80",
      description: "Continuous graduated stream of 84 hand-matched D-F color diamonds in four-prong low-profile articulated settings.",
      inStock: true,
    },
    {
      _id: "jewel-5",
      name: "The Aurora South Sea Pearl & Diamond Drop Earrings",
      price: 980.0,
      compareAtPrice: 1200.0,
      category: "Fine Earrings",
      carat: 1.2,
      cut: "Brilliant Drops",
      metal: "18k White Gold",
      rating: 4.9,
      reviewCount: 38,
      badge: "Lustrous Pearl",
      image: "https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?w=800&auto=format&fit=crop&q=80",
      description: "Flawless 12mm Australian South Sea cultured pearls suspended beneath brilliant-cut diamond floral clusters.",
      inStock: true,
    },
    {
      _id: "jewel-6",
      name: "The Infinity Diamond Baffle Tennis Bracelet",
      price: 1450.0,
      compareAtPrice: 1750.0,
      category: "Bracelets & Baffles",
      carat: 3.5,
      cut: "Round Brilliant",
      metal: "Platinum 950",
      rating: 4.8,
      reviewCount: 33,
      badge: "Safety Lock",
      image: "https://images.unsplash.com/photo-1611591475837-14283b7f6311?w=800&auto=format&fit=crop&q=80",
      description: "Seamless articulated platinum links with dual concealed safety clasps and 3.50 carats of VS1 diamonds.",
      inStock: true,
    },
  ];

  const jewelItems = products.length > 0 ? products : defaultCreations;

  const brandName =
    business?.businessName ||
    business?.name ||
    customization?.heroHeadline ||
    "LUXE JEWELS";

  const brandLogo = customization?.logo || business?.logo || null;
  const brandPhone =
    business?.phone ||
    business?.businessPhone ||
    business?.contactPhone ||
    "+41 22 819 9000";
  const brandEmail =
    business?.email ||
    business?.businessEmail ||
    business?.contactEmail ||
    "concierge@luxejewels.ch";

  const rawAddr = business?.address || business?.registered_business_address;
  const brandAddress =
    typeof rawAddr === "string"
      ? rawAddr
      : rawAddr && typeof rawAddr === "object"
      ? [rawAddr.street, rawAddr.addressLine2, rawAddr.city, rawAddr.state, rawAddr.postalCode, rawAddr.country]
          .filter(Boolean)
          .join(", ")
      : "Rue du Rhône 42, 1204 Genève, Switzerland";

  const handleAddToCart = (product, qty = 1) => {
    if (isOutOfStock(product)) {
      toast.error(`Sorry, ${product.name} is currently acquired!`);
      return;
    }
    dispatch(addToCart({ product, quantity: qty }));
    toast.success(`${product.name} acquired for your Jewel Box! 💎`);
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

  const handleBookAppointment = (e) => {
    e.preventDefault();
    if (!appointmentName.trim() || !appointmentDate) {
      toast.error("Please provide your name and preferred date.");
      return;
    }
    setAppointmentBooked(true);
    toast.success("Private salon viewing confirmed! Our senior concierge will contact you within 2 hours. ✨");
  };

  return (
    <div className="min-h-screen flex flex-col font-serif bg-[#08080A] text-[#FAFAFA] antialiased selection:bg-[#D4AF37]/30 selection:text-[#FBBF24]">
      {/* ================= 1. HAUTE JOAILLERIE NAVBAR ================= */}
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
        onOpenAppointment={() => {
          setActivePage("appointment");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />

      {/* ================= 2. MAIN ACTIVE VIEW ================= */}
      <main className="flex-1">
        {/* ================= VIEW 1: HOME ================= */}
        {activePage === "home" && (
          <>
            {/* HERO SECTION */}
            <section className="relative overflow-hidden bg-gradient-to-b from-[#0B0B0E] via-[#09090C] to-[#08080A] pt-12 pb-20 md:pt-20 md:pb-28 border-b border-[#D4AF37]/25">
              {/* Radial golden candlelight ambient glow */}
              <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  <div className="lg:col-span-7 space-y-6 text-left">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#181613] border border-[#D4AF37]/40 text-[#FBBF24] text-xs font-sans font-bold">
                      <Sparkles size={14} className="text-[#FBBF24] animate-pulse" />
                      <span>Haute Joaillerie Genève • Certified Conflict-Free Diamonds</span>
                    </div>

                    <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#FAFAFA] leading-[1.08]">
                      Eternal Brilliance Hand-Set in the Heart of Geneva.
                    </h1>

                    <p className="text-sm sm:text-base text-[#A89F91] leading-relaxed max-w-xl font-sans">
                      Individually certified by the Gemological Institute of America (GIA). Master jewelers forging 18k recycled gold and platinum 950 into timeless solitaire masterpieces.
                    </p>

                    <div className="flex flex-wrap gap-4 pt-2 font-sans">
                      <button
                        onClick={() => {
                          setActivePage("catalog");
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="px-8 py-4 bg-gradient-to-r from-[#D4AF37] via-[#B8922C] to-[#8C6D1F] hover:from-[#E5C158] hover:to-[#A37B24] text-[#0A0A0C] font-black rounded-2xl text-xs uppercase tracking-widest transition shadow-[0_0_25px_rgba(212,175,55,0.3)] flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5 active:scale-95"
                      >
                        <Gem size={17} />
                        <span>Explore Precious Vault</span>
                      </button>

                      <button
                        onClick={() => {
                          setActivePage("appointment");
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="px-7 py-4 bg-[#141418] border border-[#D4AF37]/40 hover:border-[#D4AF37] text-[#FAFAFA] rounded-2xl text-xs font-bold uppercase tracking-widest transition flex items-center gap-2 cursor-pointer shadow-sm"
                      >
                        <Calendar size={16} className="text-[#FBBF24]" />
                        <span>Private Salon Viewing</span>
                      </button>
                    </div>

                    {/* Certified Quality Strip */}
                    <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#D4AF37]/25 text-left font-sans">
                      <div>
                        <span className="text-xl sm:text-2xl font-bold text-[#FBBF24]">Triple Ex</span>
                        <p className="text-[11px] text-[#A89F91] mt-0.5">GIA Cut, Polish, Symmetry</p>
                      </div>
                      <div>
                        <span className="text-xl sm:text-2xl font-bold text-[#FAFAFA]">Platinum 950</span>
                        <p className="text-[11px] text-[#A89F91] mt-0.5">& 18k Recycled Gold</p>
                      </div>
                      <div>
                        <span className="text-xl sm:text-2xl font-bold text-[#D4AF37]">100% Insured</span>
                        <p className="text-[11px] text-[#A89F91] mt-0.5">Armored Diplomatic Transit</p>
                      </div>
                    </div>
                  </div>

                  {/* Hero Visual Jewel Box */}
                  <div className="lg:col-span-5 relative">
                    <div className="aspect-[4/3] rounded-[36px] overflow-hidden shadow-2xl border-2 border-[#D4AF37]/40 bg-[#070709] relative group">
                      <img
                        src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80"
                        alt="Reine de Genève Solitaire"
                        className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#08080A]/85 via-transparent to-transparent" />

                      <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white">
                        <div>
                          <span className="text-xs font-sans font-bold uppercase tracking-widest text-[#FBBF24]">
                            Master Solitaire Creation
                          </span>
                          <h4 className="text-lg font-bold">The Reine de Genève 2.0ct</h4>
                        </div>
                        <button
                          onClick={() => handleSelectProduct(jewelItems[0])}
                          className="p-3 bg-[#D4AF37] hover:bg-[#E5C158] text-[#0A0A0C] rounded-xl transition cursor-pointer font-black shadow-lg"
                        >
                          <ChevronRight size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* FEATURED SOLITAIRE LINEUP */}
            <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-left">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-[#D4AF37]/25 pb-6">
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold font-sans">
                    Haute Joaillerie Atelier
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-black text-[#FAFAFA] mt-1">
                    Featured High Jewelry Creations
                  </h2>
                </div>

                <button
                  onClick={() => {
                    setActivePage("catalog");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-sans font-bold text-[#FBBF24] hover:underline cursor-pointer"
                >
                  <span>View All Creations in the Vault ({jewelItems.length} treasures)</span>
                  <ArrowRight size={14} />
                </button>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {jewelItems.slice(0, 4).map((item) => (
                  <ProductCard
                    key={item._id}
                    product={item}
                    onSelectProduct={handleSelectProduct}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            </section>

            {/* GENEVA SALON SERVICES SPOTLIGHT */}
            <section className="py-16 bg-[#0E0E12] border-y border-[#D4AF37]/25">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
                  <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold font-sans">
                    Swiss Gemological Distinction
                  </span>
                  <h2 className="text-3xl font-black text-[#FAFAFA]">
                    The Geneva Haute Joaillerie Standards
                  </h2>
                  <p className="text-xs text-[#A89F91] font-sans">
                    Every diamond is verified by GIA graduate gemologists, laser-inscribed on its girdle, and hand-forged in platinum.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left font-sans">
                  <div
                    onClick={() => {
                      setActivePage("diamonds");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="p-6 rounded-3xl bg-[#141418] border border-[#D4AF37]/25 hover:border-[#D4AF37] transition cursor-pointer group shadow-sm"
                  >
                    <Award size={28} className="text-[#FBBF24] mb-4 group-hover:scale-110 transition duration-300" />
                    <h3 className="font-serif text-lg font-bold text-[#FAFAFA] group-hover:text-[#FBBF24]">GIA Diamond Standards</h3>
                    <p className="text-xs text-[#A89F91] mt-2 leading-relaxed">
                      Understand cut proportions, table depth, and optical symmetry required to attain the Triple Excellent hallmark.
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-xs text-[#D4AF37] font-bold font-sans">
                      Explore 4Cs Standards <ArrowRight size={13} />
                    </span>
                  </div>

                  <div
                    onClick={() => {
                      setActivePage("bespoke");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="p-6 rounded-3xl bg-[#141418] border border-[#D4AF37]/25 hover:border-[#D4AF37] transition cursor-pointer group shadow-sm"
                  >
                    <Sparkles size={28} className="text-[#FBBF24] mb-4 group-hover:scale-110 transition duration-300" />
                    <h3 className="font-serif text-lg font-bold text-[#FAFAFA] group-hover:text-[#FBBF24]">Bespoke Commission</h3>
                    <p className="text-xs text-[#A89F91] mt-2 leading-relaxed">
                      Collaborate directly with our master jeweler to source rare colored stones and sculpt unique heirloom settings.
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-xs text-[#D4AF37] font-bold font-sans">
                      Begin Commission <ArrowRight size={13} />
                    </span>
                  </div>

                  <div
                    onClick={() => {
                      setActivePage("appointment");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="p-6 rounded-3xl bg-[#141418] border border-[#D4AF37]/25 hover:border-[#D4AF37] transition cursor-pointer group shadow-sm"
                  >
                    <Calendar size={28} className="text-[#FBBF24] mb-4 group-hover:scale-110 transition duration-300" />
                    <h3 className="font-serif text-lg font-bold text-[#FAFAFA] group-hover:text-[#FBBF24]">Private Salon Viewing</h3>
                    <p className="text-xs text-[#A89F91] mt-2 leading-relaxed">
                      Schedule a champagne viewing in our private salon on the Rue du Rhône, Geneva or via encrypted video.
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-xs text-[#D4AF37] font-bold font-sans">
                      Book Private Salon <ArrowRight size={13} />
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {/* ================= VIEW 2: PRECIOUS VAULT CATALOG ================= */}
        {activePage === "catalog" && (
          <Product
            products={jewelItems}
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        )}

        {/* ================= VIEW 3: GIA DIAMOND STANDARDS LAB ================= */}
        {activePage === "diamonds" && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 text-left">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-bold font-sans">
                Gemological Institute of America
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-[#FAFAFA]">
                The GIA 4Cs Optical Standards
              </h1>
              <p className="text-xs sm:text-sm text-[#A89F91] font-sans">
                Every Luxe Jewels solitaire is individually laser inscribed with its unique GIA certificate number on its outer girdle.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#0E0E12] border border-[#D4AF37]/30 space-y-8 shadow-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-sans">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-[#FAFAFA]">
                    <span>Carat Weight: {demoCarat} ct</span>
                    <span className="text-[#FBBF24]">Solitaire Center Stone</span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="5.0"
                    step="0.25"
                    value={demoCarat}
                    onChange={(e) => setDemoCarat(Number(e.target.value))}
                    className="w-full accent-[#D4AF37] cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#FAFAFA] uppercase">
                    Select Gemstone Cut:
                  </label>
                  <select
                    value={demoCut}
                    onChange={(e) => setDemoCut(e.target.value)}
                    className="w-full bg-[#141418] text-xs text-[#FAFAFA] p-3 rounded-xl border border-[#D4AF37]/40 focus:border-[#FBBF24] focus:outline-none cursor-pointer"
                  >
                    <option value="Round Brilliant">Round Brilliant (57 Facets • Maximum Fire)</option>
                    <option value="Oval Cut">Oval Brilliant (Slender Finger Elongation)</option>
                    <option value="Emerald Cut">Step-Cut Emerald (Hall of Mirrors Transparency)</option>
                    <option value="Cushion Cut">Antique Cushion Cut (Vintage Soft Corners)</option>
                  </select>
                </div>
              </div>

              {/* Gemological Output Box */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-4 border-t border-[#D4AF37]/20 text-center font-sans">
                <div className="p-4 rounded-2xl bg-[#141418] border border-[#D4AF37]/20 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#A89F91] block">Selected Carat</span>
                  <span className="text-3xl font-bold text-[#FBBF24]">{demoCarat} ct</span>
                  <p className="text-[10px] text-[#78716C]">Diameter approx {Math.round(demoCarat * 3.5 + 3)}mm</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#141418] border border-[#D4AF37]/20 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#A89F91] block">Color Grade</span>
                  <span className="text-3xl font-bold text-[#FAFAFA]">D-E</span>
                  <p className="text-[10px] text-[#78716C]">Completely Colorless</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#141418] border border-[#D4AF37]/20 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#A89F91] block">Clarity Metric</span>
                  <span className="text-3xl font-bold text-[#FAFAFA]">VVS1</span>
                  <p className="text-[10px] text-[#78716C]">Zero Eye Inclusions</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#141418] border border-[#D4AF37]/20 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#A89F91] block">Cut Hallmark</span>
                  <span className="text-3xl font-bold text-[#34D399]">3x Ex</span>
                  <p className="text-[10px] text-[#78716C]">GIA Triple Excellent</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= VIEW 4: BESPOKE ATELIER COMMISSION ================= */}
        {activePage === "bespoke" && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 text-left">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-bold font-sans">
                Haute Joaillerie Sur Mesure
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-[#FAFAFA]">
                Bespoke Geneva Commissions
              </h1>
              <p className="text-xs sm:text-sm text-[#A89F91] font-sans">
                From initial hand-painted gouache renderings to stone sourcing in Antwerp and final setting in Geneva, create an immortal family heirloom.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center font-sans">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-[#D4AF37]/30">
                <img
                  src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=900&auto=format&fit=crop&q=80"
                  alt="Bespoke jewelry atelier"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-4 text-xs text-[#A89F91] leading-relaxed">
                <h3 className="font-serif text-xl font-bold text-[#FAFAFA]">
                  The 4-Stage Commission Process
                </h3>
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-[#141418] border border-[#D4AF37]/20">
                    <strong className="text-[#FBBF24] block font-serif">1. Confidential Design Consultation</strong>
                    <span>Discuss gemstone preferences, historic references, and budget allocations.</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#141418] border border-[#D4AF37]/20">
                    <strong className="text-[#FBBF24] block font-serif">2. Hand-Painted Gouache Renderings</strong>
                    <span>Master artisans produce scaled hand-painted watercolors from three perspectives.</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#141418] border border-[#D4AF37]/20">
                    <strong className="text-[#FBBF24] block font-serif">3. Direct Diamond Sourcing</strong>
                    <span>Select your stone from a curated tray of GIA certified conflict-free diamonds.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= VIEW 5: PRIVATE SALON VIEWING ================= */}
        {activePage === "appointment" && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 text-left">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-bold font-sans">
                Confidential Viewing
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-[#FAFAFA]">
                Schedule a Private Salon Appointment
              </h1>
              <p className="text-xs sm:text-sm text-[#A89F91] font-sans">
                Reserve an exclusive consultation in our private salons on the Rue du Rhône, Geneva or Bahnhofstrasse, Zürich.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#0E0E12] border border-[#D4AF37]/30 space-y-6 shadow-2xl font-sans">
              {appointmentBooked ? (
                <div className="text-center py-12 space-y-3">
                  <div className="w-16 h-16 rounded-full bg-[#10B981]/20 border border-[#10B981] text-[#34D399] flex items-center justify-center mx-auto">
                    <Check size={32} />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-[#FAFAFA]">
                    Private Appointment Confirmed
                  </h3>
                  <p className="text-xs text-[#A89F91] max-w-md mx-auto">
                    Thank you, {appointmentName}. Our senior concierge will arrange your private champagne viewing at our {appointmentSalon} salon for {appointmentDate}.
                  </p>
                  <button
                    onClick={() => setActivePage("catalog")}
                    className="mt-4 px-6 py-3 bg-[#D4AF37] text-[#0A0A0C] font-black rounded-xl text-xs"
                  >
                    Return to Vault
                  </button>
                </div>
              ) : (
                <form onSubmit={handleBookAppointment} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#FAFAFA] uppercase">Full Name</label>
                      <input
                        type="text"
                        required
                        value={appointmentName}
                        onChange={(e) => setAppointmentName(e.target.value)}
                        placeholder="Lord / Lady Vance"
                        className="w-full bg-[#141418] text-xs text-[#FAFAFA] p-3 rounded-xl border border-[#D4AF37]/30 focus:border-[#FBBF24] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#FAFAFA] uppercase">Salon Location</label>
                      <select
                        value={appointmentSalon}
                        onChange={(e) => setAppointmentSalon(e.target.value)}
                        className="w-full bg-[#141418] text-xs text-[#FAFAFA] p-3 rounded-xl border border-[#D4AF37]/30 focus:border-[#FBBF24] focus:outline-none cursor-pointer"
                      >
                        <option value="Geneva">Geneva Salon (Rue du Rhône 42)</option>
                        <option value="Zurich">Zürich Salon (Bahnhofstrasse 18)</option>
                        <option value="Virtual">Confidential Encrypted Video Salon</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#FAFAFA] uppercase">Preferred Date</label>
                    <input
                      type="date"
                      required
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      className="w-full bg-[#141418] text-xs text-[#FAFAFA] p-3 rounded-xl border border-[#D4AF37]/30 focus:border-[#FBBF24] focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-[#D4AF37] to-[#AA771C] hover:from-[#E5C158] hover:to-[#B88622] text-[#0A0A0C] font-black rounded-2xl text-xs uppercase tracking-widest transition cursor-pointer shadow-lg mt-4"
                  >
                    Confirm Private Salon Booking
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* ================= VIEW 6: OFFERS & SUITES ================= */}
        {activePage === "offers" && (
          <Offer
            products={jewelItems}
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
            onOpenVault={() => {
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
            relatedProducts={jewelItems}
            onSelectProduct={handleSelectProduct}
            onOpenAppointment={() => {
              setActivePage("appointment");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
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

      {/* ================= 4. JEWEL BOX CART DRAWER ================= */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
        themeColors={{ primary: "#D4AF37" }}
      />
    </div>
  );
}
