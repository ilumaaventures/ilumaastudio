import React, { useState } from "react";
import {
  ShoppingBag,
  Search,
  Star,
  Sparkles,
  Zap,
  ShieldCheck,
  Check,
  Clock,
  ArrowRight,
  Flame,
  Award,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToCart, updateCartQuantity, removeFromCart } from "../../../redux/reducers/cartReducer";
import toast from "react-hot-toast";
import { isOutOfStock, getProductStock } from "../../../utils/stockUtils";
import CartDrawer from "../../common/CartDrawer";
import ProductDetailsPage from "../../common/ProductDetailsPage";
import { getProductImage } from "../../../utils/productImage";

export default function ShoesStoreTemplate({
  business = {},
  products = [],
  categories = [],
  offers = [],
  reviews = [],
  customization = {},
}) {
  const [activePage, setActivePage] = useState("home"); // "home" | "sneaker-vault" | "drops-calendar" | "sole-tech" | "authenticity-guarantee" | "product-detail"
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState("all");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart?.cartItems || []);

  const defaultKicks = [
    {
      _id: "shoe-1",
      name: "AeroPulse Pro Carbon Propulsion Runner",
      category: "Running",
      price: 220.0,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
      description: "Full-length carbon fiber propulsion plate with nitrogen-infused supercritical foam for 85% energy return.",
    },
    {
      _id: "shoe-2",
      name: "Retro High-Top Court Edition '85",
      category: "Basketball",
      price: 185.0,
      image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&auto=format&fit=crop&q=80",
      description: "Premium tumbled leather upper, padded collar, encapsulated air heel cushioning, and vintage aged rubber outsole.",
    },
    {
      _id: "shoe-3",
      name: "Minimalist Artisan Calfskin Low Sneaker",
      category: "Luxury Casual",
      price: 260.0,
      image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&auto=format&fit=crop&q=80",
      description: "Italian buttero calf leather, Margom rubber cupsole, and waxed cotton laces hand-stitched in Civitanova Marche.",
    },
    {
      _id: "shoe-4",
      name: "TerraGrip All-Weather Vibram Trail Boot",
      category: "Outdoor Trail",
      price: 245.0,
      image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop&q=80",
      description: "Waterproof ripstop membrane, TPU protective mudguard, and deep-lugged Vibram Megagrip traction outsole.",
    },
  ];

  const shoes = products.length > 0 ? products : defaultKicks;
  const kicks = shoes;

  const brandName =
    business?.businessName ||
    business?.name ||
    customization?.heroHeadline ||
    "SOLECRAFT";

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
    "drops@solecraft.io";

  const rawAddr = business?.address || business?.registered_business_address;
  const brandAddress =
    typeof rawAddr === "string"
      ? rawAddr
      : rawAddr && typeof rawAddr === "object"
      ? [rawAddr.street, rawAddr.addressLine2, rawAddr.city, rawAddr.state, rawAddr.postalCode, rawAddr.country]
          .filter(Boolean)
          .join(", ")
      : null;

  const handleAddToCart = (kick, size = "US 10") => {
    if (isOutOfStock(kick)) {
      toast.error(`Sorry, ${kick.name || "item"} is out of stock!`);
      return;
    }
    dispatch(addToCart({ product: { ...kick, selectedSize: size }, quantity: 1 }));
    toast.success(`${kick.name || "Item"} added to cart!`);
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

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#09090B] text-zinc-100">
      {/* ================= BESPOKE SNEAKER NAVBAR ================= */}
      <header className="sticky top-0 z-40 bg-[#09090B]/95 backdrop-blur-md border-b border-zinc-800">
        <div className="bg-[#84CC16] text-black font-mono font-black uppercase text-[10px] tracking-widest py-1.5 px-4 text-center">
          <span>⚡ NEXT SNEAKER DROP: 04:12:35 • 100% Verified Authentic Deadstock • Free Express Shipping</span>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          <div onClick={() => setActivePage("home")} className="flex items-center gap-3 cursor-pointer group">
            {brandLogo ? (
              <img
                src={brandLogo}
                alt={brandName}
                className="h-10 sm:h-12 w-auto max-w-[150px] object-contain rounded-lg"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-[#84CC16] text-black flex items-center justify-center font-black shadow-lg shadow-lime-500/20">
                <Zap size={22} className="fill-black" />
              </div>
            )}
            <div>
              <span className="text-xl font-black uppercase tracking-wider text-white block leading-tight font-mono">
                {brandName}
              </span>
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#84CC16] block">
                {business?.tagline || business?.category || "Athletic & Streetwear Footwear"}
              </span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-7 text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
            {[
              { id: "home", label: "Drop Home" },
              { id: "sneaker-vault", label: "Sneaker Vault" },
              { id: "drops-calendar", label: "Drops Calendar" },
              { id: "sole-tech", label: "Propulsion Tech" },
              { id: "authenticity-guarantee", label: "Authenticity Tag" },
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
                    isActive ? "text-[#84CC16] font-black" : "hover:text-white"
                  }`}
                >
                  <span>{tab.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#84CC16] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCartOpen(true)}
              className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-[#84CC16] hover:bg-zinc-800 transition cursor-pointer flex items-center gap-2 font-mono text-xs"
            >
              <ShoppingBag size={18} />
              <span className="hidden sm:inline">Shoebox</span>
              {cartCount > 0 && (
                <span className="bg-[#84CC16] text-black text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
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
            {/* Sneaker Hero */}
            <section className="py-20 md:py-28 relative overflow-hidden border-b border-zinc-800 bg-gradient-to-b from-zinc-900/60 to-transparent">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-7 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-500/10 text-[#84CC16] text-xs font-mono font-bold border border-lime-500/30">
                    <Flame size={14} />
                    <span>Limited Launch • Carbon Fiber Plate Technology</span>
                  </div>

                  <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white leading-tight font-mono">
                    Engineered for Velocity. Styled for the Streets.
                  </h1>

                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-xl font-normal">
                    Proprietary nitrogen-infused supercritical foam cushioning coupled with Italian tumbled calfskin. Precision tuned for elite marathoners and collectors alike.
                  </p>

                  <div className="flex flex-wrap gap-4 pt-2 font-mono">
                    <button
                      onClick={() => setActivePage("sneaker-vault")}
                      className="px-8 py-4 bg-[#84CC16] hover:bg-lime-400 text-black font-black text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-lime-500/20 flex items-center gap-2 cursor-pointer"
                    >
                      <Zap size={16} />
                      <span>Shop Sneaker Vault</span>
                    </button>
                    <button
                      onClick={() => setActivePage("drops-calendar")}
                      className="px-6 py-4 bg-zinc-900 border border-zinc-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition hover:bg-zinc-800 cursor-pointer"
                    >
                      Upcoming Drops Calendar
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl border border-zinc-800 bg-zinc-900">
                    <img
                      src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&auto=format&fit=crop&q=80"
                      alt="Sneaker Red"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Bestseller Kicks */}
            <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-[#84CC16]">Hype Silhouettes</span>
                  <h2 className="text-2xl sm:text-3xl font-black text-white font-mono">Trending on the Streets</h2>
                </div>
                <button
                  onClick={() => setActivePage("sneaker-vault")}
                  className="text-xs font-mono text-[#84CC16] hover:underline cursor-pointer"
                >
                  View All Silhouettes →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {shoes.slice(0, 4).map((kicks) => {
                  const outOfStock = isOutOfStock(kicks);
                  return (
                    <div
                      key={kicks._id}
                      onClick={() => {
                        setSelectedProduct(kicks);
                        setActivePage("product-detail");
                      }}
                      className="bg-zinc-900 rounded-3xl border border-zinc-800 p-5 space-y-4 flex flex-col justify-between shadow-2xs hover:border-zinc-700 transition cursor-pointer group"
                    >
                      <div className="space-y-3">
                        <div className="aspect-square rounded-2xl overflow-hidden bg-black">
                          <img src={getProductImage(kicks, kicks.image)} alt={kicks.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                        </div>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#84CC16] bg-lime-500/10 px-2 py-0.5 rounded">
                          {kicks.category}
                        </span>
                        <h4 className="text-sm font-bold text-white font-mono line-clamp-1 group-hover:text-[#84CC16] transition">{kicks.name}</h4>
                      </div>
                      <div className="pt-3 flex justify-between items-center border-t border-zinc-800">
                        <span className="text-lg font-mono font-black text-white">₹{Number(kicks.price).toFixed(2)}</span>
                        {outOfStock ? (
                          <span className="text-[10px] font-mono font-bold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                            Out of Stock
                          </span>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(kicks, "US 10");
                            }}
                            className="px-4 py-2 bg-[#84CC16] hover:bg-lime-400 text-black font-black font-mono rounded-xl text-xs uppercase cursor-pointer"
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

        {/* PAGE 2: SNEAKER VAULT */}
        {activePage === "sneaker-vault" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
            <div className="flex flex-col sm:flex-row justify-between items-baseline gap-4 border-b border-zinc-800 pb-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#84CC16]">Vault Archive</span>
                <h1 className="text-3xl font-black text-white font-mono">The Complete Sneaker Vault</h1>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase text-zinc-500">Size:</span>
                {["all", "8", "9", "10", "11", "12"].map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`w-9 h-9 rounded-xl text-xs font-mono font-bold transition cursor-pointer border ${
                      selectedSize === sz ? "bg-[#84CC16] text-black border-[#84CC16]" : "bg-zinc-900 text-zinc-300 border-zinc-800 hover:bg-zinc-800"
                    }`}
                  >
                    {sz === "all" ? "All" : sz}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {shoes.map((kicks) => {
                const outOfStock = isOutOfStock(kicks);
                return (
                  <div
                    key={kicks._id}
                    onClick={() => {
                      setSelectedProduct(kicks);
                      setActivePage("product-detail");
                    }}
                    className="bg-zinc-900 rounded-3xl border border-zinc-800 p-5 space-y-4 flex flex-col justify-between hover:border-zinc-700 transition cursor-pointer group"
                  >
                    <div className="space-y-3">
                      <div className="aspect-square rounded-2xl overflow-hidden bg-black">
                        <img src={getProductImage(kicks, kicks.image)} alt={kicks.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                      </div>
                      <span className="text-[10px] font-mono font-bold text-[#84CC16]">{kicks.category}</span>
                      <h4 className="text-sm font-bold text-white font-mono group-hover:text-[#84CC16] transition">{kicks.name}</h4>
                      <p className="text-xs text-zinc-400 line-clamp-2">{kicks.description}</p>
                    </div>
                    <div className="pt-3 flex justify-between items-center border-t border-zinc-800">
                      <span className="text-lg font-mono font-black text-white">₹{Number(kicks.price).toFixed(2)}</span>
                      {outOfStock ? (
                        <span className="text-[10px] font-mono font-bold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                          Out of Stock
                        </span>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(kicks, selectedSize === "all" ? "10" : selectedSize);
                          }}
                          className="px-4 py-2 bg-[#84CC16] hover:bg-lime-400 text-black font-black font-mono rounded-xl text-xs cursor-pointer"
                        >
                          + Add
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* PAGE 3: DROPS CALENDAR */}
        {activePage === "drops-calendar" && (
          <div className="max-w-4xl mx-auto px-4 py-16 space-y-12">
            <div className="text-center space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-[#84CC16]">Release Dates</span>
              <h1 className="text-3xl font-black text-white font-mono">Upcoming Sneaker Drops</h1>
              <p className="text-xs text-zinc-400">Set notifications for upcoming deadstock releases. High-demand drops release via verified raffle.</p>
            </div>

            <div className="space-y-6 font-mono text-xs">
              {[
                { title: "AeroPulse Neon Ghost Edition", dropDate: "September 12, 10:00 AM EST", price: "₹18,999", edition: "500 Pairs Worldwide" },
                { title: "Civitanova Low 'Pecan Italian Suede'", dropDate: "September 18, 12:00 PM EST", price: "₹22,499", edition: "Handmade in Italy" },
                { title: "Retro High 85 'Shadow Black'", dropDate: "October 01, 10:00 AM EST", price: "₹15,499", edition: "Numbered Box Set" },
              ].map((drop) => (
                <div key={drop.title} className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="space-y-1 text-center sm:text-left">
                    <span className="text-[10px] text-[#84CC16] font-bold">RELEASE: {drop.dropDate}</span>
                    <h3 className="text-base font-bold text-white">{drop.title}</h3>
                    <p className="text-zinc-500">{drop.edition}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-base font-black text-white">{drop.price}</span>
                    <button className="px-4 py-2 bg-zinc-800 hover:bg-[#84CC16] hover:text-black transition text-white font-bold rounded-xl text-xs uppercase">
                      Notify Me
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PAGE 4: SOLE TECH */}
        {activePage === "sole-tech" && (
          <div className="max-w-4xl mx-auto px-4 py-16 space-y-12">
            <div className="text-center space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-[#84CC16]">Biomechanics</span>
              <h1 className="text-3xl font-black text-white font-mono">Supercritical Cushioning & Propulsion</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono">
              <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-3">
                <Zap size={28} className="text-[#84CC16]" />
                <h4 className="text-base font-bold text-white">Curved Carbon Plate</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">Full-length spoon-shaped carbon plate provides a spring-board lever action that reduces calf fatigue.</p>
              </div>
              <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-3">
                <Sparkles size={28} className="text-[#84CC16]" />
                <h4 className="text-base font-bold text-white">Nitrogen Infused Foam</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">Supercritical gas infusion creates millions of microscopic closed micro-bubbles for bouncy shock absorption.</p>
              </div>
              <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-3">
                <ShieldCheck size={28} className="text-[#84CC16]" />
                <h4 className="text-base font-bold text-white">Vibram Megagrip Rubber</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">High-friction compound tested in Alpine wet rock conditions for zero slipping on wet city pavements.</p>
              </div>
            </div>
          </div>
        )}

        {/* PAGE 5: AUTHENTICITY GUARANTEE */}
        {activePage === "authenticity-guarantee" && (
          <div className="max-w-3xl mx-auto px-4 py-16 space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-black text-white font-mono">The SoleCraft Authenticity Tag</h1>
              <p className="text-xs text-zinc-400 font-mono">Zero counterfeits. Every sneaker ships with a tamper-proof RFID verification seal.</p>
            </div>

            <div className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4 text-xs font-mono text-zinc-400 leading-relaxed">
              <p>
                Our team of seasoned sneaker authenticators evaluates stitch tension, blacklight UV glue stamps, box label typography, and leather scent before applying our green holographic seal.
              </p>
              <div className="p-4 rounded-2xl bg-black border border-zinc-800 text-white">
                <span className="font-bold text-[#84CC16] block">Hassle-Free Money Back</span>
                <span>If any verified sneaker is found non-conforming, we provide a 200% full refund with prepaid return shipping.</span>
              </div>
            </div>
          </div>
        )}

        {/* PAGE: PRODUCT DETAIL */}
        {activePage === "product-detail" && selectedProduct && (
          <div className="bg-[#09090B] min-h-screen py-6 text-zinc-100">
            <ProductDetailsPage
              product={selectedProduct}
              onBack={() => setActivePage("home")}
              onAddToCart={(p, q) => handleAddToCart(p, p.selectedSize || "US 10")}
              themeColors={{ primary: "#84CC16", secondary: "#A3E635", text: "#FFFFFF", background: "#09090B", cardBg: "#18181B" }}
              business={business}
              relatedProducts={shoes}
              onSelectProduct={(p) => setSelectedProduct(p)}
            />
          </div>
        )}
      </main>

      {/* ================= BESPOKE SNEAKER FOOTER ================= */}
      <footer className="bg-black text-zinc-500 py-16 border-t border-zinc-900 text-xs font-mono">
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
                <Zap size={18} className="text-[#84CC16] fill-[#84CC16]" />
              )}
              <span className="text-base font-black text-white font-mono uppercase">{brandName}</span>
            </div>
            <p className="text-zinc-600 leading-relaxed text-[11px]">
              {business?.description || "Athletic carbon propulsion footwear, deadstock sneaker releases, and authentic Italian calfskin."}
            </p>
            {brandAddress && (
              <p className="text-zinc-600 text-[10px]">📍 {brandAddress}</p>
            )}
          </div>
          <div className="space-y-2">
            <h5 className="font-bold text-[#84CC16] uppercase text-[10px]">Silhouettes</h5>
            <p onClick={() => setActivePage("sneaker-vault")} className="hover:text-white cursor-pointer">Sneaker Vault</p>
            <p onClick={() => setActivePage("drops-calendar")} className="hover:text-white cursor-pointer">Drops Calendar</p>
          </div>
          <div className="space-y-2">
            <h5 className="font-bold text-[#84CC16] uppercase text-[10px]">Technology</h5>
            <p onClick={() => setActivePage("sole-tech")} className="hover:text-white cursor-pointer">Carbon Fiber Propulsion</p>
            <p onClick={() => setActivePage("authenticity-guarantee")} className="hover:text-white cursor-pointer">RFID Authenticity Tag</p>
          </div>
          <div className="space-y-2">
            <h5 className="font-bold text-[#84CC16] uppercase text-[10px]">Sneakerhead VIP</h5>
            {brandPhone && <p className="text-white font-bold">{brandPhone}</p>}
            <p className="text-white font-bold">{brandEmail}</p>
            <p className="text-zinc-600 text-[11px]">Global Dispatch Hub</p>
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
        themeColors={{ primary: "#84CC16" }}
      />
    </div>
  );
}
