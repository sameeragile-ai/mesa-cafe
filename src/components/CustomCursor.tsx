import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const CustomCursor: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [cursorType, setCursorType] = useState<'default' | 'view' | 'book' | 'hover'>('default');
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Only enable on desktop pointer devices
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    if (!finePointer) {
      setIsTouchDevice(true);
      return;
    }
    setIsTouchDevice(false);

    const onMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const cursorTarget = target.closest('[data-cursor]') as HTMLElement | null;
      if (cursorTarget) {
        const val = cursorTarget.getAttribute('data-cursor');
        if (val === 'view' || val === 'book') {
          setCursorType(val);
          return;
        }
      }

      if (target.closest('button, a, input, select, textarea, [role="button"]')) {
        setCursorType('hover');
      } else {
        setCursorType('default');
      }
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, [isVisible]);

  if (isTouchDevice || !isVisible) return null;

  const isTextBadge = cursorType === 'view' || cursorType === 'book';

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] flex items-center justify-center font-sans"
      style={{
        transform: `translate3d(${mousePos.x}px, ${mousePos.y}px, 0)`,
      }}
      initial={false}
      animate={{
        width: isTextBadge ? 58 : cursorType === 'hover' ? 24 : 10,
        height: isTextBadge ? 58 : cursorType === 'hover' ? 24 : 10,
        x: isTextBadge ? -29 : cursorType === 'hover' ? -12 : -5,
        y: isTextBadge ? -29 : cursorType === 'hover' ? -12 : -5,
        backgroundColor: isTextBadge
          ? '#2F3E2C'
          : cursorType === 'hover'
          ? 'rgba(95, 127, 86, 0.25)'
          : '#4F6B47',
        border: cursorType === 'hover' ? '1.5px solid #4F6B47' : 'none',
        borderRadius: '9999px',
        color: '#FBF8F2',
      }}
      transition={{
        type: 'spring',
        damping: 24,
        stiffness: 300,
        mass: 0.2,
      }}
    >
      {isTextBadge && (
        <span className="text-[11px] font-medium tracking-wider uppercase select-none">
          {cursorType === 'view' ? 'View' : 'Book'}
        </span>
      )}
    </motion.div>
  );
};
