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

import GiftingProductsSection from "./sections/GiftingProductsSection";
import NewArrivalsSection from "./sections/NewArrivalsSection";
import BannerSection from "../../Components/BannerSection";

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

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans antialiased text-slate-900 pb-12 space-y-6 sm:space-y-8">
      {/* Hero Carousel Banner */}
      <HeroBanner />
      {/* Flash Deals */}
      <FlashDeals />

      {/* AI Personal Assistant, Weather Card & Our Services 4 Cards */}
      <MarketplaceHub />

      {/* Promotional Banners from Generic Banner System */}
      <BannerSection bannerType="promotion" />

      {/* Best Selling Products Section */}
      <BestSellingProducts />

      {/* New Arrivals Section */}
      <NewArrivalsSection />

      <MegaSaleBanner
        title="Craving Something Delicious?"
        description="Order your favorite meals and get up to 50% off on selected restaurants."
        imageUrl="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80"
        linkUrl="/shop"
      />
      {/* Popular Local Shops */}
      <TopBrands />

      {/* Recommended For You */}
      <RecommendedForYou />

      {/* Featured Categories */}
      <FeaturedProductCategory />
      <MegaSaleBanner
        title="Find Your Next Favorite 🛒"
        description="Shop trending products, fresh arrivals and everyday essentials — all curated in one place."
        imageUrl="https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=400&q=80"
        linkUrl="/shop"
      />
      {/* Store Coupons & Rewards Grid */}
      <CouponsOffers />

      {/* Gifting Products Section */}
      <GiftingProductsSection />

      {/* Our Occasion & Our Collection */}
      <OccasionsAndCollections />

      {/* Bottom Offer Banner & Footer */}
      <AppNewsletterSocial />
    </div>
  );
}

export default Home;
