import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Phone, Compass, Plus, X } from 'lucide-react';
import { BUSINESS_INFO } from '../data/business';

interface FloatingActionGroupProps {
  onOpenBooking: () => void;
}

export const FloatingActionGroup: React.FC<FloatingActionGroupProps> = ({ onOpenBooking }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Appear after scrolling past ~450px (hero section)
      setIsVisible(window.scrollY > 450);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 pointer-events-auto">
      {/* Expanded Actions */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="flex flex-col items-end gap-2.5 mb-1"
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          >
            {/* Call */}
            <motion.a
              href={BUSINESS_INFO.phoneTel}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#FBF8F2] text-[#2F3E2C] text-xs font-semibold shadow-lg hover:shadow-xl border border-[#2F3E2C]/10 transition-all hover:bg-[#DCE5D3]/60 cursor-pointer"
              whileHover={{ x: -4 }}
            >
              <span>Call Us</span>
              <div className="w-7 h-7 rounded-full bg-[#4F6B47] text-white flex items-center justify-center">
                <Phone className="w-3.5 h-3.5" />
              </div>
            </motion.a>

            {/* Directions */}
            <motion.a
              href={BUSINESS_INFO.googleMapsDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#FBF8F2] text-[#2F3E2C] text-xs font-semibold shadow-lg hover:shadow-xl border border-[#2F3E2C]/10 transition-all hover:bg-[#DCE5D3]/60 cursor-pointer"
              whileHover={{ x: -4 }}
            >
              <span>Directions</span>
              <div className="w-7 h-7 rounded-full bg-[#2F3E2C] text-white flex items-center justify-center">
                <Compass className="w-3.5 h-3.5" />
              </div>
            </motion.a>

            {/* Book a Table */}
            <motion.button
              onClick={() => {
                setIsOpen(false);
                onOpenBooking();
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#4F6B47] text-white text-xs font-semibold shadow-lg hover:shadow-xl transition-all hover:bg-[#2F3E2C] cursor-pointer"
              whileHover={{ x: -4 }}
            >
              <span>Book Table</span>
              <div className="w-7 h-7 rounded-full bg-white text-[#4F6B47] flex items-center justify-center">
                <Calendar className="w-3.5 h-3.5" />
              </div>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Quick actions: Call, Book, or Directions"
        className="w-13 h-13 rounded-full bg-gradient-to-tr from-[#2F3E2C] to-[#4F6B47] text-[#FBF8F2] shadow-[0_8px_25px_rgba(47,62,44,0.28)] flex items-center justify-center hover:scale-105 active:scale-95 transition-transform cursor-pointer border border-[#FBF8F2]/20"
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
        </motion.div>
      </motion.button>
    </div>
  );
};
