import React from "react";
import { useParams } from "react-router-dom";
import customStoresRegistry from "../registry";

// Default Page Components
import DefaultStoreHome from "../StoreHome";
import DefaultStoreProducts from "../Products";
import DefaultStoreProductDetails from "../ProductDetails";
import DefaultStoreAbout from "../About";
import DefaultStoreContact from "../Contact";
import BusinessPoliciesPage from "../../Legal/BusinessPoliciesPage";

import { useStore } from "../StoreContext";
import templateRegistry from "../../../templates/registry";
import StoreRenderer from "../../../templates/StoreRenderer";

// High-Order Component to create store page dispatchers dynamically
const createDispatcher = (DefaultComponent, pageKey) => {
  return function Dispatcher(props) {
    const { businessName } = useParams();
    let storeCtx = null;
    try {
      storeCtx = useStore();
    } catch (_) {}

    const business = storeCtx?.business;
    const normalizedName = businessName ? businessName.toLowerCase().replace(/[\s-]/g, "") : "";
    const templateKey =
      business?.customTemplateKey ||
      (business?.businessName ? business.businessName.toLowerCase().replace(/[\s-]/g, "") : "") ||
      (business?.subdomain ? business.subdomain.toLowerCase().replace(/[\s-]/g, "") : "") ||
      normalizedName;

    // Resolve custom page override from registry
    const CustomComponent =
      customStoresRegistry[templateKey]?.[pageKey] ||
      customStoresRegistry[normalizedName]?.[pageKey];

    if (CustomComponent) {
      return <CustomComponent {...props} />;
    }

    // Check if matching modern multi-template in ILUMA Studio registry
    if (pageKey === "StoreHome" && templateRegistry[templateKey]) {
      return (
        <StoreRenderer
          templateKey={templateKey}
          data={{
            business: storeCtx?.business,
            products: storeCtx?.products,
            categories: storeCtx?.categories,
            services: storeCtx?.services,
            banners: storeCtx?.banners,
            reviews: storeCtx?.reviews,
            customization: storeCtx?.template?.customization || {},
          }}
        />
      );
    }

    return <DefaultComponent {...props} />;
  };
};

export const StoreHomeDispatcher = createDispatcher(DefaultStoreHome, "StoreHome");
export const StoreProductsDispatcher = createDispatcher(DefaultStoreProducts, "StoreProducts");
export const StoreProductDetailsDispatcher = createDispatcher(DefaultStoreProductDetails, "StoreProductDetails");
export const StoreAboutDispatcher = createDispatcher(DefaultStoreAbout, "StoreAbout");
export const StoreContactDispatcher = createDispatcher(DefaultStoreContact, "StoreContact");
export const StoreGiftHampersDispatcher = createDispatcher(DefaultStoreProducts, "StoreGiftHampers");
export const StorePoliciesDispatcher = createDispatcher(BusinessPoliciesPage, "StorePolicies");

