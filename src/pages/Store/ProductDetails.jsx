import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Heart,
  Star,
  Truck,
  ShieldCheck,
  RotateCcw,
  ArrowLeft,
  Coins,
  CheckCircle2,
} from "lucide-react";
import baseApi from "../../api/baseApi";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/reducers/cartReducer";
import toast from "react-hot-toast";
import { useStore } from "./StoreContext";

export default function ProductDetails() {
  const { businessName, id } = useParams();
  const { storeHomePath, template, theme: layoutTheme } = useStore();
  const basePath = storeHomePath || `/${encodeURIComponent(businessName || "")}`;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const theme = template?.selectedTheme || layoutTheme || {
    colors: {
      primary: "#4F46E5",
      secondary: "#818CF8",
      background: "#F8FAFC",
      cardBg: "#FFFFFF",
      textColor: "#0F172A",
    },
  };

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
          response.data?.optionDefinitions?.length
        ) {
          const initial = {};
          response.data.optionDefinitions.forEach((opt) => {
            if (opt.values?.length) {
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

    if (id && businessName) {
      fetchProductDetails();
    }
  }, [id, businessName]);

  // Selected variant match
  const selectedVariant = useMemo(() => {
    if (!product?.hasVariants || !product?.variants?.length) return null;
    return (
      product.variants.find((v) => {
        if (!v.optionValues) return false;
        return Object.entries(selectedOptions).every(
          ([optName, optVal]) => v.optionValues[optName] === optVal,
        );
      }) || null
    );
  }, [product, selectedOptions]);

  const currentPrice = selectedVariant
    ? selectedVariant.price !== undefined && selectedVariant.price !== null
      ? Number(selectedVariant.price)
      : Number(product?.price || 0)
    : Number(product?.price || 0);

  const currentCompareAt = selectedVariant
    ? selectedVariant.compareAtPrice !== undefined && selectedVariant.compareAtPrice !== null
      ? Number(selectedVariant.compareAtPrice)
      : product?.compareAtPrice
        ? Number(product.compareAtPrice)
        : null
    : product?.compareAtPrice
      ? Number(product.compareAtPrice)
      : null;

  const discountPercent =
    currentCompareAt && currentCompareAt > currentPrice
      ? Math.round(((currentCompareAt - currentPrice) / currentCompareAt) * 100)
      : 0;

  const currentSku = selectedVariant?.sku || product?.sku;

  const currentStock = useMemo(() => {
    if (!product) return 0;
    if (selectedVariant) {
      return selectedVariant.stockQuantity !== undefined
        ? Number(selectedVariant.stockQuantity)
        : 0;
    }
    return product.stock !== undefined
      ? Number(product.stock)
      : product.stockQuantity !== undefined
        ? Number(product.stockQuantity)
        : product.inventory?.stockQuantity !== undefined
          ? Number(product.inventory.stockQuantity)
          : 0;
  }, [product, selectedVariant]);

  const isOutOfStock = currentStock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) {
      toast.error("Sorry, this item is currently out of stock!");
      return;
    }

    dispatch(
      addToCart({
        product: {
          _id: product._id,
          name: product.name,
          price: currentPrice,
          image:
            selectedVariant?.image?.url ||
            selectedVariant?.image ||
            product.featuredImage?.url ||
            product.featuredImage ||
            product.images?.[0]?.url ||
            product.images?.[0] ||
            "/placeholder-product.png",
          stock: currentStock,
          sku: currentSku,
          selectedOptions: selectedVariant ? selectedVariant.optionValues : null,
          variantSku: currentSku,
          variantId: selectedVariant ? selectedVariant._id : null,
        },
        quantity,
      }),
    );
    toast.success(`${product.name} added to your cart!`);
  };

  const images = useMemo(() => {
    if (Array.isArray(product?.images) && product.images.length > 0) {
      return product.images.map((img) => (typeof img === "object" ? img.url || img : img));
    }
    const feat = product?.featuredImage?.url || product?.featuredImage || product?.thumbnail?.url || product?.thumbnail;
    return feat ? [feat] : [];
  }, [product]);

  const mainImage =
    (images.length > 0 ? images[selectedImageIdx] : null) ||
    selectedVariant?.image?.url ||
    selectedVariant?.image ||
    product?.featuredImage?.url ||
    product?.featuredImage ||
    product?.thumbnail?.url ||
    product?.thumbnail ||
    "/placeholder-product.png";

  const primaryColor = theme?.colors?.primary || "#4F46E5";

  if (loading) {
    return (
      <div
        className="w-full min-h-screen py-20 px-6 text-center flex flex-col items-center justify-center"
        style={{
          backgroundColor: theme.colors?.background || "#F8FAFC",
          color: theme.colors?.textColor || "#0F172A",
        }}
      >
        <div
          className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin mx-auto"
          style={{ borderColor: primaryColor, borderTopColor: "transparent" }}
        />
        <p className="text-xs mt-3 font-medium opacity-60">Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div
        className="w-full min-h-screen py-20 px-6 text-center flex flex-col items-center justify-center space-y-4"
        style={{
          backgroundColor: theme.colors?.background || "#F8FAFC",
          color: theme.colors?.textColor || "#0F172A",
        }}
      >
        <p className="text-rose-600 font-bold text-sm">
          {error || "Product not found"}
        </p>
        <button
          onClick={() => navigate(`${basePath}/products`)}
          className="inline-flex items-center gap-2 text-xs font-bold hover:underline cursor-pointer"
          style={{ color: primaryColor }}
        >
          <ArrowLeft size={14} /> Back to Catalog
        </button>
      </div>
    );
  }

  return (
    <div
      className="w-full min-h-screen py-10 px-6 transition-all duration-300"
      style={{
        backgroundColor: theme.colors?.background || "#F8FAFC",
        color: theme.colors?.textColor || "#0F172A",
        fontFamily: template?.selectedFont?.fontFamily || "inherit",
      }}
    >
      <div className="max-w-7xl mx-auto space-y-10 text-left">
        {/* Back Link */}
        <div>
          <Link
            to={`${basePath}/products`}
            className="inline-flex items-center gap-1.5 text-xs font-bold opacity-60 hover:opacity-100 transition"
            style={{ color: theme.colors?.textColor }}
          >
            <ArrowLeft size={14} /> Back to Catalog
          </Link>
        </div>

        {/* Main Product Showcase Card */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-10 p-6 sm:p-10 rounded-3xl border border-black/[0.06] shadow-xl"
          style={{
            backgroundColor: theme.colors?.cardBg || "#FFFFFF",
          }}
        >
          {/* Left Column: Image Gallery */}
          <div className="space-y-4">
            <div className="border border-black/[0.06] rounded-3xl overflow-hidden aspect-[4/3] bg-slate-50 relative shadow-xs">
              {discountPercent > 0 && (
                <span
                  className="absolute top-4 left-4 z-10 text-white text-xs font-black px-3 py-1 rounded-full shadow-sm"
                  style={{ backgroundColor: primaryColor }}
                >
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
              <div className="flex gap-2.5 overflow-x-auto pb-1">
                {images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIdx(idx)}
                    className={`w-16 h-16 rounded-2xl overflow-hidden border-2 transition shrink-0 cursor-pointer ${
                      selectedImageIdx === idx
                        ? "shadow-sm scale-105"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                    style={{
                      borderColor:
                        selectedImageIdx === idx ? primaryColor : "transparent",
                    }}
                  >
                    <img
                      src={imgUrl}
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
              <span
                className="font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-wider inline-block shadow-2xs"
                style={{
                  backgroundColor: `${primaryColor}15`,
                  color: primaryColor,
                }}
              >
                {product.category?.name || "Premium Collection"}
              </span>

              <h1
                className="text-2xl sm:text-3xl font-black tracking-tight leading-tight capitalize"
                style={{ color: theme.colors?.textColor }}
              >
                {product.name}
              </h1>

              {/* Reviews & Coins */}
              <div className="flex items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-2">
                  <div className="flex text-amber-400">
                    <Star size={16} fill="currentColor" />
                  </div>
                  <span className="text-xs font-bold">
                    {product.rating || "4.9"}
                  </span>
                  <span className="text-xs opacity-50">
                    ({product.numReviews || 12} Reviews)
                  </span>
                </div>

                {product.coinReward > 0 && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-black text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                    <Coins size={12} className="text-amber-500" /> +{product.coinReward} Coins Reward
                  </span>
                )}
              </div>
            </div>

            {/* Pricing Section */}
            <div
              className="p-4 sm:p-5 rounded-2xl border border-black/[0.05] flex items-baseline gap-3 flex-wrap"
              style={{
                backgroundColor: `${primaryColor}06`,
              }}
            >
              <span
                className="font-black text-3xl tracking-tight"
                style={{ color: theme.colors?.textColor }}
              >
                ₹{Number(currentPrice).toLocaleString("en-IN")}
              </span>
              {currentCompareAt && currentCompareAt > currentPrice && (
                <span className="text-base opacity-40 font-medium line-through">
                  ₹{Number(currentCompareAt).toLocaleString("en-IN")}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  Save {discountPercent}%
                </span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="space-y-1.5">
                <h3 className="text-xs font-black uppercase tracking-wider opacity-70">
                  Description
                </h3>
                <p className="text-xs opacity-80 leading-relaxed font-normal whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}

            {/* Product Stock Indicator */}
            <div className="text-xs">
              <span className="opacity-60 font-semibold">Availability: </span>
              {!isOutOfStock ? (
                <span className="text-emerald-600 font-bold">
                  In Stock ({currentStock} available)
                </span>
              ) : (
                <span className="text-rose-600 font-bold">Out of Stock</span>
              )}
            </div>

            {/* Variant Selector */}
            {product.hasVariants && product.optionDefinitions?.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-black/[0.06]">
                {product.optionDefinitions.map((opt) => (
                  <div key={opt.name} className="space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-wider block opacity-60">
                      Select {opt.name}:{" "}
                      <span className="font-bold opacity-100">
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
                            className={`px-4 py-2 text-xs font-bold uppercase rounded-xl border transition-all cursor-pointer ${
                              isSelected
                                ? "text-white shadow-sm"
                                : "border-slate-200 bg-white hover:border-slate-400"
                            }`}
                            style={{
                              backgroundColor: isSelected
                                ? primaryColor
                                : "transparent",
                              borderColor: isSelected
                                ? primaryColor
                                : undefined,
                              borderLeft:
                                isColor && !isSelected
                                  ? `4px solid ${val.toLowerCase()}`
                                  : undefined,
                            }}
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

            {/* Quantity & Add to Cart Action */}
            <div className="flex flex-wrap gap-4 items-center pt-4 border-t border-black/[0.06]">
              {!isOutOfStock && (
                <div className="flex items-center border border-slate-200 rounded-2xl overflow-hidden shrink-0 bg-white shadow-2xs">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-4 py-2.5 hover:bg-slate-50 font-bold transition cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-4 text-xs font-black">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity((q) => Math.min(currentStock, q + 1))
                    }
                    className="px-4 py-2.5 hover:bg-slate-50 font-bold transition cursor-pointer"
                  >
                    +
                  </button>
                </div>
              )}

              {!isOutOfStock ? (
                <button
                  onClick={handleAddToCart}
                  className="flex-1 min-w-[180px] text-white font-black text-sm px-7 py-3.5 rounded-2xl transition flex items-center justify-center gap-2 shadow-xl hover:opacity-90 cursor-pointer"
                  style={{ backgroundColor: primaryColor }}
                >
                  <ShoppingCart size={16} /> Add to Cart
                </button>
              ) : (
                <span className="flex-1 min-w-[180px] bg-slate-100 border border-slate-200 text-slate-400 py-3.5 rounded-2xl text-center font-bold text-xs uppercase tracking-widest select-none">
                  Out of Stock
                </span>
              )}

              <button className="p-3.5 border border-slate-200 rounded-2xl hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 opacity-60 hover:opacity-100 transition cursor-pointer">
                <Heart size={18} />
              </button>
            </div>

            {/* Trust Highlights Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-black/[0.06]">
              <div
                className="flex items-center gap-2.5 p-3 rounded-2xl"
                style={{ backgroundColor: `${primaryColor}06` }}
              >
                <Truck size={18} style={{ color: primaryColor }} className="shrink-0" />
                <div className="text-[10px] leading-tight text-left">
                  <p className="font-extrabold">Fast Dispatch</p>
                  <p className="opacity-60">Delivered in 2-4 days</p>
                </div>
              </div>
              <div
                className="flex items-center gap-2.5 p-3 rounded-2xl"
                style={{ backgroundColor: `${primaryColor}06` }}
              >
                <ShieldCheck size={18} style={{ color: primaryColor }} className="shrink-0" />
                <div className="text-[10px] leading-tight text-left">
                  <p className="font-extrabold">100% Authentic</p>
                  <p className="opacity-60">Quality Verified</p>
                </div>
              </div>
              <div
                className="flex items-center gap-2.5 p-3 rounded-2xl"
                style={{ backgroundColor: `${primaryColor}06` }}
              >
                <RotateCcw size={18} style={{ color: primaryColor }} className="shrink-0" />
                <div className="text-[10px] leading-tight text-left">
                  <p className="font-extrabold">Easy Returns</p>
                  <p className="opacity-60">Customer Protection</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
