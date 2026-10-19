import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { MENU_CATEGORIES, MENU_ITEMS, MENU_SEASONAL_NOTE } from '../data/menu';
import { IMAGES } from '../data/images';
import { SmartImage } from '../components/SmartImage';

export const MenuPreviewSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'breakfast' | 'brunch' | 'sandwiches' | 'sweet' | 'drinks'>('breakfast');

  const currentCategory = MENU_CATEGORIES.find((c) => c.id === activeTab) || MENU_CATEGORIES[0];
  const items = MENU_ITEMS.filter((item) => item.category === activeTab);
  const categoryImage = IMAGES[currentCategory.imageKey] || IMAGES.tomatoToast;

  return (
    <section id="menu-preview" className="py-24 sm:py-32 bg-[#FBF8F2] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-[#4F6B47] font-semibold mb-3">
              <span>04</span>
              <span className="w-8 h-[1px] bg-[#4F6B47]/40" />
              <span>Menu Preview</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#2F3E2C] tracking-tight">
              Good food, <span className="italic font-serif text-[#4F6B47]">honest prices</span>.
            </h2>
          </div>

          <Link
            to="/menu"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#4F6B47] hover:text-[#2F3E2C] transition-colors group"
          >
            <span>View complete menu &amp; drinks</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Tab Selector with Animated Sliding Pill */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar border-b border-[#2F3E2C]/10">
          {MENU_CATEGORIES.map((cat) => {
            const isActive = activeTab === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className="relative px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase whitespace-nowrap transition-colors cursor-pointer"
              >
                {isActive && (
                  <motion.div
                    layoutId="menuActiveTab"
                    className="absolute inset-0 bg-[#2F3E2C] rounded-full shadow-sm"
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  />
                )}
                <span
                  className={`relative z-10 ${
                    isActive ? 'text-[#FBF8F2]' : 'text-stone-600 hover:text-[#2F3E2C]'
                  }`}
                >
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Two-Column Grid: Featured Category Photo + Menu List with Dotted Leaders */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left: Tab Image (5 cols) */}
          <div className="lg:col-span-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-2xl overflow-hidden shadow-lg border border-[#2F3E2C]/10 bg-[#EAEFE6] relative"
              >
                <SmartImage
                  src={categoryImage.src}
                  alt={categoryImage.alt}
                  aspectRatio="aspect-[4/3] sm:aspect-[1/1]"
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                  <span className="text-[11px] font-semibold tracking-widest uppercase text-[#DCE5D3]">
                    {currentCategory.name}
                  </span>
                  <p className="font-serif italic text-2xl mt-0.5">{categoryImage.title}</p>
                  <p className="text-xs text-white/80 mt-1 max-w-sm">{currentCategory.tagline}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right: Menu Items with Dotted Leaders (7 cols) */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {items.map((item) => (
                  <div key={item.id} className="group">
                    <div className="flex items-baseline justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="font-serif text-xl sm:text-2xl text-[#2F3E2C] group-hover:text-[#4F6B47] transition-colors">
                          {item.name}
                        </span>
                        {item.dietary && (
                          <div className="flex items-center gap-1">
                            {item.dietary.map((d) => (
                              <span
                                key={d}
                                className="text-[10px] font-mono font-medium text-stone-500 uppercase"
                              >
                                {d}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Dotted Leader */}
                      <span className="flex-1 border-b border-dotted border-stone-300 mx-2 mb-1" />

                      <span className="font-serif text-lg font-medium text-[#2F3E2C] shrink-0 tabular-nums">
                        {item.formattedPrice}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-stone-600 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Seasonal Note & Menu Link */}
            <div className="mt-10 pt-6 border-t border-[#2F3E2C]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-stone-500">
              <p className="italic">{MENU_SEASONAL_NOTE}</p>
              <Link
                to="/menu"
                className="inline-flex items-center gap-1 font-semibold text-[#4F6B47] hover:text-[#2F3E2C] uppercase tracking-wider"
              >
                <span>View Full Menu</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
