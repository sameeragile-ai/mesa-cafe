import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ShoppingBag,
  Plus,
  Minus,
  ArrowRight,
  Clock,
  Sparkles,
  SlidersHorizontal,
} from 'lucide-react';
import { PageTransition } from '../components/PageTransition';
import { SmartImage } from '../components/SmartImage';
import { PRODUCTS, PRODUCT_CATEGORIES, Product } from '../data/products';
import { useCart, formatCurrency } from '../context/CartContext';
import { getLiveStatus } from '../lib/hours';

export const OrderPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDietary, setSelectedDietary] = useState<'ALL' | 'V' | 'VG' | 'GF'>('ALL');
  const {
    items,
    totalItemsCount,
    subtotalFormatted,
    openCartDrawer,
    handleAddToCartWithModifiers,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();
  const navigate = useNavigate();
  const liveStatus = getLiveStatus();

  useEffect(() => {
    document.title = 'Order Online (Click & Collect) – MESA Glasgow | Duke Street';
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const filteredProducts = PRODUCTS.filter((product) => {
    // Category match
    if (selectedCategory !== 'all' && product.category !== selectedCategory) {
      return false;
    }

    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const nameMatch = product.name.toLowerCase().includes(q);
      const descMatch = product.description.toLowerCase().includes(q);
      if (!nameMatch && !descMatch) return false;
    }

    // Dietary match
    if (selectedDietary !== 'ALL') {
      if (!product.dietary?.includes(selectedDietary)) return false;
    }

    return true;
  });

  // Helper to find existing cart item for simple products (without modifiers)
  const getProductCartItem = (product: Product) => {
    return items.find((item) => item.product.id === product.id);
  };

  return (
    <PageTransition>
      <div className="pt-28 sm:pt-36 pb-28 bg-[#FBF8F2] min-h-screen">
        {/* Order Page Hero */}
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#2F3E2C]/10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DCE5D3] text-xs font-semibold uppercase tracking-widest text-[#2F3E2C] mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#4F6B47]" />
                <span>Click &amp; Collect · 567 Duke Street</span>
              </div>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#2F3E2C] tracking-tight leading-tight">
                Order for{' '}
                <span className="italic font-serif text-[#C9774F]">
                  collection
                </span>
                .
              </h1>
              <p className="text-stone-600 text-sm sm:text-base mt-2 max-w-xl">
                Freshly prepared brunch, loaded morning rolls, and specialty coffee ready to collect from our Duke Street hatch in 15–20 minutes.
              </p>
            </div>

            {/* Live Collection Schedule Status */}
            <div className="p-4 rounded-2xl bg-[#F6F1E7] border border-[#2F3E2C]/10 flex items-center gap-3 shrink-0">
              <Clock className="w-5 h-5 text-[#4F6B47]" />
              <div className="text-xs">
                <span className="font-semibold text-[#2F3E2C] block">
                  {liveStatus.isOpen ? 'Accepting Orders ASAP' : 'Kitchen Currently Closed'}
                </span>
                <span className="text-stone-500">
                  {liveStatus.isOpen
                    ? 'Ready in ~15–20 minutes'
                    : 'Pre-order available for tomorrow'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Controls: Categories, Search, Dietary Filters */}
        <div className="sticky top-[68px] z-30 bg-[#FBF8F2]/95 backdrop-blur-md border-b border-[#2F3E2C]/10 py-3 shadow-xs mb-10">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
            {/* Top row: Categories + Search Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* Category selector */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                {PRODUCT_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer ${
                      selectedCategory === cat.id
                        ? 'bg-[#2F3E2C] text-[#FBF8F2] shadow-sm'
                        : 'bg-white/80 text-stone-600 hover:text-[#2F3E2C] hover:bg-[#DCE5D3]/40 border border-[#2F3E2C]/10'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Search input */}
              <div className="relative min-w-[240px] md:w-72">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search rolls, pancakes, beans..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-full bg-white border border-[#2F3E2C]/15 focus:border-[#4F6B47] focus:ring-1 focus:ring-[#4F6B47] outline-none text-[#2F3E2C]"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Bottom row: Dietary filter chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
              <span className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold mr-1">
                Dietary:
              </span>
              {[
                { id: 'ALL', label: 'All Items' },
                { id: 'V', label: 'Vegetarian' },
                { id: 'VG', label: 'Vegan Options' },
                { id: 'GF', label: 'Gluten-Free' },
              ].map((filter) => {
                const isSelected = selectedDietary === filter.id;
                return (
                  <button
                    key={filter.id}
                    onClick={() => setSelectedDietary(filter.id as any)}
                    className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer whitespace-nowrap border ${
                      isSelected
                        ? 'bg-[#4F6B47] text-white border-[#4F6B47] shadow-xs'
                        : 'bg-white/70 text-stone-600 border-[#2F3E2C]/10 hover:border-[#4F6B47]'
                    }`}
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content Layout: Grid (8 cols) + Sticky Order Sidebar (4 cols on desktop) */}
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Products Grid (8 cols) */}
            <div className="lg:col-span-8">
              {filteredProducts.length === 0 ? (
                <div className="p-12 text-center bg-[#F6F1E7] rounded-3xl border border-stone-200 text-stone-600 space-y-3">
                  <p className="font-serif italic text-2xl text-[#2F3E2C]">
                    No items found matching your filters.
                  </p>
                  <p className="text-xs text-stone-500">
                    Try clearing your search query or selecting &ldquo;All Items&rdquo;.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                      setSelectedDietary('ALL');
                    }}
                    className="px-5 py-2 rounded-full bg-[#2F3E2C] text-[#FBF8F2] text-xs font-semibold uppercase tracking-wider hover:bg-[#4F6B47] transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  {filteredProducts.map((product) => {
                    const existingItem = getProductCartItem(product);
                    const hasModifiers =
                      product.modifierGroups && product.modifierGroups.length > 0;

                    return (
                      <motion.div
                        key={product.id}
                        layout
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl border border-[#2F3E2C]/10 p-4 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                      >
                        <div>
                          {/* Image or Designed Sage Gradient Tile for retail */}
                          <div className="relative rounded-xl overflow-hidden aspect-[4/3] mb-3.5 bg-[#EAEFE6] border border-[#2F3E2C]/5">
                            {product.image ? (
                              <SmartImage
                                src={product.image}
                                alt={product.alt || product.name}
                                aspectRatio="aspect-[4/3]"
                                className="w-full h-full"
                              />
                            ) : (
                              /* Designed sage-gradient product tile with MESA logo */
                              <div className="w-full h-full bg-gradient-to-br from-[#4F6B47] to-[#2F3E2C] p-4 flex flex-col items-center justify-center text-center text-[#FBF8F2]">
                                <img
                                  src="/images/mesa-logo.png"
                                  alt="MESA logo"
                                  className="w-12 h-12 rounded-full object-cover mb-2 shadow-md border border-white/20"
                                />
                                <span className="font-serif italic text-lg leading-tight">
                                  {product.name}
                                </span>
                                <span className="text-[10px] uppercase tracking-widest text-[#DCE5D3]/80 mt-1">
                                  MESA at Home · Retail
                                </span>
                              </div>
                            )}

                            {/* Badges */}
                            <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                              {product.isPopular && (
                                <span className="px-2 py-0.5 rounded-full bg-[#2F3E2C]/85 backdrop-blur-xs text-[10px] font-semibold text-[#FBF8F2] shadow-xs">
                                  Popular
                                </span>
                              )}
                              {product.isRetail && (
                                <span className="px-2 py-0.5 rounded-full bg-[#4F6B47]/90 backdrop-blur-xs text-[10px] font-semibold text-white shadow-xs">
                                  Retail
                                </span>
                              )}
                            </div>

                            <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur-xs text-xs font-semibold text-[#2F3E2C] shadow-xs">
                              {formatCurrency(product.price)}
                            </div>
                          </div>

                          {/* Info */}
                          <div className="space-y-1 mb-4">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="font-serif text-xl text-[#2F3E2C] leading-snug">
                                {product.name}
                              </h3>
                              {product.dietary && (
                                <div className="flex items-center gap-1 shrink-0 mt-0.5">
                                  {product.dietary.map((d) => (
                                    <span
                                      key={d}
                                      className="text-[9px] font-mono font-bold text-[#4F6B47] uppercase bg-[#EAEFE6] px-1 py-0.2 rounded"
                                    >
                                      {d}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>

                            <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                              {product.description}
                            </p>
                          </div>
                        </div>

                        {/* Card Footer: Add Button or Stepper if already in cart */}
                        <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                          <span className="font-serif text-base font-semibold text-[#2F3E2C] tabular-nums">
                            {formatCurrency(product.price)}
                          </span>

                          {/* If in cart and has no modifiers, show Stepper. If has modifiers, show Customise button */}
                          {existingItem && !hasModifiers ? (
                            <div className="flex items-center gap-2 bg-[#F6F1E7] border border-[#2F3E2C]/15 rounded-full p-1">
                              <button
                                onClick={() => decreaseQuantity(existingItem.id)}
                                aria-label="Decrease quantity"
                                className="w-6 h-6 rounded-full bg-white text-[#2F3E2C] flex items-center justify-center hover:bg-stone-100 transition-colors cursor-pointer"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-5 text-center text-xs font-semibold tabular-nums text-[#2F3E2C]">
                                {existingItem.quantity}
                              </span>
                              <button
                                onClick={() => increaseQuantity(existingItem.id)}
                                aria-label="Increase quantity"
                                className="w-6 h-6 rounded-full bg-white text-[#2F3E2C] flex items-center justify-center hover:bg-stone-100 transition-colors cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleAddToCartWithModifiers(product)}
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#2F3E2C] hover:bg-[#4F6B47] text-[#FBF8F2] text-xs font-semibold uppercase tracking-wider transition-all shadow-xs cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>{hasModifiers ? 'Customise' : 'Add to Cart'}</span>
                            </button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Desktop Sticky Order Summary Sidebar (4 cols) */}
            <div className="hidden lg:block lg:col-span-4 sticky top-36">
              <div className="rounded-3xl bg-[#F6F1E7] border border-[#2F3E2C]/10 p-6 shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#2F3E2C]/10">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-[#4F6B47]" />
                    <h3 className="font-serif italic text-2xl text-[#2F3E2C]">
                      Order Summary
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-[#DCE5D3] text-[#2F3E2C]">
                    {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'}
                  </span>
                </div>

                {items.length === 0 ? (
                  <div className="py-8 text-center text-stone-500 text-xs space-y-2">
                    <p className="font-serif italic text-lg text-[#2F3E2C]">
                      Your basket is empty.
                    </p>
                    <p>Select your favorite dishes or retail items to collect.</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start justify-between gap-3 text-xs text-[#2F3E2C]"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-mono font-semibold text-stone-500 shrink-0">
                            {item.quantity}×
                          </span>
                          <span className="font-medium truncate">
                            {item.product.name}
                          </span>
                        </div>
                        <span className="font-serif font-semibold shrink-0 tabular-nums">
                          {formatCurrency(item.totalPrice)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Subtotal & Checkout Action */}
                <div className="pt-4 border-t border-[#2F3E2C]/10 space-y-4">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs uppercase tracking-wider text-stone-600 font-medium">
                      Estimated Subtotal
                    </span>
                    <span className="font-serif text-3xl font-semibold text-[#2F3E2C] tabular-nums">
                      {subtotalFormatted}
                    </span>
                  </div>

                  <p className="text-[11px] text-stone-500">
                    Collection from 567 Duke St, Dennistoun. Ready in approximately 15–20 minutes.
                  </p>

                  <button
                    onClick={() => navigate('/checkout')}
                    disabled={items.length === 0}
                    className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#4F6B47] to-[#2F3E2C] text-[#FBF8F2] text-xs font-semibold tracking-wider uppercase hover:from-[#2F3E2C] hover:to-[#4F6B47] transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {items.length > 0 && (
                    <button
                      onClick={openCartDrawer}
                      className="w-full py-2 text-center text-xs font-semibold text-stone-600 hover:text-[#2F3E2C] transition-colors cursor-pointer"
                    >
                      View &amp; Edit Order Details
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Sticky Bottom Bar (Shows when items > 0) */}
        {totalItemsCount > 0 && (
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#2F3E2C] text-[#FBF8F2] p-4 shadow-2xl border-t border-white/10">
            <div className="flex items-center justify-between gap-3">
              <div>
                <span className="text-[11px] text-[#DCE5D3] uppercase tracking-wider block">
                  Click &amp; Collect
                </span>
                <span className="text-sm font-semibold">
                  {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'} · {subtotalFormatted}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={openCartDrawer}
                  className="px-4 py-2.5 rounded-full bg-white/15 text-[#FBF8F2] text-xs font-semibold uppercase tracking-wider hover:bg-white/25 transition-colors cursor-pointer"
                >
                  View Cart
                </button>
                <button
                  onClick={() => navigate('/checkout')}
                  className="px-5 py-2.5 rounded-full bg-[#4F6B47] text-white text-xs font-semibold uppercase tracking-wider hover:bg-white hover:text-[#2F3E2C] transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
};
