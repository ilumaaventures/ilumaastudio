import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, MapPin, Store, ArrowRight } from "lucide-react";
import { getShops } from "../../../api/publicService";
import { StoreGridSkeleton } from "../../../Components/Skeletons";

const DEFAULT_SHOP_IMAGE =
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=700&q=80";

function TopBrands() {
  const [localShops, setLocalShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = React.useRef(null);

  const fetchLocalShops = async () => {
    try {
      setLoading(true);
      const response = await getShops({
        businessCategory: "ECOMMERCE",
        anySlugType: true,
      });
      const shopsData = response?.data ?? response;
      console.log("Fetched local shops:", shopsData);
      const shops = Array.isArray(shopsData)
        ? shopsData
        : shopsData?.data || [];

      setLocalShops(shops);
    } catch (error) {
      console.error(
        "Failed to fetch local shops:",
        error?.response?.data || error?.message || error,
      );
      setLocalShops([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocalShops();
  }, []);

  const scrollShops = (direction) => {
    if (!scrollRef.current) return;

    scrollRef.current.scrollBy({
      left: direction === "left" ? -350 : 350,
      behavior: "smooth",
    });
  };

  return (
    <section className="w-full py-3 sm:py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Popular Shops
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Discover trusted businesses and stores .
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/store"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50/80 hover:bg-blue-100 border border-blue-100/80 transition-all duration-200 shadow-2xs group shrink-0"
            >
              <span>See All</span>
              <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        {/* Horizontal Shops */}
        {loading ? (
          <StoreGridSkeleton count={3} />
        ) : (
          <div
            ref={scrollRef}
            className="
            flex
            gap-4
            sm:gap-5
            overflow-x-auto
            scroll-smooth
            snap-x
            snap-mandatory
            pb-2

            [scrollbar-width:none]
            [-ms-overflow-style:none]
            [&::-webkit-scrollbar]:hidden
          "
          >
            {localShops.length > 0 ? (
              localShops.map((shop) => {
                const shopName =
                  shop.businessName || shop.tradeName || "Local Store";

                const shopImage = shop.logo || shop.image || DEFAULT_SHOP_IMAGE;

                const shopCategory =
                  (typeof shop.businessCategory === "object"
                    ? shop.businessCategory?.name
                    : shop.businessCategory) ||
                  (typeof shop.businessType === "object"
                    ? shop.businessType?.name
                    : shop.businessType) ||
                  "E-Commerce";

                const shopType =
                  (typeof shop.businessType === "object"
                    ? shop.businessType?.name
                    : shop.businessType) ||
                  (typeof shop.businessCategory === "object"
                    ? shop.businessCategory?.name
                    : shop.businessCategory) ||
                  "Business";
                console.log("Slug Type:", shop.slugType, "Custom Domain:");
                const shopDescription =
                  shop.description ||
                  `Explore products and services from ${shopName}.`;

                // ---------------------------------------
                // STOREFRONT / SLUG INFORMATION
                // ---------------------------------------

                const shopSlug =
                  shop.slugName ||
                  (typeof shop.slug === "object"
                    ? shop.slug?.slugName
                    : shop.slug) ||
                  shop.businessSlug ||
                  shop.subdomain ||
                  (shop.businessName || shop.name || "")
                    .toLowerCase()
                    .replace(/\s+/g, "-") ||
                  "store";

                const slugType =
                  shop.slugType ||
                  (typeof shop.slug === "object"
                    ? shop.slug?.slugType
                    : null) ||
                  "path";

                const customDomain =
                  shop.customDomain ||
                  (typeof shop.slug === "object"
                    ? shop.slug?.customDomain
                    : null);

                // ---------------------------------------
                // DETERMINE STOREFRONT TYPE
                // ---------------------------------------

                const isCustomDomain = slugType === "custom" && !!customDomain;

                // ---------------------------------------
                // CLEAN CUSTOM DOMAIN
                // ---------------------------------------

                const normalizedCustomDomain = customDomain
                  ? customDomain.trim()
                  : "";

                // ---------------------------------------
                // FINAL STORE ROUTE
                // ---------------------------------------

                const storeRoute = isCustomDomain
                  ? normalizedCustomDomain
                  : `/${shopSlug}`;

                console.log("Storefront:", {
                  businessId: shop._id,
                  shopName,
                  shopSlug,
                  slugType,
                  customDomain,
                  isCustomDomain,
                  storeRoute,
                });

                // ---------------------------------------
                // COMMON CARD UI
                // ---------------------------------------

                const shopCard = (
                  <>
                    {/* Image */}
                    <div className="relative h-36 sm:h-40 w-full overflow-hidden bg-slate-100">
                      {/* Uncomment if image is required */}

                      <img
                        src={shopImage}
                        alt={shopName}
                        onError={(e) => {
                          e.currentTarget.src = DEFAULT_SHOP_IMAGE;
                        }}
                        className="
            w-full
            h-full
            object-cover
            group-hover:scale-105
            transition-transform
            duration-500
          "
                      />

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                      {/* Business Type */}
                      <span
                        className="
            absolute
            bottom-3
            left-3
            px-2.5
            py-1
            rounded-full
            bg-white/90
            backdrop-blur-sm
            text-[10px]
            font-bold
            text-slate-800
          "
                      >
                        {shopType}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="p-4">
                      <div className="flex items-start gap-2">
                        <div
                          className="
              w-9 h-9
              shrink-0
              rounded-xl
              bg-slate-100
              flex
              items-center
              justify-center
              text-[#1e6091]
            "
                        >
                          <Store size={17} />
                        </div>

                        <div className="min-w-0">
                          <h3
                            className="
                font-extrabold
                text-slate-900
                text-sm
                sm:text-base
                truncate
                group-hover:text-[#1e6091]
                transition-colors
              "
                          >
                            {shopName}
                          </h3>

                          <p className="text-xs text-slate-400 mt-0.5 truncate">
                            {shopCategory}
                          </p>
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 mt-3 line-clamp-2">
                        {shopDescription}
                      </p>

                      <div
                        className="
            flex
            items-center
            justify-between
            mt-3
            pt-2
            border-t
            border-slate-100
            text-slate-400
            text-[11px]
          "
                      >
                        <div className="flex items-center gap-1.5">
                          <MapPin size={13} />

                          <span className="font-medium">
                            Available near you
                          </span>
                        </div>

                        <span className="font-bold text-[#1e6091] group-hover:underline">
                          Visit Shop →
                        </span>
                      </div>
                    </div>
                  </>
                );

                // ---------------------------------------
                // EXTERNAL CUSTOM DOMAIN
                // ---------------------------------------

                if (isCustomDomain) {
                  return (
                    <a
                      key={shop._id}
                      href={storeRoute}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
          group
          shrink-0
          w-[230px]
          sm:w-[270px]
          lg:w-[290px]
          snap-start
          bg-white
          border
          border-slate-100
          rounded-2xl
          overflow-hidden
          shadow-sm
          hover:shadow-lg
          transition-all
          duration-300
        "
                    >
                      {shopCard}
                    </a>
                  );
                }

                // ---------------------------------------
                // ILUMAA INTERNAL STOREFRONT
                // ---------------------------------------

                return (
                  <Link
                    key={shop._id}
                    to={`/${shopSlug}`}
                    className="
        group
        shrink-0
        w-[230px]
        sm:w-[270px]
        lg:w-[290px]
        snap-start
        bg-white
        border
        border-slate-100
        rounded-2xl
        overflow-hidden
        shadow-sm
        hover:shadow-lg
        transition-all
        duration-300
      "
                  >
                    {shopCard}
                  </Link>
                );
              })
            ) : (
              <div className="w-full py-10 text-center text-sm text-slate-400">
                No local shops available.
              </div>
            )}
          </div>
        )}

        {/* Mobile See All */}
        <div className="mt-4 sm:hidden text-center">
          <Link to="/store" className="text-sm font-bold text-[#1e6091]">
            See all shops →
          </Link>
        </div>
      </div>
    </section>
  );
}

export default TopBrands;
