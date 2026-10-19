import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, Instagram, Facebook, Phone, MapPin, CheckCircle2 } from 'lucide-react';
import { BUSINESS_INFO } from '../data/business';
import { NAV_ITEMS } from '../data/navigation';
import { useNavigateToSection } from '../hooks/useNavigateToSection';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const navigateToSection = useNavigateToSection();

  const handleNavClick = (item: (typeof NAV_ITEMS)[0]) => {
    if (item.type === 'section' && item.sectionId) {
      navigateToSection(item.sectionId);
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#FBF8F2] text-[#1F2420] pt-20 pb-12 border-t border-[#2F3E2C]/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section: Logo, Tagline, Quick Links, Newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-[#2F3E2C]/10">
          {/* Col 1: Brand & Logo (80px) & Tagline (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-4">
              <img
                src="/images/mesa-logo.png"
                alt="MESA Glasgow logo"
                className="w-20 h-20 rounded-full object-cover shadow-[0_6px_20px_rgba(47,62,44,0.18)]"
              />
              <div>
                <span className="font-serif italic text-3xl text-[#2F3E2C] block">MESA</span>
                <span className="text-xs uppercase tracking-widest text-[#4F6B47] font-semibold">
                  Glasgow East End
                </span>
              </div>
            </div>

            <p className="font-serif italic text-2xl text-[#2F3E2C] pt-2">
              &ldquo;{BUSINESS_INFO.tagline}&rdquo;
            </p>

            <p className="text-xs text-stone-600 max-w-sm leading-relaxed">
              Specialty coffee, loaded morning rolls, and seasonal brunch plates crafted in Dennistoun by two friends.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={BUSINESS_INFO.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram profile"
                className="w-9 h-9 rounded-full bg-[#EAEFE6] hover:bg-[#4F6B47] text-[#2F3E2C] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={BUSINESS_INFO.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook page"
                className="w-9 h-9 rounded-full bg-[#EAEFE6] hover:bg-[#4F6B47] text-[#2F3E2C] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={BUSINESS_INFO.phoneTel}
                aria-label="Phone number"
                className="w-9 h-9 rounded-full bg-[#EAEFE6] hover:bg-[#4F6B47] text-[#2F3E2C] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-[#2F3E2C]">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs font-medium text-stone-600">
              {NAV_ITEMS.map((item) => (
                <li key={item.label}>
                  {item.type === 'route' ? (
                    <Link to={item.route} className="hover:text-[#4F6B47] transition-colors">
                      {item.label}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleNavClick(item)}
                      className="hover:text-[#4F6B47] transition-colors text-left cursor-pointer"
                    >
                      {item.label}
                    </button>
                  )}
                </li>
              ))}
              <li>
                <Link to="/book" className="hover:text-[#4F6B47] transition-colors">
                  Book a Table
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Newsletter & Quick Address (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-[#2F3E2C]">
              East End Dispatch
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Specials &amp; seasonal announcements. Zero spam, unsubscribe anytime.
            </p>

            {subscribed ? (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-[#DCE5D3] text-[#2F3E2C] text-xs">
                <CheckCircle2 className="w-4 h-4 text-[#4F6B47]" />
                <span className="font-medium">You’re on the list! Thank you.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-white border border-[#2F3E2C]/15 focus:border-[#4F6B47] focus:ring-1 focus:ring-[#4F6B47] outline-none text-[#2F3E2C]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#2F3E2C] hover:bg-[#4F6B47] text-[#FBF8F2] text-xs font-semibold tracking-wider uppercase transition-colors shrink-0 cursor-pointer"
                >
                  Join
                </button>
              </form>
            )}

            <div className="pt-2 text-xs text-stone-600 space-y-1">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#4F6B47] shrink-0" />
                <span>567 Duke St, Glasgow G31 1PY</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#4F6B47] shrink-0" />
                <a href={BUSINESS_INFO.phoneTel} className="hover:underline">
                  {BUSINESS_INFO.phoneDisplay}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Giant Outlined MESA Wordmark that fills with sage on hover */}
        <div className="py-12 sm:py-16 text-center select-none overflow-hidden">
          <span
            className="font-serif italic text-[18vw] sm:text-[19vw] lg:text-[210px] leading-none tracking-tighter text-transparent transition-all duration-700 cursor-default inline-block"
            style={{
              WebkitTextStroke: '1.5px #2F3E2C',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#2F3E2C';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'transparent';
            }}
          >
            MESA
          </span>
        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#2F3E2C]/10 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} MESA Glasgow. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Independent café on Duke Street</span>
            <button
              onClick={scrollToTop}
              aria-label="Back to top"
              className="inline-flex items-center gap-1.5 font-medium text-[#2F3E2C] hover:text-[#4F6B47] transition-colors cursor-pointer"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
