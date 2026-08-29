import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Star, Gift, ShoppingBag, ArrowRight } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../../../redux/reducers/cartReducer";
import { toggleWishlist } from "../../../redux/reducers/wishlistReducer";
import toast from "react-hot-toast";
import { getallProducts } from "../../../api/productService";
import { ProductGridSkeleton } from "../../../Components/Skeletons";
import ProductCard from "../../../Components/ProductCard";

export default function GiftingProductsSection() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wishlistItems = useSelector((s) => s.wishlist?.items || []);
  const [giftingProducts, setGiftingProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGiftingProducts = async () => {
      try {
        setLoading(true);
        const res = await getallProducts({ productType: "Gifting", limit: 12 });
        const list = Array.isArray(res)
          ? res
          : res?.products || res?.data || [];

        const filtered = list.filter(
          (p) =>
            p.productType === "Gifting" ||
            p.listAs?.includes("gift") ||
            p.category?.name?.toLowerCase().includes("gift") ||
            p.tags?.some((t) => String(t).toLowerCase().includes("gift")),
        );

        if (filtered.length > 0) {
          setGiftingProducts(
            filtered.map((p, idx) => ({
              _id: p._id || `g_${idx}`,
              id: p._id || `g_${idx}`,
              name: p.name || "Untitled Gift Item",
              category:
                typeof p.category === "object"
                  ? p.category?.name
                  : p.category || "Gifting",
              price: Number(p.price) || 0,
              originalPrice:
                Number(p.originalPrice) || Math.round((p.price || 0) * 1.3),
              rating: p.rating || 4.8,
              reviews: p.numReviews || p.reviews?.length || 45,
              image:
                p.images?.[0]?.url ||
                p.image ||
                "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=600&q=80",
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
            })),
          );
        } else {
          setGiftingProducts([]);
        }
      } catch (err) {
        console.error("Failed to load gifting products:", err);
        setGiftingProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchGiftingProducts();
  }, []);

  const handleToggleWishlist = (prod, e) => {
    e.preventDefault();
    e.stopPropagation();
    const prodId = prod._id || prod.id;
    const isWished = wishlistItems.some(
      (i) => i._id === prodId || i.id === prodId,
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
      toast.error("Sorry, this gift item is out of stock!");
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
      }),
    );
    toast.success(`${prod.name} added to cart!`);
  };

  if (!loading && giftingProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Gift className="text-purple-600 dark:text-purple-400" size={22} />
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Gifting Products & Hampers
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            Thoughtfully curated gift sets, hampers and personalized surprises
          </p>
        </div>

        <Link
          to="https://gifterilumaastudio.vercel.app/"
          className="text-xs sm:text-sm font-extrabold text-purple-600 dark:text-purple-400 hover:text-purple-700 transition-colors flex items-center gap-1"
        >
          <span>Explore All Gifts</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {loading ? (
        <ProductGridSkeleton count={5} />
      ) : (
        <div className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {giftingProducts.map((prod) => (
            <ProductCard
              key={prod._id || prod.id}
              product={{
                ...prod,
                badge: prod.badge || "GIFT SPECIAL",
              }}
              isCarousel={true}
            />
          ))}
        </div>
      )}
    </section>
  );
}
