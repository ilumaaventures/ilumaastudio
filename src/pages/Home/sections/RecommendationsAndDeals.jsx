import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Heart, Star, Sparkles } from "lucide-react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../redux/reducers/cartReducer";
import toast from "react-hot-toast";

const AI_RECOMMENDED = [
  {
    id: "ai_1",
    name: "Zebronics Speaker",
    price: 1299,
    originalPrice: 1699,
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: "ai_2",
    name: "Sony WH-1000XM5",
    price: 24998,
    originalPrice: 29990,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: "ai_3",
    name: "Sunglasses UV-400",
    price: 599,
    originalPrice: 1299,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: "ai_4",
    name: "Leather Wallet",
    price: 689,
    originalPrice: 1299,
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=300&auto=format&fit=crop",
  },
];

const NEW_LAUNCHES = [
  {
    id: "nl_1",
    name: "Realme GT 6",
    price: 35999,
    originalPrice: 39999,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: "nl_2",
    name: "Boat Storm Pro",
    price: 1299,
    originalPrice: 3000,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=300&auto=format&fit=crop",
  },
];

function RecommendationsAndDeals() {
  const dispatch = useDispatch();
  const [timeLeft, setTimeLeft] = useState(27735); // 7h 42m 15s

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 27735));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return {
      hours: String(h).padStart(2, "0"),
      minutes: String(m).padStart(2, "0"),
      seconds: String(s).padStart(2, "0"),
    };
  };

  const { hours, minutes, seconds } = formatTime(timeLeft);

  const handleAddToCart = (name, price) => {
    dispatch(addToCart({ product: { _id: name, name, price }, quantity: 1 }));
    toast.success(`${name} added to cart!`);
  };

  return (
    <section className="py-8 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Column 1: AI Recommended For You (4 cols) */}
          <div className="lg:col-span-4 flex flex-col justify-between bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 rounded-2xl p-4">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1.5">
                  <Sparkles size={16} className="text-[#2563eb]" />
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    AI Recommended For You
                  </h3>
                </div>
                <Link to="/products?recommendations=true" className="text-[11px] font-bold text-[#2563eb]">
                  View All &gt;
                </Link>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mb-3 font-medium">
                Based on your browsing history
              </p>

              {/* 4 Items Grid */}
              <div className="grid grid-cols-2 gap-3">
                {AI_RECOMMENDED.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 flex flex-col justify-between shadow-2xs"
                  >
                    <div className="aspect-square overflow-hidden rounded-lg mb-2">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate">
                        {item.name}
                      </h4>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="text-xs font-black text-slate-900 dark:text-white">
                          ₹{item.price.toLocaleString()}
                        </span>
                        <span className="text-[9px] text-slate-400 line-through">
                          ₹{item.originalPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2: Deals of the Day (4 cols) */}
          <div className="lg:col-span-4 flex flex-col justify-between bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 rounded-2xl p-4">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    Deals of the Day
                  </h3>
                  {/* Timer Badges */}
                  <div className="flex items-center gap-1 text-white font-mono text-[10px] font-bold">
                    <span className="bg-red-500 px-1.5 py-0.5 rounded">{hours}</span>
                    <span className="text-slate-400">:</span>
                    <span className="bg-red-500 px-1.5 py-0.5 rounded">{minutes}</span>
                    <span className="text-slate-400">:</span>
                    <span className="bg-red-500 px-1.5 py-0.5 rounded">{seconds}</span>
                  </div>
                </div>
              </div>

              {/* Main Featured Deal Product Card */}
              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800 flex flex-col justify-between relative shadow-sm h-full">
                <span className="absolute top-3 left-3 bg-red-500 text-white text-[9px] font-black px-2 py-0.5 rounded">
                  33% OFF
                </span>
                
                <div className="aspect-[4/3] overflow-hidden rounded-xl bg-slate-50 dark:bg-slate-800 p-2 my-2 flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=500&auto=format&fit=crop"
                    alt="Acer Aspire 5 Laptop"
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="space-y-2 mt-2">
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">
                    Acer Aspire 5 Laptop
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Intel i5 13th-Gen Processor
                  </p>

                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-black text-slate-900 dark:text-white">
                      ₹39,990
                    </span>
                    <span className="text-xs text-slate-400 line-through">
                      ₹59,990
                    </span>
                  </div>

                  <button
                    onClick={() => handleAddToCart("Acer Aspire 5 Laptop", 39990)}
                    className="w-full py-2.5 border border-[#2563eb] text-[#2563eb] hover:bg-[#2563eb] hover:text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Column 3: New Launches (4 cols) */}
          <div className="lg:col-span-4 flex flex-col justify-between bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 rounded-2xl p-4">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  New Launches
                </h3>
                <Link to="/products?sort=new" className="text-[11px] font-bold text-[#2563eb]">
                  View All &gt;
                </Link>
              </div>

              {/* 2 Featured Vertical Cards */}
              <div className="space-y-3">
                {NEW_LAUNCHES.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800 flex items-center justify-between shadow-2xs relative"
                  >
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {item.name}
                      </h4>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-sm font-black text-slate-900 dark:text-white">
                          ₹{item.price.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-slate-400 line-through">
                          ₹{item.originalPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="w-16 h-16 overflow-hidden rounded-lg bg-slate-50 dark:bg-slate-800 p-1 shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default RecommendationsAndDeals;
