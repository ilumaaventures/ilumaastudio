import React, { useState } from "react";
import {
  ArrowLeft,
  ShoppingBag,
  Star,
  Check,
  ChevronRight,
  Share2,
  Truck,
  RotateCcw,
  ShieldCheck,
  Plus,
  Minus,
  Briefcase,
  Leaf,
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
}) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("materials"); // "materials" | "specs" | "shipping"

  const outOfStock = isOutOfStock(product);
  const price = Number(product.price) || 38.99;
  const compareAtPrice = product.compareAtPrice ? Number(product.compareAtPrice) : 42.0;
  const imageSrc = getProductImage(product, product.image);

  const galleryImages = [
    imageSrc,
    "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
  ];

  const handleAdd = () => {
    if (outOfStock) return;
    onAddToCart(product, quantity);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Bag link copied to clipboard!");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 font-sans text-left">
      {/* Navigation Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4 text-xs">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-600 hover:text-[#A0522D] transition cursor-pointer font-bold"
        >
          <ArrowLeft size={16} />
          <span>Back to All Bags</span>
        </button>

        <div className="flex items-center gap-2 text-slate-400">
          <span className="hover:text-slate-600 cursor-pointer" onClick={onBack}>Home</span>
          <ChevronRight size={12} />
          <span className="text-slate-600">{product.category || "Backpacks"}</span>
          <ChevronRight size={12} />
          <span className="text-[#A0522D] font-bold truncate max-w-[200px]">
            {product.name}
          </span>
        </div>

        <button
          onClick={handleShare}
          className="p-2 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer flex items-center gap-1.5"
        >
          <Share2 size={14} />
          <span className="hidden sm:inline">Share</span>
        </button>
      </div>

      {/* Main Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 bg-white p-6 sm:p-8 border border-slate-200 shadow-2xs items-start">
        {/* Left: Gallery & Angles (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-square w-full bg-slate-50 border border-slate-100 p-8 flex items-center justify-center relative overflow-hidden group">
            <img
              src={galleryImages[activeImageIndex] || imageSrc}
              alt={product.name}
              className="max-h-[340px] w-auto object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-500"
            />

            {/* Circular Solid Black SALE Badge (Matches Reference) */}
            <div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs uppercase tracking-wider shadow-sm">
              SALE
            </div>
          </div>

          {/* Gallery Thumbnails */}
          <div className="grid grid-cols-3 gap-3">
            {galleryImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`aspect-video bg-white border-2 p-2 flex items-center justify-center transition cursor-pointer ${
                  activeImageIndex === idx
                    ? "border-[#A0522D]"
                    : "border-slate-200 opacity-70 hover:opacity-100"
                }`}
              >
                <img src={img} alt={`Angle ${idx + 1}`} className="max-h-full object-contain" />
              </button>
            ))}
          </div>

          {/* Guarantees */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-center text-xs">
            <div className="p-3 bg-slate-50 border border-slate-100 space-y-1">
              <Leaf size={18} className="mx-auto text-emerald-700" />
              <span className="font-bold text-slate-800 block">100% Sustainable</span>
              <p className="text-[10px] text-slate-500">Eco vegetable tanning</p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-100 space-y-1">
              <ShieldCheck size={18} className="mx-auto text-[#A0522D]" />
              <span className="font-bold text-slate-800 block">Lifetime Warranty</span>
              <p className="text-[10px] text-slate-500">Stitching & hardware</p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-100 space-y-1">
              <Truck size={18} className="mx-auto text-slate-700" />
              <span className="font-bold text-slate-800 block">Free Shipping</span>
              <p className="text-[10px] text-slate-500">Orders over $50</p>
            </div>
          </div>
        </div>

        {/* Right: Details & Purchase (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <span className="text-[11px] uppercase tracking-widest text-[#A0522D] font-bold block">
              {product.category || "Backpacks"}
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 uppercase tracking-wide">
              {product.name}
            </h1>

            {/* Price with Strikethrough */}
            <div className="flex items-center gap-3 pt-2">
              {compareAtPrice && compareAtPrice > price && (
                <span className="text-base text-slate-400 line-through">
                  ${compareAtPrice.toFixed(2)}
                </span>
              )}
              <span className="text-2xl sm:text-3xl font-bold text-slate-900">
                ${price.toFixed(2)}
              </span>
            </div>

            {/* In Stock Line */}
            <div className="text-xs text-emerald-700 font-semibold italic pt-1">
              In Stock. Ready to dispatch within 24 hours.
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1.5 pt-1 text-slate-400 text-xs">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} className="fill-slate-400 text-slate-400" />
                ))}
              </div>
              <span className="font-bold text-slate-700">5.0</span>
              <span className="text-slate-400">({product.reviewCount || 0} reviews)</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {product.description ||
              "Handcrafted with full-grain vegetable-tanned saddle leather, reinforced dual shoulder straps, solid brass buckle hardware, and protective interior laptop sleeve."}
          </p>

          {/* Quick Specs Matrix */}
          <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Material</span>
              <span className="text-slate-800 font-semibold">{product.material || "Full-Grain Saddle Leather"}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Capacity</span>
              <span className="text-slate-800 font-semibold">{product.capacity || "22 Liters (Fits 15\" Laptop)"}</span>
            </div>
          </div>

          {/* Quantity Stepper & ADD TO CART Button */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-slate-100 border border-slate-200 rounded p-1">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-slate-600 hover:text-black cursor-pointer"
                >
                  <Minus size={14} />
                </button>
                <span className="w-8 text-center text-xs font-bold text-slate-900">
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
            </div>

            {/* Full-width Saddle Button (Matches Reference) */}
            <button
              type="button"
              onClick={handleAdd}
              disabled={outOfStock}
              className={`w-full py-3.5 rounded-sm font-black text-xs uppercase tracking-widest transition-all duration-200 shadow-sm cursor-pointer ${
                outOfStock
                  ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                  : "bg-[#A0522D] hover:bg-[#8B4513] text-white active:scale-98"
              }`}
            >
              ADD TO CART • ${(price * quantity).toFixed(2)}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="space-y-6 pt-6">
        <div className="flex gap-6 border-b-2 border-slate-200 text-xs font-serif uppercase tracking-widest">
          {[
            { id: "materials", label: "Sustainable Craftsmanship" },
            { id: "specs", label: "Dimensions & Fit" },
            { id: "shipping", label: "Shipping & Free Returns" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 transition border-b-2 -mb-[2px] cursor-pointer ${
                activeTab === tab.id
                  ? "border-[#A0522D] text-[#A0522D] font-bold"
                  : "border-transparent text-slate-400 hover:text-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "materials" && (
          <div className="bg-white p-6 rounded border border-slate-200 text-xs text-slate-600 space-y-3">
            <h4 className="font-bold text-slate-900 font-serif">Tuscan Vegetable-Tanned Leather & Organic Cotton</h4>
            <p className="leading-relaxed">
              Tanned strictly with organic tree bark extracts including chestnut and mimosa tannins over 40 days, avoiding heavy metals or harmful chromium. Ages with a rich, unique patina that deepens with every journey.
            </p>
          </div>
        )}

        {activeTab === "specs" && (
          <div className="bg-white p-6 rounded border border-slate-200 text-xs">
            <table className="w-full text-left">
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-2.5 px-3 font-bold text-slate-400 w-1/3">Dimensions</td>
                  <td className="py-2.5 px-3 text-slate-800">42 cm (H) x 30 cm (W) x 14 cm (D)</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-bold text-slate-400">Device Compartment</td>
                  <td className="py-2.5 px-3 text-slate-800">Padded compartment accommodates up to 15.6" laptop</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-bold text-slate-400">Hardware</td>
                  <td className="py-2.5 px-3 text-slate-800">Solid antiqued brass buckles and YKK zippers</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "shipping" && (
          <div className="bg-white p-6 rounded border border-slate-200 text-xs text-slate-600 space-y-2">
            <h4 className="font-bold text-slate-900 font-serif">Carbon-Neutral Delivery</h4>
            <p>
              Free standard carbon-neutral delivery on all orders over $50. Hassle-free 30-day return policy with prepaid shipping labels.
            </p>
          </div>
        )}
      </div>

      {/* Related Bags */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="pt-8 border-t border-slate-200 space-y-6">
          <div className="flex items-center gap-4 text-center">
            <div className="flex-1 h-[1px] bg-slate-200" />
            <h3 className="text-xl font-serif text-slate-800 tracking-wide">
              You May Also Like
            </h3>
            <div className="flex-1 h-[1px] bg-slate-200" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts
              .filter((p) => (p._id || p.id) !== (product._id || product.id))
              .slice(0, 4)
              .map((item) => (
                <ProductCard
                  key={item._id || item.id}
                  product={item}
                  onSelectProduct={onSelectProduct}
                  onAddToCart={onAddToCart}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
