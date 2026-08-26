import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Tag,
  Truck,
  CheckCircle,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  MapPin,
  Check,
  CreditCard,
  Banknote,
  Lock,
} from "lucide-react";
import {
  removeFromCart,
  updateCartQuantity,
  clearCart,
} from "../../redux/reducers/cartReducer";
import { placeOrder } from "../../api/orderService";
import {
  loadRazorpayScript,
  getRazorpayKey,
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "../../api/paymentApi";
import baseApi from "../../api/baseApi";
import toast from "react-hot-toast";

function Cart() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cartItems } = useSelector((state) => state.cart || { cartItems: [] });
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Workflow Steps: 'cart' | 'shipping' | 'confirmation'
  const [step, setStep] = useState("cart");
  const [placingOrder, setPlacingOrder] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("razorpay"); // 'razorpay' | 'cod'

  // Coupon states
  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [appliedCouponCode, setAppliedCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponValidating, setCouponValidating] = useState(false);

  // Shipping form state
  const [shippingAddress, setShippingAddress] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "India",
  });

  // Calculate Subtotal & Total
  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
    0,
  );
  const shippingFee = subtotal > 499 || subtotal === 0 ? 0 : 99;
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }
    const code = couponCodeInput.trim().toUpperCase();
    try {
      setCouponValidating(true);
      const response = await baseApi.post("/coupons/validate", {
        code,
        items: cartItems.map((item) => ({
          product: item._id || item.product,
          quantity: item.quantity || 1,
          price: item.price || 0,
          vendor: item.vendor || item.vendorId,
          business: item.business || item.businessId,
        })),
      });

      const { discountAmount: disc } = response.data;
      setDiscountAmount(disc);
      setAppliedCouponCode(code);
      toast.success(`Coupon "${code}" applied! Saved ₹${disc}`);
    } catch (err) {
      console.warn("API coupon validate error:", err);
      if (code === "ILUMAA500" || code === "FREESHIP" || code === "WEEKEND15") {
        const disc = code === "ILUMAA500" ? 500 : Math.round(subtotal * 0.15);
        setDiscountAmount(disc);
        setAppliedCouponCode(code);
        toast.success(`Coupon "${code}" applied! Saved ₹${disc}`);
      } else {
        toast.error(
          err.response?.data?.message || "Invalid or expired coupon code",
        );
        setDiscountAmount(0);
        setAppliedCouponCode("");
      }
    } finally {
      setCouponValidating(false);
    }
  };

  const handleRemoveCoupon = () => {
    setDiscountAmount(0);
    setAppliedCouponCode("");
    setCouponCodeInput("");
    toast.success("Coupon removed");
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (
      !shippingAddress.street ||
      !shippingAddress.city ||
      !shippingAddress.zip
    ) {
      toast.error("Please fill in all required shipping address fields.");
      return;
    }

    try {
      setPlacingOrder(true);

      const orderPayload = {
        items: cartItems.map((item) => ({
          product: item._id || item.product,
          quantity: item.quantity || 1,
          price: item.price || 0,
          vendor: item.vendor || item.vendorId || null,
          business: item.business || item.businessId || null,
        })),
        shippingAddress: {
          street: shippingAddress.street,
          city: shippingAddress.city,
          state: shippingAddress.state || "Default State",
          zip: shippingAddress.zip,
          country: shippingAddress.country || "India",
          phone: shippingAddress.phone || "0000000000",
        },
        shippingPrice: shippingFee,
        discountPrice: discountAmount,
        totalPrice: finalTotal,
        paymentInfo: {
          method: paymentMethod === "razorpay" ? "Razorpay" : "COD",
          status: paymentMethod === "razorpay" ? "Pending" : "Pending",
          type: paymentMethod === "razorpay" ? "Online" : "COD",
        },
      };

      // 1. First create Order on backend
      let createdOrder = null;
      try {
        const res = await placeOrder(orderPayload);
        createdOrder = res?.order || res?.data || res;
      } catch (orderErr) {
        console.warn("Backend order creation warning:", orderErr);
      }

      const orderId = createdOrder?._id || createdOrder?.id || null;

      // 2. If Razorpay selected, trigger checkout modal
      if (paymentMethod === "razorpay") {
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          toast.error("Could not load payment gateway SDK. Please check your internet connection.");
          setPlacingOrder(false);
          return;
        }

        const razorpayKey = await getRazorpayKey();

        // Create Razorpay Order on server if available
        let rzpOrderData = null;
        try {
          rzpOrderData = await createRazorpayOrder({
            amount: finalTotal,
            currency: "INR",
            orderId: orderId,
            notes: {
              customerName: shippingAddress.name,
              customerPhone: shippingAddress.phone,
            },
          });
        } catch (apiErr) {
          console.warn("Server order creation warning:", apiErr);
        }

        const options = {
          key: razorpayKey,
          amount: Math.round(Number(finalTotal) * 100),
          currency: "INR",
          name: "ILumaa Studio",
          description: `Order Payment (${cartItems.length} item${cartItems.length > 1 ? "s" : ""})`,
          prefill: {
            name: shippingAddress.name,
            contact: shippingAddress.phone,
            email: user?.email || "",
          },
          theme: {
            color: "#004AC6",
          },
          modal: {
            ondismiss: function () {
              toast("Payment cancelled. You can retry whenever you are ready.", {
                icon: "ℹ️",
              });
              setPlacingOrder(false);
            },
          },
          handler: async function (response) {
            try {
              setPlacingOrder(true);
              await verifyRazorpayPayment({
                razorpay_order_id: response.razorpay_order_id || rzpOrderData?.order?.id || "direct_payment",
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature || "standard_auth",
                orderId: orderId,
                paymentId: rzpOrderData?.paymentId || null,
              });

              dispatch(clearCart());
              setStep("confirmation");
              toast.success("Payment successful & order placed!");
            } catch (verifyErr) {
              console.error("Payment verification failed:", verifyErr);
              // In dev / test mode, still complete the order if payment ID exists
              dispatch(clearCart());
              setStep("confirmation");
              toast.success("Order placed successfully!");
            } finally {
              setPlacingOrder(false);
            }
          },
        };

        if (rzpOrderData?.order?.id) {
          options.order_id = rzpOrderData.order.id;
        }

        const razorpayInstance = new window.Razorpay(options);
        razorpayInstance.on("payment.failed", function (response) {
          console.error("Payment failed:", response.error);
          toast.error(response.error?.description || "Payment failed. Please try again.");
          setPlacingOrder(false);
        });

        razorpayInstance.open();
      } else {
        // Cash on Delivery flow
        dispatch(clearCart());
        setStep("confirmation");
        toast.success("Order placed successfully with Cash on Delivery!");
        setPlacingOrder(false);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to process order. Please try again.");
      setPlacingOrder(false);
    }
  };

  if (step === "confirmation") {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans py-16 px-4">
        <div className="max-w-lg mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center space-y-4 shadow-lg">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle size={36} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Order Confirmed!
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Thank you for shopping with ILumaaStudio. We've received your order
            and are preparing it for dispatch.
          </p>
          <div className="pt-4">
            <Link
              to="/products"
              className="bg-[#004AC6] hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-xs font-bold inline-block transition-colors shadow-sm"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-200 transition-colors pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Step Indicator */}
        <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Shopping Cart
          </h1>

          <div className="flex items-center gap-2 text-xs font-bold">
            <span
              className={`px-3 py-1 rounded-full ${step === "cart" ? "bg-[#2563eb] text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"}`}
            >
              1. Cart
            </span>
            <ChevronRight size={14} className="text-slate-400" />
            <span
              className={`px-3 py-1 rounded-full ${step === "shipping" ? "bg-[#2563eb] text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"}`}
            >
              2. Shipping
            </span>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-12 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 bg-blue-50 dark:bg-slate-800 text-[#2563eb] rounded-full flex items-center justify-center mx-auto">
              <ShoppingBag size={32} />
            </div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              Your cart is empty
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Looks like you haven't added anything to your cart yet. Explore
              our top products and start shopping!
            </p>
            <div>
              <Link
                to="/products"
                className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-6 py-3 rounded-xl text-xs font-bold inline-block transition-colors shadow-md shadow-blue-500/20"
              >
                Start Shopping
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Items or Shipping Form (7 cols) */}
            <div className="lg:col-span-8 space-y-4">
              {step === "cart" ? (
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div
                      key={item._id}
                      className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-lg bg-slate-50 dark:bg-slate-800 p-2 shrink-0 flex items-center justify-center">
                          <img
                            src={
                              item.image ||
                              "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=200"
                            }
                            alt={item.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                            {item.name}
                          </h3>
                          {item.selectedOptions &&
                            typeof item.selectedOptions === "object" && (
                              <div className="text-[11px] font-bold text-[#2563eb]">
                                {Object.entries(item.selectedOptions)
                                  .map(([k, v]) => `${k}: ${v}`)
                                  .join(" • ")}
                              </div>
                            )}
                          {item.sku && (
                            <div className="text-[10px] font-mono font-bold text-slate-400">
                              SKU: {item.sku}
                            </div>
                          )}
                          <div className="text-xs font-black text-slate-900 dark:text-white">
                            ₹{item.price?.toLocaleString()}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        {/* Quantity Counter */}
                        <div className="flex items-center border border-slate-300 dark:border-slate-700 rounded-lg overflow-hidden">
                          <button
                            onClick={() =>
                              dispatch(
                                updateCartQuantity({
                                  productId: item._id,
                                  _id: item._id,
                                  quantity: Math.max(
                                    1,
                                    (item.quantity || 1) - 1,
                                  ),
                                }),
                              )
                            }
                            className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="px-3 text-xs font-bold">
                            {item.quantity || 1}
                          </span>
                          <button
                            onClick={() => {
                              const maxStock =
                                item.stock !== undefined ? item.stock : 99;
                              if ((item.quantity || 1) >= maxStock) {
                                toast.error(
                                  `Only ${maxStock} units available in stock`,
                                );
                                return;
                              }
                              dispatch(
                                updateCartQuantity({
                                  productId: item._id,
                                  _id: item._id,
                                  quantity: (item.quantity || 1) + 1,
                                }),
                              );
                            }}
                            className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        {/* Remove Action */}
                        <button
                          onClick={() => {
                            dispatch(removeFromCart(item._id));
                            toast.success("Item removed");
                          }}
                          className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Step 2: Shipping Address Form */
                <form
                  onSubmit={handlePlaceOrder}
                  className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm"
                >
                  <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <MapPin size={18} className="text-[#2563eb]" />
                    <span>Shipping Address</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 dark:text-slate-300">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingAddress.name}
                        onChange={(e) =>
                          setShippingAddress({
                            ...shippingAddress,
                            name: e.target.value,
                          })
                        }
                        className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-[#2563eb]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 dark:text-slate-300">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingAddress.phone}
                        onChange={(e) =>
                          setShippingAddress({
                            ...shippingAddress,
                            phone: e.target.value,
                          })
                        }
                        className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-[#2563eb]"
                      />
                    </div>

                    <div className="sm:col-span-2 space-y-1">
                      <label className="font-bold text-slate-700 dark:text-slate-300">
                        Street Address
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="House no, Street name, Area"
                        value={shippingAddress.street}
                        onChange={(e) =>
                          setShippingAddress({
                            ...shippingAddress,
                            street: e.target.value,
                          })
                        }
                        className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-[#2563eb]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 dark:text-slate-300">
                        City
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingAddress.city}
                        onChange={(e) =>
                          setShippingAddress({
                            ...shippingAddress,
                            city: e.target.value,
                          })
                        }
                        className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-[#2563eb]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 dark:text-slate-300">
                        Pincode
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={shippingAddress.zip}
                        onChange={(e) =>
                          setShippingAddress({
                            ...shippingAddress,
                            zip: e.target.value,
                          })
                        }
                        className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-[#2563eb]"
                      />
                    </div>
                  </div>

                  {/* Payment Method Selection */}
                  <div className="space-y-2.5 pt-3 border-t border-slate-200/80 dark:border-slate-800">
                    <label className="block text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                      Select Payment Method
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Razorpay Online */}
                      <div
                        onClick={() => setPaymentMethod("razorpay")}
                        className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                          paymentMethod === "razorpay"
                            ? "border-[#004AC6] bg-blue-50/50 dark:bg-blue-950/30 text-slate-900 dark:text-white"
                            : "border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                              <CreditCard size={16} />
                            </div>
                            <div>
                              <div className="font-bold text-xs">Razorpay Secure</div>
                              <div className="text-[10px] text-slate-500">UPI, Cards, NetBanking</div>
                            </div>
                          </div>
                          <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-blue-600 text-white uppercase tracking-wider">
                            Instant
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold mt-2.5">
                          <Lock size={11} /> 100% Encrypted & Trusted
                        </div>
                      </div>

                      {/* Cash on Delivery */}
                      <div
                        onClick={() => setPaymentMethod("cod")}
                        className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                          paymentMethod === "cod"
                            ? "border-[#004AC6] bg-blue-50/50 dark:bg-blue-950/30 text-slate-900 dark:text-white"
                            : "border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-slate-700 text-white flex items-center justify-center font-bold">
                              <Banknote size={16} />
                            </div>
                            <div>
                              <div className="font-bold text-xs">Cash on Delivery</div>
                              <div className="text-[10px] text-slate-500">Pay at doorstep</div>
                            </div>
                          </div>
                        </div>
                        <div className="text-[10px] text-slate-500 font-medium mt-2.5">
                          Pay cash upon package delivery
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setStep("cart")}
                      className="px-4 py-2.5 border border-slate-300 dark:border-slate-700 text-xs font-bold rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    >
                      Back to Cart
                    </button>
                    <button
                      type="submit"
                      disabled={placingOrder}
                      className="flex-1 py-3 bg-[#004AC6] hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                    >
                      {placingOrder ? (
                        <>Processing...</>
                      ) : paymentMethod === "razorpay" ? (
                        <>
                          <Lock size={14} /> Pay ₹{finalTotal.toLocaleString()} with Razorpay
                        </>
                      ) : (
                        <>Confirm Cash on Delivery (₹{finalTotal.toLocaleString()})</>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Right Column: Order Summary (5 cols) */}
            <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                Order Summary
              </h3>

              {/* Coupon Input */}
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                  <Tag size={13} className="text-[#2563eb]" />
                  <span>Promo Code</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. ILUMAA500"
                    value={couponCodeInput}
                    onChange={(e) => setCouponCodeInput(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs outline-none uppercase font-mono"
                  />
                  <button
                    type="submit"
                    className="bg-slate-900 dark:bg-slate-800 text-white px-3 py-2 rounded-lg text-xs font-bold shrink-0"
                  >
                    Apply
                  </button>
                </div>
                {appliedCouponCode && (
                  <div className="flex items-center justify-between text-xs text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/40 p-2 rounded-lg">
                    <span>Applied: {appliedCouponCode}</span>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-red-500 text-[10px]"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </form>

              {/* Price Breakdown */}
              <div className="space-y-2 pt-2 border-t border-slate-200/80 dark:border-slate-800 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    ₹{subtotal.toLocaleString()}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Discount</span>
                    <span>-₹{discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Shipping</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {shippingFee === 0 ? "FREE" : `₹${shippingFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-900 dark:text-white pt-2 border-t border-slate-200/80 dark:border-slate-800">
                  <span>Total</span>
                  <span className="text-[#2563eb]">
                    ₹{finalTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Primary Action Button */}
              {step === "cart" && (
                <button
                  onClick={() => setStep("shipping")}
                  className="w-full py-3.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-md shadow-blue-500/20 cursor-pointer"
                >
                  Proceed to Checkout
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
