import React, { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import toast from "react-hot-toast";

export default function Footer({
  brandName = "STUDIO APPAREL",
  brandEmail = "concierge@studioapparel.com",
  onSelectCategory,
}) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    toast.success("Welcome to Studio Apparel Society! Enjoy 15% off your first acquisition. ✨");
    setEmail("");
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <footer className="bg-white border-t border-[#EBE7E1] pt-14 pb-10 text-left font-sans text-xs text-stone-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Philosophy */}
          <div className="space-y-3 md:col-span-1">
            <span className="text-sm font-serif font-black tracking-[0.2em] text-stone-900 uppercase block">
              {brandName}
            </span>
            <p className="text-stone-500 leading-relaxed text-[11px] pr-4">
              Modern minimalist silhouettes, natural fiber textiles, and tailored casual staples designed for deliberate living.
            </p>
          </div>

          {/* Col 2: Categories */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-900">
              Collections
            </h4>
            <ul className="space-y-1.5 text-stone-500 text-[11px]">
              <li>
                <button
                  onClick={() => onSelectCategory && onSelectCategory("Jackets")}
                  className="hover:text-stone-900 transition cursor-pointer"
                >
                  Jackets & Outerwear
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory && onSelectCategory("Shirt")}
                  className="hover:text-stone-900 transition cursor-pointer"
                >
                  Button-Down Shirts
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory && onSelectCategory("Sweater")}
                  className="hover:text-stone-900 transition cursor-pointer"
                >
                  Merino Knits & Sweaters
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory && onSelectCategory("Fragrance")}
                  className="hover:text-stone-900 transition cursor-pointer"
                >
                  Desert Botanical Fragrance
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Assistance */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-900">
              Client Care
            </h4>
            <ul className="space-y-1.5 text-stone-500 text-[11px]">
              <li>
                <a href={`mailto:${brandEmail}`} className="hover:text-stone-900 transition">
                  {brandEmail}
                </a>
              </li>
              <li>Shipping & Global Delivery</li>
              <li>Returns & Exchanges</li>
              <li>Garment Care & Sizing</li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-900">
              The Dispatch
            </h4>
            <p className="text-[11px] text-stone-500">
              Subscribe for early seasonal drops and private studio editorial lookbooks.
            </p>
            <form onSubmit={handleSubscribe} className="flex items-center gap-1.5">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="flex-1 bg-stone-50 border border-stone-200 text-xs px-3 py-2 rounded-none focus:outline-none focus:border-stone-500"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-[#8B5A2B] text-white text-xs font-medium uppercase tracking-wider hover:bg-[#704214] transition cursor-pointer"
              >
                {subscribed ? <Check size={14} /> : <ArrowRight size={14} />}
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-stone-400 text-[11px]">
          <p>© {new Date().getFullYear()} {brandName}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Privacy</span>
            <span>•</span>
            <span>Terms</span>
            <span>•</span>
            <span>Accessibility</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
