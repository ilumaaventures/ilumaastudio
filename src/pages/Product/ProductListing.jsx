import React, { useRef, useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  ShoppingBag,
  Star,
  BadgeCheck,
  ArrowUpRight,
  Flame,
  ArrowRight,
  Tag,
  Sparkles,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/reducers/cartReducer";
import { toggleWishlist } from "../../redux/reducers/wishlistReducer";
import { getallProducts } from "../../api/productService";
import { ProductGridSkeleton } from "../../Components/Skeletons";
import GiftingProductsSection from "../Home/sections/GiftingProductsSection";
import NewArrivalsSection from "../Home/sections/NewArrivalsSection";
import BestSellingProducts from "../Home/sections/BestSellingProducts";
import BannerSection from "../../Components/BannerSection";
import MegaSaleBanner from "../Home/sections/MegaSaleBanner";
import toast from "react-hot-toast";

const FALLBACK_PRODUCTS = [
  {
    id: "p1",
    _id: "p1",
    name: "Premium Wireless Headphones",
    category: "Electronics",
    price: 2499,
    originalPrice: 3999,
    rating: 4.8,
    reviews: 428,
    sold: 1200,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80",
    badge: "Best Seller",
  },
  {
    id: "p2",
    _id: "p2",
    name: "Minimal Leather Backpack",
    category: "Fashion",
    price: 1899,
    originalPrice: 2999,
    rating: 4.7,
    reviews: 312,
    sold: 890,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=80",
    badge: "Trending",
  },
  {
    id: "p3",
    _id: "p3",
    name: "Smart Watch Series 5",
    category: "Electronics",
    price: 3299,
    originalPrice: 4999,
    rating: 4.6,
    reviews: 567,
    sold: 1500,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80",
    badge: "Popular",
  },
  {
    id: "p4",
    _id: "p4",
    name: "Classic Running Sneakers",
    category: "Footwear",
    price: 2199,
    originalPrice: 3499,
    rating: 4.9,
    reviews: 784,
    sold: 2100,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80",
    badge: "Top Rated",
  },
  {
    id: "p5",
    _id: "p5",
    name: "Premium Cotton Oversized T-Shirt",
    category: "Fashion",
    price: 799,
    originalPrice: 1299,
    rating: 4.5,
    reviews: 241,
    sold: 670,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=80",
    badge: "New",
  },
];

import ProductCard from "../../Components/ProductCard";

function ProductSection({ title, subtitle, products, icon }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  return (
    <div className="mb-10 sm:mb-12 last:mb-0 space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            {icon}
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {title}
            </h2>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
            {subtitle}
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <button
            onClick={() => scroll("left")}
            className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-[#2563eb] hover:text-white hover:border-[#2563eb] transition-all shadow-xs cursor-pointer"
          >
            <ChevronLeft size={16} />
          </button>

          <button
            onClick={() => scroll("right")}
            className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-[#2563eb] hover:text-white hover:border-[#2563eb] transition-all shadow-xs cursor-pointer"
          >
            <ChevronRight size={16} />
          </button>
          <Link
            to="/shop"
            className="text-xs font-bold text-[#2563eb] hover:text-[#1d4ed8] transition flex items-center gap-1"
          >
            <span>Sell All</span>
          </Link>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex items-stretch gap-4 sm:gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 hide-scrollbar"
      >
        {products.map((product) => (
          <ProductCard
            key={product._id || product.id}
            product={product}
            isCarousel={true}
          />
        ))}
      </div>
    </div>
  );
}

export default function ProductListing() {
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const res = await getallProducts({
          productType: "E-Commerce",
          limit: 50,
        });
        const list = Array.isArray(res)
          ? res
          : res?.products || res?.data || [];

        if (list.length > 0) {
          const formatted = list.map((p, idx) => ({
            id: p._id || `p_${idx}`,
            _id: p._id || `p_${idx}`,
            name: p.name || "Untitled Product",
            category:
              typeof p.category === "object"
                ? p.category?.name
                : p.category || "General",
            price: Number(p.price) || 0,
            originalPrice:
              Number(p.originalPrice) || Math.round((p.price || 0) * 1.3),
            rating: p.rating || 4.5,
            reviews: Array.isArray(p.reviews)
              ? p.reviews.length
              : p.numReviews || p.reviewsCount || 0,
            sold: p.soldCount || 0,
            image:
              p.images?.[0]?.url ||
              p.image ||
              "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80",
            badge: p.isFeatured
              ? "Featured"
              : idx % 2 === 0
                ? "Trending"
                : "Popular",
          }));
          setProductList(formatted);
        } else {
          setProductList([]);
        }
      } catch (err) {
        console.error("Product listing fetch error:", err);
        setProductList([]);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const featuredProducts = productList.filter(
    (p) => p.isFeatured || p.badge === "Featured" || p.badge === "Popular",
  );
  const trendingProducts = productList.filter(
    (p) => p.badge === "Trending" || p.badge === "Popular",
  );
  const bestSellers = [...productList].sort(
    (a, b) => (b.sold || 0) - (a.sold || 0),
  );
  const topRated = [...productList].sort(
    (a, b) => (b.rating || 0) - (a.rating || 0),
  );

  return (
    <section className="w-full py-10 sm:py-12 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Main Heading */}
        <div className="space-y-1">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#2563eb]">
            Shop Marketplace
          </span>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Discover Products You’ll Love
          </h1>

          <p className="max-w-2xl text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            Explore trending items, top rated picks, and exclusive deals from
            verified stores across ILumaaStudio.
          </p>
        </div>

        {loading ? (
          <ProductGridSkeleton count={6} />
        ) : productList.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-12 text-center space-y-3 shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-[#2563eb] flex items-center justify-center mx-auto text-2xl">
              📦
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              No Products Returned from Backend API
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto font-medium">
              We couldn't find any products in the database. Please verify your
              backend server status or add products via the admin panel.
            </p>
          </div>
        ) : (
          <>
            {/* New Arrivals Section */}
            <NewArrivalsSection />

            {/* Featured Products Section */}
            <ProductSection
              title="Featured Products"
              subtitle="Handpicked premium picks and top quality highlights"
              products={
                featuredProducts.length > 0 ? featuredProducts : productList
              }
              icon={
                <Sparkles size={20} className="text-amber-500 fill-amber-500" />
              }
            />

            {/* Trending Section */}
            <ProductSection
              title="Trending Now"
              subtitle="What shoppers are discovering right now"
              products={
                trendingProducts.length > 0 ? trendingProducts : productList
              }
              icon={
                <Flame size={20} className="text-orange-500 fill-orange-500" />
              }
            />

            {/* Promo Banner 1 - Dynamic Auto-carousel */}
            <MegaSaleBanner
              bannerType="promotion"
              title="Up to 40% OFF on Top Tech & Accessories"
              description="Free express shipping on all orders over ₹999. Use coupon STUDIO40."
              imageUrl="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80"
              linkUrl="/shop"
            />

            {/* Dedicated Best Selling Products Section */}
            <BestSellingProducts />

            {/* Featured Gifting Products Section */}
            <GiftingProductsSection />

            {/* Category / Campaign Banners */}
            <BannerSection bannerType="category" />

            {/* Promo Banner 2 - Dynamic Auto-carousel */}
            <BannerSection bannerType="flashSale" />

            {/* Top Rated Section */}
            <ProductSection
              title="Top Rated Picks"
              subtitle="Highly rated products loved by our community"
              products={topRated}
              icon={
                <Star size={19} className="text-amber-400 fill-amber-400" />
              }
            />
          </>
        )}
      </div>
    </section>
  );
}
