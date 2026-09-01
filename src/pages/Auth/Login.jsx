import React, { useState } from "react";
import {
<<<<<<< HEAD
  Link,
  useNavigate,
  useSearchParams,
  useLocation,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Eye, EyeOff, Lock, Mail, ArrowLeft } from "lucide-react";
import { loginUser, loginWithGoogle } from "../../redux/actions/authActions";
=======
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  ShoppingBag,
  Wrench,
  Calendar,
  Users,
  ShieldCheck,
  Heart,
  Zap,
  MapPin,
  Sparkles,
  Phone,
} from "lucide-react";
import { FaGoogle, FaFacebookF, FaApple } from "react-icons/fa";
import { useNavigate, useSearchParams, useLocation, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
>>>>>>> 9d38903e872714ab84df19b3829bd2415adc6673
import { useGoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { loginUser, loginWithGoogle } from "../../redux/actions/authActions";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const redirectTo =
    searchParams.get("redirect") ||
    (location.state?.from
      ? `${location.state.from.pathname}${location.state.from.search}${location.state.from.hash}`
      : "/");

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (codeResponse) => {
      try {
        await dispatch(loginWithGoogle(codeResponse.code, "user"));
        toast.success("Google Login Successful");
        navigate(redirectTo, { replace: true });
      } catch (error) {
        toast.error(error.response?.data?.message || "Google Login Failed");
      }
    },
    onError: () => toast.error("Google Auth Failed"),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);
      await dispatch(loginUser(formData));
      toast.success("Welcome back!");
      navigate(redirectTo, { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-8 max-w-md w-full shadow-xl space-y-6">
        {/* Brand Header */}
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#2563eb] flex items-center justify-center text-white font-black text-base">
              S
            </div>
            <span className="font-black text-lg text-slate-900 dark:text-white">
              ILUMAA<span className="text-[#2563eb]">Studio</span>
            </span>
          </Link>
          <Link
            to="/"
            className="text-xs font-semibold text-slate-500 hover:text-[#2563eb] flex items-center gap-1"
          >
            <ArrowLeft size={13} />
            <span>Home</span>
          </Link>
        </div>

        {/* Title */}
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Welcome Back
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Sign in to access your orders, wishlist and profile
          </p>
        </div>

        {/* Google OAuth Button */}
        <button
          onClick={() => handleGoogleLogin()}
          className="w-full py-2.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
        >
          <span>Sign in with Google</span>
        </button>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
          <span className="bg-white dark:bg-slate-900 px-3 text-[10px] text-slate-400 uppercase font-bold absolute">
            OR
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
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
                required
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none focus:border-[#2563eb]"
=======
    <div className="h-screen w-screen max-h-screen overflow-hidden bg-[#fbf9f5] font-sans text-slate-800 flex flex-col justify-between p-3 sm:p-4 lg:p-5 select-none">
      <div className="max-w-7xl mx-auto w-full h-full flex flex-col justify-between">
        
        {/* Top Header Bar */}
        <header className="flex items-center justify-between shrink-0 pb-1.5 mb-1 border-b border-slate-200/40">
          <Link to="/" className="flex items-center gap-2.5">
            {/* Multi-color connected community logo */}
            <div className="w-7 h-7 relative flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-0 left-2.5" />
              <span className="w-2 h-2 rounded-full bg-amber-500 absolute top-1.5 right-0" />
              <span className="w-2 h-2 rounded-full bg-teal-500 absolute bottom-0.5 right-0.5" />
              <span className="w-2 h-2 rounded-full bg-cyan-500 absolute bottom-0 left-2.5" />
              <span className="w-2 h-2 rounded-full bg-indigo-500 absolute bottom-0.5 left-0.5" />
              <span className="w-2 h-2 rounded-full bg-purple-500 absolute top-1.5 left-0" />
            </div>
            <div>
              <span className="text-xs font-black tracking-wider text-slate-900 block leading-tight">
                NEIGHBOURHOOD
              </span>
              <span className="text-[8px] font-bold tracking-[0.25em] text-slate-500 uppercase block">
                STUDIO
              </span>
            </div>
          </Link>

          <div className="text-right">
            <span className="text-xs font-bold text-slate-700 italic tracking-tight font-serif">
              Stronger Together,{" "}
              <span className="text-rose-500">Better Every Day.</span>
            </span>
          </div>
        </header>

        {/* 2-Column Main Layout - Flexible & Fit inside Viewport */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-center min-h-0 py-1">
          
          {/* Left Column: Community Showcase & Content */}
          <div className="lg:col-span-7 flex flex-col justify-between h-full max-h-full py-0.5 gap-3.5">
            {/* Hero Heading */}
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold tracking-tight leading-[1.08] mb-1.5">
                <span className="text-slate-900 inline mr-2.5">Connect.</span>
                <span className="text-[#e2694b] inline mr-2.5">Discover.</span>
                <span className="text-[#0f766e] inline">Belong.</span>
              </h1>
              <p className="text-slate-600 text-xs sm:text-sm font-medium max-w-xl leading-relaxed">
                Your neighbourhood, one platform. Buy, sell, book services, join events, and build real connections.
              </p>
            </div>

            {/* Large Prominent Street Illustration */}
            <div className="flex-1 min-h-[260px] sm:min-h-[320px] lg:min-h-[380px] rounded-3xl overflow-hidden border border-slate-200/90 shadow-md bg-white relative group">
              <img
                src="/neighbourhood_street.jpg"
                alt="Neighbourhood Street Life"
                className="w-full h-full object-cover rounded-3xl transition-transform duration-500 group-hover:scale-[1.01]"
>>>>>>> 9d38903e872714ab84df19b3829bd2415adc6673
              />
            </div>

            {/* Dark Green Community Quote Banner */}
            <div className="bg-[#1b4332] text-white px-5 py-3 rounded-2xl flex items-center justify-between shadow-xs shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="text-lg text-emerald-400 font-serif leading-none">“</span>
                <p className="text-xs sm:text-sm font-semibold text-emerald-50 italic">
                  Great things happen when neighbours connect.
                </p>
              </div>
              <div className="text-base text-emerald-300 opacity-70">♡</div>
            </div>
          </div>

<<<<<<< HEAD
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-[11px] font-bold text-[#2563eb]"
              >
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full pl-9 pr-9 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none focus:border-[#2563eb]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
=======
          {/* Right Column: Login Card + Promo Feature Card */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full max-h-full py-0.5 gap-3">
            {/* Main Elevated White Login Card */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-lg shadow-slate-200/40 p-5 sm:p-6 flex flex-col justify-between">
              {/* Top Village Line Illustration */}
              <div className="flex flex-col items-center text-center mb-3">
                <div className="w-12 h-6 rounded-t-full bg-teal-50 border-b-2 border-teal-600/40 flex items-center justify-center mb-1">
                  <span className="text-[11px]">🏘️</span>
                </div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-1">
                  Welcome Back! <span className="text-teal-600 font-normal text-sm">♡</span>
                </h2>
                <p className="text-[11px] text-slate-500 font-medium">
                  Log in to explore your neighbourhood
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-2.5">
                {/* Email / Phone Field */}
                <div>
                  <div className="relative flex items-center bg-slate-50 focus-within:bg-white border border-slate-200 focus-within:border-teal-600 focus-within:ring-2 focus-within:ring-teal-600/15 rounded-xl px-3.5 py-2.5 transition-all">
                    <Mail size={14} className="text-slate-400 mr-2.5 shrink-0" />
                    <input
                      type="text"
                      name="email"
                      required
                      placeholder="Email or Phone Number"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 outline-none font-medium"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div className="relative flex items-center bg-slate-50 focus-within:bg-white border border-slate-200 focus-within:border-teal-600 focus-within:ring-2 focus-within:ring-teal-600/15 rounded-xl px-3.5 py-2.5 transition-all">
                    <Lock size={14} className="text-slate-400 mr-2.5 shrink-0" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      required
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 outline-none font-medium pr-7"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 text-slate-400 hover:text-slate-600 transition cursor-pointer p-0.5"
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between text-[11px] pt-0.5 px-0.5">
                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-600 select-none font-medium">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-3.5 h-3.5 rounded border-slate-300 text-[#0f766e] focus:ring-[#0f766e] accent-[#0f766e] cursor-pointer"
                    />
                    Remember me
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-[#0f766e] hover:text-teal-800 font-bold transition"
                  >
                    Forgot Password?
                  </Link>
                </div>

                {/* Log In Submit Button */}
                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#136f63] hover:bg-[#0f5c52] active:scale-[0.99] text-white font-bold py-2.5 px-4 rounded-xl shadow-md shadow-teal-700/20 hover:shadow-teal-700/30 transition-all duration-200 flex items-center justify-center gap-1.5 text-xs cursor-pointer disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      <>
                        Log In <ArrowRight size={14} />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Social Login Divider */}
              <div className="relative flex items-center justify-center my-3">
                <div className="w-full border-t border-slate-200" />
                <span className="bg-white px-2.5 text-[10px] font-medium text-slate-400 tracking-wider absolute">
                  or continue with
                </span>
              </div>

              {/* 4 Social OAuth Options */}
              <div className="grid grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => handleGoogleLogin()}
                  className="py-2 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 transition shadow-2xs cursor-pointer"
                  title="Sign in with Google"
                >
                  <FaGoogle className="text-rose-500" size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => toast.success("Facebook Authentication Ready")}
                  className="py-2 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 transition shadow-2xs cursor-pointer"
                  title="Sign in with Facebook"
                >
                  <FaFacebookF className="text-blue-600" size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => toast.success("Apple Authentication Ready")}
                  className="py-2 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-900 transition shadow-2xs cursor-pointer"
                  title="Sign in with Apple"
                >
                  <FaApple size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => toast.success("SMS / OTP Verification Ready")}
                  className="py-2 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 flex items-center justify-center text-teal-600 transition shadow-2xs cursor-pointer"
                  title="Sign in with Phone OTP"
                >
                  <Phone size={13} />
                </button>
              </div>

              {/* Create Account Link */}
              <div className="text-center text-[11px] text-slate-500 mt-3 font-medium">
                New here?{" "}
                <Link
                  to="/register"
                  className="font-bold text-[#0f766e] hover:text-teal-800 hover:underline transition"
                >
                  Create an account
                </Link>
              </div>
            </div>

            {/* Lower Promo Card: Explore. Engage. Empower. */}
            <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-pink-50 border border-purple-100/80 rounded-2xl p-3 sm:p-3.5 shadow-2xs flex items-center gap-3 shrink-0">
              <div className="flex-1 min-w-0">
                <h3 className="text-xs font-extrabold text-slate-900 mb-0.5 truncate">
                  Explore. Engage. Empower.
                </h3>
                <p className="text-[10px] text-slate-600 leading-snug mb-2 line-clamp-2">
                  From everyday essentials to meaningful connections – right in your neighbourhood.
                </p>
                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="bg-[#6d28d9] hover:bg-[#5b21b6] text-white text-[10px] font-bold px-3 py-1 rounded-lg shadow-2xs flex items-center gap-1 transition cursor-pointer"
                >
                  Learn More <ArrowRight size={11} />
                </button>
              </div>
              <div className="w-16 h-16 shrink-0 rounded-xl overflow-hidden border border-purple-200/50">
                <img
                  src="/neighbourhood_banner.jpg"
                  alt="Connected Community"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Feature Propositions Footer */}
        <footer className="grid grid-cols-4 gap-2 shrink-0 pt-2 border-t border-slate-200/70">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center shrink-0">
              <ShieldCheck size={14} />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-bold text-slate-800 block truncate">Safe & Secure</span>
              <span className="text-[9px] text-slate-500 block truncate">Verified</span>
>>>>>>> 9d38903e872714ab84df19b3829bd2415adc6673
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
              <Heart size={14} />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-bold text-slate-800 block truncate">Local First</span>
              <span className="text-[9px] text-slate-500 block truncate">Support</span>
            </div>
          </div>

<<<<<<< HEAD
        <div className="text-center text-xs text-slate-500 dark:text-slate-400">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-bold text-[#2563eb] hover:underline"
          >
            Create Account
          </Link>
        </div>
=======
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
              <Zap size={14} />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-bold text-slate-800 block truncate">Easy & Smart</span>
              <span className="text-[9px] text-slate-500 block truncate">One app</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center shrink-0">
              <MapPin size={14} />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-bold text-slate-800 block truncate">Always Near</span>
              <span className="text-[9px] text-slate-500 block truncate">In neighbourhood</span>
            </div>
          </div>
        </footer>

>>>>>>> 9d38903e872714ab84df19b3829bd2415adc6673
      </div>
    </div>
  );
}
