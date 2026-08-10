import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Youtube, ArrowUp } from "lucide-react";

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-slate-900 text-slate-400 pt-12 pb-6 border-t border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Footer 5 Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 pb-10 border-b border-slate-800 text-xs">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-3">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#2563eb] flex items-center justify-center text-white font-black text-sm">
                S
              </div>
              <span className="font-black text-lg text-white tracking-tight">
                ILumaa<span className="text-[#2563eb]">Studio</span>
              </span>
            </Link>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Your one-stop destination for all your shopping needs. Quality products, best prices and more.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-2 pt-2">
              {[
                { icon: <Facebook size={14} />, label: "Facebook" },
                { icon: <Twitter size={14} />, label: "Twitter" },
                { icon: <Instagram size={14} />, label: "Instagram" },
                { icon: <Youtube size={14} />, label: "Youtube" },
              ].map((social, idx) => (
                <a
                  key={idx}
                  href="#"
                  aria-label={social.label}
                  className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:bg-[#2563eb] hover:border-[#2563eb] transition-colors"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: Shop */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">
              Shop
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li><Link to="/categories" className="hover:text-white transition-colors">All Categories</Link></li>
              <li><Link to="/products?sort=bestsellers" className="hover:text-white transition-colors">Best Sellers</Link></li>
              <li><Link to="/products?sort=new" className="hover:text-white transition-colors">New Arrivals</Link></li>
              <li><Link to="/products?offers=true" className="hover:text-white transition-colors">Today's Deals</Link></li>
              <li><Link to="/products?brands=true" className="hover:text-white transition-colors">Top Brands</Link></li>
            </ul>
          </div>

          {/* Col 3: Customer Service */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">
              Customer Service
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li><Link to="/help" className="hover:text-white transition-colors">Help Center</Link></li>
              <li><Link to="/track-order" className="hover:text-white transition-colors">Track Order</Link></li>
              <li><Link to="/returns" className="hover:text-white transition-colors">Returns & Refunds</Link></li>
              <li><Link to="/shipping" className="hover:text-white transition-colors">Shipping Info</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Col 4: Company */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">
              Company
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/careers" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link to="/press" className="hover:text-white transition-colors">Press</Link></li>
              <li><Link to="/affiliate" className="hover:text-[#2563eb] transition-colors">Affiliate Program</Link></li>
              <li><Link to="/businessRegistration" className="hover:text-[#2563eb] transition-colors">Sell on ILumaaStudio</Link></li>
            </ul>
          </div>

          {/* Col 5: Policies & Payment Methods */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">
              Policies
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link></li>
              <li><Link to="/shipping-policy" className="hover:text-white transition-colors">Shipping Policy</Link></li>
              <li><Link to="/cancellation" className="hover:text-white transition-colors">Cancellation Policy</Link></li>
            </ul>

            {/* Payment Icons */}
            <div className="pt-2 space-y-1.5">
              <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Payment Methods
              </h5>
              <div className="flex flex-wrap gap-1.5">
                {["VISA", "Mastercard", "UPI", "RuPay", "Paytm"].map((p, idx) => (
                  <span
                    key={idx}
                    className="bg-slate-800 border border-slate-700 rounded px-2 py-0.5 text-[9px] font-black text-slate-300 tracking-wider"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px] text-slate-400">
          <p>© {new Date().getFullYear()} ILumaaStudio. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
            <Link to="/cookie-policy" className="hover:text-white transition-colors">Cookie Policy</Link>
            <Link to="/accessibility" className="hover:text-white transition-colors">Accessibility</Link>
          </div>
        </div>

      </div>

      {/* Floating Scroll To Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 w-9 h-9 rounded-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white flex items-center justify-center shadow-lg transition-all hover:scale-110 cursor-pointer z-40"
        title="Scroll to top"
      >
        <ArrowUp size={16} />
      </button>
    </footer>
  );
}

export default Footer;
