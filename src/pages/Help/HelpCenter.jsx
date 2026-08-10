import React, { useState } from "react";
import {
  Search,
  ChevronDown,
  ChevronRight,
  HelpCircle,
  ShoppingBag,
  Truck,
  RotateCcw,
  ShieldCheck,
  Calendar,
  MessageSquare,
  Mail,
  PhoneCall,
  Send,
  X,
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const TOPICS = [
  { id: "orders", title: "Orders & Shipping", count: "12 Articles", icon: ShoppingBag, color: "text-blue-600 bg-blue-50 dark:bg-blue-950/50" },
  { id: "delivery", title: "Delivery & Tracking", count: "8 Articles", icon: Truck, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50" },
  { id: "returns", title: "Returns & Refunds", count: "10 Articles", icon: RotateCcw, color: "text-amber-600 bg-amber-50 dark:bg-amber-950/50" },
  { id: "services", title: "Service Appointments", count: "15 Articles", icon: Calendar, color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50" },
  { id: "account", title: "Account & Safety", count: "7 Articles", icon: ShieldCheck, color: "text-purple-600 bg-purple-50 dark:bg-purple-950/50" },
];

const FAQS = [
  {
    category: "orders",
    question: "How do I track my order or service appointment?",
    answer: "You can track your order or service booking status anytime under My Profile -> Orders or My Bookings. Real-time updates and technician/driver tracking details are updated live once dispatched."
  },
  {
    category: "orders",
    question: "Can I modify or cancel my order after placing it?",
    answer: "Orders can be canceled or modified within 30 minutes of placing them if they haven't been packed or dispatched yet. Go to My Profile -> Orders and select 'Cancel Order'."
  },
  {
    category: "delivery",
    question: "What are the standard delivery timeframes?",
    answer: "Standard orders across Lucknow are delivered within 24-48 hours. Express local delivery products and home services are scheduled on your selected date and time slot."
  },
  {
    category: "returns",
    question: "What is the ILumaaStudio return & refund policy?",
    answer: "We offer a 7-day hassle-free return policy for unused items in original packaging. Refunds are processed back to your original payment method within 3-5 business days of item pickup."
  },
  {
    category: "services",
    question: "How are service professionals background checked?",
    answer: "All service providers on ILumaaStudio undergo rigorous ID verification, criminal background checks, skill testing, and ongoing customer rating evaluations for your safety."
  },
  {
    category: "services",
    question: "What if I need to reschedule a booked home service?",
    answer: "You can reschedule your appointment up to 2 hours before the scheduled time slot free of charge via your Profile -> My Bookings page."
  },
  {
    category: "account",
    question: "How do I change my default delivery address or phone number?",
    answer: "Navigate to Profile -> Saved Addresses. You can add new addresses, set a default address, or edit existing contact details at any time."
  },
];

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [openFaq, setOpenFaq] = useState(null);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketData, setTicketData] = useState({ subject: "", category: "Orders", message: "", orderId: "" });
  const [submittingTicket, setSubmittingTicket] = useState(false);

  const filteredFaqs = FAQS.filter((faq) => {
    const matchesTopic = selectedTopic === "all" || faq.category === selectedTopic;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTopic && matchesSearch;
  });

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    if (!ticketData.subject.trim() || !ticketData.message.trim()) {
      toast.error("Please fill in subject and description");
      return;
    }
    setSubmittingTicket(true);
    setTimeout(() => {
      setSubmittingTicket(false);
      setShowTicketModal(false);
      setTicketData({ subject: "", category: "Orders", message: "", orderId: "" });
      toast.success("Support ticket raised successfully! Ticket ID #ST-" + Math.floor(100000 + Math.random() * 900000));
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-200 transition-colors pb-16">
      
      {/* Search Header Banner */}
      <div className="bg-slate-900 dark:bg-slate-900 text-white py-14 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl" />
        <div className="max-w-4xl mx-auto text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/20">
            <HelpCircle size={14} />
            <span>ILumaaStudio Help Center</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            How can we help you today?
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-xl mx-auto">
            Search our knowledge base, explore frequent topics, or get in touch with our 24/7 customer care team.
          </p>

          {/* Search Input Bar */}
          <div className="max-w-2xl mx-auto pt-3">
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search orders, returns, services, payments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm font-medium outline-none border border-slate-200 dark:border-slate-700 focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 shadow-lg transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        
        {/* Topic Categories Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Popular Help Topics
            </h2>
            {selectedTopic !== "all" && (
              <button
                onClick={() => setSelectedTopic("all")}
                className="text-xs font-bold text-[#2563eb] hover:underline cursor-pointer"
              >
                Reset Topic Filter
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {TOPICS.map((topic) => {
              const Icon = topic.icon;
              const isSelected = selectedTopic === topic.id;

              return (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => setSelectedTopic(isSelected ? "all" : topic.id)}
                  className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-3 ${
                    isSelected
                      ? "bg-[#2563eb] text-white border-[#2563eb] shadow-md"
                      : "bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-[#2563eb]/50 shadow-xs"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSelected ? "bg-white/20 text-white" : topic.color}`}>
                    <Icon size={20} />
                  </div>

                  <div>
                    <h3 className={`font-bold text-xs sm:text-sm line-clamp-1 ${isSelected ? "text-white" : "text-slate-900 dark:text-white"}`}>
                      {topic.title}
                    </h3>
                    <p className={`text-[10px] font-medium mt-0.5 ${isSelected ? "text-blue-100" : "text-slate-400"}`}>
                      {topic.count}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* FAQs Accordion */}
        <div className="space-y-4">
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            Frequently Asked Questions
          </h2>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl divide-y divide-slate-100 dark:divide-slate-800 shadow-xs overflow-hidden">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, idx) => {
                const isOpen = openFaq === idx;

                return (
                  <div key={idx} className="transition-colors">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                    >
                      <span className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white">
                        {faq.question}
                      </span>
                      <div className={`w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 transition-transform ${isOpen ? "rotate-180 bg-[#2563eb] text-white" : "text-slate-500"}`}>
                        <ChevronDown size={15} />
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed border-t border-slate-100/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/50">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs font-medium">
                No matching questions found for "{searchQuery}". Try searching another keyword or raise a ticket below.
              </div>
            )}
          </div>
        </div>

        {/* Contact Support Section */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                Still need assistance?
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                Our support team is available 24/7 to resolve your inquiries
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowTicketModal(true)}
              className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md inline-flex items-center gap-2 shrink-0 cursor-pointer self-start sm:self-auto"
            >
              <Send size={15} />
              <span>Raise Support Ticket</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-[#2563eb] flex items-center justify-center shrink-0">
                <MessageSquare size={18} />
              </div>
              <div className="space-y-0.5">
                <h3 className="font-bold text-xs text-slate-900 dark:text-white">Live Support Chat</h3>
                <p className="text-[11px] text-slate-400">Available 24/7 in App</p>
                <span className="text-xs font-bold text-[#2563eb] block pt-1 hover:underline cursor-pointer">Start Chat →</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center shrink-0">
                <PhoneCall size={18} />
              </div>
              <div className="space-y-0.5">
                <h3 className="font-bold text-xs text-slate-900 dark:text-white">Call Customer Care</h3>
                <p className="text-[11px] text-slate-400">Mon - Sat (9 AM - 9 PM)</p>
                <a href="tel:+9118001234567" className="text-xs font-bold text-emerald-600 block pt-1 hover:underline">+91 1800-123-4567</a>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center shrink-0">
                <Mail size={18} />
              </div>
              <div className="space-y-0.5">
                <h3 className="font-bold text-xs text-slate-900 dark:text-white">Email Support</h3>
                <p className="text-[11px] text-slate-400">Response within 2 hours</p>
                <a href="mailto:support@ilumaastudio.com" className="text-xs font-bold text-purple-600 block pt-1 hover:underline">support@ilumaastudio.com</a>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Raise Ticket Modal */}
      {showTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">Raise a Support Ticket</h3>
                <p className="text-xs text-slate-400 font-medium">Specify your inquiry details for quick resolution</p>
              </div>
              <button
                onClick={() => setShowTicketModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleTicketSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Inquiry Category</label>
                <select
                  value={ticketData.category}
                  onChange={(e) => setTicketData({ ...ticketData, category: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium outline-none focus:border-[#2563eb]"
                >
                  <option value="Orders">Order Inquiry</option>
                  <option value="Delivery">Delivery & Tracking</option>
                  <option value="Services">Service Booking Issue</option>
                  <option value="Returns">Return / Refund Request</option>
                  <option value="Account">Account & Payment</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Order / Booking Ref ID (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. ORD-98234 or BK-4210"
                  value={ticketData.orderId}
                  onChange={(e) => setTicketData({ ...ticketData, orderId: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium outline-none focus:border-[#2563eb]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Subject *</label>
                <input
                  type="text"
                  required
                  placeholder="Briefly state your issue"
                  value={ticketData.subject}
                  onChange={(e) => setTicketData({ ...ticketData, subject: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium outline-none focus:border-[#2563eb]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Detailed Description *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe your question or issue in detail..."
                  value={ticketData.message}
                  onChange={(e) => setTicketData({ ...ticketData, message: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium outline-none focus:border-[#2563eb]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowTicketModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingTicket}
                  className="px-5 py-2 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold transition-colors cursor-pointer shadow-md flex items-center gap-1.5"
                >
                  {submittingTicket ? (
                    <span>Submitting...</span>
                  ) : (
                    <>
                      <CheckCircle2 size={15} />
                      <span>Submit Ticket</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
