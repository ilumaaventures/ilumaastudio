import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock3,
  MapPin,
  Phone,
  ChevronRight,
  ShoppingBag,
  CircleHelp,
  CalendarDays,
  RefreshCw,
  AlertCircle,
  XCircle,
  CornerUpLeft,
  ArrowLeft,
} from "lucide-react";
import { getOrderDetails, getMyOrders } from "../../api/orderService";
import toast from "react-hot-toast";

function TrackOrder() {
  const { id: urlParamId } = useParams();
  const [searchParams] = useSearchParams();
  const queryId = searchParams.get("id") || searchParams.get("orderId");

  const initialSearchId = urlParamId || queryId || "";
  const [inputOrderId, setInputOrderId] = useState(initialSearchId);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchTrackData = async (targetId) => {
    if (!targetId || !targetId.trim()) return;
    const cleanId = targetId.trim().replace(/^#/, "");

    try {
      setLoading(true);
      setErrorMsg("");

      let result = null;
      try {
        result = await getOrderDetails(cleanId);
      } catch (err) {
        // Fallback: search in customer's my-orders
        const myOrdersRes = await getMyOrders();
        const list = Array.isArray(myOrdersRes) ? myOrdersRes : myOrdersRes?.orders || [];
        result = list.find(
          (o) =>
            o._id === cleanId ||
            o._id?.toString().toLowerCase().endsWith(cleanId.toLowerCase()) ||
            String(o._id).slice(-8).toUpperCase() === cleanId.toUpperCase()
        );
      }

      if (result) {
        setOrder(result);
      } else {
        setOrder(null);
        setErrorMsg(`No order found matching ID "${targetId}". Please verify your order number.`);
      }
    } catch (err) {
      console.error("Track order error:", err);
      setOrder(null);
      setErrorMsg(err.response?.data?.message || "Order not found. Check your order ID.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialSearchId) {
      fetchTrackData(initialSearchId);
    }
  }, [initialSearchId]);

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (!inputOrderId.trim()) {
      toast.error("Please enter a valid order ID");
      return;
    }
    fetchTrackData(inputOrderId);
  };

  const getTrackingSteps = (currentStatus) => {
    const statusLower = (currentStatus || "pending").toLowerCase();
    const isCancelled = statusLower.includes("cancel");
    const isReturned = statusLower.includes("return") || statusLower.includes("refund");

    if (isCancelled) {
      return [
        { title: "Order Placed", description: "Your order was received.", completed: true, icon: ShoppingBag },
        { title: "Order Cancelled", description: "Order was cancelled.", completed: true, isCancelled: true, current: true, icon: XCircle },
      ];
    }

    if (isReturned) {
      return [
        { title: "Order Placed", description: "Your order was received.", completed: true, icon: ShoppingBag },
        { title: "Delivered", description: "Package delivered.", completed: true, icon: CheckCircle2 },
        { title: "Return / Refund Processed", description: "Return request processed.", completed: true, isReturn: true, current: true, icon: CornerUpLeft },
      ];
    }

    const steps = [
      {
        title: "Order Placed",
        description: "Your order has been successfully placed.",
        statusKey: "pending",
        icon: ShoppingBag,
      },
      {
        title: "Processing & Packed",
        description: "The seller is preparing and packing your items.",
        statusKey: "processing",
        icon: Package,
      },
      {
        title: "Shipped in Transit",
        description: "Your package is on its way with our courier partner.",
        statusKey: "shipped",
        icon: Truck,
      },
      {
        title: "Out for Delivery",
        description: "Delivery executive is arriving at your address.",
        statusKey: "out for delivery",
        icon: Truck,
      },
      {
        title: "Delivered",
        description: "Package successfully delivered to customer.",
        statusKey: "delivered",
        icon: CheckCircle2,
      },
    ];

    let currentStepIdx = 0;
    if (statusLower.includes("delivered")) currentStepIdx = 4;
    else if (statusLower.includes("out")) currentStepIdx = 3;
    else if (statusLower.includes("ship")) currentStepIdx = 2;
    else if (statusLower.includes("process") || statusLower.includes("pack")) currentStepIdx = 1;
    else currentStepIdx = 0;

    return steps.map((s, idx) => ({
      ...s,
      completed: idx <= currentStepIdx,
      current: idx === currentStepIdx,
    }));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header Banner */}
      <section className="bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="max-w-3xl">
            <Link
              to="/profile"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#2563eb] mb-4 transition"
            >
              <ArrowLeft size={14} /> Back to My Orders
            </Link>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#2563eb] border border-blue-100 text-xs font-bold mb-3">
              <Package size={14} />
              <span>Real-Time Order Tracking</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Track Your Order Status
            </h1>

            <p className="mt-2 text-slate-500 text-sm sm:text-base">
              Enter your Order ID to view real-time fulfillment progress, courier dispatch status, and item details.
            </p>
          </div>

          {/* Search Bar Form */}
          <form
            onSubmit={handleTrackSubmit}
            className="mt-6 max-w-3xl bg-slate-50 border border-slate-200 rounded-2xl p-2 flex flex-col sm:flex-row gap-2 shadow-2xs"
          >
            <div className="flex-1 relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={inputOrderId}
                onChange={(e) => setInputOrderId(e.target.value)}
                placeholder="Enter Order ID e.g. 64f128ab9e... or #ID"
                className="w-full h-12 pl-11 pr-4 bg-white rounded-xl border border-slate-200 outline-none text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:border-[#2563eb] focus:ring-4 focus:ring-blue-50 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="h-12 px-7 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 cursor-pointer"
            >
              {loading ? (
                <RefreshCw size={16} className="animate-spin" />
              ) : (
                <>
                  <span>Track Order</span>
                  <ChevronRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && (
          <div className="py-20 text-center space-y-3">
            <RefreshCw size={32} className="animate-spin text-[#2563eb] mx-auto" />
            <p className="text-sm font-bold text-slate-700">Fetching order tracking information...</p>
          </div>
        )}

        {!loading && errorMsg && (
          <div className="bg-white border border-rose-200 rounded-2xl p-8 max-w-2xl mx-auto text-center space-y-3 shadow-xs">
            <AlertCircle size={36} className="text-rose-500 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">Order Not Found</h3>
            <p className="text-xs text-slate-500">{errorMsg}</p>
            <div className="pt-2">
              <Link
                to="/profile"
                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-5 py-2.5 rounded-xl text-xs font-bold transition"
              >
                Go to My Orders
              </Link>
            </div>
          </div>
        )}

        {!loading && order && (
          <div className="space-y-6">
            {/* Top Order Overview Banner */}
            <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-2xs">
              <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-lg font-black text-slate-900 font-mono">
                      Order #{order._id ? order._id.toUpperCase() : "N/A"}
                    </h2>
                    <span className="px-3 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-black">
                      ● {order.status || "Processing"}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    Placed on {order.createdAt ? new Date(order.createdAt).toLocaleString("en-IN") : "N/A"}
                  </p>
                </div>

                <div className="flex items-center gap-3 bg-blue-50/60 border border-blue-100 p-3 rounded-xl">
                  <Truck size={22} className="text-[#2563eb]" />
                  <div>
                    <p className="text-[10px] font-bold uppercase text-slate-400">Estimated Delivery</p>
                    <p className="text-xs font-black text-slate-900">
                      {order.deliveredAt
                        ? `Delivered on ${new Date(order.deliveredAt).toLocaleDateString("en-IN")}`
                        : "Expected in 3-5 Business Days"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Real-time Tracking Stepper Timeline */}
              <div className="p-6 sm:p-8">
                <h3 className="font-extrabold text-slate-900 text-sm mb-6">Fulfillment Progress</h3>
                <div className="relative">
                  {getTrackingSteps(order.status).map((step, idx, arr) => {
                    const StepIcon = step.icon;
                    const isLast = idx === arr.length - 1;

                    return (
                      <div key={step.title} className="relative flex gap-4">
                        {!isLast && (
                          <div
                            className={`absolute left-[17px] top-9 w-0.5 h-[calc(100%-8px)] ${
                              step.completed ? "bg-[#2563eb]" : "bg-slate-200"
                            }`}
                          />
                        )}

                        <div
                          className={`relative z-10 w-9 h-9 shrink-0 rounded-full flex items-center justify-center font-bold ${
                            step.isCancelled
                              ? "bg-rose-500 text-white ring-8 ring-rose-50"
                              : step.current
                              ? "bg-[#2563eb] text-white ring-8 ring-blue-50"
                              : step.completed
                              ? "bg-blue-100 text-[#2563eb]"
                              : "bg-slate-100 text-slate-400"
                          }`}
                        >
                          <StepIcon size={16} />
                        </div>

                        <div className="pb-8 flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                            <h4
                              className={`text-xs font-black ${
                                step.isCancelled
                                  ? "text-rose-600"
                                  : step.current
                                  ? "text-[#2563eb]"
                                  : step.completed
                                  ? "text-slate-900"
                                  : "text-slate-400"
                              }`}
                            >
                              {step.title}
                            </h4>
                          </div>
                          <p className="mt-0.5 text-xs text-slate-500">{step.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom 2 Grid: Order Items & Delivery Info */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Order Items List */}
              <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-2xs">
                <div className="p-5 border-b border-slate-100">
                  <h3 className="font-extrabold text-slate-900 text-sm">
                    Order Items ({order.items?.length || 0})
                  </h3>
                </div>

                <div className="divide-y divide-slate-100">
                  {order.items?.map((item, idx) => {
                    const itemStatusStr = item.status || order.status || "Pending";
                    const isItemDelivered = itemStatusStr.toLowerCase().includes("delivered");
                    const isItemCancelled = itemStatusStr.toLowerCase().includes("cancel");

                    let statusBadgeClass = "bg-blue-50 text-blue-700 border-blue-200";
                    if (isItemDelivered) statusBadgeClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
                    else if (isItemCancelled) statusBadgeClass = "bg-rose-50 text-rose-700 border-rose-200";
                    else if (itemStatusStr.toLowerCase().includes("return")) statusBadgeClass = "bg-amber-50 text-amber-700 border-amber-200";
                    else if (itemStatusStr.toLowerCase().includes("replacement")) statusBadgeClass = "bg-purple-50 text-purple-700 border-purple-200";

                    return (
                      <div key={item._id || idx} className="p-4 space-y-2 hover:bg-slate-50/50 transition">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3.5">
                            <img
                              src={
                                item.product?.images?.[0]?.url ||
                                item.product?.image ||
                                item.image ||
                                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=200&q=80"
                              }
                              alt={item.product?.name || "Product"}
                              className="w-14 h-14 rounded-xl object-cover border border-slate-200 bg-slate-50 shrink-0"
                            />
                            <div className="space-y-1">
                              <h4 className="text-xs font-extrabold text-slate-900 leading-snug">
                                {item.product?.name || item.name || "Product Item"}
                              </h4>
                              <p className="text-[11px] text-slate-500 font-medium">
                                Unit Price: ₹{(item.price || 0).toLocaleString("en-IN")} • Qty: {item.quantity || 1}
                              </p>
                              
                              <div className="flex flex-wrap items-center gap-2 pt-0.5">
                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[10px] font-black uppercase ${statusBadgeClass}`}>
                                  ● Item Status: {itemStatusStr}
                                </span>

                                {item.returnRequest?.isRequested && (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-extrabold">
                                    {item.returnRequest.requestType || "Return"} Request ({item.returnRequest.status})
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-[10px] font-bold uppercase text-slate-400 block">Subtotal</span>
                            <span className="text-sm font-black text-slate-900">
                              ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString("en-IN")}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Delivery Details Card */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-4 shadow-2xs">
                <h3 className="font-extrabold text-slate-900 text-sm border-b border-slate-100 pb-3">
                  Delivery Details
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex gap-3">
                    <MapPin size={18} className="text-[#2563eb] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Shipping Address</p>
                      <p className="font-bold text-slate-900 mt-0.5">
                        {order.shippingAddress?.fullName || order.user?.name || "Customer"}
                      </p>
                      <p className="text-slate-600 mt-0.5">{order.shippingAddress?.street || "N/A"}</p>
                      <p className="text-slate-500">
                        {order.shippingAddress?.city || ""}, {order.shippingAddress?.state || ""}{" "}
                        {order.shippingAddress?.zip || ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2 border-t border-slate-100">
                    <ShoppingBag size={18} className="text-[#2563eb] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Payment Summary</p>
                      <p className="font-bold text-slate-900 mt-0.5">
                        Method: {order.paymentInfo?.type || order.paymentMethod || "COD"}
                      </p>
                      <p className="text-[#2563eb] font-black text-sm mt-0.5">
                        Total: ₹{(order.totalPrice || order.total || 0).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Initial Empty Search Prompt */}
        {!loading && !order && !errorMsg && (
          <div className="py-16 text-center max-w-md mx-auto space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#2563eb] flex items-center justify-center mx-auto">
              <Package size={30} />
            </div>
            <h2 className="text-lg font-extrabold text-slate-900">Enter Your Order ID</h2>
            <p className="text-xs text-slate-500">
              Enter your Order ID above or select an order from your profile to track real-time fulfillment status.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default TrackOrder;
