// T010: Anchor scroll hook for smooth navigation between page sections
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useAnchorScroll = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      // Remove the # from the hash
      const elementId = location.hash.substring(1);
      const element = document.getElementById(elementId);

      if (element) {
        // Smooth scroll to the element
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest'
        });
      } else {
        // FR-050: Scroll to top silently if anchor doesn't exist
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    }
  }, [location.hash]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);

    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });

      // Update URL without triggering navigation
      window.history.pushState(null, '', `#${sectionId}`);
    } else {
      // FR-050: Scroll to top silently if anchor doesn't exist
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  return { scrollToSection };
};