import React, { useState, useEffect, useRef } from "react";
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
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  PackagePlus,
  Store,
} from "lucide-react";
import {
  removeFromCart,
  updateCartQuantity,
  clearCart,
} from "../../redux/reducers/cartReducer";
import { placeOrder } from "../../api/orderService";
import { getAddresses } from "../../api/profileService";
import { validateCartItemsPincode } from "../../utils/pincodeService";
import { getProducts } from "../../api/productService";
import {
  loadRazorpayScript,
  getRazorpayKey,
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "../../api/paymentApi";
import baseApi from "../../api/baseApi";
import toast from "react-hot-toast";
import ProductCard from "../../Components/ProductCard";
import { ProductGridSkeleton } from "../../Components/Skeletons";

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

  // Dynamic category tax rate lookup map from backend
  const [categoriesMap, setCategoriesMap] = useState({});

  // Recommended products state
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const recScrollRef = useRef(null);

  // Fetch Recommended / Similar Products
  useEffect(() => {
    let isMounted = true;
    const fetchRecommendations = async () => {
      try {
        setLoadingRecommendations(true);
        const res = await getProducts({ limit: 12, isFeatured: true });
        const list = Array.isArray(res)
          ? res
          : res?.products || res?.data || [];

        const defaultPool = [
          {
            _id: "rec_1",
            name: "Handcrafted Terracotta Chai Cup Set",
            category: "Home & Living",
            price: 549,
            originalPrice: 899,
            rating: 4.8,
            reviewsCount: 42,
            image:
              "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=700&q=80",
            images: [
              {
                url: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=700&q=80",
              },
            ],
            countInStock: 25,
            isBestseller: true,
          },
          {
            _id: "rec_2",
            name: "Royal Kundan Meenakari Choker Necklace",
            category: "Jewellery",
            price: 1899,
            originalPrice: 2999,
            rating: 4.9,
            reviewsCount: 88,
            image:
              "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=700&q=80",
            images: [
              {
                url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=700&q=80",
              },
            ],
            countInStock: 12,
            isTrending: true,
          },
          {
            _id: "rec_3",
            name: "Pure Handloom Indigo Dabu Cotton Saree",
            category: "Apparel",
            price: 2450,
            originalPrice: 3800,
            rating: 4.7,
            reviewsCount: 52,
            image:
              "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=700&q=80",
            images: [
              {
                url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=700&q=80",
              },
            ],
            countInStock: 8,
            isEcoFriendly: true,
          },
          {
            _id: "rec_4",
            name: "Brass Dhokra Art Tribal Elephant Figurine",
            category: "Art & Crafts",
            price: 1290,
            originalPrice: 1999,
            rating: 4.9,
            reviewsCount: 29,
            image:
              "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=700&q=80",
            images: [
              {
                url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=700&q=80",
              },
            ],
            countInStock: 15,
            isBestseller: true,
          },
          {
            _id: "rec_5",
            name: "Handwoven Natural Jute Floor Runner",
            category: "Home & Living",
            price: 999,
            originalPrice: 1599,
            rating: 4.6,
            reviewsCount: 41,
            image:
              "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=700&q=80",
            images: [
              {
                url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=700&q=80",
              },
            ],
            countInStock: 20,
            isTrending: true,
          },
          {
            _id: "rec_6",
            name: "Handmade Mysore Sandalwood Dhoop Cones",
            category: "Fragrance & Wellness",
            price: 399,
            originalPrice: 650,
            rating: 4.9,
            reviewsCount: 95,
            image:
              "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=700&q=80",
            images: [
              {
                url: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=700&q=80",
              },
            ],
            countInStock: 50,
            isEcoFriendly: true,
          },
        ];

        const sourceList = list && list.length > 0 ? list : defaultPool;
        const formatted = sourceList.map((p, idx) => ({
          ...p,
          _id: p._id || p.id || `rec_${idx}`,
          name: p.name || "Recommended Product",
          category:
            typeof p.category === "object"
              ? p.category?.name || p.category?.title || "Handcrafted"
              : p.category || "Handcrafted",
          price: Number(p.price) || 499,
          originalPrice:
            Number(p.originalPrice) ||
            Math.round((Number(p.price) || 499) * 1.35),
          rating: Number(p.rating) || 4.8,
          reviewsCount: Number(p.reviewsCount || p.numReviews || 24),
          image:
            p.images?.[0]?.url ||
            (typeof p.images?.[0] === "string" ? p.images[0] : null) ||
            p.image ||
            defaultPool[idx % defaultPool.length].image,
          countInStock:
            p.countInStock !== undefined ? Number(p.countInStock) : 20,
          isBestseller: p.isBestseller || idx % 3 === 0,
          isTrending: p.isTrending || idx % 3 === 1,
          isEcoFriendly: p.isEcoFriendly || idx % 3 === 2,
        }));

        if (isMounted) {
          setRecommendedProducts(formatted);
        }
      } catch (err) {
        console.warn("Recommended products fetch error:", err);
      } finally {
        if (isMounted) setLoadingRecommendations(false);
      }
    };

    fetchRecommendations();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleScrollRecommendations = (direction) => {
    if (recScrollRef.current) {
      recScrollRef.current.scrollBy({
        left: direction === "left" ? -320 : 320,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const fetchCategoryTaxMap = async () => {
      try {
        const res = await baseApi.get("/categories?all=true");
        const list = Array.isArray(res.data)
          ? res.data
          : res.data?.categories || res.data?.data || [];
        const map = {};
        list.forEach((c) => {
          let taxVal =
            c.tax !== undefined && c.tax !== null
              ? Number(c.tax)
              : Number(c.taxRate || 0);

          if (!taxVal || isNaN(taxVal)) {
            const nameStr = (c.name || c.title || "").toLowerCase();
            if (
              nameStr.includes("jewel") ||
              nameStr.includes("kundan") ||
              nameStr.includes("earring") ||
              nameStr.includes("gem")
            ) {
              taxVal = 3;
            } else if (
              nameStr.includes("toy") ||
              nameStr.includes("soft") ||
              nameStr.includes("pillow") ||
              nameStr.includes("decor") ||
              nameStr.includes("home")
            ) {
              taxVal = 12;
            } else if (
              nameStr.includes("apparel") ||
              nameStr.includes("clothing") ||
              nameStr.includes("textile")
            ) {
              taxVal = 5;
            } else {
              taxVal = 5;
            }
          }

          if (c._id) map[c._id.toString()] = taxVal;
          if (c.name) map[c.name.toLowerCase().trim()] = taxVal;
          if (c.slug) map[c.slug.toLowerCase().trim()] = taxVal;
        });
        setCategoriesMap(map);
      } catch (e) {
        // ignore fetch error
      }
    };
    fetchCategoryTaxMap();
  }, []);

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
        cartItems: cartItems.map((item) => ({
          product: item._id || item.product,
          quantity: item.quantity || 1,
          price: item.price || 0,
          vendor: item.vendor || item.vendorId,
          business: item.business || item.businessId,
        })),
      });

      const {
        discount,
        discountAmount: discAmt,
        message,
        coupon,
      } = response.data;
      const finalDisc = discount !== undefined ? discount : discAmt || 0;
      const returnedCode = coupon?.code || code;

      setDiscountAmount(finalDisc);
      setAppliedCouponCode(returnedCode);
      toast.success(
        message || `Coupon "${returnedCode}" applied! Saved ₹${finalDisc}`,
      );
    } catch (err) {
      console.warn("Apply coupon error:", err);
      const errMsg = err.response?.data?.message || "Failed to apply coupon";
      toast.error(errMsg);
      setDiscountAmount(0);
      setAppliedCouponCode("");
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

  const getItemTaxRate = (item) => {
    // 1. Explicit item or populated category tax rate
    if (
      item.categoryTax !== undefined &&
      item.categoryTax !== null &&
      !isNaN(Number(item.categoryTax)) &&
      Number(item.categoryTax) > 0
    ) {
      return Number(item.categoryTax);
    }
    if (
      item.category &&
      typeof item.category === "object" &&
      item.category?.tax !== undefined &&
      item.category?.tax !== null &&
      Number(item.category.tax) > 0
    ) {
      return Number(item.category.tax);
    }
    if (
      item.taxRate !== undefined &&
      item.taxRate !== null &&
      !isNaN(Number(item.taxRate)) &&
      Number(item.taxRate) > 0
    ) {
      return Number(item.taxRate);
    }
    if (
      item.tax !== undefined &&
      item.tax !== null &&
      !isNaN(Number(item.tax)) &&
      Number(item.tax) > 0
    ) {
      return Number(item.tax);
    }

    // 2. Lookup in categoriesMap by ID or Name
    const catObj = typeof item.category === "object" ? item.category : null;
    const catId = catObj?._id
      ? catObj._id.toString()
      : typeof item.category === "string" &&
          /^[0-9a-fA-F]{24}$/.test(item.category)
        ? item.category
        : null;
    const catName =
      catObj?.name ||
      (typeof item.category === "string"
        ? item.category
        : item.categoryName || "");

    if (
      catId &&
      categoriesMap[catId] !== undefined &&
      Number(categoriesMap[catId]) > 0
    ) {
      return Number(categoriesMap[catId]);
    }
    if (
      catName &&
      categoriesMap[catName.trim().toLowerCase()] !== undefined &&
      Number(categoriesMap[catName.trim().toLowerCase()]) > 0
    ) {
      return Number(categoriesMap[catName.trim().toLowerCase()]);
    }

    // 3. Category & product name matching for GST tax rates
    const searchStr =
      `${catName} ${item.name || ""} ${item.craft || ""}`.toLowerCase();

    if (
      searchStr.includes("jewel") ||
      searchStr.includes("kundan") ||
      searchStr.includes("earring") ||
      searchStr.includes("chandbali") ||
      searchStr.includes("jadau") ||
      searchStr.includes("necklace") ||
      searchStr.includes("gem")
    ) {
      return 3; // 3% GST for Jewellery, Kundan & Gemstones
    }
    if (
      searchStr.includes("toy") ||
      searchStr.includes("soft toy") ||
      searchStr.includes("pillow") ||
      searchStr.includes("teddy") ||
      searchStr.includes("plush") ||
      searchStr.includes("decor") ||
      searchStr.includes("home") ||
      searchStr.includes("pottery")
    ) {
      return 12; // 12% GST for Soft Toys, Pillows & Home Decor
    }
    if (
      searchStr.includes("apparel") ||
      searchStr.includes("clothing") ||
      searchStr.includes("shirt") ||
      searchStr.includes("saree") ||
      searchStr.includes("textile") ||
      searchStr.includes("block print")
    ) {
      return 5; // 5% GST for Apparel & Textiles
    }
    if (
      searchStr.includes("beauty") ||
      searchStr.includes("cosmetic") ||
      searchStr.includes("electronic") ||
      searchStr.includes("gadget")
    ) {
      return 18; // 18% GST for Electronics & Cosmetics
    }

    // 4. Default fallback if category is present
    if (catName || catId || item.category) {
      return 5;
    }

    return 5;
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
    0,
  );

  const tax = cartItems.reduce((acc, item) => {
    const itemSubtotal = (item.price || 0) * (item.quantity || 1);
    const rate = getItemTaxRate(item);
    return acc + Math.round(itemSubtotal * (rate / 100));
  }, 0);

  const platformFee = cartItems.length > 0 ? 0 : 0;
  const shipping = subtotal >= 5000 || subtotal === 0 ? 0 : 99;
  const total = Math.max(
    0,
    subtotal + tax + platformFee + shipping - discountAmount,
  );

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
    window.scrollTo({ top: 0, behavior: "smooth" });
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
        window.scrollTo({ top: 0, behavior: "smooth" });
        toast.success("Order placed successfully!");
      } else {
        // Razorpay Online Flow
        const isLoaded = await loadRazorpayScript();
        if (!isLoaded) {
          toast.error(
            "Razorpay SDK failed to load. Check your internet connection.",
          );
          setPlacingOrder(false);
          return;
        }

        const razorpayRes = await createRazorpayOrder({
          amount: total,
          currency: "INR",
          receipt: `rcpt_${Date.now()}`,
        });

        const rzpOrderData = razorpayRes?.order || razorpayRes;
        const rzpKey = razorpayRes?.key || (await getRazorpayKey());
        const rzpOrderId = rzpOrderData?.id || null;

        const options = {
          key: rzpKey,
          amount: rzpOrderData?.amount || Math.round(total * 100),
          currency: rzpOrderData?.currency || "INR",
          name: "ILumaaStudio",
          description: `Payment for Order`,
          handler: async (response) => {
            try {
              const verifyRes = await verifyRazorpayPayment({
                razorpay_order_id: response.razorpay_order_id || rzpOrderId,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature:
                  response.razorpay_signature || "standard_auth",
                paymentId: razorpayRes?.paymentId || null,
              });

              if (verifyRes.success) {
                const finalOrder = await placeOrder({
                  ...orderPayload,
                  paymentInfo: {
                    type: "Razorpay",
                    status: "Completed",
                    transactionId: response.razorpay_payment_id,
                    razorpayOrderId: response.razorpay_order_id || rzpOrderId,
                    method: "Razorpay",
                    id: razorpayRes?.paymentId || null,
                  },
                });
                setCreatedOrder(finalOrder);
                dispatch(clearCart());
                setStep("success");
                window.scrollTo({ top: 0, behavior: "smooth" });
                toast.success("Payment successful & order placed!");
              } else {
                toast.error("Payment verification failed.");
              }
            } catch (err) {
              console.error("Verification error:", err);
              toast.error(
                err.response?.data?.message || "Error verifying payment.",
              );
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

        if (rzpOrderId) {
          options.order_id = rzpOrderId;
        }

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

  // Filter recommendations: remove products already in the cart
  const cartIds = new Set(
    cartItems.map((item) => String(item._id || item.product || item.id)),
  );
  const filteredRecommendations = recommendedProducts.filter(
    (p) => !cartIds.has(String(p._id || p.id)),
  );

  // Get unavailable items list for banner display
  const unavailableCartItems = cartItems.filter(
    (item) =>
      pincodeValidation.results[item._id] &&
      !pincodeValidation.results[item._id].available,
  );

  // Render Empty Cart Screen
  if (cartItems.length === 0 && step !== "success") {
    return (
      <div className="min-h-screen bg-slate-50 py-8 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Empty Cart Hero Card */}
          <div className="max-w-lg mx-auto bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 text-center shadow-2xs mb-12 sm:mb-16">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-blue-50 text-[#2563eb] flex items-center justify-center mx-auto mb-4 sm:mb-5 border border-blue-100 shadow-2xs">
              <ShoppingBag size={34} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
              Your Bag is Empty
            </h2>
            <p className="text-slate-500 mb-6 sm:mb-8 text-xs sm:text-sm leading-relaxed max-w-sm mx-auto">
              Looks like you haven't added anything to your cart yet. Discover
              our handcrafted treasures, trending crafts, and festival deals!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/shop"
                onClick={() => window.scrollTo(0, 0)}
                className="w-full sm:w-auto"
              >
                <button className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] active:scale-[0.98] text-white px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition shadow-sm cursor-pointer flex items-center justify-center gap-2">
                  <PackagePlus size={16} />
                  <span>Start Shopping</span>
                </button>
              </Link>
              <Link
                to="/"
                onClick={() => window.scrollTo(0, 0)}
                className="w-full sm:w-auto"
              >
                <button className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 px-6 py-3.5 rounded-xl font-bold text-xs transition cursor-pointer">
                  Explore Home
                </button>
              </Link>
            </div>
          </div>

          {/* Recommended Products on Empty Cart */}
          {recommendedProducts.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-end justify-between border-b border-slate-200/80 pb-3">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-[#2563eb] text-[11px] font-bold border border-blue-100 mb-1">
                    <Sparkles size={12} />
                    <span>Trending Recommendations</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Popular Products You May Like
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Handpicked customer favorites and artisanal bestsellers.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleScrollRecommendations("left")}
                    className="w-9 h-9 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hidden sm:flex items-center justify-center transition shadow-2xs cursor-pointer"
                    aria-label="Scroll left"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => handleScrollRecommendations("right")}
                    className="w-9 h-9 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hidden sm:flex items-center justify-center transition shadow-2xs cursor-pointer"
                    aria-label="Scroll right"
                  >
                    <ChevronRight size={16} />
                  </button>
                  <Link
                    to="/shop"
                    className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-bold text-[#2563eb] bg-blue-50 hover:bg-blue-100 border border-blue-200 transition"
                  >
                    <span>View Shop</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>

              {loadingRecommendations ? (
                <ProductGridSkeleton count={4} />
              ) : (
                <div
                  ref={recScrollRef}
                  className="flex gap-4 sm:gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-none py-2 px-0.5"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  {recommendedProducts.map((prod) => (
                    <ProductCard
                      key={prod._id || prod.id}
                      product={prod}
                      isCarousel={true}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-slate-50 py-6 sm:py-10 ${
        step === "cart" ? "pb-28 lg:pb-12" : "pb-12"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {step === "cart" && (
          <>
            {/* Header with Pincode and Shop More Action */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 sm:mb-8 border border-slate-200/80 p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white shadow-2xs">
              <div className="flex items-center justify-between sm:justify-start gap-3 w-full md:w-auto">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-blue-50 text-[#2563eb] flex items-center justify-center shadow-2xs border border-blue-100 shrink-0">
                    <ShoppingBag size={22} />
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
                      Shopping Cart
                    </h1>
                    <p className="text-xs text-slate-500 font-medium">
                      {cartItems.length}{" "}
                      {cartItems.length === 1 ? "item" : "items"} in your bag
                    </p>
                  </div>
                </div>

                {/* Mobile Shop More Quick Pill */}
                <Link
                  to="/shop"
                  className="inline-flex md:hidden items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-[#2563eb] bg-blue-50/80 border border-blue-200/60 shadow-2xs"
                >
                  <PackagePlus size={14} />
                  <span>Shop</span>
                </Link>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                {/* Desktop Option to Shop More Products */}
                <Link
                  to="/shop"
                  className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-[#2563eb] bg-slate-50 hover:bg-blue-50/60 border border-slate-200 hover:border-blue-200 transition shadow-2xs"
                >
                  <PackagePlus size={15} className="text-[#2563eb]" />
                  <span>Add More Products</span>
                </Link>

                {/* Delivery Pincode Bar */}
                <div className="bg-slate-50 p-2 sm:p-2.5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-2 max-w-full sm:max-w-xs w-full">
                  <MapPin size={16} className="text-[#2563eb] shrink-0 ml-1" />
                  <span className="text-[11px] font-bold text-slate-600 shrink-0 hidden xs:inline">
                    PIN Code:
                  </span>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter 6-digit Pincode"
                    value={shippingAddress.zip}
                    onChange={(e) => {
                      const zipVal = e.target.value.replace(/\D/g, "");
                      setShippingAddress((prev) => ({ ...prev, zip: zipVal }));
                    }}
                    className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs outline-none focus:border-[#2563eb] font-bold text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Warning Banner if products unavailable */}
            {!pincodeValidation.allAvailable &&
              shippingAddress.zip?.length === 6 && (
                <div className="bg-rose-50 border border-rose-200 rounded-2xl sm:rounded-3xl p-4 sm:p-5 mb-6 text-rose-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
                  <div className="flex items-start gap-3">
                    <AlertTriangle
                      size={20}
                      className="text-rose-600 shrink-0 mt-0.5"
                    />
                    <div>
                      <h4 className="font-bold text-sm">Delivery Notice</h4>
                      <p className="text-xs mt-0.5 leading-relaxed">
                        The following item(s) cannot be delivered to pincode{" "}
                        <span className="font-bold">{shippingAddress.zip}</span>
                        :{" "}
                        <span className="font-semibold">
                          {unavailableCartItems.map((i) => i.name).join(", ")}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={handleRemoveUnavailableProducts}
                      className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer shadow-2xs"
                    >
                      Remove Unavailable Products
                    </button>
                  </div>
                </div>
              )}

            <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Cart Items List */}
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
                  const itemTaxRate = getItemTaxRate(item);
                  const itemTaxAmt = Math.round(
                    (item.price || 0) *
                      (item.quantity || 1) *
                      (itemTaxRate / 100),
                  );

                  return (
                    <div
                      key={item._id}
                      className={`bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-2xs border transition-all hover:border-slate-300 ${
                        !isItemAvailable && shippingAddress.zip?.length === 6
                          ? "border-rose-300 bg-rose-50/20"
                          : "border-slate-200/80"
                      }`}
                    >
                      <div className="flex gap-3.5 sm:gap-5">
                        {/* Product Thumbnail */}
                        <div className="relative shrink-0">
                          <img
                            src={itemImg}
                            alt={item.name}
                            className="w-20 h-24 sm:w-28 sm:h-32 object-cover rounded-xl sm:rounded-2xl bg-slate-100 border border-slate-100 shadow-2xs"
                          />
                          {itemStock <= 5 && itemStock > 0 && (
                            <span className="absolute bottom-1 left-1 right-1 bg-amber-500/90 text-white text-[9px] font-bold py-0.5 rounded text-center backdrop-blur-xs">
                              Only {itemStock} left
                            </span>
                          )}
                        </div>

                        {/* Product Details & Actions */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            {/* Header tags & delete button */}
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex flex-wrap items-center gap-1.5">
                                {item.category && (
                                  <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-[#2563eb] px-2 py-0.5 rounded-md border border-blue-100">
                                    {typeof item.category === "object"
                                      ? item.category.name
                                      : item.category}
                                  </span>
                                )}
                                {/* Pincode Availability Status */}
                                {shippingAddress.zip?.length === 6 &&
                                  (validatingPincode ? (
                                    <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-bold flex items-center gap-1">
                                      <RefreshCw
                                        size={10}
                                        className="animate-spin"
                                      />{" "}
                                      Checking...
                                    </span>
                                  ) : isItemAvailable ? (
                                    <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md font-bold flex items-center gap-1">
                                      <CheckCircle2 size={11} /> Serviceable
                                    </span>
                                  ) : (
                                    <span className="text-[10px] bg-rose-50 text-rose-600 border border-rose-200 px-2 py-0.5 rounded-md font-bold flex items-center gap-1">
                                      <XCircle size={11} /> Not Deliverable
                                    </span>
                                  ))}
                              </div>

                              {/* Remove button */}
                              <button
                                onClick={() => removeItem(item._id)}
                                className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition cursor-pointer shrink-0"
                                title="Remove item"
                                aria-label="Remove item"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>

                            {/* Title & Variant */}
                            <h3 className="font-bold text-xs sm:text-sm text-slate-900 mt-1.5 line-clamp-2 leading-snug">
                              {item.name}
                            </h3>
                            {item.variantLabel && (
                              <p className="text-[11px] text-slate-500 mt-0.5">
                                Variant:{" "}
                                <span className="font-semibold text-slate-700">
                                  {item.variantLabel}
                                </span>
                              </p>
                            )}

                            {/* Unit Price & Tax */}
                            <div className="flex flex-wrap items-center gap-2 mt-1.5">
                              <span className="text-sm sm:text-base font-black text-slate-900">
                                ₹{item.price}
                              </span>
                              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                                Tax ({itemTaxRate}% GST): +₹{itemTaxAmt}
                              </span>
                            </div>
                          </div>

                          {/* Bottom Stepper & Total */}
                          <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100">
                            {/* Stepper */}
                            <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                              <button
                                onClick={() =>
                                  item.quantity > 1 &&
                                  updateQuantity(item._id, item.quantity - 1)
                                }
                                className="w-8 h-8 flex items-center justify-center hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                                aria-label="Decrease quantity"
                              >
                                <Minus size={13} />
                              </button>

                              <span className="px-2.5 text-xs font-black text-slate-900 min-w-[28px] text-center">
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
                                className={`w-8 h-8 flex items-center justify-center hover:bg-slate-200 text-slate-700 transition ${
                                  item.quantity >= itemStock
                                    ? "opacity-40 cursor-not-allowed"
                                    : "cursor-pointer"
                                }`}
                                disabled={item.quantity >= itemStock}
                                aria-label="Increase quantity"
                              >
                                <Plus size={13} />
                              </button>
                            </div>

                            {/* Item Subtotal */}
                            <div className="text-right">
                              <span className="text-[10px] text-slate-400 block font-medium">
                                Subtotal
                              </span>
                              <span className="text-xs sm:text-sm font-black text-slate-900">
                                ₹{item.price * item.quantity}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Option to add other products or browse store */}
                <div className="bg-gradient-to-r from-blue-50/80 via-indigo-50/40 to-blue-50/60 border border-blue-100 rounded-2xl sm:rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-3 text-left w-full sm:w-auto">
                    <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-xs shrink-0">
                      <PackagePlus size={20} />
                    </div>
                    <div>
                      <h4 className="font-black text-xs sm:text-sm text-slate-900">
                        Want to add more items to your order?
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                        Explore our latest festive collections, artisanal
                        crafts, and trending arrivals.
                      </p>
                    </div>
                  </div>
                  <Link
                    to="/shop"
                    className="w-full sm:w-auto text-center shrink-0 bg-white hover:bg-blue-50/50 text-[#2563eb] border border-blue-200 px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-2xs flex items-center justify-center gap-1.5"
                  >
                    <span>Browse All Collections</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>

              {/* Order Summary on Desktop */}
              <div>
                <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-2xs border border-slate-200/80 lg:sticky lg:top-24 space-y-5">
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
                    <span>Order Summary</span>
                    <span className="text-xs font-semibold text-slate-500">
                      {cartItems.reduce(
                        (sum, i) => sum + (i.quantity || 1),
                        0,
                      )}{" "}
                      items
                    </span>
                  </h2>

                  {/* Free Shipping Progress bar */}
                  <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
                    <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                      <span className="flex items-center gap-1.5 text-slate-700">
                        <Truck
                          size={14}
                          className={
                            subtotal >= 5000
                              ? "text-emerald-600"
                              : "text-[#2563eb]"
                          }
                        />
                        {subtotal >= 5000
                          ? "Free Express Shipping Unlocked!"
                          : `Add ₹${5000 - subtotal} more for FREE Delivery`}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {Math.min(100, Math.round((subtotal / 5000) * 100))}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          subtotal >= 5000 ? "bg-emerald-500" : "bg-[#2563eb]"
                        }`}
                        style={{
                          width: `${Math.min(100, Math.max(5, (subtotal / 5000) * 100))}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-2.5 text-xs text-slate-600 border-b border-slate-100 pb-4">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-bold text-slate-900">
                        ₹{subtotal}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span>Category Tax (GST)</span>
                      <span className="font-bold text-slate-900">₹{tax}</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Platform Fee</span>
                      <span className="font-bold text-slate-900">
                        ₹{platformFee}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span>Estimated Shipping</span>
                      <span className="font-bold text-slate-900">
                        {shipping === 0 ? (
                          <span className="text-emerald-600 font-black">
                            FREE
                          </span>
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

                  {/* Coupon Code Section */}
                  <div className="border-b border-slate-100 pb-4">
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Have a Promo or Gift Coupon?
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
                          className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-4 py-2 rounded-xl text-xs font-bold transition disabled:opacity-50 cursor-pointer shadow-2xs"
                        >
                          {couponValidating ? "..." : "Apply"}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Total Amount */}
                  <div className="flex justify-between items-baseline text-base font-black text-slate-900">
                    <span>Total Amount</span>
                    <span className="text-xl text-[#2563eb]">₹{total}</span>
                  </div>

                  {/* Desktop Checkout Button */}
                  <button
                    onClick={handleProceedToCheckout}
                    disabled={
                      !pincodeValidation.allAvailable || validatingPincode
                    }
                    className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] active:scale-[0.99] text-white py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider transition shadow-md disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <span>
                      {!pincodeValidation.allAvailable
                        ? "Unavailable Items in Cart"
                        : "Proceed to Checkout"}
                    </span>
                    <ArrowRight size={15} />
                  </button>

                  {/* Safe & Secure Guarantee */}
                  <div className="pt-2 flex items-center justify-center gap-2 text-[11px] font-semibold text-slate-400">
                    <ShieldCheck size={15} className="text-emerald-500" />
                    <span>100% Safe & Secure Checkout Guarantee</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Sticky Checkout Bottom Bar */}
            <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-4 py-3 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] lg:hidden flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    Total
                  </span>
                  <span className="text-lg font-black text-slate-900">
                    ₹{total}
                  </span>
                </div>
                <div className="text-[10px] text-emerald-600 font-semibold truncate">
                  {shipping === 0
                    ? "✓ Free shipping included"
                    : "+₹99 standard shipping"}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  to="/shop"
                  className="px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1 hover:bg-slate-100 transition"
                  title="Browse more products"
                >
                  <PackagePlus size={15} />
                  <span className="hidden xs:inline">Shop</span>
                </Link>
                <button
                  onClick={handleProceedToCheckout}
                  disabled={
                    !pincodeValidation.allAvailable || validatingPincode
                  }
                  className="bg-[#2563eb] hover:bg-[#1d4ed8] active:scale-[0.98] text-white px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  <span>Checkout</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* Recommended / Similar Products Section */}
            <div className="mt-14 pt-10 border-t border-slate-200/80">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-[#2563eb] text-[11px] font-bold border border-blue-100 mb-2">
                    <Sparkles size={12} />
                    <span>Curated Recommendations</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Similar Products You May Like
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Artisanal crafts and trending items frequently paired with
                    your bag selections.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="hidden sm:flex items-center gap-1.5">
                    <button
                      onClick={() => handleScrollRecommendations("left")}
                      className="w-9 h-9 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center transition shadow-2xs cursor-pointer"
                      aria-label="Scroll left"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={() => handleScrollRecommendations("right")}
                      className="w-9 h-9 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center transition shadow-2xs cursor-pointer"
                      aria-label="Scroll right"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                  <Link
                    to="/shop"
                    className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-bold text-[#2563eb] bg-blue-50/80 hover:bg-blue-100 border border-blue-200/60 transition shadow-2xs"
                  >
                    <span>Browse All</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>

              {loadingRecommendations ? (
                <ProductGridSkeleton count={4} />
              ) : filteredRecommendations.length > 0 ? (
                <div
                  ref={recScrollRef}
                  className="flex gap-4 sm:gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-none py-2 px-0.5"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  {filteredRecommendations.map((prod) => (
                    <ProductCard
                      key={prod._id || prod.id}
                      product={prod}
                      isCarousel={true}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          </>
        )}

        {step === "checkout" && (
          <>
            {/* Back Button */}
            <button
              onClick={() => setStep("cart")}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 font-bold text-xs cursor-pointer group"
            >
              <ArrowLeft
                size={16}
                className="transition-transform group-hover:-translate-x-0.5"
              />
              <span>Back to Cart</span>
            </button>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-6 sm:mb-8">
              Checkout & Shipping
            </h1>

            <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Shipping Details */}
              <div className="lg:col-span-2 bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xs border border-slate-200/80 space-y-6">
                <h2 className="text-base sm:text-lg font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                  <MapPin size={18} className="text-[#2563eb]" />
                  <span>Shipping Address</span>
                </h2>

                {/* Saved Address Selection Dropdown */}
                {isAuthenticated && savedAddresses.length > 0 && (
                  <div className="bg-blue-50/50 border border-blue-200/80 p-3.5 sm:p-4 rounded-2xl space-y-2">
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
                          {addr.street}, {addr.city}, {addr.state} -{" "}
                          {addr.zip || addr.pincode}
                        </option>
                      ))}
                      <option value="new">+ Enter New Shipping Address</option>
                    </select>
                  </div>
                )}

                <form onSubmit={handlePlaceOrder} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Full Name / Recipient{" "}
                        <span className="text-rose-500">*</span>
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
                      Street Address & Landmark{" "}
                      <span className="text-rose-500">*</span>
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

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                        className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                          paymentMethod === "cod"
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
                        className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                          paymentMethod === "razorpay"
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
                <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-2xs border border-slate-200/80 lg:sticky lg:top-24 space-y-4">
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
                            className="w-12 h-12 object-cover rounded-xl bg-slate-100 shrink-0 border border-slate-100"
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
                      <span className="font-bold text-slate-900">
                        ₹{subtotal}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Category Tax (GST)</span>
                      <span className="font-bold text-slate-900">₹{tax}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Platform Fee</span>
                      <span className="font-bold text-slate-900">
                        ₹{platformFee}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span className="font-bold text-slate-900">
                        {shipping === 0 ? (
                          <span className="text-emerald-600 font-bold">
                            FREE
                          </span>
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
          <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-12 shadow-sm border border-slate-200/80 text-center py-12 sm:py-16 space-y-6 animate-fade-in">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle size={40} />
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

            <div className="bg-slate-50 rounded-2xl p-5 sm:p-6 text-left space-y-3 text-xs border border-slate-100">
              <div className="flex justify-between border-b border-slate-200/60 pb-2.5">
                <span className="text-slate-500 font-medium">Order ID:</span>
                <span className="font-mono font-black text-slate-900">
                  {createdOrder._id || createdOrder.orderId}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-2.5">
                <span className="text-slate-500 font-medium">
                  Payment Status:
                </span>
                <span className="font-bold text-emerald-600">
                  {createdOrder.paymentInfo?.status || "Pending"} (
                  {createdOrder.paymentInfo?.type || "COD"})
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-2.5">
                <span className="text-slate-500 font-medium">
                  Total Amount:
                </span>
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

