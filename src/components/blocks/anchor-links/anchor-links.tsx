import { useTranslation } from 'react-i18next';
import type { AnchorLinksProps } from '@/shared/types/page-config';

/**
 * Horizontal anchor navigation component for desktop
 * Displays clickable anchor links that smoothly scroll to page sections
 */
export function AnchorLinks({ anchors, activeId, className = '' }: AnchorLinksProps) {
  const { t } = useTranslation();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      // Update URL hash without adding to history
      window.history.replaceState(null, '', `#${sectionId}`);
    }
  };

  return (
    <nav className={`border-b bg-muted/20 ${className}`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex gap-4 justify-center flex-wrap">
          {anchors.map((anchor) => (
            <button
              key={anchor.id}
              onClick={() => scrollToSection(anchor.id)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeId === anchor.id
                  ? 'text-[#C41E3A] bg-background'
                  : 'text-muted-foreground hover:text-foreground hover:bg-background'
              }`}
              aria-current={activeId === anchor.id ? 'true' : undefined}
            >
              {anchor.i18nKey ? t(anchor.i18nKey) : anchor.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
