import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Hero from "../../Components/store/Hero";
import Categories from "../../Components/store/Categories";
import ProductCard from "../../Components/store/ProductCard";
import BannerSection from "../../Components/BannerSection";
import { useStore } from "./StoreContext";
import {
  Sparkles,
  ShoppingBag,
  Mail,
  Megaphone,
  ArrowRight,
  Truck,
  ShieldCheck,
  Award,
  Headphones,
  ChevronDown,
  Coins,
  Star,
  CheckCircle2,
} from "lucide-react";
import baseApi from "../../api/baseApi";

// Trust Badges Component
function TrustBadges({ theme = null }) {
  const primaryColor = theme?.colors?.primary || "#4F46E5";

  const badges = [
    {
      icon: Truck,
      title: "Fast & Free Shipping",
      desc: "On qualifying store orders with tracked dispatch",
    },
    {
      icon: ShieldCheck,
      title: "100% Secure Checkout",
      desc: "Bank-grade encrypted payments & buyer protection",
    },
    {
      icon: Award,
      title: "Guaranteed Quality",
      desc: "Handcrafted & carefully vetted genuine items",
    },
    {
      icon: Headphones,
      title: "Dedicated Support",
      desc: "Prompt customer assistance for orders & queries",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-8">
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6 rounded-3xl border border-slate-100/80 shadow-xs"
        style={{
          backgroundColor: theme?.colors?.cardBg || "#FFFFFF",
        }}
      >
        {badges.map((b, idx) => {
          const Icon = b.icon;
          return (
            <div
              key={idx}
              className="flex items-center gap-3.5 p-3 rounded-2xl transition hover:bg-slate-50/80"
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xs"
                style={{
                  backgroundColor: `${primaryColor}12`,
                  color: primaryColor,
                }}
              >
                <Icon size={22} />
              </div>
              <div className="space-y-0.5 text-left">
                <h4
                  className="font-bold text-xs text-slate-900 tracking-tight"
                  style={{ color: theme?.colors?.textColor || "#0f172a" }}
                >
                  {b.title}
                </h4>
                <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                  {b.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// Store Newsletter Section
function StoreNewsletter({ business, theme = null }) {
  const primaryColor = theme?.colors?.primary || "#4F46E5";
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <div
        className="relative rounded-3xl overflow-hidden p-8 sm:p-14 text-center space-y-5 border border-slate-100 shadow-xl"
        style={{
          background: `linear-gradient(135deg, ${primaryColor}10, #FFFFFF 60%, ${primaryColor}08)`,
        }}
      >
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
          <Coins size={14} className="text-amber-500" />
          <span>Reward Perks: Get 100 ILumaa Coins On Sign Up</span>
        </div>

        <div className="space-y-2 max-w-xl mx-auto">
          <h3
            className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight"
            style={{ color: theme?.colors?.textColor || "#0f172a" }}
          >
            Stay Connected with {business?.businessName || "Our Store"}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
            Subscribe to receive exclusive early-bird product launches, limited discount alerts, and member reward perks.
          </p>
        </div>

        {subscribed ? (
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200">
            <CheckCircle2 size={16} />
            <span>Thank you for subscribing! Check your email for special welcome rewards.</span>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row items-center gap-2.5 max-w-md mx-auto pt-2 w-full"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address..."
              className="w-full text-xs p-3.5 border border-slate-200 rounded-2xl bg-white focus:outline-none focus:ring-2 transition shadow-xs"
              style={{ focusRingColor: primaryColor }}
            />
            <button
              type="submit"
              className="w-full sm:w-auto text-xs text-white px-7 py-3.5 font-bold rounded-2xl shadow-lg transition hover:opacity-90 cursor-pointer shrink-0"
              style={{ backgroundColor: primaryColor }}
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

// Collapsible FAQ Accordion Section
function StoreFAQSection({ theme = null }) {
  const [openIdx, setOpenIdx] = useState(null);
  const primaryColor = theme?.colors?.primary || "#4F46E5";

  const faqs = [
    {
      q: "How do I place an order and track its dispatch?",
      a: "Simply browse products, add your desired items to cart, and complete checkout. You will receive an instant confirmation email and order tracking updates.",
    },
    {
      q: "What payment methods are supported on this store?",
      a: "We support major Credit/Debit cards, UPI, Net Banking, digital wallets, and ILumaa reward coins with 100% encrypted secure processing.",
    },
    {
      q: "Can I request custom orders or personalized gifts?",
      a: "Yes! Many handcrafted items allow custom variations. You can contact the store directly through the contact page for customized requests.",
    },
    {
      q: "What is the return and exchange policy?",
      a: "We offer hassle-free return and exchange options for damaged or inaccurate items reported within our standard store return window.",
    },
  ];

  return (
    <section className="max-w-4xl mx-auto px-6 py-12 space-y-6">
      <div className="text-center space-y-1">
        <span
          className="text-[10px] font-extrabold uppercase tracking-widest"
          style={{ color: primaryColor }}
        >
          Customer Support
        </span>
        <h3
          className="text-2xl font-black text-slate-900 tracking-tight"
          style={{ color: theme?.colors?.textColor || "#0f172a" }}
        >
          Frequently Asked Questions
        </h3>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="rounded-2xl border border-slate-100 bg-white overflow-hidden transition-all duration-200"
              style={{ backgroundColor: theme?.colors?.cardBg || "#FFFFFF" }}
            >
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full p-4 sm:p-5 flex items-center justify-between text-left gap-4 font-bold text-xs sm:text-sm text-slate-800 cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  size={16}
                  className={`text-slate-400 transition-transform duration-300 ${
                    isOpen ? "rotate-180 text-indigo-600" : ""
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 text-xs text-slate-500 font-medium leading-relaxed border-t border-slate-50 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default function StoreHome() {
  const {
    products,
    categories,
    template,
    business,
    storeHomePath,
    banners,
    heroBanners,
    promoBanners,
    offerBanners,
  } = useStore();
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    const fetchSlides = async () => {
      if (!business?._id) return;
      try {
        const res = await baseApi.get(`/marketing/public/slides/${business._id}`);
        if (res.data && res.data.length > 0) {
          setSlides(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch slides for store template:", err);
      }
    };
    fetchSlides();
  }, [business?._id]);

  // Extract featured products
  const featuredProducts = useMemo(() => {
    const featured = products.filter((p) => p.isFeatured);
    return featured.length ? featured : products.slice(0, 4);
  }, [products]);

  // Extract latest products
  const latestProducts = useMemo(() => {
    return products.slice(0, 8);
  }, [products]);

  // If storefront layout template is published, render dynamically
  if (template && template.homeLayout && template.homeLayout.length > 0) {
    const theme = template.selectedTheme || {
      colors: {
        primary: "#4F46E5",
        secondary: "#818CF8",
        background: "#F8FAFC",
        cardBg: "#FFFFFF",
        textColor: "#0F172A",
      },
    };

    return (
      <div
        className="space-y-12 pb-16 min-h-screen transition-all duration-300"
        style={{
          backgroundColor: theme.colors?.background,
          color: theme.colors?.textColor,
          fontFamily: template.selectedFont?.fontFamily || "inherit",
        }}
      >
        {template.homeLayout.map((sec, idx) => {
          const { type, activeVariant, settings } = sec;

          // 1. HERO BLOCK
          if (type === "hero") {
            const activeHero =
              (heroBanners && heroBanners.length > 0 ? heroBanners[0] : null) ||
              banners?.find((b) => b.type === "hero") ||
              slides[0];

            const title =
              activeHero?.title ||
              settings?.title ||
              business?.businessName ||
              "Discover Our Store";
            const subtitle = activeHero?.subtitle || "✨ Handcrafted & Curated Collection";
            const desc =
              activeHero?.description ||
              activeHero?.subtitle ||
              settings?.description ||
              business?.description ||
              "Explore carefully curated products and premium shopping experience.";

            const slideImg = activeHero?.image || activeHero?.bgImage;
            const featuredProd = featuredProducts[0];
            const defaultProdImg = featuredProd
              ? featuredProd.featuredImage?.url ||
                featuredProd.featuredImage ||
                featuredProd.thumbnail?.url ||
                featuredProd.thumbnail ||
                featuredProd.image ||
                featuredProd.images?.[0]?.url ||
                featuredProd.images?.[0]
              : "";
            const displayImage = activeHero?.mobileImage || slideImg || defaultProdImg;
            const ctaText = activeHero?.buttonText || activeHero?.ctaLabel || "Shop Collection";
            const ctaUrl =
              activeHero?.targetUrl ||
              activeHero?.ctaLink ||
              (activeHero?.targetId
                ? `${storeHomePath}/product/${activeHero.targetId}`
                : `${storeHomePath}/products`);

            // Variant hero_s2: Centered Text Grid
            if (activeVariant === "hero_s2") {
              return (
                <section
                  key={sec.id || idx}
                  className="py-16 sm:py-24 text-center space-y-6 px-6 border-b border-black/[0.03] relative overflow-hidden"
                  style={{ backgroundColor: `${theme.colors?.primary}06` }}
                >
                  <span
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-xs"
                    style={{
                      backgroundColor: `${theme.colors?.primary}15`,
                      color: theme.colors?.primary,
                    }}
                  >
                    <Sparkles size={13} /> {subtitle}
                  </span>

                  <h1
                    className="text-3xl md:text-5xl lg:text-6xl font-black max-w-4xl mx-auto leading-tight"
                    style={{ color: theme.colors?.textColor }}
                  >
                    {title}
                  </h1>

                  <p className="text-sm md:text-base opacity-80 max-w-2xl mx-auto font-medium leading-relaxed">
                    {desc}
                  </p>

                  <div className="pt-2 flex items-center justify-center gap-3 flex-wrap">
                    <Link
                      to={ctaUrl}
                      className="inline-flex items-center gap-2 text-xs text-white px-8 py-3.5 font-black rounded-2xl transition hover:opacity-90 shadow-lg cursor-pointer"
                      style={{ backgroundColor: theme.colors?.primary }}
                    >
                      <span>{ctaText}</span>
                      <ArrowRight size={15} />
                    </Link>

                    <Link
                      to={`${storeHomePath}/about`}
                      className="inline-flex items-center gap-2 text-xs font-bold px-6 py-3.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition cursor-pointer"
                    >
                      About Brand
                    </Link>
                  </div>
                </section>
              );
            }

            // Variant hero_s3: Minimal Slide Card with Frosted Backdrop
            if (activeVariant === "hero_s3") {
              return (
                <section key={sec.id || idx} className="max-w-7xl mx-auto px-6 py-8">
                  <div className="relative rounded-3xl overflow-hidden min-h-[380px] sm:min-h-[460px] flex items-center justify-center p-8 sm:p-14 text-white shadow-2xl">
                    {displayImage ? (
                      <img
                        src={displayImage}
                        alt={title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className="absolute inset-0"
                        style={{
                          background: `linear-gradient(135deg, ${theme.colors?.primary}, #0f172a)`,
                        }}
                      />
                    )}
                    <div className="absolute inset-0 bg-black/45 backdrop-blur-2xs" />

                    <div className="relative z-10 max-w-2xl text-center space-y-4">
                      {subtitle && (
                        <span className="inline-block px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-white/20 backdrop-blur-md">
                          {subtitle}
                        </span>
                      )}
                      <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight drop-shadow-md">
                        {title}
                      </h1>
                      <p className="text-xs sm:text-sm text-slate-200 font-medium max-w-lg mx-auto line-clamp-2">
                        {desc}
                      </p>
                      <Link
                        to={ctaUrl}
                        className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-white text-slate-900 font-black text-xs transition hover:bg-slate-100 shadow-xl cursor-pointer"
                      >
                        <span>{ctaText}</span>
                        <ArrowRight size={15} />
                      </Link>
                    </div>
                  </div>
                </section>
              );
            }

            // Default Split Layout Slider (hero_s1)
            return (
              <section
                key={sec.id || idx}
                className="max-w-7xl mx-auto px-6 py-12"
              >
                <div
                  className="rounded-3xl p-8 sm:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 border border-black/[0.03] shadow-sm"
                  style={{ backgroundColor: `${theme.colors?.primary}08` }}
                >
                  <div className="space-y-5 max-w-xl text-left">
                    <span
                      className="text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1.5"
                      style={{ color: theme.colors?.primary }}
                    >
                      <Sparkles size={12} /> {subtitle}
                    </span>
                    <h1
                      className="text-3xl md:text-5xl font-black leading-tight tracking-tight"
                      style={{ color: theme.colors?.textColor }}
                    >
                      {title}
                    </h1>
                    <p className="text-xs sm:text-sm opacity-75 font-semibold leading-relaxed">
                      {desc}
                    </p>
                    <div className="pt-2">
                      <Link
                        to={ctaUrl}
                        className="inline-flex items-center gap-2 text-xs text-white px-7 py-3.5 font-bold rounded-2xl shadow-lg hover:opacity-90 transition cursor-pointer"
                        style={{ backgroundColor: theme.colors?.primary }}
                      >
                        <span>{ctaText}</span>
                        <ArrowRight size={15} />
                      </Link>
                    </div>
                  </div>
                  {displayImage && (
                    <div className="w-full sm:w-80 lg:w-96 shrink-0 flex justify-center">
                      <img
                        src={displayImage}
                        className="w-full aspect-square object-cover rounded-3xl shadow-xl border border-white"
                        alt={title}
                      />
                    </div>
                  )}
                </div>
              </section>
            );
          }

          // 2. CATEGORIES BLOCK
          if (type === "categories") {
            if (activeVariant === "categories_s2") {
              return (
                <section key={sec.id || idx} className="max-w-7xl mx-auto px-6 py-6">
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <Link
                      to={`${storeHomePath}/products`}
                      className="px-4 py-2 rounded-full text-xs font-bold text-white shadow-xs"
                      style={{ backgroundColor: theme.colors?.primary }}
                    >
                      All Items
                    </Link>
                    {categories.map((cat) => (
                      <Link
                        key={cat._id}
                        to={`${storeHomePath}/products?category=${encodeURIComponent(cat.name)}`}
                        className="px-4 py-2 rounded-full text-xs font-bold bg-white text-slate-700 border border-slate-200 hover:border-indigo-400 transition"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </section>
              );
            }

            return <Categories key={sec.id || idx} theme={theme} />;
          }

          // 3. FEATURED PRODUCTS BLOCK
          if (type === "featured_products") {
            return (
              <section
                key={sec.id || idx}
                className="py-12 px-6 max-w-7xl mx-auto"
              >
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                  <div className="space-y-1 text-left">
                    <span
                      className="text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1.5"
                      style={{ color: theme.colors?.primary }}
                    >
                      <Sparkles size={12} /> Curated Showcase
                    </span>
                    <h2
                      className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight"
                      style={{ color: theme.colors?.textColor }}
                    >
                      Featured Products
                    </h2>
                  </div>

                  <Link
                    to={`${storeHomePath}/products`}
                    className="text-xs font-bold flex items-center gap-1 hover:underline"
                    style={{ color: theme.colors?.primary }}
                  >
                    <span>View All</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {featuredProducts.map((product) => (
                    <ProductCard key={product._id} product={product} theme={theme} />
                  ))}
                </div>
              </section>
            );
          }

          // 4. BANNER BLOCK
          if (type === "banner" || type === "promotion" || type === "flashSale") {
            const promoList =
              promoBanners && promoBanners.length > 0
                ? promoBanners
                : (banners || []).filter((b) => b.type !== "hero");

            const firstPromo = promoList[0];
            const secondPromo = promoList[1] || offerBanners?.[0];

            if (activeVariant === "banner_s2" && firstPromo && secondPromo) {
              return (
                <section key={sec.id || idx} className="max-w-7xl mx-auto px-6 py-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {[firstPromo, secondPromo].map((b, bIdx) => (
                      <div
                        key={b._id || bIdx}
                        className="relative rounded-3xl overflow-hidden p-6 sm:p-8 flex flex-col justify-between min-h-[220px] text-white shadow-xl border border-slate-800"
                        style={{
                          backgroundColor: bIdx === 0 ? "#0f172a" : `${theme.colors?.primary}`,
                        }}
                      >
                        {b.image && (
                          <>
                            <img
                              src={b.image}
                              alt={b.title}
                              className="absolute inset-0 w-full h-full object-cover opacity-35 pointer-events-none"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none" />
                          </>
                        )}
                        <div className="relative z-10 space-y-2">
                          {b.subtitle && (
                            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-400/10 px-2.5 py-0.5 rounded-full border border-emerald-400/20 inline-block">
                              {b.subtitle}
                            </span>
                          )}
                          <h4 className="text-xl sm:text-2xl font-black">{b.title}</h4>
                          {b.description && (
                            <p className="text-xs text-slate-200 line-clamp-2">{b.description}</p>
                          )}
                        </div>
                        <div className="relative z-10 pt-4">
                          <Link
                            to={
                              b.targetUrl ||
                              (b.targetId
                                ? `${storeHomePath}/product/${typeof b.targetId === "object" ? b.targetId._id : b.targetId}`
                                : `${storeHomePath}/products`)
                            }
                            className="inline-flex items-center gap-1.5 px-6 py-3 rounded-2xl bg-white text-slate-950 font-bold text-xs shadow-lg hover:bg-slate-100 transition cursor-pointer"
                          >
                            <span>{b.buttonText || "SHOP NOW"}</span>
                            <ArrowRight size={14} />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );
            }

            return (
              <div key={sec.id || idx}>
                <BannerSection
                  bannerType={type === "flashSale" ? "flashSale" : "promotion"}
                  businessId={business?._id}
                />
              </div>
            );
          }

          // 5. FAQ BLOCK
          if (type === "faq") {
            return <StoreFAQSection key={sec.id || idx} theme={theme} />;
          }

          // 6. NEWSLETTER BLOCK
          if (type === "newsletter") {
            return (
              <StoreNewsletter
                key={sec.id || idx}
                business={business}
                theme={theme}
              />
            );
          }

          return null;
        })}
      </div>
    );
  }

  // Classic fallback UI (Professional, Rich & Polished)
  return (
    <div className="space-y-6 pb-16 bg-slate-50/50">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Trust & Quality Badges */}
      <TrustBadges />

      {/* 3. Shop By Category */}
      <Categories />

      {/* 4. Business Promotional Banner Section */}
      <BannerSection bannerType="promotion" businessId={business?._id} />

      {/* 5. Featured Products Showcase */}
      {featuredProducts.length > 0 && (
        <section className="py-12 px-6 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div className="space-y-1 text-left">
              <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles size={12} /> Curated Picks
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Featured Products
              </h2>
              <p className="text-slate-500 text-xs font-medium">
                Handpicked premium items chosen for you
              </p>
            </div>

            <Link
              to={`${storeHomePath}/products`}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition flex items-center gap-1 hover:underline"
            >
              <span>Explore All</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* 6. Flash Sale / Limited Time Mega Offer Banner */}
      <BannerSection bannerType="flashSale" businessId={business?._id} />

      {/* 7. Latest Additions Grid */}
      {latestProducts.length > 0 && (
        <section className="py-12 px-6 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div className="space-y-1 text-left">
              <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest flex items-center gap-1.5">
                <ShoppingBag size={12} /> Just Arrived
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Latest Additions
              </h2>
              <p className="text-slate-500 text-xs font-medium">
                Explore newly added items and fresh seasonal releases
              </p>
            </div>

            <Link
              to={`${storeHomePath}/products`}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition flex items-center gap-1 hover:underline"
            >
              <span>View More</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {latestProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* 8. Frequently Asked Questions */}
      <StoreFAQSection />

      {/* 9. Newsletter Subscription & Coins */}
      <StoreNewsletter business={business} />

      {/* Empty State */}
      {products.length === 0 && (
        <div className="text-center py-20 bg-white max-w-md mx-auto rounded-3xl border border-slate-100 shadow-sm p-8 space-y-3">
          <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
            <ShoppingBag size={28} />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No Products Available Yet</h3>
          <p className="text-slate-500 text-xs">
            This storefront is currently curating its inventory catalogue. Please check back soon!
          </p>
        </div>
      )}
    </div>
  );
}
