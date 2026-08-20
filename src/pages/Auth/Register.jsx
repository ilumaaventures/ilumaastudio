import React, { useState } from "react";
import { FaGoogle, FaApple } from "react-icons/fa";
import { User, Mail, Phone, Lock, Eye, EyeOff, ArrowLeft, ShieldCheck, CheckCircle2, Gift } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { registerUser } from "../../redux/actions/authActions";
import toast from "react-hot-toast";
import { sendOTP as sendOTPApi, verifyOTP as verifyOTPApi } from "../../api/authService";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    referralCode: "",
  });

  const [sendingOTP, setSendingOTP] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [verifyingOTP, setVerifyingOTP] = useState(false);
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const [startTimer, setStartTimer] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const startOtpTimer = () => {
    setTimer(60);
    setStartTimer(true);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setStartTimer(false);
          return 60;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOTP = async () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error("Please enter your Full Name and Email Address first");
      return;
    }
    if (!isValidEmail(formData.email.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      setSendingOTP(true);
      const res = await sendOTPApi(formData.name.trim(), formData.email.trim());
      setOtpSent(true);
      startOtpTimer();
      toast.success(res?.message || `OTP sent to ${formData.email}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setSendingOTP(false);
    }
  };

  const handleVerifyEmail = async () => {
    if (!otp.trim() || otp.trim().length !== 6) {
      toast.error("Please enter the 6-digit OTP sent to your email");
      return;
    }
    try {
      setVerifyingOTP(true);
      await verifyOTPApi(formData.email.trim(), otp.trim());
      setEmailVerified(true);
      toast.success("Email verified successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setVerifyingOTP(false);
    }
  };

  const getPasswordQuality = (password) => {
    if (!password) return null;
    if (password.length < 6) return { level: "Weak", color: "text-red-500", text: "Too short (min 6 chars)" };
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    if (hasLetter && (hasNumber || hasSymbol) && password.length >= 8) {
      return { level: "Strong", color: "text-emerald-600 dark:text-emerald-400", text: "High Quality (Strong)" };
    } else if (hasLetter && (hasNumber || hasSymbol)) {
      return { level: "Good", color: "text-blue-600 dark:text-blue-400", text: "High Quality (Good)" };
    } else {
      return { level: "Moderate", color: "text-amber-500", text: "Add numbers or special characters" };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!emailVerified) {
      toast.error("Please verify your email address with OTP before creating account");
      return;
    }

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.password
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    try {
      setIsSubmitting(true);
      await dispatch(
        registerUser({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          password: formData.password,
          referralCode: formData.referralCode.trim().toUpperCase(),
        })
      );
      toast.success("Registration Successful!");
      navigate(searchParams.get("redirect") || "/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex items-center justify-center p-4 lg:p-8 font-sans transition-colors">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden grid lg:grid-cols-12">
        
        {/* Left Side: Brand Visual Card */}
        <div className="hidden lg:col-span-5 bg-gradient-to-tr from-[#1e293b] via-[#2563eb] to-[#3b82f6] p-8 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-16 -left-16 w-56 h-56 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-blue-400/20 rounded-full blur-2xl pointer-events-none" />

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 relative z-10">
            <div className="w-9 h-9 rounded-xl bg-white text-[#2563eb] flex items-center justify-center font-black text-xl shadow-md">
              S
            </div>
            <span className="font-black text-xl tracking-tight text-white">
              ILUMAA<span className="text-blue-200">Studio</span>
            </span>
          </Link>

          {/* Center Promo Copy */}
          <div className="relative z-10 space-y-4 my-auto py-12">
            <span className="inline-block px-3 py-1 bg-white/15 text-blue-100 text-[10px] font-extrabold uppercase tracking-widest rounded-full backdrop-blur-sm">
              Join Our Platform
            </span>
            <h2 className="text-3xl font-black leading-tight tracking-tight text-white">
              Unlock Exclusive Rewards & Instant Perks
            </h2>
            <p className="text-xs text-blue-100/90 leading-relaxed font-medium">
              Create your account to automatically receive 100 welcome loyalty points, earn referral rewards, and track orders across ILumaaStudio.
            </p>
          </div>

          {/* Bottom Feature Badges */}
          <div className="relative z-10 pt-6 border-t border-white/15 flex items-center gap-4 text-xs font-semibold text-blue-100">
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-blue-200" />
              <span>100% Secure</span>
            </div>
            <span className="opacity-40">•</span>
            <span>Global Rewards</span>
          </div>
        </div>

        {/* Right Side: Registration Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#2563eb] transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Back to Home</span>
            </Link>
            
            {/* Mobile Brand Logo */}
            <div className="lg:hidden flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#2563eb] text-white flex items-center justify-center font-black text-sm">
                S
              </div>
              <span className="font-black text-sm text-slate-900 dark:text-white">
                ILUMAA<span className="text-[#2563eb]">Studio</span>
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Create Account
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Fill in your details below to register your ILumaaStudio account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Full Name */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px]">
                Full Name *
              </label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={emailVerified}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-[#2563eb] transition-colors text-slate-900 dark:text-white font-medium"
                />
              </div>
            </div>

            {/* Email Address & Inline Send OTP */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px]">
                Email Address *
              </label>
              <div className="flex gap-2 items-center">
                <div className="relative flex-1">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={emailVerified}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-[#2563eb] transition-colors text-slate-900 dark:text-white font-medium"
                  />
                </div>
                {!emailVerified && (
                  <button
                    type="button"
                    onClick={handleSendOTP}
                    disabled={sendingOTP || startTimer}
                    className="px-4 py-2.5 bg-[#2563eb] hover:bg-[#1d4ed8] disabled:opacity-50 text-white rounded-xl text-xs font-bold shrink-0 transition shadow-sm cursor-pointer whitespace-nowrap"
                  >
                    {sendingOTP
                      ? "Sending..."
                      : startTimer
                      ? `Resend (${timer}s)`
                      : otpSent
                      ? "Resend OTP"
                      : "Send OTP"}
                  </button>
                )}
                {emailVerified && (
                  <div className="flex items-center gap-1 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-2.5 rounded-xl shrink-0">
                    <CheckCircle2 size={16} /> Verified
                  </div>
                )}
              </div>
            </div>

            {/* OTP Verification Block */}
            {otpSent && !emailVerified && (
              <div className="p-3.5 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-2xl space-y-2.5 animate-fadeIn">
                <label className="block text-xs font-bold text-blue-900 dark:text-blue-200 uppercase tracking-wider">
                  Enter 6-Digit OTP Sent to Email
                </label>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    maxLength={6}
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full border border-blue-300 dark:border-blue-700 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 transition bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono tracking-widest text-center font-bold"
                  />
                  <button
                    onClick={handleVerifyEmail}
                    type="button"
                    disabled={verifyingOTP}
                    className="px-4 py-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-xl text-xs font-bold shrink-0 shadow transition cursor-pointer"
                  >
                    {verifyingOTP ? "Verifying..." : "Verify OTP"}
                  </button>
                </div>
              </div>
            )}

            {/* Secondary Form Fields (Visible once Email Verified) */}
            {emailVerified && (
              <div className="space-y-4 pt-1 animate-fadeIn">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Mobile Number */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px]">
                      Mobile Number *
                    </label>
                    <div className="relative">
                      <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="tel"
                        name="phone"
                        required
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-[#2563eb] transition-colors text-slate-900 dark:text-white font-medium"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px]">
                      Password *
                    </label>
                    <div className="relative">
                      <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        required
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full pl-9 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-[#2563eb] transition-colors text-slate-900 dark:text-white font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                      >
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                    {formData.password && (
                      <p className={`text-[10px] font-bold mt-1 ${getPasswordQuality(formData.password)?.color}`}>
                        Quality: {getPasswordQuality(formData.password)?.text}
                      </p>
                    )}
                  </div>
                </div>

                {/* Referral Code */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px] flex items-center justify-between">
                    <span>Referral Code (Optional)</span>
                    <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1">
                      <Gift size={12} /> Earn 50 Loyalty Points
                    </span>
                  </label>
                  <input
                    type="text"
                    name="referralCode"
                    placeholder="e.g. ADITYA50"
                    value={formData.referralCode}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-[#2563eb] transition-colors text-slate-900 dark:text-white font-mono uppercase tracking-wider font-bold"
                  />
                  <p className="text-[11px] text-slate-400 font-medium">
                    Entering a valid friend's referral code earns both of you +50 bonus loyalty points after your first purchase!
                  </p>
                </div>
              </div>
            )}

            {/* Single Submit Button */}
            <div className="pt-2">
              {emailVerified ? (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white py-3 rounded-xl font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer text-center"
                >
                  {isSubmitting ? "Creating Account..." : "Create Account"}
                </button>
              ) : (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl text-center text-xs font-bold text-amber-800 dark:text-amber-300">
                  Please click "Send OTP" above and verify your email to unlock registration.
                </div>
              )}
            </div>
          </form>

          {/* Social Logins */}
          <div className="space-y-4 pt-2">
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800" />
              </div>
              <span className="relative px-3 bg-white dark:bg-slate-900 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Or Sign Up With
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex items-center justify-center gap-2 py-2.5 px-4 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
              >
                <FaGoogle className="text-red-500" size={14} />
                <span>Google</span>
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 py-2.5 px-4 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
              >
                <FaApple className="text-slate-900 dark:text-white" size={15} />
                <span>Apple</span>
              </button>
            </div>
          </div>

          {/* Footer Links */}
          <div className="text-center text-xs space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800">
            <p className="text-slate-500 dark:text-slate-400">
              Already have an account?{" "}
              <Link to="/login" className="text-[#2563eb] font-bold hover:underline">
                Log in
              </Link>
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-[11px]">
              Want to sell on ILumaaStudio?{" "}
              <Link to="/businessRegistration" className="text-[#2563eb] font-bold hover:underline">
                Register Business
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Register;
