import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Star,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Award,
  ShieldCheck,
  ThumbsUp,
} from "lucide-react";
import ProductCard from "../../../Components/ProductCard";
import { getProducts } from "../../../api/productService";
import { ProductGridSkeleton } from "../../../Components/Skeletons";

const FALLBACK_TOP_RATED = [
  {
    _id: "rated_1",
    name: "Ceramic Minimalist Tealight Candle Lanterns (Set of 2)",
    price: 890,
    originalPrice: 1250,
    images: [
      {
        url: "https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=600&auto=format&fit=crop",
      },
    ],
    category: "Decor & Hampers",
    rating: 5.0,
    reviewsCount: 382,
    badge: "5.0 ★ Pick",
    description:
      "Hand-thrown matte ceramic candle holders with delicate ambient light perforation.",
  },
  {
    _id: "rated_2",
    name: "Pure Mulberry Raw Silk Hand-Rolled Scarf",
    price: 2450,
    originalPrice: 3200,
    images: [
      {
        url: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=600&auto=format&fit=crop",
      },
    ],
    category: "Fashion & Leather",
    rating: 4.95,
    reviewsCount: 214,
    badge: "Top Rated",
    description:
      "Grade-6A 100% pure organic mulberry silk with artisanal hand-rolled hem edges.",
  },
  {
    _id: "rated_3",
    name: "Handcrafted Wild Honey & Lavender Gourmet Hamper",
    price: 3800,
    originalPrice: 4999,
    images: [
      {
        url: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600&auto=format&fit=crop",
      },
    ],
    category: "Decor & Hampers",
    rating: 5.0,
    reviewsCount: 168,
    badge: "5.0 ★ Pick",
    description:
      "Curated organic forest honey, calming lavender tea tin, and wax-sealed keepsake gift box.",
  },
  {
    _id: "rated_4",
    name: "Spatial Hi-Fi Wireless Studio Earbuds ANC",
    price: 4999,
    originalPrice: 6999,
    images: [
      {
        url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600&auto=format&fit=crop",
      },
    ],
    category: "Electronics & Sound",
    rating: 4.9,
    reviewsCount: 420,
    badge: "Audiophile 4.9★",
    description:
      "Hybrid active noise cancellation, custom beryllium dynamic drivers, and 36h playback.",
  },
  {
    _id: "rated_5",
    name: "Tuscan Vachetta Full-Grain Leather Weekender Bag",
    price: 8450,
    originalPrice: 10999,
    images: [
      {
        url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop",
      },
    ],
    category: "Fashion & Leather",
    rating: 4.98,
    reviewsCount: 96,
    badge: "5.0 ★ Pick",
    description:
      "Vegetable-tanned Florentine leather with solid brass hardware and monogram luggage tag.",
  },
  {
    _id: "rated_6",
    name: "Botanical Ceramide Hydrating Nectar Serum",
    price: 1850,
    originalPrice: 2400,
    images: [
      {
        url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600&auto=format&fit=crop",
      },
    ],
    category: "Beauty & Aromatics",
    rating: 4.92,
    reviewsCount: 310,
    badge: "Best Formula",
    description:
      "Multi-molecular hyaluronic acid and fermented camellia oil for 72h dewy skin barrier repair.",
  },
  {
    _id: "rated_7",
    name: "Reine de Genève Solitaire Brilliant Diamond Ring",
    price: 18500,
    originalPrice: 22000,
    images: [
      {
        url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop",
      },
    ],
    category: "Decor & Hampers",
    rating: 5.0,
    reviewsCount: 75,
    badge: "GIA 5.0★",
    description:
      "GIA certified D-flawless center brilliant diamond set in 18k solid gold pavé mounting.",
  },
  {
    _id: "rated_8",
    name: "AeroPulse Carbon Fiber Marathon Propulsion Runner",
    price: 18999,
    originalPrice: 22999,
    images: [
      {
        url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop",
      },
    ],
    category: "Fashion & Leather",
    rating: 4.94,
    reviewsCount: 154,
    badge: "Runner's Choice",
    description:
      "Full-length curved carbon propulsion plate with nitrogen-infused gas foam for 89% energy return.",
  },
];

const CATEGORIES = [
  "All Picks",
  "Decor & Hampers",
  "Electronics & Sound",
  "Fashion & Leather",
  "Beauty & Aromatics",
];

export default function TopRated() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All Picks");
  const scrollRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    const loadTopRated = async () => {
      try {
        setLoading(true);
        const res = await getProducts({ limit: 12 });
        const list = Array.isArray(res)
          ? res
          : res?.products || res?.data || [];

        if (isMounted) {
          if (list.length > 0) {
            // Sort by rating descending or filter top rated >= 4.5
            const highRated = [...list].sort(
              (a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0),
            );
            // If less than 4 items, merge with fallback
            if (highRated.length < 4) {
              setProducts([
                ...highRated,
                ...FALLBACK_TOP_RATED.slice(highRated.length),
              ]);
            } else {
              setProducts(highRated);
            }
          } else {
            setProducts(FALLBACK_TOP_RATED);
          }
        }
      } catch (err) {
        console.error("Failed to fetch top rated products:", err);
        if (isMounted) {
          setProducts(FALLBACK_TOP_RATED);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadTopRated();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const offset = direction === "left" ? -340 : 340;
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  const filteredProducts = products.filter((p) => {
    if (selectedCategory === "All Picks") return true;
    const cat =
      typeof p.category === "object"
        ? p.category?.name || p.category?.title || ""
        : p.category || "";
    return cat
      .toLowerCase()
      .includes(selectedCategory.split(" ")[0].toLowerCase());
  });

  return (
    <section className="py-3 sm:py-3 bg-gradient-to-b from-white via-amber-50/20 to-white border-y border-amber-100/60 relative overflow-hidden">
      {/* Subtle Golden Ambient Radiance */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-amber-100/30 rounded-full blur-3xl pointer-events-none translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        {/* Header with 5-Star Community Rating Badge & Nav Arrows */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/70 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Top Rated Picks
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Customer-acclaimed bestsellers with flawless 5-star ratings,
              exceptional craft, and verified buyer satisfaction.
            </p>
          </div>

          {/* Right Action: Category & Scroll Buttons */}
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <Link
              to="/products?sort=rating"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50/80 hover:bg-blue-100 border border-blue-100/80 transition-all duration-200 shadow-2xs group shrink-0"
            >
              <span>See All</span>
              <ArrowRight
                size={13}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </div>

        {loading ? (
          <ProductGridSkeleton count={6} />
        ) : (
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-none  px-1"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {filteredProducts.map((prod) => (
              <ProductCard
                key={prod._id || prod.id}
                product={prod}
                isCarousel={true}
              />
            ))}
          </div>
        )}

        {/* Bottom Proof Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-200/60 font-sans text-xs">
          <div className="flex items-center gap-3 bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <Award size={16} />
            </div>
            <div>
              <span className="font-bold text-slate-900 block">
                Strict Quality Audit
              </span>
              <span className="text-slate-500 text-[11px]">
                Hand-inspected before packaging
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <ThumbsUp size={16} />
            </div>
            <div>
              <span className="font-bold text-slate-900 block">
                99.4% Positive Ratings
              </span>
              <span className="text-slate-500 text-[11px]">
                Real verified customer reviews
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <ShieldCheck size={16} />
            </div>
            <div>
              <span className="font-bold text-slate-900 block">
                Free Exchange
              </span>
              <span className="text-slate-500 text-[11px]">
                Based on product condition and business policy.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
