export const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          // IMPORTANT: yahi variables declare ho rahe hain
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          console.log("Latitude:", latitude);
          console.log("Longitude:", longitude);

          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
          );

          if (!response.ok) {
            throw new Error("Failed to fetch address");
          }

          const data = await response.json();

          const location = {
            latitude,
            longitude,
            address: data.display_name || "",
            city:
              data.address?.city ||
              data.address?.town ||
              data.address?.village ||
              "",
            state: data.address?.state || "",
            country: data.address?.country || "",
            pincode: data.address?.postcode || "",
          };

          resolve(location);
        } catch (error) {
          reject(error);
        }
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      },
    );
  });
};

export const DISTANCE_RANGE_OPTIONS = [5, 15, 25, 50, 100];

export const POPULAR_CITIES = [
  { name: "New Delhi", state: "Delhi", pincode: "110001", lat: 28.6139, lon: 77.209 },
  { name: "Mumbai", state: "Maharashtra", pincode: "400001", lat: 19.076, lon: 72.8777 },
  { name: "Bengaluru", state: "Karnataka", pincode: "560001", lat: 12.9716, lon: 77.5946 },
  { name: "Hyderabad", state: "Telangana", pincode: "500001", lat: 17.385, lon: 78.4867 },
  { name: "Chennai", state: "Tamil Nadu", pincode: "600001", lat: 13.0827, lon: 80.2707 },
  { name: "Kolkata", state: "West Bengal", pincode: "700001", lat: 22.5726, lon: 88.3639 },
  { name: "Pune", state: "Maharashtra", pincode: "411001", lat: 18.5204, lon: 73.8567 },
  { name: "Lucknow", state: "Uttar Pradesh", pincode: "226001", lat: 26.8467, lon: 80.9462 },
];

export const getDistanceContextLabel = (km) => {
  const val = Number(km);
  if (val <= 5) return "Hyperlocal • Instant";
  if (val <= 15) return "Neighborhood • Fast";
  if (val <= 25) return "Metro City • Standard";
  if (val <= 50) return "Suburban • Regional";
  return "Extended • Up to 100 km";
};

export const getSavedDistanceRange = () => {
  if (typeof window === "undefined") return 25;
  try {
    const saved = localStorage.getItem("ilumaa_distance_range");
    const num = Number(saved);
    if (!isNaN(num) && num >= 5 && num <= 100) {
      return num;
    }
  } catch (e) {
    console.warn("Could not read distance range from storage:", e);
  }
  return 25; // Default 25 km
};

export const saveDistanceRange = (range) => {
  const num = Math.min(100, Math.max(5, Number(range) || 25));
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("ilumaa_distance_range", String(num));
      window.dispatchEvent(
        new CustomEvent("ilumaa:location_range_changed", {
          detail: {
            distanceRange: num,
            location: getSavedLocation(),
          },
        }),
      );
    } catch (e) {
      console.warn("Could not save distance range to storage:", e);
    }
  }
  return num;
};

export const getSavedLocation = () => {
  if (typeof window === "undefined") {
    return { city: "New Delhi", state: "Delhi", pincode: "110001" };
  }
  try {
    const saved = localStorage.getItem("ilumaa_user_location");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && (parsed.city || parsed.pincode)) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Could not read location from storage:", e);
  }
  return { city: "New Delhi", state: "Delhi", pincode: "110001" };
};

export const saveUserLocation = (loc) => {
  if (!loc || typeof loc !== "object") return;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("ilumaa_user_location", JSON.stringify(loc));
      window.dispatchEvent(
        new CustomEvent("ilumaa:location_range_changed", {
          detail: {
            location: loc,
            distanceRange: getSavedDistanceRange(),
          },
        }),
      );
    } catch (e) {
      console.warn("Could not save location to storage:", e);
    }
  }
};
