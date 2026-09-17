import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Icon from './Icon';
import { formatPrice, FREE_SHIPPING_THRESHOLD } from '../constants';
import { removeFromCart, updateCartQuantity } from '../../../redux/reducers/cartReducer';
import toast from 'react-hot-toast';

export default function CartDrawer({
  open,
  isOpen,
  cart = [],
  items,
  products = [],
  onClose,
  onQty,
  onUpdateQuantity,
  onRemove,
  onRemoveItem,
  onCheckout,
}) {
  const isVisible = open !== undefined ? open : isOpen !== undefined ? isOpen : true;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const reduxCartItems = useSelector((s) => s.cart?.cartItems || []);

  const panelRef = useRef(null);

  useEffect(() => {
    if (isVisible) {
      const first = panelRef.current?.querySelector("button");
      first?.focus();
    }
  }, [isVisible]);

  if (!isVisible) return null;

  const actualCart = (Array.isArray(cart) && cart.length > 0)
    ? cart
    : (Array.isArray(items) && items.length > 0)
      ? items
      : reduxCartItems;

  const handleQty = (productId, sku, newQty) => {
    const targetId = productId || sku;
    if (onQty) {
      onQty(targetId, sku, newQty);
    } else if (onUpdateQuantity) {
      onUpdateQuantity(targetId, sku, newQty);
    } else {
      if (newQty < 1) {
        dispatch(removeFromCart(targetId));
        toast.success("Item removed from cart");
      } else {
        dispatch(updateCartQuantity({ productId: targetId, quantity: newQty }));
      }
    }
  };

  const handleRemove = (productId, sku, item) => {
    const targetId = productId || sku || item?._id || item?.id;
    if (onRemove) {
      onRemove(targetId, sku || targetId, item);
    } else if (onRemoveItem) {
      onRemoveItem(targetId, sku || targetId, item);
    } else {
      dispatch(removeFromCart(targetId));
      toast.success("Item removed from cart");
    }
  };

  const handleProceedCheckout = () => {
    if (onCheckout) {
      onCheckout();
    } else {
      if (onClose) onClose();
      navigate("/cart");
    }
  };

  const cartCount = actualCart.reduce((sum, item) => sum + (item.quantity || 0), 0);

  const subtotal = actualCart.reduce((sum, item) => {
    const itemId = String(item.productId ?? item._id ?? item.id ?? "");
    const itemSku = String(item.sku ?? "");
    const product =
      (products || []).find((entry) => {
        const entryId = String(entry._id ?? entry.id ?? "");
        const entrySku = String(entry.sku ?? "");
        return (
          (entryId && (entryId === itemId || entryId === itemSku)) ||
          (entrySku && (entrySku === itemId || entrySku === itemSku))
        );
      }) || item.product || item;

    const unitPrice = Number(product?.price ?? item.price ?? 0);
    return sum + unitPrice * (item.quantity || 1);
  }, 0);

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : 99;
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;

  return (
    <div className="fixed inset-0 z-[1100] flex items-stretch justify-end" role="dialog" aria-modal="true" aria-label="Shopping cart">
      <button className="absolute inset-0 bg-text-dark/45 backdrop-blur-[2px] animate-fade-in" type="button" onClick={onClose} aria-label="Close cart" />
      <aside className="relative flex h-full w-full max-w-[420px] flex-col bg-cream animate-slide-in-right" ref={panelRef}>
        <div className="flex items-center justify-between border-b border-cream-dark p-5 px-6 bg-white">
          <h2 className="flex items-center gap-2.5 text-text-dark font-display text-xl font-semibold">
            <Icon name="bag" className="h-5 w-5" />
            Your Cart
            <span className="rounded-full px-2.5 py-0.75 bg-blue-light text-text-dark font-body text-[11px] font-medium tracking-wide">{cartCount} items</span>
          </h2>
          <button className="flex h-11 w-11 items-center justify-center border border-cream-dark rounded-full bg-cream text-text-dark hover:bg-cream-dark/50 transition-colors" type="button" onClick={onClose} aria-label="Close cart">
            <Icon name="x" className="h-5 w-5" />
          </button>
        </div>

        {/* Free Shipping Progress */}
        <div className="p-4 px-6 border-b border-cream-dark bg-white">
          {remaining > 0 ? (
            <p className="text-xs text-text-muted">
              Add <span className="font-semibold text-text-dark">{formatPrice(remaining)}</span> more for Free Shipping!
            </p>
          ) : (
            <p className="text-xs font-medium text-blue-soft">Congratulations! You've unlocked Free Shipping.</p>
          )}
          <div className="mt-2 h-1.5 w-full bg-cream-dark/55 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-soft transition-all duration-350"
              style={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {actualCart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <Icon name="box" className="w-16 h-16 mb-4 text-blue-soft/60" />
              <p className="text-text-dark font-display text-lg font-medium">Your cart is empty</p>
              <p className="text-text-muted text-xs mt-1">Add some beautiful keepsakes to your cart.</p>
            </div>
          ) : (
            actualCart.map((item, idx) => {
              const itemId = String(item.productId ?? item._id ?? item.id ?? "");
              const itemSku = String(item.sku ?? "");
              const product =
                (products || []).find((p) => {
                  const pId = String(p._id ?? p.id ?? "");
                  const pSku = String(p.sku ?? "");
                  return (
                    (pId && (pId === itemId || pId === itemSku)) ||
                    (pSku && (pSku === itemId || pSku === itemSku))
                  );
                }) ||
                item.product ||
                item;

              const title = product?.name || item?.name || item?.title || "Heirloom Keepsake";
              const price = Number(product?.price ?? item?.price ?? 0);
              const image =
                product?.image ||
                product?.images?.[0]?.url ||
                (typeof product?.images?.[0] === "string" ? product.images[0] : null) ||
                item?.image ||
                item?.images?.[0]?.url ||
                (typeof item?.images?.[0] === "string" ? item.images[0] : null) ||
                "https://starlingtales.vercel.app/2.jpeg";
              const variant = item.variantLabel || item.selectedOptions || item.selectedVariant || "Standard";
              const removeId = item.productId || item._id || item.id || item.sku;
              const uniqueKey = `${removeId}-${item.sku || idx}`;

              return (
                <div key={uniqueKey} className="flex gap-4 border-b border-cream-dark/40 pb-4">
                  <div className="h-20 w-16 shrink-0 overflow-hidden rounded-md border border-cream-dark bg-white">
                    <img src={image} alt={title} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-text-dark">{title}</h4>
                      <p className="text-[11px] text-text-muted">{variant}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-cream-dark rounded bg-white">
                        <button 
                          className="h-7 w-7 flex items-center justify-center text-text-muted hover:text-text-dark cursor-pointer transition-colors"
                          onClick={() => handleQty(removeId, item.sku, item.quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          <Icon name="minus" className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-medium text-text-dark">{item.quantity}</span>
                        <button 
                          className="h-7 w-7 flex items-center justify-center text-text-muted hover:text-text-dark cursor-pointer transition-colors"
                          onClick={() => handleQty(removeId, item.sku, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          <Icon name="plus" className="h-3 w-3" />
                        </button>
                      </div>
                      <span className="text-sm font-semibold text-text-dark">{formatPrice(price * item.quantity)}</span>
                    </div>
                  </div>
                  <button 
                    className="h-8 w-8 flex items-center justify-center text-text-muted hover:text-danger hover:bg-red-50 rounded-full shrink-0 cursor-pointer transition-colors"
                    onClick={() => handleRemove(removeId, item.sku, item)}
                    title="Remove item"
                    aria-label="Remove item"
                  >
                    <Icon name="trash" className="h-4 w-4" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer / Summary */}
        <div className="border-t border-cream-dark p-6 bg-white space-y-4">
          <div className="space-y-2 text-sm text-text-body">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium text-text-dark">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
            </div>
            <div className="flex justify-between text-base font-semibold border-t border-cream-dark/40 pt-2 text-text-dark">
              <span>Total</span>
              <span>{formatPrice(subtotal + shipping)}</span>
            </div>
          </div>
          <button 
            className="w-full min-h-[48px] rounded bg-text-dark text-cream text-xs font-semibold tracking-widest uppercase hover:bg-blue-soft transition-colors duration-200 cursor-pointer disabled:opacity-50"
            disabled={actualCart.length === 0}
            onClick={handleProceedCheckout}
          >
            Proceed to Checkout
          </button>
        </div>
      </aside>
    </div>
  );
}
