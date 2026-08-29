import React, { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { loadUser } from "./redux/actions/authActions";

// Layout Components
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import GlobalNotificationContainer from "./Components/GlobalNotificationContainer";

// Public Pages
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Product from "./pages/Product/Product";
import Shop from "./pages/Shop/Shop";
import Category from "./pages/Category/Category";

// Auth Pages
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ForgotPassword from "./pages/Auth/ForgotPassword";

// Dashboard Pages
import Profile from "./pages/Profile/Profile";
import BusinessRegistration from "./pages/Auth/BusinessRegistration";
import BusinessPricing from "./pages/Auth/BusinessPricing";
import ProductDetails from "./pages/Product/ProductDetails";
import Cart from "./pages/Cart/Cart";
import NotFound from "./Components/NotFound";
import Wishlist from "./pages/Wishlist/Wishlist";
import Offers from "./pages/Offers/Offers";
import FlashDeals from "./pages/FlashDeals/FlashDeals";

// Services & Bookings Pages
import Services from "./pages/Services/Services";
import ServiceDetails from "./pages/Services/ServiceDetails";
import BookingSuccessPage from "./pages/Bookings/BookingSuccessPage";
import MyBookingsPage from "./pages/Bookings/MyBookingsPage";

// Public Store Layout & Dispatchers
import StoreLayout from "./pages/Store/StoreLayout";
import {
  StoreHomeDispatcher,
  StoreProductsDispatcher,
  StoreProductDetailsDispatcher,
  StoreAboutDispatcher,
  StoreContactDispatcher,
  StoreGiftHampersDispatcher,
} from "./pages/Store/dispatchers/StoreDispatchers";
import ScrollToTop from "./Components/ScrollToTop";

import BusinessStoreListing from "./pages/BusinessStore/BusinessStoreListing";
import ProductListing from "./pages/Product/ProductListing";
import ServiceListing from "./pages/Services/ServiceListing";
import HelpCenter from "./pages/Help/HelpCenter";

// Order Tracking Page
import TrackOrder from "./pages/Order/TrackOrder";

// Legal, Policies, Shipping & Contact Pages
import PrivacyPolicy from "./pages/Legal/PrivacyPolicy";
import TermsOfService from "./pages/Legal/TermsOfService";
import ContactUs from "./pages/Contact/ContactUs";
import ShippingInfo from "./pages/Shipping/ShippingInfo";
import RefundReturnPolicy from "./pages/Legal/RefundReturnPolicy";
import BusinessPoliciesPage from "./pages/Legal/BusinessPoliciesPage";

import { getUserLocation } from "./utils/location";

function App() {
  const dispatch = useDispatch();
  const {
    isAuthenticated,
    loading,
    user,
    permissions: reduxPermissions,
  } = useSelector((state) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && token !== "undefined" && token !== "null") {
      dispatch(loadUser());
    }
  }, [dispatch]);

  if (loading && localStorage.getItem("token")) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF9]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#C9956C] border-t-transparent rounded-full animate-spin" />
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
            Loading session...
          </p>
        </div>
      </div>
    );
  }

  // Auth Guard for login/register pages (Redirect to home if already logged in)
  function AuthRedirectRoute() {
    return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
  }

  // Auth Guard for profile page (Redirect to login if not logged in)
  function ProtectedRoute() {
    const location = useLocation();
    const redirectPath = encodeURIComponent(
      location.pathname + location.search + location.hash,
    );
    return isAuthenticated ? (
      <Outlet />
    ) : (
      <Navigate
        to={`/login?redirect=${redirectPath}`}
        state={{ from: location }}
        replace
      />
    );
  }

  function PublicLayout() {
    return (
      <>
        <GlobalNotificationContainer />
        <Navbar />
        <Outlet />
        <Footer />
      </>
    );
  }

  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<Product />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:id" element={<ServiceDetails />} />
          <Route path="/booking-success" element={<BookingSuccessPage />} />
          <Route path="/categories" element={<Category />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/flash-deals" element={<FlashDeals />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/help-center" element={<HelpCenter />} />
          <Route path="/track-order" element={<TrackOrder />} />
          <Route path="/track-order/:id" element={<TrackOrder />} />

          {/* Legal, Support, Shipping & Policies Routes */}
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/terms-and-conditions" element={<TermsOfService />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/shipping" element={<ShippingInfo />} />
          <Route path="/shipping-info" element={<ShippingInfo />} />
          <Route path="/shipping-policy" element={<ShippingInfo />} />
          <Route path="/returns" element={<RefundReturnPolicy />} />
          <Route path="/refund-policy" element={<RefundReturnPolicy />} />
          <Route path="/return-policy" element={<RefundReturnPolicy />} />
          <Route path="/cancellation" element={<RefundReturnPolicy />} />
          <Route path="/policies" element={<BusinessPoliciesPage />} />
          <Route path="/business-policies" element={<BusinessPoliciesPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/my-bookings" element={<MyBookingsPage />} />
          </Route>

          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route
            path="/businessRegistration"
            element={<BusinessRegistration />}
          />
          <Route path="/business-pricing" element={<BusinessPricing />} />
          <Route path="/store" element={<BusinessStoreListing />} />
          <Route path="/productlisting" element={<ProductListing />} />
          <Route path="/servicelisting" element={<ServiceListing />} />
        </Route>

        {/* Non-authenticated routes guard */}
        <Route element={<AuthRedirectRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>
        {/* Storefront Routes */}
        <Route path="/:businessName" element={<StoreLayout />}>
          <Route index element={<StoreHomeDispatcher />} />
          <Route path="products" element={<StoreProductsDispatcher />} />
          <Route
            path="product/:id"
            element={<StoreProductDetailsDispatcher />}
          />
          <Route path="about" element={<StoreAboutDispatcher />} />
          <Route path="contact" element={<StoreContactDispatcher />} />
          <Route path="gift-hampers" element={<StoreGiftHampersDispatcher />} />
          <Route path="gifthampers" element={<StoreGiftHampersDispatcher />} />
          <Route path="hampers" element={<StoreGiftHampersDispatcher />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
