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
  Gift,
  Copy,
  Award,
  RefreshCw,
  Edit3,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { logoutUser } from "../../redux/actions/authActions.js";
import {
  getProfile,
  updateProfile,
  getAddresses,
  addAddress as apiAddAddress,
  updateAddress as apiUpdateAddress,
  deleteAddress as apiDeleteAddress,
  setDefaultAddress as apiSetDefaultAddress,
} from "../../api/profileService.js";
import { getMyOrders } from "../../api/orderService";
import { getBookings } from "../../api/bookingService";
import {
  getLoyaltyAccount,
  getLoyaltyTransactions,
  getReferrals,
  getActiveRewards,
  redeemReward,
  getMyRedemptions,
} from "../../api/loyaltyService";
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

  const [activeTab, setActiveTab] = useState("profile"); // 'profile' | 'loyalty' | 'orders' | 'bookings' | 'addresses' | 'security'
  const [profileData, setProfileData] = useState(null);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [customerBookings, setCustomerBookings] = useState([]);
  const [addresses, setAddresses] = useState(INITIAL_FALLBACK_ADDRESSES);

  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Loyalty System state
  const [loyaltyAccount, setLoyaltyAccount] = useState(null);
  const [loyaltyTx, setLoyaltyTx] = useState([]);
  const [referralsInfo, setReferralsInfo] = useState(null);
  const [rewardsList, setRewardsList] = useState([]);
  const [myRedemptions, setMyRedemptions] = useState([]);
  const [loadingLoyalty, setLoadingLoyalty] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [redeemingId, setRedeemingId] = useState(null);

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

  const fetchLoyaltyData = async () => {
    try {
      setLoadingLoyalty(true);
      const [acc, txRes, refRes, rewRes, redRes] = await Promise.all([
        getLoyaltyAccount(),
        getLoyaltyTransactions(),
        getReferrals(),
        getActiveRewards(),
        getMyRedemptions(),
      ]);
      setLoyaltyAccount(acc);
      setLoyaltyTx(Array.isArray(txRes) ? txRes : txRes.transactions || []);
      setReferralsInfo(refRes);
      setRewardsList(Array.isArray(rewRes) ? rewRes : []);
      setMyRedemptions(Array.isArray(redRes) ? redRes : []);
    } catch (err) {
      console.error("Error loading loyalty data:", err);
    } finally {
      setLoadingLoyalty(false);
    }
  };

  const handleRedeemRewardAction = async (rewardId) => {
    try {
      setRedeemingId(rewardId);
      const res = await redeemReward(rewardId);
      toast.success(res.message || "Reward redeemed successfully!");
      fetchLoyaltyData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to redeem reward");
    } finally {
      setRedeemingId(null);
    }
  };

  const handleCopyCode = (code) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    toast.success("Referral code copied to clipboard!");
    setTimeout(() => setCopiedCode(false), 2000);
  };

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
    fetchLoyaltyData();
  }, [user]);

  useEffect(() => {
    if (activeTab === "loyalty") {
      fetchLoyaltyData();
    }
  }, [activeTab]);

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

  const [editingAddressId, setEditingAddressId] = useState(null);

  // Address Actions
  const handleEditAddressInit = (addr) => {
    setEditingAddressId(addr._id);
    setNewAddress({
      fullName: addr.fullName || user?.name || "",
      phone: addr.phone || user?.phone || "",
      street: addr.street || "",
      city: addr.city || "Lucknow",
      state: addr.state || "Uttar Pradesh",
      pincode: addr.pincode || addr.zip || "",
      type: addr.type || "Home",
      isDefault: !!addr.isDefault,
    });
    setShowAddressModal(true);
  };

  const handleAddAddressSubmit = async (e) => {
    e.preventDefault();
    if (!newAddress.street || !newAddress.pincode || !newAddress.phone) {
      toast.error("Please fill in all required address fields");
      return;
    }

    try {
      if (editingAddressId) {
        await apiUpdateAddress(editingAddressId, newAddress);
        setAddresses((prev) =>
          prev.map((a) =>
            a._id === editingAddressId
              ? { ...a, ...newAddress }
              : newAddress.isDefault
              ? { ...a, isDefault: false }
              : a
          )
        );
        toast.success("Address updated successfully!");
      } else {
        const res = await apiAddAddress(newAddress);
        const createdAddr = {
          _id: res?._id || `addr_${Date.now()}`,
          ...newAddress,
        };

        setAddresses((prev) => {
          let updated = [...prev];
          if (newAddress.isDefault) {
            updated = updated.map((a) => ({ ...a, isDefault: false }));
          }
          return [createdAddr, ...updated];
        });
        toast.success("Address saved successfully!");
      }
    } catch (err) {
      console.error("Address save error:", err);
      toast.error(err.response?.data?.message || "Failed to save address");
    } finally {
      setShowAddressModal(false);
      setEditingAddressId(null);
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
    }
  };

  const handleSetDefaultAddress = async (id) => {
    try {
      await apiSetDefaultAddress(id);
      setAddresses((prev) =>
        prev.map((a) => ({ ...a, isDefault: a._id === id }))
      );
      toast.success("Default address updated!");
    } catch (err) {
      console.error("Set default error:", err);
      toast.error(err.response?.data?.message || "Failed to update default address");
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      await apiDeleteAddress(id);
      setAddresses((prev) => prev.filter((a) => a._id !== id));
      toast.success("Address removed!");
    } catch (err) {
      console.error("Delete address error:", err);
      toast.error(err.response?.data?.message || "Failed to remove address");
    }
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
                id: "loyalty",
                label: "Loyalty & Rewards",
                icon: <Gift size={16} />,
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

            {/* TAB: LOYALTY & REWARDS */}
            {activeTab === "loyalty" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div>
                    <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <Gift className="text-[#2563eb]" size={20} />
                      Loyalty Points & Platform Rewards
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Earn points on purchases and referrals, share your code, and redeem rewards
                    </p>
                  </div>
                  <button
                    onClick={fetchLoyaltyData}
                    className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl transition cursor-pointer"
                  >
                    <RefreshCw size={16} className={loadingLoyalty ? "animate-spin" : ""} />
                  </button>
                </div>

                {/* Loyalty Balance Banner Card */}
                <div className="bg-gradient-to-tr from-slate-900 via-[#1e293b] to-[#2563eb] rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-6 relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-blue-300 text-xs font-black uppercase tracking-widest">
                        <Award size={16} /> Total Loyalty Points
                      </div>
                      <div className="text-4xl sm:text-5xl font-black tracking-tight text-white flex items-baseline gap-2">
                        {(loyaltyAccount?.loyaltyPoint ?? 100).toLocaleString("en-IN")}
                        <span className="text-sm font-bold text-blue-300">PTS</span>
                      </div>
                    </div>

                    {/* Referral Code Container */}
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-5 text-left w-full sm:w-auto">
                      <p className="text-[10px] font-black uppercase tracking-widest text-blue-200 mb-1">
                        Your Unique Referral Code
                      </p>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xl font-black tracking-widest text-white">
                          {loyaltyAccount?.referralCode || "..."}
                        </span>
                        <button
                          onClick={() => handleCopyCode(loyaltyAccount?.referralCode)}
                          className="bg-white text-[#2563eb] hover:bg-blue-50 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow"
                        >
                          {copiedCode ? <Check size={14} /> : <Copy size={14} />}
                          {copiedCode ? "Copied" : "Copy"}
                        </button>
                      </div>
                      <p className="text-[10px] text-blue-100 mt-1.5 font-medium">
                        Share this code: Both you & your friend get <strong className="text-white">+50 Points</strong> on qualifying purchase!
                      </p>
                    </div>
                  </div>
                </div>

                {/* Redeemable Rewards Grid */}
                <div className="space-y-3">
                  <h3 className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                    Available Rewards
                  </h3>
                  {rewardsList.length === 0 ? (
                    <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 text-center text-xs text-slate-500">
                      No active platform rewards available right now.
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 gap-4">
                      {rewardsList.map((reward) => {
                        const userPoints = loyaltyAccount?.loyaltyPoint ?? 0;
                        const isEligible = userPoints >= reward.requiredPoints;

                        return (
                          <div
                            key={reward._id}
                            className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                              isEligible
                                ? "bg-white dark:bg-slate-800 border-blue-200 dark:border-blue-700/60 shadow-xs"
                                : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/40"
                            }`}
                          >
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-[#2563eb] border border-blue-200 dark:border-blue-800">
                                  {reward.rewardType.replace(/_/g, " ")}
                                </span>
                                <span className="text-xs font-black text-blue-600 dark:text-blue-400">
                                  {reward.requiredPoints.toLocaleString("en-IN")} PTS
                                </span>
                              </div>
                              <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">
                                {reward.name}
                              </h4>
                              {reward.description && (
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                  {reward.description}
                                </p>
                              )}
                            </div>

                            <button
                              onClick={() => handleRedeemRewardAction(reward._id)}
                              disabled={!isEligible || redeemingId === reward._id}
                              className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-1.5 cursor-pointer ${
                                isEligible
                                  ? "bg-[#2563eb] hover:bg-[#1d4ed8] text-white shadow-md shadow-blue-500/20"
                                  : "bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed"
                              }`}
                            >
                              {redeemingId === reward._id ? (
                                <RefreshCw size={14} className="animate-spin" />
                              ) : isEligible ? (
                                "Redeem Reward"
                              ) : (
                                `Requires ${reward.requiredPoints} Points`
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* My Redeemed Vouchers */}
                {myRedemptions.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                      My Redeemed Vouchers
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {myRedemptions.map((red) => (
                        <div
                          key={red._id}
                          className="p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20 flex items-center justify-between"
                        >
                          <div>
                            <p className="text-xs font-bold text-slate-900 dark:text-white">
                              {red.reward?.name || "Redeemed Reward"}
                            </p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                              Code: <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{red.code}</span>
                            </p>
                          </div>
                          <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                            {red.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Points Transaction History */}
                <div className="space-y-3">
                  <h3 className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                    Points Transaction History
                  </h3>
                  {loyaltyTx.length === 0 ? (
                    <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 text-center text-xs text-slate-500">
                      No points transactions recorded yet.
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200/80 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 overflow-hidden">
                      {loyaltyTx.map((tx) => (
                        <div key={tx._id} className="p-4 flex items-center justify-between text-xs">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                                  tx.source === "WELCOME_BONUS"
                                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
                                    : tx.source === "REFERRAL"
                                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                    : tx.source === "REWARD_REDEEM"
                                    ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                                    : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                }`}
                              >
                                {tx.source.replace(/_/g, " ")}
                              </span>
                              <span className="text-[10px] text-slate-400 font-semibold">
                                {new Date(tx.createdAt).toLocaleDateString("en-IN")}
                              </span>
                            </div>
                            <p className="font-bold text-slate-800 dark:text-slate-200">{tx.description}</p>
                          </div>

                          <span
                            className={`font-black text-sm ${
                              tx.points > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
                            }`}
                          >
                            {tx.points > 0 ? `+${tx.points}` : tx.points} PTS
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Referral Activity Summary */}
                {referralsInfo && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                      My Referral Activity
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Successful</p>
                        <p className="text-xl font-black text-slate-900 dark:text-white mt-1">{referralsInfo.successfulCount || 0}</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Pending</p>
                        <p className="text-xl font-black text-slate-900 dark:text-white mt-1">{referralsInfo.pendingCount || 0}</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-center col-span-2 sm:col-span-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Total Referral Earned</p>
                        <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1">+{referralsInfo.totalEarned || 0} PTS</p>
                      </div>
                    </div>
                  </div>
                )}
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
                          type="button"
                          onClick={() => handleEditAddressInit(addr)}
                          className="flex items-center gap-1 text-[#2563eb] hover:text-[#1d4ed8] text-[11px] font-bold cursor-pointer"
                        >
                          <Edit3 size={12} />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
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

      {/* ADD / EDIT ADDRESS MODAL */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-lg space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <MapPin size={18} className="text-[#2563eb]" />
                <span>{editingAddressId ? "Edit Delivery Address" : "Add New Delivery Address"}</span>
              </h3>
              <button
                onClick={() => {
                  setShowAddressModal(false);
                  setEditingAddressId(null);
                }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddAddressSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Full Name <span className="text-red-500">*</span>
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
                    Mobile Number <span className="text-red-500">*</span>
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
                  Street Address / House No. / Area <span className="text-red-500">*</span>
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
                    City <span className="text-red-500">*</span>
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
                    State <span className="text-red-500">*</span>
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
                    6-Digit Pincode <span className="text-red-500">*</span>
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
                    className="accent-[#2563eb] w-3.5 h-3.5"
                  />
                  <span>Set as default</span>
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddressModal(false);
                    setEditingAddressId(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#2563eb] hover:bg-[#1d4ed8] cursor-pointer shadow-xs"
                >
                  {editingAddressId ? "Save Changes" : "Save Address"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
