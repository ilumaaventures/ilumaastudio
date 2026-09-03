import React, { useState } from "react";
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
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToCart, updateCartQuantity, removeFromCart } from "../../../redux/reducers/cartReducer";
import toast from "react-hot-toast";
import { isOutOfStock, getProductStock } from "../../../utils/stockUtils";
import CartDrawer from "../../common/CartDrawer";
import ProductDetailsPage from "../../common/ProductDetailsPage";
import { getProductImage } from "../../../utils/productImage";

export default function LuxeJewelsTemplate({
  business = {},
  products = [],
  categories = [],
  offers = [],
  reviews = [],
  customization = {},
}) {
  const [activePage, setActivePage] = useState("home"); // "home" | "diamonds" | "bespoke" | "certification" | "appointment" | "product-detail"
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [appointmentBooked, setAppointmentBooked] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart?.cartItems || []);

  const themeColors = customization.colors || {
    primary: "#D4AF37",
    secondary: "#AA771C",
    accent: "#FBBF24",
    background: "#09090B",
    cardBg: "#18181B",
    text: "#FAFAFA",
  };

  const brandName =
    business?.businessName ||
    business?.name ||
    customization?.heroHeadline ||
    "LUXE JEWELS";

  const brandLogo =
    customization?.logo ||
    business?.logo ||
    null;

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
      : null;

  const handleAddToCart = (product, qty = 1) => {
    if (isOutOfStock(product)) {
      toast.error(`Sorry, ${product.name || "piece"} is out of stock!`);
      return;
    }
    dispatch(addToCart({ product, quantity: qty }));
    toast.success(`${product.name || "Piece"} added to cart!`);
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

  const diamondCuts = [
    { name: "Round Brilliant", facets: "57 Facets", fire: "Maximum Optical Dispersion", desc: "The ultimate classic with mathematically calibrated proportions for supreme light refraction." },
    { name: "Emerald Step Cut", facets: "58 Facets", fire: "Hall of Mirrors Clarity", desc: "Long rectangular parallel step facets displaying unparalleled crystalline purity." },
    { name: "Oval Silhouette Cut", facets: "56 Facets", fire: "Elongated Modern Fire", desc: "Soft-curved elliptical shape creating an elongated, elegant finger profile." },
    { name: "Cushion Cut", facets: "64 Facets", fire: "Vintage Romantic Sparkle", desc: "Pillow-shaped rounded corners that blend modern brilliance with antique allure." },
  ];

  return (
    <div
      className="min-h-screen flex flex-col font-sans bg-[#09090B] text-zinc-100 selection:bg-amber-400 selection:text-black"
    >
      {/* ================= BESPOKE FINE JEWELRY NAVBAR ================= */}
      <header className="sticky top-0 z-40 bg-[#09090B]/95 backdrop-blur-md border-b border-zinc-800 text-zinc-100">
        <div className="bg-black text-[#D4AF37] text-[10px] uppercase font-mono tracking-[0.2em] py-1.5 px-4 text-center border-b border-zinc-800/80">
          <span>GIA Certified Solitaires • Insured Armored Courier Transit • Kimberley Process Certified</span>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
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
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#AA771C] text-black flex items-center justify-center font-black text-lg shadow-lg shadow-amber-500/10">
                <Sparkles size={20} />
              </div>
            )}
            <div>
              <span className="text-xl font-serif font-black tracking-[0.2em] text-white block leading-tight">
                {brandName}
              </span>
              <span className="text-[9px] font-mono uppercase tracking-widest text-[#D4AF37] block">
                {business?.tagline || business?.category || "Haute Joaillerie • Genève"}
              </span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-7 text-xs font-serif uppercase tracking-wider text-zinc-400">
            {[
              { id: "home", label: "Home" },
              { id: "diamonds", label: "Diamond Cuts" },
              { id: "bespoke", label: "Bespoke Concierge" },
              { id: "certification", label: "GIA Certification" },
              { id: "appointment", label: "Private Vault" },
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
                    isActive ? "text-[#D4AF37] font-black" : "hover:text-white"
                  }`}
                >
                  <span>{tab.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4AF37] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCartOpen(true)}
              className="p-2.5 rounded-2xl bg-zinc-900 text-[#D4AF37] hover:bg-zinc-800 transition cursor-pointer flex items-center gap-2 font-bold text-xs border border-zinc-800"
            >
              <ShoppingBag size={18} />
              <span className="hidden sm:inline">Vault</span>
              {cartCount > 0 && (
                <span className="bg-[#D4AF37] text-black text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
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
            {/* Opulent Hero */}
            <section className="py-20 md:py-28 relative overflow-hidden border-b border-zinc-800">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-7 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-[#D4AF37] text-xs font-mono font-bold border border-amber-500/30">
                    <Sparkles size={14} />
                    <span>D-Color • VVS1 Clarity Guaranteed</span>
                  </div>

                  <h1 className="text-4xl sm:text-6xl font-serif font-black tracking-tight text-white leading-tight">
                    Timeless Diamonds. Handcrafted in 18K Solid Gold.
                  </h1>

                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-xl font-normal">
                    Individually certified by the Gemological Institute of America (GIA). Master Swiss and Antwerp lapidaries cut each facet to unleash maximum scintillation.
                  </p>

                  <div className="flex flex-wrap gap-4 pt-2">
                    <button
                      onClick={() => setActivePage("diamonds")}
                      className="px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-black rounded-2xl text-xs font-black uppercase tracking-wider transition shadow-lg shadow-amber-500/20 cursor-pointer"
                    >
                      Explore Diamond Cuts
                    </button>
                    <button
                      onClick={() => setActivePage("bespoke")}
                      className="px-6 py-4 bg-zinc-900 border border-zinc-800 text-[#D4AF37] rounded-2xl text-xs font-bold transition hover:bg-zinc-850 cursor-pointer"
                    >
                      Bespoke Engagement Concierge
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl border border-zinc-800 bg-zinc-900">
                    <img
                      src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=900&auto=format&fit=crop&q=80"
                      alt="Solitaire Diamond Ring"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Curated Jewelry Showcase */}
            <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-[#D4AF37]">Haute Joaillerie</span>
                  <h2 className="text-2xl sm:text-3xl font-serif font-black text-white">Signature Creations</h2>
                </div>
                <button
                  onClick={() => setActivePage("diamonds")}
                  className="text-xs font-mono text-[#D4AF37] hover:underline cursor-pointer"
                >
                  View Diamond Vault →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.slice(0, 3).map((item) => {
                  const outOfStock = isOutOfStock(item);
                  return (
                    <div
                      key={item._id}
                      onClick={() => {
                        setSelectedProduct(item);
                        setActivePage("product-detail");
                      }}
                      className="bg-zinc-900 rounded-3xl border border-zinc-800 p-6 space-y-4 flex flex-col justify-between hover:border-amber-500/50 transition cursor-pointer group"
                    >
                      <div className="space-y-3">
                        <div className="aspect-square rounded-2xl overflow-hidden bg-black">
                          <img src={getProductImage(item, item.image)} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                        </div>
                        <h4 className="text-base font-serif font-bold text-white group-hover:text-[#D4AF37] transition">{item.name}</h4>
                        <p className="text-xs text-zinc-400 line-clamp-2">{item.description}</p>
                      </div>
                      <div className="pt-3 flex justify-between items-center border-t border-zinc-800">
                        <span className="text-lg font-mono font-black text-[#D4AF37]">₹{Number(item.price).toFixed(2)}</span>
                        {outOfStock ? (
                          <span className="text-[10px] font-mono font-bold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                            Out of Stock
                          </span>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(item);
                            }}
                            className="px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-black font-black rounded-xl text-xs uppercase cursor-pointer"
                          >
                            Acquire Piece
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

        {/* PAGE 2: DIAMOND CUTS */}
        {activePage === "diamonds" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-[#D4AF37]">Optical Architecture</span>
              <h1 className="text-3xl font-serif font-black text-white">The Anatomy of Diamond Cuts</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {diamondCuts.map((cut) => (
                <div key={cut.name} className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-xl font-serif font-black text-[#D4AF37]">{cut.name}</h3>
                    <span className="text-xs font-mono text-zinc-400">{cut.facets}</span>
                  </div>
                  <span className="text-xs font-mono text-white block">✨ {cut.fire}</span>
                  <p className="text-xs text-zinc-400 leading-relaxed">{cut.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PAGE 3: BESPOKE CONCIERGE */}
        {activePage === "bespoke" && (
          <div className="max-w-2xl mx-auto px-4 py-16 space-y-8">
            <div className="text-center space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-[#D4AF37]">Custom Commission</span>
              <h1 className="text-3xl font-serif font-black text-white">Bespoke Ring & Solitaire Concierge</h1>
              <p className="text-xs text-zinc-400">Co-create an heirloom engagement ring or custom necklace with our master diamond setter.</p>
            </div>

            <div className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">Precious Metal</label>
                <select className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-800 text-xs text-white">
                  <option>18K Solid Yellow Gold</option>
                  <option>18K Solid Rose Gold</option>
                  <option>18K Solid White Gold</option>
                  <option>950 Pure Platinum</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">Diamond Shape</label>
                <select className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-800 text-xs text-white">
                  <option>Round Brilliant (Ideal Cut)</option>
                  <option>Emerald Step Cut</option>
                  <option>Oval Cut</option>
                  <option>Cushion Cut</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">Approximate Carat Weight</label>
                <input type="text" placeholder="e.g. 2.50 Carats" className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-800 text-xs text-white focus:outline-hidden" />
              </div>
              <button className="w-full py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-black font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20">
                Submit Custom Commission Inquiry
              </button>
            </div>
          </div>
        )}

        {/* PAGE 4: GIA CERTIFICATION */}
        {activePage === "certification" && (
          <div className="max-w-4xl mx-auto px-4 py-16 space-y-10">
            <div className="text-center space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-[#D4AF37]">Authenticity Assurance</span>
              <h1 className="text-3xl font-serif font-black text-white">GIA & IGI International Certification</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-3">
                <Award size={28} className="text-[#D4AF37]" />
                <h4 className="text-base font-bold text-white font-serif">Laser Inscribed GIA Report #</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">Each diamond girdle is micro-laser etched with its permanent GIA registry certificate number, invisible to the naked eye.</p>
              </div>
              <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-3">
                <ShieldCheck size={28} className="text-[#D4AF37]" />
                <h4 className="text-base font-bold text-white font-serif">100% Conflict-Free Kimberly Process</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">Ethically mined and documented from certified Canadian and Botswanan diamond sources with chain of custody tracking.</p>
              </div>
              <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-3">
                <Lock size={28} className="text-[#D4AF37]" />
                <h4 className="text-base font-bold text-white font-serif">Lifetime Insurance Appraisals</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">Complimentary annual appraisals and ultrasonic diamond claw re-tipping performed by our master goldsmiths.</p>
              </div>
            </div>
          </div>
        )}

        {/* PAGE 5: PRIVATE VAULT APPOINTMENT */}
        {activePage === "appointment" && (
          <div className="max-w-xl mx-auto px-4 py-16 space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-serif font-black text-white">Private VIP Boutique Viewing</h1>
              <p className="text-xs text-zinc-400">Reserve a private salon appointment at our Geneva or New York viewing vaults with champagne service.</p>
            </div>

            <div className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4">
              {appointmentBooked ? (
                <div className="text-center py-6 space-y-3">
                  <Check size={36} className="text-[#D4AF37] mx-auto" />
                  <h3 className="text-lg font-bold text-white">Private Salon Reserved</h3>
                  <p className="text-xs text-zinc-400">Our senior gemologist will contact you to confirm security clearance and portfolio preferences.</p>
                </div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); setAppointmentBooked(true); }} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1">Full Client Name</label>
                    <input type="text" required placeholder="Lord Julian Sterling" className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-800 text-xs text-white focus:outline-hidden" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1">Preferred Location</label>
                    <select className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-800 text-xs text-white">
                      <option>Geneva Salon (Rue du Rhône)</option>
                      <option>New York Flagship (Fifth Avenue)</option>
                      <option>London Vault (Bond Street)</option>
                    </select>
                  </div>
                  <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-black font-black text-xs uppercase tracking-wider rounded-xl shadow-lg">
                    Confirm Private Vault Viewing
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* PAGE: PRODUCT DETAIL */}
        {activePage === "product-detail" && selectedProduct && (
          <div className="bg-[#09090B] min-h-screen py-6 text-zinc-100">
            <ProductDetailsPage
              product={selectedProduct}
              onBack={() => setActivePage("home")}
              onAddToCart={handleAddToCart}
              themeColors={{ primary: "#D4AF37", secondary: "#AA771C", text: "#FAFAFA", background: "#09090B", cardBg: "#18181B" }}
              business={business}
              relatedProducts={products}
              onSelectProduct={(p) => setSelectedProduct(p)}
            />
          </div>
        )}
      </main>

      {/* ================= BESPOKE FINE JEWELRY FOOTER ================= */}
      <footer className="bg-black text-zinc-500 py-16 border-t border-zinc-900 text-xs">
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
                <Sparkles size={18} className="text-[#D4AF37]" />
              )}
              <span className="text-base font-serif font-black tracking-[0.2em] text-white uppercase">{brandName}</span>
            </div>
            <p className="text-zinc-600 leading-relaxed text-[11px]">
              {business?.description || "GIA certified solitaires, 18K solid gold, and Swiss fine jewelry craftsmanship."}
            </p>
            {brandAddress && (
              <p className="text-zinc-600 text-[10px]">📍 {brandAddress}</p>
            )}
          </div>
          <div className="space-y-2">
            <h5 className="font-bold text-[#D4AF37] uppercase text-[10px] tracking-wider">Diamond Lab</h5>
            <p onClick={() => setActivePage("diamonds")} className="hover:text-white cursor-pointer">Anatomy of Cuts</p>
            <p onClick={() => setActivePage("certification")} className="hover:text-white cursor-pointer">GIA Inscription Verification</p>
          </div>
          <div className="space-y-2">
            <h5 className="font-bold text-[#D4AF37] uppercase text-[10px] tracking-wider">Atelier Concierge</h5>
            <p onClick={() => setActivePage("bespoke")} className="hover:text-white cursor-pointer">Bespoke Commissions</p>
            <p onClick={() => setActivePage("appointment")} className="hover:text-white cursor-pointer">Private Vault Reservation</p>
          </div>
          <div className="space-y-2">
            <h5 className="font-bold text-[#D4AF37] uppercase text-[10px] tracking-wider">Geneva Vault</h5>
            <p className="text-white font-mono">{brandPhone}</p>
            <p className="text-zinc-600 text-[11px]">{brandEmail}</p>
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
