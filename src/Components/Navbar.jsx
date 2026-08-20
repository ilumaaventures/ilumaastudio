import React, { useState, useEffect } from "react";
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
  Moon,
  Sun,
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

function Navbar() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [darkMode, setDarkMode] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isAuthenticated } = useSelector((s) => s.auth);
  const cartItems = useSelector((s) => s.cart?.cartItems || []);
  const wishlistItems = useSelector((s) => s.wishlist?.items || []);
  const totalQty = cartItems.reduce((acc, i) => acc + (i.quantity || 0), 0);
  const wishlistQty = wishlistItems.length;
  const [categories, setCategories] = useState([]);
  const [location, setLocation] = useState(null);
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
    <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors duration-200 shadow-sm">
      {/* Top Announcement Bar */}
      <TopBar />

      {/* Main Header (Tier 1) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4 lg:gap-8">
          {/* Logo & Subtitle */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#2563eb] to-[#3b82f6] flex items-center justify-center text-white font-black text-xl shadow-md shadow-blue-500/20">
              S
            </div>
            <div className="flex flex-col">
              <span className="font-black text-slate-900 dark:text-white text-xl tracking-tight leading-none flex items-center">
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
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              <MapPin size={16} className="text-[#2563eb]" />
              <div className="flex flex-col text-[10px] leading-tight">
                <span className="font-bold text-slate-900 dark:text-white">
                  {location?.city || "Unknown City"}
                </span>
              </div>
            </div>

            <Link
              to="/offers"
              className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 hover:text-[#2563eb] transition-colors font-semibold"
            >
              <Tag size={17} className="text-red-500" />
              <span>Offers</span>
            </Link>

            <Link
              to="/wishlist"
              className="relative flex items-center gap-1.5 text-slate-700 dark:text-slate-300 hover:text-[#2563eb] transition-colors font-semibold"
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
              className="relative flex items-center gap-1.5 text-slate-700 dark:text-slate-300 hover:text-[#2563eb] transition-colors font-semibold"
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
                className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 hover:text-[#2563eb] transition-colors font-semibold"
              >
                <User size={18} className="text-[#2563eb]" />
                <div className="flex flex-col text-[10px] leading-tight"></div>
              </Link>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 hover:text-[#2563eb] transition-colors font-semibold"
              >
                <User size={18} />
                <span>Account</span>
              </Link>
            )}
          </div>

          {/* Mobile Right Bar */}
          <div className="lg:hidden flex items-center gap-3">
            <Link
              to="/cart"
              className="relative p-2 text-slate-700 dark:text-slate-200"
            >
              <ShoppingCart size={22} />
              <span className="absolute top-0 right-0 bg-[#2563eb] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {totalQty}
              </span>
            </Link>
            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              className="p-2 text-slate-700 dark:text-slate-200"
            >
              {mobileMenu ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Attached E-Commerce Category Navigation Bar */}
      <div className="bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200/80 dark:border-slate-800/80 py-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1.5 sm:gap-2 text-xs">
          <span className="font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-[10px] shrink-0 mr-1 flex items-center gap-1">
            <Grid size={12} className="text-[#2563eb]" />
            Categories:
          </span>

          <button
            type="button"
            onClick={() => navigate("/shop")}
            className="px-3 py-1 rounded-full font-bold transition shrink-0 bg-blue-50 dark:bg-blue-950/50 text-[#2563eb] dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 cursor-pointer"
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
                className="px-3 py-1 rounded-full font-semibold transition shrink-0 text-[#2563eb] sm:text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                {catName}
              </button>
            );
          })}
          <button
            onClick={() => navigate("/productlisting")}
            className="px-3 py-1 rounded-full font-semibold transition shrink-0 text-[#2563eb] sm:text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white cursor-pointer"
          >
            Explore more
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenu && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 space-y-4">
          <form
            onSubmit={handleSearch}
            className="flex items-center border border-slate-300 dark:border-slate-700 rounded-lg overflow-hidden"
          >
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-transparent text-slate-800 dark:text-slate-100 outline-none"
            />
            <button type="submit" className="bg-[#2563eb] text-white px-4 py-2">
              <Search size={16} />
            </button>
          </form>

          <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Dark Mode
            </span>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`w-10 h-5 flex items-center rounded-full p-0.5 ${
                darkMode ? "bg-[#2563eb]" : "bg-slate-300"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full transform transition-transform ${darkMode ? "translate-x-5" : ""}`}
              />
            </button>
          </div>

          <div className="space-y-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenu(false)}
                className="block text-sm font-semibold text-slate-700 dark:text-slate-300 py-1"
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
