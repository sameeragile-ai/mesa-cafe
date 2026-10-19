import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { Phone, Menu as MenuIcon, X, ShoppingBag, ArrowUpRight, MapPin } from 'lucide-react';
import { NAV_ITEMS } from '../data/navigation';
import { BUSINESS_INFO } from '../data/business';
import { useNavigateToSection } from '../hooks/useNavigateToSection';
import { useCart } from '../context/CartContext';
import { stopLenis, startLenis } from '../hooks/useSmoothScroll';
import { getLiveStatus } from '../lib/hours';

interface NavbarProps {
  onOpenBooking: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBooking }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('top');
  const location = useLocation();
  const navigateToSection = useNavigateToSection();
  const { totalItemsCount, openCartDrawer } = useCart();
  const liveStatus = getLiveStatus();

  // Scroll Progress Bar calculation with spring smoothing
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Always visible: fixed at top. State A (<24px) vs State B (>=24px)
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY >= 24);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Section Observer on homepage ("/")
  useEffect(() => {
    if (location.pathname !== '/') return;

    const observedIds = ['top', 'story', 'plates', 'morning-roll', 'menu-preview', 'gallery', 'visit'];
    const observers: IntersectionObserver[] = [];

    observedIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(id);
            }
          });
        },
        { rootMargin: '-25% 0px -40% 0px' }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, [location.pathname]);

  // Mobile menu scroll locking & Lenis management
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      stopLenis();
    } else {
      document.body.style.overflow = 'auto';
      startLenis();
    }

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      document.body.style.overflow = 'auto';
      startLenis();
      window.removeEventListener('keydown', handleEsc);
    };
  }, [mobileMenuOpen]);

  const handleNavClick = (
    item: (typeof NAV_ITEMS)[0],
    isMobile = false
  ) => {
    if (isMobile) {
      setMobileMenuOpen(false);
    }

    if (item.type === 'section' && item.sectionId) {
      navigateToSection(item.sectionId);
    }
  };

  return (
    <>
      {/* Fixed Sticky Navbar (z-index 50) */}
      <nav
        aria-label="Main Navigation"
        style={{
          background: isScrolled
            ? 'rgba(255, 255, 255, 0.62)'
            : 'transparent',
          backdropFilter: isScrolled ? 'blur(18px) saturate(180%)' : 'none',
          WebkitBackdropFilter: isScrolled ? 'blur(18px) saturate(180%)' : 'none',
          borderBottom: isScrolled
            ? '1px solid rgba(47, 62, 44, 0.08)'
            : '1px solid transparent',
          boxShadow: isScrolled
            ? '0 4px 20px -2px rgba(47, 62, 44, 0.05)'
            : 'none',
          transition:
            'height 350ms cubic-bezier(0.22, 1, 0.36, 1), background-color 350ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 350ms cubic-bezier(0.22, 1, 0.36, 1), border-color 350ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
        className={`fixed top-0 left-0 right-0 z-50 flex items-center ${
          isScrolled ? 'h-[72px]' : 'h-[88px]'
        }`}
      >
        <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Left: Logo + "MESA" Wordmark + Subtitle */}
          <Link
            to="/"
            onClick={() => {
              if (location.pathname === '/') {
                navigateToSection('top');
              }
            }}
            className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F6B47] rounded-full p-0.5"
          >
            <motion.div
              whileHover={{ rotate: 6 }}
              transition={{ type: 'spring', stiffness: 350, damping: 15 }}
              className="relative shrink-0"
            >
              <img
                src="/images/mesa-logo.png"
                alt="MESA Glasgow logo"
                style={{
                  transition:
                    'width 350ms cubic-bezier(0.22, 1, 0.36, 1), height 350ms cubic-bezier(0.22, 1, 0.36, 1)',
                }}
                className={`rounded-full object-cover aspect-square shadow-[0_6px_20px_rgba(47,62,44,0.18)] ${
                  isScrolled ? 'w-[34px] h-[34px]' : 'w-10 h-10'
                }`}
              />
            </motion.div>
            <div className="flex flex-col">
              <span className="font-serif italic text-2xl sm:text-[26px] tracking-wider text-[#2F3E2C] group-hover:text-[#4F6B47] transition-colors leading-none">
                MESA
              </span>
              <span className="text-[9px] tracking-widest font-semibold uppercase text-[#4F6B47] leading-tight pt-0.5">
                GLASGOW · DENNISTOUN
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links (from /src/data/navigation.ts) */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-medium text-[#2F3E2C]">
            {NAV_ITEMS.map((item) => {
              const isRouteActive =
                item.type === 'route' && location.pathname === item.route;
              const isSectionActive =
                location.pathname === '/' &&
                item.type === 'section' &&
                activeSection === item.sectionId;
              const isActive = isRouteActive || isSectionActive;

              if (item.type === 'route') {
                return (
                  <Link
                    key={item.label}
                    to={item.route}
                    className="relative py-1 text-[#2F3E2C]/80 hover:text-[#2F3E2C] transition-colors tracking-wide text-[13px] uppercase font-semibold flex items-center gap-1.5"
                  >
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4F6B47]" />
                    )}
                    <span>{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="navUnderline"
                        className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#4F6B47]"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                      />
                    )}
                  </Link>
                );
              }

              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleNavClick(item)}
                  className="relative py-1 text-[#2F3E2C]/80 hover:text-[#2F3E2C] transition-colors tracking-wide text-[13px] uppercase font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4F6B47]" />
                  )}
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="navUnderline"
                      className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#4F6B47]"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Actions: Ghost Call, Cart Icon Button with Count Badge, Gradient Book Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Ghost Call */}
            <a
              href={BUSINESS_INFO.phoneTel}
              aria-label="Call MESA café"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold tracking-wide uppercase text-[#2F3E2C] hover:text-[#4F6B47] transition-colors rounded-full hover:bg-stone-200/50 cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5 text-[#4F6B47]" />
              <span>Call</span>
            </a>

            {/* Cart Icon Button (ALWAYS visible outside menu on mobile & desktop) */}
            <button
              onClick={openCartDrawer}
              aria-label={`Open shopping cart with ${totalItemsCount} items`}
              className="relative p-2.5 rounded-full text-[#2F3E2C] hover:bg-stone-200/60 transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5 text-[#2F3E2C]" />
              {totalItemsCount > 0 && (
                <motion.span
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  key={totalItemsCount}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-[#4F6B47] text-white text-[10px] font-bold flex items-center justify-center shadow-xs"
                >
                  {totalItemsCount}
                </motion.span>
              )}
            </button>

            {/* Book a Table Primary CTA */}
            <button
              onClick={onOpenBooking}
              data-cursor="book"
              className="relative group overflow-hidden px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-[11px] sm:text-xs font-semibold tracking-wider uppercase text-white shadow-sm hover:shadow-md transition-all cursor-pointer bg-gradient-to-r from-[#4F6B47] to-[#5F7F56] hover:from-[#2F3E2C] hover:to-[#4F6B47]"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
              <span className="relative z-10 whitespace-nowrap">Book a Table</span>
            </button>

            {/* Hamburger Button (Mobile) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
              className="p-2 rounded-full text-[#2F3E2C] hover:bg-stone-200/60 transition-colors lg:hidden"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* 2px Scroll-Progress Bar at bottom edge in sage-500 */}
        <motion.div
          style={{ scaleX, transformOrigin: '0%' }}
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#5F7F56]"
        />
      </nav>

      {/* Mobile Menu Overlay (z-index 60) with Light Frosted Styling */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-60 flex flex-col justify-between p-6 sm:p-8"
            style={{
              background: 'rgba(251, 248, 242, 0.94)',
              backdropFilter: 'blur(20px) saturate(160%)',
              WebkitBackdropFilter: 'blur(20px) saturate(160%)',
            }}
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Top Bar with Logo & Close */}
            <div className="flex items-center justify-between">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3"
              >
                <img
                  src="/images/mesa-logo.png"
                  alt="MESA Glasgow logo"
                  className="w-12 h-12 rounded-full object-cover shadow-md"
                />
                <span className="font-serif italic text-3xl text-[#2F3E2C]">MESA</span>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
                className="p-2 rounded-full bg-stone-200/60 text-[#2F3E2C] hover:bg-stone-300 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Links staggered in large serif */}
            <nav className="my-auto py-8 flex flex-col space-y-4">
              {NAV_ITEMS.map((item, idx) => {
                const isRouteActive =
                  item.type === 'route' && location.pathname === item.route;
                const isSectionActive =
                  location.pathname === '/' &&
                  item.type === 'section' &&
                  activeSection === item.sectionId;
                const isActive = isRouteActive || isSectionActive;

                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + idx * 0.05, duration: 0.35 }}
                  >
                    {item.type === 'route' ? (
                      <Link
                        to={item.route}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`font-serif text-3xl sm:text-4xl transition-colors flex items-center justify-between ${
                          isActive
                            ? 'text-[#4F6B47] font-semibold'
                            : 'text-[#2F3E2C] hover:text-[#4F6B47]'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          {isActive && (
                            <span className="w-2 h-2 rounded-full bg-[#4F6B47]" />
                          )}
                          <span>{item.label}</span>
                        </span>
                        <ArrowUpRight className="w-5 h-5 opacity-40" />
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleNavClick(item, true)}
                        className={`w-full font-serif text-3xl sm:text-4xl text-left transition-colors flex items-center justify-between cursor-pointer ${
                          isActive
                            ? 'text-[#4F6B47] font-semibold'
                            : 'text-[#2F3E2C] hover:text-[#4F6B47]'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          {isActive && (
                            <span className="w-2 h-2 rounded-full bg-[#4F6B47]" />
                          )}
                          <span>{item.label}</span>
                        </span>
                        <ArrowUpRight className="w-5 h-5 opacity-40" />
                      </button>
                    )}
                  </motion.div>
                );
              })}

              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.38, duration: 0.35 }}
                className="pt-4 flex gap-3"
              >
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenBooking();
                  }}
                  className="flex-1 py-3.5 rounded-full bg-[#2F3E2C] text-[#FBF8F2] font-semibold text-xs tracking-wider uppercase shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Book a Table</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
                <Link
                  to="/order"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-3.5 rounded-full bg-[#4F6B47] text-white font-semibold text-xs tracking-wider uppercase shadow-md flex items-center justify-center gap-2 text-center"
                >
                  <span>Order Online</span>
                </Link>
              </motion.div>
            </nav>

            {/* Mobile Footer Info */}
            <div className="pt-4 border-t border-[#2F3E2C]/15 text-xs text-[#2F3E2C]/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      liveStatus.isOpen ? 'bg-[#5F7F56]' : 'bg-stone-400'
                    }`}
                  />
                  <span className="font-medium text-[#2F3E2C]">
                    {liveStatus.statusText}
                  </span>
                </div>
                <a
                  href={BUSINESS_INFO.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[#4F6B47] hover:underline"
                >
                  {BUSINESS_INFO.instagramHandle}
                </a>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-1 text-stone-600 truncate">
                  <MapPin className="w-3.5 h-3.5 shrink-0 text-[#4F6B47]" />
                  <span className="truncate">567 Duke St, Dennistoun</span>
                </div>
                <a
                  href={BUSINESS_INFO.phoneTel}
                  className="flex items-center gap-1 font-medium text-[#2F3E2C] hover:underline shrink-0"
                >
                  <Phone className="w-3.5 h-3.5 text-[#4F6B47]" />
                  <span>{BUSINESS_INFO.phoneDisplay}</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
