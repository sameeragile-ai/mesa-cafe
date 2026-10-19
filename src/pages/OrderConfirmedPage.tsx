import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Compass,
  ArrowRight,
  ShoppingBag,
  MessageSquare,
  Mail,
} from 'lucide-react';
import { PageTransition } from '../components/PageTransition';
import { BUSINESS_INFO } from '../data/business';
import { formatCurrency } from '../context/CartContext';

export const OrderConfirmedPage: React.FC = () => {
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    document.title = 'Order Confirmed – MESA Glasgow Click & Collect';
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#4F6B47', '#5F7F56', '#F4C9A8', '#DCE5D3'],
      });
    } catch {
      // No-op
    }

    try {
      const stored = sessionStorage.getItem('last_mesa_order');
      if (stored) {
        setOrderData(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Could not retrieve order details from sessionStorage', e);
    }
  }, []);

  const orderNumber = orderData?.orderNumber || 'MESA-4821';
  const customerName = orderData?.customer?.name || 'Guest';
  const collectionTime = orderData?.collectionTime || 'ASAP (about 15–20 min)';
  const totalFormatted = orderData?.totalFormatted || '£0.00';
  const items = orderData?.items || [];

  const summaryText = encodeURIComponent(
    `Hello MESA Glasgow, I have placed collection order #${orderNumber} for ${customerName}.\nCollection time: ${collectionTime}.\nThank you!`
  );
  const whatsappUrl = `https://wa.me/441417375011?text=${summaryText}`;
  const mailtoUrl = `mailto:hello@mesaglasgow.com?subject=Order%20${orderNumber}%20Confirmation&body=${summaryText}`;

  return (
    <PageTransition>
      <div className="pt-28 sm:pt-36 pb-28 bg-[#FBF8F2] min-h-screen">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          {/* Logo 64px above animated checkmark */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center mb-6"
          >
            <img
              src="/images/mesa-logo.png"
              alt="MESA Glasgow logo"
              className="w-16 h-16 rounded-full object-cover shadow-[0_6px_20px_rgba(47,62,44,0.18)] mb-4"
            />
            <div className="w-12 h-12 rounded-full bg-[#DCE5D3] text-[#2F3E2C] flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-[#4F6B47]" />
            </div>
          </motion.div>

          <span className="text-xs uppercase tracking-widest text-[#4F6B47] font-semibold mb-2 block">
            Order Confirmed · Click &amp; Collect
          </span>

          <h1 className="font-serif italic text-4xl sm:text-5xl text-[#2F3E2C] tracking-tight mb-2">
            We’ve got your order, {customerName}.
          </h1>

          <p className="text-sm text-stone-600 mb-6">
            Your ticket is with the kitchen. We&apos;ll have everything freshly prepared and packaged hot for your arrival.
          </p>

          {/* Order Details Card */}
          <div className="bg-[#F6F1E7] border border-[#2F3E2C]/10 rounded-3xl p-6 sm:p-8 text-left mb-8 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#2F3E2C]/10">
              <span className="text-xs uppercase tracking-wider text-stone-500 font-semibold">
                Order Reference
              </span>
              <span className="font-mono text-base font-bold text-[#2F3E2C] bg-white px-2.5 py-0.5 rounded-lg border border-[#2F3E2C]/10">
                #{orderNumber}
              </span>
            </div>

            <div className="flex items-center justify-between py-1">
              <div className="flex items-center gap-2 text-xs text-stone-600">
                <Clock className="w-4 h-4 text-[#4F6B47]" />
                <span className="font-semibold uppercase tracking-wider text-[#2F3E2C]">
                  Collection Time
                </span>
              </div>
              <span className="text-sm font-semibold text-[#4F6B47]">
                {collectionTime}
              </span>
            </div>

            {/* Items Summary */}
            {items.length > 0 && (
              <div className="pt-2 border-t border-[#2F3E2C]/10 space-y-2">
                <span className="text-xs uppercase tracking-wider text-stone-500 font-semibold block">
                  Items to Collect:
                </span>
                <div className="space-y-1.5 text-xs text-[#2F3E2C]">
                  {items.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between">
                      <span>
                        {item.quantity}× {item.name}
                      </span>
                      <span className="font-mono text-stone-600">
                        {formatCurrency(item.lineTotal)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-[#2F3E2C]/10">
              <span className="text-xs uppercase tracking-wider font-semibold text-stone-600">
                Total
              </span>
              <span className="font-serif text-2xl font-bold text-[#2F3E2C] tabular-nums">
                {totalFormatted}
              </span>
            </div>
          </div>

          {/* Collection Location Card with Directions Button */}
          <div className="bg-[#FBF8F2] border border-[#2F3E2C]/10 rounded-2xl p-5 mb-8 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#4F6B47] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-xs text-[#2F3E2C] uppercase tracking-wider">
                  Pick-up Location
                </p>
                <p className="font-medium text-sm text-[#2F3E2C]">
                  {BUSINESS_INFO.address}
                </p>
                <p className="text-xs text-stone-500 mt-0.5">
                  Walk right up to the front counter and give your order number.
                </p>
              </div>
            </div>

            <a
              href={BUSINESS_INFO.googleMapsDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#2F3E2C] text-[#FBF8F2] text-xs font-semibold uppercase tracking-wider hover:bg-[#4F6B47] transition-colors shrink-0 cursor-pointer shadow-xs"
            >
              <Compass className="w-4 h-4" />
              <span>Get Directions</span>
            </a>
          </div>

          {/* Direct channels backup */}
          <div className="flex items-center justify-center gap-4 text-xs text-stone-500 mb-8">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[#4F6B47] hover:underline font-medium"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Share to WhatsApp</span>
            </a>
            <span>·</span>
            <a
              href={mailtoUrl}
              className="inline-flex items-center gap-1.5 text-[#4F6B47] hover:underline font-medium"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email Copy</span>
            </a>
          </div>

          {/* Questions call link */}
          <p className="text-xs text-stone-500 mb-8">
            Questions about your order?{' '}
            <a
              href={BUSINESS_INFO.phoneTel}
              className="font-semibold text-[#2F3E2C] underline hover:text-[#4F6B47]"
            >
              Call {BUSINESS_INFO.phoneDisplay}
            </a>
          </p>

          <Link
            to="/"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[#2F3E2C] text-[#FBF8F2] text-xs font-semibold tracking-wider uppercase hover:bg-[#4F6B47] transition-all shadow-md cursor-pointer"
          >
            <span>Return to Home</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </PageTransition>
  );
};
