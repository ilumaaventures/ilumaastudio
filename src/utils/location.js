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
