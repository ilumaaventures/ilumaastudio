import React from "react";
import { useNavigate } from "react-router-dom";
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from "lucide-react";
import { getProductImage } from "../../utils/productImage";

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems = [],
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  currency = "₹",
  themeColors = {},
}) {
  const navigate = useNavigate();
  if (!isOpen) return null;

  const handleCheckout = () => {
    if (onClose) onClose();
    if (onCheckout) {
      onCheckout();
    } else {
      navigate("/cart");
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 1),
    0
  );
  const freeShippingThreshold = 499;
  const progressToFreeShipping = Math.min(
    100,
    (subtotal / freeShippingThreshold) * 100
  );
  const remainingForFreeShipping = Math.max(
    0,
    freeShippingThreshold - subtotal
  ).toFixed(2);

  const primaryColor = themeColors.primary || "#4F46E5";

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag size={20} style={{ color: primaryColor }} />
              <h2 className="text-base font-bold text-slate-900">
                Your Shopping Bag ({cartItems.reduce((acc, i) => acc + (i.quantity || 1), 0)})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Free Shipping Progress */}
          <div className="bg-slate-50 px-6 py-3 border-b border-slate-100">
            <div className="text-xs font-semibold text-slate-700 mb-1.5">
              {remainingForFreeShipping > 0 ? (
                <>Add <span className="font-bold">{currency}{remainingForFreeShipping}</span> more for <span className="text-emerald-600 font-bold">FREE Express Delivery</span></>
              ) : (
                <span className="text-emerald-600 font-bold">🎉 You've unlocked FREE Express Delivery!</span>
              )}
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Item List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 divide-y divide-slate-100">
            {cartItems.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                  <ShoppingBag size={28} />
                </div>
                <h3 className="text-sm font-bold text-slate-800">Your bag is empty</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Explore our curated selections and add items to your cart.
                </p>
              </div>
            ) : (
              cartItems.map((item, idx) => (
                <div key={item._id || idx} className="pt-4 first:pt-0 flex gap-3.5">
                  <img
                    src={getProductImage(item, "https://images.unsplash.com/photo-1542838132-92c53300491e?w=150")}
                    alt={item.name}
                    className="w-20 h-20 rounded-xl object-cover border border-slate-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {item.name}
                    </h4>
                    {item.selectedSize && (
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                        Size: {item.selectedSize}
                      </p>
                    )}
                    <p className="text-xs font-bold text-slate-800 mt-1">
                      {currency}{Number(item.price).toFixed(2)}
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity Toggles */}
                      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                        <button
                          onClick={() => onUpdateQuantity && onUpdateQuantity(item._id, Math.max(1, (item.quantity || 1) - 1))}
                          className="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-200 cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-2.5 text-xs font-semibold text-slate-800">
                          {item.quantity || 1}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity && onUpdateQuantity(item._id, (item.quantity || 1) + 1)}
                          className="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-200 cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem && onRemoveItem(item._id)}
                        className="text-slate-400 hover:text-rose-500 p-1 transition cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout CTA */}
          {cartItems.length > 0 && (
            <div className="border-t border-slate-100 p-6 bg-white space-y-3">
              <div className="flex justify-between items-center text-xs text-slate-600">
                <span>Subtotal</span>
                <span className="text-sm font-bold text-slate-900">
                  {currency}{subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-600">
                <span>Estimated Shipping</span>
                <span className="font-semibold text-emerald-600">
                  {remainingForFreeShipping == 0 ? "FREE" : `${currency}49.00`}
                </span>
              </div>
              <div className="border-t border-slate-100 pt-2 flex justify-between items-center font-bold text-sm text-slate-900">
                <span>Total</span>
                <span>
                  {currency}
                  {(
                    subtotal + (remainingForFreeShipping == 0 ? 0 : 49)
                  ).toFixed(2)}
                </span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-3.5 px-4 rounded-xl text-white text-xs font-bold transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
                style={{ backgroundColor: primaryColor }}
              >
                <span>Proceed to Secure Checkout</span>
                <ArrowRight size={15} />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium pt-1">
                <ShieldCheck size={13} className="text-emerald-500" />
                <span>SSL Encrypted Checkout • 100% Guaranteed</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
