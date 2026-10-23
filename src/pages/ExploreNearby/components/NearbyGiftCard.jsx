import React from "react";
import { MapPin, Gift, ShoppingCart, Bookmark, Check, Sparkles } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../../redux/reducers/cartReducer";
import toast from "react-hot-toast";

export default function NearbyGiftCard({
  gift,
  onAddToPlan,
  isInPlan = false,
}) {
  const dispatch = useDispatch();
  const cartItems = useSelector((s) => s.cart?.cartItems || s.cart?.items || []);
  const isInCart = cartItems.some(
    (i) => String(i._id || i.id || i.product?._id) === String(gift.id),
  );

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        product: {
          _id: gift.id,
          id: gift.id,
          name: gift.title,
          price: gift.price,
          originalPrice: gift.originalPrice,
          image: gift.image,
          category: gift.category,
        },
        quantity: 1,
      }),
    );
    toast.success(`Gift hamper "${gift.title}" added to cart!`);
  };

  return (
    <div className="group bg-white rounded-3xl border border-slate-200/80 hover:border-fuchsia-300 shadow-2xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full">
      <div className="relative h-44 overflow-hidden bg-slate-100">
        <img
          src={gift.image}
          alt={gift.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Distance Badge */}
        <div className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/85 backdrop-blur-md text-white text-[10px] font-black shadow-sm">
          <MapPin size={11} className="text-fuchsia-400" />
          <span>{gift.distanceKm} km away</span>
        </div>

        {/* Occasion Badge */}
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-fuchsia-600/90 text-white text-[10px] font-black backdrop-blur-xs">
          {gift.occasion}
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          <div className="text-[11px] font-bold text-fuchsia-700 flex items-center gap-1">
            <Gift size={13} />
            <span>{gift.businessName}</span>
          </div>

          <h3 className="font-black text-slate-900 text-base leading-snug group-hover:text-fuchsia-700 transition-colors line-clamp-2">
            {gift.title}
          </h3>

          {/* Included Items Chips */}
          {Array.isArray(gift.includes) && gift.includes.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {gift.includes.map((item, idx) => (
                <span
                  key={idx}
                  className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md"
                >
                  ✓ {item}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Pricing & Cart Action */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-slate-900">
                ₹{Number(gift?.price || 0).toLocaleString("en-IN")}
              </span>
              {gift?.originalPrice && (
                <span className="text-xs text-slate-400 line-through">
                  ₹{Number(gift.originalPrice || 0).toLocaleString("en-IN")}
                </span>
              )}
            </div>
            <span className="text-[10px] font-bold text-emerald-600">
              {gift.deliveryBadge}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {onAddToPlan && (
              <button
                type="button"
                onClick={() => onAddToPlan(gift)}
                className={`p-2 rounded-xl border text-xs transition cursor-pointer ${
                  isInPlan
                    ? "bg-indigo-50 border-indigo-200 text-indigo-600 font-bold"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-indigo-600"
                }`}
                title={isInPlan ? "In Neighbourhood Plan" : "Add to Neighbourhood Plan"}
              >
                <Bookmark size={15} className={isInPlan ? "fill-current" : ""} />
              </button>
            )}

            <button
              type="button"
              onClick={handleAddToCart}
              className={`p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm ${
                isInCart
                  ? "bg-emerald-600 text-white"
                  : "bg-fuchsia-600 hover:bg-fuchsia-700 text-white shadow-fuchsia-500/20"
              }`}
            >
              {isInCart ? <Check size={14} /> : <ShoppingCart size={14} />}
              <span className="hidden sm:inline">{isInCart ? "Added" : "Add Gift"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
