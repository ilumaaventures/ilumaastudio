import React, { useState, useEffect, useMemo } from "react";
import {
  Flower2,
  Search,
  Star,
  ShoppingBag,
  Sparkles,
  Heart,
  Calendar,
  Clock,
  Check,
  Truck,
  Droplets,
  ArrowRight,
  X,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  Scissors,
  MapPin,
  Gift,
  Sliders,
  Info,
  CheckCircle2,
  MessageSquare,
  Phone,
  Mail,
  Award,
  Eye,
  Plus,
  Minus,
  Share2,
  ExternalLink,
  Package,
  Layers,
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

export default function FlowerStoreTemplate({
  business = {},
  products = [],
  categories = [],
  offers = [],
  reviews = [],
  customization = {},
}) {
  // Navigation: "home" | "arrangements" | "builder" | "subscription" | "care-guide" | "weddings" | "product-detail"
  const [activePage, setActivePage] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);

  // Filters & Search
  const [selectedOccasion, setSelectedOccasion] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [selectedStemFilter, setSelectedStemFilter] = useState("all");

  // Delivery Zip / Pincode checker
  const [pincodeInput, setPincodeInput] = useState("");
  const [pincodeResult, setPincodeResult] = useState(null);

  // Same day order countdown timer
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 47, seconds: 35 });

  // Quick View Modal Configuration State
  const [quickSize, setQuickSize] = useState("classic"); // "classic" (1x), "deluxe" (+35%), "grand" (+70%)
  const [selectedAddons, setSelectedAddons] = useState([]);

  // Bespoke Bouquet Studio State
  const [builderStep, setBuilderStep] = useState(1);
  const [customBase, setCustomBase] = useState("garden-roses");
  const [customGreenery, setCustomGreenery] = useState("eucalyptus");
  const [customVase, setCustomVase] = useState("kraft-wrap");
  const [cardMessage, setCardMessage] = useState("Wishing you blooming days filled with joy & warmth.");
  const [cardRecipient, setCardRecipient] = useState("Beloved Friend");
  const [cardSender, setCardSender] = useState("With Love");
  const [cardStyle, setCardStyle] = useState("calligraphy"); // "calligraphy" | "modern" | "editorial"

  // Wedding & Event Calculator State
  const [weddingStyle, setWeddingStyle] = useState("garden");
  const [tablesCount, setTablesCount] = useState(8);
  const [hasBridalBouquet, setHasBridalBouquet] = useState(true);
  const [bridesmaidsCount, setBridesmaidsCount] = useState(3);
  const [hasArch, setHasArch] = useState(true);
  const [weddingFormSubmitted, setWeddingFormSubmitted] = useState(false);

  // Interactive Care Guide Water Calculator State
  const [vaseVolumeMl, setVaseVolumeMl] = useState(1000);
  const [activeCareTab, setActiveCareTab] = useState("trimming");

  // Newsletter State
  const [vipEmail, setVipEmail] = useState("");
  const [vipSubscribed, setVipSubscribed] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart?.cartItems || []);

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 2, minutes: 30, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fallback default flowers if no products provided
  const fallbackFlowers = [
    {
      _id: "fl-1",
      name: "The Provence Sunset Garden Rose Bouquet",
      occasion: "Romance",
      category: "Romance & Roses",
      price: 88.0,
      compareAtPrice: 105.0,
      stemCount: "24 Stems",
      rating: 4.9,
      reviewCount: 68,
      badge: "Bestseller",
      image: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=900&auto=format&fit=crop&q=80",
      images: [
        "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=900&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=900&auto=format&fit=crop&q=80",
      ],
      stemComposition: [
        "Coral Sunset Garden Roses (8)",
        "Peach Japanese Ranunculus (6)",
        "French Field Lavender (5)",
        "Silver Dollar Eucalyptus (5)",
      ],
      scentProfile: "Delicate honeyed damask rose with herbal lavender undertones",
      careLevel: "Easy Care • Water change every 2 days",
      description: "An evocative arrangement inspired by late afternoon light in Provence. Layered velvety garden roses paired with delicate peach ranunculus, aromatic lavender, and silver foliage.",
      inStock: true,
    },
    {
      _id: "fl-2",
      name: "White Cloud Peony & Hydrangea Centerpiece",
      occasion: "Celebration",
      category: "Luxury Centerpieces",
      price: 115.0,
      compareAtPrice: 135.0,
      stemCount: "28 Stems",
      rating: 5.0,
      reviewCount: 42,
      badge: "Florist Pick",
      image: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=900&auto=format&fit=crop&q=80",
      images: [
        "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=900&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1591886960571-74d43a9d4166?w=900&auto=format&fit=crop&q=80",
      ],
      stemComposition: [
        "Double White Snow Peonies (6)",
        "Mint Dutch Hydrangeas (4)",
        "Cream Sweet Peas (8)",
        "Trailing White Jasmine Vines (10)",
      ],
      scentProfile: "Airy jasmine blossom and fresh morning dew",
      careLevel: "Moderate • Mist blooms lightly in dry climate",
      description: "Opulent white snow peonies, pale green Dutch hydrangeas, and sweet peas hand-composed for celebratory dinner tables, anniversaries, and bridal suites.",
      inStock: true,
    },
    {
      _id: "fl-3",
      name: "Wildflower Meadow Burlap Wrap",
      occasion: "Birthday",
      category: "Wildflower Meadows",
      price: 64.0,
      compareAtPrice: 78.0,
      stemCount: "20 Stems",
      rating: 4.8,
      reviewCount: 95,
      badge: "Eco-Harvest",
      image: "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=900&auto=format&fit=crop&q=80",
      images: [
        "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=900&auto=format&fit=crop&q=80",
      ],
      stemComposition: [
        "Golden Autumn Sunflowers (3)",
        "Chamomile Daisies (7)",
        "Blue Pacific Delphinium (4)",
        "Feather Grasses & Mint (6)",
      ],
      scentProfile: "Bright crisp meadow chamomile and fresh mint",
      careLevel: "Very Easy • Extremely resilient 8-10 day lifespan",
      description: "A carefree gathering of sunshine: golden sunflowers, blue delphinium, and chamomile hand-tied in biodegradable burlap wrap with a botanical care ampoule.",
      inStock: true,
    },
    {
      _id: "fl-4",
      name: "Burgundy Velvet Dahlia & Ranunculus",
      occasion: "Anniversary",
      category: "Romance & Roses",
      price: 98.0,
      compareAtPrice: 120.0,
      stemCount: "22 Stems",
      rating: 4.9,
      reviewCount: 37,
      badge: "Limited Seasonal",
      image: "https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=900&auto=format&fit=crop&q=80",
      images: [
        "https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=900&auto=format&fit=crop&q=80",
      ],
      stemComposition: [
        "Café au Lait Burgundy Dahlias (5)",
        "Deep Plum Cloony Ranunculus (7)",
        "Black Baccara Hybrid Roses (4)",
        "Blackberry Foliage (6)",
      ],
      scentProfile: "Deep velvety floral with blackberry notes",
      careLevel: "Moderate • Keep away from direct heat",
      description: "Dramatic nocturnal hues designed for intimate evenings, milestone anniversaries, and moody editorial aesthetics.",
      inStock: true,
    },
    {
      _id: "fl-5",
      name: "Kyoto Minimalist Anthurium & Ikebana Branch",
      occasion: "Sympathy",
      category: "Architectural & Orchids",
      price: 110.0,
      compareAtPrice: 130.0,
      stemCount: "12 Stems",
      rating: 5.0,
      reviewCount: 29,
      badge: "Modern Sculptural",
      image: "https://images.unsplash.com/photo-1567696911980-2eed69a46042?w=900&auto=format&fit=crop&q=80",
      stemComposition: [
        "Glossy Terracotta Anthuriums (3)",
        "Sculptural Quince Branches (2)",
        "White Phalaenopsis Orchid (2)",
        "Variegated Monstera Leaves (5)",
      ],
      scentProfile: "Subtle clean green rainforest aroma",
      careLevel: "Effortless • Thrives up to 14 days",
      description: "An architectural homage to Japanese Ikebana aesthetics. Clean silhouettes, sculptural anthuriums, and cascading orchid sprays.",
      inStock: true,
    },
    {
      _id: "fl-6",
      name: "Everlasting Tuscan Ochre & Pampas Spray",
      occasion: "Celebration",
      category: "Dried & Everlasting",
      price: 74.0,
      compareAtPrice: 89.0,
      stemCount: "18 Stems",
      rating: 4.8,
      reviewCount: 54,
      badge: "Lasts 1+ Year",
      image: "https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=900&auto=format&fit=crop&q=80",
      stemComposition: [
        "Preserved Baby Pampas (4)",
        "Sun-Dried Terracotta Helichrysum (6)",
        "Bleached Bunny Tails (4)",
        "Preserved Eucalyptus (4)",
      ],
      scentProfile: "Warm sun-baked clay and cedar eucalyptus",
      careLevel: "Zero Maintenance • No water required",
      description: "Naturally dried and ethically preserved florals that retain their sculptural warmth for over 12 months without needing a drop of water.",
      inStock: true,
    },
    {
      _id: "fl-7",
      name: "Blushing Parisian Ranunculus Posy",
      occasion: "Romance",
      category: "Romance & Roses",
      price: 82.0,
      compareAtPrice: 96.0,
      stemCount: "20 Stems",
      rating: 4.9,
      reviewCount: 71,
      badge: "Romantic Favorite",
      image: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=900&auto=format&fit=crop&q=80",
      stemComposition: [
        "Pastel Pink Ranunculus (8)",
        "Garden Spray Roses (6)",
        "Astrantia Star Blooms (3)",
        "Silver Willow Stems (3)",
      ],
      scentProfile: "Sweet powdery spring rose",
      careLevel: "Easy • Trim stems every 48 hours",
      description: "Layer upon layer of paper-thin blushing ranunculus petals harmonized with fragrant spray roses and silvery willow greenery.",
      inStock: true,
    },
    {
      _id: "fl-8",
      name: "Cotswolds English Lavender & Blue Salvia",
      occasion: "Birthday",
      category: "Wildflower Meadows",
      price: 68.0,
      compareAtPrice: 82.0,
      stemCount: "26 Stems",
      rating: 4.9,
      reviewCount: 48,
      badge: "Aromatherapy",
      image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=900&auto=format&fit=crop&q=80",
      stemComposition: [
        "Organic English Lavender (12)",
        "Indigo Salvia (6)",
        "White Veronica Spikes (4)",
        "Aromatic Lemon Thyme (4)",
      ],
      scentProfile: "Relaxing natural lavender with calming herbal notes",
      careLevel: "Easy • Can be air-dried after 7 days",
      description: "Harvested from heritage English lavender beds, this fragrant bunch fills your space with soothing aromatherapy and timeless countryside charm.",
      inStock: true,
    },
  ];

  const blooms = products.length > 0 ? products : fallbackFlowers;

  // Brand Info Resolution
  const brandName =
    business?.businessName ||
    business?.name ||
    customization?.heroHeadline ||
    "BLOOM BOTANICA";

  const brandLogo = customization?.logo || business?.logo || null;
  const brandPhone =
    business?.phone ||
    business?.businessPhone ||
    business?.contactPhone ||
    "+1 (800) 256-6678";
  const brandEmail =
    business?.email ||
    business?.businessEmail ||
    business?.contactEmail ||
    "concierge@bloombotanica.com";

  const rawAddr = business?.address || business?.registered_business_address;
  const brandAddress =
    typeof rawAddr === "string"
      ? rawAddr
      : rawAddr && typeof rawAddr === "object"
      ? [rawAddr.street, rawAddr.addressLine2, rawAddr.city, rawAddr.state, rawAddr.postalCode, rawAddr.country]
          .filter(Boolean)
          .join(", ")
      : "240 Bedford Avenue, Brooklyn, NY 11211";

  const brandDescription =
    business?.description ||
    "Artisan botanical floral studio crafting poetic wild arrangements, bespoke celebration stems, and weekly garden club deliveries in sustainable hydration wraps.";

  // Filtered & Sorted Blooms
  const filteredBlooms = useMemo(() => {
    return blooms
      .filter((bloom) => {
        // Occasion match
        if (selectedOccasion !== "all") {
          const occ = (bloom.occasion || "").toLowerCase();
          const cat = (bloom.category || "").toLowerCase();
          const filter = selectedOccasion.toLowerCase();
          if (!occ.includes(filter) && !cat.includes(filter)) return false;
        }

        // Stem count filter
        if (selectedStemFilter === "under20") {
          const stems = parseInt(bloom.stemCount || "20", 10);
          if (stems >= 20) return false;
        } else if (selectedStemFilter === "20plus") {
          const stems = parseInt(bloom.stemCount || "20", 10);
          if (stems < 20) return false;
        }

        // Search Query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = (bloom.name || "").toLowerCase().includes(q);
          const matchDesc = (bloom.description || "").toLowerCase().includes(q);
          const matchOcc = (bloom.occasion || "").toLowerCase().includes(q);
          const matchComp = (bloom.stemComposition || []).some((s) => s.toLowerCase().includes(q));
          if (!matchName && !matchDesc && !matchOcc && !matchComp) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return Number(a.price) - Number(b.price);
        if (sortBy === "price-desc") return Number(b.price) - Number(a.price);
        if (sortBy === "rating") return (b.rating || 5) - (a.rating || 5);
        return 0; // featured default
      });
  }, [blooms, selectedOccasion, selectedStemFilter, searchQuery, sortBy]);

  // Cart operations
  const handleAddToCart = (bloom, qty = 1, customDetails = null) => {
    if (isOutOfStock(bloom)) {
      toast.error(`Sorry, ${bloom.name || "flower"} is out of stock!`);
      return;
    }

    const itemToAdd = {
      ...bloom,
      price: customDetails?.totalPrice || bloom.price,
      name: customDetails ? `${bloom.name} (${customDetails.sizeTitle})` : bloom.name,
      customOptions: customDetails,
    };

    dispatch(addToCart({ product: itemToAdd, quantity: qty }));
    toast.success(`${itemToAdd.name} added to your Vase Bag! 🌸`);
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

  // Delivery check handler
  const handleCheckPincode = (e) => {
    e.preventDefault();
    if (!pincodeInput.trim()) return;
    const clean = pincodeInput.trim();
    if (clean.length >= 3) {
      setPincodeResult({
        available: true,
        deliverySlot: "Today by 6:00 PM - 8:30 PM",
        carrier: "Eco-Courier Climate Hand-Delivery",
      });
      toast.success(`Zipcode ${clean} eligible for Same-Day Hand-Delivery!`);
    } else {
      setPincodeResult({ available: false });
    }
  };

  // Bespoke Bouquet catalog options
  const baseBloomOptions = [
    {
      id: "garden-roses",
      name: "Coral Sunset Garden Roses",
      stems: "10 Luxury Stems",
      price: 52.0,
      image: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=500&auto=format&fit=crop&q=80",
      description: "Heirloom fragrant roses with high petal count.",
    },
    {
      id: "peonies",
      name: "Imperial White & Blush Peonies",
      stems: "8 Opulent Stems",
      price: 68.0,
      image: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=500&auto=format&fit=crop&q=80",
      description: "Silky soft pillowy petals, seasonal Dutch harvest.",
    },
    {
      id: "ranunculus",
      name: "Pastel Cloony Ranunculus",
      stems: "12 Delicate Stems",
      price: 48.0,
      image: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=500&auto=format&fit=crop&q=80",
      description: "Layered Japanese ranunculus in warm peach & cream.",
    },
    {
      id: "sunflowers",
      name: "Golden Tuscan Sunflowers & Chamomile",
      stems: "12 Wild Stems",
      price: 42.0,
      image: "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=500&auto=format&fit=crop&q=80",
      description: "Rustic sunny cheer with meadow grasses.",
    },
  ];

  const greeneryOptions = [
    {
      id: "eucalyptus",
      name: "Silver Dollar & Baby Blue Eucalyptus",
      price: 14.0,
      desc: "Fragrant calming herbal aroma and soft sage green tone.",
    },
    {
      id: "olive-branch",
      name: "Tuscan Olive Branch & Trailing Jasmine",
      price: 18.0,
      desc: "Mediterranean grace and star-shaped delicate vines.",
    },
    {
      id: "ruscus",
      name: "Italian Ruscus & Frosted Fern",
      price: 12.0,
      desc: "Architectural deep glossy leaves for maximum longevity.",
    },
  ];

  const vaseOptions = [
    {
      id: "kraft-wrap",
      name: "Artisan Biodegradable Kraft Wrap & Satin Ribbon",
      price: 0.0,
      desc: "Delivered in sealed hydration gel pouch (Requires recipient's vase).",
    },
    {
      id: "ceramic-fluted",
      name: "Hand-Thrown Fluted Ceramic Vase (Matte Almond)",
      price: 28.0,
      desc: "Reusable architectural studio vessel ready to display on arrival.",
    },
    {
      id: "ribbed-glass",
      name: "Ribbed Parisian Clear Glass Footed Urn",
      price: 22.0,
      desc: "Crystal clarity showing fresh green stems in pristine water.",
    },
  ];

  // Calculated builder total
  const builderTotal = useMemo(() => {
    const base = baseBloomOptions.find((b) => b.id === customBase)?.price || 50;
    const green = greeneryOptions.find((g) => g.id === customGreenery)?.price || 14;
    const vase = vaseOptions.find((v) => v.id === customVase)?.price || 0;
    return base + green + vase;
  }, [customBase, customGreenery, customVase]);

  // Handle adding custom bouquet to cart
  const handleAddBespokeBouquet = () => {
    const baseObj = baseBloomOptions.find((b) => b.id === customBase);
    const greenObj = greeneryOptions.find((g) => g.id === customGreenery);
    const vaseObj = vaseOptions.find((v) => v.id === customVase);

    const bespokeItem = {
      _id: `bespoke-${Date.now()}`,
      name: `Bespoke Creation: ${baseObj?.name || "Custom Bouquet"}`,
      price: builderTotal,
      image: baseObj?.image || "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=600",
      occasion: "Custom Studio",
      stemCount: "22-26 Stems",
      description: `Composed of ${baseObj?.name}, accented with ${greenObj?.name}, styled in ${vaseObj?.name}. Calligraphy card for: ${cardRecipient}`,
      cardDetails: {
        to: cardRecipient,
        message: cardMessage,
        from: cardSender,
      },
    };

    dispatch(addToCart({ product: bespokeItem, quantity: 1 }));
    toast.success("Your Bespoke Bouquet has been crafted & added to Vase Bag! 💐");
    setCartOpen(true);
  };

  // Quick View Calculations
  const quickViewPrice = useMemo(() => {
    if (!quickViewProduct) return 0;
    let base = Number(quickViewProduct.price);
    if (quickSize === "deluxe") base = base * 1.35;
    if (quickSize === "grand") base = base * 1.7;

    const addonsCost = selectedAddons.reduce((sum, item) => sum + item.price, 0);
    return base + addonsCost;
  }, [quickViewProduct, quickSize, selectedAddons]);

  // Available add-ons
  const availableAddons = [
    { id: "candle", name: "Provence Lavender Botanical Candle (8 oz)", price: 16.0 },
    { id: "truffles", name: "Belgian Champagne Floral Truffles (6 pc)", price: 14.0 },
    { id: "vase", name: "Matte Ceramic Fluted Centerpiece Vase", price: 28.0 },
    { id: "shears", name: "Brass Master Florist Pruning Shears", price: 22.0 },
  ];

  const toggleAddon = (addon) => {
    if (selectedAddons.some((a) => a.id === addon.id)) {
      setSelectedAddons(selectedAddons.filter((a) => a.id !== addon.id));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  // Wedding estimate calculation
  const weddingEstimate = useMemo(() => {
    let base = 0;
    if (hasBridalBouquet) base += 220;
    base += bridesmaidsCount * 95;
    base += tablesCount * (weddingStyle === "garden" ? 85 : weddingStyle === "modern" ? 110 : 140);
    if (hasArch) base += weddingStyle === "opulent" ? 950 : 650;
    return base;
  }, [weddingStyle, tablesCount, hasBridalBouquet, bridesmaidsCount, hasArch]);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#FCFBF9] text-[#1E2E23] antialiased selection:bg-emerald-100 selection:text-emerald-900">
      {/* ================= 1. BESPOKE FLORAL TOP BAR WITH LIVE CUTOFF TIMER ================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-950/10 shadow-xs">
        <div className="bg-[#064E3B] text-white text-[11px] py-2 px-4">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-medium tracking-wide">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>
                Same-Day Hand Delivery Cutoff in{" "}
                <strong className="font-mono bg-[#047857] px-1.5 py-0.5 rounded text-white tracking-widest">
                  {String(timeLeft.hours).padStart(2, "0")}:{String(timeLeft.minutes).padStart(2, "0")}:{String(timeLeft.seconds).padStart(2, "0")}
                </strong>
                {" "}• Hydration packs & calligraphy note included
              </span>
            </div>

            <div className="hidden md:flex items-center gap-6 text-[11px] font-medium text-emerald-100">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-300" /> 7-Day Bloom Guarantee
              </span>
              <span className="flex items-center gap-1.5">
                <Truck size={14} className="text-emerald-300" /> Climate-Controlled Vans
              </span>
              <a href={`tel:${brandPhone}`} className="hover:text-white transition flex items-center gap-1">
                <Phone size={13} /> {brandPhone}
              </a>
            </div>
          </div>
        </div>

        {/* ================= MAIN NAVBAR ================= */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-22 flex items-center justify-between gap-4">
          {/* Brand Logo & Name */}
          <div
            onClick={() => {
              setActivePage("home");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            {brandLogo ? (
              <img
                src={brandLogo}
                alt={brandName}
                className="h-11 sm:h-12 w-auto max-w-[150px] object-contain rounded-lg"
              />
            ) : (
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-800 to-emerald-950 text-white flex items-center justify-center shadow-md shadow-emerald-900/10 group-hover:scale-105 transition duration-300">
                <Flower2 size={24} className="text-emerald-300" />
              </div>
            )}
            <div className="space-y-0.5">
              <span className="text-xl sm:text-2xl font-serif font-black tracking-tight text-[#064E3B] block leading-none">
                {brandName}
              </span>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#059669] font-bold block">
                {business?.tagline || "Botanical Atelier & Wild Florist"}
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-[12px] font-bold uppercase tracking-wider text-[#3B5A45]">
            {[
              { id: "home", label: "Studio" },
              { id: "arrangements", label: "Bouquets & Stems" },
              { id: "builder", label: "Custom Studio 🌸" },
              { id: "subscription", label: "Flower Club" },
              { id: "weddings", label: "Weddings & Events" },
              { id: "care-guide", label: "7-Day Care Lab" },
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
                    isActive
                      ? "text-[#064E3B] font-black"
                      : "hover:text-[#047857] text-[#4A6451]"
                  }`}
                >
                  <span>{tab.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#059669] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Actions: Search Trigger, Build CTA, Cart Drawer */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setActivePage("arrangements");
                window.scrollTo({ top: 400, behavior: "smooth" });
              }}
              className="p-2.5 rounded-2xl text-[#064E3B] hover:bg-emerald-50 transition cursor-pointer"
              title="Search Stems"
            >
              <Search size={19} />
            </button>

            <button
              onClick={() => {
                setActivePage("builder");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-emerald-50 text-[#064E3B] hover:bg-emerald-100/80 font-bold text-xs border border-emerald-200/60 transition cursor-pointer"
            >
              <Sparkles size={14} className="text-[#059669]" />
              <span>Bespoke Bouquet</span>
            </button>

            {/* Cart Drawer Trigger */}
            <button
              onClick={() => setCartOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-[#064E3B] text-white hover:bg-[#047857] transition cursor-pointer flex items-center gap-2 font-bold text-xs shadow-md shadow-emerald-900/10"
            >
              <ShoppingBag size={17} className="text-emerald-300" />
              <span className="hidden sm:inline">Vase Bag</span>
              <span className="bg-emerald-500 text-white text-[11px] font-black min-w-[20px] h-5 px-1 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Strip */}
        <div className="lg:hidden flex items-center justify-around border-t border-emerald-100/60 bg-[#FAF9F5] px-2 py-2 text-[10px] font-bold uppercase tracking-wider text-[#3B5A45] overflow-x-auto">
          {[
            { id: "home", label: "Studio" },
            { id: "arrangements", label: "Bouquets" },
            { id: "builder", label: "Custom" },
            { id: "subscription", label: "Club" },
            { id: "weddings", label: "Weddings" },
            { id: "care-guide", label: "Care" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActivePage(tab.id);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`px-2.5 py-1 rounded-lg shrink-0 ${
                activePage === tab.id ? "bg-[#064E3B] text-white" : "text-[#4A6451]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* ================= 2. MAIN CONTENT ================= */}
      <main className="flex-1">
        {/* ==================================================== */}
        {/* ================= PAGE 1: HOME ==================== */}
        {/* ==================================================== */}
        {activePage === "home" && (
          <>
            {/* HERO SECTION */}
            <section className="relative overflow-hidden bg-gradient-to-b from-[#F2F7F4] via-[#FAF9F6] to-[#FCFBF9] pt-12 pb-20 md:pt-20 md:pb-28 border-b border-emerald-950/5">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                  {/* Left Column: Editorial Headline & Actions */}
                  <div className="lg:col-span-7 space-y-7 text-left">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-emerald-200/80 text-[#064E3B] text-xs font-semibold shadow-xs">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      <span>Cut Fresh This Morning from Local Botanical Growers</span>
                    </div>

                    <h1 className="text-4xl sm:text-6xl lg:text-[68px] font-serif font-black tracking-tight text-[#064E3B] leading-[1.08]">
                      Poetic Bouquets Arranged with Wild Stems.
                    </h1>

                    <p className="text-sm sm:text-base text-[#3E5C47] leading-relaxed max-w-xl font-normal">
                      Every stem is hand-tied by master floral designers in hydration pouches with flower food packets and wax-sealed calligraphy gift cards. Guaranteed 7 days of fresh vibrancy.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-wrap gap-4 pt-2">
                      <button
                        onClick={() => {
                          setActivePage("arrangements");
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="px-8 py-4 bg-[#064E3B] hover:bg-[#047857] text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition shadow-lg shadow-emerald-950/20 flex items-center gap-2.5 cursor-pointer transform hover:-translate-y-0.5"
                      >
                        <Flower2 size={18} className="text-emerald-300" />
                        <span>Order Fresh Bouquets</span>
                      </button>

                      <button
                        onClick={() => {
                          setActivePage("builder");
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="px-7 py-4 bg-white border border-emerald-300/80 hover:border-emerald-500 text-[#064E3B] rounded-2xl text-xs font-bold uppercase tracking-wider transition hover:bg-emerald-50/50 flex items-center gap-2 shadow-xs cursor-pointer"
                      >
                        <Sparkles size={16} className="text-[#059669]" />
                        <span>Build Custom Bouquet</span>
                      </button>
                    </div>

                    {/* Same-Day Postal Code Checker Mini Bar */}
                    <div className="pt-3 max-w-md">
                      <form
                        onSubmit={handleCheckPincode}
                        className="p-1.5 bg-white rounded-2xl border border-emerald-200 shadow-xs flex items-center gap-2"
                      >
                        <MapPin size={16} className="text-emerald-700 ml-2.5 shrink-0" />
                        <input
                          type="text"
                          value={pincodeInput}
                          onChange={(e) => setPincodeInput(e.target.value)}
                          placeholder="Enter delivery ZIP / Postal code..."
                          className="w-full text-xs font-medium text-[#064E3B] focus:outline-none placeholder:text-gray-400"
                        />
                        <button
                          type="submit"
                          className="px-4 py-2 bg-emerald-100/80 hover:bg-emerald-200 text-[#064E3B] text-[11px] font-bold rounded-xl shrink-0 transition"
                        >
                          Check Delivery
                        </button>
                      </form>

                      {pincodeResult && pincodeResult.available && (
                        <p className="text-[11px] font-semibold text-emerald-800 flex items-center gap-1.5 mt-2 ml-1">
                          <CheckCircle2 size={14} className="text-emerald-600" />
                          <span>Same-day hand-delivery available ({pincodeResult.deliverySlot})</span>
                        </p>
                      )}
                    </div>

                    {/* Trust Indicators */}
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-emerald-950/10 text-left">
                      <div>
                        <span className="text-lg font-serif font-black text-[#064E3B]">7 Days</span>
                        <p className="text-[11px] text-[#4A6451] font-medium">Freshness Guaranteed</p>
                      </div>
                      <div>
                        <span className="text-lg font-serif font-black text-[#064E3B]">100%</span>
                        <p className="text-[11px] text-[#4A6451] font-medium">Sustainable Wraps</p>
                      </div>
                      <div>
                        <span className="text-lg font-serif font-black text-[#064E3B]">4.9 / 5★</span>
                        <p className="text-[11px] text-[#4A6451] font-medium">3,200+ Reviews</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Hero Visual Showcase */}
                  <div className="lg:col-span-5 relative">
                    <div className="relative mx-auto max-w-md lg:max-w-none">
                      <div className="aspect-[4/5] rounded-[36px] overflow-hidden shadow-2xl border-8 border-white bg-emerald-100">
                        <img
                          src="https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=1000&auto=format&fit=crop&q=80"
                          alt="Signature Bloom Arrangement"
                          className="w-full h-full object-cover transform hover:scale-105 transition duration-700"
                        />
                      </div>

                      {/* Floating Glassmorphic Badge 1 */}
                      <div className="absolute -bottom-6 -left-4 sm:-left-8 bg-white/95 backdrop-blur-md p-4 rounded-3xl border border-emerald-100 shadow-xl max-w-[240px] text-left space-y-1">
                        <div className="flex items-center gap-1.5 text-amber-500">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={13} fill="currentColor" />
                          ))}
                        </div>
                        <p className="text-[11px] font-bold text-[#064E3B]">"Stayed fresh on our dining table for 11 days straight."</p>
                        <span className="text-[10px] font-medium text-[#4A6451] block">— Lady Camilla, NYC</span>
                      </div>

                      {/* Floating Glassmorphic Badge 2 */}
                      <div className="absolute -top-4 -right-3 sm:-right-6 bg-[#064E3B] text-white p-3.5 rounded-2xl shadow-xl flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-500/30 flex items-center justify-center text-emerald-300 font-black text-xs">
                          🌸
                        </div>
                        <div className="text-left">
                          <span className="text-[10px] uppercase font-bold text-emerald-300 block tracking-wider">Florist Pick</span>
                          <span className="text-xs font-serif font-black block">Provence Sunset Roses</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* OCCASION QUICK-SELECT STRIP */}
            <section className="py-10 bg-white border-b border-emerald-950/5">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center space-y-1.5 mb-6">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#059669]">Hand-Tied for Every Sentiment</span>
                  <h3 className="text-xl sm:text-2xl font-serif font-black text-[#064E3B]">Curated by Floral Occasion</h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  {[
                    { key: "romance", name: "Romance & Roses", emoji: "🌹", desc: "Velvet garden roses" },
                    { key: "celebration", name: "Celebrations", emoji: "🥂", desc: "Peonies & hydrangeas" },
                    { key: "birthday", name: "Birthdays", emoji: "🎂", desc: "Cheerful wildflowers" },
                    { key: "anniversary", name: "Anniversaries", emoji: "💍", desc: "Moody dahlias & berries" },
                    { key: "sympathy", name: "Sympathy & Grace", emoji: "🕊️", desc: "Serene orchids & branches" },
                    { key: "dried", name: "Everlasting Dried", emoji: "🌾", desc: "Pampas & bunny tails" },
                  ].map((occ) => (
                    <button
                      key={occ.key}
                      onClick={() => {
                        setSelectedOccasion(occ.key);
                        setActivePage("arrangements");
                        window.scrollTo({ top: 300, behavior: "smooth" });
                      }}
                      className="p-4 rounded-2xl bg-[#FAF9F6] border border-emerald-100/80 hover:border-emerald-500 hover:bg-emerald-50/60 transition group text-center space-y-1.5 cursor-pointer shadow-2xs hover:shadow-sm"
                    >
                      <span className="text-2xl block group-hover:scale-110 transition duration-200">{occ.emoji}</span>
                      <h4 className="text-xs font-bold text-[#064E3B] group-hover:text-emerald-800">{occ.name}</h4>
                      <p className="text-[10px] text-[#4A6451] line-clamp-1">{occ.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* BESTSELLER ARRANGEMENTS GRID */}
            <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-emerald-950/10 pb-6">
                <div>
                  <span className="text-xs uppercase tracking-wider text-[#059669] font-bold">In Bloom This Week</span>
                  <h2 className="text-3xl sm:text-4xl font-serif font-black text-[#064E3B]">Signature Arrangements</h2>
                  <p className="text-xs sm:text-sm text-[#4A6451] mt-1">Directly sourced from organic growers and conditioned for maximum longevity.</p>
                </div>

                <button
                  onClick={() => {
                    setActivePage("arrangements");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#064E3B] hover:text-[#047857] hover:underline cursor-pointer"
                >
                  <span>Explore Full Catalog ({blooms.length} Bouquets)</span>
                  <ArrowRight size={14} />
                </button>
              </div>

              {/* Product Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {blooms.slice(0, 4).map((bloom) => {
                  const outOfStock = isOutOfStock(bloom);
                  return (
                    <div
                      key={bloom._id}
                      onClick={() => {
                        setSelectedProduct(bloom);
                        setActivePage("product-detail");
                      }}
                      className="bg-white rounded-3xl border border-emerald-950/10 p-4 space-y-3 flex flex-col justify-between shadow-xs hover:shadow-xl transition duration-300 cursor-pointer group relative"
                    >
                      <div className="space-y-3">
                        {/* Image Container with Badge */}
                        <div className="aspect-square rounded-2xl overflow-hidden bg-emerald-50 relative">
                          <img
                            src={getProductImage(bloom, bloom.image)}
                            alt={bloom.name}
                            className="w-full h-full object-cover group-hover:scale-108 transition duration-500"
                          />
                          {bloom.badge && (
                            <span className="absolute top-3 left-3 bg-[#064E3B]/90 backdrop-blur-xs text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full">
                              {bloom.badge}
                            </span>
                          )}

                          {/* Quick Inspect Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setQuickViewProduct(bloom);
                              setSelectedAddons([]);
                              setQuickSize("classic");
                            }}
                            className="absolute bottom-3 right-3 w-9 h-9 rounded-xl bg-white/90 backdrop-blur-xs text-[#064E3B] flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-md hover:bg-white cursor-pointer"
                            title="Quick Inspect Stems"
                          >
                            <Eye size={16} />
                          </button>
                        </div>

                        {/* Metadata */}
                        <div className="flex items-center justify-between text-[11px] font-bold">
                          <span className="text-[#059669] uppercase tracking-wider">{bloom.occasion || "Signature"}</span>
                          <span className="text-[#4A6451] flex items-center gap-1">
                            <Star size={12} className="text-amber-500 fill-amber-500" />
                            {bloom.rating || 5.0} ({bloom.reviewCount || 24})
                          </span>
                        </div>

                        <h4 className="text-base font-serif font-bold text-[#064E3B] line-clamp-1 group-hover:text-[#059669] transition">
                          {bloom.name}
                        </h4>

                        <p className="text-xs text-[#4A6451] line-clamp-2 leading-relaxed">
                          {bloom.description}
                        </p>

                        {bloom.stemCount && (
                          <span className="inline-block text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                            🌿 {bloom.stemCount}
                          </span>
                        )}
                      </div>

                      {/* Pricing & Add to Cart */}
                      <div className="pt-3 flex justify-between items-center border-t border-emerald-100/60">
                        <div>
                          <span className="text-lg font-serif font-black text-[#064E3B]">
                            ₹{Number(bloom.price).toFixed(2)}
                          </span>
                          {bloom.compareAtPrice && (
                            <span className="text-xs text-gray-400 line-through ml-1.5">
                              ₹{Number(bloom.compareAtPrice).toFixed(2)}
                            </span>
                          )}
                        </div>

                        {outOfStock ? (
                          <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-xl border border-rose-200">
                            Sold Out
                          </span>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(bloom);
                            }}
                            className="px-4 py-2 bg-[#064E3B] hover:bg-[#047857] text-white rounded-xl text-xs font-bold cursor-pointer transition shadow-xs flex items-center gap-1.5"
                          >
                            <Plus size={14} />
                            <span>Add</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* INTERACTIVE BESPOKE STUDIO TEASER BANNER */}
            <section className="py-16 bg-[#064E3B] text-white relative overflow-hidden">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-8 space-y-4 text-left">
                    <span className="text-xs uppercase font-bold tracking-[0.2em] text-emerald-300">
                      The Custom Botanical Experience
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-serif font-black leading-tight">
                      Build Your Own Custom Bouquet in 4 Steps.
                    </h2>
                    <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed max-w-2xl font-light">
                      Choose your focal stems, complementary foliage, presentation wrapping or fluted ceramic vase, and pen a handwritten wax-sealed calligraphy card with live visual preview.
                    </p>
                  </div>
                  <div className="lg:col-span-4 flex justify-start lg:justify-end">
                    <button
                      onClick={() => {
                        setActivePage("builder");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="px-8 py-4 bg-white hover:bg-emerald-50 text-[#064E3B] rounded-2xl text-xs font-bold uppercase tracking-wider transition shadow-xl flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
                    >
                      <Sparkles size={16} className="text-[#059669]" />
                      <span>Launch Studio Builder</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* FLORAL REVIEWS & VERIFIED CUSTOMER LOVE */}
            <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
              <div className="text-center space-y-2">
                <span className="text-xs uppercase tracking-wider text-[#059669] font-bold">Botanical Testimonials</span>
                <h2 className="text-3xl font-serif font-black text-[#064E3B]">Cherished by 3,200+ Homes</h2>
                <p className="text-xs text-[#4A6451]">Read unedited experiences from customers who ordered for anniversaries, dinner parties, and self-care.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    name: "Camilla Rothschild",
                    location: "Manhattan, NY",
                    comment: "The Provence Sunset Garden Bouquet arrived in a chilled hydration gel pouch with every bloom perfectly nestled. My dinner guests couldn't stop taking photos.",
                    bouquet: "The Provence Sunset Garden Rose",
                    rating: 5,
                    date: "3 days ago",
                  },
                  {
                    name: "Julian Montgomery",
                    location: "Brooklyn Heights, NY",
                    comment: "I used the bespoke bouquet studio to pick peonies and eucalyptus with a calligraphy note. My fiancée called it the most exquisite gift she had ever received.",
                    bouquet: "Bespoke Custom Studio Bouquet",
                    rating: 5,
                    date: "1 week ago",
                  },
                  {
                    name: "Dr. Evelyn Zhang",
                    location: "DUMBO, NY",
                    comment: "The Flower Club is the highlight of my alternate Fridays. The stems are cut that morning and the varieties change every time. Truly master florist craft.",
                    bouquet: "Bi-Weekly Botanical Club",
                    rating: 5,
                    date: "2 weeks ago",
                  },
                ].map((rev, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-3xl bg-white border border-emerald-950/10 space-y-4 shadow-xs flex flex-col justify-between text-left"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex text-amber-500">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} size={14} fill="currentColor" />
                          ))}
                        </div>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Check size={12} /> Verified Buyer
                        </span>
                      </div>
                      <p className="text-xs text-[#2A3E31] leading-relaxed italic">"{rev.comment}"</p>
                    </div>

                    <div className="pt-3 border-t border-emerald-100/60 flex items-center justify-between">
                      <div>
                        <h5 className="text-xs font-bold text-[#064E3B]">{rev.name}</h5>
                        <p className="text-[10px] text-[#4A6451]">{rev.location}</p>
                      </div>
                      <span className="text-[10px] text-[#059669] font-medium">{rev.bouquet}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {/* ==================================================== */}
        {/* ================= PAGE 2: ARRANGEMENTS ============ */}
        {/* ==================================================== */}
        {activePage === "arrangements" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10">
            {/* Header & Controls */}
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-baseline gap-4 border-b border-emerald-950/10 pb-6">
                <div>
                  <span className="text-xs uppercase tracking-wider text-[#059669] font-bold">Studio Stems</span>
                  <h1 className="text-3xl sm:text-4xl font-serif font-black text-[#064E3B]">Artisan Bouquets & Fresh Cuts</h1>
                  <p className="text-xs text-[#4A6451] mt-1">Filter by occasion, search by flower species, or sort by pricing.</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-[#4A6451]">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-white border border-emerald-200 text-xs font-bold text-[#064E3B] cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  >
                    <option value="featured">Featured Florist Picks</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Top Customer Rated</option>
                  </select>
                </div>
              </div>

              {/* Search Bar & Multi-filter Chips */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                {/* Search Input */}
                <div className="md:col-span-5 relative">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by flower name (e.g. Roses, Peonies, Eucalyptus)..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-emerald-200 text-xs text-[#064E3B] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-2xs"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Occasion Filter Chips */}
                <div className="md:col-span-7 flex flex-wrap gap-2 items-center">
                  {[
                    { id: "all", label: "All Bouquets" },
                    { id: "romance", label: "Romance" },
                    { id: "celebration", label: "Celebration" },
                    { id: "birthday", label: "Birthday" },
                    { id: "anniversary", label: "Anniversary" },
                    { id: "sympathy", label: "Sympathy" },
                  ].map((occ) => (
                    <button
                      key={occ.id}
                      onClick={() => setSelectedOccasion(occ.id)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
                        selectedOccasion.toLowerCase() === occ.id.toLowerCase()
                          ? "bg-[#064E3B] text-white border-[#064E3B] shadow-xs"
                          : "bg-white text-[#064E3B] border-emerald-200 hover:bg-emerald-50/70"
                      }`}
                    >
                      {occ.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results Count & Empty State */}
            {filteredBlooms.length === 0 ? (
              <div className="py-20 text-center space-y-4 bg-white rounded-3xl border border-emerald-100 p-8">
                <Flower2 size={40} className="text-emerald-300 mx-auto" />
                <h3 className="text-lg font-serif font-bold text-[#064E3B]">No arrangements matched your filter</h3>
                <p className="text-xs text-[#4A6451] max-w-sm mx-auto">
                  Try clearing your search query or selecting "All Bouquets" to browse our complete botanical catalog.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedOccasion("all");
                  }}
                  className="px-5 py-2.5 bg-[#064E3B] text-white rounded-xl text-xs font-bold"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredBlooms.map((bloom) => {
                  const outOfStock = isOutOfStock(bloom);
                  return (
                    <div
                      key={bloom._id}
                      onClick={() => {
                        setSelectedProduct(bloom);
                        setActivePage("product-detail");
                      }}
                      className="bg-white rounded-3xl border border-emerald-950/10 p-4 space-y-3 flex flex-col justify-between shadow-xs hover:shadow-xl transition duration-300 cursor-pointer group"
                    >
                      <div className="space-y-3">
                        <div className="aspect-square rounded-2xl overflow-hidden bg-emerald-50 relative">
                          <img
                            src={getProductImage(bloom, bloom.image)}
                            alt={bloom.name}
                            className="w-full h-full object-cover group-hover:scale-108 transition duration-500"
                          />
                          {bloom.badge && (
                            <span className="absolute top-3 left-3 bg-[#064E3B]/90 backdrop-blur-xs text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full">
                              {bloom.badge}
                            </span>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setQuickViewProduct(bloom);
                              setSelectedAddons([]);
                              setQuickSize("classic");
                            }}
                            className="absolute bottom-3 right-3 w-9 h-9 rounded-xl bg-white/90 backdrop-blur-xs text-[#064E3B] flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-md hover:bg-white cursor-pointer"
                            title="Quick View"
                          >
                            <Eye size={16} />
                          </button>
                        </div>

                        <div className="flex items-center justify-between text-[11px] font-bold">
                          <span className="text-[#059669] uppercase tracking-wider">{bloom.occasion || "Floral"}</span>
                          <span className="text-[#4A6451] flex items-center gap-1">
                            <Star size={12} className="text-amber-500 fill-amber-500" />
                            {bloom.rating || 5.0} ({bloom.reviewCount || 30})
                          </span>
                        </div>

                        <h4 className="text-base font-serif font-bold text-[#064E3B] line-clamp-1 group-hover:text-[#059669] transition">
                          {bloom.name}
                        </h4>

                        <p className="text-xs text-[#4A6451] line-clamp-2 leading-relaxed">{bloom.description}</p>

                        {bloom.stemComposition && (
                          <div className="text-[10px] text-emerald-900 bg-emerald-50/80 p-2 rounded-xl space-y-0.5">
                            <span className="font-bold block text-emerald-800">Botanic Composition:</span>
                            <span className="line-clamp-1">{bloom.stemComposition.join(" • ")}</span>
                          </div>
                        )}
                      </div>

                      <div className="pt-3 flex justify-between items-center border-t border-emerald-100/60">
                        <div>
                          <span className="text-lg font-serif font-black text-[#064E3B]">
                            ₹{Number(bloom.price).toFixed(2)}
                          </span>
                          {bloom.compareAtPrice && (
                            <span className="text-xs text-gray-400 line-through ml-1.5">
                              ₹{Number(bloom.compareAtPrice).toFixed(2)}
                            </span>
                          )}
                        </div>

                        {outOfStock ? (
                          <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-xl border border-rose-200">
                            Sold Out
                          </span>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(bloom);
                            }}
                            className="px-4 py-2 bg-[#064E3B] hover:bg-[#047857] text-white rounded-xl text-xs font-bold cursor-pointer transition shadow-xs flex items-center gap-1"
                          >
                            <Plus size={14} />
                            <span>Add</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ==================================================== */}
        {/* ================= PAGE 3: BESPOKE STUDIO BUILDER == */}
        {/* ==================================================== */}
        {activePage === "builder" && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10">
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs uppercase tracking-[0.2em] text-[#059669] font-bold">Interactive Floristry</span>
              <h1 className="text-3xl sm:text-4xl font-serif font-black text-[#064E3B]">The Bespoke Bouquet Atelier</h1>
              <p className="text-xs sm:text-sm text-[#4A6451]">
                Design an arrangement from focal blooms to vessel and handwritten wax-sealed calligraphy card.
              </p>
            </div>

            {/* Stepper Wizard Bar */}
            <div className="flex items-center justify-between max-w-xl mx-auto bg-white p-2 rounded-2xl border border-emerald-100 text-xs font-bold">
              {[
                { step: 1, label: "1. Focal Stems" },
                { step: 2, label: "2. Foliage" },
                { step: 3, label: "3. Vessel" },
                { step: 4, label: "4. Gift Card" },
              ].map((s) => (
                <button
                  key={s.step}
                  onClick={() => setBuilderStep(s.step)}
                  className={`px-4 py-2 rounded-xl transition cursor-pointer ${
                    builderStep === s.step
                      ? "bg-[#064E3B] text-white shadow-xs"
                      : "text-[#4A6451] hover:text-[#064E3B]"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Step Contents */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Interactive Options */}
              <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-emerald-950/10 space-y-6 shadow-xs text-left">
                {/* STEP 1: FOCAL BLOOM SELECTION */}
                {builderStep === 1 && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-serif font-bold text-[#064E3B]">Step 1: Choose Your Focal Flower Stems</h3>
                      <p className="text-xs text-[#4A6451]">Select the dominant seasonal variety that sets the bouquet's spirit.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      {baseBloomOptions.map((opt) => (
                        <div
                          key={opt.id}
                          onClick={() => setCustomBase(opt.id)}
                          className={`p-4 rounded-2xl border-2 transition cursor-pointer flex gap-3.5 items-center ${
                            customBase === opt.id
                              ? "border-[#064E3B] bg-emerald-50/50 shadow-xs"
                              : "border-emerald-100 hover:border-emerald-300"
                          }`}
                        >
                          <img src={opt.image} alt={opt.name} className="w-16 h-16 rounded-xl object-cover" />
                          <div className="space-y-1">
                            <h4 className="text-xs font-bold text-[#064E3B]">{opt.name}</h4>
                            <span className="text-[11px] font-bold text-[#059669]">₹{opt.price.toFixed(2)} ({opt.stems})</span>
                            <p className="text-[10px] text-[#4A6451] line-clamp-1">{opt.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 flex justify-end">
                      <button
                        onClick={() => setBuilderStep(2)}
                        className="px-6 py-2.5 bg-[#064E3B] text-white rounded-xl text-xs font-bold hover:bg-[#047857] flex items-center gap-1.5"
                      >
                        <span>Next: Add Foliage</span>
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2: GREENERY SELECTION */}
                {builderStep === 2 && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-serif font-bold text-[#064E3B]">Step 2: Choose Accent Foliage & Texture</h3>
                      <p className="text-xs text-[#4A6451]">Complementary botanical greens add contrast, scent, and framing.</p>
                    </div>

                    <div className="space-y-3 pt-2">
                      {greeneryOptions.map((opt) => (
                        <div
                          key={opt.id}
                          onClick={() => setCustomGreenery(opt.id)}
                          className={`p-4 rounded-2xl border-2 transition cursor-pointer flex justify-between items-center ${
                            customGreenery === opt.id
                              ? "border-[#064E3B] bg-emerald-50/50"
                              : "border-emerald-100 hover:border-emerald-300"
                          }`}
                        >
                          <div className="space-y-0.5">
                            <h4 className="text-xs font-bold text-[#064E3B]">{opt.name}</h4>
                            <p className="text-[11px] text-[#4A6451]">{opt.desc}</p>
                          </div>
                          <span className="text-xs font-bold text-[#059669]">+₹{opt.price.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 flex justify-between">
                      <button
                        onClick={() => setBuilderStep(1)}
                        className="px-5 py-2.5 border border-emerald-200 text-[#064E3B] rounded-xl text-xs font-bold"
                      >
                        Back
                      </button>
                      <button
                        onClick={() => setBuilderStep(3)}
                        className="px-6 py-2.5 bg-[#064E3B] text-white rounded-xl text-xs font-bold hover:bg-[#047857] flex items-center gap-1.5"
                      >
                        <span>Next: Select Vessel</span>
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: VESSEL SELECTION */}
                {builderStep === 3 && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-serif font-bold text-[#064E3B]">Step 3: Presentation & Vase Style</h3>
                      <p className="text-xs text-[#4A6451]">Delivered ready-to-display or hand-tied in sustainable botanical wraps.</p>
                    </div>

                    <div className="space-y-3 pt-2">
                      {vaseOptions.map((opt) => (
                        <div
                          key={opt.id}
                          onClick={() => setCustomVase(opt.id)}
                          className={`p-4 rounded-2xl border-2 transition cursor-pointer flex justify-between items-center ${
                            customVase === opt.id
                              ? "border-[#064E3B] bg-emerald-50/50"
                              : "border-emerald-100 hover:border-emerald-300"
                          }`}
                        >
                          <div className="space-y-0.5">
                            <h4 className="text-xs font-bold text-[#064E3B]">{opt.name}</h4>
                            <p className="text-[11px] text-[#4A6451]">{opt.desc}</p>
                          </div>
                          <span className="text-xs font-bold text-[#059669]">
                            {opt.price === 0 ? "Included" : `+₹${opt.price.toFixed(2)}`}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 flex justify-between">
                      <button
                        onClick={() => setBuilderStep(2)}
                        className="px-5 py-2.5 border border-emerald-200 text-[#064E3B] rounded-xl text-xs font-bold"
                      >
                        Back
                      </button>
                      <button
                        onClick={() => setBuilderStep(4)}
                        className="px-6 py-2.5 bg-[#064E3B] text-white rounded-xl text-xs font-bold hover:bg-[#047857] flex items-center gap-1.5"
                      >
                        <span>Next: Write Gift Card</span>
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 4: WAX-SEALED CALLIGRAPHY CARD */}
                {builderStep === 4 && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-serif font-bold text-[#064E3B]">Step 4: Complimentary Calligraphy Note</h3>
                      <p className="text-xs text-[#4A6451]">Your message will be hand-lettered on heavy archival cardstock and sealed with green wax.</p>
                    </div>

                    <div className="space-y-3 pt-2">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-[#064E3B] mb-1">To / Recipient Name</label>
                          <input
                            type="text"
                            value={cardRecipient}
                            onChange={(e) => setCardRecipient(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-emerald-50/40 border border-emerald-200 text-xs text-[#064E3B] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-[#064E3B] mb-1">From / Sender Signoff</label>
                          <input
                            type="text"
                            value={cardSender}
                            onChange={(e) => setCardSender(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-emerald-50/40 border border-emerald-200 text-xs text-[#064E3B] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#064E3B] mb-1">Personal Message</label>
                        <textarea
                          rows={3}
                          value={cardMessage}
                          onChange={(e) => setCardMessage(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl bg-emerald-50/40 border border-emerald-200 text-xs text-[#064E3B] focus:outline-none"
                          maxLength={160}
                        />
                        <span className="text-[10px] text-gray-400 block text-right">
                          {160 - cardMessage.length} characters left
                        </span>
                      </div>

                      {/* Calligraphy Card Live Visual Preview */}
                      <div className="p-6 rounded-2xl bg-[#FFFDF9] border border-amber-200/80 shadow-inner text-center space-y-2 relative">
                        <div className="w-8 h-8 rounded-full bg-emerald-800 text-amber-100 flex items-center justify-center mx-auto text-xs font-serif shadow-xs">
                          🌸
                        </div>
                        <span className="text-[10px] uppercase tracking-widest text-[#059669] font-bold">Wax-Sealed Botanical Card</span>
                        <p className="text-xs font-bold text-[#064E3B]">Dearest {cardRecipient},</p>
                        <p className="text-xs italic font-serif text-[#3A4E40] max-w-md mx-auto leading-relaxed">
                          "{cardMessage}"
                        </p>
                        <p className="text-[11px] font-medium text-[#4A6451]">{cardSender}</p>
                      </div>
                    </div>

                    <div className="pt-4 flex justify-between">
                      <button
                        onClick={() => setBuilderStep(3)}
                        className="px-5 py-2.5 border border-emerald-200 text-[#064E3B] rounded-xl text-xs font-bold"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleAddBespokeBouquet}
                        className="px-8 py-3 bg-[#064E3B] text-white rounded-xl text-xs font-bold hover:bg-[#047857] flex items-center gap-2 shadow-lg"
                      >
                        <ShoppingBag size={15} />
                        <span>Add Custom Bouquet to Bag (₹{builderTotal.toFixed(2)})</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Live Summary Card */}
              <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-emerald-950/10 space-y-5 shadow-xs sticky top-28 text-left">
                <h3 className="text-base font-serif font-bold text-[#064E3B] border-b border-emerald-100/80 pb-3">
                  Your Bespoke Composition
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-[#4A6451]">Focal Variety:</span>
                    <span className="font-bold text-[#064E3B]">
                      {baseBloomOptions.find((b) => b.id === customBase)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#4A6451]">Foliage:</span>
                    <span className="font-bold text-[#064E3B]">
                      {greeneryOptions.find((g) => g.id === customGreenery)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#4A6451]">Vessel Style:</span>
                    <span className="font-bold text-[#064E3B]">
                      {vaseOptions.find((v) => v.id === customVase)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#4A6451]">Calligraphy Note:</span>
                    <span className="font-bold text-emerald-600">Included Complimentary</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#4A6451]">Longevity Packet:</span>
                    <span className="font-bold text-emerald-600">Included (2 Sachets)</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-emerald-100/80 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#4A6451] block">Total Investment</span>
                    <span className="text-2xl font-serif font-black text-[#064E3B]">₹{builderTotal.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={handleAddBespokeBouquet}
                    className="px-5 py-2.5 bg-[#064E3B] hover:bg-[#047857] text-white rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    Add to Bag
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* ================= PAGE 4: FLOWER SUBSCRIPTION ===== */}
        {/* ==================================================== */}
        {activePage === "subscription" && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs uppercase tracking-[0.2em] text-[#059669] font-bold">The Botanical Club</span>
              <h1 className="text-3xl sm:text-4xl font-serif font-black text-[#064E3B]">Seasonal Bloom Subscriptions</h1>
              <p className="text-xs sm:text-sm text-[#4A6451]">
                Cut at dawn and hand-delivered directly to your sanctuary. Includes a complimentary designer vase on delivery #1. Pause, skip, or cancel anytime.
              </p>
            </div>

            {/* Club Perks Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl bg-white border border-emerald-100 space-y-2 text-center">
                <Gift size={24} className="text-[#059669] mx-auto" />
                <h4 className="text-xs font-bold text-[#064E3B]">Free Hand-Thrown Vase</h4>
                <p className="text-[11px] text-[#4A6451]">Every member receives a ceramic vase worth ₹1,200 on their first delivery.</p>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-emerald-100 space-y-2 text-center">
                <Clock size={24} className="text-[#059669] mx-auto" />
                <h4 className="text-xs font-bold text-[#064E3B]">Morning Priority Delivery</h4>
                <p className="text-[11px] text-[#4A6451]">Direct climate courier delivery before 11:00 AM in chilled hydration wraps.</p>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-emerald-100 space-y-2 text-center">
                <RefreshCw size={24} className="text-[#059669] mx-auto" />
                <h4 className="text-xs font-bold text-[#064E3B]">Complete Flexibility</h4>
                <p className="text-[11px] text-[#4A6451]">Going on holiday? Pause, reschedule, or swap recipient address in 1 click.</p>
              </div>
            </div>

            {/* Subscription Tiers */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  id: "sub-classic",
                  name: "The Classic Market Wrap",
                  stems: "16-18 Seasonal Stems",
                  price: 1499,
                  desc: "Cheerful wildflowers, field ranunculus, spray roses, and crisp eucalyptus. Perfect for coffee tables and nightstands.",
                  popular: false,
                },
                {
                  id: "sub-grand",
                  name: "The Grand Botanical Suite",
                  stems: "26-30 Luxury Stems",
                  price: 2499,
                  desc: "Opulent garden roses, seasonal peonies, Dutch hydrangeas, sweet peas, and cascading jasmine vines.",
                  popular: true,
                },
                {
                  id: "sub-minimalist",
                  name: "The Sculptural Minimalist",
                  stems: "12-14 Architectural Stems",
                  price: 1999,
                  desc: "Exotic calla lilies, anthuriums, Ikebana branches, and monsteras for contemporary loft interiors.",
                  popular: false,
                },
              ].map((sub) => (
                <div
                  key={sub.id}
                  className={`bg-white rounded-3xl p-6 sm:p-8 space-y-6 flex flex-col justify-between text-left relative ${
                    sub.popular
                      ? "border-2 border-[#064E3B] shadow-xl"
                      : "border border-emerald-950/10 shadow-xs"
                  }`}
                >
                  {sub.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#064E3B] text-white text-[10px] uppercase font-black tracking-widest px-3 py-1 rounded-full">
                      Most Popular Club Choice
                    </span>
                  )}

                  <div className="space-y-3">
                    <span className="text-[10px] font-bold uppercase text-[#059669] bg-emerald-50 px-2.5 py-1 rounded-full">
                      Save 20% vs Individual Orders
                    </span>
                    <h3 className="text-xl font-serif font-bold text-[#064E3B]">{sub.name}</h3>
                    <p className="text-xs font-bold text-[#059669]">{sub.stems}</p>
                    <p className="text-xs text-[#4A6451] leading-relaxed">{sub.desc}</p>
                  </div>

                  <div className="pt-4 border-t border-emerald-100/80 space-y-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-serif font-black text-[#064E3B]">₹{sub.price}</span>
                      <span className="text-xs text-[#4A6451]">/ delivery</span>
                    </div>

                    <button
                      onClick={() =>
                        handleAddToCart({
                          _id: sub.id,
                          name: `${sub.name} (Club Subscription)`,
                          price: sub.price,
                          image: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=600",
                          stemCount: sub.stems,
                          description: sub.desc,
                        })
                      }
                      className={`w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                        sub.popular
                          ? "bg-[#064E3B] hover:bg-[#047857] text-white shadow-md"
                          : "bg-emerald-50 hover:bg-emerald-100 text-[#064E3B]"
                      }`}
                    >
                      Join Botanical Club
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* ================= PAGE 5: 7-DAY CARE LAB ========== */}
        {/* ==================================================== */}
        {activePage === "care-guide" && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 text-left">
            <div className="text-center space-y-2">
              <span className="text-xs uppercase tracking-[0.2em] text-[#059669] font-bold">Botanical Longevity Science</span>
              <h1 className="text-3xl sm:text-4xl font-serif font-black text-[#064E3B]">7-Day Floral Care Lab</h1>
              <p className="text-xs sm:text-sm text-[#4A6451]">
                Master florist secrets and precise hydration science to keep your cut stems radiant for over a week.
              </p>
            </div>

            {/* Interactive Vase Dosage Calculator */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-emerald-950/10 space-y-6 shadow-xs">
              <div className="flex items-center gap-2.5">
                <Droplets size={22} className="text-[#059669]" />
                <h3 className="text-lg font-serif font-bold text-[#064E3B]">Interactive Water & Food Dosage Calculator</h3>
              </div>

              <p className="text-xs text-[#4A6451]">
                Adjust your vase capacity to get the exact water temperature and flower food powder ratio.
              </p>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-[#064E3B]">
                  <span>Vase Water Volume: {vaseVolumeMl} mL</span>
                  <span>{vaseVolumeMl <= 800 ? "Small Bud Vase" : vaseVolumeMl <= 1500 ? "Medium Table Vase" : "Grand Urn"}</span>
                </div>
                <input
                  type="range"
                  min="400"
                  max="2500"
                  step="100"
                  value={vaseVolumeMl}
                  onChange={(e) => setVaseVolumeMl(Number(e.target.value))}
                  className="w-full accent-[#064E3B] cursor-pointer"
                />
              </div>

              {/* Calculated Results */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#059669] block">Flower Food Sachet</span>
                  <span className="text-base font-bold text-[#064E3B]">
                    {(vaseVolumeMl / 500).toFixed(1)} Packets
                  </span>
                  <p className="text-[10px] text-[#4A6451]">Dissolve thoroughly in water</p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#059669] block">Water Temperature</span>
                  <span className="text-base font-bold text-[#064E3B]">20°C - 22°C (Lukewarm)</span>
                  <p className="text-[10px] text-[#4A6451]">Encourages rapid capillary uptake</p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#059669] block">Water Refresh Cycle</span>
                  <span className="text-base font-bold text-[#064E3B]">Every 48 Hours</span>
                  <p className="text-[10px] text-[#4A6451]">Trim 1/2 inch at each change</p>
                </div>
              </div>
            </div>

            {/* Core Florist Secrets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-3xl bg-white border border-emerald-950/10 space-y-3">
                <Scissors size={26} className="text-[#059669]" />
                <h4 className="text-base font-bold text-[#064E3B]">45° Angle Underwater Cut</h4>
                <p className="text-xs text-[#4A6451] leading-relaxed">
                  Never use blunt household scissors. Use sharp floral shears and cut 1 inch off the stem under a running faucet to prevent microscopic air bubbles from clogging water channels.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-emerald-950/10 space-y-3">
                <Droplets size={26} className="text-[#059669]" />
                <h4 className="text-base font-bold text-[#064E3B]">Strip Submerged Leaves</h4>
                <p className="text-xs text-[#4A6451] leading-relaxed">
                  Remove all foliage below the waterline. Submerged leaves rot rapidly, creating bacterial growth that causes water turbidity and premature petal wilting.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-emerald-950/10 space-y-3">
                <ShieldCheck size={26} className="text-[#059669]" />
                <h4 className="text-base font-bold text-[#064E3B]">Ethylene Gas Avoidance</h4>
                <p className="text-xs text-[#4A6451] leading-relaxed">
                  Keep your floral vase at least 6 feet away from ripening fruit bowls (apples, bananas) and direct air conditioning or heater vents, which accelerate petal drops.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* ================= PAGE 6: WEDDINGS & EVENTS ======= */}
        {/* ==================================================== */}
        {activePage === "weddings" && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 text-left">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs uppercase tracking-[0.2em] text-[#059669] font-bold">Weddings & Grand Galas</span>
              <h1 className="text-3xl sm:text-4xl font-serif font-black text-[#064E3B]">Event Floral Design & Calculator</h1>
              <p className="text-xs sm:text-sm text-[#4A6451]">
                Get a transparent ballpark budget for your celebration and schedule an in-person or video consultation with our Lead Floral Architect.
              </p>
            </div>

            {/* Interactive Event Cost Estimator */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-emerald-950/10 space-y-6 shadow-xs">
                <h3 className="text-lg font-serif font-bold text-[#064E3B]">Interactive Floral Investment Calculator</h3>

                {/* Aesthetic Theme */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#064E3B]">Aesthetic Vision</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "garden", label: "Romantic Garden" },
                      { id: "modern", label: "Sculptural Ikebana" },
                      { id: "opulent", label: "Grand Classical" },
                    ].map((style) => (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => setWeddingStyle(style.id)}
                        className={`p-2.5 rounded-xl text-xs font-bold border transition ${
                          weddingStyle === style.id
                            ? "bg-[#064E3B] text-white border-[#064E3B]"
                            : "bg-white text-[#064E3B] border-emerald-200"
                        }`}
                      >
                        {style.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Table Centerpieces slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-[#064E3B]">
                    <span>Guest Tables / Centerpieces: {tablesCount}</span>
                    <span>₹{tablesCount * (weddingStyle === "garden" ? 85 : 110)}</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="24"
                    value={tablesCount}
                    onChange={(e) => setTablesCount(Number(e.target.value))}
                    className="w-full accent-[#064E3B]"
                  />
                </div>

                {/* Bridal Party Options */}
                <div className="space-y-3 pt-2">
                  <label className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 cursor-pointer">
                    <span className="text-xs font-bold text-[#064E3B]">Include Luxury Bridal Bouquet</span>
                    <input
                      type="checkbox"
                      checked={hasBridalBouquet}
                      onChange={(e) => setHasBridalBouquet(e.target.checked)}
                      className="accent-[#064E3B] w-4 h-4"
                    />
                  </label>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/50 border border-emerald-100">
                    <span className="text-xs font-bold text-[#064E3B]">Bridesmaids Bouquets ({bridesmaidsCount})</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setBridesmaidsCount(Math.max(0, bridesmaidsCount - 1))}
                        className="w-6 h-6 rounded-lg bg-white border border-emerald-200 text-xs font-bold"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold">{bridesmaidsCount}</span>
                      <button
                        type="button"
                        onClick={() => setBridesmaidsCount(bridesmaidsCount + 1)}
                        className="w-6 h-6 rounded-lg bg-white border border-emerald-200 text-xs font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <label className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 cursor-pointer">
                    <span className="text-xs font-bold text-[#064E3B]">Ceremony Chuppah / Arch Floral Installation</span>
                    <input
                      type="checkbox"
                      checked={hasArch}
                      onChange={(e) => setHasArch(e.target.checked)}
                      className="accent-[#064E3B] w-4 h-4"
                    />
                  </label>
                </div>
              </div>

              {/* Right Column: Estimate & Booking Form */}
              <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-emerald-950/10 space-y-5 shadow-xs">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-[#059669] font-bold">Ballpark Estimate</span>
                  <div className="text-3xl font-serif font-black text-[#064E3B]">
                    ₹{weddingEstimate.toLocaleString()}
                  </div>
                  <p className="text-[11px] text-[#4A6451]">Includes design, delivery, installation, and midnight teardown.</p>
                </div>

                <div className="border-t border-emerald-100 pt-4 space-y-3">
                  <h4 className="text-xs font-bold text-[#064E3B] uppercase tracking-wider">Book Design Consultation</h4>
                  {weddingFormSubmitted ? (
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                      <CheckCircle2 size={28} className="text-emerald-600 mx-auto" />
                      <h5 className="text-sm font-bold text-[#064E3B]">Consultation Request Received!</h5>
                      <p className="text-xs text-[#4A6451]">
                        Our creative director will email your calendar invite within 24 business hours.
                      </p>
                    </div>
                  ) : (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        setWeddingFormSubmitted(true);
                      }}
                      className="space-y-3"
                    >
                      <input
                        type="text"
                        required
                        placeholder="Couple / Host Names"
                        className="w-full px-3 py-2 rounded-xl bg-emerald-50/40 border border-emerald-200 text-xs text-[#064E3B]"
                      />
                      <input
                        type="email"
                        required
                        placeholder="Contact Email Address"
                        className="w-full px-3 py-2 rounded-xl bg-emerald-50/40 border border-emerald-200 text-xs text-[#064E3B]"
                      />
                      <input
                        type="text"
                        required
                        placeholder="Event Date & Venue (City, State)"
                        className="w-full px-3 py-2 rounded-xl bg-emerald-50/40 border border-emerald-200 text-xs text-[#064E3B]"
                      />
                      <button
                        type="submit"
                        className="w-full py-3 bg-[#064E3B] hover:bg-[#047857] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer shadow-md"
                      >
                        Submit Consultation Request
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* ================= PAGE: PRODUCT DETAIL ============ */}
        {/* ==================================================== */}
        {activePage === "product-detail" && selectedProduct && (
          <ProductDetailsPage
            product={selectedProduct}
            onBack={() => {
              setActivePage("home");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onAddToCart={handleAddToCart}
            themeColors={{
              primary: "#064E3B",
              secondary: "#047857",
              text: "#064E3B",
              background: "#FCFBF9",
              cardBg: "#FFFFFF",
            }}
            business={business}
            relatedProducts={blooms}
            onSelectProduct={(p) => {
              setSelectedProduct(p);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        )}
      </main>

      {/* ================= 3. QUICK-VIEW / STEM INSPECT MODAL ================= */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-emerald-100 max-h-[90vh] overflow-y-auto text-left relative">
            <button
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
              <div className="aspect-square rounded-2xl overflow-hidden bg-emerald-50">
                <img
                  src={getProductImage(quickViewProduct, quickViewProduct.image)}
                  alt={quickViewProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-3">
                <span className="text-[10px] uppercase font-bold text-[#059669] tracking-wider">
                  {quickViewProduct.occasion || "Artisan Stem"}
                </span>
                <h3 className="text-xl font-serif font-bold text-[#064E3B]">{quickViewProduct.name}</h3>
                <div className="text-xl font-serif font-black text-[#064E3B]">
                  ₹{quickViewPrice.toFixed(2)}
                </div>
                <p className="text-xs text-[#4A6451] leading-relaxed">{quickViewProduct.description}</p>

                {/* Stem Size Selection */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-[11px] font-bold text-[#064E3B] block">Arrangement Density:</span>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "classic", label: "Classic", stems: "16 Stems" },
                      { id: "deluxe", label: "Deluxe", stems: "24 Stems" },
                      { id: "grand", label: "Grand", stems: "36 Stems" },
                    ].map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setQuickSize(s.id)}
                        className={`p-2 rounded-xl text-[10px] font-bold border transition ${
                          quickSize === s.id
                            ? "bg-[#064E3B] text-white border-[#064E3B]"
                            : "bg-white text-[#064E3B] border-emerald-200"
                        }`}
                      >
                        <span className="block">{s.label}</span>
                        <span className="text-[9px] opacity-80">{s.stems}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Add-ons Selector */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-[11px] font-bold text-[#064E3B] block">Curated Luxury Add-ons:</span>
                  <div className="space-y-1.5">
                    {availableAddons.map((addon) => {
                      const isSelected = selectedAddons.some((a) => a.id === addon.id);
                      return (
                        <div
                          key={addon.id}
                          onClick={() => toggleAddon(addon)}
                          className={`p-2 rounded-xl border text-[11px] font-medium flex items-center justify-between cursor-pointer transition ${
                            isSelected
                              ? "bg-emerald-50 border-emerald-600 text-[#064E3B]"
                              : "bg-white border-emerald-100 text-[#4A6451] hover:border-emerald-300"
                          }`}
                        >
                          <span>{addon.name}</span>
                          <span className="font-bold text-[#064E3B]">+₹{addon.price.toFixed(2)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => {
                      handleAddToCart(quickViewProduct, 1, {
                        sizeTitle: quickSize.toUpperCase(),
                        totalPrice: quickViewPrice,
                        addons: selectedAddons,
                      });
                      setQuickViewProduct(null);
                    }}
                    className="w-full py-3 bg-[#064E3B] hover:bg-[#047857] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer shadow-md"
                  >
                    Add to Vase Bag (₹{quickViewPrice.toFixed(2)})
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= 4. BESPOKE FLORAL FOOTER ================= */}
      <footer className="bg-[#064E3B] text-emerald-100 pt-16 pb-12 border-t border-[#047857] text-left text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* VIP Newsletter Strip */}
          <div className="p-8 rounded-3xl bg-[#04382A] border border-emerald-800/60 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-1 text-left max-w-md">
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400">
                VIP Botanical Club
              </span>
              <h3 className="text-xl font-serif font-black text-white">Receive 15% OFF Your First Bouquet</h3>
              <p className="text-xs text-emerald-200/80">
                Subscribe for private invites to seasonal orchid vault releases and master florist flower food tips.
              </p>
            </div>

            <div className="w-full md:w-auto">
              {vipSubscribed ? (
                <div className="px-5 py-3 rounded-2xl bg-emerald-900/60 border border-emerald-400 text-white font-bold text-xs flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-300" />
                  <span>Use code <strong>BLOOM15</strong> at checkout!</span>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (vipEmail) setVipSubscribed(true);
                  }}
                  className="flex gap-2 w-full max-w-sm"
                >
                  <input
                    type="email"
                    required
                    value={vipEmail}
                    onChange={(e) => setVipEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    className="px-4 py-2.5 rounded-xl bg-white/10 border border-emerald-700 text-xs text-white placeholder:text-emerald-300/60 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-[#064E3B] font-bold text-xs rounded-xl shrink-0 transition cursor-pointer"
                  >
                    Join
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                {brandLogo ? (
                  <img
                    src={brandLogo}
                    alt={brandName}
                    className="h-8 w-auto max-w-[130px] object-contain rounded brightness-0 invert"
                  />
                ) : (
                  <Flower2 size={22} className="text-emerald-300" />
                )}
                <span className="text-base font-serif font-black tracking-tight text-white uppercase">
                  {brandName}
                </span>
              </div>
              <p className="text-emerald-200/80 leading-relaxed text-[11px] max-w-xs">
                {brandDescription}
              </p>
              {brandAddress && (
                <p className="text-emerald-300/90 text-[11px] flex items-center gap-1.5 pt-1">
                  <MapPin size={13} className="shrink-0 text-emerald-400" />
                  <span>{brandAddress}</span>
                </p>
              )}
            </div>

            <div className="space-y-2">
              <h5 className="font-bold text-white uppercase text-[10px] tracking-wider">Artisan Stems</h5>
              <p
                onClick={() => {
                  setSelectedOccasion("romance");
                  setActivePage("arrangements");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="hover:text-white cursor-pointer transition text-[11px]"
              >
                Garden Roses & Ranunculus
              </p>
              <p
                onClick={() => {
                  setSelectedOccasion("celebration");
                  setActivePage("arrangements");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="hover:text-white cursor-pointer transition text-[11px]"
              >
                Peonies & Celebration Urns
              </p>
              <p
                onClick={() => {
                  setActivePage("builder");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="hover:text-white cursor-pointer transition text-[11px]"
              >
                Bespoke Bouquet Studio
              </p>
            </div>

            <div className="space-y-2">
              <h5 className="font-bold text-white uppercase text-[10px] tracking-wider">Client Concierge</h5>
              <p
                onClick={() => {
                  setActivePage("care-guide");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="hover:text-white cursor-pointer transition text-[11px]"
              >
                7-Day Freshness Science
              </p>
              <p
                onClick={() => {
                  setActivePage("subscription");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="hover:text-white cursor-pointer transition text-[11px]"
              >
                The Botanical Flower Club
              </p>
              <p
                onClick={() => {
                  setActivePage("weddings");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="hover:text-white cursor-pointer transition text-[11px]"
              >
                Weddings & Event Installations
              </p>
            </div>

            <div className="space-y-2">
              <h5 className="font-bold text-white uppercase text-[10px] tracking-wider">Studio Concierge</h5>
              <p className="text-white font-bold">{brandPhone}</p>
              <p className="text-emerald-300 text-[11px]">{brandEmail}</p>
              <span className="text-[10px] text-emerald-400 block pt-2">
                Open Daily: 7:00 AM – 8:00 PM EST
              </span>
            </div>
          </div>

          <div className="pt-8 border-t border-emerald-800/60 flex flex-col sm:flex-row justify-between items-center text-[10px] text-emerald-300/70 gap-2">
            <p>© {new Date().getFullYear()} {brandName}. Handcrafted with floral devotion.</p>
            <p>Sustainable hydration packaging • Carbon-neutral courier delivery</p>
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
        themeColors={{ primary: "#064E3B" }}
      />
    </div>
  );
}
