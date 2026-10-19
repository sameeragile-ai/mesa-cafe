import { useEffect } from 'react';
import Lenis from 'lenis';
import { useReducedMotion } from './useReducedMotion';

let globalLenis: Lenis | null = null;

export function getLenis(): Lenis | null {
  return globalLenis;
}

export function stopLenis() {
  globalLenis?.stop();
}

export function startLenis() {
  globalLenis?.start();
}

export function scrollToTarget(
  target: string | HTMLElement,
  options: { offset?: number; duration?: number; immediate?: boolean } = {}
) {
  const { offset = -76, duration = 1.2, immediate = false } = options;

  if (globalLenis) {
    globalLenis.scrollTo(target, {
      offset,
      duration: immediate ? 0 : duration,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      immediate,
    });
    return;
  }

  // Fallback if Lenis is not available
  const element =
    typeof target === 'string'
      ? document.querySelector<HTMLElement>(target)
      : target;

  if (element) {
    const y = element.getBoundingClientRect().top + window.pageYOffset + offset;
    window.scrollTo({
      top: y,
      behavior: immediate ? 'auto' : 'smooth',
    });
  }
}

export function useSmoothScroll() {
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced || typeof window === 'undefined') {
      globalLenis = null;
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,
    });

    globalLenis = lenis;

    let animationFrameId: number;

    function raf(time: number) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }

    animationFrameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
      globalLenis = null;
    };
  }, [prefersReduced]);
}
