import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, MapPin, Store } from "lucide-react";
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
      const response = await getShops();
      const shopsData = response?.data ?? response;
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
    <section className="w-full py-10 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between gap-4 mb-5">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#1e6091]">
              Explore Local Businesses
            </span>

            <h2 className="mt-2 text-2xl sm:text-3xl font-black text-slate-900">
              Popular Local Shops
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Discover trusted businesses and stores near you.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollShops("left")}
              className="
                w-9 h-9 sm:w-10 sm:h-10
                rounded-full
                border border-slate-200
                bg-white
                flex items-center justify-center
                text-slate-600
                hover:bg-slate-900
                hover:text-white
                hover:border-slate-900
                transition-all
                shadow-sm
              "
              aria-label="Previous shops"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              onClick={() => scrollShops("right")}
              className="
                w-9 h-9 sm:w-10 sm:h-10
                rounded-full
                border border-slate-200
                bg-white
                flex items-center justify-center
                text-slate-600
                hover:bg-slate-900
                hover:text-white
                hover:border-slate-900
                transition-all
                shadow-sm
              "
              aria-label="Next shops"
            >
              <ChevronRight size={18} />
            </button>

            <Link
              to="/store"
              className="
                hidden sm:block
                ml-2
                text-sm
                font-bold
                text-[#1e6091]
                hover:underline
              "
            >
              See all
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
                  shop.businessCategory ||
                  shop.businessType ||
                  "Local Business";

                const shopDescription =
                  shop.description ||
                  `Explore products and services from ${shopName}.`;
                const storeRoute = `/${shop.slug || shop._id}`;

                return (
                  <Link
                    key={shop._id}
                    to={storeRoute}
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
                    {/* Image */}
                    <div className="relative h-36 sm:h-40 w-full overflow-hidden bg-slate-100">
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
                        {shop.businessType || "Business"}
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

                      <div className="flex items-center gap-1.5 mt-3 text-slate-400">
                        <MapPin size={13} />

                        <span className="text-[11px] font-medium">
                          Available near you
                        </span>
                      </div>
                    </div>
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
          <Link to="/shops" className="text-sm font-bold text-[#1e6091]">
            See all shops →
          </Link>
        </div>
      </div>
    </section>
  );
}

export default TopBrands;
