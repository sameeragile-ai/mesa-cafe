import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import { Preloader } from './components/Preloader';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Navbar } from './components/Navbar';
import { Footer } from './sections/Footer';
import { FloatingActionGroup } from './components/FloatingActionGroup';
import { BookingModal } from './components/BookingModal';
import { CustomCursor } from './components/CustomCursor';
import { ScrollManager } from './components/ScrollManager';
import { CartProvider, useCart } from './context/CartContext';
import { CartDrawer } from './components/CartDrawer';
import { CartToast } from './components/CartToast';
import { ItemModifierModal } from './components/ItemModifierModal';
import { HomePage } from './pages/HomePage';
import { MenuPage } from './pages/MenuPage';
import { BookPage } from './pages/BookPage';
import { OrderPage } from './pages/OrderPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmedPage } from './pages/OrderConfirmedPage';
import { NotFoundPage } from './pages/NotFoundPage';

function AppContent() {
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const location = useLocation();
  const { modifierModalProduct, isModifierModalOpen, closeModifierModal } = useCart();

  // Initialize Lenis smooth scroll
  useSmoothScroll();

  const handleOpenBooking = () => {
    setBookingModalOpen(true);
  };

  const handleCloseBooking = () => {
    setBookingModalOpen(false);
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-[#F6F1E7] text-[#1F2420]">
      {/* Scroll manager for Lenis and hash navigation */}
      <ScrollManager />

      {/* Film grain texture overlay (pointer-events: none) */}
      <div className="film-grain pointer-events-none" aria-hidden="true" />

      {/* Interactive desktop-only custom cursor */}
      <CustomCursor />

      {/* First session visit animated preloader (z-90, removed once done) */}
      <Preloader />

      {/* Top announcement bar */}
      <AnnouncementBar onOpenBooking={handleOpenBooking} />

      {/* Sticky header navigation (z-50) */}
      <Navbar onOpenBooking={handleOpenBooking} />

      {/* Main Routed Page Content */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<HomePage onOpenBooking={handleOpenBooking} />} />
            <Route path="/menu" element={<MenuPage onOpenBooking={handleOpenBooking} />} />
            <Route path="/order" element={<OrderPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-confirmed" element={<OrderConfirmedPage />} />
            <Route path="/book" element={<BookPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AnimatePresence>
      </main>

      {/* Global Booking Modal */}
      <BookingModal isOpen={bookingModalOpen} onClose={handleCloseBooking} />

      {/* Global Cart Drawer (z-70) */}
      <CartDrawer />

      {/* Item Customizer Modal */}
      <ItemModifierModal
        product={modifierModalProduct}
        isOpen={isModifierModalOpen}
        onClose={closeModifierModal}
      />

      {/* Cart Toast Notification */}
      <CartToast />

      {/* Bottom right floating action buttons (Call, Book, Directions) */}
      <FloatingActionGroup onOpenBooking={handleOpenBooking} />

      {/* Site Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </BrowserRouter>
  );
}
