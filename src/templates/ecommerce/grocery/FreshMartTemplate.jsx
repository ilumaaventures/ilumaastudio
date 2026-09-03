import React, { useState, useMemo, useEffect } from "react";
import {
  ShoppingBag,
  Search,
  Truck,
  ShieldCheck,
  Zap,
  Sparkles,
  ArrowRight,
  Star,
  MapPin,
  Clock,
  CheckCircle2,
  X,
  Phone,
  Plus,
  Minus,
  Utensils,
  Leaf,
  Layers,
  HelpCircle,
  Apple,
  Croissant,
  Egg,
  CupSoda,
  Package,
  Flame,
  Check,
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

export default function FreshMartTemplate({
  business = {},
  products = [],
  categories = [],
  offers = [],
  reviews = [],
  customization = {},
}) {
  // Navigation: "home" | "aisles" | "meal-kits" | "freshness-lab" | "product-detail"
  const [activePage, setActivePage] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);

  // Filters & Search
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");

  // Delivery Zip Checker
  const [zipInput, setZipInput] = useState("10001");
  const [zipVerified, setZipVerified] = useState(true);

  // 30-Min Delivery Timer
  const [timeLeft, setTimeLeft] = useState({ minutes: 24, seconds: 18 });

  // Interactive Chef's Meal-Kit Studio State
  const [selectedRecipeId, setSelectedRecipeId] = useState("truffle-pasta");
  const [servings, setServings] = useState(2);
  const [selectedIngredients, setSelectedIngredients] = useState([
    "ing-1",
    "ing-2",
    "ing-3",
    "ing-4",
  ]);

  // Freshness Lab Hours Slider
  const [supplyHours, setSupplyHours] = useState(18);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart?.cartItems || []);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { minutes: prev.minutes - 1, seconds: 59 };
        return { minutes: 29, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fallbackGroceries = [
    {
      _id: "p1",
      name: "Crisp Organic Honeycrisp Apples",
      price: 4.99,
      compareAtPrice: 6.99,
      unit: "per lb (approx 3 pcs)",
      category: "Fresh Produce",
      rating: 4.9,
      reviewCount: 142,
      badge: "Organic",
      image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80",
      description: "Orchard-picked certified organic Honeycrisp apples, sweet, crunchy and refreshing.",
      inStock: true,
    },
    {
      _id: "p2",
      name: "Artisan Sourdough Country Loaf",
      price: 6.49,
      compareAtPrice: 7.5,
      unit: "750g Loaf",
      category: "Artisanal Bakery",
      rating: 5.0,
      reviewCount: 98,
      badge: "Freshly Baked",
      image: "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=600&auto=format&fit=crop&q=80",
      description: "Naturally leavened slow-fermented sourdough with blistered golden crust and airy crumb.",
      inStock: true,
    },
    {
      _id: "p3",
      name: "Pasture-Raised Organic Grade A Eggs",
      price: 5.89,
      compareAtPrice: 6.99,
      unit: "Dozen (12 count)",
      category: "Dairy & Eggs",
      rating: 4.8,
      reviewCount: 215,
      badge: "Non-GMO",
      image: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=600&auto=format&fit=crop&q=80",
      description: "Rich golden yolks from free-roaming hens raised on nutrient-rich open pastures.",
      inStock: true,
    },
    {
      _id: "p4",
      name: "Cold-Pressed Green Detox Elixir",
      price: 7.25,
      compareAtPrice: 8.99,
      unit: "16 fl oz",
      category: "Beverages & Juices",
      rating: 4.9,
      reviewCount: 77,
      badge: "Raw & Cold-Pressed",
      image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600&auto=format&fit=crop&q=80",
      description: "Kale, cucumber, crisp green apple, celery, lemon, and ginger with no added sugar or water.",
      inStock: true,
    },
    {
      _id: "p5",
      name: "Greek Kalamata Extra Virgin Olive Oil",
      price: 18.99,
      compareAtPrice: 24.0,
      unit: "500 ml Glass Bottle",
      category: "Pantry & Spices",
      rating: 4.9,
      reviewCount: 310,
      badge: "First Cold Pressed",
      image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80",
      description: "Single-origin unfiltered early harvest extra virgin olive oil from Messinia, Greece.",
      inStock: true,
    },
    {
      _id: "p6",
      name: "Wildflower Raw Mountain Honeycomb",
      price: 12.5,
      compareAtPrice: 15.0,
      unit: "350g Jar",
      category: "Pantry & Spices",
      rating: 4.9,
      reviewCount: 164,
      badge: "100% Pure Raw",
      image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&auto=format&fit=crop&q=80",
      description: "Unpasteurized raw honeycomb packed with active floral enzymes and antioxidants.",
      inStock: true,
    },
  ];

  const groceryItems = products.length > 0 ? products : fallbackGroceries;

  const brandName =
    business?.businessName ||
    business?.name ||
    customization?.heroHeadline ||
    "FreshMart";

  const brandLogo = customization?.logo || business?.logo || null;
  const brandPhone =
    business?.phone ||
    business?.businessPhone ||
    business?.contactPhone ||
    "1-800-FRESH-MT";
  const brandEmail =
    business?.email ||
    business?.businessEmail ||
    business?.contactEmail ||
    "care@freshmartgroceries.com";

  // Filtered groceries
  const filteredGroceries = useMemo(() => {
    return groceryItems
      .filter((item) => {
        if (selectedCategory !== "all") {
          const cat = (item.category || "").toLowerCase();
          const filter = selectedCategory.toLowerCase();
          if (!cat.includes(filter)) return false;
        }

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const nameM = (item.name || "").toLowerCase().includes(q);
          const descM = (item.description || "").toLowerCase().includes(q);
          const catM = (item.category || "").toLowerCase().includes(q);
          if (!nameM && !descM && !catM) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return Number(a.price) - Number(b.price);
        if (sortBy === "price-desc") return Number(b.price) - Number(a.price);
        if (sortBy === "rating") return (b.rating || 5) - (a.rating || 5);
        return 0;
      });
  }, [groceryItems, selectedCategory, searchQuery, sortBy]);

  // Cart operations
  const handleAddToCart = (product, qty = 1) => {
    if (isOutOfStock(product)) {
      toast.error(`Sorry, ${product.name || "item"} is out of stock!`);
      return;
    }
    dispatch(addToCart({ product, quantity: qty }));
    toast.success(`${product.name} added to cart! 🥦`);
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

  // Helper to check item quantity in cart
  const getItemCartQty = (productId) => {
    const item = cartItems.find((i) => (i._id || i.id) === productId);
    return item ? item.quantity : 0;
  };

  // Recipe kits
  const recipes = [
    {
      id: "truffle-pasta",
      name: "Tuscan Truffle & Wild Porcini Pasta",
      prepTime: "20 Mins",
      difficulty: "Easy Chef",
      image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&auto=format&fit=crop&q=80",
      description: "Bronze-cut tagliatelle tossed with sautéed cremini, shaved black truffle butter, and 36-month aged Parmigiano.",
      ingredients: [
        { id: "ing-1", name: "Artisan Bronze-Die Tagliatelle (500g)", price: 4.5, baseQty: "1 pack" },
        { id: "ing-2", name: "Fresh Organic Cremini Mushrooms (250g)", price: 3.2, baseQty: "1 punnet" },
        { id: "ing-3", name: "Black Truffle Infused Butter (100g)", price: 6.8, baseQty: "1 tub" },
        { id: "ing-4", name: "Aged Parmigiano Reggiano Wedge (150g)", price: 5.5, baseQty: "1 piece" },
      ],
    },
    {
      id: "acai-bowl",
      name: "Superfood Organic Acai & Dragonfruit Bowl",
      prepTime: "10 Mins",
      difficulty: "No Cook",
      image: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=800&auto=format&fit=crop&q=80",
      description: "Amazonian wild-harvested frozen acai puree topped with chia seed granola, fresh blueberries, and raw honeycomb.",
      ingredients: [
        { id: "ing-1", name: "Organic Wild Acai Smoothie Packs (4ct)", price: 7.0, baseQty: "1 pack" },
        { id: "ing-2", name: "Ancient Grain Sprouted Granola (350g)", price: 5.4, baseQty: "1 bag" },
        { id: "ing-3", name: "Fresh Orchard Blueberries (170g)", price: 3.99, baseQty: "1 punnet" },
        { id: "ing-4", name: "Raw Mountain Honeycomb (250g)", price: 8.5, baseQty: "1 jar" },
      ],
    },
  ];

  const currentRecipe = recipes.find((r) => r.id === selectedRecipeId) || recipes[0];

  // Calculate meal kit total
  const mealKitTotal = useMemo(() => {
    const baseSum = currentRecipe.ingredients
      .filter((ing) => selectedIngredients.includes(ing.id))
      .reduce((sum, ing) => sum + ing.price, 0);
    const multiplier = servings / 2;
    return baseSum * multiplier;
  }, [currentRecipe, selectedIngredients, servings]);

  const toggleIngredient = (id) => {
    if (selectedIngredients.includes(id)) {
      setSelectedIngredients(selectedIngredients.filter((i) => i !== id));
    } else {
      setSelectedIngredients([...selectedIngredients, id]);
    }
  };

  const handleAddMealKitToCart = () => {
    const selectedIngObjs = currentRecipe.ingredients.filter((i) => selectedIngredients.includes(i.id));
    if (selectedIngObjs.length === 0) {
      toast.error("Please select at least one ingredient for the meal kit.");
      return;
    }

    const mealKitProduct = {
      _id: `mealkit-${Date.now()}`,
      name: `Chef Kit: ${currentRecipe.name} (${servings} Servings)`,
      price: mealKitTotal,
      image: currentRecipe.image,
      category: "Chef Meal-Kits",
      unit: `${servings} Servings (${selectedIngObjs.length} Items)`,
      description: `Includes: ${selectedIngObjs.map((i) => i.name).join(", ")}.`,
    };

    dispatch(addToCart({ product: mealKitProduct, quantity: 1 }));
    toast.success(`Complete ${currentRecipe.name} kit added to cart! 🍳`);
    setCartOpen(true);
  };

  // Freshness nutrient calculation
  const nutrientRetention = Math.max(45, Math.round(98 - (supplyHours - 12) * 0.7));

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#F8FAF9] text-[#0F172A] antialiased selection:bg-emerald-100 selection:text-emerald-900">
      {/* ================= 1. 30-MIN EXPRESS TOP BAR ================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-950/10 shadow-2xs">
        <div className="bg-[#15803D] text-white text-[11px] py-2 px-4">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-medium tracking-wide">
              <Zap size={14} className="text-yellow-300 fill-yellow-300 animate-bounce" />
              <span>
                <strong>Express 30-Min Delivery:</strong> Order in next{" "}
                <strong className="font-mono bg-emerald-800 px-1.5 py-0.5 rounded text-white tracking-wider">
                  {String(timeLeft.minutes).padStart(2, "0")}:{String(timeLeft.seconds).padStart(2, "0")}
                </strong>{" "}
                for arrival before 30 minutes! • Cold-Chain Insulated Bags
              </span>
            </div>

            <div className="hidden md:flex items-center gap-6 text-[11px] font-medium text-emerald-100">
              <span className="flex items-center gap-1.5">
                <Truck size={14} className="text-emerald-300" /> Free Shipping Above ₹499
              </span>
              <span className="flex items-center gap-1.5">
                <Leaf size={14} className="text-emerald-300" /> 100% Certified Organic Partners
              </span>
              <a href={`tel:${brandPhone}`} className="hover:text-white transition flex items-center gap-1">
                <Phone size={13} /> {brandPhone}
              </a>
            </div>
          </div>
        </div>

        {/* Main Header Bar */}
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
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-600 to-green-800 text-white flex items-center justify-center shadow-md shadow-emerald-900/10 group-hover:scale-105 transition duration-300">
                <Leaf size={24} className="text-emerald-200" />
              </div>
            )}
            <div className="space-y-0.5 text-left">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-[#15803D] block leading-none">
                {brandName}
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#16A34A] font-bold block">
                Farm-Direct Organic & Fresh Market
              </span>
            </div>
          </div>

          {/* Nav tabs */}
          <nav className="hidden lg:flex items-center gap-8 text-[12px] font-bold uppercase tracking-wider text-[#15803D]">
            {[
              { id: "home", label: "Marketplace" },
              { id: "aisles", label: "Fresh Aisles" },
              { id: "meal-kits", label: "Chef's Meal-Kits 👨‍🍳" },
              { id: "freshness-lab", label: "Harvest Freshness Lab" },
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
                    isActive ? "text-[#15803D] font-black" : "hover:text-emerald-700 text-[#3F624C]"
                  }`}
                >
                  <span>{tab.label}</span>
                  {isActive && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#16A34A] rounded-full" />}
                </button>
              );
            })}
          </nav>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setActivePage("meal-kits");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-emerald-50 text-[#15803D] hover:bg-emerald-100 font-bold text-xs border border-emerald-200 transition cursor-pointer"
            >
              <Utensils size={14} className="text-[#16A34A]" />
              <span>Meal Kits</span>
            </button>

            <button
              onClick={() => setCartOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-[#15803D] text-white hover:bg-emerald-800 transition cursor-pointer flex items-center gap-2 font-bold text-xs shadow-md shadow-emerald-950/20"
            >
              <ShoppingBag size={17} className="text-emerald-200" />
              <span className="hidden sm:inline">Fresh Basket</span>
              <span className="bg-[#EAB308] text-[#15803D] text-[11px] font-black min-w-[20px] h-5 px-1 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ================= 2. MAIN CONTENT ================= */}
      <main className="flex-1">
        {/* ================= PAGE 1: MARKETPLACE HOME ================= */}
        {activePage === "home" && (
          <>
            {/* HERO SECTION */}
            <section className="relative overflow-hidden bg-gradient-to-b from-[#EBF5EF] via-[#F4F9F6] to-[#F8FAF9] pt-12 pb-20 md:pt-18 md:pb-24 border-b border-emerald-950/5">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  <div className="lg:col-span-7 space-y-6 text-left">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-emerald-200 text-[#15803D] text-xs font-semibold shadow-2xs">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      <span>Farm-Picked at 5:00 AM • Cold-Pressed & Delivered Fresh Today</span>
                    </div>

                    <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#0F172A] leading-[1.08]">
                      Certified Organic Harvest Delivered in 30 Minutes.
                    </h1>

                    <p className="text-sm sm:text-base text-[#475569] leading-relaxed max-w-xl">
                      Skip supermarket aisles. Orchard-crisp apples, naturally leavened sourdoughs, and unpasteurized raw honey harvested directly from certified organic family growers.
                    </p>

                    <div className="flex flex-wrap gap-4 pt-2">
                      <button
                        onClick={() => {
                          setActivePage("aisles");
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="px-8 py-4 bg-[#15803D] hover:bg-emerald-800 text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition shadow-lg shadow-emerald-950/20 flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
                      >
                        <ShoppingBag size={17} />
                        <span>Browse Fresh Aisles</span>
                      </button>

                      <button
                        onClick={() => {
                          setActivePage("meal-kits");
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="px-7 py-4 bg-white border border-emerald-300 text-[#15803D] hover:bg-emerald-50 rounded-2xl text-xs font-bold uppercase tracking-wider transition flex items-center gap-2 cursor-pointer"
                      >
                        <Utensils size={16} />
                        <span>Chef's Recipe Kits</span>
                      </button>
                    </div>

                    {/* Postal check */}
                    <div className="pt-2 max-w-md">
                      <div className="p-1.5 bg-white rounded-2xl border border-emerald-200 shadow-2xs flex items-center gap-2">
                        <MapPin size={16} className="text-[#16A34A] ml-2.5 shrink-0" />
                        <input
                          type="text"
                          value={zipInput}
                          onChange={(e) => setZipInput(e.target.value)}
                          placeholder="Enter your Delivery ZIP Code..."
                          className="w-full text-xs font-medium text-slate-800 focus:outline-none"
                        />
                        <button
                          onClick={() => {
                            setZipVerified(true);
                            toast.success(`ZIP ${zipInput} verified for 30-min delivery!`);
                          }}
                          className="px-4 py-2 bg-emerald-100 hover:bg-emerald-200 text-[#15803D] text-[11px] font-bold rounded-xl shrink-0 transition"
                        >
                          Check Slot
                        </button>
                      </div>
                      {zipVerified && (
                        <p className="text-[11px] font-semibold text-emerald-800 flex items-center gap-1.5 mt-2 ml-1">
                          <CheckCircle2 size={14} className="text-emerald-600" />
                          <span>Delivering to {zipInput} in 25–30 mins via Eco-Electric Fleet</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Hero Visual */}
                  <div className="lg:col-span-5 relative">
                    <div className="aspect-[4/3] rounded-[36px] overflow-hidden shadow-2xl border-8 border-white bg-emerald-50">
                      <img
                        src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=900&auto=format&fit=crop&q=80"
                        alt="Organic Grocery Market"
                        className="w-full h-full object-cover transform hover:scale-105 transition duration-700"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* AISLE SHORTCUTS */}
            <section className="py-10 bg-white border-b border-emerald-950/5">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {[
                    { id: "produce", name: "Fresh Produce", emoji: "🍎", count: "124 items" },
                    { id: "bakery", name: "Artisanal Bakery", emoji: "🥐", count: "48 items" },
                    { id: "dairy", name: "Dairy & Eggs", emoji: "🥚", count: "62 items" },
                    { id: "beverages", name: "Cold-Pressed Juices", emoji: "🧃", count: "76 items" },
                    { id: "pantry", name: "Pantry & Spices", emoji: "🍯", count: "180 items" },
                  ].map((aisle) => (
                    <button
                      key={aisle.id}
                      onClick={() => {
                        setSelectedCategory(aisle.name);
                        setActivePage("aisles");
                        window.scrollTo({ top: 300, behavior: "smooth" });
                      }}
                      className="p-4 rounded-2xl bg-[#F8FAF9] border border-emerald-100 hover:border-emerald-500 hover:bg-emerald-50/60 transition group text-center space-y-1 cursor-pointer shadow-2xs"
                    >
                      <span className="text-2xl block group-hover:scale-110 transition duration-200">{aisle.emoji}</span>
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700">{aisle.name}</h4>
                      <p className="text-[10px] text-slate-500">{aisle.count}</p>
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* POPULAR HARVEST GRID */}
            <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-left">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-emerald-950/10 pb-6">
                <div>
                  <span className="text-xs uppercase tracking-wider text-[#16A34A] font-bold">In Season This Morning</span>
                  <h2 className="text-3xl font-black text-slate-900">Today's Farm Fresh Harvest</h2>
                </div>
                <button
                  onClick={() => {
                    setActivePage("aisles");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#15803D] hover:underline cursor-pointer"
                >
                  <span>View All Aisles ({groceryItems.length} items)</span>
                  <ArrowRight size={14} />
                </button>
              </div>

              {/* Items */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {groceryItems.map((item) => {
                  const qtyInCart = getItemCartQty(item._id);
                  return (
                    <div
                      key={item._id}
                      className="bg-white rounded-3xl border border-slate-200/80 p-5 space-y-4 flex flex-col justify-between shadow-xs hover:shadow-xl transition cursor-pointer group"
                    >
                      <div
                        onClick={() => {
                          setSelectedProduct(item);
                          setActivePage("product-detail");
                        }}
                        className="space-y-3"
                      >
                        <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-emerald-50 relative">
                          <img
                            src={getProductImage(item, item.image)}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-108 transition duration-500"
                          />
                          {item.badge && (
                            <span className="absolute top-3 left-3 bg-[#15803D]/90 backdrop-blur-xs text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-[11px] font-bold">
                          <span className="text-[#16A34A] uppercase tracking-wider">{item.category}</span>
                          <span className="text-slate-500 flex items-center gap-1">
                            <Star size={12} className="text-amber-500 fill-amber-500" />
                            {item.rating || 5.0} ({item.reviewCount || 40})
                          </span>
                        </div>

                        <h4 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition">
                          {item.name}
                        </h4>

                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{item.description}</p>
                        <span className="text-[11px] text-slate-400 block">{item.unit}</span>
                      </div>

                      {/* Price & Quantity Stepper */}
                      <div className="pt-3 flex justify-between items-center border-t border-slate-100">
                        <div>
                          <span className="text-xl font-black text-slate-900">₹{Number(item.price).toFixed(2)}</span>
                          {item.compareAtPrice && (
                            <span className="text-xs text-slate-400 line-through ml-1.5">
                              ₹{Number(item.compareAtPrice).toFixed(2)}
                            </span>
                          )}
                        </div>

                        {qtyInCart > 0 ? (
                          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl p-1">
                            <button
                              onClick={() => handleUpdateQuantity(item._id, qtyInCart - 1)}
                              className="w-7 h-7 rounded-lg bg-white text-[#15803D] font-black flex items-center justify-center hover:bg-emerald-100"
                            >
                              -
                            </button>
                            <span className="text-xs font-black text-[#15803D] px-1">{qtyInCart}</span>
                            <button
                              onClick={() => handleUpdateQuantity(item._id, qtyInCart + 1)}
                              className="w-7 h-7 rounded-lg bg-[#15803D] text-white font-black flex items-center justify-center hover:bg-emerald-800"
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleAddToCart(item)}
                            className="px-4 py-2 bg-[#15803D] hover:bg-emerald-800 text-white rounded-xl text-xs font-bold cursor-pointer transition shadow-xs flex items-center gap-1.5"
                          >
                            <Plus size={14} /> Add
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

        {/* ================= PAGE 2: AISLES CATALOG ================= */}
        {activePage === "aisles" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10 text-left">
            <div className="space-y-4 border-b border-emerald-950/10 pb-6">
              <span className="text-xs uppercase tracking-wider text-[#16A34A] font-bold">Grocery Catalog</span>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900">Shop Farm-Fresh Aisles</h1>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pt-2">
                <div className="md:col-span-6 relative">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search organic produce, bread, eggs, juices..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs text-slate-800 focus:outline-none"
                  />
                </div>

                <div className="md:col-span-6 flex flex-wrap gap-2 items-center">
                  {["all", "Produce", "Bakery", "Dairy", "Beverages", "Pantry"].map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedCategory(c)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition border ${
                        selectedCategory.toLowerCase() === c.toLowerCase()
                          ? "bg-[#15803D] text-white border-[#15803D]"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-emerald-50"
                      }`}
                    >
                      {c === "all" ? "All Aisles" : c}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGroceries.map((item) => {
                const qtyInCart = getItemCartQty(item._id);
                return (
                  <div key={item._id} className="bg-white rounded-3xl border border-slate-200/80 p-5 space-y-4 flex flex-col justify-between shadow-xs hover:shadow-xl transition">
                    <div className="space-y-3">
                      <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-emerald-50">
                        <img src={getProductImage(item, item.image)} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[10px] font-bold text-[#16A34A] uppercase tracking-wider block">{item.category}</span>
                      <h4 className="text-base font-bold text-slate-900">{item.name}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2">{item.description}</p>
                      <span className="text-[11px] text-slate-400 block">{item.unit}</span>
                    </div>

                    <div className="pt-3 flex justify-between items-center border-t border-slate-100">
                      <span className="text-xl font-black text-slate-900">₹{Number(item.price).toFixed(2)}</span>
                      {qtyInCart > 0 ? (
                        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl p-1">
                          <button onClick={() => handleUpdateQuantity(item._id, qtyInCart - 1)} className="w-7 h-7 rounded-lg bg-white text-[#15803D] font-black flex items-center justify-center">-</button>
                          <span className="text-xs font-black text-[#15803D] px-1">{qtyInCart}</span>
                          <button onClick={() => handleUpdateQuantity(item._id, qtyInCart + 1)} className="w-7 h-7 rounded-lg bg-[#15803D] text-white font-black flex items-center justify-center">+</button>
                        </div>
                      ) : (
                        <button onClick={() => handleAddToCart(item)} className="px-4 py-2 bg-[#15803D] hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition">
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

        {/* ================= PAGE 3: CHEF'S MEAL-KIT RECIPE STUDIO ================= */}
        {activePage === "meal-kits" && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 text-left">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs uppercase tracking-[0.2em] text-[#16A34A] font-bold">Zero-Waste Cooking</span>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900">Chef's Ingredient Meal-Kit Studio</h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Choose a restaurant recipe, adjust family servings, toggle pantry items you already own, and add all exact-portioned organic ingredients in 1 click.
              </p>
            </div>

            {/* Recipe Tabs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recipes.map((r) => (
                <div
                  key={r.id}
                  onClick={() => setSelectedRecipeId(r.id)}
                  className={`p-5 rounded-3xl border-2 transition cursor-pointer flex gap-4 items-center ${
                    selectedRecipeId === r.id ? "border-[#15803D] bg-emerald-50/50 shadow-md" : "border-slate-200 hover:border-emerald-300"
                  }`}
                >
                  <img src={r.image} alt={r.name} className="w-20 h-20 rounded-2xl object-cover" />
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-[#16A34A] uppercase tracking-wider">{r.prepTime} • {r.difficulty}</span>
                    <h3 className="text-sm font-bold text-slate-900">{r.name}</h3>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{r.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Recipe Details & Ingredients Builder */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-6 shadow-xs">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-slate-900">Portioned Ingredients</h3>
                  {/* Servings Switcher */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-600">Servings:</span>
                    {[2, 4, 6].map((s) => (
                      <button
                        key={s}
                        onClick={() => setServings(s)}
                        className={`w-8 h-8 rounded-xl text-xs font-bold transition ${
                          servings === s ? "bg-[#15803D] text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  {currentRecipe.ingredients.map((ing) => {
                    const isChecked = selectedIngredients.includes(ing.id);
                    const calculatedPrice = (ing.price * (servings / 2)).toFixed(2);
                    return (
                      <div
                        key={ing.id}
                        onClick={() => toggleIngredient(ing.id)}
                        className={`p-3.5 rounded-2xl border transition cursor-pointer flex justify-between items-center ${
                          isChecked ? "bg-emerald-50/60 border-emerald-300" : "bg-slate-50 border-slate-200 opacity-60"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${isChecked ? "bg-[#15803D] text-white border-[#15803D]" : "border-slate-300 bg-white"}`}>
                            {isChecked && <Check size={14} />}
                          </div>
                          <span className="text-xs font-bold text-slate-900">{ing.name}</span>
                        </div>
                        <span className="text-xs font-black text-[#15803D]">₹{calculatedPrice}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Kit Summary Card */}
              <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-5 shadow-xs">
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#16A34A] block">Meal-Kit Package</span>
                <h4 className="text-base font-bold text-slate-900">{currentRecipe.name}</h4>
                <p className="text-xs text-slate-500">{currentRecipe.description}</p>

                <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Estimated Total ({servings} Servings)</span>
                    <span className="text-2xl font-black text-slate-900">₹{mealKitTotal.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={handleAddMealKitToCart}
                    className="px-6 py-3 bg-[#15803D] hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer shadow-md"
                  >
                    Add Kit to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= PAGE 4: HARVEST FRESHNESS LAB ================= */}
        {activePage === "freshness-lab" && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 text-left">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs uppercase tracking-[0.2em] text-[#16A34A] font-bold">Direct Cold Chain</span>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900">Farm-to-Doorstep Freshness Lab</h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Traditional supermarkets store produce in regional warehouses for 5-7 days before hitting shelves. FreshMart connects local orchards directly to your door in hours.
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 space-y-6 shadow-xs">
              <h3 className="text-base font-bold text-slate-900">Supply Chain Timeline Simulator</h3>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-800">
                  <span>Farm-to-Table Transit Time: {supplyHours} Hours</span>
                  <span className="text-[#15803D]">
                    {supplyHours <= 24 ? "FreshMart Direct Fleet" : "Standard Supermarket Supply Chain"}
                  </span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="120"
                  step="6"
                  value={supplyHours}
                  onChange={(e) => setSupplyHours(Number(e.target.value))}
                  className="w-full accent-[#15803D] cursor-pointer"
                />
              </div>

              {/* Stats Output */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#16A34A] block">Active Vitamin C Retention</span>
                  <span className="text-2xl font-black text-[#15803D]">{nutrientRetention}%</span>
                  <p className="text-[10px] text-slate-500">Laboratory tested enzymatic vitality</p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#16A34A] block">Warehouse Middlemen</span>
                  <span className="text-2xl font-black text-[#15803D]">0 Distributors</span>
                  <p className="text-[10px] text-slate-500">Direct grower fair-price trade</p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#16A34A] block">Vessel Insulation</span>
                  <span className="text-2xl font-black text-[#15803D]">3°C - 5°C Constant</span>
                  <p className="text-[10px] text-slate-500">Chilled insulated delivery liners</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= PRODUCT DETAIL ================= */}
        {activePage === "product-detail" && selectedProduct && (
          <ProductDetailsPage
            product={selectedProduct}
            onBack={() => {
              setActivePage("home");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onAddToCart={handleAddToCart}
            themeColors={{
              primary: "#15803D",
              secondary: "#16A34A",
              text: "#0F172A",
              background: "#F8FAF9",
              cardBg: "#FFFFFF",
            }}
            business={business}
            relatedProducts={groceryItems}
            onSelectProduct={(p) => {
              setSelectedProduct(p);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        )}
      </main>

      {/* ================= 3. FOOTER ================= */}
      <footer className="bg-[#0F172A] text-slate-300 pt-16 pb-12 text-left text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                {brandLogo ? (
                  <img src={brandLogo} alt={brandName} className="h-8 w-auto max-w-[130px] object-contain rounded brightness-0 invert" />
                ) : (
                  <Leaf size={22} className="text-emerald-400" />
                )}
                <span className="text-base font-black tracking-tight text-white uppercase">{brandName}</span>
              </div>
              <p className="text-slate-400 leading-relaxed text-[11px] max-w-xs">
                Farm-fresh organic produce, cold-pressed juices, daily pantry staples, and artisanal bakery delivered in 30 minutes.
              </p>
            </div>

            <div className="space-y-2">
              <h5 className="font-bold text-white uppercase text-[10px] tracking-wider">Aisles</h5>
              <p onClick={() => { setSelectedCategory("Produce"); setActivePage("aisles"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="hover:text-white cursor-pointer transition text-[11px]">Fresh Produce</p>
              <p onClick={() => { setSelectedCategory("Bakery"); setActivePage("aisles"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="hover:text-white cursor-pointer transition text-[11px]">Artisanal Sourdoughs</p>
              <p onClick={() => { setSelectedCategory("Dairy"); setActivePage("aisles"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="hover:text-white cursor-pointer transition text-[11px]">Pasture Eggs & Dairy</p>
            </div>

            <div className="space-y-2">
              <h5 className="font-bold text-white uppercase text-[10px] tracking-wider">Culinary Features</h5>
              <p onClick={() => { setActivePage("meal-kits"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="hover:text-white cursor-pointer transition text-[11px]">Chef's Recipe Kits</p>
              <p onClick={() => { setActivePage("freshness-lab"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="hover:text-white cursor-pointer transition text-[11px]">Harvest Freshness Science</p>
            </div>

            <div className="space-y-2">
              <h5 className="font-bold text-white uppercase text-[10px] tracking-wider">Contact & Support</h5>
              <p className="text-white font-bold">{brandPhone}</p>
              <p className="text-emerald-400 text-[11px]">{brandEmail}</p>
              <span className="text-[10px] text-slate-500 block pt-2">Customer Care Open 6:00 AM – 11:00 PM EST Daily</span>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-500 gap-2">
            <p>© {new Date().getFullYear()} {brandName}. 100% Recycled & Compostable Packaging.</p>
            <p>Electric Vehicle Fleet • Zero Single-Use Plastics</p>
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
        themeColors={{ primary: "#15803D" }}
      />
    </div>
  );
}
