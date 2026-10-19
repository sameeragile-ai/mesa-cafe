import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { scrollToTarget } from './useSmoothScroll';

const NAVBAR_OFFSET = -76; // Offset equal to navbar height + margin

export function useNavigateToSection() {
  const location = useLocation();
  const navigate = useNavigate();

  const navigateToSection = useCallback(
    (sectionId: string, onAfterAction?: () => void) => {
      const targetHash = `#${sectionId}`;

      if (location.pathname === '/') {
        // Already on home page: smooth scroll directly
        scrollToTarget(targetHash, { offset: NAVBAR_OFFSET, duration: 1.2 });
        // Update URL hash quietly without push reload
        window.history.replaceState(null, '', targetHash);
        if (onAfterAction) onAfterAction();
      } else {
        // On another route: navigate to '/#sectionId'
        navigate(`/${targetHash}`);
        if (onAfterAction) onAfterAction();

        // The ScrollManager or Home page layout effect will execute the scroll on mount
      }
    },
    [location.pathname, navigate]
  );

  return navigateToSection;
}
