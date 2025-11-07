// T022: Customer logo wall block component - display customer logos in a responsive grid
import { CustomerLogo } from '@/shared/data/mock-customers';

// Hooks
// (none)

// Translations
// (none - minimal text, alt text provided by props)

// Data Loading
// (none - displays provided data)

// Early Returns
// (none)

// Computed Data
// (none)

// Event Handlers
// (none)

// Effects
// (none)

export interface CustomerLogoWallProps {
  logos: CustomerLogo[];
  className?: string;
  emptyMessage?: string;
}

export function CustomerLogoWall({
  logos,
  className = '',
  emptyMessage = 'Die Kundenlogos konnten nicht geladen werden'
}: CustomerLogoWallProps) {
  if (logos.length === 0) {
    return (
      <div className={`text-center text-muted-foreground py-8 ${className}`}>
        {emptyMessage}
      </div>
    );
  }

  const sortedLogos = [...logos].sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 items-center ${className}`}>
      {sortedLogos.map((logo) => (
        <div key={logo.id} className="flex justify-center">
          <img
            src={logo.logoUrl}
            alt={`${logo.companyName} Logo`}
            className="max-h-16 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
}