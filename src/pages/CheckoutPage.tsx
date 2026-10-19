import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Clock,
  User,
  ShoppingBag,
  CreditCard,
  MapPin,
  ArrowRight,
  ChevronLeft,
  Check,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { PageTransition } from '../components/PageTransition';
import { useCart, formatCurrency } from '../context/CartContext';
import { getLiveStatus, getLondonNow } from '../lib/hours';
import { BUSINESS_INFO } from '../data/business';

const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Please enter your full name'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(8, 'Please enter a valid phone number'),
  collectionOption: z.string().min(1, 'Please select a collection time'),
  paymentMethod: z.enum(['COLLECTION', 'ONLINE']),
  orderNote: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export const CheckoutPage: React.FC = () => {
  const { items, subtotal, subtotalFormatted, orderNote, clearCart } = useCart();
  const navigate = useNavigate();
  const liveStatus = getLiveStatus();
  const londonNow = getLondonNow();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.title = 'Checkout – MESA Glasgow Click & Collect';
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Compute 15-minute collection slots
  const dayIndex = londonNow.getDay();
  const isSaturday = dayIndex === 6;
  const closeHour = isSaturday ? 15 : 15;
  const closeMinute = isSaturday ? 45 : 15;

  const currentMinutes = londonNow.getHours() * 60 + londonNow.getMinutes();
  const closingMinutes = closeHour * 60 + closeMinute;
  const openingMinutes = 9 * 60; // 09:00

  const isCurrentlyOpen =
    currentMinutes >= openingMinutes && currentMinutes < closingMinutes;

  // Available collection options
  const collectionOptions: { id: string; label: string }[] = [];

  if (isCurrentlyOpen) {
    collectionOptions.push({
      id: 'asap',
      label: 'ASAP (about 15–20 min)',
    });

    // Generate upcoming 15-min slots for today
    let slotMinutes = Math.ceil((currentMinutes + 20) / 15) * 15;
    while (slotMinutes <= closingMinutes) {
      const h = Math.floor(slotMinutes / 60);
      const m = slotMinutes % 60;
      const timeStr = `${h.toString().padStart(2, '0')}:${m
        .toString()
        .padStart(2, '0')}`;
      collectionOptions.push({
        id: timeStr,
        label: `Today at ${timeStr}`,
      });
      slotMinutes += 15;
    }
  } else {
    // Closed: generate slots for tomorrow
    let slotMinutes = 9 * 60 + 15; // 09:15
    const nextDayCloseMinutes = 15 * 60 + 30;
    while (slotMinutes <= nextDayCloseMinutes) {
      const h = Math.floor(slotMinutes / 60);
      const m = slotMinutes % 60;
      const timeStr = `${h.toString().padStart(2, '0')}:${m
        .toString()
        .padStart(2, '0')}`;
      collectionOptions.push({
        id: `tomorrow-${timeStr}`,
        label: `Tomorrow at ${timeStr}`,
      });
      slotMinutes += 15;
    }
  }

  const stripeLink = (import.meta as any).env?.VITE_STRIPE_PAYMENT_LINK;
  const formspreeId = (import.meta as any).env?.VITE_FORMSPREE_ID;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      collectionOption: collectionOptions[0]?.id || 'asap',
      paymentMethod: 'COLLECTION',
      orderNote: orderNote || '',
    },
  });

  const selectedPaymentMethod = watch('paymentMethod');
  const selectedCollectionOption = watch('collectionOption');

  if (items.length === 0) {
    return (
      <PageTransition>
        <div className="pt-36 pb-28 min-h-[80vh] flex flex-col items-center justify-center px-4 text-center bg-[#FBF8F2]">
          <ShoppingBag className="w-16 h-16 text-stone-300 mb-4" />
          <h2 className="font-serif italic text-3xl sm:text-4xl text-[#2F3E2C] mb-2">
            Your basket is empty.
          </h2>
          <p className="text-sm text-stone-600 max-w-sm mb-6">
            Add some freshly prepared brunch or specialty coffee before checking out.
          </p>
          <Link
            to="/order"
            className="px-7 py-3 rounded-full bg-[#2F3E2C] text-[#FBF8F2] text-xs font-semibold uppercase tracking-wider hover:bg-[#4F6B47] transition-colors"
          >
            Go to Online Ordering
          </Link>
        </div>
      </PageTransition>
    );
  }

  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true);
    const orderNumber = `MESA-${Math.floor(1000 + Math.random() * 9000)}`;

    const chosenOptionLabel =
      collectionOptions.find((c) => c.id === data.collectionOption)?.label ||
      data.collectionOption;

    const orderPayload = {
      orderNumber,
      customer: {
        name: data.fullName,
        email: data.email,
        phone: data.phone,
      },
      collectionTime: chosenOptionLabel,
      paymentMethod: data.paymentMethod,
      orderNote: data.orderNote,
      items: items.map((i) => ({
        name: i.product.name,
        quantity: i.quantity,
        modifiers: i.selectedModifiers.map((m) => `${m.groupName}: ${m.option.name}`),
        unitPrice: i.itemUnitPrice,
        lineTotal: i.totalPrice,
      })),
      total: subtotal,
      totalFormatted: subtotalFormatted,
      createdAt: new Date().toISOString(),
    };

    // Save order details to sessionStorage for the confirmation page
    sessionStorage.setItem('last_mesa_order', JSON.stringify(orderPayload));

    // If Formspree ID is set, dispatch
    if (formspreeId) {
      try {
        await fetch(`https://formspree.io/f/${formspreeId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderPayload),
        });
      } catch (e) {
        console.warn('Formspree dispatch error:', e);
      }
    }

    // If Stripe Payment Link is chosen, redirect to Stripe
    if (data.paymentMethod === 'ONLINE' && stripeLink) {
      clearCart();
      window.location.href = stripeLink;
      return;
    }

    // Otherwise clear cart and navigate to local confirmation page
    clearCart();
    navigate('/order/confirmed');
  };

  return (
    <PageTransition>
      <div className="pt-28 sm:pt-36 pb-28 bg-[#F6F1E7] min-h-screen">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              to="/order"
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-stone-600 hover:text-[#2F3E2C] mb-3 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Menu</span>
            </Link>
            <h1 className="font-serif text-4xl sm:text-5xl text-[#2F3E2C] tracking-tight">
              Collection Checkout
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Pick up from 567 Duke Street, Dennistoun.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Form Fields (7 cols) */}
              <div className="lg:col-span-7 space-y-8">
                {/* Step 1: Collection Time */}
                <div className="bg-[#FBF8F2] rounded-3xl p-6 sm:p-7 border border-[#2F3E2C]/10 shadow-xs space-y-4">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-[#2F3E2C]/10">
                    <Clock className="w-5 h-5 text-[#4F6B47]" />
                    <h2 className="font-serif italic text-2xl text-[#2F3E2C]">
                      1. Collection Time
                    </h2>
                  </div>

                  {!isCurrentlyOpen && (
                    <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold">We&apos;re closed right now</p>
                        <p className="text-amber-800 mt-0.5">
                          You can pre-order now for collection tomorrow morning when our kitchen reopens at 9:00 AM.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label
                      htmlFor="collectionOption"
                      className="block text-xs font-semibold uppercase tracking-wider text-[#2F3E2C]"
                    >
                      Choose Pick-up Window *
                    </label>
                    <select
                      id="collectionOption"
                      {...register('collectionOption')}
                      className="w-full px-4 py-3 rounded-2xl bg-white border border-[#2F3E2C]/15 focus:border-[#4F6B47] focus:ring-1 focus:ring-[#4F6B47] text-sm text-[#2F3E2C] outline-none transition-all cursor-pointer"
                    >
                      {collectionOptions.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Step 2: Customer Details */}
                <div className="bg-[#FBF8F2] rounded-3xl p-6 sm:p-7 border border-[#2F3E2C]/10 shadow-xs space-y-4">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-[#2F3E2C]/10">
                    <User className="w-5 h-5 text-[#4F6B47]" />
                    <h2 className="font-serif italic text-2xl text-[#2F3E2C]">
                      2. Your Contact Details
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="fullName"
                        className="block text-xs font-semibold uppercase tracking-wider text-[#2F3E2C] mb-1"
                      >
                        Full Name *
                      </label>
                      <input
                        id="fullName"
                        type="text"
                        placeholder="e.g. Fiona Campbell"
                        {...register('fullName')}
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#2F3E2C]/15 focus:border-[#4F6B47] focus:ring-1 focus:ring-[#4F6B47] text-sm text-[#2F3E2C] outline-none"
                      />
                      {errors.fullName && (
                        <p className="text-xs text-rose-600 mt-1">{errors.fullName.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-xs font-semibold uppercase tracking-wider text-[#2F3E2C] mb-1"
                        >
                          Email *
                        </label>
                        <input
                          id="email"
                          type="email"
                          placeholder="fiona@example.com"
                          {...register('email')}
                          className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#2F3E2C]/15 focus:border-[#4F6B47] focus:ring-1 focus:ring-[#4F6B47] text-sm text-[#2F3E2C] outline-none"
                        />
                        {errors.email && (
                          <p className="text-xs text-rose-600 mt-1">{errors.email.message}</p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-xs font-semibold uppercase tracking-wider text-[#2F3E2C] mb-1"
                        >
                          Mobile Phone *
                        </label>
                        <input
                          id="phone"
                          type="tel"
                          placeholder="07123 456789"
                          {...register('phone')}
                          className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#2F3E2C]/15 focus:border-[#4F6B47] focus:ring-1 focus:ring-[#4F6B47] text-sm text-[#2F3E2C] outline-none"
                        />
                        {errors.phone && (
                          <p className="text-xs text-rose-600 mt-1">{errors.phone.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="orderNote"
                        className="block text-xs font-semibold uppercase tracking-wider text-[#2F3E2C] mb-1"
                      >
                        Order Note / Dietary Requirements
                      </label>
                      <input
                        id="orderNote"
                        type="text"
                        placeholder="e.g. Extra hot flat white, allergy details"
                        {...register('orderNote')}
                        className="w-full px-4 py-2 rounded-xl bg-white border border-[#2F3E2C]/15 focus:border-[#4F6B47] text-sm text-[#2F3E2C] outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Step 3: Payment Method */}
                <div className="bg-[#FBF8F2] rounded-3xl p-6 sm:p-7 border border-[#2F3E2C]/10 shadow-xs space-y-4">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-[#2F3E2C]/10">
                    <CreditCard className="w-5 h-5 text-[#4F6B47]" />
                    <h2 className="font-serif italic text-2xl text-[#2F3E2C]">
                      3. Payment Method
                    </h2>
                  </div>

                  <div className="space-y-3">
                    {/* Pay on collection option (always available) */}
                    <label
                      onClick={() => setValue('paymentMethod', 'COLLECTION')}
                      className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                        selectedPaymentMethod === 'COLLECTION'
                          ? 'bg-[#2F3E2C] text-[#FBF8F2] border-[#2F3E2C] shadow-sm'
                          : 'bg-white text-[#2F3E2C] border-[#2F3E2C]/10 hover:border-[#4F6B47]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                            selectedPaymentMethod === 'COLLECTION'
                              ? 'border-white bg-[#4F6B47]'
                              : 'border-stone-300'
                          }`}
                        >
                          {selectedPaymentMethod === 'COLLECTION' && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <div>
                          <span className="font-semibold text-sm block">
                            Pay on Collection
                          </span>
                          <span
                            className={`text-xs ${
                              selectedPaymentMethod === 'COLLECTION'
                                ? 'text-[#DCE5D3]'
                                : 'text-stone-500'
                            }`}
                          >
                            Pay by card, contactless, or cash at the counter.
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-wider">
                        Free
                      </span>
                    </label>

                    {/* Pay Online with Stripe Link (if env is set) */}
                    {stripeLink && (
                      <label
                        onClick={() => setValue('paymentMethod', 'ONLINE')}
                        className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                          selectedPaymentMethod === 'ONLINE'
                            ? 'bg-[#2F3E2C] text-[#FBF8F2] border-[#2F3E2C] shadow-sm'
                            : 'bg-white text-[#2F3E2C] border-[#2F3E2C]/10 hover:border-[#4F6B47]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                              selectedPaymentMethod === 'ONLINE'
                                ? 'border-white bg-[#4F6B47]'
                                : 'border-stone-300'
                            }`}
                          >
                            {selectedPaymentMethod === 'ONLINE' && (
                              <Check className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <div>
                            <span className="font-semibold text-sm block">
                              Pay Online Now (Stripe)
                            </span>
                            <span
                              className={`text-xs ${
                                selectedPaymentMethod === 'ONLINE'
                                  ? 'text-[#DCE5D3]'
                                  : 'text-stone-500'
                              }`}
                            >
                              Instant checkout with Apple Pay, Google Pay, or Card.
                            </span>
                          </div>
                        </div>
                        <ExternalLink className="w-4 h-4 opacity-70" />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Order Review & Submit (5 cols) */}
              <div className="lg:col-span-5 sticky top-36">
                <div className="rounded-3xl bg-[#FBF8F2] border border-[#2F3E2C]/10 p-6 shadow-sm space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-[#2F3E2C]/10">
                    <h3 className="font-serif italic text-2xl text-[#2F3E2C]">
                      Order Summary
                    </h3>
                    <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-[#DCE5D3] text-[#2F3E2C]">
                      {items.length} {items.length === 1 ? 'item' : 'items'}
                    </span>
                  </div>

                  {/* Line items list */}
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 text-xs">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-start gap-3 py-1.5 border-b border-stone-100 last:border-b-0"
                      >
                        <div>
                          <div className="font-medium text-[#2F3E2C]">
                            {item.quantity}× {item.product.name}
                          </div>
                          {item.selectedModifiers.length > 0 && (
                            <div className="text-[10px] text-stone-500 mt-0.5">
                              {item.selectedModifiers
                                .map((m) => `${m.groupName}: ${m.option.name}`)
                                .join(' · ')}
                            </div>
                          )}
                        </div>
                        <span className="font-serif text-sm font-semibold text-[#2F3E2C] tabular-nums shrink-0">
                          {formatCurrency(item.totalPrice)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Pickup Location Info */}
                  <div className="p-3.5 rounded-2xl bg-[#F6F1E7] border border-[#2F3E2C]/8 text-xs text-[#2F3E2C] flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-[#4F6B47] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">MESA Glasgow</p>
                      <p className="text-stone-500 text-[11px]">567 Duke St, Dennistoun, G31 1PY</p>
                    </div>
                  </div>

                  {/* Total & Submit Button */}
                  <div className="pt-4 border-t border-[#2F3E2C]/10 space-y-4">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs uppercase tracking-wider text-stone-600 font-semibold">
                        Total Due
                      </span>
                      <span className="font-serif text-3xl font-semibold text-[#2F3E2C] tabular-nums">
                        {subtotalFormatted}
                      </span>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#4F6B47] to-[#2F3E2C] text-[#FBF8F2] text-xs font-semibold tracking-wider uppercase hover:from-[#2F3E2C] hover:to-[#4F6B47] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                    >
                      {isSubmitting ? (
                        <span>Processing Order...</span>
                      ) : (
                        <>
                          <span>Place Click &amp; Collect Order</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    <p className="text-[11px] text-stone-500 text-center">
                      Need to cancel or change something? Call {BUSINESS_INFO.phoneDisplay}.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </PageTransition>
  );
};
