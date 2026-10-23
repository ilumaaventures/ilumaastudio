import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  Compass,
  MapPin,
  List,
  Map as MapIcon,
  Filter,
  SlidersHorizontal,
  Bookmark,
  Sparkles,
  ShoppingBag,
  Store,
  Coffee,
  Gift,
  Tag,
  Trees,
  RotateCcw,
  Search,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  getNearbyAll,
  getNearbyProducts,
  getNearbyBusinesses,
  getNearbyServices,
  getNearbyFoodPlaces,
  getNearbyGifts,
  getNearbyEvents,
  getNearbyPlaces,
  getNearbyOffers,
  getNearbyCategoryCounts,
  getExploreSectionsData,
} from "../../api/nearbyService";
import NearbyLocationHeader from "./components/NearbyLocationHeader";
import NearbyCategoryNav from "./components/NearbyCategoryNav";
import NearbyFeaturedSection from "./components/NearbyFeaturedSection";
import NearbyProductCard from "./components/NearbyProductCard";
import NearbyBusinessCard from "./components/NearbyBusinessCard";
import NearbyServiceCard from "./components/NearbyServiceCard";
import NearbyFoodCard from "./components/NearbyFoodCard";
import NearbyGiftCard from "./components/NearbyGiftCard";
import NearbyOfferCard from "./components/NearbyOfferCard";
import NearbyPlaceCard from "./components/NearbyPlaceCard";
import NearbyMapPlaceholder from "./components/NearbyMapPlaceholder";
import NeighbourhoodPlanner from "./components/NeighbourhoodPlanner";
import NearbyHeroDirectory from "./components/NearbyHeroDirectory";
import NearbyQuickIconsGrid from "./components/NearbyQuickIconsGrid";
import NearbyCuratedShowcase from "./components/NearbyCuratedShowcase";
import NearbyTravelBookings from "./components/NearbyTravelBookings";
import NearbyTrendingSearches from "./components/NearbyTrendingSearches";
import NearbyLatestMovies from "./components/NearbyLatestMovies";
import NearbyTopTouristPlaces from "./components/NearbyTopTouristPlaces";
import NearbyPopularSearches from "./components/NearbyPopularSearches";
import NearbySeasonalSections from "./components/NearbySeasonalSections";
import NearbyRecentActivity from "./components/NearbyRecentActivity";
import NearbyEnquiryModal from "./components/NearbyEnquiryModal";
import toast from "react-hot-toast";
import {
  getSavedLocation,
  saveUserLocation,
  getSavedDistanceRange,
  saveDistanceRange,
} from "../../utils/location";

export default function ExploreNearby() {
  const [searchParams, setSearchParams] = useSearchParams();

  const savedLoc = useMemo(() => getSavedLocation(), []);
  const savedDist = useMemo(() => getSavedDistanceRange(), []);

  // 1. Read query parameters with fallbacks
  const cityParam = searchParams.get("city") || savedLoc?.city || "Lucknow";
  const areaParam = searchParams.get("area") || savedLoc?.area || "Gomti Nagar";
  const pincodeParam =
    searchParams.get("pincode") || savedLoc?.pincode || "226010";
  const radiusParam = Number(searchParams.get("radius")) || savedDist || 15;
  const categoryParam = searchParams.get("category") || "all";
  const queryParam = searchParams.get("q") || "";
  const sortParam = searchParams.get("sort") || "relevance";

  // 2. Local State
  const [activeCategory, setActiveCategory] = useState(categoryParam);
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [radius, setRadius] = useState(radiusParam);
  const [location, setLocation] = useState({
    city: cityParam,
    area: areaParam,
    pincode: pincodeParam,
  });
  const [sortBy, setSortBy] = useState(sortParam);
  const [priceRange, setPriceRange] = useState("");
  const [availability, setAvailability] = useState("");
  const [viewMode, setViewMode] = useState("list"); // "list" | "map"
  const [isPlannerOpen, setIsPlannerOpen] = useState(false);

  // Horizontal Section Scroll Refs
  const productsScrollRef = useRef(null);
  const businessesScrollRef = useRef(null);
  const servicesScrollRef = useRef(null);
  const foodScrollRef = useRef(null);
  const giftsScrollRef = useRef(null);
  const offersScrollRef = useRef(null);
  const placesScrollRef = useRef(null);

  const handleSectionScroll = (ref, direction) => {
    if (ref.current) {
      const offset = direction === "left" ? -300 : 300;
      ref.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  // 3. Persistent Neighbourhood Plan
  const [planItems, setPlanItems] = useState(() => {
    try {
      const saved = localStorage.getItem("ilumaa_neighbourhood_plan");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const plannedItemIds = useMemo(() => planItems.map((i) => i.id), [planItems]);

  const savePlanToStorage = (items) => {
    setPlanItems(items);
    try {
      localStorage.setItem("ilumaa_neighbourhood_plan", JSON.stringify(items));
    } catch (e) {
      console.warn("Storage notice:", e);
    }
  };

  const handleAddToPlan = (item) => {
    if (plannedItemIds.includes(item.id)) {
      const filtered = planItems.filter((i) => i.id !== item.id);
      savePlanToStorage(filtered);
      toast.success(`Removed "${item.name || item.title}" from plan.`);
    } else {
      const next = [...planItems, item];
      savePlanToStorage(next);
      toast.success(
        `Added "${item.name || item.title}" to your neighbourhood plan!`,
        {
          icon: "📌",
        },
      );
    }
  };

  const handleRemoveFromPlan = (id) => {
    const filtered = planItems.filter((i) => i.id !== id);
    savePlanToStorage(filtered);
    toast.success("Stop removed from itinerary.");
  };

  const handleClearPlan = () => {
    savePlanToStorage([]);
    toast.success("Plan cleared.");
  };

  const handleMovePlanItem = (fromIdx, toIdx) => {
    const updated = [...planItems];
    const [moved] = updated.splice(fromIdx, 1);
    updated.splice(toIdx, 0, moved);
    savePlanToStorage(updated);
  };

  // 4. Update URL Query Parameters smoothly
  const updateUrlParams = useCallback(
    (newParams) => {
      const updated = new URLSearchParams(searchParams);
      Object.entries(newParams).forEach(([k, v]) => {
        if (
          v === "" ||
          v === null ||
          v === undefined ||
          (k === "category" && v === "all")
        ) {
          updated.delete(k);
        } else {
          updated.set(k, String(v));
        }
      });
      setSearchParams(updated, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  // Sync state changes with URL
  const handleCategorySelect = (slug) => {
    setActiveCategory(slug);
    updateUrlParams({ category: slug });
  };

  const handleSearchChange = (q) => {
    setSearchQuery(q);
    updateUrlParams({ q });
  };

  const handleRadiusChange = (r) => {
    setRadius(r);
    saveDistanceRange(r);
    updateUrlParams({ radius: r });
  };

  const handleLocationChange = (loc) => {
    setLocation(loc);
    saveUserLocation(loc);
    updateUrlParams({
      city: loc.city,
      area: loc.area,
      pincode: loc.pincode,
    });
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    updateUrlParams({ sort });
  };

  // Synchronize state if changed from Navbar or other components
  useEffect(() => {
    const handleSync = (e) => {
      if (e?.detail) {
        if (e.detail.location) {
          setLocation((prev) => ({
            ...prev,
            ...e.detail.location,
          }));
        }
        if (e.detail.distanceRange) {
          setRadius(e.detail.distanceRange);
        }
      }
    };
    window.addEventListener("ilumaa:location_range_changed", handleSync);
    return () =>
      window.removeEventListener("ilumaa:location_range_changed", handleSync);
  }, []);

  // Ensure default URL params are populated on initial load if missing
  useEffect(() => {
    if (!searchParams.get("city") || !searchParams.get("radius")) {
      updateUrlParams({
        city: cityParam,
        area: areaParam,
        pincode: pincodeParam,
        radius: radiusParam,
      });
    }
  }, []);

  // 5. Data Fetching via Data-Access Layer
  const [data, setData] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState({});
  const [sectionsData, setSectionsData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Quick Enquiry Modal state
  const [enquiryModal, setEnquiryModal] = useState({
    isOpen: false,
    title: "Quick Enquiry",
    category: "Services",
  });

  const handleOpenEnquiry = (title, category) => {
    setEnquiryModal({
      isOpen: true,
      title: `Enquire about ${title}`,
      category: category || "Local Services",
    });
  };

  const activeFilters = useMemo(
    () => ({
      category: activeCategory,
      radius,
      q: searchQuery,
      sort: sortBy,
      priceRange,
      availability,
      city: location.city,
      area: location.area,
    }),
    [
      activeCategory,
      radius,
      searchQuery,
      sortBy,
      priceRange,
      availability,
      location,
    ],
  );

  useEffect(() => {
    let isMounted = true;
    const loadListings = async () => {
      setLoading(true);
      try {
        const [res, counts, sections] = await Promise.all([
          getNearbyAll(activeFilters),
          getNearbyCategoryCounts(activeFilters),
          getExploreSectionsData(),
        ]);
        if (isMounted) {
          setData(res.data || []);
          setCategoryCounts(counts || {});
          setSectionsData(sections || null);
        }
      } catch (err) {
        console.error("Failed to load nearby listings:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadListings();
    return () => {
      isMounted = false;
    };
  }, [activeFilters]);

  // Derived collections
  const featuredListings = useMemo(
    () => data.filter((item) => item.isFeatured),
    [data],
  );
  const products = useMemo(
    () => data.filter((item) => item.type === "product"),
    [data],
  );
  const businesses = useMemo(
    () => data.filter((item) => item.type === "business"),
    [data],
  );
  const services = useMemo(
    () => data.filter((item) => item.type === "service"),
    [data],
  );
  const foodPlaces = useMemo(
    () => data.filter((item) => item.type === "food"),
    [data],
  );
  const gifts = useMemo(
    () => data.filter((item) => item.type === "gift"),
    [data],
  );
  const places = useMemo(
    () => data.filter((item) => item.type === "place"),
    [data],
  );
  const offers = useMemo(
    () => data.filter((item) => item.type === "offer"),
    [data],
  );

  const hasActiveFilters =
    Boolean(priceRange) ||
    Boolean(availability) ||
    Boolean(searchQuery) ||
    activeCategory !== "all" ||
    radius !== 15;

  const handleResetFilters = () => {
    setActiveCategory("all");
    setSearchQuery("");
    setPriceRange("");
    setAvailability("");
    setSortBy("relevance");
    setRadius(15);
    setSearchParams(
      {
        city: location.city,
        area: location.area,
        pincode: location.pincode,
        radius: "15",
      },
      { replace: true },
    );
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-800 font-sans">
      {/* 1. Location & Search Header */}
      {/* <NearbyLocationHeader
        currentCity={location.city}
        currentArea={location.area}
        currentPincode={location.pincode}
        currentRadius={radius}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onRadiusChange={handleRadiusChange}
        onLocationChange={handleLocationChange}
      /> */}

      {/* 2. Category Nav Tiles */}
      {/* <NearbyCategoryNav
        activeCategory={activeCategory}
        onSelectCategory={handleCategorySelect}
        categoryCounts={categoryCounts}
      /> */}

      {/* 3. Toolbar: Results, Sorting, Filters & View Toggle */}

      {/* 4. MAP VIEW (if selected) */}
      {viewMode === "map" ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <NearbyMapPlaceholder
            city={location.city}
            area={location.area}
            radius={radius}
            items={data}
          />
        </div>
      ) : (
        /* 5. LIST VIEW */
        <main className="space-y-10 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            {/* Empty State */}
            {data.length === 0 ? (
              <div className="py-20 text-center space-y-4 max-w-md mx-auto">
                <div className="w-16 h-16 rounded-3xl bg-blue-50 text-[#2563eb] flex items-center justify-center mx-auto shadow-inner">
                  <Search size={28} />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-lg font-black text-slate-900">
                    No results found nearby
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    We couldn't find listings matching your search within{" "}
                    {radius} km of {location.area || location.city}. Try
                    expanding your search radius or resetting filters.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-5 py-2.5 rounded-xl bg-[#2563eb] text-white text-xs font-black shadow-md shadow-blue-500/25 hover:bg-blue-700 transition"
                >
                  Reset All Filters
                </button>
              </div>
            ) : activeCategory === "all" && !searchQuery ? (
              /* COMPREHENSIVE HYPER-LOCAL DISCOVERY DIRECTORY LAYOUT */
              <>
                {/* 1. Hero Promo Banner & Vertical Quick Action Cards */}
                {sectionsData?.heroPromo && (
                  <NearbyHeroDirectory
                    heroPromo={sectionsData.heroPromo}
                    onSelectCategory={handleCategorySelect}
                    onOpenEnquiry={handleOpenEnquiry}
                  />
                )}

                {/* 2. 20 Quick Category Icons Grid with Micro Badges */}
                {sectionsData?.quickIcons && (
                  <NearbyQuickIconsGrid
                    categories={sectionsData.quickIcons}
                    activeCategory={activeCategory}
                    onSelectCategory={handleCategorySelect}
                  />
                )}

                {/* 3. Curated Multi-Category Showcase (Wedding, Beauty, Repairs, Daily Needs) */}
                {sectionsData?.curatedCollections && (
                  <NearbyCuratedShowcase
                    collections={sectionsData.curatedCollections}
                    onSelectCategory={handleCategorySelect}
                  />
                )}

                {/* 4. Travel Bookings Transit & Hotel Bar */}
                {sectionsData?.travelBookings && (
                  <NearbyTravelBookings
                    travelBookings={sectionsData.travelBookings}
                    onSelectCategory={handleCategorySelect}
                  />
                )}

                {/* 5. Trending Searches Near You (with HOT badge) */}
                {sectionsData?.trendingSearches && (
                  <NearbyTrendingSearches
                    trendingSearches={sectionsData.trendingSearches}
                    onSelectCategory={handleCategorySelect}
                  />
                )}

                {/* 7. Explore Top Tourist Places (with NEW badge) */}
                {sectionsData?.touristPlaces && (
                  <NearbyTopTouristPlaces
                    touristPlaces={sectionsData.touristPlaces}
                    onSelectCity={(city) => {
                      handleLocationChange({
                        ...location,
                        city,
                      });
                      toast.success(`Switched destination to ${city}`);
                    }}
                  />
                )}

                {/* 8. Popular Searches with Enquire Now actions */}
                {sectionsData?.popularSearches && (
                  <NearbyPopularSearches
                    popularSearches={sectionsData.popularSearches}
                    onOpenEnquiry={handleOpenEnquiry}
                    onSelectCategory={handleCategorySelect}
                  />
                )}

                {/* 9. Seasonal Demands (Sunny Day Essentials & Festive Demands) */}
                {(sectionsData?.seasonalEssentials ||
                  sectionsData?.festiveDemands) && (
                  <NearbySeasonalSections
                    seasonalEssentials={sectionsData?.seasonalEssentials}
                    festiveDemands={sectionsData?.festiveDemands}
                    onSelectCategory={handleCategorySelect}
                  />
                )}

                {/* 10. Featured Handpicked Artisans */}
                {featuredListings.length > 0 && (
                  <div className="pt-2">
                    <NearbyFeaturedSection
                      featuredItems={featuredListings}
                      onAddToPlan={handleAddToPlan}
                      plannedItemIds={plannedItemIds}
                    />
                  </div>
                )}

                {/* 1. Nearby Products Section */}
                {products.length > 0 && (
                  <section className="space-y-4 pt-4 border-t border-slate-200/80">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShoppingBag size={20} className="text-[#2563eb]" />
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                          Nearby Products & Artisan Shopping
                        </h2>
                      </div>
                    </div>
                    <div
                      ref={productsScrollRef}
                      className="flex gap-4 sm:gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-3 pt-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                    >
                      {products.map((p) => (
                        <NearbyProductCard
                          key={p.id}
                          product={p}
                          onAddToPlan={handleAddToPlan}
                          isInPlan={plannedItemIds.includes(p.id)}
                          isCarousel={true}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {/* 2. Businesses Section */}
                {businesses.length > 0 && (
                  <section className="space-y-4 pt-4 border-t border-slate-200/80">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Store size={20} className="text-amber-600" />
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                          Nearby Businesses & Local Boutiques
                        </h2>
                      </div>
                    </div>
                    <div
                      ref={businessesScrollRef}
                      className="flex gap-4 sm:gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-3 pt-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                    >
                      {businesses.map((b) => (
                        <div
                          key={b.id}
                          className="shrink-0 w-[290px] sm:w-[320px] snap-start"
                        >
                          <NearbyBusinessCard
                            business={b}
                            onAddToPlan={handleAddToPlan}
                            isInPlan={plannedItemIds.includes(b.id)}
                          />
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* 3. Services Section */}
                {services.length > 0 && (
                  <section className="space-y-4 pt-4 border-t border-slate-200/80">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles size={20} className="text-purple-600" />
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                          Local Services & Professionals
                        </h2>
                      </div>
                    </div>
                    <div
                      ref={servicesScrollRef}
                      className="flex gap-4 sm:gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-3 pt-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                    >
                      {services.map((s) => (
                        <div
                          key={s.id}
                          className="shrink-0 w-[290px] sm:w-[320px] snap-start"
                        >
                          <NearbyServiceCard
                            service={s}
                            onAddToPlan={handleAddToPlan}
                            isInPlan={plannedItemIds.includes(s.id)}
                          />
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* 4. Food & Dining Section */}
                {foodPlaces.length > 0 && (
                  <section className="space-y-4 pt-4 border-t border-slate-200/80">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Coffee size={20} className="text-rose-600" />
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                          Food, Cafés & Local Hangouts
                        </h2>
                      </div>
                    </div>
                    <div
                      ref={foodScrollRef}
                      className="flex gap-4 sm:gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-3 pt-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                    >
                      {foodPlaces.map((f) => (
                        <div
                          key={f.id}
                          className="shrink-0 w-[290px] sm:w-[320px] snap-start"
                        >
                          <NearbyFoodCard
                            foodPlace={f}
                            onAddToPlan={handleAddToPlan}
                            isInPlan={plannedItemIds.includes(f.id)}
                          />
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* 5. Gifts & Special Occasions */}
                {gifts.length > 0 && (
                  <section className="space-y-4 pt-4 border-t border-slate-200/80">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Gift size={20} className="text-fuchsia-600" />
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                          Gifts & Special Occasion Hampers
                        </h2>
                      </div>
                    </div>
                    <div
                      ref={giftsScrollRef}
                      className="flex gap-4 sm:gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-3 pt-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                    >
                      {gifts.map((g) => (
                        <div
                          key={g.id}
                          className="shrink-0 w-[290px] sm:w-[320px] snap-start"
                        >
                          <NearbyGiftCard
                            gift={g}
                            onAddToPlan={handleAddToPlan}
                            isInPlan={plannedItemIds.includes(g.id)}
                          />
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* 6. Local Offers Section */}
                {offers.length > 0 && (
                  <section className="space-y-4 pt-4 border-t border-slate-200/80">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Tag size={20} className="text-red-500" />
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                          Exclusive Offers Around You
                        </h2>
                      </div>
                    </div>
                    <div
                      ref={offersScrollRef}
                      className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-3 pt-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                    >
                      {offers.map((off) => (
                        <div
                          key={off.id}
                          className="shrink-0 w-[260px] sm:w-[280px] snap-start"
                        >
                          <NearbyOfferCard offer={off} />
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* 7. Places to Explore Section */}
                {places.length > 0 && (
                  <section className="space-y-4 pt-4 border-t border-slate-200/80">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Trees size={20} className="text-emerald-600" />
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                          Places to Explore in Your Neighbourhood
                        </h2>
                      </div>
                    </div>
                    <div
                      ref={placesScrollRef}
                      className="flex gap-4 sm:gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-3 pt-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                    >
                      {places.map((pl) => (
                        <div
                          key={pl.id}
                          className="shrink-0 w-[290px] sm:w-[320px] snap-start"
                        >
                          <NearbyPlaceCard
                            place={pl}
                            onAddToPlan={handleAddToPlan}
                            isInPlan={plannedItemIds.includes(pl.id)}
                          />
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* 8. Recent Activity & Verified Reviews with WhatsApp & Rating Card */}
                {sectionsData?.recentActivity && (
                  <section className="pt-4 border-t border-slate-200/80">
                    <NearbyRecentActivity
                      activities={sectionsData.recentActivity}
                      onOpenEnquiry={handleOpenEnquiry}
                    />
                  </section>
                )}
              </>
            ) : (
              /* FOCUSED FILTERED GRID (When user selected specific category or searched) */
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight capitalize">
                    {searchQuery
                      ? `Search Results for "${searchQuery}"`
                      : `${activeCategory} Nearby`}
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {data.map((item) => {
                    const isSaved = plannedItemIds.includes(item.id);

                    if (item.type === "business") {
                      return (
                        <NearbyBusinessCard
                          key={item.id}
                          business={item}
                          onAddToPlan={handleAddToPlan}
                          isInPlan={isSaved}
                        />
                      );
                    }
                    if (item.type === "service") {
                      return (
                        <NearbyServiceCard
                          key={item.id}
                          service={item}
                          onAddToPlan={handleAddToPlan}
                          isInPlan={isSaved}
                        />
                      );
                    }
                    if (item.type === "food") {
                      return (
                        <NearbyFoodCard
                          key={item.id}
                          foodPlace={item}
                          onAddToPlan={handleAddToPlan}
                          isInPlan={isSaved}
                        />
                      );
                    }
                    if (item.type === "gift") {
                      return (
                        <NearbyGiftCard
                          key={item.id}
                          gift={item}
                          onAddToPlan={handleAddToPlan}
                          isInPlan={isSaved}
                        />
                      );
                    }
                    if (item.type === "offer") {
                      return <NearbyOfferCard key={item.id} offer={item} />;
                    }
                    if (item.type === "place") {
                      return (
                        <NearbyPlaceCard
                          key={item.id}
                          place={item}
                          onAddToPlan={handleAddToPlan}
                          isInPlan={isSaved}
                        />
                      );
                    }
                    return (
                      <NearbyProductCard
                        key={item.id}
                        product={item}
                        onAddToPlan={handleAddToPlan}
                        isInPlan={isSaved}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </main>
      )}

      {/* 6. Plan Your Neighbourhood Drawer */}
      <NeighbourhoodPlanner
        isOpen={isPlannerOpen}
        onClose={() => setIsPlannerOpen(false)}
        planItems={planItems}
        onRemoveItem={handleRemoveFromPlan}
        onClearPlan={handleClearPlan}
        onMoveItem={handleMovePlanItem}
      />

      {/* 7. Quick Enquiry Modal */}
      <NearbyEnquiryModal
        isOpen={enquiryModal.isOpen}
        onClose={() => setEnquiryModal((prev) => ({ ...prev, isOpen: false }))}
        title={enquiryModal.title}
        targetName={enquiryModal.title.replace("Enquire about ", "")}
        targetCategory={enquiryModal.category}
      />
    </div>
  );
}
