// T026: Hero section block component with variants for different page types
import { Button } from '@/components/base/button';

// Hooks
// (none)

// Translations
// (none - content provided via props)

// Data Loading
// (none - static content)

// Early Returns
// (none)

// Computed Data
// (none)

// Event Handlers
// (none)

// Effects
// (none)

export interface HeroSectionProps {
  title: string;
  subtitle?: string;
  description?: string;
  backgroundImage?: string;
  variant?: 'default' | 'landing' | 'sales' | 'about' | 'career';
  primaryButton?: {
    text: string;
    href: string;
    onClick?: () => void;
  };
  secondaryButton?: {
    text: string;
    href: string;
    onClick?: () => void;
  };
  className?: string;
}

export function HeroSection({
  title,
  subtitle,
  description,
  backgroundImage,
  variant = 'default',
  primaryButton,
  secondaryButton,
  className = ''
}: HeroSectionProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'landing':
        return 'bg-gradient-to-br from-primary/5 via-background to-primary/10 py-20 lg:py-32';
      case 'sales':
        return 'bg-gradient-to-r from-primary/10 to-secondary/10 py-16 lg:py-24';
      case 'about':
        return 'bg-gradient-to-bl from-muted/50 to-background py-16 lg:py-20';
      case 'career':
        return 'bg-gradient-to-tr from-accent/20 to-background py-16 lg:py-20';
      default:
        return 'bg-background py-16 lg:py-20';
    }
  };

  const getTitleClasses = () => {
    switch (variant) {
      case 'landing':
        return 'text-4xl sm:text-5xl lg:text-6xl font-bold';
      case 'sales':
        return 'text-3xl sm:text-4xl lg:text-5xl font-bold';
      default:
        return 'text-3xl sm:text-4xl lg:text-5xl font-bold';
    }
  };

  const handleButtonClick = (button?: { href: string; onClick?: () => void }) => {
    if (!button) return;

    if (button.onClick) {
      button.onClick();
    } else if (button.href.startsWith('#')) {
      // Anchor link - smooth scroll
      const element = document.querySelector(button.href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (button.href.startsWith('http')) {
      // External link
      window.open(button.href, '_blank', 'noopener,noreferrer');
    } else {
      // Internal navigation
      window.location.href = button.href;
    }
  };

  return (
    <section
      className={`relative ${getVariantClasses()} ${className}`}
      style={backgroundImage ? {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      } : undefined}
    >
      {backgroundImage && (
        <div className="absolute inset-0 bg-background/80" />
      )}

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          {subtitle && (
            <div className="text-sm font-medium text-primary uppercase tracking-wide">
              {subtitle}
            </div>
          )}

          <h1 className={`${getTitleClasses()} text-foreground`}>
            {title}
          </h1>

          {description && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {description}
            </p>
          )}

          {(primaryButton || secondaryButton) && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              {primaryButton && (
                <Button
                  onClick={() => handleButtonClick(primaryButton)}
                  size="lg"
                  className="px-8"
                >
                  {primaryButton.text}
                </Button>
              )}
              {secondaryButton && (
                <Button
                  onClick={() => handleButtonClick(secondaryButton)}
                  variant="outline"
                  size="lg"
                  className="px-8"
                >
                  {secondaryButton.text}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}