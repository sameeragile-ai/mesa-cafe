import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import { REVIEWS, GOOGLE_STATS } from '../data/reviews';

export const KindWordsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const activeReview = REVIEWS[currentIndex];

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % REVIEWS.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <section
      id="reviews"
      className="py-24 sm:py-32 bg-gradient-to-b from-[#DCE5D3]/40 via-[#F6F1E7] to-[#FBF8F2] relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Section Header */}
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#4F6B47] font-semibold mb-6">
          <span>06</span>
          <span className="w-6 h-[1px] bg-[#4F6B47]/40" />
          <span>Kind Words</span>
        </div>

        {/* 5-Star Rating Pill */}
        <div className="flex items-center justify-center gap-1.5 mb-8">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-5 h-5 fill-[#C9774F] text-[#C9774F]" />
          ))}
          <span className="text-sm font-semibold text-[#2F3E2C] ml-2">4.8 / 5.0</span>
        </div>

        {/* Big Serif Quote Carousel */}
        <div className="relative min-h-[180px] sm:min-h-[160px] flex items-center justify-center mb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-3xl"
            >
              <blockquote className="font-serif italic text-3xl sm:text-4xl md:text-5xl text-[#2F3E2C] leading-tight">
                &ldquo;{activeReview.quote}&rdquo;
              </blockquote>
              <div className="mt-5 text-sm font-medium text-stone-600">
                <span className="text-[#2F3E2C] font-semibold">{activeReview.author}</span>
                <span className="mx-2">·</span>
                <span>{activeReview.location}</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress Bar + Navigation Dots */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <button
            onClick={() => setCurrentIndex((prev) => (prev - 1 + REVIEWS.length) % REVIEWS.length)}
            aria-label="Previous review"
            className="p-2 rounded-full hover:bg-[#2F3E2C]/5 text-[#2F3E2C] transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            {REVIEWS.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                aria-label={`Go to review ${i + 1}`}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  currentIndex === i ? 'w-8 bg-[#4F6B47]' : 'w-2 bg-[#2F3E2C]/20 hover:bg-[#2F3E2C]/40'
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % REVIEWS.length)}
            aria-label="Next review"
            className="p-2 rounded-full hover:bg-[#2F3E2C]/5 text-[#2F3E2C] transition-colors cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Read all on Google Link */}
        <a
          href={GOOGLE_STATS.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#4F6B47] hover:text-[#2F3E2C] transition-colors underline underline-offset-4 group"
        >
          <span>Read all 520+ reviews on Google</span>
          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </a>
      </div>
    </section>
  );
};
