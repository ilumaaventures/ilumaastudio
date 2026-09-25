import React, { useCallback, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShoppingCart, Heart, User, Sparkles } from "lucide-react";
import { useSelector } from "react-redux";
import { useStore } from "../../Store/StoreContext";

export default function StarlingNavbar() {
  const { business, storeHomePath: contextHomePath } = useStore();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname, hash } = useLocation();

  const cartItems = useSelector((s) => s.cart?.cartItems || []);
  const wishlistItems = useSelector((s) => s.wishlist?.items || []);
  const totalQty = cartItems.reduce((acc, i) => acc + (i.quantity || 0), 0);
  const wishlistQty = wishlistItems.length;

  const rawHome =
    contextHomePath ||
    (business?.subdomain
      ? `/${encodeURIComponent(business.subdomain)}`
      : business?.slug
        ? `/${encodeURIComponent(business.slug)}`
        : business?.businessName
          ? `/${encodeURIComponent(business.businessName)}`
          : "");
  const cleanHome = rawHome.replace(/\/$/, "");

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const scrollToSection = useCallback((sectionHash) => {
    if (!sectionHash) return;
    const id = sectionHash.replace("#", "");
    if (id === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.getElementById(id);
    if (!el) return;

    const headerElement = document.querySelector("header");
    const navOffset = headerElement ? headerElement.offsetHeight : 80;
    const y = el.getBoundingClientRect().top + window.scrollY - navOffset;
    window.scrollTo({ top: Math.max(0, Math.round(y)), behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (!hash) return;
    const timeout = setTimeout(() => {
      scrollToSection(hash);
    }, 120);
    return () => clearTimeout(timeout);
  }, [hash, pathname, scrollToSection]);

  const navLinks = [
    { name: "HOME", path: `${cleanHome}` },
    { name: "ABOUT US", path: `${cleanHome}#about-us` },
    {
      name: "TENDER BEGINNINGS COLLECTION",
      path: `${cleanHome}/products`,
    },
    { name: "GIFT HAMPERS", path: `${cleanHome}/gift-hampers` },
  ];

  const handleLinkClick = (e, linkPath) => {
    const [linkPathname, linkHash] = linkPath.split("#");
    const currentClean = pathname.replace(/\/$/, "");
    const targetClean = (linkPathname || "").replace(/\/$/, "");

    if (linkHash) {
      if (currentClean === targetClean) {
        e.preventDefault();
        window.history.pushState(null, "", `${linkPathname}#${linkHash}`);
        scrollToSection(`#${linkHash}`);
      }
      // If navigating across different pages with a hash, allow default navigation to run
    } else {
      if (currentClean === targetClean) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const isLinkActive = (linkPath) => {
    const [linkPathname, linkHash] = linkPath.split("#");
    const currentClean = pathname.replace(/\/$/, "");
    const targetClean = (linkPathname || "").replace(/\/$/, "");

    if (linkHash) {
      return currentClean === targetClean && hash === `#${linkHash}`;
    }

    if (targetClean === cleanHome) {
      return currentClean === cleanHome && (!hash || hash === "#home");
    }

    return currentClean === targetClean;
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#FCFAF7]/95 backdrop-blur-md shadow-md border-b border-[#C5A880]/20"
          : "bg-[#FCFAF7] border-b border-[#C5A880]/10"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="h-20 flex items-center justify-between gap-6">
          {/* Logo & Brand */}
          <Link
            to={cleanHome}
            onClick={(e) => handleLinkClick(e, cleanHome)}
            className="flex items-center gap-2.5 shrink-0 group"
          >
            {business?.logo ? (
              <img
                src={business.logo}
                alt={business?.businessName || "Starling Tales"}
                className="h-9 w-auto object-contain rounded-lg transition-transform group-hover:scale-105"
              />
            ) : (
              <div className="w-9 h-9 rounded-full border border-[#C5A880] flex items-center justify-center text-[#C5A880] bg-[#FAF6F0] shadow-2xs transition-transform group-hover:scale-105">
                <Sparkles size={16} />
              </div>
            )}
            <span className="font-extrabold text-gray-900 text-lg tracking-tight capitalize font-serif group-hover:text-[#C5A880] transition-colors">
              {business?.businessName || "Starling Tales"}
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-10">
            {navLinks.map((link) => {
              const active = isLinkActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={(e) => handleLinkClick(e, link.path)}
                  className={`font-serif text-xs lg:text-sm tracking-wider font-semibold transition-all duration-300 relative py-1 hover:text-[#C5A880] ${
                    active ? "text-[#C5A880]" : "text-[#2C3E35]"
                  }`}
                >
                  <span>{link.name}</span>
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C5A880] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Actions (Cart, Wishlist, Profile) */}
          <div className="hidden md:flex items-center gap-6 text-[#2C3E35]">
            <Link
              to="/wishlist"
              className="relative p-2 hover:text-[#C5A880] transition-colors"
              title="View Wishlist"
            >
              <Heart size={20} />
              {wishlistQty > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-[#C5A880] text-[#FAF6F0] text-[9px] font-bold rounded-full flex items-center justify-center shadow-xs">
                  {wishlistQty}
                </span>
              )}
            </Link>

            <Link
              to="/cart"
              className="relative p-2 hover:text-[#C5A880] transition-colors"
              title="View Cart"
            >
              <ShoppingCart size={20} />
              {totalQty > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-[#2C3E35] text-[#FAF6F0] text-[9px] font-bold rounded-full flex items-center justify-center shadow-xs">
                  {totalQty}
                </span>
              )}
            </Link>

            <Link
              to="/profile"
              className="p-2 hover:text-[#C5A880] transition-colors"
              title="My Account"
            >
              <User size={20} />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="md:hidden p-2 text-[#2C3E35] hover:text-[#C5A880] transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenu && (
        <div className="md:hidden border-t border-[#C5A880]/15 bg-[#FAF6F0] px-6 py-8 space-y-6 animate-fadeIn">
          <nav className="flex flex-col gap-5">
            {navLinks.map((link) => {
              const active = isLinkActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={(e) => {
                    setMobileMenu(false);
                    handleLinkClick(e, link.path);
                  }}
                  className={`font-serif text-base font-bold transition-colors ${
                    active
                      ? "text-[#C5A880]"
                      : "text-[#2C3E35] hover:text-[#C5A880]"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="flex gap-6 pt-4 border-t border-[#C5A880]/15 text-[#2C3E35]">
            <Link
              to="/cart"
              onClick={() => setMobileMenu(false)}
              className="flex items-center gap-2 text-sm font-semibold hover:text-[#C5A880]"
            >
              <ShoppingCart size={18} />
              <span>Cart ({totalQty})</span>
            </Link>
            <Link
              to="/wishlist"
              onClick={() => setMobileMenu(false)}
              className="flex items-center gap-2 text-sm font-semibold hover:text-[#C5A880]"
            >
              <Heart size={18} />
              <span>Wishlist ({wishlistQty})</span>
            </Link>
            <Link
              to="/profile"
              onClick={() => setMobileMenu(false)}
              className="flex items-center gap-2 text-sm font-semibold hover:text-[#C5A880]"
            >
              <User size={18} />
              <span>Profile</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
