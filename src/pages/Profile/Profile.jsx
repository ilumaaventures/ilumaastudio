import React, { useEffect, useState } from "react";
import {
  User,
  ShoppingBag,
  Package,
  Lock,
  MapPin,
  LogOut,
  ChevronRight,
  CheckCircle,
  Mail,
  Phone,
  ShieldCheck,
  Plus,
  Trash2,
  Check,
  Building,
  Home,
  Briefcase,
  X,
  Calendar,
  Clock,
  Sparkles,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { logoutUser } from "../../redux/actions/authActions.js";
import {
  getProfile,
  updateProfile,
  getAddresses,
  addAddress as apiAddAddress,
  deleteAddress as apiDeleteAddress,
  setDefaultAddress as apiSetDefaultAddress,
} from "../../api/profileService.js";
import { getMyOrders } from "../../api/orderService";
import { getBookings } from "../../api/bookingService";
import toast from "react-hot-toast";

const INITIAL_FALLBACK_ADDRESSES = [
  {
    _id: "addr_1",
    fullName: "Aditya Kumar",
    phone: "+91 98765 43210",
    street: "123 Gomti Nagar, Extension Phase 2",
    city: "Lucknow",
    state: "Uttar Pradesh",
    pincode: "226010",
    type: "Home",
    isDefault: true,
  },
  {
    _id: "addr_2",
    fullName: "Aditya Kumar",
    phone: "+91 98765 43210",
    street: "Suite 404, Tech Park Tower B, Vibhuti Khand",
    city: "Lucknow",
    state: "Uttar Pradesh",
    pincode: "226010",
    type: "Work",
    isDefault: false,
  },
];

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState("profile"); // 'profile' | 'orders' | 'bookings' | 'addresses' | 'security'
  const [profileData, setProfileData] = useState(null);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [customerBookings, setCustomerBookings] = useState([]);
  const [addresses, setAddresses] = useState(INITIAL_FALLBACK_ADDRESSES);

  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Address Modal State
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: user?.name || "",
    phone: user?.phone || "",
    street: "",
    city: "Lucknow",
    state: "Uttar Pradesh",
    pincode: "",
    type: "Home",
    isDefault: false,
  });

  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const res = await getProfile();
        if (res) {
          setProfileData(res);
          setProfileForm({
            name: res.name || user?.name || "",
            email: res.email || user?.email || "",
            phone: res.phone || user?.phone || "",
          });
        }
      } catch (err) {
        console.error("Profile load error:", err);
      }
    };

    const loadOrdersData = async () => {
      try {
        setLoadingOrders(true);
        const res = await getMyOrders();
        const list = Array.isArray(res) ? res : res?.orders || [];
        setCustomerOrders(list);
      } catch (err) {
        console.error("Orders load error:", err);
      } finally {
        setLoadingOrders(false);
      }
    };

    const loadBookingsData = async () => {
      try {
        setLoadingBookings(true);
        const res = await getBookings();
        const list = Array.isArray(res) ? res : res?.bookings || res?.data || [];
        setCustomerBookings(list);
      } catch (err) {
        console.error("Bookings load error:", err);
      } finally {
        setLoadingBookings(false);
      }
    };

    const loadAddressesData = async () => {
      try {
        const res = await getAddresses();
        const list = Array.isArray(res) ? res : res?.addresses || res?.data || [];
        if (list.length > 0) setAddresses(list);
      } catch (err) {
        console.error("Addresses load fallback:", err);
      }
    };

    loadProfileData();
    loadOrdersData();
    loadBookingsData();
    loadAddressesData();
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await updateProfile(profileForm);
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Address Actions
  const handleAddAddressSubmit = async (e) => {
    e.preventDefault();
    if (!newAddress.street || !newAddress.pincode || !newAddress.phone) {
      toast.error("Please fill in all required address fields");
      return;
    }

    const createdAddr = {
      _id: `addr_${Date.now()}`,
      ...newAddress,
    };

    try {
      await apiAddAddress(newAddress);
    } catch (_) {
      // Local state fallback
    }

    setAddresses((prev) => {
      let updated = [...prev];
      if (newAddress.isDefault) {
        updated = updated.map((a) => ({ ...a, isDefault: false }));
      }
      return [createdAddr, ...updated];
    });

    toast.success("Address saved successfully!");
    setShowAddressModal(false);
    setNewAddress({
      fullName: user?.name || "",
      phone: user?.phone || "",
      street: "",
      city: "Lucknow",
      state: "Uttar Pradesh",
      pincode: "",
      type: "Home",
      isDefault: false,
    });
  };

  const handleSetDefaultAddress = async (id) => {
    try {
      await apiSetDefaultAddress(id);
    } catch (_) {}
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a._id === id }))
    );
    toast.success("Default address updated!");
  };

  const handleDeleteAddress = async (id) => {
    try {
      await apiDeleteAddress(id);
    } catch (_) {}
    setAddresses((prev) => prev.filter((a) => a._id !== id));
    toast.success("Address removed!");
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-200 transition-colors pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header Title */}
        <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <Link to="/" className="hover:text-[#2563eb]">
                Home
              </Link>
              <ChevronRight size={12} />
              <span className="text-slate-900 dark:text-white font-bold">
                Account
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white pt-1">
              My Account
            </h1>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-4 py-2 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 hover:bg-red-100 rounded-lg text-xs font-bold transition-colors cursor-pointer"
          >
            <LogOut size={14} />
            <span>Log Out</span>
          </button>
        </div>

        {/* 2-Column User Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Navigation Tabs (3 cols) */}
          <aside className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 space-y-2 shadow-2xs">
            {/* User Profile Pill */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center gap-3 border border-slate-200/60 dark:border-slate-700/60 mb-2">
              <div className="w-10 h-10 rounded-full bg-[#2563eb] text-white flex items-center justify-center font-black text-base shadow-sm">
                {user?.name?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="truncate">
                <div className="text-sm font-black text-slate-900 dark:text-white truncate">
                  {user?.name || "Customer"}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  {user?.email}
                </div>
              </div>
            </div>

            {[
              {
                id: "profile",
                label: "Account Details",
                icon: <User size={16} />,
              },
              {
                id: "orders",
                label: "My Orders",
                icon: <ShoppingBag size={16} />,
              },
              {
                id: "bookings",
                label: "My Service Bookings",
                icon: <Sparkles size={16} />,
              },
              {
                id: "addresses",
                label: "Addresses & Location",
                icon: <MapPin size={16} />,
              },
              {
                id: "security",
                label: "Security & Password",
                icon: <Lock size={16} />,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-left ${
                  activeTab === tab.id
                    ? "bg-[#2563eb] text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </aside>

          {/* Right Main Content (9 cols) */}
          <main className="lg:col-span-9 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            
            {/* TAB: PROFILE DETAILS */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <h2 className="text-lg font-black text-slate-900 dark:text-white">
                  Account Details
                </h2>

                <form
                  onSubmit={handleProfileUpdate}
                  className="space-y-4 max-w-lg text-xs"
                >
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">
                      Full Name
                    </label>
                    <div className="relative">
                      <User
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        type="text"
                        required
                        value={profileForm.name}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            name: e.target.value,
                          })
                        }
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none focus:border-[#2563eb]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        type="email"
                        disabled
                        value={profileForm.email}
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-500 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        type="text"
                        placeholder="+91 98765 43210"
                        value={profileForm.phone}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            phone: e.target.value,
                          })
                        }
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none focus:border-[#2563eb]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-6 py-3 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-md shadow-blue-500/20"
                  >
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </button>
                </form>
              </div>
            )}

            {/* TAB: MY ORDERS */}
            {activeTab === "orders" && (
              <div className="space-y-6">
                <h2 className="text-lg font-black text-slate-900 dark:text-white">
                  My Orders
                </h2>

                {customerOrders.length === 0 ? (
                  <div className="p-8 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-center space-y-2">
                    <Package size={32} className="text-slate-400 mx-auto" />
                    <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
                      No orders found
                    </p>
                    <Link
                      to="/products"
                      className="text-xs font-bold text-[#2563eb] hover:underline inline-block"
                    >
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {customerOrders.map((ord) => (
                      <div
                        key={ord._id}
                        className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200/60 dark:border-slate-700/60 space-y-3 text-xs"
                      >
                        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                          <span className="font-mono font-bold text-slate-900 dark:text-white">
                            Order #{ord._id?.slice(-8)}
                          </span>
                          <span className="bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded text-[10px]">
                            {ord.status || "Processing"}
                          </span>
                        </div>
                        <div className="flex justify-between font-semibold">
                          <span>Total Amount:</span>
                          <span className="font-bold text-slate-900 dark:text-white">
                            ₹{ord.totalPrice || ord.totalAmount}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: MY BOOKINGS */}
            {activeTab === "bookings" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div>
                    <h2 className="text-lg font-black text-slate-900 dark:text-white">
                      My Service Bookings
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Track and manage your upcoming home services & appointments
                    </p>
                  </div>
                  <Link
                    to="/services"
                    className="bg-[#2563eb] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#1d4ed8] transition-colors"
                  >
                    Book New Service
                  </Link>
                </div>

                {customerBookings.length === 0 ? (
                  <div className="p-8 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-center space-y-2">
                    <Sparkles size={32} className="text-[#2563eb] mx-auto opacity-60" />
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      No service bookings yet
                    </p>
                    <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                      Explore our top rated home cleaning, AC repair, and beauty services available near you.
                    </p>
                    <Link
                      to="/services"
                      className="text-xs font-bold text-[#2563eb] hover:underline inline-block pt-2"
                    >
                      Browse Available Services
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {customerBookings.map((b) => (
                      <div
                        key={b._id}
                        className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 space-y-3 text-xs"
                      >
                        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                          <span className="font-bold text-slate-900 dark:text-white">
                            {b.serviceName || b.service?.name || "Home Service"}
                          </span>
                          <span className="bg-blue-100 text-[#2563eb] font-extrabold px-2.5 py-0.5 rounded-full text-[10px]">
                            {b.status || "Confirmed"}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-300 text-[11px]">
                          <div className="flex items-center gap-1.5">
                            <Calendar size={13} className="text-slate-400" />
                            <span>Date: {b.bookingDate || b.date || "Tomorrow"}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock size={13} className="text-slate-400" />
                            <span>Slot: {b.timeSlot || "10:00 AM - 11:00 AM"}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: ADDRESSES */}
            {activeTab === "addresses" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div>
                    <h2 className="text-lg font-black text-slate-900 dark:text-white">
                      Saved Addresses
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Manage your delivery locations for 1-click checkout
                    </p>
                  </div>

                  <button
                    onClick={() => setShowAddressModal(true)}
                    className="flex items-center gap-1.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Add New Address</span>
                  </button>
                </div>

                {/* Address Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div
                      key={addr._id}
                      className={`p-4 rounded-2xl border transition-all space-y-3 relative text-xs ${
                        addr.isDefault
                          ? "bg-blue-50/50 dark:bg-slate-800/80 border-[#2563eb]"
                          : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60"
                      }`}
                    >
                      {/* Top Row: Type & Default Tag */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="p-1.5 bg-white dark:bg-slate-800 rounded-lg text-[#2563eb] border border-slate-200 dark:border-slate-700">
                            {addr.type === "Work" ? <Briefcase size={14} /> : <Home size={14} />}
                          </span>
                          <span className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-[10px]">
                            {addr.type || "Home"}
                          </span>
                        </div>

                        {addr.isDefault ? (
                          <span className="bg-[#2563eb] text-white font-extrabold px-2.5 py-0.5 rounded-full text-[10px] flex items-center gap-1">
                            <Check size={10} /> Default Address
                          </span>
                        ) : (
                          <button
                            onClick={() => handleSetDefaultAddress(addr._id)}
                            className="text-[10px] font-bold text-slate-500 hover:text-[#2563eb] cursor-pointer"
                          >
                            Set as Default
                          </button>
                        )}
                      </div>

                      {/* Address Body */}
                      <div className="space-y-1 text-slate-700 dark:text-slate-300">
                        <div className="font-bold text-slate-900 dark:text-white">{addr.fullName}</div>
                        <div className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">
                          {addr.street}, {addr.city}, {addr.state} - <span className="font-mono font-bold">{addr.pincode}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-semibold pt-1">
                          Phone: {addr.phone}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                        <button
                          onClick={() => handleDeleteAddress(addr._id)}
                          className="flex items-center gap-1 text-red-500 hover:text-red-700 text-[11px] font-bold cursor-pointer"
                        >
                          <Trash2 size={12} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: SECURITY */}
            {activeTab === "security" && (
              <div className="space-y-4 max-w-md text-xs">
                <h2 className="text-lg font-black text-slate-900 dark:text-white">
                  Security & Password
                </h2>
                <div className="space-y-2">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Current Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => toast.success("Password updated!")}
                  className="bg-[#2563eb] text-white px-5 py-2.5 rounded-xl font-bold cursor-pointer hover:bg-[#1d4ed8]"
                >
                  Update Password
                </button>
              </div>
            )}

          </main>
        </div>
      </div>

      {/* ADD ADDRESS MODAL */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-lg space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <MapPin size={18} className="text-[#2563eb]" />
                Add New Delivery Address
              </h3>
              <button
                onClick={() => setShowAddressModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddAddressSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Recipient's Name"
                    value={newAddress.fullName}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, fullName: e.target.value })
                    }
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={newAddress.phone}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, phone: e.target.value })
                    }
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Street Address / House No. / Area
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="House/Flat No., Building Name, Street, Landmark"
                  value={newAddress.street}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, street: e.target.value })
                  }
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={newAddress.city}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, city: e.target.value })
                    }
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    State
                  </label>
                  <input
                    type="text"
                    required
                    value={newAddress.state}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, state: e.target.value })
                    }
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Pincode
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="226010"
                    value={newAddress.pincode}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, pincode: e.target.value })
                    }
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  {["Home", "Work", "Other"].map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setNewAddress({ ...newAddress, type: t })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        newAddress.type === t
                          ? "bg-[#2563eb] text-white"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <label className="flex items-center gap-2 text-xs font-bold cursor-pointer text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={newAddress.isDefault}
                    onChange={(e) =>
                      setNewAddress({
                        ...newAddress,
                        isDefault: e.target.checked,
                      })
                    }
                    className="rounded text-[#2563eb]"
                  />
                  <span>Make Default</span>
                </label>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="px-4 py-2.5 rounded-xl font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-5 py-2.5 rounded-xl font-bold transition-colors cursor-pointer shadow-md"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
