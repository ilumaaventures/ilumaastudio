import React from "react";
import { useParams } from "react-router-dom";
import customStoresRegistry from "../registry";
import { getTenantSubdomain } from "../../../utils/tenant";
import { useStore } from "../StoreLayout";

// Default Page Components
import DefaultStoreHome from "../StoreHome";
import DefaultStoreProducts from "../Products";
import DefaultStoreProductDetails from "../ProductDetails";
import DefaultStoreAbout from "../About";
import DefaultStoreContact from "../Contact";

import { useStore } from "../StoreContext";

// High-Order Component to create store page dispatchers dynamically
const createDispatcher = (DefaultComponent, pageKey) => {
  return function Dispatcher(props) {
    let storeContext = null;
    try {
      storeContext = useStore();
    } catch (_) {}

    const { businessName } = useParams();
<<<<<<< HEAD
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
=======
    const identifier = businessName || getTenantSubdomain();
    const normalizedName = identifier
      ? identifier.toLowerCase().replace(/[\s-]/g, "")
      : "";

    // Defense in depth: Check business customTemplateKey or validated registry match
    const templateKey =
      storeContext?.business?.customTemplateKey ||
      (customStoresRegistry[normalizedName] ? normalizedName : null);

    // Resolve custom page override from registry
    const CustomComponent = templateKey
      ? customStoresRegistry[templateKey]?.[pageKey]
      : null;
>>>>>>> 9d38903e872714ab84df19b3829bd2415adc6673

    if (CustomComponent) {
      return <CustomComponent {...props} />;
    }
    return <DefaultComponent {...props} />;
  };
};

<<<<<<< HEAD
export const StoreHomeDispatcher = createDispatcher(DefaultStoreHome, "StoreHome");
export const StoreProductsDispatcher = createDispatcher(DefaultStoreProducts, "StoreProducts");
export const StoreProductDetailsDispatcher = createDispatcher(DefaultStoreProductDetails, "StoreProductDetails");
export const StoreAboutDispatcher = createDispatcher(DefaultStoreAbout, "StoreAbout");
export const StoreContactDispatcher = createDispatcher(DefaultStoreContact, "StoreContact");
export const StoreGiftHampersDispatcher = createDispatcher(DefaultStoreProducts, "StoreGiftHampers");

=======
export const StoreHomeDispatcher = createDispatcher(
  DefaultStoreHome,
  "StoreHome",
);
export const StoreProductsDispatcher = createDispatcher(
  DefaultStoreProducts,
  "StoreProducts",
);
export const StoreProductDetailsDispatcher = createDispatcher(
  DefaultStoreProductDetails,
  "StoreProductDetails",
);
export const StoreAboutDispatcher = createDispatcher(
  DefaultStoreAbout,
  "StoreAbout",
);
export const StoreContactDispatcher = createDispatcher(
  DefaultStoreContact,
  "StoreContact",
);
>>>>>>> 9d38903e872714ab84df19b3829bd2415adc6673
