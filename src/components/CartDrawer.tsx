import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart, formatCurrency } from '../context/CartContext';
import { SmartImage } from './SmartImage';

export const CartDrawer: React.FC = () => {
  const {
    items,
    orderNote,
    subtotalFormatted,
    isCartDrawerOpen,
    closeCartDrawer,
    removeItem,
    increaseQuantity,
    decreaseQuantity,
    setOrderNote,
  } = useCart();
  const navigate = useNavigate();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartDrawerOpen) closeCartDrawer();
    };
    if (isCartDrawerOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCartDrawerOpen, closeCartDrawer]);

  const handleCheckoutClick = () => {
    closeCartDrawer();
    navigate('/checkout');
  };

  const handleOrderExplore = () => {
    closeCartDrawer();
    navigate('/order');
  };

  return (
    <AnimatePresence>
      {isCartDrawerOpen && (
        <div className="fixed inset-0 z-[70] overflow-hidden">
          {/* Frosted Backdrop */}
          <motion.div
            className="fixed inset-0 bg-[#1F2420]/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCartDrawer}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10 pointer-events-auto">
            <motion.div
              className="w-screen max-w-md bg-[#FBF8F2] shadow-2xl flex flex-col border-l border-[#2F3E2C]/10"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            >
              {/* Drawer Header */}
              <div className="p-5 sm:p-6 border-b border-[#2F3E2C]/10 flex items-center justify-between bg-white/60">
                <div className="flex items-center gap-2.5">
                  <ShoppingBag className="w-5 h-5 text-[#4F6B47]" />
                  <h3 className="font-serif italic text-2xl text-[#2F3E2C]">
                    Your Collection Cart
                  </h3>
                </div>
                <button
                  onClick={closeCartDrawer}
                  aria-label="Close cart drawer"
                  className="p-1.5 rounded-full hover:bg-stone-200/60 text-[#2F3E2C] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items List or Empty State */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
                {items.length === 0 ? (
                  <div className="py-16 text-center space-y-4">
                    <img
                      src="/images/mesa-logo.png"
                      alt="MESA logo"
                      className="w-16 h-16 rounded-full object-cover mx-auto shadow-md"
                    />
                    <h4 className="font-serif italic text-2xl text-[#2F3E2C]">
                      Your cart&apos;s looking light.
                    </h4>
                    <p className="text-xs sm:text-sm text-stone-600 max-w-xs mx-auto">
                      Fancy a Morning Roll, stacked pancakes, or a fresh batch brew?
                    </p>
                    <button
                      onClick={handleOrderExplore}
                      className="px-6 py-2.5 rounded-full bg-[#2F3E2C] text-[#FBF8F2] text-xs font-semibold tracking-wider uppercase hover:bg-[#4F6B47] transition-colors shadow-sm cursor-pointer"
                    >
                      Browse Click &amp; Collect Menu
                    </button>
                  </div>
                ) : (
                  items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="p-3.5 rounded-2xl bg-white border border-[#2F3E2C]/8 shadow-xs flex gap-3.5 items-start"
                    >
                      {/* Thumbnail */}
                      {item.product.image ? (
                        <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-[#EAEFE6] border border-[#2F3E2C]/5">
                          <SmartImage
                            src={item.product.image}
                            alt={item.product.name}
                            aspectRatio="aspect-square"
                            className="w-full h-full"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#4F6B47] to-[#2F3E2C] shrink-0 flex items-center justify-center text-white">
                          <img
                            src="/images/mesa-logo.png"
                            alt="MESA logo"
                            className="w-7 h-7 rounded-full object-cover"
                          />
                        </div>
                      )}

                      {/* Info & Modifiers */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline justify-between gap-2">
                          <h4 className="font-serif text-base text-[#2F3E2C] truncate">
                            {item.product.name}
                          </h4>
                          <span className="font-serif text-sm font-semibold text-[#2F3E2C] tabular-nums shrink-0">
                            {formatCurrency(item.totalPrice)}
                          </span>
                        </div>

                        {item.selectedModifiers.length > 0 && (
                          <div className="text-[11px] text-stone-500 space-y-0.5 mt-0.5">
                            {item.selectedModifiers.map((m) => (
                              <div key={m.groupId} className="truncate">
                                <span className="font-medium text-stone-600">{m.groupName}:</span>{' '}
                                {m.option.name}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Quantity Stepper & Remove */}
                        <div className="flex items-center justify-between mt-2.5 pt-1.5 border-t border-stone-100">
                          <div className="flex items-center gap-1.5 bg-[#F6F1E7] rounded-full p-0.5 border border-[#2F3E2C]/10">
                            <button
                              onClick={() => decreaseQuantity(item.id)}
                              aria-label="Decrease quantity"
                              className="w-6 h-6 rounded-full bg-white text-[#2F3E2C] flex items-center justify-center hover:bg-stone-100 transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-5 text-center text-xs font-semibold tabular-nums text-[#2F3E2C]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => increaseQuantity(item.id)}
                              aria-label="Increase quantity"
                              className="w-6 h-6 rounded-full bg-white text-[#2F3E2C] flex items-center justify-center hover:bg-stone-100 transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(item.id)}
                            aria-label={`Remove ${item.product.name}`}
                            className="p-1 rounded-full text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Order Notes & Checkout Footer */}
              {items.length > 0 && (
                <div className="p-5 sm:p-6 border-t border-[#2F3E2C]/10 bg-white/70 space-y-4">
                  {/* Order Note */}
                  <div>
                    <label
                      htmlFor="cart-order-note"
                      className="block text-[11px] font-semibold uppercase tracking-wider text-[#2F3E2C] mb-1"
                    >
                      Order Note / Special Instructions
                    </label>
                    <input
                      id="cart-order-note"
                      type="text"
                      placeholder="e.g. Extra hot flat white, cutlery please"
                      value={orderNote}
                      onChange={(e) => setOrderNote(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-xl bg-[#F6F1E7] border border-[#2F3E2C]/15 outline-none focus:border-[#4F6B47] text-[#2F3E2C]"
                    />
                  </div>

                  {/* Subtotal */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-stone-600">Estimated Total (Collection)</span>
                    <span className="font-serif text-2xl font-semibold text-[#2F3E2C] tabular-nums">
                      {subtotalFormatted}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    <button
                      onClick={handleCheckoutClick}
                      className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#4F6B47] to-[#2F3E2C] text-[#FBF8F2] text-xs font-semibold tracking-wider uppercase hover:from-[#2F3E2C] hover:to-[#4F6B47] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Proceed to Checkout</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={closeCartDrawer}
                      className="w-full py-2.5 px-4 rounded-full text-xs font-semibold tracking-wider uppercase text-stone-600 hover:text-[#2F3E2C] transition-colors cursor-pointer"
                    >
                      Continue Browsing
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
