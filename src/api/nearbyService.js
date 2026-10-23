/**
 * Data Access Layer for ILumaaStudio Nearby Discovery
 * 
 * Provides clean async abstractions for fetching local discovery entities.
 * In Phase 1, filters and sorts structured mock data from src/data/nearbyMockData.js.
 * In Phase 2, this file can be updated to call real backend endpoints (e.g. baseApi.get('/api/nearby/...'))
 * without modifying any UI components or views.
 */

import {
  NEARBY_PRODUCTS,
  NEARBY_BUSINESSES,
  NEARBY_SERVICES,
  NEARBY_FOOD_PLACES,
  NEARBY_GIFTS,
  NEARBY_EVENTS,
  NEARBY_PLACES,
  NEARBY_OFFERS,
  NEARBY_CATEGORIES,
  EXPLORE_HERO_PROMO,
  EXPLORE_QUICK_ICONS,
  EXPLORE_CURATED_COLLECTIONS,
  EXPLORE_TRAVEL_BOOKINGS,
  EXPLORE_TRENDING_SEARCHES,
  EXPLORE_LATEST_MOVIES,
  EXPLORE_TOP_TOURIST_PLACES,
  EXPLORE_POPULAR_SEARCHES,
  EXPLORE_SEASONAL_ESSENTIALS,
  EXPLORE_FESTIVE_DEMANDS,
  EXPLORE_RECENT_ACTIVITY,
} from "../data/nearbyMockData";

/**
 * Generic filter and sort helper
 */
function applyFiltersAndSort(items, filters = {}) {
  const {
    radius = 50,
    q = "",
    category = "all",
    priceRange = "",
    availability = "",
    sort = "relevance",
    city = "",
  } = filters;

  let result = [...items];

  // 1. Radius filter (in kilometers)
  const maxRadius = Number(radius) || 50;
  result = result.filter((item) => {
    if (typeof item.distanceKm === "number") {
      return item.distanceKm <= maxRadius;
    }
    return true;
  });

  // 2. City filter (soft matching if specified)
  if (city && city.trim() !== "") {
    const cLower = city.trim().toLowerCase();
    const cityMatches = result.filter(
      (item) => item.city && item.city.toLowerCase() === cLower,
    );
    // If we have items in that city, prioritize/filter them
    if (cityMatches.length > 0) {
      result = cityMatches;
    }
  }

  // 3. Category filter
  if (category && category !== "all") {
    const catLower = category.toLowerCase();
    result = result.filter((item) => {
      const itemCat = (item.category || "").toLowerCase();
      const itemType = (item.type || "").toLowerCase();
      return (
        itemCat.includes(catLower) ||
        catLower.includes(itemCat) ||
        itemType === catLower ||
        (catLower === "food" && (itemType === "food" || itemCat.includes("café") || itemCat.includes("food"))) ||
        (catLower === "gifts" && (itemType === "gift" || itemCat.includes("gift"))) ||
        (catLower === "places" && itemType === "place") ||
        (catLower === "events" && itemType === "event") ||
        (catLower === "offers" && itemType === "offer") ||
        (catLower === "services" && itemType === "service") ||
        (catLower === "businesses" && itemType === "business") ||
        (catLower === "products" && itemType === "product") ||
        (catLower === "education" && (
          itemCat.includes("education") ||
          (item.tags && item.tags.some((t) => t.toLowerCase().includes("education") || t.toLowerCase().includes("coaching") || t.toLowerCase().includes("tutor"))) ||
          ((item.title || item.name || "").toLowerCase().includes("tuition")) ||
          ((item.title || item.name || "").toLowerCase().includes("coaching")) ||
          ((item.title || item.name || "").toLowerCase().includes("tutor")) ||
          ((item.title || item.name || "").toLowerCase().includes("academy"))
        ))
      );
    });
  }

  // 4. Text Search filter (q)
  if (q && q.trim() !== "") {
    const term = q.trim().toLowerCase();
    result = result.filter((item) => {
      const name = (item.name || item.title || "").toLowerCase();
      const desc = (item.description || item.tagline || "").toLowerCase();
      const bName = (item.businessName || item.providerName || item.host || "").toLowerCase();
      const area = (item.area || "").toLowerCase();
      const cat = (item.category || "").toLowerCase();
      const tags = Array.isArray(item.tags) ? item.tags.join(" ").toLowerCase() : "";
      return (
        name.includes(term) ||
        desc.includes(term) ||
        bName.includes(term) ||
        area.includes(term) ||
        cat.includes(term) ||
        tags.includes(term)
      );
    });
  }

  // 5. Price Range filter
  if (priceRange) {
    if (priceRange === "under500") {
      result = result.filter((item) => (item.price || item.startingPrice || 0) < 500);
    } else if (priceRange === "500-1500") {
      result = result.filter((item) => {
        const p = item.price || item.startingPrice || 0;
        return p >= 500 && p <= 1500;
      });
    } else if (priceRange === "above1500") {
      result = result.filter((item) => (item.price || item.startingPrice || 0) > 1500);
    }
  }

  // 6. Availability filter
  if (availability === "openNow") {
    result = result.filter((item) => item.isOpen === true || item.availability === "In Stock");
  } else if (availability === "delivery") {
    result = result.filter((item) => item.deliveryAvailable === true || item.deliveryBadge);
  } else if (availability === "pickup") {
    result = result.filter((item) => item.pickupAvailable === true || item.features?.includes("Store Pickup"));
  }

  // 7. Sort
  if (sort === "nearest") {
    result.sort((a, b) => (a.distanceKm || 999) - (b.distanceKm || 999));
  } else if (sort === "price_asc") {
    result.sort(
      (a, b) =>
        (a.price || a.startingPrice || 0) - (b.price || b.startingPrice || 0),
    );
  } else if (sort === "price_desc") {
    result.sort(
      (a, b) =>
        (b.price || b.startingPrice || 0) - (a.price || a.startingPrice || 0),
    );
  } else if (sort === "rating") {
    result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else {
    // Relevance / Featured
    result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
  }

  return result;
}

/**
 * Fetch all local entities matching filters
 */
export const getNearbyAll = async (filters = {}) => {
  const allListings = [
    ...NEARBY_PRODUCTS,
    ...NEARBY_BUSINESSES,
    ...NEARBY_SERVICES,
    ...NEARBY_FOOD_PLACES,
    ...NEARBY_GIFTS,
    ...NEARBY_EVENTS,
    ...NEARBY_PLACES,
    ...NEARBY_OFFERS,
  ];

  const filtered = applyFiltersAndSort(allListings, filters);
  return {
    success: true,
    data: filtered,
    total: filtered.length,
    isDemo: true,
    filtersApplied: filters,
  };
};

/**
 * Fetch nearby products with filters
 */
export const getNearbyProducts = async (filters = {}) => {
  const filtered = applyFiltersAndSort(NEARBY_PRODUCTS, filters);
  return {
    success: true,
    data: filtered,
    total: filtered.length,
    isDemo: true,
  };
};

/**
 * Fetch nearby businesses / stores
 */
export const getNearbyBusinesses = async (filters = {}) => {
  const filtered = applyFiltersAndSort(NEARBY_BUSINESSES, filters);
  return {
    success: true,
    data: filtered,
    total: filtered.length,
    isDemo: true,
  };
};

/**
 * Fetch nearby services
 */
export const getNearbyServices = async (filters = {}) => {
  const filtered = applyFiltersAndSort(NEARBY_SERVICES, filters);
  return {
    success: true,
    data: filtered,
    total: filtered.length,
    isDemo: true,
  };
};

/**
 * Fetch nearby food & dining
 */
export const getNearbyFoodPlaces = async (filters = {}) => {
  const filtered = applyFiltersAndSort(NEARBY_FOOD_PLACES, filters);
  return {
    success: true,
    data: filtered,
    total: filtered.length,
    isDemo: true,
  };
};

/**
 * Fetch nearby gifts
 */
export const getNearbyGifts = async (filters = {}) => {
  const filtered = applyFiltersAndSort(NEARBY_GIFTS, filters);
  return {
    success: true,
    data: filtered,
    total: filtered.length,
    isDemo: true,
  };
};

/**
 * Fetch nearby events & workshops
 */
export const getNearbyEvents = async (filters = {}) => {
  const filtered = applyFiltersAndSort(NEARBY_EVENTS, filters);
  return {
    success: true,
    data: filtered,
    total: filtered.length,
    isDemo: true,
  };
};

/**
 * Fetch nearby places to explore
 */
export const getNearbyPlaces = async (filters = {}) => {
  const filtered = applyFiltersAndSort(NEARBY_PLACES, filters);
  return {
    success: true,
    data: filtered,
    total: filtered.length,
    isDemo: true,
  };
};

/**
 * Fetch nearby offers & coupons
 */
export const getNearbyOffers = async (filters = {}) => {
  const filtered = applyFiltersAndSort(NEARBY_OFFERS, filters);
  return {
    success: true,
    data: filtered,
    total: filtered.length,
    isDemo: true,
  };
};

/**
 * Compute counts for each category tile based on active search/radius
 */
export const getNearbyCategoryCounts = async (filters = {}) => {
  const baseFilters = { ...filters, category: "all" };
  const all = (await getNearbyAll(baseFilters)).data;

  const counts = {
    all: all.length,
    products: all.filter((i) => i.type === "product").length,
    businesses: all.filter((i) => i.type === "business").length,
    services: all.filter((i) => i.type === "service").length,
    food: all.filter((i) => i.type === "food").length,
    gifts: all.filter((i) => i.type === "gift").length,
    fashion: all.filter((i) => (i.category || "").toLowerCase().includes("fashion")).length,
    beauty: all.filter((i) => (i.category || "").toLowerCase().includes("beauty")).length,
    home: all.filter((i) => (i.category || "").toLowerCase().includes("home")).length,
    electronics: all.filter((i) => (i.category || "").toLowerCase().includes("electronics")).length,
    events: all.filter((i) => i.type === "event").length,
    places: all.filter((i) => i.type === "place").length,
    offers: all.filter((i) => i.type === "offer").length,
  };

  return counts;
};

/**
 * Fetch discovery sections data (promos, quick icons, curated collections, etc.)
 */
export const getExploreSectionsData = async () => {
  return {
    heroPromo: EXPLORE_HERO_PROMO,
    quickIcons: EXPLORE_QUICK_ICONS,
    curatedCollections: EXPLORE_CURATED_COLLECTIONS,
    travelBookings: EXPLORE_TRAVEL_BOOKINGS,
    trendingSearches: EXPLORE_TRENDING_SEARCHES,
    latestMovies: EXPLORE_LATEST_MOVIES,
    touristPlaces: EXPLORE_TOP_TOURIST_PLACES,
    popularSearches: EXPLORE_POPULAR_SEARCHES,
    seasonalEssentials: EXPLORE_SEASONAL_ESSENTIALS,
    festiveDemands: EXPLORE_FESTIVE_DEMANDS,
    recentActivity: EXPLORE_RECENT_ACTIVITY,
  };
};

/**
 * Fetch a single nearby item by ID with full enriched detail profile
 */
export const getNearbyItemById = async (id) => {
  const allListings = [
    ...NEARBY_PRODUCTS,
    ...NEARBY_BUSINESSES,
    ...NEARBY_SERVICES,
    ...NEARBY_FOOD_PLACES,
    ...NEARBY_GIFTS,
    ...NEARBY_EVENTS,
    ...NEARBY_PLACES,
    ...NEARBY_OFFERS,
  ];

  // Try exact ID match
  let item = allListings.find((i) => i.id === id);

  // If not found in primary list, check in recent activity or popular searches
  if (!item) {
    const act = EXPLORE_RECENT_ACTIVITY.find((a) => a.id === id || a.businessId === id);
    if (act) {
      item = {
        id: act.businessId || act.id,
        name: act.businessName,
        type: "business",
        category: "Services & Retailing",
        city: act.location.includes("Mumbai") ? "Mumbai" : "Lucknow",
        area: act.location.split("–")[0]?.trim() || "Local Area",
        image: act.coverImage,
        rating: act.rating || 5,
        reviewCount: 94,
        whatsappNumber: act.whatsappNumber,
        tagline: act.review,
        description: `${act.businessName} is a top-rated neighbourhood provider specializing in high quality services, personalized assistance, and rapid response.`,
      };
    }
  }

  // Fallback to first business or generic item if still not matched
  if (!item) {
    item = NEARBY_BUSINESSES[0] || {
      id: id || "biz-fallback",
      name: "Heritage Local Partner",
      type: "business",
      category: "Local Discovery",
      city: "Lucknow",
      area: "Gomti Nagar",
      rating: 4.8,
      reviewCount: 45,
    };
  }

  const title = item.name || item.title || item.businessName || "Local Provider";
  const category = item.category || (item.type ? item.type.toUpperCase() : "Services");
  const mainImage = item.image || item.coverImage || "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80";

  // Build a rich photo gallery
  const gallery = [
    mainImage,
    "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
  ];

  // Specific service catalog or product menu
  const servicesOffered = [
    {
      id: "srv-1",
      name: `Standard ${category} Package`,
      price: item.price || item.startingPrice || 899,
      duration: "45-60 mins",
      description: "Complete professional consultation, personalized care, and doorstep support with verified quality standards.",
    },
    {
      id: "srv-2",
      name: `Premium Express Solution`,
      price: Math.round((item.price || item.startingPrice || 899) * 1.5),
      duration: "90 mins",
      description: "Priority slot assignment, complimentary consumables, and 30-day satisfaction guarantee.",
    },
    {
      id: "srv-3",
      name: `Custom On-Demand Request`,
      price: Math.round((item.price || item.startingPrice || 899) * 2),
      duration: "Custom",
      description: "Tailored to your exact home, event, or business requirements with dedicated senior specialist.",
    },
  ];

  const reviews = [
    {
      id: "rev-1",
      user: "Aditi Sharma",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
      rating: 5,
      date: "3 days ago",
      comment: "Prompt service, extremely courteous staff and completely transparent pricing. Made my experience hassle-free!",
    },
    {
      id: "rev-2",
      user: "Vikram Malhotra",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      rating: 5,
      date: "1 week ago",
      comment: "Found them on ILumaa Nearby and contacted via WhatsApp. Received instant confirmation within 10 minutes. 10/10!",
    },
    {
      id: "rev-3",
      user: "Priya Nair",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      rating: 4,
      date: "2 weeks ago",
      comment: "Great quality and well-maintained premises. Highly recommend for anyone looking for reliable local solutions.",
    },
  ];

  const highlights = [
    "Verified & Certified",
    "Instant WhatsApp Enquiry",
    "Doorstep & In-Store Availability",
    "Digital Payments & UPI Accepted",
    "Wheelchair & Parking Friendly",
    "Sanitized & Safe Environment",
  ];

  const faqs = [
    {
      q: "How can I book an appointment or place an order?",
      a: "You can click 'Enquire on WhatsApp' to directly chat with the vendor, or tap 'Book / Request Quote' to submit your requirements. The provider responds within 15-30 minutes.",
    },
    {
      q: "Are prices negotiated or fixed?",
      a: "Listed rates are standard starting estimates. Custom packages and local discount coupons can be applied during booking or enquiry.",
    },
    {
      q: "Is home doorstep service available?",
      a: "Yes, this provider offers verified doorstep visits within the specified kilometer radius.",
    },
  ];

  const relatedItems = allListings
    .filter((l) => l.id !== item.id && (l.category === item.category || l.city === item.city))
    .slice(0, 4);

  return {
    ...item,
    name: title,
    category,
    images: gallery,
    address: item.address || `${item.area || "Gomti Nagar"}, ${item.city || "Lucknow"}, Uttar Pradesh`,
    openingHours: item.openingHours || item.timings || "10:00 AM – 8:30 PM (Daily)",
    isOpen: item.isOpen ?? true,
    distanceKm: item.distanceKm || 2.1,
    phone: "+91 98765 43210",
    whatsappNumber: item.whatsappNumber || "919876543210",
    email: "contact@neighbourhoodhub.ilumaa.com",
    highlights,
    servicesOffered,
    reviews,
    faqs,
    relatedItems,
    isVerified: true,
  };
};
