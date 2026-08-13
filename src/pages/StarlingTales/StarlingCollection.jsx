import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./StarlingTales.css";
import { useStore } from "../Store/StoreLayout";
import {
  addToCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
} from "../../redux/reducers/cartReducer";
import { toggleWishlist } from "../../redux/reducers/wishlistReducer";
import toast from "react-hot-toast";
import { navLinks, formatPrice } from "./constants";
import Icon from "./components/Icon";
import ProductCard from "./components/ProductCard";
import ProductModal from "./components/ProductModal";
import CartDrawer from "./components/CartDrawer";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { MoveRight } from "lucide-react";
export default function StarlingCollection() {
  const dispatch = useDispatch();
  const { business } = useStore();

  const navigate = useNavigate();
  // Retrieve data from Store Context (API fetched)
  const { products } = useStore();

  // Retrieve data from Redux Store
  const cartItems = useSelector((s) => s.cart?.cartItems || []);
  const wishlistItems = useSelector((s) => s.wishlist?.items || []);

  const [activeCategory, setActiveCategory] = useState("All");
  const [quickViewId, setQuickViewId] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);

  const mappedProducts = useMemo(() => {
    if (!products) return [];

    return products.slice(0, 4).map((p, index) => {
      const mainImage =
        p.images?.[0]?.url ||
        "https://via.placeholder.com/400x300?text=No+Image";

      const galleryImages =
        p.images?.length > 0 ? p.images.map((img) => img.url) : [mainImage];

      const productVariants =
        p.variants?.length > 0
          ? p.variants.map((v, i) => ({
              label: v.label || v.name || `Option ${i + 1}`,
              sku: v.sku || `${p._id}-${i}`,
            }))
          : [{ label: "Standard", sku: p._id }];

      return {
        id: p._id,
        name: p.name,
        tagline:
          p.tagline ||
          (p.description ? p.description.split(".")[0] + "." : p.name),
        price: p.price,
        originalPrice: p.compareAtPrice || null,
        image: mainImage,
        gallery: galleryImages,
        category: p.category?.name || "General",
        badge:
          p.compareAtPrice > p.price
            ? "Sale"
            : index % 4 === 0
              ? "Bestseller"
              : index % 4 === 1
                ? "New"
                : null,
        rating: p.rating || 4.8,
        reviews: p.numReviews || 12,
        inStock: p.stock === undefined || p.stock > 0,
        description: p.description || "",
        details: p.details || [
          `Stock: ${p.stock !== undefined ? p.stock : "Available"}`,
          "Safety tested & CE certified",
          "Material: 100% Cotton Outer",
        ],
        tags: p.tags || [],
        variants: productVariants,
      };
    });
  }, [products]);

  // Map Redux cart items to what CartDrawer expects
  const mappedCart = useMemo(() => {
    return cartItems.map((item) => ({
      productId: item._id,
      sku: item._id,
      variantLabel: "Standard",
      quantity: item.quantity,
    }));
  }, [cartItems]);

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0),
    [cartItems],
  );

  const categoryNames = useMemo(() => {
    const list = new Set(mappedProducts.map((p) => p.category));
    return ["All", ...Array.from(list)];
  }, [mappedProducts]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === "All") return mappedProducts;
    return mappedProducts.filter(
      (p) => p.category.toLowerCase() === activeCategory.toLowerCase(),
    );
  }, [activeCategory, mappedProducts]);

  const quickViewProduct = useMemo(() => {
    if (!quickViewId) return null;
    return mappedProducts.find((p) => p.id === quickViewId) || null;
  }, [quickViewId, mappedProducts]);

  // Cart Handlers
  const handleAddToCart = (productId, sku, qty = 1) => {
    const origProduct = products.find((p) => p._id === productId);
    if (!origProduct) return;

    const availableStock =
      origProduct.inventory?.stockQuantity !== undefined
        ? Number(origProduct.inventory.stockQuantity)
        : origProduct.stockQuantity !== undefined
        ? Number(origProduct.stockQuantity)
        : origProduct.stock !== undefined
        ? Number(origProduct.stock)
        : origProduct.countInStock !== undefined
        ? Number(origProduct.countInStock)
        : 0;

    if (availableStock <= 0) {
      toast.error(`Sorry, ${origProduct.name} is currently out of stock!`);
      return;
    }

    const itemInCart = cartItems.find((item) => item._id === origProduct._id);
    const currentCartQty = itemInCart ? itemInCart.quantity : 0;

    if (currentCartQty + qty > availableStock) {
      toast.error(
        `Cannot add more. Only ${availableStock} units available in inventory (${currentCartQty} already in cart).`
      );
      return;
    }

    dispatch(addToCart({ product: origProduct, quantity: qty }));
    const remaining = availableStock - (currentCartQty + qty);
    toast.success(
      `${origProduct.name} added to cart! ${
        remaining > 0 ? `(${remaining} units left in stock)` : "(Reached max available stock)"
      }`
    );
    setCartOpen(true);
  };

  const handleUpdateQty = (productId, sku, newQty) => {
    if (newQty < 1) {
      handleRemoveFromCart(productId, sku);
      return;
    }
    const origProduct = products.find((p) => p._id === productId);
    const availableStock = origProduct
      ? origProduct.inventory?.stockQuantity !== undefined
        ? Number(origProduct.inventory.stockQuantity)
        : origProduct.stockQuantity !== undefined
        ? Number(origProduct.stockQuantity)
        : origProduct.stock !== undefined
        ? Number(origProduct.stock)
        : origProduct.countInStock !== undefined
        ? Number(origProduct.countInStock)
        : 0
      : 99;

    if (newQty > availableStock) {
      toast.error(`Cannot increase. Only ${availableStock} units available in inventory.`);
      return;
    }
    dispatch(updateCartQuantity({ productId: productId, _id: productId, quantity: newQty }));
  };

  const handleRemoveFromCart = (productId, sku) => {
    dispatch(removeFromCart(productId));
    toast.success("Item removed from cart.");
  };

  const handleWishlistToggle = (productId) => {
    const origProduct = products.find((p) => p._id === productId);
    if (origProduct) {
      dispatch(toggleWishlist(origProduct));
      const isCurrentlyWishlisted = wishlistItems.some(
        (item) => item._id === productId,
      );
      if (isCurrentlyWishlisted) {
        toast.success(`${origProduct.name} removed from wishlist!`);
      } else {
        toast.success(`${origProduct.name} added to wishlist!`);
      }
    }
  };

  const handleCheckout = () => {
    navigate("/cart");
    setCartOpen(false);
  };

  return (
    <div className="min-h-screen bg-cream text-text-dark font-sans selection:bg-blue-light selection:text-blue-soft relative overflow-x-hidden w-full">
      {/* Main Section */}
      <main className="py-16 px-6 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3.5">
          <h1 className="text-4xl font-display font-semibold text-text-dark">
            Our Collection
          </h1>
          <div
            className="flex w-full max-w-[190px] items-center gap-3 text-blue-soft mx-auto"
            aria-hidden="true"
          >
            <span className="h-0.5 flex-1 border-t border-dashed border-blue-muted" />
            <Icon name="heart" className="h-5 w-5" />
            <span className="h-0.5 flex-1 border-t border-dashed border-blue-muted" />
          </div>
          <p className="text-xs text-text-muted max-w-md mx-auto leading-relaxed font-light">
            Handcrafted pieces for little ones
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isWishlisted={wishlistItems.some(
                (item) => item._id === product.id,
              )}
              onWishlist={handleWishlistToggle}
              onQuickView={setQuickViewId}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
        {/* Right section  */}
        <div className="flex justify-end ">
          <Link
            to={`/${encodeURIComponent(business.businessName)}/products`}
            className="text-dark font-semibold"
          >
            Show more <MoveRight className="inline-block h-4 w-4 ml-1" />
          </Link>
        </div>
      </main>
      {/* Cart Drawer */}
      {cartOpen && (
        <CartDrawer
          cart={mappedCart}
          products={mappedProducts}
          onClose={() => setCartOpen(false)}
          onQty={handleUpdateQty}
          onRemove={handleRemoveFromCart}
          onCheckout={handleCheckout}
        />
      )}

      {/* Product Quick View Modal */}
      {quickViewProduct && (
        <ProductModal
          product={quickViewProduct}
          isWishlisted={wishlistItems.some(
            (item) => item._id === quickViewProduct.id,
          )}
          onClose={() => setQuickViewId(null)}
          onWishlist={handleWishlistToggle}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  );
}
