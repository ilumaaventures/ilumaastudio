/**
 * Fixed Mock Data Architecture for ILumaaStudio Nearby Discovery Experience
 *
 * NOTE: These listings are curated demo/mock records designed for realistic local discovery
 * testing across products, businesses, services, food & dining, gifting, events, places, and offers.
 * Data structures are designed for drop-in replacement with real backend API endpoints.
 */

export const NEARBY_CATEGORIES = [
  {
    id: "all",
    name: "All",
    slug: "all",
    icon: "Compass",
    color: "from-blue-600 to-indigo-600",
  },
  {
    id: "products",
    name: "Products",
    slug: "products",
    icon: "ShoppingBag",
    color: "from-emerald-600 to-teal-600",
  },
  {
    id: "businesses",
    name: "Businesses",
    slug: "businesses",
    icon: "Building2",
    color: "from-amber-600 to-orange-600",
  },
  {
    id: "services",
    name: "Services",
    slug: "services",
    icon: "Sparkles",
    color: "from-purple-600 to-pink-600",
  },
  {
    id: "food",
    name: "Food & Cafés",
    slug: "food",
    icon: "Coffee",
    color: "from-rose-600 to-red-600",
  },
  {
    id: "gifts",
    name: "Gifts & Personalised",
    slug: "gifts",
    icon: "Gift",
    color: "from-fuchsia-600 to-purple-600",
  },
  {
    id: "fashion",
    name: "Fashion",
    slug: "fashion",
    icon: "Shirt",
    color: "from-violet-600 to-indigo-600",
  },
  {
    id: "beauty",
    name: "Beauty & Wellness",
    slug: "beauty",
    icon: "Heart",
    color: "from-pink-600 to-rose-600",
  },
  {
    id: "home",
    name: "Home & Living",
    slug: "home",
    icon: "Home",
    color: "from-amber-500 to-yellow-600",
  },
  {
    id: "electronics",
    name: "Electronics",
    slug: "electronics",
    icon: "Laptop",
    color: "from-cyan-600 to-blue-600",
  },
  {
    id: "events",
    name: "Events & Experiences",
    slug: "events",
    icon: "Calendar",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "places",
    name: "Places to Explore",
    slug: "places",
    icon: "MapPin",
    color: "from-emerald-500 to-green-600",
  },
  {
    id: "offers",
    name: "Local Offers",
    slug: "offers",
    icon: "Tag",
    color: "from-red-500 to-orange-500",
  },
];

export const POPULAR_EXPLORE_LOCATIONS = [
  {
    city: "Lucknow",
    area: "Gomti Nagar",
    pincode: "226010",
    lat: 26.85,
    lng: 80.998,
  },
  {
    city: "Lucknow",
    area: "Hazratganj",
    pincode: "226001",
    lat: 26.8467,
    lng: 80.9462,
  },
  {
    city: "Lucknow",
    area: "Aliganj",
    pincode: "226024",
    lat: 26.892,
    lng: 80.941,
  },
  {
    city: "Delhi",
    area: "Connaught Place",
    pincode: "110001",
    lat: 28.6315,
    lng: 77.2167,
  },
  {
    city: "Delhi",
    area: "Hauz Khas",
    pincode: "110016",
    lat: 28.5494,
    lng: 77.2001,
  },
  {
    city: "Delhi",
    area: "Saket",
    pincode: "110017",
    lat: 28.5245,
    lng: 77.2066,
  },
  {
    city: "Mumbai",
    area: "Bandra West",
    pincode: "400050",
    lat: 19.0596,
    lng: 72.8295,
  },
  {
    city: "Mumbai",
    area: "Colaba",
    pincode: "400005",
    lat: 18.9067,
    lng: 72.8147,
  },
  {
    city: "Bengaluru",
    area: "Indiranagar",
    pincode: "560038",
    lat: 12.9784,
    lng: 77.6408,
  },
  {
    city: "Bengaluru",
    area: "Koramangala",
    pincode: "560034",
    lat: 12.9352,
    lng: 77.6245,
  },
];

export const NEARBY_PRODUCTS = [
  {
    id: "prod-001",
    type: "product",
    name: "Handcrafted Ceramic Artisan Vase",
    category: "Home & Living",
    price: 899,
    originalPrice: 1299,
    businessId: "biz-001",
    businessName: "Mitti & Clay Studio",
    city: "Lucknow",
    area: "Gomti Nagar",
    pincode: "226010",
    distanceKm: 1.8,
    image:
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80",
    availability: "In Stock",
    deliveryAvailable: true,
    pickupAvailable: true,
    rating: 4.8,
    isFeatured: true,
    isDemo: true,
    tags: ["Handmade", "Home Decor", "Eco-friendly"],
  },
  {
    id: "prod-002",
    type: "product",
    name: "Pure Chikankari Georgette Kurta",
    category: "Fashion",
    price: 2450,
    originalPrice: 3200,
    businessId: "biz-002",
    businessName: "Noor Heritage Weaves",
    city: "Lucknow",
    area: "Hazratganj",
    pincode: "226001",
    distanceKm: 3.2,
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80",
    availability: "Limited Stock",
    deliveryAvailable: true,
    pickupAvailable: true,
    rating: 4.9,
    isFeatured: true,
    isDemo: true,
    tags: ["Ethnic", "Chikankari", "Hand Embroidered"],
  },
  {
    id: "prod-003",
    type: "product",
    name: "Artisanal Single-Origin Arabica Beans (250g)",
    category: "Food & Cafés",
    price: 480,
    originalPrice: 550,
    businessId: "biz-003",
    businessName: "The Roastery Coffee House",
    city: "Lucknow",
    area: "Gomti Nagar",
    pincode: "226010",
    distanceKm: 2.1,
    image:
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80",
    availability: "Fresh Roast",
    deliveryAvailable: true,
    pickupAvailable: true,
    rating: 4.7,
    isFeatured: false,
    isDemo: true,
    tags: ["Coffee", "Artisanal", "Direct Trade"],
  },
  {
    id: "prod-004",
    type: "product",
    name: "Organic Ayurvedic Body Butter & Scrub Set",
    category: "Beauty & Wellness",
    price: 1150,
    originalPrice: 1450,
    businessId: "biz-004",
    businessName: "Sattva Naturals Botanica",
    city: "Lucknow",
    area: "Aliganj",
    pincode: "226024",
    distanceKm: 4.5,
    image:
      "https://images.unsplash.com/photo-1608248597359-052445100067?auto=format&fit=crop&w=600&q=80",
    availability: "In Stock",
    deliveryAvailable: true,
    pickupAvailable: false,
    rating: 4.8,
    isFeatured: true,
    isDemo: true,
    tags: ["Organic", "Skincare", "Ayurvedic"],
  },
  {
    id: "prod-005",
    type: "product",
    name: "Minimalist Walnut Wood Desk Organizer",
    category: "Home & Living",
    price: 1490,
    originalPrice: 1890,
    businessId: "biz-001",
    businessName: "Mitti & Clay Studio",
    city: "Lucknow",
    area: "Gomti Nagar",
    pincode: "226010",
    distanceKm: 1.8,
    image:
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
    availability: "In Stock",
    deliveryAvailable: true,
    pickupAvailable: true,
    rating: 4.6,
    isFeatured: false,
    isDemo: true,
    tags: ["Woodcraft", "Workspace", "Handmade"],
  },
  {
    id: "prod-006",
    type: "product",
    name: "Vintage Brass Aroma Candle Burner",
    category: "Gifts & Personalised",
    price: 750,
    originalPrice: 950,
    businessId: "biz-005",
    businessName: "Heritage Gift Studio",
    city: "Lucknow",
    area: "Hazratganj",
    pincode: "226001",
    distanceKm: 3.5,
    image:
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80",
    availability: "In Stock",
    deliveryAvailable: true,
    pickupAvailable: true,
    rating: 4.9,
    isFeatured: false,
    isDemo: true,
    tags: ["Brass", "Aromatherapy", "Festive Gift"],
  },
  {
    id: "prod-007",
    type: "product",
    name: "Noise-Cancelling Studio Bluetooth Speaker",
    category: "Electronics",
    price: 3899,
    originalPrice: 4999,
    businessId: "biz-006",
    businessName: "Apex Audio & Gadget Hub",
    city: "Lucknow",
    area: "Gomti Nagar",
    pincode: "226010",
    distanceKm: 2.8,
    image:
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80",
    availability: "In Stock",
    deliveryAvailable: true,
    pickupAvailable: true,
    rating: 4.7,
    isFeatured: false,
    isDemo: true,
    tags: ["Wireless", "Sound", "Tech"],
  },
  {
    id: "prod-008",
    type: "product",
    name: "Gourmet Dark Chocolate Truffle Gift Box",
    category: "Gifts & Personalised",
    price: 650,
    originalPrice: 850,
    businessId: "biz-007",
    businessName: "Cacao & Crumb Patisserie",
    city: "Lucknow",
    area: "Hazratganj",
    pincode: "226001",
    distanceKm: 3.0,
    image:
      "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=600&q=80",
    availability: "Fresh Daily",
    deliveryAvailable: true,
    pickupAvailable: true,
    rating: 4.9,
    isFeatured: true,
    isDemo: true,
    tags: ["Confectionery", "Gift", "Artisanal"],
  },
];

export const NEARBY_BUSINESSES = [
  {
    id: "biz-001",
    type: "business",
    name: "Mitti & Clay Studio",
    category: "Home & Living",
    tagline: "Handmade terracotta, studio ceramics & modern wooden crafts",
    description:
      "Neighbourhood ceramic workshop and lifestyle boutique creating sustainable tableware and home accents.",
    city: "Lucknow",
    area: "Gomti Nagar",
    address: "Vibhuti Khand, Near Cyber Heights, Gomti Nagar",
    pincode: "226010",
    distanceKm: 1.8,
    image:
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80",
    logo: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=200&q=80",
    rating: 4.8,
    reviewCount: 142,
    productCount: 24,
    serviceCount: 3,
    isOpen: true,
    openingHours: "10:00 AM – 8:30 PM",
    isVerified: true,
    isDemo: true,
    deliverySpeed: "Same-Day Delivery",
    features: ["Store Pickup", "Custom Orders", "Wheelchair Accessible"],
  },
  {
    id: "biz-002",
    type: "business",
    name: "Noor Heritage Weaves",
    category: "Fashion",
    tagline: "Authentic Awadhi chikankari, mulmul & zari apparel",
    description:
      "Centuries-old artisanal embroidery tradition brought into modern silhouettes for men and women.",
    city: "Lucknow",
    area: "Hazratganj",
    address: "Mayfair Building, MG Marg, Hazratganj",
    pincode: "226001",
    distanceKm: 3.2,
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80",
    logo: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=200&q=80",
    rating: 4.9,
    reviewCount: 289,
    productCount: 48,
    serviceCount: 2,
    isOpen: true,
    openingHours: "11:00 AM – 9:00 PM",
    isVerified: true,
    isDemo: true,
    deliverySpeed: "Express 2-Hour Dispatch",
    features: ["Custom Tailoring", "Store Pickup", "Heritage Certified"],
  },
  {
    id: "biz-003",
    type: "business",
    name: "The Roastery Coffee House",
    category: "Food & Cafés",
    tagline: "Specialty estate roastery & all-day garden breakfast café",
    description:
      "Award-winning neighbourhood café serving manual brews, cascading waterfalls garden seating, and European sourdough fare.",
    city: "Lucknow",
    area: "Gomti Nagar",
    address: "Sector 4, Gomti Nagar Extension",
    pincode: "226010",
    distanceKm: 2.1,
    image:
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80",
    logo: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=200&q=80",
    rating: 4.7,
    reviewCount: 310,
    productCount: 8,
    serviceCount: 1,
    isOpen: true,
    openingHours: "8:00 AM – 11:00 PM",
    isVerified: true,
    isDemo: true,
    deliverySpeed: "30-45 Mins Delivery",
    features: ["Pet Friendly", "Outdoor Seating", "High-Speed WiFi"],
  },
  {
    id: "biz-004",
    type: "business",
    name: "Sattva Naturals Botanica",
    category: "Beauty & Wellness",
    tagline: "Cold-pressed apothecary, organic remedies & herbal wellness",
    description:
      "Ayurvedic wellness pharmacy sourcing clean botanical oils, zero-toxin skincare, and holistic bath products.",
    city: "Lucknow",
    area: "Aliganj",
    address: "Sector B, Near Kapoorthala Chauraha, Aliganj",
    pincode: "226024",
    distanceKm: 4.5,
    image:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
    logo: "https://images.unsplash.com/photo-1608248597359-052445100067?auto=format&fit=crop&w=200&q=80",
    rating: 4.8,
    reviewCount: 94,
    productCount: 18,
    serviceCount: 4,
    isOpen: false,
    openingHours: "Opens at 10:30 AM",
    isVerified: true,
    isDemo: true,
    deliverySpeed: "Next-Day Delivery",
    features: ["Ayurvedic Consultations", "Refill Station"],
  },
  {
    id: "biz-007",
    type: "business",
    name: "Cacao & Crumb Patisserie",
    category: "Food & Cafés",
    tagline:
      "French artisanal boulangerie, custom celebration cakes & truffles",
    description:
      "Parisian-inspired bakery baking crusty sourdough loaves, delicate macarons, and customized wedding hampers.",
    city: "Lucknow",
    area: "Hazratganj",
    address: "Sapru Marg, Hazratganj",
    pincode: "226001",
    distanceKm: 3.0,
    image:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
    logo: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=200&q=80",
    rating: 4.9,
    reviewCount: 412,
    productCount: 30,
    serviceCount: 2,
    isOpen: true,
    openingHours: "9:00 AM – 10:30 PM",
    isVerified: true,
    isDemo: true,
    deliverySpeed: "Express 45-Min Local Dispatch",
    features: ["Eggless Options", "Live Cake Counters", "Gift Packaging"],
  },
  {
    id: "biz-tutor-001",
    type: "business",
    name: "Apex Scholars Academy & NEET-JEE Institute",
    category: "Education",
    tagline: "Premier IIT-JEE, NEET & CBSE Board Coaching (Class 9-12)",
    description:
      "Reputed local coaching centre with small batch sizes, top IIT/NIT faculty, personal doubt sessions, and weekly mock test series.",
    city: "Lucknow",
    area: "Gomti Nagar",
    address: "B-Block, Near Patrakarpuram Crossing, Gomti Nagar",
    pincode: "226010",
    distanceKm: 1.4,
    image:
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80",
    logo: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=200&q=80",
    rating: 4.9,
    reviewCount: 380,
    productCount: 8,
    serviceCount: 6,
    isOpen: true,
    openingHours: "8:00 AM – 8:00 PM",
    isVerified: true,
    isDemo: true,
    deliverySpeed: "Immediate Enrollment & Free Demo",
    features: [
      "Free Demo Class",
      "Air-Conditioned Study Library",
      "Weekly Test Series",
      "Small Batch of 25 Students",
    ],
  },
  {
    id: "biz-tutor-002",
    type: "business",
    name: "GuruKool Certified Home Tutors Bureau",
    category: "Education",
    tagline: "1-on-1 Verified Home Tutors for CBSE, ICSE & State Boards",
    description:
      "Trusted network of over 500+ verified home tutors and subject matter experts for Class 1 to 12 across Mathematics, Science, and Languages.",
    city: "Lucknow",
    area: "Hazratganj",
    address: "Mayfair Building, MG Marg, Hazratganj",
    pincode: "226001",
    distanceKm: 2.9,
    image:
      "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=800&q=80",
    logo: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=200&q=80",
    rating: 4.8,
    reviewCount: 220,
    productCount: 4,
    serviceCount: 12,
    isOpen: true,
    openingHours: "9:00 AM – 7:30 PM",
    isVerified: true,
    isDemo: true,
    deliverySpeed: "Tutor Match within 24 Hours",
    features: [
      "Background Verified Teachers",
      "Doorstep Visits",
      "Affordable Monthly Fee",
      "Free 1st Trial Session",
    ],
  },
];

export const NEARBY_SERVICES = [
  {
    id: "serv-001",
    type: "service",
    title: "Therapeutic Ayurvedic Abhyanga & Head Massage",
    providerName: "Sattva Herbal Spa & Wellness",
    category: "Beauty & Wellness",
    startingPrice: 1299,
    duration: "60 mins",
    city: "Lucknow",
    area: "Gomti Nagar",
    distanceKm: 2.2,
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80",
    rating: 4.9,
    reviewCount: 88,
    availability: "Available Today",
    isDemo: true,
    description:
      "Relaxing full body herbal oil massage with steam therapy for stress relief and deep muscle rejuvenation.",
    bookingType: "Doorstep or In-Clinic",
  },
  {
    id: "serv-002",
    type: "service",
    title: "Candid Event & Portrait Photography Session",
    providerName: "ShutterStories Creative Studio",
    category: "Services",
    startingPrice: 4500,
    duration: "2-3 hours",
    city: "Lucknow",
    area: "Hazratganj",
    distanceKm: 3.4,
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80",
    rating: 4.8,
    reviewCount: 65,
    availability: "Booking by Appointment",
    isDemo: true,
    description:
      "Professional candid photography for birthdays, anniversaries, commercial products, or personal portraits.",
    bookingType: "On-Location",
  },
  {
    id: "serv-003",
    type: "service",
    title: "Custom Tailoring & Chikankari Alteration",
    providerName: "Noor Heritage Weaves Atelier",
    category: "Fashion",
    startingPrice: 599,
    duration: "24-48 hours",
    city: "Lucknow",
    area: "Hazratganj",
    distanceKm: 3.2,
    image:
      "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=600&q=80",
    rating: 4.9,
    reviewCount: 112,
    availability: "Drop-off & Delivery",
    isDemo: true,
    description:
      "Expert garment bespoke tailoring, precision fitting, and restoration for heirloom ethnic outfits.",
    bookingType: "In-Store & Pickup",
  },
  {
    id: "serv-004",
    type: "service",
    title: "Home Acoustic & Hi-Fi Installation Consultation",
    providerName: "Apex Audio & Gadget Hub",
    category: "Electronics",
    startingPrice: 999,
    duration: "90 mins",
    city: "Lucknow",
    area: "Gomti Nagar",
    distanceKm: 2.8,
    image:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=600&q=80",
    rating: 4.7,
    reviewCount: 34,
    availability: "Same-Day Slots",
    isDemo: true,
    description:
      "On-site sound calibration, home theatre acoustic layout planning, and cable management diagnostics.",
    bookingType: "At-Home Visit",
  },
  {
    id: "serv-005",
    type: "service",
    title: "Eco-Friendly Deep Home Cleaning & Sanitization",
    providerName: "SparkleClean Urban Services",
    category: "Services",
    startingPrice: 1899,
    duration: "3-4 hours",
    city: "Lucknow",
    area: "Aliganj",
    distanceKm: 4.1,
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80",
    rating: 4.8,
    reviewCount: 178,
    availability: "Available Tomorrow",
    isDemo: true,
    description:
      "Certified eco-friendly deep cleaning for kitchens, bathrooms, sofas, and full residence layouts.",
    bookingType: "Doorstep Service",
  },
  {
    id: "serv-tutor-001",
    type: "service",
    title: "Class 9-12 CBSE/ICSE Maths & Science Home Tuitions",
    providerName: "GuruKool Certified Home Tutors Bureau",
    category: "Services",
    startingPrice: 3500,
    duration: "Monthly (3 sessions / week)",
    city: "Lucknow",
    area: "Gomti Nagar",
    distanceKm: 1.2,
    image:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80",
    rating: 4.9,
    reviewCount: 164,
    availability: "Free Demo Slot Available",
    isDemo: true,
    description:
      "Dedicated 1-on-1 personalized home tutoring in Mathematics, Physics, Chemistry, and Biology with board exam past paper drills.",
    bookingType: "Home Visit / In-Person",
  },
  {
    id: "serv-tutor-002",
    type: "service",
    title: "NEET & JEE Foundation Physics Mastery Batch",
    providerName: "Apex Scholars Academy & NEET-JEE Institute",
    category: "Services",
    startingPrice: 5500,
    duration: "Quarterly Foundation Module",
    city: "Lucknow",
    area: "Gomti Nagar",
    distanceKm: 1.4,
    image:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80",
    rating: 4.9,
    reviewCount: 210,
    availability: "New Batch Starting This Week",
    isDemo: true,
    description:
      "Rigorous concept problem-solving, daily DPP sheets, formula workbooks, and Sunday mock tests by experienced faculty.",
    bookingType: "In-Institute Class",
  },
  {
    id: "serv-tutor-003",
    type: "service",
    title: "Spoken English & Interview Communication Coaching",
    providerName: "WordCraft Language Studio",
    category: "Services",
    startingPrice: 2200,
    duration: "30 Days Intensive Course",
    city: "Lucknow",
    area: "Hazratganj",
    distanceKm: 2.7,
    image:
      "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=600&q=80",
    rating: 4.8,
    reviewCount: 92,
    availability: "Evening & Weekend Batches",
    isDemo: true,
    description:
      "Interactive conversation drills, grammar enhancement, accent refinement, and corporate interview readiness sessions.",
    bookingType: "Hybrid (Online & Centre)",
  },
];

export const NEARBY_FOOD_PLACES = [
  {
    id: "food-001",
    type: "food",
    name: "The Urban Tandoor & Grill",
    cuisine: "North Indian & Mughlai",
    priceRange: "₹₹₹",
    rating: 4.8,
    reviewCount: 320,
    city: "Lucknow",
    area: "Gomti Nagar",
    distanceKm: 1.5,
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80",
    timings: "12:30 PM – 11:30 PM",
    specialty: "Galouti Kebabs, Dum Biryani & Roomali Roti",
    isDemo: true,
    dietary: ["Halal Certified", "Vegetarian Options"],
  },
  {
    id: "food-002",
    type: "food",
    name: "Chai Stories & Library Café",
    cuisine: "Café, Sandwiches & Beverages",
    priceRange: "₹",
    rating: 4.7,
    reviewCount: 245,
    city: "Lucknow",
    area: "Hazratganj",
    distanceKm: 2.9,
    image:
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80",
    timings: "9:00 AM – 10:00 PM",
    specialty: "Kulhad Masala Chai, Bun Makkhan & Sourdough Toast",
    isDemo: true,
    dietary: ["Pure Veg Options", "Vegan Milk Available"],
  },
  {
    id: "food-003",
    type: "food",
    name: "Cacao & Crumb Dessert Lounge",
    cuisine: "European Patisserie & Desserts",
    priceRange: "₹₹",
    rating: 4.9,
    reviewCount: 412,
    city: "Lucknow",
    area: "Hazratganj",
    distanceKm: 3.0,
    image:
      "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=600&q=80",
    timings: "9:00 AM – 10:30 PM",
    specialty: "Belgium Chocolate Eclairs & Pistachio Croissant",
    isDemo: true,
    dietary: ["100% Eggless Section", "Gluten-Free Treats"],
  },
];

export const NEARBY_GIFTS = [
  {
    id: "gift-001",
    type: "gift",
    title: "Handcrafted Luxury Festive Hamper",
    category: "Gifts & Personalised",
    price: 1899,
    originalPrice: 2499,
    occasion: "Festive & Diwali",
    city: "Lucknow",
    area: "Gomti Nagar",
    distanceKm: 1.8,
    image:
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80",
    businessName: "Heritage Gift Studio",
    deliveryBadge: "Instant 3-Hour Delivery",
    includes: [
      "Brass Diya",
      "Artisanal Dry Fruit Box",
      "Aroma Wax Candle",
      "Custom Note",
    ],
    isDemo: true,
  },
  {
    id: "gift-002",
    type: "gift",
    title: "Fresh Blooming Orchid & Macaron Gift Crate",
    category: "Gifts & Personalised",
    price: 1250,
    originalPrice: 1550,
    occasion: "Birthday & Anniversary",
    city: "Lucknow",
    area: "Hazratganj",
    distanceKm: 3.0,
    image:
      "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80",
    businessName: "Cacao & Crumb Patisserie",
    deliveryBadge: "Same-Day Delivery",
    includes: [
      "Live Purple Orchid Stem",
      "Box of 6 Macarons",
      "Satin Ribbon Box",
    ],
    isDemo: true,
  },
  {
    id: "gift-003",
    type: "gift",
    title: "Custom Engraved Leather Journal & Fountain Pen Set",
    category: "Gifts & Personalised",
    price: 999,
    originalPrice: 1299,
    occasion: "Corporate & Keepsake",
    city: "Lucknow",
    area: "Gomti Nagar",
    distanceKm: 2.4,
    image:
      "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=600&q=80",
    businessName: "Mitti & Clay Studio",
    deliveryBadge: "Next-Day Dispatch",
    includes: [
      "Full Grain Leather Diary",
      "Refillable Brass Pen",
      "Personalized Monogram",
    ],
    isDemo: true,
  },
];

export const NEARBY_EVENTS = [
  {
    id: "event-001",
    type: "event",
    title: "Weekend Pottery & Clay Wheel Masterclass",
    host: "Mitti & Clay Studio",
    category: "Events & Experiences",
    date: "Saturday, 4:00 PM – 6:30 PM",
    entryPrice: 1200,
    city: "Lucknow",
    area: "Gomti Nagar",
    distanceKm: 1.8,
    image:
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=600&q=80",
    spotsLeft: 4,
    isDemo: true,
    description:
      "Hands-on pottery workshop guided by master potters. Take home your own fired terracotta creation.",
  },
  {
    id: "event-002",
    type: "event",
    title: "Live Acoustic Garden Sunset Session",
    host: "The Roastery Coffee House",
    category: "Events & Experiences",
    date: "Sunday, 6:00 PM – 8:30 PM",
    entryPrice: 350,
    city: "Lucknow",
    area: "Gomti Nagar",
    distanceKm: 2.1,
    image:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    spotsLeft: 12,
    isDemo: true,
    description:
      "Enjoy indie acoustic melodies under fairy lights with specialty iced pour-overs and hot bites.",
  },
];

export const NEARBY_PLACES = [
  {
    id: "place-001",
    type: "place",
    name: "Gomti Riverfront Promenade",
    category: "Places to Explore",
    placeType: "Public Park & Walkway",
    city: "Lucknow",
    area: "Gomti Nagar",
    distanceKm: 1.2,
    image:
      "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=600&q=80",
    description:
      "Serene waterfront walking tracks, cycling lanes, and sunset viewing spots along the Gomti River.",
    isPublicPlace: true,
    timings: "Open 5:00 AM – 10:00 PM",
    isDemo: true,
  },
  {
    id: "place-002",
    type: "place",
    name: "Heritage Hazratganj Victorian Market Walk",
    category: "Places to Explore",
    placeType: "Historic Shopping Street",
    city: "Lucknow",
    area: "Hazratganj",
    distanceKm: 3.1,
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80",
    description:
      "Colonial-style lamp-lit architecture, century-old bookstores, iconic tea joints, and boutique handicraft arcades.",
    isPublicPlace: true,
    timings: "All Day Promenade",
    isDemo: true,
  },
  {
    id: "place-003",
    type: "place",
    name: "Dr. Ram Manohar Lohia Botanical Park",
    category: "Places to Explore",
    placeType: "Botanical Garden",
    city: "Lucknow",
    area: "Gomti Nagar",
    distanceKm: 2.0,
    image:
      "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=600&q=80",
    description:
      "Sprawling landscaped green park with open-air amphitheatre, jogging trails, and migratory bird lake.",
    isPublicPlace: true,
    timings: "6:00 AM – 8:00 PM",
    isDemo: true,
  },
];

export const NEARBY_OFFERS = [
  {
    id: "offer-001",
    type: "offer",
    code: "LOCALMITTI20",
    title: "Flat 20% OFF on Handmade Ceramics",
    businessName: "Mitti & Clay Studio",
    category: "Home & Living",
    discount: "20% OFF",
    validTill: "Valid through this Sunday",
    description:
      "Applicable on all handmade terracotta tableware and planters above ₹999.",
    city: "Lucknow",
    area: "Gomti Nagar",
    distanceKm: 1.8,
    ctaText: "Claim in Store or Online",
    isDemo: true,
  },
  {
    id: "offer-002",
    type: "offer",
    code: "ROASTERYBREW",
    title: "Free Cold Brew on Coffee Orders above ₹499",
    businessName: "The Roastery Coffee House",
    category: "Food & Cafés",
    discount: "Free Beverage",
    validTill: "Valid till end of month",
    description:
      "Order any fresh roast or all-day meal and get a signature cascara or cold brew on the house.",
    city: "Lucknow",
    area: "Gomti Nagar",
    distanceKm: 2.1,
    ctaText: "View Café Menu",
    isDemo: true,
  },
  {
    id: "offer-003",
    type: "offer",
    code: "NOORHERITAGE15",
    title: "Flat ₹500 OFF on Hand-Embroidered Apparel",
    businessName: "Noor Heritage Weaves",
    category: "Fashion",
    discount: "₹500 OFF",
    validTill: "Limited local vouchers",
    description:
      "Applicable on artisanal Chikankari georgette and mulmul festive sets.",
    city: "Lucknow",
    area: "Hazratganj",
    distanceKm: 3.2,
    ctaText: "Explore Collection",
    isDemo: true,
  },
  {
    id: "offer-004",
    type: "offer",
    code: "WELLNESSSPA300",
    title: "Flat ₹300 OFF First Ayurvedic Therapy",
    businessName: "Sattva Herbal Spa & Wellness",
    category: "Beauty & Wellness",
    discount: "₹300 OFF",
    validTill: "Valid on online appointment",
    description:
      "Experience authentic Abhyanga or Shirodhara with pure herbal oils at introductory pricing.",
    city: "Lucknow",
    area: "Gomti Nagar",
    distanceKm: 2.2,
    ctaText: "Book Appointment",
    isDemo: true,
  },
];

export const EXPLORE_HERO_PROMO = {
  banner: {
    id: "promo-travel",
    title: "Discover More, Travel Better",
    subtitle:
      "Explore flights, hotels, holidays and amazing travel experiences",
    actionText: "Explore Now",
    badge: "TRAVEL SPECIAL",
    partner: "Powered by EaseMyTrip",
    link: "/explore-nearby?category=travel",
    image:
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=85",
    bgGradient: "from-sky-400 via-yellow-300 to-amber-200",
  },

  cards: [
    {
      id: "promo-b2b",
      title: "B2B & BUSINESSES",
      subtitle: "Connect with local businesses",
      badge: "Verified",
      bgGradient: "from-blue-600 to-cyan-600",
      image:
        "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=500&q=80",
      query: "businesses",
    },
    {
      id: "promo-repairs",
      title: "REPAIRS & SERVICES",
      subtitle: "Find trusted service providers",
      badge: "Quick Service",
      bgGradient: "from-blue-800 to-indigo-900",
      image:
        "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=500&q=80",
      query: "services",
    },
    {
      id: "promo-realestate",
      title: "REAL ESTATE",
      subtitle: "Discover homes, rent & buy",
      badge: "Find Properties",
      bgGradient: "from-purple-700 to-violet-900",
      image:
        "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=500&q=80",
      query: "real-estate",
    },
    {
      id: "promo-doctors",
      title: "DOCTORS & HEALTHCARE",
      subtitle: "Find clinics and specialists",
      badge: "Healthcare",
      bgGradient: "from-emerald-600 to-teal-800",
      image:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=500&q=80",
      query: "doctors",
    },
    {
      id: "promo-education",
      title: "EDUCATION",
      subtitle: "Schools, colleges & coaching",
      badge: "Learn Nearby",
      bgGradient: "from-indigo-600 to-blue-800",
      image:
        "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=500&q=80",
      query: "education",
    },
    {
      id: "promo-jobs",
      title: "JOBS & CAREERS",
      subtitle: "Find jobs and career opportunities",
      badge: "Career Hub",
      bgGradient: "from-slate-700 to-blue-950",
      image:
        "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=500&q=80",
      query: "jobs",
    },
    {
      id: "promo-food",
      title: "FOOD & RESTAURANTS",
      subtitle: "Discover cafes and local food",
      badge: "Popular Nearby",
      bgGradient: "from-orange-500 to-red-700",
      image:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=500&q=80",
      query: "food",
    },
    {
      id: "promo-shopping",
      title: "SHOPPING & RETAIL",
      subtitle: "Explore stores, shops & products",
      badge: "Shop Local",
      bgGradient: "from-pink-600 to-rose-800",
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=500&q=80",
      query: "shopping",
    },
    {
      id: "promo-beauty",
      title: "BEAUTY & SALONS",
      subtitle: "Salons, spas & grooming",
      badge: "Self Care",
      bgGradient: "from-fuchsia-600 to-purple-900",
      image:
        "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=500&q=80",
      query: "beauty",
    },
    {
      id: "promo-fitness",
      title: "FITNESS & SPORTS",
      subtitle: "Gyms, yoga & sports clubs",
      badge: "Stay Active",
      bgGradient: "from-green-600 to-emerald-900",
      image:
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=500&q=80",
      query: "fitness",
    },
    {
      id: "promo-events",
      title: "EVENTS & VENUES",
      subtitle: "Find event spaces and experiences",
      badge: "Make Memories",
      bgGradient: "from-violet-600 to-purple-950",
      image:
        "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=500&q=80",
      query: "events",
    },
    {
      id: "promo-hotels",
      title: "HOTELS & STAYS",
      subtitle: "Find hotels and places to stay",
      badge: "Stay Nearby",
      bgGradient: "from-cyan-600 to-blue-900",
      image:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=500&q=80",
      query: "hotels",
    },
    {
      id: "promo-automotive",
      title: "AUTOMOTIVE",
      subtitle: "Car repair, washing & dealerships",
      badge: "Auto Care",
      bgGradient: "from-gray-700 to-slate-950",
      image:
        "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=500&q=80",
      query: "automotive",
    },
    {
      id: "promo-home",
      title: "HOME & LIVING",
      subtitle: "Furniture, interiors & home services",
      badge: "For Your Home",
      bgGradient: "from-amber-600 to-orange-900",
      image:
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=500&q=80",
      query: "home-living",
    },
    {
      id: "promo-logistics",
      title: "DELIVERY & LOGISTICS",
      subtitle: "Courier, parcel & delivery services",
      badge: "Send Anything",
      bgGradient: "from-teal-600 to-cyan-900",
      image:
        "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=500&q=80",
      query: "logistics",
    },
  ],
};

export const EXPLORE_QUICK_ICONS = [
  // Row 1 (first 9 items)
  {
    id: "restaurants",
    name: "Restaurants",
    icon: "Utensils",
    color: "text-amber-600 bg-amber-50 border-amber-200",
    slug: "food",
  },
  {
    id: "hotels",
    name: "Hotels",
    icon: "Hotel",
    color: "text-blue-600 bg-blue-50 border-blue-200",
    slug: "hotels",
  },
  {
    id: "beauty-spa",
    name: "Beauty Spa",
    icon: "Sparkles",
    color: "text-pink-600 bg-pink-50 border-pink-200",
    slug: "beauty",
  },
  {
    id: "home-decor",
    name: "Home Decor",
    icon: "Home",
    color: "text-teal-600 bg-teal-50 border-teal-200",
    slug: "home",
  },
  {
    id: "tuitions-coaching",
    name: "Tuitions & Coaching",
    icon: "GraduationCap",
    color: "text-indigo-600 bg-indigo-50 border-indigo-200",
    badge: "HOT",
    slug: "education",
  },
  {
    id: "ask-astro",
    name: "Ask Astro",
    icon: "Compass",
    color: "text-purple-600 bg-purple-50 border-purple-200",
    badge: "NEW",
    slug: "astrology",
  },
  {
    id: "wedding",
    name: "Wedding Planning",
    icon: "HeartHandshake",
    color: "text-rose-600 bg-rose-50 border-rose-200",
    slug: "wedding",
  },
  {
    id: "rent-hire",
    name: "Rent & Hire",
    icon: "KeyRound",
    color: "text-emerald-600 bg-emerald-50 border-emerald-200",
    slug: "rentals",
  },
  {
    id: "hospitals",
    name: "Hospitals",
    icon: "Activity",
    color: "text-red-600 bg-red-50 border-red-200",
    slug: "hospitals",
  },

  // Row 2
  {
    id: "home-tutors",
    name: "Home Tutors",
    icon: "GraduationCap",
    color: "text-blue-700 bg-blue-50 border-blue-200",
    badge: "VERIFIED",
    slug: "education",
  },
  {
    id: "contractors",
    name: "Contractors",
    icon: "Hammer",
    color: "text-yellow-700 bg-yellow-50 border-yellow-200",
    slug: "contractors",
  },
  {
    id: "pet-shops",
    name: "Pet Shops",
    icon: "PawPrint",
    color: "text-orange-600 bg-orange-50 border-orange-200",
    slug: "pets",
  },
  {
    id: "pg-hostels",
    name: "PG / Hostels",
    icon: "BedDouble",
    color: "text-cyan-600 bg-cyan-50 border-cyan-200",
    slug: "pg-hostels",
  },
  {
    id: "estate-agent",
    name: "Estate Agent",
    icon: "Building2",
    color: "text-sky-600 bg-sky-50 border-sky-200",
    slug: "real-estate",
  },
  {
    id: "dentists",
    name: "Dentists",
    icon: "Stethoscope",
    color: "text-blue-700 bg-blue-50 border-blue-200",
    slug: "dentists",
  },
  {
    id: "gym",
    name: "Gym & Fitness",
    icon: "Dumbbell",
    color: "text-lime-700 bg-lime-50 border-lime-200",
    slug: "gym",
  },
  {
    id: "loans",
    name: "Loans & Finance",
    icon: "Landmark",
    color: "text-emerald-700 bg-emerald-50 border-emerald-200",
    slug: "finance",
  },
  {
    id: "event-organisers",
    name: "Event Organisers",
    icon: "PartyPopper",
    color: "text-fuchsia-600 bg-fuchsia-50 border-fuchsia-200",
    slug: "events",
  },

  // Row 3
  {
    id: "neet-jee",
    name: "NEET & JEE Coaching",
    icon: "GraduationCap",
    color: "text-purple-700 bg-purple-50 border-purple-200",
    badge: "TOP",
    slug: "education",
  },
  {
    id: "languages-music",
    name: "Language & Music",
    icon: "Sparkles",
    color: "text-pink-700 bg-pink-50 border-pink-200",
    slug: "education",
  },
  {
    id: "driving-schools",
    name: "Driving Schools",
    icon: "Car",
    color: "text-slate-700 bg-slate-50 border-slate-200",
    slug: "driving",
  },
  {
    id: "packers-movers",
    name: "Packers & Movers",
    icon: "Truck",
    color: "text-amber-700 bg-amber-50 border-amber-200",
    slug: "movers",
  },
  {
    id: "courier-logistics",
    name: "Courier & Cargo",
    icon: "Truck",
    color: "text-blue-600 bg-blue-50 border-blue-200",
    slug: "services",
  },
  {
    id: "chartered-accountants",
    name: "CA & Taxation",
    icon: "Landmark",
    color: "text-emerald-800 bg-emerald-50 border-emerald-200",
    slug: "businesses",
  },
  {
    id: "car-care",
    name: "Car Care & Repair",
    icon: "Car",
    color: "text-rose-700 bg-rose-50 border-rose-200",
    slug: "services",
  },
  {
    id: "popular-categories",
    name: "All Categories",
    icon: "LayoutGrid",
    color: "text-blue-600 bg-blue-100 border-blue-300",
    slug: "all",
  },
];

export const EXPLORE_CURATED_COLLECTIONS = [
  {
    id: "col-education",
    title: "Education & Tuitions",
    items: [
      {
        name: "Home Tutors",
        image:
          "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400&q=80",
        count: "120+ tutors",
        slug: "education",
      },
      {
        name: "NEET & JEE Coaching",
        image:
          "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=400&q=80",
        count: "24 academies",
        slug: "education",
      },
      {
        name: "CBSE & ICSE Classes",
        image:
          "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=400&q=80",
        count: "45 centres",
        slug: "education",
      },
    ],
  },
  {
    id: "col-wedding",
    title: "Wedding Requisites",
    items: [
      {
        name: "Banquet Halls",
        image:
          "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=400&q=80",
        count: "48 options",
        slug: "wedding",
      },
      {
        name: "Bridal Requisites",
        image:
          "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=400&q=80",
        count: "32 studios",
        slug: "fashion",
      },
      {
        name: "Caterers",
        image:
          "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=400&q=80",
        count: "29 vendors",
        slug: "food",
      },
    ],
  },
  {
    id: "col-beauty",
    title: "Beauty & Spa",
    items: [
      {
        name: "Beauty Parlours",
        image:
          "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=400&q=80",
        count: "65 salons",
        slug: "beauty",
      },
      {
        name: "Spa & Massages",
        image:
          "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=400&q=80",
        count: "18 centres",
        slug: "beauty",
      },
      {
        name: "Salons",
        image:
          "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80",
        count: "54 branches",
        slug: "beauty",
      },
    ],
  },
  {
    id: "col-repairs",
    title: "Repairs & Services",
    items: [
      {
        name: "AC Service",
        image:
          "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=400&q=80",
        count: "Instant visit",
        slug: "services",
      },
      {
        name: "Car Service",
        image:
          "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=400&q=80",
        count: "Pick & Drop",
        slug: "services",
      },
      {
        name: "Bike Service",
        image:
          "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=400&q=80",
        count: "Doorstep",
        slug: "services",
      },
    ],
  },
  {
    id: "col-daily",
    title: "Daily Needs",
    items: [
      {
        name: "Movies & Fun",
        image:
          "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=400&q=80",
        count: "In Theatres",
        slug: "movies",
      },
      {
        name: "Grocery",
        image:
          "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80",
        count: "10-Min Fast",
        slug: "products",
      },
      {
        name: "Electricians",
        image:
          "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=400&q=80",
        count: "Top Rated",
        slug: "services",
      },
    ],
  },
];

export const EXPLORE_TRAVEL_BOOKINGS = [
  {
    id: "travel-flight",
    name: "Flight",
    subtitle: "Lowest Airfares",
    icon: "Plane",
    link: "/explore-nearby?category=travel",
  },
  {
    id: "travel-bus",
    name: "Bus",
    subtitle: "Affordable Rides",
    icon: "Bus",
    link: "/explore-nearby?category=travel",
  },
  {
    id: "travel-train",
    name: "Train",
    subtitle: "Live Status & Seats",
    icon: "Train",
    link: "/explore-nearby?category=travel",
  },
  {
    id: "travel-hotel",
    name: "Hotel",
    subtitle: "Budget-Friendly Stays",
    icon: "Building",
    link: "/explore-nearby?category=hotels",
  },
  {
    id: "travel-car",
    name: "Car Rentals",
    subtitle: "Drive Easy Anywhere",
    icon: "Car",
    link: "/explore-nearby?category=services",
  },
];

export const EXPLORE_TRENDING_SEARCHES = [
  {
    id: "trend-tutor",
    title: "Home Tutors for Class 10 & 12",
    image:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=300&q=80",
    badge: "Hot",
    category: "services",
  },
  {
    id: "trend-neet",
    title: "NEET & JEE Coaching Hubs",
    image:
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=300&q=80",
    badge: "Trending",
    category: "businesses",
  },
  {
    id: "trend-1",
    title: "Real Estate Agents",
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=300&q=80",
    badge: "Trending",
    category: "businesses",
  },
  {
    id: "trend-2",
    title: "Paying Guest Accommodations",
    image:
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=300&q=80",
    badge: "Hot",
    category: "businesses",
  },
  {
    id: "trend-3",
    title: "Cinema Halls & Multiplexes",
    image:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=300&q=80",
    badge: "Popular",
    category: "places",
  },
  {
    id: "trend-4",
    title: "Parks & Recreation",
    image:
      "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=300&q=80",
    badge: "Weekend",
    category: "places",
  },
];

export const EXPLORE_LATEST_MOVIES = [
  {
    id: "movie-1",
    title: "Udta Teer",
    language: "Hindi • 2D",
    ratingScore: "88%",
    genre: "Action / Drama",
    image:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=400&q=80",
    slug: "movies",
  },
  {
    id: "movie-2",
    title: "Drishyam: The Conclusion",
    language: "Hindi • 2D",
    ratingScore: "92%",
    genre: "Suspense / Thriller",
    image:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=400&q=80",
    slug: "movies",
  },
  {
    id: "movie-3",
    title: "Prahaar",
    language: "Hindi • 2D",
    ratingScore: "86%",
    genre: "Crime / Investigation",
    image:
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=400&q=80",
    slug: "movies",
  },
  {
    id: "movie-4",
    title: "Nayyi Naveli",
    language: "Hindi • 2D",
    ratingScore: "90%",
    genre: "Romantic Comedy",
    image:
      "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=400&q=80",
    slug: "movies",
  },
  {
    id: "movie-5",
    title: "Rajni The Jailer 2",
    language: "Tamil / Hindi • 2D",
    ratingScore: "85%",
    genre: "Action Blockbuster",
    image:
      "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=400&q=80",
    slug: "movies",
  },
];

export const EXPLORE_TOP_TOURIST_PLACES = [
  {
    id: "tour-mumbai",
    name: "Mumbai",
    subtitle: "Gateway of India, Marine Drive",
    image:
      "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=400&q=80",
    city: "Mumbai",
  },
  {
    id: "tour-pune",
    name: "Pune",
    subtitle: "Shaniwar Wada, Sinhagad Fort",
    image:
      "https://images.unsplash.com/photo-1595658658481-d53d3f999875?auto=format&fit=crop&w=400&q=80",
    city: "Pune",
  },
  {
    id: "tour-nashik",
    name: "Nashik",
    subtitle: "Trimbakeshwar, Sula Vineyards",
    image:
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=400&q=80",
    city: "Nashik",
  },
  {
    id: "tour-ahmedabad",
    name: "Ahmedabad",
    subtitle: "Sabarmati Ashram, Adalaj Stepwell",
    image:
      "https://images.unsplash.com/photo-1606298855672-3efb63017be8?auto=format&fit=crop&w=400&q=80",
    city: "Ahmedabad",
  },
  {
    id: "tour-lucknow",
    name: "Lucknow",
    subtitle: "Bara Imambara, Rumi Darwaza",
    image:
      "https://images.unsplash.com/photo-1588416936097-41850ab3d86d?auto=format&fit=crop&w=400&q=80",
    city: "Lucknow",
  },
];

export const EXPLORE_POPULAR_SEARCHES = [
  {
    id: "pop-1",
    title: "Interior Designers",
    subtitle: "Transform your living space with verified local architects",
    image:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=500&q=80",
    ctaText: "Enquire Now",
    actionType: "enquiry",
    category: "services",
  },
  {
    id: "pop-2",
    title: "Real Estate Agents",
    subtitle: "Buy, sell or rent verified apartments and commercial plots",
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=500&q=80",
    ctaText: "Enquire Now",
    actionType: "enquiry",
    category: "businesses",
  },
  {
    id: "pop-3",
    title: "Caterers",
    subtitle: "Authentic multi-cuisine banquets & bespoke catering",
    image:
      "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=500&q=80",
    ctaText: "Enquire Now",
    actionType: "enquiry",
    category: "food",
  },
  {
    id: "pop-4",
    title: "Car Rental",
    subtitle: "Self-drive & chauffeur driven sedans, SUVs & tempo travellers",
    image:
      "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=500&q=80",
    ctaText: "Enquire Now",
    actionType: "enquiry",
    category: "services",
  },
  {
    id: "pop-5",
    title: "Gynaecologist & Obstetrician Doctors",
    subtitle: "Top rated women healthcare & maternal clinics",
    image:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=500&q=80",
    ctaText: "Explore",
    actionType: "explore",
    category: "doctors",
  },
];

export const EXPLORE_SEASONAL_ESSENTIALS = [
  {
    id: "season-1",
    title: "Water Suppliers",
    image:
      "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=300&q=80",
    slug: "services",
  },
  {
    id: "season-2",
    title: "Fan Dealers",
    image:
      "https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=300&q=80",
    slug: "businesses",
  },
  {
    id: "season-3",
    title: "Juice Centres",
    image:
      "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=300&q=80",
    slug: "food",
  },
  {
    id: "season-4",
    title: "Mineral Water Suppliers",
    image:
      "https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=300&q=80",
    slug: "services",
  },
];

export const EXPLORE_FESTIVE_DEMANDS = [
  {
    id: "festive-1",
    title: "Band Services",
    image:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=300&q=80",
    slug: "services",
  },
  {
    id: "festive-2",
    title: "DJ Services",
    image:
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=300&q=80",
    slug: "services",
  },
  {
    id: "festive-3",
    title: "Musical Bands",
    image:
      "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=300&q=80",
    slug: "services",
  },
  {
    id: "festive-4",
    title: "Sound System Rentals",
    image:
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=300&q=80",
    slug: "services",
  },
];

export const EXPLORE_RECENT_ACTIVITY = [
  {
    id: "act-1",
    businessId: "biz-001",
    businessName: "Country Club India Ltd",
    location: "Andheri West – Mumbai",
    whatsappNumber: "919876543210",
    user: "Zayd Ansari",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    rating: 5,
    review:
      "Country Club India Ltd has a great atmosphere. Excellent place to unwind and exercise. Highly recommended!",
    coverImage:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "act-2",
    businessId: "biz-002",
    businessName: "Hire In Global",
    location: "Kurla – Mumbai",
    whatsappNumber: "919876543211",
    user: "Rizvi",
    avatar:
      "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80",
    rating: 5,
    review:
      "I like this apparel & recruitment network! It is really very helpful and amazing and gave a reputed vibe in customer products and designation.",
    coverImage:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "act-3",
    businessId: "biz-003",
    businessName: "Debt Free And Settlement Financial",
    location: "Ulhasnagar No 4 – Mumbai",
    whatsappNumber: "919876543212",
    user: "Shrikant Jagtap",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    rating: 5,
    review:
      "Debt free and financial consultancy service helped solve my queries smoothly within 48 hours. Clear guidance!",
    coverImage:
      "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "act-4",
    businessId: "biz-004",
    businessName: "Mumbai Diagnostic Centre LLP",
    location: "Shri Ganesh Chawl-Vile Parle East",
    whatsappNumber: "919876543213",
    user: "Ramesh Tiwari",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    rating: 5,
    review:
      "Nice for pat team, friendly staff, prompt blood report dispatch and hygienic testing labs.",
    coverImage:
      "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "act-5",
    businessId: "biz-007",
    businessName: "National Academy",
    location: "Virar West – Mumbai",
    whatsappNumber: "919876543214",
    user: "Amol Chavan",
    avatar:
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=150&q=80",
    rating: 5,
    review:
      "It was very good academy in Virar West. It was a great experience being there, informative coaching for students.",
    coverImage:
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=600&q=80",
  },
];
