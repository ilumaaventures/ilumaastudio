import React, { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import toast from "react-hot-toast";

export default function Footer({
  brandName = "ETHNIC & MODERN COUTURE",
  brandEmail = "concierge@ethniccouture.com",
  onSelectCategory,
}) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    toast.success("Welcome to Ethnic Couture Club! Enjoy 15% off with code COUTURE15. ✨");
    setEmail("");
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <footer className="bg-white border-t border-stone-200 pt-14 pb-10 text-left font-sans text-xs text-stone-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand */}
          <div className="space-y-3">
            <span className="text-sm font-serif font-black tracking-[0.2em] text-stone-900 uppercase block">
              {brandName}
            </span>
            <p className="text-stone-500 leading-relaxed text-[11px]">
              Celebrated craftsmanship, timeless heritage textiles, and contemporary fusion silhouettes tailored for life's most unforgettable occasions.
            </p>
          </div>

          {/* Col 2: Top Categories */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
              Categories
            </h4>
            <ul className="space-y-1.5 text-stone-500 text-[11px]">
              <li>
                <button
                  onClick={() => onSelectCategory && onSelectCategory("Jumpsuits")}
                  className="hover:text-black transition cursor-pointer"
                >
                  Jumpsuits
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory && onSelectCategory("Dresses")}
                  className="hover:text-black transition cursor-pointer"
                >
                  Dresses & Gowns
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory && onSelectCategory("Modern Look")}
                  className="hover:text-black transition cursor-pointer"
                >
                  Modern Look Edit
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory && onSelectCategory("Women's PALAZZO")}
                  className="hover:text-black transition cursor-pointer"
                >
                  Women's Palazzo & Pants
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Assistance */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
              Client Concierge
            </h4>
            <ul className="space-y-1.5 text-stone-500 text-[11px]">
              <li>
                <a href={`mailto:${brandEmail}`} className="hover:text-black transition">
                  {brandEmail}
                </a>
              </li>
              <li>Bespoke Custom Alterations</li>
              <li>Festive Shipping Timelines</li>
              <li>Returns & Exchanges Policy</li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
              The Festive Club
            </h4>
            <p className="text-[11px] text-stone-500">
              Subscribe for exclusive previews of wedding edits and celebratory seasonal drops.
            </p>
            <form onSubmit={handleSubscribe} className="flex items-center gap-1.5">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="flex-1 bg-stone-50 border border-stone-300 text-xs px-3 py-2 rounded-none focus:outline-none focus:border-black"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-black text-white text-xs font-medium uppercase hover:bg-stone-800 transition cursor-pointer"
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
            <span>Heritage Care</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
