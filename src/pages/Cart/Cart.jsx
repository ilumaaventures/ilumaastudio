import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Tag,
  Truck,
  CheckCircle,
  ArrowLeft,
  MapPin,
  AlertTriangle,
  RefreshCw,
  CheckCircle2,
  XCircle,
  CreditCard,
  Banknote,
  ShieldCheck,
  Check,
} from "lucide-react";
import {
  removeFromCart,
  updateCartQuantity,
  clearCart,
} from "../../redux/reducers/cartReducer";
import { placeOrder } from "../../api/orderService";
import { getAddresses } from "../../api/profileService";
import { validateCartItemsPincode } from "../../utils/pincodeService";
import {
  loadRazorpayScript,
  getRazorpayKey,
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "../../api/paymentApi";
import baseApi from "../../api/baseApi";
import toast from "react-hot-toast";

function Cart() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cartItems } = useSelector((state) => state.cart || { cartItems: [] });
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Steps: 'cart' | 'checkout' | 'success'
  const [step, setStep] = useState("cart");
  const [createdOrder, setCreatedOrder] = useState(null);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod"); // 'cod' | 'razorpay'

  // Coupon states
  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [appliedCouponCode, setAppliedCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponValidating, setCouponValidating] = useState(false);

  // Saved Addresses state
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [loadingAddresses, setLoadingAddresses] = useState(false);

  // Checkout shipping address form
  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "India",
    phone: user?.phone || "",
  });

  // Pincode validation states
  const [pincodeValidation, setPincodeValidation] = useState({
    results: {},
    allAvailable: true,
  });
  const [validatingPincode, setValidatingPincode] = useState(false);

  // Load saved addresses for logged-in user
  useEffect(() => {
    if (isAuthenticated) {
      const fetchSavedAddresses = async () => {
        try {
          setLoadingAddresses(true);
          const addrs = await getAddresses();
          const safeAddrs = Array.isArray(addrs)
            ? addrs
            : addrs?.addresses || addrs?.data || [];
          setSavedAddresses(safeAddrs);

          const defaultAddr =
            safeAddrs.find((a) => a.isDefault) || safeAddrs[0];
          if (defaultAddr) {
            setSelectedAddressId(defaultAddr._id || "default");
            setShippingAddress({
              fullName: defaultAddr.fullName || user?.name || "",
              street: defaultAddr.street || "",
              city: defaultAddr.city || "",
              state: defaultAddr.state || "",
              zip: defaultAddr.zip || defaultAddr.pincode || "",
              country: defaultAddr.country || "India",
              phone: defaultAddr.phone || user?.phone || "",
            });
          }
        } catch (err) {
          console.error("Error fetching saved addresses:", err);
        } finally {
          setLoadingAddresses(false);
        }
      };
      fetchSavedAddresses();
    }
  }, [isAuthenticated, user?.phone, user?.name]);

  // Handle selecting an existing saved address
  const handleSelectSavedAddress = (addrId) => {
    setSelectedAddressId(addrId);
    if (addrId === "new") {
      setShippingAddress({
        fullName: user?.name || "",
        street: "",
        city: "",
        state: "",
        zip: "",
        country: "India",
        phone: user?.phone || "",
      });
    } else {
      const selected = savedAddresses.find((a) => a._id === addrId);
      if (selected) {
        setShippingAddress({
          fullName: selected.fullName || user?.name || "",
          street: selected.street || "",
          city: selected.city || "",
          state: selected.state || "",
          zip: selected.zip || selected.pincode || "",
          country: selected.country || "India",
          phone: selected.phone || user?.phone || "",
        });
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  // Validate pincode for every item in cart whenever cart items or shipping address zip changes
  useEffect(() => {
    let isMounted = true;
    const runValidation = async () => {
      if (cartItems.length === 0) return;

      const zip = shippingAddress.zip?.toString().trim();
      if (/^\d{6}$/.test(zip)) {
        setValidatingPincode(true);
        const { results, allAvailable } = await validateCartItemsPincode(
          cartItems,
          zip,
        );
        if (isMounted) {
          setPincodeValidation({ results, allAvailable });
          setValidatingPincode(false);
        }
      } else {
        const results = {};
        cartItems.forEach((item) => {
          results[item._id] = {
            available: false,
            message: "Enter a valid 6-digit pincode to check delivery",
          };
        });
        if (isMounted) {
          setPincodeValidation({ results, allAvailable: false });
          setValidatingPincode(false);
        }
      }
    };

    runValidation();

    return () => {
      isMounted = false;
    };
  }, [cartItems, shippingAddress.zip]);

  const handleRemoveCouponQuiet = () => {
    setDiscountAmount(0);
    setAppliedCouponCode("");
    setCouponCodeInput("");
  };

  const handleRemoveCoupon = () => {
    handleRemoveCouponQuiet();
    toast.success("Coupon removed");
  };

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

      const { discountAmount: disc, code: returnedCode } = response.data;
      setDiscountAmount(disc);
      setAppliedCouponCode(returnedCode || code);
      toast.success(`Coupon "${returnedCode || code}" applied! Saved ₹${disc}`);
    } catch (err) {
      console.warn("Apply coupon error:", err);
      // Fallback discount logic for standard demo promo codes
      if (code === "ILUMAA500" || code === "FREESHIP" || code === "WELCOME10") {
        const disc = code === "ILUMAA500" ? 500 : Math.round(subtotal * 0.1);
        setDiscountAmount(disc);
        setAppliedCouponCode(code);
        toast.success(`Coupon "${code}" applied! Saved ₹${disc}`);
      } else {
        toast.error(err.response?.data?.message || "Failed to apply coupon");
        setDiscountAmount(0);
        setAppliedCouponCode("");
      }
    } finally {
      setCouponValidating(false);
    }
  };

  const updateQuantity = (id, newQty) => {
    dispatch(updateCartQuantity({ productId: id, _id: id, quantity: newQty }));
    if (appliedCouponCode) {
      handleRemoveCouponQuiet();
      toast.error("Cart updated. Please re-apply coupon.");
    }
  };

  const removeItem = (id) => {
    dispatch(removeFromCart(id));
    toast.success("Item removed from cart");
    if (appliedCouponCode) {
      handleRemoveCouponQuiet();
      toast.error("Cart updated. Please re-apply coupon.");
    }
  };

  const handleRemoveUnavailableProducts = () => {
    const unavailableItems = cartItems.filter(
      (item) => !pincodeValidation.results[item._id]?.available,
    );
    unavailableItems.forEach((item) => {
      dispatch(removeFromCart(item._id));
    });
    toast.success(`Removed ${unavailableItems.length} unavailable product(s)`);
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
    0,
  );

  const shipping = subtotal >= 5000 || subtotal === 0 ? 0 : 99;
  const tax = Math.round(subtotal * 0.12);
  const total = Math.max(0, subtotal + shipping + tax - discountAmount);

  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    if (!isAuthenticated) {
      toast.error("Please login to proceed to checkout");
      navigate("/login?redirect=/cart", { state: { from: location } });
      return;
    }
    if (!shippingAddress.zip || !/^\d{6}$/.test(shippingAddress.zip.trim())) {
      toast.error("Please enter a valid 6-digit shipping pincode");
      return;
    }
    if (!pincodeValidation.allAvailable) {
      toast.error(
        "Some items cannot be delivered to the selected pincode. Please update address or remove unavailable products.",
      );
      return;
    }
    setStep("checkout");
  };

  // Order Placement (COD & Razorpay)
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (
      !shippingAddress.street ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.zip ||
      !shippingAddress.phone
    ) {
      toast.error("Please fill in all required shipping details");
      return;
    }

    if (!pincodeValidation.allAvailable) {
      toast.error(
        "Some items cannot be delivered to your shipping pincode. Order placement blocked.",
      );
      return;
    }

    try {
      setPlacingOrder(true);

      const orderPayload = {
        items: cartItems.map((item) => ({
          product: item._id || item.product,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress: {
          fullName: shippingAddress.fullName || user?.name || "Customer",
          street: shippingAddress.street,
          city: shippingAddress.city,
          state: shippingAddress.state,
          zip: shippingAddress.zip,
          country: shippingAddress.country || "India",
          phone: shippingAddress.phone,
        },
        paymentInfo: {
          type: paymentMethod === "cod" ? "COD" : "Razorpay",
          status: "Pending",
        },
        shippingPrice: shipping,
        taxPrice: tax,
        couponCode: appliedCouponCode || undefined,
        totalPrice: total,
      };

      if (paymentMethod === "cod") {
        const order = await placeOrder(orderPayload);
        setCreatedOrder(order);
        dispatch(clearCart());
        setStep("success");
        toast.success("Order placed successfully!");
      } else {
        // Razorpay Online Flow
        const isLoaded = await loadRazorpayScript();
        if (!isLoaded) {
          toast.error("Razorpay SDK failed to load. Check your internet connection.");
          setPlacingOrder(false);
          return;
        }

        const razorpayOrder = await createRazorpayOrder({
          amount: total,
          currency: "INR",
          receipt: `rcpt_${Date.now()}`,
        });

        const rzpKey = await getRazorpayKey();

        const options = {
          key: rzpKey,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: "ILumaaStudio",
          description: `Payment for Order`,
          order_id: razorpayOrder.id,
          handler: async (response) => {
            try {
              const verifyRes = await verifyRazorpayPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });

              if (verifyRes.success) {
                const finalOrder = await placeOrder({
                  ...orderPayload,
                  paymentInfo: {
                    type: "Razorpay",
                    status: "Completed",
                    transactionId: response.razorpay_payment_id,
                  },
                });
                setCreatedOrder(finalOrder);
                dispatch(clearCart());
                setStep("success");
                toast.success("Payment successful & order placed!");
              } else {
                toast.error("Payment verification failed.");
              }
            } catch (err) {
              console.error("Verification error:", err);
              toast.error("Error verifying payment.");
            }
          },
          prefill: {
            name: shippingAddress.fullName || user?.name || "",
            email: user?.email || "",
            contact: shippingAddress.phone || user?.phone || "",
          },
          theme: {
            color: "#2563eb",
          },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error(error.response?.data?.message || "Failed to place order.");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (cartItems.length === 0 && step !== "success") {
    return (
      <div className="min-h-screen bg-slate-50 py-20 flex flex-col items-center justify-center px-6">
        <ShoppingBag size={64} className="text-slate-300 mb-6" />
        <h2 className="text-3xl font-black text-slate-900 mb-2">Your Cart is Empty</h2>
        <p className="text-slate-500 mb-8 max-w-sm text-center text-sm">
          Looks like you haven't added anything to your cart yet. Browse our
          handcrafted treasures and curated collections!
        </p>
        <Link to="/shop" onClick={() => window.scrollTo(0, 0)}>
          <button className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-8 py-3.5 rounded-2xl font-bold transition shadow-sm cursor-pointer">
            Start Shopping
          </button>
        </Link>
      </div>
    );
  }

  // Get unavailable items list for banner display
  const unavailableCartItems = cartItems.filter(
    (item) =>
      pincodeValidation.results[item._id] &&
      !pincodeValidation.results[item._id].available,
  );

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {step === "cart" && (
          <>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-[#2563eb] flex items-center justify-center shadow-xs">
                  <ShoppingBag size={24} />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                    Shopping Cart
                  </h1>
                  <p className="text-xs text-slate-500 font-medium">
                    {cartItems.length} item(s) in your bag
                  </p>
                </div>
              </div>

              {/* Delivery Pincode Input Bar */}
              <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center gap-3 max-w-md w-full">
                <div className="flex items-center gap-2 text-slate-700 font-bold text-xs">
                  <MapPin size={16} className="text-[#2563eb]" />
                  <span>Delivery Pincode:</span>
                </div>
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter 6-digit Pincode"
                    value={shippingAddress.zip}
                    onChange={(e) => {
                      const zipVal = e.target.value.replace(/\D/g, "");
                      setShippingAddress((prev) => ({ ...prev, zip: zipVal }));
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs outline-none focus:bg-white focus:border-[#2563eb] font-bold text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Warning Banner if products unavailable */}
            {!pincodeValidation.allAvailable &&
              shippingAddress.zip?.length === 6 && (
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 mb-8 text-rose-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle
                      size={20}
                      className="text-rose-600 shrink-0 mt-0.5"
                    />
                    <div>
                      <h4 className="font-bold text-sm">Delivery Notice</h4>
                      <p className="text-xs mt-0.5">
                        The following product(s) cannot be delivered to pincode{" "}
                        <span className="font-bold">{shippingAddress.zip}</span>:{" "}
                        <span className="font-semibold">
                          {unavailableCartItems.map((i) => i.name).join(", ")}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={handleRemoveUnavailableProducts}
                      className="bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      Remove Unavailable Products
                    </button>
                  </div>
                </div>
              )}

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => {
                  const valStatus = pincodeValidation.results[item._id];
                  const isItemAvailable = valStatus
                    ? valStatus.available
                    : true;
                  const itemImg =
                    item.image ||
                    item.images?.[0]?.url ||
                    (typeof item.images?.[0] === "string"
                      ? item.images[0]
                      : "");
                  const itemStock =
                    item.stock !== undefined
                      ? Number(item.stock)
                      : item.countInStock !== undefined
                        ? Number(item.countInStock)
                        : 99;

                  return (
                    <div
                      key={item._id}
                      className={`bg-white rounded-3xl p-5 shadow-2xs border transition-all ${!isItemAvailable && shippingAddress.zip?.length === 6
                        ? "border-rose-300 bg-rose-50/20"
                        : "border-slate-200/80"
                        }`}
                    >
                      <div className="flex flex-col sm:flex-row gap-5">
                        {/* Image */}
                        <img
                          src={itemImg}
                          alt={item.name}
                          className="w-full sm:w-24 h-28 object-cover rounded-2xl bg-slate-100"
                        />

                        {/* Details */}
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            {item.category && (
                              <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-[#2563eb] px-2.5 py-0.5 rounded-full border border-blue-100">
                                {typeof item.category === "object"
                                  ? item.category.name
                                  : item.category}
                              </span>
                            )}
                            {/* Pincode Availability Badge */}
                            {shippingAddress.zip?.length === 6 && (
                              validatingPincode ? (
                                <span className="text-[10px] bg-slate-100 text-slate-500 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                                  <RefreshCw size={10} className="animate-spin" /> Verifying...
                                </span>
                              ) : isItemAvailable ? (
                                <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                                  <CheckCircle2 size={11} /> {valStatus?.message || `Available for ${shippingAddress.zip}`}
                                </span>
                              ) : (
                                <span className="text-[10px] bg-rose-50 text-rose-600 border border-rose-200 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                                  <XCircle size={11} /> Not Deliverable to {shippingAddress.zip}
                                </span>
                              )
                            )}
                          </div>

                          <h3 className="font-bold text-sm text-slate-900 mt-2">
                            {item.name}
                          </h3>
                          {item.variantLabel && (
                            <p className="text-xs text-slate-500 mt-0.5">
                              Variant: {item.variantLabel}
                            </p>
                          )}
                          <p className="text-sm font-black text-slate-900 mt-2">
                            ₹{item.price}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex sm:flex-col justify-between items-end sm:items-end">
                          {/* Qty */}
                          <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                            <button
                              onClick={() =>
                                item.quantity > 1 &&
                                updateQuantity(item._id, item.quantity - 1)
                              }
                              className="p-2 hover:bg-slate-200 transition cursor-pointer"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={14} />
                            </button>

                            <span className="px-3 text-xs font-bold text-slate-900">
                              {item.quantity}
                            </span>

                            <button
                              onClick={() => {
                                if (item.quantity < itemStock) {
                                  updateQuantity(item._id, item.quantity + 1);
                                } else {
                                  toast.error(
                                    `Only ${itemStock} unit(s) available in stock.`,
                                  );
                                }
                              }}
                              className={`p-2 hover:bg-slate-200 transition ${item.quantity >= itemStock
                                ? "opacity-40 cursor-not-allowed"
                                : "cursor-pointer"
                                }`}
                              disabled={item.quantity >= itemStock}
                              aria-label="Increase quantity"
                            >
                              <Plus size={14} />
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(item._id)}
                            className="text-rose-500 flex items-center gap-1.5 mt-4 hover:text-rose-700 text-xs font-bold transition cursor-pointer"
                          >
                            <Trash2 size={14} />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Summary */}
              <div>
                <div className="bg-white rounded-3xl p-6 shadow-2xs border border-slate-200/80 sticky top-5 space-y-6">
                  <h2 className="text-xl font-black text-slate-900 border-b border-slate-100 pb-3">
                    Order Summary
                  </h2>

                  {/* Summary Rows */}
                  <div className="space-y-3 text-xs text-slate-600 border-b border-slate-100 pb-4">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-bold text-slate-900">
                        ₹{subtotal}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span>GST (12%)</span>
                      <span className="font-bold text-slate-900">₹{tax}</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Estimated Shipping</span>
                      <span className="font-bold text-slate-900">
                        {shipping === 0 ? (
                          <span className="text-emerald-600">FREE</span>
                        ) : (
                          `₹${shipping}`
                        )}
                      </span>
                    </div>

                    {discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-600 font-bold">
                        <span>Discount ({appliedCouponCode})</span>
                        <span>-₹{discountAmount}</span>
                      </div>
                    )}
                  </div>

                  {/* Coupon Application */}
                  <div className="border-b border-slate-100 pb-4">
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Have a Promo / Coupon Code?
                    </label>
                    {appliedCouponCode ? (
                      <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-xl text-emerald-800 text-xs font-bold">
                        <span className="uppercase tracking-wider">
                          Applied: {appliedCouponCode}
                        </span>
                        <button
                          type="button"
                          onClick={handleRemoveCoupon}
                          className="text-[11px] text-rose-500 hover:text-rose-700 font-black cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Coupon Code"
                          value={couponCodeInput}
                          onChange={(e) => setCouponCodeInput(e.target.value)}
                          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:bg-white focus:border-[#2563eb] uppercase font-bold text-slate-800 transition"
                        />
                        <button
                          type="button"
                          onClick={handleApplyCoupon}
                          disabled={couponValidating}
                          className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-4 py-2 rounded-xl text-xs font-bold transition disabled:opacity-50 cursor-pointer shadow-xs"
                        >
                          {couponValidating ? "..." : "Apply"}
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between text-base font-black text-slate-900">
                    <span>Total Amount</span>
                    <span className="text-lg text-[#2563eb]">₹{total}</span>
                  </div>

                  <button
                    onClick={handleProceedToCheckout}
                    disabled={!pincodeValidation.allAvailable || validatingPincode}
                    className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition shadow-sm disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                  >
                    {!pincodeValidation.allAvailable
                      ? "Unavailable Products in Cart"
                      : "Proceed To Checkout"}
                  </button>

                  {/* Free Shipping Alert */}
                  <div className="bg-emerald-50 border border-emerald-200/80 p-3.5 rounded-xl text-emerald-800 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-bold">
                      <Truck size={14} className="text-emerald-600" />
                      <span>Free Express Shipping</span>
                    </div>
                    <p className="text-[11px] text-emerald-700">
                      On orders above ₹5000 across serviceable PIN codes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {step === "checkout" && (
          <>
            {/* Back Button */}
            <button
              onClick={() => setStep("cart")}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 font-bold text-xs cursor-pointer"
            >
              <ArrowLeft size={16} />
              <span>Back to Cart</span>
            </button>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-8">
              Checkout & Shipping
            </h1>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Shipping Details */}
              <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 shadow-2xs border border-slate-200/80 space-y-6">
                <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                  <MapPin size={18} className="text-[#2563eb]" />
                  <span>Shipping Address</span>
                </h2>

                {/* Saved Address Selection Dropdown */}
                {isAuthenticated && savedAddresses.length > 0 && (
                  <div className="bg-blue-50/50 border border-blue-200/80 p-4 rounded-2xl space-y-2">
                    <label className="block text-[11px] font-bold text-[#2563eb] uppercase tracking-wider">
                      Select From Saved Addresses
                    </label>
                    <select
                      value={selectedAddressId}
                      onChange={(e) => handleSelectSavedAddress(e.target.value)}
                      className="w-full bg-white border border-blue-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none font-bold cursor-pointer"
                    >
                      {savedAddresses.map((addr) => (
                        <option key={addr._id} value={addr._id}>
                          {addr.isDefault ? "[DEFAULT] " : ""}
                          {addr.fullName ? `${addr.fullName} - ` : ""}
                          {addr.street}, {addr.city}, {addr.state} - {addr.zip || addr.pincode}
                        </option>
                      ))}
                      <option value="new">+ Enter New Shipping Address</option>
                    </select>
                  </div>
                )}

                <form onSubmit={handlePlaceOrder} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Full Name / Recipient <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={shippingAddress.fullName}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:bg-white focus:border-[#2563eb] font-semibold text-slate-900"
                        placeholder="Recipient full name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Phone Number <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="phone"
                        value={shippingAddress.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:bg-white focus:border-[#2563eb] font-semibold text-slate-900"
                        placeholder="10-digit mobile number"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Street Address & Landmark <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="street"
                      value={shippingAddress.street}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:bg-white focus:border-[#2563eb] font-semibold text-slate-900"
                      placeholder="House / Flat No., Building, Street Area"
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        City <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={shippingAddress.city}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:bg-white focus:border-[#2563eb] font-semibold text-slate-900"
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        State / Region <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={shippingAddress.state}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:bg-white focus:border-[#2563eb] font-semibold text-slate-900"
                        placeholder="State"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        6-Digit Pincode <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="zip"
                        value={shippingAddress.zip}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          setShippingAddress((prev) => ({ ...prev, zip: val }));
                        }}
                        required
                        maxLength={6}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:bg-white focus:border-[#2563eb] font-black text-slate-900"
                        placeholder="e.g. 110001"
                      />
                    </div>
                  </div>

                  {/* Payment Options */}
                  <div className="pt-6 border-t border-slate-100 space-y-3">
                    <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                      <CreditCard size={16} className="text-[#2563eb]" />
                      <span>Payment Method</span>
                    </h3>

                    <div className="grid sm:grid-cols-2 gap-3 pt-1">
                      {/* Cash on Delivery */}
                      <label
                        className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${paymentMethod === "cod"
                          ? "border-[#2563eb] bg-blue-50/50"
                          : "border-slate-200 bg-white hover:border-slate-300"
                          }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cod"
                          checked={paymentMethod === "cod"}
                          onChange={() => setPaymentMethod("cod")}
                          className="accent-[#2563eb] w-4 h-4 cursor-pointer"
                        />
                        <div className="flex items-center gap-2.5">
                          <Banknote size={20} className="text-emerald-600" />
                          <div>
                            <span className="font-black text-xs text-slate-900 block">
                              Cash on Delivery (COD)
                            </span>
                            <span className="text-[10px] text-slate-500">
                              Pay cash at your doorstep
                            </span>
                          </div>
                        </div>
                      </label>

                      {/* Online Razorpay */}
                      <label
                        className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${paymentMethod === "razorpay"
                          ? "border-[#2563eb] bg-blue-50/50"
                          : "border-slate-200 bg-white hover:border-slate-300"
                          }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="razorpay"
                          checked={paymentMethod === "razorpay"}
                          onChange={() => setPaymentMethod("razorpay")}
                          className="accent-[#2563eb] w-4 h-4 cursor-pointer"
                        />
                        <div className="flex items-center gap-2.5">
                          <CreditCard size={20} className="text-[#2563eb]" />
                          <div>
                            <span className="font-black text-xs text-slate-900 block">
                              Online Payment
                            </span>
                            <span className="text-[10px] text-slate-500">
                              UPI, Cards, NetBanking
                            </span>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={placingOrder || !pincodeValidation.allAvailable}
                    className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-wider transition shadow-md disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed mt-4"
                  >
                    {placingOrder
                      ? "Processing Order..."
                      : !pincodeValidation.allAvailable
                        ? "Cannot Place Order (Unavailable Products)"
                        : paymentMethod === "cod"
                          ? `Confirm & Place Order (₹${total})`
                          : `Pay & Place Order (₹${total})`}
                  </button>
                </form>
              </div>

              {/* Sidebar items list */}
              <div>
                <div className="bg-white rounded-3xl p-6 shadow-2xs border border-slate-200/80 sticky top-5 space-y-4">
                  <h2 className="text-base font-black text-slate-900 border-b border-slate-100 pb-3">
                    Items in Order ({cartItems.length})
                  </h2>
                  <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                    {cartItems.map((item) => {
                      const valStatus = pincodeValidation.results[item._id];
                      const isAvail = valStatus ? valStatus.available : true;
                      const itemImg =
                        item.image ||
                        item.images?.[0]?.url ||
                        (typeof item.images?.[0] === "string"
                          ? item.images[0]
                          : "");

                      return (
                        <div key={item._id} className="flex gap-3 items-center">
                          <img
                            src={itemImg}
                            alt=""
                            className="w-12 h-12 object-cover rounded-xl bg-slate-100 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-xs text-slate-900 truncate">
                              {item.name}
                            </h4>
                            <p className="text-[11px] text-slate-500">
                              Qty: {item.quantity} × ₹{item.price}
                            </p>
                            {!isAvail && (
                              <p className="text-[10px] text-rose-600 font-bold">
                                Not deliverable to {shippingAddress.zip}
                              </p>
                            )}
                          </div>
                          <span className="font-bold text-xs text-slate-900 shrink-0">
                            ₹{item.price * item.quantity}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="space-y-2 border-t border-slate-100 pt-3 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-bold text-slate-900">₹{subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>GST (12%)</span>
                      <span className="font-bold text-slate-900">₹{tax}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span className="font-bold text-slate-900">
                        {shipping === 0 ? (
                          <span className="text-emerald-600">FREE</span>
                        ) : (
                          `₹${shipping}`
                        )}
                      </span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-600 font-bold">
                        <span>Discount ({appliedCouponCode})</span>
                        <span>-₹{discountAmount}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-base font-black text-slate-900 border-t border-slate-100 pt-3">
                      <span>Total Amount</span>
                      <span className="text-[#2563eb]">₹{total}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {step === "success" && createdOrder && (
          <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-200/80 text-center py-16 space-y-6 animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle size={44} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
                Order Confirmed!
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                Thank you for your purchase. We have received your order and are
                preparing your items for dispatch.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 text-left space-y-3.5 text-xs border border-slate-100">
              <div className="flex justify-between border-b border-slate-200/60 pb-2.5">
                <span className="text-slate-500 font-medium">Order ID:</span>
                <span className="font-mono font-black text-slate-900">
                  {createdOrder._id || createdOrder.orderId}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-2.5">
                <span className="text-slate-500 font-medium">Payment Status:</span>
                <span className="font-bold text-emerald-600">
                  {createdOrder.paymentInfo?.status || "Pending"} (
                  {createdOrder.paymentInfo?.type || "COD"})
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-2.5">
                <span className="text-slate-500 font-medium">Total Amount:</span>
                <span className="font-black text-slate-900 text-sm">
                  ₹{createdOrder.totalPrice || createdOrder.totalAmount}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 font-bold block mb-1 uppercase tracking-wider">
                  Delivery Details:
                </span>
                <p className="font-bold text-slate-800">
                  {createdOrder.shippingAddress?.fullName || user?.name}
                </p>
                <p className="text-slate-600 mt-0.5">
                  {createdOrder.shippingAddress?.street},{" "}
                  {createdOrder.shippingAddress?.city},{" "}
                  {createdOrder.shippingAddress?.state} -{" "}
                  {createdOrder.shippingAddress?.zip}
                </p>
                <p className="text-slate-500 mt-1">
                  Phone: {createdOrder.shippingAddress?.phone}
                </p>
              </div>
            </div>

            <Link to="/shop">
              <button className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-8 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider transition shadow-sm cursor-pointer">
                Continue Shopping
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
