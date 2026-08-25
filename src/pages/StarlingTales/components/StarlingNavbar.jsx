import React, { useCallback, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShoppingCart, Heart, User, Store } from "lucide-react";
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
  const storeHomePath =
    contextHomePath ||
    (business?.subdomain
      ? `/${encodeURIComponent(business.subdomain)}`
      : business?.slug
        ? `/${encodeURIComponent(business.slug)}`
        : business?.businessName
          ? `/${encodeURIComponent(business.businessName)}`
          : "");

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const scrollToSection = useCallback((sectionHash) => {
    if (!sectionHash) return;
    const id = sectionHash.replace("#", "");
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
    }, 80);
    return () => clearTimeout(timeout);
  }, [hash, pathname, scrollToSection]);

  const navLinks = [
    { name: "HOME", path: `${storeHomePath}#home` },
    {
      name: "ABOUT US",
      path: `${storeHomePath}#about-us`,
    },
    {
      name: "NURSERY COLLECTION",
      path: `${storeHomePath}/products`,
    },
    {
      name: "GIFT HAMPERS",
      path: `${storeHomePath}/gift-hampers`,
    },
  ];

  const handleLinkClick = (e, linkPath) => {
    const [linkPathname, linkHash] = linkPath.split("#");
    if (linkHash) {
      const currentClean = pathname.replace(/\/$/, "");
      const targetClean = (linkPathname || "").replace(/\/$/, "");
      if (
        currentClean === targetClean ||
        currentClean === storeHomePath.replace(/\/$/, "")
      ) {
        e.preventDefault();
        window.history.pushState(null, "", `${linkPathname}#${linkHash}`);
        scrollToSection(`#${linkHash}`);
      }
    }
  };

  const isLinkActive = (linkPath) => {
    const [linkPathname, linkHash] = linkPath.split("#");
    if (linkHash) {
      return pathname === linkPathname && hash === `#${linkHash}`;
    }
    return pathname === linkPathname && !hash;
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
            to={`${storeHomePath}#home`}
            onClick={(e) => handleLinkClick(e, `${storeHomePath}#home`)}
            className="flex items-center gap-2.5 shrink-0"
          >
            {business?.logo ? (
              <img
                src={business.logo}
                alt={business?.businessName || "Starling Tales"}
                className="h-9 w-auto object-contain rounded-lg"
              />
            ) : (
              <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
                <Store size={18} />
              </div>
            )}
            <span className="font-extrabold text-gray-900 text-lg tracking-tight capitalize font-serif">
              {business?.businessName || "Starling Tales"}
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => {
              const active = isLinkActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={(e) => handleLinkClick(e, link.path)}
                  className={`font-serif text-sm tracking-wider font-semibold transition-all duration-300 relative py-1 hover:text-[#C5A880] ${
                    active ? "text-[#C5A880]" : "text-[#2C3E35]"
                  }`}
                >
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Actions (Cart, Wishlist, Profile) */}
          <div className="hidden md:flex items-center gap-6 text-[#2C3E35]">
            <Link
              to="/wishlist"
              className="relative p-2 hover:text-[#C5A880] transition-colors"
            >
              <Heart size={20} />
              {wishlistQty > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#C5A880] text-[#FAF6F0] text-[9px] font-bold rounded-full flex items-center justify-center">
                  {wishlistQty}
                </span>
              )}
            </Link>

            <Link
              to="/cart"
              className="relative p-2 hover:text-[#C5A880] transition-colors"
            >
              <ShoppingCart size={20} />
              {totalQty > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#2C3E35] text-[#FAF6F0] text-[9px] font-bold rounded-full flex items-center justify-center">
                  {totalQty}
                </span>
              )}
            </Link>

            <Link
              to="/profile"
              className="p-2 hover:text-[#C5A880] transition-colors"
            >
              <User size={20} />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="md:hidden p-2 text-[#2C3E35] hover:text-[#C5A880] transition-colors"
          >
            {mobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenu && (
        <div className="md:hidden border-t border-[#C5A880]/15 bg-[#FAF6F0] px-6 py-8 space-y-6 animate-fadeIn">
          <nav className="flex flex-col gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={(e) => {
                  setMobileMenu(false);
                  handleLinkClick(e, link.path);
                }}
                className="font-serif text-base font-bold text-[#2C3E35] hover:text-[#C5A880] transition-colors"
              >
                {link.name}
              </Link>
            ))}
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
          </div>
        </div>
      )}
    </header>
  );
}
