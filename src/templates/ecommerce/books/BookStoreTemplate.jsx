import React, { useState, useMemo } from "react";
import {
  BookOpen,
  Search,
  Star,
  ShoppingBag,
  Sparkles,
  Heart,
  Calendar,
  Check,
  Award,
  Coffee,
  Bookmark,
  X,
  Eye,
  ArrowRight,
  Sliders,
  Type,
  Clock,
  ShieldCheck,
  Plus,
  Minus,
  ChevronRight,
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

export default function BookStoreTemplate({
  business = {},
  products = [],
  categories = [],
  offers = [],
  reviews = [],
  customization = {},
}) {
  // Navigation: "home" | "stacks" | "book-club" | "calculator" | "rare-vault" | "offers" | "product-detail"
  const [activePage, setActivePage] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);

  // Search & Filters
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // "Look Inside" Reading Excerpt Drawer State
  const [readingExcerptBook, setReadingExcerptBook] = useState(null);
  const [readerTheme, setReaderTheme] = useState("parchment"); // "parchment" | "sepia" | "night"
  const [readerFontSize, setReaderFontSize] = useState("text-sm"); // "text-xs" | "text-sm" | "text-base"

  // Reading Time Calculator State
  const [readingSpeedWpm, setReadingSpeedWpm] = useState(250);
  const [dailyReadingMins, setDailyReadingMins] = useState(30);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart?.cartItems || []);

  const defaultBooks = [
    {
      _id: "book-1",
      name: "The Architecture of Solitude",
      author: "Elena Rostova",
      price: 28.0,
      compareAtPrice: 35.0,
      format: "Clothbound Hardcover",
      genre: "Literary Fiction",
      pages: 412,
      wordCount: 105000,
      rating: 5.0,
      reviewCount: 68,
      badge: "Staff Favorite",
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=900&auto=format&fit=crop&q=80",
      description: "A sweeping multi-generational saga exploring memory, exile, and architectural marvels along the winter banks of the Danube.",
      excerpt:
        "The train pulled into the station at dawn, when the morning mist still clung like spider silk to the rusted iron girders. He watched the river through the cracked glass—grey, vast, and indifferent. For forty years he had carried the blueprint in his coat pocket, folded until the paper felt as soft as worn linen. Here, in the forgotten bend of the city, stone would remember what men had tried so desperately to erase.",
      inStock: true,
    },
    {
      _id: "book-2",
      name: "Chronicles of the Old Quarter",
      author: "Julien Mercier",
      price: 24.0,
      compareAtPrice: 30.0,
      format: "Clothbound Hardcover",
      genre: "Literary Fiction",
      pages: 320,
      wordCount: 82000,
      rating: 4.8,
      reviewCount: 45,
      badge: "Indie Bestseller",
      image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=900&auto=format&fit=crop&q=80",
      description: "Lyrical vignettes of Parisian second-hand antiquarians, forgotten letters, and clandestine evening salons in the 1920s.",
      excerpt:
        "The bell above Madame Laurent's bookshop had a brass tongue that struck true twice every afternoon. Sunlight pooled in the corner where the calfskin folios leaned against one another like drowsy scholars. To open a book bound before the Great War was to inhale tobacco, cedar shavings, and the unmistakable ghost of rain on cobblestones.",
      inStock: true,
    },
    {
      _id: "book-3",
      name: "On Time, Silence, and Stone",
      author: "Dr. Alistair Finch",
      price: 22.0,
      compareAtPrice: 28.0,
      format: "Paperback",
      genre: "Philosophy & Essays",
      pages: 256,
      wordCount: 64000,
      rating: 4.9,
      reviewCount: 38,
      badge: "Editor's Choice",
      image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=900&auto=format&fit=crop&q=80",
      description: "A contemplative philosophical meditation on cathedral masonry, deep geological time, and the restorative discipline of stillness.",
      excerpt:
        "We are creatures of the ephemeral, yet we spend our finite breaths carving our names into granite that outlasts empires. What does a mountain think of our centuries? The cathedral masons understood this humility: they spent three generations laying foundations they knew their own grandchildren would never see crowned with glass.",
      inStock: true,
    },
    {
      _id: "book-4",
      name: "The Celestial Machinist",
      author: "Cassandra Vane",
      price: 26.0,
      compareAtPrice: 32.0,
      format: "Clothbound Hardcover",
      genre: "Speculative Fiction",
      pages: 448,
      wordCount: 118000,
      rating: 5.0,
      reviewCount: 52,
      badge: "Hugo Nominee",
      image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=900&auto=format&fit=crop&q=80",
      description: "An intricate clockpunk astronomical odyssey across Victorian London, brass astrolabes, and alternate dimensional navigation.",
      excerpt:
        "Beneath the brass dome of the Royal Observatory, gears larger than carriages turned with a deep, subterranean hum. Penelope aligned the crosshairs with the third satellite of Jupiter. It was not where Kepler had charted it. Something vast and metallic was moving between the rings, casting a shadow across three hundred light minutes.",
      inStock: true,
    },
    {
      _id: "book-5",
      name: "Echoes of the High Pyrenees",
      author: "Mateo Ortiz",
      price: 20.0,
      compareAtPrice: 26.0,
      format: "Paperback",
      genre: "Poetry & Drama",
      pages: 180,
      wordCount: 32000,
      rating: 4.9,
      reviewCount: 29,
      badge: "Bilingual Edition",
      image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=900&auto=format&fit=crop&q=80",
      description: "Bilingual verses capturing mountain shepherds, limestone cliffs, autumn shepherd flutes, and the quiet dignity of altitude.",
      excerpt:
        "Where the pine line ends / only stone and hawk remain / speaking a dialect older than Latin / carried by the frost.",
      inStock: true,
    },
    {
      _id: "book-6",
      name: "The Cartographer's Daughter (Signed First)",
      author: "Helena Blackwood",
      price: 55.0,
      compareAtPrice: 65.0,
      format: "Signed First Edition",
      genre: "Rare & Signed",
      pages: 390,
      wordCount: 98000,
      rating: 5.0,
      reviewCount: 41,
      badge: "Author Signed",
      image: "https://images.unsplash.com/photo-1532012164546-f432f2e3777a?w=900&auto=format&fit=crop&q=80",
      description: "Limited collector's printing of 500 copies, individually numbered and signed by Helena Blackwood with custom hand-colored maps.",
      excerpt:
        "To draw an island is to invent it. My father always kept a compass of bone and silver in his left palm, tapping the brass table whenever he spoke of islands that only existed when the tide was out.",
      inStock: true,
    },
  ];

  const bookItems = products.length > 0 ? products : defaultBooks;

  const brandName =
    business?.businessName ||
    business?.name ||
    customization?.heroHeadline ||
    "CHAPTER & VERSE";

  const brandLogo = customization?.logo || business?.logo || null;
  const brandPhone =
    business?.phone ||
    business?.businessPhone ||
    business?.contactPhone ||
    "+1 (800) 555-READ";
  const brandEmail =
    business?.email ||
    business?.businessEmail ||
    business?.contactEmail ||
    "curator@chapterversepress.com";

  const rawAddr = business?.address || business?.registered_business_address;
  const brandAddress =
    typeof rawAddr === "string"
      ? rawAddr
      : rawAddr && typeof rawAddr === "object"
      ? [rawAddr.street, rawAddr.addressLine2, rawAddr.city, rawAddr.state, rawAddr.postalCode, rawAddr.country]
          .filter(Boolean)
          .join(", ")
      : "12 Bodleian Alley, Oxford, OX1 3BG, UK";

  const handleAddToCart = (product, qty = 1) => {
    if (isOutOfStock(product)) {
      toast.error(`Sorry, ${product.name} is currently out of stock!`);
      return;
    }
    dispatch(addToCart({ product, quantity: qty }));
    toast.success(`${product.name} added to Book Bag! 📖`);
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

  // Reading Speed Calculator calculations
  const calculatedDays = useMemo(() => {
    const targetBook = bookItems[0];
    const totalWords = targetBook.wordCount || 105000;
    const dailyWords = readingSpeedWpm * dailyReadingMins;
    if (dailyWords === 0) return 14;
    return Math.ceil(totalWords / dailyWords);
  }, [readingSpeedWpm, dailyReadingMins, bookItems]);

  return (
    <div className="min-h-screen flex flex-col font-serif bg-[#FAF7F2] text-[#1C1917] antialiased selection:bg-[#9A3412]/20 selection:text-[#9A3412]">
      {/* ================= 1. CLASSICAL EDITORIAL NAVBAR ================= */}
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
        onOpenReadingCalc={() => {
          setActivePage("calculator");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />

      {/* ================= 2. MAIN ACTIVE VIEW ================= */}
      <main className="flex-1">
        {/* ================= VIEW 1: HOME (FRONT STACKS) ================= */}
        {activePage === "home" && (
          <>
            {/* HERO SECTION */}
            <section className="relative overflow-hidden bg-[#FAF7F2] pt-12 pb-20 md:pt-20 md:pb-28 border-b border-[#E7DFD5]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  <div className="lg:col-span-7 space-y-6 text-left">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFE9DF] border border-[#D5C7B8] text-[#1C1917] text-xs font-bold font-sans">
                      <Bookmark size={14} className="text-[#9A3412]" />
                      <span>Independent Press & Archival Smyth-Sewn Stacks</span>
                    </div>

                    <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#1C1917] leading-[1.08]">
                      Unhurried Literature for Enduring Bookshelves.
                    </h1>

                    <p className="text-sm sm:text-base text-[#574B40] leading-relaxed max-w-xl font-sans">
                      Clothbound hardcovers, rare signed first editions, and independent literary journals printed on 80gsm acid-free Munken paper with deckled edges. Made for readers who cherish the physical weight of words.
                    </p>

                    <div className="flex flex-wrap gap-4 pt-2">
                      <button
                        onClick={() => {
                          setActivePage("stacks");
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="px-8 py-4 bg-[#1C1917] hover:bg-[#292524] text-[#FAF7F2] rounded-2xl text-xs font-bold uppercase tracking-widest transition shadow-lg flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5 active:scale-95"
                      >
                        <BookOpen size={17} className="text-[#D97706]" />
                        <span>Browse Front Stacks</span>
                      </button>

                      <button
                        onClick={() => setReadingExcerptBook(bookItems[0])}
                        className="px-7 py-4 bg-white border border-[#D5C7B8] hover:border-[#78350F] text-[#1C1917] rounded-2xl text-xs font-bold uppercase tracking-widest transition flex items-center gap-2 cursor-pointer shadow-sm"
                      >
                        <BookOpen size={16} className="text-[#9A3412]" />
                        <span>"Look Inside" Reader</span>
                      </button>
                    </div>

                    {/* Literary Specs Strip */}
                    <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#E7DFD5] text-left">
                      <div>
                        <span className="text-xl sm:text-2xl font-bold text-[#1C1917]">Smyth-Sewn</span>
                        <p className="text-[11px] text-[#78350F] font-sans mt-0.5">Permanent Flat-Laying</p>
                      </div>
                      <div>
                        <span className="text-xl sm:text-2xl font-bold text-[#1C1917]">100% Acid-Free</span>
                        <p className="text-[11px] text-[#78350F] font-sans mt-0.5">Munken Cream Stock</p>
                      </div>
                      <div>
                        <span className="text-xl sm:text-2xl font-bold text-[#9A3412]">Signed Firsts</span>
                        <p className="text-[11px] text-[#78350F] font-sans mt-0.5">Author Verified Vault</p>
                      </div>
                    </div>
                  </div>

                  {/* Hero Visual Card */}
                  <div className="lg:col-span-5 relative">
                    <div className="aspect-[3/4] max-w-sm mx-auto rounded-[36px] overflow-hidden shadow-2xl border-4 border-white bg-[#FAF7F2] relative group">
                      <img
                        src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=900&auto=format&fit=crop&q=80"
                        alt="The Architecture of Solitude"
                        className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/75 via-transparent to-transparent" />

                      <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white">
                        <div>
                          <span className="text-xs font-bold uppercase tracking-widest text-[#FBBF24]">
                            Curator's Staff Favorite
                          </span>
                          <h4 className="text-lg font-bold">The Architecture of Solitude</h4>
                        </div>
                        <button
                          onClick={() => handleSelectProduct(bookItems[0])}
                          className="p-3 bg-[#FAF7F2] hover:bg-white text-[#1C1917] rounded-xl transition cursor-pointer font-bold shadow-lg"
                        >
                          <ChevronRight size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* FEATURED VOLUMES */}
            <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-left">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-[#E7DFD5] pb-6">
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#9A3412] font-bold">
                    Independent Literary Press
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-black text-[#1C1917] mt-1">
                    Featured Front Stacks
                  </h2>
                </div>

                <button
                  onClick={() => {
                    setActivePage("stacks");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#9A3412] hover:underline cursor-pointer font-sans"
                >
                  <span>Explore Entire Library ({bookItems.length} volumes)</span>
                  <ArrowRight size={14} />
                </button>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {bookItems.slice(0, 4).map((item) => (
                  <ProductCard
                    key={item._id}
                    product={item}
                    onSelectProduct={handleSelectProduct}
                    onAddToCart={handleAddToCart}
                    onLookInside={(book) => setReadingExcerptBook(book)}
                  />
                ))}
              </div>
            </section>

            {/* INTERACTIVE SALON CALLOUT */}
            <section className="py-16 bg-[#F3EDE3] border-y border-[#E7DFD5]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
                  <span className="text-xs uppercase tracking-widest text-[#9A3412] font-bold">
                    The Literary Salon
                  </span>
                  <h2 className="text-3xl font-black text-[#1C1917]">
                    Bibliophile Reading Tools
                  </h2>
                  <p className="text-xs text-[#574B40] font-sans">
                    Read first chapter excerpts, estimate your completion timelines, and join our monthly curated book club.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                  <div
                    onClick={() => setReadingExcerptBook(bookItems[0])}
                    className="p-6 rounded-3xl bg-white border border-[#E7DFD5] hover:border-[#78350F] transition cursor-pointer group shadow-sm"
                  >
                    <BookOpen size={28} className="text-[#9A3412] mb-4 group-hover:scale-110 transition duration-300" />
                    <h3 className="text-lg font-bold text-[#1C1917] group-hover:text-[#9A3412]">"Look Inside" Reader</h3>
                    <p className="text-xs text-[#574B40] mt-2 leading-relaxed font-sans">
                      Preview the first chapter in our adjustable digital reading drawer with Parchment, Sepia, and Night paper modes.
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-xs text-[#9A3412] font-bold font-sans">
                      Open Sample Chapter <ArrowRight size={13} />
                    </span>
                  </div>

                  <div
                    onClick={() => {
                      setActivePage("calculator");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="p-6 rounded-3xl bg-white border border-[#E7DFD5] hover:border-[#78350F] transition cursor-pointer group shadow-sm"
                  >
                    <Clock size={28} className="text-[#9A3412] mb-4 group-hover:scale-110 transition duration-300" />
                    <h3 className="text-lg font-bold text-[#1C1917] group-hover:text-[#9A3412]">Reading Speed Lab</h3>
                    <p className="text-xs text-[#574B40] mt-2 leading-relaxed font-sans">
                      Calculate exact days to finish any volume based on your words-per-minute pace and daily reading habit.
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-xs text-[#9A3412] font-bold font-sans">
                      Calculate Reading Pace <ArrowRight size={13} />
                    </span>
                  </div>

                  <div
                    onClick={() => {
                      setActivePage("book-club");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="p-6 rounded-3xl bg-white border border-[#E7DFD5] hover:border-[#78350F] transition cursor-pointer group shadow-sm"
                  >
                    <Coffee size={28} className="text-[#9A3412] mb-4 group-hover:scale-110 transition duration-300" />
                    <h3 className="text-lg font-bold text-[#1C1917] group-hover:text-[#9A3412]">The Book Club Box</h3>
                    <p className="text-xs text-[#574B40] mt-2 leading-relaxed font-sans">
                      Receive one hand-selected novel each month along with exclusive author letters and private salon invitations.
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-xs text-[#9A3412] font-bold font-sans">
                      Explore Book Club <ArrowRight size={13} />
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {/* ================= VIEW 2: LIBRARY STACKS (CATALOG) ================= */}
        {activePage === "stacks" && (
          <Product
            products={bookItems}
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
            onLookInside={(book) => setReadingExcerptBook(book)}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedGenre={selectedGenre}
            setSelectedGenre={setSelectedGenre}
          />
        )}

        {/* ================= VIEW 3: READING SPEED LAB ================= */}
        {activePage === "calculator" && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 text-left">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs uppercase tracking-[0.2em] text-[#9A3412] font-bold">
                Bibliophile Habits
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-[#1C1917]">
                Reading Speed & Goal Calculator
              </h1>
              <p className="text-xs sm:text-sm text-[#574B40] font-sans">
                Determine how quickly you will complete "The Architecture of Solitude" (105,000 words) based on your daily reading habits.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-[#E7DFD5] space-y-8 shadow-md">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-[#1C1917] font-sans">
                    <span>Reading Speed: {readingSpeedWpm} Words Per Minute</span>
                    <span className="text-[#78350F]">{readingSpeedWpm > 300 ? "Fast Reader" : readingSpeedWpm < 200 ? "Unhurried Pace" : "Average"}</span>
                  </div>
                  <input
                    type="range"
                    min="150"
                    max="450"
                    step="25"
                    value={readingSpeedWpm}
                    onChange={(e) => setReadingSpeedWpm(Number(e.target.value))}
                    className="w-full accent-[#9A3412] cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-[#1C1917] font-sans">
                    <span>Daily Reading Time: {dailyReadingMins} Minutes/Day</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="120"
                    step="15"
                    value={dailyReadingMins}
                    onChange={(e) => setDailyReadingMins(Number(e.target.value))}
                    className="w-full accent-[#9A3412] cursor-pointer"
                  />
                </div>
              </div>

              {/* Output Result Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#E7DFD5] text-center">
                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E7DFD5] space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#78350F] block font-sans">Completion Time</span>
                  <span className="text-3xl font-black text-[#1C1917]">{calculatedDays} Days</span>
                  <p className="text-[10px] text-[#8C7A6B] font-sans">to finish the 412-page volume</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E7DFD5] space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#78350F] block font-sans">Pages Per Day</span>
                  <span className="text-3xl font-black text-[#1C1917]">{Math.round((dailyReadingMins * readingSpeedWpm) / 250)}</span>
                  <p className="text-[10px] text-[#8C7A6B] font-sans">average daily chapter load</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E7DFD5] space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#78350F] block font-sans">Annual Reading Goal</span>
                  <span className="text-3xl font-black text-[#9A3412]">{Math.round(365 / calculatedDays)} Books</span>
                  <p className="text-[10px] text-[#8C7A6B] font-sans">finished at this daily cadence</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= VIEW 4: THE BOOK CLUB MEMBERSHIP ================= */}
        {activePage === "book-club" && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 text-left">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs uppercase tracking-[0.2em] text-[#9A3412] font-bold">
                The Literary Society
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-[#1C1917]">
                Monthly Curated Book Club
              </h1>
              <p className="text-xs sm:text-sm text-[#574B40] font-sans">
                Receive one Smyth-sewn first edition novel every month with private author salon invitations and discussion marginalia.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-[#E7DFD5] space-y-6 shadow-md">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#E7DFD5] pb-6">
                <div>
                  <span className="text-xs font-bold text-[#9A3412] uppercase font-sans">Monthly Selection Box</span>
                  <h3 className="text-2xl font-bold text-[#1C1917]">Chapter & Verse Society Box</h3>
                  <p className="text-xs text-[#574B40] font-sans">Delivered automatically on the 1st of every month.</p>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-bold text-[#1C1917]">₹28.00</span>
                  <span className="text-xs text-[#78350F] block font-sans">/ month • Cancel anytime</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-sans text-[#574B40]">
                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E7DFD5] space-y-1">
                  <span className="font-bold text-[#1C1917] block font-serif">1x Clothbound Novel</span>
                  <p>Specially bound first printing with archival dust jacket.</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E7DFD5] space-y-1">
                  <span className="font-bold text-[#1C1917] block font-serif">Curator Letterpress Note</span>
                  <p>Editorial essay and reading notes from our senior staff.</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E7DFD5] space-y-1">
                  <span className="font-bold text-[#1C1917] block font-serif">Private Live Author Salon</span>
                  <p>Quarterly live video discussions with visiting novelists.</p>
                </div>
              </div>

              <div className="pt-4 text-center">
                <button
                  onClick={() => {
                    handleAddToCart({
                      _id: "book-club-sub",
                      name: "Chapter & Verse Monthly Book Club Subscription",
                      price: 28.0,
                      image: bookItems[0].image,
                      format: "Monthly Subscription",
                    });
                  }}
                  className="px-8 py-3.5 bg-[#1C1917] hover:bg-[#292524] text-[#FAF7F2] rounded-2xl text-xs font-bold uppercase tracking-widest transition cursor-pointer shadow-lg"
                >
                  Join the Book Club Society
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= VIEW 5: RARE & SIGNED FIRSTS VAULT ================= */}
        {activePage === "rare-vault" && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 text-left">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs uppercase tracking-[0.2em] text-[#9A3412] font-bold">
                The Collector's Archive
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-[#1C1917]">
                Author-Signed First Editions Vault
              </h1>
              <p className="text-xs sm:text-sm text-[#574B40] font-sans">
                Numbered collector copies hand-signed on archival title pages. Certified authentic by Chapter & Verse Press.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookItems.map((b) => (
                <div
                  key={b._id}
                  onClick={() => handleSelectProduct(b)}
                  className="p-5 rounded-3xl bg-white border border-[#E7DFD5] hover:border-[#78350F] transition cursor-pointer space-y-4 shadow-sm group"
                >
                  <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-[#FAF7F2] border border-[#EFE9DF]">
                    <img src={getProductImage(b, b.image)} alt={b.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#9A3412] block">Certified First Edition</span>
                    <h4 className="font-bold text-base text-[#1C1917] line-clamp-1">{b.name}</h4>
                    <p className="text-xs text-[#78350F] italic">Signed by {b.author}</p>
                  </div>
                  <div className="pt-2 flex justify-between items-center border-t border-[#EFE9DF]">
                    <span className="font-bold text-sm text-[#1C1917]">₹{b.price + 25}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart({ ...b, name: `${b.name} (Signed Edition)`, price: b.price + 25 });
                      }}
                      className="px-3 py-1.5 bg-[#1C1917] hover:bg-[#292524] text-[#FAF7F2] rounded-lg text-xs font-bold transition"
                    >
                      Acquire Copy
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= VIEW 6: OFFERS & BUNDLES ================= */}
        {activePage === "offers" && (
          <Offer
            products={bookItems}
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
            onOpenStacks={() => {
              setActivePage("stacks");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        )}

        {/* ================= VIEW 7: PRODUCT DETAIL VIEW ================= */}
        {activePage === "product-detail" && selectedProduct && (
          <ProductDetails
            product={selectedProduct}
            onBack={() => {
              setActivePage("stacks");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onAddToCart={handleAddToCart}
            onLookInside={(b) => setReadingExcerptBook(b)}
            relatedProducts={bookItems}
            onSelectProduct={handleSelectProduct}
          />
        )}
      </main>

      {/* ================= 3. "LOOK INSIDE" FIRST CHAPTER DRAWER MODAL ================= */}
      {readingExcerptBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div
            className={`w-full max-w-2xl max-h-[85vh] rounded-3xl shadow-2xl flex flex-col justify-between overflow-hidden border transition-colors ${
              readerTheme === "parchment"
                ? "bg-[#FAF7F2] text-[#1C1917] border-[#E7DFD5]"
                : readerTheme === "sepia"
                ? "bg-[#F4ECD8] text-[#423629] border-[#D8C7A5]"
                : "bg-[#18181B] text-[#E4E4E7] border-zinc-800"
            }`}
          >
            {/* Header */}
            <div className="p-5 border-b border-black/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-sans font-bold text-[#9A3412] tracking-wider block">
                  First Chapter Sample
                </span>
                <h3 className="text-lg font-black">{readingExcerptBook.name}</h3>
                <span className="text-xs italic opacity-80">By {readingExcerptBook.author}</span>
              </div>

              <div className="flex items-center gap-2">
                {/* Theme toggles */}
                <div className="flex items-center bg-black/5 rounded-xl p-1 text-xs">
                  <button
                    onClick={() => setReaderTheme("parchment")}
                    className={`px-2 py-1 rounded-lg ${readerTheme === "parchment" ? "bg-white font-bold shadow-xs" : "opacity-70"}`}
                  >
                    Parchment
                  </button>
                  <button
                    onClick={() => setReaderTheme("sepia")}
                    className={`px-2 py-1 rounded-lg ${readerTheme === "sepia" ? "bg-[#E6D7BA] font-bold shadow-xs" : "opacity-70"}`}
                  >
                    Sepia
                  </button>
                  <button
                    onClick={() => setReaderTheme("night")}
                    className={`px-2 py-1 rounded-lg ${readerTheme === "night" ? "bg-zinc-700 text-white font-bold" : "opacity-70"}`}
                  >
                    Night
                  </button>
                </div>

                <button
                  onClick={() => setReadingExcerptBook(null)}
                  className="p-2 rounded-xl hover:bg-black/10 transition cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Reading Excerpt Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-4 font-serif leading-relaxed text-sm sm:text-base">
              <span className="text-xs uppercase font-sans font-bold tracking-widest text-[#9A3412] block">
                Chapter I
              </span>
              <p className="first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:text-[#9A3412]">
                {readingExcerptBook.excerpt || readingExcerptBook.description}
              </p>
              <p className="opacity-90">
                The library lamp flickered against the mahogany paneling, casting long shadows across forty rows of bound parchment. Outside, the cathedral bells began their midnight cadence, twelve solemn tolls that seemed to hang suspended in the cool autumn air.
              </p>
              <p className="opacity-90">
                He had traveled twelve hundred leagues through storm and mountain pass for this single manuscript. The ink was faded, but the marginalia in the author's own hand remained untouched—a quiet testament across three hundred unhurried years.
              </p>
            </div>

            {/* Footer actions */}
            <div className="p-5 border-t border-black/10 flex items-center justify-between">
              <span className="text-xs opacity-75 font-sans">
                Enjoyed the excerpt? Order the clothbound hardcover edition today.
              </span>
              <button
                onClick={() => {
                  handleAddToCart(readingExcerptBook);
                  setReadingExcerptBook(null);
                }}
                className="px-4 py-2 bg-[#1C1917] hover:bg-[#292524] text-white rounded-xl text-xs font-bold transition shadow cursor-pointer font-serif"
              >
                Acquire Volume • ₹{readingExcerptBook.price}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= 4. FOOTER ================= */}
      <Footer
        brandName={brandName}
        brandLogo={brandLogo}
        brandPhone={brandPhone}
        brandEmail={brandEmail}
        brandAddress={brandAddress}
        onNavigate={(page, genre = null) => {
          if (genre) setSelectedGenre(genre);
          setActivePage(page);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />

      {/* ================= 5. BOOK BAG DRAWER ================= */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
        themeColors={{ primary: "#1C1917" }}
      />
    </div>
  );
}
