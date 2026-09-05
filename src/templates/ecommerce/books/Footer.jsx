import React, { useState } from "react";
import {
  BookOpen,
  Award,
  Bookmark,
  Phone,
  Mail,
  MapPin,
  Check,
  ArrowRight,
  Coffee,
} from "lucide-react";
import toast from "react-hot-toast";

export default function Footer({
  brandName = "CHAPTER & VERSE",
  brandLogo = null,
  brandPhone = "+1 (800) 555-READ",
  brandEmail = "curator@chapterversepress.com",
  brandAddress = "12 Bodleian Alley, Oxford, OX1 3BG, UK",
  onNavigate,
}) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setSubscribed(true);
    toast.success("Welcome to the Literary Salon! You will receive our monthly curated reading list and first chapter excerpts. 📖");
    setEmail("");
    setTimeout(() => setSubscribed(false), 5000);
  };

  return (
    <footer className="bg-[#1C1917] text-[#D5C7B8] pt-16 pb-12 border-t border-[#78350F]/40 text-left text-xs font-serif">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Newsletter Banner */}
        <div className="rounded-3xl bg-[#292524] border border-[#78350F]/40 p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1.5 text-center lg:text-left">
            <span className="text-[#FBBF24] text-[10px] tracking-widest uppercase font-bold block font-sans">
              THE LITERARY DISPATCH & ESSAYS
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-[#FAF7F2]">
              Join our private salon for rare signed editions & monthly excerpts.
            </h3>
            <p className="text-[#A8A29E] text-xs font-sans">
              Curated by independent booksellers. Zero spam, purely timeless writing.
            </p>
          </div>

          <form
            onSubmit={handleSubscribe}
            className="w-full lg:w-auto flex flex-col sm:flex-row items-center gap-2 max-w-md"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="reader@domain.com"
              className="w-full sm:w-72 bg-[#1C1917] text-xs text-[#FAF7F2] placeholder-[#78716C] px-4 py-3 rounded-xl border border-[#78350F]/60 focus:border-[#FBBF24] focus:outline-none transition font-sans shadow-inner"
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap shadow"
            >
              {subscribed ? (
                <>
                  <Check size={14} />
                  <span>Enrolled!</span>
                </>
              ) : (
                <>
                  <span>Join Salon</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              {brandLogo ? (
                <img
                  src={brandLogo}
                  alt={brandName}
                  className="h-8 w-auto max-w-[130px] object-contain brightness-0 invert"
                />
              ) : (
                <div className="w-9 h-9 rounded-xl bg-[#FAF7F2] text-[#1C1917] flex items-center justify-center shadow-md">
                  <BookOpen size={18} className="text-[#D97706]" />
                </div>
              )}
              <span className="text-lg font-black tracking-widest text-[#FAF7F2] uppercase">
                {brandName}
              </span>
            </div>

            <p className="text-[#A8A29E] leading-relaxed text-xs max-w-sm font-sans">
              An independent literary press and physical bookstore dedicated to unhurried reading, Smyth-sewn archival hardcovers, and author signed editions.
            </p>

            <div className="flex items-center gap-4 text-xs text-[#D5C7B8]">
              <span className="flex items-center gap-1 text-[#FBBF24]">
                <Award size={14} /> Certified First Editions
              </span>
              <span className="flex items-center gap-1 text-[#FBBF24]">
                <Bookmark size={14} /> 100% Acid-Free Paper
              </span>
            </div>
          </div>

          {/* Col 2: Library Stacks */}
          <div className="space-y-3">
            <h5 className="font-bold text-[#FAF7F2] uppercase text-[11px] tracking-wider">
              Library Stacks
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate && onNavigate("stacks", "Literary Fiction")}
                  className="hover:text-[#FBBF24] transition cursor-pointer text-left"
                >
                  Contemporary Literary Fiction
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate && onNavigate("stacks", "Philosophy & Essays")}
                  className="hover:text-[#FBBF24] transition cursor-pointer text-left"
                >
                  Philosophy & Critical Essays
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate && onNavigate("stacks", "Rare & Signed")}
                  className="hover:text-[#FBBF24] transition cursor-pointer text-left"
                >
                  Signed First Editions
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate && onNavigate("stacks", "Poetry & Drama")}
                  className="hover:text-[#FBBF24] transition cursor-pointer text-left"
                >
                  Poetry Chapbooks
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Reading Salon */}
          <div className="space-y-3">
            <h5 className="font-bold text-[#FAF7F2] uppercase text-[11px] tracking-wider">
              Reading Salon
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate && onNavigate("book-club")}
                  className="hover:text-[#FBBF24] transition cursor-pointer text-left"
                >
                  Monthly Book Club Membership
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate && onNavigate("calculator")}
                  className="hover:text-[#FBBF24] transition cursor-pointer text-left"
                >
                  Reading Speed Calculator
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate && onNavigate("rare-vault")}
                  className="hover:text-[#FBBF24] transition cursor-pointer text-left"
                >
                  The Rare Collector's Vault
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate && onNavigate("offers")}
                  className="hover:text-[#FBBF24] transition cursor-pointer text-left"
                >
                  Curated Seasonal Book Boxes
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Bookshop Contact */}
          <div className="space-y-3">
            <h5 className="font-bold text-[#FAF7F2] uppercase text-[11px] tracking-wider">
              Bookshop Concierge
            </h5>
            <div className="space-y-2 text-xs">
              <a
                href={`tel:${brandPhone}`}
                className="flex items-center gap-1.5 text-[#FAF7F2] hover:text-[#FBBF24] font-mono transition"
              >
                <Phone size={13} className="text-[#D97706]" />
                <span>{brandPhone}</span>
              </a>
              <a
                href={`mailto:${brandEmail}`}
                className="flex items-center gap-1.5 text-[#D5C7B8] hover:text-[#FBBF24] transition truncate font-sans"
              >
                <Mail size={13} className="text-[#D97706]" />
                <span>{brandEmail}</span>
              </a>
              {brandAddress && (
                <div className="flex items-start gap-1.5 text-[#A8A29E] pt-1">
                  <MapPin size={13} className="text-[#D97706] flex-shrink-0 mt-0.5" />
                  <span className="leading-tight">{brandAddress}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Guild Badges */}
        <div className="pt-8 border-t border-[#78350F]/40 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 text-[10px] text-[#A8A29E]">
            <span className="px-2.5 py-1 rounded-lg bg-[#292524] border border-[#78350F]/40 text-[#FBBF24]">
              ★ Independent Booksellers Guild Member
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-[#292524] border border-[#78350F]/40">
              Munken 80gsm Archival Cream
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-[#292524] border border-[#78350F]/40">
              Smyth-Sewn Binding
            </span>
          </div>

          <div className="text-[11px] text-[#A8A29E] font-sans">
            © {new Date().getFullYear()} {brandName}. Dedicated to the enduring life of printed literature.
          </div>
        </div>
      </div>
    </footer>
  );
}
