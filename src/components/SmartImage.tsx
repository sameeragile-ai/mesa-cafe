import React, { useState, useEffect, useRef } from 'react';

export const UNSPLASH_FALLBACKS: Record<string, string> = {
  'full-breakfast': 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1600&q=80',
  'pancakes': 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=1200&q=80',
  'tomato-toast': 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?auto=format&fit=crop&w=1200&q=80',
  'morning-roll': 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80',
  'coffee': 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80',
  'eggs-crumb': 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1200&q=80',
};

// Helper to deduce image key from path
function getFallbackKey(src: string): string | undefined {
  if (src.includes('full-breakfast')) return 'full-breakfast';
  if (src.includes('pancakes')) return 'pancakes';
  if (src.includes('tomato-toast')) return 'tomato-toast';
  if (src.includes('morning-roll')) return 'morning-roll';
  if (src.includes('booth-reel') || src.includes('coffee')) return 'coffee';
  if (src.includes('eggs-crumb')) return 'eggs-crumb';
  return undefined;
}

interface SmartImageProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  aspectRatio?: string;
  priority?: boolean;
  objectPosition?: string;
  sizes?: string;
  fallbackKey?: string;
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
  fallbackKey,
}) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [isLoaded, setIsLoaded] = useState(false);
  const [failedLocal, setFailedLocal] = useState(false);
  const [hasFatalError, setHasFatalError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Sync src if prop changes
  useEffect(() => {
    setCurrentSrc(src);
    setIsLoaded(false);
    setFailedLocal(false);
    setHasFatalError(false);
  }, [src]);

  // Fix cached image onLoad omission + safety timeout
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth > 0) {
      setIsLoaded(true);
    }

    // Safety timeout: if still not marked loaded after 2.5s but has naturalWidth, show it
    const timer = setTimeout(() => {
      if (imgRef.current && imgRef.current.naturalWidth > 0) {
        setIsLoaded(true);
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [currentSrc]);

  const handleError = () => {
    if (!failedLocal) {
      const key = fallbackKey || getFallbackKey(src);
      const fallbackUrl = key ? UNSPLASH_FALLBACKS[key] : null;

      if (fallbackUrl && fallbackUrl !== currentSrc) {
        if (import.meta.env?.DEV) {
          console.warn(
            `[MESA Image Fallback] Local image failed: "${src}". Falling back to Unsplash: "${fallbackUrl}"`
          );
        }
        setFailedLocal(true);
        setCurrentSrc(fallbackUrl);
        return;
      }
    }

    // If Unsplash fallback fails or no fallback is defined, trigger branded tile
    if (import.meta.env?.DEV) {
      console.warn(`[MESA Image Error] All image sources failed for: "${src}". Using branded gradient tile.`);
    }
    setHasFatalError(true);
  };

  return (
    <div className={`relative overflow-hidden bg-[#EAEFE6] ${aspectRatio} ${className}`}>
      {/* Soft sage -> peach shimmer skeleton */}
      {!isLoaded && !hasFatalError && (
        <div className="absolute inset-0 bg-gradient-to-tr from-[#DCE5D3] via-[#F6F1E7] to-[#F4C9A8]/30 animate-pulse pointer-events-none z-0" />
      )}

      {/* Main Image */}
      {!hasFatalError ? (
        <img
          ref={imgRef}
          src={currentSrc}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          sizes={sizes}
          style={{
            objectPosition,
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.4s ease-out, transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
          onLoad={() => setIsLoaded(true)}
          onError={handleError}
          className={`w-full h-full object-cover relative z-10 ${imgClassName}`}
        />
      ) : (
        /* Branded sage -> peach gradient tile with MESA logo */
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#4F6B47] to-[#2F3E2C] text-[#FBF8F2] text-center z-10">
          <img
            src="/images/mesa-logo.png"
            alt="MESA Glasgow logo"
            className="w-12 h-12 rounded-full object-cover mb-2 shadow-md border border-white/20"
          />
          <span className="font-serif italic text-lg tracking-wide text-[#FBF8F2]">MESA</span>
          <span className="text-[10px] uppercase tracking-widest text-[#DCE5D3]/80 mt-0.5">
            Duke Street · Glasgow
          </span>
        </div>
      )}
    </div>
  );
};
