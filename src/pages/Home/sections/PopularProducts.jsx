import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Star, ShoppingBag, Flame } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../../../redux/reducers/cartReducer";
import { toggleWishlist } from "../../../redux/reducers/wishlistReducer";
import toast from "react-hot-toast";
import { getFeaturedProducts } from "../../../api/productService";
import { ProductGridSkeleton } from "../../../Components/Skeletons";
import ProductCard from "../../../Components/ProductCard";

const FALLBACK_POPULAR = [
  {
    _id: "pop_1",
    id: "pop_1",
    name: "Men Black Oversized Premium Hoodie",
    category: "Fashion",
    price: 859,
    originalPrice: 1699,
    rating: 4.5,
    reviews: 128,
    image:
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=400&auto=format&fit=crop",
    inStock: true,
  },
  {
    _id: "pop_2",
    id: "pop_2",
    name: "iPhone 15 Pro Max (256GB)",
    category: "Electronics",
    price: 64999,
    originalPrice: 79900,
    rating: 4.8,
    reviews: 450,
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=400&auto=format&fit=crop",
    inStock: true,
  },
  {
    _id: "pop_3",
    id: "pop_3",
    name: "Solid Wooden Ergonomic Study Desk",
    category: "Home & Office",
    price: 4499,
    originalPrice: 7999,
    rating: 4.6,
    reviews: 84,
    image:
      "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=400&auto=format&fit=crop",
    inStock: true,
  },
  {
    _id: "pop_4",
    id: "pop_4",
    name: "Hydrating Facial Repair Serum",
    category: "Beauty",
    price: 599,
    originalPrice: 999,
    rating: 4.6,
    reviews: 210,
    image:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=400&auto=format&fit=crop",
    inStock: true,
  },
  {
    _id: "pop_5",
    id: "pop_5",
    name: "Pro Official Match Basketball",
    category: "Sports",
    price: 699,
    originalPrice: 1299,
    rating: 4.4,
    reviews: 67,
    image:
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=400&auto=format&fit=crop",
    inStock: true,
  },
];

function PopularProducts() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wishlistItems = useSelector((s) => s.wishlist?.items || []);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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
      toast.error("Sorry, this item is currently out of stock!");
      return;
    }
    const prodId = prod._id || prod.id;
    dispatch(
      addToCart({
        product: {
          _id: prodId,
          name: prod.name,
          price: prod.price,
          image: prod.image,
        },
        quantity: 1,
      })
    );
    toast.success(`${prod.name} added to cart!`);
  };

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      const res = await getFeaturedProducts({ limit: 10 });
      const list = Array.isArray(res)
        ? res
        : res?.products || res?.data || [];

      if (list.length > 0) {
        setFeaturedProducts(
          list.map((p, idx) => ({
            _id: p._id || `pop_${idx}`,
            id: p._id || `pop_${idx}`,
            name: p.name || "Untitled Product",
            category:
              typeof p.category === "object"
                ? p.category?.name
                : p.category || "General",
            price: Number(p.price) || 0,
            originalPrice:
              Number(p.originalPrice) || Math.round((p.price || 0) * 1.35),
            rating: p.rating || 4.6,
            reviews: p.numReviews || p.reviews?.length || 54,
            image:
              p.images?.[0]?.url ||
              p.image ||
              FALLBACK_POPULAR[idx % FALLBACK_POPULAR.length].image,
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
        setFeaturedProducts(FALLBACK_POPULAR);
      }
    } catch (err) {
      console.error("Failed to fetch featured products:", err);
      setFeaturedProducts(FALLBACK_POPULAR);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  return (
    <section className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="text-orange-500 fill-orange-500" size={22} />
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Popular Products
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            Top choices shoppers are adding to their cart today
          </p>
        </div>

        <Link
          to="/shop?sort=Popularity"
          className="text-xs sm:text-sm font-extrabold text-[#2563eb] hover:underline transition-colors flex items-center gap-1"
        >
          <span>See All Popular</span>
          <span className="text-base">&rarr;</span>
        </Link>
      </div>

      {loading ? (
        <ProductGridSkeleton count={5} />
      ) : (
        <div className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {featuredProducts.map((prod) => (
            <ProductCard
              key={prod._id || prod.id}
              product={prod}
              isCarousel={true}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default PopularProducts;
