import React, { useState } from "react";
import {
  Wrench,
  Zap,
  ShieldCheck,
  RotateCcw,
  ShoppingBag,
  Star,
  Search,
  Check,
  BatteryCharging,
  SlidersHorizontal,
  Hammer,
  Cog,
  Truck,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToCart, updateCartQuantity, removeFromCart } from "../../../redux/reducers/cartReducer";
import toast from "react-hot-toast";
import { isOutOfStock, getProductStock } from "../../../utils/stockUtils";
import CartDrawer from "../../common/CartDrawer";
import ProductDetailsPage from "../../common/ProductDetailsPage";
import { getProductImage } from "../../../utils/productImage";

export default function PowerToolsTemplate({
  business = {},
  products = [],
  categories = [],
  offers = [],
  reviews = [],
  customization = {},
}) {
  const [activePage, setActivePage] = useState("home"); // "home" | "tool-vault" | "battery-system" | "contractor-pro" | "service-repair" | "product-detail"
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedVoltage, setSelectedVoltage] = useState("all");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart?.cartItems || []);

  const defaultTools = [
    {
      _id: "tool-1",
      name: "20V MAX Brushless 1/2\" Hammer Drill/Driver",
      price: 199.0,
      voltage: "20V MAX",
      image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&auto=format&fit=crop&q=80",
      description: "High-efficiency brushless motor delivers 820 unit watts out (UWO) with a 3-speed all-metal transmission.",
    },
    {
      _id: "tool-2",
      name: "60V MAX 7-1/4\" Cordless Circular Saw",
      price: 279.0,
      voltage: "60V MAX",
      image: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=800&auto=format&fit=crop&q=80",
      description: "Up to 47% more power than corded saws with electric brake and 5,800 RPM no-load blade speed.",
    },
    {
      _id: "tool-3",
      name: "20V MAX XR 1/4\" High-Torque Impact Driver",
      price: 149.0,
      voltage: "20V MAX",
      image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80",
      description: "2,050 in-lbs of torque in a compact 3.97-inch length with 3-LED halo work lights for dark jobsites.",
    },
    {
      _id: "tool-4",
      name: "Heavy-Duty 12\" Dual-Bevel Sliding Compound Miter Saw",
      price: 499.0,
      voltage: "Corded 15-Amp",
      image: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80",
      description: "Cut alignment system with stainless steel miter detent plate and 15-Amp 3,800 RPM motor.",
    },
  ];

  const tools = products.length > 0 ? products : defaultTools;

  const brandName =
    business?.businessName ||
    business?.name ||
    customization?.heroHeadline ||
    "POWERFORGE";

  const brandLogo =
    customization?.logo ||
    business?.logo ||
    null;

  const brandPhone =
    business?.phone ||
    business?.businessPhone ||
    business?.contactPhone ||
    "1-800-FORGE-PRO";

  const brandEmail =
    business?.email ||
    business?.businessEmail ||
    business?.contactEmail ||
    "contractor@powerforge.pro";

  const rawAddr = business?.address || business?.registered_business_address;
  const brandAddress =
    typeof rawAddr === "string"
      ? rawAddr
      : rawAddr && typeof rawAddr === "object"
      ? [rawAddr.street, rawAddr.addressLine2, rawAddr.city, rawAddr.state, rawAddr.postalCode, rawAddr.country]
          .filter(Boolean)
          .join(", ")
      : null;

  const handleAddToCart = (tool, qty = 1) => {
    if (isOutOfStock(tool)) {
      toast.error(`Sorry, ${tool.name || "tool"} is out of stock!`);
      return;
    }
    dispatch(addToCart({ product: tool, quantity: qty }));
    toast.success(`${tool.name || "Tool"} added to cart!`);
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

  const filteredTools = tools.filter((t) => {
    if (selectedVoltage === "all") return true;
    return (t.voltage || "").includes(selectedVoltage);
  });

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#121214] text-zinc-100">
      {/* ================= BESPOKE POWER TOOL NAVBAR ================= */}
      <header className="sticky top-0 z-40 bg-[#18181B]/95 backdrop-blur-md border-b border-zinc-800">
        <div className="bg-[#EA580C] text-black font-black uppercase text-[10px] tracking-widest py-1.5 px-4 text-center">
          <span>⚡ 3-Year Heavy Duty Commercial Warranty • Free Jobsite Delivery over ₹999 • Contractor Hotline: {brandPhone}</span>
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
              <div className="w-10 h-10 rounded-xl bg-[#EA580C] text-black flex items-center justify-center font-black shadow-lg shadow-orange-500/20">
                <Zap size={22} className="fill-black" />
              </div>
            )}
            <div>
              <span className="text-xl font-black uppercase tracking-wider text-white block leading-tight font-mono">
                {brandName}
              </span>
              <span className="text-[9px] uppercase tracking-widest text-[#EA580C] font-bold block font-mono">
                {business?.tagline || business?.category || "Industrial Power Tools & Equipment"}
              </span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-7 text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
            {[
              { id: "home", label: "Jobsite Home" },
              { id: "tool-vault", label: "Tool Vault" },
              { id: "battery-system", label: "FlexVolt Platform" },
              { id: "contractor-pro", label: "Contractor Fleet" },
              { id: "service-repair", label: "3-Yr Warranty" },
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
                    isActive ? "text-[#EA580C] font-black" : "hover:text-white"
                  }`}
                >
                  <span>{tab.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#EA580C] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCartOpen(true)}
              className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-[#EA580C] hover:bg-zinc-800 transition cursor-pointer flex items-center gap-2 font-mono text-xs"
            >
              <ShoppingBag size={18} />
              <span className="hidden sm:inline">Jobsite Cart</span>
              {cartCount > 0 && (
                <span className="bg-[#EA580C] text-black text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
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
            {/* Tool Hero */}
            <section className="py-20 md:py-28 relative overflow-hidden border-b border-zinc-800 bg-gradient-to-b from-zinc-900/60 to-transparent">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-7 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-[#EA580C] text-xs font-mono font-bold border border-orange-500/30">
                    <Zap size={14} />
                    <span>Next-Gen Brushless High-Output Motor</span>
                  </div>

                  <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white leading-tight font-mono">
                    Built to Endure the Harshest Commercial Jobsites.
                  </h1>

                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-xl font-normal">
                    Forged steel gearing, all-weather sealed electronics, and 60V Max lithium packs engineered for commercial framers, electricians, and master builders.
                  </p>

                  <div className="flex flex-wrap gap-4 pt-2">
                    <button
                      onClick={() => setActivePage("tool-vault")}
                      className="px-8 py-4 bg-[#EA580C] hover:bg-orange-500 text-black font-mono font-black text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-orange-500/20 flex items-center gap-2 cursor-pointer"
                    >
                      <Wrench size={16} />
                      <span>Shop Power Tools</span>
                    </button>
                    <button
                      onClick={() => setActivePage("battery-system")}
                      className="px-6 py-4 bg-zinc-900 border border-zinc-700 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition hover:bg-zinc-800 cursor-pointer"
                    >
                      Explore FlexVolt 60V
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl border border-zinc-800 bg-zinc-900">
                    <img
                      src="https://images.unsplash.com/photo-1504148455328-c376907d081c?w=900&auto=format&fit=crop&q=80"
                      alt="Hammer Drill"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Featured Tools */}
            <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-[#EA580C]">Top Jobsite Demand</span>
                  <h2 className="text-2xl sm:text-3xl font-black text-white font-mono">Bestselling Cordless Rigs</h2>
                </div>
                <button
                  onClick={() => setActivePage("tool-vault")}
                  className="text-xs font-mono text-[#EA580C] hover:underline cursor-pointer"
                >
                  View Complete Tool Vault →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {tools.slice(0, 4).map((tool) => {
                  const outOfStock = isOutOfStock(tool);
                  return (
                    <div
                      key={tool._id}
                      onClick={() => {
                        setSelectedProduct(tool);
                        setActivePage("product-detail");
                      }}
                      className="bg-zinc-900 rounded-3xl border border-zinc-800 p-5 space-y-4 flex flex-col justify-between shadow-2xs hover:border-zinc-700 transition cursor-pointer group"
                    >
                      <div className="space-y-3">
                        <div className="aspect-square rounded-2xl overflow-hidden bg-black">
                          <img src={getProductImage(tool, tool.image)} alt={tool.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                        </div>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#EA580C] bg-orange-500/10 px-2 py-0.5 rounded">
                          {tool.voltage || "20V MAX"}
                        </span>
                        <h4 className="text-sm font-bold text-white font-mono line-clamp-2 group-hover:text-[#EA580C] transition">{tool.name}</h4>
                      </div>
                      <div className="pt-3 flex justify-between items-center border-t border-zinc-800">
                        <span className="text-lg font-mono font-black text-white">₹{Number(tool.price).toFixed(2)}</span>
                        {outOfStock ? (
                          <span className="text-[10px] font-mono font-bold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                            Out of Stock
                          </span>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(tool);
                            }}
                            className="px-4 py-2 bg-[#EA580C] hover:bg-orange-500 text-black font-black font-mono rounded-xl text-xs uppercase cursor-pointer"
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

        {/* PAGE 2: TOOL VAULT */}
        {activePage === "tool-vault" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
            <div className="flex flex-col sm:flex-row justify-between items-baseline gap-4 border-b border-zinc-800 pb-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#EA580C]">Commercial Inventory</span>
                <h1 className="text-3xl font-black text-white font-mono">The Power Tool Vault</h1>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase text-zinc-500">Voltage:</span>
                {["all", "20V", "60V", "Corded"].map((volt) => (
                  <button
                    key={volt}
                    onClick={() => setSelectedVoltage(volt)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition cursor-pointer border ${
                      selectedVoltage === volt ? "bg-[#EA580C] text-black border-[#EA580C]" : "bg-zinc-900 text-zinc-300 border-zinc-800 hover:bg-zinc-800"
                    }`}
                  >
                    {volt === "all" ? "All Volts" : volt}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredTools.map((tool) => {
                const outOfStock = isOutOfStock(tool);
                return (
                  <div
                    key={tool._id}
                    onClick={() => {
                      setSelectedProduct(tool);
                      setActivePage("product-detail");
                    }}
                    className="bg-zinc-900 rounded-3xl border border-zinc-800 p-5 space-y-4 flex flex-col justify-between hover:border-zinc-700 transition cursor-pointer group"
                  >
                    <div className="space-y-3">
                      <div className="aspect-square rounded-2xl overflow-hidden bg-black">
                        <img src={getProductImage(tool, tool.image)} alt={tool.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                      </div>
                      <span className="text-[10px] font-mono font-bold text-[#EA580C]">{tool.voltage || "Brushless"}</span>
                      <h4 className="text-sm font-bold text-white font-mono group-hover:text-[#EA580C] transition">{tool.name}</h4>
                      <p className="text-xs text-zinc-400 line-clamp-2">{tool.description}</p>
                    </div>
                    <div className="pt-3 flex justify-between items-center border-t border-zinc-800">
                      <span className="text-lg font-mono font-black text-white">₹{Number(tool.price).toFixed(2)}</span>
                      {outOfStock ? (
                        <span className="text-[10px] font-mono font-bold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                          Out of Stock
                        </span>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(tool);
                          }}
                          className="px-4 py-2 bg-[#EA580C] hover:bg-orange-500 text-black font-black font-mono rounded-xl text-xs cursor-pointer"
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

        {/* PAGE 3: BATTERY SYSTEM */}
        {activePage === "battery-system" && (
          <div className="max-w-4xl mx-auto px-4 py-16 space-y-12">
            <div className="text-center space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-[#EA580C]">FlexVolt Architecture</span>
              <h1 className="text-3xl font-black text-white font-mono">One Battery. Multi-Voltage Power.</h1>
              <p className="text-xs text-zinc-400">Our FlexVolt battery automatically changes voltage when you change tools, powering both 20V and 60V Max rigs.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-3">
                <BatteryCharging size={28} className="text-[#EA580C]" />
                <h4 className="text-base font-bold text-white font-mono">60V Heavy Output</h4>
                <p className="text-xs text-zinc-400 leading-relaxed font-mono">Powers commercial table saws and rotary hammers with equivalent strength to 15-Amp corded lines.</p>
              </div>
              <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-3">
                <Zap size={28} className="text-[#EA580C]" />
                <h4 className="text-base font-bold text-white font-mono">4X Runtime on 20V</h4>
                <p className="text-xs text-zinc-400 leading-relaxed font-mono">When clipped into standard 20V Max drills and drivers, delivers up to 4X longer runtime per charge.</p>
              </div>
              <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-3">
                <ShieldCheck size={28} className="text-[#EA580C]" />
                <h4 className="text-base font-bold text-white font-mono">Extreme Temp Cells</h4>
                <p className="text-xs text-zinc-400 leading-relaxed font-mono">Operates flawlessly from freezing winter sub-zero jobsites (-4°F) to 122°F summer roofing projects.</p>
              </div>
            </div>
          </div>
        )}

        {/* PAGE 4: CONTRACTOR FLEET */}
        {activePage === "contractor-pro" && (
          <div className="max-w-2xl mx-auto px-4 py-16 space-y-8">
            <div className="text-center space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-[#EA580C]">Commercial Accounts</span>
              <h1 className="text-3xl font-black text-white font-mono">Contractor Fleet Discount Program</h1>
              <p className="text-xs text-zinc-400">Order tool packs of 10+ rigs with tax-exempt invoicing and dedicated jobsite trailer delivery.</p>
            </div>

            <div className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1 font-mono">Company / General Contractor Name</label>
                <input type="text" placeholder="Vance Commercial Builders LLC" className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-800 text-xs text-white" />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1 font-mono">Crew Size / Fleet Requirement</label>
                <select className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-800 text-xs text-white">
                  <option>10 - 25 Tool Packages (15% Off)</option>
                  <option>25 - 50 Tool Packages (25% Off)</option>
                  <option>50+ Entire Fleet Overhaul (Contractor VIP)</option>
                </select>
              </div>
              <button className="w-full py-3.5 bg-[#EA580C] hover:bg-orange-500 text-black font-mono font-black text-xs uppercase tracking-wider rounded-xl shadow-lg">
                Request Commercial Account Quote
              </button>
            </div>
          </div>
        )}

        {/* PAGE 5: WARRANTY */}
        {activePage === "service-repair" && (
          <div className="max-w-3xl mx-auto px-4 py-16 space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-black text-white font-mono">3-Year Limited Commercial Warranty</h1>
              <p className="text-xs text-zinc-400">Free service, free replacement parts, and 90-day money-back guarantee.</p>
            </div>

            <div className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4 text-xs font-mono text-zinc-400 leading-relaxed">
              <p>
                PowerForge will maintain the tool and replace parts caused by normal wear for 1 year free of charge. Tool chassis and brushless motors are warrantied against defects for 3 years.
              </p>
              <div className="p-4 rounded-2xl bg-black border border-zinc-800 text-white">
                <span className="font-bold text-[#EA580C] block">Need Immediate Repair?</span>
                <span>Bring your tool to any of our 450+ authorized service centers nationwide for 48-hour turnarounds.</span>
              </div>
            </div>
          </div>
        )}

        {/* PAGE: PRODUCT DETAIL */}
        {activePage === "product-detail" && selectedProduct && (
          <div className="bg-[#121214] min-h-screen py-6 text-zinc-100">
            <ProductDetailsPage
              product={selectedProduct}
              onBack={() => setActivePage("home")}
              onAddToCart={handleAddToCart}
              themeColors={{ primary: "#EA580C", secondary: "#F97316", text: "#FFFFFF", background: "#121214", cardBg: "#18181B" }}
              business={business}
              relatedProducts={tools}
              onSelectProduct={(p) => setSelectedProduct(p)}
            />
          </div>
        )}
      </main>

      {/* ================= BESPOKE POWER TOOL FOOTER ================= */}
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
                <Zap size={18} className="text-[#EA580C] fill-[#EA580C]" />
              )}
              <span className="text-base font-black text-white font-mono uppercase">{brandName}</span>
            </div>
            <p className="text-zinc-600 leading-relaxed text-[11px]">
              {business?.description || "Brushless cordless power tools, 60V Max high-output lithium platforms, and commercial jobsite durability."}
            </p>
            {brandAddress && (
              <p className="text-zinc-600 text-[10px]">📍 {brandAddress}</p>
            )}
          </div>
          <div className="space-y-2">
            <h5 className="font-bold text-[#EA580C] uppercase text-[10px]">Platforms</h5>
            <p onClick={() => setActivePage("tool-vault")} className="hover:text-white cursor-pointer">20V MAX Cordless</p>
            <p onClick={() => setActivePage("battery-system")} className="hover:text-white cursor-pointer">60V MAX FlexVolt</p>
          </div>
          <div className="space-y-2">
            <h5 className="font-bold text-[#EA580C] uppercase text-[10px]">Commercial Pro</h5>
            <p onClick={() => setActivePage("contractor-pro")} className="hover:text-white cursor-pointer">Contractor Fleet Pricing</p>
            <p onClick={() => setActivePage("service-repair")} className="hover:text-white cursor-pointer">3-Yr Commercial Warranty</p>
          </div>
          <div className="space-y-2">
            <h5 className="font-bold text-[#EA580C] uppercase text-[10px]">Jobsite Support</h5>
            <p className="text-white font-bold">{brandPhone}</p>
            {business?.email && <p className="text-zinc-500 text-[11px]">{business.email}</p>}
            <p className="text-zinc-600 text-[11px]">Authorized Service Hub</p>
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
        themeColors={{ primary: "#EA580C" }}
      />
    </div>
  );
}
