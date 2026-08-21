import React from "react";
import { useParams } from "react-router-dom";
import customStoresRegistry from "../registry";
import { getTenantSubdomain } from "../../../utils/tenant";

// Default Page Components
import DefaultStoreHome from "../StoreHome";
import DefaultStoreProducts from "../Products";
import DefaultStoreProductDetails from "../ProductDetails";
import DefaultStoreAbout from "../About";
import DefaultStoreContact from "../Contact";

// High-Order Component to create store page dispatchers dynamically
const createDispatcher = (DefaultComponent, pageKey) => {
  return function Dispatcher(props) {
    const { businessName } = useParams();
    const identifier = businessName || getTenantSubdomain();
    const normalizedName = identifier
      ? identifier.toLowerCase().replace(/[\s-]/g, "")
      : "";

    // Resolve custom page override from registry
    const CustomComponent = customStoresRegistry[normalizedName]?.[pageKey];

    if (CustomComponent) {
      return <CustomComponent {...props} />;
    }
    return <DefaultComponent {...props} />;
  };
};

export const StoreHomeDispatcher = createDispatcher(DefaultStoreHome, "StoreHome");
export const StoreProductsDispatcher = createDispatcher(DefaultStoreProducts, "StoreProducts");
export const StoreProductDetailsDispatcher = createDispatcher(DefaultStoreProductDetails, "StoreProductDetails");
export const StoreAboutDispatcher = createDispatcher(DefaultStoreAbout, "StoreAbout");
export const StoreContactDispatcher = createDispatcher(DefaultStoreContact, "StoreContact");
