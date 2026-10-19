import React from 'react';
import { PageTransition } from '../components/PageTransition';
import { HeroSection } from '../sections/HeroSection';
import { MarqueeStrip } from '../sections/MarqueeStrip';
import { StorySection } from '../sections/StorySection';
import { SignaturePlatesSection } from '../sections/SignaturePlatesSection';
import { MorningRollFeature } from '../sections/MorningRollFeature';
import { MenuPreviewSection } from '../sections/MenuPreviewSection';
import { GallerySection } from '../sections/GallerySection';
import { KindWordsSection } from '../sections/KindWordsSection';
import { VisitSection } from '../sections/VisitSection';
import { BookingCtaBand } from '../sections/BookingCtaBand';

interface HomePageProps {
  onOpenBooking: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onOpenBooking }) => {
  return (
    <PageTransition>
      <div className="w-full">
        {/* Hero Section */}
        <HeroSection onOpenBooking={onOpenBooking} />

        {/* Marquee Strip */}
        <MarqueeStrip />

        {/* 01 / Our Story */}
        <StorySection />

        {/* 02 / Signature Plates */}
        <SignaturePlatesSection />

        {/* 03 / The Morning Roll Spotlight */}
        <MorningRollFeature onOpenBooking={onOpenBooking} />

        {/* 04 / Menu Preview */}
        <MenuPreviewSection />

        {/* 05 / Gallery */}
        <GallerySection />

        {/* 06 / Kind Words */}
        <KindWordsSection />

        {/* 07 / Visit Us */}
        <VisitSection onOpenBooking={onOpenBooking} />

        {/* Booking CTA Band */}
        <BookingCtaBand onOpenBooking={onOpenBooking} />
      </div>
    </PageTransition>
  );
};
