import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeroBanner from "./sections/HeroBanner";
import MarketplaceHub from "./sections/MarketplaceHub";
import ShopByCategory from "./sections/ShopByCategory";
import FlashDeals from "./sections/FlashDeals";
import TopBrands from "./sections/TopBrands";
import PopularProducts from "./sections/PopularProducts";
import RecommendedForYou from "./sections/RecommendedForYou";
import BestSellingProducts from "./sections/BestSellingProducts";
import CouponsOffers from "./sections/CouponsOffers";
import OccasionsAndCollections from "./sections/OccasionsAndCollections";
import MegaSaleBanner from "./sections/MegaSaleBanner";
import AppNewsletterSocial from "./sections/AppNewsletterSocial";
import { getProducts } from "../../api/productService";
import {
  fetchCategories,
  fetchBusinessCategories,
} from "../../api/categoryService";
import FeaturedProductCategory from "./sections/FeaturedProductCategory";
import TopRated from "./sections/TopRated";
import PromotionalShowcase from "./sections/PromotionalShowcase";
import WhyChooseUs from "./sections/WhyChooseUs";

import GiftingProductsSection from "./sections/GiftingProductsSection";
import NewArrivalsSection from "./sections/NewArrivalsSection";
import BannerSection from "../../Components/BannerSection";
import HomeShimmer from "./components/HomeShimmer";
import CategorySection from "./sections/CategorySection";
import TopRatedServiceProviders from "./sections/TopRatedServiceProviders";
import PopularFoodSpots from "./sections/PopularFoodSpots";

function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [serviceCategories, setServiceCategories] = useState([]);
  const [businessCategories, setBusinessCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serviceCategoriesLoading, setServiceCategoriesLoading] =
    useState(true);
  const [businessCategoriesLoading, setBusinessCategoriesLoading] =
    useState(true);

  useEffect(() => {
    let isMounted = true;

    // Load main products & e-commerce categories
    const loadMainData = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          getProducts({ productType: "E-Commerce", limit: 12 }).catch(() => []),
          fetchCategories({ businessType: "E-Commerce" }).catch(() => []),
        ]);

        if (!isMounted) return;

        const plist = Array.isArray(productsData)
          ? productsData
          : productsData?.products || productsData?.data || [];
        const clist =
          categoriesData?.data ||
          categoriesData?.categories ||
          (Array.isArray(categoriesData) ? categoriesData : []);

        setProducts(plist);
        setCategories(clist);
      } catch (err) {
        console.error("Failed to load home products:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    // Load Service Categories from backend
    const loadServiceCategories = async () => {
      try {
        setServiceCategoriesLoading(true);
        const res = await fetchCategories({
          businessCategory: "SERVICE",
          status: "active",
        }).catch(() => null);

        let slist =
          res?.data ||
          res?.categories ||
          (Array.isArray(res) ? res : []);

        // Fallback check if businessCategory: "SERVICE" returned nothing
        if (!slist || slist.length === 0) {
          const fallbackRes = await fetchCategories({
            businessType: "Service",
            status: "active",
          }).catch(() => null);
          slist =
            fallbackRes?.data ||
            fallbackRes?.categories ||
            (Array.isArray(fallbackRes) ? fallbackRes : []);
        }

        if (isMounted) {
          setServiceCategories(slist || []);
        }
      } catch (err) {
        console.error("Failed to load service categories:", err);
      } finally {
        if (isMounted) setServiceCategoriesLoading(false);
      }
    };

    // Load Business Categories from backend
    const loadBusinessCategories = async () => {
      try {
        setBusinessCategoriesLoading(true);
        const res = await fetchCategories({
          businessCategory: "BUSINESS",
          status: "active",
        }).catch(() => null);

        let blist =
          res?.data ||
          res?.categories ||
          (Array.isArray(res) ? res : []);

        // Fallback for business categories if no items returned under BUSINESS code
        if (!blist || blist.length === 0) {
          try {
            const bCatRes = await fetchBusinessCategories({ status: "active" });
            const fallbackList =
              bCatRes?.data || (Array.isArray(bCatRes) ? bCatRes : []);
            if (fallbackList.length > 0) {
              blist = fallbackList;
            }
          } catch (e) {
            console.error("Fallback business categories error:", e);
          }
        }

        if (isMounted) {
          setBusinessCategories(blist || []);
        }
      } catch (err) {
        console.error("Failed to load business categories:", err);
      } finally {
        if (isMounted) setBusinessCategoriesLoading(false);
      }
    };

    loadMainData();
    loadServiceCategories();
    loadBusinessCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return <HomeShimmer />;
  }

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans antialiased text-slate-900 pb-12 space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Hero Carousel Banner */}
      <HeroBanner />
      {/* Flash Deals */}
      <FlashDeals />

      {/* AI Personal Assistant, Weather Card & Our Services 4 Cards */}
      {/* <MarketplaceHub /> */}

      {/* Best Selling Products Section */}
      <BestSellingProducts />
      <BannerSection bannerType="promotion" />
      {/* New Arrivals Section */}
      <NewArrivalsSection />

      {/* On-Demand & Professional Services Category Section */}
      <CategorySection
        badge="Professional Services"
        title="On-Demand & Professional Services"
        subtitle="Find certified experts, consultants and specialized service providers."
        categories={serviceCategories}
        loading={serviceCategoriesLoading}
        viewAllText="View All Services"
        cardCtaText="Explore Services"
        sectionType="services"
        onViewAll={() => navigate("/services")}
        onCategoryClick={(category) => {
          const categoryName = category.name || category.slug || category._id;
          navigate(`/services?category=${encodeURIComponent(categoryName)}`);
        }}
        linkUrl="/services"
      />

      {/* Popular Local Shops */}
      <TopBrands />
      <MegaSaleBanner
        bannerIndex={1}
        fallbackTitle="Premium Brands & Exclusive Studio Collections"
        fallbackDescription="Discover authenticated lifestyle collections, direct-from-brand discounts, and member-exclusive perks."
        fallbackImageUrl="https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=800&q=80"
        fallbackLinkUrl="/shop"
      />
      {/* Recommended For You */}
      <RecommendedForYou />

      {/* Featured Categories */}
      <FeaturedProductCategory />

      {/* Interactive Promotional Showcase with Countdown & Vouchers */}
      <PromotionalShowcase />
      {/* Store Coupons & Rewards Grid */}
      <CouponsOffers />

      {/* Gifting Products Section */}
      <GiftingProductsSection />

      {/* Our Occasion & Our Collection */}
      <OccasionsAndCollections />

      {/* Top Rated Service Providers */}
      <TopRatedServiceProviders />
      {/* Trust & Guarantee Perks */}
      <WhyChooseUs />
      {/* Top Rated Picks Section */}
      <TopRated />

      {/* Enterprise & Local Brands Sectors Category Section */}
      <CategorySection
        badge="Enterprise & Business Sectors"
        title="Enterprise & Local Brands Sectors"
        subtitle="Connect with verified enterprises, local brands, suppliers and industry partners."
        categories={businessCategories}
        loading={businessCategoriesLoading}
        viewAllText="View All Businesses"
        cardCtaText="Explore Businesses"
        sectionType="business"
        onViewAll={() => navigate("/store")}
        onCategoryClick={(category) => {
          const categoryName = category.name || category.code || category._id;
          navigate(`/store?category=${encodeURIComponent(categoryName)}`);
        }}
        linkUrl="/store"
      />

      <AppNewsletterSocial />

      {/* Popular Food Spots */}
      {/* <PopularFoodSpots /> */}
    </div>
  );
}

export default Home;
