import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface SmartImageProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  aspectRatio?: string; // e.g. 'aspect-[4/3]', 'aspect-[1/1]', 'aspect-[3/4]'
  priority?: boolean;
  objectPosition?: string;
  sizes?: string;
}

export const SmartImage: React.FC<SmartImageProps> = ({
  src,
  alt,
  className = '',
  imgClassName = '',
  aspectRatio = 'aspect-[4/3]',
  priority = false,
  objectPosition = 'center center',
  sizes,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div
      className={`relative overflow-hidden bg-[#EAEFE6] ${aspectRatio} ${className}`}
    >
      {/* Soft sage -> peach shimmer loading skeleton */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-tr from-[#DCE5D3] via-[#F6F1E7] to-[#F4C9A8]/40 animate-pulse" />
      )}

      {/* Main Image */}
      {!hasError ? (
        <motion.img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          referrerPolicy="no-referrer"
          fetchPriority={priority ? 'high' : 'auto'}
          sizes={sizes}
          style={{ objectPosition }}
          initial={{ opacity: 0, filter: 'blur(8px)' }}
          animate={{
            opacity: isLoaded ? 1 : 0,
            filter: isLoaded ? 'blur(0px)' : 'blur(8px)',
          }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`w-full h-full object-cover transition-transform duration-700 ease-out ${imgClassName}`}
        />
      ) : (
        /* Resilient fallback tile: sage gradient tile with 48px MESA logo */
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#4F6B47] to-[#2F3E2C] text-[#FBF8F2] text-center">
          <img
            src="/images/mesa-logo.png"
            alt="MESA Glasgow logo"
            className="w-12 h-12 rounded-full object-cover mb-3 shadow-md border border-white/20"
          />
          <span className="font-serif italic text-lg tracking-wide text-[#FBF8F2]">MESA</span>
          <span className="text-[11px] uppercase tracking-widest text-[#DCE5D3]/80 mt-1">
            Duke Street · Glasgow
          </span>
        </div>
      )}
    </div>
  );
};
