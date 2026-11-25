import React, { useState, useEffect, useMemo } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  X,
  ShieldCheck,
  Lock,
  CreditCard,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { verifyStripePayment } from "../../api/paymentApi";
import toast from "react-hot-toast";

/**
 * Internal Stripe Payment Form inside the Elements wrapper
 */
function StripeCheckoutForm({
  order,
  clientSecret,
  paymentId,
  onSuccess,
  onClose,
}) {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isReady, setIsReady] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      // Confirm payment with redirect: 'if_required' for seamless inline 3DS & card confirmation
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
        confirmParams: {
          return_url: `${window.location.origin}/cart?step=success&orderId=${order?._id || ""}`,
          receipt_email: order?.shippingAddress?.email || undefined,
        },
      });

      if (error) {
        // Show human-readable error from Stripe
        console.error("[StripeCheckout] Payment confirmation error:", error);
        setErrorMessage(
          error.message ||
            "Your payment could not be processed. Please check your card details and try again."
        );
        toast.error(error.message || "Payment authorization failed");
        setLoading(false);
        return;
      }

      if (paymentIntent && (paymentIntent.status === "succeeded" || paymentIntent.status === "processing")) {
        // Call backend verification to update Order and Payment documents and trigger shipment
        try {
          const verifyRes = await verifyStripePayment({
            paymentIntentId: paymentIntent.id,
            orderId: order?._id,
            paymentId: paymentId || null,
          });

          toast.success("Payment confirmed successfully!");
          onSuccess(verifyRes.order || order, paymentIntent);
        } catch (backendErr) {
          console.warn("[StripeCheckout] Backend verification note:", backendErr.message);
          // Even if backend call had a transient error, payment was captured by Stripe
          toast.success("Payment captured! Finalizing your order...");
          onSuccess(order, paymentIntent);
        }
      } else {
        setErrorMessage(`Unexpected payment status: ${paymentIntent?.status}`);
        setLoading(false);
      }
    } catch (err) {
      console.error("[StripeCheckout] Unexpected exception:", err);
      setErrorMessage(err.message || "An unexpected error occurred during payment processing.");
      toast.error(err.message || "Payment execution failed");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 flex items-start gap-3 text-red-700 dark:text-red-300 text-xs">
          <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-500" />
          <div className="flex-1 leading-relaxed">
            <span className="font-bold block">Payment Error</span>
            {errorMessage}
          </div>
        </div>
      )}

      {/* Stripe Payment Element with Card, Apple Pay, Google Pay */}
      <div className="relative min-h-[180px]">
        {!isReady && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 dark:bg-slate-900/70 z-10 rounded-xl backdrop-blur-[1px]">
            <Loader2 size={28} className="animate-spin text-[#2563eb] mb-2" />
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Loading secure payment interface...
            </span>
          </div>
        )}
        <PaymentElement
          id="payment-element"
          onReady={() => setIsReady(true)}
          options={{
            layout: "tabs",
            wallets: {
              applePay: "auto",
              googlePay: "auto",
            },
          }}
        />
      </div>

      {/* Trust & Encryption Banner */}
      <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-[11px] text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5 font-medium">
          <Lock size={13} className="text-emerald-500" />
          <span>256-Bit SSL End-to-End Encrypted</span>
        </div>
        <div className="flex items-center gap-1 font-semibold text-slate-600 dark:text-slate-300">
          <ShieldCheck size={14} className="text-[#2563eb]" />
          <span>Powered by Stripe</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-1">
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || !elements || loading || !isReady}
          className="flex-[2] py-3 px-5 rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white font-black text-xs shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Authorizing Payment...</span>
            </>
          ) : (
            <>
              <Lock size={15} />
              <span>
                Pay ₹{Number(order?.totalPrice || 0).toLocaleString("en-IN")} Securely
              </span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

/**
 * Top-level Stripe Checkout Modal Wrapper
 */
export default function StripeCheckoutModal({
  isOpen,
  onClose,
  clientSecret,
  publishableKey,
  order,
  paymentId,
  onSuccess,
}) {
  const isDarkMode =
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark");

  // Memoize stripePromise based on publishableKey to avoid re-instantiation
  const stripePromise = useMemo(() => {
    if (!publishableKey) return null;
    return loadStripe(publishableKey);
  }, [publishableKey]);

  if (!isOpen || !clientSecret || !stripePromise) {
    return null;
  }

  // Stripe Elements Appearance Configuration (Theme responsive)
  const appearance = {
    theme: isDarkMode ? "night" : "stripe",
    variables: {
      colorPrimary: "#2563eb",
      colorBackground: isDarkMode ? "#0f172a" : "#ffffff",
      colorText: isDarkMode ? "#f8fafc" : "#0f172a",
      colorDanger: "#ef4444",
      fontFamily: "Inter, system-ui, sans-serif",
      borderRadius: "12px",
      fontSizeBase: "14px",
    },
    rules: {
      ".Tab": {
        border: isDarkMode ? "1px solid #334155" : "1px solid #e2e8f0",
        backgroundColor: isDarkMode ? "#1e293b" : "#f8fafc",
      },
      ".Tab:hover": {
        color: "#2563eb",
      },
      ".Tab--selected": {
        border: "1px solid #2563eb",
        backgroundColor: isDarkMode ? "#1e293b" : "#eff6ff",
      },
      ".Input": {
        border: isDarkMode ? "1px solid #334155" : "1px solid #cbd5e1",
        backgroundColor: isDarkMode ? "#1e293b" : "#ffffff",
      },
    },
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 flex items-center justify-center text-[#2563eb]">
              <CreditCard size={20} />
            </div>
            <div>
              <h3 className="font-black text-base text-slate-900 dark:text-white leading-tight">
                Secure Card & Digital Wallet
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Order #{order?._id?.toString().slice(-8).toUpperCase() || "NEW"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Order Summary Pill */}
        <div className="mb-5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-600 dark:text-slate-300">
            Total Payable Amount:
          </span>
          <span className="font-black text-sm text-[#2563eb] dark:text-blue-400">
            ₹{Number(order?.totalPrice || 0).toLocaleString("en-IN")}
          </span>
        </div>

        {/* Elements Container */}
        <Elements stripe={stripePromise} options={options}>
          <StripeCheckoutForm
            order={order}
            clientSecret={clientSecret}
            paymentId={paymentId}
            onSuccess={onSuccess}
            onClose={onClose}
          />
        </Elements>
      </div>
    </div>
  );
}
