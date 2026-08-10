import React from "react";
import { FaTag, FaGift, FaPercentage, FaShippingFast } from "react-icons/fa";

const offers = [
  {
    title: "Flat 20% OFF",
    description: "On orders above ₹1999",
    code: "SAVE20",
    color: "bg-blue-50 border-blue-200",
    icon: <FaPercentage className="text-blue-600 text-2xl" />,
  },
  {
    title: "Free Shipping",
    description: "On orders above ₹999",
    code: "FREESHIP",
    color: "bg-green-50 border-green-200",
    icon: <FaShippingFast className="text-green-600 text-2xl" />,
  },
  {
    title: "Buy 2 Get 1",
    description: "Applicable on selected products",
    code: "BUY2GET1",
    color: "bg-orange-50 border-orange-200",
    icon: <FaGift className="text-orange-500 text-2xl" />,
  },
  {
    title: "₹500 OFF",
    description: "Minimum purchase ₹4999",
    code: "SAVE500",
    color: "bg-purple-50 border-purple-200",
    icon: <FaTag className="text-purple-600 text-2xl" />,
  },
];

function Offers() {
  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-5">
        {/* Heading */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-slate-800">Offers & Deals</h1>
          <p className="text-slate-500 mt-2">
            Save more with our latest coupons and exclusive discounts.
          </p>
        </div>

        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-10 text-white mb-10">
          <h2 className="text-3xl font-bold mb-3">Summer Mega Sale 🎉</h2>

          <p className="text-lg opacity-90 mb-6">
            Get up to <span className="font-bold">70% OFF</span> on selected
            products.
          </p>

          <button className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-xl hover:bg-gray-100 transition">
            Shop Now
          </button>
        </div>

        {/* Offer Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {offers.map((offer, index) => (
            <div
              key={index}
              className={`${offer.color} border rounded-2xl p-6 shadow-sm hover:shadow-lg transition`}
            >
              <div className="mb-4">{offer.icon}</div>

              <h3 className="text-xl font-semibold text-slate-800">
                {offer.title}
              </h3>

              <p className="text-sm text-slate-500 mt-2">{offer.description}</p>

              <div className="mt-6 flex items-center justify-between">
                <span className="bg-white px-3 py-1 rounded-lg text-sm font-semibold border">
                  {offer.code}
                </span>

                <button className="text-blue-600 font-medium hover:underline">
                  Copy
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Offers;
