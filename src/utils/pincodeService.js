import { getProductById } from "../api/productService";

/**
 * Checks pincode availability for a single product inventory structure.
 */
export const checkInventoryPincodeAvailability = (inventory, pincode) => {
  const cleanPincode = (pincode || "").toString().trim();
  if (!/^\d{6}$/.test(cleanPincode)) {
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
    const days = isMetro ? 2 : 4;
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + days);
    const formattedDate = deliveryDate.toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
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
 * Validates availability for an array of cart items against a target pincode.
 * Fetches product inventory details if not attached.
 */
export const validateCartItemsPincode = async (cartItems, pincode) => {
  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return { results: {}, allAvailable: true };
  }

  const cleanPincode = (pincode || "").toString().trim();
  if (!/^\d{6}$/.test(cleanPincode)) {
    const results = {};
    cartItems.forEach((item) => {
      results[item._id] = {
        available: false,
        message: "Invalid or missing 6-digit pincode",
      };
    });
    return { results, allAvailable: false };
  }

  const results = {};
  let allAvailable = true;

  await Promise.all(
    cartItems.map(async (item) => {
      try {
        let inventory = item.inventory;
        if (!inventory) {
          const res = await getProductById(item._id);
          inventory = res?.inventory || null;
        }

        const status = checkInventoryPincodeAvailability(inventory, cleanPincode);
        results[item._id] = status;

        if (!status.available) {
          allAvailable = false;
        }
      } catch (err) {
        console.error(`Error checking pincode for product ${item._id}:`, err);
        // Default to deliverable if API check fails to avoid blocking orders due to network transient errors
        results[item._id] = {
          available: true,
          message: "Availability check unavailable",
        };
      }
    }),
  );

  return { results, allAvailable };
};
