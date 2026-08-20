import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Star, Gift, ShoppingBag, ArrowRight } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../../../redux/reducers/cartReducer";
import { toggleWishlist } from "../../../redux/reducers/wishlistReducer";
import toast from "react-hot-toast";
import { getallProducts } from "../../../api/productService";
import { ProductGridSkeleton } from "../../../Components/Skeletons";

const FALLBACK_GIFTING_PRODUCTS = [
  {
    _id: "gift_1",
    id: "gift_1",
    name: "Luxury Artisanal Chocolate Gift Box",
    category: "Gifting & Sweets",
    price: 1299,
    originalPrice: 1999,
    discount: "35%",
    rating: 4.9,
    reviews: 184,
    image:
      "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },
  {
    _id: "gift_2",
    id: "gift_2",
    name: "Scented Soy Candle Gift Set",
    category: "Home & Decor",
    price: 999,
    originalPrice: 1499,
    discount: "33%",
    rating: 4.8,
    reviews: 142,
    image:
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },
  {
    _id: "gift_3",
    id: "gift_3",
    name: "Personalized Engraved Leather Wallet Set",
    category: "Personalised Gifts",
    price: 1799,
    originalPrice: 2499,
    discount: "28%",
    rating: 4.7,
    reviews: 96,
    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },
  {
    _id: "gift_4",
    id: "gift_4",
    name: "Premium Organic Tea Assortment Chest",
    category: "Gourmet Gifting",
    price: 1499,
    originalPrice: 2199,
    discount: "31%",
    rating: 4.9,
    reviews: 210,
    image:
      "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },
  {
    _id: "gift_5",
    id: "gift_5",
    name: "Handcrafted Festive Gift Hamper",
    category: "Festive Gifting",
    price: 2499,
    originalPrice: 3499,
    discount: "28%",
    rating: 4.8,
    reviews: 78,
    image:
      "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=600&q=80",
    inStock: true,
  },
];

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
                FALLBACK_GIFTING_PRODUCTS[
                  idx % FALLBACK_GIFTING_PRODUCTS.length
                ].image,
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
          setGiftingProducts(FALLBACK_GIFTING_PRODUCTS);
        }
      } catch (err) {
        console.error("Failed to load gifting products:", err);
        setGiftingProducts(FALLBACK_GIFTING_PRODUCTS);
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
          {giftingProducts.map((prod) => {
            const prodId = prod._id || prod.id;
            const isWished = wishlistItems.some(
              (i) => i._id === prodId || i.id === prodId,
            );

            return (
              <div
                key={prodId}
                onClick={() => navigate(`/products/${prodId}`)}
                className="group shrink-0 w-[175px] sm:w-[200px] md:w-[220px] snap-start cursor-pointer flex flex-col justify-between bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-950/40 rounded-2xl p-3 shadow-2xs hover:shadow-md transition-all"
              >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden rounded-xl bg-purple-50/50 dark:bg-slate-800">
                  <span className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full bg-purple-600 text-white text-[9px] font-black tracking-wider uppercase shadow-xs">
                    Gift Special
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

                {/* Info */}
                <div className="mt-3 space-y-1">
                  <p className="text-[9px] uppercase tracking-wider font-extrabold text-purple-600 dark:text-purple-400">
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
                      className="w-full mt-2 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
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
