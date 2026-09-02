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
  ChevronRight,
  ChevronLeft,
  MapPin,
  Mic,
  LogOut,
  Sparkles,
  Package,
  Layers,
  Building2,
  ChevronDown,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../redux/actions/authActions";
import TopBar from "./TopBar";
import {
  fetchCategories,
  fetchBusinessCategories,
} from "../api/categoryService";
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
  const [businessCategories, setBusinessCategories] = useState([]);
  const [selectedBusinessCategory, setSelectedBusinessCategory] =
    useState("E-Commerce");
  const [loadingCategories, setLoadingCategories] = useState(false);

  const [location, setLocation] = useState(null);
  const catScrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Helper to determine route based on Business Category Code:
  // "SERVICE" => /services
  // "ECOMMERCE" => /shop
  // "OTHER" => /shop
  const isServiceCategory = (bCatVal) => {
    if (!bCatVal) return false;

    const found = businessCategories.find(
      (bc) =>
        bc._id === bCatVal ||
        bc.code?.toUpperCase() === String(bCatVal).toUpperCase() ||
        bc.name?.toLowerCase() === String(bCatVal).toLowerCase(),
    );

    const code = (found?.code || String(bCatVal)).toUpperCase();
    const name = (found?.name || String(bCatVal)).toLowerCase();

    // Explicit code checks
    if (code === "SERVICE" || code === "SERVICES") return true;
    if (code === "ECOMMERCE" || code === "OTHER") return false;

    // Fallback text matching
    return name.includes("service") || code.includes("SERV");
  };

  // Immediate navigation handler on business category change:
  // ECOMMERCE => /shop, OTHER => /shop, SERVICE => /services
  const handleBusinessCategoryChange = (newBCat) => {
    setSelectedBusinessCategory(newBCat);
    if (isServiceCategory(newBCat)) {
      navigate("/services");
    } else {
      navigate("/shop");
    }
  };

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

  // 1. Fetch Business Categories from Backend
  const loadBusinessCategories = async () => {
    try {
      const res = await fetchBusinessCategories({ status: "active" });
      const list =
        res?.data || res?.businessCategories || (Array.isArray(res) ? res : []);
      setBusinessCategories(list);
    } catch (err) {
      console.error("Failed to load business categories:", err);
    }
  };

  // 2. Fetch Categories mapped to selected Business Category (Default: E-Commerce)
  const getCategoriesByBusinessCategory = async (targetBCat) => {
    try {
      setLoadingCategories(true);
      const bCat = targetBCat || selectedBusinessCategory || "E-Commerce";
      const res = await fetchCategories({
        businessCategory: bCat,
        limit: 30,
      });
      const list =
        res?.data || res?.categories || (Array.isArray(res) ? res : []);
      setCategories(list);
    } catch (err) {
      console.error("Failed to load categories for business category:", err);
      setCategories([]);
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchLocation = async () => {
    try {
      const loc = await getUserLocation();
      setLocation(loc);
    } catch (error) {
      console.log("Location permission denied:", error.message);
    }
  };

  useEffect(() => {
    loadBusinessCategories();
    fetchLocation();
  }, []);

  useEffect(() => {
    getCategoriesByBusinessCategory(selectedBusinessCategory);
  }, [selectedBusinessCategory]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      if (isServiceCategory(selectedBusinessCategory)) {
        navigate(`/services?search=${encodeURIComponent(searchTerm.trim())}`);
      } else {
        navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
      }
      setMobileMenu(false);
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    setMobileMenu(false);
    navigate("/login");
  };

  const displayCategories =
    categories.length > 0
      ? categories
      : isServiceCategory(selectedBusinessCategory)
        ? [
            { name: "Cleaning & Maintenance" },
            { name: "Beauty & Wellness" },
            { name: "Home Repair" },
            { name: "Consulting & IT" },
            { name: "Event Planning" },
            { name: "Fitness & Training" },
          ]
        : [
            { name: "Fashion" },
            { name: "Electronics" },
            { name: "Home & Living" },
            { name: "Beauty & Care" },
            { name: "Sports & Outdoors" },
            { name: "Books & Stationery" },
            { name: "Gifting" },
          ];

  const isService = isServiceCategory(selectedBusinessCategory);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-xs font-sans">
      {/* Top Announcement Bar */}
      <TopBar />

      {/* Main Header (Tier 1) */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3">
        <div className="flex items-center justify-between gap-2 sm:gap-4 lg:gap-8">
          {/* Logo & Subtitle */}
          <Link to="/" className="flex items-center gap-2 shrink-0 group">
            <img
              src={ilumaIcon}
              alt="ILUMAA Studio"
              className="w-8 h-8 sm:w-10 sm:h-10 object-contain rounded-xl shadow-xs group-hover:scale-105 transition-transform"
            />
            <div className="md:flex flex-col hidden ">
              <span className="font-black text-slate-900 text-base sm:text-xl tracking-tight leading-none flex items-center">
                ILUMAA<span className="text-[#2563eb]">Studio</span>
              </span>
            </div>
          </Link>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="relative flex-1 max-w-xl flex items-center"
          >
            <Search
              size={16}
              className="absolute left-3 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder={
                isService
                  ? "Search services, bookings, categories..."
                  : "Search products, brands, categories..."
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-full pl-9 pr-8 py-1.5 sm:py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2563eb] focus:bg-white transition-all shadow-2xs"
            />
            <button
              type="submit"
              className="absolute right-3 text-slate-400 hover:text-[#2563eb] transition-colors cursor-pointer"
              title="Search"
            >
              <Mic size={15} />
            </button>
          </form>

          {/* Right Action Icons (Desktop) */}
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
                <span>Account</span>
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

          {/* Mobile Right Action Icons */}
          <div className="lg:hidden flex items-center gap-1 sm:gap-2">
            <Link
              to="/wishlist"
              className="relative p-1.5 text-slate-700 hover:text-[#2563eb]"
              title="Wishlist"
            >
              <Heart size={20} />
              {wishlistQty > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#2563eb] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-2xs">
                  {wishlistQty}
                </span>
              )}
            </Link>
            <Link
              to="/cart"
              className="relative p-1.5 text-slate-700 hover:text-[#2563eb]"
              title="Cart"
            >
              <ShoppingCart size={20} />
              {totalQty > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#2563eb] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-2xs">
                  {totalQty}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              className="p-1.5 text-slate-700 hover:text-[#2563eb] cursor-pointer"
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenu ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Attached Category Navigation Bar with BusinessCategory Selector */}
      <div className="bg-slate-50 border-t border-slate-200 py-1.5 relative group/catnav">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 flex items-center gap-2 text-xs relative">
          {/* Business Category Selector Dropdown (Defaults to E-Commerce) */}
          <div className="relative shrink-0 flex items-center">
            <select
              value={selectedBusinessCategory}
              onChange={(e) => handleBusinessCategoryChange(e.target.value)}
              className="bg-white border border-slate-300 text-slate-800 rounded-full pl-3 pr-5 py-1 text-xs font-extrabold shadow-2xs focus:outline-none focus:border-[#2563eb] cursor-pointer hover:bg-slate-50 transition appearance-none"
            >
              {/* Default E-Commerce option */}
              <option value="E-Commerce">E-Commerce</option>
              {businessCategories
                .filter(
                  (bc) =>
                    bc.name?.toLowerCase() !== "e-commerce" &&
                    bc.code?.toUpperCase() !== "ECOMMERCE",
                )
                .map((bc) => (
                  <option
                    key={bc._id || bc.code}
                    value={bc.code || bc._id || bc.name}
                  >
                    {bc.name}
                  </option>
                ))}
            </select>
            <ChevronDown
              size={12}
              className="absolute right-2 text-slate-400 pointer-events-none"
            />
          </div>

          {/* Scroll Left Button */}
          {showLeftArrow && (
            <button
              type="button"
              onClick={() => handleCategoryScroll("left")}
              className="hidden sm:flex p-1 rounded-full bg-white text-slate-700 shadow-md border border-slate-200 hover:bg-blue-50 hover:text-[#2563eb] transition shrink-0 cursor-pointer z-10"
              aria-label="Scroll categories left"
              title="Scroll left"
            >
              <ChevronLeft size={16} />
            </button>
          )}

          {/* Scrollable Category Pills Container Mapped to Selected Business Category */}
          <div
            ref={catScrollRef}
            className="flex-1 flex items-center gap-1.5 sm:gap-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden scroll-smooth py-0.5"
          >
            {/* Dynamic Button 1: All Products (/shop) vs All Services (/services) */}
            {isService ? (
              <button
                type="button"
                onClick={() => navigate("/services")}
                className="px-3 py-1 rounded-full font-bold transition shrink-0 bg-blue-50 text-[#2563eb] hover:bg-blue-100 cursor-pointer text-xs flex items-center gap-1"
              >
                <Layers size={13} />
                <span>All Services</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => navigate("/shop")}
                className="px-3 py-1 rounded-full font-bold transition shrink-0 bg-blue-50 text-[#2563eb] hover:bg-blue-100 cursor-pointer text-xs flex items-center gap-1"
              >
                <Package size={13} />
                <span>All Products</span>
              </button>
            )}

            {/* Flash Deals: Only show when NOT service */}
            {!isService && (
              <Link
                to="/flash-deals"
                className="px-3 py-1 rounded-full font-black transition shrink-0 bg-amber-500 text-white hover:bg-amber-600 cursor-pointer flex items-center gap-1 shadow-2xs text-xs"
              >
                <Sparkles size={12} />
                <span>Flash Deals</span>
              </Link>
            )}

            {loadingCategories ? (
              <span className="text-xs text-slate-400 font-medium px-3 animate-pulse">
                Loading categories...
              </span>
            ) : (
              displayCategories.map((cat, idx) => {
                const catName = cat.name || cat.title;
                const targetPath = isService
                  ? `/services?category=${encodeURIComponent(catName)}`
                  : `/shop?category=${encodeURIComponent(catName)}&businessCategory=${encodeURIComponent(selectedBusinessCategory)}`;

                return (
                  <button
                    key={cat._id || `cat_nav_${idx}`}
                    type="button"
                    onClick={() => navigate(targetPath)}
                    className="px-3 py-1 rounded-full font-semibold transition shrink-0 text-[#2563eb] sm:text-slate-700 hover:bg-slate-200 hover:text-slate-900 cursor-pointer whitespace-nowrap text-xs"
                  >
                    {catName}
                  </button>
                );
              })
            )}

            {/* End Button: Explore All */}
            <button
              onClick={() => navigate(isService ? "/services" : "/shop")}
              className="px-3 py-1 rounded-full font-semibold transition shrink-0 text-[#2563eb] sm:text-slate-700 hover:bg-slate-200 hover:text-slate-900 cursor-pointer whitespace-nowrap text-xs"
            >
              {isService ? "Explore all services" : "Explore all products"}
            </button>
          </div>

          {/* Scroll Right Button */}
          {showRightArrow && (
            <button
              type="button"
              onClick={() => handleCategoryScroll("right")}
              className="hidden sm:flex p-1 rounded-full bg-white text-slate-700 shadow-md border border-slate-200 hover:bg-blue-50 hover:text-[#2563eb] transition shrink-0 cursor-pointer z-10"
              aria-label="Scroll categories right"
              title="Scroll right"
            >
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Mobile Drawer Slide-over Menu */}
      {mobileMenu && (
        <div className="lg:hidden border-t border-slate-200 bg-white max-h-[85vh] overflow-y-auto px-4 py-4 space-y-5 shadow-xl animate-in slide-in-from-top duration-200">
          {/* User Account / Profile Box */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#2563eb] text-white flex items-center justify-center font-bold text-sm">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    {user?.name || "Welcome Back!"}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {user?.email || "Account member"}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 w-full">
                <Link
                  to="/login"
                  onClick={() => setMobileMenu(false)}
                  className="flex-1 text-center py-2 bg-[#2563eb] text-white rounded-lg text-xs font-bold shadow-xs"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenu(false)}
                  className="flex-1 text-center py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-bold"
                >
                  Register
                </Link>
              </div>
            )}

            {isAuthenticated && (
              <div className="flex items-center gap-2">
                <Link
                  to="/profile"
                  onClick={() => setMobileMenu(false)}
                  className="px-2.5 py-1 bg-white border border-slate-200 text-[#2563eb] text-xs font-bold rounded-lg"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Business Category Selection in Mobile Menu */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-wider px-1">
              Select Business Category
            </label>
            <select
              value={selectedBusinessCategory}
              onChange={(e) => {
                handleBusinessCategoryChange(e.target.value);
                setMobileMenu(false);
              }}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-[#2563eb]"
            >
              <option value="E-Commerce">E-Commerce</option>
              {businessCategories
                .filter(
                  (bc) =>
                    bc.name?.toLowerCase() !== "e-commerce" &&
                    bc.code?.toUpperCase() !== "ECOMMERCE",
                )
                .map((bc) => (
                  <option
                    key={bc._id || bc.code}
                    value={bc.code || bc._id || bc.name}
                  >
                    {bc.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Location Badge */}
          <div className="flex items-center gap-2 px-3 py-2 bg-blue-50/60 text-slate-700 rounded-lg text-xs">
            <MapPin size={15} className="text-[#2563eb] shrink-0" />
            <span className="text-slate-500">Location:</span>
            <span className="font-bold text-slate-900">
              {location?.city || "Detecting Location..."}
            </span>
          </div>

          {/* Quick Links Grid */}
          <div className="space-y-1">
            <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider px-1">
              Quick Navigation
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
              <Link
                to="/shop"
                onClick={() => setMobileMenu(false)}
                className="flex items-center gap-2 p-2.5 bg-slate-50 hover:bg-blue-50 rounded-xl font-bold text-slate-800 hover:text-[#2563eb] transition-colors border border-slate-100"
              >
                <Package size={16} className="text-[#2563eb]" />
                <span>Shop All</span>
              </Link>
              <Link
                to="/services"
                onClick={() => setMobileMenu(false)}
                className="flex items-center gap-2 p-2.5 bg-slate-50 hover:bg-blue-50 rounded-xl font-bold text-slate-800 hover:text-[#2563eb] transition-colors border border-slate-100"
              >
                <Layers size={16} className="text-purple-600" />
                <span>Services</span>
              </Link>
              <Link
                to="/offers"
                onClick={() => setMobileMenu(false)}
                className="flex items-center gap-2 p-2.5 bg-slate-50 hover:bg-blue-50 rounded-xl font-bold text-slate-800 hover:text-[#2563eb] transition-colors border border-slate-100"
              >
                <Tag size={16} className="text-red-500" />
                <span>Offers</span>
              </Link>
              <Link
                to="/flash-deals"
                onClick={() => setMobileMenu(false)}
                className="flex items-center gap-2 p-2.5 bg-slate-50 hover:bg-blue-50 rounded-xl font-bold text-slate-800 hover:text-[#2563eb] transition-colors border border-slate-100"
              >
                <Sparkles size={16} className="text-amber-500" />
                <span>Flash Deals</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
