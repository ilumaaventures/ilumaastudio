import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Star, Sparkles, ShoppingBag, ArrowRight } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../../../redux/reducers/cartReducer";
import { toggleWishlist } from "../../../redux/reducers/wishlistReducer";
import toast from "react-hot-toast";
import { getallProducts } from "../../../api/productService";
import { ProductGridSkeleton } from "../../../Components/Skeletons";

const FALLBACK_NEW_ARRIVALS = [
  {
    _id: "new_1",
    id: "new_1",
    name: "Wireless ANC Earbuds Pro",
    category: "Electronics",
    price: 3499,
    originalPrice: 4999,
    rating: 4.8,
    reviews: 94,
    image:
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },
  {
    _id: "new_2",
    id: "new_2",
    name: "Minimalist Smart Fitness Band",
    category: "Electronics",
    price: 2199,
    originalPrice: 2999,
    rating: 4.7,
    reviews: 62,
    image:
      "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },
  {
    _id: "new_3",
    id: "new_3",
    name: "Ergonomic Mechanical Keyboard",
    category: "Electronics",
    price: 4999,
    originalPrice: 6999,
    rating: 4.9,
    reviews: 118,
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },
  {
    _id: "new_4",
    id: "new_4",
    name: "Classic Denim Oversized Jacket",
    category: "Fashion",
    price: 1899,
    originalPrice: 2799,
    rating: 4.6,
    reviews: 45,
    image:
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },
  {
    _id: "new_5",
    id: "new_5",
    name: "Handcrafted Ceramic Coffee Mug Set",
    category: "Home & Kitchen",
    price: 899,
    originalPrice: 1299,
    rating: 4.8,
    reviews: 83,
    image:
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },
];

export default function NewArrivalsSection() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wishlistItems = useSelector((s) => s.wishlist?.items || []);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        setLoading(true);
        const res = await getallProducts({ sort: "newest", limit: 12 });
        const list = Array.isArray(res)
          ? res
          : res?.products || res?.data || [];

        if (list.length > 0) {
          setNewArrivals(
            list.map((p, idx) => ({
              _id: p._id || `na_${idx}`,
              id: p._id || `na_${idx}`,
              name: p.name || "Untitled New Arrival",
              category:
                typeof p.category === "object"
                  ? p.category?.name
                  : p.category || "General",
              price: Number(p.price) || 0,
              originalPrice:
                Number(p.originalPrice) || Math.round((p.price || 0) * 1.3),
              rating: p.rating || 4.7,
              reviews: p.numReviews || p.reviews?.length || 32,
              image:
                p.images?.[0]?.url ||
                p.image ||
                FALLBACK_NEW_ARRIVALS[idx % FALLBACK_NEW_ARRIVALS.length].image,
              inStock: (() => {
                const s =
                  p.inventory?.stockQuantity !== undefined
                    ? Number(p.inventory.stockQuantity)
                    : p.stockQuantity !== undefined
                    ? Number(p.stockQuantity)
                    : p.stock !== undefined
                    ? Number(p.stock)
                    : p.countInStock !== undefined
                    ? Number(p.countInStock)
                    : 1;
                return s > 0;
              })(),
            }))
          );
        } else {
          setNewArrivals(FALLBACK_NEW_ARRIVALS);
        }
      } catch (err) {
        console.error("Failed to load new arrivals:", err);
        setNewArrivals(FALLBACK_NEW_ARRIVALS);
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  const handleToggleWishlist = (prod, e) => {
    e.preventDefault();
    e.stopPropagation();
    const prodId = prod._id || prod.id;
    const isWished = wishlistItems.some(
      (i) => (i._id || i.id || i) === prodId || String(i) === String(prodId)
    );
    dispatch(toggleWishlist({ ...prod, _id: prodId }));
    if (isWished) {
      toast.success("Removed from Wishlist");
    } else {
      toast.success("Added to Wishlist!");
    }
  };

  const handleAddToCart = (prod, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!prod.inStock) {
      toast.error("Sorry, this product is currently out of stock!");
      return;
    }
    dispatch(
      addToCart({
        product: {
          _id: prod._id || prod.id,
          name: prod.name,
          price: prod.price,
          image: prod.image,
        },
        quantity: 1,
      })
    );
    toast.success(`${prod.name} added to cart!`);
  };

  return (
    <section className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="text-emerald-500 fill-emerald-500" size={20} />
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              New Arrivals
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            Freshly added styles, tech, and everyday essentials
          </p>
        </div>

        <Link
          to="/shop?sort=Newest"
          className="text-xs sm:text-sm font-extrabold text-[#2563eb] hover:underline transition-colors flex items-center gap-1"
        >
          <span>View All New</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {loading ? (
        <ProductGridSkeleton count={5} />
      ) : (
        <div className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {newArrivals.map((prod) => {
            const prodId = prod._id || prod.id;
            const isWished = wishlistItems.some(
              (i) => (i._id || i.id || i) === prodId || String(i) === String(prodId)
            );

            return (
              <div
                key={prodId}
                onClick={() => navigate(`/products/${prodId}`)}
                className="group shrink-0 w-[175px] sm:w-[200px] md:w-[220px] snap-start cursor-pointer flex flex-col justify-between bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3 shadow-2xs hover:shadow-md transition-all"
              >
                {/* Image Box */}
                <div className="relative aspect-square overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
                  <span className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-black tracking-wider uppercase shadow-xs">
                    NEW
                  </span>

                  <button
                    type="button"
                    onClick={(e) => handleToggleWishlist(prod, e)}
                    className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-white/90 dark:bg-slate-900/90 shadow-2xs flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                  >
                    <Heart
                      size={14}
                      className={isWished ? "fill-rose-500 text-rose-500" : ""}
                    />
                  </button>

                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Details */}
                <div className="mt-3 space-y-1">
                  <p className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400">
                    {prod.category}
                  </p>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-xs leading-4 line-clamp-2">
                    {prod.name}
                  </h3>

                  <div className="flex items-center gap-1.5 pt-0.5">
                    <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                      ₹{(prod.price || 0).toLocaleString("en-IN")}
                    </span>
                    {prod.originalPrice > prod.price && (
                      <span className="text-[10px] text-slate-400 font-semibold line-through">
                        ₹{prod.originalPrice.toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>

                  {/* Stock Status Indicator */}
                  <div
                    className={`text-[9px] font-bold flex items-center gap-1 pt-1 ${
                      prod.inStock
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-rose-600 dark:text-rose-400"
                    }`}
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        prod.inStock ? "bg-emerald-500" : "bg-rose-500"
                      }`}
                    />
                    <span>{prod.inStock ? "In Stock" : "Out of Stock"}</span>
                  </div>

                  {/* Add to Cart / Out of Stock Button */}
                  {prod.inStock ? (
                    <button
                      type="button"
                      onClick={(e) => handleAddToCart(prod, e)}
                      className="w-full mt-2 py-1.5 bg-slate-900 hover:bg-[#2563eb] text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <ShoppingBag size={12} />
                      <span>Add to Cart</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="w-full mt-2 py-1.5 bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-not-allowed"
                    >
                      <span>Out of Stock</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
