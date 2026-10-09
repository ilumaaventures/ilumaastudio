import { getProductById } from "../api/productService";
import { checkShadowfaxServiceability } from "../api/orderService";

/**
 * Checks live Shadowfax 3PL logistics courier serviceability for a delivery pincode
 */
export const checkPincodeServiceability = async (pincode, options = {}) => {
  const cleanPincode = (pincode || "").toString().trim();
  if (!/^[1-9][0-9]{5}$/.test(cleanPincode)) {
    return {
      serviceable: false,
      pincode: cleanPincode,
      courierPartner: "Shadowfax Logistics",
      message: "Please enter a valid 6-digit Indian PIN code.",
      codAvailable: false,
    };
  }

  try {
    const res = await checkShadowfaxServiceability({
      deliveryPincode: cleanPincode,
      paymentMode: options.paymentMode || "PREPAID",
      pickupPincode: options.pickupPincode,
      items: options.items,
      subtotal: options.subtotal,
      weight: options.weight,
    });
    return res;
  } catch (err) {
    console.warn("Failed fetching Shadowfax serviceability from backend:", err);
    return {
      serviceable: false,
      pincode: cleanPincode,
      courierPartner: "Shadowfax Logistics",
      estimatedDays: null,
      message: "Shadowfax courier availability could not be verified.",
      codAvailable: false,
      shippingFee: 0,
      courierRate: 0,
      isFreeDelivery: false,
      pricing: null,
      fallback: true,
      isVerified: false,
      source: "CLIENT_ERROR_FALLBACK",
    };
  }
};

/**
 * Checks pincode availability for a single product inventory structure.
 */
export const checkInventoryPincodeAvailability = (inventory, pincode) => {
  const cleanPincode = (pincode || "").toString().trim();
  if (!/^[1-9][0-9]{5}$/.test(cleanPincode)) {
    return {
      available: false,
      message: "Please enter a valid 6-digit pincode",
    };
  }

  const warehousePincodes = inventory?.warehouse?.pincodes;
  const hasConfiguredPincodes =
    Array.isArray(warehousePincodes) && warehousePincodes.length > 0;

  const available =
    !hasConfiguredPincodes ||
    (Array.isArray(warehousePincodes) && warehousePincodes.includes(cleanPincode));

  if (available) {
    const isMetro =
      cleanPincode.startsWith("11") ||
      cleanPincode.startsWith("40") ||
      cleanPincode.startsWith("70") ||
      cleanPincode.startsWith("60") ||
      cleanPincode.startsWith("56") ||
      cleanPincode.startsWith("38");
    const days = isMetro ? 2 : 3;
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + days);
    const formattedDate = deliveryDate.toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "short",
    });

    return {
      available: true,
      pincode: cleanPincode,
      message: `Delivery by ${formattedDate} (${days} Days)`,
    };
  }

  return {
    available: false,
    pincode: cleanPincode,
    message: "This product is not deliverable to the selected pincode.",
  };
};

/**
 * Validates availability for an array of cart items against a target pincode using live Shadowfax courier API.
 */
export const validateCartItemsPincode = async (cartItems, pincode, options = {}) => {
  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return { results: {}, allAvailable: true, courierInfo: null };
  }

  const cleanPincode = (pincode || "").toString().trim();
  if (!/^[1-9][0-9]{5}$/.test(cleanPincode)) {
    const results = {};
    cartItems.forEach((item) => {
      results[item._id] = {
        available: false,
        message: "Invalid or missing 6-digit PIN code",
      };
    });
    return {
      results,
      allAvailable: false,
      courierInfo: {
        serviceable: false,
        courierPartner: "Shadowfax Logistics",
        pincode: cleanPincode,
        message: "Please enter a valid 6-digit Indian PIN code",
        shippingFee: 0,
        pricing: null,
      },
    };
  }

  // 1. Live Shadowfax 3PL Logistics Serviceability & Pricing Check
  const subtotal = options.subtotal || cartItems.reduce(
    (acc, it) => acc + (Number(it.price) || 0) * (Number(it.quantity) || 1),
    0
  );
  const totalWeight = cartItems.reduce(
    (acc, it) => acc + ((Number(it.weight) || 350) * (Number(it.quantity) || 1)),
    0
  );

  let courierInfo;
  try {
    courierInfo = await checkPincodeServiceability(cleanPincode, {
      items: cartItems,
      subtotal,
      weight: totalWeight,
      paymentMode: options.paymentMode || "PREPAID",
    });
  } catch (err) {
    console.error("Shadowfax serviceability check error:", err);
    courierInfo = {
      serviceable: false,
      courierPartner: "Shadowfax Logistics",
      estimatedDays: null,
      message: "Shadowfax courier availability could not be verified.",
      codAvailable: false,
      shippingFee: 0,
      courierRate: 0,
      isFreeDelivery: false,
      pricing: null,
      fallback: true,
      isVerified: false,
      source: "CLIENT_ERROR_FALLBACK",
    };
  }

  const results = {};
  let allAvailable = courierInfo.serviceable !== false;

  await Promise.all(
    cartItems.map(async (item) => {
      try {
        if (!courierInfo.serviceable) {
          results[item._id] = {
            available: false,
            courierPartner: "Shadowfax Logistics",
            message: courierInfo.message || `Not deliverable to ${cleanPincode} via Shadowfax`,
          };
          return;
        }

        let inventory = item.inventory;
        if (!inventory && item._id) {
          const res = await getProductById(item._id);
          inventory = res?.inventory || null;
        }

        // Secondary check against specific warehouse restrictions if configured
        const localStatus = checkInventoryPincodeAvailability(inventory, cleanPincode);
        if (!localStatus.available) {
          results[item._id] = {
            available: false,
            courierPartner: "Shadowfax Logistics",
            message: localStatus.message,
          };
          allAvailable = false;
        } else {
          results[item._id] = {
            available: true,
            courierPartner: "Shadowfax Logistics",
            message: courierInfo.message || `Delivery by Shadowfax (${courierInfo.estimatedDays || 3} Days)`,
            estimatedDays: courierInfo.estimatedDays || 3,
            deliveryDate: courierInfo.deliveryDate,
            codAvailable: courierInfo.codAvailable,
          };
        }
      } catch (err) {
        console.error(`Error checking item ${item._id}:`, err);
        results[item._id] = {
          available: courierInfo.serviceable !== false,
          courierPartner: "Shadowfax Logistics",
          message: courierInfo.message || "Delivery available via Shadowfax",
        };
      }
    })
  );

  return { results, allAvailable, courierInfo };
};
