import React, { useState } from "react";
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
} from "lucide-react";

function TrackOrder() {
  const [orderId, setOrderId] = useState("");
  const [searched, setSearched] = useState(false);

  const order = {
    id: "#ILM-20260820-1042",
    placedOn: "20 Aug 2026",
    estimatedDelivery: "23 Aug 2026",
    status: "Out for Delivery",
    customer: "Rahul Rai",
    address: "Lucknow, Uttar Pradesh",
    courier: "ILUMAA Delivery",
    trackingId: "ILM458921763",
    items: [
      {
        name: "Premium Gift Box",
        variant: "Large · Red",
        qty: 1,
        price: "₹1,499",
        image:
          "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=200&q=80",
      },
      {
        name: "Personalized Mug",
        variant: "White · 350ml",
        qty: 2,
        price: "₹798",
        image:
          "https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?auto=format&fit=crop&w=200&q=80",
      },
    ],
  };

  const trackingSteps = [
    {
      title: "Order Placed",
      description: "Your order has been successfully placed.",
      date: "20 Aug, 10:42 AM",
      icon: ShoppingBag,
      completed: true,
    },
    {
      title: "Order Confirmed",
      description: "The seller has confirmed your order.",
      date: "20 Aug, 11:15 AM",
      icon: CheckCircle2,
      completed: true,
    },
    {
      title: "Shipped",
      description: "Your package has been picked up by the courier.",
      date: "21 Aug, 09:30 AM",
      icon: Package,
      completed: true,
    },
    {
      title: "Out for Delivery",
      description: "Your order is on its way to you.",
      date: "23 Aug, 08:45 AM",
      icon: Truck,
      completed: true,
      current: true,
    },
    {
      title: "Delivered",
      description: "Your package will be delivered to your address.",
      date: "Expected 23 Aug",
      icon: CheckCircle2,
      completed: false,
    },
  ];

  const handleTrack = (e) => {
    e.preventDefault();

    if (!orderId.trim()) return;

    setSearched(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFF7ED] text-[#EA580C] text-xs font-semibold mb-4">
              <Package size={14} />
              Order Tracking
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Track your order
            </h1>

            <p className="mt-3 text-slate-500 text-sm sm:text-base">
              Enter your order ID to see the latest delivery status and
              estimated arrival.
            </p>
          </div>

          {/* Search */}
          <form
            onSubmit={handleTrack}
            className="mt-7 max-w-3xl bg-slate-50 border border-slate-200 rounded-2xl p-2 flex flex-col sm:flex-row gap-2"
          >
            <div className="flex-1 relative">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Enter order ID e.g. ILM-20260820-1042"
                className="w-full h-12 pl-11 pr-4 bg-white rounded-xl border border-slate-200 outline-none text-sm text-slate-700 placeholder:text-slate-400 focus:border-[#F97316] focus:ring-4 focus:ring-orange-100 transition"
              />
            </div>

            <button
              type="submit"
              className="h-12 px-7 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white text-sm font-semibold transition flex items-center justify-center gap-2"
            >
              Track Order
              <ChevronRight size={17} />
            </button>
          </form>

          <p className="mt-3 text-xs text-slate-400">
            You can find your order ID in your order confirmation email or SMS.
          </p>
        </div>
      </section>

      {/* Content */}
      {searched && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Order Summary */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-lg font-bold text-slate-900">
                    {order.id}
                  </h2>

                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                    {order.status}
                  </span>
                </div>

                <p className="mt-1.5 text-sm text-slate-500">
                  Placed on {order.placedOn}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-orange-50 text-orange-600">
                  <Truck size={20} />
                </div>

                <div>
                  <p className="text-xs text-slate-400">Estimated delivery</p>
                  <p className="text-sm font-semibold text-slate-900">
                    {order.estimatedDelivery}
                  </p>
                </div>
              </div>
            </div>

            {/* Tracking Timeline */}
            <div className="p-5 sm:p-7">
              <div className="mb-7">
                <h3 className="font-bold text-slate-900">Delivery progress</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Your order is currently on its way.
                </p>
              </div>

              <div className="relative">
                {trackingSteps.map((step, index) => {
                  const Icon = step.icon;
                  const isLast = index === trackingSteps.length - 1;

                  return (
                    <div key={step.title} className="relative flex gap-4">
                      {!isLast && (
                        <div
                          className={`absolute left-[17px] top-9 w-0.5 h-[calc(100%-8px)] ${
                            step.completed ? "bg-orange-500" : "bg-slate-200"
                          }`}
                        />
                      )}

                      <div
                        className={`relative z-10 w-9 h-9 shrink-0 rounded-full flex items-center justify-center ${
                          step.current
                            ? "bg-orange-500 text-white ring-8 ring-orange-50"
                            : step.completed
                              ? "bg-orange-100 text-orange-600"
                              : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        <Icon size={17} />
                      </div>

                      <div className="pb-8 flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                          <h4
                            className={`text-sm font-semibold ${
                              step.current
                                ? "text-orange-600"
                                : step.completed
                                  ? "text-slate-900"
                                  : "text-slate-400"
                            }`}
                          >
                            {step.title}
                          </h4>

                          <span className="text-xs text-slate-400">
                            {step.date}
                          </span>
                        </div>

                        <p className="mt-1 text-sm text-slate-500">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Two Column Section */}
          <div className="grid lg:grid-cols-3 gap-6 mt-6">
            {/* Items */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl">
              <div className="p-5 border-b border-slate-200">
                <h3 className="font-bold text-slate-900">Order items</h3>
                <p className="text-xs text-slate-500 mt-1">
                  {order.items.length} items in this order
                </p>
              </div>

              <div className="divide-y divide-slate-100">
                {order.items.map((item) => (
                  <div key={item.name} className="p-5 flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-xl object-cover border border-slate-100"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-slate-900 truncate">
                        {item.name}
                      </h4>

                      <p className="text-xs text-slate-500 mt-1">
                        {item.variant}
                      </p>

                      <p className="text-xs text-slate-400 mt-1">
                        Qty: {item.qty}
                      </p>
                    </div>

                    <p className="text-sm font-semibold text-slate-900">
                      {item.price}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Details */}
            <div className="bg-white border border-slate-200 rounded-2xl">
              <div className="p-5 border-b border-slate-200">
                <h3 className="font-bold text-slate-900">Delivery details</h3>
              </div>

              <div className="p-5 space-y-5">
                <div className="flex gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-100 text-slate-600 h-fit">
                    <MapPin size={18} />
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">Delivering to</p>
                    <p className="text-sm font-semibold text-slate-900 mt-1">
                      {order.customer}
                    </p>
                    <p className="text-sm text-slate-500 mt-0.5">
                      {order.address}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-100 text-slate-600 h-fit">
                    <Truck size={18} />
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">Courier</p>
                    <p className="text-sm font-semibold text-slate-900 mt-1">
                      {order.courier}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Tracking: {order.trackingId}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-100 text-slate-600 h-fit">
                    <CalendarDays size={18} />
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">Estimated delivery</p>
                    <p className="text-sm font-semibold text-slate-900 mt-1">
                      {order.estimatedDelivery}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Support */}
          <div className="mt-6 rounded-2xl bg-slate-900 text-white p-5 sm:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div className="flex gap-4">
              <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <CircleHelp size={21} />
              </div>

              <div>
                <h3 className="font-semibold">Need help with your order?</h3>
                <p className="text-sm text-slate-400 mt-1">
                  Our support team is here to help you with your delivery.
                </p>
              </div>
            </div>

            <button className="w-full md:w-auto px-5 h-11 rounded-xl bg-white text-slate-900 text-sm font-semibold hover:bg-slate-100 transition flex items-center justify-center gap-2">
              <Phone size={16} />
              Contact Support
            </button>
          </div>
        </main>
      )}

      {/* Initial Empty State */}
      {!searched && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center">
              <Package size={30} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              Enter your order ID
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Enter your order number above to view real-time updates, delivery
              progress and order details.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default TrackOrder;
