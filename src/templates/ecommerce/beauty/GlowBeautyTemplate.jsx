import React, { useState } from "react";
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
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToCart, updateCartQuantity, removeFromCart } from "../../../redux/reducers/cartReducer";
import toast from "react-hot-toast";
import { isOutOfStock, getProductStock } from "../../../utils/stockUtils";
import CartDrawer from "../../common/CartDrawer";
import ProductDetailsPage from "../../common/ProductDetailsPage";
import { getProductImage } from "../../../utils/productImage";

export default function GlowBeautyTemplate({
  business = {},
  products = [],
  categories = [],
  offers = [],
  reviews = [],
  customization = {},
}) {
  const [activePage, setActivePage] = useState("home"); // "home" | "routines" | "shade-finder" | "ingredients" | "consultation" | "product-detail"
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedUndertone, setSelectedUndertone] = useState("Neutral");
  const [consultationSubmitted, setConsultationSubmitted] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart?.cartItems || []);

  const themeColors = customization.colors || {
    primary: "#DB2777",
    secondary: "#F472B6",
    accent: "#FB7185",
    background: "#FDF2F8",
    cardBg: "#FFFFFF",
    text: "#4C0519",
  };

  const brandName =
    business?.businessName ||
    business?.name ||
    customization?.heroHeadline ||
    "GLOW BEAUTY";

  const brandLogo =
    customization?.logo ||
    business?.logo ||
    null;

  const brandPhone =
    business?.phone ||
    business?.businessPhone ||
    business?.contactPhone ||
    null;

  const brandEmail =
    business?.email ||
    business?.businessEmail ||
    business?.contactEmail ||
    "support@glowbeauty.com";

  const rawAddr = business?.address || business?.registered_business_address;
  const brandAddress =
    typeof rawAddr === "string"
      ? rawAddr
      : rawAddr && typeof rawAddr === "object"
      ? [rawAddr.street, rawAddr.addressLine2, rawAddr.city, rawAddr.state, rawAddr.postalCode, rawAddr.country]
          .filter(Boolean)
          .join(", ")
      : null;

  const handleAddToCart = (product, qty = 1) => {
    if (isOutOfStock(product)) {
      toast.error(`Sorry, ${product.name || "item"} is out of stock!`);
      return;
    }
    dispatch(addToCart({ product, quantity: qty }));
    toast.success(`${product.name || "Item"} added to cart!`);
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

  const cleanIngredients = [
    { name: "Multi-Molecular Hyaluronic Acid", source: "Bio-fermented wheat", benefit: "Penetrates 5 skin layers to bind 1,000x its weight in moisture." },
    { name: "Clinical 5% Niacinamide", source: "Vitamin B3 botanical extract", benefit: "Minimizes pore visibility and visibly balances sebum production." },
    { name: "Plant-Derived Squalane", source: "100% Spanish Sugarcane", benefit: "Mimics natural skin lipids to lock in hydration without clogging pores." },
    { name: "Botanical Bakuchiol", source: "Babchi seeds", benefit: "Gentle natural alternative to retinol that smooths fine lines with zero irritation." },
  ];

  return (
    <div
      className="min-h-screen flex flex-col font-sans"
      style={{ backgroundColor: themeColors.background, color: themeColors.text }}
    >
      {/* ================= BESPOKE BEAUTY NAVBAR ================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-pink-100 shadow-xs">
        <div className="bg-pink-900 text-pink-100 text-[10px] font-bold py-1.5 px-4 text-center">
          <span>🌸 100% Clean Beauty • Cruelty-Free & Dermatologist Tested • Free Deluxe Sample on All Orders</span>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          <div
            onClick={() => setActivePage("home")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            {brandLogo ? (
              <img
                src={brandLogo}
                alt={brandName}
                className="h-10 sm:h-12 w-auto max-w-[150px] object-contain rounded-lg"
              />
            ) : (
              <div className="w-10 h-10 rounded-2xl bg-pink-500 text-white flex items-center justify-center font-serif text-lg shadow-sm">
                <Sparkles size={20} />
              </div>
            )}
            <div>
              <span className="text-xl font-serif font-black tracking-tight text-pink-950 block leading-tight">
                {brandName}
              </span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-pink-600 block">
                {business?.tagline || business?.category || "Clean Botanical Skincare"}
              </span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-7 text-xs font-bold text-pink-900/80">
            {[
              { id: "home", label: "Home" },
              { id: "routines", label: "Skincare Routines" },
              { id: "shade-finder", label: "Shade Match Quiz" },
              { id: "ingredients", label: "Clean Ingredients" },
              { id: "consultation", label: "Skin Consultation" },
            ].map((tab) => {
              const isActive = activePage === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActivePage(tab.id);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`transition cursor-pointer relative py-1 ${
                    isActive ? "text-pink-950 font-black" : "hover:text-pink-600"
                  }`}
                >
                  <span>{tab.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCartOpen(true)}
              className="p-2.5 rounded-2xl bg-pink-50 text-pink-700 hover:bg-pink-100 transition cursor-pointer flex items-center gap-2 font-bold text-xs"
            >
              <ShoppingBag size={18} />
              <span className="hidden sm:inline">Tote</span>
              {cartCount > 0 && (
                <span className="bg-pink-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1">
        {/* PAGE 1: HOME */}
        {activePage === "home" && (
          <>
            {/* Hero */}
            <section className="py-20 md:py-28 relative overflow-hidden bg-gradient-to-b from-pink-100/60 via-pink-50/40 to-transparent">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-7 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 text-pink-800 text-xs font-bold">
                    <Heart size={14} className="text-pink-600 fill-pink-600" />
                    <span>Vegan & Leaping Bunny Cruelty-Free</span>
                  </div>

                  <h1 className="text-4xl sm:text-6xl font-serif font-black tracking-tight text-pink-950 leading-tight">
                    Dewy, Luminous Skin Powered by Botanical Science.
                  </h1>

                  <p className="text-xs sm:text-sm text-pink-950/80 leading-relaxed max-w-xl font-normal">
                    Formulated without parabens, synthetic fragrances, or endocrine disruptors. Pure botanical squalane, active niacinamide, and cold-pressed floral essences.
                  </p>

                  <div className="flex flex-wrap gap-4 pt-2">
                    <button
                      onClick={() => setActivePage("routines")}
                      className="px-8 py-4 bg-pink-600 hover:bg-pink-700 text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition shadow-lg shadow-pink-600/20 cursor-pointer"
                    >
                      Build Your Daily Routine
                    </button>
                    <button
                      onClick={() => setActivePage("shade-finder")}
                      className="px-6 py-4 bg-white border border-pink-200 text-pink-900 rounded-2xl text-xs font-bold transition hover:bg-pink-50 cursor-pointer"
                    >
                      Take Shade Match Quiz
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <div className="aspect-4/3 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                    <img
                      src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=900&auto=format&fit=crop&q=80"
                      alt="Beauty Model"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Bestsellers */}
            <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-pink-600">Dermatologist Verified</span>
                  <h2 className="text-2xl sm:text-3xl font-serif font-black text-pink-950">Daily Essentials</h2>
                </div>
                <button
                  onClick={() => setActivePage("routines")}
                  className="text-xs font-bold text-pink-700 hover:underline cursor-pointer"
                >
                  View 3-Step Regimens →
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {products.slice(0, 4).map((item) => {
                  const outOfStock = isOutOfStock(item);
                  return (
                    <div
                      key={item._id}
                      onClick={() => {
                        setSelectedProduct(item);
                        setActivePage("product-detail");
                      }}
                      className="bg-white rounded-3xl border border-pink-100 p-4 space-y-3 flex flex-col justify-between shadow-2xs hover:shadow-md transition cursor-pointer group"
                    >
                      <div className="space-y-2">
                        <div className="aspect-square rounded-2xl overflow-hidden bg-pink-50">
                          <img src={getProductImage(item, item.image)} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-pink-950 line-clamp-1 group-hover:text-pink-600 transition">{item.name}</h4>
                      </div>
                      <div className="pt-2 flex justify-between items-center border-t border-pink-100">
                        <span className="text-sm font-black text-pink-950">₹{Number(item.price).toFixed(2)}</span>
                        {outOfStock ? (
                          <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-200">
                            Out of Stock
                          </span>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(item);
                            }}
                            className="px-3 py-1.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                          >
                            + Add
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

        {/* PAGE 2: SKINCARE ROUTINES */}
        {activePage === "routines" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-pink-600">Tailored Regimens</span>
              <h1 className="text-3xl font-serif font-black text-pink-950">Curated Skincare Routines</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: "Morning Dew & Glow", steps: ["Botanical Gel Cleanser", "Vitamin C Brightening Elixir", "Weightless Mineral SPF 50"], price: "₹3,499.00" },
                { title: "Night Moisture Barrier Repair", steps: ["Melt-Away Cleansing Balm", "Multi-Molecular Hyaluronic Serum", "Ceramide Night Cloud Cream"], price: "₹4,299.00" },
                { title: "Clarifying Gentle Blemish Control", steps: ["Tea Tree & Willow Bark Wash", "5% Niacinamide Balancing Tonic", "Oil-Free Squalane Gel Moisturizer"], price: "₹3,199.00" },
              ].map((routine) => (
                <div key={routine.title} className="p-6 rounded-3xl bg-white border border-pink-200 space-y-6 shadow-xs flex flex-col justify-between">
                  <div className="space-y-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-pink-100 text-pink-700 px-2.5 py-0.5 rounded-full">3-Step Regimen</span>
                    <h3 className="text-lg font-serif font-bold text-pink-950">{routine.title}</h3>
                    <div className="space-y-2 pt-2 border-t border-pink-100">
                      {routine.steps.map((st, i) => (
                        <p key={st} className="text-xs text-pink-900/80 flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-pink-100 text-pink-700 flex items-center justify-center font-bold text-[10px]">{i + 1}</span>
                          <span>{st}</span>
                        </p>
                      ))}
                    </div>
                  </div>
                  <div className="pt-4 border-t border-pink-100 flex items-center justify-between">
                    <span className="text-lg font-black text-pink-950">{routine.price}</span>
                    <button
                      onClick={() => handleAddToCart({ _id: routine.title, name: routine.title, price: 95, image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600" })}
                      className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-bold"
                    >
                      Add Full Routine
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PAGE 3: SHADE FINDER QUIZ */}
        {activePage === "shade-finder" && (
          <div className="max-w-2xl mx-auto px-4 py-16 space-y-8">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-pink-600">Digital Shade Lab</span>
              <h1 className="text-3xl font-serif font-black text-pink-950">Find Your Perfect Complexion Match</h1>
              <p className="text-xs text-pink-900/70">Select your skin undertone to see recommended serum foundation shades.</p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-pink-200 space-y-6">
              <div className="space-y-3">
                <label className="block text-xs font-bold text-pink-950 uppercase tracking-wider">Step 1: Your Skin Undertone</label>
                <div className="grid grid-cols-3 gap-3">
                  {["Cool (Rosy)", "Neutral (Balanced)", "Warm (Golden)"].map((tone) => (
                    <button
                      key={tone}
                      onClick={() => setSelectedUndertone(tone)}
                      className={`p-3.5 rounded-2xl text-xs font-bold border transition cursor-pointer ${
                        selectedUndertone === tone ? "bg-pink-600 text-white border-pink-600 shadow-xs" : "bg-pink-50 text-pink-900 border-pink-200"
                      }`}
                    >
                      {tone}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-pink-50 border border-pink-100 space-y-2">
                <span className="text-[10px] font-bold uppercase text-pink-600">Matched Complexion:</span>
                <h4 className="text-sm font-bold text-pink-950">Glow Veil Serum Foundation #{selectedUndertone.startsWith("Cool") ? "120C (Petal Porcelain)" : selectedUndertone.startsWith("Warm") ? "230W (Golden Nectar)" : "180N (Luminous Sand)"}</h4>
                <p className="text-xs text-pink-900/70">Infused with 1% hyaluronic acid and fermented peony extract for a second-skin satin finish.</p>
              </div>

              <button
                onClick={() => handleAddToCart({ _id: "matched-shade", name: `Glow Veil Foundation (${selectedUndertone})`, price: 1899, image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600" })}
                className="w-full py-3.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md"
              >
                Add Matched Shade to Tote (₹1,899.00)
              </button>
            </div>
          </div>
        )}

        {/* PAGE 4: CLEAN INGREDIENTS */}
        {activePage === "ingredients" && (
          <div className="max-w-4xl mx-auto px-4 py-16 space-y-10">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-pink-600">Clean Chemistry</span>
              <h1 className="text-3xl font-serif font-black text-pink-950">Transparent Ingredients A to Z</h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {cleanIngredients.map((ing) => (
                <div key={ing.name} className="p-6 rounded-3xl bg-white border border-pink-200 space-y-3 shadow-2xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-pink-600">Source: {ing.source}</span>
                  <h4 className="text-base font-bold text-pink-950">{ing.name}</h4>
                  <p className="text-xs text-pink-900/70 leading-relaxed">{ing.benefit}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PAGE 5: SKIN CONSULTATION */}
        {activePage === "consultation" && (
          <div className="max-w-xl mx-auto px-4 py-16 space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-serif font-black text-pink-950">Book a 1-on-1 Virtual Skin Consultation</h1>
              <p className="text-xs text-pink-900/70">Meet with a licensed aesthetician via secure video to design your customized skincare ritual.</p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-pink-200 space-y-4">
              {consultationSubmitted ? (
                <div className="text-center py-6 space-y-3">
                  <Sparkles size={32} className="text-pink-600 mx-auto" />
                  <h3 className="text-lg font-bold text-pink-950">Consultation Scheduled!</h3>
                  <p className="text-xs text-pink-900/70">You will receive your video invitation and skin questionnaire via email shortly.</p>
                </div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); setConsultationSubmitted(true); }} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-pink-950 mb-1">Your Full Name</label>
                    <input type="text" required placeholder="Emma Watson" className="w-full px-3.5 py-2.5 rounded-xl bg-pink-50 border border-pink-200 text-xs text-pink-950 focus:outline-hidden" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-pink-950 mb-1">Email Address</label>
                    <input type="email" required placeholder="emma@example.com" className="w-full px-3.5 py-2.5 rounded-xl bg-pink-50 border border-pink-200 text-xs text-pink-950 focus:outline-hidden" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-pink-950 mb-1">Primary Skin Concern</label>
                    <select className="w-full px-3.5 py-2.5 rounded-xl bg-pink-50 border border-pink-200 text-xs text-pink-950">
                      <option>Dryness & Moisture Barrier Repair</option>
                      <option>Hyperpigmentation & Dark Spots</option>
                      <option>Acne & Excess Sebum</option>
                      <option>Fine Lines & Firmness</option>
                    </select>
                  </div>
                  <button type="submit" className="w-full py-3.5 bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md">
                    Confirm Consultation Appointment
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* PAGE: PRODUCT DETAIL */}
        {activePage === "product-detail" && selectedProduct && (
          <ProductDetailsPage
            product={selectedProduct}
            onBack={() => setActivePage("home")}
            onAddToCart={handleAddToCart}
            themeColors={themeColors}
            business={business}
            relatedProducts={products}
            onSelectProduct={(p) => setSelectedProduct(p)}
          />
        )}
      </main>

      {/* ================= BESPOKE BEAUTY FOOTER ================= */}
      <footer className="bg-pink-950 text-pink-200 py-16 border-t border-pink-900 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              {brandLogo ? (
                <img
                  src={brandLogo}
                  alt={brandName}
                  className="h-8 w-auto max-w-[130px] object-contain rounded brightness-0 invert"
                />
              ) : (
                <Sparkles size={18} className="text-pink-400" />
              )}
              <span className="text-base font-serif font-black tracking-widest text-white uppercase">{brandName}</span>
            </div>
            <p className="text-pink-300/80 leading-relaxed text-[11px]">
              {business?.description || "Dermatological botanical science, non-toxic formulations, and recycled glass apothecary packaging."}
            </p>
            {brandAddress && (
              <p className="text-pink-300/70 text-[10px]">📍 {brandAddress}</p>
            )}
          </div>
          <div className="space-y-2">
            <h5 className="font-bold text-white uppercase text-[10px]">Routines</h5>
            <p onClick={() => setActivePage("routines")} className="hover:text-white cursor-pointer">Morning Dew Regimen</p>
            <p onClick={() => setActivePage("routines")} className="hover:text-white cursor-pointer">Night Repair Ritual</p>
          </div>
          <div className="space-y-2">
            <h5 className="font-bold text-white uppercase text-[10px]">Skin Lab</h5>
            <p onClick={() => setActivePage("shade-finder")} className="hover:text-white cursor-pointer">Shade Match Finder</p>
            <p onClick={() => setActivePage("ingredients")} className="hover:text-white cursor-pointer">Clean Ingredients A-Z</p>
          </div>
          <div className="space-y-2">
            <h5 className="font-bold text-white uppercase text-[10px]">Consultation</h5>
            <p onClick={() => setActivePage("consultation")} className="hover:text-white cursor-pointer">Virtual Aesthetician</p>
            {brandPhone && <p className="text-white font-bold">{brandPhone}</p>}
            <p className="text-pink-400 text-[11px]">{brandEmail}</p>
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
        themeColors={themeColors}
      />
    </div>
  );
}
