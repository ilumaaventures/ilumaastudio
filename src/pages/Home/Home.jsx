import React, { useState, useEffect } from "react";
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
import { fetchCategories } from "../../api/categoryService";
import FeaturedProductCategory from "./sections/FeaturedProductCategory";
import TopRated from "./sections/TopRated";
import PromotionalShowcase from "./sections/PromotionalShowcase";
import WhyChooseUs from "./sections/WhyChooseUs";

import GiftingProductsSection from "./sections/GiftingProductsSection";
import NewArrivalsSection from "./sections/NewArrivalsSection";
import BannerSection from "../../Components/BannerSection";
import HomeShimmer from "./components/HomeShimmer";

function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          getProducts({ productType: "E-Commerce", limit: 12 }),
          fetchCategories({ businessType: "E-Commerce" }),
        ]);

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
        console.error("Failed to load home page data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
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
      <MegaSaleBanner
        bannerIndex={0}
        fallbackTitle="Curated Essentials for Modern Living"
        fallbackDescription="Explore handpicked products from verified brands with effortless checkout and dependable delivery."
        fallbackImageUrl="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80"
        fallbackLinkUrl="/shop"
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

      {/* Trust & Guarantee Perks */}
      <WhyChooseUs />
      {/* Top Rated Picks Section */}
      <TopRated />
      {/* Bottom Offer Banner & Footer */}
      <AppNewsletterSocial />
    </div>
  );
}

export default Home;
