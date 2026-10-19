import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Menu as MenuIcon, X, ArrowUpRight, Clock, MapPin } from 'lucide-react';
import { BUSINESS_INFO } from '../data/business';
import { getLiveStatus } from '../lib/hours';

interface NavbarProps {
  onOpenBooking: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBooking }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const location = useLocation();

  const isHome = location.pathname === '/';
  const liveStatus = getLiveStatus();

  // Scroll listener for sticky frosted glass and smart hide/show
  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      const currentScrollY = window.scrollY;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(currentScrollY > 40);

          if (currentScrollY > 150) {
            if (currentScrollY > lastScrollY && currentScrollY - lastScrollY > 8) {
              // Scrolling down fast
              setIsVisible(false);
            } else if (lastScrollY - currentScrollY > 8) {
              // Scrolling up
              setIsVisible(true);
            }
          } else {
            setIsVisible(true);
          }

          setLastScrollY(currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [lastScrollY]);

  // Active section observer on homepage
  useEffect(() => {
    if (!isHome) return;

    const sectionIds = ['story', 'plates', 'morning-roll', 'menu-preview', 'gallery', 'visit'];
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
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
        { rootMargin: '-30% 0px -40% 0px' }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, [isHome]);

  // Lock background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: 'Home', href: '/', sectionId: 'home' },
    { name: 'Menu', href: '/menu', sectionId: 'menu-preview' },
    { name: 'Our Story', href: '/#story', sectionId: 'story' },
    { name: 'Gallery', href: '/#gallery', sectionId: 'gallery' },
    { name: 'Visit', href: '/#visit', sectionId: 'visit' },
  ];

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-300 ${
          isScrolled
            ? 'bg-[#FBF8F2]/75 backdrop-blur-md border-b border-[#2F3E2C]/8 py-3 shadow-[0_4px_20px_rgba(47,62,44,0.04)]'
            : 'bg-transparent py-5 sm:py-6'
        }`}
        initial={{ y: 0 }}
        animate={{ y: isVisible ? 0 : -100 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Left: Logo (40px desktop, 34px scrolled) + Wordmark */}
          <Link
            to="/"
            className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F6B47] rounded-full p-0.5"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              whileHover={{ rotate: 6 }}
              transition={{ type: 'spring', stiffness: 350, damping: 15 }}
              className="relative shrink-0"
            >
              <img
                src="/images/mesa-logo.png"
                alt="MESA Glasgow logo"
                className={`rounded-full object-cover aspect-square shadow-[0_6px_20px_rgba(47,62,44,0.18)] transition-all duration-300 ${
                  isScrolled ? 'w-[34px] h-[34px]' : 'w-9 h-9 sm:w-10 sm:h-10'
                }`}
              />
            </motion.div>
            <span className="font-serif italic text-2xl sm:text-[26px] tracking-wider text-[#2F3E2C] group-hover:text-[#4F6B47] transition-colors leading-none">
              MESA
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 lg:gap-9 text-sm font-medium text-[#2F3E2C]">
            {navLinks.map((link) => {
              const isCurrent =
                (link.href === '/' && location.pathname === '/' && activeSection === 'home') ||
                (link.href === '/menu' && location.pathname === '/menu') ||
                (isHome && activeSection === link.sectionId);

              return (
                <Link
                  key={link.name}
                  to={link.href}
                  className="relative py-1 text-[#2F3E2C]/80 hover:text-[#2F3E2C] transition-colors tracking-wide text-[13.5px] uppercase font-semibold"
                >
                  {link.name}
                  {isCurrent && (
                    <motion.div
                      layoutId="navUnderline"
                      className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#4F6B47]"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Actions Right: Ghost Call + Gradient Book Button */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href={BUSINESS_INFO.phoneTel}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold tracking-wide uppercase text-[#2F3E2C] hover:text-[#4F6B47] transition-colors rounded-full hover:bg-[#DCE5D3]/40 cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5 text-[#4F6B47]" />
              <span>Call</span>
            </a>

            <button
              onClick={onOpenBooking}
              data-cursor="book"
              className="relative group overflow-hidden px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase text-white shadow-sm hover:shadow-md transition-all cursor-pointer bg-gradient-to-r from-[#4F6B47] to-[#5F7F56] hover:from-[#2F3E2C] hover:to-[#4F6B47]"
            >
              {/* Shine sweep */}
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
              <span className="relative z-10">Book a Table</span>
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center gap-2 sm:hidden">
            <button
              onClick={onOpenBooking}
              className="px-3.5 py-1.5 rounded-full text-[11px] font-semibold tracking-wider uppercase text-white bg-[#4F6B47]"
            >
              Book
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="p-2 rounded-full text-[#2F3E2C] hover:bg-[#DCE5D3]/50 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Full-Screen Overlay Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-gradient-to-b from-[#FBF8F2] via-[#F6F1E7] to-[#DCE5D3] flex flex-col justify-between p-6 sm:p-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Top Bar with Logo & Close Button */}
            <div className="flex items-center justify-between">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3"
              >
                <img
                  src="/images/mesa-logo.png"
                  alt="MESA Glasgow logo"
                  className="w-14 h-14 rounded-full object-cover shadow-[0_6px_20px_rgba(47,62,44,0.18)]"
                />
                <span className="font-serif italic text-3xl text-[#2F3E2C]">MESA</span>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
                className="p-2.5 rounded-full bg-[#2F3E2C]/5 text-[#2F3E2C] hover:bg-[#2F3E2C]/10 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Links staggered in large serif */}
            <nav className="my-auto py-8 flex flex-col space-y-4">
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + idx * 0.06, duration: 0.4 }}
                >
                  <Link
                    to={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-serif text-4xl sm:text-5xl text-[#2F3E2C] hover:text-[#4F6B47] transition-colors flex items-center justify-between group"
                  >
                    <span>{link.name}</span>
                    <ArrowUpRight className="w-6 h-6 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45, duration: 0.4 }}
                className="pt-4"
              >
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenBooking();
                  }}
                  className="w-full py-4 rounded-full bg-[#2F3E2C] text-[#FBF8F2] font-semibold text-sm tracking-wider uppercase shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Book a Table</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </motion.div>
            </nav>

            {/* Bottom Details: Phone, Address, Hours, Instagram */}
            <div className="pt-6 border-t border-[#2F3E2C]/15 text-xs text-[#2F3E2C]/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      liveStatus.isOpen ? 'bg-[#5F7F56]' : 'bg-stone-400'
                    }`}
                  />
                  <span className="font-medium text-[#2F3E2C]">{liveStatus.statusText}</span>
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

              <div className="flex items-start justify-between gap-4 pt-1">
                <div className="flex items-center gap-1.5 text-stone-600">
                  <MapPin className="w-3.5 h-3.5 shrink-0 text-[#4F6B47]" />
                  <span>567 Duke St, Dennistoun</span>
                </div>
                <a
                  href={BUSINESS_INFO.phoneTel}
                  className="flex items-center gap-1.5 font-medium text-[#2F3E2C] hover:underline shrink-0"
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
