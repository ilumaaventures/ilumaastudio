import baseApi from "./baseApi";

/**
 * Dynamically loads the official Razorpay Checkout JavaScript SDK.
 * @returns {Promise<boolean>} Resolves true when loaded, false on failure.
 */
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    // If already loaded in window
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      console.error("❌ Failed to load Razorpay Checkout SDK script.");
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

/**
 * Fetches Razorpay public key from backend or env
 */
export const getRazorpayKey = async () => {
  try {
    const res = await baseApi.get("/payments/key");
    if (res.data && res.data.key) {
      return res.data.key;
    }
  } catch (err) {
    console.warn("Could not fetch key from backend, using env fallback:", err);
  }
  return import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_TTtsKzOiG9Mky3";
};

/**
 * Creates a Razorpay Order on the backend
 * @param {Object} data - { amount, currency, orderId, notes }
 */
export const createRazorpayOrder = async ({ amount, currency = "INR", orderId, notes = {} }) => {
  const response = await baseApi.post("/payments/create-order", {
    amount,
    currency,
    orderId,
    notes,
  });
  return response.data;
};

/**
 * Verifies Razorpay payment signature on backend
 * @param {Object} verificationData - { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId, paymentId }
 */
export const verifyRazorpayPayment = async (verificationData) => {
  const response = await baseApi.post("/payments/verify", verificationData);
  return response.data;
};
