import React, { useState } from "react";
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
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToCart, updateCartQuantity, removeFromCart } from "../../../redux/reducers/cartReducer";
import toast from "react-hot-toast";
import { isOutOfStock, getProductStock } from "../../../utils/stockUtils";
import CartDrawer from "../../common/CartDrawer";
import ProductDetailsPage from "../../common/ProductDetailsPage";
import { getProductImage } from "../../../utils/productImage";

export default function BagStoreTemplate({
  business = {},
  products = [],
  categories = [],
  offers = [],
  reviews = [],
  customization = {},
}) {
  const [activePage, setActivePage] = useState("home"); // "home" | "catalog" | "leather-craft" | "monogram" | "warranty" | "product-detail"
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedLeather, setSelectedLeather] = useState("all");
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
      leather: "Vachetta Tan",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
      description: "Handcrafted from 6oz Tuscan vegetable-tanned leather with solid brass hardware and a padded 16\" laptop sleeve.",
    },
    {
      _id: "bag-2",
      name: "The Weekender 48-Hour Heritage Duffel",
      price: 440.0,
      leather: "Cognac Brown",
      image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80",
      description: "Reinforced luggage-grade leather base, removable wool shoulder strap, and waterproof interior lining.",
    },
    {
      _id: "bag-3",
      name: "The Minimalist Sculpted Day Tote",
      price: 295.0,
      leather: "Obsidian Black",
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80",
      description: "Structured seamless silhouette with magnetic closure and dual interior smartphone organizer pockets.",
    },
    {
      _id: "bag-4",
      name: "The Urban Commuter Roll-Top Backpack",
      price: 360.0,
      leather: "Vachetta Tan",
      image: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&auto=format&fit=crop&q=80",
      description: "Ergonomic padded leather shoulder straps, expandable 24L capacity, and quick-access side passport zipper.",
    },
  ];

  const items = products.length > 0 ? products : defaultProducts;

  const brandName =
    business?.businessName ||
    business?.name ||
    customization?.heroHeadline ||
    "CUIR & CO.";

  const brandLogo =
    customization?.logo ||
    business?.logo ||
    null;

  const brandPhone =
    business?.phone ||
    business?.businessPhone ||
    business?.contactPhone ||
    "+39 055 289 400";

  const brandEmail =
    business?.email ||
    business?.businessEmail ||
    business?.contactEmail ||
    "concierge@cuircraft.it";

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

  const filteredItems = items.filter((b) => {
    if (selectedLeather === "all") return true;
    return (b.leather || "").toLowerCase().includes(selectedLeather.toLowerCase());
  });

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#FAF7F2] text-[#2C1810]">
      {/* ================= BESPOKE BAG NAVBAR ================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E8DFC8] shadow-xs">
        <div className="bg-[#2C1810] text-[#E0C097] text-[10px] uppercase font-bold tracking-[0.2em] py-1.5 px-4 text-center">
          <span>Full-Grain Tuscan Leather • Lifetime Stitching Warranty • Complimentary Hot-Stamping</span>
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
              <div className="w-10 h-10 rounded-xl bg-[#2C1810] text-[#E0C097] flex items-center justify-center font-black">
                <Briefcase size={20} />
              </div>
            )}
            <div className="space-y-0.5">
              <span className="text-xl sm:text-2xl font-serif font-black tracking-[0.15em] text-[#2C1810] block leading-tight">
                {brandName}
              </span>
              <span className="text-[9px] uppercase tracking-widest text-[#8C6D58] font-bold block">
                {business?.tagline || business?.category || "Leather Atelier • Firenze"}
              </span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-7 text-xs font-bold uppercase tracking-wider text-[#5A3E31]">
            {[
              { id: "home", label: "Home" },
              { id: "catalog", label: "Leather Bags" },
              { id: "leather-craft", label: "Tuscan Tannery" },
              { id: "monogram", label: "Custom Monogram" },
              { id: "warranty", label: "Lifetime Warranty" },
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
                    isActive ? "text-[#2C1810] font-black" : "hover:text-[#2C1810]"
                  }`}
                >
                  <span>{tab.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8C6D58] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCartOpen(true)}
              className="p-2.5 rounded-2xl bg-[#F0E6D2] text-[#2C1810] hover:bg-[#E8DFC8] transition cursor-pointer flex items-center gap-2 font-bold text-xs"
            >
              <ShoppingBag size={18} />
              <span className="hidden sm:inline">Bag</span>
              {cartCount > 0 && (
                <span className="bg-[#8C6D58] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
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
            <section className="py-20 md:py-28 relative overflow-hidden bg-gradient-to-b from-[#F5EDE0] via-[#FAF7F2] to-transparent">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-7 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBDCC5] text-[#4A2F20] text-xs font-bold">
                    <Award size={14} className="text-[#8C6D58]" />
                    <span>Hand-Stitched with Waxed Linen Thread</span>
                  </div>

                  <h1 className="text-4xl sm:text-6xl font-serif font-black tracking-tight text-[#2C1810] leading-tight">
                    Leather Heirloom Bags Built to Age Gracefully.
                  </h1>

                  <p className="text-xs sm:text-sm text-[#5A3E31] leading-relaxed max-w-xl font-normal">
                    Vegetable-tanned in oak barrels in Florence. Our full-grain leather develops a rich, golden amber patina unique to your travels.
                  </p>

                  <div className="flex flex-wrap gap-4 pt-2">
                    <button
                      onClick={() => setActivePage("catalog")}
                      className="px-8 py-4 bg-[#2C1810] hover:bg-[#4A2F20] text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition shadow-lg flex items-center gap-2 cursor-pointer"
                    >
                      <ShoppingBag size={16} />
                      <span>Shop Leather Bags</span>
                    </button>
                    <button
                      onClick={() => setActivePage("monogram")}
                      className="px-6 py-4 bg-white border border-[#D9CEB8] text-[#2C1810] rounded-2xl text-xs font-bold transition hover:bg-[#F5EDE0] cursor-pointer"
                    >
                      Personalize with Initials
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <div className="aspect-4/3 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                    <img
                      src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=900&auto=format&fit=crop&q=80"
                      alt="Leather Duffel"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Showcase */}
            <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8C6D58]">Atelier Staples</span>
                  <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#2C1810]">Handcrafted Favorites</h2>
                </div>
                <button
                  onClick={() => setActivePage("catalog")}
                  className="text-xs font-bold text-[#8C6D58] hover:underline cursor-pointer"
                >
                  View All Silhouettes →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {items.slice(0, 4).map((bag) => {
                  const outOfStock = isOutOfStock(bag);
                  return (
                    <div
                      key={bag._id}
                      onClick={() => {
                        setSelectedProduct(bag);
                        setActivePage("product-detail");
                      }}
                      className="bg-white rounded-3xl border border-[#E8DFC8] p-4 space-y-3 flex flex-col justify-between shadow-2xs hover:shadow-md transition cursor-pointer group"
                    >
                      <div className="space-y-3">
                        <div className="aspect-square rounded-2xl overflow-hidden bg-[#FAF7F2]">
                          <img src={getProductImage(bag, bag.image)} alt={bag.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C6D58]">{bag.leather || "Full Grain"}</span>
                        <h4 className="text-sm font-bold text-[#2C1810] line-clamp-1 group-hover:text-[#8C6D58] transition">{bag.name}</h4>
                      </div>
                      <div className="pt-2 flex justify-between items-center border-t border-[#F0E6D2]">
                        <span className="text-base font-black text-[#2C1810]">₹{Number(bag.price).toFixed(2)}</span>
                        {outOfStock ? (
                          <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-200">
                            Out of Stock
                          </span>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(bag);
                            }}
                            className="px-3 py-1.5 bg-[#2C1810] hover:bg-[#4A2F20] text-white rounded-xl text-xs font-bold cursor-pointer"
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

        {/* PAGE 2: CATALOG */}
        {activePage === "catalog" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
            <div className="flex flex-col sm:flex-row justify-between items-baseline gap-4 border-b border-[#E8DFC8] pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#8C6D58]">The Full Collection</span>
                <h1 className="text-3xl font-serif font-black text-[#2C1810]">Handcrafted Leather Bags</h1>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase text-[#8C6D58]">Leather:</span>
                {["all", "Tan", "Brown", "Black"].map((clr) => (
                  <button
                    key={clr}
                    onClick={() => setSelectedLeather(clr)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                      selectedLeather === clr
                        ? "bg-[#2C1810] text-white border-[#2C1810]"
                        : "bg-white text-[#2C1810] border-[#E8DFC8] hover:bg-[#F5EDE0]"
                    }`}
                  >
                    {clr === "all" ? "All Hues" : clr}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredItems.map((bag) => {
                const outOfStock = isOutOfStock(bag);
                return (
                  <div
                    key={bag._id}
                    onClick={() => {
                      setSelectedProduct(bag);
                      setActivePage("product-detail");
                    }}
                    className="bg-white rounded-3xl border border-[#E8DFC8] p-4 space-y-3 flex flex-col justify-between shadow-2xs hover:shadow-md transition cursor-pointer group"
                  >
                    <div className="space-y-3">
                      <div className="aspect-square rounded-2xl overflow-hidden bg-[#FAF7F2]">
                        <img src={getProductImage(bag, bag.image)} alt={bag.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C6D58]">{bag.leather || "Full Grain"}</span>
                      <h4 className="text-sm font-bold text-[#2C1810] group-hover:text-[#8C6D58] transition">{bag.name}</h4>
                      <p className="text-xs text-[#5A3E31] line-clamp-2">{bag.description}</p>
                    </div>
                    <div className="pt-2 flex justify-between items-center border-t border-[#F0E6D2]">
                      <span className="text-base font-black text-[#2C1810]">₹{Number(bag.price).toFixed(2)}</span>
                      {outOfStock ? (
                        <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-200">
                          Out of Stock
                        </span>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(bag);
                          }}
                          className="px-3.5 py-1.5 bg-[#2C1810] hover:bg-[#4A2F20] text-white rounded-xl text-xs font-bold cursor-pointer"
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

        {/* PAGE 3: LEATHER CRAFT */}
        {activePage === "leather-craft" && (
          <div className="max-w-4xl mx-auto px-4 py-16 space-y-12">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8C6D58]">Tuscan Provenance</span>
              <h1 className="text-3xl font-serif font-black text-[#2C1810]">The Art of Vegetable Tanning</h1>
            </div>

            <div className="space-y-6 text-xs sm:text-sm text-[#5A3E31] leading-relaxed">
              <p>
                Unlike 90% of modern mass-produced bags treated with harsh chromium salts, every Cuir & Co. bag is tanned in Tuscany using natural tree tannins (Chestnut, Mimosa, and Quebracho).
              </p>
              <p>
                This 40-day artisanal process results in an organic, breathable leather that softens with every journey and absorbs natural oils to develop an exquisite amber patina over decades.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-3xl bg-white border border-[#E8DFC8] space-y-3 shadow-xs">
                <ShieldCheck size={28} className="text-[#8C6D58]" />
                <h4 className="text-base font-bold text-[#2C1810]">Solid Brass Hardware</h4>
                <p className="text-xs text-[#5A3E31]">Sand-cast solid brass buckles and rivets that will never chip, flake, or corrode.</p>
              </div>
              <div className="p-6 rounded-3xl bg-white border border-[#E8DFC8] space-y-3 shadow-xs">
                <Layers size={28} className="text-[#8C6D58]" />
                <h4 className="text-base font-bold text-[#2C1810]">Beveled & Burnished Edges</h4>
                <p className="text-xs text-[#5A3E31]">Each edge is hand-rubbed with organic beeswax and friction-burnished for lasting moisture protection.</p>
              </div>
              <div className="p-6 rounded-3xl bg-white border border-[#E8DFC8] space-y-3 shadow-xs">
                <Award size={28} className="text-[#8C6D58]" />
                <h4 className="text-base font-bold text-[#2C1810]">Saddle-Stitch Durability</h4>
                <p className="text-xs text-[#5A3E31]">Two-needle saddle stitching using heavy-duty Japanese bonded thread that won't unravel even if severed.</p>
              </div>
            </div>
          </div>
        )}

        {/* PAGE 4: MONOGRAM */}
        {activePage === "monogram" && (
          <div className="max-w-2xl mx-auto px-4 py-16 space-y-8">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8C6D58]">Bespoke Personalization</span>
              <h1 className="text-3xl font-serif font-black text-[#2C1810]">Complimentary Hot-Foil Monogramming</h1>
              <p className="text-xs text-[#5A3E31]">Our master binder hand-stamps your initials into the leather tag with heated brass type.</p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-[#E8DFC8] space-y-6 shadow-xs">
              {/* Monogram Live Preview Tag */}
              <div className="p-8 rounded-2xl bg-[#3D2317] text-center border-4 border-[#2C1810] shadow-inner space-y-2">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#E0C097]/60">Monogrammed Leather Tag</span>
                <h2
                  className={`text-3xl sm:text-4xl font-serif font-black tracking-[0.25em] ${
                    monogramFoil === "Gold" ? "text-[#F5D061]" : monogramFoil === "Silver" ? "text-slate-200" : "text-[#24130A]"
                  }`}
                >
                  {monogramText || "A.B."}
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#2C1810] mb-1">Your Initials (Up to 3 Letters)</label>
                  <input
                    type="text"
                    maxLength={5}
                    value={monogramText}
                    onChange={(e) => setMonogramText(e.target.value.toUpperCase())}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#D9CEB8] text-sm font-mono font-bold text-[#2C1810] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2C1810] mb-1">Foil Type</label>
                  <div className="grid grid-cols-3 gap-3">
                    {["Gold", "Silver", "Blind (Debossed)"].map((foil) => (
                      <button
                        key={foil}
                        onClick={() => setMonogramFoil(foil)}
                        className={`py-2.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                          monogramFoil === foil ? "bg-[#2C1810] text-white border-[#2C1810]" : "bg-[#FAF7F2] text-[#2C1810] border-[#E8DFC8]"
                        }`}
                      >
                        {foil}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleAddToCart(items[0], monogramText)}
                  className="w-full py-3.5 bg-[#2C1810] hover:bg-[#4A2F20] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md"
                >
                  Apply Monogram to Briefcase & Add to Bag
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PAGE 5: WARRANTY */}
        {activePage === "warranty" && (
          <div className="max-w-3xl mx-auto px-4 py-16 space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-serif font-black text-[#2C1810]">Our Lifetime Stitching & Hardware Guarantee</h1>
              <p className="text-xs text-[#5A3E31]">We stand behind every rivet, stitch, and zipper for the lifetime of your bag.</p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-[#E8DFC8] space-y-4 shadow-xs text-xs sm:text-sm text-[#5A3E31] leading-relaxed">
              <p>
                If a buckle cracks, a zipper breaks, or a seam loosens under ordinary travel use, send your bag back to our atelier. We will restore and condition the leather at zero labor cost.
              </p>
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DFC8] space-y-1">
                <h5 className="font-bold text-[#2C1810]">Complimentary Annual Conditioning</h5>
                <p className="text-xs text-[#8C6D58]">Drop off your bag at any Cuir & Co. salon for free beeswax buffing and weatherproofing treatment.</p>
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
            themeColors={{ primary: "#8C6D58", secondary: "#A0806B", text: "#2C1810", background: "#FAF7F2", cardBg: "#FFFFFF" }}
            business={business}
            relatedProducts={items}
            onSelectProduct={(p) => setSelectedProduct(p)}
          />
        )}
      </main>

      {/* ================= BESPOKE BAG FOOTER ================= */}
      <footer className="bg-[#2C1810] text-[#E0C097] py-16 border-t border-[#3D2317] text-xs">
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
                <Briefcase size={18} className="text-[#E0C097]" />
              )}
              <span className="text-base font-serif font-black tracking-widest text-white uppercase">{brandName}</span>
            </div>
            <p className="text-[#C2A584] leading-relaxed text-[11px]">
              {business?.description || "Tuscan vegetable-tanned leather bags, solid brass hardware, and lifetime artisan stitching."}
            </p>
            {brandAddress && (
              <p className="text-[#C2A584]/80 text-[10px]">📍 {brandAddress}</p>
            )}
          </div>
          <div className="space-y-2">
            <h5 className="font-bold text-white uppercase text-[10px]">Silhouettes</h5>
            <p onClick={() => setActivePage("catalog")} className="hover:text-white cursor-pointer">Briefcases & Folios</p>
            <p onClick={() => setActivePage("catalog")} className="hover:text-white cursor-pointer">Weekend Duffels</p>
          </div>
          <div className="space-y-2">
            <h5 className="font-bold text-white uppercase text-[10px]">Artisan Services</h5>
            <p onClick={() => setActivePage("monogram")} className="hover:text-white cursor-pointer">Complimentary Monogramming</p>
            <p onClick={() => setActivePage("warranty")} className="hover:text-white cursor-pointer">Lifetime Repair Guarantee</p>
          </div>
          <div className="space-y-2">
            <h5 className="font-bold text-white uppercase text-[10px]">Firenze Workshop</h5>
            <p className="text-white font-mono">{brandPhone}</p>
            <p className="text-[#C2A584] text-[11px]">{brandEmail}</p>
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
        themeColors={{ primary: "#8C6D58" }}
      />
    </div>
  );
}
