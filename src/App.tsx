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
import { HomePage } from './pages/HomePage';
import { MenuPage } from './pages/MenuPage';
import { BookPage } from './pages/BookPage';
import { NotFoundPage } from './pages/NotFoundPage';

function AppContent() {
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const location = useLocation();

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
      {/* Film grain texture overlay */}
      <div className="film-grain" aria-hidden="true" />

      {/* Interactive desktop-only custom cursor */}
      <CustomCursor />

      {/* First session visit animated preloader */}
      <Preloader />

      {/* Top announcement bar */}
      <AnnouncementBar onOpenBooking={handleOpenBooking} />

      {/* Sticky header navigation */}
      <Navbar onOpenBooking={handleOpenBooking} />

      {/* Main Routed Page Content */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<HomePage onOpenBooking={handleOpenBooking} />} />
            <Route path="/menu" element={<MenuPage onOpenBooking={handleOpenBooking} />} />
            <Route path="/book" element={<BookPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AnimatePresence>
      </main>

      {/* Global Booking Modal */}
      <BookingModal isOpen={bookingModalOpen} onClose={handleCloseBooking} />

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
      <AppContent />
    </BrowserRouter>
  );
}
