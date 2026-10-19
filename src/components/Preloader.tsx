import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogoLines } from './LogoLines';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface PreloaderProps {
  onComplete?: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [shouldShow, setShouldShow] = useState(false);
  const [stage, setStage] = useState<'drawing' | 'resolve' | 'wipe' | 'done'>('drawing');
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const seen = sessionStorage.getItem('mesa_preloaded');
    if (seen) {
      if (onComplete) onComplete();
      return;
    }

    setShouldShow(true);

    if (prefersReduced) {
      const timer = setTimeout(() => {
        sessionStorage.setItem('mesa_preloaded', 'true');
        setStage('done');
        if (onComplete) onComplete();
      }, 500);
      return () => clearTimeout(timer);
    }

    // Stage progression: drawing -> resolve (circle + logo) -> wipe up
    const t1 = setTimeout(() => setStage('resolve'), 750);
    const t2 = setTimeout(() => setStage('wipe'), 1350);
    const t3 = setTimeout(() => {
      sessionStorage.setItem('mesa_preloaded', 'true');
      setStage('done');
      if (onComplete) onComplete();
    }, 1800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [prefersReduced, onComplete]);

  if (!shouldShow || stage === 'done') return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#FBF8F2] overflow-hidden"
        initial={{ y: 0 }}
        exit={{
          y: '-100%',
          transition: { duration: 0.65, ease: [0.77, 0, 0.175, 1] },
        }}
        animate={stage === 'wipe' ? { y: '-100%' } : { y: 0 }}
        transition={{ duration: 0.6, ease: [0.77, 0, 0.175, 1] }}
      >
        <div className="relative flex flex-col items-center">
          {/* Logo Container */}
          <div className="relative w-28 h-28 flex items-center justify-center">
            {/* SVG line drawing in stage 'drawing' */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 1 }}
              animate={{ opacity: stage === 'drawing' ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <LogoLines
                className="w-24 h-24"
                strokeColor="#4F6B47"
                strokeWidth={3}
                animateDraw={!prefersReduced}
              />
            </motion.div>

            {/* Circle scale-in behind and crossfade to real logo in stage 'resolve' */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: stage === 'resolve' || stage === 'wipe' ? 1 : 0,
                scale: stage === 'resolve' || stage === 'wipe' ? 1 : 0.8,
              }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <img
                src="/images/mesa-logo.png"
                alt="MESA Glasgow logo"
                className="w-24 h-24 rounded-full object-cover shadow-[0_6px_24px_rgba(47,62,44,0.18)]"
              />
            </motion.div>
          </div>

          {/* Wordmark */}
          <motion.div
            className="mt-6 flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <span className="font-serif italic text-2xl tracking-widest text-[#2F3E2C]">
              MESA
            </span>
            <span className="text-[10px] tracking-[0.28em] uppercase text-[#4F6B47] mt-1 font-medium">
              Glasgow · Duke Street
            </span>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
