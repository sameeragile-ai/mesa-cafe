import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, ArrowRight, Flame } from 'lucide-react';
import { SmartImage } from '../components/SmartImage';
import { IMAGES } from '../data/images';
import { BUSINESS_INFO } from '../data/business';

interface MorningRollFeatureProps {
  onOpenBooking: () => void;
}

export const MorningRollFeature: React.FC<MorningRollFeatureProps> = ({ onOpenBooking }) => {
  return (
    <section
      id="morning-roll"
      className="relative py-24 sm:py-32 overflow-hidden bg-gradient-to-br from-[#F4C9A8]/40 via-[#FBF8F2] to-[#DCE5D3]/40 border-y border-[#2F3E2C]/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Food Photo Spotlight (6 cols) */}
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/80 bg-[#EAEFE6]"
            >
              <SmartImage
                src={IMAGES.morningRoll.src}
                alt={IMAGES.morningRoll.alt}
                aspectRatio="aspect-[4/3] sm:aspect-[16/11]"
                objectPosition="center 30%"
                className="w-full h-full"
                imgClassName="hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2F3E2C]/85 backdrop-blur-xs text-xs font-semibold text-[#FBF8F2] shadow-sm">
                <Flame className="w-3.5 h-3.5 text-[#F4C9A8]" />
                <span>The Dennistoun Icon</span>
              </div>
              <div className="absolute bottom-4 right-4 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-xs text-xs font-semibold text-[#2F3E2C] shadow-md">
                £5.50
              </div>
            </motion.div>
          </div>

          {/* Right Column: Narrative & Instagram link (6 cols) */}
          <div className="lg:col-span-6">
            <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-[#4F6B47] font-semibold mb-4">
              <span>03</span>
              <span className="w-8 h-[1px] bg-[#4F6B47]/40" />
              <span>Feature Spotlight</span>
            </div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#2F3E2C] leading-[1.08] tracking-tight mb-6"
            >
              The Morning Roll.{' '}
              <span className="italic font-serif text-[#C9774F]">
                Part six and counting.
              </span>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ delay: 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-4 text-stone-700 text-base sm:text-lg leading-relaxed font-normal mb-8"
            >
              <p>
                In Glasgow, the morning roll isn’t just breakfast — it’s an East End institution. We treat it with the obsessive culinary care it deserves.
              </p>
              <p>
                Square Scottish Lorne sausage griddled until deeply caramelized, a fried runny-yolk egg, melted cheddar, and our signature tangy house brown sauce, all nestled in a fresh crusty morning roll delivered early every dawn.
              </p>
              <p className="text-sm text-stone-600">
                Follow our ongoing Instagram video series tracking the evolution of Glasgow’s greatest morning rolls, from Part 1 to our current Part 6 creations.
              </p>
            </motion.div>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href={BUSINESS_INFO.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#2F3E2C] text-[#FBF8F2] text-xs font-semibold tracking-wider uppercase hover:bg-[#4F6B47] transition-all shadow-md group cursor-pointer"
              >
                <Instagram className="w-4 h-4 text-[#F4C9A8]" />
                <span>Watch the series on Instagram</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </a>

              <button
                onClick={onOpenBooking}
                className="px-6 py-3 rounded-full bg-white/80 hover:bg-white border border-[#2F3E2C]/15 text-[#2F3E2C] text-xs font-semibold tracking-wider uppercase transition-all shadow-sm cursor-pointer"
              >
                Save a Table
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
