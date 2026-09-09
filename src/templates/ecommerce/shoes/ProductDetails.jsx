import React, { useState } from "react";
import {
  ArrowLeft,
  ShoppingBag,
  ShieldCheck,
  Star,
  Check,
  ChevronRight,
  Share2,
  Truck,
  RotateCcw,
  Ruler,
  Heart,
  Plus,
  Minus,
  Sparkles,
} from "lucide-react";
import { isOutOfStock } from "../../../utils/stockUtils";
import { getProductImage } from "../../../utils/productImage";
import toast from "react-hot-toast";
import ProductCard from "./ProductCard";

export default function ProductDetails({
  product = {},
  onBack = () => {},
  onAddToCart = () => {},
  relatedProducts = [],
  onSelectProduct = () => {},
  sizeStandard = "EU",
  setSizeStandard = () => {},
}) {
  const defaultSizes = product.sizes || ["38", "40", "41", "42", "42.5", "43"];
  const [selectedSize, setSelectedSize] = useState(defaultSizes[2] || defaultSizes[0] || "41");

  const defaultColors = product.colors || [
    { name: "Navy Blue", hex: "#1E3A8A" },
    { name: "White / Red", hex: "#EF4444" },
    { name: "Black", hex: "#0F172A" },
  ];
  const [selectedColor, setSelectedColor] = useState(defaultColors[0]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState("specs"); // "specs" | "fit" | "shipping"

  const outOfStock = isOutOfStock(product);
  const price = Number(product.price) || 0;
  const compareAtPrice = product.compareAtPrice ? Number(product.compareAtPrice) : null;
  const imageSrc = getProductImage(product, product.image);

  // Gallery angles
  const galleryImages = [
    imageSrc,
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&auto=format&fit=crop&q=80",
  ];

  const handleAdd = () => {
    if (outOfStock) {
      toast.error("This silhouette is currently sold out.");
      return;
    }
    for (let i = 0; i < quantity; i++) {
      onAddToCart(product, {
        selectedSize: `${sizeStandard} ${selectedSize}`,
        selectedColor: selectedColor?.name || "Standard",
      });
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Product link copied to clipboard!");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 font-sans text-left">
      {/* Navigation Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4 text-xs">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition cursor-pointer font-bold"
        >
          <ArrowLeft size={16} />
          <span>Back to All Sneakers</span>
        </button>

        <div className="flex items-center gap-2 text-slate-400">
          <span className="hover:text-slate-600 cursor-pointer" onClick={onBack}>Home</span>
          <ChevronRight size={12} />
          <span className="text-slate-600">{product.category || "Footwear"}</span>
          <ChevronRight size={12} />
          <span className="text-blue-600 font-bold truncate max-w-[200px]">
            {product.name}
          </span>
        </div>

        <button
          onClick={handleShare}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer flex items-center gap-1.5"
        >
          <Share2 size={14} />
          <span className="hidden sm:inline">Share</span>
        </button>
      </div>

      {/* Main Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm items-start">
        {/* Left: Gallery & Angles (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main Visualizer Stage */}
          <div className="aspect-square w-full rounded-2xl bg-slate-50 border border-slate-100 p-8 flex items-center justify-center relative overflow-hidden group">
            <img
              src={galleryImages[activeImageIndex] || imageSrc}
              alt={product.name}
              className="max-h-[340px] w-auto object-contain filter drop-shadow-xl group-hover:scale-105 transition-transform duration-500"
            />

            {/* Badges Overlay */}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5">
              {product.badge && (
                <span className="px-2.5 py-1 rounded bg-[#1E3A8A] text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
                  {product.badge}
                </span>
              )}
              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold">
                100% Authentic
              </span>
            </div>
          </div>

          {/* Gallery Thumbnails */}
          <div className="grid grid-cols-3 gap-3">
            {galleryImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`aspect-video rounded-xl bg-white border-2 p-2 flex items-center justify-center transition cursor-pointer ${
                  activeImageIndex === idx
                    ? "border-blue-600 shadow-sm"
                    : "border-slate-200 opacity-70 hover:opacity-100"
                }`}
              >
                <img src={img} alt={`Angle ${idx + 1}`} className="max-h-full object-contain" />
              </button>
            ))}
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-center text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <Truck size={18} className="mx-auto text-blue-600" />
              <span className="font-bold text-slate-900 block">Free Shipping</span>
              <p className="text-[10px] text-slate-500">Orders over $50</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <RotateCcw size={18} className="mx-auto text-blue-600" />
              <span className="font-bold text-slate-900 block">30-Day Trial</span>
              <p className="text-[10px] text-slate-500">Zero return fees</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <ShieldCheck size={18} className="mx-auto text-blue-600" />
              <span className="font-bold text-slate-900 block">Deadstock Verified</span>
              <p className="text-[10px] text-slate-500">Tamper-proof seal</p>
            </div>
          </div>
        </div>

        {/* Right: Sneaker Specs, Size Selector & Cart Action (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-bold block">
              {product.category || "Footwear"}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 pt-1">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="fill-amber-400" />
                ))}
              </div>
              <span className="text-xs font-bold text-slate-800">
                {product.rating || "4.9"}
              </span>
              <span className="text-xs text-slate-500">
                ({product.reviewCount || 128} verified reviews)
              </span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">
                ${price.toFixed(2)}
              </span>
              {compareAtPrice && (
                <span className="text-sm text-slate-400 line-through">
                  ${compareAtPrice.toFixed(2)}
                </span>
              )}
            </div>
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full ${
                outOfStock
                  ? "bg-rose-100 text-rose-700"
                  : "bg-emerald-100 text-emerald-800"
              }`}
            >
              {outOfStock ? "Sold Out" : "In Stock • Ready to Ship"}
            </span>
          </div>

          {/* Colorway Selection */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-800">
                Colorway: <span className="font-normal text-slate-600">{selectedColor?.name}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              {defaultColors.map((col, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedColor(col)}
                  className={`w-7 h-7 rounded-lg border transition cursor-pointer ${
                    selectedColor?.name === col.name
                      ? "ring-2 ring-blue-600 ring-offset-2 scale-105"
                      : "border-slate-300 hover:scale-105"
                  }`}
                  style={{ backgroundColor: col.hex }}
                />
              ))}
            </div>
          </div>

          {/* Size Selector with US / UK / EU switch */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-800">Select Size:</span>
              <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500">
                <span>Standard:</span>
                {["EU", "US", "UK"].map((std) => (
                  <button
                    key={std}
                    onClick={() => setSizeStandard && setSizeStandard(std)}
                    className={`px-1.5 py-0.5 rounded ${
                      sizeStandard === std ? "bg-slate-900 text-white" : "hover:underline"
                    }`}
                  >
                    {std}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {defaultSizes.map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setSelectedSize(sz)}
                  className={`py-2 text-xs font-bold rounded-xl border text-center transition cursor-pointer ${
                    selectedSize === sz
                      ? "bg-[#1E3A8A] text-white border-[#1E3A8A] shadow-sm font-black"
                      : "bg-white text-slate-700 border-slate-200 hover:border-slate-400"
                  }`}
                >
                  {sizeStandard} {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity & Add to Cart */}
          <div className="pt-2 space-y-3">
            <div className="flex items-center gap-4">
              {/* Stepper */}
              <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-1">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-slate-600 hover:text-black cursor-pointer"
                >
                  <Minus size={14} />
                </button>
                <span className="w-8 text-center text-xs font-black text-slate-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 text-slate-600 hover:text-black cursor-pointer"
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-center ${
                  isWishlisted
                    ? "bg-rose-50 text-rose-600 border-rose-200"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                <Heart size={18} className={isWishlisted ? "fill-rose-600" : ""} />
              </button>
            </div>

            {/* Main Add Button */}
            <button
              type="button"
              onClick={handleAdd}
              disabled={outOfStock}
              className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                outOfStock
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                  : "bg-[#1E3A8A] hover:bg-blue-800 text-white active:scale-98"
              }`}
            >
              <ShoppingBag size={16} />
              <span>
                {outOfStock
                  ? "Item Sold Out"
                  : `Add to Bag • $${(price * quantity).toFixed(2)} (${sizeStandard} ${selectedSize})`}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs: Specifications & Sizing Guide */}
      <div className="space-y-6 pt-6">
        <div className="flex gap-6 border-b-2 border-slate-200 text-xs font-bold uppercase tracking-wider">
          {[
            { id: "specs", label: "Footwear Specifications" },
            { id: "fit", label: "Sizing & Fit Advice" },
            { id: "shipping", label: "Shipping & Free Returns" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 transition border-b-2 -mb-[2px] cursor-pointer ${
                activeTab === tab.id
                  ? "border-[#1E3A8A] text-blue-900 font-black"
                  : "border-transparent text-slate-400 hover:text-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "specs" && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
            <table className="w-full text-xs text-left">
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-400 w-1/3">Upper Composition</td>
                  <td className="py-3 px-4 text-slate-800 font-semibold">Tumbled Full-Grain Leather & Breathable Mesh</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-400">Midsole Technology</td>
                  <td className="py-3 px-4 text-slate-800 font-semibold">Encapsulated Air-Sole Propulsion Cushioning</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-400">Outsole Compound</td>
                  <td className="py-3 px-4 text-slate-800 font-semibold">Solid Rubber Pivot Traction Circle Outsole</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-400">Weight</td>
                  <td className="py-3 px-4 text-slate-800 font-semibold">410 grams (Sample Size EU 42)</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "fit" && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 text-xs text-slate-600 space-y-3">
            <h4 className="font-bold text-slate-900">True to Size (92% Customer Consensus)</h4>
            <p>
              We recommend ordering your standard athletic shoe size. If you have wider feet, we suggest sizing up by a half-size (e.g., from EU 42 to EU 42.5).
            </p>
          </div>
        )}

        {activeTab === "shipping" && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 text-xs text-slate-600 space-y-3">
            <h4 className="font-bold text-slate-900">Complimentary 2-Day Air Shipping</h4>
            <p>
              All deadstock sneakers are authenticated, tagged with verified NFC proof, and dispatched within 24 hours of purchase. Returns are 100% free within 30 days.
            </p>
          </div>
        )}
      </div>

      {/* Related Footwear Lineup */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="pt-10 border-t border-slate-200 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-black text-slate-900">You Might Also Like</h3>
            <span className="text-xs text-slate-500 font-medium">Similar Silhouettes</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {relatedProducts
              .filter((p) => (p._id || p.id) !== (product._id || product.id))
              .slice(0, 5)
              .map((item) => (
                <ProductCard
                  key={item._id || item.id}
                  product={item}
                  onSelectProduct={onSelectProduct}
                  onAddToCart={onAddToCart}
                  sizeStandard={sizeStandard}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
