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
  Phone,
  Mail,
  MapPin,
  Plus,
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

export default function BookStoreTemplate({
  business = {},
  products = [],
  categories = [],
  offers = [],
  reviews = [],
  customization = {},
}) {
  // Navigation: "home" | "stacks" | "book-club" | "rare-vault" | "calculator" | "product-detail"
  const [activePage, setActivePage] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);

  // Search & Filters
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");

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
      description: "A sweeping multi-generational saga exploring memory, exile, and architectural marvels along the Danube.",
      excerpt:
        "The train pulled into the station at dawn, when the morning mist still clung like spider silk to the rusted iron girders. He watched the river through the cracked glass—grey, vast, and indifferent. For forty years he had carried the blueprint in his coat pocket, folded until the paper felt as soft as worn linen.",
      inStock: true,
    },
    {
      _id: "book-2",
      name: "Philosophy of Quiet Moments",
      author: "Marcus Lindqvist",
      price: 22.5,
      compareAtPrice: 28.0,
      format: "Paperback Edition",
      genre: "Philosophy",
      pages: 256,
      wordCount: 64000,
      rating: 4.9,
      reviewCount: 114,
      badge: "Indie Bestseller",
      image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=900&auto=format&fit=crop&q=80",
      description: "Reflections on mindfulness, solitude, and finding stillness amidst the hyper-connected digital landscape.",
      excerpt:
        "Silence is not the absence of sound, but the presence of attention. When we surrender our constant impulse to categorize and respond, the world offers up a texture so dense that a single afternoon can feel like an entire season.",
      inStock: true,
    },
    {
      _id: "book-3",
      name: "Modernist Typography & The Grid",
      author: "Jan Van Der Beek",
      price: 45.0,
      compareAtPrice: 55.0,
      format: "Deluxe Hardcover",
      genre: "Art & Design",
      pages: 320,
      wordCount: 78000,
      rating: 5.0,
      reviewCount: 42,
      badge: "Collector's Press",
      image: "https://images.unsplash.com/photo-1532012164546-f432f2e3777a?w=900&auto=format&fit=crop&q=80",
      description: "A lavishly illustrated historical monograph on Swiss graphic design, typographic proportions, and twentieth-century type foundries.",
      excerpt:
        "Order creates freedom. The grid is not a cage, but a musical stave upon which the eye dances. Every point of white space is deliberate tension; every kerning decision is a breath held between syllables.",
      inStock: true,
    },
    {
      _id: "book-4",
      name: "Conversations with Astronomers",
      author: "Dr. Sarah Sterling",
      price: 26.0,
      compareAtPrice: 32.0,
      format: "Clothbound Hardcover",
      genre: "Science",
      pages: 348,
      wordCount: 88000,
      rating: 4.8,
      reviewCount: 57,
      badge: "Editor's Choice",
      image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=900&auto=format&fit=crop&q=80",
      description: "Essays on deep space observatories, cosmic dust, and the human quest to map the edges of the visible universe.",
      excerpt:
        "Look at the light from the Andromeda galaxy. It began its voyage toward your retina two and a half million years ago, when our earliest ancestors were only beginning to chip flints on the African savannah.",
      inStock: true,
    },
  ];

  const bookList = products.length > 0 ? products : defaultBooks;

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
    "+1 (800) 442-BOOK";
  const brandEmail =
    business?.email ||
    business?.businessEmail ||
    business?.contactEmail ||
    "curator@chapterversebooks.com";

  const rawAddr = business?.address || business?.registered_business_address;
  const brandAddress =
    typeof rawAddr === "string"
      ? rawAddr
      : rawAddr && typeof rawAddr === "object"
      ? [rawAddr.street, rawAddr.addressLine2, rawAddr.city, rawAddr.state, rawAddr.postalCode, rawAddr.country]
          .filter(Boolean)
          .join(", ")
      : "142 Mercer Street, Soho, New York, NY 10012";

  // Filtered books
  const filteredBooks = useMemo(() => {
    return bookList
      .filter((b) => {
        if (selectedGenre !== "all") {
          const g = (b.genre || "").toLowerCase();
          const f = (b.format || "").toLowerCase();
          const filter = selectedGenre.toLowerCase();
          if (!g.includes(filter) && !f.includes(filter)) return false;
        }

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = (b.name || "").toLowerCase().includes(q);
          const matchAuthor = (b.author || "").toLowerCase().includes(q);
          const matchDesc = (b.description || "").toLowerCase().includes(q);
          if (!matchTitle && !matchAuthor && !matchDesc) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return Number(a.price) - Number(b.price);
        if (sortBy === "price-desc") return Number(b.price) - Number(a.price);
        if (sortBy === "rating") return (b.rating || 5) - (a.rating || 5);
        return 0;
      });
  }, [bookList, selectedGenre, searchQuery, sortBy]);

  const handleAddToCart = (book, qty = 1) => {
    if (isOutOfStock(book)) {
      toast.error(`Sorry, "${book.name}" is currently out of stock!`);
      return;
    }
    dispatch(addToCart({ product: book, quantity: qty }));
    toast.success(`"${book.name}" added to your Reading Bag! 📚`);
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

  // Reading calculations for active or first book
  const calcBook = readingExcerptBook || bookList[0];
  const words = calcBook?.wordCount || 85000;
  const totalMins = Math.round(words / readingSpeedWpm);
  const totalHours = (totalMins / 60).toFixed(1);
  const daysToFinish = Math.ceil(totalMins / dailyReadingMins);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#FDFBF7] text-[#1E1B18] antialiased selection:bg-amber-100 selection:text-amber-950">
      {/* ================= 1. HERITAGE LITERARY TOP BAR ================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#1E1B18]/10 shadow-2xs">
        <div className="bg-[#1E1B18] text-[#FDFBF7] text-[11px] py-2 px-4">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-medium tracking-wide">
              <Bookmark size={13} className="text-amber-300" />
              <span>
                <strong>Independent Press Sanctuary:</strong> Complimentary archival letterpress bookmark & custom bookplate with every order.
              </span>
            </div>
            <div className="hidden md:flex items-center gap-6 text-[11px] font-medium text-amber-200">
              <span className="flex items-center gap-1.5">
                <Award size={14} className="text-amber-400" /> Signed & First Editions Guaranteed Authentic
              </span>
              <a href={`tel:${brandPhone}`} className="hover:text-white transition flex items-center gap-1">
                <Phone size={13} /> {brandPhone}
              </a>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
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
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#3D352E] to-[#1E1B18] text-amber-200 flex items-center justify-center shadow-md group-hover:scale-105 transition duration-300">
                <BookOpen size={22} />
              </div>
            )}
            <div className="space-y-0.5 text-left">
              <span className="text-xl sm:text-2xl font-serif font-black tracking-tight text-[#1E1B18] block leading-none">
                {brandName}
              </span>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#9A3412] font-bold block">
                Independent Press & Rare Books
              </span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8 text-[12px] font-bold uppercase tracking-wider text-[#3D352E]">
            {[
              { id: "home", label: "The Stacks" },
              { id: "stacks", label: "Literary Catalog" },
              { id: "book-club", label: "Monthly Book Club" },
              { id: "calculator", label: "Reading Time Lab" },
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
                    isActive ? "text-[#1E1B18] font-black" : "hover:text-[#9A3412] text-[#6B5E52]"
                  }`}
                >
                  <span>{tab.label}</span>
                  {isActive && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#9A3412] rounded-full" />}
                </button>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setActivePage("book-club");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#F5EFE6] text-[#3D352E] hover:bg-[#EAE0D3] font-bold text-xs border border-[#E0D5C5] transition cursor-pointer"
            >
              <Coffee size={14} className="text-[#9A3412]" />
              <span>Join Book Club</span>
            </button>

            <button
              onClick={() => setCartOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-[#1E1B18] text-white hover:bg-[#3D352E] transition cursor-pointer flex items-center gap-2 font-bold text-xs shadow-md shadow-stone-900/10"
            >
              <ShoppingBag size={17} className="text-amber-200" />
              <span className="hidden sm:inline">Book Bag</span>
              <span className="bg-[#9A3412] text-white text-[11px] font-black min-w-[20px] h-5 px-1 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ================= 2. MAIN CONTENT ================= */}
      <main className="flex-1">
        {/* ================= PAGE 1: HOME ================= */}
        {activePage === "home" && (
          <>
            {/* HERO SECTION */}
            <section className="relative overflow-hidden bg-gradient-to-b from-[#F5EFE6] via-[#FDFBF7] to-[#FDFBF7] pt-12 pb-20 md:pt-18 md:pb-24 border-b border-[#1E1B18]/5">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  <div className="lg:col-span-7 space-y-6 text-left">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E0D5C5] text-[#3D352E] text-xs font-semibold shadow-2xs">
                      <Sparkles size={14} className="text-[#9A3412]" />
                      <span>Letterpress Bound • Curated by Resident Bibliophiles</span>
                    </div>

                    <h1 className="text-4xl sm:text-6xl font-serif font-black tracking-tight text-[#1E1B18] leading-[1.08]">
                      Books that Linger on the Mind and Nightstand.
                    </h1>

                    <p className="text-sm sm:text-base text-[#6B5E52] leading-relaxed max-w-xl font-normal">
                      Clothbound hardcovers, overlooked translated fiction, and independent literary monographs. Every copy is wrapped in acid-free tissue paper with a signed reading card.
                    </p>

                    <div className="flex flex-wrap gap-4 pt-2">
                      <button
                        onClick={() => {
                          setActivePage("stacks");
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="px-8 py-4 bg-[#1E1B18] hover:bg-[#3D352E] text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition shadow-lg flex items-center gap-2.5 cursor-pointer transform hover:-translate-y-0.5"
                      >
                        <BookOpen size={17} className="text-amber-300" />
                        <span>Browse Curated Stacks</span>
                      </button>

                      <button
                        onClick={() => {
                          setActivePage("book-club");
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="px-7 py-4 bg-white border border-[#D5C7B5] hover:border-[#9A3412] text-[#1E1B18] rounded-2xl text-xs font-bold uppercase tracking-wider transition flex items-center gap-2 cursor-pointer"
                      >
                        <Coffee size={16} className="text-[#9A3412]" />
                        <span>Monthly Book Society</span>
                      </button>
                    </div>
                  </div>

                  {/* Hero Book Cover Visual */}
                  <div className="lg:col-span-5 relative">
                    <div className="aspect-[4/3] rounded-[36px] overflow-hidden shadow-2xl border-8 border-white bg-[#F5EFE6]">
                      <img
                        src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=900&auto=format&fit=crop&q=80"
                        alt="Chapter & Verse Bookshop"
                        className="w-full h-full object-cover transform hover:scale-105 transition duration-700"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* CURATOR'S PICK STACKS */}
            <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-left">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-[#1E1B18]/10 pb-6">
                <div>
                  <span className="text-xs uppercase tracking-wider text-[#9A3412] font-bold">Curator's Nightstand</span>
                  <h2 className="text-3xl sm:text-4xl font-serif font-black text-[#1E1B18]">Staff Recommendations</h2>
                  <p className="text-xs sm:text-sm text-[#6B5E52] mt-1">Click "Read Excerpt" to test the opening pages right in your browser.</p>
                </div>
                <button
                  onClick={() => {
                    setActivePage("stacks");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1E1B18] hover:text-[#9A3412] hover:underline cursor-pointer"
                >
                  <span>Explore Full Stacks ({bookList.length} titles)</span>
                  <ArrowRight size={14} />
                </button>
              </div>

              {/* Books Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {bookList.map((book) => {
                  const outOfStock = isOutOfStock(book);
                  return (
                    <div
                      key={book._id}
                      onClick={() => {
                        setSelectedProduct(book);
                        setActivePage("product-detail");
                      }}
                      className="bg-white rounded-3xl border border-[#1E1B18]/10 p-5 space-y-4 flex flex-col justify-between shadow-xs hover:shadow-2xl transition duration-300 cursor-pointer group relative"
                    >
                      <div className="space-y-3">
                        <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-[#F5EFE6] relative">
                          <img
                            src={getProductImage(book, book.image)}
                            alt={book.name}
                            className="w-full h-full object-cover group-hover:scale-108 transition duration-500"
                          />
                          {book.badge && (
                            <span className="absolute top-3 left-3 bg-[#1E1B18]/90 text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full">
                              {book.badge}
                            </span>
                          )}

                          {/* "Look Inside" Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setReadingExcerptBook(book);
                            }}
                            className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-white/95 text-[#1E1B18] font-bold text-[11px] flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition shadow-md hover:bg-white"
                          >
                            <Eye size={13} />
                            <span>Read Excerpt</span>
                          </button>
                        </div>

                        <div className="flex items-center justify-between text-[11px] font-bold">
                          <span className="text-[#9A3412] uppercase tracking-wider">{book.genre}</span>
                          <span className="text-[#6B5E52] flex items-center gap-1">
                            <Star size={12} className="text-amber-500 fill-amber-500" />
                            {book.rating || 5.0} ({book.reviewCount || 30})
                          </span>
                        </div>

                        <h4 className="text-base font-serif font-bold text-[#1E1B18] line-clamp-1 group-hover:text-[#9A3412] transition">
                          {book.name}
                        </h4>
                        <span className="text-xs text-[#6B5E52] font-medium block">by {book.author}</span>
                        <p className="text-xs text-[#6B5E52] line-clamp-2 leading-relaxed">{book.description}</p>
                      </div>

                      <div className="pt-3 flex justify-between items-center border-t border-[#F5EFE6]">
                        <span className="text-lg font-serif font-black text-[#1E1B18]">
                          ₹{Number(book.price).toFixed(2)}
                        </span>

                        {outOfStock ? (
                          <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-xl">
                            Sold Out
                          </span>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(book);
                            }}
                            className="px-4 py-2 bg-[#1E1B18] hover:bg-[#3D352E] text-white rounded-xl text-xs font-bold cursor-pointer transition shadow-xs flex items-center gap-1"
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

        {/* ================= PAGE 2: LITERARY CATALOG ================= */}
        {activePage === "stacks" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10 text-left">
            <div className="space-y-4 border-b border-[#1E1B18]/10 pb-6">
              <span className="text-xs uppercase tracking-wider text-[#9A3412] font-bold">The Bookshop Library</span>
              <h1 className="text-3xl sm:text-4xl font-serif font-black text-[#1E1B18]">Search & Filter Editions</h1>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pt-2">
                <div className="md:col-span-6 relative">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by title, author, or literary theme..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-[#D5C7B5] text-xs text-[#1E1B18] focus:outline-none"
                  />
                </div>

                <div className="md:col-span-6 flex flex-wrap gap-2 items-center">
                  {["all", "Literary Fiction", "Philosophy", "Art & Design", "Science"].map((g) => (
                    <button
                      key={g}
                      onClick={() => setSelectedGenre(g)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition border ${
                        selectedGenre.toLowerCase() === g.toLowerCase()
                          ? "bg-[#1E1B18] text-white border-[#1E1B18]"
                          : "bg-white text-[#3D352E] border-[#D5C7B5] hover:bg-[#F5EFE6]"
                      }`}
                    >
                      {g === "all" ? "All Genres" : g}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredBooks.map((book) => (
                <div
                  key={book._id}
                  onClick={() => {
                    setSelectedProduct(book);
                    setActivePage("product-detail");
                  }}
                  className="bg-white rounded-3xl border border-[#1E1B18]/10 p-5 space-y-3 flex flex-col justify-between shadow-xs hover:shadow-xl transition cursor-pointer group"
                >
                  <div className="space-y-3">
                    <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-[#F5EFE6] relative">
                      <img src={getProductImage(book, book.image)} alt={book.name} className="w-full h-full object-cover" />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setReadingExcerptBook(book);
                        }}
                        className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-white/95 text-[#1E1B18] font-bold text-[11px] flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition shadow-md"
                      >
                        <Eye size={13} /> Read
                      </button>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-[#9A3412] tracking-wider block">{book.genre}</span>
                    <h4 className="text-base font-serif font-bold text-[#1E1B18] line-clamp-1">{book.name}</h4>
                    <span className="text-xs text-[#6B5E52] block">by {book.author}</span>
                  </div>

                  <div className="pt-3 flex justify-between items-center border-t border-[#F5EFE6]">
                    <span className="text-lg font-serif font-black text-[#1E1B18]">₹{Number(book.price).toFixed(2)}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(book);
                      }}
                      className="px-4 py-2 bg-[#1E1B18] text-white rounded-xl text-xs font-bold"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= PAGE 3: MONTHLY BOOK CLUB ================= */}
        {activePage === "book-club" && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 text-left">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs uppercase tracking-[0.2em] text-[#9A3412] font-bold">Literary Fellowship</span>
              <h1 className="text-3xl sm:text-4xl font-serif font-black text-[#1E1B18]">The Bibliophile Society</h1>
              <p className="text-xs sm:text-sm text-[#6B5E52]">
                A hardcover book curated monthly by our master readers, accompanied by author commentary essays, letterpress bookmarks, and access to private salon discussions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "The Paper & Ink Society",
                  price: 799,
                  desc: "1 Hand-selected contemporary fiction paperback, letterpress art card, and discussion questions.",
                },
                {
                  name: "The Folio Collector",
                  price: 1499,
                  desc: "1 First-edition clothbound hardcover, author signed bookplate, and invitations to monthly virtual author salons.",
                  popular: true,
                },
                {
                  name: "The Rare & Archive Vault",
                  price: 2499,
                  desc: "Numbered limited pressing with deckled edges, archival slipcase, and rare literary monograph quarterly.",
                },
              ].map((tier) => (
                <div
                  key={tier.name}
                  className={`bg-white rounded-3xl p-8 space-y-6 flex flex-col justify-between text-left relative ${
                    tier.popular ? "border-2 border-[#1E1B18] shadow-2xl" : "border border-[#1E1B18]/10 shadow-xs"
                  }`}
                >
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold uppercase text-[#9A3412] bg-amber-50 px-2.5 py-1 rounded-full">
                      Free Shipping Nationwide
                    </span>
                    <h3 className="text-xl font-serif font-bold text-[#1E1B18]">{tier.name}</h3>
                    <p className="text-xs text-[#6B5E52] leading-relaxed">{tier.desc}</p>
                  </div>

                  <div className="pt-4 border-t border-[#F5EFE6] space-y-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-serif font-black text-[#1E1B18]">₹{tier.price}</span>
                      <span className="text-xs text-[#6B5E52]">/ month</span>
                    </div>

                    <button
                      onClick={() =>
                        handleAddToCart({
                          _id: tier.name,
                          name: `${tier.name} (Monthly Subscription)`,
                          price: tier.price,
                          image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600",
                          description: tier.desc,
                        })
                      }
                      className="w-full py-3.5 bg-[#1E1B18] hover:bg-[#3D352E] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition"
                    >
                      Join Society
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= PAGE 4: READING TIME CALCULATOR ================= */}
        {activePage === "calculator" && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 text-left">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs uppercase tracking-[0.2em] text-[#9A3412] font-bold">Pacing Science</span>
              <h1 className="text-3xl sm:text-4xl font-serif font-black text-[#1E1B18]">Reading Pace & Schedule Calculator</h1>
              <p className="text-xs sm:text-sm text-[#6B5E52]">
                Find out exactly how many days it will take you to finish "{calcBook.name}" based on your natural reading rhythm.
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#1E1B18]/10 space-y-6 shadow-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-[#1E1B18]">
                    <span>Reading Speed: {readingSpeedWpm} Words / Min</span>
                    <span>{readingSpeedWpm <= 200 ? "Contemplative" : readingSpeedWpm <= 300 ? "Average Reader" : "Speed Reader"}</span>
                  </div>
                  <input
                    type="range"
                    min="150"
                    max="450"
                    step="10"
                    value={readingSpeedWpm}
                    onChange={(e) => setReadingSpeedWpm(Number(e.target.value))}
                    className="w-full accent-[#1E1B18] cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-[#1E1B18]">
                    <span>Daily Reading Time: {dailyReadingMins} Minutes</span>
                    <span>{(dailyReadingMins / 60).toFixed(1)} Hours/Day</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="120"
                    step="5"
                    value={dailyReadingMins}
                    onChange={(e) => setDailyReadingMins(Number(e.target.value))}
                    className="w-full accent-[#1E1B18] cursor-pointer"
                  />
                </div>
              </div>

              {/* Output Stats */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#F5EFE6]">
                <div className="p-4 rounded-2xl bg-[#F5EFE6] space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#9A3412] block">Total Reading Time</span>
                  <span className="text-2xl font-serif font-black text-[#1E1B18]">{totalHours} Hours</span>
                  <p className="text-[10px] text-[#6B5E52]">({totalMins} minutes total)</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#F5EFE6] space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#9A3412] block">Estimated Finish In</span>
                  <span className="text-2xl font-serif font-black text-[#1E1B18]">{daysToFinish} Days</span>
                  <p className="text-[10px] text-[#6B5E52]">at {dailyReadingMins} mins / evening</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#F5EFE6] space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#9A3412] block">Volume Metric</span>
                  <span className="text-2xl font-serif font-black text-[#1E1B18]">{calcBook.pages} Pages</span>
                  <p className="text-[10px] text-[#6B5E52]">{words.toLocaleString()} Words</p>
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
              primary: "#1E1B18",
              secondary: "#3D352E",
              text: "#1E1B18",
              background: "#FDFBF7",
              cardBg: "#FFFFFF",
            }}
            business={business}
            relatedProducts={bookList}
            onSelectProduct={(p) => {
              setSelectedProduct(p);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        )}
      </main>

      {/* ================= 3. "LOOK INSIDE" READING EXCERPT DRAWER ================= */}
      {readingExcerptBook && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className={`rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border max-h-[85vh] overflow-y-auto text-left relative transition ${
              readerTheme === "parchment"
                ? "bg-[#FFFDF9] text-[#1E1B18] border-[#E0D5C5]"
                : readerTheme === "sepia"
                ? "bg-[#F4ECD8] text-[#3D2C1E] border-[#D5C2A5]"
                : "bg-[#18181B] text-[#F4F4F5] border-zinc-800"
            }`}
          >
            <button
              onClick={() => setReadingExcerptBook(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-black/10 transition cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="space-y-2 border-b border-black/10 pb-4">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#9A3412]">
                Reading Excerpt • Chapter One
              </span>
              <h3 className="text-2xl font-serif font-bold">{readingExcerptBook.name}</h3>
              <p className="text-xs opacity-75">by {readingExcerptBook.author}</p>

              {/* Reader Controls */}
              <div className="flex items-center gap-4 pt-2 text-xs">
                <span className="font-bold opacity-75">Theme:</span>
                <div className="flex gap-2">
                  {[
                    { id: "parchment", label: "Parchment" },
                    { id: "sepia", label: "Sepia" },
                    { id: "night", label: "Night" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setReaderTheme(t.id)}
                      className={`px-3 py-1 rounded-lg text-[11px] font-bold border ${
                        readerTheme === t.id ? "border-black font-black" : "opacity-60"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Excerpt Paragraphs */}
            <div className={`space-y-4 font-serif leading-relaxed ${readerFontSize}`}>
              <p className="first-letter:text-4xl first-letter:font-black first-letter:float-left first-letter:mr-2">
                {readingExcerptBook.excerpt}
              </p>
              <p className="opacity-90">
                The wind rose from the east, carrying the faint, metallic scent of ozone and crushed birch leaves. Somewhere down in the valley, an iron bell tolled six times, its vibrations dissipating through the timberline before reaching the high stone parapets.
              </p>
              <p className="opacity-90">
                To continue reading, order this edition in your preferred format. Dispatched with our signature letterpress bookmark and archival ribbon.
              </p>
            </div>

            <div className="pt-4 border-t border-black/10 flex justify-between items-center">
              <span className="text-xl font-serif font-black">₹{Number(readingExcerptBook.price).toFixed(2)}</span>
              <button
                onClick={() => {
                  handleAddToCart(readingExcerptBook);
                  setReadingExcerptBook(null);
                }}
                className="px-6 py-2.5 bg-[#1E1B18] text-white rounded-xl text-xs font-bold hover:bg-[#3D352E]"
              >
                Add Edition to Bag
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= 4. FOOTER ================= */}
      <footer className="bg-[#1E1B18] text-[#FDFBF7] pt-16 pb-12 text-left text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                {brandLogo ? (
                  <img src={brandLogo} alt={brandName} className="h-8 w-auto max-w-[130px] object-contain rounded brightness-0 invert" />
                ) : (
                  <BookOpen size={22} className="text-amber-300" />
                )}
                <span className="text-base font-serif font-black tracking-tight text-white uppercase">{brandName}</span>
              </div>
              <p className="text-amber-200/70 leading-relaxed text-[11px] max-w-xs">
                Independent press and antiquarian book sanctuary. Specializing in translated literature, architectural monographs, and clothbound editions.
              </p>
            </div>

            <div className="space-y-2">
              <h5 className="font-bold text-white uppercase text-[10px] tracking-wider">The Stacks</h5>
              <p onClick={() => { setSelectedGenre("Literary Fiction"); setActivePage("stacks"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="hover:text-white cursor-pointer transition text-[11px]">Translated Literary Fiction</p>
              <p onClick={() => { setSelectedGenre("Philosophy"); setActivePage("stacks"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="hover:text-white cursor-pointer transition text-[11px]">Philosophy & Solitude</p>
              <p onClick={() => { setSelectedGenre("Art & Design"); setActivePage("stacks"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="hover:text-white cursor-pointer transition text-[11px]">Modernist Typography Press</p>
            </div>

            <div className="space-y-2">
              <h5 className="font-bold text-white uppercase text-[10px] tracking-wider">Societies & Tools</h5>
              <p onClick={() => { setActivePage("book-club"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="hover:text-white cursor-pointer transition text-[11px]">The Bibliophile Society</p>
              <p onClick={() => { setActivePage("calculator"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="hover:text-white cursor-pointer transition text-[11px]">Reading Speed Calculator</p>
            </div>

            <div className="space-y-2">
              <h5 className="font-bold text-white uppercase text-[10px] tracking-wider">Bookshop Concierge</h5>
              <p className="text-white font-bold">{brandPhone}</p>
              <p className="text-amber-300 text-[11px]">{brandEmail}</p>
              {brandAddress && <p className="text-amber-200/70 text-[11px] pt-1">📍 {brandAddress}</p>}
            </div>
          </div>

          <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row justify-between items-center text-[10px] text-amber-200/60 gap-2">
            <p>© {new Date().getFullYear()} {brandName}. Hand-assembled with acid-free archival standards.</p>
            <p>Member of Independent Online Booksellers Association</p>
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
        themeColors={{ primary: "#1E1B18" }}
      />
    </div>
  );
}
