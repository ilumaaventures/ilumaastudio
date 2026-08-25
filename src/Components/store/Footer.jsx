import React from "react";
import { Link } from "react-router-dom";
import { Store, Mail, Phone, MapPin } from "lucide-react";
import { useStore } from "../../pages/Store/StoreContext";

export default function Footer() {
  const { business, storeHomePath } = useStore();
  const basePath =
    storeHomePath ||
    `/${encodeURIComponent(business?.subdomain || business?.slug || business?.businessName || "")}`;

  return (
    <footer className="bg-gray-900 border-t border-gray-800 text-gray-400">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="space-y-4 md:col-span-2">
            <Link to={basePath} className="flex items-center gap-2.5 text-white">
              {business?.logo ? (
                <img
                  src={business.logo}
                  alt={business.businessName || "Store"}
                  className="h-8 w-auto object-contain rounded"
                />
              ) : (
                <div className="w-8 h-8 rounded bg-indigo-600 text-white flex items-center justify-center font-bold">
                  <Store size={16} />
                </div>
              )}
              <span className="font-extrabold text-white text-base tracking-tight capitalize">
                {business?.businessName || "Storefront"}
              </span>
            </Link>
            <p className="text-xs leading-relaxed max-w-sm">
              {business?.description ||
                `Browse and shop premium collections from ${business?.businessName || "our store"}. We are committed to providing the highest quality items and an exceptional customer experience.`}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to={basePath} className="hover:text-indigo-400 transition">
                  Storefront Home
                </Link>
              </li>
              <li>
                <Link to={`${basePath}/products`} className="hover:text-indigo-400 transition">
                  Browse Products
                </Link>
              </li>
              <li>
                <Link to={`${basePath}/about`} className="hover:text-indigo-400 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to={`${basePath}/contact`} className="hover:text-indigo-400 transition">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Contact Info</h4>
            <ul className="space-y-2.5 text-xs">
              {business?.businessEmail && (
                <li className="flex items-center gap-2">
                  <Mail size={14} className="text-indigo-400 shrink-0" />
                  <span className="truncate">{business.businessEmail}</span>
                </li>
              )}
              {business?.businessPhone && (
                <li className="flex items-center gap-2">
                  <Phone size={14} className="text-indigo-400 shrink-0" />
                  <span>{business.businessPhone}</span>
                </li>
              )}
              {business?.address && (
                <li className="flex items-start gap-2">
                  <MapPin size={14} className="text-indigo-400 shrink-0 mt-0.5" />
                  <span className="leading-tight">
                    {business.address.street ? (
                      <>
                        {business.address.street}, {business.address.city}, {business.address.state} {business.address.postalCode}
                      </>
                    ) : (
                      "Default Store Address"
                    )}
                  </span>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-[10px] text-gray-500">
          &copy; {new Date().getFullYear()} {business?.businessName || "Store"}. All rights reserved. Powered by ILumaa.
        </div>
      </div>
    </footer>
  );
}
