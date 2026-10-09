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
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";
import {
  getOrderDetails,
  getMyOrders,
  getOrderShipments,
  trackPublicShipment,
} from "../../api/orderService";
import toast from "react-hot-toast";

function TrackOrder() {
  const { id: urlParamId } = useParams();
  const [searchParams] = useSearchParams();
  const queryId = searchParams.get("id") || searchParams.get("orderId");

  const initialSearchId = urlParamId || queryId || "";
  const [inputOrderId, setInputOrderId] = useState(initialSearchId);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [shipments, setShipments] = useState([]);
  const [copiedAwb, setCopiedAwb] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchTrackData = async (targetId) => {
    if (!targetId || !targetId.trim()) return;
    const cleanId = targetId.trim().replace(/^#/, "");

    try {
      setLoading(true);
      setErrorMsg("");

      let result = null;
      let fetchedShipments = [];

      // 1. Try public logistics tracking first (supports AWB, order ID, or tracking number)
      try {
        const publicRes = await trackPublicShipment(cleanId);
        if (
          publicRes &&
          publicRes.success &&
          (publicRes.shipment || publicRes.order)
        ) {
          result = publicRes.order || {
            _id:
              publicRes.shipment?.order?._id ||
              publicRes.shipment?.order ||
              cleanId,
            awbNumber: publicRes.awb,
            trackingNumber: publicRes.trackingNumber,
            trackingUrl: publicRes.trackingUrl,
            courierPartner: publicRes.courierPartner || "Shadowfax Logistics",
            status: publicRes.status,
            createdAt: publicRes.shipment?.createdAt || new Date(),
            items: publicRes.shipment?.items || [],
            shippingAddress: publicRes.deliveryAddress,
            warehouse: publicRes.originWarehouse,
            totalPrice:
              publicRes.order?.totalPrice ||
              publicRes.shipment?.declaredValue ||
              0,
            paymentInfo: publicRes.order?.paymentInfo || {
              method: publicRes.shipment?.paymentMode || "COD",
            },
          };
          if (publicRes.shipment) {
            fetchedShipments = [publicRes.shipment];
          } else if (publicRes.order?.shipments) {
            fetchedShipments = publicRes.order.shipments;
          }
        }
      } catch (pubErr) {
        // Fallback to customer authenticated order endpoint
      }

      // 2. Fallback to order details endpoint
      if (!result) {
        try {
          result = await getOrderDetails(cleanId);
        } catch (err) {
          // Fallback: search in customer's my-orders
          const myOrdersRes = await getMyOrders();
          const list = Array.isArray(myOrdersRes)
            ? myOrdersRes
            : myOrdersRes?.orders || [];
          result = list.find(
            (o) =>
              o._id === cleanId ||
              o.awbNumber === cleanId ||
              o.trackingNumber === cleanId ||
              o._id?.toString().toLowerCase().endsWith(cleanId.toLowerCase()) ||
              String(o._id).slice(-8).toUpperCase() === cleanId.toUpperCase()
          );
        }
      }

      if (result) {
        setOrder(result);

        if (fetchedShipments.length > 0) {
          setShipments(fetchedShipments);
        } else {
          // Fetch dedicated shipment logistics transactions
          try {
            const shipRes = await getOrderShipments(result._id);
            const shipList = Array.isArray(shipRes)
              ? shipRes
              : shipRes.shipments || [];
            setShipments(shipList);
          } catch (shipErr) {
            // Fallback to populated order.shipments if available
            setShipments(result.shipments || []);
          }
        }
      } else {
        setOrder(null);
        setShipments([]);
        setErrorMsg(
          `No order or shipment found matching "${targetId}". Please verify your AWB or Order number.`
        );
      }
    } catch (err) {
      console.error("Track order error:", err);
      setOrder(null);
      setShipments([]);
      setErrorMsg(
        err.response?.data?.message || "Order not found. Check your order ID."
      );
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

  const handleCopyAwb = (awb) => {
    if (!awb) return;
    navigator.clipboard.writeText(awb);
    setCopiedAwb(awb);
    toast.success("AWB Number copied to clipboard");
    setTimeout(() => setCopiedAwb(null), 2500);
  };

  const getTrackingSteps = (currentStatus) => {
    const statusLower = (currentStatus || "pending").toLowerCase();
    const isCancelled = statusLower.includes("cancel");
    const isReturned =
      statusLower.includes("return") || statusLower.includes("refund");

    if (isCancelled) {
      return [
        {
          title: "Order Placed",
          description: "Your order was received.",
          completed: true,
          icon: ShoppingBag,
        },
        {
          title: "Order Cancelled",
          description: "Order was cancelled.",
          completed: true,
          isCancelled: true,
          current: true,
          icon: XCircle,
        },
      ];
    }

    if (isReturned) {
      return [
        {
          title: "Order Placed",
          description: "Your order was received.",
          completed: true,
          icon: ShoppingBag,
        },
        {
          title: "Delivered",
          description: "Package delivered.",
          completed: true,
          icon: CheckCircle2,
        },
        {
          title: "Return / Refund Processed",
          description: "Return request processed.",
          completed: true,
          isReturn: true,
          current: true,
          icon: CornerUpLeft,
        },
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
        description: "Your package is on its way with Shadowfax courier.",
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
    else if (
      statusLower.includes("process") ||
      statusLower.includes("pack")
    )
      currentStepIdx = 1;
    else currentStepIdx = 0;

    return steps.map((s, idx) => ({
      ...s,
      completed: idx <= currentStepIdx,
      current: idx === currentStepIdx,
    }));
  };

  const getShipmentBadgeColor = (status) => {
    switch (status) {
      case "DELIVERED":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "OUT_FOR_DELIVERY":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "IN_TRANSIT":
      case "PICKED_UP":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "AWB_ASSIGNED":
      case "SHIPMENT_CREATED":
      case "PICKUP_SCHEDULED":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "CANCELLED":
      case "DELIVERY_FAILED":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "RTO_INITIATED":
      case "RTO_IN_TRANSIT":
      case "RTO_DELIVERED":
        return "bg-orange-50 text-orange-700 border-orange-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
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
              <span>Real-Time Shadowfax Logistics Tracking</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Track Your Order Status
            </h1>

            <p className="mt-2 text-slate-500 text-sm sm:text-base">
              Enter your Order ID to view real-time fulfillment progress, live
              courier dispatch status, and item details.
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
            <RefreshCw
              size={32}
              className="animate-spin text-[#2563eb] mx-auto"
            />
            <p className="text-sm font-bold text-slate-700">
              Fetching order tracking information...
            </p>
          </div>
        )}

        {!loading && errorMsg && (
          <div className="bg-white border border-rose-200 rounded-2xl p-8 max-w-2xl mx-auto text-center space-y-3 shadow-xs">
            <AlertCircle size={36} className="text-rose-500 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">
              Order Not Found
            </h3>
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
                    {shipments.length > 0 && (
                      <span className="px-3 py-0.5 rounded-full bg-blue-50 text-[#2563eb] border border-blue-200 text-xs font-black">
                        {shipments.length} Package
                        {shipments.length > 1 ? "s" : ""} in Transit
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    Placed on{" "}
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleString("en-IN")
                      : "N/A"}
                  </p>
                </div>

                <div className="flex items-center gap-3 bg-blue-50/60 border border-blue-100 p-3 rounded-xl">
                  <Truck size={22} className="text-[#2563eb]" />
                  <div>
                    <p className="text-[10px] font-bold uppercase text-slate-400">
                      Logistics Partner
                    </p>
                    <p className="text-xs font-black text-slate-900">
                      Shadowfax Express Logistics
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Milestone Stepper */}
              <div className="p-6 sm:p-8">
                <h3 className="font-extrabold text-slate-900 text-sm mb-6">
                  Fulfillment Status
                </h3>
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
                          <p className="mt-0.5 text-xs text-slate-500">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Dedicated Courier Shipments Cards (Multi-Shipment Support) */}
            {shipments.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <Truck size={18} className="text-[#2563eb]" />
                    Courier Dispatch & AWB Packages ({shipments.length})
                  </h3>
                </div>

                <div className="grid gap-6">
                  {shipments.map((shipment, sIdx) => {
                    const badgeClass = getShipmentBadgeColor(shipment.status);
                    const awbStr = shipment.awb || shipment.trackingNumber;

                    return (
                      <div
                        key={shipment._id || sIdx}
                        className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs"
                      >
                        {/* Package Header */}
                        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2.5 flex-wrap">
                              <span className="font-mono font-black text-sm text-slate-900">
                                {shipment.shipmentNumber ||
                                  `Shipment #${sIdx + 1}`}
                              </span>
                              <span
                                className={`px-2.5 py-0.5 rounded-full border text-[11px] font-black uppercase ${badgeClass}`}
                              >
                                ● {shipment.status}
                              </span>
                              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-semibold">
                                Carrier: Shadowfax
                              </span>
                            </div>
                            <p className="text-xs text-slate-500">
                              Fulfillment Hub:{" "}
                              {shipment.warehouse?.name ||
                                shipment.pickupAddress?.city ||
                                "Origin Warehouse"}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 flex-wrap">
                            {awbStr && (
                              <button
                                type="button"
                                onClick={() => handleCopyAwb(awbStr)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition cursor-pointer"
                              >
                                {copiedAwb === awbStr ? (
                                  <>
                                    <Check
                                      size={13}
                                      className="text-emerald-600"
                                    />
                                    <span>Copied!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy size={13} className="text-slate-400" />
                                    <span>AWB: {awbStr}</span>
                                  </>
                                )}
                              </button>
                            )}

                            {shipment.trackingUrl && (
                              <a
                                href={shipment.trackingUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-bold transition shadow-xs"
                              >
                                <span>Live Courier Tracking</span>
                                <ExternalLink size={13} />
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Package Contents & Scan History */}
                        <div className="p-6 grid md:grid-cols-2 gap-6">
                          {/* Items in this parcel */}
                          <div className="space-y-3">
                            <h4 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">
                              Package Contents ({shipment.items?.length || 0}{" "}
                              item
                              {shipment.items?.length > 1 ? "s" : ""})
                            </h4>
                            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                              {shipment.items?.map((pItem, pIdx) => (
                                <div
                                  key={pItem._id || pIdx}
                                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                                >
                                  <span className="font-bold text-slate-800 line-clamp-1">
                                    {pItem.name || "Item"}
                                  </span>
                                  <span className="font-extrabold text-slate-600 shrink-0 ml-2">
                                    Qty: {pItem.quantity || 1}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Chronological Scan History Timeline */}
                          <div className="space-y-3">
                            <h4 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">
                              Live Transit Scans
                            </h4>
                            {shipment.statusHistory &&
                            shipment.statusHistory.length > 0 ? (
                              <div className="space-y-3 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                                {shipment.statusHistory
                                  .slice()
                                  .reverse()
                                  .map((hist, hIdx) => (
                                    <div
                                      key={hist._id || hIdx}
                                      className="relative flex items-start gap-3 pl-5"
                                    >
                                      <div className="absolute left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#2563eb] ring-4 ring-blue-50" />
                                      <div className="space-y-0.5">
                                        <p className="text-xs font-bold text-slate-900 leading-snug">
                                          {hist.message || hist.status}
                                        </p>
                                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold">
                                          <span>
                                            {hist.timestamp
                                              ? new Date(
                                                  hist.timestamp
                                                ).toLocaleString("en-IN")
                                              : "N/A"}
                                          </span>
                                          {hist.location && (
                                            <span>• {hist.location}</span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            ) : (
                              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center text-xs text-slate-500">
                                Tracking updates will appear here once the
                                courier collects the parcel.
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Bottom 2 Grid: Order Items & Delivery Info */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Order Items List */}
              <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-2xs">
                <div className="p-5 border-b border-slate-100">
                  <h3 className="font-extrabold text-slate-900 text-sm">
                    Complete Order Items ({order.items?.length || 0})
                  </h3>
                </div>

                <div className="divide-y divide-slate-100">
                  {order.items?.map((item, idx) => {
                    const itemStatusStr =
                      item.status || order.status || "Pending";
                    const isItemDelivered = itemStatusStr
                      .toLowerCase()
                      .includes("delivered");
                    const isItemCancelled = itemStatusStr
                      .toLowerCase()
                      .includes("cancel");

                    let statusBadgeClass =
                      "bg-blue-50 text-blue-700 border-blue-200";
                    if (isItemDelivered)
                      statusBadgeClass =
                        "bg-emerald-50 text-emerald-700 border-emerald-200";
                    else if (isItemCancelled)
                      statusBadgeClass =
                        "bg-rose-50 text-rose-700 border-rose-200";
                    else if (itemStatusStr.toLowerCase().includes("return"))
                      statusBadgeClass =
                        "bg-amber-50 text-amber-700 border-amber-200";
                    else if (
                      itemStatusStr.toLowerCase().includes("replacement")
                    )
                      statusBadgeClass =
                        "bg-purple-50 text-purple-700 border-purple-200";

                    return (
                      <div
                        key={item._id || idx}
                        className="p-4 space-y-2 hover:bg-slate-50/50 transition"
                      >
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
                                {item.product?.name ||
                                  item.name ||
                                  "Product Item"}
                              </h4>
                              <p className="text-[11px] text-slate-500 font-medium">
                                Unit Price: ₹
                                {(item.price || 0).toLocaleString("en-IN")} •
                                Qty: {item.quantity || 1}
                              </p>

                              <div className="flex flex-wrap items-center gap-2 pt-0.5">
                                <span
                                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[10px] font-black uppercase ${statusBadgeClass}`}
                                >
                                  ● Item Status: {itemStatusStr}
                                </span>

                                {item.returnRequest?.isRequested && (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-extrabold">
                                    {item.returnRequest.requestType || "Return"}{" "}
                                    Request ({item.returnRequest.status})
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-[10px] font-bold uppercase text-slate-400 block">
                              Subtotal
                            </span>
                            <span className="text-sm font-black text-slate-900">
                              ₹
                              {(
                                (item.price || 0) * (item.quantity || 1)
                              ).toLocaleString("en-IN")}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Delivery Address & Summary Info */}
              <div className="space-y-6">
                <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs space-y-4">
                  <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                    <MapPin size={16} className="text-[#2563eb]" />
                    <span>Shipping Address</span>
                  </h3>

                  <div className="text-xs space-y-1 text-slate-600 font-medium leading-relaxed">
                    <p className="font-bold text-slate-900">
                      {order.shippingAddress?.fullName ||
                        order.shippingAddress?.name ||
                        order.user?.name ||
                        "Recipient"}
                    </p>
                    <p>
                      {order.shippingAddress?.street ||
                        order.shippingAddress?.addressLine1 ||
                        "N/A"}
                    </p>
                    <p>
                      {order.shippingAddress?.city || "City"},{" "}
                      {order.shippingAddress?.state || "State"} -{" "}
                      {order.shippingAddress?.zip ||
                        order.shippingAddress?.pincode ||
                        "PIN"}
                    </p>
                    <p>{order.shippingAddress?.country || "India"}</p>
                    <div className="pt-2 flex items-center gap-1 text-slate-700 font-bold">
                      <Phone size={12} className="text-slate-400" />
                      <span>
                        {order.shippingAddress?.phone ||
                          order.user?.phone ||
                          "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs space-y-3">
                  <h3 className="font-extrabold text-slate-900 text-sm">
                    Order Payment Summary
                  </h3>

                  <div className="space-y-2 text-xs divide-y divide-slate-100">
                    <div className="flex justify-between pt-1">
                      <span className="text-slate-500 font-medium">
                        Items Subtotal
                      </span>
                      <span className="font-bold text-slate-900">
                        ₹{(order.itemsPrice || 0).toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div className="flex justify-between pt-2">
                      <span className="text-slate-500 font-medium">Shipping</span>
                      <span className="font-bold text-slate-900">
                        {order.shippingPrice > 0
                          ? `₹${order.shippingPrice.toLocaleString("en-IN")}`
                          : "Free Delivery"}
                      </span>
                    </div>

                    <div className="flex justify-between pt-2">
                      <span className="text-slate-500 font-medium">Tax</span>
                      <span className="font-bold text-slate-900">
                        ₹{(order.taxPrice || 0).toLocaleString("en-IN")}
                      </span>
                    </div>

                    {order.discountPrice > 0 && (
                      <div className="flex justify-between pt-2 text-emerald-600 font-bold">
                        <span>Coupon Discount</span>
                        <span>
                          -₹{order.discountPrice.toLocaleString("en-IN")}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between pt-3 text-sm font-black text-slate-900">
                      <span>Total Paid / Payable</span>
                      <span className="text-[#2563eb]">
                        ₹{(order.totalPrice || 0).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default TrackOrder;
