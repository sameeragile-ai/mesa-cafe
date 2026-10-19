import React, { useEffect } from 'react';
import { PageTransition } from '../components/PageTransition';
import { BookingFlow } from '../components/BookingFlow';
import { SmartImage } from '../components/SmartImage';
import { IMAGES } from '../data/images';
import { BUSINESS_INFO } from '../data/business';
import { Phone, Clock, MapPin, Sparkles } from 'lucide-react';
import { getLiveStatus } from '../lib/hours';

export const BookPage: React.FC = () => {
  const liveStatus = getLiveStatus();

  useEffect(() => {
    document.title = 'Book a Table – MESA Glasgow | Duke Street Reservation';
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <PageTransition>
      <div className="pt-28 sm:pt-36 pb-24 bg-[#F6F1E7] min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="max-w-2xl mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#DCE5D3] text-xs font-semibold uppercase tracking-widest text-[#2F3E2C] mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#4F6B47]" />
              <span>Table Reservations</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#2F3E2C] tracking-tight leading-tight">
              Reserve your spot at <span className="italic font-serif text-[#4F6B47]">MESA</span>.
            </h1>
            <p className="text-stone-600 text-sm sm:text-base mt-2">
              Book online in seconds. For groups over 10 or immediate same-hour tables, please ring the café directly.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left: Main Multi-Step Booking System (7 cols) */}
            <div className="lg:col-span-7">
              <BookingFlow />
            </div>

            {/* Right: Side Panel with morning-roll.jpg and Walk-in note (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Image Card */}
              <div className="rounded-2xl overflow-hidden bg-[#FBF8F2] shadow-sm border border-[#2F3E2C]/10">
                <div className="relative aspect-[4/3] bg-[#EAEFE6]">
                  <SmartImage
                    src={IMAGES.morningRoll.src}
                    alt={IMAGES.morningRoll.alt}
                    aspectRatio="aspect-[4/3]"
                    objectPosition="center 35%"
                    className="w-full h-full"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#2F3E2C]/85 backdrop-blur-xs text-xs font-semibold text-[#FBF8F2]">
                    The Morning Roll
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <h3 className="font-serif italic text-2xl text-[#2F3E2C]">
                    Walk-ins always welcome.
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    We keep tables open every day for folks passing by on Duke Street. Bookings help us save you a seat at peak brunch hours so you don’t have to wait.
                  </p>
                </div>
              </div>

              {/* Info & Opening Hours Card */}
              <div className="rounded-2xl bg-[#FBF8F2] p-6 border border-[#2F3E2C]/10 space-y-4 text-xs text-[#2F3E2C]">
                <div className="flex items-center justify-between pb-3 border-b border-[#2F3E2C]/10">
                  <div className="flex items-center gap-2 font-semibold uppercase tracking-wider">
                    <Clock className="w-4 h-4 text-[#4F6B47]" />
                    <span>Today&apos;s Status</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        liveStatus.isOpen ? 'bg-[#5F7F56] animate-pulse' : 'bg-stone-400'
                      }`}
                    />
                    <span className="font-semibold">{liveStatus.statusText}</span>
                  </div>
                </div>

                <div className="space-y-2 text-stone-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#4F6B47] shrink-0" />
                    <span>567 Duke St, Dennistoun, Glasgow G31 1PY</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#4F6B47] shrink-0" />
                    <a
                      href={BUSINESS_INFO.phoneTel}
                      className="text-[#2F3E2C] font-semibold hover:underline"
                    >
                      {BUSINESS_INFO.phoneDisplay}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
