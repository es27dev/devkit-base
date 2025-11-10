// CTA section block - displays multiple CTA cards in responsive grid layout
import { CTACard } from '@/components/blocks/cta-card/cta-card';
import { cn } from '@/shared/lib/utils';

// Types
import type { CTACardProps } from '@/components/blocks/cta-card/cta-card';

// Hooks
// Translations
// Data Loading
// Early Returns
// Computed Data
// Event Handlers
// Effects

export interface CTASectionProps {
  items: CTACardProps[];
  className?: string;
}

export function CTASection({ items, className }: CTASectionProps) {
  // 1. HOOKS
  // (none)

  // 2. TRANSLATIONS
  // (none - content via props)

  // 3. DATA LOADING
  // (passed via props)

  // 4. EARLY RETURNS
  if (!items || items.length === 0) {
    return null;
  }

  // 5. COMPUTED DATA
  const gridCols = items.length === 2
    ? 'grid-cols-1 md:grid-cols-2'
    : 'grid-cols-1 md:grid-cols-3';

  const maxWidth = items.length === 2
    ? 'max-w-2xl'  // Centered for 2 items
    : 'max-w-4xl'; // Full width for 3 items

  // 6. EVENT HANDLERS
  // (none)

  // 7. EFFECTS
  // (none)

  return (
    <section className={cn('container mx-auto px-4 py-16', className)}>
      <div className={cn('grid gap-8 mx-auto', gridCols, maxWidth)}>
        {items.map((item, index) => (
          <CTACard key={index} {...item} />
        ))}
      </div>
    </section>
  );
}
