import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Search,
  ShoppingCart,
  Heart,
  User,
  Tag,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Grid,
  MapPin,
  Clock,
  Sparkles,
  Mic,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../redux/actions/authActions";
import TopBar from "./TopBar";
import { fetchCategories } from "../api/categoryService";
import { getUserLocation } from "../utils/location";
import ilumaIcon from "../assests/iluma_icon.png";

function Navbar() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Enforce Light Theme Only
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.remove("dark");
      localStorage.removeItem("theme");
    }
  }, []);

  const { user, isAuthenticated } = useSelector((s) => s.auth);
  const cartItems = useSelector((s) => s.cart?.cartItems || []);
  const wishlistItems = useSelector((s) => s.wishlist?.items || []);
  const totalQty = cartItems.reduce((acc, i) => acc + (i.quantity || 0), 0);
  const wishlistQty = wishlistItems.length;
  const [categories, setCategories] = useState([]);
  const [location, setLocation] = useState(null);
  const catScrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const updateScrollIndicators = () => {
    if (!catScrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = catScrollRef.current;
    setShowLeftArrow(scrollLeft > 10);
    setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10);
  };

  const handleCategoryScroll = (direction) => {
    if (catScrollRef.current) {
      const scrollAmount = direction === "left" ? -260 : 260;
      catScrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  useEffect(() => {
    updateScrollIndicators();
    const el = catScrollRef.current;
    if (el) {
      el.addEventListener("scroll", updateScrollIndicators);
      window.addEventListener("resize", updateScrollIndicators);
    }
    return () => {
      if (el) el.removeEventListener("scroll", updateScrollIndicators);
      window.removeEventListener("resize", updateScrollIndicators);
    };
  }, [categories]);

  const getCategories = async () => {
    try {
      const res = await fetchCategories({
        businessType: "E-Commerce",
        isFeatured: true,
      });
      console.log("Fetched categories:", res.data);
      const list =
        res?.data || res?.categories || (Array.isArray(res) ? res : []);
      setCategories(list);
    } catch (err) {
      console.error("Failed to load categories:", err);
    }
  };
  const fetchLocation = async () => {
    try {
      const location = await getUserLocation();
      setLocation(location);
      console.log("User Location:", location);
    } catch (error) {
      console.log("Location permission denied:", error.message);
    }
  };
  useEffect(() => {
    getCategories();
    fetchLocation();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(
        `/products?search=${encodeURIComponent(searchTerm.trim())}&category=${encodeURIComponent(selectedCategory)}`,
      );
    }
  };

  const navLinks = [
    { name: "Fashion  ", path: "/products?category=Fashion" },
    { name: "Electronics", path: "/products?category=Electronics" },
    { name: "Home & Living", path: "/products?category=Home" },
    { name: "Beauty & Personal Care", path: "/products?category=Beauty" },
    { name: "Sports & Outdoors", path: "/products?category=Sports" },
    { name: "Books & Stationery", path: "/products?category=Books" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Announcement Bar */}
      <TopBar />

      {/* Main Header (Tier 1) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4 lg:gap-8">
          {/* Logo & Subtitle */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <img
              src={ilumaIcon}
              alt="ILUMAA Studio"
              className="w-10 h-10 object-contain rounded-xl shadow-xs group-hover:scale-105 transition-transform"
            />
            <div className="hidden sm:flex flex-col">
              <span className="font-black text-slate-900 text-xl tracking-tight leading-none flex items-center">
                ILUMAA<span className="text-[#2563eb]">Studio</span>
              </span>
            </div>
          </Link>

          {/* Search Bar with Category Filter */}
          <div className="relative w-full max-w-xl flex items-center">
            <Search
              size={18}
              className="absolute left-3.5 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search for grocery, food, services..."
              className="w-full bg-slate-50 border border-slate-200 rounded-full pl-10 pr-10 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#1e6091] focus:bg-white transition-all shadow-2xs"
            />
            <button className="absolute right-3.5 text-slate-400 hover:text-[#1e6091] transition-colors">
              <Mic size={16} />
            </button>
          </div>

          {/* Right Action Icons */}
          <div className="hidden lg:flex items-center gap-5 text-xs">
            {/* Location Pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700">
              <MapPin size={16} className="text-[#2563eb]" />
              <div className="flex flex-col text-[10px] leading-tight">
                <span className="font-bold text-slate-900">
                  {location?.city || "Unknown City"}
                </span>
              </div>
            </div>

            <Link
              to="/offers"
              className="flex items-center gap-1.5 text-slate-700 hover:text-[#2563eb] transition-colors font-semibold"
            >
              <Tag size={17} className="text-red-500" />
              <span>Offers</span>
            </Link>

            <Link
              to="/wishlist"
              className="relative flex items-center gap-1.5 text-slate-700 hover:text-[#2563eb] transition-colors font-semibold"
            >
              <div className="relative">
                <Heart size={18} />
                {wishlistQty > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#2563eb] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                    {wishlistQty}
                  </span>
                )}
              </div>
              <span>Wishlist</span>
            </Link>

            <Link
              to="/cart"
              className="relative flex items-center gap-1.5 text-slate-700 hover:text-[#2563eb] transition-colors font-semibold"
            >
              <div className="relative">
                <ShoppingCart size={18} />
                <span className="absolute -top-2 -right-2 bg-[#2563eb] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                  {totalQty}
                </span>
              </div>
              <span>Cart</span>
            </Link>

            {isAuthenticated ? (
              <Link
                to="/profile"
                className="flex items-center gap-1.5 text-slate-700 hover:text-[#2563eb] transition-colors font-semibold"
              >
                <User size={18} className="text-[#2563eb]" />
                <div className="flex flex-col text-[10px] leading-tight"></div>
              </Link>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 text-slate-700 hover:text-[#2563eb] transition-colors font-semibold"
              >
                <User size={18} />
                <span>Account</span>
              </Link>
            )}
          </div>

          {/* Mobile Right Bar */}
          <div className="lg:hidden flex items-center gap-3">
            <Link to="/cart" className="relative p-2 text-slate-700">
              <ShoppingCart size={22} />
              <span className="absolute top-0 right-0 bg-[#2563eb] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {totalQty}
              </span>
            </Link>
            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              className="p-2 text-slate-700"
            >
              {mobileMenu ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Attached E-Commerce Category Navigation Bar */}
      <div className="bg-slate-50 border-t border-slate-200 py-2 relative group/catnav">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 flex items-center gap-1 sm:gap-2 text-xs relative">
          {/* Scroll Left Button */}
          {showLeftArrow && (
            <button
              type="button"
              onClick={() => handleCategoryScroll("left")}
              className="p-1 rounded-full bg-white text-slate-700 shadow-md border border-slate-200 hover:bg-blue-50 hover:text-[#2563eb] transition shrink-0 cursor-pointer z-10"
              aria-label="Scroll categories left"
              title="Scroll left"
            >
              <ChevronLeft size={16} />
            </button>
          )}

          {/* Scrollable Category Pills Container */}
          <div
            ref={catScrollRef}
            className="flex-1 flex items-center gap-1.5 sm:gap-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden scroll-smooth py-0.5"
          >
            <button
              type="button"
              onClick={() => navigate("/shop")}
              className="px-3 py-1 rounded-full font-bold transition shrink-0 bg-blue-50 text-[#2563eb] hover:bg-blue-100 cursor-pointer"
            >
              All Products
            </button>

            <Link
              to="/flash-deals"
              className="px-3 py-1 rounded-full font-black transition shrink-0 bg-amber-500 text-white hover:bg-amber-600 cursor-pointer flex items-center gap-1 shadow-xs"
            >
              <span>Flash Deals</span>
            </Link>

            {(categories.length > 0
              ? categories
              : [
                  { name: "Fashion" },
                  { name: "Electronics" },
                  { name: "Home & Living" },
                  { name: "Beauty & Care" },
                  { name: "Sports & Outdoors" },
                  { name: "Books & Stationery" },
                  { name: "Gifting" },
                ]
            ).map((cat, idx) => {
              const catName = cat.name || cat.title;
              return (
                <button
                  key={cat._id || `cat_nav_${idx}`}
                  type="button"
                  onClick={() =>
                    navigate(`/shop?category=${encodeURIComponent(catName)}`)
                  }
                  className="px-3 py-1 rounded-full font-semibold transition shrink-0 text-[#2563eb] sm:text-slate-700 hover:bg-slate-200 hover:text-slate-900 cursor-pointer whitespace-nowrap"
                >
                  {catName}
                </button>
              );
            })}
            <button
              onClick={() => navigate("/productlisting")}
              className="px-3 py-1 rounded-full font-semibold transition shrink-0 text-[#2563eb] sm:text-slate-700 hover:bg-slate-200 hover:text-slate-900 cursor-pointer whitespace-nowrap"
            >
              Explore more
            </button>
          </div>

          {/* Scroll Right Button */}
          {showRightArrow && (
            <button
              type="button"
              onClick={() => handleCategoryScroll("right")}
              className="p-1 rounded-full bg-white text-slate-700 shadow-md border border-slate-200 hover:bg-blue-50 hover:text-[#2563eb] transition shrink-0 cursor-pointer z-10"
              aria-label="Scroll categories right"
              title="Scroll right"
            >
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenu && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-4">
          <form
            onSubmit={handleSearch}
            className="flex items-center border border-slate-300 rounded-lg overflow-hidden"
          >
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-transparent text-slate-800 outline-none"
            />
            <button type="submit" className="bg-[#2563eb] text-white px-4 py-2">
              <Search size={16} />
            </button>
          </form>

          <div className="space-y-2 pt-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenu(false)}
                className="block text-sm font-semibold text-slate-700 py-1"
              >
                {link.name}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
