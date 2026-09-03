import React, { useState } from "react";
import {
  ShoppingBag,
  Search,
  Heart,
  ArrowRight,
  Star,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  X,
  Plus,
  Minus,
  Maximize2,
  Compass,
  Check,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToCart, updateCartQuantity, removeFromCart } from "../../../redux/reducers/cartReducer";
import toast from "react-hot-toast";
import { isOutOfStock, getProductStock } from "../../../utils/stockUtils";
import CartDrawer from "../../common/CartDrawer";
import ProductDetailsPage from "../../common/ProductDetailsPage";
import { getProductImage } from "../../../utils/productImage";

export default function UrbanFashionTemplate({
  business = {},
  products = [],
  categories = [],
  offers = [],
  reviews = [],
  customization = {},
}) {
  const [activePage, setActivePage] = useState("home"); // "home" | "lookbook" | "collections" | "size-guide" | "atelier" | "product-detail"
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [currency, setCurrency] = useState("INR");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSize, setSelectedSize] = useState("all");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart?.cartItems || []);

  const themeColors = customization.colors || {
    primary: "#18181B",
    secondary: "#27272A",
    accent: "#F43F5E",
    background: "#FAFAFA",
    cardBg: "#FFFFFF",
    text: "#18181B",
  };

  const brandName =
    business?.businessName ||
    business?.name ||
    customization?.heroHeadline ||
    "ATELIER URBAN";

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
    "vip@atelierurban.com";

  const rawAddr = business?.address || business?.registered_business_address;
  const brandAddress =
    typeof rawAddr === "string"
      ? rawAddr
      : rawAddr && typeof rawAddr === "object"
      ? [rawAddr.street, rawAddr.addressLine2, rawAddr.city, rawAddr.state, rawAddr.postalCode, rawAddr.country]
          .filter(Boolean)
          .join(", ")
      : null;

  const handleAddToCart = (product, size = "M", qty = 1) => {
    if (isOutOfStock(product)) {
      toast.error(`Sorry, ${product.name || "item"} is out of stock!`);
      return;
    }
    const itemToAdd = { ...product, selectedSize: size };
    dispatch(addToCart({ product: itemToAdd, quantity: qty }));
    toast.success(`${product.name || "Piece"} (${size}) added to bag!`);
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

  const lookbookItems = [
    {
      id: "lb-1",
      season: "Fall / Winter Editorial",
      title: "The Sculptural Cashmere Overcoat",
      photographer: "Photographed in Milan, Italy",
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900&auto=format&fit=crop&q=80",
      description: "Double-faced Mongolian cashmere tailored with an architectural silhouette and horn buttons.",
      price: "₹38,500.00",
    },
    {
      id: "lb-2",
      season: "Evening Silhouette",
      title: "Asymmetric Silk Charmeuse Gown",
      photographer: "Photographed in Paris, France",
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&auto=format&fit=crop&q=80",
      description: "Fluid mulberry silk bias cut that drapes effortlessly across the shoulders with a low scoop back.",
      price: "₹29,900.00",
    },
    {
      id: "lb-3",
      season: "Modern Tailoring",
      title: "Relaxed Virgin Wool Blazer",
      photographer: "Photographed in Tokyo, Japan",
      image: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=900&auto=format&fit=crop&q=80",
      description: "Unstructured bespoke Japanese wool blend with soft dropped shoulders and clean welt pockets.",
      price: "₹24,900.00",
    },
  ];

  const filteredProducts = products.filter((p) => {
    const matchCategory =
      selectedCategory === "all" ||
      (p.category && (p.category.name || p.category) === selectedCategory);
    return matchCategory;
  });

  return (
    <div
      className="min-h-screen flex flex-col font-sans"
      style={{ backgroundColor: themeColors.background, color: themeColors.text }}
    >
      {/* ================= BESPOKE LUXURY FASHION NAVBAR ================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200">
        <div className="bg-zinc-950 text-white text-[10px] uppercase font-black tracking-widest py-1.5 px-4 text-center">
          <span>Complimentary Insured Express Worldwide Delivery on all luxury orders</span>
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
                className="h-10 sm:h-12 w-auto max-w-[150px] object-contain"
              />
            ) : null}
            <div className="space-y-0.5">
              <span className="text-xl sm:text-2xl font-black uppercase tracking-[0.2em] text-zinc-950 font-serif block">
                {brandName}
              </span>
              <span className="text-[9px] uppercase tracking-widest text-zinc-400 block font-sans">
                {business?.tagline || business?.category || "Haute Couture & Streetwear"}
              </span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-8 text-xs font-bold uppercase tracking-wider text-zinc-600">
            {[
              { id: "home", label: "Home" },
              { id: "lookbook", label: "Editorial Lookbook" },
              { id: "collections", label: "Collections" },
              { id: "size-guide", label: "Size & Fit" },
              { id: "atelier", label: "The Atelier" },
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
                    isActive ? "text-zinc-950 font-black" : "hover:text-zinc-950"
                  }`}
                >
                  <span>{tab.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-950 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="text-xs font-bold uppercase tracking-wider bg-transparent border-none text-zinc-800 focus:outline-hidden cursor-pointer"
            >
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>

            <button
              onClick={() => setCartOpen(true)}
              className="p-2.5 rounded-full bg-zinc-100 hover:bg-zinc-200 transition cursor-pointer relative"
              title="Shopping Bag"
            >
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-zinc-900 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
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
            {/* Runway Editorial Hero */}
            <section className="relative h-[85vh] bg-zinc-950 overflow-hidden flex items-end">
              <img
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format&fit=crop&q=80"
                alt="Runway Model"
                className="absolute inset-0 w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

              <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full space-y-6">
                <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-300 border border-zinc-500/40 px-3 py-1 rounded-full backdrop-blur-md">
                  Autumn / Winter Haute Couture
                </span>
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif text-white tracking-tight leading-none max-w-3xl">
                  Uncompromising Elegance & Structured Form.
                </h1>
                <div className="flex flex-wrap gap-4 pt-2">
                  <button
                    onClick={() => setActivePage("collections")}
                    className="px-8 py-4 bg-white hover:bg-zinc-100 text-zinc-950 font-black text-xs uppercase tracking-widest rounded-none transition shadow-2xl cursor-pointer"
                  >
                    Explore Collections
                  </button>
                  <button
                    onClick={() => setActivePage("lookbook")}
                    className="px-8 py-4 bg-transparent border border-white hover:bg-white/10 text-white font-black text-xs uppercase tracking-widest rounded-none transition cursor-pointer"
                  >
                    View Editorial Lookbook
                  </button>
                </div>
              </div>
            </section>

            {/* Curated Grid */}
            <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
              <div className="flex justify-between items-baseline border-b border-zinc-200 pb-4">
                <h2 className="text-2xl font-serif tracking-tight text-zinc-950">
                  New Runway Releases
                </h2>
                <button
                  onClick={() => setActivePage("collections")}
                  className="text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-950 cursor-pointer"
                >
                  View All Pieces →
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
                      className="space-y-4 group cursor-pointer"
                    >
                      <div className="aspect-3/4 bg-zinc-100 overflow-hidden relative">
                        <img
                          src={getProductImage(item, item.image)}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                        />
                        {outOfStock ? (
                          <div className="absolute bottom-4 left-4 right-4 py-2 bg-rose-50 text-rose-600 text-center text-xs font-bold border border-rose-200">
                            Out of Stock
                          </div>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(item, "M");
                            }}
                            className="absolute bottom-4 left-4 right-4 py-3 bg-zinc-950 text-white text-xs font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition duration-300 cursor-pointer"
                          >
                            + Add To Bag
                          </button>
                        )}
                      </div>
                      <div className="flex justify-between items-baseline">
                        <h4 className="text-sm font-bold text-zinc-900 group-hover:text-zinc-600 transition">{item.name}</h4>
                        <span className="text-sm font-mono text-zinc-600">₹{Number(item.price).toFixed(2)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </>
        )}

        {/* PAGE 2: LOOKBOOK */}
        {activePage === "lookbook" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs uppercase font-mono tracking-widest text-zinc-400">Campaign Spreads</span>
              <h1 className="text-4xl font-serif text-zinc-950">Autumn / Winter Editorial Lookbook</h1>
              <p className="text-xs text-zinc-500 font-normal">
                Curated looks photographed on location in Milan and Paris. Designed for effortless transitions between evening salons and gallery openings.
              </p>
            </div>

            <div className="space-y-16">
              {lookbookItems.map((look, i) => (
                <div
                  key={look.id}
                  className={`grid grid-cols-1 lg:grid-cols-12 gap-10 items-center ${
                    i % 2 === 1 ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  <div className="lg:col-span-7 aspect-16/10 rounded-2xl overflow-hidden shadow-xl bg-zinc-100">
                    <img src={look.image} alt={look.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="lg:col-span-5 space-y-4">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-400">{look.season}</span>
                    <h3 className="text-2xl sm:text-3xl font-serif text-zinc-950">{look.title}</h3>
                    <p className="text-xs text-zinc-600 leading-relaxed">{look.description}</p>
                    <p className="text-xs font-mono text-zinc-400">{look.photographer}</p>
                    <div className="pt-2 flex items-center gap-4">
                      <span className="text-lg font-mono font-bold text-zinc-900">{look.price}</span>
                      <button
                        onClick={() => handleAddToCart({ _id: look.id, name: look.title, price: 420, image: look.image })}
                        className="px-6 py-3 bg-zinc-950 text-white text-xs font-black uppercase tracking-widest hover:bg-zinc-800 transition cursor-pointer"
                      >
                        Shop This Silhouette
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PAGE 3: COLLECTIONS */}
        {activePage === "collections" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
            <div className="flex flex-col sm:flex-row justify-between items-baseline gap-4 border-b border-zinc-200 pb-4">
              <div>
                <span className="text-xs uppercase font-mono tracking-widest text-zinc-400">Atelier Archives</span>
                <h1 className="text-3xl font-serif text-zinc-950">Complete Designer Collections</h1>
              </div>

              {/* Size Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Size:</span>
                {["all", "XS", "S", "M", "L", "XL"].map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`w-8 h-8 rounded-full text-xs font-bold font-mono transition cursor-pointer ${
                      selectedSize === sz ? "bg-zinc-950 text-white" : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((item) => {
                const outOfStock = isOutOfStock(item);
                return (
                  <div
                    key={item._id}
                    onClick={() => {
                      setSelectedProduct(item);
                      setActivePage("product-detail");
                    }}
                    className="space-y-3 group cursor-pointer"
                  >
                    <div className="aspect-3/4 bg-zinc-100 overflow-hidden relative">
                      <img src={getProductImage(item, item.image)} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                      {outOfStock ? (
                        <div className="absolute bottom-3 left-3 right-3 py-1.5 bg-rose-50 text-rose-600 text-center text-[10px] font-bold border border-rose-200">
                          Out of Stock
                        </div>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(item, selectedSize === "all" ? "M" : selectedSize);
                          }}
                          className="absolute bottom-3 left-3 right-3 py-2.5 bg-zinc-950 text-white text-xs font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition cursor-pointer"
                        >
                          + Quick Add
                        </button>
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-zinc-900 group-hover:text-zinc-600 transition">{item.name}</h4>
                      <span className="text-xs font-mono text-zinc-600">₹{Number(item.price).toFixed(2)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* PAGE 4: SIZE & FIT GUIDE */}
        {activePage === "size-guide" && (
          <div className="max-w-4xl mx-auto px-4 py-16 space-y-10">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-serif text-zinc-950">International Tailoring & Size Guide</h1>
              <p className="text-xs text-zinc-500">Compare standard US, UK, Italian, and French conversions.</p>
            </div>

            <div className="overflow-x-auto bg-white rounded-2xl border border-zinc-200 p-6">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-zinc-200 font-bold uppercase tracking-wider text-zinc-400">
                    <th className="pb-3">Size</th>
                    <th className="pb-3">Bust / Chest</th>
                    <th className="pb-3">Waist</th>
                    <th className="pb-3">Hips</th>
                    <th className="pb-3">EU</th>
                    <th className="pb-3">IT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 font-mono text-zinc-700">
                  <tr><td className="py-3 font-bold text-zinc-950">XS</td><td>32 - 34"</td><td>24 - 26"</td><td>34 - 36"</td><td>34</td><td>38</td></tr>
                  <tr><td className="py-3 font-bold text-zinc-950">S</td><td>34 - 36"</td><td>26 - 28"</td><td>36 - 38"</td><td>36</td><td>40</td></tr>
                  <tr><td className="py-3 font-bold text-zinc-950">M</td><td>36 - 38"</td><td>28 - 30"</td><td>38 - 40"</td><td>38</td><td>42</td></tr>
                  <tr><td className="py-3 font-bold text-zinc-950">L</td><td>38 - 40"</td><td>30 - 32"</td><td>40 - 42"</td><td>40</td><td>44</td></tr>
                  <tr><td className="py-3 font-bold text-zinc-950">XL</td><td>40 - 42"</td><td>32 - 34"</td><td>42 - 44"</td><td>42</td><td>46</td></tr>
                </tbody>
              </table>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-100 space-y-2 text-xs">
              <h4 className="font-bold text-zinc-900">Custom Bespoke Tailoring Inquiries</h4>
              <p className="text-zinc-600">
                Need alterations or custom measurements? Our in-house master tailors provide complimentary hem adjustments and custom sleeve tapering on all outerwear pieces.
              </p>
            </div>
          </div>
        )}

        {/* PAGE 5: THE ATELIER */}
        {activePage === "atelier" && (
          <div className="max-w-4xl mx-auto px-4 py-16 space-y-12">
            <div className="space-y-4 text-center">
              <span className="text-xs uppercase font-mono tracking-widest text-zinc-400">Craftsmanship & Mills</span>
              <h1 className="text-4xl font-serif text-zinc-950">The Atelier & Fabric Philosophy</h1>
            </div>

            <div className="space-y-6 text-xs sm:text-sm text-zinc-700 leading-relaxed">
              <p>
                Founded on the belief that garments should outlast seasons, Atelier Urban partners with third-generation family-owned textile mills in Biella, Italy, and Okayama, Japan.
              </p>
              <p>
                Each coat requires over 36 hours of hand-canvassing and pressing to achieve an effortless drape that molds naturally to the wearer’s silhouette.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="aspect-4/3 rounded-2xl overflow-hidden bg-zinc-200">
                <img src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&auto=format&fit=crop&q=80" alt="Fabric" className="w-full h-full object-cover" />
              </div>
              <div className="aspect-4/3 rounded-2xl overflow-hidden bg-zinc-200">
                <img src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80" alt="Tailoring" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        )}

        {/* PAGE: PRODUCT DETAIL */}
        {activePage === "product-detail" && selectedProduct && (
          <ProductDetailsPage
            product={selectedProduct}
            onBack={() => setActivePage("home")}
            onAddToCart={(p, qty) => handleAddToCart(p, "M", qty)}
            themeColors={themeColors}
            business={business}
            relatedProducts={products}
            onSelectProduct={(p) => setSelectedProduct(p)}
          />
        )}
      </main>

      {/* ================= BESPOKE LUXURY FASHION FOOTER ================= */}
      <footer className="bg-zinc-950 text-zinc-400 py-16 border-t border-zinc-900 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              {brandLogo && (
                <img
                  src={brandLogo}
                  alt={brandName}
                  className="h-8 w-auto max-w-[130px] object-contain brightness-0 invert"
                />
              )}
              <span className="text-base font-serif font-black tracking-widest text-white uppercase">
                {brandName}
              </span>
            </div>
            <p className="text-zinc-500 leading-relaxed text-[11px]">
              {business?.description || "Slow couture, architectural silhouettes, and heritage wool tailoring."}
            </p>
            {brandAddress && (
              <p className="text-zinc-400 text-[10px]">📍 {brandAddress}</p>
            )}
          </div>

          <div className="space-y-2">
            <h5 className="font-bold text-white uppercase text-[10px] tracking-widest">Collections</h5>
            <p onClick={() => setActivePage("lookbook")} className="hover:text-white cursor-pointer">Editorial Lookbook</p>
            <p onClick={() => setActivePage("collections")} className="hover:text-white cursor-pointer">Runway Pieces</p>
            <p onClick={() => setActivePage("size-guide")} className="hover:text-white cursor-pointer">Tailoring & Sizing</p>
          </div>

          <div className="space-y-2">
            <h5 className="font-bold text-white uppercase text-[10px] tracking-widest">Philosophy</h5>
            <p onClick={() => setActivePage("atelier")} className="hover:text-white cursor-pointer">Italian & Japanese Mills</p>
            <p onClick={() => setActivePage("atelier")} className="hover:text-white cursor-pointer">Slow Fashion Commitment</p>
          </div>

          <div className="space-y-2">
            <h5 className="font-bold text-white uppercase text-[10px] tracking-widest">VIP Concierge</h5>
            {brandPhone && <p className="text-white font-mono">{brandPhone}</p>}
            <p className="text-white font-mono">{brandEmail}</p>
            <p className="text-zinc-500 text-[11px]">Private trunk shows and fittings by appointment.</p>
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
