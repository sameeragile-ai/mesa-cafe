import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, Phone, Sparkles } from 'lucide-react';
import { BUSINESS_INFO } from '../data/business';
import { IMAGES } from '../data/images';
import { getLiveStatus } from '../lib/hours';
import { SmartImage } from '../components/SmartImage';

interface HeroSectionProps {
  onOpenBooking: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenBooking }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const liveStatus = getLiveStatus();

  // Subtle parallax effect on scroll
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });
  const yParallaxArch = useTransform(scrollYProgress, [0, 1], ['0%', '14%']);
  const yParallaxCircle = useTransform(scrollYProgress, [0, 1], ['0%', '-18%']);

  // Word-by-word reveal variants
  const headlineWords = ['Proper', 'breakfasts', 'on', 'Duke', 'Street.'];

  return (
    <section
      ref={containerRef}
      className="relative min-h-[92vh] sm:min-h-screen pt-28 sm:pt-36 pb-16 flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#FBF8F2] via-[#F6F1E7] to-[#F6F1E7]"
    >
      {/* Ambient drifting soft mesh gradient blob */}
      <div
        className="ambient-blob absolute top-10 right-[-10%] w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-[#DCE5D3]/50 via-[#F4C9A8]/30 to-[#F6F1E7] blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="ambient-blob absolute bottom-10 left-[-10%] w-[450px] h-[450px] rounded-full bg-gradient-to-br from-[#DCE5D3]/40 via-[#FBF8F2] to-[#F4C9A8]/20 blur-3xl pointer-events-none"
        style={{ animationDelay: '-10s' }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Headline & Actions (7 cols) */}
          <div className="lg:col-span-7 z-10">
            {/* Live Status Pill + Trust Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-wrap items-center gap-3 mb-6"
            >
              {/* Real-time status pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#2F3E2C]/10 text-xs font-medium text-[#2F3E2C] shadow-sm backdrop-blur-sm">
                <span
                  className={`w-2 h-2 rounded-full ${
                    liveStatus.isOpen
                      ? 'bg-[#5F7F56] animate-pulse'
                      : 'bg-stone-400'
                  }`}
                  aria-hidden="true"
                />
                <span>{liveStatus.statusText}</span>
              </div>

              {/* Trust chip with 28px logo */}
              <a
                href={BUSINESS_INFO.googleMapsQueryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#DCE5D3]/70 hover:bg-[#DCE5D3] border border-[#4F6B47]/20 text-xs text-[#2F3E2C] transition-colors shadow-sm"
              >
                <img
                  src="/images/mesa-logo.png"
                  alt="MESA logo"
                  className="w-5 h-5 rounded-full object-cover shrink-0"
                />
                <span className="font-semibold text-[#2F3E2C]">★ 4.8</span>
                <span className="text-stone-600">from 520+ Google reviews</span>
              </a>
            </motion.div>

            {/* Headline with word-by-word mask reveal */}
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[76px] leading-[1.04] text-[#2F3E2C] tracking-tight mb-6">
              <span className="sr-only">Proper breakfasts on Duke Street.</span>
              <div aria-hidden="true" className="flex flex-wrap gap-x-3.5 sm:gap-x-4">
                {headlineWords.map((word, i) => (
                  <span key={i} className="overflow-hidden inline-block py-1">
                    <motion.span
                      className={`inline-block ${
                        word === 'Duke' || word === 'Street.'
                          ? 'italic font-serif text-[#4F6B47]'
                          : ''
                      }`}
                      initial={{ y: '120%' }}
                      animate={{ y: 0 }}
                      transition={{
                        duration: 0.75,
                        delay: 0.15 + i * 0.08,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      {word}
                    </motion.span>
                  </span>
                ))}
              </div>
            </h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.65 }}
              className="text-base sm:text-lg text-stone-700 max-w-xl font-normal leading-relaxed mb-8"
            >
              Specialty coffee, loaded rolls and brunch plates made with care in the heart of Dennistoun. Come hungry, leave happy.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-wrap items-center gap-4 sm:gap-5"
            >
              <button
                onClick={onOpenBooking}
                data-cursor="book"
                className="relative group overflow-hidden px-8 py-3.5 rounded-full text-sm font-semibold tracking-wider uppercase text-white shadow-md hover:shadow-lg transition-all cursor-pointer bg-gradient-to-r from-[#4F6B47] to-[#5F7F56] hover:from-[#2F3E2C] hover:to-[#4F6B47]"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
                <span className="relative z-10 flex items-center gap-2">
                  <span>Book a Table</span>
                  <Sparkles className="w-4 h-4 text-[#F4C9A8]" />
                </span>
              </button>

              <Link
                to="/menu"
                className="px-7 py-3.5 rounded-full text-sm font-semibold tracking-wider uppercase text-[#2F3E2C] bg-white/80 hover:bg-white border border-[#2F3E2C]/15 hover:border-[#4F6B47] transition-all shadow-sm cursor-pointer"
              >
                See the Menu
              </Link>

              <a
                href={BUSINESS_INFO.phoneTel}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4F6B47] hover:text-[#2F3E2C] transition-colors py-2"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>or call {BUSINESS_INFO.phoneDisplay}</span>
              </a>
            </motion.div>
          </div>

          {/* Right Column: Tall Arch-Masked Image + Overlapping Circular Plate (5 cols) */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[380px] sm:max-w-[420px]">
              {/* Tall Arch-Masked tomato-toast.jpg */}
              <motion.div
                style={{ y: yParallaxArch }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 w-full h-[460px] sm:h-[520px] rounded-t-[200px] rounded-b-3xl overflow-hidden shadow-2xl border-4 border-[#FBF8F2]"
              >
                <SmartImage
                  src={IMAGES.tomatoToast.src}
                  alt={IMAGES.tomatoToast.alt}
                  aspectRatio="aspect-[3/4]"
                  priority={true}
                  className="w-full h-full"
                  imgClassName="scale-105 hover:scale-110 transition-transform duration-700"
                />
                {/* Subtle caption badge at top of arch */}
                <div className="absolute bottom-4 left-4 right-4 p-3 rounded-2xl bg-white/85 backdrop-blur-md border border-[#2F3E2C]/10 text-xs text-[#2F3E2C] shadow-md">
                  <p className="font-serif italic text-sm font-medium">Heritage Tomato &amp; Whipped Ricotta</p>
                  <p className="text-[11px] text-stone-500">MESA signature on toasted sourdough</p>
                </div>
              </motion.div>

              {/* Overlapping Circular Plate: full-breakfast.jpg */}
              <motion.div
                style={{ y: yParallaxCircle }}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="absolute -bottom-8 -left-8 sm:-left-12 z-20 w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden shadow-[0_12px_32px_rgba(47,62,44,0.22)] border-4 border-[#FBF8F2] bg-[#F6F1E7] group"
              >
                <SmartImage
                  src={IMAGES.fullBreakfast.src}
                  alt={IMAGES.fullBreakfast.alt}
                  aspectRatio="aspect-square"
                  className="w-full h-full rounded-full"
                  imgClassName="rounded-full group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/40 via-transparent to-transparent flex items-end justify-center pb-2.5">
                  <span className="text-[10px] font-semibold text-white tracking-widest uppercase bg-[#2F3E2C]/70 backdrop-blur-xs px-2.5 py-0.5 rounded-full">
                    The Full Scottish
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Animated Scroll Cue at bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="flex flex-col items-center justify-center pt-8 text-xs text-stone-500"
      >
        <a
          href="#story"
          aria-label="Scroll to learn our story"
          className="flex flex-col items-center gap-1.5 hover:text-[#2F3E2C] transition-colors cursor-pointer group"
        >
          <span className="text-[11px] uppercase tracking-widest font-medium">Explore MESA</span>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          >
            <ArrowDown className="w-3.5 h-3.5 text-[#4F6B47] group-hover:text-[#2F3E2C]" />
          </motion.div>
        </a>
      </motion.div>
    </section>
  );
};
