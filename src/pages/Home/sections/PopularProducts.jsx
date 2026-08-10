import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, Star, ShoppingBag } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../../../redux/reducers/cartReducer";
import toast from "react-hot-toast";
import { getFeaturedProducts } from "../../../api/productService";
import { ProductGridSkeleton } from "../../../Components/Skeletons";

const POPULAR_DATA = [
  {
    id: "pop_1",
    name: "Men Black Hoodie",
    category: "Fashion",
    price: 859,
    originalPrice: 1699,
    discount: "50%",
    rating: 4.5,
    reviews: 128,
    image:
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "pop_2",
    name: "iPhone 15 (128GB)",
    category: "Electronics",
    price: 64999,
    originalPrice: 79900,
    discount: "18%",
    rating: 4.8,
    reviews: 450,
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "pop_3",
    name: "Wooden Study Table",
    category: "Home",
    price: 4499,
    originalPrice: 7999,
    discount: "39%",
    rating: 4.2,
    reviews: 84,
    image:
      "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "pop_4",
    name: "L'Oreal Face Serum",
    category: "Beauty",
    price: 599,
    originalPrice: 999,
    discount: "40%",
    rating: 4.6,
    reviews: 210,
    image:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "pop_5",
    name: "Basketball",
    category: "Sports",
    price: 699,
    originalPrice: 1299,
    discount: "46%",
    rating: 4.4,
    reviews: 67,
    image:
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "pop_6",
    name: "The Alchemist Book",
    category: "Books",
    price: 299,
    originalPrice: 499,
    discount: "40%",
    rating: 4.7,
    reviews: 320,
    image:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&auto=format&fit=crop",
  },
];

function PopularProducts() {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((s) => s.wishlist?.items || []);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleToggleWishlist = (prod, e) => {
    e.preventDefault();
    const prodId = prod._id || prod.id;
    const isWished = wishlistItems.some(
      (i) => i._id === prodId || i.id === prodId,
    );
    dispatch(
      toggleWishlist({
        ...prod,
        _id: prodId,
        image: prod.images?.[0]?.url || prod.image,
      }),
    );
    if (isWished) {
      toast.success("Removed from Wishlist");
    } else {
      toast.success("Added to Wishlist!");
    }
  };

  const handleAddToCart = (prod, e) => {
    e.preventDefault();
    const prodId = prod._id || prod.id;
    dispatch(
      addToCart({
        product: {
          _id: prodId,
          name: prod.name,
          price: prod.price,
          image: prod.images?.[0]?.url || prod.image,
        },
        quantity: 1,
      }),
    );
    toast.success(`${prod.name} added to cart!`);
  };

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      const res = await getFeaturedProducts({ limit: 12 });
      setFeaturedProducts(res.data || res.products || []);
    } catch (err) {
      console.error("Failed to fetch featured products:", err);
      return [];
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchFeaturedProducts();
  }, []);
  return (
    <section className="py-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Popular Products
        </h2>
        <Link
          to="/products?sort=popular"
          className="text-xs sm:text-sm font-bold text-[#2563eb] hover:underline transition-colors"
        >
          See all
        </Link>
      </div>

      {loading ? (
        <ProductGridSkeleton count={6} />
      ) : (
        <div
          className="
      flex gap-4
      overflow-x-auto
      scroll-smooth
      snap-x snap-mandatory
      pb-3
      [scrollbar-width:none]
      [-ms-overflow-style:none]
      [&::-webkit-scrollbar]:hidden
    "
        >
        {featuredProducts.map((prod) => {
          const prodId = prod._id || prod.id;
          const isWished = wishlistItems.some(
            (i) => i._id === prodId || i.id === prodId,
          );

          return (
            <div
              key={prodId}
              className="
          group
          shrink-0
          w-[165px]
          sm:w-[190px]
          md:w-[210px]
          lg:w-[225px]
          snap-start
        "
            >
              {/* Product Image */}
              <div className="relative aspect-square overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
                {/* Wishlist */}
                <button
                  type="button"
                  onClick={(e) => handleToggleWishlist(prod, e)}
                  className="absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-full bg-white/90 dark:bg-slate-900/90 shadow-2xs flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                  aria-label="Add to wishlist"
                >
                  <Heart
                    size={14}
                    className={isWished ? "fill-rose-500 text-rose-500" : ""}
                  />
                </button>

                <img
                  src={prod.images[0].url}
                  alt={prod.name}
                  className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Product Details */}
              <div className="mt-3 space-y-1.5">
                <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm truncate">
                  {prod.name}
                </h3>

                <div className="flex items-baseline gap-1.5 flex-wrap">
                  <span className="text-xs sm:text-sm font-black text-slate-900">
                    ₹{prod.price.toLocaleString("en-IN")}
                  </span>

                  {prod.originalPrice && (
                    <span className="text-[10px] text-slate-400 font-semibold line-through">
                      ₹{prod.originalPrice.toLocaleString("en-IN")}
                    </span>
                  )}
                </div>

                <button
                  onClick={(e) => handleAddToCart(prod, e)}
                  className="w-full mt-2 py-1.5 bg-slate-50 hover:bg-[#2563eb] text-slate-700 hover:text-white border border-slate-200 hover:border-[#2563eb] rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <ShoppingBag size={13} />
                  <span>Add</span>
                </button>
            </div>
          </div>
        );
        })}
      </div>
      )}
    </section>
  );
}

export default PopularProducts;
