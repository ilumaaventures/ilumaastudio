import React from "react";
import { Link } from "react-router-dom";
import { Heart, Award, Globe, Users, ArrowRight, ShieldCheck, Sparkles, Truck } from "lucide-react";

function About() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-200 transition-colors pb-16">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white py-20 relative overflow-hidden border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 relative z-10">
          <span className="inline-block px-3 py-1 bg-[#2563eb]/20 text-blue-400 font-extrabold text-xs uppercase tracking-wider rounded-md">
            ABOUT ILUMAASTUDIO
          </span>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight max-w-4xl mx-auto">
            Crafting Digital Simplicity & Delivering Happiness
          </h1>

          <p className="max-w-2xl mx-auto text-sm md:text-base text-slate-300 font-medium leading-relaxed">
            Connecting customers with authentic, high-quality products across fashion, electronics, home decor, and luxury lifestyle.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        
        {/* Our Story Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-black text-[#2563eb] uppercase tracking-wider">
              OUR MISSION
            </span>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Bringing Quality & Modern Design to Every Home
            </h2>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              At ILumaaStudio, we believe online shopping should be seamless, enjoyable, and trusted. From handpicked electronics to stylish lifestyle products, we curate items that combine functionality with modern aesthetic standards.
            </p>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Every product on our platform undergoes rigorous quality verification, ensuring you receive genuine items delivered quickly and securely right to your doorstep.
            </p>

            <div className="pt-2">
              <Link
                to="/products"
                className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-6 py-3 rounded-xl text-xs font-bold inline-flex items-center gap-2 transition-colors shadow-md shadow-blue-500/20"
              >
                <span>Explore Catalog</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800 aspect-[4/3]">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop"
                alt="ILumaaStudio Team"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { number: "500+", label: "Verified Brands", icon: <Users size={24} className="text-[#2563eb]" /> },
            { number: "10,000+", label: "Curated Products", icon: <Award size={24} className="text-[#2563eb]" /> },
            { number: "50+", label: "Cities Delivered", icon: <Globe size={24} className="text-[#2563eb]" /> },
            { number: "99.4%", label: "Customer Satisfaction", icon: <Heart size={24} className="text-[#2563eb]" /> },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-6 text-center space-y-2 shadow-2xs"
            >
              <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-slate-800 flex items-center justify-center mx-auto">
                {item.icon}
              </div>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white">{item.number}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{item.label}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default About;
