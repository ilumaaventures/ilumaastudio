import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  ShieldCheck,
  Star,
  Share2,
  Bookmark,
  Check,
  ArrowLeft,
  ChevronRight,
  MessageCircle,
  Calendar,
  Sparkles,
  ExternalLink,
  Navigation,
  ThumbsUp,
  Tag,
  CheckCircle2,
  HelpCircle,
  Copy,
} from "lucide-react";
import { getNearbyItemById } from "../../api/nearbyService";
import NearbyEnquiryModal from "./components/NearbyEnquiryModal";
import toast from "react-hot-toast";

export default function ExploreNearbyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "services" | "offers" | "reviews" | "location"
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  // Review state
  const [reviewsList, setReviewsList] = useState([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [newName, setNewName] = useState("");

  // Neighbourhood itinerary plan check
  const [isInPlan, setIsInPlan] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await getNearbyItemById(id);
        if (isMounted) {
          setItem(data);
          setReviewsList(data.reviews || []);

          // Check if in plan
          try {
            const saved = localStorage.getItem("ilumaa_neighbourhood_plan");
            const parsed = saved ? JSON.parse(saved) : [];
            setIsInPlan(parsed.some((i) => i.id === data.id));
          } catch {
            setIsInPlan(false);
          }
        }
      } catch (err) {
        console.error("Failed to load item detail:", err);
        toast.error("Could not load details for this listing.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();
    window.scrollTo({ top: 0, behavior: "smooth" });
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleTogglePlan = () => {
    if (!item) return;
    try {
      const saved = localStorage.getItem("ilumaa_neighbourhood_plan");
      let parsed = saved ? JSON.parse(saved) : [];
      if (isInPlan) {
        parsed = parsed.filter((i) => i.id !== item.id);
        setIsInPlan(false);
        toast.success(`Removed "${item.name}" from your plan.`);
      } else {
        parsed.push(item);
        setIsInPlan(true);
        toast.success(`Added "${item.name}" to your neighbourhood plan!`, { icon: "📌" });
      }
      localStorage.setItem("ilumaa_neighbourhood_plan", JSON.stringify(parsed));
    } catch (e) {
      console.warn("Storage error", e);
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setIsCopied(true);
    toast.success("Listing link copied to clipboard!");
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    if (!item) return;
    const msg = encodeURIComponent(
      `Hello ${item.name}, I discovered your business on ILumaa Nearby (${item.category}). I would like to get more information about your offerings!`
    );
    window.open(`https://wa.me/${item.whatsappNumber || "919876543210"}?text=${msg}`, "_blank");
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newComment.trim() || !newName.trim()) {
      toast.error("Please enter your name and review comments.");
      return;
    }

    const reviewObj = {
      id: `rev-${Date.now()}`,
      user: newName,
      avatar: `https://images.unsplash.com/photo-${1535713875002 + Math.floor(Math.random() * 1000)}?auto=format&fit=crop&w=150&q=80`,
      rating: newRating,
      date: "Just now",
      comment: newComment,
    };

    setReviewsList([reviewObj, ...reviewsList]);
    setNewComment("");
    setNewName("");
    toast.success("Thank you! Your verified review has been submitted.");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-600">Loading neighbourhood listing details...</p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8 space-y-4">
        <h2 className="text-2xl font-black text-slate-800">Listing Not Found</h2>
        <p className="text-sm text-slate-500">The listing you requested could not be located.</p>
        <button
          type="button"
          onClick={() => navigate("/explore-nearby")}
          className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-md"
        >
          Return to Explore Nearby
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 pb-24">
      {/* 1. Breadcrumbs & Top Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap">
            <Link to="/" className="hover:text-blue-600 transition">
              Home
            </Link>
            <ChevronRight size={13} className="text-slate-400 shrink-0" />
            <Link to="/explore-nearby" className="hover:text-blue-600 transition">
              Explore Nearby
            </Link>
            <ChevronRight size={13} className="text-slate-400 shrink-0" />
            <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
              {item.category}
            </span>
            <ChevronRight size={13} className="text-slate-400 shrink-0" />
            <span className="text-slate-900 font-bold truncate max-w-[200px] sm:max-w-xs">
              {item.name}
            </span>
          </div>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="hidden sm:inline-flex items-center gap-1 font-bold text-slate-700 hover:text-blue-600 transition cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Back</span>
          </button>
        </div>
      </div>

      {/* 2. Hero Header Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200/80 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="space-y-3 flex-1">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-full font-black uppercase text-[10px] tracking-wider bg-blue-100 text-blue-700">
                  {item.category}
                </span>

                {item.isVerified && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <ShieldCheck size={13} />
                    <span>Verified Vendor</span>
                  </span>
                )}

                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[11px] ${
                    item.isOpen
                      ? "bg-emerald-500/10 text-emerald-700 border border-emerald-300"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <Clock size={12} />
                  <span>{item.isOpen ? "Open Now" : "Closed Now"}</span>
                </span>

                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[11px] bg-slate-900 text-white">
                  <MapPin size={12} className="text-blue-400" />
                  <span>{item.distanceKm} km away</span>
                </span>
              </div>

              {/* Title & Tagline */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                {item.name}
              </h1>

              <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
                {item.tagline || item.description}
              </p>

              {/* Location & Contact Meta */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                <div className="flex items-center gap-1.5 font-medium text-slate-700">
                  <MapPin size={14} className="text-blue-600 shrink-0" />
                  <span>{item.address}</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium text-slate-700">
                  <Clock size={14} className="text-blue-600 shrink-0" />
                  <span>{item.openingHours}</span>
                </div>
                <div className="flex items-center gap-1 font-bold text-amber-500 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200">
                  <Star size={13} fill="currentColor" />
                  <span>{item.rating}</span>
                  <span className="text-slate-400 font-normal">({item.reviewCount} reviews)</span>
                </div>
              </div>
            </div>

            {/* Action Buttons Top Right */}
            <div className="flex flex-wrap lg:flex-col gap-2.5 shrink-0 w-full lg:w-56">
              <button
                type="button"
                onClick={handleWhatsApp}
                className="flex-1 py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition cursor-pointer"
              >
                <MessageCircle size={16} />
                <span>Enquire on WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedService("");
                  setIsEnquiryOpen(true);
                }}
                className="flex-1 py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition cursor-pointer"
              >
                <Calendar size={16} />
                <span>Book / Request Quote</span>
              </button>

              <div className="flex items-center gap-2 w-full">
                <button
                  type="button"
                  onClick={handleTogglePlan}
                  className={`flex-1 py-2.5 px-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 border transition cursor-pointer ${
                    isInPlan
                      ? "bg-blue-50 border-blue-400 text-blue-700"
                      : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <Bookmark size={14} className={isInPlan ? "fill-blue-600 text-blue-600" : ""} />
                  <span>{isInPlan ? "In Itinerary" : "Save to Plan"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="p-2.5 rounded-2xl border border-slate-200 text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                  title="Share listing"
                >
                  {isCopied ? <Check size={16} className="text-emerald-600" /> : <Share2 size={16} />}
                </button>
              </div>
            </div>
          </div>

          {/* 3. Image Gallery */}
          <div className="space-y-3 pt-2">
            <div className="relative h-64 sm:h-96 rounded-2xl overflow-hidden bg-slate-900">
              <img
                src={item.images?.[activeImageIndex] || item.image}
                alt={item.name}
                className="w-full h-full object-cover transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 text-white text-xs font-bold drop-shadow-md">
                <span>Photo {activeImageIndex + 1} of {item.images?.length || 1}</span>
              </div>
            </div>

            {/* Thumbnail Row */}
            {item.images && item.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {item.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-16 sm:w-28 sm:h-20 rounded-xl overflow-hidden shrink-0 transition cursor-pointer border-2 ${
                      activeImageIndex === idx ? "border-blue-600 scale-105 shadow-md" : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Highlights Row */}
          {item.highlights && (
            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2.5">
                Listing Highlights
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-xs">
                {item.highlights.map((h, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 font-bold text-slate-700 flex items-center gap-1.5"
                  >
                    <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                    <span className="truncate">{h}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. Tabbed Content & Sidebar Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Left Column (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tab Nav */}
            <div className="bg-white rounded-2xl p-1.5 shadow-2xs border border-slate-200/80 flex items-center gap-1 overflow-x-auto">
              {[
                { id: "overview", label: "Overview & Info" },
                { id: "services", label: "Services & Catalog" },
                { id: "offers", label: "Deals & Offers" },
                { id: "reviews", label: `Reviews (${reviewsList.length})` },
                { id: "location", label: "Location & Map" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB CONTENT: 1. Overview */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-2xs space-y-4">
                  <h3 className="text-lg font-black text-slate-900">About {item.name}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                    {item.description || item.tagline}
                  </p>

                  <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs border-t border-slate-100">
                    <div className="space-y-1">
                      <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                        Business Hours
                      </span>
                      <p className="font-extrabold text-slate-800 text-sm">{item.openingHours}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                        Primary Locality
                      </span>
                      <p className="font-extrabold text-slate-800 text-sm">{item.area}, {item.city}</p>
                    </div>
                  </div>
                </div>

                {/* FAQs Section */}
                {item.faqs && (
                  <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-2xs space-y-4">
                    <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                      <HelpCircle size={18} className="text-blue-600" />
                      <span>Frequently Asked Questions</span>
                    </h3>
                    <div className="space-y-3">
                      {item.faqs.map((f, idx) => (
                        <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                          <h4 className="font-bold text-sm text-slate-900">{f.q}</h4>
                          <p className="text-xs text-slate-600 leading-relaxed">{f.a}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: 2. Services & Catalog */}
            {activeTab === "services" && (
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">Services & Offerings</h3>
                    <p className="text-xs text-slate-500">Pick any service to request immediate quote or booking</p>
                  </div>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                    {item.servicesOffered?.length || 0} Available
                  </span>
                </div>

                <div className="space-y-3 pt-2">
                  {item.servicesOffered?.map((srv) => (
                    <div
                      key={srv.id}
                      className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/70 hover:border-blue-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-black text-sm text-slate-900">{srv.name}</h4>
                          {srv.duration && (
                            <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                              {srv.duration}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 max-w-lg leading-relaxed">{srv.description}</p>
                      </div>

                      <div className="flex items-center sm:flex-col sm:items-end justify-between gap-2 shrink-0">
                        <span className="text-lg font-black text-slate-900">₹{srv.price}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedService(srv.name);
                            setIsEnquiryOpen(true);
                          }}
                          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-sm transition cursor-pointer"
                        >
                          Enquire Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT: 3. Deals & Offers */}
            {activeTab === "offers" && (
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-2xs space-y-4">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Tag size={18} className="text-blue-600" />
                  <span>Exclusive Deals & Neighbourhood Coupons</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300/60 relative overflow-hidden space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-amber-500 text-white font-black text-[10px] uppercase">
                        Flat 20% OFF
                      </span>
                      <span className="text-[10px] text-amber-900 font-bold">Expires in 3 days</span>
                    </div>
                    <h4 className="font-black text-sm text-slate-900">First-Time Customer Special</h4>
                    <p className="text-xs text-slate-600">Enjoy 20% flat discount on bookings above ₹499.</p>
                    <div className="flex items-center justify-between pt-2">
                      <code className="bg-white px-2.5 py-1 rounded-lg border border-amber-300 text-xs font-mono font-bold text-amber-800">
                        ILUMAA20
                      </code>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard?.writeText("ILUMAA20");
                          toast.success("Coupon code ILUMAA20 copied!");
                        }}
                        className="text-xs font-bold text-blue-600 hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <Copy size={12} />
                        <span>Copy Code</span>
                      </button>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent border border-blue-300/60 relative overflow-hidden space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-black text-[10px] uppercase">
                        Free Consultation
                      </span>
                      <span className="text-[10px] text-blue-900 font-bold">Limited Slots</span>
                    </div>
                    <h4 className="font-black text-sm text-slate-900">Doorstep Assessment Waiver</h4>
                    <p className="text-xs text-slate-600">Free diagnostic or consultation call before confirming services.</p>
                    <div className="flex items-center justify-between pt-2">
                      <code className="bg-white px-2.5 py-1 rounded-lg border border-blue-300 text-xs font-mono font-bold text-blue-800">
                        FREECONSULT
                      </code>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard?.writeText("FREECONSULT");
                          toast.success("Coupon code FREECONSULT copied!");
                        }}
                        className="text-xs font-bold text-blue-600 hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <Copy size={12} />
                        <span>Copy Code</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: 4. Reviews & Rating */}
            {activeTab === "reviews" && (
              <div className="space-y-6">
                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-2xs space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                    <div>
                      <h3 className="text-lg font-black text-slate-900">Customer Reviews</h3>
                      <p className="text-xs text-slate-500">Real feedback from verified neighbourhood residents</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-3xl font-black text-slate-900">{item.rating}</div>
                      <div>
                        <div className="flex items-center text-amber-500">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={15}
                              fill={i < Math.floor(item.rating) ? "currentColor" : "none"}
                              className={i < Math.floor(item.rating) ? "" : "text-slate-300"}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-slate-500 font-medium">
                          Based on {reviewsList.length} reviews
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Reviews List */}
                  <div className="space-y-4">
                    {reviewsList.map((rev) => (
                      <div key={rev.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={rev.avatar}
                              alt={rev.user}
                              className="w-8 h-8 rounded-full object-cover border border-slate-200"
                            />
                            <div>
                              <h5 className="font-extrabold text-xs text-slate-900">{rev.user}</h5>
                              <span className="text-[10px] text-slate-400">{rev.date}</span>
                            </div>
                          </div>
                          <div className="flex items-center text-amber-500">
                            {[...Array(rev.rating)].map((_, i) => (
                              <Star key={i} size={13} fill="currentColor" />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed">{rev.comment}</p>
                      </div>
                    ))}
                  </div>

                  {/* Write a Review Form */}
                  <div className="pt-6 border-t border-slate-100">
                    <h4 className="text-sm font-black text-slate-900 mb-3">Write a Verified Review</h4>
                    <form onSubmit={handleAddReview} className="space-y-3 text-xs">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-slate-700">Your Rating:</span>
                        <div className="flex items-center gap-1 cursor-pointer">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setNewRating(star)}
                              className="text-amber-500 transition hover:scale-110"
                            >
                              <Star size={18} fill={star <= newRating ? "currentColor" : "none"} />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          required
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          placeholder="Your Name (e.g. Shalini Roy)"
                          className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 font-medium text-slate-900 outline-none"
                        />
                        <button
                          type="submit"
                          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-sm transition"
                        >
                          Submit Review
                        </button>
                      </div>

                      <textarea
                        rows={2}
                        required
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Share details about your experience with this local partner..."
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 font-medium text-slate-900 outline-none resize-none"
                      />
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: 5. Location & Map */}
            {activeTab === "location" && (
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">Location & Landmarks</h3>
                    <p className="text-xs text-slate-500">{item.address}</p>
                  </div>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.name + " " + item.address)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold hover:bg-blue-100 transition"
                  >
                    <ExternalLink size={13} />
                    <span>Open in Google Maps</span>
                  </a>
                </div>

                {/* Map Visual Container */}
                <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden bg-slate-900 border border-slate-200">
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-80"
                    style={{
                      backgroundImage:
                        "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1000&q=80')",
                    }}
                  />
                  <div className="absolute inset-0 bg-blue-950/40 backdrop-blur-[1px]" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center p-4 rounded-2xl bg-white/95 backdrop-blur-md shadow-xl border border-slate-200 text-slate-900 max-w-xs space-y-1">
                    <MapPin size={28} className="text-red-500 mx-auto animate-bounce" />
                    <h5 className="font-black text-sm">{item.name}</h5>
                    <p className="text-[11px] text-slate-500">{item.address}</p>
                    <span className="inline-block mt-1 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                      {item.distanceKm} km from selected search pin
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Sticky Sidebar (1 Col) */}
          <div className="space-y-6">
            {/* Quick Contact Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
              <h4 className="font-black text-base text-slate-900">Direct Contact</h4>
              <div className="space-y-3 text-xs">
                <a
                  href={`tel:${item.phone || "+919876543210"}`}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 hover:bg-blue-50 transition border border-slate-100 text-slate-800 font-bold cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <Phone size={15} />
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 font-semibold uppercase">Call Now</span>
                    <span>{item.phone || "+91 98765 43210"}</span>
                  </div>
                </a>

                <button
                  type="button"
                  onClick={handleWhatsApp}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 transition border border-emerald-100 text-emerald-900 font-bold cursor-pointer text-left"
                >
                  <div className="w-8 h-8 rounded-xl bg-emerald-200 text-emerald-800 flex items-center justify-center shrink-0">
                    <MessageCircle size={15} />
                  </div>
                  <div>
                    <span className="block text-[10px] text-emerald-700 font-semibold uppercase">WhatsApp Chat</span>
                    <span>Direct Vendor Support</span>
                  </div>
                </button>

                <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-slate-800 font-bold">
                  <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                    <Mail size={15} />
                  </div>
                  <div className="truncate">
                    <span className="block text-[10px] text-slate-400 font-semibold uppercase">Email</span>
                    <span className="truncate">{item.email || "support@ilumaa.com"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Enquiry Widget */}
            <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 shadow-xl space-y-4">
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold text-[10px] uppercase border border-blue-400/30">
                  Instant Response
                </span>
                <h4 className="font-black text-lg text-white">Need a Fast Estimate?</h4>
                <p className="text-xs text-blue-200">
                  Submit your details and get personalized quotation from {item.name} today.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedService("");
                  setIsEnquiryOpen(true);
                }}
                className="w-full py-3 rounded-2xl bg-blue-500 hover:bg-blue-400 text-white font-black text-xs shadow-lg shadow-blue-500/30 transition cursor-pointer"
              >
                Request Free Quote
              </button>
            </div>
          </div>
        </div>

        {/* 5. Related Nearby Listings Carousel */}
        {item.relatedItems && item.relatedItems.length > 0 && (
          <div className="mt-14 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-slate-900">Similar Nearby Recommendations</h3>
                <p className="text-xs text-slate-500">Other verified stores & services in {item.area || item.city}</p>
              </div>
              <Link
                to={`/explore-nearby?category=${item.category?.toLowerCase() || "all"}`}
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                Explore More
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {item.relatedItems.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/explore-nearby/${rel.id}`}
                  className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div className="relative h-36 bg-slate-100 overflow-hidden">
                    <img
                      src={rel.image || rel.coverImage}
                      alt={rel.name || rel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-900/80 text-white text-[10px] font-bold">
                      {rel.distanceKm || "2.0"} km
                    </div>
                  </div>
                  <div className="p-4 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                      {rel.category}
                    </span>
                    <h5 className="font-extrabold text-sm text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {rel.name || rel.title || rel.businessName}
                    </h5>
                    <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                      <span>{rel.area || rel.city}</span>
                      <span className="font-bold text-amber-500 flex items-center gap-0.5">
                        <Star size={11} fill="currentColor" />
                        {rel.rating || 4.8}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 6. Sticky Mobile Action Footer */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 shadow-lg flex items-center gap-2">
        <button
          type="button"
          onClick={handleWhatsApp}
          className="flex-1 py-3 px-3 rounded-xl bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/25 cursor-pointer"
        >
          <MessageCircle size={15} />
          <span>WhatsApp</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setSelectedService("");
            setIsEnquiryOpen(true);
          }}
          className="flex-1 py-3 px-3 rounded-xl bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/25 cursor-pointer"
        >
          <Calendar size={15} />
          <span>Book / Enquire</span>
        </button>
      </div>

      {/* Enquiry Modal */}
      <NearbyEnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        targetName={item.name}
        targetCategory={selectedService || item.category}
        whatsappNumber={item.whatsappNumber}
      />
    </div>
  );
}
