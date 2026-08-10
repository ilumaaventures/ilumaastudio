import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { getServiceById } from "../../api/serviceService";
import { createBooking } from "../../api/bookingService";
import { createInquiry } from "../../api/inquiryService";
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
  const [selectedImage, setSelectedImage] = useState("");

  // Booking drawer / modal state
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(
    "10:00 AM - 11:00 AM",
  );
  const [selectedStaff, setSelectedStaff] = useState("");
  const [bookingNotes, setBookingNotes] = useState("");
  const [submittingBooking, setSubmittingBooking] = useState(false);

  // Inquiry modal state
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [inquiryMsg, setInquiryMsg] = useState("");
  const [submittingInquiry, setSubmittingInquiry] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const data = await getServiceById(id);
        const serviceObj = data.service || data.data || data;
        setService(serviceObj);
        setSelectedImage(
          serviceObj.images?.[0] ||
            serviceObj.thumbnail ||
            "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80",
        );
      } catch (err) {
        console.error("Failed to load service details:", err);
        toast.error("Failed to load service details");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please login to book a service appointment");
      navigate(`/login?redirect=/services/${id}`);
      return;
    }

    try {
      setSubmittingBooking(true);
      const payload = {
        service: id,
        vendor: service?.vendor?._id || service?.vendor,
        business: service?.business?._id || service?.business,
        bookingDate: selectedDate,
        timeSlot: selectedTimeSlot,
        notes: bookingNotes,
        totalAmount: service?.pricing?.amount || service?.price || 0,
      };

      await createBooking(payload);
      toast.success("Appointment booked successfully!");
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
    if (!inquiryMsg.trim()) return;

    try {
      setSubmittingInquiry(true);
      await createInquiry({
        service: id,
        vendor: service?.vendor?._id || service?.vendor,
        message: inquiryMsg,
        name: user?.name || "Guest User",
        email: user?.email || "",
        phone: user?.phone || "",
      });
      toast.success("Inquiry sent to service provider!");
      setInquiryMsg("");
      setShowInquiryModal(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to send inquiry");
    } finally {
      setSubmittingInquiry(false);
    }
  };

  if (loading) return <DetailSkeleton />;

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-3xl shadow-sm border text-center space-y-4 max-w-md">
          <h2 className="text-xl font-bold text-gray-800">Service Not Found</h2>
          <p className="text-xs text-gray-500">
            The service you are looking for does not exist or has been removed.
          </p>
          <button
            onClick={() => navigate("/services")}
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-xs font-semibold"
          >
            Back to Services
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

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* Top Breadcrumb Header */}
      <div className="bg-white border-b border-gray-200 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-gray-500 font-medium">
          <button
            onClick={() => navigate("/services")}
            className="flex items-center gap-1 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft size={14} />
            Services Marketplace
          </button>
          <ChevronRight size={14} className="text-gray-300" />
          <span className="text-gray-800 font-semibold line-clamp-1">
            {service.name}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Image Gallery & Service Details */}
          <div className="lg:col-span-8 space-y-8">
            {/* Gallery Card */}
            <div className="bg-white rounded-3xl p-4 border border-gray-200/80 shadow-sm space-y-4">
              <div className="h-96 rounded-2xl overflow-hidden bg-gray-100 relative">
                <img
                  src={selectedImage}
                  alt={service.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-full text-xs shadow-lg flex items-center gap-1">
                  <Star size={14} className="fill-slate-950" />
                  {service.rating || service.avgRating || 4.9} Rating
                </div>
              </div>

              {/* Thumbnails */}
              {service.images && service.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {service.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                        selectedImage === img
                          ? "border-indigo-600 ring-2 ring-indigo-600/30"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={img}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Title & Overview */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm space-y-6">
              <div>
                {service.business?.businessName && (
                  <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Building size={14} />
                    Provided by {service.business.businessName}
                  </p>
                )}
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">
                  {service.serviceName}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1 font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
                    <Clock size={14} />
                    {formatDuration(service.duration)}
                  </span>
                  <span className="flex items-center gap-1">
                    <ShieldCheck size={14} className="text-emerald-600" />
                    100% Verified Quality Guaranteed
                  </span>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 space-y-3">
                <h3 className="text-base font-bold text-gray-800">
                  Description
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                  {service.description}
                </p>
              </div>

              {/* Service Highlights / Features */}
              {service.features && service.features.length > 0 && (
                <div className="pt-6 border-t border-gray-100 space-y-3">
                  <h3 className="text-base font-bold text-gray-800">
                    Key Service Inclusions
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {service.features.map((feat, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-xs font-medium text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100"
                      >
                        <CheckCircle2
                          size={16}
                          className="text-emerald-500 flex-shrink-0"
                        />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Provider Review replies section */}
            {service.reviews && service.reviews.length > 0 && (
              <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-gray-800">
                  Customer Feedback & Reviews
                </h3>
                <div className="space-y-4">
                  {service.reviews.map((rev, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-gray-50 space-y-2 border border-gray-100"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-xs text-gray-800">
                          {rev.user?.name || "Verified Customer"}
                        </span>
                        <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                          <Star size={12} className="fill-amber-500" />
                          {rev.rating || 5}
                        </div>
                      </div>
                      <p className="text-xs text-gray-600">{rev.comment}</p>
                      {rev.reply?.comment && (
                        <div className="mt-2 p-3 bg-indigo-50/80 rounded-xl text-[11px] text-indigo-950 border border-indigo-100">
                          <span className="font-bold block text-indigo-700">
                            Store Provider Reply:
                          </span>
                          <p>{rev.reply.comment}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Pricing Card & Booking Actions */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xl sticky top-20 space-y-6">
              <div className="pb-5 border-b border-gray-100 flex justify-between items-end">
                <div>
                  <span className="text-xs text-gray-400 font-medium block">
                    Total Price
                  </span>
                  <span className="text-3xl font-black text-slate-900">
                    ₹
                    {(
                      service.pricing?.amount ||
                      service.price ||
                      0
                    ).toLocaleString("en-IN")}
                  </span>
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Instant Confirmation
                </span>
              </div>

              {/* Instant Booking Action */}
              <div className="space-y-3">
                <button
                  onClick={() => setShowBookingModal(true)}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-2xl text-sm transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
                >
                  <Calendar size={18} />
                  Book Appointment Now
                </button>

                <button
                  onClick={() => setShowInquiryModal(true)}
                  className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3.5 rounded-2xl text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <MessageSquare size={16} />
                  Send Inquiry / Ask Question
                </button>
              </div>

              {/* Provider Info Card */}
              <div className="pt-5 border-t border-gray-100 space-y-3">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Service Guarantee
                </h4>
                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-indigo-600" />
                    <span>Free rescheduling up to 4 hrs prior</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-indigo-600" />
                    <span>Certified & background-verified team</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-indigo-600" />
                    <span>Sanitized & safe execution</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Checkout Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50">
              <div>
                <h3 className="font-bold text-gray-800 text-base">
                  Schedule Appointment
                </h3>
                <p className="text-xs text-gray-500">{service.name}</p>
              </div>
              <button
                onClick={() => setShowBookingModal(false)}
                className="p-2 rounded-xl text-gray-400 hover:bg-gray-200 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleBookingSubmit} className="p-6 space-y-5">
              {/* Date Selection */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
                  Select Date
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              {/* Time Slot Selection */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
                  Select Time Slot
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTimeSlot(slot)}
                      className={`p-3 rounded-xl text-xs font-semibold border transition-all ${
                        selectedTimeSlot === slot
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20"
                          : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Special Instructions / Notes */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Additional Requirements / Notes
                </label>
                <textarea
                  rows={3}
                  value={bookingNotes}
                  onChange={(e) => setBookingNotes(e.target.value)}
                  placeholder="Mention any specific address details or instructions..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Submit */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">
                    Total Amount
                  </span>
                  <span className="text-xl font-black text-slate-900">
                    ₹
                    {(
                      service.pricing?.amount ||
                      service.price ||
                      0
                    ).toLocaleString("en-IN")}
                  </span>
                </div>
                <button
                  type="submit"
                  disabled={submittingBooking}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-7 py-3 rounded-xl font-bold text-xs transition-colors shadow-lg shadow-indigo-600/30 flex items-center gap-2 disabled:opacity-50"
                >
                  {submittingBooking ? "Confirming..." : "Confirm & Pay"}
                  <ChevronRight size={16} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inquiry Modal */}
      {showInquiryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50">
              <h3 className="font-bold text-gray-800 text-base">
                Send Inquiry to Provider
              </h3>
              <button
                onClick={() => setShowInquiryModal(false)}
                className="p-2 text-gray-400 hover:bg-gray-200 rounded-xl"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleInquirySubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Your Question / Inquiry
                </label>
                <textarea
                  rows={4}
                  required
                  value={inquiryMsg}
                  onChange={(e) => setInquiryMsg(e.target.value)}
                  placeholder="Ask about pricing, custom packages, availability..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                type="submit"
                disabled={submittingInquiry}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold text-xs transition-colors shadow-md shadow-indigo-600/20"
              >
                {submittingInquiry ? "Sending..." : "Submit Inquiry"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
