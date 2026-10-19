import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, Compass, Calendar, ArrowUpRight } from 'lucide-react';
import { BUSINESS_INFO } from '../data/business';
import { getLiveStatus, getLondonNow } from '../lib/hours';
import { LogoLines } from '../components/LogoLines';

interface VisitSectionProps {
  onOpenBooking: () => void;
}

export const VisitSection: React.FC<VisitSectionProps> = ({ onOpenBooking }) => {
  const liveStatus = getLiveStatus();
  const now = getLondonNow();
  const currentDayIndex = now.getDay(); // 0 = Sun, 1 = Mon ...

  return (
    <section id="visit" className="py-24 sm:py-32 bg-[#FBF8F2] relative overflow-hidden">
      {/* Decorative <LogoLines /> watermark behind */}
      <div
        className="absolute -left-20 bottom-10 w-[42vw] max-w-[520px] pointer-events-none select-none text-[#5F7F56] opacity-[0.06]"
        aria-hidden="true"
      >
        <LogoLines className="w-full h-auto" strokeWidth={1.8} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Address, Phone, Live Status, Full Weekly Hours (6 cols) */}
          <div className="lg:col-span-6">
            <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-[#4F6B47] font-semibold mb-3">
              <span>07</span>
              <span className="w-8 h-[1px] bg-[#4F6B47]/40" />
              <span>Visit Us</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#2F3E2C] tracking-tight mb-4">
              Come on over to <span className="italic font-serif text-[#4F6B47]">Duke Street</span>.
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed mb-8">
              We’re right in the vibrant heart of Dennistoun in Glasgow’s East End, easily reached by bus or a short walk from Bellgrove or Duke Street stations.
            </p>

            {/* Address & Phone Quick Cards */}
            <div className="space-y-3 mb-8">
              <a
                href={BUSINESS_INFO.googleMapsQueryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 p-4 rounded-xl bg-[#F6F1E7] border border-[#2F3E2C]/10 hover:border-[#4F6B47] transition-all group"
              >
                <div className="w-9 h-9 rounded-full bg-[#4F6B47]/10 text-[#4F6B47] flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <span className="text-xs uppercase tracking-wider text-stone-500 font-semibold block">
                    Address
                  </span>
                  <span className="text-sm font-medium text-[#2F3E2C] group-hover:text-[#4F6B47] transition-colors">
                    {BUSINESS_INFO.address}
                  </span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover:text-[#4F6B47] transition-colors shrink-0" />
              </a>

              <a
                href={BUSINESS_INFO.phoneTel}
                className="flex items-start gap-3 p-4 rounded-xl bg-[#F6F1E7] border border-[#2F3E2C]/10 hover:border-[#4F6B47] transition-all group"
              >
                <div className="w-9 h-9 rounded-full bg-[#4F6B47]/10 text-[#4F6B47] flex items-center justify-center shrink-0 mt-0.5">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <span className="text-xs uppercase tracking-wider text-stone-500 font-semibold block">
                    Phone Reservations &amp; Enquiries
                  </span>
                  <span className="text-sm font-medium text-[#2F3E2C] group-hover:text-[#4F6B47] transition-colors">
                    {BUSINESS_INFO.phoneDisplay}
                  </span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover:text-[#4F6B47] transition-colors shrink-0" />
              </a>
            </div>

            {/* Weekly Hours Table with TODAY highlighted */}
            <div className="bg-[#F6F1E7] rounded-2xl p-6 border border-[#2F3E2C]/10 mb-8">
              <div className="flex items-center justify-between pb-4 border-b border-[#2F3E2C]/10 mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#4F6B47]" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#2F3E2C]">
                    Opening Hours
                  </span>
                </div>
                <div className="inline-flex items-center gap-1.5 text-xs">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      liveStatus.isOpen ? 'bg-[#5F7F56] animate-pulse' : 'bg-stone-400'
                    }`}
                  />
                  <span className="font-semibold text-[#2F3E2C]">{liveStatus.statusText}</span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                {BUSINESS_INFO.schedule.map((item) => {
                  const isToday = item.dayIndex === currentDayIndex;

                  return (
                    <div
                      key={item.day}
                      className={`flex items-center justify-between py-1.5 px-3 rounded-lg transition-colors ${
                        isToday
                          ? 'bg-[#DCE5D3] font-semibold text-[#2F3E2C] shadow-xs'
                          : 'text-stone-600'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{item.day}</span>
                        {isToday && (
                          <span className="text-[10px] uppercase font-bold tracking-widest text-[#4F6B47] bg-white/70 px-1.5 py-0.2 rounded">
                            Today
                          </span>
                        )}
                      </div>
                      <span className="font-mono tabular-nums">{item.displayHours}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={BUSINESS_INFO.googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#2F3E2C] text-[#FBF8F2] text-xs font-semibold tracking-wider uppercase hover:bg-[#4F6B47] transition-all shadow-sm cursor-pointer"
              >
                <Compass className="w-4 h-4" />
                <span>Get Directions</span>
              </a>

              <a
                href={BUSINESS_INFO.phoneTel}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white border border-[#2F3E2C]/15 text-[#2F3E2C] text-xs font-semibold tracking-wider uppercase hover:bg-[#DCE5D3]/40 transition-colors shadow-sm cursor-pointer"
              >
                <Phone className="w-4 h-4 text-[#4F6B47]" />
                <span>Call Now</span>
              </a>

              <button
                onClick={onOpenBooking}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#4F6B47] to-[#5F7F56] text-white text-xs font-semibold tracking-wider uppercase hover:from-[#2F3E2C] hover:to-[#4F6B47] transition-all shadow-sm cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-[#F4C9A8]" />
                <span>Book a Table</span>
              </button>
            </div>
          </div>

          {/* Right Column: Google Maps Embed (6 cols) */}
          <div className="lg:col-span-6 h-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.7 }}
              className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-[#EAEFE6] h-[480px] sm:h-[540px] group"
            >
              {/* Google Map iframe with light desaturating filter that becomes full colour on hover */}
              <iframe
                title="MESA Glasgow Location Map"
                src={BUSINESS_INFO.googleMapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full filter grayscale-[35%] contrast-[105%] group-hover:grayscale-0 transition-all duration-700"
              />

              {/* Map floating card info */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-[#FBF8F2]/90 backdrop-blur-md border border-[#2F3E2C]/10 shadow-lg flex items-center justify-between gap-3 text-xs text-[#2F3E2C]">
                <div>
                  <p className="font-serif italic text-base font-semibold">MESA Glasgow</p>
                  <p className="text-stone-500 text-[11px]">567 Duke St, Dennistoun, G31 1PY</p>
                </div>
                <a
                  href={BUSINESS_INFO.googleMapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-full bg-[#2F3E2C] text-[#FBF8F2] text-[11px] font-semibold tracking-wider uppercase hover:bg-[#4F6B47] transition-colors shrink-0"
                >
                  Navigate
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
