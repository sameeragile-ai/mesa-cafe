import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Calendar, Phone } from 'lucide-react';
import { IMAGES } from '../data/images';
import { BUSINESS_INFO } from '../data/business';

interface BookingCtaBandProps {
  onOpenBooking: () => void;
}

export const BookingCtaBand: React.FC<BookingCtaBandProps> = ({ onOpenBooking }) => {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden bg-[#2F3E2C] text-[#FBF8F2]">
      {/* Background Image: baked-eggs.jpg */}
      <div className="absolute inset-0 z-0">
        <img
          src={IMAGES.bakedEggs.src}
          alt={IMAGES.bakedEggs.alt}
          className="w-full h-full object-cover object-center filter brightness-[0.45] saturate-[1.1] scale-105"
        />
        {/* Sage-900 overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#2F3E2C]/92 via-[#2F3E2C]/80 to-[#4F6B47]/85" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-xs text-xs font-semibold uppercase tracking-widest text-[#DCE5D3] border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-[#F4C9A8]" />
            <span>Duke Street Tables</span>
          </div>

          <h2 className="font-serif italic text-4xl sm:text-5xl lg:text-6xl text-[#FBF8F2] leading-tight">
            Save yourself a seat.
          </h2>

          <p className="text-stone-300 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Walk-ins are always warmly welcomed. But if you’re joining us with friends or want to ensure a table at weekend peak, reserving takes under a minute.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={onOpenBooking}
              data-cursor="book"
              className="relative group overflow-hidden px-8 py-3.5 rounded-full text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#2F3E2C] bg-[#FBF8F2] hover:bg-white transition-all shadow-xl hover:shadow-2xl flex items-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-[#4F6B47]" />
              <span>Book a Table Online</span>
            </button>

            <a
              href={BUSINESS_INFO.phoneTel}
              className="px-7 py-3.5 rounded-full text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#FBF8F2] bg-white/10 hover:bg-white/20 border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Phone className="w-4 h-4 text-[#F4C9A8]" />
              <span>Ring {BUSINESS_INFO.phoneDisplay}</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
