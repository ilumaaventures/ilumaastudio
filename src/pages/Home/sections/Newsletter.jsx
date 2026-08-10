import React, { useState } from "react";
import { Mail } from "lucide-react";
import toast from "react-hot-toast";

function Newsletter() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    toast.success("Thank you! You've successfully subscribed to our newsletter.");
    setEmail("");
  };

  return (
    <section className="py-12 bg-[#FAFAF9]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-[#463126] rounded-[32px] p-8 md:p-12 text-white relative overflow-hidden shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8 border border-white/5">
          {/* Ambient visual background glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-[80px] pointer-events-none" />

          {/* Left Side: Icon & Info Text */}
          <div className="flex items-center gap-6 max-w-xl relative z-10 w-full">
            <div className="w-16 h-16 rounded-[22px] bg-white/10 flex items-center justify-center text-[#C9956C] shrink-0 border border-white/10">
              <Mail size={28} className="text-white" />
            </div>
            <div className="space-y-1.5 text-left">
              <h3 className="text-xl md:text-2xl font-serif font-black tracking-wide">Join Our Newsletter</h3>
              <p className="text-xs md:text-sm text-gray-300 font-normal leading-relaxed">
                Subscribe and get 10% off your first order. Stay updated with new arrivals and exclusive offers.
              </p>
            </div>
          </div>

          {/* Right Side: Form input & button */}
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 w-full lg:max-w-md shrink-0 relative z-10">
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-white/10 text-white placeholder-white/50 border border-white/15 rounded-xl px-5 py-4 text-xs md:text-sm outline-none focus:border-[#C9956C] focus:bg-white/15 transition-all"
              required
            />
            <button
              type="submit"
              className="bg-[#A77A56] hover:bg-[#8f6443] text-white font-bold text-xs uppercase tracking-widest px-8 py-4 rounded-xl transition-all shadow-md shrink-0 cursor-pointer text-center"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Newsletter;
