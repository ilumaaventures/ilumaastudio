import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Search,
  ShoppingCart,
  Heart,
  User,
  Store,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useStore } from "../../pages/Store/StoreLayout";

export default function Navbar() {
  const { business } = useStore();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const cartItems = useSelector((s) => s.cart?.cartItems || []);
  const wishlistItems = useSelector((s) => s.wishlist?.items || []);
  const totalQty = cartItems.reduce((acc, i) => acc + (i.quantity || 0), 0);
  const wishlistQty = wishlistItems.length;

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(
        `/${encodeURIComponent(business.businessName)}/products?search=${encodeURIComponent(searchTerm.trim())}`,
      );
      setSearchTerm("");
      setMobileMenu(false);
    }
  };

  const navLinks = [
    { name: "Home", path: `/${encodeURIComponent(business.businessName)}` },
    {
      name: "Products",
      path: `/${encodeURIComponent(business.businessName)}/products`,
    },
    {
      name: "About",
      path: `/${encodeURIComponent(business.businessName)}/about`,
    },
    // {
    //   name: "Contact",
    //   path: `/${encodeURIComponent(business.businessName)}/contact`,
    // },
  ];

  return (
    <header
      className={`sticky top-0 z-50 bg-white/80 backdrop-blur-md transition-shadow duration-300 ${
        scrolled
          ? "shadow-sm border-b border-gray-100"
          : "border-b border-gray-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-16 flex items-center justify-between gap-6">
          {/* Logo */}
          <Link
            to={`/${encodeURIComponent(business.businessName)}`}
            className="flex items-center gap-2.5 shrink-0"
          >
            {business.logo ? (
              <img
                src={business.logo}
                alt={business.businessName}
                className="h-9 w-auto object-contain rounded-lg"
              />
            ) : (
              <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
                <Store size={18} />
              </div>
            )}
            <span className="font-extrabold text-gray-900 text-lg tracking-tight capitalize">
              {business.businessName}
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                end
                className={({ isActive }) =>
                  `text-sm font-semibold transition duration-150 ${
                    isActive
                      ? "text-indigo-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Search bar */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex relative flex-1 max-w-sm"
          >
            <Search
              className="absolute left-3.5 top-2.5 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition bg-gray-50/50"
            />
          </form>

          {/* Right Action Icons */}
          <div className="flex items-center gap-4">
            <Link
              to="/wishlist"
              className="relative p-2 text-gray-600 hover:text-indigo-600 transition"
            >
              <Heart size={20} />
              {wishlistQty > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistQty}
                </span>
              )}
            </Link>
            <Link
              to="/cart"
              className="relative p-2 text-gray-600 hover:text-indigo-600 transition"
            >
              <ShoppingCart size={20} />
              {totalQty > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalQty}
                </span>
              )}
            </Link>
            <Link
              to="/dashboard"
              className="p-2 text-gray-600 hover:text-indigo-600 transition"
            >
              <User size={20} />
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              {mobileMenu ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        {mobileMenu && (
          <div className="md:hidden pb-4 pt-2 border-t border-gray-100 space-y-3">
            <form onSubmit={handleSearch} className="relative w-full">
              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={15}
              />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs border border-gray-200 rounded-lg outline-none bg-gray-50 focus:bg-white focus:border-indigo-600 transition"
              />
            </form>
            <nav className="flex flex-col gap-2.5">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenu(false)}
                  className="px-2.5 py-2 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
