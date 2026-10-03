import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { getServiceById } from "../../api/serviceService";
import { createBooking } from "../../api/bookingService";
import { createInquiry } from "../../api/inquiryService";
import { createReview, getServiceReviews } from "../../api/reviewService";
import { DetailSkeleton } from "../../Components/Skeletons";
import {
  Star,
  Clock,
  ShieldCheck,
  Calendar,
  UserCheck,
  CheckCircle2,
  Building,
  Phone,
  Mail,
  Send,
  MessageSquare,
  ChevronRight,
  Sparkles,
  ArrowLeft,
  X,
  CreditCard,
  MapPin,
  Camera,
  Check,
  HelpCircle,
  AlertCircle,
  FileText,
  Layers,
  Tag,
  Award,
  ArrowRight,
  Shield,
  Zap,
} from "lucide-react";
import toast from "react-hot-toast";

const formatDuration = (dur) => {
  if (!dur) return "45 mins";
  if (typeof dur === "string" || typeof dur === "number") return `${dur} mins`;
  if (typeof dur === "object") {
    const val = dur.value || dur.amount || "";
    const unit = dur.unit || dur.unitType || "mins";
    return `${val} ${unit}`.trim() || "45 mins";
  }
  return "45 mins";
};

export default function ServiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");

  // Booking drawer / modal state
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(
    "10:00 AM - 11:00 AM",
  );
  const [customerAddress, setCustomerAddress] = useState("");
  const [bookingNotes, setBookingNotes] = useState("");
  const [bookingCustomerName, setBookingCustomerName] = useState("");
  const [bookingCustomerEmail, setBookingCustomerEmail] = useState("");
  const [bookingCustomerPhone, setBookingCustomerPhone] = useState("");
  const [submittingBooking, setSubmittingBooking] = useState(false);

  // Inquiry modal state
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [inquiryMsg, setInquiryMsg] = useState("");
  const [inquiryBudget, setInquiryBudget] = useState("");
  const [inquiryDate, setInquiryDate] = useState("");
  const [inquiryContactPref, setInquiryContactPref] = useState("phone");
  const [inquiryName, setInquiryName] = useState("");
  const [inquiryEmail, setInquiryEmail] = useState("");
  const [inquiryPhone, setInquiryPhone] = useState("");
  const [submittingInquiry, setSubmittingInquiry] = useState(false);

  // Reviews state
  const [reviewsList, setReviewsList] = useState([]);
  const [filterReviewCategory, setFilterReviewCategory] = useState("All");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewCategory, setReviewCategory] = useState("General");
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  // Auto-fill user contact info when logged in
  useEffect(() => {
    if (user) {
      if (user.name) {
        setBookingCustomerName((prev) => prev || user.name);
        setInquiryName((prev) => prev || user.name);
      }
      if (user.email) {
        setBookingCustomerEmail((prev) => prev || user.email);
        setInquiryEmail((prev) => prev || user.email);
      }
      if (user.phone) {
        setBookingCustomerPhone((prev) => prev || user.phone);
        setInquiryPhone((prev) => prev || user.phone);
      }
    }
  }, [user]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const data = await getServiceById(id);
        const serviceObj = data.service || data.data || data;
        setService(serviceObj);
        setSelectedImageIndex(0);
        if (serviceObj.reviews && Array.isArray(serviceObj.reviews)) {
          setReviewsList(serviceObj.reviews);
        } else if (serviceObj._id) {
          getServiceReviews(serviceObj._id)
            .then((rRes) => {
              if (rRes?.reviews) setReviewsList(rRes.reviews);
            })
            .catch(() => {});
        }
      } catch (err) {
        console.error("Failed to load service details:", err);
        toast.error("Failed to load service details");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const isEnquiryOnly =
    service?.serviceMode?.toUpperCase() === "ENQUIRY" ||
    service?.bookingType?.toLowerCase() === "inquiry" ||
    service?.allowBooking === false;

  const filteredReviewsList = useMemo(() => {
    if (filterReviewCategory === "All") return reviewsList;
    return reviewsList.filter(
      (r) =>
        (r.reviewCategory || "General").toLowerCase() ===
        filterReviewCategory.toLowerCase(),
    );
  }, [reviewsList, filterReviewCategory]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please login to submit a review");
      return;
    }
    if (!reviewComment.trim()) {
      toast.error("Please write your review feedback");
      return;
    }

    try {
      setSubmittingReview(true);
      const res = await createReview({
        reviewType: "service",
        reviewFor: service._id,
        rating: Number(reviewRating),
        reviewCategory,
        title: reviewTitle.trim(),
        comment: reviewComment.trim(),
      });
      toast.success("Thank you! Your review has been submitted.");
      setShowReviewModal(false);
      setShowReviewForm(false);
      setReviewComment("");
      setReviewTitle("");
      if (res.review) {
        setReviewsList((prev) => [res.review, ...prev]);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  // Safely extract and deduplicate all images for the service gallery (up to 7 images)
  const allImages = useMemo(() => {
    if (!service) return [];
    const list = [];
    const pushIfNew = (url) => {
      if (url && typeof url === "string" && !list.includes(url)) {
        list.push(url);
      }
    };

    // Primary cover / thumbnail
    const thumbUrl =
      typeof service.thumbnail === "string"
        ? service.thumbnail
        : service.thumbnail?.url;
    pushIfNew(thumbUrl);

    // Gallery images
    if (Array.isArray(service.images)) {
      service.images.forEach((img) => {
        const url = typeof img === "string" ? img : img?.url;
        pushIfNew(url);
      });
    }

    // Fallback if none provided
    if (list.length === 0) {
      list.push(
        "https://thumbs.dreamstime.com/b/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available-236105299.jpg",
      );
    }
    return list;
  }, [service]);

  // Current active price based on package or base
  const activePrice = useMemo(() => {
    if (selectedPackage && selectedPackage.price !== undefined) {
      return Number(selectedPackage.price);
    }
    return Number(service?.pricing?.amount || service?.price || 0);
  }, [selectedPackage, service]);

  const activeDuration = useMemo(() => {
    if (selectedPackage?.duration) {
      return formatDuration(selectedPackage.duration);
    }
    return formatDuration(service?.duration);
  }, [selectedPackage, service]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please login to complete your booking");
      navigate(`/login?redirect=/services/${id}`);
      return;
    }

    const cName = (bookingCustomerName || user?.name || "").trim();
    const cEmail = (bookingCustomerEmail || user?.email || "").trim();
    const cPhone = (bookingCustomerPhone || user?.phone || "").trim();

    if (!cName || !cEmail || !cPhone) {
      toast.error(
        "Please provide your name, email, and phone number for the booking confirmation",
      );
      return;
    }

    try {
      setSubmittingBooking(true);
      const payload = {
        serviceId: id,
        service: id,
        customerName: cName,
        customerEmail: cEmail,
        customerPhone: cPhone,
        vendor: service?.vendor?._id || service?.vendor,
        business: service?.business?._id || service?.business,
        bookingDate: selectedDate,
        bookingTime: selectedTimeSlot,
        timeSlot: selectedTimeSlot,
        notes: customerAddress
          ? `Service Address: ${customerAddress}. Notes: ${bookingNotes}`
          : bookingNotes,
        price: activePrice,
        totalAmount: activePrice,
        package: selectedPackage
          ? {
              name: selectedPackage.name,
              price: selectedPackage.price,
              duration: selectedPackage.duration,
            }
          : undefined,
      };

      await createBooking(payload);
      toast.success(
        "Appointment booked successfully! You will receive confirmation details shortly.",
      );
      setShowBookingModal(false);
      navigate("/booking-success");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to submit booking");
    } finally {
      setSubmittingBooking(false);
    }
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    if (!inquiryMsg.trim()) {
      toast.error("Please provide your project or service requirements");
      return;
    }

    const inqName = (inquiryName || user?.name || "").trim();
    const inqEmail = (inquiryEmail || user?.email || "").trim();
    const inqPhone = (inquiryPhone || user?.phone || "").trim();

    if (!inqName || !inqEmail || !inqPhone) {
      toast.error(
        "Please provide your name, email, and phone number so the provider can reach you",
      );
      return;
    }

    try {
      setSubmittingInquiry(true);
      await createInquiry({
        serviceId: id,
        service: id,
        name: inqName,
        email: inqEmail,
        phone: inqPhone,
        vendor: service?.vendor?._id || service?.vendor,
        business: service?.business?._id || service?.business,
        message: `${inquiryMsg}\n\n[Preferred Contact Method: ${inquiryContactPref.toUpperCase()}]`,
        budget: inquiryBudget ? Number(inquiryBudget) : undefined,
        preferredDate: inquiryDate || undefined,
        preferredTime: inquiryContactPref,
      });
      toast.success(
        "Inquiry sent successfully! The service provider will get back to you with a quotation.",
      );
      setInquiryMsg("");
      setInquiryBudget("");
      setInquiryDate("");
      setShowInquiryModal(false);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to submit inquiry");
    } finally {
      setSubmittingInquiry(false);
    }
  };

  if (loading) return <DetailSkeleton />;

  if (!service) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 text-center space-y-4 max-w-md">
          <div className="w-14 h-14 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto">
            <AlertCircle size={28} />
          </div>
          <h2 className="text-xl font-bold text-slate-800">
            Service Not Found
          </h2>
          <p className="text-xs text-slate-500">
            This service listing may have been moved, updated, or is currently
            unavailable in the marketplace.
          </p>
          <button
            onClick={() => navigate("/services")}
            className="bg-[#004ac6] hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
          >
            Explore Services Marketplace
          </button>
        </div>
      </div>
    );
  }

  const timeSlots = [
    "09:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:30 AM - 12:30 PM",
    "02:00 PM - 03:00 PM",
    "04:00 PM - 05:00 PM",
    "06:00 PM - 07:00 PM",
  ];

  // Defensive badge mappings supporting both new enums and legacy values
  const rawDeliveryType = String(
    service.deliveryType || service.serviceMode || "",
  ).toUpperCase();
  const deliveryBadge = {
    ONSITE: {
      label: "Studio / In-Store Visit",
      desc: "Service performed at provider's verified location",
      color: "bg-blue-50 text-blue-700 border-blue-200",
    },
    SHOP_VISIT: {
      label: "Studio / In-Store Visit",
      desc: "Service performed at provider's verified location",
      color: "bg-blue-50 text-blue-700 border-blue-200",
    },
    AT_HOME: {
      label: "Doorstep / At-Home",
      desc: "Expert travels to your location",
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    HOME_SERVICE: {
      label: "Doorstep / At-Home",
      desc: "Expert travels to your location",
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    REMOTE: {
      label: "100% Online / Remote",
      desc: "Delivered digitally or via virtual consultation",
      color: "bg-purple-50 text-purple-700 border-purple-200",
    },
    ONLINE: {
      label: "100% Online / Remote",
      desc: "Delivered digitally or via virtual consultation",
      color: "bg-purple-50 text-purple-700 border-purple-200",
    },
    HYBRID: {
      label: "Hybrid Delivery",
      desc: "Combination of virtual kickoff and on-site delivery",
      color: "bg-amber-50 text-amber-800 border-amber-200",
    },
  }[rawDeliveryType] || {
    label: "On-Site / Studio",
    desc: "Service performed at verified location",
    color: "bg-blue-50 text-blue-700 border-blue-200",
  };

  const rawServiceMode = String(service.serviceMode || "").toUpperCase();
  const serviceModeBadge = {
    BOOKING: {
      label: "Instant Booking",
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    ENQUIRY: {
      label: "Custom Proposal / Quote",
      color: "bg-indigo-50 text-indigo-700 border-indigo-200",
    },
    BOTH: {
      label: "Instant Booking & Custom Proposal",
      color: "bg-blue-50 text-blue-700 border-blue-200",
    },
    SHOP_VISIT: {
      label: "Instant Booking",
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    HOME_SERVICE: {
      label: "Instant Booking",
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    ONLINE: {
      label: "Instant Booking",
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
  }[rawServiceMode] || {
    label: "Instant Booking & Proposal",
    color: "bg-blue-50 text-blue-700 border-blue-200",
  };

  const faqs = [
    {
      q: "How does the booking and confirmation process work?",
      a: "When you choose a date and time slot, your booking request is instantly transmitted to the verified service provider. You will receive an immediate confirmation with scheduling details, and you can chat or call the provider directly.",
    },
    {
      q: "Can I reschedule or cancel if my plans change?",
      a: "Yes! All verified services on ILUMAA provide free rescheduling up to 4 hours prior to the scheduled appointment time. You can manage appointments seamlessly from your customer dashboard.",
    },
    {
      q: "What if I need custom features not listed in standard packages?",
      a: "Click 'Request Custom Quote / Proposal' on this page! You can detail your custom requirements, scope, and target budget. The provider will review and respond with a tailored quotation within 24 hours.",
    },
    {
      q: "Are the service professionals verified?",
      a: "Absolutely. All businesses and service personnel on ILUMAA undergo identity verification, quality credential evaluation, and SuperAdmin review before being published.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans text-slate-800">
      {/* Top Breadcrumb & Status Bar */}
      <div className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium overflow-hidden">
            <button
              onClick={() => navigate("/services")}
              className="flex items-center gap-1.5 hover:text-[#004ac6] transition-colors font-bold cursor-pointer"
            >
              <ArrowLeft size={14} />
              Services Directory
            </button>
            <ChevronRight size={13} className="text-slate-300 shrink-0" />
            <span className="text-slate-500 truncate max-w-[120px] sm:max-w-[200px]">
              {typeof service.category === "object"
                ? service.category?.name || "Service"
                : service.category || "Service"}
            </span>
            <ChevronRight size={13} className="text-slate-300 shrink-0" />
            <span className="text-slate-900 font-bold truncate max-w-[160px] sm:max-w-[300px]">
              {service.serviceName || service.name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${serviceModeBadge.color}`}
            >
              {serviceModeBadge.label}
            </span>
            <span
              className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${deliveryBadge.color}`}
            >
              {deliveryBadge.label}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Gallery, Tabs, Interactive Sections (Col 8) */}
          <div className="lg:col-span-8 space-y-6">
            {/* 1. HERO GALLERY & PRIMARY BADGES */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-xs space-y-4">
              <div className="h-80 sm:h-[420px] rounded-2xl overflow-hidden bg-slate-100 relative group">
                <img
                  src={allImages[selectedImageIndex] || allImages[0]}
                  alt={service.serviceName || service.name}
                  className="w-full h-full object-cover transition-all duration-300"
                />

                {/* Rating badge */}
                <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-md text-white font-extrabold px-3 py-1.5 rounded-full text-xs shadow-md flex items-center gap-1.5">
                  <Star size={13} className="fill-amber-400 text-amber-400" />
                  <span>{service.rating || service.avgRating || 4.9}</span>
                  <span className="text-slate-400 font-medium">
                    ({service.reviews?.length || 12} reviews)
                  </span>
                </div>

                {/* Delivery Indicator Badge */}
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md text-slate-800 font-bold px-3 py-1.5 rounded-full text-xs shadow-md flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-[#004ac6]" />
                  <span>Verified Provider</span>
                </div>

                {allImages.length > 1 && (
                  <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-xs text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md">
                    <Camera size={13} />
                    <span>
                      {selectedImageIndex + 1} / {allImages.length} Photos
                    </span>
                  </div>
                )}
              </div>

              {/* Thumbnails Row */}
              {allImages.length > 1 && (
                <div className="flex gap-2.5 overflow-x-auto pb-1 pt-0.5 scrollbar-thin">
                  {allImages.map((imgUrl, idx) => {
                    const isSelected = selectedImageIndex === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedImageIndex(idx)}
                        className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                          isSelected
                            ? "border-[#004ac6] ring-2 ring-[#004ac6]/20 scale-102"
                            : "border-slate-200 opacity-70 hover:opacity-100 hover:border-slate-300"
                        }`}
                      >
                        <img
                          src={imgUrl}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                        {idx === 0 && (
                          <span className="absolute bottom-1 left-1 bg-black/70 text-[9px] text-white px-1 rounded font-bold">
                            Cover
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 2. TITLE, PROVIDER & QUICK STATS CARD */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
                <div className="space-y-1.5">
                  {service.business?.businessName && (
                    <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#004ac6] uppercase tracking-wider">
                      <Building size={14} />
                      <span>{service.business.businessName}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                      <span className="text-slate-500 font-semibold normal-case">
                        Verified Business Partner
                      </span>
                    </div>
                  )}
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    {service.serviceName || service.name}
                  </h1>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-50 text-slate-700 text-xs font-bold border border-slate-200">
                    <Clock size={13} className="text-[#004ac6]" />
                    {activeDuration}
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                    <CheckCircle2 size={13} />
                    Quality Assured
                  </span>
                </div>
              </div>

              {/* Service Navigation Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200/80 scrollbar-none">
                {[
                  {
                    id: "overview",
                    label: "Overview & Workflow",
                    icon: FileText,
                  },
                  ...(service.packages && service.packages.length > 0
                    ? [
                        {
                          id: "packages",
                          label: `Packages (${service.packages.length})`,
                          icon: Layers,
                        },
                      ]
                    : []),
                  ...(service.customAttributes &&
                  Object.keys(service.customAttributes).length > 0
                    ? [
                        {
                          id: "specs",
                          label: "Specifications & Tech",
                          icon: Sparkles,
                        },
                      ]
                    : []),
                  { id: "provider", label: "About Provider", icon: Building },
                  {
                    id: "reviews",
                    label: `Reviews (${reviewsList.length})`,
                    icon: Star,
                  },
                  { id: "faq", label: "FAQ & Guarantees", icon: HelpCircle },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-2 px-3.5 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                        isActive
                          ? "bg-[#004ac6] text-white shadow-xs"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                      }`}
                    >
                      <Icon size={14} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* TAB 1: OVERVIEW & WORKFLOW */}
              {activeTab === "overview" && (
                <div className="space-y-6 pt-2 animate-in fade-in duration-150">
                  {/* Summary & Description */}
                  {service.shortDescription && (
                    <p className="text-sm font-semibold text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 leading-relaxed">
                      {service.shortDescription}
                    </p>
                  )}

                  <div className="space-y-3">
                    <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                      Service Description & Details
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line font-medium">
                      {service.description}
                    </p>
                  </div>

                  {/* Key Features / Inclusions Checklist */}
                  {service.features && service.features.length > 0 && (
                    <div className="space-y-3 pt-3">
                      <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 size={15} className="text-emerald-500" />
                        What is Included in This Service
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {service.features.map((feat, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-2.5 text-xs font-semibold text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-200/70"
                          >
                            <CheckCircle2
                              size={15}
                              className="text-emerald-500 shrink-0 mt-0.5"
                            />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* HOW THIS SERVICE WORKS: 4 STEP CUSTOMER JOURNEY */}
                  <div className="pt-5 border-t border-slate-100 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                        <Zap size={15} className="text-[#004ac6]" />
                        How The Client Process Works
                      </h3>
                      <span className="text-[11px] font-bold text-[#004ac6]">
                        Simple & Transparent
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                      {[
                        {
                          step: "01",
                          title: "Select & Configure",
                          desc: "Choose your preferred tiered package or submit your tailored requirement scope.",
                        },
                        {
                          step: "02",
                          title: "Confirm Schedule",
                          desc: "Lock in an instant date/slot or receive an itemized proposal within 24 hours.",
                        },
                        {
                          step: "03",
                          title: "Expert Execution",
                          desc: `${deliveryBadge.label} execution handled by vetted, background-checked specialists.`,
                        },
                        {
                          step: "04",
                          title: "Signoff & Support",
                          desc: "Inspect deliverables, receive warranty/invoices, and complete with satisfaction assurance.",
                        },
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/70 space-y-2 relative"
                        >
                          <span className="text-lg font-black text-[#004ac6] block">
                            {item.step}
                          </span>
                          <h4 className="text-xs font-extrabold text-slate-900">
                            {item.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: TIERED PACKAGES */}
              {activeTab === "packages" && (
                <div className="space-y-5 pt-2 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                        Available Service Packages
                      </h3>
                      <p className="text-xs text-slate-500">
                        Select a package tier to customize deliverables, scope,
                        and timeline
                      </p>
                    </div>
                    {selectedPackage && (
                      <button
                        type="button"
                        onClick={() => setSelectedPackage(null)}
                        className="text-xs font-bold text-rose-500 hover:text-rose-700 underline cursor-pointer"
                      >
                        Clear Selection (Revert to Base Fee)
                      </button>
                    )}
                  </div>

                  {service.packages && service.packages.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {service.packages.map((pkg, idx) => {
                        const isSelected = selectedPackage?.name === pkg.name;
                        return (
                          <div
                            key={idx}
                            className={`rounded-2xl p-5 border-2 transition-all flex flex-col justify-between ${
                              isSelected
                                ? "border-[#004ac6] bg-blue-50/30 shadow-md ring-2 ring-[#004ac6]/20"
                                : "border-slate-200 hover:border-slate-300 bg-white"
                            }`}
                          >
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <h4 className="font-extrabold text-slate-900 text-sm">
                                  {pkg.name}
                                </h4>
                                {isSelected && (
                                  <span className="bg-[#004ac6] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                    Selected
                                  </span>
                                )}
                              </div>
                              <div>
                                {isEnquiryOnly ? (
                                  <div>
                                    <span className="text-sm font-black text-[#004ac6] block">
                                      Custom Quote on Enquiry
                                    </span>
                                    <span className="text-xs text-slate-400 block font-semibold mt-0.5">
                                      Pricing tailored to scope
                                    </span>
                                  </div>
                                ) : (
                                  <>
                                    <span className="text-2xl font-black text-slate-900">
                                      ₹
                                      {Number(pkg.price || 0).toLocaleString(
                                        "en-IN",
                                      )}
                                    </span>
                                    {pkg.duration?.value && (
                                      <span className="text-xs text-slate-400 block font-semibold mt-0.5">
                                        Duration: {pkg.duration.value}{" "}
                                        {pkg.duration.unit || "mins"}
                                      </span>
                                    )}
                                  </>
                                )}
                              </div>
                              {pkg.description && (
                                <p className="text-xs text-slate-500 line-clamp-2">
                                  {pkg.description}
                                </p>
                              )}
                              {pkg.features && pkg.features.length > 0 && (
                                <ul className="space-y-1.5 pt-3 border-t border-slate-100">
                                  {pkg.features.map((feat, fIdx) => (
                                    <li
                                      key={fIdx}
                                      className="flex items-start gap-1.5 text-xs text-slate-700 font-medium"
                                    >
                                      <CheckCircle2
                                        size={13}
                                        className="text-emerald-500 shrink-0 mt-0.5"
                                      />
                                      <span>{feat}</span>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                if (isEnquiryOnly) {
                                  setSelectedPackage(pkg);
                                  setShowInquiryModal(true);
                                  return;
                                }
                                if (isSelected) {
                                  setSelectedPackage(null);
                                } else {
                                  setSelectedPackage(pkg);
                                  toast.success(
                                    `Selected ${pkg.name} package!`,
                                  );
                                }
                              }}
                              className={`mt-4 w-full py-2.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                                isSelected
                                  ? "bg-[#004ac6] text-white shadow-xs"
                                  : "bg-slate-100 hover:bg-slate-200 text-slate-800"
                              }`}
                            >
                              {isEnquiryOnly
                                ? `Enquire for ${pkg.name}`
                                : isSelected
                                ? "Package Active ✓"
                                : `Choose ${pkg.name}`}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-6 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                      <p className="text-xs text-slate-500">
                        {isEnquiryOnly
                          ? "This service is available exclusively via custom enquiry. Submit your requirements for a personalized proposal."
                          : "This service is offered as a single standard rate. Custom quotes available via Enquiry."}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: SPECIFICATIONS & CUSTOM ATTRIBUTES */}
              {activeTab === "specs" && (
                <div className="space-y-5 pt-2 animate-in fade-in duration-150">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles size={15} className="text-[#004ac6]" />
                      Technical & Industry Specifications
                    </h3>
                    <p className="text-xs text-slate-500">
                      Specific details configured for this service category
                    </p>
                  </div>

                  {service.customAttributes &&
                  Object.keys(service.customAttributes).length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                      {Object.entries(service.customAttributes).map(
                        ([key, val]) => {
                          const isArr = Array.isArray(val);
                          return (
                            <div
                              key={key}
                              className="bg-slate-50/90 p-4 rounded-2xl border border-slate-200/80 space-y-1.5"
                            >
                              <span className="text-[10px] uppercase font-extrabold text-slate-400 block tracking-wider">
                                {key.replace(/_/g, " ")}
                              </span>
                              {isArr ? (
                                <div className="flex flex-wrap gap-1 pt-1">
                                  {val.map((item, iIdx) => (
                                    <span
                                      key={iIdx}
                                      className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-800 shadow-2xs"
                                    >
                                      {item}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-xs font-extrabold text-slate-800 block">
                                  {typeof val === "boolean"
                                    ? val
                                      ? "Yes / Supported"
                                      : "No"
                                    : String(val)}
                                </span>
                              )}
                            </div>
                          );
                        },
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500">
                      No industry-specific attributes specified.
                    </p>
                  )}
                </div>
              )}

              {/* TAB 4: PROVIDER DETAILS */}
              {activeTab === "provider" && (
                <div className="space-y-5 pt-2 animate-in fade-in duration-150">
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-xs border border-slate-200 flex items-center justify-center font-black text-[#004ac6] text-lg">
                      {service.business?.businessName?.charAt(0) || "B"}
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900">
                        {service.business?.businessName || "Verified Provider"}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium">
                        Verified Business Account on ILUMAA
                      </p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3.5">
                    <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block">
                        Operating Hours
                      </span>
                      <span className="text-xs font-bold text-slate-800">
                        {service.startTime || "09:00"} -{" "}
                        {service.endTime || "18:00"}
                      </span>
                    </div>

                    <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block">
                        Location / Venue
                      </span>
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                        <MapPin size={12} className="text-[#004ac6] shrink-0" />
                        {service.location?.address
                          ? `${service.location.address}, ${service.location.city || ""}`
                          : "Location details shared upon booking"}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: REVIEWS */}
              {activeTab === "reviews" && (
                <div className="space-y-6 pt-2 animate-in fade-in duration-150">
                  {/* Reviews Header Banner */}
                  <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                      <div className="text-center p-3 rounded-2xl bg-white border border-slate-200/90 shadow-xs min-w-[90px]">
                        <span className="text-3xl font-black text-slate-900 block">
                          {(
                            service.rating ||
                            service.averageRating ||
                            5
                          ).toFixed(1)}
                        </span>
                        <div className="flex justify-center text-amber-400 mt-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              size={12}
                              className={
                                i <
                                Math.round(
                                  service.rating || service.averageRating || 5,
                                )
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-slate-200"
                              }
                            />
                          ))}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-base font-black text-slate-900">
                          Client Reviews & Verified Experiences
                        </h3>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                          {reviewsList.length} verified customer review
                          {reviewsList.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (!isAuthenticated) {
                          toast.error(
                            "Please login to share your service experience",
                          );
                          navigate("/login", {
                            state: { from: `/services/${id}` },
                          });
                          return;
                        }
                        setShowReviewForm((prev) => !prev);
                      }}
                      className="px-5 py-3 rounded-2xl bg-[#004ac6] hover:bg-blue-700 text-white font-extrabold text-xs transition shadow-md shadow-blue-600/20 flex items-center gap-2 cursor-pointer shrink-0"
                    >
                      <Sparkles size={14} />
                      <span>
                        {showReviewForm ? "Cancel Review" : "Write a Review"}
                      </span>
                    </button>
                  </div>

                  {/* Collapsible Write Review Form (Matching Product Review structure) */}
                  {showReviewForm && (
                    <form
                      onSubmit={handleReviewSubmit}
                      className="bg-white border-2 border-[#004ac6]/30 rounded-3xl p-6 sm:p-8 space-y-5 shadow-md animate-fade-in"
                    >
                      <div className="border-b border-slate-100 pb-3">
                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                          <Sparkles size={16} className="text-[#004ac6]" />{" "}
                          Write a Customer Service Review
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Share your genuine experience with this service to
                          help other clients and improve service quality.
                        </p>
                      </div>

                      {/* Overall Rating */}
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-2">
                          Overall Rating{" "}
                          <span className="text-rose-500">*</span>
                        </label>
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="flex items-center gap-1 bg-slate-50 p-2 rounded-xl border border-slate-200">
                            {[1, 2, 3, 4, 5].map((star) => {
                              const isFilled =
                                (hoverRating || reviewRating) >= star;
                              return (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => setReviewRating(star)}
                                  onMouseEnter={() => setHoverRating(star)}
                                  onMouseLeave={() => setHoverRating(0)}
                                  className="p-1 text-slate-300 hover:text-amber-400 transition-colors cursor-pointer"
                                  aria-label={`${star} Stars`}
                                >
                                  <Star
                                    size={22}
                                    className={
                                      isFilled
                                        ? "fill-amber-400 text-amber-400"
                                        : "text-slate-300"
                                    }
                                  />
                                </button>
                              );
                            })}
                          </div>
                          <span className="text-xs font-bold text-slate-600 ml-2">
                            {reviewRating === 5 && "★★★★★ 5.0 - Excellent!"}
                            {reviewRating === 4 && "★★★★☆ 4.0 - Very Good"}
                            {reviewRating === 3 && "★★★☆☆ 3.0 - Good"}
                            {reviewRating === 2 && "★★☆☆☆ 2.0 - Fair"}
                            {reviewRating === 1 && "★☆☆☆☆ 1.0 - Poor"}
                          </span>
                        </div>
                      </div>

                      {/* Review Category */}
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1.5">
                          Feedback Category / Service Aspect{" "}
                          <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={reviewCategory}
                          onChange={(e) => setReviewCategory(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 font-semibold focus:bg-white focus:border-[#004ac6] outline-none transition"
                        >
                          <option value="General">General Feedback</option>
                          <option value="Service Quality">
                            Service Quality
                          </option>
                          <option value="Staff & Professionalism">
                            Staff & Professionalism
                          </option>
                          <option value="Value for Money">
                            Value for Money
                          </option>
                          <option value="Punctuality & Timeliness">
                            Punctuality & Timeliness
                          </option>
                        </select>
                      </div>

                      {/* Review Title Input */}
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1.5">
                          Review Headline / Title (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Prompt execution, expert specialist and spotless finish!"
                          value={reviewTitle}
                          onChange={(e) => setReviewTitle(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 outline-none focus:bg-white focus:border-[#004ac6] transition font-medium"
                        />
                      </div>

                      {/* Review Comments */}
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1.5">
                          Review Comments & Feedback{" "}
                          <span className="text-rose-500">*</span>
                        </label>
                        <textarea
                          rows={4}
                          placeholder="Write your review here. What did you like or dislike? How was the service quality, punctuality, or professional conduct?"
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          required
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-800 outline-none focus:bg-white focus:border-[#004ac6] transition font-medium leading-relaxed"
                        />
                      </div>

                      {/* Form Action Buttons */}
                      <div className="flex items-center gap-3 pt-2">
                        <button
                          type="submit"
                          disabled={submittingReview}
                          className="px-7 py-3 bg-[#004ac6] hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition shadow-sm cursor-pointer disabled:opacity-50"
                        >
                          {submittingReview
                            ? "Submitting Review..."
                            : "Submit Review"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowReviewForm(false)}
                          className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-xl transition cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Category Pills Filter */}
                  {reviewsList.length > 0 && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                      {[
                        "All",
                        "General",
                        "Service Quality",
                        "Staff & Professionalism",
                        "Value for Money",
                        "Punctuality & Timeliness",
                      ].map((cat) => {
                        const count =
                          cat === "All"
                            ? reviewsList.length
                            : reviewsList.filter(
                                (r) =>
                                  (
                                    r.reviewCategory || "General"
                                  ).toLowerCase() === cat.toLowerCase(),
                              ).length;
                        if (cat !== "All" && count === 0) return null;
                        return (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setFilterReviewCategory(cat)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                              filterReviewCategory === cat
                                ? "bg-slate-900 text-white shadow-xs"
                                : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                            }`}
                          >
                            <span>{cat}</span>
                            <span className="text-[10px] opacity-75">
                              ({count})
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Reviews List */}
                  {filteredReviewsList.length > 0 ? (
                    <div className="space-y-4">
                      {filteredReviewsList.map((rev, idx) => (
                        <div
                          key={rev._id || idx}
                          className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3"
                        >
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-blue-50 text-[#004ac6] flex items-center justify-center font-bold text-xs border border-blue-100 shrink-0">
                                {(rev.user?.name || "Client")
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-extrabold text-xs text-slate-900">
                                    {rev.user?.name || "Verified Customer"}
                                  </span>
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
                                    {rev.reviewCategory || "General"}
                                  </span>
                                </div>
                                <span className="text-[10px] text-slate-400 block font-medium mt-0.5">
                                  {rev.createdAt
                                    ? new Date(
                                        rev.createdAt,
                                      ).toLocaleDateString("en-IN", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                      })
                                    : "Recent"}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  size={13}
                                  className={
                                    i < Number(rev.rating)
                                      ? "fill-amber-400 text-amber-400"
                                      : "text-slate-200"
                                  }
                                />
                              ))}
                            </div>
                          </div>

                          {rev.title && (
                            <h4 className="font-extrabold text-xs text-slate-900">
                              {rev.title}
                            </h4>
                          )}

                          <p className="text-xs text-slate-600 font-medium leading-relaxed">
                            {rev.comment}
                          </p>

                          {/* Provider / Admin Reply Box */}
                          {rev.reply?.comment && (
                            <div className="mt-3 p-4 bg-blue-50/80 rounded-2xl border-l-4 border-[#004ac6] border-slate-200/60 space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="font-extrabold text-xs text-[#004ac6] flex items-center gap-1.5">
                                  <ShieldCheck size={14} />
                                  <span>
                                    {rev.reply.repliedByName ||
                                      "Provider Official Response"}
                                  </span>
                                  {rev.reply.repliedRole && (
                                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-900 font-bold uppercase">
                                      {rev.reply.repliedRole}
                                    </span>
                                  )}
                                </span>
                                {rev.reply.repliedAt && (
                                  <span className="text-[10px] text-slate-400 font-medium">
                                    {new Date(
                                      rev.reply.repliedAt,
                                    ).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-700 italic pl-5 font-medium leading-relaxed">
                                "{rev.reply.comment}"
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200 space-y-2">
                      <p className="text-xs font-semibold text-slate-600">
                        {filterReviewCategory !== "All"
                          ? `No reviews under "${filterReviewCategory}" yet.`
                          : "No customer reviews posted yet. Be the first to share your experience!"}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 6: FAQ & GUARANTEES */}
              {activeTab === "faq" && (
                <div className="space-y-3.5 pt-2 animate-in fade-in duration-150">
                  <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                    Frequently Asked Questions
                  </h3>
                  <div className="space-y-3">
                    {faqs.map((faq, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1.5"
                      >
                        <h4 className="text-xs font-extrabold text-slate-900 flex items-center gap-2">
                          <HelpCircle
                            size={14}
                            className="text-[#004ac6] shrink-0"
                          />
                          {faq.q}
                        </h4>
                        <p className="text-xs text-slate-600 pl-5 leading-relaxed font-medium">
                          {faq.a}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: STICKY BOOKING & QUOTE ACTION CARD (Col 4) */}
          <div className="lg:col-span-4 sticky top-20 space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xl space-y-5">
              {/* Dynamic Price Display */}
              <div className="pb-4 border-b border-slate-100">
                {isEnquiryOnly ? (
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
                      Service Pricing
                    </span>
                    <span className="text-2xl font-black text-slate-900 block">
                      Custom Proposal
                    </span>
                    <span className="text-xs text-slate-500 font-semibold block mt-0.5">
                      Tailored pricing provided upon direct enquiry
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                        {selectedPackage
                          ? `Package: ${selectedPackage.name}`
                          : "Standard Fee"}
                      </span>
                      {selectedPackage && (
                        <button
                          type="button"
                          onClick={() => setSelectedPackage(null)}
                          className="text-[10px] font-bold text-[#004ac6] hover:underline cursor-pointer"
                        >
                          Reset to base fee
                        </button>
                      )}
                    </div>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-3xl font-black text-slate-900">
                        ₹{activePrice.toLocaleString("en-IN")}
                      </span>
                      <span className="text-xs text-slate-400 font-semibold">
                        / {activeDuration}
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Delivery & Mode Summary Pill */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-500">
                    Delivery Model:
                  </span>
                  <span className="font-extrabold text-slate-900">
                    {deliveryBadge.label}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-500">
                    Service Engagement:
                  </span>
                  <span className="font-extrabold text-[#004ac6]">
                    {serviceModeBadge.label}
                  </span>
                </div>
              </div>

              {/* Primary Action Buttons based on serviceMode */}
              <div className="space-y-3">
                {!isEnquiryOnly && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowBookingModal(true);
                    }}
                    className="w-full bg-[#004ac6] hover:bg-blue-700 text-white font-extrabold py-3.5 px-4 rounded-2xl text-xs sm:text-sm transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Calendar size={16} />
                    {selectedPackage
                      ? `Book ${selectedPackage.name} Plan`
                      : "Book Appointment Now"}
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setShowInquiryModal(true)}
                  className={`w-full py-3.5 px-4 rounded-2xl font-extrabold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                    isEnquiryOnly
                      ? "bg-[#004ac6] hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 text-sm"
                      : "border border-slate-300 hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <MessageSquare size={15} />
                  {isEnquiryOnly
                    ? "Request Custom Quote / Proposal"
                    : "Send Custom Project Enquiry"}
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-4 border-t border-slate-100 space-y-2.5">
                <div className="flex items-center gap-2.5 text-xs text-slate-600 font-medium">
                  <CheckCircle2
                    size={15}
                    className="text-emerald-500 shrink-0"
                  />
                  <span>
                    {isEnquiryOnly
                      ? "Fast response & detailed project consultation"
                      : "Free rescheduling up to 4 hrs prior"}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-600 font-medium">
                  <ShieldCheck size={15} className="text-[#004ac6] shrink-0" />
                  <span>100% Background-verified professionals</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-600 font-medium">
                  <Award size={15} className="text-purple-600 shrink-0" />
                  <span>
                    {isEnquiryOnly
                      ? "Custom proposal & satisfaction guarantee"
                      : "Transparent fees & satisfaction guarantee"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. STEP-BY-STEP CUSTOMER BOOKING DRAWER */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-150 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50 shrink-0">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  Schedule Your Appointment
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {service.serviceName || service.name}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowBookingModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-200 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={handleBookingSubmit}
              className="p-6 space-y-4 overflow-y-auto flex-1"
            >
              {/* Customer Contact Details */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-3">
                <span className="text-[11px] font-extrabold uppercase text-slate-500 block">
                  Your Contact Details (For Booking Updates & Verification)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={bookingCustomerName}
                      onChange={(e) => setBookingCustomerName(e.target.value)}
                      placeholder="e.g. John Doe"
                      required
                      className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-[#004ac6]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={bookingCustomerEmail}
                      onChange={(e) => setBookingCustomerEmail(e.target.value)}
                      placeholder="john@example.com"
                      required
                      className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-[#004ac6]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      value={bookingCustomerPhone}
                      onChange={(e) => setBookingCustomerPhone(e.target.value)}
                      placeholder="9876543210"
                      required
                      className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-[#004ac6]"
                    />
                  </div>
                </div>
              </div>

              {/* Package selector in Booking Modal */}
              {service.packages && service.packages.length > 0 && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    Selected Package Plan
                  </label>
                  <select
                    value={selectedPackage?.name || ""}
                    onChange={(e) => {
                      const found = service.packages.find(
                        (p) => p.name === e.target.value,
                      );
                      setSelectedPackage(found || null);
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-[#004ac6]"
                  >
                    <option value="">
                      Standard Base Service (₹
                      {(
                        service.pricing?.amount ||
                        service.price ||
                        0
                      ).toLocaleString("en-IN")}
                      )
                    </option>
                    {service.packages.map((pkg, pIdx) => (
                      <option key={pIdx} value={pkg.name}>
                        {pkg.name} Tier - ₹
                        {Number(pkg.price || 0).toLocaleString("en-IN")} (
                        {pkg.duration?.value || 60} mins)
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Date Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Select Preferred Date
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-[#004ac6]"
                  required
                />
              </div>

              {/* Time Slot Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Select Preferred Time Slot
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTimeSlot(slot)}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        selectedTimeSlot === slot
                          ? "bg-[#004ac6] text-white border-[#004ac6] shadow-xs"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location Address if Doorstep */}
              {(service.deliveryType === "AT_HOME" ||
                service.deliveryType === "HYBRID" ||
                service.serviceMode === "home_service") && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Your Doorstep Address / City *
                  </label>
                  <input
                    type="text"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    placeholder="Enter flat / street address for service visit"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-[#004ac6]"
                    required
                  />
                </div>
              )}

              {/* Requirements & Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Special Instructions or Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={bookingNotes}
                  onChange={(e) => setBookingNotes(e.target.value)}
                  placeholder="Provide any specific notes for the specialist..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#004ac6]"
                />
              </div>

              {/* Summary and Price breakdown */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between shrink-0">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-extrabold block">
                    Total Amount
                  </span>
                  <span className="text-xl font-black text-slate-900">
                    ₹{activePrice.toLocaleString("en-IN")}
                  </span>
                </div>
                <button
                  type="submit"
                  disabled={submittingBooking}
                  className="bg-[#004ac6] hover:bg-blue-700 text-white px-7 py-3 rounded-xl font-bold text-xs transition shadow-md shadow-blue-600/20 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {submittingBooking ? "Confirming..." : "Confirm & Proceed"}
                  <ChevronRight size={16} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. PROFESSIONAL CUSTOM PROJECT ENQUIRY DRAWER */}
      {showInquiryModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-150 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50 shrink-0">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  Request Custom Quote / Proposal
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {service.serviceName || service.name}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowInquiryModal(false)}
                className="p-2 text-slate-400 hover:bg-slate-200 rounded-xl transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={handleInquirySubmit}
              className="p-6 space-y-4 overflow-y-auto flex-1"
            >
              {/* Customer Contact Details */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-3">
                <span className="text-[11px] font-extrabold uppercase text-slate-500 block">
                  Your Contact Details (For Quotation & Direct Contact)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      value={inquiryName}
                      onChange={(e) => setInquiryName(e.target.value)}
                      placeholder="e.g. John Doe"
                      required
                      className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-[#004ac6]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={inquiryEmail}
                      onChange={(e) => setInquiryEmail(e.target.value)}
                      placeholder="john@example.com"
                      required
                      className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-[#004ac6]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={inquiryPhone}
                      onChange={(e) => setInquiryPhone(e.target.value)}
                      placeholder="9876543210"
                      required
                      className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-[#004ac6]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Describe Your Project / Service Requirements *
                </label>
                <textarea
                  rows={4}
                  required
                  value={inquiryMsg}
                  onChange={(e) => setInquiryMsg(e.target.value)}
                  placeholder="Detail your requirements, technology stack, scope of work, or questions for the provider..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#004ac6]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Target Budget (₹)
                  </label>
                  <input
                    type="number"
                    value={inquiryBudget}
                    onChange={(e) => setInquiryBudget(e.target.value)}
                    placeholder="e.g. 25000"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-[#004ac6]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Target Start Date
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={inquiryDate}
                    onChange={(e) => setInquiryDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-[#004ac6]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Preferred Contact Method
                </label>
                <select
                  value={inquiryContactPref}
                  onChange={(e) => setInquiryContactPref(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-[#004ac6]"
                >
                  <option value="phone">Phone Call</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="email">Email</option>
                </select>
              </div>

              <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-100 flex items-start gap-2.5">
                <ShieldCheck
                  size={16}
                  className="text-[#004ac6] shrink-0 mt-0.5"
                />
                <p className="text-[11px] text-blue-900 leading-relaxed font-medium">
                  Your enquiry is transmitted directly to the verified provider.
                  The provider will review your requirements and respond with a
                  formal proposal within 24 business hours.
                </p>
              </div>

              <button
                type="submit"
                disabled={submittingInquiry}
                className="w-full bg-[#004ac6] hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold text-xs transition shadow-md shadow-blue-600/20 disabled:opacity-50 cursor-pointer"
              >
                {submittingInquiry
                  ? "Transmitting Enquiry..."
                  : "Submit Proposal Request"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Write a Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center font-bold">
                  <Star size={16} className="fill-amber-400" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Share Your Feedback
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Review {service.serviceName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowReviewModal(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              {/* Star Rating Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Your Overall Rating
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-1 bg-slate-50 p-2 rounded-xl border border-slate-200">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isFilled = (hoverRating || reviewRating) >= star;
                      return (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="p-1 cursor-pointer transition hover:scale-110"
                        >
                          <Star
                            size={22}
                            className={
                              isFilled
                                ? "fill-amber-400 text-amber-400"
                                : "text-slate-200"
                            }
                          />
                        </button>
                      );
                    })}
                  </div>
                  <span className="text-xs font-extrabold text-slate-700 ml-2">
                    {reviewRating === 5 && "★★★★★ 5.0 - Excellent!"}
                    {reviewRating === 4 && "★★★★☆ 4.0 - Very Good"}
                    {reviewRating === 3 && "★★★☆☆ 3.0 - Good"}
                    {reviewRating === 2 && "★★☆☆☆ 2.0 - Fair"}
                    {reviewRating === 1 && "★☆☆☆☆ 1.0 - Poor"}
                  </span>
                </div>
              </div>

              {/* Review Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Feedback Category / Type
                </label>
                <select
                  value={reviewCategory}
                  onChange={(e) => setReviewCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-[#004ac6]"
                >
                  <option value="General">General Feedback</option>
                  <option value="Service Quality">Service Quality</option>
                  <option value="Staff & Professionalism">
                    Staff & Professionalism
                  </option>
                  <option value="Value for Money">Value for Money</option>
                  <option value="Punctuality & Timeliness">
                    Punctuality & Timeliness
                  </option>
                </select>
              </div>

              {/* Review Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Headline / Title (Optional)
                </label>
                <input
                  type="text"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="e.g. Exceptional service and prompt execution"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-[#004ac6]"
                />
              </div>

              {/* Comment */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Detailed Experience <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share details of your experience, professionalism of the team, and deliverable quality..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-[#004ac6]"
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="w-full bg-[#004ac6] hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold text-xs transition shadow-md shadow-blue-600/20 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                <Send size={14} />
                <span>
                  {submittingReview ? "Submitting Review..." : "Publish Review"}
                </span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
