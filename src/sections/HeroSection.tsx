import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Phone, ArrowDown, ShoppingBag } from 'lucide-react';
import { BUSINESS_INFO } from '../data/business';
import { IMAGES } from '../data/images';
import { getLiveStatus } from '../lib/hours';
import { SmartImage } from '../components/SmartImage';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface HeroSectionProps {
  onOpenBooking: () => void;
}

interface SlideItem {
  src: string;
  alt: string;
  caption: string;
  fallbackKey: string;
}

const SLIDES: SlideItem[] = [
  {
    src: IMAGES.fullBreakfast.src,
    alt: IMAGES.fullBreakfast.alt,
    caption: 'Today at MESA — The Full Breakfast',
    fallbackKey: 'full-breakfast',
  },
  {
    src: IMAGES.pancakes.src,
    alt: IMAGES.pancakes.alt,
    caption: 'Today at MESA — Stacked Pancakes',
    fallbackKey: 'pancakes',
  },
  {
    src: IMAGES.morningRoll.src,
    alt: IMAGES.morningRoll.alt,
    caption: 'Today at MESA — The Morning Roll',
    fallbackKey: 'morning-roll',
  },
  {
    src: IMAGES.tomatoToast.src,
    alt: IMAGES.tomatoToast.alt,
    caption: 'Today at MESA — Tomato Sourdough',
    fallbackKey: 'tomato-toast',
  },
];

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenBooking }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 });
  const prefersReduced = useReducedMotion();
  const liveStatus = getLiveStatus();
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-playing 5s slideshow with next-slide preloading
  useEffect(() => {
    if (prefersReduced || isPaused) return;

    // Preload next image in browser cache
    const nextIdx = (currentSlide + 1) % SLIDES.length;
    const preloadImg = new Image();
    preloadImg.src = SLIDES[nextIdx].src;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [currentSlide, isPaused, prefersReduced]);

  // Desktop subtle mouse-move parallax (max 12px)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!isFinePointer || prefersReduced) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const xNorm = (e.clientX / innerWidth - 0.5) * 2; // -1 to 1
      const yNorm = (e.clientY / innerHeight - 0.5) * 2;
      setParallaxOffset({
        x: Math.round(xNorm * 12),
        y: Math.round(yNorm * 12),
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [prefersReduced]);

  const activeSlide = SLIDES[currentSlide];

  return (
    <section
      id="top"
      ref={containerRef}
      className="relative min-h-[92vh] sm:min-h-screen pt-28 sm:pt-36 pb-14 flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#FBF8F2] via-[#F6F1E7] to-[#F6F1E7]"
    >
      {/* Background soft drifting mesh gradient blobs (pointer-events-none z-0) */}
      <div
        className="ambient-blob absolute top-12 right-[-5%] w-[580px] h-[580px] rounded-full bg-gradient-to-tr from-[#DCE5D3]/45 via-[#F4C9A8]/25 to-[#F6F1E7] blur-3xl pointer-events-none z-0"
        aria-hidden="true"
      />
      <div
        className="ambient-blob absolute bottom-8 left-[-8%] w-[480px] h-[480px] rounded-full bg-gradient-to-br from-[#DCE5D3]/35 via-[#FBF8F2] to-[#F4C9A8]/20 blur-3xl pointer-events-none z-0"
        style={{ animationDelay: '-10s' }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* MOBILE ORDER: Image first on mobile, text second. Desktop: Text left (7 cols), Image right (5 cols) */}
          
          {/* ===================== LEFT: TEXT COLUMN (Desktop: col-span-7, order-1 / Mobile: order-2) ===================== */}
          <div className="order-2 lg:order-1 lg:col-span-7 z-30">
            {/* Small uppercase label with pulsing status dot */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#2F3E2C]/10 text-xs font-semibold text-[#2F3E2C] shadow-xs backdrop-blur-xs mb-5"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  liveStatus.isOpen
                    ? 'bg-[#5F7F56] animate-pulse'
                    : 'bg-stone-400'
                }`}
                aria-hidden="true"
              />
              <span className="uppercase tracking-wider">
                DENNISTOUN · GLASGOW EAST END · {liveStatus.isOpen ? 'OPEN NOW' : 'CLOSED'}
              </span>
            </motion.div>

            {/* Headline revealed line by line */}
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[76px] xl:text-[84px] leading-[1.02] text-[#2F3E2C] tracking-tight mb-5">
              <span className="sr-only">Proper breakfasts on Duke Street.</span>
              <div aria-hidden="true">
                <div className="overflow-hidden py-0.5">
                  <motion.div
                    initial={{ y: '110%' }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.75, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  >
                    Proper breakfasts
                  </motion.div>
                </div>
                <div className="overflow-hidden py-0.5">
                  <motion.div
                    initial={{ y: '110%' }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.75, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
                  >
                    on{' '}
                    <span className="italic font-serif bg-gradient-to-r from-[#4F6B47] to-[#C9774F] bg-clip-text text-transparent">
                      Duke Street.
                    </span>
                  </motion.div>
                </div>
              </div>
            </h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="text-base sm:text-lg text-stone-700 max-w-xl font-normal leading-relaxed mb-7"
            >
              Loaded morning rolls, stacked pancakes and specialty coffee, made properly with east end prices.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-wrap items-center gap-4 mb-8"
            >
              <button
                onClick={onOpenBooking}
                data-cursor="book"
                className="relative group overflow-hidden px-7 py-3.5 rounded-full text-xs sm:text-sm font-semibold tracking-wider uppercase text-white shadow-md hover:shadow-lg transition-all cursor-pointer bg-gradient-to-r from-[#4F6B47] to-[#5F7F56] hover:from-[#2F3E2C] hover:to-[#4F6B47]"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
                <span className="relative z-10 flex items-center gap-2">
                  <span>Book a Table</span>
                  <Sparkles className="w-4 h-4 text-[#F4C9A8]" />
                </span>
              </button>

              <Link
                to="/order"
                className="px-6 py-3.5 rounded-full text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#2F3E2C] bg-white/80 hover:bg-white border border-[#2F3E2C]/15 hover:border-[#4F6B47] transition-all shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-[#4F6B47]" />
                <span>Order for Collection</span>
              </Link>

              <a
                href={BUSINESS_INFO.phoneTel}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4F6B47] hover:text-[#2F3E2C] transition-colors py-2"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>or call {BUSINESS_INFO.phoneDisplay}</span>
              </a>
            </motion.div>

            {/* Social Proof Row: 5 Overlapping Circular Food Crops + Ratings */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.85, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-wrap items-center gap-4 pt-4 border-t border-[#2F3E2C]/10"
            >
              {/* Overlapping avatar food crops */}
              <div className="flex -space-x-2.5 overflow-hidden">
                {[
                  IMAGES.fullBreakfast.src,
                  IMAGES.pancakes.src,
                  IMAGES.morningRoll.src,
                  IMAGES.tomatoToast.src,
                  IMAGES.eggsCrumb.src,
                ].map((src, idx) => (
                  <img
                    key={idx}
                    src={src}
                    alt="MESA plate thumbnail"
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-[#FBF8F2] object-cover shrink-0"
                  />
                ))}
              </div>

              {/* Review metrics */}
              <div className="text-xs text-[#2F3E2C] flex items-center gap-2 font-medium">
                <span className="text-amber-700 font-bold tracking-wider">★★★★★ 4.8</span>
                <span className="text-stone-400">·</span>
                <a
                  href={BUSINESS_INFO.googleMapsQueryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-stone-700"
                >
                  Loved by 520+ Google reviewers
                </a>
                <span className="text-stone-400">·</span>
                <a
                  href={BUSINESS_INFO.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#4F6B47] font-semibold hover:underline"
                >
                  21K+ on Instagram
                </a>
              </div>
            </motion.div>
          </div>

          {/* ===================== RIGHT: IMAGE COMPOSITION (Desktop: col-span-5, order-2 / Mobile: order-1) ===================== */}
          <div
            className="order-1 lg:order-2 lg:col-span-5 relative flex justify-center lg:justify-end"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Main Arch Frame: explicit desktop clamp(520px, 78vh, 760px), mobile aspect-[4/5] */}
            <div
              style={{
                transform: `translate3d(${parallaxOffset.x * 0.4}px, ${parallaxOffset.y * 0.4}px, 0)`,
                transition: 'transform 200ms ease-out',
              }}
              className="relative w-full max-w-[370px] sm:max-w-[420px] lg:max-w-[440px]"
            >
              {/* CSS Arch Container: rounded-t-[9999px] rounded-b-3xl */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 w-full h-[480px] sm:h-[540px] lg:h-[clamp(520px,76vh,740px)] rounded-t-[9999px] rounded-b-3xl overflow-hidden shadow-2xl border-4 border-[#FBF8F2] bg-[#EAEFE6]"
              >
                {/* Slideshow Image with 1.2s crossfade and Ken Burns zoom */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, scale: 1.0 }}
                    animate={{
                      opacity: 1,
                      scale: prefersReduced ? 1.0 : 1.07,
                    }}
                    exit={{ opacity: 0 }}
                    transition={{
                      opacity: { duration: 1.2, ease: 'easeInOut' },
                      scale: { duration: 5.5, ease: 'easeOut' },
                    }}
                    className="absolute inset-0 w-full h-full"
                  >
                    <SmartImage
                      src={activeSlide.src}
                      alt={activeSlide.alt}
                      fallbackKey={activeSlide.fallbackKey}
                      priority={true}
                      aspectRatio="aspect-auto"
                      className="w-full h-full"
                      imgClassName="w-full h-full object-cover"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Bottom Frosted Caption Chip */}
                <div className="absolute bottom-5 left-4 right-4 z-20 p-3 rounded-2xl bg-[#FBF8F2]/90 backdrop-blur-md border border-[#2F3E2C]/10 text-xs text-[#2F3E2C] shadow-md flex items-center justify-between">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={currentSlide}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.3 }}
                      className="font-serif italic text-sm font-medium truncate"
                    >
                      {activeSlide.caption}
                    </motion.span>
                  </AnimatePresence>
                  <span className="text-[10px] font-mono font-semibold text-stone-500 uppercase tracking-widest pl-2 shrink-0">
                    {currentSlide + 1} / {SLIDES.length}
                  </span>
                </div>
              </motion.div>

              {/* 4 Clickable Progress Lines below the arch */}
              <div className="flex items-center justify-center gap-2 mt-4 px-2">
                {SLIDES.map((slide, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    aria-label={`Show slide ${i + 1}: ${slide.caption}`}
                    className="relative flex-1 h-1.5 rounded-full bg-stone-300 overflow-hidden cursor-pointer"
                  >
                    {currentSlide === i ? (
                      <motion.div
                        className="absolute inset-0 bg-[#4F6B47]"
                        initial={{ width: '0%' }}
                        animate={{ width: isPaused ? '100%' : '100%' }}
                        transition={{
                          duration: isPaused ? 0 : 5,
                          ease: 'linear',
                        }}
                      />
                    ) : (
                      <div
                        className={`h-full ${
                          i < currentSlide ? 'bg-[#4F6B47]' : 'bg-transparent'
                        }`}
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Floating Card 1 (Top-Left): Circular 140px crop of eggs-crumb.jpg floating (6s loop) */}
              <motion.div
                style={{
                  transform: `translate3d(${parallaxOffset.x * -0.6}px, ${parallaxOffset.y * -0.6}px, 0)`,
                  transition: 'transform 200ms ease-out',
                }}
                className="absolute -top-6 -left-6 sm:-left-10 z-20 pointer-events-none"
              >
                <motion.div
                  animate={
                    prefersReduced
                      ? {}
                      : {
                          y: [0, -10, 0],
                        }
                  }
                  transition={{
                    repeat: Infinity,
                    duration: 6,
                    ease: 'easeInOut',
                  }}
                  className="w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden shadow-[0_12px_32px_rgba(47,62,44,0.22)] border-[5px] sm:border-[6px] border-white bg-[#FBF8F2]"
                >
                  <SmartImage
                    src={IMAGES.eggsCrumb.src}
                    alt={IMAGES.eggsCrumb.alt}
                    fallbackKey="eggs-crumb"
                    aspectRatio="aspect-square"
                    className="w-full h-full"
                    imgClassName="scale-105"
                  />
                </motion.div>
              </motion.div>

              {/* Floating Card 2 (Bottom-Right): Frosted card with MESA logo, "Fresh from 9am", "Every day on Duke St" */}
              <motion.div
                style={{
                  transform: `translate3d(${parallaxOffset.x * 0.7}px, ${parallaxOffset.y * 0.7}px, 0)`,
                  transition: 'transform 200ms ease-out',
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.65, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="absolute -bottom-6 -right-4 sm:-right-8 z-20 p-3 sm:p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-[#2F3E2C]/10 shadow-[0_12px_30px_rgba(47,62,44,0.14)] flex items-center gap-3 pointer-events-none"
              >
                <img
                  src="/images/mesa-logo.png"
                  alt="MESA logo"
                  className="w-10 h-10 rounded-full object-cover shrink-0 shadow-xs"
                />
                <div className="text-left">
                  <span className="font-serif italic text-base text-[#2F3E2C] block leading-none">
                    Fresh from 9am
                  </span>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-[#4F6B47] mt-0.5 block">
                    Every day on Duke St
                  </span>
                </div>
              </motion.div>

              {/* Slow-Rotating Circular Text Badge on Top-Right Edge of Arch */}
              <motion.div
                style={{
                  transform: `translate3d(${parallaxOffset.x * -0.4}px, ${parallaxOffset.y * -0.4}px, 0)`,
                  transition: 'transform 200ms ease-out',
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="absolute -top-6 -right-6 sm:-right-8 w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center pointer-events-none z-20"
              >
                {/* Rotating Circular Text SVG */}
                <svg
                  viewBox="0 0 120 120"
                  className="w-full h-full spin-slow text-[#2F3E2C]"
                  aria-hidden="true"
                >
                  <path
                    id="heroStampCirclePath"
                    d="M 60, 60 m -46, 0 a 46,46 0 1,1 92,0 a 46,46 0 1,1 -92,0"
                    fill="none"
                  />
                  <text className="text-[9.5px] uppercase font-bold tracking-[0.24em] fill-[#2F3E2C]">
                    <textPath href="#heroStampCirclePath">
                      • DUKE STREET • GLASGOW EAST END • MESA •
                    </textPath>
                  </text>
                </svg>

                {/* Logo in center */}
                <div className="absolute w-[56px] h-[56px] sm:w-[62px] sm:h-[62px] rounded-full overflow-hidden shadow-md border-2 border-white bg-white">
                  <img
                    src="/images/mesa-logo.png"
                    alt="MESA logo"
                    className="w-full h-full rounded-full object-cover"
                  />
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
        transition={{ delay: 1.1, duration: 0.6 }}
        className="flex flex-col items-center justify-center pt-8 text-xs text-stone-500 z-10"
      >
        <a
          href="#story"
          aria-label="Scroll for the good stuff"
          className="flex flex-col items-center gap-2 hover:text-[#2F3E2C] transition-colors cursor-pointer group"
        >
          <span className="text-[11px] uppercase tracking-widest font-medium">
            Scroll for the good stuff
          </span>
          <div className="w-[1px] h-6 bg-gradient-to-b from-[#4F6B47] to-transparent relative overflow-hidden">
            <motion.div
              animate={{ y: [0, 24, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
              className="w-full h-2 bg-[#4F6B47]"
            />
          </div>
        </a>
      </motion.div>
    </section>
  );
};
