import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Instagram, ArrowUpRight, ZoomIn } from 'lucide-react';
import { IMAGES, ImageAsset } from '../data/images';
import { BUSINESS_INFO } from '../data/business';
import { SmartImage } from '../components/SmartImage';
import { Lightbox } from '../components/Lightbox';

export const GallerySection: React.FC = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  // Array of all 12 client photos (excluding the standalone logo)
  const galleryItems: { key: string; asset: ImageAsset }[] = [
    { key: 'tomatoToast', asset: IMAGES.tomatoToast },
    { key: 'fullBreakfast', asset: IMAGES.fullBreakfast },
    { key: 'morningRoll', asset: IMAGES.morningRoll },
    { key: 'pancakes', asset: IMAGES.pancakes },
    { key: 'slawSandwich', asset: IMAGES.slawSandwich },
    { key: 'hamSandwich', asset: IMAGES.hamSandwich },
    { key: 'founders', asset: IMAGES.founders },
    { key: 'bakedEggs', asset: IMAGES.bakedEggs },
    { key: 'eggsCrumb', asset: IMAGES.eggsCrumb },
    { key: 'boothReel', asset: IMAGES.boothReel },
    { key: 'streetSandwich', asset: IMAGES.streetSandwich },
    { key: 'peaches', asset: IMAGES.peaches },
  ];

  const handleOpenPhoto = (index: number) => {
    setActivePhotoIndex(index);
    setLightboxOpen(true);
  };

  return (
    <section id="gallery" className="py-24 sm:py-32 bg-[#F6F1E7] relative scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Instagram Profile Header Lockup */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 pb-8 border-b border-[#2F3E2C]/10">
          <div className="flex items-center gap-4">
            {/* Real Logo in circular frame */}
            <div className="relative">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full p-[2px] bg-gradient-to-tr from-[#C9774F] via-[#F4C9A8] to-[#4F6B47]">
                <img
                  src="/images/mesa-logo.png"
                  alt="MESA Glasgow logo"
                  className="w-full h-full rounded-full object-cover border-2 border-[#F6F1E7]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif italic text-2xl sm:text-3xl text-[#2F3E2C]">
                  {BUSINESS_INFO.instagramHandle}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#DCE5D3] text-[#2F3E2C]">
                  Verified
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-stone-600 mt-1">
                <span className="font-semibold text-[#2F3E2C]">21.3K followers</span>
                <span>·</span>
                <span>Fresh from Duke Street</span>
              </div>
            </div>
          </div>

          <a
            href={BUSINESS_INFO.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#2F3E2C] text-[#FBF8F2] text-xs font-semibold tracking-wider uppercase hover:bg-[#4F6B47] transition-all shadow-sm group cursor-pointer w-fit"
          >
            <Instagram className="w-4 h-4 text-[#F4C9A8]" />
            <span>Follow us on Instagram</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>

        {/* 12-Photo Grid with Hover Zoom & View State */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {galleryItems.map((item, index) => (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ delay: (index % 4) * 0.08, duration: 0.5 }}
              onClick={() => handleOpenPhoto(index)}
              data-cursor="view"
              className="group relative rounded-2xl overflow-hidden aspect-square bg-[#EAEFE6] cursor-pointer shadow-sm hover:shadow-xl transition-shadow"
            >
              <SmartImage
                src={item.asset.src}
                alt={item.asset.alt}
                aspectRatio="aspect-square"
                className="w-full h-full"
                imgClassName="group-hover:scale-110 transition-transform duration-700 ease-out"
              />

              {/* Hover overlay with Instagram icon & subtle caption */}
              <div className="absolute inset-0 bg-[#2F3E2C]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-white text-center">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center mb-2 transform scale-90 group-hover:scale-100 transition-transform">
                  <ZoomIn className="w-5 h-5 text-white" />
                </div>
                <p className="font-serif italic text-sm text-white line-clamp-2">
                  {item.asset.title}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Accessible Lightbox Modal */}
      <Lightbox
        images={galleryItems}
        currentIndex={activePhotoIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onSelectIndex={(idx) => setActivePhotoIndex(idx)}
      />
    </section>
  );
};
