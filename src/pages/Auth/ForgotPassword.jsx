import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Lock, Mail, CheckCircle2, KeyRound } from "lucide-react";
import { toast } from "react-hot-toast";
import { forgotPassword, verifyOTP, resetPassword } from "../../api/authService";

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (step === 1) {
        if (!formData.email) {
          toast.error("Please enter your registered email");
          setLoading(false);
          return;
        }
        await forgotPassword(formData.email);
        toast.success("Verification code sent to your email!");
        setStep(2);
      } else if (step === 2) {
        if (!formData.otp) {
          toast.error("Please enter the 6-digit OTP code");
          setLoading(false);
          return;
        }
        await verifyOTP(formData.email, formData.otp);
        toast.success("OTP Verified Successfully!");
        setStep(3);
      } else {
        if (formData.password.length < 6) {
          toast.error("Password must be at least 6 characters");
          setLoading(false);
          return;
        }
        if (formData.password !== formData.confirmPassword) {
          toast.error("Passwords do not match");
          setLoading(false);
          return;
        }
        await resetPassword(formData.email, formData.password);
        toast.success("Password reset successfully!");
        setSuccess(true);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex items-center justify-center p-4 lg:p-8 font-sans transition-colors">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden grid lg:grid-cols-12">
        
        {/* Left Side Visual Banner */}
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

          {/* Banner Copy */}
          <div className="relative z-10 space-y-4 my-auto py-12">
            <span className="inline-block px-3 py-1 bg-white/15 text-blue-100 text-[10px] font-extrabold uppercase tracking-widest rounded-full backdrop-blur-sm">
              Account Recovery
            </span>
            <h2 className="text-3xl font-black leading-tight tracking-tight text-white">
              Securing Your Account Made Simple
            </h2>
            <p className="text-xs text-blue-100/90 leading-relaxed font-medium">
              Enter your registered email address and we'll guide you through resetting your password safely.
            </p>
          </div>

          <div className="relative z-10 pt-6 border-t border-white/15 flex items-center gap-2 text-xs font-semibold text-blue-100">
            <ShieldCheck size={16} className="text-blue-200" />
            <span>Encrypted Verification</span>
          </div>
        </div>

        {/* Right Side Step Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
          
          <div className="flex items-center justify-between">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#2563eb] transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Back to Login</span>
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

          {!success ? (
            <div className="space-y-6">
              {/* Header Title */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 1 ? "bg-[#2563eb] text-white" : "bg-slate-200 text-slate-500"}`}>1</span>
                  <span className="text-slate-300">•</span>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 2 ? "bg-[#2563eb] text-white" : "bg-slate-200 text-slate-500"}`}>2</span>
                  <span className="text-slate-300">•</span>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 3 ? "bg-[#2563eb] text-white" : "bg-slate-200 text-slate-500"}`}>3</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                  {step === 1 ? "Forgot Password?" : step === 2 ? "Enter Verification Code" : "Set New Password"}
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {step === 1
                    ? "Enter your email address to receive a 6-digit verification code"
                    : step === 2
                    ? `Enter the code sent to ${formData.email}`
                    : "Create a strong new password for your account"}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {/* STEP 1: EMAIL */}
                {step === 1 && (
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px]">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-[#2563eb] transition-colors text-slate-900 dark:text-white font-medium"
                      />
                    </div>
                  </div>
                )}

                {/* STEP 2: OTP */}
                {step === 2 && (
                  <div className="space-y-2">
                    <label className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px]">
                      6-Digit OTP Code
                    </label>
                    <div className="relative">
                      <KeyRound size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        name="otp"
                        maxLength={6}
                        required
                        placeholder="123456"
                        value={formData.otp}
                        onChange={handleChange}
                        className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-[#2563eb] transition-colors text-slate-900 dark:text-white font-mono font-bold tracking-widest text-sm"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => toast.success("OTP code re-sent!")}
                        className="text-[11px] font-bold text-[#2563eb] hover:underline cursor-pointer"
                      >
                        Resend OTP Code
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: NEW PASSWORD */}
                {step === 3 && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px]">
                        New Password
                      </label>
                      <div className="relative">
                        <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="password"
                          name="password"
                          required
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={handleChange}
                          className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-[#2563eb] transition-colors text-slate-900 dark:text-white font-medium"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px]">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="password"
                          name="confirmPassword"
                          required
                          placeholder="••••••••"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-[#2563eb] transition-colors text-slate-900 dark:text-white font-medium"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white py-3 rounded-xl font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer text-center"
                >
                  {loading
                    ? "Processing..."
                    : step === 1
                    ? "Send Verification Code"
                    : step === 2
                    ? "Verify Code"
                    : "Reset Password"}
                </button>
              </form>
            </div>
          ) : (
            <div className="my-auto py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 size={36} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                Password Reset Successful!
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto font-medium leading-relaxed">
                Your password has been updated successfully. You can now log in with your new password.
              </p>
              <div className="pt-2">
                <Link
                  to="/login"
                  className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-6 py-2.5 rounded-xl text-xs font-bold inline-block shadow-md transition-colors"
                >
                  Proceed to Login
                </Link>
              </div>
            </div>
          )}

          <div className="text-center text-xs pt-4 border-t border-slate-100 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400">Remember your password? </span>
            <Link to="/login" className="text-[#2563eb] font-bold hover:underline">
              Log in
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ForgotPassword;
