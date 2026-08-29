import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Star, Sparkles, ShoppingBag, ArrowRight } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../../../redux/reducers/cartReducer";
import { toggleWishlist } from "../../../redux/reducers/wishlistReducer";
import toast from "react-hot-toast";
import { getallProducts } from "../../../api/productService";
import { ProductGridSkeleton } from "../../../Components/Skeletons";
import ProductCard from "../../../Components/ProductCard";

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
                "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80",
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
          setNewArrivals([]);
        }
      } catch (err) {
        console.error("Failed to load new arrivals:", err);
        setNewArrivals([]);
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

  if (!loading && newArrivals.length === 0) {
    return null;
  }

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
          {newArrivals.map((prod) => (
            <ProductCard
              key={prod._id || prod.id}
              product={{
                ...prod,
                badge: prod.badge || "NEW",
              }}
              isCarousel={true}
            />
          ))}
        </div>
      )}
    </section>
  );
}
