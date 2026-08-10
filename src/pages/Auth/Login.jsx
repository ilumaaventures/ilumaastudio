import React, { useState } from "react";
import { Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Eye, EyeOff, Lock, Mail, ArrowLeft } from "lucide-react";
import { loginUser, loginWithGoogle } from "../../redux/actions/authActions";
import { useGoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const redirectTo = searchParams.get("redirect") || (location.state?.from
    ? `${location.state.from.pathname}${location.state.from.search}${location.state.from.hash}`
    : "/");

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-8 max-w-md w-full shadow-xl space-y-6">
        
        {/* Brand Header */}
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#2563eb] flex items-center justify-center text-white font-black text-base">
              S
            </div>
            <span className="font-black text-lg text-slate-900 dark:text-white">
              ILumaa<span className="text-[#2563eb]">Studio</span>
            </span>
          </Link>
          <Link to="/" className="text-xs font-semibold text-slate-500 hover:text-[#2563eb] flex items-center gap-1">
            <ArrowLeft size={13} />
            <span>Home</span>
          </Link>
        </div>

        {/* Title */}
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Welcome Back</h1>
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
          <span className="bg-white dark:bg-slate-900 px-3 text-[10px] text-slate-400 uppercase font-bold absolute">OR</span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none focus:border-[#2563eb]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-700 dark:text-slate-300">Password</label>
              <Link to="/forgot-password" className="text-[11px] font-bold text-[#2563eb]">Forgot?</Link>
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-9 pr-9 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none focus:border-[#2563eb]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-md shadow-blue-500/20 cursor-pointer"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 dark:text-slate-400">
          Don't have an account?{" "}
          <Link to="/register" className="font-bold text-[#2563eb] hover:underline">
            Create Account
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;
