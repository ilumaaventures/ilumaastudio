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

const getReviewCount = (reviews) => {
  if (Array.isArray(reviews)) return reviews.length;
  if (typeof reviews === "number") return reviews;
  if (typeof reviews === "object" && reviews !== null) return 1;
  return 84;
};

function ProductCard({ product }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wishlistItems = useSelector((s) => s.wishlist?.items || []);
  const prodId = product._id || product.id;
  const isWished = wishlistItems.some(
    (i) => i._id === prodId || i.id === prodId,
  );

  const origPrice = product.originalPrice || Math.round(product.price * 1.35);
  const discount =
    origPrice > product.price
      ? Math.round(((origPrice - product.price) / origPrice) * 100)
      : 0;
  const reviewsCount = getReviewCount(product.reviews);

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleWishlist({ ...product, _id: prodId }));
    if (isWished) {
      toast.success("Removed from Wishlist");
    } else {
      toast.success("Added to Wishlist!");
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(
      addToCart({
        product: {
          _id: prodId,
          name: product.name,
          price: product.price,
          image: product.image,
        },
        quantity: 1,
      }),
    );
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div
      onClick={() => navigate(`/products/${prodId}`)}
      className="group shrink-0 w-[185px] sm:w-[215px] lg:w-[230px] snap-start cursor-pointer"
    >
      {/* Image */}
      <div className="relative aspect-[0.88] overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800">
        <img
          src={product.image}
          alt={product.name}
          draggable="false"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Top Badge */}
        {product.badge && (
          <div className="absolute top-3 left-3 flex items-center gap-1">
            <span className="px-2.5 py-1 rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm text-[9px] sm:text-[10px] font-extrabold text-slate-800 dark:text-white shadow-sm">
              {product.badge}
            </span>
          </div>
        )}

        {/* Wishlist */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full backdrop-blur-sm flex items-center justify-center transition shadow-sm cursor-pointer ${
            isWished
              ? "bg-rose-500 text-white"
              : "bg-white/95 dark:bg-slate-900/95 text-slate-500 hover:text-rose-500"
          }`}
          aria-label="Add to wishlist"
        >
          <Heart size={15} fill={isWished ? "currentColor" : "none"} />
        </button>

        {/* Discount */}
        {discount > 0 && (
          <span className="absolute bottom-3 left-3 px-2 py-1 rounded-lg bg-rose-500 text-white text-[9px] font-black">
            {discount}% OFF
          </span>
        )}

        {/* Quick View */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/products/${prodId}`);
          }}
          className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm flex items-center justify-center text-slate-800 dark:text-white opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-sm"
          aria-label="View product"
        >
          <ArrowUpRight size={15} />
        </button>
      </div>

      {/* Product Info */}
      <div className="pt-3 px-0.5 space-y-1">
        <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
          {typeof product.category === "object"
            ? product.category?.name || "General"
            : product.category || "General"}
        </p>

        <div className="flex items-start gap-1">
          <h3 className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm leading-5 line-clamp-2">
            {product.name}
          </h3>
          <BadgeCheck size={14} className="shrink-0 mt-0.5 text-[#2563eb]" />
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5 pt-0.5">
          <div className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded-md">
            <Star size={10} className="fill-emerald-500 text-emerald-500" />
            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
              {product.rating || 4.8}
            </span>
          </div>
          <span className="text-[10px] text-slate-400">({reviewsCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-1.5 pt-1">
          <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
            ₹{(product.price || 0).toLocaleString("en-IN")}
          </span>
          {origPrice > product.price && (
            <span className="text-[10px] text-slate-400 font-semibold line-through">
              ₹{origPrice.toLocaleString("en-IN")}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          type="button"
          onClick={handleAddToCart}
          className="w-full mt-2 py-2 rounded-xl bg-slate-900 hover:bg-[#2563eb] text-white text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
        >
          <ShoppingBag size={13} />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
}

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
            {" "}
            <span>Sell All</span>
          </Link>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex items-stretch gap-4 sm:gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 hide-scrollbar"
      >
        {products.map((product) => (
          <ProductCard key={product._id || product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default function ProductListing() {
  const [productList, setProductList] = useState(FALLBACK_PRODUCTS);
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
            rating: p.rating || 4.8,
            reviews: Array.isArray(p.reviews)
              ? p.reviews.length
              : p.numReviews || p.reviewsCount || 84,
            sold: p.soldCount || 350,
            image:
              p.images?.[0]?.url ||
              p.image ||
              FALLBACK_PRODUCTS[idx % FALLBACK_PRODUCTS.length].image,
            badge: p.isFeatured
              ? "Featured"
              : idx % 2 === 0
                ? "Trending"
                : "Popular",
          }));
          setProductList(formatted);
        }
      } catch (err) {
        console.error("Product listing fetch fallback:", err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

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
        ) : (
          <>
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

            {/* Promo Banner 1 */}
            <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 sm:p-8 overflow-hidden shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 z-10 max-w-xl">
                <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-[11px] font-extrabold uppercase tracking-wider border border-blue-400/20">
                  Mega Festival Sale
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  Up to 40% OFF on Top Tech, Electronics & Accessories
                </h3>
                <p className="text-xs text-slate-300 font-medium">
                  Free express shipping on all orders over ₹999. Use coupon{" "}
                  <span className="font-bold text-amber-300">STUDIO40</span>.
                </p>
              </div>

              <Link
                to="/shop"
                className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-6 py-3 rounded-2xl text-xs font-black transition-all shadow-md shrink-0 flex items-center gap-1.5 cursor-pointer z-10"
              >
                <span>Shop Deals</span>
                <ArrowRight size={15} />
              </Link>
            </div>

            {/* Best Sellers Section */}
            <ProductSection
              title="Best Sellers"
              subtitle="Products customers keep coming back for"
              products={bestSellers}
              icon={<span className="text-lg">🏆</span>}
            />

            {/* Promo Banner 2 */}
            <div className="relative rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-6 sm:p-8 overflow-hidden shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 z-10 max-w-xl">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-extrabold uppercase tracking-wider border border-emerald-400/20">
                  Exclusive Brand Partners
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  Discover Authentic Local Stores & Verified Brands
                </h3>
                <p className="text-xs text-slate-300 font-medium">
                  Direct from manufacturer warranties, easy 7-day returns, and
                  100% genuine products.
                </p>
              </div>

              <Link
                to="/store"
                className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 px-6 py-3 rounded-2xl text-xs font-black transition-all shadow-md shrink-0 flex items-center gap-1.5 cursor-pointer z-10"
              >
                <span>Visit Stores</span>
                <ArrowRight size={15} />
              </Link>
            </div>

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
