import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { scrollToTarget } from '../hooks/useSmoothScroll';

const NAVBAR_OFFSET = -76;

export function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Delay slightly for DOM / image layout to settle
      const timeout = setTimeout(() => {
        scrollToTarget(hash, { offset: NAVBAR_OFFSET, duration: 1.2 });
      }, 150);
      return () => clearTimeout(timeout);
    } else {
      // No hash: scroll to top on route change
      window.scrollTo(0, 0);
      scrollToTarget('body', { offset: 0, duration: 0.1, immediate: true });
    }
  }, [pathname, hash]);

  return null;
}
