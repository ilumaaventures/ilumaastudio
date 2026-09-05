import React from "react";
import { Link } from "react-router-dom";
import { Percent, Gift, Briefcase, Truck, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

const COUPONS = [
  {
    id: "coupon_1",
    icon: <Percent size={20} className="text-[#A77A56]" />,
    title: "FLAT 10% OFF",
    sub: "On Your First Order",
    code: "ILUMAA10"
  },
  {
    id: "coupon_2",
    icon: <Gift size={20} className="text-[#A77A56]" />,
    title: "FLAT 15% OFF",
    sub: "On Orders Above $199",
    code: "SAVE15"
  },
  {
    id: "coupon_3",
    icon: <Briefcase size={20} className="text-[#A77A56]" />,
    title: "FLAT 20% OFF",
    sub: "On Corporate Orders",
    code: "CORPORATE20"
  },
  {
    id: "coupon_4",
    icon: <Truck size={20} className="text-[#A77A56]" />,
    title: "FREE SHIPPING",
    sub: "On Orders Above $499",
    code: "No Code Required"
  }
];

function ExclusiveOffers() {
  const handleCopyCode = (code) => {
    if (code === "No Code Required") return;
    navigator.clipboard.writeText(code);
    toast.success(`Coupon code "${code}" copied to clipboard!`);
  };

  return (
    <section className="py-12 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4 flex-1">
            <h2 className="text-xl md:text-2xl font-serif font-black text-gray-900 tracking-tight whitespace-nowrap">
              Offers & Coupons
            </h2>
            <div className="h-px bg-gray-200 flex-1 hidden md:block"></div>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50/80 hover:bg-blue-100 border border-blue-100/80 transition-all duration-200 shadow-2xs group shrink-0 ml-4"
          >
            <span>See All</span>
            <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* 4 Column Coupons Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {COUPONS.map((coupon) => (
            <div
              key={coupon.id}
              onClick={() => handleCopyCode(coupon.code)}
              className="bg-white border border-[#FAF5EE] rounded-[24px] p-5 flex items-center gap-4 transition-all duration-300 hover:shadow-md hover:translate-y-[-2px] cursor-pointer"
            >
              {/* Circular Icon Container */}
              <div className="w-12 h-12 rounded-[16px] bg-[#FAF8F5] flex items-center justify-center shadow-inner shrink-0">
                {coupon.icon}
              </div>

              {/* Coupon Info */}
              <div className="space-y-0.5 min-w-0">
                <h4 className="text-sm font-bold text-gray-800 tracking-tight leading-tight truncate">
                  {coupon.title}
                </h4>
                <p className="text-[11px] text-gray-500 font-medium truncate">
                  {coupon.sub}
                </p>
                <p className="text-[10px] font-bold text-[#A77A56] uppercase tracking-wider">
                  {coupon.code === "No Code Required" ? coupon.code : `Use Code: ${coupon.code}`}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ExclusiveOffers;
