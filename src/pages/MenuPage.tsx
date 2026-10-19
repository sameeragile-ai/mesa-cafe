import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Calendar, Coffee } from 'lucide-react';
import { PageTransition } from '../components/PageTransition';
import { SmartImage } from '../components/SmartImage';
import { IMAGES } from '../data/images';
import { MENU_CATEGORIES, MENU_ITEMS, MENU_SEASONAL_NOTE } from '../data/menu';

interface MenuPageProps {
  onOpenBooking: () => void;
}

export const MenuPage: React.FC<MenuPageProps> = ({ onOpenBooking }) => {
  const [selectedDietary, setSelectedDietary] = useState<'ALL' | 'V' | 'VG' | 'GF'>('ALL');
  const [activeCategory, setActiveCategory] = useState<string>('breakfast');

  useEffect(() => {
    document.title = 'Menu & Specialty Coffee – MESA Glasgow | Duke Street';
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const filteredItems = (category: string) => {
    return MENU_ITEMS.filter((item) => {
      if (item.category !== category) return false;
      if (selectedDietary === 'ALL') return true;
      return item.dietary?.includes(selectedDietary);
    });
  };

  const scrollToCategory = (catId: string) => {
    setActiveCategory(catId);
    const el = document.getElementById(`cat-${catId}`);
    if (el) {
      const navOffset = 140;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <PageTransition>
      <div className="pt-28 sm:pt-36 pb-24 bg-[#FBF8F2] min-h-screen">
        {/* Page Hero with pancakes.jpg */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="relative rounded-3xl overflow-hidden bg-[#2F3E2C] text-[#FBF8F2] min-h-[340px] sm:min-h-[420px] flex items-center shadow-xl">
            {/* Background Image: pancakes.jpg */}
            <div className="absolute inset-0 z-0">
              <img
                src={IMAGES.pancakes.src}
                alt="Stacked pancakes at MESA"
                className="w-full h-full object-cover object-center filter brightness-[0.45] saturate-[1.1] scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#2F3E2C]/90 via-[#2F3E2C]/75 to-transparent" />
            </div>

            <div className="relative z-10 max-w-2xl p-8 sm:p-12 lg:p-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-xs font-semibold uppercase tracking-widest text-[#DCE5D3] border border-white/10 mb-4">
                <Coffee className="w-3.5 h-3.5 text-[#F4C9A8]" />
                <span>Duke Street Kitchen &amp; Espresso</span>
              </div>

              <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl leading-tight tracking-tight mb-4">
                The <span className="italic font-serif text-[#F4C9A8]">menu</span>.
              </h1>

              <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-xl">
                Hearty breakfast rolls, vibrant sourdough toasts, cast-iron baked eggs, and specialty coffee. Everything made with care, generous portions, and East End prices.
              </p>
            </div>
          </div>
        </div>

        {/* Sticky Filter & Category Navigation Bar */}
        <div className="sticky top-[64px] sm:top-[74px] z-30 bg-[#FBF8F2]/90 backdrop-blur-md border-y border-[#2F3E2C]/10 py-3 shadow-xs mb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Category Nav Links */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
              {MENU_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => scrollToCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer ${
                    activeCategory === cat.id
                      ? 'bg-[#2F3E2C] text-[#FBF8F2] shadow-sm'
                      : 'text-stone-600 hover:text-[#2F3E2C] hover:bg-[#DCE5D3]/40'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Dietary Filter Segmented Control */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              <span className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold mr-1">
                Filter:
              </span>
              {[
                { id: 'ALL', label: 'All Dishes' },
                { id: 'V', label: 'Vegetarian' },
                { id: 'VG', label: 'Vegan Options' },
                { id: 'GF', label: 'Gluten-Free' },
              ].map((filter) => {
                const isSelected = selectedDietary === filter.id;
                return (
                  <button
                    key={filter.id}
                    onClick={() => setSelectedDietary(filter.id as any)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap border ${
                      isSelected
                        ? 'bg-[#4F6B47] text-white border-[#4F6B47] shadow-xs'
                        : 'bg-white/80 text-stone-600 border-[#2F3E2C]/10 hover:border-[#4F6B47]'
                    }`}
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Categories & Items Listing */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          {MENU_CATEGORIES.map((category) => {
            const items = filteredItems(category.id);
            const categoryHero = IMAGES[category.imageKey];

            return (
              <div
                key={category.id}
                id={`cat-${category.id}`}
                className="scroll-mt-40 pt-4 border-b border-[#2F3E2C]/10 pb-16 last:border-b-0"
              >
                {/* Category Header */}
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-8">
                  <div>
                    <h2 className="font-serif italic text-3xl sm:text-4xl text-[#2F3E2C]">
                      {category.name}
                    </h2>
                    <p className="text-xs sm:text-sm text-stone-600 mt-1">
                      {category.tagline}
                    </p>
                  </div>
                  <span className="text-xs font-mono text-stone-400">
                    {items.length} {items.length === 1 ? 'item' : 'items'}
                  </span>
                </div>

                {/* Items Grid with Category Feature Image Banner */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                  {/* Category Image Card */}
                  {categoryHero && (
                    <div className="lg:col-span-4 rounded-2xl overflow-hidden shadow-sm border border-[#2F3E2C]/10 bg-[#EAEFE6] hidden lg:block sticky top-36">
                      <SmartImage
                        src={categoryHero.src}
                        alt={categoryHero.alt}
                        aspectRatio="aspect-[4/3]"
                        className="w-full h-auto"
                      />
                      <div className="p-4 bg-[#F6F1E7] text-xs text-[#2F3E2C]">
                        <p className="font-serif italic text-base font-medium">
                          {categoryHero.title}
                        </p>
                        <p className="text-stone-500 text-[11px] mt-0.5">
                          Freshly prepared on Duke Street
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Items List */}
                  <div
                    className={
                      categoryHero ? 'lg:col-span-8 space-y-6' : 'lg:col-span-12 space-y-6'
                    }
                  >
                    {items.length === 0 ? (
                      <div className="p-8 text-center bg-[#F6F1E7] rounded-2xl border border-stone-200 text-stone-500 text-sm">
                        No dishes match this dietary filter in {category.name}. Check our other categories or ask our staff for bespoke accommodations!
                      </div>
                    ) : (
                      items.map((item) => (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="p-5 rounded-2xl bg-[#F6F1E7] hover:bg-white border border-[#2F3E2C]/8 hover:border-[#4F6B47]/30 transition-all shadow-xs group"
                        >
                          <div className="flex items-baseline justify-between gap-4">
                            <div className="flex items-center gap-2.5 flex-wrap">
                              <h3 className="font-serif text-xl sm:text-2xl text-[#2F3E2C] group-hover:text-[#4F6B47] transition-colors">
                                {item.name}
                              </h3>
                              {item.isHero && (
                                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#DCE5D3] text-[#2F3E2C]">
                                  East End Hero
                                </span>
                              )}
                              {item.dietary?.map((d) => (
                                <span
                                  key={d}
                                  className="text-[10px] font-mono font-bold text-[#4F6B47] uppercase bg-white px-1.5 py-0.5 rounded border border-[#4F6B47]/20"
                                >
                                  {d}
                                </span>
                              ))}
                            </div>

                            <span className="font-serif text-lg font-medium text-[#2F3E2C] tabular-nums shrink-0">
                              {item.formattedPrice}
                            </span>
                          </div>

                          <p className="text-xs sm:text-sm text-stone-600 mt-1.5 leading-relaxed">
                            {item.description}
                          </p>

                          {item.dietaryNotes && (
                            <p className="text-[11px] text-[#4F6B47] italic mt-1">
                              * {item.dietaryNotes}
                            </p>
                          )}
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Seasonal Note & Booking CTA at end of menu */}
          <div className="rounded-3xl bg-gradient-to-tr from-[#DCE5D3]/60 via-[#FBF8F2] to-[#F4C9A8]/40 border border-[#2F3E2C]/10 p-8 sm:p-12 text-center my-12">
            <p className="font-serif italic text-2xl text-[#2F3E2C] mb-2">
              &ldquo;{MENU_SEASONAL_NOTE}&rdquo;
            </p>
            <p className="text-xs text-stone-600 max-w-md mx-auto mb-6">
              Everything is cooked fresh to order. If you have severe allergies or special dietary requirements, please let our team know when ordering.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={onOpenBooking}
                className="px-8 py-3.5 rounded-full bg-[#2F3E2C] text-[#FBF8F2] text-xs font-semibold tracking-wider uppercase hover:bg-[#4F6B47] transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-[#F4C9A8]" />
                <span>Book a Table</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
