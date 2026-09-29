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
import CategorySection from "./sections/CategorySection";

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
  const serviceCategories = [
    {
      id: 1,
      name: "Home Maintenance & Repair",
      description: "Plumbing, AC, Electrical & Carpentry",
      icon: "🔧",
    },
    {
      id: 2,
      name: "Cleaning & Sanitation",
      description: "Deep Cleaning, Pest Control & Tanks",
      icon: "🧹",
    },
    {
      id: 3,
      name: "Beauty & Salon at Home",
      description: "Hair, Makeup, Spa & Grooming",
      icon: "💇",
    },
    {
      id: 4,
      name: "Event Management & PR",
      description: "Weddings, Corporate & Party Planning",
      icon: "🎉",
    },
    {
      id: 5,
      name: "IT Support & Networking",
      description: "Computer Repair, AMC & CCTV",
      icon: "💻",
    },
    {
      id: 6,
      name: "Legal & Tax Consulting",
      description: "GST, Filing, Trade License & CA",
      icon: "⚖️",
    },
    {
      id: 7,
      name: "Packers & Movers",
      description: "Relocation, Transport & Storage",
      icon: "📦",
    },
    {
      id: 8,
      name: "Health & Fitness Coaching",
      description: "Yoga, Trainers & Dieticians",
      icon: "🏋️",
    },
  ];
  const productCategories = [
    {
      id: 1,
      name: "Electronics & Gadgets",
      description: "Mobiles, Laptops, PCs & Accessories",
      icon: "📱",
    },
    {
      id: 2,
      name: "Fashion & Apparel",
      description: "Men, Women & Kids Clothing",
      icon: "👕",
    },
    {
      id: 3,
      name: "Groceries & FMCG",
      description: "Daily Needs, Staples & Beverages",
      icon: "🛒",
    },
    {
      id: 4,
      name: "Home & Office Furniture",
      description: "Desks, Sofas, Beds & Decor",
      icon: "🛋️",
    },
  ];

  const businessCategories = [
    {
      id: 1,
      name: "Manufacturers",
      description: "Factories, production units & manufacturers",
      icon: "🏭",
    },
    {
      id: 2,
      name: "Wholesalers & Distributors",
      description: "Bulk suppliers, distributors & stockists",
      icon: "📦",
    },
    {
      id: 3,
      name: "Retailers & Dealers",
      description: "Local shops, dealers & authorized sellers",
      icon: "🏪",
    },
    {
      id: 4,
      name: "Importers & Exporters",
      description: "International trade & sourcing businesses",
      icon: "🌍",
    },
    {
      id: 5,
      name: "Construction & Infrastructure",
      description: "Builders, contractors & infrastructure companies",
      icon: "🏗️",
    },
    {
      id: 6,
      name: "Real Estate",
      description: "Property dealers, developers & agencies",
      icon: "🏢",
    },
    {
      id: 7,
      name: "Logistics & Transportation",
      description: "Transporters, fleet operators & logistics firms",
      icon: "🚚",
    },
    {
      id: 8,
      name: "IT & Technology",
      description: "IT companies, software firms & tech providers",
      icon: "💻",
    },
    {
      id: 9,
      name: "Healthcare & Pharma",
      description: "Hospitals, clinics, pharma & medical businesses",
      icon: "🏥",
    },
    {
      id: 10,
      name: "Education & Training",
      description: "Schools, institutes, coaching & training centers",
      icon: "🎓",
    },
    {
      id: 11,
      name: "Hotels & Restaurants",
      description: "Hotels, restaurants, cafes & hospitality businesses",
      icon: "🏨",
    },
    {
      id: 12,
      name: "Finance & Professional Services",
      description: "CA, legal, finance & consulting firms",
      icon: "💼",
    },
  ];

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
      {/* <MegaSaleBanner
        bannerIndex={0}
        fallbackTitle="Curated Essentials for Modern Living"
        fallbackDescription="Explore handpicked products from verified brands with effortless checkout and dependable delivery."
        fallbackImageUrl="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80"
        fallbackLinkUrl="/shop"
      /> */}

      <CategorySection
        title="On-Demand & Professional Services"
        subtitle="Find trusted professionals for your everyday needs."
        categories={serviceCategories}
        viewAllText="View All Services"
        onViewAll={() => console.log("View all services")}
        onCategoryClick={(category) => {
          console.log("Selected service:", category);
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

      {/* Trust & Guarantee Perks */}
      <WhyChooseUs />
      {/* Top Rated Picks Section */}
      <TopRated />
      {/* Bottom Offer Banner & Footer */}

      <CategorySection
        title="Enterprise & Local Brands Sectors"
        subtitle="Connect with businesses, suppliers and professional providers."
        categories={businessCategories}
        viewAllText="View All Businesses"
        onViewAll={() => console.log("View all businesses")}
        onCategoryClick={(category) => {
          console.log("Selected business:", category);
        }}
        linkUrl="/store"
      />

      <AppNewsletterSocial />
    </div>
  );
}

export default Home;
