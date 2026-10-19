import React from 'react';
import { motion } from 'framer-motion';
import { SmartImage } from '../components/SmartImage';
import { LogoLines } from '../components/LogoLines';
import { IMAGES } from '../data/images';
import { BUSINESS_INFO } from '../data/business';

export const StorySection: React.FC = () => {
  return (
    <section id="story" className="relative py-24 sm:py-32 overflow-hidden bg-[#FBF8F2]">
      {/* Decorative <LogoLines /> watermark behind: 40vw, stroke in sage-500 at 6% opacity */}
      <div
        className="absolute -right-20 top-1/2 -translate-y-1/2 w-[40vw] max-w-[500px] pointer-events-none select-none text-[#5F7F56] opacity-[0.06]"
        aria-hidden="true"
      >
        <LogoLines className="w-full h-auto" strokeWidth={1.8} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Founders Photo with 72px Logo Stamp + Rotating Circular Text Badge (5 cols) */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative rounded-2xl overflow-hidden shadow-xl border border-[#2F3E2C]/10 bg-[#EAEFE6]"
            >
              <SmartImage
                src={IMAGES.founders.src}
                alt={IMAGES.founders.alt}
                aspectRatio="aspect-[3/4]"
                objectPosition="center 15%"
                className="w-full h-auto"
                imgClassName="hover:scale-103 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 text-white text-xs">
                <p className="font-medium tracking-wide">The two friends behind MESA</p>
                <p className="text-white/70 text-[11px]">Outside 567 Duke Street, Dennistoun</p>
              </div>
            </motion.div>

            {/* Logo Stamp (72px) + Rotating circular text badge on corner */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="absolute -bottom-6 -right-6 sm:-right-8 w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center pointer-events-none"
            >
              {/* Rotating Circular SVG Text */}
              <svg
                viewBox="0 0 120 120"
                className="w-full h-full spin-slow text-[#2F3E2C]"
                aria-hidden="true"
              >
                <path
                  id="stampCirclePath"
                  d="M 60, 60 m -46, 0 a 46,46 0 1,1 92,0 a 46,46 0 1,1 -92,0"
                  fill="none"
                />
                <text className="text-[9.5px] uppercase font-bold tracking-[0.24em] fill-[#2F3E2C]">
                  <textPath href="#stampCirclePath">
                    • DUKE STREET • GLASGOW EAST END • MESA •
                  </textPath>
                </text>
              </svg>

              {/* 72px Logo Stamp inside badge */}
              <div className="absolute w-[68px] h-[68px] sm:w-[72px] sm:h-[72px] rounded-full overflow-hidden shadow-[0_8px_24px_rgba(47,62,44,0.25)] border-2 border-[#FBF8F2] bg-[#FBF8F2]">
                <img
                  src="/images/mesa-logo.png"
                  alt="MESA stamp logo"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </motion.div>
          </div>

          {/* Right Column: Editorial Copy + Count-Up Stats (7 cols) */}
          <div className="lg:col-span-7">
            {/* Section label */}
            <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-[#4F6B47] font-semibold mb-4">
              <span>01</span>
              <span className="w-8 h-[1px] bg-[#4F6B47]/40" />
              <span>Our Story</span>
            </div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="font-serif text-4xl sm:text-5xl lg:text-[54px] leading-[1.08] text-[#2F3E2C] tracking-tight mb-6"
            >
              Built on friendship, sourdough, and a love for the{' '}
              <span className="italic font-serif text-[#C9774F]">East End</span>.
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ delay: 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-4 text-stone-700 text-base sm:text-lg leading-relaxed font-normal mb-10"
            >
              <p>
                MESA was started by two friends who set out on Duke Street to create the kind of café they wanted to spend their own mornings in. No gimmicks, no rushed tables, just generous, honest plates served with real warmth.
              </p>
              <p>
                From soft morning rolls stuffed with Scottish square Lorne sausage to rich skillet baked eggs, whipped ricotta on sourdough, and stacks of salted caramel pancakes, everything is made from scratch with local ingredients and priced fairly for our neighbours.
              </p>
              <p className="font-serif italic text-xl text-[#2F3E2C]">
                &ldquo;Fantastic food, great coffee, quick service, east end prices.&rdquo;
              </p>
            </motion.div>

            {/* Three Proof Stats on scroll */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-[#2F3E2C]/10">
              <div>
                <span className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#2F3E2C] block font-medium">
                  4.8★
                </span>
                <span className="text-xs uppercase tracking-wider text-stone-500 font-medium mt-1 block">
                  Google rating
                </span>
              </div>

              <div>
                <span className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#2F3E2C] block font-medium">
                  520+
                </span>
                <span className="text-xs uppercase tracking-wider text-stone-500 font-medium mt-1 block">
                  Local reviews
                </span>
              </div>

              <div>
                <span className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#2F3E2C] block font-medium">
                  21K+
                </span>
                <span className="text-xs uppercase tracking-wider text-stone-500 font-medium mt-1 block">
                  On Instagram
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
