import React, { useState, useMemo } from "react";
import {
  ShoppingBag,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Check,
  ArrowRight,
  Compass,
  Award,
  Layers,
  Heart,
  SlidersHorizontal,
  Briefcase,
  ChevronRight,
  Feather,
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

export default function BagStoreTemplate({
  business = {},
  products = [],
  categories = [],
  offers = [],
  reviews = [],
  customization = {},
}) {
  // Navigation: "home" | "catalog" | "leather-craft" | "monogram" | "offers" | "warranty" | "product-detail"
  const [activePage, setActivePage] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);

  // Search & Filters
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Monogram Studio State
  const [monogramText, setMonogramText] = useState("J.V.");
  const [monogramFoil, setMonogramFoil] = useState("Gold");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart?.cartItems || []);

  const defaultProducts = [
    {
      _id: "bag-1",
      name: "The Executive Full-Grain Leather Briefcase",
      price: 385.0,
      compareAtPrice: 460.0,
      leather: "Vachetta Tan",
      category: "Briefcases",
      capacity: "Fits 16\" MacBook Pro",
      rating: 4.9,
      reviewCount: 64,
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
      description: "Handcrafted from 6oz Tuscan vegetable-tanned leather with solid brass hardware, padded laptop compartment, and dual smartphone sleeves.",
      inStock: true,
    },
    {
      _id: "bag-2",
      name: "The Weekender 48-Hour Heritage Duffel",
      price: 440.0,
      compareAtPrice: 520.0,
      leather: "Cognac Brown",
      category: "Weekenders & Duffels",
      capacity: "42 Liters Overhead Compliant",
      rating: 5.0,
      reviewCount: 88,
      image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80",
      description: "Reinforced luggage-grade leather base, removable wool shoulder strap, waterproof lining, and integrated passport pocket.",
      inStock: true,
    },
    {
      _id: "bag-3",
      name: "The Minimalist Sculpted Day Tote",
      price: 295.0,
      compareAtPrice: 350.0,
      leather: "Obsidian Black",
      category: "Totes",
      capacity: "Fits 14\" Laptop & Essentials",
      rating: 4.8,
      reviewCount: 42,
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80",
      description: "Structured seamless silhouette with magnetic closure, reinforced handles, and dual interior organizer zip pockets.",
      inStock: true,
    },
    {
      _id: "bag-4",
      name: "The Urban Commuter Roll-Top Backpack",
      price: 360.0,
      compareAtPrice: 420.0,
      leather: "Vachetta Tan",
      category: "Backpacks",
      capacity: "Expandable 24L • Fits 16\" Laptop",
      rating: 4.9,
      reviewCount: 56,
      image: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&auto=format&fit=crop&q=80",
      description: "Ergonomic padded leather shoulder straps, expandable roll-top capacity, and quick-access trolley pass-through sleeve.",
      inStock: true,
    },
    {
      _id: "bag-5",
      name: "The Florentine Crossbody Saddle Bag",
      price: 225.0,
      compareAtPrice: 275.0,
      leather: "Heritage Olive",
      category: "Accessories",
      capacity: "Compact 6L Travel Silhouette",
      rating: 4.9,
      reviewCount: 38,
      image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80",
      description: "Classic equestrian curved silhouette with solid brass turnkey lock and adjustable bridle leather crossbody strap.",
      inStock: true,
    },
    {
      _id: "bag-6",
      name: "The Pilot Leather Dopp Kit & Travel Case",
      price: 110.0,
      compareAtPrice: 135.0,
      leather: "Cognac Brown",
      category: "Accessories",
      capacity: "Waterproof Toiletry Organizers",
      rating: 5.0,
      reviewCount: 71,
      image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80",
      description: "Wide-mouth framed opening with washable moisture-resistant interior lining and heavy-duty brass zipper.",
      inStock: true,
    },
  ];

  const bagItems = products.length > 0 ? products : defaultProducts;

  const brandName =
    business?.businessName ||
    business?.name ||
    customization?.heroHeadline ||
    "CUIR & CO.";

  const brandLogo = customization?.logo || business?.logo || null;
  const brandPhone =
    business?.phone ||
    business?.businessPhone ||
    business?.contactPhone ||
    "+39 055 289 400";
  const brandEmail =
    business?.email ||
    business?.businessEmail ||
    business?.contactEmail ||
    "concierge@cuirandco.it";

  const rawAddr = business?.address || business?.registered_business_address;
  const brandAddress =
    typeof rawAddr === "string"
      ? rawAddr
      : rawAddr && typeof rawAddr === "object"
      ? [rawAddr.street, rawAddr.addressLine2, rawAddr.city, rawAddr.state, rawAddr.postalCode, rawAddr.country]
          .filter(Boolean)
          .join(", ")
      : "Via de' Benci 24, 50122 Firenze, Italy";

  const handleAddToCart = (product, qty = 1) => {
    if (isOutOfStock(product)) {
      toast.error(`Sorry, ${product.name} is currently out of stock!`);
      return;
    }
    dispatch(addToCart({ product, quantity: qty }));
    toast.success(`${product.name} added to Carry Cart! 🧳`);
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

  return (
    <div className="min-h-screen flex flex-col font-serif bg-[#FAF7F2] text-[#2C1810] antialiased selection:bg-[#B45309]/20 selection:text-[#B45309]">
      {/* ================= 1. ATELIER NAVBAR ================= */}
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
        onOpenMonogram={() => {
          setActivePage("monogram");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />

      {/* ================= 2. MAIN ACTIVE PAGE ================= */}
      <main className="flex-1">
        {/* ================= VIEW 1: HOME ================= */}
        {activePage === "home" && (
          <>
            {/* HERO SECTION */}
            <section className="relative overflow-hidden bg-[#FAF7F2] pt-12 pb-20 md:pt-20 md:pb-28 border-b border-[#E7DFD5]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  <div className="lg:col-span-7 space-y-6 text-left">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFE9DF] border border-[#D5C7B8] text-[#2C1810] text-xs font-bold">
                      <Sparkles size={14} className="text-[#B45309]" />
                      <span>The Heritage Leather Collection 2026</span>
                    </div>

                    <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#2C1810] leading-[1.08]">
                      Heirloom Vegetable-Tanned Tuscan Leather.
                    </h1>

                    <p className="text-sm sm:text-base text-[#6B5344] leading-relaxed max-w-xl font-sans">
                      Handcrafted in Santa Croce sull'Arno using centuries-old chestnut bark infusions and solid cast antique brass hardware. Designed to age with your journeys and develop a magnificent living patina.
                    </p>

                    <div className="flex flex-wrap gap-4 pt-2">
                      <button
                        onClick={() => {
                          setActivePage("catalog");
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="px-8 py-4 bg-[#2C1810] hover:bg-[#3D2217] text-[#FAF7F2] rounded-2xl text-xs font-bold uppercase tracking-widest transition shadow-lg flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5 active:scale-95"
                      >
                        <Briefcase size={17} className="text-[#D97706]" />
                        <span>Explore Silhouettes</span>
                      </button>

                      <button
                        onClick={() => {
                          setActivePage("monogram");
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="px-7 py-4 bg-white border border-[#D5C7B8] hover:border-[#8C6D58] text-[#2C1810] rounded-2xl text-xs font-bold uppercase tracking-widest transition flex items-center gap-2 cursor-pointer shadow-sm"
                      >
                        <Sparkles size={16} className="text-[#B45309]" />
                        <span>Bespoke 24k Monogram</span>
                      </button>
                    </div>

                    {/* Tuscan Metrics Strip */}
                    <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#E7DFD5] text-left">
                      <div>
                        <span className="text-xl sm:text-2xl font-bold text-[#2C1810]">6 oz Hide</span>
                        <p className="text-[11px] text-[#8C6D58] font-sans mt-0.5">Full-Grain Vachetta</p>
                      </div>
                      <div>
                        <span className="text-xl sm:text-2xl font-bold text-[#2C1810]">Lifetime</span>
                        <p className="text-[11px] text-[#8C6D58] font-sans mt-0.5">Stitching Guarantee</p>
                      </div>
                      <div>
                        <span className="text-xl sm:text-2xl font-bold text-[#B45309]">24k Gold</span>
                        <p className="text-[11px] text-[#8C6D58] font-sans mt-0.5">Complimentary Monogram</p>
                      </div>
                    </div>
                  </div>

                  {/* Hero Visual Card */}
                  <div className="lg:col-span-5 relative">
                    <div className="aspect-[4/3] rounded-[36px] overflow-hidden shadow-2xl border-4 border-white bg-[#FAF7F2] relative group">
                      <img
                        src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=900&auto=format&fit=crop&q=80"
                        alt="The Weekender Heritage Duffel"
                        className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#2C1810]/70 via-transparent to-transparent" />

                      <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white">
                        <div>
                          <span className="text-xs font-bold uppercase tracking-widest text-[#FBBF24]">
                            Flagship Travel Carry
                          </span>
                          <h4 className="text-lg font-bold">The Weekender 48-Hour Duffel</h4>
                        </div>
                        <button
                          onClick={() => handleSelectProduct(bagItems[1])}
                          className="p-3 bg-[#FAF7F2] hover:bg-white text-[#2C1810] rounded-xl transition cursor-pointer font-bold shadow-lg"
                        >
                          <ChevronRight size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* FEATURED HERITAGE SILHOUETTES */}
            <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-left">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-[#E7DFD5] pb-6">
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#B45309] font-bold">
                    Pelletteria Fiorentina
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-black text-[#2C1810] mt-1">
                    Featured Handcrafted Carry
                  </h2>
                </div>

                <button
                  onClick={() => {
                    setActivePage("catalog");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B45309] hover:underline cursor-pointer"
                >
                  <span>View Full Silhouette Catalog ({bagItems.length} designs)</span>
                  <ArrowRight size={14} />
                </button>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {bagItems.slice(0, 4).map((item) => (
                  <ProductCard
                    key={item._id}
                    product={item}
                    onSelectProduct={handleSelectProduct}
                    onAddToCart={handleAddToCart}
                    onOpenMonogram={() => {
                      setActivePage("monogram");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  />
                ))}
              </div>
            </section>

            {/* ATELIER CRAFTSMANSHIP SPOTLIGHT */}
            <section className="py-16 bg-[#F3EDE3] border-y border-[#E7DFD5]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
                  <span className="text-xs uppercase tracking-widest text-[#B45309] font-bold">
                    Uncompromising Standards
                  </span>
                  <h2 className="text-3xl font-black text-[#2C1810]">
                    The Florentine Guild Difference
                  </h2>
                  <p className="text-xs text-[#6B5344] font-sans">
                    Every hide is inspected for density, hand-cut, beveled, and finished with organic vegetable extracts.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                  <div
                    onClick={() => {
                      setActivePage("leather-craft");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="p-6 rounded-3xl bg-white border border-[#E7DFD5] hover:border-[#8C6D58] transition cursor-pointer group shadow-sm"
                  >
                    <Award size={28} className="text-[#B45309] mb-4 group-hover:scale-110 transition duration-300" />
                    <h3 className="text-lg font-bold text-[#2C1810] group-hover:text-[#B45309]">Vegetable Tanned Bark</h3>
                    <p className="text-xs text-[#6B5344] mt-2 leading-relaxed font-sans">
                      Processed using natural chestnut and mimosa tannins rather than toxic chromium salts, ensuring rich leather aroma.
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-xs text-[#B45309] font-bold">
                      Read Leather Story <ArrowRight size={13} />
                    </span>
                  </div>

                  <div
                    onClick={() => {
                      setActivePage("monogram");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="p-6 rounded-3xl bg-white border border-[#E7DFD5] hover:border-[#8C6D58] transition cursor-pointer group shadow-sm"
                  >
                    <Sparkles size={28} className="text-[#B45309] mb-4 group-hover:scale-110 transition duration-300" />
                    <h3 className="text-lg font-bold text-[#2C1810] group-hover:text-[#B45309]">Bespoke Monogramming</h3>
                    <p className="text-xs text-[#6B5344] mt-2 leading-relaxed font-sans">
                      Personalize your bag with 24k gold foil or blind debossed initials using our heated brass artisan stamping press.
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-xs text-[#B45309] font-bold">
                      Launch Monogram Studio <ArrowRight size={13} />
                    </span>
                  </div>

                  <div
                    onClick={() => {
                      setActivePage("offers");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="p-6 rounded-3xl bg-white border border-[#E7DFD5] hover:border-[#8C6D58] transition cursor-pointer group shadow-sm"
                  >
                    <Briefcase size={28} className="text-[#B45309] mb-4 group-hover:scale-110 transition duration-300" />
                    <h3 className="text-lg font-bold text-[#2C1810] group-hover:text-[#B45309]">Curated Luggage Sets</h3>
                    <p className="text-xs text-[#6B5344] mt-2 leading-relaxed font-sans">
                      Acquire matching briefcase and weekender duffel sets with up to 25% instant atelier savings.
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-xs text-[#B45309] font-bold">
                      View Travel Sets <ArrowRight size={13} />
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {/* ================= VIEW 2: LEATHER CATALOG ================= */}
        {activePage === "catalog" && (
          <Product
            products={bagItems}
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
            onOpenMonogram={() => {
              setActivePage("monogram");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        )}

        {/* ================= VIEW 3: BESPOKE MONOGRAM STUDIO ================= */}
        {activePage === "monogram" && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 text-left">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs uppercase tracking-[0.2em] text-[#B45309] font-bold">
                Personalized Leather Stamping
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-[#2C1810]">
                Bespoke 24k Hot-Foil Monogram Studio
              </h1>
              <p className="text-xs sm:text-sm text-[#6B5344] font-sans">
                Every Cuir & Co. bag is eligible for complimentary artisan hot-foil stamping. Test your initials below to preview the finished leather deboss.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-[#E7DFD5] space-y-8 shadow-md">
              {/* Interactive Leather Patch Visualizer */}
              <div className="aspect-[3/1] max-w-lg mx-auto rounded-3xl bg-gradient-to-r from-[#3D2217] via-[#2C1810] to-[#3D2217] border-4 border-[#D5C7B8] flex items-center justify-center shadow-2xl relative">
                <div className="text-center space-y-1">
                  <span className="text-[10px] uppercase tracking-widest text-[#D5C7B8] font-sans">
                    Hand-Debossed in Florence
                  </span>
                  <span className={`text-4xl sm:text-6xl font-black tracking-widest block transition-all duration-300 ${
                    monogramFoil === "Gold"
                      ? "text-[#FBBF24] drop-shadow-[0_2px_10px_rgba(251,191,36,0.5)]"
                      : monogramFoil === "Silver"
                      ? "text-slate-100 drop-shadow-[0_2px_10px_rgba(255,255,255,0.4)]"
                      : "text-[#1A0E0A] drop-shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]"
                  }`}>
                    {monogramText.trim() ? monogramText.toUpperCase() : "C.C."}
                  </span>
                </div>
              </div>

              {/* Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#2C1810] uppercase">
                    Enter Your Initials (Max 3 letters)
                  </label>
                  <input
                    type="text"
                    maxLength={3}
                    value={monogramText}
                    onChange={(e) => setMonogramText(e.target.value)}
                    placeholder="J.V."
                    className="w-full bg-[#FAF7F2] text-sm font-bold uppercase text-[#2C1810] px-4 py-3 rounded-xl border border-[#D5C7B8] focus:border-[#B45309] focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#2C1810] uppercase">
                    Foil Stamping Style
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "Gold", label: "24k Gold Foil" },
                      { id: "Silver", label: "Pure Silver Leaf" },
                      { id: "Blind", label: "Blind Heat Deboss" },
                    ].map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setMonogramFoil(f.id)}
                        className={`py-3 rounded-xl text-xs font-bold transition cursor-pointer border ${
                          monogramFoil === f.id
                            ? "bg-[#2C1810] text-white border-[#2C1810] shadow-sm"
                            : "bg-[#FAF7F2] text-[#6B5344] border-[#E7DFD5]"
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-center pt-4 border-t border-[#E7DFD5]">
                <button
                  onClick={() => {
                    toast.success(`Monogram "[${monogramText.toUpperCase()} - ${monogramFoil}]" saved! Choose any bag in the catalog to apply.`);
                    setActivePage("catalog");
                  }}
                  className="px-8 py-3.5 bg-[#2C1810] hover:bg-[#3D2217] text-[#FAF7F2] rounded-2xl text-xs font-bold uppercase tracking-widest transition cursor-pointer shadow-lg"
                >
                  Apply to a Leather Silhouette
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= VIEW 4: TUSCAN ATELIER LEATHER CRAFT ================= */}
        {activePage === "leather-craft" && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 text-left">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs uppercase tracking-[0.2em] text-[#B45309] font-bold">
                Santa Croce sull'Arno
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-[#2C1810]">
                Centuries of Tuscan Vegetable Tanning
              </h1>
              <p className="text-xs sm:text-sm text-[#6B5344] font-sans">
                Unlike industrial chrome-tanned leather that decays within years, vegetable-tanned hides become richer, softer, and more characterful with every journey.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border border-[#E7DFD5]">
                <img
                  src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900&auto=format&fit=crop&q=80"
                  alt="Tuscan leather workshop"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-4 font-sans text-xs text-[#6B5344] leading-relaxed">
                <h3 className="font-serif text-xl font-bold text-[#2C1810]">
                  The Living Patina Journey
                </h3>
                <p>
                  Our leather is tanned in traditional wooden drums over 40 days using vegetable extracts derived exclusively from chestnut wood, mimosa, and quebracho trees.
                </p>
                <p>
                  As sunlight, humidity, and the natural oils of your hands interact with the uncorrected grain, the leather oxidizes from a soft golden honey hue into a rich, deep amber caramel.
                </p>
                <div className="pt-2 flex items-center gap-4 text-[#2C1810] font-serif font-bold">
                  <span className="flex items-center gap-1 text-[#B45309]">
                    <Check size={16} /> 100% Biodegradable
                  </span>
                  <span className="flex items-center gap-1 text-[#B45309]">
                    <Check size={16} /> Zero Chromium Salts
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= VIEW 5: CURATED OFFERS & BUNDLES ================= */}
        {activePage === "offers" && (
          <Offer
            products={bagItems}
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
            onOpenCatalog={() => {
              setActivePage("catalog");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        )}

        {/* ================= VIEW 6: PRODUCT DETAIL INSPECTOR ================= */}
        {activePage === "product-detail" && selectedProduct && (
          <ProductDetails
            product={selectedProduct}
            onBack={() => {
              setActivePage("catalog");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onAddToCart={handleAddToCart}
            relatedProducts={bagItems}
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

      {/* ================= 4. CARRY CART DRAWER ================= */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
        themeColors={{ primary: "#2C1810" }}
      />
    </div>
  );
}
