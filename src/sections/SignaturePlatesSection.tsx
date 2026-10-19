import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { SmartImage } from '../components/SmartImage';
import { IMAGES } from '../data/images';
import { ChevronRight, Plus, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { PRODUCTS, Product } from '../data/products';

interface DishCard {
  productId: string;
  name: string;
  desc: string;
  price: string;
  image: string;
  alt: string;
  fallbackKey: string;
}

export const SignaturePlatesSection: React.FC = () => {
  const targetRef = useRef<HTMLDivElement>(null);
  const { handleAddToCartWithModifiers } = useCart();

  const dishes: DishCard[] = [
    {
      productId: 'pulled-meat-slaw',
      name: 'Braised Pulled Meat & Red Slaw',
      desc: 'Slow-cooked braised meat with crunchy pickled red cabbage slaw on griddled sourdough.',
      price: '£11.00',
      image: IMAGES.slawSandwich.src,
      alt: IMAGES.slawSandwich.alt,
      fallbackKey: 'morning-roll',
    },
    {
      productId: 'ham-cheese-mustard',
      name: 'Ham, Gruyère & Mustard Toastie',
      desc: 'Carved ham, molten mature cheese pull & coarse wholegrain mustard on thick sourdough.',
      price: '£9.50',
      image: IMAGES.hamSandwich.src,
      alt: IMAGES.hamSandwich.alt,
      fallbackKey: 'morning-roll',
    },
    {
      productId: 'stacked-pancakes',
      name: 'Stacked Pancakes & Salted Caramel',
      desc: 'Towering fluffy buttermilk stack topped with dark chocolate crumb, caramel & whipped cream.',
      price: '£10.50',
      image: IMAGES.pancakes.src,
      alt: IMAGES.pancakes.alt,
      fallbackKey: 'pancakes',
    },
    {
      productId: 'poached-eggs-crumb',
      name: 'Poached Eggs with Savoury Crumb',
      desc: 'Soft-poached free range eggs blanketed in golden herb-garlic crumb on grilled sourdough.',
      price: '£9.00',
      image: IMAGES.eggsCrumb.src,
      alt: IMAGES.eggsCrumb.alt,
      fallbackKey: 'eggs-crumb',
    },
    {
      productId: 'street-pulled-pork',
      name: 'Duke Street Pulled Pork Melt',
      desc: 'Juicy barbecue shredded pork, dill gherkins and melted Scottish cheese grilled crisp.',
      price: '£10.50',
      image: IMAGES.streetSandwich.src,
      alt: IMAGES.streetSandwich.alt,
      fallbackKey: 'morning-roll',
    },
    {
      productId: 'french-toast-peaches',
      name: 'French Toast & Roasted Peaches',
      desc: 'Custard brioche, caramelized peach wedges, wild berries, mascarpone & pure maple.',
      price: '£11.00',
      image: IMAGES.peaches.src,
      alt: IMAGES.peaches.alt,
      fallbackKey: 'pancakes',
    },
  ];

  const handleAddDish = (productId: string) => {
    const matched = PRODUCTS.find((p) => p.id === productId);
    if (matched) {
      handleAddToCartWithModifiers(matched);
    }
  };

  // Desktop horizontal scroll driven by section scroll
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ['1%', '-55%']);

  return (
    <section
      id="plates"
      ref={targetRef}
      className="relative bg-[#F6F1E7] py-20 lg:py-0 lg:h-[300vh] scroll-mt-24"
    >
      {/* Desktop Sticky Container */}
      <div className="lg:sticky lg:top-0 lg:h-screen lg:flex lg:flex-col lg:justify-center overflow-hidden">
        {/* Section Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mb-8 lg:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-[#4F6B47] font-semibold mb-3">
                <span>02</span>
                <span className="w-8 h-[1px] bg-[#4F6B47]/40" />
                <span>Signature Plates</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#2F3E2C] tracking-tight">
                Crafted for comfort,{' '}
                <span className="italic font-serif text-[#C9774F]">
                  served generous
                </span>
                .
              </h2>
            </div>

            <Link
              to="/menu"
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#4F6B47] hover:text-[#2F3E2C] transition-colors group cursor-pointer"
            >
              <span>Explore full menu</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Desktop Horizontal Scroll Track */}
        <div className="hidden lg:block w-full">
          <motion.div style={{ x }} className="flex gap-8 pl-8 lg:pl-16">
            {dishes.map((dish) => (
              <motion.div
                key={dish.productId}
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="w-[360px] shrink-0 bg-[#FBF8F2] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-[#2F3E2C]/10 transition-shadow p-3.5 group flex flex-col justify-between"
              >
                <div>
                  <div className="relative rounded-xl overflow-hidden aspect-[4/3] mb-4 bg-[#EAEFE6]">
                    <SmartImage
                      src={dish.image}
                      alt={dish.alt}
                      fallbackKey={dish.fallbackKey}
                      aspectRatio="aspect-[4/3]"
                      className="w-full h-full"
                      imgClassName="group-hover:scale-108 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-[#2F3E2C]/85 backdrop-blur-xs text-xs font-semibold text-[#FBF8F2] shadow-sm">
                      {dish.price}
                    </div>
                  </div>

                  <div className="px-2 pb-2">
                    <h3 className="font-serif italic text-2xl text-[#2F3E2C] mb-1.5 leading-snug">
                      {dish.name}
                    </h3>
                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {dish.desc}
                    </p>
                  </div>
                </div>

                {/* Add to Cart button */}
                <div className="px-2 pt-2 border-t border-[#2F3E2C]/8 mt-2 flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#4F6B47] uppercase tracking-wider">
                    Click &amp; Collect
                  </span>
                  <button
                    onClick={() => handleAddDish(dish.productId)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#2F3E2C] hover:bg-[#4F6B47] text-[#FBF8F2] text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Mobile Swipeable Carousel */}
        <div className="lg:hidden px-4 sm:px-6">
          <div className="flex gap-4 overflow-x-auto pb-6 snap-x snap-mandatory no-scrollbar">
            {dishes.map((dish) => (
              <div
                key={dish.productId}
                className="w-[280px] sm:w-[320px] shrink-0 snap-start bg-[#FBF8F2] rounded-2xl overflow-hidden shadow-sm border border-[#2F3E2C]/10 p-3 flex flex-col justify-between"
              >
                <div>
                  <div className="relative rounded-xl overflow-hidden aspect-[4/3] mb-3 bg-[#EAEFE6]">
                    <SmartImage
                      src={dish.image}
                      alt={dish.alt}
                      fallbackKey={dish.fallbackKey}
                      aspectRatio="aspect-[4/3]"
                      className="w-full h-full"
                    />
                    <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-[#2F3E2C]/85 backdrop-blur-xs text-xs font-semibold text-[#FBF8F2]">
                      {dish.price}
                    </div>
                  </div>

                  <div className="px-1.5 pb-1">
                    <h3 className="font-serif italic text-xl text-[#2F3E2C] mb-1">
                      {dish.name}
                    </h3>
                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {dish.desc}
                    </p>
                  </div>
                </div>

                <div className="px-1.5 pt-2 border-t border-[#2F3E2C]/8 mt-2 flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#4F6B47] uppercase tracking-wider">
                    {dish.price}
                  </span>
                  <button
                    onClick={() => handleAddDish(dish.productId)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#2F3E2C] hover:bg-[#4F6B47] text-[#FBF8F2] text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-stone-400 text-center uppercase tracking-widest mt-1">
            Swipe to see all dishes →
          </p>
        </div>
      </div>
    </section>
  );
};
