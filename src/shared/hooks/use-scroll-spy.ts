import { useState, useEffect } from 'react';

/**
 * Hook for detecting active section via Intersection Observer
 *
 * @param sectionIds - Array of section IDs to observe
 * @returns Currently active section ID (null if none active)
 */
export function useScrollSpy(sectionIds: string[]): string | null {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    if (!sectionIds || sectionIds.length === 0) return;

    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (!element) {
        console.warn(`[useScrollSpy] Element with id "${id}" not found`);
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(entry.target.id);
            }
          });
        },
        {
          rootMargin: '-20% 0px -60% 0px',
          threshold: 0.1,
        }
      );

      observer.observe(element);
      observers.push(observer);
    });

    // Cleanup
    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, [sectionIds]);

  return activeSection;
}
