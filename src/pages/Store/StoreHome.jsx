import React, { useMemo, useState, useEffect } from "react";
import Hero from "../../Components/store/Hero";
import Categories from "../../Components/store/Categories";
import ProductCard from "../../Components/store/ProductCard";
import { useStore } from "./StoreLayout";
import { Sparkles, ShoppingBag, Mail, Megaphone } from "lucide-react";
import baseApi from "../../api/baseApi";

export default function StoreHome() {
  const { products, categories, template, business } = useStore();
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
    if (featured.length === 0) {
      return products.slice(0, 4);
    }
    return featured.slice(0, 4);
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
        background: "#F3F4F6",
        cardBg: "#FFFFFF",
        textColor: "#1F2937",
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
            const activeSlide = slides[0];
            const title = activeSlide?.title || settings?.title || "Discover talentcio";
            const desc = activeSlide?.subtitle || settings?.description || "Explore carefully curated products and premium shopping experience.";
            const slideImg = activeSlide?.bgImage;
            const featuredProd = featuredProducts[0];
            const defaultProdImg = featuredProd ? (featuredProd.featuredImage?.url || featuredProd.featuredImage || featuredProd.thumbnail?.url || featuredProd.thumbnail || featuredProd.image || featuredProd.images?.[0]?.url || featuredProd.images?.[0]) : "";
            const displayImage = slideImg || defaultProdImg;

            if (activeVariant === "hero_s2") {
              return (
                <section
                  key={sec.id || idx}
                  className="py-16 text-center space-y-4 px-6 border-b border-black/[0.03]"
                  style={{ backgroundColor: `${theme.colors?.primary}05` }}
                >
                  <h1
                    className="text-3xl md:text-5xl font-black max-w-2xl mx-auto leading-tight"
                    style={{ color: theme.colors?.textColor }}
                  >
                    {title}
                  </h1>
                  <p className="text-sm opacity-80 max-w-lg mx-auto font-medium">
                    {desc}
                  </p>
                  <button
                    className="text-xs text-white px-6 py-2.5 font-bold rounded-xl transition hover:opacity-90 shadow-sm mx-auto block cursor-pointer"
                    style={{ backgroundColor: theme.colors?.primary }}
                  >
                    Shop Collection
                  </button>
                </section>
              );
            }

            // Split Layout Slider (hero_s1 or fallback)
            return (
              <section
                key={sec.id || idx}
                className="max-w-7xl mx-auto px-6 py-12"
              >
                <div
                  className="rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 border border-black/[0.03]"
                  style={{ backgroundColor: `${theme.colors?.primary}08` }}
                >
                  <div className="space-y-4 max-w-xl text-left">
                    <span
                      className="text-[10px] font-extrabold text-indigo-650 uppercase tracking-widest flex items-center gap-1.5"
                      style={{ color: theme.colors?.primary }}
                    >
                      <Sparkles size={12} /> Special Welcome
                    </span>
                    <h1
                      className="text-3xl md:text-5xl font-black leading-tight"
                      style={{ color: theme.colors?.textColor }}
                    >
                      {title}
                    </h1>
                    <p className="text-xs opacity-75 font-semibold leading-relaxed">
                      {desc}
                    </p>
                    <button
                      className="text-xs text-white px-6 py-2.5 font-bold rounded-xl shadow hover:opacity-90 transition cursor-pointer"
                      style={{ backgroundColor: theme.colors?.primary }}
                    >
                      Explore Catalog
                    </button>
                  </div>
                  {displayImage && (
                    <div className="w-full md:w-72 shrink-0">
                      <img
                        src={displayImage}
                        className="w-full aspect-square object-cover rounded-2xl shadow-md border border-white"
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
            return (
              <section
                key={sec.id || idx}
                className="max-w-7xl mx-auto px-6 py-6"
              >
                <div className="flex flex-col mb-6 text-left">
                  <h3
                    className="text-lg font-black text-gray-900 tracking-tight"
                    style={{ color: theme.colors?.textColor }}
                  >
                    Browse Categories
                  </h3>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none justify-start">
                  {categories.map((cat) => (
                    <div
                      key={cat._id}
                      className="flex flex-col items-center gap-2 shrink-0 group cursor-pointer"
                    >
                      <div
                        className="w-14 h-14 rounded-full border border-gray-150 flex items-center justify-center font-bold text-sm bg-white transition hover:scale-105"
                        style={{ color: theme.colors?.primary }}
                      >
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                      <span className="text-[11px] font-bold text-gray-650 group-hover:text-gray-900">
                        {cat.name}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          // 3. FEATURED PRODUCTS BLOCK
          if (type === "featured_products") {
            return (
              <section
                key={sec.id || idx}
                className="py-12"
                style={{ backgroundColor: theme.colors?.cardBg }}
              >
                <div className="max-w-7xl mx-auto px-6">
                  <div className="flex flex-col mb-8 text-left">
                    <span
                      className="text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1.5 mb-1.5"
                      style={{ color: theme.colors?.primary }}
                    >
                      <Sparkles size={12} /> Dynamic Showcase
                    </span>
                    <h2
                      className="text-2xl font-black text-gray-900 tracking-tight"
                      style={{ color: theme.colors?.textColor }}
                    >
                      Featured Products
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {featuredProducts.map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </div>
                </div>
              </section>
            );
          }

          // 4. BANNER BLOCK
          if (type === "banner") {
            return (
              <section key={sec.id || idx} className="max-w-7xl mx-auto px-6">
                <div
                  className="rounded-2xl p-4 text-center text-xs font-black text-white uppercase tracking-wider flex items-center justify-center gap-2"
                  style={{ backgroundColor: theme.colors?.primary }}
                >
                  <Megaphone size={14} />
                  Mega Offer: Join loyalty programs to receive coin rewards!
                </div>
              </section>
            );
          }

          // 5. NEWSLETTER BLOCK
          if (type === "newsletter") {
            return (
              <section
                key={sec.id || idx}
                className="max-w-7xl mx-auto px-6 py-6"
              >
                <div
                  className="p-8 rounded-2xl border text-center space-y-3 bg-white"
                  style={{ borderColor: `${theme.colors?.primary}20` }}
                >
                  <h4
                    className="text-lg font-black"
                    style={{ color: theme.colors?.textColor }}
                  >
                    Join our Newsletter
                  </h4>
                  <p className="text-xs opacity-75 font-semibold max-w-xs mx-auto">
                    Subscribe to stay updated with discounts and key additions.
                  </p>
                  <div className="flex gap-2 max-w-md mx-auto pt-2">
                    <input
                      type="email"
                      placeholder="Enter your email address..."
                      className="w-full text-xs p-2.5 border border-gray-200 rounded-xl bg-gray-50/50 outline-none"
                    />
                    <button
                      className="text-xs text-white px-5 font-bold rounded-xl cursor-pointer transition hover:opacity-90"
                      style={{ backgroundColor: theme.colors?.primary }}
                    >
                      Subscribe
                    </button>
                  </div>
                </div>
              </section>
            );
          }

          return null;
        })}
      </div>
    );
  }

  // Classic fallback UI
  return (
    <div className="space-y-6 pb-16">
      <Hero />
      <Categories />
      {featuredProducts.length > 0 && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col mb-8 text-left">
              <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
                <Sparkles size={12} /> Curated Picks
              </span>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                Featured Products
              </h2>
              <p className="text-gray-500 text-xs mt-0.5">
                Handpicked premium items for you
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {latestProducts.length > 0 && (
        <section className="py-12 bg-gray-50/50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col mb-8 text-left">
              <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
                <ShoppingBag size={12} /> Just Arrived
              </span>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                Latest Additions
              </h2>
              <p className="text-gray-500 text-xs mt-0.5">
                Explore our newly added collection
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {latestProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {products.length === 0 && (
        <div className="text-center py-20 bg-white">
          <ShoppingBag size={48} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-semibold text-sm">
            No products found in this store yet.
          </p>
        </div>
      )}
    </div>
  );
}
