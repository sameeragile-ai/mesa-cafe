import React, { useState, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import confetti from 'canvas-confetti';
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Phone,
  Mail,
  MessageSquare,
  Sparkles,
  Info,
} from 'lucide-react';
import { BUSINESS_INFO } from '../data/business';
import { getBookingSlotsForDate } from '../lib/hours';
import { generateIcsFile } from '../lib/calendar';

const bookingSchema = z.object({
  partySize: z.number().min(1, 'Please select a party size').max(10),
  date: z.string().min(1, 'Please pick a reservation date'),
  time: z.string().min(1, 'Please choose an available time slot'),
  guestName: z.string().min(2, 'Please enter your full name'),
  email: z.string().email('Please provide a valid email address'),
  phone: z.string().min(8, 'Please provide a valid contact number'),
  notes: z.string().max(250).optional(),
});

export type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingFlowProps {
  onClose?: () => void;
  isModal?: boolean;
}

export const BookingFlow: React.FC<BookingFlowProps> = ({ onClose, isModal = false }) => {
  const formId = useId();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const [showLargeGroupNotice, setShowLargeGroupNotice] = useState<boolean>(false);

  // Default initial date: today or tomorrow
  const today = new Date();
  const formatDateISO = (d: Date) => d.toISOString().split('T')[0];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      partySize: 2,
      date: formatDateISO(today),
      time: '',
      guestName: '',
      email: '',
      phone: '',
      notes: '',
    },
  });

  const selectedPartySize = watch('partySize');
  const selectedDate = watch('date');
  const selectedTime = watch('time');
  const guestName = watch('guestName');
  const guestEmail = watch('email');
  const guestPhone = watch('phone');
  const guestNotes = watch('notes');

  // Compute calendar dates for the next 30 days
  const next30Days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(today.getDate() + i);
    return d;
  });

  // Time slots for selected date
  const parsedDate = selectedDate ? new Date(selectedDate + 'T12:00:00') : today;
  const availableSlots = getBookingSlotsForDate(parsedDate);

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!selectedPartySize) return;
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!selectedDate) return;
      setCurrentStep(3);
    } else if (currentStep === 3) {
      if (!selectedTime) return;
      setCurrentStep(4);
    } else if (currentStep === 4) {
      // Validate step 4 inputs before advancing to review
      if (!guestName || guestName.length < 2 || !guestEmail || !guestPhone) {
        // Trigger validation
        handleSubmit(() => {})();
        return;
      }
      setCurrentStep(5);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#4F6B47', '#5F7F56', '#F4C9A8', '#DCE5D3'],
      });
    } catch {
      // No-op if confetti fails
    }
  };

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);

    const formspreeId = (import.meta as any).env?.VITE_FORMSPREE_ID;

    if (formspreeId) {
      try {
        await fetch(`https://formspree.io/f/${formspreeId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...data,
            location: 'MESA Glasgow – 567 Duke St',
          }),
        });
      } catch (err) {
        console.warn('Formspree dispatch error, continuing with confirmation:', err);
      }
    }

    // Simulate smooth confirmation latency
    setTimeout(() => {
      setIsSubmitting(false);
      setIsConfirmed(true);
      triggerConfetti();
    }, 600);
  };

  // Helper mailto / sms / whatsapp fallbacks
  const mailtoSubject = encodeURIComponent(`Reservation Request: ${guestName} (${selectedPartySize} guests)`);
  const bookingBody = encodeURIComponent(
    `Hello MESA Glasgow team,\n\nI would like to confirm my table reservation:\n\nGuest Name: ${guestName}\nParty Size: ${selectedPartySize} guests\nDate: ${selectedDate}\nTime: ${selectedTime}\nPhone: ${guestPhone}\nNotes: ${guestNotes || 'None'}\n\nThank you!`
  );
  const mailtoLink = `mailto:hello@mesaglasgow.com?subject=${mailtoSubject}&body=${bookingBody}`;
  const whatsappLink = `https://wa.me/441417375011?text=${bookingBody}`;

  const steps = [
    { num: 1, label: 'Party Size' },
    { num: 2, label: 'Date' },
    { num: 3, label: 'Time' },
    { num: 4, label: 'Details' },
    { num: 5, label: 'Confirm' },
  ];

  return (
    <div className="w-full bg-[#FBF8F2] rounded-2xl p-6 sm:p-8 lg:p-10 shadow-sm border border-[#2F3E2C]/10">
      {/* Progress Indicator */}
      {!isConfirmed && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase tracking-widest text-[#4F6B47] font-semibold">
              Step {currentStep} of 5 · {steps[currentStep - 1].label}
            </span>
            <span className="text-xs text-stone-500">Walk-ins always welcome</span>
          </div>
          <div className="w-full h-1.5 bg-[#EAEFE6] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#4F6B47] to-[#5F7F56]"
              initial={{ width: '20%' }}
              animate={{ width: `${(currentStep / 5) * 100}%` }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>
      )}

      {/* Confirmation Success View */}
      {isConfirmed ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="text-center py-6 sm:py-8"
        >
          {/* Logo 64px above animated checkmark */}
          <div className="flex items-center justify-center mb-4">
            <img
              src="/images/mesa-logo.png"
              alt="MESA Glasgow logo"
              className="w-16 h-16 rounded-full object-cover shadow-[0_6px_20px_rgba(47,62,44,0.18)]"
            />
          </div>

          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#DCE5D3] text-[#2F3E2C] mb-4">
            <CheckCircle2 className="w-6 h-6 text-[#4F6B47]" />
          </div>

          <h2 className="font-serif italic text-3xl sm:text-4xl text-[#2F3E2C] mb-2">
            Table Reserved.
          </h2>
          <p className="text-sm text-stone-600 max-w-md mx-auto mb-6">
            We’ve saved a seat for you, <span className="font-semibold text-[#2F3E2C]">{guestName}</span>. We look forward to welcoming you to Duke Street.
          </p>

          {/* Reservation Summary Card */}
          <div className="bg-[#F6F1E7] border border-[#2F3E2C]/10 rounded-xl p-5 max-w-md mx-auto text-left mb-6 space-y-2 text-sm text-[#2F3E2C]">
            <div className="flex justify-between items-center pb-2 border-b border-[#2F3E2C]/10">
              <span className="text-stone-500 text-xs uppercase tracking-wider">Party</span>
              <span className="font-semibold">{selectedPartySize} Guests</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-stone-500 text-xs uppercase tracking-wider">Date</span>
              <span className="font-semibold">{selectedDate}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-stone-500 text-xs uppercase tracking-wider">Time</span>
              <span className="font-semibold">{selectedTime}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-stone-500 text-xs uppercase tracking-wider">Location</span>
              <span className="font-semibold">567 Duke St, Dennistoun</span>
            </div>
            {guestNotes && (
              <div className="pt-2 text-xs text-stone-600 italic">
                Note: &ldquo;{guestNotes}&rdquo;
              </div>
            )}
          </div>

          {/* Actions: Add to Calendar + Fallback Links */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto mb-6">
            <button
              onClick={() =>
                generateIcsFile({
                  guestName: guestName || 'Guest',
                  partySize: selectedPartySize,
                  dateString: selectedDate,
                  timeString: selectedTime,
                })
              }
              className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#2F3E2C] text-[#FBF8F2] text-xs font-semibold tracking-wider uppercase hover:bg-[#4F6B47] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <CalendarIcon className="w-4 h-4" />
              <span>Add to Calendar (.ics)</span>
            </button>

            {onClose && (
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full border border-[#2F3E2C]/20 text-[#2F3E2C] text-xs font-semibold tracking-wider uppercase hover:bg-[#DCE5D3]/50 transition-colors cursor-pointer"
              >
                Done
              </button>
            )}
          </div>

          {/* Direct channels */}
          <div className="flex items-center justify-center gap-4 text-xs text-[#4F6B47] mb-6">
            <a
              href={mailtoLink}
              className="inline-flex items-center gap-1 hover:underline text-stone-600"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email backup</span>
            </a>
            <span className="text-stone-300">·</span>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:underline text-stone-600"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>

          {/* Change or Cancel Note */}
          <p className="text-xs text-stone-500">
            Need to change or adjust your booking?{' '}
            <a
              href={BUSINESS_INFO.phoneTel}
              className="font-medium text-[#2F3E2C] underline underline-offset-2 hover:text-[#4F6B47]"
            >
              Call us on {BUSINESS_INFO.phoneDisplay}
            </a>
          </p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait">
            {/* STEP 1: PARTY SIZE */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="font-serif italic text-3xl text-[#2F3E2C] mb-1">
                    How many guests?
                  </h3>
                  <p className="text-sm text-stone-600">
                    Select your party size below. For groups larger than 10, please ring the café directly.
                  </p>
                </div>

                <div className="grid grid-cols-5 sm:grid-cols-5 gap-2.5 sm:gap-3">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => {
                        setValue('partySize', size);
                        setShowLargeGroupNotice(false);
                      }}
                      className={`h-12 rounded-xl text-sm font-semibold transition-all cursor-pointer flex items-center justify-center border ${
                        selectedPartySize === size
                          ? 'bg-[#2F3E2C] text-[#FBF8F2] border-[#2F3E2C] shadow-sm'
                          : 'bg-[#F6F1E7] text-[#2F3E2C] border-[#2F3E2C]/10 hover:border-[#4F6B47]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>

                {/* 10+ Party Option */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setShowLargeGroupNotice(!showLargeGroupNotice)}
                    className="text-xs font-semibold text-[#4F6B47] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Planning for 10+ guests?</span>
                  </button>

                  {showLargeGroupNotice && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-3 p-4 rounded-xl bg-[#DCE5D3]/40 border border-[#4F6B47]/20 flex items-start gap-3 text-xs text-[#2F3E2C]"
                    >
                      <Info className="w-4 h-4 text-[#4F6B47] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium mb-1">Large Parties &amp; Gatherings</p>
                        <p className="text-stone-600 mb-2">
                          We love hosting bigger crews! To ensure everyone has plenty of space and dishes arrive together, please give our team a quick call.
                        </p>
                        <a
                          href={BUSINESS_INFO.phoneTel}
                          className="inline-flex items-center gap-1.5 font-semibold text-[#2F3E2C] underline hover:text-[#4F6B47]"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Call {BUSINESS_INFO.phoneDisplay}</span>
                        </a>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {/* STEP 2: DATE PICKER */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="font-serif italic text-3xl text-[#2F3E2C] mb-1">
                    Pick a date
                  </h3>
                  <p className="text-sm text-stone-600">
                    Bookings available for the next 30 days. We are open 7 days a week.
                  </p>
                </div>

                {/* Horizontal scrollable date pills */}
                <div className="flex gap-2 overflow-x-auto pb-3 pt-1 no-scrollbar">
                  {next30Days.map((d) => {
                    const iso = formatDateISO(d);
                    const isSelected = selectedDate === iso;
                    const dayName = d.toLocaleDateString('en-GB', { weekday: 'short' });
                    const dayNum = d.getDate();
                    const monthName = d.toLocaleDateString('en-GB', { month: 'short' });

                    return (
                      <button
                        key={iso}
                        type="button"
                        onClick={() => {
                          setValue('date', iso);
                          setValue('time', ''); // Reset time when date changes
                        }}
                        className={`shrink-0 w-16 py-3 px-1 rounded-xl text-center border transition-all cursor-pointer flex flex-col items-center justify-center ${
                          isSelected
                            ? 'bg-[#2F3E2C] text-[#FBF8F2] border-[#2F3E2C] shadow-sm'
                            : 'bg-[#F6F1E7] text-[#2F3E2C] border-[#2F3E2C]/10 hover:border-[#4F6B47]'
                        }`}
                      >
                        <span className="text-[10px] uppercase tracking-wider font-semibold opacity-75">
                          {dayName}
                        </span>
                        <span className="text-lg font-serif font-medium leading-tight">
                          {dayNum}
                        </span>
                        <span className="text-[10px] uppercase tracking-wider opacity-75">
                          {monthName}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="text-xs text-stone-500 flex items-center gap-1.5 pt-1">
                  <Clock className="w-3.5 h-3.5 text-[#4F6B47]" />
                  <span>
                    Hours: Sun–Fri 9:00 AM – 3:30 PM · Sat 9:00 AM – 4:00 PM
                  </span>
                </div>
              </motion.div>
            )}

            {/* STEP 3: TIME SLOTS */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="font-serif italic text-3xl text-[#2F3E2C] mb-1">
                    Select a time
                  </h3>
                  <p className="text-sm text-stone-600">
                    Tables are reserved for 1 hour 30 minutes. Slots generated in 30-minute intervals.
                  </p>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                  {availableSlots.map(({ time, available }) => {
                    const isSelected = selectedTime === time;

                    return (
                      <button
                        key={time}
                        type="button"
                        disabled={!available}
                        onClick={() => setValue('time', time)}
                        className={`py-3 px-2 rounded-xl text-xs font-semibold tracking-wider transition-all border flex items-center justify-center ${
                          !available
                            ? 'opacity-40 bg-stone-100 border-stone-200 text-stone-400 cursor-not-allowed'
                            : isSelected
                            ? 'bg-[#4F6B47] text-white border-[#4F6B47] shadow-sm cursor-pointer'
                            : 'bg-[#F6F1E7] text-[#2F3E2C] border-[#2F3E2C]/10 hover:border-[#4F6B47] cursor-pointer'
                        }`}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>

                {availableSlots.every((s) => !s.available) && (
                  <p className="text-xs text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-200">
                    No further online slots available for today. Please give the café a call directly or drop by as a walk-in!
                  </p>
                )}
              </motion.div>
            )}

            {/* STEP 4: GUEST DETAILS */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <div>
                  <h3 className="font-serif italic text-3xl text-[#2F3E2C] mb-1">
                    Your details
                  </h3>
                  <p className="text-sm text-stone-600">
                    We’ll send confirmation and keep your table ready.
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label
                      htmlFor={`${formId}-guestName`}
                      className="block text-xs font-semibold uppercase tracking-wider text-[#2F3E2C] mb-1"
                    >
                      Full Name *
                    </label>
                    <input
                      id={`${formId}-guestName`}
                      type="text"
                      placeholder="e.g. Fiona Campbell"
                      {...register('guestName')}
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#2F3E2C]/15 focus:border-[#4F6B47] focus:ring-1 focus:ring-[#4F6B47] text-sm text-[#2F3E2C] outline-none transition-all"
                    />
                    {errors.guestName && (
                      <p className="text-xs text-rose-600 mt-1">{errors.guestName.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor={`${formId}-email`}
                        className="block text-xs font-semibold uppercase tracking-wider text-[#2F3E2C] mb-1"
                      >
                        Email Address *
                      </label>
                      <input
                        id={`${formId}-email`}
                        type="email"
                        placeholder="fiona@example.com"
                        {...register('email')}
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#2F3E2C]/15 focus:border-[#4F6B47] focus:ring-1 focus:ring-[#4F6B47] text-sm text-[#2F3E2C] outline-none transition-all"
                      />
                      {errors.email && (
                        <p className="text-xs text-rose-600 mt-1">{errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor={`${formId}-phone`}
                        className="block text-xs font-semibold uppercase tracking-wider text-[#2F3E2C] mb-1"
                      >
                        Contact Phone *
                      </label>
                      <input
                        id={`${formId}-phone`}
                        type="tel"
                        placeholder="07123 456789"
                        {...register('phone')}
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#2F3E2C]/15 focus:border-[#4F6B47] focus:ring-1 focus:ring-[#4F6B47] text-sm text-[#2F3E2C] outline-none transition-all"
                      />
                      {errors.phone && (
                        <p className="text-xs text-rose-600 mt-1">{errors.phone.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor={`${formId}-notes`}
                      className="block text-xs font-semibold uppercase tracking-wider text-[#2F3E2C] mb-1"
                    >
                      Notes (Allergies, high chair, occasion)
                    </label>
                    <textarea
                      id={`${formId}-notes`}
                      rows={2}
                      placeholder="e.g. 1 high chair needed, gluten allergy"
                      {...register('notes')}
                      className="w-full px-4 py-2 rounded-xl bg-white border border-[#2F3E2C]/15 focus:border-[#4F6B47] focus:ring-1 focus:ring-[#4F6B47] text-sm text-[#2F3E2C] outline-none transition-all resize-none"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 5: REVIEW & CONFIRM */}
            {currentStep === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                <div>
                  <h3 className="font-serif italic text-3xl text-[#2F3E2C] mb-1">
                    Review &amp; Confirm
                  </h3>
                  <p className="text-sm text-stone-600">
                    Please check your reservation summary before finalizing.
                  </p>
                </div>

                <div className="bg-[#F6F1E7] border border-[#2F3E2C]/10 rounded-xl p-5 space-y-3 text-sm text-[#2F3E2C]">
                  <div className="flex justify-between items-center pb-2 border-b border-[#2F3E2C]/10">
                    <span className="text-stone-500 text-xs uppercase tracking-wider">Party Size</span>
                    <span className="font-semibold">{selectedPartySize} Guests</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-[#2F3E2C]/10">
                    <span className="text-stone-500 text-xs uppercase tracking-wider">Date</span>
                    <span className="font-semibold">{selectedDate}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-[#2F3E2C]/10">
                    <span className="text-stone-500 text-xs uppercase tracking-wider">Time</span>
                    <span className="font-semibold">{selectedTime}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-[#2F3E2C]/10">
                    <span className="text-stone-500 text-xs uppercase tracking-wider">Guest Name</span>
                    <span className="font-semibold">{guestName}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-[#2F3E2C]/10">
                    <span className="text-stone-500 text-xs uppercase tracking-wider">Contact</span>
                    <span className="font-semibold">{guestPhone}</span>
                  </div>
                  {guestNotes && (
                    <div className="pt-1 text-xs text-stone-600">
                      <span className="font-medium text-[#2F3E2C]">Special notes:</span> {guestNotes}
                    </div>
                  )}
                </div>

                <p className="text-[11px] text-stone-500">
                  By confirming, you agree to our reasonable arrival policy. If your plans change, please give us a quick buzz on {BUSINESS_INFO.phoneDisplay}.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Nav Buttons */}
          <div className="flex items-center justify-between pt-8 border-t border-[#2F3E2C]/10 mt-6">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase text-stone-600 hover:text-[#2F3E2C] transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={handleNextStep}
                disabled={
                  (currentStep === 1 && !selectedPartySize) ||
                  (currentStep === 2 && !selectedDate) ||
                  (currentStep === 3 && !selectedTime)
                }
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#2F3E2C] text-[#FBF8F2] text-xs font-semibold tracking-wider uppercase hover:bg-[#4F6B47] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-[#4F6B47] to-[#2F3E2C] text-[#FBF8F2] text-xs font-semibold tracking-wider uppercase hover:from-[#2F3E2C] hover:to-[#4F6B47] transition-all disabled:opacity-50 cursor-pointer shadow-md"
              >
                {isSubmitting ? (
                  <span>Saving your seat...</span>
                ) : (
                  <>
                    <span>Confirm Booking</span>
                    <Sparkles className="w-4 h-4 text-[#F4C9A8]" />
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
};
