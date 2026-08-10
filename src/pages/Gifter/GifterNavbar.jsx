import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingCart, Heart, User, Gift } from "lucide-react";
import { useSelector } from "react-redux";
import { useStore } from "../Store/StoreLayout";

export default function GifterNavbar() {
  const { business } = useStore();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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

  const navLinks = [
    { name: "Gifting Home", path: `/${encodeURIComponent(business.businessName)}` },
    { name: "Browse Hampers", path: `/${encodeURIComponent(business.businessName)}/products` },
    { name: "Our Vows", path: `/${encodeURIComponent(business.businessName)}/about` },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#FFF9FB]/95 backdrop-blur-md shadow-md border-b border-[#E1A990]/35"
          : "bg-[#FFF9FB] border-b border-[#E1A990]/20"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="h-20 flex items-center justify-between gap-6">
          {/* Logo & Brand */}
          <Link
            to={`/${encodeURIComponent(business.businessName)}`}
            className="flex items-center gap-3 shrink-0 group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#5C1A29] to-[#7E2437] flex items-center justify-center text-white group-hover:scale-105 transition-transform duration-300 shadow-sm">
              <Gift size={20} className="animate-wiggle" />
            </div>
            <div className="flex flex-col">
              <span className="font-sans font-black text-[#5C1A29] text-xl tracking-tight leading-none">
                Gifter
              </span>
              <span className="text-[9px] text-[#E1A990] tracking-[0.2em] uppercase font-bold mt-1">
                Luxury Hamper Studio
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                end
                className={({ isActive }) =>
                  `font-sans text-xs tracking-wider uppercase font-bold transition-all duration-300 relative py-1 hover:text-[#E1A990] ${
                    isActive
                      ? "text-[#E1A990]"
                      : "text-[#5C1A29]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>{link.name}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E1A990] rounded-full" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Actions (Cart, Wishlist, Profile) */}
          <div className="hidden md:flex items-center gap-6 text-[#5C1A29]">
            <Link
              to="/wishlist"
              className="relative p-2 hover:text-[#E1A990] transition-colors"
            >
              <Heart size={20} />
              {wishlistQty > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#E1A990] text-[#FFF9FB] text-[9px] font-bold rounded-full flex items-center justify-center">
                  {wishlistQty}
                </span>
              )}
            </Link>

            <Link
              to="/cart"
              className="relative p-2 hover:text-[#E1A990] transition-colors"
            >
              <ShoppingCart size={20} />
              {totalQty > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#5C1A29] text-[#FFF9FB] text-[9px] font-bold rounded-full flex items-center justify-center">
                  {totalQty}
                </span>
              )}
            </Link>

            <Link
              to="/profile"
              className="p-2 hover:text-[#E1A990] transition-colors"
            >
              <User size={20} />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="md:hidden p-2 text-[#5C1A29] hover:text-[#E1A990] transition-colors"
          >
            {mobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenu && (
        <div className="md:hidden border-t border-[#E1A990]/15 bg-[#FFF9FB] px-6 py-8 space-y-6 animate-fadeIn">
          <nav className="flex flex-col gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenu(false)}
                className="font-sans text-sm tracking-wide uppercase font-bold text-[#5C1A29] hover:text-[#E1A990] transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="flex gap-6 pt-4 border-t border-[#E1A990]/15 text-[#5C1A29]">
            <Link
              to="/cart"
              onClick={() => setMobileMenu(false)}
              className="flex items-center gap-2 text-sm font-semibold hover:text-[#E1A990]"
            >
              <ShoppingCart size={18} />
              <span>Cart ({totalQty})</span>
            </Link>
            <Link
              to="/wishlist"
              onClick={() => setMobileMenu(false)}
              className="flex items-center gap-2 text-sm font-semibold hover:text-[#E1A990]"
            >
              <Heart size={18} />
              <span>Wishlist ({wishlistQty})</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
