import React, { useState } from "react";
import {
  Utensils,
  Search,
  Star,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Check,
  Truck,
  Wine,
  Award,
  ArrowRight,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToCart, updateCartQuantity, removeFromCart } from "../../../redux/reducers/cartReducer";
import toast from "react-hot-toast";
import { isOutOfStock, getProductStock } from "../../../utils/stockUtils";
import CartDrawer from "../../common/CartDrawer";
import ProductDetailsPage from "../../common/ProductDetailsPage";
import { getProductImage } from "../../../utils/productImage";

export default function GourmetFoodTemplate({
  business = {},
  products = [],
  categories = [],
  offers = [],
  reviews = [],
  customization = {},
}) {
  const [activePage, setActivePage] = useState("home"); // "home" | "pantry" | "tasting-boxes" | "dop-provenance" | "cold-shipping" | "product-detail"
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedOrigin, setSelectedOrigin] = useState("all");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart?.cartItems || []);

  const defaultGourmetItems = [
    {
      _id: "food-1",
      name: "36-Month Aged Parmigiano Reggiano DOP",
      origin: "Parma, Italy",
      price: 34.0,
      category: "Artisanal Cheese",
      image: "https://images.unsplash.com/photo-1452195100486-9cc805987862?w=800&auto=format&fit=crop&q=80",
      description: "Caramelized crystalline crunch with deep umami nutty richness from grass-fed mountain cows.",
    },
    {
      _id: "food-2",
      name: "Single-Estate Coratina Extra Virgin Olive Oil (500ml)",
      origin: "Puglia, Italy",
      price: 42.0,
      category: "Oils & Vinegars",
      image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&auto=format&fit=crop&q=80",
      description: "First cold press harvest with vibrant notes of artichoke, green almond, and a spicy polyphenol finish.",
    },
    {
      _id: "food-3",
      name: "Jamón Ibérico de Bellota 100% Pata Negra",
      origin: "Jabugo, Spain",
      price: 68.0,
      category: "Charcuterie",
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80",
      description: "Free-range acorn-fed Iberian pork cured for 48 months in mountain air. Silky, melt-in-mouth marbling.",
    },
    {
      _id: "food-4",
      name: "25-Year Traditional Balsamic Vinegar DOP",
      origin: "Modena, Italy",
      price: 95.0,
      category: "Oils & Vinegars",
      image: "https://images.unsplash.com/photo-1514944298352-1bc6dc62ea53?w=800&auto=format&fit=crop&q=80",
      description: "Aged through a battery of oak, chestnut, and cherry casks into a dense, velvety syrup.",
    },
  ];

  const items = products.length > 0 ? products : defaultGourmetItems;

  const brandName =
    business?.businessName ||
    business?.name ||
    customization?.heroHeadline ||
    "LA DISPENSA";

  const brandLogo =
    customization?.logo ||
    business?.logo ||
    null;

  const brandPhone =
    business?.phone ||
    business?.businessPhone ||
    business?.contactPhone ||
    "+39 051 442 900";

  const brandEmail =
    business?.email ||
    business?.businessEmail ||
    business?.contactEmail ||
    "pantry@ladispensa.eu";

  const rawAddr = business?.address || business?.registered_business_address;
  const brandAddress =
    typeof rawAddr === "string"
      ? rawAddr
      : rawAddr && typeof rawAddr === "object"
      ? [rawAddr.street, rawAddr.addressLine2, rawAddr.city, rawAddr.state, rawAddr.postalCode, rawAddr.country]
          .filter(Boolean)
          .join(", ")
      : null;

  const handleAddToCart = (item, qty = 1) => {
    if (isOutOfStock(item)) {
      toast.error(`Sorry, ${item.name || "item"} is out of stock!`);
      return;
    }
    dispatch(addToCart({ product: item, quantity: qty }));
    toast.success(`${item.name || "Item"} added to cart!`);
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

  const filteredItems = items.filter((i) => {
    if (selectedOrigin === "all") return true;
    return (i.origin || "").toLowerCase().includes(selectedOrigin.toLowerCase());
  });

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#FBF9F5] text-[#1C2826]">
      {/* ================= BESPOKE GOURMET NAVBAR ================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E8E2D5] shadow-xs">
        <div className="bg-[#1B3B2B] text-[#D4E8C2] text-[10px] uppercase font-bold tracking-[0.2em] py-1.5 px-4 text-center">
          <span>DOP Certified Artisans • Temperature-Controlled Insulated Overnight Shipping</span>
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
              <div className="w-10 h-10 rounded-xl bg-[#1B3B2B] text-[#D4E8C2] flex items-center justify-center font-black">
                <UtensilsCrossed size={20} />
              </div>
            )}
            <div className="space-y-0.5">
              <span className="text-xl sm:text-2xl font-serif font-black tracking-tight text-[#1B3B2B] block leading-tight">
                {brandName}
              </span>
              <span className="text-[9px] uppercase tracking-widest text-[#B45309] font-bold block">
                {business?.tagline || business?.category || "Artisanal Mediterranean Pantry"}
              </span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-7 text-xs font-bold uppercase tracking-wider text-[#3D5244]">
            {[
              { id: "home", label: "Pantry Home" },
              { id: "pantry", label: "Artisan Pantry" },
              { id: "tasting-boxes", label: "Tasting Hampers" },
              { id: "dop-provenance", label: "DOP Provenance" },
              { id: "cold-shipping", label: "Cold Shipping" },
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
                    isActive ? "text-[#1B3B2B] font-black" : "hover:text-[#B45309]"
                  }`}
                >
                  <span>{tab.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B45309] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCartOpen(true)}
              className="p-2.5 rounded-2xl bg-[#EAF2E8] text-[#1B3B2B] hover:bg-[#DCEAD9] transition cursor-pointer flex items-center gap-2 font-bold text-xs"
            >
              <ShoppingBag size={18} />
              <span className="hidden sm:inline">Hamper</span>
              {cartCount > 0 && (
                <span className="bg-[#1B3B2B] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
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
            {/* Gourmet Hero */}
            <section className="py-20 md:py-28 relative overflow-hidden bg-gradient-to-b from-[#EFF5EC] via-[#FBF9F5] to-transparent font-serif">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-7 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E0EDDC] text-[#224A37] text-xs font-sans font-bold">
                    <Award size={14} className="text-[#B45309]" />
                    <span>Protected Geographic Origin (DOP & IGP)</span>
                  </div>

                  <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#1B3B2B] leading-tight">
                    Artisanal European Delicacies Sourced Directly from Family Estates.
                  </h1>

                  <p className="text-xs sm:text-sm text-[#486653] leading-relaxed max-w-xl font-normal font-sans">
                    36-month aged mountain Parmigiano, acorn-fed Iberian ham, cold-pressed single-estate olive oils, and barrel-aged balsamic vinegar delivered cold-packed to your table.
                  </p>

                  <div className="flex flex-wrap gap-4 pt-2 font-sans">
                    <button
                      onClick={() => setActivePage("pantry")}
                      className="px-8 py-4 bg-[#1B3B2B] hover:bg-[#2A573F] text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition shadow-lg flex items-center gap-2 cursor-pointer"
                    >
                      <Utensils size={16} />
                      <span>Shop The Pantry</span>
                    </button>
                    <button
                      onClick={() => setActivePage("tasting-boxes")}
                      className="px-6 py-4 bg-white border border-[#D5CDBF] text-[#1B3B2B] rounded-2xl text-xs font-bold transition hover:bg-[#EFF5EC] cursor-pointer"
                    >
                      View Tasting Hampers
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <div className="aspect-4/3 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                    <img
                      src="https://images.unsplash.com/photo-1452195100486-9cc805987862?w=900&auto=format&fit=crop&q=80"
                      alt="Artisanal Cheese"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Delicacies Showcase */}
            <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-xs uppercase tracking-wider text-[#B45309] font-bold">Estate Selections</span>
                  <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#1B3B2B]">Culinary Crown Jewels</h2>
                </div>
                <button
                  onClick={() => setActivePage("pantry")}
                  className="text-xs font-bold text-[#B45309] hover:underline cursor-pointer"
                >
                  View All Pantry Items →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {items.slice(0, 4).map((food) => {
                  const outOfStock = isOutOfStock(food);
                  return (
                    <div
                      key={food._id}
                      onClick={() => {
                        setSelectedProduct(food);
                        setActivePage("product-detail");
                      }}
                      className="bg-white rounded-3xl border border-[#E8E2D5] p-4 space-y-3 flex flex-col justify-between shadow-2xs hover:shadow-md transition cursor-pointer group"
                    >
                      <div className="space-y-3">
                        <div className="aspect-square rounded-2xl overflow-hidden bg-[#EFF5EC]">
                          <img src={getProductImage(food, food.image)} alt={food.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#B45309]">{food.origin}</span>
                        <h4 className="text-sm font-serif font-bold text-[#1B3B2B] line-clamp-1 group-hover:text-[#B45309] transition">{food.name}</h4>
                      </div>
                      <div className="pt-2 flex justify-between items-center border-t border-[#F2EDE2]">
                        <span className="text-base font-black text-[#1B3B2B]">₹{Number(food.price).toFixed(2)}</span>
                        {outOfStock ? (
                          <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-200">
                            Out of Stock
                          </span>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(food);
                            }}
                            className="px-3.5 py-1.5 bg-[#1B3B2B] hover:bg-[#2A573F] text-white rounded-xl text-xs font-bold cursor-pointer"
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

        {/* PAGE 2: PANTRY */}
        {activePage === "pantry" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
            <div className="flex flex-col sm:flex-row justify-between items-baseline gap-4 border-b border-[#E8E2D5] pb-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#B45309] font-bold">Estate Inventory</span>
                <h1 className="text-3xl font-serif font-black text-[#1B3B2B]">The Mediterranean Pantry</h1>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase text-[#486653]">Origin:</span>
                {["all", "Italy", "Spain", "France"].map((ctry) => (
                  <button
                    key={ctry}
                    onClick={() => setSelectedOrigin(ctry)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                      selectedOrigin === ctry
                        ? "bg-[#1B3B2B] text-white border-[#1B3B2B]"
                        : "bg-white text-[#1B3B2B] border-[#E8E2D5] hover:bg-[#EFF5EC]"
                    }`}
                  >
                    {ctry === "all" ? "All Terroirs" : ctry}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredItems.map((food) => {
                const outOfStock = isOutOfStock(food);
                return (
                  <div
                    key={food._id}
                    onClick={() => {
                      setSelectedProduct(food);
                      setActivePage("product-detail");
                    }}
                    className="bg-white rounded-3xl border border-[#E8E2D5] p-4 space-y-3 flex flex-col justify-between shadow-2xs hover:shadow-md transition cursor-pointer group"
                  >
                    <div className="space-y-3">
                      <div className="aspect-square rounded-2xl overflow-hidden bg-[#EFF5EC]">
                        <img src={getProductImage(food, food.image)} alt={food.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                      </div>
                      <span className="text-[10px] font-bold text-[#B45309]">{food.origin}</span>
                      <h4 className="text-sm font-serif font-bold text-[#1B3B2B] group-hover:text-[#B45309] transition">{food.name}</h4>
                      <p className="text-xs text-[#486653] line-clamp-2">{food.description}</p>
                    </div>
                    <div className="pt-2 flex justify-between items-center border-t border-[#F2EDE2]">
                      <span className="text-base font-black text-[#1B3B2B]">₹{Number(food.price).toFixed(2)}</span>
                      {outOfStock ? (
                        <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-200">
                          Out of Stock
                        </span>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(food);
                          }}
                          className="px-3.5 py-1.5 bg-[#1B3B2B] hover:bg-[#2A573F] text-white rounded-xl text-xs font-bold cursor-pointer"
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

        {/* PAGE 3: TASTING BOXES */}
        {activePage === "tasting-boxes" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs uppercase tracking-wider text-[#B45309] font-bold">Curated Gastronomy</span>
              <h1 className="text-3xl font-serif font-black text-[#1B3B2B]">Regional Tasting Hampers</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: "Tuscan Harvest Hamper", items: ["36-Mo Parmigiano Reggiano", "Single-Estate EVOO", "Wild Truffle Acacia Honey", "Handmade Tagliatelle"], price: "₹6,999.00" },
                { title: "Iberian Tapas Sanctuary", items: ["Jamón Ibérico Bellota 100g", "Manchego Curado DOP", "Marcona Fried Almonds", "Piquillo Roasted Peppers"], price: "₹7,999.00" },
                { title: "Provençal Apéro Box", items: ["Goat Chevre with Herbes de Provence", "Nyon Black Olive Tapenade", "Rosemary Flatbreads", "French Lavender Shortbread"], price: "₹5,999.00" },
              ].map((box) => (
                <div key={box.title} className="bg-white rounded-3xl border border-[#E8E2D5] p-6 space-y-4 shadow-xs flex flex-col justify-between">
                  <div className="space-y-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-[#EFF5EC] text-[#1B3B2B] px-3 py-1 rounded-full">Gourmet Wooden Crate</span>
                    <h3 className="text-xl font-serif font-bold text-[#1B3B2B]">{box.title}</h3>
                    <div className="space-y-1.5 pt-2 border-t border-[#E8E2D5]">
                      {box.items.map((it) => (
                        <p key={it} className="text-xs text-[#486653] flex items-center gap-1.5">
                          <Check size={12} className="text-[#1B3B2B]" />
                          <span>{it}</span>
                        </p>
                      ))}
                    </div>
                  </div>
                  <div className="pt-4 border-t border-[#E8E2D5] flex items-center justify-between">
                    <span className="text-xl font-black text-[#1B3B2B]">{box.price}</span>
                    <button
                      onClick={() => handleAddToCart({ _id: box.title, name: box.title, price: 125, image: "https://images.unsplash.com/photo-1452195100486-9cc805987862?w=600" })}
                      className="px-4 py-2 bg-[#1B3B2B] hover:bg-[#2A573F] text-white rounded-xl text-xs font-bold"
                    >
                      Order Hamper
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PAGE 4: DOP PROVENANCE */}
        {activePage === "dop-provenance" && (
          <div className="max-w-4xl mx-auto px-4 py-16 space-y-10">
            <div className="text-center space-y-2">
              <span className="text-xs uppercase tracking-wider text-[#B45309] font-bold">Protected Heritage</span>
              <h1 className="text-3xl font-serif font-black text-[#1B3B2B]">What Does DOP Guarantee Mean?</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-3xl bg-white border border-[#E8E2D5] space-y-3">
                <ShieldCheck size={28} className="text-[#1B3B2B]" />
                <h4 className="text-base font-bold text-[#1B3B2B]">100% Defined Micro-Climate</h4>
                <p className="text-xs text-[#486653]">Every wheel of cheese and ham must be born, raised, and cured within the legally delimited historical region.</p>
              </div>
              <div className="p-6 rounded-3xl bg-white border border-[#E8E2D5] space-y-3">
                <Award size={28} className="text-[#1B3B2B]" />
                <h4 className="text-base font-bold text-[#1B3B2B]">Strict Traditional Methods</h4>
                <p className="text-xs text-[#486653]">Prohibits industrial shortcuts, chemical additives, and forced heat curing. Time and terroir are the only ingredients.</p>
              </div>
              <div className="p-6 rounded-3xl bg-white border border-[#E8E2D5] space-y-3">
                <Wine size={28} className="text-[#1B3B2B]" />
                <h4 className="text-base font-bold text-[#1B3B2B]">Official Quality Stamping</h4>
                <p className="text-xs text-[#486653]">Only products that pass rigorous olfactory and texture evaluations by consortium inspectors receive the fire-branded seal.</p>
              </div>
            </div>
          </div>
        )}

        {/* PAGE 5: COLD SHIPPING */}
        {activePage === "cold-shipping" && (
          <div className="max-w-3xl mx-auto px-4 py-16 space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-serif font-black text-[#1B3B2B]">Insulated Cold-Chain Transit Promise</h1>
              <p className="text-xs text-[#486653]">Your artisanal cheeses and cured meats arrive in cellar-fresh condition.</p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-[#E8E2D5] space-y-4 text-xs sm:text-sm text-[#486653] leading-relaxed">
              <p>
                Every parcel is packaged in 100% biodegradable natural wool thermal liners with non-toxic frozen gel packs, maintaining temperatures below 40°F for up to 48 hours.
              </p>
              <div className="p-4 rounded-2xl bg-[#EFF5EC] border border-[#DCEAD9] text-[#1B3B2B]">
                <span className="font-bold block">Delivery Guarantee</span>
                <span className="text-xs">If any temperature-sensitive delicacy arrives compromised, we immediately dispatch a replacement crate via courier.</span>
              </div>
            </div>
          </div>
        )}

        {/* PAGE: PRODUCT DETAIL */}
        {activePage === "product-detail" && selectedProduct && (
          <ProductDetailsPage
            product={selectedProduct}
            onBack={() => setActivePage("home")}
            onAddToCart={handleAddToCart}
            themeColors={{ primary: "#1B3B2B", secondary: "#2A573F", text: "#1B3B2B", background: "#FAF8F5", cardBg: "#FFFFFF" }}
            business={business}
            relatedProducts={items}
            onSelectProduct={(p) => setSelectedProduct(p)}
          />
        )}
      </main>

      {/* ================= BESPOKE GOURMET FOOTER ================= */}
      <footer className="bg-[#1B3B2B] text-[#D4E8C2] py-16 border-t border-[#224A37] text-xs">
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
                <UtensilsCrossed size={18} className="text-[#D4E8C2]" />
              )}
              <span className="text-base font-serif font-black tracking-tight text-white uppercase">{brandName}</span>
            </div>
            <p className="text-[#A7C8B4] leading-relaxed text-[11px]">
              {business?.description || "Protected origin Mediterranean delicacies, family olive groves, and cold-pack shipping."}
            </p>
            {brandAddress && (
              <p className="text-[#A7C8B4]/80 text-[10px]">📍 {brandAddress}</p>
            )}
          </div>
          <div className="space-y-2">
            <h5 className="font-bold text-white uppercase text-[10px]">The Pantry</h5>
            <p onClick={() => setActivePage("pantry")} className="hover:text-white cursor-pointer">Artisanal Cheeses</p>
            <p onClick={() => setActivePage("pantry")} className="hover:text-white cursor-pointer">Ibérico Charcuterie</p>
          </div>
          <div className="space-y-2">
            <h5 className="font-bold text-white uppercase text-[10px]">Terroirs</h5>
            <p onClick={() => setActivePage("dop-provenance")} className="hover:text-white cursor-pointer">DOP Consortium Standards</p>
            <p onClick={() => setActivePage("cold-shipping")} className="hover:text-white cursor-pointer">Cold Shipping Protocol</p>
          </div>
          <div className="space-y-2">
            <h5 className="font-bold text-white uppercase text-[10px]">Culinary Concierge</h5>
            <p className="text-white font-mono">{brandPhone}</p>
            <p className="text-[#A7C8B4] text-[11px]">{brandEmail}</p>
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
        themeColors={{ primary: "#1B3B2B" }}
      />
    </div>
  );
}
