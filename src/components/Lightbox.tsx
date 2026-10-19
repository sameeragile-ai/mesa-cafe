import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Instagram } from 'lucide-react';
import { ImageAsset } from '../data/images';
import { BUSINESS_INFO } from '../data/business';

interface LightboxProps {
  images: { key: string; asset: ImageAsset }[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onSelectIndex: (index: number) => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  images,
  currentIndex,
  isOpen,
  onClose,
  onSelectIndex,
}) => {
  const current = images[currentIndex]?.asset;

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onSelectIndex((currentIndex + 1) % images.length);
      if (e.key === 'ArrowLeft') onSelectIndex((currentIndex - 1 + images.length) % images.length);
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, currentIndex, images.length, onClose, onSelectIndex]);

  if (!isOpen || !current) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
        {/* Backdrop */}
        <motion.div
          className="fixed inset-0 bg-[#1F2420]/90 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close photo viewer"
          className="absolute top-5 right-5 z-50 p-2.5 rounded-full bg-[#2F3E2C]/80 text-[#FBF8F2] hover:bg-[#4F6B47] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Previous Button */}
        <button
          onClick={() => onSelectIndex((currentIndex - 1 + images.length) % images.length)}
          aria-label="Previous photo"
          className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-[#2F3E2C]/80 text-[#FBF8F2] hover:bg-[#4F6B47] transition-colors cursor-pointer hidden sm:flex items-center justify-center"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Next Button */}
        <button
          onClick={() => onSelectIndex((currentIndex + 1) % images.length)}
          aria-label="Next photo"
          className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-[#2F3E2C]/80 text-[#FBF8F2] hover:bg-[#4F6B47] transition-colors cursor-pointer hidden sm:flex items-center justify-center"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Modal Container */}
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.94 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative max-w-4xl w-full z-10 flex flex-col items-center"
        >
          <div className="relative max-h-[75vh] rounded-2xl overflow-hidden shadow-2xl bg-[#2F3E2C] border border-white/10">
            <img
              src={current.src}
              alt={current.alt}
              className="max-h-[72vh] w-auto max-w-full object-contain mx-auto"
            />
          </div>

          {/* Caption & Instagram credit */}
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between w-full text-center sm:text-left gap-2 px-2 text-[#FBF8F2]">
            <div>
              <h4 className="font-serif italic text-xl text-[#FBF8F2]">{current.title}</h4>
              {current.caption && (
                <p className="text-xs text-[#DCE5D3]/90 mt-0.5 max-w-xl">{current.caption}</p>
              )}
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <span className="text-xs font-mono text-stone-400">
                {currentIndex + 1} / {images.length}
              </span>
              <a
                href={BUSINESS_INFO.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-colors"
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>@mesa_glasgow</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
