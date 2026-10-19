import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const CartToast: React.FC = () => {
  const { activeToast, dismissToast, openCartDrawer } = useCart();

  useEffect(() => {
    if (!activeToast) return;
    const timer = setTimeout(() => {
      dismissToast();
    }, 3800);
    return () => clearTimeout(timer);
  }, [activeToast, dismissToast]);

  return (
    <AnimatePresence>
      {activeToast && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', damping: 24, stiffness: 350 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[65] pointer-events-auto"
        >
          <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-[#2F3E2C] text-[#FBF8F2] shadow-2xl border border-white/15 backdrop-blur-md">
            <div className="w-6 h-6 rounded-full bg-[#4F6B47] flex items-center justify-center shrink-0">
              <ShoppingBag className="w-3.5 h-3.5 text-white" />
            </div>

            <span className="text-xs font-medium tracking-wide">
              {activeToast}
            </span>

            <span className="text-white/30" aria-hidden="true">·</span>

            <button
              onClick={() => {
                dismissToast();
                openCartDrawer();
              }}
              className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[#F4C9A8] hover:text-white transition-colors cursor-pointer"
            >
              <span>View Cart</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
