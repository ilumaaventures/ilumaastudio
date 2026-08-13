import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import baseApi from "../../api/baseApi";
import { useStore } from "./StoreLayout";
import ProductCard from "../../Components/store/ProductCard";
import {
  ShoppingCart,
  Star,
  ArrowLeft,
  Heart,
  ShieldCheck,
  Truck,
  RefreshCw,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/reducers/cartReducer";
import toast from "react-hot-toast";

export default function ProductDetails() {
  const { id, businessName } = useParams();
  const { business, products } = useStore();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);

  // Variant selector states
  const [selectedOptions, setSelectedOptions] = useState({});

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await baseApi.get(
          `/public/store/${encodeURIComponent(businessName)}/product/${id}`,
        );
        setProduct(response.data);
        setSelectedImageIdx(0);

        // Initialize variant options
        if (
          response.data?.hasVariants &&
          response.data.optionDefinitions?.length > 0
        ) {
          const initial = {};
          response.data.optionDefinitions.forEach((opt) => {
            if (opt.values?.length > 0) {
              initial[opt.name] = opt.values[0];
            }
          });
          setSelectedOptions(initial);
        }
      } catch (err) {
        console.error("Error loading product details:", err);
        setError(
          err.response?.data?.message || "Failed to load product details",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id, businessName]);

  // Variant resolution logic
  const activeVariant = useMemo(() => {
    if (!product || !product.hasVariants || !product.variants) return null;
    return product.variants.find((v) => {
      return Object.entries(selectedOptions).every(([optName, optVal]) => {
        return v.optionValues?.[optName] === optVal;
      });
    });
  }, [product, selectedOptions]);

  const selectedPrice = activeVariant
    ? activeVariant.price
    : product?.hasVariants && product.variants && product.variants.length > 0
      ? product.variants[0].price
      : product?.price || 0;

  const selectedComparePrice = activeVariant
    ? activeVariant.compareAtPrice
    : product?.hasVariants && product.variants && product.variants.length > 0
      ? product.variants[0].compareAtPrice
      : product?.compareAtPrice;

  const selectedStock = activeVariant
    ? Number(activeVariant.stockQuantity ?? 0)
    : Number(product.inventory?.stockQuantity ?? 0);
  const discountPercent =
    selectedComparePrice && selectedComparePrice > selectedPrice
      ? Math.round(
          ((selectedComparePrice - selectedPrice) / selectedComparePrice) * 100,
        )
      : 0;

  const images =
    product.images?.length > 0
      ? product.images
      : [{ url: "https://via.placeholder.com/600x500?text=No+Image" }];

  const mainImage = useMemo(() => {
    if (
      activeVariant?.image &&
      (typeof activeVariant.image === "string"
        ? activeVariant.image
        : activeVariant.image.url)
    ) {
      return typeof activeVariant.image === "string"
        ? activeVariant.image
        : activeVariant.image.url;
    }
    return images[selectedImageIdx]?.url;
  }, [activeVariant, images, selectedImageIdx]);

  const handleAdd = () => {
    if (!product) return;
    if (selectedStock <= 0) {
      toast.error("This product/variant is out of stock");
      return;
    }
    const itemInCart = cartItems.find((item) => item._id === product._id);
    const cartQty = itemInCart ? itemInCart.quantity : 0;
    if (cartQty + quantity > selectedStock) {
      toast.error(
        `Cannot add more. Only ${selectedStock} units left in stock.`,
      );
      return;
    }
    dispatch(
      addToCart({
        product: { ...product, price: selectedPrice, stock: selectedStock },
        quantity,
      }),
    );
    toast.success(`${product.name} (${quantity}) added to cart!`);
  };

  // Find related products (same category, excluding this product)
  const relatedProducts = useMemo(() => {
    if (!product || !products) return [];
    return products
      .filter(
        (p) =>
          p.category?._id === product.category?._id && p._id !== product._id,
      )
      .slice(0, 4);
  }, [product, products]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-400 text-xs mt-3">Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-md mx-auto p-12 text-center space-y-4">
        <p className="text-rose-600 font-bold">
          {error || "Product not found"}
        </p>
        <button
          onClick={() =>
            navigate(`/${encodeURIComponent(businessName)}/products`)
          }
          className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 hover:underline cursor-pointer"
        >
          <ArrowLeft size={14} /> Back to Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 w-full text-left space-y-12">
      {/* Back link */}
      <div>
        <Link
          to={`/${encodeURIComponent(business.businessName)}/products`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-indigo-600 transition"
        >
          <ArrowLeft size={14} /> Back to Catalog
        </Link>
      </div>

      {/* Main product display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left Column: Image Gallery */}
        <div className="space-y-4">
          <div className="border border-gray-100 rounded-3xl overflow-hidden aspect-[4/3] bg-gray-50 relative">
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 z-10 bg-indigo-600 text-white text-xs font-black px-3 py-1 rounded-full shadow-sm">
                {discountPercent}% OFF
              </span>
            )}
            <img
              src={mainImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIdx(idx)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition shrink-0 ${
                    selectedImageIdx === idx
                      ? "border-indigo-600 shadow-sm"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img.url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Info & Actions */}
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="bg-indigo-50 border border-indigo-100 text-indigo-600 font-extrabold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider inline-block">
              {product.category?.name || "General"}
            </span>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-tight capitalize">
              {product.name}
            </h1>

            {/* Reviews & Ratings */}
            <div className="flex items-center gap-2">
              <div className="flex text-amber-400">
                <Star size={16} fill="currentColor" />
              </div>
              <span className="text-xs font-bold text-gray-900">
                {product.rating || "4.8"}
              </span>
              <span className="text-xs text-gray-400">
                ({product.numReviews || 8} Verified Reviews)
              </span>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100/50 flex items-baseline gap-3 flex-wrap">
            <span className="font-black text-gray-900 text-3xl">
              ₹{selectedPrice}
            </span>
            {selectedComparePrice > selectedPrice && (
              <span className="text-base text-gray-400 font-medium line-through">
                ₹{selectedComparePrice}
              </span>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Description
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed font-normal whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* Product stock indicator */}
          <div className="text-xs">
            <span className="text-gray-400 font-semibold">Availability: </span>
            {selectedStock > 0 ? (
              <span className="text-green-600 font-bold">
                In Stock ({selectedStock} available)
              </span>
            ) : (
              <span className="text-rose-600 font-bold">Out of Stock</span>
            )}
          </div>

          {/* Variant Selector */}
          {product.hasVariants && product.optionDefinitions?.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-gray-100">
              {product.optionDefinitions.map((opt) => (
                <div key={opt.name} className="space-y-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                    Select {opt.name}:{" "}
                    <span className="text-gray-900 font-bold">
                      {selectedOptions[opt.name]}
                    </span>
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {opt.values?.map((val) => {
                      const isSelected = selectedOptions[opt.name] === val;
                      const isColor =
                        opt.name.toLowerCase() === "color" ||
                        opt.name.toLowerCase() === "colour";

                      return (
                        <button
                          key={val}
                          onClick={() =>
                            setSelectedOptions((prev) => ({
                              ...prev,
                              [opt.name]: val,
                            }))
                          }
                          className={`px-4 py-2 text-xs font-bold uppercase rounded-lg border transition-all cursor-pointer ${
                            isSelected
                              ? "border-transparent bg-indigo-650 text-white shadow-sm"
                              : "border-gray-200 bg-white text-gray-650 hover:border-gray-400"
                          }`}
                          style={
                            isColor && !isSelected
                              ? {
                                  borderLeft: `4px solid ${val.toLowerCase()}`,
                                }
                              : {}
                          }
                        >
                          {val}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Qty & Add to Cart */}
          <div className="flex flex-wrap gap-4 items-center pt-4 border-t border-gray-100">
            {selectedStock > 0 && (
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden shrink-0">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3.5 py-2 hover:bg-gray-50 font-bold text-gray-600 transition cursor-pointer"
                >
                  -
                </button>
                <span className="px-4 text-xs font-bold text-gray-900">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity((q) => Math.min(selectedStock, q + 1))
                  }
                  className="px-3.5 py-2 hover:bg-gray-50 font-bold text-gray-600 transition cursor-pointer"
                >
                  +
                </button>
              </div>
            )}

            {selectedStock > 0 ? (
              <button
                onClick={handleAdd}
                className="flex-1 min-w-[180px] bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-6 py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 cursor-pointer"
              >
                <ShoppingCart size={16} /> Add to Cart
              </button>
            ) : (
              <span className="flex-1 min-w-[180px] bg-gray-100 border border-gray-200 text-gray-400 py-3 rounded-xl text-center font-bold text-xs uppercase tracking-widest select-none">
                Out of Stock
              </span>
            )}

            <button className="p-3 border border-gray-200 rounded-xl hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 text-gray-400 transition cursor-pointer">
              <Heart size={18} />
            </button>
          </div>

          {/* Highlights Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl">
              <Truck size={18} className="text-indigo-600 shrink-0" />
              <div className="text-[10px] text-gray-500 font-semibold leading-tight text-left">
                <p className="font-extrabold text-gray-900">Fast Shipping</p>
                <p>Delivery in 2-4 days</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl">
              <RefreshCw size={18} className="text-indigo-600 shrink-0" />
              <div className="text-[10px] text-gray-500 font-semibold leading-tight text-left">
                <p className="font-extrabold text-gray-900">Easy Returns</p>
                <p>7-day replacement</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl">
              <ShieldCheck size={18} className="text-indigo-600 shrink-0" />
              <div className="text-[10px] text-gray-500 font-semibold leading-tight text-left">
                <p className="font-extrabold text-gray-900">Secure checkout</p>
                <p>100% certified payments</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Grid */}
      {relatedProducts.length > 0 && (
        <div className="pt-12 border-t border-gray-100 text-left">
          <div className="mb-6">
            <h2 className="text-xl font-black text-gray-900 tracking-tight">
              You May Also Like
            </h2>
            <p className="text-gray-500 text-[10px] mt-0.5">
              Explore similar products from this collection
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
